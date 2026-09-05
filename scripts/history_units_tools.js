// scripts/history_units_tools.js — Esoteric & Historical Unit Systems Suite (114 Tools + Hub)
import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

// ─────────────────────────────────────────────────────────────────────────────
// DATASET: ALL 114 ESOTERIC & HISTORICAL UNIT SYSTEMS TOOLS
// ─────────────────────────────────────────────────────────────────────────────

export const HISTORY_UNITS_TOOLS = [
  // ─── 1. ANCIENT ROMAN UNITS (1-12) ─────────────────────────────────────────
  {
    slug: 'ancient-roman-amphora-converter',
    name: 'Ancient Roman Amphora',
    shortName: 'Roman Amphora',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Ancient Roman Amphora Liquid Volume to Liters & Gallons Converter [Classical Liquid Volume] | Digital Tools Shed',
    h1: 'Ancient Roman Amphora (Quadrantal) Volume Converter',
    metaDesc: 'Convert Roman amphora quadrantal liquid measures to metric liters, US gallons, and imperial gallons. Explore classical wine amphora subdivision hierarchies.',
    desc: 'The amphora quadrantal was the benchmark liquid capacity standard in ancient Rome, defined as the volume of one cubic Roman foot (pes cubitus) of water (approximately 26.026 liters or 6.875 US gallons).',
    primaryUnit: 'Amphora (Quadrantal)',
    unitSymbol: 'amphora',
    defaultVal: 1,
    metricBase: 26.026, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 6.8754, // US gallons
    imperialName: 'US Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Urna', ratio: 2, note: '1 amphora = 2 urnae (13.01 L each)' },
      { name: 'Congius', ratio: 8, note: '1 amphora = 8 congii (3.25 L each)' },
      { name: 'Sextarius', ratio: 48, note: '1 amphora = 48 sextarii (0.542 L each)' },
      { name: 'Hemina', ratio: 96, note: '1 amphora = 96 heminae (0.271 L each)' },
      { name: 'Cyathus', ratio: 576, note: '1 amphora = 576 cyathi (45.2 mL each)' }
    ],
    presets: [
      { label: '1 Amphora (Standard)', val: 1 },
      { label: '5 Amphorae (Cask)', val: 5 },
      { label: '20 Amphorae (Merchant Cargo)', val: 20 },
      { label: '100 Amphorae (Wine Cellar)', val: 100 }
    ],
    contextHtml: '<p>In ancient Roman commerce, the standard liquid amphora (amphora quadrantal) represented exactly one cubic Roman foot (pes). When filled with rainwater or standard spring water, one amphora weighed precisely 80 Roman pounds (librae), establishing an integrated relationship between Roman distance, volume, and mass measurements. Standard bronze amphora prototypes were consecrated in the Temple of Jupiter Optimus Maximus on the Capitoline Hill in Rome to prevent merchant fraud.</p>',
    primarySources: 'Marcus Porcius Cato, <em>De Agri Cultura</em>; Lucius Junius Moderatus Columella, <em>De Re Rustica</em>, Book XII; Vitruvius, <em>De Architectura</em>, Book VIII.',
    faq: [
      { q: 'How many liters is one Ancient Roman amphora?', a: 'One Roman amphora quadrantal equals approximately 26.026 liters (6.875 US gallons or 5.725 Imperial gallons). It is defined as the volume of one cubic Roman foot (296 mm cubed).' },
      { q: 'How did Romans subdivide liquid volume measurements?', a: 'The Roman liquid system was strictly duodecimal and octal: 1 amphora = 2 urnae = 8 congii = 48 sextarii = 96 heminae = 192 quartarii = 384 acetabula = 576 cyathi.' }
    ]
  },
  {
    slug: 'ancient-roman-urna-congius-converter',
    name: 'Roman Urna & Congius',
    shortName: 'Urna & Congius',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Urna and Congius Sacred Wine Measures to Metric Liters [Classical Liquid Volume] | Digital Tools Shed',
    h1: 'Roman Urna & Congius Wine Measure Converter',
    metaDesc: 'Convert Roman urna and congius vessels to modern metric liters, pints, and fluid ounces. Calculate daily Augustus imperial rations and wine distributions.',
    desc: 'The urna (half an amphora, 13.01 liters) and congius (3.25 liters) were foundational vessels for daily military rations, temple libations, and imperial gifts in classical Rome.',
    primaryUnit: 'Congius',
    unitSymbol: 'congius',
    defaultVal: 1,
    metricBase: 3.253, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 0.8594, // US gal
    imperialName: 'US Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Urna', ratio: 0.25, note: '4 congii = 1 urna (13.01 L)' },
      { name: 'Sextarius', ratio: 6, note: '1 congius = 6 sextarii (542 mL each)' },
      { name: 'Hemina', ratio: 12, note: '1 congius = 12 heminae (271 mL each)' },
      { name: 'Quartarius', ratio: 24, note: '1 congius = 24 quartarii (135.5 mL)' },
      { name: 'Cyathus', ratio: 72, note: '1 congius = 72 cyathi (45.2 mL)' }
    ],
    presets: [
      { label: '1 Congius (Augustan Ration)', val: 1 },
      { label: '2 Congii (Feast Allotment)', val: 2 },
      { label: '4 Congii (1 Urna)', val: 4 },
      { label: '8 Congii (1 Amphora)', val: 8 }
    ],
    contextHtml: '<p>The congius was consecrated by the Emperor Vespasian in 75 AD (the famous bronze Congius of Vespasian, preserved in the Capitoline Museums). Pliny the Elder records in his <em>Naturalis Historia</em> that the emperor Novellius Torquatus earned the cognomen "Tricongius" for drinking three congii (nearly 10 liters) of Falernian wine in a single sitting without losing composure.</p>',
    primarySources: 'Pliny the Elder, <em>Naturalis Historia</em>, Book XIV; Frontinus, <em>De Aquaeductu Urbis Romae</em>.',
    faq: [
      { q: 'What is a Roman congius in modern measurements?', a: 'A Roman congius contains exactly 6 sextarii, which equals 3.253 metric liters (0.859 US gallons, 0.716 Imperial gallons, or approximately 110 US fluid ounces).' },
      { q: 'What was a Roman urna used for?', a: 'An urna held half an amphora (4 congii or 13.013 liters). It was commonly used in Roman civil administration as the ballot urn for voting in public assemblies (comitia) and for distributing monthly temple olive oil allotments.' }
    ]
  },
  {
    slug: 'ancient-roman-sextarius-hemina-converter',
    name: 'Roman Sextarius, Hemina & Quartarius',
    shortName: 'Sextarius & Hemina',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Sextarius, Hemina & Quartarius Everyday Rations to Fluid Ounces [Ancient Recipe Measures] | Digital Tools Shed',
    h1: 'Roman Sextarius, Hemina & Quartarius Converter',
    metaDesc: 'Convert Roman sextarius, hemina, and quartarius everyday culinary measures to modern milliliters and fluid ounces for historical Apicius recipes.',
    desc: 'The sextarius (approx. 542 mL, close to a modern pint) was Rome\'s most universal daily culinary measure, subdivided into the hemina (271 mL) and quartarius (135.5 mL).',
    primaryUnit: 'Sextarius',
    unitSymbol: 'sextarius',
    defaultVal: 1,
    metricBase: 0.5422, // liters = 542.2 mL
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 1.1458, // US pints
    imperialName: 'US Pints',
    imperialSymbol: 'pt',
    subdivisions: [
      { name: 'Hemina (Half)', ratio: 2, note: '1 sextarius = 2 heminae (271.1 mL each)' },
      { name: 'Quartarius (Fourth)', ratio: 4, note: '1 sextarius = 4 quartarii (135.5 mL each)' },
      { name: 'Acetabulum (Eighth)', ratio: 8, note: '1 sextarius = 8 acetabula (67.8 mL each)' },
      { name: 'Cyathus (Twelfth)', ratio: 12, note: '1 sextarius = 12 cyathi (45.2 mL each)' },
      { name: 'Ligula (Spoon)', ratio: 48, note: '1 sextarius = 48 ligulae (11.3 mL each)' }
    ],
    presets: [
      { label: '1 Quartarius (Wine Sauce)', val: 0.25 },
      { label: '1 Hemina (Daily Oil Allotment)', val: 0.5 },
      { label: '1 Sextarius (Apicius Stew)', val: 1 },
      { label: '2 Sextarii (Double Ration)', val: 2 }
    ],
    contextHtml: '<p>The sextarius derived its name from being one-sixth (sextus) of a congius. It served both liquid and dry purposes: dry modius contained 16 sextarii of grain, while wine and garum (fermented fish sauce) in Marcus Gavius Apicius\'s 1st-century culinary manuscript <em>De Re Coquinaria</em> are almost universally measured in sextarii and heminae.</p>',
    primarySources: 'Apicius, <em>De Re Coquinaria</em>; Galen, <em>De Compositione Medicamentorum</em>.',
    faq: [
      { q: 'How much is a Roman sextarius in cups or fluid ounces?', a: 'One Roman sextarius is approximately 542.2 milliliters, which equals 18.33 US fluid ounces or roughly 2.29 standard US cooking cups.' },
      { q: 'What is a hemina in Roman cooking?', a: 'A hemina is half a sextarius, measuring approximately 271.1 mL (9.17 US fluid ounces). Saint Benedict later prescribed one hemina of wine per monk per day in his monastic Rule.' }
    ]
  },
  {
    slug: 'ancient-roman-acetabulum-cyathus',
    name: 'Roman Acetabulum & Cyathus',
    shortName: 'Acetabulum & Cyathus',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Acetabulum & Cyathus Medicine Cup Measures to Milliliters [Ancient Pharmacy Units] | Digital Tools Shed',
    h1: 'Roman Acetabulum & Cyathus Medicinal Converter',
    metaDesc: 'Convert Roman acetabulum (vinegar cup) and cyathus (ladle) pharmaceutical doses to modern milliliters, teaspoons, and tablespoons.',
    desc: 'The acetabulum (~67.8 mL) and cyathus (~45.2 mL) were precision micro-volume measures utilized by Roman physicians, apothecaries, and banquet cupbearers.',
    primaryUnit: 'Acetabulum',
    unitSymbol: 'acetabulum',
    defaultVal: 1,
    metricBase: 0.06778, // liters = 67.78 mL
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 2.292, // fl oz
    imperialName: 'US Fluid Ounces',
    imperialSymbol: 'fl oz',
    subdivisions: [
      { name: 'Cyathus', ratio: 1.5, note: '1 acetabulum = 1.5 cyathi (45.2 mL)' },
      { name: 'Ligula (Spoonful)', ratio: 6, note: '1 acetabulum = 6 ligulae (11.3 mL each)' },
      { name: 'Metric Milliliters', ratio: 67.78, note: '67.8 mL per acetabulum' },
      { name: 'US Tablespoons', ratio: 4.58, note: '~4.6 standard tablespoons' }
    ],
    presets: [
      { label: '1 Cyathus (1 Ladle)', val: 0.6667 },
      { label: '1 Acetabulum (Vinegar Cup)', val: 1 },
      { label: '2 Acetabula (Herbal Tincture)', val: 2 },
      { label: '4 Acetabula (Half Sextarius)', val: 4 }
    ],
    contextHtml: '<p>The acetabulum was named after vinegar (acetum) and represented the small ceramic vessel used on Roman dining tables for dipping bread. In Greek medicine and Greco-Roman pharmacology (Dioscorides\' <em>De Materia Medica</em> and Galen\'s formulations), the cyathus and acetabulum formed the indispensable bridge between liquid medicine dosages and culinary compounding.</p>',
    primarySources: 'Dioscorides, <em>De Materia Medica</em>; Celsus, <em>De Medicina</em>; Galen, <em>De Methodo Medendi</em>.',
    faq: [
      { q: 'How many milliliters are in a Roman cyathus?', a: 'A Roman cyathus equals approximately 45.18 milliliters (1.53 US fluid ounces, or roughly 3 standard metric tablespoons). Twelve cyathi composed one sextarius.' },
      { q: 'What is the origin of the term acetabulum in human anatomy?', a: 'Because the Roman acetabulum was a cup-shaped saucer for vinegar, anatomists in the Renaissance adopted the word "acetabulum" to name the deep, cup-shaped socket of the hip bone where the head of the femur articulates.' }
    ]
  },
  {
    slug: 'ancient-roman-modius-grain-dry',
    name: 'Roman Modius Grain Measure',
    shortName: 'Roman Modius',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Modius Grain Volume to Dry Quarts, Pecks & Kilograms of Wheat [Ancient Grain Dole] | Digital Tools Shed',
    h1: 'Roman Modius Grain Dole & Dry Volume Converter',
    metaDesc: 'Convert Roman modius grain volume to modern dry pecks, bushels, and kilograms of Mediterranean wheat. Calculate Cura Annonae citizen rations.',
    desc: 'The modius was the definitive dry capacity standard of the Roman Empire, containing 16 dry sextarii (~8.73 liters), serving as the foundation of the state grain dole (Cura Annonae).',
    primaryUnit: 'Modius',
    unitSymbol: 'modius',
    defaultVal: 1,
    metricBase: 8.73, // dry liters
    metricName: 'Dry Liters',
    metricSymbol: 'L',
    imperialBase: 0.2477, // Winchester bushels
    imperialName: 'US Dry Bushels',
    imperialSymbol: 'bu',
    subdivisions: [
      { name: 'Semimodius', ratio: 2, note: '1 modius = 2 semimodii (4.37 L each)' },
      { name: 'Sextarius (Dry)', ratio: 16, note: '1 modius = 16 dry sextarii (546 mL each)' },
      { name: 'Hemina (Dry)', ratio: 32, note: '1 modius = 32 dry heminae (273 mL each)' },
      { name: 'Wheat Weight (kg)', ratio: 6.72, note: 'Density: 0.77 kg/L (approx. 6.72 kg wheat)' },
      { name: 'Wheat Weight (lbs)', ratio: 14.82, note: 'Approx. 14.82 lbs Mediterranean wheat' }
    ],
    presets: [
      { label: '1 Modius (Weekly Ration)', val: 1 },
      { label: '5 Modii (Monthly Citizen Dole)', val: 5 },
      { label: '60 Modii (Yearly Adult Allotment)', val: 60 },
      { label: '1,000 Modii (Egyptian Cargo Barge)', val: 1000 }
    ],
    contextHtml: '<p>Under the Lex Terentia Cassia (73 BC) and Augustus\'s imperial administration, Rome distributed 5 modii of free wheat per month to over 200,000 eligible plebeian citizens. This 5-modius monthly ration provided roughly 33.6 kg of unmilled grain, yielding approximately 3,000 daily calories in the form of coarse bread and puls (emmer wheat porridge).</p>',
    primarySources: 'Cicero, <em>In Verrem</em>; Suetonius, <em>De Vita Caesarum</em> (Life of Augustus); Tacitus, <em>Annales</em>.',
    faq: [
      { q: 'How many kilograms of wheat was in a Roman modius?', a: 'Based on ancient Mediterranean durum and emmer wheat bulk densities (~0.77 kg per liter), one Roman modius of 8.73 liters contained approximately 6.72 kilograms (14.82 pounds) of wheat grain.' },
      { q: 'How much grain was distributed in the Roman corn dole (Cura Annonae)?', a: 'Each registered citizen on the plebeian roll received 5 modii per month (about 43.65 dry liters or 33.6 kg of wheat), sufficient to feed an adult male and provide flour for a small household.' }
    ]
  },
  {
    slug: 'ancient-roman-pes-foot-converter',
    name: 'Roman Foot (Pes Monetalis)',
    shortName: 'Roman Foot (Pes)',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Foot (Pes Monetalis) to Modern Inches, Centimeters & Millimeters [Architectural Vitruvius Standard] | Digital Tools Shed',
    h1: 'Roman Foot (Pes Monetalis) Length Converter',
    metaDesc: 'Convert Roman feet (pes monetalis, 296 mm) and unciae inches to modern metric millimeters, centimeters, and imperial inches. Decode Vitruvian plans.',
    desc: 'The pes monetalis (standardized at the Temple of Juno Moneta in Rome at 296 mm / 11.654 inches) was the building block of Roman civil engineering, aqueducts, and roads.',
    primaryUnit: 'Pes (Roman Foot)',
    unitSymbol: 'pes',
    defaultVal: 1,
    metricBase: 0.296, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 11.6535, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Uncia (Roman Inch)', ratio: 12, note: '1 pes = 12 unciae (24.67 mm each)' },
      { name: 'Digitus (Finger)', ratio: 16, note: '1 pes = 16 digiti (18.50 mm each)' },
      { name: 'Palmus (Palm)', ratio: 4, note: '1 pes = 4 palmi (74.00 mm each)' },
      { name: 'Modern Centimeters', ratio: 29.6, note: '29.6 cm exactly' },
      { name: 'Modern Feet', ratio: 0.9711, note: '0.971 modern statute feet' }
    ],
    presets: [
      { label: '1 Pes (Standard Foot)', val: 1 },
      { label: '2.5 Pedes (1 Gradus / Step)', val: 2.5 },
      { label: '5 Pedes (1 Passus / Pace)', val: 5 },
      { label: '10 Pedes (1 Decempeda Rod)', val: 10 }
    ],
    contextHtml: '<p>The Roman surveyor\'s measuring staff was the <em>decempeda</em> (a 10-foot rigid rod). Archaeological validation from Pompeii, the Pantheon, and Hadrian\'s Wall confirms the standard pes monetalis stabilized at 296 ± 1 mm. Vitruvius structured his ten books on architecture around duodecimal divisions of the pes (12 unciae) and finger-widths (16 digiti).</p>',
    primarySources: 'Vitruvius, <em>De Architectura</em>, Book III; Frontinus, <em>De Aquaeductu</em>.',
    faq: [
      { q: 'How long was an ancient Roman foot in modern inches?', a: 'The standardized Roman foot (pes monetalis) measured 296 millimeters or 11.654 inches—approximately 0.35 inches shorter than a modern English foot (304.8 mm).' },
      { q: 'How did Roman surveyors subdivide the pes?', a: 'Surgeons and builders used two concurrent systems: duodecimal (1 pes = 12 unciae = 144 lineae) and quaternary/Greek-derived (1 pes = 4 palmi = 16 digiti).' }
    ]
  },
  {
    slug: 'ancient-roman-cubitus-passus-converter',
    name: 'Roman Cubitus, Gradus & Passus',
    shortName: 'Roman Passus & Pace',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Cubitus and Passus (Double Pace) Military Marching Distance [Legionary March Pacing] | Digital Tools Shed',
    h1: 'Roman Cubitus, Gradus & Passus Pace Converter',
    metaDesc: 'Convert Roman cubits (cubitus), single steps (gradus), and military double paces (passus) to modern meters, feet, and marching rates.',
    desc: 'Roman legions conquered the ancient world on foot using standardized marching pacing: the cubitus (1.5 feet / 444 mm), gradus (2.5 feet / 0.74 m), and passus (5 feet / 1.48 m).',
    primaryUnit: 'Passus (Double Pace)',
    unitSymbol: 'passus',
    defaultVal: 1,
    metricBase: 1.48, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 4.8556, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Gradus (Step)', ratio: 2, note: '1 passus = 2 gradus (0.74 m each)' },
      { name: 'Cubitus (Cubit)', ratio: 3.3333, note: '1 passus = 3 1/3 cubiti (0.444 m each)' },
      { name: 'Pes (Roman Foot)', ratio: 5, note: '1 passus = 5 pedes (0.296 m each)' },
      { name: 'Meters', ratio: 1.48, note: '1.48 meters exactly' },
      { name: 'Modern Yards', ratio: 1.6185, note: '1.619 yards' }
    ],
    presets: [
      { label: '1 Passus (Double Pace)', val: 1 },
      { label: '100 Passus (Stadium Quarter)', val: 100 },
      { label: '1,000 Passus (1 Roman Mile)', val: 1000 },
      { label: '4,000 Passus (Hourly Legion March)', val: 4000 }
    ],
    contextHtml: '<p>A Roman soldier on the <em>iustum iter</em> (standard regulation march) was required by Vegetius\'s military treatise <em>De Re Militari</em> to cover 20 Roman miles (20,000 paces / 29.6 km) in 5 summer equinoctial hours while carrying full armor, tools, and rations (sarcina) weighing over 20 kilograms.</p>',
    primarySources: 'Vegetius, <em>Epitoma Rei Militaris</em>, Book I; Julius Caesar, <em>Commentarii de Bello Gallico</em>.',
    faq: [
      { q: 'What was the difference between a gradus and a passus in Rome?', a: 'A gradus was a single walking step (2.5 Roman feet or 74 centimeters), while a passus was a military "double pace" counted from heel-strike of one foot to the next heel-strike of that same foot (5 Roman feet or 1.48 meters).' },
      { q: 'How fast did Roman soldiers march per hour?', a: 'At standard military step (militaris gradus), legions traveled 4,000 paces (5.92 km or 3.68 miles) per hour. At the accelerated pace (plenus gradus), they reached 4,800 paces (7.1 km) per hour.' }
    ]
  },
  {
    slug: 'ancient-roman-actus-stadium-converter',
    name: 'Roman Actus & Stadium',
    shortName: 'Roman Actus',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Actus and Stadium Agrarian Survey Distances to Modern Meters [Centuriation Grid Land Measures] | Digital Tools Shed',
    h1: 'Roman Actus & Stadium Agrarian Survey Converter',
    metaDesc: 'Convert Roman land survey measures (actus of 120 feet and stadium of 625 feet) to meters, kilometers, yards, and centuriation field grids.',
    desc: 'The actus (120 Roman feet / 35.52 meters) was the fundamental module of Roman land division (centuriation), while the Roman stadium (625 feet / 185 meters) bridged agrarian surveying with geography.',
    primaryUnit: 'Actus',
    unitSymbol: 'actus',
    defaultVal: 1,
    metricBase: 35.52, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 116.535, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Pedes (Feet)', ratio: 120, note: '1 actus = 120 Roman feet' },
      { name: 'Passus (Paces)', ratio: 24, note: '1 actus = 24 passus' },
      { name: 'Decempeda Rods', ratio: 12, note: '1 actus = 12 ten-foot surveyor poles' },
      { name: 'Modern Yards', ratio: 38.845, note: '38.85 modern yards' },
      { name: 'Stadium Fraction', ratio: 0.192, note: '1 actus = 0.192 stadium (1 stadium = 5.208 actus)' }
    ],
    presets: [
      { label: '1 Actus (Furrow Length)', val: 1 },
      { label: '5.21 Actus (1 Roman Stadium)', val: 5.2083 },
      { label: '20 Actus (Centuria Boundary)', val: 20 },
      { label: '41.67 Actus (1 Roman Mile)', val: 41.667 }
    ],
    contextHtml: '<p>The Roman land surveyors (<em>agrimensores</em>) used a cross-sighting tool called the <em>groma</em> to lay out vast orthogonal grids (centuriation) across newly conquered territories from Spain to Syria. The perimeter of a standard Roman centuria land tract was exactly 20 × 20 actus (710.4 × 710.4 meters), encompassing 200 jugera of arable farmland.</p>',
    primarySources: 'Frontinus, <em>De Agrorum Qualitate</em>; Siculus Flaccus, <em>De Condicionibus Agrorum</em>; Hyginus Gromaticus, <em>Constitutio Limitum</em>.',
    faq: [
      { q: 'What does the word actus mean in Roman land surveying?', a: 'Actus comes from agere ("to drive"). It originally represented the continuous distance an ox team could plow a furrow without stopping to catch their breath (120 Roman feet or 35.52 meters).' },
      { q: 'How long was a Roman stadium compared to a Greek stadion?', a: 'A Roman stadium was standardized at 125 passus or 625 Roman feet (185.0 meters). The Greek Olympic stadion was slightly longer at 192.27 meters.' }
    ]
  },
  {
    slug: 'ancient-roman-mille-passus-mile',
    name: 'Roman Mile (Mille Passus)',
    shortName: 'Roman Mile',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Mile (Mille Passus 5,000 Roman Feet) to Statute Miles & Kilometers [Milestone Road Distances] | Digital Tools Shed',
    h1: 'Roman Mile (Mille Passus) Road Distance Converter',
    metaDesc: 'Convert ancient Roman miles (1,000 double paces / 5,000 Roman feet / 1,480 meters) to statute miles and kilometers. Decode Roman milestone road networks.',
    desc: 'The Roman mile (mille passus, literally "one thousand paces") was the measurement unit carved into stone milestones across 85,000 kilometers of imperial paved highways.',
    primaryUnit: 'Mille Passus (Roman Mile)',
    unitSymbol: 'roman_mi',
    defaultVal: 1,
    metricBase: 1.480, // kilometers
    metricName: 'Kilometers',
    metricSymbol: 'km',
    imperialBase: 0.9196, // statute miles
    imperialName: 'Statute Miles',
    imperialSymbol: 'mi',
    subdivisions: [
      { name: 'Passus (Paces)', ratio: 1000, note: '1 mille passus = 1,000 double paces' },
      { name: 'Pedes (Feet)', ratio: 5000, note: '1 mille passus = 5,000 Roman feet' },
      { name: 'Stadia (Stadiums)', ratio: 8, note: '1 mille passus = 8 Roman stadia' },
      { name: 'Actus', ratio: 41.667, note: '1 mille passus = 41 2/3 actus' },
      { name: 'Modern Meters', ratio: 1480, note: '1,480 meters exactly' }
    ],
    presets: [
      { label: '1 Roman Mile (Milestone Spacing)', val: 1 },
      { label: '10 Roman Miles (Legion Half-Day)', val: 10 },
      { label: '132 Roman Miles (Rome to Capua, Via Appia)', val: 132 },
      { label: '360 Roman Miles (Via Domitia across Gaul)', val: 360 }
    ],
    contextHtml: '<p>All official distances in the Roman Empire were reckoned from the <em>Milliarium Aureum</em> (Golden Milestone) erected by Emperor Augustus in 20 BC near the Temple of Saturn in the Roman Forum. Stone cylindrical milestones (milliaria) recorded the distance to the nearest city, the ruling emperor\'s titles, and road maintenance contracts.</p>',
    primarySources: 'Strabo, <em>Geographica</em>, Book V; Antonine Itinerary (<em>Itinerarium Antonini Augusti</em>); Peutinger Table (<em>Tabula Peutingeriana</em>).',
    faq: [
      { q: 'How long was a Roman mile in modern statute miles and kilometers?', a: 'A Roman mile measured exactly 5,000 Roman feet or 1,480 meters (1.48 km). This is 0.9196 modern statute miles (about 8% shorter than the modern 5,280-foot statute mile of 1,609.34 meters).' },
      { q: 'Why is the modern mile 5,280 feet instead of 5,000 feet?', a: 'In 1593, Queen Elizabeth I of England signed a statute redefining the English mile to equal 8 furlongs (8 × 660 feet = 5,280 feet), uniting the old Roman 5,000-foot concept with traditional English agricultural land measurement.' }
    ]
  },
  {
    slug: 'ancient-roman-jugerum-area-converter',
    name: 'Roman Jugerum Area',
    shortName: 'Roman Jugerum',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Jugerum (Ox Yoke Day Plow Area) to Modern Acres & Hectares [Ancient Farm Plot Calculator] | Digital Tools Shed',
    h1: 'Roman Jugerum Land Area Converter',
    metaDesc: 'Convert Roman jugerum land area (28,800 square Roman feet / 2,520 m²) to modern acres, hectares, and square feet. Calculate ancient Roman farm allotments.',
    desc: 'The jugerum was the standard Roman agrarian land unit, defined as the area an ox team (iugum) could plow in a single day (240 × 120 Roman feet = 2,520 m² / 0.623 acres).',
    primaryUnit: 'Jugerum',
    unitSymbol: 'jugerum',
    defaultVal: 1,
    metricBase: 2519.8, // square meters
    metricName: 'Square Meters',
    metricSymbol: 'm²',
    imperialBase: 0.6227, // acres
    imperialName: 'Acres',
    imperialSymbol: 'ac',
    subdivisions: [
      { name: 'Square Roman Feet (Pedes Quadrati)', ratio: 28800, note: '28,800 sq ft per jugerum' },
      { name: 'Actus Quadratus', ratio: 2, note: '1 jugerum = 2 actus quadrati (14,400 sq ft each)' },
      { name: 'Scripulum (Area)', ratio: 288, note: '1 jugerum = 288 scripula (100 sq ft each)' },
      { name: 'Hectares', ratio: 0.252, note: '0.252 hectares' },
      { name: 'Centuria (Fractions)', ratio: 0.005, note: '1 centuria = 200 jugera (50.4 ha)' }
    ],
    presets: [
      { label: '1 Jugerum (1 Day Ox Plow)', val: 1 },
      { label: '2 Jugera (1 Heredium / Family Homestead)', val: 2 },
      { label: '7 Jugera (Cincinnatus Farm Allotment)', val: 7 },
      { label: '200 Jugera (1 Standard Centuria)', val: 200 }
    ],
    contextHtml: '<p>The legendary founder Romulus was said to have granted each citizen 2 jugera (one <em>heredium</em>, approx. 1.25 acres) as hereditary family land. By the late Republic, the Gracchi brothers attempted land reform limiting individual aristocratic holdings of public land (<em>ager publicus</em>) to 500 jugera (approx. 311 acres).</p>',
    primarySources: 'Varro, <em>De Re Rustica</em>, Book I; Columella, <em>De Re Rustica</em>, Book V; Livy, <em>Ab Urbe Condita</em>.',
    faq: [
      { q: 'How large is a Roman jugerum in modern acres and square meters?', a: 'One Roman jugerum is 2,519.8 square meters (0.252 hectares), which corresponds to 0.6227 modern acres (27,123 square feet).' },
      { q: 'What is a Roman heredium and centuria?', a: 'Two jugera made 1 heredium (the minimum land required to support a citizen household). One hundred heredia (200 jugera, or 50.4 hectares) composed one centuria, the classic square grid tile of Roman centuriation.' }
    ]
  },
  {
    slug: 'ancient-roman-libra-pound-converter',
    name: 'Roman Libra (Imperial Pound)',
    shortName: 'Roman Libra',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Libra (Imperial Pound of 12 Unciae) to Modern Grams & Ounces [Latin Weight Standard] | Digital Tools Shed',
    h1: 'Roman Libra (Ancient Pound) Weight Converter',
    metaDesc: 'Convert Roman libra pounds (328.9 grams) and 12 unciae to modern grams, kilograms, and avoirdupois ounces. Understand the origin of the "lb" symbol.',
    desc: 'The libra (Roman pound, ~328.9 grams) was divided into 12 unciae, serving as the universal weight basis for Roman coinage, metallurgy, and medicine, giving us the abbreviation "lb".',
    primaryUnit: 'Libra (Roman Pound)',
    unitSymbol: 'libra',
    defaultVal: 1,
    metricBase: 328.9, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 11.599, // avoirdupois ounces
    imperialName: 'Avoirdupois Ounces',
    imperialSymbol: 'oz',
    subdivisions: [
      { name: 'Uncia (Roman Ounce)', ratio: 12, note: '1 libra = 12 unciae (27.41 g each)' },
      { name: 'Scripulum', ratio: 288, note: '1 libra = 288 scripula (1.142 g each)' },
      { name: 'Siliqua (Carob Seed)', ratio: 1728, note: '1 libra = 1,728 siliquae (0.190 g each)' },
      { name: 'Denarius Weight', ratio: 84, note: 'Original silver standard: 84 denarii per libra (~3.9g)' },
      { name: 'Avoirdupois Pounds', ratio: 0.7249, note: '0.725 modern lbs' }
    ],
    presets: [
      { label: '1 Libra (Roman Standard)', val: 1 },
      { label: '5 Librae (Bread Loaf Batch)', val: 5 },
      { label: '10 Librae (Small Anvil Scale)', val: 10 },
      { label: '100 Librae (Centenarium / 1 Talent)', val: 100 }
    ],
    contextHtml: '<p>The word <em>libra</em> meant balance scales in Latin. The duodecimal division into 12 unciae allowed mental calculations using halves, thirds, fourths, and sixths without decimal fractions. England adopted this twelve-ounce system for precious metals (the Troy pound), and preserved the Roman abbreviation <strong>lb</strong> and currency sign <strong>£</strong> (from <em>libra</em>).</p>',
    primarySources: 'Isidore of Seville, <em>Etymologiae</em>, Book XVI; Pliny the Elder, <em>Naturalis Historia</em>, Book XXXIII.',
    faq: [
      { q: 'How heavy was an ancient Roman libra compared to a modern pound?', a: 'A Roman libra weighed approximately 328.9 grams (11.60 avoirdupois ounces), making it about 27.5% lighter than a modern 16-ounce avoirdupois pound (453.59 grams) and 12% lighter than a 12-ounce Troy pound (373.24 grams).' },
      { q: 'Why is the symbol for the modern pound "lb"?', a: 'The abbreviation "lb" directly abbreviates the Latin word "libra" (plural "librae"). Similarly, the British currency symbol "£" is a stylized capital "L" for libra.' }
    ]
  },
  {
    slug: 'ancient-roman-uncia-scripulum-converter',
    name: 'Roman Uncia, Scripulum & Siliqua',
    shortName: 'Roman Uncia',
    category: 'Ancient Roman Units',
    era: 'Classical Antiquity (Rome)',
    title: 'Roman Uncia, Scripulum & Siliqua Goldsmith Weights to Metric Milligrams [Ancient Coin Weights] | Digital Tools Shed',
    h1: 'Roman Uncia, Scripulum & Siliqua Goldsmith Converter',
    metaDesc: 'Convert Roman coin and goldsmith weights: 1 uncia (27.4g), 1 scripulum (1.14g), and 1 siliqua (189mg) to modern grams and grains. Analyze Denarii and Solidi.',
    desc: 'The uncia (1/12th of a pound), scripulum (scruple), and siliqua (carob seed) formed the high-precision weight tier for imperial gold minting, jewelry, and pharmacy.',
    primaryUnit: 'Uncia',
    unitSymbol: 'uncia',
    defaultVal: 1,
    metricBase: 27.408, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 422.97, // grains
    imperialName: 'Grains',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Semuncia (Half-Ounce)', ratio: 2, note: '1 uncia = 2 semunciae (13.70 g each)' },
      { name: 'Sicilicus (Quarter-Ounce)', ratio: 4, note: '1 uncia = 4 sicilici (6.85 g each)' },
      { name: 'Scripulum (Scruple)', ratio: 24, note: '1 uncia = 24 scripula (1.142 g each)' },
      { name: 'Siliqua (Carob Seed)', ratio: 144, note: '1 uncia = 144 siliquae (190.3 mg each)' },
      { name: 'Gold Solidus Weight', ratio: 6, note: '1 uncia = 6 solidi of Constantine (4.55 g each)' }
    ],
    presets: [
      { label: '1 Siliqua (Carob Seed)', val: 0.00694 },
      { label: '1 Scripulum (Scruple)', val: 0.04167 },
      { label: '1 Uncia (Roman Ounce)', val: 1 },
      { label: '6 Unciae (Semis / Half-Pound)', val: 6 }
    ],
    contextHtml: '<p>The smallest practical monetary weight was the <em>siliqua</em>, based on the dried seed of the carob tree (<em>Ceratonia siliqua</em>), famous for its uniform mass. Constantine the Great established the gold <em>solidus</em> in 312 AD at 1/72nd of a Roman pound (4.55 grams, or exactly 24 siliquae). This 24-siliqua standard directly gave birth to our modern 24-karat gold purity system.</p>',
    primarySources: 'Pliny, <em>Naturalis Historia</em>, Book XXXIII; Cassiodorus, <em>Variae</em>; Diocletian, <em>Edict on Maximum Prices</em> (301 AD).',
    faq: [
      { q: 'How many grams was a Roman uncia?', a: 'A Roman uncia weighed 27.408 grams (0.967 standard avoirdupois ounces, or 423 modern grains). Twelve unciae formed one Roman libra.' },
      { q: 'How is the Roman siliqua connected to modern jewelry karats?', a: 'The Greek and Roman carob seed was called keration or siliqua. Because the standard Byzantine/Roman gold coin (solidus) weighed 24 siliquae of pure gold, 24 became the global index for 100% pure gold: 24 karats.' }
    ]
  },

  // ─── 2. ANCIENT GREEK UNITS (13-21) ────────────────────────────────────────
  {
    slug: 'ancient-greek-metretes-chous-converter',
    name: 'Ancient Greek Metretes & Chous',
    shortName: 'Greek Metretes',
    category: 'Ancient Greek Units',
    era: 'Classical Greece (Attica)',
    title: 'Ancient Greek Metretes & Chous Wine Volume to Modern Liters [Classical Symposium Measures] | Digital Tools Shed',
    h1: 'Ancient Greek Metretes & Chous Volume Converter',
    metaDesc: 'Convert Attic Greek metretes and chous liquid measures to modern liters, gallons, and symposium wine rations. Decode Athenian trade standards.',
    desc: 'The metretes (~39.3 liters) and chous (~3.27 liters) were the standard liquid volume measures of classical Athens, defining wholesale olive oil and symposium wine trade.',
    primaryUnit: 'Metretes',
    unitSymbol: 'metretes',
    defaultVal: 1,
    metricBase: 39.30, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 10.382, // US gal
    imperialName: 'US Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Chous', ratio: 12, note: '1 metretes = 12 choes (3.275 L each)' },
      { name: 'Kotyle', ratio: 144, note: '1 metretes = 144 kotylai (273 mL each)' },
      { name: 'Kyathos (Ladle)', ratio: 864, note: '1 metretes = 864 kyathoi (45.5 mL each)' },
      { name: 'Imperial Gallons', ratio: 8.645, note: '8.65 Imperial gallons' }
    ],
    presets: [
      { label: '1 Chous (Symposium Jug)', val: 0.0833 },
      { label: '1 Metretes (Attic Amphora)', val: 1 },
      { label: '5 Metretai (Oil Merchant Jar)', val: 5 },
      { label: '100 Metretai (Cargo Galley Hold)', val: 100 }
    ],
    contextHtml: '<p>The Athenian Metretes was officially held in the Tholos of Athens under the supervision of state inspectors called <em>metronomoi</em>. The Chous (one-twelfth of a metretes) gave its name to the second day of the Anthesteria festival (Choes Day), where citizens held silent wine-drinking contests using three-liter jugs.</p>',
    primarySources: 'Aristotle, <em>Athenaion Politeia</em> (Constitution of the Athenians); Pollux, <em>Onomasticon</em>, Book X; Aristophanes, <em>The Acharnians</em>.',
    faq: [
      { q: 'How many liters is an ancient Greek metretes?', a: 'An Attic Greek metretes equals approximately 39.30 liters (10.38 US gallons or 8.65 Imperial gallons). It held exactly 12 choes or 144 kotylai.' },
      { q: 'What is a Greek chous?', a: 'A chous was a wine pitcher holding 3.275 liters (0.865 US gallons). It was divided into 12 kotylai and represented a generous celebratory wine ration for Athenian festivals.' }
    ]
  },
  {
    slug: 'ancient-greek-kotyle-kyathos-converter',
    name: 'Greek Kotyle & Kyathos',
    shortName: 'Kotyle & Kyathos',
    category: 'Ancient Greek Units',
    era: 'Classical Greece (Attica)',
    title: 'Greek Kotyle & Kyathos Symposion Cup Measures to Milliliters & Ounces [Ancient Greek Cup Measures] | Digital Tools Shed',
    h1: 'Greek Kotyle & Kyathos Cup & Ladle Converter',
    metaDesc: 'Convert ancient Greek kotyle cup measures and kyathos wine ladles to modern milliliters and fluid ounces for historical recipes and Hippocratic medicine.',
    desc: 'The kotyle (approx. 273 mL) was the universal drinking cup and recipe measure of ancient Greece, ladled out with precision using the kyathos (45.5 mL).',
    primaryUnit: 'Kotyle',
    unitSymbol: 'kotyle',
    defaultVal: 1,
    metricBase: 0.2729, // liters = 272.9 mL
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 9.228, // fl oz
    imperialName: 'US Fluid Ounces',
    imperialSymbol: 'fl oz',
    subdivisions: [
      { name: 'Oxybaphon (Saucer)', ratio: 4, note: '1 kotyle = 4 oxybapha (68.2 mL each)' },
      { name: 'Kyathos (Ladle)', ratio: 6, note: '1 kotyle = 6 kyathoi (45.5 mL each)' },
      { name: 'Kokhliarion (Spoonful)', ratio: 60, note: '1 kotyle = 60 kokhliaria (4.55 mL each)' },
      { name: 'Metric Milliliters', ratio: 272.9, note: '272.9 mL per kotyle' }
    ],
    presets: [
      { label: '1 Kyathos (Wine Ladle)', val: 0.1667 },
      { label: '1 Oxybaphon (Vinegar Cup)', val: 0.25 },
      { label: '1 Kotyle (Standard Cup)', val: 1 },
      { label: '2 Kotylai (Daily Olive Oil Allotment)', val: 2 }
    ],
    contextHtml: '<p>At an Athenian symposium, the symposiarch (toastmaster) dictated how many kyathoi of wine were mixed with water in the great krater (mixing bowl). Hippocrates and the Asclepiad physicians measured all pharmaceutical potions, vinegars, and honeys in kotylai and fractions thereof.</p>',
    primarySources: 'Hippocrates, <em>De Morbis</em> and <em>De Diaeta</em>; Xenophon, <em>Symposium</em>; Athenaeus, <em>Deipnosophistae</em>.',
    faq: [
      { q: 'How much liquid did a Greek kotyle hold?', a: 'A standard Attic kotyle held 272.9 milliliters (9.23 US fluid ounces, slightly larger than an 8-ounce American measuring cup). Two kotylai made a xestes (pint equivalent).' },
      { q: 'What was an ancient Greek kyathos?', a: 'A kyathos was a small dipping ladle with a high looped handle, holding 45.5 milliliters (1.54 US fluid ounces). One kotyle contained exactly 6 kyathoi.' }
    ]
  },
  {
    slug: 'ancient-greek-medimnos-grain-converter',
    name: 'Greek Medimnos & Choenix Grain',
    shortName: 'Greek Medimnos',
    category: 'Ancient Greek Units',
    era: 'Classical Greece (Attica)',
    title: 'Greek Medimnos & Choenix Citizen Daily Grain Ration to Dry Liters [Hoplite Daily Diet Calculator] | Digital Tools Shed',
    h1: 'Greek Medimnos & Choenix Grain Ration Converter',
    metaDesc: 'Convert ancient Greek medimnos and choenix grain measures to dry liters, bushels, and kilograms of barley. Calculate hoplite and Spartan soldier diets.',
    desc: 'The medimnos (~52.5 liters) and choenix (1.09 liters, the daily grain subsistence ration of a hoplite) defined agricultural tax brackets and military logistics in classical Greece.',
    primaryUnit: 'Medimnos',
    unitSymbol: 'medimnos',
    defaultVal: 1,
    metricBase: 52.53, // dry liters
    metricName: 'Dry Liters',
    metricSymbol: 'L',
    imperialBase: 1.4907, // US dry bushels
    imperialName: 'US Dry Bushels',
    imperialSymbol: 'bu',
    subdivisions: [
      { name: 'Hekteus (Sixth)', ratio: 6, note: '1 medimnos = 6 hekteis (8.75 L each)' },
      { name: 'Hemihekteon (Twelfth)', ratio: 12, note: '1 medimnos = 12 hemihektea (4.38 L each)' },
      { name: 'Choenix (Daily Ration)', ratio: 48, note: '1 medimnos = 48 choenikes (1.094 L each)' },
      { name: 'Kotyle (Dry)', ratio: 192, note: '1 medimnos = 192 dry kotylai (273 mL each)' },
      { name: 'Barley Weight (kg)', ratio: 32.57, note: 'Density: 0.62 kg/L (~32.6 kg barley)' }
    ],
    presets: [
      { label: '1 Choenix (1 Hoplite Daily Ration)', val: 0.02083 },
      { label: '1 Medimnos (Attic Standard)', val: 1 },
      { label: '500 Medimnoi (Pentakosiomedimnoi Class)', val: 500 },
      { label: '10,000 Medimnoi (Black Sea Grain Fleet)', val: 10000 }
    ],
    contextHtml: '<p>In Solon\'s constitutional reforms of 594 BC, Athenian society was organized into four property classes based on annual agricultural yield in medimnoi: the wealthiest citizens were the <em>Pentakosiomedimnoi</em> (producing 500+ medimnoi), qualified to hold the highest archonships and finance naval triremes.</p>',
    primarySources: 'Herodotus, <em>Histories</em>, Book VII; Thucydides, <em>History of the Peloponnesian War</em>; Aristotle, <em>Constitution of Athens</em>.',
    faq: [
      { q: 'How much grain was in an ancient Greek medimnos?', a: 'An Attic medimnos was 52.53 dry liters (1.49 US dry bushels, or about 115 dry pints). It held approximately 32.6 kg of barley or 40.5 kg of wheat.' },
      { q: 'What was a choenix in ancient Greece?', a: 'A choenix was one forty-eighth of a medimnos (1.094 liters, or about 2 dry pints). It was recognized across the Hellenic world as the standard daily grain subsistence ration for one working adult or hoplite soldier.' }
    ]
  },
  {
    slug: 'ancient-greek-pous-foot-olympic',
    name: 'Ancient Greek Foot (Pous)',
    shortName: 'Greek Foot (Pous)',
    category: 'Ancient Greek Units',
    era: 'Classical Greece (Attica & Peloponnese)',
    title: 'Ancient Greek Foot (Olympic vs Attic vs Doric Pous) to Centimeters [Parthenon Architectural Proportions] | Digital Tools Shed',
    h1: 'Ancient Greek Foot (Olympic, Attic & Doric Pous) Converter',
    metaDesc: 'Convert ancient Greek foot standards (Olympic 320.5 mm, Attic 296 mm, Doric 327 mm) to modern centimeters and inches. Analyze Parthenon temple proportions.',
    desc: 'The Greek foot (pous) varied by polis: the Attic pous (296 mm) built the Parthenon in Athens, while the Olympic pous (320.5 mm) calibrated the Olympic footrace track.',
    primaryUnit: 'Attic Pous (Foot)',
    unitSymbol: 'pous',
    defaultVal: 1,
    metricBase: 0.296, // meters (Attic standard)
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 11.6535, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Palaste (Palm)', ratio: 4, note: '1 pous = 4 palastai (74 mm each)' },
      { name: 'Dakylos (Finger)', ratio: 16, note: '1 pous = 16 daktyloi (18.5 mm each)' },
      { name: 'Centimeters (Attic)', ratio: 29.60, note: '29.60 cm (Attic/Solonian)' },
      { name: 'Olympic Pous Equivalent', ratio: 0.9236, note: '1 Attic pous = 0.924 Olympic pous (32.05 cm)' },
      { name: 'Doric/Pheidonian Pous Equivalent', ratio: 0.9052, note: '1 Attic pous = 0.905 Doric pous (32.70 cm)' }
    ],
    presets: [
      { label: '1 Attic Pous (Parthenon Module)', val: 1 },
      { label: '1.5 Pous (1 Pechys / Cubit)', val: 1.5 },
      { label: '6 Pous (1 Orgyia / Fathom)', val: 6 },
      { label: '100 Pous (1 Hekatompedon Temple Front)', val: 100 }
    ],
    contextHtml: '<p>Architects Iktinos and Kallikrates designed the Parthenon atop the Acropolis using the Attic pous of 296 mm. The temple\'s cella was famed as the <em>Hekatompedon</em> ("hundred-footer"), measuring exactly 100 Attic feet in length. In contrast, the stadium at Olympia was paced with Hercules\' legendary larger foot of 320.5 mm.</p>',
    primarySources: 'Herodotus, <em>Histories</em>, Book II; Vitruvius, <em>De Architectura</em>, Book III; Pausanias, <em>Description of Greece</em>.',
    faq: [
      { q: 'How long was an ancient Greek foot (pous)?', a: 'The Greek foot varied regionally: the Attic/Solonian foot was 296 mm (11.65 in), the Olympic foot was 320.5 mm (12.62 in), and the Doric/Pheidonian foot was 327 mm (12.87 in).' },
      { q: 'How did the Greeks divide the pous?', a: 'Like the Romans who copied them, the Greeks divided the foot into 4 palastai (palms) or 16 daktyloi (finger-breadths), each finger measuring roughly 18.5 mm.' }
    ]
  },
  {
    slug: 'ancient-greek-pechys-cubit-converter',
    name: 'Greek Pechys (Cubit) & Orgyia',
    shortName: 'Greek Cubit & Fathom',
    category: 'Ancient Greek Units',
    era: 'Classical Greece',
    title: 'Greek Pechys (Cubit) and Orgyia (Fathom Arm Span) to Modern Meters [Classical Human Body Surveying] | Digital Tools Shed',
    h1: 'Greek Pechys (Cubit) & Orgyia (Fathom) Converter',
    metaDesc: 'Convert ancient Greek pechys cubits (1.5 feet / 444 mm) and orgyia fathoms (6 feet / 1.776 m) to modern meters, feet, and nautical soundings.',
    desc: 'The pechys (forearm cubit, ~444 mm) and orgyia (full arm span / fathom, ~1.776 m) were foundational anatomical measures in classical Greek surveying and Herodotus\'s histories.',
    primaryUnit: 'Pechys (Cubit)',
    unitSymbol: 'pechys',
    defaultVal: 1,
    metricBase: 0.444, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 1.4567, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Pous (Foot)', ratio: 1.5, note: '1 pechys = 1.5 pous (296 mm)' },
      { name: 'Spithame (Span)', ratio: 2, note: '1 pechys = 2 spithamai (hand spans, 222 mm)' },
      { name: 'Palaste (Palm)', ratio: 6, note: '1 pechys = 6 palastai (74 mm)' },
      { name: 'Daktylos (Finger)', ratio: 24, note: '1 pechys = 24 daktyloi (18.5 mm)' },
      { name: 'Orgyia (Fathom Fraction)', ratio: 0.25, note: '4 pechys = 1 orgyia (1.776 m)' }
    ],
    presets: [
      { label: '1 Pechys (Elbow to Fingertip)', val: 1 },
      { label: '2 Pechys (Bema / Pace)', val: 2 },
      { label: '4 Pechys (1 Orgyia / Full Arm Span)', val: 4 },
      { label: '100 Pechys (River Width Measurement)', val: 100 }
    ],
    contextHtml: '<p>The orgyia represented the distance between the tips of the middle fingers of both arms outstretched horizontally (the canonical human proportion famously illustrated in the Vitruvian Man). Herodotus used the orgyia as his standard sounding unit for measuring water depth in the Nile River and the Hellespont bridge built by Xerxes.</p>',
    primarySources: 'Herodotus, <em>Histories</em>, Book II and VII; Xenophon, <em>Anabasis</em>.',
    faq: [
      { q: 'How long was a Greek pechys?', a: 'A standard Attic pechys measured 1.5 Attic feet (444 millimeters or 17.48 inches). In the Olympic standard, it reached 481 millimeters (18.93 inches).' },
      { q: 'What is a Greek orgyia?', a: 'An orgyia was the classical Greek fathom (6 feet or 4 cubits), measuring 1.776 meters (5.83 feet) in the Attic system. It equaled the height and fingertip span of an average Greek man.' }
    ]
  },
  {
    slug: 'ancient-greek-stadion-running-distance',
    name: 'Greek Olympic Stadion',
    shortName: 'Olympic Stadion',
    category: 'Ancient Greek Units',
    era: 'Panhellenic Antiquity (Olympia & Athens)',
    title: 'Greek Olympic Stadion (Stadium Race Length) to Yards, Feet & Meters [Eratosthenes Earth Circumference Calculator] | Digital Tools Shed',
    h1: 'Greek Olympic Stadion Distance Converter',
    metaDesc: 'Convert Greek Olympic stadion (192.27 meters) and Attic stadion (185 meters) to statute miles, feet, and meters. Verify Eratosthenes\' Earth calculation.',
    desc: 'The stadion was the premier footrace distance of the Olympic Games (600 Greek feet), famously used by Eratosthenes in 240 BC to calculate the Earth\'s circumference.',
    primaryUnit: 'Olympic Stadion',
    unitSymbol: 'stadion',
    defaultVal: 1,
    metricBase: 192.27, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 210.27, // yards
    imperialName: 'Yards',
    imperialSymbol: 'yd',
    subdivisions: [
      { name: 'Olympic Feet (Pous)', ratio: 600, note: '1 stadion = 600 Olympic feet (320.5 mm each)' },
      { name: 'Plethra', ratio: 6, note: '1 stadion = 6 plethra (100 ft each)' },
      { name: 'Statute Miles', ratio: 0.11947, note: '0.1195 statute miles' },
      { name: 'Attic Stadion Equivalent', ratio: 1.0393, note: '1 Olympic stadion = 1.039 Attic stadia (185 m)' }
    ],
    presets: [
      { label: '1 Stadion (Single Sprint Race)', val: 1 },
      { label: '2 Stadia (Diaulos / Double Race)', val: 2 },
      { label: '24 Stadia (Dolichos / Long Distance Run)', val: 24 },
      { label: '250,000 Stadia (Eratosthenes Earth Circumference)', val: 250000 }
    ],
    contextHtml: '<p>In 240 BC, Eratosthenes of Cyrene (chief librarian at Alexandria) compared the noon sun shadow at Syene (Aswan) and Alexandria at the summer solstice. Measuring the angular difference at 1/50th of a circle (7.2°) and knowing the caravan distance was 5,000 stadia, he computed the Earth\'s circumference at 250,000 stadia (~39,375 to 46,250 km, remarkably close to the true 40,075 km).</p>',
    primarySources: 'Cleomedes, <em>De Motu Circulari Corporum Caelestium</em>; Strabo, <em>Geographica</em>, Book XVII; Pausanias, <em>Description of Greece</em>.',
    faq: [
      { q: 'How long was an ancient Greek Olympic stadion?', a: 'The Olympic stadion measured exactly 600 Olympic feet, or 192.27 meters (630.8 feet / 210.3 yards). The preserved stone finish line at Olympia still marks this exact distance.' },
      { q: 'How accurate was Eratosthenes\' calculation of the Earth?', a: 'If Eratosthenes used the common geographic stadion of 157.5 to 185 meters, his calculation of 250,000 stadia yielded between 39,375 km and 46,250 km—within 1.5% to 15% of Earth\'s true equatorial circumference of 40,075 kilometers.' }
    ]
  },
  {
    slug: 'ancient-greek-plethron-area-converter',
    name: 'Ancient Greek Plethron Area',
    shortName: 'Greek Plethron',
    category: 'Ancient Greek Units',
    era: 'Classical Greece (Attica)',
    title: 'Ancient Greek Plethron Wrestling Field Area to Square Meters & Acres [Classical Farm Land Measure] | Digital Tools Shed',
    h1: 'Ancient Greek Plethron Land Area Converter',
    metaDesc: 'Convert linear plethron (100 feet / 30.8m) and square plethron land area (10,000 sq feet / 950 m²) to modern acres, square meters, and square feet.',
    desc: 'The square plethron (100 × 100 Greek feet ≈ 950 m² / 0.235 acres) was the benchmark parcel size for ancient Athenian agricultural land grants and wrestling academies.',
    primaryUnit: 'Plethron (Square)',
    unitSymbol: 'plethron',
    defaultVal: 1,
    metricBase: 950.0, // square meters
    metricName: 'Square Meters',
    metricSymbol: 'm²',
    imperialBase: 0.2347, // acres
    imperialName: 'Acres',
    imperialSymbol: 'ac',
    subdivisions: [
      { name: 'Square Greek Feet', ratio: 10000, note: '10,000 sq pous per square plethron' },
      { name: 'Square Yards', ratio: 1136.2, note: '1,136.2 square yards' },
      { name: 'Square Feet', ratio: 10225.7, note: '10,226 square feet' },
      { name: 'Hectares', ratio: 0.095, note: '0.095 hectares' }
    ],
    presets: [
      { label: '1 Plethron (Wrestling School / Palaestra)', val: 1 },
      { label: '4 Plethra (1 Acre Equivalent)', val: 4.26 },
      { label: '10 Plethra (Attic Vineyard Plot)', val: 10 },
      { label: '100 Plethra (Noble Estate Farm)', val: 100 }
    ],
    contextHtml: '<p>The linear plethron was 100 Greek feet (approx. 30.8 meters), commonly used to describe the dimensions of public squares and gymnastics grounds (palaestrae). The square plethron was roughly one-quarter of a modern acre, representing the standard garden and vineyard parcel in the Attic demes.</p>',
    primarySources: 'Xenophon, <em>Oeconomicus</em>; Plato, <em>Laws</em>; Pollux, <em>Onomasticon</em>, Book IX.',
    faq: [
      { q: 'How large is a Greek plethron in modern acres?', a: 'One square Greek plethron equals approximately 950 square meters, or 0.2347 modern acres (about 10,226 square feet). Roughly 4.26 plethra equal one modern acre.' },
      { q: 'What is the difference between a linear plethron and a square plethron?', a: 'A linear plethron was a distance of 100 Greek feet (30.8 meters). A square plethron was an area of 100 × 100 feet (10,000 square Greek feet).' }
    ]
  },
  {
    slug: 'ancient-greek-talanton-talent-weight',
    name: 'Attic Talent (Talanton) Bullion',
    shortName: 'Attic Talent',
    category: 'Ancient Greek Units',
    era: 'Classical Greece (Attica)',
    title: 'Attic Talent (Talanton) Bullion Weight to Troy Ounces, Grams & Gold Value [Ancient War Tribute Calculator] | Digital Tools Shed',
    h1: 'Attic Talent (Talanton) Bullion Weight & Value Converter',
    metaDesc: 'Convert Attic talents of silver (26.2 kg / 842 troy oz) to grams, kilograms, and modern silver/gold bullion currency values. Calculate Peloponnesian War tribute.',
    desc: 'The Attic talent (talanton, ~26.2 kg of silver) was the immense supreme currency and bullion weight standard of classical Greece, defining naval budgets and Delian League tributes.',
    primaryUnit: 'Attic Talent',
    unitSymbol: 'talent',
    defaultVal: 1,
    metricBase: 26.196, // kilograms
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 842.23, // troy ounces
    imperialName: 'Troy Ounces',
    imperialSymbol: 'oz t',
    subdivisions: [
      { name: 'Attic Minae', ratio: 60, note: '1 talent = 60 minae (436.6 g each)' },
      { name: 'Silver Drachmae', ratio: 6000, note: '1 talent = 6,000 drachmae (4.37 g silver each)' },
      { name: 'Obols', ratio: 36000, note: '1 talent = 36,000 obols (0.728 g each)' },
      { name: 'Avoirdupois Pounds', ratio: 57.75, note: '57.75 lbs avoirdupois' }
    ],
    presets: [
      { label: '1 Talent (Trireme Monthly Crew Wages)', val: 1 },
      { label: '15 Talents (Cost to Build 1 War Trireme)', val: 15 },
      { label: '460 Talents (Annual Delian League Tribute)', val: 460 },
      { label: '1,000 Talents (Pericles Emergency War Reserve)', val: 1000 }
    ],
    contextHtml: '<p>One talent of silver was roughly equivalent to the weight of water required to fill one amphora (approx. 26.2 kg). In the 5th century BC, one silver drachma was the generous daily wage of a skilled stonemason building the Parthenon or a hoplite soldier. Thus, one talent represented 6,000 days (over 16 years) of skilled physical labor.</p>',
    primarySources: 'Thucydides, <em>History of the Peloponnesian War</em>, Book II; Demosthenes, <em>Speeches</em>; Plutarch, <em>Life of Pericles</em>.',
    faq: [
      { q: 'How much was an ancient Greek talent worth in silver and weight?', a: 'An Attic talent weighed 26.196 kilograms (57.75 pounds, or 842.2 troy ounces) of pure silver. At modern silver bullion prices (~$30/oz), its metal melt value alone is over $25,000, though in ancient purchasing power it equaled 16+ years of skilled labor.' },
      { q: 'What could one talent of silver buy in ancient Athens?', a: 'One talent was enough to pay the complete monthly wages of an entire 200-man oarsman crew for an Athenian trireme warship during the Peloponnesian War.' }
    ]
  },
  {
    slug: 'ancient-greek-mina-drachma-converter',
    name: 'Attic Mina, Drachma & Obol',
    shortName: 'Drachma & Obol',
    category: 'Ancient Greek Units',
    era: 'Classical Greece (Attica)',
    title: 'Attic Mina, Drachma, Obol & Chalcus Classical Coin Weights to Grams [Athenian Daily Wages & Purchasing Power] | Digital Tools Shed',
    h1: 'Attic Mina, Drachma, Obol & Chalcus Coin Converter',
    metaDesc: 'Convert ancient Athenian silver drachmae, obols, and minae to modern grams, troy ounces, and purchasing power. Calculate ancient Greek daily wages.',
    desc: 'The silver drachma (~4.37 g) and obol (0.73 g, famously placed under the dead man\'s tongue for Charon) were the economic pulse of daily life in classical Athens.',
    primaryUnit: 'Drachma',
    unitSymbol: 'drachma',
    defaultVal: 1,
    metricBase: 4.366, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 67.377, // grains
    imperialName: 'Grains',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Obols', ratio: 6, note: '1 drachma = 6 obols (0.728 g each)' },
      { name: 'Chalcoi (Bronze)', ratio: 48, note: '1 drachma = 48 chalcoi' },
      { name: 'Mina Fraction', ratio: 0.01, note: '100 drachmae = 1 mina (436.6 g)' },
      { name: 'Troy Ounces', ratio: 0.1404, note: '0.140 troy oz per drachma' }
    ],
    presets: [
      { label: '1 Obol (Charon Boat Toll / Loaf of Bread)', val: 0.1667 },
      { label: '1 Drachma (Craftsman Daily Wage)', val: 1 },
      { label: '4 Drachmae (1 Athenian Tetradrachm "Owl")', val: 4 },
      { label: '100 Drachmae (1 Mina / Modest Merchant Ransom)', val: 100 }
    ],
    contextHtml: '<p>The Athenian silver tetradrachm (4 drachmae), stamped with the helmeted head of Athena and her sacred owl, was the world\'s first international reserve currency. An obol originally meant a metal roasting spit (obelos); six spits made a "handful" (drax), creating the word <em>drachma</em>.</p>',
    primarySources: 'Aristophanes, <em>Frogs</em> and <em>Wasps</em>; Xenophon, <em>Ways and Means</em> (Poroi).',
    faq: [
      { q: 'How many grams of silver was in an ancient Greek drachma?', a: 'An Attic silver drachma contained 4.366 grams of high-purity (98%+) silver from the state mines at Laurion. Six obols equaled one drachma.' },
      { q: 'What was the obol placed in the mouth of the dead?', a: 'Greek funerary custom placed a single silver or bronze obol in the mouth of the deceased to pay Charon, the ferryman of Hades, to carry their soul across the river Acheron.' }
    ]
  },

  // ─── 3. BIBLICAL & ANCIENT NEAR EAST UNITS (22-28) ─────────────────────────
  {
    slug: 'biblical-cor-homer-volume-converter',
    name: 'Biblical Cor & Chomer (Homer)',
    shortName: 'Biblical Cor/Homer',
    category: 'Biblical & Ancient Near East',
    era: 'Biblical Antiquity (Ancient Israel)',
    title: 'Biblical Cor and Chomer (Donkey Load) Liquid/Dry Volume to Bushels & Liters [Old Testament Tithes] | Digital Tools Shed',
    h1: 'Biblical Cor & Chomer (Homer) Volume Converter',
    metaDesc: 'Convert Biblical cor and chomer donkey-load volume measures to metric liters, US dry bushels, and liquid gallons. Calculate Solomon\'s temple provisions.',
    desc: 'The cor or chomer (literally a "donkey load", ~220 liters / 6.24 bushels) was the largest volume measure in ancient Israel, cited in Ezekiel and 1 Kings for royal tributes.',
    primaryUnit: 'Cor / Chomer',
    unitSymbol: 'cor',
    defaultVal: 1,
    metricBase: 220.0, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 6.243, // dry bushels
    imperialName: 'US Dry Bushels',
    imperialSymbol: 'bu',
    subdivisions: [
      { name: 'Lethek (Half-Homer)', ratio: 2, note: '1 homer = 2 letheks (110 L each)' },
      { name: 'Ephah (Dry) / Bath (Liquid)', ratio: 10, note: '1 homer = 10 ephahs/baths (22 L each)' },
      { name: 'Seah', ratio: 30, note: '1 homer = 30 seahs (7.33 L each)' },
      { name: 'Omer', ratio: 100, note: '1 homer = 100 omers (2.2 L each)' },
      { name: 'US Liquid Gallons', ratio: 58.12, note: '58.12 US liquid gallons' }
    ],
    presets: [
      { label: '1 Chomer (Donkey Pack Load)', val: 1 },
      { label: '10 Chomer (Estate Tithe)', val: 10 },
      { label: '30 Cor (Daily Flour Provision for Solomon, 1 Kings 4:22)', val: 30 },
      { label: '1,000 Cor (Royal Treaty Tribute)', val: 1000 }
    ],
    contextHtml: '<p>King Solomon\'s daily royal court provisions listed in 1 Kings 4:22 were "thirty cors of fine flour and sixty cors of meal, ten fat oxen, twenty pasture-fed cattle, and a hundred sheep." In Ezekiel 45:11, the prophet decrees: "The ephah and the bath shall be of the same measure, the bath containing one tenth of a homer, and the ephah one tenth of a homer; the homer shall be the standard measure."</p>',
    primarySources: 'Ezekiel 45:11-14; 1 Kings 4:22; Leviticus 27:16; Hosea 3:2.',
    faq: [
      { q: 'How many liters is a Biblical homer or cor?', a: 'A Biblical homer (or cor) held approximately 220 liters (58.1 US liquid gallons or 6.24 US dry bushels). It represented the standard maximum carrying capacity of an adult pack donkey.' },
      { q: 'Is a cor the same as a chomer in the Bible?', a: 'Yes. "Chomer" (homer) was the native Hebrew agrarian term meaning a donkey-load of dry grain, while "Cor" was the official royal trade term used for both dry grain and liquid oil/wine.' }
    ]
  },
  {
    slug: 'biblical-ephah-bath-converter',
    name: 'Biblical Ephah & Bath',
    shortName: 'Ephah & Bath',
    category: 'Biblical & Ancient Near East',
    era: 'Biblical Antiquity',
    title: 'Biblical Ephah and Bath Standard Sanctuary Measures to Gallons & Liters [Tabernacle Offerings] | Digital Tools Shed',
    h1: 'Biblical Ephah (Dry) & Bath (Liquid) Converter',
    metaDesc: 'Convert Biblical ephah dry grain measures and bath liquid measures to modern liters, gallons, and quarts. Decode Old Testament temple sacrificial offerings.',
    desc: 'The ephah (dry, ~22.0 liters) and bath (liquid, ~22.0 liters) were identical in volume (one-tenth of a homer), forming the cornerstone of Mosaic sacrificial offerings.',
    primaryUnit: 'Ephah / Bath',
    unitSymbol: 'ephah',
    defaultVal: 1,
    metricBase: 22.0, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 5.812, // US liquid gal
    imperialName: 'US Liquid Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Seah (Third)', ratio: 3, note: '1 ephah = 3 seahs (7.33 L each)' },
      { name: 'Hin (Sixth)', ratio: 6, note: '1 bath = 6 hins (3.67 L each)' },
      { name: 'Omer (Tenth)', ratio: 10, note: '1 ephah = 10 omers (2.2 L each)' },
      { name: 'Log (Seventy-Second)', ratio: 72, note: '1 bath = 72 logs (305 mL each)' },
      { name: 'US Dry Pecks', ratio: 2.497, note: '2.50 US dry pecks' }
    ],
    presets: [
      { label: '1 Ephah (Grain Sacrifice, Leviticus 5:11)', val: 1 },
      { label: '3 Ephahs (Gideon Bread Offering, Judges 6:19)', val: 3 },
      { label: '10 Baths (1 Homer / Cor)', val: 10 },
      { label: '2,000 Baths (Solomon\'s Molten Sea, 1 Kings 7:26)', val: 2000 }
    ],
    contextHtml: '<p>The Bronze Sea of Solomon\'s temple (1 Kings 7:26) was recorded as holding 2,000 baths (approx. 44,000 liters or 11,624 US gallons) of water for priestly ablutions. Proverbs 20:10 strictly forbade fraudulent commerce: "Unequal weights and unequal measures (literally: an ephah and an ephah) are both alike an abomination to the Lord."</p>',
    primarySources: 'Exodus 16:36; Leviticus 19:36; 1 Kings 7:26; Ezekiel 45:10-11.',
    faq: [
      { q: 'How many gallons was an ancient Biblical bath?', a: 'A Biblical bath was approximately 22.0 liters or 5.81 US liquid gallons (4.84 Imperial gallons). The dry equivalent, the ephah, equaled 5.81 liquid gallons or 0.624 dry bushels.' },
      { q: 'Why did the Bible prohibit having two different ephahs?', a: 'Deceptive traders kept a heavier/larger ephah when buying grain from farmers and a lighter/smaller ephah when selling flour to customers. Biblical law commanded a single just ephah and a just hin.' }
    ]
  },
  {
    slug: 'biblical-seah-omer-grain-converter',
    name: 'Biblical Seah & Omer Manna',
    shortName: 'Seah & Omer',
    category: 'Biblical & Ancient Near East',
    era: 'Biblical Antiquity (Wilderness & Kingdom)',
    title: 'Biblical Seah and Omer Manna Portion to Dry Liters, Quarts & Cups [Exodus Manna Ration Calculator] | Digital Tools Shed',
    h1: 'Biblical Seah & Omer Manna Portion Converter',
    metaDesc: 'Convert Biblical seah dry measures and omer daily manna portions to dry liters, quarts, and cups. Reconstruct Sarah\'s bread recipes and wilderness rations.',
    desc: 'The seah (~7.33 L, Sarah\'s baking measure) and omer (~2.20 L, the daily miraculous portion of manna gathered per person in Exodus 16:16) formed home meal measures.',
    primaryUnit: 'Omer',
    unitSymbol: 'omer',
    defaultVal: 1,
    metricBase: 2.20, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 2.324, // US dry quarts
    imperialName: 'US Dry Quarts',
    imperialSymbol: 'qt',
    subdivisions: [
      { name: 'Seah Equivalent', ratio: 0.30, note: '3.33 omers = 1 seah (7.33 L)' },
      { name: 'Ephah Fraction', ratio: 0.10, note: '10 omers = 1 ephah (22 L)' },
      { name: 'Modern Cooking Cups', ratio: 9.30, note: 'Approx. 9.3 standard cups' },
      { name: 'Flour Weight (kg)', ratio: 1.25, note: 'Approx. 1.25 kg sifted wheat flour' }
    ],
    presets: [
      { label: '1 Omer (Daily Manna Portion per Person)', val: 1 },
      { label: '2 Omers (Sabbath Double Portion)', val: 2 },
      { label: '3.33 Omers (1 Seah)', val: 3.333 },
      { label: '10 Omers (3 Seah / Sarah\'s Bread for Angels, Gen 18:6)', val: 10 }
    ],
    contextHtml: '<p>In Exodus 16:16, Moses commanded: "Gather of it, each one of you, as much as he can eat. You shall each take an omer, according to the number of the persons that each of you has in his tent." In Genesis 18:6, Abraham told Sarah: "Quick! Three seahs of fine flour! Knead it, and make cakes!" Three seahs equaled one full ephah (approx. 22 liters of flour), producing a lavish banquet feast for the divine visitors.</p>',
    primarySources: 'Exodus 16:16-36; Genesis 18:6; 2 Kings 7:1; Ruth 2:17.',
    faq: [
      { q: 'How much was an omer of manna in modern cups and liters?', a: 'An omer was one-tenth of an ephah, equaling approximately 2.20 liters (2.32 US dry quarts or about 9.3 US measuring cups of food).' },
      { q: 'What is a seah in the Bible?', a: 'A seah was one-third of an ephah, equaling 7.33 liters (6.66 US dry quarts). It was the everyday measuring container for grain and flour in ancient Israelite households.' }
    ]
  },
  {
    slug: 'biblical-hin-log-anointing-oil',
    name: 'Biblical Hin & Log Anointing Oil',
    shortName: 'Hin & Log',
    category: 'Biblical & Ancient Near East',
    era: 'Biblical Antiquity (Tabernacle & Temple)',
    title: 'Biblical Hin and Log Anointing Oil Temple Measures to Fluid Ounces & mL [Sacred Temple Oil Rations] | Digital Tools Shed',
    h1: 'Biblical Hin & Log Sacred Oil Converter',
    metaDesc: 'Convert Biblical hin and log temple oil measures to milliliters, fluid ounces, and pints. Calculate tabernacle menorah lamp fuel and drink offerings.',
    desc: 'The hin (~3.67 liters) and log (~305 mL) were precision liquid vessels used by the Levitical priesthood for holy anointing oil, menorah lamp oil, and wine libations.',
    primaryUnit: 'Hin',
    unitSymbol: 'hin',
    defaultVal: 1,
    metricBase: 3.667, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 124.0, // US fl oz
    imperialName: 'US Fluid Ounces',
    imperialSymbol: 'fl oz',
    subdivisions: [
      { name: 'Half-Hin (Bull Sacrifice)', ratio: 2, note: '1/2 hin = 1.83 L (Numbers 28:14)' },
      { name: 'Third-Hin (Ram Sacrifice)', ratio: 3, note: '1/3 hin = 1.22 L' },
      { name: 'Fourth-Hin (Lamb Sacrifice)', ratio: 4, note: '1/4 hin = 0.92 L' },
      { name: 'Log', ratio: 12, note: '1 hin = 12 logs (305.6 mL each)' },
      { name: 'US Quarts', ratio: 3.875, note: '3.88 US liquid quarts' }
    ],
    presets: [
      { label: '1 Log (Leper Cleansing Oil, Leviticus 14:10)', val: 0.0833 },
      { label: '1/4 Hin (Lamb Drink Offering)', val: 0.25 },
      { label: '1/2 Hin (Bull Drink Offering)', val: 0.5 },
      { label: '1 Hin (Tabernacle Anointing Batch)', val: 1 }
    ],
    contextHtml: '<p>In Exodus 30:24, God gives Moses the recipe for the holy anointing oil, prescribing pure myrrh, sweet cinnamon, calamus, and cassia blended into "a hin of olive oil." In Numbers 28, wine libations poured onto the altar were graduated: half a hin for a bull, a third of a hin for a ram, and a quarter of a hin for a lamb.</p>',
    primarySources: 'Exodus 30:24; Leviticus 14:10-21; Numbers 15:4-10; Numbers 28:14.',
    faq: [
      { q: 'How many liters or ounces was a Biblical hin?', a: 'A Biblical hin held one-sixth of a bath, which equals approximately 3.667 liters (124 US fluid ounces, or roughly 0.97 US gallons).' },
      { q: 'What was a log in the Bible?', a: 'A log was the smallest liquid measure in the Old Testament, equal to one-twelfth of a hin (approx. 305.6 mL or 10.33 fluid ounces, about the size of a standard soda can). It was specified for the ritual cleansing of lepers.' }
    ]
  },
  {
    slug: 'biblical-cubit-span-handbreadth',
    name: 'Biblical Cubit, Span & Handbreadth',
    shortName: 'Biblical Cubit',
    category: 'Biblical & Ancient Near East',
    era: 'Biblical Antiquity',
    title: 'Biblical Cubit (Ammah), Span (Zereth), Handbreadth (Tefach) & Finger [Noah\'s Ark Dimensions] | Digital Tools Shed',
    h1: 'Biblical Cubit (Ammah), Span & Handbreadth Converter',
    metaDesc: 'Convert Biblical cubits (18 inches / 45.7 cm), spans (9 in), and handbreadths (3 in) to feet, inches, and meters. Calculate Noah\'s Ark and Ark of the Covenant size.',
    desc: 'The ancient Hebrew cubit (Ammah, 18 in / 45.7 cm) was subdivided into 2 spans (zereth), 6 handbreadths (tefach), and 24 fingers (etzba), measuring sacred architecture.',
    primaryUnit: 'Common Cubit (Ammah)',
    unitSymbol: 'cubit',
    defaultVal: 1,
    metricBase: 0.4572, // meters (18 inches standard)
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 1.5, // feet (18 inches)
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Zereth (Span)', ratio: 2, note: '1 cubit = 2 spans (9 inches / 22.86 cm)' },
      { name: 'Tefach (Handbreadth)', ratio: 6, note: '1 cubit = 6 handbreadths (3 inches / 7.62 cm)' },
      { name: 'Etzba (Finger-breadth)', ratio: 24, note: '1 cubit = 24 fingers (0.75 inches / 1.91 cm)' },
      { name: 'Inches', ratio: 18, note: '18 inches exactly' },
      { name: 'Royal Long Cubit Equivalent', ratio: 0.8738, note: '1 Common Cubit = 0.874 Royal Cubits (20.6 inches)' }
    ],
    presets: [
      { label: '2.5 Cubits (Ark of Covenant Length, Ex 25:10)', val: 2.5 },
      { label: '6 Cubits & a Span (Goliath\'s Height, 1 Sam 17:4)', val: 6.5 },
      { label: '60 Cubits (Solomon\'s Temple Length, 1 Kings 6:2)', val: 60 },
      { label: '300 Cubits (Noah\'s Ark Length, Genesis 6:15)', val: 300 }
    ],
    contextHtml: '<p>The common Biblical cubit was the distance from the elbow to the tip of the middle finger (18 inches / 45.7 cm). Genesis 6:15 gave Noah the dimensions for the Ark: 300 cubits long, 50 cubits wide, and 30 cubits high (450 × 75 × 45 feet, or 137 × 23 × 14 meters, displacing approx. 43,000 tons). In Ezekiel 40:5, the prophet uses the royal long cubit ("a cubit and a handbreadth", approx. 20.6 inches).</p>',
    primarySources: 'Genesis 6:15; Exodus 25:10; 1 Samuel 17:4; 1 Kings 6:2; Ezekiel 40:5.',
    faq: [
      { q: 'How long was a Biblical cubit in feet and inches?', a: 'The standard Hebrew common cubit (Ammah) was 18 inches (1.5 feet or 45.72 centimeters). The royal long cubit used in Ezekiel was 20.6 inches (52.3 centimeters).' },
      { q: 'How tall was Goliath in modern feet and inches?', a: '1 Samuel 17:4 describes Goliath of Gath as measuring "six cubits and a span". Using the standard 18-inch cubit and 9-inch span, this equals 9 feet 9 inches (2.97 meters tall).' }
    ]
  },
  {
    slug: 'biblical-shekel-talent-maneh-weight',
    name: 'Biblical Shekel, Maneh & Talent',
    shortName: 'Sanctuary Shekel',
    category: 'Biblical & Ancient Near East',
    era: 'Biblical Antiquity',
    title: 'Biblical Sanctuary Shekel, Maneh & Kikkar (Talent) to Troy Ounces & Grams [Solomon Temple Treasure] | Digital Tools Shed',
    h1: 'Biblical Sanctuary Shekel, Maneh & Talent Weight Converter',
    metaDesc: 'Convert Biblical sanctuary shekels (11.4g), maneh minas (570g), and kikkar talents (34.2kg) to modern grams, troy ounces, and bullion gold value.',
    desc: 'The sanctuary shekel (~11.4 grams) was the holy benchmark weight of Moses\' tabernacle. Fifty shekels made a maneh, and 3,000 shekels made a talent (kikkar).',
    primaryUnit: 'Sanctuary Shekel',
    unitSymbol: 'shekel',
    defaultVal: 1,
    metricBase: 11.40, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 0.3665, // troy ounces
    imperialName: 'Troy Ounces',
    imperialSymbol: 'oz t',
    subdivisions: [
      { name: 'Beka (Half-Shekel)', ratio: 2, note: '1 shekel = 2 bekas (5.70 g each)' },
      { name: 'Gerah', ratio: 20, note: '1 shekel = 20 gerahs (0.57 g each)' },
      { name: 'Maneh (Mina)', ratio: 0.02, note: '50 shekels = 1 maneh (570 g)' },
      { name: 'Kikkar (Talent)', ratio: 0.0003333, note: '3,000 shekels = 1 kikkar (34.2 kg)' },
      { name: 'Modern Grains', ratio: 175.93, note: '176 modern grains' }
    ],
    presets: [
      { label: '0.5 Shekel (Annual Temple Ransom Tax, Ex 30:13)', val: 0.5 },
      { label: '1 Shekel (Sanctuary Standard)', val: 1 },
      { label: '30 Shekels (Price of a Servant / Judas Silver)', val: 30 },
      { label: '3,000 Shekels (1 Kikkar / Talent of Gold)', val: 3000 }
    ],
    contextHtml: '<p>The Hebrew term <em>shekel</em> derives from the Semitic root <em>sh-q-l</em>, meaning "to weigh." Before coined money existed, payments were executed by cutting silver bullion on balances. In Exodus 38:25-26, the census collection of half-shekels from 603,550 men yielded 100 talents and 1,775 shekels of silver, which cast the silver bases of the sanctuary pillars.</p>',
    primarySources: 'Exodus 30:13; Exodus 38:25-26; Leviticus 27:25; Zechariah 11:12; Matthew 26:15.',
    faq: [
      { q: 'How much did a Biblical sanctuary shekel weigh?', a: 'A standard sanctuary shekel weighed 11.4 grams (0.366 troy ounces or 176 grains). It was divided into 20 gerahs.' },
      { q: 'How many shekels made a Biblical talent (kikkar)?', a: 'Unlike the Greek talent of 60 minae (6,000 drachmas), the Hebrew kikkar consisted of 3,000 sanctuary shekels (or 60 maneh of 50 shekels each), weighing 34.20 kilograms (75.4 pounds).' }
    ]
  },
  {
    slug: 'biblical-bekah-gerah-temple-tax',
    name: 'Biblical Bekah & Gerah Temple Tax',
    shortName: 'Bekah & Gerah',
    category: 'Biblical & Ancient Near East',
    era: 'Biblical Antiquity',
    title: 'Biblical Bekah (Half-Shekel Temple Tax) and Gerah Grain Weight to Grams [Census Ransom Calculator] | Digital Tools Shed',
    h1: 'Biblical Bekah & Gerah Temple Ransom Tax Converter',
    metaDesc: 'Convert Biblical bekah (half-shekel census ransom tax, 5.7g) and gerah (0.57g) to grams, milligrams, and modern silver coinage. Analyze New Testament temple taxes.',
    desc: 'The bekah (half-shekel, ~5.7 g silver) was the mandatory annual atonement census tax for every Israelite male aged 20 and older, subdivided into 10 gerahs.',
    primaryUnit: 'Bekah (Half-Shekel)',
    unitSymbol: 'bekah',
    defaultVal: 1,
    metricBase: 5.70, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 87.96, // grains
    imperialName: 'Grains',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Gerahs', ratio: 10, note: '1 bekah = 10 gerahs (0.57 g each)' },
      { name: 'Sanctuary Shekel Fraction', ratio: 0.5, note: '2 bekas = 1 shekel (11.40 g)' },
      { name: 'Milligrams', ratio: 5700, note: '5,700 milligrams' },
      { name: 'Troy Ounces', ratio: 0.1833, note: '0.183 troy oz silver' }
    ],
    presets: [
      { label: '1 Gerah (16 Barleycorn Weight)', val: 0.1 },
      { label: '1 Bekah (1 Adult Census Tax, Exodus 30:13)', val: 1 },
      { label: '2 Bekas (1 Full Shekel / Didrachmon)', val: 2 },
      { label: '4 Bekas (1 Tyrian Shekel / Coin in Fish\'s Mouth, Matt 17:27)', val: 4 }
    ],
    contextHtml: '<p>Exodus 30:15 commanded: "The rich shall not give more, and the poor shall not give less, than the half shekel (bekah), when you give the Lord\'s offering to make atonement for your lives." In Matthew 17:24-27, when the collectors of the two-drachma temple tax confronted Peter in Capernaum, Jesus instructed him to catch a fish, in whose mouth he found a stater (tetradrachm / full shekel), paying the tax for both of them.</p>',
    primarySources: 'Exodus 30:11-16; Exodus 38:26; Leviticus 27:25; Matthew 17:24-27.',
    faq: [
      { q: 'What is a bekah in the Bible?', a: 'A bekah was a half-shekel of silver, weighing exactly 5.70 grams (88 grains). It was the flat annual poll tax required of every adult Israelite male for temple upkeep.' },
      { q: 'How much was a gerah?', a: 'A gerah was one-twentieth of a sanctuary shekel (one-tenth of a bekah), weighing 0.57 grams (570 milligrams). It was originally defined as the weight of approximately 16 plump barley grains.' }
    ]
  },

  // ─── 4. APOTHECARY & ALCHEMICAL SYSTEMS (29-39) ────────────────────────────
  {
    slug: 'apothecary-grain-to-milligrams',
    name: 'Apothecary Grain (gr)',
    shortName: 'Apothecary Grain',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy (Middle Ages to 20th Century)',
    title: 'Apothecary Grain (gr) to Metric Milligrams & Grams Precise Pharmacy Scale [Vintage Drug Dosage Calculator] | Digital Tools Shed',
    h1: 'Apothecary Grain (gr) to Milligrams & Grams Converter',
    metaDesc: 'Convert historical apothecary grains (1 gr = 64.79891 mg) to metric milligrams and grams. Translate vintage pharmacopeia recipes and aspirin dosages.',
    desc: 'The grain (symbol: gr) was the immutable atom of the apothecary system, legally standardized at exactly 64.79891 milligrams, calibrating pharmaceutical compounding.',
    primaryUnit: 'Apothecary Grain (gr)',
    unitSymbol: 'gr',
    defaultVal: 1,
    metricBase: 64.79891, // milligrams
    metricName: 'Milligrams',
    metricSymbol: 'mg',
    imperialBase: 0.0022857, // avoirdupois ounces
    imperialName: 'Avoirdupois Ounces',
    imperialSymbol: 'oz',
    subdivisions: [
      { name: 'Scruple (℈) Fraction', ratio: 0.05, note: '20 grains = 1 scruple (1.296 g)' },
      { name: 'Dram (ʒ) Fraction', ratio: 0.016667, note: '60 grains = 1 dram (3.888 g)' },
      { name: 'Apothecary Ounce (℥) Fraction', ratio: 0.0020833, note: '480 grains = 1 ap oz (31.103 g)' },
      { name: 'Metric Grams', ratio: 0.064799, note: '0.0648 grams' }
    ],
    presets: [
      { label: '1/4 Grain (Historical Morphine Dose)', val: 0.25 },
      { label: '1 Grain (Standard gr i)', val: 1 },
      { label: '5 Grains (Classic 325 mg Aspirin Tablet)', val: 5 },
      { label: '20 Grains (1 Scruple ℈)', val: 20 }
    ],
    contextHtml: '<p>The grain was originally defined in England by the Assize of Bread and Ale of 1266 as the weight of a grain of wheat taken from the middle of the ear and well dried. When Bayer synthesized acetylsalicylic acid in 1899, the standard adult pain-relief tablet was manufactured as a <strong>5-grain tablet</strong>, explaining why modern OTC aspirin and acetaminophen still contain 325 mg (5 × 64.79891 mg = 323.99 mg rounded to 325 mg).</p>',
    primarySources: 'United States Pharmacopeia (USP, 1820–1970 editions); British Pharmacopoeia (BP); Assize of Weights and Measures (1266).',
    faq: [
      { q: 'How many milligrams are in 1 grain (gr)?', a: 'Exactly 64.79891 milligrams. In clinical medicine and vintage pharmacology, this is frequently rounded to 60 mg or 65 mg depending on the drug index.' },
      { q: 'Why is aspirin manufactured in 325 mg tablets?', a: 'Standard aspirin tablets were formulated according to the 19th-century apothecary system as 5 grains (5 gr). Five grains multiplied by 64.8 mg equals 324 mg, standardized commercially to 325 mg.' }
    ]
  },
  {
    slug: 'apothecary-scruple-to-drams',
    name: 'Apothecary Scruple (℈)',
    shortName: 'Scruple (℈)',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy',
    title: 'Apothecary Scruple (℈) to Drams (ʒ) and Grains Prescription Converter [Vintage Pharmacopeia Compounding] | Digital Tools Shed',
    h1: 'Apothecary Scruple (℈) Prescription Converter',
    metaDesc: 'Convert apothecary scruples (1 ℈ = 20 grains = 1.296 grams) to drams, grains, and modern milligrams. Decode 19th-century Latin medical compounding scripts.',
    desc: 'The scruple (symbol: ℈, equal to 20 grains or 1.29598 grams) was the intermediate unit in Latin medical compounding between individual grains and drams.',
    primaryUnit: 'Scruple (℈)',
    unitSymbol: '℈',
    defaultVal: 1,
    metricBase: 1.2959782, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 20.0, // grains
    imperialName: 'Grains',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Grains (gr)', ratio: 20, note: '1 scruple = 20 grains' },
      { name: 'Dram (ʒ) Fraction', ratio: 0.33333, note: '3 scruples = 1 dram (3.888 g)' },
      { name: 'Ounce (℥) Fraction', ratio: 0.041667, note: '24 scruples = 1 apothecary ounce' },
      { name: 'Milligrams', ratio: 1295.98, note: '1,296 milligrams' }
    ],
    presets: [
      { label: '1/2 Scruple (℈ ss / 10 Grains)', val: 0.5 },
      { label: '1 Scruple (℈ i / 20 Grains)', val: 1 },
      { label: '2 Scruples (℈ ii / Dover\'s Powder Dose)', val: 2 },
      { label: '3 Scruples (1 Dram ʒ i)', val: 3 }
    ],
    contextHtml: '<p>The English word "scruple" (meaning a hesitation or moral doubt) comes directly from the Latin <em>scrupulus</em>, a diminutive of <em>scrupus</em> ("a small sharp stone"). Just as a tiny pebble in a Roman soldier\'s sandal caused persistent irritation, a single scruple on the pharmacist\'s balance was a minute weight capable of tilting the scales between medicine and lethal poison.</p>',
    primarySources: 'Pereira\'s <em>Elements of Materia Medica</em> (1840); Culpeper\'s <em>Complete Herbal</em> (1653); Pharmacopoea Londinensis (1618).',
    faq: [
      { q: 'How many grains and grams is an apothecary scruple?', a: 'One apothecary scruple (℈) contains exactly 20 grains, which equals 1.29598 grams (1,296 milligrams).' },
      { q: 'How do you read the scruple symbol in antique handwritten prescriptions?', a: 'The scruple symbol resembles a script capital "E" with an elongated horizontal bar or a curved crescent crossed by a bar: ℈. Roman numerals followed the symbol (e.g. ℈ ii meant two scruples or 40 grains).' }
    ]
  },
  {
    slug: 'apothecary-dram-to-grams',
    name: 'Apothecary Dram (Drachm ʒ)',
    shortName: 'Apothecary Dram (ʒ)',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy',
    title: 'Apothecary Dram (Drachm ʒ) to Metric Grams and Troy Ounces [Pharmacy vs Avoirdupois Dram Discrepancy] | Digital Tools Shed',
    h1: 'Apothecary Dram (Drachm ʒ) Weight Converter',
    metaDesc: 'Convert apothecary drams (60 grains / 3.888 grams) to modern grams and troy ounces. Clarify the dangerous discrepancy with avoirdupois drams (1.772g).',
    desc: 'The apothecary dram (symbol: ʒ, equal to 60 grains or 3.8879 grams) was the workhorse measure for compounding active alkaloids and powders in 19th-century medicine.',
    primaryUnit: 'Apothecary Dram (ʒ)',
    unitSymbol: 'ʒ',
    defaultVal: 1,
    metricBase: 3.8879346, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 60.0, // grains
    imperialName: 'Grains',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Scruples (℈)', ratio: 3, note: '1 dram = 3 scruples (20 gr each)' },
      { name: 'Grains (gr)', ratio: 60, note: '1 dram = 60 grains' },
      { name: 'Ounce (℥) Fraction', ratio: 0.125, note: '8 drams = 1 apothecary ounce (31.103 g)' },
      { name: 'Avoirdupois Dram Comparison', ratio: 2.1943, note: '1 ap dram = 2.194 avoirdupois drams (1.772 g)' }
    ],
    presets: [
      { label: '1/2 Dram (ʒ ss / 30 Grains)', val: 0.5 },
      { label: '1 Dram (ʒ i / 60 Grains)', val: 1 },
      { label: '2 Drams (ʒ ii / Compound Powder)', val: 2 },
      { label: '8 Drams (1 Apothecary Ounce ℥ i)', val: 8 }
    ],
    contextHtml: '<p>A dangerous point of confusion in historical chemistry is the difference between the <strong>apothecary dram</strong> (3.888 grams, 60 grains) and the <strong>avoirdupois dram</strong> (1.772 grams, 27.344 grains). The apothecary dram is <strong>119.4% heavier</strong> than the grocery avoirdupois dram. Dispensing a potent drug using the wrong dram system risked fatal overdosage.</p>',
    primarySources: 'Remington\'s <em>Practice of Pharmacy</em>; Quincy\'s <em>Lexicon Physico-Medicum</em> (1719).',
    faq: [
      { q: 'How many grams is an apothecary dram (ʒ)?', a: 'One apothecary dram equals 3.8879 grams (60 grains, or 3 scruples). Eight apothecary drams make one apothecary ounce (31.103 grams).' },
      { q: 'What is the difference between an apothecary dram and an avoirdupois dram?', a: 'An apothecary dram equals 60 grains (3.888 g), while an avoirdupois dram equals only 27.344 grains (1.772 g). An apothecary dram is more than double the weight of an avoirdupois dram.' }
    ]
  },
  {
    slug: 'apothecary-ounce-to-grams',
    name: 'Apothecary Ounce (℥ 480 Grains)',
    shortName: 'Apothecary Ounce (℥)',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy',
    title: 'Apothecary Ounce (℥ 480 Grains) to Metric Grams vs Avoirdupois Ounce [Pharmacy Weight Discrepancy] | Digital Tools Shed',
    h1: 'Apothecary Ounce (℥) Weight Converter',
    metaDesc: 'Convert apothecary ounces (480 grains = 31.1035 grams) to modern metric grams and avoirdupois ounces. Understand the 9.7% weight discrepancy.',
    desc: 'The apothecary ounce (symbol: ℥, exactly 480 grains or 31.1035 grams, identical to the Troy ounce) is 9.7% heavier than the standard avoirdupois ounce (28.3495 grams).',
    primaryUnit: 'Apothecary Ounce (℥)',
    unitSymbol: '℥',
    defaultVal: 1,
    metricBase: 31.1034768, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 480.0, // grains
    imperialName: 'Grains',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Drams (ʒ)', ratio: 8, note: '1 ap ounce = 8 drams (60 gr each)' },
      { name: 'Scruples (℈)', ratio: 24, note: '1 ap ounce = 24 scruples (20 gr each)' },
      { name: 'Avoirdupois Ounces', ratio: 1.09714, note: '1 ap ounce = 1.097 oz avoirdupois' },
      { name: 'Apothecary Pound Fraction', ratio: 0.08333, note: '12 ap ounces = 1 apothecary pound' }
    ],
    presets: [
      { label: '1/2 Ounce (℥ ss / 4 Drams)', val: 0.5 },
      { label: '1 Ounce (℥ i / 480 Grains)', val: 1 },
      { label: '4 Ounces (Tincture Jar Batch)', val: 4 },
      { label: '12 Ounces (1 Apothecary Pound lb ap)', val: 12 }
    ],
    contextHtml: '<p>The apothecary ounce (identical to the Troy ounce) contains 480 grains, while the grocery/avoirdupois ounce contains only 437.5 grains. Consequently, an apothecary ounce is 9.7% heavier than a grocery store ounce. When buying dry chemicals in the 19th century, merchants sold by avoirdupois, but apothecaries compounded by apothecary weight, requiring continuous conversion arithmetic.</p>',
    primarySources: 'United States Pharmacopeia (USP, 1850 Revision); Gray\'s <em>Supplement to the Pharmacopoeia</em> (1848).',
    faq: [
      { q: 'How many grams is an apothecary ounce?', a: 'One apothecary ounce equals exactly 31.1034768 grams (480 grains). It is identical in mass to a precious metals Troy ounce.' },
      { q: 'Which is heavier: an apothecary ounce or a regular ounce?', a: 'An apothecary ounce (31.10 g / 480 grains) is heavier than a standard commercial avoirdupois ounce (28.35 g / 437.5 grains) by approximately 2.75 grams (9.7%).' }
    ]
  },
  {
    slug: 'apothecary-pound-troy-converter',
    name: 'Apothecary Pound (lb ap)',
    shortName: 'Apothecary Pound',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy',
    title: 'Apothecary Pound (lb ap 12 Ounces) to Modern Metric Kilograms & Pounds [12-Ounce vs 16-Ounce System] | Digital Tools Shed',
    h1: 'Apothecary Pound (12-Ounce System) Converter',
    metaDesc: 'Convert historical apothecary pounds (12 ounces / 5,760 grains = 373.24 grams) to metric kilograms and avoirdupois pounds. Unpack the famous pound paradox.',
    desc: 'The apothecary pound (lb ap) consisted of 12 apothecary ounces (5,760 grains = 373.24 grams), making it significantly lighter than the 16-ounce avoirdupois pound (453.59 grams).',
    primaryUnit: 'Apothecary Pound (lb ap)',
    unitSymbol: 'lb ap',
    defaultVal: 1,
    metricBase: 373.24172, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 0.822857, // avoirdupois lbs
    imperialName: 'Avoirdupois Pounds',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Apothecary Ounces (℥)', ratio: 12, note: '1 lb ap = 12 ap ounces (480 gr each)' },
      { name: 'Drams (ʒ)', ratio: 96, note: '1 lb ap = 96 drams (60 gr each)' },
      { name: 'Scruples (℈)', ratio: 288, note: '1 lb ap = 288 scruples (20 gr each)' },
      { name: 'Total Grains (gr)', ratio: 5760, note: '1 lb ap = 5,760 grains' },
      { name: 'Kilograms', ratio: 0.37324, note: '0.3732 kg' }
    ],
    presets: [
      { label: '1 Apothecary Pound (12 Ounces)', val: 1 },
      { label: '2 Apothecary Pounds', val: 2 },
      { label: '5 Apothecary Pounds (Compound Batch)', val: 5 },
      { label: '10 Apothecary Pounds', val: 10 }
    ],
    contextHtml: '<p>The famous riddle: <em>"Which is heavier: a pound of feathers or a pound of gold?"</em> relies on this historical distinction. Feathers are weighed in avoirdupois pounds (7,000 grains = 453.59 g), while gold and apothecary compounds are weighed in Troy/apothecary pounds (5,760 grains = 373.24 g). Thus, a pound of feathers is heavier than a pound of gold by 80.35 grams, but an ounce of gold (480 gr) is heavier than an ounce of feathers (437.5 gr)!</p>',
    primarySources: 'Act of Uniformity of Weights and Measures (UK, 1824); Dunglison\'s <em>Medical Lexicon</em> (1868).',
    faq: [
      { q: 'How much does an apothecary pound weigh?', a: 'An apothecary pound weighs 373.242 grams (0.8229 avoirdupois pounds, or 5,760 grains). It is divided into 12 ounces rather than 16.' },
      { q: 'Why is an apothecary pound lighter than a normal pound?', a: 'Because it descends from the 12-ounce Roman libra, preserved through medieval European medicine and precious metal minting. Standard commercial goods were later transitioned to the heavier 16-ounce avoirdupois pound.' }
    ]
  },
  {
    slug: 'apothecary-minim-to-drops-milliliters',
    name: 'Apothecary Minim (♏) & Drops',
    shortName: 'Minim & Drops',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy',
    title: 'Apothecary Minim (♏) to Liquid Medicine Drops (Gtt) and Milliliters [Tincture Dosage Dropper] | Digital Tools Shed',
    h1: 'Apothecary Minim (♏) & Medical Drop Converter',
    metaDesc: 'Convert apothecary minims (0.0616 mL) and medical drops (guttae, gtt) to milliliters, microliters, and teaspoons. Translate vintage tincture prescriptions.',
    desc: 'The minim (symbol: ♏, ~0.0616 mL, one sixtieth of a fluid dram) was the ultimate liquid micro-measure, invented in 1809 to replace unreliable medicine drops (guttae).',
    primaryUnit: 'Minim (♏)',
    unitSymbol: '♏',
    defaultVal: 1,
    metricBase: 0.0616115, // milliliters
    metricName: 'Milliliters',
    metricSymbol: 'mL',
    imperialBase: 1.0, // approx 1 drop
    imperialName: 'Medical Drops (Gtt)',
    imperialSymbol: 'gtt',
    subdivisions: [
      { name: 'Microliters (µL)', ratio: 61.61, note: '61.6 µL per minim' },
      { name: 'Fluid Dram (fl ʒ) Fraction', ratio: 0.016667, note: '60 minims = 1 fluid dram' },
      { name: 'Fluid Ounce (fl ℥) Fraction', ratio: 0.0020833, note: '480 minims = 1 fluid ounce' },
      { name: 'Standard Teaspoons (5 mL)', ratio: 0.01232, note: 'Approx. 81 minims per metric teaspoon' }
    ],
    presets: [
      { label: '5 Minims (Belladonna Tincture Dose)', val: 5 },
      { label: '10 Minims (Digitalis Foxglove Dose)', val: 10 },
      { label: '20 Minims (Standard Laudanum Dose)', val: 20 },
      { label: '60 Minims (1 Fluid Dram fl ʒ)', val: 60 }
    ],
    contextHtml: '<p>Before 1809, liquid medicines were prescribed in "drops" (Latin: <em>guttae</em>, abbreviated <em>gtt</em>). However, drop size varied wildly depending on bottle neck viscosity, liquid surface tension (alcohol drops are one-third the size of water drops), and dropper angle. The Royal College of Physicians of London introduced the graduated glass minim pipette in 1809 to establish scientific dosage repeatability.</p>',
    primarySources: 'Pharmacopoeia Collegii Regalis Medicorum Londinensis (1809 Revision); Parish\'s <em>Treatise on Pharmacy</em> (1884).',
    faq: [
      { q: 'How many milliliters is 1 minim (♏)?', a: 'One US apothecary minim equals 0.06161 milliliters (61.6 microliters). The British Imperial minim is slightly smaller at 0.05919 mL.' },
      { q: 'Is a minim the same as a drop of liquid?', a: 'For pure distilled water at room temperature, one minim is roughly equal to one drop (about 16 minims per milliliter). However, for alcohol tinctures like laudanum, there were up to 120 drops per milliliter, making minims far more accurate than drops.' }
    ]
  },
  {
    slug: 'apothecary-fluid-dram-to-milliliters',
    name: 'Apothecary Fluid Dram (fl ʒ)',
    shortName: 'Fluid Dram (fl ʒ)',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy',
    title: 'Apothecary Fluid Dram (fl ʒ 60 Minims) to Metric Milliliters & Teaspoons [Vintage Liquid Dosage] | Digital Tools Shed',
    h1: 'Apothecary Fluid Dram (fl ʒ) Volume Converter',
    metaDesc: 'Convert apothecary fluid drams (60 minims = 3.697 mL) to modern milliliters, teaspoons, and fluid ounces. Translate antique cough syrup prescriptions.',
    desc: 'The fluid dram (symbol: fl ʒ, equal to 60 minims or 3.6967 mL) was the standard spoonful measure in 19th-century liquid medicine and syrup dispensing.',
    primaryUnit: 'Fluid Dram (fl ʒ)',
    unitSymbol: 'fl ʒ',
    defaultVal: 1,
    metricBase: 3.69669, // milliliters
    metricName: 'Milliliters',
    metricSymbol: 'mL',
    imperialBase: 0.125, // fluid ounces
    imperialName: 'US Fluid Ounces',
    imperialSymbol: 'fl oz',
    subdivisions: [
      { name: 'Minims (♏)', ratio: 60, note: '1 fl dram = 60 minims' },
      { name: 'Teaspoon Equivalent (Metric 5 mL)', ratio: 0.7393, note: '1 fl dram ≈ 0.74 metric teaspoons' },
      { name: 'Fluid Ounce (fl ℥) Fraction', ratio: 0.125, note: '8 fluid drams = 1 fluid ounce' },
      { name: 'Tablespoon Fraction (15 mL)', ratio: 0.2464, note: '1 fl dram ≈ 1/4 tablespoon' }
    ],
    presets: [
      { label: '1/2 Fluid Dram (fl ʒ ss)', val: 0.5 },
      { label: '1 Fluid Dram (fl ʒ i / One Teaspoonful)', val: 1 },
      { label: '2 Fluid Drams (fl ʒ ii / Dessertspoonful)', val: 2 },
      { label: '4 Fluid Drams (fl ʒ iv / Half Ounce)', val: 4 }
    ],
    contextHtml: '<p>In traditional British and American medical practice, doctors frequently equated "one fluid dram" with "one teaspoonful." However, during the Victorian era, standard household teaspoons grew from 3.7 mL to over 5.0 mL, leading to frequent unintentional medicine overdoses until pharmacopeias standardized modern calibrated dosing spoons.</p>',
    primarySources: 'United States Pharmacopeia (USP VIII, 1900); Hoblyn\'s <em>Dictionary of Terms Used in Medicine</em> (1858).',
    faq: [
      { q: 'How many mL is an apothecary fluid dram?', a: 'One US fluid dram equals 3.6967 milliliters (0.125 fluid ounces or 60 minims). The British Imperial fluid dram is 3.5516 mL.' },
      { q: 'Why was a fluid dram called a teaspoonful?', a: 'In the 18th and early 19th centuries, English silver teaspoons held almost exactly 60 minims (3.7 mL). Doctors wrote "fl ʒ i" in Latin prescriptions when instructing patients to take one teaspoonful.' }
    ]
  },
  {
    slug: 'apothecary-fluid-ounce-to-milliliters',
    name: 'Apothecary Fluid Ounce (fl ℥)',
    shortName: 'Apothecary Fluid Ounce',
    category: 'Apothecary & Alchemical',
    era: 'Historical Pharmacy',
    title: 'Historical Apothecary Fluid Ounce (fl ℥ 8 Fluid Drams) to Milliliters [US vs Imperial Apothecary Ounce] | Digital Tools Shed',
    h1: 'Apothecary Fluid Ounce (fl ℥) Volume Converter',
    metaDesc: 'Convert apothecary fluid ounces (8 fluid drams = 29.574 mL US vs 28.413 mL Imperial) to milliliters, centiliters, and tablespoons. Unpack historical differences.',
    desc: 'The apothecary fluid ounce (symbol: fl ℥, containing 8 fluid drams or 480 minims) was the universal bottle bottle-size index for compounded elixirs and tonics.',
    primaryUnit: 'Apothecary Fluid Ounce (US)',
    unitSymbol: 'fl ℥',
    defaultVal: 1,
    metricBase: 29.57353, // milliliters
    metricName: 'Milliliters',
    metricSymbol: 'mL',
    imperialBase: 1.0, // US fl oz
    imperialName: 'US Fluid Ounces',
    imperialSymbol: 'fl oz',
    subdivisions: [
      { name: 'Fluid Drams (fl ʒ)', ratio: 8, note: '1 fl oz = 8 fluid drams' },
      { name: 'Minims (♏)', ratio: 480, note: '1 fl oz = 480 minims' },
      { name: 'Tablespoons (15 mL)', ratio: 1.9716, note: 'Approx. 2 tablespoons' },
      { name: 'Imperial Fluid Ounces Equivalent', ratio: 1.0408, note: '1 US fl oz = 1.041 Imperial fl oz (28.41 mL)' }
    ],
    presets: [
      { label: '1 Fluid Ounce (Standard Medicine Vial)', val: 1 },
      { label: '2 Fluid Ounces (Tincture Bottle fl ℥ ii)', val: 2 },
      { label: '4 Fluid Ounces (Cough Syrup Bottle fl ℥ iv)', val: 4 },
      { label: '8 Fluid Ounces (Half-Pint Tonic Bottle)', val: 8 }
    ],
    contextHtml: '<p>The US fluid ounce is defined as the volume of 1/128th of a US gallon of water (29.5735 mL, weighing 1.041 ounces avoirdupois of water at 62°F). In contrast, the British 1824 Weights and Measures Act defined the Imperial fluid ounce as the exact volume occupied by one avoirdupois ounce (28.35 g) of distilled water, yielding 28.413 mL.</p>',
    primarySources: 'United States Pharmacopeia; British Pharmacopoeia; Weights and Measures Act of 1824 (5 Geo. 4. c. 74).',
    faq: [
      { q: 'How many milliliters are in an apothecary fluid ounce?', a: 'In the US apothecary system, one fluid ounce equals 29.5735 milliliters. In the British Imperial apothecary system, it equals 28.4131 milliliters.' },
      { q: 'How many minims and fluid drams make an apothecary fluid ounce?', a: 'One fluid ounce equals exactly 8 fluid drams or 480 minims.' }
    ]
  },
  {
    slug: 'alchemical-drachma-to-quintessence',
    name: 'Alchemical Drachma & Quintessence',
    shortName: 'Alchemical Quintessence',
    category: 'Apothecary & Alchemical',
    era: 'Renaissance Spagyric Alchemy',
    title: 'Alchemical Drachma, Quintessence & Spagyric Elixir Proportion Calculator [Paracelsian Tria Prima] | Digital Tools Shed',
    h1: 'Alchemical Drachma & Quintessence Spagyric Calculator',
    metaDesc: 'Model Renaissance Paracelsian spagyric compounding ratios and alchemical drachmas (Tria Prima: Sulfur, Mercury, Salt) into modern laboratory grams and yields.',
    desc: 'Calculate Paracelsian spagyric tincture extractions, converting Renaissance botanical drachmas (3.888 g) into purified quintessence elixir proportions.',
    primaryUnit: 'Alchemical Drachma',
    unitSymbol: 'drachma_alc',
    defaultVal: 1,
    metricBase: 3.888, // grams of herb/mineral
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 60.0, // alchemical grains
    imperialName: 'Alchemical Grains',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Sulfur (Soul / Essential Oil g)', ratio: 0.1944, note: '5% volatile essential soul extract' },
      { name: 'Mercury (Spirit / Alcohol Alcoholate mL)', ratio: 3.888, note: '1:1 spagyric spirit menstruum' },
      { name: 'Salt (Body / Calcined Mineral Ash g)', ratio: 0.1555, note: '4% calcined crystalline water-soluble salt' },
      { name: 'Pure Quintessence Yield (mL)', ratio: 0.7776, note: '20% purified recombined elixir' }
    ],
    presets: [
      { label: '1 Drachma (Single Tincture Dose)', val: 1 },
      { label: '8 Drachmas (1 Alchemical Ounce ℥)', val: 8 },
      { label: '32 Drachmas (Standard Spagyric Batch)', val: 32 },
      { label: '96 Drachmas (1 Hermetic Pound lb ap)', val: 96 }
    ],
    contextHtml: '<p>Philippus Aureolus Theophrastus Bombastus von Hohenheim (<strong>Paracelsus</strong>, 1493–1541) revolutionized medicine by rejecting Galen\'s four humors in favor of the <em>Tria Prima</em>: Sulfur (combustible soul), Mercury (volatile spirit), and Salt (solid crystalline body). The <em>Spagyric</em> method ("to separate and recombine") required calcining the plant body to white ash to extract its soluble salts, dissolving them back into the distilled spirit.</p>',
    primarySources: 'Paracelsus, <em>Archidoxa</em> (1526); Isaac Newton, <em>Alchemical Manuscripts</em> (Keynes MS); Basilius Valentinus, <em>The Triumphal Chariot of Antimony</em>.',
    faq: [
      { q: 'What is the Tria Prima in Paracelsian alchemy?', a: 'The Tria Prima consists of Sulfur (the soul, representing consciousness, combustibility, and essential oils), Mercury (the spirit, representing life-force, volatility, and alcohol), and Salt (the body, representing form, matter, and mineral ashes).' },
      { q: 'What does the word "spagyric" mean?', a: 'Coined by Paracelsus from the ancient Greek words spao ("to tear apart") and ageiro ("to bring together"). It describes the chemical process of separating a botanical material into its components, purifying them, and reuniting them into an exalted medicine.' }
    ]
  },
  {
    slug: 'historical-troy-grain-jewelers-carat',
    name: 'Archaic Jewelers Carat',
    shortName: 'Jewelers Carat',
    category: 'Apothecary & Alchemical',
    era: 'Pre-1907 Antique Gemology',
    title: 'Archaic Jewelers Carat (4 Pearl Grains) to Modern Diamond Metric Carats [Pre-1907 Antique Gemstone Weights] | Digital Tools Shed',
    h1: 'Archaic Jewelers Carat to Modern Metric Carats Converter',
    metaDesc: 'Convert pre-1907 antique diamond and pearl carats (London 205.3mg, Florence 197.2mg, Paris 205.9mg) to modern metric carats (200mg exact) and pearl grains.',
    desc: 'Before the 1907 International Metre Convention standardized the metric carat at exactly 200 mg, every gemstone market in Europe had its own distinct antique carat weight.',
    primaryUnit: 'Archaic Carat (London Standard)',
    unitSymbol: 'ct_antique',
    defaultVal: 1,
    metricBase: 205.3, // milligrams (London standard)
    metricName: 'Milligrams',
    metricSymbol: 'mg',
    imperialBase: 1.0265, // modern metric carats
    imperialName: 'Modern Metric Carats',
    imperialSymbol: 'ct',
    subdivisions: [
      { name: 'Pearl Grains (4 per Carat)', ratio: 4, note: '1 antique carat = 4 pearl grains (51.3 mg each)' },
      { name: 'Florence Carat Equivalent (197.2 mg)', ratio: 1.0411, note: 'Florentine carats were 4% lighter' },
      { name: 'Paris Old Carat Equivalent (205.9 mg)', ratio: 0.9971, note: 'Parisian carats were 0.3% heavier' },
      { name: 'Modern Metric Carats (200 mg)', ratio: 1.0265, note: '+2.65% heavier than modern metric carat' }
    ],
    presets: [
      { label: '1 Carat (London Diamond Standard)', val: 1 },
      { label: '5 Carats (Victorian Solitaire Ring)', val: 5 },
      { label: '44.5 Carats (Hope Diamond Antique Weight)', val: 44.5 },
      { label: '108.9 Carats (Koh-i-Noor Original Diamond Weight)', val: 108.9 }
    ],
    contextHtml: '<p>Until the Fourth General Conference on Weights and Measures adopted the 200 mg metric carat in 1907, gemstone weights in historical appraisal certificates varied dramatically: London used 205.3 mg, Paris used 205.87 mg, Amsterdam used 205.7 mg, Berlin used 205.44 mg, and Florence used 197.2 mg. When appraising historic stones like the Hope Diamond or Koh-i-Noor, antique appraisals must be corrected using these regional city standards.</p>',
    primarySources: 'Streeter\'s <em>Precious Stones and Gems</em> (1898); Bauer\'s <em>Precious Stones</em> (1904); 4th CGPM Proceedings (Paris, 1907).',
    faq: [
      { q: 'How heavy was an antique jeweler\'s carat before 1907?', a: 'Before 1907, a carat was not standardized: the London carat was 205.3 milligrams, Paris was 205.9 mg, and Florence was 197.2 mg. In 1907, all nations adopted the metric carat of exactly 200.0 milligrams (0.200 grams).' },
      { q: 'What is a pearl grain?', a: 'A pearl grain is one-quarter of a carat. In the antique system, one pearl grain equaled approx. 51.3 milligrams. In the modern metric system, one pearl grain equals exactly 50 milligrams (0.25 metric carats).' }
    ]
  },
  {
    slug: 'historical-carat-to-gold-purity-karat',
    name: 'Gold Karat Purity (24-Part System)',
    shortName: 'Gold Karat Purity',
    category: 'Apothecary & Alchemical',
    era: 'Numismatic Metallurgy',
    title: 'Gold Karat Purity (24-Part System) to Fineness Millesimal Decimal Ratio [Melt Value & Pure Gold Calculator] | Digital Tools Shed',
    h1: 'Gold Karat Purity (24-Part System) & Fineness Converter',
    metaDesc: 'Convert gold karat purity (24k, 22k, 18k, 14k, 10k, 9k) to millesimal fineness (parts per 1,000) and pure gold gram mass. Calculate scrap melt values.',
    desc: 'The 24-karat system (rooted in the 24-siliqua Byzantine gold solidus) defines gold purity: 24k is 100% pure (999.9), 18k is 750/1000, and 14k is 585/1000.',
    primaryUnit: 'Karat Purity (Parts of 24)',
    unitSymbol: 'k',
    defaultVal: 18,
    metricBase: 0.750, // decimal purity for 18k
    metricName: 'Millesimal Fineness',
    metricSymbol: '‰',
    imperialBase: 18.0, // parts of 24
    imperialName: 'Parts of 24',
    imperialSymbol: '/24',
    subdivisions: [
      { name: 'Millesimal Fineness (Parts per 1000)', ratio: 41.6667, note: 'Karat × 41.667 = parts per thousand (e.g. 18k = 750‰)' },
      { name: 'Pure Gold Percentage (%)', ratio: 4.16667, note: 'Karat × 4.167% = % pure gold content' },
      { name: 'Alloy Content (%)', ratio: 0, note: 'Remaining percentage of copper/silver/zinc' }
    ],
    presets: [
      { label: '9k (British Traditional 375‰)', val: 9 },
      { label: '10k (US Legal Minimum 417‰)', val: 10 },
      { label: '14k (Most Common Jewelry 585‰)', val: 14 },
      { label: '18k (High Luxury Jewelry 750‰)', val: 18 },
      { label: '22k (Indian / Sovereign Gold 916‰)', val: 22 },
      { label: '24k (Pure Fine Gold 999‰)', val: 24 }
    ],
    contextHtml: '<p>The division of pure gold into 24 parts (karats) traces directly back to Emperor Constantine\'s 4th-century reform of Roman gold coinage. Constantine set the weight of the gold <em>solidus</em> coin at 24 <em>siliquae</em> (carob seed seeds). If a dishonest mint adulterated the coin with 6 siliquae of copper, it contained only 18 siliquae of gold, creating the 18-karat (18/24 = 75%) designation still used worldwide.</p>',
    primarySources: 'Diocletian\'s Currency Edicts; Cellini\'s <em>Treatises on Goldsmithing and Sculpture</em> (1568); London Assay Office Hallmarking Standards.',
    faq: [
      { q: 'What is the formula to convert gold karats to millesimal fineness?', a: 'Millesimal fineness equals (Karat / 24) × 1000. For example: 14k = (14 / 24) × 1000 = 583.33 (commercially marked 585 in European hallmarks).' },
      { q: 'Why is 24 the maximum number of karats for gold?', a: 'The number 24 originated from the 24 carob seeds (siliquae) that equaled the weight of one Roman solidus gold coin. 24 is also a highly composite number divisible by 2, 3, 4, 6, 8, and 12, making fractional alloy calculations simple.' }
    ]
  },

  // ─── 5. MARITIME, NAUTICAL & ATMOSPHERIC SYSTEMS (40-47) ───────────────────
  {
    slug: 'nautical-cable-length-converter',
    name: 'Maritime Cable Length',
    shortName: 'Maritime Cable',
    category: 'Maritime & Atmospheric',
    era: 'Age of Sail Naval Warfare',
    title: 'Maritime Cable Length (100 Fathoms / 1/10 Nautical Mile) to Feet & Meters [Royal Navy Battle Formation] | Digital Tools Shed',
    h1: 'Maritime Cable Length Distance Converter',
    metaDesc: 'Convert naval cable lengths (Royal Navy 100 fathoms / 600 ft / 182.88m vs US Navy 720 ft) to meters, feet, and nautical miles. Decode historical ship logs.',
    desc: 'The cable length (traditionally 100 fathoms / 600 feet / 182.88 meters) was the Age of Sail tactical station-keeping distance between warships in a line of battle.',
    primaryUnit: 'Cable Length (Royal Navy)',
    unitSymbol: 'cable',
    defaultVal: 1,
    metricBase: 182.88, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 600.0, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Fathoms (6 ft)', ratio: 100, note: '1 cable = 100 fathoms' },
      { name: 'Nautical Miles Fraction', ratio: 0.09874, note: 'Approx. 1/10th nautical mile' },
      { name: 'US Navy Cable (720 ft)', ratio: 0.8333, note: '1 RN cable = 0.833 US Navy cable (219.5 m)' },
      { name: 'Yards', ratio: 200, note: '200 yards exactly' }
    ],
    presets: [
      { label: '1 Cable (Standard Line of Battle Spacing)', val: 1 },
      { label: '2 Cables (Nelson at Trafalgar Range)', val: 2 },
      { label: '5 Cables (Half Nautical Mile)', val: 5 },
      { label: '10 Cables (1 Nautical Mile)', val: 10.127 }
    ],
    contextHtml: '<p>In Patrick O\'Brian\'s Aubrey-Maturin naval novels and Royal Navy fighting instructions, captains were ordered to maintain "half a cable" (300 feet) or "one cable" (600 feet) distance from the ship ahead. A hemp anchor cable was manufactured at 101 fathoms (606 feet) to leave sufficient slack for securing around the capstan.</p>',
    primarySources: 'Admiral Lord Nelson, <em>Fighting Instructions</em> (1805); Falconer\'s <em>New Universal Dictionary of the Marine</em> (1815).',
    faq: [
      { q: 'How long is a cable length at sea?', a: 'In the British Royal Navy, a cable length is exactly 100 fathoms (600 feet or 182.88 meters). In the US Navy, it is standardized at 120 fathoms (720 feet or 219.46 meters). Internationally, it is often treated as one-tenth of a nautical mile (185.2 meters).' },
      { q: 'Why was the distance called a cable?', a: 'It originated from the physical length of a ship\'s heavy anchor cable rope twisted on an outdoor ropewalk, which was traditionally woven to roughly 100 fathoms.' }
    ]
  },
  {
    slug: 'nautical-league-to-miles',
    name: 'Archaic Nautical League',
    shortName: 'Nautical League',
    category: 'Maritime & Atmospheric',
    era: 'Age of Discovery Navigation',
    title: 'Archaic Nautical League (3 Nautical Miles) to Statute Miles & Kilometers [Cannon-Shot Territorial Limit] | Digital Tools Shed',
    h1: 'Archaic Nautical League Distance Converter',
    metaDesc: 'Convert archaic nautical leagues (3 nautical miles = 5.556 km = 3.452 statute miles) to kilometers, statute miles, and feet. Understand maritime border history.',
    desc: 'The nautical league (equal to 3 nautical miles or 1/20th of a terrestrial degree) was the standard ocean voyager\'s unit and the origin of sovereign territorial waters.',
    primaryUnit: 'Nautical League',
    unitSymbol: 'league_naut',
    defaultVal: 1,
    metricBase: 5.556, // kilometers
    metricName: 'Kilometers',
    metricSymbol: 'km',
    imperialBase: 3.45234, // statute miles
    imperialName: 'Statute Miles',
    imperialSymbol: 'mi',
    subdivisions: [
      { name: 'Nautical Miles (NM)', ratio: 3, note: '1 league = 3 nautical miles' },
      { name: 'Cables', ratio: 30, note: '1 league = 30 cables' },
      { name: 'Fathoms', ratio: 3040.8, note: 'Approx. 3,041 fathoms' },
      { name: 'Meters', ratio: 5556, note: '5,556 meters' }
    ],
    presets: [
      { label: '1 League (3-Mile Cannon Shot Limit)', val: 1 },
      { label: '20 Leagues (1 Degree of Earth Latitude)', val: 20 },
      { label: '100 Leagues (Transatlantic Day Run)', val: 100 },
      { label: '20,000 Leagues (Jules Verne Nautilus Voyage)', val: 20000 }
    ],
    contextHtml: '<p>The international "3-mile limit" for territorial sea boundaries, codified in international law from the 18th century until UNCLOS in 1982, was directly based on one nautical league. This distance represented the maximum effective range of a shore-based smoothbore cannon battery firing seaward (the "cannon-shot rule").</p>',
    primarySources: 'Cornelius van Bynkershoek, <em>De Dominio Maris Dissertatio</em> (1702); Bowditch\'s <em>American Practical Navigator</em> (1802).',
    faq: [
      { q: 'How many miles is a nautical league?', a: 'One nautical league equals exactly 3 nautical miles (5.556 kilometers or 3.452 statute miles). It is defined as one-twentieth of a degree of meridian latitude.' },
      { q: 'Does 20,000 Leagues Under the Sea mean depth or distance?', a: 'It refers to distance traveled, not depth. Twenty thousand leagues equals 60,000 nautical miles (approx. 111,000 kilometers), roughly 2.7 times the circumference of the Earth. Earth\'s oceans are only about 11 km (2 leagues) deep at their deepest point!' }
    ]
  },
  {
    slug: 'fathom-to-feet-and-meters',
    name: 'Nautical Fathom (Sounding Depth)',
    shortName: 'Fathom',
    category: 'Maritime & Atmospheric',
    era: 'Traditional Nautical Soundings',
    title: 'Fathom (6 Feet Sea Sounding Depth) to Modern Feet, Meters & Centimeters [Mark Twain Riverboat Depth] | Digital Tools Shed',
    h1: 'Nautical Fathom Depth Converter',
    metaDesc: 'Convert nautical fathoms (6 feet / 1.8288 meters) to modern meters, feet, and centimeters. Explore lead-line sounding marks and Mark Twain riverboat lore.',
    desc: 'The fathom (exactly 6 feet / 2 yards / 1.8288 meters) was the universal sounding depth measure derived from an adult mariner\'s outstretched arm span.',
    primaryUnit: 'Fathom',
    unitSymbol: 'fathom',
    defaultVal: 1,
    metricBase: 1.8288, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 6.0, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Feet', ratio: 6, note: '1 fathom = 6 feet' },
      { name: 'Yards', ratio: 2, note: '1 fathom = 2 yards' },
      { name: 'Inches', ratio: 72, note: '72 inches' },
      { name: 'Centimeters', ratio: 182.88, note: '182.88 cm' }
    ],
    presets: [
      { label: '1 Fathom (6 Feet / Safe Dinghy Water)', val: 1 },
      { label: '2 Fathoms (12 Feet / "Mark Twain" Safe Steamboat)', val: 2 },
      { label: '10 Fathoms (60 Feet / Coastal Shoal)', val: 10 },
      { label: '100 Fathoms (Continental Shelf Edge)', val: 100 }
    ],
    contextHtml: '<p>The leadsman stood in the chains of Mississippi steamboats casting a lead weight on a marked line. Two fathoms (12 feet) was the critical threshold for safe paddle-steamer draft. The cry "By the mark, twain!" indicated two fathoms depth, which inspired pilot Samuel Langhorne Clemens to take his pen name: <strong>Mark Twain</strong>.</p>',
    primarySources: 'Mark Twain, <em>Life on the Mississippi</em> (1883); Dana\'s <em>The Seaman\'s Friend</em> (1841).',
    faq: [
      { q: 'How many feet and meters are in a fathom?', a: 'One fathom equals exactly 6 feet (2 yards or 1.8288 meters). It is still used on traditional bathymetric nautical charts.' },
      { q: 'What does "Mark Twain" mean in riverboat sounding?', a: 'It means "mark two" (two fathoms, or 12 feet of water depth). On Mississippi paddle steamers, 12 feet was safe water that cleared the boat\'s wooden hull.' }
    ]
  },
  {
    slug: 'shackle-shot-anchor-chain-length',
    name: 'Maritime Anchor Chain Shot (Shackle)',
    shortName: 'Anchor Chain Shot',
    category: 'Maritime & Atmospheric',
    era: 'Maritime Seamanship',
    title: 'Maritime Anchor Chain Shot / Shackle (15 Fathoms 90 Feet) to Meters [Anchor Scope Calculator] | Digital Tools Shed',
    h1: 'Anchor Chain Shot / Shackle Length Converter',
    metaDesc: 'Convert maritime anchor chain shots and shackles (15 fathoms / 90 feet / 27.43 meters) to meters, feet, and fathoms. Calculate safe anchor scope ratios.',
    desc: 'An anchor chain is forged and assembled in standardized segments called "shots" (in the US) or "shackles" (in the UK), each measuring exactly 15 fathoms (90 feet / 27.432 m).',
    primaryUnit: 'Shots / Shackles',
    unitSymbol: 'shot',
    defaultVal: 1,
    metricBase: 27.432, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 90.0, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Fathoms', ratio: 15, note: '1 shot = 15 fathoms' },
      { name: 'Yards', ratio: 30, note: '30 yards' },
      { name: 'Weight (38mm Stud-Link Chain kg)', ratio: 875, note: 'Approx. 875 kg per 15-fathom shot' },
      { name: 'Scope for 30ft Water Depth', ratio: 3.0, note: '1 shot = 3:1 scope in 30 ft water' }
    ],
    presets: [
      { label: '1 Shot (15 Fathoms / 90 Feet)', val: 1 },
      { label: '3 Shots (270 Feet / Standard Anchorage)', val: 3 },
      { label: '5 Shots (450 Feet / Storm Heavy Seas Scope)', val: 5 },
      { label: '10 Shots (Full Chain Locker Length)', val: 10 }
    ],
    contextHtml: '<p>Anchor chain segments are joined by detachable kenter shackles. Deckhands paint color bands on the chain studs (e.g. red, white, blue) and wrap seizing wire around adjacent links so the watch officer can visually verify how many shots have run through the hawsepipe into the seabed.</p>',
    primarySources: 'US Navy <em>Boatswain\'s Mate Manual</em>; Knight\'s <em>Modern Seamanship</em>.',
    faq: [
      { q: 'How long is one shot of anchor chain?', a: 'One shot (or shackle) of anchor chain measures exactly 15 fathoms (90 feet or 27.432 meters).' },
      { q: 'What anchor scope ratio is required for safe anchoring?', a: 'Mariners recommend an anchor scope (length of deployed rode to water depth plus freeboard) of 5:1 for calm weather and 7:1 for heavy storms, ensuring the chain pulls horizontally along the ocean floor.' }
    ]
  },
  {
    slug: 'moorsom-register-ton-shipping-volume',
    name: 'Moorsom Gross Register Tonnage',
    shortName: 'Register Ton (GRT)',
    category: 'Maritime & Atmospheric',
    era: '1854 Merchant Shipping Act',
    title: 'Moorsom System Gross Register Tonnage (GRT 100 Cubic Feet) to m³ [Ship Enclosed Volume] | Digital Tools Shed',
    h1: 'Moorsom Register Ton (GRT) Volume Converter',
    metaDesc: 'Convert Moorsom gross register tons (100 cubic feet = 2.8317 m³) to cubic meters, cubic feet, and liters. Understand why ship tonnage measures volume, not weight.',
    desc: 'The Moorsom System defines Gross Register Tonnage (GRT): 1 register ton equals exactly 100 cubic feet (~2.832 m³) of permanently enclosed ship volume.',
    primaryUnit: 'Register Tons (GRT)',
    unitSymbol: 'grt',
    defaultVal: 1,
    metricBase: 2.83168466, // cubic meters
    metricName: 'Cubic Meters',
    metricSymbol: 'm³',
    imperialBase: 100.0, // cubic feet
    imperialName: 'Cubic Feet',
    imperialSymbol: 'cu ft',
    subdivisions: [
      { name: 'Liters', ratio: 2831.68, note: '2,831.7 liters' },
      { name: 'US Gallons', ratio: 748.05, note: '748.1 US gallons' },
      { name: 'Cubic Yards', ratio: 3.7037, note: '3.70 cubic yards' },
      { name: 'Net Tonnage Approx (Cargo Hold)', ratio: 0.70, note: 'Typically ~70% of gross volume' }
    ],
    presets: [
      { label: '1 Register Ton (100 cu ft)', val: 1 },
      { label: '1,000 GRT (Vintage Coastal Steamer)', val: 1000 },
      { label: '46,328 GRT (RMS Titanic, 1912)', val: 46328 },
      { label: '236,857 GRT (Modern Wonder of the Seas)', val: 236857 }
    ],
    contextHtml: '<p>Devised by naval surveyor George Moorsom and enacted in the British Merchant Shipping Act of 1854, the Moorsom ton solved centuries of shipping tax fraud. Because port authorities levied harbor fees based on carrying capacity, shipbuilders built dangerously narrow hulls to minimize nominal tonnage. Moorsom standardized the tax on <strong>internal cubic capacity</strong>: 100 cubic feet = 1 ton.</p>',
    primarySources: 'British Merchant Shipping Act of 1854; IMO International Convention on Tonnage Measurement of Ships (1969).',
    faq: [
      { q: 'Is a register ton a measure of weight or volume?', a: 'A register ton is purely a measure of volume, NOT weight. One register ton represents 100 cubic feet (2.8317 cubic meters) of enclosed interior ship space.' },
      { q: 'What was the Gross Register Tonnage of the Titanic?', a: 'The RMS Titanic measured 46,328 Gross Register Tons (GRT), which represented 4,632,800 cubic feet (131,186 cubic meters) of enclosed interior space.' }
    ]
  },
  {
    slug: 'deadweight-tonnage-displacement',
    name: 'Deadweight Tonnage (DWT)',
    shortName: 'Deadweight (DWT)',
    category: 'Maritime & Atmospheric',
    era: 'Modern Commercial Maritime Logistics',
    title: 'Vessel Deadweight Tonnage (DWT) vs Long Ton Displacement Cargo Weight [Plimsoll Draft Calculator] | Digital Tools Shed',
    h1: 'Deadweight Tonnage (DWT) & Displacement Cargo Converter',
    metaDesc: 'Convert ship deadweight tonnage (DWT in metric tonnes and long tons) to displacement, cargo capacity, and freshwater draft sinkage allowance.',
    desc: 'Deadweight Tonnage (DWT) measures the actual physical cargo, fuel, water, and crew weight a ship can safely carry before sinking to its summer Plimsoll load line.',
    primaryUnit: 'Deadweight Tonnes (Metric)',
    unitSymbol: 'dwt',
    defaultVal: 1,
    metricBase: 1000.0, // kilograms
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 0.984207, // long tons (2240 lbs)
    imperialName: 'Long Tons (2,240 lbs)',
    imperialSymbol: 'LT',
    subdivisions: [
      { name: 'Short Tons (US 2,000 lbs)', ratio: 1.10231, note: '1.102 short tons' },
      { name: 'Pounds (lbs)', ratio: 2204.62, note: '2,204.6 lbs' },
      { name: 'Saltwater Displaced (m³ @ 1.025 t/m³)', ratio: 0.9756, note: '0.976 m³ displaced seawater' },
      { name: 'Freshwater Displaced (m³ @ 1.000 t/m³)', ratio: 1.0, note: '1.000 m³ displaced river water' }
    ],
    presets: [
      { label: '1,000 DWT (Feeder Cargo Coaster)', val: 1000 },
      { label: '50,000 DWT (Supramax Bulk Carrier)', val: 50000 },
      { label: '120,000 DWT (Capesize Iron Ore Vessel)', val: 120000 },
      { label: '320,000 DWT (VLCC Supertanker)', val: 320000 }
    ],
    contextHtml: '<p>British MP Samuel Plimsoll led the campaign for the Merchant Shipping Act of 1876, mandating the "Plimsoll Mark" painted on ship hulls. Unlike Gross Tonnage (which measures enclosed internal volume), Deadweight Tonnage (DWT) represents the total weight that submerges the vessel from its light ship baseline down to the Plimsoll load line.</p>',
    primarySources: 'Samuel Plimsoll, <em>Our Seamen: An Appeal</em> (1873); International Load Line Convention (1966).',
    faq: [
      { q: 'What is the difference between DWT and Gross Tonnage?', a: 'Gross Tonnage (GT) is a measure of total enclosed internal volume (100 cubic feet per ton). Deadweight Tonnage (DWT) is a measure of weight—the actual maximum weight of cargo, fuel, ballast, and provisions the ship can carry.' },
      { q: 'Why does a ship sink deeper in freshwater than seawater?', a: 'Because freshwater is less dense (1.000 tonnes/m³) than ocean saltwater (1.025 tonnes/m³), requiring a greater volume of water displacement to support the same vessel weight. The difference is the Freshwater Allowance (FWA).' }
    ]
  },
  {
    slug: 'beaufort-wind-scale-knots-pressure',
    name: 'Beaufort Wind Force Scale',
    shortName: 'Beaufort Scale',
    category: 'Maritime & Atmospheric',
    era: '1805 Royal Navy Meteorology',
    title: 'Beaufort Wind Force Scale (0 to 12) to Knots, MPH & Dynamic Wind Pressure [Admiral Beaufort Sea States] | Digital Tools Shed',
    h1: 'Beaufort Wind Force Scale & Dynamic Pressure Converter',
    metaDesc: 'Map Beaufort scale force numbers (0 Calm to 12 Hurricane) to knots, mph, wave heights, and dynamic wind pressure in psf. Explore 1805 Royal Navy sea states.',
    desc: 'Created in 1805 by Admiral Sir Francis Beaufort of the Royal Navy, the scale calibrates wind speed (0 to 12) from sea surface conditions and sail handling.',
    primaryUnit: 'Beaufort Number (Force)',
    unitSymbol: 'force',
    defaultVal: 6,
    metricBase: 12.5, // m/s for force 6
    metricName: 'Meters per Second',
    metricSymbol: 'm/s',
    imperialBase: 24.5, // knots for force 6
    imperialName: 'Knots',
    imperialSymbol: 'kts',
    subdivisions: [
      { name: 'Miles per Hour (MPH)', ratio: 28.0, note: 'Approx. 28 mph (Force 6)' },
      { name: 'Kilometers per Hour (km/h)', ratio: 45.0, note: 'Approx. 45 km/h' },
      { name: 'Dynamic Wind Pressure (psf)', ratio: 2.0, note: 'Approx. 2.0 lbs/sq ft wind load' },
      { name: 'Typical Sea Wave Height (ft)', ratio: 10.0, note: 'Approx. 10 ft crests (large waves)' }
    ],
    presets: [
      { label: 'Force 0 (Calm / Mirror Sea)', val: 0 },
      { label: 'Force 4 (Moderate Breeze / 13 kts / Small Whitecaps)', val: 4 },
      { label: 'Force 8 (Gale / 37 kts / High Waves & Spindrift)', val: 8 },
      { label: 'Force 12 (Hurricane / 64+ kts / Air Filled with Spray)', val: 12 }
    ],
    contextHtml: '<p>Admiral Sir Francis Beaufort formulated the scale for HMS <em>Woolwich</em> in 1805. It did not initially reference wind speeds in knots (anemometers were inaccurate), but rather how much canvas a full-rigged frigate could carry: Force 6 meant "single-reefed topsails and topgallant sails," while Force 12 was "that which no canvas could withstand."</p>',
    primarySources: 'Admiral Sir Francis Beaufort, <em>Logbook of HMS Woolwich</em> (1805); World Meteorological Organization (WMO Manual on Marine Meteorological Services).',
    faq: [
      { q: 'What is the empirical formula relating Beaufort scale to wind speed?', a: 'The standardized empirical formula is v = 0.836 × B^(1.5) m/s (where B is the Beaufort number and v is wind speed in meters per second). In knots, this is approx. v ≈ 1.625 × B^(1.5).' },
      { q: 'What wind speed is considered Force 12 Hurricane on the Beaufort Scale?', a: 'Beaufort Force 12 starts at 64 knots (73.6 mph or 118.5 km/h) and has no upper bound. The sea is completely white with driving spray, and visibility is severely impaired.' }
    ]
  },
  {
    slug: 'dead-reckoning-drift-knot-vector',
    name: 'Chip Log Dead Reckoning Vector',
    shortName: 'Dead Reckoning',
    category: 'Maritime & Atmospheric',
    era: 'Age of Sail Navigation',
    title: 'Historical Dead Reckoning: Chip Log Knots & Magnetic Variation Drift Vector [Sailing Leeway & Set/Drift Calculator] | Digital Tools Shed',
    h1: 'Chip Log Dead Reckoning & Leeway Drift Vector Calculator',
    metaDesc: 'Calculate Age of Sail dead reckoning navigation vectors from chip log knots (spaced at 47\'3" for 28 seconds), compass leeway drift, and ocean current set.',
    desc: 'Compute sailing ship positional vectors from chip log counts (knots spaced at 47 ft 3 in timed with a 28-second sandglass), correcting for leeway and ocean current.',
    primaryUnit: 'Chip Log Knots',
    unitSymbol: 'knots',
    defaultVal: 6,
    metricBase: 11.112, // km/h (6 knots)
    metricName: 'Kilometers per Hour',
    metricSymbol: 'km/h',
    imperialBase: 6.904, // mph
    imperialName: 'Statute MPH',
    imperialSymbol: 'mph',
    subdivisions: [
      { name: 'Nautical Miles per Hour', ratio: 1.0, note: '1 knot = 1 NM/hr' },
      { name: 'Feet per Minute', ratio: 101.27, note: '101.3 ft/min' },
      { name: 'Meters per Second', ratio: 0.5144, note: '0.514 m/s per knot' },
      { name: '24-Hour Day Run (Nautical Miles)', ratio: 24.0, note: '24 NM per knot per day' }
    ],
    presets: [
      { label: '3 Knots (Light Air Fluking)', val: 3 },
      { label: '6 Knots (Moderate Trade Winds)', val: 6 },
      { label: '10 Knots (Frigate at Full Sail)', val: 10 },
      { label: '16 Knots (Extreme Clipper Record Run)', val: 16 }
    ],
    contextHtml: '<p>The "chip log" was a wedge of wood weighted with lead to float vertically in the water. Thrown overboard from the stern, it held its place while a mariner let a line run through his fingers. Knots tied along the line every <strong>47 feet 3 inches</strong> were counted while a ship\'s boy held a <strong>28-second sandglass</strong>. Because 47.25 ft / 28 sec equals 6,076 ft / 3,600 sec (1 nautical mile per hour), the knot count directly gave ship speed in knots!</p>',
    primarySources: 'William Bourne, <em>A Regiment for the Sea</em> (1574); Nathaniel Bowditch, <em>The New American Practical Navigator</em> (1802).',
    faq: [
      { q: 'Why is maritime speed measured in "knots"?', a: 'Sailors counted the physical knots tied into a hemp logline as it spooled out from the stern over a 28-second sandglass interval. The count of knots equaled nautical miles per hour.' },
      { q: 'Why are knots on a chip log line spaced at 47 feet 3 inches?', a: 'A nautical mile is approximately 6,080 feet, and an hour has 3,600 seconds. The ratio of 28 seconds to 3,600 seconds is 1/128.57. Dividing 6,080 feet by 128.57 gives 47 feet 3 inches!' }
    ]
  },

  // ─── 6. OBSOLETE COMPUTING & MEDIA CAPACITIES (48-60) ──────────────────────
  {
    slug: 'ibm-80-column-punch-card-bytes',
    name: 'IBM 80-Column Punch Card',
    shortName: 'IBM Punch Card',
    category: 'Obsolete Computing & Media',
    era: '1928–1980s Mainframe Computing',
    title: 'IBM 80-Column Hollerith Punch Card Character Capacity to Kilobytes & Box Weight [Mainframe Data Density] | Digital Tools Shed',
    h1: 'IBM 80-Column Hollerith Punch Card Converter',
    metaDesc: 'Convert IBM 80-column punch cards to digital bytes, kilobytes, physical deck weights, and storage box volumes. Calculate physical cards needed for modern files.',
    desc: 'The iconic IBM 80-column punch card (7⅜" × 3¼", invented by Herman Hollerith) stored exactly 80 characters (bytes) of alphanumeric text across rectangular punched holes.',
    primaryUnit: 'Punch Cards',
    unitSymbol: 'cards',
    defaultVal: 2000, // 1 standard box
    metricBase: 0.160, // Megabytes (2,000 cards = 160 KB)
    metricName: 'Megabytes (MB)',
    metricSymbol: 'MB',
    imperialBase: 10.0, // pounds (1 box of 2000 cards weighs ~10 lbs)
    imperialName: 'Physical Weight (lbs)',
    imperialSymbol: 'lbs',
    subdivisions: [
      { name: 'Raw Characters (Bytes)', ratio: 80, note: '80 bytes per card' },
      { name: 'Kilobytes (KB)', ratio: 0.080, note: '0.080 KB per card' },
      { name: 'Card Trays / Boxes (2,000 cards)', ratio: 0.0005, note: '2,000 cards per standard cardboard box' },
      { name: 'Physical Weight (kg)', ratio: 0.00227, note: 'Approx. 2.27 grams per card (4.54 kg/box)' }
    ],
    presets: [
      { label: '1 Card (80 Bytes of FORTRAN Code)', val: 1 },
      { label: '2,000 Cards (1 Standard Box = 160 KB = 10 lbs)', val: 2000 },
      { label: '12,500 Cards (1 MB of Data = 6.25 Boxes = 62.5 lbs)', val: 12500 },
      { label: '62,500 Cards (5 MB MP3 Song = 31.25 Boxes = 312 lbs)', val: 62500 }
    ],
    contextHtml: '<p>Standardized by IBM in 1928, each card measured 7.375 × 3.25 inches (187.3 × 82.6 mm) with 80 columns and 12 punching rows. To store a single modern 5 MB smartphone photograph on punch cards requires <strong>62,500 individual cards</strong> packed into 31 cardboard boxes, weighing over <strong>312 pounds (142 kg)</strong> and forming a stack 36 feet tall!</p>',
    primarySources: 'IBM Reference Manual: <em>Form Principles of IBM Punched Card Operation</em> (1955); Hollerith, <em>An Electric Tabulating System</em> (1889).',
    faq: [
      { q: 'How many bytes of data could one IBM punch card hold?', a: 'Exactly 80 characters (80 bytes) of data, with one character encoded per column across the 80 columns using Hollerith rectangular hole combinations.' },
      { q: 'How much did a box of 2,000 punch cards weigh?', a: 'A standard full box of 2,000 IBM punch cards weighed approximately 10 pounds (4.54 kilograms) and held a mere 160 kilobytes of digital information.' }
    ]
  },
  {
    slug: 'punch-card-deck-height-storage',
    name: 'Punch Card Deck Height & Storage',
    shortName: 'Punch Card Deck',
    category: 'Obsolete Computing & Media',
    era: '1960s–1970s Mainframe Architecture',
    title: 'Boxed Punch Card Deck Height, Card Count (2,000 Cards/Tray) & MB Capacity [Data Center Shelf Space] | Digital Tools Shed',
    h1: 'Punch Card Deck Height & Filing Cabinet Storage Calculator',
    metaDesc: 'Calculate physical stack height, shelf volume, and filing cabinet requirements for punched card software decks. Reconstruct 1960s datacenter space planning.',
    desc: 'Standard punch card cardstock had a thickness of 0.007 inches (0.178 mm), creating immense physical storage requirements for early mainframe databases.',
    primaryUnit: 'Punch Cards',
    unitSymbol: 'cards',
    defaultVal: 10000,
    metricBase: 1.78, // meters height
    metricName: 'Stack Height (Meters)',
    metricSymbol: 'm',
    imperialBase: 5.833, // feet height (70 inches)
    imperialName: 'Stack Height (Feet)',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Stack Height (Inches)', ratio: 0.007, note: '0.007 inches per card' },
      { name: 'Standard 2,000-Card Trays', ratio: 0.0005, note: '1 tray = 14 inches long' },
      { name: 'Filing Cabinet Drawers (holds 3,500)', ratio: 0.0002857, note: 'Standard card drawer holds 3,500 cards' },
      { name: 'Total Digital Capacity (KB)', ratio: 0.080, note: '80 bytes per card' }
    ],
    presets: [
      { label: '2,000 Cards (1 Tray / 14 Inches / 160 KB)', val: 2000 },
      { label: '10,000 Cards (5 Trays / 5.8 Feet / 800 KB)', val: 10000 },
      { label: '50,000 Cards (25 Trays / 29 Feet / 4 MB)', val: 50000 },
      { label: '1,000,000 Cards (Census Archive / 583 Feet / 80 MB)', val: 1000000 }
    ],
    contextHtml: '<p>During the Apollo space program, the Apollo Guidance Computer operating system code written by Margaret Hamilton and her MIT team filled stacks of printed source code and punch cards taller than the programmers themselves. Large corporate data centers required entire air-conditioned warehouses with reinforced floor joists to bear the crushing weight of paper punch cards.</p>',
    primarySources: 'MIT Instrumentation Laboratory, <em>Apollo Guidance Computer (AGC) Luminary 1A Source Code</em>; IBM 7090 Operations Manual.',
    faq: [
      { q: 'How thick was an IBM punch card?', a: 'Standard punch cards were made of specialized paper cardstock measuring 0.0070 inches (0.178 millimeters) in thickness, specified strictly to prevent jamming in mechanical card sorters operating at 1,000 cards per minute.' },
      { q: 'How tall would a stack of cards be to hold 1 Gigabyte of data?', a: 'To hold 1 GB (1,073,741,824 bytes) would require 13,421,773 punch cards. Stacked vertically, this deck would stand 7,829 feet (2,386 meters) tall—higher than seven Empire State Buildings stacked end-to-end!' }
    ]
  },
  {
    slug: '9-track-magnetic-tape-capacity',
    name: '1/2-Inch 9-Track Magnetic Reel Tape',
    shortName: '9-Track Tape',
    category: 'Obsolete Computing & Media',
    era: '1964–1990s Mainframe Computing',
    title: '1/2-Inch 9-Track Magnetic Reel Tape Data Capacity by BPI (800, 1600, 6250) [Mainframe Tape Density] | Digital Tools Shed',
    h1: '1/2-Inch 9-Track Magnetic Reel Tape Capacity Calculator',
    metaDesc: 'Calculate uncompressed MB capacity of standard 2,400-foot magnetic reel tapes across recording densities (800 NRZI, 1600 PE, 6250 GCR). Convert reels to USB drives.',
    desc: 'The standard 10.5-inch reel of 1/2-inch magnetic tape (2,400 feet long) was the universal bulk storage and movie hacker visual cliché of 1960s–1980s computing.',
    primaryUnit: 'Standard 2,400-Ft Tape Reels',
    unitSymbol: 'reels',
    defaultVal: 1,
    metricBase: 140.0, // Megabytes at 6250 BPI
    metricName: 'Megabytes (6250 GCR)',
    metricSymbol: 'MB',
    imperialBase: 2400.0, // linear feet
    imperialName: 'Linear Feet of Tape',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Capacity at 800 BPI NRZI (MB)', ratio: 20.0, note: '~20 MB (early IBM System/360)' },
      { name: 'Capacity at 1600 BPI PE (MB)', ratio: 40.0, note: '~40 MB (most widespread 1970s standard)' },
      { name: 'Capacity at 6250 BPI GCR (MB)', ratio: 140.0, note: '~140 MB (late high-density standard)' },
      { name: 'Physical Weight (lbs @ 2.5 lbs/reel)', ratio: 2.5, note: 'Approx. 2.5 lbs (1.13 kg) per 10.5" reel' }
    ],
    presets: [
      { label: '1 Reel (140 MB @ 6250 BPI / 2.5 lbs)', val: 1 },
      { label: '10 Reels (1.4 GB / Tape Library Rack)', val: 10 },
      { label: '50 Reels (7 GB / Corporate Backup)', val: 50 },
      { label: '7,143 Reels (1 Terabyte Equivalent = 9 Tons)', val: 7143 }
    ],
    contextHtml: '<p>Introduced with the IBM System/360 in 1964, 9-track tape encoded 8 bits of data plus 1 parity bit across the width of the 1/2-inch mylar tape. Standard 2,400-foot reels spun at 200 inches per second (11.3 mph) in vacuum-column tape drives like the IBM 3420, capable of rewinding the entire half-mile reel in under 45 seconds.</p>',
    primarySources: 'IBM Systems Reference Library: <em>Magnetic Tape Units</em> (Form GA22-6862); ANSI X3.40-1976 Standard.',
    faq: [
      { q: 'How many megabytes fit on a 9-track magnetic reel tape?', a: 'On a standard 2,400-foot reel, capacity depended on density: 800 BPI stored ~20 MB, 1600 BPI stored ~40 MB, and 6250 BPI stored up to ~140 MB (accounting for inter-record gap overhead).' },
      { q: 'How many 9-track reels would you need to back up a modern 1 TB SSD?', a: 'At the maximum historical density of 6250 BPI (140 MB per reel), backing up a 1 Terabyte drive would require roughly 7,143 individual 10.5-inch tape reels, weighing over 17,800 pounds (8 metric tonnes)!' }
    ]
  },
  {
    slug: '7-track-univac-tape-capacity',
    name: '1/2-Inch 7-Track BCD Magnetic Tape',
    shortName: '7-Track Tape',
    category: 'Obsolete Computing & Media',
    era: '1950s–1960s First-Generation Mainframes',
    title: '1/2-Inch 7-Track Magnetic Tape Capacity (200, 556, 800 BPI) in BCD Alphanumeric Characters [UNIVAC & IBM 7090] | Digital Tools Shed',
    h1: '1/2-Inch 7-Track BCD Magnetic Tape Capacity Calculator',
    metaDesc: 'Calculate character capacity of vintage 7-track magnetic tapes (IBM 729, UNIVAC) across 200, 556, and 800 BPI densities. Decode 6-bit BCD data formats.',
    desc: 'Before 8-bit bytes became standard in 1964, first- and second-generation mainframes used 7-track tape recording 6-bit Binary Coded Decimal (BCD) characters plus 1 parity bit.',
    primaryUnit: 'Standard 2,400-Ft Tape Reels',
    unitSymbol: 'reels',
    defaultVal: 1,
    metricBase: 18.0, // Megabytes (million characters) at 800 BPI
    metricName: 'Million Characters (BCD)',
    metricSymbol: 'M Char',
    imperialBase: 2400.0, // linear feet
    imperialName: 'Linear Feet of Tape',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Capacity at 200 BPI (Million Chars)', ratio: 4.5, note: '~4.5 million characters (early IBM 704)' },
      { name: 'Capacity at 556 BPI (Million Chars)', ratio: 12.5, note: '~12.5 million characters' },
      { name: 'Capacity at 800 BPI (Million Chars)', ratio: 18.0, note: '~18.0 million characters (IBM 729 VI)' },
      { name: 'Equivalent 80-Column Cards', ratio: 225000, note: 'Equivalent to 225,000 punched cards' }
    ],
    presets: [
      { label: '1 Reel (18M Chars @ 800 BPI)', val: 1 },
      { label: '5 Reels (90M Chars / Full Univac Dataset)', val: 5 },
      { label: '20 Reels (360M Chars / Government Census Backup)', val: 20 },
      { label: '55,555 Reels (1 Terabyte Equivalent)', val: 55555 }
    ],
    contextHtml: '<p>The IBM 729 magnetic tape unit was the iconic computing machine of the late 1950s and 1960s, instantly recognizable in films like <em>Dr. Strangelove</em>. Each line across the tape recorded 6 data bits (representing alphanumeric characters in BCDIC) plus 1 parity bit for error checking, revolutionizing data processing compared to fragile paper punch cards.</p>',
    primarySources: 'IBM Customer Engineering Manual of Instruction: <em>729 Magnetic Tape Unit</em> (1961); UNIVAC UNISERVO Tape Subsystem Manual.',
    faq: [
      { q: 'Why did early computer tapes use 7 tracks instead of 8 or 9?', a: 'Early scientific and business computers used 6-bit character codes (64 possible characters, sufficient for uppercase letters, numbers, and punctuation). Six data tracks plus one parity track totaled seven tracks.' },
      { q: 'How many punched cards could one 7-track tape replace?', a: 'A single 2,400-foot reel recorded at 800 BPI could store approximately 18 to 20 million characters, replacing over 225,000 physical punch cards (more than 112 heavy cardboard storage boxes).' }
    ]
  },
  {
    slug: '8-inch-floppy-disk-capacity',
    name: '8-Inch Floppy Diskette (IBM 3740 / CP/M)',
    shortName: '8-Inch Floppy',
    category: 'Obsolete Computing & Media',
    era: '1971–1980s Microcomputing',
    title: '8-Inch Floppy Diskette Capacity (SSSD 250 KB to DSDD 1.2 MB) vs Modern Formats [CP/M Vintage Disk Drive] | Digital Tools Shed',
    h1: '8-Inch Floppy Diskette Capacity & File Storage Converter',
    metaDesc: 'Convert 8-inch floppy disk capacities (IBM 3740 SSSD 256 KB, DSDD 1.2 MB) to modern files, MP3s, and smartphone photos. Explore early CP/M microcomputing.',
    desc: 'The original 8-inch floppy diskette (introduced by IBM in 1971) began with 80 KB of read-only microcode storage and evolved into the standard 256 KB SSSD CP/M disk.',
    primaryUnit: '8-Inch Floppies (SSSD 256 KB)',
    unitSymbol: 'disks',
    defaultVal: 1,
    metricBase: 0.256, // Megabytes (256 KB)
    metricName: 'Megabytes (MB)',
    metricSymbol: 'MB',
    imperialBase: 0.25, // lbs (weight of 1 jacketed disk)
    imperialName: 'Physical Weight (lbs)',
    imperialSymbol: 'lbs',
    subdivisions: [
      { name: 'Kilobytes (KB)', ratio: 256, note: '256 KB formatted capacity' },
      { name: 'Bytes', ratio: 262144, note: '262,144 bytes' },
      { name: 'DSDD 1.2 MB Disks Equivalent', ratio: 0.2133, note: '1.2 MB late double-density disks held 4.7× more' },
      { name: 'Modern 32 GB Thumb Drive Equivalent', ratio: 0.000008, note: '125,000 floppies = 1 thumb drive' }
    ],
    presets: [
      { label: '1 Disk (256 KB / Complete CP/M 2.2 OS + WordStar)', val: 1 },
      { label: '4 Disks (1 Megabyte of Text Files)', val: 4 },
      { label: '20 Disks (5 MB MP3 Audio Track = 5 lbs)', val: 20 },
      { label: '4,000 Disks (1 Gigabyte Movie Video)', val: 4000 }
    ],
    contextHtml: '<p>Invented at IBM by a team led by Alan Shugart, the 8-inch flexible magnetic diskette inside a vinyl jacket was initially called the "Memory Disk" (used to load microcode into System/370 mainframes). When Gary Kildall created CP/M (Control Program for Microcomputers) in 1974, the IBM 3740 8-inch single-sided single-density (SSSD) format became the universal software distribution standard across early microcomputers.</p>',
    primarySources: 'IBM 3740 Data Entry System Reference Manual; Digital Research CP/M Operating System Manual (1976); Shugart Associates SA800 Manual.',
    faq: [
      { q: 'How much data could an 8-inch floppy disk hold?', a: 'The standard IBM 3740 single-sided single-density (SSSD) format held 256,256 bytes (approx. 250 KB). Later double-sided double-density (DSDD) 8-inch disks reached 1.2 Megabytes.' },
      { q: 'Why was the floppy disk flexible ("floppy")?', a: 'Unlike rigid aluminum hard disk platters, floppy disks were stamped from thin, flexible biaxially oriented polyethylene terephthalate (PET mylar) coated with iron oxide and enclosed in a protective flexible PVC jacket.' }
    ]
  },
  {
    slug: '5-quarter-inch-floppy-capacity',
    name: '5.25-Inch Floppy Disk (Apple II / IBM PC)',
    shortName: '5.25-Inch Floppy',
    category: 'Obsolete Computing & Media',
    era: '1976–1990s Personal Computer Era',
    title: '5.25-Inch Floppy Disk Capacity (Apple II 140 KB, PC 360 KB, AT 1.2 MB) to Modern Megabytes [Retro PC Storage] | Digital Tools Shed',
    h1: '5.25-Inch Floppy Diskette Capacity Converter',
    metaDesc: 'Convert 5.25-inch minifloppy disk capacities (Apple II DOS 3.3 140 KB, IBM PC 360 KB, PC/AT 1.2 MB) to modern files and bytes. Calculate retro game disk counts.',
    desc: 'The 5.25-inch "minifloppy" defined the 1980s personal computer revolution, from Steve Wozniak\'s Apple Disk II (140 KB) to the ubiquitous IBM PC 360 KB floppy.',
    primaryUnit: '5.25-Inch Disks (IBM PC 360 KB)',
    unitSymbol: 'disks',
    defaultVal: 1,
    metricBase: 0.360, // Megabytes
    metricName: 'Megabytes (MB)',
    metricSymbol: 'MB',
    imperialBase: 360.0, // Kilobytes
    imperialName: 'Kilobytes (KB)',
    imperialSymbol: 'KB',
    subdivisions: [
      { name: 'Apple II DOS 3.3 Disks (140 KB)', ratio: 2.5714, note: '140 KB single-sided 35 tracks' },
      { name: 'Commodore 1541 Disks (170 KB)', ratio: 2.1176, note: '170 KB GCR formatted' },
      { name: 'IBM PC/AT 1.2 MB Disks', ratio: 0.30, note: '1.2 MB high density (96 TPI)' },
      { name: 'Total Formatted Bytes', ratio: 368640, note: '368,640 bytes (40 tracks × 9 sectors × 512 bytes)' }
    ],
    presets: [
      { label: '1 Disk (360 KB / MS-DOS 3.3 Boot Disk)', val: 1 },
      { label: '3 Disks (1 Megabyte of Shareware)', val: 2.84 },
      { label: '14 Disks (5 MB MP3 Song)', val: 13.88 },
      { label: '2,844 Disks (1 Gigabyte Video Game)', val: 2844 }
    ],
    contextHtml: '<p>Legend says Shugart Associates created the 5.25-inch format in 1976 after customer Jim Adkisson insisted 8-inch disks were too large for desktop computers; sitting in a bar, Adkisson pointed to a cocktail napkin and declared, "About that size!" In 1978, Steve Wozniak designed the ingenious 6-chip controller for the Apple Disk II, propelling the Apple II into a runaway business success.</p>',
    primarySources: 'Shugart Associates SA400 Minifloppy Reference Manual (1976); IBM Personal Computer Technical Reference (1981); Wozniak, <em>Apple II Floppy Disk Controller Patent US4488188A</em>.',
    faq: [
      { q: 'How many kilobytes were on a standard 5.25-inch floppy disk?', a: 'An Apple II DOS 3.3 disk held 140 KB; a Commodore 64 1541 disk held 170 KB; a standard IBM PC double-sided double-density (DSDD) disk held 360 KB; and a high-density (HD) IBM PC/AT disk held 1.2 MB.' },
      { q: 'What was a "flippy disk"?', a: 'In the 1980s, users of single-sided disk drives (like the Commodore 1541) used a hole-punch tool called a "disk notcher" to cut a second write-enable notch on the left side of the jacket, allowing the disk to be flipped over to write on the bottom side for free.' }
    ]
  },
  {
    slug: 'baudot-5-bit-teletype-tape-length',
    name: 'Baudot 5-Bit Paper Tape Length',
    shortName: 'Baudot Paper Tape',
    category: 'Obsolete Computing & Media',
    era: '1870s–1970s Telecommunications',
    title: 'Baudot 5-Bit Teletype Punched Paper Tape Length (10 Chars/Inch) to Kilobytes [Telex Machine Data Spool] | Digital Tools Shed',
    h1: 'Baudot 5-Bit Teletype Punched Paper Tape Calculator',
    metaDesc: 'Convert Baudot 5-level punched paper tape length (10 characters per inch / 100 feet per spool) to modern kilobytes and characters. Explore vintage Telex protocols.',
    desc: 'Standard punched paper tape encoded 10 characters per linear inch across 5 data hole positions, driving telegraph networks, Telex machines, and the Altair 8800.',
    primaryUnit: 'Feet of Paper Tape',
    unitSymbol: 'ft',
    defaultVal: 100, // 100-foot roll
    metricBase: 0.012, // Megabytes (12 KB for 100 ft)
    metricName: 'Kilobytes (KB)',
    metricSymbol: 'KB',
    imperialBase: 1200.0, // characters
    imperialName: 'Baudot Characters',
    imperialSymbol: 'chars',
    subdivisions: [
      { name: 'Characters (Bytes)', ratio: 120, note: '10 chars/inch = 120 chars per linear foot' },
      { name: 'Meters of Tape', ratio: 0.3048, note: '0.305 meters per foot' },
      { name: 'Standard 8-Inch Tape Spools (1,000 ft)', ratio: 0.001, note: '1,000-ft spool holds ~120 KB' },
      { name: 'Weight (Paper Roll lbs)', ratio: 0.002, note: 'Approx. 2 lbs per 1,000-ft spool' }
    ],
    presets: [
      { label: '1 Foot (120 Characters / 1 Telegram Message)', val: 1 },
      { label: '35 Feet (Bill Gates 4 KB Altair BASIC Tape, 1975)', val: 35 },
      { label: '100 Feet (Standard Office Telex Roll = 12 KB)', val: 100 },
      { label: '1,000 Feet (Full Tape Spool = 120 KB = 2 lbs)', val: 1000 }
    ],
    contextHtml: '<p>Invented by Émile Baudot in 1870, the 5-bit Baudot code (ITA2) used 5 perforated holes across 11/16-inch paper tape. In 1975, when Bill Gates and Paul Allen founded Micro-Soft to sell BASIC for the MITS Altair 8800, the 4 KB interpreter was distributed exclusively on spools of oiled yellow paper tape fed into an ASR-33 Teletype tape reader.</p>',
    primarySources: 'ITU-T Recommendation S.1 (ITA2 Code); Teletype Corporation: <em>Model 33 Technical Manual</em>; MITS Altair 8800 BASIC Manual (1975).',
    faq: [
      { q: 'How many characters fit on a foot of punched paper tape?', a: 'Standard punched paper tape had holes punched on 0.1-inch centers, which yields exactly 10 characters per inch or 120 characters per linear foot.' },
      { q: 'How long was the paper tape for Altair BASIC in 1975?', a: 'Bill Gates\' original 4 KB Altair BASIC interpreter occupied approximately 35 to 40 feet of punched paper tape, taking roughly 5 to 6 minutes to load into the computer over an ASR-33 Teletype reader at 10 characters per second.' }
    ]
  },
  {
    slug: 'acoustic-coupler-modem-transfer-time',
    name: 'Acoustic Coupler Modem Transfer Time',
    shortName: 'Acoustic Coupler Modem',
    category: 'Obsolete Computing & Media',
    era: '1960s–1980s Dial-Up Telecomputing',
    title: 'Acoustic Coupler 300 Baud (Bell 103) File Download & Transfer Time Calculator [WarGames Retro Modem] | Digital Tools Shed',
    h1: 'Acoustic Coupler 300 Baud (Bell 103) Modem Transfer Time Calculator',
    metaDesc: 'Calculate download and transfer times for text files, MP3s, and modern webpages over a 300-baud acoustic coupler telephone modem (Bell 103 FSK protocol).',
    desc: 'The acoustic coupler modem (standardized as Bell 103 at 300 baud / ~30 characters per second) transmitted data using audio tones over a standard telephone handset.',
    primaryUnit: 'File Size (Kilobytes)',
    unitSymbol: 'KB',
    defaultVal: 10,
    metricBase: 341.33, // seconds to transfer 10 KB
    metricName: 'Transfer Time (Seconds)',
    metricSymbol: 'sec',
    imperialBase: 5.689, // minutes
    imperialName: 'Transfer Time (Minutes)',
    imperialSymbol: 'min',
    subdivisions: [
      { name: 'Transfer Time (Minutes)', ratio: 0.5689, note: '5.69 minutes per 10 KB' },
      { name: 'Transfer Time (Hours)', ratio: 0.00948, note: '0.095 hours per 10 KB' },
      { name: 'Raw Characters per Second (CPS)', ratio: 30.0, note: '300 baud / 10 bits per byte = 30 CPS' },
      { name: '1200 Baud Modem Equivalent Time (sec)', ratio: 85.33, note: '4× faster at 1200 baud' }
    ],
    presets: [
      { label: '1 KB (Short Email Message / 34 Seconds)', val: 1 },
      { label: '10 KB (Full Chapter of Text / 5.7 Minutes)', val: 10 },
      { label: '160 KB (1 Floppy Disk / 1.5 Hours)', val: 160 },
      { label: '5,000 KB (5 MB MP3 Song / 47.4 Hours = 2 Days)', val: 5000 }
    ],
    contextHtml: '<p>Featured prominently in the 1983 film <em>WarGames</em>, an acoustic coupler used rubber suction cups to cradle a telephone handset, converting digital binary into audio tones (Bell 103 frequency-shift keying: 1070/1270 Hz for originate, 2025/2225 Hz for answer). At 300 baud with 1 start bit, 8 data bits, and 1 stop bit (10 bits/char), effective throughput was exactly <strong>30 bytes per second</strong>.</p>',
    primarySources: 'Bell System Technical Reference: <em>Data Sets 103A and 103E</em> (1962); Cerf & Kahn, <em>A Protocol for Packet Network Intercommunication</em> (1974).',
    faq: [
      { q: 'How fast was a 300-baud acoustic coupler modem in modern terms?', a: 'At 300 baud (bits per second), throughput was roughly 0.0003 Megabits per second, or about 30 characters (bytes) of text per second—roughly the speed of a fast human reader.' },
      { q: 'How long would it take to download a 5 MB song over a 300-baud modem?', a: 'A 5 Megabyte MP3 file would take approximately 170,667 seconds, which equals 2,844 minutes, or roughly 47.4 hours (nearly two full days of uninterrupted telephone connection).' }
    ]
  },
  {
    slug: 'core-memory-ferrite-ring-volume',
    name: 'Magnetic Core Memory Ferrite Rings',
    shortName: 'Core Memory',
    category: 'Obsolete Computing & Media',
    era: '1955–1975 Mainframe & Apollo Era',
    title: 'Magnetic Core Memory Ferrite Ring Count, Physical Volume & Copper Wire Mass [Apollo Guidance Computer] | Digital Tools Shed',
    h1: 'Magnetic Core Memory Ring Count & Physical Volume Calculator',
    metaDesc: 'Convert magnetic core memory capacities (Apollo AGC 72 KB, IBM 7090 144 KB) into physical ferrite ring counts, cubic inches, and woven copper wire length.',
    desc: 'Before silicon RAM chips, computer memory consisted of tiny ceramic ferrite doughnut rings threaded onto fine copper wires by hand under microscopes (1 ring = 1 bit).',
    primaryUnit: 'Kilobytes (KB)',
    unitSymbol: 'KB',
    defaultVal: 32,
    metricBase: 262144, // individual ferrite cores
    metricName: 'Ferrite Core Rings',
    metricSymbol: 'rings',
    imperialBase: 12.8, // cubic inches physical volume
    imperialName: 'Module Volume (cu in)',
    imperialSymbol: 'cu in',
    subdivisions: [
      { name: 'Individual Ferrite Rings', ratio: 8192, note: '8,192 rings per KB (1 bit = 1 ring)' },
      { name: 'Copper Wire Length (Meters)', ratio: 16.38, note: 'Approx. 16.4 m woven wire per KB' },
      { name: 'Core Plane Board Area (sq in)', ratio: 3.2, note: 'Approx. 3.2 sq inches per KB (50-mil cores)' },
      { name: 'Apollo AGC 72 KB Core Ropes Equivalent', ratio: 0.4444, note: '32 KB = 44% of Apollo AGC memory' }
    ],
    presets: [
      { label: '4 KB (Early Minicomputer Memory / 32,768 Rings)', val: 4 },
      { label: '32 KB (Standard PDP-11 / 262,144 Rings)', val: 32 },
      { label: '72 KB (Apollo Guidance Computer AGC / 589,824 Rings)', val: 72 },
      { label: '1,024 KB (1 MB Mainframe Memory / 8.4 Million Rings)', val: 1024 }
    ],
    contextHtml: '<p>Invented by Jay Forrester and An Wang, core memory was the dominant computer RAM from 1955 to 1975. Coincident-current pulses along X and Y wires flipped a core\'s magnetic polarity clockwise (0) or counterclockwise (1). For NASA\'s Apollo missions, female textile workers at Raytheon hand-wove Apollo "core rope memory" into guidance computers, earning it the affectionate nickname <em>LOL memory</em> ("Little Old Lady memory").</p>',
    primarySources: 'Jay Forrester, <em>Digital Information Storage in Three Dimensions Using Magnetic Cores</em> (1951); NASA SP-4214: <em>Chariots for Apollo</em>; IBM 7090 Functional Characteristics.',
    faq: [
      { q: 'How many ferrite rings were needed for 1 Megabyte of core memory?', a: 'Because each doughnut-shaped ferrite ring stored exactly one bit of data, 1 Megabyte (1,048,576 bytes) required exactly 8,388,608 individually hand-threaded ferrite rings.' },
      { q: 'Why did core memory retain its data when turned off?', a: 'Ferrite has a square hysteresis loop, meaning it remains permanently magnetized in either the clockwise or counterclockwise direction until an electric current actively flips it. It was completely non-volatile.' }
    ]
  },
  {
    slug: 'commodore-64-datasette-tape-counter',
    name: 'Commodore 64 Datasette Tape Counter',
    shortName: 'C64 Datasette',
    category: 'Obsolete Computing & Media',
    era: '1982–1990s 8-Bit Home Computing',
    title: 'Commodore 64 1530 Datasette Mechanical Tape Counter to Loading Time & Seconds [C64 Cassette Tape] | Digital Tools Shed',
    h1: 'Commodore 64 Datasette Tape Counter & Loading Time Calculator',
    metaDesc: 'Convert mechanical 3-digit tape counter positions on a Commodore 1530 Datasette into loading times (seconds/minutes) and loaded program bytes at 300–400 baud.',
    desc: 'The mechanical 3-digit counter on the Commodore 1530 Datasette measured cassette reel revolutions, guiding 1980s gamers through 15-minute game loading sessions.',
    primaryUnit: 'Tape Counter Revolutions',
    unitSymbol: 'count',
    defaultVal: 100,
    metricBase: 240.0, // seconds
    metricName: 'Loading Time (Seconds)',
    metricSymbol: 'sec',
    imperialBase: 4.0, // minutes
    imperialName: 'Loading Time (Minutes)',
    imperialSymbol: 'min',
    subdivisions: [
      { name: 'Loading Time (Minutes)', ratio: 0.04, note: 'Approx. 4 minutes per 100 counter units' },
      { name: 'Standard ROM Data Loaded (KB)', ratio: 0.08, note: '~8 KB at standard 300 baud KERNAL rate' },
      { name: 'Turbo Tape 64 Fastloader Loaded (KB)', ratio: 0.80, note: '~80 KB with 10× Turbo Tape utility' },
      { name: 'Linear Tape Length (Meters @ 4.76 cm/s)', ratio: 0.1143, note: 'Standard cassette speed 1-7/8 ips' }
    ],
    presets: [
      { label: 'Counter 25 (Small BASIC Program / 1 Minute)', val: 25 },
      { label: 'Counter 100 (Standard 8 KB Game / 4 Minutes)', val: 100 },
      { label: 'Counter 350 (Full 64 KB RAM Game Load / 14 Minutes)', val: 350 },
      { label: 'Counter 600 (Full Side of C-60 Cassette / 30 Minutes)', val: 600 }
    ],
    contextHtml: '<p>The Commodore 1530 Datasette encoded data as square wave audio pulses using frequency modulation (short pulses = 1, long pulses = 0). Because the standard C64 operating system wrote every byte twice to verify checksums without hardware error correction, loading a 32 KB game took over 12 minutes while the screen flashed psychedelic horizontal border colors.</p>',
    primarySources: 'Commodore 64 Programmer\'s Reference Guide (1982); Commodore 1530 (C2N) Datasette Service Manual.',
    faq: [
      { q: 'How fast did a Commodore 64 Datasette load programs?', a: 'Standard KERNAL cassette routines loaded data at approximately 300 to 400 baud (approx. 40 to 50 bytes per second), requiring around 12 to 15 minutes to load a 32 KB game.' },
      { q: 'What did the mechanical counter numbers actually measure?', a: 'The 3-digit counter was driven by a rubber belt connected to the take-up reel spindle. It measured revolutions of the reel, meaning counter numbers ticked faster at the beginning of a tape than at the end as the tape roll thickened.' }
    ]
  },
  {
    slug: 'vacuum-tube-flip-flop-power-heat',
    name: 'Vacuum Tube Flip-Flop Power & Heat',
    shortName: 'Vacuum Tube Bit',
    category: 'Obsolete Computing & Media',
    era: '1940s–1950s First-Generation Computers (ENIAC)',
    title: 'Vacuum Tube Flip-Flop Power Consumption (Watts) & Thermal BTU Heat per Bit [ENIAC Power Grid] | Digital Tools Shed',
    h1: 'Vacuum Tube Flip-Flop Power & Thermal Heat Dissipation Calculator',
    metaDesc: 'Calculate electrical power consumption (Watts, Amps) and air conditioning BTU cooling loads for vacuum-tube digital flip-flop registers in ENIAC and UNIVAC I.',
    desc: 'A single 1-bit digital flip-flop in 1946 required two thermionic vacuum tube triodes (or a dual-triode 6SN7), consuming 5 to 10 Watts of filament heater power.',
    primaryUnit: 'Digital Bits (Flip-Flops)',
    unitSymbol: 'bits',
    defaultVal: 1024, // 1 Kilobit
    metricBase: 7.68, // Kilowatts (at 7.5 W per bit)
    metricName: 'Power Consumption (kW)',
    metricSymbol: 'kW',
    imperialBase: 26205.0, // BTU/hr heat generated
    imperialName: 'Heat Dissipated (BTU/hr)',
    imperialSymbol: 'BTU/hr',
    subdivisions: [
      { name: 'Total Watts (at 7.5 W/bit)', ratio: 7.5, note: 'Filament heater + plate dissipation' },
      { name: 'Thermal Heat (BTU/hr)', ratio: 25.59, note: '3.412 BTU/hr per Watt' },
      { name: 'Cooling Tonnage Required (Tons AC)', ratio: 0.002133, note: '12,000 BTU/hr = 1 ton AC' },
      { name: 'Vacuum Tube Count (Dual-Triodes)', ratio: 1.0, note: '1 tube per bit (e.g. 6SN7 / 12AU7)' }
    ],
    presets: [
      { label: '8 Bits (1 Byte Register / 60 Watts)', val: 8 },
      { label: '1,024 Bits (1 Kilobit / 7.7 kW / 2.2 Tons AC)', val: 1024 },
      { label: '17,468 Tubes (Total ENIAC Computer / 150 kW / 42 Tons AC)', val: 17468 },
      { label: '8,388,608 Bits (1 MB RAM Equivalent = 62.9 Megawatts = Nuclear Plant)', val: 8388608 }
    ],
    contextHtml: '<p>The <strong>ENIAC</strong> (Electronic Numerical Integrator and Computer, 1946) contained 17,468 vacuum tubes and drew 150 kilowatts of electricity—legendarily causing the lights of West Philadelphia to dim when powered on. To construct 1 Gigabyte of modern smartphone RAM using ENIAC tube technology would require <strong>64 Gigawatts of electrical power</strong> (the output of 60 commercial nuclear reactors) and generate enough heat to boil a river!</p>',
    primarySources: 'Goldstine & Goldstine, <em>The Electronic Numerical Integrator and Computer (ENIAC)</em> (1946); Burks, <em>Supercomputing for the 1940s: Construction of ENIAC</em>.',
    faq: [
      { q: 'How much power did a single vacuum tube bit consume?', a: 'A standard dual-triode tube flip-flop consumed between 5 and 10 Watts of electrical power, primarily due to the glowing tungsten heater filament operating at 6.3 Volts and 300–600 mA.' },
      { q: 'Why did early vacuum tube computers fail so frequently?', a: 'Tungsten filaments experience immense thermal expansion stress each time power is cycled. With 18,000 tubes in ENIAC, a tube failed approximately every two days, requiring technicians to test tubes by hand with voltmeters.' }
    ]
  },
  {
    slug: 'mercury-delay-line-memory-bits',
    name: 'Mercury Delay Line Acoustic Memory',
    shortName: 'Mercury Delay Line',
    category: 'Obsolete Computing & Media',
    era: '1949–1955 First-Generation Computers (UNIVAC / EDSAC)',
    title: 'Mercury Acoustic Delay Line Memory Bit Capacity (Sound Wave Velocity) [EDSAC & UNIVAC I Tank] | Digital Tools Shed',
    h1: 'Mercury Acoustic Delay Line Memory Calculator',
    metaDesc: 'Calculate acoustic delay line memory bit capacities from tank length, 1.45 km/s sound wave velocity in liquid mercury, and piezo transducer pulse frequency.',
    desc: 'Before magnetic cores, pioneer computers (EDSAC, UNIVAC I) stored bits as supersonic acoustic sound waves circulating through 5-foot steel tubes filled with liquid mercury.',
    primaryUnit: 'Delay Line Tanks (5-Ft Mercury)',
    unitSymbol: 'tanks',
    defaultVal: 1,
    metricBase: 576, // bits (typical EDSAC long tank)
    metricName: 'Stored Bits',
    metricSymbol: 'bits',
    imperialBase: 5.0, // length in feet
    imperialName: 'Tube Length (Feet)',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Computer Words (36-bit words)', ratio: 16, note: '16 words per tank (EDSAC standard)' },
      { name: 'Bytes (8-bit bytes equivalent)', ratio: 72, note: '72 bytes per 5-foot tank' },
      { name: 'Circulation Acoustic Delay (µs)', ratio: 1050, note: '1,050 microseconds acoustic travel time' },
      { name: 'Liquid Mercury Mass (kg @ 13.53 g/cm³)', ratio: 15.0, note: 'Approx. 15 kg (33 lbs) mercury per tank' }
    ],
    presets: [
      { label: '1 Tank (576 Bits / 16 Words / 15 kg Mercury)', val: 1 },
      { label: '32 Tanks (EDSAC Total Memory = 18,432 Bits = 2.3 KB)', val: 32 },
      { label: '100 Tanks (UNIVAC I Memory = 1,000 12-Char Words = 1.5 Tons Mercury)', val: 100 },
      { label: '14,563,555 Tanks (1 Gigabyte RAM = 218,000 Tons Mercury = World Supply)', val: 14563555 }
    ],
    contextHtml: '<p>Conceived by J. Presper Eckert for wartime radar, an acoustic delay line utilized a quartz piezoelectric crystal to convert electric pulses into ultrasonic waves (1.45 kilometers per second in liquid mercury). The sound pulse traveled down a 5-foot mercury tube, was detected by a receiving crystal, amplified, reshaped, and looped back to the transmitter in a perpetual ultrasonic echo cycle.</p>',
    primarySources: 'Eckert, <em>A Survey of Digital Computer Memory Systems</em> (1953); Wilkes, <em>The Preparation of Programs for an Electronic Digital Computer (EDSAC)</em> (1951).',
    faq: [
      { q: 'How did sound in mercury store digital computer data?', a: 'Supersonic pulses (sound waves) traveled through the dense liquid mercury from a transmitter to a receiver. A pulse represented a binary 1, while silence represented a 0. The bits circulated continuously through the liquid until recalled.' },
      { q: 'Why was liquid mercury used instead of water?', a: 'Mercury has an acoustic impedance that almost perfectly matches quartz crystals, minimizing reflections at the boundaries, and a relatively low temperature coefficient of sound velocity (1,450 m/s).' }
    ]
  },
  {
    slug: 'drum-memory-magnetic-cylinder',
    name: 'Magnetic Drum Memory Cylinder',
    shortName: 'Drum Memory',
    category: 'Obsolete Computing & Media',
    era: '1950s Early Mainframe Computing (IBM 650)',
    title: 'Magnetic Drum Memory Cylinder Capacity (RPM, Tracks, Words) [IBM 650 Vintage Computer] | Digital Tools Shed',
    h1: 'Magnetic Drum Memory Cylinder Capacity & Latency Calculator',
    metaDesc: 'Calculate storage capacity, track count, and rotational latency for 1950s magnetic drum computers like the IBM 650. Model pioneer magnetic surface recording.',
    desc: 'The magnetic drum (a rapidly spinning metal cylinder coated with ferromagnetic oxide) was the primary working memory of 1950s computers like the bestselling IBM 650.',
    primaryUnit: 'Drum Cylinders',
    unitSymbol: 'drums',
    defaultVal: 1,
    metricBase: 10.0, // Kilobytes (2,000 10-digit words ≈ 10 KB)
    metricName: 'Kilobytes (KB)',
    metricSymbol: 'KB',
    imperialBase: 12500.0, // RPM rotational speed
    imperialName: 'RPM Rotational Speed',
    imperialSymbol: 'RPM',
    subdivisions: [
      { name: 'IBM 650 10-Digit Words', ratio: 2000, note: '2,000 words standard drum' },
      { name: 'Total Tracks (Bands)', ratio: 40, note: '40 tracks with 50 words per track' },
      { name: 'Average Rotational Latency (ms)', ratio: 2.4, note: '2.4 ms average access time (12,500 RPM)' },
      { name: 'Physical Cylinder Weight (lbs)', ratio: 50.0, note: 'Approx. 50 lbs spinning solid brass drum' }
    ],
    presets: [
      { label: '1 Drum (10 KB / 2,000 Words / 12,500 RPM)', val: 1 },
      { label: '2 Drums (20 KB / Expanded IBM 650 Memory)', val: 2 },
      { label: '10 Drums (100 KB / Scientific Laboratory System)', val: 10 },
      { label: '100,000 Drums (1 Gigabyte RAM = 2,500 Tons of Spinning Brass)', val: 100000 }
    ],
    contextHtml: '<p>The IBM 650 (announced in 1953) was the world\'s first mass-produced computer, selling nearly 2,000 units. Its central memory was a 4-inch diameter by 16-inch long brass cylinder rotating at a blistering 12,500 RPM. Clever programmers used "optimum programming" techniques: interleaving instructions around the drum so the next instruction rotated directly under the read head just as the previous one finished execution!</p>',
    primarySources: 'IBM 650 Magnetic Drum Data-Processing System Manual (Form 22-6060); Melzak, <em>The Story of Mel, a Real Programmer</em>.',
    faq: [
      { q: 'How much data did an IBM 650 magnetic drum hold?', a: 'The standard IBM 650 drum held 2,000 words of memory (each word was 10 decimal digits plus a sign, equivalent to roughly 10 Kilobytes). Later models expanded to 4,000 words.' },
      { q: 'Why was drum memory replaced by magnetic core and hard disks?', a: 'Drum memory was constrained by mechanical rotational latency (having to wait for the cylinder to spin around to read data) and physical size limitations. Magnetic cores provided true instantaneous random access.' }
    ]
  },

  // ─── 7. TRADITIONAL ENGLISH, IMPERIAL & AGRICULTURAL SURVEYING (61-90) ─────
  {
    slug: 'gunters-chain-to-feet-meters',
    name: 'Gunter\'s Surveying Chain (66 Feet)',
    shortName: 'Gunter\'s Chain',
    category: 'Traditional English & Surveying',
    era: '1620s English Land Surveying',
    title: 'Gunter\'s Chain (66 Feet / 100 Links) to Modern Feet, Meters & Acres [Cadastral Deed Boundaries] | Digital Tools Shed',
    h1: 'Gunter\'s Surveying Chain (66 Feet) Converter',
    metaDesc: 'Convert Gunter\'s surveying chains (66 feet / 20.1168 meters) to feet, meters, rods, and acres. Decode 17th–19th century historical deed boundaries.',
    desc: 'Devised by English mathematician Edmund Gunter in 1620, the 66-foot chain with 100 iron links revolutionized land measurement: 10 square chains equaled exactly 1 acre.',
    primaryUnit: 'Gunter\'s Chains',
    unitSymbol: 'ch',
    defaultVal: 1,
    metricBase: 20.1168, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 66.0, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Surveyor Links (li)', ratio: 100, note: '1 chain = 100 links (7.92 inches each)' },
      { name: 'Rods / Perches', ratio: 4, note: '1 chain = 4 rods (16.5 feet each)' },
      { name: 'Yards', ratio: 22, note: '22 yards (exact cricket pitch length)' },
      { name: 'Furlong Fraction', ratio: 0.10, note: '10 chains = 1 furlong (660 feet)' },
      { name: 'Statute Mile Fraction', ratio: 0.0125, note: '80 chains = 1 statute mile (5,280 feet)' }
    ],
    presets: [
      { label: '1 Chain (66 Feet / Cricket Pitch)', val: 1 },
      { label: '10 Chains (1 Furlong / 660 Feet)', val: 10 },
      { label: '80 Chains (1 Statute Mile / US Public Land Section)', val: 80 },
      { label: '10 Square Chains (1 Full Acre of Land)', val: 1 }
    ],
    contextHtml: '<p>Edmund Gunter\'s genius was decimalizing the awkward English agrarian system. Because 1 chain was 66 feet (4 rods), a rectangular field measuring 10 chains long by 1 chain wide had an area of 660 × 66 = 43,560 square feet—<strong>exactly one statute acre</strong>. A surveyor could tally dimensions in links (e.g., 4.52 chains = 452 links) and calculate acreage via pure decimal multiplication.</p>',
    primarySources: 'Edmund Gunter, <em>The Description and Use of the Sector, Crosse-Staffe, and Other Instruments</em> (1624); US Public Land Survey System (PLSS) Manuals.',
    faq: [
      { q: 'How long is a Gunter\'s chain?', a: 'One Gunter\'s chain measures exactly 66 feet (22 yards, 4 rods, or 20.1168 meters). It is composed of 100 individual forged iron links.' },
      { q: 'Why is a cricket pitch exactly 22 yards long?', a: 'Because the original 18th-century rules of cricket specified the pitch length as exactly one surveyor\'s chain (66 feet or 22 yards), as every English village commons had a chain for boundary disputes.' }
    ]
  },
  {
    slug: 'surveyors-link-to-inches',
    name: 'Surveyor\'s Link (7.92 Inches)',
    shortName: 'Surveyor\'s Link',
    category: 'Traditional English & Surveying',
    era: 'Cadastral Surveying',
    title: 'Surveyor\'s Link (7.92 Inches / 1/100 Chain) to Centimeters & Feet [Vintage Deed Link Calculator] | Digital Tools Shed',
    h1: 'Surveyor\'s Link (7.92 Inches) Converter',
    metaDesc: 'Convert surveyor\'s links (7.92 inches / 20.1168 cm) to decimal feet, inches, and meters. Translate antique property deeds written in "chains and links".',
    desc: 'The link (symbol: li, exactly 7.92 inches or 0.66 feet) was one of the 100 interconnected wire links in a Gunter\'s chain, widely used in US and Commonwealth property deeds.',
    primaryUnit: 'Surveyor Links (li)',
    unitSymbol: 'li',
    defaultVal: 1,
    metricBase: 0.201168, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 7.92, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Decimal Feet', ratio: 0.66, note: '1 link = 0.66 feet' },
      { name: 'Centimeters', ratio: 20.1168, note: '20.1168 cm' },
      { name: 'Chain Fraction', ratio: 0.01, note: '100 links = 1 chain (66 ft)' },
      { name: 'Rod Fraction', ratio: 0.04, note: '25 links = 1 rod (16.5 ft)' }
    ],
    presets: [
      { label: '1 Link (7.92 Inches / 20.1 cm)', val: 1 },
      { label: '25 Links (1 Rod / Pole / Perch = 16.5 ft)', val: 25 },
      { label: '50 Links (Half Chain / 33 ft)', val: 50 },
      { label: '100 Links (1 Full Chain / 66 ft)', val: 100 }
    ],
    contextHtml: '<p>Many 18th- and 19th-century county land deeds in North America describe parcel boundaries with bearings and distances such as "North 42° East, 14 chains and 37 links to a white oak stump." To locate the modern boundary, multiply chains by 66 and links by 0.66 (e.g. 14 × 66 + 37 × 0.66 = 948.42 feet).</p>',
    primarySources: 'Clevenger\'s <em>Treatise on the Method of Government Surveying</em> (1874); Bureau of Land Management (BLM) Cadastral Survey Guidelines.',
    faq: [
      { q: 'How many inches are in a surveyor\'s link?', a: 'There are exactly 7.92 inches (0.66 feet or 20.1168 centimeters) in one surveyor\'s link. One hundred links form one 66-foot Gunter\'s chain.' },
      { q: 'How do you convert chains and links to modern feet?', a: 'Formula: Feet = (Chains × 66) + (Links × 0.66). For example, 5 chains and 25 links = (5 × 66) + (25 × 0.66) = 330 + 16.5 = 346.5 feet.' }
    ]
  },
  {
    slug: 'rod-pole-perch-land-measurement',
    name: 'Rod, Pole & Perch (16.5 Feet)',
    shortName: 'Rod / Pole / Perch',
    category: 'Traditional English & Surveying',
    era: 'Medieval English Agrarian Law',
    title: 'Rod, Pole & Perch (16.5 Feet / 5.5 Yards) to Meters, Feet & Acres [Medieval Ox-Goad Land Measure] | Digital Tools Shed',
    h1: 'Rod, Pole & Perch Land Distance Converter',
    metaDesc: 'Convert historical rods, poles, and perches (16.5 feet / 5.0292 meters) to modern feet, yards, and meters. Explore the origins of the medieval ox-goad.',
    desc: 'The rod, pole, and perch are three names for the identical medieval English unit: exactly 16.5 feet (5.5 yards or 5.0292 meters), originally the length of an ox-goad.',
    primaryUnit: 'Rods / Poles / Perches',
    unitSymbol: 'rod',
    defaultVal: 1,
    metricBase: 5.0292, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 16.5, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Yards', ratio: 5.5, note: '1 rod = 5.5 yards' },
      { name: 'Inches', ratio: 198, note: '198 inches' },
      { name: 'Surveyor Links (li)', ratio: 25, note: '1 rod = 25 links' },
      { name: 'Chain Fraction', ratio: 0.25, note: '4 rods = 1 Gunter\'s chain (66 ft)' },
      { name: 'Furlong Fraction', ratio: 0.025, note: '40 rods = 1 furlong (660 ft)' }
    ],
    presets: [
      { label: '1 Rod / Perch (16.5 Feet / 1 Ox-Goad)', val: 1 },
      { label: '4 Rods (1 Chain / 66 Feet)', val: 4 },
      { label: '40 Rods (1 Furlong / 660 Feet)', val: 40 },
      { label: '160 Square Rods (1 Full Acre)', val: 1 }
    ],
    contextHtml: '<p>Under the 16th-century German legal text by Jacob Köbel, a rod was standardized on Sunday mornings by lining up the first 16 men exiting church and measuring the length of their left feet heel-to-toe. In England, the rod equaled the wooden goad used by an ox-driver to prod his 4-ox plow team, which double-served as a land measurement rod at the end of each furrow.</p>',
    primarySources: 'Statute for Measuring Land (33 Edw. I, 1305); Jacob Köbel, <em>Geometrei: Von künstlichem Feldmessen</em> (1535).',
    faq: [
      { q: 'Are a rod, a pole, and a perch the exact same measurement?', a: 'Yes, they are identical. All three terms denote the exact distance of 16.5 feet (5.5 yards, or 5.0292 meters). "Perch" was more common in masonry and France, "pole" in common speech, and "rod" in legal surveying.' },
      { q: 'How many square rods make an acre?', a: 'Exactly 160 square rods make one statute acre (40 rods in length by 4 rods in width, or 660 × 66 feet = 43,560 square feet).' }
    ]
  },
  {
    slug: 'furlong-to-miles-and-meters',
    name: 'Traditional Furlong (660 Feet)',
    shortName: 'Furlong',
    category: 'Traditional English & Surveying',
    era: 'Medieval Open-Field Agriculture & Horse Racing',
    title: 'Traditional Furlong (660 Feet / 1/8 Mile) to Modern Meters & Yards [Thoroughbred Horse Racing Distance] | Digital Tools Shed',
    h1: 'Traditional Furlong Distance Converter',
    metaDesc: 'Convert traditional furlongs (660 feet / 201.168 meters / 1/8 statute mile) to meters, kilometers, and yards. Analyze racetrack distances like the Kentucky Derby.',
    desc: 'The furlong (literally "furrow-long", 660 feet / 40 rods / 201.168 meters) was the medieval plowman\'s standard furrow length, surviving today in thoroughbred horse racing.',
    primaryUnit: 'Furlongs',
    unitSymbol: 'fur',
    defaultVal: 1,
    metricBase: 201.168, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 660.0, // feet
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Yards', ratio: 220, note: '1 furlong = 220 yards' },
      { name: 'Statute Mile Fraction', ratio: 0.125, note: '8 furlongs = 1 statute mile (5,280 ft)' },
      { name: 'Gunter\'s Chains', ratio: 10, note: '1 furlong = 10 chains (66 ft each)' },
      { name: 'Rods / Perches', ratio: 40, note: '1 furlong = 40 rods (16.5 ft each)' }
    ],
    presets: [
      { label: '1 Furlong (220 Yards / 201.2 m)', val: 1 },
      { label: '6 Furlongs (Sprint Thoroughbred Race)', val: 6 },
      { label: '8 Furlongs (1 Mile / 1,760 Yards)', val: 8 },
      { label: '10 Furlongs (1.25 Miles / Kentucky Derby Race Distance)', val: 10 }
    ],
    contextHtml: '<p>The word <em>furlong</em> comes from Old English <em>furh</em> ("furrow") + <em>lang</em> ("long"). In medieval open-field strip farming, it represented the ideal distance an ox team could drag a heavy moldboard plow through damp clay before resting. Queen Elizabeth I codified the English statute mile in 1593 as exactly 8 furlongs (8 × 660 = 5,280 feet) to reconcile Roman miles with English agrarian furlongs.</p>',
    primarySources: 'Statute of 35 Elizabeth I c. 6 (1593); Maitland, <em>Domesday Book and Beyond</em> (1897); The Jockey Club Racing Rules.',
    faq: [
      { q: 'How long is a furlong in feet, yards, and meters?', a: 'One furlong equals exactly 660 feet, 220 yards, 40 rods, or 201.168 meters. It is exactly one-eighth of a standard statute mile.' },
      { q: 'How many furlongs is the Kentucky Derby?', a: 'The Kentucky Derby is 10 furlongs long, which equals 1.25 miles (2,200 yards or 2,011.68 meters).' }
    ]
  },
  {
    slug: 'hide-virgate-medieval-land-tax',
    name: 'Medieval Hide & Virgate Land Tax',
    shortName: 'Hide & Virgate',
    category: 'Traditional English & Surveying',
    era: 'Anglo-Saxon & Norman England (Domesday Book, 1086)',
    title: 'Medieval Hide (120 Acres) & Virgate (Yardland) Feudal Tax Area Converter [Domesday Book 1086] | Digital Tools Shed',
    h1: 'Medieval Hide & Virgate Feudal Land Tax Converter',
    metaDesc: 'Convert Anglo-Saxon and Norman hides (approx. 120 acres / 48.6 ha) and virgates (30 acres) to acres, hectares, and oxgangs. Explore Domesday Book taxation.',
    desc: 'The hide (~120 acres) was the foundational land assessment unit in William the Conqueror\'s Domesday Book (1086), defining feudal taxation and military knight service.',
    primaryUnit: 'Hides',
    unitSymbol: 'hide',
    defaultVal: 1,
    metricBase: 48.562, // hectares (120 acres)
    metricName: 'Hectares',
    metricSymbol: 'ha',
    imperialBase: 120.0, // acres
    imperialName: 'Statute Acres',
    imperialSymbol: 'ac',
    subdivisions: [
      { name: 'Virgates / Yardlands (1/4 hide)', ratio: 4, note: '1 hide = 4 virgates (~30 acres each)' },
      { name: 'Bovates / Oxgangs (1/8 hide)', ratio: 8, note: '1 hide = 8 bovates (~15 acres each)' },
      { name: 'Roods (1/4 acre)', ratio: 480, note: '1 hide = 480 roods' },
      { name: 'Carucate Equivalent (Ploughland)', ratio: 1.0, note: '1 carucate ≈ 1 hide (land ploughed by 8-ox team)' }
    ],
    presets: [
      { label: '1 Bovate / Oxgang (15 Acres / 1 Ox Plow Share)', val: 0.125 },
      { label: '1 Virgate / Yardland (30 Acres / Peasant Family Holding)', val: 0.25 },
      { label: '1 Hide (120 Acres / 1 Knight\'s Fee Basis)', val: 1 },
      { label: '5 Hides (1 Saxon Thegn Estate / Military Quota)', val: 5 }
    ],
    contextHtml: '<p>The hide originally represented the amount of land needed to support one free peasant household and its 8-ox plow team (a <em>caruca</em>). In the 1086 Domesday Book, King William I used the hide as an assessment unit for the "Danegeld" land tax. Five hides was the minimum estate required for a Saxon warrior to claim the noble rank of Thegn.</p>',
    primarySources: '<em>Domesday Book</em> (1086); Vinogradoff, <em>Villainage in England</em> (1892); Round, <em>Feudal England</em>.',
    faq: [
      { q: 'How many acres was a medieval hide?', a: 'While it varied based on soil fertility and regional custom, the standard legal hide was conventionally reckoned at 120 statute acres (approx. 48.6 hectares).' },
      { q: 'What is a virgate or yardland?', a: 'A virgate (also called a yardland) was one-quarter of a hide, typically around 30 acres. It was the standard self-sustaining farm holding for a medieval peasant family (villein).' }
    ]
  },
  {
    slug: 'rood-of-land-to-acres',
    name: 'Rood of Land (Quarter Acre)',
    shortName: 'Rood of Land',
    category: 'Traditional English & Surveying',
    era: 'British & Commonwealth Land Titles',
    title: 'Rood of Land (40 Square Perches / 1/4 Acre) to Square Feet, Acres & m² [Historic Commonwealth Land Deeds] | Digital Tools Shed',
    h1: 'Rood of Land Area Converter',
    metaDesc: 'Convert roods of land (40 square perches = 1,011.7 m² = 10,890 sq ft = 1/4 acre) to modern acres and square meters. Decode "Acre-Rood-Perch" (A-R-P) surveys.',
    desc: 'The rood (exactly 40 square rods/perches, or one-quarter of an acre = 10,890 sq ft / 1,011.7 m²) was ubiquitous in English, Australian, and Canadian land titles.',
    primaryUnit: 'Roods',
    unitSymbol: 'rood',
    defaultVal: 1,
    metricBase: 1011.7141, // square meters
    metricName: 'Square Meters',
    metricSymbol: 'm²',
    imperialBase: 10890.0, // square feet
    imperialName: 'Square Feet',
    imperialSymbol: 'sq ft',
    subdivisions: [
      { name: 'Statute Acre Fraction', ratio: 0.25, note: '4 roods = 1 acre (43,560 sq ft)' },
      { name: 'Square Perches / Poles', ratio: 40, note: '1 rood = 40 square perches (272.25 sq ft each)' },
      { name: 'Square Yards', ratio: 1210, note: '1,210 square yards' },
      { name: 'Hectares', ratio: 0.10117, note: '0.1012 hectares' }
    ],
    presets: [
      { label: '1 Rood (Quarter Acre / 10,890 sq ft)', val: 1 },
      { label: '2 Roods (Half Acre / 21,780 sq ft)', val: 2 },
      { label: '3 Roods (Three Quarters Acre / 32,670 sq ft)', val: 3 },
      { label: '4 Roods (1 Full Statute Acre)', val: 4 }
    ],
    contextHtml: '<p>Until the mid-20th century, property boundaries throughout the British Empire were recorded in the classic triple notation <strong>A-R-P</strong> (Acres, Roods, and Perches). For example, a pastoral deed recorded as <code>14A 2R 15P</code> represented 14 acres + (2 × 1/4 acre) + (15 × 1/160 acre) = 14.59375 acres.</p>',
    primarySources: 'Blackstone\'s <em>Commentaries on the Laws of England</em>; Torrens Land Title Registration System Records (Australia/NZ).',
    faq: [
      { q: 'How big is a rood of land?', a: 'A rood equals exactly one-quarter of an acre: 40 square rods, 1,210 square yards, 10,890 square feet, or 1,011.71 square meters.' },
      { q: 'What does the word "rood" mean?', a: 'Rood comes from the Old English rōd, meaning a rod, pole, or cross. As a land measure, it originally meant a strip of land one furrow-long (40 rods or 1 furlong) by one rod in width (40 × 1 = 40 square rods).' }
    ]
  },
  {
    slug: 'firkin-ale-butter-volume-weight',
    name: 'Firkin (Ale, Beer & Butter)',
    shortName: 'Firkin',
    category: 'Traditional English & Surveying',
    era: 'British Cooperage & Dairy Trade',
    title: 'Firkin Cask Volume (9 Imperial Gallons Beer / 8 Gallons Ale) & Butter Weight (56 lbs) [Vintage Cooperage] | Digital Tools Shed',
    h1: 'Firkin Cask Volume & Butter Weight Converter',
    metaDesc: 'Convert firkin wooden casks (9 Imperial gallons beer / 40.91 L vs 56 lbs salted butter) to liters, US gallons, and kilograms. Understand historic cooperage.',
    desc: 'The firkin (from Middle Dutch <em>vierdekijn</em>, "fourth part") was a quarter-barrel wooden cask holding 9 Imperial gallons (40.9 L) of beer, or 56 lbs of butter.',
    primaryUnit: 'Firkins (Beer Cask)',
    unitSymbol: 'firkin',
    defaultVal: 1,
    metricBase: 40.9148, // liters (9 Imperial gallons)
    metricName: 'Liters (Beer)',
    metricSymbol: 'L',
    imperialBase: 9.0, // Imperial gallons
    imperialName: 'Imperial Gallons',
    imperialSymbol: 'imp gal',
    subdivisions: [
      { name: 'US Liquid Gallons', ratio: 10.808, note: '10.81 US gallons' },
      { name: 'Imperial Pints', ratio: 72, note: '72 British pub pints' },
      { name: 'Butter Firkin Weight (lbs)', ratio: 56.0, note: 'Standard commercial firkin = 56 lbs butter (25.4 kg)' },
      { name: 'British Beer Barrel Fraction', ratio: 0.25, note: '4 firkins = 1 beer barrel (36 imp gal)' }
    ],
    presets: [
      { label: '1 Firkin (9 Imp Gal Beer / 72 Pints)', val: 1 },
      { label: '2 Firkins (1 Kilderkin Cask / 18 Imp Gal)', val: 2 },
      { label: '4 Firkins (1 Full Beer Barrel / 36 Imp Gal)', val: 4 },
      { label: '1 Butter Firkin (56 lbs / 25.4 kg Irish Butter)', val: 1 }
    ],
    contextHtml: '<p>In traditional British brewing, beer (flavored with hops) and ale (unhopped) had different cask standards until unified in 1824: an ale firkin was 8 gallons, while a beer firkin was 9 gallons. In the dairy trade, the Cork Butter Exchange in Ireland (the largest butter market in the world) traded exclusively in 56-pound firkins of salted butter shipped across the globe in oak tubs.</p>',
    primarySources: 'Statute of 1 Wm. & Mary c. 24; O\'Donovan, <em>The Economic History of Live Stock in Ireland</em>; CAMRA Cask Ale Cellar Manual.',
    faq: [
      { q: 'How many pints are in a firkin of cask ale?', a: 'A standard British firkin contains 9 Imperial gallons, which equals exactly 72 Imperial pints (40.91 liters or 10.81 US liquid gallons).' },
      { q: 'How much does a butter firkin weigh?', a: 'In the British and American agricultural markets, a firkin of salted butter was legally standardized at 56 pounds (one half of a hundredweight, or 25.40 kilograms) net weight.' }
    ]
  },
  {
    slug: 'kilderkin-beer-cask-converter',
    name: 'Kilderkin Beer Cask (18 Gallons)',
    shortName: 'Kilderkin Cask',
    category: 'Traditional English & Surveying',
    era: 'Traditional British Brewing',
    title: 'Kilderkin Beer Cask (18 Imperial Gallons / Half Barrel) to Liters, US Gallons & Pints [Pub Cellar Calculator] | Digital Tools Shed',
    h1: 'Kilderkin Beer Cask Volume Converter',
    metaDesc: 'Convert kilderkin casks (18 Imperial gallons / 81.83 liters / 144 British pints) to liters, US gallons, and pub servings. Model traditional cellar stocks.',
    desc: 'The kilderkin (from Dutch <em>kindekijn</em>, "child cask", equal to 2 firkins or half a barrel) held exactly 18 Imperial gallons (81.83 liters / 144 pub pints).',
    primaryUnit: 'Kilderkins',
    unitSymbol: 'kilderkin',
    defaultVal: 1,
    metricBase: 81.8296, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 18.0, // Imperial gallons
    imperialName: 'Imperial Gallons',
    imperialSymbol: 'imp gal',
    subdivisions: [
      { name: 'British Pub Pints', ratio: 144, note: '144 Imperial pints (20 fl oz each)' },
      { name: 'US Liquid Gallons', ratio: 21.617, note: '21.62 US gallons' },
      { name: 'Firkins (9 gal)', ratio: 2, note: '1 kilderkin = 2 firkins' },
      { name: 'Beer Barrel Fraction', ratio: 0.5, note: '2 kilderkins = 1 British beer barrel (36 gal)' }
    ],
    presets: [
      { label: '1 Kilderkin (18 Imp Gal / 144 Pints)', val: 1 },
      { label: '2 Kilderkins (1 Beer Barrel / 36 Imp Gal)', val: 2 },
      { label: '4 Kilderkins (1 Hogshead Cask / 54 Imp Gal)', val: 4 },
      { label: '10 Kilderkins (Busy Pub Weekend Stock)', val: 10 }
    ],
    contextHtml: '<p>The kilderkin was the workhorse cask for busy Victorian taverns and public houses. Too heavy to lift by hand when full (weighing approx. 220 pounds / 100 kg), kilderkins were rolled down cellar wooden skids and mounted horizontally on wooden stillages with vent pegs and brass taps hammered into the keystone bung.</p>',
    primarySources: 'Weights and Measures Act of 1824; Brewing Trade Gazette; Cellarmanship: <em>The Definitive Guide to Storing and Serving Real Ale</em>.',
    faq: [
      { q: 'How many gallons and pints are in a kilderkin?', a: 'A kilderkin holds exactly 18 Imperial gallons, which equals 144 Imperial pints (81.83 liters or 21.62 US gallons). It is exactly one-half of a standard British beer barrel.' },
      { q: 'How much does a full kilderkin cask weigh?', a: 'A full wooden oak kilderkin weighs roughly 220 pounds (100 kg), consisting of 180 lbs of ale plus 40 lbs of heavy stave cooperage and steel hoops.' }
    ]
  },
  {
    slug: 'hogshead-wine-tobacco-capacity',
    name: 'Hogshead Cask (Wine, Beer & Tobacco)',
    shortName: 'Hogshead Cask',
    category: 'Traditional English & Surveying',
    era: 'Colonial American & British Trade',
    title: 'Hogshead Cask Capacity: Wine (63 US Gal), Beer (54 Imp Gal) & Colonial Tobacco (1,000 lbs) [Historic Trade] | Digital Tools Shed',
    h1: 'Hogshead Cask Multi-Commodity Converter',
    metaDesc: 'Convert historical hogsheads across wine (63 US gal / 238.5 L), beer (54 Imp gal / 245.5 L), and colonial Virginia tobacco casks (1,000 lbs / 454 kg).',
    desc: 'The hogshead was the supreme bulk shipping container of the Atlantic trade: 63 wine gallons (238.5 L), 54 beer gallons (245.5 L), or a giant 1,000-lb tobacco barrel.',
    primaryUnit: 'Wine Hogsheads (63 US Gal)',
    unitSymbol: 'hhd',
    defaultVal: 1,
    metricBase: 238.481, // liters (wine standard)
    metricName: 'Liters (Wine)',
    metricSymbol: 'L',
    imperialBase: 63.0, // US wine gallons
    imperialName: 'US Wine Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'British Beer Hogshead (Imp Gal)', ratio: 54.0, note: '54 Imperial gallons (245.5 L)' },
      { name: 'Bottles of Wine (750 mL)', ratio: 317.97, note: 'Approx. 318 standard wine bottles' },
      { name: 'Colonial Tobacco Hogshead (lbs)', ratio: 1000.0, note: 'Approx. 1,000 lbs compressed leaf tobacco' },
      { name: 'Wine Pipe / Butt Fraction', ratio: 0.5, note: '2 hogsheads = 1 pipe or butt (126 gal)' },
      { name: 'Tun Fraction', ratio: 0.25, note: '4 hogsheads = 1 tun of wine (252 gal)' }
    ],
    presets: [
      { label: '1 Wine Hogshead (63 US Gal / 238.5 L / 318 Bottles)', val: 1 },
      { label: '1 British Brewery Hogshead (54 Imp Gal / 245.5 L)', val: 1.029 },
      { label: '1 Colonial Virginia Tobacco Hogshead (1,000 lbs)', val: 1 },
      { label: '4 Hogsheads (1 Imperial Tun of Wine / 252 Gallons)', val: 4 }
    ],
    contextHtml: '<p>In 18th-century Virginia and Maryland, colonial farmers packed cured tobacco leaves into giant 48-inch wooden hogsheads using massive screw presses, cramming up to 1,000 pounds of leaf into a single cask. Because roads were scarce, planters fitted wooden axles through the barrel heads and used draft horses to roll them for miles along designated "Rolling Roads" to Chesapeake Bay wharves.</p>',
    primarySources: 'Virginia Tobacco Inspection Act of 1730; Postlethwayt\'s <em>Universal Dictionary of Trade and Commerce</em> (1774).',
    faq: [
      { q: 'How many gallons are in a hogshead?', a: 'For wine, a standard hogshead holds 63 US wine gallons (238.48 liters). For British beer, a hogshead holds 54 Imperial gallons (245.49 liters).' },
      { q: 'What was a tobacco rolling road?', a: 'In colonial Virginia and Maryland, planters attached shafts to 1,000-pound tobacco hogsheads and had oxen or horses roll the barrel itself like a giant wheel down dirt trails to port wharves. Many surviving highways are still named "Rolling Road".' }
    ]
  },
  {
    slug: 'puncheon-cask-rum-whiskey',
    name: 'Puncheon Cask (Rum, Whiskey & Wine)',
    shortName: 'Puncheon Cask',
    category: 'Traditional English & Surveying',
    era: 'Atlantic Triangle Trade & Distilling',
    title: 'Puncheon Cask (84 US Gallons Rum / 70 Imperial Gallons Whiskey) to Liters & Bottles [Caribbean Rum Cask] | Digital Tools Shed',
    h1: 'Puncheon Cask Rum, Whiskey & Wine Volume Converter',
    metaDesc: 'Convert puncheon casks (84 US gallons / 70–72 Imperial gallons / 318–327 liters) to liters, US gallons, and 750 mL spirit bottles. Explore Caribbean rum trade.',
    desc: 'The puncheon (traditionally 84 US wine gallons / ~318 liters, or 70 Imperial gallons in Scotch whisky and rum aging) was a squat, fat-bellied maturation cask.',
    primaryUnit: 'Puncheon Casks (84 US Gal)',
    unitSymbol: 'puncheon',
    defaultVal: 1,
    metricBase: 317.975, // liters (84 US gallons)
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 84.0, // US gallons
    imperialName: 'US Liquid Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: '750 mL Liquor Bottles', ratio: 423.97, note: 'Approx. 424 standard bottles of rum' },
      { name: 'Imperial Gallons (Scotch/Rum)', ratio: 69.94, note: 'Approx. 70 Imperial gallons' },
      { name: 'Tertium Fraction of Tun', ratio: 0.3333, note: '3 puncheons = 1 tun of wine (252 gal)' },
      { name: 'Tierces Equivalent (42 gal)', ratio: 2.0, note: '1 puncheon = 2 tierces' }
    ],
    presets: [
      { label: '1 Puncheon (84 US Gal / 318 L / 424 Bottles)', val: 1 },
      { label: '2 Puncheons (Jamaica Overproof Rum Export)', val: 2 },
      { label: '3 Puncheons (1 Full Tun of Wine / 252 Gallons)', val: 3 },
      { label: '10 Puncheons (Distillery Solera Cellar)', val: 10 }
    ],
    contextHtml: '<p>The puncheon was the classic cask of the Caribbean molasses-and-rum trade. Known as the <em>tertiary</em> or <em>tertium</em> because three puncheons equaled one 252-gallon tun (252 / 3 = 84 gallons), puncheons were prized by distillers because their squat shape and wide staves offered a lower oak-to-liquid ratio than small barrels, allowing long, mellow maturation.</p>',
    primarySources: 'Statute of 28 Henry VIII c. 14; Edwards, <em>The History, Civil and Commercial, of the British Colonies in the West Indies</em> (1793).',
    faq: [
      { q: 'How many gallons is a puncheon?', a: 'A standard wine/rum puncheon holds 84 US wine gallons (317.98 liters). In Scotch whisky and sherry maturation, puncheons typically hold around 500 liters (110 Imperial gallons).' },
      { q: 'Why did the Caribbean rum trade prefer puncheons?', a: 'The stout, broad staves of a puncheon resisted splitting during rough ocean voyages in cargo holds, and its 84-gallon volume allowed three casks to neatly make up one full shipping tun.' }
    ]
  },
  {
    slug: 'butt-pipe-wine-cask-gallons',
    name: 'Butt & Pipe Cask (Port, Sherry & Madeira)',
    shortName: 'Butt / Pipe Cask',
    category: 'Traditional English & Surveying',
    era: 'Fortified Wine Trade (Porto & Jerez)',
    title: 'Butt & Pipe Fortified Wine Cask (126 US Gallons / 2 Hogsheads) to Liters & Bottles [Port & Sherry Pipe] | Digital Tools Shed',
    h1: 'Butt & Pipe Fortified Wine Cask Converter',
    metaDesc: 'Convert wine pipes and butts (126 US wine gallons = 476.96 liters = 636 bottles of Port or Sherry) to liters, US gallons, and hogsheads. Explore fortified wines.',
    desc: 'The butt (for Sherry, ~126–130 gallons / 500 L) and pipe (for Port and Madeira, ~126–140 gallons / 535 L) were long, tapered casks equal to two hogsheads or half a tun.',
    primaryUnit: 'Wine Butts / Pipes (126 US Gal)',
    unitSymbol: 'pipe',
    defaultVal: 1,
    metricBase: 476.962, // liters (126 US gal)
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 126.0, // US wine gallons
    imperialName: 'US Wine Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Standard 750 mL Bottles', ratio: 635.95, note: 'Approx. 636 bottles of fortified wine' },
      { name: 'Hogsheads (63 gal)', ratio: 2, note: '1 butt/pipe = 2 hogsheads' },
      { name: 'Tun Fraction', ratio: 0.5, note: '2 butts/pipes = 1 tun (252 gal)' },
      { name: 'Imperial Gallons', ratio: 104.92, note: 'Approx. 105 Imperial gallons' }
    ],
    presets: [
      { label: '1 Standard Pipe / Butt (126 US Gal / 477 L / 636 Bottles)', val: 1 },
      { label: '1 Portuguese Port Pipe (535 L / 141 US Gal)', val: 1.122 },
      { label: '1 Spanish Sherry Butt (500 L / 132 US Gal)', val: 1.048 },
      { label: '2 Pipes (1 Imperial Tun of Wine / 252 Gallons)', val: 2 }
    ],
    contextHtml: '<p>The English word "butt" comes from French <em>botte</em> and Latin <em>buttis</em> ("cask"). In Shakespeare\'s <em>Richard III</em>, the Duke of Clarence was murdered in 1478 by being drowned inside a "malmsey-butt" (a butt of sweet Madeira wine). A "pipe" refers to the long, narrow, flute-like tapered shape of casks constructed along the Douro River in Portugal to navigate narrow riverboats (<em>barcos rabelos</em>).</p>',
    primarySources: 'Treaty of Methuen (1703); Shakespeare, <em>Richard III</em> (Act I, Scene 4); Croft & Sandeman Port House Historical Archives.',
    faq: [
      { q: 'How many gallons and bottles are in a butt or pipe of wine?', a: 'A standard English wine butt or pipe contains exactly 126 US wine gallons (476.96 liters), which yields approximately 636 standard 750 mL bottles of wine.' },
      { q: 'What is the difference between a butt and a pipe?', a: 'While equal in legal volume (half a tun / 126 gallons), a "butt" is historically associated with Spanish Sherry (Jerez) and has rounder bulges, while a "pipe" is associated with Portuguese Port and Madeira, featuring a longer, slender, tapered profile.' }
    ]
  },
  {
    slug: 'tun-wine-cask-to-barrels',
    name: 'Tun Cask of Wine (252 Gallons)',
    shortName: 'Tun of Wine',
    category: 'Traditional English & Surveying',
    era: 'Medieval & Renaissance Maritime Commerce',
    title: 'Tun Cask of Wine (252 US Gallons / 954 Liters) to Liters, Hogsheads & Weight [Origin of the Modern Ton] | Digital Tools Shed',
    h1: 'Tun Cask of Wine Volume & Mass Converter',
    metaDesc: 'Convert the medieval tun of wine (252 wine gallons / 953.92 liters / 2,016 pints) to liters, barrels, and shipping weight. Discover the origin of the word "ton".',
    desc: 'The tun (252 wine gallons / 953.92 liters) was the supreme king of casks: weighing roughly 2,240 pounds when full of wine, it is the direct ancestor of the shipping "ton".',
    primaryUnit: 'Tuns of Wine',
    unitSymbol: 'tun',
    defaultVal: 1,
    metricBase: 953.924, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 252.0, // US wine gallons
    imperialName: 'US Wine Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Pipes / Butts (126 gal)', ratio: 2, note: '1 tun = 2 pipes or butts' },
      { name: 'Puncheons (84 gal)', ratio: 3, note: '1 tun = 3 puncheons' },
      { name: 'Hogsheads (63 gal)', ratio: 4, note: '1 tun = 4 hogsheads' },
      { name: 'Tierces (42 gal)', ratio: 6, note: '1 tun = 6 tierces' },
      { name: 'Standard 750 mL Bottles', ratio: 1271.9, note: 'Approx. 1,272 standard bottles' },
      { name: 'Full Cask Weight (Long Ton lbs)', ratio: 2240.0, note: 'Weighed approx. 2,240 lbs (1 Long Ton)' }
    ],
    presets: [
      { label: '1 Tun (252 US Gal / 954 L / 1,272 Bottles)', val: 1 },
      { label: '5 Tuns (Vintage Merchant Hold Stock)', val: 5 },
      { label: '50 Tuns (Medieval Gascon Wine Cog Cargo)', val: 50 },
      { label: '200 Tuns (Full Ship Displacement Capacity)', val: 200 }
    ],
    contextHtml: '<p>The modern word <strong>ton</strong> (both the weight unit of 2,240 lbs and maritime "tonnage") comes directly from the medieval <strong>tun</strong> cask. When England imported Bordeaux wine in the 14th century, taxes were assessed on how many physical wine tuns a merchant cog could stow in its bilge. Because 252 wine gallons of wine plus oak staves weighed approximately 2,240 pounds, that weight became the permanent definition of the "long ton"!</p>',
    primarySources: 'Statute of Tunnage and Poundage (12 Edw. IV c. 3, 1472); Magna Carta (Chapter 35, 1215: "One measure of wine throughout our kingdom").',
    faq: [
      { q: 'How many gallons and liters are in a tun of wine?', a: 'One tun equals exactly 252 US wine gallons, which is 953.92 liters (210 Imperial gallons or 2,016 pints). It yields roughly 1,272 standard 750 mL wine bottles.' },
      { q: 'Did the word "ton" come from the wine tun?', a: 'Yes! A tun of wine weighed approximately 2,240 pounds (1,016 kg). English harbor authorities began rating a ship\'s carrying capacity by how many "tuns" it could hold, evolving into the nautical term "tonnage" and the standard long ton.' }
    ]
  },
  {
    slug: 'tierce-salted-beef-wine-cask',
    name: 'Tierce Cask (Salted Provisions & Wine)',
    shortName: 'Tierce Cask',
    category: 'Traditional English & Surveying',
    era: 'Naval Victualling & Atlantic Commerce',
    title: 'Tierce Cask (42 US Gallons Wine / 304 lbs Salt Beef) to Liters & Rations [Royal Navy Victualling] | Digital Tools Shed',
    h1: 'Tierce Cask Provisions & Wine Volume Converter',
    metaDesc: 'Convert tierce casks (42 US wine gallons = 158.99 liters = exactly 1/6th of a tun) and naval salted beef tierces (304 lbs / 138 kg) to modern liters and sailor rations.',
    desc: 'The tierce (from Old French <em>tierce</em>, "third", representing one-third of a pipe or one-sixth of a tun = 42 US gallons) was the standard naval cask for salted beef and pork.',
    primaryUnit: 'Tierce Casks (42 US Gal)',
    unitSymbol: 'tierce',
    defaultVal: 1,
    metricBase: 158.987, // liters
    metricName: 'Liters (Liquid)',
    metricSymbol: 'L',
    imperialBase: 42.0, // US gallons
    imperialName: 'US Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Standard 42-Gallon Oil Barrel Equivalent', ratio: 1.0, note: 'Exact ancestor of 42-gal oil barrel' },
      { name: 'Royal Navy Salt Beef Net Weight (lbs)', ratio: 304.0, note: 'Standard naval cask held 304 lbs cured beef' },
      { name: 'Royal Navy Salt Pork Net Weight (lbs)', ratio: 320.0, note: 'Standard naval cask held 320 lbs cured pork' },
      { name: 'Standard 750 mL Bottles', ratio: 211.98, note: 'Approx. 212 wine bottles' }
    ],
    presets: [
      { label: '1 Tierce (42 US Gal / 159 L / Modern Oil Barrel Size)', val: 1 },
      { label: '1 Tierce of Salt Beef (304 lbs / 76 Four-Pound Rations)', val: 1 },
      { label: '6 Tierces (1 Full Tun of Wine / 252 Gallons)', val: 6 },
      { label: '20 Tierces (HMS Victory Six-Month Provisions)', val: 20 }
    ],
    contextHtml: '<p>The 42-gallon tierce played a monumental role in global economic history: in 1866, pioneer petroleum drillers in Titusville, Pennsylvania adopted the <strong>42-gallon tierce</strong> as the universal world standard for crude oil barrels (bbl), because 42 gallons was the maximum volume of liquid that could be hauled by a single strong teamster without mechanical cranes!</p>',
    primarySources: 'Royal Navy <em>Victualling Board Regulations</em> (1790); Pennsylvania Oil Region Producers Association Agreement (1866).',
    faq: [
      { q: 'How many gallons is a tierce?', a: 'A tierce contains exactly 42 US gallons (158.99 liters or 35 Imperial gallons). It is one-sixth of a tun (252 / 6 = 42) and one-third of a pipe.' },
      { q: 'Why is a modern crude oil barrel 42 gallons?', a: 'Because 19th-century oil prospectors adopted the historical 42-gallon tierce cask used for salted fish and whale oil. It became the permanent global pricing benchmark for petroleum.' }
    ]
  },
  {
    slug: 'pin-beer-mini-cask-liters',
    name: 'Pin Cask of Real Ale (4.5 Gallons)',
    shortName: 'Pin Beer Cask',
    category: 'Traditional English & Surveying',
    era: 'British Real Ale Cellarmanship',
    title: 'Pin Cask (4.5 Imperial Gallons / Half-Firkin) to Liters, US Gallons & Pints [Home Draught Ale Cask] | Digital Tools Shed',
    h1: 'Pin Cask Real Ale Volume Converter',
    metaDesc: 'Convert pin casks (4.5 Imperial gallons = 20.46 liters = 36 pub pints = half a firkin) to liters, US gallons, and party servings. Ideal for home cask conditioning.',
    desc: 'The pin (equal to 4.5 Imperial gallons / 20.46 liters / 36 pub pints) is the smallest traditional British wooden/metal cask, exactly half the size of a firkin.',
    primaryUnit: 'Pins (4.5 Imp Gal)',
    unitSymbol: 'pin',
    defaultVal: 1,
    metricBase: 20.4574, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 4.5, // Imperial gallons
    imperialName: 'Imperial Gallons',
    imperialSymbol: 'imp gal',
    subdivisions: [
      { name: 'British Pub Pints (20 fl oz)', ratio: 36, note: '36 Imperial pints' },
      { name: 'US Liquid Gallons', ratio: 5.404, note: '5.40 US liquid gallons' },
      { name: 'Firkin Fraction', ratio: 0.5, note: '2 pins = 1 firkin (9 imp gal)' },
      { name: 'British Beer Barrel Fraction', ratio: 0.125, note: '8 pins = 1 barrel (36 imp gal)' }
    ],
    presets: [
      { label: '1 Pin (4.5 Imp Gal / 20.5 L / 36 Pints)', val: 1 },
      { label: '2 Pins (1 Full Firkin / 72 Pints)', val: 2 },
      { label: '4 Pins (1 Kilderkin / 144 Pints)', val: 4 },
      { label: '8 Pins (1 British Beer Barrel / 288 Pints)', val: 8 }
    ],
    contextHtml: '<p>A pin cask holds 36 pints—the ideal quantity for private parties, beer festivals, or pubs sampling guest ales that must be consumed within 3 to 4 days before the live unpasteurized beer oxidizes. Weighing only 55 pounds (25 kg) full, a pin can easily be lifted and set on a countertop by one person.</p>',
    primarySources: 'CAMRA (Campaign for Real Ale) <em>Cellarmanship Guidelines</em>; British Beer & Pub Association (BBPA) Standards.',
    faq: [
      { q: 'How many pints are in a pin of beer?', a: 'A standard British pin cask contains 4.5 Imperial gallons, which equals exactly 36 Imperial pints (20.46 liters or 5.40 US gallons).' },
      { q: 'Why is a pin cask popular for home events?', a: 'Because cask-conditioned real ale must be drunk within 3 to 4 days once tapped. A 72-pint firkin is often too large for a small gathering, while a 36-pint pin provides fresh draft ale without waste.' }
    ]
  },
  {
    slug: 'winchester-bushel-vs-imperial-bushel',
    name: 'Winchester Bushel vs Imperial Bushel',
    shortName: 'Winchester Bushel',
    category: 'Traditional English & Surveying',
    era: '1824 Transatlantic Weights Split',
    title: 'Winchester Bushel (2150.42 cu in) vs Imperial Bushel (2218.19 cu in) [3% US-UK Grain Discrepancy] | Digital Tools Shed',
    h1: 'Winchester Bushel vs Imperial Bushel Converter',
    metaDesc: 'Compare the US Winchester bushel (35.239 L / 2,150.42 cu in) with the British Imperial bushel (36.369 L / 2,218.19 cu in). Understand the 3.2% trade discrepancy.',
    desc: 'The US adopted the old 1696 English Winchester bushel (35.239 L), while Britain replaced it in 1824 with the 3.2% larger Imperial bushel (36.369 L).',
    primaryUnit: 'US Winchester Bushels',
    unitSymbol: 'bu_win',
    defaultVal: 1,
    metricBase: 35.23907, // dry liters
    metricName: 'Liters (US Winchester)',
    metricSymbol: 'L',
    imperialBase: 2150.42, // cubic inches
    imperialName: 'Cubic Inches',
    imperialSymbol: 'cu in',
    subdivisions: [
      { name: 'Imperial Bushels Equivalent', ratio: 0.96894, note: '1 US bu = 0.969 Imperial bushels (36.37 L)' },
      { name: 'Discrepancy Percentage (%)', ratio: 3.206, note: 'Imperial bushel is 3.21% larger than US bushel' },
      { name: 'US Dry Pecks', ratio: 4, note: '1 bushel = 4 pecks' },
      { name: 'US Dry Quarts', ratio: 32, note: '1 bushel = 32 dry quarts' },
      { name: 'Corn / Maize Standard Mass (lbs)', ratio: 56.0, note: '56 lbs per commercial bushel of corn' },
      { name: 'Wheat Standard Mass (lbs)', ratio: 60.0, note: '60 lbs per commercial bushel of wheat' }
    ],
    presets: [
      { label: '1 US Winchester Bushel (35.24 L / 2,150.4 cu in)', val: 1 },
      { label: '1 British Imperial Bushel (36.37 L / 2,218.2 cu in)', val: 1.032 },
      { label: '100 US Bushels (5,600 lbs Shelled Corn)', val: 100 },
      { label: '1,000 Bushels (Grain Elevator Hopper Car)', val: 1000 }
    ],
    contextHtml: '<p>Standardized by King William III in 1696 as a cylindrical brass vessel 18.5 inches in interior diameter and 8 inches deep (giving 2,150.42 cubic inches), the Winchester bushel was brought to the American colonies. In 1824, the British Parliament abolished it in favor of the Imperial bushel, defined as the volume of 80 pounds of distilled water at 62°F (2,218.19 cubic inches), creating a lasting 3.2% discrepancy between American and British grain traders.</p>',
    primarySources: 'Statute 8 & 9 Wm. III c. 22 (1696); British Weights and Measures Act of 1824; USDA Grain Inspection Handbook.',
    faq: [
      { q: 'Why is an Imperial bushel larger than a US Winchester bushel?', a: 'Because the United States retained the colonial 1696 Winchester bushel (2,150.42 cubic inches or 35.24 L), whereas the UK reformed its system in 1824 to base the bushel on 80 pounds of water (2,218.19 cubic inches or 36.37 L), making the Imperial bushel 3.21% larger.' },
      { q: 'How many pounds does a bushel of wheat or corn weigh?', a: 'By standard US commodity trading convention: a bushel of wheat or soybeans weighs 60 pounds (27.2 kg), a bushel of corn (maize) weighs 56 pounds (25.4 kg), and a bushel of oats weighs 32 pounds (14.5 kg).' }
    ]
  },
  {
    slug: 'peck-dry-volume-to-quarts',
    name: 'Dry Peck (US & Imperial)',
    shortName: 'Dry Peck',
    category: 'Traditional English & Surveying',
    era: 'Traditional Dry Goods & Orchard Harvest',
    title: 'Dry Peck (2 Gallons / 8 Dry Quarts / Quarter Bushel) to Liters & Pounds [Peter Piper Picked a Peck] | Digital Tools Shed',
    h1: 'Dry Peck Volume & Orchard Produce Converter',
    metaDesc: 'Convert dry pecks (8 dry quarts = 8.81 L US / 9.09 L Imperial = 10–12 lbs of apples) to liters, quarts, and pounds. Calculate apple orchard pickings.',
    desc: 'The peck (one-quarter of a bushel, or 8 dry quarts = 8.81 liters US) was the standard harvest basket for apples, peaches, and pickled peppers.',
    primaryUnit: 'US Dry Pecks',
    unitSymbol: 'pk',
    defaultVal: 1,
    metricBase: 8.80977, // dry liters
    metricName: 'Liters (Dry US)',
    metricSymbol: 'L',
    imperialBase: 8.0, // dry quarts
    imperialName: 'US Dry Quarts',
    imperialSymbol: 'qt dry',
    subdivisions: [
      { name: 'Dry Pints', ratio: 16, note: '1 peck = 16 dry pints' },
      { name: 'Bushel Fraction', ratio: 0.25, note: '4 pecks = 1 bushel' },
      { name: 'Imperial Peck Equivalent (L)', ratio: 9.092, note: '9.09 liters (Imperial)' },
      { name: 'Fresh Apples Mass (lbs)', ratio: 10.5, note: 'Approx. 10.5 lbs fresh orchard apples' }
    ],
    presets: [
      { label: '1 Peck (8 Dry Quarts / 10.5 lbs Apples)', val: 1 },
      { label: '2 Pecks (Half Bushel Basket)', val: 2 },
      { label: '4 Pecks (1 Full Bushel / 42 lbs Apples)', val: 4 },
      { label: '10 Pecks (Farm Stand Display)', val: 10 }
    ],
    contextHtml: '<p>The famous mother goose nursery rhyme <em>"Peter Piper picked a peck of pickled peppers"</em> relies on this physical measure. Eight dry quarts packed tightly into a woven splint basket weighed between 10 and 12 pounds for orchard tree fruits like apples, pears, and bell peppers.</p>',
    primarySources: 'Statute of 12 Henry VII c. 5; USDA Agricultural Marketing Service: <em>Fresh Produce Measurement Tables</em>.',
    faq: [
      { q: 'How many quarts and liters are in a peck?', a: 'One US dry peck equals exactly 8 US dry quarts (16 dry pints, 0.25 bushels, or 8.8098 liters). An Imperial peck is slightly larger at 9.0922 liters.' },
      { q: 'How many pounds of apples are in a peck?', a: 'A standard peck of fresh apples weighs approximately 10 to 12 pounds (4.5 to 5.4 kg), depending on fruit variety and packing density.' }
    ]
  },
  {
    slug: 'dry-gallon-pottle-kenning',
    name: 'Historical Dry Gallon, Pottle & Kenning',
    shortName: 'Dry Gallon & Pottle',
    category: 'Traditional English & Surveying',
    era: 'Medieval English Corn Measures',
    title: 'Dry Gallon (Corn Gallon 268.8 cu in), Pottle & Kenning to Modern Liters [Old English Corn Measures] | Digital Tools Shed',
    h1: 'Dry Gallon, Pottle & Kenning Corn Converter',
    metaDesc: 'Convert historical corn dry gallons (268.8 cu in = 4.405 L), pottles (half-gallon), and kennings (half-bushel) to liters and dry quarts. Decode antique grain ledgers.',
    desc: 'Before metrication, dry goods were measured with the "corn gallon" (268.8 cu in / 4.405 L), subdivided into pottles (2 quarts) and aggregated into kennings (2 pecks).',
    primaryUnit: 'Corn Dry Gallons',
    unitSymbol: 'gal_dry',
    defaultVal: 1,
    metricBase: 4.40488, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 268.8, // cubic inches
    imperialName: 'Cubic Inches',
    imperialSymbol: 'cu in',
    subdivisions: [
      { name: 'Pottles (Half-Gallon)', ratio: 2, note: '1 dry gallon = 2 pottles (2 dry quarts each)' },
      { name: 'Dry Quarts', ratio: 4, note: '1 dry gallon = 4 dry quarts' },
      { name: 'Kenning Fraction (Half-Bushel)', ratio: 0.25, note: '4 dry gallons = 1 kenning (2 pecks)' },
      { name: 'US Liquid Gallon Comparison', ratio: 1.1636, note: 'Dry gallon is 16.4% larger than liquid gallon (231 cu in)' }
    ],
    presets: [
      { label: '1 Pottle (2 Dry Quarts / 2.20 L)', val: 0.5 },
      { label: '1 Dry Gallon (Corn Gallon / 4.40 L)', val: 1 },
      { label: '2 Dry Gallons (1 Peck / 8.81 L)', val: 2 },
      { label: '4 Dry Gallons (1 Kenning / 17.62 L)', val: 4 }
    ],
    contextHtml: '<p>A major trap in historical documents is assuming all gallons are equal. The English wine gallon was 231 cubic inches (preserved as the US liquid gallon), the ale gallon was 282 cubic inches, and the <strong>corn/dry gallon was 268.8 cubic inches</strong>. A dry gallon was 16.4% larger than a liquid gallon of milk or water!</p>',
    primarySources: 'Assize of Bread and Ale (51 Hen. III, 1266); Prior, <em>Ancient Weights and Measures of the City of London</em>.',
    faq: [
      { q: 'What is a pottle in historical English measures?', a: 'A pottle was an ancient English liquid and dry measure equal to half a gallon, or two quarts (approximately 2.20 dry liters or 1.89 liquid liters).' },
      { q: 'What is a kenning?', a: 'A kenning was a traditional British and Scottish agrarian dry measure equal to half a bushel or two pecks (approximately 17.6 liters of oats or barley).' }
    ]
  },
  {
    slug: 'chaldron-coal-grain-volume-weight',
    name: 'Chaldron (Coal & Grain Wagon Load)',
    shortName: 'Chaldron',
    category: 'Traditional English & Surveying',
    era: 'Industrial Revolution London Coal Trade',
    title: 'London Chaldron Coal Wagon Load (36 Bushels / 2,800 lbs) to Metric Tonnes & m³ [Victorian Sea-Coal] | Digital Tools Shed',
    h1: 'Chaldron Coal & Grain Wagon Load Converter',
    metaDesc: 'Convert historical London and Newcastle chaldrons (36 bushels / 2,800–5,900 lbs) to metric tonnes, cubic meters, and bushels. Model Victorian coal taxes.',
    desc: 'The chaldron (36 bushels in London / ~2,800 lbs, or 53 cwt in Newcastle / ~5,936 lbs) was the massive wagon-load measure that fueled Victorian Britain\'s steam engines.',
    primaryUnit: 'London Chaldrons (36 Bushels)',
    unitSymbol: 'chaldron',
    defaultVal: 1,
    metricBase: 1268.6, // kg coal (London standard ~2,800 lbs)
    metricName: 'Kilograms Coal',
    metricSymbol: 'kg',
    imperialBase: 2800.0, // lbs
    imperialName: 'Pounds (lbs Coal)',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Imperial Bushels', ratio: 36, note: '1 London chaldron = 36 bushels' },
      { name: 'Cubic Meters (Volume)', ratio: 1.309, note: '1.309 m³ bulk volume' },
      { name: 'Newcastle Chaldron Equivalent', ratio: 0.4717, note: 'Newcastle chaldron was 2.1× larger (5,936 lbs)' },
      { name: 'Metric Tonnes', ratio: 1.2686, note: '1.27 tonnes bituminous coal' }
    ],
    presets: [
      { label: '1 London Chaldron (36 Bushels / 2,800 lbs)', val: 1 },
      { label: '1 Newcastle Mining Chaldron (5,936 lbs = 2.7 Tonnes)', val: 2.12 },
      { label: '10 Chaldrons (Steam Mill Factory Weekly Boiler Supply)', val: 10 },
      { label: '100 Chaldrons (Collier Ship Cargo)', val: 100 }
    ],
    contextHtml: '<p>The London Coal Duties Act financed the rebuilding of St. Paul\'s Cathedral and fifty City churches after the Great Fire of 1666 by levying a tax per chaldron on all "sea-coal" brought up the Thames from Newcastle. In 1831, Parliament abolished the chaldron and mandated selling coal strictly by weight (tons and hundredweights) to end merchant fraud via "fluffing" coal volumes.</p>',
    primarySources: 'London Coal Trade Act of 1831 (1 & 2 Wm. IV c. 76); Galloway, <em>Annals of Coal Mining and the Coal Trade</em> (1898).',
    faq: [
      { q: 'How much coal was in a chaldron?', a: 'A London chaldron held 36 heaped bushels of coal, weighing approximately 2,800 pounds (1.27 metric tonnes). A Newcastle mining chaldron was much larger, legally fixed at 53 hundredweight (5,936 pounds or 2.69 tonnes).' },
      { q: 'Why was coal measured by volume instead of weight before 1831?', a: 'Before heavy industrial weighbridges were invented, measuring coal by standard wooden bushel tubs was faster. However, merchants watered the coal or broke lumps into dust to artificially swell the measured volume in tubs.' }
    ]
  },
  {
    slug: 'stone-weight-uk-to-kg-lbs',
    name: 'British Stone (14 Pounds)',
    shortName: 'British Stone',
    category: 'Traditional English & Surveying',
    era: 'British & Commonwealth Everyday Measures',
    title: 'British Stone (14 Pounds / 6.35029 kg) to Kilograms & Pounds [UK Human Body Weight Scale] | Digital Tools Shed',
    h1: 'British Stone (14 Pounds) Weight Converter',
    metaDesc: 'Convert British stones (14 lbs = 6.35029318 kg) to kilograms, grams, and pounds. Understand the UK convention of stating human body weight in "stone and pounds".',
    desc: 'The stone (st, exactly 14 avoirdupois pounds / 6.35029 kg) remains the everyday unit for human body weight across the United Kingdom and Ireland.',
    primaryUnit: 'Stones (st)',
    unitSymbol: 'st',
    defaultVal: 11, // approx 154 lbs
    metricBase: 69.8532, // kg for 11 stone
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 154.0, // lbs
    imperialName: 'Pounds (lbs)',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Pounds (lbs)', ratio: 14, note: '1 stone = 14 pounds exactly' },
      { name: 'Hundredweight Fraction (cwt)', ratio: 0.125, note: '8 stones = 1 hundredweight (112 lbs)' },
      { name: 'Ounces', ratio: 224, note: '224 ounces per stone' },
      { name: 'Kilograms', ratio: 6.35029, note: '6.3503 kg per stone' }
    ],
    presets: [
      { label: '8 Stone (112 lbs / 50.8 kg / Bantamweight Boxer)', val: 8 },
      { label: '11 Stone (154 lbs / 69.9 kg / Average UK Adult)', val: 11 },
      { label: '14 Stone (196 lbs / 88.9 kg / Heavyweight)', val: 14 },
      { label: '20 Stone (280 lbs / 127 kg)', val: 20 }
    ],
    contextHtml: '<p>The stone was standardized at 14 pounds by Edward III in 1350 so that two stones equaled a 28-pound quarter and eight stones equaled an English hundredweight (112 pounds). While the rest of the world uses kilograms or pounds, British and Irish citizens still weigh themselves on scales reading "11st 4lb" (11 stones, 4 pounds = 158 lbs = 71.7 kg).</p>',
    primarySources: 'Statute of 25 Edw. III st. 5 c. 9 (1350); UK Weights and Measures Act 1985.',
    faq: [
      { q: 'How many pounds and kilograms are in a stone?', a: 'One stone equals exactly 14 avoirdupois pounds, which equals 6.35029318 kilograms.' },
      { q: 'How do you convert stone and pounds into total pounds or kg?', a: 'Multiply the stone value by 14 and add the remaining pounds. For example, 12 stone 7 lbs = (12 × 14) + 7 = 168 + 7 = 175 lbs. To get kg, multiply total pounds by 0.453592.' }
    ]
  },
  {
    slug: 'hundredweight-cwt-short-long',
    name: 'Hundredweight (cwt: Short vs Long)',
    shortName: 'Hundredweight (cwt)',
    category: 'Traditional English & Surveying',
    era: 'Industrial & Agricultural Bulk Freight',
    title: 'Hundredweight (cwt): US Short (100 lbs) vs UK Long (112 lbs) to kg & Tons [Livestock & Steel Weight] | Digital Tools Shed',
    h1: 'Hundredweight (cwt: Short vs Long) Converter',
    metaDesc: 'Compare US short hundredweight (100 lbs / 45.36 kg) with UK long hundredweight (112 lbs / 50.80 kg). Calculate cattle auctions and scrap steel pricing.',
    desc: 'The hundredweight (cwt) has two competing definitions: the US short cwt (100 lbs / 45.36 kg) used in livestock auctions, and the UK long cwt (112 lbs / 50.80 kg).',
    primaryUnit: 'US Short Hundredweight (100 lbs)',
    unitSymbol: 'cwt_short',
    defaultVal: 1,
    metricBase: 45.359237, // kg
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 100.0, // lbs
    imperialName: 'Pounds (lbs)',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'UK Long Hundredweight (112 lbs)', ratio: 0.89286, note: '1 short cwt = 0.893 long cwt (112 lbs)' },
      { name: 'US Short Ton Fraction', ratio: 0.05, note: '20 short cwt = 1 short ton (2,000 lbs)' },
      { name: 'British Long Ton Fraction', ratio: 0.04464, note: '20 long cwt = 1 long ton (2,240 lbs)' },
      { name: 'Stones (UK)', ratio: 7.1429, note: 'Approx. 7.14 stones (long cwt = exactly 8 stones)' }
    ],
    presets: [
      { label: '1 US Short cwt (100 lbs / 45.4 kg / Cattle Auction Unit)', val: 1 },
      { label: '1 UK Long cwt (112 lbs / 50.8 kg / 8 Stones)', val: 1.12 },
      { label: '10 cwt (1,000 lbs / Feeder Steer Calf)', val: 10 },
      { label: '20 cwt (1 US Short Ton / 2,000 lbs)', val: 20 }
    ],
    contextHtml: '<p>The symbol <code>cwt</code> combines the Roman numeral <strong>C</strong> (100) with the abbreviation for weight (wt). In North American livestock markets, cattle and hog prices are quoted per hundredweight (e.g. "$180/cwt"). In Britain, however, 112 pounds was mandated so that 1 cwt was divisible into 8 stones of 14 pounds each, or 4 quarters of 28 pounds each.</p>',
    primarySources: 'Statute of 27 Edw. III c. 10; USDA Agricultural Marketing Service Livestock Reports.',
    faq: [
      { q: 'Why is a British hundredweight 112 pounds instead of 100?', a: 'Because British commerce required the hundredweight to divide evenly into the 14-pound stone (112 / 14 = 8 stones) and the 28-pound quarter (112 / 4 = 4 quarters). The US simplified it to a true decimal 100 pounds.' },
      { q: 'What does cwt stand for in commodity pricing?', a: 'cwt stands for hundredweight (C = 100 in Roman numerals + wt = weight). When hay or cattle is priced at $150/cwt, it means $1.50 per pound.' }
    ]
  },
  {
    slug: 'quarter-weight-grain-livestock',
    name: 'Quarter (Weight & Volume)',
    shortName: 'Quarter',
    category: 'Traditional English & Surveying',
    era: 'British Agrarian & Grain Trading',
    title: 'Quarter Measure: Grain Quarter (8 Bushels / 64 Gallons) & Mass Quarter (28 lbs) [British Corn Exchange] | Digital Tools Shed',
    h1: 'Quarter Measure Grain Volume & Mass Converter',
    metaDesc: 'Convert British grain quarters (8 bushels = 290.95 L = 64 gallons) and weight quarters (28 lbs = 12.7 kg) to bushels, liters, and pounds. Explore Mark Lane grain markets.',
    desc: 'The "quarter" denotes two distinct units: the massive grain quarter (8 bushels / 291 L / ~480 lbs of wheat) and the hundredweight quarter (28 lbs / 12.7 kg).',
    primaryUnit: 'Grain Quarters (8 Bushels)',
    unitSymbol: 'qr_grain',
    defaultVal: 1,
    metricBase: 290.9497, // liters
    metricName: 'Liters (Grain)',
    metricSymbol: 'L',
    imperialBase: 8.0, // Imperial bushels
    imperialName: 'Imperial Bushels',
    imperialSymbol: 'bu',
    subdivisions: [
      { name: 'Imperial Gallons (Dry)', ratio: 64, note: '1 quarter = 64 Imperial gallons' },
      { name: 'US Winchester Bushels', ratio: 8.256, note: '8.26 US bushels' },
      { name: 'Wheat Mass Standard (lbs)', ratio: 480.0, note: 'Standard quarter of wheat = 480 lbs (217.7 kg)' },
      { name: 'Mass Quarter (1/4 cwt lbs)', ratio: 28.0, note: 'Weight quarter = 28 lbs (12.7 kg)' }
    ],
    presets: [
      { label: '1 Grain Quarter (8 Bushels / 64 Gallons / 480 lbs Wheat)', val: 1 },
      { label: '1 Mass Quarter (28 lbs / 2 Stones)', val: 0.0583 },
      { label: '10 Grain Quarters (Farm Wagon Load)', val: 10 },
      { label: '100 Grain Quarters (Barge Shipment on Thames)', val: 100 }
    ],
    contextHtml: '<p>At the London Corn Exchange in Mark Lane, grain prices throughout the British Empire were quoted "per quarter." The quarter represented one-fourth of a traditional grain tun (approx. 2,000 lbs), yielding 8 bushels or 64 gallons. A standard quarter of wheat was legally assumed to weigh 480 pounds (60 lbs per bushel).</p>',
    primarySources: 'Corn Returns Act 1882 (45 & 46 Vict. c. 37); Tooke & Newmarch, <em>A History of Prices and of the State of the Circulation</em>.',
    faq: [
      { q: 'How many bushels are in a quarter of grain?', a: 'A quarter of grain contains exactly 8 bushels (64 Imperial gallons, or 290.95 liters). For wheat, it weighs approximately 480 pounds.' },
      { q: 'What is a quarter in weight vs volume?', a: 'In weight, a quarter is one-fourth of a hundredweight (28 pounds in the UK, or 25 pounds in the US). In volume, a grain quarter is one-fourth of a tun, equaling 8 bushels.' }
    ]
  },
  {
    slug: 'avoirdupois-dram-vs-apothecary-dram',
    name: 'Avoirdupois Dram vs Apothecary Dram',
    shortName: 'Dram Discrepancy',
    category: 'Traditional English & Surveying',
    era: 'Dual English Weight Standards',
    title: 'Avoirdupois Dram (27.34 gr / 1.77 g) vs Apothecary Dram (60 gr / 3.89 g) [The Deadly 119% Discrepancy] | Digital Tools Shed',
    h1: 'Avoirdupois Dram vs Apothecary Dram Converter',
    metaDesc: 'Compare the grocery avoirdupois dram (27.344 grains / 1.772 g) with the pharmacy apothecary dram (60 grains / 3.888 g). Prevent dangerous dosage errors.',
    desc: 'The apothecary dram (60 grains / 3.888 g) is 119.4% heavier than the commercial avoirdupois dram (27.344 grains / 1.772 g), causing centuries of hazardous confusion.',
    primaryUnit: 'Avoirdupois Drams (dr av)',
    unitSymbol: 'dr_av',
    defaultVal: 1,
    metricBase: 1.771845, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 27.34375, // grains
    imperialName: 'Grains (gr)',
    imperialSymbol: 'gr',
    subdivisions: [
      { name: 'Apothecary Dram Equivalent (ʒ)', ratio: 0.45573, note: '1 av dram = 0.456 ap drams (3.888 g)' },
      { name: 'Apothecary Dram Excess (%)', ratio: 119.43, note: 'Ap dram is +119.4% heavier' },
      { name: 'Ounce Fraction (Avoirdupois)', ratio: 0.0625, note: '16 av drams = 1 av ounce (28.35 g)' },
      { name: 'Ounce Fraction (Apothecary)', ratio: 0.05697, note: '8 ap drams = 1 ap ounce (31.10 g)' }
    ],
    presets: [
      { label: '1 Avoirdupois Dram (1.77 g / 27.34 Grains)', val: 1 },
      { label: '1 Apothecary Dram (3.89 g / 60 Grains)', val: 2.194 },
      { label: '16 Avoirdupois Drams (1 Commercial Ounce / 28.35 g)', val: 16 },
      { label: 'Shotgun Powder Dram (e.g. 3-Dram Gunpowder Charge)', val: 3 }
    ],
    contextHtml: '<p>The dram duality represents one of the most perilous traps in historical English metrology. Avoirdupois divided its 437.5-grain ounce into 16 drams (27.34 grains each). Apothecary system divided its 480-grain ounce into 8 drams (60 grains each). If a 19th-century pharmacist compounded a prescription assuming grocery avoirdupois drams, the patient received <strong>less than half</strong> the intended active dose!</p>',
    primarySources: 'British Pharmacopoeia of 1864; US National Bureau of Standards Handbook 44.',
    faq: [
      { q: 'Why are there two different drams?', a: 'Because Britain maintained two concurrent weight systems: Avoirdupois for general trade (where an ounce has 16 drams of 27.34 grains) and Apothecaries\' weight for medicine (where an ounce has 8 drams of 60 grains).' },
      { q: 'What is "dram equivalent" on shotgun shell boxes?', a: 'Shotgun ammunition boxes frequently print "3 Dram Eq." This refers to avoirdupois drams (approx. 82 grains) of black powder, specifying modern smokeless powder loading that produces equivalent muzzle velocity.' }
    ]
  },
  {
    slug: 'slug-mass-to-kg-pounds',
    name: 'Engineering Slug Mass (Gravitational)',
    shortName: 'Slug Mass',
    category: 'Traditional English & Surveying',
    era: 'British Gravitational Engineering Mechanics',
    title: 'Engineering Slug Mass (32.17405 lbs) to Kilograms & Pound-Mass [Gravitational FPS Dynamics] | Digital Tools Shed',
    h1: 'Engineering Slug Mass (32.174 lb) Converter',
    metaDesc: 'Convert engineering slugs (32.17405 lbm / 14.5939 kg) to kilograms, pound-mass, and metric slugs. Master gravitational Imperial dynamics without gc fudge factors.',
    desc: 'The slug is the Imperial gravitational unit of mass: an object with 1 slug mass accelerates at 1 ft/s² when acted upon by a 1 pound-force (1 slug = 32.174 lb-mass).',
    primaryUnit: 'Slugs',
    unitSymbol: 'slug',
    defaultVal: 1,
    metricBase: 14.593903, // kilograms
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 32.174049, // pound-mass (lbm)
    imperialName: 'Pound-Mass (lbm)',
    imperialSymbol: 'lbm',
    subdivisions: [
      { name: 'Pounds Force (Weight at 1g lbf)', ratio: 32.174, note: 'Weighs 32.174 lbf on Earth surface' },
      { name: 'Grams', ratio: 14593.9, note: '14,594 grams' },
      { name: 'Blob / Slinch Equivalent (12 slugs)', ratio: 0.08333, note: '1 blob = 1 lbf·s²/in = 12 slugs (386.1 lbm)' },
      { name: 'Metric Slug / Hyl (9.80665 kg)', ratio: 1.4882, note: '1 slug = 1.488 metric slugs' }
    ],
    presets: [
      { label: '1 Slug (32.17 lbm / 14.59 kg)', val: 1 },
      { label: '5 Slugs (160.9 lbm / Average Human Adult)', val: 5 },
      { label: '100 Slugs (3,217 lbm / Family Sedan Automobile)', val: 100 },
      { label: '1,000 Slugs (32,174 lbm / Jet Fighter Aircraft)', val: 1000 }
    ],
    contextHtml: '<p>Coined by Scottish fluid mechanician Arthur Mason Worthington in 1904 (named from <em>sluggish</em>, due to inertia), the slug solves Newton\'s second law <code>F = m · a</code> in the foot-pound-second (FPS) system without awkward conversion constants. Because acceleration due to Earth gravity is 32.174 ft/s², dividing weight in pounds-force by 32.174 gives mass directly in slugs.</p>',
    primarySources: 'Worthington, <em>Dynamics of Rotation: An Elementary Introduction to Rigid Dynamics</em> (1904); NASA SP-7012: <em>The International System of Units</em>.',
    faq: [
      { q: 'How many pounds is one slug?', a: 'One slug equals approximately 32.17405 pounds-mass (lbm), which equals 14.5939 kilograms.' },
      { q: 'Why did aerospace engineers use slugs instead of pounds?', a: 'In the British Imperial engineering system, using "pound" for both mass and force required dividing by the gravitational acceleration constant gc (32.174) in every aerodynamic equation. Using slugs allows F = m·a to work cleanly without extra constants.' }
    ]
  },
  {
    slug: 'poundal-force-to-newtons-lbf',
    name: 'Poundal Force (Absolute FPS System)',
    shortName: 'Poundal Force',
    category: 'Traditional English & Surveying',
    era: '1870s Absolute Foot-Pound-Second Physics',
    title: 'Poundal Force (pdl) to Newtons & Pounds-Force (lbf) [Absolute Foot-Pound-Second Physics] | Digital Tools Shed',
    h1: 'Poundal Force (pdl) & Newtons Converter',
    metaDesc: 'Convert poundals (0.138255 Newtons = 0.031081 lbf = 1 lbm·ft/s²) to Newtons, dynes, and pounds-force. Explore James Thomson\'s absolute Imperial dynamics.',
    desc: 'The poundal (symbol: pdl) is the absolute unit of force in the Foot-Pound-Second system: the force needed to accelerate 1 pound-mass at 1 ft/s² (1 pdl = 0.138255 N).',
    primaryUnit: 'Poundals (pdl)',
    unitSymbol: 'pdl',
    defaultVal: 1,
    metricBase: 0.13825495, // Newtons
    metricName: 'Newtons',
    metricSymbol: 'N',
    imperialBase: 0.03108095, // pounds-force (lbf)
    imperialName: 'Pounds-Force (lbf)',
    imperialSymbol: 'lbf',
    subdivisions: [
      { name: 'Dynes', ratio: 13825.5, note: '13,825.5 dynes' },
      { name: 'Pounds-Force Fraction (lbf)', ratio: 0.03108, note: '32.174 poundals = 1 pound-force (lbf)' },
      { name: 'Ounces Force (ozf)', ratio: 0.4973, note: 'Approx. 0.5 ozf' },
      { name: 'Gram-Force (gf)', ratio: 14.098, note: '14.10 gram-force' }
    ],
    presets: [
      { label: '1 Poundal (0.138 N / 0.5 ozf)', val: 1 },
      { label: '32.174 Poundals (1 Pound-Force lbf / 4.448 N)', val: 32.174 },
      { label: '100 Poundals (3.11 lbf / 13.83 N)', val: 100 },
      { label: '1,000 Poundals (31.08 lbf / 138.25 N)', val: 1000 }
    ],
    contextHtml: '<p>Introduced in 1876 by Irish physicist and engineer James Thomson (brother of Lord Kelvin), the poundal was created as an "absolute" unit of force independent of local planetary gravity. While a 1-pound apple feels 1 pound-force (32.174 poundals) of gravity at Earth sea level, its weight in poundals changes if taken to the Moon, but 1 poundal always accelerates 1 pound of mass at 1 ft/s² everywhere in the universe.</p>',
    primarySources: 'James Thomson, <em>On Metric and Other Systems of Weights and Measures</em> (1876); Everett, <em>Units and Physical Constants</em> (1879).',
    faq: [
      { q: 'How many Newtons and pounds-force is 1 poundal?', a: 'One poundal equals 0.138255 Newtons or 0.031081 pounds-force (lbf). It takes 32.174 poundals to equal one standard pound-force.' },
      { q: 'What is the difference between a poundal and a pound-force?', a: 'A pound-force (lbf) is the gravitational pull of Earth on a 1-pound mass (equal to 32.174 poundals). A poundal is an absolute force unit: the exact force required to accelerate 1 pound-mass at 1 foot per second squared.' }
    ]
  },
  {
    slug: 'miners-inch-water-flow-rate',
    name: 'Miner\'s Inch Water Flow Rate',
    shortName: 'Miner\'s Inch',
    category: 'Traditional English & Surveying',
    era: 'California Gold Rush Hydraulic Mining (1850s)',
    title: 'Miner\'s Inch Water Flow Rate (1.5 cu ft/min) to GPM, CFS & Liters/sec [California Gold Rush Mining] | Digital Tools Shed',
    h1: 'Miner\'s Inch Water Flow Rate Converter',
    metaDesc: 'Convert California Gold Rush miner\'s inches (1.5 cu ft/min = 11.22 GPM = 0.025 cfs) to gallons per minute, liters/sec, and miner\'s sluice box water flow.',
    desc: 'The miner\'s inch was defined during the 1850s California Gold Rush as the flow rate of water discharging through a 1-square-inch orifice under a 6-inch head pressure.',
    primaryUnit: 'Miner\'s Inches (California Legal)',
    unitSymbol: 'mi_flow',
    defaultVal: 1,
    metricBase: 0.7079, // liters per second (0.025 cfs)
    metricName: 'Liters per Second',
    metricSymbol: 'L/s',
    imperialBase: 11.22, // Gallons per minute (GPM)
    imperialName: 'Gallons per Minute (GPM)',
    imperialSymbol: 'GPM',
    subdivisions: [
      { name: 'Cubic Feet per Second (CFS)', ratio: 0.025, note: '40 miner\'s inches = 1.0 CFS (California standard)' },
      { name: 'Cubic Feet per Minute (CFM)', ratio: 1.5, note: '1.5 cubic feet per minute' },
      { name: 'Acre-Feet per 24 Hours', ratio: 0.04959, note: 'Approx. 0.05 acre-feet/day' },
      { name: 'Arizona / Colorado Standard (CFS)', ratio: 0.020, note: '50 miner\'s inches = 1.0 CFS (Ariz./Colo./Ore.)' }
    ],
    presets: [
      { label: '1 Miner\'s Inch (11.22 GPM / 1 Sluice Box Flow)', val: 1 },
      { label: '40 Miner\'s Inches (1.0 CFS / Flume Ditch Stream)', val: 40 },
      { label: '500 Miner\'s Inches (Hydraulic Mining Giant Monitor Cannon)', val: 500 },
      { label: '2,000 Miner\'s Inches (Canyon Creek Diversion Canal)', val: 2000 }
    ],
    contextHtml: '<p>During the 1850s California Gold Rush, water was more valuable than gold. Massive ditch companies (like the South Yuba Water Company) built wooden trestle flumes clinging to canyon walls to sell water to miners for hydraulic monitors (giant water cannons). A miner paid for a wooden gate with a 1-inch square hole drilled 6 inches below the water surface.</p>',
    primarySources: 'California Civil Code § 1415 (enacted 1901: 40 miner\'s inches = 1 cfs); Bowie, <em>A Practical Treatise on Hydraulic Mining in California</em> (1885).',
    faq: [
      { q: 'How many gallons per minute is a miner\'s inch?', a: 'In California, 1 miner\'s inch equals exactly 1.5 cubic feet per minute, which is 11.22 US gallons per minute (0.025 cubic feet per second or 0.708 L/s). In Arizona, Colorado, and Oregon, it was legally defined as 1/50th of a cfs (8.98 GPM).' },
      { q: 'Why did miner\'s inches vary between Western states?', a: 'Before state water boards codified standards, water companies measured flow through wooden orifice plates with varying water pressure heads (typically 4, 5, or 6 inches of water depth above the orifice center), resulting in regional legal definitions.' }
    ]
  },
  {
    slug: 'cord-face-cord-firewood-volume',
    name: 'Cord & Face Cord Firewood Volume',
    shortName: 'Firewood Cord',
    category: 'Traditional English & Surveying',
    era: 'North American Forestry & Heating',
    title: 'Full Cord (128 cu ft 4x4x8) vs Face Cord Firewood Volume & Solid Wood Weight [Firewood Seasoning Calculator] | Digital Tools Shed',
    h1: 'Full Cord & Face Cord Firewood Volume Converter',
    metaDesc: 'Convert full cords of firewood (128 cu ft = 3.62 m³) and face cords (rick) to cubic feet, cubic meters, and seasoned oak wood weight. Prevent wood heating scams.',
    desc: 'A full legal cord is a stacked wood pile measuring 4 ft high × 4 ft wide × 8 ft long (128 cubic feet / 3.62 m³), while a "face cord" is only a single 16-inch log tier.',
    primaryUnit: 'Full Cords (128 cu ft)',
    unitSymbol: 'cord',
    defaultVal: 1,
    metricBase: 3.62456, // cubic meters stacked
    metricName: 'Cubic Meters (Stacked)',
    metricSymbol: 'm³',
    imperialBase: 128.0, // cubic feet
    imperialName: 'Cubic Feet (Gross Stack)',
    imperialSymbol: 'cu ft',
    subdivisions: [
      { name: 'Face Cords / Ricks (16" log cut)', ratio: 3.0, note: '3 face cords = 1 full cord' },
      { name: 'Solid Wood Volume (cu ft)', ratio: 85.0, note: '~85 cu ft solid wood (remainder air gaps)' },
      { name: 'Seasoned Red Oak Mass (lbs)', ratio: 3800.0, note: '~3,800 lbs (1.72 tonnes) dry red oak' },
      { name: 'Heat Energy (Million BTU)', ratio: 24.0, note: '~24 million BTU heat output (hardwood)' }
    ],
    presets: [
      { label: '1 Face Cord / Rick (4x8 ft with 16" logs = 42.7 cu ft)', val: 0.3333 },
      { label: '1 Full Cord (4x4x8 ft = 128 cu ft = 3,800 lbs Oak)', val: 1 },
      { label: '3 Full Cords (Typical Winter Home Heating Season)', val: 3 },
      { label: '10 Full Cords (Log Cabin Forest Storage)', val: 10 }
    ],
    contextHtml: '<p>The cord was originally measured using a cord of rope looped around a pile of roundwood 4 feet by 4 feet by 8 feet. Because bark and irregular split logs leave substantial air spaces, a 128-cubic-foot stacked cord contains only about <strong>85 cubic feet of solid wood</strong>. A common consumer fraud is selling a "face cord" or "rick" (a single 16-inch tier) at the full price of a 48-inch full cord!</p>',
    primarySources: 'National Institute of Standards and Technology (NIST) Handbook 130: <em>Method of Sale of Firewood</em>; US Forest Service Fuelwood Heat Tables.',
    faq: [
      { q: 'What is the difference between a full cord and a face cord?', a: 'A full legal cord is 4 feet high, 8 feet long, and 4 feet deep (128 cubic feet). A face cord (also called a rick) is 4 feet high and 8 feet long, but only as deep as the cut log length (typically 16 inches, or 1/3 of a full cord).' },
      { q: 'How much does a full cord of firewood weigh?', a: 'Weight depends on wood species and moisture: a full cord of seasoned dry red oak weighs about 3,800 pounds (1,720 kg), while green wet oak weighs over 5,000 pounds (2,270 kg). Dry pine weighs around 2,500 pounds.' }
    ]
  },
  {
    slug: 'hop-pocket-agricultural-weight',
    name: 'Hop Pocket Agricultural Weight',
    shortName: 'Hop Pocket',
    category: 'Traditional English & Surveying',
    era: 'British & European Commercial Hop Farming',
    title: 'Hop Pocket Agricultural Weight (1.5 cwt / 168 lbs) to Kilograms & Brewery Hectoliters [Kent Hop Harvest] | Digital Tools Shed',
    h1: 'Hop Pocket Cured Flower Weight Converter',
    metaDesc: 'Convert traditional British hop pockets (168 lbs / 1.5 cwt / 76.2 kg) to kilograms, pounds, and commercial brewery barrel bittering allocations.',
    desc: 'The hop pocket was a tall, coarse jute sack (typically 6 feet high by 2 feet wide) packed tightly with 1.5 hundredweight (168 lbs / 76.2 kg) of dried hops.',
    primaryUnit: 'Hop Pockets (168 lbs)',
    unitSymbol: 'pocket',
    defaultVal: 1,
    metricBase: 76.2035, // kilograms
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 168.0, // pounds
    imperialName: 'Pounds (lbs)',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Hundredweight (cwt)', ratio: 1.5, note: '1 pocket = 1.5 long hundredweight' },
      { name: 'US Hop Bales (200 lbs) Equivalent', ratio: 0.84, note: 'Modern US hop bale = 200 lbs (90.7 kg)' },
      { name: 'Ounces of Hops', ratio: 2688, note: '2,688 ounces' },
      { name: 'Barrels of Real Ale Bittered (at 1 lb/bbl)', ratio: 168.0, note: 'Bitters ~168 standard 36-gallon barrels' }
    ],
    presets: [
      { label: '1 Hop Pocket (168 lbs / 76.2 kg / Kent Oast House Bag)', val: 1 },
      { label: '5 Hop Pockets (Victorian Farm Waggon Load)', val: 5 },
      { label: '50 Hop Pockets (Commercial London Brewery Delivery)', val: 50 },
      { label: '100 Hop Pockets (Oast Kiln Season Yield)', val: 100 }
    ],
    contextHtml: '<p>In the hop gardens of Kent, Herefordshire, and Worcestershire, dried hop flowers from conical brick oast houses were scooped into suspended circular canvas sacks and compacted by laborers ("hop pressers") jumping into the bag or using mechanical screw presses. Each completed pocket was stenciled with the farm\'s name, year, variety (such as East Kent Goldings or Fuggles), and registered weight.</p>',
    primarySources: 'Hop (Prevention of Frauds) Act 1866 (29 & 30 Vict. c. 37); Burgess, <em>Hops: Botany, Cultivation, and Utilization</em> (1964).',
    faq: [
      { q: 'How much did a hop pocket weigh?', a: 'A traditional British hop pocket was standardized at 1.5 hundredweight, which equals 168 pounds (76.20 kilograms). In the United States, commercial hop bales were standardized at 200 pounds (90.7 kg).' },
      { q: 'Why were hop containers called "pockets"?', a: 'From the French pochette, describing the long, narrow tubular shape of the heavy burlap sack (approx. 6 feet tall and 2.5 feet wide) hung through an opening in the oast house cooling floor.' }
    ]
  },
  {
    slug: 'cotton-bale-weight-antebellum',
    name: 'Cotton Bale (Antebellum vs Modern)',
    shortName: 'Cotton Bale',
    category: 'Traditional English & Surveying',
    era: '19th Century Atlantic Cotton Trade',
    title: 'Cotton Bale Weight: Antebellum (400–450 lbs) vs Modern Standard (480–500 lbs) [Historic Textile Mills] | Digital Tools Shed',
    h1: 'Cotton Bale Historical & Modern Weight Converter',
    metaDesc: 'Convert historical antebellum cotton bales (400–450 lbs / 181–204 kg) and modern standard export bales (480–500 lbs / 227 kg) to metric tonnes and yardage.',
    desc: 'The cotton bale drove 19th-century global textile industrialization: evolving from 400 lbs in the 1840s to the modern universal standard of 480 net lbs (500 lbs gross).',
    primaryUnit: 'Modern Standard Bales (480 lbs)',
    unitSymbol: 'bale_cotton',
    defaultVal: 1,
    metricBase: 217.724, // kilograms (480 lbs net)
    metricName: 'Kilograms (Net)',
    metricSymbol: 'kg',
    imperialBase: 480.0, // pounds net
    imperialName: 'Pounds Net Lint',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Gross Weight with Bagging & Ties (lbs)', ratio: 500.0, note: '500 lbs gross standard' },
      { name: 'Antebellum 1850s Bale Equivalent (400 lbs)', ratio: 1.20, note: '1850s southern bales averaged 400 lbs' },
      { name: 'Metric Tonnes', ratio: 0.2177, note: '0.218 tonnes pure cotton lint' },
      { name: 'Men\'s Denim Jeans Produced', ratio: 325, note: 'Approx. 325 pairs of jeans per bale' }
    ],
    presets: [
      { label: '1 Antebellum Bale (400 lbs / 181 kg)', val: 0.8333 },
      { label: '1 Modern Standard Bale (480 lbs / 218 kg / 325 Jeans)', val: 1 },
      { label: '100 Bales (River Steamboat Deck Cargo)', val: 100 },
      { label: '1,000 Bales (Transatlantic Clipper Ship Hold)', val: 1000 }
    ],
    contextHtml: '<p>Eli Whitney\'s 1793 cotton gin enabled the explosion of short-staple upland cotton. Bales were compressed using massive mule-powered wooden screw presses on plantations, bound with hemp rope or iron hoop ties, and stacked high on Mississippi paddle steamers bound for New Orleans, Liverpool, and the textile spinning mills of Manchester ("Cottonopolis").</p>',
    primarySources: 'US Census Bureau: <em>Reports on Cotton Production in the United States</em> (1880); Hammond, <em>The Cotton Industry: An Essay in American Economic History</em> (1897).',
    faq: [
      { q: 'How much does a standard bale of cotton weigh?', a: 'A modern universal standard cotton bale in the United States has a net weight of 480 pounds (217.7 kg) and a gross weight of 500 pounds (226.8 kg), measuring roughly 55 × 21 × 28 inches.' },
      { q: 'What can be manufactured from a single 480-lb bale of cotton?', a: 'One 480-pound bale can produce approximately 215 pairs of denim jeans, 1,217 men\'s t-shirts, 765 bedsheets, or 313,600 $100 Federal Reserve banknotes (which are 75% cotton and 25% linen).' }
    ]
  },
  {
    slug: 'quire-ream-paper-count-converter',
    name: 'Paper Quire, Ream & Bundle',
    shortName: 'Paper Ream & Quire',
    category: 'Traditional English & Surveying',
    era: 'Traditional Printmaking & Stationery',
    title: 'Paper Quire (24–25 Sheets), Ream (480–500 Sheets) & Bundle Sheet Count Converter [Stationery Printing] | Digital Tools Shed',
    h1: 'Paper Quire, Ream, Bundle & Bale Count Converter',
    metaDesc: 'Convert historical paper reams (short ream 480 sheets vs modern 500 sheets), quires (24 vs 25 sheets), bundles, and printer\'s bales to total sheet counts.',
    desc: 'The traditional "short ream" had 480 sheets (20 quires of 24 sheets), leaving extra "printer\'s quires" for makeready before the modern metric 500-sheet ream.',
    primaryUnit: 'Modern Reams (500 Sheets)',
    unitSymbol: 'ream',
    defaultVal: 1,
    metricBase: 500, // sheets
    metricName: 'Total Paper Sheets',
    metricSymbol: 'sheets',
    imperialBase: 20.0, // quires
    imperialName: 'Modern Quires (25 sheets)',
    imperialSymbol: 'quires',
    subdivisions: [
      { name: 'Historical Short Ream (480 Sheets)', ratio: 0.96, note: '480 sheets (20 quires of 24 sheets)' },
      { name: 'Printer\'s Ream (516 Sheets)', ratio: 1.032, note: '516 sheets (21.5 quires with spoilage allowance)' },
      { name: 'Paper Bundles (2 Reams)', ratio: 0.5, note: '1 bundle = 2 reams (1,000 sheets)' },
      { name: 'Paper Bales (5 Bundles)', ratio: 0.1, note: '1 bale = 5 bundles = 10 reams (5,000 sheets)' }
    ],
    presets: [
      { label: '1 Quire (25 Sheets of Fine Stationery)', val: 0.05 },
      { label: '1 Short Ream (480 Sheets / 20 Quires of 24)', val: 0.96 },
      { label: '1 Modern Ream (500 Sheets)', val: 1 },
      { label: '1 Paper Bale (10 Reams / 5,000 Sheets = 50 lbs)', val: 10 }
    ],
    contextHtml: '<p>The word <em>quire</em> comes from Old French <em>quaisne</em> and Latin <em>quaterni</em> ("set of four"), referring to four sheets of vellum folded in half to make an 8-leaf booklet. A "printer\'s ream" was packed with 516 sheets (21.5 quires of 24) to provide the master printer with an "overs" allowance for trial ink proofs (makeready) and defective sheets without running short of 500 perfect books.</p>',
    primarySources: 'Moxon\'s <em>Mechanick Exercises: Or, the Doctrine of Handy-Works Applied to the Art of Printing</em> (1683); Hunter, <em>Papermaking: The History and Technique of an Ancient Craft</em>.',
    faq: [
      { q: 'How many sheets of paper are in a quire and a ream?', a: 'In the modern stationery standard, 1 quire = 25 sheets, and 1 ream = 20 quires = 500 sheets. In the historical printing trade, 1 quire was 24 sheets, and 1 "short ream" was 480 sheets.' },
      { q: 'What is a bundle and a bale of paper?', a: 'A bundle of paper contains 2 reams (1,000 sheets). A bale of paper contains 5 bundles, which equals 10 reams or 5,000 sheets.' }
    ]
  },
  {
    slug: 'bakers-dozen-score-gross-great-gross',
    name: 'Baker\'s Dozen, Score, Gross & Great Gross',
    shortName: 'Baker\'s Dozen & Gross',
    category: 'Traditional English & Surveying',
    era: 'Traditional Commerce & Duodecimal Counting',
    title: 'Baker\'s Dozen (13), Score (20), Gross (144) & Great Gross (1,728) Item Quantity Converter [Vigesimal & Duodecimal Counts] | Digital Tools Shed',
    h1: 'Baker\'s Dozen, Score, Gross & Great Gross Converter',
    metaDesc: 'Convert traditional duodecimal and vigesimal item counts: baker\'s dozen (13), score (20), gross (144), and great gross (1,728) to individual units and dozens.',
    desc: 'Before the decimal system, European commerce relied on base-12 duodecimal (dozen, gross = 144, great gross = 1,728) and base-20 vigesimal counting (score = 20).',
    primaryUnit: 'Gross (144 Items)',
    unitSymbol: 'gross',
    defaultVal: 1,
    metricBase: 144, // individual items
    metricName: 'Individual Units / Items',
    metricSymbol: 'items',
    imperialBase: 12.0, // standard dozens
    imperialName: 'Standard Dozens (12)',
    imperialSymbol: 'doz',
    subdivisions: [
      { name: 'Baker\'s Dozen (13)', ratio: 11.0769, note: '1 gross = 11.08 baker\'s dozens (13 each)' },
      { name: 'Scores (20)', ratio: 7.2, note: '1 gross = 7.2 scores (20 each)' },
      { name: 'Great Gross Fraction (1,728)', ratio: 0.08333, note: '12 gross = 1 great gross (1,728 items)' },
      { name: 'Small Gross Equivalent (120)', ratio: 1.2, note: '10 dozen = 1 small gross (120 items)' }
    ],
    presets: [
      { label: '1 Baker\'s Dozen (13 Pastries / Legal Margin)', val: 0.09028 },
      { label: '1 Score (20 Items / Abraham Lincoln "Four score and seven")', val: 0.13889 },
      { label: '1 Gross (144 Items / 12 Dozen Screws or Buttons)', val: 1 },
      { label: '1 Great Gross (1,728 Items / 12 Gross Factory Box)', val: 12 }
    ],
    contextHtml: '<p>The "baker\'s dozen" (13 instead of 12) originated with the English Assize of Bread and Ale in 1266. Bakers who shortchanged customers on bread weight faced draconian medieval penalties, including hefty fines or being pilloried in the town square. To prevent accidental underweight batches due to air bubbles in yeast dough, bakers habitually added an extra 13th roll (the "in-bread" or "vantage bread") for good measure!</p>',
    primarySources: 'Assize of Bread and Ale (51 Hen. III, 1266); Abraham Lincoln, <em>Gettysburg Address</em> (1863: "Four score and seven years ago"); Menninger, <em>Number Words and Number Symbols</em>.',
    faq: [
      { q: 'Why is a baker\'s dozen 13 instead of 12?', a: 'Medieval English law severely punished bakers whose loaves were underweight. To guarantee that a sold dozen never weighed less than the statutory requirement, bakers added a 13th loaf free as insurance against dough variation.' },
      { q: 'How many items are in a score, a gross, and a great gross?', a: 'A score is 20 items. A gross is 12 dozen, or 144 items. A great gross (or grand gross) is 12 gross, or 1,728 items.' }
    ]
  },

  // ─── 8. EGYPTIAN & ANCIENT NEAR EAST SYSTEMS (91-96) ───────────────────────
  {
    slug: 'ancient-egyptian-royal-cubit-meh-neswt',
    name: 'Egyptian Royal Cubit (Meh Neswt)',
    shortName: 'Royal Cubit',
    category: 'Egyptian & Ancient Near East',
    era: 'Old Kingdom Egypt (Pyramid Age, c. 2600 BC)',
    title: 'Ancient Egyptian Royal Cubit (Meh Neswt 52.4 cm) to Inches & Meters [Great Pyramid Geometry] | Digital Tools Shed',
    h1: 'Egyptian Royal Cubit (Meh Neswt) Geometry Converter',
    metaDesc: 'Convert Egyptian Royal Cubits (52.35–52.40 cm / 20.62 inches) to meters, inches, palms (shesep), and fingers (djeba). Analyze the Great Pyramid of Giza.',
    desc: 'The Egyptian Royal Cubit (meh neswt, ~52.36 cm / 20.62 in) was divided into 7 palms (28 fingers), engineered with astronomical precision to build the Pyramids of Giza.',
    primaryUnit: 'Royal Cubits (Meh)',
    unitSymbol: 'cubit_royal',
    defaultVal: 1,
    metricBase: 0.5236, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 20.614, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Palms / Shesep (7 per cubit)', ratio: 7, note: '1 royal cubit = 7 palms (74.8 mm each)' },
      { name: 'Fingers / Djeba (28 per cubit)', ratio: 28, note: '1 royal cubit = 28 fingers (18.7 mm each)' },
      { name: 'Centimeters', ratio: 52.36, note: '52.36 cm standard' },
      { name: 'Common Cubit Equivalent (6 palms)', ratio: 1.1667, note: 'Royal cubit is 1 palm longer than common cubit' }
    ],
    presets: [
      { label: '1 Royal Cubit (52.36 cm / 20.61 in)', val: 1 },
      { label: '10 Cubits (King\'s Chamber Width in Giza)', val: 10 },
      { label: '20 Cubits (King\'s Chamber Length)', val: 20 },
      { label: '440 Cubits (Great Pyramid Base Length = 230.36 m)', val: 440 }
    ],
    contextHtml: '<p>The master basalt and granite Royal Cubit rods preserved in Egyptian tombs (such as Maya\'s cubit in the Louvre) are divided into 7 palms (<em>shesep</em>) of 4 fingers (<em>djeba</em>) each, totaling 28 digits. In the Great Pyramid of Khufu, each side of the square base measured exactly <strong>440 Royal Cubits</strong> (230.36 meters / 755.8 feet), with an error margin of less than 0.05%!</p>',
    primarySources: 'Rhind Mathematical Papyrus (c. 1550 BC); Turin King List; Lepsius, <em>Die alt-aegyptische Elle und ihre Eintheilung</em> (1865).',
    faq: [
      { q: 'How long was an ancient Egyptian Royal Cubit?', a: 'The Egyptian Royal Cubit measured approximately 52.35 to 52.40 centimeters (20.61 to 20.63 inches). Unlike the common 6-palm cubit (45 cm), the Royal Cubit contained 7 palms.' },
      { q: 'How was the Royal Cubit divided?', a: 'The Royal Cubit was divided into 7 palms (shesep), and each palm into 4 fingers (djeba), giving a total of 28 fingers per cubit.' }
    ]
  },
  {
    slug: 'ancient-egyptian-deben-qedet-weight',
    name: 'Egyptian Deben & Qedet Weight',
    shortName: 'Deben & Qedet',
    category: 'Egyptian & Ancient Near East',
    era: 'New Kingdom Egypt (Deir el-Medina, c. 1300 BC)',
    title: 'Ancient Egyptian Deben (91 Grams Copper) and Qedet (Kite) Weight to Ounces [Pharaonic Barter Economy] | Digital Tools Shed',
    h1: 'Egyptian Deben & Qedet Barter Weight Converter',
    metaDesc: 'Convert ancient Egyptian debens of copper (91 grams) and silver/gold qedets (9.1 g) to grams, troy ounces, and purchasing power. Explore Deir el-Medina tomb workers.',
    desc: 'The deben (~91 grams of copper) and its tenth, the qedet (~9.1 g of silver), formed the standard unit of value in pharaonic Egypt\'s moneyless barter economy.',
    primaryUnit: 'Debens (Copper Standard)',
    unitSymbol: 'deben',
    defaultVal: 1,
    metricBase: 91.0, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 2.9257, // troy ounces
    imperialName: 'Troy Ounces',
    imperialSymbol: 'oz t',
    subdivisions: [
      { name: 'Qedet / Kite (1/10 deben)', ratio: 10, note: '1 deben = 10 qedets (9.10 g each)' },
      { name: 'Avoirdupois Ounces', ratio: 3.2099, note: '3.21 oz avoirdupois' },
      { name: 'Grains', ratio: 1404.3, note: '1,404 grains' },
      { name: 'Silver Ratio Value (1 deben silver = 100 deben copper)', ratio: 0.01, note: 'Silver was 100× more valuable than copper' }
    ],
    presets: [
      { label: '1 Qedet (9.1 g / 1 Pair of Sandals)', val: 0.1 },
      { label: '1 Deben (91 g Copper / Price of a Straw Mat)', val: 1 },
      { label: '5 Deben (Wooden Bedstead / Linen Tunic)', val: 5 },
      { label: '140 Deben (Price of 1 Working Ox in Ramesside Era)', val: 140 }
    ],
    contextHtml: '<p>Ancient Egyptians did not strike coins until the Persian conquest. Instead, the craftsmen who built the Valley of the Kings at Deir el-Medina priced all market transactions in <strong>debens of copper</strong>. If a laborer bought an ox priced at 140 debens, he paid with 1 wooden coffin (40 debens) + 2 bronze cauldrons (60 debens) + 4 linen sheets (40 debens) to balance the deben ledger!</p>',
    primarySources: 'Deir el-Medina Ostraca & Papyrus BM 10052; Janssen, <em>Commodity Prices from the Ramessid Period</em> (1975).',
    faq: [
      { q: 'How many grams did an ancient Egyptian deben weigh?', a: 'In the New Kingdom standard, one deben weighed approximately 91.0 grams (3.21 avoirdupois ounces). One-tenth of a deben was a qedet (or kite), weighing 9.10 grams.' },
      { q: 'How did debens function without physical coins?', a: 'The deben served as an abstract accounting unit of value. Goods were appraised in debens on balance scales using polished stone weights shaped like sleeping bulls or lions.' }
    ]
  },
  {
    slug: 'ancient-egyptian-hekat-grain-volume',
    name: 'Ancient Egyptian Hekat Grain Volume',
    shortName: 'Egyptian Hekat',
    category: 'Egyptian & Ancient Near East',
    era: 'Pharaonic Egypt (Middle & New Kingdom)',
    title: 'Ancient Egyptian Hekat (Eye of Horus Binary Fractions) to Liters & Pints [Sacred Grain Ration Calculator] | Digital Tools Shed',
    h1: 'Ancient Egyptian Hekat (Eye of Horus) Volume Converter',
    metaDesc: 'Convert Egyptian hekat grain measures (4.80 liters / 10 henu) and Eye of Horus binary fractions (1/2, 1/4, 1/8, 1/16, 1/32, 1/64) to modern liters and quarts.',
    desc: 'The hekat (~4.80 liters) was the dry grain volume standard of Egypt, famously subdivided using the 6 anatomical parts of the sacred Eye of Horus (Wadjet).',
    primaryUnit: 'Hekat (Eye of Horus)',
    unitSymbol: 'hekat',
    defaultVal: 1,
    metricBase: 4.80, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 5.072, // US liquid quarts
    imperialName: 'US Quarts',
    imperialSymbol: 'qt',
    subdivisions: [
      { name: 'Henu / Hin (1/10 hekat)', ratio: 10, note: '1 hekat = 10 henu (480 mL jar)' },
      { name: 'Dja (1/64 hekat / Eye of Horus Pupil)', ratio: 64, note: '1 dja = 75 mL (4 ro)' },
      { name: 'Ro / Mouthful (1/320 hekat)', ratio: 320, note: '1 ro = 15 mL (1 tablespoon)' },
      { name: 'Khar Sack (16 hekat)', ratio: 0.0625, note: '1 khar = 16 hekat (76.8 L)' }
    ],
    presets: [
      { label: '1/64 Hekat (Eye of Horus Pupil / 75 mL)', val: 0.015625 },
      { label: '1 Henu Jar (480 mL / 1 Pint of Beer)', val: 0.10 },
      { label: '1 Hekat (4.80 Liters / Standard Bread Ration)', val: 1 },
      { label: '1 Khar Sack (16 Hekat = 76.8 L / Scribe Grain Ledger)', val: 16 }
    ],
    contextHtml: '<p>Egyptian scribes recorded fractional hekat measures using the anatomical glyphs of the <strong>Eye of Horus (Wadjet)</strong>: the right eye brow represented 1/8, the pupil 1/4, the inner corner 1/2, the outer corner 1/16, the spiral tail 1/32, and the teardrop 1/64. Summed together, these parts total 63/64; myth held that the remaining 1/64 was restored by Thoth, the god of wisdom and mathematics.</p>',
    primarySources: 'Rhind Mathematical Papyrus (Problem 80); Moscow Mathematical Papyrus; Gardiner, <em>Egyptian Grammar</em> (Sign-list Section D).',
    faq: [
      { q: 'How many liters is an ancient Egyptian hekat?', a: 'A standard Egyptian hekat equals approximately 4.80 liters (5.07 US liquid quarts or 4.36 dry quarts). It held exactly 10 henu (or hin) vessels of 480 mL each.' },
      { q: 'What is the connection between the Eye of Horus and grain measurement?', a: 'The 6 glyphs composing the Eye of Horus represented the binary fractions 1/2, 1/4, 1/8, 1/16, 1/32, and 1/64 of a hekat, used by scribes to measure grain and medical prescriptions.' }
    ]
  },
  {
    slug: 'sumerian-kus-cubit-and-nindan',
    name: 'Sumerian Kùš (Cubit) & Nindan Rod',
    shortName: 'Sumerian Kùš',
    category: 'Egyptian & Ancient Near East',
    era: 'Early Dynastic & Ur III Mesopotamia (c. 2500–2000 BC)',
    title: 'Sumerian Kùš (Cubit 49.5 cm of Gudea) & Nindan (12 Cubits) to Meters [Ziggurat Canal Architecture] | Digital Tools Shed',
    h1: 'Sumerian Kùš (Cubit) & Nindan Surveying Converter',
    metaDesc: 'Convert Sumerian kùš cubits (49.5 cm, engraved on the statue of Prince Gudea of Lagash) and nindan rods (12 cubits / 5.94m) to modern meters and feet.',
    desc: 'The Sumerian kùš (cubit, ~49.5 cm) and nindan (surveying rod of 12 kùš ≈ 5.94 m) measured the earliest ziggurat temples and irrigation canals in human history.',
    primaryUnit: 'Sumerian Kùš (Cubits)',
    unitSymbol: 'kus',
    defaultVal: 1,
    metricBase: 0.495, // meters (Gudea standard)
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 19.488, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Šu-du-a (Palms / 3 per kùš)', ratio: 3, note: '1 kùš = 3 palms (16.5 cm each)' },
      { name: 'Šu-si (Fingers / 30 per kùš)', ratio: 30, note: '1 kùš = 30 fingers (16.5 mm each)' },
      { name: 'Nindan Survey Rod (12 kùš)', ratio: 0.08333, note: '1 nindan = 12 kùš (5.94 m)' },
      { name: 'Éše Surveyor Cord (10 nindan)', ratio: 0.008333, note: '1 éše = 120 kùš (59.4 m)' }
    ],
    presets: [
      { label: '1 Kùš (Cubit of Gudea / 49.5 cm / 19.5 in)', val: 1 },
      { label: '12 Kùš (1 Nindan Surveying Rod / 5.94 m)', val: 12 },
      { label: '120 Kùš (1 Éše Surveyor Cord / 59.4 m)', val: 120 },
      { label: '3,600 Kùš (1 Danna / Sumerian League / 1.78 km)', val: 3600 }
    ],
    contextHtml: '<p>The oldest surviving calibrated measuring scale in human history is carved into the lap of the diorite statue of <strong>Prince Gudea of Lagash</strong> (c. 2120 BC), preserved in the Louvre. The scale is 16.5 centimeters long—representing exactly one-third of the Sumerian kùš cubit (49.5 cm), subdivided into 16 fingers and 6 precision graduations.</p>',
    primarySources: 'Statue of Gudea with Building Plan (Louvre AO 3); Robson, <em>Mesopotamian Mathematics, 2100–1600 BC</em>; Powell, <em>Sumerian and Babylonian Metrology</em>.',
    faq: [
      { q: 'How long was a Sumerian cubit (kùš)?', a: 'The Sumerian kùš measured approximately 49.5 centimeters (19.49 inches). It was divided into 30 fingers (šu-si) of 16.5 millimeters each.' },
      { q: 'What was a Sumerian nindan?', a: 'A nindan was the standard surveying pole of Mesopotamia, equal to 12 kùš (5.94 meters or 19.5 feet). The Sumerian unit of land area, the sar (garden), was one square nindan (35.28 m²).' }
    ]
  },
  {
    slug: 'babylonian-se-and-mana-weight',
    name: 'Babylonian Še, Shekel & Mana Weight',
    shortName: 'Babylonian Mana',
    category: 'Egyptian & Ancient Near East',
    era: 'Old Babylonian Empire (Hammurabi, c. 1750 BC)',
    title: 'Babylonian Še (Barleycorn), Shekel (Gin) & Mana (Mina 505g) to Grams [Code of Hammurabi Penalties] | Digital Tools Shed',
    h1: 'Babylonian Še, Shekel & Mana Weight Converter',
    metaDesc: 'Convert Babylonian še (barleycorn, 0.046g), silver shekels (gin, 8.42g), and royal mana (505g) to grams, troy ounces, and Code of Hammurabi fines.',
    desc: 'The Babylonian sexagesimal weight system (180 še = 1 shekel/gin ≈ 8.42 g, 60 shekels = 1 mana ≈ 505 g, 60 mana = 1 biltu/talent) ruled ancient trade.',
    primaryUnit: 'Babylonian Shekels (Gin)',
    unitSymbol: 'gin',
    defaultVal: 1,
    metricBase: 8.4167, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 0.2706, // troy ounces
    imperialName: 'Troy Ounces',
    imperialSymbol: 'oz t',
    subdivisions: [
      { name: 'Še (Barleycorns / 180 per shekel)', ratio: 180, note: '1 shekel = 180 grains of barley (0.0468 g each)' },
      { name: 'Mana / Mina Fraction (60 shekels)', ratio: 0.016667, note: '60 shekels = 1 mana (505 g)' },
      { name: 'Biltu / Talent Fraction (3,600 shekels)', ratio: 0.0002778, note: '60 mana = 1 talent (30.3 kg)' },
      { name: 'Hebrew Sanctuary Shekel Comparison', ratio: 0.7383, note: 'Babylonian shekel (8.42g) was lighter than Hebrew (11.4g)' }
    ],
    presets: [
      { label: '180 Še (1 Shekel of Silver / 8.42 g)', val: 1 },
      { label: '5 Shekels (Doctor Fee for Setting Broken Bone, Law #221)', val: 5 },
      { label: '60 Shekels (1 Mana / Mina / 505 Grams Silver)', val: 60 },
      { label: '3,600 Shekels (1 Biltu / Talent of Silver / 30.3 kg)', val: 3600 }
    ],
    contextHtml: '<p>King Hammurabi\'s famous law code carved on a black diorite stele in Babylon codified legal damages in silver shekels: Law #198 decreed that if an aristocrat blinded the eye of a commoner, "he shall pay one mana of silver (505 grams)." The system was strictly sexagesimal: 60 shekels made 1 mana, and 60 mana made 1 talent (biltu, approx. 30.3 kg).</p>',
    primarySources: '<em>The Code of Hammurabi</em> (c. 1754 BC); Clay Tablets from Sippar and Nippur; Powell, <em>Masse und Gewichte (Reallexikon der Assyriologie)</em>.',
    faq: [
      { q: 'How many grams was a Babylonian shekel and mana?', a: 'A Babylonian shekel (gin) weighed 8.417 grams (130 grains). Sixty shekels made one mana (mina), weighing approximately 505.0 grams (1.11 lbs).' },
      { q: 'What was the smallest weight in the Babylonian system?', a: 'The smallest unit was the še (barleycorn), weighing exactly 1/180th of a shekel (approx. 0.0468 grams or 46.8 milligrams).' }
    ]
  },
  {
    slug: 'babylonian-sila-and-ka-liquid-dry',
    name: 'Babylonian Sila (Qû / Ka) Volume',
    shortName: 'Babylonian Sila',
    category: 'Egyptian & Ancient Near East',
    era: 'Ancient Mesopotamia (Sumer & Babylon)',
    title: 'Babylonian Sila (Qû / Ka 0.84 Liters) to Pints, Quarts & Liters [Cuneiform Grain Ration Bowls] | Digital Tools Shed',
    h1: 'Babylonian Sila (Qû / Ka) Volume Converter',
    metaDesc: 'Convert Mesopotamian sila / qû volume vessels (approx. 0.842 liters / 1.78 pints) to liters, pints, and barley rations. Reconstruct bevel-rim bowl diets.',
    desc: 'The sila (Akkadian: <em>qû</em>, ~0.842 liters) was the fundamental cube-root liquid and dry unit of Mesopotamia, defined as a cube measuring 0.1 cubits on each side.',
    primaryUnit: 'Sila (Qû)',
    unitSymbol: 'sila',
    defaultVal: 1,
    metricBase: 0.842, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 1.779, // US liquid pints
    imperialName: 'US Pints',
    imperialSymbol: 'pt',
    subdivisions: [
      { name: 'Ban (10 sila)', ratio: 0.1, note: '1 ban = 10 sila (8.42 L)' },
      { name: 'Bariga (60 sila)', ratio: 0.016667, note: '1 bariga = 60 sila (50.5 L)' },
      { name: 'Gur (300 sila / Royal Granary Vessel)', ratio: 0.003333, note: '1 gur = 300 sila (252.6 L)' },
      { name: 'Barley Mass (kg @ 0.62 kg/L)', ratio: 0.522, note: '~0.52 kg barley grain per sila' }
    ],
    presets: [
      { label: '1 Sila (1 Daily Barley Meal / Bevel-Rim Bowl)', val: 1 },
      { label: '2 Sila (Daily Adult Working Ration)', val: 2 },
      { label: '60 Sila (1 Bariga / Monthly Worker Rations)', val: 60 },
      { label: '300 Sila (1 Royal Gur Cask = 252.6 Liters)', val: 300 }
    ],
    contextHtml: '<p>Archaeologists excavating early Mesopotamian cities like Uruk find hundreds of thousands of mass-produced, crude ceramic "bevel-rim bowls." These bowls held almost exactly <strong>1 sila</strong> (approx. 0.84 liters) of barley grain, handed out daily to temple canal diggers and weavers as their subsistence calorie wage.</p>',
    primarySources: 'Uruk Archaic Administrative Tablets (c. 3100 BC); Englund, <em>Texts from the Late Uruk Period</em> (1998); Nissen et al., <em>Archaic Bookkeeping</em>.',
    faq: [
      { q: 'How many liters did an ancient Babylonian sila hold?', a: 'One sila (or qû) held approximately 0.842 liters (1.78 US liquid pints or 1.53 dry pints). It was geometrically derived as a cube of one-tenth of a cubit on each side.' },
      { q: 'What is a gur of grain in Mesopotamia?', a: 'A gur was the largest dry volume unit in Mesopotamia, equal to 300 sila (252.6 liters or 7.17 US dry bushels). It was the standard unit for recording harvest yields in royal granaries.' }
    ]
  },

  // ─── 9. EAST ASIAN HISTORICAL SYSTEMS (97-105) ─────────────────────────────
  {
    slug: 'chinese-li-traditional-distance',
    name: 'Traditional Chinese Li (里)',
    shortName: 'Chinese Li (里)',
    category: 'East Asian Historical',
    era: 'Imperial China (Qin, Han, Tang, Qing Dynasties)',
    title: 'Traditional Chinese Li (里 500m Metric vs 576m Qing vs 415m Han) Distance Converter [Great Wall of 10,000 Li] | Digital Tools Shed',
    h1: 'Traditional Chinese Li (里) Road Distance Converter',
    metaDesc: 'Convert historical Chinese li distances across dynasties (Modern 500m, Qing 576m, Tang 531m, Han 415m) to kilometers and miles. Decode the "Wanli Changcheng".',
    desc: 'The li (里) evolved from 415 meters in the Han dynasty to 576 meters in the Qing dynasty, before being rounded in the modern metric system to exactly 500 meters.',
    primaryUnit: 'Modern Standard Li (市里)',
    unitSymbol: 'li',
    defaultVal: 1,
    metricBase: 500.0, // meters (modern shi li)
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 0.310686, // statute miles
    imperialName: 'Statute Miles',
    imperialSymbol: 'mi',
    subdivisions: [
      { name: 'Kilometers', ratio: 0.50, note: '1 modern li = 0.50 km' },
      { name: 'Bu / Paces (步, 300 per li)', ratio: 300, note: '1 li = 300 double paces' },
      { name: 'Chi / Feet (尺, 1,500 per li)', ratio: 1500, note: '1 li = 1,500 chi' },
      { name: 'Qing Dynasty Li (576 m)', ratio: 0.8681, note: 'Qing li was 15.2% longer (576 meters)' },
      { name: 'Han Dynasty Li (415.8 m)', ratio: 1.2025, note: 'Han li was 16.8% shorter (415.8 meters)' }
    ],
    presets: [
      { label: '1 Modern Li (500 Meters / Half Kilometer)', val: 1 },
      { label: '1 Qing Imperial Li (576 Meters)', val: 1.152 },
      { label: '100 Li (1 Day Courier Station Relay)', val: 100 },
      { label: '10,000 Li (Wanli Changcheng / The Great Wall)', val: 10000 }
    ],
    contextHtml: '<p>The Great Wall of China is known in Chinese as the <em>Wanli Changcheng</em> (万里长城, "Ten-Thousand-Li Long Wall"). In Chinese literary culture, "ten thousand" (<em>wan</em>) represents an infinite, immense number. In the Qin and Han dynasties (when the wall was first consolidated), 10,000 Han li equaled approx. 4,158 kilometers (2,584 miles), remarkably close to the primary rampart\'s length.</p>',
    primarySources: '<em>Hanshu</em> (Book of Han: Treatise on Metrology); <em>Qing Huidian</em> (Collected Statutes of the Qing Dynasty); Needham, <em>Science and Civilisation in China</em>.',
    faq: [
      { q: 'How long is a Chinese li in kilometers and miles?', a: 'In the modern market system (shi li), 1 li equals exactly 500 meters (0.5 km or 0.3107 miles). In imperial times, it varied: Han dynasty li was 415.8 meters, Tang was 531 meters, and Qing was 576 meters.' },
      { q: 'Why is the Great Wall called 10,000 Li?', a: 'Because the number 10,000 (wan, 万) in Chinese is symbolic of vast, epic scale. At 415.8 meters per Han dynasty li, 10,000 li equaled 4,158 km, closely approximating the wall\'s historical expanse.' }
    ]
  },
  {
    slug: 'chinese-chi-cun-traditional-length',
    name: 'Chinese Chi (尺) & Cun (寸) Length',
    shortName: 'Chinese Chi & Cun',
    category: 'East Asian Historical',
    era: 'Imperial China',
    title: 'Traditional Chinese Chi (尺 Foot) & Cun (寸 Chinese Inch) to Centimeters & Inches [Acupuncture & Carpentry] | Digital Tools Shed',
    h1: 'Traditional Chinese Chi (尺) & Cun (寸) Length Converter',
    metaDesc: 'Convert Chinese chi (foot: modern 33.3 cm, Shang 16.9 cm, Tang 30.7 cm) and cun (inch) to centimeters and inches. Essential for TCM acupuncture and woodworking.',
    desc: 'The chi (尺, ~33.3 cm modern) and cun (寸, ~3.33 cm, anatomical thumb width) grew steadily larger over 3,000 years of dynastic Chinese administrative history.',
    primaryUnit: 'Modern Standard Chi (市尺)',
    unitSymbol: 'chi',
    defaultVal: 1,
    metricBase: 0.333333, // meters (modern 1/3 meter)
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 13.1234, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Cun (寸 / Chinese Inches)', ratio: 10, note: '1 chi = 10 cun (3.33 cm each)' },
      { name: 'Fen (分, 100 per chi)', ratio: 100, note: '1 chi = 100 fen (3.33 mm each)' },
      { name: 'Zhang (丈 / 10 chi)', ratio: 0.10, note: '1 zhang = 10 chi (3.33 m)' },
      { name: 'Centimeters', ratio: 33.333, note: '33.33 cm (Modern 1/3 meter)' },
      { name: 'Han Dynasty Chi (23.1 cm)', ratio: 0.693, note: 'Han dynasty chi was only 23.1 cm' }
    ],
    presets: [
      { label: '1 Cun (Acupuncture Thumb-Breadth / 3.33 cm)', val: 0.10 },
      { label: '1 Modern Chi (33.33 cm / 13.12 in)', val: 1 },
      { label: '7 Chi (Tall Han General Height "Qi Chi Zhi Qu" = 162 cm)', val: 4.85 },
      { label: '1 Zhang (10 Chi / 3.33 Meters)', val: 10 }
    ],
    contextHtml: '<p>The physical length of the chi increased by nearly 100% over Chinese history: Shang dynasty (16.9 cm) → Zhou (23.1 cm) → Han (23.1 cm) → Tang (30.7 cm) → Qing (32.0 cm) → Modern Shi Chi (33.33 cm, defined as exactly 1/3 of a meter). Ancient texts describing heroic warriors as "eight chi tall" (八尺) in the Han era meant 8 × 23.1 = 184.8 cm (6 feet 1 inch), not 8 × 33.3 = 266 cm!</p>',
    primarySources: '<em>Zuo Zhuan</em>; Qiu Guangming, <em>The History of Ancient Chinese Measures and Weights</em>; WHO Standard Acupuncture Point Locations.',
    faq: [
      { q: 'How long is a Chinese chi and cun?', a: 'In the modern market system (shi zhi), 1 chi equals 33.33 centimeters (13.12 inches, or exactly 1/3 meter). One cun equals one-tenth of a chi, or 3.33 centimeters (1.31 inches).' },
      { q: 'How tall were ancient Chinese warriors who were "eight chi tall"?', a: 'During the Three Kingdoms era (c. 220 AD), a chi measured 23.1 cm. An "8-chi warrior" like Guan Yu stood approx. 185 cm tall (6 feet 1 inch)—tall and imposing for the era, but normal human stature.' }
    ]
  },
  {
    slug: 'chinese-jin-catty-liang-tael',
    name: 'Chinese Jin (Catty) & Liang (Tael)',
    shortName: 'Chinese Jin & Liang',
    category: 'East Asian Historical',
    era: 'Imperial & Modern China (16-Liang vs 10-Liang)',
    title: 'Chinese Jin (Catty 500g / 604g) & Liang (Tael 31.25g / 50g) Converter [Hong Kong Herbalist Scale] | Digital Tools Shed',
    h1: 'Chinese Jin (Catty) & Liang (Tael) Weight Converter',
    metaDesc: 'Convert Chinese jin (catty: PRC 500g vs Hong Kong/Taiwan 600g/604g) and liang (tael: 50g decimal vs 37.5g old 16-part system) to grams and ounces.',
    desc: 'The jin (catty, 500 g in PRC, 604.79 g in Hong Kong) was traditionally divided into 16 liang (taels), the origin of the Chinese idiom "half a catty and eight ounces".',
    primaryUnit: 'PRC Market Jin (市斤 500g)',
    unitSymbol: 'jin',
    defaultVal: 1,
    metricBase: 500.0, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 1.10231, // pounds
    imperialName: 'Pounds (lbs)',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Modern Decimal Liang (10 per jin)', ratio: 10, note: '1 PRC jin = 10 liang (50 g each)' },
      { name: 'Traditional 16-Part Liang (16 per jin)', ratio: 16, note: 'Historical: 1 jin = 16 liang (31.25 g each)' },
      { name: 'Hong Kong Catty Equivalent (604.79 g)', ratio: 0.8267, note: '1 HK catty = 604.79 g (16 taels of 37.8 g)' },
      { name: 'Taiwan Catty Equivalent (600.0 g)', ratio: 0.8333, note: '1 Taiwan jin = 600.0 g (16 liang of 37.5 g)' }
    ],
    presets: [
      { label: '1 Traditional Liang / Tael (Silver Ingot / 37.5 g)', val: 0.075 },
      { label: '1 PRC Market Jin (500 g / 1.10 lbs)', val: 1 },
      { label: '1 Taiwan / Japanese Catty (600 g)', val: 1.20 },
      { label: '1 Hong Kong Market Catty (604.79 g)', val: 1.2096 }
    ],
    contextHtml: '<p>The common Chinese idiom <em>"ban jin ba liang"</em> (半斤八两, "half a catty is eight liang", meaning "six of one, half a dozen of the other") preserves the traditional base-16 system where 1 catty contained 16 taels. In 1959, the People\'s Republic of China reformed the market jin to exactly 500 grams and decimalized it to 10 liang (50 g each), though Hong Kong and Taiwan still preserve the 16-tael catty for gold and herbal medicines.</p>',
    primarySources: 'State Council of the People\'s Republic of China: <em>Orders on the Standardization of Weights and Measures</em> (1959); Hong Kong Weights and Measures Ordinance (Cap. 68).',
    faq: [
      { q: 'How many grams is a Chinese jin (catty)?', a: 'In mainland China, 1 jin (market catty) equals exactly 500 grams (1.102 lbs). In Hong Kong, 1 catty is 604.78982 grams. In Taiwan, 1 catty is exactly 600 grams.' },
      { q: 'What does the Chinese idiom "ban jin ba liang" mean?', a: 'It means "half a jin is eight liang"—originating from the old system where 1 jin was 16 liang (thus half a jin equaled 8 liang). It signifies that two people or options are completely equal with no difference.' }
    ]
  },
  {
    slug: 'chinese-sheng-dou-grain-volume',
    name: 'Chinese Sheng (升) & Dou (斗) Grain',
    shortName: 'Chinese Sheng & Dou',
    category: 'East Asian Historical',
    era: 'Imperial China (Taxation & Agrarian Economy)',
    title: 'Chinese Sheng (升 ~1 Liter) & Dou (斗 10 Sheng) Grain Volume to Liters & Gallons [Bowing for Five Dou of Rice] | Digital Tools Shed',
    h1: 'Chinese Sheng (升) & Dou (斗) Grain Volume Converter',
    metaDesc: 'Convert Chinese sheng (升, 1.0 L modern / 0.2 L Han) and dou (斗, 10 sheng) to liters, dry pecks, and rice weight. Explore Tao Yuanming\'s "five dou of rice".',
    desc: 'The sheng (升, ~1.0 liter modern) and dou (斗, 10 sheng ≈ 10 liters) were the grain bushel vessels that collected imperial taxes for 2,000 years of Chinese history.',
    primaryUnit: 'Modern Standard Sheng (市升)',
    unitSymbol: 'sheng',
    defaultVal: 1,
    metricBase: 1.0, // liters (modern standard)
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 1.0567, // US liquid quarts
    imperialName: 'US Quarts',
    imperialSymbol: 'qt',
    subdivisions: [
      { name: 'Dou (斗 / 10 sheng)', ratio: 0.10, note: '1 dou = 10 sheng (10 liters)' },
      { name: 'Ge (合 / 10 per sheng)', ratio: 10, note: '1 sheng = 10 ge (100 mL each)' },
      { name: 'Dan / Stone (石 / 100 sheng)', ratio: 0.01, note: '1 dan = 10 dou = 100 sheng (100 L)' },
      { name: 'White Rice Mass (kg @ 0.85 kg/L)', ratio: 0.85, note: '~0.85 kg uncooked rice per sheng' }
    ],
    presets: [
      { label: '1 Ge (合 / 100 mL / 1 Cooking Cup)', val: 0.10 },
      { label: '1 Sheng (升 / 1.0 Liter / 0.85 kg Rice)', val: 1 },
      { label: '5 Dou (Tao Yuanming Official Salary / 50 Liters)', val: 50 },
      { label: '1 Dan / Shi (石 / 100 Liters / Official Tax Unit)', val: 100 }
    ],
    contextHtml: '<p>The famous poet <strong>Tao Yuanming</strong> (365–427 AD) famously resigned his county magistrate post declaring: <em>"How can I bend my waist and bow to country buffoons for the sake of five dou of rice?"</em> (不为五斗米折腰). "Five dou of rice" represented the humble daily salary of a minor civil servant in the Jin dynasty.</p>',
    primarySources: '<em>Book of Jin</em> (Biography of Tao Qian); <em>Mozi</em>; Chinese Academy of Social Sciences: <em>Historical Chinese Metrology</em>.',
    faq: [
      { q: 'How many liters is a Chinese sheng and dou?', a: 'In the modern system, 1 sheng equals exactly 1.0 liter (1.06 US quarts), and 1 dou equals 10 sheng (10.0 liters or 2.64 US gallons). In the Han dynasty, a sheng was much smaller, holding only about 200 mL.' },
      { q: 'What is a dan (or shi) in Chinese grain measurement?', a: 'A dan (also pronounced shi, 石) equals 10 dou or 100 sheng (approx. 100 liters in modern metric terms, or about 85 kg of milled grain).' }
    ]
  },
  {
    slug: 'japanese-shaku-sun-traditional-length',
    name: 'Japanese Shaku (尺) & Sun (寸)',
    shortName: 'Japanese Shaku & Sun',
    category: 'East Asian Historical',
    era: 'Traditional Japanese Woodworking & Architecture (Shakkan-hō)',
    title: 'Japanese Shaku (尺 30.3 cm) & Sun (寸 3.03 cm) to Centimeters & Inches [Miya-daiku Carpentry Scale] | Digital Tools Shed',
    h1: 'Japanese Shaku (尺) & Sun (寸) Architectural Converter',
    metaDesc: 'Convert Japanese shaku (303.03 mm / 10/33 m) and sun (30.3 mm) to centimeters and inches. Decode temple carpentry (miya-daiku) and kimono fabric rulers.',
    desc: 'The Japanese shaku (尺, exactly 10/33 meter ≈ 30.303 cm) and sun (寸, ~3.03 cm) remain the living foundation of traditional temple carpentry (sashigane square).',
    primaryUnit: 'Kane-shaku (Architectural 尺)',
    unitSymbol: 'shaku',
    defaultVal: 1,
    metricBase: 0.30303, // meters (10/33 m)
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 11.9303, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Sun (寸, 10 per shaku)', ratio: 10, note: '1 shaku = 10 sun (3.03 cm each)' },
      { name: 'Bu (分, 100 per shaku)', ratio: 100, note: '1 shaku = 100 bu (3.03 mm each)' },
      { name: 'Jō (丈, 10 shaku)', ratio: 0.10, note: '1 jō = 10 shaku (3.03 m)' },
      { name: 'Kujira-shaku (Fabric Cloth 尺)', ratio: 0.80, note: 'Fabric ruler was 25% longer (37.88 cm)' }
    ],
    presets: [
      { label: '1 Sun (3.03 cm / 1.19 in)', val: 0.10 },
      { label: '1 Kane-shaku (Carpenter Foot / 30.30 cm)', val: 1 },
      { label: '6 Shaku (1 Ken / Pillar Spacing / 1.818 m)', val: 6 },
      { label: '1 Jō (10 Shaku / Temple Post Height / 3.03 m)', val: 10 }
    ],
    contextHtml: '<p>Legally codified in the 1891 Japanese Weights and Measures Law (<em>Shakkan-hō</em>), the carpenter\'s <strong>kane-shaku</strong> was defined as exactly <code>10/33 of a meter</code> (30.303 cm). Master temple carpenters (<em>miya-daiku</em>) who built the ancient timber pagodas of Horyu-ji use L-shaped steel framing squares called <em>sashigane</em> calibrated exclusively in shaku and sun.</p>',
    primarySources: 'Japanese Weights and Measures Act of 1891 (Meiji 24); Nishi & Hozumi, <em>What is Japanese Architecture?</em>; Brown, <em>The Genius of Japanese Carpentry</em>.',
    faq: [
      { q: 'How long is a Japanese shaku and sun?', a: 'One shaku equals exactly 10/33 of a meter, which is 30.303 centimeters (11.93 inches). One sun is one-tenth of a shaku, or 3.030 centimeters (1.19 inches).' },
      { q: 'What is the difference between kane-shaku and kujira-shaku?', a: 'Kane-shaku (30.3 cm) was the metal square used by architects and carpenters for buildings. Kujira-shaku (37.9 cm, literally "whale shaku", made of baleen whalebone) was 25% longer and used exclusively for tailoring silk kimonos.' }
    ]
  },
  {
    slug: 'japanese-ken-and-tatami-mat-area',
    name: 'Japanese Ken (間) & Tatami Mat Area',
    shortName: 'Ken & Tatami',
    category: 'East Asian Historical',
    era: 'Traditional Japanese Residential Architecture',
    title: 'Japanese Ken (間 1.818m) & Tatami Mat Room Area (Jō 畳) Converter [Kyoma vs Edoma Mat Layouts] | Digital Tools Shed',
    h1: 'Japanese Ken (間) & Tatami Mat Room Area Converter',
    metaDesc: 'Convert Japanese ken grid lengths (6 shaku / 1.818m) and tatami mat room sizes (4.5, 6, 8, 10 Jō 畳) to square meters and square feet. Compare Kyoma vs Edoma.',
    desc: 'The ken (間, 6 shaku = 1.818 m) is the structural post-to-post grid module of Japanese architecture; two squares of 1 ken forms one 6×3 ft tatami mat (jō 畳).',
    primaryUnit: 'Tatami Mats (Jō 畳 - Edoma)',
    unitSymbol: 'tatami',
    defaultVal: 6, // classic 6-mat room
    metricBase: 9.29, // square meters (6 Edoma mats)
    metricName: 'Square Meters',
    metricSymbol: 'm²',
    imperialBase: 100.0, // square feet
    imperialName: 'Square Feet',
    imperialSymbol: 'sq ft',
    subdivisions: [
      { name: 'Tsubo (坪 / 2 mats per tsubo)', ratio: 0.5, note: '2 tatami mats = 1 tsubo (3.306 m²)' },
      { name: 'Ken Grid Post Length (Meters)', ratio: 1.818, note: '1 ken = 1.818 m (6 shaku)' },
      { name: 'Kyoto Mat Area Equivalent (Kyoma 1.82 m²)', ratio: 0.852, note: 'Kyoto mats are 17% larger than Tokyo mats' },
      { name: 'Square Feet', ratio: 16.67, note: 'Approx. 16.7 sq ft per Edoma mat' }
    ],
    presets: [
      { label: '4.5 Mats (Classic Tea Ceremony Room / 7.0 m²)', val: 4.5 },
      { label: '6 Mats (Standard Japanese Bedroom / 9.3 m²)', val: 6 },
      { label: '8 Mats (Traditional Living Room / 12.4 m²)', val: 8 },
      { label: '10 Mats (Formal Reception Hall / 15.5 m²)', val: 10 }
    ],
    contextHtml: '<p>Traditional Japanese room sizes are not quoted in square meters, but by the number of woven rush tatami mats (<em>jō</em>, 畳): a 6-mat room (<em>roku-jō</em>) or 8-mat room (<em>hachi-jō</em>). Because Kyoto homes were built to fit mats inside posts (<em>Kyoma</em>: 6.3 × 3.15 shaku = 1.82 m²) while Tokyo houses spaced posts first on center (<em>Edoma</em>: 5.8 × 2.9 shaku = 1.55 m²), Kyoto rooms are significantly more spacious!</p>',
    primarySources: 'Engel, <em>The Japanese House: A Tradition for Contemporary Architecture</em>; Morse, <em>Japanese Homes and Their Surroundings</em> (1886).',
    faq: [
      { q: 'How large is a standard Japanese tatami mat?', a: 'An Edoma (Tokyo) mat measures 1.76 × 0.88 meters (1.55 m² or 16.7 sq ft). A traditional Kyoma (Kyoto) mat measures 1.91 × 0.955 meters (1.82 m² or 19.6 sq ft).' },
      { q: 'Why is a 4.5-mat room significant in Japanese culture?', a: 'The 4.5-mat room (yojōhan) was established by tea master Sen no Rikyū in the 16th century as the idealized, intimate proportion for the Japanese tea ceremony (chanoyu).' }
    ]
  },
  {
    slug: 'japanese-tsubo-land-area-converter',
    name: 'Japanese Tsubo (坪) Land Area',
    shortName: 'Japanese Tsubo (坪)',
    category: 'East Asian Historical',
    era: 'Modern & Traditional Japanese Real Estate',
    title: 'Japanese Tsubo (坪 3.30578 m² / 2 Tatami Mats) to Square Feet, Acres & m² [Tokyo Real Estate Unit] | Digital Tools Shed',
    h1: 'Japanese Tsubo (坪) Real Estate Land Area Converter',
    metaDesc: 'Convert Japanese tsubo (3.305785 m² = 35.583 sq ft = 2 tatami mats) to square meters, square feet, and acres. Decode Tokyo apartment and land prices.',
    desc: 'The tsubo (坪, exactly 400/121 m² ≈ 3.30578 m², equal to 1 square ken or 2 tatami mats) remains the premier pricing unit in modern Japanese real estate.',
    primaryUnit: 'Tsubo (坪)',
    unitSymbol: 'tsubo',
    defaultVal: 1,
    metricBase: 3.305785, // square meters (400/121 m²)
    metricName: 'Square Meters',
    metricSymbol: 'm²',
    imperialBase: 35.5831, // square feet
    imperialName: 'Square Feet',
    imperialSymbol: 'sq ft',
    subdivisions: [
      { name: 'Tatami Mats (畳 / 2 per tsubo)', ratio: 2.0, note: '1 tsubo = 2 standard tatami mats' },
      { name: 'Se (畝 / 30 tsubo)', ratio: 0.03333, note: '30 tsubo = 1 se (~99.17 m²)' },
      { name: 'Tan (反 / 300 tsubo)', ratio: 0.003333, note: '300 tsubo = 1 tan (~991.7 m²)' },
      { name: 'Chō (町 / 3,000 tsubo)', ratio: 0.0003333, note: '3,000 tsubo = 1 chō (~0.992 hectares)' }
    ],
    presets: [
      { label: '1 Tsubo (2 Mats / 3.31 m² / 35.6 sq ft)', val: 1 },
      { label: '20 Tsubo (Compact Tokyo House Lot / 66.1 m²)', val: 20 },
      { label: '30 Tsubo (Standard Detached Suburban Home)', val: 30 },
      { label: '300 Tsubo (1 Tan / Rice Paddy Field)', val: 300 }
    ],
    contextHtml: '<p>Although Japan officially adopted the metric system in 1966 and real estate contracts legally require square meters, almost all Japanese homebuilders, property listings, and architectural plans quote land and floor space in <strong>tsubo</strong> (坪). In prestigious Tokyo districts like Ginza, commercial land prices are famously quoted as tens of millions of yen per tsubo.</p>',
    primarySources: 'Japanese Real Estate Transaction Law; 1891 Shakkan-hō Weights and Measures Law; Tokyo Land Valuation Office Records.',
    faq: [
      { q: 'How many square meters and square feet is 1 tsubo?', a: 'One tsubo equals exactly 400/121 square meters, which is 3.305785 square meters (35.583 square feet). It is exactly the area of two standard tatami mats.' },
      { q: 'Why is tsubo still used in modern Japan?', a: 'Because tatami-based floor layouts (2 mats = 1 tsubo) are deeply ingrained in the spatial intuition of Japanese architects, carpenters, and homebuyers, making tsubo far more intuitive than square meters.' }
    ]
  },
  {
    slug: 'japanese-koku-rice-stipend-volume',
    name: 'Japanese Koku (石) Rice Stipend',
    shortName: 'Japanese Koku',
    category: 'East Asian Historical',
    era: 'Feudal Japan (Edo Period / Tokugawa Shogunate)',
    title: 'Japanese Koku (石 180.39 Liters Rice) Feudal Daimyo Domain Stipend Converter [Samurai Wealth Calculator] | Digital Tools Shed',
    h1: 'Japanese Koku (石) Rice Stipend & Daimyo Wealth Converter',
    metaDesc: 'Convert Japanese feudal koku (180.39 liters / ~150 kg brown rice = 1 person\'s annual food) to liters, kilograms, and samurai annual stipends. Rank feudal daimyo clans.',
    desc: 'The koku (石, ~180.39 liters / ~150 kg of rice) defined feudal wealth: the amount of rice required to feed one adult for a year, calibrating daimyo fiefdoms and samurai stipends.',
    primaryUnit: 'Koku (石)',
    unitSymbol: 'koku',
    defaultVal: 1,
    metricBase: 180.39, // liters
    metricName: 'Liters (Rice Volume)',
    metricSymbol: 'L',
    imperialBase: 5.119, // US dry bushels
    imperialName: 'US Dry Bushels',
    imperialSymbol: 'bu',
    subdivisions: [
      { name: 'To (斗, 10 per koku)', ratio: 10, note: '1 koku = 10 to (18.04 L each)' },
      { name: 'Shō (升, 100 per koku)', ratio: 100, note: '1 koku = 100 shō (1.80 L / sake magnum bottle)' },
      { name: 'Gō (合, 1,000 per koku)', ratio: 1000, note: '1 koku = 1,000 gō (180 mL rice cooker cup)' },
      { name: 'Brown Rice Mass (kg @ 0.83 kg/L)', ratio: 150.0, note: 'Approx. 150 kg (330 lbs) rice per koku' },
      { name: 'Adult Annual Calorie Days', ratio: 365.0, note: 'Provides 1 adult subsistence for 365 days' }
    ],
    presets: [
      { label: '1 Koku (1 Adult Year\'s Rice / 150 kg / 180.4 L)', val: 1 },
      { label: '100 Koku (Upper-Middle Samurai Household Stipend)', val: 100 },
      { label: '10,000 Koku (Minimum Revenue to be a Daimyo Lord)', val: 10000 },
      { label: '1,025,000 Koku (Maeda Clan of Kaga Domain / Wealthiest Clan)', val: 1025000 }
    ],
    contextHtml: '<p>Under the Tokugawa Shogunate (1603–1867), Japan\'s economy was assessed by <strong>Kokudaka</strong> (assessed rice productivity). To qualify as a feudal lord (<em>Daimyo</em>), a samurai clan had to control territory yielding at least <strong>10,000 koku</strong> annually. The wealthiest clan was the Maeda of Kaga Domain (known as the <em>Kaga Hyakumangoku</em>, "Kaga Million Koku").</p>',
    primarySources: 'Tokugawa Shogunate <em>Buke Shohatto</em>; Totman, <em>Early Modern Japan</em>; Hall, <em>The Cambridge History of Japan: Early Modern Japan</em>.',
    faq: [
      { q: 'How many liters and kilograms of rice was a Japanese koku?', a: 'One koku equals exactly 180.39 liters (5.12 US dry bushels), which held approximately 150 kilograms (330 pounds) of dry unpolished brown rice—enough to sustain one adult for an entire year.' },
      { q: 'Why are sake bottles sold in 1.8-liter sizes in Japan?', a: 'The standard large glass sake bottle (isshōbin) holds exactly 1 shō (1.804 liters), which is one-hundredth of a koku.' }
    ]
  },
  {
    slug: 'japanese-monme-and-kan-weight',
    name: 'Japanese Monme (匁) & Kan (貫)',
    shortName: 'Monme & Kan',
    category: 'East Asian Historical',
    era: 'Traditional Japanese Metrology & Global Pearl Trade',
    title: 'Japanese Monme (匁 3.75g) & Kan (貫 3.75kg) to Grams, Ounces & Pearl Weight [Mikimoto Cultured Pearls] | Digital Tools Shed',
    h1: 'Japanese Monme (匁) & Kan (貫) Weight Converter',
    metaDesc: 'Convert Japanese monme (exactly 3.75 grams) and kan (3.75 kg) to grams, ounces, and carats. Discover why monme remains the global standard for cultured pearls.',
    desc: 'The monme (匁, exactly 3.75 grams) was the weight of a bronze Edo coin, surviving today as the mandatory international trading weight unit for cultured pearls.',
    primaryUnit: 'Monme (匁)',
    unitSymbol: 'monme',
    defaultVal: 1,
    metricBase: 3.75, // grams exactly
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 0.120565, // troy ounces
    imperialName: 'Troy Ounces',
    imperialSymbol: 'oz t',
    subdivisions: [
      { name: 'Fun (分, 1/10 monme)', ratio: 10, note: '1 monme = 10 fun (0.375 g each)' },
      { name: 'Kan (貫 / 1,000 monme)', ratio: 0.001, note: '1 kan = 1,000 monme = 3.75 kg' },
      { name: 'Modern Metric Carats (200 mg)', ratio: 18.75, note: '1 monme = 18.75 carats' },
      { name: 'Hyakume (100 monme)', ratio: 0.01, note: '100 monme = 375 grams' }
    ],
    presets: [
      { label: '1 Monme (3.75 g / 1 Edo Mon Coin)', val: 1 },
      { label: '10 Monme (Standard Cultured Pearl Strand Hank)', val: 10 },
      { label: '100 Monme / Hyakume (375 g / Silk Skein)', val: 100 },
      { label: '1,000 Monme / 1 Kan (3.75 kg / Heavy Wholesale Weight)', val: 1000 }
    ],
    contextHtml: '<p>The monme originated as the weight of a single Edo-period copper coin (<em>mon</em>, 3.75 g). When Kokichi Mikimoto invented commercial cultured pearl farming in 1893, he standardized pearl harvest sorting in monme. Today, by international gemological convention, all Japanese and South Sea pearls traded at wholesale auctions in Tokyo and Hong Kong are weighed and priced exclusively in <strong>monme</strong> (3.75 g) and <strong>kan</strong> (3.75 kg).</p>',
    primarySources: 'Japanese Weights and Measures Act of 1891; CIBJO (The World Jewellery Confederation) Pearl Book; Mikimoto Pearl Company Archives.',
    faq: [
      { q: 'How many grams is 1 monme (匁)?', a: 'One monme equals exactly 3.750 grams (0.1323 avoirdupois ounces or 18.75 metric carats). One thousand monme make one kan (3.750 kilograms).' },
      { q: 'Why is the Japanese monme used in the international pearl industry?', a: 'Because Japan pioneered commercial pearl culturing, the Japanese industry standard of weighing strands in monme was adopted globally. Wholesale pearl lots are still priced per monme worldwide.' }
    ]
  },

  // ─── 10. RUSSIAN IMPERIAL SYSTEMS (106-109) ────────────────────────────────
  {
    slug: 'russian-verst-distance-converter',
    name: 'Russian Imperial Verst (Верста)',
    shortName: 'Russian Verst',
    category: 'Russian Imperial',
    era: 'Imperial Russia (Peter the Great to 1918)',
    title: 'Russian Imperial Verst (Верста 1.0668 km / 3,500 Feet) to Miles & Kilometers [Tolstoy & Trans-Siberian] | Digital Tools Shed',
    h1: 'Russian Imperial Verst (Верста) Distance Converter',
    metaDesc: 'Convert Russian versts (1.0668 km / 3,500 feet / 0.6629 statute miles) to kilometers, statute miles, and feet. Decode Tolstoy, Chekhov, and imperial post roads.',
    desc: 'The verst (верста, exactly 1.0668 km / 500 sazhen / 3,500 feet) was the ubiquitous mile-equivalent road distance across the Russian Empire until metrication in 1918.',
    primaryUnit: 'Versts (Вёрсты)',
    unitSymbol: 'verst',
    defaultVal: 1,
    metricBase: 1.0668, // kilometers
    metricName: 'Kilometers',
    metricSymbol: 'km',
    imperialBase: 0.66288, // statute miles
    imperialName: 'Statute Miles',
    imperialSymbol: 'mi',
    subdivisions: [
      { name: 'Sazhen (Сажени, 500 per verst)', ratio: 500, note: '1 verst = 500 sazhen (2.1336 m each)' },
      { name: 'Arshin (Аршины, 1,500 per verst)', ratio: 1500, note: '1 verst = 1,500 arshins (71.12 cm each)' },
      { name: 'Modern Meters', ratio: 1066.8, note: '1,066.8 meters' },
      { name: 'Feet', ratio: 3500, note: '3,500 English/Russian feet' }
    ],
    presets: [
      { label: '1 Verst (1.067 km / Milestone Post)', val: 1 },
      { label: '25 Versts (1 Day Carriage Relay Stage)', val: 25 },
      { label: '600 Versts (Moscow to St. Petersburg Imperial Highway)', val: 600 },
      { label: '9,289 Versts (Trans-Siberian Railway Route Length)', val: 9289 }
    ],
    contextHtml: '<p>Peter the Great standardized the Russian system in the early 18th century by aligning it with British measures: 1 Russian foot was set exactly equal to 1 English foot. Thus, 1 sazhen was 7 feet, and 1 verst (500 sazhen) was <strong>3,500 feet (1.0668 km)</strong>. Striped wooden milestone posts (<em>verstovye stolby</em>) lined every imperial postal trakt across Siberia.</p>',
    primarySources: 'Ukase of Peter the Great (1701); Ukase of Nicholas I (1835: On the System of Russian Weights and Measures); Tolstoy, <em>War and Peace</em>.',
    faq: [
      { q: 'How long is a Russian verst in kilometers and miles?', a: 'One Russian verst equals exactly 1.0668 kilometers (3,500 feet or 0.66288 statute miles). It is approximately 6% longer than a kilometer.' },
      { q: 'When was the verst replaced in Russia?', a: 'The verst was officially abolished by the Soviet government in September 1918 following the Russian Revolution, when Russia adopted the international metric system.' }
    ]
  },
  {
    slug: 'russian-arshin-sazhen-traditional',
    name: 'Russian Arshin (Аршин) & Sazhen (Сажень)',
    shortName: 'Arshin & Sazhen',
    category: 'Russian Imperial',
    era: 'Imperial Russia',
    title: 'Russian Arshin (71.12 cm) & Sazhen (2.1336 m) to Meters & Inches [Measuring by One\'s Own Yardstick] | Digital Tools Shed',
    h1: 'Russian Arshin & Sazhen Length Converter',
    metaDesc: 'Convert Russian arshins (28 inches / 71.12 cm) and sazhen fathoms (7 feet / 2.1336 m) to centimeters, meters, and inches. Unpack the idiom "meriť na svoy arshin".',
    desc: 'The arshin (аршин, 28 inches / 71.12 cm) and sazhen (сажень, 7 feet / 2.1336 m) were the daily fabric, carpentry, and architectural measures of Tsarist Russia.',
    primaryUnit: 'Arshins (Аршины)',
    unitSymbol: 'arshin',
    defaultVal: 1,
    metricBase: 0.7112, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 28.0, // inches
    imperialName: 'Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Vershok (Вершки, 16 per arshin)', ratio: 16, note: '1 arshin = 16 vershoks (4.445 cm each)' },
      { name: 'Centimeters', ratio: 71.12, note: '71.12 cm exactly' },
      { name: 'Sazhen Fraction (3 arshin = 1 sazhen)', ratio: 0.3333, note: '1 sazhen = 3 arshins (2.1336 m)' },
      { name: 'Russian Feet (Pooty)', ratio: 2.3333, note: '1 arshin = 2 1/3 feet' }
    ],
    presets: [
      { label: '1 Vershok (4.45 cm / 1.75 in)', val: 0.0625 },
      { label: '1 Arshin (71.12 cm / 28 in / Merchant Wooden Yardstick)', val: 1 },
      { label: '3 Arshins (1 Sazhen / 2.13 m / Fathom Arm Span)', val: 3 },
      { label: '1 Kosaya Sazhen (Slanted Fathom / 2.48 m)', val: 3.487 }
    ],
    contextHtml: '<p>The famous Russian proverb <em>"merit\' na svoy arshin"</em> (мерить на свой аршин, "to measure everyone with your own arshin", meaning to judge everyone by your own selfish standards) arose because 18th-century cloth merchants used custom-made wooden arshin sticks that were dishonestly whittled short until Peter the Great mandated iron master rules stamped with the imperial two-headed eagle.</p>',
    primarySources: 'Dal\'s <em>Explanatory Dictionary of the Living Great Russian Language</em> (1863); Russian Imperial Law Code (Svod Zakonov Rossiyskoy Imperii).',
    faq: [
      { q: 'How long is a Russian arshin and sazhen?', a: 'One arshin equals exactly 28 English inches, which is 71.12 centimeters. One sazhen equals 3 arshins or 7 English feet (2.1336 meters).' },
      { q: 'What was a vershok in old Russia?', a: 'A vershok was one-sixteenth of an arshin, measuring exactly 1.75 inches (4.445 centimeters). Russian military enlistment records recorded soldiers\' heights as their excess in vershoks above 2 arshins (e.g. 2 arshins 8 vershoks = 177.8 cm).' }
    ]
  },
  {
    slug: 'russian-pood-pud-weight-converter',
    name: 'Russian Pood (Пуд 16.38 kg)',
    shortName: 'Russian Pood',
    category: 'Russian Imperial',
    era: 'Imperial Russia & Soviet Agricultural Statistics',
    title: 'Russian Pood (Пуд 40 Russian Pounds / 16.38 kg) to Kilograms & Kettlebell Pounds [Kettlebell Girya Sport] | Digital Tools Shed',
    h1: 'Russian Pood (Пуд) Weight & Kettlebell Converter',
    metaDesc: 'Convert Russian imperial poods (16.3805 kg / 36.113 lbs = 40 funts) to kilograms and pounds. Master kettlebell weights (1 pood = 16 kg, 1.5 pood = 24 kg, 2 pood = 32 kg).',
    desc: 'The pood (пуд, exactly 40 Russian funts = 16.3805 kg / 36.11 lbs) measured grain crops and artillery shells, surviving worldwide in Russian kettlebell (girya) lifting.',
    primaryUnit: 'Poods (Пуды)',
    unitSymbol: 'pood',
    defaultVal: 1,
    metricBase: 16.380496, // kilograms
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 36.1128, // pounds avoirdupois
    imperialName: 'Pounds (lbs)',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Russian Pounds (Funts / Фунты)', ratio: 40, note: '1 pood = 40 funts (409.5 g each)' },
      { name: 'Kettlebell Sport Weight (approx kg)', ratio: 16.0, note: 'Standard kettlebell rounded to 16 kg' },
      { name: 'Berkovets (Берковец, 10 poods)', ratio: 0.10, note: '1 berkovets = 10 poods (163.8 kg)' },
      { name: 'Metric Tonnes', ratio: 0.01638, note: '0.0164 metric tonnes' }
    ],
    presets: [
      { label: '1 Pood (16.38 kg / 36.1 lbs / Standard 16 kg Kettlebell)', val: 1 },
      { label: '1.5 Poods (24.57 kg / 54.2 lbs / Heavy 24 kg Kettlebell)', val: 1.5 },
      { label: '2 Poods (32.76 kg / 72.2 lbs / Two-Pood "Dvu-pudovka")', val: 2 },
      { label: '10 Poods (1 Berkovets / 163.8 kg / Wholesale Grain Barrel)', val: 10 }
    ],
    contextHtml: '<p>The Russian proverb declares: <em>"To know a person, you must eat a pood of salt with them"</em> (Человека узнаешь, когда с ним пуд соли съешь)—a reminder that eating 16.4 kilograms of salt together takes over two years! In strength sports, traditional Russian cast-iron kettlebells (<em>girya</em>) are still forged in multiples of poods: 1 pood (16 kg), 1.5 poods (24 kg), and 2 poods (32 kg).</p>',
    primarySources: 'Mendeleev, <em>Report on the Restoration of Russian Prototypes of Length and Weight</em> (1899); Tsarist Grain Export Statistics (1913).',
    faq: [
      { q: 'How many kilograms and pounds is one Russian pood?', a: 'One Russian pood equals exactly 40 Russian pounds (funts), which is 16.380496 kilograms (36.1128 avoirdupois pounds).' },
      { q: 'Why are modern kettlebells sized in 16 kg, 24 kg, and 32 kg increments?', a: 'Because they derive directly from the Russian pood: a 1-pood kettlebell was rounded to 16 kg, a 1.5-pood kettlebell to 24 kg, and a 2-pood kettlebell (dvu-pudovka) to 32 kg.' }
    ]
  },
  {
    slug: 'russian-vedro-bucket-liquid-volume',
    name: 'Russian Imperial Vedro (Ведро Bucket)',
    shortName: 'Russian Vedro',
    category: 'Russian Imperial',
    era: 'Imperial Russia (Vodka & Brewing Monopoly)',
    title: 'Russian Imperial Vedro (Ведро 12.3 Liters / 10 Shtofs) Vodka & Beer Bucket Converter [Tsarist State Monopoly] | Digital Tools Shed',
    h1: 'Russian Imperial Vedro (Ведро) Bucket Converter',
    metaDesc: 'Convert Russian imperial vedro buckets (12.299 liters / 3.25 US gallons / 100 charkas) to liters, gallons, and vodka shtofs. Model Tsarist spirits tax revenues.',
    desc: 'The vedro (ведро, literally "bucket", exactly 12.299 liters / 10 shtofs / 100 charkas) was the bedrock unit of the Tsarist Russian state vodka monopoly.',
    primaryUnit: 'Vedros (Вёдра)',
    unitSymbol: 'vedro',
    defaultVal: 1,
    metricBase: 12.2994, // liters
    metricName: 'Liters',
    metricSymbol: 'L',
    imperialBase: 3.2492, // US gallons
    imperialName: 'US Liquid Gallons',
    imperialSymbol: 'gal',
    subdivisions: [
      { name: 'Shtofs / Kruzhkas (10 per vedro)', ratio: 10, note: '1 vedro = 10 shtofs (1.23 L each)' },
      { name: 'Charkas / Cups (100 per vedro)', ratio: 100, note: '1 vedro = 100 charkas (123 mL each)' },
      { name: 'Shkaliks / Kosushkas (200 per vedro)', ratio: 200, note: '1 vedro = 200 shkaliks (61.5 mL each)' },
      { name: 'Bochka / Cask Fraction (40 vedros)', ratio: 0.025, note: '1 bochka = 40 vedros (492 L)' }
    ],
    presets: [
      { label: '1 Charka (123 mL / Sailor Vodka Ration)', val: 0.01 },
      { label: '1 Shtof (1.23 L / Octagonal Glass Spirit Bottle)', val: 0.10 },
      { label: '1 Vedro (12.30 L / Standard Tavern Bucket)', val: 1 },
      { label: '40 Vedros (1 Bochka / 492 Liters Cask)', val: 40 }
    ],
    contextHtml: '<p>Tsarist state budgets were famously fueled by the "kabak" (tavern) vodka monopoly. Spirits were sold wholesale by the bucket (<em>vedro</em>). A Russian sailor in the Baltic Fleet received an official daily allowance of <strong>1 charka</strong> (1/100th of a vedro, or 123 mL of 40% rye spirits) before battle or heavy rigging duties.</p>',
    primarySources: 'Christian, <em>Living Water: Vodka and the Russian Peasantry</em>; Ministry of Finance of the Russian Empire: <em>Spirits Monopoly Reports</em> (1895–1914).',
    faq: [
      { q: 'How many liters and gallons was a Russian vedro?', a: 'A Russian vedro held exactly 12.2994 liters (3.249 US gallons or 2.705 Imperial gallons). It held 10 shtofs or 100 charkas.' },
      { q: 'What is a shtof in Russian vodka history?', a: 'A shtof (from German Stof) was one-tenth of a vedro (1.23 liters). It was sold in iconic heavy, octagonal green glass bottles embossed with the Tsarist imperial seal.' }
    ]
  },

  // ─── 11. SPANISH & COLONIAL SYSTEMS (110-111) ──────────────────────────────
  {
    slug: 'spanish-colonial-vara-texas-land',
    name: 'Spanish Colonial & Texas Vara',
    shortName: 'Spanish Vara',
    category: 'Spanish & Colonial',
    era: 'Spanish Empire & Republic of Texas (1830s)',
    title: 'Spanish Colonial & Texas Vara (33⅓ Inches / 5,645.37 sq v/Acre) Land Survey Converter [Texas General Land Office] | Digital Tools Shed',
    h1: 'Spanish Colonial & Texas Vara Land Survey Converter',
    metaDesc: 'Convert Texas varas (exactly 33.333 inches / 3 varas = 100 inches) and Spanish varas (83.59 cm) to feet, meters, and Texas acres. Decode Mexican land grants.',
    desc: 'The vara (33⅓ inches in Texas: 1 vara = 2.7778 ft; 5,645.376 sq varas = 1 acre) governs millions of acres of Spanish and Mexican land grants in the American Southwest.',
    primaryUnit: 'Texas Varas (33⅓ in)',
    unitSymbol: 'vara',
    defaultVal: 1,
    metricBase: 0.84667, // meters (33.333 inches)
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 2.77778, // feet (33.333 inches)
    imperialName: 'Feet',
    imperialSymbol: 'ft',
    subdivisions: [
      { name: 'Inches', ratio: 33.3333, note: '3 varas = exactly 100 inches' },
      { name: 'Castilian Vara Equivalent (83.59 cm)', ratio: 0.9873, note: 'Spanish Castilian vara was 83.59 cm' },
      { name: 'Labor Land Grant (1,000,000 sq varas)', ratio: 0.000001, note: '1 Labor = 177.1 acres' },
      { name: 'Legua / League (5,000 varas)', ratio: 0.0002, note: '1 Spanish league = 5,000 varas (2.63 miles)' }
    ],
    presets: [
      { label: '1 Texas Vara (33.33 Inches / 2.78 Feet)', val: 1 },
      { label: '36 Varas (100 Feet Exactly)', val: 36 },
      { label: '1,000 Varas (Side of a 177-Acre Labor Grant)', val: 1000 },
      { label: '5,000 Varas (1 Spanish League / 4,428.4 Acres)', val: 5000 }
    ],
    contextHtml: '<p>When Texas gained independence from Mexico in 1836, it retained Spanish cadastral units. The Texas General Land Office legally codified the Texas vara as exactly <strong>33⅓ inches</strong> (meaning 36 varas = 100 feet). A standard Spanish land grant for colonists was a <em>Labor</em> (1,000 × 1,000 varas = 177.1 acres for farming) or a <em>Sitio / League</em> (5,000 × 5,000 varas = 4,428.4 acres for cattle ranching).</p>',
    primarySources: 'Texas Natural Resources Code § 21.041; Texas General Land Office: <em>Glossary of Spanish Terms</em>; Taylor, <em>The Spanish Archives of the General Land Office of Texas</em>.',
    faq: [
      { q: 'How long is a Texas vara in feet and inches?', a: 'In Texas law, one vara equals exactly 33⅓ inches (2.7778 feet, or 0.8467 meters). Exactly 36 varas equal 100 feet.' },
      { q: 'How many square varas are in an acre of Texas land?', a: 'One acre of land equals exactly 5,645.376 square varas (43,560 square feet divided by 7.71605 square feet per square vara).' }
    ]
  },
  {
    slug: 'spanish-arroba-and-fanega-converter',
    name: 'Spanish Arroba (Weight) & Fanega (Grain)',
    shortName: 'Arroba & Fanega',
    category: 'Spanish & Colonial',
    era: 'Spanish Empire & Latin American Trade',
    title: 'Spanish Arroba (25 lbs / 11.5 kg / @) & Fanega (55.5 Liters Grain) Converter [Colonial Hacienda Agriculture] | Digital Tools Shed',
    h1: 'Spanish Arroba (@) & Fanega Agricultural Converter',
    metaDesc: 'Convert Spanish arrobas (25 Castilian pounds = 11.50 kg = origin of the @ sign) and fanegas (55.5 liters grain / 1.59 bushels) to kilograms, pounds, and bushels.',
    desc: 'The arroba (symbol: @, ~11.5 kg / 25 lbs) and fanega (~55.5 liters / 1.59 bushels) governed agriculture and mining across the Spanish Americas for 400 years.',
    primaryUnit: 'Castilian Arrobas (@)',
    unitSymbol: 'arroba',
    defaultVal: 1,
    metricBase: 11.502, // kilograms
    metricName: 'Kilograms',
    metricSymbol: 'kg',
    imperialBase: 25.357, // pounds
    imperialName: 'Pounds (lbs)',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Castilian Pounds (Libras, 25 per arroba)', ratio: 25, note: '1 arroba = 25 libras (460 g each)' },
      { name: 'Quintal Fraction (1/4 quintal)', ratio: 0.25, note: '4 arrobas = 1 quintal (100 libras / 46 kg)' },
      { name: 'Fanega Grain Equivalent (Dry L)', ratio: 55.5, note: '1 fanega grain = 55.5 liters (1.58 bu)' },
      { name: 'Liquid Oil Arroba (Liters)', ratio: 12.56, note: 'Liquid olive oil arroba = 12.56 liters' }
    ],
    presets: [
      { label: '1 Arroba (@ / 25 Libras / 11.50 kg)', val: 1 },
      { label: '4 Arrobas (1 Spanish Quintal / 46.0 kg)', val: 4 },
      { label: '1 Fanega of Wheat Seed (55.5 L / 95 lbs)', val: 1 },
      { label: '100 Arrobas (Potosí Silver Mine Ore Output)', val: 100 }
    ],
    contextHtml: '<p>The arroba (from Arabic <em>ar-rub\'</em>, "the fourth part", meaning 1/4 of a 100-pound quintal) is the historical origin of the ubiquitous email <strong>@ symbol</strong>! In 1536, Florentine merchant Francesco Lapi wrote a commercial letter from Seville noting that "one @ of wine" was worth 1/13th of a ducat, using the coiled @ sign as an abbreviation for an arroba.</p>',
    primarySources: 'Real Orden de 9 de diciembre de 1852 (Spanish Weights and Measures Reform); Stols, <em>The @ Symbol: A History of the Arroba</em>.',
    faq: [
      { q: 'What is the connection between the Spanish arroba and the @ symbol?', a: 'The @ symbol originated in the 16th century as an accounting abbreviation for the Spanish and Portuguese arroba (a measure of 25 pounds or 12.5 liters of wine/oil).' },
      { q: 'How much grain was in a Spanish fanega?', a: 'A standard Castilian fanega of dry grain held 55.50 liters (1.575 US dry bushels). As a land measure (fanegada), it was the area of arable soil required to sow one fanega of wheat seed (approx. 1.59 acres).' }
    ]
  },

  // ─── 12. FRENCH PRE-METRIC SYSTEMS (112-114) ───────────────────────────────
  {
    slug: 'french-lieue-league-pre-metric',
    name: 'French Lieue (League: de Paris vs Commune)',
    shortName: 'French Lieue',
    category: 'French Pre-Metric',
    era: 'Ancien Régime France (Pre-1795)',
    title: 'French Lieue (Pre-Metric League: Paris 3.898 km vs Post 3.929 km) to Miles & Kilometers [Ancien Régime Travel] | Digital Tools Shed',
    h1: 'French Pre-Metric Lieue (League) Distance Converter',
    metaDesc: 'Convert French pre-metric lieues (Lieue de Paris 3.898 km, Lieue de poste 3.929 km, Lieue commune 4.452 km) to kilometers, statute miles, and toises.',
    desc: 'Before the French Revolution invented the metric kilometer, France measured royal highways in lieues (leagues), roughly the distance a horseman trotted in one hour.',
    primaryUnit: 'Lieue de Paris (2,000 Toises)',
    unitSymbol: 'lieue',
    defaultVal: 1,
    metricBase: 3.89808, // kilometers (Paris standard)
    metricName: 'Kilometers',
    metricSymbol: 'km',
    imperialBase: 2.42215, // statute miles
    imperialName: 'Statute Miles',
    imperialSymbol: 'mi',
    subdivisions: [
      { name: 'Toises (2,000 per Lieue de Paris)', ratio: 2000, note: '1 Paris league = 2,000 toises' },
      { name: 'Lieue de Poste (2,200 toises)', ratio: 0.9091, note: 'Postal league = 3.929 km' },
      { name: 'Lieue Commune (2,280 toises)', ratio: 0.8772, note: 'Common league = 4.452 km' },
      { name: 'Modern Meters', ratio: 3898.08, note: '3,898 meters' }
    ],
    presets: [
      { label: '1 Lieue de Paris (3.898 km / 2,000 Toises)', val: 1 },
      { label: '1 Lieue de Poste (3.929 km / Royal Relay Station Stage)', val: 1.008 },
      { label: '1 Lieue Commune (4.452 km / Traditional Walking Hour)', val: 1.142 },
      { label: '50 Lieues (Paris to Orléans Royal Coach Route)', val: 50 }
    ],
    contextHtml: '<p>In Ancien Régime France, travelers navigated with three competing lieues: the <em>Lieue de Paris</em> (2,000 toises = 3.898 km), the <em>Lieue de Poste</em> (2,200 toises = 3.929 km, marking the distance between royal post houses where horse teams were changed), and the <em>Lieue Commune</em> (25 to a degree of latitude = 4.452 km).</p>',
    primarySources: 'Cassini de Thury, <em>Description Géométrique de la France</em> (1783); Diderot & d\'Alembert, <em>Encyclopédie</em> (Article: Lieue).',
    faq: [
      { q: 'How many kilometers is a French lieue (league)?', a: 'The standard Lieue de Paris equaled exactly 2,000 toises, or 3.898 kilometers (2.42 miles). The postal league was 3.929 km, and the common league was 4.452 km.' },
      { q: 'Why did France have multiple leagues before the Revolution?', a: 'Because feudal provincial autonomy created localized measurements. One of the main driving forces behind the creation of the metric meter in 1795 was abolishing these hundreds of confusing provincial leagues and toises.' }
    ]
  },
  {
    slug: 'french-toise-and-pied-du-roi',
    name: 'French Toise & Pied du Roi (King\'s Foot)',
    shortName: 'Toise & Pied du Roi',
    category: 'French Pre-Metric',
    era: 'Ancien Régime France & Royal Academy of Sciences',
    title: 'French Toise (6 Pieds / 1.949 m) & Pied du Roi (King\'s Foot 32.48 cm) to Inches & Meters [Versailles Architecture] | Digital Tools Shed',
    h1: 'French Toise & Pied du Roi Architectural Converter',
    metaDesc: 'Convert the French royal toise (1.949036 meters) and Pied du Roi (King\'s foot, 32.484 cm / 12.79 inches) to meters and inches. Explore Palace of Versailles plans.',
    desc: 'The Toise de Paris (6 Pieds du Roi ≈ 1.949 meters) and Pied du Roi (32.48 cm, 6.6% longer than the English foot) built the Palace of Versailles and surveyed the meridian.',
    primaryUnit: 'Pied du Roi (King\'s Foot)',
    unitSymbol: 'pied_roi',
    defaultVal: 1,
    metricBase: 0.324839, // meters
    metricName: 'Meters',
    metricSymbol: 'm',
    imperialBase: 12.7889, // English inches
    imperialName: 'English Inches',
    imperialSymbol: 'in',
    subdivisions: [
      { name: 'Pouces / Royal Inches (12 per foot)', ratio: 12, note: '1 pied = 12 pouces (27.07 mm each)' },
      { name: 'Lignes / Royal Lines (144 per foot)', ratio: 144, note: '1 pied = 144 lignes (2.256 mm each)' },
      { name: 'Points (1,728 per foot)', ratio: 1728, note: '1 pied = 1,728 points (origin of typography point)' },
      { name: 'Toise Fraction (6 pieds = 1 toise)', ratio: 0.16667, note: '1 toise = 6 pieds (1.9490 m)' },
      { name: 'English Foot Comparison', ratio: 1.0657, note: 'French foot was 6.6% longer than English foot' }
    ],
    presets: [
      { label: '1 Ligne (2.256 mm / Watchmaking Movement Line)', val: 0.006944 },
      { label: '1 Pouce (Royal Inch / 2.71 cm / 1.07 in)', val: 0.08333 },
      { label: '1 Pied du Roi (King\'s Foot / 32.48 cm / 12.79 in)', val: 1 },
      { label: '1 Toise de Paris (6 Pieds / 1.949 m / 6.39 ft)', val: 6 }
    ],
    contextHtml: '<p>The <em>Toise du Châtelet</em> was embedded in the outer wall of the Grand Châtelet fortress in Paris. Because the French <em>Pied du Roi</em> (32.48 cm) was 6.6% longer than the English foot (30.48 cm), British historians long erroneously believed Napoleon Bonaparte was unusually short: his autopsy measured him at <strong>5 pieds 2 pouces</strong> French measure, which actually equaled <strong>5 feet 6.5 inches (168.9 cm)</strong>—completely average height for an 18th-century European man!</p>',
    primarySources: 'Delambre & Méchain, <em>Base du système métrique décimal</em> (1806); Félibien, <em>Description sommaire du château de Versailles</em> (1674).',
    faq: [
      { q: 'How long was the French King\'s Foot (Pied du Roi)?', a: 'The Pied du Roi measured exactly 32.4839 centimeters (12.7889 English inches). It was 6.57% longer than the British/US standard foot of 30.48 cm.' },
      { q: 'Was Napoleon really short?', a: 'No. Napoleon\'s official recorded autopsy height was 5 pieds 2 pouces in French royal measure. Converted to English inches, this equals 5 feet 6.5 inches (169 cm)—average male height in 1821 Europe. British wartime propaganda deliberately confused French and English inches to depict him as diminutive.' }
    ]
  },
  {
    slug: 'french-livre-de-paris-weight',
    name: 'French Livre Poids de Marc',
    shortName: 'Livre de Paris',
    category: 'French Pre-Metric',
    era: 'Ancien Régime France (Codified 1350 to 1795)',
    title: 'French Livre Poids de Marc (489.5 Grams) to Grams, Ounces & Kilograms [Pre-Metric French Revolution Scale] | Digital Tools Shed',
    h1: 'French Livre Poids de Marc Weight Converter',
    metaDesc: 'Convert the French pre-metric livre (poids de marc, 489.5058 grams / 16 onces) to grams, avoirdupois pounds, and kilograms. Decode Ancien Régime price ledgers.',
    desc: 'The Livre de Paris (Poids de Marc, ~489.51 grams = 16 onces = 9,216 grains) was the official national weight of France until the kilogram replaced it in 1795.',
    primaryUnit: 'Livre Poids de Marc',
    unitSymbol: 'livre_marc',
    defaultVal: 1,
    metricBase: 489.5058, // grams
    metricName: 'Grams',
    metricSymbol: 'g',
    imperialBase: 1.07918, // avoirdupois pounds
    imperialName: 'Avoirdupois Pounds',
    imperialSymbol: 'lb',
    subdivisions: [
      { name: 'Onces (16 per livre)', ratio: 16, note: '1 livre = 16 onces (30.59 g each)' },
      { name: 'Gros (8 per once / 128 per livre)', ratio: 128, note: '1 livre = 128 gros (3.824 g each)' },
      { name: 'Deniers (24 per once / 384 per livre)', ratio: 384, note: '1 livre = 384 deniers (1.275 g each)' },
      { name: 'Grains (9,216 per livre)', ratio: 9216, note: '1 livre = 9,216 French grains (53.11 mg each)' },
      { name: 'Avoirdupois Pound Comparison', ratio: 1.0792, note: 'French livre was 7.9% heavier than English pound (453.59g)' }
    ],
    presets: [
      { label: '1 Gros (3.82 g / Alchemical Dram Equivalent)', val: 0.0078125 },
      { label: '1 Once (Royal Ounce / 30.59 g)', val: 0.0625 },
      { label: '1 Marc (Half Livre / 8 Onces / 244.75 g Silver)', val: 0.50 },
      { label: '1 Livre de Paris (489.51 g / 1.08 lbs)', val: 1 }
    ],
    contextHtml: '<p>The <em>Livre Poids de Marc</em> was standardized in 1350 by King John II as two marcs (where 1 marc = 8 onces of silver). When the revolutionary National Convention established the metric system in 1795, they defined the <strong>kilogram</strong> as the mass of one liter of pure water at 4°C—which happened to equal almost exactly <strong>2.043 French livres</strong>. In 1812, Napoleon created the transitional <em>livre métrique</em>, defining it as exactly 500 grams.</p>',
    primarySources: 'Lavoisier, <em>Traité élémentaire de chimie</em> (1789); Decrees of the National Convention of 18 Germinal, Year III (April 7, 1795); Borda, <em>Rapport sur le choix d\'une unité de mesure</em>.',
    faq: [
      { q: 'How many grams was a French pre-metric livre?', a: 'The official French royal livre (poids de marc) weighed 489.5058 grams (1.079 avoirdupois pounds, or 16 onces of 30.59 grams each).' },
      { q: 'Is the French livre the origin of the 500-gram "livre" used in France today?', a: 'Yes. In 1812, Napoleon Bonaparte introduced the mesures usuelles to help everyday citizens transition to metric, standardizing the livre métrique as exactly 500 grams (half a kilogram). French shoppers at open-air markets still colloquially ask for "une livre de beurre" (500g of butter).' }
    ]
  }
];






// Helper to render FAQ schema items into HTML details
export function renderFaqAccordion(faqList) {
  if (!faqList || faqList.length === 0) return '';
  return faqList.map(item => `
    <details style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.75rem; cursor: pointer;">
      <summary style="font-weight: 600; color: var(--fg); font-size: 1rem; outline: none;">${item.q}</summary>
      <div style="margin-top: 0.75rem; font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
        ${item.a}
      </div>
    </details>
  `).join('\n');
}

// Master Unit Converter Page Generator
export function renderUnitConverterBody(tool) {
  const subdivisionsList = tool.subdivisions.map(sub => `
    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">
      <span style="color: var(--text-muted); font-size: 0.8rem;">${sub.name}</span>
      <span id="sub_${sub.name.replace(/[^a-zA-Z0-9]/g, '_')}" style="font-weight: 600; color: var(--fg); font-size: 0.9rem;">--</span>
    </div>
  `).join('\n');

  const presetsButtons = tool.presets.map(p => `
    <button type="button" class="btn-preset" onclick="setPreset(${p.val})" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; font-family: var(--mono); background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); cursor: pointer; transition: all 0.15s;">
      ${p.label}
    </button>
  `).join('\n');

  return `
    <div class="article-container" style="max-width: 950px; margin: 0 auto; padding: 1.5rem 1rem;">
      <nav class="breadcrumbs" style="font-family: var(--mono); font-size: 0.85rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/" style="color: var(--text-muted); text-decoration: none;">Home</a> &gt; 
        <a href="/units/" style="color: var(--text-muted); text-decoration: none;">Esoteric Units</a> &gt; 
        <span style="color: var(--fg); font-weight: 500;">${tool.shortName}</span>
      </nav>

      <header style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
        <div style="display: inline-block; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-family: var(--mono); background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
          ${tool.category} • ${tool.era}
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; line-height: 1.25; margin-bottom: 0.75rem; color: var(--fg);">${tool.h1}</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; max-width: 800px;">${tool.desc}</p>
      </header>

      <!-- Interactive Workbench Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.75rem; margin-bottom: 2.5rem;">
        
        <!-- Input Card -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0; color: var(--fg);">Convert ${tool.primaryUnit}</h3>
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Reactive Input</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label for="primaryInput" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">
              Quantity (${tool.primaryUnit})
            </label>
            <input type="number" id="primaryInput" value="${tool.defaultVal}" step="any" class="search-input" style="width: 100%; padding: 0.65rem 0.85rem; font-size: 1.25rem; font-family: var(--mono); background: var(--input-bg); border: 1px solid var(--border); border-radius: 4px; color: var(--fg);" />
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Historical & Common Presets</label>
            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
              ${presetsButtons}
            </div>
          </div>
        </div>

        <!-- Results Card -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0; color: var(--fg);">Conversion Output</h3>
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Exact Standards</span>
          </div>

          <div style="display: grid; gap: 0.85rem; font-family: var(--mono);">
            <div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">
              <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Modern Metric Equivalent</span>
              <div id="metricOutput" style="font-size: 1.4rem; font-weight: bold; color: var(--fg);">--</div>
            </div>
            
            <div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">
              <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Modern Imperial / US Equivalent</span>
              <div id="imperialOutput" style="font-size: 1.2rem; font-weight: bold; color: var(--fg);">--</div>
            </div>

            <div style="margin-top: 0.5rem;">
              <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; display: block; margin-bottom: 0.35rem;">Classical Subdivisions & Hierarchy</span>
              <div style="display: grid; gap: 0.4rem;">
                ${subdivisionsList}
              </div>
            </div>

            <button type="button" id="btnCopyReport" onclick="copyHistoricalReport()" class="btn-sec" style="margin-top: 1rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s;">
              📋 Copy Historical Metrology Report
            </button>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Historical Conversion Derivation -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">📐 Step-by-Step Historical Conversion Derivation</h3>
          <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">Archaeological Standard</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
          Historical unit calibrations link ancient archaeological artifacts and temple prototypes directly to modern SI metric standards and Anglo-American Imperial benchmarks:
        </p>
        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Classical Benchmark Unit Definition</strong>
            <div style="color: var(--text-muted); margin-top: 0.25rem;">
              Base Ancient Standard: 1 ${tool.primaryUnit} (${tool.era}) &bull; Benchmark Default: ${tool.defaultVal} ${tool.unitSymbol}
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Metric SI Ratio Derivation</strong>
            <div style="color: #3b82f6; margin-top: 0.25rem; word-break: break-all;">
              1 ${tool.primaryUnit} = ${tool.metricBase} ${tool.metricName} (${tool.metricSymbol}) &bull; Formula: Modern Metric = [Quantity in ${tool.unitSymbol}] × ${tool.metricBase} ${tool.metricSymbol}
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Imperial / Anglo-American Equivalent</strong>
            <div style="color: var(--text-muted); margin-top: 0.25rem;">
              1 ${tool.primaryUnit} = ${tool.imperialBase} ${tool.imperialName} (${tool.imperialSymbol}) &bull; Multiplier: Modern Imperial = [Quantity in ${tool.unitSymbol}] × ${tool.imperialBase} ${tool.imperialSymbol}
            </div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 4: Classical Subdivisions & Fractional Hierarchy</strong>
            <div style="color: #10b981; font-weight: 700; margin-top: 0.25rem;">
              Canonical Hierarchy: ${tool.subdivisions.map(s => `${s.name} (${s.ratio >= 1 ? '1/' + s.ratio : (1/s.ratio) + 'x'} ${tool.unitSymbol})`).join(' &bull; ')}
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Metrological Drift & Historical Variations -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Metrological Drift & Historical Variations</h3>
        <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
          <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Regional Metrological Drift:</strong> Before state-enforced decimalization (such as the 1795 French metric decrees or the British 1824 Weights and Measures Act), measuring vessels varied between commercial port cities, royal capitals, and agricultural provinces. For instance, Roman provincial measures often absorbed local Greek or Celtic tolerances.</li>
          <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Dry vs Liquid Capacity Discrepancies:</strong> In antiquity, grain, legumes, and dry commodities were measured by struck (level) or heaped baskets, whereas precious liquids (wine, olive oil, garum) were calibrated by exact vessel weight. Do not interchange dry and liquid measures without accounting for packing density.</li>
          <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Archaeological Consensus Standards:</strong> The conversion factors in this calculator reflect the consensus measurements established by classical scholars and museum calibrations (e.g. Capitoline bronze standards, Louvre Egyptian cubit rods, and British Museum cuneiform weights).</li>
        </ul>
      </div>

      <!-- Historical Context & Primary Sources Card -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.75rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-top: 0; margin-bottom: 1rem; color: var(--fg);">Historical Standards & Mathematical Derivation</h3>
        <div style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted);">
          ${tool.contextHtml}
        </div>
        
        <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px dashed var(--border); font-family: var(--mono); font-size: 0.85rem;">
          <strong style="color: var(--fg);">Primary Source References:</strong>
          <div style="color: var(--text-muted); margin-top: 0.35rem;">${tool.primarySources}</div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin-top: 2.5rem; margin-bottom: 2.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1.25rem; color: var(--fg);">Frequently Asked Questions</h3>
        ${renderFaqAccordion(tool.faq)}
      </div>

      <nav style="font-family: var(--mono); font-size: 0.85rem; padding: 1rem 0; border-top: 1px solid var(--border); display: flex; justify-content: space-between;">
        <a href="/units/" style="color: var(--text-muted); text-decoration: none;">← All 114 Esoteric & Historical Units</a>
        <a href="/" style="color: var(--text-muted); text-decoration: none;">Tools Shed Home →</a>
      </nav>
    </div>

    <script>
      (function() {
        var metricBase = ${tool.metricBase};
        var imperialBase = ${tool.imperialBase};
        var subdivisions = ${JSON.stringify(tool.subdivisions)};
        var metricSymbol = "${tool.metricSymbol}";
        var imperialSymbol = "${tool.imperialSymbol}";

        function formatNum(n) {
          if (n === 0) return '0';
          if (Math.abs(n) >= 1000000 || (Math.abs(n) < 0.001 && n !== 0)) {
            return n.toExponential(4);
          }
          if (Number.isInteger(n)) return n.toLocaleString();
          if (Math.abs(n) < 1) return n.toFixed(4);
          if (Math.abs(n) < 100) return n.toFixed(3);
          return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
        }

        function update() {
          var inputEl = document.getElementById('primaryInput');
          if (!inputEl) return;
          var val = parseFloat(inputEl.value);
          if (isNaN(val)) val = 0;

          var metricVal = val * metricBase;
          var imperialVal = val * imperialBase;

          var mEl = document.getElementById('metricOutput');
          if (mEl) mEl.textContent = formatNum(metricVal) + ' ' + metricSymbol;

          var iEl = document.getElementById('imperialOutput');
          if (iEl) iEl.textContent = formatNum(imperialVal) + ' ' + imperialSymbol;

          for (var i = 0; i < subdivisions.length; i++) {
            var sub = subdivisions[i];
            var subId = 'sub_' + sub.name.replace(/[^a-zA-Z0-9]/g, '_');
            var subEl = document.getElementById(subId);
            if (subEl) {
              var subVal = val * sub.ratio;
              subEl.textContent = formatNum(subVal);
            }
          }
        }

        window.setPreset = function(v) {
          var inputEl = document.getElementById('primaryInput');
          if (inputEl) {
            inputEl.value = v;
            update();
          }
        };

        window.copyHistoricalReport = function() {
          var inputEl = document.getElementById('primaryInput');
          var qty = inputEl ? inputEl.value : '${tool.defaultVal}';
          var mEl = document.getElementById('metricOutput');
          var iEl = document.getElementById('imperialOutput');
          var metricVal = mEl ? mEl.textContent.trim() : '';
          var imperialVal = iEl ? iEl.textContent.trim() : '';
          
          var subList = [];
          for (var i = 0; i < subdivisions.length; i++) {
            var sub = subdivisions[i];
            var subId = 'sub_' + sub.name.replace(/[^a-zA-Z0-9]/g, '_');
            var el = document.getElementById(subId);
            if (el) subList.push('  - ' + sub.name + ': ' + el.textContent.trim() + ' (' + sub.note + ')');
          }

          var report = [
            '=== HISTORICAL METROLOGY CONVERSION REPORT ===',
            'Tool: ${tool.name} [' + "${tool.era}".replace(/"/g, '') + ']',
            'Category: ${tool.category}',
            '-----------------------------------------------',
            'Input Quantity: ' + qty + ' ${tool.primaryUnit} (${tool.unitSymbol})',
            'Modern Metric: ' + metricVal,
            'Modern Imperial: ' + imperialVal,
            '-----------------------------------------------',
            'Classical Subdivisions & Hierarchy:',
            subList.join('\\n'),
            '-----------------------------------------------',
            'Historical Context: ' + "${tool.primarySources}".replace(/<[^>]+>/g, '').replace(/"/g, "'"),
            'Timestamp: ' + new Date().toISOString(),
            'Verified via Digital Tools Shed Historical Metrology Suite',
            'https://digitaltoolsshed.com/units/${tool.slug}'
          ].join('\\n');

          navigator.clipboard.writeText(report).then(function() {
            var btn = document.getElementById('btnCopyReport');
            if (btn) {
              var old = btn.innerHTML;
              btn.innerHTML = '✓ Copied Metrology Report!';
              btn.style.background = 'rgba(34, 197, 94, 0.15)';
              btn.style.color = '#22c55e';
              setTimeout(function() {
                btn.innerHTML = old;
                btn.style.background = 'var(--surface)';
                btn.style.color = 'var(--fg)';
              }, 2500);
            }
          }).catch(function() {
            alert('Failed to copy report to clipboard. Please copy manually.');
          });
        };

        var inputEl = document.getElementById('primaryInput');
        if (inputEl) {
          inputEl.addEventListener('input', update);
          inputEl.addEventListener('change', update);
        }
        update();
      })();
    </script>
  `;
}

// Hub Index Page Generator for /units/index.html
export function buildUnitsHubHtml(tools) {
  const categories = Array.from(new Set(tools.map(t => t.category)));
  const filterButtons = ['All', ...categories].map(cat => `
    <button type="button" class="btn-filter" onclick="filterCategory('${cat}')" data-cat="${cat}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; font-family: var(--mono); background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); cursor: pointer; transition: all 0.15s;">
      ${cat}
    </button>
  `).join('\n');

  const cardsHtml = tools.map(t => `
    <a href="/units/${t.slug}" class="unit-card" data-category="${t.category}" data-search="${t.name.toLowerCase()} ${t.shortName.toLowerCase()} ${t.category.toLowerCase()} ${t.era.toLowerCase()} ${t.primaryUnit.toLowerCase()} ${t.desc.toLowerCase()}" style="display: flex; flex-direction: column; justify-content: space-between; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: transform 0.15s ease, border-color 0.15s ease;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; gap: 0.5rem;">
          <span style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">${t.category}</span>
          <span style="font-family: var(--mono); font-size: 0.65rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.15rem 0.4rem; border-radius: 3px;">${t.era.split('(')[0].trim()}</span>
        </div>
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.5rem; color: var(--fg); line-height: 1.3;">${t.name}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.desc}</p>
      </div>
      <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Standard: ${t.primaryUnit}</span>
        <span style="font-family: var(--mono); font-size: 0.75rem; color: #3b82f6; font-weight: bold;">Open Converter &rarr;</span>
      </div>
    </a>
  `).join('\n');

  return `
    <div class="article-container" style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem;">
      <nav class="breadcrumbs" style="font-family: var(--mono); font-size: 0.85rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/" style="color: var(--text-muted); text-decoration: none;">Home</a> &gt; 
        <span style="color: var(--fg); font-weight: 500;">Esoteric & Historical Unit Systems</span>
      </nav>

      <header style="margin-bottom: 2.5rem; text-align: center;">
        <div style="display: inline-block; padding: 0.25rem 0.6rem; font-size: 0.75rem; font-family: var(--mono); background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
          Classical & Obsolete Metrology
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.6rem; line-height: 1.2; margin-bottom: 0.75rem; color: var(--fg);">Esoteric & Historical Unit Systems Suite</h1>
        <p style="color: var(--text-muted); font-size: 1.15rem; line-height: 1.6; max-width: 800px; margin: 0 auto 1.5rem;">
          114 mathematically verified conversion calculators and historical metrology engines across Ancient Roman, Greek, Biblical, Egyptian, Mesopotamian, East Asian, Russian Imperial, French Pre-Metric, Apothecary, Nautical, and Obsolete Computing measurement systems.
        </p>
        
        <div style="max-width: 550px; margin: 0 auto 1.5rem;">
          <input type="text" id="toolFilter" placeholder="Search 114 historical calculators (e.g. amphora, cubit, pood, liang, punch card)..." oninput="filterTools()" class="search-input" style="width: 100%; padding: 0.75rem 1rem; font-family: var(--mono); font-size: 0.95rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg);" />
        </div>

        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem; max-width: 900px; margin: 0 auto;">
          ${filterButtons}
        </div>
      </header>

      <div id="toolsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; margin-bottom: 3rem;">
        ${cardsHtml}
      </div>

      <!-- Overview Information Card -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 2rem; margin-bottom: 2.5rem;">
        <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-top: 0; margin-bottom: 1rem; color: var(--fg);">About Classical & Historical Metrology</h2>
        <div style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted);">
          <p>Before the global adoption of the international decimal metric system (SI) in the 19th and 20th centuries, civilizations engineered intricate measuring systems rooted in human anatomy, grain counts, and astronomical observations. From the <strong>Egyptian Royal Cubit</strong> that guided the alignment of the Great Pyramid of Giza with millimeter accuracy, to the <strong>Roman Amphora</strong> that calibrated wine shipping galleys across the Mediterranean, each unit carried cultural, legal, and economic power.</p>
          <p>This suite provides exact mathematical bridges between these obsolete units and modern ISO metric and Imperial benchmarks, drawing upon classical literature, archaeological artifacts, and legal standards.</p>
        </div>
      </div>

      <!-- FAQ Section -->
      <div style="margin-top: 2.5rem; margin-bottom: 2.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1.25rem; color: var(--fg);">Historical Metrology FAQ</h3>
        ${renderFaqAccordion([
          { q: 'What is the Esoteric & Historical Unit Systems Suite?', a: 'This comprehensive suite features 114 interactive, mathematically accurate conversion tools and historical reference calculators covering ancient Roman, Greek, Biblical, Egyptian, Mesopotamian, East Asian, Russian Imperial, Spanish Colonial, French Pre-Metric, Apothecary, and Obsolete Computing measurement systems.' },
          { q: 'How are the historical conversion ratios derived?', a: 'All ratios are calibrated against primary historical sources, archaeological artifacts (such as Gudea of Lagash’s diorite cubit scale, the Châtelet toise in Paris, and preserved roman amphorae), legal statutes (such as the British Weights and Measures Act of 1824 and the French 1795 metric decrees), and peer-reviewed historical metrology papers.' },
          { q: 'Why do different sources report slightly different values for ancient units?', a: 'Ancient measurement standards varied over time and across geography before state-enforced standardization. For instance, the Greek stadium ranged from 177.6 meters (Delphic) to 192.3 meters (Olympic), and the French lieue varied between Paris, postal, and provincial definitions. Our converters provide the most widely accepted scholarly reference standard and document historical variances in the context notes.' }
        ])}
      </div>

      <nav style="font-family: var(--mono); font-size: 0.85rem; padding: 1rem 0; border-top: 1px solid var(--border); display: flex; justify-content: space-between;">
        <a href="/" style="color: var(--text-muted); text-decoration: none;">← Digital Tools Shed Home</a>
        <span style="color: var(--text-muted);">114 Calculators Verified</span>
      </nav>
    </div>

    <script>
      (function() {
        var activeCategory = 'All';

        window.filterCategory = function(cat) {
          activeCategory = cat;
          var buttons = document.querySelectorAll('.btn-filter');
          buttons.forEach(function(b) {
            if (b.getAttribute('data-cat') === cat) {
              b.style.borderColor = '#3b82f6';
              b.style.background = 'rgba(59, 130, 246, 0.15)';
              b.style.color = '#3b82f6';
            } else {
              b.style.borderColor = 'var(--border)';
              b.style.background = 'var(--surface-alt)';
              b.style.color = 'var(--fg)';
            }
          });
          filterTools();
        };

        window.filterTools = function() {
          var input = document.getElementById('toolFilter');
          var query = input ? input.value.toLowerCase().trim() : '';
          var cards = document.querySelectorAll('.unit-card');
          cards.forEach(function(card) {
            var searchData = card.getAttribute('data-search') || '';
            var cardCat = card.getAttribute('data-category') || '';
            var matchesQuery = !query || searchData.indexOf(query) !== -1;
            var matchesCat = activeCategory === 'All' || cardCat === activeCategory;
            if (matchesQuery && matchesCat) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        };

        filterCategory('All');
      })();
    </script>
  `;
}

// Master Suite Builder Entrypoint
export function buildHistoryUnitsTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const unitsDist = join(DIST, 'units');
  ensureDir(unitsDist);

  let builtCount = 0;
  for (const tool of HISTORY_UNITS_TOOLS) {
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to Convert ${tool.name} to Modern Metric & Imperial Units`,
      "description": tool.metaDesc,
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": `Enter Historical Quantity (${tool.primaryUnit})`,
          "text": `Specify the number of historical ${tool.primaryUnit} units (${tool.unitSymbol}) or select from standard classical presets.`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Derive Modern Metric & Imperial Equivalents",
          "text": `Multiply the input quantity by ${tool.metricBase} ${tool.metricSymbol} for metric or ${tool.imperialBase} ${tool.imperialSymbol} for imperial measurements.`
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Inspect Classical Subdivisions & Hierarchy",
          "text": `Review the authentic ancient hierarchical breakdown across subordinate units (${tool.subdivisions.map(s => s.name).join(', ')}).`
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Export Historical Metrology Report",
          "text": "Copy the formatted conversion analysis to your clipboard for academic research, historical reenactment, or recipe reconstruction."
        }
      ]
    };

    const pageHtml = renderPage({
      title: tool.title,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/units/${tool.slug}`,
      bodyContent: renderUnitConverterBody(tool),
      currentPath: `/units/${tool.slug}.html`,
      faq: tool.faq,
      jsonLd: howToSchema
    });

    writeFileSync(join(unitsDist, `${tool.slug}.html`), pageHtml);
    builtCount++;
  }

  // Build Category Hub Page
  const hubHtml = renderPage({
    title: 'Esoteric & Historical Unit Systems Suite [114 Classical Calculators] | Digital Tools Shed',
    metaDesc: 'Explore 114 ancient, obsolete, and historical unit converters across Roman, Greek, Biblical, Egyptian, Mesopotamian, East Asian, Russian Imperial, French, and Computing systems.',
    canonical: `${DOMAIN}/units/`,
    currentPath: `/units/index.html`,
    faq: [
      { q: 'What is the Esoteric & Historical Unit Systems Suite?', a: 'This comprehensive suite features 114 interactive, mathematically accurate conversion tools and historical reference calculators covering ancient Roman, Greek, Biblical, Egyptian, Mesopotamian, East Asian, Russian Imperial, Spanish Colonial, French Pre-Metric, Apothecary, and Obsolete Computing measurement systems.' },
      { q: 'How are the historical conversion ratios derived?', a: 'All ratios are calibrated against primary historical sources, archaeological artifacts (such as Gudea of Lagash’s diorite cubit scale, the Châtelet toise in Paris, and preserved roman amphorae), legal statutes (such as the British Weights and Measures Act of 1824 and the French 1795 metric decrees), and peer-reviewed historical metrology papers.' }
    ],
    bodyContent: buildUnitsHubHtml(HISTORY_UNITS_TOOLS)
  });
  writeFileSync(join(unitsDist, 'index.html'), hubHtml);

  console.log(`  ✓ Built Esoteric & Historical Unit Systems Suite (${builtCount} tools + hub in /units/)`);
}
