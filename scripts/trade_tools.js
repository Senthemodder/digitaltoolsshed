import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildTradeTools() {
  const calcDir = join(DIST, 'calc');
  ensureDir(calcDir);

  // 1. STAIR STRINGER & IRC CODE CALCULATOR
  const stairBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Stair Stringer Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Stair Stringer & Rise/Run Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate exact step riser heights, tread depths, stringer cut lengths, and verify International Residential Code (IRC) building compliance.
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
              actualRiser.toFixed(3) + '" (' + toFraction(actualRiser) + ') ' + (isRiserCode ? '✅ Code Compliant' : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Exceeds 7.75\"') +
            '</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">NUMBER OF TREADS & RUN</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + numTreads + ' Treads | Total Run: ' + (totalRun / 12).toFixed(2) + ' ft (' + totalRun.toFixed(1) + '")</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">MINIMUM STRINGER BOARD LENGTH</span>' +
            '<div style="font-size: 1.1rem; font-weight: bold; color: #3b82f6;">Buy 2x12 × ' + stringerFeet + ' ft Lumber (Diagonal: ' + (stringerLenInches / 12).toFixed(2) + ' ft)</div>' +
          '</div>' +
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">STAIR INCLINE ANGLE & COMFORT</span>' +
            '<div style="font-size: 0.95rem; color: var(--fg);">' + inclineAngle + '° pitch (Ideal is 30°–37°) | 2R + T = ' + ruleOfThumb + '" ' + (isComfortGood ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2z"/></svg> Ideal Comfort' : '') + '</div>' +
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
    currentPath: '/calc/stair-calculator'
  }));

  // 2. CONCRETE SLAB & BAG CALCULATOR
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
            <select id="concreteType" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;" onchange="toggleConcreteShape()">
              <option value="slab">Rectangular Slab / Patio / Footing</option>
              <option value="hole">Cylindrical Post Holes / Tubes</option>
            </select>
          </div>

          <div id="slabInputs">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem;">
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Length (Feet)</label>
                <input type="number" id="slabLength" value="10" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              </div>
              <div>
                <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Width (Feet)</label>
                <input type="number" id="slabWidth" value="10" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              </div>
            </div>
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Thickness / Depth (Inches)</label>
              <input type="number" id="slabThickness" value="4" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
              <span style="font-size: 0.75rem; color: var(--text-muted);">Standard patio/sidewalk = 4", Driveway = 5" to 6"</span>
            </div>
          </div>

          <div id="holeInputs" style="display: none;">
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Hole Diameter (Inches)</label>
              <input type="number" id="holeDiameter" value="12" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Hole Depth (Inches)</label>
              <input type="number" id="holeDepth" value="36" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
            <div style="margin-bottom: 1.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Number of Holes / Posts</label>
              <input type="number" id="numHoles" value="4" step="1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Spillage / Waste Buffer</label>
            <select id="concreteBuffer" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;">
              <option value="1.10">10% Extra (Recommended)</option>
              <option value="1.05">5% Extra</option>
              <option value="1.15">15% Extra (Uneven ground)</option>
              <option value="1.00">0% (Exact)</option>
            </select>
          </div>

          <button class="btn-primary" onclick="calcConcrete()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Estimate Concrete Volume</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Material Estimates</h3>
          <div id="concreteResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function toggleConcreteShape() {
        var type = document.getElementById('concreteType').value;
        document.getElementById('slabInputs').style.display = type === 'slab' ? 'block' : 'none';
        document.getElementById('holeInputs').style.display = type === 'hole' ? 'block' : 'none';
        calcConcrete();
      }

      function calcConcrete() {
        var type = document.getElementById('concreteType').value;
        var buffer = parseFloat(document.getElementById('concreteBuffer').value) || 1.10;
        var cuFt = 0;

        if (type === 'slab') {
          var l = parseFloat(document.getElementById('slabLength').value) || 0;
          var w = parseFloat(document.getElementById('slabWidth').value) || 0;
          var t = (parseFloat(document.getElementById('slabThickness').value) || 0) / 12;
          cuFt = l * w * t;
        } else {
          var d = (parseFloat(document.getElementById('holeDiameter').value) || 0) / 12;
          var depth = (parseFloat(document.getElementById('holeDepth').value) || 0) / 12;
          var count = parseFloat(document.getElementById('numHoles').value) || 1;
          var r = d / 2;
          cuFt = Math.PI * r * r * depth * count;
        }

        var bufferedCuFt = cuFt * buffer;
        var cuYards = bufferedCuFt / 27;
        var bags80 = Math.ceil(bufferedCuFt / 0.60);
        var bags60 = Math.ceil(bufferedCuFt / 0.45);

        document.getElementById('concreteResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL VOLUME (WITH BUFFER)</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: #3b82f6;">' + cuYards.toFixed(2) + ' Cubic Yards</div>' +
            '<div style="font-size: 0.8rem; color: var(--text-muted);">(' + bufferedCuFt.toFixed(1) + ' Cubic Feet)</div>' +
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
              (cuYards >= 1.0 ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg> <strong>Ready-Mix Truck Recommended:</strong> Over 1 cubic yard (' + bags80 + ' bags) is usually cheaper and faster to order via cement truck.' : '✅ <strong>Pre-mix Bags Feasible:</strong> Under 1 cubic yard is easy to mix in a wheelbarrow or small mixer.') +
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
    currentPath: '/calc/concrete-calculator'
  }));

  // 3. DRYWALL & SCREW ESTIMATOR
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
            <input type="number" id="roomHeight" value="8" step="0.5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer;">
              <input type="checkbox" id="includeCeiling" checked onchange="calcDrywall()" />
              Include Ceiling Drywall
            </label>
          </div>

          <button class="btn-primary" onclick="calcDrywall()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Calculate Materials</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Drywall Materials List</h3>
          <div id="drywallResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function calcDrywall() {
        var l = parseFloat(document.getElementById('roomLength').value) || 0;
        var w = parseFloat(document.getElementById('roomWidth').value) || 0;
        var h = parseFloat(document.getElementById('roomHeight').value) || 0;
        var incCeil = document.getElementById('includeCeiling').checked;

        var wallSqFt = 2 * (l + w) * h;
        var ceilSqFt = incCeil ? (l * w) : 0;
        var totalSqFt = (wallSqFt + ceilSqFt) * 1.10;

        var sheets4x8 = Math.ceil(totalSqFt / 32);
        var sheets4x12 = Math.ceil(totalSqFt / 48);
        var mudGallons = Math.ceil(totalSqFt * 0.053);
        var jointTapeFeet = Math.ceil(totalSqFt * 0.37);
        var tapeRolls = Math.ceil(jointTapeFeet / 250);
        var screwsLbs = Math.ceil(totalSqFt * 0.0055);

        document.getElementById('drywallResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">TOTAL SURFACE AREA (WITH 10% WASTE)</span>' +
            '<div style="font-size: 1.4rem; font-weight: bold; color: var(--fg);">' + totalSqFt.toFixed(0) + ' Sq. Ft.</div>' +
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
    currentPath: '/calc/drywall-calculator'
  }));

  // 4. MULCH & TOPSOIL YARDAGE CALCULATOR
  const mulchBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Calculators</a> &gt; Mulch & Topsoil Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Mulch, Topsoil & Gravel Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate exact cubic yards of mulch, landscaping rock, or topsoil needed for garden beds, plus 2 cu ft and 3 cu ft bag counts.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Garden Bed Dimensions</h3>
          
          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Total Area (Square Feet)</label>
            <input type="number" id="mulchArea" value="250" step="5" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">E.g. A 25 ft × 10 ft garden bed = 250 sq ft</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Layer Depth (Inches)</label>
            <select id="mulchDepth" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;">
              <option value="2">2 Inches (Annual Refresh)</option>
              <option value="3" selected>3 Inches (Standard Weed Control)</option>
              <option value="4">4 Inches (New Garden Bed)</option>
              <option value="1">1 Inch (Topsoil / Seed dressing)</option>
            </select>
          </div>

          <button class="btn-primary" onclick="calcMulch()" style="width: 100%; padding: 0.75rem; font-size: 1rem;">Calculate Yardage</button>
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1.25rem;">Mulch & Bag Estimates</h3>
          <div id="mulchResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function calcMulch() {
        var area = parseFloat(document.getElementById('mulchArea').value) || 0;
        var depthInches = parseFloat(document.getElementById('mulchDepth').value) || 3;

        var cuFt = area * (depthInches / 12);
        var cuYards = cuFt / 27;
        var bags2CuFt = Math.ceil(cuFt / 2.0);
        var bags3CuFt = Math.ceil(cuFt / 3.0);

        document.getElementById('mulchResults').innerHTML = 
          '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
            '<span style="color: var(--text-muted); font-size: 0.75rem;">BULK VOLUME (CUBIC YARDS)</span>' +
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
              (cuYards >= 3.0 ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg> <strong>Bulk Delivery Recommended:</strong> 3+ cubic yards (' + bags2CuFt + ' bags) is significantly cheaper delivered by the truckload from a local landscape supply yard.' : '✅ <strong>Bag Purchase Feasible:</strong> Under 3 cubic yards fits easily in a pickup truck or SUV over a couple of trips.') +
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
    currentPath: '/calc/mulch-calculator'
  }));

  console.log('  ✓ Built Trade & Construction Suite (Stair, Concrete, Drywall, Mulch calculators in /calc/)');
}
