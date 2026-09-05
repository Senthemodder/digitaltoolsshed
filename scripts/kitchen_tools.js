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
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Grams to Cups Converter (By Ingredient & Standard)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert culinary weight (grams) to kitchen volume (cups, tablespoons, teaspoons) with USDA density factors, chef cooking fractions, and international cup standard calibration.
        </p>
      </header>

      <!-- Key Callout -->
      <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 1rem; font-family: var(--serif);">
        <strong>Why 1 Cup is Never Just "1 Cup":</strong> Cups measure <em>volume</em>, while grams measure <em>mass</em>. One cup of all-purpose flour weighs <strong>120 grams</strong>, granulated sugar weighs <strong>200 grams</strong>, and butter weighs <strong>227 grams</strong>. Furthermore, a US Customary Cup (236.6 mL) differs from a Metric Cup (250 mL). Select your exact ingredient and measuring cup below!
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Inputs Card -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Ingredient & Measurement</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Select Ingredient</label>
            <select id="ingredientSelect" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 0.95rem;" onchange="calcGramsToCups()">
              <optgroup label="Flours & Starches">
                <option value="120|All-Purpose Flour (Spoon & Level)|0.507" selected>All-Purpose Flour (Spoon & Level: 120g/cup)</option>
                <option value="140|All-Purpose Flour (Dip & Sweep / Compacted)|0.592">All-Purpose Flour (Dip & Sweep: 140g/cup)</option>
                <option value="110|All-Purpose Flour (Sifted)|0.465">All-Purpose Flour (Sifted: 110g/cup)</option>
                <option value="130|Bread Flour|0.549">Bread Flour (130g/cup)</option>
                <option value="115|Cake / Pastry Flour|0.486">Cake & Pastry Flour (115g/cup)</option>
                <option value="120|Whole Wheat Flour|0.507">Whole Wheat Flour (120g/cup)</option>
                <option value="96|Almond Flour (Blanched Fine)|0.406">Almond Flour (Blanched: 96g/cup)</option>
                <option value="112|Coconut Flour|0.473">Coconut Flour (112g/cup)</option>
                <option value="92|Oat Flour|0.389">Oat Flour (92g/cup)</option>
                <option value="128|Cornstarch|0.541">Cornstarch (128g/cup)</option>
                <option value="120|Tapioca Flour / Starch|0.507">Tapioca Flour / Starch (120g/cup)</option>
              </optgroup>
              <optgroup label="Sugars & Sweeteners">
                <option value="200|Granulated White Sugar|0.845">Granulated White Sugar (200g/cup)</option>
                <option value="220|Brown Sugar (Firmly Packed)|0.930">Brown Sugar (Firmly Packed: 220g/cup)</option>
                <option value="145|Brown Sugar (Loose / Unpacked)|0.613">Brown Sugar (Loose / Unpacked: 145g/cup)</option>
                <option value="120|Powdered / Confectioners Sugar (Unsifted)|0.507">Powdered Sugar (Unsifted: 120g/cup)</option>
                <option value="100|Powdered / Confectioners Sugar (Sifted)|0.423">Powdered Sugar (Sifted: 100g/cup)</option>
                <option value="340|Honey (Pure Liquid)|1.437">Honey (340g/cup)</option>
                <option value="322|Pure Maple Syrup|1.361">Pure Maple Syrup (322g/cup)</option>
                <option value="328|Molasses / Dark Treacle|1.386">Molasses (328g/cup)</option>
                <option value="280|Agave Nectar|1.183">Agave Nectar (280g/cup)</option>
                <option value="192|Erythritol / Monkfruit Sweetener|0.812">Erythritol / Monkfruit Granular (192g/cup)</option>
              </optgroup>
              <optgroup label="Dairy, Fats & Oils">
                <option value="227|Butter (Solid / Salted / Unsalted)|0.959">Butter (227g/cup = 2 sticks)</option>
                <option value="218|Vegetable Oil / Canola|0.921">Vegetable / Canola Oil (218g/cup)</option>
                <option value="216|Olive Oil (Extra Virgin)|0.913">Olive Oil (216g/cup)</option>
                <option value="216|Coconut Oil (Melted)|0.913">Coconut Oil (Melted: 216g/cup)</option>
                <option value="240|Water / Whole Milk|1.014">Water / Milk (240g/cup)</option>
                <option value="238|Heavy Whipping Cream|1.006">Heavy Cream (238g/cup)</option>
                <option value="245|Sour Cream / Greek Yogurt|1.036">Sour Cream / Greek Yogurt (245g/cup)</option>
                <option value="242|Buttermilk|1.023">Buttermilk (242g/cup)</option>
                <option value="250|Peanut Butter (Smooth)|1.057">Peanut Butter (Smooth: 250g/cup)</option>
              </optgroup>
              <optgroup label="Salts, Leaveners & Cocoa">
                <option value="142|Diamond Crystal Kosher Salt (Flaky)|0.600">Diamond Crystal Kosher Salt (Flaky: 142g/cup)</option>
                <option value="241|Morton Kosher Salt (Coarse)|1.019">Morton Kosher Salt (Coarse: 241g/cup)</option>
                <option value="272|Fine Table / Sea Salt|1.150">Fine Table Salt (272g/cup)</option>
                <option value="230|Baking Powder|0.972">Baking Powder (230g/cup)</option>
                <option value="220|Baking Soda|0.930">Baking Soda (220g/cup)</option>
                <option value="150|Active Dry / Instant Yeast|0.634">Instant / Active Dry Yeast (150g/cup)</option>
                <option value="100|Dutch Cocoa Powder / Unsweetened|0.423">Cocoa Powder (Unsweetened: 100g/cup)</option>
              </optgroup>
              <optgroup label="Grains, Seeds & Mix-ins">
                <option value="90|Rolled Oats (Old Fashioned)|0.380">Rolled Oats (Old Fashioned: 90g/cup)</option>
                <option value="85|Quick Cooking Oats|0.359">Quick Oats (85g/cup)</option>
                <option value="185|White Rice (Long Grain Uncooked)|0.782">White Rice (Uncooked: 185g/cup)</option>
                <option value="190|Brown Rice (Uncooked)|0.803">Brown Rice (Uncooked: 190g/cup)</option>
                <option value="170|Semi-Sweet Chocolate Chips|0.719">Chocolate Chips (170g/cup)</option>
                <option value="115|Chopped Walnuts / Pecans|0.486">Chopped Walnuts / Pecans (115g/cup)</option>
                <option value="80|Shredded Coconut (Unsweetened)|0.338">Shredded Coconut (Unsweetened: 80g/cup)</option>
              </optgroup>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Measuring Cup Standard</label>
            <select id="cupStandardSelect" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 0.95rem;" onchange="calcGramsToCups()">
              <option value="236.588|US Customary (Pyrex / Standard Recipes)" selected>US Customary Cup (236.6 mL - American Recipes)</option>
              <option value="240.000|US Legal (FDA Nutrition Labels)">US Legal Cup (240.0 mL - FDA Nutrition Facts)</option>
              <option value="250.000|Metric (UK, Australia, NZ, Canada)">Metric Cup (250.0 mL - Australia, NZ, UK, Canada)</option>
              <option value="284.131|Imperial (Traditional British)">Imperial Cup (284.1 mL - Traditional UK Recipes)</option>
              <option value="200.000|Japanese Cup (Gou / Rice Cookers)">Japanese Cup (200.0 mL - Japanese Bento / Rice)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Weight in Grams (g)</label>
            <input type="number" id="gramsInput" value="120" min="1" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcGramsToCups()" />
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Quick Presets:</span>
            <button type="button" class="btn-sm" onclick="setGrams(25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">25g</button>
            <button type="button" class="btn-sm" onclick="setGrams(50)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">50g</button>
            <button type="button" class="btn-sm" onclick="setGrams(100)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">100g</button>
            <button type="button" class="btn-sm" onclick="setGrams(120)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">120g (1c Flour)</button>
            <button type="button" class="btn-sm" onclick="setGrams(150)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">150g</button>
            <button type="button" class="btn-sm" onclick="setGrams(200)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">200g (1c Sugar)</button>
            <button type="button" class="btn-sm" onclick="setGrams(250)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">250g</button>
            <button type="button" class="btn-sm" onclick="setGrams(500)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">500g (1/2 kg)</button>
          </div>

          <button type="button" class="btn-primary" onclick="calcGramsToCups()" style="width: 100%; padding: 0.75rem; font-size: 1rem; cursor: pointer;">Calculate Cups</button>
        </div>

        <!-- Output Card -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0;">Kitchen Volume Results</h3>
              <span id="densityBadge" style="font-family: var(--mono); font-size: 0.75rem; background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.5rem; border-radius: 4px; color: var(--text-muted);">-- g/mL</span>
            </div>
            <div id="cupResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
          </div>

          <!-- Copy Report Button -->
          <div style="margin-top: 1.5rem; pt: 1rem; border-top: 1px solid var(--border);">
            <button id="copyBakingBtn" onclick="copyBakingSummary()" class="btn-sec" style="width: 100%; padding: 0.65rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span>📋 Copy Recipe Conversion</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Mathematical Derivation -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>📐 Step-by-Step Density & Volume Derivation</span>
        </h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">
          How digital kitchen scales and volume measuring tools interact mathematically through physical bulk density:
        </p>
        <div id="derivationFormula" style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; overflow-x: auto; border: 1px solid var(--border);">
          <!-- Populated by JavaScript -->
        </div>
      </div>

      <!-- Critical Real-World Baking Traps -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
          <span>⚠️ 4 Critical Baking Pitfalls That Ruin Recipes</span>
        </h3>
        <div style="display: grid; gap: 1rem; font-size: 0.9rem; line-height: 1.6;">
          <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">1. The "Dip & Sweep" Flour Disaster (+25% Excess Flour)</strong>
            <p style="margin: 0; color: var(--text-muted);">
              Dipping a measuring cup directly into a bag of flour compacts the grain. A cup dipped and leveled weighs <strong>140g to 155g</strong>, whereas properly aerated flour (spooned into the cup and leveled) weighs <strong>120g</strong>. That extra 25g of flour per cup absorbs excess liquid, turning tender cakes rubbery and breads dense and dry.
            </p>
          </div>
          <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">2. The Kosher Salt Brand Trap (70% Salinity Discrepancy!)</strong>
            <p style="margin: 0; color: var(--text-muted);">
              Never substitute Diamond Crystal and Morton kosher salts 1:1 by volume! Diamond Crystal has hollow, pyramidal flakes (<strong>142g per cup</strong> / 2.8g per tsp). Morton has dense, flat-rolled flakes (<strong>241g per cup</strong> / 4.8g per tsp). If a recipe calls for 1 Tbsp Diamond Crystal and you use Morton, your dish will have nearly <strong>70% more sodium</strong> than intended.
            </p>
          </div>
          <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">3. Brown Sugar: Packed vs. Loose Void Volume</strong>
            <p style="margin: 0; color: var(--text-muted);">
              Because molasses makes brown sugar crystals sticky, loose brown sugar traps vast air pockets: 1 cup loose weighs only <strong>145g</strong>. Firmly packed brown sugar collapses those air gaps to reach <strong>220g</strong>. Unless a recipe explicitly says "unpacked", professional bakers always assume firmly packed.
            </p>
          </div>
          <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">4. International Cup Mismatch (US Customary vs Metric Cup)</strong>
            <p style="margin: 0; color: var(--text-muted);">
              A US Customary cup is <strong>236.6 mL</strong>, while an Australian, New Zealand, or Commonwealth metric cup is <strong>250.0 mL</strong> (+5.7% larger). If baking an Australian sourdough or British sponge cake using American measuring cups without weight calibration, hydration and leavening ratios will be skewed.
            </p>
          </div>
        </div>
      </div>

      <!-- Sponsored Ad Slot -->
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

      <!-- Standard Baking Weight Chart -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Master Baking Weight Chart (1 US Customary Cup = 236.6 mL)</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Ingredient</th>
                <th style="padding: 0.5rem 0.75rem;">1/4 Cup</th>
                <th style="padding: 0.5rem 0.75rem;">1/3 Cup</th>
                <th style="padding: 0.5rem 0.75rem;">1/2 Cup</th>
                <th style="padding: 0.5rem 0.75rem;">3/4 Cup</th>
                <th style="padding: 0.5rem 0.75rem;">1 Cup</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">All-Purpose Flour (Spoon & Level)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">30g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">40g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">60g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">90g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">120g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Bread Flour</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">32.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">43.3g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">65g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">97.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">130g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Almond Flour (Blanched Fine)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">24g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">32g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">48g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">72g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">96g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Granulated White Sugar</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">50g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">66.7g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">100g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">150g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">200g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Brown Sugar (Firmly Packed)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">55g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">73.3g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">110g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">165g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">220g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Powdered Sugar (Unsifted)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">30g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">40g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">60g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">90g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">120g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Butter (1 Cup = 2 Sticks = 16 Tbsp)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">56.7g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">75.7g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">113.4g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">170.3g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">227g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Vegetable / Canola Oil</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">54.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">72.7g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">109g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">163.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">218g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Honey / Pure Maple Syrup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">85g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">113.3g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">170g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">255g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">340g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Rolled Oats (Old Fashioned)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">22.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">30g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">45g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">67.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">90g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Dutch Cocoa Powder</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">25g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">33.3g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">50g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">75g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">100g</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold;">Chocolate Chips (Semi-Sweet)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">42.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">56.7g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">85g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">127.5g</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); font-weight: bold; color: #10b981;">170g</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      var currentConversionData = null;

      function calcGramsToCups() {
        var grams = parseFloat(document.getElementById('gramsInput').value) || 0;
        var rawIng = document.getElementById('ingredientSelect').value.split('|');
        var baseCupWeight = parseFloat(rawIng[0]) || 120;
        var ingName = rawIng[1];
        var densityGmL = parseFloat(rawIng[2]) || (baseCupWeight / 236.588);

        var rawStd = document.getElementById('cupStandardSelect').value.split('|');
        var cupVolumeMl = parseFloat(rawStd[0]) || 236.588;
        var stdName = rawStd[1];

        var adjustedCupWeight = baseCupWeight * (cupVolumeMl / 236.588);

        var decimalCups = grams > 0 ? (grams / adjustedCupWeight) : 0;
        var tbsp = decimalCups * 16;
        var tsp = decimalCups * 48;
        var oz = grams / 28.34952;
        var lb = grams / 453.59237;
        var totalMl = grams / densityGmL;
        var flOz = totalMl / 29.5735;

        var fractionText = toChefCookingFraction(decimalCups);

        document.getElementById('densityBadge').textContent = densityGmL.toFixed(3) + ' g/mL';

        var container = document.getElementById('cupResults');
        container.innerHTML = 
          '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Chef Practical Measure</span>' +
            '<div style="font-size: 1.7rem; font-weight: bold; color: #10b981; margin: 0.2rem 0;">' + fractionText + '</div>' +
            '<div style="font-size: 0.78rem; color: var(--text-muted);">Easiest way to measure with standard measuring cups & spoons</div>' +
          '</div>' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Decimal Cups</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + decimalCups.toFixed(2) + ' Cups</div>' +
              '<div style="font-size: 0.72rem; color: var(--text-muted);">' + stdName.split(' ')[0] + ' (' + cupVolumeMl.toFixed(1) + ' mL)</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Tablespoons & Tsp</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">' + tbsp.toFixed(1) + ' Tbsp</div>' +
              '<div style="font-size: 0.72rem; color: var(--text-muted);">' + tsp.toFixed(0) + ' Teaspoons (tsp)</div>' +
            '</div>' +
          '</div>' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Avoirdupois Ounces</span>' +
              '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + oz.toFixed(2) + ' oz</div>' +
              '<div style="font-size: 0.72rem; color: var(--text-muted);">' + (lb >= 0.1 ? lb.toFixed(3) + ' lbs' : (grams) + ' grams') + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Liquid Volume (mL / fl oz)</span>' +
              '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + totalMl.toFixed(1) + ' mL</div>' +
              '<div style="font-size: 0.72rem; color: var(--text-muted);">' + flOz.toFixed(2) + ' fl oz</div>' +
            '</div>' +
          '</div>';

        var deriv = document.getElementById('derivationFormula');
        deriv.innerHTML = 
          '<div><strong>1. Bulk Density of ' + ingName + ':</strong> &rho; = ' + densityGmL.toFixed(3) + ' g/mL (' + baseCupWeight + ' g per 236.6 mL US cup)</div>' +
          '<div><strong>2. Cup Standard Selected:</strong> ' + stdName + ' = ' + cupVolumeMl.toFixed(1) + ' mL per cup</div>' +
          '<div><strong>3. Adjusted Weight per Single Cup:</strong> W<sub>cup</sub> = ' + densityGmL.toFixed(3) + ' &times; ' + cupVolumeMl.toFixed(1) + ' mL = ' + adjustedCupWeight.toFixed(1) + ' g/cup</div>' +
          '<div><strong>4. Volume in Cups:</strong> Cups = ' + grams + ' g / ' + adjustedCupWeight.toFixed(1) + ' g = <strong>' + decimalCups.toFixed(3) + ' cups</strong></div>' +
          '<div><strong>5. Chef Practical Equivalents:</strong> ' + decimalCups.toFixed(2) + ' cups &times; 16 = <strong>' + tbsp.toFixed(1) + ' Tbsp</strong> = <strong>' + tsp.toFixed(1) + ' tsp</strong> (' + fractionText + ')</div>';

        currentConversionData = {
          grams: grams,
          ingredient: ingName,
          cupStandard: stdName,
          decimalCups: decimalCups.toFixed(2),
          fractionText: fractionText,
          tbsp: tbsp.toFixed(1),
          tsp: tsp.toFixed(0),
          oz: oz.toFixed(2)
        };
      }

      function toChefCookingFraction(val) {
        if (val <= 0) return '0 Cups';
        var whole = Math.floor(val);
        var rem = val - whole;

        var fracStr = '';
        if (rem < 0.06) {
          fracStr = '';
        } else if (rem >= 0.06 && rem < 0.18) {
          fracStr = '1/8 Cup';
        } else if (rem >= 0.18 && rem < 0.29) {
          fracStr = '1/4 Cup';
        } else if (rem >= 0.29 && rem < 0.41) {
          fracStr = '1/3 Cup';
        } else if (rem >= 0.41 && rem < 0.58) {
          fracStr = '1/2 Cup';
        } else if (rem >= 0.58 && rem < 0.70) {
          fracStr = '2/3 Cup';
        } else if (rem >= 0.70 && rem < 0.85) {
          fracStr = '3/4 Cup';
        } else if (rem >= 0.85 && rem < 0.94) {
          fracStr = '7/8 Cup';
        } else {
          whole += 1;
          fracStr = '';
        }

        var parts = [];
        if (whole > 0) {
          parts.push(whole + (fracStr ? ' ' + fracStr : ' Cup' + (whole > 1 ? 's' : '')));
        } else if (fracStr) {
          parts.push(fracStr);
        }

        var totalTbsp = val * 16;
        var tbspRemainder = totalTbsp % 16;
        var wholeTbsp = Math.floor(tbspRemainder);
        var tspRemainder = Math.round((tbspRemainder - wholeTbsp) * 3);

        if (whole === 0 && !fracStr) {
          if (wholeTbsp > 0) parts.push(wholeTbsp + ' Tbsp');
          if (tspRemainder > 0) parts.push(tspRemainder + ' tsp');
          return parts.join(' + ') || '< 1/4 tsp';
        }

        return parts.join(' ') || (val.toFixed(2) + ' Cups');
      }

      window.setGrams = function(g) {
        document.getElementById('gramsInput').value = g;
        calcGramsToCups();
      };

      window.copyBakingSummary = function() {
        if (!currentConversionData) return;
        var text = 
          '[Baking Conversion] ' + currentConversionData.grams + 'g ' + currentConversionData.ingredient + '\\n' +
          '• Volume: ' + currentConversionData.decimalCups + ' Cups (' + currentConversionData.fractionText + ')\\n' +
          '• Equivalents: ' + currentConversionData.tbsp + ' Tablespoons (' + currentConversionData.tsp + ' tsp)\\n' +
          '• Weight: ' + currentConversionData.oz + ' oz (' + currentConversionData.grams + ' grams)\\n' +
          '• Standard: ' + currentConversionData.cupStandard + '\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/grams-to-cups';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyBakingBtn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span style=\"color:#10b981; font-weight:bold;\">✓ Copied Recipe Line!</span>';
          setTimeout(function() { btn.innerHTML = orig; }, 2200);
        });
      };

      document.addEventListener('DOMContentLoaded', calcGramsToCups);
      calcGramsToCups();
    </script>
  `;

  writeFileSync(join(calcDir, 'grams-to-cups.html'), renderPage({
    title: 'Grams to Cups Converter (By Ingredient & Cup Size) | Digital Tools Shed',
    metaDesc: 'Convert grams to cups by ingredient with USDA density factors. Supports flour, sugar, butter, oil, oats, and kosher salt across US Customary, Metric, and Imperial cups.',
    canonical: `${DOMAIN}/calc/grams-to-cups`,
    bodyContent: gramsToCupsBody,
    currentPath: '/calc/grams-to-cups',
    faq: [
      { q: 'How many cups is 100 grams of flour?', a: '100 grams of all-purpose flour (spooned and leveled) is equal to approximately 0.83 US cups (or roughly 3/4 cup + 1 tablespoon + 1 teaspoon).' },
      { q: 'Why is 1 cup of flour not equal to 1 cup of sugar?', a: 'Cups measure volume, while grams measure weight. Granulated sugar is crystalline and dense (200g per cup), while flour is aerated grain powder (120g per cup). Always convert by ingredient density.' },
      { q: 'What is the difference between a US cup and a Metric cup?', a: 'A US Customary cup holds 236.6 mL (8 fluid ounces), while a Metric cup (used in the UK, Australia, New Zealand, and Canada) holds 250.0 mL. Recipes from Australia or Britain require 5.7% more volume.' },
      { q: 'What is the difference between Diamond Crystal and Morton kosher salt?', a: 'Diamond Crystal kosher salt has hollow flaky crystals weighing 142g per cup (2.8g per tsp), whereas Morton kosher salt is dense rolled crystals weighing 241g per cup (4.8g per tsp). Substituting Morton 1:1 by volume for Diamond Crystal makes food 70% too salty.' }
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
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Cups to Grams Converter (By Ingredient & Standard)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert US cups and recipe fractions to precision scale grams (g), ounces (oz), and pounds (lb) using calibrated USDA culinary bulk densities.
        </p>
      </header>

      <!-- Key Callout -->
      <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 1rem; font-family: var(--serif);">
        <strong>Digital Scales Guarantee Bakery Consistency:</strong> Measuring by volume with cups introduces up to <strong>&plusmn;25% variance</strong> depending on humidity, packing technique, and scoop compaction. Converting cups to grams ensures every loaf, cookie, and pastry rises identically every single time.
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Input Card -->
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Ingredient & Cups</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Select Ingredient</label>
            <select id="ingredientSelectCups" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 0.95rem;" onchange="calcCupsToGrams()">
              <optgroup label="Flours & Starches">
                <option value="120|All-Purpose Flour (Spoon & Level)|0.507" selected>All-Purpose Flour (120g per cup)</option>
                <option value="140|All-Purpose Flour (Compacted / Dipped)|0.592">All-Purpose Flour (Dipped/Compacted: 140g)</option>
                <option value="110|All-Purpose Flour (Sifted)|0.465">All-Purpose Flour (Sifted: 110g)</option>
                <option value="130|Bread Flour|0.549">Bread Flour (130g per cup)</option>
                <option value="115|Cake & Pastry Flour|0.486">Cake Flour (115g per cup)</option>
                <option value="120|Whole Wheat Flour|0.507">Whole Wheat Flour (120g per cup)</option>
                <option value="96|Almond Flour (Blanched)|0.406">Almond Flour (96g per cup)</option>
                <option value="112|Coconut Flour|0.473">Coconut Flour (112g per cup)</option>
                <option value="128|Cornstarch|0.541">Cornstarch (128g per cup)</option>
                <option value="120|Tapioca Starch|0.507">Tapioca Starch (120g per cup)</option>
              </optgroup>
              <optgroup label="Sugars & Sweeteners">
                <option value="200|Granulated White Sugar|0.845">Granulated White Sugar (200g per cup)</option>
                <option value="220|Brown Sugar (Firmly Packed)|0.930">Brown Sugar (Packed: 220g per cup)</option>
                <option value="145|Brown Sugar (Loose / Unpacked)|0.613">Brown Sugar (Loose: 145g per cup)</option>
                <option value="120|Powdered Sugar (Unsifted)|0.507">Powdered Sugar (Unsifted: 120g per cup)</option>
                <option value="100|Powdered Sugar (Sifted)|0.423">Powdered Sugar (Sifted: 100g per cup)</option>
                <option value="340|Honey (Pure)|1.437">Honey (340g per cup)</option>
                <option value="322|Pure Maple Syrup|1.361">Maple Syrup (322g per cup)</option>
                <option value="328|Molasses|1.386">Molasses (328g per cup)</option>
              </optgroup>
              <optgroup label="Dairy, Fats & Liquids">
                <option value="227|Butter (Solid / 2 Sticks)|0.959">Butter (227g per cup = 2 sticks)</option>
                <option value="218|Vegetable Oil / Canola|0.921">Vegetable Oil (218g per cup)</option>
                <option value="216|Olive Oil|0.913">Olive Oil (216g per cup)</option>
                <option value="240|Water / Milk|1.014">Water / Whole Milk (240g per cup)</option>
                <option value="238|Heavy Cream|1.006">Heavy Cream (238g per cup)</option>
                <option value="245|Sour Cream / Greek Yogurt|1.036">Sour Cream / Greek Yogurt (245g per cup)</option>
                <option value="250|Peanut Butter|1.057">Peanut Butter (250g per cup)</option>
              </optgroup>
              <optgroup label="Grains & Mix-ins">
                <option value="90|Rolled Oats|0.380">Rolled Oats (90g per cup)</option>
                <option value="100|Dutch Cocoa Powder|0.423">Cocoa Powder (100g per cup)</option>
                <option value="170|Chocolate Chips|0.719">Chocolate Chips (170g per cup)</option>
                <option value="185|White Rice (Uncooked)|0.782">White Rice (185g per cup)</option>
                <option value="115|Chopped Walnuts|0.486">Chopped Walnuts (115g per cup)</option>
              </optgroup>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Measuring Cup Standard</label>
            <select id="cupStandardSelectReverse" class="search-input" style="width: 100%; padding: 0.65rem; font-size: 0.95rem;" onchange="calcCupsToGrams()">
              <option value="236.588|US Customary (236.6 mL)" selected>US Customary Cup (236.6 mL - American Recipes)</option>
              <option value="240.000|US Legal (240.0 mL)">US Legal Cup (240.0 mL - Nutrition Labels)</option>
              <option value="250.000|Metric Cup (250.0 mL)">Metric Cup (250.0 mL - UK, AU, NZ, CA)</option>
              <option value="284.131|Imperial Cup (284.1 mL)">Imperial Cup (284.1 mL - Traditional UK)</option>
            </select>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Number of Cups</label>
            <input type="number" id="cupsInput" value="1" min="0.05" step="0.125" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="calcCupsToGrams()" />
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
            <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Recipe Cup Fractions:</span>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.125)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/8 Cup (2 tbsp)</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/4 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.333)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/3 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.5)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/2 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.667)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">2/3 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(0.75)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">3/4 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(1)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1 Cup</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(1.5)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1 1/2 Cups</button>
            <button type="button" class="btn-sm" onclick="setCupFraction(2)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">2 Cups</button>
          </div>

          <button type="button" class="btn-primary" onclick="calcCupsToGrams()" style="width: 100%; padding: 0.75rem; font-size: 1rem; cursor: pointer;">Calculate Grams</button>
        </div>

        <!-- Output Card -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0;">Scale Weight Results</h3>
              <span id="scaleStatusBadge" style="font-family: var(--mono); font-size: 0.75rem; background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.5rem; border-radius: 4px; color: #10b981; font-weight: bold;">Digital Scale Target</span>
            </div>
            <div id="gramResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
          </div>

          <!-- Copy Button -->
          <div style="margin-top: 1.5rem; pt: 1rem; border-top: 1px solid var(--border);">
            <button id="copyCupsBtn" onclick="copyCupsToGramsSummary()" class="btn-sec" style="width: 100%; padding: 0.65rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span>📋 Copy Scale Recipe Line</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Mathematical Derivation -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.75rem;">📐 Volume to Mass Conversion Derivation</h3>
        <div id="cupsDerivFormula" style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; overflow-x: auto; border: 1px solid var(--border);">
          <!-- Populated by JavaScript -->
        </div>
      </div>

      <!-- Sponsored Ad Slot -->
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
      var currentCupsData = null;

      function calcCupsToGrams() {
        var cups = parseFloat(document.getElementById('cupsInput').value) || 0;
        var rawIng = document.getElementById('ingredientSelectCups').value.split('|');
        var baseCupWeight = parseFloat(rawIng[0]) || 120;
        var ingName = rawIng[1];
        var densityGmL = parseFloat(rawIng[2]) || (baseCupWeight / 236.588);

        var rawStd = document.getElementById('cupStandardSelectReverse').value.split('|');
        var cupVolumeMl = parseFloat(rawStd[0]) || 236.588;
        var stdName = rawStd[1];

        var adjustedCupWeight = baseCupWeight * (cupVolumeMl / 236.588);
        var grams = cups * adjustedCupWeight;
        var oz = grams / 28.34952;
        var lb = grams / 453.59237;
        var tbsp = cups * 16;
        var tsp = cups * 48;
        var totalMl = cups * cupVolumeMl;

        var container = document.getElementById('gramResults');
        container.innerHTML = 
          '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Scale Mass in Grams</span>' +
            '<div style="font-size: 2rem; font-weight: bold; color: #10b981; margin: 0.2rem 0;">' + grams.toFixed(1) + ' g</div>' +
            '<div style="font-size: 0.78rem; color: var(--text-muted);">Exact digital tare reading for baking accuracy</div>' +
          '</div>' +
          '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Ounces (Avoirdupois)</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + oz.toFixed(2) + ' oz</div>' +
              '<div style="font-size: 0.72rem; color: var(--text-muted);">' + (lb >= 0.1 ? lb.toFixed(3) + ' lbs' : grams.toFixed(0) + ' g') + '</div>' +
            '</div>' +
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Equivalent Spoons</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">' + tbsp.toFixed(1) + ' Tbsp</div>' +
              '<div style="font-size: 0.72rem; color: var(--text-muted);">' + tsp.toFixed(0) + ' Teaspoons (tsp)</div>' +
            '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Metric Volume Displaced</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + totalMl.toFixed(1) + ' mL (' + (totalMl / 29.5735).toFixed(2) + ' fl oz)</div>' +
          '</div>';

        var deriv = document.getElementById('cupsDerivFormula');
        deriv.innerHTML = 
          '<div><strong>1. Ingredient Bulk Density:</strong> &rho; = ' + densityGmL.toFixed(3) + ' g/mL (' + baseCupWeight + ' g per 236.6 mL US cup)</div>' +
          '<div><strong>2. Cup Volume:</strong> ' + stdName + ' = ' + cupVolumeMl.toFixed(1) + ' mL</div>' +
          '<div><strong>3. Single Cup Mass:</strong> 1 Cup = ' + adjustedCupWeight.toFixed(1) + ' grams</div>' +
          '<div><strong>4. Total Scale Weight:</strong> ' + cups + ' Cups &times; ' + adjustedCupWeight.toFixed(1) + ' g = <strong>' + grams.toFixed(1) + ' grams (' + oz.toFixed(2) + ' oz)</strong></div>';

        currentCupsData = {
          cups: cups,
          ingredient: ingName,
          grams: grams.toFixed(1),
          oz: oz.toFixed(2),
          tbsp: tbsp.toFixed(1),
          stdName: stdName
        };
      }

      window.setCupFraction = function(c) {
        document.getElementById('cupsInput').value = c;
        calcCupsToGrams();
      };

      window.copyCupsToGramsSummary = function() {
        if (!currentCupsData) return;
        var text = 
          '[Scale Recipe Weight] ' + currentCupsData.cups + ' Cups ' + currentCupsData.ingredient + '\\n' +
          '• Digital Scale Weight: ' + currentCupsData.grams + ' g (' + currentCupsData.oz + ' oz)\\n' +
          '• Equivalent Spoons: ' + currentCupsData.tbsp + ' Tablespoons\\n' +
          '• Cup Size Standard: ' + currentCupsData.stdName + '\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/cups-to-grams';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyCupsBtn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span style=\"color:#10b981; font-weight:bold;\">✓ Copied Scale Line!</span>';
          setTimeout(function() { btn.innerHTML = orig; }, 2200);
        });
      };

      document.addEventListener('DOMContentLoaded', calcCupsToGrams);
      calcCupsToGrams();
    </script>
  `;

  writeFileSync(join(calcDir, 'cups-to-grams.html'), renderPage({
    title: 'Cups to Grams Converter (By Ingredient & Cup Size) | Digital Tools Shed',
    metaDesc: 'Convert cups to grams by ingredient. 1 cup flour = 120g, 1 cup sugar = 200g, 1/2 cup butter = 113.4g. Free digital kitchen scale tare weight calculator.',
    canonical: `${DOMAIN}/calc/cups-to-grams`,
    bodyContent: cupsToGramsBody,
    currentPath: '/calc/cups-to-grams',
    faq: [
      { q: 'How many grams is 1 cup of all-purpose flour?', a: '1 level cup of spooned and leveled all-purpose flour equals 120 grams (4.23 ounces). If dipped and swept from the bag, it can weigh up to 140-150 grams.' },
      { q: 'How many grams is 1/2 cup of granulated sugar?', a: '1/2 cup of granulated white sugar equals exactly 100 grams (3.53 ounces).' },
      { q: 'How many grams is 1 cup of butter?', a: '1 cup of butter (which equals 2 American sticks or 16 tablespoons) equals 227 grams (8 ounces).' },
      { q: 'How many grams is 3/4 cup of brown sugar?', a: '3/4 cup of firmly packed brown sugar weighs 165 grams (5.82 ounces).' }
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
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Butter Converter (Sticks, Tablespoons, Cups, Grams & Ounces)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Convert butter measurements across sticks, tablespoons, cups, ounces, and grams with synchronous bidirectional inputs, European vs. American butterfat calibration, and culinary moisture yield.
        </p>
      </header>

      <!-- Golden Rule Banner -->
      <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.5rem; font-size: 1.05rem; font-family: var(--serif);">
        <strong>The Universal American Butter Standard:</strong> 1 Stick = <strong>8 Tablespoons</strong> = <strong>1/2 US Cup</strong> = <strong>4 Ounces (1/4 Pound)</strong> = <strong>113.398 Grams</strong> = <strong>24 Teaspoons</strong>.
      </div>

      <!-- Synchronous Converter Card -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0;">Multi-Unit Live Converter</h3>
          <span style="font-family: var(--mono); font-size: 0.75rem; color: #10b981; font-weight: bold;">Synchronous Bidirectional</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Sticks (US)</label>
            <input type="number" id="butterSticks" value="1" min="0" step="0.125" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="updateFromSticks()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Tablespoons (tbsp)</label>
            <input type="number" id="butterTbsp" value="8" min="0" step="0.5" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="updateFromTbsp()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">US Cups</label>
            <input type="number" id="butterCups" value="0.5" min="0" step="0.0625" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="updateFromCups()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Scale Grams (g)</label>
            <input type="number" id="butterGrams" value="113.4" min="0" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="updateFromGrams()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Ounces (oz)</label>
            <input type="number" id="butterOz" value="4.0" min="0" step="0.25" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="updateFromOz()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Teaspoons (tsp)</label>
            <input type="number" id="butterTsp" value="24" min="0" step="1" class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-size: 1.2rem; font-family: var(--mono);" oninput="updateFromTsp()" />
          </div>
        </div>

        <!-- Quick Presets -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
          <span style="font-size: 0.75rem; color: var(--text-muted); width: 100%;">Common Recipe Amounts:</span>
          <button type="button" class="btn-sm" onclick="setSticks(0.125)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1 tbsp (14.2g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(0.25)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/4 Stick (2 tbsp / 28g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(0.5)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">1/2 Stick (4 tbsp / 1/4 cup / 57g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(1)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; border-color: #3b82f6; color: #3b82f6; font-weight: bold;">1 Stick (1/2 cup / 113.4g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(2)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">2 Sticks (1 cup / 227g)</button>
          <button type="button" class="btn-sm" onclick="setSticks(4)" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">4 Sticks (1 lb / 454g)</button>
        </div>

        <!-- Butterfat & Moisture Breakdown -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin-top: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-family: var(--serif); font-size: 1.1rem; font-weight: bold; color: var(--fg);">🧈 Butter Variety & Moisture Breakdown</div>
            <div>
              <select id="butterTypeSelect" class="text-input" style="padding: 0.35rem 0.6rem; font-size: 0.85rem;" onchange="updateButterFat()">
                <option value="0.80|0.165|717|US Commercial (80% Milkfat, 16.5% Water)" selected>US Commercial (80% Milkfat, 16.5% Water)</option>
                <option value="0.82|0.150|735|European / Cultured (82% Milkfat, 15% Water - e.g. Kerrygold, Plugra)">European / Cultured (82% Milkfat, 15% Water - Kerrygold/Plugrá)</option>
                <option value="0.84|0.140|750|French AOP / High-Fat Beurre (84% Milkfat, 14% Water)">French AOP / High-Fat (84% Milkfat, 14% Water)</option>
                <option value="0.995|0.005|884|Clarified Butter / Traditional Ghee (99.5% Milkfat, 0% Water)">Clarified Butter / Ghee (99.5% Milkfat, 0% Water)</option>
                <option value="0.55|0.400|500|Whipped Butter (Aerated with Nitrogen, 30% Less Dense)">Whipped Butter (Aerated - DO NOT use 1:1 in baking)</option>
                <option value="0.80|0.180|717|Plant-Based Vegan Butter (Oil & Water Emulsion)">Plant-Based Vegan Butter (80% Fat Emulsion)</option>
              </select>
            </div>
          </div>

          <div id="butterYieldMetrics" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <!-- Populated by JavaScript -->
          </div>
        </div>

        <!-- Copy Summary Report Button -->
        <div style="margin-top: 1.25rem;">
          <button id="copyButterBtn" onclick="copyButterSummary()" class="btn-sec" style="width: 100%; padding: 0.65rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <span>📋 Copy Butter Conversion Report</span>
          </button>
        </div>
      </div>

      <!-- Real-World Butter Traps -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
          <span>⚠️ 3 Butter Traps That Ruin Pastries & Doughs</span>
        </h3>
        <div style="display: grid; gap: 1rem; font-size: 0.9rem; line-height: 1.6;">
          <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">1. The European vs. American Water Content Trap (Lamination Failure)</strong>
            <p style="margin: 0; color: var(--text-muted);">
              American commercial butter contains <strong>16% to 18% water</strong>, while European butter (such as Kerrygold or Plugr&aacute;) contains only <strong>14% to 16% water</strong> (and 82% to 84% butterfat). In laminated doughs (croissants, puff pastry, flaky pie crusts), water turns to steam during baking. Excess water accelerates gluten development, turning flaky layers tough and chewy. If substituting American butter in a French pastry recipe, reduce added water by 1 tablespoon per 2 sticks.
            </p>
          </div>
          <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">2. The Salted vs. Unsalted Butter Sodium Hazard</strong>
            <p style="margin: 0; color: var(--text-muted);">
              Salted butter contains roughly <strong>1.5% to 2.0% salt by weight</strong>. That translates to roughly <strong>1.8g to 2.2g of salt per stick</strong> (approximately 1/3 to 1/2 teaspoon of salt per stick). In delicate sweet frostings, brioche, or shortbread, salted butter overpowers subtle dairy notes and can inhibit yeast activity. Always bake with unsalted butter so you control salinity independently.
            </p>
          </div>
          <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">3. Cold Solid vs. Melted Liquid Volume Gotcha</strong>
            <p style="margin: 0; color: var(--text-muted);">
              Chilled stick butter has microscopic trapped air and a crystalline fat matrix. Melting butter completely causes density changes; 1/2 cup of melted butter does not equal the creaming volume of 1/2 cup softened butter whipped with sugar! Never melt butter unless the recipe explicitly specifies "melted and cooled".
            </p>
          </div>
        </div>
      </div>

      <!-- Sponsored Ad Slot -->
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

      <!-- Master Conversion Table -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">Complete Butter Conversion Matrix</h3>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                <th style="padding: 0.5rem 0.75rem;">Sticks</th>
                <th style="padding: 0.5rem 0.75rem;">Tablespoons</th>
                <th style="padding: 0.5rem 0.75rem;">Teaspoons</th>
                <th style="padding: 0.5rem 0.75rem;">US Cups</th>
                <th style="padding: 0.5rem 0.75rem;">Ounces</th>
                <th style="padding: 0.5rem 0.75rem;">Grams (Scale)</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1/8 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">3 tsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1/16 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">0.5 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">14.2 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1/4 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">2 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">6 tsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1/8 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1.0 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">28.4 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1/2 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">4 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">12 tsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">1/4 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">2.0 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">56.7 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">1 Stick</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">8 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">24 tsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">1/2 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">4.0 oz</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #10b981; font-weight: bold;">113.4 g</td></tr>
              <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.45rem 0.75rem; font-weight: bold;">2 Sticks</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">16 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">48 tsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">1 cup</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">8.0 oz (1/2 lb)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono); color: #3b82f6; font-weight: bold;">226.8 g</td></tr>
              <tr><td style="padding: 0.45rem 0.75rem; font-weight: bold;">4 Sticks (1 lb)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">32 tbsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">96 tsp</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">2 cups</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">16.0 oz (1.0 lb)</td><td style="padding: 0.45rem 0.75rem; font-family: var(--mono);">453.6 g</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      var currentButterState = { sticks: 1, tbsp: 8, cups: 0.5, grams: 113.4, oz: 4.0, tsp: 24 };

      function setSticks(val) {
        document.getElementById('butterSticks').value = val;
        updateFromSticks();
      }

      function updateFromSticks() {
        var s = parseFloat(document.getElementById('butterSticks').value) || 0;
        var tbsp = s * 8;
        var cups = s * 0.5;
        var grams = s * 113.398;
        var oz = s * 4;
        var tsp = s * 24;

        setFields(s, tbsp, cups, grams, oz, tsp);
      }

      function updateFromTbsp() {
        var t = parseFloat(document.getElementById('butterTbsp').value) || 0;
        var s = t / 8;
        var cups = t / 16;
        var grams = t * 14.1748;
        var oz = t * 0.5;
        var tsp = t * 3;

        setFields(s, tbsp, cups, grams, oz, tsp);
      }

      function updateFromCups() {
        var c = parseFloat(document.getElementById('butterCups').value) || 0;
        var s = c * 2;
        var tbsp = c * 16;
        var grams = c * 226.796;
        var oz = c * 8;
        var tsp = c * 48;

        setFields(s, tbsp, cups, grams, oz, tsp);
      }

      function updateFromGrams() {
        var g = parseFloat(document.getElementById('butterGrams').value) || 0;
        var s = g / 113.398;
        var tbsp = g / 14.1748;
        var cups = g / 226.796;
        var oz = g / 28.3495;
        var tsp = tbsp * 3;

        setFields(s, tbsp, cups, grams, oz, tsp);
      }

      function updateFromOz() {
        var o = parseFloat(document.getElementById('butterOz').value) || 0;
        var s = o / 4;
        var tbsp = o * 2;
        var cups = o / 8;
        var grams = o * 28.3495;
        var tsp = tbsp * 3;

        setFields(s, tbsp, cups, grams, oz, tsp);
      }

      function updateFromTsp() {
        var t = parseFloat(document.getElementById('butterTsp').value) || 0;
        var tbsp = t / 3;
        var s = tbsp / 8;
        var cups = tbsp / 16;
        var grams = tbsp * 14.1748;
        var oz = tbsp * 0.5;

        setFields(s, tbsp, cups, grams, oz, tsp);
      }

      function setFields(s, tbsp, cups, grams, oz, tsp) {
        document.getElementById('butterSticks').value = parseFloat(s.toFixed(3));
        document.getElementById('butterTbsp').value = parseFloat(tbsp.toFixed(2));
        document.getElementById('butterCups').value = parseFloat(cups.toFixed(3));
        document.getElementById('butterGrams').value = parseFloat(grams.toFixed(1));
        document.getElementById('butterOz').value = parseFloat(oz.toFixed(2));
        document.getElementById('butterTsp').value = parseFloat(tsp.toFixed(1));

        currentButterState = {
          sticks: s,
          tbsp: tbsp,
          cups: cups,
          grams: grams,
          oz: oz,
          tsp: tsp
        };

        updateButterFat();
      }

      function updateButterFat() {
        var raw = document.getElementById('butterTypeSelect').value.split('|');
        var fatRatio = parseFloat(raw[0]) || 0.80;
        var waterRatio = parseFloat(raw[1]) || 0.165;
        var kcalPer100g = parseFloat(raw[2]) || 717;
        var butterName = raw[3];

        var totalG = currentButterState.grams;
        var pureFatG = totalG * fatRatio;
        var waterG = totalG * waterRatio;
        var totalKcal = (totalG / 100) * kcalPer100g;

        var box = document.getElementById('butterYieldMetrics');
        box.innerHTML = 
          '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Pure Milkfat Yield</span>' +
            '<div style="font-size: 1.15rem; font-weight: bold; color: #10b981;">' + pureFatG.toFixed(1) + ' g</div>' +
            '<div style="font-size: 0.72rem; color: var(--text-muted);">' + (pureFatG / 28.3495).toFixed(2) + ' oz pure fat (' + (fatRatio * 100).toFixed(0) + '%)</div>' +
          '</div>' +
          '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Moisture Added to Dough</span>' +
            '<div style="font-size: 1.15rem; font-weight: bold; color: #3b82f6;">' + waterG.toFixed(1) + ' mL</div>' +
            '<div style="font-size: 0.72rem; color: var(--text-muted);">' + (waterG / 14.787).toFixed(1) + ' Tbsp water (' + (waterRatio * 100).toFixed(1) + '%)</div>' +
          '</div>' +
          '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Culinary Energy</span>' +
            '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + Math.round(totalKcal) + ' kcal</div>' +
            '<div style="font-size: 0.72rem; color: var(--text-muted);">' + butterName.split(' ')[0] + ' Profile</div>' +
          '</div>';
      }

      window.copyButterSummary = function() {
        var raw = document.getElementById('butterTypeSelect').value.split('|');
        var butterName = raw[3];
        var text = 
          '[Butter Measurement Report] ' + currentButterState.sticks.toFixed(2) + ' Sticks of Butter (' + butterName + ')\\n' +
          '• Tablespoons: ' + currentButterState.tbsp.toFixed(1) + ' Tbsp (' + currentButterState.tsp.toFixed(0) + ' tsp)\\n' +
          '• Cups: ' + currentButterState.cups.toFixed(3) + ' US Cups\\n' +
          '• Digital Scale Weight: ' + currentButterState.grams.toFixed(1) + ' grams (' + currentButterState.oz.toFixed(2) + ' oz)\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/butter-converter';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyButterBtn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span style=\"color:#10b981; font-weight:bold;\">✓ Copied Butter Conversion!</span>';
          setTimeout(function() { btn.innerHTML = orig; }, 2200);
        });
      };

      document.addEventListener('DOMContentLoaded', updateFromSticks);
      updateFromSticks();
    </script>
  `;

  writeFileSync(join(calcDir, 'butter-converter.html'), renderPage({
    title: 'Butter Converter: Sticks, Tablespoons, Cups, Ounces & Grams | Digital Tools Shed',
    metaDesc: 'Convert butter between sticks, tablespoons, cups, ounces, and grams instantly. Includes European vs. American butterfat moisture calculation and printable baking matrix.',
    canonical: `${DOMAIN}/calc/butter-converter`,
    bodyContent: butterBody,
    currentPath: '/calc/butter-converter',
    faq: [
      { q: 'How many tablespoons are in 1 stick of butter?', a: '1 US stick of butter equals exactly 8 tablespoons (which is also 1/2 cup, 4 ounces, or 113.4 grams).' },
      { q: 'How many grams is 1 stick of butter?', a: '1 American stick of butter weighs exactly 113.398 grams (rounded to 113.4g on digital kitchen scales).' },
      { q: 'How many sticks of butter make 1 cup?', a: '2 sticks of butter make 1 full cup (16 tablespoons or 226.8 grams).' },
      { q: 'Why do European recipes require less butter than American recipes?', a: 'European butter has higher butterfat (82%–84%) and less water (14%–16%) than American butter (80% fat, 16%–18% water). When making flaky croissants or pie dough, European butter yields crisper layers because less steam toughens the gluten.' },
      { q: 'How much salt is in salted butter?', a: 'Commercial salted butter contains roughly 1.5% to 2.0% salt by weight, which is equal to approximately 1/3 to 1/2 teaspoon of salt per stick (1.8g to 2.2g).' }
    ]
  }));

  console.log('  ✓ Built Kitchen Suite (grams-to-cups, cups-to-grams, butter-converter in /calc/)');
}
