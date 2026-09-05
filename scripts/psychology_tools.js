// scripts/psychology_tools.js — 2 AM Existential Dilemmas & Psychology Suite
// Generates all 115 client-side psychology, existential, and ADHD tools into dist/psychology/
// Zero external dependencies, pure vanilla JS, Workbench design system, high-CTR bracketed titles, FAQ schemas.

import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE RENDERING ENGINES
// ─────────────────────────────────────────────────────────────────────────────

function renderArchetypeWorkspace(tool) {
  const type = tool.type || 'slider_scale';
  const c = tool.config || {};

  if (type === 'slider_scale') {
    const slidersHtml = (c.sliders || [
      { id: 'dim1', label: 'Primary Friction / Intensity', min: 1, max: 10, val: 5 },
      { id: 'dim2', label: 'Emotional / Psychological Stakes', min: 1, max: 10, val: 6 },
      { id: 'dim3', label: 'Environmental / Physical Drag', min: 1, max: 10, val: 4 }
    ]).map(s => `
      <div style="margin-bottom: 1rem;">
        <label style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.25rem;">
          <span>${s.label}:</span>
          <span id="val_${s.id}">${s.val}/10</span>
        </label>
        <input type="range" id="rng_${s.id}" min="${s.min || 1}" max="${s.max || 10}" value="${s.val}" style="width: 100%;">
      </div>
    `).join('');

    return {
      html: `
        <div style="margin-bottom: 1.5rem;">
          ${slidersHtml}
        </div>
        <div id="scaleResultBox" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
          <div style="font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.35rem;">Calculated Index: <strong id="scoreDisplay" style="color: #3b82f6;">15 / 30</strong></div>
          <div id="verdictHeadline" style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.5rem; font-weight: 600;"></div>
          <p id="verdictDetails" style="font-size: 0.9rem; color: var(--text-muted); margin: 0; line-height: 1.6;"></p>
        </div>
      `,
      script: `
        var sIds = ${JSON.stringify((c.sliders || [{ id: 'dim1' }, { id: 'dim2' }, { id: 'dim3' }]).map(s => s.id))};
        function calcScale() {
          var sum = 0;
          sIds.forEach(function(id) {
            var el = document.getElementById('rng_' + id);
            var v = el ? parseInt(el.value, 10) : 5;
            var lbl = document.getElementById('val_' + id);
            if (lbl) lbl.textContent = v + '/10';
            sum += v;
          });
          var maxPossible = sIds.length * 10;
          var ratio = sum / maxPossible;
          var disp = document.getElementById('scoreDisplay');
          if (disp) disp.textContent = sum + ' / ' + maxPossible + ' (' + Math.round(ratio * 100) + '%)';
          var h = document.getElementById('verdictHeadline');
          var d = document.getElementById('verdictDetails');
          if (!h || !d) return;

          if (ratio > 0.65) {
            h.innerHTML = '<span style="color: #ef4444;">High Activation Threshold / Acute Intensity:</span> Severe cognitive or emotional drag active.';
            d.textContent = ${JSON.stringify(c.highAdvice || 'The psychological barrier is currently elevated. Do not attempt forced brute-force execution. Lower demands to bare survival minimums and stabilize sensory baseline.')};
          } else if (ratio > 0.35) {
            h.innerHTML = '<span style="color: #f59e0b;">Moderate Resistance / Manageable Friction:</span> Normal friction with specific bottlenecks.';
            d.textContent = ${JSON.stringify(c.medAdvice || 'You have sufficient capacity to navigate this with targeted pacing. Isolate the highest single slider and resolve that specific blocker first.')};
          } else {
            h.innerHTML = '<span style="color: #10b981;">Low Barrier / High Regulatory Stability:</span> Favorable baseline.';
            d.textContent = ${JSON.stringify(c.lowAdvice || 'Conditions are optimal for focus, decisive action, or peaceful rest. Proceed with confidence.')};
          }
        }
        sIds.forEach(function(id) {
          var el = document.getElementById('rng_' + id);
          if (el) el.addEventListener('input', calcScale);
        });
        calcScale();
      `
    };
  }

  if (type === 'dilemma_choice') {
    const optsHtml = (c.options || [
      { id: 'optA', title: 'Option A', label: 'Choose Path A', desc: 'Accept standard intuitive interpretation' },
      { id: 'optB', title: 'Option B', label: 'Choose Path B', desc: 'Accept counter-intuitive radical paradox' }
    ]).map((opt, i) => `
      <div style="padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.75rem; cursor: pointer;" onclick="pickChoice(${i})">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <strong style="font-family: var(--serif); font-size: 1.05rem;">${opt.title}</strong>
          <span style="font-family: var(--mono); font-size: 0.8rem; color: #3b82f6;">Select →</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${opt.desc}</p>
      </div>
    `).join('');

    return {
      html: `
        <div style="margin-bottom: 1.25rem;">
          <p style="font-family: var(--serif); font-size: 1.05rem; color: var(--fg); margin-bottom: 1rem; line-height: 1.5;">${c.scenario || 'Consider the thought experiment carefully and choose your philosophical stance:'}</p>
          ${optsHtml}
        </div>
        <div id="choiceOutputBox" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
          <div id="choiceSchool" style="font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase; color: #3b82f6; margin-bottom: 0.35rem;">Philosophical Stance: Undecided</div>
          <div id="choiceAnalysis" style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">Click an option above to simulate the philosophical ramifications.</div>
        </div>
      `,
      script: `
        var optData = ${JSON.stringify(c.options || [])};
        window.pickChoice = function(idx) {
          var chosen = optData[idx];
          if (!chosen) return;
          var s = document.getElementById('choiceSchool');
          var a = document.getElementById('choiceAnalysis');
          if (s) s.textContent = 'Philosophical Stance: ' + (chosen.school || chosen.title);
          if (a) a.innerHTML = '<strong>Core Axiom:</strong> ' + (chosen.axiom || chosen.desc) + '<br><br><strong>Paradox Implication:</strong> ' + (chosen.consequence || 'This reveals how your internal value system prioritizes certainty versus subjective intuition.');
        };
      `
    };
  }

  if (type === 'cbt_reframing') {
    return {
      html: `
        <div style="margin-bottom: 1.5rem;">
          <label style="display:block; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.35rem; font-weight: 600;">The Distorted Automatic Thought or Trigger:</label>
          <input type="text" id="autoThought" value="${c.defaultThought || 'Everything is falling apart and it is entirely my fault'}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); background: var(--input-bg); color: var(--fg); font-family: var(--mono); border-radius: 4px; margin-bottom: 1rem;">
          <button type="button" id="reframeTriggerBtn" class="btn-primary" style="padding: 0.5rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; background: var(--btn-bg); color: var(--btn-fg); border: none; border-radius: 4px; cursor: pointer;">DECONSTRUCT COGNITIVE DISTORTION</button>
        </div>
        <div id="reframeResult" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
          <div style="font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase; color: #f59e0b; margin-bottom: 0.35rem;">Distortion Identified: ${c.distortionName || 'Cognitive Magnification & Catastrophizing'}</div>
          <div id="reframeContent" style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;"></div>
        </div>
      `,
      script: `
        function doReframe() {
          var el = document.getElementById('autoThought');
          var thought = el ? el.value.trim() : '';
          var out = document.getElementById('reframeContent');
          if (!out) return;
          out.innerHTML = '<strong>Cognitive Cross-Examination:</strong> You are accepting "' + thought + '" as absolute truth without requiring evidentiary proof.<br><br>' +
            '<strong>1. Base Reality Check:</strong> ' + ${JSON.stringify(c.realityCheck || 'What observable evidence contradicts this thought? What would a compassionate mentor say?')} + '<br><br>' +
            '<strong>2. Calibrated Reframe:</strong> "' + ${JSON.stringify(c.calibratedText || 'I am having a temporary feeling of distress, but reality remains manageable and full of intermediate steps.')} + '"';
        }
        var btn = document.getElementById('reframeTriggerBtn');
        var inp = document.getElementById('autoThought');
        if (btn) btn.addEventListener('click', doReframe);
        if (inp) inp.addEventListener('input', doReframe);
        doReframe();
      `
    };
  }

  if (type === 'diagnostic_quiz') {
    const qList = (c.questions || [
      'I feel an intense internal obligation to maintain control over small details.',
      'When resting, I experience underlying anxiety that I should be accomplishing something.',
      'I frequently conceal my true opinions to maintain social harmony.',
      'I struggle to identify what physical sensation corresponds to my emotion.'
    ]).map((q, idx) => `
      <label style="display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; font-family: var(--mono); font-size: 0.85rem;">
        <input type="checkbox" id="diag_q_${idx}" style="margin-top: 0.2rem;" onchange="scoreDiag()">
        <span>${q}</span>
      </label>
    `).join('');

    return {
      html: `
        <div style="margin-bottom: 1.5rem;">
          <p style="font-family: var(--serif); font-size: 0.95rem; color: var(--text-muted); margin-bottom: 0.75rem;">Check all statements that currently ring true for your lived experience:</p>
          <div id="diagList">${qList}</div>
        </div>
        <div id="diagOutputBox" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
          <div style="font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.35rem;">Trait Presentation Index: <strong id="diagScore" style="color: #3b82f6;">0 / ${(c.questions || [1,2,3,4]).length}</strong></div>
          <div id="diagInterpretation" style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6;">Select items above to calibrate diagnostic presentation.</div>
        </div>
      `,
      script: `
        var totalQ = ${(c.questions || [1, 2, 3, 4]).length};
        window.scoreDiag = function() {
          var count = 0;
          for (var i = 0; i < totalQ; i++) {
            var el = document.getElementById('diag_q_' + i);
            if (el && el.checked) count++;
          }
          var sc = document.getElementById('diagScore');
          if (sc) sc.textContent = count + ' / ' + totalQ;
          var interp = document.getElementById('diagInterpretation');
          if (!interp) return;
          if (count >= Math.ceil(totalQ * 0.7)) {
            interp.innerHTML = '<span style="color: #ef4444; font-weight: 600;">Pronounced Presentation:</span> ' + ${JSON.stringify(c.highText || 'You exhibit significant clinical markers for this trait or protective strategy. This indicates an adaptive survival mechanism developed in response to chronic environmental demands.')};
          } else if (count >= Math.ceil(totalQ * 0.35)) {
            interp.innerHTML = '<span style="color: #f59e0b; font-weight: 600;">Moderate / Situational Trait:</span> ' + ${JSON.stringify(c.medText || 'You display moderate traits that typically emerge under acute stress or interpersonal fatigue.')};
          } else {
            interp.innerHTML = '<span style="color: #10b981; font-weight: 600;">Sub-Clinical Baseline:</span> ' + ${JSON.stringify(c.lowText || 'Minimal presentation. This domain is unlikely to be your primary current bottleneck.')};
          }
        };
        scoreDiag();
      `
    };
  }

  if (type === 'chrono_calculator') {
    return {
      html: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display:block; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.35rem;">${c.input1Label || 'Input Quantity / Duration'}</label>
            <input type="number" id="calcIn1" value="${c.default1 || 5}" min="${c.min1 || 1}" max="${c.max1 || 100}" step="${c.step1 || 1}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); background: var(--input-bg); color: var(--fg); font-family: var(--mono);">
          </div>
          <div>
            <label style="display:block; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.35rem;">${c.input2Label || 'Time Horizon / Multiplier'}</label>
            <input type="number" id="calcIn2" value="${c.default2 || 30}" min="${c.min2 || 1}" max="${c.max2 || 100}" step="${c.step2 || 1}" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border); background: var(--input-bg); color: var(--fg); font-family: var(--mono);">
          </div>
        </div>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
          <div style="font-family: var(--mono); font-size: 0.95rem; margin-bottom: 0.5rem;">Calculated Result: <strong id="calcResultDisplay" style="color: #10b981;">0</strong></div>
          <p id="calcInsight" style="font-size: 0.9rem; color: var(--text-muted); margin: 0; line-height: 1.6;"></p>
        </div>
      `,
      script: `
        function runChrono() {
          var in1 = document.getElementById('calcIn1');
          var in2 = document.getElementById('calcIn2');
          var v1 = in1 ? parseFloat(in1.value) || 0 : 0;
          var v2 = in2 ? parseFloat(in2.value) || 0 : 0;
          var res = ${c.calcFormula || '(v1 * v2)'};
          var disp = document.getElementById('calcResultDisplay');
          if (disp) disp.textContent = (typeof res === 'number' ? res.toLocaleString() : res) + ' ' + ${JSON.stringify(c.unitLabel || 'Units')};
          var ins = document.getElementById('calcInsight');
          if (ins) ins.textContent = ${JSON.stringify(c.insightTemplate || 'This metric contextualizes your finite biological reserves against long-term compound reality.')};
        }
        var i1 = document.getElementById('calcIn1');
        var i2 = document.getElementById('calcIn2');
        if (i1) i1.addEventListener('input', runChrono);
        if (i2) i2.addEventListener('input', runChrono);
        runChrono();
      `
    };
  }

  if (type === 'somatic_timer') {
    return {
      html: `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem;" id="somaticDisplay">${c.defaultTimer || '04:00'}</div>
          <div style="font-family: var(--serif); font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1rem;" id="somaticPhase">${c.initialPhase || 'Ready to Begin'}</div>
          <div style="display: flex; justify-content: center; gap: 0.75rem;">
            <button type="button" id="startSomaticBtn" class="btn-primary" style="padding: 0.6rem 1.5rem; font-family: var(--mono); font-size: 0.85rem; background: var(--btn-bg); color: var(--btn-fg); border: none; border-radius: 4px; cursor: pointer;">START REGULATION CYCLE</button>
            <button type="button" id="resetSomaticBtn" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); cursor: pointer;">RESET</button>
          </div>
        </div>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
          <div style="font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase; color: #10b981; margin-bottom: 0.35rem;">Autonomic Nervous System Focus:</div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0; line-height: 1.6;">${c.somaticInstructions || 'Slow diaphragmatic pacing stimulates the afferent vagus nerve, reducing systemic noradrenaline and dropping heart rate variability into coherent resonance.'}</p>
        </div>
      `,
      script: `
        var somTimer = null;
        var somSecs = ${c.durationSecs || 240};
        var somDisplay = document.getElementById('somaticDisplay');
        var somPhase = document.getElementById('somaticPhase');

        function fmtSom(s) {
          var m = Math.floor(s / 60);
          var sc = s % 60;
          return (m < 10 ? '0' : '') + m + ':' + (sc < 10 ? '0' : '') + sc;
        }

        var startBtn = document.getElementById('startSomaticBtn');
        if (startBtn) {
          startBtn.addEventListener('click', function() {
            if (somTimer) return;
            var phases = ${JSON.stringify(c.phases || ['Inhale slowly (4s)', 'Hold gently (4s)', 'Exhale completely (6s)', 'Pause in stillness (2s)'])};
            var phaseIdx = 0;
            if (somPhase) somPhase.textContent = phases[0];
            somTimer = setInterval(function() {
              if (somSecs > 0) {
                somSecs--;
                if (somDisplay) somDisplay.textContent = fmtSom(somSecs);
                if (somSecs % 4 === 0) {
                  phaseIdx = (phaseIdx + 1) % phases.length;
                  if (somPhase) somPhase.textContent = phases[phaseIdx];
                }
              } else {
                clearInterval(somTimer);
                somTimer = null;
                if (somPhase) somPhase.textContent = 'Regulation cycle complete. Notice your body.';
              }
            }, 1000);
          });
        }

        var resetBtn = document.getElementById('resetSomaticBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', function() {
            clearInterval(somTimer);
            somTimer = null;
            somSecs = ${c.durationSecs || 240};
            if (somDisplay) somDisplay.textContent = fmtSom(somSecs);
            if (somPhase) somPhase.textContent = 'Ready to Begin';
          });
        }
      `
    };
  }

  if (type === 'action_steps') {
    const stepsHtml = (c.steps || [
      'Step 1: Ground your feet and take 1 slow breath.',
      'Step 2: Clear your visual field of all non-essential items.',
      'Step 3: Execute the absolute minimum physical motion.',
      'Step 4: Stop and acknowledge zero-guilt completion.'
    ]).map((s, idx) => `
      <div style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem; padding: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">
        <input type="checkbox" id="chk_act_${idx}" style="margin-top: 0.25rem;" onchange="updateStepProgress()">
        <label for="chk_act_${idx}" style="font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">${s}</label>
      </div>
    `).join('');

    return {
      html: `
        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 0.5rem;">Linear Execution Sequence:</h4>
          <div id="actionStepContainer">${stepsHtml}</div>
        </div>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem;">
          <div style="font-family: var(--mono); font-size: 0.85rem; font-weight: 600; color: #10b981;" id="stepStatus">Check off items as completed</div>
        </div>
      `,
      script: `
        window.updateStepProgress = function() {
          var chks = document.querySelectorAll('#actionStepContainer input[type="checkbox"]');
          var d = 0;
          chks.forEach(function(c) { if (c.checked) d++; });
          var st = document.getElementById('stepStatus');
          if (st) st.textContent = 'Accomplished: ' + d + ' of ' + chks.length + ' milestones complete.';
        };
      `
    };
  }

  // Fallback
  return {
    html: `<div style="padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;">Interactive Calculation Active</div>`,
    script: `// active calculation`
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE 115 PSYCHOLOGY TOOLS CATALOG METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_115_TOOLS_CONFIG = [
  // 1-10: ADHD & Executive Function
  {
    slug: 'adhd-micro-step-decomposer',
    title: 'ADHD 2-Minute Micro-Step Decomposer [Overcome Executive Task Freezing] | Digital Tools Shed',
    metaDesc: 'Break paralyzing chores and overwhelming projects into tiny 2-minute physical actions requiring zero prefrontal planning to bypass ADHD task freezing.',
    category: 'ADHD & Executive Function',
    summary: 'Executive dysfunction makes initiating complex tasks feel neurologically impossible. This decomposer strips out the planning overhead, breaking tasks into physical micro-movements.',
    deepDive: 'ADHD task paralysis occurs because the prefrontal cortex attempts to compute the entire dependency graph of a project at once, triggering an amygdala threat freeze. By isolating actions that take under 120 seconds and require zero decision-making, activation energy drops below the initiation threshold.',
    type: 'action_steps',
    config: {
      steps: [
        '1. Stand up and touch the doorframe of the room (0 energy spent).',
        '2. Pick up exactly ONE single object belonging to the task and hold it in your hand.',
        '3. Set a physical timer on your phone for 120 seconds.',
        '4. Move that single object to where it belongs, then pause and take a slow breath.',
        '5. Decide if you want to touch a second object or return to rest with zero guilt.'
      ]
    },
    faq: [
      { q: 'Why does breaking tasks down help ADHD paralysis?', a: 'ADHD executive dysfunction struggles with working memory overload. When a task has multiple ambiguous subcomponents, the brain perceives it as a monolithic wall. Reducing it to a concrete, physical 2-minute motion requires minimal prefrontal dopamine to execute.' },
      { q: 'What should I do if I cannot even do Step 1?', a: 'Shrink step 1 further: simply wiggle your toes or look at the object without moving toward it. Neurological activation energy can be lowered incrementally until motion occurs.' }
    ]
  },
  {
    slug: 'adhd-task-friction-analyzer',
    title: 'ADHD Task Friction & Activation Energy Auditor [Find Hidden Blockers] | Digital Tools Shed',
    metaDesc: 'Audit why a simple 5-minute task has been delayed for 3 weeks by quantifying physical, emotional, and cognitive friction steps.',
    category: 'ADHD & Executive Function',
    summary: 'Tasks rarely linger because you are lazy; they linger because invisible micro-frictions (ambiguity, sensory dread, missing tools) compound the required activation energy.',
    deepDive: 'In neurodivergent cognition, every additional sub-step (e.g. needing to find tape before packing a box, or not knowing the exact email address) acts as a multiplier on psychological inertia. Identifying and eliminating the single highest-friction dimension often unsticks the entire task.',
    type: 'slider_scale',
    config: {
      sliders: [
        { id: 'f_amb', label: 'Ambiguity / Unclear Next Action', val: 7 },
        { id: 'f_tool', label: 'Missing Physical Tools / Setup', val: 6 },
        { id: 'f_sens', label: 'Sensory Discomfort (Noise, Cold, Texture)', val: 4 },
        { id: 'f_emo', label: 'Emotional Shame / Dread of Scrutiny', val: 8 }
      ],
      highAdvice: 'Compounded friction lock: The task is blocked by emotional shame and ambiguity. Write down the single physical first verb and lower quality standards to 50%.',
      medAdvice: 'Targeted bottleneck: Gather all physical tools in advance before attempting to start the motor sequence.'
    },
    faq: [
      { q: 'What is task friction?', a: 'Task friction encompasses all subtle micro-barriers—cognitive ambiguity, sensory aversion, lack of materials, or emotional dread—that must be overcome before task execution can begin.' },
      { q: 'How does reducing friction help ADHD brains?', a: 'Dopamine-deficient nervous systems have a steep initiation cliff. Lowering friction reduces the dopamine cost required to kickstart the motor cortex.' }
    ]
  },
  {
    slug: 'adhd-dopamine-debt-tracker',
    title: 'ADHD Dopamine Debt & Stimulus Depletion Ledger [Predict Afternoon Crash] | Digital Tools Shed',
    metaDesc: 'Track prefrontal neurotransmitter depletion throughout the day to forecast executive dysfunction crashes and schedule restorative resets.',
    category: 'ADHD & Executive Function',
    summary: 'Executive stamina operates on a finite neurochemical budget. Predict when your focus reserves will hit zero and time your high-stakes tasks accordingly.',
    deepDive: 'Prefrontal tonic dopamine availability fluctuates based on sleep architecture, medication half-life, glucose availability, and emotional strain. When depletion occurs, continued forced concentration triggers intense irritability and executive shutdown.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Hours Slept Last Night (Hours)',
      default1: 6.5,
      min1: 3,
      max1: 12,
      step1: 0.5,
      input2Label: 'Administrative & Clerical Hours Today',
      default2: 4,
      min2: 0,
      max2: 12,
      step2: 0.5,
      calcFormula: 'Math.max(1, Math.round(((v1 / 8) * 7) - (v2 * 0.8)))',
      unitLabel: 'Hours of Peak Focus Remaining',
      insightTemplate: 'High administrative burden rapidly exhausts tonic dopamine. Schedule complex analytical tasks before early afternoon.'
    },
    faq: [
      { q: 'Why do administrative tasks drain ADHD brains faster than creative work?', a: 'Repetitive clerical tasks lack intrinsic novelty or urgent consequences, requiring continuous voluntary prefrontal inhibitory control, which rapidly exhausts tonic dopamine.' },
      { q: 'Can caffeine replace lost sleep for executive function?', a: 'No. Caffeine merely blocks adenosine receptors to mask drowsiness; it does not restore the depleted catecholamines necessary for sustained working memory.' }
    ]
  },
  {
    slug: 'adhd-initiation-barrier-scorer',
    title: 'Executive Dysfunction Task Initiation Barrier Scorer [Before You Spiral] | Digital Tools Shed',
    metaDesc: 'Objectively score psychological task initiation thresholds before guilt and self-loathing set in, with calibrated unsticking protocols.',
    category: 'ADHD & Executive Function',
    summary: 'Quantify your neurological activation threshold on an objective scale to stop moralizing executive failure as a character defect.',
    deepDive: 'The subjective experience of being unable to start a task is frequently misdiagnosed by sufferers as a moral flaw. By measuring working memory load, emotional stakes, and sensory aversion, this tool produces an objective initiation index.',
    type: 'slider_scale',
    config: {
      sliders: [
        { id: 'wm', label: 'Working Memory Load (Sub-tasks to juggle)', val: 6 },
        { id: 'fear', label: 'Fear of Judgment or Criticism', val: 7 },
        { id: 'phys', label: 'Physical Exhaustion / Sleep Debt', val: 5 }
      ],
      highAdvice: 'Executive Gridlock: High working memory and emotional fear are freezing the motor cortex. Discard the task for 30 minutes and perform physical sensory grounding.',
      medAdvice: 'Moderate Drag: Externalize all sub-steps onto scrap paper so working memory is completely offloaded.'
    },
    faq: [
      { q: 'Why do small tasks trigger executive gridlock?', a: 'Emotional stakes and working memory overload are processed in parallel. If a task carries shame, perfectionism, or ambiguous success criteria, the amygdala treats it like an existential threat.' },
      { q: 'How do I distinguish executive dysfunction from lack of discipline?', a: 'Discipline involves a conscious choice to avoid a chore; executive dysfunction involves intense internal distress and desperate desire to do the task while being physically unable to initiate.' }
    ]
  },
  {
    slug: 'adhd-clutter-paralysis-unfucker',
    title: 'ADHD Clutter Paralysis Unfucker [5-Object Room Recovery Algorithm] | Digital Tools Shed',
    metaDesc: 'Clear an overwhelming depression room or ADHD tornado bedroom without decision fatigue using a strict linear category recovery algorithm.',
    category: 'ADHD & Executive Function',
    summary: 'When a room descends into chaos, decision fatigue halts progress. This strict sequential sorter isolates one category at a time, making room cleaning deterministic.',
    deepDive: 'Looking across an untidy room forces the brain to make hundreds of simultaneous sorting decisions (keep, donate, wash, trash). By enforcing a strict sequential filter (Trash first, then Dishes, then Laundry), the visual search space is narrowed to a single dimension.',
    type: 'action_steps',
    config: {
      steps: [
        'Phase 1: Pure Trash (Grab a garbage bag; scan ONLY for wrappers, tissues, and empty cans. Touch nothing else.)',
        'Phase 2: Kitchen Migrants (Collect all cups, plates, and cutlery and deposit them in the kitchen sink. Do not wash yet.)',
        'Phase 3: Fabric & Laundry Avalanche (Scoop all clothing off chairs and floor into a single hamper or corner pile.)',
        'Phase 4: Flat Surface Clear (Clear your desk or bedside table; group items into "belongs here" and "belongs elsewhere".)',
        'Phase 5: Bed Sheet Reset (Smooth your sheets. A flat bed visually anchors the nervous system in order.)'
      ]
    },
    faq: [
      { q: 'Why does general cleaning fail for depression/ADHD rooms?', a: 'General cleaning requires holding sorting rules in mind while picking up arbitrary objects. Enforcing a single item type (only trash, only dishes) eliminates decision fatigue.' },
      { q: 'What if I run out of energy after Phase 1?', a: 'Stopping after Phase 1 is a valid victory. Removing biological trash eliminates foul odors and clutter volume, creating psychological space to rest.' }
    ]
  },
  {
    slug: 'adhd-transition-tax-estimator',
    title: 'ADHD Transition Tax & Context Switching Cost Calculator [Task Switching Overhead] | Digital Tools Shed',
    metaDesc: 'Calculate the actual biological time lost when forced to interrupt a task or switch environments with the 23-minute re-indexing penalty.',
    category: 'ADHD & Executive Function',
    summary: 'Context switching isn\'t instantaneous; neurodivergent brains pay a steep cognitive re-indexing tax every time attention is disrupted.',
    deepDive: 'Research by Dr. Gloria Mark at UC Irvine indicates that it takes an average of 23 minutes and 15 seconds to return to deep focus following an interruption. For individuals with ADHD, this tax is amplified by attentional drift and dopamine hunting.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Daily Interruptions / Task Switches',
      default1: 8,
      min1: 1,
      max1: 30,
      input2Label: 'Re-Indexing Penalty (Minutes)',
      default2: 23,
      min2: 10,
      max2: 45,
      calcFormula: '((v1 * v2) / 60).toFixed(1)',
      unitLabel: 'Hours Lost Daily to Transition Overhead',
      insightTemplate: 'Protecting even two 90-minute blocks of unbroken focus can reclaim 3+ hours of lost transition overhead every workday.'
    },
    faq: [
      { q: 'Why is context switching especially punishing for ADHD?', a: 'Working memory buffers must be completely purged and reloaded with each switch. ADHD brains struggle to re-hydrate mental context without getting sidetracked by secondary novelty.' },
      { q: 'What is the most effective buffer against transition tax?', a: 'Asynchronous communication boundaries and time-blocking into 90-minute monolithic focus chunks.' }
    ]
  },
  {
    slug: 'adhd-waiting-mode-breaker',
    title: 'ADHD Waiting Mode Paralysis Breaker [Appointment at 3 PM Sandbox Simulator] | Digital Tools Shed',
    metaDesc: 'Overcome the inability to start anything before a scheduled appointment with a safe-harbor sandbox time-boxing calculator.',
    category: 'ADHD & Executive Function',
    summary: 'Break out of "waiting mode"—that frozen state where having an appointment at 3 PM makes the entire morning feel unusable.',
    deepDive: 'Waiting mode is an unconscious coping mechanism against time blindness. The brain fears entering hyperfocus and missing an important deadline, so it freezes all forward progress as a defensive safety mechanism.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Hours Until Scheduled Appointment',
      default1: 4,
      min1: 1,
      max1: 12,
      input2Label: 'Travel & Prep Buffer (Hours)',
      default2: 1,
      min2: 0.5,
      max2: 3,
      step2: 0.5,
      calcFormula: 'Math.max(0, (v1 - v2)).toFixed(1)',
      unitLabel: 'Hours of Guilt-Free Safe Sandbox',
      insightTemplate: 'Set an audible alarm for the departure cutoff. Once externalized to an alarm, your subconscious is freed from hypervigilance.'
    },
    faq: [
      { q: 'Why does waiting mode happen?', a: 'It is a hypervigilant defense against time blindness. If you don\'t trust your internal clock, freezing activity ensures you won\'t accidentally lose track of time.' },
      { q: 'How does setting an alarm break waiting mode?', a: 'Externalizing the vigilance into an audible alarm offloads the monitoring burden from your working memory, freeing brain capacity to engage in other tasks.' }
    ]
  },
  {
    slug: 'adhd-hobby-graveyard-auditor',
    title: 'ADHD Hyperfixation Hobby Graveyard [Sunk Cost Value & Tuition Auditor] | Digital Tools Shed',
    metaDesc: 'Convert financial investment and unspent emotional guilt across abandoned hyperfixations into valuable dopamine research tuition.',
    category: 'ADHD & Executive Function',
    summary: 'Transform the guilt of abandoned guitars, 3D printers, and sourdough gear into an objective ledger of creative exploration.',
    deepDive: 'The ADHD brain seeks dopamine through intense, rapid skill acquisition. Once the steep learning curve flattens and novelty decays, interest drops. Reframing the expense as "tuition for dopamine R&D" neutralizes toxic sunk-cost guilt.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Total Spent on Abandoned Gear ($)',
      default1: 450,
      min1: 20,
      max1: 5000,
      step1: 10,
      input2Label: 'Hours of Hyperfocused Joy Extracted',
      default2: 35,
      min2: 1,
      max2: 500,
      step2: 1,
      calcFormula: '(v1 / Math.max(1, v2)).toFixed(2)',
      unitLabel: '$ / Hour of Dopamine Tuition',
      insightTemplate: 'If your cost per hour is comparable to a movie ticket ($10-15/hr), the hobby was cheap entertainment. Forgive yourself and donate or sell the gear.'
    },
    faq: [
      { q: 'Is it bad to abandon hobbies after 2 weeks?', a: 'No. The goal of hyperfixation was curiosity and dopamine extraction, not professional mastery. You extracted the learning value you sought.' },
      { q: 'What is the healthy rule for dealing with unused gear?', a: 'Place it in a designated "hibernation box" with a 6-month date. If untouched, sell or gift it without guilt.' }
    ]
  },
  {
    slug: 'adhd-email-reply-paralysis-crusher',
    title: 'Unsent Email & Text Reply Paralysis Generator [3 Micro-Sentence Templates] | Digital Tools Shed',
    metaDesc: 'Break the shame spiral of unreplied messages with 3-sentence templates that acknowledge delay without groveling or fake excuses.',
    category: 'ADHD & Executive Function',
    summary: 'The longer an email sits unreplied, the heavier the shame tax becomes. Crush message paralysis with clean, dignity-preserving micro-templates.',
    deepDive: 'ADHD avoidance is fueled by shame: sufferers feel they must write an exhaustive explanation apologizing for the delay. In reality, recipients vastly prefer a crisp 2-sentence resolution over a dramatic confession.',
    type: 'cbt_reframing',
    config: {
      defaultThought: 'I haven\'t replied in 3 weeks; they must think I am unprofessional, incompetent, and rude',
      distortionName: 'Catastrophic Social Dread & Shame Avoidance',
      realityCheck: 'Recipients care about getting the answer, not your autobiography. A brief, courteous message resolves the friction immediately.',
      calibratedText: 'Hi [Name], thank you for your patience while this was delayed on my end. Regarding [Task]: [1-sentence answer]. Let me know if you need anything further!'
    },
    faq: [
      { q: 'Why shouldn\'t I write a long apology explaining my life difficulties?', a: 'Long confessions make the recipient feel obligated to provide emotional comfort, increasing conversational burden. A concise, professional thank you preserves dignity.' },
      { q: 'What is the golden rule of delayed email etiquette?', a: 'Always replace "Sorry for the delay" with "Thank you for your patience."' }
    ]
  },
  {
    slug: 'adhd-body-doubling-virtual-timer',
    title: 'Virtual Silent Body Double [15-Minute Focus Sprint Accountability Pacer] | Digital Tools Shed',
    metaDesc: 'Provide a minimalist client-side body doubling visual presence with gentle periodic focus pings to anchor scattered ADHD attention.',
    category: 'ADHD & Executive Function',
    summary: 'The presence of another human anchored in work stabilizes ADHD mirror neurons. Experience silent virtual body-doubling in 15-minute sprints.',
    deepDive: 'Body doubling leverages social facilitation and neuroceptive safety cues. When another presence is visible or rhythmically co-present, the brain suppresses impulsive novelty-seeking reflexes.',
    type: 'somatic_timer',
    config: {
      defaultTimer: '15:00',
      durationSecs: 900,
      initialPhase: 'Silent Co-Working Active',
      phases: ['Deep sprint: stay on primary task', 'Midway check: breathe and sip water', 'Final 5 minutes: round out the current sub-step', 'Sprint complete: stretch shoulders'],
      somaticInstructions: 'Keep this timer visible in a peripheral window while working. The rhythm anchors working memory against distraction impulses.'
    },
    faq: [
      { q: 'What is body doubling?', a: 'Body doubling is an ADHD productivity strategy where the presence of another person engaged in focused activity keeps the ADHD individual accountable and anchored.' },
      { q: 'Why is 15 minutes the ideal sprint duration?', a: '15 minutes is short enough that prefrontal dread is minimized, yet long enough to gain neurological momentum through task initiation.' }
    ]
  },

  // 11-20: Cognitive Distortions & CBT
  {
    slug: '2am-decision-circuit-breaker',
    title: '2 AM Decision Circuit Breaker [Should I Decide Now or Sleep on It?] | Digital Tools Shed',
    metaDesc: 'Triage impulsive late-night life decisions with a HALT cognitive audit and secure 10-hour cooling-off time-lock vault.',
    category: 'Cognitive Distortions & CBT',
    summary: 'Nothing good was ever drafted, texted, or decided at 2:14 AM. Audit your biological vulnerability before committing irreversible life moves.',
    deepDive: 'Between 1 AM and 5 AM, prefrontal cortex executive control experiences natural circadian nadir, while amygdala reactivity spikes. Decisions made during this window suffer from severe emotional myopia and dopamine craving.',
    type: 'cbt_reframing',
    config: {
      defaultThought: 'I need to send this heated 5-paragraph text or make this life change right now at 2 AM',
      distortionName: 'Nocturnal Emotional Myopia & Amygdala Surge',
      realityCheck: 'You are operating under depleted prefrontal inhibition. A 10-hour delay carries zero downside and eliminates 95% of catastrophic relationship regret.',
      calibratedText: 'I will lock this draft in my local vault. If it still feels essential tomorrow at 12:00 PM after food and sunlight, I can send it then.'
    },
    faq: [
      { q: 'Why do late night decisions feel so profoundly urgent?', a: 'Fatigue degrades frontal lobe inhibition, causing the brain to interpret emotional impulses as urgent survival imperatives.' },
      { q: 'Will I still care about this decision tomorrow at noon?', a: 'In over 85% of cases, the intense emotional urgency evaporates after 7 hours of sleep and daylight cortisone stabilization.' }
    ]
  },
  {
    slug: 'catastrophizing-severity-meter',
    title: 'Catastrophic Thinking Scale [Realistic Mathematical Probability Decoupler] | Digital Tools Shed',
    metaDesc: 'Audit worst-case scenario spirals and calculate the actual mathematical base-rate probability of the feared catastrophe.',
    category: 'Cognitive Distortions & CBT',
    summary: 'Catastrophizing multiplies three unlikely disasters together and treats the compound worst-case as a certainty. Decouple your fears mathematically.',
    deepDive: 'Catastrophic cognitive distortions treat conditional probabilities as additive rather than multiplicative: $P(A \\cap B \\cap C) = P(A) \\times P(B|A) \\times P(C|B)$. A chain of three 10% events yields an actual joint probability of 0.1%, yet anxiety feels it as 99%.',
    type: 'slider_scale',
    config: {
      sliders: [
        { id: 'pA', label: 'Probability Event A occurs (e.g. boss dislikes draft)', val: 3 },
        { id: 'pB', label: 'Probability they fire you as a direct result', val: 2 },
        { id: 'pC', label: 'Probability you cannot find another job and go bankrupt', val: 1 }
      ],
      highAdvice: 'Severe Catastrophic Spiral: You are treating three dependent low-probability events as an absolute certainty. The actual joint odds are less than 1 in 1,000.',
      medAdvice: 'Moderate Fear Inflation: Isolate Step 1. Focus solely on making the draft acceptable rather than planning for bankruptcy.'
    },
    faq: [
      { q: 'Why does catastrophizing feel so persuasive?', a: 'Evolutionary survival prioritized false positives (assuming a rustle in the bushes is a tiger) over false negatives. The brain would rather terrify you than risk vulnerability.' },
      { q: 'How does math break catastrophizing?', a: 'Calculating the product of conditional probabilities forces the prefrontal cortex to override emotional threat inflation with objective base rates.' }
    ]
  },
  {
    slug: 'black-and-white-thinking-recalibrator',
    title: 'All-or-Nothing Cognitive Distortion Recalibrator [Find the 50 Shades of Gray] | Digital Tools Shed',
    metaDesc: 'Identify binary success vs total failure cognitive traps and construct a continuous 1–10 spectrum of nuance with CBT recalibration.',
    category: 'Cognitive Distortions & CBT',
    summary: 'Dismantle polarized all-or-nothing thinking by finding the realistic spectrum between perfection and catastrophe.',
    deepDive: 'Splitting is an immature defense mechanism where situations are categorized as 100% flawless or 100% ruined. Continuum thinking maps life into the messy, resilient 80% middle ground where human progress actually happens.',
    type: 'slider_scale',
    config: {
      sliders: [
        { id: 'perfection', label: 'Perceived Standard (1 = Pure Ruin, 10 = Flawless)', val: 4 }
      ],
      highAdvice: 'Perfectionism Trap: Striving for Level 9-10 guarantees chronic feelings of failure. Scale back expectations to Level 5-6 (Solid Human Competence).',
      medAdvice: 'Nuanced Reality: Level 4-6 is where real-world products ship and human relationships thrive.'
    },
    faq: [
      { q: 'What is dichotomous thinking?', a: 'Dichotomous thinking is a cognitive distortion where experiences are evaluated in black-and-white categories with no middle ground.' },
      { q: 'How does finding the shades of gray reduce anxiety?', a: 'It allows you to accept an outcome as "good enough" rather than abandoning it entirely when it fails to achieve perfection.' }
    ]
  },
  {
    slug: 'mind-reading-fallacy-checker',
    title: 'Mind Reading & Assumption Stress-Tester [Do They Hate Me? Cognitive Auditor] | Digital Tools Shed',
    metaDesc: 'Deconstruct the conviction that a colleague or partner is silently furious with 5 alternative non-malicious hypotheses.',
    category: 'Cognitive Distortions & CBT',
    summary: 'We project our internal insecurities onto the silence of others. Test the "Do they hate me?" reflex against observable evidence.',
    deepDive: 'Mind reading assumes we know the unspoken motives and feelings of others without corroborating proof. In over 90% of instances, short messages or delayed replies reflect the other person\'s cognitive bandwidth, not their opinion of you.',
    type: 'cbt_reframing',
    config: {
      defaultThought: 'They sent a one-word text without an exclamation mark; they must be secretly furious with me',
      distortionName: 'Mind Reading & Arbitrary Inference',
      realityCheck: 'You have zero telepathic data. They are likely exhausted, driving, wrangling a child, or managing their own stressful day.',
      calibratedText: 'I do not have proof of anger. Hanlon\'s Razor reminds me that brevity is almost always fatigue or busyness, not malice.'
    },
    faq: [
      { q: 'Why do I automatically assume people are angry at me?', a: 'Children raised in volatile or hyper-critical environments develop hypervigilance as an early warning system to avoid punishment.' },
      { q: 'What is Hanlon\'s Razor?', a: 'Never attribute to malice that which is adequately explained by fatigue, distraction, or incompetence.' }
    ]
  },
  {
    slug: 'emotional-reasoning-untangler',
    title: 'Emotional Reasoning Untangler [I Feel Like a Failure, But Am I?] | Digital Tools Shed',
    metaDesc: 'Decouple internal emotional feelings from external factual realities with a two-column CBT evidence cross-examiner.',
    category: 'Cognitive Distortions & CBT',
    summary: 'Feelings are biological sensations, not court-admissible facts. Cross-examine the feeling "I am incompetent" with tangible proof.',
    deepDive: 'Emotional reasoning operates under the false syllogism: "I feel anxious and useless, therefore I must be in danger and incompetent." Interrogating the factual ledger restores epistemic accuracy.',
    type: 'cbt_reframing',
    config: {
      defaultThought: 'I feel deeply inadequate today, so I must be fundamentally unqualified for my role',
      distortionName: 'Emotional Reasoning (Affective Fallacy)',
      realityCheck: 'A feeling of inadequacy is an internal somatic state of exhaustion, not an external performance evaluation.',
      calibratedText: 'I am experiencing the physiological emotion of inadequacy, but external reality proves I meet all core performance requirements.'
    },
    faq: [
      { q: 'Can feelings ever be facts?', a: 'Feelings are real neurochemical events happening inside your body, but they are subjective reactions rather than objective assessments of external truth.' },
      { q: 'How do I stop emotional reasoning in real time?', a: 'Say to yourself: "I am feeling X, but that does not make X true in the physical world."' }
    ]
  },
  {
    slug: 'should-statement-detoxifier',
    title: 'The Should Statement Detoxifier [Tyranny of the Demands Auditor] | Digital Tools Shed',
    metaDesc: 'Eliminate punitive internal should and must demands that cause chronic guilt, reframing them into preferences and choices.',
    category: 'Cognitive Distortions & CBT',
    summary: 'Karen Horney called it the "tyranny of the shoulds." Convert rigid demands into flexible, self-compassionate choices.',
    deepDive: '"Should" statements create an adversarial relationship between you and your own nervous system. Transforming "I should exercise" into "I choose to exercise because it reduces my back pain" restores autonomous agency.',
    type: 'cbt_reframing',
    config: {
      defaultThought: 'I should be waking up at 5:30 AM and running 5 miles every day like disciplined people do',
      distortionName: 'Tyranny of the Shoulds (Imperative Coercion)',
      realityCheck: 'Moralizing sleep and exercise schedules triggers autonomic rebellion and guilt-driven procrastination.',
      calibratedText: 'I choose to sleep enough to support my brain, and I prefer to move my body in ways that feel sustainable.'
    },
    faq: [
      { q: 'Why are should statements harmful?', a: 'They generate resentment and rebellion. When you tell yourself you "should" do something, your psyche perceives it as external coercion and pushes back with procrastination.' },
      { q: 'What is the alternative to "should"?', a: 'Use "I prefer to", "It would be wise to", or "I choose to."' }
    ]
  },
  {
    slug: 'personalization-blame-separator',
    title: 'Personalization & Blame Boundary Separator [What Is Actually Your Fault?] | Digital Tools Shed',
    metaDesc: 'Stop taking 100% emotional responsibility for external events, team failures, and bad moods with a 4-way attribution allocator.',
    category: 'Cognitive Distortions & CBT',
    summary: 'You are an actor in a complex universe, not the sole author of everyone else\'s happiness and failure.',
    deepDive: 'Personalization is the distortion of holding yourself responsible for events not entirely under your control. Dividing responsibility into realistic pie slices dissolves excessive guilt.',
    type: 'slider_scale',
    config: {
      sliders: [
        { id: 'sys', label: 'Systemic / Environmental Chaos', val: 5 },
        { id: 'oth', label: 'Other People\'s Independent Agency', val: 5 },
        { id: 'luck', label: 'Pure Chance / Bad Timing', val: 4 },
        { id: 'me', label: 'Your Direct Personal Input', val: 2 }
      ],
      highAdvice: 'You are taking healthy accountability for your direct share, while releasing the 80% governed by external systems and chance.',
      medAdvice: 'Balance your attribution: you cannot control other people\'s emotional reactions or macro-economic delays.'
    },
    faq: [
      { q: 'What is personalization in psychology?', a: 'Personalization is an egocentric cognitive distortion where you take personal blame for negative events outside your sphere of control.' },
      { q: 'Why do people personalize so often?', a: 'Blaming yourself provides a false illusion of control: if everything was your fault, then theoretically you have the power to fix everything.' }
    ]
  },
  {
    slug: 'mental-filter-negativity-balancer',
    title: 'Mental Filter Negativity Balancer [Audit Your Disqualified Positives] | Digital Tools Shed',
    metaDesc: 'Audit the selective cognitive filter that magnifies one critique while discarding 9 positive affirmations with equal-weight balancing.',
    category: 'Cognitive Distortions & CBT',
    summary: 'The brain acts like Velcro for negative feedback and Teflon for praise. Restore epistemic balance by cataloging disqualified positives.',
    deepDive: 'The selective abstraction distortion fixates on a single drop of ink in a glass of water, declaring the entire vessel polluted. Forcing a 3-to-1 ratio of positive facts counters evolutionary negativity bias.',
    type: 'cbt_reframing',
    config: {
      defaultThought: 'One stakeholder criticized my proposal, so the entire project is an embarrassing failure',
      distortionName: 'Selective Abstraction & Negativity Filtering',
      realityCheck: 'Ten other stakeholders approved without issue. One dissenting opinion is feedback on a detail, not an invalidation of the whole.',
      calibratedText: 'I will address the valid portion of the critique while holding space for the 90% of the project that was celebrated.'
    },
    faq: [
      { q: 'Why do negative comments hurt so much more than praise?', a: 'Evolutionary survival prioritized avoiding fatal danger over savoring rewards. The amygdala processes threat 5x faster than dopamine-mediated praise.' },
      { q: 'What is disqualifying the positive?', a: 'It is the cognitive trick of explaining away accomplishments ("They were just being polite", "It was pure luck").' }
    ]
  },
  {
    slug: 'imposter-competence-evidence-vault',
    title: 'Imposter Syndrome Competence Vault [Objective Fact-Based Ledger] | Digital Tools Shed',
    metaDesc: 'Combat imposter feelings by building a persistent, objective ledger of tangible outcomes, skills, and certifications.',
    category: 'Cognitive Distortions & CBT',
    summary: 'Imposter syndrome thrives in the vagueness of emotion. Starve it with hard, verifiable metrics and deliverables.',
    deepDive: 'High achievers frequently attribute their success to external luck or deception. Maintaining a written, audited ledger of shipped code, certifications, and solved crises makes it mathematically impossible to sustain the belief that you fooled everyone.',
    type: 'diagnostic_quiz',
    config: {
      questions: [
        'I have delivered functional projects that solved real problems for users or employers.',
        'I have successfully debugged incidents that other people struggled to diagnose.',
        'Colleagues or clients have independently sought my advice on technical or operational matters.',
        'I have held responsibilities for over 12 months without external systems collapsing.'
      ],
      highText: 'Unshakeable Fact Ledger: You have repeatedly produced verifiable outcomes. Random luck does not consistently ship working deliverables over multi-year horizons.',
      medText: 'Solid Base of Competence: You have verified achievements. Remind yourself that feeling out of your depth is simply the feeling of learning.'
    },
    faq: [
      { q: 'What causes imposter syndrome?', a: 'A mismatch between your internal awareness of your own doubts/flaws and the polished external image you see in others.' },
      { q: 'Can imposter syndrome ever be cured?', a: 'Rather than seeking a cure, high performers learn to recognize imposter feelings as a sign they are operating at the growth edge of their competence.' }
    ]
  },
  {
    slug: 'burnout-vs-laziness-diagnostic',
    title: 'Burnout vs Laziness Differential Diagnostic [Nervous System Exhaustion Checker] | Digital Tools Shed',
    metaDesc: 'Differentiate moralized self-blame from neuroendocrine nervous system exhaustion across 12 clinical indicators.',
    category: 'Cognitive Distortions & CBT',
    summary: 'Laziness is an active choice to enjoy leisure over labor. Burnout is a biological inability to function accompanied by relentless guilt.',
    deepDive: 'Clinical burnout involves hypocortisolemia, depleted dopamine reserves, and autonomic dorsal vagal shutdown. Sufferers desperately want to be productive but are physically paralyzed. Laziness produces relaxed contentment; burnout produces intense shame and despair.',
    type: 'diagnostic_quiz',
    config: {
      questions: [
        'When resting or attempting to relax, I feel acute guilt and self-loathing.',
        'Activities and hobbies I used to love now feel like exhausting, burdensome obligations.',
        '9 hours of sleep does not restore my energy; I awaken feeling as exhausted as when I went to bed.',
        'Simple decisions (e.g. choosing what to eat for dinner) trigger decision paralysis.',
        'My empathy feels blunted; I feel cynical, detached, or numb.'
      ],
      highText: 'Clinical Nervous System Burnout: You are suffering from neuroendocrine exhaustion. The defining marker is guilt: lazy people enjoy leisure, while burned-out individuals agonize over their paralysis. Forcing more discipline will deepen the damage. You need somatic rest.',
      medText: 'Early Burnout Overload: You are near regulatory exhaustion. Institute strict boundaries around work hours and screen time.'
    },
    faq: [
      { q: 'What is the single biggest difference between burnout and laziness?', a: 'Guilt and recovery response. Burnout cannot be cured by a weekend off and is racked with shame; laziness is intentional and pleasurable.' },
      { q: 'How long does it take to recover from clinical burnout?', a: 'True neuroendocrine burnout typically takes 3 to 18 months of structural lifestyle change and nervous system regulation.' }
    ]
  },

  // 21-31: Nocturnal Mind, Insomnia & Somatics
  {
    slug: 'social-battery-depletion-meter',
    title: 'Social Battery Depletion Meter [Introvert Recharge Duration Estimator] | Digital Tools Shed',
    metaDesc: 'Model the drain rate of cocktail parties, team meetings, and small talk to calculate necessary hours of quiet solitude.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'Quantify your social energy expenditure in mAh and calculate the exact hours of solitude needed to restore nervous system baseline.',
    deepDive: 'Introverted and neurodivergent nervous systems allocate heavy prefrontal bandwidth to social monitoring and facial decoding. Once the social reserve hits 0%, sensory overstimulation triggers acute shutdown or irritability.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Social Event Duration (Hours)',
      default1: 4,
      min1: 1,
      max1: 12,
      input2Label: 'Crowd & Masking Intensity (1=Low, 3=High)',
      default2: 2.5,
      min2: 1,
      max2: 3,
      step2: 0.5,
      calcFormula: '(v1 * v2 * 1.2).toFixed(1)',
      unitLabel: 'Hours of Solitude Required to Regulate',
      insightTemplate: 'Put your phone on airplane mode. Low-stimulus solitude (reading, solo walking, resting in dark) is medical recovery for an exhausted social nervous system.'
    },
    faq: [
      { q: 'Why do introverts get physically exhausted from talking?', a: 'Introverts process social interaction through acetylcholine and dopamine pathways that require higher internal cognitive processing compared to extroverts.' },
      { q: 'What counts as true social recharging?', a: 'Solitary activities with low demands: solo walking, reading, gaming without voice chat, and sleeping in a dark room.' }
    ]
  },
  {
    slug: 'overthinking-thought-loop-interrupter',
    title: 'Overthinking Loop Interrupter [3-Minute Cognitive Pattern-Interrupt Engine] | Digital Tools Shed',
    metaDesc: 'Break persistent late-night mental loops and rumination spirals with rapid bilateral visual stimulation and cognitive disruption.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'When the brain gets stuck in a 2 AM repetitive loop, logical reasoning only fuels the spiral. Interrupt the neural track with bilateral ocular stimulation.',
    deepDive: 'Ruminative loops hijack the default mode network (DMN). Research into EMDR and saccadic eye movements shows that forced lateral eye movement demands working memory bandwidth, physically preventing the prefrontal cortex from sustaining the loop.',
    type: 'somatic_timer',
    config: {
      defaultTimer: '01:00',
      durationSecs: 60,
      initialPhase: 'Bilateral Tracking Ready',
      phases: ['Follow visual anchor left-to-right', 'Keep head still; move only eyes', 'Notice peripheral breathing', 'Loop interruption complete'],
      somaticInstructions: 'Follow the lateral movement with your eyes while keeping your neck still. This taxes the visuospatial buffer, collapsing the mental rumination loop.'
    },
    faq: [
      { q: 'How does bilateral eye movement stop rumination?', a: 'Eye movements tax the visuospatial sketchpad in working memory, disrupting the emotional vividness of intrusive thoughts.' },
      { q: 'Why is rumination worse in bed at night?', a: 'Sensory deprivation and lying flat in the dark removes competing external stimuli, allowing internal threat-scanning to monopolize awareness.' }
    ]
  },
  {
    slug: 'existential-dread-grounding-oracle',
    title: 'Existential Dread Somatic Grounding Sequence [When the Void Stares Back] | Digital Tools Shed',
    metaDesc: 'Immediate nervous system stabilization when suddenly overwhelmed by cosmic scale, mortality, or meaninglessness.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'When cosmic insignificance triggers acute vertigo, return from the abstract void to your mammalian body.',
    deepDive: 'Existential dread occurs when abstract philosophical contemplation dislodges somatic interoceptive grounding. Grounding the nervous system via tactile weight and physiological sighs resets the autonomic nervous system.',
    type: 'somatic_timer',
    config: {
      defaultTimer: '03:00',
      durationSecs: 180,
      initialPhase: 'Somatic Re-Anchoring',
      phases: ['Physiological double-sigh: two quick sniffs in, long mouth exhale', 'Press heels firmly into the ground', 'Name 3 physical textures in your room', 'Notice your body breathing itself'],
      somaticInstructions: 'You do not need to solve the universe tonight. Focus on the physical temperature of your hands and feet.'
    },
    faq: [
      { q: 'What is a physiological sigh?', a: 'A dual-inhalation followed by an extended exhalation that collapses alveoli back open and rapidly drops heart rate by stimulating the vagus nerve.' },
      { q: 'Why does existential dread feel like falling?', a: 'Losing metaphysical certainty triggers vestibular and postural panic in the brainstem, mimicking physical freefall.' }
    ]
  },
  {
    slug: 'revenge-bedtime-procrastination-tax',
    title: 'Revenge Bedtime Procrastination Cost Calculator [Tomorrow\'s Borrowed Energy] | Digital Tools Shed',
    metaDesc: 'Calculate the exact cognitive and metabolic penalty of trading sleep for late-night scrolling.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'We stay up late because it is the only time nobody demands anything from us. See what that borrowed freedom actually costs tomorrow.',
    deepDive: 'Revenge bedtime procrastination is an attempt to reclaim personal autonomy after a day of zero control. However, each hour delayed carries an escalating metabolic penalty in elevated ghrelin (hunger) and prefrontal fatigue.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Hours of Sleep Stolen Tonight',
      default1: 2.5,
      min1: 0.5,
      max1: 6,
      step1: 0.5,
      input2Label: 'Estimated Tomorrow Hourly Wage / Value ($)',
      default2: 35,
      min2: 15,
      max2: 200,
      calcFormula: 'Math.round(v1 * 130)',
      unitLabel: 'Extra Sugar/Carb Calories Craved Tomorrow (Ghrelin Spike)',
      insightTemplate: 'Trading 2.5 hours of sleep costs you 325+ kcal of metabolic cravings and drops reaction time by 20%.'
    },
    faq: [
      { q: 'Why is it called "revenge" bedtime procrastination?', a: 'Because individuals feel they are getting revenge on their daytime schedule by stealing nighttime hours for personal freedom.' },
      { q: 'How can I stop revenge bedtime scrolling?', a: 'Schedule guaranteed, guilt-free unstructured leisure earlier in the evening rather than leaving it to midnight.' }
    ]
  },
  {
    slug: 'chronological-loneliness-estimator',
    title: 'Chronological Loneliness Calculator [How Many Souls Are Awake Looking at the Ceiling?] | Digital Tools Shed',
    metaDesc: 'Calculate how many people in your time zone and globally are currently awake, lonely, and staring at their ceiling.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'You feel solitary at 2:30 AM, but mathematically you are surrounded by an invisible city of fellow awake minds.',
    deepDive: 'Insomnia feels isolating because sensory isolation creates the illusion of being the last human alive. Epidemiological circadian studies confirm that roughly 10% to 15% of the adult population in any given time zone is awake between 2 AM and 4 AM.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Regional Population (Millions)',
      default1: 45,
      min1: 5,
      max1: 500,
      input2Label: 'Estimated Late-Night Awake Fraction (%)',
      default2: 12,
      min2: 5,
      max2: 25,
      calcFormula: 'Math.round((v1 * 1000000) * (v2 / 100))',
      unitLabel: 'Fellow Souls Awake Looking at the Ceiling Right Now',
      insightTemplate: 'You are alone in your room, but sharing the quiet human condition with millions of other thinkers and watchers.'
    },
    faq: [
      { q: 'Why does night-time loneliness feel so much more acute?', a: 'Darkness suppresses visual reassurance of human civilization while circadian rhythms lower mood-regulating serotonin.' },
      { q: 'What is the "communion of the night"?', a: 'The realization that nighttime wakefulness is a shared biological trait linking millions of thinkers, artists, and parents worldwide.' }
    ]
  },
  {
    slug: 'nostalgia-pain-index-calculator',
    title: 'Nostalgia Pain Index [Psychological Yearning & Chrono-Distance Metric] | Digital Tools Shed',
    metaDesc: 'Quantify the emotional ache of yearning for a past era and measure chronological distance against memory divergence.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'Yearning for 2012 or college summers isn\'t just remembering; it is mourning a version of yourself that no longer exists.',
    deepDive: 'Nostalgia (from Greek *nostos* return home, and *algos* pain) is literally the ache of an impossible return. Memory systematically polishes away the boredom and dread of the past, leaving an idealized illusion.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Year Yearned For (e.g. 2014)',
      default1: 2014,
      min1: 1980,
      max1: 2025,
      input2Label: 'Current Life Stress (1 to 10)',
      default2: 7,
      min2: 1,
      max2: 10,
      calcFormula: '(2026 - v1)',
      unitLabel: 'Years of Chronological Distance',
      insightTemplate: 'Memory polishes away past boredom and uncertainty. You miss the lack of current responsibility, not the actual mundane reality of that year.'
    },
    faq: [
      { q: 'Why does nostalgia hurt physically?', a: 'Nostalgia activates the dorsal anterior cingulate cortex, the same neural region that processes physical visceral pain.' },
      { q: 'Can nostalgia be useful?', a: 'Yes. Nostalgia provides existential coherence, reminding you that your identity has survived transitions and reinventions before.' }
    ]
  },
  {
    slug: 'quarter-life-crisis-stage-evaluator',
    title: 'Quarter-Life Crisis Diagnostic [The 5 Phases of Identity Recalibration] | Digital Tools Shed',
    metaDesc: 'Evaluate progress through the 5 documented stages of quarter-life crisis from locked-in trap to authentic rebuilding.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'In your 20s and early 30s, the blueprint runs out. Diagnose where you are in the 5 developmental phases of the quarter-life crisis.',
    deepDive: 'Dr. Oliver Robinson identified five discrete phases of the quarter-life crisis: Locked-in, Separation, Exploration, Rebuilding, and Resolution. Anxiety peaks during the separation phase before stabilizing into authentic autonomy.',
    type: 'dilemma_choice',
    config: {
      scenario: 'Select your current dominant developmental state:',
      options: [
        { title: 'Phase 1: Locked-In', school: 'The Institutional Trap', desc: 'Following the expected script (job, lease, partner) while feeling hollow and disconnected.', consequence: 'The pressure to conform is reaching a breaking point. Acknowledge your discontent.' },
        { title: 'Phase 2: Separation', school: 'The Void of Severance', desc: 'Leaving the old job, degree, or relationship; navigating terrifying groundlessness.', consequence: 'High acute anxiety is normal. You have dismantled the false life; the new one has not yet formed.' },
        { title: 'Phase 3: Exploration', school: 'The Wandering Sandbox', desc: 'Trying random projects, new cities, and temporary arrangements with zero certainty.', consequence: 'Embrace experimentation. Tolerate low prestige in exchange for self-discovery.' },
        { title: 'Phase 4: Rebuilding', school: 'Autonomous Commitment', desc: 'Constructing daily habits, relationships, and work aligned with internal values.', consequence: 'You are moving into grounded psychological adulthood.' }
      ]
    },
    faq: [
      { q: 'Is a quarter-life crisis a medical illness?', a: 'No, it is a healthy developmental individuation crisis where you transition from societal expectations to internal authority.' },
      { q: 'How long does a quarter-life crisis usually last?', a: 'Research indicates an average trajectory of 1.5 to 3 years from initial dissatisfaction to stable resolution.' }
    ]
  },
  {
    slug: 'midlife-existential-audit',
    title: 'Midlife Existential Reckoning [Unlived Lives vs Cherished Reality] | Digital Tools Shed',
    metaDesc: 'Process the grief of closing doors and unchosen paths without sabotaging current stability using Kierkegaardian reconciliation.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'To choose one life is to kill all other potential lives. Reconcile the grief of unlived paths.',
    deepDive: 'Søren Kierkegaard wrote: "Marry, and you will regret it; do not marry, and you will also regret it." In midlife, the realization that doors are closing forever triggers panic. Healing comes from integrating unlived desires in micro-doses into present life.',
    type: 'cbt_reframing',
    config: {
      defaultThought: 'I chose stability and now my youth is gone and I missed my true calling',
      distortionName: 'Counterfactual Idealization of Unlived Paths',
      realityCheck: 'Every choice requires sacrifice. The alternative path seems magical only because you never had to live its mundane tax and heartbreak.',
      calibratedText: 'I chose this reality courageously. I will honor my unlived passions by integrating them in weekly micro-doses rather than burning down my life.'
    },
    faq: [
      { q: 'Why does midlife crisis involve impulsive purchases or affairs?', a: 'They are desperate attempts to resurrect youth and reopen closed developmental doors.' },
      { q: 'How do you overcome regret of unchosen careers?', a: 'Recognize that every chosen path carries boredom and friction; the imagined path only seems perfect because you never had to live its mundane realities.' }
    ]
  },
  {
    slug: 'late-night-hypochondria-reality-check',
    title: 'Late-Night WebMD Hypochondria Reality Check [Statistical Base-Rate Auditor] | Digital Tools Shed',
    metaDesc: 'Stop 2 AM disease panic after searching mild symptoms online with Bayesian epidemiological base-rate reality checks.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'WebMD will tell you a muscle twitch is motor neurone disease. Audit the 1-in-500,000 base rates before panicking.',
    deepDive: 'Hypochondria ignores base rates: rare catastrophic illnesses dominate online search engines because they attract clicks. Bayes\' theorem proves that given a non-specific symptom (fatigue, headache), the prior probability of common benign causes (dehydration, eye strain) is 99.98%.',
    type: 'slider_scale',
    config: {
      sliders: [
        { id: 'anx', label: 'Perceived Threat Severity', val: 9 },
        { id: 'fatigue', label: 'Fatigue / Sleep Debt', val: 8 },
        { id: 'caffeine', label: 'Caffeine / Stimulant Intake', val: 7 }
      ],
      highAdvice: 'False Alarm Protocol: Muscle twitches, palpitations, and tension headaches are 99.9% caused by adrenaline, caffeine, and screen fatigue. Turn off your screen and drink water.',
      medAdvice: 'Base-Rate Grounding: Rare diseases have base rates of 1 in 100,000. Dehydration has a base rate of 1 in 2.'
    },
    faq: [
      { q: 'Why does Googling symptoms always lead to cancer?', a: 'Search engine algorithms rank medical articles based on worst-case liability and click volume, skewing results toward rare fatal conditions.' },
      { q: 'How does adrenaline cause muscle twitches and palpitations?', a: 'Anxiety floods muscles with calcium ions and catecholamines, causing hyper-excitability in nerve endings.' }
    ]
  },
  {
    slug: 'sleep-paralysis-hypnagogic-risk-audit',
    title: 'Sleep Paralysis & Hypnagogic Jerk Trigger Auditor [Sleep Hygiene Risk Checklist] | Digital Tools Shed',
    metaDesc: 'Evaluate physiological vulnerability to sleep paralysis episodes and hypnagogic hallucinations with an evidence checklist.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'Sleep paralysis is an accidental desynchronization of REM atonia and consciousness. Audit your tonight risk factors.',
    deepDive: 'During REM sleep, the pons paralyzes skeletal muscles (REM atonia) to prevent acting out dreams. Sleep paralysis occurs when the cortex awakens while atonia remains active, often triggering the "intruder hallucination" from amygdala hyper-arousal.',
    type: 'diagnostic_quiz',
    config: {
      questions: [
        'I plan to sleep flat on my back (supine posture increases episodes 5x).',
        'I have accumulated >4 hours of sleep debt this week.',
        'I consumed alcohol or high caffeine within 4 hours of bedtime.',
        'My schedule has been erratic (jet lag, late shifts, or sudden sleep schedule shifts).'
      ],
      highText: 'Elevated Risk Tonight: Roll onto your side. Sleeping in the lateral position physically decreases airway resistance and inhibits premature waking during REM.',
      medText: 'Moderate Vulnerability: Maintain a side-sleeping posture and keep a dim nightlight if nocturnal awakenings cause panic.'
    },
    faq: [
      { q: 'Is sleep paralysis dangerous?', a: 'No. Despite intense terror, breathing remains automated by the autonomic nervous system and the heart is unharmed.' },
      { q: 'How can you break out of sleep paralysis?', a: 'Focus solely on wiggling a single toe or blinking rapidly. Small peripheral motor movements trigger cortical re-synchronization.' }
    ]
  },
  {
    slug: 'circadian-phase-delay-recalculator',
    title: 'Delayed Sleep Phase Syndrome vs Normal Insomnia Calculator [Circadian Reset Plan] | Digital Tools Shed',
    metaDesc: 'Determine if your 2 AM wakefulness is psychological insomnia or biological delayed circadian rhythm with light-shift schedules.',
    category: 'Sleep & Nocturnal Mind',
    summary: 'If you can\'t sleep at midnight but sleep like a baby between 3 AM and 11 AM, you don\'t have insomnia—you have DSPS.',
    deepDive: 'Delayed Sleep Phase Syndrome (DSPS) is a biological circadian rhythm disorder where the core body temperature nadir and dim-light melatonin onset (DLMO) are shifted several hours later than conventional schedules.',
    type: 'chrono_calculator',
    config: {
      input1Label: 'Natural Sleep Onset Time (Military Hour, e.g. 3 for 3 AM)',
      default1: 3.5,
      min1: 0,
      max1: 7,
      step1: 0.5,
      input2Label: 'Natural Wake Hour Without Alarms (e.g. 11 for 11 AM)',
      default2: 11,
      min2: 6,
      max2: 15,
      step2: 0.5,
      calcFormula: '(v2 - v1).toFixed(1)',
      unitLabel: 'Natural Sleep Duration (Hours)',
      insightTemplate: 'If you consistently get 7-8 hours of sound sleep when unscheduled, you have a delayed circadian clock, not sleep-maintenance insomnia.'
    },
    faq: [
      { q: 'How do you shift a delayed circadian phase?', a: 'Expose your eyes to 10,000 lux outdoor sunlight or a light-therapy lamp immediately upon waking, and avoid all overhead light after 9 PM.' },
      { q: 'Is night-owl chronotype genetic?', a: 'Yes. Polymorphisms in the PER3 and CRY1 circadian clock genes code for longer circadian periods.' }
    ]
  }
];

