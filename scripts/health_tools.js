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
              
              <!-- Pure SVG Multi-Segment Spectrum Gauge -->
              <div id="bmiSvgContainer" style="width: 100%; overflow-x: auto; margin: 0.5rem 0 1rem;">
                <!-- Dynamically drawn by drawBmiSvg -->
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

          <!-- 5 Fatal BMI Traps & Biometric Math Pitfalls -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal BMI Traps &amp; Biometric Math Pitfalls</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
              While BMI is a widely used population screening tool, relying on it blindly without understanding clinical nuances leads to severe misdiagnoses:
            </p>

            <div style="display: grid; gap: 1rem;">
              <div style="border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">1. The Muscular Athlete &amp; Bodybuilder False Positive</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Quetelet BMI measures gross body weight divided by height squared without distinguishing between dense skeletal muscle and adipose tissue. Because muscle is approximately 18% denser than fat, strength athletes, bodybuilders, and rugby players frequently register as 'Overweight' (BMI 26–29) or 'Obese' (BMI &ge; 30) despite having sub-12% body fat and pristine metabolic health.
                </p>
              </div>

              <div style="border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">2. Sarcopenic Obesity &amp; The 'Normal Weight Obesity' Trap</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  As adults age or remain sedentary, skeletal muscle degrades (sarcopenia) and is quietly replaced by visceral adipose tissue. An individual can maintain an ostensibly 'ideal' BMI of 21.5 while carrying 35%+ body fat, suffering from insulin resistance, elevated triglycerides, and chronic systemic inflammation without ever triggering a clinical BMI alert.
                </p>
              </div>

              <div style="border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">3. The 2D vs. 3D Mathematical Scaling Flaw</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  In 1832, Adolphe Quetelet devised BMI dividing weight by height squared (h²), mathematically treating humans as 2-dimensional flat planes. As Oxford mathematician Nick Trefethen proved, 3-dimensional human volumetric mass scales closer to height^2.5 or height^3. As a result, standard BMI systematically misclassifies tall individuals as fatter than they are, and short individuals as leaner than they are.
                </p>
              </div>

              <div style="border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">4. The Visceral Adiposity Blind Spot (Ignoring Waist-to-Height Ratio)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Subcutaneous fat stored on hips and thighs carries minimal cardiometabolic risk compared to ectopic visceral fat packed around the liver, pancreas, and heart. In 2022, the UK National Institute for Health and Care Excellence (NICE) officially mandated Waist-to-Height Ratio (WHtR) alongside BMI: your waist circumference must remain below half your height (&lt; 0.50).
                </p>
              </div>

              <div style="border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">5. Ethnic Disparity &amp; Premature Metabolic Disease Cutoffs</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Standard WHO cutoffs (25.0 overweight, 30.0 obese) were derived predominantly from Caucasian populations. Extensive clinical trials demonstrate that individuals of South Asian, East Asian, and African ancestry experience severe insulin resistance, type 2 diabetes, and coronary artery disease at significantly lower BMIs. For Asian adults, WHO recommends overweight thresholds at BMI &ge; 23.0 and obesity at BMI &ge; 27.5.
                </p>
              </div>
            </div>
          </div></div>

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
            if (document.getElementById('bmi-needle')) {
              document.getElementById('bmi-needle').style.left = Math.min(98, Math.max(2, gaugePct)) + '%';
            }
            drawBmiSvg(bmi);
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

          
      function drawBmiSvg(bmi) {
        var container = document.getElementById('bmiSvgContainer');
        if (!container) return;

        var minBmi = 15;
        var maxBmi = 40;
        var width = 640;
        var clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmi));
        var userX = 40 + ((clampedBmi - minBmi) / (maxBmi - minBmi)) * (width - 80);

        var x18 = 40 + ((18.5 - minBmi) / (maxBmi - minBmi)) * (width - 80);
        var x25 = 40 + ((25.0 - minBmi) / (maxBmi - minBmi)) * (width - 80);
        var x30 = 40 + ((30.0 - minBmi) / (maxBmi - minBmi)) * (width - 80);
        var x35 = 40 + ((35.0 - minBmi) / (maxBmi - minBmi)) * (width - 80);

        var svg = 
          '<svg viewBox="0 0 640 95" style="width: 100%; height: auto; display: block; font-family: var(--mono);" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Spectrum Bands -->' +
            '<rect x="40" y="25" width="' + (x18 - 40) + '" height="24" rx="3" fill="#3b82f6" />' +
            '<rect x="' + x18 + '" y="25" width="' + (x25 - x18) + '" height="24" fill="#10b981" />' +
            '<rect x="' + x25 + '" y="25" width="' + (x30 - x25) + '" height="24" fill="#f59e0b" />' +
            '<rect x="' + x30 + '" y="25" width="' + (x35 - x30) + '" height="24" fill="#ef4444" />' +
            '<rect x="' + x35 + '" y="25" width="' + (width - 40 - x35) + '" height="24" rx="3" fill="#991b1b" />' +

            '<!-- Zone Labels inside bars -->' +
            '<text x="' + ((40 + x18) / 2) + '" y="41" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Under</text>' +
            '<text x="' + ((x18 + x25) / 2) + '" y="41" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Normal (18.5-24.9)</text>' +
            '<text x="' + ((x25 + x30) / 2) + '" y="41" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Over (25-30)</text>' +
            '<text x="' + ((x30 + x35) / 2) + '" y="41" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Obese I</text>' +
            '<text x="' + ((x35 + width - 40) / 2) + '" y="41" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Class II/III</text>' +

            '<!-- Active Indicator Pointer -->' +
            '<line x1="' + userX + '" y1="12" x2="' + userX + '" y2="58" stroke="var(--fg)" stroke-width="3" />' +
            '<polygon points="' + (userX - 6) + ',12 ' + (userX + 6) + ',12 ' + userX + ',24" fill="var(--fg)" />' +
            '<text x="' + userX + '" y="76" fill="var(--fg)" font-size="12" font-weight="bold" text-anchor="middle">You: ' + bmi.toFixed(1) + '</text>' +
          '</svg>';

        container.innerHTML = svg;
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

            <!-- Pure SVG Energy Partitioning Visualizer -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Daily Energy Expenditure Partitioning:</span>
                <span id="tdee-bar-total" style="color: var(--fg); font-weight: bold;">Total: 2,438 kcal (100%)</span>
              </div>
              <div id="tdeeSvgContainer" style="width: 100%; overflow-x: auto;">
                <!-- Drawn dynamically by drawTdeeSvg -->
              </div>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> BMR (Organs at Rest)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> NEAT (Spontaneous Movement)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #f59e0b; border-radius: 2px;"></span> TEF (Digestion Heat)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #ef4444; border-radius: 2px;"></span> EAT (Structured Exercise)</span>
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

          <!-- 5 Fatal TDEE Traps & Metabolic Math Pitfalls -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal TDEE Traps &amp; Metabolic Math Pitfalls</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
              Weight loss plateaus and failed diets almost always trace back to metabolic calculation traps and subconscious energy compensation:
            </p>

            <div style="display: grid; gap: 1rem;">
              <div style="border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">1. The Smartwatch &amp; Cardio Machine Calorie Overestimation Trap</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Clinical studies from Stanford University and Aberystwyth University found that wrist-worn fitness trackers and commercial gym treadmills overestimate exercise energy expenditure by <strong>27% to 93%</strong>. An Apple Watch reporting '650 active calories burned' may represent only 350 to 450 true calories. Eating back tracker calories completely cancels your deficit.
                </p>
              </div>

              <div style="border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">2. Adaptive Thermogenesis &amp; Subconscious NEAT Downregulation</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  When sustained in a calorie deficit, the central nervous system conserves energy by downregulating Non-Exercise Activity Thermogenesis (NEAT). You unconsciously stop fidgeting, sit more frequently, take fewer steps, and relax postural muscle tone. This survival mechanism can silently depress your maintenance TDEE by <strong>200 to 400 kcal per day</strong> within 3 to 4 weeks.
                </p>
              </div>

              <div style="border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">3. The Weekend Caloric Surplus Blowout Trap</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Fat loss is dictated by 7-day rolling energy balance, not individual 24-hour days. Eating at a strict 500 kcal daily deficit from Monday through Friday creates a <strong>-2,500 kcal net deficit</strong>. However, drinking alcohol, ordering takeout, and having two relaxed restaurant meals on Saturday and Sunday can effortlessly inject <strong>+3,500 kcal</strong>, leaving you in a weekly surplus.
                </p>
              </div>

              <div style="border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">4. The FDA 20% Legal Margin of Error on Nutrition Labels</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Under US FDA Title 21 CFR 101.9, packaged food manufacturers are legally permitted up to a <strong>20% margin of error</strong> between declared calories and actual caloric density. A meal prep container or protein bar labeled as 400 calories can contain 480 true calories. In an aggressive cut of 400 kcal, food label variance alone can eliminate your entire deficit.
                </p>
              </div>

              <div style="border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">5. The Post-Workout Compensatory Appetite Surge (Ghrelin Spike)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Vigorous cardiovascular exercise stimulates acute pulses of the orexigenic hormone ghrelin. An intense 45-minute HIIT workout burns ~350 kcal but frequently triggers ravenous cravings for refined carbohydrates, leading to an unplanned 600-calorie smoothie or snack. Treat cardiovascular training as heart and lung conditioning—never as a currency to buy extra food.
                </p>
              </div>
            </div>
          </div></div>

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
            drawTdeeSvg(chosenBmr, neatCal, tefCal, eatCal, tdee, targetCal);

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

          
      function drawTdeeSvg(bmr, neat, tef, eat, totalTdee, targetCal) {
        var container = document.getElementById('tdeeSvgContainer');
        if (!container) return;

        var safeTotal = Math.max(100, totalTdee);
        var pBmr = (bmr / safeTotal) * 100;
        var pNeat = (neat / safeTotal) * 100;
        var pTef = (tef / safeTotal) * 100;
        var pEat = Math.max(0, 100 - pBmr - pNeat - pTef);

        var barW = 560;
        var startX = 40;
        var wBmr = (pBmr / 100) * barW;
        var wNeat = (pNeat / 100) * barW;
        var wTef = (pTef / 100) * barW;
        var wEat = (pEat / 100) * barW;

        var targetX = startX + Math.min(barW, Math.max(0, (targetCal / safeTotal) * barW));

        var svg = 
          '<svg viewBox="0 0 640 85" style="width: 100%; height: auto; display: block; font-family: var(--mono);" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Background Base -->' +
            '<rect x="' + startX + '" y="20" width="' + barW + '" height="28" rx="4" fill="var(--surface-alt)" stroke="var(--border)" stroke-width="1" />' +

            '<!-- Stacked Segments -->' +
            '<rect x="' + startX + '" y="20" width="' + wBmr + '" height="28" rx="4" fill="#3b82f6" />' +
            '<rect x="' + (startX + wBmr) + '" y="20" width="' + wNeat + '" height="28" fill="#10b981" />' +
            '<rect x="' + (startX + wBmr + wNeat) + '" y="20" width="' + wTef + '" height="28" fill="#f59e0b" />' +
            '<rect x="' + (startX + wBmr + wNeat + wTef) + '" y="20" width="' + wEat + '" height="28" rx="4" fill="#ef4444" />' +

            '<!-- Text Labels Inside Segments -->' +
            (wBmr > 70 ? '<text x="' + (startX + wBmr / 2) + '" y="38" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">BMR (' + Math.round(pBmr) + '%)</text>' : '') +
            (wNeat > 65 ? '<text x="' + (startX + wBmr + wNeat / 2) + '" y="38" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">NEAT</text>' : '') +
            (wTef > 45 ? '<text x="' + (startX + wBmr + wNeat + wTef / 2) + '" y="38" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">TEF</text>' : '') +
            (wEat > 45 ? '<text x="' + (startX + wBmr + wNeat + wTef + wEat / 2) + '" y="38" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">EAT</text>' : '') +

            '<!-- Target Calorie Intake Needle / Line -->' +
            '<line x1="' + targetX + '" y1="10" x2="' + targetX + '" y2="58" stroke="#8b5cf6" stroke-width="3" />' +
            '<polygon points="' + (targetX - 5) + ',10 ' + (targetX + 5) + ',10 ' + targetX + ',18" fill="#8b5cf6" />' +
            '<text x="' + targetX + '" y="72" fill="#8b5cf6" font-size="11" font-weight="bold" text-anchor="middle">Target: ' + targetCal.toLocaleString('en-US') + ' kcal</text>' +
          '</svg>';

        container.innerHTML = svg;
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

            <!-- Pure SVG Hydration Reservoir & Meniscus Visualizer -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Daily Hydration Reservoir &amp; Beverage Target:</span>
                <span id="water-svg-label" style="color: #3b82f6; font-weight: bold;">Target: 3.20 Liters (108 oz)</span>
              </div>
              <div id="waterSvgContainer" style="width: 100%; overflow-x: auto;">
                <!-- Dynamically drawn by drawWaterSvg -->
              </div>
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

          <!-- 5 Fatal Hydration & Electrolyte Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Hydration Traps &amp; Electrolyte Dilution Pitfalls</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
              Fluid balance is governed by strict plasma osmolality. Miscalculating fluid volume or electrolyte ratios can impair performance or trigger clinical emergencies:
            </p>

            <div style="display: grid; gap: 1rem;">
              <div style="border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">1. Exercise-Associated Hyponatremia (EAH &amp; Water Intoxication)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Chugging excessive plain water during endurance athletics without replacing lost sodium dilutes serum sodium concentrations below 135 mmol/L. Osmotic pressure forces water out of blood vessels into cerebral brain cells, causing acute cerebral edema, seizures, coma, and potential fatality. When sweating continuously for over 60 minutes, always add 500 to 800 mg of sodium per liter of water.
                </p>
              </div>

              <div style="border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">2. The Evening Fluid Chugging Trap (Fragmenting Slow-Wave Deep Sleep)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Drinking 30% or more of your daily fluid allotment within 2 hours of sleep triggers nocturnal bladder distension (nocturia). Waking 2 to 3 times per night to urinate interrupts 90-minute ultradian cycles and shatters restorative Stage 3 Slow-Wave Deep Sleep and REM. Front-load 70% of fluids before 4:00 PM and taper to small sips before bed.
                </p>
              </div>

              <div style="border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">3. The 'Clear Urine is Optimal' Fallacy</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Completely transparent, crystal-clear urine is not a badge of superior health—it is a clinical sign of mild overhydration and renal mineral leaching. Sustained over-clear urination washes out potassium, magnesium, and sodium. The optimal physiological hydration benchmark is pale straw or light yellow (Armstrong Levels 1 to 3).
                </p>
              </div>

              <div style="border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">4. The Thirst Lag in Endurance Athletics</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  At rest in an office, physiological thirst sensations accurately maintain fluid equilibrium. However, during high-intensity training or hot climates, acute sweat rates (1.0 to 2.5 L/hr) far outpace gastric emptying and thirst onset. Waiting until you feel parched during a race or heavy lift means you have already incurred a 2% body mass fluid deficit, degrading cardiac stroke volume and muscular power by 10% to 15%.
                </p>
              </div>

              <div style="border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">5. The Alcohol Vasopressin Inhibition Multiplier</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Ethanol directly suppresses the hypothalamic release of Arginine Vasopressin (Anti-Diuretic Hormone). For every 1 gram of ethanol consumed, the renal collecting ducts excrete ~10 ml of excess dilute urine. A standard beer or glass of wine (14g alcohol) extracts ~140 ml of net hydration from body tissues. Every drink must be matched with at least 8 oz of mineral water to avoid morning hypovolemia.
                </p>
              </div>
            </div>
          </div></div>

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
            drawWaterSvg(parseFloat(totalLiters), totalFlOz, numGlasses, numBottles);
          }

          
      function drawWaterSvg(liters, oz, glasses, bottles) {
        var container = document.getElementById('waterSvgContainer');
        if (!container) return;

        var maxLiters = 5.0;
        var fillPct = Math.min(100, Math.max(10, (liters / maxLiters) * 100));
        var reservoirW = 540;
        var startX = 50;
        var fillW = (fillPct / 100) * reservoirW;

        var svg = 
          '<svg viewBox="0 0 640 120" style="width: 100%; height: auto; display: block; font-family: var(--mono);" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Reservoir Outline -->' +
            '<rect x="' + startX + '" y="25" width="' + reservoirW + '" height="36" rx="6" fill="var(--surface-alt)" stroke="var(--border)" stroke-width="1.5" />' +

            '<!-- Fluid Fill Level -->' +
            '<rect x="' + startX + '" y="25" width="' + fillW + '" height="36" rx="6" fill="url(#waterGrad)" />' +

            '<!-- Fluid Meniscus Glow Line -->' +
            '<line x1="' + (startX + fillW) + '" y1="23" x2="' + (startX + fillW) + '" y2="63" stroke="#93c5fd" stroke-width="3" />' +

            '<!-- Scale Ticks -->' +
            '<g stroke="var(--text-muted)" stroke-width="1" opacity="0.6">' +
              '<line x1="' + (startX + reservoirW * 0.2) + '" y1="55" x2="' + (startX + reservoirW * 0.2) + '" y2="61" />' +
              '<line x1="' + (startX + reservoirW * 0.4) + '" y1="50" x2="' + (startX + reservoirW * 0.4) + '" y2="61" />' +
              '<line x1="' + (startX + reservoirW * 0.6) + '" y1="55" x2="' + (startX + reservoirW * 0.6) + '" y2="61" />' +
              '<line x1="' + (startX + reservoirW * 0.8) + '" y1="50" x2="' + (startX + reservoirW * 0.8) + '" y2="61" />' +
            '</g>' +

            '<!-- Tick Labels -->' +
            '<text x="' + startX + '" y="78" fill="var(--text-muted)" font-size="10" text-anchor="middle">0L</text>' +
            '<text x="' + (startX + reservoirW * 0.2) + '" y="78" fill="var(--text-muted)" font-size="10" text-anchor="middle">1.0L</text>' +
            '<text x="' + (startX + reservoirW * 0.4) + '" y="78" fill="var(--text-muted)" font-size="10" text-anchor="middle">2.0L</text>' +
            '<text x="' + (startX + reservoirW * 0.6) + '" y="78" fill="var(--text-muted)" font-size="10" text-anchor="middle">3.0L</text>' +
            '<text x="' + (startX + reservoirW * 0.8) + '" y="78" fill="var(--text-muted)" font-size="10" text-anchor="middle">4.0L</text>' +
            '<text x="' + (startX + reservoirW) + '" y="78" fill="var(--text-muted)" font-size="10" text-anchor="middle">5.0L</text>' +

            '<!-- Indicator Badge on Meniscus -->' +
            '<rect x="' + Math.min(reservoirW - 30, Math.max(startX + 10, startX + fillW - 55)) + '" y="5" width="110" height="18" rx="3" fill="#1e40af" />' +
            '<text x="' + Math.min(reservoirW + 25, Math.max(startX + 65, startX + fillW)) + '" y="17" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">' + liters.toFixed(2) + 'L (' + oz + ' oz)</text>' +

            '<!-- Bottle and Glass Equivalents Text -->' +
            '<text x="50" y="105" fill="var(--fg)" font-size="11" font-weight="bold">Equivalent: ' + glasses + ' Glasses (8 oz) &bull; ' + bottles + ' Gym Bottles (500ml)</text>' +

            '<!-- Gradient Definition -->' +
            '<defs>' +
              '<linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">' +
                '<stop offset="0%" stop-color="#3b82f6" />' +
                '<stop offset="100%" stop-color="#60a5fa" />' +
              '</linearGradient>' +
            '</defs>' +
          '</svg>';

        container.innerHTML = svg;
        var lbl = document.getElementById('water-svg-label');
        if (lbl) lbl.textContent = 'Target: ' + liters.toFixed(2) + ' Liters (' + oz + ' fl oz)';
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

            <!-- Pure SVG 90-Minute Ultradian Sleep Cycle Hypnogram Visualizer -->
            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Ultradian Sleep Architecture &amp; Sleep Inertia Gates:</span>
                <span id="sleep-hypno-legend" style="color: #10b981; font-weight: bold;">5 Cycles (7.5h) = Optimal Alertness</span>
              </div>
              <div id="sleepSvgContainer" style="width: 100%; overflow-x: auto;">
                <!-- Drawn dynamically by drawSleepHypnogramSvg -->
              </div>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> Optimal Wake Gates (Cycle End / REM / N1)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #ef4444; border-radius: 2px;"></span> Deep Slow-Wave Troughs (N3 Sleep Inertia Hazard)</span>
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

          <!-- 5 Fatal Sleep Cycle & Circadian Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Sleep Cycle Traps &amp; Circadian Pitfalls</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
              Sleep is not a uniform monolithic block—it is an intricate series of 90-minute neural oscillations. Violating sleep architecture leads to chronic fatigue:
            </p>

            <div style="display: grid; gap: 1rem;">
              <div style="border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">1. The Sleep Inertia Trap (Why 8 Hours Can Feel Worse Than 7.5 Hours)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  If an alarm abruptly wrenches you awake during Stage 3 Slow-Wave Deep Sleep (N3), your prefrontal cortex suffers from severe hypoperfusion for up to 60 minutes. This creates intense morning grogginess, slowed motor reflexes, and brain fog. Waking at 7.5 hours (at the conclusion of cycle 5 in light Stage 1/REM) allows you to feel instantly refreshed, whereas waking at 8.0 hours cuts directly into deep sleep.
                </p>
              </div>

              <div style="border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">2. The Weekend Social Jetlag Shift</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Staying up 3 hours later on Friday and sleeping in Saturday shifts your peripheral circadian clock genes (CLOCK, BMAL1). When you attempt to sleep early on Sunday, your core temperature has not yet dropped and pineal melatonin has not secreted, resulting in debilitating 'Sunday Night Insomnia' and Monday morning brain fog.
                </p>
              </div>

              <div style="border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">3. The 'Instant Knockout' Fallacy</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Falling asleep within 2 to 3 minutes of your head hitting the pillow is not a sign of exceptional sleep health—it is a recognized clinical indicator of <strong>severe cumulative sleep debt</strong> (excess extracellular adenosine accumulation). Healthy sleep latency is 10 to 20 minutes as the brain naturally relaxes from alpha waves to theta waves.
                </p>
              </div>

              <div style="border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">4. The Afternoon Caffeine Adenosine Receptor Lockout</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  With an average metabolic half-life of 5.7 hours (and quarter-life of ~11.5 hours), a 200mg coffee consumed at 3:00 PM leaves ~50mg still active in your brain at 2:00 AM. Caffeine competitively blocks adenosine A1 and A2A receptors, suppressing Stage 3 slow-wave delta sleep by up to 30% even if you fall asleep without difficulty.
                </p>
              </div>

              <div style="border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">5. The Blue Light &amp; Overhead Lux Melatonin Blockade</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Intrinsically photosensitive retinal ganglion cells (ipRGCs) expressing melanopsin are ultra-sensitive to 460–480nm blue photons. Viewing smartphones or sitting under bright overhead lighting (>100 lux) within 90 minutes of sleep suppresses pineal melatonin secretion by up to 88%, artificially delaying circadian sleep onset and truncating early REM phases.
                </p>
              </div>
            </div>
          </div></div>

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
            drawSleepHypnogramSvg();
          }

          
      function drawSleepHypnogramSvg() {
        var container = document.getElementById('sleepSvgContainer');
        if (!container) return;

        var startX = 50;
        var plotW = 560;
        var baseY = 25;

        // Draw 6 90-min cycles (0 to 9 hours)
        var pathD = 'M ' + startX + ' ' + baseY;
        var cycleW = plotW / 6;

        for (var c = 0; c < 6; c++) {
          var cx = startX + (c * cycleW);
          var deepDepth = (c < 3 ? baseY + 70 : baseY + 50);
          var remHeight = (c > 2 ? baseY + 18 : baseY + 30);

          pathD += ' C ' + (cx + cycleW * 0.2) + ' ' + (baseY + 35) + ', ' +
                          (cx + cycleW * 0.35) + ' ' + deepDepth + ', ' +
                          (cx + cycleW * 0.5) + ' ' + deepDepth;
          pathD += ' C ' + (cx + cycleW * 0.65) + ' ' + deepDepth + ', ' +
                          (cx + cycleW * 0.8) + ' ' + remHeight + ', ' +
                          (cx + cycleW) + ' ' + (baseY + 15);
        }

        var svg = 
          '<svg viewBox="0 0 640 135" style="width: 100%; height: auto; display: block; font-family: var(--mono);" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Stage Guidelines -->' +
            '<g stroke="var(--border)" stroke-dasharray="2,3" stroke-width="1">' +
              '<line x1="' + startX + '" y1="' + baseY + '" x2="' + (startX + plotW) + '" y2="' + baseY + '" />' +
              '<line x1="' + startX + '" y1="' + (baseY + 22) + '" x2="' + (startX + plotW) + '" y2="' + (baseY + 22) + '" />' +
              '<line x1="' + startX + '" y1="' + (baseY + 45) + '" x2="' + (startX + plotW) + '" y2="' + (baseY + 45) + '" />' +
              '<line x1="' + startX + '" y1="' + (baseY + 70) + '" x2="' + (startX + plotW) + '" y2="' + (baseY + 70) + '" />' +
            '</g>' +

            '<!-- Stage Axis Labels -->' +
            '<text x="42" y="' + (baseY + 3) + '" fill="var(--text-muted)" font-size="9" text-anchor="end">Awake</text>' +
            '<text x="42" y="' + (baseY + 25) + '" fill="#ec4899" font-size="9" font-weight="bold" text-anchor="end">REM</text>' +
            '<text x="42" y="' + (baseY + 48) + '" fill="#3b82f6" font-size="9" text-anchor="end">Light</text>' +
            '<text x="42" y="' + (baseY + 73) + '" fill="#8b5cf6" font-size="9" font-weight="bold" text-anchor="end">Deep</text>' +

            '<!-- Hypnogram Wave Path -->' +
            '<path d="' + pathD + '" fill="none" stroke="#3b82f6" stroke-width="2.5" />' +

            '<!-- Wake Gates (Green dots at cycle endpoints) -->' +
            '<circle cx="' + (startX + cycleW * 4) + '" cy="' + (baseY + 15) + '" r="4" fill="#10b981" stroke="var(--fg)" stroke-width="1" />' +
            '<circle cx="' + (startX + cycleW * 5) + '" cy="' + (baseY + 15) + '" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2" />' +
            '<circle cx="' + (startX + cycleW * 6) + '" cy="' + (baseY + 15) + '" r="4" fill="#10b981" stroke="var(--fg)" stroke-width="1" />' +

            '<!-- Cycle Hour Markers Along Bottom -->' +
            '<g fill="var(--text-muted)" font-size="10" text-anchor="middle">' +
              '<text x="' + (startX + cycleW * 1) + '" y="115">1.5h</text>' +
              '<text x="' + (startX + cycleW * 2) + '" y="115">3.0h</text>' +
              '<text x="' + (startX + cycleW * 3) + '" y="115">4.5h (3c)</text>' +
              '<text x="' + (startX + cycleW * 4) + '" y="115">6.0h (4c)</text>' +
              '<text x="' + (startX + cycleW * 5) + '" y="115" fill="#10b981" font-weight="bold">7.5h (5c ★)</text>' +
              '<text x="' + (startX + cycleW * 6) + '" y="115">9.0h (6c)</text>' +
            '</g>' +

            '<!-- Star Badge on 5 Cycles Optimal Wake -->' +
            '<rect x="' + (startX + cycleW * 5 - 45) + '" y="' + (baseY - 18) + '" width="90" height="16" rx="3" fill="#10b981" />' +
            '<text x="' + (startX + cycleW * 5) + '" y="' + (baseY - 6) + '" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">BEST: 7.5h (5 Cycles)</text>' +
          '</svg>';

        container.innerHTML = svg;
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

              <!-- Pure SVG Body Fat Spectrum & Lean Mass Partitioning Gauge -->
              <div id="bfSvgContainer" style="width: 100%; overflow-x: auto; margin: 0.5rem 0 0.75rem;">
                <!-- Dynamically drawn by drawBodyFatSvg -->
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

          <!-- 5 Fatal Body Fat & DoD Tape Test Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Body Fat Traps &amp; Tape Test Pitfalls</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
              Circumference equations and body composition tracking are susceptible to acute fluid fluctuations and measurement protocol errors:
            </p>

            <div style="display: grid; gap: 1rem;">
              <div style="border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">1. The Physiological Essential Fat Floor Danger</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Essential lipid mass is strictly required for nerve myelin sheath insulation, hormone precursor synthesis, and bone marrow cellular integrity. The absolute minimum is <strong>2% to 5% for men</strong> and <strong>10% to 13% for women</strong>. Dropping below these thresholds induces severe endocrine shutdown, hypogonadism, amenorrhea (menstrual cessation), cardiac arrhythmias, and acute bone mineral degradation.
                </p>
              </div>

              <div style="border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">2. Tape Tension &amp; Meal-Induced Abdominal Bloat Bias</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Pulling the circumference tape too taut indents soft subcutaneous tissue, falsely lowering estimated body fat. Conversely, measuring after a meal, during constipation, or during sodium-induced water retention expands waist circumference by 1 to 2 inches, which artificially inflates estimated body fat by <strong>3.0% to 5.0%</strong>. Always measure first thing in the morning fasted at normal passive exhalation.
                </p>
              </div>

              <div style="border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">3. DEXA vs. US Navy Method Empirical Variance (±3.5% SEE)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Developed by Hodgdon and Beckett in 1984, the US Navy logarithmic equation has a standard error of estimate (SEE) of approximately <strong>±3.0% to 3.5%</strong> compared to 4-compartment DEXA scans. Individuals with significant neck musculature or atypical visceral-to-subcutaneous fat distribution can register noticeably higher or lower than on dual-energy X-ray absorptiometry.
                </p>
              </div>

              <div style="border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">4. The Scale Weight Obsession (Losing Muscle vs. Adipose Fat)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Scale weight fluctuations fail to distinguish between water, glycogen, muscle, and adipose tissue. Losing 10 lbs on a crash diet typically consists of 4 lbs of water, 3 lbs of lean muscle tissue, and only 3 lbs of fat—worsening your actual body fat percentage and depressing resting metabolic rate. Tracking body fat percentage ensures lost mass is true adipose tissue.
                </p>
              </div>

              <div style="border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">5. DoD Directive 1308.3 Age Transition Cliff</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Under military branch regulations (Army AR 600-9, Navy OPNAVINST 6110.1J), allowable body fat percentages scale rigidly by age brackets (17–20, 21–27, 28–39, 40+). Service members testing within weeks of their birthday can face administrative action for exceeding a younger bracket limit (e.g. 22%) that would comfortably pass the next bracket (24%).
                </p>
              </div>
            </div>
          </div></div>

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
            if (document.getElementById('bf-needle')) {
              document.getElementById('bf-needle').style.left = needleLeft + '%';
            }
            drawBodyFatSvg(bf, bfGender, ageBracket, dodLimit);
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

          
      function drawBodyFatSvg(bf, gender, ageBracket, dodLimit) {
        var container = document.getElementById('bfSvgContainer');
        if (!container) return;

        var minBf = 2;
        var maxBf = 40;
        var width = 640;
        var clampedBf = Math.max(minBf, Math.min(maxBf, bf));
        var userX = 40 + ((clampedBf - minBf) / (maxBf - minBf)) * (width - 80);

        var isM = (gender === 'male');
        var eMax = isM ? 5 : 13;
        var aMax = isM ? 13 : 20;
        var fMax = isM ? 17 : 24;
        var avMax = isM ? 24 : 31;

        var xE = 40 + ((eMax - minBf) / (maxBf - minBf)) * (width - 80);
        var xA = 40 + ((aMax - minBf) / (maxBf - minBf)) * (width - 80);
        var xF = 40 + ((fMax - minBf) / (maxBf - minBf)) * (width - 80);
        var xAv = 40 + ((avMax - minBf) / (maxBf - minBf)) * (width - 80);
        var xDod = 40 + ((dodLimit - minBf) / (maxBf - minBf)) * (width - 80);

        var svg = 
          '<svg viewBox="0 0 640 105" style="width: 100%; height: auto; display: block; font-family: var(--mono);" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Spectrum Bands -->' +
            '<rect x="40" y="28" width="' + (xE - 40) + '" height="24" rx="3" fill="#3b82f6" />' +
            '<rect x="' + xE + '" y="28" width="' + (xA - xE) + '" height="24" fill="#10b981" />' +
            '<rect x="' + xA + '" y="28" width="' + (xF - xA) + '" height="24" fill="#059669" />' +
            '<rect x="' + xF + '" y="28" width="' + (xAv - xF) + '" height="24" fill="#f59e0b" />' +
            '<rect x="' + xAv + '" y="28" width="' + (width - 40 - xAv) + '" height="24" rx="3" fill="#ef4444" />' +

            '<!-- Zone Labels -->' +
            '<text x="' + ((40 + xE) / 2) + '" y="44" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Essential</text>' +
            '<text x="' + ((xE + xA) / 2) + '" y="44" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Athletes</text>' +
            '<text x="' + ((xA + xF) / 2) + '" y="44" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Fitness</text>' +
            '<text x="' + ((xF + xAv) / 2) + '" y="44" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Average</text>' +
            '<text x="' + ((xAv + width - 40) / 2) + '" y="44" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Obese</text>' +

            '<!-- DoD Cutoff Marker Line -->' +
            '<line x1="' + xDod + '" y1="20" x2="' + xDod + '" y2="60" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="3,3" />' +
            '<text x="' + xDod + '" y="16" fill="#8b5cf6" font-size="9" font-weight="bold" text-anchor="middle">DoD ' + dodLimit + '% Max</text>' +

            '<!-- User Active Needle -->' +
            '<line x1="' + userX + '" y1="18" x2="' + userX + '" y2="62" stroke="var(--fg)" stroke-width="3" />' +
            '<polygon points="' + (userX - 6) + ',18 ' + (userX + 6) + ',18 ' + userX + ',28" fill="var(--fg)" />' +
            '<text x="' + userX + '" y="80" fill="var(--fg)" font-size="12" font-weight="bold" text-anchor="middle">You: ' + bf.toFixed(1) + '%</text>' +
          '</svg>';

        container.innerHTML = svg;
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

            <!-- Pure SVG Proportional Macronutrient Partitioning Visualizer -->
            <div style="margin-top: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
                <span>Caloric Distribution Breakdown (Pure SVG):</span>
                <span id="mc-bar-total" style="color: var(--fg); font-weight: bold;">2,300 kcal (100%)</span>
              </div>
              <div id="mcSvgContainer" style="width: 100%; overflow-x: auto;">
                <!-- Drawn dynamically by drawMacroSvg -->
              </div>
              <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem; font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #ef4444; border-radius: 2px;"></span> Protein (4 kcal/g)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 2px;"></span> Healthy Fats (9 kcal/g)</span>
                <span style="display: inline-flex; align-items: center; gap: 0.3rem;"><span style="width: 8px; height: 8px; background: #10b981; border-radius: 2px;"></span> Carbohydrates (4 kcal/g)</span>
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

          <!-- 5 Fatal Macronutrient & Hormone Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Macronutrient Traps &amp; Hormone Suppression Pitfalls</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
              Macronutrient splits directly modulate muscle protein synthesis, testosterone production, and thyroid status. Avoid these critical mistakes:
            </p>

            <div style="display: grid; gap: 1rem;">
              <div style="border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">1. The Ultra-Low-Fat Endocrine Collapse</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Cutting dietary fats below 15% to 20% of total daily calories (or <0.6 g/kg of body weight) starves the endocrine system of lipid-derived cholesterol precursors needed to synthesize testosterone, estrogen, and progesterone. It also severely restricts assimilation of fat-soluble vitamins (A, D, E, K), leading to joint pain, chronic fatigue, and hormonal shutdown.
                </p>
              </div>

              <div style="border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">2. The Percentage-Based Protein Trap in Deep Deficits</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Calculating protein as a fixed percentage (e.g. 25%) rather than absolute grams per kilogram becomes catastrophic in a deficit. In a 1,400 kcal cut, 25% protein delivers only 87 grams—grossly insufficient for an 80kg lifter who requires 160 to 190g (2.0–2.4 g/kg) to stave off muscle wasting. Always anchor protein to body mass first.
                </p>
              </div>

              <div style="border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">3. The Net Carbs &amp; High-Glycemic Sugar Alcohol Trap</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Not all sugar alcohols can be subtracted equally from total carbohydrates. While erythritol has a glycemic index of 0, maltitol syrup (prevalent in commercial 'low-carb' protein bars) has a glycemic index of 35 to 52 and yields 2.1 to 3.0 kcal/g. Treating maltitol as zero-carb causes unexpected insulin spikes and stalls fat loss.
                </p>
              </div>

              <div style="border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">4. The 'Liquid Shakes Replace Whole Foods' Error</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Drinking 100g of protein via liquid whey shakes provides very low satiety and empties from the stomach in under 60 minutes. In contrast, whole food protein anchors (chicken breast, salmon, egg whites, lean beef) demand significant thermic mastication, stimulate the gut peptide satiety hormone PYY, and take 3 to 4 hours to digest, naturally curbing cravings.
                </p>
              </div>

              <div style="border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">5. The Carbohydrate Phobia in Resistance Training</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  High-intensity muscular contractions rely on intracellular glycogen through anaerobic glycolysis. Drastically zeroing carbs while lifting heavy forces hepatic gluconeogenesis, elevates systemic cortisol, suppresses active thyroid hormone (T3), and impairs intra-workout strength, leading to stalled progressive overload.
                </p>
              </div>
            </div>
          </div></div>

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
            drawMacroSvg(pG, fG, cG, pCal, fCal, cCal, cals);

            // Step Worked Text
            document.getElementById('mc-step-1').innerHTML = 'For ' + weightKg.toFixed(1) + ' kg: ' + weightKg.toFixed(1) + ' &times; ' + pPerKg + ' g/kg = <strong>' + pG + 'g Protein (' + pCal + ' kcal)</strong>.';
            document.getElementById('mc-step-2').innerHTML = 'For ' + cals + ' kcal: (' + cals + ' &times; ' + (fPctActual / 100).toFixed(2) + ') / 9 = <strong>' + fG + 'g Fat (' + fCal + ' kcal)</strong>.';
            document.getElementById('mc-step-3').innerHTML = 'Remaining Cal = ' + cals + ' - (' + pCal + ' + ' + fCal + ') = ' + cCal + ' kcal &bull; Carbs = ' + cCal + ' / 4 = <strong>' + cG + 'g Carbs (' + cCal + ' kcal)</strong>.';
          }

          
      function drawMacroSvg(pG, fG, cG, pCal, fCal, cCal, totalCal) {
        var container = document.getElementById('mcSvgContainer');
        if (!container) return;

        var safeTotal = Math.max(100, totalCal);
        var pPct = (pCal / safeTotal) * 100;
        var fPct = (fCal / safeTotal) * 100;
        var cPct = Math.max(0, 100 - pPct - fPct);

        var barW = 560;
        var startX = 40;
        var wP = (pPct / 100) * barW;
        var wF = (fPct / 100) * barW;
        var wC = (cPct / 100) * barW;

        var svg = 
          '<svg viewBox="0 0 640 85" style="width: 100%; height: auto; display: block; font-family: var(--mono);" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Base Background -->' +
            '<rect x="' + startX + '" y="20" width="' + barW + '" height="32" rx="4" fill="var(--surface-alt)" stroke="var(--border)" stroke-width="1" />' +

            '<!-- Stacked Segments -->' +
            '<rect x="' + startX + '" y="20" width="' + wP + '" height="32" rx="4" fill="#ef4444" />' +
            '<rect x="' + (startX + wP) + '" y="20" width="' + wF + '" height="32" fill="#3b82f6" />' +
            '<rect x="' + (startX + wP + wF) + '" y="20" width="' + wC + '" height="32" rx="4" fill="#10b981" />' +

            '<!-- Segment Labels Inside -->' +
            (wP > 70 ? '<text x="' + (startX + wP / 2) + '" y="41" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Protein: ' + pG + 'g (' + Math.round(pPct) + '%)</text>' : '') +
            (wF > 65 ? '<text x="' + (startX + wP + wF / 2) + '" y="41" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Fats: ' + fG + 'g (' + Math.round(fPct) + '%)</text>' : '') +
            (wC > 70 ? '<text x="' + (startX + wP + wF + wC / 2) + '" y="41" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">Carbs: ' + cG + 'g (' + Math.round(cPct) + '%)</text>' : '') +

            '<!-- Subtitle Summary Below -->' +
            '<text x="320" y="72" fill="var(--text-muted)" font-size="10" text-anchor="middle">Protein: ' + pCal + ' kcal &bull; Fats: ' + fCal + ' kcal &bull; Carbs: ' + cCal + ' kcal (Total: ' + totalCal.toLocaleString('en-US') + ' kcal)</text>' +
          '</svg>';

        container.innerHTML = svg;
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

              <!-- Pure SVG Ideal Weight & Healthy Range Spectrum Visualizer -->
              <div id="iwSvgContainer" style="width: 100%; overflow-x: auto; margin: 0.5rem 0 0.75rem;">
                <!-- Drawn dynamically by drawIdealWeightSvg -->
              </div>
            </div>

            <!-- 4 Clinical Formulas Detailed Breakdown Table --><!-- 4 Clinical Formulas Detailed Breakdown Table -->
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

          <!-- 5 Fatal Ideal Weight & Pharmacokinetic Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Ideal Weight Traps &amp; Pharmacokinetic Origin Pitfalls</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
              Ideal Body Weight (IBW) equations are often misunderstood by the public as aesthetic goals rather than clinical clearance markers:
            </p>

            <div style="display: grid; gap: 1rem;">
              <div style="border-left: 3px solid #ef4444; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">1. The Pharmacokinetic Clearance Origin (Hospital Dosing vs. Aesthetics)</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  The Devine (1974), Robinson (1983), and Hamwi (1964) formulas were developed strictly to estimate renal clearance and extracellular distribution volumes for toxic medications (aminoglycoside antibiotics, theophylline, digoxin). They were engineered to prevent drug overdoses in hospital intensive care units—never as fitness targets or physique ideals.
                </p>
              </div>

              <div style="border-left: 3px solid #f59e0b; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">2. The Linear vs. 3D Volumetric Scaling Flaw</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Human bodies are 3-dimensional volumes where mass scales to the height exponent of 2.5 to 3.0. Standard IBW formulas add a flat, linear increment (e.g. 5 lbs or 2.3 kg) for every inch over 5 feet. As a mathematical consequence, these formulas systematically underestimate target weight for tall adults (>6'1" / 185cm) and overestimate target weight for shorter individuals (<5'2" / 157cm).
                </p>
              </div>

              <div style="border-left: 3px solid #10b981; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">3. Complete Disregard for Lean Muscle Mass</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  None of the 4 clinical formulas account for skeletal muscle mass. Dense, contractile muscle tissue weighs approximately 18% more per unit volume than adipose tissue. A natural, drug-free athlete with single-digit body fat will routinely weigh 15% to 35% above their calculated Devine ideal weight while having pristine cardiovascular and metabolic health.
                </p>
              </div>

              <div style="border-left: 3px solid #3b82f6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">4. The Single Deterministic Number Trap</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Obsessing over a single exact weight target induces unnecessary psychological distress. The World Health Organization (WHO) healthy weight range spans a broad 15 to 20 kg (35 to 45 lb) spectrum for any given height, accommodating natural variances in hydration, bone mineral density, and visceral proportions.
                </p>
              </div>

              <div style="border-left: 3px solid #8b5cf6; padding: 0.75rem 1rem; background: var(--surface-alt); border-radius: 0 4px 4px 0;">
                <strong style="color: var(--fg); font-size: 0.95rem;">5. Neglecting Bone Frame Size Adjustments</strong>
                <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                  Standard formulas assume an average medium skeletal frame. Clinical anthropometry requires a ±10% correction based on wrist styloid circumference. A small-framed person striving for unadjusted IBW may carry excess visceral fat, while a broad-shouldered, large-framed individual attempting to reach standard IBW is forced into an unhealthy, emaciated state.
                </p>
              </div>
            </div>
          </div></div>

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
            if (document.getElementById('iw-marker')) {
              document.getElementById('iw-marker').style.left = markerPct.toFixed(1) + '%';
            }
            drawIdealWeightSvg(devine, robinson, miller, hamwi, minNormal, maxNormal, curWeight, iwUnitMode);
            document.getElementById('iw-marker-legend').firstElementChild.textContent = '▲ Pointer: Consensus Ideal Weight (' + consensusKg.toFixed(1) + ' kg / ' + (consensusKg * 2.20462).toFixed(1) + ' lbs)';

            // Worked step derivations
            const inchText = inchesOver5Ft.toFixed(1) + ' inches over 5ft';
            document.getElementById('iw-step-devine').innerHTML = (isMale ? '50.0' : '45.5') + ' kg + (2.3 &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + devine.toFixed(1) + ' kg (' + (devine * 2.20462).toFixed(1) + ' lbs)</strong>';
            document.getElementById('iw-step-robinson').innerHTML = (isMale ? '52.0' : '49.0') + ' kg + (' + (isMale ? '1.9' : '1.7') + ' &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + robinson.toFixed(1) + ' kg (' + (robinson * 2.20462).toFixed(1) + ' lbs)</strong>';
            document.getElementById('iw-step-miller').innerHTML = (isMale ? '56.2' : '53.1') + ' kg + (' + (isMale ? '1.41' : '1.36') + ' &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + miller.toFixed(1) + ' kg (' + (miller * 2.20462).toFixed(1) + ' lbs)</strong>';
            document.getElementById('iw-step-hamwi').innerHTML = (isMale ? '48.0' : '45.5') + ' kg + (' + (isMale ? '2.7' : '2.2') + ' &times; ' + inchesOver5Ft.toFixed(1) + ')' + (frameMultiplier !== 1.0 ? ' &times; ' + frameMultiplier : '') + ' = <strong>' + hamwi.toFixed(1) + ' kg (' + (hamwi * 2.20462).toFixed(1) + ' lbs)</strong>';
          }

          
      function drawIdealWeightSvg(devine, robinson, miller, hamwi, minWho, maxWho, curWeight, unitMode) {
        var container = document.getElementById('iwSvgContainer');
        if (!container) return;

        var width = 640;
        var minScale = minWho * 0.85;
        var maxScale = maxWho * 1.25;

        function getX(val) {
          return 40 + ((val - minScale) / (maxScale - minScale)) * (width - 80);
        }

        var xMinWho = getX(minWho);
        var xMaxWho = getX(maxWho);
        var xDevine = getX(devine);
        var xRobinson = getX(robinson);
        var xMiller = getX(miller);
        var xHamwi = getX(hamwi);
        var xUser = curWeight > 0 ? getX(curWeight) : -100;

        var svg = 
          '<svg viewBox="0 0 640 100" style="width: 100%; height: auto; display: block; font-family: var(--mono);" xmlns="http://www.w3.org/2000/svg">' +
            '<!-- Underweight Band -->' +
            '<rect x="40" y="25" width="' + (xMinWho - 40) + '" height="24" rx="3" fill="#3b82f6" />' +
            '<text x="' + ((40 + xMinWho) / 2) + '" y="41" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Under (<18.5)</text>' +

            '<!-- WHO Healthy Normal Window -->' +
            '<rect x="' + xMinWho + '" y="25" width="' + (xMaxWho - xMinWho) + '" height="24" fill="#10b981" />' +
            '<text x="' + ((xMinWho + xMaxWho) / 2) + '" y="41" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">WHO Healthy Weight Range (18.5 – 24.9)</text>' +

            '<!-- Overweight Band -->' +
            '<rect x="' + xMaxWho + '" y="25" width="' + (width - 40 - xMaxWho) + '" height="24" rx="3" fill="#f59e0b" />' +
            '<text x="' + ((xMaxWho + width - 40) / 2) + '" y="41" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Over (&ge;25)</text>' +

            '<!-- Formula Markers -->' +
            '<circle cx="' + xDevine + '" cy="37" r="5" fill="#3b82f6" stroke="#fff" stroke-width="1.5" title="Devine: ' + devine.toFixed(1) + '" />' +
            '<circle cx="' + xRobinson + '" cy="37" r="5" fill="#059669" stroke="#fff" stroke-width="1.5" title="Robinson: ' + robinson.toFixed(1) + '" />' +
            '<circle cx="' + xMiller + '" cy="37" r="5" fill="#d97706" stroke="#fff" stroke-width="1.5" title="Miller: ' + miller.toFixed(1) + '" />' +
            '<circle cx="' + xHamwi + '" cy="37" r="5" fill="#ec4899" stroke="#fff" stroke-width="1.5" title="Hamwi: ' + hamwi.toFixed(1) + '" />' +

            '<!-- User Active Weight Indicator -->' +
            (xUser >= 40 && xUser <= width - 40 ? 
              '<line x1="' + xUser + '" y1="10" x2="' + xUser + '" y2="58" stroke="var(--fg)" stroke-width="3" />' +
              '<polygon points="' + (xUser - 6) + ',10 ' + (xUser + 6) + ',10 ' + xUser + ',22" fill="var(--fg)" />' +
              '<text x="' + xUser + '" y="75" fill="var(--fg)" font-size="11" font-weight="bold" text-anchor="middle">You: ' + curWeight.toFixed(1) + ' ' + (unitMode === 'metric' ? 'kg' : 'lbs') + '</text>' : '') +

            '<!-- Formula Legend -->' +
            '<g font-size="9" fill="var(--text-muted)" transform="translate(40, 92)">' +
              '<text x="0" y="0">● Devine (' + devine.toFixed(1) + ')</text>' +
              '<text x="130" y="0">● Robinson (' + robinson.toFixed(1) + ')</text>' +
              '<text x="270" y="0">● Miller (' + miller.toFixed(1) + ')</text>' +
              '<text x="390" y="0">● Hamwi (' + hamwi.toFixed(1) + ')</text>' +
            '</g>' +
          '</svg>';

        container.innerHTML = svg;
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

          <!-- 5 Critical Pharmacological Traps & Sleep Disruption Realities -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Pharmacological &amp; Circadian Caffeine Traps</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The "I Can Sleep Fine on Coffee" Slow-Wave Delta Suppression Illusion</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Falling asleep promptly after an evening espresso does not mean your sleep is biologically restorative. Polysomnographic EEG sleep studies prove that circulating adenosine antagonists suppress Stage N3 Slow-Wave Deep Sleep by <strong>20% to 30%</strong>. This suppresses nocturnal growth hormone secretion, halts cellular muscle repair, and causes chronic unrefreshing sleep without the individual recognizing caffeine as the cause.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">🕒 2. The Afternoon Energy Drink Compounding Curve</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Consuming a 200mg–300mg energy drink or cold brew at 3:00 PM leaves approximately 100mg–150mg active in cerebral circulation at 9:00 PM, and 50mg–75mg at 3:00 AM. This pharmacokinetically obstructs nighttime REM cycles, producing severe morning sleep inertia that drives compensatory higher caffeine doses the following morning—locking you into a self-perpetuating cycle of stimulants and sleep debt.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🧬 3. CYP1A2 Genetic Polymorphisms &amp; Oral Contraceptive Clearance Drag</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  The liver's cytochrome P450 <em>CYP1A2</em> enzyme accounts for 95% of caffeine metabolism. Individuals carrying the <em>CYP1A2*1F</em> slow-metabolizer allele process caffeine at half the baseline rate. Furthermore, synthetic estrogens in oral contraceptives and hormone replacement therapies competitively inhibit CYP1A2 transcription, doubling caffeine half-life from 5 hours to over 10 hours—keeping morning coffee active well past midnight.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🫀 4. Adenosine Receptor Upregulation &amp; Baseline Energy Suppression</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Habitual daily caffeine consumption triggers neural homeostatic adaptation: brain cells synthesize thousands of new <em>A1</em> and <em>A2A</em> adenosine receptors. Consequently, your unmedicated baseline energy level drops substantially below that of a non-consumer. Your morning cup no longer provides genuine cognitive enhancement, but merely temporarily rescues you from acute withdrawal fatigue, vascular headache, and dysphoria.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🤰 5. Pregnancy Half-Life Prolongation (Up to 15–18 Hours)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  By the third trimester of pregnancy, hepatic CYP1A2 activity declines dramatically due to placental steroid hormone cascades. Maternal caffeine elimination half-life stretches from 5 hours up to 15–18 hours. Because caffeine freely traverses the placental barrier while the immature fetal liver lacks functional CYP1A2 enzymes, fetal plasma caffeine concentrations remain elevated for days.
                </p>
              </div>
            </div>
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

          <!-- 5 Critical Sleep Deprivation Pitfalls & Neurological Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps &amp; Neurological Traps of Sustained Sleep Loss</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The Prefrontal "Subjective Alertness" Illusion (The Van Dongen Effect)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Seminal clinical trials by Dr. Hans Van Dongen at the University of Pennsylvania established that after 14 days of restricted sleep (6 hours/night), subjects reported feeling "only slightly drowsy." However, objective Psychomotor Vigilance Task (PVT) testing revealed that their lapses of attention and reaction time degradations were mathematically identical to being continuously awake for 48 hours straight. Chronic sleep debt blinds your prefrontal cortex to its own severe cognitive decay.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">🚗 2. Microsleep Latency &amp; The 286-Foot Highway Hazard Zone</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  A microsleep is an involuntary neurological seizure of sleep lasting from 1 to 15 seconds where EEG brainwaves abruptly collapse into theta/delta frequencies while your eyes may remain wide open. Driving at 65 mph (105 km/h), a brief 3-second microsleep causes a motor vehicle to hurtle over 286 feet completely uncontrolled with zero evasive braking—representing the primary cause of fatal off-road highway collisions.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🍷 3. The 24-Hour Awakening = 0.10% BAC Statutory DUI Equivalence</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Foundational research by Dawson and Reid published in <em>Nature</em> demonstrated that staying awake for 17 to 19 continuous hours produces motor coordination and divided-attention deficits equal to a Blood Alcohol Concentration (BAC) of 0.05%. Sustained wakefulness of 24 hours induces neurobehavioral impairment equivalent to 0.10% BAC—exceeding the criminal drunk driving threshold (0.08% BAC) across all 50 United States.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🧠 4. Glymphatic Drainage Stoppage &amp; Beta-Amyloid Accumulation</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  The brain lacks a traditional lymphatic system. Metabolic neurotoxins—including Alzheimer's-linked beta-amyloid and hyperphosphorylated tau proteins—are cleared exclusively by the glymphatic system during Stage N3 slow-wave sleep when interstitial glial space expands by 60%. A single 24-hour sleep deprivation cycle causes an acute 5% to 10% surge in cortical beta-amyloid burden that cannot be neutralized by daytime naps.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🛡️ 5. The 70% Natural Killer (NK) Cell Immune Collapse</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Restricting sleep to 4 hours for just one single night reduces circulating natural killer (NK) cell antiviral and antineoplastic activity by a staggering 70% (Dr. Michael Irwin, UCLA). Controlled epidemiological trials indicate that individuals averaging under 6 hours of sleep are over 4.2 times more likely to catch a cold when exposed to rhinovirus compared to those getting 7+ hours, alongside halved vaccine antibody production.
                </p>
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
  "slug": "cbt-thought-challenger",
  "title": "CBT Thought Challenger & Cognitive Distortion Diary (7-Column Beckian Record)",
  "metaDesc": "Free online Cognitive Behavioral Therapy (CBT) thought record. Identify 10 cognitive distortions, challenge automatic negative thoughts, and re-rate emotional distress.",
  "faq": [
    {
      "q": "What is a CBT 7-column thought record?",
      "a": "A 7-column thought record is a core therapeutic exercise in Cognitive Behavioral Therapy developed by Dr. Aaron T. Beck. It guides individuals through systematically identifying an activating event, isolating automatic negative thoughts (ANTs), rating emotional intensity, identifying cognitive distortions, examining objective evidence for and against the thought, and constructing a balanced, realistic reframe."
    },
    {
      "q": "What are the most common cognitive distortions in CBT?",
      "a": "As identified by Dr. David Burns in 'Feeling Good', common cognitive distortions include: All-or-Nothing Thinking (black-and-white evaluation), Catastrophizing (assuming the worst outcome), Mind Reading (assuming you know what others think), Fortune Telling (predicting negative futures), Emotional Reasoning ('I feel it, therefore it must be true'), Mental Filter (fixating on a single flaw), and 'Should' Statements (rigid demands creating guilt)."
    },
    {
      "q": "Is Cognitive Behavioral Therapy just 'positive thinking'?",
      "a": "No. In fact, CBT explicitly rejects naive positive thinking or 'toxic positivity'. The goal of CBT is cognitive realism—replacing distorted, catastrophizing thoughts with accurate, evidence-based assessments of reality. If a situation is genuinely difficult, CBT helps you see it clearly without magnifying it into catastrophe or minimizing your coping agency."
    },
    {
      "q": "Why doesn't logic work when you are in the middle of a panic attack?",
      "a": "During acute panic or hyper-arousal, the amygdala initiates a fight-or-flight response, shunting blood flow away from the prefrontal cortex (executive reasoning center). Cognitive restructuring requires prefrontal engagement. If emotional distress is above 85–90%, somatic down-regulation (box breathing, physiological sigh, cold water immersion) must be used first to soothe the autonomic nervous system before challenging thoughts."
    },
    {
      "q": "How does cognitive restructuring change brain function over time?",
      "a": "Neuroimaging studies demonstrate that practicing cognitive restructuring strengthens functional connectivity between the ventromedial prefrontal cortex (vmPFC) and the amygdala. Through neuroplasticity, repeatedly questioning automatic negative thoughts weakens habitual negative neural pathways and establishes more resilient cognitive appraisals."
    }
  ],
  "body": "\n    <div class=\"article-container\" style=\"max-width: 950px; margin: 0 auto; padding: 0 1rem;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\" style=\"color: inherit; text-decoration: underline;\">Home</a> &gt; <a href=\"/health/\" style=\"color: inherit; text-decoration: underline;\">Health</a> &gt; CBT Thought Record\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2;\">CBT Thought Challenger & Cognitive Distortion Record</h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Based on the clinical Beckian 7-Column Thought Record. Intercept Automatic Negative Thoughts (ANTs), identify cognitive distortions, cross-examine evidence, and construct rational reframes that measurable reduce emotional distress.\n        </p>\n      </header>\n\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.04);\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1.25rem;\">Step 1: The Activating Event & Automatic Thought</h2>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">1. Activating Situation (Who, What, Where, When):</label>\n            <input type=\"text\" id=\"cbt-sit\" value=\"My manager scheduled an unexpected meeting tomorrow at 9 AM.\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: inherit; font-size: 0.95rem;\" oninput=\"updateCbt()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">Objective, factual trigger without interpretation.</span>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">2. Automatic Negative Thought (ANT):</label>\n            <input type=\"text\" id=\"cbt-ant\" value=\"I am going to get fired and my career is ruined.\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: inherit; font-size: 0.95rem;\" oninput=\"updateCbt()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">The underlying catastrophic belief or prediction.</span>\n          </div>\n        </div>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Primary Emotion:</label>\n            <select id=\"cbt-emotion\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: inherit; font-size: 0.95rem;\" onchange=\"updateCbt()\">\n              <option value=\"Anxiety / Dread\" selected>Anxiety / Dread</option>\n              <option value=\"Shame / Inadequacy\">Shame / Inadequacy</option>\n              <option value=\"Anger / Resentment\">Anger / Resentment</option>\n              <option value=\"Sadness / Despair\">Sadness / Despair</option>\n              <option value=\"Guilt / Self-Blame\">Guilt / Self-Blame</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Initial Distress Intensity: <span id=\"cbt-pre-val\" style=\"font-family: var(--mono); color: #ef4444; font-weight: bold;\">85%</span></label>\n            <input type=\"range\" id=\"cbt-pre\" min=\"0\" max=\"100\" value=\"85\" style=\"width: 100%; cursor: pointer;\" oninput=\"updateCbt()\" />\n            <div style=\"display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-family: var(--mono);\">\n              <span>0% (Calm)</span>\n              <span>50% (Distressed)</span>\n              <span>100% (Panic)</span>\n            </div>\n          </div>\n        </div>\n\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; border-top: 1px dashed var(--border); padding-top: 1.25rem;\">Step 2: Identify Cognitive Distortions</h2>\n        <p style=\"color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;\">Select all mental thinking traps present in your automatic thought:</p>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.6rem; margin-bottom: 1.5rem;\">\n          <label style=\"display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" class=\"cbt-dist\" value=\"Catastrophizing\" checked onchange=\"updateCbt()\"> <span><strong>Catastrophizing:</strong> Expecting worst-case ruin.</span></label>\n          <label style=\"display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" class=\"cbt-dist\" value=\"Mind Reading\" checked onchange=\"updateCbt()\"> <span><strong>Mind Reading:</strong> Assuming negative intentions.</span></label>\n          <label style=\"display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" class=\"cbt-dist\" value=\"All-or-Nothing\" onchange=\"updateCbt()\"> <span><strong>All-or-Nothing:</strong> Pure black-and-white binary.</span></label>\n          <label style=\"display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" class=\"cbt-dist\" value=\"Fortune Telling\" checked onchange=\"updateCbt()\"> <span><strong>Fortune Telling:</strong> Predicting negative outcome.</span></label>\n          <label style=\"display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" class=\"cbt-dist\" value=\"Emotional Reasoning\" onchange=\"updateCbt()\"> <span><strong>Emotional Reasoning:</strong> \"I feel it, so it's true.\"</span></label>\n          <label style=\"display: flex; align-items: flex-start; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" class=\"cbt-dist\" value=\"Mental Filter\" onchange=\"updateCbt()\"> <span><strong>Mental Filter:</strong> Ignoring positive counter-data.</span></label>\n        </div>\n\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.75rem; border-top: 1px dashed var(--border); padding-top: 1.25rem;\">Step 3: Cross-Examine Evidence & Rational Reframe</h2>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Evidence Supporting the Thought (Hard Facts Only):</label>\n            <textarea id=\"cbt-sup\" rows=\"3\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: inherit; font-size: 0.9rem;\" oninput=\"updateCbt()\">The meeting was scheduled without an agenda at 4:30 PM on a Tuesday.</textarea>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Evidence Contradicting the Thought (Counter-Facts):</label>\n            <textarea id=\"cbt-opp\" rows=\"3\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: inherit; font-size: 0.9rem;\" oninput=\"updateCbt()\">I received positive feedback in my quarterly review 3 weeks ago. Managers schedule routine syncs constantly. Even if there is a critique, feedback is a correction, not an immediate termination.</textarea>\n          </div>\n        </div>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Balanced Rational Reframe:</label>\n            <textarea id=\"cbt-reframe\" rows=\"3\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: inherit; font-size: 0.9rem;\" oninput=\"updateCbt()\">I don't know the agenda yet. It could be project reallocation, routine check-in, or new priorities. If it is feedback, I have the skills to address it. Catastrophizing won't change the outcome; I will prepare calmly.</textarea>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Re-Rated Distress Intensity: <span id=\"cbt-post-val\" style=\"font-family: var(--mono); color: #22c55e; font-weight: bold;\">30%</span></label>\n            <input type=\"range\" id=\"cbt-post\" min=\"0\" max=\"100\" value=\"30\" style=\"width: 100%; cursor: pointer;\" oninput=\"updateCbt()\" />\n            <div style=\"display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-family: var(--mono);\">\n              <span>0% (Neutral)</span>\n              <span>50% (Manageable)</span>\n              <span>100% (Overwhelmed)</span>\n            </div>\n            <div style=\"margin-top: 0.75rem; font-size: 0.85rem; color: var(--text-muted);\">\n              Distress Reduction Delta: <strong id=\"cbt-delta\" style=\"color: #22c55e; font-family: var(--mono); font-size: 1.1rem;\">-55%</strong>\n            </div>\n          </div>\n        </div>\n\n        <!-- Hero KPI Cards -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.5rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #22c55e; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Emotional Relief Delta</div>\n            <div id=\"kpi-relief\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #22c55e; margin: 0.4rem 0;\">-55%</div>\n            <div style=\"font-size: 0.8rem; color: var(--text-muted);\"><span id=\"kpi-pre-txt\">85%</span> down to <span id=\"kpi-post-txt\">30%</span> distress</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Distortions Dismantled</div>\n            <div id=\"kpi-dist-count\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #3b82f6; margin: 0.4rem 0;\">3 Traps</div>\n            <div id=\"kpi-dist-list\" style=\"font-size: 0.8rem; color: var(--text-muted);\">Catastrophizing, Mind Reading, Fortune Telling</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #eab308; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Prefrontal Engagement</div>\n            <div style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #eab308; margin: 0.4rem 0;\">Active</div>\n            <div style=\"font-size: 0.8rem; color: var(--text-muted);\">vmPFC down-regulating amygdala</div>\n          </div>\n        </div>\n\n        <!-- Copy & Print Action Bar -->\n        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; gap: 0.75rem;\">\n          <button type=\"button\" onclick=\"window.print()\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; color: var(--fg);\">\n            <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 6 2 18 2 18 9\"></polyline><path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"></path><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\"></rect></svg>\n            <span>Print Clinical Thought Record</span>\n          </button>\n\n          <button type=\"button\" id=\"copy-summary-btn\" onclick=\"copyCbtSummary()\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; color: var(--fg); transition: background 0.15s;\">\n            <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path></svg>\n            <span>Copy CBT Thought Record</span>\n          </button>\n        </div>\n      </div>\n\n      <!-- Interactive SVG Distress Delta Gauge -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin: 0;\">Limbic Distress Shift: Before vs After Cognitive Restructuring</h3>\n          <span style=\"font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);\"><span id=\"gauge-shift-txt\">85% &rarr; 30%</span></span>\n        </div>\n        <div style=\"width: 100%; overflow-x: auto;\">\n          <svg id=\"cbt-gauge-svg\" viewBox=\"0 0 760 160\" style=\"width: 100%; height: auto; min-width: 580px; display: block; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- 7-Column Master Beckian Table (Print & Review) -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1rem;\">Complete 7-Column Beckian Thought Record</h3>\n        <div style=\"overflow-x: auto;\">\n          <table style=\"width: 100%; border-collapse: collapse; font-family: inherit; font-size: 0.85rem;\">\n            <thead>\n              <tr style=\"background: var(--surface-alt); text-align: left; border-bottom: 2px solid var(--border);\">\n                <th style=\"padding: 0.55rem; border: 1px solid var(--border); width: 14%;\">1. Situation</th>\n                <th style=\"padding: 0.55rem; border: 1px solid var(--border); width: 15%;\">2. Automatic Thought</th>\n                <th style=\"padding: 0.55rem; border: 1px solid var(--border); width: 11%;\">3. Emotion</th>\n                <th style=\"padding: 0.55rem; border: 1px solid var(--border); width: 15%;\">4. Distortions</th>\n                <th style=\"padding: 0.55rem; border: 1px solid var(--border); width: 15%;\">5. Supporting</th>\n                <th style=\"padding: 0.55rem; border: 1px solid var(--border); width: 15%;\">6. Counter-Facts</th>\n                <th style=\"padding: 0.55rem; border: 1px solid var(--border); width: 15%;\">7. Reframe</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr>\n                <td id=\"tbl-sit\" style=\"padding: 0.55rem; border: 1px solid var(--border); font-size: 0.8rem;\"></td>\n                <td id=\"tbl-ant\" style=\"padding: 0.55rem; border: 1px solid var(--border); font-size: 0.8rem; color: #ef4444;\"></td>\n                <td id=\"tbl-emo\" style=\"padding: 0.55rem; border: 1px solid var(--border); font-size: 0.8rem; font-family: var(--mono);\"></td>\n                <td id=\"tbl-dist\" style=\"padding: 0.55rem; border: 1px solid var(--border); font-size: 0.8rem;\"></td>\n                <td id=\"tbl-sup\" style=\"padding: 0.55rem; border: 1px solid var(--border); font-size: 0.8rem;\"></td>\n                <td id=\"tbl-opp\" style=\"padding: 0.55rem; border: 1px solid var(--border); font-size: 0.8rem; color: #3b82f6;\"></td>\n                <td id=\"tbl-reframe\" style=\"padding: 0.55rem; border: 1px solid var(--border); font-size: 0.8rem; color: #22c55e; font-weight: bold;\"></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n\n      <!-- 5 Critical Pitfalls & Cognitive Traps -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1rem;\">5 Critical CBT Traps & Restructuring Pitfalls</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 1.25rem;\">\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">1. Toxic Positivity vs Cognitive Realism</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                CBT is not about repeating empty affirmations like \"everything is wonderful!\" Naive optimism triggers psychological reactance and fails because your brain detects the falsehood. The goal of cognitive restructuring is factual realism—finding an objective, grounded truth that you genuinely believe.\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">2. The Emotional Reasoning Fallacy (\"I feel it, so it's real\")</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                Emotions are physiological reaction patterns driven by neural appraisals, not objective satellite photographs of external reality. Feeling like an imposter does not prove incompetence. Feeling like catastrophe is imminent does not mean danger exists. Decouple visceral sensations from factual truth.\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #3b82f6; font-size: 1.3rem; line-height: 1;\">💡</span>\n            <div>\n              <strong style=\"color: var(--fg);\">3. The Tyranny of the \"Shoulds\" (Albert Ellis)</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                Statements like \"I should never make mistakes\" or \"they must always treat me fairly\" generate chronic guilt, shame, and resentment. Cognitive psychologists call this \"musterbation.\" Reframe rigid demands into flexible preferences: \"I strongly prefer not to make mistakes, but when I do, I can learn from them.\"\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">4. Attempting Cognitive Work During Limbic Hijack</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                When heart rate spikes above 100 BPM during acute panic, the amygdala down-regulates prefrontal cortex activity. Arguing with your thoughts in this state is like trying to reason with an active fire alarm. Down-regulate your nervous system first using box breathing (4-4-4-4) or cold water immersion, then perform thought challenging once at baseline.\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">5. Confusing Objective Facts with Subjective Interpretations</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                \"My partner is mad at me\" is not a fact—it is an interpretation. The factual observation is: \"My partner walked into the kitchen and did not speak for 2 minutes.\" Keeping the Situation column strictly factual prevents pre-loading your thought record with confirmation bias.\n              </p>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      <!-- Interactive FAQ Accordion -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1.25rem;\">Frequently Asked Questions (Cognitive Behavioral Therapy)</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 0.75rem;\">\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What is a CBT 7-column thought record?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              A 7-column thought record is a core therapeutic exercise in Cognitive Behavioral Therapy developed by Dr. Aaron T. Beck. It guides individuals through systematically identifying an activating event, isolating automatic negative thoughts (ANTs), rating emotional intensity, identifying cognitive distortions, examining objective evidence for and against the thought, and constructing a balanced, realistic reframe.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What are the most common cognitive distortions in CBT?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              As identified by Dr. David Burns in 'Feeling Good', common cognitive distortions include: All-or-Nothing Thinking (black-and-white evaluation), Catastrophizing (assuming the worst outcome), Mind Reading (assuming you know what others think), Fortune Telling (predicting negative futures), Emotional Reasoning ('I feel it, therefore it must be true'), Mental Filter (fixating on a single flaw), and 'Should' Statements (rigid demands creating guilt).\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">Is Cognitive Behavioral Therapy just 'positive thinking'?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              No. In fact, CBT explicitly rejects naive positive thinking or 'toxic positivity'. The goal of CBT is cognitive realism—replacing distorted, catastrophizing thoughts with accurate, evidence-based assessments of reality. If a situation is genuinely difficult, CBT helps you see it clearly without magnifying it into catastrophe or minimizing your coping agency.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">Why doesn't logic work when you are in the middle of a panic attack?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              During acute panic or hyper-arousal, the amygdala initiates a fight-or-flight response, shunting blood flow away from the prefrontal cortex (executive reasoning center). Cognitive restructuring requires prefrontal engagement. If emotional distress is above 85–90%, somatic down-regulation (box breathing, physiological sigh, cold water immersion) must be used first to soothe the autonomic nervous system before challenging thoughts.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">How does cognitive restructuring change brain function over time?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Neuroimaging studies demonstrate that practicing cognitive restructuring strengthens functional connectivity between the ventromedial prefrontal cortex (vmPFC) and the amygdala. Through neuroplasticity, repeatedly questioning automatic negative thoughts weakens habitual negative neural pathways and establishes more resilient cognitive appraisals.\n            </p>\n          </details>\n        </div>\n      </section>\n    </div>\n\n    <script>\n      function updateCbt() {\n        var pre = parseInt(document.getElementById('cbt-pre').value, 10) || 0;\n        var post = parseInt(document.getElementById('cbt-post').value, 10) || 0;\n        var delta = post - pre;\n\n        document.getElementById('cbt-pre-val').textContent = pre + '%';\n        document.getElementById('cbt-post-val').textContent = post + '%';\n\n        var deltaEl = document.getElementById('cbt-delta');\n        deltaEl.textContent = (delta <= 0 ? '' : '+') + delta + '%';\n        deltaEl.style.color = (delta <= 0 ? '#22c55e' : '#ef4444');\n\n        document.getElementById('kpi-relief').textContent = (delta <= 0 ? '' : '+') + delta + '%';\n        document.getElementById('kpi-relief').style.color = (delta <= 0 ? '#22c55e' : '#ef4444');\n        document.getElementById('kpi-pre-txt').textContent = pre + '%';\n        document.getElementById('kpi-post-txt').textContent = post + '%';\n\n        // Count distortions\n        var checkedDist = Array.from(document.querySelectorAll('.cbt-dist:checked')).map(c => c.value);\n        document.getElementById('kpi-dist-count').textContent = checkedDist.length + ' Traps';\n        document.getElementById('kpi-dist-list').textContent = checkedDist.length > 0 ? checkedDist.join(', ') : 'None selected';\n\n        // Update table\n        document.getElementById('tbl-sit').textContent = document.getElementById('cbt-sit').value;\n        document.getElementById('tbl-ant').textContent = document.getElementById('cbt-ant').value;\n        document.getElementById('tbl-emo').textContent = document.getElementById('cbt-emotion').value + ' (' + pre + '% → ' + post + '%)';\n        document.getElementById('tbl-dist').textContent = checkedDist.join(', ');\n        document.getElementById('tbl-sup').textContent = document.getElementById('cbt-sup').value;\n        document.getElementById('tbl-opp').textContent = document.getElementById('cbt-opp').value;\n        document.getElementById('tbl-reframe').textContent = document.getElementById('cbt-reframe').value;\n\n        document.getElementById('gauge-shift-txt').textContent = pre + '% → ' + post + '% (' + (delta <= 0 ? '' : '+') + delta + '%)';\n\n        renderCbtGauge(pre, post);\n      }\n\n      function renderCbtGauge(preVal, postVal) {\n        var svg = document.getElementById('cbt-gauge-svg');\n        var w = 760, h = 160;\n        var padLeft = 140, padRight = 60;\n        var barW = w - padLeft - padRight;\n\n        var svgContent = '';\n\n        // Pre bar\n        var preW = (preVal / 100) * barW;\n        svgContent += '<text x=\"' + (padLeft - 15) + '\" y=\"50\" font-size=\"12\" font-weight=\"bold\" fill=\"#ef4444\" text-anchor=\"end\">Initial Distress</text>';\n        svgContent += '<rect x=\"' + padLeft + '\" y=\"32\" width=\"' + barW + '\" height=\"26\" fill=\"var(--surface-alt)\" rx=\"4\" stroke=\"var(--border)\" stroke-width=\"1\" />';\n        svgContent += '<rect x=\"' + padLeft + '\" y=\"32\" width=\"' + preW + '\" height=\"26\" fill=\"#ef4444\" rx=\"4\">';\n        svgContent += '<title>Initial: ' + preVal + '%</title></rect>';\n        svgContent += '<text x=\"' + (padLeft + preW + 10) + '\" y=\"49\" font-size=\"12\" font-weight=\"bold\" font-family=\"var(--mono)\" fill=\"#ef4444\">' + preVal + '%</text>';\n\n        // Post bar\n        var postW = (postVal / 100) * barW;\n        svgContent += '<text x=\"' + (padLeft - 15) + '\" y=\"110\" font-size=\"12\" font-weight=\"bold\" fill=\"#22c55e\" text-anchor=\"end\">Re-Rated Distress</text>';\n        svgContent += '<rect x=\"' + padLeft + '\" y=\"92\" width=\"' + barW + '\" height=\"26\" fill=\"var(--surface-alt)\" rx=\"4\" stroke=\"var(--border)\" stroke-width=\"1\" />';\n        svgContent += '<rect x=\"' + padLeft + '\" y=\"92\" width=\"' + postW + '\" height=\"26\" fill=\"#22c55e\" rx=\"4\">';\n        svgContent += '<title>Re-rated: ' + postVal + '%</title></rect>';\n        svgContent += '<text x=\"' + (padLeft + postW + 10) + '\" y=\"109\" font-size=\"12\" font-weight=\"bold\" font-family=\"var(--mono)\" fill=\"#22c55e\">' + postVal + '%</text>';\n\n        // Gridlines\n        for (var i = 0; i <= 4; i++) {\n          var x = padLeft + (i / 4) * barW;\n          svgContent += '<line x1=\"' + x + '\" y1=\"20\" x2=\"' + x + '\" y2=\"130\" stroke=\"var(--border)\" stroke-width=\"1\" stroke-dasharray=\"2,2\" />';\n          svgContent += '<text x=\"' + x + '\" y=\"145\" font-size=\"9\" fill=\"var(--text-muted)\" text-anchor=\"middle\">' + (i * 25) + '%</text>';\n        }\n\n        svg.innerHTML = svgContent;\n      }\n\n      function copyCbtSummary() {\n        var sit = document.getElementById('cbt-sit').value;\n        var ant = document.getElementById('cbt-ant').value;\n        var emo = document.getElementById('cbt-emotion').value;\n        var pre = document.getElementById('cbt-pre-val').textContent;\n        var post = document.getElementById('cbt-post-val').textContent;\n        var delta = document.getElementById('cbt-delta').textContent;\n        var checkedDist = Array.from(document.querySelectorAll('.cbt-dist:checked')).map(c => c.value).join(', ');\n        var reframe = document.getElementById('cbt-reframe').value;\n\n        var text = '=== CBT 7-COLUMN THOUGHT RECORD ===\\n' +\n                   '1. Situation: ' + sit + '\\n' +\n                   '2. Automatic Negative Thought: ' + ant + '\\n' +\n                   '3. Emotion: ' + emo + ' (' + pre + ' → ' + post + ' | Shift: ' + delta + ')\\n' +\n                   '4. Cognitive Distortions: ' + (checkedDist || 'None') + '\\n' +\n                   '5. Rational Reframe: ' + reframe + '\\n\\n' +\n                   'Restructured via Digital Tools Shed (digitaltoolsshed.com/health/cbt-thought-challenger)';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copy-summary-btn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span style=\"color:#22c55e; font-weight:bold;\">✓ Copied to Clipboard!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2500);\n        });\n      }\n\n      document.addEventListener('DOMContentLoaded', updateCbt);\n    </script>\n  "
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
  "slug": "burnout-calculator",
  "title": "Clinical Burnout Assessment & Depletion Index (Maslach MBI & WHO ICD-11)",
  "metaDesc": "Evaluate occupational burnout across Emotional Exhaustion, Cynicism/Depersonalization, and Professional Efficacy using the validated Maslach Burnout Inventory framework.",
  "faq": [
    {
      "q": "How does the World Health Organization (WHO) define burnout?",
      "a": "In the 11th Revision of the International Classification of Diseases (ICD-11, Code QD85), the WHO defines burnout as an occupational phenomenon resulting from chronic workplace stress that has not been successfully managed. It is characterized by three dimensions: (1) feelings of energy depletion or exhaustion; (2) increased mental distance from one's job, or feelings of negativism or cynicism; and (3) a sense of ineffectiveness and lack of accomplishment."
    },
    {
      "q": "What is the Maslach Burnout Inventory (MBI)?",
      "a": "The Maslach Burnout Inventory (MBI), developed by Dr. Christina Maslach and Dr. Susan Jackson, is the recognized gold standard psychometric instrument for assessing occupational burnout. It assesses three independent subscales: Emotional Exhaustion (EE), Depersonalization/Cynicism (DP), and Personal Accomplishment/Professional Efficacy (PA)."
    },
    {
      "q": "What is the difference between chronic stress, burnout, and clinical depression?",
      "a": "Chronic stress involves over-engagement, hyperactivity, and heightened emotional responses (anxiety). Burnout involves disengagement, blunted emotions, cynicism, and helplessness specifically centered on one's occupational environment. Clinical depression (MDD) permeates all domains of life (family, hobbies, relationships), whereas early-stage burnout is domain-specific to the work environment."
    },
    {
      "q": "Why doesn't taking a one-week vacation cure burnout?",
      "a": "Clinical research shows that while vacations provide acute relief from work stressors, salivary cortisol levels, sleep fragmentation, and emotional exhaustion return to pre-vacation baseline levels within 48 to 72 hours of returning to the unchanged work environment. Burnout is a structural mismatch between workload, control, reward, fairness, and values—not a vacation deficit."
    },
    {
      "q": "What are the physical symptoms of severe clinical burnout?",
      "a": "Severe burnout causes dysregulation of the hypothalamic-pituitary-adrenal (HPA) axis, leading to: chronic morning fatigue, elevated resting heart rate, tension headaches, gastrointestinal disturbances (IBS), frequent viral infections due to suppressed immune function, insomnia or early morning awakening, and brain fog."
    }
  ],
  "body": "\n    <div class=\"article-container\" style=\"max-width: 950px; margin: 0 auto; padding: 0 1rem;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\" style=\"color: inherit; text-decoration: underline;\">Home</a> &gt; <a href=\"/health/\" style=\"color: inherit; text-decoration: underline;\">Health</a> &gt; Burnout Calculator\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2;\">Clinical Burnout & Occupational Depletion Index</h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Based on the gold-standard Maslach Burnout Inventory (MBI-GS) and WHO ICD-11 criteria. Assess your depletion across Emotional Exhaustion, Cynicism, and Reduced Professional Efficacy to identify your burnout phase and recovery strategy.\n        </p>\n      </header>\n\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.04);\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;\">Psychometric Assessment (12 Clinical Items)</h2>\n        <p style=\"color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.5rem;\">\n          Rate how frequently you experience each statement on the 7-point clinical scale (0 = Never to 6 = Daily):\n        </p>\n\n        <div id=\"mbi-items-container\" style=\"display: flex; flex-direction: column; gap: 1.25rem;\">\n          <!-- Dynamically generated items -->\n        </div>\n\n        <div style=\"text-align: center; margin-top: 2rem;\">\n          <button type=\"button\" class=\"btn-primary\" onclick=\"calcBurnout()\" style=\"padding: 0.85rem 2.5rem; font-size: 1.05rem; cursor: pointer;\">\n            🧠 Calculate Clinical Burnout Index\n          </button>\n        </div>\n\n        <!-- Result Box (Hidden until calculated) -->\n        <div id=\"burnout-result-card\" style=\"display: none; margin-top: 2rem; padding-top: 2rem; border-top: 2px solid var(--border);\">\n          <!-- Hero KPI Cards -->\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;\">\n            <div id=\"card-bo-status\" style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n              <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Composite Burnout Index</div>\n              <div id=\"kpi-bo-score\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #ef4444; margin: 0.4rem 0;\">76%</div>\n              <div id=\"kpi-bo-verdict\" style=\"font-size: 0.85rem; font-weight: bold; color: #ef4444;\">Severe Clinical Burnout</div>\n            </div>\n\n            <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n              <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Emotional Exhaustion (EE)</div>\n              <div id=\"kpi-bo-ee\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #3b82f6; margin: 0.4rem 0;\">88%</div>\n              <div style=\"font-size: 0.8rem; color: var(--text-muted);\">Chronic Vital Energy Depletion</div>\n            </div>\n\n            <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #eab308; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n              <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Cynicism &amp; Detachment (CY)</div>\n              <div id=\"kpi-bo-cy\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #eab308; margin: 0.4rem 0;\">75%</div>\n              <div style=\"font-size: 0.8rem; color: var(--text-muted);\">Defensive Emotional Shielding</div>\n            </div>\n\n            <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #8b5cf6; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n              <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Inefficacy / Low Accomplishment</div>\n              <div id=\"kpi-bo-pe\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #8b5cf6; margin: 0.4rem 0;\">65%</div>\n              <div style=\"font-size: 0.8rem; color: var(--text-muted);\">Erosion of Self-Competence</div>\n            </div>\n          </div>\n\n          <!-- Clinical Intervention Text -->\n          <div id=\"bo-intervention-box\" style=\"margin-top: 1.5rem; padding: 1.25rem; background: var(--surface-alt); border-left: 4px solid #ef4444; border-radius: 0 6px 6px 0; font-size: 0.95rem; line-height: 1.6;\"></div>\n\n          <!-- Copy Action Bar -->\n          <div style=\"display: flex; justify-content: flex-end; margin-top: 1.25rem;\">\n            <button type=\"button\" id=\"copy-summary-btn\" onclick=\"copyBurnoutSummary()\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; color: var(--fg); transition: background 0.15s;\">\n              <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path></svg>\n              <span>Copy Clinical Assessment Summary</span>\n            </button>\n          </div>\n        </div>\n      </div>\n\n      <!-- Interactive SVG Tri-Axis Radar / Dimension Chart -->\n      <div id=\"bo-chart-wrapper\" style=\"display: none; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin: 0;\">MBI Tri-Dimensional Depletion Profile</h3>\n          <span style=\"font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);\">Maslach General Survey Profile</span>\n        </div>\n        <div style=\"width: 100%; overflow-x: auto;\">\n          <svg id=\"bo-radar-svg\" viewBox=\"0 0 760 280\" style=\"width: 100%; height: auto; min-width: 580px; display: block; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- The 4 Stages of Occupational Burnout -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1rem;\">The 4 Progressive Stages of Burnout</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 1rem;\">\n          <div style=\"background: var(--surface-alt); border-left: 4px solid #22c55e; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;\">\n            <div style=\"font-weight: bold; color: #22c55e; margin-bottom: 0.25rem;\">Stage 1: The Honeymoon & Compulsion to Prove (<25%)</div>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              High enthusiasm, excessive ambition, and willingness to work late. The individual takes on oversized responsibilities and ignores subtle early signals of fatigue.\n            </p>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border-left: 4px solid #eab308; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;\">\n            <div style=\"font-weight: bold; color: #eab308; margin-bottom: 0.25rem;\">Stage 2: Chronic Stress & Neglect of Needs (25%–49%)</div>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Sleep is compromised; meals are eaten at desks; social obligations are cancelled. Irritability surfaces and early physiological symptoms (headaches, neck tension, mild insomnia) manifest.\n            </p>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border-left: 4px solid #f97316; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;\">\n            <div style=\"font-weight: bold; color: #f97316; margin-bottom: 0.25rem;\">Stage 3: Cynicism, Depersonalization & Defensive Shell (50%–74%)</div>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Emotional exhaustion drives the individual into detachment. Clients, patients, or colleagues are viewed callously. Work feels meaningless, and self-efficacy collapses.\n            </p>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border-left: 4px solid #ef4444; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;\">\n            <div style=\"font-weight: bold; color: #ef4444; margin-bottom: 0.25rem;\">Stage 4: Complete Autonomic Collapse & Crisis (≥75%)</div>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              HPA-axis dysfunction and adrenal fatigue. The individual cannot get out of bed, experiences panic attacks or numbness, suffers severe cognitive dysfunction, and requires medical leaves of absence.\n            </p>\n          </div>\n        </div>\n      </section>\n\n      <!-- 5 Critical Pitfalls & Traps -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1rem;\">5 Critical Clinical Traps in Treating Burnout</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 1.25rem;\">\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">1. The \"Vacation Will Fix It\" Illusion</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                A vacation treats acute exhaustion, but it cannot fix structural workplace misalignment. Clinical studies show that salivary cortisol and stress markers return to pre-vacation baseline within 48 to 72 hours of returning to the unchanged workload. Recovery requires structural changes in boundary conditions and workload.\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">2. The Over-Functioning \"Hero\" Trap</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                High performers repeatedly rescue broken organizational processes by working 65+ hour weeks. By absorbing the friction, the hero prevents the organization from feeling the pain of understaffing, ensuring that workload will never be rationalized until the hero physically collapses.\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #3b82f6; font-size: 1.3rem; line-height: 1;\">💡</span>\n            <div>\n              <strong style=\"color: var(--fg);\">3. Differential Diagnosis: Burnout vs Major Depression</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                Burnout is context-specific: when an employee with burnout is away from work on a Saturday with family, they often experience joy and engagement. Major Depressive Disorder (MDD) involves global anhedonia that blankets all areas of life. If personal hobbies no longer bring pleasure, clinical depression may be co-occurring.\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">4. Institutional Gaslighting & \"Wellness\" Programs</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                When organizations offer mandatory 30-minute lunchtime meditation sessions or breathing seminars instead of addressing chronic understaffing, impossible deadlines, and toxic management, they engage in institutional gaslighting—framing systemic failures as personal resilience deficits.\n              </p>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; align-items: flex-start;\">\n            <span style=\"color: #ef4444; font-size: 1.3rem; line-height: 1;\">⚠️</span>\n            <div>\n              <strong style=\"color: var(--fg);\">5. Autonomic Parasympathetic Collapse</strong>\n              <p style=\"margin: 0.25rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n                After months of intense sympathetic nervous system arousal (fight-or-flight), the human body eventually triggers a dorsal vagal freeze response. The individual transitions from hyper-anxious insomnia to profound physical exhaustion, unable to muster the physiological energy to get out of bed.\n              </p>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      <!-- Interactive FAQ Accordion -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1.25rem;\">Frequently Asked Questions (Clinical Burnout & Recovery)</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 0.75rem;\">\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">How does the World Health Organization (WHO) define burnout?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              In the 11th Revision of the International Classification of Diseases (ICD-11, Code QD85), the WHO defines burnout as an occupational phenomenon resulting from chronic workplace stress that has not been successfully managed. It is characterized by three dimensions: (1) feelings of energy depletion or exhaustion; (2) increased mental distance from one's job, or feelings of negativism or cynicism; and (3) a sense of ineffectiveness and lack of accomplishment.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What is the Maslach Burnout Inventory (MBI)?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              The Maslach Burnout Inventory (MBI), developed by Dr. Christina Maslach and Dr. Susan Jackson, is the recognized gold standard psychometric instrument for assessing occupational burnout. It assesses three independent subscales: Emotional Exhaustion (EE), Depersonalization/Cynicism (DP), and Personal Accomplishment/Professional Efficacy (PA).\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What is the difference between chronic stress, burnout, and clinical depression?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Chronic stress involves over-engagement, hyperactivity, and heightened emotional responses (anxiety). Burnout involves disengagement, blunted emotions, cynicism, and helplessness specifically centered on one's occupational environment. Clinical depression (MDD) permeates all domains of life (family, hobbies, relationships), whereas early-stage burnout is domain-specific to the work environment.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">Why doesn't taking a one-week vacation cure burnout?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Clinical research shows that while vacations provide acute relief from work stressors, salivary cortisol levels, sleep fragmentation, and emotional exhaustion return to pre-vacation baseline levels within 48 to 72 hours of returning to the unchanged work environment. Burnout is a structural mismatch between workload, control, reward, fairness, and values—not a vacation deficit.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What are the physical symptoms of severe clinical burnout?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Severe burnout causes dysregulation of the hypothalamic-pituitary-adrenal (HPA) axis, leading to: chronic morning fatigue, elevated resting heart rate, tension headaches, gastrointestinal disturbances (IBS), frequent viral infections due to suppressed immune function, insomnia or early morning awakening, and brain fog.\n            </p>\n          </details>\n        </div>\n      </section>\n    </div>\n\n    <script>\n      var MBI_ITEMS = [\n        { id: 'q1', text: 'I feel emotionally drained and depleted from my work.', dim: 'EE' },\n        { id: 'q2', text: 'I feel used up, empty, and exhausted at the end of the workday.', dim: 'EE' },\n        { id: 'q3', text: 'I feel fatigued when I wake up in the morning and have to face another day on the job.', dim: 'EE' },\n        { id: 'q4', text: 'Working with people all day is really a strain for me.', dim: 'EE' },\n        { id: 'q5', text: 'I have become significantly more cynical and detached about whether my work contributes anything.', dim: 'CY' },\n        { id: 'q6', text: 'I doubt the significance and value of my work.', dim: 'CY' },\n        { id: 'q7', text: 'I just want to do my job and not be bothered by anyone.', dim: 'CY' },\n        { id: 'q8', text: 'I have become more callous or hardened toward colleagues, clients, or customers.', dim: 'CY' },\n        { id: 'q9', text: 'I feel I am making an effective and worthwhile contribution at my work.', dim: 'PE', rev: true },\n        { id: 'q10', text: 'In my opinion, I am very good at my job.', dim: 'PE', rev: true },\n        { id: 'q11', text: 'I feel exhilarated, energized, and satisfied when accomplishing things at work.', dim: 'PE', rev: true },\n        { id: 'q12', text: 'I have accomplished many worthwhile, fulfilling things in this job.', dim: 'PE', rev: true }\n      ];\n\n      function renderMbiItems() {\n        var container = document.getElementById('mbi-items-container');\n        var html = '';\n        var scaleLabels = ['0<br>Never', '1<br>Rarely', '2<br>Monthly', '3<br>2-3x/Mo', '4<br>Weekly', '5<br>Few/Wk', '6<br>Daily'];\n\n        MBI_ITEMS.forEach(function(item, idx) {\n          html += '<div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;\">';\n          html += '<div style=\"font-size: 0.95rem; font-weight: bold; margin-bottom: 0.6rem; color: var(--fg);\">' + (idx + 1) + '. ' + item.text + '</div>';\n          html += '<div style=\"display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; text-align: center;\">';\n          \n          for (var v = 0; v <= 6; v++) {\n            var checked = (v === 3) ? ' checked' : '';\n            html += '<label style=\"display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 0.4rem 0.2rem; cursor: pointer; font-size: 0.75rem; font-family: var(--mono);\">';\n            html += '<input type=\"radio\" name=\"' + item.id + '\" value=\"' + v + '\"' + checked + ' style=\"margin-bottom: 0.2rem; cursor: pointer;\">';\n            html += scaleLabels[v];\n            html += '</label>';\n          }\n\n          html += '</div></div>';\n        });\n\n        container.innerHTML = html;\n      }\n\n      function calcBurnout() {\n        var eeRaw = 0, cyRaw = 0, peRaw = 0;\n\n        MBI_ITEMS.forEach(function(item) {\n          var sel = document.querySelector('input[name=\"' + item.id + '\"]:checked');\n          var val = sel ? parseInt(sel.value, 10) : 3;\n\n          if (item.dim === 'EE') eeRaw += val;\n          else if (item.dim === 'CY') cyRaw += val;\n          else if (item.dim === 'PE') {\n            // Reverse score: high frequency of accomplishment means low inefficacy\n            peRaw += (item.rev ? (6 - val) : val);\n          }\n        });\n\n        // 4 items per dimension * max 6 = 24 points per dimension\n        var maxPerDim = 24;\n        var eePct = Math.round((eeRaw / maxPerDim) * 100);\n        var cyPct = Math.round((cyRaw / maxPerDim) * 100);\n        var pePct = Math.round((peRaw / maxPerDim) * 100);\n\n        // Weighted composite score (EE 45%, CY 35%, PE 20%)\n        var composite = Math.round((eePct * 0.45) + (cyPct * 0.35) + (pePct * 0.20));\n\n        // Display results\n        document.getElementById('burnout-result-card').style.display = 'block';\n        document.getElementById('bo-chart-wrapper').style.display = 'block';\n\n        var scoreEl = document.getElementById('kpi-bo-score');\n        var verdictEl = document.getElementById('kpi-bo-verdict');\n        var cardStatus = document.getElementById('card-bo-status');\n        var intBox = document.getElementById('bo-intervention-box');\n\n        scoreEl.textContent = composite + '%';\n        document.getElementById('kpi-bo-ee').textContent = eePct + '%';\n        document.getElementById('kpi-bo-cy').textContent = cyPct + '%';\n        document.getElementById('kpi-bo-pe').textContent = pePct + '%';\n\n        var color = '#ef4444', verdict = '', intHtml = '';\n\n        if (composite >= 75) {\n          color = '#ef4444';\n          verdict = 'Stage 4: Severe Clinical Burnout';\n          intHtml = '<strong>🚨 Immediate Medical & Occupational Crisis Protocol:</strong> You are operating in profound autonomic nervous system dysregulation. Your body is in parasympathetic collapse. <em>Mandatory Actions:</em> Schedule an appointment with your primary care physician or mental health professional immediately. Consult on medical stress leave (FMLA in the US). Do not attempt to \"push through\"—further work will cause severe physiological illness.';\n        } else if (composite >= 50) {\n          color = '#f97316';\n          verdict = 'Stage 3: Advanced Pre-Burnout Depletion';\n          intHtml = '<strong>⚠️ Critical Boundary Intervention Required:</strong> Cynicism and emotional exhaustion have become severe defensive mechanisms. <em>Immediate Actions:</em> Implement rigid digital shutdown boundaries at 5:00 PM. Refuse all new non-essential tasks with prepared scripts. Protect weekends strictly for nervous system restoration.';\n        } else if (composite >= 25) {\n          color = '#eab308';\n          verdict = 'Stage 2: Chronic Work Strain & Stress';\n          intHtml = '<strong>Moderate Strain Warning:</strong> You are burning emotional resources faster than you can regenerate them. Institute a mandatory 60-minute evening wind-down routine, cease checking Slack/email after dinner, and evaluate whether your workload can be delegated.';\n        } else {\n          color = '#22c55e';\n          verdict = 'Stage 1: Resilient Occupational Baseline';\n          intHtml = '<strong>✅ Healthy Occupational Equilibrium:</strong> You retain healthy emotional boundaries, genuine personal accomplishment, and restorative energy. Maintain your sleep discipline, social connection, and clear boundaries between work identity and personal self-worth.';\n        }\n\n        scoreEl.style.color = color;\n        verdictEl.textContent = verdict;\n        verdictEl.style.color = color;\n        cardStatus.style.borderTopColor = color;\n        intBox.style.borderLeftColor = color;\n        intBox.innerHTML = intHtml;\n\n        // Render SVG Dimension Chart\n        renderBoSvg(eePct, cyPct, pePct, composite);\n\n        // Scroll into view\n        document.getElementById('burnout-result-card').scrollIntoView({ behavior: 'smooth' });\n      }\n\n      function renderBoSvg(ee, cy, pe, composite) {\n        var svg = document.getElementById('bo-radar-svg');\n        var w = 760, h = 280;\n        var padLeft = 240, padRight = 60;\n        var barAreaW = w - padLeft - padRight;\n\n        var svgContent = '';\n\n        var dims = [\n          { name: 'Emotional Exhaustion (EE)', pct: ee, color: '#3b82f6', sub: 'Vital energy & stamina deficit' },\n          { name: 'Cynicism / Detachment (CY)', pct: cy, color: '#eab308', sub: 'Protective emotional callousness' },\n          { name: 'Inefficacy / Low Efficacy (PE)', pct: pe, color: '#8b5cf6', sub: 'Loss of perceived competence' },\n          { name: 'Overall Burnout Composite', pct: composite, color: (composite >= 50 ? '#ef4444' : '#22c55e'), sub: 'MBI-GS Weighted Clinical Index' }\n        ];\n\n        dims.forEach(function(d, idx) {\n          var y = 35 + (idx * 60);\n          var barW = (d.pct / 100) * barAreaW;\n\n          // Dimension title & subtitle\n          svgContent += '<text x=\"' + (padLeft - 15) + '\" y=\"' + y + '\" font-size=\"12\" font-weight=\"bold\" fill=\"var(--fg)\" text-anchor=\"end\">' + d.name + '</text>';\n          svgContent += '<text x=\"' + (padLeft - 15) + '\" y=\"' + (y + 16) + '\" font-size=\"10\" fill=\"var(--text-muted)\" text-anchor=\"end\">' + d.sub + '</text>';\n\n          // Background Bar\n          svgContent += '<rect x=\"' + padLeft + '\" y=\"' + (y - 14) + '\" width=\"' + barAreaW + '\" height=\"22\" fill=\"var(--surface-alt)\" rx=\"4\" stroke=\"var(--border)\" stroke-width=\"1\" />';\n\n          // Active Value Bar\n          svgContent += '<rect x=\"' + padLeft + '\" y=\"' + (y - 14) + '\" width=\"' + barW + '\" height=\"22\" fill=\"' + d.color + '\" rx=\"4\">';\n          svgContent += '<title>' + d.name + ': ' + d.pct + '%</title></rect>';\n\n          // Percentage Label\n          svgContent += '<text x=\"' + (padLeft + barAreaW + 10) + '\" y=\"' + (y + 2) + '\" font-size=\"12\" font-weight=\"bold\" font-family=\"var(--mono)\" fill=\"' + d.color + '\">' + d.pct + '%</text>';\n        });\n\n        // Threshold Markers (50% and 75%)\n        var t50 = padLeft + (0.5 * barAreaW);\n        var t75 = padLeft + (0.75 * barAreaW);\n        svgContent += '<line x1=\"' + t50 + '\" y1=\"15\" x2=\"' + t50 + '\" y2=\"255\" stroke=\"#eab308\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\" />';\n        svgContent += '<text x=\"' + t50 + '\" y=\"270\" font-size=\"9\" fill=\"#eab308\" text-anchor=\"middle\">50% High</text>';\n\n        svgContent += '<line x1=\"' + t75 + '\" y1=\"15\" x2=\"' + t75 + '\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\" />';\n        svgContent += '<text x=\"' + t75 + '\" y=\"270\" font-size=\"9\" fill=\"#ef4444\" text-anchor=\"middle\">75% Critical</text>';\n\n        svg.innerHTML = svgContent;\n      }\n\n      function copyBurnoutSummary() {\n        var score = document.getElementById('kpi-bo-score').textContent;\n        var verdict = document.getElementById('kpi-bo-verdict').textContent;\n        var ee = document.getElementById('kpi-bo-ee').textContent;\n        var cy = document.getElementById('kpi-bo-cy').textContent;\n        var pe = document.getElementById('kpi-bo-pe').textContent;\n\n        var text = '=== CLINICAL BURNOUT & DEPLETION AUDIT (MBI-GS) ===\\n' +\n                   'Composite Burnout Index: ' + score + ' (' + verdict + ')\\n\\n' +\n                   '• Emotional Exhaustion (EE): ' + ee + '\\n' +\n                   '• Cynicism / Depersonalization (CY): ' + cy + '\\n' +\n                   '• Inefficacy / Reduced Accomplishment (PE): ' + pe + '\\n\\n' +\n                   'Evaluation Date: ' + new Date().toLocaleDateString() + '\\n' +\n                   'Evaluated via Digital Tools Shed (digitaltoolsshed.com/health/burnout-calculator)';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copy-summary-btn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span style=\"color:#22c55e; font-weight:bold;\">✓ Copied to Clipboard!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2500);\n        });\n      }\n\n      document.addEventListener('DOMContentLoaded', renderMbiItems);\n    </script>\n  "
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
  "slug": "sleep-debt-calculator",
  "title": "Cumulative Sleep Debt & Circadian Recovery Calculator (PVT & BAC Equivalence)",
  "metaDesc": "Calculate your accumulated 7-day sleep deficit, equivalent blood alcohol concentration (BAC) impairment, attention lapses, and safe 4-day recovery schedule.",
  "faq": [
    {
      "q": "What is cumulative sleep debt and how is it calculated?",
      "a": "Cumulative sleep debt is the running total of lost sleep hours relative to your biological sleep baseline over a rolling 7- to 14-day window. If your body requires 8.0 hours of sleep per night to maintain cognitive homeostasis, but you average only 6.0 hours Monday through Friday, you accumulate a 10.0-hour sleep debt before the weekend begins."
    },
    {
      "q": "How does sleep deprivation compare to blood alcohol concentration (BAC)?",
      "a": "Landmark research from the Walter Reed Army Institute of Research and the University of Pennsylvania (Van Dongen & Dinges) showed that being awake for 17 to 19 hours produces psychomotor vigilance impairments equivalent to a blood alcohol concentration (BAC) of 0.05%. Being awake for 24 continuous hours—or accumulating 10+ hours of sleep debt across a week—produces cognitive lapses, reaction time delays, and microsleep vulnerability equivalent to a 0.08% BAC (the legal intoxication limit for driving)."
    },
    {
      "q": "Can you recover from sleep debt by sleeping in on the weekend?",
      "a": "Not completely, and doing so often backfires. Sleeping in 3 to 4 hours on Saturday and Sunday creates 'social jetlag' by shifting your master circadian clock (suprachiasmatic nucleus) and delaying Sunday night melatonin release. While extra weekend sleep helps clear some metabolic adenosine backlog, full neurobehavioral recovery from chronic sleep debt requires 4 to 9 consecutive nights of extended sleep opportunity (+60 to +90 minutes per night) without shifting your wake time by more than 60 minutes."
    },
    {
      "q": "Why do I stop feeling tired after several days of 6 hours of sleep?",
      "a": "This is the 'subjective adaptation illusion'. Clinical sleep restriction studies demonstrate that while your subjective perception of sleepiness levels off after 3 to 4 days, objective cognitive testing (attention span, working memory, emotional regulation, and microsleep frequency) continues to deteriorate linearly. You feel 'used to it' only because your prefrontal cortex has lost the metacognitive capacity to accurately assess its own impairment."
    },
    {
      "q": "What is the best way to safely repay a sleep debt?",
      "a": "Rather than sleeping late into the afternoon, repay sleep debt incrementally: (1) Go to bed 60 to 90 minutes earlier for 4 to 7 consecutive nights; (2) Take a 20- to 25-minute power nap between 12:30 PM and 2:00 PM; (3) Maintain a consistent morning wake time (within 1 hour) to keep your circadian rhythm anchored; and (4) Get 15 minutes of direct morning sunlight to synchronize cortisol and melatonin rhythms."
    }
  ],
  "body": "\n    <div class=\"article-container\" style=\"max-width: 950px; margin: 0 auto; padding: 0 1rem;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\" style=\"color: inherit; text-decoration: underline;\">Home</a> &gt; <a href=\"/health/\" style=\"color: inherit; text-decoration: underline;\">Health</a> &gt; Sleep Debt Calculator\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2;\">Cumulative Sleep Debt & Circadian Recovery Calculator</h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Quantify your 7-day metabolic sleep deficit, equivalent blood alcohol concentration (BAC) cognitive impairment, and psychomotor vigilance drop. Generates an evidence-based circadian recovery protocol that avoids Sunday night social jetlag.\n        </p>\n      </header>\n\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.04);\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1.25rem;\">7-Day Sleep Log & Baseline Parameters</h2>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Individual Nightly Sleep Need (Baseline):</label>\n            <input type=\"number\" id=\"sd-baseline\" value=\"8.0\" min=\"6.0\" max=\"10.0\" step=\"0.25\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcSleepDebt()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">Adult biological requirement (typically 7.5 – 8.5h).</span>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Quick Sleep Profile Presets:</label>\n            <div style=\"display: flex; gap: 0.35rem; flex-wrap: wrap;\">\n              <button type=\"button\" onclick=\"setPreset('rested')\" style=\"flex: 1; min-width: 90px; padding: 0.35rem 0.5rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">Rested (8h/night)</button>\n              <button type=\"button\" onclick=\"setPreset('tech')\" style=\"flex: 1; min-width: 90px; padding: 0.35rem 0.5rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">Tech Crunch (6h/night)</button>\n              <button type=\"button\" onclick=\"setPreset('allnighter')\" style=\"flex: 1; min-width: 90px; padding: 0.35rem 0.5rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">1 All-Nighter</button>\n              <button type=\"button\" onclick=\"setPreset('severe')\" style=\"flex: 1; min-width: 90px; padding: 0.35rem 0.5rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">Burnout (5h/night)</button>\n            </div>\n          </div>\n        </div>\n\n        <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.5rem;\">Hours Slept Each Night Over the Past 7 Days:</label>\n        <div style=\"display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; margin-bottom: 1.5rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.3rem; text-align: center;\">\n            <span style=\"font-family: var(--mono); font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 0.3rem;\">MON</span>\n            <input type=\"number\" id=\"sd-d1\" value=\"6.5\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; text-align: center; padding: 0.4rem 0; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 3px; font-family: var(--mono); font-size: 1rem;\" oninput=\"calcSleepDebt()\" />\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.3rem; text-align: center;\">\n            <span style=\"font-family: var(--mono); font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 0.3rem;\">TUE</span>\n            <input type=\"number\" id=\"sd-d2\" value=\"6.0\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; text-align: center; padding: 0.4rem 0; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 3px; font-family: var(--mono); font-size: 1rem;\" oninput=\"calcSleepDebt()\" />\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.3rem; text-align: center;\">\n            <span style=\"font-family: var(--mono); font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 0.3rem;\">WED</span>\n            <input type=\"number\" id=\"sd-d3\" value=\"5.5\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; text-align: center; padding: 0.4rem 0; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 3px; font-family: var(--mono); font-size: 1rem;\" oninput=\"calcSleepDebt()\" />\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.3rem; text-align: center;\">\n            <span style=\"font-family: var(--mono); font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 0.3rem;\">THU</span>\n            <input type=\"number\" id=\"sd-d4\" value=\"7.0\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; text-align: center; padding: 0.4rem 0; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 3px; font-family: var(--mono); font-size: 1rem;\" oninput=\"calcSleepDebt()\" />\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.3rem; text-align: center;\">\n            <span style=\"font-family: var(--mono); font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 0.3rem;\">FRI</span>\n            <input type=\"number\" id=\"sd-d5\" value=\"6.0\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; text-align: center; padding: 0.4rem 0; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 3px; font-family: var(--mono); font-size: 1rem;\" oninput=\"calcSleepDebt()\" />\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.3rem; text-align: center;\">\n            <span style=\"font-family: var(--mono); font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 0.3rem;\">SAT</span>\n            <input type=\"number\" id=\"sd-d6\" value=\"7.5\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; text-align: center; padding: 0.4rem 0; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 3px; font-family: var(--mono); font-size: 1rem;\" oninput=\"calcSleepDebt()\" />\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.6rem 0.3rem; text-align: center;\">\n            <span style=\"font-family: var(--mono); font-size: 0.75rem; font-weight: bold; display: block; margin-bottom: 0.3rem;\">SUN</span>\n            <input type=\"number\" id=\"sd-d7\" value=\"7.0\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; text-align: center; padding: 0.4rem 0; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 3px; font-family: var(--mono); font-size: 1rem;\" oninput=\"calcSleepDebt()\" />\n          </div>\n        </div>\n\n        <!-- Hero KPI Cards -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.5rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Cumulative 7-Day Sleep Debt</div>\n            <div id=\"kpi-debt\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #ef4444; margin: 0.4rem 0;\">10.5 Hours</div>\n            <div style=\"font-size: 0.8rem; color: var(--text-muted);\">Slept: <span id=\"kpi-slept\" style=\"font-family: var(--mono); font-weight: bold;\">45.5h</span> / Needed: <span id=\"kpi-needed\" style=\"font-family: var(--mono); font-weight: bold;\">56.0h</span></div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #eab308; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Equivalent BAC Impairment</div>\n            <div id=\"kpi-bac\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #eab308; margin: 0.4rem 0;\">~0.08% BAC</div>\n            <div id=\"kpi-bac-sub\" style=\"font-size: 0.8rem; color: var(--text-muted);\">Legally Intoxicated Impairment Level</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Attention Lapse Multiplier (PVT)</div>\n            <div id=\"kpi-lapse\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #3b82f6; margin: 0.4rem 0;\">2.4&times; Lapses</div>\n            <div style=\"font-size: 0.8rem; color: var(--text-muted);\">Probability of Microsleep Episodes</div>\n          </div>\n        </div>\n\n        <!-- Copy Action Bar -->\n        <div style=\"display: flex; justify-content: flex-end; margin-top: 1.25rem;\">\n          <button type=\"button\" id=\"copy-summary-btn\" onclick=\"copySleepSummary()\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; color: var(--fg); transition: background 0.15s;\">\n            <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1\"></path></svg>\n            <span>Copy Sleep Debt Diagnostic</span>\n          </button>\n        </div>\n      </div>\n\n      <!-- Interactive SVG Waterfall Chart -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin: 0;\">7-Day Sleep Duration vs Biological Baseline</h3>\n          <div style=\"display: flex; gap: 1rem; font-family: var(--mono); font-size: 0.8rem;\">\n            <span style=\"display: flex; align-items: center; gap: 0.4rem;\"><span style=\"display: inline-block; width: 12px; height: 12px; background: #3b82f6; border-radius: 2px;\"></span> Hours Slept</span>\n            <span style=\"display: flex; align-items: center; gap: 0.4rem;\"><span style=\"display: inline-block; width: 12px; height: 12px; background: #ef4444; border-radius: 2px;\"></span> Daily Deficit</span>\n            <span style=\"display: flex; align-items: center; gap: 0.4rem;\"><span style=\"display: inline-block; width: 12px; height: 2px; background: #22c55e;\"></span> Baseline Target</span>\n          </div>\n        </div>\n        <div style=\"width: 100%; overflow-x: auto;\">\n          <svg id=\"sd-svg\" viewBox=\"0 0 760 250\" style=\"width: 100%; height: auto; min-width: 580px; display: block; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- Evidence-Based 4-Day Circadian Recovery Protocol -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin: 0;\">Clinical Circadian Recovery Protocol (Zero Social Jetlag)</h3>\n          <span id=\"proto-status-badge\" style=\"font-family: var(--mono); font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 4px; background: rgba(239, 68, 68, 0.1); color: #ef4444; font-weight: bold;\">Moderate-to-Severe Deficit</span>\n        </div>\n        <div id=\"sd-protocol-body\" style=\"font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);\">\n          <!-- Injected dynamically -->\n        </div>\n      </div>\n\n      <!-- Step-by-Step Mathematical & Circadian Derivations -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1rem;\">Neurobiological Math: Two-Process Sleep Model</h2>\n        \n        <p style=\"color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;\">\n          Sleep homeostasis is governed by Alexander Borbély's Two-Process Model: <strong>Process S</strong> (the homeostatic sleep drive that builds with adenosine accumulation) and <strong>Process C</strong> (the 24.2-hour circadian rhythm orchestrated by the suprachiasmatic nucleus).\n        </p>\n\n        <div style=\"background: var(--surface-alt); border-left: 4px solid #ef4444; padding: 1rem 1.25rem; margin: 1.25rem 0; font-size: 0.9rem;\">\n          <div style=\"font-weight: bold; margin-bottom: 0.3rem;\">1. 7-Day Cumulative Sleep Debt Equation</div>\n          <p style=\"margin: 0; color: var(--text-muted); line-height: 1.5;\">\n            Cumulative deficit accumulates linearly when nightly sleep duration falls below biological sleep requirement (B):\n            <br>\n            <span style=\"display: block; margin-top: 0.4rem; font-family: var(--mono); color: var(--fg);\">(\\text{Sleep Debt} = \\max\\left(0, \\sum_{i=1}^7 (B - \\text{Slept}_i)\\right))</span>\n            <br>\n            For your baseline of <strong id=\"math-base\">8.0h</strong> and actual total of <strong id=\"math-slept\">45.5h</strong>:\n            <br>\n            <span style=\"display: block; margin-top: 0.2rem; font-family: var(--mono); color: var(--fg);\">(\\text{Sleep Debt} = (7 \\times 8.0) - 45.5 = 56.0 - 45.5 = \\mathbf{10.5\\text{ Hours}})</span>\n          </p>\n        </div>\n\n        <div style=\"background: var(--surface-alt); border-left: 4px solid #eab308; padding: 1rem 1.25rem; margin: 1.25rem 0; font-size: 0.9rem;\">\n          <div style=\"font-weight: bold; margin-bottom: 0.3rem;\">2. Blood Alcohol Concentration (BAC) Equivalence Formula</div>\n          <p style=\"margin: 0; color: var(--text-muted); line-height: 1.5;\">\n            Derived from Williamson & Feyer (Nature 2000) and Van Dongen et al. (Sleep 2003):\n            <br>\n            <span style=\"display: block; margin-top: 0.4rem; font-family: var(--mono); color: var(--fg);\">(\\text{Equiv BAC} \\approx \\min\\left(0.12\\%, \\frac{\\text{Sleep Debt}}{10} \\times 0.08\\%\\right))</span>\n            <br>\n            A 10.5-hour sleep debt produces a psychomotor reaction time drop and attention lapse frequency equivalent to a <strong>~0.08% Blood Alcohol Concentration</strong>, the statutory definition of drunk driving in all 50 US states.\n          </p>\n        </div>\n      </section>\n\n      <!-- 5 Critical Pitfalls & Traps -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1.25rem;\">⚠️ 5 Critical Sleep Debt Traps &amp; Circadian Fallacies</h2>\n        <div style=\"display: grid; gap: 1rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);\">💥 1. The Weekend \"Social Jetlag\" Trap</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">Sleeping until noon on Sunday shifts central circadian clock genes (CLOCK, BMAL1) up to 3 hours later. When attempting to sleep at 10:30 PM Sunday for Monday morning work, the pineal gland is biologically calibrated for 1:30 AM, triggering acute \"Sunday night insomnia\" and restarting the exhaustion cycle weekly.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #f59e0b; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);\">🕒 2. The Subjective Adaptation Fallacy</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">After 4 to 5 consecutive days on 6 hours of sleep, individuals report that they \"feel fine\" and believe their body has adapted. However, objective psychomotor vigilance testing (PVT) proves that reaction times, micro-lapses, and cognitive errors deteriorate steadily in a linear decline. Chronic sleep deprivation blinds you to your own impairment.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #10b981; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);\">☕ 3. Caffeine Plugs Receptors Without Clearing Adenosine</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">Caffeine acts as a competitive antagonist at adenosine A1 and A2A receptors: it plugs the binding pocket without metabolizing the accumulating extracellular adenosine. When hepatic CYP1A2 enzymes clear the caffeine 5 to 7 hours later, the accumulated adenosine floods vacant receptors simultaneously, triggering a severe energy crash.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #3b82f6; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);\">🍷 4. Alcohol Destroys REM Sleep Architecture &amp; Glymphatics</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">While ethanol acts as a GABA-A agonist and induces sedation, it is not physiological sleep. As hepatic enzymes metabolize alcohol into acetaldehyde in the second half of the night, sympathetic rebound fragments sleep continuity, suppresses restorative slow-wave deep sleep, and virtually abolishes REM dreaming, leaving biological sleep debt unliquidated.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #8b5cf6; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);\">🛑 5. The 10-Hour Recovery Ceiling (Cannot Binge-Sleep Debt)</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">You cannot resolve a 20-hour cumulative sleep debt in a single 16-hour marathon session. The human brain cannot efficiently sustain restorative Stage 3 slow-wave sleep beyond approximately 9 to 10 continuous hours. Heavy sleep deficits must be repaid progressively across several consecutive nights of +60 to +90 minutes of sleep extension.</p>\n          </div>\n        </div>\n      </section>\n\n      <!-- Interactive FAQ Accordion -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1.25rem;\">Frequently Asked Questions (Sleep Debt & Circadian Science)</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 0.75rem;\">\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What is cumulative sleep debt and how is it calculated?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Cumulative sleep debt is the running total of lost sleep hours relative to your biological sleep baseline over a rolling 7- to 14-day window. If your body requires 8.0 hours of sleep per night to maintain cognitive homeostasis, but you average only 6.0 hours Monday through Friday, you accumulate a 10.0-hour sleep debt before the weekend begins.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">How does sleep deprivation compare to blood alcohol concentration (BAC)?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Landmark research from the Walter Reed Army Institute of Research and the University of Pennsylvania (Van Dongen & Dinges) showed that being awake for 17 to 19 hours produces psychomotor vigilance impairments equivalent to a blood alcohol concentration (BAC) of 0.05%. Being awake for 24 continuous hours—or accumulating 10+ hours of sleep debt across a week—produces cognitive lapses, reaction time delays, and microsleep vulnerability equivalent to a 0.08% BAC (the legal intoxication limit for driving).\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">Can you recover from sleep debt by sleeping in on the weekend?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Not completely, and doing so often backfires. Sleeping in 3 to 4 hours on Saturday and Sunday creates 'social jetlag' by shifting your master circadian clock (suprachiasmatic nucleus) and delaying Sunday night melatonin release. While extra weekend sleep helps clear some metabolic adenosine backlog, full neurobehavioral recovery from chronic sleep debt requires 4 to 9 consecutive nights of extended sleep opportunity (+60 to +90 minutes per night) without shifting your wake time by more than 60 minutes.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">Why do I stop feeling tired after several days of 6 hours of sleep?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              This is the 'subjective adaptation illusion'. Clinical sleep restriction studies demonstrate that while your subjective perception of sleepiness levels off after 3 to 4 days, objective cognitive testing (attention span, working memory, emotional regulation, and microsleep frequency) continues to deteriorate linearly. You feel 'used to it' only because your prefrontal cortex has lost the metacognitive capacity to accurately assess its own impairment.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What is the best way to safely repay a sleep debt?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Rather than sleeping late into the afternoon, repay sleep debt incrementally: (1) Go to bed 60 to 90 minutes earlier for 4 to 7 consecutive nights; (2) Take a 20- to 25-minute power nap between 12:30 PM and 2:00 PM; (3) Maintain a consistent morning wake time (within 1 hour) to keep your circadian rhythm anchored; and (4) Get 15 minutes of direct morning sunlight to synchronize cortisol and melatonin rhythms.\n            </p>\n          </details>\n        </div>\n      </section>\n    </div>\n\n    <script>\n      function setPreset(p) {\n        if (p === 'rested') {\n          document.getElementById('sd-baseline').value = 8.0;\n          ['sd-d1','sd-d2','sd-d3','sd-d4','sd-d5','sd-d6','sd-d7'].forEach(id => document.getElementById(id).value = 8.0);\n        } else if (p === 'tech') {\n          document.getElementById('sd-baseline').value = 8.0;\n          ['sd-d1','sd-d2','sd-d3','sd-d4','sd-d5'].forEach(id => document.getElementById(id).value = 6.0);\n          document.getElementById('sd-d6').value = 7.5;\n          document.getElementById('sd-d7').value = 7.0;\n        } else if (p === 'allnighter') {\n          document.getElementById('sd-baseline').value = 8.0;\n          document.getElementById('sd-d1').value = 7.0;\n          document.getElementById('sd-d2').value = 6.5;\n          document.getElementById('sd-d3').value = 0.5; // all-nighter\n          document.getElementById('sd-d4').value = 5.5;\n          document.getElementById('sd-d5').value = 6.0;\n          document.getElementById('sd-d6').value = 9.0;\n          document.getElementById('sd-d7').value = 7.5;\n        } else if (p === 'severe') {\n          document.getElementById('sd-baseline').value = 8.0;\n          ['sd-d1','sd-d2','sd-d3','sd-d4','sd-d5','sd-d6','sd-d7'].forEach(id => document.getElementById(id).value = 5.0);\n        }\n        calcSleepDebt();\n      }\n\n      function calcSleepDebt() {\n        var base = parseFloat(document.getElementById('sd-baseline').value) || 8.0;\n        var dayIds = ['sd-d1','sd-d2','sd-d3','sd-d4','sd-d5','sd-d6','sd-d7'];\n        var dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];\n        var dailyData = [];\n        var totalSlept = 0;\n\n        for (var i = 0; i < dayIds.length; i++) {\n          var hrs = parseFloat(document.getElementById(dayIds[i]).value) || 0;\n          totalSlept += hrs;\n          dailyData.push({ day: dayNames[i], slept: hrs, deficit: Math.max(0, base - hrs) });\n        }\n\n        var totalNeeded = base * 7;\n        var totalDebt = Math.max(0, totalNeeded - totalSlept);\n\n        // Calculate BAC and Lapses\n        var bacEquiv = Math.min(0.12, (totalDebt / 10) * 0.08);\n        var lapseMult = 1.0 + (totalDebt / 7.0);\n\n        // Update Hero Stats\n        document.getElementById('kpi-debt').textContent = totalDebt.toFixed(1) + ' Hours';\n        document.getElementById('kpi-slept').textContent = totalSlept.toFixed(1) + 'h';\n        document.getElementById('kpi-needed').textContent = totalNeeded.toFixed(1) + 'h';\n\n        var bacEl = document.getElementById('kpi-bac');\n        var bacSub = document.getElementById('kpi-bac-sub');\n        if (totalDebt <= 1.5) {\n          bacEl.textContent = 'Normal / Zero';\n          bacEl.style.color = '#22c55e';\n          bacSub.textContent = 'Peak Cognitive & Prefrontal Function';\n        } else if (totalDebt <= 5.0) {\n          bacEl.textContent = '~' + (bacEquiv * 100).toFixed(2) + '% BAC';\n          bacEl.style.color = '#eab308';\n          bacSub.textContent = 'Mild Sub-clinical Slowing (~1-2 Beers)';\n        } else if (totalDebt <= 9.0) {\n          bacEl.textContent = '~' + (bacEquiv * 100).toFixed(2) + '% BAC';\n          bacEl.style.color = '#f97316';\n          bacSub.textContent = 'Equivalent to Impaired Driving (~0.05% BAC)';\n        } else {\n          bacEl.textContent = '~' + (bacEquiv * 100).toFixed(2) + '% BAC';\n          bacEl.style.color = '#ef4444';\n          bacSub.textContent = 'Exceeds Legal Intoxication Limit (0.08% BAC)';\n        }\n\n        document.getElementById('kpi-lapse').textContent = lapseMult.toFixed(1) + '× Lapses';\n\n        // Update Math Derivations\n        document.getElementById('math-base').textContent = base.toFixed(1) + 'h';\n        document.getElementById('math-slept').textContent = totalSlept.toFixed(1) + 'h';\n\n        // Update Protocol\n        var protoEl = document.getElementById('sd-protocol-body');\n        var badgeEl = document.getElementById('proto-status-badge');\n        if (totalDebt <= 1.5) {\n          badgeEl.textContent = 'Optimal Baseline Rest';\n          badgeEl.style.background = 'rgba(34, 197, 94, 0.1)';\n          badgeEl.style.color = '#22c55e';\n          protoEl.innerHTML = '<p style=\"margin:0;\"><strong>Status: Fully Rested.</strong> Your homeostatic sleep pressure (Process S) and circadian rhythm (Process C) are operating in harmony. To maintain this advantage: keep your morning wake time consistent within 30 minutes, obtain 15 minutes of outdoor sunlight within 1 hour of waking, and avoid caffeine after 2:00 PM.</p>';\n        } else if (totalDebt <= 6.0) {\n          badgeEl.textContent = 'Moderate Deficit (~' + totalDebt.toFixed(1) + 'h)';\n          badgeEl.style.background = 'rgba(234, 179, 8, 0.1)';\n          badgeEl.style.color = '#ca8a04';\n          protoEl.innerHTML = '<p><strong>2-Stage Recovery Plan:</strong></p><ul style=\"margin:0.5rem 0; padding-left:1.25rem;\"><li><strong>Nightly Extension:</strong> Add <strong>+45 to +60 minutes</strong> to your sleep window for the next 3 nights by going to bed earlier (do NOT sleep late in the morning).</li><li><strong>Power Nap:</strong> Take a <strong>20-minute nap</strong> between 1:00 PM and 2:30 PM (set an alarm so you do not enter Stage 3 slow-wave sleep).</li><li><strong>Light Cue:</strong> Get immediate bright natural light exposure upon waking to anchor your morning cortisol surge.</li></ul>';\n        } else {\n          badgeEl.textContent = 'Critical Chronic Deficit (~' + totalDebt.toFixed(1) + 'h)';\n          badgeEl.style.background = 'rgba(239, 68, 68, 0.1)';\n          badgeEl.style.color = '#dc2626';\n          protoEl.innerHTML = '<p><strong>🚨 4-Day Emergency Reset Protocol:</strong></p><ul style=\"margin:0.5rem 0; padding-left:1.25rem;\"><li><strong>Do NOT Sleep In Past 1 Hour on Weekends:</strong> Sleeping in until noon shifts your circadian clock into social jetlag. Wake within 60 minutes of your normal time.</li><li><strong>Frontload Sleep Opportunity:</strong> Move your bedtime earlier by <strong>+75 to +90 minutes</strong> every night for the next 4 to 6 consecutive nights.</li><li><strong>Strategic Midday Power Nap:</strong> Take a <strong>25-minute nap</strong> in early afternoon (12:30 – 1:30 PM).</li><li><strong>Zero Afternoon Stimulants:</strong> Cease all caffeine after 11:30 AM to allow liver CYP1A2 clearance before bedtime.</li></ul>';\n        }\n\n        // Render SVG Waterfall Bar\n        renderSleepSvg(dailyData, base);\n      }\n\n      function renderSleepSvg(dailyData, base) {\n        var svg = document.getElementById('sd-svg');\n        var w = 760, h = 250;\n        var padLeft = 50, padRight = 30, padTop = 25, padBottom = 40;\n        var plotW = w - padLeft - padRight;\n        var plotH = h - padTop - padBottom;\n\n        var maxVal = Math.max(10, base + 2);\n\n        var svgContent = '';\n\n        // Gridlines\n        for (var i = 0; i <= 5; i++) {\n          var yVal = (maxVal / 5) * i;\n          var y = padTop + plotH - (yVal / maxVal) * plotH;\n          svgContent += '<line x1=\"' + padLeft + '\" y1=\"' + y + '\" x2=\"' + (w - padRight) + '\" y2=\"' + y + '\" stroke=\"var(--border)\" stroke-width=\"1\" stroke-dasharray=\"2,2\" />';\n          svgContent += '<text x=\"' + (padLeft - 8) + '\" y=\"' + (y + 4) + '\" font-size=\"10\" fill=\"var(--text-muted)\" text-anchor=\"end\">' + yVal.toFixed(0) + 'h</text>';\n        }\n\n        // Target Baseline Line\n        var baseY = padTop + plotH - (base / maxVal) * plotH;\n        svgContent += '<line x1=\"' + padLeft + '\" y1=\"' + baseY + '\" x2=\"' + (w - padRight) + '\" y2=\"' + baseY + '\" stroke=\"#22c55e\" stroke-width=\"2\" stroke-dasharray=\"4,4\" />';\n        svgContent += '<text x=\"' + (w - padRight - 5) + '\" y=\"' + (baseY - 6) + '\" font-size=\"10\" font-weight=\"bold\" fill=\"#22c55e\" text-anchor=\"end\">Baseline Target: ' + base.toFixed(1) + 'h</text>';\n\n        // Render Bars\n        var colW = plotW / 7;\n        var barW = colW * 0.55;\n\n        dailyData.forEach(function(d, idx) {\n          var xCenter = padLeft + (idx + 0.5) * colW;\n          var barH = (Math.min(maxVal, d.slept) / maxVal) * plotH;\n          var barY = padTop + plotH - barH;\n\n          // Main Slept Bar\n          svgContent += '<rect x=\"' + (xCenter - barW / 2) + '\" y=\"' + barY + '\" width=\"' + barW + '\" height=\"' + barH + '\" fill=\"#3b82f6\" rx=\"3\">';\n          svgContent += '<title>' + d.day + ': ' + d.slept + 'h slept</title></rect>';\n\n          // Deficit Bar (if slept < base)\n          if (d.slept < base) {\n            var defH = ((base - d.slept) / maxVal) * plotH;\n            var defY = barY - defH;\n            svgContent += '<rect x=\"' + (xCenter - barW / 2) + '\" y=\"' + defY + '\" width=\"' + barW + '\" height=\"' + defH + '\" fill=\"#ef4444\" opacity=\"0.75\" rx=\"2\">';\n            svgContent += '<title>' + d.day + ' Deficit: ' + (base - d.slept).toFixed(1) + 'h</title></rect>';\n          }\n\n          // X Axis Day Label\n          svgContent += '<text x=\"' + xCenter + '\" y=\"' + (h - padBottom + 18) + '\" font-size=\"11\" font-weight=\"bold\" fill=\"var(--fg)\" text-anchor=\"middle\">' + d.day + '</text>';\n          svgContent += '<text x=\"' + xCenter + '\" y=\"' + (h - padBottom + 32) + '\" font-size=\"10\" fill=\"var(--text-muted)\" text-anchor=\"middle\">' + d.slept + 'h</text>';\n        });\n\n        svg.innerHTML = svgContent;\n      }\n\n      function copySleepSummary() {\n        var debt = document.getElementById('kpi-debt').textContent;\n        var bac = document.getElementById('kpi-bac').textContent;\n        var lapse = document.getElementById('kpi-lapse').textContent;\n        var base = document.getElementById('sd-baseline').value;\n        var slept = document.getElementById('kpi-slept').textContent;\n\n        var text = '=== CUMULATIVE SLEEP DEBT DIAGNOSTIC ===\\n' +\n                   'Biological Sleep Baseline: ' + base + ' hrs/night\\n' +\n                   'Total Slept Past 7 Days: ' + slept + '\\n' +\n                   'Cumulative Sleep Debt: ' + debt + '\\n\\n' +\n                   'Cognitive BAC Equivalence: ' + bac + '\\n' +\n                   'PVT Attention Lapse Rate: ' + lapse + '\\n' +\n                   'Calculated via Digital Tools Shed (digitaltoolsshed.com/health/sleep-debt-calculator)';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copy-summary-btn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span style=\"color:#22c55e; font-weight:bold;\">✓ Copied to Clipboard!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2500);\n        });\n      }\n\n      document.addEventListener('DOMContentLoaded', calcSleepDebt);\n    </script>\n  "
},
    {
  "slug": "screen-time-calculator",
  "title": "Lifetime Screen Time Calculator (Years of Your Life Lost to Glass)",
  "metaDesc": "Calculate the exact continuous 24/7 years of your finite life spent staring at phone, computer, and TV screens. Features visual lifetime breakdown and dopamine detox protocols.",
  "faq": [
    {
      "q": "How does the lifetime screen time calculator determine years lost to screens?",
      "a": "The calculator takes your current age and statistical life expectancy to determine your remaining lifetime years. It calculates your daily conscious waking hours by subtracting your nightly sleep duration. It then multiplies your total daily screen time across all devices (smartphone, computer, TV, tablet) by 365 days and your remaining years to compute the exact continuous, unbroken years (24 hours per day) spent looking at digital displays."
    },
    {
      "q": "What percentage of waking life does the average person spend on screens?",
      "a": "According to global behavioral research from DataReportal and Nielsen, the average adult spends between 6.5 and 7.5 hours per day looking at screens across work and personal devices. Assuming 8 hours of sleep per night (leaving 16 conscious waking hours), the typical modern adult spends between 40% and 48% of their entire conscious lifetime looking directly into digital displays."
    },
    {
      "q": "What is the neurological mechanism that makes smartphone scrolling addictive?",
      "a": "Social media feeds utilize a 'variable ratio schedule of reinforcement,' the exact psychological conditioning mechanism discovered by B.F. Skinner and used in casino slot machines. Because an unpredictable swipe may reveal a high-dopamine stimulus (a viral video, notification, or message), the brain's mesolimbic dopamine pathway triggers anticipatory dopamine spikes that compel continuous scrolling."
    },
    {
      "q": "How does blue light from screens disrupt circadian rhythms and sleep quality?",
      "a": "Digital screens emit short-wavelength light in the 450–480 nm blue spectrum. This light stimulates intrinsically photosensitive retinal ganglion cells (ipRGCs) that signal the brain's suprachiasmatic nucleus that it is solar noon. This suppresses the pineal gland's secretion of melatonin by up to 50% and shifts your circadian phase later by 1.5 to 3 hours, destroying deep Stage 3 slow-wave sleep."
    },
    {
      "q": "What is a realistic, sustainable dopamine detox protocol?",
      "a": "A sustainable digital detox focuses on structural environmental friction rather than pure willpower: (1) Switch your phone display to Grayscale (colorless) mode, reducing visual dopamine reward; (2) Create a physical charging station outside the bedroom so you never sleep next to a screen; (3) Turn off all non-human notifications (apps, news, social feeds); and (4) Institute a 12- to 24-hour weekly digital sabbath."
    }
  ],
  "body": "\n    <div class=\"article-container\" style=\"max-width: 950px; margin: 0 auto; padding: 0 1rem;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\" style=\"color: inherit; text-decoration: underline;\">Home</a> &gt; <a href=\"/health/\" style=\"color: inherit; text-decoration: underline;\">Health</a> &gt; Lifetime Screen Time\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <h1 style=\"font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; line-height: 1.2;\">Lifetime Screen Time & Life Expectancy Calculator</h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Humans possess approximately 16 conscious waking hours per day. Calculate how many continuous, unbroken years of your remaining life will be spent staring into illuminated glass pixels, and explore the staggering real-world opportunity cost.\n        </p>\n      </header>\n\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 6px rgba(0,0,0,0.04);\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1.25rem;\">Demographics & Daily Digital Habits</h2>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Current Age (Years):</label>\n            <input type=\"number\" id=\"st-age\" value=\"28\" min=\"10\" max=\"95\" step=\"1\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcScreenTime()\" />\n            <div style=\"display: flex; gap: 0.25rem; margin-top: 0.4rem;\">\n              <button type=\"button\" onclick=\"setAgePreset(20)\" style=\"flex:1; padding: 0.2rem 0.3rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">20</button>\n              <button type=\"button\" onclick=\"setAgePreset(30)\" style=\"flex:1; padding: 0.2rem 0.3rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">30</button>\n              <button type=\"button\" onclick=\"setAgePreset(45)\" style=\"flex:1; padding: 0.2rem 0.3rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">45</button>\n              <button type=\"button\" onclick=\"setAgePreset(60)\" style=\"flex:1; padding: 0.2rem 0.3rem; font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 3px; cursor: pointer; color: var(--fg);\">60</button>\n            </div>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Life Expectancy (Years):</label>\n            <input type=\"number\" id=\"st-exp\" value=\"80\" min=\"50\" max=\"105\" step=\"1\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcScreenTime()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">US CDC statistical average: ~78–82 years.</span>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Nightly Sleep (hrs/day):</label>\n            <input type=\"number\" id=\"st-sleep\" value=\"7.5\" min=\"5.0\" max=\"11.0\" step=\"0.5\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcScreenTime()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">Determines conscious waking opportunity.</span>\n          </div>\n        </div>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; padding-top: 1.25rem; border-top: 1px dashed var(--border);\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Daily Smartphone Screen Time (hrs):</label>\n            <input type=\"number\" id=\"st-phone\" value=\"4.5\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcScreenTime()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">Check iOS Screen Time or Android Digital Wellbeing.</span>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Daily Computer / Work (hrs):</label>\n            <input type=\"number\" id=\"st-pc\" value=\"6.0\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcScreenTime()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">Laptops, desktops, office workstations.</span>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Daily TV / Streaming / Gaming (hrs):</label>\n            <input type=\"number\" id=\"st-tv\" value=\"2.0\" min=\"0\" max=\"16\" step=\"0.25\" style=\"width: 100%; padding: 0.65rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcScreenTime()\" />\n            <span style=\"display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.3rem;\">Netflix, YouTube on TV, PlayStation/Xbox.</span>\n          </div>\n        </div>\n\n        <!-- Hero KPI Cards -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.75rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">Continuous Years Lost to Glass</div>\n            <div id=\"kpi-years\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #ef4444; margin: 0.4rem 0;\">27.1 Years</div>\n            <div style=\"font-size: 0.8rem; color: var(--text-muted);\">Unbroken 24/7 years staring into pixels</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #f97316; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">% of Waking Life Absorbed</div>\n            <div id=\"kpi-pct-waking\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #f97316; margin: 0.4rem 0;\">75.8%</div>\n            <div style=\"font-size: 0.8rem; color: var(--text-muted);\"><span id=\"kpi-daily-total\">12.5h</span> out of <span id=\"kpi-waking-hrs\">16.5h</span> awake daily</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #22c55e; padding: 1.25rem; border-radius: 6px; text-align: center;\">\n            <div style=\"font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;\">True Unplugged Living Left</div>\n            <div id=\"kpi-real-life\" style=\"font-family: var(--mono); font-size: 2.3rem; font-weight: bold; color: #22c55e; margin: 0.4rem 0;\">8.7 Years</div>\n            <div style=\"font-size: 0.8rem; color: var(--text-muted);\">Conscious life in the real physical world</div>\n          </div>\n        </div>\n\n        <!-- Copy Action Bar -->\n        <div style=\"display: flex; justify-content: flex-end; margin-top: 1.25rem;\">\n          <button type=\"button\" id=\"copy-summary-btn\" onclick=\"copyScreenSummary()\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; color: var(--fg); transition: background 0.15s;\">\n            <svg width=\"15\" height=\"15\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path></svg>\n            <span>Copy Lifetime Screen Diagnostic</span>\n          </button>\n        </div>\n      </div>\n\n      <!-- Interactive SVG Lifetime Breakdown Donut Chart -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin: 0;\">Remaining Lifetime Allocation (<span id=\"donut-rem-years\">52</span> Years Left)</h3>\n          <div style=\"display: flex; gap: 1rem; font-family: var(--mono); font-size: 0.8rem;\">\n            <span style=\"display: flex; align-items: center; gap: 0.4rem;\"><span style=\"display: inline-block; width: 12px; height: 12px; background: #3b82f6; border-radius: 2px;\"></span> Sleeping</span>\n            <span style=\"display: flex; align-items: center; gap: 0.4rem;\"><span style=\"display: inline-block; width: 12px; height: 12px; background: #ef4444; border-radius: 2px;\"></span> Screen Time</span>\n            <span style=\"display: flex; align-items: center; gap: 0.4rem;\"><span style=\"display: inline-block; width: 12px; height: 12px; background: #22c55e; border-radius: 2px;\"></span> Real Unplugged Life</span>\n          </div>\n        </div>\n        <div style=\"width: 100%; overflow-x: auto;\">\n          <svg id=\"st-donut-svg\" viewBox=\"0 0 760 260\" style=\"width: 100%; height: auto; min-width: 580px; display: block; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- Staggering Real-World Opportunity Cost Matrix -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h3 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;\">The Opportunity Cost of Your Screen Time</h3>\n        <p style=\"color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem;\">\n          What could be achieved if just <strong>50%</strong> of non-work screen time were redirected to deliberate practice:\n        </p>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 6px;\">\n            <div style=\"font-size: 1.8rem; font-weight: bold; color: #3b82f6; font-family: var(--mono);\" id=\"opp-lang\">101 Languages</div>\n            <div style=\"font-weight: bold; font-size: 0.9rem; margin-top: 0.25rem;\">Fluent Foreign Languages</div>\n            <p style=\"font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0 0;\">At 600 hours of intensive study per language (FSI Category 1 fluency).</p>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 6px;\">\n            <div style=\"font-size: 1.8rem; font-weight: bold; color: #eab308; font-family: var(--mono);\" id=\"opp-books\">243 Books</div>\n            <div style=\"font-weight: bold; font-size: 0.9rem; margin-top: 0.25rem;\">Novels Written</div>\n            <p style=\"font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0 0;\">At 250 hours per 80,000-word full-length manuscript.</p>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 6px;\">\n            <div style=\"font-size: 1.8rem; font-weight: bold; color: #22c55e; font-family: var(--mono);\" id=\"opp-mastery\">6.1 Skills</div>\n            <div style=\"font-weight: bold; font-size: 0.9rem; margin-top: 0.25rem;\">World-Class Masteries</div>\n            <p style=\"font-size: 0.8rem; color: var(--text-muted); margin: 0.25rem 0 0;\">At Malcolm Gladwell's 10,000 hours of elite deliberate practice.</p>\n          </div>\n        </div>\n      </div>\n\n      <!-- Actionable 3-Tier Dopamine Detox Protocol -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1rem;\">Actionable 3-Tier Dopamine Detox Architecture</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 1.25rem;\">\n          <div style=\"background: var(--surface-alt); border-left: 4px solid #3b82f6; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;\">\n            <div style=\"font-weight: bold; font-size: 0.95rem; color: #3b82f6; margin-bottom: 0.25rem;\">Level 1: Visual & Environmental Friction (Low Effort, High ROI)</div>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              • <strong>Grayscale Display Mode:</strong> In your phone's Accessibility settings, set a triple-click shortcut to turn screen colors to black & white. Stripping high-saturation RGB stimuli immediately drops compulsive dopamine reinforcement.<br>\n              • <strong>Audit Notification Badges:</strong> Disable red badge dots on all social and media apps. Only direct human communication (calls, texts) should interrupt your consciousness.\n            </p>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border-left: 4px solid #eab308; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;\">\n            <div style=\"font-weight: bold; font-size: 0.95rem; color: #eab308; margin-bottom: 0.25rem;\">Level 2: The Physical Sanctuary Rule (Boundary Enforcement)</div>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              • <strong>Banish Screens From the Bedroom:</strong> Charge your phone in the kitchen or hallway overnight. Purchase a $10 analog alarm clock. Reclaim the first 30 minutes and final 30 minutes of your day from algorithms.<br>\n              • <strong>Friction Barriers:</strong> Log out of social apps after each session, or delete the app and use the slow browser version instead.\n            </p>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border-left: 4px solid #22c55e; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;\">\n            <div style=\"font-weight: bold; font-size: 0.95rem; color: #22c55e; margin-bottom: 0.25rem;\">Level 3: The 24-Hour Digital Sabbath (Complete Receptor Reset)</div>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              • <strong>One Full Day Every Week:</strong> Power off your smartphone from Saturday 8:00 PM to Sunday 8:00 PM. Read paper books, cook, hike, and engage in real face-to-face conversation.<br>\n              • Stanford neurobiologist Dr. Anna Lembke shows that short dopamine detoxes down-regulate hyperactive reward pathways and restore baseline pleasure from ordinary life activities.\n            </p>\n          </div>\n        </div>\n      </section>\n\n      <!-- 5 Critical Pitfalls & Traps -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2.5rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1.25rem;\">⚠️ 5 Critical Neurological Traps of Screen Immersion</h2>\n        <div style=\"display: grid; gap: 1rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);\">💥 1. The Variable Ratio Schedule of Reinforcement</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">Social algorithmic feeds operate on the exact B.F. Skinner operant conditioning mechanism as casino slot machines. Because an unpredictable pull of the refresh feed may yield a viral video, notification, or social validation cue, anticipatory dopamine surges compel involuntary, compulsive checking loops throughout waking hours.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #f59e0b; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);\">⏳ 2. The 23-Minute Attention Fragmentation Cost</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">Pioneering workplace research by Dr. Gloria Mark at UC Irvine revealed that after glancing at a digital phone notification for just 3 seconds, it requires an average of <strong>23 minutes and 15 seconds</strong> for the prefrontal cortex to fully resume original deep cognitive focus. Ten daily phone checks mathematically annihilates deep cognitive work.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #10b981; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);\">👥 3. \"Phubbing\" &amp; Neurological Ostracism in Relationships</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">\"Phubbing\" (phone snubbing)—checking an illuminated screen in the presence of a partner, child, or colleague—triggers genuine fMRI-detectable neural ostracism and social exclusion pain pathways in the other person, steadily eroding relationship intimacy, attachment security, and interpersonal trust over time.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #3b82f6; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);\">🌙 4. 460nm Blue Photon Melatonin Suppression &amp; Phase Delay</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">Directing high-intensity 450–480nm blue photons into intrinsically photosensitive retinal ganglion cells (ipRGCs) in evening hours suppresses pineal melatonin secretion by up to 88% and delays circadian sleep timing by up to 3 hours. This eliminates restorative Stage N3 slow-wave sleep and causes chronic cognitive fatigue.</p>\n          </div>\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid #8b5cf6; padding: 1.25rem; border-radius: 8px;\">\n            <h4 style=\"margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);\">📳 5. Phantom Vibration Syndrome &amp; Sensory Hyper-Vigilance</h4>\n            <p style=\"margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;\">Over 80% of smartphone owners experience phantom vibrations—hallucinating that their phone vibrated when it remained silent. This occurs because the cerebral sensory cortex becomes hyper-vigilant to incoming digital signals, misinterpreting incidental clothing friction and muscle twitches as incoming notifications.</p>\n          </div>\n        </div>\n      </section>\n\n      <!-- Interactive FAQ Accordion -->\n      <section style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.4rem; margin-top: 0; margin-bottom: 1.25rem;\">Frequently Asked Questions (Screen Time & Longevity)</h2>\n        \n        <div style=\"display: flex; flex-direction: column; gap: 0.75rem;\">\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">How does the lifetime screen time calculator determine years lost to screens?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              The calculator takes your current age and statistical life expectancy to determine your remaining lifetime years. It calculates your daily conscious waking hours by subtracting your nightly sleep duration. It then multiplies your total daily screen time across all devices (smartphone, computer, TV, tablet) by 365 days and your remaining years to compute the exact continuous, unbroken years (24 hours per day) spent looking at digital displays.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What percentage of waking life does the average person spend on screens?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              According to global behavioral research from DataReportal and Nielsen, the average adult spends between 6.5 and 7.5 hours per day looking at screens across work and personal devices. Assuming 8 hours of sleep per night (leaving 16 conscious waking hours), the typical modern adult spends between 40% and 48% of their entire conscious lifetime looking directly into digital displays.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What is the neurological mechanism that makes smartphone scrolling addictive?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Social media feeds utilize a 'variable ratio schedule of reinforcement,' the exact psychological conditioning mechanism discovered by B.F. Skinner and used in casino slot machines. Because an unpredictable swipe may reveal a high-dopamine stimulus (a viral video, notification, or message), the brain's mesolimbic dopamine pathway triggers anticipatory dopamine spikes that compel continuous scrolling.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">How does blue light from screens disrupt circadian rhythms and sleep quality?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              Digital screens emit short-wavelength light in the 450–480 nm blue spectrum. This light stimulates intrinsically photosensitive retinal ganglion cells (ipRGCs) that signal the brain's suprachiasmatic nucleus that it is solar noon. This suppresses the pineal gland's secretion of melatonin by up to 50% and shifts your circadian phase later by 1.5 to 3 hours, destroying deep Stage 3 slow-wave sleep.\n            </p>\n          </details>\n\n          <details style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem 1rem;\">\n            <summary style=\"font-weight: bold; cursor: pointer; color: var(--fg); font-size: 0.95rem;\">What is a realistic, sustainable dopamine detox protocol?</summary>\n            <p style=\"margin: 0.75rem 0 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;\">\n              A sustainable digital detox focuses on structural environmental friction rather than pure willpower: (1) Switch your phone display to Grayscale (colorless) mode, reducing visual dopamine reward; (2) Create a physical charging station outside the bedroom so you never sleep next to a screen; (3) Turn off all non-human notifications (apps, news, social feeds); and (4) Institute a 12- to 24-hour weekly digital sabbath.\n            </p>\n          </details>\n        </div>\n      </section>\n    </div>\n\n    <script>\n      function setAgePreset(a) {\n        document.getElementById('st-age').value = a;\n        calcScreenTime();\n      }\n\n      function calcScreenTime() {\n        var age = parseFloat(document.getElementById('st-age').value) || 28;\n        var exp = parseFloat(document.getElementById('st-exp').value) || 80;\n        var sleep = parseFloat(document.getElementById('st-sleep').value) || 7.5;\n        var phone = parseFloat(document.getElementById('st-phone').value) || 0;\n        var pc = parseFloat(document.getElementById('st-pc').value) || 0;\n        var tv = parseFloat(document.getElementById('st-tv').value) || 0;\n\n        var yearsRemaining = Math.max(1, exp - age);\n        var wakingHours = Math.max(1, 24.0 - sleep);\n        var totalDailyScreen = phone + pc + tv;\n\n        // Lifetime calculations\n        // Continuous 24/7 years:\n        var totalLifetimeScreenYears = (totalDailyScreen / 24.0) * yearsRemaining;\n        var totalLifetimeSleepYears = (sleep / 24.0) * yearsRemaining;\n        var totalLifetimeRealYears = Math.max(0, yearsRemaining - totalLifetimeScreenYears - totalLifetimeSleepYears);\n\n        var pctWaking = Math.min(100, Math.round((totalDailyScreen / wakingHours) * 100));\n\n        // Update KPIs\n        document.getElementById('kpi-years').textContent = totalLifetimeScreenYears.toFixed(1) + ' Years';\n        document.getElementById('kpi-pct-waking').textContent = pctWaking + '%';\n        document.getElementById('kpi-daily-total').textContent = totalDailyScreen.toFixed(1) + 'h';\n        document.getElementById('kpi-waking-hrs').textContent = wakingHours.toFixed(1) + 'h';\n        document.getElementById('kpi-real-life').textContent = totalLifetimeRealYears.toFixed(1) + ' Years';\n        document.getElementById('donut-rem-years').textContent = Math.round(yearsRemaining).toString();\n\n        // Opportunity Costs (Assuming 50% non-work screen time redirected)\n        var leisureDailyScreen = Math.max(0, phone + tv);\n        var reclaimableHours = (leisureDailyScreen * 0.50) * 365.25 * yearsRemaining;\n\n        var languages = Math.floor(reclaimableHours / 600); // 600h per FSI language\n        var books = Math.floor(reclaimableHours / 250);     // 250h per novel\n        var masteries = (reclaimableHours / 10000).toFixed(1); // 10,000h mastery\n\n        document.getElementById('opp-lang').textContent = languages.toLocaleString('en-US') + ' Languages';\n        document.getElementById('opp-books').textContent = books.toLocaleString('en-US') + ' Books';\n        document.getElementById('opp-mastery').textContent = masteries + ' Skills';\n\n        // Render SVG Donut Chart\n        renderDonutSvg(totalLifetimeSleepYears, totalLifetimeScreenYears, totalLifetimeRealYears, yearsRemaining);\n      }\n\n      function renderDonutSvg(sleepYrs, screenYrs, realYrs, totalYrs) {\n        var svg = document.getElementById('st-donut-svg');\n        var w = 760, h = 260;\n        var cx = 140, cy = 130, r = 85, hole = 50;\n\n        var pSleep = (sleepYrs / totalYrs);\n        var pScreen = (screenYrs / totalYrs);\n        var pReal = (realYrs / totalYrs);\n\n        function polarToCartesian(centerX, centerY, radius, angleInDegrees) {\n          var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;\n          return {\n            x: centerX + (radius * Math.cos(angleInRadians)),\n            y: centerY + (radius * Math.sin(angleInRadians))\n          };\n        }\n\n        function describeDonutSlice(centerX, centerY, outerR, innerR, startAngle, endAngle) {\n          var startOuter = polarToCartesian(centerX, centerY, outerR, endAngle);\n          var endOuter = polarToCartesian(centerX, centerY, outerR, startAngle);\n          var startInner = polarToCartesian(centerX, centerY, innerR, endAngle);\n          var endInner = polarToCartesian(centerX, centerY, innerR, startAngle);\n\n          var largeArcFlag = endAngle - startAngle <= 180 ? \"0\" : \"1\";\n\n          return [\n            \"M\", startOuter.x, startOuter.y,\n            \"A\", outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,\n            \"L\", endInner.x, endInner.y,\n            \"A\", innerR, innerR, 0, largeArcFlag, 1, startInner.x, startInner.y,\n            \"Z\"\n          ].join(\" \");\n        }\n\n        var a1 = 0;\n        var a2 = a1 + (pSleep * 360);\n        var a3 = a2 + (pScreen * 360);\n        var a4 = a3 + (pReal * 360);\n\n        var svgContent = '';\n\n        // Slices\n        svgContent += '<path d=\"' + describeDonutSlice(cx, cy, r, hole, a1, a2) + '\" fill=\"#3b82f6\" stroke=\"var(--surface)\" stroke-width=\"2\"><title>Sleeping: ' + sleepYrs.toFixed(1) + ' Years (' + (pSleep * 100).toFixed(1) + '%)</title></path>';\n        svgContent += '<path d=\"' + describeDonutSlice(cx, cy, r, hole, a2, a3) + '\" fill=\"#ef4444\" stroke=\"var(--surface)\" stroke-width=\"2\"><title>Screen Time: ' + screenYrs.toFixed(1) + ' Years (' + (pScreen * 100).toFixed(1) + '%)</title></path>';\n        svgContent += '<path d=\"' + describeDonutSlice(cx, cy, r, hole, a3, 360) + '\" fill=\"#22c55e\" stroke=\"var(--surface)\" stroke-width=\"2\"><title>Real Life: ' + realYrs.toFixed(1) + ' Years (' + (pReal * 100).toFixed(1) + '%)</title></path>';\n\n        // Donut center text\n        svgContent += '<text x=\"' + cx + '\" y=\"' + (cy - 6) + '\" font-size=\"14\" font-weight=\"bold\" fill=\"var(--fg)\" text-anchor=\"middle\">' + Math.round(totalYrs) + ' Yrs</text>';\n        svgContent += '<text x=\"' + cx + '\" y=\"' + (cy + 12) + '\" font-size=\"9\" fill=\"var(--text-muted)\" text-anchor=\"middle\">Remaining</text>';\n\n        // Legend Breakdown Table on Right Side\n        var legX = 300, legY = 45;\n        svgContent += '<text x=\"' + legX + '\" y=\"' + legY + '\" font-size=\"13\" font-weight=\"bold\" fill=\"var(--fg)\">Remaining Lifetime Allocation:</text>';\n\n        var items = [\n          { color: '#ef4444', label: 'Screen Time (Continuous 24/7)', yrs: screenYrs.toFixed(1) + ' Years', pct: (pScreen * 100).toFixed(1) + '%' },\n          { color: '#3b82f6', label: 'Sleeping (Restorative Unconsciousness)', yrs: sleepYrs.toFixed(1) + ' Years', pct: (pSleep * 100).toFixed(1) + '%' },\n          { color: '#22c55e', label: 'True Unplugged Conscious Life', yrs: realYrs.toFixed(1) + ' Years', pct: (pReal * 100).toFixed(1) + '%' }\n        ];\n\n        items.forEach(function(item, idx) {\n          var rowY = legY + 35 + (idx * 55);\n          svgContent += '<rect x=\"' + legX + '\" y=\"' + (rowY - 12) + '\" width=\"14\" height=\"14\" fill=\"' + item.color + '\" rx=\"3\" />';\n          svgContent += '<text x=\"' + (legX + 24) + '\" y=\"' + rowY + '\" font-size=\"12\" font-weight=\"bold\" fill=\"var(--fg)\">' + item.label + '</text>';\n          svgContent += '<text x=\"' + (legX + 24) + '\" y=\"' + (rowY + 18) + '\" font-size=\"11\" font-family=\"var(--mono)\" fill=\"var(--text-muted)\">' + item.yrs + ' (' + item.pct + ' of remaining lifespan)</text>';\n        });\n\n        svg.innerHTML = svgContent;\n      }\n\n      function copyScreenSummary() {\n        var age = document.getElementById('st-age').value;\n        var exp = document.getElementById('st-exp').value;\n        var yrs = document.getElementById('kpi-years').textContent;\n        var pct = document.getElementById('kpi-pct-waking').textContent;\n        var real = document.getElementById('kpi-real-life').textContent;\n        var daily = document.getElementById('kpi-daily-total').textContent;\n\n        var text = '=== LIFETIME SCREEN TIME AUDIT ===\\n' +\n                   'Current Age: ' + age + ' | Life Expectancy: ' + exp + '\\n' +\n                   'Daily Screen Time: ' + daily + ' / day\\n\\n' +\n                   'Continuous Years Lost to Screens: ' + yrs + '\\n' +\n                   'Percentage of Conscious Waking Life on Screens: ' + pct + '\\n' +\n                   'True Unplugged Conscious Life Left: ' + real + '\\n' +\n                   'Calculated via Digital Tools Shed (digitaltoolsshed.com/health/screen-time-calculator)';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copy-summary-btn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span style=\"color:#22c55e; font-weight:bold;\">✓ Copied to Clipboard!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2500);\n        });\n      }\n\n      document.addEventListener('DOMContentLoaded', calcScreenTime);\n    </script>\n  "
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

              <!-- One-Click Diagnostic Copy -->
              <button type="button" id="btnCopyNoise" onclick="copyNoiseSummary()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Acoustic Dose &amp; Hearing Protection Summary</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Audiology & Noise Exposure Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Audiology &amp; Industrial Noise Exposure Traps</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The Logarithmic Power Fallacy (+3dB Doubles Acoustic Energy)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  The decibel scale is logarithmic, not linear. An increase of just 3 dB (e.g., from 85 dB to 88 dB) exactly <strong>doubles</strong> acoustic sound energy hitting your tympanic membrane and cochlear hair cells, slashing allowable safe exposure time by 50% (from 8 hours to 4 hours). At 100 dB (chainsaw or subway screech), safe exposure plunges to just 15 minutes per 24 hours.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. OSHA 5dB vs. NIOSH 3dB Regulatory Disparity (25% Lifetime Risk)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  OSHA's statutory workplace standard uses a permissive 5 dB exchange rate (permitting 90 dB for 8 hours and 95 dB for 4 hours), originally set in the 1970s for industrial cost compliance. The CDC and NIOSH mandate the scientifically grounded 3 dB exchange rate (85 dB for 8 hours). Working under OSHA minimums leaves workers with a staggering 25% lifetime risk of permanent occupational hearing loss.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🎧 3. Commuter Earbud Overcompensation in Ambient Noise</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In noisy environments like commuter trains, buses, or fitness gyms (ambient 75–80 dB), listeners instinctively crank headphone volume to 80%–90% (92–98 dB) to overcome background masking. Because silicone tips seal the ear canal and direct high-pressure sound waves millimeters from the eardrum, a single 45-minute commute delivers 300%+ of your safe daily acoustic dose.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔇 4. Noise Reduction Rating (NRR) 50% Field Derating Reality</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Foam earplugs and earmuffs advertise laboratory NRR ratings (e.g., NRR 33 dB) achieved under flawless technician fitting. OSHA officially mandates derating manufacturer NRR by 50% for real-world usage: an NRR 33 plug delivers only (33 - 7) / 2 = 13 dB of actual field attenuation. Poorly rolled or loose foam plugs deliver practically zero protection against high-frequency hearing loss.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">⚡ 5. \"Hidden Hearing Loss\" (Cochlear Synaptopathy &amp; Tinnitus)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Standard clinical audiograms test pure-tone detection in dead-silent sound booths, frequently returning \"normal hearing\" scores even after severe acoustic trauma. However, high-decibel sound destroys the synaptic ribbons connecting inner hair cells to the auditory nerve (synaptopathy). This causes chronic irreversible tinnitus (ringing) and severe \"speech-in-noise\" deficits where speech cannot be distinguished in restaurants or meetings.
                </p>
              </div>
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

          
          window.copyNoiseSummary = function() {
            var db = document.getElementById('dbInput') ? document.getElementById('dbInput').value : '';
            var mins = document.getElementById('noiseMins') ? document.getElementById('noiseMins').value : '';
            var dose = document.getElementById('noiseDose') ? document.getElementById('noiseDose').textContent : '';
            var warn = document.getElementById('doseWarning') ? document.getElementById('doseWarning').textContent : '';
            var maxSafe = document.getElementById('maxSafeTime') ? document.getElementById('maxSafeTime').textContent : '';
            var ex = document.getElementById('dbExample') ? document.getElementById('dbExample').textContent : '';

            var text = '🎧 Noise Exposure & Acoustic Dose Assessment\n' +
              '• Sound Pressure Level: ' + db + ' dB (' + ex.replace('Example: ', '') + ')\n' +
              '• Exposure Duration: ' + mins + ' minutes\n' +
              '• Daily Safe Noise Dose: ' + dose + ' (' + warn + ')\n' +
              '• Max Allowable Safe Limit (NIOSH 3dB Rule): ' + maxSafe + ' per 24 hours\n' +
              '• Hearing Conservation Standard: NIOSH recommended exposure limit (REL) 85 dBA TWA\n\n' +
              'Calculated at digitaltoolsshed.com/health/noise-exposure-calculator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyNoise');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Copied Acoustic Report!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };
  
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
