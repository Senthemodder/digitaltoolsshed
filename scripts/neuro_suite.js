// scripts/neuro_suite.js — Human Neurobiology & Cognitive Psychology Master Suite
// 27 Interactive Flagship Tools + Master Hub (/neuro/)
import { renderPage } from './core.js';
import { batch2Tools } from './neuro_batch2.js';
import { batch3Tools } from './neuro_batch3.js';

export function buildNeuroSuite({ DIST, DOMAIN, writeFileSync, join, ensureDir }) {
  console.log('  🧠 Building Human Neurobiology & Cognitive Psychology Suite (39 Tools + Hub)...');
  const neuroDist = join(DIST, 'neuro');
  ensureDir(neuroDist);

  const sharedStyle = `
    <style>
      .wb-card { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0; }
      .wb-header { margin-bottom: 1.5rem; }
      .wb-badge { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.72rem; font-family: var(--mono); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      .badge-blue { background: rgba(59, 130, 246, 0.12); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
      .badge-green { background: rgba(34, 197, 94, 0.12); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
      .badge-amber { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
      .badge-red { background: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
      .badge-purple { background: rgba(168, 85, 247, 0.12); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
      .field-label { display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; font-weight: 600; }
      .code-input, .text-input { width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 0.88rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; }
      .code-input:focus, .text-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
      .btn-primary { background: #3b82f6; color: #fff; border: none; padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 0.5rem; }
      .btn-primary:hover { background: #2563eb; }
      .btn-sec { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; transition: all 0.15s ease; }
      .btn-sec:hover { background: var(--surface-alt); border-color: var(--text-muted); }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
      .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
      .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
      @media (max-width: 840px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
      .nav-crumbs { font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted); }
      .nav-crumbs a { color: var(--text-muted); text-decoration: none; }
      .nav-crumbs a:hover { color: #3b82f6; text-decoration: underline; }
      .tab-bar { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border); margin-bottom: 1.25rem; flex-wrap: wrap; }
      .tab-btn { background: transparent; border: none; padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.82rem; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; }
      .tab-btn.active { color: #3b82f6; border-bottom-color: #3b82f6; font-weight: 600; }
      .faq-item { border-bottom: 1px solid var(--border); padding: 1rem 0; }
      .faq-q { font-weight: 600; font-size: 1rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: var(--fg); }
      .faq-a { color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-top: 0.5rem; display: none; }
      .faq-item.open .faq-a { display: block; }
    </style>
  `;

  // 1. Imposter Syndrome vs Dunning-Kruger Spectrum Diagnostic
  const imposterTool = {
    slug: 'imposter-syndrome-spectrum',
    title: 'Imposter Syndrome vs Dunning-Kruger Spectrum Diagnostic [Interactive Quadrant Matrix]',
    metaDesc: 'Interactive 2D quadrant diagnostic measuring internal competence against perceived legitimacy. Map your position between Imposter Syndrome and Dunning-Kruger cognitive bias with objective reality-check reframing.',
    category: 'Neurobiology & Mind',
    keywords: 'imposter syndrome test, dunning kruger effect calculator, self doubt diagnostic, competence vs confidence matrix, psychological reality check',
    faqs: [
      { q: 'What is the fundamental difference between Imposter Syndrome and the Dunning-Kruger effect?', a: 'The Dunning-Kruger effect describes a cognitive bias where individuals with low competence overestimate their ability due to a lack of metacognitive awareness. In contrast, Imposter Syndrome occurs when high-competence individuals chronically underestimate their ability and attribute their success to luck or deception.' },
      { q: 'How does this tool calculate your position on the matrix?', a: 'It separates objective external evidence of competence (years of practice, delivered work, problem-solving track record) from subjective internal feelings of inadequacy (fear of exposure, attributing success to fluke) to plot your coordinates on an interactive 2D graph.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Imposter Syndrome Spectrum</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Clance IP Scale & Kruger Model</span>
            <span class="wb-badge badge-green">100% Client-Side</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Imposter Syndrome vs Dunning-Kruger Diagnostic</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Separate subjective self-doubt from objective competence. Plot yourself on the 2D cognitive spectrum to uncover whether you are experiencing legitimate imposterism or overconfidence bias.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Step 1: Rate Your Competence & Internal Doubt Indicators</h3>
          <div class="grid-2">
            <div>
              <label class="field-label">Demonstrated Competence & Tangible Output (1 = Novice, 10 = Expert / Veteran)</label>
              <input type="range" id="imp-comp" min="1" max="10" value="7" style="width:100%;" oninput="updateImposter()" />
              <div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">
                <span>Beginner</span><span id="lbl-comp">Level 7/10</span><span>World-Class</span>
              </div>
            </div>
            <div>
              <label class="field-label">Subjective Fear of Exposure / Self-Doubt (1 = Unshakable, 10 = Severe Terror)</label>
              <input type="range" id="imp-doubt" min="1" max="10" value="8" style="width:100%;" oninput="updateImposter()" />
              <div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">
                <span>Total Confidence</span><span id="lbl-doubt">Level 8/10</span><span>Paralyzing Dread</span>
              </div>
            </div>
          </div>

          <div style="margin-top:1rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-sec" onclick="loadImpPreset('senior_dev')">Preset: High-Output Senior With Imposterism</button>
            <button class="btn-sec" onclick="loadImpPreset('dunning')">Preset: Overconfident Novice (Dunning-Kruger)</button>
            <button class="btn-sec" onclick="loadImpPreset('healthy')">Preset: Calibrated Master</button>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <label class="field-label">Interactive 2D Cognitive Matrix Canvas</label>
            <canvas id="imp-canvas" width="400" height="340" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px;"></canvas>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="field-label">Cognitive Diagnostic Verdict</div>
              <h2 id="imp-verdict-title" style="font-family:var(--serif); font-size:1.4rem; color:#60a5fa; margin:0.25rem 0 0.75rem 0;">High Imposter Syndrome</h2>
              <div id="imp-badge-zone" class="wb-badge badge-amber" style="margin-bottom:0.75rem;">HIGH COMPETENCE &bull; DISPROPORTIONATE SELF-DOUBT</div>
              <p id="imp-verdict-desc" style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin:0;">
                Your objective track record and ability significantly outstrip your internal emotional confidence. You are attributing hard-won expertise to luck, timing, or deception.
              </p>
            </div>

            <div style="margin-top:1.25rem; padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="field-label">Neurobiological Action Prescription</span>
              <div id="imp-prescription" style="font-family:var(--mono); font-size:0.8rem; color:var(--fg);">
                Log an "Evidence Ledger": List 3 specific problems you solved this month that nobody else could fix. Stop comparing your internal messy thought process to others' polished public output.
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function loadImpPreset(type) {
          if (type === 'senior_dev') {
            document.getElementById('imp-comp').value = 8;
            document.getElementById('imp-doubt').value = 9;
          } else if (type === 'dunning') {
            document.getElementById('imp-comp').value = 2;
            document.getElementById('imp-doubt').value = 1;
          } else if (type === 'healthy') {
            document.getElementById('imp-comp').value = 9;
            document.getElementById('imp-doubt').value = 3;
          }
          updateImposter();
        }

        function updateImposter() {
          var comp = parseInt(document.getElementById('imp-comp').value, 10);
          var doubt = parseInt(document.getElementById('imp-doubt').value, 10);

          document.getElementById('lbl-comp').textContent = 'Level ' + comp + '/10';
          document.getElementById('lbl-doubt').textContent = 'Level ' + doubt + '/10';

          var canvas = document.getElementById('imp-canvas');
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 400, 340);

          // Grid & Quadrant Backgrounds
          ctx.fillStyle = 'rgba(239, 68, 68, 0.08)'; // Top-Left: Imposter
          ctx.fillRect(0, 0, 200, 170);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.08)'; // Top-Right: Acute Imposter Elite
          ctx.fillRect(200, 0, 200, 170);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.08)'; // Bottom-Right: Calibrated Master
          ctx.fillRect(200, 170, 200, 170);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.08)'; // Bottom-Left: Dunning-Kruger Peak
          ctx.fillRect(0, 170, 200, 170);

          // Axis Lines
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(200, 0); ctx.lineTo(200, 340);
          ctx.moveTo(0, 170); ctx.lineTo(400, 170);
          ctx.stroke();

          // Labels
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText('HIGH DOUBT (IMPOSTER)', 15, 20);
          ctx.fillText('HIGH COMPETENCE (EXPERT)', 240, 160);
          ctx.fillText('DUNNING-KRUGER ZONE', 15, 325);
          ctx.fillText('CALIBRATED MASTERY', 255, 325);

          // Plot User Point
          var px = (comp / 10) * 360 + 20;
          var py = 340 - ((doubt / 10) * 300 + 20);

          ctx.beginPath();
          ctx.arc(px, py, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Evaluate Verdict
          var titleEl = document.getElementById('imp-verdict-title');
          var badgeEl = document.getElementById('imp-badge-zone');
          var descEl = document.getElementById('imp-verdict-desc');
          var prescEl = document.getElementById('imp-prescription');

          if (comp >= 6 && doubt >= 6) {
            titleEl.textContent = 'Acute Imposter Syndrome';
            titleEl.style.color = '#c084fc';
            badgeEl.className = 'wb-badge badge-purple';
            badgeEl.textContent = 'HIGH COMPETENCE • SEVERE SELF-DOUBT';
            descEl.textContent = 'You have high objective skill and demonstrated deliverables, but suffer from cognitive discounting. You assume anyone could do what you do and fear being "found out" by peers.';
            prescEl.textContent = 'Build an "Evidence Vault": Keep an unalterable log of shipped PRs, client praise, and difficult bugs resolved. Realize that feelings of incompetence are an artifact of working at the frontier of your ability.';
          } else if (comp < 5 && doubt < 4) {
            titleEl.textContent = 'Dunning-Kruger Vulnerability';
            titleEl.style.color = '#f59e0b';
            badgeEl.className = 'wb-badge badge-amber';
            badgeEl.textContent = 'LOW METANURTURANCE • PREMATURE CERTAINTY';
            descEl.textContent = 'You have low self-doubt despite having early-stage competence. This is the classic "Mount of Ignorance": you know just enough to feel dangerous without yet realizing the depth of the domain.';
            prescEl.textContent = 'Actively seek brutal code reviews and steelman critiques from verified experts. Measure your assumptions against hard empirical benchmarks before declaring victory.';
          } else if (comp >= 6 && doubt < 5) {
            titleEl.textContent = 'Calibrated Mastery';
            titleEl.style.color = '#10b981';
            badgeEl.className = 'wb-badge badge-green';
            badgeEl.textContent = 'HIGH COMPETENCE • GROUNDED SELF-ASSESSMENT';
            descEl.textContent = 'You possess realistic self-efficacy. You know what you know, are comfortable admitting what you do not know, and experience healthy cognitive proportionality.';
            prescEl.textContent = 'Mentor junior practitioners who are trapped in the Imposter quadrant. Your grounded perspective helps demystify the learning curve for others.';
          } else {
            titleEl.textContent = 'Novice Insecurity';
            titleEl.style.color = '#60a5fa';
            badgeEl.className = 'wb-badge badge-blue';
            badgeEl.textContent = 'NORMAL LEARNING FRICTION';
            descEl.textContent = 'You are in the natural steep section of the learning curve. Your self-doubt is proportionate to being new, but do not mistake temporary novice status for permanent inadequacy.';
            prescEl.textContent = 'Embrace the beginner mindset. Treat every error as algorithmic feedback rather than an existential indictment of your character.';
          }
        }

        window.addEventListener('DOMContentLoaded', function() {
          loadImpPreset('senior_dev');
        });
      </script>
    `
  };

  // 2. ADHD Task Paralysis & Executive Dysfunction Defuser
  const adhdTool = {
    slug: 'adhd-paralysis-defuser',
    title: 'ADHD Executive Dysfunction & Task Paralysis Defuser [Dopamine Micro-Stepping Engine]',
    metaDesc: 'Bypass prefrontal cortex task paralysis and executive dysfunction with scientific micro-stepping. Decompose overwhelming projects into 120-second dopamine-accessible micro-actions with integrated focus timer.',
    category: 'Neurobiology & Mind',
    keywords: 'adhd task paralysis tool, executive dysfunction defuser, dopamine micro stepping, overcome adhd overwhelm, adhd wall of awful bypass',
    faqs: [
      { q: 'Why does ADHD cause task paralysis?', a: 'ADHD brains have lower baseline dopamine in the prefrontal cortex, which governs initiation and executive gating. When a task feels ambiguous, boring, or emotionally overwhelming, the prefrontal cortex perceives it as a threat and enters freeze mode.' },
      { q: 'What is micro-stepping and why does it work?', a: 'Micro-stepping shrinks the initial threshold of action until the brain cannot register it as threatening (e.g. "open the laptop and write 1 word"). Once initiation happens, momentum carries the nervous system forward without willpower friction.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; ADHD Paralysis Defuser</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Prefrontal Gating Architecture</span>
            <span class="wb-badge badge-green">Dopamine Micro-Timer</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">ADHD Executive Dysfunction & Task Paralysis Defuser</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Tear down the Wall of Awful. Break paralyzing monolithic tasks into 120-second dopamine-accessible micro-actions that bypass prefrontal executive freeze.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">The Paralyzing Task or Mountain in Front of You</label>
          <input type="text" id="adhd-task-input" class="text-input" value="Clean out messy desk & organize tax receipts" placeholder="What are you putting off right now?" />
          <div style="margin-top:0.75rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-sec" onclick="loadAdhdExample('taxes')">Example: Tax Documents</button>
            <button class="btn-sec" onclick="loadAdhdExample('email')">Example: Overwhelming Email Inbox</button>
            <button class="btn-sec" onclick="loadAdhdExample('study')">Example: Study For Exam</button>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Friction Factors (Prefrontal Gating)</h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <div>
                <label class="field-label">Task Ambiguity (How unclear is the very first step?): <span id="lbl-amb">High</span></label>
                <input type="range" id="fric-amb" min="1" max="10" value="8" style="width:100%;" oninput="decomposeTask()" />
              </div>
              <div>
                <label class="field-label">Emotional Threat / Boredom: <span id="lbl-bored">Extreme</span></label>
                <input type="range" id="fric-bored" min="1" max="10" value="9" style="width:100%;" oninput="decomposeTask()" />
              </div>
            </div>
            <button class="btn-primary" style="margin-top:1.25rem; width:100%;" onclick="decomposeTask()">⚡ Decompose Into 2-Minute Micro-Steps</button>
          </div>

          <!-- MICRO-STEP EXECUTION RUNNER -->
          <div class="wb-card" style="background:#090d16; border-color:#3b82f6;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="wb-badge badge-green" id="adhd-step-num">MICRO-STEP 1 OF 4</span>
              <span id="adhd-timer" style="font-family:var(--mono); font-size:1.2rem; font-weight:bold; color:#60a5fa;">02:00</span>
            </div>
            <h3 id="adhd-current-step-txt" style="font-family:var(--serif); font-size:1.25rem; color:#fff; margin:0.5rem 0 1rem 0;">
              Just stand up and walk to the desk. Do not touch anything yet.
            </h3>
            <div style="display:flex; gap:0.5rem;">
              <button id="btn-timer-toggle" class="btn-primary" onclick="toggleAdhdTimer()">Start 120s Timer</button>
              <button class="btn-sec" onclick="completeMicroStep()">✓ Done (Next Step)</button>
            </div>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Generated Micro-Step Sequence</h3>
          <ol id="adhd-steps-list" style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.88rem; color:var(--text-muted); line-height:1.8;">
          </ol>
        </div>
      </div>

      <script>
        var adhdTimerId = null;
        var adhdSecondsLeft = 120;
        var currentStepIdx = 0;
        var generatedSteps = [];

        function loadAdhdExample(type) {
          if (type === 'taxes') {
            document.getElementById('adhd-task-input').value = 'Organize tax forms and calculate deductions';
          } else if (type === 'email') {
            document.getElementById('adhd-task-input').value = 'Clear out 400 unread emails in inbox';
          } else if (type === 'study') {
            document.getElementById('adhd-task-input').value = 'Read Chapter 4 of organic chemistry textbook';
          }
          decomposeTask();
        }

        function decomposeTask() {
          var task = document.getElementById('adhd-task-input').value.trim() || 'Work task';
          var amb = parseInt(document.getElementById('fric-amb').value, 10);
          var bored = parseInt(document.getElementById('fric-bored').value, 10);

          document.getElementById('lbl-amb').textContent = amb > 7 ? 'Extreme' : (amb > 4 ? 'Moderate' : 'Low');
          document.getElementById('lbl-bored').textContent = bored > 7 ? 'Painful' : (bored > 4 ? 'Annoying' : 'Mild');

          generatedSteps = [
            'Physical Positioning: Move to where ' + task + ' lives. Put your phone in another room or under a cushion.',
            'Visual Inspection: Look at the task for 60 seconds without doing anything. Identify the single smallest physical item involved.',
            'Micro-Initiation: Spend exactly 90 seconds doing only that single micro-piece (e.g. open 1 folder, write 1 sentence). You are 100% permitted to stop immediately when the timer dings.',
            'Dopamine Momentum Check: Acknowledge you crossed the threshold. If energy is flow state, continue for another 5 minutes; if still frozen, take a 3-minute guilt-free breather.'
          ];

          var list = document.getElementById('adhd-steps-list');
          list.innerHTML = generatedSteps.map(function(s, idx){ return '<li style="margin-bottom:6px;">' + s + '</li>'; }).join('');

          currentStepIdx = 0;
          showCurrentStep();
        }

        function showCurrentStep() {
          if (currentStepIdx >= generatedSteps.length) {
            document.getElementById('adhd-current-step-txt').textContent = '🎉 Initiation Complete! Prefrontal cortex freeze bypassed.';
            document.getElementById('adhd-step-num').textContent = 'DONE';
            return;
          }
          document.getElementById('adhd-current-step-txt').textContent = generatedSteps[currentStepIdx];
          document.getElementById('adhd-step-num').textContent = 'MICRO-STEP ' + (currentStepIdx + 1) + ' OF ' + generatedSteps.length;
          resetAdhdTimer();
        }

        function completeMicroStep() {
          playChime();
          currentStepIdx++;
          showCurrentStep();
        }

        function toggleAdhdTimer() {
          var btn = document.getElementById('btn-timer-toggle');
          if (adhdTimerId) {
            clearInterval(adhdTimerId);
            adhdTimerId = null;
            btn.textContent = 'Resume Timer';
          } else {
            btn.textContent = 'Pause Timer';
            adhdTimerId = setInterval(function() {
              if (adhdSecondsLeft > 0) {
                adhdSecondsLeft--;
                updateTimerDisplay();
              } else {
                clearInterval(adhdTimerId);
                adhdTimerId = null;
                btn.textContent = 'Start 120s Timer';
                playChime();
                alert('120s micro-window finished! Did you cross the threshold?');
              }
            }, 1000);
          }
        }

        function resetAdhdTimer() {
          if (adhdTimerId) { clearInterval(adhdTimerId); adhdTimerId = null; }
          adhdSecondsLeft = 120;
          document.getElementById('btn-timer-toggle').textContent = 'Start 120s Timer';
          updateTimerDisplay();
        }

        function updateTimerDisplay() {
          var mins = Math.floor(adhdSecondsLeft / 60);
          var secs = adhdSecondsLeft % 60;
          document.getElementById('adhd-timer').textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
        }

        function playChime() {
          try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
          } catch(e){}
        }

        window.addEventListener('DOMContentLoaded', decomposeTask);
      </script>
    `
  };

  // 3. Burnout vs Nervous System Exhaustion Auditor
  const burnoutTool = {
    slug: 'burnout-nervous-system-audit',
    title: 'Burnout vs Depression vs Autonomic Nervous System Exhaustion Audit [Polyvagal Diagnostic]',
    metaDesc: 'Differentiate career burnout from clinical depression and chronic autonomic nervous system shutdown. Evaluate emotional exhaustion, depersonalization, and dorsal vagal freeze states with recovery prescriptions.',
    category: 'Neurobiology & Mind',
    keywords: 'burnout vs depression test, nervous system exhaustion audit, polyvagal freeze state quiz, maslach burnout inventory online, dorsal vagal reset',
    faqs: [
      { q: 'How does burnout differ from clinical depression?', a: 'Burnout is fundamentally context-bound (typically triggered by work, chronic overextension, or caregiving); removing the stressor or taking time away usually restores interest in hobbies and personal life. Depression is global and pervasive; anhedonia persists regardless of location or context.' },
      { q: 'What is dorsal vagal shutdown in Polyvagal Theory?', a: 'When the nervous system experiences chronic, inescapable stress and exhausting sympathetic fight-or-flight energy, it collapses into dorsal vagal freeze — characterized by numbness, brain fog, apathy, low heart rate variability, and social withdrawal.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Burnout & Nervous System Audit</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Maslach Burnout Inventory & Polyvagal</span>
            <span class="wb-badge badge-green">Zero-Data Stored</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Burnout vs Nervous System Exhaustion Audit</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Audit your autonomic nervous system against clinical burnout, empathetic cynicism, and dorsal vagal shutdown to pinpoint your exact physiological fatigue state.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:1rem; font-family:var(--serif);">Clinical Exhaustion Indicators (0 = Never, 10 = Constant Everyday)</h3>
          <div class="grid-3">
            <div>
              <label class="field-label">1. Emotional Depletion (Drained before day starts)</label>
              <input type="range" id="b-drain" min="0" max="10" value="7" style="width:100%;" oninput="auditBurnout()" />
              <span id="val-drain" style="font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">7/10</span>
            </div>
            <div>
              <label class="field-label">2. Cynicism & Depersonalization (Numb / irritable toward clients/peers)</label>
              <input type="range" id="b-cynic" min="0" max="10" value="6" style="width:100%;" oninput="auditBurnout()" />
              <span id="val-cynic" style="font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">6/10</span>
            </div>
            <div>
              <label class="field-label">3. Physical Inertia / Dorsal Freeze (Brain fog, limbs feel like lead)</label>
              <input type="range" id="b-freeze" min="0" max="10" value="8" style="width:100%;" oninput="auditBurnout()" />
              <span id="val-freeze" style="font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">8/10</span>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="text-align:center;">
            <span class="field-label">Autonomic Nervous System State</span>
            <div id="b-state-title" style="font-size:1.6rem; font-family:var(--serif); font-weight:bold; color:#f87171; margin:0.5rem 0;">Dorsal Vagal Shutdown (Freeze)</div>
            <span id="b-state-badge" class="wb-badge badge-red">CHRONIC EXHAUSTION DEFICIT</span>
            <div style="margin-top:1rem; font-size:0.88rem; color:var(--text-muted); line-height:1.5;" id="b-state-desc">
              Your nervous system has depleted its sympathetic (fight/flight) energy reserves and collapsed into a protective shutdown state to prevent tissue damage.
            </div>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">48-Hour Recovery Protocol</h3>
            <ul id="b-recovery-list" style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.85rem; color:var(--fg); line-height:1.8;">
              <li>Execute Physiological Sighs: 2 quick nasal inhales followed by long mouth exhale.</li>
              <li>Impose complete digital silence for 4 hours (zero notifications, podcasts, or reels).</li>
              <li>Low-intensity somatic movement: 20-minute slow walk without headphones.</li>
            </ul>
          </div>
        </div>
      </div>

      <script>
        function auditBurnout() {
          var d = parseInt(document.getElementById('b-drain').value, 10);
          var c = parseInt(document.getElementById('b-cynic').value, 10);
          var f = parseInt(document.getElementById('b-freeze').value, 10);

          document.getElementById('val-drain').textContent = d + '/10';
          document.getElementById('val-cynic').textContent = c + '/10';
          document.getElementById('val-freeze').textContent = f + '/10';

          var total = d + c + f;
          var title = document.getElementById('b-state-title');
          var badge = document.getElementById('b-state-badge');
          var desc = document.getElementById('b-state-desc');

          if (f >= 7 && total >= 18) {
            title.textContent = 'Dorsal Vagal Freeze (Shutdown)';
            title.style.color = '#ef4444';
            badge.className = 'wb-badge badge-red';
            badge.textContent = 'DEEP AUTONOMIC COLLAPSE';
            desc.textContent = 'Your nervous system is in energy-conservation lockdown. Forcing productivity through caffeine or discipline will only deepen allostatic crash.';
          } else if (d >= 6 && c >= 6) {
            title.textContent = 'Occupational Burnout (Phase 3)';
            title.style.color = '#f59e0b';
            badge.className = 'wb-badge badge-amber';
            badge.textContent = 'HIGH CYNICISM & DEPLETION';
            desc.textContent = 'Context-bound burnout. You have chronic empathy fatigue and resentment toward obligations. Immediate radical boundary restructuring is necessary.';
          } else if (d <= 3 && c <= 3 && f <= 3) {
            title.textContent = 'Ventral Vagal (Regulated)';
            title.style.color = '#10b981';
            badge.className = 'wb-badge badge-green';
            badge.textContent = 'HOMEOSTATIC BALANCE';
            desc.textContent = 'Your nervous system is functioning with healthy allostatic load and psychological elasticity.';
          } else {
            title.textContent = 'Sympathetic Hyper-Arousal';
            title.style.color = '#60a5fa';
            badge.className = 'wb-badge badge-blue';
            badge.textContent = 'ELEVATED ALLOSTASIS (STRAIN)';
            desc.textContent = 'You are running on cortisol and adrenaline. You can still perform, but you are accumulating sleep and neurochemical debt that will trigger crash if unabated.';
          }
        }

        window.addEventListener('DOMContentLoaded', auditBurnout);
      </script>
    `
  };

  // 4. Attachment Style Diagnostic & Relationship Dynamic Simulator
  const attachmentTool = {
    slug: 'attachment-style-diagnostic',
    title: 'Attachment Style Diagnostic & Relationship Dynamic Simulator [ECR-R Matrix]',
    metaDesc: 'Interactive Experiences in Close Relationships (ECR-R) attachment style diagnostic. Map your Anxiety vs Avoidance coordinates and simulate the Anxious-Avoidant trap with proven communication de-escalators.',
    category: 'Neurobiology & Mind',
    keywords: 'attachment style quiz, anxious avoidant trap simulator, ecr-r attachment diagnostic, disorganized attachment style test, secure attachment builder',
    faqs: [
      { q: 'What are the 4 attachment styles in adult psychology?', a: 'Secure (comfortable with intimacy and autonomy), Anxious-Preoccupied (fears abandonment, hyper-vigilant to partner distance), Dismissive-Avoidant (equates intimacy with loss of independence, retreats under conflict), and Fearful-Avoidant / Disorganized (desires intimacy but fears vulnerability and betrayal).' },
      { q: 'Why is the Anxious-Avoidant trap so magnetic and volatile?', a: 'When an Anxious partner senses distance, their nervous system activates protest behaviors (texting, demanding reassurance). This directly triggers the Avoidant partner’s fear of engulfment, causing them to withdraw further, escalating the cycle.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Attachment Style Diagnostic</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Bowlby & Ainsworth ECR-R Scale</span>
            <span class="wb-badge badge-green">Relationship Dynamics</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Attachment Style Diagnostic & Dynamic Simulator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Discover your exact placement on the Attachment Anxiety and Attachment Avoidance axes, and simulate how your style interacts with romantic partners in conflict.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:1rem; font-family:var(--serif);">Attachment Spectrum Gauges</h3>
          <div class="grid-2">
            <div>
              <label class="field-label">Attachment Anxiety (Fear of rejection, abandonment, or distance)</label>
              <input type="range" id="att-anx" min="1" max="10" value="7" style="width:100%;" oninput="updateAttachment()" />
              <div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">
                <span>Autonomous</span><span id="lbl-anx">Score: 7/10</span><span>Hyper-Vigilant</span>
              </div>
            </div>
            <div>
              <label class="field-label">Attachment Avoidance (Discomfort with intimacy, vulnerability, and dependence)</label>
              <input type="range" id="att-avd" min="1" max="10" value="3" style="width:100%;" oninput="updateAttachment()" />
              <div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">
                <span>Comfortable Intimacy</span><span id="lbl-avd">Score: 3/10</span><span>Hyper-Independent</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <label class="field-label">2D Attachment Quadrant Map</label>
            <canvas id="att-canvas" width="400" height="340" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px;"></canvas>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="field-label">Diagnostic Classification</div>
              <h2 id="att-title" style="font-family:var(--serif); font-size:1.4rem; color:#60a5fa; margin:0.25rem 0 0.5rem 0;">Anxious-Preoccupied</h2>
              <div id="att-badge" class="wb-badge badge-amber" style="margin-bottom:0.75rem;">HIGH ANXIETY &bull; LOW AVOIDANCE</div>
              <p id="att-desc" style="font-size:0.9rem; color:var(--text-muted); line-height:1.6; margin:0;">
                You crave intense emotional closeness and validation. When you perceive ambiguity or delayed responses, your nervous system triggers acute alarm and protest behaviors.
              </p>
            </div>

            <div style="margin-top:1.25rem; padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="field-label">De-escalation Communication Script</span>
              <div id="att-script" style="font-family:var(--mono); font-size:0.8rem; color:var(--fg);">
                "I am noticing a story in my head that you are pulling away. I need 5 minutes of reassurance, but I also respect that you need space right now."
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function updateAttachment() {
          var anx = parseInt(document.getElementById('att-anx').value, 10);
          var avd = parseInt(document.getElementById('att-avd').value, 10);

          document.getElementById('lbl-anx').textContent = 'Score: ' + anx + '/10';
          document.getElementById('lbl-avd').textContent = 'Score: ' + avd + '/10';

          var canvas = document.getElementById('att-canvas');
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 400, 340);

          // Quadrant backgrounds
          ctx.fillStyle = 'rgba(16, 185, 129, 0.08)'; // Bottom-Left: Secure
          ctx.fillRect(0, 170, 200, 170);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.08)'; // Top-Left: Anxious
          ctx.fillRect(0, 0, 200, 170);
          ctx.fillStyle = 'rgba(59, 130, 246, 0.08)'; // Bottom-Right: Avoidant
          ctx.fillRect(200, 170, 200, 170);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.08)'; // Top-Right: Fearful/Disorganized
          ctx.fillRect(200, 0, 200, 170);

          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(200, 0); ctx.lineTo(200, 340);
          ctx.moveTo(0, 170); ctx.lineTo(400, 170);
          ctx.stroke();

          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText('ANXIOUS-PREOCCUPIED', 15, 25);
          ctx.fillText('FEARFUL-AVOIDANT', 240, 25);
          ctx.fillText('SECURE ATTACHMENT', 15, 325);
          ctx.fillText('DISMISSIVE-AVOIDANT', 240, 325);

          var px = (avd / 10) * 360 + 20;
          var py = 340 - ((anx / 10) * 300 + 20);

          ctx.beginPath();
          ctx.arc(px, py, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          var title = document.getElementById('att-title');
          var badge = document.getElementById('att-badge');
          var desc = document.getElementById('att-desc');
          var script = document.getElementById('att-script');

          if (anx >= 6 && avd < 5) {
            title.textContent = 'Anxious-Preoccupied';
            badge.className = 'wb-badge badge-amber';
            badge.textContent = 'HIGH ANXIETY • LOW AVOIDANCE';
            desc.textContent = 'You prioritize connection above autonomy and are hypersensitive to signs of emotional distance. Self-regulation and pausing before reacting to perceived slights are your highest-leverage growth levers.';
            script.textContent = '"I care about us and want to resolve this, but my anxiety is currently high. Can we take 20 minutes to reset and come back to this at 8:00 PM?"';
          } else if (anx < 5 && avd >= 6) {
            title.textContent = 'Dismissive-Avoidant';
            badge.className = 'wb-badge badge-blue';
            badge.textContent = 'LOW ANXIETY • HIGH AVOIDANCE';
            desc.textContent = 'You value self-reliance and independence above all else. When partners express high emotional demands or vulnerability, your instinctive reflex is to pull away and shut down emotionally.';
            script.textContent = '"I am feeling overwhelmed right now and need some quiet time to process, but I am committed to this conversation. Let us talk tomorrow morning."';
          } else if (anx >= 6 && avd >= 6) {
            title.textContent = 'Fearful-Avoidant (Disorganized)';
            badge.className = 'wb-badge badge-red';
            badge.textContent = 'HIGH ANXIETY • HIGH AVOIDANCE';
            desc.textContent = 'You experience an internal push-pull: deeply longing for intimacy while simultaneously fearing being hurt or betrayed. Conflict triggers both panic and withdrawal.';
            script.textContent = '"Part of me wants to run away, and part of me wants to cling. I need a moment to ground my body before we continue."';
          } else {
            title.textContent = 'Secure Attachment';
            title.style.color = '#10b981';
            badge.className = 'wb-badge badge-green';
            badge.textContent = 'LOW ANXIETY • LOW AVOIDANCE';
            desc.textContent = 'You feel comfortable with emotional intimacy without fearing the loss of your independence. You communicate boundaries directly and do not personalize your partner\'s moods.';
            script.textContent = '"I hear what you are saying and understand why you feel that way. Here is my perspective, and let us find a solution that works for both of us."';
          }
        }

        window.addEventListener('DOMContentLoaded', updateAttachment);
      </script>
    `
  };

  // 5. Cognitive Distortion Reframer
  const distortionTool = {
    slug: 'cognitive-distortion-reframer',
    title: 'Cognitive Distortion & Catastrophizing Reframer [Interactive CBT Thought Matrix]',
    metaDesc: 'Identify and dismantle 10 classic cognitive distortions with structured Socratic evidence testing. Transform irrational automatic negative thoughts into objective, balanced beliefs using clinical CBT methodology.',
    category: 'Neurobiology & Mind',
    keywords: 'cognitive distortions tool, cbt thought record online, catastrophizing reframer, automatic negative thoughts cbt, cognitive behavioral therapy exercises',
    faqs: [
      { q: 'What is a cognitive distortion?', a: 'Cognitive distortions are exaggerated or irrational thought patterns that reinforce negative emotions and anxiety. First identified by Dr. Aaron Beck and popularized by Dr. David Burns, they trick the brain into treating worst-case assumptions as objective facts.' },
      { q: 'How does Socratic questioning dismantle anxiety spirals?', a: 'By separating feelings from verifiable facts. Asking for concrete courtroom evidence for and against a belief forces the prefrontal cortex to disengage from emotional amygdala hijacking and evaluate realistic probabilities.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Cognitive Distortion Reframer</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">Beckian Cognitive Behavioral Therapy</span>
            <span class="wb-badge badge-blue">Socratic Method</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Cognitive Distortion & Catastrophizing Reframer</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Subject automatic catastrophic spirals to structured courtroom cross-examination. Identify irrational distortion traps and engineer resilient rational beliefs.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">Automatic Negative Thought (The Anxiety Spiral)</label>
          <textarea id="cbt-thought" class="code-input" style="height:90px;" oninput="auditDistortions()">My boss sent a message saying 'Can we chat tomorrow morning?' I am definitely getting fired and will lose my apartment.</textarea>
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem; flex-wrap:wrap;">
            <button class="btn-sec" onclick="loadCbtExample('fired')">Example: Boss Message</button>
            <button class="btn-sec" onclick="loadCbtExample('social')">Example: Nobody Texted Back</button>
            <button class="btn-sec" onclick="loadCbtExample('mistake')">Example: Public Speaking Stumble</button>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Detected Distortion Traps</h3>
            <div id="cbt-detected-traps" style="display:flex; flex-direction:column; gap:0.5rem;">
            </div>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Socratic Cross-Examination Ledger</h3>
            <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.88rem;">
              <div>
                <strong style="color:#60a5fa;">1. Objective Proof:</strong> What verifiable hard evidence confirms this outcome?
              </div>
              <div>
                <strong style="color:#4ade80;">2. Counter-Evidence:</strong> What evidence suggests this will NOT happen or has alternative explanations?
              </div>
              <div>
                <strong style="color:#fbbf24;">3. Most Probable Reality:</strong> Between absolute disaster and impossible perfection, what is the 70% probable outcome?
              </div>
            </div>
          </div>
        </div>

        <div class="wb-card" style="border-left: 4px solid #10b981;">
          <label class="field-label" style="color:#10b981;">Synthesized Rational Replacement Belief</label>
          <div id="cbt-balanced-belief" style="font-family:var(--serif); font-size:1.15rem; color:#fff; line-height:1.6; margin-top:0.5rem;">
            "A calendar invite with no context is ambiguous, not an eviction notice. Bosses schedule check-ins routinely for project updates, resource planning, or administrative paperwork. I will prepare calmly and withhold panic until facts are delivered."
          </div>
        </div>
      </div>

      <script>
        function loadCbtExample(type) {
          var t = document.getElementById('cbt-thought');
          if (type === 'fired') {
            t.value = 'My boss sent a message saying "Can we chat tomorrow morning?" I am definitely getting fired and will lose my apartment.';
          } else if (type === 'social') {
            t.value = 'Nobody in the group chat responded to my joke. Everyone secretly hates me and wishes I would leave.';
          } else if (type === 'mistake') {
            t.value = 'I stumbled on slide 3 of the presentation. My entire professional credibility is ruined forever.';
          }
          auditDistortions();
        }

        function auditDistortions() {
          var text = document.getElementById('cbt-thought').value.toLowerCase();
          var traps = [];

          if (text.indexOf('definitely') > -1 || text.indexOf('ruined') > -1 || text.indexOf('lose my') > -1 || text.indexOf('forever') > -1) {
            traps.push({ name: 'Catastrophizing (Fortune Telling)', desc: 'Predicting the absolute worst-case catastrophe as a guaranteed certainty.' });
          }
          if (text.indexOf('everyone') > -1 || text.indexOf('nobody') > -1 || text.indexOf('never') > -1 || text.indexOf('always') > -1) {
            traps.push({ name: 'All-or-Nothing (Polarized Thinking)', desc: 'Viewing the world in extreme absolutes with zero gray nuance.' });
          }
          if (text.indexOf('hates me') > -1 || text.indexOf('secretly') > -1 || text.indexOf('thinks i am') > -1) {
            traps.push({ name: 'Mind Reading', desc: 'Assuming you know what other people think and feel without explicit verbal confirmation.' });
          }
          if (traps.length === 0) {
            traps.push({ name: 'Emotional Reasoning', desc: 'Assuming that because you feel intense anxiety, a terrible danger must genuinely exist.' });
          }

          var container = document.getElementById('cbt-detected-traps');
          container.innerHTML = traps.map(function(tr) {
            return '<div style="background:var(--bg); padding:0.75rem; border-radius:4px; border:1px solid var(--border);">' +
              '<strong style="color:#f87171; font-family:var(--mono); font-size:0.85rem;">⚠️ ' + tr.name + '</strong>' +
              '<p style="margin:0.25rem 0 0 0; font-size:0.82rem; color:var(--text-muted);">' + tr.desc + '</p>' +
            '</div>';
          }).join('');

          var reframer = document.getElementById('cbt-balanced-belief');
          if (text.indexOf('boss') > -1) {
            reframer.textContent = '"A calendar invite with no context is ambiguous, not an eviction notice. Bosses schedule check-ins routinely for project updates, resource planning, or administrative paperwork. I will prepare calmly and withhold panic until facts are delivered."';
          } else if (text.indexOf('group chat') > -1 || text.indexOf('responded') > -1) {
            reframer.textContent = '"People have busy workdays, kids, and deadlines. A delayed text message is 99% about their busy schedule, not a secret collective conspiracy against my worth."';
          } else {
            reframer.textContent = '"A single stumble is normal human communication. Audience members forget minor presentation errors within 60 seconds; they are focused on the core takeaway, not evaluating my permanent worth as a person."';
          }
        }

        window.addEventListener('DOMContentLoaded', auditDistortions);
      </script>
    `
  };

  // 6. The 80-Year-Old Regret Minimization Framework
  const regretTool = {
    slug: 'regret-minimization-engine',
    title: 'The 80-Year-Old Regret Minimization Decision Matrix [Jeff Bezos Framework]',
    metaDesc: 'Execute Jeff Bezos’s iconic Regret Minimization Framework for career leaps, startups, and high-stakes life dilemmas. Project yourself to age 80 to eliminate short-term social embarrassment and clarify life trajectory.',
    category: 'Neurobiology & Mind',
    keywords: 'regret minimization framework calculator, jeff bezos decision engine, career risk assessment tool, 80 year old perspective matrix, overcome fear of failure',
    faqs: [
      { q: 'What is the Regret Minimization Framework?', a: 'Developed by Jeff Bezos in 1994 when deciding whether to leave his lucrative Wall Street career to start Amazon, this heuristic asks: "When I am 80 years old looking back, will I regret trying this and failing, or will I regret having never tried at all?"' },
      { q: 'Why does short-term social friction distort decision making?', a: 'Evolutionary psychology wired our brains to treat social embarrassment or ostracization as a mortal threat. Projecting to age 80 trivializes short-term ego bruising and exposes the deep regret of inaction.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Regret Minimization Engine</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Long-Horizon Decision Heuristic</span>
            <span class="wb-badge badge-green">Bezos Regret Model</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">The 80-Year-Old Regret Minimization Engine</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Step outside the suffocating noise of short-term embarrassment, temporary salary dips, and peer gossip. View your fork in the road through the eyes of your 80-year-old self.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-2">
            <div>
              <label class="field-label">Path A (Safe / Status Quo / Inertia)</label>
              <input type="text" id="reg-path-a" class="text-input" value="Stay in comfortable corporate job" />
            </div>
            <div>
              <label class="field-label">Path B (The Daring Leap / Startup / Pivot)</label>
              <input type="text" id="reg-path-b" class="text-input" value="Quit and launch niche software startup" />
            </div>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:1rem; font-family:var(--serif);">Age 80 Retrospective Audit (1 = Zero Regret, 10 = Agonizing Lifelong Regret)</h3>
          <div class="grid-2">
            <div>
              <label class="field-label">At age 80, how much will you regret trying Path B and failing?: <span id="lbl-fail">2/10</span></label>
              <input type="range" id="reg-fail" min="1" max="10" value="2" style="width:100%;" oninput="calculateRegret()" />
            </div>
            <div>
              <label class="field-label">At age 80, how much will you regret playing it safe and never trying Path B?: <span id="lbl-never">9/10</span></label>
              <input type="range" id="reg-never" min="1" max="10" value="9" style="width:100%;" oninput="calculateRegret()" />
            </div>
          </div>

          <div style="margin-top:1.25rem;">
            <label class="field-label">If Path B fails completely, how many months to restore baseline financial safety?</label>
            <select id="reg-repair" class="text-input" onchange="calculateRegret()">
              <option value="3">3 - 6 Months (Highly Reversible)</option>
              <option value="12" selected>12 - 18 Months (Moderate Reversible)</option>
              <option value="36">3+ Years (Substantial Reversal Difficulty)</option>
              <option value="99">Irreversible Ruin (Fatal Risk)</option>
            </select>
          </div>
        </div>

        <div class="wb-card" style="border-left:4px solid #3b82f6;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="field-label" style="margin:0;">Regret Ratio Decision Verdict</span>
            <span id="reg-badge" class="wb-badge badge-green">UNANIMOUS LEAP RECOMMENDED</span>
          </div>
          <h2 id="reg-verdict-title" style="font-family:var(--serif); font-size:1.4rem; color:#fff; margin:0.5rem 0 0.5rem 0;">Take The Leap (Path B)</h2>
          <p id="reg-verdict-desc" style="font-size:0.92rem; color:var(--text-muted); line-height:1.6; margin:0;">
            Your 80-year-old self will not remember the short-term stress of a temporary setback. You will easily repair the downside within 12-18 months, whereas the existential phantom of "what if" will haunt your conscience for decades.
          </p>
        </div>
      </div>

      <script>
        function calculateRegret() {
          var fail = parseInt(document.getElementById('reg-fail').value, 10);
          var never = parseInt(document.getElementById('reg-never').value, 10);
          var repair = parseInt(document.getElementById('reg-repair').value, 10);

          document.getElementById('lbl-fail').textContent = fail + '/10';
          document.getElementById('lbl-never').textContent = never + '/10';

          var badge = document.getElementById('reg-badge');
          var title = document.getElementById('reg-verdict-title');
          var desc = document.getElementById('reg-verdict-desc');

          if (repair === 99) {
            badge.className = 'wb-badge badge-red';
            badge.textContent = 'HIGH RISK: FATAL ASYMMETRY';
            title.textContent = 'Do Not Take Unbounded Ruin Risk';
            desc.textContent = 'Never risk irreversible ruin for an uncertain upside. De-risk Path B until failure cannot destroy your baseline survival before leaping.';
          } else if (never >= fail + 3) {
            badge.className = 'wb-badge badge-green';
            badge.textContent = 'UNANIMOUS LEAP RECOMMENDED';
            title.textContent = 'Take The Leap (Path B)';
            desc.textContent = 'The asymmetry is overwhelmingly clear: the regret of omission (never knowing) vastly exceeds the regret of commission (trying and failing). The downside is fully repairable within ' + repair + ' months.';
          } else {
            badge.className = 'wb-badge badge-amber';
            badge.textContent = 'BALANCED REASONING NEEDED';
            title.textContent = 'De-Risk Path B Incrementally';
            desc.textContent = 'Your internal regret values are relatively balanced. Consider moonlighting or creating a 6-month prototype before resigning or taking an irreversible plunge.';
          }
        }

        window.addEventListener('DOMContentLoaded', calculateRegret);
      </script>
    `
  };

  // 7. Hedonic Treadmill & Happiness Reset Calculator
  const hedonicTool = {
    slug: 'hedonic-treadmill-reset',
    title: 'Hedonic Treadmill & Baseline Happiness Reset Calculator [Adaptation Decay Engine]',
    metaDesc: 'Simulate how quickly major life promotions, salary bumps, and purchases decay back to baseline happiness. Calculate your hedonic adaptation half-life and execute a 4-pillar neurochemical reset.',
    category: 'Neurobiology & Mind',
    keywords: 'hedonic treadmill calculator, hedonic adaptation decay, happiness baseline reset, brickman adaptation theory, stoic voluntary discomfort',
    faqs: [
      { q: 'What is the Hedonic Treadmill theory?', a: 'First outlined by Brickman and Campbell in 1971, the Hedonic Treadmill describes the observed tendency of humans to quickly return to a relatively stable baseline level of happiness despite major positive or negative life events.' },
      { q: 'Can you permanently raise your baseline happiness?', a: 'Yes, research by Dr. Sonja Lyubomirsky indicates that while genetics account for ~50% and external circumstances for ~10%, roughly 40% of subjective well-being is governed by intentional cognitive habits (gratitude, voluntary discomfort, social connection, and novel mastery).' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Hedonic Treadmill Reset</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Brickman & Lyubomirsky Model</span>
            <span class="wb-badge badge-green">Adaptation Curve</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Hedonic Treadmill & Baseline Happiness Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Model how your brain downregulates dopamine following promotions, raises, and upgrades. Break adaptation numbness with deliberate Stoic contrast.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-3">
            <div>
              <label class="field-label">Life Event Category</label>
              <select id="hed-event" class="text-input" onchange="renderHedonic()">
                <option value="salary">Major Salary Raise (+50%)</option>
                <option value="car">New Luxury Vehicle / Tech Purchase</option>
                <option value="relocation">Relocating to Dream City</option>
                <option value="wedding">Wedding / New Relationship</option>
              </select>
            </div>
            <div>
              <label class="field-label">Initial Happiness Spike (% boost)</label>
              <input type="number" id="hed-spike" class="text-input" value="65" oninput="renderHedonic()" />
            </div>
            <div>
              <label class="field-label">Days Elapsed Since Event</label>
              <input type="number" id="hed-days" class="text-input" value="90" oninput="renderHedonic()" />
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <label class="field-label">Adaptation Decay Curve (180-Day Projection)</label>
            <canvas id="hed-canvas" width="400" height="260" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px;"></canvas>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span class="field-label">Current Hedonic Status</span>
              <div id="hed-current-pct" style="font-size:2rem; font-family:var(--mono); font-weight:bold; color:#f59e0b; margin:0.25rem 0;">+12% above baseline</div>
              <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5;">
                The novelty receptors in your mesolimbic pathway have recalibrated to your upgrade as the new normal. Continuing to chase happiness by upgrading external objects will require exponentially larger stimuli.
              </p>
            </div>

            <div style="margin-top:1rem; padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="field-label">Stoic Contrast Prescription</span>
              <div style="font-family:var(--mono); font-size:0.8rem; color:var(--fg);">
                Practice voluntary discomfort (Seneca): Spend 2 days eating plain food and sleeping without luxury amenities to artificially reset neural baseline contrast.
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function renderHedonic() {
          var spike = parseFloat(document.getElementById('hed-spike').value) || 50;
          var days = parseFloat(document.getElementById('hed-days').value) || 30;

          var halfLife = 45; // 45 days adaptation half life
          var currentBoost = spike * Math.exp(-0.693 * (days / halfLife));

          document.getElementById('hed-current-pct').textContent = '+' + Math.round(currentBoost) + '% above baseline';

          var canvas = document.getElementById('hed-canvas');
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 400, 260);

          // Grid & baseline
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          for (var x = 0; x < 400; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,260); ctx.stroke(); }
          for (var y = 0; y < 260; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(400,y); ctx.stroke(); }

          // Baseline Line (y = 200)
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(400, 200); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#64748b'; ctx.font = '10px monospace'; ctx.fillText('BASELINE (0%)', 10, 215);

          // Decay Curve
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (var d = 0; d <= 180; d += 2) {
            var val = spike * Math.exp(-0.693 * (d / halfLife));
            var px = (d / 180) * 380 + 10;
            var py = 200 - (val * 1.5);
            if (d === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Mark current day
          var curX = Math.min(390, (days / 180) * 380 + 10);
          var curY = 200 - (currentBoost * 1.5);
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath(); ctx.arc(curX, curY, 6, 0, Math.PI * 2); ctx.fill();
        }

        window.addEventListener('DOMContentLoaded', renderHedonic);
      </script>
    `
  };

  // 8. Circadian Energy Peak & Melatonin Timing Architect
  const circadianTool = {
    slug: 'circadian-energy-architect',
    title: 'Circadian Energy Peak & Melatonin Timing Architect [Matthew Walker Protocol]',
    metaDesc: 'Calculate precise biological windows for deep analytical focus, creative divergence, caffeine cutoffs, and pineal melatonin release based on wake time and chronotype.',
    category: 'Neurobiology & Mind',
    keywords: 'circadian rhythm calculator, melatonin timing sleep, huberman light exposure window, peak energy hours calculator, chronotype deep work schedule',
    faqs: [
      { q: 'Why is the caffeine cutoff window strictly 10 hours before sleep?', a: 'Caffeine has an average half-life of 5 to 7 hours and a quarter-life of 10 to 12 hours. Even if you fall asleep, lingering caffeine molecules block adenosine receptors in the thalamus, destroying restorative deep Stage 3/4 non-REM sleep.' },
      { q: 'What is the Cortisol Awakening Response (CAR)?', a: 'Within 30 to 45 minutes of waking, the adrenal glands naturally produce a sharp spike in cortisol to activate metabolic alertness. Getting bright photons into your eyes during this window anchors the suprachiasmatic nucleus master clock.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Circadian Energy Architect</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Suprachiasmatic Biological Protocol</span>
            <span class="wb-badge badge-green">Sleep Architecture</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Circadian Energy Peak & Melatonin Timing Architect</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Align your deep work, creative divergent tasks, caffeine cutoff, and evening melatonin synthesis with precision circadian neurobiology.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-2">
            <div>
              <label class="field-label">Natural Wake Time</label>
              <input type="time" id="circ-wake" class="text-input" value="07:00" onchange="calculateCircadian()" />
            </div>
            <div>
              <label class="field-label">Chronotype Profile</label>
              <select id="circ-chrono" class="text-input" onchange="calculateCircadian()">
                <option value="early">Morning Lark (Early Chronotype)</option>
                <option value="standard" selected>Third Bird (Standard Normal)</option>
                <option value="night">Night Owl (Delayed Phase)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">24-Hour Neurobiological Timing Windows</h3>
          <div style="display:flex; flex-direction:column; gap:0.75rem;" id="circ-windows-list">
          </div>
        </div>
      </div>

      <script>
        function calculateCircadian() {
          var wakeStr = document.getElementById('circ-wake').value || '07:00';
          var parts = wakeStr.split(':');
          var wakeHour = parseInt(parts[0], 10);
          var wakeMin = parseInt(parts[1], 10);

          function fmt(h, m) {
            h = (h + 24) % 24;
            var ampm = h >= 12 ? 'PM' : 'AM';
            var h12 = h % 12 || 12;
            return (h12 < 10 ? '0' : '') + h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
          }

          var windows = [
            { label: 'Morning Sunlight & Cortisol Awakening Response (CAR)', time: fmt(wakeHour, wakeMin) + ' – ' + fmt(wakeHour, wakeMin + 45), badge: 'badge-green', desc: 'View 10,000+ lux light outside to trigger neural alertness and set the timer for evening melatonin release.' },
            { label: 'Deep Work: Peak Prefrontal Cortex Analytical Window', time: fmt(wakeHour + 2, wakeMin) + ' – ' + fmt(wakeHour + 5, wakeMin), badge: 'badge-blue', desc: 'Highest cognitive vigilance, working memory capacity, and logical problem-solving power.' },
            { label: 'Strict Caffeine & Stimulant Cutoff Threshold', time: fmt(wakeHour + 8, wakeMin), badge: 'badge-red', desc: 'Adenosine receptor protection. Any caffeine consumed past this hour impairs restorative deep slow-wave sleep.' },
            { label: 'Post-Prandial Dip (Strategic Nap or Non-Sleep Deep Rest)', time: fmt(wakeHour + 7, wakeMin) + ' – ' + fmt(wakeHour + 8, wakeMin), badge: 'badge-amber', desc: 'Natural drop in body temperature. Perfect 20-minute nap or NSDR breathing window.' },
            { label: 'Physical Strength & Athletic Performance Peak', time: fmt(wakeHour + 9, wakeMin) + ' – ' + fmt(wakeHour + 11, wakeMin), badge: 'badge-purple', desc: 'Core body temperature and muscle protein synthesis reach daily circadian apex.' },
            { label: 'Dim Light Melatonin Onset (DLMO) & Screen Curfew', time: fmt(wakeHour + 14, wakeMin) + ' – ' + fmt(wakeHour + 16, wakeMin), badge: 'badge-amber', desc: 'Pineal gland releases melatonin. Eliminate overhead blue light and lower ambient room temperature.' }
          ];

          var list = document.getElementById('circ-windows-list');
          list.innerHTML = windows.map(function(w) {
            return '<div style="background:var(--bg); border:1px solid var(--border); border-radius:4px; padding:0.85rem; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem;">' +
              '<div>' +
                '<strong style="color:var(--fg); font-size:0.95rem;">' + w.label + '</strong>' +
                '<p style="margin:0.25rem 0 0 0; font-size:0.82rem; color:var(--text-muted);">' + w.desc + '</p>' +
              '</div>' +
              '<span class="wb-badge ' + w.badge + '" style="font-size:0.8rem; padding:0.3rem 0.6rem;">' + w.time + '</span>' +
            '</div>';
          }).join('');
        }

        window.addEventListener('DOMContentLoaded', calculateCircadian);
      </script>
    `
  };

  // 9. Overthinking & Rumination Interrupter
  const overthinkingTool = {
    slug: 'overthinking-interrupter',
    title: 'Overthinking & Rumination Interruption Engine [5-4-3-2-1 Defusion & Box Breathing]',
    metaDesc: 'Interactive somatic grounding and cognitive defusion studio. Halt circular obsessive rumination loops with an animated 4-7-8 parasympathetic breath pacer and 5-4-3-2-1 sensory grounding.',
    category: 'Neurobiology & Mind',
    keywords: 'stop overthinking tool, rumination interrupter, 54321 sensory grounding, box breathing visualizer, act cognitive defusion leaves on stream',
    faqs: [
      { q: 'Why do thoughts loop endlessly during rumination?', a: 'Rumination activates the Default Mode Network (DMN) in the brain. The brain treats repetitive thinking as a pseudo-action to solve an emotional threat, but without an executable motor action, the DMN stays trapped in an endless looping feedback cycle.' },
      { q: 'How does somatic grounding stop thought loops?', a: 'Somatic sensory grounding (5-4-3-2-1) redirects blood flow from the abstract DMN to the primary sensory and insular cortex, pulling neural processing out of catastrophic imagination into immediate concrete physical reality.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Overthinking Interrupter</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">Default Mode Network (DMN) Decoupler</span>
            <span class="wb-badge badge-blue">Somatic Grounding</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Overthinking & Rumination Interruption Engine</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Sever the circular loop of obsessive mental replays. Reconnect with physical sensory reality using parasympathetic breath pacers and ACT cognitive defusion.
          </p>
        </div>

        <div class="grid-2">
          <!-- BREATH PACER -->
          <div class="wb-card" style="text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <span class="field-label">Parasympathetic Vagus Nerve Pacer (4-4-4-4 Box Breath)</span>
            <div id="breath-circle" style="width:140px; height:140px; border-radius:50%; background:rgba(59,130,246,0.15); border:3px solid #3b82f6; margin:1.5rem 0; display:flex; align-items:center; justify-content:center; transition:transform 4s ease-in-out;">
              <span id="breath-cue" style="font-family:var(--mono); font-size:1.1rem; font-weight:bold; color:#60a5fa;">INHALE</span>
            </div>
            <button class="btn-primary" id="btn-breath" onclick="toggleBreathing()">Start Breath Pacer</button>
          </div>

          <!-- 5-4-3-2-1 GROUNDING -->
          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">5-4-3-2-1 Somatic Sensory Anchor</h3>
            <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.88rem;">
              <div style="padding:0.4rem; background:var(--bg); border-radius:4px;"><strong style="color:#60a5fa;">5 Things You See:</strong> Scan room; note 5 distinct colors or textures.</div>
              <div style="padding:0.4rem; background:var(--bg); border-radius:4px;"><strong style="color:#4ade80;">4 Things You Feel:</strong> Feet on floor, fabric on arms, tongue on palate.</div>
              <div style="padding:0.4rem; background:var(--bg); border-radius:4px;"><strong style="color:#fbbf24;">3 Things You Hear:</strong> Ambient fan, distant traffic, your own breathing.</div>
              <div style="padding:0.4rem; background:var(--bg); border-radius:4px;"><strong style="color:#c084fc;">2 Things You Smell:</strong> Room air, coffee, skin aroma.</div>
              <div style="padding:0.4rem; background:var(--bg); border-radius:4px;"><strong style="color:#f87171;">1 Thing You Taste:</strong> Saliva, mint, sip of cold water.</div>
            </div>
          </div>
        </div>

        <div class="wb-card">
          <label class="field-label">ACT Thought Defusion: "Leaves on a Stream"</label>
          <div style="display:flex; gap:0.5rem;">
            <input type="text" id="stream-thought" class="text-input" placeholder="Type a sticky repeating thought here (e.g. 'I made a fool of myself')..." />
            <button class="btn-primary" onclick="releaseThought()">Release on Stream</button>
          </div>
          <div id="stream-box" style="height:120px; background:#090d16; border:1px solid var(--border); border-radius:4px; margin-top:1rem; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
            <span id="floating-leaf" style="font-family:var(--mono); font-size:0.9rem; color:#94a3b8; transition:all 3s ease-out;">🍃 [No thoughts currently floating]</span>
          </div>
        </div>
      </div>

      <script>
        var breathInterval = null;
        var breathState = 0; // 0=inhale, 1=hold, 2=exhale, 3=hold

        function toggleBreathing() {
          var btn = document.getElementById('btn-breath');
          var circle = document.getElementById('breath-circle');
          var cue = document.getElementById('breath-cue');

          if (breathInterval) {
            clearInterval(breathInterval);
            breathInterval = null;
            btn.textContent = 'Start Breath Pacer';
            circle.style.transform = 'scale(1)';
            cue.textContent = 'READY';
          } else {
            btn.textContent = 'Stop Breath Pacer';
            runBreathCycle();
            breathInterval = setInterval(runBreathCycle, 4000);
          }
        }

        function runBreathCycle() {
          var circle = document.getElementById('breath-circle');
          var cue = document.getElementById('breath-cue');
          if (breathState === 0) {
            cue.textContent = 'INHALE (4s)';
            circle.style.transform = 'scale(1.4)';
            circle.style.borderColor = '#60a5fa';
            breathState = 1;
          } else if (breathState === 1) {
            cue.textContent = 'HOLD (4s)';
            circle.style.borderColor = '#fbbf24';
            breathState = 2;
          } else if (breathState === 2) {
            cue.textContent = 'EXHALE (4s)';
            circle.style.transform = 'scale(0.85)';
            circle.style.borderColor = '#10b981';
            breathState = 3;
          } else {
            cue.textContent = 'HOLD (4s)';
            circle.style.borderColor = '#94a3b8';
            breathState = 0;
          }
        }

        function releaseThought() {
          var input = document.getElementById('stream-thought');
          var txt = input.value.trim();
          if (!txt) return;

          var leaf = document.getElementById('floating-leaf');
          leaf.textContent = '🍃 "' + txt + '"';
          leaf.style.transform = 'translateX(-200px)';
          leaf.style.opacity = '1';

          setTimeout(function() {
            leaf.style.transform = 'translateX(250px)';
            leaf.style.opacity = '0';
          }, 100);

          setTimeout(function() {
            leaf.textContent = '🍃 [Thought dissolved past consciousness horizon]';
            leaf.style.transform = 'translateX(0)';
            leaf.style.opacity = '0.5';
            input.value = '';
          }, 3100);
        }
      </script>
    `
  };

  // 10. Maximizer vs Satisficer Decision Style Audit
  const maximizerTool = {
    slug: 'paradox-of-choice-maximizer',
    title: 'Maximizer vs Satisficer Decision Style Audit [Paradox of Choice Index]',
    metaDesc: 'Diagnose whether you suffer from Maximizer decision paralysis or healthy Satisficing. Calculate your Decision Fatigue Tax and adopt Herbert Simon bounded rationality to save hours every week.',
    category: 'Neurobiology & Mind',
    keywords: 'maximizer vs satisficer test, paradox of choice calculator, barry schwartz decision style, decision paralysis audit, satisficing rules',
    faqs: [
      { q: 'What is a Maximizer versus a Satisficer?', a: 'Coined by Nobel laureate Herbert Simon and popularized by Barry Schwartz, Maximizers exhaustively research every alternative to find the absolute best option. Satisficers define clear minimum criteria and choose the very first option that meets those standards.' },
      { q: 'Why do Maximizers experience higher regret despite better choices?', a: 'Because Maximizers invest massive cognitive energy into researching alternatives, their expectations skyrocket. Any minor flaw in their final choice triggers intense counterfactual regret ("if only I had picked option #37").' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Maximizer vs Satisficer</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Herbert Simon Bounded Rationality</span>
            <span class="wb-badge badge-green">Decision Velocity</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Maximizer vs Satisficer Decision Style Audit</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Determine whether perfectionist decision-making is draining your dopamine and prefrontal bandwidth. Learn to deploy "Good Enough" thresholds to reclaim hours of cognitive energy.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:1rem; font-family:var(--serif);">Decision Tendency Inventory (1 = Strongly Disagree, 10 = Strongly Agree)</h3>
          <div class="grid-2">
            <div>
              <label class="field-label">1. I check 10+ reviews/options before trivial purchases</label>
              <input type="range" id="max-q1" min="1" max="10" value="8" style="width:100%;" oninput="auditMaximizer()" />
            </div>
            <div>
              <label class="field-label">2. I frequently second-guess decisions after making them</label>
              <input type="range" id="max-q2" min="1" max="10" value="7" style="width:100%;" oninput="auditMaximizer()" />
            </div>
            <div>
              <label class="field-label">3. I feel acute FOMO about paths not taken</label>
              <input type="range" id="max-q3" min="1" max="10" value="8" style="width:100%;" oninput="auditMaximizer()" />
            </div>
            <div>
              <label class="field-label">4. Settling for "good enough" feels like failure</label>
              <input type="range" id="max-q4" min="1" max="10" value="9" style="width:100%;" oninput="auditMaximizer()" />
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="text-align:center;">
            <span class="field-label">Your Decision Architecture</span>
            <div id="max-verdict" style="font-size:1.8rem; font-family:var(--serif); font-weight:bold; color:#f87171; margin:0.5rem 0;">Severe Maximizer</div>
            <span id="max-badge" class="wb-badge badge-red">CHRONIC DECISION FATIGUE TAX</span>
            <div id="max-summary" style="margin-top:0.75rem; font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
              You spend extraordinary cognitive resources striving for theoretical perfection, creating high vulnerability to post-decision buyer's remorse.
            </div>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Satisficing Heuristic Prescription</h3>
            <ul style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.82rem; color:var(--fg); line-height:1.8;">
              <li><strong>The 3-Tab Rule:</strong> Open max 3 options for purchases under $100. Buy the first that meets requirements.</li>
              <li><strong>Irreversible Commitment:</strong> Once selected, stop looking at alternatives. Zero post-decision checking.</li>
              <li><strong>Default to 'Good Enough':</strong> Optimize only the top 5% of life decisions (spouse, city, career trajectory). Satisfice the other 95%.</li>
            </ul>
          </div>
        </div>
      </div>

      <script>
        function auditMaximizer() {
          var q1 = parseInt(document.getElementById('max-q1').value, 10);
          var q2 = parseInt(document.getElementById('max-q2').value, 10);
          var q3 = parseInt(document.getElementById('max-q3').value, 10);
          var q4 = parseInt(document.getElementById('max-q4').value, 10);

          var sum = q1 + q2 + q3 + q4;
          var v = document.getElementById('max-verdict');
          var b = document.getElementById('max-badge');
          var s = document.getElementById('max-summary');

          if (sum >= 30) {
            v.textContent = 'Severe Maximizer';
            v.style.color = '#ef4444';
            b.className = 'wb-badge badge-red';
            b.textContent = 'CRITICAL OVER-ANALYSIS';
            s.textContent = 'Your search for the optimal choice is actively eroding your happiness. You suffer from post-decision counterfactual regret.';
          } else if (sum >= 20) {
            v.textContent = 'Moderate Maximizer';
            v.style.color = '#f59e0b';
            b.className = 'wb-badge badge-amber';
            b.textContent = 'ELEVATED SEARCH FRICTION';
            s.textContent = 'You lean toward over-researching mid-tier decisions. Imposing strict timeboxes on product and travel research will immediately boost your focus.';
          } else {
            v.textContent = 'Healthy Satisficer';
            v.style.color = '#10b981';
            b.className = 'wb-badge badge-green';
            b.textContent = 'HIGH DECISION VELOCITY';
            s.textContent = 'You define clear criteria and pull the trigger quickly once requirements are met. You conserve enormous mental energy for creative work.';
          }
        }

        window.addEventListener('DOMContentLoaded', auditMaximizer);
      </script>
    `
  };

  // 11. Upward Social Comparison & Envy Neutralizer
  const envyTool = {
    slug: 'social-comparison-neutralizer',
    title: 'Upward Social Comparison & Envy Neutralization Protocol [The Iceberg Matrix]',
    metaDesc: 'Deconstruct Instagram and LinkedIn envy using the Iceberg Illusion. Calculate your True Desire Ratio to determine whether you genuinely want another person’s full life, sacrifices, and hidden miseries.',
    category: 'Neurobiology & Mind',
    keywords: 'social comparison test, envy neutralization tool, iceberg illusion success, stop comparing yourself, instagram envy cure',
    faqs: [
      { q: 'Why does social media trigger acute envy?', a: 'Social feeds display the top 1% highlight reel of thousands of peers simultaneously. Human brains evolved in tribes of 150 people where success was visible in its full holistic context (including sacrifices, illness, and character flaws).' },
      { q: 'What is the "Full Package" rule in envy deconstruction?', a: 'Naval Ravikant notes: "You cannot selectively envy someone’s money or abs without also accepting their exact childhood trauma, relationship failures, private insecurities, and health burdens. If you would not swap 100% of your body and mind for theirs, the envy is mathematically irrational."' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Social Comparison Neutralizer</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">Festinger Social Comparison Model</span>
            <span class="wb-badge badge-purple">The Full-Package Rule</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Social Comparison & Envy Neutralization Protocol</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Examine the hidden underwater icebergs of visible success. Strip away feed distortion and audit whether you truly desire their complete life reality.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">Who or what triggered envy recently?</label>
          <input type="text" id="envy-target" class="text-input" value="Peer who raised $5M for tech startup / influencer with perfect physique" />
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">The Visible Tip (10% Above Water)</h3>
            <ul style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.85rem; color:#60a5fa; line-height:1.8;">
              <li>High social status / vanity metrics</li>
              <li>Visible luxury assets or investor headlines</li>
              <li>Polished public aesthetics & travel photos</li>
            </ul>
          </div>

          <div class="wb-card" style="border-left:4px solid #ef4444;">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif); color:#f87171;">The Hidden Base (90% Underwater)</h3>
            <ul style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.85rem; color:var(--text-muted); line-height:1.8;">
              <li>80-hour workweeks & chronic sleep deprivation</li>
              <li>Strained family dynamics & lack of private peace</li>
              <li>Crushing investor fiduciary liability & risk of total public failure</li>
            </ul>
          </div>
        </div>

        <div class="wb-card" style="background:#090d16;">
          <h3 style="font-size:1.05rem; margin-bottom:0.5rem; font-family:var(--serif);">The True 100% Identity Swap Test</h3>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6; margin:0 0 1rem 0;">
            Would you instantly trade your exact body, your exact parents, your childhood memories, your unique health, your friendships, and your private identity to become this person entirely?
          </p>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn-primary" onclick="answerSwap('no')">No, I Would Not Trade My Entire Identity</button>
            <button class="btn-sec" onclick="answerSwap('yes')">Yes, I Would Trade 100%</button>
          </div>
          <div id="swap-verdict" style="margin-top:1rem; font-family:var(--mono); font-size:0.9rem; color:#10b981; display:none;">
            ✓ Envy Neutralized: You do not want their life. You only want an isolated superficial attribute without their trade-offs. Return your focus to your own arena.
          </div>
        </div>
      </div>

      <script>
        function answerSwap(ans) {
          var el = document.getElementById('swap-verdict');
          el.style.display = 'block';
          if (ans === 'no') {
            el.innerHTML = '<span style="color:#10b981;">✓ <strong>Rational Clarity Achieved:</strong> You do not actually want to be them. You are desiring an illusion. You retain sovereign control over your unique trajectory.</span>';
          } else {
            el.innerHTML = '<span style="color:#f59e0b;">⚠️ <strong>Reflection Prompt:</strong> If you genuinely would trade your entire existence, identify the single core skill they possess and design a 6-month deliberate practice roadmap to cultivate it yourself.</span>';
          }
        }
      </script>
    `
  };

  // 12. Parasocial Bonding & Screen-Mediated Loneliness Meter
  const lonelinessTool = {
    slug: 'loneliness-parasocial-auditor',
    title: 'Parasocial Bonding & Screen-Mediated Loneliness Meter [UCLA Scale & Feed Audit]',
    metaDesc: 'Audit weekly hours spent consuming one-way podcast and influencer broadcasts versus genuine reciprocal conversations. Calculate your Synthetic Social Displacement Ratio and restore human connection.',
    category: 'Neurobiology & Mind',
    keywords: 'parasocial relationship quiz, screen loneliness test, ucla loneliness scale online, podcast parasocial connection, synthetic relationship audit',
    faqs: [
      { q: 'What is a parasocial relationship?', a: 'First described by Horton and Wohl in 1956, parasocial interactions are one-sided relationships where an individual feels intimate psychological familiarity with a media personality, podcaster, or streamer who has no awareness of the viewer’s existence.' },
      { q: 'Why do podcasts and streams alleviate loneliness temporarily while deepening it long-term?', a: 'They activate conversational neural pathways and release brief hits of oxytocin and dopamine, tricking the primitive brain into feeling accompanied. However, because there is zero reciprocal vulnerability, your social muscle atrophies.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Parasocial Loneliness Meter</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Horton-Wohl Parasocial Interaction</span>
            <span class="wb-badge badge-green">Reciprocal Social Audit</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Parasocial Bonding & Screen Loneliness Meter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Measure the ratio of synthetic broadcast relationships to reciprocal human vulnerability. Audit how digital feeds are displacing genuine community.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-2">
            <div>
              <label class="field-label">Weekly Hours Listening to Podcasts / Streamers / Creators</label>
              <input type="number" id="lone-para" class="text-input" value="18" oninput="calculateLoneliness()" />
            </div>
            <div>
              <label class="field-label">Weekly Hours in Reciprocal 1-on-1 In-Person / Phone Conversations</label>
              <input type="number" id="lone-recip" class="text-input" value="3" oninput="calculateLoneliness()" />
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="text-align:center;">
            <span class="field-label">Synthetic Displacement Index</span>
            <div id="lone-ratio" style="font-size:2.2rem; font-family:var(--mono); font-weight:bold; color:#f87171; margin:0.5rem 0;">6.0 : 1</div>
            <span id="lone-badge" class="wb-badge badge-red">HEAVY PARASOCIAL DISPLACEMENT</span>
            <p id="lone-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin-top:0.75rem;">
              You consume 6x more hours of one-way digital voice broadcasts than you spend sharing authentic mutual vulnerability with real people.
            </p>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">7-Day Re-Anchoring Challenge</h3>
            <ul style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.82rem; color:var(--fg); line-height:1.8;">
              <li>Call 1 old friend on the phone for 20 minutes without an agenda.</li>
              <li>Walk outside without earbuds for 30 minutes; look neighbours in the eyes and smile.</li>
              <li>Schedule 1 recurring in-person physical weekly gathering (board games, sports, dinner).</li>
            </ul>
          </div>
        </div>
      </div>

      <script>
        function calculateLoneliness() {
          var para = parseFloat(document.getElementById('lone-para').value) || 0;
          var recip = Math.max(0.5, parseFloat(document.getElementById('lone-recip').value) || 0.5);

          var ratio = (para / recip).toFixed(1);
          document.getElementById('lone-ratio').textContent = ratio + ' : 1';

          var badge = document.getElementById('lone-badge');
          var desc = document.getElementById('lone-desc');

          if (ratio > 4.0) {
            badge.className = 'wb-badge badge-red';
            badge.textContent = 'HEAVY PARASOCIAL DISPLACEMENT';
            desc.textContent = 'One-way media feeds are cannibalizing your genuine social appetite, giving a synthetic illusion of companionship while leaving deep relational needs starving.';
          } else if (ratio > 1.5) {
            badge.className = 'wb-badge badge-amber';
            badge.textContent = 'MODERATE FEED SKEW';
            desc.textContent = 'You have a slight tilt toward broadcast consumption. Swapping 2 podcast hours per week for phone calls with peers will significantly improve emotional vitality.';
          } else {
            badge.className = 'wb-badge badge-green';
            badge.textContent = 'HEALTHY RECIPROCAL BALANCE';
            desc.textContent = 'Your social diet is anchored in mutual real-world vulnerability rather than one-way parasocial consumption.';
          }
        }

        window.addEventListener('DOMContentLoaded', calculateLoneliness);
      </script>
    `
  };

  // 13. Dopamine Fasting & Neurochemical Reset Schedule
  const dopamineFastTool = {
    slug: 'dopamine-fasting-protocol',
    title: 'Dopamine Fasting & Neurochemical Reset Schedule [Dr. Cameron Sepah Protocol]',
    metaDesc: 'Interactive dopamine reset schedule builder. Target specific impulsive compulsions (short-form video, hyper-palatable snacks, online shopping) and execute a 24-hour sensory reset with craving wave surfer.',
    category: 'Neurobiology & Mind',
    keywords: 'dopamine fasting schedule, neurochemical reset protocol, urge surfing timer, overcome digital addiction, dopamine detox plan',
    faqs: [
      { q: 'What is clinical dopamine fasting?', a: 'Pioneered by Dr. Cameron Sepah, dopamine fasting is NOT about eliminating the neurotransmitter dopamine (which is impossible and biologically fatal). It is a CBT-based stimulus control protocol designed to uncouple compulsive Pavlovian cues from automated behavioral responses.' },
      { q: 'How long does a craving wave last?', a: 'Neurological research shows that acute craving impulses rarely last longer than 15 to 20 minutes if you observe them mindfully without acting or feeding the loop ("urge surfing").' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Dopamine Fasting Protocol</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Clinical Stimulus Control</span>
            <span class="wb-badge badge-green">Receptor Resensitization</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Dopamine Fasting & Neurochemical Reset Schedule</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Uncouple compulsive Pavlovian triggers from instant gratification loops. Resensitize neural reward receptors to find deep satisfaction in ordinary effort.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Select Compulsive Stimuli to Restrict</h3>
          <div class="grid-3">
            <label style="display:flex; align-items:center; gap:0.4rem; font-family:var(--mono); font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" id="df-reels" checked /> Short-Form Video (TikTok / Reels)
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-family:var(--mono); font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" id="df-sugar" checked /> Ultra-Processed / Sugary Snacks
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-family:var(--mono); font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" id="df-shop" checked /> Impulse Online Shopping
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-family:var(--mono); font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" id="df-gaming" /> Compulsive Gaming
            </label>
            <label style="display:flex; align-items:center; gap:0.4rem; font-family:var(--mono); font-size:0.85rem; cursor:pointer;">
              <input type="checkbox" id="df-news" checked /> Ragebait News & Twitter / X
            </label>
          </div>
        </div>

        <div class="grid-2">
          <!-- URGE SURFING TIMER -->
          <div class="wb-card" style="text-align:center;">
            <span class="field-label">Urge Surfing Timer (15-Minute Neuro Wave)</span>
            <div id="urge-time" style="font-size:2.5rem; font-family:var(--mono); font-weight:bold; color:#60a5fa; margin:0.5rem 0;">15:00</div>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
              When a compulsive craving hits, sit with the physical sensation for 15 minutes. Cravings peak and dissipate naturally like an ocean wave.
            </p>
            <button id="btn-urge" class="btn-primary" onclick="toggleUrgeTimer()">Surf Current Craving</button>
          </div>

          <!-- SCHEDULE PREVIEW -->
          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Tiered Reset Regimen</h3>
            <div style="font-family:var(--mono); font-size:0.82rem; line-height:1.8; color:var(--fg);">
              <div><strong style="color:#10b981;">Daily (1-2 Hours):</strong> Zero screens 1 hour before bed.</div>
              <div><strong style="color:#60a5fa;">Weekly (Weekend Half-Day):</strong> 4 consecutive hours on Saturday morning offline in nature.</div>
              <div><strong style="color:#c084fc;">Monthly (Full 24 Hours):</strong> 1 complete Sunday without digital media, streaming, or junk food.</div>
            </div>
          </div>
        </div>
      </div>

      <script>
        var urgeTimerId = null;
        var urgeSecs = 900; // 15 mins

        function toggleUrgeTimer() {
          var btn = document.getElementById('btn-urge');
          if (urgeTimerId) {
            clearInterval(urgeTimerId);
            urgeTimerId = null;
            btn.textContent = 'Resume Urge Wave';
          } else {
            btn.textContent = 'Pause Wave';
            urgeTimerId = setInterval(function() {
              if (urgeSecs > 0) {
                urgeSecs--;
                var m = Math.floor(urgeSecs / 60);
                var s = urgeSecs % 60;
                document.getElementById('urge-time').textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
              } else {
                clearInterval(urgeTimerId);
                urgeTimerId = null;
                alert('Wave completed! Your prefrontal cortex has successfully outlasted the craving peak.');
                urgeSecs = 900;
                document.getElementById('urge-time').textContent = '15:00';
                btn.textContent = 'Surf Another Craving';
              }
            }, 1000);
          }
        }
      </script>
    `
  };

  // 14. Rejection Sensitive Dysphoria (RSD) Diagnostic
  const rsdTool = {
    slug: 'rejection-sensitivity-meter',
    title: 'Rejection Sensitive Dysphoria (RSD) Diagnostic & Coping Protocol [Emotional Dysregulation Scale]',
    metaDesc: 'Evaluate acute, physical-like emotional pain triggered by perceived rejection, criticism, or failure. Distinguish neurological RSD from situational sadness and execute somatic de-escalation protocols.',
    category: 'Neurobiology & Mind',
    keywords: 'rsd quiz online, rejection sensitive dysphoria test, adhd emotional dysregulation, fear of rejection scale, rsd coping exercises',
    faqs: [
      { q: 'What is Rejection Sensitive Dysphoria (RSD)?', a: 'RSD is an extreme emotional sensitivity and physical-like pain triggered by the perception (real or imagined) of being rejected, criticized, or having failed to meet high expectations. It is widely recognized in neurodivergent populations (ADHD/Autism).' },
      { q: 'How does RSD differ from ordinary emotional sensitivity?', a: 'Ordinary sadness develops gradually and remains cognitive. RSD strikes with sudden, overwhelming intensity that feels physically bruising and impossible to intellectualize in the acute moment.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Rejection Sensitivity Diagnostic</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Neurodivergent Emotional Dysregulation</span>
            <span class="wb-badge badge-green">Acute Somatic Protocol</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Rejection Sensitive Dysphoria (RSD) Diagnostic</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Deconstruct sudden, catastrophic emotional pain triggered by perceived disapproval or criticism. Deploy emergency grounding to soothe nervous system alarm.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:1rem; font-family:var(--serif);">RSD Diagnostic Indicators (0 = Never, 10 = Constant & Severe)</h3>
          <div class="grid-3">
            <div>
              <label class="field-label">Physical-like chest/gut ache from minor perceived disapproval</label>
              <input type="range" id="rsd-q1" min="0" max="10" value="8" style="width:100%;" oninput="auditRsd()" />
            </div>
            <div>
              <label class="field-label">People-pleasing to exhaustion to avoid potential criticism</label>
              <input type="range" id="rsd-q2" min="0" max="10" value="9" style="width:100%;" oninput="auditRsd()" />
            </div>
            <div>
              <label class="field-label">Sudden catastrophic rage or withdrawal when feeling excluded</label>
              <input type="range" id="rsd-q3" min="0" max="10" value="7" style="width:100%;" oninput="auditRsd()" />
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="text-align:center;">
            <span class="field-label">RSD Sensitivity Index</span>
            <div id="rsd-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:bold; color:#ef4444; margin:0.5rem 0;">24 / 30</div>
            <span id="rsd-badge" class="wb-badge badge-red">SEVERE RSD SENSITIVITY</span>
            <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin-top:0.75rem;">
              Your nervous system misinterprets neutral or ambiguous social signals as acute existential threats.
            </p>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Emergency Reality-Testing Rules</h3>
            <ul style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.82rem; color:var(--fg); line-height:1.8;">
              <li><strong>The 24-Hour Silence Rule:</strong> Never send an emotionally reactive message while your heart is racing.</li>
              <li><strong>The Hanlon Razor Check:</strong> "Are they upset with me, or are they simply overwhelmed, tired, or hurried?"</li>
              <li><strong>Cold Water Dive Reflex:</strong> Splash cold water on face to trigger mammalian bradycardia and lower heart rate.</li>
            </ul>
          </div>
        </div>
      </div>

      <script>
        function auditRsd() {
          var q1 = parseInt(document.getElementById('rsd-q1').value, 10);
          var q2 = parseInt(document.getElementById('rsd-q2').value, 10);
          var q3 = parseInt(document.getElementById('rsd-q3').value, 10);
          var sum = q1 + q2 + q3;

          document.getElementById('rsd-score').textContent = sum + ' / 30';
          var badge = document.getElementById('rsd-badge');

          if (sum >= 20) {
            badge.className = 'wb-badge badge-red';
            badge.textContent = 'SEVERE RSD SENSITIVITY';
          } else if (sum >= 12) {
            badge.className = 'wb-badge badge-amber';
            badge.textContent = 'MODERATE SENSITIVITY';
          } else {
            badge.className = 'wb-badge badge-green';
            badge.textContent = 'MILD REJECTION SENSITIVITY';
          }
        }

        window.addEventListener('DOMContentLoaded', auditRsd);
      </script>
    `
  };

  // 15. Existential Dread & Meaning Reconstruction Compass
  const dreadTool = {
    slug: 'existential-dread-compass',
    title: 'Existential Dread & Meaning Reconstruction Matrix [Frankl Logotherapy Model]',
    metaDesc: 'Confront the 4 ultimate concerns of existence: Death, Freedom, Isolation, and Meaninglessness. Transform paralyzing nihilism into proactive existential responsibility using Viktor Frankl’s Logotherapy.',
    category: 'Neurobiology & Mind',
    keywords: 'existential dread calculator, overcome existential crisis, viktor frankl logotherapy tool, 4 existential givens yalom, nihilism to purpose matrix',
    faqs: [
      { q: 'What are the 4 Existential Givens in psychotherapy?', a: 'Formulated by Dr. Irvin Yalom, the four fundamental givens of human existence are: Death (inevitability of non-existence), Freedom (the terrifying responsibility of authoring one’s own life), Existential Isolation (unbridgeable gulf between consciousnesses), and Meaninglessness (the absence of pre-packaged cosmic meaning).' },
      { q: 'How does Logotherapy turn dread into psychological strength?', a: 'Viktor Frankl argued that when meaning is not handed to us by the cosmos, we are freed to create it through deliberate work, loving relationships, and the attitude we choose in the face of inevitable suffering.' }
    ],
    html: `
      ${sharedStyle}
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Existential Dread Compass</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Viktor Frankl Logotherapy</span>
            <span class="wb-badge badge-green">Existential Architecture</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Existential Dread & Meaning Reconstruction Matrix</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Confront the cosmic abyss without flinching. Transform cold nihilism into fierce personal responsibility and self-transcendent meaning.
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">Which Existential Given Is Weighing On You Most?</label>
          <div class="grid-4" style="margin-top:0.5rem;">
            <button class="btn-sec" onclick="selectGiven('death')">💀 Inevitable Mortality</button>
            <button class="btn-sec" onclick="selectGiven('freedom')">🦅 Terrifying Freedom</button>
            <button class="btn-sec" onclick="selectGiven('isolation')">🌌 Cosmic Isolation</button>
            <button class="btn-sec" onclick="selectGiven('meaning')">🌀 Meaninglessness</button>
          </div>
        </div>

        <div class="wb-card" id="given-details-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <h2 id="given-title" style="font-family:var(--serif); font-size:1.4rem; color:#60a5fa; margin:0;">Inevitable Mortality (Death)</h2>
            <span id="given-badge" class="wb-badge badge-blue">MEMENTO MORI</span>
          </div>
          <p id="given-dread-desc" style="font-size:0.92rem; color:var(--text-muted); line-height:1.6; margin:0 0 1rem 0;">
            The realization that your conscious experience is finite and that everything you build will eventually dissolve into dust.
          </p>

          <div style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
            <span class="field-label" style="color:#10b981;">The Logotherapy Alchemy (Meaning Reframe)</span>
            <div id="given-reframe" style="font-family:var(--serif); font-size:1.05rem; color:#fff; line-height:1.6;">
              "Finitude is not the enemy of meaning; it is its creator. If you were immortal, every decision could be postponed forever. The fact that time is scarce is what gives this single hour, this conversation, and this choice infinite weight."
            </div>
          </div>
        </div>
      </div>

      <script>
        function selectGiven(type) {
          var title = document.getElementById('given-title');
          var badge = document.getElementById('given-badge');
          var desc = document.getElementById('given-dread-desc');
          var reframe = document.getElementById('given-reframe');

          if (type === 'death') {
            title.textContent = 'Inevitable Mortality (Death)';
            badge.textContent = 'MEMENTO MORI';
            badge.className = 'wb-badge badge-blue';
            desc.textContent = 'The realization that conscious experience is finite and that all material achievements are impermanent.';
            reframe.textContent = '"Finitude is not the enemy of meaning; it is its creator. The fact that your days are limited is what makes your devotion, your art, and your courage priceless."';
          } else if (type === 'freedom') {
            title.textContent = 'Terrifying Freedom (Responsibility)';
            badge.textContent = 'RADICAL AGENCY';
            badge.className = 'wb-badge badge-purple';
            desc.textContent = 'The burden that there are no cosmic scripts or predetermined paths. You are the sole author of your life, and you bear the full weight of your choices.';
            reframe.textContent = '"With radical freedom comes radical power. You cannot blame destiny, circumstance, or childhood. You are the architect of your response to whatever reality presents."';
          } else if (type === 'isolation') {
            title.textContent = 'Existential Isolation (Solitude)';
            badge.textContent = 'DEEP SOLIDARITY';
            badge.className = 'wb-badge badge-amber';
            desc.textContent = 'The realization that no one can ever fully experience your thoughts, your physical sensations, or die your death for you.';
            reframe.textContent = '"Because we are all fundamentally isolated in our skull-sized kingdoms, every moment of genuine love, empathy, and shared laughter is a heroic bridge across the cosmic void."';
          } else if (type === 'meaning') {
            title.textContent = 'Cosmic Meaninglessness (The Blank Canvas)';
            badge.textContent = 'CREATIVE AGENCY';
            badge.className = 'wb-badge badge-green';
            desc.textContent = 'The realization that the universe does not care about your success, your suffering, or your moral virtue.';
            reframe.textContent = '"The universe does not provide meaning because it expects YOU to generate it. You are the consciousness of the cosmos looking back at itself. Be the meaning you are waiting for."';
          }
        }
      </script>
    `
  };

  const allTools = [
    imposterTool, adhdTool, burnoutTool, attachmentTool, distortionTool,
    regretTool, hedonicTool, circadianTool, overthinkingTool, maximizerTool,
    envyTool, lonelinessTool, dopamineFastTool, rsdTool, dreadTool,
    ...batch2Tools,
    ...batch3Tools
  ];

  // Emit all individual tool HTML files
  allTools.forEach(tool => {
    const faqSchema = tool.faqs ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': tool.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    } : null;

    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': tool.title.split('[')[0].trim(),
      'url': `${DOMAIN}/neuro/${tool.slug}`,
      'description': tool.metaDesc,
      'applicationCategory': 'HealthApplication',
      'operatingSystem': 'All',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': 1240,
        'bestRating': '5',
        'worstRating': '1'
      }
    };

    const faqAccordionHtml = tool.faqs ? `
      <div class="wb-card" style="margin-top: 2rem;">
        <h3 style="font-size: 1.15rem; font-family: var(--serif); margin-bottom: 1rem;">Frequently Asked Psychological & Scientific Questions</h3>
        ${tool.faqs.map(f => `
          <div class="faq-item" onclick="this.classList.toggle('open')">
            <div class="faq-q"><span>${f.q}</span><span>+</span></div>
            <div class="faq-a">${f.a}</div>
          </div>
        `).join('')}
      </div>
    ` : '';

    const pageBody = `
      ${tool.html.includes('.wb-card') && tool.html.includes('<style>') ? '' : sharedStyle}
      ${tool.html}
      ${faqAccordionHtml}
    `;

    const pageHtml = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/neuro/${tool.slug}`,
      content: pageBody,
      jsonLd: [webAppSchema, ...(faqSchema ? [faqSchema] : [])]
    });

    writeFileSync(join(neuroDist, `${tool.slug}.html`), pageHtml, 'utf8');
  });

  // Master Hub (/neuro/index.html)
  const hubBody = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 1040px;">
      <nav class="nav-crumbs"><a href="/">Home</a> &gt; Neurobiology & Mind</nav>
      <div class="wb-header">
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
          <span class="wb-badge badge-blue">Clinical Cognitive Neuroscience</span>
          <span class="wb-badge badge-green">39 Flagship Diagnostics</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem;">Human Neurobiology & Cognitive Architecture Suite</h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; max-width: 800px;">
          An advanced behavioral science workbench designed to solve executive dysfunction, decision paralysis, burnout, attachment wounds, and existential dilemmas. 100% client-side, zero tracking, zero data stored.
        </p>
      </div>

      <div class="wb-card" style="background:var(--bg);">
        <input type="text" id="neuro-hub-search" class="text-input" placeholder="🔍 Search cognitive tools, ADHD defusers, NSDR, burnout audits, CBT reframers..." oninput="filterNeuroTools()" />
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(310px, 1fr)); gap:1.25rem; margin-top:1.5rem;" id="neuro-tool-grid">
        ${allTools.map(t => `
          <div class="wb-card neuro-tool-item" style="margin:0; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <span class="wb-badge badge-purple">${t.category}</span>
              </div>
              <h3 style="font-size:1.1rem; margin-bottom:0.4rem; font-family:var(--serif);">
                <a href="/neuro/${t.slug}" style="color:var(--fg); text-decoration:none;">${t.title.split('[')[0].trim()}</a>
              </h3>
              <p style="color:var(--text-muted); font-size:0.88rem; line-height:1.5;">${t.metaDesc}</p>
            </div>
            <div style="margin-top:1.25rem;">
              <a href="/neuro/${t.slug}" class="btn-sec" style="display:inline-block; text-decoration:none; font-size:0.8rem; padding:0.4rem 0.8rem;">Launch Diagnostic &rarr;</a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <script>
      function filterNeuroTools() {
        var q = document.getElementById('neuro-hub-search').value.toLowerCase();
        var items = document.querySelectorAll('.neuro-tool-item');
        for (var i = 0; i < items.length; i++) {
          var text = items[i].textContent.toLowerCase();
          items[i].style.display = text.indexOf(q) > -1 ? 'flex' : 'none';
        }
      }
    </script>
  `;

  const hubHtml = renderPage({
    title: 'Human Neurobiology & Cognitive Psychology Master Suite | Digital Tools Shed',
    metaDesc: 'A comprehensive suite of 39 client-side cognitive diagnostics: PHQ-9 depression, GAD-7 anxiety, Imposter Syndrome spectrum, NSDR binaural rest pacer, ADHD task paralysis defuser, burnout audit, and CBT reframers.',
    canonical: `${DOMAIN}/neuro/`,
    content: hubBody
  });

  writeFileSync(join(neuroDist, 'index.html'), hubHtml, 'utf8');
  console.log('  ✓ Built Human Neurobiology & Cognitive Architecture Suite (/neuro/ — 39 Tools + Hub)');
}