// Helper to register simple archetype definitions
function addTool(t) {
  ALL_115_TOOLS_CONFIG.push(t);
}

function defineRemainingTools() {
  const tools = [
    // 32-50: Philosophical Thought Experiments
    {
      slug: 'swampman-identity-paradox',
      title: 'Donald Davidson\'s Swampman Identity Paradox [Are You a Replica or You?] | Digital Tools Shed',
      metaDesc: 'Explore philosophical identity: If lightning vaporizes you and rearranges swamp molecules into an exact physical duplicate, is it you?',
      category: 'Existential Thought Experiments',
      summary: 'Davidson\'s Swampman asks whether mental states and personal identity require a historical causal link or merely physical structure.',
      deepDive: 'Donald Davidson introduced the Swampman thought experiment in 1987 to argue for semantic externalism and causal theories of mind. Swampman looks like you, has identical neural weights, and speaks like you, yet lacks any historical interaction with the words it uses.',
      type: 'dilemma_choice',
      config: {
        scenario: 'A lightning strike vaporizes you in a swamp while simultaneously arranging nearby organic matter into an exact molecular duplicate of you. What is Swampman?',
        options: [
          { title: 'Path A: It is genuinely YOU', school: 'Physicalist Substrate Independence', desc: 'Consciousness and identity supervene entirely on physical molecular configuration.', consequence: 'If physical structure dictates mind, any exact clone shares your subjective existence.' },
          { title: 'Path B: It is a mindless Zombie / Imposter', school: 'Historical Causal Theory of Reference', desc: 'Identity requires continuous historical causal contact with the real world.', consequence: 'Swampman cannot recognize your friends; it merely emits sounds that accidentally match their names.' }
        ]
      },
      faq: [
        { q: 'What is the Swampman problem?', a: 'A thought experiment by Donald Davidson testing whether memory and language require real past historical interactions or just identical brain molecules.' },
        { q: 'How does this relate to Star Trek transporters?', a: 'Transporters vaporize the body and assemble a duplicate on the destination pad, presenting the exact same Swampman dilemma.' }
      ]
    },
    {
      slug: 'newcombs-paradox-predictor',
      title: 'Newcomb\'s Paradox Decision Simulator [Are You a One-Boxer or Two-Boxer?] | Digital Tools Shed',
      metaDesc: 'Test decision theory with the famous superintelligent predictor box problem comparing Causal vs Evidential Decision Theory.',
      category: 'Existential Thought Experiments',
      summary: 'A superintelligent predictor knows what you will choose before you do. Do you take Box B ($1M) or both boxes ($1,000 + $1M)?',
      deepDive: 'Newcomb\'s Paradox divides decision theorists into two irreconcilable camps: Causal Decision Theory (CDT, two-boxers) and Evidential Decision Theory (EDT, one-boxers). It challenges our fundamental assumptions of free will and causality.',
      type: 'dilemma_choice',
      config: {
        scenario: 'Box A has $1,000 transparent. Box B has either $1,000,000 or $0. An infallible AI predicted your choice yesterday. What do you take?',
        options: [
          { title: 'One-Box: Take Box B Only', school: 'Evidential Decision Theory (EDT)', desc: 'The predictor knew you would one-box and placed $1,000,000 inside. You walk away a millionaire.', consequence: 'Maximizes expected utility based on the predictor\'s near-perfect track record.' },
          { title: 'Two-Box: Take Both Boxes', school: 'Causal Decision Theory (CDT)', desc: 'The money is already in the box or not; choosing Box A cannot causally reach back in time to alter Box B.', consequence: 'Dominance principle: Whatever is in Box B, taking both boxes nets you $1,000 more.' }
        ]
      },
      faq: [
        { q: 'What is Newcomb\'s Paradox?', a: 'A classic puzzle in decision theory created by William Newcomb, examining the conflict between the dominance principle and expected utility.' },
        { q: 'Which choice do philosophers prefer?', a: 'Philosophers and mathematicians are split roughly 50/50, illustrating an unresolved schism in decision theory.' }
      ]
    },
    {
      slug: 'brain-in-a-vat-probability-calc',
      title: 'Putnam\'s Brain in a Vat Disproof [Semantic Externalism Simulator] | Digital Tools Shed',
      metaDesc: 'Explore Hilary Putnam\'s semantic externalism argument that "I am a brain in a vat" is self-refuting.',
      category: 'Existential Thought Experiments',
      summary: 'Could you be a brain in a nutrient vat stimulated by a computer? Hilary Putnam argued the sentence itself cannot be true.',
      deepDive: 'Hilary Putnam used semantic externalism to argue that words get their meaning through causal links to the real world. A vat-brain saying "I am in a vat" refers only to simulated vats, making the statement logically self-refuting.',
      type: 'dilemma_choice',
      config: {
        scenario: 'Are your sensory experiences proof of a physical reality, or neural impulses fed to a brain in a vat?',
        options: [
          { title: 'Radical Skepticism (Descartes/Matrix)', school: 'Epistemic Skepticism', desc: 'No sensory evidence can prove the external physical world is not an illusion.', consequence: 'You can never be certain of anything outside your immediate subjective consciousness.' },
          { title: 'Putnam\'s Semantic Disproof', school: 'Semantic Externalism', desc: '"Brain in a vat" requires real-world causal contact with brains and vats to mean anything.', consequence: 'If you are a brain in a vat, the phrase cannot refer to real vats, rendering the claim false.' }
        ]
      },
      faq: [
        { q: 'What is the Brain in a Vat thought experiment?', a: 'A modernized version of Descartes\' evil demon hypothesis, testing the limits of knowledge and sensory skepticism.' },
        { q: 'How does Putnam refute the Brain in a Vat?', a: 'By showing that representation requires causal connection: simulated words cannot refer to physical objects.' }
      ]
    },
    {
      slug: 'utility-monster-resource-allocator',
      title: 'Robert Nozick\'s Utility Monster Paradox [Does Greater Pleasure Justify Tyranny?] | Digital Tools Shed',
      metaDesc: 'Challenge pure utilitarianism: If a being converts resources into 1,000x more pleasure, should humans sacrifice all to feed it?',
      category: 'Existential Thought Experiments',
      summary: 'Robert Nozick\'s famous critique exposes the horrifying logical extreme of maximizing aggregate happiness.',
      deepDive: 'Utilitarianism mandates maximizing total aggregate utility. Nozick introduced the Utility Monster—a creature that extracts immense units of pleasure from a grain of wheat. Utilitarian math dictates that all humans must starve to feed the monster.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'hum_res', label: 'Resources Allocated to 8 Billion Humans', val: 5 },
          { id: 'mon_res', label: 'Resources Allocated to the Utility Monster (1,000x efficiency)', val: 5 }
        ],
        highAdvice: 'Pure Utilitarian Disaster: Maximizing sum total happiness results in human extinction to feed the monster.',
        medAdvice: 'Rights-Based Deontology: Human rights and egalitarian baselines must trump raw aggregate pleasure maximization.'
      },
      faq: [
        { q: 'What is the Utility Monster?', a: 'A thought experiment by Robert Nozick in 1974 showing that simple utilitarianism can justify extreme inequality.' },
        { q: 'How do modern ethicists resolve the Utility Monster?', a: 'By incorporating prioritarianism (giving priority to the worst-off) and deontological rights constraints.' }
      ]
    },
    {
      slug: 'pascals-wager-expected-value-matrix',
      title: 'Pascal\'s Wager Expected Value Matrix [Multi-Deity Probability Calculator] | Digital Tools Shed',
      metaDesc: 'Test Blaise Pascal\'s belief payoff matrix against the Many Gods objection and compute expected existential utility.',
      category: 'Existential Thought Experiments',
      summary: 'Pascal argued that infinite reward makes believing in God a dominant gamble. See how the matrix collapses when multiple competing gods are introduced.',
      deepDive: 'Blaise Pascal\'s decision-theoretic wager fails when exposed to the "Many Gods" problem: if Zeus, Odin, Yahweh, and Allah demand mutually exclusive dogmas and punish disbelief, infinite payoffs cancel out into mathematical indeterminacy.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Assigned Probability God Exists (0.01 to 0.5)',
        default1: 0.1,
        min1: 0.01,
        max1: 0.9,
        step1: 0.05,
        input2Label: 'Number of Mutually Exclusive Historical Deities',
        default2: 50,
        min2: 2,
        max2: 1000,
        step2: 10,
        calcFormula: '((v1 / v2) * 100).toFixed(3)',
        unitLabel: '% Chance You Picked the Correct Deity',
        insightTemplate: 'When infinite heaven is claimed by hundreds of contradictory religions, the mathematical probability of guessing correctly drops to near zero.'
      },
      faq: [
        { q: 'What is Pascal\'s Wager?', a: 'The philosophical argument that rational self-interest dictates believing in God because infinite reward outweighs finite earthly costs.' },
        { q: 'What is the Many Gods objection?', a: 'The critique that there are infinite conceivable deities with contradictory demands, eliminating the binary choice.' }
      ]
    },
    {
      slug: 'parfit-future-generations-discount',
      title: 'Derek Parfit\'s Non-Identity Problem [Future Generations Value Discount] | Digital Tools Shed',
      metaDesc: 'Analyze the moral paradox: If a policy changes who is born 100 years from now, can that policy harm future individuals?',
      category: 'Existential Thought Experiments',
      summary: 'If our climate choices alter the timing of conceptions, entirely different people will be born. Did we harm them if their alternative was non-existence?',
      deepDive: 'Derek Parfit\'s Non-Identity Problem exposes the failure of person-affecting moral theories. If an environmental policy causes a future person to exist with a flawed life, we have not harmed them if their only alternative was never being born.',
      type: 'dilemma_choice',
      config: {
        scenario: 'A reckless energy policy ensures prosperity today but severe storms in 200 years. If the policy changed which sperm met which egg, did we harm the future people who were born?',
        options: [
          { title: 'Person-Affecting View: No Harm Done', school: 'Person-Affecting Ethics', desc: 'They cannot complain, because without that policy, they would never have existed at all.', consequence: 'Exposes the moral absurdity: we cannot be held accountable for degrading the future.' },
          { title: 'Impersonal Utilitarianism: Objective Harm', school: 'Impersonal Moral Theory', desc: 'Morality cares about total suffering in the world, regardless of the individual identities of the sufferers.', consequence: 'Requires us to maximize conditions for whoever ends up existing.' }
        ]
      },
      faq: [
        { q: 'What is Parfit\'s Non-Identity Problem?', a: 'A philosophical puzzle formulated by Derek Parfit in 1984 demonstrating that actions affecting future populations determine who comes into existence.' },
        { q: 'Why is it critical for climate change ethics?', a: 'It proves we cannot ground climate ethics in "harming our grandchildren" as specific individuals, but must ground it in impersonal duties.' }
      ]
    },
    {
      slug: 'sisyphus-absurdity-happiness-index',
      title: 'Albert Camus Sisyphus Absurdity Meter [One Must Imagine Sisyphus Happy] | Digital Tools Shed',
      metaDesc: 'Measure how much of your daily routine feels like rolling a boulder up a hill and calculate your Camusian existential rebel score.',
      category: 'Existential Thought Experiments',
      summary: 'Albert Camus declared that Sisyphus rolling his boulder is the ultimate symbol of human existence. Score your defiant joy in the face of the absurd.',
      deepDive: 'Camus defined the Absurd as the collision between humanity\'s desperate search for inherent meaning and the cold silence of the universe. Sisyphus triumphs not by escaping his rock, but by conscious, defiant scorn of his punishment.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'rep', label: 'Repetitive Monotony of Daily Tasks', val: 7 },
          { id: 'mean', label: 'Lack of Inherent Pre-Determined Purpose', val: 8 },
          { id: 'def', label: 'Conscious Defiant Savoring of Small Joys', val: 6 }
        ],
        highAdvice: 'The Absurd Hero Triumphant: Like Sisyphus descending the mountain to retrieve his boulder, your conscious awareness transforms routine labor into authentic freedom.',
        medAdvice: 'Nascent Rebel: Stop demanding cosmic meaning from your job; author your own localized significance in daily craft.'
      },
      faq: [
        { q: 'What did Camus mean by "One must imagine Sisyphus happy"?', a: 'That the struggle toward the heights is enough to fill a human heart; defying the meaningless void makes life authentic.' },
        { q: 'What is philosophical suicide according to Camus?', a: 'Adopting dogmatic religious or metaphysical beliefs to escape the uncomfortable reality of the absurd.' }
      ]
    },
    {
      slug: 'nagel-bat-qualia-divergence-mapper',
      title: 'Thomas Nagel\'s What Is It Like to Be a Bat? [Sensory Qualia Divergence] | Digital Tools Shed',
      metaDesc: 'Explore the epistemic gap between objective functional science and subjective phenomenal experience with sensory qualia mapping.',
      category: 'Existential Thought Experiments',
      summary: 'Even if you knew every neural circuit in a bat\'s brain, you would still not know what it feels like to perceive the world via echolocation.',
      deepDive: 'Thomas Nagel\'s 1974 paper demonstrated the explanatory gap of physicalism: objective physical science can describe third-person brain architecture, but cannot capture the first-person subjective "what it is likeness" of conscious qualia.',
      type: 'dilemma_choice',
      config: {
        scenario: 'A neuroscientist maps 100% of a bat\'s auditory cortex. Does the scientist know what it feels like to be a bat?',
        options: [
          { title: 'No: The Qualia Gap Exists', school: 'Phenomenological Dualism', desc: 'Subjective point of view cannot be captured by third-person physical descriptions.', consequence: 'Consciousness cannot be fully reduced to neurochemistry.' },
          { title: 'Yes: Complete Physicalism', school: 'Eliminative Materialism / Functionalism', desc: 'Once all physical causal operations are accounted for, nothing else remains.', consequence: 'Qualia is an illusion generated by neural self-modeling.' }
        ]
      },
      faq: [
        { q: 'What is qualia?', a: 'Qualia are the internal, subjective, qualitative components of conscious experience (e.g. the redness of red, the taste of salt).' },
        { q: 'Why did Nagel choose a bat?', a: 'Because bats have an alien sensory apparatus (sonar) fundamentally dissimilar to human vision, highlighting the epistemic divide.' }
      ]
    },
    {
      slug: 'rawls-veil-of-ignorance-simulator',
      title: 'John Rawls\' Veil of Ignorance Society Builder [Minimax Fairness Audit] | Digital Tools Shed',
      metaDesc: 'Design economic laws without knowing if you will be born rich, poor, disabled, or gifted with John Rawls\' minimax fairness audit.',
      category: 'Existential Thought Experiments',
      summary: 'Design tax, healthcare, and welfare rules under complete self-interest behind the veil, scoring minimax stability.',
      deepDive: 'John Rawls posited that a just society is one designed behind the "Veil of Ignorance," where no one knows their social class, race, gender, or innate talents. Under this constraint, rational actors choose the "Difference Principle" to maximize the welfare of the least advantaged.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'safety_net', label: 'Universal Healthcare & Welfare Floor', val: 8 },
          { id: 'incentives', label: 'High-Earning Market Incentives', val: 6 },
          { id: 'inheritance', label: 'Wealth Redistribution & Estate Tax', val: 7 }
        ],
        highAdvice: 'Minimax Stability Achieved: Behind the veil, you have insured yourself against being born into crushing poverty or disability.',
        medAdvice: 'Moderate Risk Exposure: Balanced growth incentives with a durable social safety net.'
      },
      faq: [
        { q: 'What is the Veil of Ignorance?', a: 'A conceptual tool by philosopher John Rawls for evaluating justice by stripping away personal bias and vested interests.' },
        { q: 'What is the Difference Principle?', a: 'Social and economic inequalities are permissible only if they benefit the least advantaged members of society.' }
      ]
    },
    {
      slug: 'prisoner-dilemma-iterated-tournament',
      title: 'Iterated Prisoner\'s Dilemma Tournament Simulator [Tit-for-Tat vs Grudger] | Digital Tools Shed',
      metaDesc: 'Simulate Robert Axelrod\'s game theory tournament of evolutionary cooperation across multiple strategies.',
      category: 'Existential Thought Experiments',
      summary: 'Pit Tit-for-Tat, Always Defect, and Pavlov across rounds to discover why cooperation emerges in selfish worlds.',
      deepDive: 'Robert Axelrod\'s famous computer tournament proved that "Tit-for-Tat" (start cooperative, then copy opponent\'s last move) dominates complex evolutionary games because it is nice, retaliatory, forgiving, and clear.',
      type: 'dilemma_choice',
      config: {
        scenario: 'You are playing 100 rounds of Prisoner\'s Dilemma against unknown competitors. Which core strategy do you deploy?',
        options: [
          { title: 'Tit-for-Tat (Cooperate first, then mirror)', school: 'Axelrod Evolutionary Winner', desc: 'Reward cooperation; immediately punish defection; forgive instantly when opponent reforms.', consequence: 'Builds maximum mutual wealth while guarding against exploitation.' },
          { title: 'Always Defect (Hawk / Exploiter)', school: 'Short-Term Cynicism', desc: 'Defect on every round to exploit naive cooperators.', consequence: 'Wins round 1, then triggers perpetual mutual defection, ending with zero long-term profit.' },
          { title: 'Grudger (Friedman)', school: 'Unforgiving Retaliator', desc: 'Cooperate until crossed once, then defect forever.', consequence: 'Too rigid: accidental miscommunication triggers permanent war.' }
        ]
      },
      faq: [
        { q: 'What is the Nash Equilibrium of Prisoner\'s Dilemma?', a: 'In a single-round game, mutual defection is the unique equilibrium, despite both players earning less than mutual cooperation.' },
        { q: 'Why does iteration change the outcome?', a: 'The "shadow of the future" allows players to punish defection and reward trust over time.' }
      ]
    },
    {
      slug: 'stag-hunt-social-trust-matrix',
      title: 'Rousseau\'s Stag Hunt Coordination Matrix [Trust vs Individual Safety] | Digital Tools Shed',
      metaDesc: 'Model high-payoff mutual trust (hunting a stag together) vs low-payoff guaranteed safety (hunting a hare alone).',
      category: 'Existential Thought Experiments',
      summary: 'Jean-Jacques Rousseau\'s parable models societal cooperation: will you trust others to hunt the stag or defect to catch a hare?',
      deepDive: 'The Stag Hunt models social contracts: hunting a stag yields immense reward for everyone, but requires 100% mutual trust. If one person abandons the circle to grab a hare, the stag escapes and everyone else starves.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'trust', label: 'Perceived Trust in Your Peers (0 to 10)', val: 6 },
          { id: 'hunger', label: 'Urgency of Personal Short-Term Survival', val: 4 }
        ],
        highAdvice: 'Stag Equilibrium: High mutual trust enables ambitious collective cooperation and social contract stability.',
        medAdvice: 'Hare Defection Risk: When trust wavers, individuals defect to safe mediocre pursuits, degrading collective welfare.'
      },
      faq: [
        { q: 'How does Stag Hunt differ from Prisoner\'s Dilemma?', a: 'In Stag Hunt, mutual cooperation is a Nash equilibrium that everyone prefers; the challenge is trust, not greed.' },
        { q: 'What causes societal stag hunts to fail?', a: 'Fear that someone else will panic and defect first.' }
      ]
    },
    {
      slug: 'sorites-heap-paradox-slider',
      title: 'The Sorites Paradox Heap of Sand [Grain-by-Grain Vagueness Slider] | Digital Tools Shed',
      metaDesc: 'Explore the metaphysics of vagueness: Exactly how many grains of sand turn a heap into non-heap?',
      category: 'Existential Thought Experiments',
      summary: 'Remove 1 grain of sand from a heap: it is still a heap. Repeat 10,000 times: at what precise grain did it stop being a heap?',
      deepDive: 'The Sorites Paradox challenges classical bivalent logic (where statements must be 100% true or 100% false). It underpins debates on baldness, wealth, adulthood, and when human life begins.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Initial Number of Sand Grains',
        default1: 10000,
        min1: 50,
        max1: 100000,
        step1: 500,
        input2Label: 'Grains Removed Per Step',
        default2: 1,
        min2: 1,
        max2: 10,
        calcFormula: '(v1 - 1)',
        unitLabel: 'Grains Remaining (Still Indisputably a Heap)',
        insightTemplate: 'Language relies on fuzzy boundary concepts. Precision is an artificial mathematical construct imposed on continuous analog reality.'
      },
      faq: [
        { q: 'What is the Sorites Paradox?', a: 'An ancient paradox attributed to Eubulides of Miletus examining vague predicates and borderline cases.' },
        { q: 'How does modern logic address vagueness?', a: 'Through fuzzy logic (degrees of truth between 0 and 1) and epistemicism (sharp boundaries exist but are unknowable).' }
      ]
    },
    {
      slug: 'russells-teapot-burden-of-proof',
      title: 'Bertrand Russell\'s Celestial Teapot [Epistemic Burden of Proof Engine] | Digital Tools Shed',
      metaDesc: 'Evaluate unprovable, unfalsifiable claims orbiting between Earth and Mars with Bayesian probability audits.',
      category: 'Existential Thought Experiments',
      summary: 'Bertrand Russell posited a china teapot orbiting the sun too small to be seen by telescopes. Is disbelief irrational simply because it cannot be disproven?',
      deepDive: 'Russell\'s Teapot establishes that the burden of proof rests on the claimant making unfalsifiable assertions, not on the skeptic to disprove them. Bayesian prior probability for arbitrary claims without evidence approaches zero.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'falsifiability', label: 'Falsifiability of the Claim (1=Unfalsifiable, 10=Testable)', val: 2 },
          { id: 'prior', label: 'Plausibility / Prior Supporting Evidence', val: 1 }
        ],
        highAdvice: 'Valid Empirical Inquiry: The claim offers testable predictions and observable evidence.',
        medAdvice: 'Celestial Teapot Zone: An unfalsifiable claim. Inability to disprove a claim is never evidence of its truth.'
      },
      faq: [
        { q: 'What is Russell\'s Teapot?', a: 'An analogy created by philosopher Bertrand Russell in 1952 demonstrating that the burden of proof lies on the believer, not the skeptic.' },
        { q: 'What is Karl Popper\'s falsification criterion?', a: 'A theory is scientific only if it makes empirical predictions that could theoretically be proven false.' }
      ]
    },
    {
      slug: 'omelas-ethical-walkaway-calculator',
      title: 'Those Who Walk Away from Omelas [Moral Trade-Off & Complicity Audit] | Digital Tools Shed',
      metaDesc: 'Audit the moral dilemma of a utopian city whose paradise depends on the misery of one child in Ursula K. Le Guin\'s parable.',
      category: 'Existential Thought Experiments',
      summary: 'Would you stay in paradise knowing its joy is contingent on one child locked in darkness? Audit your moral compromise threshold.',
      deepDive: 'Ursula K. Le Guin\'s classic story critiques utilitarian consequentialism. If 1,000,000 citizens experience sublime ecstasy at the cost of 1 child\'s torture, utilitarianism endorses it; deontological ethics says the city is fundamentally evil.',
      type: 'dilemma_choice',
      config: {
        scenario: 'The radiant happiness, art, and health of Omelas depends strictly on one child living in squalor. What do you do?',
        options: [
          { title: 'Stay and Savor the Paradise', school: 'Pragmatic Consequentialism', desc: 'Accept the tragic price; 1,000,000 thriving lives outweigh 1 tragic life.', consequence: 'You must live with the quiet rot of complicity.' },
          { title: 'Walk Away into the Darkness', school: 'Deontological Conscientious Objection', desc: 'Refuse complicity in an evil foundation, leaving comfort for the unknown.', consequence: 'You preserve your moral integrity, but the child remains in the cellar.' }
        ]
      },
      faq: [
        { q: 'What is the message of "Those Who Walk Away from Omelas"?', a: 'It asks whether any society has the right to purchase the happiness of the majority through the systematic exploitation of a minority.' },
        { q: 'What is the third choice often omitted?', a: 'Rebelling to free the child, which would destroy the city\'s prosperity.' }
      ]
    },
    {
      slug: 'beethoven-ninth-symphony-paradox',
      title: 'The Anti-Natalist Beethoven Paradox [Historical Genetic Counterfactuals] | Digital Tools Shed',
      metaDesc: 'Dissect the anti-natalist Beethoven syllogism and expose base-rate neglect in historical reproductive dilemmas.',
      category: 'Existential Thought Experiments',
      summary: 'Dissect the famous anti-abortion/anti-natalist trap: "Would you have aborted Beethoven?"',
      deepDive: 'The Beethoven paradox is a classic survivorship fallacy. It retrofits future genius onto past medical risk, ignoring that the identical genetic counterfactual gamble produces millions of children with severe congenital suffering.',
      type: 'dilemma_choice',
      config: {
        scenario: 'A mother with tuberculosis and syphilis has had four children, all deaf or sickly. She is pregnant again. What do you advise?',
        options: [
          { title: 'Advise Termination', school: 'Medical Harm Reduction', desc: 'Prioritize mother\'s health and minimize congenital disease risk.', consequence: 'If the child was Beethoven, did you eliminate the Ninth Symphony? (Survivorship bias fallacy).' },
          { title: 'Advise Carrying to Term', school: 'Optimistic Moral Gambling', desc: 'Every pregnancy holds unknown potential genius.', consequence: 'Statistically risks profound generational suffering based on retrospective cherry-picking.' }
        ]
      },
      faq: [
        { q: 'Is the Beethoven story true?', a: 'No, it is an urban legend: Beethoven\'s mother had neither syphilis nor tuberculosis at his birth, and he was the eldest surviving child.' },
        { q: 'Why is this argument logically fallacious?', a: 'Because the same logic could be applied retrospectively to argue that preventing any conception might have eliminated a ruthless dictator.' }
      ]
    },
    {
      slug: 'heideggers-dasein-mortality-timer',
      title: 'Martin Heidegger\'s Being-Toward-Death [Sein-zum-Tode Authenticity Clock] | Digital Tools Shed',
      metaDesc: 'Shift from inauthentic societal gossip into authentic confrontation with finite existence using Heideggerian mortality mirrors.',
      category: 'Existential Thought Experiments',
      summary: 'Heidegger argued that humans live in inauthentic distraction ("Das Man") until they confront their own finite mortality.',
      deepDive: 'In *Being and Time*, Martin Heidegger argued that authentic existence (*Dasein*) is achieved only through *Sein-zum-Tode* (Being-toward-Death). Confronting that your time will end strips away societal vanity and highlights core autonomous projects.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Current Age',
        default1: 32,
        min1: 15,
        max1: 90,
        input2Label: 'Actuarial Expectancy (Years)',
        default2: 80,
        min2: 60,
        max2: 100,
        calcFormula: 'Math.max(0, (v2 - v1) * 52)',
        unitLabel: 'Remaining Estimated Weekends of Life',
        insightTemplate: 'Death is not an event at the end of life; it is the boundary condition that makes every single choice matter right now.'
      },
      faq: [
        { q: 'What did Heidegger mean by "Das Man"?', a: 'The anonymous collective "They" (societal conventions, gossip, status games) that distracts individuals from their own mortality.' },
        { q: 'Why is confronting death considered liberating?', a: 'Because realizing your time is strictly finite destroys the fear of superficial social disapproval.' }
      ]
    },
    {
      slug: 'kierkegaards-leap-of-faith-engine',
      title: 'Søren Kierkegaard\'s Knight of Faith [Aesthetic vs Ethical vs Religious Despair] | Digital Tools Shed',
      metaDesc: 'Assess your current stage of life\'s way between aesthetic hedonism, ethical duty, and religious existential leap.',
      category: 'Existential Thought Experiments',
      summary: 'Diagnose the source of your existential dread based on Kierkegaard\'s three stages on life\'s way.',
      deepDive: 'Søren Kierkegaard mapped human development into three stages: Aesthetic (chasing novelty and pleasure, ending in boredom), Ethical (embracing duty and marriage, ending in guilt), and Religious (the leap of faith into paradox and divine surrender).',
      type: 'dilemma_choice',
      config: {
        scenario: 'Which existential tension is currently driving your late-night anxiety?',
        options: [
          { title: 'The Aesthetic Despair (Boredom)', school: 'Stage 1: The Aesthetic', desc: 'Chasing good food, entertainment, and travel, but experiencing hollow repetition.', consequence: 'Hedonism exhausts itself; the only exit is taking on ethical responsibility.' },
          { title: 'The Ethical Despair (Guilt & Duty)', school: 'Stage 2: The Ethical', desc: 'Living by duty, family commitments, and rules, but feeling crushed by your inability to be perfect.', consequence: 'Moral perfection is impossible; the exit is the leap of faith.' },
          { title: 'The Knight of Faith (Surrender)', school: 'Stage 3: The Religious Leap', desc: 'Surrendering the need for rational control and embracing the absurd paradox of existence.', consequence: 'Authentic peace achieved through radical existential trust.' }
        ]
      },
      faq: [
        { q: 'What is Kierkegaard\'s "leap of faith"?', a: 'The commitment to believe and live in trust despite the lack of objective rational proof.' },
        { q: 'Why did Kierkegaard write under pseudonyms?', a: 'To embody different philosophical worldviews without endorsing them directly as a dogmatic teacher.' }
      ]
    },
    {
      slug: 'nietzsches-amor-fati-challenge',
      title: 'Friedrich Nietzsche\'s Amor Fati [Love of Fate Personal Reckoning Audit] | Digital Tools Shed',
      metaDesc: 'Can you not merely tolerate your worst traumas and mistakes, but genuinely love them as necessary with Nietzsche\'s Amor Fati audit?',
      category: 'Existential Thought Experiments',
      summary: 'Nietzsche\'s ultimate test: If a demon said you must live your exact life on infinite repeat, would you curse him or praise him?',
      deepDive: 'Nietzsche introduced *Amor Fati* (love of fate) and the Eternal Recurrence as psychological litmus tests for psychological greatness. To truly love who you are today requires recognizing that every agonizing mistake and heartbreak was a necessary structural pillar of your resilience.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I wasted years in that bad relationship / wrong career; my past is an embarrassing catastrophe',
        distortionName: 'Regret of Past Necessity',
        realityCheck: 'Without that heartbreak or failure, you would lack your current empathy, discernment, and boundaries.',
        calibratedText: 'Amor Fati: I do not wish anything to be different, not forward, not backward, not in all eternity. I love the fire that forged my character.'
      },
      faq: [
        { q: 'What does Amor Fati mean?', a: 'Latin for "love of fate"—not merely resignation to hardship, but active, joyful affirmation of everything that happens.' },
        { q: 'What is the Eternal Return?', a: 'A thought experiment asking if you could bear having your exact life repeat in every detail for eternity.' }
      ]
    },
    {
      slug: 'schopenhauer-will-to-life-pendulum',
      title: 'Schopenhauer\'s Pendulum of Suffering [Oscillation Between Want and Boredom] | Digital Tools Shed',
      metaDesc: 'Track Arthur Schopenhauer\'s diagnosis of desire: As soon as a want is satisfied, boredom sets in.',
      category: 'Existential Thought Experiments',
      summary: 'Human life swings like a pendulum between the pain of unmet craving and the dreadful boredom of satisfaction.',
      deepDive: 'Arthur Schopenhauer saw existence as driven by the blind, restless "Will to Live." Striving brings pain; achievement brings immediate habituation and boredom. The only escapes are aesthetic contemplation (art, music) and compassionate asceticism.',
      type: 'somatic_timer',
      config: {
        defaultTimer: '02:00',
        durationSecs: 120,
        initialPhase: 'Pendulum Centering',
        phases: ['Observe the desire: pain of wanting', 'Observe the achievement: boredom of having', 'Step off the pendulum into aesthetic stillness', 'Rest in pure awareness without striving'],
        somaticInstructions: 'Step off the hedonic treadmill. For 120 seconds, desire nothing, fix nothing, and strive for nothing.'
      },
      faq: [
        { q: 'Why was Schopenhauer so pessimistic?', a: 'He argued that pain is positive (actively felt) while pleasure is negative (merely the temporary cessation of desire).' },
        { q: 'What was Schopenhauer\'s cure for suffering?', a: 'Immersing oneself in art and music, which quiets the Will, and cultivating boundless compassion for all suffering beings.' }
      ]
    }
  ];

  tools.forEach(addTool);
}

