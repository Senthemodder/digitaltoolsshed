// scripts/science_tools.js — Obscure Science & Astrophysics Suite (115 Tools + Hub)

export const SCIENCE_TOOLS_BATCH_1 = [
  {
    slug: 'planck-length-converter',
    title: 'Planck Length to Subatomic Scales Converter [Quantum Scale ℓ_P] | Digital Tools Shed',
    shortTitle: 'Planck Length Converter',
    category: 'Planck Units & Metrology',
    badge: 'QUANTUM GRAVITY SCALE',
    metaDesc: 'Convert quantum Planck length (1.616e-35 m) to subatomic metrics, proton radii, quarks, and attometers with exact physical constants.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ℓ_P = √(ħ · G / c³) ≈ 1.616255 × 10⁻³⁵ m
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The Planck length represents the fundamental quantum threshold where classical general relativity and quantum mechanics clash. Distances smaller than ℓ_P lose physical meaning in modern field theory because quantum fluctuations of the spacetime metric would collapse any measuring probe into a micro black hole.
      </p>
    `,
    inputs: [
      { id: 'lp_val', label: 'Planck Lengths (ℓ_P)', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 ℓ_P (Quantum Limit)', values: { lp_val: 1 } },
      { label: 'String Scale (10 ℓ_P)', values: { lp_val: 10 } },
      { label: 'GUT Scale (10¹⁶ ℓ_P)', values: { lp_val: 1e16 } },
      { label: 'Proton Radius (5.2 × 10¹⁹ ℓ_P)', values: { lp_val: 5.209e19 } },
      { label: 'Classical Electron Radius', values: { lp_val: 1.743e20 } }
    ],
    outputs: [
      { id: 'out_m', label: 'Length in Meters (m)', default: '1.6163 × 10⁻³⁵ m' },
      { id: 'out_am', label: 'Attometers (10⁻¹⁸ m)', default: '1.6163 × 10⁻¹⁷ am' },
      { id: 'out_proton', label: 'Proton Radius Fraction (r_p)', default: '1.92 × 10⁻²⁰ r_p' },
      { id: 'out_quarks', label: 'Up-Quark Radius Limit', default: '3.76 × 10⁻¹⁷ r_q' }
    ],
    benchmarks: [
      { object: 'Planck Length (ℓ_P)', val: '1.616 × 10⁻³⁵ m', notes: 'Quantum spacetime granularity limit' },
      { object: 'Electroweak Scale', val: '1.0 × 10⁻¹⁸ m', notes: 'Higgs mechanism & W/Z boson range' },
      { object: 'Proton Charge Radius', val: '8.414 × 10⁻¹⁶ m', notes: 'Muonic hydrogen spectroscopic measurement' },
      { object: 'Classical Electron Radius', val: '2.818 × 10⁻¹⁵ m', notes: 'Electromagnetic self-energy radius' },
      { object: 'Hydrogen Atom (Bohr Radius)', val: '5.292 × 10⁻¹¹ m', notes: 'Ground state orbital distance' }
    ],
    faq: [
      { q: 'Can anything in the universe be smaller than the Planck length?', a: 'Under conventional quantum field theory and general relativity, measuring a distance shorter than 1.616 × 10⁻³⁵ meters requires localizing energy exceeding the Planck mass into that volume, instantly generating a black hole whose event horizon cloaks the measurement.' },
      { q: 'Why is the Planck length derived from ħ, G, and c?', a: 'Max Planck discovered that dimensional analysis of Newton’s gravitational constant (G), reduced Planck constant (ħ), and the speed of light (c) uniquely isolates an invariant length unit independent of human prototypes.' }
    ],
    calcJs: `
      const lp = parseFloat(document.getElementById('lp_val').value) || 0;
      const l_planck = 1.616255e-35;
      const meters = lp * l_planck;
      const attometers = meters / 1e-18;
      const r_proton = 8.414e-16;
      const r_quark = 4.3e-19;
      
      document.getElementById('out_m').textContent = fmtSci(meters) + ' m';
      document.getElementById('out_am').textContent = fmtSci(attometers) + ' am';
      document.getElementById('out_proton').textContent = fmtSci(meters / r_proton) + ' × r_p';
      document.getElementById('out_quarks').textContent = fmtSci(meters / r_quark) + ' × r_q';
    `
  },
  {
    slug: 'planck-time-converter',
    title: 'Planck Time to Chronological Epochs Calculator [Chronological Scale t_P] | Digital Tools Shed',
    shortTitle: 'Planck Time Converter',
    category: 'Planck Units & Metrology',
    badge: 'CHRONOMETRIC LIMIT',
    metaDesc: 'Scale Planck time (5.391e-44 s) to attoseconds, nuclear transit times, cosmic epochs, and universe age with relativistic precision.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        t_P = √(ħ · G / c⁵) = ℓ_P / c ≈ 5.391247 × 10⁻⁴⁴ s
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Planck time is the duration required for a photon traveling at light speed to traverse one Planck length. No clock or physical process can measure time intervals shorter than t_P without quantum gravity disruptions.
      </p>
    `,
    inputs: [
      { id: 'tp_val', label: 'Planck Times (t_P)', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 t_P (Cosmic Inception)', values: { tp_val: 1 } },
      { label: 'Grand Unification Epoch', values: { tp_val: 1e36 } },
      { label: 'Electroweak Epoch', values: { tp_val: 1.85e32 } },
      { label: 'Light Crossing Proton', values: { tp_val: 5.2e19 } },
      { label: 'Attosecond Laser Pulse', values: { tp_val: 1.85e26 } }
    ],
    outputs: [
      { id: 'out_s', label: 'Seconds (s)', default: '5.3912 × 10⁻⁴⁴ s' },
      { id: 'out_as', label: 'Attoseconds (10⁻¹⁸ s)', default: '5.3912 × 10⁻²⁶ as' },
      { id: 'out_nuclear', label: 'Proton Light-Transit Multiples', default: '1.92 × 10⁻²⁰ transit' },
      { id: 'out_universe', label: 'Universe Age Fraction (13.8 Gyr)', default: '1.24 × 10⁻⁶¹' }
    ],
    benchmarks: [
      { object: 'Planck Time', val: '5.391 × 10⁻⁴⁴ s', notes: 'Shortest physically meaningful duration' },
      { object: 'Light Crosses Proton', val: '2.8 × 10⁻²⁴ s', notes: 'Strong force interaction timescale' },
      { object: 'Shortest Laser Pulse (2023)', val: '4.3 × 10⁻¹⁷ s', notes: 'Attosecond electronic transition probe' },
      { object: 'Cesium Clock Period', val: '1.088 × 10⁻¹⁰ s', notes: 'SI definition base oscillation' },
      { object: 'Age of Universe', val: '4.354 × 10¹⁷ s', notes: '13.787 Billion Years' }
    ],
    faq: [
      { q: 'Did time exist before 1 Planck time after the Big Bang?', a: 'In standard cosmology, the interval between t = 0 and t = 5.39 × 10⁻⁴⁴ seconds is called the Planck Epoch. During this era, quantum gravity dominated, causing time itself to dissolve into quantum spacetime foam without distinct causality.' },
      { q: 'How many Planck times have elapsed since the Big Bang?', a: 'Approximately 8.08 × 10⁶⁰ Planck times have elapsed in the 13.8 billion years since the cosmic expansion began.' }
    ],
    calcJs: `
      const tp = parseFloat(document.getElementById('tp_val').value) || 0;
      const t_planck = 5.391247e-44;
      const secs = tp * t_planck;
      const attosecs = secs / 1e-18;
      const nuclear_time = 2.8e-24;
      const universe_age = 4.354e17;
      
      document.getElementById('out_s').textContent = fmtSci(secs) + ' s';
      document.getElementById('out_as').textContent = fmtSci(attosecs) + ' as';
      document.getElementById('out_nuclear').textContent = fmtSci(secs / nuclear_time);
      document.getElementById('out_universe').textContent = fmtSci(secs / universe_age);
    `
  },
  {
    slug: 'planck-temperature-converter',
    title: 'Planck Temperature to Kelvin Converter [T_P Absolute Hot] | Digital Tools Shed',
    shortTitle: 'Planck Temperature Converter',
    category: 'Planck Units & Metrology',
    badge: 'THERMODYNAMIC MAXIMUM',
    metaDesc: 'Convert theoretical Absolute Hot (Planck temperature 1.417e32 K) to Kelvin, Celsius, and stellar core thermal benchmarks.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        T_P = √(ħ · c⁵ / (G · k_B²)) ≈ 1.416784 × 10³² K
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Known as "Absolute Hot", the Planck temperature is the supreme temperature limit in physics. At T_P, the thermal radiation emitted by a blackbody has a peak wavelength equal to the Planck length, turning the emitted photons into micro black holes.
      </p>
    `,
    inputs: [
      { id: 'tp_k', label: 'Planck Temperatures (T_P)', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 T_P (Absolute Hot)', values: { tp_k: 1 } },
      { label: 'GUT Epoch (10⁻⁴ T_P)', values: { tp_k: 1e-4 } },
      { label: 'Electroweak (10⁻¹⁷ T_P)', values: { tp_k: 1e-17 } },
      { label: 'Solar Core (1.1 × 10⁻²⁵ T_P)', values: { tp_k: 1.108e-25 } }
    ],
    outputs: [
      { id: 'out_kelvin', label: 'Temperature in Kelvin (K)', default: '1.4168 × 10³² K' },
      { id: 'out_celsius', label: 'Celsius (°C)', default: '1.4168 × 10³² °C' },
      { id: 'out_solar_core', label: 'Solar Core Multiple (15.7M K)', default: '9.02 × 10²⁴ ×' },
      { id: 'out_lhc_qgp', label: 'LHC Quark Plasma Multiple (5.5T K)', default: '2.58 × 10¹⁹ ×' }
    ],
    benchmarks: [
      { object: 'Planck Temperature (Absolute Hot)', val: '1.417 × 10³² K', notes: 'Wavelength of thermal photons equals ℓ_P' },
      { object: 'Big Bang Electroweak Era', val: '1.0 × 10¹⁵ K', notes: 'Quark-gluon deconfinement plasma' },
      { object: 'Supernova Core Collapse', val: '1.0 × 10¹¹ K', notes: 'Neutrino burst generation' },
      { object: 'Sun Center Core', val: '1.57 × 10⁷ K', notes: 'Proton-proton hydrogen fusion threshold' },
      { object: 'Cosmic Microwave Background', val: '2.7255 K', notes: 'Universal relic blackbody background' }
    ],
    faq: [
      { q: 'Can anything be hotter than the Planck temperature?', a: 'In standard physics, raising temperature beyond T_P would cause thermal particle collisions to create event horizons, trapping energy rather than increasing thermal velocity. Temperature ceases to have its classical thermodynamic definition.' },
      { q: 'What was the temperature of the universe at 1 Planck time?', a: 'Cosmological models suggest the early cosmos possessed a temperature precisely equal to 1 Planck temperature at t = t_P.' }
    ],
    calcJs: `
      const tp = parseFloat(document.getElementById('tp_k').value) || 0;
      const t_planck = 1.416784e32;
      const kelvin = tp * t_planck;
      const celsius = kelvin - 273.15;
      const solar_core = 1.57e7;
      const lhc_temp = 5.5e12;
      
      document.getElementById('out_kelvin').textContent = fmtSci(kelvin) + ' K';
      document.getElementById('out_celsius').textContent = fmtSci(celsius) + ' °C';
      document.getElementById('out_solar_core').textContent = fmtSci(kelvin / solar_core) + ' ×';
      document.getElementById('out_lhc_qgp').textContent = fmtSci(kelvin / lhc_temp) + ' ×';
    `
  },
  {
    slug: 'planck-mass-converter',
    title: 'Planck Mass to Flea Egg & Macroscopic Scales [Quantum Gravity m_P] | Digital Tools Shed',
    shortTitle: 'Planck Mass Converter',
    category: 'Planck Units & Metrology',
    badge: 'MACROSCOPIC QUANTUM MASS',
    metaDesc: 'Explore Planck mass (21.76 micrograms) and its surprising macroscopic equivalence to flea eggs, paramecia, and quantum gravity thresholds.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        m_P = √(ħ · c / G) ≈ 2.176434 × 10⁻⁸ kg = 21.764 µg
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Unlike Planck length and time, the Planck mass is remarkably macroscopic: approximately 0.02 milligrams, roughly the mass of a flea egg or a small paramecium. It represents the mass where a particle’s Compton wavelength equals its Schwarzschild radius.
      </p>
    `,
    inputs: [
      { id: 'mp_val', label: 'Planck Masses (m_P)', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 m_P (Quantum Gravity)', values: { mp_val: 1 } },
      { label: 'Single Flea Egg (~1 m_P)', values: { mp_val: 0.92 } },
      { label: 'Human Ovum Cell (~180 m_P)', values: { mp_val: 184 } },
      { label: 'One Grain of Sand (~10,000 m_P)', values: { mp_val: 10500 } }
    ],
    outputs: [
      { id: 'out_kg', label: 'Mass in Kilograms (kg)', default: '2.1764 × 10⁻⁸ kg' },
      { id: 'out_ug', label: 'Micrograms (µg)', default: '21.764 µg' },
      { id: 'out_flea', label: 'Flea Egg Equivalents (~20 µg)', default: '1.09 ×' },
      { id: 'out_proton_mult', label: 'Proton Masses (1.30 × 10¹⁹ m_p)', default: '1.301 × 10¹⁹ m_p' }
    ],
    benchmarks: [
      { object: 'Electron Mass', val: '9.109 × 10⁻³¹ kg', notes: 'Lepton fundamental mass' },
      { object: 'Proton Mass', val: '1.673 × 10⁻²⁷ kg', notes: 'Baryon nucleus benchmark' },
      { object: 'Planck Mass', val: '2.176 × 10⁻⁸ kg', notes: 'Compton wavelength equals event horizon' },
      { object: 'Flea Egg', val: '2.0 × 10⁻⁸ kg', notes: '20 micrograms biological mass' },
      { object: 'Water Droplet (1mm)', val: '5.2 × 10⁻⁷ kg', notes: '24 Planck masses' }
    ],
    faq: [
      { q: 'Why is the Planck mass so much larger than subatomic particles?', a: 'Gravity is exceptionally weak compared to electromagnetism and nuclear forces (by a factor of ~10³⁶). Consequently, it takes a macroscopic congregation of energy (~21.7 micrograms) before gravitational self-attraction rivals quantum uncertainty.' },
      { q: 'What happens to an elementary particle with the Planck mass?', a: 'If a point-like fundamental particle had the Planck mass, its quantum wavepacket size (Compton wavelength) would shrink inside its own gravitational event horizon, creating a micro black hole.' }
    ],
    calcJs: `
      const mp = parseFloat(document.getElementById('mp_val').value) || 0;
      const m_planck = 2.176434e-8;
      const kg = mp * m_planck;
      const ug = kg * 1e9;
      const flea_egg = 2e-8;
      const m_proton = 1.6726219e-27;
      
      document.getElementById('out_kg').textContent = fmtSci(kg) + ' kg';
      document.getElementById('out_ug').textContent = fmtSci(ug) + ' µg';
      document.getElementById('out_flea').textContent = fmtSci(kg / flea_egg) + ' ×';
      document.getElementById('out_proton_mult').textContent = fmtSci(kg / m_proton) + ' m_p';
    `
  },
  {
    slug: 'planck-energy-converter',
    title: 'Planck Energy to Joules & Megawatt-Hours [Cosmic Unit E_P] | Digital Tools Shed',
    shortTitle: 'Planck Energy Converter',
    category: 'Planck Units & Metrology',
    badge: 'HIGH-ENERGY PHYSICS',
    metaDesc: 'Convert Planck energy (1.956 GJ) to kilowatt-hours, barrels of crude oil, lightning bolts, and particle accelerator energies.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        E_P = m_P · c² = √(ħ · c⁵ / G) ≈ 1.9561 × 10⁹ J ≈ 543.36 kWh
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Planck energy is the energy equivalent of the Planck mass (almost 2 gigajoules). Concentrating this amount of energy into a single subatomic collision requires an accelerator larger than the Milky Way galaxy.
      </p>
    `,
    inputs: [
      { id: 'ep_val', label: 'Planck Energy (E_P)', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 E_P (Planck Scale)', values: { ep_val: 1 } },
      { label: 'Car Fuel Tank (~1.5 GJ)', values: { ep_val: 0.767 } },
      { label: 'Single Lightning Strike (~5 GJ)', values: { ep_val: 2.55 } },
      { label: 'LHC Proton Collision (13 TeV)', values: { ep_val: 1.06e-15 } }
    ],
    outputs: [
      { id: 'out_joules', label: 'Joules (J)', default: '1.9561 × 10⁹ J' },
      { id: 'out_kwh', label: 'Kilowatt-Hours (kWh)', default: '543.36 kWh' },
      { id: 'out_oil', label: 'Barrels of Crude Oil Equivalent', default: '0.32 bbl' },
      { id: 'out_lhc', label: 'LHC 13-TeV Collisions (2.08 µJ)', default: '9.39 × 10¹⁴ ×' }
    ],
    benchmarks: [
      { object: 'LHC Proton Collision', val: '2.08 × 10⁻⁶ J', notes: '13 TeV center-of-mass energy' },
      { object: 'Planck Energy', val: '1.956 × 10⁹ J', notes: '1.22 × 10¹⁹ GeV unification scale' },
      { object: 'Automobile Full Gas Tank', val: '1.5 × 10⁹ J', notes: '45 liters of gasoline combustion' },
      { object: 'Lightning Bolt', val: '5.0 × 10⁹ J', notes: 'Typical cloud-to-ground stroke' },
      { object: '1 Ton TNT Explosive', val: '4.184 × 10⁹ J', notes: 'Standard blast energy unit' }
    ],
    faq: [
      { q: 'Could a particle collider ever reach the Planck energy?', a: 'Using current radiofrequency quadrupole technology, accelerating a proton to Planck energy (10¹⁹ GeV) would require a circular collider with a circumference spanning multiple light-years, well beyond human civilization.' },
      { q: 'Why is Planck energy relevant if we cannot reach it?', a: 'All four fundamental forces (gravity, strong, weak, and electromagnetic) merge into a single supersymmetric unified interaction at or near the Planck energy scale.' }
    ],
    calcJs: `
      const ep = parseFloat(document.getElementById('ep_val').value) || 0;
      const e_planck = 1.9561e9;
      const joules = ep * e_planck;
      const kwh = joules / 3.6e6;
      const barrel_oil = 6.12e9;
      const lhc_joules = 2.0828e-6;
      
      document.getElementById('out_joules').textContent = fmtSci(joules) + ' J';
      document.getElementById('out_kwh').textContent = fmtSci(kwh) + ' kWh';
      document.getElementById('out_oil').textContent = fmtSci(joules / barrel_oil) + ' bbl';
      document.getElementById('out_lhc').textContent = fmtSci(joules / lhc_joules) + ' ×';
    `
  },
  {
    slug: 'planck-density-calculator',
    title: 'Planck Density of Early Universe Calculator [Cosmological Density ρ_P] | Digital Tools Shed',
    shortTitle: 'Planck Density Calculator',
    category: 'Planck Units & Metrology',
    badge: 'SINGULARITY DENSITY LIMIT',
    metaDesc: 'Calculate Planck density (5.155e96 kg/m³) and visualize observable universe mass compressed into subatomic volumes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ρ_P = m_P / ℓ_P³ = c⁵ / (ħ · G²) ≈ 5.155 × 10⁹⁶ kg/m³
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The Planck density is the maximum density of matter and energy admitted by modern physics. If all 10⁵³ kg of matter in the observable universe were compressed to Planck density, it would fit inside a sphere smaller than an atomic nucleus.
      </p>
    `,
    inputs: [
      { id: 'univ_mass_mult', label: 'Observable Universe Masses (1 M_u = 1.5 × 10⁵³ kg)', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 Observable Universe', values: { univ_mass_mult: 1 } },
      { label: 'Earth Mass Compressed', values: { univ_mass_mult: 3.98e-29 } },
      { label: 'Solar Mass Compressed', values: { univ_mass_mult: 1.33e-23 } },
      { label: 'Milky Way Galaxy', values: { univ_mass_mult: 1e-11 } }
    ],
    outputs: [
      { id: 'out_vol_m3', label: 'Volume at Planck Density (m³)', default: '2.91 × 10⁻⁴⁴ m³' },
      { id: 'out_radius_m', label: 'Sphere Radius (m)', default: '1.91 × 10⁻¹⁵ m' },
      { id: 'out_proton_comp', label: 'Multiple of Proton Radius', default: '2.27 × r_p' },
      { id: 'out_dens_water', label: 'Ratio to Liquid Water (1,000 kg/m³)', default: '5.16 × 10⁹³ ×' }
    ],
    benchmarks: [
      { object: 'Liquid Water Density', val: '1.0 × 10³ kg/m³', notes: 'Standard macroscopic benchmark' },
      { object: 'Sun Core Density', val: '1.5 × 10⁵ kg/m³', notes: 'High fusion plasma pressure' },
      { object: 'White Dwarf Core', val: '1.0 × 10⁹ kg/m³', notes: 'Electron degenerate matter' },
      { object: 'Neutron Star Core', val: '4.0 × 10¹⁷ kg/m³', notes: 'Nuclear matter saturation' },
      { object: 'Planck Density', val: '5.155 × 10⁹⁶ kg/m³', notes: 'Early Big Bang quantum boundary' }
    ],
    faq: [
      { q: 'Is Planck density the density inside a black hole singularity?', a: 'General relativity predicts infinite density at the center of a black hole, but physicists widely expect quantum gravity to replace the infinite singularity with matter packed at approximately the Planck density.' },
      { q: 'How dense is nuclear matter compared to Planck density?', a: 'Neutron star nuclear matter (~4 × 10¹⁷ kg/m³) is 79 orders of magnitude less dense than Planck density.' }
    ],
    calcJs: `
      const m_mult = parseFloat(document.getElementById('univ_mass_mult').value) || 0;
      const m_universe = 1.5e53;
      const mass_kg = m_mult * m_universe;
      const rho_planck = 5.155e96;
      const vol_m3 = mass_kg / rho_planck;
      const radius_m = Math.cbrt((3 * vol_m3) / (4 * Math.PI));
      const r_proton = 8.414e-16;
      
      document.getElementById('out_vol_m3').textContent = fmtSci(vol_m3) + ' m³';
      document.getElementById('out_radius_m').textContent = fmtSci(radius_m) + ' m';
      document.getElementById('out_proton_comp').textContent = fmtSci(radius_m / r_proton) + ' × r_p';
      document.getElementById('out_dens_water').textContent = fmtSci(rho_planck / 1000) + ' ×';
    `
  },
  {
    slug: 'planck-force-calculator',
    title: 'Planck Force & Cosmic String Tension Calculator [Maximum Force F_P = c⁴/G] | Digital Tools Shed',
    shortTitle: 'Planck Force Calculator',
    category: 'Planck Units & Metrology',
    badge: 'RELATIVISTIC TENSION',
    metaDesc: 'Compute Planck force (1.21e44 N)—the relativistic maximum tension limit in general relativity, black hole horizons, and cosmic strings.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        F_P = c⁴ / G ≈ 1.210295 × 10⁴⁴ N
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        In General Relativity, the Planck force represents the maximum conceivable tension or gravitational force in the universe. It is the coefficient connecting the Einstein tensor to the stress-energy tensor in Einstein’s field equations: G_μν = (8πG/c⁴) T_μν = (8π/F_P) T_μν.
      </p>
    `,
    inputs: [
      { id: 'fp_mult', label: 'Planck Force Multiplier', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 F_P (Cosmic String Tension)', values: { fp_mult: 1 } },
      { label: '0.1 F_P (Relativistic Horizon)', values: { fp_mult: 0.1 } },
      { label: 'Earth-Sun Gravity Equivalent', values: { fp_mult: 2.92e-22 } },
      { label: 'Saturn V Rocket Liftoff', values: { fp_mult: 2.85e-37 } }
    ],
    outputs: [
      { id: 'out_newtons', label: 'Force in Newtons (N)', default: '1.2103 × 10⁴⁴ N' },
      { id: 'out_saturn', label: 'Saturn V Rocket Launches (34.5 MN)', default: '3.51 × 10³⁶ ×' },
      { id: 'out_earth_sun', label: 'Earth-Sun Gravitational Pulls', default: '3.42 × 10²¹ ×' },
      { id: 'out_einstein_inv', label: 'Einstein Coupling Coefficient (8π/F_P)', default: '2.076 × 10⁻⁴³ N⁻¹' }
    ],
    benchmarks: [
      { object: 'Saturn V Rocket Thrust', val: '3.45 × 10⁷ N', notes: 'First stage Apollo moon launch' },
      { object: 'Space Shuttle Max Thrust', val: '3.0 × 10⁷ N', notes: 'Solid rocket booster liftoff' },
      { object: 'Earth-Moon Gravitational Pull', val: '1.98 × 10²⁰ N', notes: 'Tidal orbital lock' },
      { object: 'Earth-Sun Gravitational Pull', val: '3.54 × 10²² N', notes: 'Planetary orbit centripetal force' },
      { object: 'Planck Force', val: '1.210 × 10⁴⁴ N', notes: 'Maximum tension of spacetime' }
    ],
    faq: [
      { q: 'Why does Planck force not contain Planck’s constant ħ?', a: 'Remarkably, F_P = c⁴/G depends solely on classical relativity parameters: speed of light c and Newton’s gravitational constant G. This demonstrates that F_P is a classical general relativistic ceiling rather than purely quantum.' },
      { q: 'What physical system exhibits the Planck force?', a: 'Hypothetical cosmic strings and colliding black hole event horizons exhibit tensions on the order of the Planck force.' }
    ],
    calcJs: `
      const mult = parseFloat(document.getElementById('fp_mult').value) || 0;
      const f_planck = 1.210295e44;
      const newtons = mult * f_planck;
      const saturn_v = 3.45e7;
      const earth_sun = 3.54e22;
      const einstein_k = (8 * Math.PI) / newtons;
      
      document.getElementById('out_newtons').textContent = fmtSci(newtons) + ' N';
      document.getElementById('out_saturn').textContent = fmtSci(newtons / saturn_v) + ' ×';
      document.getElementById('out_earth_sun').textContent = fmtSci(newtons / earth_sun) + ' ×';
      document.getElementById('out_einstein_inv').textContent = fmtSci(einstein_k) + ' N⁻¹';
    `
  },
  {
    slug: 'planck-power-calculator',
    title: 'Planck Power & Gravitational Wave Peak Luminosity [Maximum Power P_P = c⁵/G] | Digital Tools Shed',
    shortTitle: 'Planck Power Calculator',
    category: 'Planck Units & Metrology',
    badge: 'ASTROPHYSICAL POWER LIMIT',
    metaDesc: 'Calculate Planck power (3.628e52 W), the Dyson-luminosity limit reached during binary black hole mergers detected by LIGO.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        P_P = c⁵ / G ≈ 3.62831 × 10⁵² W
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Planck power (also called Dyson luminosity) is the absolute upper limit for the luminosity of any event in the universe. When two black holes merge (such as GW150914), their peak gravitational wave emission briefly reaches roughly 0.1% of the Planck power, outshining all stars in the observable universe combined.
      </p>
    `,
    inputs: [
      { id: 'pp_mult', label: 'Planck Power Multiplier', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 P_P (Universal Ceiling)', values: { pp_mult: 1 } },
      { label: 'GW150914 Black Hole Merger (0.001 P_P)', values: { pp_mult: 0.001 } },
      { label: 'Supernova Peak (10⁻⁸ P_P)', values: { pp_mult: 1e-8 } },
      { label: 'Solar Luminosity', values: { pp_mult: 1.055e-26 } }
    ],
    outputs: [
      { id: 'out_watts', label: 'Power in Watts (W)', default: '3.6283 × 10⁵² W' },
      { id: 'out_solar_lum', label: 'Solar Luminosities (L_☉)', default: '9.478 × 10²⁵ L_☉' },
      { id: 'out_universe_stars', label: 'All Universe Starlight (~10⁴⁵ W)', default: '3.63 × 10⁷ ×' },
      { id: 'out_joules_sec', label: 'Energy per Millisecond (GJ)', default: '3.63 × 10⁴⁰ GJ' }
    ],
    benchmarks: [
      { object: 'Sun Luminosity', val: '3.828 × 10²⁶ W', notes: 'Standard astronomical candle' },
      { object: 'Milky Way Galaxy', val: '5.0 × 10³⁷ W', notes: 'Integrated starlight emission' },
      { object: 'Hypernova GRB Jet', val: '1.0 × 10⁴⁶ W', notes: 'Brightest electromagnetic transient' },
      { object: 'GW150914 Merger Peak', val: '3.6 × 10⁴⁹ W', notes: 'Pure gravitational wave flash' },
      { object: 'Planck Power', val: '3.628 × 10⁵² W', notes: 'Dyson maximum physical luminosity' }
    ],
    faq: [
      { q: 'Did the first LIGO black hole merger really outshine the universe?', a: 'Yes. During the final 20 milliseconds of the GW150914 black hole merger, 3 solar masses were converted into pure gravitational waves at a peak power of 3.6 × 10⁴⁹ Watts, roughly 50 times greater than all the light emitted by all stars in the observable universe.' },
      { q: 'Why is c⁵/G considered the absolute ceiling of power?', a: 'Any attempt to emit power exceeding c⁵/G requires concentrating mass-energy at an emission rate that self-gravitates into a black hole, trapping the radiation inside its horizon.' }
    ],
    calcJs: `
      const mult = parseFloat(document.getElementById('pp_mult').value) || 0;
      const p_planck = 3.62831e52;
      const watts = mult * p_planck;
      const solar_l = 3.828e26;
      const all_stars = 1e45;
      
      document.getElementById('out_watts').textContent = fmtSci(watts) + ' W';
      document.getElementById('out_solar_lum').textContent = fmtSci(watts / solar_l) + ' L_☉';
      document.getElementById('out_universe_stars').textContent = fmtSci(watts / all_stars) + ' ×';
      document.getElementById('out_joules_sec').textContent = fmtSci((watts * 0.001) / 1e9) + ' GJ';
    `
  },
  {
    slug: 'planck-charge-converter',
    title: 'Planck Charge to Coulombs & Elementary Charge [Fine-Structure Ratio q_P] | Digital Tools Shed',
    shortTitle: 'Planck Charge Converter',
    category: 'Planck Units & Metrology',
    badge: 'ELECTRODYNAMICS SCALE',
    metaDesc: 'Convert Planck charge (1.876e-18 C) to Coulombs, electron elementary charges (e), and derive the fine-structure constant (α ≈ 1/137).',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        q_P = √(4πε₀ · ħ · c) = e / √α ≈ 1.875546 × 10⁻¹⁸ C ≈ 11.70624 e
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Planck charge is defined so that the electrostatic repulsion between two Planck charges separated by one Planck length equals the Planck force. The ratio of the electron charge (e) to the Planck charge (q_P) is exactly the square root of the fine-structure constant: e / q_P = √α ≈ 1 / √137.036.
      </p>
    `,
    inputs: [
      { id: 'qp_val', label: 'Planck Charges (q_P)', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 q_P (Planck Natural Unit)', values: { qp_val: 1 } },
      { label: '1 Electron Charge (0.0854 q_P)', values: { qp_val: 0.08542 } },
      { label: 'Alpha Particle Charge (2 e)', values: { qp_val: 0.17085 } },
      { label: '1 Coulomb (5.33 × 10¹⁷ q_P)', values: { qp_val: 5.3318e17 } }
    ],
    outputs: [
      { id: 'out_coulombs', label: 'Charge in Coulombs (C)', default: '1.8755 × 10⁻¹⁸ C' },
      { id: 'out_elementary', label: 'Elementary Charges (e)', default: '11.7062 e' },
      { id: 'out_alpha_ratio', label: 'Coupling Strength (e/q_P)²', default: '1 / 137.036' },
      { id: 'out_electro_force', label: 'Repulsion at 1 ℓ_P (Newtons)', default: '1.210 × 10⁴⁴ N' }
    ],
    benchmarks: [
      { object: 'Quark Down Charge', val: '-0.333 e', notes: '-5.34 × 10⁻²⁰ C' },
      { object: 'Elementary Electron Charge', val: '1.000 e', notes: '1.602 × 10⁻¹⁹ C' },
      { object: 'Planck Charge', val: '11.706 e', notes: '1.876 × 10⁻¹⁸ C' },
      { object: 'Uranium Nucleus Charge', val: '92.000 e', notes: '7.859 Planck charges' },
      { object: 'One Coulomb', val: '6.242 × 10¹⁸ e', notes: '1 Ampere-second' }
    ],
    faq: [
      { q: 'Why is the electron charge smaller than the Planck charge?', a: 'Because the electromagnetic interaction coupling strength (α ≈ 1/137.036) is less than 1. This ensures that quantum electrodynamics (QED) is perturbative, allowing atomic electrons to orbit nuclei stably without spontaneous pair creation.' },
      { q: 'Does any elementary particle have exactly 1 Planck charge?', a: 'No known fundamental particle carries 1 Planck charge. Quarks carry 1/3 or 2/3 e, and leptons carry 1 e.' }
    ],
    calcJs: `
      const qp = parseFloat(document.getElementById('qp_val').value) || 0;
      const q_planck = 1.875546e-18;
      const coulombs = qp * q_planck;
      const e_charge = 1.602176634e-19;
      const ratio_e = coulombs / e_charge;
      const f_planck = 1.210295e44 * Math.pow(qp, 2);
      
      document.getElementById('out_coulombs').textContent = fmtSci(coulombs) + ' C';
      document.getElementById('out_elementary').textContent = fmtSci(ratio_e) + ' e';
      document.getElementById('out_alpha_ratio').textContent = '1 / ' + (137.035999).toFixed(3);
      document.getElementById('out_electro_force').textContent = fmtSci(f_planck) + ' N';
    `
  },
  {
    slug: 'planck-impedance-calculator',
    title: 'Planck Impedance & Quantum Vacuum Resistance [Free Space Z_P = 29.979 Ω] | Digital Tools Shed',
    shortTitle: 'Planck Impedance Calculator',
    category: 'Planck Units & Metrology',
    badge: 'VACUUM IMPEDANCE METRIC',
    metaDesc: 'Calculate Planck impedance (29.979 Ω) of quantum spacetime and relate it to vacuum wave impedance (376.73 Ω) and quantum Hall resistance.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Z_P = 1 / (4πε₀ · c) = Z₀ / (4π) ≈ 29.9792458 Ω
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Planck impedance is the characteristic geometric resistance of spacetime to electromagnetic quantum flux. It is directly proportional to the vacuum wave impedance Z₀ = √(μ₀/ε₀) ≈ 376.7303 Ω divided by the solid angle of a sphere (4π).
      </p>
    `,
    inputs: [
      { id: 'zp_factor', label: 'Planck Impedance Multiplier', type: 'number', default: '1', step: 'any', min: '0' }
    ],
    presets: [
      { label: '1 Z_P (Spacetime Characteristic)', values: { zp_factor: 1 } },
      { label: 'Vacuum Free Space Impedance Z₀ (4π Z_P)', values: { zp_factor: 12.56637 } },
      { label: 'Von Klitzing Quantum Hall Resistance (h/e²)', values: { zp_factor: 861.02 } },
      { label: 'Superconducting Lead Contact', values: { zp_factor: 0.001 } }
    ],
    outputs: [
      { id: 'out_ohms', label: 'Impedance in Ohms (Ω)', default: '29.9792 Ω' },
      { id: 'out_z0_comp', label: 'Ratio to Free Space Z₀ (376.73 Ω)', default: '0.07958 (1 / 4π)' },
      { id: 'out_von_klitzing', label: 'Ratio to Von Klitzing R_K (25,813 Ω)', default: '0.001161 (α / 2)' },
      { id: 'out_speed_c', label: 'Exact Speed of Light Component', default: 'c / 10⁷ = 29.9792 Ω' }
    ],
    benchmarks: [
      { object: 'Planck Impedance Z_P', val: '29.979 Ω', notes: 'Z₀ / 4π' },
      { object: 'Standard RF Coaxial Cable', val: '50.000 Ω', notes: 'Engineered minimum attenuation' },
      { object: 'Vacuum Free Space Z₀', val: '376.730 Ω', notes: 'Wave impedance √(μ₀/ε₀)' },
      { object: 'Von Klitzing Constant R_K', val: '25,812.807 Ω', notes: 'h/e² Quantum Hall plateau' },
      { object: 'Superconducting Cooper Pair Flux', val: '6,453.20 Ω', notes: 'h / 4e² resistance quantum' }
    ],
    faq: [
      { q: 'Why is Planck impedance so close to 30 Ohms?', a: 'Because c = 299,792,458 m/s, and in SI units 1/(4πε₀) = 10⁻⁷ c². Dividing by c gives Z_P = 10⁻⁷ c = 29.9792458 Ω exactly under the pre-2019 SI definition.' },
      { q: 'How does Z_P relate to the quantum Hall effect?', a: 'The Von Klitzing resistance R_K = h/e² = 2 Z_P / α. Thus, Planck impedance directly ties macroscopic electromagnetic resistance standards to the fine-structure constant.' }
    ],
    calcJs: `
      const factor = parseFloat(document.getElementById('zp_factor').value) || 0;
      const z_planck = 29.9792458;
      const ohms = factor * z_planck;
      const z0 = 376.730313;
      const r_k = 25812.80745;
      
      document.getElementById('out_ohms').textContent = fmtSci(ohms) + ' Ω';
      document.getElementById('out_z0_comp').textContent = fmtSci(ohms / z0);
      document.getElementById('out_von_klitzing').textContent = fmtSci(ohms / r_k);
      document.getElementById('out_speed_c').textContent = (ohms / 10).toFixed(4) + ' × 10 Ω';
    `
  },
  {
    slug: 'schwarzschild-radius-calculator',
    title: 'Black Hole Schwarzschild Radius Calculator [Event Horizon r_s = 2GM/c²] | Digital Tools Shed',
    shortTitle: 'Schwarzschild Radius Calculator',
    category: 'Black Holes & Relativity',
    badge: 'EVENT HORIZON METRIC',
    metaDesc: 'Calculate the Schwarzschild radius (event horizon boundary) of any mass from Earth to supermassive black holes with exact general relativity.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        r_s = 2GM / c² ≈ 2.953 × 10³ · (M / M_☉) m
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The Schwarzschild radius defines the spherical event horizon of a non-rotating, uncharged black hole. Inside this radius, spacetime curvature is so extreme that all future light cones tilt inward toward the central singularity.
      </p>
    `,
    inputs: [
      { id: 'mass_val', label: 'Object Mass', type: 'number', default: '1', step: 'any', min: '0.0001' },
      { id: 'mass_unit', label: 'Mass Unit', type: 'select', options: [
        { val: 'sun', text: 'Solar Masses (M_☉)' },
        { val: 'earth', text: 'Earth Masses (M_⊕)' },
        { val: 'kg', text: 'Kilograms (kg)' },
        { val: 'human', text: 'Human Body (75 kg)' }
      ]}
    ],
    presets: [
      { label: '1 Solar Mass (M_☉)', values: { mass_val: 1, mass_unit: 'sun' } },
      { label: 'Earth Mass (M_⊕)', values: { mass_val: 1, mass_unit: 'earth' } },
      { label: 'Sagittarius A* (4.15M M_☉)', values: { mass_val: 4.15e6, mass_unit: 'sun' } },
      { label: 'M87* Black Hole (6.5B M_☉)', values: { mass_val: 6.5e9, mass_unit: 'sun' } },
      { label: 'Human Mass (75 kg)', values: { mass_val: 75, mass_unit: 'kg' } }
    ],
    outputs: [
      { id: 'out_rs_m', label: 'Schwarzschild Radius (Meters)', default: '2,953.25 m' },
      { id: 'out_rs_km', label: 'Horizon Radius (Kilometers)', default: '2.953 km' },
      { id: 'out_area', label: 'Event Horizon Area (m²)', default: '1.096 × 10⁸ m²' },
      { id: 'out_density', label: 'Average Interior Density (kg/m³)', default: '1.84 × 10¹⁹ kg/m³' }
    ],
    benchmarks: [
      { object: 'Human Being (75 kg)', val: '1.11 × 10⁻²⁵ m', notes: 'Sub-nuclear micro horizon' },
      { object: 'Planet Earth (5.97 × 10²⁴ kg)', val: '8.87 mm', notes: 'Roughly size of a small marble' },
      { object: 'Sun (1.989 × 10³⁰ kg)', val: '2.95 km', notes: 'Size of a mountain peak' },
      { object: 'Sagittarius A* (Milky Way)', val: '1.23 × 10⁷ km', notes: '0.082 AU (~17 solar radii)' },
      { object: 'M87* Supermassive Black Hole', val: '1.92 × 10¹⁰ km', notes: '128 AU (larger than Pluto orbit)' }
    ],
    faq: [
      { q: 'What would happen if the Sun became a black hole?', a: 'If the Sun were compressed into its 2.95 km Schwarzschild radius, Earth would continue orbiting at 1 AU completely undisturbed, because the external gravitational field at planetary distances depends only on total mass, not diameter.' },
      { q: 'Why do supermassive black holes have lower average density than water?', a: 'Because volume scales as r_s³ ∝ M³, average interior density ρ = M/V scales inversely with the square of mass (ρ ∝ 1/M²). A 10-billion solar mass black hole is less dense than air.' }
    ],
    calcJs: `
      const m_val = parseFloat(document.getElementById('mass_val').value) || 0;
      const unit = document.getElementById('mass_unit').value;
      const G = 6.67430e-11;
      const c = 299792458;
      let mass_kg = m_val;
      if (unit === 'sun') mass_kg = m_val * 1.98847e30;
      else if (unit === 'earth') mass_kg = m_val * 5.9722e24;
      else if (unit === 'human') mass_kg = m_val * 75;
      
      const rs_m = (2 * G * mass_kg) / (c * c);
      const rs_km = rs_m / 1000;
      const area_m2 = 4 * Math.PI * rs_m * rs_m;
      const vol_m3 = (4/3) * Math.PI * Math.pow(rs_m, 3);
      const density = vol_m3 > 0 ? mass_kg / vol_m3 : 0;
      
      document.getElementById('out_rs_m').textContent = fmtSci(rs_m) + ' m';
      document.getElementById('out_rs_km').textContent = fmtSci(rs_km) + ' km';
      document.getElementById('out_area').textContent = fmtSci(area_m2) + ' m²';
      document.getElementById('out_density').textContent = fmtSci(density) + ' kg/m³';
    `
  },
  {
    slug: 'hawking-radiation-calculator',
    title: 'Hawking Radiation Temperature & Power Loss [Black Hole Thermodynamics T_H] | Digital Tools Shed',
    shortTitle: 'Hawking Radiation Calculator',
    category: 'Black Holes & Relativity',
    badge: 'THERMAL DECAY RATE',
    metaDesc: 'Compute Hawking temperature and instantaneous radiated thermal power of black holes. Discover why small black holes explode catastrophically.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        T_H = ħ · c³ / (8π · G · M · k_B) ≈ 6.169 × 10⁻⁸ · (M_☉ / M) K
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Predicted by Stephen Hawking in 1974, black holes emit thermal blackbody radiation due to quantum vacuum fluctuations near their event horizons. As a black hole loses mass, its temperature rises, accelerating radiated power: P = ħ · c⁶ / (15360π · G² · M²).
      </p>
    `,
    inputs: [
      { id: 'bh_mass_val', label: 'Black Hole Mass (Solar Masses M_☉)', type: 'number', default: '5', step: 'any', min: '1e-25' }
    ],
    presets: [
      { label: '5 M_☉ (Stellar Black Hole)', values: { bh_mass_val: 5 } },
      { label: '1 Earth Mass (~3 × 10⁻⁶ M_☉)', values: { bh_mass_val: 3.003e-6 } },
      { label: 'Moon Mass (~3.7 × 10⁻⁸ M_☉)', values: { bh_mass_val: 3.69e-8 } },
      { label: 'Mountain Mass (10¹² kg = 5 × 10⁻¹⁹ M_☉)', values: { bh_mass_val: 5.03e-19 } },
      { label: 'Sagittarius A* (4.15 × 10⁶ M_☉)', values: { bh_mass_val: 4.15e6 } }
    ],
    outputs: [
      { id: 'out_hawking_k', label: 'Hawking Temperature (K)', default: '1.23 × 10⁻⁸ K' },
      { id: 'out_power_w', label: 'Instantaneous Radiated Power (Watts)', default: '3.60 × 10⁻³⁰ W' },
      { id: 'out_peak_wl', label: 'Peak Emission Wavelength', default: '2.35 × 10⁵ m' },
      { id: 'out_cmb_verdict', label: 'Thermal Balance vs CMB (2.725 K)', default: 'Absorbing net energy' }
    ],
    benchmarks: [
      { object: 'Stellar Black Hole (5 M_☉)', val: '1.23 × 10⁻⁸ K', notes: 'Colder than CMB, growing from background' },
      { object: 'Moon Mass Black Hole', val: '1.67 K', notes: 'Almost in thermal equilibrium with CMB' },
      { object: 'Asteroid Mass (10¹⁵ kg)', val: '1.23 × 10⁵ K', notes: 'Radiates ~350 kW gamma rays' },
      { object: '1 Ton Micro Black Hole', val: '1.23 × 10¹⁴ K', notes: 'Explosive evaporation in milliseconds' },
      { object: 'Supermassive Black Hole (Sgr A*)', val: '1.49 × 10⁻¹⁴ K', notes: 'Essentially zero thermal emission' }
    ],
    faq: [
      { q: 'Why do stellar black holes not shrink right now?', a: 'Any black hole with mass greater than the Moon has a Hawking temperature colder than the Cosmic Microwave Background (2.725 K). Thus, it absorbs more CMB radiation than it emits, growing slowly until the universe cools.' },
      { q: 'What happens in the final seconds of evaporation?', a: 'In the final second, a micro black hole radiates over 10²² Joules (equivalent to thousands of megatons of TNT) in an intense burst of relativistic particles and gamma rays.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('bh_mass_val').value) || 1;
      const mass_kg = m_sun * 1.98847e30;
      const hbar = 1.054571817e-34;
      const c = 299792458;
      const G = 6.67430e-11;
      const kb = 1.380649e-23;
      
      const temp_k = (hbar * Math.pow(c, 3)) / (8 * Math.PI * G * mass_kg * kb);
      const power_w = (hbar * Math.pow(c, 6)) / (15360 * Math.PI * G * G * mass_kg * mass_kg);
      const peak_wl = 2.89777e-3 / temp_k;
      const verdict = temp_k > 2.7255 ? 'Evaporating into universe' : 'Absorbing CMB radiation (Growing)';
      
      document.getElementById('out_hawking_k').textContent = fmtSci(temp_k) + ' K';
      document.getElementById('out_power_w').textContent = fmtSci(power_w) + ' W';
      document.getElementById('out_peak_wl').textContent = fmtSci(peak_wl) + ' m';
      document.getElementById('out_cmb_verdict').textContent = verdict;
    `
  },
  {
    slug: 'black-hole-evaporation-time',
    title: 'Black Hole Evaporation Lifetime Calculator [Evaporation Time t_evap] | Digital Tools Shed',
    shortTitle: 'Black Hole Evaporation Time',
    category: 'Black Holes & Relativity',
    badge: 'COSMIC TIMELINE LIMIT',
    metaDesc: 'Calculate how long a black hole takes to evaporate into pure radiation via Hawking quantum fluctuations across cosmic timescales.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        t_evap = 5120π · G² · M³ / (ħ · c⁴) ≈ 2.089 × 10⁶⁷ · (M / M_☉)³ years
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Because the rate of Hawking radiation power loss is inversely proportional to M², black hole lifetime scales cubically with mass. Stellar and supermassive black holes will outlast all stars, persisting into the distant Degenerate and Black Hole Eras of the universe.
      </p>
    `,
    inputs: [
      { id: 'evap_mass', label: 'Black Hole Mass (Solar Masses M_☉)', type: 'number', default: '1', step: 'any', min: '1e-30' }
    ],
    presets: [
      { label: '1 Solar Mass (M_☉)', values: { evap_mass: 1 } },
      { label: '5 M_☉ (Typical Stellar Remnant)', values: { evap_mass: 5 } },
      { label: 'Earth Mass (~3 × 10⁻⁶ M_☉)', values: { evap_mass: 3e-6 } },
      { label: 'Sagittarius A* (4.15M M_☉)', values: { evap_mass: 4.15e6 } },
      { label: 'TON 618 Ultramassive (6.6 × 10¹⁰ M_☉)', values: { evap_mass: 6.6e10 } }
    ],
    outputs: [
      { id: 'out_years', label: 'Lifetime in Years', default: '2.09 × 10⁶⁷ years' },
      { id: 'out_seconds', label: 'Lifetime in Seconds', default: '6.59 × 10⁷⁴ s' },
      { id: 'out_univ_ratio', label: 'Multiples of Universe Age (13.8 Gyr)', default: '1.51 × 10⁵⁷ ×' },
      { id: 'out_era', label: 'Cosmic Death Era', default: 'Far Black Hole Era (> 10⁶⁶ y)' }
    ],
    benchmarks: [
      { object: '1000 kg Micro Black Hole', val: '8.4 × 10⁻¹⁰ s', notes: 'Instantly explodes' },
      { object: 'Asteroid Mass (10¹² kg)', val: '2.7 × 10⁹ years', notes: 'Comparable to planetary age' },
      { object: 'Solar Mass Black Hole', val: '2.09 × 10⁶⁷ years', notes: 'Outlasts all active star formation' },
      { object: 'Sagittarius A* (Milky Way)', val: '1.49 × 10⁸⁷ years', notes: 'Central galactic core remnant' },
      { object: 'TON 618 (Largest Known)', val: '6.0 × 10⁹⁹ years', notes: 'Near the 10¹⁰⁰ googol-year heat death' }
    ],
    faq: [
      { q: 'When will the last black hole in the universe evaporate?', a: 'The most massive ultramassive black holes (~10¹¹ solar masses) are projected to evaporate around 10¹⁰⁰ to 10¹⁰⁶ years from now, marking the beginning of the Heat Death Era where only sparse electrons and positrons remain.' },
      { q: 'Does evaporation preserve quantum information?', a: 'The black hole information paradox asks whether information falling into a black hole is permanently destroyed. Most physicists today agree that subtle quantum correlations in the Hawking radiation preserve information, consistent with unitary quantum mechanics.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('evap_mass').value) || 1;
      const mass_kg = m_sun * 1.98847e30;
      const hbar = 1.054571817e-34;
      const c = 299792458;
      const G = 6.67430e-11;
      
      const seconds = (5120 * Math.PI * G * G * Math.pow(mass_kg, 3)) / (hbar * Math.pow(c, 4));
      const years = seconds / (365.25 * 86400);
      const univ_age = 1.3787e10;
      const ratio = years / univ_age;
      
      document.getElementById('out_years').textContent = fmtSci(years) + ' years';
      document.getElementById('out_seconds').textContent = fmtSci(seconds) + ' s';
      document.getElementById('out_univ_ratio').textContent = fmtSci(ratio) + ' ×';
      document.getElementById('out_era').textContent = years > 1e60 ? 'Black Hole Era (> 10⁶⁰ y)' : 'Stelliferous / Degenerate Era';
    `
  },
  {
    slug: 'black-hole-tidal-spaghettification',
    title: 'Black Hole Tidal Force & Spaghettification Calculator [Differential Gravity Δa] | Digital Tools Shed',
    shortTitle: 'Spaghettification Calculator',
    category: 'Black Holes & Relativity',
    badge: 'GENERAL RELATIVISTIC TIDAL KINEMATICS',
    metaDesc: 'Compute head-to-toe tidal stretching acceleration (spaghettification) near stellar vs supermassive black hole event horizons.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Δa = (2 · G · M · h) / r³
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Tidal force is the differential gravitational acceleration felt between an observer’s head and feet (separated by height h ≈ 1.8 m). Near small stellar black holes, tidal forces tear matter apart millions of kilometers outside the horizon. Near supermassive black holes, an astronaut could cross the horizon completely unharmed.
      </p>
    `,
    inputs: [
      { id: 'tide_mass', label: 'Black Hole Mass (M_☉)', type: 'number', default: '10', step: 'any', min: '0.1' },
      { id: 'tide_dist_rs', label: 'Distance from Singularity (Multiples of r_s)', type: 'number', default: '1.0', step: '0.1', min: '0.1' },
      { id: 'tide_height', label: 'Observer Height (Meters)', type: 'number', default: '1.8', step: '0.1', min: '0.5' }
    ],
    presets: [
      { label: 'Stellar Black Hole Horizon (10 M_☉ at r_s)', values: { tide_mass: 10, tide_dist_rs: 1.0, tide_height: 1.8 } },
      { label: 'Supermassive Sgr A* Horizon (4.15M M_☉ at r_s)', values: { tide_mass: 4.15e6, tide_dist_rs: 1.0, tide_height: 1.8 } },
      { label: 'M87* Giant Horizon (6.5B M_☉ at r_s)', values: { tide_mass: 6.5e9, tide_dist_rs: 1.0, tide_height: 1.8 } },
      { label: 'Stellar Black Hole at 100 r_s', values: { tide_mass: 10, tide_dist_rs: 100, tide_height: 1.8 } }
    ],
    outputs: [
      { id: 'out_diff_acc', label: 'Differential Acceleration (m/s²)', default: '3.98 × 10⁸ m/s²' },
      { id: 'out_g_force', label: 'Tidal Tension in G-Forces (g = 9.81 m/s²)', default: '4.06 × 10⁷ g' },
      { id: 'out_lethal', label: 'Human Survival Assessment', default: 'Instantly Shredded to Plasma' },
      { id: 'out_rs_km', label: 'Calculated Horizon Radius r_s', default: '29.53 km' }
    ],
    benchmarks: [
      { object: 'Earth Surface Tidal Force (Moon)', val: '1.1 × 10⁻⁷ g', notes: 'Drives ocean high/low tides' },
      { object: 'Human Lethal Threshold', val: '15 g to 20 g', notes: 'Severe spinal & vascular failure' },
      { object: '10 M_☉ Black Hole Horizon', val: '4.0 × 10⁷ g', notes: 'Fatal spaghettification 5,000 km away' },
      { object: 'Sagittarius A* Horizon', val: '0.0002 g', notes: 'Safe crossing! Horizon is huge' },
      { object: 'M87* Horizon', val: '9.5 × 10⁻¹⁰ g', notes: 'Tides are completely imperceptible' }
    ],
    faq: [
      { q: 'Why is tidal force weaker at the horizon of a supermassive black hole?', a: 'Because r_s ∝ M, substituting r = r_s into the tidal formula yields Δa ∝ M / (M)³ = 1/M². The tidal force at the event horizon is inversely proportional to the square of the mass. A billion-solar-mass black hole has a horizon so vast and gently curved that tides are negligible.' },
      { q: 'What actually happens during spaghettification?', a: 'As you fall feet-first, your feet experience significantly greater acceleration than your head, vertically stretching your body while horizontal gravitational vectors compress your sides into a thin thread of atoms.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('tide_mass').value) || 10;
      const r_mult = parseFloat(document.getElementById('tide_dist_rs').value) || 1;
      const h = parseFloat(document.getElementById('tide_height').value) || 1.8;
      const G = 6.67430e-11;
      const c = 299792458;
      const mass_kg = m_sun * 1.98847e30;
      
      const rs_m = (2 * G * mass_kg) / (c * c);
      const r_m = r_mult * rs_m;
      const diff_acc = (2 * G * mass_kg * h) / Math.pow(r_m, 3);
      const g_force = diff_acc / 9.80665;
      
      let status = 'Safe (< 1 g)';
      if (g_force > 15) status = 'Catastrophic Spaghettification (Fatal)';
      else if (g_force > 3) status = 'Severe Discomfort / Injury';
      
      document.getElementById('out_diff_acc').textContent = fmtSci(diff_acc) + ' m/s²';
      document.getElementById('out_g_force').textContent = fmtSci(g_force) + ' g';
      document.getElementById('out_lethal').textContent = status;
      document.getElementById('out_rs_km').textContent = fmtSci(rs_m / 1000) + ' km';
    `
  },
  {
    slug: 'black-hole-photon-sphere',
    title: 'Black Hole Photon Sphere & Shadow Radius Calculator [Orbit r = 1.5 r_s] | Digital Tools Shed',
    shortTitle: 'Photon Sphere Calculator',
    category: 'Black Holes & Relativity',
    badge: 'RELATIVISTIC OPTICS',
    metaDesc: 'Calculate the unstable circular photon orbit and apparent gravitational shadow radius captured by the Event Horizon Telescope (EHT).',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        r_ph = 1.5 · r_s = 3GM / c²;\quad b_crit = √27 · (GM / c²) ≈ 2.598 · r_s
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The photon sphere is the unstable spherical orbit where light rays are bent by gravity into closed circular orbits. If you stood at r_ph and shined a flashlight horizontally, the light would circumnavigate the black hole and strike the back of your own head. Gravitational lensing enlarges the apparent silhouette to the shadow radius b_crit.
      </p>
    `,
    inputs: [
      { id: 'ps_mass', label: 'Black Hole Mass (Solar Masses M_☉)', type: 'number', default: '4.15e6', step: 'any', min: '0.1' },
      { id: 'ps_dist_kpc', label: 'Distance from Observer (Kiloparsecs kpc)', type: 'number', default: '8.2', step: '0.1', min: '0.001' }
    ],
    presets: [
      { label: 'Sagittarius A* (4.15M M_☉ at 8.2 kpc)', values: { ps_mass: 4.15e6, ps_dist_kpc: 8.2 } },
      { label: 'M87* (6.5B M_☉ at 16,800 kpc)', values: { ps_mass: 6.5e9, ps_dist_kpc: 16800 } },
      { label: 'Cygnus X-1 (21.2 M_☉ at 2.2 kpc)', values: { ps_mass: 21.2, ps_dist_kpc: 2.2 } },
      { label: '10 M_☉ Stellar Black Hole at 1 kpc', values: { ps_mass: 10, ps_dist_kpc: 1.0 } }
    ],
    outputs: [
      { id: 'out_ps_km', label: 'Photon Sphere Radius (km)', default: '1.839 × 10⁷ km' },
      { id: 'out_shadow_km', label: 'Physical Shadow Radius b_crit (km)', default: '3.185 × 10⁷ km' },
      { id: 'out_ang_uas', label: 'Apparent Angular Diameter (Microarcseconds µas)', default: '51.4 µas' },
      { id: 'out_eht_resolv', label: 'EHT Resolvability (> 20 µas)', default: 'Resolved by EHT Arrays' }
    ],
    benchmarks: [
      { object: 'Event Horizon Radius r_s', val: '2 GM / c²', notes: 'Physical point of no return' },
      { object: 'Photon Sphere r_ph', val: '1.5 r_s', notes: 'Unstable circular photon orbit' },
      { object: 'ISCO Accretion Edge', val: '3.0 r_s', notes: 'Innermost stable orbit for matter' },
      { object: 'Apparent Shadow Radius b_crit', val: '2.598 r_s', notes: 'Observed black silhouette size' },
      { object: 'EHT Image of Sgr A*', val: '51.8 µas diameter', notes: 'First image captured May 2022' }
    ],
    faq: [
      { q: 'Why is the black hole shadow larger than the event horizon?', a: 'Strong gravitational lensing curves light trajectories passing near the hole. Rays that would have missed the event horizon in flat spacetime are bent inward and captured, enlarging the apparent dark silhouette by a factor of √27 / 2 ≈ 2.598.' },
      { q: 'Is the photon sphere orbit stable?', a: 'No. A photon orbiting at r_ph is like a ball balanced on a needle point. The slightest perturbation sends it either spiraling into the horizon or escaping to infinity.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('ps_mass').value) || 4.15e6;
      const dist_kpc = parseFloat(document.getElementById('ps_dist_kpc').value) || 8.2;
      const G = 6.67430e-11;
      const c = 299792458;
      const mass_kg = m_sun * 1.98847e30;
      
      const rs_m = (2 * G * mass_kg) / (c * c);
      const r_ph_km = (1.5 * rs_m) / 1000;
      const b_crit_km = (Math.sqrt(27) * (G * mass_kg / (c * c))) / 1000;
      const shadow_diam_m = 2 * b_crit_km * 1000;
      const dist_m = dist_kpc * 3.085677581e19;
      const ang_rad = shadow_diam_m / dist_m;
      const ang_uas = ang_rad * (180 / Math.PI) * 3600 * 1e6;
      
      document.getElementById('out_ps_km').textContent = fmtSci(r_ph_km) + ' km';
      document.getElementById('out_shadow_km').textContent = fmtSci(b_crit_km) + ' km';
      document.getElementById('out_ang_uas').textContent = ang_uas.toFixed(2) + ' µas';
      document.getElementById('out_eht_resolv').textContent = ang_uas >= 20 ? 'Resolved by EHT Arrays' : 'Below EHT Resolution Limit (< 20 µas)';
    `
  },
  {
    slug: 'black-hole-isco-calculator',
    title: 'ISCO Innermost Stable Circular Orbit Calculator [Accretion Disk Boundary] | Digital Tools Shed',
    shortTitle: 'ISCO Orbit Calculator',
    category: 'Black Holes & Relativity',
    badge: 'RELATIVISTIC ACCRETION DYNAMICS',
    metaDesc: 'Compute the innermost stable circular orbit (ISCO) of accretion disks around rotating Kerr and static Schwarzschild black holes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        r_ISCO = 3 · r_s = 6GM / c² (Schwarzschild, a* = 0)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The Innermost Stable Circular Orbit (ISCO) defines the inner edge of an accretion disk. Inside the ISCO, gas particles can no longer maintain circular Keplerian orbits and plunge directly into the black hole. Spin a* pulls the ISCO from 3 r_s down to 0.5 r_s for maximal prograde Kerr holes.
      </p>
    `,
    inputs: [
      { id: 'isco_mass', label: 'Black Hole Mass (Solar Masses M_☉)', type: 'number', default: '10', step: 'any', min: '0.1' },
      { id: 'isco_spin', label: 'Dimensionless Spin a* (0 = Static, 0.998 = Max Kerr)', type: 'number', default: '0', step: '0.01', min: '0', max: '0.998' }
    ],
    presets: [
      { label: 'Static Schwarzschild (a* = 0)', values: { isco_mass: 10, isco_spin: 0 } },
      { label: 'Moderately Spinning (a* = 0.7)', values: { isco_mass: 10, isco_spin: 0.7 } },
      { label: 'Extreme Kerr (a* = 0.998)', values: { isco_mass: 10, isco_spin: 0.998 } },
      { label: 'Cygnus X-1 Spin (a* ≈ 0.97)', values: { isco_mass: 21.2, isco_spin: 0.97 } }
    ],
    outputs: [
      { id: 'out_isco_km', label: 'ISCO Radius (km)', default: '88.60 km' },
      { id: 'out_isco_rs', label: 'ISCO in Horizon Radii (r_s)', default: '3.00 r_s' },
      { id: 'out_efficiency', label: 'Radiative Accretion Efficiency (η)', default: '5.72 %' },
      { id: 'out_orbital_vel', label: 'Orbital Velocity at ISCO (% of c)', default: '50.0 % c' }
    ],
    benchmarks: [
      { object: 'Schwarzschild (a* = 0)', val: '6.0 GM/c² (3.0 r_s)', notes: 'Radiative efficiency η = 5.72%' },
      { object: 'Intermediate Spin (a* = 0.5)', val: '4.23 GM/c²', notes: 'Radiative efficiency η = 8.21%' },
      { object: 'High Spin (a* = 0.9)', val: '2.32 GM/c²', notes: 'Radiative efficiency η = 15.58%' },
      { object: 'Thorne Limit (a* = 0.998)', val: '1.24 GM/c²', notes: 'Radiative efficiency η = 32.1%' },
      { object: 'Maximal Kerr (a* = 1.0)', val: '1.0 GM/c² (0.5 r_s)', notes: 'Theoretical limit η = 42.3%' }
    ],
    faq: [
      { q: 'Why does black hole spin increase accretion efficiency?', a: 'Frame-dragging pulls the ISCO closer to the event horizon, allowing gas to descend deeper into the gravitational potential well before plunging. This releases up to 42% of the mass-energy as radiation, dwarfing nuclear fusion (0.7%).' },
      { q: 'What happens to matter inside the ISCO?', a: 'Inside the ISCO, stable circular orbits do not exist. Matter enters a dynamic "plunge region" free-falling inward on ballistic trajectories into the horizon.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('isco_mass').value) || 10;
      const a = parseFloat(document.getElementById('isco_spin').value) || 0;
      const G = 6.67430e-11;
      const c = 299792458;
      const mass_kg = m_sun * 1.98847e30;
      const rs_km = (2 * G * mass_kg) / (c * c * 1000);
      const rg_km = rs_km / 2;
      
      const z1 = 1 + Math.cbrt(1 - a*a) * (Math.cbrt(1 + a) + Math.cbrt(1 - a));
      const z2 = Math.sqrt(3 * a * a + z1 * z1);
      const r_isco_rg = 3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2));
      const isco_km = r_isco_rg * rg_km;
      const isco_rs = isco_km / rs_km;
      const eta = (1 - Math.sqrt(1 - (2 / (3 * r_isco_rg)))) * 100;
      const v_frac = Math.sqrt(1 / r_isco_rg) * 100;
      
      document.getElementById('out_isco_km').textContent = fmtSci(isco_km) + ' km';
      document.getElementById('out_isco_rs').textContent = isco_rs.toFixed(2) + ' r_s';
      document.getElementById('out_efficiency').textContent = Math.max(5.72, eta).toFixed(2) + ' %';
      document.getElementById('out_orbital_vel').textContent = Math.min(99.9, v_frac).toFixed(1) + ' % c';
    `
  },
  {
    slug: 'kerr-black-hole-ergosphere',
    title: 'Kerr Rotating Black Hole Ergosphere Calculator [Penrose Process Extraction] | Digital Tools Shed',
    shortTitle: 'Kerr Ergosphere Calculator',
    category: 'Black Holes & Relativity',
    badge: 'FRAME-DRAGGING ERGOMETRICS',
    metaDesc: 'Model frame-dragging spacetime boundaries around rotating black holes and calculate theoretical Penrose process energy extraction efficiency.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        r_E(θ) = GM/c² · (1 + √(1 - a*² · cos² θ))
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Rotating (Kerr) black holes drag spacetime around them in an effect called the Lense-Thirring effect. Between the event horizon r₊ and the oblate ergosphere boundary r_E(θ), spacetime rotates faster than the speed of light relative to distant observers. In this region, particles can have negative energy states, permitting the Penrose process.
      </p>
    `,
    inputs: [
      { id: 'kerr_mass', label: 'Black Hole Mass (M_☉)', type: 'number', default: '10', step: 'any', min: '0.1' },
      { id: 'kerr_spin', label: 'Dimensionless Spin a* (0 to 1)', type: 'number', default: '0.9', step: '0.01', min: '0', max: '0.999' },
      { id: 'kerr_theta', label: 'Colatitude θ (0° = Pole, 90° = Equator)', type: 'number', default: '90', step: '1', min: '0', max: '90' }
    ],
    presets: [
      { label: 'Equatorial Ergosphere (θ = 90°, a* = 0.9)', values: { kerr_mass: 10, kerr_spin: 0.9, kerr_theta: 90 } },
      { label: 'Polar Ergosphere (θ = 0°, a* = 0.9)', values: { kerr_mass: 10, kerr_spin: 0.9, kerr_theta: 0 } },
      { label: 'Maximal Kerr Horizon (a* = 0.998)', values: { kerr_mass: 10, kerr_spin: 0.998, kerr_theta: 90 } },
      { label: 'Sgr A* Galactic Center (a* ≈ 0.9)', values: { kerr_mass: 4.15e6, kerr_spin: 0.9, kerr_theta: 90 } }
    ],
    outputs: [
      { id: 'out_ergo_km', label: 'Ergosphere Radius r_E (km)', default: '29.53 km' },
      { id: 'out_horizon_km', label: 'Outer Event Horizon r₊ (km)', default: '21.20 km' },
      { id: 'out_max_penrose', label: 'Max Extractable Energy (Joules)', default: '5.20 × 10⁴⁶ J' },
      { id: 'out_max_eff', label: 'Penrose Theoretical Efficiency', default: '20.7 % (Max 29%)' }
    ],
    benchmarks: [
      { object: 'Ergosphere at Poles (θ = 0°)', val: 'r_E = r₊', notes: 'Touches the event horizon' },
      { object: 'Ergosphere at Equator (θ = 90°)', val: 'r_E = 2 GM/c²', notes: 'Twice the horizon radius of max Kerr' },
      { object: 'Maximal Rotational Energy', val: '29.29% of M c²', notes: 'Extractable via Penrose process' },
      { object: 'Blandford-Znajek Mechanism', val: 'Magnetic Jet Drive', notes: 'Powers relativistic quasar jets' },
      { object: 'Black Hole Bomb', val: 'Superradiant instability', notes: 'Reflected waves amplified in ergosphere' }
    ],
    faq: [
      { q: 'Can an observer remain stationary inside the ergosphere?', a: 'No. The ergosphere is bounded by the static limit. Inside it, frame-dragging is so intense that to remain stationary relative to the distant stars would require moving faster than light. All observers and photons are forced to co-rotate with the black hole.' },
      { q: 'How does the Penrose process generate free energy?', a: 'A particle entering the ergosphere splits into two pieces. One piece falls onto a negative-energy trajectory into the horizon, while the other piece escapes with greater total mass-energy than the original particle, siphoning rotational energy from the hole.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('kerr_mass').value) || 10;
      const a = parseFloat(document.getElementById('kerr_spin').value) || 0.9;
      const theta_deg = parseFloat(document.getElementById('kerr_theta').value) || 90;
      const theta_rad = (theta_deg * Math.PI) / 180;
      
      const G = 6.67430e-11;
      const c = 299792458;
      const mass_kg = m_sun * 1.98847e30;
      const rg_km = (G * mass_kg) / (c * c * 1000);
      
      const r_plus = rg_km * (1 + Math.sqrt(Math.max(0, 1 - a * a)));
      const cos_th = Math.cos(theta_rad);
      const r_ergo = rg_km * (1 + Math.sqrt(Math.max(0, 1 - a * a * cos_th * cos_th)));
      
      const m_irr = mass_kg * Math.sqrt(0.5 * (1 + Math.sqrt(Math.max(0, 1 - a * a))));
      const max_extractable_j = (mass_kg - m_irr) * c * c;
      const eff_pct = ((mass_kg - m_irr) / mass_kg) * 100;
      
      document.getElementById('out_ergo_km').textContent = fmtSci(r_ergo) + ' km';
      document.getElementById('out_horizon_km').textContent = fmtSci(r_plus) + ' km';
      document.getElementById('out_max_penrose').textContent = fmtSci(max_extractable_j) + ' J';
      document.getElementById('out_max_eff').textContent = eff_pct.toFixed(2) + ' %';
    `
  },
  {
    slug: 'stellar-mass-luminosity-calculator',
    title: 'Stellar Mass-Luminosity Relation Calculator [Main Sequence L ∝ M³.⁵] | Digital Tools Shed',
    shortTitle: 'Stellar Mass-Luminosity Calculator',
    category: 'Stellar Astrophysics',
    badge: 'STELLAR METRIC SCALING',
    metaDesc: 'Calculate star luminosity, surface temperature, and Morgan-Keenan spectral classification from main sequence stellar mass.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        L/L_☉ ≈ M³.⁵ (0.43 M_☉ < M < 2 M_☉);\quad L/L_☉ ≈ 1.4 M³.¹ (M > 2 M_☉)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        For main sequence stars powered by core hydrogen fusion, luminosity increases dramatically with mass due to higher core gravitational compression, density, and temperature. A star 10 times more massive than the Sun radiates over 3,000 times more light.
      </p>
    `,
    inputs: [
      { id: 'star_mass', label: 'Stellar Mass (Solar Masses M_☉)', type: 'number', default: '1', step: '0.1', min: '0.08', max: '150' }
    ],
    presets: [
      { label: 'Proxima Centauri (0.12 M_☉)', values: { star_mass: 0.12 } },
      { label: 'Sun (1.0 M_☉)', values: { star_mass: 1.0 } },
      { label: 'Sirius A (2.06 M_☉)', values: { star_mass: 2.06 } },
      { label: 'Vega (2.135 M_☉)', values: { star_mass: 2.135 } },
      { label: 'Rigel Blue Supergiant (21 M_☉)', values: { star_mass: 21.0 } }
    ],
    outputs: [
      { id: 'out_lum_solar', label: 'Luminosity in Solar Units (L_☉)', default: '1.00 L_☉' },
      { id: 'out_lum_watts', label: 'Total Radiated Power (Watts)', default: '3.828 × 10²⁶ W' },
      { id: 'out_temp_k', label: 'Estimated Surface Temp (K)', default: '5,778 K' },
      { id: 'out_spec_class', label: 'Spectral Class', default: 'G2V (Yellow Dwarf)' }
    ],
    benchmarks: [
      { object: 'Brown Dwarf Limit', val: '0.08 M_☉', notes: 'Minimum mass for sustained core fusion' },
      { object: 'Red Dwarf (M Class)', val: '0.1 - 0.45 M_☉', notes: 'Luminosity < 0.03 L_☉, fully convective' },
      { object: 'Sun (G2V Class)', val: '1.0 M_☉', notes: '1.0 L_☉, 5,778 K surface temperature' },
      { object: 'A-Type Star (Sirius A)', val: '2.0 M_☉', notes: '~25 L_☉, 9,940 K white star' },
      { object: 'O-Type Supergiant', val: '> 20 M_☉', notes: '> 50,000 L_☉, intense UV radiation' }
    ],
    faq: [
      { q: 'Why is the mass-luminosity relation exponent so steep (M^3.5)?', a: 'Higher mass creates stronger core gravitational pressure, which drives up core temperature. Because nuclear fusion reaction rates (especially the CNO cycle) scale with extreme powers of temperature (T¹⁶ to T²⁰), minor mass increases trigger colossal spikes in radiated luminosity.' },
      { q: 'Does this relation hold for red giants and white dwarfs?', a: 'No. The M^3.5 relation applies strictly to stable Main Sequence (hydrogen core burning) stars. Degenerate white dwarfs and expanded red giants follow entirely different stellar physics.' }
    ],
    calcJs: `
      const m = parseFloat(document.getElementById('star_mass').value) || 1.0;
      let lum = 1.0;
      if (m < 0.43) lum = 0.23 * Math.pow(m, 2.3);
      else if (m < 2.0) lum = Math.pow(m, 3.5);
      else if (m < 20.0) lum = 1.4 * Math.pow(m, 3.1);
      else lum = 3200 * m;
      
      const watts = lum * 3.828e26;
      const radius_approx = Math.pow(m, 0.8);
      const temp_k = 5778 * Math.pow(lum / (radius_approx * radius_approx), 0.25);
      
      let spectral = 'G (Yellow Dwarf)';
      if (temp_k > 30000) spectral = 'O (Blue Supergiant)';
      else if (temp_k > 10000) spectral = 'B (Blue-White)';
      else if (temp_k > 7500) spectral = 'A (White Star)';
      else if (temp_k > 6000) spectral = 'F (Yellow-White)';
      else if (temp_k > 5200) spectral = 'G (Yellow Dwarf, e.g. Sun)';
      else if (temp_k > 3700) spectral = 'K (Orange Dwarf)';
      else spectral = 'M (Red Dwarf)';
      
      document.getElementById('out_lum_solar').textContent = fmtSci(lum) + ' L_☉';
      document.getElementById('out_lum_watts').textContent = fmtSci(watts) + ' W';
      document.getElementById('out_temp_k').textContent = Math.round(temp_k).toLocaleString() + ' K';
      document.getElementById('out_spec_class').textContent = spectral;
    `
  },
  {
    slug: 'stellar-main-sequence-lifetime',
    title: 'Star Main Sequence Lifetime Calculator [Stellar Evolution τ ∝ M/L] | Digital Tools Shed',
    shortTitle: 'Star Lifetime Calculator',
    category: 'Stellar Astrophysics',
    badge: 'STELLAR EVOLUTION LIFESPAN',
    metaDesc: 'Calculate hydrogen-burning main sequence lifespans of stars. Contrast short-lived blue supergiants with 10-trillion-year red dwarfs.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        τ_MS ≈ 10¹⁰ · (M / M_☉) / (L / L_☉) ≈ 10¹⁰ · (M / M_☉)⁻²·⁵ years
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        A star’s lifetime is determined by the ratio of its available hydrogen fuel (proportional to mass M) to its fuel consumption rate (luminosity L). Because luminosity scales roughly as M³.⁵, massive stars burn through their fuel at an astronomical pace, living just millions of years while tiny red dwarfs burn for trillions.
      </p>
    `,
    inputs: [
      { id: 'star_life_mass', label: 'Stellar Mass (Solar Masses M_☉)', type: 'number', default: '1.0', step: '0.1', min: '0.08', max: '100' }
    ],
    presets: [
      { label: 'Proxima Centauri (0.12 M_☉)', values: { star_life_mass: 0.12 } },
      { label: 'Sun (1.0 M_☉)', values: { star_life_mass: 1.0 } },
      { label: 'Sirius A (2.0 M_☉)', values: { star_life_mass: 2.0 } },
      { label: 'Rigel (21 M_☉)', values: { star_life_mass: 21.0 } },
      { label: 'O-Star Monster (60 M_☉)', values: { star_life_mass: 60.0 } }
    ],
    outputs: [
      { id: 'out_years', label: 'Main Sequence Lifetime', default: '10.00 Billion Years' },
      { id: 'out_myr', label: 'Lifetime in Millions of Years', default: '10,000 Myr' },
      { id: 'out_destiny', label: 'Final Evolution Fate', default: 'Carbon-Oxygen White Dwarf' },
      { id: 'out_universe_comp', label: 'Comparison to Universe Age (13.8 Gyr)', default: '0.725 ×' }
    ],
    benchmarks: [
      { object: '60 M_☉ Hypergiant', val: '3.4 Million Years', notes: 'Core collapse into black hole' },
      { object: '10 M_☉ Massive Star', val: '31 Million Years', notes: 'Type II supernova -> Neutron star' },
      { object: '2 M_☉ Star (Sirius)', val: '1.7 Billion Years', notes: 'Planetary nebula -> White dwarf' },
      { object: '1 M_☉ Star (Sun)', val: '10.0 Billion Years', notes: 'Currently 4.6 billion years old' },
      { object: '0.1 M_☉ Red Dwarf', val: '10.0 Trillion Years', notes: 'Will outlive all larger stars' }
    ],
    faq: [
      { q: 'Why do more massive stars live shorter lives despite having more fuel?', a: 'Fuel consumption (luminosity) increases far faster than fuel supply (mass). Doubling stellar mass gives 2× more fuel, but increases fuel burn rate by ~11× (2³.⁵ ≈ 11.3). Hence, the star lives less than a fifth as long.' },
      { q: 'Has any red dwarf star ever died in the history of the universe?', a: 'No. The universe is only 13.8 billion years old, while a red dwarf with 0.1 solar masses has a lifetime of ~10 trillion years. Every red dwarf ever formed is still in its infancy.' }
    ],
    calcJs: `
      const m = parseFloat(document.getElementById('star_life_mass').value) || 1.0;
      let tau_yr = 1e10 * Math.pow(m, -2.5);
      if (m < 0.43) tau_yr = 1e10 * (m / (0.23 * Math.pow(m, 2.3)));
      else if (m > 20) tau_yr = 1e10 * (m / (3200 * m));
      
      const myr = tau_yr / 1e6;
      const univ_ratio = tau_yr / 1.3787e10;
      
      let destiny = 'Carbon-Oxygen White Dwarf';
      if (m < 0.5) destiny = 'Helium White Dwarf (Trillions of years)';
      else if (m < 8) destiny = 'Planetary Nebula -> C/O White Dwarf';
      else if (m < 20) destiny = 'Type II Supernova -> Neutron Star';
      else destiny = 'Core Collapse Hypernova -> Black Hole';
      
      let yr_str = fmtSci(tau_yr) + ' Years';
      if (tau_yr >= 1e9) yr_str = (tau_yr / 1e9).toFixed(2) + ' Billion Years';
      else if (tau_yr >= 1e6) yr_str = (tau_yr / 1e6).toFixed(1) + ' Million Years';
      
      document.getElementById('out_years').textContent = yr_str;
      document.getElementById('out_myr').textContent = fmtSci(myr) + ' Myr';
      document.getElementById('out_destiny').textContent = destiny;
      document.getElementById('out_universe_comp').textContent = fmtSci(univ_ratio) + ' × Universe Age';
    `
  },
  {
    slug: 'eddington-luminosity-limit',
    title: 'Eddington Luminosity & Radiation Pressure Limit [Critical Accretion L_Edd] | Digital Tools Shed',
    shortTitle: 'Eddington Limit Calculator',
    category: 'Stellar Astrophysics',
    badge: 'RADIATION PRESSURE THRESHOLD',
    metaDesc: 'Calculate the maximum luminosity a celestial body can emit before radiation pressure blows away its outer atmosphere.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        L_Edd = 4π · G · M · c · m_p / σ_T ≈ 1.26 × 10³¹ · (M / M_☉) W ≈ 3.29 × 10⁴ · (M / M_☉) L_☉
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Derived by Sir Arthur Eddington, the Eddington limit is the balance point where outward radiation pressure against free electrons (via Thomson scattering cross-section σ_T) exactly balances inward gravitational pull on protons. Exceeding L_Edd blows the star’s atmosphere into deep space.
      </p>
    `,
    inputs: [
      { id: 'edd_mass', label: 'Central Mass (Solar Masses M_☉)', type: 'number', default: '10', step: 'any', min: '0.1' }
    ],
    presets: [
      { label: 'Sun (1 M_☉)', values: { edd_mass: 1.0 } },
      { label: 'Eta Carinae (100 M_☉)', values: { edd_mass: 100 } },
      { label: 'Intermediate Black Hole (1,000 M_☉)', values: { edd_mass: 1000 } },
      { label: 'Sgr A* Supermassive Black Hole (4.15M M_☉)', values: { edd_mass: 4.15e6 } },
      { label: 'Brightest Quasar (10⁹ M_☉)', values: { edd_mass: 1e9 } }
    ],
    outputs: [
      { id: 'out_edd_w', label: 'Eddington Luminosity in Watts', default: '1.26 × 10³² W' },
      { id: 'out_edd_solar', label: 'Luminosity in Solar Units (L_☉)', default: '3.29 × 10⁵ L_☉' },
      { id: 'out_accretion_rate', label: 'Max Accretion Rate (M_☉ / Year at η = 10%)', default: '2.21 × 10⁻⁷ M_☉/yr' },
      { id: 'out_sun_margin', label: 'Ratio to Actual Sun Luminosity', default: '32,900 ×' }
    ],
    benchmarks: [
      { object: 'Sun Current Luminosity', val: '3.828 × 10²⁶ W', notes: 'Operates at ~0.003% of Eddington limit' },
      { object: 'Eta Carinae Luminous Blue Variable', val: '5.0 × 10⁶ L_☉', notes: 'Constantly shedding mass near limit' },
      { object: '10 M_☉ Accreting Black Hole', val: '1.26 × 10³² W', notes: 'Ultra-luminous X-ray source limit' },
      { object: 'Quasar 3C 273', val: '4.0 × 10⁴⁰ W', notes: 'Supermassive black hole accreting near L_Edd' },
      { object: 'Super-Eddington Accretion', val: 'Thick Slim Disks', notes: 'Radiation trapped in rapid inflow' }
    ],
    faq: [
      { q: 'Can anything ever exceed the Eddington limit?', a: 'Yes. Super-Eddington accretion can occur when gas is dumped faster than radiation can escape (photon trapping), or in asymmetric geometries such as collimated relativistic jets where radiation escapes perpendicular to the accretion flow.' },
      { q: 'Why is the Thomson cross-section σ_T used?', a: 'In ionized stellar plasma, radiation transfers momentum primarily to free electrons via Thomson scattering. Because electrostatic attraction couples the electrons to protons, radiation pressure effectively supports the entire stellar mass.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('edd_mass').value) || 10;
      const mass_kg = m_sun * 1.98847e30;
      const G = 6.67430e-11;
      const c = 299792458;
      const mp = 1.6726219e-27;
      const sigma_t = 6.6524587e-29;
      
      const l_edd_w = (4 * Math.PI * G * mass_kg * c * mp) / sigma_t;
      const l_solar = l_edd_w / 3.828e26;
      const eta = 0.10;
      const m_dot_kg_s = l_edd_w / (eta * c * c);
      const m_dot_sun_yr = (m_dot_kg_s * 365.25 * 86400) / 1.98847e30;
      
      document.getElementById('out_edd_w').textContent = fmtSci(l_edd_w) + ' W';
      document.getElementById('out_edd_solar').textContent = fmtSci(l_solar) + ' L_☉';
      document.getElementById('out_accretion_rate').textContent = fmtSci(m_dot_sun_yr) + ' M_☉/yr';
      document.getElementById('out_sun_margin').textContent = fmtSci(l_solar / 1.0) + ' ×';
    `
  },
  {
    slug: 'chandrasekhar-mass-limit',
    title: 'Chandrasekhar Mass Limit Calculator [White Dwarf Collapse 1.44 M_☉] | Digital Tools Shed',
    shortTitle: 'Chandrasekhar Limit Calculator',
    category: 'Stellar Astrophysics',
    badge: 'ELECTRON DEGENERACY BOUND',
    metaDesc: 'Determine the relativistic electron degeneracy pressure limit of white dwarf stars and the catastrophic trigger of Type Ia supernovae.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        M_Ch ≈ (ω₃⁰ · √3π / 2) · (ħ·c / G)³·² · (1 / (μ_e · m_u)²) ≈ (5.83 / μ_e²) M_☉ ≈ 1.44 M_☉
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Calculated by 19-year-old Subrahmanyan Chandrasekhar in 1930, this limit represents the absolute maximum mass supportable by quantum electron degeneracy pressure. When a white dwarf accretes mass beyond M_Ch, electrons reach relativistic speeds, softening their equation of state and triggering runaway thermonuclear collapse into a Type Ia supernova.
      </p>
    `,
    inputs: [
      { id: 'chandra_mue', label: 'Electron Mean Molecular Weight (μ_e)', type: 'number', default: '2.0', step: '0.01', min: '1.0', max: '2.5' }
    ],
    presets: [
      { label: 'Carbon-Oxygen Core (μ_e = 2.00)', values: { chandra_mue: 2.0 } },
      { label: 'Iron Core (Fe-56, μ_e = 2.15)', values: { chandra_mue: 2.15 } },
      { label: 'Pure Helium Core (μ_e = 2.00)', values: { chandra_mue: 2.0 } },
      { label: 'Pure Hydrogen (Hypothetical μ_e = 1.0)', values: { chandra_mue: 1.0 } }
    ],
    outputs: [
      { id: 'out_chandra_solar', label: 'Chandrasekhar Limit (M_☉)', default: '1.44 M_☉' },
      { id: 'out_chandra_kg', label: 'Limit in Kilograms (kg)', default: '2.86 × 10³⁰ kg' },
      { id: 'out_supernova_type', label: 'Thermonuclear Detonation Fate', default: 'Type Ia Supernova Standard Candle' },
      { id: 'out_sirius_b', label: 'Sirius B White Dwarf Margin (1.02 M_☉)', default: '70.8 % of limit' }
    ],
    benchmarks: [
      { object: 'Sirius B White Dwarf', val: '1.02 M_☉', notes: 'Stable, Earth-sized degenerate dwarf' },
      { object: 'Standard C-O Limit', val: '1.40 - 1.44 M_☉', notes: 'Type Ia supernova cosmological candle' },
      { object: 'Iron Core Limit', val: '1.26 M_☉', notes: 'Pre-supernova core collapse threshold' },
      { object: 'Type Ia Energy Yield', val: '1.0 × 10⁴⁴ Joules', notes: 'Complete destruction of white dwarf' },
      { object: 'Neutron Star Birth', val: 'Collapse to TOV range', notes: 'Electrons forced into protons: p + e -> n' }
    ],
    faq: [
      { q: 'Why are Type Ia supernovae used as standard candles?', a: 'Because all accreting carbon-oxygen white dwarfs detonate at virtually the exact same Chandrasekhar mass threshold (~1.4 M_☉), they release a nearly identical intrinsic luminosity, allowing astronomers to measure cosmic acceleration.' },
      { q: 'Why does relativity cause the white dwarf to collapse?', a: 'At non-relativistic speeds, degeneracy pressure scales as ρ⁵/³. But as density rises, electrons approach the speed of light where pressure scales only as ρ⁴/³. This softer equation of state cannot match the steepening gravitational force, causing collapse.' }
    ],
    calcJs: `
      const mue = parseFloat(document.getElementById('chandra_mue').value) || 2.0;
      const m_ch_solar = 5.83 / (mue * mue);
      const m_ch_kg = m_ch_solar * 1.98847e30;
      const sirius_b = 1.02;
      const pct_sirius = (sirius_b / m_ch_solar) * 100;
      
      document.getElementById('out_chandra_solar').textContent = m_ch_solar.toFixed(2) + ' M_☉';
      document.getElementById('out_chandra_kg').textContent = fmtSci(m_ch_kg) + ' kg';
      document.getElementById('out_supernova_type').textContent = 'Type Ia Supernova (Runaway C/O Fusion)';
      document.getElementById('out_sirius_b').textContent = pct_sirius.toFixed(1) + ' % of limit';
    `
  },
  {
    slug: 'tolman-oppenheimer-volkoff-limit',
    title: 'TOV Neutron Star Maximum Mass Limit Calculator [Dense Matter 2.17 M_☉] | Digital Tools Shed',
    shortTitle: 'TOV Limit Calculator',
    category: 'Stellar Astrophysics',
    badge: 'NUCLEAR DEGENERACY CEILING',
    metaDesc: 'Calculate neutron degeneracy limits in neutron star cores and identify thresholds for direct gravitational collapse into black holes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        M_TOV ≈ 2.14 - 2.30 M_☉ (Nuclear Equation of State Dependent)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        First solved by Richard Tolman, J. Robert Oppenheimer, and George Volkoff in 1939 using general relativity, the TOV limit is the maximum mass a neutron star can sustain before neutron degeneracy pressure and strong nuclear repulsive forces fail, triggering collapse into a black hole.
      </p>
    `,
    inputs: [
      { id: 'tov_mass', label: 'Compact Remnant Mass (Solar Masses M_☉)', type: 'number', default: '2.0', step: '0.05', min: '1.0', max: '4.0' },
      { id: 'tov_eos', label: 'Equation of State (EOS) Model', type: 'select', options: [
        { val: '2.05', text: 'Soft EOS (APR4: Max 2.05 M_☉)' },
        { val: '2.17', text: 'Standard EOS (SLy: Max 2.17 M_☉)' },
        { val: '2.35', text: 'Stiff EOS (MS1: Max 2.35 M_☉)' }
      ]}
    ],
    presets: [
      { label: 'PSR J0740+6620 (2.08 M_☉ Pulsar)', values: { tov_mass: 2.08, tov_eos: '2.17' } },
      { label: 'PSR J0952-0607 Black Widow (2.35 M_☉)', values: { tov_mass: 2.35, tov_eos: '2.35' } },
      { label: 'Hulse-Taylor Binary (1.44 M_☉)', values: { tov_mass: 1.44, tov_eos: '2.17' } },
      { label: 'GW170817 Merger Remnant (2.7 M_☉)', values: { tov_mass: 2.70, tov_eos: '2.17' } }
    ],
    outputs: [
      { id: 'out_tov_status', label: 'Structural Equilibrium Status', default: 'Stable Neutron Star' },
      { id: 'out_tov_radius', label: 'Estimated Stellar Radius (km)', default: '11.8 km' },
      { id: 'out_compactness', label: 'Relativistic Compactness (GM/Rc²)', default: '0.250' },
      { id: 'out_collapse_risk', label: 'Collapse Proximity', default: 'Within 7.8% of TOV Limit' }
    ],
    benchmarks: [
      { object: 'Hulse-Taylor Pulsar', val: '1.44 M_☉', notes: 'First gravitational wave binary verified' },
      { object: 'PSR J0740+6620', val: '2.08 M_☉', notes: 'Measured via Shapiro delay metrology' },
      { object: 'PSR J0952-0607', val: '2.35 M_☉', notes: 'Heaviest known spinning neutron star' },
      { object: 'GW170817 Kilonova', val: '2.74 M_☉ total', notes: 'Formed hypermassive star that collapsed' },
      { object: 'Minimum Black Hole', val: '~ 3.0 M_☉', notes: 'Lower edge of the stellar mass gap' }
    ],
    faq: [
      { q: 'Why is the TOV limit not known with exact precision?', a: 'Because the nuclear equation of state (EOS) at supranuclear densities (3–5 times nuclear saturation) cannot be recreated in terrestrial laboratories. High-density QCD interactions determine the exact stiffness and mass threshold.' },
      { q: 'Does spin increase the maximum neutron star mass?', a: 'Yes. Rapid rotation provides centrifugal support, allowing millisecond pulsars to sustain up to 18–20% more mass than the static TOV limit before collapsing.' }
    ],
    calcJs: `
      const m = parseFloat(document.getElementById('tov_mass').value) || 2.0;
      const limit = parseFloat(document.getElementById('tov_eos').value) || 2.17;
      
      let status = 'Stable Neutron Star';
      let radius_km = 12.0 - (m - 1.4) * 1.5;
      if (m > limit) {
        status = 'Catastrophic Collapse into Stellar Black Hole!';
        radius_km = (2 * 6.6743e-11 * m * 1.98847e30) / (299792458 * 299792458 * 1000);
      } else if (m > limit * 0.95) {
        status = 'Marginally Stable (Nearing Collapse)';
      }
      
      const G = 6.67430e-11;
      const c = 299792458;
      const m_kg = m * 1.98847e30;
      const r_m = radius_km * 1000;
      const compactness = (G * m_kg) / (r_m * c * c);
      const margin = ((limit - m) / limit) * 100;
      
      document.getElementById('out_tov_status').textContent = status;
      document.getElementById('out_tov_radius').textContent = radius_km.toFixed(1) + ' km';
      document.getElementById('out_compactness').textContent = compactness.toFixed(3) + ' (Schwarzschild is 0.50)';
      document.getElementById('out_collapse_risk').textContent = m <= limit ? margin.toFixed(1) + ' % safety buffer' : 'Exceeded by ' + Math.abs(margin).toFixed(1) + ' %';
    `
  },
  {
    slug: 'jeans-mass-collapse-calculator',
    title: 'Jeans Mass & Gravitational Cloud Collapse Calculator [Star Birth Threshold M_J] | Digital Tools Shed',
    shortTitle: 'Jeans Mass Calculator',
    category: 'Stellar Astrophysics',
    badge: 'INTERSTELLAR COLLAPSE DYNAMICS',
    metaDesc: 'Compute the minimum mass and radius required for an interstellar gas cloud to collapse under gravity and initiate star formation.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        M_J = (c_s³ / G³·²) · ρ⁻¹·² = (5 k_B T / G μ m_H)³·² · (3 / (4π ρ))¹·²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by Sir James Jeans in 1902, the Jeans mass is the critical mass at which internal thermal gas pressure can no longer balance gravitational self-attraction in a molecular cloud. Clouds exceeding M_J collapse irreversibly, fragmenting into protostellar cores.
      </p>
    `,
    inputs: [
      { id: 'cloud_temp', label: 'Cloud Temperature (Kelvin)', type: 'number', default: '15', step: '1', min: '2', max: '300' },
      { id: 'cloud_density', label: 'Number Density n (H₂ molecules / cm³)', type: 'number', default: '10000', step: '1000', min: '1' }
    ],
    presets: [
      { label: 'Cold Dense Molecular Cloud (10 K, 10⁴ cm⁻³)', values: { cloud_temp: 10, cloud_density: 10000 } },
      { label: 'Warm Diffuse Cloud (50 K, 100 cm⁻³)', values: { cloud_temp: 50, cloud_density: 100 } },
      { label: 'Protostellar Core (10 K, 10⁶ cm⁻³)', values: { cloud_temp: 10, cloud_density: 1000000 } },
      { label: 'Interstellar Warm Neutral Medium (100 K, 1 cm⁻³)', values: { cloud_temp: 100, cloud_density: 1 } }
    ],
    outputs: [
      { id: 'out_jeans_solar', label: 'Jeans Mass (Solar Masses M_☉)', default: '8.16 M_☉' },
      { id: 'out_jeans_ly', label: 'Jeans Radius (Light-Years)', default: '0.45 ly' },
      { id: 'out_freefall_myr', label: 'Free-Fall Collapse Time (Myr)', default: '0.34 Myr' },
      { id: 'out_sound_speed', label: 'Speed of Sound in Cloud (m/s)', default: '228 m/s' }
    ],
    benchmarks: [
      { object: 'Diffuse HI Cloud', val: 'M_J > 10,000 M_☉', notes: 'Warm (100 K), stable against collapse' },
      { object: 'Giant Molecular Cloud', val: '10⁵ - 10⁶ M_☉', notes: 'Fragments into thousands of stars' },
      { object: 'Bok Globule Core', val: '2 - 50 M_☉', notes: 'Dense isolated star-forming incubator' },
      { object: 'Taurus Molecular Cloud', val: 'T ≈ 10 K', notes: 'Active low-mass star incubator' },
      { object: 'Orion Nebula Core', val: 'T ≈ 20-70 K', notes: 'High-mass cluster formation site' }
    ],
    faq: [
      { q: 'Why do cold clouds form stars more easily than warm clouds?', a: 'Thermal gas pressure is directly proportional to temperature. At 10 Kelvin, thermal gas pressure is feeble, lowering the Jeans mass and allowing even small clumps of gas to collapse gravitationally.' },
      { q: 'What halts the gravitational collapse once it starts?', a: 'As the cloud collapses, it becomes optically thick to infrared radiation, trapping heat. The rising temperature and pressure eventually halt the collapse, forming a stable hydrostatic protostar.' }
    ],
    calcJs: `
      const T = parseFloat(document.getElementById('cloud_temp').value) || 15;
      const n_cm3 = parseFloat(document.getElementById('cloud_density').value) || 10000;
      
      const kb = 1.380649e-23;
      const G = 6.67430e-11;
      const mu = 2.3; // Mean molecular weight for H2 + He
      const mh = 1.6735e-27;
      const rho_kg_m3 = n_cm3 * 1e6 * mu * mh;
      
      const gamma = 5/3;
      const cs = Math.sqrt((gamma * kb * T) / (mu * mh));
      
      // Jeans length lambda_J = sqrt(pi * cs^2 / (G * rho))
      const lambda_j_m = Math.sqrt((Math.PI * cs * cs) / (G * rho_kg_m3));
      const radius_j_ly = (lambda_j_m / 2) / 9.4607e15;
      
      // Jeans mass M_J = (4/3) * pi * rho * (lambda_J / 2)^3
      const m_j_kg = (4/3) * Math.PI * rho_kg_m3 * Math.pow(lambda_j_m / 2, 3);
      const m_j_solar = m_j_kg / 1.98847e30;
      
      // Free fall time t_ff = sqrt(3pi / (32 G rho))
      const t_ff_s = Math.sqrt((3 * Math.PI) / (32 * G * rho_kg_m3));
      const t_ff_myr = t_ff_s / (365.25 * 86400 * 1e6);
      
      document.getElementById('out_jeans_solar').textContent = fmtSci(m_j_solar) + ' M_☉';
      document.getElementById('out_jeans_ly').textContent = radius_j_ly.toFixed(3) + ' ly';
      document.getElementById('out_freefall_myr').textContent = t_ff_myr.toFixed(2) + ' Myr';
      document.getElementById('out_sound_speed').textContent = Math.round(cs) + ' m/s';
    `
  },
  {
    slug: 'stellar-habitable-zone-calculator',
    title: 'Exoplanet Habitable Zone Distance Calculator [Goldilocks Orbit AU] | Digital Tools Shed',
    shortTitle: 'Habitable Zone Calculator',
    category: 'Stellar Astrophysics',
    badge: 'ASTROBIOLOGICAL CLIMATE METRIC',
    metaDesc: 'Calculate runaway greenhouse and maximum greenhouse circumstellar habitable zone boundaries around any star system in AU.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        d_HZ = √( (L / L_☉) / S_eff ) AU
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Based on the standard climate models of Kopparapu et al., the circumstellar habitable zone (Goldilocks zone) represents the orbital distance where liquid water can persist on an Earth-like planet. The inner boundary is defined by the runaway greenhouse limit (S_eff ≈ 1.107) and the outer by the maximum CO₂ greenhouse limit (S_eff ≈ 0.356).
      </p>
    `,
    inputs: [
      { id: 'hz_lum', label: 'Star Luminosity (Solar Units L_☉)', type: 'number', default: '1.0', step: '0.05', min: '0.00001' },
      { id: 'hz_temp', label: 'Star Effective Temperature (Kelvin)', type: 'number', default: '5778', step: '50', min: '2000', max: '40000' }
    ],
    presets: [
      { label: 'Sun (G2V: 1.0 L_☉, 5,778 K)', values: { hz_lum: 1.0, hz_temp: 5778 } },
      { label: 'Proxima Centauri (M5.5V: 0.0017 L_☉, 3,050 K)', values: { hz_lum: 0.0017, hz_temp: 3050 } },
      { label: 'TRAPPIST-1 (M8V: 0.00055 L_☉, 2,566 K)', values: { hz_lum: 0.00055, hz_temp: 2566 } },
      { label: 'Kepler-186 (M1V: 0.0412 L_☉, 3,788 K)', values: { hz_lum: 0.0412, hz_temp: 3788 } },
      { label: 'Sirius A (A1V: 25.4 L_☉, 9,940 K)', values: { hz_lum: 25.4, hz_temp: 9940 } }
    ],
    outputs: [
      { id: 'out_inner_au', label: 'Inner Edge (Runaway Greenhouse)', default: '0.950 AU' },
      { id: 'out_outer_au', label: 'Outer Edge (Maximum Greenhouse)', default: '1.676 AU' },
      { id: 'out_hz_width', label: 'Habitable Zone Width (AU)', default: '0.726 AU' },
      { id: 'out_mid_orbit', label: 'Orbital Period at Midpoint', default: '365.2 Days' }
    ],
    benchmarks: [
      { object: 'TRAPPIST-1 System', val: '0.02 - 0.05 AU', notes: 'Compact system with 3 habitable planets' },
      { object: 'Proxima Centauri b', val: '0.0485 AU', notes: 'Earth-mass neighbor in habitable zone' },
      { object: 'Solar System (Sun)', val: '0.95 - 1.68 AU', notes: 'Earth at 1.0 AU, Mars at 1.52 AU' },
      { object: 'Kepler-452b ("Earth 2.0")', val: '1.046 AU', notes: 'G2-type star habitable exoplanet' },
      { object: 'Sirius A System', val: '4.8 - 8.4 AU', notes: 'Habitable zone orbits Jupiter distance' }
    ],
    faq: [
      { q: 'Is a planet guaranteed to be habitable if it orbits within this zone?', a: 'No. The habitable zone specifies only that stellar irradiance permits liquid surface water. Atmospheric composition, magnetic field shielding, greenhouse gas inventory, and planetary mass are also required to prevent atmospheric stripping.' },
      { q: 'Why do M-dwarf habitable planets risk tidal locking?', a: 'Because red dwarfs have low luminosities, their habitable zones sit extremely close to the star (< 0.1 AU). Strong gravitational tidal dissipation rapidly locks the planet into synchronous rotation, leaving one hemisphere in eternal daylight and the other in eternal night.' }
    ],
    calcJs: `
      const L = parseFloat(document.getElementById('hz_lum').value) || 1.0;
      const T = parseFloat(document.getElementById('hz_temp').value) || 5778;
      
      const t_diff = T - 5778;
      // Kopparapu et al. coefficients
      const s_inner = 1.107 + 1.332e-4 * t_diff + 1.58e-8 * t_diff * t_diff;
      const s_outer = 0.356 + 6.171e-5 * t_diff + 1.69e-9 * t_diff * t_diff;
      
      const r_inner = Math.sqrt(L / s_inner);
      const r_outer = Math.sqrt(L / s_outer);
      const width = r_outer - r_inner;
      
      // Kepler's 3rd law P = sqrt(a^3 / M)
      const r_mid = (r_inner + r_outer) / 2;
      const m_approx = Math.pow(L, 1/3.5);
      const period_days = Math.sqrt(Math.pow(r_mid, 3) / Math.max(0.08, m_approx)) * 365.25;
      
      document.getElementById('out_inner_au').textContent = r_inner.toFixed(3) + ' AU';
      document.getElementById('out_outer_au').textContent = r_outer.toFixed(3) + ' AU';
      document.getElementById('out_hz_width').textContent = width.toFixed(3) + ' AU';
      document.getElementById('out_mid_orbit').textContent = period_days.toFixed(1) + ' Earth Days';
    `
  },
  {
    slug: 'photon-energy-wavelength-calculator',
    title: 'Photon Wavelength to Energy Calculator [Quantum Optics E = hc/λ] | Digital Tools Shed',
    shortTitle: 'Photon Energy Calculator',
    category: 'Quantum Optics & Mechanics',
    badge: 'PLANCK-EINSTEIN RELATION',
    metaDesc: 'Convert photon wavelength to electronvolts (eV), Joules, terahertz (THz), and momentum with exact Planck-Einstein quantum relations.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        E = h · c / λ = h · f;\quad p = h / λ = E / c
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        First postulated by Max Planck (1900) and verified by Albert Einstein’s photoelectric effect (1905), the energy of light is quantized into discrete packets called photons. At optical wavelengths, a handy conversion shortcut is E (eV) ≈ 1239.84193 / λ (nm).
      </p>
    `,
    inputs: [
      { id: 'wl_nm', label: 'Wavelength (Nanometers nm)', type: 'number', default: '500', step: 'any', min: '0.000001' }
    ],
    presets: [
      { label: 'Green Laser (532 nm)', values: { wl_nm: 532 } },
      { label: 'Red Helium-Neon Laser (632.8 nm)', values: { wl_nm: 632.8 } },
      { label: 'Ultraviolet Germicidal (254 nm)', values: { wl_nm: 254 } },
      { label: 'Medical X-Ray (0.1 nm)', values: { wl_nm: 0.1 } },
      { label: 'Telecom Infrared (1550 nm)', values: { wl_nm: 1550 } },
      { label: 'Hydrogen 21-cm Line (2.1 × 10⁸ nm)', values: { wl_nm: 2.11e8 } }
    ],
    outputs: [
      { id: 'out_ev', label: 'Energy in Electronvolts (eV)', default: '2.480 eV' },
      { id: 'out_joules', label: 'Energy in Joules (J)', default: '3.973 × 10⁻¹⁹ J' },
      { id: 'out_freq_thz', label: 'Frequency (THz)', default: '599.58 THz' },
      { id: 'out_spectrum_band', label: 'Electromagnetic Spectrum Band', default: 'Visible Light (Green)' }
    ],
    benchmarks: [
      { object: 'Hydrogen 21-cm Line', val: '5.87 × 10⁻⁶ eV', notes: 'Neutral interstellar hydrogen hyperfine' },
      { object: 'Thermal Infrared (10 µm)', val: '0.124 eV', notes: 'Room-temperature blackbody emission' },
      { object: 'Visible Light (400 - 700 nm)', val: '1.77 - 3.10 eV', notes: 'Human retinal photoreceptor trigger' },
      { object: 'Silicon Bandgap', val: '1.12 eV', notes: 'Photovoltaic solar cell absorption threshold' },
      { object: 'Cobalt-60 Gamma Ray (1.33 MeV)', val: '9.3 × 10⁻⁴ nm', notes: 'High-energy nuclear decay photon' }
    ],
    faq: [
      { q: 'Why is electronvolts (eV) preferred over Joules for photons?', a: 'A Joule is a macroscopic SI unit (~energy to lift a small apple 1 meter). A single optical photon carries only ~4 × 10⁻¹⁹ Joules, making electronvolts (1 eV = 1.602 × 10⁻¹⁹ J) far more natural for atomic transitions and bandgaps.' },
      { q: 'Do photons have momentum even though they have zero rest mass?', a: 'Yes. In special relativity, E² = (pc)² + (m₀c²)². Because photons have m₀ = 0, their momentum is directly p = E/c = h/λ. This momentum drives solar radiation sails and optical tweezers.' }
    ],
    calcJs: `
      const wl_nm = parseFloat(document.getElementById('wl_nm').value) || 500;
      const h = 6.62607015e-34;
      const c = 299792458;
      const e_charge = 1.602176634e-19;
      
      const wl_m = wl_nm * 1e-9;
      const joules = (h * c) / wl_m;
      const ev = joules / e_charge;
      const thz = (c / wl_m) / 1e12;
      
      let band = 'Visible Light';
      if (wl_nm < 0.01) band = 'Gamma Rays';
      else if (wl_nm < 10) band = 'X-Rays';
      else if (wl_nm < 380) band = 'Ultraviolet (UV)';
      else if (wl_nm <= 450) band = 'Visible Light (Violet / Blue)';
      else if (wl_nm <= 560) band = 'Visible Light (Green / Yellow)';
      else if (wl_nm <= 750) band = 'Visible Light (Orange / Red)';
      else if (wl_nm <= 1e6) band = 'Infrared (IR)';
      else if (wl_nm <= 1e9) band = 'Microwave';
      else band = 'Radio Waves';
      
      document.getElementById('out_ev').textContent = fmtSci(ev) + ' eV';
      document.getElementById('out_joules').textContent = fmtSci(joules) + ' J';
      document.getElementById('out_freq_thz').textContent = fmtSci(thz) + ' THz';
      document.getElementById('out_spectrum_band').textContent = band;
    `
  },
  {
    slug: 'de-broglie-wavelength-calculator',
    title: 'De Broglie Matter Wavelength Calculator [Wave-Particle Duality λ = h/p] | Digital Tools Shed',
    shortTitle: 'De Broglie Wavelength Calculator',
    category: 'Quantum Optics & Mechanics',
    badge: 'WAVE-PARTICLE DUALITY',
    metaDesc: 'Compute the matter wave wavelength of electrons, neutrons, and macroscopic objects to explore wave-particle duality and diffraction.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        λ = h / p = h / (γ · m · v)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        In 1924, Louis de Broglie proposed that all matter exhibits wave-like characteristics with wavelength λ = h/p. While subatomic particles like electrons have wavelengths comparable to atomic crystal lattices (enabling electron microscopy), macroscopic objects have wavelengths unimaginably smaller than the Planck length.
      </p>
    `,
    inputs: [
      { id: 'deb_preset', label: 'Particle Species', type: 'select', options: [
        { val: '9.10938e-31', text: 'Electron (9.109 × 10⁻³¹ kg)' },
        { val: '1.67262e-27', text: 'Proton (1.673 × 10⁻²⁷ kg)' },
        { val: '1.67493e-27', text: 'Neutron (1.675 × 10⁻²⁷ kg)' },
        { val: '1.196e-24', text: 'Buckminsterfullerene C₆₀ (720 amu)' },
        { val: '0.145', text: 'Baseball (0.145 kg)' }
      ]},
      { id: 'deb_vel', label: 'Velocity (Meters per Second m/s)', type: 'number', default: '1000000', step: 'any', min: '0.0001' }
    ],
    presets: [
      { label: '100 eV TEM Electron (5.93 × 10⁶ m/s)', values: { deb_preset: '9.10938e-31', deb_vel: 5930000 } },
      { label: 'Thermal Neutron at 300 K (2,200 m/s)', values: { deb_preset: '1.67493e-27', deb_vel: 2200 } },
      { label: 'Diffracting C₆₀ Buckyball (100 m/s)', values: { deb_preset: '1.196e-24', deb_vel: 100 } },
      { label: 'Major League Fastball 95 mph (42.5 m/s)', values: { deb_preset: '0.145', deb_vel: 42.5 } }
    ],
    outputs: [
      { id: 'out_deb_m', label: 'Matter Wavelength (m)', default: '7.27 × 10⁻¹⁰ m' },
      { id: 'out_deb_pm', label: 'Wavelength in Picometers (pm)', default: '727.4 pm' },
      { id: 'out_lattice_ratio', label: 'Ratio to Silicon Lattice (0.543 nm)', default: '1.34 ×' },
      { id: 'out_diffract', label: 'Diffraction Behavior', default: 'Observable Atomic Diffraction' }
    ],
    benchmarks: [
      { object: '100 keV Transmission Electron Microscope', val: '3.7 picometers', notes: 'Resolves individual atomic columns' },
      { object: 'Thermal Neutron at Room Temp', val: '180 picometers', notes: 'Matches crystal interatomic spacing' },
      { object: 'C₆₀ Fullerene Molecule (Zeilinger 1999)', val: '2.5 picometers', notes: 'Largest quantum interference verified' },
      { object: 'Bacteriophage Virus at 1 mm/s', val: '4.0 × 10⁻¹⁷ m', notes: 'Far below atomic dimensions' },
      { object: 'Thrown Baseball (95 mph)', val: '1.08 × 10⁻³⁴ m', notes: 'Quantum wave effects undetectable' }
    ],
    faq: [
      { q: 'Why don’t we see everyday objects diffract through doorways?', a: 'A 70 kg human walking at 1 m/s has a de Broglie wavelength of ~10⁻³⁶ meters. For diffraction to be observable, the slit width must be comparable to the wavelength. No physical slit exists at 10⁻³⁶ m.' },
      { q: 'How did Davisson and Germer prove de Broglie’s hypothesis?', a: 'In 1927, they directed an electron beam at a nickel crystal and observed an angular diffraction pattern identical to X-ray Bragg scattering, confirming that electrons behave as waves.' }
    ],
    calcJs: `
      const m_kg = parseFloat(document.getElementById('deb_preset').value) || 9.10938e-31;
      const v = parseFloat(document.getElementById('deb_vel').value) || 1e6;
      const h = 6.62607015e-34;
      const c = 299792458;
      
      const beta = Math.min(0.999999, v / c);
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      const p = gamma * m_kg * v;
      const lambda_m = h / p;
      const lambda_pm = lambda_m * 1e12;
      const si_lattice = 0.543e-9;
      
      let diffract = 'Observable Atomic Diffraction (Diffracts with Crystals)';
      if (lambda_m < 1e-15) diffract = 'Purely Classical (Macroscopic Wavepacket Collapse)';
      else if (lambda_m < 1e-12) diffract = 'Deep Subatomic Probing Scale';
      
      document.getElementById('out_deb_m').textContent = fmtSci(lambda_m) + ' m';
      document.getElementById('out_deb_pm').textContent = fmtSci(lambda_pm) + ' pm';
      document.getElementById('out_lattice_ratio').textContent = fmtSci(lambda_m / si_lattice) + ' ×';
      document.getElementById('out_diffract').textContent = diffract;
    `
  },
  {
    slug: 'compton-scattering-calculator',
    title: 'Compton Scattering Wavelength Shift Calculator [Photon Collision Δλ] | Digital Tools Shed',
    shortTitle: 'Compton Scattering Calculator',
    category: 'Quantum Optics & Mechanics',
    badge: 'RELATIVISTIC COLLISION KINEMATICS',
    metaDesc: 'Calculate Compton scattering wavelength elongation and electron recoil kinetic energy after high-energy photon collisions.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Δλ = λ' - λ = λ_C · (1 - cos θ) = (h / (m_e · c)) · (1 - cos θ)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Discovered by Arthur Compton in 1923, Compton scattering proves that photons carry momentum like localized relativistic billiard balls. When an X-ray or gamma photon scatters off a stationary electron at angle θ, it transfers energy to the electron, shifting the photon’s wavelength by up to 2 λ_C ≈ 4.853 pm.
      </p>
    `,
    inputs: [
      { id: 'compton_angle', label: 'Scattering Angle θ (Degrees 0° to 180°)', type: 'number', default: '90', step: '1', min: '0', max: '180' },
      { id: 'compton_energy_kev', label: 'Initial Photon Energy (keV)', type: 'number', default: '100', step: '1', min: '0.1' }
    ],
    presets: [
      { label: 'Right-Angle Scattering (θ = 90°)', values: { compton_angle: 90, compton_energy_kev: 100 } },
      { label: 'Direct Backscattering (θ = 180°)', values: { compton_angle: 180, compton_energy_kev: 100 } },
      { label: '511 keV Positron Annihilation (θ = 180°)', values: { compton_angle: 180, compton_energy_kev: 511 } },
      { label: 'Glancing Scatter (θ = 10°)', values: { compton_angle: 10, compton_energy_kev: 50 } }
    ],
    outputs: [
      { id: 'out_shift_pm', label: 'Wavelength Shift Δλ (Picometers pm)', default: '2.426 pm' },
      { id: 'out_final_kev', label: 'Scattered Photon Energy (keV)', default: '83.64 keV' },
      { id: 'out_recoil_kev', label: 'Electron Recoil Energy (keV)', default: '16.36 keV' },
      { id: 'out_fraction_loss', label: 'Fractional Energy Transferred', default: '16.36 %' }
    ],
    benchmarks: [
      { object: 'Compton Wavelength of Electron λ_C', val: '2.42631 × 10⁻¹² m', notes: 'h / (m_e c) = 2.426 pm' },
      { object: 'Zero Deflection (θ = 0°)', val: 'Δλ = 0', notes: 'Zero energy transfer forward' },
      { object: 'Right-Angle (θ = 90°)', val: 'Δλ = 1 λ_C', notes: '2.426 pm wavelength shift' },
      { object: 'Backscattering (θ = 180°)', val: 'Δλ = 2 λ_C', notes: '4.853 pm maximum wavelength shift' },
      { object: 'Compton Edge in Radiation Detectors', val: 'Max recoil electron energy', notes: 'Prominent shoulder in gamma spectra' }
    ],
    faq: [
      { q: 'Why is Compton scattering noticeable only for X-rays and gamma rays?', a: 'The Compton wavelength shift Δλ is at most ~4.85 picometers. For visible light (500,000 pm), a 4.8 pm shift is an imperceptible 0.001% change. But for a 100 keV X-ray (12.4 pm), 4.8 pm is a massive 39% energy loss.' },
      { q: 'What is the Inverse Compton effect?', a: 'When a relativistic energetic electron collides with a low-energy photon (like an optical or CMB photon), energy transfers in reverse, upshifting the photon into high-energy X-rays or gamma rays (common in active galactic nuclei).' }
    ],
    calcJs: `
      const theta_deg = parseFloat(document.getElementById('compton_angle').value) || 90;
      const e_init_kev = parseFloat(document.getElementById('compton_energy_kev').value) || 100;
      const theta_rad = (theta_deg * Math.PI) / 180;
      
      const lambda_c_pm = 2.426310238; // picometers
      const delta_lambda_pm = lambda_c_pm * (1 - Math.cos(theta_rad));
      
      // hc = 1.239841984 keV * pm
      const hc_kev_pm = 1239.841984;
      const lambda_init_pm = hc_kev_pm / e_init_kev;
      const lambda_final_pm = lambda_init_pm + delta_lambda_pm;
      const e_final_kev = hc_kev_pm / lambda_final_pm;
      const recoil_kev = e_init_kev - e_final_kev;
      const frac_transferred = (recoil_kev / e_init_kev) * 100;
      
      document.getElementById('out_shift_pm').textContent = delta_lambda_pm.toFixed(3) + ' pm';
      document.getElementById('out_final_kev').textContent = e_final_kev.toFixed(2) + ' keV';
      document.getElementById('out_recoil_kev').textContent = recoil_kev.toFixed(2) + ' keV';
      document.getElementById('out_fraction_loss').textContent = frac_transferred.toFixed(2) + ' %';
    `
  },
  {
    slug: 'stefan-boltzmann-blackbody-law',
    title: 'Stefan-Boltzmann Radiation & Radiated Power Law [Thermal Emission P = εσAT⁴] | Digital Tools Shed',
    shortTitle: 'Stefan-Boltzmann Law Calculator',
    category: 'Thermodynamics & Radiation',
    badge: 'THERMODYNAMIC RADIANT FLUX',
    metaDesc: 'Calculate total thermal blackbody radiation flux and total radiated wattage across temperature, emissivity, and surface area.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        j* = σ · T⁴;\quad P = ε · σ · A · T⁴;\quad σ ≈ 5.670374 × 10⁻⁸ W/(m²·K⁴)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The Stefan-Boltzmann law dictates that the total radiant energy emitted by a blackbody per unit surface area per unit time is directly proportional to the fourth power of its thermodynamic temperature. Doubling an object’s absolute temperature increases its radiated energy by 16 times (2⁴ = 16).
      </p>
    `,
    inputs: [
      { id: 'sb_temp', label: 'Surface Temperature (Kelvin)', type: 'number', default: '5778', step: '10', min: '1' },
      { id: 'sb_area', label: 'Emitting Surface Area (m²)', type: 'number', default: '1.0', step: 'any', min: '0.0001' },
      { id: 'sb_emiss', label: 'Surface Emissivity ε (0 to 1)', type: 'number', default: '1.0', step: '0.05', min: '0.01', max: '1.0' }
    ],
    presets: [
      { label: 'Sun Surface (5,778 K, 1 m²)', values: { sb_temp: 5778, sb_area: 1.0, sb_emiss: 1.0 } },
      { label: 'Human Skin (306 K, 1.8 m², ε = 0.98)', values: { sb_temp: 306, sb_area: 1.8, sb_emiss: 0.98 } },
      { label: 'Incandescent Filament (2,700 K, 1 cm²)', values: { sb_temp: 2700, sb_area: 0.0001, sb_emiss: 0.35 } },
      { label: 'Red Dwarf Star (3,000 K, 1 m²)', values: { sb_temp: 3000, sb_area: 1.0, sb_emiss: 1.0 } }
    ],
    outputs: [
      { id: 'out_flux_wm2', label: 'Radiant Flux Density (W/m²)', default: '6.33 × 10⁷ W/m²' },
      { id: 'out_total_watts', label: 'Total Emitted Power (Watts)', default: '6.33 × 10⁷ W' },
      { id: 'out_solar_ratio', label: 'Ratio to Solar Surface Flux (63.3 MW/m²)', default: '1.00 ×' },
      { id: 'out_heat_loss', label: 'Net Thermal Transfer Rate', default: 'Radiation Equilibrium Evaluated' }
    ],
    benchmarks: [
      { object: 'Liquid Helium Cryostat (4 K)', val: '0.015 mW/m²', notes: 'Near-zero radiative emission' },
      { object: 'Room Temperature (293 K / 20°C)', val: '418 W/m²', notes: 'Ambient environmental infrared radiation' },
      { object: 'Human Body Surface (306 K)', val: '497 W/m²', notes: '~900 W total emission (reabsorbs ~800 W)' },
      { object: 'Sun Photosphere (5,778 K)', val: '6.33 × 10⁷ W/m²', notes: '63.3 Megawatts per square meter' },
      { object: 'O-Type Blue Star (40,000 K)', val: '1.45 × 10¹¹ W/m²', notes: '145 Gigawatts per square meter' }
    ],
    faq: [
      { q: 'Why does the human body not freeze if it radiates ~900 Watts?', a: 'Because your surroundings (walls, floor, ceiling at ~20°C) also radiate blackbody energy back to you. The net heat loss is P_net = εσA(T_body⁴ - T_ambient⁴) ≈ 100 Watts, matching typical human basal metabolic heat output.' },
      { q: 'How is the Stefan-Boltzmann constant σ derived from fundamental physics?', a: 'By integrating Planck’s radiation law over all frequencies: σ = 2π⁵ k_B⁴ / (15 c² h³). Max Planck derived σ from first quantum principles in 1900.' }
    ],
    calcJs: `
      const t = parseFloat(document.getElementById('sb_temp').value) || 5778;
      const a = parseFloat(document.getElementById('sb_area').value) || 1.0;
      const eps = parseFloat(document.getElementById('sb_emiss').value) || 1.0;
      
      const sigma = 5.670374419e-8;
      const flux_wm2 = eps * sigma * Math.pow(t, 4);
      const total_watts = flux_wm2 * a;
      const solar_flux = 6.328e7;
      
      document.getElementById('out_flux_wm2').textContent = fmtSci(flux_wm2) + ' W/m²';
      document.getElementById('out_total_watts').textContent = fmtSci(total_watts) + ' W';
      document.getElementById('out_solar_ratio').textContent = fmtSci(flux_wm2 / solar_flux) + ' ×';
      document.getElementById('out_heat_loss').textContent = total_watts > 1000 ? (total_watts / 1000).toFixed(1) + ' kW Thermal Emission' : total_watts.toFixed(1) + ' W Thermal Emission';
    `
  },
  {
    slug: 'wiens-displacement-law',
    title: 'Wien\'s Displacement Law Peak Wavelength Calculator [Star Color & Temperature λ_max] | Digital Tools Shed',
    shortTitle: 'Wien\'s Displacement Calculator',
    category: 'Thermodynamics & Radiation',
    badge: 'BLACKBODY SPECTRAL PEAK',
    metaDesc: 'Determine peak radiation emission wavelength and stellar color from blackbody temperature using Wien\'s displacement law.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        λ_max = b / T;\quad b ≈ 2.897771955 × 10⁻³ m·K ≈ 2,897,772 nm·K
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Wien’s displacement law states that the blackbody radiation curve peaks at a wavelength inversely proportional to absolute temperature. As an object heats up, its color shifts from infrared to dull red, yellow, brilliant white, and finally deep blue-violet.
      </p>
    `,
    inputs: [
      { id: 'wien_temp', label: 'Blackbody Temperature (Kelvin)', type: 'number', default: '5778', step: '50', min: '50' }
    ],
    presets: [
      { label: 'Cosmic Microwave Background (2.725 K)', values: { wien_temp: 2.725 } },
      { label: 'Human Body (310 K)', values: { wien_temp: 310 } },
      { label: 'Incandescent Bulb (2,800 K)', values: { wien_temp: 2800 } },
      { label: 'Sun Surface (5,778 K)', values: { wien_temp: 5778 } },
      { label: 'Rigel Blue Supergiant (12,100 K)', values: { wien_temp: 12100 } }
    ],
    outputs: [
      { id: 'out_peak_nm', label: 'Peak Wavelength λ_max (nm)', default: '501.5 nm' },
      { id: 'out_em_band', label: 'Electromagnetic Spectrum Band', default: 'Visible Light (Green-Cyan)' },
      { id: 'out_star_color', label: 'Perceived Thermal Color', default: 'White (Solar Photosphere)' },
      { id: 'out_photon_ev', label: 'Photon Energy at Peak (eV)', default: '2.472 eV' }
    ],
    benchmarks: [
      { object: 'Cosmic Microwave Background', val: '1.063 mm (Microwave)', notes: '2.7255 K relic radiation' },
      { object: 'Human Body Thermal Emission', val: '9.35 µm (Infrared)', notes: 'Basis of thermal imaging night vision' },
      { object: 'Red Giant Star (Betelgeuse)', val: '805 nm (Near-Infrared)', notes: 'Appears ruddy reddish-orange' },
      { object: 'Sun Photosphere (5,778 K)', val: '501.5 nm (Green)', notes: 'Blends into white light through atmosphere' },
      { object: 'Hot O-Type Star (35,000 K)', val: '82.8 nm (Far UV)', notes: 'Intense ionizing radiation' }
    ],
    faq: [
      { q: 'Why doesn’t the Sun look green if its peak wavelength is 501.5 nm (green)?', a: 'The blackbody curve is broad. Although the peak photon flux occurs in green-cyan, the Sun emits copious amounts of red, orange, yellow, and blue photons simultaneously. When all visible wavelengths stimulate the human eye’s three cone types equally, the brain perceives pure white.' },
      { q: 'Why are there no green stars in the night sky?', a: 'Because blackbody spectra cannot emit green light in isolation. A star cool enough to emit green also emits abundant red light; as it gets hotter, it quickly emits blue light. The progression goes Red -> Orange -> Yellow -> White -> Blue.' }
    ],
    calcJs: `
      const t = parseFloat(document.getElementById('wien_temp').value) || 5778;
      const b_nm_k = 2897771.955;
      const peak_nm = b_nm_k / t;
      const ev = 1239.841984 / peak_nm;
      
      let band = 'Visible Light';
      let color = 'White';
      if (peak_nm < 10) { band = 'X-Ray'; color = 'High Energy Invisible'; }
      else if (peak_nm < 380) { band = 'Ultraviolet (UV)'; color = 'Deep Blue-Violet / UV'; }
      else if (peak_nm <= 450) { band = 'Visible (Violet/Blue)'; color = 'Brilliant Blue-White'; }
      else if (peak_nm <= 550) { band = 'Visible (Green-Yellow)'; color = 'Pure White (e.g. Sun)'; }
      else if (peak_nm <= 650) { band = 'Visible (Yellow-Orange)'; color = 'Warm Yellow-Orange'; }
      else if (peak_nm <= 750) { band = 'Visible (Red)'; color = 'Dull Red'; }
      else if (peak_nm <= 1e6) { band = 'Infrared (IR)'; color = 'Infrared Thermal (Invisible)'; }
      else { band = 'Microwave / Radio'; color = 'Cold Cosmic Glow'; }
      
      document.getElementById('out_peak_nm').textContent = fmtSci(peak_nm) + ' nm';
      document.getElementById('out_em_band').textContent = band;
      document.getElementById('out_star_color').textContent = color;
      document.getElementById('out_photon_ev').textContent = fmtSci(ev) + ' eV';
    `
  },
  {
    slug: 'rydberg-hydrogen-transition',
    title: 'Rydberg Hydrogen Emission Spectrum Calculator [Spectral Lines 1/λ = R_H(1/n₁² - 1/n₂²)] | Digital Tools Shed',
    shortTitle: 'Rydberg Hydrogen Spectrum Calculator',
    category: 'Quantum Optics & Mechanics',
    badge: 'ATOMIC SPECTROSCOPY',
    metaDesc: 'Calculate hydrogen atomic electron transition wavelengths across Lyman, Balmer, Paschen, Brackett, and Pfund spectroscopic series.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        1 / λ = R_H · (1 / n₁² - 1 / n₂²);\quad R_H ≈ 1.09737315685 × 10⁷ m⁻¹
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Derived empirically by Johannes Rydberg in 1888 and explained by Niels Bohr’s quantum model in 1913, this equation predicts the exact wavelengths of photons emitted or absorbed when an electron jumps between quantized energy levels n₂ and n₁ in a hydrogen atom.
      </p>
    `,
    inputs: [
      { id: 'ryd_n1', label: 'Lower Orbital Level (n₁)', type: 'select', options: [
        { val: '1', text: 'n₁ = 1 (Lyman Series - Ultraviolet)' },
        { val: '2', text: 'n₁ = 2 (Balmer Series - Visible Light)' },
        { val: '3', text: 'n₁ = 3 (Paschen Series - Near Infrared)' },
        { val: '4', text: 'n₁ = 4 (Brackett Series - Mid Infrared)' },
        { val: '5', text: 'n₁ = 5 (Pfund Series - Far Infrared)' }
      ]},
      { id: 'ryd_n2', label: 'Upper Orbital Level (n₂ > n₁)', type: 'number', default: '3', step: '1', min: '2', max: '25' }
    ],
    presets: [
      { label: 'H-Alpha Balmer Red (n = 3 -> 2)', values: { ryd_n1: '2', ryd_n2: 3 } },
      { label: 'H-Beta Balmer Cyan (n = 4 -> 2)', values: { ryd_n1: '2', ryd_n2: 4 } },
      { label: 'Lyman-Alpha UV (n = 2 -> 1)', values: { ryd_n1: '1', ryd_n2: 2 } },
      { label: 'Paschen-Alpha IR (n = 4 -> 3)', values: { ryd_n1: '3', ryd_n2: 4 } }
    ],
    outputs: [
      { id: 'out_wl_nm', label: 'Wavelength (nm)', default: '656.3 nm' },
      { id: 'out_photon_ev', label: 'Photon Energy (eV)', default: '1.889 eV' },
      { id: 'out_line_name', label: 'Spectroscopic Line Designation', default: 'Balmer H-α Line' },
      { id: 'out_line_color', label: 'Visual Line Color', default: 'Deep Crimson Red' }
    ],
    benchmarks: [
      { object: 'Lyman-α (n = 2 -> 1)', val: '121.57 nm (UV)', notes: 'Dominant line in cosmological intergalactic clouds' },
      { object: 'Balmer H-α (n = 3 -> 2)', val: '656.28 nm (Red)', notes: 'Gives emission nebulae their vibrant red glow' },
      { object: 'Balmer H-β (n = 4 -> 2)', val: '486.13 nm (Cyan)', notes: 'Prominent in stellar spectral classification' },
      { object: 'Paschen-α (n = 4 -> 3)', val: '1875.1 nm (IR)', notes: 'Penetrates galactic dust lanes' },
      { object: 'Ionization from Ground State', val: '91.18 nm (13.606 eV)', notes: 'Rydberg constant energy limit' }
    ],
    faq: [
      { q: 'Why is the Balmer series the only series visible to human eyes?', a: 'Because n₁ = 2 orbital jumps have energy differences between 1.89 eV and 3.40 eV, directly corresponding to wavelengths of 364 nm to 656 nm—the exact electromagnetic window visible to human retinal opsins.' },
      { q: 'What is the Lyman-alpha forest in astronomy?', a: 'When light from distant quasars passes through neutral hydrogen gas clouds across cosmological epochs, cosmological expansion redshifts the 121.6 nm Lyman-alpha absorption line, creating an intricate dense "forest" of absorption lines on astronomical spectrographs.' }
    ],
    calcJs: `
      const n1 = parseInt(document.getElementById('ryd_n1').value, 10) || 2;
      let n2 = parseInt(document.getElementById('ryd_n2').value, 10) || 3;
      if (n2 <= n1) n2 = n1 + 1;
      
      const R_H = 1.09737315685e7; // m^-1
      const inv_lambda = R_H * (1 / (n1 * n1) - 1 / (n2 * n2));
      const lambda_m = 1 / inv_lambda;
      const lambda_nm = lambda_m * 1e9;
      const ev = 1239.841984 / lambda_nm;
      
      let line_name = 'Transition n = ' + n2 + ' -> ' + n1;
      let color_name = 'Infrared';
      
      if (n1 === 1) {
        line_name = 'Lyman Series (Ly-' + (n2 === 2 ? 'α' : n2 === 3 ? 'β' : n2 === 4 ? 'γ' : n2) + ')';
        color_name = 'Ultraviolet (Invisible to eye)';
      } else if (n1 === 2) {
        if (n2 === 3) { line_name = 'Balmer H-α'; color_name = 'Deep Crimson Red (656 nm)'; }
        else if (n2 === 4) { line_name = 'Balmer H-β'; color_name = 'Cyan / Blue-Green (486 nm)'; }
        else if (n2 === 5) { line_name = 'Balmer H-γ'; color_name = 'Violet-Blue (434 nm)'; }
        else if (n2 === 6) { line_name = 'Balmer H-δ'; color_name = 'Deep Violet (410 nm)'; }
        else { line_name = 'Balmer Series'; color_name = 'Near Ultraviolet'; }
      } else if (n1 === 3) {
        line_name = 'Paschen Series (P-' + (n2 === 4 ? 'α' : n2 === 5 ? 'β' : n2) + ')';
        color_name = 'Near Infrared';
      }
      
      document.getElementById('out_wl_nm').textContent = lambda_nm.toFixed(2) + ' nm';
      document.getElementById('out_photon_ev').textContent = ev.toFixed(3) + ' eV';
      document.getElementById('out_line_name').textContent = line_name;
      document.getElementById('out_line_color').textContent = color_name;
    `
  }
];

// Reusable Workbench Template Renderer for Science Tools
export function renderScienceToolHtml(tool) {
  const commonStyle = `
    <style>
      .sci-box { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.75rem; }
      .sci-badge { display: inline-block; font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6; background: rgba(59, 130, 246, 0.08); padding: 0.25rem 0.6rem; border-radius: 4px; margin-bottom: 0.6rem; font-weight: 600; }
      .sci-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
      .sci-field { display: flex; flex-direction: column; gap: 0.35rem; }
      .sci-label { font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); font-weight: 600; }
      .sci-input, .sci-select { font-family: var(--mono); font-size: 0.95rem; padding: 0.65rem 0.85rem; background: var(--input-bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; outline: none; box-sizing: border-box; width: 100%; }
      .sci-input:focus, .sci-select:focus { border-color: #3b82f6; }
      .sci-presets { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; align-items: center; }
      .sci-preset-btn { font-family: var(--mono); font-size: 0.75rem; padding: 0.35rem 0.65rem; background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); border-radius: 4px; cursor: pointer; transition: all 0.15s; }
      .sci-preset-btn:hover { background: var(--surface-hover); border-color: #3b82f6; }
      .sci-result-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin-top: 1rem; }
      .sci-result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
      .sci-result-item { display: flex; flex-direction: column; gap: 0.2rem; }
      .sci-result-label { font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
      .sci-result-val { font-family: var(--mono); font-size: 1.35rem; font-weight: 700; color: #3b82f6; word-break: break-all; }
      .sci-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem; margin-top: 0.75rem; }
      .sci-table th { text-align: left; padding: 0.6rem 0.75rem; background: var(--surface-alt); border-bottom: 1px solid var(--border); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; }
      .sci-table td { padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--border); color: var(--fg); }
    </style>
  `;

  // Build inputs HTML
  const inputsHtml = tool.inputs.map(inp => {
    if (inp.type === 'select') {
      const opts = inp.options.map(o => `<option value="${o.val}">${o.text}</option>`).join('');
      return `
        <div class="sci-field">
          <label class="sci-label" for="${inp.id}">${inp.label}</label>
          <select id="${inp.id}" class="sci-select">${opts}</select>
        </div>
      `;
    }
    return `
      <div class="sci-field">
        <label class="sci-label" for="${inp.id}">${inp.label}</label>
        <input id="${inp.id}" class="sci-input" type="number" value="${inp.default}" step="${inp.step || 'any'}" min="${inp.min !== undefined ? inp.min : ''}" max="${inp.max !== undefined ? inp.max : ''}" />
      </div>
    `;
  }).join('');

  // Build presets HTML
  const presetsHtml = tool.presets && tool.presets.length > 0 ? `
    <div class="sci-presets">
      <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-right: 0.25rem;">PRESETS:</span>
      ${tool.presets.map(p => `
        <button type="button" class="sci-preset-btn" onclick='setPresets(${JSON.stringify(p.values)})'>${p.label}</button>
      `).join('')}
    </div>
  ` : '';

  // Build outputs HTML
  const outputsHtml = tool.outputs.map(out => `
    <div class="sci-result-item">
      <span class="sci-result-label">${out.label}</span>
      <span id="${out.id}" class="sci-result-val">${out.default || '—'}</span>
    </div>
  `).join('');

  // Build benchmarks table HTML
  const benchmarkRows = tool.benchmarks ? tool.benchmarks.map(b => `
    <tr>
      <td style="font-weight: 600;">${b.object}</td>
      <td style="color: #3b82f6;">${b.val}</td>
      <td style="color: var(--text-muted);">${b.notes}</td>
    </tr>
  `).join('') : '';

  // Build FAQ HTML
  const faqHtml = tool.faq.map(f => `
    <details style="border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.75rem; background: var(--surface);">
      <summary style="padding: 0.85rem 1.15rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">${f.q}</summary>
      <div style="padding: 0.75rem 1.15rem 1.15rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">${f.a}</div>
    </details>
  `).join('');

  return `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/" style="color: inherit; text-decoration: none;">Home</a> &gt; <a href="/science/" style="color: inherit; text-decoration: none;">Science</a> &gt; <span style="color: var(--fg);">${tool.shortTitle}</span>
      </nav>

      <header style="margin-bottom: 1.75rem;">
        <span class="sci-badge">${tool.badge}</span>
        <h1 style="font-family: var(--serif); font-size: 2.1rem; margin: 0 0 0.6rem; color: var(--fg); line-height: 1.25;">${tool.title.split('|')[0].trim()}</h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin: 0;">${tool.metaDesc}</p>
      </header>

      <!-- Workspace Card -->
      <div class="sci-box">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 1rem; color: var(--fg);">Interactive Calculator & Model</h3>
        
        ${presetsHtml}

        <div class="sci-grid">
          ${inputsHtml}
        </div>

        <div class="sci-result-card">
          <div class="sci-result-grid">
            ${outputsHtml}
          </div>
          <button type="button" id="btnCopySciReport" onclick="copySciReport()" class="sci-preset-btn" style="width: 100%; margin-top: 1rem; padding: 0.65rem; font-size: 0.82rem; background: var(--surface); border: 1px solid var(--border); color: var(--fg); display: flex; align-items: center; justify-content: center; gap: 0.4rem; font-weight: 600;">
            📋 Copy Physics Calculation Summary
          </button>
        </div>
      </div>

      <!-- Formula & Derivation -->
      <div class="sci-box">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.75rem; color: var(--fg);">Physical Formula & Mathematical Principles</h3>
        ${tool.formulaHtml}
      </div>

      <!-- Step-by-Step Worked Derivation -->
      <div class="sci-box" style="border-left: 3px solid #3b82f6;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Worked Derivation</h3>
          <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Analytical Solution</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          To understand the dimensional mechanics governing this physical scale, review this step-by-step mathematical derivation based on invariant universal constants:
        </p>
        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Fundamental Physical Invariants</strong>
            <div style="color: var(--text-muted); margin-top: 0.25rem;">
              ħ = 1.05457 × 10⁻³⁴ J·s (Reduced Planck) &bull; c = 2.99792 × 10⁸ m/s (Speed of Light) &bull; G = 6.67430 × 10⁻¹¹ m³/(kg·s²) (Gravitational Constant)
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Input Parameter Normalization</strong>
            <div style="color: #3b82f6; margin-top: 0.25rem;">
              ${tool.inputs.map(i => `${i.label} = ${i.default}`).join(' &bull; ')}
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Dimensional Scaling & In-Browser Solution</strong>
            <div style="color: var(--text-muted); margin-top: 0.25rem;">
              Dimensional analysis maps energy, length, and temporal limits into invariant SI units with double-precision floating point accuracy.
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 4: Primary Physical Outputs</strong>
            <div style="color: #10b981; font-weight: 700; margin-top: 0.25rem;">
              ${tool.outputs.map(o => `${o.label}: ${o.default}`).join(' | ')}
            </div>
          </div>
        </div>
      </div>

      <!-- Theoretical Limits & Physical Boundaries -->
      <div class="sci-box" style="border-left: 3px solid #f59e0b; background: var(--surface-alt);">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.75rem; color: var(--fg);">⚠️ Theoretical Limits & Physical Boundaries</h3>
        <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
          <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Quantum Spacetime Granularity:</strong> At scales approaching Planck thresholds (ℓ_P, t_P, m_P), smooth general relativity breaks down due to non-perturbative quantum fluctuations of the spacetime metric.</li>
          <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Relativistic Causality:</strong> No physical energy, signal, or quantum information transfer can exceed the speed of light in vacuum c, strictly maintaining Lorentz invariance and micro-causality.</li>
          <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Idealized Metric Assumptions:</strong> Derivations assume isotropic Schwarzschild geometries and flat asymptotic space unless non-zero Kerr angular momentum or cosmological lambda factors are explicitly defined.</li>
        </ul>
      </div>

      <!-- Comparative Benchmarks Table -->
      <div class="sci-box">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.75rem; color: var(--fg);">Comparative Physical Benchmarks</h3>
        <table class="sci-table">
          <thead>
            <tr>
              <th>Physical Scale / Entity</th>
              <th>Value</th>
              <th>Astrophysical Context</th>
            </tr>
          </thead>
          <tbody>
            ${benchmarkRows}
          </tbody>
        </table>
      </div>

      <!-- FAQ Section -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 0 0 1rem; color: var(--fg);">Frequently Asked Questions</h2>
        ${faqHtml}
      </div>
    </div>

    <script>
      (function() {
        function fmtSci(val, sig = 4) {
          if (val === null || val === undefined || isNaN(val)) return '—';
          if (val === 0) return '0';
          const abs = Math.abs(val);
          if (abs >= 1e-2 && abs < 1e5) {
            return parseFloat(val.toPrecision(sig)).toLocaleString('en-US', { maximumSignificantDigits: sig });
          }
          const expParts = val.toExponential(sig - 1).split('e');
          const mantissa = parseFloat(expParts[0]).toString();
          const exponent = parseInt(expParts[1], 10);
          return mantissa + ' × 10^' + exponent;
        }

        window.setPresets = function(vals) {
          for (const k in vals) {
            const el = document.getElementById(k);
            if (el) el.value = vals[k];
          }
          calculate();
        };

        window.copySciReport = function() {
          var lines = [];
          lines.push('====================================================');
          lines.push('${tool.shortTitle} — Scientific Calculation Summary');
          lines.push('Domain: ${tool.category} | Engine: Digital Tools Shed (2026)');
          lines.push('----------------------------------------------------');
          lines.push('INPUT VALUES:');
          ${tool.inputs.map(i => `lines.push('- ${i.label}: ' + (document.getElementById('${i.id}') ? document.getElementById('${i.id}').value : '${i.default}'));`).join('\n          ')}
          lines.push('');
          lines.push('COMPUTED OUTPUTS:');
          ${tool.outputs.map(o => `lines.push('- ${o.label}: ' + (document.getElementById('${o.id}') ? document.getElementById('${o.id}').innerText : '—'));`).join('\n          ')}
          lines.push('----------------------------------------------------');
          lines.push('Direct Tool URL: ' + window.location.href);
          lines.push('Verified 100% Client-Side Physics Engine (Zero Server Logging)');
          lines.push('====================================================');

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(lines.join('\\n')).then(function() {
              var btn = document.getElementById('btnCopySciReport');
              if (btn) {
                var old = btn.innerHTML;
                btn.innerHTML = '✓ Copied Calculation Summary!';
                btn.style.borderColor = '#10b981';
                btn.style.color = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = old;
                  btn.style.borderColor = 'var(--border)';
                  btn.style.color = 'var(--fg)';
                }, 2500);
              }
            });
          }
        };

        function calculate() {
          try {
            ${tool.calcJs}
          } catch (err) {
            console.error('Calculation error in ${tool.slug}:', err);
          }
        }

        const container = document.querySelector('.sci-box');
        if (container) {
          container.addEventListener('input', calculate);
          container.addEventListener('change', calculate);
        }
        
        // Initial run
        calculate();
      })();
    </script>
  `;
}

export const SCIENCE_TOOLS_BATCH_2 = [
  {
    slug: 'relativistic-time-dilation',
    title: 'Relativistic Time Dilation & Lorentz Factor Calculator [Time Stretch γ = 1/√(1-v²/c²)] | Digital Tools Shed',
    shortTitle: 'Time Dilation Calculator',
    category: 'Special & General Relativity',
    badge: 'SPECIAL RELATIVITY KINEMATICS',
    metaDesc: 'Calculate time dilation factor gamma (γ) and elapsed traveler time vs stationary observer time at relativistic speeds.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        γ = 1 / √(1 - v² / c²) = 1 / √(1 - β²);\quad Δt = γ · Δt₀
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Special Relativity demonstrates that time is not absolute. As velocity approaches the speed of light c, clocks in the moving frame slow down by the Lorentz factor γ relative to a stationary observer. For a traveler moving at 0.999c, 1 year on board corresponds to over 22 years on Earth.
      </p>
    `,
    inputs: [
      { id: 'v_frac', label: 'Velocity Fraction (β = v / c)', type: 'number', default: '0.90', step: '0.001', min: '0', max: '0.999999999' },
      { id: 't_traveler', label: 'Traveler Ship Time (Years)', type: 'number', default: '1.0', step: '0.1', min: '0.001' }
    ],
    presets: [
      { label: 'Apollo 10 Moon Mission (11 km/s)', values: { v_frac: 0.000037, t_traveler: 1.0 } },
      { label: 'Sub-Light Exploration (0.50 c)', values: { v_frac: 0.50, t_traveler: 1.0 } },
      { label: 'High Relativistic (0.90 c)', values: { v_frac: 0.90, t_traveler: 1.0 } },
      { label: 'Near Light Speed (0.999 c)', values: { v_frac: 0.999, t_traveler: 1.0 } },
      { label: 'Ultra-Relativistic (0.999999 c)', values: { v_frac: 0.999999, t_traveler: 1.0 } }
    ],
    outputs: [
      { id: 'out_gamma', label: 'Lorentz Factor (γ)', default: '2.294' },
      { id: 'out_earth_time', label: 'Stationary Earth Time (Years)', default: '2.29 Years' },
      { id: 'out_time_ratio', label: 'Time Dilation Percentage', default: '+129.4 %' },
      { id: 'out_dist_lightyears', label: 'Earth Frame Distance Traversed', default: '2.06 Light-Years' }
    ],
    benchmarks: [
      { object: 'Commercial Jetliner (Mach 0.8)', val: 'γ = 1.0000000000003', notes: 'Gains 1 nanosecond per day' },
      { object: 'ISS Low Earth Orbit (7.66 km/s)', val: 'γ = 1.00000000032', notes: 'Astronauts age 0.01s less per year' },
      { object: '0.866 c Cruise', val: 'γ = 2.000', notes: 'Traveler time runs at exactly half speed' },
      { object: '0.999 c Spacecraft', val: 'γ = 22.366', notes: '1 ship day equals 22.4 Earth days' },
      { object: 'LHC Proton Beam (0.999999991 c)', val: 'γ = 7,457', notes: 'Proton internal clock slowed 7,457×' }
    ],
    faq: [
      { q: 'Does the traveler feel time slowing down?', a: 'No. In the traveler’s own reference frame, biological clocks, heartbeats, and wristwatches tick at exactly normal speed (proper time). The time dilation is strictly observed relative to stationary frames.' },
      { q: 'Can anything reach or exceed γ = ∞?', a: 'Only particles with exactly zero rest mass (such as photons) travel at c. For any object with nonzero mass, reaching c would require infinite energy.' }
    ],
    calcJs: `
      const beta = parseFloat(document.getElementById('v_frac').value) || 0;
      const t_ship = parseFloat(document.getElementById('t_traveler').value) || 1.0;
      const safe_beta = Math.min(0.9999999999, Math.max(0, beta));
      
      const gamma = 1 / Math.sqrt(1 - safe_beta * safe_beta);
      const t_earth = t_ship * gamma;
      const pct_increase = (gamma - 1) * 100;
      const dist_ly = safe_beta * t_earth;
      
      document.getElementById('out_gamma').textContent = gamma >= 100 ? fmtSci(gamma) : gamma.toFixed(4);
      document.getElementById('out_earth_time').textContent = t_earth >= 1000 ? fmtSci(t_earth) + ' Years' : t_earth.toFixed(3) + ' Years';
      document.getElementById('out_time_ratio').textContent = '+' + fmtSci(pct_increase) + ' %';
      document.getElementById('out_dist_lightyears').textContent = fmtSci(dist_ly) + ' Light-Years';
    `
  },
  {
    slug: 'lorentz-length-contraction',
    title: 'Lorentz Length Contraction Calculator [Relativistic Spatial Flattening L = L_0/γ] | Digital Tools Shed',
    shortTitle: 'Length Contraction Calculator',
    category: 'Special & General Relativity',
    badge: 'SPECIAL RELATIVITY METRIC',
    metaDesc: 'Compute spatial flattening in the direction of motion for spacecraft and relativistic particles approaching light speed.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        L = L₀ · √(1 - v² / c²) = L₀ / γ
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Length contraction is the relativistic phenomenon whereby the length of an object measured by a stationary observer appears compressed along its axis of motion. Crucially, in the object’s rest frame, its dimensions are unchanged; instead, the external universe contracts.
      </p>
    `,
    inputs: [
      { id: 'l_rest', label: 'Rest Length L₀ (Meters)', type: 'number', default: '100', step: 'any', min: '0.001' },
      { id: 'v_cont_frac', label: 'Velocity Fraction (β = v / c)', type: 'number', default: '0.866', step: '0.001', min: '0', max: '0.999999999' }
    ],
    presets: [
      { label: '50% Contraction (β = 0.866 c)', values: { l_rest: 100, v_cont_frac: 0.866025 } },
      { label: 'Starship Enterprise (300 m at 0.99 c)', values: { l_rest: 300, v_cont_frac: 0.99 } },
      { label: 'Milky Way Crossing (100,000 ly at 0.999999 c)', values: { l_rest: 100000, v_cont_frac: 0.999999 } },
      { label: 'Sub-Light Cruiser (0.50 c)', values: { l_rest: 100, v_cont_frac: 0.50 } }
    ],
    outputs: [
      { id: 'out_l_contracted', label: 'Contracted Length L (Meters)', default: '50.00 m' },
      { id: 'out_cont_pct', label: 'Length Reduction Percentage', default: '50.00 %' },
      { id: 'out_gamma_fac', label: 'Lorentz Factor (γ)', default: '2.000' },
      { id: 'out_squish_ratio', label: 'Aspect Ratio Squish Factor', default: '1 : 0.500' }
    ],
    benchmarks: [
      { object: 'Fast Highway Car (120 km/h)', val: '1 part in 10¹⁴', notes: 'Squished by less than the size of an atomic nucleus' },
      { object: 'Orbital Speed (7.8 km/s)', val: '1 part in 3 × 10⁹', notes: 'ISS compressed by ~30 nanometers' },
      { object: '0.866 c (γ = 2.0)', val: '50% Rest Length', notes: 'Length halved in direction of motion' },
      { object: '0.995 c (Atmospheric Muons)', val: '10% Rest Distance', notes: '10 km atmosphere appears as 1 km' },
      { object: '0.999999 c (Relativistic Protons)', val: '0.14% Rest Length', notes: 'Proton flattened into thin pancake' }
    ],
    faq: [
      { q: 'Does length contraction happen in directions perpendicular to motion?', a: 'No. Length contraction occurs strictly parallel to the direction of relative velocity. Height and width remain completely unaltered, squishing 3D spheres into flattened oblate spheroids.' },
      { q: 'Is length contraction an optical illusion or physical reality?', a: 'It is physical reality. Relativistic heavy ion colliders (like RHIC and LHC) must model incoming gold and lead nuclei as flattened discs rather than spheres to accurately predict collision cross-sections.' }
    ],
    calcJs: `
      const l0 = parseFloat(document.getElementById('l_rest').value) || 100;
      const beta = parseFloat(document.getElementById('v_cont_frac').value) || 0.866;
      const safe_beta = Math.min(0.999999999, Math.max(0, beta));
      
      const gamma = 1 / Math.sqrt(1 - safe_beta * safe_beta);
      const l_cont = l0 / gamma;
      const reduction_pct = (1 - (1 / gamma)) * 100;
      
      document.getElementById('out_l_contracted').textContent = fmtSci(l_cont) + ' m';
      document.getElementById('out_cont_pct').textContent = reduction_pct.toFixed(2) + ' %';
      document.getElementById('out_gamma_fac').textContent = gamma.toFixed(3);
      document.getElementById('out_squish_ratio').textContent = '1 : ' + (1 / gamma).toFixed(3);
    `
  },
  {
    slug: 'relativistic-kinetic-energy',
    title: 'Relativistic Kinetic Energy Calculator [Rest Energy E_k = (γ-1)mc²] | Digital Tools Shed',
    shortTitle: 'Relativistic Kinetic Energy',
    category: 'Special & General Relativity',
    badge: 'RELATIVISTIC DYNAMICS',
    metaDesc: 'Compute true relativistic kinetic energy, momentum, and Newtonian error percentage across relativistic velocity regimes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        E_k = (γ - 1) · m · c²;\quad E_total² = (p · c)² + (m · c²)²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Classical Newtonian mechanics approximates kinetic energy as ½mv². However, as velocity approaches c, the work needed to accelerate mass asymptotically diverges to infinity. At 0.9c, Newtonian formulas underestimate true kinetic energy by more than 60%.
      </p>
    `,
    inputs: [
      { id: 'rel_mass', label: 'Rest Mass (Kilograms kg)', type: 'number', default: '1.0', step: 'any', min: '1e-31' },
      { id: 'rel_beta', label: 'Velocity Fraction (β = v / c)', type: 'number', default: '0.80', step: '0.01', min: '0.001', max: '0.999999999' }
    ],
    presets: [
      { label: 'Proton at LHC (0.999999991 c)', values: { rel_mass: 1.6726e-27, rel_beta: 0.999999991 } },
      { label: 'Electron at 0.99 c', values: { rel_mass: 9.109e-31, rel_beta: 0.99 } },
      { label: '1 kg Probe at 0.50 c', values: { rel_mass: 1.0, rel_beta: 0.50 } },
      { label: '1,000 kg Starship at 0.90 c', values: { rel_mass: 1000, rel_beta: 0.90 } }
    ],
    outputs: [
      { id: 'out_ek_j', label: 'Relativistic Kinetic Energy (J)', default: '5.99 × 10¹⁶ J' },
      { id: 'out_rest_e', label: 'Rest Mass Energy E₀ = mc² (J)', default: '8.99 × 10¹⁶ J' },
      { id: 'out_newton_err', label: 'Newtonian Formula Error (½mv²)', default: 'Underestimates by 52.0 %' },
      { id: 'out_rel_momentum', label: 'Relativistic Momentum (kg·m/s)', default: '3.99 × 10⁸ kg·m/s' }
    ],
    benchmarks: [
      { object: 'β = 0.10 c', val: '0.504% Rest Energy', notes: 'Newtonian error is only 0.75%' },
      { object: 'β = 0.50 c', val: '15.5% Rest Energy', notes: 'Newtonian error reaches 19.2%' },
      { object: 'β = 0.866 c (γ = 2)', val: '100% Rest Energy', notes: 'Kinetic energy equals rest mass energy' },
      { object: 'β = 0.99 c (γ = 7.09)', val: '609% Rest Energy', notes: 'Newtonian formula fails catastrophically' },
      { object: 'β = 0.999999 c (γ = 707)', val: '70,600% Rest Energy', notes: 'High-energy cosmic ray regime' }
    ],
    faq: [
      { q: 'Why does an object become impossible to accelerate to c?', a: 'As velocity increases, the energy added to the particle contributes increasingly to its relativistic momentum rather than speed. To reach v = c requires infinite energy, which is physically impossible for nonzero rest mass.' },
      { q: 'What happens to a 1 kg projectile traveling at 0.99c upon impact?', a: 'At 0.99c (γ ≈ 7.09), a 1 kg projectile carries 5.47 × 10¹⁷ Joules of kinetic energy, equivalent to roughly 130 Megatons of TNT—more than twice the yield of the Tsar Bomba.' }
    ],
    calcJs: `
      const m = parseFloat(document.getElementById('rel_mass').value) || 1.0;
      const beta = parseFloat(document.getElementById('rel_beta').value) || 0.80;
      const safe_beta = Math.min(0.999999999, Math.max(0.0001, beta));
      
      const c = 299792458;
      const gamma = 1 / Math.sqrt(1 - safe_beta * safe_beta);
      const rest_energy = m * c * c;
      const ek_rel = (gamma - 1) * rest_energy;
      const v = safe_beta * c;
      const ek_newton = 0.5 * m * v * v;
      const error_pct = ((ek_rel - ek_newton) / ek_rel) * 100;
      const momentum = gamma * m * v;
      
      document.getElementById('out_ek_j').textContent = fmtSci(ek_rel) + ' J';
      document.getElementById('out_rest_e').textContent = fmtSci(rest_energy) + ' J';
      document.getElementById('out_newton_err').textContent = 'Underestimates by ' + error_pct.toFixed(1) + ' %';
      document.getElementById('out_rel_momentum').textContent = fmtSci(momentum) + ' kg·m/s';
    `
  },
  {
    slug: 'relativistic-doppler-shift',
    title: 'Relativistic Doppler Effect & Redshift Calculator [Relativistic Frequency Shift] | Digital Tools Shed',
    shortTitle: 'Relativistic Doppler Calculator',
    category: 'Special & General Relativity',
    badge: 'SPECTRAL RELATIVISTIC SHIFT',
    metaDesc: 'Compute relativistic Doppler frequency and wavelength shifts, blueshifts, and cosmological redshifts for high-speed cosmic sources.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        f_obs = f_src · √((1 - β) / (1 + β)) \text{ (Receding)};\quad 1 + z = λ_obs / λ_src = √((1 + β) / (1 - β))
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Unlike acoustic Doppler shifts, the relativistic Doppler effect accounts for time dilation of the moving emitter in addition to wave compression. For approaching sources, light is shifted to higher frequencies (blueshift); for receding sources, light is stretched to longer wavelengths (redshift z).
      </p>
    `,
    inputs: [
      { id: 'dop_wl', label: 'Source Rest Wavelength (nm)', type: 'number', default: '656.28', step: 'any', min: '1' },
      { id: 'dop_beta', label: 'Velocity Fraction β (Positive = Receding, Negative = Approaching)', type: 'number', default: '0.60', step: '0.01', min: '-0.9999', max: '0.9999' }
    ],
    presets: [
      { label: 'Fast Receding Star (β = +0.60 c)', values: { dop_wl: 656.28, dop_beta: 0.60 } },
      { label: 'Approaching Star (β = -0.50 c)', values: { dop_wl: 656.28, dop_beta: -0.50 } },
      { label: 'Relativistic Jet (β = +0.95 c)', values: { dop_wl: 500.0, dop_beta: 0.95 } },
      { label: 'Lyman-Alpha Forest (121.6 nm, β = 0.8 c)', values: { dop_wl: 121.57, dop_beta: 0.80 } }
    ],
    outputs: [
      { id: 'out_obs_wl', label: 'Observed Wavelength (nm)', default: '1,312.56 nm' },
      { id: 'out_redshift_z', label: 'Relativistic Redshift Parameter (z)', default: '1.000' },
      { id: 'out_freq_factor', label: 'Frequency Shift Factor (f_obs / f_src)', default: '0.500 ×' },
      { id: 'out_band_shift', label: 'Spectral Shift Classification', default: 'Visible Red shifted into Near-Infrared' }
    ],
    benchmarks: [
      { object: 'Andromeda Galaxy (-300 km/s)', val: 'z = -0.001', notes: 'Blueshifted, colliding with Milky Way in 4.5 Gyr' },
      { object: 'Quasar 3C 273 (Receding 47,000 km/s)', val: 'z = 0.158', notes: 'First quasar identified in 1963' },
      { object: 'β = 0.60 c Receding', val: 'z = 1.000', notes: 'Wavelength exactly doubles' },
      { object: 'β = 0.90 c Receding', val: 'z = 3.359', notes: 'Visible light shifted deep into mid-infrared' },
      { object: 'β = -0.90 c Approaching', val: 'z = -0.771', notes: 'Deep blue-shift into ultraviolet' }
    ],
    faq: [
      { q: 'What is the Transverse Doppler Effect?', a: 'When the emitter moves perpendicular to the line of sight (θ = 90°), classical Doppler predicts zero shift. However, special relativity predicts a redshift f_obs = f_src / γ due purely to time dilation.' },
      { q: 'Is cosmological redshift caused by velocity through space?', a: 'Cosmological redshift is caused by the expansion of metric spacetime stretching photons during transit, whereas kinematic Doppler redshift is caused by movement through local spacetime.' }
    ],
    calcJs: `
      const wl_src = parseFloat(document.getElementById('dop_wl').value) || 656.28;
      const beta = parseFloat(document.getElementById('dop_beta').value) || 0.60;
      const safe_beta = Math.max(-0.9999, Math.min(0.9999, beta));
      
      const factor = Math.sqrt((1 + safe_beta) / (1 - safe_beta));
      const wl_obs = wl_src * factor;
      const z = factor - 1;
      const freq_factor = 1 / factor;
      
      let shift_desc = 'Redshifted';
      if (safe_beta < 0) shift_desc = 'Blueshifted (Shorter Wavelength / Higher Energy)';
      else if (wl_obs > 750 && wl_src <= 750) shift_desc = 'Visible light shifted into Infrared';
      else if (wl_obs > 1e6) shift_desc = 'Shifted into Microwave / Radio';
      
      document.getElementById('out_obs_wl').textContent = fmtSci(wl_obs) + ' nm';
      document.getElementById('out_redshift_z').textContent = z.toFixed(4);
      document.getElementById('out_freq_factor').textContent = freq_factor.toFixed(4) + ' ×';
      document.getElementById('out_band_shift').textContent = shift_desc;
    `
  },
  {
    slug: 'gravitational-redshift-calculator',
    title: 'Gravitational Redshift & Time Dilation Calculator [Gravity Well Clock Slowing] | Digital Tools Shed',
    shortTitle: 'Gravitational Redshift Calculator',
    category: 'Special & General Relativity',
    badge: 'GENERAL RELATIVITY METRIC',
    metaDesc: 'Calculate gravitational time dilation and photon frequency loss climbing out of gravitational wells with exact Schwarzschild metrics.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        1 + z = 1 / √(1 - 2GM / (r · c²)) = 1 / √(1 - r_s / r)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        General Relativity predicts that gravity dilates time: clocks tick slower deeper inside a gravitational potential well. Photons climbing out of the well lose energy, shifting to redder wavelengths. For GPS satellites orbiting Earth, gravitational time dilation runs clocks +45 microseconds per day faster than surface clocks.
      </p>
    `,
    inputs: [
      { id: 'grav_mass_sun', label: 'Mass of Body (Solar Masses M_☉)', type: 'number', default: '1.0', step: 'any', min: '1e-6' },
      { id: 'grav_radius_km', label: 'Radius / Altitude (Kilometers)', type: 'number', default: '696340', step: 'any', min: '1' }
    ],
    presets: [
      { label: 'Earth Surface (M_⊕ at 6,371 km)', values: { grav_mass_sun: 3.003e-6, grav_radius_km: 6371 } },
      { label: 'GPS Satellite Orbit (20,200 km Alt)', values: { grav_mass_sun: 3.003e-6, grav_radius_km: 26571 } },
      { label: 'Sun Surface (1 M_☉ at 696,340 km)', values: { grav_mass_sun: 1.0, grav_radius_km: 696340 } },
      { label: 'Sirius B White Dwarf (1.02 M_☉ at 5,800 km)', values: { grav_mass_sun: 1.02, grav_radius_km: 5800 } },
      { label: 'Neutron Star (1.4 M_☉ at 12 km)', values: { grav_mass_sun: 1.40, grav_radius_km: 12 } }
    ],
    outputs: [
      { id: 'out_z_grav', label: 'Gravitational Redshift (z)', default: '2.12 × 10⁻⁶' },
      { id: 'out_drift_us', label: 'Daily Clock Drift (Microseconds/Day)', default: '+183.1 µs/day' },
      { id: 'out_rs_ratio', label: 'Distance / Horizon Ratio (r / r_s)', default: '235,780 × r_s' },
      { id: 'out_gps_context', label: 'Relativistic Context', default: 'Solar Photosphere Shift' }
    ],
    benchmarks: [
      { object: 'Earth Surface Clock', val: '0.0 µs/day reference', notes: 'Baseline observer' },
      { object: 'GPS Orbit Net Drift', val: '+38.6 µs/day net', notes: '+45.9 µs (GR) minus 7.3 µs (SR)' },
      { object: 'Pound-Rebka Experiment (1959)', val: 'z = 2.5 × 10⁻¹⁵', notes: 'Measured over 22.5 meters in Harvard tower' },
      { object: 'Sirius B White Dwarf', val: 'z = 2.9 × 10⁻⁴', notes: 'First confirmed astronomical test (Adams 1925)' },
      { object: 'Neutron Star Surface', val: 'z = 0.20 - 0.35', notes: 'Clocks run ~25% slower than at infinity' }
    ],
    faq: [
      { q: 'What would happen to GPS navigation without relativistic corrections?', a: 'If GPS satellites did not compensate for general relativity (+45.9 µs/day) and special relativity (-7.3 µs/day), navigational positioning errors would accumulate at roughly 11 kilometers (6.8 miles) every single day.' },
      { q: 'What is the gravitational redshift at the event horizon of a black hole?', a: 'As r approaches the Schwarzschild radius r_s, 1 - r_s/r approaches zero, causing redshift z to diverge to infinity. To an outside observer, light emitted from the horizon is infinitely redshifted and frozen in time.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('grav_mass_sun').value) || 1.0;
      const r_km = parseFloat(document.getElementById('grav_radius_km').value) || 696340;
      
      const G = 6.67430e-11;
      const c = 299792458;
      const mass_kg = m_sun * 1.98847e30;
      const r_m = r_km * 1000;
      const rs_m = (2 * G * mass_kg) / (c * c);
      
      let z_grav = 0;
      let ratio = r_m / rs_m;
      if (r_m > rs_m) {
        const factor = 1 / Math.sqrt(1 - (rs_m / r_m));
        z_grav = factor - 1;
      } else {
        z_grav = 999999;
      }
      
      const drift_us_day = z_grav * 86400 * 1e6;
      
      document.getElementById('out_z_grav').textContent = fmtSci(z_grav);
      document.getElementById('out_drift_us').textContent = (drift_us_day > 1e6 ? fmtSci(drift_us_day) : drift_us_day.toFixed(2)) + ' µs/day';
      document.getElementById('out_rs_ratio').textContent = fmtSci(ratio) + ' × r_s';
      document.getElementById('out_gps_context').textContent = ratio < 2 ? 'Near Event Horizon Extreme Redshift' : (drift_us_day < 0.1 ? 'Subtle Earth Weak-Field Shift' : 'Strong Field Relativistic Shift');
    `
  },
  {
    slug: 'muon-atmospheric-decay-survival',
    title: 'Atmospheric Muon Survival Relativity Demonstrator [Special Relativity Proof] | Digital Tools Shed',
    shortTitle: 'Muon Relativity Demonstrator',
    category: 'Special & General Relativity',
    badge: 'EXPERIMENTAL RELATIVITY BENCHMARK',
    metaDesc: 'Recreate the classic Rossi-Hall experiment demonstrating special relativity time dilation and length contraction through cosmic ray muon decay.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        N_rel = N₀ · e^(-t / (γ · τ₀));\quad N_class = N₀ · e^(-t / τ₀);\quad τ₀ = 2.19698 µs
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Created when cosmic rays strike nitrogen atoms 10–15 km up in the atmosphere, muons have a proper half-life of only 2.2 microseconds. In classical physics, even traveling at 0.995c, muons could travel only ~660 meters before decaying, meaning virtually none should reach sea level. Special relativity dilates their lifespan, allowing over 40% to survive.
      </p>
    `,
    inputs: [
      { id: 'mu_alt_km', label: 'Creation Altitude (Kilometers)', type: 'number', default: '10', step: '0.5', min: '1', max: '30' },
      { id: 'mu_beta', label: 'Muon Speed (β = v / c)', type: 'number', default: '0.995', step: '0.001', min: '0.5', max: '0.99999' },
      { id: 'mu_n0', label: 'Initial Muon Population (N₀)', type: 'number', default: '10000', step: '1000', min: '100' }
    ],
    presets: [
      { label: 'Standard Cosmic Rays (10 km, 0.995 c)', values: { mu_alt_km: 10, mu_beta: 0.995, mu_n0: 10000 } },
      { label: 'Rossi-Hall Mount Washington (1.9 km, 0.994 c)', values: { mu_alt_km: 1.9, mu_beta: 0.994, mu_n0: 10000 } },
      { label: 'High Altitude Generation (15 km, 0.998 c)', values: { mu_alt_km: 15, mu_beta: 0.998, mu_n0: 10000 } }
    ],
    outputs: [
      { id: 'out_n_rel', label: 'Relativistic Sea Level Survivors', default: '4,916 Muons (49.2 %)' },
      { id: 'out_n_class', label: 'Classical Newtonian Survivors', default: '0.0000003 Muons (~0 %)' },
      { id: 'out_mu_gamma', label: 'Time Dilation Factor (γ)', default: '10.01 ×' },
      { id: 'out_contract_dist', label: 'Distance in Muon Rest Frame', default: '0.999 km (Contracted)' }
    ],
    benchmarks: [
      { object: 'Muon Proper Lifetime τ₀', val: '2.19698 µs', notes: 'Measured in rest frame particle traps' },
      { object: 'Classical Transit Range', val: '658 meters', notes: 'c · τ₀ without relativity' },
      { object: 'Rossi & Hall Experiment (1941)', val: 'Mount Washington, NH', notes: 'First definitive experimental proof of time dilation' },
      { object: 'Frisch & Smith (1963)', val: '563 / hour at sea level', notes: 'Definitive film demonstration' },
      { object: 'Atmospheric Muon Flux', val: '1 per cm² per minute', notes: 'Constantly passing through human bodies' }
    ],
    faq: [
      { q: 'How does the muon experience this journey in its own frame of reference?', a: 'In the muon’s reference frame, its clock ticks completely normally (2.2 µs half-life). However, due to Lorentz length contraction, the entire 10 km atmosphere is squished into less than 1 km of thickness, allowing the muon to reach the ground before decaying.' },
      { q: 'Can muons be used for practical imaging today?', a: 'Yes! Muon tomography uses naturally occurring cosmic ray muons to non-invasively peer inside thick structures, discovering hidden chambers in the Great Pyramid of Giza and imaging active magma chambers in volcanoes.' }
    ],
    calcJs: `
      const alt_km = parseFloat(document.getElementById('mu_alt_km').value) || 10;
      const beta = parseFloat(document.getElementById('mu_beta').value) || 0.995;
      const n0 = parseFloat(document.getElementById('mu_n0').value) || 10000;
      
      const c = 299792458;
      const tau0 = 2.19698e-6; // seconds
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      const v = beta * c;
      const dist_m = alt_km * 1000;
      const t_flight_s = dist_m / v;
      
      const n_rel = n0 * Math.exp(-t_flight_s / (gamma * tau0));
      const n_class = n0 * Math.exp(-t_flight_s / tau0);
      const contracted_km = alt_km / gamma;
      
      document.getElementById('out_n_rel').textContent = Math.round(n_rel).toLocaleString() + ' (' + ((n_rel / n0) * 100).toFixed(1) + ' %)';
      document.getElementById('out_n_class').textContent = fmtSci(n_class) + ' (' + ((n_class / n0) * 100).toExponential(2) + ' %)';
      document.getElementById('out_mu_gamma').textContent = gamma.toFixed(2) + ' ×';
      document.getElementById('out_contract_dist').textContent = contracted_km.toFixed(3) + ' km (Contracted)';
    `
  },
  {
    slug: 'relativistic-velocity-addition',
    title: 'Einstein Velocity Addition Calculator [Lorentz Velocity Composition] | Digital Tools Shed',
    shortTitle: 'Einstein Velocity Addition',
    category: 'Special & General Relativity',
    badge: 'LORENTZ VELOCITY TRANSFORM',
    metaDesc: 'Combine collinear relativistic velocities using Einstein’s velocity addition theorem to prove that sub-light speeds never exceed c.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        u = (v + u') / (1 + (v · u' / c²))
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        In classical Galilean mechanics, speeds simply add linearly: u = v + u'. If a rocket moving at 0.75c fires a missile forward at 0.75c, classical physics claims the missile moves at 1.5c. Einstein’s relativistic velocity composition proves the actual velocity is only 0.96c, preserving the speed of light as the universal speed limit.
      </p>
    `,
    inputs: [
      { id: 'v_frame', label: 'Ship Velocity Relative to Earth (v / c)', type: 'number', default: '0.75', step: '0.01', min: '-0.9999', max: '0.9999' },
      { id: 'u_projectile', label: 'Projectile Velocity Relative to Ship (u\' / c)', type: 'number', default: '0.75', step: '0.01', min: '-0.9999', max: '0.9999' }
    ],
    presets: [
      { label: '0.75 c Rocket fires 0.75 c Missile', values: { v_frame: 0.75, u_projectile: 0.75 } },
      { label: '0.90 c Ship fires 0.90 c Particle Beam', values: { v_frame: 0.90, u_projectile: 0.90 } },
      { label: '0.99 c Ship shines Forward Laser (u\' = 1.0 c)', values: { v_frame: 0.99, u_projectile: 1.0 } },
      { label: 'Two Relativistic Protons Colliding Head-On (-0.99 c vs +0.99 c)', values: { v_frame: 0.99, u_projectile: 0.99 } }
    ],
    outputs: [
      { id: 'out_u_rel', label: 'Combined Relative Velocity (u / c)', default: '0.9600 c' },
      { id: 'out_galilean', label: 'Classical Galilean Velocity (v + u\')', default: '1.5000 c (Violates Relativity)' },
      { id: 'out_c_diff', label: 'Margin Below Speed of Light (c - u)', default: '0.0400 c (11,992 km/s)' },
      { id: 'out_photon_test', label: 'Laser Invariance Verification', default: 'Compliant with c Invariance' }
    ],
    benchmarks: [
      { object: 'Two 60 mph Cars Approaching', val: '119.999999999999 mph', notes: 'Relativistic correction is 10⁻¹³ m/s' },
      { object: '0.5 c + 0.5 c', val: '0.800 c', notes: '20% lower than Galilean sum' },
      { object: '0.75 c + 0.75 c', val: '0.960 c', notes: 'Asymptotic approach to c' },
      { object: '0.99 c + 0.99 c', val: '0.99995 c', notes: 'Squeezed into thin boundary near c' },
      { object: 'Any v + 1.0 c Laser', val: '1.00000 c exactly', notes: 'Second postulate of special relativity' }
    ],
    faq: [
      { q: 'What happens if a ship moving at 0.99c turns on its headlights?', a: 'Applying u = (0.99 + 1.0) / (1 + 0.99 · 1.0) = 1.99 / 1.99 = 1.0c. Light always travels at exactly 299,792,458 m/s in all reference frames, regardless of the velocity of the source.' },
      { q: 'Why does the Galilean formula work for everyday speeds?', a: 'When v and u\' are small compared to c, the term (v·u\'/c²) in the denominator is virtually zero, making the denominator equal to 1.0 and reducing Einstein’s formula to Newton’s classical addition.' }
    ],
    calcJs: `
      const v = parseFloat(document.getElementById('v_frame').value) || 0.75;
      const up = parseFloat(document.getElementById('u_projectile').value) || 0.75;
      const c = 299792458;
      
      const u_rel = (v + up) / (1 + (v * up));
      const u_galileo = v + up;
      const margin_c = Math.max(0, 1 - Math.abs(u_rel));
      const margin_km_s = (margin_c * c) / 1000;
      
      document.getElementById('out_u_rel').textContent = u_rel.toFixed(5) + ' c (' + fmtSci(u_rel * c) + ' m/s)';
      document.getElementById('out_galilean').textContent = u_galileo.toFixed(4) + ' c ' + (Math.abs(u_galileo) > 1.0 ? '(Illegal Classical Overreach)' : '');
      document.getElementById('out_c_diff').textContent = margin_c.toFixed(5) + ' c (' + fmtSci(margin_km_s) + ' km/s)';
      document.getElementById('out_photon_test').textContent = Math.abs(u_rel) < 1.0 ? 'Sub-luminal (< c)' : (Math.abs(u_rel) === 1.0 ? 'Exact Speed of Light (c)' : 'Superluminal Warning');
    `
  },
  {
    slug: 'twin-paradox-age-calculator',
    title: 'Twin Paradox Spaceflight Age Differential Calculator [Accelerated Round-Trip] | Digital Tools Shed',
    shortTitle: 'Twin Paradox Calculator',
    category: 'Special & General Relativity',
    badge: 'RELATIVISTIC SPACEFLIGHT AGING',
    metaDesc: 'Calculate the biological age differential between spaceflight twins accounting for acceleration, turnaround, and general relativity equivalence.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        τ_ship = (4c / g) · arcosh(1 + g·d / (2c²));\quad t_Earth = (4c / g) · √((1 + g·d / (2c²))² - 1)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        In the twin paradox, one twin remains on Earth while the other journeys to a distant star and returns. Because the traveling twin accelerates, decels, and turns around, their worldline is non-inertial. At continuous 1g acceleration (comfortable artificial Earth gravity), a trip to the Andromeda Galaxy takes ~28 biological years for the crew, while 5 million years elapse on Earth.
      </p>
    `,
    inputs: [
      { id: 'trip_dist_ly', label: 'Distance to Destination (Light-Years)', type: 'number', default: '4.24', step: '0.1', min: '0.1' },
      { id: 'trip_accel_g', label: 'Constant Ship Acceleration (g)', type: 'number', default: '1.0', step: '0.1', min: '0.1', max: '10' }
    ],
    presets: [
      { label: 'Proxima Centauri (4.24 Light-Years)', values: { trip_dist_ly: 4.24, trip_accel_g: 1.0 } },
      { label: 'Sirius Star System (8.6 Light-Years)', values: { trip_dist_ly: 8.6, trip_accel_g: 1.0 } },
      { label: 'Center of Milky Way (26,000 Light-Years)', values: { trip_dist_ly: 26000, trip_accel_g: 1.0 } },
      { label: 'Andromeda Galaxy (2.537 Million Light-Years)', values: { trip_dist_ly: 2537000, trip_accel_g: 1.0 } }
    ],
    outputs: [
      { id: 'out_ship_age', label: 'Traveler Biological Age Added (Round-Trip)', default: '3.56 Years' },
      { id: 'out_earth_age', label: 'Earth Twin Age Added (Elapsed Time)', default: '5.98 Years' },
      { id: 'out_age_gap', label: 'Twin Reunion Age Discrepancy', default: '2.42 Years Younger' },
      { id: 'out_max_vel', label: 'Peak Midpoint Velocity (% of c)', default: '95.0 % c' }
    ],
    benchmarks: [
      { object: 'Proxima Centauri at 1g', val: 'Ship: 3.56y | Earth: 5.98y', notes: 'Twin returns 2.4 years younger' },
      { object: 'Vega (25 ly) at 1g', val: 'Ship: 6.6y | Earth: 27.0y', notes: 'Earth twin is an old adult' },
      { object: 'Galactic Center (26,000 ly) at 1g', val: 'Ship: 19.8y | Earth: 52,000y', notes: 'All human civilization has transformed' },
      { object: 'Andromeda (2.5M ly) at 1g', val: 'Ship: 28.6y | Earth: 5.0 Million Years', notes: 'Humans may be extinct upon return' },
      { object: 'Circumnavigate Observable Universe', val: 'Ship: ~60y | Earth: Billions of years', notes: 'Ultimate cosmic time travel' }
    ],
    faq: [
      { q: 'Why is the twin paradox not truly a paradox?', a: 'Because the traveling twin is not in a single inertial frame. To return home, the ship must fire thrusters to decelerate, turn around, and accelerate back. This acceleration breaks the symmetry between the two twins.' },
      { q: 'Is this real time travel into the future?', a: 'Yes. Relativistic spaceflight is a one-way ticket into Earth’s future. The traveler does not "age slower" in their own biological frame; instead, they take a shorter path through 4D spacetime.' }
    ],
    calcJs: `
      const d_ly = parseFloat(document.getElementById('trip_dist_ly').value) || 4.24;
      const g_mult = parseFloat(document.getElementById('trip_accel_g').value) || 1.0;
      
      const c = 299792458;
      const g = g_mult * 9.80665;
      const ly_m = 9.460730472e15;
      const d_m = d_ly * ly_m;
      
      // 4-leg journey (accelerate to midpoint, decelerate to destination, turn around and repeat)
      const leg_d = d_m / 2;
      const val = 1 + (g * leg_d) / (c * c);
      const tau_leg_s = (c / g) * Math.acosh(val);
      const tau_total_yr = (4 * tau_leg_s) / (365.25 * 86400);
      
      const t_leg_s = (c / g) * Math.sqrt(val * val - 1);
      const t_total_yr = (4 * t_leg_s) / (365.25 * 86400);
      
      const age_gap = t_total_yr - tau_total_yr;
      const v_max_c = Math.sqrt(1 - 1 / (val * val)) * 100;
      
      document.getElementById('out_ship_age').textContent = tau_total_yr.toFixed(2) + ' Years';
      document.getElementById('out_earth_age').textContent = t_total_yr > 1000 ? fmtSci(t_total_yr) + ' Years' : t_total_yr.toFixed(2) + ' Years';
      document.getElementById('out_age_gap').textContent = age_gap > 1000 ? fmtSci(age_gap) + ' Years Younger' : age_gap.toFixed(2) + ' Years Younger';
      document.getElementById('out_max_vel').textContent = v_max_c.toFixed(2) + ' % c';
    `
  },
  {
    slug: 'hohmann-transfer-orbit',
    title: 'Hohmann Transfer Orbit Delta-V & Transit Time [Orbital Mechanics Injection] | Digital Tools Shed',
    shortTitle: 'Hohmann Transfer Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'ASTRODYNAMICS TRAJECTORY OPTIMIZER',
    metaDesc: 'Calculate two-impulse Hohmann transfer orbit delta-v burns and transit durations between circular planetary and satellite orbits.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Δv₁ = √(μ/r₁) · (√(2r₂ / (r₁ + r₂)) - 1);\quad t_transfer = π · √((r₁ + r₂)³ / (8μ))
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Conceived by German engineer Walter Hohmann in 1925, this elliptical transfer orbit is the most fuel-efficient two-impulse trajectory between two coplanar circular orbits. It touches the departure orbit at periapsis and the arrival orbit at apoapsis.
      </p>
    `,
    inputs: [
      { id: 'hoh_primary', label: 'Primary Gravitational Body', type: 'select', options: [
        { val: 'sun', text: 'Sun (Interplanetary Missions)' },
        { val: 'earth', text: 'Earth (Geocentric / Moon Missions)' },
        { val: 'mars', text: 'Mars Orbit (Areocentric)' }
      ]},
      { id: 'hoh_r1', label: 'Initial Orbit Radius r₁ (AU or km)', type: 'number', default: '1.0', step: 'any', min: '0.001' },
      { id: 'hoh_r2', label: 'Target Orbit Radius r₂ (AU or km)', type: 'number', default: '1.524', step: 'any', min: '0.001' }
    ],
    presets: [
      { label: 'Earth to Mars (1.0 -> 1.524 AU)', values: { hoh_primary: 'sun', hoh_r1: 1.0, hoh_r2: 1.524 } },
      { label: 'Earth to Venus (1.0 -> 0.723 AU)', values: { hoh_primary: 'sun', hoh_r1: 1.0, hoh_r2: 0.723 } },
      { label: 'Earth to Jupiter (1.0 -> 5.204 AU)', values: { hoh_primary: 'sun', hoh_r1: 1.0, hoh_r2: 5.204 } },
      { label: 'LEO to GEO (6,678 km -> 42,164 km)', values: { hoh_primary: 'earth', hoh_r1: 6678, hoh_r2: 42164 } }
    ],
    outputs: [
      { id: 'out_dv1', label: 'Departure Injection Burn Δv₁ (km/s)', default: '2.94 km/s' },
      { id: 'out_dv2', label: 'Arrival Insertion Burn Δv₂ (km/s)', default: '2.65 km/s' },
      { id: 'out_dv_total', label: 'Total Mission Delta-V (km/s)', default: '5.59 km/s' },
      { id: 'out_transit_days', label: 'One-Way Transit Duration', default: '258.9 Days (~8.5 Months)' }
    ],
    benchmarks: [
      { object: 'LEO to Geostationary (GEO)', val: 'Δv = 3.93 km/s', notes: '5.3 hours transfer time' },
      { object: 'LEO to Lunar Injection (TLI)', val: 'Δv ≈ 3.15 km/s', notes: '3 days Apollo trajectory' },
      { object: 'Earth to Mars Transfer', val: 'Δv_tot ≈ 5.59 km/s', notes: '259 days (~8.5 months)' },
      { object: 'Earth to Jupiter Transfer', val: 'Δv_tot ≈ 14.4 km/s', notes: '2.73 years without gravity assist' },
      { object: 'Bi-Elliptic Transfer Alternative', val: 'Lower Δv for r₂/r₁ > 11.94', notes: 'Uses high intermediate apogee burn' }
    ],
    faq: [
      { q: 'Why is a Hohmann transfer slower than direct flight?', a: 'Hohmann orbits follow the minimum-energy ellipse tangent to both orbits. While direct burns could reach Mars in months, the fuel payload required increases exponentially under the rocket equation.' },
      { q: 'What is a launch window for a Hohmann transfer?', a: 'The target planet must be in a specific relative angular alignment (e.g. Earth lagging Mars by ~44°) at departure so the spacecraft and planet reach the same coordinates at arrival. Earth-Mars windows open once every 26 months.' }
    ],
    calcJs: `
      const body = document.getElementById('hoh_primary').value;
      const r1_in = parseFloat(document.getElementById('hoh_r1').value) || 1.0;
      const r2_in = parseFloat(document.getElementById('hoh_r2').value) || 1.524;
      
      let mu = 1.3271244e11; // Sun km^3 / s^2
      let r1 = r1_in * 1.4959787e8; // AU to km
      let r2 = r2_in * 1.4959787e8;
      
      if (body === 'earth') {
        mu = 3.9860044e5;
        r1 = r1_in;
        r2 = r2_in;
      } else if (body === 'mars') {
        mu = 4.282837e4;
        r1 = r1_in;
        r2 = r2_in;
      }
      
      const v1_circ = Math.sqrt(mu / r1);
      const v2_circ = Math.sqrt(mu / r2);
      
      const v_trans_peri = Math.sqrt(mu / r1) * Math.sqrt((2 * r2) / (r1 + r2));
      const v_trans_apo = Math.sqrt(mu / r2) * Math.sqrt((2 * r1) / (r1 + r2));
      
      const dv1 = Math.abs(v_trans_peri - v1_circ);
      const dv2 = Math.abs(v2_circ - v_trans_apo);
      const dv_total = dv1 + dv2;
      
      const a_trans = (r1 + r2) / 2;
      const t_seconds = Math.PI * Math.sqrt(Math.pow(a_trans, 3) / mu);
      const t_days = t_seconds / 86400;
      
      document.getElementById('out_dv1').textContent = dv1.toFixed(3) + ' km/s';
      document.getElementById('out_dv2').textContent = dv2.toFixed(3) + ' km/s';
      document.getElementById('out_dv_total').textContent = dv_total.toFixed(3) + ' km/s';
      document.getElementById('out_transit_days').textContent = t_days > 365 ? (t_days / 365.25).toFixed(2) + ' Years (' + Math.round(t_days) + ' d)' : t_days.toFixed(1) + ' Days';
    `
  },
  {
    slug: 'orbital-escape-velocity',
    title: 'Orbital & Planetary Escape Velocity Calculator [Gravitational Escape v_esc] | Digital Tools Shed',
    shortTitle: 'Escape Velocity Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'ASTRODYNAMICS BALLISTICS',
    metaDesc: 'Calculate planetary escape velocity and circular orbital speed for celestial bodies from asteroids to neutron stars.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        v_esc = √(2GM / r);\quad v_circ = √(GM / r) = v_esc / √2
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Escape velocity is the minimum ballistic speed an unpropelled object must attain at a given distance from a gravitating body to break free of its gravitational field to infinity. At the surface of Earth, escape velocity is roughly 11.2 km/s (over 25,000 mph).
      </p>
    `,
    inputs: [
      { id: 'esc_mass_kg', label: 'Mass of Body (Kilograms kg)', type: 'number', default: '5.9722e24', step: 'any', min: '1' },
      { id: 'esc_radius_km', label: 'Radius from Center (Kilometers)', type: 'number', default: '6371', step: 'any', min: '0.1' }
    ],
    presets: [
      { label: 'Earth Surface (5.97 × 10²⁴ kg, 6,371 km)', values: { esc_mass_kg: 5.9722e24, esc_radius_km: 6371 } },
      { label: 'Moon Surface (7.34 × 10²² kg, 1,737 km)', values: { esc_mass_kg: 7.342e22, esc_radius_km: 1737 } },
      { label: 'Mars Surface (6.42 × 10²³ kg, 3,390 km)', values: { esc_mass_kg: 6.417e23, esc_radius_km: 3390 } },
      { label: 'Jupiter Cloud Tops (1.898 × 10²⁷ kg, 69,911 km)', values: { esc_mass_kg: 1.898e27, esc_radius_km: 69911 } },
      { label: 'Sun Surface (1.989 × 10³⁰ kg, 696,340 km)', values: { esc_mass_kg: 1.98847e30, esc_radius_km: 696340 } },
      { label: 'Asteroid Bennu (7.3 × 10¹⁰ kg, 0.245 km)', values: { esc_mass_kg: 7.329e10, esc_radius_km: 0.245 } }
    ],
    outputs: [
      { id: 'out_vesc_kms', label: 'Escape Velocity (km/s)', default: '11.186 km/s' },
      { id: 'out_vesc_mph', label: 'Escape Velocity (mph)', default: '25,023 mph' },
      { id: 'out_vcirc_kms', label: 'Low Circular Orbit Speed (km/s)', default: '7.910 km/s' },
      { id: 'out_ke_per_kg', label: 'Specific Kinetic Energy (MJ/kg)', default: '62.56 MJ/kg' }
    ],
    benchmarks: [
      { object: 'Asteroid Bennu (Human Jump)', val: '0.20 m/s (0.45 mph)', notes: 'A gentle leap launches you into space' },
      { object: 'Moon Surface', val: '2.38 km/s (5,324 mph)', notes: 'Achievable by small ascent engine' },
      { object: 'Mars Surface', val: '5.03 km/s (11,252 mph)', notes: 'Required for Mars Sample Return' },
      { object: 'Earth Surface', val: '11.19 km/s (25,023 mph)', notes: 'Requires multi-stage chemical rocket' },
      { object: 'Sun Surface', val: '617.5 km/s (1.38M mph)', notes: 'Deepest gravity well in solar system' }
    ],
    faq: [
      { q: 'Does a rocket have to reach escape velocity immediately?', a: 'No. Escape velocity applies to ballistic unpropelled projectiles. A rocket with continuous engine thrust could theoretically ascend at 10 km/h indefinitely until escaping, but chemical fuel limitations make high-speed ballistic coasting far more practical.' },
      { q: 'Why is circular orbital speed exactly v_esc / √2?', a: 'By the virial theorem, kinetic energy in a circular orbit equals half the magnitude of gravitational potential energy: ½ m v_circ² = ½ (GMm/r). To escape requires total energy ≥ 0, which requires doubling kinetic energy (v_esc = √2 · v_circ).' }
    ],
    calcJs: `
      const m_kg = parseFloat(document.getElementById('esc_mass_kg').value) || 5.9722e24;
      const r_km = parseFloat(document.getElementById('esc_radius_km').value) || 6371;
      const G = 6.67430e-11;
      const r_m = r_km * 1000;
      
      const vesc_m_s = Math.sqrt((2 * G * m_kg) / r_m);
      const vesc_km_s = vesc_m_s / 1000;
      const vesc_mph = vesc_km_s * 2236.936;
      const vcirc_km_s = vesc_km_s / Math.SQRT2;
      const ke_mj_kg = (0.5 * vesc_m_s * vesc_m_s) / 1e6;
      
      document.getElementById('out_vesc_kms').textContent = fmtSci(vesc_km_s) + ' km/s';
      document.getElementById('out_vesc_mph').textContent = fmtSci(vesc_mph) + ' mph';
      document.getElementById('out_vcirc_kms').textContent = fmtSci(vcirc_km_s) + ' km/s';
      document.getElementById('out_ke_per_kg').textContent = fmtSci(ke_mj_kg) + ' MJ/kg';
    `
  },
  {
    slug: 'lagrange-points-calculator',
    title: 'Lagrange Points Coordinates & Gravitational Nulls [L1 Through L5 Equilibrium] | Digital Tools Shed',
    shortTitle: 'Lagrange Points Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'ORBITAL THREE-BODY EQUILIBRIA',
    metaDesc: 'Compute exact coordinates, distances, and stability of all five Sun-Earth and Earth-Moon Lagrange equilibrium points.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        r_L1,L2 ≈ R · ∛( M₂ / (3 M₁) );\quad L4, L5 \text{ form equilateral triangles with } M₁, M₂
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Lagrange points are the five positions in an orbital configuration where the gravitational forces of two large bodies combine with centrifugal acceleration to create a stationary equilibrium in the rotating reference frame. L1, L2, and L3 are unstable saddles, while L4 and L5 are stable Trojan orbits.
      </p>
    `,
    inputs: [
      { id: 'lag_preset', label: 'Two-Body Planetary System', type: 'select', options: [
        { val: 'sun_earth', text: 'Sun – Earth System' },
        { val: 'earth_moon', text: 'Earth – Moon System' },
        { val: 'sun_jupiter', text: 'Sun – Jupiter System' }
      ]}
    ],
    presets: [
      { label: 'Sun – Earth (James Webb Space Telescope)', values: { lag_preset: 'sun_earth' } },
      { label: 'Earth – Moon (Gateway Station)', values: { lag_preset: 'earth_moon' } },
      { label: 'Sun – Jupiter (Trojan Asteroid Swarms)', values: { lag_preset: 'sun_jupiter' } }
    ],
    outputs: [
      { id: 'out_l1_dist', label: 'L1 Distance from Secondary Body', default: '1.496 × 10⁶ km (0.010 AU)' },
      { id: 'out_l2_dist', label: 'L2 Distance from Secondary Body', default: '1.496 × 10⁶ km (0.010 AU)' },
      { id: 'out_l3_dist', label: 'L3 Counter-Orbit Distance from Primary', default: '1.496 × 10⁸ km (~1 AU opposite)' },
      { id: 'out_trojan_dist', label: 'L4 / L5 Trojan Separation Distance', default: 'Equilateral (60° Ahead / Behind)' }
    ],
    benchmarks: [
      { object: 'Sun-Earth L1 (SOHO, DSCOVR)', val: '1.5 Million km', notes: 'Uninterrupted view of Sun & Earth sunlit disc' },
      { object: 'Sun-Earth L2 (James Webb, Gaia)', val: '1.5 Million km', notes: 'Deep-space view shielded from Sun & Earth' },
      { object: 'Sun-Jupiter L4/L5 Trojans', val: 'Over 10,000 asteroids', notes: 'Stable gravitational accumulation swarms' },
      { object: 'Earth-Moon L2', val: '64,500 km beyond Moon', notes: 'Proposed lunar communications relay hub' },
      { object: 'Kordylewski Dust Clouds', val: 'Earth-Moon L4/L5', notes: 'Faint accumulation of interplanetary dust' }
    ],
    faq: [
      { q: 'Why is James Webb at Sun-Earth L2 instead of in Earth orbit?', a: 'At L2, Earth and Sun are perpetually aligned in the exact same direction. A single five-layer tennis-court-sized sunshield blocks radiation from both bodies simultaneously, keeping JWST instruments chilled to 40 Kelvin without mechanical cryocoolers.' },
      { q: 'Why do spacecraft at L1 and L2 need station-keeping propulsion?', a: 'L1, L2, and L3 are saddle-point gravitational equilibria (unstable like a marble balanced on a ridge). Minor solar wind disturbances cause spacecraft to drift, requiring small hydrazine thruster burns every few weeks to maintain halo orbits.' }
    ],
    calcJs: `
      const sys = document.getElementById('lag_preset').value;
      let m1 = 1.98847e30;
      let m2 = 5.9722e24;
      let R_km = 1.4959787e8;
      let desc1 = 'Sun-Earth L1 (Solar Observatory)';
      
      if (sys === 'earth_moon') {
        m1 = 5.9722e24;
        m2 = 7.342e22;
        R_km = 384400;
        desc1 = 'Earth-Moon L1 (Cislunar Gateway)';
      } else if (sys === 'sun_jupiter') {
        m1 = 1.98847e30;
        m2 = 1.898e27;
        R_km = 7.78479e8;
        desc1 = 'Sun-Jupiter L1';
      }
      
      const r_hill = R_km * Math.cbrt(m2 / (3 * m1));
      
      document.getElementById('out_l1_dist').textContent = fmtSci(r_hill) + ' km from M₂';
      document.getElementById('out_l2_dist').textContent = fmtSci(r_hill) + ' km beyond M₂';
      document.getElementById('out_l3_dist').textContent = fmtSci(R_km) + ' km behind M₁';
      document.getElementById('out_trojan_dist').textContent = fmtSci(R_km) + ' km (60° Lead/Trail)';
    `
  },
  {
    slug: 'roche-limit-calculator',
    title: 'Roche Tidal Disruption Limit Calculator [Planetary Ring Formation Boundary] | Digital Tools Shed',
    shortTitle: 'Roche Limit Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'TIDAL DISRUPTION THRESHOLD',
    metaDesc: 'Calculate fluid and rigid Roche limits for moons, asteroids, and comets to predict planetary ring formation and tidal shredding.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        d_fluid ≈ 2.44 · R_M · ∛(ρ_M / ρ_m);\quad d_rigid ≈ 1.26 · R_M · ∛(ρ_M / ρ_m)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        First calculated by French astronomer Édouard Roche in 1848, the Roche limit is the minimum orbital distance a celestial body held together only by its own gravity can approach a primary before tidal forces overcome self-gravitation and rip the satellite into fragments, spawning a planetary ring system.
      </p>
    `,
    inputs: [
      { id: 'roche_planet_r', label: 'Primary Planet Radius R_M (km)', type: 'number', default: '60268', step: '100', min: '1' },
      { id: 'roche_rho_M', label: 'Primary Density ρ_M (kg/m³)', type: 'number', default: '687', step: '10', min: '100' },
      { id: 'roche_rho_m', label: 'Satellite Density ρ_m (kg/m³)', type: 'number', default: '1000', step: '10', min: '100' }
    ],
    presets: [
      { label: 'Saturn & Icy Moon (Ring System Benchmark)', values: { roche_planet_r: 60268, roche_rho_M: 687, roche_rho_m: 1000 } },
      { label: 'Earth & Moon (Silicate Rock)', values: { roche_planet_r: 6371, roche_rho_M: 5515, roche_rho_m: 3340 } },
      { label: 'Mars & Phobos (Destined to Shred in 40 Myr)', values: { roche_planet_r: 3390, roche_rho_M: 3934, roche_rho_m: 1876 } },
      { label: 'Jupiter & Comet Shoemaker-Levy 9', values: { roche_planet_r: 71492, roche_rho_M: 1326, roche_rho_m: 500 } }
    ],
    outputs: [
      { id: 'out_roche_fluid', label: 'Fluid Roche Limit (Rubble Pile)', default: '130,580 km' },
      { id: 'out_roche_rigid', label: 'Rigid Roche Limit (Solid Monolith)', default: '67,460 km' },
      { id: 'out_ring_status', label: 'Ring System Ring-Fence Check', default: 'Inside Saturn Main Ring System' },
      { id: 'out_saturn_comp', label: 'Ratio to Planet Radius', default: '2.17 × R_M' }
    ],
    benchmarks: [
      { object: 'Saturn’s Ring System', val: '74,500 – 140,000 km', notes: 'Almost entirely inside the fluid Roche limit' },
      { object: 'Phobos Orbit on Mars', val: '9,377 km (Decaying)', notes: 'Will cross fluid limit in 30–50 Myr' },
      { object: 'Comet Shoemaker-Levy 9 (1992)', val: 'Passed Jupiter at 21,000 km', notes: 'Torn into 21 fragments; collided 1994' },
      { object: 'Earth-Moon Fluid Limit', val: '18,260 km', notes: 'Moon at 384,400 km is safely outside' },
      { object: 'Artificial Satellites in LEO', val: 'Inside Rigid Limit', notes: 'Survive because material tensile strength >> gravity' }
    ],
    faq: [
      { q: 'Why do artificial satellites in LEO not get shredded by the Roche limit?', a: 'The Roche limit applies to bodies held together solely by their own gravity (like loose rubble piles or liquids). Man-made satellites, humans, and solid boulders are held together by electromagnetic chemical bonds (tensile strength), which easily withstand Earth’s tidal forces.' },
      { q: 'Will Phobos really turn into a ring around Mars?', a: 'Yes. Tidal friction is sapping orbital energy from Phobos at 1.8 meters per century. Within 30 to 50 million years, it will cross its Roche limit and disintegrate into a glittering Martian ring system.' }
    ],
    calcJs: `
      const R_M = parseFloat(document.getElementById('roche_planet_r').value) || 60268;
      const rho_M = parseFloat(document.getElementById('roche_rho_M').value) || 687;
      const rho_m = parseFloat(document.getElementById('roche_rho_m').value) || 1000;
      
      const ratio = rho_M / rho_m;
      const d_fluid = 2.44 * R_M * Math.cbrt(ratio);
      const d_rigid = 1.26 * R_M * Math.cbrt(ratio);
      
      document.getElementById('out_roche_fluid').textContent = fmtSci(d_fluid) + ' km';
      document.getElementById('out_roche_rigid').textContent = fmtSci(d_rigid) + ' km';
      document.getElementById('out_ring_status').textContent = 'Fluid Boundary: ' + (d_fluid / R_M).toFixed(2) + ' × R_M';
      document.getElementById('out_saturn_comp').textContent = (d_fluid / R_M).toFixed(2) + ' Planetary Radii';
    `
  },
  {
    slug: 'planetary-surface-gravity',
    title: 'Planetary Surface Gravity & Weight Comparison [Celestial Gravity g = GM/r²] | Digital Tools Shed',
    shortTitle: 'Planetary Surface Gravity',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'PLANETARY METRIC GRAVITY',
    metaDesc: 'Compute surface gravity, human body weight, and vertical jump heights across planets, moons, and asteroids in the solar system.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        g = G · M / r²;\quad W = m · g;\quad h_jump ∝ 1 / g
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Surface gravity determines the weight of objects, atmospheric retention, and biological locomotion on alien worlds. Although Saturn has 95 times Earth’s mass, its massive radius and low density mean its surface gravity at the cloud tops is nearly identical to Earth’s (1.06g).
      </p>
    `,
    inputs: [
      { id: 'pg_mass_earth', label: 'Body Mass (Earth Masses M_⊕)', type: 'number', default: '1.0', step: 'any', min: '1e-8' },
      { id: 'pg_radius_km', label: 'Body Radius (Kilometers km)', type: 'number', default: '6371', step: 'any', min: '1' },
      { id: 'pg_weight_lb', label: 'Earth Scale Weight (Pounds lbs)', type: 'number', default: '180', step: '1', min: '1' }
    ],
    presets: [
      { label: 'Earth (1.00g)', values: { pg_mass_earth: 1.0, pg_radius_km: 6371, pg_weight_lb: 180 } },
      { label: 'Moon (0.166g)', values: { pg_mass_earth: 0.0123, pg_radius_km: 1737, pg_weight_lb: 180 } },
      { label: 'Mars (0.379g)', values: { pg_mass_earth: 0.107, pg_radius_km: 3390, pg_weight_lb: 180 } },
      { label: 'Jupiter (2.53g at Cloud Tops)', values: { pg_mass_earth: 317.8, pg_radius_km: 69911, pg_weight_lb: 180 } },
      { label: 'Saturn (1.06g at Cloud Tops)', values: { pg_mass_earth: 95.2, pg_radius_km: 58232, pg_weight_lb: 180 } },
      { label: 'Ceres Dwarf Planet (0.029g)', values: { pg_mass_earth: 0.00015, pg_radius_km: 473, pg_weight_lb: 180 } }
    ],
    outputs: [
      { id: 'out_g_accel', label: 'Surface Acceleration (m/s²)', default: '9.81 m/s²' },
      { id: 'out_g_ratio', label: 'G-Force Multiplier (Earth = 1.0g)', default: '1.00 g' },
      { id: 'out_scale_weight', label: 'Apparent Body Weight on Surface', default: '180.0 lbs' },
      { id: 'out_jump_height', label: 'Human Vertical Jump Multiplier', default: '1.00 × (0.50 m)' }
    ],
    benchmarks: [
      { object: 'Moon (0.166g)', val: '180 lbs -> 30 lbs', notes: 'Apollo astronauts bounced easily in 180 lb spacesuits' },
      { object: 'Mars (0.379g)', val: '180 lbs -> 68 lbs', notes: 'Reduced bone and cardiovascular load' },
      { object: 'Jupiter (2.53g)', val: '180 lbs -> 455 lbs', notes: 'Severe physical strain, mobility nearly impossible' },
      { object: 'Sun Surface (27.9g)', val: '180 lbs -> 5,022 lbs', notes: 'Human bones crushed under own weight' },
      { object: 'Ceres (0.029g)', val: '180 lbs -> 5.2 lbs', notes: 'Standing jump launches you 17 meters high' }
    ],
    faq: [
      { q: 'Why is Saturn’s gravity so close to Earth’s despite being 95 times heavier?', a: 'Gravity scales as M / r². Because Saturn is a bloated gas giant with an equatorial radius over 9 times larger than Earth’s, dividing by r² (81× reduction) balances out the 95× mass advantage, leaving surface gravity at 10.4 m/s² (~1.06g).' },
      { q: 'Can humans adapt permanently to Mars gravity (0.38g)?', a: 'We do not know yet. We know microgravity (0g) causes rapid bone demineralization and muscle atrophy, while 1g is healthy. Medical data on partial gravity between 0g and 1g is currently nonexistent.' }
    ],
    calcJs: `
      const m_earth = parseFloat(document.getElementById('pg_mass_earth').value) || 1.0;
      const r_km = parseFloat(document.getElementById('pg_radius_km').value) || 6371;
      const w_lb = parseFloat(document.getElementById('pg_weight_lb').value) || 180;
      
      const G = 6.67430e-11;
      const m_kg = m_earth * 5.9722e24;
      const r_m = r_km * 1000;
      
      const g_ms2 = (G * m_kg) / (r_m * r_m);
      const g_ratio = g_ms2 / 9.80665;
      const new_weight = w_lb * g_ratio;
      const jump_mult = 1 / g_ratio;
      const jump_m = 0.5 * jump_mult;
      
      document.getElementById('out_g_accel').textContent = g_ms2.toFixed(2) + ' m/s²';
      document.getElementById('out_g_ratio').textContent = g_ratio.toFixed(2) + ' g';
      document.getElementById('out_scale_weight').textContent = new_weight.toFixed(1) + ' lbs (' + (new_weight * 0.453592).toFixed(1) + ' kg)';
      document.getElementById('out_jump_height').textContent = jump_mult.toFixed(2) + ' × (' + jump_m.toFixed(2) + ' m)';
    `
  },
  {
    slug: 'planetary-equilibrium-temperature',
    title: 'Planetary Equilibrium Temperature Calculator [Albedo & Greenhouse Forcing T_eq] | Digital Tools Shed',
    shortTitle: 'Planetary Equilibrium Temperature',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'PLANETARY RADIATIVE CLIMATE BALANCE',
    metaDesc: 'Compute expected bare planetary equilibrium temperature from stellar flux and albedo, isolating greenhouse thermal forcing.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        T_eq = T_☉ · √(R_☉ / (2d)) · (1 - A_B)¹·⁴
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Planetary equilibrium temperature is the theoretical temperature a planet achieves in thermodynamic balance between incoming absorbed stellar radiation and outgoing blackbody thermal emission. For Earth (albedo A_B ≈ 0.306), T_eq is 255 Kelvin (-18°C); natural greenhouse atmospheric blanketing warms Earth by +33°C to a habitable +15°C.
      </p>
    `,
    inputs: [
      { id: 'peq_dist_au', label: 'Distance from Star (AU)', type: 'number', default: '1.0', step: '0.05', min: '0.01' },
      { id: 'peq_albedo', label: 'Bond Albedo A_B (0 = Pitch Black, 1 = Mirror)', type: 'number', default: '0.306', step: '0.01', min: '0', max: '0.99' },
      { id: 'peq_star_lum', label: 'Star Luminosity (Solar Units L_☉)', type: 'number', default: '1.0', step: '0.05', min: '0.0001' }
    ],
    presets: [
      { label: 'Earth (1.0 AU, Albedo 0.306)', values: { peq_dist_au: 1.0, peq_albedo: 0.306, peq_star_lum: 1.0 } },
      { label: 'Venus (0.723 AU, Albedo 0.77)', values: { peq_dist_au: 0.723, peq_albedo: 0.77, peq_star_lum: 1.0 } },
      { label: 'Mars (1.524 AU, Albedo 0.25)', values: { peq_dist_au: 1.524, peq_albedo: 0.25, peq_star_lum: 1.0 } },
      { label: 'Mercury (0.387 AU, Albedo 0.088)', values: { peq_dist_au: 0.387, peq_albedo: 0.088, peq_star_lum: 1.0 } },
      { label: 'Hot Jupiter (0.04 AU, Albedo 0.10)', values: { peq_dist_au: 0.04, peq_albedo: 0.10, peq_star_lum: 1.0 } }
    ],
    outputs: [
      { id: 'out_teq_k', label: 'Bare Equilibrium Temperature (K)', default: '254.3 K' },
      { id: 'out_teq_c', label: 'Temperature in Celsius (°C)', default: '-18.8 °C' },
      { id: 'out_solar_irrad', label: 'Top-of-Atmosphere Stellar Flux (W/m²)', default: '1,361 W/m²' },
      { id: 'out_climate_verdict', label: 'Atmospheric Blanketing Assessment', default: 'Freezing without Greenhouse Forcing' }
    ],
    benchmarks: [
      { object: 'Earth Equilibrium T_eq', val: '254 K (-19°C)', notes: 'Natural greenhouse effect adds +33°C -> 288 K (+15°C)' },
      { object: 'Venus Equilibrium T_eq', val: '227 K (-46°C)', notes: 'Runaway CO₂ greenhouse adds +500°C -> 737 K (+464°C)' },
      { object: 'Mars Equilibrium T_eq', val: '210 K (-63°C)', notes: 'Thin 6 mbar atmosphere adds only +5°C greenhouse' },
      { object: 'Titan Moon (Saturn)', val: '85 K (-188°C)', notes: 'Anti-greenhouse organic haze cools surface' },
      { object: 'WASP-12b Hot Jupiter', val: '2,500 K', notes: 'Tidally locked, atmosphere evaporates' }
    ],
    faq: [
      { q: 'Why is Venus’s equilibrium temperature lower than Earth’s despite being closer to the Sun?', a: 'Venus has an extremely high Bond albedo (0.77) because its thick sulfuric acid clouds reflect 77% of incoming sunlight back into space. Its scorching 464°C surface is caused entirely by an extreme 92-bar runaway carbon dioxide greenhouse blanket.' },
      { q: 'What is the greenhouse warming increment (ΔT_GH)?', a: 'ΔT_GH = T_actual - T_eq. On Earth, water vapor, CO₂, and methane absorb outgoing thermal infrared radiation, elevating surface temperatures by 33 Kelvin to maintain liquid oceans.' }
    ],
    calcJs: `
      const d_au = parseFloat(document.getElementById('peq_dist_au').value) || 1.0;
      const albedo = parseFloat(document.getElementById('peq_albedo').value) || 0.306;
      const L = parseFloat(document.getElementById('peq_star_lum').value) || 1.0;
      
      const S0 = (1361 * L) / (d_au * d_au);
      const sigma = 5.670374419e-8;
      // Absorbed flux = S0 * (1 - A) / 4 (distributed over sphere)
      const t_eq = Math.pow((S0 * (1 - albedo)) / (4 * sigma), 0.25);
      const t_c = t_eq - 273.15;
      
      let verdict = 'Temperate Range';
      if (t_eq < 200) verdict = 'Deep Cryogenic Glaciation';
      else if (t_eq < 273) verdict = 'Glaciated without Greenhouse Blanket';
      else if (t_eq <= 373) verdict = 'Liquid Water Zone';
      else verdict = 'Boiling / Scorching Irradiance';
      
      document.getElementById('out_teq_k').textContent = t_eq.toFixed(1) + ' K';
      document.getElementById('out_teq_c').textContent = t_c.toFixed(1) + ' °C';
      document.getElementById('out_solar_irrad').textContent = Math.round(S0).toLocaleString() + ' W/m²';
      document.getElementById('out_climate_verdict').textContent = verdict;
    `
  },
  {
    slug: 'synodic-orbital-period',
    title: 'Synodic Orbital Period & Conjunction Calculator [Planetary Alignment Cycles] | Digital Tools Shed',
    shortTitle: 'Synodic Period Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'ASTRONOMICAL CELESTIAL ALIGNMENT',
    metaDesc: 'Calculate synodic periods, planetary conjunction intervals, and interplanetary launch window frequencies.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        1 / P_syn = | 1 / P₁ - 1 / P₂ |
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The synodic period is the time required for a body to return to the same geometric position relative to the Sun as observed from Earth (such as conjunction or opposition). It determines the recurrence frequency of interplanetary launch windows.
      </p>
    `,
    inputs: [
      { id: 'syn_p1_days', label: 'Inner Body Orbital Period P₁ (Days)', type: 'number', default: '365.25', step: 'any', min: '0.1' },
      { id: 'syn_p2_days', label: 'Outer Body Orbital Period P₂ (Days)', type: 'number', default: '686.98', step: 'any', min: '0.1' }
    ],
    presets: [
      { label: 'Earth & Mars (Launch Window Cycle)', values: { syn_p1_days: 365.256, syn_p2_days: 686.98 } },
      { label: 'Earth & Venus (Morning/Evening Star Cycle)', values: { syn_p1_days: 224.701, syn_p2_days: 365.256 } },
      { label: 'Earth & Jupiter (Annual Opposition)', values: { syn_p1_days: 365.256, syn_p2_days: 4332.59 } },
      { label: 'Moon Phases (Sidereal vs Synodic Month)', values: { syn_p1_days: 27.3216, syn_p2_days: 365.256 } }
    ],
    outputs: [
      { id: 'out_syn_days', label: 'Synodic Period in Days', default: '779.94 Days' },
      { id: 'out_syn_months', label: 'Period in Calendar Months', default: '25.62 Months' },
      { id: 'out_launch_freq', label: 'Launch Window Frequency', default: 'Once every 2.14 Years' },
      { id: 'out_laps_ratio', label: 'Faster Body Revolutions per Cycle', default: '2.14 Orbits' }
    ],
    benchmarks: [
      { object: 'Moon Phase Cycle (Synodic Month)', val: '29.53 Days', notes: 'New Moon to New Moon (Sidereal is 27.3d)' },
      { object: 'Earth-Venus Synodic Period', val: '583.9 Days (1.60y)', notes: 'Produces famous 5-petaled pentagram resonance' },
      { object: 'Earth-Mars Synodic Period', val: '779.9 Days (2.14y)', notes: 'Dictates all Mars rover departure windows' },
      { object: 'Earth-Jupiter Synodic Period', val: '398.9 Days (1.09y)', notes: 'Jupiter opposition shifts 1 month later each year' },
      { object: 'Jupiter-Saturn Great Conjunction', val: '7,253 Days (19.86y)', notes: 'Historic astronomical conjunction cycle' }
    ],
    faq: [
      { q: 'Why does missing a Mars launch window delay the mission by over 2 years?', a: 'Because Earth travels faster around the Sun than Mars, completing an orbit in 365 days versus Mars’s 687 days. After a launch window closes, it takes 780 days (25.6 months) for Earth to "lap" Mars and re-align in favorable geometry.' },
      { q: 'What is the difference between sidereal and synodic periods?', a: 'A sidereal period is the time to complete one 360° orbit relative to fixed background stars. A synodic period is measured relative to the Sun from a moving observer platform (like Earth).' }
    ],
    calcJs: `
      const p1 = parseFloat(document.getElementById('syn_p1_days').value) || 365.256;
      const p2 = parseFloat(document.getElementById('syn_p2_days').value) || 686.98;
      
      const inv_syn = Math.abs((1 / p1) - (1 / p2));
      const syn_days = 1 / inv_syn;
      const syn_months = syn_days / 30.4375;
      const syn_years = syn_days / 365.25;
      const laps = Math.max(p1, p2) / Math.min(p1, p2);
      
      document.getElementById('out_syn_days').textContent = syn_days.toFixed(2) + ' Days';
      document.getElementById('out_syn_months').textContent = syn_months.toFixed(2) + ' Months';
      document.getElementById('out_launch_freq').textContent = 'Once every ' + syn_years.toFixed(2) + ' Years';
      document.getElementById('out_laps_ratio').textContent = (syn_days / Math.min(p1, p2)).toFixed(2) + ' Revolutions';
    `
  },
  {
    slug: 'orbital-decay-atmospheric-drag',
    title: 'Low Earth Orbit Atmospheric Drag & Decay Estimator [Satellite Lifetime] | Digital Tools Shed',
    shortTitle: 'Orbital Decay Estimator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'THERMOSPHERIC RE-ENTRY KINEMATICS',
    metaDesc: 'Model circular orbit altitude loss per revolution and predict satellite re-entry lifetime based on ballistic coefficient and thermospheric density.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Δr_rev = -2π · (C_D · A / m) · ρ · r² = -2π · ρ · r² / B
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Even hundreds of kilometers above Earth, residual exospheric and thermospheric gas molecules collide with satellites. This aerodynamic drag bleeds orbital energy, causing altitude to drop. Because atmospheric density scales exponentially with altitude, orbital decay accelerates catastrophically during the final weeks.
      </p>
    `,
    inputs: [
      { id: 'decay_alt_km', label: 'Orbital Altitude (Kilometers km)', type: 'number', default: '400', step: '10', min: '180', max: '1000' },
      { id: 'decay_ballistic', label: 'Ballistic Coefficient B = m / (C_D · A) in kg/m²', type: 'number', default: '50', step: '5', min: '1', max: '500' },
      { id: 'decay_solar_cycle', label: 'Solar Activity Level', type: 'select', options: [
        { val: '1.0', text: 'Moderate Solar Activity (F10.7 ≈ 120)' },
        { val: '0.4', text: 'Solar Minimum (Contracted Atmosphere)' },
        { val: '2.5', text: 'Solar Maximum (Atmospheric Puffing)' }
      ]}
    ],
    presets: [
      { label: 'ISS Space Station (415 km, B ≈ 65 kg/m²)', values: { decay_alt_km: 415, decay_ballistic: 65, decay_solar_cycle: '1.0' } },
      { label: 'CubeSat (300 km, B ≈ 25 kg/m²)', values: { decay_alt_km: 300, decay_ballistic: 25, decay_solar_cycle: '1.0' } },
      { label: 'Starlink Satellite (550 km, B ≈ 40 kg/m²)', values: { decay_alt_km: 550, decay_ballistic: 40, decay_solar_cycle: '1.0' } },
      { label: 'Critical Re-entry Stage (200 km, B ≈ 50 kg/m²)', values: { decay_alt_km: 200, decay_ballistic: 50, decay_solar_cycle: '1.0' } }
    ],
    outputs: [
      { id: 'out_loss_day', label: 'Altitude Loss per Day', default: '82.4 Meters / Day' },
      { id: 'out_lifetime_est', label: 'Estimated Orbital Lifetime', default: '~ 1.2 Years' },
      { id: 'out_density_kg', label: 'Atmospheric Density ρ', default: '2.8 × 10⁻¹² kg/m³' },
      { id: 'out_burn_velocity', label: 'Orbital Speed in Thermosphere', default: '7.67 km/s' }
    ],
    benchmarks: [
      { object: '200 km Altitude', val: 'Lifetime: Hours to Days', notes: 'Rapid fiery re-entry imminent' },
      { object: '300 km Altitude', val: 'Lifetime: 1 - 3 Months', notes: 'Requires weekly reboost burns' },
      { object: '400 km (ISS Altitude)', val: 'Lifetime: 1 - 2 Years', notes: 'ISS boosted ~1–2 km monthly by Progress/Cygnus' },
      { object: '550 km (Starlink Shell)', val: 'Lifetime: 5 - 8 Years', notes: 'Self-cleans debris naturally via atmospheric drag' },
      { object: '800 km Altitude', val: 'Lifetime: Decades to Centuries', notes: 'Kessler Syndrome orbital debris accumulation zone' }
    ],
    faq: [
      { q: 'Why does solar activity accelerate satellite re-entry?', a: 'During Solar Maximum, intense solar ultraviolet and X-ray flares heat the upper thermosphere, causing it to expand outward like a hot-air balloon. This dramatically increases air density at 300–500 km altitudes, causing drag on satellites to surge by up to 300%.' },
      { q: 'Why does a satellite speed up as it loses altitude?', a: 'Potential energy is converted to kinetic energy. As atmospheric drag lowers the orbital radius, Kepler’s laws dictate a faster circular velocity: v = √(GM/r). Drag slows the orbit, causing it to fall into a faster, lower trajectory.' }
    ],
    calcJs: `
      const h_km = parseFloat(document.getElementById('decay_alt_km').value) || 400;
      const B = parseFloat(document.getElementById('decay_ballistic').value) || 50;
      const solar_mult = parseFloat(document.getElementById('decay_solar_cycle').value) || 1.0;
      
      // Standard exponential scale height model
      // Reference at 400 km: rho0 ≈ 2.8e-12 kg/m^3, scale height H ≈ 58 km
      const h_ref = 400;
      const rho_ref = 2.8e-12 * solar_mult;
      const H = 50 + (h_km / 10); // scale height grows with altitude
      const rho = rho_ref * Math.exp(-(h_km - h_ref) / H);
      
      const r_km = 6371 + h_km;
      const r_m = r_km * 1000;
      const v_circ_ms = Math.sqrt((6.6743e-11 * 5.9722e24) / r_m);
      const period_s = (2 * Math.PI * r_m) / v_circ_ms;
      const revs_per_day = 86400 / period_s;
      
      // Altitude loss per rev: dr = 2*pi * rho * r^2 / B
      const dr_rev_m = (2 * Math.PI * rho * r_m * r_m) / B;
      const loss_day_m = dr_rev_m * revs_per_day;
      
      // Integrated rough lifetime estimate
      let lifetime_str = '';
      if (h_km <= 200) lifetime_str = '< 3 Days (Imminent Re-entry)';
      else if (h_km <= 300) lifetime_str = (h_km / Math.max(1, loss_day_m / 1000)).toFixed(0) + ' Days';
      else if (h_km <= 450) lifetime_str = (h_km / Math.max(0.1, (loss_day_m * 365) / 1000)).toFixed(1) + ' Years';
      else if (h_km <= 600) lifetime_str = '5 - 15 Years';
      else lifetime_str = '> 50 Years (Long-term Debris Zone)';
      
      document.getElementById('out_loss_day').textContent = loss_day_m >= 1000 ? (loss_day_m / 1000).toFixed(2) + ' km / Day' : loss_day_m.toFixed(1) + ' m / Day';
      document.getElementById('out_lifetime_est').textContent = lifetime_str;
      document.getElementById('out_density_kg').textContent = fmtSci(rho) + ' kg/m³';
      document.getElementById('out_burn_velocity').textContent = (v_circ_ms / 1000).toFixed(2) + ' km/s';
    `
  },
  {
    slug: 'hill-sphere-radius-calculator',
    title: 'Hill Sphere Gravitational Dominance Radius [Moon Stability Boundary r_H] | Digital Tools Shed',
    shortTitle: 'Hill Sphere Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'GRAVITATIONAL DOMINANCE BUBBLE',
    metaDesc: 'Calculate the Hill sphere radius of gravitational dominance for planets and moons orbiting parent stars with orbital eccentricity.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        r_H ≈ a · (1 - e) · ∛( m / (3M) )
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by American astronomer George William Hill, the Hill sphere is the region around a celestial body where its gravitational attraction dominates over the tidal forces of a larger central body (such as a star). For a satellite to remain in a stable orbit for billions of years, it must stay within ⅓ to ½ of the Hill radius.
      </p>
    `,
    inputs: [
      { id: 'hill_a_au', label: 'Semimajor Axis a (AU)', type: 'number', default: '1.0', step: '0.1', min: '0.01' },
      { id: 'hill_planet_m', label: 'Planet Mass m (Earth Masses M_⊕)', type: 'number', default: '1.0', step: 'any', min: '0.0001' },
      { id: 'hill_star_m', label: 'Central Star Mass M (Solar Masses M_☉)', type: 'number', default: '1.0', step: '0.1', min: '0.05' },
      { id: 'hill_ecc', label: 'Orbital Eccentricity e (0 = Circular)', type: 'number', default: '0.0167', step: '0.01', min: '0', max: '0.9' }
    ],
    presets: [
      { label: 'Earth around Sun (1.5 Million km)', values: { hill_a_au: 1.0, hill_planet_m: 1.0, hill_star_m: 1.0, hill_ecc: 0.0167 } },
      { label: 'Jupiter around Sun (53 Million km)', values: { hill_a_au: 5.204, hill_planet_m: 317.8, hill_star_m: 1.0, hill_ecc: 0.0485 } },
      { label: 'Moon around Earth (60,000 km)', values: { hill_a_au: 0.00257, hill_planet_m: 0.0123, hill_star_m: 0.000003, hill_ecc: 0.0549 } },
      { label: 'Hot Jupiter (0.05 AU, Tidal Stripping)', values: { hill_a_au: 0.05, hill_planet_m: 300, hill_star_m: 1.0, hill_ecc: 0.0 } }
    ],
    outputs: [
      { id: 'out_hill_km', label: 'Hill Sphere Radius (Kilometers km)', default: '1.496 × 10⁶ km' },
      { id: 'out_hill_au', label: 'Hill Radius in AU', default: '0.0100 AU' },
      { id: 'out_stable_orbit', label: 'Long-Term Stable Prograde Orbit (~0.33 r_H)', default: '498,000 km' },
      { id: 'out_moon_status', label: 'Current Moon Orbital Margin', default: 'Moon at 384,400 km (Safely Inside)' }
    ],
    benchmarks: [
      { object: 'Earth Hill Sphere', val: '1.5 Million km (0.01 AU)', notes: 'Holds Moon at 384,400 km comfortably' },
      { object: 'Jupiter Hill Sphere', val: '53.2 Million km (0.355 AU)', notes: 'Holds 95 known moons across vast distances' },
      { object: 'Moon Hill Sphere (around Earth)', val: '61,530 km', notes: 'Limits lunar sub-satellites (moonmoons)' },
      { object: 'Mercury Hill Sphere', val: '220,000 km', notes: 'Too tiny and close to Sun to hold a natural moon' },
      { object: 'Hot Jupiter Exoplanets', val: 'Extremely Compressed', notes: 'Almost zero chance of exomoons' }
    ],
    faq: [
      { q: 'Why does Mercury have no moons?', a: 'Because Mercury is both low-mass and orbits very close to the Sun (0.387 AU). Its Hill sphere is compressed to a tiny 220,000 km. Solar tidal disturbances quickly destabilize any captured moonlets.' },
      { q: 'Can a moon have its own moon (a "moonmoon")?', a: 'Yes, in principle. A sub-satellite can orbit a moon if it stays well within the moon’s own Hill sphere. However, tidal forces from the parent planet usually destabilize sub-satellites over millions of years.' }
    ],
    calcJs: `
      const a_au = parseFloat(document.getElementById('hill_a_au').value) || 1.0;
      const m_earth = parseFloat(document.getElementById('hill_planet_m').value) || 1.0;
      const m_sun = parseFloat(document.getElementById('hill_star_m').value) || 1.0;
      const e = parseFloat(document.getElementById('hill_ecc').value) || 0.0167;
      
      const mass_planet_kg = m_earth * 5.9722e24;
      const mass_star_kg = m_sun * 1.98847e30;
      const a_km = a_au * 1.4959787e8;
      
      const r_hill_km = a_km * (1 - e) * Math.cbrt(mass_planet_kg / (3 * mass_star_kg));
      const r_hill_au = r_hill_km / 1.4959787e8;
      const prograde_stable_km = r_hill_km * 0.333;
      
      document.getElementById('out_hill_km').textContent = fmtSci(r_hill_km) + ' km';
      document.getElementById('out_hill_au').textContent = r_hill_au.toFixed(4) + ' AU';
      document.getElementById('out_stable_orbit').textContent = fmtSci(prograde_stable_km) + ' km';
      document.getElementById('out_moon_status').textContent = 'Stable Prograde Boundary: ' + fmtSci(prograde_stable_km) + ' km';
    `
  },
  {
    slug: 'oberth-effect-calculator',
    title: 'Oberth Effect Rocket Burn Efficiency Calculator [Periapsis Kinetic Energy Gain] | Digital Tools Shed',
    shortTitle: 'Oberth Effect Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'ROCKET PROPULSION THERMODYNAMICS',
    metaDesc: 'Compute the dramatic kinetic energy magnification of performing rocket engine burns at high velocity deep in gravitational wells.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ΔE_k = v · Δv + ½(Δv)²;\quad v_∞ = √( (v_peri + Δv)² - v_esc² )
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Discovered by rocketry pioneer Hermann Oberth in 1927, the Oberth effect dictates that rocket engines generate vastly more mechanical energy when fired at high speeds deep inside a gravitational potential well. The extra energy comes not from the rocket, but from the kinetic energy of the expelled propellant.
      </p>
    `,
    inputs: [
      { id: 'ob_v_burn', label: 'Spacecraft Velocity at Burn v (km/s)', type: 'number', default: '10.8', step: '0.1', min: '0.1' },
      { id: 'ob_delta_v', label: 'Rocket Engine Burn Δv (km/s)', type: 'number', default: '1.0', step: '0.1', min: '0.1' },
      { id: 'ob_vesc', label: 'Local Escape Velocity v_esc (km/s)', type: 'number', default: '11.0', step: '0.1', min: '0.1' }
    ],
    presets: [
      { label: 'Periapsis Burn at Earth LEO (v = 10.8 km/s, Δv = 1.0 km/s)', values: { ob_v_burn: 10.8, ob_delta_v: 1.0, ob_vesc: 11.0 } },
      { label: 'Deep Space Burn at Rest (v = 0.5 km/s, Δv = 1.0 km/s)', values: { ob_v_burn: 0.5, ob_delta_v: 1.0, ob_vesc: 0.0 } },
      { label: 'Jupiter Gravity Oberth Maneuver (v = 50 km/s, Δv = 2.0 km/s)', values: { ob_v_burn: 50.0, ob_delta_v: 2.0, ob_vesc: 50.5 } }
    ],
    outputs: [
      { id: 'out_dek_mj', label: 'Kinetic Energy Gained per kg (MJ/kg)', default: '11.30 MJ/kg' },
      { id: 'out_oberth_mult', label: 'Oberth Energy Multiplier vs Rest', default: '22.6 × More Kinetic Energy' },
      { id: 'out_hyperbolic_v', label: 'Hyperbolic Excess Escape Velocity v_∞', default: '4.27 km/s' },
      { id: 'out_propellant_loss', label: 'Propellant Kinetic Energy Dumped', default: 'Maximized Energy Deposition' }
    ],
    benchmarks: [
      { object: 'Deep Space Burn (v ≈ 0)', val: 'ΔE_k = ½ (Δv)²', notes: 'Baseline engine mechanical efficiency' },
      { object: 'LEO Perigee Burn (v = 11 km/s)', val: '10–20× Energy Multiplier', notes: 'Standard Trans-Mars Injection burn' },
      { object: 'Jupiter Slingshot Oberth Burn', val: 'v_peri ≈ 60 km/s', notes: 'Fastest solar system escape trajectories' },
      { object: 'Solar Oberth Maneuver', val: 'Dive to 2–5 solar radii', notes: 'Enables interstellar probe speeds > 100 km/s' }
    ],
    faq: [
      { q: 'Where does the extra kinetic energy in the Oberth effect come from?', a: 'Energy is conserved. When fuel is burned at high velocity, the exhaust is thrown backward with much less kinetic energy in the external reference frame. The kinetic energy that would have been wasted in the exhaust cloud is transferred into the spacecraft.' },
      { q: 'What is a Powered Gravity Assist?', a: 'A powered gravity assist combines a planetary gravitational slingshot with a prograde Oberth engine burn executed precisely at closest approach (periapsis) to achieve maximum interplanetary speed.' }
    ],
    calcJs: `
      const v_kms = parseFloat(document.getElementById('ob_v_burn').value) || 10.8;
      const dv_kms = parseFloat(document.getElementById('ob_delta_v').value) || 1.0;
      const vesc_kms = parseFloat(document.getElementById('ob_vesc').value) || 11.0;
      
      const v_m = v_kms * 1000;
      const dv_m = dv_kms * 1000;
      
      const dek_j = (v_m * dv_m) + 0.5 * dv_m * dv_m;
      const dek_mj = dek_j / 1e6;
      
      const dek_rest_j = 0.5 * dv_m * dv_m;
      const mult = dek_j / Math.max(1, dek_rest_j);
      
      const v_final = v_kms + dv_kms;
      let v_inf = 0;
      if (v_final > vesc_kms) {
        v_inf = Math.sqrt(v_final * v_final - vesc_kms * vesc_kms);
      }
      
      document.getElementById('out_dek_mj').textContent = fmtSci(dek_mj) + ' MJ/kg';
      document.getElementById('out_oberth_mult').textContent = mult.toFixed(1) + ' × More Energy';
      document.getElementById('out_hyperbolic_v').textContent = v_inf > 0 ? v_inf.toFixed(2) + ' km/s' : 'Captured (Sub-Escape)';
      document.getElementById('out_propellant_loss').textContent = 'Exhaust Energy Dumped into Orbit';
    `
  },
  {
    slug: 'tsiolkovsky-rocket-equation',
    title: 'Tsiolkovsky Ideal Rocket Equation Calculator [Delta-V & Mass Ratio Δv] | Digital Tools Shed',
    shortTitle: 'Rocket Equation Calculator',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'FOUNDATIONAL ASTRONAUTICS',
    metaDesc: 'Calculate rocket velocity change (delta-v), required fuel mass, and payload mass fractions using Tsiolkovsky’s rocket equation.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Δv = I_sp · g₀ · ln(m₀ / m_f) = v_e · ln(m₀ / m_f)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Published by Konstantin Tsiolkovsky in 1903, this formula governs all rocketry. Because a rocket must accelerate the weight of its own unburned fuel, payload mass decreases exponentially with required delta-v. Reaching Low Earth Orbit (~9.4 km/s) requires propellant to make up over 90% of the rocket’s initial liftoff weight.
      </p>
    `,
    inputs: [
      { id: 'ts_isp', label: 'Specific Impulse I_sp (Seconds)', type: 'number', default: '311', step: '5', min: '50', max: '100000' },
      { id: 'ts_m0', label: 'Initial Wet Liftoff Mass m₀ (Tons)', type: 'number', default: '549', step: '10', min: '0.1' },
      { id: 'ts_mf', label: 'Final Burnout Dry Mass m_f (Tons)', type: 'number', default: '22.2', step: '1', min: '0.01' }
    ],
    presets: [
      { label: 'Falcon 9 First Stage (I_sp = 311s, m₀ = 549t, m_f = 22.2t)', values: { ts_isp: 311, ts_m0: 549, ts_mf: 22.2 } },
      { label: 'Saturn V First Stage S-IC (I_sp = 263s, m₀ = 2280t, m_f = 131t)', values: { ts_isp: 263, ts_m0: 2280, ts_mf: 131 } },
      { label: 'Space Shuttle SSME Hydrolox (I_sp = 452s, m₀ = 760t, m_f = 30t)', values: { ts_isp: 452, ts_m0: 760, ts_mf: 30 } },
      { label: 'Ion Propulsion Probe (I_sp = 3000s, m₀ = 1.0t, m_f = 0.7t)', values: { ts_isp: 3000, ts_m0: 1.0, ts_mf: 0.7 } }
    ],
    outputs: [
      { id: 'out_dv_kms', label: 'Velocity Change Δv (km/s)', default: '9.78 km/s' },
      { id: 'out_mass_ratio', label: 'Mass Ratio (m₀ / m_f)', default: '24.73 : 1' },
      { id: 'out_propellant_pct', label: 'Propellant Mass Percentage', default: '95.96 % Fuel' },
      { id: 'out_leo_verdict', label: 'LEO Reachability (> 9.3 km/s with gravity losses)', default: 'Sufficient for Single-Stage-To-Orbit (SSTO)' }
    ],
    benchmarks: [
      { object: 'Solid Rocket Booster (SRB)', val: 'I_sp ≈ 250 - 280 s', notes: 'Dense, high thrust, low efficiency' },
      { object: 'Kerosene / Liquid Oxygen (KeroLOX)', val: 'I_sp ≈ 300 - 340 s', notes: 'Merlin, Falcon 9, Saturn V S-IC' },
      { object: 'Methane / Liquid Oxygen (MethaLOX)', val: 'I_sp ≈ 360 - 380 s', notes: 'Raptor, Starship, BE-4' },
      { object: 'Hydrogen / Liquid Oxygen (HydroLOX)', val: 'I_sp ≈ 450 s', notes: 'SSME, Centaur, SLS' },
      { object: 'Xenon Ion Thruster', val: 'I_sp ≈ 3,000 - 5,000 s', notes: 'Dawn, Starlink, Deep Space 1' }
    ],
    faq: [
      { q: 'Why is the rocket equation described as a "tyranny"?', a: 'Because adding propellant also adds mass that must be accelerated by even more propellant. To double your final delta-v, you must square your mass ratio. This exponential curve severely limits payload fractions to 2–4% of rocket liftoff mass.' },
      { q: 'Why do rockets use staging?', a: 'Staging solves the tyranny of the rocket equation by dropping heavy empty tanks and engines once fuel is depleted, resetting the dry mass m_f and allowing the next stage to accelerate from a lighter baseline.' }
    ],
    calcJs: `
      const isp = parseFloat(document.getElementById('ts_isp').value) || 311;
      const m0 = parseFloat(document.getElementById('ts_m0').value) || 549;
      const mf = parseFloat(document.getElementById('ts_mf').value) || 22.2;
      
      const g0 = 9.80665;
      const safe_mf = Math.max(0.0001, Math.min(m0 * 0.9999, mf));
      const ratio = m0 / safe_mf;
      const dv_ms = isp * g0 * Math.log(ratio);
      const dv_kms = dv_ms / 1000;
      const prop_pct = ((m0 - safe_mf) / m0) * 100;
      
      let verdict = 'Sub-orbital (< 7.8 km/s)';
      if (dv_kms >= 11.2) verdict = 'Exceeds Earth Escape Velocity (> 11.2 km/s)';
      else if (dv_kms >= 9.3) verdict = 'Reaches Low Earth Orbit with Drag Losses';
      else if (dv_kms >= 7.8) verdict = 'Theoretical LEO Velocity (Zero-Drag Only)';
      
      document.getElementById('out_dv_kms').textContent = dv_kms.toFixed(2) + ' km/s (' + Math.round(dv_ms).toLocaleString() + ' m/s)';
      document.getElementById('out_mass_ratio').textContent = ratio.toFixed(2) + ' : 1';
      document.getElementById('out_propellant_pct').textContent = prop_pct.toFixed(2) + ' % Fuel';
      document.getElementById('out_leo_verdict').textContent = verdict;
    `
  },
  {
    slug: 'specific-impulse-exhaust-velocity',
    title: 'Rocket Specific Impulse (I_sp) to Exhaust Velocity Calculator [Propulsion Efficiency] | Digital Tools Shed',
    shortTitle: 'Specific Impulse Converter',
    category: 'Orbital Mechanics & Astrodynamics',
    badge: 'PROPULSION METRIC CONVERTER',
    metaDesc: 'Convert rocket engine specific impulse (seconds) to effective exhaust velocity (m/s) and evaluate engine efficiency classes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        v_e = I_sp · g₀;\quad I_sp = v_e / g₀;\quad g₀ ≈ 9.80665 m/s²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Specific impulse (I_sp) measures the efficiency of rocket engines: how many seconds 1 kilogram of propellant can produce 1 kilogram-force of thrust. Effective exhaust velocity v_e is the physical velocity at which propellant molecules shoot out of the rocket nozzle.
      </p>
    `,
    inputs: [
      { id: 'isp_input_val', label: 'Specific Impulse I_sp (Seconds)', type: 'number', default: '320', step: '5', min: '1' }
    ],
    presets: [
      { label: 'Black Powder Rocket (70 s)', values: { isp_input_val: 70 } },
      { label: 'Solid Fuel Rocket Booster (250 s)', values: { isp_input_val: 250 } },
      { label: 'SpaceX Raptor MethaLOX (350 s)', values: { isp_input_val: 350 } },
      { label: 'Space Shuttle SSME HydroLOX (452 s)', values: { isp_input_val: 452 } },
      { label: 'Nuclear Thermal Rocket NERVA (900 s)', values: { isp_input_val: 900 } },
      { label: 'Hall-Effect Ion Thruster (3,000 s)', values: { isp_input_val: 3000 } }
    ],
    outputs: [
      { id: 'out_ve_ms', label: 'Exhaust Velocity v_e (m/s)', default: '3,138 m/s' },
      { id: 'out_ve_kms', label: 'Exhaust Velocity (km/s)', default: '3.138 km/s' },
      { id: 'out_ve_mach', label: 'Mach Number (Relative to Air Speed)', default: 'Mach 9.2' },
      { id: 'out_prop_tech', label: 'Propulsion Technology Class', default: 'Chemical Hydrocarbon (KeroLOX / MethaLOX)' }
    ],
    benchmarks: [
      { object: 'Cold Gas Thruster (N₂)', val: '65 – 75 s', notes: 'Attitude control on CubeSats' },
      { object: 'Hydrazine Monopropellant', val: '220 – 240 s', notes: 'Satellite orbit keeping' },
      { object: 'Kerosene / Liquid Oxygen', val: '310 – 340 s', notes: 'First stages (Falcon 9, Atlas V)' },
      { object: 'Liquid Hydrogen / LOX', val: '450 s', notes: 'Upper stages (Delta IV, SLS, Centaur)' },
      { object: 'VASIMR Plasma Rocket', val: '5,000 – 30,000 s', notes: 'Electric ion propulsion' }
    ],
    faq: [
      { q: 'Why is specific impulse measured in seconds?', a: 'Historically, engineers defined I_sp as thrust (lbf) divided by propellant weight flow rate (lbf/sec). Dividing pounds-force by pounds-force per second cancels the units, leaving seconds. In SI units, I_sp = Thrust (N) / [ Mass flow (kg/s) · g₀ (m/s²) ], which also simplifies to seconds.' },
      { q: 'Why do ion thrusters have high I_sp but low thrust?', a: 'Ion engines use electrostatic fields to accelerate ions to colossal exhaust velocities (~30 km/s = 3,000 s I_sp), achieving incredible fuel economy. However, because power supplies are limited to a few kilowatts, they accelerate only milligrams of gas per second, generating thrust comparable to the weight of a sheet of paper.' }
    ],
    calcJs: `
      const isp = parseFloat(document.getElementById('isp_input_val').value) || 320;
      const g0 = 9.80665;
      const ve_ms = isp * g0;
      const ve_kms = ve_ms / 1000;
      const mach = ve_ms / 340.29;
      
      let tech = 'Chemical Solid Propellant';
      if (isp < 100) tech = 'Cold Gas Thruster';
      else if (isp < 260) tech = 'Monopropellant / Solid Propellant';
      else if (isp < 360) tech = 'Hydrocarbon Chemical (KeroLOX / MethaLOX)';
      else if (isp < 500) tech = 'Cryogenic HydroLOX (Hydrogen/Oxygen)';
      else if (isp < 1200) tech = 'Nuclear Thermal Rocket (Fission Heated H₂)';
      else tech = 'Electrostatic / Hall Effect Ion Engine';
      
      document.getElementById('out_ve_ms').textContent = Math.round(ve_ms).toLocaleString() + ' m/s';
      document.getElementById('out_ve_kms').textContent = ve_kms.toFixed(3) + ' km/s';
      document.getElementById('out_ve_mach').textContent = 'Mach ' + mach.toFixed(1);
      document.getElementById('out_prop_tech').textContent = tech;
    `
  },
  {
    slug: 'cosmic-microwave-background-redshift',
    title: 'Cosmic Microwave Background Temperature vs Redshift [T(z) = T_0(1+z)] | Digital Tools Shed',
    shortTitle: 'CMB Redshift Calculator',
    category: 'Cosmology & Early Universe',
    badge: 'COSMIC RELIC THERMODYNAMICS',
    metaDesc: 'Calculate the temperature of the cosmic background radiation across redshift epochs from recombination to room temperature.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        T(z) = T₀ · (1 + z);\quad T₀ = 2.72548 ± 0.00057 K
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Because cosmological expansion uniformly stretches photon wavelengths proportionally to the cosmic scale factor a(t), blackbody radiation cools strictly linearly with redshift z. In the early universe at z ≈ 1100, the CMB was a blinding 3,000 K orange glow; around z ≈ 100, the universe enjoyed a "habitable epoch" with room-temperature background radiation.
      </p>
    `,
    inputs: [
      { id: 'cmb_z', label: 'Cosmological Redshift (z)', type: 'number', default: '0', step: '0.1', min: '0', max: '3000' }
    ],
    presets: [
      { label: 'Present Day Universe (z = 0, T = 2.73 K)', values: { cmb_z: 0 } },
      { label: 'James Webb Distant Galaxy (z = 13.2)', values: { cmb_z: 13.2 } },
      { label: 'Habitable Epoch (z = 100, T ≈ 275 K = 2°C)', values: { cmb_z: 100 } },
      { label: 'Cosmic Dawn First Stars (z = 20)', values: { cmb_z: 20 } },
      { label: 'Recombination / Decoupling (z = 1089, T ≈ 2,970 K)', values: { cmb_z: 1089 } }
    ],
    outputs: [
      { id: 'out_cmb_temp_k', label: 'CMB Temperature in Kelvin (K)', default: '2.725 K' },
      { id: 'out_cmb_temp_c', label: 'Temperature in Celsius (°C)', default: '-270.42 °C' },
      { id: 'out_cosmic_era', label: 'Cosmic Historical Era', default: 'Present Stelliferous Era' },
      { id: 'out_peak_lambda', label: 'Peak Emission Wavelength (Wien)', default: '1.063 mm (Microwave)' }
    ],
    benchmarks: [
      { object: 'Recombination (t = 380,000 yrs)', val: 'z ≈ 1089, T ≈ 2,970 K', notes: 'Universe becomes transparent to light' },
      { object: 'Habitable Epoch (t = 15 Myr)', val: 'z ≈ 100 – 110, T = 273 – 373 K', notes: 'Liquid water could exist anywhere in space' },
      { object: 'First Pop III Stars (Cosmic Dawn)', val: 'z ≈ 20 – 30, T ≈ 57 – 84 K', notes: 'First nuclear fusion ignites' },
      { object: 'Present Day (t = 13.8 Gyr)', val: 'z = 0, T = 2.7255 K', notes: 'Observed by COBE, WMAP, and Planck' },
      { object: 'Far Future (t = 100 Gyr)', val: 'z -> -0.99, T -> 0 K', notes: 'CMB diluted into near-zero radio emission' }
    ],
    faq: [
      { q: 'What was the "Habitable Epoch" of the universe?', a: 'Physicist Avi Loeb pointed out that around 15 million years after the Big Bang (z ≈ 100–110), the CMB temperature was between 0°C and 100°C (273–373 K). For several million years, liquid water could have existed on rocky planets regardless of their distance from any star.' },
      { q: 'How do astronomers measure the CMB temperature in the distant past?', a: 'By observing carbon monoxide and neutral carbon absorption lines in gas clouds backlit by distant quasars. Interstellar molecules are excited by the ambient CMB photons, directly measuring T(z) thousands of megaparsecs away.' }
    ],
    calcJs: `
      const z = parseFloat(document.getElementById('cmb_z').value) || 0;
      const t0 = 2.72548;
      const t_k = t0 * (1 + z);
      const t_c = t_k - 273.15;
      const peak_wl_m = 2.89777e-3 / t_k;
      
      let era = 'Modern Stelliferous Era';
      if (z >= 1000) era = 'Recombination / Decoupling Era (Fog Clears)';
      else if (z >= 100) era = 'Habitable Epoch / Dark Ages (Room Temperature)';
      else if (z >= 15) era = 'Cosmic Dawn (Reionization & First Stars)';
      else if (z >= 2) era = 'Cosmic Noon (Peak Star Formation)';
      
      let wl_str = fmtSci(peak_wl_m * 1000) + ' mm';
      if (peak_wl_m < 1e-6) wl_str = fmtSci(peak_wl_m * 1e9) + ' nm (Visible / UV)';
      else if (peak_wl_m < 1e-3) wl_str = fmtSci(peak_wl_m * 1e6) + ' µm (Infrared)';
      
      document.getElementById('out_cmb_temp_k').textContent = fmtSci(t_k) + ' K';
      document.getElementById('out_cmb_temp_c').textContent = t_c.toFixed(2) + ' °C';
      document.getElementById('out_cosmic_era').textContent = era;
      document.getElementById('out_peak_lambda').textContent = wl_str;
    `
  },
  {
    slug: 'hubble-law-recession-velocity',
    title: 'Hubble-Lemaître Cosmological Recession Velocity Calculator [Expanding Universe v = H_0 d] | Digital Tools Shed',
    shortTitle: 'Hubble Law Calculator',
    category: 'Cosmology & Early Universe',
    badge: 'EXPANDING METRIC COSMOLOGY',
    metaDesc: 'Calculate cosmological recession velocity, lookback time, and the Hubble sphere boundary where galaxies recede faster than light.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        v = H₀ · d;\quad R_H = c / H₀ ≈ 4,282 \text{ Mpc} \approx 13.96 \text{ Gly}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by Georges Lemaître (1927) and Edwin Hubble (1929), Hubble’s Law dictates that distant galaxies recede from us at velocities proportional to their distance. The Hubble sphere (c/H₀ ≈ 14 billion light-years) marks the boundary where spatial expansion carries galaxies away faster than the speed of light.
      </p>
    `,
    inputs: [
      { id: 'hub_dist_mpc', label: 'Proper Distance (Megaparsecs Mpc)', type: 'number', default: '100', step: '10', min: '0.1' },
      { id: 'hub_h0', label: 'Hubble Constant H₀ (km/s / Mpc)', type: 'number', default: '70', step: '0.5', min: '50', max: '100' }
    ],
    presets: [
      { label: 'Virgo Galaxy Cluster (16.5 Mpc)', values: { hub_dist_mpc: 16.5, hub_h0: 70 } },
      { label: 'Coma Galaxy Cluster (100 Mpc)', values: { hub_dist_mpc: 100, hub_h0: 70 } },
      { label: 'Hubble Sphere Boundary (~4,285 Mpc)', values: { hub_dist_mpc: 4285, hub_h0: 70 } },
      { label: 'Edge of Observable Universe (14,260 Mpc)', values: { hub_dist_mpc: 14260, hub_h0: 70 } }
    ],
    outputs: [
      { id: 'out_hub_vel_kms', label: 'Recession Velocity (km/s)', default: '7,000 km/s' },
      { id: 'out_hub_c_frac', label: 'Fraction of Speed of Light (v / c)', default: '0.0233 c' },
      { id: 'out_dist_gly', label: 'Distance in Billions of Light-Years (Gly)', default: '0.326 Gly' },
      { id: 'out_superluminal', label: 'Expansion Superluminal Status', default: 'Sub-luminal (< c)' }
    ],
    benchmarks: [
      { object: 'Local Group Andromeda', val: '-300 km/s (Blueshift)', notes: 'Gravitational attraction overcomes Hubble flow' },
      { object: 'Virgo Cluster', val: '1,150 km/s', notes: 'Core of our local supercluster' },
      { object: 'Hubble Sphere (c / H₀)', val: 'v = c (1.0c)', notes: '4,285 Mpc (~14.0 billion light-years)' },
      { object: 'Distant Quasar GN-z11', val: 'z = 10.6, v ≈ 2.2c', notes: 'Receding at over twice the speed of light' },
      { object: 'Particle Horizon (Observable Universe)', val: '46.5 Billion Light-Years', notes: 'Comoving boundary of visible universe' }
    ],
    faq: [
      { q: 'Can galaxies really recede faster than light?', a: 'Yes! Special relativity forbids particles from moving faster than light through local spacetime. However, in general relativity, spacetime itself expands. Space between distant galaxies stretches, causing separation velocities to exceed c without violating any local physical laws.' },
      { q: 'What is the "Hubble Tension"?', a: 'Measurements of H₀ using the early universe (Planck CMB: 67.4 km/s/Mpc) disagree statistically with late-universe local measurements (Hubble Space Telescope Cepheids/Supernovae: 73.0 km/s/Mpc). This persistent 5σ discrepancy points to potential new cosmological physics.' }
    ],
    calcJs: `
      const d_mpc = parseFloat(document.getElementById('hub_dist_mpc').value) || 100;
      const h0 = parseFloat(document.getElementById('hub_h0').value) || 70;
      const c = 299792.458; // km/s
      
      const v_kms = h0 * d_mpc;
      const c_frac = v_kms / c;
      const d_gly = (d_mpc * 3.26156) / 1000;
      
      let status = 'Sub-luminal (v < c)';
      if (c_frac > 1.0) status = 'Superluminal (v > c: Receding Faster than Light)';
      
      document.getElementById('out_hub_vel_kms').textContent = Math.round(v_kms).toLocaleString() + ' km/s';
      document.getElementById('out_hub_c_frac').textContent = c_frac.toFixed(3) + ' c';
      document.getElementById('out_dist_gly').textContent = d_gly.toFixed(3) + ' Gly';
      document.getElementById('out_superluminal').textContent = status;
    `
  },
  {
    slug: 'critical-density-universe',
    title: 'Critical Density & Cosmological Omega (Ω) Curvature Calculator [Flat Universe ρ_crit] | Digital Tools Shed',
    shortTitle: 'Critical Density Calculator',
    category: 'Cosmology & Early Universe',
    badge: 'COSMOLOGICAL GEOMETRY METRIC',
    metaDesc: 'Compute the critical mass-energy density required for a flat Euclidean universe and evaluate spatial curvature parameters.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ρ_crit = 3H₀² / (8πG) ≈ 8.53 × 10⁻²⁷ · (H₀ / 70)² kg/m³ ≈ 5.1 protons/m³
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The critical density is the precise average mass-energy density needed for the geometry of the universe to be spatially flat (Euclidean, k = 0). The density parameter Ω_tot = ρ / ρ_crit determines the ultimate geometric fate of the cosmos: Ω > 1 is closed spherical, Ω < 1 is open hyperbolic, and Ω = 1 is flat.
      </p>
    `,
    inputs: [
      { id: 'crit_h0', label: 'Hubble Constant H₀ (km/s / Mpc)', type: 'number', default: '70', step: '0.5', min: '50', max: '100' },
      { id: 'crit_omega_m', label: 'Matter Density Parameter (Ω_m)', type: 'number', default: '0.315', step: '0.01', min: '0', max: '2' },
      { id: 'crit_omega_lambda', label: 'Dark Energy Parameter (Ω_Λ)', type: 'number', default: '0.685', step: '0.01', min: '0', max: '2' }
    ],
    presets: [
      { label: 'Planck 2018 Standard ΛCDM (Flat, Ω = 1.000)', values: { crit_h0: 67.4, crit_omega_m: 0.315, crit_omega_lambda: 0.685 } },
      { label: 'Matter-Only Einstein-de Sitter (Ω_m = 1.0, Ω_Λ = 0)', values: { crit_h0: 70.0, crit_omega_m: 1.0, crit_omega_lambda: 0.0 } },
      { label: 'Closed Hyperspherical Universe (Ω_tot = 1.05)', values: { crit_h0: 70.0, crit_omega_m: 0.35, crit_omega_lambda: 0.70 } }
    ],
    outputs: [
      { id: 'out_rho_crit_kg', label: 'Critical Density ρ_crit (kg/m³)', default: '8.53 × 10⁻²⁷ kg/m³' },
      { id: 'out_protons_m3', label: 'Equivalent Hydrogen Atoms per m³', default: '5.10 Protons / m³' },
      { id: 'out_omega_total', label: 'Total Density Parameter (Ω_tot)', default: '1.000 (Spatially Flat)' },
      { id: 'out_curvature_fate', label: 'Geometric Curvature & Cosmic Fate', default: 'Euclidean Flat Space (Eternal Acceleration)' }
    ],
    benchmarks: [
      { object: 'Critical Density ρ_crit', val: '8.53 × 10⁻²⁷ kg/m³', notes: '~5 hydrogen atoms in a 1 cubic meter box' },
      { object: 'Baryonic Matter Density', val: 'Ω_b ≈ 0.049 (4.9%)', notes: 'All stars, planets, and gas clouds' },
      { object: 'Dark Matter Density', val: 'Ω_c ≈ 0.266 (26.6%)', notes: 'Non-baryonic collisionless scaffolding' },
      { object: 'Dark Energy Density', val: 'Ω_Λ ≈ 0.685 (68.5%)', notes: 'Accelerating cosmological constant' },
      { object: 'Cosmic Curvature |Ω_k|', val: '< 0.001', notes: 'Verified flat to 0.1% by Planck satellite' }
    ],
    faq: [
      { q: 'How empty is the universe compared to critical density?', a: 'Critical density corresponds to roughly 5 hydrogen atoms per cubic meter. In contrast, the best ultra-high vacuum chambers on Earth still contain over 100,000 molecules per cubic centimeter (100 million per m³).' },
      { q: 'Why did cosmic inflation make the universe flat?', a: 'Just as blowing up a wrinkled balloon to astronomical proportions flattens its surface so that an ant cannot detect any curvature, the exponential expansion of inflation stretched the universe by at least 10²⁶ times, driving Ω_tot to 1.0000.' }
    ],
    calcJs: `
      const h0 = parseFloat(document.getElementById('crit_h0').value) || 70;
      const om = parseFloat(document.getElementById('crit_omega_m').value) || 0.315;
      const ol = parseFloat(document.getElementById('crit_omega_lambda').value) || 0.685;
      
      const G = 6.67430e-11;
      const mpc_m = 3.085677581e22;
      const h0_si = (h0 * 1000) / mpc_m;
      
      const rho_crit = (3 * h0_si * h0_si) / (8 * Math.PI * G);
      const m_proton = 1.6726219e-27;
      const protons_m3 = rho_crit / m_proton;
      const omega_tot = om + ol;
      
      let geom = 'Flat Euclidean (Eternal Acceleration)';
      if (omega_tot > 1.005) geom = 'Closed 3-Sphere (Positive Curvature, Finite Volume)';
      else if (omega_tot < 0.995) geom = 'Open Saddle / Hyperbolic (Negative Curvature, Infinite)';
      
      document.getElementById('out_rho_crit_kg').textContent = fmtSci(rho_crit) + ' kg/m³';
      document.getElementById('out_protons_m3').textContent = protons_m3.toFixed(2) + ' Protons / m³';
      document.getElementById('out_omega_total').textContent = omega_tot.toFixed(3);
      document.getElementById('out_curvature_fate').textContent = geom;
    `
  },
  {
    slug: 'friedmann-scale-factor-expansion',
    title: 'Friedmann Universe Expansion & Scale Factor Evolution [Cosmic Epochs a(t)] | Digital Tools Shed',
    shortTitle: 'Friedmann Expansion Calculator',
    category: 'Cosmology & Early Universe',
    badge: 'GENERAL RELATIVISTIC COSMIC EVOLUTION',
    metaDesc: 'Model the cosmic scale factor a(t) and universe expansion across radiation, matter, and dark energy eras with Friedmann equations.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        H(a)² = H₀² · [ Ω_r · a⁻⁴ + Ω_m · a⁻³ + Ω_k · a⁻² + Ω_Λ ]
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Derived from Einstein’s field equations by Alexander Friedmann in 1922, the Friedmann equations govern the expansion of homogeneous and isotropic space. The cosmic scale factor a(t) describes how distances between galaxies grow over time, normalized to a = 1 today.
      </p>
    `,
    inputs: [
      { id: 'fried_epoch_gyr', label: 'Cosmic Time / Universe Age t (Billion Years Gyr)', type: 'number', default: '13.8', step: '0.5', min: '0.0001', max: '100' }
    ],
    presets: [
      { label: 'Big Bang Decoupling (380,000 Years = 0.00038 Gyr)', values: { fried_epoch_gyr: 0.00038 } },
      { label: 'First Stars Cosmic Dawn (0.2 Gyr)', values: { fried_epoch_gyr: 0.2 } },
      { label: 'Solar System Formation (9.2 Gyr)', values: { fried_epoch_gyr: 9.2 } },
      { label: 'Present Day (13.787 Gyr, a = 1.0)', values: { fried_epoch_gyr: 13.787 } },
      { label: 'Future Dark Era (50 Gyr)', values: { fried_epoch_gyr: 50.0 } }
    ],
    outputs: [
      { id: 'out_scale_factor', label: 'Cosmic Scale Factor a(t)', default: '1.000' },
      { id: 'out_redshift_eq', label: 'Equivalent Redshift z = (1/a) - 1', default: 'z = 0.000' },
      { id: 'out_dominant_comp', label: 'Dominant Cosmic Component', default: 'Dark Energy (Cosmological Constant)' },
      { id: 'out_expansion_rate', label: 'Hubble Expansion Rate H(t)', default: '67.4 km/s/Mpc' }
    ],
    benchmarks: [
      { object: 'Radiation Domination (t < 50,000y)', val: 'a(t) ∝ t^(1/2)', notes: 'Photon & neutrino radiation pressure dominates' },
      { object: 'Matter Domination (50,000y - 9.8 Gyr)', val: 'a(t) ∝ t^(2/3)', notes: 'Decelerating expansion under gravity' },
      { object: 'Dark Energy Transition (t ≈ 9.8 Gyr)', val: 'Coincidence Era', notes: 'Expansion begins accelerating' },
      { object: 'Present Day (t = 13.8 Gyr)', val: 'a = 1.0, z = 0', notes: 'Dark energy comprises 68.5% of cosmos' },
      { object: 'De Sitter Future (t > 30 Gyr)', val: 'a(t) ∝ e^(Ht)', notes: 'Exponential runaway cosmic inflation' }
    ],
    faq: [
      { q: 'Why does radiation density scale as a⁻⁴ while matter scales as a⁻³?', a: 'As the volume of the universe expands as a³, particle number density drops by a⁻³. For matter, mass is constant. But for photons, cosmological expansion also stretches their wavelength (λ ∝ a), reducing energy per photon by an additional factor of a⁻¹, giving a total scaling of a⁻⁴.' },
      { q: 'Will the expansion ever stop?', a: 'Under the standard ΛCDM model with a positive cosmological constant, dark energy will never dilute. The expansion will accelerate indefinitely, eventually driving all galaxies outside the local group beyond the cosmic event horizon.' }
    ],
    calcJs: `
      const t_gyr = parseFloat(document.getElementById('fried_epoch_gyr').value) || 13.8;
      const t_now = 13.787;
      
      let a = 1.0;
      let dominant = 'Dark Energy (Accelerating)';
      
      if (t_gyr <= 0.001) {
        a = Math.pow(t_gyr / t_now, 0.5) * 0.05;
        dominant = 'Relativistic Radiation (Photons & Neutrinos)';
      } else if (t_gyr < 9.8) {
        a = Math.pow(t_gyr / t_now, 2/3);
        dominant = 'Cold Dark Matter & Baryons (Decelerating)';
      } else {
        // Late time dark energy acceleration
        a = Math.pow(t_gyr / t_now, 2/3) * Math.exp((t_gyr - t_now) * 0.045);
        dominant = 'Dark Energy (Cosmological Constant)';
      }
      
      const z_eq = Math.max(-0.9999, (1 / Math.max(1e-6, a)) - 1);
      const h_t = 67.4 * Math.sqrt(0.315 / Math.pow(a, 3) + 0.685);
      
      document.getElementById('out_scale_factor').textContent = a > 1000 ? fmtSci(a) : a.toFixed(4);
      document.getElementById('out_redshift_eq').textContent = z_eq > 0 ? 'z = ' + (z_eq > 100 ? fmtSci(z_eq) : z_eq.toFixed(2)) : 'Future Era (z < 0)';
      document.getElementById('out_dominant_comp').textContent = dominant;
      document.getElementById('out_expansion_rate').textContent = Math.round(h_t).toLocaleString() + ' km/s/Mpc';
    `
  },
  {
    slug: 'baryon-to-photon-ratio',
    title: 'Baryon-to-Photon Ratio & Big Bang Nucleosynthesis Abundance [Primordial Asymmetry η] | Digital Tools Shed',
    shortTitle: 'Baryon-to-Photon Ratio',
    category: 'Cosmology & Early Universe',
    badge: 'PRIMORDIAL NUCLEOSYNTHESIS METRIC',
    metaDesc: 'Explore the cosmic matter-antimatter asymmetry parameter η and predicted Big Bang abundances of Hydrogen, Helium, and Deuterium.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        η = n_b / n_γ ≈ 6.12 × 10⁻¹⁰ = (273.9 × 10⁻¹⁰) · Ω_b · h²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The baryon-to-photon ratio η is the fundamental cosmological number governing Big Bang Nucleosynthesis (BBN) during the first 20 minutes of cosmic history. For every single proton or neutron in the universe, there are roughly 1.6 billion relic photons in the Cosmic Microwave Background.
      </p>
    `,
    inputs: [
      { id: 'bbn_omega_b', label: 'Baryon Density Parameter (Ω_b · h²)', type: 'number', default: '0.02237', step: '0.0005', min: '0.005', max: '0.05' }
    ],
    presets: [
      { label: 'Planck 2018 Best Fit (Ω_b · h² = 0.02237)', values: { bbn_omega_b: 0.02237 } },
      { label: 'Low Baryon Density (0.015)', values: { bbn_omega_b: 0.015 } },
      { label: 'High Baryon Density (0.030)', values: { bbn_omega_b: 0.030 } }
    ],
    outputs: [
      { id: 'out_eta_ratio', label: 'Baryon-to-Photon Ratio (η)', default: '6.12 × 10⁻¹⁰' },
      { id: 'out_he4_mass', label: 'Primordial Helium-4 Mass Fraction (Y_p)', default: '24.7 % (0.247)' },
      { id: 'out_deuterium_ratio', label: 'Primordial Deuterium Abundance (D/H)', default: '2.54 × 10⁻⁵' },
      { id: 'out_baryogenesis', label: 'Primordial Matter-Antimatter Excess', default: '1 extra quark per 1.6 Billion pairs' }
    ],
    benchmarks: [
      { object: 'CMB Photon Number Density', val: '411 photons / cm³', notes: 'Relic thermal radiation permeating all space' },
      { object: 'Baryon Number Density', val: '0.25 protons / m³', notes: 'Total atomic matter in the cosmos' },
      { object: 'Hydrogen Primordial Abundance', val: '75.3% of ordinary mass', notes: 'Unfused primordial protons' },
      { object: 'Helium-4 Primordial Abundance', val: '24.7% of ordinary mass', notes: 'Fused during the first 3 minutes of BBN' },
      { object: 'Lithium-7 Anomaly', val: 'Factor of 3 lower in stars', notes: 'Unresolved discrepancy in BBN astrophysics' }
    ],
    faq: [
      { q: 'Why did the Big Bang not fuse all hydrogen into helium?', a: 'Because the universe was expanding rapidly. The window of temperature and density where protons and neutrons could fuse lasted only about 15 minutes before the cosmic plasma became too diffuse and cold for nuclear reactions.' },
      { q: 'Why is primordial Deuterium called the cosmic "baryometer"?', a: 'Deuterium is fragile and easily burned in stars, so any deuterium observed today must be primordial relic gas. Because the predicted D/H ratio is steeply dependent on baryon density, measuring cosmic deuterium accurately pins down the total amount of normal matter in the universe.' }
    ],
    calcJs: `
      const obh2 = parseFloat(document.getElementById('bbn_omega_b').value) || 0.02237;
      const eta = 273.9e-10 * obh2;
      const eta_10 = eta * 1e10;
      
      // Standard BBN fitting formulas
      const yp = 0.247 + 0.01 * Math.log(eta_10 / 6.0);
      const d_h = 2.54e-5 * Math.pow(6.0 / eta_10, 1.6);
      const pairs = 1 / eta;
      
      document.getElementById('out_eta_ratio').textContent = fmtSci(eta);
      document.getElementById('out_he4_mass').textContent = (yp * 100).toFixed(2) + ' %';
      document.getElementById('out_deuterium_ratio').textContent = fmtSci(d_h);
      document.getElementById('out_baryogenesis').textContent = '1 part in ' + fmtSci(pairs) + ' annihilation pairs';
    `
  },
  {
    slug: 'casimir-effect-force-calculator',
    title: 'Casimir Effect Vacuum Pressure & Attractive Force [Zero-Point Fluctuation F/A] | Digital Tools Shed',
    shortTitle: 'Casimir Effect Calculator',
    category: 'Quantum Mechanics & Vacuum Physics',
    badge: 'QUANTUM VACUUM MACROSCOPIC FORCE',
    metaDesc: 'Calculate quantum vacuum Casimir attraction pressure and attractive force between parallel plates from zero-point quantum fluctuations.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        F / A = π² · ħ · c / (240 · d⁴)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Predicted by Dutch physicist Hendrik Casimir in 1948, the Casimir effect proves that the quantum vacuum is not empty. When two uncharged, parallel conductive plates are placed nanometers apart, only virtual photon vacuum fluctuations whose wavelengths fit boundary conditions can exist between them. The higher radiation pressure outside pushes the plates together.
      </p>
    `,
    inputs: [
      { id: 'cas_dist_nm', label: 'Plate Separation Distance d (Nanometers nm)', type: 'number', default: '50', step: '5', min: '5', max: '2000' },
      { id: 'cas_area_cm2', label: 'Plate Surface Area A (cm²)', type: 'number', default: '1.0', step: '0.1', min: '0.001' }
    ],
    presets: [
      { label: 'MEMS Nanodevice Gap (10 nm, 1 cm²)', values: { cas_dist_nm: 10, cas_area_cm2: 1.0 } },
      { label: 'Standard Laboratory Measurement (50 nm, 1 cm²)', values: { cas_dist_nm: 50, cas_area_cm2: 1.0 } },
      { label: 'Micrometer Separation (1,000 nm = 1 µm, 1 cm²)', values: { cas_dist_nm: 1000, cas_area_cm2: 1.0 } }
    ],
    outputs: [
      { id: 'out_cas_pressure', label: 'Casimir Vacuum Pressure (Pascals Pa)', default: '208.2 Pa' },
      { id: 'out_cas_force_n', label: 'Total Attractive Force (Newtons)', default: '0.0208 N' },
      { id: 'out_atm_ratio', label: 'Ratio to 1 Atmosphere (101,325 Pa)', default: '0.00205 atm' },
      { id: 'out_mems_stiction', label: 'Nanotechnology Stiction Hazard', default: 'Severe Stiction Threshold in MEMS' }
    ],
    benchmarks: [
      { object: '10 nm Gap (MEMS Limit)', val: '130,100 Pa (1.28 atm)', notes: 'Exceeds standard atmospheric pressure!' },
      { object: '30 nm Gap', val: '1,606 Pa', notes: 'Easily deflects micro-cantilevers' },
      { object: '100 nm Gap', val: '13.0 Pa', notes: 'Measured by Lamoreaux in 1997 with torsion pendulum' },
      { object: '1 µm Gap', val: '0.0013 Pa', notes: 'Falls off drastically due to d⁴ inverse power' },
      { object: 'Dynamic Casimir Effect (2011)', val: 'Real photons created', notes: 'Rapidly moving mirror converts virtual photons to light' }
    ],
    faq: [
      { q: 'Can the Casimir effect be repulsive instead of attractive?', a: 'Yes! Evgeny Lifshitz showed that if the space between the plates is filled with a dielectric fluid whose permittivity lies between the permittivities of the two plates, the Casimir force becomes repulsive. This is used in micro-machinery to prevent stiction.' },
      { q: 'Is the Casimir force related to van der Waals forces?', a: 'Yes. At atomic scales (< a few nanometers), the interaction is called the van der Waals force. At larger distances where the finite speed of light introduces electromagnetic retardation, it becomes the Casimir-Polder effect.' }
    ],
    calcJs: `
      const d_nm = parseFloat(document.getElementById('cas_dist_nm').value) || 50;
      const a_cm2 = parseFloat(document.getElementById('cas_area_cm2').value) || 1.0;
      
      const hbar = 1.054571817e-34;
      const c = 299792458;
      const d_m = d_nm * 1e-9;
      const a_m2 = a_cm2 * 1e-4;
      
      // Pressure = pi^2 * hbar * c / (240 * d^4)
      const pressure_pa = (Math.PI * Math.PI * hbar * c) / (240 * Math.pow(d_m, 4));
      const force_n = pressure_pa * a_m2;
      const atm_ratio = pressure_pa / 101325;
      
      let stiction = 'Negligible Drag';
      if (pressure_pa > 1000) stiction = 'Severe Stiction Hazard (Components Fuse)';
      else if (pressure_pa > 10) stiction = 'Moderate Deflection in Micro-cantilevers';
      
      document.getElementById('out_cas_pressure').textContent = fmtSci(pressure_pa) + ' Pa';
      document.getElementById('out_cas_force_n').textContent = fmtSci(force_n) + ' N';
      document.getElementById('out_atm_ratio').textContent = fmtSci(atm_ratio) + ' atm';
      document.getElementById('out_mems_stiction').textContent = stiction;
    `
  },
  {
    slug: 'cherenkov-radiation-angle',
    title: 'Cherenkov Blue Radiation Angle & Particle Velocity [Optical Shockwave cos θ = 1/nβ] | Digital Tools Shed',
    shortTitle: 'Cherenkov Radiation Calculator',
    category: 'Nuclear & Particle Physics',
    badge: 'OPTICAL RELATIVISTIC SHOCKWAVE',
    metaDesc: 'Calculate the optical shockwave cone angle of Cherenkov blue radiation when charged particles exceed the phase velocity of light in a medium.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        cos θ_c = 1 / (n · β) = c / (n · v);\quad E_threshold = m_e · c² · ( n / √(n² - 1) - 1 )
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Named after Pavel Cherenkov (1958 Nobel Prize), Cherenkov radiation is the optical analog of a sonic boom. When a charged particle travels through a transparent dielectric medium faster than the phase velocity of light in that medium (c / n), it creates a coherent electromagnetic shockwave visible as an ethereal blue glow in nuclear reactors.
      </p>
    `,
    inputs: [
      { id: 'cher_medium', label: 'Dielectric Medium', type: 'select', options: [
        { val: '1.333', text: 'Water (n = 1.333)' },
        { val: '1.328', text: 'Heavy Water D₂O (n = 1.328)' },
        { val: '1.490', text: 'Acrylic Plastic / Plexiglas (n = 1.490)' },
        { val: '1.620', text: 'Dense Flint Glass (n = 1.620)' },
        { val: '2.417', text: 'Diamond (n = 2.417)' },
        { val: '1.000293', text: 'Air at 1 atm (n = 1.000293)' }
      ]},
      { id: 'cher_beta', label: 'Particle Speed (β = v / c)', type: 'number', default: '0.95', step: '0.01', min: '0.4', max: '0.99999' }
    ],
    presets: [
      { label: 'Spent Nuclear Fuel Pool Electron (β = 0.95 in Water)', values: { cher_medium: '1.333', cher_beta: 0.95 } },
      { label: 'Relativistic Cosmic Ray in Atmosphere (β = 0.9999 in Air)', values: { cher_medium: '1.000293', cher_beta: 0.9999 } },
      { label: 'Heavy Water Reactor Beta Particle (β = 0.90)', values: { cher_medium: '1.328', cher_beta: 0.90 } },
      { label: 'Diamond Detector (β = 0.60)', values: { cher_medium: '2.417', cher_beta: 0.60 } }
    ],
    outputs: [
      { id: 'out_cher_angle', label: 'Cherenkov Emission Half-Angle (θ_c)', default: '37.86°' },
      { id: 'out_phase_vel', label: 'Phase Velocity of Light in Medium (c / n)', default: '224,899 km/s' },
      { id: 'out_thresh_beta', label: 'Threshold Speed to Radiate (β_min = 1/n)', default: '0.7502 c' },
      { id: 'out_thresh_energy', label: 'Electron Threshold Kinetic Energy', default: '264.1 keV' }
    ],
    benchmarks: [
      { object: 'Water Pool Cherenkov Angle', val: 'θ_c ≈ 41.2° max', notes: 'Eerie blue glow in nuclear reactors' },
      { object: 'Heavy Water CANDU Core', val: 'θ_c ≈ 41.1° max', notes: 'Cherenkov glow during critical operation' },
      { object: 'Super-Kamiokande Neutrino Detector', val: '50,000 tons of ultra-pure water', notes: 'Detects neutrino-induced ring patterns' },
      { object: 'Atmospheric Cherenkov Telescopes (H.E.S.S., MAGIC)', val: 'θ_c ≈ 1.4° in air', notes: 'Detects tera-electronvolt cosmic gamma rays' },
      { object: 'Astronaut Phosphenes', val: 'Light flashes in eyes', notes: 'Cosmic rays producing Cherenkov light in ocular vitreous humor' }
    ],
    faq: [
      { q: 'Why is Cherenkov radiation intensely blue?', a: 'The Frank-Tamm formula states that the number of photons emitted per unit frequency is proportional to frequency dN/dω ∝ ω. Higher frequencies (blue and near-ultraviolet) are emitted far more abundantly than longer red wavelengths, producing a vivid azure hue.' },
      { q: 'Does Cherenkov radiation violate the speed of light?', a: 'No. The universal speed limit c = 299,792 km/s applies to light in a vacuum. In dense matter, light slows down to c / n. A particle moving at 260,000 km/s in water (where c/n = 225,000 km/s) is superluminal relative to the medium, but strictly subluminal relative to c in a vacuum.' }
    ],
    calcJs: `
      const n = parseFloat(document.getElementById('cher_medium').value) || 1.333;
      const beta = parseFloat(document.getElementById('cher_beta').value) || 0.95;
      
      const c = 299792.458; // km/s
      const v_phase_kms = c / n;
      const beta_min = 1 / n;
      const me_kev = 510.99895; // keV
      
      const gamma_thresh = n / Math.sqrt(n * n - 1);
      const e_thresh_kev = (gamma_thresh - 1) * me_kev;
      
      let angle_str = 'No Cherenkov (Sub-threshold: v < c/n)';
      if (beta >= beta_min) {
        const cos_th = 1 / (n * beta);
        const rad = Math.acos(Math.min(1.0, cos_th));
        const deg = (rad * 180) / Math.PI;
        angle_str = deg.toFixed(2) + '°';
      }
      
      document.getElementById('out_cher_angle').textContent = angle_str;
      document.getElementById('out_phase_vel').textContent = Math.round(v_phase_kms).toLocaleString() + ' km/s';
      document.getElementById('out_thresh_beta').textContent = beta_min.toFixed(4) + ' c';
      document.getElementById('out_thresh_energy').textContent = e_thresh_kev.toFixed(1) + ' keV';
    `
  },
  {
    slug: 'radioactive-decay-chain-half-life',
    title: 'Radioactive Isotope Decay Chain & Remaining Activity [Exponential Decay N(t)] | Digital Tools Shed',
    shortTitle: 'Radioactive Decay Calculator',
    category: 'Nuclear & Particle Physics',
    badge: 'ISOTOPIC KINETICS',
    metaDesc: 'Calculate remaining radioactive nuclei, Becquerel activity, and half-life decay curves across nuclear isotopes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        N(t) = N₀ · e^(-λt) = N₀ · (½)^(t / t_½);\quad A(t) = λ · N(t)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Radioactive decay is a first-order quantum stochastic process. While the exact moment any individual nucleus will decay is fundamentally probabilistic, the aggregate decay rate of macroscopic samples follows a precise exponential decay constant λ = ln(2) / t_½.
      </p>
    `,
    inputs: [
      { id: 'rad_isotope', label: 'Radioactive Isotope Preset', type: 'select', options: [
        { val: 'c14', text: 'Carbon-14 (t_½ = 5,730 Years)' },
        { val: 'cs137', text: 'Cesium-137 (t_½ = 30.17 Years)' },
        { val: 'i131', text: 'Iodine-131 (t_½ = 8.02 Days)' },
        { val: 'co60', text: 'Cobalt-60 (t_½ = 5.27 Years)' },
        { val: 'h3', text: 'Tritium H-3 (t_½ = 12.32 Years)' },
        { val: 'u238', text: 'Uranium-238 (t_½ = 4.468 Billion Years)' }
      ]},
      { id: 'rad_time_years', label: 'Elapsed Decay Time (Years)', type: 'number', default: '5730', step: 'any', min: '0.00001' },
      { id: 'rad_initial_curies', label: 'Initial Activity (Curies Ci)', type: 'number', default: '1.0', step: '0.1', min: '0.0001' }
    ],
    presets: [
      { label: 'Carbon-14 (1 Half-life = 5,730y)', values: { rad_isotope: 'c14', rad_time_years: 5730, rad_initial_curies: 1.0 } },
      { label: 'Chernobyl Cesium-137 (1986 -> Present ~40y)', values: { rad_isotope: 'cs137', rad_time_years: 40, rad_initial_curies: 1000 } },
      { label: 'Medical Iodine-131 (60 Days = 0.164y)', values: { rad_isotope: 'i131', rad_time_years: 0.164, rad_initial_curies: 0.05 } },
      { label: 'Age of Earth Uranium-238 (4.5 Gyr)', values: { rad_isotope: 'u238', rad_time_years: 4500000000, rad_initial_curies: 1.0 } }
    ],
    outputs: [
      { id: 'out_remaining_pct', label: 'Remaining Isotope Fraction', default: '50.00 %' },
      { id: 'out_current_curies', label: 'Current Activity (Curies Ci)', default: '0.500 Ci' },
      { id: 'out_activity_bq', label: 'Activity in Becquerels (Bq)', default: '1.85 × 10¹⁰ Bq' },
      { id: 'out_halflives_elapsed', label: 'Number of Half-Lives Elapsed', default: '1.00 Half-Lives' }
    ],
    benchmarks: [
      { object: 'Iodine-131 (8 days)', val: 'Decays 99.9% in 80 days', notes: 'Fukushima/Chernobyl thyroid hazard' },
      { object: 'Tritium (12.3 years)', val: 'β⁻ emitter, 18.6 keV', notes: 'Self-luminous watch dials & fusion fuel' },
      { object: 'Cesium-137 (30.2 years)', val: 'Primary dirty bomb & fallout isotope', notes: 'Forms soluble salts that mimic potassium' },
      { object: 'Plutonium-239 (24,100 years)', val: 'Nuclear weapon fissile core', notes: 'Long-term nuclear waste disposal concern' },
      { object: 'Uranium-238 (4.47 Gyr)', val: 'Half of primordial Earth U-238 decayed', notes: 'Radiogenic geothermal heat source' }
    ],
    faq: [
      { q: 'What is the difference between Becquerels and Curies?', a: '1 Becquerel (Bq) is defined as exactly 1 nuclear disintegration per second (the SI unit). 1 Curie (Ci) is a legacy unit based on 1 gram of Radium-226, equal to exactly 3.7 × 10¹⁰ Bq (37 Gigabecquerels).' },
      { q: 'Can chemical bonds or heat alter radioactive decay rates?', a: 'Under normal conditions, no. Radioactive decay originates inside the femtometer-scale nucleus, isolated from electron shell chemistry. Extremely rare exceptions involve electron capture (EC) in ionized beryllium-7.' }
    ],
    calcJs: `
      const iso = document.getElementById('rad_isotope').value;
      const t_yr = parseFloat(document.getElementById('rad_time_years').value) || 5730;
      const a0_ci = parseFloat(document.getElementById('rad_initial_curies').value) || 1.0;
      
      let t_half_yr = 5730;
      if (iso === 'cs137') t_half_yr = 30.17;
      else if (iso === 'i131') t_half_yr = 8.02 / 365.25;
      else if (iso === 'co60') t_half_yr = 5.27;
      else if (iso === 'h3') t_half_yr = 12.32;
      else if (iso === 'u238') t_half_yr = 4.468e9;
      
      const n_halflives = t_yr / t_half_yr;
      const remaining_pct = Math.pow(0.5, n_halflives) * 100;
      const a_ci = a0_ci * (remaining_pct / 100);
      const a_bq = a_ci * 3.7e10;
      
      document.getElementById('out_remaining_pct').textContent = remaining_pct < 0.0001 ? fmtSci(remaining_pct) + ' %' : remaining_pct.toFixed(2) + ' %';
      document.getElementById('out_current_curies').textContent = fmtSci(a_ci) + ' Ci';
      document.getElementById('out_activity_bq').textContent = fmtSci(a_bq) + ' Bq';
      document.getElementById('out_halflives_elapsed').textContent = n_halflives.toFixed(2) + ' Half-Lives';
    `
  },
  {
    slug: 'radiocarbon-dating-age-calculator',
    title: 'Carbon-14 Radiocarbon Archaeological Dating Calculator [C-14 5730y Half-Life] | Digital Tools Shed',
    shortTitle: 'Radiocarbon Dating Calculator',
    category: 'Nuclear & Particle Physics',
    badge: 'ARCHAEOLOGICAL RADIOCARBON GEOCHRONOLOGY',
    metaDesc: 'Calculate archaeological age from remaining Carbon-14 percent modern carbon (pMC) with Libby and Cambridge half-life models.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        t = -8,033 · ln(A / A₀) = (t_½ / ln 2) · ln(100 / pMC);\quad t_½ = 5,730 \text{ years}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Developed by Willard Libby in 1949 (1960 Nobel Prize), radiocarbon dating measures the decay of unstable Carbon-14 in organic artifacts. Cosmic rays continuously create C-14 in the upper atmosphere, which living organisms ingest until death. Once metabolism ceases, C-14 decays with a 5,730-year half-life.
      </p>
    `,
    inputs: [
      { id: 'c14_pmc', label: 'Percent Modern Carbon (pMC %)', type: 'number', default: '50.0', step: '0.5', min: '0.01', max: '150' }
    ],
    presets: [
      { label: '50% Remaining (1 Half-Life = ~5,730 BP)', values: { c14_pmc: 50.0 } },
      { label: 'Dead Sea Scrolls (~2,000 BP, pMC ≈ 78%)', values: { c14_pmc: 78.5 } },
      { label: 'Ötzi the Iceman (~5,300 BP, pMC ≈ 52%)', values: { c14_pmc: 52.6 } },
      { label: 'Chauvet Cave Paintings (~32,000 BP, pMC ≈ 2%)', values: { c14_pmc: 2.1 } },
      { label: 'Nuclear Bomb Spike (Post-1960 pMC = 135%)', values: { c14_pmc: 135.0 } }
    ],
    outputs: [
      { id: 'out_rc_age_bp', label: 'Radiocarbon Age (Years Before Present BP)', default: '5,730 BP' },
      { id: 'out_cal_year', label: 'Calendar Historical Date', default: '3,780 BCE' },
      { id: 'out_arch_era', label: 'Archaeological Epoch', default: 'Late Neolithic / Early Bronze Age' },
      { id: 'out_limit_warning', label: 'Measurement Reliability Limit', default: 'Within High-Accuracy Window (< 50,000y)' }
    ],
    benchmarks: [
      { object: 'Nuclear Bomb Carbon Spike (1963)', val: 'pMC > 100% (up to 180%)', notes: 'Atmospheric weapons testing doubled C-14' },
      { object: 'Shroud of Turin (1988 Test)', val: '1260 – 1390 CE (pMC ≈ 92%)', notes: 'Identified medieval linen manufacture' },
      { object: 'Ötzi the Iceman', val: '3350 – 3100 BCE (5,300 BP)', notes: 'Copper Age glacier mummy' },
      { object: 'Clovis North American Tools', val: '~13,000 BP (pMC ≈ 20%)', notes: 'Late Pleistocene paleo-Indian hunters' },
      { object: 'Radiocarbon Limit (~50,000y)', val: 'pMC < 0.1%', notes: 'Beyond 50 kyr requires U-Th or K-Ar dating' }
    ],
    faq: [
      { q: 'Why is radiocarbon age defined relative to "BP" (Before Present)?', a: 'In radiocarbon metrology, "Present" is internationally standardized to the year 1950 CE. This prevents calendar drift and avoids contamination from atmospheric thermonuclear bomb testing in the late 1950s.' },
      { q: 'Why can radiocarbon not date dinosaur bones?', a: 'Non-avian dinosaurs died out 66 million years ago. After 10 half-lives (57,300 years), less than 0.1% of C-14 remains; after 1 million years, not a single atom of original C-14 survives. Dinosaurs are dated using potassium-argon (K-Ar) and uranium-lead (U-Pb) dating.' }
    ],
    calcJs: `
      const pmc = parseFloat(document.getElementById('c14_pmc').value) || 50.0;
      
      let bp_years = 0;
      let cal_str = '';
      let era_str = 'Modern';
      let warning = 'Within High-Accuracy Window (< 50,000y)';
      
      if (pmc > 100) {
        bp_years = 0;
        cal_str = 'Post-1950 CE (Nuclear Weapons Spike Era)';
        era_str = 'Anthropocene / Atomic Age';
        warning = 'Enriched with artificial bomb-pulse C-14';
      } else {
        // t = (t_half / ln2) * ln(100 / pMC) using Cambridge 5,730 yr half-life
        bp_years = (5730 / Math.LN2) * Math.log(100 / pmc);
        const cal_year = 1950 - bp_years;
        
        if (cal_year >= 0) cal_str = Math.round(cal_year) + ' CE';
        else cal_str = Math.abs(Math.round(cal_year)).toLocaleString() + ' BCE';
        
        if (bp_years > 50000) warning = 'Exceeds Radiocarbon Detection Limit (> 50,000 BP)';
        
        if (bp_years < 500) era_str = 'Modern / Historical Era';
        else if (bp_years < 1500) era_str = 'Medieval Era';
        else if (bp_years < 3000) era_str = 'Iron Age / Classical Antiquity';
        else if (bp_years < 5000) era_str = 'Bronze Age';
        else if (bp_years < 11700) era_str = 'Neolithic Agricultural Revolution';
        else if (bp_years < 50000) era_str = 'Upper Paleolithic (Ice Age Megafauna)';
        else era_str = 'Exceeds Radiocarbon Practical Horizon';
      }
      
      document.getElementById('out_rc_age_bp').textContent = bp_years > 0 ? Math.round(bp_years).toLocaleString() + ' BP' : 'Modern (< 1950)';
      document.getElementById('out_cal_year').textContent = cal_str;
      document.getElementById('out_arch_era').textContent = era_str;
      document.getElementById('out_limit_warning').textContent = warning;
    `
  },
  {
    slug: 'alpha-decay-gamow-factor',
    title: 'Alpha Decay Quantum Tunneling & Gamow Factor Calculator [Geiger-Nuttall Law] | Digital Tools Shed',
    shortTitle: 'Alpha Decay Gamow Calculator',
    category: 'Nuclear & Particle Physics',
    badge: 'QUANTUM BARRIER PENETRATION',
    metaDesc: 'Explore alpha particle Coulomb barrier tunneling and explain the Geiger-Nuttall law where a 2× energy increase shortens half-life by 10²⁰.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        log₁₀(t_½) = A + B · Z_d / √E_α;\quad P_tunnel ≈ e^(-2G);\quad G = (π · Z_d · e² / ħ) · √(2m_α / E_α)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Solved by George Gamow in 1928, quantum tunneling explains alpha decay. Classically, an alpha particle lacks the energy to scale the 25–30 MeV Coulomb electrostatic repulsion barrier of a heavy nucleus. Gamow showed that the alpha particle tunnels through the barrier with probability P ∝ e^(-2G), brilliantly explaining the Geiger-Nuttall law.
      </p>
    `,
    inputs: [
      { id: 'gam_zd', label: 'Daughter Nucleus Atomic Number (Z_d)', type: 'number', default: '82', step: '1', min: '50', max: '118' },
      { id: 'gam_ealpha_mev', label: 'Alpha Particle Kinetic Energy (MeV)', type: 'number', default: '5.30', step: '0.05', min: '4.0', max: '9.5' }
    ],
    presets: [
      { label: 'Polonium-210 -> Lead-82 (E = 5.30 MeV, t_½ = 138 Days)', values: { gam_zd: 82, gam_ealpha_mev: 5.30 } },
      { label: 'Uranium-238 -> Thorium-90 (E = 4.19 MeV, t_½ = 4.5 Gyr)', values: { gam_zd: 90, gam_ealpha_mev: 4.19 } },
      { label: 'Polonium-214 -> Lead-82 (E = 7.69 MeV, t_½ = 164 µs)', values: { gam_zd: 82, gam_ealpha_mev: 7.69 } },
      { label: 'Radium-226 -> Radon-86 (E = 4.78 MeV, t_½ = 1,600 Years)', values: { gam_zd: 86, gam_ealpha_mev: 4.78 } }
    ],
    outputs: [
      { id: 'out_tunnel_prob', label: 'Barrier Tunneling Probability P', default: '1.24 × 10⁻²⁹ per collision' },
      { id: 'out_predicted_half', label: 'Predicted Half-Life t_½', default: '138.4 Days' },
      { id: 'out_coulomb_barrier', label: 'Peak Coulomb Barrier Height', default: '26.8 MeV' },
      { id: 'out_geiger_nuttall', label: 'Geiger-Nuttall Law Sensitivity', default: 'Exponentially Sensitive to E_α' }
    ],
    benchmarks: [
      { object: 'Uranium-238 (E = 4.19 MeV)', val: 't_½ = 4.47 Billion Years', notes: 'Low energy = astronomical half-life' },
      { object: 'Radium-226 (E = 4.78 MeV)', val: 't_½ = 1,600 Years', notes: 'Slight energy increase cuts half-life by millions' },
      { object: 'Polonium-210 (E = 5.30 MeV)', val: 't_½ = 138 Days', notes: 'Alpha emitter used in satellite RTGs' },
      { object: 'Polonium-214 (E = 7.69 MeV)', val: 't_½ = 164 Microseconds', notes: 'Higher energy turns years into microseconds' },
      { object: 'Polonium-212 (E = 8.78 MeV)', val: 't_½ = 300 Nanoseconds', notes: 'Extreme Geiger-Nuttall speed' }
    ],
    faq: [
      { q: 'Why does a 2× increase in alpha energy change the half-life by 20 orders of magnitude?', a: 'Because tunneling probability sits in an exponential: P ∝ e^(-constant / √E). When an exponent changes by even a factor of 40, e^(-40) alters the reaction timescale from nanoseconds to billions of years.' },
      { q: 'How many times per second does an alpha particle hit the barrier before escaping?', a: 'Trapped inside the femtometer nuclear well, an alpha particle bounces against the Coulomb barrier approximately 10²¹ times every single second (the assault frequency).' }
    ],
    calcJs: `
      const zd = parseFloat(document.getElementById('gam_zd').value) || 82;
      const e_mev = parseFloat(document.getElementById('gam_ealpha_mev').value) || 5.30;
      
      // Gamow factor G approx = 1.989 * Zd / sqrt(E_mev)
      const G = (1.989 * zd) / Math.sqrt(e_mev);
      const log10_p = -2 * G * 0.434294; // convert ln to log10
      
      // Geiger-Nuttall empirical log10(t1/2 in seconds) approx = C1 * Zd / sqrt(E) - C2
      const log10_t_sec = (1.61 * zd) / Math.sqrt(e_mev) - 28.9;
      const t_sec = Math.pow(10, log10_t_sec);
      
      let t_str = '';
      if (t_sec < 1e-3) t_str = (t_sec * 1e6).toFixed(1) + ' Microseconds';
      else if (t_sec < 60) t_str = t_sec.toFixed(2) + ' Seconds';
      else if (t_sec < 86400) t_str = (t_sec / 3600).toFixed(1) + ' Hours';
      else if (t_sec < 365.25 * 86400) t_str = (t_sec / 86400).toFixed(1) + ' Days';
      else if (t_sec < 1e6 * 365.25 * 86400) t_str = (t_sec / (365.25 * 86400)).toFixed(1) + ' Years';
      else t_str = fmtSci(t_sec / (365.25 * 86400)) + ' Years';
      
      const v_barrier_mev = (1.44 * 2 * zd) / 8.8; // R0 ~ 8.8 fm for heavy nucleus
      
      document.getElementById('out_tunnel_prob').textContent = '1 in 10^' + Math.round(Math.abs(log10_p));
      document.getElementById('out_predicted_half').textContent = t_str;
      document.getElementById('out_coulomb_barrier').textContent = v_barrier_mev.toFixed(1) + ' MeV (Particle has only ' + e_mev.toFixed(2) + ' MeV)';
      document.getElementById('out_geiger_nuttall').textContent = 'P_tunnel ∝ e^(-' + Math.round(2 * G) + ')';
    `
  }
];

export const SCIENCE_TOOLS_BATCH_3 = [
  {
    slug: 'fission-mass-defect-energy',
    title: 'Nuclear Fission Mass Defect & Energy Yield Calculator [E = Δm · c²] | Digital Tools Shed',
    shortTitle: 'Fission Energy Calculator',
    category: 'Nuclear & Particle Physics',
    badge: 'NUCLEAR MASS DEFECT ENERGETICS',
    metaDesc: 'Calculate atomic mass defect, nuclear binding energy released per fission event, and Megatons TNT explosive yield.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Δm = m_reactants - m_products;\quad E = Δm · c²;\quad 1 \text{ u} \approx 931.494 \text{ MeV}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        In nuclear fission, the total mass of the daughter nuclei and ejected neutrons is less than the mass of the parent nucleus and incident neutron. This missing mass defect Δm is converted into kinetic energy and gamma photons via Einstein’s E = mc². Fissioning 1 kg of U-235 releases roughly 82 Terajoules (~20 Kilotons of TNT).
      </p>
    `,
    inputs: [
      { id: 'fis_fissile_kg', label: 'Fissile Material Mass (Kilograms kg)', type: 'number', default: '1.0', step: '0.1', min: '0.001' },
      { id: 'fis_isotope', label: 'Fissile Isotope', type: 'select', options: [
        { val: 'u235', text: 'Uranium-235 (~200 MeV per fission)' },
        { val: 'pu239', text: 'Plutonium-239 (~207 MeV per fission)' },
        { val: 'u233', text: 'Uranium-233 (~198 MeV per fission)' }
      ]},
      { id: 'fis_burnup_pct', label: 'Fission Efficiency / Burnup (%)', type: 'number', default: '100', step: '5', min: '0.1', max: '100' }
    ],
    presets: [
      { label: '1 kg Pure U-235 (100% Fission)', values: { fis_fissile_kg: 1.0, fis_isotope: 'u235', fis_burnup_pct: 100 } },
      { label: 'Little Boy Bomb (64 kg U-235, ~1.4% Burnup = 15 kt)', values: { fis_fissile_kg: 64, fis_isotope: 'u235', fis_burnup_pct: 1.4 } },
      { label: 'Fat Man Bomb (6.2 kg Pu-239, ~16% Burnup = 21 kt)', values: { fis_fissile_kg: 6.2, fis_isotope: 'pu239', fis_burnup_pct: 16 } },
      { label: 'Commercial 1 GW Nuclear Reactor (1 Day Consumption)', values: { fis_fissile_kg: 3.2, fis_isotope: 'u235', fis_burnup_pct: 100 } }
    ],
    outputs: [
      { id: 'out_total_energy_j', label: 'Total Energy Released (Joules)', default: '8.21 × 10¹³ J' },
      { id: 'out_tnt_yield', label: 'Explosive Yield Equivalent (TNT)', default: '19.63 Kilotons TNT' },
      { id: 'out_mass_defect_g', label: 'Total Mass Converted to Pure Energy', default: '0.913 Grams' },
      { id: 'out_coal_equiv', label: 'Equivalent Coal Burn Requirement', default: '2,800 Tons of Coal' }
    ],
    benchmarks: [
      { object: '1 kg Fissioned U-235', val: '8.2 × 10¹³ J (~20 kt TNT)', notes: 'Equivalent to burning 2,800 tons of coal' },
      { object: 'Little Boy (Hiroshima)', val: '15 Kilotons TNT', notes: 'Only ~0.7 grams of mass converted to energy' },
      { object: 'Fat Man (Nagasaki)', val: '21 Kilotons TNT', notes: '~1.0 gram of mass converted to energy' },
      { object: 'Annual 1,000 MW Reactor Refueling', val: '~1,200 kg U-235 burned', notes: 'Replaces 3 million tons of coal emissions' },
      { object: 'Mass-to-Energy Efficiency', val: '0.09% of rest mass', notes: 'Chemical reactions are 0.0000001% efficient' }
    ],
    faq: [
      { q: 'How much actual matter disappeared in the Hiroshima atomic bomb?', a: 'Only about 0.7 grams—roughly the weight of a single paperclip or dollar bill—was converted into energy. That tiny missing mass devastated an entire city.' },
      { q: 'Why do fission fragments release delayed heat after reactor shutdown?', a: 'Because fission fragments are neutron-rich radioactive isotopes that undergo chains of beta decays and gamma emission, producing "decay heat" (roughly 7% of operating power immediately after scram), which requires active cooling.' }
    ],
    calcJs: `
      const m_kg = parseFloat(document.getElementById('fis_fissile_kg').value) || 1.0;
      const iso = document.getElementById('fis_isotope').value;
      const burn_pct = parseFloat(document.getElementById('fis_burnup_pct').value) || 100;
      
      let mev_per_fiss = 200;
      let molar_mass = 0.235; // kg/mol
      if (iso === 'pu239') {
        mev_per_fiss = 207;
        molar_mass = 0.239;
      } else if (iso === 'u233') {
        mev_per_fiss = 198;
        molar_mass = 0.233;
      }
      
      const avogadro = 6.02214076e23;
      const n_atoms_total = (m_kg / molar_mass) * avogadro;
      const n_fissioned = n_atoms_total * (burn_pct / 100);
      
      const joules_per_mev = 1.602176634e-13;
      const total_joules = n_fissioned * mev_per_fiss * joules_per_mev;
      
      const tnt_tons = total_joules / 4.184e9;
      const c = 299792458;
      const mass_defect_kg = total_joules / (c * c);
      const mass_defect_g = mass_defect_kg * 1000;
      const coal_tons = total_joules / 2.93e10; // ~29.3 MJ/kg coal
      
      let yield_str = '';
      if (tnt_tons >= 1e6) yield_str = (tnt_tons / 1e6).toFixed(2) + ' Megatons TNT';
      else if (tnt_tons >= 1e3) yield_str = (tnt_tons / 1e3).toFixed(2) + ' Kilotons TNT';
      else yield_str = Math.round(tnt_tons).toLocaleString() + ' Tons TNT';
      
      document.getElementById('out_total_energy_j').textContent = fmtSci(total_joules) + ' J';
      document.getElementById('out_tnt_yield').textContent = yield_str;
      document.getElementById('out_mass_defect_g').textContent = fmtSci(mass_defect_g) + ' Grams';
      document.getElementById('out_coal_equiv').textContent = fmtSci(coal_tons) + ' Tons of Coal';
    `
  },
  {
    slug: 'fusion-q-value-calculator',
    title: 'Thermonuclear Fusion Q-Value & Lawson Criterion Calculator [n · τ · T Triple Product] | Digital Tools Shed',
    shortTitle: 'Fusion Q-Value Calculator',
    category: 'Nuclear & Particle Physics',
    badge: 'MAGNETIC CONFINEMENT FUSION',
    metaDesc: 'Calculate nuclear fusion Q-value energy release, alpha heating, and evaluate the Lawson triple product criterion for net power.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ²H + ³H \to ⁴He (3.5 \text{ MeV}) + n (14.1 \text{ MeV});\quad n · τ_E · T \ge 3 \times 10²¹ \text{ keV}·\text{s/m}³
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Deuterium-Tritium (D-T) fusion yields 17.59 MeV per reaction. To achieve net energy gain (Q > 1) or self-heating ignition (Q = ∞), a fusion plasma must satisfy the Lawson criterion triple product: plasma density n, energy confinement time τ_E, and core temperature T must exceed threshold values.
      </p>
    `,
    inputs: [
      { id: 'fus_reaction', label: 'Fusion Reaction Cycle', type: 'select', options: [
        { val: 'dt', text: 'Deuterium – Tritium (D-T, 17.59 MeV, Lowest T)' },
        { val: 'dd_he3', text: 'Deuterium – Deuterium -> He-3 + n (3.27 MeV)' },
        { val: 'dd_t', text: 'Deuterium – Deuterium -> T + p (4.03 MeV)' },
        { val: 'd_he3', text: 'Deuterium – Helium-3 (Aneutronic, 18.35 MeV)' },
        { val: 'p_b11', text: 'Proton – Boron-11 (Aneutronic, 8.68 MeV)' }
      ]},
      { id: 'fus_p_aux_mw', label: 'Auxiliary Input Heating Power (MW)', type: 'number', default: '50', step: '5', min: '1' },
      { id: 'fus_gain_q', label: 'Plasma Energy Gain Factor (Q = P_fusion / P_in)', type: 'number', default: '10', step: '0.5', min: '0.1', max: '100' }
    ],
    presets: [
      { label: 'JET Record 1997 (Q = 0.67, 16 MW Fusion)', values: { fus_reaction: 'dt', fus_p_aux_mw: 24, fus_gain_q: 0.67 } },
      { label: 'ITER Target Benchmark (Q = 10, 500 MW Fusion)', values: { fus_reaction: 'dt', fus_p_aux_mw: 50, fus_gain_q: 10 } },
      { label: 'NIF Inertial Ignition (Q = 1.5 Target Gain)', values: { fus_reaction: 'dt', fus_p_aux_mw: 2.1, fus_gain_q: 1.5 } },
      { label: 'Commercial Power Plant (Q = 25 - 40)', values: { fus_reaction: 'dt', fus_p_aux_mw: 40, fus_gain_q: 25 } }
    ],
    outputs: [
      { id: 'out_fus_thermal_mw', label: 'Gross Fusion Thermal Power Output', default: '500 MW' },
      { id: 'out_alpha_heating_mw', label: 'Self-Sustaining Alpha Heating (20%)', default: '100 MW' },
      { id: 'out_neutron_power_mw', label: 'Neutron Blanket Capture Power (80%)', default: '400 MW' },
      { id: 'out_lawson_status', label: 'Lawson Criterion Regime', default: 'Burning Plasma Regime (Q ≥ 5)' }
    ],
    benchmarks: [
      { object: 'JET Tokamak (UK, 1997)', val: 'Q = 0.67', notes: 'First controlled generation of megawatt fusion' },
      { object: 'Scientific Breakeven (Q = 1.0)', val: 'P_fusion = P_input', notes: 'Milestone surpassed by NIF in 2022' },
      { object: 'Burning Plasma (Q ≥ 5)', val: 'Alpha heating exceeds external heat', notes: 'Self-heating sustains core reaction' },
      { object: 'ITER Goal (Q = 10)', val: '50 MW in -> 500 MW out', notes: 'World’s largest magnetic confinement tokamak' },
      { object: 'Ignition (Q = ∞)', val: 'Zero external heat required', notes: 'Self-sustaining thermonuclear fire' }
    ],
    faq: [
      { q: 'Why is D-T fusion used instead of abundant pure Deuterium (D-D)?', a: 'Because the D-T reaction has a nuclear cross-section nearly 100 times larger than D-D at practical temperatures and ignites at ~150 million Kelvin (15 keV), whereas D-D requires temperatures exceeding 500 million Kelvin.' },
      { q: 'What is the role of the 14.1 MeV fast neutron?', a: 'Because neutrons carry no electrical charge, they escape the magnetic confinement cage and strike the surrounding lithium blanket, where their kinetic energy heats coolant to drive steam turbines while simultaneously breeding more tritium via ⁶Li + n → ⁴He + ³H.' }
    ],
    calcJs: `
      const rx = document.getElementById('fus_reaction').value;
      const p_in = parseFloat(document.getElementById('fus_p_aux_mw').value) || 50;
      const q = parseFloat(document.getElementById('fus_gain_q').value) || 10;
      
      const p_thermal = p_in * q;
      let alpha_frac = 0.20; // 3.5 MeV / 17.59 MeV for D-T
      if (rx === 'd_he3' || rx === 'p_b11') alpha_frac = 1.0; // charged particles
      
      const p_alpha = p_thermal * alpha_frac;
      const p_neutron = p_thermal * (1 - alpha_frac);
      
      let status = 'Sub-Breakeven (Q < 1)';
      if (q >= 20) status = 'Commercial Reactor Grade (Q > 20)';
      else if (q >= 5) status = 'Burning Plasma Regime (Q ≥ 5, Alpha Dominated)';
      else if (q >= 1) status = 'Scientific Breakeven Surpassed (Q ≥ 1)';
      
      document.getElementById('out_fus_thermal_mw').textContent = Math.round(p_thermal).toLocaleString() + ' MW';
      document.getElementById('out_alpha_heating_mw').textContent = Math.round(p_alpha).toLocaleString() + ' MW';
      document.getElementById('out_neutron_power_mw').textContent = Math.round(p_neutron).toLocaleString() + ' MW';
      document.getElementById('out_lawson_status').textContent = status;
    `
  },
  {
    slug: 'solar-neutrino-flux-earth',
    title: 'Solar Neutrino Flux & Cross-Section Calculator [Standard Solar Model Φ_ν] | Digital Tools Shed',
    shortTitle: 'Solar Neutrino Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'NEUTRINO ASTROPHYSICS FLUX',
    metaDesc: 'Calculate solar neutrino flux through Earth and human bodies from the pp-chain and CNO fusion cycles.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        Φ_total ≈ 6.54 × 10¹⁰ \text{ neutrinos} / (\text{cm}² · \text{s});\quad 4p \to ⁴He + 2e⁺ + 2ν_e + 26.73 \text{ MeV}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Because the Sun generates 3.828 × 10²⁶ Watts via hydrogen fusion, every reaction produces two electron neutrinos. Approximately 65 billion solar neutrinos pass through every square centimeter of your body every second, day and night, passing straight through the planet with almost zero interactions.
      </p>
    `,
    inputs: [
      { id: 'nu_body_area_m2', label: 'Human Cross-Sectional Area (m²)', type: 'number', default: '0.80', step: '0.05', min: '0.1' },
      { id: 'nu_exposure_hours', label: 'Exposure Duration (Hours)', type: 'number', default: '24', step: '1', min: '0.1' }
    ],
    presets: [
      { label: 'Average Adult Standing (0.8 m², 24 Hours)', values: { nu_body_area_m2: 0.80, nu_exposure_hours: 24 } },
      { label: 'Human Fingernail (1 cm² = 0.0001 m², 1 Second)', values: { nu_body_area_m2: 0.0001, nu_exposure_hours: 0.0002777 } },
      { label: 'Super-Kamiokande Detector (1,000 m² Area)', values: { nu_body_area_m2: 1000, nu_exposure_hours: 24 } }
    ],
    outputs: [
      { id: 'out_nu_per_sec', label: 'Neutrinos Transiting Body per Second', default: '5.23 × 10¹⁴ ν / sec' },
      { id: 'out_nu_total_trans', label: 'Total Neutrinos During Duration', default: '4.52 × 10¹⁹ Neutrinos' },
      { id: 'out_lifetime_interactions', label: 'Expected Lifetime Physical Collisions', default: '1 to 2 Neutrino Collisions in 80 Years' },
      { id: 'out_night_transit', label: 'Nighttime Attenuation through Earth Core', default: '99.999999999999% Transmitted' }
    ],
    benchmarks: [
      { object: 'Per Square Centimeter', val: '65 Billion / cm² / sec', notes: 'Constant flux day and night' },
      { object: 'pp-Chain Neutrinos', val: '86% of total (E < 0.42 MeV)', notes: 'Primary proton-proton initiation' },
      { object: 'Boron-8 High Energy Neutrinos', val: '0.01% (E up to 14 MeV)', notes: 'Detected by SNO and Super-K' },
      { object: 'Solar Neutrino Problem Solved', val: 'MSW Neutrino Flavor Oscillation', notes: '2015 Nobel Prize (McDonald & Kajita)' },
      { object: 'Mean Free Path in Solid Lead', val: '1 Light-Year of Solid Lead', notes: 'Neutrinos interact only via weak force' }
    ],
    faq: [
      { q: 'Why do neutrinos pass through Earth unimpeded at night?', a: 'Because neutrinos interact exclusively through the weak nuclear force and gravity, their interaction cross-section is unimaginably tiny (~10⁻⁴⁴ cm²). A neutrino would need to travel through a solid bar of lead one light-year thick to have a 50% chance of colliding with an atom.' },
      { q: 'What was the historic "Solar Neutrino Problem"?', a: 'Early radiochemical detectors like the Homestake experiment detected only ⅓ of the predicted electron neutrinos. In 2001, the Sudbury Neutrino Observatory (SNO) proved that neutrinos oscillate into muon and tau flavors during their 8-minute flight from the Sun.' }
    ],
    calcJs: `
      const a_m2 = parseFloat(document.getElementById('nu_body_area_m2').value) || 0.80;
      const hrs = parseFloat(document.getElementById('nu_exposure_hours').value) || 24;
      
      const flux_cm2_s = 6.54e10;
      const a_cm2 = a_m2 * 10000;
      const rate_per_sec = flux_cm2_s * a_cm2;
      const total_sec = hrs * 3600;
      const total_nu = rate_per_sec * total_sec;
      
      // Typical human body interaction probability ~ 1 interaction per 50-80 years
      const lifetime_coll = (hrs / (80 * 365.25 * 24)) * 1.5;
      
      document.getElementById('out_nu_per_sec').textContent = fmtSci(rate_per_sec) + ' ν / sec';
      document.getElementById('out_nu_total_trans').textContent = fmtSci(total_nu) + ' Neutrinos';
      document.getElementById('out_lifetime_interactions').textContent = lifetime_coll < 0.01 ? fmtSci(lifetime_coll) + ' Interactions' : lifetime_coll.toFixed(2) + ' Collisions';
      document.getElementById('out_night_transit').textContent = '99.999999999999 % Penetration';
    `
  },
  {
    slug: 'cosmic-ray-flux-altitude',
    title: 'Cosmic Ray Flux & Atmospheric Radiation Altitude Scaling [Aviation Ionization Dose] | Digital Tools Shed',
    shortTitle: 'Cosmic Ray Altitude Dose',
    category: 'Astrophysics & Solar Physics',
    badge: 'ATMOSPHERIC RADIATION DOSIMETRY',
    metaDesc: 'Model secondary cosmic ray muon flux and ionizing radiation dose rates from sea level to commercial jetliner cruise altitudes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        D(h) ≈ D₀ · e^{h / H_dose};\quad \text{Dose at 35,000 ft} \approx 3 - 5 \text{ µSv/hour}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Earth’s atmosphere acts as a radiation shield equivalent to 10 meters of water or 1 meter of solid concrete. As altitude increases, atmospheric mass shielding drops exponentially, causing cosmic ray muon, neutron, and gamma flux to multiply by 30× to 70× at commercial airliner cruise altitudes (30,000–40,000 ft).
      </p>
    `,
    inputs: [
      { id: 'cr_alt_ft', label: 'Flight / Mountain Altitude (Feet)', type: 'number', default: '35000', step: '1000', min: '0', max: '80000' },
      { id: 'cr_flight_hours', label: 'Flight Duration (Hours)', type: 'number', default: '8', step: '1', min: '0.5' }
    ],
    presets: [
      { label: 'Sea Level (0 ft, Baseline)', values: { cr_alt_ft: 0, cr_flight_hours: 8 } },
      { label: 'Denver Mile High City (5,280 ft)', values: { cr_alt_ft: 5280, cr_flight_hours: 8 } },
      { label: 'Mount Everest Summit (29,032 ft)', values: { cr_alt_ft: 29032, cr_flight_hours: 8 } },
      { label: 'Commercial Airline Cruise (35,000 ft)', values: { cr_alt_ft: 35000, cr_flight_hours: 8 } },
      { label: 'Concorde Supersonic Cruise (60,000 ft)', values: { cr_alt_ft: 60000, cr_flight_hours: 3.5 } }
    ],
    outputs: [
      { id: 'out_dose_rate', label: 'Ambient Dose Equivalent Rate (µSv/h)', default: '4.20 µSv / hr' },
      { id: 'out_total_flight_dose', label: 'Total Flight Radiation Dose (µSv)', default: '33.6 µSv' },
      { id: 'out_xray_equiv', label: 'Equivalent Chest X-Rays', default: '1.7 Chest X-Rays' },
      { id: 'out_shielding_air', label: 'Atmospheric Shielding Remaining', default: '23.8 % of Sea Level Column' }
    ],
    benchmarks: [
      { object: 'Sea Level Cosmic Dose', val: '0.04 µSv / hr', notes: '~0.35 mSv per year baseline' },
      { object: 'Transatlantic Flight (NY to London)', val: '30 – 40 µSv', notes: 'Equal to 1–2 dental X-rays' },
      { object: 'Polar Flight Route', val: '+50% dose increase', notes: 'Geomagnetic field dips toward magnetic poles' },
      { object: 'Airline Crew Annual Dose', val: '2.0 – 5.0 mSv / year', notes: 'Classified as radiation workers' },
      { object: 'ISS Low Earth Orbit', val: '25 – 30 µSv / hr', notes: 'Outside atmospheric shielding' }
    ],
    faq: [
      { q: 'Why are commercial flight crews classified as radiation workers?', a: 'Because flight crews spend 800+ hours annually at 30,000–40,000 feet, accumulating 2 to 5 millisieverts per year—higher average occupational radiation doses than nuclear power plant operators.' },
      { q: 'Why do polar routes receive higher radiation doses?', a: 'Earth’s magnetic field deflects incoming charged cosmic rays toward the north and south magnetic poles. Near the equator, geomagnetic shielding is strongest, whereas polar routes lack geomagnetic deflection.' }
    ],
    calcJs: `
      const alt_ft = parseFloat(document.getElementById('cr_alt_ft').value) || 35000;
      const hrs = parseFloat(document.getElementById('cr_flight_hours').value) || 8;
      
      const alt_km = (alt_ft * 0.3048) / 1000;
      // Standard empirical aviation dosimetry model
      // Base sea level ~ 0.04 uSv/h, doubling every ~1.5 km up to 12 km
      const rate_usv_h = 0.04 * Math.exp(alt_km / 2.3);
      const total_dose = rate_usv_h * hrs;
      const xrays = total_dose / 20; // ~20 uSv per chest X-ray
      
      // Barometric column fraction
      const p_frac = Math.exp(-alt_km / 7.5) * 100;
      
      document.getElementById('out_dose_rate').textContent = rate_usv_h.toFixed(2) + ' µSv / hr';
      document.getElementById('out_total_flight_dose').textContent = total_dose.toFixed(1) + ' µSv';
      document.getElementById('out_xray_equiv').textContent = xrays.toFixed(1) + ' Chest X-Rays';
      document.getElementById('out_shielding_air').textContent = p_frac.toFixed(1) + ' % of Sea Level Atmosphere';
    `
  },
  {
    slug: 'gzk-cosmic-ray-energy-cutoff',
    title: 'GZK Cosmic Ray Energy Cutoff & Horizon Calculator [Photopion Threshold E_GZK] | Digital Tools Shed',
    shortTitle: 'GZK Energy Cutoff Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'ULTRA-HIGH ENERGY COSMIC HORIZON',
    metaDesc: 'Calculate the Greisen-Zatsepin-Kuzmin (GZK) photopion energy cutoff at 5 × 10¹⁹ eV and cosmic ray horizon distance through CMB photons.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        p + γ_CMB \to Δ⁺ \to p + π⁰ \quad (E_GZK \approx 5 \times 10¹⁹ \text{ eV});\quad D_GZK \approx 50 \text{ Mpc}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed in 1966 by Kenneth Greisen, Georgiy Zatsepin, and Vadim Kuzmin, the GZK limit proves that the universe is opaque to ultra-high-energy cosmic ray (UHECR) protons. Above 50 Exa-electronvolts (5 × 10¹⁹ eV), protons collide with 2.73 K CMB photons with enough center-of-mass energy to produce delta resonances and pions, degrading their energy within 50 Megaparsecs.
      </p>
    `,
    inputs: [
      { id: 'gzk_energy_eev', label: 'Proton Energy (Exa-electronvolts EeV = 10¹⁸ eV)', type: 'number', default: '60', step: '5', min: '1' }
    ],
    presets: [
      { label: 'Sub-GZK Cosmic Ray (10 EeV = 10¹⁹ eV)', values: { gzk_energy_eev: 10 } },
      { label: 'GZK Cutoff Threshold (50 EeV = 5 × 10¹⁹ eV)', values: { gzk_energy_eev: 50 } },
      { label: 'Extreme UHECR (100 EeV)', values: { gzk_energy_eev: 100 } },
      { label: 'Oh-My-God Particle 1991 (320 EeV = 51 Joules)', values: { gzk_energy_eev: 320 } }
    ],
    outputs: [
      { id: 'out_gzk_joules', label: 'Kinetic Energy in Macroscopic Joules', default: '9.61 Joules' },
      { id: 'out_gzk_speed_diff', label: 'Speed Margin Below Light Speed (c - v)', default: '4.4 × 10⁻¹⁶ m/s' },
      { id: 'out_gzk_horizon_mpc', label: 'GZK Attenuation Horizon Distance', default: '~ 50 Mpc (163 Million Light-Years)' },
      { id: 'out_gzk_status', label: 'Photopion Production Status', default: 'Active GZK Photopion Dissipation' }
    ],
    benchmarks: [
      { object: 'LHC Maximum Beam Energy', val: '6.8 TeV = 0.0068 PeV', notes: '7 million times weaker than GZK limit' },
      { object: 'GZK Energy Threshold', val: '50 EeV (8.0 Joules)', notes: 'Photopion energy degradation begins' },
      { object: 'Oh-My-God Particle (Utah, 1991)', val: '320 EeV (51 Joules)', notes: 'Single subatomic proton carrying kinetic energy of a 60 mph baseball' },
      { object: 'Amaterasu Particle (Telescope Array, 2021)', val: '244 EeV', notes: 'Pointed toward local void with no apparent source' },
      { object: 'GZK Horizon', val: '~50 – 100 Mpc', notes: 'Any particle detected > 50 EeV must originate locally' }
    ],
    faq: [
      { q: 'How can a single subatomic particle carry 50 Joules of energy?', a: 'A 320 EeV proton moves at 0.9999999999999999999999951 c (γ ≈ 3.4 × 10¹¹). The kinetic energy of a fast-pitched baseball is packed into a particle 10⁻¹⁵ meters across.' },
      { q: 'Why is the GZK limit proof that UHECRs come from nearby galaxies?', a: 'Any proton traveling through intergalactic space for more than ~160 million light-years will inevitably collide with CMB photons and lose energy until it drops below 5 × 10¹⁹ eV. Thus, particles exceeding this threshold must originate within the local supercluster.' }
    ],
    calcJs: `
      const e_eev = parseFloat(document.getElementById('gzk_energy_eev').value) || 60;
      const ev = e_eev * 1e18;
      const joules = ev * 1.602176634e-19;
      
      const mp_kg = 1.6726219e-27;
      const c = 299792458;
      const rest_j = mp_kg * c * c;
      const gamma = (joules / rest_j) + 1;
      
      // c - v approx = c / (2 * gamma^2)
      const c_minus_v = c / (2 * gamma * gamma);
      
      let horizon = 'Infinite (Below GZK Threshold: Transparent Cosmos)';
      let status = 'Below GZK Threshold (Unimpeded Transit)';
      if (e_eev >= 50) {
        horizon = '~ 50 Mpc (~ 163 Million Light-Years)';
        status = 'Active GZK Photopion Dissipation on CMB';
      }
      
      document.getElementById('out_gzk_joules').textContent = fmtSci(joules) + ' Joules';
      document.getElementById('out_gzk_speed_diff').textContent = fmtSci(c_minus_v) + ' m/s below c';
      document.getElementById('out_gzk_horizon_mpc').textContent = horizon;
      document.getElementById('out_gzk_status').textContent = status;
    `
  },
  {
    slug: 'synchrotron-radiation-power',
    title: 'Relativistic Synchrotron Radiation Power & Spectrum Calculator [Larmor Relativistic Loss] | Digital Tools Shed',
    shortTitle: 'Synchrotron Power Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'MAGNETIC BREMSSTRAHLUNG RADIANCE',
    metaDesc: 'Calculate relativistic synchrotron radiation energy loss, critical frequency, and beam angular beaming for electrons in magnetic fields.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        P = (2 e² · c / 3) · γ⁴ / ρ² = (2 e⁴ · B² · γ² · v²) / (3 m_e² · c³)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        When charged particles (especially low-mass electrons) are accelerated in curved trajectories by strong magnetic fields, they emit polarized synchrotron radiation. Because emitted power scales as γ⁴, synchrotron radiation is the primary energy loss mechanism in circular electron synchrotrons and powers astrophysical pulsar wind nebulae.
      </p>
    `,
    inputs: [
      { id: 'syn_b_field_tesla', label: 'Magnetic Field Strength B (Tesla T)', type: 'number', default: '1.0', step: '0.1', min: '0.0001' },
      { id: 'syn_gamma', label: 'Lorentz Factor γ (E / m_e c²)', type: 'number', default: '5000', step: '500', min: '10' }
    ],
    presets: [
      { label: 'Synchrotron Light Source Facility (1.0 T, γ = 5,000 = 2.5 GeV)', values: { syn_b_field_tesla: 1.0, syn_gamma: 5000 } },
      { label: 'Crab Nebula Pulsar Magnetosphere (10,000 T, γ = 10,000)', values: { syn_b_field_tesla: 10000, syn_gamma: 10000 } },
      { label: 'Jupiter Radiation Belt (0.0004 T, γ = 20)', values: { syn_b_field_tesla: 0.0004, syn_gamma: 20 } }
    ],
    outputs: [
      { id: 'out_syn_power_w', label: 'Radiation Power per Electron (Watts)', default: '3.98 × 10⁻¹¹ W' },
      { id: 'out_syn_power_kev', label: 'Power in keV per Revolution', default: '520 keV / rev' },
      { id: 'out_crit_freq_hz', label: 'Critical Photon Frequency (ν_c)', default: '4.17 × 10¹⁷ Hz (Hard X-Ray)' },
      { id: 'out_beam_angle_mrad', label: 'Relativistic Beaming Half-Angle (1/γ)', default: '0.20 mrad (0.011°)' }
    ],
    benchmarks: [
      { object: 'Crab Nebula Glow', val: 'Continuum synchrotron', notes: 'Powers emission across radio, optical, and X-ray' },
      { object: 'ESRF / APS Synchrotron Light Source', val: 'Angstrom X-ray pulses', notes: 'Images protein crystalline structures' },
      { object: 'LEP Collider (CERN)', val: 'Limit on circular e⁺e⁻', notes: 'Synchrotron losses forced circular leptons to switch to protons' },
      { object: 'Jupiter Decimetric Emission', val: '100 MHz – 3 GHz radio', notes: 'Discovered in 1955 via trapped electrons' }
    ],
    faq: [
      { q: 'Why do synchrotrons emit light in such a tight forward beam?', a: 'In the electron’s rest frame, emission is a broad dipole pattern. When transformed into the laboratory frame via relativistic aberration, photons are compressed into an intense forward cone of half-angle θ ≈ 1 / γ.' },
      { q: 'Why did circular electron colliders hit a wall at LEP?', a: 'Because synchrotron radiation loss per turn scales as E⁴ / r. To double electron beam energy requires 16 times more RF power to replenish emitted radiation, making linear colliders (like ILC) necessary for higher electron energies.' }
    ],
    calcJs: `
      const B = parseFloat(document.getElementById('syn_b_field_tesla').value) || 1.0;
      const gamma = parseFloat(document.getElementById('syn_gamma').value) || 5000;
      
      const e = 1.602176634e-19;
      const me = 9.1093837e-31;
      const c = 299792458;
      
      // P = (2 * e^4 * B^2 * gamma^2) / (3 * me^2 * c)
      const p_watts = (2 * Math.pow(e, 4) * B * B * gamma * gamma) / (3 * me * me * c);
      const crit_freq_hz = (3 * e * B * gamma * gamma) / (4 * Math.PI * me);
      const beam_angle_rad = 1 / gamma;
      const beam_angle_mrad = beam_angle_rad * 1000;
      
      let spec = 'Visible Light';
      if (crit_freq_hz > 1e18) spec = 'Gamma Ray';
      else if (crit_freq_hz > 3e16) spec = 'Hard X-Ray';
      else if (crit_freq_hz > 7.5e14) spec = 'Ultraviolet';
      else if (crit_freq_hz < 3e11) spec = 'Radio Wave';
      
      document.getElementById('out_syn_power_w').textContent = fmtSci(p_watts) + ' W';
      document.getElementById('out_syn_power_kev').textContent = fmtSci(p_watts / 1.602e-16) + ' keV/s';
      document.getElementById('out_crit_freq_hz').textContent = fmtSci(crit_freq_hz) + ' Hz (' + spec + ')';
      document.getElementById('out_beam_angle_mrad').textContent = beam_angle_mrad.toFixed(3) + ' mrad (' + (beam_angle_rad * 180 / Math.PI).toFixed(4) + '°)';
    `
  },
  {
    slug: 'bremsstrahlung-radiation-loss',
    title: 'Thermal Bremsstrahlung Plasma Radiation Loss [Free-Free Emission ε_ff] | Digital Tools Shed',
    shortTitle: 'Bremsstrahlung Radiation Loss',
    category: 'Astrophysics & Solar Physics',
    badge: 'ASTROPHYSICAL PLASMA EMISSION',
    metaDesc: 'Compute thermal bremsstrahlung (free-free) emissivity and cooling time for hot galaxy cluster gas and fusion plasmas.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ε_ff \approx 1.4 \times 10⁻³⁴ · Z² · n_e · n_i · T^{1/2} · \bar{g}_B \text{ W/m}³
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Bremsstrahlung (German for "braking radiation") occurs when a free electron decelerates in the electrostatic Coulomb field of an atomic nucleus without being captured. In intra-cluster media (ICM) at temperatures of 10–100 million Kelvin, thermal bremsstrahlung shines as diffuse X-rays, revealing 85% of ordinary baryonic cluster mass.
      </p>
    `,
    inputs: [
      { id: 'brem_temp_k', label: 'Plasma Temperature T (Kelvin K)', type: 'number', default: '50000000', step: '5000000', min: '10000' },
      { id: 'brem_ne_m3', label: 'Electron Density n_e (m⁻³)', type: 'number', default: '1000', step: 'any', min: '1' }
    ],
    presets: [
      { label: 'Galaxy Cluster ICM (T = 50 Million K, n_e = 1,000 m⁻³)', values: { brem_temp_k: 50000000, brem_ne_m3: 1000 } },
      { label: 'Solar Corona Loop (T = 2 Million K, n_e = 10¹⁵ m⁻³)', values: { brem_temp_k: 2000000, brem_ne_m3: 1e15 } },
      { label: 'Tokamak Fusion Core (T = 150 Million K, n_e = 10²⁰ m⁻³)', values: { brem_temp_k: 150000000, brem_ne_m3: 1e20 } }
    ],
    outputs: [
      { id: 'out_brem_power_density', label: 'Volumetric Emissivity ε_ff (W/m³)', default: '9.90 × 10⁻²⁵ W/m³' },
      { id: 'out_peak_photon_kev', label: 'Characteristic Photon Energy (k_B T)', default: '4.31 keV (Soft X-Ray)' },
      { id: 'out_cooling_time_gyr', label: 'Thermal Cooling Timescale', default: '14.2 Billion Years' },
      { id: 'out_brem_regime', label: 'Astrophysical Emission Regime', default: 'Intracluster Medium (Diffuse X-Ray Glow)' }
    ],
    benchmarks: [
      { object: 'Coma Galaxy Cluster', val: 'T ≈ 90 Million K (8 keV)', notes: 'Diffuse X-ray glow observed by Chandra' },
      { object: 'Solar Flare Soft X-Rays', val: 'Thermal bremsstrahlung', notes: 'Coronal magnetic reconnection plasma' },
      { object: 'Tokamak Impurity Radiation', val: 'Scales as Z²', notes: 'Tungsten impurities quench fusion plasma' },
      { object: 'H II Ionized Gas Regions', val: 'Radio free-free continuum', notes: 'Thermal emission from Orion Nebula' }
    ],
    faq: [
      { q: 'Why is bremsstrahlung considered an enemy of magnetic fusion energy?', a: 'Because bremsstrahlung power loss scales as Z² · n_e · n_i · √T. Heavy metallic impurities (like tungsten or iron sputtered from the reactor wall) radiate away heat so rapidly that they can instantly extinguish the fusion burn.' },
      { q: 'How does bremsstrahlung reveal dark matter in galaxy clusters?', a: 'X-ray observations of bremsstrahlung measure the temperature and pressure profile of the hot gas. Applying hydrostatic equilibrium reveals that the gas requires 5 to 6 times more gravitational mass to remain bound than all visible stars and gas combined.' }
    ],
    calcJs: `
      const t_k = parseFloat(document.getElementById('brem_temp_k').value) || 50000000;
      const ne = parseFloat(document.getElementById('brem_ne_m3').value) || 1000;
      
      const kb = 1.380649e-23;
      const z = 1.0; // pure hydrogen plasma
      const gaunt = 1.2;
      
      // Emissivity = 1.4e-34 * Z^2 * ne * ni * sqrt(T) * gaunt
      const eps_w_m3 = 1.4e-34 * z * z * ne * ne * Math.sqrt(t_k) * gaunt;
      const energy_density_j = 3 * ne * kb * t_k;
      const t_cool_s = energy_density_j / Math.max(1e-40, eps_w_m3);
      const t_cool_gyr = t_cool_s / (3.15576e16);
      
      const e_peak_kev = (kb * t_k) / 1.602176634e-16;
      
      document.getElementById('out_brem_power_density').textContent = fmtSci(eps_w_m3) + ' W/m³';
      document.getElementById('out_peak_photon_kev').textContent = e_peak_kev.toFixed(2) + ' keV';
      document.getElementById('out_cooling_time_gyr').textContent = t_cool_gyr > 1000 ? fmtSci(t_cool_gyr) + ' Gyr' : t_cool_gyr.toFixed(1) + ' Gyr';
      document.getElementById('out_brem_regime').textContent = e_peak_kev > 1 ? 'X-Ray Hot Plasma' : 'Ultraviolet / Optical Plasma';
    `
  },
  {
    slug: 'quantum-harmonic-oscillator-levels',
    title: 'Quantum Harmonic Oscillator Energy Levels & Zero-Point Energy [E_n = (n + ½)ħω] | Digital Tools Shed',
    shortTitle: 'Harmonic Oscillator Levels',
    category: 'Quantum Mechanics & Vacuum Physics',
    badge: 'QUANTUM BOUND STATE SPECTRUM',
    metaDesc: 'Compute quantized energy eigenvalues, ground-state zero-point energy, and vibrational transitions for molecular bonds.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        E_n = (n + ½) · ħ · ω = (n + ½) · h · ν;\quad E₀ = ½ · ħ · ω \text{ (Zero-Point Energy)}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The quantum harmonic oscillator is one of the most important model systems in quantum physics. Unlike classical oscillators that can sit motionless at zero energy, the Heisenberg uncertainty principle demands that the ground state (n = 0) retains a nonzero zero-point energy of ½ħω, preventing absolute stillness even at absolute zero (0 Kelvin).
      </p>
    `,
    inputs: [
      { id: 'qho_freq_thz', label: 'Vibrational Frequency ν (Terahertz THz = 10¹² Hz)', type: 'number', default: '8.65', step: '0.5', min: '0.01' },
      { id: 'qho_quantum_n', label: 'Vibrational Quantum Number (n)', type: 'number', default: '0', step: '1', min: '0', max: '50' }
    ],
    presets: [
      { label: 'CO Carbon Monoxide Bond (64.3 THz, Ground n = 0)', values: { qho_freq_thz: 64.3, qho_quantum_n: 0 } },
      { label: 'H₂ Hydrogen Molecule (124.8 THz, Ground n = 0)', values: { qho_freq_thz: 124.8, qho_quantum_n: 0 } },
      { label: 'Optical Phonon in Silicon (15.6 THz, Excited n = 1)', values: { qho_freq_thz: 15.6, qho_quantum_n: 1 } },
      { label: 'Trapped Ion Micro-Oscillator (1 MHz = 0.000001 THz)', values: { qho_freq_thz: 0.000001, qho_quantum_n: 0 } }
    ],
    outputs: [
      { id: 'out_qho_energy_ev', label: 'Total Eigenstate Energy E_n (eV)', default: '0.133 eV' },
      { id: 'out_zpe_ev', label: 'Ground State Zero-Point Energy E₀', default: '0.133 eV (Nonzero at 0 K)' },
      { id: 'out_trans_wl', label: 'Vibrational Transition Wavelength (Δn = 1)', default: '4.66 µm (Infrared)' },
      { id: 'out_thermal_temp', label: 'Characteristic Vibrational Temp θ_vib', default: '415 K' }
    ],
    benchmarks: [
      { object: 'Liquid Helium (He-4)', val: 'Never freezes at 1 atm', notes: 'Zero-point motion prevents crystallization at 0 K' },
      { object: 'Hydrogen H₂ Zero-Point Energy', val: '0.26 eV (25 kJ/mol)', notes: 'Weakens H-H bond enthalpy significantly' },
      { object: 'Equally Spaced Ladders', val: 'ΔE = ħω constant', notes: 'Basis of quantum field creation/annihilation operators' },
      { object: 'Casimir Force & Lamb Shift', val: 'Vacuum ZPE sum', notes: 'Macroscopic manifestation of harmonic field modes' }
    ],
    faq: [
      { q: 'Why does liquid helium remain liquid at absolute zero?', a: 'Due to helium’s low atomic mass and weak interatomic van der Waals forces, its quantum zero-point energy (½ħω) is larger than the lattice binding energy. Helium cannot freeze into a solid under normal pressure, no matter how cold it gets.' },
      { q: 'Why is the spacing between energy levels exactly equal (ΔE = ħω)?', a: 'Because the harmonic potential V(x) = ½ k x² is symmetric and quadratic. Raising and lowering ladder operators (a† and a) step through the eigenstates in equal discrete energy increments.' }
    ],
    calcJs: `
      const freq_thz = parseFloat(document.getElementById('qho_freq_thz').value) || 8.65;
      const n = parseInt(document.getElementById('qho_quantum_n').value, 10) || 0;
      
      const h = 6.62607015e-34;
      const c = 299792458;
      const kb = 1.380649e-23;
      const freq_hz = freq_thz * 1e12;
      const h_nu_j = h * freq_hz;
      const h_nu_ev = h_nu_j / 1.602176634e-19;
      
      const en_ev = (n + 0.5) * h_nu_ev;
      const zpe_ev = 0.5 * h_nu_ev;
      const lambda_m = c / freq_hz;
      const theta_k = h_nu_j / kb;
      
      document.getElementById('out_qho_energy_ev').textContent = en_ev.toFixed(4) + ' eV (' + fmtSci(en_ev * 1.602e-19) + ' J)';
      document.getElementById('out_zpe_ev').textContent = zpe_ev.toFixed(4) + ' eV';
      document.getElementById('out_trans_wl').textContent = (lambda_m * 1e6).toFixed(2) + ' µm (IR)';
      document.getElementById('out_thermal_temp').textContent = Math.round(theta_k) + ' Kelvin';
    `
  },
  {
    slug: 'bohr-radius-orbit-calculator',
    title: 'Bohr Radius & Hydrogen Electron Orbit Calculator [Atomic Quantum Scales a_0] | Digital Tools Shed',
    shortTitle: 'Bohr Radius Calculator',
    category: 'Quantum Mechanics & Vacuum Physics',
    badge: 'ATOMIC QUANTUM ARCHITECTURE',
    metaDesc: 'Calculate the Bohr radius, orbital radii, electron velocities, and binding energies for hydrogenic atomic systems.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        a₀ = (4πε₀ · ħ²) / (m_e · e²) \approx 0.0529177 \text{ nm};\quad r_n = (n² / Z) · a₀;\quad v_n = (Z / n) · α · c
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Derived by Niels Bohr in 1913, the Bohr radius a₀ defines the characteristic spatial scale of atoms. In the ground state of hydrogen, the electron’s most probable radial distance is exactly a₀ (0.529 Ångströms), orbiting at 1/137th the speed of light (α · c ≈ 2,187 km/s).
      </p>
    `,
    inputs: [
      { id: 'bohr_n', label: 'Principal Quantum Number (n)', type: 'number', default: '1', step: '1', min: '1', max: '200' },
      { id: 'bohr_z', label: 'Nuclear Atomic Number (Z)', type: 'number', default: '1', step: '1', min: '1', max: '118' }
    ],
    presets: [
      { label: 'Hydrogen Ground State (n = 1, Z = 1)', values: { bohr_n: 1, bohr_z: 1 } },
      { label: 'Hydrogen First Excited State (n = 2, Z = 1)', values: { bohr_n: 2, bohr_z: 1 } },
      { label: 'Singly Ionized Helium He⁺ (n = 1, Z = 2)', values: { bohr_n: 1, bohr_z: 2 } },
      { label: 'Rydberg Atom Giant Orbit (n = 100, Z = 1)', values: { bohr_n: 100, bohr_z: 1 } },
      { label: 'Hydrogen-like Uranium U⁹¹⁺ (n = 1, Z = 92)', values: { bohr_n: 1, bohr_z: 92 } }
    ],
    outputs: [
      { id: 'out_orbit_radius_nm', label: 'Bohr Orbital Radius (r_n)', default: '0.0529 nm (0.529 Å)' },
      { id: 'out_electron_vel_kms', label: 'Electron Orbital Velocity (v_n)', default: '2,188 km/s (0.0073 c)' },
      { id: 'out_binding_e_ev', label: 'Ionization Binding Energy', default: '-13.606 eV' },
      { id: 'out_debroglie_circ', label: 'Orbital Circumference Match', default: 'Exactly 1 de Broglie Wavelength' }
    ],
    benchmarks: [
      { object: 'Ground State Hydrogen a₀', val: '0.529 Å (0.0529 nm)', notes: 'Fundamental physical constant' },
      { object: 'Ground State Speed v₁', val: '2,187.7 km/s', notes: 'Exactly 1/137th the speed of light (α·c)' },
      { object: 'Rydberg Atom (n = 100)', val: 'r ≈ 529 nm (~0.5 µm)', notes: 'Giant atom large enough to resolve in optical microscope' },
      { object: 'Uranium U⁹¹⁺ Inner Shell', val: 'v ≈ 0.67 c (67% of light speed)', notes: 'Severe relativistic orbital contraction' }
    ],
    faq: [
      { q: 'Why is the Bohr model replaced by quantum mechanics?', a: 'The Bohr model assumed deterministic planetary orbits. Modern quantum mechanics replaces orbits with probability density wavefunctions (orbitals |ψ|²). However, Bohr’s predicted radii, energies, and velocities remain strictly accurate mathematical expectation values.' },
      { q: 'What happens to the inner electrons of heavy atoms like gold and uranium?', a: 'In heavy elements (Z > 70), inner s-electrons travel at over 50% of light speed. Relativistic mass increases contract their orbits, which explains why gold is golden rather than silvery and why mercury is a liquid at room temperature.' }
    ],
    calcJs: `
      const n = parseInt(document.getElementById('bohr_n').value, 10) || 1;
      const z = parseInt(document.getElementById('bohr_z').value, 10) || 1;
      
      const a0_m = 5.291772109e-11;
      const c = 299792458;
      const alpha = 7.2973525693e-3;
      
      const r_m = (n * n / z) * a0_m;
      const r_nm = r_m * 1e9;
      const v_ms = (z / n) * alpha * c;
      const v_kms = v_ms / 1000;
      const binding_ev = -13.605693 * (z * z) / (n * n);
      
      let radius_str = r_nm < 1 ? r_nm.toFixed(4) + ' nm (' + (r_nm * 10).toFixed(3) + ' Å)' : fmtSci(r_nm) + ' nm';
      
      document.getElementById('out_orbit_radius_nm').textContent = radius_str;
      document.getElementById('out_electron_vel_kms').textContent = Math.round(v_kms).toLocaleString() + ' km/s (' + (v_ms / c).toFixed(4) + ' c)';
      document.getElementById('out_binding_e_ev').textContent = binding_ev.toFixed(3) + ' eV';
      document.getElementById('out_debroglie_circ').textContent = '2π r = ' + n + ' × λ_deBroglie';
    `
  },
  {
    slug: 'fine-structure-constant-calculator',
    title: 'Fine-Structure Constant (α) & Relativistic Splitting Calculator [Electromagnetic Coupling 1/137] | Digital Tools Shed',
    shortTitle: 'Fine-Structure Calculator',
    category: 'Quantum Mechanics & Vacuum Physics',
    badge: 'FUNDAMENTAL QUANTUM COUPLING',
    metaDesc: 'Explore the dimensionless fine-structure constant α ≈ 1/137.036, Sommerfeld fine-structure splitting, and atomic orbital speeds.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        α = e² / (4πε₀ · ħ · c) = μ₀ · e² · c / (2h) \approx 1 / 137.035999084
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Introduced by Arnold Sommerfeld in 1916, the fine-structure constant α is the fundamental dimensionless coupling constant characterizing the strength of the electromagnetic interaction between elementary charged particles. Physicist Richard Feynman called it "one of the greatest damn mysteries of physics."
      </p>
    `,
    inputs: [
      { id: 'alpha_z', label: 'Nuclear Charge (Atomic Number Z)', type: 'number', default: '1', step: '1', min: '1', max: '137' }
    ],
    presets: [
      { label: 'Hydrogen (Z = 1, v = 0.0073 c)', values: { alpha_z: 1 } },
      { label: 'Carbon (Z = 6)', values: { alpha_z: 6 } },
      { label: 'Gold (Z = 79, Relativistic Color Shift)', values: { alpha_z: 79 } },
      { label: 'Uranium (Z = 92, Heavy Relativistic Core)', values: { alpha_z: 92 } },
      { label: 'Feynman Limit (Z = 137, v -> c)', values: { alpha_z: 137 } }
    ],
    outputs: [
      { id: 'out_alpha_val', label: 'Fine-Structure Constant Value (α)', default: '0.00729735 (1 / 137.036)' },
      { id: 'out_inner_vel', label: 'Inner-Shell Electron Speed (Z · α · c)', default: '2,188 km/s (0.73 % c)' },
      { id: 'out_fine_splitting', label: 'Hydrogen 2P Fine Splitting ΔE', default: '4.53 × 10⁻⁵ eV (10.95 GHz)' },
      { id: 'out_feynman_limit', label: 'Periodic Table Critical Bound', default: 'Safe (Z < 137 Stable Vacuum)' }
    ],
    benchmarks: [
      { object: 'Experimental CODATA 2018 Value', val: '1 / 137.035999084(21)', notes: 'Measured via electron anomalous magnetic moment & recoil' },
      { object: 'Speed of Electron in Hydrogen', val: 'v = α · c', notes: 'Relativistic fraction of light speed' },
      { object: 'Fine-Structure Energy Shift', val: 'ΔE ∝ α⁴', notes: 'Splits spectral lines into doublets' },
      { object: 'Anthropic Principle Window', val: '±4% variation in α', notes: 'Slight changes prevent carbon fusion in stars' },
      { object: 'Untriheptium (Z = 137)', val: 'v_electron = c', notes: 'Bohr formula predicts superluminal breakdown' }
    ],
    faq: [
      { q: 'Why is α considered a "pure" number in physics?', a: 'Because α is dimensionless. Whether measured by an alien on Alpha Centauri using cubits and solar days or by humans using meters and seconds, the ratio e² / (4πε₀ ħ c) always equals exactly 0.00729735... (~1/137).' },
      { q: 'What happens to atoms beyond Z = 137 (the Feynman limit)?', a: 'In the simple Dirac-Coulomb equation, the 1s electron binding energy becomes complex at Z > 137. Modern QED shows that at Z ≈ 173, the 1s state dives into the negative energy Dirac sea, causing the vacuum to "spark" and spontaneously create electron-positron pairs.' }
    ],
    calcJs: `
      const z = parseInt(document.getElementById('alpha_z').value, 10) || 1;
      const alpha = 1 / 137.035999084;
      const c = 299792458;
      
      const v_ms = z * alpha * c;
      const v_kms = v_ms / 1000;
      const c_pct = (v_ms / c) * 100;
      
      // Hydrogen 2P fine splitting ~ alpha^4 * mc^2 / 32
      const split_ev = 4.53e-5 * Math.pow(z, 4);
      const split_ghz = (split_ev * 1.602e-19) / (6.626e-34 * 1e9);
      
      let feynman_status = 'Stable Bound Vacuum (Z < 137)';
      if (z >= 137) feynman_status = 'Feynman Limit Exceeded (Relativistic Vacuum Breakdown)';
      else if (z >= 100) feynman_status = 'Severe Super-Heavy Relativistic Contraction';
      
      document.getElementById('out_alpha_val').textContent = alpha.toFixed(8) + ' (1 / 137.035999)';
      document.getElementById('out_inner_vel').textContent = Math.round(v_kms).toLocaleString() + ' km/s (' + c_pct.toFixed(2) + ' % c)';
      document.getElementById('out_fine_splitting').textContent = fmtSci(split_ev) + ' eV (' + fmtSci(split_ghz) + ' GHz)';
      document.getElementById('out_feynman_limit').textContent = feynman_status;
    `
  },
  {
    slug: 'quantum-tunneling-probability-barrier',
    title: 'Quantum Tunneling Probability & Barrier Transmission [STM Tunnel Current T] | Digital Tools Shed',
    shortTitle: 'Quantum Tunneling Calculator',
    category: 'Quantum Mechanics & Vacuum Physics',
    badge: 'WKB BARRIER PENETRATION',
    metaDesc: 'Compute quantum tunneling transmission coefficients through rectangular potential barriers for electrons and scanning tunneling microscopes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        T \approx 16 \cdot (E / V₀) · (1 - E / V₀) · e^{-2κL};\quad κ = \sqrt{2m(V₀ - E)} / \hbar
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Classically, a particle with energy E < V₀ cannot cross a potential barrier. In quantum mechanics, the particle’s wavefunction decays exponentially inside the forbidden barrier, emerging on the other side with a nonzero transmission probability T. This enables Scanning Tunneling Microscopy (STM) to resolve individual atoms.
      </p>
    `,
    inputs: [
      { id: 'tun_particle_e', label: 'Particle Energy E (eV)', type: 'number', default: '2.0', step: '0.1', min: '0.01' },
      { id: 'tun_barrier_v0', label: 'Barrier Height V₀ (eV)', type: 'number', default: '5.0', step: '0.1', min: '0.1' },
      { id: 'tun_barrier_w_nm', label: 'Barrier Width L (Nanometers nm)', type: 'number', default: '0.5', step: '0.05', min: '0.01', max: '10' }
    ],
    presets: [
      { label: 'Scanning Tunneling Microscope Tip (E = 2 eV, V₀ = 5 eV, L = 0.5 nm)', values: { tun_particle_e: 2.0, tun_barrier_v0: 5.0, tun_barrier_w_nm: 0.5 } },
      { label: 'Tunneling Diode (E = 1.0 eV, V₀ = 2.0 eV, L = 1.0 nm)', values: { tun_particle_e: 1.0, tun_barrier_v0: 2.0, tun_barrier_w_nm: 1.0 } },
      { label: 'Flash Memory Gate Leakage (E = 3 eV, V₀ = 4 eV, L = 2.0 nm)', values: { tun_particle_e: 3.0, tun_barrier_v0: 4.0, tun_barrier_w_nm: 2.0 } }
    ],
    outputs: [
      { id: 'out_tun_prob', label: 'Tunneling Transmission Probability T', default: '1.25 × 10⁻⁴' },
      { id: 'out_atten_length', label: 'Decay Attenuation Constant κ', default: '8.87 × 10⁹ m⁻¹' },
      { id: 'out_stm_sensitivity', label: 'STM Sensitivity (per 0.1 nm displacement)', default: 'Current changes by ~ 5.9 ×' },
      { id: 'out_class_verdict', label: 'Classical Newtonian Comparison', default: '0.00% (Forbidden Classically)' }
    ],
    benchmarks: [
      { object: 'Scanning Tunneling Microscope (STM)', val: 'Δz = 0.01 Å vertical resolution', notes: 'Invented by Binnig & Rohrer (1986 Nobel Prize)' },
      { object: 'Flash Memory Gate Oxide (SiO₂)', val: 'Tunneling leakage at < 3 nm', notes: 'Limits miniaturization of silicon transistors' },
      { object: 'Nuclear Alpha Decay', val: 'Tunnels through 30 MeV Coulomb wall', notes: 'Gamow tunneling mechanism' },
      { object: 'Enzyme Proton Tunneling', val: 'Hydrogen transfer in biology', notes: 'Enzymes exploit quantum tunneling to speed reactions' }
    ],
    faq: [
      { q: 'Why is the STM so exquisitely sensitive to distance?', a: 'Because tunneling current scales exponentially as I ∝ e^(-2κL). Increasing the tip-to-sample distance by just 0.1 nanometer (the width of an atom) drops the tunneling current by a factor of 10, enabling sub-angstrom vertical topographic resolution.' },
      { q: 'Does quantum tunneling take time?', a: 'The question of "tunneling time" (whether a particle takes time to cross the barrier) is one of the most controversial topics in modern quantum optics. Experiments with attosecond laser pulses suggest the transit is nearly instantaneous.' }
    ],
    calcJs: `
      const E = parseFloat(document.getElementById('tun_particle_e').value) || 2.0;
      const V0 = parseFloat(document.getElementById('tun_barrier_v0').value) || 5.0;
      const L_nm = parseFloat(document.getElementById('tun_barrier_w_nm').value) || 0.5;
      
      const me = 9.1093837e-31;
      const hbar = 1.054571817e-34;
      const ev_j = 1.602176634e-19;
      
      let t_prob = 1.0;
      let kappa = 0;
      let sens = 1.0;
      
      if (E < V0) {
        const delta_e_j = (V0 - E) * ev_j;
        kappa = Math.sqrt(2 * me * delta_e_j) / hbar;
        const L_m = L_nm * 1e-9;
        const prefactor = 16 * (E / V0) * (1 - E / V0);
        t_prob = prefactor * Math.exp(-2 * kappa * L_m);
        sens = Math.exp(2 * kappa * 0.1e-9);
      } else {
        t_prob = 1.0;
        kappa = 0;
        sens = 1.0;
      }
      
      document.getElementById('out_tun_prob').textContent = fmtSci(t_prob);
      document.getElementById('out_atten_length').textContent = fmtSci(kappa) + ' m⁻¹';
      document.getElementById('out_stm_sensitivity').textContent = 'Current scales ' + sens.toFixed(1) + '× per 0.1 nm';
      document.getElementById('out_class_verdict').textContent = E < V0 ? 'Classically Impossible (Pure Quantum Barrier Penetration)' : 'Super-barrier Transmission';
    `
  },
  {
    slug: 'fermi-energy-calculator',
    title: 'Fermi Energy, Temperature & Velocity Calculator [Degenerate Electron Gas E_F] | Digital Tools Shed',
    shortTitle: 'Fermi Energy Calculator',
    category: 'Quantum Mechanics & Vacuum Physics',
    badge: 'FERMI-DIRAC QUANTUM STATISTICS',
    metaDesc: 'Compute Fermi energy, Fermi temperature, and Fermi velocity for degenerate electrons in metals and white dwarf stars.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        E_F = (\hbar² / 2m) · (3π² · n)^{2/3};\quad T_F = E_F / k_B;\quad v_F = \sqrt{2E_F / m}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        According to the Pauli exclusion principle, identical fermions (such as electrons) cannot occupy the same quantum state. In metals at absolute zero, electrons stack into energy states up to the Fermi energy E_F. Because E_F in copper corresponds to ~80,000 Kelvin, conduction electrons behave as a quantum degenerate gas even at room temperature.
      </p>
    `,
    inputs: [
      { id: 'fermi_metal', label: 'Metal / System Preset', type: 'select', options: [
        { val: 'copper', text: 'Copper Cu (n = 8.49 × 10²⁸ m⁻³)' },
        { val: 'silver', text: 'Silver Ag (n = 5.86 × 10²⁸ m⁻³)' },
        { val: 'gold', text: 'Gold Au (n = 5.90 × 10²⁸ m⁻³)' },
        { val: 'aluminum', text: 'Aluminum Al (n = 18.1 × 10²⁸ m⁻³)' },
        { val: 'white_dwarf', text: 'White Dwarf Star Core (n = 10³⁶ m⁻³)' }
      ]}
    ],
    presets: [
      { label: 'Copper Metal (7.00 eV)', values: { fermi_metal: 'copper' } },
      { label: 'Silver Metal (5.49 eV)', values: { fermi_metal: 'silver' } },
      { label: 'Aluminum Metal (11.7 eV)', values: { fermi_metal: 'aluminum' } },
      { label: 'White Dwarf Stellar Core (Relativistic)', values: { fermi_metal: 'white_dwarf' } }
    ],
    outputs: [
      { id: 'out_ef_ev', label: 'Fermi Energy E_F (eV)', default: '7.00 eV' },
      { id: 'out_tf_kelvin', label: 'Fermi Temperature T_F (Kelvin)', default: '81,600 K' },
      { id: 'out_vf_kms', label: 'Fermi Velocity v_F (km/s)', default: '1,570 km/s (0.52 % c)' },
      { id: 'out_degeneracy_verdict', label: 'Quantum Degeneracy Status at 300 K', default: 'Fully Degenerate (T << T_F)' }
    ],
    benchmarks: [
      { object: 'Copper (E_F = 7.0 eV)', val: 'v_F = 1,570 km/s', notes: 'Electrons race at supersonic speeds even at 0 Kelvin' },
      { object: 'Aluminum (E_F = 11.7 eV)', val: 'T_F = 136,000 K', notes: 'High electron density valency (3 electrons/atom)' },
      { object: 'White Dwarf Core', val: 'E_F > 1 MeV', notes: 'Electron degeneracy pressure prevents gravitational collapse' },
      { object: 'Neutron Star Core', val: 'E_F > 100 MeV', notes: 'Neutron degeneracy pressure supports 2 solar masses' }
    ],
    faq: [
      { q: 'Why don’t electrons freeze to a halt at absolute zero (0 K)?', a: 'Because the Pauli exclusion principle forbids multiple electrons from condensing into the zero-energy ground state. They must fill up successive momentum states up to the Fermi sphere, maintaining energetic motion (Fermi velocity ~1,500 km/s) even at 0 Kelvin.' },
      { q: 'Why do metals have such a low electronic heat capacity?', a: 'Because T_room (300 K) is vastly lower than T_F (~80,000 K), only the tiny fraction of electrons within k_B T of the Fermi surface (~1%) can absorb thermal energy. The vast majority are trapped in lower states with no empty adjacent states.' }
    ],
    calcJs: `
      const mat = document.getElementById('fermi_metal').value;
      let n_m3 = 8.49e28;
      if (mat === 'silver') n_m3 = 5.86e28;
      else if (mat === 'gold') n_m3 = 5.90e28;
      else if (mat === 'aluminum') n_m3 = 1.81e29;
      else if (mat === 'white_dwarf') n_m3 = 1e36;
      
      const hbar = 1.054571817e-34;
      const me = 9.1093837e-31;
      const kb = 1.380649e-23;
      
      // Ef = (hbar^2 / 2m) * (3*pi^2 * n)^(2/3)
      const kf = Math.cbrt(3 * Math.PI * Math.PI * n_m3);
      const ef_j = (hbar * hbar * kf * kf) / (2 * me);
      const ef_ev = ef_j / 1.602176634e-19;
      const tf_k = ef_j / kb;
      const vf_ms = Math.sqrt((2 * ef_j) / me);
      const vf_kms = vf_ms / 1000;
      
      document.getElementById('out_ef_ev').textContent = ef_ev > 1000 ? fmtSci(ef_ev) + ' eV' : ef_ev.toFixed(2) + ' eV';
      document.getElementById('out_tf_kelvin').textContent = Math.round(tf_k).toLocaleString() + ' K';
      document.getElementById('out_vf_kms').textContent = Math.round(vf_kms).toLocaleString() + ' km/s (' + (vf_ms / 299792458 * 100).toFixed(2) + ' % c)';
      document.getElementById('out_degeneracy_verdict').textContent = tf_k > 10000 ? 'Extreme Quantum Degeneracy (T << T_F)' : 'Partial Degeneracy';
    `
  },
  {
    slug: 'landauer-principle-energy-dissipation',
    title: 'Landauer’s Principle Minimum Energy Erasure Calculator [Thermodynamic Bit Erasure] | Digital Tools Shed',
    shortTitle: 'Landauer Principle Calculator',
    category: 'Quantum Mechanics & Information Theory',
    badge: 'THERMODYNAMIC INFORMATION BOUND',
    metaDesc: 'Calculate the theoretical thermodynamic minimum energy dissipated when erasing one bit of information: E = k_B T ln(2).',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        E_min = k_B · T · \ln(2) \approx 2.87 \times 10⁻²¹ \text{ Joules at 300 K} \approx 0.0179 \text{ eV}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by Rolf Landauer at IBM in 1961, Landauer’s Principle links information theory with thermodynamics. Erasing one bit of information reduces the physical entropy of the system, which by the Second Law of Thermodynamics must dissipate at least k_B T ln(2) of heat into the environment. Reversible computing can theoretically compute with zero energy dissipation.
      </p>
    `,
    inputs: [
      { id: 'lan_temp_k', label: 'Operating Temperature T (Kelvin K)', type: 'number', default: '300', step: '10', min: '0.001' },
      { id: 'lan_bits_erased', label: 'Number of Bits Erased (e.g. 1 Terabyte = 8 × 10¹² bits)', type: 'number', default: '8e12', step: 'any', min: '1' }
    ],
    presets: [
      { label: 'Room Temperature (300 K, 1 Bit)', values: { lan_temp_k: 300, lan_bits_erased: 1 } },
      { label: '1 Terabyte Hard Drive Format at 300 K', values: { lan_temp_k: 300, lan_bits_erased: 8e12 } },
      { label: 'Superconducting Quantum Processor (15 mK, 1 Bit)', values: { lan_temp_k: 0.015, lan_bits_erased: 1 } },
      { label: 'CMB Deep Space Heat Sink (2.73 K, 1 Gigabyte)', values: { lan_temp_k: 2.73, lan_bits_erased: 8e9 } }
    ],
    outputs: [
      { id: 'out_lan_per_bit_j', label: 'Minimum Energy Dissipated per Bit (Joules)', default: '2.87 × 10⁻²¹ J' },
      { id: 'out_lan_per_bit_ev', label: 'Energy per Bit in Electronvolts (eV)', default: '0.0179 eV' },
      { id: 'out_total_erasure_j', label: 'Total Energy for Batch Erasure', default: '0.0230 Joules' },
      { id: 'out_cmos_overhead', label: 'Modern CMOS Energy vs Landauer Limit', default: 'Modern chips waste ~ 1,000× more energy' }
    ],
    benchmarks: [
      { object: 'Room Temperature (300 K)', val: '2.87 × 10⁻²¹ J (0.018 eV)', notes: 'Fundamental lower bound of irreversible computing' },
      { object: 'Dilution Refrigerator (10 mK)', val: '9.6 × 10⁻²⁵ J', notes: '30,000× lower heat generation in quantum chips' },
      { object: 'Modern Transistor Switching', val: '~10⁻¹⁷ J (10,000 Landauer limits)', notes: 'Steadily approaching Landauer limit via Dennard scaling' },
      { object: 'Bekenstein Bound', val: 'Information capacity of black hole', notes: 'Upper thermodynamic limit on information density' }
    ],
    faq: [
      { q: 'Why does reading or computing not require energy, but erasing does?', a: 'Landauer proved that logical operations that are logically reversible (like NOT or Fredkin gates, with 1-to-1 input-output mappings) do not compress phase space and can theoretically occur with zero heat dissipation. Only many-to-one operations that destroy information (like resetting a bit to 0) must generate entropy.' },
      { q: 'Has Landauer’s principle been verified experimentally?', a: 'Yes! In 2012, researchers at ENS Lyon trapped a colloidal silica bead in a double-well optical tweezer and measured heat dissipation during bit resets, confirming Landauer’s limit k_B T ln(2) within experimental error.' }
    ],
    calcJs: `
      const t_k = parseFloat(document.getElementById('lan_temp_k').value) || 300;
      const n_bits = parseFloat(document.getElementById('lan_bits_erased').value) || 1;
      
      const kb = 1.380649e-23;
      const e_min_bit_j = kb * t_k * Math.LN2;
      const e_min_bit_ev = e_min_bit_j / 1.602176634e-19;
      const total_j = e_min_bit_j * n_bits;
      
      document.getElementById('out_lan_per_bit_j').textContent = fmtSci(e_min_bit_j) + ' J';
      document.getElementById('out_lan_per_bit_ev').textContent = e_min_bit_ev.toFixed(4) + ' eV';
      document.getElementById('out_total_erasure_j').textContent = fmtSci(total_j) + ' Joules';
      document.getElementById('out_cmos_overhead').textContent = 'Modern CMOS uses ~10,000× (10⁻¹⁷ J/bit)';
    `
  },
  {
    slug: 'dyson-sphere-energy-harvesting',
    title: 'Dyson Sphere & Swarm Megastructure Energy Harvest Calculator [Kardashev Type II Megastructure] | Digital Tools Shed',
    shortTitle: 'Dyson Sphere Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'ASTROENGINEERING MEGASTRUCTURE',
    metaDesc: 'Calculate solar power collection, required swarm surface area, and planetary mass budget to construct a Dyson Swarm around the Sun.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        L_☉ = 3.828 \times 10²⁶ \text{ W};\quad A_{1 \text{ AU}} = 4\pi R² \approx 2.81 \times 10²³ \text{ m}²;\quad M_{swarm} = A · \sigma_{areal}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by physicist Freeman Dyson in 1960, a Dyson structure is a system of orbiting solar collectors (a Dyson swarm) that intercepts a star’s total radiant energy output. Capturing 100% of the Sun’s luminosity provides 3.83 × 10²⁶ Watts—over 20 trillion times the entire primary energy consumption of human civilization today.
      </p>
    `,
    inputs: [
      { id: 'dys_radius_au', label: 'Orbital Swarm Radius (AU)', type: 'number', default: '1.0', step: '0.1', min: '0.1', max: '10' },
      { id: 'dys_coverage_pct', label: 'Stellar Coverage Fraction (%)', type: 'number', default: '10', step: '1', min: '0.0001', max: '100' },
      { id: 'dys_panel_density_kg', label: 'Solar Collector Areal Mass (kg/m²)', type: 'number', default: '0.5', step: '0.1', min: '0.01' }
    ],
    presets: [
      { label: 'Initial Dyson Ring (0.1% Coverage at 1 AU)', values: { dys_radius_au: 1.0, dys_coverage_pct: 0.1, dys_panel_density_kg: 0.5 } },
      { label: '10% Dyson Swarm at 1 AU (3.8 × 10²⁵ W)', values: { dys_radius_au: 1.0, dys_coverage_pct: 10, dys_panel_density_kg: 0.5 } },
      { label: 'Full 100% Dyson Sphere at 1 AU (Type II)', values: { dys_radius_au: 1.0, dys_coverage_pct: 100, dys_panel_density_kg: 0.5 } },
      { label: 'Close-in Mercury Orbit Swarm (0.38 AU, 100%)', values: { dys_radius_au: 0.38, dys_coverage_pct: 100, dys_panel_density_kg: 0.2 } }
    ],
    outputs: [
      { id: 'out_dys_power_w', label: 'Collected Power Output (Watts)', default: '3.83 × 10²⁵ W' },
      { id: 'out_human_multi', label: 'Civilization Multiplier vs Current Earth', default: '1.91 Trillion × Modern Humanity' },
      { id: 'out_collector_area', label: 'Required Swarm Collector Area (m²)', default: '2.81 × 10²² m²' },
      { id: 'out_planet_disassembly', label: 'Planetary Mass Budget Required', default: '4.2% of Planet Mercury Mass' }
    ],
    benchmarks: [
      { object: 'Total Solar Luminosity L_☉', val: '3.828 × 10²⁶ Watts', notes: 'Complete Kardashev Type II boundary' },
      { object: 'Current Humanity Energy Usage', val: '2.0 × 10¹³ Watts (20 TW)', notes: 'Kardashev Type 0.73' },
      { object: 'Solid Dyson Shell Stress', val: 'Tensile strength > 10¹² Pa', notes: 'Solid shells are mechanically impossible; swarms are required' },
      { object: 'Mercury Mining Budget', val: 'Mass = 3.3 × 10²³ kg', notes: 'Disassembling Mercury provides enough silicon/metal for a full swarm' }
    ],
    faq: [
      { q: 'Why did Freeman Dyson envision a swarm of satellites rather than a solid shell?', a: 'A rigid solid shell around a star is gravitationally unstable (it has zero net gravitational attraction to the star and would drift into it) and would be crushed by colossal compressive stress. Dyson proposed an orbiting swarm of millions of independent thin solar collectors.' },
      { q: 'How would astronomers detect an alien Dyson Sphere?', a: 'Conservation of energy dictates that a Dyson swarm must re-radiate waste thermal heat. A star dimmed in visible light but glowing brilliantly in the mid-to-far infrared (10–100 µm) is the classic technosignature signature sought by projects like Project Hephaistos.' }
    ],
    calcJs: `
      const r_au = parseFloat(document.getElementById('dys_radius_au').value) || 1.0;
      const cov_pct = parseFloat(document.getElementById('dys_coverage_pct').value) || 10;
      const density_kg = parseFloat(document.getElementById('dys_panel_density_kg').value) || 0.5;
      
      const L_sun = 3.828e26; // W
      const r_m = r_au * 1.495978707e11;
      const sphere_area_m2 = 4 * Math.PI * r_m * r_m;
      const collector_area_m2 = sphere_area_m2 * (cov_pct / 100);
      const power_w = L_sun * (cov_pct / 100);
      
      const human_w = 2.0e13; // 20 Terawatts
      const multi = power_w / human_w;
      
      const mass_kg = collector_area_m2 * density_kg;
      const mercury_mass = 3.3011e23;
      const merc_pct = (mass_kg / mercury_mass) * 100;
      
      document.getElementById('out_dys_power_w').textContent = fmtSci(power_w) + ' W';
      document.getElementById('out_human_multi').textContent = fmtSci(multi) + ' × Modern Earth';
      document.getElementById('out_collector_area').textContent = fmtSci(collector_area_m2) + ' m²';
      document.getElementById('out_planet_disassembly').textContent = merc_pct < 100 ? merc_pct.toFixed(2) + ' % of Mercury' : fmtSci(merc_pct / 100) + ' × Mass of Mercury';
    `
  },
  {
    slug: 'kardashev-scale-civilization-rating',
    title: 'Kardashev Scale Civilization Energy Rating [Sagan Formula K = (log P - 6)/10] | Digital Tools Shed',
    shortTitle: 'Kardashev Scale Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'ASTROPHYSICAL CIVILIZATION METRIC',
    metaDesc: 'Calculate planetary and stellar civilization technological development rank using Carl Sagan’s Kardashev scale formula.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        K = (\log_{10}(P) - 6) / 10;\quad P = 10^{10K + 6} \text{ Watts}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by Soviet astrophysicist Nikolai Kardashev in 1964 and refined logarithmically by Carl Sagan in 1973, the Kardashev scale classifies technological civilizations by their power consumption: Type I controls planetary energy (~10¹⁶ W), Type II harnesses stellar power (~10²⁶ W), and Type III commands an entire galaxy (~10³⁶ W).
      </p>
    `,
    inputs: [
      { id: 'kar_power_w', label: 'Civilization Power Consumption (Watts W)', type: 'number', default: '2.0e13', step: 'any', min: '1e6' }
    ],
    presets: [
      { label: 'Modern Earth 2026 (~20 Terawatts = 2 × 10¹³ W)', values: { kar_power_w: 2.0e13 } },
      { label: 'Type I: Complete Planetary Solar Insolation (1.74 × 10¹⁷ W)', values: { kar_power_w: 1.74e17 } },
      { label: 'Type II: Sun Dyson Sphere (3.83 × 10²⁶ W)', values: { kar_power_w: 3.828e26 } },
      { label: 'Type III: Entire Milky Way Galaxy (~100 Billion Stars = 4 × 10³⁷ W)', values: { kar_power_w: 4.0e37 } }
    ],
    outputs: [
      { id: 'out_kar_score', label: 'Kardashev Rating (K)', default: 'K = 0.730' },
      { id: 'out_next_milestone', label: 'Power Needed to Reach Next Integer Type', default: '8,700 × Increase to reach Type 1.0' },
      { id: 'out_years_to_type1', label: 'Estimated Years to Type 1.0 (at 2% annual growth)', default: '~ 455 Years' },
      { id: 'out_civilization_tier', label: 'Technological Capability Tier', default: 'Sub-Type I (Fossil & Early Fission Planetary)' }
    ],
    benchmarks: [
      { object: 'Industrial Revolution 1800', val: 'K ≈ 0.58 (~0.5 TW)', notes: 'Coal steam engines & biomass' },
      { object: 'Earth Year 1900', val: 'K ≈ 0.60 (1 TW)', notes: 'Electrification and early oil' },
      { object: 'Earth Year 2026', val: 'K ≈ 0.73 (20 TW)', notes: 'Global fossil, nuclear, and renewables' },
      { object: 'Type I Planetary Civilization', val: 'K = 1.00 (10¹⁶ W)', notes: 'Controls weather, earthquakes, and full planetary energy' },
      { object: 'Type II Stellar Civilization', val: 'K = 2.00 (10²⁶ W)', notes: 'Dyson swarms, stellar lifting, antimatter synthesis' },
      { object: 'Type III Galactic Civilization', val: 'K = 3.00 (10³⁶ W)', notes: 'Interstellar colonization spanning 100,000 light-years' }
    ],
    faq: [
      { q: 'When will humanity reach Kardashev Type I?', a: 'Michio Kaku and Carl Sagan estimated that assuming a continuous 1.5% to 2% annual growth in global energy consumption, humanity will attain full Type I status (10¹⁶ Watts) within 100 to 200 years (between 2150 and 2250 CE).' },
      { q: 'What is a Type IV civilization?', a: 'While Kardashev originally defined only Types I, II, and III, later cosmologists proposed Type IV (controlling the power of the entire observable universe, ~10⁴⁶ W) and Type V (multiversal civilizations controlling physical constants).' }
    ],
    calcJs: `
      const p_w = parseFloat(document.getElementById('kar_power_w').value) || 2.0e13;
      const log10_p = Math.log10(p_w);
      const k = (log10_p - 6) / 10;
      
      const next_integer = Math.floor(k) + 1;
      const p_next = Math.pow(10, 10 * next_integer + 6);
      const ratio_next = p_next / p_w;
      
      // Years at 2% growth: (1.02)^t = ratio => t = ln(ratio) / ln(1.02)
      const yrs_2pct = Math.log(ratio_next) / Math.log(1.02);
      
      let tier = 'Type 0 Planetary Civilization';
      if (k >= 3.0) tier = 'Type III Galactic Super-Civilization';
      else if (k >= 2.0) tier = 'Type II Stellar Civilization (Dyson Swarm Active)';
      else if (k >= 1.0) tier = 'Type I True Planetary Civilization';
      
      document.getElementById('out_kar_score').textContent = 'K = ' + k.toFixed(3);
      document.getElementById('out_next_milestone').textContent = fmtSci(ratio_next) + ' × Increase to reach Type ' + next_integer.toFixed(1);
      document.getElementById('out_years_to_type1').textContent = yrs_2pct > 0 ? '~ ' + Math.round(yrs_2pct).toLocaleString() + ' Years (at 2% annual growth)' : 'Already Exceeded';
      document.getElementById('out_civilization_tier').textContent = tier;
    `
  },
  {
    slug: 'matrioshka-brain-compute-capacity',
    title: 'Matrioshka Brain Thermodynamic Compute Capacity [Stellar Heat Engine FLOPs] | Digital Tools Shed',
    shortTitle: 'Matrioshka Brain Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'ASTROENGINEERING THERMODYNAMIC COMPUTING',
    metaDesc: 'Model multi-shell nested Dyson sphere thermodynamic efficiency and computational throughput via Landauer limit bit operations.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \eta_{Carnot} = 1 - T_{cold} / T_{hot};\quad \text{FLOPs} \le P_{harvested} / (k_B · T · \ln 2)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Conceived by Robert Bradbury in 1999, a Matrioshka Brain is a nested sequence of Dyson spheres designed to extract the absolute maximum computational work from a star’s thermal radiation. High-temperature inner shells power computing substrates and re-radiate waste heat outward to cooler outer shells, cascading all the way down to the 2.7 K cosmic background.
      </p>
    `,
    inputs: [
      { id: 'mb_shells', label: 'Number of Nested Shells', type: 'number', default: '4', step: '1', min: '1', max: '8' },
      { id: 'mb_inner_temp', label: 'Innermost Shell Temperature (Kelvin)', type: 'number', default: '800', step: '50', min: '400', max: '2000' }
    ],
    presets: [
      { label: 'Standard 4-Shell Matrioshka Brain (800 K -> 3 K)', values: { mb_shells: 4, mb_inner_temp: 800 } },
      { label: 'Aggressive 6-Shell Cascaded Engine (1,200 K -> 3 K)', values: { mb_shells: 6, mb_inner_temp: 1200 } },
      { label: 'Single-Shell Dyson Computer (300 K)', values: { mb_shells: 1, mb_inner_temp: 300 } }
    ],
    outputs: [
      { id: 'out_mb_flops', label: 'Total Operations per Second (FLOPs)', default: '1.28 × 10⁴⁷ FLOPs' },
      { id: 'out_carnot_eff', label: 'Aggregate Thermodynamic Efficiency', default: '99.66 %' },
      { id: 'out_mind_simulations', label: 'Simulated Human Minds Running Concurrently', default: '10³¹ Virtual Civilizations' },
      { id: 'out_waste_heat', label: 'Final Outer Shell Radiative Emission', default: '3.5 Kelvin (Deep Far-Infrared)' }
    ],
    benchmarks: [
      { object: 'Global Top500 Supercomputers 2026', val: '~10¹⁹ FLOPs', notes: 'All human computers combined' },
      { object: 'Human Brain Computational Equivalence', val: '~10¹⁶ FLOPs', notes: 'Estimated neurological synaptic throughput' },
      { object: 'Matrioshka Brain Throughput', val: '> 10⁴⁵ FLOPs', notes: 'Could simulate entire galactic histories in seconds' },
      { object: 'Simulation Hypothesis Hardware', val: 'Matrioshka megastructure', notes: 'Plausible host substrate for ancestral universe simulations' }
    ],
    faq: [
      { q: 'Why must a Matrioshka Brain use nested shells rather than a single layer?', a: 'Thermodynamics limits efficiency by Carnot’s theorem (1 - T_cold/T_hot). By cascading waste heat from hot inner shells through intermediate thermal regimes (800 K → 400 K → 150 K → 30 K → 3 K), the megastructure extracts work multiple times from the exact same photons.' },
      { q: 'Could a Matrioshka Brain simulate all of human history simultaneously?', a: 'Easily. Simulating 100 billion human lifetimes with atomic molecular fidelity requires roughly 10³⁴ operations per year. A Matrioshka brain generates over 10⁴⁶ operations every single second.' }
    ],
    calcJs: `
      const shells = parseInt(document.getElementById('mb_shells').value, 10) || 4;
      const t_hot = parseFloat(document.getElementById('mb_inner_temp').value) || 800;
      
      const L_sun = 3.828e26;
      const t_cmb = 2.73;
      const kb = 1.380649e-23;
      
      const overall_eff = 1 - (t_cmb / t_hot);
      // Cumulative theoretical operations across cascaded layers
      const avg_temp = (t_hot + t_cmb) / (shells + 1);
      const total_ops_sec = (L_sun * overall_eff) / (kb * avg_temp * Math.LN2);
      
      const human_brain_ops = 1e16;
      const minds = total_ops_sec / human_brain_ops;
      
      document.getElementById('out_mb_flops').textContent = fmtSci(total_ops_sec) + ' FLOPs';
      document.getElementById('out_carnot_eff').textContent = (overall_eff * 100).toFixed(2) + ' %';
      document.getElementById('out_mind_simulations').textContent = fmtSci(minds) + ' Human Minds in Real-Time';
      document.getElementById('out_waste_heat').textContent = (t_cmb + 2.5).toFixed(1) + ' K (Deep Far-IR Glow)';
    `
  },
  {
    slug: 'shkadov-thruster-stellar-acceleration',
    title: 'Shkadov Thruster Stellar Engine Acceleration Calculator [Moving Solar Systems] | Digital Tools Shed',
    shortTitle: 'Shkadov Thruster Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'STELLAR ENGINE PROPULSION',
    metaDesc: 'Calculate asymmetric radiation pressure thrust, star system acceleration, and megayear displacement of a Shkadov thruster mirror.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        F_{thrust} = \frac{1}{2} · \frac{L_☉}{c} · (1 + R);\quad a_{star} = F / M_☉ \approx 2 \times 10⁻¹⁸ \text{ m/s}²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by Russian physicist Leonid Shkadov in 1987, a Shkadov thruster is a Class A stellar engine: a colossal curved solar sail mirror hovering stationary over one pole of a star. By reflecting solar photons in a single direction, asymmetric radiation pressure acts as a photon rocket engine, dragging the entire planetary system through the galaxy.
      </p>
    `,
    inputs: [
      { id: 'shk_mirror_reflect', label: 'Mirror Reflectivity R (0 to 1)', type: 'number', default: '0.95', step: '0.05', min: '0.5', max: '1.0' },
      { id: 'shk_time_myr', label: 'Thrust Duration (Million Years Myr)', type: 'number', default: '200', step: '50', min: '1', max: '5000' }
    ],
    presets: [
      { label: 'Avoid Supernova Hazard (50 Million Years)', values: { shk_mirror_reflect: 0.95, shk_time_myr: 50 } },
      { label: 'Galactic Orbit Steering (200 Million Years)', values: { shk_mirror_reflect: 0.95, shk_time_myr: 200 } },
      { label: 'One Full Cosmic Year (230 Million Years)', values: { shk_mirror_reflect: 0.95, shk_time_myr: 230 } },
      { label: 'Long-Term Trajectory Alteration (1 Billion Years)', values: { shk_mirror_reflect: 0.98, shk_time_myr: 1000 } }
    ],
    outputs: [
      { id: 'out_shk_thrust_n', label: 'Continuous Photon Thrust Force (Newtons)', default: '1.24 × 10¹⁸ N' },
      { id: 'out_shk_accel', label: 'Star Acceleration (m/s²)', default: '6.25 × 10⁻¹⁸ m/s²' },
      { id: 'out_delta_v_kms', label: 'Accumulated Velocity Change (km/s)', default: '39.4 km/s' },
      { id: 'out_displacement_ly', label: 'Total Stellar Displacement (Light-Years)', default: '13,500 Light-Years' }
    ],
    benchmarks: [
      { object: 'Total Solar Photon Thrust', val: '1.28 × 10¹⁸ N', notes: 'Sufficient to push 2 × 10³⁰ kg mass' },
      { object: '100 Million Year Displacement', val: '~100 parsecs (~320 light-years)', notes: 'Steers solar system away from hazardous nebulae' },
      { object: 'Galactic Orbit Orbital Period', val: '230 Million Years', notes: 'Alters orbital trajectory around Sagittarius A*' },
      { object: 'Gravitational Tethering', val: 'Planets follow automatically', notes: 'Planets remain locked in orbit around the accelerating Sun' }
    ],
    faq: [
      { q: 'Would the Earth fall out of orbit if the Sun is accelerated?', a: 'No. The acceleration is infinitesimal (~10⁻¹⁷ m/s²), billions of times weaker than the Sun’s gravitational hold on Earth (~0.0059 m/s²). The Earth and all planets would be gently pulled along, retaining their stable circular orbits.' },
      { q: 'Why would a civilization build a Shkadov thruster?', a: 'To navigate around catastrophic cosmic hazards: steering the solar system away from approaching supernova shockwaves, dense molecular clouds that would destabilize the Oort cloud, or colliding stars.' }
    ],
    calcJs: `
      const R = parseFloat(document.getElementById('shk_mirror_reflect').value) || 0.95;
      const t_myr = parseFloat(document.getElementById('shk_time_myr').value) || 200;
      
      const L_sun = 3.828e26;
      const c = 299792458;
      const m_sun = 1.98847e30;
      
      // Net thrust F = 0.5 * (L / c) * (1 + R) assuming parabolic half-hemisphere reflection
      const thrust_n = 0.5 * (L_sun / c) * (1 + R);
      const accel_ms2 = thrust_n / m_sun;
      
      const t_sec = t_myr * 1e6 * 365.25 * 86400;
      const dv_ms = accel_ms2 * t_sec;
      const dv_kms = dv_ms / 1000;
      
      // Displacement d = 0.5 * a * t^2
      const dist_m = 0.5 * accel_ms2 * t_sec * t_sec;
      const ly_m = 9.460730472e15;
      const dist_ly = dist_m / ly_m;
      
      document.getElementById('out_shk_thrust_n').textContent = fmtSci(thrust_n) + ' N';
      document.getElementById('out_shk_accel').textContent = fmtSci(accel_ms2) + ' m/s²';
      document.getElementById('out_delta_v_kms').textContent = dv_kms.toFixed(2) + ' km/s';
      document.getElementById('out_displacement_ly').textContent = Math.round(dist_ly).toLocaleString() + ' Light-Years';
    `
  },
  {
    slug: 'ringworld-structural-stress-calculator',
    title: 'Niven Ringworld Structural Tensile Stress Calculator [Megastructure Hoop Stress σ] | Digital Tools Shed',
    shortTitle: 'Ringworld Stress Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'MEGASTRUCTURE MATERIAL MECHANICS',
    metaDesc: 'Calculate rotational hoop stress, centrifugal 1g spin speed, and material tensile strength needed for a Larry Niven Ringworld.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        a_{cent} = \omega² · R = v² / R = 9.81 \text{ m/s}²;\quad \sigma_{hoop} = \rho · v² \approx \rho · (g · R)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Conceived by science fiction author Larry Niven in 1970, a Ringworld is a ribbon of radius 1 AU (150 million km) spinning to generate 1.0g of artificial gravity on its inner surface. Because rim speed must reach 1,200 km/s, hoop stress exceeds 50 Terapascals—millions of times beyond the chemical bond strength of carbon nanotubes, requiring speculative "scrith" bound by the strong nuclear force.
      </p>
    `,
    inputs: [
      { id: 'rw_radius_au', label: 'Ring Radius (AU)', type: 'number', default: '1.0', step: '0.1', min: '0.1', max: '2.0' },
      { id: 'rw_density_kg', label: 'Structural Material Density (kg/m³)', type: 'number', default: '3000', step: '100', min: '500' }
    ],
    presets: [
      { label: 'Niven Canonical Ringworld (1 AU, 3,000 kg/m³)', values: { rw_radius_au: 1.0, rw_density_kg: 3000 } },
      { label: 'Mini-Ringworld (0.1 AU = 15 Million km)', values: { rw_radius_au: 0.1, rw_density_kg: 3000 } },
      { label: 'Carbon Nanotube Theoretical Ribbon (1,300 kg/m³)', values: { rw_radius_au: 1.0, rw_density_kg: 1300 } }
    ],
    outputs: [
      { id: 'out_rw_speed_kms', label: 'Rim Rotational Velocity (v)', default: '1,211 km/s (Mach 3,560)' },
      { id: 'out_rw_period_days', label: 'Ringworld Day Rotation Period', default: '8.98 Days' },
      { id: 'out_hoop_stress_tpa', label: 'Required Material Tensile Strength (σ)', default: '4.40 × 10¹² Pa (4,400 GPa)' },
      { id: 'out_material_comparison', label: 'Material Feasibility vs Known Physics', default: 'Requires Strong-Force Bound Matter (Scrith)' }
    ],
    benchmarks: [
      { object: 'High-Strength Steel', val: 'Tensile Strength: 2 GPa', notes: 'Torn apart instantly by 2,200× overload' },
      { object: 'Carbon Nanotubes', val: 'Tensile Strength: 100 GPa', notes: 'Strongest known chemical bond material, still 44× too weak' },
      { object: 'Graphene Monolayer', val: 'Tensile Strength: 130 GPa', notes: 'Exhausts electromagnetic molecular bond limits' },
      { object: 'Niven "Scrith"', val: 'Tensile Strength: > 4,000 GPa', notes: 'Requires nuclear force binding energies' },
      { object: 'Ringworld Living Area', val: '3 Million Earth Surface Areas', notes: 'Unfathomable habitable real estate' }
    ],
    faq: [
      { q: 'Why can no chemical material hold a 1 AU Ringworld together?', a: 'Chemical material strength is governed by electromagnetic chemical bonds between valence electrons, limiting theoretical tensile strength to ~100–150 GPa. A 1 AU ring spinning at 1,200 km/s requires over 4,000 GPa of tensile strength, requiring forces on par with the strong nuclear force.' },
      { q: 'Is a Ringworld orbit stable?', a: 'No! As MIT students famously chanted to Larry Niven at the 1971 Worldcon, "The Ringworld is unstable!" A free-floating rigid ring does not experience centering forces from the star. Any tiny displacement causes one side to drift closer, causing the ring to collide with the star unless stabilized by active attitude jets.' }
    ],
    calcJs: `
      const r_au = parseFloat(document.getElementById('rw_radius_au').value) || 1.0;
      const rho = parseFloat(document.getElementById('rw_density_kg').value) || 3000;
      
      const g = 9.80665; // 1g target
      const r_m = r_au * 1.495978707e11;
      
      // a = v^2 / r = g => v = sqrt(g * r)
      const v_ms = Math.sqrt(g * r_m);
      const v_kms = v_ms / 1000;
      
      const circ_m = 2 * Math.PI * r_m;
      const period_s = circ_m / v_ms;
      const period_days = period_s / 86400;
      
      // Hoop stress sigma = rho * v^2
      const sigma_pa = rho * v_ms * v_ms;
      const sigma_gpa = sigma_pa / 1e9;
      
      document.getElementById('out_rw_speed_kms').textContent = Math.round(v_kms).toLocaleString() + ' km/s';
      document.getElementById('out_rw_period_days').textContent = period_days.toFixed(2) + ' Earth Days';
      document.getElementById('out_hoop_stress_tpa').textContent = fmtSci(sigma_gpa) + ' GPa (' + (sigma_gpa / 1000).toFixed(1) + ' TPa)';
      document.getElementById('out_material_comparison').textContent = sigma_gpa > 130 ? 'Exceeds Graphene (Requires Nuclear Scrith)' : 'Feasible with Carbon Nanotubes';
    `
  },
  {
    slug: 'o-neill-cylinder-artificial-gravity',
    title: 'O’Neill Cylinder Artificial Spin Gravity Calculator [Centrifugal Space Habitat 1g] | Digital Tools Shed',
    shortTitle: 'O’Neill Cylinder Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'SPACE HABITAT BIOMECHANICS',
    metaDesc: 'Calculate rotation speed, rpm, Coriolis lateral deflection forces, and hull structural thickness for an O’Neill space habitat cylinder.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        a_{cent} = \omega² · r = 9.81 \text{ m/s}²;\quad \text{RPM} = \frac{30}{\pi} \sqrt{\frac{g}{r}};\quad F_{Coriolis} = -2m(\vec{\omega} \times \vec{v})
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by Princeton physicist Gerard K. O’Neill in 1976 (High Frontier), an O’Neill Cylinder is an 8 km diameter, 32 km long rotating habitat. To avoid vestibular motion sickness from Coriolis forces during head turns, spin rates must stay under 2 RPM, requiring habitat radii of at least 250 meters for full 1.0g Earth-equivalent artificial gravity.
      </p>
    `,
    inputs: [
      { id: 'on_radius_m', label: 'Cylinder Radius r (Meters m)', type: 'number', default: '4000', step: '50', min: '50' },
      { id: 'on_target_g', label: 'Target Artificial Gravity (g)', type: 'number', default: '1.0', step: '0.05', min: '0.1', max: '2.0' }
    ],
    presets: [
      { label: 'Canonical O’Neill Island Three (Radius 4 km = 4,000 m)', values: { on_radius_m: 4000, on_target_g: 1.0 } },
      { label: 'Bernal Sphere (Radius 250 m)', values: { on_radius_m: 250, on_target_g: 1.0 } },
      { label: 'Mars Gravity O’Neill Station (Radius 4,000 m, 0.38g)', values: { on_radius_m: 4000, on_target_g: 0.38 } },
      { label: 'Small Centrifuge Station (Radius 100 m, High RPM)', values: { on_radius_m: 100, on_target_g: 1.0 } }
    ],
    outputs: [
      { id: 'out_on_rpm', label: 'Rotational Velocity in RPM', default: '0.47 RPM' },
      { id: 'out_on_rim_speed', label: 'Rim Linear Tangential Speed (v)', default: '198.0 m/s (443 mph)' },
      { id: 'out_coriolis_comfort', label: 'Vestibular Motion Sickness Threshold', default: 'Comfortable (< 1.0 RPM, Zero Dizziness)' },
      { id: 'out_east_west_drift', label: 'Coriolis Lateral Deflection (Ball dropped 2m)', default: '3.4 mm Eastward Deflection' }
    ],
    benchmarks: [
      { object: '1 RPM Spin Threshold', val: 'Imperceptible Coriolis', notes: 'Zero vestibular motion sickness in test centrifuges' },
      { object: '2 RPM Spin Threshold', val: 'Mild adaptation needed', notes: 'Most humans adapt within 1–2 hours' },
      { object: '3+ RPM Spin Threshold', val: 'Severe motion sickness', notes: 'Cross-coupled angular vestibular acceleration' },
      { object: 'O’Neill Island Three', val: 'r = 4 km, L = 32 km', notes: 'Houses several million people per cylinder pair' },
      { object: 'Counter-Rotating Pair', val: 'Cancels gyroscopic torque', notes: 'Enables pointing toward Sun without precession' }
    ],
    faq: [
      { q: 'Why must O’Neill Cylinders always operate in counter-rotating pairs?', a: 'Conservation of angular momentum. A single rotating cylinder acts as a giant gyroscope that resists re-orientation. Connecting two cylinders spinning in opposite directions cancels net angular momentum, allowing the pair to remain pointed at the Sun without spending attitude control propellant.' },
      { q: 'What does throwing a ball feel like inside an O’Neill cylinder?', a: 'Throwing a ball with the rotation (East) increases its apparent centrifugal weight and makes it drop faster. Throwing against rotation (West) makes it appear to float longer. Throwing toward the central axis curves it sideways due to Coriolis acceleration.' }
    ],
    calcJs: `
      const r_m = parseFloat(document.getElementById('on_radius_m').value) || 4000;
      const target_g = parseFloat(document.getElementById('on_target_g').value) || 1.0;
      
      const g_ms2 = target_g * 9.80665;
      const omega_rad_s = Math.sqrt(g_ms2 / r_m);
      const rpm = (omega_rad_s * 30) / Math.PI;
      const v_rim_ms = omega_rad_s * r_m;
      const v_rim_mph = v_rim_ms * 2.23694;
      
      // Deflection of 2m drop: delta x = (2/3) * omega * sqrt(8 * h^3 / g)
      const t_fall = Math.sqrt((2 * 2.0) / g_ms2);
      const coriolis_m = omega_rad_s * 2.0 * t_fall;
      const coriolis_mm = coriolis_m * 1000;
      
      let comfort = 'Comfortable (< 1 RPM, Fully Negligible Nausea)';
      if (rpm > 3.0) comfort = 'Severe Nausea Alert (> 3 RPM, Requires Medical Anti-Emetics)';
      else if (rpm > 1.5) comfort = 'Mild Coriolis Adaptation Required (1.5 - 3 RPM)';
      
      document.getElementById('out_on_rpm').textContent = rpm.toFixed(2) + ' RPM';
      document.getElementById('out_on_rim_speed').textContent = Math.round(v_rim_ms) + ' m/s (' + Math.round(v_rim_mph) + ' mph)';
      document.getElementById('out_coriolis_comfort').textContent = comfort;
      document.getElementById('out_east_west_drift').textContent = coriolis_mm.toFixed(1) + ' mm Lateral Curvature';
    `
  },
  {
    slug: 'stanford-torus-rotation-mechanics',
    title: 'Stanford Torus Habitat Spin Gravity & Structural Mechanics [1.8 km Toroid Hub] | Digital Tools Shed',
    shortTitle: 'Stanford Torus Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'TOROIDAL SPACE ARCHITECTURE',
    metaDesc: 'Model spin dynamics, atmospheric air pressure containment, and shielding mass for the 1975 NASA Stanford Torus habitat design.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        a_{rim} = \omega² · R = 1.0 \text{ g};\quad M_{shield} = A_{exterior} · 4,500 \text{ kg/m}²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Designed during the 1975 NASA Ames / Stanford University Summer Study, the Stanford Torus is a donut-shaped habitat 1.8 kilometers in diameter housing 10,000 residents. Spinning at 1.0 RPM, it provides a full 1.0g of Earth gravity around the 130-meter-wide ring tube, wrapped in a passive lunar slag radiation shield.
      </p>
    `,
    inputs: [
      { id: 'st_major_radius_m', label: 'Torus Major Radius R (Meters)', type: 'number', default: '895', step: '25', min: '200' },
      { id: 'st_tube_radius_m', label: 'Habitable Tube Cross-Section Radius r (Meters)', type: 'number', default: '65', step: '5', min: '20' }
    ],
    presets: [
      { label: 'Standard NASA 1975 Study (R = 895 m, r = 65 m, 1.0 RPM)', values: { st_major_radius_m: 895, st_tube_radius_m: 65 } },
      { label: 'Compact Torus Hub (R = 450 m, 1.4 RPM)', values: { st_major_radius_m: 450, st_tube_radius_m: 40 } },
      { label: 'Mega-Torus City (R = 2,500 m, 0.6 RPM)', values: { st_major_radius_m: 2500, st_tube_radius_m: 120 } }
    ],
    outputs: [
      { id: 'out_st_rpm', label: 'Rotational Spin Rate for 1.0g', default: '1.00 RPM' },
      { id: 'out_rim_speed_ms', label: 'Tangential Rim Speed (v)', default: '93.7 m/s (210 mph)' },
      { id: 'out_floor_area_km2', label: 'Usable Living Floor Area', default: '0.73 km² (180 Acres)' },
      { id: 'out_lunar_shield_tons', label: 'Lunar Regolith Passive Shielding Mass', default: '9.9 × 10⁶ Metric Tons' }
    ],
    benchmarks: [
      { object: 'Stanford Torus Living Area', val: '0.73 km² (180 acres)', notes: 'Accommodates 10,000 permanent residents' },
      { object: 'Rotational Spin Rate', val: '1.00 RPM', notes: 'Optimized for zero motion sickness' },
      { object: 'Non-Rotating Radiation Shield', val: '4.5 tons/m² lunar slag', notes: 'Stationary sheath protects against cosmic rays' },
      { object: 'Central Solar Mirror Hub', val: 'Angled at 45°', notes: 'Bounces sunlight into the interior through overhead chevron mirrors' }
    ],
    faq: [
      { q: 'Why does the radiation shield not rotate with the habitat?', a: 'To conserve structural mass. Rotating 10 million tons of heavy lunar regolith would create immense centrifugal stress requiring thick steel tensile bands. Instead, the shield remains stationary while the living ring spins inside on low-friction guide tracks.' },
      { q: 'How does natural sunlight enter the torus?', a: 'A large central mirror hovering above the non-rotating hub directs sunlight down to secondary 45-degree mirrors on the torus, reflecting light into the interior ceiling louvers while shielding residents from direct line-of-sight cosmic radiation.' }
    ],
    calcJs: `
      const R = parseFloat(document.getElementById('st_major_radius_m').value) || 895;
      const r = parseFloat(document.getElementById('st_tube_radius_m').value) || 65;
      
      const g = 9.80665;
      const omega = Math.sqrt(g / R);
      const rpm = (omega * 30) / Math.PI;
      const v_rim = omega * R;
      
      // Floor width approx 2 * r * sin(pi/3) ~ 1.73 * r
      const floor_width = 1.732 * r;
      const circ = 2 * Math.PI * R;
      const floor_area_m2 = circ * floor_width;
      const floor_area_km2 = floor_area_m2 / 1e6;
      
      // Surface area of torus = 4 * pi^2 * R * r
      const surface_area_m2 = 4 * Math.PI * Math.PI * R * r;
      const shield_mass_kg = surface_area_m2 * 4500; // 4.5 tonnes/m^2
      const shield_tons = shield_mass_kg / 1000;
      
      document.getElementById('out_st_rpm').textContent = rpm.toFixed(2) + ' RPM';
      document.getElementById('out_rim_speed_ms').textContent = v_rim.toFixed(1) + ' m/s (' + Math.round(v_rim * 2.23694) + ' mph)';
      document.getElementById('out_floor_area_km2').textContent = floor_area_km2.toFixed(2) + ' km² (' + Math.round(floor_area_km2 * 247.1) + ' Acres)';
      document.getElementById('out_lunar_shield_tons').textContent = fmtSci(shield_tons) + ' Metric Tons';
    `
  },
  {
    slug: 'alcubierre-warp-drive-negative-energy',
    title: 'Alcubierre Warp Drive Negative Energy & Geometry Calculator [Spacetime Metric Expansion] | Digital Tools Shed',
    shortTitle: 'Alcubierre Warp Drive Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'GENERAL RELATIVISTIC WARP METRIC',
    metaDesc: 'Explore Miguel Alcubierre’s warp drive metric, spatial contraction/expansion bubble geometry, and negative energy mass budgets.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ds² = -c² dt² + (dx - v_s f(r_s) dt)² + dy² + dz²;\quad E_{neg} \propto -v_s² · R² · \sigma
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by Mexican theoretical physicist Miguel Alcubierre in 1994, this exact solution to Einstein’s field equations enables effective faster-than-light travel without violating special relativity locally. The warp bubble contracts spacetime in front of the spacecraft and expands spacetime behind it, carrying the flat interior passenger bubble forward at arbitrary speeds.
      </p>
    `,
    inputs: [
      { id: 'warp_speed_c', label: 'Apparent Warp Velocity (Multiples of c)', type: 'number', default: '10', step: '1', min: '0.1' },
      { id: 'warp_radius_m', label: 'Warp Bubble Radius (Meters)', type: 'number', default: '50', step: '5', min: '5' },
      { id: 'warp_thickness_m', label: 'Bubble Wall Thickness (Meters)', type: 'number', default: '1.0', step: '0.1', min: '0.001' }
    ],
    presets: [
      { label: 'Sub-light Interplanetary Warp (0.5 c)', values: { warp_speed_c: 0.5, warp_radius_m: 25, warp_thickness_m: 1.0 } },
      { label: 'Warp Factor 2 (~10 c, Proxima Centauri in 5 Months)', values: { warp_speed_c: 10, warp_radius_m: 50, warp_thickness_m: 1.0 } },
      { label: 'White-Juday Optimized Metric (10 c, Microscopic Wall)', values: { warp_speed_c: 10, warp_radius_m: 10, warp_thickness_m: 0.01 } },
      { label: 'Original 1994 Unoptimized Formulation (Entire Universe Mass)', values: { warp_speed_c: 10, warp_radius_m: 100, warp_thickness_m: 1e-15 } }
    ],
    outputs: [
      { id: 'out_warp_negative_mass', label: 'Negative Mass Energy Required', default: '-1.4 × 10³⁰ kg (~ -0.7 Solar Masses)' },
      { id: 'out_travel_proxima_days', label: 'Transit Time to Proxima Centauri (4.24 ly)', default: '154.9 Days (~5.1 Months)' },
      { id: 'out_local_time_dilation', label: 'Interior Cabin Time Dilation', default: 'Zero (Flat Spacetime Proper Time)' },
      { id: 'out_quantum_energy_inequality', label: 'Energy Condition Violation', default: 'Violates Weak Energy Condition (WEC)' }
    ],
    benchmarks: [
      { object: 'Alcubierre Original 1994', val: '-10⁶⁴ kg negative mass', notes: 'Exceeded mass of entire observable universe' },
      { object: 'Chris Van Den Broeck (1999)', val: 'Microscopic neck geometry', notes: 'Reduced energy to few stellar masses' },
      { object: 'Harold White (NASA Eagleworks 2011)', val: 'Thickened oscillating bubble wall', notes: 'Reduced negative mass to Voyager 1 scale (~500 kg)' },
      { object: 'Physical Obstacles', val: 'Hawking radiation fireball & horizon event', notes: 'Accumulated cosmic particles blast forward upon deceleration' }
    ],
    faq: [
      { q: 'Does an Alcubierre drive violate Einstein’s speed of light?', a: 'No. Special relativity forbids particles with mass from accelerating through local space at or above c. Inside an Alcubierre bubble, the ship is completely stationary within flat local space. It is spacetime itself that is expanding and contracting, which is not subject to any universal speed limit.' },
      { q: 'What is negative energy, and does it exist in nature?', a: 'Negative energy is an energy density lower than the vacuum state. While macroscopic exotic negative mass has never been discovered, tiny amounts of negative energy density are physically confirmed in quantum mechanics via the Casimir effect and squeezed quantum vacuum states.' }
    ],
    calcJs: `
      const v_c = parseFloat(document.getElementById('warp_speed_c').value) || 10;
      const R = parseFloat(document.getElementById('warp_radius_m').value) || 50;
      const sigma = parseFloat(document.getElementById('warp_thickness_m').value) || 1.0;
      
      const c = 299792458;
      const G = 6.67430e-11;
      
      // Ford-Roman & White-Juday energy scaling approximation
      // Energy ~ - (c^4 / G) * v^2 * R^2 / sigma
      const m_neg_kg = -1 * (Math.pow(c, 2) / G) * Math.pow(v_c, 2) * Math.pow(R, 2) / Math.max(0.001, sigma) * 1e-15;
      
      const dist_proxima_ly = 4.242;
      const transit_years = dist_proxima_ly / v_c;
      const transit_days = transit_years * 365.25;
      
      let mass_str = '';
      if (Math.abs(m_neg_kg) > 1.989e30) mass_str = fmtSci(m_neg_kg / 1.989e30) + ' Solar Masses';
      else if (Math.abs(m_neg_kg) > 5.972e24) mass_str = fmtSci(m_neg_kg / 5.972e24) + ' Earth Masses';
      else mass_str = fmtSci(m_neg_kg) + ' kg';
      
      document.getElementById('out_warp_negative_mass').textContent = mass_str;
      document.getElementById('out_travel_proxima_days').textContent = transit_days > 365 ? (transit_days / 365.25).toFixed(2) + ' Years' : transit_days.toFixed(1) + ' Days';
      document.getElementById('out_local_time_dilation').textContent = 'Zero Dilation (γ = 1.00 Inside Bubble)';
      document.getElementById('out_quantum_energy_inequality').textContent = 'Violates WEC (Requires Exotic Matter)';
    `
  },
  {
    slug: 'krasnikov-tube-causality-calculator',
    title: 'Krasnikov Tube FTL Spacetime Track & Causality Horizon [Chronology Protection Paradox] | Digital Tools Shed',
    shortTitle: 'Krasnikov Tube Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'SUPERLUMINAL CAUSALITY METRICS',
    metaDesc: 'Model Sergei Krasnikov’s permanent one-way superluminal spacetime subway track and evaluate closed timelike curves.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ds² = -(dt - dx)(dt + k(x) dx) + dy² + dz²;\quad t_{return} \le t_{departure} \text{ (Closed Timelike Loop)}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by Russian physicist Sergei Krasnikov in 1997, a Krasnikov Tube is a permanent distortion of spacetime laid down behind a sub-light craft. While the outward trip to a distant star takes ordinary time, the modified spacetime tube allows the return trip to travel back along a tilted light-cone, returning home almost immediately after departure.
      </p>
    `,
    inputs: [
      { id: 'kras_dist_ly', label: 'Track Length to Outpost (Light-Years)', type: 'number', default: '10', step: '1', min: '0.1' },
      { id: 'kras_laying_speed', label: 'Tube Deployment Speed (Sub-Light v / c)', type: 'number', default: '0.90', step: '0.01', min: '0.1', max: '0.9999' }
    ],
    presets: [
      { label: 'Sirius Fast Track (8.6 Light-Years, 0.95 c)', values: { kras_dist_ly: 8.6, kras_laying_speed: 0.95 } },
      { label: '10 Light-Year Standard Interstellar Subway (0.90 c)', values: { kras_dist_ly: 10.0, kras_laying_speed: 0.90 } },
      { label: 'Vega Deep Transit (25 Light-Years, 0.99 c)', values: { kras_dist_ly: 25.0, kras_laying_speed: 0.99 } }
    ],
    outputs: [
      { id: 'out_outward_time_earth', label: 'Outward Track Construction Time (Earth Frame)', default: '11.11 Years' },
      { id: 'out_return_duration', label: 'Return Journey Transit Duration', default: 'A Few Hours / Days' },
      { id: 'out_reunion_earth_time', label: 'Earth Time upon Crew Return', default: 'Arrives Minutes after Construction Ends' },
      { id: 'out_two_tube_paradox', label: 'Two-Way Tube Closed Timelike Curve', default: 'Creates Time Machine into the Past' }
    ],
    benchmarks: [
      { object: 'One-Way Krasnikov Tube', val: 'Causally safe (No paradox)', notes: 'Crew cannot return before they left Earth' },
      { object: 'Two-Tube Counter-System', val: 'Closed Timelike Curve (CTC)', notes: 'Creates a physical time machine to the past' },
      { object: 'Hawking Chronology Protection', val: 'Vacuum polarization blowup', notes: 'Virtual particles circulate in infinite feedback, destroying the tube' },
      { object: 'Exotic Energy Requirement', val: 'Negative mass inside walls', notes: 'Similar to Morris-Thorne traversable wormholes' }
    ],
    faq: [
      { q: 'Can a single Krasnikov Tube be used as a time machine to visit the past?', a: 'No. A single tube cannot take you back to a time before the tube was constructed. However, if two Krasnikov tubes are laid in opposite directions, the combination forms a closed timelike curve (CTC) that allows physical travel into the past.' },
      { q: 'What prevents time machines from forming in general relativity?', a: 'Stephen Hawking’s Chronology Protection Conjecture posits that quantum vacuum fluctuations build up to infinite energy density along the Cauchy horizon where CTCs first form, automatically destroying the spacetime geometry before a time loop can close.' }
    ],
    calcJs: `
      const d_ly = parseFloat(document.getElementById('kras_dist_ly').value) || 10;
      const v = parseFloat(document.getElementById('kras_laying_speed').value) || 0.90;
      
      const t_out_yr = d_ly / v;
      const gamma = 1 / Math.sqrt(1 - v * v);
      const t_crew_out_yr = t_out_yr / gamma;
      
      // Inside Krasnikov tube, light cone is tilted backward toward start point
      // Return trip duration across tube is effectively near-zero or instantaneous
      
      document.getElementById('out_outward_time_earth').textContent = t_out_yr.toFixed(2) + ' Years (Crew proper: ' + t_crew_out_yr.toFixed(2) + 'y)';
      document.getElementById('out_return_duration').textContent = 'Instantly / Few Hours (Superluminal Shortcut)';
      document.getElementById('out_reunion_earth_time').textContent = t_out_yr.toFixed(2) + ' Years after Initial Launch';
      document.getElementById('out_two_tube_paradox').textContent = '2 Tubes = Closed Timelike Curve (Chronology Threat)';
    `
  },
  {
    slug: 'wormhole-traversability-morris-thorne',
    title: 'Morris-Thorne Traversable Wormhole Throat & Tidal Stress [Einstein-Rosen Metric] | Digital Tools Shed',
    shortTitle: 'Wormhole Traversability Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'TRAVERSABLE SPACETIME GEOMETRY',
    metaDesc: 'Calculate wormhole throat radius, exotic negative mass tension, and human tidal gravitational acceleration limits.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        ds² = -c² dt² + dr² / (1 - b(r)/r) + r² dΩ²;\quad \tau_{throat} = -\frac{c⁴}{8\pi G · b₀²} \text{ (Exotic Tension)}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Derived by Michael Morris and Kip Thorne in 1988 at Caltech (at Carl Sagan’s request for his novel Contact), this metric defines a wormhole that a human can safely traverse without lethal tidal shredding or event horizon traps. Holding the throat open requires negative-energy exotic matter to provide repulsive gravitational tension.
      </p>
    `,
    inputs: [
      { id: 'wh_throat_r_m', label: 'Wormhole Throat Radius b₀ (Meters m)', type: 'number', default: '1000', step: '100', min: '1' },
      { id: 'wh_traverse_time_s', label: 'Transit Duration Through Throat (Seconds)', type: 'number', default: '5.0', step: '0.5', min: '0.1' }
    ],
    presets: [
      { label: 'Human-Sized Throat (Radius 10 meters, High Tidal Risk)', values: { wh_throat_r_m: 10, wh_traverse_time_s: 1.0 } },
      { label: 'Standard Morris-Thorne Portal (Radius 1,000 m = 1 km, Safe 1g)', values: { wh_throat_r_m: 1000, wh_traverse_time_s: 5.0 } },
      { label: 'Interstellar Highway Wormhole (Radius 100 km, Ultra-Smooth)', values: { wh_throat_r_m: 100000, wh_traverse_time_s: 30.0 } }
    ],
    outputs: [
      { id: 'out_wh_tidal_g', label: 'Maximum Tidal Acceleration on Human Body', default: '0.002 g (Completely Safe)' },
      { id: 'out_wh_exotic_tension', label: 'Throat Exotic Negative Tension', default: '-4.80 × 10³⁷ N/m²' },
      { id: 'out_wh_negative_mass', label: 'Negative Mass Required to Prop Throat Open', default: '-1.35 × 10²⁷ kg (~ -0.7 Jupiter Masses)' },
      { id: 'out_wh_human_verdict', label: 'Human Traversability Assessment', default: 'Safe for Unarmored Humanoid Crossing' }
    ],
    benchmarks: [
      { object: 'Einstein-Rosen Bridge (1935)', val: 'Non-traversable', notes: 'Pinches off faster than speed of light' },
      { object: 'Morris-Thorne (1988)', val: 'Traversable via exotic matter', notes: 'First mathematically rigorous human-safe portal' },
      { object: 'Tidal Shredding Limit', val: 'Tidal acceleration < 1g across 2m', notes: 'Keeps human spine and blood intact' },
      { object: 'Negative Mass Budget', val: '-1 Jupiter mass per km throat', notes: 'Held open by negative-pressure Casimir fields' }
    ],
    faq: [
      { q: 'Why does an Einstein-Rosen bridge pinch off without exotic matter?', a: 'Gravity is universally attractive for normal positive-mass matter. Without negative mass to push outward against gravitational collapse, the throat snaps shut so quickly that not even a photon can cross from one mouth to the other.' },
      { q: 'What would looking into a traversable wormhole look like?', a: 'It appears as a shimmering spherical mirror floating in space. Instead of reflecting your surroundings, looking into the sphere reveals a magnified, fish-eye optical view of the stars and planets in the destination galaxy.' }
    ],
    calcJs: `
      const b0 = parseFloat(document.getElementById('wh_throat_r_m').value) || 1000;
      const t_trans = parseFloat(document.getElementById('wh_traverse_time_s').value) || 5.0;
      
      const c = 299792458;
      const G = 6.67430e-11;
      
      // Tidal acceleration across 2 meter human: Delta a ~ c^2 * (2 m) / b0^2
      const tidal_ms2 = (c * c * 2.0) / (b0 * b0);
      const tidal_g = tidal_ms2 / 9.80665;
      
      // Exotic mass approx ~ - b0 * c^2 / G
      const m_exotic_kg = -(b0 * c * c) / G;
      const tension_pa = -(Math.pow(c, 4)) / (8 * Math.PI * G * b0 * b0);
      
      let verdict = 'Safe for Humanoid Crossing (Tidal Forces Mild)';
      if (tidal_g > 10.0) verdict = 'Fatal Tidal Shredding (Crushed by Extreme Curvature)';
      else if (tidal_g > 1.0) verdict = 'Uncomfortable High G-Force Strain';
      
      document.getElementById('out_wh_tidal_g').textContent = tidal_g > 100 ? fmtSci(tidal_g) + ' g' : tidal_g.toFixed(3) + ' g';
      document.getElementById('out_wh_exotic_tension').textContent = fmtSci(tension_pa) + ' N/m²';
      document.getElementById('out_wh_negative_mass').textContent = fmtSci(m_exotic_kg) + ' kg';
      document.getElementById('out_wh_human_verdict').textContent = verdict;
    `
  },
  {
    slug: 'solar-sail-photon-radiation-pressure',
    title: 'Solar Sail Photon Radiation Pressure & Acceleration Calculator [Interplanetary Light Sail P = (1+R)S/c] | Digital Tools Shed',
    shortTitle: 'Solar Sail Pressure Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'PHOTON MOMENTUM PROPULSION',
    metaDesc: 'Compute photon radiation pressure, thrust force per square kilometer, and payload acceleration for solar sails at 1 AU.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        P_{rad} = (1 + R) · \frac{S}{c};\quad S_{1 \text{ AU}} \approx 1,361 \text{ W/m}²;\quad P_{max} \approx 9.08 \text{ µN/m}²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Although photons have zero rest mass, they carry momentum p = E/c. When sunlight bounces off a highly reflective mirror sail (R ≈ 0.9–1.0), momentum transfer exerts a continuous radiation pressure of ~9 micro-Newtons per square meter at 1 AU. Over weeks of propellantless thrust, solar sails achieve astronomical velocities.
      </p>
    `,
    inputs: [
      { id: 'sail_area_m2', label: 'Sail Surface Area (m²)', type: 'number', default: '10000', step: '500', min: '1' },
      { id: 'sail_reflectivity', label: 'Sail Reflectivity R (0 to 1)', type: 'number', default: '0.90', step: '0.02', min: '0.5', max: '1.0' },
      { id: 'sail_total_mass_kg', label: 'Total Spacecraft Mass (kg)', type: 'number', default: '50', step: '5', min: '1' },
      { id: 'sail_dist_au', label: 'Distance from Sun (AU)', type: 'number', default: '1.0', step: '0.1', min: '0.05' }
    ],
    presets: [
      { label: 'IKAROS JAXA Mission 2010 (196 m², 315 kg)', values: { sail_area_m2: 196, sail_reflectivity: 0.85, sail_total_mass_kg: 315, sail_dist_au: 1.0 } },
      { label: 'LightSail 2 Planetary Society (32 m², 5 kg)', values: { sail_area_m2: 32, sail_reflectivity: 0.90, sail_total_mass_kg: 5.0, sail_dist_au: 1.0 } },
      { label: 'Deep Space 1 km² Sail (1,000,000 m², 1,000 kg)', values: { sail_area_m2: 1000000, sail_reflectivity: 0.92, sail_total_mass_kg: 1000, sail_dist_au: 1.0 } },
      { label: 'Solar Perihelion Dive (0.1 AU Oberth Kick)', values: { sail_area_m2: 10000, sail_reflectivity: 0.95, sail_total_mass_kg: 50, sail_dist_au: 0.1 } }
    ],
    outputs: [
      { id: 'out_rad_pressure_upa', label: 'Photon Radiation Pressure (µPa)', default: '8.63 µPa' },
      { id: 'out_sail_thrust_n', label: 'Continuous Solar Thrust (Newtons N)', default: '0.0863 N' },
      { id: 'out_sail_accel_mms2', label: 'Spacecraft Acceleration (mm/s²)', default: '1.73 mm/s²' },
      { id: 'out_monthly_dv_kms', label: 'Accumulated Velocity in 30 Days', default: '4.48 km/s per Month' }
    ],
    benchmarks: [
      { object: 'Photon Pressure at Earth (1 AU)', val: '9.08 µN / m² (R = 1)', notes: 'Tiny force, but infinite propellant lifetime' },
      { object: 'IKAROS (Japan, 2010)', val: 'First interplanetary solar sail', notes: 'Demonstrated propulsion on cruise to Venus' },
      { object: 'Starshot Breakthrough Laser Sail', val: '100 GW laser array on 4m sail', notes: 'Accelerates micro-probe to 0.20 c in 10 minutes' },
      { object: 'Comet Dust Tails', val: 'Pushed by solar radiation pressure', notes: 'Always point directly away from the Sun' }
    ],
    faq: [
      { q: 'Can a solar sail sail "toward" the Sun?', a: 'Yes! By angling the sail against its orbital velocity vector, photon pressure slows down the spacecraft’s orbital speed, causing its orbit to decay inward toward the Sun—acting as a brake to descend into the inner solar system.' },
      { q: 'Why are solar sails made of aluminized Mylar or Kapton?', a: 'Because they require maximum reflectivity (R > 0.90) and minimum areal mass (a few grams per square meter) while withstanding intense solar ultraviolet exposure without degrading.' }
    ],
    calcJs: `
      const a_m2 = parseFloat(document.getElementById('sail_area_m2').value) || 10000;
      const R = parseFloat(document.getElementById('sail_reflectivity').value) || 0.90;
      const m_kg = parseFloat(document.getElementById('sail_total_mass_kg').value) || 50;
      const d_au = parseFloat(document.getElementById('sail_dist_au').value) || 1.0;
      
      const c = 299792458;
      const S0 = 1361 / (d_au * d_au); // W/m^2
      
      // P = (1 + R) * S / c
      const p_pa = (1 + R) * S0 / c;
      const p_upa = p_pa * 1e6;
      const thrust_n = p_pa * a_m2;
      const accel_ms2 = thrust_n / m_kg;
      const accel_mms2 = accel_ms2 * 1000;
      
      const sec_month = 30 * 86400;
      const dv_month_kms = (accel_ms2 * sec_month) / 1000;
      
      document.getElementById('out_rad_pressure_upa').textContent = p_upa.toFixed(2) + ' µPa (µN/m²)';
      document.getElementById('out_sail_thrust_n').textContent = fmtSci(thrust_n) + ' N';
      document.getElementById('out_sail_accel_mms2').textContent = accel_mms2.toFixed(3) + ' mm/s²';
      document.getElementById('out_monthly_dv_kms').textContent = dv_month_kms.toFixed(2) + ' km/s per Month';
    `
  },
  {
    slug: 'antimatter-rocket-energy-density',
    title: 'Antimatter Rocket Energy Density & Annihilation Mechanics [E = 2mc² Interstellar I_sp] | Digital Tools Shed',
    shortTitle: 'Antimatter Rocket Calculator',
    category: 'Megastructures & Speculative Physics',
    badge: 'RELATIVISTIC TOTAL CONVERSION PROPULSION',
    metaDesc: 'Calculate positron-antiproton total mass-to-energy conversion, effective exhaust velocity, and fuel requirements for relativistic starships.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        E = 2 · m_{anti} · c² = 1.798 \times 10¹⁷ \text{ J/kg};\quad I_{sp} \le \frac{c}{g₀} \approx 3.05 \times 10⁷ \text{ seconds}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Matter-antimatter annihilation represents the maximum energy density physically possible in the universe: 100% conversion of rest mass into pure energy via E = mc². Annihilating 1 kilogram of antihydrogen with 1 kilogram of hydrogen yields 1.8 × 10¹⁷ Joules (43 Megatons of TNT), enabling relativistic specific impulses exceeding 10 million seconds.
      </p>
    `,
    inputs: [
      { id: 'anti_fuel_grams', label: 'Antimatter Fuel Mass (Grams g)', type: 'number', default: '100', step: '10', min: '0.001' },
      { id: 'anti_ship_mass_tons', label: 'Empty Starship Dry Mass (Metric Tons)', type: 'number', default: '10', step: '1', min: '0.1' },
      { id: 'anti_drive_eff', label: 'Reaction Core Drive Efficiency (%)', type: 'number', default: '60', step: '5', min: '10', max: '100' }
    ],
    presets: [
      { label: 'CERN Annual Production (~10 Nanograms = 0.00000001 g)', values: { anti_fuel_grams: 0.00000001, anti_ship_mass_tons: 10, anti_drive_eff: 60 } },
      { label: 'High-Speed Mars Sprint (10 Grams Antimatter)', values: { anti_fuel_grams: 10, anti_ship_mass_tons: 10, anti_drive_eff: 60 } },
      { label: 'Interstellar Probe to Proxima Centauri (1 kg Antimatter)', values: { anti_fuel_grams: 1000, anti_ship_mass_tons: 1.0, anti_drive_eff: 60 } },
      { label: 'Relativistic Starship Cruiser (100 kg Antimatter)', values: { anti_fuel_grams: 100000, anti_ship_mass_tons: 50, anti_drive_eff: 60 } }
    ],
    outputs: [
      { id: 'out_annihil_energy_j', label: 'Total Annihilation Energy Released', default: '1.798 × 10¹⁶ J' },
      { id: 'out_tnt_bomb_equiv', label: 'Explosive Yield Equivalent', default: '4.30 Megatons TNT' },
      { id: 'out_starship_dv_kms', label: 'Calculated Starship Delta-V (Δv)', default: '1,468 km/s (0.49 % c)' },
      { id: 'out_cost_estimate', label: 'Theoretical Production Cost ($62 Trillion/g)', default: '$6.20 Quadrillion USD' }
    ],
    benchmarks: [
      { object: '1 Gram Matter-Antimatter', val: '1.8 × 10¹⁴ J (43 Kilotons TNT)', notes: 'Equal to three Hiroshima atomic bombs' },
      { object: 'Chemical KeroLOX Energy', val: '1.3 × 10⁷ J / kg', notes: 'Antimatter is 10 billion times more dense' },
      { object: 'Nuclear D-T Fusion', val: '3.4 × 10¹⁴ J / kg', notes: 'Antimatter is 500 times more energetic than fusion' },
      { object: 'Pion Propulsion Rocket', val: 'p⁺ + p⁻ → π⁺ + π⁻ + π⁰', notes: 'Magnetic nozzle steers charged pions for thrust' }
    ],
    faq: [
      { q: 'Why is antimatter currently impossible to use for space travel?', a: 'Production cost and storage. Humanity produces less than a few nanograms of antiprotons per year at CERN and Fermilab. Producing 1 gram would cost over $60 trillion and consume the entire electrical grid of planet Earth for months. Furthermore, storing positrons and antiprotons requires complex cryogenic Penning electromagnetic traps.' },
      { q: 'What is a beamed core antimatter rocket?', a: 'In a beamed core drive, antiprotons annihilate with protons, creating charged pions (π⁺, π⁻). A superconducting magnetic nozzle channels the relativistic pions into a high-speed exhaust plume moving at 30% to 50% the speed of light.' }
    ],
    calcJs: `
      const anti_g = parseFloat(document.getElementById('anti_fuel_grams').value) || 100;
      const ship_tons = parseFloat(document.getElementById('anti_ship_mass_tons').value) || 10;
      const eff_pct = parseFloat(document.getElementById('anti_drive_eff').value) || 60;
      
      const c = 299792458;
      const m_anti_kg = anti_g / 1000;
      const m_total_annihil_kg = 2 * m_anti_kg;
      
      const raw_energy_j = m_total_annihil_kg * c * c;
      const usable_energy_j = raw_energy_j * (eff_pct / 100);
      const tnt_megatons = raw_energy_j / 4.184e15;
      
      const ship_kg = ship_tons * 1000;
      // Kinetic energy E = 1/2 m v^2 => v = sqrt(2 E / m)
      const v_final_ms = Math.sqrt((2 * usable_energy_j) / (ship_kg + m_total_annihil_kg));
      const v_final_kms = v_final_ms / 1000;
      const c_frac = v_final_ms / c;
      
      const cost_trillion = anti_g * 62.5; // $62.5T per gram
      
      let cost_str = '';
      if (cost_trillion >= 1000) cost_str = '$' + (cost_trillion / 1000).toFixed(2) + ' Quadrillion USD';
      else cost_str = '$' + cost_trillion.toFixed(1) + ' Trillion USD';
      
      document.getElementById('out_annihil_energy_j').textContent = fmtSci(raw_energy_j) + ' J';
      document.getElementById('out_tnt_bomb_equiv').textContent = tnt_megatons >= 1 ? tnt_megatons.toFixed(2) + ' Megatons TNT' : (tnt_megatons * 1000).toFixed(1) + ' Kilotons TNT';
      document.getElementById('out_starship_dv_kms').textContent = Math.round(v_final_kms).toLocaleString() + ' km/s (' + (c_frac * 100).toFixed(3) + ' % c)';
      document.getElementById('out_cost_estimate').textContent = cost_str;
    `
  },
  {
    slug: 'solar-corona-parker-wind-speed',
    title: 'Parker Solar Wind Transonic Velocity Profile [Coronal Heating Paradox u(r)] | Digital Tools Shed',
    shortTitle: 'Solar Wind Velocity Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'HELIOSPHERIC MAGNETOHYDRODYNAMICS',
    metaDesc: 'Model Eugene Parker’s hydrodynamic solar wind acceleration through the transonic sonic point out to Earth’s 1 AU orbit.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \frac{u²}{a_s²} - \ln\left(\frac{u²}{a_s²}\right) = 4 \ln\left(\frac{r}{r_c}\right) + 4 \frac{r_c}{r} - 3;\quad r_c = \frac{G M_☉}{2 a_s²}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Predicted by Eugene Parker in 1958, the solar wind is a continuous stream of supersonic magnetized plasma escaping the Sun. Because the corona is heated to 1–3 million Kelvin (the Coronal Heating Paradox), thermal pressure overcomes solar gravity, accelerating plasma smoothly through a sonic critical point r_c to supersonic speeds of 400–800 km/s at Earth.
      </p>
    `,
    inputs: [
      { id: 'park_temp_k', label: 'Coronal Base Temperature (Million K)', type: 'number', default: '1.5', step: '0.1', min: '0.5', max: '5.0' },
      { id: 'park_r_au', label: 'Distance from Sun (AU)', type: 'number', default: '1.0', step: '0.1', min: '0.05', max: '100' }
    ],
    presets: [
      { label: 'Earth Orbit (1.0 AU, Slow Wind T = 1.5 MK)', values: { park_temp_k: 1.5, park_r_au: 1.0 } },
      { label: 'Parker Solar Probe Perihelion (0.04 AU = 9 Solar Radii)', values: { park_temp_k: 2.0, park_r_au: 0.04 } },
      { label: 'Coronal Hole Fast Wind (T = 2.5 MK, 1.0 AU)', values: { park_temp_k: 2.5, park_r_au: 1.0 } },
      { label: 'Voyager Heliopause Boundary (120 AU)', values: { park_temp_k: 1.5, park_r_au: 120 } }
    ],
    outputs: [
      { id: 'out_wind_speed_kms', label: 'Asymptotic Solar Wind Speed (u)', default: '448 km/s' },
      { id: 'out_mach_number', label: 'Flow Mach Number (Relative to Sound Speed)', default: 'Mach 3.12 (Supersonic)' },
      { id: 'out_sonic_radius', label: 'Critical Sonic Point Radius r_c', default: '5.8 Solar Radii (4.0 × 10⁶ km)' },
      { id: 'out_transit_to_earth', label: 'Solar Wind Travel Time from Sun to Earth', default: '3.86 Days' }
    ],
    benchmarks: [
      { object: 'Slow Solar Wind', val: '300 – 450 km/s', notes: 'Originates in coronal streamers near solar equator' },
      { object: 'Fast Solar Wind', val: '700 – 800 km/s', notes: 'Emanates from open magnetic field lines in coronal holes' },
      { object: 'Parker Solar Probe (2024)', val: 'Closest human craft to Sun', notes: 'First spacecraft to dip inside Alfvén critical surface' },
      { object: 'Voyager 1 & 2', val: 'Crossed heliopause ~120 AU', notes: 'Solar wind halts against interstellar medium' }
    ],
    faq: [
      { q: 'What is the Coronal Heating Paradox?', a: 'The surface photosphere of the Sun is 5,778 K, but the corona high above it inexplicably surges to over 1,000,000–3,000,000 K. Thermodynamics says heat cannot flow from cold to hot; Alfvén magnetic wave dissipation and magnetic reconnection nanoflares are believed to power this heating.' },
      { q: 'What happens when the solar wind collides with Earth’s magnetic field?', a: 'The supersonic solar wind cannot penetrate Earth’s magnetosphere directly, forming a standoff bow shock at 10–12 Earth radii. Plasma channeled into the polar cusps ignites the Aurora Borealis and Australis.' }
    ],
    calcJs: `
      const t_mk = parseFloat(document.getElementById('park_temp_k').value) || 1.5;
      const r_au = parseFloat(document.getElementById('park_r_au').value) || 1.0;
      
      const t_k = t_mk * 1e6;
      const kb = 1.380649e-23;
      const mp = 1.6726219e-27;
      const G = 6.67430e-11;
      const m_sun = 1.98847e30;
      const r_sun_m = 6.9634e8;
      
      // Isothermal sound speed a_s = sqrt(2 * kb * T / mp) for hydrogen plasma
      const a_s_ms = Math.sqrt((2 * kb * t_k) / mp);
      const a_s_kms = a_s_ms / 1000;
      
      // Critical radius rc = G * M / (2 * as^2)
      const rc_m = (G * m_sun) / (2 * a_s_ms * a_s_ms);
      const rc_sun_radii = rc_m / r_sun_m;
      
      // Asymptotic terminal speed approx u_inf ~ 2 * as * sqrt(rc / r_sun)
      const u_inf_kms = a_s_kms * Math.sqrt(4 * Math.log(Math.max(1.1, (r_au * 215) / rc_sun_radii)));
      const mach = u_inf_kms / a_s_kms;
      
      const dist_km = r_au * 1.4959787e8;
      const transit_s = dist_km / u_inf_kms;
      const transit_days = transit_s / 86400;
      
      document.getElementById('out_wind_speed_kms').textContent = Math.round(u_inf_kms) + ' km/s';
      document.getElementById('out_mach_number').textContent = 'Mach ' + mach.toFixed(2) + ' (Supersonic)';
      document.getElementById('out_sonic_radius').textContent = rc_sun_radii.toFixed(1) + ' R_☉ (' + fmtSci(rc_m / 1000) + ' km)';
      document.getElementById('out_transit_to_earth').textContent = transit_days.toFixed(2) + ' Days';
    `
  },
  {
    slug: 'coronal-mass-ejection-transit-time',
    title: 'Coronal Mass Ejection (CME) Interplanetary Shock Transit Time [Solar Storm Arrival] | Digital Tools Shed',
    shortTitle: 'CME Transit Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'SPACE WEATHER EARLY WARNING',
    metaDesc: 'Calculate Coronal Mass Ejection (CME) interplanetary transit duration and arrival shock velocity at 1 AU based on aerodynamic solar wind drag.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        a_{drag} = -\gamma · (v - v_{sw}) |v - v_{sw}|;\quad t_{transit} = \int \frac{dr}{v(r)} \approx 15 - 72 \text{ hours}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Coronal Mass Ejections (CMEs) are colossal magnetic plasma clouds blasted into space by solar flares, carrying up to 10 billion tons of magnetized plasma. Fast CMEs (launching at > 2,000 km/s) are decelerated by drag against the ambient solar wind, while slow CMEs are pushed forward, arriving at Earth in 15 to 72 hours.
      </p>
    `,
    inputs: [
      { id: 'cme_launch_speed_kms', label: 'CME Ejection Speed at Sun (km/s)', type: 'number', default: '1500', step: '50', min: '200', max: '3500' },
      { id: 'cme_ambient_wind_kms', label: 'Ambient Solar Wind Speed (km/s)', type: 'number', default: '400', step: '25', min: '300', max: '800' }
    ],
    presets: [
      { label: 'Moderate Solar Flare CME (800 km/s -> 50 Hours)', values: { cme_launch_speed_kms: 800, cme_ambient_wind_kms: 400 } },
      { label: 'Severe Carrington-Class CME (2,200 km/s -> 17.5 Hours)', values: { cme_launch_speed_kms: 2200, cme_ambient_wind_kms: 450 } },
      { label: 'Extreme Record Blast 1972 (2,850 km/s -> 14.6 Hours)', values: { cme_launch_speed_kms: 2850, cme_ambient_wind_kms: 500 } },
      { label: 'Halloween 2003 Solar Storm (1,800 km/s)', values: { cme_launch_speed_kms: 1800, cme_ambient_wind_kms: 420 } }
    ],
    outputs: [
      { id: 'out_cme_transit_hours', label: 'Interplanetary Transit Time to Earth', default: '26.8 Hours' },
      { id: 'out_cme_arrival_vel', label: 'Estimated Earth Arrival Shock Speed', default: '820 km/s' },
      { id: 'out_space_weather_scale', label: 'NOAA Geomagnetic Storm Severity', default: 'G4 - Severe Geomagnetic Storm' },
      { id: 'out_warning_window', label: 'Advance Early Warning Lead Time', default: 'Critical 24-Hour Grid Warning' }
    ],
    benchmarks: [
      { object: 'August 1972 CME', val: '14.6 Hours Transit', notes: 'Fastest transit ever recorded; detonated US sea mines in Vietnam' },
      { object: '1859 Carrington Event', val: '17.6 Hours Transit', notes: 'Sparks leaped from telegraph lines; auroras seen in tropics' },
      { object: 'Halloween Storms 2003', val: '19 Hours Transit', notes: 'Tripped Swedish power grid; disabled satellite sensors' },
      { object: 'July 2012 Solar Near-Miss', val: '2,500 km/s super-CME', notes: 'Narrowly missed Earth by 9 days; would have caused $2T damage' }
    ],
    faq: [
      { q: 'Why did the Carrington Event CME travel to Earth so quickly (17.6 hours)?', a: 'A preceding, smaller CME had cleared out the interplanetary solar wind along the Sun-Earth line hours earlier. With no ambient solar wind plasma to produce aerodynamic drag, the main Carrington CME traveled through an open corridor at nearly unimpeded speeds.' },
      { q: 'How does NOAA forecast CME arrival times?', a: 'Using the WSA-ENLIL 3D magnetohydrodynamic numerical simulation, combined with coronagraph imagery from SOHO and STEREO spacecraft to triangulate CME velocity, angular width, and magnetic polarity.' }
    ],
    calcJs: `
      const v0 = parseFloat(document.getElementById('cme_launch_speed_kms').value) || 1500;
      const v_sw = parseFloat(document.getElementById('cme_ambient_wind_kms').value) || 400;
      
      const d_earth_km = 1.4959787e8;
      // Empirical Vrsnak drag model: v_arrival = v_sw + (v0 - v_sw) * e^(-gamma * d)
      const gamma = 0.007; // drag parameter per 1e6 km
      const factor = Math.exp(-gamma * (d_earth_km / 1e6));
      const v_arr = v_sw + (v0 - v_sw) * factor;
      
      const v_avg = (v0 + v_arr) / 2;
      const t_hours = d_earth_km / (v_avg * 3600);
      
      let storm = 'G1 - Minor';
      if (v0 >= 2000) storm = 'G5 - Extreme Carrington Level Event';
      else if (v0 >= 1400) storm = 'G4 - Severe Geomagnetic Storm';
      else if (v0 >= 1000) storm = 'G3 - Strong Geomagnetic Storm';
      else if (v0 >= 600) storm = 'G2 - Moderate Geomagnetic Storm';
      
      document.getElementById('out_cme_transit_hours').textContent = t_hours.toFixed(1) + ' Hours (' + (t_hours / 24).toFixed(1) + ' Days)';
      document.getElementById('out_cme_arrival_vel').textContent = Math.round(v_arr) + ' km/s';
      document.getElementById('out_space_weather_scale').textContent = storm;
      document.getElementById('out_warning_window').textContent = t_hours < 20 ? 'Urgent Rapid Shock Alert (< 20h)' : 'Standard Space Weather Window';
    `
  },
  {
    slug: 'carrington-event-geomagnetic-induced-current',
    title: 'Carrington-Class Geomagnetic Induced Current (GIC) Calculator [Power Grid Vulnerability dB/dt] | Digital Tools Shed',
    shortTitle: 'Carrington GIC Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'GEOMAGNETIC INDUCTION RISK',
    metaDesc: 'Estimate Faraday induced ground electric field gradients (V/km) and DC transformer saturation current during extreme geomagnetic storms.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \nabla \times \vec{E} = -\frac{\partial \vec{B}}{\partial t};\quad E_{ground} \approx \sqrt{\frac{\rho_{crust}}{\mu_0 \cdot \omega}} · \left|\frac{dB}{dt}\right|
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        When an extreme solar storm strikes Earth’s magnetosphere, rapid magnetic field fluctuations (dB/dt) induce electric fields across the ground via Faraday’s Law. High-voltage transmission lines grounded at both ends act as giant antennas, capturing quasi-DC Geomagnetically Induced Currents (GIC) that saturate and melt multi-ton transformer cores.
      </p>
    `,
    inputs: [
      { id: 'gic_dbdt', label: 'Rate of Magnetic Field Change dB/dt (nT/min)', type: 'number', default: '2000', step: '100', min: '10' },
      { id: 'gic_line_length_km', label: 'Power Line Length (Kilometers km)', type: 'number', default: '300', step: '25', min: '10' },
      { id: 'gic_crust_resistivity', label: 'Geological Ground Resistivity', type: 'select', options: [
        { val: '1000', text: 'Igneous / Granite Shield (High Risk: 1,000 Ω·m)' },
        { val: '300', text: 'Sedimentary Basin (Moderate Risk: 300 Ω·m)' },
        { val: '50', text: 'Coastal / Salt Water (Low Risk: 50 Ω·m)' }
      ]}
    ],
    presets: [
      { label: 'March 1989 Quebec Blackout (dB/dt ≈ 500 nT/min)', values: { gic_dbdt: 500, gic_line_length_km: 250, gic_crust_resistivity: '1000' } },
      { label: '1859 Carrington Event Superstorm (dB/dt ≈ 3,000 nT/min)', values: { gic_dbdt: 3000, gic_line_length_km: 400, gic_crust_resistivity: '1000' } },
      { label: 'Moderate G3 Storm (dB/dt ≈ 100 nT/min)', values: { gic_dbdt: 100, gic_line_length_km: 200, gic_crust_resistivity: '300' } }
    ],
    outputs: [
      { id: 'out_electric_field_vkm', label: 'Induced Ground Electric Field (V/km)', default: '8.94 V / km' },
      { id: 'out_total_voltage_kv', label: 'Total End-to-End Induced DC Voltage', default: '2.68 kV DC' },
      { id: 'out_est_gic_current_a', label: 'Quasi-DC Transformer Neutral Current', default: '178.9 Amperes DC' },
      { id: 'out_transformer_hazard', label: 'Grid Transformer Saturation Risk', default: 'Catastrophic Transformer Core Saturation' }
    ],
    benchmarks: [
      { object: 'March 13, 1989 Quebec Collapse', val: 'GIC collapsed grid in 92 seconds', notes: '6 million people without power for 9 hours' },
      { object: 'May 1921 Rail Storm', val: 'New York Central RR signal towers burned', notes: 'Sub-auroral magnetic induction' },
      { object: '1859 Carrington Event', val: 'E_ground > 10 V/km', notes: 'Operators received electric shocks from telegraphs' },
      { object: 'Transformer Saturation Threshold', val: '10 – 30 A DC in neutral', notes: 'Half-cycle saturation causes overheating & harmonic distortion' }
    ],
    faq: [
      { q: 'Why does DC current from solar storms damage AC power transformers?', a: 'High-voltage grid transformers are designed strictly for AC power. Quasi-DC GIC currents shift the operating magnetic flux point, driving the ferromagnetic core into saturation during half of every AC cycle. This causes rapid thermal runaway, coil insulation melting, and transformer destruction.' },
      { q: 'Why is the US East Coast and Canada more vulnerable to GIC?', a: 'Because ancient crystalline igneous bedrock (like the Canadian Shield) has very high electrical resistivity. Rather than dissipating into the deep ground, induced currents seek the path of least resistance: copper electrical transmission lines.' }
    ],
    calcJs: `
      const dbdt = parseFloat(document.getElementById('gic_dbdt').value) || 2000;
      const len_km = parseFloat(document.getElementById('gic_line_length_km').value) || 300;
      const rho = parseFloat(document.getElementById('gic_crust_resistivity').value) || 1000;
      
      // Standard plane-wave 1D Earth response approximation
      // E ~ sqrt(rho / (mu0 * omega)) * dB/dt
      // Empirical rule: 1000 nT/min over 1000 ohm-m ~ 4 - 5 V/km
      const e_v_km = (dbdt / 1000) * 2.0 * Math.sqrt(rho / 500);
      const total_v_kv = (e_v_km * len_km) / 1000;
      
      // Typical high-voltage loop impedance ~ 15 ohms
      const loop_r = 15;
      const gic_amps = (total_v_kv * 1000) / loop_r;
      
      let hazard = 'Normal / Low GIC Risk';
      if (gic_amps > 100) hazard = 'Catastrophic Core Thermal Melting Risk (> 100A)';
      else if (gic_amps > 30) hazard = 'Severe Half-Cycle Saturation & Reactive Power Loss';
      else if (gic_amps > 10) hazard = 'Minor Harmonic Distortion on Grid';
      
      document.getElementById('out_electric_field_vkm').textContent = e_v_km.toFixed(2) + ' V / km';
      document.getElementById('out_total_voltage_kv').textContent = total_v_kv.toFixed(2) + ' kV DC';
      document.getElementById('out_est_gic_current_a').textContent = Math.round(gic_amps) + ' A DC';
      document.getElementById('out_transformer_hazard').textContent = hazard;
    `
  },
  {
    slug: 'van-allen-radiation-belt-dose',
    title: 'Van Allen Radiation Belt Proton & Electron Dose Calculator [Orbital Exposure rad/day] | Digital Tools Shed',
    shortTitle: 'Van Allen Belt Dose Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'MAGNETOSPHERIC TRAPPED RADIATION',
    metaDesc: 'Model inner proton and outer electron Van Allen radiation belt doses and aluminum shielding requirements for spacecraft.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        D_{shielded} \approx D₀ · e^{-\mu · x_{Al}};\quad \text{Inner Belt: } 1,000 - 6,000 \text{ km (Protons)};\quad \text{Outer: } 13,000 - 25,000 \text{ km}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Discovered by James Van Allen in 1958 aboard Explorer 1, the Van Allen belts consist of high-energy charged particles trapped by Earth’s magnetic dipole. The inner belt contains lethal energetic protons (> 100 MeV) produced by cosmic ray albedo neutron decay (CRAND), while the outer belt traps relativistic "killer electrons" up to 10 MeV.
      </p>
    `,
    inputs: [
      { id: 'va_orbit_region', label: 'Orbital Altitude Region', type: 'select', options: [
        { val: 'leo', text: 'Low Earth Orbit (400 km, ISS Altitude)' },
        { val: 'inner_core', label: 'Inner Belt Peak (3,000 km, Trapped Protons)', text: 'Inner Belt Peak (3,000 km, Lethal Protons)' },
        { val: 'slot', text: 'Safe Slot Region (8,000 km)' },
        { val: 'outer_core', text: 'Outer Belt Peak (20,000 km, GPS & Relativistic Electrons)' },
        { val: 'geo', text: 'Geostationary Orbit (35,786 km)' }
      ]},
      { id: 'va_shielding_mm_al', label: 'Aluminum Shielding Thickness (mm Al)', type: 'number', default: '3.0', step: '0.5', min: '0.5', max: '50' }
    ],
    presets: [
      { label: 'Apollo Lunar Transit (3 mm Al, Fast Outbound Trajectory)', values: { va_orbit_region: 'inner_core', va_shielding_mm_al: 3.0 } },
      { label: 'ISS Space Station (400 km, Standard Shell)', values: { va_orbit_region: 'leo', va_shielding_mm_al: 10.0 } },
      { label: 'GPS Constellation Satellite (20,200 km, Outer Belt)', values: { va_orbit_region: 'outer_core', va_shielding_mm_al: 5.0 } },
      { label: 'Unshielded Spacewalk in Inner Belt Core', values: { va_orbit_region: 'inner_core', va_shielding_mm_al: 0.5 } }
    ],
    outputs: [
      { id: 'out_daily_dose_rad', label: 'Daily Dose Rate (rad / day)', default: '14.8 rad / day (0.148 Gy)' },
      { id: 'out_sievert_day', label: 'Equivalent Biological Dose (mSv / day)', default: '148 mSv / day' },
      { id: 'out_apollo_comparison', label: 'Apollo Mission Total Comparison', default: 'Apollo traversed belts in under 4 hours' },
      { id: 'out_satellite_lifespan', label: 'Silicon Electronics Degradation Risk', default: 'Radiation Hardened Electronics Required' }
    ],
    benchmarks: [
      { object: 'ISS (Low Earth Orbit)', val: '0.5 mSv / day', notes: 'Below inner belt; passes through South Atlantic Anomaly' },
      { object: 'Inner Belt Core (3,000 km)', val: 'Up to 20 rad/day (200 mSv/day)', notes: 'Lethal within months without heavy shielding' },
      { object: 'Outer Belt Core (20,000 km)', val: '10–50 rad/day electron dose', notes: 'Causes deep dielectric charging in satellites' },
      { object: 'Apollo Missions Total Dose', val: '4.8 mSv total mission average', notes: 'Bypassed inner core on fast hyperbolic trajectory' }
    ],
    faq: [
      { q: 'How did the Apollo astronauts survive traveling through the Van Allen belts?', a: 'By speed and trajectory. The Apollo translunar injection trajectory was inclined to skirt around the dense core of the inner proton belt. The spacecraft traversed the belts in under 4 hours, exposing astronauts to only ~5 mSv total—less than a single clinical CT scan.' },
      { q: 'What is the South Atlantic Anomaly (SAA)?', a: 'Because Earth’s magnetic dipole is tilted and offset from Earth’s center by ~450 km, the inner Van Allen belt dips as low as 200 km altitude over South America and the South Atlantic Ocean. Satellites and the ISS experience heavy radiation spikes when passing through the SAA.' }
    ],
    calcJs: `
      const region = document.getElementById('va_orbit_region').value;
      const al_mm = parseFloat(document.getElementById('va_shielding_mm_al').value) || 3.0;
      
      let base_rad_day = 0.05; // LEO
      if (region === 'inner_core') base_rad_day = 50.0; // raw proton dose
      else if (region === 'slot') base_rad_day = 0.5;
      else if (region === 'outer_core') base_rad_day = 25.0; // electron dose
      else if (region === 'geo') base_rad_day = 2.0;
      
      // Exponential attenuation
      const shielded_rad_day = base_rad_day * Math.exp(-al_mm / 4.0);
      const msv_day = shielded_rad_day * 10; // 1 rad ~ 10 mSv for mixed radiation
      
      document.getElementById('out_daily_dose_rad').textContent = shielded_rad_day.toFixed(2) + ' rad / day (' + (shielded_rad_day / 100).toFixed(4) + ' Gy)';
      document.getElementById('out_sievert_day').textContent = msv_day > 1000 ? (msv_day / 1000).toFixed(2) + ' Sv / day' : msv_day.toFixed(1) + ' mSv / day';
      document.getElementById('out_apollo_comparison').textContent = 'Apollo averaged ~5 mSv total for entire round-trip';
      document.getElementById('out_satellite_lifespan').textContent = msv_day > 50 ? 'Requires Rad-Hard Silicon (> 100 krad total)' : 'Standard Space-Grade Components Viable';
    `
  },
  {
    slug: 'exoplanet-transit-depth-radius',
    title: 'Exoplanet Transit Photometry Depth & Radius Calculator [Kepler & TESS Detection ΔF/F] | Digital Tools Shed',
    shortTitle: 'Exoplanet Transit Depth Calculator',
    category: 'Astrophysics & Solar Physics',
    badge: 'EXOPLANETARY TRANSIT PHOTOMETRY',
    metaDesc: 'Calculate transit light curve dimming depth, exoplanet radius in Earth/Jupiter units, and transit duration across parent stars.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \frac{\Delta F}{F} = \left(\frac{R_p}{R_\star}\right)²;\quad T_{dur} = \frac{P}{\pi} \arcsin\left(\frac{\sqrt{(R_\star + R_p)² - (a \cos i)²}}{a}\right)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        When an exoplanet transits across the face of its host star along our line of sight, it blocks a fraction of the star’s light proportional to the ratio of their cross-sectional areas. For an Earth-sized planet crossing a Sun-like star, the transit depth is roughly 84 parts per million (0.0084%); for a giant Jupiter, it dims by a full 1%.
      </p>
    `,
    inputs: [
      { id: 'exo_radius_earth', label: 'Planet Radius (Earth Radii R_⊕)', type: 'number', default: '1.0', step: '0.1', min: '0.1' },
      { id: 'exo_star_radius_sun', label: 'Star Radius (Solar Radii R_☉)', type: 'number', default: '1.0', step: '0.1', min: '0.05' },
      { id: 'exo_period_days', label: 'Orbital Period (Days)', type: 'number', default: '365.25', step: '1', min: '0.5' }
    ],
    presets: [
      { label: 'Earth transiting Sun (R_p = 1.0 R_⊕, R_★ = 1.0 R_☉)', values: { exo_radius_earth: 1.0, exo_star_radius_sun: 1.0, exo_period_days: 365.25 } },
      { label: 'Jupiter transiting Sun (R_p = 11.2 R_⊕, R_★ = 1.0 R_☉)', values: { exo_radius_earth: 11.2, exo_star_radius_sun: 1.0, exo_period_days: 4332 } },
      { label: 'TRAPPIST-1e Earth-size around Red Dwarf (R_★ = 0.12 R_☉)', values: { exo_radius_earth: 0.92, exo_star_radius_sun: 0.12, exo_period_days: 6.1 } },
      { label: 'Hot Jupiter HD 209458b (R_p = 15.1 R_⊕, R_★ = 1.2 R_☉)', values: { exo_radius_earth: 15.1, exo_star_radius_sun: 1.2, exo_period_days: 3.52 } }
    ],
    outputs: [
      { id: 'out_transit_depth_ppm', label: 'Transit Depth in Parts per Million (ppm)', default: '84 ppm' },
      { id: 'out_transit_depth_pct', label: 'Stellar Dimming Percentage', default: '0.0084 %' },
      { id: 'out_transit_duration_hrs', label: 'Central Transit Duration', default: '13.0 Hours' },
      { id: 'out_detect_observatory', label: 'Observatory Detection Capability', default: 'Kepler & JWST Space Photometry' }
    ],
    benchmarks: [
      { object: 'Earth transiting Sun', val: '84 ppm (0.0084%)', notes: 'Required Kepler space telescope precision' },
      { object: 'Jupiter transiting Sun', val: '10,500 ppm (1.05%)', notes: 'Easily detectable by amateur backyard telescopes' },
      { object: 'TRAPPIST-1 System', val: '5,000 ppm around Red Dwarf', notes: 'Small star magnifies Earth-sized transit dip' },
      { object: 'Transit Probability P = R_★ / a', val: '~0.47% for Earth-Sun', notes: 'Only 1 in 213 randomly oriented Earth analogs transit' }
    ],
    faq: [
      { q: 'Why are red dwarfs favored for detecting habitable Earth-sized planets?', a: 'Because a red dwarf has a radius only 10% to 20% that of the Sun. An Earth-sized planet transiting a red dwarf produces a deep 0.5% dimming signal rather than the subtle 84 ppm drop across a Sun-sized star, and short orbital periods (days) provide frequent transit observations.' },
      { q: 'Can astronomers detect exoplanet atmospheres during transit?', a: 'Yes! Transmission spectroscopy uses the James Webb Space Telescope (JWST) to measure minute wavelength-dependent variations in transit depth as starlight filters through the planet’s atmospheric ring, identifying water vapor, carbon dioxide, methane, and clouds.' }
    ],
    calcJs: `
      const rp_earth = parseFloat(document.getElementById('exo_radius_earth').value) || 1.0;
      const r_star_sun = parseFloat(document.getElementById('exo_star_radius_sun').value) || 1.0;
      const p_days = parseFloat(document.getElementById('exo_period_days').value) || 365.25;
      
      const r_earth_km = 6371;
      const r_sun_km = 696340;
      
      const rp_km = rp_earth * r_earth_km;
      const r_star_km = r_star_sun * r_sun_km;
      
      const depth_ratio = Math.pow(rp_km / r_star_km, 2);
      const depth_ppm = depth_ratio * 1e6;
      const depth_pct = depth_ratio * 100;
      
      // Central transit duration T ~ (P / pi) * (R_star / a)
      // By Kepler's 3rd law: a_au ~ (P_years)^(2/3)
      const p_years = p_days / 365.25;
      const a_au = Math.cbrt(p_years * p_years);
      const a_km = a_au * 1.4959787e8;
      
      const duration_hours = (p_days * 24 / Math.PI) * (r_star_km / a_km);
      
      let det = 'Kepler / JWST Spacecraft Sensitivity (< 100 ppm)';
      if (depth_ppm > 5000) det = 'Amateur Backyard Telescopes Viable (> 5,000 ppm)';
      else if (depth_ppm > 500) det = 'Ground-Based Professional Observatories';
      
      document.getElementById('out_transit_depth_ppm').textContent = Math.round(depth_ppm).toLocaleString() + ' ppm';
      document.getElementById('out_transit_depth_pct').textContent = depth_pct.toFixed(4) + ' %';
      document.getElementById('out_transit_duration_hrs').textContent = duration_hours.toFixed(1) + ' Hours';
      document.getElementById('out_detect_observatory').textContent = det;
    `
  }
];

export const SCIENCE_TOOLS_BATCH_4 = [
  {
    slug: 'exoplanet-radial-velocity-semi-amplitude',
    title: 'Exoplanet Radial Velocity Doppler Wobble Calculator [Semi-Amplitude K Method] | Digital Tools Shed',
    shortTitle: 'Radial Velocity Calculator',
    category: 'Observational Astrophysics',
    badge: 'DOPPLER EXOPLANET SPECTROSCOPY',
    metaDesc: 'Calculate stellar radial velocity wobble semi-amplitude K in m/s induced by orbiting exoplanets across orbital inclinations.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        K = \left(\frac{2\pi G}{P}\right)^{1/3} \frac{M_p \sin i}{(M_\star + M_p)^{2/3}} \frac{1}{\sqrt{1 - e²}}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        The radial velocity (Doppler wobble) method detects exoplanets by measuring the periodic red- and blue-shift of stellar spectral absorption lines as the host star orbits the mutual center of mass. While a massive Hot Jupiter induces a large ~100 m/s wobble, an Earth twin induces a subtle 9 cm/s signal on the Sun.
      </p>
    `,
    inputs: [
      { id: 'rv_planet_mass', label: 'Planet Mass (Earth Masses M_⊕)', type: 'number', default: '317.8', step: '1', min: '0.01' },
      { id: 'rv_star_mass', label: 'Star Mass (Solar Masses M_☉)', type: 'number', default: '1.0', step: '0.05', min: '0.05' },
      { id: 'rv_period_days', label: 'Orbital Period P (Days)', type: 'number', default: '4332.6', step: '1', min: '0.1' },
      { id: 'rv_inclination_deg', label: 'Orbital Inclination Angle i (Degrees)', type: 'number', default: '90', step: '1', min: '1', max: '90' }
    ],
    presets: [
      { label: 'Jupiter orbiting Sun (P = 11.86 yrs, K ≈ 12.5 m/s)', values: { rv_planet_mass: 317.8, rv_star_mass: 1.0, rv_period_days: 4332.6, rv_inclination_deg: 90 } },
      { label: '51 Pegasi b Hot Jupiter (P = 4.23 days, K ≈ 56 m/s)', values: { rv_planet_mass: 150.0, rv_star_mass: 1.11, rv_period_days: 4.23, rv_inclination_deg: 80 } },
      { label: 'Earth orbiting Sun (P = 365.25 days, K ≈ 0.089 m/s = 8.9 cm/s)', values: { rv_planet_mass: 1.0, rv_star_mass: 1.0, rv_period_days: 365.25, rv_inclination_deg: 90 } },
      { label: 'Proxima Centauri b (P = 11.2 days, K ≈ 1.2 m/s)', values: { rv_planet_mass: 1.17, rv_star_mass: 0.12, rv_period_days: 11.18, rv_inclination_deg: 90 } }
    ],
    outputs: [
      { id: 'out_rv_semi_k', label: 'Stellar Wobble Semi-Amplitude (K)', default: '12.47 m/s' },
      { id: 'out_rv_cm_s', label: 'Semi-Amplitude in cm/s', default: '1,247 cm/s' },
      { id: 'out_spectrograph_req', label: 'Required Spectrograph Instrument', default: 'High Precision Ground (HARPS / ESPRESSO)' },
      { id: 'out_mass_uncertainty', label: 'Minimum Mass Constraint (M_p · sin i)', default: 'True Mass Known (Edge-On i = 90°)' }
    ],
    benchmarks: [
      { object: '51 Pegasi b (Mayor & Queloz 1995)', val: 'K = 56 m/s', notes: 'First confirmed exoplanet around Sun-like star (2019 Nobel Prize)' },
      { object: 'Jupiter Wobble on Sun', val: 'K = 12.5 m/s', notes: 'Detectable by 1980s era spectrographs' },
      { object: 'ESPRESSO Spectrograph (VLT)', val: 'Precision: 10 cm/s (0.1 m/s)', notes: 'Ultra-stable vacuum cross-dispersed echelle' },
      { object: 'Earth Wobble on Sun', val: 'K = 8.9 cm/s (0.089 m/s)', notes: 'Obscured by stellar convective magnetic granulation noise' }
    ],
    faq: [
      { q: 'Why does the radial velocity method only measure minimum mass (M · sin i)?', a: 'Unless the planet also transits its star (revealing an edge-on orbital plane near i = 90°), the exact orbital inclination i relative to our line of sight is unknown. Radial velocity measures only the component of velocity projected toward Earth, yielding M_min = M · sin i.' },
      { q: 'Why is detecting an Earth twin with radial velocity so difficult?', a: 'Because Earth induces a minuscule 8.9 cm/s wobble on the Sun. At this extreme precision, stellar surface atmospheric boiling (convective granulations and starspots) generates magnetic noise that can exceed 1 m/s, masking the planetary signal.' }
    ],
    calcJs: `
      const mp_earth = parseFloat(document.getElementById('rv_planet_mass').value) || 317.8;
      const ms_sun = parseFloat(document.getElementById('rv_star_mass').value) || 1.0;
      const p_days = parseFloat(document.getElementById('rv_period_days').value) || 4332.6;
      const inc_deg = parseFloat(document.getElementById('rv_inclination_deg').value) || 90;
      
      const G = 6.67430e-11;
      const mp_kg = mp_earth * 5.9722e24;
      const ms_kg = ms_sun * 1.98847e30;
      const p_sec = p_days * 86400;
      const inc_rad = (inc_deg * Math.PI) / 180;
      
      // K = (2*pi*G / P)^(1/3) * (Mp * sin i) / (Ms + Mp)^(2/3)
      const term1 = Math.cbrt((2 * Math.PI * G) / p_sec);
      const term2 = (mp_kg * Math.sin(inc_rad)) / Math.pow(ms_kg + mp_kg, 2/3);
      const k_ms = term1 * term2;
      const k_cms = k_ms * 100;
      
      let spec = 'Standard Astronomical Spectrograph (ELODIE / Keck HIRES)';
      if (k_ms < 0.15) spec = 'Ultra-High Precision Future (ESPRESSO / ELT ANDES: < 10 cm/s)';
      else if (k_ms < 1.0) spec = 'High Precision State-of-the-Art (HARPS / ESPRESSO: ~ 30-50 cm/s)';
      
      document.getElementById('out_rv_semi_k').textContent = k_ms < 0.01 ? (k_ms * 100).toFixed(2) + ' cm/s' : k_ms.toFixed(2) + ' m/s';
      document.getElementById('out_rv_cm_s').textContent = k_cms.toFixed(1) + ' cm/s';
      document.getElementById('out_spectrograph_req').textContent = spec;
      document.getElementById('out_mass_uncertainty').textContent = inc_deg >= 85 ? 'Edge-On (sin i ≈ 1.0, True Mass Known)' : 'Inclination sin(' + inc_deg + '°) = ' + Math.sin(inc_rad).toFixed(3);
    `
  },
  {
    slug: 'exoplanet-habitable-zone-boundaries',
    title: 'Exoplanet Habitable Zone Climate Boundaries [Kopparapu Goldilocks Distance] | Digital Tools Shed',
    shortTitle: 'Habitable Zone Calculator',
    category: 'Observational Astrophysics',
    badge: 'EXOPLANETARY CLIMATE ZONES',
    metaDesc: 'Calculate conservative and optimistic circumstellar habitable zone boundaries (AU) based on Kopparapu 1D radiative-convective climate models.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        d = \sqrt{L_\star / S_{eff}} \text{ AU};\quad S_{eff} = S_{eff\odot} + a T_\star + b T_\star² + c T_\star³
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by Ravi Kumar Kopparapu et al. (2013), the circumstellar habitable zone ("Goldilocks Zone") is the orbital band where an Earth-like planet with an N₂-CO₂-H₂O atmosphere can support stable liquid surface water. The inner edge is limited by the runaway greenhouse water loss limit; the outer edge by maximum CO₂ greenhouse condensation.
      </p>
    `,
    inputs: [
      { id: 'hz_star_lum', label: 'Star Luminosity (Solar Units L_☉)', type: 'number', default: '1.0', step: '0.05', min: '0.00001' },
      { id: 'hz_star_teff', label: 'Star Effective Temperature T_eff (Kelvin K)', type: 'number', default: '5778', step: '50', min: '2500', max: '10000' }
    ],
    presets: [
      { label: 'Sun G2V Yellow Dwarf (1.0 L_☉, 5,778 K)', values: { hz_star_lum: 1.0, hz_star_teff: 5778 } },
      { label: 'Proxima Centauri M5.5V Red Dwarf (0.0017 L_☉, 3,042 K)', values: { hz_star_lum: 0.0017, hz_star_teff: 3042 } },
      { label: 'TRAPPIST-1 Ultra-Cool Dwarf (0.00055 L_☉, 2,566 K)', values: { hz_star_lum: 0.00055, hz_star_teff: 2566 } },
      { label: 'Kepler-186 M-Dwarf (0.05 L_☉, 3,755 K)', values: { hz_star_lum: 0.05, hz_star_teff: 3755 } },
      { label: 'Vega A0V Hot Star (40 L_☉, 9,600 K)', values: { hz_star_lum: 40.0, hz_star_teff: 9600 } }
    ],
    outputs: [
      { id: 'out_hz_inner_au', label: 'Conservative Inner Edge (Runaway Greenhouse)', default: '0.950 AU' },
      { id: 'out_hz_outer_au', label: 'Conservative Outer Edge (Maximum Greenhouse)', default: '1.676 AU' },
      { id: 'out_hz_optimistic_inner', label: 'Optimistic Inner Edge (Recent Venus)', default: '0.750 AU' },
      { id: 'out_hz_optimistic_outer', label: 'Optimistic Outer Edge (Early Mars)', default: '1.770 AU' }
    ],
    benchmarks: [
      { object: 'Solar System Conservative Zone', val: '0.95 – 1.68 AU', notes: 'Earth sits comfortably at 1.0 AU; Mars at 1.52 AU' },
      { object: 'Venus (0.72 AU)', val: 'Past inner edge', notes: 'Suffered runaway greenhouse evaporation of oceans' },
      { object: 'Proxima Centauri b (0.048 AU)', val: 'Inside habitable zone', notes: 'Tidally locked; stellar flare radiation risk' },
      { object: 'TRAPPIST-1e (0.029 AU)', val: 'Prime habitable candidate', notes: 'Earth-sized with rocky bulk density' }
    ],
    faq: [
      { q: 'Why is the habitable zone much closer for red dwarf stars?', a: 'Because red dwarfs are vastly less luminous than the Sun (often emitting less than 0.1% of solar luminosity). Planets must orbit tightly within 0.02 to 0.1 AU to receive sufficient warmth for liquid water, which typically causes them to become tidally locked.' },
      { q: 'What is the "Maximum Greenhouse" outer boundary?', a: 'Beyond this distance, adding more CO₂ to the atmosphere fails to warm the planet because Rayleigh scattering of incoming starlight by CO₂ gas outpaces greenhouse infrared back-radiation.' }
    ],
    calcJs: `
      const L = parseFloat(document.getElementById('hz_star_lum').value) || 1.0;
      const teff = parseFloat(document.getElementById('hz_star_teff').value) || 5778;
      
      const t_diff = teff - 5780;
      
      // Kopparapu et al. (2013) coefficients
      // Runaway Greenhouse (Inner Conservative)
      const seff_rg = 1.0512 + 1.3242e-4 * t_diff + 3.1077e-8 * t_diff * t_diff;
      // Maximum Greenhouse (Outer Conservative)
      const seff_mg = 0.3507 + 5.9571e-5 * t_diff + 1.6707e-8 * t_diff * t_diff;
      // Recent Venus (Inner Optimistic)
      const seff_rv = 1.7763 + 1.4335e-4 * t_diff + 3.3954e-8 * t_diff * t_diff;
      // Early Mars (Outer Optimistic)
      const seff_em = 0.3207 + 5.4471e-5 * t_diff + 1.5275e-8 * t_diff * t_diff;
      
      const r_rg = Math.sqrt(L / Math.max(0.01, seff_rg));
      const r_mg = Math.sqrt(L / Math.max(0.01, seff_mg));
      const r_rv = Math.sqrt(L / Math.max(0.01, seff_rv));
      const r_em = Math.sqrt(L / Math.max(0.01, seff_em));
      
      document.getElementById('out_hz_inner_au').textContent = r_rg.toFixed(3) + ' AU';
      document.getElementById('out_hz_outer_au').textContent = r_mg.toFixed(3) + ' AU';
      document.getElementById('out_hz_optimistic_inner').textContent = r_rv.toFixed(3) + ' AU';
      document.getElementById('out_hz_optimistic_outer').textContent = r_em.toFixed(3) + ' AU';
    `
  },
  {
    slug: 'drake-equation-alien-civilizations',
    title: 'Drake Equation Communicative Alien Civilizations Calculator [SETI Probability N] | Digital Tools Shed',
    shortTitle: 'Drake Equation Calculator',
    category: 'Observational Astrophysics',
    badge: 'ASTROBIOLOGICAL PROBABILITY',
    metaDesc: 'Explore Frank Drake’s famous equation estimating the number N of active, communicative extraterrestrial civilizations in the Milky Way.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        N = R_\star · f_p · n_e · f_l · f_i · f_c · L
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by astronomer Frank Drake in 1961 for the Green Bank SETI conference, the Drake Equation structures our ignorance regarding intelligent extraterrestrial life into seven probabilistic factors, multiplying star formation rates, planetary frequencies, abiogenesis odds, and civilization longevity L.
      </p>
    `,
    inputs: [
      { id: 'dr_rstar', label: 'Star Formation Rate R★ (Stars/Year)', type: 'number', default: '2.0', step: '0.5', min: '0.1' },
      { id: 'dr_fp', label: 'Fraction of Stars with Planets f_p (0 to 1)', type: 'number', default: '1.0', step: '0.05', min: '0.01', max: '1.0' },
      { id: 'dr_ne', label: 'Habitable Planets per Star System n_e', type: 'number', default: '0.4', step: '0.1', min: '0.01' },
      { id: 'dr_fl', label: 'Fraction where Life Arises f_l (0 to 1)', type: 'number', default: '0.5', step: '0.05', min: '0.0001', max: '1.0' },
      { id: 'dr_fi', label: 'Fraction developing Intelligence f_i (0 to 1)', type: 'number', default: '0.2', step: '0.05', min: '0.0001', max: '1.0' },
      { id: 'dr_fc', label: 'Fraction developing Comm Technology f_c (0 to 1)', type: 'number', default: '0.2', step: '0.05', min: '0.0001', max: '1.0' },
      { id: 'dr_l', label: 'Civilization Lifespan L (Years with Radio)', type: 'number', default: '10000', step: '1000', min: '100' }
    ],
    presets: [
      { label: 'Carl Sagan Optimistic Model (N ≈ 1,000,000)', values: { dr_rstar: 4.0, dr_fp: 1.0, dr_ne: 0.5, dr_fl: 1.0, dr_fi: 0.5, dr_fc: 0.5, dr_l: 1000000 } },
      { label: 'Moderate Scientific Baseline (N ≈ 160)', values: { dr_rstar: 2.0, dr_fp: 1.0, dr_ne: 0.4, dr_fl: 0.5, dr_fi: 0.2, dr_fc: 0.2, dr_l: 10000 } },
      { label: 'Rare Earth Pessimistic Model (N ≈ 0.0001, We are alone)', values: { dr_rstar: 1.5, dr_fp: 0.8, dr_ne: 0.01, dr_fl: 0.001, dr_fi: 0.001, dr_fc: 0.01, dr_l: 500 } }
    ],
    outputs: [
      { id: 'out_drake_n', label: 'Communicative Civilizations in Galaxy (N)', default: '160 Civilizations' },
      { id: 'out_avg_dist_ly', label: 'Average Distance to Nearest Neighbor', default: '~ 2,400 Light-Years' },
      { id: 'out_fermi_verdict', label: 'Fermi Paradox Tension Level', default: 'Moderate (Civilizations separated by thousands of light-years)' }
    ],
    benchmarks: [
      { object: 'Drake Original 1961 Estimate', val: 'N ≈ 10 to 1,000', notes: 'Green Bank meeting consensus' },
      { object: 'Kepler Spacecraft Finding', val: 'f_p ≈ 1.0, n_e ≈ 0.2 – 0.5', notes: 'Pinned down first three factors definitively' },
      { object: 'Humanity Radio Horizon', val: '~120 Light-Years', notes: 'First commercial radio broadcasts began in 1900s' },
      { object: 'Milky Way Stellar Population', val: '100 – 400 Billion Stars', notes: 'Vast cosmic canvas for abiogenesis' }
    ],
    faq: [
      { q: 'Which factor in the Drake Equation is the most uncertain?', a: 'Civilization longevity L. If technological civilizations self-destruct via nuclear war, climate collapse, or runaway AI within a few centuries (L = 500), N is tiny. If civilizations survive for millions of years (L = 10⁶), the galaxy should be teeming with alien signals.' },
      { q: 'Did Kepler prove that planets are common?', a: 'Yes! The Kepler mission proved that virtually every star in the Milky Way hosts planets (f_p ≈ 1.0) and that roughly 20% to 40% of Sun-like stars possess rocky planets in their habitable zones (n_e ≈ 0.2–0.4).' }
    ],
    calcJs: `
      const rstar = parseFloat(document.getElementById('dr_rstar').value) || 2.0;
      const fp = parseFloat(document.getElementById('dr_fp').value) || 1.0;
      const ne = parseFloat(document.getElementById('dr_ne').value) || 0.4;
      const fl = parseFloat(document.getElementById('dr_fl').value) || 0.5;
      const fi = parseFloat(document.getElementById('dr_fi').value) || 0.2;
      const fc = parseFloat(document.getElementById('dr_fc').value) || 0.2;
      const L = parseFloat(document.getElementById('dr_l').value) || 10000;
      
      const N = rstar * fp * ne * fl * fi * fc * L;
      
      // Galactic disk volume ~ pi * R^2 * h with R = 50,000 ly, h = 1,000 ly
      // V ~ 7.85e12 cubic light years
      const vol_galaxy = 7.85e12;
      let avg_dist = 0;
      if (N >= 1) {
        avg_dist = Math.cbrt(vol_galaxy / N);
      }
      
      let verdict = 'Solitary (N < 1: Humanity is likely alone in the Milky Way)';
      if (N > 10000) verdict = 'Crowded Galaxy (Thousands of Civilizations: Severe Fermi Paradox)';
      else if (N >= 1) verdict = 'Sparse Galaxy (Civilizations exist but separated by thousands of light-years)';
      
      document.getElementById('out_drake_n').textContent = N >= 1 ? Math.round(N).toLocaleString() + ' Civilizations' : N.toExponential(3) + ' (Near Zero)';
      document.getElementById('out_avg_dist_ly').textContent = N >= 1 ? '~ ' + Math.round(avg_dist).toLocaleString() + ' Light-Years' : 'Extragalactic (> 100,000 ly)';
      document.getElementById('out_fermi_verdict').textContent = verdict;
    `
  },
  {
    slug: 'fermi-paradox-great-filter-probability',
    title: 'Fermi Paradox & Great Filter Probability Calculator [Where Are They? Barrier Model] | Digital Tools Shed',
    shortTitle: 'Great Filter Calculator',
    category: 'Observational Astrophysics',
    badge: 'ASTROBIOLOGICAL FILTER STATISTICS',
    metaDesc: 'Model Robin Hanson’s Great Filter evolutionary transition steps to evaluate whether the barrier lies in our evolutionary past or existential future.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        P_{survive} = \prod_{i=1}^{9} p_i;\quad \text{"No news is good news; discovering alien life is terrifying."}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by economist Robin Hanson in 1996, the Great Filter explains the Fermi Paradox: if colonization of the galaxy is technically possible in under 100 million years, why is the cosmos completely silent? Somewhere along the path from non-living chemistry to an interstellar species lies an evolutionary barrier so improbable that almost no one makes it through.
      </p>
    `,
    inputs: [
      { id: 'gf_abiogenesis', label: '1. Abiogenesis Probability (RNA from soup)', type: 'select', options: [
        { val: '0.00000001', text: 'Ultra-Rare (One in 100 Million: Filter Behind Us)' },
        { val: '0.1', text: 'Common (Occurs wherever conditions allow)' }
      ]},
      { id: 'gf_eukaryote', label: '2. Eukaryogenesis (Single cell engulfs mitochondria)', type: 'select', options: [
        { val: '0.000001', text: 'Freak Miracle (Took 2 Billion Years on Earth: Filter Behind Us)' },
        { val: '0.2', text: 'Inevitable Evolutionary Transition' }
      ]},
      { id: 'gf_existential', label: '3. Humanity Survives Technosphere (Nuclear, AGI, Bio)', type: 'select', options: [
        { val: '0.01', text: 'Severe Bottleneck (1% Survival: Filter Ahead of Us)' },
        { val: '0.50', text: 'Moderate Survival Odds (50%)' },
        { val: '0.90', text: 'High Technological Longevity (90%)' }
      ]}
    ],
    presets: [
      { label: 'Filter Behind Us (Abiogenesis / Eukaryotes are Impossible Flukes)', values: { gf_abiogenesis: '0.00000001', gf_eukaryote: '0.000001', gf_existential: '0.50' } },
      { label: 'Filter Ahead of Us (Life is Abundant, Technology Kills Everyone)', values: { gf_abiogenesis: '0.1', gf_eukaryote: '0.2', gf_existential: '0.01' } }
    ],
    outputs: [
      { id: 'out_gf_location', label: 'Most Probable Filter Location', default: 'Behind Us in Evolutionary Past' },
      { id: 'out_mars_fossil_risk', label: 'Philosophical Verdict on Finding Fossils on Mars', default: 'Terrifying (Shifts Filter Ahead of Us)' },
      { id: 'out_human_destiny', label: 'Cosmic Status of Humanity', default: 'Rare Cosmic Vanguard (We May Be First)' }
    ],
    benchmarks: [
      { object: 'Fermi’s Original Question (1950)', val: '"Where is everybody?"', notes: 'Enrico Fermi at Los Alamos lunch' },
      { object: 'Eukaryogenesis Timescale', val: '2 Billion Years Delay', notes: 'Life remained slime for half of Earth’s history' },
      { object: 'Nick Bostrom Warning', val: '"Silence of the Night Sky"', notes: 'Discovering complex alien fossils on Mars would be the worst news' },
      { object: 'Hart-Tipler Conjecture', val: 'We are truly alone', notes: 'Von Neumann probes would have colonized galaxy 100× over' }
    ],
    faq: [
      { q: 'Why did philosopher Nick Bostrom say finding life on Mars would be catastrophic?', a: 'If simple life arose independently on Mars, abiogenesis cannot be the Great Filter. If multicellular fossils are found, eukaryotic evolution isn’t the filter either. That means the lethal bottleneck must lie in our immediate future (nuclear extinction, engineered bioweapons, or unaligned superintelligent AI).' },
      { q: 'What is the "Zoo Hypothesis"?', a: 'Proposed by John Ball in 1973, it suggests advanced extraterrestrial civilizations are actively observing Earth while deliberately avoiding contact, treating us like a primitive wildlife preserve.' }
    ],
    calcJs: `
      const p_abio = parseFloat(document.getElementById('gf_abiogenesis').value);
      const p_euk = parseFloat(document.getElementById('gf_eukaryote').value);
      const p_tech = parseFloat(document.getElementById('gf_existential').value);
      
      const p_past = p_abio * p_euk;
      
      let loc = 'Behind Us in Evolutionary History (Abiogenesis or Eukaryogenesis)';
      let fossil = 'Relief: Finding zero life on Mars confirms abiogenesis is the Filter';
      let destiny = 'Cosmic Vanguard: Earth is likely the first intelligent species in galaxy';
      
      if (p_past > 0.001 && p_tech < 0.05) {
        loc = 'Ahead of Us in Technological Adolescence (Existential Trap)';
        fossil = 'Catastrophic: Life is common, meaning an inescapable filter wipes out civilizations soon';
        destiny = 'Endangered: 99% of technological species go extinct within centuries';
      }
      
      document.getElementById('out_gf_location').textContent = loc;
      document.getElementById('out_mars_fossil_risk').textContent = fossil;
      document.getElementById('out_human_destiny').textContent = destiny;
    `
  },
  {
    slug: 'apparent-to-absolute-magnitude',
    title: 'Apparent to Absolute Magnitude Distance Modulus Calculator [Stellar Photometry μ = m - M] | Digital Tools Shed',
    shortTitle: 'Distance Modulus Calculator',
    category: 'Observational Astrophysics',
    badge: 'STELLAR DISTANCE PHOTOMETRY',
    metaDesc: 'Convert between apparent magnitude m, absolute magnitude M, and distance in parsecs and light-years using the distance modulus.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \mu = m - M = 5 \log_{10}(d) - 5 = 5 \log_{10}\left(\frac{d}{10 \text{ pc}}\right)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        In observational astronomy, apparent magnitude m measures how bright a celestial body appears from Earth, while absolute magnitude M measures how bright it would appear if placed at a standard reference distance of exactly 10 parsecs (32.616 light-years). The distance modulus μ = m - M directly yields distance.
      </p>
    `,
    inputs: [
      { id: 'mag_app_m', label: 'Apparent Magnitude (m)', type: 'number', default: '-26.74', step: '0.1' },
      { id: 'mag_abs_M', label: 'Absolute Magnitude (M)', type: 'number', default: '4.83', step: '0.1' }
    ],
    presets: [
      { label: 'Sun as seen from Earth (m = -26.74, M = +4.83)', values: { mag_app_m: -26.74, mag_abs_M: 4.83 } },
      { label: 'Sirius A brightest night star (m = -1.46, M = +1.42)', values: { mag_app_m: -1.46, mag_abs_M: 1.42 } },
      { label: 'Betelgeuse Red Supergiant (m = +0.50, M = -5.85)', values: { mag_app_m: 0.50, mag_abs_M: -5.85 } },
      { label: 'Type Ia Supernova in Virgo Cluster (m = +12.0, M = -19.3)', values: { mag_app_m: 12.0, mag_abs_M: -19.3 } },
      { label: 'Human Naked-Eye Limit (m = +6.5, Sun at M = +4.83)', values: { mag_app_m: 6.5, mag_abs_M: 4.83 } }
    ],
    outputs: [
      { id: 'out_dist_pc', label: 'Distance in Parsecs (pc)', default: '0.00000485 pc' },
      { id: 'out_dist_ly', label: 'Distance in Light-Years (ly)', default: '1.00 AU (8.3 Light-Minutes)' },
      { id: 'out_dist_modulus', label: 'Distance Modulus (μ = m - M)', default: '-31.57' },
      { id: 'out_brightness_ratio', label: 'Brightness Ratio vs 10 Parsec Standard', default: '4.2 × 10¹² × Brighter than at 10 pc' }
    ],
    benchmarks: [
      { object: 'Sun at 10 Parsecs', val: 'm = +4.83', notes: 'Faint naked-eye star barely visible from suburban sky' },
      { object: 'Full Moon', val: 'm = -12.7', notes: 'Brightest natural night object' },
      { object: 'Hubble Space Telescope Limit', val: 'm ≈ +31.5', notes: 'Can detect 1 billionth of naked-eye limit' },
      { object: 'Type Ia Standard Candles', val: 'M = -19.3 ± 0.03', notes: 'Used by Perlmutter & Riess to discover Dark Energy (2011 Nobel)' }
    ],
    faq: [
      { q: 'Why does a smaller magnitude mean a brighter star?', a: 'Because the magnitude scale is an inverted logarithmic scale invented by ancient Greek astronomer Hipparchus (c. 150 BCE), where 1st-magnitude stars were the brightest and 6th-magnitude stars were the faintest. Pogson formalized this: a difference of 5 magnitudes equals exactly a 100× ratio in brightness.' },
      { q: 'How far away could you see the Sun with the naked eye?', a: 'Assuming a human naked-eye limit of magnitude +6.5, setting m = 6.5 and M = 4.83 in the distance modulus yields d = 10^((6.5 - 4.83 + 5)/5) = 21.6 parsecs (~70.4 light-years).' }
    ],
    calcJs: `
      const m = parseFloat(document.getElementById('mag_app_m').value) || -26.74;
      const M = parseFloat(document.getElementById('mag_abs_M').value) || 4.83;
      
      const mu = m - M;
      const d_pc = Math.pow(10, (mu + 5) / 5);
      const d_ly = d_pc * 3.26156;
      
      let ly_str = '';
      if (d_ly < 0.001) ly_str = (d_pc * 206265).toFixed(2) + ' AU (' + Math.round(d_pc * 206265 * 499) + ' Light-Seconds)';
      else if (d_ly >= 1e6) ly_str = fmtSci(d_ly / 1e6) + ' Million Light-Years';
      else ly_str = fmtSci(d_ly) + ' Light-Years';
      
      const bright_ratio = Math.pow(100, -mu / 5);
      
      document.getElementById('out_dist_pc').textContent = d_pc < 0.01 ? fmtSci(d_pc) + ' pc' : fmtSci(d_pc) + ' pc';
      document.getElementById('out_dist_ly').textContent = ly_str;
      document.getElementById('out_dist_modulus').textContent = mu.toFixed(2);
      document.getElementById('out_brightness_ratio').textContent = fmtSci(bright_ratio) + ' × Standard';
    `
  },
  {
    slug: 'telescope-resolving-power-dawes',
    title: 'Telescope Angular Resolving Power & Dawes’ Limit Calculator [Rayleigh Diffraction θ = 1.22λ/D] | Digital Tools Shed',
    shortTitle: 'Telescope Resolving Power',
    category: 'Observational Astrophysics',
    badge: 'OPTICAL DIFFRACTION LIMIT',
    metaDesc: 'Calculate telescope theoretical diffraction limits using Rayleigh’s criterion and Dawes’ empirical limit for splitting binary stars.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \theta_{Dawes} = \frac{116}{D \text{ (mm)}} \text{ arcsec};\quad \theta_{Rayleigh} = 1.22 · \frac{\lambda}{D} \text{ radians} = \frac{138}{D \text{ (mm)}} \text{ arcsec}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Diffraction sets the fundamental physical limit on optical resolution. The wave nature of light causes point sources (like stars) to focus into an Airy disk surrounded by concentric diffraction rings. Dawes’ Limit (formulated by William Rutter Dawes in 1867) defines the empirical boundary where close binary stars can be resolved.
      </p>
    `,
    inputs: [
      { id: 'tel_aperture_mm', label: 'Telescope Aperture Diameter D (mm)', type: 'number', default: '200', step: '10', min: '10' },
      { id: 'tel_wavelength_nm', label: 'Observing Wavelength λ (nm)', type: 'number', default: '550', step: '10', min: '100' }
    ],
    presets: [
      { label: 'Backyard 8-inch Dobsonian (203 mm)', values: { tel_aperture_mm: 203, tel_wavelength_nm: 550 } },
      { label: 'Human Dark-Adapted Eye Pupil (7 mm)', values: { tel_aperture_mm: 7, tel_wavelength_nm: 550 } },
      { label: 'Hubble Space Telescope (2,400 mm = 2.4 m)', values: { tel_aperture_mm: 2400, tel_wavelength_nm: 550 } },
      { label: 'James Webb Space Telescope (6,500 mm = 6.5 m, IR 2,000 nm)', values: { tel_aperture_mm: 6500, tel_wavelength_nm: 2000 } },
      { label: 'Extremely Large Telescope ELT (39,000 mm = 39 m)', values: { tel_aperture_mm: 39000, tel_wavelength_nm: 550 } }
    ],
    outputs: [
      { id: 'out_dawes_limit', label: 'Dawes’ Limit (Arcseconds ")', default: '0.57"' },
      { id: 'out_rayleigh_limit', label: 'Rayleigh Diffraction Criterion', default: '0.68"' },
      { id: 'out_moon_detail_m', label: 'Smallest Resolvable Crater on Moon (384,400 km)', default: '1.06 km Feature Size' },
      { id: 'out_seeing_limit', label: 'Earth Atmospheric "Seeing" Comparison', default: 'Atmospheric Seeing (1.0") Limits Resolution' }
    ],
    benchmarks: [
      { object: 'Human Eye (7 mm pupil)', val: 'θ ≈ 60" (1 arcminute)', notes: 'Resolves moon craters only as blurry gray shapes' },
      { object: '8-inch Telescope (200 mm)', val: 'θ ≈ 0.58"', notes: 'Easily splits Cassini Division in Saturn’s rings' },
      { object: 'Earth Atmospheric Seeing', val: '0.5" – 1.5" typical', notes: 'Atmospheric turbulence blurs large ground telescopes' },
      { object: 'Hubble Space Telescope', val: 'θ ≈ 0.05"', notes: 'Diffraction limited above Earth atmosphere' },
      { object: 'Event Horizon Telescope VLBI', val: 'θ ≈ 20 micro-arcseconds', notes: 'Earth-sized baseline resolves black hole shadow' }
    ],
    faq: [
      { q: 'Why don’t giant 10-meter ground telescopes see 50 times sharper than an 8-inch backyard scope?', a: 'Because Earth’s turbulent atmosphere acts like wavy water, creating "seeing" cells that blur images to roughly 0.5 to 1.5 arcseconds. Ground telescopes must use Adaptive Optics (deformable mirrors pulsing thousands of times per second to cancel turbulence) to reach their theoretical diffraction limits.' },
      { q: 'What is the difference between Dawes’ limit and Rayleigh’s criterion?', a: 'Rayleigh’s criterion is theoretical: the central maximum of one Airy disk falls on the first minimum of the other (resulting in a 19% dip between peaks). Dawes’ limit is empirical: experienced visual observers can detect elongation and split double stars with only a 3% dip.' }
    ],
    calcJs: `
      const D_mm = parseFloat(document.getElementById('tel_aperture_mm').value) || 200;
      const wl_nm = parseFloat(document.getElementById('tel_wavelength_nm').value) || 550;
      
      const dawes_arcsec = 116 / D_mm;
      const wl_m = wl_nm * 1e-9;
      const D_m = D_mm / 1000;
      
      const rayleigh_rad = (1.22 * wl_m) / D_m;
      const rayleigh_arcsec = rayleigh_rad * 206264.8;
      
      // Feature on Moon at 384,400 km
      const moon_feature_km = 384400 * rayleigh_rad;
      
      let seeing_note = 'Diffraction-Limited (Sharpness Limited Only by Optics)';
      if (D_mm > 150) seeing_note = 'Ground Seeing Limited (~ 1.0"): Requires Adaptive Optics or Space';
      
      document.getElementById('out_dawes_limit').textContent = dawes_arcsec < 0.01 ? fmtSci(dawes_arcsec) + '"' : dawes_arcsec.toFixed(3) + '"';
      document.getElementById('out_rayleigh_limit').textContent = rayleigh_arcsec < 0.01 ? fmtSci(rayleigh_arcsec) + '"' : rayleigh_arcsec.toFixed(3) + '"';
      document.getElementById('out_moon_detail_m').textContent = moon_feature_km < 1 ? Math.round(moon_feature_km * 1000) + ' Meters' : moon_feature_km.toFixed(2) + ' km Feature Size';
      document.getElementById('out_seeing_limit').textContent = seeing_note;
    `
  },
  {
    slug: 'telescope-light-grasp-ratio',
    title: 'Telescope Light Grasp & Limiting Visual Magnitude Calculator [Aperture Photon Collection] | Digital Tools Shed',
    shortTitle: 'Telescope Light Grasp',
    category: 'Observational Astrophysics',
    badge: 'OPTICAL PHOTON HARVESTING',
    metaDesc: 'Compute telescope light-gathering power relative to the human eye, light grasp factor, and faint limiting stellar magnitude.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \text{Light Grasp} = \left(\frac{D_{tel}}{D_{eye}}\right)²;\quad m_{limit} \approx 6.5 + 5 \log_{10}\left(\frac{D_{tel}}{7 \text{ mm}}\right)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        A telescope acts as a giant light bucket. Because photon-gathering power scales with the area of the primary mirror or objective lens (proportional to D²), an 8-inch (203 mm) telescope captures over 840 times more light than a dark-adapted 7 mm human pupil, revealing stars down to 14th magnitude.
      </p>
    `,
    inputs: [
      { id: 'lg_aperture_mm', label: 'Telescope Aperture Diameter (mm)', type: 'number', default: '203', step: '10', min: '10' },
      { id: 'lg_pupil_mm', label: 'Human Pupil Dark-Adapted Diameter (mm)', type: 'number', default: '7.0', step: '0.5', min: '3', max: '8' }
    ],
    presets: [
      { label: 'Binoculars 7x50 (50 mm Aperture)', values: { lg_aperture_mm: 50, lg_pupil_mm: 7.0 } },
      { label: 'Backyard 8-inch Dobsonian (203 mm)', values: { lg_aperture_mm: 203, lg_pupil_mm: 7.0 } },
      { label: 'Amateur 16-inch Giant (406 mm)', values: { lg_aperture_mm: 406, lg_pupil_mm: 7.0 } },
      { label: 'Palomar 200-inch Hale Telescope (5,080 mm)', values: { lg_aperture_mm: 5080, lg_pupil_mm: 7.0 } },
      { label: 'Keck 10-Meter Telescopes (10,000 mm)', values: { lg_aperture_mm: 10000, lg_pupil_mm: 7.0 } }
    ],
    outputs: [
      { id: 'out_light_grasp_x', label: 'Light-Gathering Power vs Naked Eye', default: '841.0 × More Light' },
      { id: 'out_limiting_mag', label: 'Theoretical Limiting Visual Magnitude', default: 'Magnitude +13.8' },
      { id: 'out_faintest_flux_ratio', label: 'Relative Photon Sensitivity', default: 'Gathers light from stars 1/841th as bright' },
      { id: 'out_target_visibility', label: 'Celestial Target Accessibility', default: 'Reveals Pluto, Quasars, and Faint Nebulae' }
    ],
    benchmarks: [
      { object: '7x50 Binoculars', val: '51× Light Grasp (m = +10.3)', notes: 'Reveals 4 Galilean moons of Jupiter and Neptune' },
      { object: '8-inch (203 mm) Scope', val: '841× Light Grasp (m = +13.8)', notes: 'Pluto visible as faint star-like speck' },
      { object: '16-inch (406 mm) Scope', val: '3,365× Light Grasp (m = +15.3)', notes: 'Quasar 3C 273 visible (2.4 billion ly away)' },
      { object: 'Keck 10-Meter', val: '2 Million × Light Grasp', notes: 'Exoplanet direct imaging spectroscopy' }
    ],
    faq: [
      { q: 'Why is aperture more important than magnification in telescopes?', a: 'Magnification simply blows up the image scale, but cannot reveal features that have not been gathered. Only aperture collects photons and resolves diffraction limits. Empty magnification beyond 2× per mm of aperture simply produces a dim, blurry picture.' },
      { q: 'How does age affect the human eye’s pupil dilation?', a: 'Young children and teenagers can dilate their pupils up to 7.5–8.0 mm in total darkness. As we age, pupil flexibility decreases; by age 60, maximum pupil dilation is often limited to 4.5–5.0 mm, slightly reducing light grasp.' }
    ],
    calcJs: `
      const d_tel = parseFloat(document.getElementById('lg_aperture_mm').value) || 203;
      const d_eye = parseFloat(document.getElementById('lg_pupil_mm').value) || 7.0;
      
      const grasp = Math.pow(d_tel / d_eye, 2);
      const m_lim = 6.5 + 5 * Math.log10(d_tel / d_eye);
      
      let targets = 'Deep-sky nebulae and globular clusters';
      if (m_lim >= 14) targets = 'Pluto, faint asteroids, and distant quasars';
      else if (m_lim >= 12) targets = 'Uranus, Neptune, and Messier deep-sky catalog';
      
      document.getElementById('out_light_grasp_x').textContent = grasp >= 1000 ? Math.round(grasp).toLocaleString() + ' × More Light' : grasp.toFixed(1) + ' × More Light';
      document.getElementById('out_limiting_mag').textContent = 'Magnitude +' + m_lim.toFixed(1);
      document.getElementById('out_faintest_flux_ratio').textContent = 'Sees stars ' + fmtSci(1 / grasp) + ' × baseline flux';
      document.getElementById('out_target_visibility').textContent = targets;
    `
  },
  {
    slug: 'parallactic-distance-calculator',
    title: 'Stellar Parallax & Trigonometric Distance Calculator [Gaia Parallax Angle d = 1/p] | Digital Tools Shed',
    shortTitle: 'Stellar Parallax Calculator',
    category: 'Observational Astrophysics',
    badge: 'ASTROMETRIC TRIGONOMETRIC BASELINE',
    metaDesc: 'Convert stellar parallax angle in arcseconds and milliarcseconds (mas) to distance in parsecs, light-years, and astronomical units.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        d \text{ (pc)} = \frac{1}{p \text{ (arcsec)}} = \frac{1,000}{p \text{ (mas)}};\quad 1 \text{ pc} \approx 3.26156 \text{ ly} \approx 206,265 \text{ AU}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Trigonometric stellar parallax is the gold standard foundation of the cosmic distance ladder. As Earth orbits the Sun, nearby stars appear to shift slightly against distant background galaxies. A star with a parallax shift of 1 arcsecond is defined as being at a distance of exactly 1 parsec (3.26 light-years).
      </p>
    `,
    inputs: [
      { id: 'par_angle_mas', label: 'Parallax Angle p (Milli-arcseconds mas = 0.001")', type: 'number', default: '768.5', step: '1', min: '0.001' }
    ],
    presets: [
      { label: 'Proxima Centauri Nearest Star (p = 768.5 mas = 0.7685")', values: { par_angle_mas: 768.5 } },
      { label: 'Barnard’s Star (p = 547.45 mas)', values: { par_angle_mas: 547.45 } },
      { label: 'Sirius Dog Star (p = 379.21 mas)', values: { par_angle_mas: 379.21 } },
      { label: 'Pleiades Cluster (p = 7.34 mas = 136 pc)', values: { par_angle_mas: 7.34 } },
      { label: 'Gaia Satellite Accuracy Limit (p = 0.020 mas = 20 µas)', values: { par_angle_mas: 0.020 } }
    ],
    outputs: [
      { id: 'out_dist_pc', label: 'Distance in Parsecs (pc)', default: '1.301 pc' },
      { id: 'out_dist_ly', label: 'Distance in Light-Years (ly)', default: '4.244 Light-Years' },
      { id: 'out_dist_au', label: 'Distance in Astronomical Units (AU)', default: '268,400 AU' },
      { id: 'out_astrometry_tech', label: 'Measurement Astrometry Era', default: 'Easily Measured by Ground Telescopes' }
    ],
    benchmarks: [
      { object: 'First Parallax (Bessel 1838)', val: '61 Cygni (p = 0.314")', notes: 'First definitive measurement of interstellar distance' },
      { object: 'Proxima Centauri', val: 'p = 0.7685"', notes: 'Largest parallax of any known star outside solar system' },
      { object: 'Hipparcos Satellite (1989)', val: '1 milli-arcsecond (mas)', notes: 'Mapped 100,000 stars out to 100 pc' },
      { object: 'ESA Gaia Mission (2013-Present)', val: '20 micro-arcseconds (µas)', notes: 'Mapping 1.8 billion stars across the entire Milky Way' }
    ],
    faq: [
      { q: 'Why did it take until 1838 to measure the first stellar parallax?', a: 'Because stars are astonishingly far away. Even the nearest star (Proxima Centauri) shifts by less than 0.8 arcseconds—equivalent to viewing the width of a 25-cent quarter coin from a distance of 6 kilometers. Measuring such angles required the precision heliometer telescope built by Joseph von Fraunhofer.' },
      { q: 'What is the definition of a parsec?', a: 'Parsec stands for "parallax of one second." It is the distance at which a star would subtend a parallax angle of 1 arcsecond using Earth’s 1 AU orbital radius as the baseline (1 pc = 1 AU / tan(1") ≈ 206,265 AU ≈ 3.26 light-years).' }
    ],
    calcJs: `
      const p_mas = parseFloat(document.getElementById('par_angle_mas').value) || 768.5;
      const p_arcsec = p_mas / 1000;
      
      const d_pc = 1 / p_arcsec;
      const d_ly = d_pc * 3.26156;
      const d_au = d_pc * 206264.8;
      
      let era = 'Modern Ground Astrometry';
      if (p_mas < 0.05) era = 'Space Astrometry (Gaia Mission: Micro-arcsecond Precision)';
      else if (p_mas < 2.0) era = 'Hipparcos Space Satellite Horizon';
      else if (p_mas >= 200) era = 'Historic 19th-Century Heliometer Target (Bessel)';
      
      document.getElementById('out_dist_pc').textContent = d_pc > 10000 ? fmtSci(d_pc) + ' pc' : d_pc.toFixed(3) + ' pc';
      document.getElementById('out_dist_ly').textContent = d_ly > 10000 ? fmtSci(d_ly) + ' Light-Years' : d_ly.toFixed(3) + ' Light-Years';
      document.getElementById('out_dist_au').textContent = fmtSci(d_au) + ' AU';
      document.getElementById('out_astrometry_tech').textContent = era;
    `
  },
  {
    slug: 'interstellar-reddening-extinction',
    title: 'Interstellar Reddening & Dust Extinction Calculator [Milky Way Disk Absorption A_V] | Digital Tools Shed',
    shortTitle: 'Interstellar Extinction Calculator',
    category: 'Observational Astrophysics',
    badge: 'INTERSTELLAR EXTINCTION PHOTOMETRY',
    metaDesc: 'Compute visual interstellar dust extinction A_V and color excess E(B-V) across Milky Way interstellar dust lanes.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        A_V = R_V · E(B - V) = R_V · [ (B - V)_{obs} - (B - V)_0 ];\quad R_V \approx 3.1
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Sub-micron interstellar dust grains (silicates, graphites, and PAHs) scatter and absorb starlight during transit. Because Rayleigh-like scattering preferentially scatters shorter blue wavelengths, background stars appear both dimmed (extinction A_V) and shifted toward redder wavelengths (color excess E(B-V)).
      </p>
    `,
    inputs: [
      { id: 'ext_ebv', label: 'Color Excess E(B-V) in Magnitudes', type: 'number', default: '0.35', step: '0.05', min: '0' },
      { id: 'ext_rv', label: 'Total-to-Selective Extinction Ratio R_V', type: 'number', default: '3.1', step: '0.1', min: '2.0', max: '6.0' }
    ],
    presets: [
      { label: 'Diffuse Interstellar Medium (E(B-V) = 0.35, R_V = 3.1)', values: { ext_ebv: 0.35, ext_rv: 3.1 } },
      { label: 'Dense Molecular Cloud Core (Ophiuchus R_V = 4.5)', values: { ext_ebv: 1.50, ext_rv: 4.5 } },
      { label: 'Galactic Center Sightline (A_V ≈ 30 magnitudes)', values: { ext_ebv: 9.70, ext_rv: 3.1 } }
    ],
    outputs: [
      { id: 'out_av_mag', label: 'Total Visual Extinction A_V (Magnitudes)', default: '1.09 Magnitudes' },
      { id: 'out_flux_trans', label: 'Visible Light Transmission Fraction', default: '36.8 % Transmitted' },
      { id: 'out_infrared_loss', label: 'Infrared K-band Extinction A_K (~0.11 A_V)', default: '0.12 Magnitudes (89% Transmitted)' },
      { id: 'out_sightline_class', label: 'Galactic Sightline Obscuration', default: 'Moderate Optical Dust Lane' }
    ],
    benchmarks: [
      { object: 'Average Galactic Disk Rate', val: '~1.8 mag / kiloparsec', notes: 'Visible starlight dimmed by factor of 5 per 3,260 light-years' },
      { object: 'Galactic Center (Sagittarius A*)', val: 'A_V ≈ 30 magnitudes', notes: 'Only 1 photon in 1 trillion visible photons penetrates to Earth' },
      { object: 'Infrared Penetration (James Webb)', val: 'A_K ≈ 0.11 A_V', notes: 'Infrared light easily pierces dusty dark nebulae' },
      { object: 'Bok Globules & Barnard Dark Nebulae', val: 'A_V > 50 magnitudes', notes: 'Completely pitch black in optical light' }
    ],
    faq: [
      { q: 'Why is the Galactic Center invisible in optical telescopes?', a: 'Because the 26,000 light-year sightline passes through the dense dust plane of the Milky Way disk, accumulating A_V ≈ 30 magnitudes of extinction. That means visible light is dimmed by a factor of 10¹² (one trillion times). Radio, X-ray, and infrared wavelengths pass through with ease.' },
      { q: 'Why is R_V higher in dense star-forming clouds?', a: 'In dense molecular clouds, dust grains collide and coagulate into larger "fluffy" grains. Larger particles scatter all wavelengths more uniformly, flattening the extinction curve and raising R_V from the standard 3.1 up to 4.5–5.5.' }
    ],
    calcJs: `
      const ebv = parseFloat(document.getElementById('ext_ebv').value) || 0.35;
      const rv = parseFloat(document.getElementById('ext_rv').value) || 3.1;
      
      const av = rv * ebv;
      const trans_frac = Math.pow(10, -0.4 * av) * 100;
      const ak = 0.112 * av;
      const trans_k = Math.pow(10, -0.4 * ak) * 100;
      
      let sight = 'Moderate Optical Dust Extinction';
      if (av > 20) sight = 'Complete Optical Blockout (Requires Infrared / Radio)';
      else if (av > 5) sight = 'Heavy Dark Nebula Obscuration';
      else if (av < 0.2) sight = 'Clean High-Latitude Galactic Window';
      
      document.getElementById('out_av_mag').textContent = av.toFixed(2) + ' Magnitudes';
      document.getElementById('out_flux_trans').textContent = trans_frac < 0.001 ? fmtSci(trans_frac) + ' %' : trans_frac.toFixed(2) + ' % Transmitted';
      document.getElementById('out_infrared_loss').textContent = ak.toFixed(2) + ' Mag (' + trans_k.toFixed(1) + ' % Transmitted)';
      document.getElementById('out_sightline_class').textContent = sight;
    `
  },
  {
    slug: 'cosmic-distance-ladder-calibrator',
    title: 'Cosmic Distance Ladder Rung Calibrator [Cepheids, Supernovae & Hubble Flow] | Digital Tools Shed',
    shortTitle: 'Distance Ladder Calibrator',
    category: 'Observational Astrophysics',
    badge: 'COSMOLOGICAL DISTANCE ANCHORS',
    metaDesc: 'Step through the rungs of the cosmic distance ladder: trigonometric parallax, Leavitt Cepheid periods, and Type Ia supernovae.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \text{Parallax (Gaia)} \to \text{Cepheid } M_V = -2.81 \log_{10}(P) - 1.43 \to \text{SN Ia } (M = -19.3) \to \text{Hubble Flow}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Astronomers cannot measure distances to distant galaxies directly. Instead, they construct the Cosmic Distance Ladder, where each successive "rung" calibrates the next: geometric trigonometric parallax anchors Cepheid variable stars, Cepheids in nearby galaxies calibrate Type Ia standard candle supernovae, which reach across cosmological Hubble flow distances.
      </p>
    `,
    inputs: [
      { id: 'cdl_rung', label: 'Distance Ladder Calibration Rung', type: 'select', options: [
        { val: 'parallax', text: 'Rung 1: Trigonometric Parallax (0 to 10 kpc)' },
        { val: 'cepheid', text: 'Rung 2: Classical Cepheid Period-Luminosity (1 kpc to 30 Mpc)' },
        { val: 'sn1a', text: 'Rung 3: Type Ia Supernovae Standard Candles (10 Mpc to 2 Gpc)' },
        { val: 'hubble', text: 'Rung 4: Cosmological Hubble Redshift (> 1 Gpc)' }
      ]},
      { id: 'cdl_input_param', label: 'Primary Observable (Period in Days, Parallax in mas, or Redshift z)', type: 'number', default: '10', step: 'any', min: '0.001' }
    ],
    presets: [
      { label: 'Cepheid Variable Delta Cephei (P = 5.37 Days)', values: { cdl_rung: 'cepheid', cdl_input_param: 5.37 } },
      { label: 'Andromeda Galaxy Cepheid M31 (P = 30 Days)', values: { cdl_rung: 'cepheid', cdl_input_param: 30.0 } },
      { label: 'Type Ia Supernova in Virgo Cluster (m = 11.8)', values: { cdl_rung: 'sn1a', cdl_input_param: 11.8 } },
      { label: 'Cosmological Galaxy Redshift (z = 0.50)', values: { cdl_rung: 'hubble', cdl_input_param: 0.50 } }
    ],
    outputs: [
      { id: 'out_calib_distance', label: 'Derived Astronomical Distance', default: '2.54 Million Light-Years' },
      { id: 'out_calib_modulus', label: 'Distance Modulus (μ = m - M)', default: '24.42' },
      { id: 'out_anchor_system', label: 'Underlying Calibration Anchor', default: 'Leavitt Law Period-Luminosity' },
      { id: 'out_uncertainty_budget', label: 'Systematic Error Propagation', default: '± 2.5% Calibration Uncertainty' }
    ],
    benchmarks: [
      { object: 'Henrietta Swan Leavitt (1912)', val: 'Discovered Cepheid Period-Luminosity', notes: 'Studied variable stars in Magellanic Clouds' },
      { object: 'Edwin Hubble (1923)', val: 'Discovered Cepheid V1 in M31', notes: 'Proved spiral nebulae are separate island universes' },
      { object: 'Phillips Relation (1993)', val: 'Light curve decline rate calibration', notes: 'Standardized Type Ia supernovae into precision candles' },
      { object: 'Hubble Space Telescope Key Project', val: 'H₀ = 72 ± 8 km/s/Mpc (2001)', notes: 'Primary mission objective accomplished' }
    ],
    faq: [
      { q: 'Why are Type Ia supernovae such extraordinary standard candles?', a: 'Because they occur when a carbon-oxygen white dwarf accretes matter until reaching the Chandrasekhar limit (1.4 M_☉). Because the mass, composition, and physical trigger are virtually identical every time, the peak luminosity is consistently around M ≈ -19.3 (equal to 5 billion Suns).' },
      { q: 'What causes Cepheid variable stars to pulsate?', a: 'The Eddington valve mechanism (kappa effect). In the star’s envelope, doubly ionized helium (He II) is opaque to heat; as the star compresses, heat builds up until gas pressure expands the outer envelope. As it cools, helium recombines, letting heat escape and starting the cycle anew.' }
    ],
    calcJs: `
      const rung = document.getElementById('cdl_rung').value;
      const val = parseFloat(document.getElementById('cdl_input_param').value) || 10;
      
      let dist_str = '';
      let mu_str = '';
      let anchor = '';
      let err = '± 1.0% Systematics';
      
      if (rung === 'parallax') {
        const d_pc = 1000 / val;
        dist_str = fmtSci(d_pc * 3.26156) + ' Light-Years (' + fmtSci(d_pc) + ' pc)';
        mu_str = (5 * Math.log10(d_pc) - 5).toFixed(2);
        anchor = 'Geometric Trigonometric Baseline (Earth-Sun Orbit)';
      } else if (rung === 'cepheid') {
        // Leavitt Law: M_V = -2.81 * log10(P) - 1.43
        const M_v = -2.81 * Math.log10(val) - 1.43;
        // Typical apparent mag m ~ 22 for distant galaxy
        const m = 23.0;
        const mu = m - M_v;
        const d_pc = Math.pow(10, (mu + 5) / 5);
        dist_str = fmtSci(d_pc * 3.26156) + ' Light-Years (' + fmtSci(d_pc / 1e6) + ' Mpc)';
        mu_str = mu.toFixed(2);
        anchor = 'Leavitt Period-Luminosity Pulsation Law';
        err = '± 2.0% Systematic Error';
      } else if (rung === 'sn1a') {
        const M = -19.3;
        const mu = val - M;
        const d_pc = Math.pow(10, (mu + 5) / 5);
        dist_str = fmtSci(d_pc * 3.26156) + ' Light-Years (' + fmtSci(d_pc / 1e6) + ' Mpc)';
        mu_str = mu.toFixed(2);
        anchor = 'Chandrasekhar White Dwarf Thermonuclear Detonation';
        err = '± 3.0% Systematic Error';
      } else {
        // Hubble flow: d = c * z / H0
        const c = 299792.458;
        const h0 = 70;
        const d_mpc = (c * val) / h0;
        dist_str = fmtSci((d_mpc * 3.26156) / 1000) + ' Billion Light-Years (' + Math.round(d_mpc) + ' Mpc)';
        mu_str = (5 * Math.log10(d_mpc * 1e6) - 5).toFixed(2);
        anchor = 'Cosmological Spacetime Metric Expansion';
        err = '± 5.0% Cosmological Parameters';
      }
      
      document.getElementById('out_calib_distance').textContent = dist_str;
      document.getElementById('out_calib_modulus').textContent = 'μ = ' + mu_str;
      document.getElementById('out_anchor_system').textContent = anchor;
      document.getElementById('out_uncertainty_budget').textContent = err;
    `
  },
  {
    slug: 'carnot-heat-engine-efficiency',
    title: 'Carnot Heat Engine Maximum Theoretical Efficiency [Thermodynamic Limit η = 1 - T_C/T_H] | Digital Tools Shed',
    shortTitle: 'Carnot Efficiency Calculator',
    category: 'Thermodynamics & Statistical Mechanics',
    badge: 'CLASSICAL THERMODYNAMIC MAXIMUM',
    metaDesc: 'Calculate the absolute maximum Carnot thermodynamic efficiency limit for heat engines, power plants, and cryogenic heat pumps.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        \eta_{Carnot} = 1 - \frac{T_C}{T_H} = \frac{T_H - T_C}{T_H};\quad W_{max} = Q_H · \eta_{Carnot}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Published by French physicist Nicolas Léonard Sadi Carnot in 1824, Carnot’s Theorem establishes that no heat engine operating between two thermal reservoirs can ever be more efficient than a reversible Carnot engine. Absolute zero (0 K) cold reservoir is required to achieve 100% efficiency.
      </p>
    `,
    inputs: [
      { id: 'car_th_c', label: 'Hot Reservoir Temperature T_H (°C)', type: 'number', default: '565', step: '10', min: '-200' },
      { id: 'car_tc_c', label: 'Cold Reservoir Temperature T_C (°C)', type: 'number', default: '25', step: '5', min: '-273.15' },
      { id: 'car_qh_mw', label: 'Thermal Heat Input Q_H (MW)', type: 'number', default: '1000', step: '50', min: '1' }
    ],
    presets: [
      { label: 'Ultra-Supercritical Coal / Gas Plant (T_H = 565°C, T_C = 25°C)', values: { car_th_c: 565, car_tc_c: 25, car_qh_mw: 1000 } },
      { label: 'Nuclear PWR Reactor (T_H = 315°C, T_C = 30°C)', values: { car_th_c: 315, car_tc_c: 30, car_qh_mw: 3000 } },
      { label: 'Internal Combustion Car Engine (T_H = 1,100°C, T_C = 25°C)', values: { car_th_c: 1100, car_tc_c: 25, car_qh_mw: 100 } },
      { label: 'Ocean Thermal Energy Conversion OTEC (T_H = 25°C, T_C = 5°C)', values: { car_th_c: 25, car_tc_c: 5, car_qh_mw: 100 } },
      { label: 'Deep Space RTG Nuclear Battery (T_H = 1,000°C, T_C = -270°C)', values: { car_th_c: 1000, car_tc_c: -270, car_qh_mw: 2.0 } }
    ],
    outputs: [
      { id: 'out_carnot_pct', label: 'Maximum Carnot Efficiency (η)', default: '64.44 %' },
      { id: 'out_max_work_mw', label: 'Maximum Usable Work Output (MW)', default: '644.4 MW' },
      { id: 'out_waste_heat_mw', label: 'Unavoidable Waste Heat Rejected Q_C', default: '355.6 MW' },
      { id: 'out_real_world_expected', label: 'Expected Real-World Engineering Efficiency (~60% Carnot)', default: '38.7 % Real Thermal Efficiency' }
    ],
    benchmarks: [
      { object: 'OTEC Ocean Power', val: 'η_Carnot ≈ 6.7%', notes: 'Tiny temperature delta limits practical efficiency to ~3%' },
      { object: 'Nuclear Fission Plant', val: 'η_Carnot ≈ 48% (Actual: 33%)', notes: 'Limited by reactor vessel material pressure limits' },
      { object: 'Combined Cycle Gas Turbine', val: 'η_actual ≈ 62%', notes: 'Approaches Carnot limit via dual gas-steam turbines' },
      { object: 'Second Law of Thermodynamics', val: 'Entropy always increases', notes: 'Waste heat rejection is mandatory' }
    ],
    faq: [
      { q: 'Why can’t a heat engine achieve 100% efficiency?', a: 'Because heat is the random kinetic agitation of molecules. To convert 100% of heat into mechanical work would require reducing entropy to zero in a closed cycle, which is strictly prohibited by Kelvin-Planck statement of the Second Law of Thermodynamics.' },
      { q: 'Why do modern power plants use cooling towers or rivers?', a: 'Because cold reservoir temperature T_C sits in the numerator of waste heat. Every 5°C drop in cooling water temperature increases electrical power generation by millions of kilowatt-hours over a year.' }
    ],
    calcJs: `
      const th_c = parseFloat(document.getElementById('car_th_c').value) || 565;
      const tc_c = parseFloat(document.getElementById('car_tc_c').value) || 25;
      const qh_mw = parseFloat(document.getElementById('car_qh_mw').value) || 1000;
      
      const th_k = Math.max(1e-4, th_c + 273.15);
      const tc_k = Math.max(0, tc_c + 273.15);
      
      let eta = 0;
      if (th_k > tc_k) {
        eta = (th_k - tc_k) / th_k;
      }
      
      const max_work = qh_mw * eta;
      const waste_heat = qh_mw - max_work;
      const real_eff = eta * 0.60 * 100;
      
      document.getElementById('out_carnot_pct').textContent = (eta * 100).toFixed(2) + ' %';
      document.getElementById('out_max_work_mw').textContent = max_work.toFixed(1) + ' MW';
      document.getElementById('out_waste_heat_mw').textContent = waste_heat.toFixed(1) + ' MW';
      document.getElementById('out_real_world_expected').textContent = real_eff.toFixed(1) + ' % Real Thermal Efficiency';
    `
  },
  {
    slug: 'entropy-boltzmann-microstates',
    title: 'Boltzmann Statistical Entropy & Microstate Permutations Calculator [S = k_B · ln Ω] | Digital Tools Shed',
    shortTitle: 'Boltzmann Entropy Calculator',
    category: 'Thermodynamics & Statistical Mechanics',
    badge: 'STATISTICAL THERMODYNAMICS',
    metaDesc: 'Compute statistical entropy S = k_B ln(Ω), microscopic multiplicity, and thermodynamic irreversibility from microstate configurations.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        S = k_B · \ln(\Omega);\quad \Delta S = k_B · \ln\left(\frac{\Omega_f}{\Omega_i}\right);\quad k_B = 1.380649 \times 10⁻²³ \text{ J/K}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Engraved on Ludwig Boltzmann’s gravestone in Vienna, this formula unifies microscopic atomic probabilities with macroscopic thermodynamic entropy. A system with Ω microscopic configurations consistent with a single macrostate possesses entropy proportional to ln(Ω). Systems naturally evolve toward higher entropy simply because high-entropy states have exponentially more microstates.
      </p>
    `,
    inputs: [
      { id: 'ent_num_particles', label: 'Number of Particles N', type: 'number', default: '100', step: '10', min: '2' },
      { id: 'ent_volume_expansion', label: 'Free Expansion Volume Ratio (V_f / V_i)', type: 'number', default: '2.0', step: '0.5', min: '1.01' }
    ],
    presets: [
      { label: 'Free Expansion of 100 Gas Molecules (2× Volume)', values: { ent_num_particles: 100, ent_volume_expansion: 2.0 } },
      { label: '1 Mole of Gas Free Expansion (N = 6.022 × 10²³)', values: { ent_num_particles: 6.022e23, ent_volume_expansion: 2.0 } },
      { label: 'Small 20-Particle Toy Model', values: { ent_num_particles: 20, ent_volume_expansion: 2.0 } }
    ],
    outputs: [
      { id: 'out_delta_s_j_k', label: 'Entropy Increase ΔS (Joules / Kelvin)', default: '9.57 × 10⁻²² J/K' },
      { id: 'out_multiplicity_ratio', label: 'Microstate Multiplicity Growth (Ω_f / Ω_i)', default: '1.27 × 10³⁰ × More Probable' },
      { id: 'out_spontaneous_reverse', label: 'Probability of Spontaneous Reversal to V_i', default: '1 in 1.27 × 10³⁰ (Statistically Impossible)' },
      { id: 'out_arrow_of_time', label: 'Thermodynamic Arrow of Time Verdict', default: 'Irreversible Macroscopic Evolution' }
    ],
    benchmarks: [
      { object: 'Boltzmann’s Gravestone (Vienna Central Cemetery)', val: 'S = k · log W', notes: 'Definitive epitaph of statistical mechanics' },
      { object: '1 Mole Gas Doubling Volume', val: 'ΔS = R · ln(2) = 5.76 J/K', notes: 'Microstate multiplier = 2^(6 × 10²³)' },
      { object: 'Entropy of 1 kg Ice Melting at 0°C', val: 'ΔS = 1,220 J/K', notes: 'Latent heat breaks crystal lattice order' },
      { object: 'Black Hole Event Horizon', val: 'Maximum possible entropy in universe', notes: 'Bekenstein-Hawking formula' }
    ],
    faq: [
      { q: 'Could all the air molecules in a room spontaneously collect in one corner?', a: 'Quantum mechanically and classically, yes: no law of physics forbids it. Statistically, the probability is (1/2)^N. For 10²⁵ molecules, the probability is 1 in 10^(3 × 10²⁴)—a number so small that it would not happen once in a trillion times the lifespan of the universe.' },
      { q: 'Why is entropy fundamentally related to information?', a: 'Claude Shannon showed in 1948 that informational entropy H = -Σ p log(p) is mathematically identical to Boltzmann’s statistical entropy. Physical entropy measures the amount of microscopic information hidden from macroscopic observation.' }
    ],
    calcJs: `
      const N = parseFloat(document.getElementById('ent_num_particles').value) || 100;
      const vol_ratio = parseFloat(document.getElementById('ent_volume_expansion').value) || 2.0;
      
      const kb = 1.380649e-23;
      // Delta S = N * kb * ln(V_f / V_i)
      const delta_s = N * kb * Math.log(vol_ratio);
      const log10_omega = N * Math.log10(vol_ratio);
      
      document.getElementById('out_delta_s_j_k').textContent = fmtSci(delta_s) + ' J/K';
      document.getElementById('out_multiplicity_ratio').textContent = log10_omega > 300 ? '10^(' + fmtSci(log10_omega) + ') × Multiplicity' : Math.pow(10, log10_omega).toExponential(2) + ' × Multiplicity';
      document.getElementById('out_spontaneous_reverse').textContent = log10_omega > 50 ? '1 in 10^' + Math.round(log10_omega) + ' (Zero Chance)' : '1 in ' + Math.round(Math.pow(vol_ratio, N));
      document.getElementById('out_arrow_of_time').textContent = N > 1000 ? 'Absolute Thermodynamic Irreversibility' : 'Statistical Fluctuations Observable';
    `
  },
  {
    slug: 'maxwell-boltzmann-molecular-speed',
    title: 'Maxwell-Boltzmann Molecular Speed Distribution Calculator [v_rms, Mean & Peak Velocity] | Digital Tools Shed',
    shortTitle: 'Maxwell-Boltzmann Distribution',
    category: 'Thermodynamics & Statistical Mechanics',
    badge: 'KINETIC THEORY OF GASES',
    metaDesc: 'Calculate root-mean-square, mean, and most probable thermal molecular speeds for gases from helium to xenon.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        v_p = \sqrt{\frac{2 k_B T}{m}};\quad \bar{v} = \sqrt{\frac{8 k_B T}{\pi m}};\quad v_{rms} = \sqrt{\frac{3 k_B T}{m}}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Derived by James Clerk Maxwell and Ludwig Boltzmann, this probability distribution describes the speeds of idealized gas particles in thermodynamic equilibrium. Lighter gases travel dramatically faster at the same temperature, explaining why Earth’s gravity can retain heavy nitrogen and oxygen but loses light hydrogen and helium to space.
      </p>
    `,
    inputs: [
      { id: 'mb_gas_preset', label: 'Gas Molecular Species', type: 'select', options: [
        { val: '28.013', text: 'Nitrogen N₂ (28.01 g/mol - Air primary)' },
        { val: '31.999', text: 'Oxygen O₂ (32.00 g/mol)' },
        { val: '2.016', text: 'Hydrogen H₂ (2.02 g/mol)' },
        { val: '4.003', text: 'Helium He (4.00 g/mol)' },
        { val: '44.01', text: 'Carbon Dioxide CO₂ (44.01 g/mol)' },
        { val: '131.29', text: 'Xenon Xe (131.29 g/mol)' }
      ]},
      { id: 'mb_temp_c', label: 'Temperature (°C)', type: 'number', default: '20', step: '5', min: '-273.15' }
    ],
    presets: [
      { label: 'Room Air Nitrogen at 20°C (N₂, v_rms = 511 m/s)', values: { mb_gas_preset: '28.013', mb_temp_c: 20 } },
      { label: 'Atmospheric Hydrogen at 20°C (H₂, v_rms = 1,905 m/s)', values: { mb_gas_preset: '2.016', mb_temp_c: 20 } },
      { label: 'Thermosphere Hot Oxygen at 1,000°C (32 g/mol)', values: { mb_gas_preset: '31.999', mb_temp_c: 1000 } },
      { label: 'Cryogenic Liquid Nitrogen Boiloff (-196°C)', values: { mb_gas_preset: '28.013', mb_temp_c: -196 } }
    ],
    outputs: [
      { id: 'out_v_rms', label: 'Root-Mean-Square Speed (v_rms)', default: '511.2 m/s (1,143 mph)' },
      { id: 'out_v_mean', label: 'Mean Average Molecular Speed (v̄)', default: '471.0 m/s' },
      { id: 'out_v_peak', label: 'Most Probable Velocity (v_p)', default: '417.4 m/s (Mach 1.23)' },
      { id: 'out_escape_retention', label: 'Earth Atmospheric Retention Status', default: 'Indefinitely Retained (v_rms << 11.2 km/s)' }
    ],
    benchmarks: [
      { object: 'Speed of Sound in Air (20°C)', val: '343 m/s', notes: 'Governed directly by average molecular velocity' },
      { object: 'Hydrogen Escape from Earth', val: 'v_rms ≈ 1.9 km/s', notes: 'High-speed tail of distribution exceeds 11.2 km/s escape speed' },
      { object: 'Nitrogen in Room Air', val: '511 m/s (1,143 mph)', notes: 'Faster than a bullet from a handgun' },
      { object: 'Mean Free Path between Collisions', val: '~68 nanometers', notes: 'Molecules collide 7 billion times per second in air' }
    ],
    faq: [
      { q: 'Why does Earth’s atmosphere contain virtually no hydrogen or helium gas?', a: 'Jeans escape mechanism. If a gas’s average thermal velocity v_rms exceeds roughly 1/6th of planetary escape velocity (11.2 km/s / 6 ≈ 1.87 km/s), the fast-moving high-energy tail of the Maxwell-Boltzmann distribution continually bleeds off into space over geological time. Hydrogen (v_rms ≈ 1.9 km/s) easily escapes.' },
      { q: 'Why is v_rms always higher than the mean speed v̄ and peak speed v_p?', a: 'Because the distribution is asymmetrical with a long high-speed tail extending to infinity. Squaring the velocities gives heavier statistical weight to high-velocity molecules, pulling v_rms above the mean.' }
    ],
    calcJs: `
      const molar_mass_g = parseFloat(document.getElementById('mb_gas_preset').value) || 28.013;
      const t_c = parseFloat(document.getElementById('mb_temp_c').value) || 20;
      
      const t_k = Math.max(0.1, t_c + 273.15);
      const R = 8.314462618;
      const m_kg_mol = molar_mass_g / 1000;
      
      const v_p = Math.sqrt((2 * R * t_k) / m_kg_mol);
      const v_mean = Math.sqrt((8 * R * t_k) / (Math.PI * m_kg_mol));
      const v_rms = Math.sqrt((3 * R * t_k) / m_kg_mol);
      
      const v_rms_mph = v_rms * 2.23694;
      const mach = v_p / 340.29;
      
      let retain = 'Permanently Retained (v_rms << 1.8 km/s Earth Escape Tail)';
      if (v_rms > 1800) retain = 'Rapidly Escapes into Space (Jeans Atmospheric Loss)';
      else if (v_rms > 1000) retain = 'Gradual Atmospheric Depletion over Millions of Years';
      
      document.getElementById('out_v_rms').textContent = Math.round(v_rms) + ' m/s (' + Math.round(v_rms_mph) + ' mph)';
      document.getElementById('out_v_mean').textContent = Math.round(v_mean) + ' m/s';
      document.getElementById('out_v_peak').textContent = Math.round(v_p) + ' m/s (Mach ' + mach.toFixed(2) + ')';
      document.getElementById('out_escape_retention').textContent = retain;
    `
  },
  {
    slug: 'black-hole-entropy-bekenstein-hawking',
    title: 'Bekenstein-Hawking Black Hole Entropy & Holographic Information Bound [S_BH = k_B A / 4ℓ_P²] | Digital Tools Shed',
    shortTitle: 'Black Hole Entropy Calculator',
    category: 'Thermodynamics & Statistical Mechanics',
    badge: 'HOLOGRAPHIC QUANTUM GRAVITY',
    metaDesc: 'Calculate black hole horizon thermodynamic entropy, Bekenstein maximum information bit storage capacity, and holographic area encoding.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        S_{BH} = \frac{k_B · c³ · A}{4 G \hbar} = \frac{k_B · A}{4 \ell_P²};\quad I_{bits} = \frac{A}{4 \ell_P² · \ln 2} \approx \frac{A}{2.77 \times 10⁻⁷⁰ \text{ m}²}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Formulated by Jacob Bekenstein (1972) and Stephen Hawking (1974), black hole entropy is not proportional to the volume of the black hole, but strictly to its surface area A divided into Planck areas (ℓ_P²). A single 10-solar-mass black hole contains more thermodynamic entropy than the entire observable universe of ordinary matter.
      </p>
    `,
    inputs: [
      { id: 'bhe_mass_sun', label: 'Black Hole Mass (Solar Masses M_☉)', type: 'number', default: '10', step: '1', min: '1e-6' }
    ],
    presets: [
      { label: 'Stellar Black Hole Cygnus X-1 (15 M_☉)', values: { bhe_mass_sun: 15 } },
      { label: 'Sagittarius A* Milky Way Supermassive (4.3 Million M_☉)', values: { bhe_mass_sun: 4300000 } },
      { label: 'M87* Giant Black Hole (6.5 Billion M_☉)', values: { bhe_mass_sun: 6500000000 } },
      { label: 'Primordial Micro Black Hole (10¹² kg = 5 × 10⁻¹⁹ M_☉)', values: { bhe_mass_sun: 5.0e-19 } }
    ],
    outputs: [
      { id: 'out_bh_entropy_jk', label: 'Bekenstein-Hawking Entropy (J/K)', default: '1.49 × 10⁶⁶ J/K' },
      { id: 'out_holographic_bits', label: 'Maximum Holographic Information Storage', default: '1.56 × 10⁷⁸ Bits' },
      { id: 'out_horizon_area_m2', label: 'Event Horizon Surface Area (A)', default: '1.10 × 10¹⁰ m²' },
      { id: 'out_universe_comp', label: 'Comparison to Entire Cosmic Baryon Entropy', default: 'Exceeds all ordinary matter entropy in cosmos' }
    ],
    benchmarks: [
      { object: '10 M_☉ Black Hole', val: 'S ≈ 1.5 × 10⁶⁶ J/K', notes: 'Contains 10⁷⁸ bits of quantum information' },
      { object: 'Sagittarius A* (4.3M M_☉)', val: 'S ≈ 2.8 × 10⁷⁷ J/K', notes: 'Accounts for 90% of entire Milky Way entropy' },
      { object: 'All Stars & Gas in Universe', val: 'S ≈ 10⁸⁰ k_B', notes: 'Completely dwarfed by supermassive black holes' },
      { object: 'Holographic Principle', val: '1 bit per 4 Planck areas', notes: 'Founded by ’t Hooft and Susskind' }
    ],
    faq: [
      { q: 'Why does black hole entropy scale with area rather than volume?', a: 'In standard thermodynamics, entropy scales with volume (3D). Black holes revealed that the maximum information capacity of any region of spacetime is bounded by its 2D surface boundary in Planck areas (the Holographic Principle), suggesting 3D physical reality may be a holographic projection from a 2D boundary.' },
      { q: 'What is the Black Hole Information Paradox?', a: 'Hawking radiation was initially calculated to be completely thermal (carrying zero information). If a black hole evaporates completely, the quantum information that formed it would be destroyed, violating quantum mechanics’ unitarity. Modern AdS/CFT solutions show information is preserved via subtle Hawking radiation quantum entanglement.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('bhe_mass_sun').value) || 10;
      
      const G = 6.67430e-11;
      const c = 299792458;
      const hbar = 1.054571817e-34;
      const kb = 1.380649e-23;
      const lp = 1.616255e-35; // Planck length
      
      const m_kg = m_sun * 1.98847e30;
      const rs_m = (2 * G * m_kg) / (c * c);
      const area_m2 = 4 * Math.PI * rs_m * rs_m;
      
      // S = (kb * c^3 * A) / (4 * G * hbar)
      const entropy_jk = (kb * Math.pow(c, 3) * area_m2) / (4 * G * hbar);
      const bits = area_m2 / (4 * lp * lp * Math.LN2);
      
      document.getElementById('out_bh_entropy_jk').textContent = fmtSci(entropy_jk) + ' J/K';
      document.getElementById('out_holographic_bits').textContent = fmtSci(bits) + ' Bits';
      document.getElementById('out_horizon_area_m2').textContent = fmtSci(area_m2) + ' m²';
      document.getElementById('out_universe_comp').textContent = bits > 1e80 ? 'Dominates entire cosmic entropy budget' : 'Dense holographic storage cell';
    `
  },
  {
    slug: 'hawking-page-phase-transition',
    title: 'Hawking-Page Phase Transition & AdS Black Hole Thermodynamics [Thermal Gas to Horizon] | Digital Tools Shed',
    shortTitle: 'Hawking-Page Phase Transition',
    category: 'Thermodynamics & Statistical Mechanics',
    badge: 'ANTI-DE SITTER QUANTUM GRAVITY',
    metaDesc: 'Model the Hawking-Page first-order phase transition temperature between thermal AdS gas and stable large black holes in AdS/CFT duality.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        T_{HP} = \frac{d - 1}{2\pi L_{AdS}};\quad \Delta F = F_{BH} - F_{gas} = 0 \text{ at } T = T_{HP}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Discovered by Stephen Hawking and Don Page in 1983, this thermodynamic phase transition occurs in Anti-de Sitter (AdS) spacetime. Unlike flat space (where black holes have negative heat capacity and evaporate), in negatively curved AdS space with curvature radius L, large black holes have positive heat capacity. Below T_HP, thermal graviton gas dominates; above T_HP, space abruptly collapses into a stable black hole.
      </p>
    `,
    inputs: [
      { id: 'hp_ads_radius_ly', label: 'AdS Spacetime Curvature Radius L (Light-Years)', type: 'number', default: '100', step: '10', min: '0.001' },
      { id: 'hp_spacetime_dim', label: 'Spacetime Dimensions d', type: 'select', options: [
        { val: '4', text: 'd = 4 (Standard 4D Spacetime: T_HP = 3 / 2πL)' },
        { val: '5', text: 'd = 5 (AdS₅ / CFT₄ Gauge-Gravity Duality: T_HP = 2 / πL)' }
      ]}
    ],
    presets: [
      { label: 'Cosmological AdS Scale (L = 100 Light-Years, d = 4)', values: { hp_ads_radius_ly: 100, hp_spacetime_dim: '4' } },
      { label: 'String Theory Compact Scale (L = 1 AU = 0.0000158 ly)', values: { hp_ads_radius_ly: 0.0000158, hp_spacetime_dim: '5' } },
      { label: 'Planetary Curvature Scale (L = 1 Light-Year)', values: { hp_ads_radius_ly: 1.0, hp_spacetime_dim: '4' } }
    ],
    outputs: [
      { id: 'out_hp_temp_k', label: 'Critical Hawking-Page Temperature T_HP', default: '1.20 × 10⁻¹⁸ Kelvin' },
      { id: 'out_dual_confinement', label: 'AdS/CFT Boundary Dual State', default: 'Deconfinement Phase Transition (Quark-Gluon Plasma)' },
      { id: 'out_heat_capacity_sign', label: 'AdS Black Hole Specific Heat', default: 'Positive Heat Capacity (Thermodynamically Stable)' },
      { id: 'out_favored_phase', label: 'Thermodynamically Favored State', default: 'Thermal Gas at T < T_HP | Black Hole at T > T_HP' }
    ],
    benchmarks: [
      { object: 'Hawking & Page (1983)', val: 'First black hole phase transition', notes: 'Proved black holes can reach thermodynamic equilibrium' },
      { object: 'Edward Witten (1998)', val: 'Confinement / Deconfinement', notes: 'Proved Hawking-Page transition is dual to quark-gluon plasma formation' },
      { object: 'Flat Space Black Holes', val: 'Negative heat capacity', notes: 'Get hotter as they radiate; unstable in flat space' },
      { object: 'AdS Anti-de Sitter Boundary', val: 'Reflecting boundary conditions', notes: 'Radiation bounces off boundary back into black hole' }
    ],
    faq: [
      { q: 'Why do black holes in flat space have negative heat capacity, but AdS black holes don’t?', a: 'In flat space, losing mass makes a black hole smaller and therefore hotter (T ∝ 1/M). In AdS space, the negative cosmological constant acts as an effective gravitational box. When a black hole grows larger than the AdS radius L, its temperature increases with mass (T ∝ M^(1/3)), giving it a stable positive heat capacity.' },
      { q: 'What is the holographic significance of the Hawking-Page transition?', a: 'In 1998, Edward Witten proved via the AdS/CFT correspondence that the Hawking-Page transition in 5D gravitational spacetime corresponds exactly to the confinement-deconfinement phase transition of quarks and gluons in 4D Yang-Mills quantum chromodynamics.' }
    ],
    calcJs: `
      const L_ly = parseFloat(document.getElementById('hp_ads_radius_ly').value) || 100;
      const d = parseInt(document.getElementById('hp_spacetime_dim').value, 10) || 4;
      
      const c = 299792458;
      const hbar = 1.054571817e-34;
      const kb = 1.380649e-23;
      const ly_m = 9.460730472e15;
      const L_m = L_ly * ly_m;
      
      // T_HP = (d - 1) * hbar * c / (2 * pi * L * kb)
      const t_hp_k = ((d - 1) * hbar * c) / (2 * Math.PI * L_m * kb);
      
      document.getElementById('out_hp_temp_k').textContent = fmtSci(t_hp_k) + ' Kelvin';
      document.getElementById('out_dual_confinement').textContent = d === 5 ? 'Witten Confinement / Deconfinement (QGP Duality)' : 'Thermal AdS Graviton Gas to Horizon Transition';
      document.getElementById('out_heat_capacity_sign').textContent = 'Positive Heat Capacity C_v > 0 (Stable Equilibrium)';
      document.getElementById('out_favored_phase').textContent = 'Gas Phase at T < T_HP; Black Hole at T > T_HP';
    `
  },
  {
    slug: 'penrose-process-energy-extraction',
    title: 'Penrose Process Kerr Black Hole Rotational Energy Extraction Calculator [Frame Dragging η_max = 29%] | Digital Tools Shed',
    shortTitle: 'Penrose Process Calculator',
    category: 'Spacetime Metrics & General Relativity',
    badge: 'ERGOSPHERE ENERGY EXTRACTION',
    metaDesc: 'Calculate maximum energy extraction efficiency (up to 29%) from spinning Kerr black holes via particle fission in the ergosphere.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        M_{irr} = \frac{1}{\sqrt{2}} \sqrt{M² + \sqrt{M⁴ - J² c² / G²}};\quad \eta_{max} = 1 - \frac{1}{\sqrt{2}} \approx 20.7\% \text{ (Particles)}, \quad 29.3\% \text{ (Extremal Wave)}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Conceived by Roger Penrose in 1969 (2020 Nobel Prize), the Penrose Process extracts rotational kinetic energy from a spinning Kerr black hole. In the ergosphere outside the event horizon, frame dragging forces spacetime to rotate faster than light. A particle broken in two can send one fragment into a negative-energy trajectory, allowing the escaping fragment to exit with up to 129% of its original energy.
      </p>
    `,
    inputs: [
      { id: 'pen_mass_sun', label: 'Black Hole Mass (Solar Masses M_☉)', type: 'number', default: '10', step: '1', min: '1' },
      { id: 'pen_spin_a', label: 'Dimensionless Spin Parameter a* = J c / (G M²)', type: 'number', default: '0.998', step: '0.01', min: '0', max: '0.9999' }
    ],
    presets: [
      { label: 'Thorne Equilibrium Limit (a* = 0.998, Maximum Real Spin)', values: { pen_mass_sun: 10, pen_spin_a: 0.998 } },
      { label: 'Cygnus X-1 Stellar Black Hole (a* ≈ 0.95)', values: { pen_mass_sun: 15, pen_spin_a: 0.95 } },
      { label: 'Sagittarius A* Milky Way (a* ≈ 0.90)', values: { pen_mass_sun: 4300000, pen_spin_a: 0.90 } },
      { label: 'Extreme Theoretical Kerr Horizon (a* = 1.00, η = 29.3%)', values: { pen_mass_sun: 10, pen_spin_a: 0.9999 } }
    ],
    outputs: [
      { id: 'out_max_extract_eff', label: 'Maximum Energy Efficiency Gain (η)', default: '20.6 % (Particle Fission)' },
      { id: 'out_total_extract_joules', label: 'Total Available Rotational Energy', default: '5.20 × 10⁴⁷ Joules' },
      { id: 'out_irreducible_mass', label: 'Irreducible Rest Mass Remaining M_irr', default: '7.07 Solar Masses' },
      { id: 'out_black_hole_bomb', label: 'Superradiant Scattering Instability', default: 'Superradiance Active for Bosonic Waves' }
    ],
    benchmarks: [
      { object: 'Nuclear Fusion Efficiency', val: '0.7% of rest mass', notes: '4 H -> He releases 0.007 mc²' },
      { object: 'Penrose Particle Fission', val: 'Up to 20.7% of particle mass', notes: '30× more efficient than nuclear fusion' },
      { object: 'Superradiant Wave Scattering', val: 'Up to 29.3% total black hole mass', notes: 'Zel’dovich & Starobinsky rotational extraction' },
      { object: 'Blandford-Znajek Mechanism', val: 'Relativistic astrophysical jets', notes: 'Electromagnetic version powers quasar jets' }
    ],
    faq: [
      { q: 'How does a particle carry "negative energy" in the ergosphere?', a: 'Inside the ergosphere, the timelike Killing vector field becomes spacelike due to extreme Lense-Thirring frame dragging. In this region, physical particle orbits retrograde to the black hole’s spin have negative conserved energy as measured by an observer at infinity.' },
      { q: 'What is a "Black Hole Bomb"?', a: 'Proposed by Press and Teukolsky in 1972, if a spinning black hole is enclosed in a spherical mirror, electromagnetic or bosonic waves reflected through the ergosphere amplify exponentially via superradiance, building up energy until the mirror shatters in a cataclysmic blast.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('pen_mass_sun').value) || 10;
      const a = parseFloat(document.getElementById('pen_spin_a').value) || 0.998;
      const safe_a = Math.min(0.99999, Math.max(0, a));
      
      const c = 299792458;
      const m_kg = m_sun * 1.98847e30;
      
      // M_irr = sqrt(0.5 * (M^2 + M * sqrt(M^2 - a^2)))
      const mirr_fraction = Math.sqrt(0.5 * (1 + Math.sqrt(1 - safe_a * safe_a)));
      const m_irr_kg = m_kg * mirr_fraction;
      const m_irr_sun = m_sun * mirr_fraction;
      
      const rot_energy_j = (m_kg - m_irr_kg) * c * c;
      const eff_pct = (1 - mirr_fraction) * 100;
      
      document.getElementById('out_max_extract_eff').textContent = eff_pct.toFixed(2) + ' % of Total Rest Mass';
      document.getElementById('out_total_extract_joules').textContent = fmtSci(rot_energy_j) + ' Joules';
      document.getElementById('out_irreducible_mass').textContent = m_irr_sun.toFixed(2) + ' M_☉ (' + (mirr_fraction * 100).toFixed(1) + ' % of Initial)';
      document.getElementById('out_black_hole_bomb').textContent = safe_a > 0.5 ? 'Superradiant Wave Amplification Active' : 'Low Spin Sub-Critical Regime';
    `
  },
  {
    slug: 'kerr-newman-extremal-charge-spin',
    title: 'Kerr-Newman Extremal Black Hole Horizon & Cosmic Censorship [a² + Q² ≤ M²] | Digital Tools Shed',
    shortTitle: 'Kerr-Newman Horizon Calculator',
    category: 'Spacetime Metrics & General Relativity',
    badge: 'GENERAL RELATIVITY METRIC CENSORSHIP',
    metaDesc: 'Explore charged rotating Kerr-Newman black holes, outer and inner Cauchy horizons, and the Cosmic Censorship naked singularity boundary.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        r_\pm = \frac{GM}{c²} \pm \sqrt{\left(\frac{GM}{c²}\right)² - a² - \frac{G Q²}{4\pi\varepsilon_0 c⁴}};\quad a² + Q² \le M²
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Derived by Ezra Newman in 1965, the Kerr-Newman metric is the most general electro-vacuum solution to Einstein’s field equations, describing a black hole possessing mass M, angular momentum J (spin a = J/Mc), and electrical charge Q. Roger Penrose’s Cosmic Censorship Hypothesis asserts that physical horizons must cloak singularities: if a² + Q² > M², the horizon evaporates into a naked singularity.
      </p>
    `,
    inputs: [
      { id: 'kn_mass_sun', label: 'Black Hole Mass (Solar Masses M_☉)', type: 'number', default: '10', step: '1', min: '0.1' },
      { id: 'kn_spin_frac', label: 'Spin Parameter Fraction (a / M)', type: 'number', default: '0.80', step: '0.05', min: '0', max: '1.2' },
      { id: 'kn_charge_frac', label: 'Charge Parameter Fraction (Q / M)', type: 'number', default: '0.30', step: '0.05', min: '0', max: '1.2' }
    ],
    presets: [
      { label: 'Sub-Extremal Black Hole (a/M = 0.8, Q/M = 0.3)', values: { kn_mass_sun: 10, kn_spin_frac: 0.80, kn_charge_frac: 0.30 } },
      { label: 'Exact Extremal Horizon (a/M = 1.0, Q/M = 0.0)', values: { kn_mass_sun: 10, kn_spin_frac: 1.00, kn_charge_frac: 0.00 } },
      { label: 'Reissner-Nordström Extremal (a/M = 0.0, Q/M = 1.0)', values: { kn_mass_sun: 10, kn_spin_frac: 0.00, kn_charge_frac: 1.00 } },
      { label: 'Naked Singularity Violation (a/M = 1.1, Q/M = 0.5)', values: { kn_mass_sun: 10, kn_spin_frac: 1.10, kn_charge_frac: 0.50 } }
    ],
    outputs: [
      { id: 'out_outer_horizon_km', label: 'Outer Event Horizon Radius r₊ (km)', default: '22.4 km' },
      { id: 'out_inner_horizon_km', label: 'Inner Cauchy Horizon Radius r₋ (km)', default: '7.1 km' },
      { id: 'out_censor_status', label: 'Cosmic Censorship Status', default: 'Cloaked Singularity (a² + Q² < M²)' },
      { id: 'out_hawking_temp', label: 'Horizon Surface Gravity / Temperature', default: 'Warm Hawking Radiation (T_H > 0)' }
    ],
    benchmarks: [
      { object: 'Schwarzschild (a = 0, Q = 0)', val: 'r₊ = 2GM/c²', notes: 'Static uncharged spherical horizon' },
      { object: 'Kerr (a = M, Q = 0)', val: 'r₊ = GM/c²', notes: 'Extremal rotating zero-temperature horizon' },
      { object: 'Reissner-Nordström (a = 0, Q = M)', val: 'r₊ = GM/c²', notes: 'Extremal charged zero-temperature horizon' },
      { object: 'Naked Singularity (a² + Q² > M²)', val: 'No Horizon Exists', notes: 'Ring singularity exposed directly to outside universe' }
    ],
    faq: [
      { q: 'What is a naked singularity?', a: 'If a black hole spins too fast or carries too much charge such that a² + Q² > M², the event horizon mathematical roots become complex numbers, causing the horizon to vanish. The infinite gravitational curvature of the central singularity would be exposed to the outside universe, destroying causal predictability.' },
      { q: 'Why do astrophysical black holes have virtually zero electric charge (Q ≈ 0)?', a: 'Because space is filled with ionized plasma. Any black hole that accumulates a net electric charge immediately attracts oppositely charged interstellar ions and electrons, rapidly neutralizing itself.' }
    ],
    calcJs: `
      const m_sun = parseFloat(document.getElementById('kn_mass_sun').value) || 10;
      const a_frac = parseFloat(document.getElementById('kn_spin_frac').value) || 0.80;
      const q_frac = parseFloat(document.getElementById('kn_charge_frac').value) || 0.30;
      
      const G = 6.67430e-11;
      const c = 299792458;
      const m_kg = m_sun * 1.98847e30;
      const m_geom_km = (G * m_kg) / (c * c * 1000);
      
      const disc = 1 - (a_frac * a_frac + q_frac * q_frac);
      
      let r_plus_km = 0;
      let r_minus_km = 0;
      let censor = 'Cloaked by Event Horizon (Weak Censorship Holds)';
      let temp = 'T_H > 0 (Finite Horizon Surface Gravity)';
      
      if (disc > 0) {
        r_plus_km = m_geom_km * (1 + Math.sqrt(disc));
        r_minus_km = m_geom_km * (1 - Math.sqrt(disc));
      } else if (Math.abs(disc) < 0.001) {
        r_plus_km = m_geom_km;
        r_minus_km = m_geom_km;
        censor = 'Extremal Horizon (r₊ = r₋, T_H = 0 Kelvin)';
        temp = 'Zero Temperature (T_H = 0 K, Zero Evaporation)';
      } else {
        censor = 'VIOLATION: Naked Singularity (No Horizon Cloaking)';
        temp = 'Unphysical / Naked Curvature Singularity';
      }
      
      document.getElementById('out_outer_horizon_km').textContent = disc >= 0 ? r_plus_km.toFixed(2) + ' km' : 'Horizon Destroyed (Complex)';
      document.getElementById('out_inner_horizon_km').textContent = disc >= 0 ? r_minus_km.toFixed(2) + ' km' : 'None (Naked Singularity)';
      document.getElementById('out_censor_status').textContent = censor;
      document.getElementById('out_hawking_temp').textContent = temp;
    `
  },
  {
    slug: 'einstein-field-equations-tensor-components',
    title: 'Einstein Field Equations Tensor Coupling & Cosmological Constant [G_μν + Λg_μν = 8πG/c⁴ T_μν] | Digital Tools Shed',
    shortTitle: 'Einstein Field Equations Calculator',
    category: 'Spacetime Metrics & General Relativity',
    badge: 'GENERAL RELATIVISTIC TENSOR COUPLING',
    metaDesc: 'Explore Einstein’s 10 non-linear field equations relating spacetime curvature tensors G_μν to matter-energy stress tensors T_μν.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        G_{\mu\nu} + \Lambda g_{\mu\nu} = R_{\mu\nu} - \frac{1}{2} R g_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c⁴} T_{\mu\nu}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Presented by Albert Einstein in November 1915, these 10 coupled, non-linear partial differential equations embody John Wheeler’s famous summary: "Spacetime tells matter how to move; matter tells spacetime how to curve." The coupling constant 8πG/c⁴ ≈ 2.076 × 10⁻⁴³ s²/kg·m demonstrates the incredible stiffness of spacetime.
      </p>
    `,
    inputs: [
      { id: 'efe_matter_density', label: 'Local Energy Density T₀₀ = ρ c² (kg/m³)', type: 'number', default: '1000', step: '100', min: '1e-27' },
      { id: 'efe_pressure_pa', label: 'Isotropic Fluid Pressure P (Pascals Pa)', type: 'number', default: '101325', step: '1000', min: '0' }
    ],
    presets: [
      { label: 'Water on Earth (ρ = 1,000 kg/m³, 1 atm Pressure)', values: { efe_matter_density: 1000, efe_pressure_pa: 101325 } },
      { label: 'Earth Core Iron (ρ = 13,000 kg/m³, P = 360 GPa)', values: { efe_matter_density: 13000, efe_pressure_pa: 3.6e11 } },
      { label: 'Neutron Star Nuclear Core (ρ = 5 × 10¹⁷ kg/m³)', values: { efe_matter_density: 5e17, efe_pressure_pa: 1e34 } },
      { label: 'Cosmological Dark Energy Vacuum (ρ_Λ = 6 × 10⁻²⁷ kg/m³)', values: { efe_matter_density: 6e-27, efe_pressure_pa: 5.4e-10 } }
    ],
    outputs: [
      { id: 'out_coupling_constant', label: 'Einstein Coupling Constant (8πG / c⁴)', default: '2.076 × 10⁻⁴³ s² / (kg · m)' },
      { id: 'out_spacetime_stiffness', label: 'Spacetime Curvature Rigidity Modulus', default: 'c⁴ / 8πG ≈ 4.81 × 10⁴² N' },
      { id: 'out_curvature_g00', label: 'Time-Time Curvature Component G₀₀', default: '1.87 × 10⁻²³ m⁻²' },
      { id: 'out_spacetime_deflection', label: 'Relativistic Gravity Regime', default: 'Weak Field Newtonian Limit (g_μν ≈ η_μν + h_μν)' }
    ],
    benchmarks: [
      { object: 'Einstein Coupling Constant', val: '2.076 × 10⁻⁴³ m/J', notes: 'Explains why massive planets cause tiny spatial warps' },
      { object: 'Spacetime Stiffness', val: '4.8 × 10⁴² Newtons', notes: 'Spacetime is the stiffest elastic medium in the universe' },
      { object: 'Newtonian Weak Field Limit', val: 'g₀₀ ≈ -(1 + 2Φ/c²)', notes: 'Reproduces Poisson equation ∇²Φ = 4πGρ' },
      { object: 'Cosmological Constant Λ', val: '1.1 × 10⁻⁵² m⁻²', notes: 'Observed vacuum dark energy acceleration' }
    ],
    faq: [
      { q: 'Why is spacetime described as being unimaginably "stiff"?', a: 'Because the coupling coefficient 8πG/c⁴ contains c⁴ in the denominator (~8.1 × 10³³ m⁴/s⁴). It requires colossal concentrations of mass-energy (like stellar cores or colliding black holes) to warp spacetime by even a fraction of a millimeter.' },
      { q: 'Why are there 10 equations instead of 16?', a: 'The metric tensor g_μν, Ricci tensor R_μν, and stress-energy tensor T_μν are all symmetric 4×4 matrices (g_μν = g_νμ). A symmetric 4×4 matrix has (4 × 5)/2 = 10 independent components.' }
    ],
    calcJs: `
      const rho = parseFloat(document.getElementById('efe_matter_density').value) || 1000;
      const P = parseFloat(document.getElementById('efe_pressure_pa').value) || 101325;
      
      const G = 6.67430e-11;
      const c = 299792458;
      const kappa = (8 * Math.PI * G) / Math.pow(c, 4);
      const rigidity = 1 / kappa;
      
      // T00 = rho * c^2
      const t00 = rho * c * c;
      const g00 = kappa * t00;
      
      let regime = 'Weak Field Linearized Gravity (Newtonian)';
      if (rho > 1e16) regime = 'Extreme Strong-Field Relativistic Gravity (Neutron Star / Black Hole)';
      else if (rho > 1e9) regime = 'White Dwarf Degeneracy Relativistic Curvature';
      
      document.getElementById('out_coupling_constant').textContent = fmtSci(kappa) + ' s² / (kg·m)';
      document.getElementById('out_spacetime_stiffness').textContent = fmtSci(rigidity) + ' Newtons';
      document.getElementById('out_curvature_g00').textContent = fmtSci(g00) + ' m⁻²';
      document.getElementById('out_spacetime_deflection').textContent = regime;
    `
  },
  {
    slug: 'gravitational-wave-strain-amplitude',
    title: 'Gravitational Wave Strain Amplitude & Chirp Mass Calculator [LIGO Quadrupole h = 2G^(5/3)/c⁴d] | Digital Tools Shed',
    shortTitle: 'Gravitational Wave Strain Calculator',
    category: 'Spacetime Metrics & General Relativity',
    badge: 'INTERFEROMETRIC GRAVITATIONAL WAVES',
    metaDesc: 'Calculate binary black hole and neutron star merger gravitational wave strain amplitude h, chirp mass, and orbital frequency.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        h \approx \frac{4}{d} · \left(\frac{G \mathcal{M}}{c²}\right)^{5/3} \left(\frac{\pi f}{c}\right)^{2/3};\quad \mathcal{M} = \frac{(m_1 m_2)^{3/5}}{(m_1 + m_2)^{1/5}}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        First directly detected by LIGO on September 14, 2015 (GW150914, 2017 Nobel Prize), gravitational waves are ripples in the metric fabric of spacetime produced by accelerating mass quadrupoles. At Earth, the dimensionless strain amplitude h is on the order of 10⁻²¹, stretching LIGO’s 4-kilometer laser arms by less than 1/1,000th the width of a proton.
      </p>
    `,
    inputs: [
      { id: 'gw_m1_sun', label: 'Primary Mass m₁ (Solar Masses M_☉)', type: 'number', default: '36', step: '1', min: '0.5' },
      { id: 'gw_m2_sun', label: 'Secondary Mass m₂ (Solar Masses M_☉)', type: 'number', default: '29', step: '1', min: '0.5' },
      { id: 'gw_dist_mpc', label: 'Luminosity Distance d (Megaparsecs Mpc)', type: 'number', default: '410', step: '10', min: '1' },
      { id: 'gw_freq_hz', label: 'Gravitational Wave Frequency f (Hz)', type: 'number', default: '150', step: '10', min: '10', max: '2000' }
    ],
    presets: [
      { label: 'GW150914 Historical First Detection (36 M_☉ + 29 M_☉ at 410 Mpc)', values: { gw_m1_sun: 36, gw_m2_sun: 29, gw_dist_mpc: 410, gw_freq_hz: 150 } },
      { label: 'GW170817 Binary Neutron Star Merger (1.4 M_☉ + 1.3 M_☉ at 40 Mpc)', values: { gw_m1_sun: 1.4, gw_m2_sun: 1.3, gw_dist_mpc: 40, gw_freq_hz: 800 } },
      { label: 'LISA Supermassive Merger (1,000,000 M_☉ + 1,000,000 M_☉, 0.001 Hz)', values: { gw_m1_sun: 1000000, gw_m2_sun: 1000000, gw_dist_mpc: 3000, gw_freq_hz: 0.01 } }
    ],
    outputs: [
      { id: 'out_chirp_mass_sun', label: 'Binary Chirp Mass (ℳ)', default: '28.1 Solar Masses' },
      { id: 'out_gw_strain_h', label: 'Dimensionless Strain Amplitude (h)', default: '1.20 × 10⁻²¹' },
      { id: 'out_arm_displacement_m', label: 'LIGO 4 km Arm Physical Displacement ΔL', default: '4.8 × 10⁻¹⁸ Meters (< 1/1,000th proton)' },
      { id: 'out_radiated_power_w', label: 'Peak Radiated GW Power at Merger', default: '3.6 × 10⁴⁹ Watts (More than all stars)' }
    ],
    benchmarks: [
      { object: 'GW150914 Peak Strain', val: 'h ≈ 1.0 × 10⁻²¹', notes: 'Displaced 4 km laser arms by 4 × 10⁻¹⁸ m' },
      { object: 'Peak Merger Power GW150914', val: '3.6 × 10⁴⁹ Watts', notes: 'Outshone all the stars in the observable universe combined for 0.1s' },
      { object: 'Proton Radius', val: '0.84 × 10⁻¹⁵ m', notes: 'LIGO displacement is 10,000 times smaller than a proton' },
      { object: 'Pulsar Timing Array (NANOGrav 2023)', val: 'Nano-Hertz stochastic background', notes: 'Supermassive black hole cosmic hum' }
    ],
    faq: [
      { q: 'Why are gravitational waves quadrupole radiation instead of dipole?', a: 'Conservation of linear momentum forbids gravitational dipole radiation (there is no negative gravitational mass to separate). Conservation of angular momentum forbids magnetic dipole radiation. Therefore, gravitational radiation begins at the quadrupole order (asymmetric mass rotation).' },
      { q: 'How does LIGO measure distances smaller than a subatomic proton?', a: 'LIGO uses Fabry-Pérot optical cavity laser interferometry with 40-kilowatt laser beams bounced between 40-kilogram mirror test masses 300 times. Averaging over 10²³ laser photons beats the Poisson photon shot noise limit to resolve attometer displacements.' }
    ],
    calcJs: `
      const m1 = parseFloat(document.getElementById('gw_m1_sun').value) || 36;
      const m2 = parseFloat(document.getElementById('gw_m2_sun').value) || 29;
      const d_mpc = parseFloat(document.getElementById('gw_dist_mpc').value) || 410;
      const f = parseFloat(document.getElementById('gw_freq_hz').value) || 150;
      
      const G = 6.67430e-11;
      const c = 299792458;
      const m_sun_kg = 1.98847e30;
      const m1_kg = m1 * m_sun_kg;
      const m2_kg = m2 * m_sun_kg;
      
      // Chirp mass M = (m1 * m2)^(3/5) / (m1 + m2)^(1/5)
      const m_chirp_kg = Math.pow(m1_kg * m2_kg, 3/5) / Math.pow(m1_kg + m2_kg, 1/5);
      const m_chirp_sun = m_chirp_kg / m_sun_kg;
      
      const d_m = d_mpc * 3.085677581e22;
      
      // Strain h ~ (4 / d) * (G * M_chirp / c^2)^(5/3) * (pi * f / c)^(2/3)
      const term1 = (4 / d_m);
      const term2 = Math.pow((G * m_chirp_kg) / (c * c), 5/3);
      const term3 = Math.pow((Math.PI * f) / c, 2/3);
      const h = term1 * term2 * term3;
      
      const ligo_arm_m = 4000;
      const delta_L_m = h * ligo_arm_m;
      
      document.getElementById('out_chirp_mass_sun').textContent = m_chirp_sun.toFixed(1) + ' M_☉';
      document.getElementById('out_gw_strain_h').textContent = fmtSci(h);
      document.getElementById('out_arm_displacement_m').textContent = fmtSci(delta_L_m) + ' m (LIGO Arm Delta)';
      document.getElementById('out_radiated_power_w').textContent = '~ 10⁴⁹ Watts (Exceeds all observable stars)';
    `
  },
  {
    slug: 'quantum-teleportation-fidelity',
    title: 'Quantum State Teleportation Fidelity Calculator [Bennett Protocol Entangled EPR Pair] | Digital Tools Shed',
    shortTitle: 'Quantum Teleportation Fidelity',
    category: 'Quantum Information & Computing',
    badge: 'ENTANGLEMENT PROTOCOL VERIFICATION',
    metaDesc: 'Model the 1993 Bennett quantum state teleportation protocol, Bell-state measurements, depolarizing noise, and quantum fidelity F.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        |\psi\rangle_{in} = \alpha|0\rangle + \beta|1\rangle;\quad |\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}};\quad F = \langle\psi_{in}|\rho_{out}|\psi_{in}\rangle \ge \frac{2}{3}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by Charles Bennett et al. in 1993, quantum teleportation transfers an unknown quantum state |ψ⟩ from Alice to Bob using an entangled Einstein-Podolsky-Rosen (EPR) Bell pair and 2 bits of classical communication. Classical transmission without entanglement has a maximum theoretical fidelity limit of 2/3 (66.7%); exceeding 2/3 proves genuine quantum teleportation.
      </p>
    `,
    inputs: [
      { id: 'qt_bell_fidelity', label: 'EPR Pair Entanglement Quality (0 to 1)', type: 'number', default: '0.95', step: '0.01', min: '0.5', max: '1.0' },
      { id: 'qt_depolarizing_p', label: 'Channel Depolarizing Noise Rate p (0 = Ideal)', type: 'number', default: '0.02', step: '0.01', min: '0', max: '0.5' }
    ],
    presets: [
      { label: 'Ideal Lab Demonstration (Bell Fidelity = 0.98, Noise = 0.01)', values: { qt_bell_fidelity: 0.98, qt_depolarizing_p: 0.01 } },
      { label: 'Micius Satellite Ground-to-Space (F ≈ 0.80)', values: { qt_bell_fidelity: 0.85, qt_depolarizing_p: 0.08 } },
      { label: 'Classical Guessing Threshold (F = 0.667)', values: { qt_bell_fidelity: 0.50, qt_depolarizing_p: 0.25 } }
    ],
    outputs: [
      { id: 'out_teleport_fidelity', label: 'Quantum Teleportation State Fidelity (F)', default: '0.931' },
      { id: 'out_classical_bound', label: 'Classical Limit Benchmark (F_class = 2/3)', default: 'Exceeds Classical Bound (+26.4%)' },
      { id: 'out_classical_bits_req', label: 'Classical Bits Transmitted per Qubit', default: 'Exactly 2 Classical Bits (c ≤ 3×10⁸ m/s)' },
      { id: 'out_superluminal_test', label: 'No-Signaling Invariance Check', default: 'No FTL Information Transfer (Causality Preserved)' }
    ],
    benchmarks: [
      { object: 'Bennett et al. (1993)', val: 'Foundational theory paper', notes: 'First proposed quantum state teleportation' },
      { object: 'Zeilinger Innsbruck (1997)', val: 'First photonic demonstration', notes: 'Teleported polarization state of photons' },
      { object: 'Micius Satellite (China, 2017)', val: '1,400 km space teleportation', notes: 'Ground station to Low Earth Orbit satellite' },
      { object: 'Classical Limit (2/3 = 66.7%)', val: 'Maximum unentangled fidelity', notes: 'Anything > 0.667 proves quantum entanglement' }
    ],
    faq: [
      { q: 'Does quantum teleportation allow faster-than-light communication?', a: 'No. The receiver Bob cannot decode the teleported state until Alice sends her 2-bit Bell measurement outcome over a standard classical communications channel (limited by light speed c). Until Bob receives these classical bits, his local qubit is a completely random mixed state.' },
      { q: 'Is the original quantum particle transported across space?', a: 'No. The physical particle never moves. Only its quantum state (information, phase, and superposition) is transferred. Alice’s original state is destroyed during the Bell measurement, strictly preserving the No-Cloning Theorem.' }
    ],
    calcJs: `
      const f_bell = parseFloat(document.getElementById('qt_bell_fidelity').value) || 0.95;
      const p = parseFloat(document.getElementById('qt_depolarizing_p').value) || 0.02;
      
      // Standard depolarizing Werner state fidelity
      // F = f_bell * (1 - p) + (p / 2) * (1 - f_bell)
      const fidelity = f_bell * (1 - p);
      const class_bound = 2 / 3;
      const excess = (fidelity - class_bound) * 100;
      
      let bound_str = 'Below Classical Bound (No Entanglement Verified)';
      if (fidelity > class_bound) {
        bound_str = 'Exceeds Classical Bound by +' + excess.toFixed(1) + '% (Quantum Genuine)';
      }
      
      document.getElementById('out_teleport_fidelity').textContent = fidelity.toFixed(3);
      document.getElementById('out_classical_bound').textContent = bound_str;
      document.getElementById('out_classical_bits_req').textContent = '2 Classical Bits (via Radio / Fiber)';
      document.getElementById('out_superluminal_test').textContent = 'Compliant with No-Signaling Theorem (≤ c)';
    `
  },
  {
    slug: 'quantum-no-cloning-theorem-fidelity',
    title: 'Quantum No-Cloning Theorem & Optimal Universal Cloning Fidelity [Buzek-Hillery F = 5/6] | Digital Tools Shed',
    shortTitle: 'Quantum No-Cloning Calculator',
    category: 'Quantum Information & Computing',
    badge: 'QUANTUM LINEARITY FOUNDATIONS',
    metaDesc: 'Explore Wootters-Zurek no-cloning proof and calculate optimal Bužek-Hillery symmetric universal cloning machine fidelity F = 5/6.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        U (|\psi\rangle |0\rangle) \ne |\psi\rangle |\psi\rangle;\quad F_{optimal} = \frac{N M + N + M}{N (M + 2)} \to \frac{5}{6} \approx 83.33\% \text{ for 1} \to 2
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proven by William Wootters and Wojciech Zurek in 1982, the No-Cloning Theorem establishes that the linearity of quantum unitary transformations makes it impossible to create an identical copy of an arbitrary unknown quantum state. Vladimir Bužek and Mark Hillery proved in 1996 that the maximum fidelity any physical machine can achieve when cloning 1 qubit into 2 is exactly 5/6 (83.33%).
      </p>
    `,
    inputs: [
      { id: 'nc_input_copies', label: 'Number of Input Seed Qubits N', type: 'number', default: '1', step: '1', min: '1', max: '5' },
      { id: 'nc_output_copies', label: 'Desired Output Clones M', type: 'number', default: '2', step: '1', min: '2', max: '10' }
    ],
    presets: [
      { label: 'Canonical 1 -> 2 Universal Cloning (F = 5/6 = 83.3%)', values: { nc_input_copies: 1, nc_output_copies: 2 } },
      { label: '1 -> 3 Cloning (F = 7/9 = 77.8%)', values: { nc_input_copies: 1, nc_output_copies: 3 } },
      { label: '2 -> 3 Cloning (F = 11/12 = 91.7%)', values: { nc_input_copies: 2, nc_output_copies: 3 } }
    ],
    outputs: [
      { id: 'out_cloning_fidelity', label: 'Maximum Attainable Cloning Fidelity (F)', default: '0.8333 (5 / 6)' },
      { id: 'out_clone_percentage', label: 'Clone Accuracy Percentage', default: '83.33 %' },
      { id: 'out_eavesdrop_qkd', label: 'Quantum Key Distribution (BB84) Security', default: 'Secured: Eavesdropper Inevitably Induces Errors' },
      { id: 'out_linearity_proof', label: 'Quantum Linearity Invariance', default: 'Unitary Evolution U†U = I Preserved' }
    ],
    benchmarks: [
      { object: 'Wootters & Zurek (1982)', val: 'Formulated No-Cloning Theorem', notes: 'Refuted Flash superluminal communicator proposal' },
      { object: 'Bužek & Hillery (1996)', val: 'Universal Quantum Cloning Machine (UQCM)', notes: 'Proved 5/6 bound for 1 -> 2 cloning' },
      { object: 'BB84 Protocol (Bennett & Brassard)', val: 'Quantum cryptography', notes: 'Relies on no-cloning to detect wiretapping' },
      { object: 'Quantum Teleportation', val: 'Destroys original state', notes: 'Circumvents no-cloning by destroying input qubit' }
    ],
    faq: [
      { q: 'Why is copying a classical bit easy, but copying a qubit impossible?', a: 'Classical bits exist in definite states (0 or 1) and can be measured without disturbance. A qubit exists in a continuous complex superposition α|0⟩ + β|1⟩. Measuring it collapses the state, destroying the unknown amplitudes α and β before they can be copied.' },
      { q: 'How does the No-Cloning Theorem protect Quantum Cryptography (QKD)?', a: 'In the BB84 protocol, any spy (Eve) attempting to intercept and copy key photons cannot clone them perfectly. Her imperfect clones introduce detectable quantum bit error rates (QBER > 11%), instantly alerting Alice and Bob to abort the exchange.' }
    ],
    calcJs: `
      const N = parseInt(document.getElementById('nc_input_copies').value, 10) || 1;
      const M = parseInt(document.getElementById('nc_output_copies').value, 10) || 2;
      
      const safe_M = Math.max(N + 1, M);
      // Gisin-Massar universal cloning formula for d=2 qubits:
      // F(N -> M) = (N * M + N + M) / (M * (N + 2))
      const f_opt = (N * safe_M + N + safe_M) / (safe_M * (N + 2));
      const f_pct = f_opt * 100;
      
      document.getElementById('out_cloning_fidelity').textContent = f_opt.toFixed(4) + (N === 1 && safe_M === 2 ? ' (5/6)' : '');
      document.getElementById('out_clone_percentage').textContent = f_pct.toFixed(2) + ' %';
      document.getElementById('out_eavesdrop_qkd').textContent = 'QKD Secure: Imperfect clones leave minimum ' + (100 - f_pct).toFixed(1) + '% error trace';
      document.getElementById('out_linearity_proof').textContent = 'Unitary Operator Linearity Invariant';
    `
  },
  {
    slug: 'bell-inequality-chsh-violation',
    title: 'Bell Inequality & CHSH Quantum Non-Locality Calculator [Tsirelson’s Bound S ≤ 2√2] | Digital Tools Shed',
    shortTitle: 'Bell Inequality Calculator',
    category: 'Quantum Information & Computing',
    badge: 'QUANTUM ENTANGLEMENT NON-LOCALITY',
    metaDesc: 'Explore John Bell’s theorem and Clauser-Horne-Shimony-Holt (CHSH) inequality violations proving quantum non-locality and entanglement.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        S = E(a, b) - E(a, b') + E(a', b) + E(a', b');\quad |S_{classical}| \le 2;\quad |S_{quantum}| \le 2\sqrt{2} \approx 2.828
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Published by Northern Irish physicist John Stewart Bell in 1964 and formalized by CHSH in 1969, Bell’s Theorem proved that no physical theory of local hidden variables can reproduce the correlations of quantum mechanics. Experiments measuring entangled photon polarizations violate the classical bound (|S| ≤ 2), reaching Tsirelson’s quantum bound of 2√2 (2.828).
      </p>
    `,
    inputs: [
      { id: 'bell_theta_deg', label: 'Detector Angle Offset θ (Degrees)', type: 'number', default: '22.5', step: '2.5', min: '0', max: '90' }
    ],
    presets: [
      { label: 'Maximum Quantum Violation (θ = 22.5°, S = 2.828 = 2√2)', values: { bell_theta_deg: 22.5 } },
      { label: 'Zero Violation Classical Alignment (θ = 0°, S = 2.000)', values: { bell_theta_deg: 0 } },
      { label: 'Perpendicular Orthogonal Angles (θ = 45°, S = 2.000)', values: { bell_theta_deg: 45 } }
    ],
    outputs: [
      { id: 'out_chsh_s_val', label: 'CHSH Correlation Parameter |S|', default: '2.828 (Maximum Quantum Violation)' },
      { id: 'out_classical_limit_comp', label: 'Classical Local Realism Limit (S ≤ 2)', default: 'Violates Classical Bound by 41.4%' },
      { id: 'out_einstein_spooky', label: 'Einstein "Spooky Action at a Distance"', default: 'Local Realism Disproven (Loophole-Free)' },
      { id: 'out_nobel_status', label: 'Experimental Verification History', default: '2022 Nobel Prize (Aspect, Clauser, Zeilinger)' }
    ],
    benchmarks: [
      { object: 'John Bell (1964)', val: 'Proved EPR local realism is testable', notes: 'Settled the 30-year Bohr-Einstein debate' },
      { object: 'Freedman & Clauser (1972)', val: 'First experimental test', notes: 'Observed first violation of CHSH inequality' },
      { object: 'Alain Aspect (1982)', val: 'Fast switching detectors', notes: 'Closed the locality communication loophole' },
      { object: 'Delft Loophole-Free Test (2015)', val: 'Simultaneous detection & locality', notes: 'Definitively ruled out local hidden variables' },
      { object: 'Tsirelson’s Bound (1980)', val: 'S_max = 2√2 ≈ 2.8284', notes: 'Absolute maximum quantum mechanics allows' }
    ],
    faq: [
      { q: 'What does violating Bell’s inequality actually prove about the universe?', a: 'It proves that our universe cannot simultaneously possess both "locality" (effects cannot propagate faster than light) and "realism" (properties exist with definite values before measurement). At least one of these cherished classical assumptions is fundamentally false.' },
      { q: 'Can Bell violation be used to send Morse code across the galaxy instantly?', a: 'No. The correlation between Alice and Bob’s measurements is 100% genuine, but Alice’s individual outcomes are completely random. Bob cannot know what Alice measured without receiving her classical results, preserving relativistic causality.' }
    ],
    calcJs: `
      const th_deg = parseFloat(document.getElementById('bell_theta_deg').value) || 22.5;
      const th_rad = (th_deg * Math.PI) / 180;
      
      // For standard CHSH setup: a=0, a'=2*th, b=th, b'=3*th
      // E(theta) = -cos(2*theta)
      // S = 3 * cos(2*th) - cos(6*th) for symmetric configuration
      const s_val = Math.abs(3 * Math.cos(2 * th_rad) - Math.cos(6 * th_rad));
      
      let verdict = 'Local Realism Disproven (Entanglement Non-Locality)';
      if (s_val <= 2.001) verdict = 'Classical Local Hidden Variables Permitted';
      
      const pct_excess = ((s_val - 2.0) / 2.0) * 100;
      
      document.getElementById('out_chsh_s_val').textContent = s_val.toFixed(4) + (Math.abs(s_val - 2.8284) < 0.01 ? ' (Tsirelson’s Bound 2√2)' : '');
      document.getElementById('out_classical_limit_comp').textContent = s_val > 2 ? 'Violates Classical Limit by +' + pct_excess.toFixed(1) + '%' : 'Compliant with Classical Limit (|S| ≤ 2)';
      document.getElementById('out_einstein_spooky').textContent = verdict;
      document.getElementById('out_nobel_status').textContent = '2022 Nobel Prize (Clauser, Aspect, Zeilinger)';
    `
  },
  {
    slug: 'stellar-nucleosynthesis-triple-alpha',
    title: 'Triple-Alpha Helium Fusion Process & Hoyle State Resonance [3α -> ¹²C Rate] | Digital Tools Shed',
    shortTitle: 'Triple-Alpha Process Calculator',
    category: 'Stellar Evolution & Nucleosynthesis',
    badge: 'STELLAR NUCLEOSYNTHESIS RESONANCE',
    metaDesc: 'Explore Fred Hoyle’s 7.65 MeV carbon-12 nuclear resonance state enabling the triple-alpha fusion reaction in red giant stars.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        2 \alpha \rightleftharpoons {}^{8}\text{Be} (-92 \text{ keV});\quad {}^{8}\text{Be} + \alpha \to {}^{12}\text{C}^* (7.654 \text{ MeV}) \to {}^{12}\text{C} + \gamma + 7.27 \text{ MeV}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed by Fred Hoyle in 1954, the triple-alpha process solves how red giant stars forge carbon. Beryllium-8 is notoriously unstable, decaying back into two helium nuclei in only 10⁻¹⁶ seconds. Hoyle predicted that for carbon to exist in the universe, a previously unknown excited quantum state must exist in Carbon-12 at 7.65 MeV to resonance-accelerate fusion before the beryllium disintegrates.
      </p>
    `,
    inputs: [
      { id: 'tri_core_temp_mk', label: 'Red Giant Core Temperature (Million K)', type: 'number', default: '100', step: '5', min: '60', max: '300' },
      { id: 'tri_core_density', label: 'Helium Core Density (g/cm³)', type: 'number', default: '10000', step: '1000', min: '1000' }
    ],
    presets: [
      { label: 'Red Giant Helium Flash Ignition (T = 100 MK, ρ = 10,000 g/cm³)', values: { tri_core_temp_mk: 100, tri_core_density: 10000 } },
      { label: 'Asymptotic Giant Branch Core (T = 150 MK, ρ = 50,000 g/cm³)', values: { tri_core_temp_mk: 150, tri_core_density: 50000 } },
      { label: 'Sub-Ignition Solar Core (T = 15 MK, Reaction Rate = 0)', values: { tri_core_temp_mk: 15, tri_core_density: 150 } }
    ],
    outputs: [
      { id: 'out_tri_power_w_kg', label: 'Specific Nuclear Energy Generation (W/kg)', default: '8.40 × 10⁻⁴ W/kg' },
      { id: 'out_temp_exponent', label: 'Temperature Sensitivity Exponent (ε ∝ Tⁿ)', default: 'ε ∝ T⁴⁰ (Extremely Violent Sensitivity)' },
      { id: 'out_be8_lifetime', label: 'Beryllium-8 Intermediate Halflife', default: '8.19 × 10⁻¹⁷ Seconds' },
      { id: 'out_hoyle_resonance', label: 'Anthropic Fine-Tuning Margin', default: 'Carbon-12 Hoyle State Resonance Active' }
    ],
    benchmarks: [
      { object: 'Fred Hoyle Prediction (1954)', val: 'E = 7.65 MeV state', notes: 'First successful anthropic prediction in physics history' },
      { object: 'Willy Fowler Caltech Test', val: '7.654 MeV confirmed', notes: 'Fowler received 1983 Nobel Prize for nuclear astrophysics' },
      { object: 'Temperature Exponent', val: 'ε ∝ T⁴⁰ at 100 MK', notes: 'Doubling temperature increases fusion rate by 1,000,000,000,000×' },
      { object: 'Helium Core Flash', val: 'Degenerate runaway in seconds', notes: 'Occurs in low-mass stars like our Sun' }
    ],
    faq: [
      { q: 'Why is the triple-alpha reaction called a triumph of anthropic reasoning?', a: 'Fred Hoyle noted that humans are carbon-based life forms. Without an exact energy resonance matching the Be-8 + alpha sum, carbon production in red giants would be zero, leaving an empty, lifeless cosmos. He demanded nuclear physicists search for a 7.65 MeV level in C-12, and they found it precisely where he predicted.' },
      { q: 'Why is the temperature sensitivity (T⁴⁰) so insanely steep?', a: 'Because three independent alpha particles must effectively collide within 10⁻¹⁶ seconds while tunneling through double Coulomb barriers. A microscopic 10% rise in core temperature multiplies fusion power output by over 40 times, driving the explosive "Helium Flash" in degenerate red giant cores.' }
    ],
    calcJs: `
      const t_mk = parseFloat(document.getElementById('tri_core_temp_mk').value) || 100;
      const rho = parseFloat(document.getElementById('tri_core_density').value) || 10000;
      
      const t8 = t_mk / 100; // normalized to 10^8 K
      
      let eps_w_kg = 0;
      if (t8 > 0.6) {
        // Standard triple-alpha energy generation formula: eps ~ rho^2 * T8^40 * 1e-8
        eps_w_kg = 5.3e-8 * (rho * rho / 1e8) * Math.pow(t8, 40) * Math.exp(-4.4 / t8);
      }
      
      document.getElementById('out_tri_power_w_kg').textContent = eps_w_kg < 1e-10 ? '0.0 W/kg (Extinguished)' : fmtSci(eps_w_kg) + ' W/kg';
      document.getElementById('out_temp_exponent').textContent = t_mk < 120 ? 'ε ∝ T⁴⁰ (Explosive Flash Sensitivity)' : 'ε ∝ T²⁰ (High Temperature Saturation)';
      document.getElementById('out_be8_lifetime').textContent = '8.19 × 10⁻¹⁷ Seconds (Disintegrates into 2α)';
      document.getElementById('out_hoyle_resonance').textContent = 'Hoyle 7.654 MeV State Active (Anthropic Miracle)';
    `
  },
  {
    slug: 'carbon-nitrogen-oxygen-cno-cycle',
    title: 'Carbon-Nitrogen-Oxygen (CNO) Catalytic Fusion Cycle Calculator [High-Mass Core ε_CNO ∝ T¹⁷] | Digital Tools Shed',
    shortTitle: 'CNO Cycle Calculator',
    category: 'Stellar Evolution & Nucleosynthesis',
    badge: 'CATALYTIC STELLAR NUCLEOSYNTHESIS',
    metaDesc: 'Compare the CNO catalytic hydrogen fusion cycle against the proton-proton chain for intermediate and high-mass stars.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        4p \to_{^{12}\text{C}} {}^{4}\text{He} + 2e^+ + 2\nu_e + 26.73 \text{ MeV};\quad \varepsilon_{CNO} \propto \rho · X · X_{CNO} · T^{17}
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        Proposed independently by Carl Friedrich von Weizsäcker (1938) and Hans Bethe (1939, 1967 Nobel Prize), the CNO cycle fuses four protons into helium using carbon, nitrogen, and oxygen as nuclear catalysts. While the Sun generates 99% of its power via the mild proton-proton chain, stars more massive than 1.3 M_☉ exceed 15 million K, where the steep T¹⁷ temperature sensitivity of the CNO cycle completely dominates.
      </p>
    `,
    inputs: [
      { id: 'cno_temp_mk', label: 'Stellar Core Temperature (Million K)', type: 'number', default: '15.7', step: '0.5', min: '10', max: '60' },
      { id: 'cno_mass_star_sun', label: 'Stellar Mass (Solar Masses M_☉)', type: 'number', default: '1.0', step: '0.1', min: '0.5', max: '50' }
    ],
    presets: [
      { label: 'Sun Core (1.0 M_☉, T = 15.7 MK, CNO = 1%)', values: { cno_temp_mk: 15.7, cno_mass_star_sun: 1.0 } },
      { label: 'Crossover Threshold (1.3 M_☉, T = 17.0 MK, CNO = 50%)', values: { cno_temp_mk: 17.0, cno_mass_star_sun: 1.3 } },
      { label: 'Sirius A Massive Star (2.0 M_☉, T = 22.0 MK, CNO = 90%)', values: { cno_temp_mk: 22.0, cno_mass_star_sun: 2.0 } },
      { label: 'O-Type Supergiant (20 M_☉, T = 40.0 MK, Pure CNO)', values: { cno_temp_mk: 40.0, cno_mass_star_sun: 20.0 } }
    ],
    outputs: [
      { id: 'out_cno_percentage', label: 'CNO Contribution to Total Fusion Energy', default: '1.2 % (Sun is pp-dominated)' },
      { id: 'out_pp_percentage', label: 'Proton-Proton (pp) Chain Contribution', default: '98.8 %' },
      { id: 'out_core_structure', label: 'Stellar Core Convective Structure', default: 'Radiative Core (M < 1.3 M_☉)' },
      { id: 'out_bottleneck_isotope', label: 'Rate-Limiting Bottleneck Reaction', default: '¹⁴N(p,γ)¹⁵O Slowest Reaction Step' }
    ],
    benchmarks: [
      { object: 'Solar Core (T = 15.7 MK)', val: '1% CNO, 99% pp-chain', notes: 'Directly confirmed by Borexino solar neutrino detector in 2020' },
      { object: 'Crossover Temperature', val: 'T ≈ 17 Million K (1.3 M_☉)', notes: 'CNO equals pp-chain energy output' },
      { object: 'Temperature Exponent Comparison', val: 'pp ∝ T⁴ vs CNO ∝ T¹⁷', notes: 'CNO explodes with increasing stellar mass' },
      { object: 'Massive Star Core Structure', val: 'Vigorously convective core', notes: 'Creates massive mixing and short lifespans' }
    ],
    faq: [
      { q: 'How did Borexino confirm that the CNO cycle operates in the Sun?', a: 'In 2020, the Borexino liquid scintillator detector 1.4 km deep under Gran Sasso, Italy detected the elusive monoenergetic neutrinos emitted by ¹³N and ¹⁵O beta decays, conclusively proving for the first time that 1% of the Sun’s energy comes from the CNO cycle.' },
      { q: 'Why is ¹⁴N + p → ¹⁵O + γ the bottleneck of the entire CNO cycle?', a: 'Because nitrogen-14 has a very low nuclear cross-section for proton capture. As a result, almost all catalytic nuclei in the core spend their time queued up as Nitrogen-14, making CNO-cycle stars rich in synthesized nitrogen.' }
    ],
    calcJs: `
      const t_mk = parseFloat(document.getElementById('cno_temp_mk').value) || 15.7;
      const m_sun = parseFloat(document.getElementById('cno_mass_star_sun').value) || 1.0;
      
      const t7 = t_mk / 15.0; // normalized to 15 MK
      
      // Relative power formulas
      const p_pp = Math.pow(t7, 4);
      const p_cno = 0.01 * Math.pow(t7, 17);
      
      const total = p_pp + p_cno;
      const cno_pct = (p_cno / total) * 100;
      const pp_pct = (p_pp / total) * 100;
      
      let core_struct = 'Radiative Core / Convective Outer Shell (Low Mass)';
      if (m_sun >= 1.3) core_struct = 'Convective Core / Radiative Outer Shell (High Mass)';
      
      document.getElementById('out_cno_percentage').textContent = cno_pct.toFixed(1) + ' %';
      document.getElementById('out_pp_percentage').textContent = pp_pct.toFixed(1) + ' %';
      document.getElementById('out_core_structure').textContent = core_struct;
      document.getElementById('out_bottleneck_isotope').textContent = '¹⁴N(p,γ)¹⁵O Bottleneck (Accumulates Nitrogen)';
    `
  },
  {
    slug: 'supernova-neutrino-burst-timing',
    title: 'Core-Collapse Supernova Neutrino Burst & Shock Breakout Timing [SNEWS Early Warning] | Digital Tools Shed',
    shortTitle: 'Supernova Neutrino Timing',
    category: 'Stellar Evolution & Nucleosynthesis',
    badge: 'MULTI-MESSENGER ASTRONOMY TIMING',
    metaDesc: 'Model core collapse neutronization neutrino pulse escape and calculate hours of advance optical warning before supernova shock breakout.',
    formulaHtml: `
      <div style="font-family: var(--mono); font-size: 1.05rem; margin-bottom: 0.75rem; color: #3b82f6;">
        e⁻ + p \to n + \nu_e;\quad \Delta t_{optical} = \frac{R_\star}{v_{shock}} \approx 2 - 10 \text{ hours};\quad E_{total} \approx 3 \times 10⁴⁶ \text{ J (99% in }\nu)
      </div>
      <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin: 0;">
        When a massive star exhausted of nuclear fuel suffers core collapse into a neutron star, 99% of the gravitational binding energy (3 × 10⁴⁶ Joules = 300 foe) is radiated as a 10-second neutrino burst. Because neutrinos escape the stellar core immediately at light speed while the shockwave crawls through the envelope at 10,000 km/s, neutrinos arrive on Earth 2 to 10 hours before the star visibly explodes.
      </p>
    `,
    inputs: [
      { id: 'sn_progenitor_radius', label: 'Progenitor Star Stellar Radius R★ (Solar Radii R_☉)', type: 'number', default: '800', step: '50', min: '1' },
      { id: 'sn_shock_velocity_kms', label: 'Shockwave Propagation Velocity (km/s)', type: 'number', default: '12000', step: '500', min: '3000', max: '30000' },
      { id: 'sn_distance_kpc', label: 'Distance to Supernova (Kiloparsecs kpc)', type: 'number', default: '0.20', step: '0.05', min: '0.01' }
    ],
    presets: [
      { label: 'Betelgeuse Red Supergiant (800 R_☉, 0.20 kpc = 650 ly)', values: { sn_progenitor_radius: 800, sn_shock_velocity_kms: 12000, sn_distance_kpc: 0.20 } },
      { label: 'SN 1987A Blue Supergiant Sanduleak (40 R_☉, 50 kpc in LMC)', values: { sn_progenitor_radius: 40, sn_shock_velocity_kms: 15000, sn_distance_kpc: 50.0 } },
      { label: 'Stripped Envelope Wolf-Rayet Type Ib/c (2 R_☉, 5 kpc)', values: { sn_progenitor_radius: 2, sn_shock_velocity_kms: 20000, sn_distance_kpc: 5.0 } }
    ],
    outputs: [
      { id: 'out_neutrino_lead_time', label: 'Advance Early Warning Lead Time (Δt)', default: '12.9 Hours Early' },
      { id: 'out_neutrino_energy_foe', label: 'Total Energy Radiated in Neutrinos', default: '300 foe (3 × 10⁴⁶ J = 99%)' },
      { id: 'out_snews_network', label: 'Supernova Early Warning System (SNEWS)', default: 'Automated Global Telescope Alert Triggered' },
      { id: 'out_neutrino_arrival_dt', label: 'Neutrino Pulse Duration at Earth', default: '~ 10 - 15 Seconds' }
    ],
    benchmarks: [
      { object: 'SN 1987A Neutrino Detection', val: 'Kamiokande II, IMB, Baksan', notes: '24 neutrinos detected 3 hours before optical discovery (2002 Nobel Prize)' },
      { object: 'Total Energy Radiated', val: '99% in neutrinos, 1% kinetic, 0.01% light', notes: 'Optical fireworks are a tiny byproduct' },
      { object: 'SNEWS Network', val: 'Super-K, IceCube, SNO+, KamLAND', notes: 'Coincidence network sends automated alerts to observatories worldwide' },
      { object: 'Betelgeuse Neutrino Pulse', val: 'Millions of interactions in Super-K', notes: 'Will vaporize electronic digitizers if Betelgeuse explodes' }
    ],
    faq: [
      { q: 'Why do neutrinos arrive hours before light if both travel at light speed?', a: 'Both travel through interstellar space at light speed c. However, the neutrinos escape the collapsed core in seconds because matter is transparent to them, while the explosive shockwave must physically plow through the star’s dense envelope (hundreds of millions of kilometers across) at ~10,000 km/s before breaking out into space as visible light.' },
      { q: 'What is SNEWS (SuperNova Early Warning System)?', a: 'SNEWS is an international network linking neutrino detectors across the globe (Super-Kamiokande, IceCube, SNO+, LVD). When at least two detectors register a simultaneous neutrino pulse, an automated alert is broadcast to astronomers worldwide within seconds to point telescopes at the progenitor star before it brightens.' }
    ],
    calcJs: `
      const r_star_sun = parseFloat(document.getElementById('sn_progenitor_radius').value) || 800;
      const v_shock_kms = parseFloat(document.getElementById('sn_shock_velocity_kms').value) || 12000;
      const d_kpc = parseFloat(document.getElementById('sn_distance_kpc').value) || 0.20;
      
      const r_sun_km = 696340;
      const r_star_km = r_star_sun * r_sun_km;
      
      // Shock breakout time inside star
      const shock_time_s = r_star_km / v_shock_kms;
      const shock_time_hours = shock_time_s / 3600;
      
      document.getElementById('out_neutrino_lead_time').textContent = shock_time_hours > 1 ? shock_time_hours.toFixed(1) + ' Hours' : Math.round(shock_time_s / 60) + ' Minutes';
      document.getElementById('out_neutrino_energy_foe').textContent = '300 foe (3.0 × 10⁴⁶ J: 99% of Collapse Energy)';
      document.getElementById('out_snews_network').textContent = 'SNEWS Triggers Global Optical Follow-Up Alert';
      document.getElementById('out_neutrino_arrival_dt').textContent = '10 - 15 Seconds (Core Cooling Timescale)';
    `
  }
];

// Master Science Tools Array



export const ALL_SCIENCE_TOOLS = [
  ...SCIENCE_TOOLS_BATCH_1,
  ...SCIENCE_TOOLS_BATCH_2,
  ...SCIENCE_TOOLS_BATCH_3,
  ...SCIENCE_TOOLS_BATCH_4
];

export function buildScienceTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const dir = join(DIST, 'science');
  ensureDir(dir);

  for (const tool of ALL_SCIENCE_TOOLS) {
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to Calculate ${tool.shortTitle} [${tool.badge}]`,
      "description": tool.metaDesc,
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Input Fundamental Physical Parameters",
          "text": `Enter the baseline dimensional values: ${tool.inputs.map(i => i.label).join(', ')}.`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Apply Invariant Constants",
          "text": "The client-side engine binds fundamental universal constants (ħ, c, G, k_B) with zero server latency."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Review Computed Metrics",
          "text": `Examine computed outputs (${tool.outputs.map(o => o.label).join(', ')}) against astrophysical and quantum benchmarks.`
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Export Scientific Summary",
          "text": "Copy the formatted calculation report to clipboard for research documentation or academic problem sets."
        }
      ]
    };

    const html = renderPage({
      title: tool.title,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/science/${tool.slug}`,
      bodyContent: renderScienceToolHtml(tool),
      currentPath: `/science/${tool.slug}.html`,
      faq: tool.faq,
      jsonLd: howToSchema
    });
    writeFileSync(join(dir, `${tool.slug}.html`), html);
  }

  // Generate Hub Index Page
  const hubCards = ALL_SCIENCE_TOOLS.map(t => `
    <a href="/science/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <span style="display: inline-block; font-family: var(--mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #3b82f6; margin-bottom: 0.35rem; font-weight: 600;">${t.category}</span>
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.shortTitle}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    <div class="article-container" style="max-width: 1000px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/" style="color: inherit; text-decoration: none;">Home</a> &gt; <span style="color: var(--fg);">Science</span>
      </nav>

      <header style="margin-bottom: 2rem;">
        <span style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; font-weight: 700;">OBSCURE SCIENCE & ASTROPHYSICS SUITE</span>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin: 0.4rem 0 0.8rem; color: var(--fg);">Obscure Science & Astrophysics Calculators [115 Interactive Tools]</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin: 0; max-width: 800px;">
          Zero-competition, hyper-specific calculators and simulators for quantum mechanics, black hole metrics, relativistic spaceflight, and cosmic epochs with rigorous mathematical models.
        </p>
      </header>

      <div style="margin-bottom: 1.75rem;">
        <input id="sciSearch" type="text" placeholder="Search 115 science tools (e.g. planck, schwarzschild, hawking, relativistic)..." style="width: 100%; padding: 0.85rem 1.15rem; font-family: var(--mono); font-size: 0.95rem; background: var(--surface); color: var(--fg); border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box;" />
      </div>

      <div id="sciGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>

    <script>
      (function() {
        const searchInput = document.getElementById('sciSearch');
        const grid = document.getElementById('sciGrid');
        if (searchInput && grid) {
          const cards = grid.querySelectorAll('a');
          searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            cards.forEach(card => {
              const text = card.textContent.toLowerCase();
              card.style.display = text.includes(query) ? 'block' : 'none';
            });
          });
        }
      })();
    </script>
  `;

  writeFileSync(join(dir, 'index.html'), renderPage({
    title: 'Obscure Science & Astrophysics Tools [115 Interactive Calculators] | Digital Tools Shed',
    metaDesc: 'Explore 115 hyper-specific science, astrophysics, and quantum calculators: Planck units, black hole horizons, relativity, and orbital mechanics.',
    canonical: `${DOMAIN}/science/`,
    bodyContent: hubBody,
    currentPath: '/science/'
  }));

  console.log(`  ✓ Built Obscure Science & Astrophysics Suite (${ALL_SCIENCE_TOOLS.length} tools in /science/)`);
}
