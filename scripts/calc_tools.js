import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

function buildUnitCalcSuite() {
  const calcDist = join(DIST, 'calc');
  ensureDir(calcDist);

  const unitCategories = {
    length: {
      label: 'Length & Distance',
      base: 'meter',
      units: {
        millimeter:     { label: 'Millimeters',    abbr: 'mm',   factor: 0.001 },
        centimeter:     { label: 'Centimeters',    abbr: 'cm',   factor: 0.01 },
        meter:          { label: 'Meters',         abbr: 'm',    factor: 1 },
        kilometer:      { label: 'Kilometers',     abbr: 'km',   factor: 1000 },
        inch:           { label: 'Inches',         abbr: 'in',   factor: 0.0254 },
        foot:           { label: 'Feet',           abbr: 'ft',   factor: 0.3048 },
        yard:           { label: 'Yards',          abbr: 'yd',   factor: 0.9144 },
        mile:           { label: 'Miles',          abbr: 'mi',   factor: 1609.344 },
        nautical_mile:  { label: 'Nautical Miles', abbr: 'nmi',  factor: 1852 },
        micrometer:     { label: 'Micrometers',    abbr: 'μm',   factor: 0.000001 }
      }
    },
    weight: {
      label: 'Weight & Mass',
      base: 'kilogram',
      units: {
        milligram: { label: 'Milligrams', abbr: 'mg',  factor: 0.000001 },
        gram:      { label: 'Grams',      abbr: 'g',   factor: 0.001 },
        kilogram:  { label: 'Kilograms',  abbr: 'kg',  factor: 1 },
        tonne:     { label: 'Tonnes',     abbr: 't',   factor: 1000 },
        ounce:     { label: 'Ounces',     abbr: 'oz',  factor: 0.0283495 },
        pound:     { label: 'Pounds',     abbr: 'lbs', factor: 0.453592 },
        stone:     { label: 'Stones',     abbr: 'st',  factor: 6.35029 }
      }
    },
    temperature: {
      label: 'Temperature',
      base: 'celsius',
      custom: true,
      units: {
        celsius:    { label: 'Celsius',    abbr: '°C' },
        fahrenheit: { label: 'Fahrenheit', abbr: '°F' },
        kelvin:     { label: 'Kelvin',     abbr: 'K'  }
      }
    },
    volume: {
      label: 'Volume & Liquid',
      base: 'liter',
      units: {
        milliliter:   { label: 'Milliliters',   abbr: 'mL',   factor: 0.001 },
        liter:        { label: 'Liters',        abbr: 'L',    factor: 1 },
        cubic_meter:  { label: 'Cubic Meters',  abbr: 'm³',   factor: 1000 },
        gallon_us:    { label: 'US Gallons',    abbr: 'gal',  factor: 3.78541 },
        gallon_uk:    { label: 'UK Gallons',    abbr: 'gal',  factor: 4.54609 },
        quart:        { label: 'Quarts',        abbr: 'qt',   factor: 0.946353 },
        pint:         { label: 'Pints',         abbr: 'pt',   factor: 0.473176 },
        cup:          { label: 'Cups',          abbr: 'cup',  factor: 0.236588 },
        tablespoon:   { label: 'Tablespoons',   abbr: 'tbsp', factor: 0.0147868 },
        teaspoon:     { label: 'Teaspoons',     abbr: 'tsp',  factor: 0.00492892 },
        fluid_oz:     { label: 'Fluid Ounces',  abbr: 'fl oz', factor: 0.0295735 }
      }
    },
    speed: {
      label: 'Speed & Velocity',
      base: 'meter_per_second',
      units: {
        meter_per_second:   { label: 'Meters/Second',     abbr: 'm/s',   factor: 1 },
        kilometer_per_hour: { label: 'Kilometers/Hour',    abbr: 'km/h',  factor: 0.277778 },
        mile_per_hour:      { label: 'Miles/Hour',         abbr: 'mph',   factor: 0.44704 },
        knot:               { label: 'Knots',              abbr: 'kn',    factor: 0.514444 },
        foot_per_second:    { label: 'Feet/Second',        abbr: 'ft/s',  factor: 0.3048 }
      }
    },
    area: {
      label: 'Area & Surface',
      base: 'square_meter',
      units: {
        square_millimeter: { label: 'Square Millimeters', abbr: 'mm²', factor: 0.000001 },
        square_centimeter: { label: 'Square Centimeters', abbr: 'cm²', factor: 0.0001 },
        square_meter:      { label: 'Square Meters',      abbr: 'm²',  factor: 1 },
        square_kilometer:  { label: 'Square Kilometers',  abbr: 'km²', factor: 1000000 },
        square_foot:       { label: 'Square Feet',        abbr: 'ft²', factor: 0.092903 },
        square_yard:       { label: 'Square Yards',       abbr: 'yd²', factor: 0.836127 },
        acre:              { label: 'Acres',              abbr: 'ac',  factor: 4046.86 },
        hectare:           { label: 'Hectares',           abbr: 'ha',  factor: 10000 },
        square_mile:       { label: 'Square Miles',       abbr: 'mi²', factor: 2589988.11 }
      }
    },
    data: {
      label: 'Digital Data Storage',
      base: 'byte',
      units: {
        bit:      { label: 'Bits',       abbr: 'b',   factor: 0.125 },
        byte:     { label: 'Bytes',      abbr: 'B',   factor: 1 },
        kilobyte: { label: 'Kilobytes',  abbr: 'KB',  factor: 1024 },
        megabyte: { label: 'Megabytes',  abbr: 'MB',  factor: 1048576 },
        gigabyte: { label: 'Gigabytes',  abbr: 'GB',  factor: 1073741824 },
        terabyte: { label: 'Terabytes',  abbr: 'TB',  factor: 1099511627776 },
        petabyte: { label: 'Petabytes',  abbr: 'PB',  factor: 1125899906842624 }
      }
    },
    time: {
      label: 'Time',
      base: 'second',
      units: {
        millisecond: { label: 'Milliseconds', abbr: 'ms',  factor: 0.001 },
        second:      { label: 'Seconds',      abbr: 's',   factor: 1 },
        minute:      { label: 'Minutes',      abbr: 'min', factor: 60 },
        hour:        { label: 'Hours',        abbr: 'hr',  factor: 3600 },
        day:         { label: 'Days',         abbr: 'd',   factor: 86400 },
        week:        { label: 'Weeks',        abbr: 'wk',  factor: 604800 },
        month:       { label: 'Months',       abbr: 'mo',  factor: 2629800 },
        year:        { label: 'Years',        abbr: 'yr',  factor: 31557600 }
      }
    },
    energy: {
      label: 'Energy & Work',
      base: 'joule',
      units: {
        joule:         { label: 'Joules',         abbr: 'J',    factor: 1 },
        kilojoule:     { label: 'Kilojoules',     abbr: 'kJ',   factor: 1000 },
        calorie:       { label: 'Calories',       abbr: 'cal',  factor: 4.184 },
        kilocalorie:   { label: 'Kilocalories',   abbr: 'kcal', factor: 4184 },
        watt_hour:     { label: 'Watt Hours',     abbr: 'Wh',   factor: 3600 },
        kilowatt_hour: { label: 'Kilowatt Hours', abbr: 'kWh',  factor: 3600000 },
        btu:           { label: 'BTU',            abbr: 'BTU',  factor: 1055.06 }
      }
    },
    pressure: {
      label: 'Pressure',
      base: 'pascal',
      units: {
        pascal:     { label: 'Pascals',     abbr: 'Pa',   factor: 1 },
        kilopascal: { label: 'Kilopascals', abbr: 'kPa',  factor: 1000 },
        bar:        { label: 'Bar',         abbr: 'bar',  factor: 100000 },
        psi:        { label: 'PSI',         abbr: 'psi',  factor: 6894.76 },
        atmosphere: { label: 'Atmospheres', abbr: 'atm',  factor: 101325 },
        torr:       { label: 'Torr',        abbr: 'Torr', factor: 133.322 }
      }
    }
  };

  const popularPairs = {
    length: [
      ['centimeter', 'inch', 'cm-to-inches'],
      ['inch', 'centimeter', 'inches-to-cm'],
      ['meter', 'foot', 'm-to-feet'],
      ['foot', 'meter', 'feet-to-m'],
      ['kilometer', 'mile', 'km-to-miles'],
      ['mile', 'kilometer', 'miles-to-km'],
      ['millimeter', 'inch', 'mm-to-inches']
    ],
    weight: [
      ['kilogram', 'pound', 'kg-to-lbs'],
      ['pound', 'kilogram', 'lbs-to-kg'],
      ['gram', 'ounce', 'g-to-oz'],
      ['ounce', 'gram', 'oz-to-g'],
      ['stone', 'kilogram', 'stone-to-kg'],
      ['kilogram', 'stone', 'kg-to-stone']
    ],
    temperature: [
      ['celsius', 'fahrenheit', 'celsius-to-fahrenheit'],
      ['fahrenheit', 'celsius', 'fahrenheit-to-celsius'],
      ['celsius', 'kelvin', 'celsius-to-kelvin']
    ],
    volume: [
      ['liter', 'gallon_us', 'liters-to-gallons'],
      ['gallon_us', 'liter', 'gallons-to-liters'],
      ['milliliter', 'cup', 'ml-to-cups'],
      ['cup', 'milliliter', 'cups-to-ml'],
      ['tablespoon', 'milliliter', 'tbsp-to-ml'],
      ['teaspoon', 'milliliter', 'tsp-to-ml']
    ],
    speed: [
      ['kilometer_per_hour', 'mile_per_hour', 'kmh-to-mph'],
      ['mile_per_hour', 'kilometer_per_hour', 'mph-to-kmh'],
      ['knot', 'kilometer_per_hour', 'knots-to-kmh']
    ],
    area: [
      ['square_meter', 'square_foot', 'm2-to-ft2'],
      ['square_foot', 'square_meter', 'ft2-to-m2'],
      ['acre', 'hectare', 'acres-to-hectares'],
      ['hectare', 'acre', 'hectares-to-acres']
    ],
    data: [
      ['megabyte', 'gigabyte', 'mb-to-gb'],
      ['gigabyte', 'terabyte', 'gb-to-tb'],
      ['byte', 'kilobyte', 'bytes-to-kb']
    ],
    time: [
      ['hour', 'minute', 'hours-to-minutes'],
      ['day', 'hour', 'days-to-hours'],
      ['week', 'day', 'weeks-to-days']
    ],
    energy: [
      ['calorie', 'joule', 'calories-to-joules'],
      ['kilowatt_hour', 'joule', 'kwh-to-joules'],
      ['kilocalorie', 'kilojoule', 'kcal-to-kj']
    ],
    pressure: [
      ['bar', 'psi', 'bar-to-psi'],
      ['psi', 'bar', 'psi-to-bar'],
      ['atmosphere', 'psi', 'atm-to-psi']
    ]
  };

  const commonValues = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 5000];

  function getFactor(catKey, fromKey, toKey) {
    if (unitCategories[catKey].custom) return null;
    const baseFactorFrom = unitCategories[catKey].units[fromKey].factor;
    const baseFactorTo = unitCategories[catKey].units[toKey].factor;
    return baseFactorFrom / baseFactorTo;
  }

  function getConversionValue(catKey, fromKey, toKey, val, factor) {
    if (unitCategories[catKey].custom) {
      if (fromKey === 'celsius' && toKey === 'fahrenheit') return val * 9/5 + 32;
      if (fromKey === 'fahrenheit' && toKey === 'celsius') return (val - 32) * 5/9;
      if (fromKey === 'celsius' && toKey === 'kelvin') return val + 273.15;
      if (fromKey === 'kelvin' && toKey === 'celsius') return val - 273.15;
      if (fromKey === 'fahrenheit' && toKey === 'kelvin') return (val - 32) * 5/9 + 273.15;
      if (fromKey === 'kelvin' && toKey === 'fahrenheit') return (val - 273.15) * 9/5 + 32;
      return val;
    }
    return val * factor;
  }

  let totalCalcsBuilt = 0;

  for (const catKey of Object.keys(popularPairs)) {
    const pairs = popularPairs[catKey];
    const cat = unitCategories[catKey];

    for (const [fromKey, toKey, rawSlug] of pairs) {
      const slug = rawSlug.replace(/\//g, '');
      const fileName = `${slug}.html`;
      const fromUnit = cat.units[fromKey];
      const toUnit = cat.units[toKey];
      const factor = getFactor(catKey, fromKey, toKey);

      const tableRows = commonValues.map(v => {
        const res = getConversionValue(catKey, fromKey, toKey, v, factor);
        return `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 0.6rem 0.75rem; font-family: var(--mono);">${v} ${fromUnit.abbr}</td>
            <td style="padding: 0.6rem 0.75rem; font-family: var(--mono); font-weight: bold;">${parseFloat(res.toFixed(6))} ${toUnit.abbr}</td>
          </tr>
        `;
      }).join('');

      let formulaHtml = '';
      if (cat.custom) {
        if (fromKey === 'celsius' && toKey === 'fahrenheit') {
          formulaHtml = `<p style="line-height: 1.6; margin-bottom: 0.5rem;">To convert Celsius (°C) to Fahrenheit (°F), multiply by 9/5 (or 1.8) and add 32.</p><div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border);"><strong>Formula:</strong> °F = (°C × 9/5) + 32</div>`;
        } else if (fromKey === 'fahrenheit' && toKey === 'celsius') {
          formulaHtml = `<p style="line-height: 1.6; margin-bottom: 0.5rem;">To convert Fahrenheit (°F) to Celsius (°C), subtract 32 and multiply by 5/9.</p><div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border);"><strong>Formula:</strong> °C = (°F - 32) × 5/9</div>`;
        } else {
          formulaHtml = `<p style="line-height: 1.6;">Uses precise thermodynamic temperature conversion formulas.</p>`;
        }
      } else {
        const displayFactor = parseFloat(factor.toFixed(6));
        formulaHtml = `
          <p style="line-height: 1.6; margin-bottom: 0.5rem;">How to convert ${fromUnit.label} to ${toUnit.label}: Multiply by <strong>${displayFactor}</strong>.</p>
          <div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border);">
            <strong>Formula:</strong> ${toUnit.label} = ${fromUnit.label} × ${displayFactor}
          </div>
        `;
      }

      const relatedCards = pairs.filter(p => p[2].replace(/\//g, '') !== slug).slice(0, 4).map(p => {
        const rFrom = cat.units[p[0]];
        const rTo = cat.units[p[1]];
        const rSlug = p[2].replace(/\//g, '');
        return `
          <a href="/calc/${rSlug}.html" class="tool-card">
            <h4 style="font-family: var(--serif); font-size: 1.05rem; margin-bottom: 0.25rem;">${rFrom.label} to ${rTo.label}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Convert ${rFrom.abbr} to ${rTo.abbr} instantly.</p>
          </a>
        `;
      }).join('');

      let clientScript = '';
      if (cat.custom) {
        clientScript = `
          const fromInput = document.getElementById('fromInput');
          const toInput = document.getElementById('toInput');
          function c2f(v) { return v * 9/5 + 32; }
          function f2c(v) { return (v - 32) * 5/9; }
          function c2k(v) { return v + 273.15; }
          function k2c(v) { return v - 273.15; }
          function f2k(v) { return (v - 32) * 5/9 + 273.15; }
          function k2f(v) { return (v - 273.15) * 9/5 + 32; }

          let convertForward = c2f, convertBackward = f2c;
          if ('${fromKey}_to_${toKey}' === 'celsius_to_fahrenheit') { convertForward = c2f; convertBackward = f2c; }
          else if ('${fromKey}_to_${toKey}' === 'fahrenheit_to_celsius') { convertForward = f2c; convertBackward = c2f; }
          else if ('${fromKey}_to_${toKey}' === 'celsius_to_kelvin') { convertForward = c2k; convertBackward = k2c; }
          else if ('${fromKey}_to_${toKey}' === 'kelvin_to_celsius') { convertForward = k2c; convertBackward = c2k; }
          else if ('${fromKey}_to_${toKey}' === 'fahrenheit_to_kelvin') { convertForward = f2k; convertBackward = k2f; }
          else if ('${fromKey}_to_${toKey}' === 'kelvin_to_fahrenheit') { convertForward = k2f; convertBackward = f2k; }

          function updateFrom() {
            const val = parseFloat(fromInput.value);
            if (isNaN(val)) toInput.value = '';
            else toInput.value = parseFloat(convertForward(val).toFixed(6));
          }
          function updateTo() {
            const val = parseFloat(toInput.value);
            if (isNaN(val)) fromInput.value = '';
            else fromInput.value = parseFloat(convertBackward(val).toFixed(6));
          }

          fromInput.addEventListener('input', updateFrom);
          toInput.addEventListener('input', updateTo);
          updateFrom();
        `;
      } else {
        clientScript = `
          const factor = ${factor};
          const fromInput = document.getElementById('fromInput');
          const toInput = document.getElementById('toInput');

          function updateFrom() {
            const val = parseFloat(fromInput.value);
            if (isNaN(val)) toInput.value = '';
            else toInput.value = parseFloat((val * factor).toFixed(6));
          }
          function updateTo() {
            const val = parseFloat(toInput.value);
            if (isNaN(val)) fromInput.value = '';
            else fromInput.value = parseFloat((val / factor).toFixed(6));
          }

          fromInput.addEventListener('input', updateFrom);
          toInput.addEventListener('input', updateTo);
          updateFrom();
        `;
      }

      const calcBody = `
        <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <h1 style="margin-top: 0.5rem;">Convert ${fromUnit.label} to ${toUnit.label}</h1>
          <p>Instantly calculate ${fromUnit.label} (${fromUnit.abbr}) to ${toUnit.label} (${toUnit.abbr}) with real-time two-way formula calculation.</p>
        </div>

        <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.25rem; align-items: center;">
            <div>
              <label style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">${fromUnit.label} (${fromUnit.abbr})</label>
              <input type="number" id="fromInput" class="search-input" value="1" style="width: 100%; font-size: 1.3rem; padding: 0.75rem 1rem; font-family: var(--mono);" />
            </div>
            <div style="font-size: 2rem; font-weight: bold; text-align: center; color: var(--text-muted); padding-top: 1.5rem;">=</div>
            <div>
              <label style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">${toUnit.label} (${toUnit.abbr})</label>
              <input type="number" id="toInput" class="search-input" style="width: 100%; font-size: 1.3rem; padding: 0.75rem 1rem; font-family: var(--mono);" />
            </div>
          </div>
        </div>

        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">Conversion Formula & Exact Calculation</h3>
          ${formulaHtml}
        </div>

        <div class="ad-blend-box" style="margin: 2rem 0; max-width: 850px;">
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

        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">${fromUnit.label} to ${toUnit.label} Quick Reference Table</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                  <th style="padding: 0.6rem 0.75rem;">${fromUnit.label} (${fromUnit.abbr})</th>
                  <th style="padding: 0.6rem 0.75rem;">${toUnit.label} (${toUnit.abbr})</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </div>

        ${relatedCards ? `
          <div style="margin: 2rem 0; max-width: 850px;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 1rem;">Related ${cat.label} Converters</h3>
            <div class="tool-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
              ${relatedCards}
            </div>
          </div>
        ` : ''}

        <script>
          ${clientScript}
        </script>
      `;

      writeFileSync(join(calcDist, fileName), renderPage({
        title: `Convert ${fromUnit.label} to ${toUnit.label} — Free Online Calculator | Digital Tools Shed`,
        metaDesc: `Instantly convert ${fromUnit.label} (${fromUnit.abbr}) to ${toUnit.label} (${toUnit.abbr}). Free, fast, real-time formula calculations with zero tracking.`,
        canonical: `${DOMAIN}/calc/${fileName}`,
        bodyContent: calcBody,
        currentPath: `/calc/${fileName}`
      }));

      totalCalcsBuilt++;
    }
  }

  console.log(`  ✓ Built & Styled ${totalCalcsBuilt} Unit Calculators with Workbench Theme and Adsterra Ads (/calc/)`);
}

// ─── TECH ARTICLES & BLUEPRINTS SUITE ──────────────────────────────────────

export { buildUnitCalcSuite };