defineRemainingTools();

// Function to populate tools 51 to 115
function defineBatches51to115() {
  const tools = [
    // 51-60: Relationships & Attachment
    {
      slug: 'relationship-sunk-cost-auditor',
      title: 'Relationship Sunk Cost Fallacy Auditor [Time Invested vs Future Happiness] | Digital Tools Shed',
      metaDesc: 'Determine if you are staying in an unhappy relationship solely because of years already invested with forward-looking decision models.',
      category: 'Relationships & Attachment',
      summary: 'Decouple unrecoverable past years from your predicted happiness over the next three years.',
      deepDive: 'The sunk cost fallacy traps partners in stagnant relationships because walking away feels like "throwing away 5 years." In economics and psychology, past time is gone regardless; staying only sacrifices future happiness.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Years Already Invested in Relationship',
        default1: 5,
        min1: 1,
        max1: 30,
        input2Label: 'Estimated Happiness Over Next 3 Years (1 to 10)',
        default2: 3.5,
        min2: 1,
        max2: 10,
        step2: 0.5,
        calcFormula: 'Math.round(v2 * 10)',
        unitLabel: '% Forward-Looking Compatibility Index',
        insightTemplate: 'Past years are unrecoverable. The only rational question is: if you met this exact person today, would you choose to start dating them?'
      },
      faq: [
        { q: 'How do you know if you are staying out of love or sunk cost?', a: 'Ask yourself: if a magic button could separate you painlessly with zero guilt, would you press it?' },
        { q: 'Is staying for history ever healthy?', a: 'Shared history has value only if both partners are actively committed to growth and mutual emotional safety.' }
      ]
    },
    {
      slug: 'friendship-drift-and-decay-metric',
      title: 'Friendship Drift Metric [How Many Times Will You See Your Best Friend Again?] | Digital Tools Shed',
      metaDesc: 'Compute the remaining lifetime visits with long-distance friends using actuarial expectancy and encounter frequency.',
      category: 'Relationships & Attachment',
      summary: 'You think you have decades left with your childhood friend, but if you meet once every two years, you may only see them 18 more times.',
      deepDive: 'Geographic dispersal causes friendships to drift unconsciously. Calculating the remaining discrete encounters transforms friendship from an abstract infinite constant into a precious, finite resource.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Remaining Expected Years of Life (e.g. 45)',
        default1: 45,
        min1: 5,
        max1: 70,
        input2Label: 'Visits per Year (e.g. 0.5 for once every 2 years)',
        default2: 0.5,
        min2: 0.1,
        max2: 12,
        step2: 0.1,
        calcFormula: 'Math.round(v1 * v2)',
        unitLabel: 'Total Remaining Face-to-Face Encounters',
        insightTemplate: 'You will only sit across a table from this person a few dozen more times in your entire life. Text them today.'
      },
      faq: [
        { q: 'Why do adult friendships decay so easily?', a: 'Adult life lacks the automatic proximity and shared unplanned leisure that built childhood bonds.' },
        { q: 'How do you maintain a drifting friendship?', a: 'Replace high-stakes annual trips with low-friction 10-minute voice memos and spontaneous photo shares.' }
      ]
    },
    {
      slug: 'people-pleasing-boundary-erosion-meter',
      title: 'People-Pleasing Boundary Erosion Meter [The Hidden Cost of Saying Yes] | Digital Tools Shed',
      metaDesc: 'Measure how much personal autonomy, sleep, and emotional peace you sacrifice to avoid momentary conflict.',
      category: 'Relationships & Attachment',
      summary: 'Every time you say "yes" to avoid 30 seconds of awkwardness, you say "no" to your own sleep and sanity.',
      deepDive: 'People-pleasing is an appeasement trauma reflex (fawning). It converts short-term interpersonal peace into long-term systemic resentment and burnout.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'fear_rej', label: 'Fear of Being Disliked / Rejected', val: 8 },
          { id: 'over_commit', label: 'Commitments You Silently Dread', val: 7 },
          { id: 'resentment', label: 'Simmering Resentment Toward Demands', val: 8 }
        ],
        highAdvice: 'Critical Boundary Erosion: You are operating as an emotional doormat, accumulating massive internal resentment. A clean "No, I cannot commit to this" is self-defense.',
        medAdvice: 'Mild Pleasing: Practice the 24-hour pause before saying yes to any favor.'
      },
      faq: [
        { q: 'Why is saying "no" so terrifying?', a: 'The nervous system equates conflict with abandonment and physical exile from the tribe.' },
        { q: 'How can you decline without being rude?', a: 'Use: "Thank you for thinking of me, but I do not have the bandwidth to do this justice right now."' }
      ]
    },
    {
      slug: 'emotional-attachment-protest-behavior',
      title: 'Anxious Attachment Protest Behavior Auditor [Decoding Panicked Texts] | Digital Tools Shed',
      metaDesc: 'Intercept anxious attachment protest behaviors like spam calling and guilt-tripping before hitting send.',
      category: 'Relationships & Attachment',
      summary: 'When an attachment bond feels threatened, the anxious mind launches protest behaviors to force a response. Decode your panic.',
      deepDive: 'Amir Levine\'s attachment theory defines protest behaviors (calling repeatedly, passive-aggressive silence, jealousy tests) as desperate attempts to re-establish connection. They almost always push avoidant partners further away.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'They haven\'t texted back in 4 hours; I need to send a passive-aggressive essay or delete their number',
        distortionName: 'Anxious Attachment Protest Reaction',
        realityCheck: 'Your amygdala is experiencing abandonment panic. Sending a reactive text will only trigger their defense mechanisms.',
        calibratedText: 'I am feeling triggered by distance. I will place my phone across the room for 60 minutes and regulate my own nervous system.'
      },
      faq: [
        { q: 'What is a protest behavior?', a: 'An action taken to force an unresponsive partner to pay attention, often manifesting as guilt-trips or withdrawal.' },
        { q: 'What is secure communication during an attachment spike?', a: 'Expressing vulnerability directly: "I feel disconnected today and would love 5 minutes to check in when you are free."' }
      ]
    },
    {
      slug: 'avoidant-deactivating-strategy-scanner',
      title: 'Avoidant Deactivating Strategy Scanner [Falling Out of Love or Running?] | Digital Tools Shed',
      metaDesc: 'Audit whether you are actually losing feelings or if your nervous system is unconsciously finding flaws to avoid intimacy.',
      category: 'Relationships & Attachment',
      summary: 'When intimacy gets real, avoidant attachment unconsciously invents flaws to justify running away. Scan your deactivating triggers.',
      deepDive: 'Deactivating strategies are psychological defense mechanisms used by avoidant individuals to suppress attachment needs (e.g. hyper-focusing on minor physical flaws, pining for the "phantom ex", or feeling a sudden suffocating urge to be free).',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'I suddenly feel intense irritation over minor chewing or walking habits.',
          'I catch myself obsessing over an idealized ex-partner who is unattainable.',
          'When my partner expresses deep love or vulnerability, I feel a physical urge to bolt.',
          'I maintain secret exit strategies or prioritize work to prevent closeness.'
        ],
        highText: 'Acute Deactivation Active: You are not suddenly falling out of love; your nervous system is pulling the emergency brake to avoid intimacy vulnerability. Do not make irreversible breakup decisions while in a deactivating surge.',
        medText: 'Mild Distance Maneuver: Communicate your need for healthy solo time rather than manufacturing flaws in your partner.'
      },
      faq: [
        { q: 'What is a deactivating strategy?', a: 'Any behavior or thought pattern used by avoidant individuals to pull away from closeness.' },
        { q: 'What is the "phantom ex"?', a: 'An idealized past partner used as a psychological yardstick to ensure no present real partner can ever measure up.' }
      ]
    },
    {
      slug: 'fawn-response-trauma-trigger-audit',
      title: 'The Fawn Trauma Response Checklist [People-Pleasing as Nervous System Safety] | Digital Tools Shed',
      metaDesc: 'Identify childhood appeasement reflexes operating in adult workplace and romantic conflicts with a fawning audit.',
      category: 'Relationships & Attachment',
      summary: 'Pete Walker added "Fawn" to Fight, Flight, and Freeze. Audit whether your kindness is authentic love or survival appeasement.',
      deepDive: 'Fawning is an instinctual survival response where an individual attempts to prevent conflict or harm by preemptively appeasing an aggressor, mirroring their opinions, and erasing their own boundaries.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'In conflicts, I immediately agree with the other person even when I know they are wrong.',
          'I anticipate other people\'s needs with hypervigilance to prevent angry outbursts.',
          'I struggle to know what food, movie, or music I actually like when around others.',
          'I feel intense somatic terror when someone nearby is in a bad mood.'
        ],
        highText: 'Chronic Fawn Trauma Conditioning: Your nervous system learned that safety required erasing yourself to pacify caregivers. Begin practicing somatic micro-preferences: choose what you want to eat first.',
        medText: 'Situational Appeasement: You tend to collapse boundaries around authority figures.'
      },
      faq: [
        { q: 'Who discovered the fawn response?', a: 'Trauma therapist Pete Walker identified fawning as the fourth survival defense alongside fight, flight, and freeze.' },
        { q: 'How do you heal the fawn response?', a: 'By learning to tolerate the physical discomfort of other people being temporarily disappointed in you.' }
      ]
    },
    {
      slug: 'emotional-dumping-vs-venting-scale',
      title: 'Venting vs Trauma Dumping Auditor [Audit Your Emotional Hygiene with Friends] | Digital Tools Shed',
      metaDesc: 'Distinguish healthy two-way emotional processing from non-consensual trauma dumping with a reciprocity audit.',
      category: 'Relationships & Attachment',
      summary: 'Venting seeks release and insight; trauma dumping uses another human as an emotional trashcan without consent.',
      deepDive: 'Healthy emotional venting involves asking for consent, checking the listener\'s emotional capacity, and being open to solutions. Trauma dumping is circular, repetitive, non-consensual, and leaves the listener emotionally drained.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'Did you ask: "Do you have the emotional space for me to vent right now?" before starting?',
          'Is the conversation reciprocal, allowing the other person to share their life?',
          'Are you open to perspectives or action steps, or solely re-playing the grievance?',
          'Do you feel lighter afterward, or did you spiral deeper into resentment?'
        ],
        highText: 'Healthy Two-Way Emotional Hygiene: You are processing emotions with consent and reciprocity.',
        medText: 'Borderline Trauma Dumping: You may be offloading unprocessed crisis onto friends who lack clinical boundaries. Check in on their capacity.'
      },
      faq: [
        { q: 'What is trauma dumping?', a: 'The uninvited, non-consensual oversharing of traumatic material onto someone who is not prepared to process it.' },
        { q: 'How do you ask for consent before venting?', a: 'Ask: "I had a rough day—do you have the bandwidth for me to vent for 10 minutes, or are you at capacity?"' }
      ]
    },
    {
      slug: 'rejection-sensitive-dysphoria-scale',
      title: 'Rejection Sensitive Dysphoria Scale [Acute Episode Intensity Metric] | Digital Tools Shed',
      metaDesc: 'Triage the overwhelming, physical agony triggered by perceived criticism or rejection in neurodivergent minds.',
      category: 'Relationships & Attachment',
      summary: 'In ADHD and autism, perceived rejection triggers acute physical chest pain and emotional agony. Triage an active RSD surge.',
      deepDive: 'Rejection Sensitive Dysphoria (RSD) is an extreme neurochemical vulnerability to perceived failure or rejection common in ADHD. The brain processes emotional pain through physical nociceptive pathways, triggering acute panic.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'phys_pain', label: 'Physical Chest Tightness / Nausea', val: 8 },
          { id: 'shame_surge', label: 'Sudden Urge to Disappear or Resign', val: 9 },
          { id: 'spiral_speed', label: 'Speed of Descent into Self-Hatred', val: 8 }
        ],
        highAdvice: 'Acute RSD Episode: Your amygdala has flooded your bloodstream with stress hormones. You are in neurological pain, not moral disgrace. Do not reply to any messages for 4 hours.',
        medAdvice: 'Moderate Rejection Spike: Ground your body with physical temperature shifts (cold water face splash).'
      },
      faq: [
        { q: 'What is RSD?', a: 'Rejection Sensitive Dysphoria is an extreme emotional and physical reaction to perceived criticism, judgment, or failure.' },
        { q: 'How can you manage an active RSD attack?', a: 'Treat it like an asthma attack: recognize it as a temporary neurochemical storm that will dissipate in 2 to 4 hours.' }
      ]
    },
    {
      slug: 'hyper-independence-trauma-diagnostic',
      title: 'Hyper-Independence Diagnostic [Is Extreme Self-Reliance a Survival Trauma?] | Digital Tools Shed',
      metaDesc: 'Assess whether your inability to ask for help stems from early childhood neglect or betrayal with trauma metrics.',
      category: 'Relationships & Attachment',
      summary: '"I don\'t need anyone; I can do it myself." Extreme self-reliance is rarely strength—it is often a trauma shield.',
      deepDive: 'Hyper-independence is an avoidant coping mechanism developed when children learn that caregivers cannot be relied upon for protection or emotional support. Asking for help feels neurologically dangerous.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'Asking for help feels like an agonizing humiliation or admission of weakness.',
          'I prefer to struggle for 6 hours rather than take 30 seconds to ask someone for direction.',
          'I feel terrified that accepting a favor places me in someone\'s debt.',
          'I carry a deep conviction that if I want something done, nobody else will show up.'
        ],
        highText: 'Survival Hyper-Independence: Your self-reliance was an adaptive shield that protected you as a child, but now keeps you isolated and exhausted. Practice micro-delegation: ask someone to pass the water.',
        medText: 'Moderate Reluctance: You are hesitant to rely on others, but capable of collaboration under clear contracts.'
      },
      faq: [
        { q: 'Why is hyper-independence considered a trauma response?', a: 'Because it stems from learning that vulnerability results in abandonment, neglect, or weaponized betrayal.' },
        { q: 'How do you begin overcoming hyper-independence?', a: 'By asking for low-stakes help where failure has zero consequence (e.g. asking for directions).' }
      ]
    },
    {
      slug: 'toxic-positivity-suppression-audit',
      title: 'Toxic Positivity & Invalidation Audit [The Danger of Good Vibes Only] | Digital Tools Shed',
      metaDesc: 'Audit the psychological damage of suppressing grief, rage, and anxiety behind forced positivity cliches.',
      category: 'Relationships & Attachment',
      summary: '"Good vibes only" is an emotional gag order. Audit how forced positivity invalidates real grief and anxiety.',
      deepDive: 'Toxic positivity is the excessive and ineffective over-generalization of an optimistic state. Research proves that suppressing negative emotions increases autonomic sympathetic arousal and compounds psychological suffering.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'Everything happens for a reason; I shouldn\'t be crying, I should just manifest positive energy',
        distortionName: 'Toxic Positivity & Emotional Invalidation',
        realityCheck: 'Grief, anger, and heartbreak are appropriate mammalian responses to loss. Suppressing them produces physical somatic illness.',
        calibratedText: 'This situation is genuinely painful and unfair. I am entitled to feel grief and sorrow without rushing to slap a silver lining on it.'
      },
      faq: [
        { q: 'What is toxic positivity?', a: 'The cultural imposition of positive thinking as the only acceptable response to pain, silencing legitimate human emotion.' },
        { q: 'What is tragic optimism instead?', a: 'Viktor Frankl\'s concept of finding meaning in life while acknowledging genuine tragedy, pain, and loss.' }
      ]
    },

    // 61-67: Career & Burnout
    {
      slug: 'career-existential-alignment-matrix',
      title: 'Career Purpose vs Paycheck Matrix [The 80,000 Hours Existential Dilemma] | Digital Tools Shed',
      metaDesc: 'Evaluate whether your 40 hours a week aligns with your core values or actively drains your lifeforce with sustainability metrics.',
      category: 'Career & Burnout',
      summary: 'You spend 80,000 hours of your life working. Does your career nourish your soul or slowly poison your conscience?',
      deepDive: 'The 80,000 Hours career framework demonstrates that human fulfillment requires autonomy, competence, relatedness, and positive social impact. High pay rarely compensates for chronic moral injury.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'money', label: 'Financial Compensation & Security', val: 7 },
          { id: 'impact', label: 'Positive Social & Moral Impact', val: 3 },
          { id: 'autonomy', label: 'Daily Autonomy & Creative Freedom', val: 4 }
        ],
        highAdvice: 'Existential Career Alignment: Your work generates both material survival and deep values congruence.',
        medAdvice: 'Moral Friction: You are trading soul energy for financial safety. Begin building an exit runway toward higher-impact work.'
      },
      faq: [
        { q: 'What is moral injury in the workplace?', a: 'The psychological distress that results from actions, or witnessing actions, that violate your deeply held moral beliefs.' },
        { q: 'Can you have purpose without a prestigious career?', a: 'Yes. Purpose can be cultivated in community building, artistic craft, parenting, and how you treat your peers.' }
      ]
    },
    {
      slug: 'bullshit-jobs-graeber-auditor',
      title: 'David Graeber\'s Bullshit Jobs Diagnostic [Does Your Role Truly Need to Exist?] | Digital Tools Shed',
      metaDesc: 'Categorize corporate roles into David Graeber\'s 5 archetypes: Flunkies, Goons, Duct Tapers, Box Tickers, or Taskmasters.',
      category: 'Career & Burnout',
      summary: 'Anthropologist David Graeber revealed that millions of workers secretly believe their jobs are pointless. Diagnose your role.',
      deepDive: 'In *Bullshit Jobs*, David Graeber cataloged five archetypes of meaningless corporate employment: Flunkies (exist only to make superiors feel important), Goons (aggressive actors on behalf of employers), Duct Tapers (patching systemic flaws that should be fixed), Box Tickers (allowing organizations to claim they are doing something), and Taskmasters (unnecessary middle managers).',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'If my entire department vanished tomorrow, would ordinary people outside the company notice any difference?',
          'Do I spend significant hours creating reports that nobody reads or acting out administrative theater?',
          'Is my primary function fixing bugs that exist solely because leadership refuses to fix underlying infrastructure?',
          'Do I feel deep existential guilt collecting a salary for tasks that produce zero societal value?'
        ],
        highText: 'Graeber Bullshit Job Diagnosis: Your role exhibits high administrative theater. The psychological toll of pointless work is profound. Protect your mental health: do the minimum necessary and redirect your creative energy into external artistic or communal projects.',
        medText: 'Mixed Utility: Your role has legitimate components bogged down by corporate bureaucracy.'
      },
      faq: [
        { q: 'What is a "bullshit job" according to Graeber?', a: 'A form of paid employment that is so completely pointless or harmful that even the employee cannot justify its existence.' },
        { q: 'Why do meaningless jobs cause mental illness?', a: 'Because humans possess an instinct for causal efficacy—we need to feel that our actions have real consequences in the world.' }
      ]
    },
    {
      slug: 'golden-handcuffs-break-even-calculator',
      title: 'Golden Handcuffs Freedom Calculator [When Can You Afford to Walk Away?] | Digital Tools Shed',
      metaDesc: 'Calculate the exact minimum salary you need to maintain genuine happiness without corporate misery.',
      category: 'Career & Burnout',
      summary: 'Strip away lifestyle inflation and stress-coping consumption to find your true walkaway freedom number.',
      deepDive: 'The golden handcuffs trap occurs when workers use high corporate salaries to finance luxury purchases to cope with corporate misery. Calculating your bare baseline living costs exposes how little money you actually need to buy your freedom.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'True Baseline Living Expenses ($/month)',
        default1: 3200,
        min1: 1000,
        max1: 15000,
        step1: 100,
        input2Label: 'Liquid Savings & Runway ($)',
        default2: 45000,
        min2: 5000,
        max2: 300000,
        step2: 5000,
        calcFormula: '(v2 / v1).toFixed(1)',
        unitLabel: 'Months of Uncompromised Freedom Runway',
        insightTemplate: 'You have over a year of full survival runway. The handcuffs are made of status anxiety, not financial reality.'
      },
      faq: [
        { q: 'What are golden handcuffs?', a: 'Financial incentives and inflated lifestyles that make leaving an unfulfilling corporate job feel impossible.' },
        { q: 'What is stress-coping consumption?', a: 'Spending money on expensive vacations, alcohol, and luxury delivery to compensate for the emotional toll of a toxic job.' }
      ]
    },
    {
      slug: 'workplace-gaslighting-reality-audit',
      title: 'Workplace Gaslighting & Psychological Safety Audit [Objective Paper Trail] | Digital Tools Shed',
      metaDesc: 'Determine if your manager is systematically eroding your confidence and rewriting project history with an objective paper trail.',
      category: 'Career & Burnout',
      summary: 'Are you actually incompetent, or is leadership moving goalposts and denying past agreements? Audit the signs of workplace gaslighting.',
      deepDive: 'Workplace gaslighting occurs when toxic managers systematically deny verbal promises, shift project goalposts after completion, and imply that the employee\'s memory or competence is flawed.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'My manager denies saying things they clearly stated in previous meetings.',
          'Project requirements change after completion, followed by accusations that I missed expectations.',
          'I am excluded from email threads or meetings critical to my deliverables.',
          'I have begun obsessively screenshotting Slack messages because I no longer trust my own memory.'
        ],
        highText: 'Systemic Workplace Gaslighting: You are in an abusive organizational environment. Your memory is not defective; leadership is rewriting history to evade accountability. Put everything in writing: follow up every verbal conversation with an email: "Per our discussion today..."',
        medText: 'Poor Management / Communication Gaps: High ambiguity present. Institute clear written summaries.'
      },
      faq: [
        { q: 'What is workplace gaslighting?', a: 'A pattern of manipulation where managers or colleagues make you question your perception, memory, or sanity.' },
        { q: 'What is the best defense against workplace gaslighting?', a: 'A meticulous, contemporaneous paper trail saved to an external private device.' }
      ]
    },
    {
      slug: 'sunday-scaries-anticipatory-dread',
      title: 'The Sunday Scaries Anticipatory Dread Pacer [Autonomic Nervous System Reset] | Digital Tools Shed',
      metaDesc: 'Dismantle the stomach-dropping dread that sets in at 4 PM every Sunday afternoon with structured closure rituals.',
      category: 'Career & Burnout',
      summary: 'Sunday evening anxiety is an autonomic anticipation of threat. Extract Monday morning tasks and transition into rest.',
      deepDive: 'The "Sunday Scaries" spike when circadian cortisol begins rising in anticipation of Monday morning stressors. Performing a 20-minute shutdown ritual on Friday or Sunday afternoon externalizes Monday\'s dread.',
      type: 'somatic_timer',
      config: {
        defaultTimer: '05:00',
        durationSecs: 300,
        initialPhase: 'Sunday Evening Nervous System Reset',
        phases: ['Write down 3 concrete tasks for Monday 9 AM', 'Close work laptop and put in a closed drawer', 'Perform physiological double-sighs', 'Reclaim the remaining 6 hours of your weekend'],
        somaticInstructions: 'Monday morning does not exist right now. You are in Sunday evening. Savor your warm tea and your warm home.'
      },
      faq: [
        { q: 'Why do the Sunday Scaries peak at 4 PM?', a: 'Because the conscious realization that weekend freedom is expiring triggers sympathetic nervous system arousal.' },
        { q: 'What is the most effective shutdown ritual?', a: 'Writing a 3-bullet action list for Monday morning so your brain knows the plan is handled.' }
      ]
    },
    {
      slug: 'perfectionism-paralysis-breakdown',
      title: 'Adaptive vs Maladaptive Perfectionism Scale [Why Done Is Better Than Perfect] | Digital Tools Shed',
      metaDesc: 'Diagnose whether your high standards are driving excellence or paralyzing you into missed deadlines with 80/20 trade-offs.',
      category: 'Career & Burnout',
      summary: 'The final 10% of perfection costs 90% of your total energy. Prove why "done is better than perfect."',
      deepDive: 'Maladaptive perfectionism is driven by fear of shame and exposure, leading to chronic procrastination. Adaptive perfectionism seeks excellence while accepting that shipping a flawed deliverable beats an unreleased masterpiece.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'polishing', label: 'Time Spent Polishing After Core Goal Met (%)', val: 7 },
          { id: 'fear_mistake', label: 'Terror of Minor Typos / Public Flaws', val: 8 },
          { id: 'delay', label: 'Deadline Slippage Due to Rework', val: 7 }
        ],
        highAdvice: 'Maladaptive Perfectionism Gridlock: You are burning 90% of your energy polishing diminishing returns. Adopt the 80/20 rule: ship it when it is "good enough to be useful."',
        medAdvice: 'Healthy Standards: Maintain pride in craft while enforcing hard shipment deadlines.'
      },
      faq: [
        { q: 'What is the difference between perfectionism and high standards?', a: 'High standards focus on the work; perfectionism focuses on avoiding criticism and protecting the ego.' },
        { q: 'Why is shipping early therapeutic for perfectionists?', a: 'It exposes you to the reality that minor flaws almost never trigger the catastrophic judgment you feared.' }
      ]
    },
    {
      slug: 'creative-block-resistance-meter',
      title: 'Steven Pressfield\'s The War of Art Resistance Meter [Unmasking Creative Fear] | Digital Tools Shed',
      metaDesc: 'Identify the hidden forms Resistance takes when you sit down to write, code, or paint with Pressfield\'s diagnostic.',
      category: 'Career & Burnout',
      summary: 'Steven Pressfield named the force that stops you from making art: Resistance. Unmask procrastination disguised as "research."',
      deepDive: 'In *The War of Art*, Steven Pressfield explains that Resistance is the universal force of self-sabotage that arises whenever we attempt to move from a lower moral or creative plane to a higher one. It disguises itself as cleaning, research, drama, or sudden illness.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'I spent 3 hours "researching" tools or reorganizing my desk instead of writing the first paragraph.',
          'I suddenly felt an urgent need to start a diet, reorganize my finances, or clean the oven.',
          'I feel a quiet, cold, rational voice whispering that my idea is derivative and nobody cares.',
          'The closer I get to finishing the project, the more overwhelming my dread becomes.'
        ],
        highText: 'Acute Creative Resistance: You are experiencing maximum Resistance. Pressfield\'s rule: The more important a project is to your soul\'s evolution, the more Resistance you will feel. Treat Resistance as a compass: go directly toward what terrifies you.',
        medText: 'Mild Distraction Resistance: Sit in the chair for 20 minutes without touching your phone. The muse rewards physical attendance.'
      },
      faq: [
        { q: 'What is Resistance according to Steven Pressfield?', a: 'The invisible, repelling force that sabotages creative work, entrepreneurship, and personal growth.' },
        { q: 'How do you defeat Resistance?', a: 'By turning pro: sitting down at the same time every day and doing the work regardless of mood or inspiration.' }
      ]
    }
  ];

  tools.forEach(addTool);
}

