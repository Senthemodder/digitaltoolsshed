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
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/health/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/health/${tool.slug}`
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
