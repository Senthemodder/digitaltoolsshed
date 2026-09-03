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
      ['millimeter', 'inch', 'mm-to-inches'],
      ['inch', 'millimeter', 'inches-to-mm'],
      ['foot', 'centimeter', 'feet-to-cm'],
      ['centimeter', 'foot', 'cm-to-feet'],
      ['meter', 'yard', 'm-to-yards'],
      ['yard', 'meter', 'yards-to-m'],
      ['meter', 'centimeter', 'm-to-cm'],
      ['centimeter', 'meter', 'cm-to-m'],
      ['kilometer', 'meter', 'km-to-m'],
      ['meter', 'kilometer', 'm-to-km'],
      ['mile', 'foot', 'miles-to-feet'],
      ['foot', 'mile', 'feet-to-miles'],
      ['yard', 'foot', 'yards-to-feet'],
      ['foot', 'yard', 'feet-to-yards'],
      ['inch', 'foot', 'inches-to-feet'],
      ['foot', 'inch', 'feet-to-inches'],
      ['millimeter', 'centimeter', 'mm-to-cm'],
      ['centimeter', 'millimeter', 'cm-to-mm'],
      ['micrometer', 'millimeter', 'um-to-mm'],
      ['nautical_mile', 'kilometer', 'nautical-miles-to-km'],
      ['kilometer', 'nautical_mile', 'km-to-nautical-miles'],
      ['mile', 'meter', 'miles-to-meters'],
      ['meter', 'mile', 'meters-to-miles'],
      ['inch', 'meter', 'inches-to-meters'],
      ['meter', 'inch', 'meters-to-inches']
    ],
    weight: [
      ['kilogram', 'pound', 'kg-to-lbs'],
      ['pound', 'kilogram', 'lbs-to-kg'],
      ['gram', 'ounce', 'g-to-oz'],
      ['ounce', 'gram', 'oz-to-g'],
      ['stone', 'kilogram', 'stone-to-kg'],
      ['kilogram', 'stone', 'kg-to-stone'],
      ['kilogram', 'gram', 'kg-to-grams'],
      ['gram', 'kilogram', 'grams-to-kg'],
      ['pound', 'ounce', 'lbs-to-oz'],
      ['ounce', 'pound', 'oz-to-lbs'],
      ['tonne', 'kilogram', 'tonnes-to-kg'],
      ['kilogram', 'tonne', 'kg-to-tonnes'],
      ['tonne', 'pound', 'tonnes-to-lbs'],
      ['pound', 'tonne', 'lbs-to-tonnes'],
      ['stone', 'pound', 'stone-to-lbs'],
      ['pound', 'stone', 'lbs-to-stone'],
      ['milligram', 'gram', 'mg-to-g'],
      ['gram', 'milligram', 'g-to-mg'],
      ['pound', 'gram', 'lbs-to-grams'],
      ['gram', 'pound', 'grams-to-lbs']
    ],
    temperature: [
      ['celsius', 'fahrenheit', 'celsius-to-fahrenheit'],
      ['fahrenheit', 'celsius', 'fahrenheit-to-celsius'],
      ['celsius', 'kelvin', 'celsius-to-kelvin'],
      ['kelvin', 'celsius', 'kelvin-to-celsius'],
      ['fahrenheit', 'kelvin', 'fahrenheit-to-kelvin'],
      ['kelvin', 'fahrenheit', 'kelvin-to-fahrenheit']
    ],
    volume: [
      ['liter', 'gallon_us', 'liters-to-gallons'],
      ['gallon_us', 'liter', 'gallons-to-liters'],
      ['milliliter', 'cup', 'ml-to-cups'],
      ['cup', 'milliliter', 'cups-to-ml'],
      ['tablespoon', 'milliliter', 'tbsp-to-ml'],
      ['teaspoon', 'milliliter', 'tsp-to-ml'],
      ['liter', 'milliliter', 'liters-to-ml'],
      ['milliliter', 'liter', 'ml-to-liters'],
      ['gallon_us', 'cup', 'gallons-to-cups'],
      ['cup', 'gallon_us', 'cups-to-gallons'],
      ['fluid_oz', 'milliliter', 'fl-oz-to-ml'],
      ['milliliter', 'fluid_oz', 'ml-to-fl-oz'],
      ['liter', 'cubic_meter', 'liters-to-cubic-meters'],
      ['cubic_meter', 'liter', 'cubic-meters-to-liters'],
      ['pint', 'liter', 'pints-to-liters'],
      ['liter', 'pint', 'liters-to-pints'],
      ['quart', 'liter', 'quarts-to-liters'],
      ['liter', 'quart', 'liters-to-quarts'],
      ['gallon_uk', 'liter', 'uk-gallons-to-liters'],
      ['liter', 'gallon_uk', 'liters-to-uk-gallons'],
      ['cup', 'tablespoon', 'cups-to-tbsp'],
      ['tablespoon', 'cup', 'tbsp-to-cups'],
      ['fluid_oz', 'cup', 'fl-oz-to-cups'],
      ['cup', 'fluid_oz', 'cups-to-fl-oz'],
      ['gallon_us', 'quart', 'gallons-to-quarts'],
      ['quart', 'gallon_us', 'quarts-to-gallons']
    ],
    speed: [
      ['kilometer_per_hour', 'mile_per_hour', 'kmh-to-mph'],
      ['mile_per_hour', 'kilometer_per_hour', 'mph-to-kmh'],
      ['knot', 'kilometer_per_hour', 'knots-to-kmh'],
      ['knot', 'mile_per_hour', 'knots-to-mph'],
      ['mile_per_hour', 'knot', 'mph-to-knots'],
      ['meter_per_second', 'kilometer_per_hour', 'ms-to-kmh'],
      ['kilometer_per_hour', 'meter_per_second', 'kmh-to-ms'],
      ['meter_per_second', 'mile_per_hour', 'ms-to-mph'],
      ['mile_per_hour', 'meter_per_second', 'mph-to-ms'],
      ['foot_per_second', 'mile_per_hour', 'fps-to-mph'],
      ['mile_per_hour', 'foot_per_second', 'mph-to-fps']
    ],
    area: [
      ['square_meter', 'square_foot', 'm2-to-ft2'],
      ['square_foot', 'square_meter', 'ft2-to-m2'],
      ['acre', 'hectare', 'acres-to-hectares'],
      ['hectare', 'acre', 'hectares-to-acres'],
      ['acre', 'square_foot', 'acres-to-sq-ft'],
      ['square_foot', 'acre', 'sq-ft-to-acres'],
      ['acre', 'square_meter', 'acres-to-sq-m'],
      ['square_meter', 'acre', 'sq-m-to-acres'],
      ['hectare', 'square_meter', 'hectares-to-sq-m'],
      ['square_meter', 'hectare', 'sq-m-to-hectares'],
      ['square_kilometer', 'square_mile', 'sq-km-to-sq-miles'],
      ['square_mile', 'square_kilometer', 'sq-miles-to-sq-km'],
      ['square_yard', 'square_meter', 'sq-yd-to-sq-m'],
      ['square_meter', 'square_yard', 'sq-m-to-sq-yd'],
      ['square_yard', 'square_foot', 'sq-yd-to-sq-ft'],
      ['square_foot', 'square_yard', 'sq-ft-to-sq-yd'],
      ['square_centimeter', 'square_meter', 'sq-cm-to-sq-m'],
      ['square_meter', 'square_centimeter', 'sq-m-to-sq-cm'],
      ['square_foot', 'square_centimeter', 'sq-ft-to-sq-cm'],
      ['square_centimeter', 'square_foot', 'sq-cm-to-sq-ft'],
      ['hectare', 'square_foot', 'hectares-to-sq-ft'],
      ['square_foot', 'hectare', 'sq-ft-to-hectares'],
      ['square_mile', 'acre', 'sq-miles-to-acres'],
      ['acre', 'square_mile', 'acres-to-sq-miles'],
      ['square_kilometer', 'hectare', 'sq-km-to-hectares'],
      ['hectare', 'square_kilometer', 'hectares-to-sq-km']
    ],
    data: [
      ['megabyte', 'gigabyte', 'mb-to-gb'],
      ['gigabyte', 'terabyte', 'gb-to-tb'],
      ['byte', 'kilobyte', 'bytes-to-kb'],
      ['gigabyte', 'megabyte', 'gb-to-mb'],
      ['terabyte', 'gigabyte', 'tb-to-gb'],
      ['kilobyte', 'megabyte', 'kb-to-mb'],
      ['megabyte', 'kilobyte', 'mb-to-kb'],
      ['kilobyte', 'byte', 'kb-to-bytes'],
      ['petabyte', 'terabyte', 'pb-to-tb'],
      ['terabyte', 'petabyte', 'tb-to-pb'],
      ['bit', 'byte', 'bits-to-bytes'],
      ['byte', 'bit', 'bytes-to-bits'],
      ['megabyte', 'terabyte', 'mb-to-tb'],
      ['terabyte', 'megabyte', 'tb-to-mb']
    ],
    time: [
      ['hour', 'minute', 'hours-to-minutes'],
      ['day', 'hour', 'days-to-hours'],
      ['week', 'day', 'weeks-to-days'],
      ['minute', 'second', 'minutes-to-seconds'],
      ['second', 'minute', 'seconds-to-minutes'],
      ['minute', 'hour', 'minutes-to-hours'],
      ['hour', 'day', 'hours-to-days'],
      ['day', 'week', 'days-to-weeks'],
      ['year', 'day', 'years-to-days'],
      ['day', 'year', 'days-to-years'],
      ['year', 'month', 'years-to-months'],
      ['month', 'year', 'months-to-years'],
      ['month', 'day', 'months-to-days'],
      ['day', 'month', 'days-to-months'],
      ['week', 'hour', 'weeks-to-hours'],
      ['hour', 'second', 'hours-to-seconds'],
      ['second', 'millisecond', 'seconds-to-ms'],
      ['millisecond', 'second', 'ms-to-seconds']
    ],
    energy: [
      ['calorie', 'joule', 'calories-to-joules'],
      ['kilowatt_hour', 'joule', 'kwh-to-joules'],
      ['joule', 'kilowatt_hour', 'joules-to-kwh'],
      ['watt_hour', 'kilowatt_hour', 'wh-to-kwh'],
      ['kilowatt_hour', 'watt_hour', 'kwh-to-wh'],
      ['kilocalorie', 'kilojoule', 'kcal-to-kj'],
      ['joule', 'calorie', 'joules-to-calories'],
      ['kilojoule', 'kilocalorie', 'kj-to-kcal'],
      ['btu', 'joule', 'btu-to-joules'],
      ['joule', 'btu', 'joules-to-btu'],
      ['kilowatt_hour', 'btu', 'kwh-to-btu'],
      ['btu', 'kilowatt_hour', 'btu-to-kwh'],
      ['watt_hour', 'joule', 'wh-to-joules'],
      ['joule', 'watt_hour', 'joules-to-wh'],
      ['calorie', 'kilocalorie', 'cal-to-kcal'],
      ['kilocalorie', 'calorie', 'kcal-to-cal'],
      ['kilowatt_hour', 'kilojoule', 'kwh-to-kj'],
      ['kilojoule', 'kilowatt_hour', 'kj-to-kwh']
    ],
    pressure: [
      ['bar', 'psi', 'bar-to-psi'],
      ['psi', 'bar', 'psi-to-bar'],
      ['atmosphere', 'psi', 'atm-to-psi'],
      ['psi', 'atmosphere', 'psi-to-atm'],
      ['bar', 'atmosphere', 'bar-to-atm'],
      ['atmosphere', 'bar', 'atm-to-bar'],
      ['kilopascal', 'psi', 'kpa-to-psi'],
      ['psi', 'kilopascal', 'psi-to-kpa'],
      ['torr', 'pascal', 'torr-to-pascal'],
      ['pascal', 'torr', 'pascal-to-torr'],
      ['atmosphere', 'kilopascal', 'atm-to-kpa'],
      ['kilopascal', 'atmosphere', 'kpa-to-atm'],
      ['bar', 'kilopascal', 'bar-to-kpa'],
      ['kilopascal', 'bar', 'kpa-to-bar']
    ]
  };

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

  function formatNumber(num) {
    if (isNaN(num) || num === null || num === undefined) return '';
    if (Math.abs(num) >= 1e9 || (Math.abs(num) > 0 && Math.abs(num) < 1e-6)) {
      return num.toExponential(4);
    }
    const fixed = parseFloat(num.toFixed(6));
    if (Math.abs(fixed) >= 1000) {
      return fixed.toLocaleString('en-US', { maximumFractionDigits: 6 });
    }
    return fixed.toString();
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

      const isKitchen = (catKey === 'volume') ||
        ['teaspoon', 'tablespoon', 'cup', 'fluid_oz', 'milliliter', 'liter', 'gram', 'ounce', 'pound'].includes(fromKey) ||
        ['teaspoon', 'tablespoon', 'cup', 'fluid_oz', 'milliliter', 'liter', 'gram', 'ounce', 'pound'].includes(toKey);

      let tableValues = [];
      let presets = [];

      if (catKey === 'volume' || fromKey === 'teaspoon' || toKey === 'teaspoon' || fromKey === 'cup' || toKey === 'cup' || fromKey === 'tablespoon' || toKey === 'tablespoon') {
        tableValues = [
          { label: '1/8 (0.125)', val: 0.125 },
          { label: '1/4 (0.25)', val: 0.25 },
          { label: '1/3 (0.333)', val: 1/3 },
          { label: '1/2 (0.5)', val: 0.5 },
          { label: '2/3 (0.667)', val: 2/3 },
          { label: '3/4 (0.75)', val: 0.75 },
          { label: '1', val: 1 },
          { label: '1 1/2 (1.5)', val: 1.5 },
          { label: '2', val: 2 },
          { label: '2 1/2 (2.5)', val: 2.5 },
          { label: '3', val: 3 },
          { label: '4', val: 4 },
          { label: '5', val: 5 },
          { label: '10', val: 10 },
          { label: '25', val: 25 },
          { label: '50', val: 50 },
          { label: '100', val: 100 },
          { label: '250', val: 250 },
          { label: '500', val: 500 },
          { label: '1,000', val: 1000 }
        ];
        presets = ['1/8', '1/4', '1/3', '1/2', '3/4', '1', '1 1/2', '2', '2 1/2', '5', '10'];
      } else if (catKey === 'energy') {
        tableValues = [
          { label: '0.1', val: 0.1 },
          { label: '0.5', val: 0.5 },
          { label: '1', val: 1 },
          { label: '2', val: 2 },
          { label: '5', val: 5 },
          { label: '10', val: 10 },
          { label: '25', val: 25 },
          { label: '50', val: 50 },
          { label: '100', val: 100 },
          { label: '250', val: 250 },
          { label: '500', val: 500 },
          { label: '1,000', val: 1000 },
          { label: '5,000', val: 5000 },
          { label: '10,000', val: 10000 }
        ];
        presets = ['0.1', '0.5', '1', '5', '10', '50', '100', '500', '1000'];
      } else {
        tableValues = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 5000].map(v => ({ label: v.toLocaleString('en-US'), val: v }));
        presets = ['1', '2', '5', '10', '25', '50', '100'];
      }

      const tableRows = tableValues.map(item => {
        const res = getConversionValue(catKey, fromKey, toKey, item.val, factor);
        return `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 0.6rem 0.75rem; font-family: var(--mono);">${item.label} ${fromUnit.abbr}</td>
            <td style="padding: 0.6rem 0.75rem; font-family: var(--mono); font-weight: bold;">${formatNumber(res)} ${toUnit.abbr}</td>
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
          <a href="/calc/${rSlug}" class="tool-card">
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

          function parseFraction(str) {
            if (!str) return NaN;
            str = str.toString().trim();
            if (str.includes('/')) {
              const parts = str.split(/\\s+/);
              if (parts.length === 2) {
                const whole = parseFloat(parts[0]);
                const fracParts = parts[1].split('/');
                const num = parseFloat(fracParts[0]);
                const den = parseFloat(fracParts[1]);
                return (!isNaN(whole) && !isNaN(num) && den) ? (whole >= 0 ? whole + num/den : whole - num/den) : NaN;
              }
              const fracParts = str.split('/');
              const num = parseFloat(fracParts[0]);
              const den = parseFloat(fracParts[1]);
              return (!isNaN(num) && den) ? num / den : NaN;
            }
            const spaceParts = str.split(/\\s+/);
            if (spaceParts.length === 3) {
              const whole = parseFloat(spaceParts[0]);
              const num = parseFloat(spaceParts[1]);
              const den = parseFloat(spaceParts[2]);
              if (!isNaN(whole) && !isNaN(num) && den) return whole >= 0 ? whole + num/den : whole - num/den;
            }
            return parseFloat(str);
          }

          function formatResult(val) {
            if (isNaN(val)) return '';
            return parseFloat(val.toFixed(6));
          }

          function updateFrom() {
            const val = parseFraction(fromInput.value);
            if (isNaN(val)) toInput.value = '';
            else toInput.value = formatResult(convertForward(val));
          }
          function updateTo() {
            const val = parseFraction(toInput.value);
            if (isNaN(val)) fromInput.value = '';
            else fromInput.value = formatResult(convertBackward(val));
          }
          window.setPreset = function(val) {
            fromInput.value = val;
            updateFrom();
          };

          fromInput.addEventListener('input', updateFrom);
          toInput.addEventListener('input', updateTo);
          updateFrom();
        `;
      } else {
        clientScript = `
          const factor = ${factor};
          const fromInput = document.getElementById('fromInput');
          const toInput = document.getElementById('toInput');

          function parseFraction(str) {
            if (!str) return NaN;
            str = str.toString().trim();
            if (str.includes('/')) {
              const parts = str.split(/\\s+/);
              if (parts.length === 2) {
                const whole = parseFloat(parts[0]);
                const fracParts = parts[1].split('/');
                const num = parseFloat(fracParts[0]);
                const den = parseFloat(fracParts[1]);
                return (!isNaN(whole) && !isNaN(num) && den) ? (whole >= 0 ? whole + num/den : whole - num/den) : NaN;
              }
              const fracParts = str.split('/');
              const num = parseFloat(fracParts[0]);
              const den = parseFloat(fracParts[1]);
              return (!isNaN(num) && den) ? num / den : NaN;
            }
            const spaceParts = str.split(/\\s+/);
            if (spaceParts.length === 3) {
              const whole = parseFloat(spaceParts[0]);
              const num = parseFloat(spaceParts[1]);
              const den = parseFloat(spaceParts[2]);
              if (!isNaN(whole) && !isNaN(num) && den) return whole >= 0 ? whole + num/den : whole - num/den;
            }
            return parseFloat(str);
          }

          function formatResult(val) {
            if (isNaN(val)) return '';
            if (Math.abs(val) >= 1e9 || (Math.abs(val) > 0 && Math.abs(val) < 1e-6)) {
              return val.toExponential(4);
            }
            return parseFloat(val.toFixed(6));
          }

          function updateFrom() {
            const val = parseFraction(fromInput.value);
            if (isNaN(val)) toInput.value = '';
            else toInput.value = formatResult(val * factor);
          }
          function updateTo() {
            const val = parseFraction(toInput.value);
            if (isNaN(val)) fromInput.value = '';
            else fromInput.value = formatResult(val / factor);
          }
          window.setPreset = function(val) {
            fromInput.value = val;
            updateFrom();
          };

          fromInput.addEventListener('input', updateFrom);
          toInput.addEventListener('input', updateTo);
          updateFrom();
        `;
      }

      const oneUnitValue = formatNumber(getConversionValue(catKey, fromKey, toKey, 1, factor));

      let extraDeepContent = '';
      if (fromKey === 'meter' && toKey === 'inch') {
        extraDeepContent = `
        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">Human Height in Meters to Feet and Inches</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1rem;">
            When measuring personal height, meters are commonly converted to total inches and traditional feet and inches notation:
          </p>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase;">
                  <th style="padding: 0.5rem 0.75rem;">Height (Meters)</th>
                  <th style="padding: 0.5rem 0.75rem;">Total Inches</th>
                  <th style="padding: 0.5rem 0.75rem;">Feet & Inches</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.50 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">59.06 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">4' 11.06"</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.55 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">61.02 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">5' 1.02"</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.60 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">62.99 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">5' 2.99" (~5' 3")</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.65 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">64.96 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">5' 4.96" (~5' 5")</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.70 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">66.93 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">5' 6.93" (~5' 7")</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.75 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">68.90 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">5' 8.90" (~5' 9")</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.80 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">70.87 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">5' 10.87" (~5' 11")</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.85 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">72.83 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">6' 0.83" (~6' 1")</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.90 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">74.80 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">6' 2.80" (~6' 3")</td></tr>
                <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">1.95 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">76.77 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">6' 4.77" (~6' 5")</td></tr>
                <tr><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">2.00 m</td><td style="padding: 0.5rem 0.75rem; font-family: var(--mono);">78.74 in</td><td style="padding: 0.5rem 0.75rem; font-weight: bold;">6' 6.74" (~6' 7")</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        `;
      } else if (fromKey === 'square_centimeter' && toKey === 'square_meter') {
        extraDeepContent = `
        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">Why is 1 m² Equal to 10,000 cm²?</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem;">
            A common mistake when converting area is using the linear factor of 100 instead of 10,000. Because area involves two dimensions (length × width):
          </p>
          <div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border); margin-bottom: 1rem; line-height: 1.6;">
            1 Meter = 100 Centimeters<br>
            1 Square Meter = 100 cm × 100 cm = <strong>10,000 cm²</strong><br>
            Therefore, 1 cm² = 1 / 10,000 = <strong>0.0001 m²</strong>
          </div>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
            To convert any area from square centimeters to square meters, simply divide the value by <strong>10,000</strong> (or move the decimal point 4 places to the left).
          </p>
        </div>
        `;
      } else if (fromKey === 'teaspoon' && toKey === 'milliliter') {
        extraDeepContent = `
        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">US Teaspoons vs. Metric & Medical Spoons</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem;">
            In cooking and pharmacology, spoon volumes can vary slightly depending on whether US customary or metric standards are used:
          </p>
          <ul style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; padding-left: 1.25rem;">
            <li><strong>US Customary Teaspoon:</strong> Exactly 4.92892 mL (used for American recipe books).</li>
            <li><strong>Metric Teaspoon / Medicine Dosing:</strong> Rounded to exactly <strong>5.0 mL</strong> by the FDA and pharmaceutical industry for safe liquid medication dosing.</li>
            <li><strong>3 Teaspoons = 1 Tablespoon:</strong> 1 tbsp = 14.79 mL (or 15 mL metric).</li>
          </ul>
        </div>
        `;
      } else if (fromKey === 'kilowatt_hour' && toKey === 'joule') {
        extraDeepContent = `
        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">Physics Derivation: From Watts to Joules</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem;">
            A Watt is defined in physics as 1 Joule per second (1 W = 1 J/s). A Kilowatt-hour is the amount of energy consumed by a 1,000-Watt device running continuously for one full hour (3,600 seconds):
          </p>
          <div style="font-family: var(--mono); background: var(--surface-alt); padding: 0.75rem; border: 1px solid var(--border); margin-bottom: 1rem; line-height: 1.6;">
            1 kWh = 1,000 Watts × 1 Hour<br>
            1 kWh = 1,000 Joules/second × 3,600 seconds<br>
            1 kWh = <strong>3,600,000 Joules</strong> (3.6 Megajoules / 3.6 × 10⁶ J)
          </div>
        </div>
        `;
      }

      const calcBody = `
        <div class="hero" style="padding-bottom: 1rem; margin-bottom: 1rem;">
          <h1 style="margin-top: 0.5rem;">${fromUnit.abbr} to ${toUnit.abbr}: Convert ${fromUnit.label} to ${toUnit.label}</h1>
          <p>Instantly calculate ${fromUnit.label} (${fromUnit.abbr}) to ${toUnit.label} (${toUnit.abbr}) with real-time two-way calculation and recipe fraction support.</p>
        </div>

        <div style="background: var(--surface-alt); border-left: 4px solid var(--border-strong); padding: 0.85rem 1.15rem; margin-bottom: 1.25rem; font-size: 1.05rem; font-family: var(--serif); max-width: 850px;">
          <strong>Quick Answer:</strong> 1 ${fromUnit.abbr} = <strong>${oneUnitValue} ${toUnit.abbr}</strong> (1 ${fromUnit.label.replace(/s$/, '')} = ${oneUnitValue} ${toUnit.label})
        </div>

        <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.25rem; align-items: center;">
            <div>
              <label style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">${fromUnit.label} (${fromUnit.abbr})</label>
              <input type="text" inputmode="decimal" id="fromInput" class="search-input" value="1" placeholder="e.g. 1, 1/2, 2 1/2" style="width: 100%; font-size: 1.3rem; padding: 0.75rem 1rem; font-family: var(--mono);" />
            </div>
            <div style="font-size: 2rem; font-weight: bold; text-align: center; color: var(--text-muted); padding-top: 1.5rem;">=</div>
            <div>
              <label style="font-family: var(--serif); font-size: 1.05rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">${toUnit.label} (${toUnit.abbr})</label>
              <input type="text" inputmode="decimal" id="toInput" class="search-input" value="${oneUnitValue}" placeholder="Result" style="width: 100%; font-size: 1.3rem; padding: 0.75rem 1rem; font-family: var(--mono);" />
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.25rem; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">Quick Presets:</span>
            ${presets.map(p => `
              <button type="button" onclick="setPreset('${p}')" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.35rem 0.65rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; color: var(--fg); transition: all 0.15s ease;" onmouseover="this.style.background='var(--border)'" onmouseout="this.style.background='var(--surface-alt)'">${p} ${fromUnit.abbr}</button>
            `).join('')}
          </div>
        </div>

        <div style="border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin: 2rem 0; max-width: 850px;">
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">Conversion Formula & Exact Calculation</h3>
          ${formulaHtml}
        </div>

        ${extraDeepContent}

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

      // Auto-generate FAQ for SEO rich snippets
      const faqData = [
        { q: `How do I convert ${fromUnit.label} to ${toUnit.label}?`, a: `To convert ${fromUnit.label} (${fromUnit.abbr}) to ${toUnit.label} (${toUnit.abbr}), ${cat.custom ? 'use the thermodynamic conversion formula shown above' : `multiply the value by ${parseFloat(factor.toFixed(6))}`}. For example, 10 ${fromUnit.abbr} = ${formatNumber(getConversionValue(catKey, fromKey, toKey, 10, factor))} ${toUnit.abbr}.` },
        { q: `How many ${toUnit.label} are in 1 ${fromUnit.label.replace(/s$/, '')}?`, a: `1 ${fromUnit.label.replace(/s$/, '')} (${fromUnit.abbr}) is equal to ${formatNumber(getConversionValue(catKey, fromKey, toKey, 1, factor))} ${toUnit.label} (${toUnit.abbr}).` },
        { q: `Is this ${fromUnit.abbr} to ${toUnit.abbr} converter accurate?`, a: `Yes. This converter uses exact conversion factors and performs real-time calculations client-side in your browser with zero rounding until display. It also supports cooking fractions (like 1/2, 2 1/2) and decimals.` },
        { q: `Can I convert ${toUnit.label} back to ${fromUnit.label}?`, a: `Yes! This is a two-way converter. Simply type a value in the ${toUnit.label} field and the ${fromUnit.label} result will update instantly.` }
      ];

      if (isKitchen) {
        faqData.push({
          q: `How do I convert 2 1/2 ${fromUnit.abbr} to ${toUnit.abbr}?`,
          a: `2 1/2 (2.5) ${fromUnit.label} equals ${formatNumber(getConversionValue(catKey, fromKey, toKey, 2.5, factor))} ${toUnit.label} (${toUnit.abbr}). You can also type "2 1/2" or "2.5" directly into the calculator above.`
        });
      }

      if (fromKey === 'meter' && toKey === 'inch') {
        faqData.push({
          q: 'What is 1.8 meters in feet and inches?',
          a: '1.80 meters is equal to 70.87 inches, which is approximately 5 feet 10.87 inches (often rounded to 5 feet 11 inches).'
        });
        faqData.push({
          q: 'How many inches are in a 2-meter door?',
          a: '2 meters is equal to 78.74 inches, which is approximately 6 feet 6.74 inches.'
        });
      } else if (fromKey === 'square_centimeter' && toKey === 'square_meter') {
        faqData.push({
          q: 'How do you convert cm² to m² quickly?',
          a: 'To convert square centimeters to square meters, divide by 10,000 (or multiply by 0.0001). For example, 50,000 cm² = 5 m².'
        });
      }

      // Generate visible FAQ section HTML
      const faqHtml = faqData.map((item, idx) => `
        <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
          <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">${item.q}</summary>
          <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">${item.a}</div>
        </details>
      `).join('');

      const calcBodyWithFaq = calcBody + `
        <div style="margin: 2.5rem 0; max-width: 850px;">
          <h2 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
          ${faqHtml}
        </div>
      `;

      let pageTitle = `${fromUnit.abbr} to ${toUnit.abbr}: Convert ${fromUnit.label} to ${toUnit.label} | Digital Tools Shed`;
      let pageMetaDesc = `Fast ${fromUnit.abbr} to ${toUnit.abbr} converter. 1 ${fromUnit.abbr} = ${oneUnitValue} ${toUnit.abbr}. Real-time two-way calculation, formulas, and conversion chart.`;

      if (fromKey === 'meter' && toKey === 'inch') {
        pageTitle = 'Meters to Inches (m to in) Converter & Height Chart | Digital Tools Shed';
        pageMetaDesc = 'Convert meters to inches instantly. 1 m = 39.370079 in. Free human height conversion chart (m to ft/in), exact formula, and two-way calculator.';
      } else if (fromKey === 'square_centimeter' && toKey === 'square_meter') {
        pageTitle = 'Square Centimeters to Square Meters (cm² to m²) | Digital Tools Shed';
        pageMetaDesc = 'Convert cm² to m² instantly. 1 cm² = 0.0001 m² (divide by 10,000). Real-time area calculation, step-by-step formula, and reference table.';
      } else if (fromKey === 'teaspoon' && toKey === 'milliliter') {
        pageTitle = 'Teaspoons to Milliliters (tsp to mL) Converter | Digital Tools Shed';
        pageMetaDesc = 'Convert tsp to mL. 1 tsp = 4.92892 mL (5 mL metric/medical). Instant two-way cooking and medicine dose calculator with fraction support.';
      } else if (fromKey === 'kilowatt_hour' && toKey === 'joule') {
        pageTitle = 'kWh to Joules (kWh to J) Energy Converter | Digital Tools Shed';
        pageMetaDesc = 'Convert kilowatt-hours to joules. 1 kWh = 3,600,000 J (3.6 MJ). Step-by-step physics formula, derivation, and energy comparison chart.';
      } else if (fromKey === 'milliliter' && toKey === 'cup') {
        pageTitle = 'mL to Cups: Convert Milliliters to Cups (Baking Chart) | Digital Tools Shed';
        pageMetaDesc = 'Convert mL to US cups. 1 mL = 0.004227 cups (236.59 mL per cup). Real-time baking fraction chart (1/4, 1/3, 1/2, 1 cup) and calculator.';
      } else if (catKey === 'volume' || isKitchen) {
        pageTitle = `${fromUnit.abbr} to ${toUnit.abbr}: Convert ${fromUnit.label} to ${toUnit.label} (Fraction Chart) | Digital Tools Shed`;
        pageMetaDesc = `Convert ${fromUnit.abbr} to ${toUnit.abbr} with cooking fractions (1/8, 1/4, 1/3, 1/2, 2 1/2). 1 ${fromUnit.abbr} = ${oneUnitValue} ${toUnit.abbr}. Free baking reference chart.`;
      } else if (catKey === 'energy') {
        pageTitle = `${fromUnit.abbr} to ${toUnit.abbr}: Convert ${fromUnit.label} to ${toUnit.label} (Formula) | Digital Tools Shed`;
        pageMetaDesc = `Convert ${fromUnit.abbr} to ${toUnit.abbr} instantly. 1 ${fromUnit.abbr} = ${oneUnitValue} ${toUnit.abbr}. Exact physics factor, conversion formula, and reference table.`;
      }

      const cleanSlug = fileName.replace(/\.html$/, '');

      writeFileSync(join(calcDist, fileName), renderPage({
        title: pageTitle,
        metaDesc: pageMetaDesc,
        canonical: `${DOMAIN}/calc/${cleanSlug}`,
        bodyContent: calcBodyWithFaq,
        currentPath: `/calc/${cleanSlug}`,
        faq: faqData
      }));

      totalCalcsBuilt++;
    }
  }

  console.log(`  ✓ Built & Styled ${totalCalcsBuilt} Unit Calculators with Workbench Theme and Adsterra Ads (/calc/)`);
}

// ─── TECH ARTICLES & BLUEPRINTS SUITE ──────────────────────────────────────

export { buildUnitCalcSuite };