defineBatches51to115();

// Function to populate tools 68 to 115
function defineBatches68to115() {
  const tools = [
    // 68-86: Internal Psychology, Somatics & Behavioral Economics
    {
      slug: 'internal-family-systems-parts-mapper',
      title: 'Internal Family Systems Parts Mapper [Exile, Manager, and Firefighter] | Digital Tools Shed',
      metaDesc: 'Map internal conflicts between protector parts and wounded exile parts with Richard Schwartz\'s IFS model.',
      category: 'Somatic & Behavioral',
      summary: 'You are not a single unified self; you are an ecosystem of parts. Map your Managers, Firefighters, and Exiles.',
      deepDive: 'Richard Schwartz\'s Internal Family Systems (IFS) identifies three sub-personality types: Managers (perfectionism, hyper-control), Firefighters (bingeing, numbing, distraction), and Exiles (traumatized child parts holding shame). Healing occurs through compassionate Self-leadership.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I hate that part of me that binge-eats or doomscrolls for 4 hours; I am weak and broken',
        distortionName: 'Condemning Protector Parts (Self-Adversarial)',
        realityCheck: 'Your doomscrolling Firefighter part is desperately trying to numb overwhelming emotional pain. It has good intentions executed through an exhausting strategy.',
        calibratedText: 'I see that my numbing part is trying to protect me from feeling exhausted and unloved. I thank it for trying to keep me safe, but as the Self, I will handle this gently.'
      },
      faq: [
        { q: 'What is the core premise of IFS?', a: 'That the mind is naturally multiple, and every single part—even destructive ones—has positive intent to protect the individual.' },
        { q: 'What are the 8 C\'s of Self in IFS?', a: 'Curiosity, Calm, Clarity, Compassion, Confidence, Courage, Creativity, and Connectedness.' }
      ]
    },
    {
      slug: 'polyvagal-nervous-system-state-check',
      title: 'Polyvagal Nervous System State Check [Ventral, Sympathetic, or Dorsal Vagal] | Digital Tools Shed',
      metaDesc: 'Determine your autonomic state: Social Engagement (safe), Fight/Flight (mobilized), or Freeze/Collapse (shut down).',
      category: 'Somatic & Behavioral',
      summary: 'Stephen Porges\' Polyvagal Theory explains your three biological operating states: Safe & Social, Fight/Flight, or Dorsal Freeze.',
      deepDive: 'The autonomic nervous system moves up and down a phylogenetic ladder: Ventral Vagal (social engagement, play), Sympathetic (mobilization, rage, panic), and Dorsal Vagal (shutdown, numbness, dissociation). You cannot think your way out of a dorsal freeze; you must shift somatic neuroception.',
      type: 'dilemma_choice',
      config: {
        scenario: 'Which biological state is your body currently embodying?',
        options: [
          { title: 'Ventral Vagal (Safe & Social)', school: 'Parasympathetic Engagement', desc: 'Heart rate steady, voice expressive, open to connection and creative exploration.', consequence: 'Optimal state for learning, love, and complex problem-solving.' },
          { title: 'Sympathetic (Fight / Flight)', school: 'Adrenergic Mobilization', desc: 'Chest tight, jaw clenched, racing thoughts, urge to attack or escape.', consequence: 'Prescription: Long exhalations and vigorous physical movement to discharge adrenaline.' },
          { title: 'Dorsal Vagal (Freeze / Shutdown)', school: 'Primitive Immobilization', desc: 'Heavy limbs, dead eyes, brain fog, feeling numb and disconnected from reality.', consequence: 'Prescription: Gentle sensory inputs (weighted blanket, humming, hot tea) to climb back to sympathetic.' }
        ]
      },
      faq: [
        { q: 'What is neuroception?', a: 'The subconscious detection of safety, danger, and life threat by the autonomic nervous system.' },
        { q: 'Can you skip directly from Freeze to Safe?', a: 'Biologically no; you usually have to climb through sympathetic mobilization (feeling anger or anxiety) before reaching ventral safety.' }
      ]
    },
    {
      slug: 'somatic-trauma-storage-body-map',
      title: 'Somatic Emotion Map [Where Is Your Body Storing Suppressed Grief and Rage?] | Digital Tools Shed',
      metaDesc: 'Correlate chronic physical tightness like jaw clenching and tight traps with unexpressed emotional states.',
      category: 'Somatic & Behavioral',
      summary: 'The body keeps the score. Map your jaw clenching, tight shoulders, and gut knots to suppressed emotional states.',
      deepDive: 'Bessel van der Kolk and somatic experiencing research prove that emotional distress is stored in myofascial tension. Jaw clenching represents unexpressed boundaries and anger; upper trap elevation represents chronic hypervigilance; stomach knots reflect existential anxiety.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'My shoulders are permanently glued to my ears and my jaw aches every morning',
        distortionName: 'Ignoring Somatic Somatization',
        realityCheck: 'Your traps are bracing for an invisible blow that never lands. Your jaw is biting down on words you were not allowed to say.',
        calibratedText: 'I invite my jaw to unhinge and my tongue to fall from the roof of my mouth. I give my body permission to stand down from alert.'
      },
      faq: [
        { q: 'Why does stress cause physical neck and jaw pain?', a: 'The trapezius and masseter muscles are wired directly into cranial nerves that prime the startle reflex during threat detection.' },
        { q: 'What is a somatic release?', a: 'A physiological discharge of trapped survival energy through trembling, yawning, deep sighing, or crying.' }
      ]
    },
    {
      slug: 'neuroticism-rumination-frequency-log',
      title: 'Neuroticism & Rumination Frequency Log [Catching the 2 AM Downward Spiral] | Digital Tools Shed',
      metaDesc: 'Track the frequency and duration of repetitive negative self-talk to measure cognitive defusion progress.',
      category: 'Somatic & Behavioral',
      summary: 'Catching yourself ruminating is the entire battle. Log your downward spirals and build cognitive defusion.',
      deepDive: 'High neuroticism predisposes minds to threat-scanning. Rumination is passive problem-solving turned inward. Acceptance and Commitment Therapy (ACT) uses cognitive defusion: noticing thoughts as mere words passing like leaves on a stream.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Daily Rumination Episodes (Count)',
        default1: 6,
        min1: 1,
        max1: 20,
        input2Label: 'Average Duration per Spiral (Minutes)',
        default2: 25,
        min2: 5,
        max2: 120,
        calcFormula: '((v1 * v2) / 60).toFixed(1)',
        unitLabel: 'Hours Spent Daily in Unproductive Mental Loops',
        insightTemplate: 'You are spending hours each day reliving past conversations. Defuse by labeling: "I am having the thought that I am unworthy."'
      },
      faq: [
        { q: 'What is cognitive defusion?', a: 'An ACT technique of stepping back and viewing thoughts as language events rather than literal truths.' },
        { q: 'Why doesn\'t rumination solve problems?', a: 'Because it focuses on "Why did this happen to me?" (blame) rather than "What is the concrete next action?" (agency).' }
      ]
    },
    {
      slug: 'locus-of-control-internal-external',
      title: 'Julian Rotter\'s Locus of Control Assessment [Do You Command Your Fate or Suffer It?] | Digital Tools Shed',
      metaDesc: 'Score whether you view life outcomes as driven by personal agency or luck, destiny, and powerful others.',
      category: 'Somatic & Behavioral',
      summary: 'Julian Rotter\'s classic psychological assessment: do you command your fate, or are you a passive victim of circumstances?',
      deepDive: 'Individuals with an internal locus of control believe outcomes result primarily from their own actions and efforts; those with an external locus attribute outcomes to luck, fate, or external systems. Extreme internal control leads to self-blame; extreme external control causes learned helplessness.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'Promotions and career success are primarily the result of hard work and competence.',
          'Most people can avoid bad luck by planning thoroughly in advance.',
          'When bad things happen, I usually find that my own choices contributed.',
          'What happens to me is completely my own doing.'
        ],
        highText: 'Strong Internal Locus of Control: You take high agency over your outcomes. Be mindful of avoiding self-blame when systemic randomness intervenes.',
        medText: 'Balanced Agency: You understand the boundary between your direct effort and macro factors outside your control.'
      },
      faq: [
        { q: 'What is locus of control?', a: 'A psychological concept developed by Julian Rotter in 1954 measuring the degree to which people believe they control their outcomes.' },
        { q: 'Which locus of control is healthier?', a: 'A moderate internal locus, where you maximize agency while accepting that chance and systems exist.' }
      ]
    },
    {
      slug: 'cognitive-dissonance-resolution-meter',
      title: 'Cognitive Dissonance Resolution Engine [Are You Changing Beliefs or Behavior?] | Digital Tools Shed',
      metaDesc: 'Audit the psychological tension when your core values contradict your daily habits with Festinger\'s dissonance model.',
      category: 'Somatic & Behavioral',
      summary: 'Leon Festinger proved that when our actions clash with our values, our brains either change our actions or invent comforting lies.',
      deepDive: 'Cognitive dissonance is the acute psychological discomfort felt when holding two contradictory cognitions. Because changing behavior is physically hard, the brain almost always resolves dissonance by unconsciously adjusting beliefs and rationalizing.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I deeply value physical health, but I spent all weekend eating junk food and sitting on the couch',
        distortionName: 'Dissonance Rationalization Trap',
        realityCheck: 'You are tempted to say "health doesn\'t really matter" to make the guilt stop. Tolerate the tension: your values are sound; your habit needs adjustment.',
        calibratedText: 'I value health, and I had a slip this weekend. I do not need to rewrite my philosophy to excuse a difficult couple of days.'
      },
      faq: [
        { q: 'Who discovered cognitive dissonance?', a: 'Leon Festinger in 1957, following his observation of a doomsday cult that rationalized away their failed prophecy.' },
        { q: 'How do humans usually resolve dissonance?', a: 'Through rationalization, trivialization, and confirmation bias.' }
      ]
    },
    {
      slug: 'confirmation-bias-falsification-tool',
      title: 'Confirmation Bias Falsification Engine [Actively Disprove Your Pet Theory] | Digital Tools Shed',
      metaDesc: 'Force Popperian falsification: What specific empirical evidence would convince you that your deeply held belief is completely wrong?',
      category: 'Somatic & Behavioral',
      summary: 'The human mind is a belief-justifying machine. Test your most sacred conviction against Karl Popper\'s falsification criterion.',
      deepDive: 'Confirmation bias leads us to notice, remember, and amplify evidence that supports our existing hypotheses while ignoring contradictions. The gold standard of intellectual honesty is asking: "What specific, observable data would prove me wrong?"',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'My political / philosophical / relationship conviction is 100% indisputably correct and opponents are evil or stupid',
        distortionName: 'Confirmation Bias & Dogmatic Shielding',
        realityCheck: 'If no imaginable evidence could prove your theory wrong, you are practicing religious dogma, not empirical reasoning.',
        calibratedText: 'I will define the exact experimental data that would cause me to abandon this belief. If that data appears, I will update my mind.'
      },
      faq: [
        { q: 'What is confirmation bias?', a: 'The tendency to search for, interpret, favor, and recall information that confirms preexisting beliefs.' },
        { q: 'What is Popperian falsification?', a: 'The epistemological rule that a theory can only be considered scientific if it can be proven false by empirical observation.' }
      ]
    },
    {
      slug: 'fundamental-attribution-error-mirror',
      title: 'Fundamental Attribution Error Mirror [Giving Others the Charity You Give Yourself] | Digital Tools Shed',
      metaDesc: 'Catch the reflex where you blame your own mistakes on bad luck, but blame others\' mistakes on bad character.',
      category: 'Somatic & Behavioral',
      summary: 'When I cut someone off in traffic, it\'s because I am rushing to an emergency; when someone cuts me off, they are a selfish monster.',
      deepDive: 'The Fundamental Attribution Error (Lee Ross) describes the systematic tendency to attribute other people\'s behavior to internal personality flaws while attributing our own identical behavior to external situational pressures.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'That colleague missed the deadline because they are lazy, incompetent, and uncommitted',
        distortionName: 'Fundamental Attribution Error (Actor-Observer Bias)',
        realityCheck: 'When you missed a deadline last month, you cited illness, family emergencies, and bad Wi-Fi.',
        calibratedText: 'They missed the deadline. I will assume they encountered situational friction rather than inventing a character defect.'
      },
      faq: [
        { q: 'What is the Fundamental Attribution Error?', a: 'The tendency to overemphasize personal characteristics and ignore situational factors in judging others.' },
        { q: 'How do you cure the attribution error?', a: 'By practicing symmetrical attribution: extend the same situational charity to strangers that you grant yourself.' }
      ]
    },
    {
      slug: 'halo-horn-effect-perception-audit',
      title: 'Halo vs Horn Effect Perception Bias Auditor [Separating Charisma from Virtue] | Digital Tools Shed',
      metaDesc: 'Determine if an attractive or charismatic person is blinding you to dangerous incompetence or ethical red flags.',
      category: 'Somatic & Behavioral',
      summary: 'Because someone is tall, attractive, or witty, our brains assume they must also be kind, honest, and competent. Audit the halo.',
      deepDive: 'Edward Thorndike\'s Halo Effect proves that positive impressions in one domain (appearance, charisma) spill over into unrelated domains (competence, integrity). The inverse Horn Effect blinds us to the virtues of socially awkward individuals.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'charisma', label: 'Perceived Charisma / Physical Polish', val: 9 },
          { id: 'track_record', label: 'Actual Verified Technical Competence', val: 3 },
          { id: 'ethics', label: 'Observed Ethical Consistency & Reliability', val: 4 }
        ],
        highAdvice: 'Critical Halo Vulnerability: You are dazzled by polish. Separate charisma from character. Review their actual deliverables without their voice in the room.',
        medAdvice: 'Balanced Perception: Continue demanding objective data rather than relying on charm.'
      },
      faq: [
        { q: 'What is the Halo Effect?', a: 'A cognitive bias in which our overall impression of a person influences how we feel and think about their character.' },
        { q: 'What is the Horn Effect?', a: 'The counterpart bias where one perceived negative trait causes an overall negative judgment across all domains.' }
      ]
    },
    {
      slug: 'dunning-kruger-calibration-curve',
      title: 'Dunning-Kruger Peak of Mount Stupid vs Valley of Despair [Self-Calibrator] | Digital Tools Shed',
      metaDesc: 'Calibrate your true expertise level across a skill between the Peak of Ignorance and the Slope of Enlightenment.',
      category: 'Somatic & Behavioral',
      summary: 'Beginners feel total confidence; true intermediates feel like idiots. Calibrate your position on the Dunning-Kruger curve.',
      deepDive: 'David Dunning and Justin Kruger demonstrated that novices lack the metacognitive competence to realize their own deficits, producing the "Peak of Mount Stupid." As knowledge grows, individuals tumble into the "Valley of Despair" before climbing the "Slope of Enlightenment."',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'conf', label: 'Subjective Feeling of Mastery (1 to 10)', val: 4 },
          { id: 'exp', label: 'Months / Years of Rigorous Practice', val: 3 }
        ],
        highAdvice: 'Valley of Despair: You now know enough to realize how vast the discipline is. Feeling humbled is the universal hallmark of real competence developing.',
        medAdvice: 'Mount Stupid Alert: If you feel total mastery after a 3-hour podcast, beware overconfidence.'
      },
      faq: [
        { q: 'What is the Dunning-Kruger effect?', a: 'A cognitive bias where people with low ability at a task overestimate their ability, while experts underestimate their relative competence.' },
        { q: 'Why is entering the Valley of Despair a good sign?', a: 'Because self-doubt requires sufficient domain knowledge to perceive the gap between amateur and master execution.' }
      ]
    },
    {
      slug: 'anchoring-bias-decision-unstick',
      title: 'Anchoring Bias Reset [Decouple from the First Number or Impression You Received] | Digital Tools Shed',
      metaDesc: 'Reset negotiations, purchases, or project estimates skewed by an arbitrary opening anchor number.',
      category: 'Somatic & Behavioral',
      summary: 'The first number spoken in a negotiation infects your judgment. Wipe the slate and calculate bottom-up intrinsic value.',
      deepDive: 'Amos Tversky and Daniel Kahneman proved that humans rely disproportionately on the first piece of information offered (the "anchor"). Even completely random numbers (e.g. spinning a roulette wheel) dramatically bias subsequent numerical estimates.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Initial Anchor Value Quoted ($)',
        default1: 15000,
        min1: 100,
        max1: 200000,
        step1: 500,
        input2Label: 'Bottom-Up First Principles Material Cost ($)',
        default2: 6000,
        min2: 50,
        max2: 100000,
        step2: 500,
        calcFormula: '(v1 - v2)',
        unitLabel: 'Dollar Premium Extracted by the Opening Anchor',
        insightTemplate: 'Discard the opening anchor entirely. Counter-offer based on your bottom-up intrinsic valuation.'
      },
      faq: [
        { q: 'What is anchoring bias?', a: 'The psychological tendency to rely heavily on the first trait or piece of information encountered when making decisions.' },
        { q: 'How do you defend against anchoring in negotiations?', a: 'Immediately reject the anchor verbally and establish your own bottom-up calculation.' }
      ]
    },
    {
      slug: 'availability-heuristic-fear-audit',
      title: 'Availability Heuristic Fear Auditor [Are You Scared Because It\'s Likely or Vivid?] | Digital Tools Shed',
      metaDesc: 'Disarm irrational fears like plane crashes or shark attacks fueled by dramatic news headlines with actuarial tables.',
      category: 'Somatic & Behavioral',
      summary: 'If you can picture a disaster vividly in your mind, your brain assumes it is common. Decouple vividness from statistical odds.',
      deepDive: 'The availability heuristic leads people to evaluate the frequency of an event by the ease with which examples come to mind. Because media broadcasts plane crashes and shark attacks with sensational video, they feel 1,000x more likely than driving a car or heart disease.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'vivid', label: 'Media Vividness & Emotional Terror', val: 9 },
          { id: 'actuarial', label: 'Actuarial Annual Probability (1 in 10 Million)', val: 1 }
        ],
        highAdvice: 'Availability Bias Triggered: You are terrified because the headline was dramatic, not because the risk is real. You are 2,000x more likely to die slipping in the bathtub.',
        medAdvice: 'Statistical Calibrated Peace: Rely on insurance actuarial tables rather than news broadcasts.'
      },
      faq: [
        { q: 'What is the availability heuristic?', a: 'A mental shortcut that relies on immediate examples that come to a given person\'s mind when evaluating a topic.' },
        { q: 'Why does air travel trigger more panic than driving?', a: 'Because plane crashes are rare and catastrophic, receiving weeks of global video coverage, while car crashes are mundane and localized.' }
      ]
    },
    {
      slug: 'hindsight-bias-inevitability-audit',
      title: 'Hindsight Bias I Knew It All Along Audit [The Lie of Predictable Chaos] | Digital Tools Shed',
      metaDesc: 'Stop beating yourself up over a past mistake by proving you could not have known the outcome in advance.',
      category: 'Somatic & Behavioral',
      summary: '"I knew it would fail!" No, you didn\'t. Reconstruct the actual fog of war at the moment you made the decision.',
      deepDive: 'Hindsight bias ("creeping determinism") alters our memory of past uncertainty. After an event occurs, the brain rewrites its history to make the outcome seem obvious and predictable, producing toxic and unearned regret.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I should have known that investment / relationship would collapse; I was so stupid not to see it',
        distortionName: 'Hindsight Bias & Creeping Determinism',
        realityCheck: 'At the time of the decision, you operated under incomplete information and high probabilistic fog. It was not predictable.',
        calibratedText: 'I made the most reasonable choice available given the limited data I possessed. I judge decisions by their process, not their luck-dominated outcomes.'
      },
      faq: [
        { q: 'What is hindsight bias?', a: 'The psychological inclination to see events that have occurred as having been more predictable than they were before they took place.' },
        { q: 'How does hindsight bias damage self-esteem?', a: 'It turns normal decision-making under uncertainty into perceived personal stupidity.' }
      ]
    },
    {
      slug: 'framing-effect-risk-tolerance-test',
      title: 'Tversky & Kahneman Framing Effect [How Word Choice Tricks Your Risk Choices] | Digital Tools Shed',
      metaDesc: 'Test how presenting identical options as 90% survival vs 10% mortality radically alters your decision with Kahneman\'s framing test.',
      category: 'Somatic & Behavioral',
      summary: 'Would you accept a surgery with a 90% survival rate? What about one with a 10% mortality rate? They are identical.',
      deepDive: 'The framing effect demonstrates that humans are risk-averse when outcomes are framed as gains ("saves 200 lives") but risk-seeking when identical outcomes are framed as losses ("400 people die"). Word choice tricks the amygdala into irrational risk shifts.',
      type: 'dilemma_choice',
      config: {
        scenario: 'A novel disease threatens 600 people. Which public health treatment do you select?',
        options: [
          { title: 'Gain Frame: Program A saves 200 lives for certain', school: 'Risk Aversion in Gains', desc: '72% of people choose this because "saving 200 lives" feels positive and guaranteed.', consequence: 'Identical to Program B mathematically.' },
          { title: 'Loss Frame: Program B ensures 400 people die for certain', school: 'Loss Avoidance', desc: 'Only 22% choose this, opting instead for a risky gamble, even though the mathematical outcome is identical.', consequence: 'Demonstrates how linguistic framing alters choices.' }
        ]
      },
      faq: [
        { q: 'What is the framing effect?', a: 'A cognitive bias where people decide on options based on whether they are presented with positive or negative connotations.' },
        { q: 'Who discovered the Asian Disease Problem?', a: 'Amos Tversky and Daniel Kahneman in their seminal 1981 paper on the framing of decisions.' }
      ]
    },
    {
      slug: 'loss-aversion-ratio-calculator',
      title: 'Prospect Theory Loss Aversion Ratio [Why Losing $100 Hurts Twice As Much] | Digital Tools Shed',
      metaDesc: 'Measure your personal loss aversion multiplier: How much gain do you require to take an even coin-flip gamble?',
      category: 'Somatic & Behavioral',
      summary: 'In Kahneman & Tversky\'s prospect theory, the pain of losing $100 is twice as intense as the joy of winning $100.',
      deepDive: 'Loss aversion is a foundational pillar of behavioral economics. Most adults will not accept a 50/50 bet of losing $100 unless the potential gain is at least $200 to $250, demonstrating a loss aversion ratio (lambda) of 2.0 to 2.5.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Potential Loss on a 50/50 Coin Flip ($)',
        default1: 100,
        min1: 10,
        max1: 1000,
        step1: 10,
        input2Label: 'Minimum Win You Demand to Take the Bet ($)',
        default2: 220,
        min2: 50,
        max2: 3000,
        step2: 10,
        calcFormula: '(v2 / v1).toFixed(2)',
        unitLabel: 'Your Personal Loss Aversion Ratio (Lambda)',
        insightTemplate: 'A lambda near 2.0-2.5 is typical. High loss aversion makes you hold losing investments and avoid calculated career risks.'
      },
      faq: [
        { q: 'What is loss aversion?', a: 'The tendency to prefer avoiding losses to acquiring equivalent gains.' },
        { q: 'How does loss aversion affect career choices?', a: 'It causes workers to cling to miserable, stable jobs because the potential loss of income feels twice as dangerous as the potential gain of fulfillment.' }
      ]
    },
    {
      slug: 'status-quo-bias-inertia-breaker',
      title: 'Status Quo Bias Inertia Breaker [The Hidden Cost of Defaulting to No Action] | Digital Tools Shed',
      metaDesc: 'Force an honest calculation of the hidden financial and emotional cost of staying the course over 1, 3, and 5 years.',
      category: 'Somatic & Behavioral',
      summary: 'Doing nothing is not free. Calculate the compounding emotional and financial cost of defaulting to the status quo.',
      deepDive: 'The status quo bias is an emotional preference for the current state of affairs. Humans disproportionately weigh potential transition losses while completely ignoring the ongoing compound hemorrhaging caused by inaction.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Monthly Cost / Drain of Staying in Current State ($ or Stress Hours)',
        default1: 450,
        min1: 50,
        max1: 5000,
        step1: 50,
        input2Label: 'Years Delayed by Inertia',
        default2: 3,
        min2: 1,
        max2: 10,
        step2: 1,
        calcFormula: '(v1 * 12 * v2)',
        unitLabel: 'Compounded Toll of Doing Nothing',
        insightTemplate: 'Defaulting to no action is itself an active decision that extracts a compound toll every single month.'
      },
      faq: [
        { q: 'Why do humans default to the status quo?', a: 'Because taking action creates a feeling of active responsibility for any negative outcome, whereas inaction feels blameless.' },
        { q: 'What is the reversal test?', a: 'If a change is suggested and opposed, ask if the reverse change would also be opposed; this exposes pure bias for the current state.' }
      ]
    },
    {
      slug: 'choice-overload-paralysis-reducer',
      title: 'Barry Schwartz\'s Paradox of Choice Reducer [Cut 20 Options Down to 3] | Digital Tools Shed',
      metaDesc: 'Overcome decision paralysis when shopping, selecting careers, or picking projects with elimination-by-aspects.',
      category: 'Somatic & Behavioral',
      summary: 'More choice doesn\'t bring more freedom; it brings paralysis and regret. Cut 20 overwhelming options down to 3.',
      deepDive: 'In *The Paradox of Choice*, Barry Schwartz showed that an abundance of options increases anxiety and makes individuals obsess over the opportunity costs of unchosen alternatives. Using Amos Tversky\'s "elimination by aspects" restores rapid decisive closure.',
      type: 'action_steps',
      config: {
        steps: [
          'Step 1: Write down all candidates (e.g. 10 laptops, 6 vacation spots, 5 job offers).',
          'Step 2: Pick ONE non-negotiable threshold (e.g. "Must weigh under 3 lbs" or "Must be under $1,200").',
          'Step 3: Discard every candidate that fails this single threshold without second-guessing.',
          'Step 4: From the remaining top 3, flip a coin. Notice whether you hope it lands on heads or tails.'
        ]
      },
      faq: [
        { q: 'What is the jam experiment?', a: 'Sheena Iyengar\'s famous study showing that customers exposed to 24 jams were 10x less likely to buy than those exposed to 6 jams.' },
        { q: 'What is a "satisficer" vs a "maximizer"?', a: 'Satisficers choose the first option that meets their criteria; maximizers exhaust themselves trying to find the single best option.' }
      ]
    },
    {
      slug: 'hedonic-treadmill-baseline-reset',
      title: 'Hedonic Treadmill Happiness Reset [Why Life Upgrades Lose Their Magic in 3 Months] | Digital Tools Shed',
      metaDesc: 'Predict how quickly you will adapt to a new raise, car, or apartment and return to your baseline happiness.',
      category: 'Somatic & Behavioral',
      summary: 'That new apartment or salary bump will feel miraculous for 90 days, then become your new baseline. Model your adaptation.',
      deepDive: 'Hedonic adaptation is the observed tendency of humans to quickly return to a relatively stable level of happiness despite major positive or negative events. Research shows lottery winners and paralyzed individuals return near their baseline set-point within 12 to 18 months.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Cost of Life Upgrade ($)',
        default1: 12000,
        min1: 500,
        max1: 100000,
        step1: 500,
        input2Label: 'Estimated Months Before Baseline Habituation',
        default2: 3,
        min2: 1,
        max2: 12,
        calcFormula: '(v1 / v2).toFixed(2)',
        unitLabel: '$ Cost Per Month of Temporary Novelty',
        insightTemplate: 'Happiness comes from deep relationships, autonomy, and meaningful craft—not material upgrades that habituate in 90 days.'
      },
      faq: [
        { q: 'What is the hedonic treadmill?', a: 'The theory that as a person makes more money or achieves success, expectations and desires rise in tandem, resulting in no permanent gain in happiness.' },
        { q: 'What activities resist hedonic adaptation?', a: 'Novel experiences, mindfulness, voluntary gratitude, and helping others.' }
      ]
    },
    {
      slug: 'comparison-trap-social-media-detox',
      title: 'The Comparison Trap Social Media Detox [Highlight Reels vs Behind-the-Scenes] | Digital Tools Shed',
      metaDesc: 'Combat envy triggered by peers announcing book deals and promotions by deconstructing curated social highlight reels.',
      category: 'Somatic & Behavioral',
      summary: 'You are comparing your messy, unedited behind-the-scenes footage to everyone else\'s curated highlight reel.',
      deepDive: 'Leon Festinger\'s social comparison theory notes that humans evaluate themselves through comparison with others. Social media algorithms curate the top 1% moments of peers, creating the mathematical illusion that everyone else is flourishing while you alone are struggling.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'Everyone on LinkedIn and Instagram is achieving massive success, buying homes, and thriving while I am falling behind',
        distortionName: 'Upward Social Comparison & Algorithmic Selection Bias',
        realityCheck: 'Nobody posts their panic attacks, debt notices, relationship arguments, or 2 AM tears. You are looking at a PR campaign.',
        calibratedText: 'I compare myself only to who I was yesterday. I refuse to measure my internal journey against an algorithmically curated advertisement.'
      },
      faq: [
        { q: 'Why is upward social comparison so toxic?', a: 'Because it exposes you to an artificial super-stimulus of peak moments that never existed in a single biological human.' },
        { q: 'How can you break the comparison trap?', a: 'Implement a 7-day social media fast and focus on tactile, embodied crafts where progress is tangible.' }
      ]
    }
  ];

  tools.forEach(addTool);
}

