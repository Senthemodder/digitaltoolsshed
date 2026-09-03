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
      title: 'BMI (Body Mass Index) Calculator',
      metaDesc: 'Calculate Body Mass Index (BMI) using metric (kg/cm) or imperial (lbs/inches) units with WHO health weight ranges.',
      category: 'Health',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; BMI Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">BMI (Body Mass Index) Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Assess your body mass index against official World Health Organization categories.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Weight (kg)</label>
                <input type="number" id="bmi-weight" class="text-input" value="70" step="0.5" oninput="calcBMI()" />
              </div>
              <div class="field-group">
                <label class="field-label">Height (cm)</label>
                <input type="number" id="bmi-height" class="text-input" value="175" oninput="calcBMI()" />
              </div>
            </div>

            <div class="result-card">
              <div class="field-label">Your BMI Score</div>
              <div id="bmi-score" class="result-val">22.9</div>
              <div id="bmi-category" style="font-size: 1.1rem; font-weight: bold; color: #22c55e; margin-top: 0.4rem;">Normal Weight</div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem;">
                Healthy BMI range: 18.5 – 24.9 kg/m²
              </div>
            </div>
          </div>
        </div>

        <script>
          function calcBMI() {
            const w = parseFloat(document.getElementById('bmi-weight').value) || 0;
            const h = (parseFloat(document.getElementById('bmi-height').value) || 1) / 100;
            const bmi = w / (h * h);

            const scoreEl = document.getElementById('bmi-score');
            const catEl = document.getElementById('bmi-category');

            scoreEl.textContent = bmi.toFixed(1);

            let cat = 'Normal Weight';
            let color = '#22c55e';
            if (bmi < 18.5) { cat = 'Underweight'; color = '#3b82f6'; }
            else if (bmi >= 25 && bmi < 29.9) { cat = 'Overweight'; color = '#f59e0b'; }
            else if (bmi >= 30) { cat = 'Obese'; color = '#ef4444'; }

            catEl.textContent = cat;
            catEl.style.color = color;
          }
          document.addEventListener('DOMContentLoaded', calcBMI);
        </script>
      `
    },
    {
      slug: 'tdee-calculator',
      title: 'TDEE & Calorie Burn Calculator',
      metaDesc: 'Calculate Total Daily Energy Expenditure (TDEE) and Basal Metabolic Rate (BMR) with Mifflin-St Jeor equation.',
      category: 'Health',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; TDEE Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">TDEE & Calorie Burn Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Discover your daily maintenance calories, BMR, and caloric targets for weight loss or muscle building.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Gender</label>
                <select id="tdee-gender" class="text-input" onchange="calcTdee()">
                  <option value="male" selected>Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Age</label>
                <input type="number" id="tdee-age" class="text-input" value="25" oninput="calcTdee()" />
              </div>
              <div class="field-group">
                <label class="field-label">Weight (kg)</label>
                <input type="number" id="tdee-weight" class="text-input" value="70" oninput="calcTdee()" />
              </div>
              <div class="field-group">
                <label class="field-label">Height (cm)</label>
                <input type="number" id="tdee-height" class="text-input" value="175" oninput="calcTdee()" />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Activity Level</label>
              <select id="tdee-act" class="text-input" onchange="calcTdee()">
                <option value="1.2">Sedentary (desk job, little exercise)</option>
                <option value="1.375" selected>Light Activity (exercise 1-3 times/week)</option>
                <option value="1.55">Moderate Activity (exercise 3-5 times/week)</option>
                <option value="1.725">Heavy Activity (intense training 6-7 times/week)</option>
              </select>
            </div>

            <div class="result-card">
              <div class="field-label">Maintenance Calories (TDEE)</div>
              <div id="tdee-val" class="result-val">2,305 kcal / day</div>
              <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.5rem;">
                Basal Metabolic Rate (BMR): <strong id="bmr-val" style="color: var(--fg);">1,675 kcal</strong> |
                Fat Loss Target (-500 kcal): <strong id="loss-val" style="color: #22c55e;">1,805 kcal</strong>
              </div>
            </div>
          </div>
        </div>

        <script>
          function calcTdee() {
            const g = document.getElementById('tdee-gender').value;
            const age = parseFloat(document.getElementById('tdee-age').value) || 25;
            const w = parseFloat(document.getElementById('tdee-weight').value) || 70;
            const h = parseFloat(document.getElementById('tdee-height').value) || 175;
            const mult = parseFloat(document.getElementById('tdee-act').value) || 1.375;

            // Mifflin-St Jeor
            let bmr = (10 * w) + (6.25 * h) - (5 * age);
            bmr += (g === 'male' ? 5 : -161);

            const tdee = Math.round(bmr * mult);

            document.getElementById('tdee-val').textContent = tdee.toLocaleString() + ' kcal / day';
            document.getElementById('bmr-val').textContent = Math.round(bmr).toLocaleString() + ' kcal';
            document.getElementById('loss-val').textContent = (tdee - 500).toLocaleString() + ' kcal';
          }
          document.addEventListener('DOMContentLoaded', calcTdee);
        </script>
      `
    },
    {
      slug: 'water-intake',
      title: 'Daily Water Intake Calculator',
      metaDesc: 'Calculate optimal daily water consumption in liters and ounces based on body weight, climate, and exercise.',
      category: 'Health',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; Water Intake Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Daily Water Intake Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Find your target daily hydration goal based on your body weight and daily activity level.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Body Weight (kg)</label>
                <input type="number" id="water-weight" class="text-input" value="70" oninput="calcWater()" />
              </div>
              <div class="field-group">
                <label class="field-label">Daily Exercise (Minutes)</label>
                <input type="number" id="water-exercise" class="text-input" value="30" oninput="calcWater()" />
              </div>
            </div>

            <div class="result-card">
              <div class="field-label">Recommended Daily Water Intake</div>
              <div id="water-liters" class="result-val">2.8 Liters</div>
              <div id="water-glasses" style="font-size: 1rem; color: var(--text-muted); margin-top: 0.4rem;">
                ~11.5 standard glasses (240ml / 8oz each)
              </div>
            </div>
          </div>
        </div>

        <script>
          function calcWater() {
            const w = parseFloat(document.getElementById('water-weight').value) || 0;
            const ex = parseFloat(document.getElementById('water-exercise').value) || 0;

            // Baseline: 35ml per kg + 350ml per 30 mins exercise
            const ml = (w * 35) + ((ex / 30) * 350);
            const liters = (ml / 1000).toFixed(1);
            const glasses = (ml / 240).toFixed(1);

            document.getElementById('water-liters').textContent = liters + ' Liters';
            document.getElementById('water-glasses').textContent = '~' + glasses + ' standard glasses (240ml each)';
          }
          document.addEventListener('DOMContentLoaded', calcWater);
        </script>
      `
    },
    {
      slug: 'sleep-calculator',
      title: 'Sleep Cycle & Wake-Up Calculator',
      metaDesc: 'Calculate optimal bedtimes and wake-up times based on 90-minute REM sleep cycles to avoid grogginess.',
      category: 'Health',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; Sleep Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Sleep Cycle & Wake-Up Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Waking up in the middle of a sleep cycle leaves you feeling groggy. Use 90-minute natural REM cycles to wake up energized.
          </p>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">If you go to sleep RIGHT NOW:</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              (Accounting for 15 minutes average time to fall asleep)
            </p>
            <div id="sleep-now-times" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem;"></div>
          </div>
        </div>

        <script>
          function formatTimeStr(d) {
            let h = d.getHours();
            const m = d.getMinutes().toString().padStart(2, '0');
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            return h + ':' + m + ' ' + ampm;
          }

          function calcSleepNow() {
            const container = document.getElementById('sleep-now-times');
            container.innerHTML = '';
            const now = new Date();
            now.setMinutes(now.getMinutes() + 15); // +15 mins to fall asleep

            const cycles = [
              { c: 6, label: '9 Hours (6 cycles)', best: true },
              { c: 5, label: '7.5 Hours (5 cycles)', best: true },
              { c: 4, label: '6 Hours (4 cycles)', best: false },
              { c: 3, label: '4.5 Hours (3 cycles)', best: false }
            ];

            cycles.forEach(item => {
              const d = new Date(now.getTime() + (item.c * 90 * 60 * 1000));
              const card = document.createElement('div');
              card.style.cssText = 'background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 4px; text-align: center;';
              card.innerHTML = '<div><strong style="font-family:var(--mono); font-size: 1.3rem; color:' + (item.best ? '#22c55e' : 'var(--fg)') + ';">' + formatTimeStr(d) + '</strong></div><div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.3rem;">' + item.label + '</div>';
              container.appendChild(card);
            });
          }
          document.addEventListener('DOMContentLoaded', calcSleepNow);
        </script>
      `
    },
    {
      slug: 'body-fat-calculator',
      title: 'US Navy Body Fat Calculator (Circumference Method)',
      metaDesc: 'Calculate body fat percentage and lean mass using the official US Navy circumference method (height, neck, waist, and hip tape measurements).',
      category: 'Health & Fitness',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; Body Fat Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">US Navy Body Fat Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Estimate your body fat percentage, lean body mass, and fat mass using tape measure circumference standards established by the US Department of Defense.
          </p>

          <div class="tool-box">
            <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem;">
              <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-weight: bold;">
                <input type="radio" name="bf-gender" value="male" checked onchange="toggleBFGender()" /> Male
              </label>
              <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-weight: bold;">
                <input type="radio" name="bf-gender" value="female" onchange="toggleBFGender()" /> Female
              </label>
            </div>

            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Height (cm)</label>
                <input type="number" id="bf-height" class="code-input" value="178" oninput="calcBF()" />
              </div>
              <div class="field-group">
                <label class="field-label">Weight (kg)</label>
                <input type="number" id="bf-weight" class="code-input" value="80" oninput="calcBF()" />
              </div>
              <div class="field-group">
                <label class="field-label">Neck Circumference (cm)</label>
                <input type="number" id="bf-neck" class="code-input" value="38" oninput="calcBF()" />
              </div>
              <div class="field-group">
                <label class="field-label">Waist Circumference (cm at Navel)</label>
                <input type="number" id="bf-waist" class="code-input" value="86" oninput="calcBF()" />
              </div>
              <div class="field-group" id="bf-hip-group" style="display: none;">
                <label class="field-label">Hip Circumference (cm at Widest)</label>
                <input type="number" id="bf-hip" class="code-input" value="95" oninput="calcBF()" />
              </div>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Estimated Body Fat</div>
              <div id="bf-pct" class="result-val">16.8%</div>
              <div id="bf-category" style="font-size: 1.1rem; font-weight: bold; color: #10b981; margin: 0.3rem 0;">Fitness Category</div>
              <div id="bf-breakdown" style="font-size: 0.9rem; color: var(--text-muted); font-family: var(--mono); margin-top: 0.5rem;">
                Fat Mass: 13.4 kg | Lean Mass: 66.6 kg
              </div>
            </div>
          </div>
        </div>

        <script>
          function toggleBFGender() {
            var isFem = document.querySelector('input[name="bf-gender"]:checked').value === 'female';
            document.getElementById('bf-hip-group').style.display = isFem ? 'block' : 'none';
            calcBF();
          }

          function calcBF() {
            var isFem = document.querySelector('input[name="bf-gender"]:checked').value === 'female';
            var h = parseFloat(document.getElementById('bf-height').value) || 170;
            var w = parseFloat(document.getElementById('bf-weight').value) || 70;
            var neck = parseFloat(document.getElementById('bf-neck').value) || 35;
            var waist = parseFloat(document.getElementById('bf-waist').value) || 80;
            var hip = parseFloat(document.getElementById('bf-hip').value) || 90;

            var bf = 0;
            if (!isFem) {
              // US Navy Male Formula (Metric)
              var diff = waist - neck;
              if (diff <= 0) diff = 1;
              bf = 495 / (1.0324 - (0.19077 * Math.log10(diff)) + (0.15456 * Math.log10(h))) - 450;
            } else {
              // US Navy Female Formula (Metric)
              var sum = waist + hip - neck;
              if (sum <= 0) sum = 1;
              bf = 495 / (1.29579 - (0.35004 * Math.log10(sum)) + (0.22100 * Math.log10(h))) - 450;
            }

            if (isNaN(bf) || bf < 2) bf = 2;
            if (bf > 65) bf = 65;

            var fatKg = w * (bf / 100);
            var leanKg = w - fatKg;

            document.getElementById('bf-pct').textContent = bf.toFixed(1) + '%';

            var cat = 'Average';
            var col = '#3b82f6';
            if (!isFem) {
              if (bf < 6) { cat = 'Essential Fat'; col = '#ef4444'; }
              else if (bf <= 13) { cat = 'Athletes'; col = '#10b981'; }
              else if (bf <= 17) { cat = 'Fitness'; col = '#10b981'; }
              else if (bf <= 24) { cat = 'Average'; col = '#3b82f6'; }
              else { cat = 'Above Average / Obese'; col = '#f59e0b'; }
            } else {
              if (bf < 14) { cat = 'Essential Fat'; col = '#ef4444'; }
              else if (bf <= 20) { cat = 'Athletes'; col = '#10b981'; }
              else if (bf <= 24) { cat = 'Fitness'; col = '#10b981'; }
              else if (bf <= 31) { cat = 'Average'; col = '#3b82f6'; }
              else { cat = 'Above Average / Obese'; col = '#f59e0b'; }
            }

            var catEl = document.getElementById('bf-category');
            catEl.textContent = cat;
            catEl.style.color = col;

            document.getElementById('bf-breakdown').textContent = 
              'Fat Mass: ' + fatKg.toFixed(1) + ' kg (' + (fatKg * 2.20462).toFixed(1) + ' lbs) | ' +
              'Lean Mass: ' + leanKg.toFixed(1) + ' kg (' + (leanKg * 2.20462).toFixed(1) + ' lbs)';
          }

          document.addEventListener('DOMContentLoaded', calcBF);
          calcBF();
        </script>
      `
    },
    {
      slug: 'macro-calculator',
      title: 'Macro Calculator (Protein, Carbs & Fat Split for Cutting/Bulking)',
      metaDesc: 'Calculate your personalized daily macronutrient targets in grams and calories. Tailored for muscle gain bulking, fat loss cutting, and body recomposition.',
      category: 'Health & Fitness',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; Macro Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Macro Nutrient Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate your optimal daily protein, carbohydrate, and dietary fat intake based on your fitness goals and body weight.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Body Weight (kg)</label>
                <input type="number" id="mc-weight" class="code-input" value="75" oninput="calcMacros()" />
              </div>
              <div class="field-group">
                <label class="field-label">Daily Calorie Target (kcal)</label>
                <input type="number" id="mc-cal" class="code-input" value="2300" oninput="calcMacros()" />
              </div>
              <div class="field-group">
                <label class="field-label">Goal / Diet Strategy</label>
                <select id="mc-goal" class="code-input" onchange="calcMacros()">
                  <option value="cut">Fat Loss / Cutting (Higher Protein)</option>
                  <option value="maintain" selected>Maintenance / Recomp</option>
                  <option value="bulk">Muscle Gain / Bulking</option>
                  <option value="keto">Keto / Low Carb</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Protein (4 kcal/g)</div>
                <div id="mc-p-g" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">165g</div>
                <div id="mc-p-cal" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">660 kcal (29%)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #3b82f6; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Fats (9 kcal/g)</div>
                <div id="mc-f-g" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #3b82f6; margin: 0.25rem 0;">64g</div>
                <div id="mc-f-cal" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">575 kcal (25%)</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #10b981; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Carbs (4 kcal/g)</div>
                <div id="mc-c-g" style="font-family: var(--mono); font-size: 2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">266g</div>
                <div id="mc-c-cal" style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">1,065 kcal (46%)</div>
              </div>
            </div>
          </div>
        </div>

        <script>
          function calcMacros() {
            var w = parseFloat(document.getElementById('mc-weight').value) || 70;
            var cal = parseFloat(document.getElementById('mc-cal').value) || 2000;
            var goal = document.getElementById('mc-goal').value;

            var pG = 0, fG = 0, cG = 0;

            if (goal === 'cut') {
              pG = w * 2.2; // 2.2g per kg
              var fCal = cal * 0.25;
              fG = fCal / 9;
              var remCal = cal - (pG * 4) - fCal;
              cG = Math.max(0, remCal / 4);
            } else if (goal === 'bulk') {
              pG = w * 1.8;
              var fCal = cal * 0.25;
              fG = fCal / 9;
              var remCal = cal - (pG * 4) - fCal;
              cG = Math.max(0, remCal / 4);
            } else if (goal === 'keto') {
              cG = 30; // 30g net carbs
              pG = w * 1.8;
              var remCal = cal - (pG * 4) - (cG * 4);
              fG = Math.max(0, remCal / 9);
            } else {
              // Maintenance
              pG = w * 2.0;
              var fCal = cal * 0.25;
              fG = fCal / 9;
              var remCal = cal - (pG * 4) - fCal;
              cG = Math.max(0, remCal / 4);
            }

            var pCal = pG * 4;
            var fCalActual = fG * 9;
            var cCal = cG * 4;

            document.getElementById('mc-p-g').textContent = Math.round(pG) + 'g';
            document.getElementById('mc-p-cal').textContent = Math.round(pCal) + ' kcal (' + Math.round((pCal / cal) * 100) + '%)';

            document.getElementById('mc-f-g').textContent = Math.round(fG) + 'g';
            document.getElementById('mc-f-cal').textContent = Math.round(fCalActual) + ' kcal (' + Math.round((fCalActual / cal) * 100) + '%)';

            document.getElementById('mc-c-g').textContent = Math.round(cG) + 'g';
            document.getElementById('mc-c-cal').textContent = Math.round(cCal) + ' kcal (' + Math.round((cCal / cal) * 100) + '%)';
          }

          document.addEventListener('DOMContentLoaded', calcMacros);
          calcMacros();
        </script>
      `
    },
    {
      slug: 'ideal-weight-calculator',
      title: 'Ideal Body Weight Calculator (Devine, Robinson & Miller Formulas)',
      metaDesc: 'Compare your ideal weight across 4 medical formulas (Devine, Robinson, Miller, and Hamwi) along with healthy BMI threshold ranges.',
      category: 'Health & Fitness',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health & Fitness</a> &gt; Ideal Weight
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Ideal Body Weight Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Compare your target weight range across 4 medically referenced clinical formulas based on biological sex and height.
          </p>

          <div class="tool-box">
            <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem;">
              <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-weight: bold;">
                <input type="radio" name="iw-gender" value="male" checked onchange="calcIW()" /> Male
              </label>
              <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-weight: bold;">
                <input type="radio" name="iw-gender" value="female" onchange="calcIW()" /> Female
              </label>
            </div>

            <div class="field-group">
              <label class="field-label">Height (cm)</label>
              <input type="number" id="iw-height" class="code-input" value="175" min="140" max="230" oninput="calcIW()" style="font-size: 1.25rem;" />
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Consensus Ideal Weight Range</div>
              <div id="iw-range" class="result-val">68 – 73 kg</div>
              <div id="iw-lbs" style="font-size: 1.1rem; color: #10b981; font-family: var(--mono); margin-top: 0.4rem;">150 – 161 lbs</div>
            </div>

            <div style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
              <h4 style="margin: 0 0 0.75rem; font-family: var(--serif); font-size: 1.05rem;">Clinical Formula Comparison:</h4>
              <div id="iw-details" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.8; color: var(--text-muted);"></div>
            </div>
          </div>
        </div>

        <script>
          function calcIW() {
            var isMale = document.querySelector('input[name="iw-gender"]:checked').value === 'male';
            var cm = parseFloat(document.getElementById('iw-height').value) || 175;
            var totalInches = cm / 2.54;
            var over5Ft = Math.max(0, totalInches - 60);

            // Devine
            var devine = isMale ? (50 + (2.3 * over5Ft)) : (45.5 + (2.3 * over5Ft));
            // Robinson
            var robinson = isMale ? (52 + (1.9 * over5Ft)) : (49 + (1.7 * over5Ft));
            // Miller
            var miller = isMale ? (56.2 + (1.41 * over5Ft)) : (53.1 + (1.36 * over5Ft));
            // Hamwi
            var hamwi = isMale ? (48 + (2.7 * over5Ft)) : (45.5 + (2.2 * over5Ft));

            var minK = Math.min(devine, robinson, miller, hamwi);
            var maxK = Math.max(devine, robinson, miller, hamwi);

            document.getElementById('iw-range').textContent = Math.round(minK) + ' – ' + Math.round(maxK) + ' kg';
            document.getElementById('iw-lbs').textContent = Math.round(minK * 2.20462) + ' – ' + Math.round(maxK * 2.20462) + ' lbs';

            document.getElementById('iw-details').innerHTML = 
              '• <strong>Devine Formula (1974):</strong> ' + devine.toFixed(1) + ' kg (' + (devine * 2.20462).toFixed(1) + ' lbs)<br>' +
              '• <strong>Robinson Formula (1983):</strong> ' + robinson.toFixed(1) + ' kg (' + (robinson * 2.20462).toFixed(1) + ' lbs)<br>' +
              '• <strong>Miller Formula (1983):</strong> ' + miller.toFixed(1) + ' kg (' + (miller * 2.20462).toFixed(1) + ' lbs)<br>' +
              '• <strong>Hamwi Formula (1964):</strong> ' + hamwi.toFixed(1) + ' kg (' + (hamwi * 2.20462).toFixed(1) + ' lbs)';
          }

          document.addEventListener('DOMContentLoaded', calcIW);
          calcIW();
        </script>
      `
    },
    {
      slug: 'caffeine-half-life-calculator',
      title: 'Caffeine Half-Life & Sleep Crash Decay Calculator',
      metaDesc: 'Track active caffeine levels in your bloodstream hour-by-hour using pharmacokinetic 5.7h half-life. Find out when you can actually fall asleep.',
      category: 'Health & Sleep',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Caffeine Half-Life
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Caffeine Half-Life & Sleep Decay Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Wide awake at 2 AM? Caffeine has an average metabolic half-life of <strong>5.7 hours</strong>. Calculate how many milligrams are blocking adenosine in your brain right now.
          </p>

          <div class="tool-box">
            <div class="grid-inputs">
              <div class="field-group">
                <label class="field-label">Quick Beverage Preset</label>
                <select id="cafPreset" class="code-input" onchange="applyCafPreset()" style="font-size: 1.1rem;">
                  <option value="64">Single Espresso Shot (64 mg)</option>
                  <option value="95">Standard Brewed Coffee 8oz (95 mg)</option>
                  <option value="160" selected>Monster / Rockstar 16oz (160 mg)</option>
                  <option value="200">Celsius / Ghost Energy Drink (200 mg)</option>
                  <option value="310">Starbucks Venti Cold Brew (310 mg)</option>
                  <option value="390">Panera Charged Lemonade (390 mg)</option>
                  <option value="40">Black Tea / Diet Coke 12oz (40 mg)</option>
                  <option value="custom">Custom Dose...</option>
                </select>
              </div>

              <div class="field-group">
                <label class="field-label">Caffeine Consumed (mg)</label>
                <input type="number" id="cafDose" class="code-input" value="160" min="1" max="1000" step="10" oninput="calcCaf()" style="font-size: 1.25rem;" />
              </div>

              <div class="field-group">
                <label class="field-label">Time Consumed (Hours Ago)</label>
                <input type="number" id="cafHoursAgo" class="code-input" value="6" min="0" max="48" step="0.5" oninput="calcCaf()" style="font-size: 1.25rem;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Current Active Caffeine</div>
                <div id="cafRemaining" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">77.2 mg</div>
                <div id="cafPercent" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">48.3% still active in blood</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Sleep Readiness Threshold (&lt;25 mg)</div>
                <div id="cafSleepTime" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">In 5.2 hrs</div>
                <div id="cafSleepDesc" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">When slow-wave REM sleep can begin</div>
              </div>
            </div>

            <div style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 6px;">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Hourly Decay Projection</div>
              <div id="cafTimeline" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.5rem; text-align: center; font-family: var(--mono); font-size: 0.8rem;"></div>
            </div>
          </div>
        </div>

        <script>
          function applyCafPreset() {
            var val = document.getElementById('cafPreset').value;
            if (val !== 'custom') {
              document.getElementById('cafDose').value = val;
              calcCaf();
            }
          }

          function calcCaf() {
            var dose = parseFloat(document.getElementById('cafDose').value) || 0;
            var t = parseFloat(document.getElementById('cafHoursAgo').value) || 0;
            var halfLife = 5.7; // average hepatic CYP1A2 clearance half-life in hours

            // C(t) = C0 * 0.5^(t / halfLife)
            var current = dose * Math.pow(0.5, t / halfLife);
            var pct = dose > 0 ? ((current / dose) * 100) : 0;

            document.getElementById('cafRemaining').textContent = current.toFixed(1) + ' mg';
            document.getElementById('cafPercent').textContent = pct.toFixed(1) + '% still active in blood';

            // Time until <= 25 mg (threshold for undisturbed sleep)
            var sleepThreshold = 25;
            if (current <= sleepThreshold) {
              document.getElementById('cafSleepTime').textContent = 'NOW READY';
              document.getElementById('cafSleepTime').style.color = '#10b981';
              document.getElementById('cafSleepDesc').textContent = 'Caffeine level is low enough for deep sleep.';
            } else {
              // 25 = dose * 0.5^(t_total / halfLife) => t_total = halfLife * log2(dose / 25)
              var totalHoursToSleep = halfLife * (Math.log(dose / sleepThreshold) / Math.log(2));
              var hoursRemaining = Math.max(0, totalHoursToSleep - t);
              document.getElementById('cafSleepTime').textContent = 'In ' + hoursRemaining.toFixed(1) + ' hrs';
              document.getElementById('cafSleepTime').style.color = hoursRemaining > 4 ? '#ef4444' : '#f59e0b';
              document.getElementById('cafSleepDesc').textContent = 'Until blood level drops below ' + sleepThreshold + ' mg.';
            }

            // Timeline for +2h, +4h, +6h, +8h, +12h, +16h
            var intervals = [0, 2, 4, 6, 8, 12, 16, 24];
            var tlHtml = '';
            intervals.forEach(function(h) {
              var lvl = dose * Math.pow(0.5, h / halfLife);
              var isPast = h < t;
              var isNow = Math.abs(h - t) < 1;
              var color = lvl <= 25 ? '#10b981' : (lvl > 100 ? '#ef4444' : '#f59e0b');
              tlHtml += '<div style="background: var(--surface); border: 1px solid ' + (isNow ? '#3b82f6' : 'var(--border)') + '; padding: 0.4rem 0.2rem; border-radius: 4px;' + (isNow ? ' box-shadow: 0 0 6px rgba(59,130,246,0.5);' : '') + '">' +
                '<div style="color: var(--text-muted); font-size: 0.7rem;">+' + h + 'h</div>' +
                '<div style="font-weight: bold; color: ' + color + '; margin-top: 0.15rem;">' + lvl.toFixed(0) + 'mg</div>' +
              '</div>';
            });
            document.getElementById('cafTimeline').innerHTML = tlHtml;
          }

          document.addEventListener('DOMContentLoaded', calcCaf);
          calcCaf();
        </script>
      `
    },
    {
      slug: 'sleep-deprivation-calculator',
      title: 'Sleep Deprivation & BAC Impairment Equivalent Calculator',
      metaDesc: 'How impaired is your brain from staying awake? Converts continuous hours awake into equivalent Blood Alcohol Concentration (BAC) and cognitive reaction delay.',
      category: 'Health & Sleep',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/health/">Health</a> &gt; Sleep Deprivation Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Sleep Deprivation & BAC Impairment Calculator</h1>
          <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Pulling an all-nighter? Peer-reviewed neurobiology shows being awake for <strong>17 hours</strong> produces cognitive impairment equivalent to a <strong>0.05% BAC</strong>, and <strong>24 hours</strong> equals <strong>0.10% BAC</strong> (above legal drunk driving limits).
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Consecutive Hours Awake: <span id="sd-hrs-val" style="color: #ef4444; font-weight: bold; font-size: 1.2rem;">20 Hours</span></label>
              <input type="range" id="sd-range" min="8" max="72" value="20" oninput="updateSDSlider(this.value)" style="width: 100%; cursor: pointer;" />
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #ef4444; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Equivalent Blood Alcohol (BAC)</div>
                <div id="sd-bac" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin: 0.25rem 0;">0.07% BAC</div>
                <div id="sd-bac-desc" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">~3 standard alcoholic drinks</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #f59e0b; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Reaction Time Penalty</div>
                <div id="sd-react" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.25rem 0;">+45% Slower</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Lapses in attention & tracking</div>
              </div>

              <div style="background: var(--surface-alt); border: 1px solid var(--border); border-top: 4px solid #8b5cf6; padding: 1.25rem; border-radius: 6px; text-align: center;">
                <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Micro-Sleep Vulnerability</div>
                <div id="sd-micro" style="font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #8b5cf6; margin: 0.4rem 0;">High Risk</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">1-3 second involuntary brain blackouts</div>
              </div>
            </div>

            <div id="sd-clinical" style="margin-top: 1.5rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem 1.25rem; border-radius: 6px; font-size: 0.9rem; line-height: 1.6; color: var(--fg);"></div>
          </div>
        </div>

        <script>
          function updateSDSlider(val) {
            document.getElementById('sd-hrs-val').textContent = val + ' Hours';
            calcSDImpairment(parseInt(val, 10));
          }

          function calcSDImpairment(hrs) {
            var bac = 0;
            var react = 0;
            var micro = 'None';
            var microColor = '#10b981';
            var clinical = '';

            if (hrs <= 14) {
              bac = 0.00;
              react = 0;
              micro = 'Baseline';
              microColor = '#10b981';
              clinical = '<strong>Normal Cognitive Function:</strong> Optimal alertness, reaction speeds, and emotional regulation.';
            } else if (hrs <= 17) {
              bac = ((hrs - 14) / 3) * 0.05;
              react = Math.round((hrs - 14) * 5);
              micro = 'Low';
              microColor = '#3b82f6';
              clinical = '<strong>Initial Fatigue:</strong> Minor lapses in attention and reduced hand-eye coordination.';
            } else if (hrs <= 24) {
              bac = 0.05 + (((hrs - 17) / 7) * 0.05);
              react = 15 + Math.round((hrs - 17) * 8);
              micro = 'Moderate';
              microColor = '#f59e0b';
              clinical = '<strong>Equivalent to Drunk Driving (BAC 0.05% - 0.10%):</strong> Executive function and working memory drop precipitously. Driving a vehicle at this stage carries the same crash risk as being legally intoxicated.';
            } else if (hrs <= 36) {
              bac = 0.10 + (((hrs - 24) / 12) * 0.08);
              react = 71 + Math.round((hrs - 24) * 6);
              micro = 'High Risk';
              microColor = '#ef4444';
              clinical = '<strong>Severe Cognitive Collapse:</strong> Prefrontal cortex activity plummets. Sudden involuntary 2-5 second micro-sleeps occur without your conscious awareness.';
            } else {
              bac = 0.18 + (((hrs - 36) / 36) * 0.10);
              react = 140;
              micro = 'CRITICAL';
              microColor = '#dc2626';
              clinical = '<strong>Psychological & Hallucinatory State:</strong> Paranoia, visual distortions (shadow movement in peripheral vision), slurred speech, and acute hormonal stress spikes.';
            }

            document.getElementById('sd-bac').textContent = bac.toFixed(2) + '% BAC';
            document.getElementById('sd-bac-desc').textContent = '~' + Math.max(0, Math.round(bac / 0.025)) + ' standard drinks equivalent';
            document.getElementById('sd-react').textContent = '+' + react + '% Slower';
            
            var microEl = document.getElementById('sd-micro');
            microEl.textContent = micro;
            microEl.style.color = microColor;

            document.getElementById('sd-clinical').innerHTML = clinical;
          }

          document.addEventListener('DOMContentLoaded', function() { calcSDImpairment(20); });
          calcSDImpairment(20);
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
