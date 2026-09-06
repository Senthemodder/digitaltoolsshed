// scratch/neuro_batch2.js — Batch 2 of Human Neurobiology Suite (Tools 16-27)
// Pure zero-dependency client-side diagnostics & workbenches

export const batch2Tools = [
  // 16. NSDR & Binaural Theta Rest Pacer
  {
    slug: 'nsdr-rest-pacer',
    title: 'Non-Sleep Deep Rest (NSDR) & Binaural Theta Pacer [Huberman Protocol]',
    metaDesc: 'Free client-side Non-Sleep Deep Rest (NSDR) protocol with customizable Web Audio binaural beats (theta/alpha 4Hz-7Hz), body scan pacer, and parasympathetic reset guidance.',
    category: 'Neurobiology & Mind',
    keywords: 'nsdr protocol online, non sleep deep rest timer, huberman nsdr audio pacer, binaural beats theta generator, yoga nidra online tool',
    faqs: [
      { q: 'What is Non-Sleep Deep Rest (NSDR)?', a: 'Coined by neurobiologist Dr. Andrew Huberman, NSDR encompasses practices like Yoga Nidra and self-directed relaxation that guide the brain into states of shallow sleep (alpha and theta brain waves) while remaining consciously awake, rapidly restoring dopamine and physical energy.' },
      { q: 'How do binaural beats work in this tool?', a: 'Using the Web Audio API, your browser generates two pure sine waves with a slight frequency offset (e.g. 200 Hz in the left ear, 205 Hz in the right ear). When listening through stereo headphones, your auditory cortex synthesizes the 5 Hz difference as a theta wave, entraining your brain toward deep restoration.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; NSDR Rest Pacer</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Autonomic Downregulation</span>
            <span class="wb-badge badge-purple">Web Audio Synthesizer</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Non-Sleep Deep Rest (NSDR) & Binaural Theta Pacer</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Shift your autonomic nervous system from sympathetic fight-or-flight into parasympathetic deep restoration in 10 to 30 minutes. Use stereo headphones for binaural entrainment.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Step 1: Configure Rest Session & Audio Entrainment</h3>
          <div class="grid-3">
            <div>
              <label class="field-label">Session Duration</label>
              <select id="nsdr-dur" class="text-input" onchange="resetNsdr()">
                <option value="600">10 Minutes (Quick Dopamine Reset)</option>
                <option value="1200" selected>20 Minutes (Standard Deep NSDR)</option>
                <option value="1800">30 Minutes (Full Yoga Nidra)</option>
              </select>
            </div>
            <div>
              <label class="field-label">Entrainment Wave Frequency</label>
              <select id="nsdr-freq" class="text-input" onchange="updateBinauralFreq()">
                <option value="4.5">4.5 Hz — Deep Theta (Sleep Boundary)</option>
                <option value="6.0" selected>6.0 Hz — Restorative Theta (NSDR Sweet Spot)</option>
                <option value="8.5">8.5 Hz — Alpha Wave (Relaxed Awareness)</option>
              </select>
            </div>
            <div>
              <label class="field-label">Audio Synth Volume</label>
              <input type="range" id="nsdr-vol" min="0" max="1" step="0.05" value="0.3" style="width:100%; margin-top:0.4rem;" oninput="updateNsdrVol()" />
              <div style="text-align:right; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);" id="lbl-vol">30%</div>
            </div>
          </div>

          <div style="margin-top:1.25rem; display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
            <button class="btn-primary" id="btn-nsdr-toggle" onclick="toggleNsdr()">▶ Start NSDR Session</button>
            <button class="btn-sec" onclick="resetNsdr()">↺ Reset</button>
            <span style="font-family:var(--mono); font-size:0.85rem; color:var(--text-muted);" id="nsdr-timer-display">20:00 remaining</span>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:260px;">
            <div class="field-label">Somatic Focus Pacer</div>
            <div id="nsdr-pacer-circle" style="width:120px; height:120px; border-radius:50%; background:radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.05) 70%); border:2px solid #3b82f6; display:flex; align-items:center; justify-content:center; font-family:var(--mono); font-size:0.85rem; color:#60a5fa; margin:1.5rem auto; transition:transform 4s ease-in-out;">
              Inhale
            </div>
            <div id="nsdr-guide-text" style="font-family:var(--serif); font-size:1.1rem; color:var(--fg); line-height:1.5;">
              "Press Start, close your eyes, and allow your body to sink into the floor or chair."
            </div>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">The 5 Somatic Milestones</h3>
            <ol style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.82rem; color:var(--fg); line-height:1.9;">
              <li><strong>Double Sigh:</strong> Two deep nasal inhales followed by one long, slow mouth exhale.</li>
              <li><strong>Body Scan:</strong> Mentally sweep attention from soles of feet to scalp, releasing tension.</li>
              <li><strong>Heavy Gravity:</strong> Imagine your limbs sinking 10 pounds heavier into the surface.</li>
              <li><strong>Panoramic Vision:</strong> With closed eyes, dilate awareness to the edges of your perception.</li>
              <li><strong>Zero-Effort Drifting:</strong> Relinquish all control over breathing and simply observe.</li>
            </ol>
          </div>
        </div>
      </div>

      <script>
        var nsdrAudioCtx = null;
        var nsdrOscL = null;
        var nsdrOscR = null;
        var nsdrGain = null;
        var nsdrRunning = false;
        var nsdrSeconds = 1200;
        var nsdrTimerId = null;
        var nsdrPhase = 0;

        function initAudio() {
          if (!nsdrAudioCtx) {
            var AudioCtx = window.AudioContext || window.webkitAudioContext;
            nsdrAudioCtx = new AudioCtx();
          }
          if (nsdrAudioCtx.state === 'suspended') {
            nsdrAudioCtx.resume();
          }
        }

        function startBinaural() {
          initAudio();
          stopBinaural();

          var baseFreq = 200;
          var offset = parseFloat(document.getElementById('nsdr-freq').value);
          var vol = parseFloat(document.getElementById('nsdr-vol').value);

          nsdrGain = nsdrAudioCtx.createGain();
          nsdrGain.gain.setValueAtTime(vol * 0.15, nsdrAudioCtx.currentTime);
          nsdrGain.connect(nsdrAudioCtx.destination);

          // Left channel
          var merger = nsdrAudioCtx.createChannelMerger(2);
          nsdrOscL = nsdrAudioCtx.createOscillator();
          nsdrOscL.type = 'sine';
          nsdrOscL.frequency.setValueAtTime(baseFreq, nsdrAudioCtx.currentTime);
          nsdrOscL.connect(merger, 0, 0);

          // Right channel
          nsdrOscR = nsdrAudioCtx.createOscillator();
          nsdrOscR.type = 'sine';
          nsdrOscR.frequency.setValueAtTime(baseFreq + offset, nsdrAudioCtx.currentTime);
          nsdrOscR.connect(merger, 0, 1);

          merger.connect(nsdrGain);
          nsdrOscL.start();
          nsdrOscR.start();
        }

        function stopBinaural() {
          if (nsdrOscL) { try { nsdrOscL.stop(); } catch(e){} nsdrOscL = null; }
          if (nsdrOscR) { try { nsdrOscR.stop(); } catch(e){} nsdrOscR = null; }
        }

        function updateNsdrVol() {
          var vol = parseFloat(document.getElementById('nsdr-vol').value);
          document.getElementById('lbl-vol').textContent = Math.round(vol * 100) + '%';
          if (nsdrGain && nsdrAudioCtx) {
            nsdrGain.gain.setValueAtTime(vol * 0.15, nsdrAudioCtx.currentTime);
          }
        }

        function updateBinauralFreq() {
          if (nsdrRunning) {
            startBinaural();
          }
        }

        function toggleNsdr() {
          if (nsdrRunning) {
            stopNsdr();
          } else {
            startNsdr();
          }
        }

        function startNsdr() {
          nsdrRunning = true;
          document.getElementById('btn-nsdr-toggle').textContent = '⏸ Pause Session';
          startBinaural();

          nsdrTimerId = setInterval(function() {
            if (nsdrSeconds > 0) {
              nsdrSeconds--;
              updateDisplay();
              stepPacer();
            } else {
              stopNsdr();
              var gText = document.getElementById('nsdr-guide-text');
              if (gText) gText.innerHTML = '<span style="color:#10b981; font-weight:bold;">✓ NSDR Session Complete! Gently open your eyes and take 3 deep breaths before standing up.</span>';
              var tDisp = document.getElementById('nsdr-timer-display');
              if (tDisp) tDisp.textContent = '00:00 — Session Complete';
            }
          }, 1000);
        }

        function stopNsdr() {
          nsdrRunning = false;
          clearInterval(nsdrTimerId);
          stopBinaural();
          document.getElementById('btn-nsdr-toggle').textContent = '▶ Resume Session';
        }

        function resetNsdr() {
          stopNsdr();
          nsdrSeconds = parseInt(document.getElementById('nsdr-dur').value, 10);
          updateDisplay();
          document.getElementById('btn-nsdr-toggle').textContent = '▶ Start NSDR Session';
          document.getElementById('nsdr-guide-text').textContent = '"Press Start, close your eyes, and allow your body to sink into the floor or chair."';
        }

        function updateDisplay() {
          var m = Math.floor(nsdrSeconds / 60);
          var s = nsdrSeconds % 60;
          document.getElementById('nsdr-timer-display').textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s) + ' remaining';
        }

        function stepPacer() {
          nsdrPhase = (nsdrPhase + 1) % 12;
          var circle = document.getElementById('nsdr-pacer-circle');
          var text = document.getElementById('nsdr-guide-text');

          if (nsdrPhase < 4) {
            circle.style.transform = 'scale(1.35)';
            circle.textContent = 'Inhale';
          } else if (nsdrPhase < 6) {
            circle.style.transform = 'scale(1.35)';
            circle.textContent = 'Top Up';
          } else {
            circle.style.transform = 'scale(0.85)';
            circle.textContent = 'Long Exhale';
          }

          if (nsdrSeconds > 900) {
            text.textContent = '"Focus on the contact points between your body and the floor. Feel the weight of your legs."';
          } else if (nsdrSeconds > 600) {
            text.textContent = '"Soften your face, unclench your jaw, and let your eyes relax backward into their sockets."';
          } else if (nsdrSeconds > 300) {
            text.textContent = '"Allow all mental effort to dissipate. You have nothing to produce and nowhere to go."';
          } else {
            text.textContent = '"Bathe in the theta stillness. Your nervous system is recalibrating baseline dopamine."';
          }
        }
      </script>
    `
  },

  // 17. Sleep Inertia & Cortisol Awakening Response (CAR) Calculator
  {
    slug: 'sleep-inertia-dissipator',
    title: 'Sleep Inertia & Cortisol Awakening Response (CAR) Calculator [Morning Alertness Protocol]',
    metaDesc: 'Calculate your sleep inertia dissipation curve and optimize your Cortisol Awakening Response (CAR) with lux light exposure timing, hydration protocols, and core body temperature acceleration.',
    category: 'Neurobiology & Mind',
    keywords: 'how to cure sleep inertia, cortisol awakening response calculator, morning grogginess science, why am i so tired waking up, delayed caffeine timing',
    faqs: [
      { q: 'What causes sleep inertia?', a: 'Sleep inertia is the groggy transition state between sleep and full wakefulness caused by lingering adenosine in the prefrontal cortex and incomplete thalamocortical network reactivation. It naturally lasts 15 to 60 minutes, but can stretch to 2+ hours if sleep was truncated mid-slow-wave cycle.' },
      { q: 'Why should caffeine be delayed 90 to 120 minutes after waking?', a: 'Adenosine receptors naturally clear during the first 90 minutes post-wake via the Cortisol Awakening Response. If you consume caffeine immediately, adenosine remains blocked but un-cleared, causing a severe energy crash at 2 PM when caffeine metabolizes.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Sleep Inertia Dissipator</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-amber">Adenosine Clearance Curve</span>
            <span class="wb-badge badge-green">Cortisol Awakening Protocol</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Sleep Inertia & Cortisol Awakening Response Calculator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Engineer your morning neurochemistry. Predict when your brain fog clears and calibrate your light, hydration, and caffeine windows to permanently eliminate the 2 PM crash.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Input Your Morning Parameters</h3>
          <div class="grid-3">
            <div>
              <label class="field-label">Wake-Up Time</label>
              <input type="time" id="wake-time" class="text-input" value="07:00" onchange="calcInertia()" />
            </div>
            <div>
              <label class="field-label">Hours Slept Last Night</label>
              <input type="number" id="wake-hours" class="text-input" min="3" max="12" step="0.5" value="6.5" oninput="calcInertia()" />
            </div>
            <div>
              <label class="field-label">Wake Grogginess (1 = Alert, 10 = Walking Corpse)</label>
              <input type="range" id="wake-grog" min="1" max="10" value="7" style="width:100%; margin-top:0.4rem;" oninput="calcInertia()" />
              <div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">
                <span>Fresh</span><span id="lbl-grog">7/10</span><span>Zombie</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div class="field-label">Adenosine Clearance & Alertness Curve</div>
            <canvas id="inertia-canvas" width="400" height="250" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px; margin-top:0.5rem;"></canvas>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="field-label">Circadian Schedule Prescriptions</div>
              <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.75rem;">
                <div style="padding:0.6rem; background:var(--bg); border-left:3px solid #3b82f6; border-radius:3px;">
                  <strong style="font-size:0.85rem; color:#60a5fa;">☀️ Sunlight Exposure Window:</strong>
                  <div id="out-sunlight" style="font-family:var(--mono); font-size:0.82rem; color:var(--fg); margin-top:0.2rem;">07:00 - 07:30 (10,000+ lux for 10-15 mins)</div>
                </div>
                <div style="padding:0.6rem; background:var(--bg); border-left:3px solid #10b981; border-radius:3px;">
                  <strong style="font-size:0.85rem; color:#34d399;">☕ Ideal First Caffeine Window:</strong>
                  <div id="out-caffeine" style="font-family:var(--mono); font-size:0.82rem; color:var(--fg); margin-top:0.2rem;">08:30 - 09:00 (90-120 mins post-wake)</div>
                </div>
                <div style="padding:0.6rem; background:var(--bg); border-left:3px solid #f59e0b; border-radius:3px;">
                  <strong style="font-size:0.85rem; color:#fbbf24;">⚡ Projected Peak Alertness:</strong>
                  <div id="out-peak" style="font-family:var(--mono); font-size:0.82rem; color:var(--fg); margin-top:0.2rem;">09:45 AM (Full prefrontal executive function)</div>
                </div>
              </div>
            </div>

            <div style="margin-top:1rem; padding:0.6rem; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:4px;">
              <span class="field-label" style="color:#f87171;">Core Body Temperature Protocol</span>
              <div style="font-size:0.8rem; color:var(--fg); line-height:1.4;">
                Splash cold water on eyes and face, followed by 500mL of water with a pinch of salt to restore plasma volume.
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function calcInertia() {
          var wakeTimeStr = document.getElementById('wake-time').value;
          var hoursSlept = parseFloat(document.getElementById('wake-hours').value);
          var grog = parseInt(document.getElementById('wake-grog').value, 10);
          document.getElementById('lbl-grog').textContent = grog + '/10';

          var parts = wakeTimeStr.split(':');
          var wakeH = parseInt(parts[0], 10);
          var wakeM = parseInt(parts[1], 10);
          var wakeTotalMin = wakeH * 60 + wakeM;

          // Compute clearance duration based on grogginess & sleep debt
          var clearanceMin = Math.round(30 + (grog * 6) + (hoursSlept < 7 ? (7 - hoursSlept) * 15 : 0));

          // Caffeine delay: 90 - 120 mins
          var cafStartMin = (wakeTotalMin + 90) % 1440;
          var cafEndMin = (wakeTotalMin + 120) % 1440;

          // Peak alertness: wake + clearance + 45
          var peakMin = (wakeTotalMin + clearanceMin + 45) % 1440;

          function fmt(m) {
            var h = Math.floor(m / 60) % 24;
            var min = m % 60;
            var ampm = h >= 12 ? 'PM' : 'AM';
            var h12 = h % 12 || 12;
            return (h12 < 10 ? '0' + h12 : h12) + ':' + (min < 10 ? '0' + min : min) + ' ' + ampm;
          }

          document.getElementById('out-sunlight').textContent = fmt(wakeTotalMin) + ' - ' + fmt(wakeTotalMin + 30) + ' (10,000+ lux for 10-15 mins)';
          document.getElementById('out-caffeine').textContent = fmt(cafStartMin) + ' - ' + fmt(cafEndMin) + ' (Prevents afternoon crash)';
          document.getElementById('out-peak').textContent = fmt(peakMin) + ' (Full prefrontal function unlocked)';

          // Draw Canvas Curve
          var canvas = document.getElementById('inertia-canvas');
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 400, 250);

          // Axes & Grid
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          for (var i = 50; i < 250; i += 50) {
            ctx.beginPath(); ctx.moveTo(40, i); ctx.lineTo(390, i); ctx.stroke();
          }

          // Inertia Decay Curve (Red to Green)
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#3b82f6';

          var gradient = ctx.createLinearGradient(40, 0, 390, 0);
          gradient.addColorStop(0, '#ef4444');
          gradient.addColorStop(0.4, '#f59e0b');
          gradient.addColorStop(1, '#10b981');
          ctx.strokeStyle = gradient;

          for (var t = 0; t <= 180; t += 5) {
            var x = 40 + (t / 180) * 340;
            // Sigmoidal alertness rising curve
            var alertness = 1 / (1 + Math.exp(-0.04 * (t - clearanceMin)));
            var y = 220 - (alertness * 180);
            if (t === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Labels
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText('Wake (' + fmt(wakeTotalMin) + ')', 35, 240);
          ctx.fillText('+60m', 145, 240);
          ctx.fillText('+120m (Caffeine)', 230, 240);
          ctx.fillText('+180m (Peak)', 330, 240);

          ctx.fillText('100% Alert', 45, 35);
          ctx.fillText('0% Groggy', 45, 215);
        }

        window.addEventListener('DOMContentLoaded', calcInertia);
      </script>
    `
  },

  // 18. Circadian Phase Response Curve (PRC) & Jet Lag Shifter
  {
    slug: 'circadian-phase-shifter',
    title: 'Circadian Phase Response Curve (PRC) & Jet Lag Shifter [Lewy Melatonin Protocol]',
    metaDesc: 'Shift your circadian clock forwards or backwards using the Lewy Phase Response Curve. Calculate exact light exposure, light avoidance, and 0.5mg micro-dose melatonin timing windows for rapid jet lag recovery.',
    category: 'Neurobiology & Mind',
    keywords: 'jet lag recovery protocol, circadian phase response curve lewy, micro dose melatonin timing, shift work circadian reset, phase advance phase delay',
    faqs: [
      { q: 'What is the Circadian Phase Response Curve (PRC)?', a: 'Developed by Dr. Alfred Lewy, the Phase Response Curve maps how light and melatonin shift your circadian master clock (suprachiasmatic nucleus). Depending on whether stimulus is applied before or after your core body temperature minimum, it can advance (shift earlier) or delay (shift later) your circadian cycle.' },
      { q: 'Why is micro-dose melatonin (0.3mg - 0.5mg) superior to commercial 5mg/10mg pills for phase shifting?', a: 'High doses flood melatonin receptors for 8+ hours, desensitizing the pineal feedback loop. Micro-doses mimic physiological pineal secretion levels (300-500 mcg), acting as a precise circadian phase-shifting trigger without morning hangover.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Circadian Phase Shifter</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Suprachiasmatic Nucleus Protocol</span>
            <span class="wb-badge badge-blue">Lewy Phase Response Curve</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Circadian Phase Response Curve (PRC) & Jet Lag Shifter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Master the biophysics of jet lag and shift work. Calculate exact light exposure and micro-dose melatonin timing to advance or delay your body clock by up to 3 hours per day.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Input Travel / Schedule Details</h3>
          <div class="grid-3">
            <div>
              <label class="field-label">Current Wake Time at Home</label>
              <input type="time" id="prc-wake" class="text-input" value="07:00" onchange="calcPrc()" />
            </div>
            <div>
              <label class="field-label">Time Zone Shift (Hours)</label>
              <select id="prc-shift" class="text-input" onchange="calcPrc()">
                <option value="3">East +3 Hours (e.g. SF to NY) — Phase Advance</option>
                <option value="6" selected>East +6 Hours (e.g. NY to London) — Phase Advance</option>
                <option value="9">East +9 Hours (e.g. NY to Tokyo) — Hard Advance</option>
                <option value="-3">West -3 Hours (e.g. NY to SF) — Phase Delay</option>
                <option value="-6">West -6 Hours (e.g. London to NY) — Phase Delay</option>
                <option value="night">Night Shift (Day-to-Night Inversion)</option>
              </select>
            </div>
            <div>
              <label class="field-label">Days to Transition</label>
              <input type="number" id="prc-days" class="text-input" min="1" max="10" value="3" oninput="calcPrc()" />
            </div>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:0.75rem; font-family:var(--serif);">Your Scientific Phase-Shift Protocol</h3>
          <div class="grid-3" style="margin-top:1rem;">
            <div style="padding:1rem; background:var(--bg); border:1px solid rgba(59,130,246,0.3); border-radius:4px;">
              <span class="wb-badge badge-blue">1. Light Exposure Window</span>
              <div id="prc-light-time" style="font-family:var(--mono); font-size:1.1rem; font-weight:600; color:#60a5fa; margin:0.5rem 0;">05:00 - 08:00 AM</div>
              <p id="prc-light-desc" style="font-size:0.85rem; color:var(--text-muted); margin:0;">Seek bright outdoor sunlight or 10,000-lux therapy lamp to advance circadian phase.</p>
            </div>

            <div style="padding:1rem; background:var(--bg); border:1px solid rgba(239,68,68,0.3); border-radius:4px;">
              <span class="wb-badge badge-red">2. Dark / Sunglasses Window</span>
              <div id="prc-dark-time" style="font-family:var(--mono); font-size:1.1rem; font-weight:600; color:#f87171; margin:0.5rem 0;">19:00 - 23:00 PM</div>
              <p id="prc-dark-desc" style="font-size:0.85rem; color:var(--text-muted); margin:0;">Wear blue-light blocking glasses or stay in dim lighting to prevent delaying the clock.</p>
            </div>

            <div style="padding:1rem; background:var(--bg); border:1px solid rgba(168,85,247,0.3); border-radius:4px;">
              <span class="wb-badge badge-purple">3. Micro-Melatonin (0.5mg)</span>
              <div id="prc-mel-time" style="font-family:var(--mono); font-size:1.1rem; font-weight:600; color:#c084fc; margin:0.5rem 0;">16:30 PM</div>
              <p style="font-size:0.85rem; color:var(--text-muted); margin:0;">Take 0.3mg-0.5mg micro-dose 4-5 hours before target sleep time to anchor the shift.</p>
            </div>
          </div>
        </div>
      </div>

      <script>
        function calcPrc() {
          var wakeStr = document.getElementById('prc-wake').value;
          var shiftVal = document.getElementById('prc-shift').value;
          var parts = wakeStr.split(':');
          var wakeH = parseInt(parts[0], 10);
          var wakeM = parseInt(parts[1], 10);
          var wakeMin = wakeH * 60 + wakeM;

          // Core Body Temp Min (Tmin) is approx wake time minus 2 hours
          var tMin = (wakeMin - 120 + 1440) % 1440;

          function fmt(m) {
            var h = Math.floor(m / 60) % 24;
            var min = m % 60;
            var ampm = h >= 12 ? 'PM' : 'AM';
            var h12 = h % 12 || 12;
            return (h12 < 10 ? '0' + h12 : h12) + ':' + (min < 10 ? '0' + min : min) + ' ' + ampm;
          }

          if (shiftVal === 'night' || parseInt(shiftVal, 10) < 0) {
            // Phase Delay (traveling West or staying up late)
            document.getElementById('prc-light-time').textContent = fmt((tMin - 180 + 1440) % 1440) + ' - ' + fmt(tMin);
            document.getElementById('prc-light-desc').textContent = 'Get bright light in the late evening (before Tmin) to delay your clock.';
            document.getElementById('prc-dark-time').textContent = fmt(tMin) + ' - ' + fmt((tMin + 180) % 1440);
            document.getElementById('prc-dark-desc').textContent = 'Avoid all light in the early morning after waking to prevent accidental phase advance.';
            document.getElementById('prc-mel-time').textContent = fmt((tMin + 60) % 1440) + ' (Upon waking)';
          } else {
            // Phase Advance (traveling East or waking up earlier)
            document.getElementById('prc-light-time').textContent = fmt(tMin) + ' - ' + fmt((tMin + 180) % 1440);
            document.getElementById('prc-light-desc').textContent = 'Get intense sunlight immediately after Tmin to advance your circadian clock forward.';
            document.getElementById('prc-dark-time').textContent = fmt((tMin - 240 + 1440) % 1440) + ' - ' + fmt(tMin);
            document.getElementById('prc-dark-desc').textContent = 'Dim all lighting and wear blue-blockers before your destination bedtime.';
            document.getElementById('prc-mel-time').textContent = fmt((wakeMin - 300 + 1440) % 1440);
          }
        }

        window.addEventListener('DOMContentLoaded', calcPrc);
      </script>
    `
  },

  // 19. Flow State Trigger Sequencer & Challenge-Skill Ratio Calculator
  {
    slug: 'flow-state-sequencer',
    title: 'Flow State Trigger Sequencer & Challenge-Skill Ratio Calculator [Csikszentmihalyi 4% Engine]',
    metaDesc: 'Calculate your exact challenge-skill ratio using the Mihaly Csikszentmihalyi 4% Golden Rule. Audit 17 environmental, psychological, and social flow triggers to reliably enter optimal focus.',
    category: 'Neurobiology & Mind',
    keywords: 'flow state calculator, csikszentmihalyi 4 percent rule, flow triggers checklist, how to enter flow state, challenge skill ratio model',
    faqs: [
      { q: 'What is the 4% Challenge-Skill Rule in flow science?', a: 'Mihaly Csikszentmihalyi and the Flow Research Collective discovered that flow occurs when the challenge of a task exceeds your current skill level by approximately 4%. If challenge is lower, you experience boredom; if challenge exceeds skill by more than 10%, the prefrontal cortex experiences threat anxiety and freezes.' },
      { q: 'What are the 4 phases of the Flow Cycle?', a: 'The flow state is not an on/off switch; it is a four-stage neurochemical cycle: 1. Struggle (cortisol & norepinephrine loading), 2. Release (alpha wave transition), 3. Flow (dopamine, anandamide, endorphin flood), 4. Recovery (serotonin & neuroplastic consolidation).' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Flow State Sequencer</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">Csikszentmihalyi Model</span>
            <span class="wb-badge badge-purple">17 Flow Triggers</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Flow State Trigger Sequencer & Challenge-Skill Ratio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Engineer the neurobiology of peak human performance. Map your current project coordinates on the Flow Matrix and unlock 17 empirical triggers to achieve deep absorption.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Step 1: Rate Current Challenge vs Skill Mastery</h3>
          <div class="grid-2">
            <div>
              <label class="field-label">Perceived Task Challenge (1 = Child's Play, 100 = Overwhelming Chaos)</label>
              <input type="range" id="flow-chal" min="1" max="100" value="65" style="width:100%;" oninput="calcFlow()" />
              <div style="text-align:right; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);" id="lbl-chal">65 / 100</div>
            </div>
            <div>
              <label class="field-label">Your Current Competence & Fluency (1 = Beginner, 100 = Master)</label>
              <input type="range" id="flow-skill" min="1" max="100" value="60" style="width:100%;" oninput="calcFlow()" />
              <div style="text-align:right; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);" id="lbl-skill">60 / 100</div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div class="field-label">Flow Channel 2D Matrix</div>
            <canvas id="flow-canvas" width="380" height="280" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px; margin-top:0.5rem;"></canvas>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="field-label">Flow Diagnostics Verdict</div>
              <h2 id="flow-verdict-title" style="font-family:var(--serif); font-size:1.35rem; color:#10b981; margin:0.25rem 0 0.5rem 0;">Optimal Flow Channel (+8%)</h2>
              <p id="flow-verdict-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
                Your task difficulty matches your competence near the ideal 4% sweet spot. You have sufficient challenge to suppress the default mode network without triggering panic.
              </p>
            </div>

            <div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; margin-top:1rem;">
              <span class="field-label" style="color:#60a5fa;">Flow Calibration Recommendation</span>
              <div id="flow-rec" style="font-family:var(--mono); font-size:0.82rem; color:var(--fg); line-height:1.5;">
                Lock in 90 minutes of continuous focus. Eliminate phone notifications and set a single unmistakable output goal.
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function calcFlow() {
          var chal = parseInt(document.getElementById('flow-chal').value, 10);
          var skill = parseInt(document.getElementById('flow-skill').value, 10);
          document.getElementById('lbl-chal').textContent = chal + ' / 100';
          document.getElementById('lbl-skill').textContent = skill + ' / 100';

          var diffPct = chal - skill;

          var canvas = document.getElementById('flow-canvas');
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 380, 280);

          // Zones
          ctx.fillStyle = 'rgba(239, 68, 68, 0.08)'; // Top-left: Anxiety
          ctx.fillRect(0, 0, 380, 280);

          // Flow channel diagonal
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.beginPath();
          ctx.moveTo(0, 280);
          ctx.lineTo(60, 280);
          ctx.lineTo(380, 40);
          ctx.lineTo(380, 0);
          ctx.lineTo(320, 0);
          ctx.lineTo(0, 220);
          ctx.closePath();
          ctx.fill();

          // Boredom zone
          ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
          ctx.beginPath();
          ctx.moveTo(60, 280);
          ctx.lineTo(380, 40);
          ctx.lineTo(380, 280);
          ctx.closePath();
          ctx.fill();

          // Labels
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText('ANXIETY ZONE (OVERWHELM)', 20, 40);
          ctx.fillText('BOREDOM / APATHY', 240, 250);
          ctx.fillStyle = '#34d399';
          ctx.fillText('FLOW CHANNEL (4%)', 130, 140);

          // Plot Point
          var px = (skill / 100) * 340 + 20;
          var py = 280 - ((chal / 100) * 240 + 20);

          ctx.beginPath();
          ctx.arc(px, py, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          var title = document.getElementById('flow-verdict-title');
          var desc = document.getElementById('flow-verdict-desc');
          var rec = document.getElementById('flow-rec');

          if (diffPct >= 15) {
            title.textContent = 'Acute Anxiety & Freeze Zone (Challenge +' + diffPct + '%)';
            title.style.color = '#ef4444';
            desc.textContent = 'Task challenge far outstrips your perceived competence. Your prefrontal cortex perceives the risk as overwhelming, triggering procrastination and paralysis.';
            rec.textContent = 'Shrink the scope! Deconstruct the project into micro-deliverables until your perceived difficulty drops into the manageable 4%-8% corridor.';
          } else if (diffPct <= -15) {
            title.textContent = 'Boredom & Distraction Zone (Competence Surplus)';
            title.style.color = '#f59e0b';
            desc.textContent = 'Your skill vastly exceeds the demands of this task. With insufficient cognitive tension, your brain seeks dopaminergic escape via social feeds and snacking.';
            rec.textContent = 'Add constraints! Impose a 25-minute speed blitz deadline, gamify the deliverable, or raise the standard of perfection to re-engage flow.';
          } else {
            title.textContent = 'Optimal Flow Corridor (' + (diffPct >= 0 ? '+' : '') + diffPct + '%)';
            title.style.color = '#10b981';
            desc.textContent = 'You are in the sweet spot! Task difficulty is calibrated just enough above your baseline to force transient hypofrontality and intense presence.';
            rec.textContent = 'Protect this state at all costs. Close all browser tabs, turn off your phone, and dive in for a continuous 90-minute ultradian sprint.';
          }
        }

        window.addEventListener('DOMContentLoaded', calcFlow);
      </script>
    `
  },

  // 20. Working Memory Span & Dual N-Back Capacity Auditor
  {
    slug: 'working-memory-span-tester',
    title: 'Working Memory Span & Dual N-Back Capacity Auditor [Cognitive Load Benchmark]',
    metaDesc: 'Benchmark your working memory buffer capacity using an interactive browser-based spatial and auditory N-back test. Measure cognitive bandwidth and Miller’s 7±2 working memory span.',
    category: 'Neurobiology & Mind',
    keywords: 'working memory test online, dual n-back browser test, millers law 7 plus minus 2, cognitive buffer benchmark, executive working memory capacity',
    faqs: [
      { q: 'What is working memory capacity and why does it matter?', a: 'Working memory is the mental workbench of the brain, governed by the dorsolateral prefrontal cortex. It holds and manipulates information simultaneously. Research shows working memory capacity strongly correlates with fluid intelligence, complex problem-solving, and emotional regulation.' },
      { q: 'What is Miller’s Law (7 ± 2)?', a: 'Formulated in 1956 by psychologist George Miller, it states that the average human working memory can hold approximately 7 chunks of information (modern research suggests 4 to 5 complex items) before information spills over and decays.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Working Memory Tester</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Dorsolateral Prefrontal Benchmark</span>
            <span class="wb-badge badge-green">Interactive Spatial N-Back</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Working Memory Span & Spatial N-Back Auditor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Test your active working memory buffer. A square will illuminate in a 3x3 grid every 2.5 seconds. Press MATCH when the square appears in the same position as 2 turns ago (2-Back).
          </p>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="display:flex; flex-direction:column; align-items:center;">
            <div style="display:grid; grid-template-columns:repeat(3, 80px); grid-template-rows:repeat(3, 80px); gap:8px; margin:1rem 0;" id="nback-grid">
              <div class="nb-cell" id="nb-0" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-1" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-2" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-3" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-4" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-5" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-6" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-7" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
              <div class="nb-cell" id="nb-8" style="background:#0f172a; border:1px solid #334155; border-radius:4px;"></div>
            </div>

            <div style="display:flex; gap:0.5rem; margin-top:0.5rem;">
              <button class="btn-primary" id="btn-nb-start" onclick="startNback()">Start 2-Back Test (15 Trials)</button>
              <button class="btn-sec" id="btn-nb-match" onclick="registerNbackMatch()" style="background:#1e293b; color:#60a5fa; border-color:#3b82f6;" disabled>⚡ Position Match (Space)</button>
            </div>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="field-label">Working Memory Telemetry</div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.5rem;">
                <div style="padding:0.6rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
                  <div class="field-label">Trial Progress</div>
                  <div id="nb-trial-count" style="font-family:var(--mono); font-size:1.2rem; font-weight:600; color:var(--fg);">0 / 15</div>
                </div>
                <div style="padding:0.6rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
                  <div class="field-label">Accuracy Score</div>
                  <div id="nb-accuracy" style="font-family:var(--mono); font-size:1.2rem; font-weight:600; color:#10b981;">100%</div>
                </div>
              </div>

              <div id="nb-verdict-box" style="margin-top:1.25rem; padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; display:none;">
                <span class="field-label" style="color:#c084fc;">Cognitive Capacity Verdict</span>
                <div id="nb-verdict-text" style="font-size:0.88rem; color:var(--fg); line-height:1.5; margin-top:0.25rem;"></div>
              </div>
            </div>

            <div style="font-family:var(--mono); font-size:0.75rem; color:var(--text-muted); line-height:1.5;">
              Rule: If square at trial #N matches square at trial #(N-2), click Position Match before the next flash!
            </div>
          </div>
        </div>
      </div>

      <script>
        var nbActive = false;
        var nbHistory = [];
        var nbTrialsTotal = 15;
        var nbCurrentTrial = 0;
        var nbCorrect = 0;
        var nbMistakes = 0;
        var nbMatchedThisTurn = false;
        var nbTimer = null;

        function startNback() {
          nbActive = true;
          nbHistory = [];
          nbCurrentTrial = 0;
          nbCorrect = 0;
          nbMistakes = 0;
          document.getElementById('btn-nb-start').disabled = true;
          document.getElementById('btn-nb-match').disabled = false;
          document.getElementById('nb-verdict-box').style.display = 'none';

          nextNbackStep();
          nbTimer = setInterval(nextNbackStep, 2500);
        }

        function nextNbackStep() {
          if (nbCurrentTrial >= nbTrialsTotal) {
            finishNback();
            return;
          }

          // Clear grid cells
          for (var i = 0; i < 9; i++) {
            document.getElementById('nb-' + i).style.background = '#0f172a';
          }

          // Check if previous step was a match that user missed
          if (nbCurrentTrial >= 2 && !nbMatchedThisTurn) {
            var wasMatch = nbHistory[nbCurrentTrial - 1] === nbHistory[nbCurrentTrial - 3];
            if (wasMatch) nbMistakes++;
          }
          nbMatchedThisTurn = false;

          // Pick cell: 35% probability of match if trial >= 2
          var cell;
          if (nbCurrentTrial >= 2 && Math.random() < 0.35) {
            cell = nbHistory[nbCurrentTrial - 2];
          } else {
            cell = Math.floor(Math.random() * 9);
          }

          nbHistory.push(cell);
          nbCurrentTrial++;

          // Light up
          var el = document.getElementById('nb-' + cell);
          el.style.background = '#3b82f6';
          setTimeout(function() {
            el.style.background = '#0f172a';
          }, 800);

          document.getElementById('nb-trial-count').textContent = nbCurrentTrial + ' / ' + nbTrialsTotal;
        }

        function registerNbackMatch() {
          if (!nbActive || nbMatchedThisTurn || nbCurrentTrial < 2) return;
          nbMatchedThisTurn = true;

          var isActualMatch = nbHistory[nbCurrentTrial - 1] === nbHistory[nbCurrentTrial - 3];
          if (isActualMatch) {
            nbCorrect++;
          } else {
            nbMistakes++;
          }

          var totalEvaluated = nbCorrect + nbMistakes;
          var acc = totalEvaluated > 0 ? Math.round((nbCorrect / totalEvaluated) * 100) : 100;
          document.getElementById('nb-accuracy').textContent = acc + '%';
        }

        function finishNback() {
          clearInterval(nbTimer);
          nbActive = false;
          document.getElementById('btn-nb-start').disabled = false;
          document.getElementById('btn-nb-match').disabled = true;

          var total = nbCorrect + nbMistakes;
          var acc = total > 0 ? Math.round((nbCorrect / total) * 100) : 100;
          document.getElementById('nb-accuracy').textContent = acc + '%';

          var box = document.getElementById('nb-verdict-box');
          var text = document.getElementById('nb-verdict-text');
          box.style.display = 'block';

          if (acc >= 85) {
            text.textContent = 'High Prefrontal Working Memory Capacity (Score: ' + acc + '%). You maintain high attentional fidelity and filter distractors effectively under continuous cognitive load.';
          } else if (acc >= 65) {
            text.textContent = 'Standard Working Memory Span (Score: ' + acc + '%). Normal Miller 7±2 cognitive buffer. Mild attentional leakage observed during rapid state transitions.';
          } else {
            text.textContent = 'Elevated Cognitive Overload / Working Memory Fatigue (Score: ' + acc + '%). High interference detected. Your brain is likely suffering from acute sleep debt, digital multitasking, or stress.';
          }
        }

        window.addEventListener('keydown', function(e) {
          if (e.code === 'Space' && nbActive) {
            e.preventDefault();
            registerNbackMatch();
          }
        });
      </script>
    `
  },

  // 21. Kahneman-Tversky Prospect Theory & Loss Aversion Recalibrator
  {
    slug: 'loss-aversion-recalibrator',
    title: 'Loss Aversion & Expected Value Risk Recalibrator [Kahneman-Tversky Prospect Theory]',
    metaDesc: 'Neutralize cognitive loss aversion bias with Daniel Kahneman & Amos Tversky’s Prospect Theory. Calculate true mathematical expected value (EV) vs subjective emotional pain using the 2.25x loss aversion multiplier.',
    category: 'Neurobiology & Mind',
    keywords: 'loss aversion calculator, prospect theory kahneman tversky, 2.25x loss aversion coefficient, expected value risk tool, overcome fear of financial loss',
    faqs: [
      { q: 'What is the Loss Aversion coefficient in Prospect Theory?', a: 'Nobel laureates Daniel Kahneman and Amos Tversky demonstrated through empirical trials that the psychological pain of losing $100 is approximately 2.0 to 2.5 times (median 2.25x) greater than the pleasure of gaining $100. This evolutionary asymmetry causes humans to reject mathematically favorable gambles.' },
      { q: 'How do elite decision-makers neutralize loss aversion?', a: 'By viewing decisions as repeated portfolio distributions over a 10-year lifetime rather than isolated one-off bets. If every bet has a positive Expected Value (+EV), the law of large numbers guarantees massive compounding success despite temporary losses.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Loss Aversion Recalibrator</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Kahneman-Tversky Prospect Theory</span>
            <span class="wb-badge badge-green">Rational Expected Value (EV)</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Loss Aversion & Expected Value Risk Recalibrator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Separate primal emotional panic from cold mathematical reality. Audit whether fear of failure is causing you to reject life-changing asymmetric upside.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Input the Decision Gamble Parameters</h3>
          <div class="grid-4">
            <div>
              <label class="field-label">Potential Upside / Gain ($)</label>
              <input type="number" id="la-gain" class="text-input" value="10000" oninput="calcLossAversion()" />
            </div>
            <div>
              <label class="field-label">Probability of Success (%)</label>
              <input type="number" id="la-prob-win" class="text-input" min="1" max="99" value="60" oninput="calcLossAversion()" />
            </div>
            <div>
              <label class="field-label">Potential Downside / Loss ($)</label>
              <input type="number" id="la-loss" class="text-input" value="4000" oninput="calcLossAversion()" />
            </div>
            <div>
              <label class="field-label">Probability of Loss (%)</label>
              <input type="number" id="la-prob-lose" class="text-input" min="1" max="99" value="40" oninput="calcLossAversion()" />
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card" style="background:var(--bg); border:1px solid #10b981;">
            <div class="field-label" style="color:#10b981;">Objective Mathematical Reality (EV)</div>
            <div id="la-ev-val" style="font-family:var(--mono); font-size:2rem; font-weight:700; color:#10b981; margin:0.5rem 0;">+$4,400.00</div>
            <p id="la-ev-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
              This gamble has massive positive Expected Value. Over 100 iterations, taking bets like this compounds into immense wealth.
            </p>
          </div>

          <div class="wb-card" style="background:var(--bg); border:1px solid #ef4444;">
            <div class="field-label" style="color:#f87171;">Primal Brain Emotional Utility (2.25x Loss Multiplier)</div>
            <div id="la-psy-val" style="font-family:var(--mono); font-size:2rem; font-weight:700; color:#f87171; margin:0.5rem 0;">-$3,000.00</div>
            <p id="la-psy-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
              Your amygdala perceives this opportunity as an acute danger because it weights the loss 2.25x higher than the equivalent gain.
            </p>
          </div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Cognitive Debiasing Prescription</h3>
          <div id="la-prescription" style="font-family:var(--mono); font-size:0.85rem; color:var(--fg); line-height:1.6;">
            If taking this loss does not cause existential bankruptcy or physical starvation, TAKE THE BET. Your brain is lying to you to protect ancient stone-age food stores.
          </div>
        </div>
      </div>

      <script>
        function calcLossAversion() {
          var gain = parseFloat(document.getElementById('la-gain').value) || 0;
          var probWin = (parseFloat(document.getElementById('la-prob-win').value) || 0) / 100;
          var loss = parseFloat(document.getElementById('la-loss').value) || 0;
          var probLose = (parseFloat(document.getElementById('la-prob-lose').value) || 0) / 100;

          // Standard EV
          var ev = (gain * probWin) - (loss * probLose);

          // Prospect Theory Subjective Utility: Loss weighted by 2.25
          var psyEv = (gain * probWin) - (loss * 2.25 * probLose);

          function fmtMoney(v) {
            var sign = v >= 0 ? '+' : '-';
            return sign + '$' + Math.abs(Math.round(v)).toLocaleString();
          }

          var evEl = document.getElementById('la-ev-val');
          evEl.textContent = fmtMoney(ev);
          evEl.style.color = ev >= 0 ? '#10b981' : '#ef4444';

          var psyEl = document.getElementById('la-psy-val');
          psyEl.textContent = fmtMoney(psyEv);
          psyEl.style.color = psyEv >= 0 ? '#10b981' : '#ef4444';

          var presc = document.getElementById('la-prescription');
          if (ev > 0 && psyEv < 0) {
            presc.innerHTML = '<strong>Classic Loss Aversion Trap Detected:</strong> Math says YES (+' + fmtMoney(ev) + '), but your amygdala screams NO (' + fmtMoney(psyEv) + '). You are letting primitive fear veto a mathematically winning move. Treat this as one bet in a 1,000-bet life career.';
          } else if (ev <= 0) {
            presc.innerHTML = '<strong>Mathematically Bad Gamble:</strong> Both math and instinct agree. Do not take this risk; the expected value is negative.';
          } else {
            presc.innerHTML = '<strong>Asymmetric Golden Ticket:</strong> The upside is so massive that even emotional loss aversion cannot eclipse it. Execute without hesitation.';
          }
        }

        window.addEventListener('DOMContentLoaded', calcLossAversion);
      </script>
    `
  },

  // 22. Hyperbolic Discounting & Present Bias Future-Self Bridge
  {
    slug: 'hyperbolic-discounting-calculator',
    title: 'Hyperbolic Discounting & Present Bias Future-Self Bridge [Intertemporal Choice Engine]',
    metaDesc: 'Visualize how your brain devalues future rewards using George Ainslie’s Hyperbolic Discounting model. Calculate present-bias decay curves and construct pre-commitment Ulysses contracts.',
    category: 'Neurobiology & Mind',
    keywords: 'hyperbolic discounting calculator, present bias intertemporal choice, ulysses contract generator, future self empathy bridge, time inconsistency curve',
    faqs: [
      { q: 'What is Hyperbolic Discounting?', a: 'Formulated by George Ainslie, hyperbolic discounting describes the mathematical tendency for humans to prefer smaller, immediate payoffs over larger, later payoffs with an extreme drop in subjective value over the first few days or weeks, leading to time inconsistency (procrastination).' },
      { q: 'What is a Ulysses Contract?', a: 'Named after the mythological hero who had himself bound to the mast of his ship to resist the Sirens’ song, a Ulysses contract is a pre-commitment mechanism that strips your future present-biased self of the ability to self-sabotage.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Hyperbolic Discounting</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">George Ainslie Model</span>
            <span class="wb-badge badge-purple">Intertemporal Choice</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Hyperbolic Discounting & Future-Self Bridge</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Understand why you pledge to eat clean tomorrow but eat pizza tonight. Compare rational exponential discounting against your brain's steep hyperbolic collapse.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Configure Intertemporal Payoff</h3>
          <div class="grid-3">
            <div>
              <label class="field-label">Future Reward Magnitude (e.g. $10,000 or Career Milestone)</label>
              <input type="number" id="hd-amount" class="text-input" value="10000" oninput="calcHyperbolic()" />
            </div>
            <div>
              <label class="field-label">Delay Until Delivery (Days)</label>
              <input type="number" id="hd-days" class="text-input" min="1" max="365" value="90" oninput="calcHyperbolic()" />
            </div>
            <div>
              <label class="field-label">Subjective Impatience Factor (k)</label>
              <input type="range" id="hd-k" min="0.01" max="0.15" step="0.01" value="0.05" style="width:100%; margin-top:0.4rem;" oninput="calcHyperbolic()" />
              <div style="text-align:right; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);" id="lbl-hd-k">k = 0.05</div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div class="field-label">Perceived Subjective Value Curve</div>
            <canvas id="hd-canvas" width="380" height="240" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px; margin-top:0.5rem;"></canvas>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="field-label">Present-Day Value Perception</div>
              <div id="hd-current-val" style="font-family:var(--mono); font-size:1.8rem; font-weight:700; color:#60a5fa; margin:0.5rem 0;">$1,818.18</div>
              <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
                Because of hyperbolic decay ($V = \frac{A}{1 + kd}$), your brain values this massive future prize at less than 20% of its real worth right now.
              </p>
            </div>

            <div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="field-label" style="color:#10b981;">Ulysses Pre-Commitment Solution</span>
              <div style="font-family:var(--mono); font-size:0.8rem; color:var(--fg);">
                Lock in future behavior today: set up automated bank transfers, give passwords to an accountability partner, or schedule public commitments with financial forfeits.
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function calcHyperbolic() {
          var A = parseFloat(document.getElementById('hd-amount').value) || 10000;
          var days = parseInt(document.getElementById('hd-days').value, 10) || 90;
          var k = parseFloat(document.getElementById('hd-k').value) || 0.05;
          document.getElementById('lbl-hd-k').textContent = 'k = ' + k.toFixed(2);

          // V = A / (1 + k * days)
          var currentVal = A / (1 + (k * days));
          document.getElementById('hd-current-val').textContent = '$' + Math.round(currentVal).toLocaleString();

          var canvas = document.getElementById('hd-canvas');
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 380, 240);

          // Axes
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(35, 10); ctx.lineTo(35, 205); ctx.lineTo(370, 205);
          ctx.stroke();

          // Exponential curve (Rational) in green
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#10b981';
          for (var d = 0; d <= days; d += 2) {
            var x = 35 + (d / days) * 330;
            var expVal = A * Math.exp(-0.015 * (days - d));
            var y = 205 - ((expVal / A) * 180);
            if (d === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Hyperbolic curve in blue
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#3b82f6';
          for (var d = 0; d <= days; d += 2) {
            var x = 35 + (d / days) * 330;
            var hypVal = A / (1 + (k * (days - d)));
            var y = 205 - ((hypVal / A) * 180);
            if (d === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Labels
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText('Today', 35, 225);
          ctx.fillText('Delivery (Day ' + days + ')', 260, 225);
          ctx.fillStyle = '#10b981';
          ctx.fillText('Exponential (Rational)', 45, 25);
          ctx.fillStyle = '#60a5fa';
          ctx.fillText('Hyperbolic (Human)', 45, 45);
        }

        window.addEventListener('DOMContentLoaded', calcHyperbolic);
      </script>
    `
  },

  // 23. Status Anxiety & Meritocracy Fallacy Auditor
  {
    slug: 'status-anxiety-deconstructor',
    title: 'Status Anxiety & Meritocracy Fallacy Auditor [Alain de Botton Philosophy Matrix]',
    metaDesc: 'Deconstruct status anxiety, peer comparison pressure, and the insidious psychological trap of meritocracy using Alain de Botton’s philosophical framework.',
    category: 'Neurobiology & Mind',
    keywords: 'alain de botton status anxiety tool, meritocracy fallacy audit, overcome status anxiety, peer comparison imposterism, fear of being ordinary',
    faqs: [
      { q: 'What is Status Anxiety according to Alain de Botton?', a: 'Status anxiety is a continuous, unspoken worry about our standing in society, driven by the fear of being judged as unsuccessful and therefore undeserving of respect or love. In modern meritocracies, where success is attributed to personal merit, failure is painfully interpreted as personal worthlessness.' },
      { q: 'How does this tool help deconstruct status anxiety?', a: 'It separates your core intrinsic human worth from external commercial signaling, dismantling the illusion that material possessions or titles reflect emotional depth or virtue.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Status Anxiety Auditor</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Alain de Botton Philosophy</span>
            <span class="wb-badge badge-blue">Meritocracy Deconstruction</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Status Anxiety & Meritocracy Fallacy Auditor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Examine the unspoken dread of being deemed a "nobody." Uncover the four pillars of status vulnerability and reclaim emotional sovereignty.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Rate Your Agreement (1 = Never, 5 = Consistently)</h3>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div>
              <label class="field-label">1. "When an old schoolmate achieves major public wealth, I feel an acute sting of inadequacy."</label>
              <input type="range" id="sa-q1" min="1" max="5" value="4" style="width:100%;" oninput="auditStatus()" />
            </div>
            <div>
              <label class="field-label">2. "I feel immense pressure to explain and justify my job title at dinner parties or social gatherings."</label>
              <input type="range" id="sa-q2" min="1" max="5" value="4" style="width:100%;" oninput="auditStatus()" />
            </div>
            <div>
              <label class="field-label">3. "I secretly believe that society is a true meritocracy, so my bank account reflects my intrinsic value."</label>
              <input type="range" id="sa-q3" min="1" max="5" value="3" style="width:100%;" oninput="auditStatus()" />
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div class="field-label">Status Vulnerability Score</div>
            <div id="sa-score-val" style="font-family:var(--mono); font-size:2.2rem; font-weight:700; color:#f59e0b; margin:0.5rem 0;">11 / 15</div>
            <span id="sa-badge" class="wb-badge badge-amber">ACUTE STATUS SENSITIVITY</span>
            <p id="sa-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin-top:0.75rem;">
              You are experiencing high vulnerability to meritocratic guilt. You have absorbed the dogma that external status equals human legitimacy.
            </p>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">Philosophical Antidotes</h3>
            <ul style="margin:0; padding-left:1.2rem; font-family:var(--mono); font-size:0.82rem; color:var(--fg); line-height:1.8;">
              <li><strong>The Snobbery Razor:</strong> A snob is someone who takes a tiny part of you (your job) and equates it with the whole of you. Why crave their approval?</li>
              <li><strong>The Tragedy Model:</strong> Ancient Greeks had tragedy to remind society that luck, timing, and capricious fate dictate outcomes, not pure merit.</li>
              <li><strong>Death as Equalizer:</strong> In 100 years, every billionaire and their detractors will be identical dust.</li>
            </ul>
          </div>
        </div>
      </div>

      <script>
        function auditStatus() {
          var q1 = parseInt(document.getElementById('sa-q1').value, 10);
          var q2 = parseInt(document.getElementById('sa-q2').value, 10);
          var q3 = parseInt(document.getElementById('sa-q3').value, 10);
          var sum = q1 + q2 + q3;

          document.getElementById('sa-score-val').textContent = sum + ' / 15';
          var badge = document.getElementById('sa-badge');
          var desc = document.getElementById('sa-desc');

          if (sum >= 12) {
            badge.className = 'wb-badge badge-red';
            badge.textContent = 'SEVERE STATUS ANXIETY';
            desc.textContent = 'You are trapped in the meritocratic comparison meat-grinder. You are evaluating your soul through the lens of LinkedIn feeds and luxury consumerism.';
          } else if (sum >= 8) {
            badge.className = 'wb-badge badge-amber';
            badge.textContent = 'MODERATE STATUS SENSITIVITY';
            desc.textContent = 'You experience standard contemporary comparison friction. You recognize the absurdity of status games intellectually, but still feel the emotional pinch.';
          } else {
            badge.className = 'wb-badge badge-green';
            badge.textContent = 'GROUNDED STOIC IMMUNITY';
            desc.textContent = 'You possess high internal locus of control. You measure life by personal mastery, authentic friendship, and peace of mind rather than public admiration.';
          }
        }

        window.addEventListener('DOMContentLoaded', auditStatus);
      </script>
    `
  },

  // 24. Trauma Bond & Intermittent Reinforcement Cycle Interrupter
  {
    slug: 'trauma-bond-interrupter',
    title: 'Trauma Bond & Intermittent Reinforcement Cycle Interrupter [Behavioral Psychology Audit]',
    metaDesc: 'Audit the psychological mechanisms of a trauma bond. Identify intermittent reinforcement schedules, dopamine craving loops, and cognitive dissonance in toxic relationships.',
    category: 'Neurobiology & Mind',
    keywords: 'trauma bond test, intermittent reinforcement relationship, break trauma bond protocol, gray rock communication scripts, narcissistic cycle breakdown',
    faqs: [
      { q: 'What is a trauma bond?', a: 'A trauma bond is a deep psychological attachment that forms in an abusive or volatile relationship characterized by a recurring cycle of emotional threat/abuse followed by sudden warmth, relief, and validation.' },
      { q: 'How does intermittent reinforcement create an addictive bond?', a: 'In B.F. Skinner’s operant conditioning trials, rats pressed levers most compulsively when reward pellets were distributed unpredictably. In relationships, unpredictable affection floods the brain with dopamine, creating a neurochemical addiction identical to gambling.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Trauma Bond Interrupter</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Operant Conditioning Diagnostic</span>
            <span class="wb-badge badge-purple">Dopamine Addiction Cycle</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Trauma Bond & Intermittent Reinforcement Interrupter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Deconstruct why leaving feels physically impossible. Unmask the neurochemical addiction of walking on eggshells and regain emotional clarity.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Audit the Relational Dynamic (Check All That Apply)</h3>
          <div style="display:flex; flex-direction:column; gap:0.6rem;" id="tb-checks">
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="auditTb()" /> Unpredictable mood shifts: You never know whether you will receive loving warmth or icy contempt.
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="auditTb()" /> Walking on eggshells: You constantly monitor your tone and body language to avoid triggering an explosion.
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="auditTb()" /> Love bombing after conflict: Major blowout fights are followed by overwhelming romance and promises of change.
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="auditTb()" /> Self-gaslighting: You justify their cruelty to your friends and blame yourself for "provoking" them.
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="auditTb()" /> Physical withdrawal symptoms: Thinking about walking away triggers chest tightness, nausea, and intense dread.
            </label>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div class="field-label">Bond Strength Index</div>
            <div id="tb-verdict-title" style="font-family:var(--serif); font-size:1.4rem; color:#60a5fa; margin:0.25rem 0 0.5rem 0;">Baseline Relational Tension</div>
            <p id="tb-verdict-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
              Check the criteria above to assess the biochemical intensity of your attachment.
            </p>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">The Gray Rock Communication Rule</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5; margin:0 0 0.75rem 0;">
              To starve intermittent reinforcement, become as uninteresting as a dull gray rock:
            </p>
            <div style="font-family:var(--mono); font-size:0.8rem; background:var(--bg); padding:0.6rem; border:1px solid var(--border); border-radius:4px; line-height:1.6;">
              "I hear your point." &bull; "Okay." &bull; "I'll think about that."<br>
              Zero defense, zero counter-attacks, zero emotional fuel.
            </div>
          </div>
        </div>
      </div>

      <script>
        function auditTb() {
          var checkboxes = document.querySelectorAll('#tb-checks input[type="checkbox"]');
          var count = 0;
          for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) count++;
          }

          var title = document.getElementById('tb-verdict-title');
          var desc = document.getElementById('tb-verdict-desc');

          if (count >= 4) {
            title.textContent = 'Acute Biochemical Trauma Bond (' + count + '/5)';
            title.style.color = '#ef4444';
            desc.textContent = 'You are experiencing intense intermittent reinforcement addiction. What you feel is not romantic destiny; it is the physiological craving of an operant conditioning loop. Prioritize external peer anchoring and strict boundaries.';
          } else if (count >= 2) {
            title.textContent = 'Moderate Boundary Erosion (' + count + '/5)';
            title.style.color = '#f59e0b';
            desc.textContent = 'Early-stage cycle patterns detected. Notice how the relief after conflict feels like euphoria. Start tracking objective behavior rather than sentimental potential.';
          } else {
            title.textContent = 'Mild Relational Friction (' + count + '/5)';
            title.style.color = '#10b981';
            desc.textContent = 'Low trauma bond indicators. Normal interpersonal conflict dynamics observed without the hallmark traits of cyclical dopamine addiction.';
          }
        }
      </script>
    `
  },

  // 25. Nonviolent Communication (NVC) 4-Step Conflict Translator
  {
    slug: 'nonviolent-communication-translator',
    title: 'Nonviolent Communication (NVC) 4-Step Conflict Translator [Marshall Rosenberg Model]',
    metaDesc: 'Transform blame, passive aggression, and defensiveness into collaborative dialogue. Translate heated emotional conflicts through the 4 NVC pillars: Observation, Feeling, Need, and Request.',
    category: 'Neurobiology & Mind',
    keywords: 'nonviolent communication translator, marshall rosenberg nvc tool, convert blame to needs, relationship conflict de escalator, 4 steps of nvc online',
    faqs: [
      { q: 'What is Nonviolent Communication (NVC)?', a: 'Developed by clinical psychologist Marshall Rosenberg, NVC is an evidence-based communication framework based on 4 pillars: Observation (neutral facts), Feelings (pure bodily sensations, not disguised thoughts), Needs (universal human requirements), and Requests (concrete, doable, non-demanding actions).' },
      { q: 'Why does standard conflict language trigger defensiveness?', a: 'Words like "always", "never", and evaluative judgments ("you are inconsiderate") activate the listener’s amygdala fight-or-flight response. NVC strips moralistic judgments, allowing the listener to hear your vulnerability rather than an attack.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; NVC Conflict Translator</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-green">Marshall Rosenberg NVC</span>
            <span class="wb-badge badge-blue">Amygdala De-escalator</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Nonviolent Communication 4-Step Conflict Translator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Convert toxic accusations into disarming vulnerability. Reframe conflict from "Who is to blame?" into "What universal need is currently unmet?"
          </p>
        </div>

        <div class="wb-card">
          <label class="field-label">Type Your Frustrated / Heated Statement</label>
          <input type="text" id="nvc-raw" class="text-input" value="You never listen to me and you always leave all the chores for me to clean up!" oninput="translateNvc()" />
          <div style="margin-top:0.5rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-sec" onclick="loadNvcPreset('chores')">Preset: Household Chores</button>
            <button class="btn-sec" onclick="loadNvcPreset('late')">Preset: Flaking / Chronic Lateness</button>
            <button class="btn-sec" onclick="loadNvcPreset('ignored')">Preset: Emotionally Dismissed</button>
          </div>
        </div>

        <div class="wb-card">
          <div class="field-label" style="color:#10b981;">The 4-Pillar Nonviolent Deconstruction</div>
          <div class="grid-2" style="margin-top:1rem;">
            <div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="wb-badge badge-blue">1. Pure Observation (Zero Judgments)</span>
              <div id="nvc-step1" style="font-family:var(--serif); font-size:1.05rem; color:var(--fg); margin-top:0.4rem;">
                "When I see the dishes in the sink from yesterday and haven't had a chance to speak with you today..."
              </div>
            </div>

            <div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="wb-badge badge-purple">2. Vulnerable Feeling (Bodily Sensation)</span>
              <div id="nvc-step2" style="font-family:var(--serif); font-size:1.05rem; color:var(--fg); margin-top:0.4rem;">
                "...I feel exhausted, overwhelmed, and disconnected..."
              </div>
            </div>

            <div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="wb-badge badge-amber">3. Universal Human Need</span>
              <div id="nvc-step3" style="font-family:var(--serif); font-size:1.05rem; color:var(--fg); margin-top:0.4rem;">
                "...because I deeply value shared partnership, order, and feeling heard."
              </div>
            </div>

            <div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="wb-badge badge-green">4. Actionable, Doable Request</span>
              <div id="nvc-step4" style="font-family:var(--serif); font-size:1.05rem; color:var(--fg); margin-top:0.4rem;">
                "Would you be willing to sit with me for 10 minutes tonight so we can agree on a shared chore schedule?"
              </div>
            </div>
          </div>
        </div>

        <div class="wb-card" style="background:var(--surface);">
          <div class="field-label">Complete Ready-To-Send Dialogue Script</div>
          <div id="nvc-full-script" style="font-family:var(--serif); font-size:1.15rem; color:#fff; line-height:1.6; margin:0.5rem 0;">
            "When I see the dishes in the sink and we haven't talked today, I feel exhausted and disconnected, because I value partnership and order. Would you be willing to sit down for 10 minutes tonight to divide tasks?"
          </div>
          <button class="btn-primary" onclick="var btn=this; navigator.clipboard.writeText(document.getElementById('nvc-full-script').textContent.trim()).then(function(){ var orig=btn.innerHTML; btn.innerHTML='✓ Copied to Clipboard!'; setTimeout(function(){ btn.innerHTML=orig; }, 2000); });">📋 Copy Script to Clipboard</button>
        </div>
      </div>

      <script>
        function loadNvcPreset(type) {
          if (type === 'chores') {
            document.getElementById('nvc-raw').value = 'You never do any chores and you expect me to clean up after you!';
          } else if (type === 'late') {
            document.getElementById('nvc-raw').value = 'You are always late and you clearly do not respect my time!';
          } else if (type === 'ignored') {
            document.getElementById('nvc-raw').value = 'You are always on your phone and you never pay attention to me!';
          }
          translateNvc();
        }

        function translateNvc() {
          var raw = document.getElementById('nvc-raw').value.toLowerCase();
          var s1 = document.getElementById('nvc-step1');
          var s2 = document.getElementById('nvc-step2');
          var s3 = document.getElementById('nvc-step3');
          var s4 = document.getElementById('nvc-step4');
          var full = document.getElementById('nvc-full-script');

          if (raw.indexOf('late') > -1 || raw.indexOf('time') > -1) {
            s1.textContent = '"When we agree to meet at 6:00 PM and you arrive at 6:35 PM without a message..."';
            s2.textContent = '"...I feel anxious, stressed, and depleted..."';
            s3.textContent = '"...because I need predictability and consideration for my schedule."';
            s4.textContent = '"Would you be willing to send me a text 30 minutes before if you anticipate running behind?"';
            full.textContent = '"When we agree on 6:00 PM and you arrive at 6:35 PM, I feel stressed because I need predictability. Would you be willing to text me 30 minutes ahead if you run late?"';
          } else if (raw.indexOf('phone') > -1 || raw.indexOf('listen') > -1) {
            s1.textContent = '"When I share something about my day while you are looking at your phone screen..."';
            s2.textContent = '"...I feel lonely, unimportant, and distant..."';
            s3.textContent = '"...because I value connection, presence, and intimacy with you."';
            s4.textContent = '"Would you be willing to put the phone face down for 5 minutes while we catch up?"';
            full.textContent = '"When I talk about my day while your eyes are on the screen, I feel lonely because I value connection. Would you be willing to put the phone down for 5 minutes?"';
          } else {
            s1.textContent = '"When I see unfinished tasks around the home after a long workday..."';
            s2.textContent = '"...I feel overwhelmed, weary, and alone in managing our space..."';
            s3.textContent = '"...because I deeply need equity, partnership, and calm surroundings."';
            s4.textContent = '"Would you be willing to tackle the kitchen together with me for 15 minutes right now?"';
            full.textContent = '"When I see tasks pile up, I feel overwhelmed because I need shared partnership. Would you be willing to spend 15 minutes tackling this together right now?"';
          }
        }
      </script>
    `
  },

  // 26. Lisa Feldman Barrett Emotional Granularity Wheel
  {
    slug: 'emotional-granularity-wheel',
    title: 'Emotional Granularity & Interoceptive Precision Wheel [Constructed Emotion Model]',
    metaDesc: 'Expand your emotional vocabulary beyond "bad" or "stressed" into 48 precise affective states based on Dr. Lisa Feldman Barrett’s Theory of Constructed Emotion.',
    category: 'Neurobiology & Mind',
    keywords: 'emotional granularity wheel, lisa feldman barrett constructed emotion, interoception vocabulary tool, affect grid valence arousal, high emotional granularity benefits',
    faqs: [
      { q: 'What is Emotional Granularity?', a: 'Emotional granularity, discovered by neuroscientist Dr. Lisa Feldman Barrett, is the ability to construct nuanced emotional concepts with high specificity (e.g. distinguishing between "frustrated", "betrayed", "overstimulated", and "ennui" rather than lumping them all under "feeling bad").' },
      { q: 'How does emotional granularity improve mental resilience?', a: 'The brain is a prediction engine. When your brain has a precise label for an interoceptive state, it selects the exact behavioral and biological regulation protocol, reducing prolonged cortisol release and autonomic stress.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Emotional Granularity Wheel</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Dr. Lisa Feldman Barrett Model</span>
            <span class="wb-badge badge-blue">Interoceptive Precision</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Emotional Granularity & Interoceptive Wheel</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Stop saying you are "stressed" or "fine." Map your raw bodily valence and arousal onto 48 distinct affective states to trigger immediate neurological down-regulation.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Step 1: Calibrate Raw Affect Dimensions</h3>
          <div class="grid-2">
            <div>
              <label class="field-label">Pleasantness / Valence (1 = Highly Unpleasant, 10 = Pure Bliss)</label>
              <input type="range" id="eg-val" min="1" max="10" value="3" style="width:100%;" oninput="updateGranularity()" />
              <div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">
                <span>Aversive</span><span id="lbl-eg-val">3/10</span><span>Pleasant</span>
              </div>
            </div>
            <div>
              <label class="field-label">Energy / Arousal (1 = Lethargic / Comatose, 10 = Electrified / Heart Pounding)</label>
              <input type="range" id="eg-aro" min="1" max="10" value="8" style="width:100%;" oninput="updateGranularity()" />
              <div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted);">
                <span>Low Energy</span><span id="lbl-eg-aro">8/10</span><span>High Arousal</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div class="field-label">Affective Coordinate Space</div>
            <canvas id="eg-canvas" width="360" height="260" style="width:100%; height:auto; background:#090d16; border:1px solid var(--border); border-radius:4px; margin-top:0.5rem;"></canvas>
          </div>

          <div class="wb-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div class="field-label">Granular Emotional Classification</div>
              <h2 id="eg-title" style="font-family:var(--serif); font-size:1.5rem; color:#ef4444; margin:0.25rem 0 0.5rem 0;">Overstimulated Agitation</h2>
              <p id="eg-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.6;">
                High physical sympathetic arousal paired with unpleasant valence. This is not sadness; it is autonomic sensory overcharge and hyper-vigilance.
              </p>
            </div>

            <div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px;">
              <span class="field-label" style="color:#10b981;">Targeted Nervous System Prescription</span>
              <div id="eg-presc" style="font-family:var(--mono); font-size:0.82rem; color:var(--fg);">
                Perform 3 physiological sighs (double inhale + long exhale) and reduce auditory input by putting on noise-cancelling headphones.
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        function updateGranularity() {
          var val = parseInt(document.getElementById('eg-val').value, 10);
          var aro = parseInt(document.getElementById('eg-aro').value, 10);
          document.getElementById('lbl-eg-val').textContent = val + '/10';
          document.getElementById('lbl-eg-aro').textContent = aro + '/10';

          var canvas = document.getElementById('eg-canvas');
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, 360, 260);

          // Quadrant divider lines
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(180, 0); ctx.lineTo(180, 260);
          ctx.moveTo(0, 130); ctx.lineTo(360, 130);
          ctx.stroke();

          // Labels
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px monospace';
          ctx.fillText('HIGH AROUSAL / UNPLEASANT', 15, 20);
          ctx.fillText('HIGH AROUSAL / PLEASANT', 200, 20);
          ctx.fillText('LOW AROUSAL / UNPLEASANT', 15, 245);
          ctx.fillText('LOW AROUSAL / PLEASANT', 205, 245);

          // Plot Point
          var px = (val / 10) * 320 + 20;
          var py = 260 - ((aro / 10) * 220 + 20);

          ctx.beginPath();
          ctx.arc(px, py, 9, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();

          var title = document.getElementById('eg-title');
          var desc = document.getElementById('eg-desc');
          var presc = document.getElementById('eg-presc');

          if (val <= 5 && aro > 5) {
            title.textContent = 'Acute Agitation / Hyper-Arousal';
            title.style.color = '#ef4444';
            desc.textContent = 'High sympathetic drive with aversive valence. Symptoms: racing heart, shallow breath, irritability, feeling trapped.';
            presc.textContent = 'Do 3 physiological sighs. Splash freezing water on your face. Walk outside in open panoramic vision for 5 minutes.';
          } else if (val > 5 && aro > 5) {
            title.textContent = 'Exhilarated Vitality / Flow';
            title.style.color = '#10b981';
            desc.textContent = 'High energy paired with positive valence. Symptoms: eagerness, creative dopamine flow, presence, acute curiosity.';
            presc.textContent = 'Channel this energy directly into your #1 creative bottleneck. Do not waste this neurochemical wave on email or cleaning.';
          } else if (val <= 5 && aro <= 5) {
            title.textContent = 'Ennui / Dorsal Vagal Torpor';
            title.style.color = '#f59e0b';
            desc.textContent = 'Low metabolic energy paired with mild emotional malaise. Not major depression; an evolutionary metabolic conservation pause.';
            presc.textContent = 'Do NOT doomscroll. Drink 500mL water, stand up, stretch your spine, and expose eyes to natural daylight to bump cortisol.';
          } else {
            title.textContent = 'Serene Equanimity / Restoration';
            title.style.color = '#60a5fa';
            desc.textContent = 'Deep parasympathetic calm with pleasant tone. Symptoms: slow pulse, relaxed belly, soft gaze, contentment.';
            presc.textContent = 'Enjoy the stillness. Excellent state for reading complex philosophy, listening to music, or connecting with loved ones.';
          }
        }

        window.addEventListener('DOMContentLoaded', updateGranularity);
      </script>
    `
  },

  // 27. ADHD Post-Hyperfocus Hangover Recovery Protocol
  {
    slug: 'hyperfocus-recovery-system',
    title: 'ADHD Hyperfocus Hangover & Dopamine Depletion Recovery Protocol [Neurochemical Reset]',
    metaDesc: 'Recover rapidly from acute post-hyperfocus exhaustion, brain fog, and sensory sensitivity with targeted biochemical, hydration, and nervous system protocols.',
    category: 'Neurobiology & Mind',
    keywords: 'adhd hyperfocus hangover recovery, adhd dopamine crash protocol, post hyperfocus brain fog, adhd sensory sensitivity after working, adhd shutdown reset',
    faqs: [
      { q: 'What causes an ADHD Hyperfocus Hangover?', a: 'During a 4 to 8-hour hyperfocus state, the ADHD brain drains its prefrontal dopamine, norepinephrine, and acetylcholine reserves while ignoring thirst, nutrition, and bodily posture. The sudden crash is an acute neurochemical and metabolic depletion state.' },
      { q: 'How do you safely recover from an ADHD shutdown?', a: 'First, restore glucose and electrolytes immediately (the brain consumed huge glucose reserves). Second, avoid high-stimulus screens (social media, video games) which prolong dopamine depletion. Third, engage in low-stimulus sensory rest.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Hyperfocus Recovery</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">ADHD Executive Architecture</span>
            <span class="wb-badge badge-green">Dopamine Replenishment</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">ADHD Hyperfocus Hangover & Recovery Protocol</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Did you just spend 7 hours glued to your screen without eating, drinking, or moving? Here is your step-by-step neurochemical and metabolic resuscitation triage.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.1rem; margin-bottom:1rem; font-family:var(--serif);">Step 1: Rapid Post-Binge Triage Checklist</h3>
          <div style="display:flex; flex-direction:column; gap:0.6rem;" id="hf-checklist">
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="updateHf()" /> <strong>Water & Electrolytes:</strong> Chug 1 large glass of water with a pinch of salt or electrolyte packet.
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="updateHf()" /> <strong>Fast Blood Glucose:</strong> Eat an apple, protein bar, or piece of toast. (Your brain is starving).
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="updateHf()" /> <strong>Physical Uncurling:</strong> Stand up, stretch hamstrings, roll shoulders, and shake out wrists.
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="updateHf()" /> <strong>Visual Horizon Reset:</strong> Look out a window at a distance of 50+ feet for 2 continuous minutes.
            </label>
            <label style="font-size:0.88rem; color:var(--fg); display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
              <input type="checkbox" onchange="updateHf()" /> <strong>Screen Quarantine:</strong> Do NOT jump into TikTok or Reddit. Give eyes 15 minutes of darkness.
            </label>
          </div>
        </div>

        <div class="grid-2">
          <div class="wb-card">
            <div class="field-label">Recovery Triage Status</div>
            <div id="hf-status-title" style="font-family:var(--serif); font-size:1.4rem; color:#f87171; margin:0.25rem 0 0.5rem 0;">Acute Depletion Mode (0 / 5)</div>
            <p id="hf-status-desc" style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
              You are running on pure adrenaline fumes. Execute the 5 triage items above to replenish prefrontal neurotransmitters.
            </p>
          </div>

          <div class="wb-card">
            <h3 style="font-size:1.05rem; margin-bottom:0.75rem; font-family:var(--serif);">The Official "Permission To Stop" Script</h3>
            <div style="font-family:var(--serif); font-size:1rem; color:#fff; line-height:1.6; background:var(--bg); padding:1rem; border:1px solid var(--border); border-radius:4px;">
              "You produced an incredible burst of output today. The work is done. You do not need to clean the house, solve your life, or be productive for the rest of this evening. You are granted complete permission to rest."
            </div>
          </div>
        </div>
      </div>

      <script>
        function updateHf() {
          var boxes = document.querySelectorAll('#hf-checklist input[type="checkbox"]');
          var count = 0;
          for (var i = 0; i < boxes.length; i++) {
            if (boxes[i].checked) count++;
          }

          var title = document.getElementById('hf-status-title');
          var desc = document.getElementById('hf-status-desc');

          if (count === 5) {
            title.textContent = 'Physiological Equilibrium Restored (5 / 5)';
            title.style.color = '#10b981';
            desc.textContent = 'Hydration, glucose, and ocular tension have been re-calibrated. Now lie down or take a warm shower without screens.';
          } else if (count >= 3) {
            title.textContent = 'Recovery In Progress (' + count + ' / 5)';
            title.style.color = '#f59e0b';
            desc.textContent = 'Blood flow is returning to normal. Finish the remaining triage items before doing anything else.';
          } else {
            title.textContent = 'Acute Depletion Mode (' + count + ' / 5)';
            title.style.color = '#f87171';
            desc.textContent = 'You are running on pure adrenaline fumes. Execute the remaining triage items to replenish prefrontal neurotransmitters.';
          }
        }
      </script>
    `
  }
];