defineBatches68to115();

// Function to populate tools 87 to 115
function defineBatches87to115() {
  const tools = [
    // 87-103: Deep Psychology, Trauma & Neurodivergence
    {
      slug: 'existential-guilt-unlived-potential',
      title: 'Existential Guilt of Unlived Potential [Resolving the Mourning of What Could Be] | Digital Tools Shed',
      metaDesc: 'Address the agonizing feeling that you are squandering your gifts and intelligence by converting potential into micro-craft.',
      category: 'Deep Psychology & Trauma',
      summary: '"Potential" is not a badge of honor; it is an abstract burden that breeds chronic guilt. Trade potential for daily craft.',
      deepDive: 'Paul Tillich identified existential guilt as the awareness of unfulfilled potential. Untapped potential creates a toxic ghost that mocks present reality. The only cure is sacrificing abstract perfection to produce flawed, concrete work.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I had so much talent and intelligence as a child; I am squandering my potential and living a mediocre life',
        distortionName: 'Fetishization of Untapped Potential',
        realityCheck: 'Potential is just a theoretical possibility. An imperfect finished page of writing is worth more than a decade of unlived genius.',
        calibratedText: 'I surrender the idol of my "unlimited potential." I will show up today as a flawed, humble craftsman doing 30 minutes of real work.'
      },
      faq: [
        { q: 'What is existential guilt?', a: 'The profound realization that our life choices fall short of our deepest possibilities.' },
        { q: 'How do gifted children develop potential guilt?', a: 'Being praised for innate intelligence rather than effort creates terror of attempting difficult things where failure might expose limits.' }
      ]
    },
    {
      slug: 'loneliness-vs-solitude-reframe',
      title: 'Loneliness to Solitude Transformation Reframe [The Art of Being with Yourself] | Digital Tools Shed',
      metaDesc: 'Transform the pain of being alone into the creative and restorative power of solitude using Paul Tillich\'s distinction.',
      category: 'Deep Psychology & Trauma',
      summary: 'Paul Tillich said: "Language has created the word loneliness to express the pain of being alone, and the word solitude to express the glory of being alone."',
      deepDive: 'Loneliness is a state of deprivation, marked by feeling abandoned and cut off. Solitude is a state of fullness, where one discovers companionship with oneself. Shifting from loneliness to solitude requires intentional rituals and creative presence.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I am alone in this apartment on a Saturday night; nobody loves me and I am pathetic',
        distortionName: 'Confusing Solitude with Abandonment',
        realityCheck: 'Being physically alone is an open sanctuary. Millions of overburdened parents and workers would pay thousands for this unbroken silence.',
        calibratedText: 'This is not loneliness; this is sacred solitude. I have the evening entirely to myself to read, reflect, create, and rest without performing for anyone.'
      },
      faq: [
        { q: 'What is the difference between loneliness and solitude?', a: 'Loneliness is a perceived deficiency of social connection; solitude is the rich, voluntary presence with oneself.' },
        { q: 'How do you turn loneliness into solitude?', a: 'Light a candle, turn off notifications, make good food, and engage in an immersive activity you love.' }
      ]
    },
    {
      slug: 'death-anxiety-yalom-four-givens',
      title: 'Irvin Yalom\'s 4 Existential Givens [Death, Freedom, Isolation, Meaninglessness] | Digital Tools Shed',
      metaDesc: 'Evaluate which of the 4 existential bedrock conflicts is currently generating your underlying background anxiety.',
      category: 'Deep Psychology & Trauma',
      summary: 'Irvin Yalom identified the four ultimate concerns of human existence: Death, Freedom, Isolation, and Meaninglessness. Diagnose your trigger.',
      deepDive: 'In *Existential Psychotherapy*, Irvin D. Yalom argued that psychological defense mechanisms develop to shield us from four terrifying givens: the inevitability of death, absolute freedom and groundlessness, fundamental existential isolation, and the absence of pre-packaged meaning.',
      type: 'dilemma_choice',
      config: {
        scenario: 'Which existential bedrock conflict is generating your background dread?',
        options: [
          { title: '1. Inevitability of Death', school: 'Mortality & Finitude', desc: 'Dread of non-existence, physical aging, or illness.', consequence: 'Confrontation with death awakens urgency and destroys superficial vanity.' },
          { title: '2. Absolute Freedom (Groundlessness)', school: 'Radical Responsibility', desc: 'Terror that there is no blueprint; you are 100% responsible for your life.', consequence: 'Requires accepting authorial agency for your trajectory.' },
          { title: '3. Existential Isolation', school: 'Fundamental Solitude', desc: 'Awareness that no matter how close you are to someone, an unbridgeable gulf remains.', consequence: 'Allows love based on mature recognition rather than merger.' },
          { title: '4. Meaninglessness', school: 'The Search for Significance', desc: 'Confronting that the universe provides no assigned objective purpose.', consequence: 'Frees you to author your own purpose in daily human love.' }
        ]
      },
      faq: [
        { q: 'Who is Irvin Yalom?', a: 'A prominent American psychiatrist and author who pioneered existential psychotherapy.' },
        { q: 'Why are these called the "four givens"?', a: 'Because they are inescapable structural realities that every conscious human must negotiate.' }
      ]
    },
    {
      slug: 'existential-ennui-boredom-audit',
      title: 'Existential Ennui & Spiritual Boredom [Is Your Comfort Strangling Your Soul?] | Digital Tools Shed',
      metaDesc: 'Diagnose why having a stable job, food, and safety has produced a hollow, gray sense of apathy with voluntary hardship audits.',
      category: 'Deep Psychology & Trauma',
      summary: 'When all survival battles are won, the brain manufactures gray apathy. Diagnose whether hyper-comfort is suffocating your vitality.',
      deepDive: 'Humans evolved to meet constant physical challenges, danger, and community interdependence. Modern hyper-comfortable domesticity removes all friction, triggering existential ennui. The antidote is voluntary hardship, adventure, and creative struggle.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'My basic physical needs (food, warmth, safety) are met, yet I feel chronically numb.',
          'Days blend together in a routine of climate-controlled rooms and digital screens.',
          'I rarely encounter situations that require physical courage, endurance, or cold sweat.',
          'I feel a deep, unspoken craving for adventure or risk.'
        ],
        highText: 'Suffocation by Comfort: Your nervous system is starving for biological challenge. Prescriptions: Take cold showers, hike rugged terrain without headphones, engage in high-intensity martial arts, or embark on a creative project where failure is a real possibility.',
        medText: 'Mild Domestic Stagnation: Introduce a weekly adventure outside your algorithmic routine.'
      },
      faq: [
        { q: 'What is existential ennui?', a: 'A profound, chronic dissatisfaction and weariness arising from the perceived meaninglessness of a comfortable life.' },
        { q: 'What is voluntary hardship?', a: 'The deliberate practice of physical or psychological challenge (fasting, cold exposure, wilderness endurance) to reset gratitude and dopamine baseline.' }
      ]
    },
    {
      slug: 'unmet-childhood-needs-reparenting',
      title: 'Reparenting & Unmet Childhood Needs Inventory [Validating the Inner Child] | Digital Tools Shed',
      metaDesc: 'Identify whether adult emotional triggers stem from unfulfilled attunement, safety, or autonomy in childhood.',
      category: 'Deep Psychology & Trauma',
      summary: 'When you spiral over a minor slight, it isn\'t the adult spiraling—it is a wounded child part screaming for safety. Reparent yourself.',
      deepDive: 'Reparenting is the therapeutic practice of consciously providing yourself with the emotional safety, validation, boundaries, and acceptance that were missing or conditional in your childhood environment.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I am so needy and pathetic for wanting someone to comfort me right now',
        distortionName: 'Internalized Childhood Emotional Neglect',
        realityCheck: 'Wanting emotional comfort is a basic human mammalian need. Believing it is pathetic was a survival rule learned from emotionally unavailable caregivers.',
        calibratedText: 'I hear that young part of me that is scared and alone. As the adult in this body today, I am here, I am not leaving, and you are completely safe with me.'
      },
      faq: [
        { q: 'What is reparenting?', a: 'An emotional self-care process where you give your inner child the unconditional love, structure, and boundaries you needed growing up.' },
        { q: 'How can you practice reparenting in daily life?', a: 'By talking to yourself in times of distress using the tone of a wise, patient, and protective caregiver.' }
      ]
    },
    {
      slug: 'schema-therapy-life-traps-survey',
      title: 'Jeffrey Young\'s 18 Schema Therapy Early Maladaptive Life-Traps [Diagnostic Screener] | Digital Tools Shed',
      metaDesc: 'Identify core lifelong psychological traps like Abandonment, Defectiveness, and Subjugation with Jeffrey Young\'s screener.',
      category: 'Deep Psychology & Trauma',
      summary: 'Dr. Jeffrey Young\'s Schema Therapy identifies 18 early maladaptive schemas that dictate how we sabotage our lives. Screen your core trap.',
      deepDive: 'Early Maladaptive Schemas are enduring, pervasive themes regarding oneself and one\'s relationships developed during childhood and elaborated throughout life. Common schemas include Abandonment/Instability, Mistrust/Abuse, Defectiveness/Shame, and Subjugation.',
      type: 'dilemma_choice',
      config: {
        scenario: 'Which recurring life pattern has haunted your adult relationships the most?',
        options: [
          { title: 'Abandonment / Instability', school: 'Domain: Disconnection & Rejection', desc: 'Belief that significant others will inevitably leave, die, or find someone better.', consequence: 'Triggers frantic clinginess or preemptive bolting.' },
          { title: 'Defectiveness / Shame', school: 'Domain: Impaired Self-Esteem', desc: 'Core conviction that if anyone truly sees who you are inside, they will be disgusted.', consequence: 'Triggers perfectionist masking and profound intimacy avoidance.' },
          { title: 'Subjugation / Self-Sacrifice', school: 'Domain: Other-Directedness', desc: 'Feeling compelled to suppress your own desires to care for and appease others.', consequence: 'Leads to chronic physical exhaustion, autoimmune issues, and hidden resentment.' },
          { title: 'Unrelenting Standards', school: 'Domain: Over-Vigilance', desc: 'Belief that you must meet impossibly high standards to avoid severe criticism.', consequence: 'Destroys joy, produces workaholism, and strains relationships.' }
        ]
      },
      faq: [
        { q: 'What is Schema Therapy?', a: 'An integrative psychotherapy combining CBT, attachment theory, and psychodynamic concepts developed by Jeffrey Young.' },
        { q: 'Can early maladaptive schemas be changed?', a: 'Yes, through schema healing, behavioral pattern-breaking, and emotional imagery rescripting.' }
      ]
    },
    {
      slug: 'defense-mechanisms-ego-inventory',
      title: 'Freudian & Vaillant Defense Mechanism Inventory [From Sublimation to Denial] | Digital Tools Shed',
      metaDesc: 'Audit how your unconscious mind handles uncomfortable reality across George Vaillant\'s adaptation-to-life hierarchy.',
      category: 'Deep Psychology & Trauma',
      summary: 'From immature denial to mature humor and sublimation: audit how your ego shields itself from uncomfortable reality.',
      deepDive: 'George Vaillant organized Freudian defense mechanisms into a 4-level hierarchy based on the 75-year Harvard Grant Study: Level 1 (Psychotic/Denial), Level 2 (Immature/Projection), Level 3 (Neurotic/Repression/Intellectualization), and Level 4 (Mature/Sublimation/Humor). Mature defenses correlate with long-term happiness and health.',
      type: 'dilemma_choice',
      config: {
        scenario: 'How do you instinctively react when hit with an agonizing emotional shock or failure?',
        options: [
          { title: 'Intellectualization / Rationalization (Level 3)', school: 'Neurotic Defense', desc: 'Immediately retreat into cold academic analysis, statistics, and clinical terms to avoid feeling grief.', consequence: 'Keeps you functional, but disconnects you from genuine somatic healing.' },
          { title: 'Sublimation & Art (Level 4)', school: 'Mature Adaptive Defense', desc: 'Channeling raw grief and rage into writing, painting, music, or intense physical training.', consequence: 'Transforms destructive internal energy into constructive external beauty.' },
          { title: 'Humor & Self-Deprecation (Level 4)', school: 'Mature Adaptive Defense', desc: 'Finding the absurd, tragic comedy in the disaster without denying the pain.', consequence: 'Allows you to face reality alongside others without despair.' }
        ]
      },
      faq: [
        { q: 'Who developed the hierarchy of defense mechanisms?', a: 'Harvard psychiatrist George Vaillant categorized defenses into four developmental levels.' },
        { q: 'What is sublimation?', a: 'The psychological process of transforming socially unacceptable or painful impulses into productive, creative activities.' }
      ]
    },
    {
      slug: 'learned-helplessness-unlearning',
      title: 'Martin Seligman\'s Learned Helplessness to Learned Optimism [Reframing Tool] | Digital Tools Shed',
      metaDesc: 'Counteract the belief that nothing you do matters with Martin Seligman\'s ABCDE explanatory style reframing model.',
      category: 'Deep Psychology & Trauma',
      summary: 'When dogs were given inescapable shocks, they eventually stopped trying to escape even when the cage door was opened. Unlearn your helplessness.',
      deepDive: 'Martin Seligman\'s research proved that depression and passive resignation stem from learned helplessness. Learned optimism shifts explanatory styles across three dimensions: from Permanent ("It will always be this way") to Temporary, from Universal ("My whole life is ruined") to Specific, and from Personal ("I am defective") to External/Contextual.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'Nothing I ever do works out; I am cursed, my entire life is broken, and it will never change',
        distortionName: 'Learned Helplessness (3 P\'s: Permanent, Pervasive, Personal)',
        realityCheck: 'This specific effort failed under these specific circumstances. It is not permanent, it does not apply to all domains, and it was influenced by external variables.',
        calibratedText: 'ABCDE Reframe: This setback is temporary, specific to this project, and gives me actionable data for the next attempt.'
      },
      faq: [
        { q: 'What is learned helplessness?', a: 'A condition in which a person suffers from a sense of powerlessness, arising from a traumatic event or persistent failure to succeed.' },
        { q: 'What is Seligman\'s ABCDE model?', a: 'Adversity, Belief, Consequence, Disputation, and Energization—a framework for challenging pessimistic explanatory styles.' }
      ]
    },
    {
      slug: 'hypervigilance-threat-de-escalator',
      title: 'CPTSD Hypervigilance Threat De-escalator [Reality-Testing False Alarms] | Digital Tools Shed',
      metaDesc: 'Calm a nervous system stuck in high-threat scanning with a 5-question safety reality check.',
      category: 'Deep Psychology & Trauma',
      summary: 'When childhood taught you that danger was everywhere, your adult brain constantly scans facial expressions for threat. De-escalate false alarms.',
      deepDive: 'Hypervigilance is a symptom of post-traumatic stress where the autonomic nervous system remains locked in high-alert threat-scanning. The amygdala misinterprets neutral stimuli (a flat tone of voice, a creaking floorboard) as mortal danger.',
      type: 'somatic_timer',
      config: {
        defaultTimer: '03:00',
        durationSecs: 180,
        initialPhase: 'Threat De-escalation Protocol',
        phases: ['Ask: "Am I in physical danger right now, or in a memory?"', 'Look around the room: verify doors are locked and room is quiet', 'Feel the floor beneath your feet supporting your weight', 'Exhale slowly: "In this exact second, I am safe."'],
        somaticInstructions: 'Repeat: "My nervous system is acting on past programming. The room is quiet. I am an adult with choices now."'
      },
      faq: [
        { q: 'What causes chronic hypervigilance?', a: 'Growing up in unpredictable, violent, or emotionally volatile environments where survival required predicting adult anger.' },
        { q: 'How do you signal safety to a hypervigilant brain?', a: 'Slow peripheral visual scanning: slowly look around the room to physically verify the absence of predators.' }
      ]
    },
    {
      slug: 'window-of-tolerance-nervous-system',
      title: 'The Window of Tolerance Self-Check [Are You Hyper-Aroused or Hypo-Aroused?] | Digital Tools Shed',
      metaDesc: 'Check if your nervous system is within optimal regulatory bandwidth, spiked into panic, or collapsed into dissociation.',
      category: 'Deep Psychology & Trauma',
      summary: 'Dr. Dan Siegel\'s Window of Tolerance: are you regulated, spiked into hyper-arousal (panic/rage), or collapsed into hypo-arousal (numb/dissociated)?',
      deepDive: 'The Window of Tolerance describes the optimal zone of autonomic arousal where a person can function and process emotions effectively. Trauma and chronic stress shrink this window, causing people to spike into hyper-arousal or collapse into hypo-arousal with minor triggers.',
      type: 'slider_scale',
      config: {
        sliders: [
          { id: 'heart_agitation', label: 'Heart Rate & Agitation (Hyper-Arousal)', val: 5 },
          { id: 'brainfog_numbness', label: 'Brain Fog & Disconnection (Hypo-Arousal)', val: 5 }
        ],
        highAdvice: 'Outside the Window: You are either spiked into fight/flight panic or collapsed into hypo-arousal numbness. Step away from cognitive work and use temperature/sensory grounding.',
        medAdvice: 'Inside the Window: Your nervous system is in optimal regulatory bandwidth. You can engage with challenging tasks safely.'
      },
      faq: [
        { q: 'Who developed the Window of Tolerance?', a: 'Dr. Dan Siegel introduced the concept in 1999 to model nervous system arousal zones.' },
        { q: 'How do you widen your window of tolerance?', a: 'Through mindfulness, somatic therapy, predictable sleep schedules, and safe interpersonal relationships.' }
      ]
    },
    {
      slug: 'emotional-granularity-wheel-finder',
      title: 'Lisa Feldman Barrett\'s Emotional Granularity Wheel [Moving Beyond Fine or Bad] | Digital Tools Shed',
      metaDesc: 'Expand your emotional vocabulary to down-regulate the amygdala by up to 50% using Lisa Feldman Barrett\'s emotional granularity concepts.',
      category: 'Deep Psychology & Trauma',
      summary: 'Saying you feel "bad" leaves the brain helpless. Naming the exact emotion (Weltschmerz, Saudade, Tartle) cuts amygdala activation in half.',
      deepDive: 'Neuroscientist Lisa Feldman Barrett\'s research shows that the brain constructs emotions as predictions. Individuals with high emotional granularity (who distinguish between frustration, indignity, melancholy, and wistfulness) regulate stress significantly faster because precise labeling gives the brain targeted action scripts.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I just feel bad / stressed / anxious',
        distortionName: 'Low Emotional Granularity (Affective Blurring)',
        realityCheck: '"Bad" is a blunt category. Are you experiencing grief, physical exhaustion, humiliation, betrayal, or cognitive overwhelm?',
        calibratedText: 'Precise Label: "I am feeling Weltschmerz (world-weariness) and professional frustration over a lack of clarity in today\'s requirements."'
      },
      faq: [
        { q: 'What is emotional granularity?', a: 'The ability to construct more precise and nuanced emotional experiences rather than vague global states.' },
        { q: 'Why does naming an emotion calm the brain?', a: 'Affect labeling activates the right ventrolateral prefrontal cortex, which exerts inhibitory control over the amygdala.' }
      ]
    },
    {
      slug: 'alexithymia-body-sensations-translator',
      title: 'Toronto Alexithymia Scale TAS-20 [Translating Unnamed Physical Sensations] | Digital Tools Shed',
      metaDesc: 'Translate physical sensations like tight throat or fluttering stomach into corresponding emotional states.',
      category: 'Deep Psychology & Trauma',
      summary: 'Alexithymia makes it hard to identify what you feel. Translate physical somatic sensations into emotional insights.',
      deepDive: 'Alexithymia is a sub-clinical trait characterized by difficulty identifying and describing subjective feelings. Sufferers feel visceral physical symptoms (tight chest, clenched gut, headache) without recognizing that they are experiencing grief or rage.',
      type: 'dilemma_choice',
      config: {
        scenario: 'What dominant physical sensation is your body registering right now?',
        options: [
          { title: 'Tight, constricted throat & burning eyes', school: 'Suppressed Grief / Sorrow', desc: 'The globus sensation in the pharynx: your body wants to weep but your cortex is holding back tears.', consequence: 'Action: Give yourself privacy, play melancholy music, and allow the somatic release of tears.' },
          { title: 'Knotted stomach / churning nausea', school: 'Existential Dread / Threat Anticipation', desc: 'The enteric nervous system detecting perceived boundary violation or acute uncertainty.', consequence: 'Action: Drink warm chamomile tea and write down the single thing you fear losing.' },
          { title: 'Clenched teeth & burning heat in chest', school: 'Repressed Anger / Violation', desc: 'Sympathetic motor preparation to bite or defend against boundary transgressions.', consequence: 'Action: Punch a pillow or do 15 pushups to discharge the motor preparatory energy.' }
        ]
      },
      faq: [
        { q: 'What is alexithymia?', a: 'A personality trait characterized by the inability to identify and describe emotions experienced by oneself.' },
        { q: 'How common is alexithymia?', a: 'It affects roughly 10% of the general population and is particularly prevalent among autistic and ADHD individuals.' }
      ]
    },
    {
      slug: 'interoception-body-signals-triage',
      title: 'Interoceptive Awareness Triage [Hungry, Angry, Lonely, Tired HALT Matrix] | Digital Tools Shed',
      metaDesc: 'Determine if your overwhelming existential despair is actually low blood sugar, dehydration, or sleep deprivation.',
      category: 'Deep Psychology & Trauma',
      summary: 'Before diagnosing yourself with a ruined life or existential depression, check if you drank water and slept 8 hours.',
      deepDive: 'Interoception is the perception of internal bodily states (hunger, thirst, heart rate, bladder fullness). Neurodivergent individuals frequently struggle with interoceptive lag: low blood glucose or dehydration is misinterpreted by the brain as profound philosophical despair.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'Have I drank at least 500ml of water in the last 4 hours?',
          'Have I consumed protein or complex carbohydrates in the last 5 hours?',
          'Have I stepped outside into natural sunlight or fresh air today?',
          'Did I sleep at least 7 hours last night?'
        ],
        highText: 'Biological Baseline Stable: Your physical needs are met; your emotional distress is likely psychological or interpersonal.',
        medText: 'Interoceptive Deficit: You have not eaten or hydrated properly! Do NOT entertain philosophical despair right now. Drink a tall glass of water, eat a high-protein snack, and re-evaluate in 30 minutes.'
      },
      faq: [
        { q: 'What is interoception?', a: 'The sense that helps you feel and understand what is going on inside your body (hunger, temperature, pain).' },
        { q: 'Why do low blood sugar and dehydration mimic depression?', a: 'Glucose deprivation starves the prefrontal cortex, impairing cognitive reframing and magnifying threat perception.' }
      ]
    },
    {
      slug: 'sensory-diet-neurodivergent-planner',
      title: 'Neurodivergent Sensory Diet Planner [Calibrate Proprioceptive & Vestibular Input] | Digital Tools Shed',
      metaDesc: 'Create a daily schedule of sensory inputs like heavy work and noise-canceling to prevent sensory meltdowns.',
      category: 'Deep Psychology & Trauma',
      summary: 'Sensory overload is cumulative. Balance your daily sensory budget across proprioceptive, vestibular, and acoustic inputs.',
      deepDive: 'Occupational therapy sensory diets provide controlled, personalized sensory inputs to maintain autonomic nervous system regulation. Proprioceptive "heavy work" (carrying weights, deep pressure) calms an over-aroused central nervous system.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Daily Hours in Loud / Bright Environments',
        default1: 6,
        min1: 1,
        max1: 12,
        input2Label: 'Proprioceptive "Heavy Work" Minutes Completed',
        default2: 15,
        min2: 0,
        max2: 60,
        step2: 5,
        calcFormula: 'Math.max(0, Math.round((v1 * 15) - v2))',
        unitLabel: 'Minutes of Sensory Deficit / Decompression Owed',
        insightTemplate: 'You owe your sensory nervous system decompression time. Put on noise-canceling headphones in a dark room under a weighted blanket.'
      },
      faq: [
        { q: 'What is a sensory diet?', a: 'A carefully designed, personalized activity plan providing the sensory inputs a person needs to stay focused and calm.' },
        { q: 'What is proprioceptive heavy work?', a: 'Activities that push or pull against the body (weightlifting, carrying groceries, yoga, deep pressure) that calm the sensory system.' }
      ]
    },
    {
      slug: 'autistic-masking-burnout-index',
      title: 'Autistic Masking & Camouflaging Compensation Index [CAT-Q Screener] | Digital Tools Shed',
      metaDesc: 'Measure the psychological toll of forcing eye contact, mimicking small talk, and suppressing stimming with the CAT-Q model.',
      category: 'Deep Psychology & Trauma',
      summary: 'Camouflaging neurodivergent traits to fit neurotypical standards drains massive cognitive reserves, leading to autistic burnout.',
      deepDive: 'The Camouflaging Autistic Traits Questionnaire (CAT-Q) measures compensation, masking, and assimilation. Chronic masking requires running a continuous conscious simulation of "normalcy," which frequently culminates in loss of speech, executive collapse, and clinical depression.',
      type: 'diagnostic_quiz',
      config: {
        questions: [
          'I consciously monitor my facial expressions, eye contact, and body language in conversations.',
          'I practice scripts, jokes, or small-talk topics in my head before social events.',
          'I suppress the urge to stim (tap, rock, fiddle) when others are watching.',
          'After socializing, I feel completely depleted, as if I had been acting on a theater stage.'
        ],
        highText: 'Severe Masking Exhaustion: You are expending massive prefrontal reserves maintaining a neurotypical performance. Unmasking safely in private environments and with trusted peers is essential to prevent chronic autistic burnout.',
        medText: 'Situational Camouflaging: You deploy masking selectively in professional contexts.'
      },
      faq: [
        { q: 'What is autistic masking?', a: 'The conscious or unconscious suppression of autistic traits and adoption of neurotypical behaviors to avoid stigma.' },
        { q: 'What is autistic burnout?', a: 'A state of profound mental, emotional, or physical exhaustion, accompanied by a loss of skills, resulting from chronic masking.' }
      ]
    },
    {
      slug: 'pathological-demand-avoidance-reframe',
      title: 'PDA Pervasive Drive for Autonomy [Internal Demand Neutralization Engine] | Digital Tools Shed',
      metaDesc: 'Bypass the nervous system freeze triggered when you tell yourself you have to do something with declarative curiosity.',
      category: 'Deep Psychology & Trauma',
      summary: 'When you tell yourself "I must brush my teeth," your nervous system perceives an intolerable threat to autonomy. Neutralize demands.',
      deepDive: 'Pathological Demand Avoidance (PDA, or Pervasive Drive for Autonomy) is a neurodivergent profile characterized by an intense need for autonomy. Demands are registered as existential threats by the nervous system. Shifting from imperative language ("You have to") to declarative observations ("Water is in the kettle") bypasses the threat-response.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I HAVE TO submit this invoice right now or I am a failure',
        distortionName: 'Imperative Demand Triggering Autonomic Threat',
        realityCheck: 'Imperative phrasing ("I must", "I have to") activates defensive rebellion in PDA profiles.',
        calibratedText: 'Declarative Neutral Reframe: "The invoice portal is open on screen. I wonder what happens if I click submit."'
      },
      faq: [
        { q: 'What is PDA?', a: 'A neurodivergent profile on the autism spectrum characterized by an intense need for autonomy and resistance to everyday demands.' },
        { q: 'How does declarative language help PDA?', a: 'Declarative language simply states facts without issuing commands, inviting participation rather than triggering resistance.' }
      ]
    },
    {
      slug: 'spoons-theory-energy-budget-calculator',
      title: 'Christine Miserandino\'s Spoon Theory Chronic Illness [Daily Energy Budget Ledger] | Digital Tools Shed',
      metaDesc: 'Allocate a finite daily budget of energy spoons across essential tasks to prevent chronic illness burnout.',
      category: 'Deep Psychology & Trauma',
      summary: 'Healthy people have an endless drawer of spoons. You start each day with 12. Budget your energy before you go bankrupt.',
      deepDive: 'Christine Miserandino created "The Spoon Theory" in 2003 to explain life with chronic illness (Lupus). Every basic daily action (showering = 1 spoon, cooking = 2 spoons, socializing = 3 spoons) depletes a finite daily allowance. Going into spoon debt borrows from tomorrow\'s vitality.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Daily Spoons Starting Budget',
        default1: 12,
        min1: 4,
        max1: 20,
        input2Label: 'Spoons Committed to Tasks Today',
        default2: 15,
        min2: 2,
        max2: 30,
        calcFormula: '(v1 - v2)',
        unitLabel: 'Net Spoons (Negative = Borrowing from Tomorrow)',
        insightTemplate: 'If you are in negative spoon territory, you are borrowing from tomorrow\'s biological reserves. Cut one non-essential chore today.'
      },
      faq: [
        { q: 'What is Spoon Theory?', a: 'A metaphor used by individuals with chronic illness and neurodivergence to describe their limited daily energy reserves.' },
        { q: 'What happens when you run out of spoons?', a: 'You enter physical crash or executive shutdown, requiring extended recovery time.' }
      ]
    },

    // 104-115: Sleep, Nocturnal Mind & Stoic Wisdom
    {
      slug: 'sleep-inertia-grogginess-remedy',
      title: 'Sleep Inertia & Prefrontal Hypofrontality [Morning Clearance Protocol] | Digital Tools Shed',
      metaDesc: 'Eliminate heavy morning brain fog and prefrontal hypofrontality with an evidence-backed adenosine clearance protocol.',
      category: 'Stoicism & Wisdom',
      summary: 'Waking up with heavy limbs and zero willpower isn\'t depression—it is sleep inertia. Clear adenosine with sunlight and cold water.',
      deepDive: 'Sleep inertia is the physiological state of impaired cognitive and sensory-motor performance immediately upon waking. Cortical blood flow is reduced, and residual adenosine binds to receptors. Protocols that trigger cortisol awakening response (CAR)—lux light, hydration, and upright posture—accelerate clearance.',
      type: 'action_steps',
      config: {
        steps: [
          'Step 1: Sit bolt upright immediately; avoid lying back down into micro-sleep.',
          'Step 2: Chug 500ml of cold water with a pinch of salt to restore blood volume.',
          'Step 3: Step outside or look directly into a 10,000-lux lamp for 5 minutes (stimulates melanopsin).',
          'Step 4: Delay caffeine for 90 minutes to prevent afternoon adenosine rebound.'
        ]
      },
      faq: [
        { q: 'What is sleep inertia?', a: 'The transitional state between sleep and waking, marked by grogginess and impaired cognitive function.' },
        { q: 'Why should you delay morning caffeine by 90 minutes?', a: 'Allowing your body to clear residual adenosine naturally first prevents afternoon caffeine crashes.' }
      ]
    },
    {
      slug: 'bedtime-worry-dump-parking-lot',
      title: '2 AM Bedtime Worry Dump [Digital Cognitive Parking Lot & Postponement Pouch] | Digital Tools Shed',
      metaDesc: 'Empty racing late-night thoughts onto a digital notepad with an automated promise to review tomorrow at 10 AM.',
      category: 'Stoicism & Wisdom',
      summary: 'The brain loops worries at night because it fears you will forget them. Park them in the morning vault so your cortex can sleep.',
      deepDive: 'Cognitive postponement research shows that writing down specific worries and scheduling a dedicated "worry window" the following morning reduces nocturnal prefrontal arousal by satisfying working memory retention loops.',
      type: 'somatic_timer',
      config: {
        defaultTimer: '02:00',
        durationSecs: 120,
        initialPhase: 'Cognitive Parking Lot Active',
        phases: ['Dump the worry onto this digital surface', 'Commit to reviewing it tomorrow at 10:00 AM', 'Close your eyes and breathe into your belly', 'The worry is safely archived'],
        somaticInstructions: 'Your brain has logged the concern. It is safely archived in the vault. You are released from monitoring it tonight.'
      },
      faq: [
        { q: 'Why does writing worries down help sleep?', a: 'It provides cognitive closure: the brain no longer needs to rehearse the memory loop to prevent forgetting.' },
        { q: 'What is stimulus control in sleep hygiene?', a: 'Conditioning the bed strictly for sleep and intimacy, removing problem-solving and screens from the mattress.' }
      ]
    },
    {
      slug: 'somniphobia-sleep-dread-calmer',
      title: 'Somniphobia & Fear of Falling Asleep [Somatic Calming Sequence & Shuffle] | Digital Tools Shed',
      metaDesc: 'Calm the acute panic triggered by letting go of conscious control with cognitive shuffling and serial diverse imagining.',
      category: 'Stoicism & Wisdom',
      summary: 'Terrified of the moment conscious control slips away? Deploy cognitive shuffling (Serial Diverse Imagining) to gently lull the brain.',
      deepDive: 'Luc Beaudoin\'s Cognitive Shuffle (Serial Diverse Imagining) disrupts sleep-onset insomnia. The cortex fears surrendering executive control; generating random, emotionally neutral visual images (e.g. teapot, cow, velvet, piano) mimics the natural micro-dream state of hypnagogic sleep.',
      type: 'somatic_timer',
      config: {
        defaultTimer: '04:00',
        durationSecs: 240,
        initialPhase: 'Cognitive Shuffle Ready',
        phases: ['Visualize a letter (e.g. B)', 'Picture words: Boat... Bicycle... Bread...', 'Keep images neutral and visual', 'Let your mind gently drift into hypnagogia'],
        somaticInstructions: 'Random, non-threatening imagery signals to the sleep-wake switch in the hypothalamus that no predators are nearby.'
      },
      faq: [
        { q: 'What is somniphobia?', a: 'An intense, irrational fear of falling asleep, often linked to fear of nightmares, sleep paralysis, or loss of control.' },
        { q: 'What is the Cognitive Shuffle?', a: 'A mental technique where you imagine random, neutral objects to simulate the hypnagogic state, triggering sleep onset.' }
      ]
    },
    {
      slug: 'midnight-panic-attack-sos-pacer',
      title: 'Midnight Panic Attack SOS Pacer [4-7-8 Breathing & Dive Reflex Ice Water Protocol] | Digital Tools Shed',
      metaDesc: 'Immediate emergency somatic reset for nocturnal panic attacks with mammalian dive reflex ice water and 4-7-8 pacing.',
      category: 'Stoicism & Wisdom',
      summary: 'Woke up gasping with a racing heart at 3 AM? Activate the mammalian dive reflex to force parasympathetic bradycardia.',
      deepDive: 'Submerging your face in a bowl of ice water (10-15°C) activates the mammalian dive reflex via trigeminal nerve receptors, stimulating the vagus nerve and immediately dropping heart rate by 15-25% while overriding adrenaline.',
      type: 'somatic_timer',
      config: {
        defaultTimer: '03:00',
        durationSecs: 180,
        initialPhase: 'Emergency Parasympathetic Pacing',
        phases: ['Inhale gently through nose (4s)', 'Hold breath gently (7s)', 'Long, audible whooshing exhale (8s)', 'Heart rate slowing down'],
        somaticInstructions: 'Your heart is healthy; it is simply responding to a harmless adrenaline surge. Cold water on your face stimulates immediate vagal braking.'
      },
      faq: [
        { q: 'Why do nocturnal panic attacks happen during sleep?', a: 'Sudden transitions from deep slow-wave sleep to light sleep can trigger hyperventilation or autonomic spikes without conscious warning.' },
        { q: 'What is the mammalian dive reflex?', a: 'A physiological response to cold water on the face that prioritizes oxygen to the brain and rapidly slows the heart rate.' }
      ]
    },
    {
      slug: 'imposter-syndrome-attribution-re-mapper',
      title: 'Attribution Retraining [Re-Mapping Luck to Diligence, Competence and Skill] | Digital Tools Shed',
      metaDesc: 'Train the brain to internalize successes instead of crediting luck, timing, or external help with attribution retraining.',
      category: 'Stoicism & Wisdom',
      summary: 'You attribute all your successes to luck and all your failures to incompetence. Symmetrically retrain your attribution model.',
      deepDive: 'Attribution retraining is an empirical intervention that modifies how individuals explain success and failure. High-imposter individuals attribute success to unstable external factors (luck, timing) and failure to stable internal deficits (stupidity). Flipping this script heals the imposter fracture.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I got this promotion / client only because nobody else applied and they felt sorry for me',
        distortionName: 'Externalizing Success / Internalizing Failure',
        realityCheck: 'Hiring managers do not hand out compensation out of pity. You met rigorous technical criteria and solved their immediate problem.',
        calibratedText: 'I earned this outcome through preparation, diligence, and demonstrated skill. Luck may open a door, but competence walks through it.'
      },
      faq: [
        { q: 'What is attribution retraining?', a: 'A cognitive therapeutic method that helps people develop healthy, realistic explanations for their successes and setbacks.' },
        { q: 'Why do high achievers struggle to take credit?', a: 'Because internalizing success feels dangerous to an ego conditioned to avoid pride or envy from peers.' }
      ]
    },
    {
      slug: 'stoic-premeditatio-malorum-simulator',
      title: 'Marcus Aurelius Premeditatio Malorum [Daily Worst-Case Pre-Mortem Visualizer] | Digital Tools Shed',
      metaDesc: 'Practice voluntary mental rehearsal of adversity to inoculate against shock and emotional fragility.',
      category: 'Stoicism & Wisdom',
      summary: 'Marcus Aurelius said: "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant, dishonest..."',
      deepDive: 'Stoic *Premeditatio Malorum* (premeditation of evils) is negative visualization. Rehearsing potential setbacks in advance prevents emotional shock and replaces panic with calm, prepared protocols.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'Tomorrow must go smoothly or I will be completely devastated and overwhelmed',
        distortionName: 'Fragile Optimism & Shock Vulnerability',
        realityCheck: 'Things will go wrong tomorrow: servers will lag, colleagues will be rushed, and traffic will stall. Expecting perfection makes you fragile.',
        calibratedText: 'Premeditatio Malorum: I foresee delays, friction, and difficult personalities. I have already mentally prepared my calm response. Nothing can shock me.'
      },
      faq: [
        { q: 'Is negative visualization depressing?', a: 'No; it is calming. By confronting the worst-case scenario calmly, you realize you have the resilience to survive it.' },
        { q: 'How does this differ from anxious catastrophizing?', a: 'Catastrophizing is an uncontrolled emotional spiral of helplessness; premeditatio malorum is a deliberate, calm rehearsal of agency.' }
      ]
    },
    {
      slug: 'stoic-dichotomy-of-control-sorter',
      title: 'Epictetus Dichotomy of Control Sorter [What Is in Your Power vs Outside It] | Digital Tools Shed',
      metaDesc: 'Drag and drop worry items into In My Control vs Not in My Control, vaporizing the uncontrollable.',
      category: 'Stoicism & Wisdom',
      summary: 'Epictetus\' foundational Stoic rule: some things are up to us, and some things are not. Free your mind from the uncontrollable.',
      deepDive: 'The Stoic Enchiridion begins: "Some things are in our control and others not." Things in our control include our opinions, desires, choices, and efforts; things outside our control include our body, reputation, market conditions, and other people\'s minds.',
      type: 'action_steps',
      config: {
        steps: [
          'Item 1: Other people\'s opinions of me → [OUTSIDE MY CONTROL - VAPORIZE]',
          'Item 2: Macroeconomic interest rates & inflation → [OUTSIDE MY CONTROL - VAPORIZE]',
          'Item 3: My direct effort, honesty, and preparation today → [100% IN MY CONTROL - EXECUTE]',
          'Item 4: Past mistakes and unchangeable history → [OUTSIDE MY CONTROL - SURRENDER]'
        ]
      },
      faq: [
        { q: 'What is the Dichotomy of Control?', a: 'The fundamental Stoic principle dividing reality into things we control (thoughts, efforts) and things we do not (outcomes, others).' },
        { q: 'How does the dichotomy cure anxiety?', a: 'By focusing 100% of your energy on effort and preparation, while detaching emotionally from the uncontrollable outcome.' }
      ]
    },
    {
      slug: 'seneca-shortness-of-life-calculator',
      title: 'Seneca\'s On the Shortness of Life [Time Theft & Wasted Hours Auditor] | Digital Tools Shed',
      metaDesc: 'Calculate how many hours of your life are stolen by trivia, commuting, and people-pleasing with Seneca\'s audit.',
      category: 'Stoicism & Wisdom',
      summary: 'Seneca wrote: "It is not that we have a short time to live, but that we waste a lot of it." Calculate your True Autonomous Life Fraction.',
      deepDive: 'In *De Brevitate Vitae*, Seneca argues that humans guard their money fiercely with walls and locks, yet freely hand over their irreplaceable time to boring obligations, sycophancy, and trivial vanity.',
      type: 'chrono_calculator',
      config: {
        input1Label: 'Total Waking Hours in a Day',
        default1: 16,
        min1: 12,
        max1: 18,
        input2Label: 'Hours Stolen by Trivia, Pleasing, & Mindless Scrolling',
        default2: 5.5,
        min2: 1,
        max2: 12,
        step2: 0.5,
        calcFormula: 'Math.round(((v1 - v2) / v1) * 100)',
        unitLabel: '% True Autonomous Life Fraction',
        insightTemplate: 'You are letting external distractions steal over a third of your conscious life. Guard your hours more fiercely than your bank account.'
      },
      faq: [
        { q: 'What was Seneca\'s main point in "On the Shortness of Life"?', a: 'Life is sufficiently long if well invested, but most people squander it on trivial distractions and people-pleasing.' },
        { q: 'What is the "busy idleness" Seneca warned against?', a: 'Being constantly busy with meetings, status games, and shallow tasks that produce zero spiritual fulfillment.' }
      ]
    },
    {
      slug: 'existential-legacy-epitaph-generator',
      title: 'Your 100-Word Living Epitaph [Value-Driven Life Compass Generator] | Digital Tools Shed',
      metaDesc: 'Clarify life priorities by drafting what you genuinely hope those who knew you best will remember.',
      category: 'Stoicism & Wisdom',
      summary: 'Nobody has their net worth, job title, or LinkedIn followers engraved on their tombstone. Draft your living epitaph.',
      deepDive: 'Stephen Covey\'s "Begin with the end in mind" and existential therapy utilize the living epitaph exercise to strip away vanity metrics and clarify core virtues (kindness, courage, integrity, loyalty).',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'I need more money, a higher job title, and prestige so people will respect my legacy',
        distortionName: 'Vanity Metrics vs Authentic Legacy',
        realityCheck: 'Within 50 years of death, corporate titles are forgotten. Loved ones remember only how you made them feel and whether you were present.',
        calibratedText: 'Living Epitaph: "Here lived a soul who was present, kind to the vulnerable, courageous in adversity, and loved deeply."'
      },
      faq: [
        { q: 'Why write a living epitaph while young?', a: 'To serve as a moral compass for daily decisions, ensuring you do not trade meaningful relationships for hollow career prestige.' },
        { q: 'What virtues endure in human memory?', a: 'Compassion, dependability, humor, and unconditional presence.' }
      ]
    },
    {
      slug: 'nostalgia-vs-memory-accuracy-test',
      title: 'Memory Rosy Retrospection vs Actual Past Journal [Comparison Audit] | Digital Tools Shed',
      metaDesc: 'Audit how your brain systematically erases past pain, anxiety, and boredom, leaving an idealized golden glow.',
      category: 'Stoicism & Wisdom',
      summary: 'Rosy retrospection makes the past seem idyllic while the present feels burdensome. Contrast idealized memory with factual reality.',
      deepDive: 'Psychological research shows that memory is reconstructive, not reproductive. Negative emotions associated with past events decay faster than positive ones (fading affect bias), creating a false golden glow around old jobs, cities, and ex-partners.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'My life in 2018 was pure magic and perfection; everything since has been a tragic decline',
        distortionName: 'Rosy Retrospection & Fading Affect Bias',
        realityCheck: 'If you check your 2018 journal or text messages, you were anxious about rent, struggling with dating, and bored on Tuesday afternoons.',
        calibratedText: 'My past had its moments of joy, but also heavy uncertainty. The present moment is the only place where living, breathing joy can occur.'
      },
      faq: [
        { q: 'What is rosy retrospection?', a: 'The psychological phenomenon where people judge past events more positively than they judged them when they were occurring.' },
        { q: 'What is fading affect bias?', a: 'A psychological bias in which memories associated with unpleasant emotions fade faster than those associated with pleasant emotions.' }
      ]
    },
    {
      slug: '2am-lonely-astronaut-perspective',
      title: 'The Overview Effect Earth from Space [Mental Shift for Late-Night Anxiety] | Digital Tools Shed',
      metaDesc: 'Shift perspective from microscopic personal troubles to the vast, peaceful pale blue dot suspended in blackness.',
      category: 'Stoicism & Wisdom',
      summary: 'Astronauts who see Earth from orbit experience an overwhelming cognitive shift: the Overview Effect. Zoom out from your late-night ceiling.',
      deepDive: 'Frank White coined the "Overview Effect" to describe the cognitive shift reported by astronauts viewing Earth from space. National borders vanish, personal squabbles seem microscopic, and a profound sense of universal kinship and fragility takes over.',
      type: 'somatic_timer',
      config: {
        defaultTimer: '03:00',
        durationSecs: 180,
        initialPhase: 'Cosmic Pale Blue Dot Perspective',
        phases: ['Zoom out: see your room from the ceiling', 'Zoom out: see your city glowing in the night', 'Zoom out: see Earth as a tiny blue marble in black space', 'Your anxieties are microscopic; you are part of a cosmic miracle'],
        somaticInstructions: 'Carl Sagan: "Look again at that dot. That\'s here. That\'s home. That\'s us." Banish late-night trivial dread.'
      },
      faq: [
        { q: 'What is the Overview Effect?', a: 'A cognitive shift in awareness reported by some astronauts during spaceflight, characterized by a feeling of awe and interconnectedness.' },
        { q: 'How does cosmic perspective reduce acute anxiety?', a: 'By shrinking personal ego problems down to cosmic scale, relieving the prefrontal burden of self-importance.' }
      ]
    },
    {
      slug: 'existential-relief-cosmic-insignificance',
      title: 'Optimistic Nihilism [Why Your Cosmic Insignificance Is the Ultimate Freedom] | Digital Tools Shed',
      metaDesc: 'Reframe the lack of predetermined cosmic meaning from terrifying abyss into total liberating psychological freedom.',
      category: 'Stoicism & Wisdom',
      summary: 'If the universe doesn\'t care, your embarrassments don\'t matter, your failures are forgotten, and you are free to author your own purpose.',
      deepDive: 'Optimistic nihilism acknowledges that the universe has no grand grand plan, no objective scorekeeper, and no destined destiny. Rather than despair, this is the ultimate liberation: you are an accidental flicker of conscious stardust, free to love, play, and make your own meaning.',
      type: 'cbt_reframing',
      config: {
        defaultThought: 'The universe is so vast and indifferent; in 100 billion years nothing I did will matter, so life is pointless',
        distortionName: 'Existential Despair & Meaning Nihilism',
        realityCheck: 'Why does meaning require an infinite timeline? A delicious meal or a warm hug matters right now while it is experienced.',
        calibratedText: 'Optimistic Nihilism: If the universe has no inherent purpose, the pressure is off. My embarrassments will fade, and I am free to love and create joy today.'
      },
      faq: [
        { q: 'What is optimistic nihilism?', a: 'The philosophy that because life has no predetermined meaning, we are completely free to construct our own purpose and joy.' },
        { q: 'Why does cosmic scale offer relief?', a: 'Because realizing that the galaxy is indifferent frees you from the exhausting illusion that the universe is watching and judging your every mistake.' }
      ]
    }
  ];

  tools.forEach(addTool);
}

