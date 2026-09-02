import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildTradeTools() {
  const calcDir = join(DIST, 'calc');
  ensureDir(calcDir);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. STAIR STRINGER & IRC CODE CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const stairBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Stair Stringer Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Stair Stringer & Rise/Run Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate step riser heights, tread depths, stringer cut lengths, and verify International Residential Code (IRC) building compliance.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Stair Dimensions</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Total Rise / Height (Inches)</label>
            <input type="number" id="totalRise" value="108" step="0.125" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">From lower finished floor to upper finished floor (e.g. 9 ft = 108 in)</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Desired Tread Depth (Inches)</label>
            <input type="number" id="desiredTread" value="10.5" step="0.25" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">IRC minimum is 10 inches (standard is 10.5 to 11 in)</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Target Riser Height (Inches)</label>
            <input type="number" id="targetRiser" value="7.5" step="0.25" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-size: 1.1rem; font-family: var(--mono);" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">IRC maximum is 7.75 inches (standard is 7 to 7.5 in)</span>
          </div>

          <button class="btn-primary" onclick="calcStairs()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Calculate Stringer Layout</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Stringer Cut Results</h3>
          <div id="stairResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">IRC Building Code Quick Reference</h3>
        <ul style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; padding-left: 1.25rem;">
          <li><strong>Maximum Riser Height:</strong> 7 ¾ inches (197 mm).</li>
          <li><strong>Minimum Tread Depth:</strong> 10 inches (254 mm) with nosing, or 11 inches without nosing.</li>
          <li><strong>Comfort Rule of Thumb:</strong> 2 × (Riser) + Tread should equal between 24 and 25 inches.</li>
          <li><strong>Variation Limit:</strong> The difference between the tallest and shortest riser in a flight cannot exceed ⅜ inch.</li>
        </ul>
      </div>
    </div>

    <script>
      function calcStairs() {
        var rise = parseFloat(document.getElementById('totalRise').value) || 0;
        var targetR = parseFloat(document.getElementById('targetRiser').value) || 7.5;
        var tread = parseFloat(document.getElementById('desiredTread').value) || 10.5;

        var numSteps = Math.round(rise / targetR);
        var actualRiser = rise / numSteps;
        var numTreads = numSteps - 1;
        var totalRun = numTreads * tread;
        var stringerLenInches = Math.sqrt(rise * rise + totalRun * totalRun);
        var stringerFeet = Math.ceil(stringerLenInches / 12);
        var inclineAngle = (Math.atan(rise / totalRun) * (180 / Math.PI)).toFixed(1);
        var ruleOfThumb = (2 * actualRiser + tread).toFixed(2);

        var isRiserCode = actualRiser <= 7.75;
        var isTreadCode = tread >= 10.0;
        var isComfortGood = ruleOfThumb >= 24 && ruleOfThumb <= 25.5;

        document.getElementById('stairResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">NUMBER OF RISERS / STEPS</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: var(--fg);">' + numSteps + ' Steps</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">EXACT RISER HEIGHT</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: ' + (isRiserCode ? '#22c55e' : '#ef4444') + ';">' +
              actualRiser.toFixed(3) + '" (' + toFraction(actualRiser) + ') ' + (isRiserCode ? '✅ Code Compliant' : '⚠️ Exceeds 7.75"') +
            '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">NUMBER OF TREADS & RUN</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + numTreads + ' Treads | Total Run: ' + (totalRun / 12).toFixed(2) + ' ft (' + totalRun.toFixed(1) + '")</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">MINIMUM STRINGER BOARD LENGTH</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">' + stringerFeet + ' Foot 2x12 Board (' + stringerLenInches.toFixed(1) + '" diagonal)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">STAIRWAY INCLINE ANGLE</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + inclineAngle + '° (Comfort zone: 30° - 37°)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">COMFORT RULE (2R + T)</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: ' + (isComfortGood ? '#22c55e' : '#f59e0b') + ';">' +
              ruleOfThumb + '" ' + (isComfortGood ? '✅ Ideal Proportions' : 'ℹ️ Standard is 24" to 25.5"') +
            '</div>' +
          '</div>';
      }

      function toFraction(val) {
        var whole = Math.floor(val);
        var frac = val - whole;
        var sixteenths = Math.round(frac * 16);
        if (sixteenths === 0) return whole + '"';
        if (sixteenths === 16) return (whole + 1) + '"';
        var num = sixteenths;
        var den = 16;
        while (num % 2 === 0 && den % 2 === 0) { num /= 2; den /= 2; }
        return whole > 0 ? (whole + ' ' + num + '/' + den + '"') : (num + '/' + den + '"');
      }

      calcStairs();
    </script>
  `;

  writeFileSync(join(calcDir, 'stair-calculator.html'), renderPage({
    title: 'Stair Stringer Calculator & IRC Code Checker | Digital Tools Shed',
    metaDesc: 'Free stair stringer calculator: calculate rise, run, number of steps, stringer board length, and verify IRC building code compliance.',
    canonical: `${DOMAIN}/calc/stair-calculator`,
    bodyContent: stairBody,
    currentPath: '/calc/stair-calculator',
    faq: [
      { q: 'What is the maximum stair riser height according to IRC code?', a: 'Under Section R311.7.5.1 of the International Residential Code (IRC), the maximum riser height for residential stairs is 7 3/4 inches (197 mm).' },
      { q: 'What is the minimum stair tread depth required by building code?', a: 'The IRC requires a minimum tread depth of 10 inches (254 mm) with nosing, or 11 inches without nosing.' },
      { q: 'What is the standard stair comfort rule of thumb?', a: 'The standard architectural formula for comfortable stairs is 2 × Riser + Tread = 24 to 25.5 inches.' },
      { q: 'How long of a 2x12 board do I need for a stair stringer?', a: 'Stringer length is calculated using the Pythagorean theorem: Stringer Length = √(Total Rise² + Total Run²). Always round up to the next available standard lumber length.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. CONCRETE SLAB & BAG CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const concreteBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Concrete Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Concrete Slab & Bag Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate exact cubic yards of concrete needed for slabs, footings, and cylindrical post holes, plus how many 80 lb and 60 lb pre-mix bags to buy.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Project Shape & Dimensions</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Structure Type</label>
            <select id="concreteType" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" onchange="toggleConcreteInputs()">
              <option value="slab">Rectangular Slab / Patio / Footing</option>
              <option value="post">Cylindrical Post Holes / Sonotubes</option>
            </select>
          </div>

          <div id="slabInputs">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Length (Feet)</label>
                <input type="number" id="slabLength" value="12" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Width (Feet)</label>
                <input type="number" id="slabWidth" value="10" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Thickness / Depth (Inches)</label>
              <input type="number" id="slabDepth" value="4" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              <span style="font-size: 0.75rem; color: var(--text-muted);">Standard patio is 4"; heavy driveway or machinery pad is 6"</span>
            </div>
          </div>

          <div id="postInputs" style="display: none;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Hole Diameter (Inches)</label>
                <input type="number" id="postDiameter" value="10" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Hole Depth (Inches)</label>
                <input type="number" id="postDepth" value="36" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              </div>
            </div>

            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Number of Holes</label>
              <input type="number" id="postCount" value="4" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Waste / Spillage Margin (%)</label>
            <input type="number" id="concreteWaste" value="10" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">Recommended: 10% for slabs, 15% for rough ground footings</span>
          </div>

          <button class="btn-primary" onclick="calcConcrete()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Calculate Concrete Volume</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Materials Needed</h3>
          <div id="concreteResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function toggleConcreteInputs() {
        var isPost = document.getElementById('concreteType').value === 'post';
        document.getElementById('slabInputs').style.display = isPost ? 'none' : 'block';
        document.getElementById('postInputs').style.display = isPost ? 'block' : 'none';
        calcConcrete();
      }

      function calcConcrete() {
        var isPost = document.getElementById('concreteType').value === 'post';
        var wastePct = (parseFloat(document.getElementById('concreteWaste').value) || 0) / 100;
        var cuFt = 0;

        if (isPost) {
          var diamInches = parseFloat(document.getElementById('postDiameter').value) || 0;
          var depthInches = parseFloat(document.getElementById('postDepth').value) || 0;
          var count = parseFloat(document.getElementById('postCount').value) || 1;
          var radiusFt = (diamInches / 2) / 12;
          var depthFt = depthInches / 12;
          var singleHoleVol = Math.PI * radiusFt * radiusFt * depthFt;
          cuFt = singleHoleVol * count;
        } else {
          var l = parseFloat(document.getElementById('slabLength').value) || 0;
          var w = parseFloat(document.getElementById('slabWidth').value) || 0;
          var dInches = parseFloat(document.getElementById('slabDepth').value) || 0;
          cuFt = l * w * (dInches / 12);
        }

        var cuFtWithWaste = cuFt * (1 + wastePct);
        var cuYards = cuFtWithWaste / 27;

        var bags80 = Math.ceil(cuFtWithWaste / 0.60);
        var bags60 = Math.ceil(cuFtWithWaste / 0.45);

        document.getElementById('concreteResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL VOLUME (CUBIC YARDS)</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #22c55e;">' + cuYards.toFixed(2) + ' Cubic Yards</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted);">(' + cuFtWithWaste.toFixed(1) + ' cu ft incl. ' + (wastePct * 100).toFixed(0) + '% buffer)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">80 LB PRE-MIX BAGS (0.60 cu ft/bag)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + bags80 + ' Bags</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">60 LB PRE-MIX BAGS (0.45 cu ft/bag)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + bags60 + ' Bags</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">DELIVERY TRUCK VS BAG RECOMMENDATION</span>' +
            '<div style="font-size: 0.85rem; color: var(--fg); line-height: 1.4;">' +
              (cuYards >= 1.0 ? '🚚 <strong>Ready-Mix Truck Recommended:</strong> Over 1 cubic yard (' + bags80 + ' bags) is usually cheaper and faster to order via cement truck.' : '✅ <strong>Pre-mix Bags Feasible:</strong> Under 1 cubic yard is easy to mix in a wheelbarrow or small mixer.') +
            '</div>' +
          '</div>';
      }

      calcConcrete();
    </script>
  `;

  writeFileSync(join(calcDir, 'concrete-calculator.html'), renderPage({
    title: 'Concrete Slab & Bag Calculator (Cubic Yards & 80lb Bags) | Digital Tools Shed',
    metaDesc: 'Calculate concrete cubic yards and pre-mix 80lb/60lb bags for slabs, patios, and post holes with automatic spillage buffer.',
    canonical: `${DOMAIN}/calc/concrete-calculator`,
    bodyContent: concreteBody,
    currentPath: '/calc/concrete-calculator',
    faq: [
      { q: 'How many 80 lb bags of concrete are in a cubic yard?', a: 'There are 45 bags of 80 lb concrete in one cubic yard (27 cubic feet). For 60 lb bags, 60 bags are required.' },
      { q: 'How do you calculate cubic yards of concrete for a slab?', a: 'Multiply Length (ft) × Width (ft) × Thickness (ft) and divide by 27. Add 10% for waste.' },
      { q: 'How deep should a concrete patio slab be?', a: 'A standard residential patio or sidewalk should be 4 inches thick. Driveways supporting vehicles should be 5 to 6 inches thick.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. DRYWALL & SCREW ESTIMATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const drywallBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Drywall Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Drywall Sheet, Mud & Screw Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Estimate how many 4x8 or 4x12 drywall sheets, joint compound mud buckets, drywall screws, and tape rolls you need for any room.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Room Dimensions</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Room Length (Feet)</label>
              <input type="number" id="roomLength" value="14" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Room Width (Feet)</label>
              <input type="number" id="roomWidth" value="12" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Ceiling Height (Feet)</label>
            <input type="number" id="ceilingHeight" value="8" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Doors (Subtracted)</label>
              <input type="number" id="doorCount" value="2" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Windows (Subtracted)</label>
              <input type="number" id="windowCount" value="2" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="includeCeiling" checked /> Include Ceiling Drywall
            </label>
          </div>

          <button class="btn-primary" onclick="calcDrywall()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Estimate Drywall Materials</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Material Estimates</h3>
          <div id="drywallResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function calcDrywall() {
        var l = parseFloat(document.getElementById('roomLength').value) || 0;
        var w = parseFloat(document.getElementById('roomWidth').value) || 0;
        var h = parseFloat(document.getElementById('ceilingHeight').value) || 8;
        var doors = parseFloat(document.getElementById('doorCount').value) || 0;
        var windows = parseFloat(document.getElementById('windowCount').value) || 0;
        var inclCeiling = document.getElementById('includeCeiling').checked;

        var perimeter = 2 * (l + w);
        var wallSqFt = perimeter * h;
        var deductions = (doors * 21) + (windows * 15);
        var netWallSqFt = Math.max(0, wallSqFt - deductions);
        var ceilingSqFt = inclCeiling ? (l * w) : 0;
        var totalSqFt = (netWallSqFt + ceilingSqFt) * 1.10;

        var sheets4x8 = Math.ceil(totalSqFt / 32);
        var sheets4x12 = Math.ceil(totalSqFt / 48);

        var mudGallons = totalSqFt * 0.053;
        var screwsCount = sheets4x8 * 32;
        var screwsLbs = Math.ceil(screwsCount / 300);
        var tapeRolls = Math.ceil((totalSqFt * 0.37) / 250);

        document.getElementById('drywallResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL SURFACE AREA (INCL. 10% WASTE)</span>' +
            '<div style="font-size: 1.3rem; font-weight: bold; color: var(--fg);">' + Math.round(totalSqFt) + ' sq ft</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">4x8 FT DRYWALL SHEETS (32 sq ft/sheet)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">' + sheets4x8 + ' Sheets</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">4x12 FT DRYWALL SHEETS (48 sq ft/sheet)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + sheets4x12 + ' Sheets (Fewer seams)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">JOINT COMPOUND (MUD) & TAPE</span>' +
            '<div style="font-size: 1.05rem; font-weight: bold; color: var(--fg);">' +
              Math.ceil(mudGallons / 4.5) + ' Buckets (4.5 Gal) | ' + tapeRolls + ' Rolls of Tape (250\')' +
            '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">DRYWALL SCREWS (1-1/4\" COARSE)</span>' +
            '<div style="font-size: 1.05rem; font-weight: bold; color: var(--fg);">' + screwsLbs + ' lbs of 1-¼\" Type W/S Screws</div>' +
          '</div>';
      }

      calcDrywall();
    </script>
  `;

  writeFileSync(join(calcDir, 'drywall-calculator.html'), renderPage({
    title: 'Drywall Calculator: Sheets, Mud, Tape & Screws | Digital Tools Shed',
    metaDesc: 'Calculate 4x8 and 4x12 drywall sheets, joint compound buckets, screws, and tape rolls for any room size.',
    canonical: `${DOMAIN}/calc/drywall-calculator`,
    bodyContent: drywallBody,
    currentPath: '/calc/drywall-calculator',
    faq: [
      { q: 'How many drywall sheets do I need for a 12x12 room?', a: 'A 12x12 room with 8 ft ceilings requires approximately 16 to 18 sheets of 4x8 drywall including ceiling and standard door/window deductions.' },
      { q: 'How much joint compound (mud) is needed per drywall sheet?', a: 'Plan for approximately 0.053 gallons of mud per sheet (about 1 standard 4.5-gallon bucket for every 85 sheets across 3 coats).' },
      { q: 'How many screws are needed per drywall sheet?', a: 'Standard fastening requires ~32 screws per 4x8 sheet on wall studs (16" spacing) and ~36 screws on ceilings.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. MULCH & TOPSOIL YARDAGE CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const mulchBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Mulch & Topsoil Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Mulch, Topsoil & Compost Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate how many cubic yards and store bags of mulch, topsoil, or compost you need for landscaping and garden beds.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Garden Bed Dimensions</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Bed Length (Feet)</label>
              <input type="number" id="mulchLength" value="25" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Bed Width (Feet)</label>
              <input type="number" id="mulchWidth" value="4" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Layer Depth (Inches)</label>
            <input type="number" id="mulchDepth" value="3" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">Standard recommended mulch depth is 2 to 3 inches</span>
          </div>

          <button class="btn-primary" onclick="calcMulch()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Calculate Yardage</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Estimated Quantities</h3>
          <div id="mulchResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function calcMulch() {
        var l = parseFloat(document.getElementById('mulchLength').value) || 0;
        var w = parseFloat(document.getElementById('mulchWidth').value) || 0;
        var dInches = parseFloat(document.getElementById('mulchDepth').value) || 0;

        var areaSqFt = l * w;
        var cuFt = areaSqFt * (dInches / 12);
        var cuYards = cuFt / 27;

        var bags2CuFt = Math.ceil(cuFt / 2.0);
        var bags3CuFt = Math.ceil(cuFt / 3.0);

        document.getElementById('mulchResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL VOLUME (CUBIC YARDS)</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #22c55e;">' + cuYards.toFixed(2) + ' Cubic Yards</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted);">(' + cuFt.toFixed(1) + ' Total Cubic Feet)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">2.0 CU FT BAGS (STANDARD STORE BAG)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + bags2CuFt + ' Bags</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">3.0 CU FT BAGS (LARGE COMPRESSED)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + bags3CuFt + ' Bags</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">BULK VS BAG RECOMMENDATION</span>' +
            '<div style="font-size: 0.85rem; color: var(--fg); line-height: 1.4;">' +
              (cuYards >= 3.0 ? '🚛 <strong>Bulk Delivery Recommended:</strong> 3+ cubic yards (' + bags2CuFt + ' bags) is significantly cheaper delivered by the truckload from a local landscape yard.' : '✅ <strong>Bag Purchase Feasible:</strong> Under 3 cubic yards fits easily in a pickup truck or SUV over a couple of trips.') +
            '</div>' +
          '</div>';
      }

      calcMulch();
    </script>
  `;

  writeFileSync(join(calcDir, 'mulch-calculator.html'), renderPage({
    title: 'Mulch & Topsoil Yardage Calculator (Cubic Yards & Bags) | Digital Tools Shed',
    metaDesc: 'Calculate cubic yards and 2 cu ft bag counts for mulch, topsoil, gravel, and garden bed landscaping.',
    canonical: `${DOMAIN}/calc/mulch-calculator`,
    bodyContent: mulchBody,
    currentPath: '/calc/mulch-calculator',
    faq: [
      { q: 'How many 2 cubic foot bags of mulch are in a cubic yard?', a: 'One cubic yard equals 27 cubic feet. Therefore, exactly 13.5 bags of 2 cu ft mulch make one yard (round up to 14 bags).' },
      { q: 'How deep should mulch be applied in garden beds?', a: 'A depth of 2 to 3 inches is optimal to retain soil moisture and suppress weeds without suffocating plant roots.' },
      { q: 'How many square feet does 1 cubic yard of mulch cover?', a: 'At 3 inches deep, 1 cubic yard covers 108 square feet. At 2 inches deep, it covers 162 square feet.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. WALL FRAMING STUD CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const studBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Wall Stud Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Wall Framing Stud & Plate Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate total 2x4 / 2x6 common studs, top and bottom plates, corner backing, and header material with standard 16" or 24" on-center spacing.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Wall Specifications</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Total Wall Length (Feet)</label>
            <input type="number" id="wallLen" value="20" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcStuds()" />
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Stud Spacing On-Center (O.C.)</label>
            <select id="studSpacing" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" onchange="calcStuds()">
              <option value="16" selected>16 Inches On-Center (Standard)</option>
              <option value="24">24 Inches On-Center (Non-Load Bearing)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">90° Corners</label>
              <input type="number" id="cornerCount" value="2" min="0" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcStuds()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Wall Intersections / Tees</label>
              <input type="number" id="teeCount" value="1" min="0" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcStuds()" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Doors</label>
              <input type="number" id="studDoors" value="1" min="0" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcStuds()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Windows</label>
              <input type="number" id="studWindows" value="1" min="0" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcStuds()" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Waste Factor Margin (%)</label>
            <input type="number" id="studWaste" value="10" step="5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcStuds()" />
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Lumber Shopping List</h3>
          <div id="studResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function calcStuds() {
        var len = parseFloat(document.getElementById('wallLen').value) || 0;
        var spacing = parseFloat(document.getElementById('studSpacing').value) || 16;
        var corners = parseInt(document.getElementById('cornerCount').value, 10) || 0;
        var tees = parseInt(document.getElementById('teeCount').value, 10) || 0;
        var doors = parseInt(document.getElementById('studDoors').value, 10) || 0;
        var windows = parseInt(document.getElementById('studWindows').value, 10) || 0;
        var wastePct = (parseFloat(document.getElementById('studWaste').value) || 10) / 100;

        var baseStuds = Math.ceil((len * 12) / spacing) + 1;
        var cornerStuds = corners * 2;
        var teeStuds = tees * 2;
        var doorStuds = doors * 4; // 2 kings + 2 jacks
        var windowStuds = windows * 5; // 2 kings + 2 jacks + sill/cripple
        var subtotal = baseStuds + cornerStuds + teeStuds + doorStuds + windowStuds;
        var totalStuds = Math.ceil(subtotal * (1 + wastePct));

        // Plates: Double top plate (2x length) + Single bottom plate (1x length) = 3x length in 8ft or 12ft boards
        var totalPlateFt = len * 3;
        var plates8ft = Math.ceil(totalPlateFt / 8);

        document.getElementById('studResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL COMMON STUDS TO ORDER</span>' +
            '<div style="font-size: 1.6rem; font-weight: bold; color: #22c55e;">' + totalStuds + ' Studs</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">(Subtotal: ' + subtotal + ' + ' + Math.round(wastePct * 100) + '% cut waste)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">HORIZONTAL PLATES (DOUBLE TOP + SOLE)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + plates8ft + ' Boards (8 Ft Lengths)</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">' + Math.ceil(len / 8) + ' Pressure-Treated bottom sole plates + ' + (plates8ft - Math.ceil(len / 8)) + ' standard top plates</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">ROUGH OPENING REINFORCEMENTS</span>' +
            '<div style="font-size: 0.95rem; color: var(--fg); line-height: 1.4;">' +
              'Doors: ' + (doors * 2) + ' King + ' + (doors * 2) + ' Jack Studs<br>' +
              'Windows: ' + (windows * 2) + ' King + ' + (windows * 2) + ' Jack + Cripples' +
            '</div>' +
          '</div>';
      }

      document.addEventListener('DOMContentLoaded', calcStuds);
      calcStuds();
    </script>
  `;

  writeFileSync(join(calcDir, 'framing-stud-calculator.html'), renderPage({
    title: 'Wall Stud Framing Calculator (16" & 24" O.C. Lumber List) | Digital Tools Shed',
    metaDesc: 'Calculate 2x4/2x6 wall studs, top plates, bottom sole plates, corners, and door/window headers for standard wall framing.',
    canonical: `${DOMAIN}/calc/framing-stud-calculator`,
    bodyContent: studBody,
    currentPath: '/calc/framing-stud-calculator',
    faq: [
      { q: 'How many studs do I need per foot of wall?', a: 'As a rule of thumb for 16-inch on-center framing, calculate 1 stud per linear foot of wall to cover common studs, corners, and waste.' },
      { q: 'What is the difference between 16" and 24" on-center framing?', a: '16-inch on-center is standard for load-bearing exterior walls, providing structural strength and rigid drywall support. 24-inch on-center framing is permitted for interior non-bearing partition walls.' },
      { q: 'How many top plates are required on a framed wall?', a: 'Standard building codes require a double top plate to overlap wall intersections and carry floor/roof trusses evenly.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. GRAVEL & CRUSHED STONE CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const gravelBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Gravel Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Gravel & Crushed Stone Tonnage Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Estimate cubic yards, tons, and 50 lb bags of gravel, crushed stone, pea gravel, or crusher run needed for driveways, patios, and drainage.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Coverage Dimensions</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Length (Feet)</label>
              <input type="number" id="grvLen" value="30" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcGravel()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Width (Feet)</label>
              <input type="number" id="grvWidth" value="10" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcGravel()" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Depth (Inches)</label>
            <input type="number" id="grvDepth" value="3" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcGravel()" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">Driveway surface: 2–3"; Driveway base: 4–6"; French drain: 6–8"</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Material Density</label>
            <select id="grvDensity" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" onchange="calcGravel()">
              <option value="1.4" selected>Crushed Stone / #57 Gravel (1.4 tons / cu yd)</option>
              <option value="1.5">Pea Gravel (1.5 tons / cu yd)</option>
              <option value="1.6">Crusher Run / Road Base DGA (1.6 tons / cu yd)</option>
              <option value="1.45">Decomposed Granite (1.45 tons / cu yd)</option>
            </select>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Weight & Volume Estimates</h3>
          <div id="grvResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function calcGravel() {
        var l = parseFloat(document.getElementById('grvLen').value) || 0;
        var w = parseFloat(document.getElementById('grvWidth').value) || 0;
        var d = parseFloat(document.getElementById('grvDepth').value) || 0;
        var density = parseFloat(document.getElementById('grvDensity').value) || 1.4;

        var area = l * w;
        var cuFt = area * (d / 12);
        var cuYards = cuFt / 27;
        var tons = cuYards * density;
        var lbs = tons * 2000;
        var bags50 = Math.ceil(lbs / 50);

        document.getElementById('grvResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">ESTIMATED WEIGHT IN TONS</span>' +
            '<div style="font-size: 1.6rem; font-weight: bold; color: #22c55e;">' + tons.toFixed(2) + ' US Tons</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">(' + Math.round(lbs).toLocaleString() + ' lbs)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">CUBIC YARDS VOLUME</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + cuYards.toFixed(2) + ' Cu Yds (' + cuFt.toFixed(1) + ' Cu Ft)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">50 LB BAGS (STORE PURCHASE)</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">' + bags50 + ' Bags</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">DELIVERY RECOMMENDATION</span>' +
            '<div style="font-size: 0.85rem; color: var(--fg); line-height: 1.4;">' +
              (tons >= 2.0 ? '🚛 <strong>Dump Truck Delivery:</strong> Over 2 tons (' + bags50 + ' bags) is vastly cheaper ordered by truckload from a gravel quarry.' : '✅ <strong>Store Bags OK:</strong> Small quantity fits in pickup bed.') +
            '</div>' +
          '</div>';
      }

      document.addEventListener('DOMContentLoaded', calcGravel);
      calcGravel();
    </script>
  `;

  writeFileSync(join(calcDir, 'gravel-calculator.html'), renderPage({
    title: 'Gravel & Crushed Stone Calculator (Tons & Cubic Yards) | Digital Tools Shed',
    metaDesc: 'Calculate tons and cubic yards of driveway gravel, pea gravel, crushed stone, and road base with live bag counts.',
    canonical: `${DOMAIN}/calc/gravel-calculator`,
    bodyContent: gravelBody,
    currentPath: '/calc/gravel-calculator',
    faq: [
      { q: 'How many tons of gravel are in a cubic yard?', a: 'One cubic yard of crushed stone or gravel weighs approximately 1.4 tons (2,800 lbs). Dense road base weighs ~1.6 tons per yard.' },
      { q: 'How much square footage does 1 ton of gravel cover?', a: 'At a depth of 2 inches, 1 ton covers approximately 100 square feet. At 3 inches depth, it covers about 70 square feet.' },
      { q: 'How thick should gravel be on a driveway?', a: 'Driveways require a 4 to 6-inch compacted base of crusher run, topped with 2 to 3 inches of washed gravel (such as #57 stone).' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. PAINT GALLONS ESTIMATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const paintBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Paint Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Interior & Exterior Paint Gallon Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Estimate paint gallons needed for walls, ceilings, and trim with door and window cutouts subtracted.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Room Details</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Length (Feet)</label>
              <input type="number" id="paintLen" value="15" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcPaint()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Width (Feet)</label>
              <input type="number" id="paintWidth" value="12" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcPaint()" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Ceiling Height (Feet)</label>
            <input type="number" id="paintHeight" value="8" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcPaint()" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Doors (21 sq ft)</label>
              <input type="number" id="paintDoors" value="2" min="0" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcPaint()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Windows (15 sq ft)</label>
              <input type="number" id="paintWindows" value="2" min="0" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcPaint()" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Number of Coats</label>
              <select id="paintCoats" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" onchange="calcPaint()">
                <option value="2" selected>2 Coats (Recommended)</option>
                <option value="1">1 Coat (Touch up / Refresh)</option>
              </select>
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Coverage (sq ft / gal)</label>
              <input type="number" id="paintCoverage" value="350" step="25" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcPaint()" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="paintCeilingCheck" checked onchange="calcPaint()" /> Include Separate Ceiling Paint
            </label>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Paint Quantities</h3>
          <div id="paintResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function calcPaint() {
        var l = parseFloat(document.getElementById('paintLen').value) || 0;
        var w = parseFloat(document.getElementById('paintWidth').value) || 0;
        var h = parseFloat(document.getElementById('paintHeight').value) || 8;
        var doors = parseInt(document.getElementById('paintDoors').value, 10) || 0;
        var windows = parseInt(document.getElementById('paintWindows').value, 10) || 0;
        var coats = parseInt(document.getElementById('paintCoats').value, 10) || 2;
        var coverage = parseFloat(document.getElementById('paintCoverage').value) || 350;
        var inclCeiling = document.getElementById('paintCeilingCheck').checked;

        var perimeter = 2 * (l + w);
        var grossWallArea = perimeter * h;
        var deductions = (doors * 21) + (windows * 15);
        var netWallArea = Math.max(0, grossWallArea - deductions);
        var totalWallArea = netWallArea * coats;
        var gallonsWall = Math.ceil(totalWallArea / coverage);

        var ceilingArea = l * w;
        var totalCeilingArea = ceilingArea * (coats > 1 ? 2 : 1);
        var gallonsCeiling = inclCeiling ? Math.ceil(totalCeilingArea / coverage) : 0;

        document.getElementById('paintResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">WALL PAINT TO PURCHASE</span>' +
            '<div style="font-size: 1.6rem; font-weight: bold; color: #3b82f6;">' + gallonsWall + ' Gallon' + (gallonsWall > 1 ? 's' : '') + '</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">' + Math.round(netWallArea) + ' sq ft net wall area (' + coats + ' coats = ' + Math.round(totalWallArea) + ' sq ft coverage)</div>' +
          '</div>' +
          (inclCeiling ? (
            '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
              '<span style="color: var(--text-muted); font-size: 0.75rem;">FLAT CEILING PAINT</span>' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + gallonsCeiling + ' Gallon' + (gallonsCeiling > 1 ? 's' : '') + '</div>' +
              '<div style="font-size: 0.75rem; color: var(--text-muted);">' + Math.round(ceilingArea) + ' sq ft ceiling area</div>' +
            '</div>'
          ) : '') +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">BASEBOARD & TRIM PAINT</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: #22c55e;">1 to 2 Quarts Semi-Gloss</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">' + Math.round(perimeter) + ' linear feet of baseboard + ' + (doors + windows) + ' trim frames</div>' +
          '</div>';
      }

      document.addEventListener('DOMContentLoaded', calcPaint);
      calcPaint();
    </script>
  `;

  writeFileSync(join(calcDir, 'paint-calculator.html'), renderPage({
    title: 'Paint Calculator: Gallons for Walls, Ceiling & Trim | Digital Tools Shed',
    metaDesc: 'Calculate paint gallons needed for any room. Subtracts doors and windows, supports 1 or 2 coats, and separates ceiling paint.',
    canonical: `${DOMAIN}/calc/paint-calculator`,
    bodyContent: paintBody,
    currentPath: '/calc/paint-calculator',
    faq: [
      { q: 'How many square feet does 1 gallon of paint cover?', a: 'One gallon of paint covers roughly 350 to 400 square feet with a single coat.' },
      { q: 'Should I apply 1 or 2 coats of paint?', a: 'Two coats provide richer color depth, hide surface flaws, and create a more durable, washable finish.' },
      { q: 'How much paint is needed for a 12x12 room?', a: 'A standard 12x12 room with 8 ft ceilings needs 2 gallons of wall paint for two full coats.' }
    ]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. TILE & GROUT ESTIMATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const tileBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Tile Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Floor & Wall Tile Estimator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate total square footage, number of tiles, and full boxes to buy with cut waste and grout line spacing.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Surface & Tile Size</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Length (Feet)</label>
              <input type="number" id="tileLen" value="12" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcTile()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Width (Feet)</label>
              <input type="number" id="tileWidth" value="10" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcTile()" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Tile Format / Size</label>
            <select id="tileSizePreset" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" onchange="updateTilePreset()">
              <option value="12x12" selected>12" x 12" (1.00 sq ft)</option>
              <option value="12x24">12" x 24" (2.00 sq ft)</option>
              <option value="6x24">6" x 24" Wood Plank (1.00 sq ft)</option>
              <option value="3x6">3" x 6" Subway Tile (0.125 sq ft)</option>
              <option value="24x24">24" x 24" Large Format (4.00 sq ft)</option>
              <option value="custom">Custom Size (Inches)</option>
            </select>
          </div>

          <div id="tileCustomInputs" style="display: none; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Tile Length (In)</label>
              <input type="number" id="tileCustomL" value="12" step="0.25" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcTile()" />
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Tile Width (In)</label>
              <input type="number" id="tileCustomW" value="12" step="0.25" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcTile()" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Pattern / Cut Waste</label>
              <select id="tileWaste" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" onchange="calcTile()">
                <option value="10" selected>10% (Straight Grid Layout)</option>
                <option value="15">15% (Diagonal / Herringbone)</option>
                <option value="20">20% (Complex Multi-Room Cuts)</option>
              </select>
            </div>
            <div>
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Tiles Per Box</label>
              <input type="number" id="tilesPerBox" value="10" min="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="calcTile()" />
            </div>
          </div>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Tile Purchase Requirements</h3>
          <div id="tileResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function updateTilePreset() {
        var isCustom = document.getElementById('tileSizePreset').value === 'custom';
        document.getElementById('tileCustomInputs').style.display = isCustom ? 'grid' : 'none';
        calcTile();
      }

      function calcTile() {
        var l = parseFloat(document.getElementById('tileLen').value) || 0;
        var w = parseFloat(document.getElementById('tileWidth').value) || 0;
        var wastePct = (parseFloat(document.getElementById('tileWaste').value) || 10) / 100;
        var tilesInBox = parseInt(document.getElementById('tilesPerBox').value, 10) || 10;

        var preset = document.getElementById('tileSizePreset').value;
        var tileSqIn = 144;
        if (preset === '12x12') tileSqIn = 144;
        else if (preset === '12x24') tileSqIn = 288;
        else if (preset === '6x24') tileSqIn = 144;
        else if (preset === '3x6') tileSqIn = 18;
        else if (preset === '24x24') tileSqIn = 576;
        else if (preset === 'custom') {
          var cl = parseFloat(document.getElementById('tileCustomL').value) || 12;
          var cw = parseFloat(document.getElementById('tileCustomW').value) || 12;
          tileSqIn = cl * cw;
        }

        var tileSqFt = tileSqIn / 144;
        var baseSqFt = l * w;
        var totalSqFt = baseSqFt * (1 + wastePct);
        var totalTiles = Math.ceil(totalSqFt / tileSqFt);
        var totalBoxes = Math.ceil(totalTiles / tilesInBox);
        var boxSqFt = tilesInBox * tileSqFt;

        document.getElementById('tileResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">BOXES TO PURCHASE</span>' +
            '<div style="font-size: 1.6rem; font-weight: bold; color: #22c55e;">' + totalBoxes + ' Boxes</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">(' + (totalBoxes * tilesInBox) + ' tiles = ' + (totalBoxes * boxSqFt).toFixed(1) + ' sq ft ordered)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">EXACT INDIVIDUAL TILES NEEDED</span>' +
            '<div style="font-size: 1.25rem; font-weight: bold; color: var(--fg);">' + totalTiles + ' Tiles</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">Surface: ' + baseSqFt.toFixed(1) + ' sq ft + ' + Math.round(wastePct * 100) + '% cut waste (' + totalSqFt.toFixed(1) + ' sq ft total)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">GROUT ESTIMATE</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: #3b82f6;">' + Math.ceil(totalSqFt / 80) + ' Bag(s) of Grout (25 lb)</div>' +
            '<div style="font-size: 0.75rem; color: var(--text-muted);">Standard 1/8" grout joints cover ~80 to 100 sq ft per 25 lb bag</div>' +
          '</div>';
      }

      document.addEventListener('DOMContentLoaded', calcTile);
      calcTile();
    </script>
  `;

  writeFileSync(join(calcDir, 'tile-calculator.html'), renderPage({
    title: 'Tile Calculator: Floor & Wall Tile Boxes & Square Footage | Digital Tools Shed',
    metaDesc: 'Calculate tiles and boxes needed for floors and walls. Includes 12x12, 12x24, subway tile, herringbone waste, and grout bags.',
    canonical: `${DOMAIN}/calc/tile-calculator`,
    bodyContent: tileBody,
    currentPath: '/calc/tile-calculator',
    faq: [
      { q: 'How much extra tile should I order for waste?', a: 'Add 10% extra tile for standard straight grid layouts and 15% to 20% for herringbone, diagonal patterns, or rooms with many door jambs and pipes.' },
      { q: 'How many square feet are in a box of 12x24 tiles?', a: 'Most standard boxes contain 8 pieces of 12x24 inch tiles, which covers 16 square feet.' },
      { q: 'How do you calculate how many tiles are needed for a floor?', a: 'Multiply room length by width in feet to get total square feet, add 10-15% for cuts, and divide by the square footage of one tile.' }
    ]
  }));

  console.log('  ✓ Built Trade & Construction Suite (8 calculators in /calc/)');
}
