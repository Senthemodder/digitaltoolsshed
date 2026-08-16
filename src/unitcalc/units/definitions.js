/**
 * UnitCalc: Unit Definitions Database
 * Each category contains units with a conversion factor relative to a base unit.
 * The generator script creates one HTML page per pair.
 */
export const categories = {
  length: {
    label: 'Length',
    icon: '📏',
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
      micrometer:     { label: 'Micrometers',    abbr: 'μm',   factor: 0.000001 },
    }
  },
  weight: {
    label: 'Weight',
    icon: '⚖️',
    base: 'kilogram',
    units: {
      milligram: { label: 'Milligrams', abbr: 'mg',  factor: 0.000001 },
      gram:      { label: 'Grams',      abbr: 'g',   factor: 0.001 },
      kilogram:  { label: 'Kilograms',  abbr: 'kg',  factor: 1 },
      tonne:     { label: 'Tonnes',     abbr: 't',   factor: 1000 },
      ounce:     { label: 'Ounces',     abbr: 'oz',  factor: 0.0283495 },
      pound:     { label: 'Pounds',     abbr: 'lb',  factor: 0.453592 },
      stone:     { label: 'Stones',     abbr: 'st',  factor: 6.35029 },
    }
  },
  temperature: {
    label: 'Temperature',
    icon: '🌡️',
    base: 'celsius',
    custom: true, // uses formulas, not factors
    units: {
      celsius:    { label: 'Celsius',    abbr: '°C' },
      fahrenheit: { label: 'Fahrenheit', abbr: '°F' },
      kelvin:     { label: 'Kelvin',     abbr: 'K'  },
    }
  },
  volume: {
    label: 'Volume',
    icon: '🧪',
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
      fluid_oz:     { label: 'Fluid Ounces',  abbr: 'fl oz', factor: 0.0295735 },
    }
  },
  speed: {
    label: 'Speed',
    icon: '💨',
    base: 'meter_per_second',
    units: {
      meter_per_second:  { label: 'Meters/Second',     abbr: 'm/s',   factor: 1 },
      kilometer_per_hour:{ label: 'Kilometers/Hour',    abbr: 'km/h',  factor: 0.277778 },
      mile_per_hour:     { label: 'Miles/Hour',         abbr: 'mph',   factor: 0.44704 },
      knot:              { label: 'Knots',              abbr: 'kn',    factor: 0.514444 },
      foot_per_second:   { label: 'Feet/Second',        abbr: 'ft/s',  factor: 0.3048 },
    }
  },
  area: {
    label: 'Area',
    icon: '📐',
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
      square_mile:       { label: 'Square Miles',       abbr: 'mi²', factor: 2589988.11 },
    }
  },
  data: {
    label: 'Digital Storage',
    icon: '💾',
    base: 'byte',
    units: {
      bit:      { label: 'Bits',       abbr: 'b',   factor: 0.125 },
      byte:     { label: 'Bytes',      abbr: 'B',   factor: 1 },
      kilobyte: { label: 'Kilobytes',  abbr: 'KB',  factor: 1024 },
      megabyte: { label: 'Megabytes',  abbr: 'MB',  factor: 1048576 },
      gigabyte: { label: 'Gigabytes',  abbr: 'GB',  factor: 1073741824 },
      terabyte: { label: 'Terabytes',  abbr: 'TB',  factor: 1099511627776 },
      petabyte: { label: 'Petabytes',  abbr: 'PB',  factor: 1125899906842624 },
    }
  },
  time: {
    label: 'Time',
    icon: '⏱️',
    base: 'second',
    units: {
      millisecond: { label: 'Milliseconds', abbr: 'ms',  factor: 0.001 },
      second:      { label: 'Seconds',      abbr: 's',   factor: 1 },
      minute:      { label: 'Minutes',      abbr: 'min', factor: 60 },
      hour:        { label: 'Hours',        abbr: 'hr',  factor: 3600 },
      day:         { label: 'Days',         abbr: 'd',   factor: 86400 },
      week:        { label: 'Weeks',        abbr: 'wk',  factor: 604800 },
      month:       { label: 'Months',       abbr: 'mo',  factor: 2629800 },
      year:        { label: 'Years',        abbr: 'yr',  factor: 31557600 },
    }
  },
  energy: {
    label: 'Energy',
    icon: '⚡',
    base: 'joule',
    units: {
      joule:         { label: 'Joules',         abbr: 'J',    factor: 1 },
      kilojoule:     { label: 'Kilojoules',     abbr: 'kJ',   factor: 1000 },
      calorie:       { label: 'Calories',       abbr: 'cal',  factor: 4.184 },
      kilocalorie:   { label: 'Kilocalories',   abbr: 'kcal', factor: 4184 },
      watt_hour:     { label: 'Watt Hours',     abbr: 'Wh',   factor: 3600 },
      kilowatt_hour: { label: 'Kilowatt Hours', abbr: 'kWh',  factor: 3600000 },
      btu:           { label: 'BTU',            abbr: 'BTU',  factor: 1055.06 },
    }
  },
  pressure: {
    label: 'Pressure',
    icon: '🔧',
    base: 'pascal',
    units: {
      pascal:     { label: 'Pascals',     abbr: 'Pa',   factor: 1 },
      kilopascal: { label: 'Kilopascals', abbr: 'kPa',  factor: 1000 },
      bar:        { label: 'Bar',         abbr: 'bar',  factor: 100000 },
      psi:        { label: 'PSI',         abbr: 'psi',  factor: 6894.76 },
      atmosphere: { label: 'Atmospheres', abbr: 'atm',  factor: 101325 },
      torr:       { label: 'Torr',        abbr: 'Torr', factor: 133.322 },
    }
  }
};

// Temperature conversion formulas (not factor-based)
export const tempConvert = {
  celsius_to_fahrenheit: (v) => v * 9/5 + 32,
  fahrenheit_to_celsius: (v) => (v - 32) * 5/9,
  celsius_to_kelvin: (v) => v + 273.15,
  kelvin_to_celsius: (v) => v - 273.15,
  fahrenheit_to_kelvin: (v) => (v - 32) * 5/9 + 273.15,
  kelvin_to_fahrenheit: (v) => (v - 273.15) * 9/5 + 32,
};
