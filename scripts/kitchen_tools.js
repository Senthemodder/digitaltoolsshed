import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildKitchenTools() {
  const calcDir = join(DIST, 'calc');
  ensureDir(calcDir);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. GRAMS TO CUPS BY INGREDIENT
  // ─────────────────────────────────────────────────────────────────────────────
  const gramsToCupsBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Grams to Cups
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Grams to Cups Converter (By Ingredient)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert baking and cooking grams to US cups with exact ingredient density factors for flour, sugar, butter, oats, and liquids.
        </p>
      </header>

      <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 1.05rem; font-family: var(--serif);">
        <strong>Why weight matters:</strong> 1 cup of all-purpose flour is <strong>120 grams</strong>, but 1 cup of granulated white sugar is <strong>200 grams</strong>, and 1 cup of butter is <strong>227 grams</strong>. Always select your specific ingredient!
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Ingredient & Weight</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Select Ingredient</label>
            <select id="ingredientSelect" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="calcGramsToCups()">
              <option value="120">All-Purpose Flour (1 cup = 120g)</option>
              <option value="130">Bread Flour (1 cup = 130g)</option>
              <option value="115">Cake Flour (1 cup = 115g)</option>
              <option value="120">Whole Wheat Flour (1 cup = 120g)</option>
              <option value="96">Almond Flour (1 cup = 96g)</option>
              <option value="200">Granulated Sugar (1 cup = 200g)</option>
              <option value="220">Brown Sugar, packed (1 cup = 220g)</option>
              <option value="120">Powdered / Icing Sugar (1 cup = 120g)</option>
              <option value="227">Butter (1 cup = 227g / 2 sticks)</option>
              <option value="240">Water / Milk (1 cup = 240g)</option>
              <option value="218">Vegetable Oil (1 cup = 218g)</option>
              <option value="340">Honey / Molasses (1 cup = 340g)</option>
              <option value="90">Rolled Oats (1 cup = 90g)</option>
              <option value="100">Cocoa Powder (1 cup = 100g)</option>
              <option value="170">Chocolate Chips (1 cup = 170g)</option>
              <option value="185">White Rice, uncooked (1 cup = 185g)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Weight in Grams (g)</label>
            <input type="number" id="gramsInput" value="100" min="1" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" />
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Quick Gram Presets:</span>
            <button type="button" class="btn-sm" onclick="setGrams(50)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">50g</button>
            <button type="button" class="btn-sm" onclick="setGrams(100)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">100g</button>
            <button type="button" class="btn-sm" onclick="setGrams(150)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">150g</button>
            <button type="button" class="btn-sm" onclick="setGrams(200)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">200g</button>
            <button type="button" class="btn-sm" onclick="setGrams(250)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">250g</button>
            <button type="button" class="btn-sm" onclick="setGrams(500)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">500g</button>
          </div>

          <button class="btn-primary" onclick="calcGramsToCups()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Calculate Cups</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Volume Results</h3>
          <div id="cupResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Standard Baking Weight Chart (1 US Cup)</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Ingredient</th>
                <th style="padding: 0.5rem 0.75rem;">1/4 Cup</th>
                <th style="padding: 0.5rem 0.75rem;">1/2 Cup</th>
                <th style="padding: 0.5rem 0.75rem;">3/4 Cup</th>
                <th style="padding: 0.5rem 0.75rem;">1 Cup</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">All-Purpose Flour</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">30g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">60g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">90g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">120g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Granulated Sugar</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">50g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">100g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">150g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">200g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Brown Sugar (Packed)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">55g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">110g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">165g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">220g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Butter (1 Cup = 2 Sticks)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">57g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">113g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">170g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">227g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Rolled Oats</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">23g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">45g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">68g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">90g</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Cocoa Powder</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">25g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">50g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">75g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold;">100g</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      function calcGramsToCups() {
        var grams = parseFloat(document.getElementById('gramsInput').value) || 0;
        var cupWeight = parseFloat(document.getElementById('ingredientSelect').value) || 120;

        var decimalCups = grams / cupWeight;
        var tbsp = decimalCups * 16;
        var tsp = decimalCups * 48;
        var oz = grams / 28.3495;

        var fractionText = toCookingFraction(decimalCups);

        var container = document.getElementById('cupResults');
        container.innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">US CUPS (FRACTION)</span>' +
            '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">' + fractionText + '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">DECIMAL CUPS</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: var(--fg);">' + decimalCups.toFixed(2) + ' Cups</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TABLESPOONS & TEASPOONS</span>' +
            '<div style="font-size: 1.1rem; color: var(--fg);">' + tbsp.toFixed(1) + ' Tablespoons (' + tsp.toFixed(0) + ' tsp)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">OUNCES (OZ)</span>' +
            '<div style="font-size: 1.05rem; color: var(--text-muted);">' + oz.toFixed(2) + ' oz</div>' +
          '</div>';
      }

      function toCookingFraction(val) {
        if (val <= 0) return '0 Cups';
        var whole = Math.floor(val);
        var rem = val - whole;

        var frac = '';
        if (rem >= 0.08 && rem < 0.20) frac = '1/8';
        else if (rem >= 0.20 && rem < 0.29) frac = '1/4';
        else if (rem >= 0.29 && rem < 0.42) frac = '1/3';
        else if (rem >= 0.42 && rem < 0.58) frac = '1/2';
        else if (rem >= 0.58 && rem < 0.71) frac = '2/3';
        else if (rem >= 0.71 && rem < 0.88) frac = '3/4';
        else if (rem >= 0.88) { whole += 1; frac = ''; }

        if (whole > 0 && frac) return whole + ' ' + frac + ' Cup' + (whole > 1 ? 's' : '');
        if (whole > 0 && !frac) return whole + ' Cup' + (whole > 1 ? 's' : '');
        if (frac) return frac + ' Cup';
        return val.toFixed(2) + ' Cups';
      }

      window.setGrams = function(g) {
        document.getElementById('gramsInput').value = g;
        calcGramsToCups();
      };

      document.getElementById('gramsInput').addEventListener('input', calcGramsToCups);
      calcGramsToCups();
    </script>
  `;

  writeFileSync(join(calcDir, 'grams-to-cups.html'), renderPage({
    title: 'Grams to Cups Converter (By Ingredient) | Digital Tools Shed',
    metaDesc: 'Convert grams to cups by ingredient. 100g flour = 0.83 cups, 100g sugar = 0.5 cups, 100g butter = 0.44 cups. Free baking weight chart and calculator.',
    canonical: `${DOMAIN}/calc/grams-to-cups`,
    bodyContent: gramsToCupsBody,
    currentPath: '/calc/grams-to-cups',
    faq: [
      { q: 'How many cups is 100 grams of flour?', a: '100 grams of all-purpose flour is equal to approximately 0.83 cups (or about 3/4 cup plus 1 tablespoon).' },
      { q: 'How many cups is 100 grams of sugar?', a: '100 grams of granulated white sugar is equal to exactly 0.5 cups (1/2 cup).' },
      { q: 'How many cups is 100 grams of butter?', a: '100 grams of butter is equal to 0.44 cups (approx. 7 tablespoons, or just under 1 stick of butter).' },
      { q: 'Why do different ingredients have different cup weights?', a: 'Cups measure volume, while grams measure weight. Dense ingredients like sugar or honey weigh much more per cup than aerated ingredients like flour or cocoa powder.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. CUPS TO GRAMS BY INGREDIENT
  // ─────────────────────────────────────────────────────────────────────────────
  const cupsToGramsBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Cups to Grams
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Cups to Grams Converter (By Ingredient)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert US cups to grams (g) and ounces (oz) for recipe precision using a digital kitchen scale.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Ingredient & Cups</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Select Ingredient</label>
            <select id="ingredientSelectCups" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 1rem;" onchange="calcCupsToGrams()">
              <option value="120">All-Purpose Flour (120g per cup)</option>
              <option value="130">Bread Flour (130g per cup)</option>
              <option value="115">Cake Flour (115g per cup)</option>
              <option value="120">Whole Wheat Flour (120g per cup)</option>
              <option value="96">Almond Flour (96g per cup)</option>
              <option value="200">Granulated Sugar (200g per cup)</option>
              <option value="220">Brown Sugar, packed (220g per cup)</option>
              <option value="120">Powdered Sugar (120g per cup)</option>
              <option value="227">Butter (227g per cup / 2 sticks)</option>
              <option value="240">Water / Milk (240g per cup)</option>
              <option value="218">Vegetable Oil (218g per cup)</option>
              <option value="340">Honey / Maple Syrup (340g per cup)</option>
              <option value="90">Rolled Oats (90g per cup)</option>
              <option value="100">Cocoa Powder (100g per cup)</option>
              <option value="170">Chocolate Chips (170g per cup)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Number of Cups</label>
            <input type="number" id="cupsInput" value="1" min="0.1" step="0.25" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" />
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Recipe Cup Fractions:</span>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/4 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.333)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/3 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.5)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/2 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.666)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">2/3 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.75)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">3/4 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(1)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(2)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">2 Cups</button>
          </div>

          <button class="btn-primary" onclick="calcCupsToGrams()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Calculate Grams</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Weight Results</h3>
          <div id="gramResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
    </div>

    <script>
      function calcCupsToGrams() {
        var cups = parseFloat(document.getElementById('cupsInput').value) || 0;
        var cupWeight = parseFloat(document.getElementById('ingredientSelectCups').value) || 120;

        var grams = cups * cupWeight;
        var oz = grams / 28.3495;
        var tbsp = cups * 16;

        var container = document.getElementById('gramResults');
        container.innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">GRAMS (SCALE WEIGHT)</span>' +
            '<div style="font-size: 1.8rem; font-weight: bold; color: #10b981;">' + grams.toFixed(1) + ' g</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">OUNCES (OZ)</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: var(--fg);">' + oz.toFixed(2) + ' oz</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">EQUIVALENT TABLESPOONS</span>' +
            '<div style="font-size: 1.1rem; color: var(--text-muted);">' + tbsp.toFixed(1) + ' Tablespoons</div>' +
          '</div>';
      }

      window.setCupFraction = function(c) {
        document.getElementById('cupsInput').value = c;
        calcCupsToGrams();
      };

      document.getElementById('cupsInput').addEventListener('input', calcCupsToGrams);
      calcCupsToGrams();
    </script>
  `;

  writeFileSync(join(calcDir, 'cups-to-grams.html'), renderPage({
    title: 'Cups to Grams Converter (By Ingredient) | Digital Tools Shed',
    metaDesc: 'Convert cups to grams by ingredient. 1 cup flour = 120g, 1 cup sugar = 200g, 1/2 cup butter = 113g. Instant baking scale weights and fraction guide.',
    canonical: `${DOMAIN}/calc/cups-to-grams`,
    bodyContent: cupsToGramsBody,
    currentPath: '/calc/cups-to-grams',
    faq: [
      { q: 'How many grams is 1 cup of all-purpose flour?', a: '1 level cup of all-purpose flour is equal to 120 grams (or 4.25 ounces).' },
      { q: 'How many grams is 1/2 cup of granulated sugar?', a: '1/2 cup of granulated white sugar is equal to 100 grams.' },
      { q: 'How many grams is 1 cup of butter?', a: '1 cup of butter (which equals 2 American sticks) is equal to 227 grams (or 8 ounces).' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. BUTTER CONVERTER (STICKS, TBSP, CUPS, OZ, GRAMS)
  // ─────────────────────────────────────────────────────────────────────────────
  const butterBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Butter Converter
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Butter Converter (Sticks, Tablespoons, Cups & Grams)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert butter measurements across sticks, tablespoons, cups, ounces, and metric grams with instant live calculation.
        </p>
      </header>

      <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 1.05rem; font-family: var(--serif);">
        <strong>The Universal Butter Formula:</strong> 1 Stick of Butter = <strong>8 Tablespoons</strong> = <strong>1/2 Cup</strong> = <strong>4 Ounces</strong> = <strong>113.4 Grams</strong> = <strong>1/4 Pound</strong>.
      </div>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Sticks of Butter</label>
            <input type="number" id="butterSticks" value="1" min="0" step="0.25" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="fromSticks()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Tablespoons (tbsp)</label>
            <input type="number" id="butterTbsp" value="8" min="0" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="fromTbsp()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">US Cups</label>
            <input type="number" id="butterCups" value="0.5" min="0" step="0.125" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="fromCups()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Grams (g)</label>
            <input type="number" id="butterGrams" value="113.4" min="0" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="fromGrams()" />
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
          <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Common Recipe Amounts:</span>
          <button type="button" class="btn-sm" onclick="setSticks(0.25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/4 Stick (2 tbsp / 28g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(0.5)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/2 Stick (4 tbsp / 57g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(1)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1 Stick (1/2 cup / 113g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(2)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">2 Sticks (1 cup / 227g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(4)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">4 Sticks (1 lb / 454g)</button>
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
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Complete Butter Conversion Table</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Sticks</th>
                <th style="padding: 0.5rem 0.75rem;">Tablespoons</th>
                <th style="padding: 0.5rem 0.75rem;">Cups</th>
                <th style="padding: 0.5rem 0.75rem;">Ounces</th>
                <th style="padding: 0.5rem 0.75rem;">Grams</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1/8 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1/16 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">0.5 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">14.2 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1/4 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">2 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1/8 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.0 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">28.4 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1/2 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">4 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1/4 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">2.0 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">56.7 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">8 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">1/2 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">4.0 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">113.4 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">2 Sticks</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">16 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">1 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">8.0 oz (1/2 lb)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">226.8 g</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold;">4 Sticks (1 lb)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">32 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">2 cups</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">16.0 oz (1 lb)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">453.6 g</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      function fromSticks() {
        var s = parseFloat(document.getElementById('butterSticks').value) || 0;
        document.getElementById('butterTbsp').value = parseFloat((s * 8).toFixed(2));
        document.getElementById('butterCups').value = parseFloat((s * 0.5).toFixed(3));
        document.getElementById('butterGrams').value = parseFloat((s * 113.398).toFixed(1));
      }
      function fromTbsp() {
        var t = parseFloat(document.getElementById('butterTbsp').value) || 0;
        document.getElementById('butterSticks').value = parseFloat((t / 8).toFixed(3));
        document.getElementById('butterCups').value = parseFloat((t / 16).toFixed(3));
        document.getElementById('butterGrams').value = parseFloat((t * 14.175).toFixed(1));
      }
      function fromCups() {
        var c = parseFloat(document.getElementById('butterCups').value) || 0;
        document.getElementById('butterSticks').value = parseFloat((c * 2).toFixed(2));
        document.getElementById('butterTbsp').value = parseFloat((c * 16).toFixed(1));
        document.getElementById('butterGrams').value = parseFloat((c * 226.796).toFixed(1));
      }
      function fromGrams() {
        var g = parseFloat(document.getElementById('butterGrams').value) || 0;
        document.getElementById('butterSticks').value = parseFloat((g / 113.398).toFixed(3));
        document.getElementById('butterTbsp').value = parseFloat((g / 14.175).toFixed(2));
        document.getElementById('butterCups').value = parseFloat((g / 226.796).toFixed(3));
      }
      window.setSticks = function(val) {
        document.getElementById('butterSticks').value = val;
        fromSticks();
      };
    </script>
  `;

  writeFileSync(join(calcDir, 'butter-converter.html'), renderPage({
    title: 'Butter Converter: Sticks, Tablespoons, Cups & Grams | Digital Tools Shed',
    metaDesc: 'Convert butter between sticks, tablespoons, cups, ounces, and grams instantly. 1 stick of butter = 8 tbsp = 1/2 cup = 113.4g. Free printable baking chart.',
    canonical: `${DOMAIN}/calc/butter-converter`,
    bodyContent: butterBody,
    currentPath: '/calc/butter-converter',
    faq: [
      { q: 'How many tablespoons are in 1 stick of butter?', a: '1 stick of butter is equal to exactly 8 tablespoons (which is also 1/2 cup or 4 ounces).' },
      { q: 'How many grams is 1 stick of butter?', a: '1 American stick of butter weighs exactly 113.4 grams (4 ounces).' },
      { q: 'How many sticks of butter make 1 cup?', a: '2 sticks of butter make 1 cup (16 tablespoons or 226.8 grams).' }
    ]
  }));

  console.log('  ✓ Built Kitchen Suite (grams-to-cups, cups-to-grams, butter-converter in /calc/)');
}