defineBatches87to115();

// ─────────────────────────────────────────────────────────────────────────────
// MASTER SUITE GENERATOR BUILD FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

export function buildPsychologyTools({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const dir = join(DIST, 'psychology');
  ensureDir(dir);

  console.log(`  🔨 Building 2 AM Existential Dilemmas & Psychology Suite (${ALL_115_TOOLS_CONFIG.length} tools)...`);

  // Generate each tool page
  for (const tool of ALL_115_TOOLS_CONFIG) {
    const ws = renderArchetypeWorkspace(tool);

    const faqHtml = tool.faq.map(item => `
      <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface);">
        <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">${item.q}</summary>
        <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">${item.a}</div>
      </details>
    `).join('');

    const bodyContent = `
      <div class="article-container" style="max-width: 900px;">
        <nav style="font-family: var(--mono); font-size: 0.85rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/psychology/">Psychology</a> &gt; <span style="color: var(--fg);">${tool.title.split('[')[0].trim()}</span>
        </nav>

        <header style="margin-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.4rem;">${tool.category}</div>
          <h1 style="font-family: var(--serif); font-size: 2.1rem; margin-bottom: 0.5rem; line-height: 1.2;">${tool.title.split('|')[0].trim()}</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin: 0;">${tool.summary}</p>
        </header>

        <!-- Interactive Workbench -->
        <div class="tool-workspace" style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
          ${ws.html}
          <button type="button" id="btnCopyPsychPlan" onclick="copyPsychPlan()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; color: var(--fg); display: flex; align-items: center; justify-content: center; gap: 0.4rem; transition: all 0.2s;">
            📋 Copy Self-Reflection & Action Plan
          </button>
        </div>

        <!-- Step-by-Step Clinical & Cognitive Protocol -->
        <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0; color: var(--fg);">🧠 Step-by-Step Evidence-Based Protocol</h3>
            <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 0.2rem 0.5rem; border-radius: 4px;">CBT & Somatic Architecture</span>
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem;">
            To de-escalate cognitive friction and break default-mode network rumination loops, follow this structured behavioral sequence:
          </p>
          <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 1: Mindful Recognition & Non-Judgmental Labeling</strong>
              <div style="color: var(--text-muted); margin-top: 0.25rem;">
                Acknowledge the active internal state without identification. Name the cognitive narrative as an ephemeral mental event rather than an objective reality.
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 2: Interactive Parameter Calibration</strong>
              <div style="color: #3b82f6; margin-top: 0.25rem;">
                Use the interactive sliders and meters above to externalize subjective distress into measurable, discrete behavioral components.
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 3: Autonomic Nervous System Down-Regulation</strong>
              <div style="color: var(--text-muted); margin-top: 0.25rem;">
                Engage extended-exhale breathing (e.g. 4s inhale, 6s exhale) to stimulate afferent vagal tone and drop systemic sympathetic arousal.
              </div>
            </div>
            <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
              <strong style="color: var(--fg);">Step 4: Asymmetric Micro-Action Execution</strong>
              <div style="color: #10b981; font-weight: 700; margin-top: 0.25rem;">
                Execute one single 120-second micro-step that requires zero preliminary motivation, bypassing prefrontal dopamine paralysis.
              </div>
            </div>
          </div>
        </div>

        <!-- Critical Cognitive Traps & Misattribution Pitfalls -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 3px solid #f59e0b; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ Critical Cognitive Traps & Misattributions</h3>
          <ul style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; padding-left: 1.25rem; margin: 0;">
            <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">The Rumination Trap:</strong> Treating late-night analytical thought loops as productive problem-solving. At 2 AM, the prefrontal cortex suffers reduced executive glucose metabolism, turning reflection into repetitive catastrophic loops.</li>
            <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Somatic Misattribution:</strong> Interpreting physiological agitation (elevated heart rate, shallow breathing, caffeine half-life decay) as emotional emergency or existential catastrophe.</li>
            <li style="margin-bottom: 0.5rem;"><strong style="color: var(--fg);">Toxic Positivity & Forced Reappraisal:</strong> Attempting to suppress uncomfortable feelings with invalidating affirmations. Genuine cognitive flexibility requires accepting distressing affect before reframing.</li>
          </ul>
        </div>

        <!-- Therapeutic & Philosophical Deep Dive -->
        <div style="border: 1px solid var(--border); background: var(--surface); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Therapeutic & Philosophical Context</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin: 0;">${tool.deepDive}</p>
        </div>

        <!-- FAQ Section -->
        <div style="margin: 2.5rem 0;">
          <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
          ${faqHtml}
        </div>
      </div>

      <script>
        (function() {
          ${ws.script}

          window.copyPsychPlan = function() {
            var lines = [];
            lines.push('====================================================');
            lines.push('${tool.title.split('|')[0].trim()} — Action Plan');
            lines.push('Domain: ${tool.category} | Engine: Digital Tools Shed (2026)');
            lines.push('----------------------------------------------------');
            lines.push('SUMMARY:');
            lines.push('${tool.summary}');
            lines.push('');
            lines.push('CORE PROTOCOL:');
            lines.push('1. Notice & Label thoughts without fusion.');
            lines.push('2. Externalize resistance with interactive metrics.');
            lines.push('3. Down-regulate autonomic nervous system with somatic breath.');
            lines.push('4. Execute one 120-second micro-action without motivation.');
            lines.push('----------------------------------------------------');
            lines.push('Direct Tool URL: ' + window.location.href);
            lines.push('Verified 100% Client-Side Engine (Zero Server Logging)');
            lines.push('====================================================');

            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(lines.join('\\n')).then(function() {
                var btn = document.getElementById('btnCopyPsychPlan');
                if (btn) {
                  var old = btn.innerHTML;
                  btn.innerHTML = '✓ Copied Reflection & Action Plan!';
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
        })();
      </script>
    `;

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to Navigate ${tool.title.split('[')[0].trim()}`,
      "description": tool.metaDesc,
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Identify Psychological Friction",
          "text": `Calibrate subjective distress using the interactive ${tool.category} workbench.`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Deconstruct Cognitive Narrative",
          "text": "Externalize ruminative thought loops and examine cognitive distortions."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Engage Somatic Regulation",
          "text": "Activate parasympathetic recovery using extended-exhale vagal breathing."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Execute Low-Barrier Micro-Action",
          "text": "Commit to one 120-second actionable task to stimulate prefrontal dopamine release."
        }
      ]
    };

    const pageHtml = renderPage({
      title: tool.title,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/psychology/${tool.slug}`,
      currentPath: `/psychology/${tool.slug}.html`,
      faq: tool.faq,
      jsonLd: howToSchema,
      bodyContent: bodyContent
    });

    writeFileSync(join(dir, `${tool.slug}.html`), pageHtml);
  }

  // Generate Hub Index Page /psychology/index.html
  const hubCardsHtml = ALL_115_TOOLS_CONFIG.map(t => `
    <div class="hub-tool-card" data-category="${t.category.toLowerCase()}" data-title="${t.title.toLowerCase()}" data-desc="${t.metaDesc.toLowerCase()}" style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="font-family: var(--mono); font-size: 0.7rem; text-transform: uppercase; color: #3b82f6; margin-bottom: 0.35rem;">${t.category}</div>
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.5rem; line-height: 1.3;">
          <a href="/psychology/${t.slug}" style="color: var(--fg); text-decoration: none;">${t.title.split('|')[0].trim()}</a>
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 1rem 0;">${t.metaDesc}</p>
      </div>
      <div>
        <a href="/psychology/${t.slug}" style="display: inline-block; font-family: var(--mono); font-size: 0.8rem; font-weight: 600; color: #3b82f6; text-decoration: none;">Launch Tool →</a>
      </div>
    </div>
  `).join('');

  const hubBodyContent = `
    <div class="article-container" style="max-width: 1050px;">
      <nav style="font-family: var(--mono); font-size: 0.85rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <span style="color: var(--fg);">Psychology Hub</span>
      </nav>

      <header style="margin-bottom: 2rem; text-align: center;">
        <h1 style="font-family: var(--serif); font-size: 2.5rem; margin-bottom: 0.75rem;">2 AM Existential Dilemmas & Psychology Suite</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 750px; margin: 0 auto 1.5rem; line-height: 1.6;">
          115 interactive client-side tools designed for late-night overthinking, executive task paralysis, cognitive distortions, philosophical dilemmas, and nervous system regulation.
        </p>

        <!-- Live Search and Filter -->
        <div style="max-width: 600px; margin: 0 auto;">
          <input type="text" id="psychSearch" placeholder="Search 115 psychology & existential tools..." style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border); background: var(--input-bg); color: var(--fg); font-family: var(--mono); font-size: 0.95rem; border-radius: 6px; box-sizing: border-box;">
        </div>
      </header>

      <!-- Category Filter Pills -->
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-bottom: 2rem;">
        <button type="button" class="cat-pill active" onclick="filterCat('all')">All (115)</button>
        <button type="button" class="cat-pill" onclick="filterCat('adhd')">ADHD & Executive</button>
        <button type="button" class="cat-pill" onclick="filterCat('cognitive')">Cognitive Distortions</button>
        <button type="button" class="cat-pill" onclick="filterCat('sleep')">Late-Night Mind</button>
        <button type="button" class="cat-pill" onclick="filterCat('existential')">Thought Experiments</button>
        <button type="button" class="cat-pill" onclick="filterCat('relationships')">Relationships & Attachment</button>
        <button type="button" class="cat-pill" onclick="filterCat('career')">Career & Burnout</button>
        <button type="button" class="cat-pill" onclick="filterCat('somatic')">Somatic & Behavioral</button>
        <button type="button" class="cat-pill" onclick="filterCat('stoicism')">Stoicism & Wisdom</button>
      </div>

      <!-- Tools Grid -->
      <div id="toolsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; margin-bottom: 3rem;">
        ${hubCardsHtml}
      </div>
    </div>

    <style>
      .cat-pill {
        padding: 0.4rem 0.85rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        font-family: var(--mono);
        font-size: 0.8rem;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s;
      }
      .cat-pill.active, .cat-pill:hover {
        background: var(--btn-bg);
        color: var(--btn-fg);
        border-color: var(--btn-bg);
      }
    </style>

    <script>
      (function() {
        var currentCat = 'all';
        var searchInput = document.getElementById('psychSearch');

        window.filterCat = function(cat) {
          currentCat = cat.toLowerCase();
          document.querySelectorAll('.cat-pill').forEach(function(btn) {
            btn.classList.remove('active');
          });
          if (event && event.target) event.target.classList.add('active');
          applyFilter();
        };

        function applyFilter() {
          var query = (searchInput.value || '').toLowerCase().trim();
          var cards = document.querySelectorAll('.hub-tool-card');
          cards.forEach(function(card) {
            var cat = card.getAttribute('data-category') || '';
            var title = card.getAttribute('data-title') || '';
            var desc = card.getAttribute('data-desc') || '';

            var matchesCat = currentCat === 'all' || cat.includes(currentCat);
            var matchesQuery = !query || title.includes(query) || desc.includes(query);

            if (matchesCat && matchesQuery) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }

        searchInput.addEventListener('input', applyFilter);
      })();
    </script>
  `;

  const hubHtml = renderPage({
    title: '2 AM Existential Dilemmas & Psychology Suite [115 Interactive Tools] | Digital Tools Shed',
    metaDesc: 'Explore 115 interactive tools for ADHD paralysis, late-night existential dread, cognitive distortions, philosophical dilemmas, and nervous system regulation.',
    canonical: `${DOMAIN}/psychology/`,
    currentPath: `/psychology/index.html`,
    faq: [
      { q: 'What is the 2 AM Existential Dilemmas & Psychology Suite?', a: 'A collection of 115 client-side interactive tools designed for late-night overthinking, executive dysfunction, cognitive distortions, philosophical thought experiments, and emotional regulation.' },
      { q: 'Are my reflections and inputs saved privately?', a: 'Yes. 100% of calculations and inputs run client-side in your web browser. No personal data, thoughts, or scores are ever sent to a server.' }
    ],
    bodyContent: hubBodyContent
  });

  writeFileSync(join(dir, 'index.html'), hubHtml);

  console.log(`  ✓ Built 2 AM Existential & Psychology Suite (${ALL_115_TOOLS_CONFIG.length} tools + hub in /psychology/)`);
}
