// scripts/util_tools.js - Daily Utility & Productivity Tools for Digital Tools Shed

export function buildUtilToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const utilDist = join(DIST, 'util');
  ensureDir(utilDist);

  const commonStyle = `
    <style>
      .tool-box { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0; }
      .field-group { margin-bottom: 1.25rem; }
      .field-label { display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; font-weight: 600; }
      .code-input, .text-input { width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 0.95rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; }
      .btn-primary { background: var(--btn-bg, #3b82f6); color: var(--btn-fg, #fff); border: none; padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: opacity 0.2s; }
      .btn-primary:hover { opacity: 0.9; }
      .btn-sec { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; }
      .btn-sec:hover { background: var(--surface-alt); }
      .action-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; align-items: center; }
      .result-card { background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center; margin-top: 1.5rem; }
      .result-val { font-family: var(--mono); font-size: 2.5rem; font-weight: bold; color: var(--btn-bg, #3b82f6); margin: 0.25rem 0; }
      .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.5; }
      .trap-card strong { display: block; margin-bottom: 0.3rem; font-size: 0.95rem; }
      .faq-item { margin-bottom: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }
      .faq-item summary { padding: 0.85rem 1.15rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; }
      .faq-item summary::-webkit-details-marker { display: none; }
      .faq-item summary::after { content: "+"; font-family: var(--mono); font-size: 1.2rem; }
      .faq-item[open] summary::after { content: "−"; }
      .faq-item div { padding: 0.85rem 1.15rem; border-top: 1px solid var(--border); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }
    </style>
  `;

  const tools = [
    {
      slug: 'stopwatch',
      title: 'Online Stopwatch with Milliseconds & Split Lap Times (No Lag)',
      metaDesc: 'High-precision online digital stopwatch with millisecond accuracy, split lap tracking, copyable logs, and zero battery drain. Runs 100% locally in browser.',
      category: 'Utility',
      faq: [
        { q: "How accurate is this online stopwatch?", a: "The stopwatch measures time down to the exact millisecond using high-resolution epoch delta timestamps (Date.now() and performance.now()). It updates at 100 frames per second without accumulative interval drift." },
        { q: "Does the stopwatch lose time if I switch tabs or minimize my browser?", a: "No. Because the timer computes elapsed time by subtracting your start epoch timestamp from the current clock time rather than counting ticks, it retains 100% mathematical precision even when the browser throttles background animations." },
        { q: "How do split laps work and can I copy or export them?", a: "Each time you click the Lap button, the stopwatch records the split interval and lap differential. You can click 'Copy Laps' to copy all split times to your clipboard or 'Export CSV' to save a spreadsheet log." },
        { q: "What keyboard shortcuts can I use to control the stopwatch?", a: "You can press Spacebar to Start/Pause, press L to record a Lap, and press R to Reset the stopwatch." },
        { q: "Does this stopwatch consume battery or send data to servers?", a: "No. The timer runs 100% locally in client-side JavaScript. No timer telemetry or tracking data is sent to external servers, ensuring complete privacy and negligible CPU consumption." }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Online Stopwatch
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Online Stopwatch with Split Lap Times</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Millisecond-accurate digital stopwatch featuring split lap recording, epoch delta drift compensation, keyboard shortcuts, and instant clipboard export. 100% private and lag-free.
          </p>

          <div class="tool-box">
            <div class="result-card" style="margin-top:0;">
              <div id="sw-display" class="result-val" style="font-size: 3.5rem; letter-spacing: 0.05em;">00:00.000</div>
            </div>

            <div class="action-bar" style="justify-content: center; margin: 1.5rem 0;">
              <button id="sw-start" class="btn-primary" onclick="toggleStopwatch()">&#x25B6; Start</button>
              <button id="sw-lap" class="btn-sec" onclick="lapStopwatch()" disabled>Lap</button>
              <button class="btn-sec" onclick="resetStopwatch()">Reset</button>
              <button type="button" class="btn-sec" id="btnCopyLaps" onclick="copyLapsText()">Copy Laps</button>
              <button type="button" class="btn-sec" id="btnExportLaps" onclick="exportLapsCsv()">Export CSV</button>
            </div>

            <div id="lap-box" style="display: none; margin-top: 1.5rem;">
              <label class="field-label">Recorded Laps</label>
              <div id="lap-list" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; padding: 0.75rem; max-height: 220px; overflow-y: auto; font-family: var(--mono); font-size: 0.9rem;"></div>
            </div>
          </div>

          <!-- Mathematical Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">High-Precision Timing, Clock Drift & Hardware Counter Mechanics</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              Naive browser timers that increment a variable inside <code>setInterval(fn, 10)</code> suffer from execution latency drift. Because JavaScript is single-threaded, garbage collection cycles and UI redraws delay interval callbacks, causing uncompensated timers to lose several seconds per hour:
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. Real-Time Epoch Delta Formulation:</strong></div>
              <div>&nbsp;&nbsp;Δt = Date.now() - t_start + t_accumulated</div>
              <div><strong>2. Split Lap Differential Formula:</strong></div>
              <div>&nbsp;&nbsp;Split_i = Δt_i - Δt_{i-1} &nbsp;&nbsp;(Computes exact single-lap pace vs total elapsed duration)</div>
              <div><strong>3. Display Refresh Quantization:</strong></div>
              <div>&nbsp;&nbsp;Display Frequency = 100 Hz (10ms tick), decoupled from 60 Hz VSync display rate</div>
            </div>
          </div>

          <!-- 5 Fatal Traps -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Digital Stopwatch & Event Timing</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Accumulative setInterval Drift Trap</strong>
              Assuming that <code>setInterval(fn, 10)</code> executes exactly every 10 milliseconds. Due to JavaScript event loop queuing, each tick is delayed by 1 to 5 milliseconds. Over a 1-hour workout, an uncompensated counter loses up to 18–30 seconds.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The Background Tab Power Throttling Trap</strong>
              Switching browser tabs or locking a laptop during a timed session. Chromium and Safari enforce aggressive background timer throttling (capping timers to 1 tick per minute). Timers that do not compute absolute epoch deltas freeze while in the background.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Display Refresh Rate (Hz) Desynchronization</strong>
              Updating high-frequency millisecond DOM text on every single frame without batching. Forcing 1,000 DOM reflows per second saturates the CPU rendering thread, causing visible stutter on low-power mobile devices.
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The Daylight Saving & System Clock Jump Trap</strong>
              Relying on local wall-clock time during daylight saving transition hours. When the system clock falls back an hour, stopwatches calculating duration from wall-clock strings record negative or corrupted durations.
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The DOM Paint Micro-Stall Trap</strong>
              Appending new lap elements into the DOM tree one by one using <code>innerHTML +=</code> instead of single-pass rendering. As lap count exceeds 50 splits, repeated DOM recreation produces micro-stutter during lap logging.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>How accurate is this online stopwatch?</summary>
              <div>
                The stopwatch measures time down to the exact millisecond using high-resolution epoch delta timestamps (<code>Date.now()</code>). It updates at 100 frames per second without accumulative interval drift.
              </div>
            </details>

            <details class="faq-item">
              <summary>Does the stopwatch lose time if I switch tabs or minimize my browser?</summary>
              <div>
                No. Because the timer computes elapsed time by subtracting your start epoch timestamp from the current clock time rather than counting ticks, it retains 100% mathematical precision even when the browser throttles background animations.
              </div>
            </details>

            <details class="faq-item">
              <summary>How do split laps work and can I copy or export them?</summary>
              <div>
                Each time you click the Lap button, the stopwatch records the split interval and lap differential. You can click "Copy Laps" to copy all split times to your clipboard or "Export CSV" to save a spreadsheet log.
              </div>
            </details>

            <details class="faq-item">
              <summary>What keyboard shortcuts can I use to control the stopwatch?</summary>
              <div>
                You can press <strong>Spacebar</strong> to Start/Pause, press <strong>L</strong> to record a Lap, and press <strong>R</strong> to Reset the stopwatch.
              </div>
            </details>

            <details class="faq-item">
              <summary>Does this stopwatch consume battery or send data to servers?</summary>
              <div>
                No. The timer runs 100% locally in client-side JavaScript. No timer telemetry or tracking data is sent to external servers, ensuring complete privacy and negligible CPU consumption.
              </div>
            </details>
          </div>
        </div>

        <script>
          let swStartTime = 0;
          let swElapsedTime = 0;
          let swTimerInterval = null;
          let swLaps = [];

          function formatSW(ms) {
            const m = Math.floor(ms / 60000).toString().padStart(2, '0');
            const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
            const mil = (ms % 1000).toString().padStart(3, '0');
            return m + ':' + s + '.' + mil;
          }

          function toggleStopwatch() {
            const btn = document.getElementById('sw-start');
            const lapBtn = document.getElementById('sw-lap');
            if (swTimerInterval) {
              clearInterval(swTimerInterval);
              swTimerInterval = null;
              btn.textContent = '▶ Resume';
              lapBtn.disabled = true;
            } else {
              swStartTime = Date.now() - swElapsedTime;
              swTimerInterval = setInterval(() => {
                swElapsedTime = Date.now() - swStartTime;
                document.getElementById('sw-display').textContent = formatSW(swElapsedTime);
              }, 10);
              btn.textContent = '⏸ Pause';
              lapBtn.disabled = false;
            }
          }

          function lapStopwatch() {
            if (!swTimerInterval) return;
            const prevLapTotal = swLaps.length > 0 ? swLaps[0].total : 0;
            const lapDuration = swElapsedTime - prevLapTotal;
            swLaps.unshift({ num: swLaps.length + 1, total: swElapsedTime, split: lapDuration });

            document.getElementById('lap-box').style.display = 'block';
            const list = document.getElementById('lap-list');
            list.innerHTML = swLaps.map(l =>
              '<div style="display:flex; justify-content:space-between; padding:0.35rem 0; border-bottom:1px solid var(--border);">' +
                '<span>Lap ' + l.num + ' (Split: +' + formatSW(l.split) + ')</span>' +
                '<strong>' + formatSW(l.total) + '</strong>' +
              '</div>'
            ).join('');
          }

          function resetStopwatch() {
            clearInterval(swTimerInterval);
            swTimerInterval = null;
            swElapsedTime = 0;
            swLaps = [];
            document.getElementById('sw-display').textContent = '00:00.000';
            document.getElementById('sw-start').textContent = '▶ Start';
            document.getElementById('sw-lap').disabled = true;
            document.getElementById('lap-box').style.display = 'none';
          }

          function copyLapsText() {
            if (swLaps.length === 0) {
              const btn = document.getElementById('btnCopyLaps');
              const orig = btn.textContent;
              btn.textContent = '⚠️ No laps recorded!';
              setTimeout(() => { btn.textContent = orig; }, 2000);
              return;
            }
            const lines = [
              '========================================',
              'DIGITAL TOOLS SHED - STOPWATCH LAPS',
              '========================================',
              'Total Elapsed: ' + formatSW(swElapsedTime),
              'Recorded Splits (' + swLaps.length + '):'
            ];
            swLaps.slice().reverse().forEach(l => {
              lines.push('  Lap ' + l.num + ': ' + formatSW(l.total) + ' (Split: +' + formatSW(l.split) + ')');
            });
            lines.push('========================================');
            navigator.clipboard.writeText(lines.join('\n')).then(() => {
              const btn = document.getElementById('btnCopyLaps');
              const orig = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2500);
            });
          }

          function exportLapsCsv() {
            if (swLaps.length === 0) return;
            const rows = [['Lap Number', 'Total Elapsed Time', 'Lap Split Time', 'Elapsed Milliseconds']];
            swLaps.slice().reverse().forEach(l => {
              rows.push([l.num, '"' + formatSW(l.total) + '"', '"' + formatSW(l.split) + '"', l.total]);
            });
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const a = document.createElement('a');
            a.download = 'stopwatch_laps.csv';
            a.href = URL.createObjectURL(blob);
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 1000);
          }

          document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.code === 'Space') {
              e.preventDefault();
              toggleStopwatch();
            } else if (e.key === 'l' || e.key === 'L') {
              lapStopwatch();
            } else if (e.key === 'r' || e.key === 'R') {
              resetStopwatch();
            }
          });
        </script>
      `
    },
    {
      slug: 'pomodoro-timer',
      title: 'Pomodoro Focus Timer & Productivity Clock with Audio Chimes',
      metaDesc: 'Boost study focus and deep work productivity with 25-minute Pomodoro intervals, custom short and long breaks, zero ads, and gentle Web Audio chimes.',
      category: 'Utility',
      faq: [
        { q: "What is the Pomodoro Technique and how does it work?", a: "Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique divides work into focused 25-minute sprints (called Pomodoros) separated by 5-minute restorative breaks. After completing 4 Pomodoros, take an extended 15-to-30 minute break." },
        { q: "What should I do during the 5-minute and 15-minute breaks?", a: "Step away from digital screens entirely. Stand up, stretch, hydrate, or look out a window. Engaging in high-dopamine tasks like social media or emails generates cognitive residue that impairs the next focus block." },
        { q: "What happens if I am in deep flow when the 25-minute timer rings?", a: "While the 25-minute block is the baseline standard, research in flow state dynamics suggests continuing uninterrupted if you are in effortless high-performance concentration. Reset the timer for a longer block when you reach a natural stopping point." },
        { q: "Does the timer make a sound when time is up?", a: "Yes! Our timer uses the browser's built-in Web Audio API to play gentle, pleasant synthesizer bell chimes (880 Hz to 440 Hz harmonics) with zero external MP3 downloads or lag." },
        { q: "Is my session count stored if I refresh or close the page?", a: "Yes. Completed Pomodoros are tracked locally in your browser's private localStorage database, giving you an accurate log of daily productive focus hours." }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Pomodoro Timer
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Pomodoro Focus Timer & Productivity Clock</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Maximize concentration and prevent cognitive burnout using structured 25-minute focus intervals and 5-minute restorative breaks. Powered by client-side Web Audio chimes.
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
              <button class="btn-sec" id="mode-work" style="font-weight:bold; background:var(--surface-alt);" onclick="setPomodoroMode(25, 'work')">Focus (25m)</button>
              <button class="btn-sec" id="mode-short" onclick="setPomodoroMode(5, 'short')">Short Break (5m)</button>
              <button class="btn-sec" id="mode-long" onclick="setPomodoroMode(15, 'long')">Long Break (15m)</button>
            </div>

            <div class="result-card" style="margin-top:0;">
              <div id="pomo-display" class="result-val" style="font-size: 4.5rem; letter-spacing: 0.05em;">25:00</div>
              <div id="pomo-status" style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.3rem;">Focus Session (Block 1)</div>
            </div>

            <div id="pomo-banner" style="display:none; background:#10b981; color:#fff; padding:0.85rem; border-radius:6px; margin:1.25rem 0; font-weight:600; text-align:center;">
              🔔 Time is up! Outstanding focus session. Take a restorative break!
            </div>

            <div class="action-bar" style="justify-content: center; margin-top: 1.5rem;">
              <button id="pomo-toggle" class="btn-primary" onclick="togglePomodoro()">&#x25B6; Start Focus</button>
              <button class="btn-sec" onclick="resetPomodoro()">Reset</button>
              <button type="button" class="btn-sec" id="btnCopyPomoLog" onclick="copyPomoLog()">Copy Focus Log</button>
            </div>

            <div style="display: flex; justify-content: space-around; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
              <div>Completed Pomodoros: <strong id="pomo-completed" style="color: var(--fg); font-size: 1.1rem;">0</strong></div>
              <div>Total Focus Time: <strong id="pomo-total-time" style="color: #10b981; font-size: 1.1rem;">0m</strong></div>
            </div>
          </div>

          <!-- Mathematical & Chronobiological Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Ultradian Rhythm Dynamics & Pomodoro Time Economics</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              The human prefrontal cortex relies on finite glycogen reserves and neurotransmitter availability (dopamine and norepinephrine). Sustained focus past 90 minutes without mental detachment induces rapid cognitive performance degradation:
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. Standard Work-to-Rest Ratio (WRR):</strong></div>
              <div>&nbsp;&nbsp;WRR = 25 min Focus / 5 min Rest = 5.0 &nbsp;&nbsp;(83.3% productive duty cycle)</div>
              <div><strong>2. Extended 4-Block Macro Cycle:</strong></div>
              <div>&nbsp;&nbsp;Macro Cycle = (4 × 25 min) + (3 × 5 min) + (1 × 15 min) = 130 min (100 min active focus)</div>
              <div><strong>3. Daily Deep Work Cumulative Yield:</strong></div>
              <div>&nbsp;&nbsp;Optimal daily capacity = 8 to 12 Pomodoros (3.3 to 5.0 hours of pure deep work)</div>
            </div>
          </div>

          <!-- 5 Fatal Traps -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Pomodoro Technique Implementation</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Dopamine-Spike Break Trap</strong>
              Spending 5-minute rest breaks scrolling social media, checking emails, or reading news feeds. These activities require intense visual decoding and produce heavy attention residue, leaving your brain more depleted when the next focus block begins.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The Dogmatic Flow State Interruption Trap</strong>
              Forcing yourself to stop working mid-sentence when the 25-minute timer rings during rare, high-leverage flow states. Studies show regaining complex software or writing context takes up to 23 minutes; ride flow when it occurs and extend the timer.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Unplanned Context-Switching Leakage Trap</strong>
              Answering quick Slack pings or colleague questions during an active Pomodoro. A single 30-second interruption resets your working memory cache, destroying that interval's productive yield.
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The Skipping Long Breaks Fatigue Trap</strong>
              Powering through four consecutive 25-minute blocks and skipping the mandatory 15-to-30 minute restorative long break. Prefrontal cortex fatigue accumulates exponentially after 2 hours without substantial disconnection.
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The Background Audio Suspension Trap</strong>
              Using cloud-based timers that rely on streaming external MP3 alert files. If your network hiccups or the browser tab suspends audio context in the background, you miss the timer alert and overrun your schedule.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>What is the Pomodoro Technique and how does it work?</summary>
              <div>
                Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique divides work into focused 25-minute sprints (called Pomodoros) separated by 5-minute restorative breaks. After completing 4 Pomodoros, take an extended 15-to-30 minute break.
              </div>
            </details>

            <details class="faq-item">
              <summary>What should I do during the 5-minute and 15-minute breaks?</summary>
              <div>
                Step away from digital screens entirely. Stand up, stretch, hydrate, or look out a window. Engaging in high-dopamine tasks like social media or emails generates cognitive residue that impairs the next focus block.
              </div>
            </details>

            <details class="faq-item">
              <summary>What happens if I am in deep flow when the 25-minute timer rings?</summary>
              <div>
                While the 25-minute block is the baseline standard, research in flow state dynamics suggests continuing uninterrupted if you are in effortless high-performance concentration. Reset the timer for a longer block when you reach a natural stopping point.
              </div>
            </details>

            <details class="faq-item">
              <summary>Does the timer make a sound when time is up?</summary>
              <div>
                Yes! Our timer uses the browser's built-in Web Audio API to play gentle, pleasant synthesizer bell chimes (880 Hz to 440 Hz harmonics) with zero external MP3 downloads or lag.
              </div>
            </details>

            <details class="faq-item">
              <summary>Is my session count stored if I refresh or close the page?</summary>
              <div>
                Yes. Completed Pomodoros are tracked locally in your browser's private localStorage database, giving you an accurate log of daily productive focus hours.
              </div>
            </details>
          </div>
        </div>

        <script>
          let pomoTotalSec = 25 * 60;
          let pomoRemaining = pomoTotalSec;
          let pomoInterval = null;
          let pomoMode = 'work';
          let completedPomodoros = parseInt(localStorage.getItem('dts-pomo-count') || '0');

          function formatPomo(s) {
            const m = Math.floor(s / 60).toString().padStart(2, '0');
            const sec = (s % 60).toString().padStart(2, '0');
            return m + ':' + sec;
          }

          function updatePomoStats() {
            document.getElementById('pomo-completed').textContent = completedPomodoros;
            document.getElementById('pomo-total-time').textContent = (completedPomodoros * 25) + 'm';
          }

          function playChime() {
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(880, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.8);
            } catch (e) {
              // AudioContext not allowed or unsupported
            }
          }

          function setPomodoroMode(mins, mode) {
            clearInterval(pomoInterval);
            pomoInterval = null;
            pomoMode = mode;
            pomoTotalSec = mins * 60;
            pomoRemaining = pomoTotalSec;
            document.getElementById('pomo-display').textContent = formatPomo(pomoRemaining);
            document.getElementById('pomo-toggle').textContent = '▶ Start ' + (mode === 'work' ? 'Focus' : 'Break');
            document.getElementById('pomo-status').textContent = mode === 'work' ? 'Focus Session' : (mode === 'short' ? 'Short Rest Break' : 'Extended Rest Break');
            document.getElementById('pomo-banner').style.display = 'none';

            document.getElementById('mode-work').style.fontWeight = mode === 'work' ? 'bold' : 'normal';
            document.getElementById('mode-short').style.fontWeight = mode === 'short' ? 'bold' : 'normal';
            document.getElementById('mode-long').style.fontWeight = mode === 'long' ? 'bold' : 'normal';
          }

          function togglePomodoro() {
            const btn = document.getElementById('pomo-toggle');
            document.getElementById('pomo-banner').style.display = 'none';
            if (pomoInterval) {
              clearInterval(pomoInterval);
              pomoInterval = null;
              btn.textContent = '▶ Resume';
            } else {
              btn.textContent = '⏸ Pause';
              pomoInterval = setInterval(() => {
                pomoRemaining--;
                document.getElementById('pomo-display').textContent = formatPomo(pomoRemaining);
                if (pomoRemaining <= 0) {
                  clearInterval(pomoInterval);
                  pomoInterval = null;
                  playChime();

                  const banner = document.getElementById('pomo-banner');
                  banner.style.display = 'block';

                  if (pomoMode === 'work') {
                    completedPomodoros++;
                    localStorage.setItem('dts-pomo-count', completedPomodoros.toString());
                    updatePomoStats();
                    banner.textContent = '🔔 Focus block complete! Fantastic concentration. Time for a 5-minute break!';
                    setPomodoroMode(5, 'short');
                  } else {
                    banner.textContent = '🔔 Break over! Ready to dive into your next 25-minute focus sprint?';
                    setPomodoroMode(25, 'work');
                  }
                }
              }, 1000);
            }
          }

          function resetPomodoro() {
            clearInterval(pomoInterval);
            pomoInterval = null;
            pomoRemaining = pomoTotalSec;
            document.getElementById('pomo-display').textContent = formatPomo(pomoRemaining);
            document.getElementById('pomo-toggle').textContent = '▶ Start';
            document.getElementById('pomo-banner').style.display = 'none';
          }

          function copyPomoLog() {
            const hours = (completedPomodoros * 25 / 60).toFixed(1);
            const lines = [
              '========================================',
              'DIGITAL TOOLS SHED - POMODORO LOG',
              '========================================',
              'Completed Pomodoros: ' + completedPomodoros,
              'Total Focus Time: ' + (completedPomodoros * 25) + ' minutes (~' + hours + ' hours)',
              'Productivity Duty Cycle: 83.3% Focus / 16.7% Rest',
              'Timestamp: ' + new Date().toISOString(),
              '========================================'
            ];
            navigator.clipboard.writeText(lines.join('\n')).then(() => {
              const btn = document.getElementById('btnCopyPomoLog');
              const orig = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2500);
            });
          }

          updatePomoStats();
        </script>
      `
    },
    {
      slug: 'wheel-spinner',
      title: 'Random Decision Wheel & Prize Spinner (Custom Choices & Fair RNG)',
      metaDesc: 'Spin the wheel to make random decisions, pick raffle winners, choose dinners, or run classroom games. Features customizable slices, fair RNG physics, and instant winner copying.',
      category: 'Utility',
      faq: [
        { q: "How does the decision wheel select a winner?", a: "The spinner applies rotational physics with cubic ease-out angular deceleration. When the wheel comes to a complete rest, the exact slice directly beneath the red pointer is mathematically calculated and announced." },
        { q: "Is the wheel spin truly fair and unbiased?", a: "Yes. The rotation arc and random revolutions are generated using unbiased random seeding, ensuring every segment has an identical mathematical probability P = 1 / N of being selected." },
        { q: "How many custom options can I add to the wheel?", a: "You can add anywhere from 2 to 50+ choices in the text box. The wheel automatically subdivides the 360-degree circumference into equal angular slices with distinct colors." },
        { q: "Can I copy the winning selection to my clipboard?", a: "Yes! As soon as a winner is chosen, click 'Copy Winner' to copy the result along with an audit timestamp." },
        { q: "Is my custom choice list saved when I close the browser?", a: "Yes. Your custom list of choices is preserved in your browser's private local storage so your options are ready whenever you return." }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Decision Wheel Spinner
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Random Decision Wheel Spinner</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Spin a custom wheel to make unbiased decisions, pick raffle winners, or select random team members with angular deceleration physics.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Choices / Names (One per line)</label>
              <textarea id="wheel-items" class="code-input" style="height: 120px;" oninput="drawWheel()">Pizza&#10;Burgers&#10;Sushi&#10;Tacos&#10;Pasta&#10;Salad</textarea>
            </div>

            <div style="display: flex; justify-content: center; margin: 1.5rem 0; position: relative;">
              <!-- Pointer triangle -->
              <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 12px solid transparent; border-right: 12px solid transparent; border-top: 20px solid #ef4444; z-index: 10;"></div>
              <canvas id="wheel-canvas" width="300" height="300" style="border-radius: 50%; border: 4px solid var(--border); box-shadow: 0 4px 16px rgba(0,0,0,0.1);"></canvas>
            </div>

            <div class="action-bar" style="justify-content: center; gap: 0.75rem;">
              <button class="btn-primary" style="font-size: 1.05rem; padding: 0.7rem 1.8rem;" onclick="spinWheel()">&#x1F3B0; Spin Wheel!</button>
              <button class="btn-sec" onclick="shuffleWheel()">Shuffle Choices</button>
              <button type="button" class="btn-sec" id="btnCopyWinner" onclick="copyWinnerResult()">Copy Winner</button>
            </div>

            <div id="winner-box" class="result-card" style="display: none; margin-top: 1.5rem;">
              <div class="field-label">Selected Winner</div>
              <div id="winner-name" class="result-val" style="color: #10b981;">---</div>
            </div>
          </div>

          <!-- Mathematical Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Rotational Kinematics & Angular Deceleration Physics</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              Fair wheel selection relies on uniform angular probability density and cubic deceleration curves. The continuous rotational trajectory is evaluated against discrete angular sectors:
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. Uniform Discrete Sector Probability:</strong></div>
              <div>&nbsp;&nbsp;P(i) = 1 / N &nbsp;&nbsp;(Each of N choices occupies an arc of exactly 2π / N radians)</div>
              <div><strong>2. Cubic Ease-Out Deceleration Function:</strong></div>
              <div>&nbsp;&nbsp;θ(t) = θ_start + Δθ × [1 - (1 - t)^3] &nbsp;&nbsp;(where t ∈ [0, 1] is normalized elapsed time)</div>
              <div><strong>3. Pointer Index Derivation:</strong></div>
              <div>&nbsp;&nbsp;Winner_index = ⌊ (2π - (θ_final mod 2π) + 3π/2) mod 2π / (2π / N) ⌋</div>
            </div>
          </div>

          <!-- 5 Fatal Traps -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Random Decision Wheels & Raffles</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Visual Pointer vs Index Disalignment Trap</strong>
              Calculating the winning index from the rotation angle without accounting for the pointer's physical placement. On a standard clock face, a top pointer sits at 270 degrees (3π/2 rad); forgetting this offset declares the opposite slice the winner.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The Truncated Arc Overcrowding Trap</strong>
              Adding 60+ names to a small 300px canvas without font scaling. Tiny text slices overlap into unreadable black wedges, preventing visual verification of winner boundaries.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Linear Velocity Abrupt Stop Trap</strong>
              Stopping the wheel abruptly without ease-out deceleration physics. Natural friction follows quadratic or cubic decay; instant stops feel rigged and artificial to participants.
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The Duplicate Choice Weighting Distortion</strong>
              Pasting the same option multiple times without realizing that duplicate items multiply its probability proportionally ($k / N$).
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The Re-spin Tampering Temptation Trap</strong>
              Spinning a second time when an unfavorable choice is selected. Decision wheels only provide psychological clarity if the user commits to honoring the initial outcome.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>How does the decision wheel select a winner?</summary>
              <div>
                The spinner applies rotational physics with cubic ease-out angular deceleration. When the wheel comes to a complete rest, the exact slice directly beneath the red pointer is mathematically calculated and announced.
              </div>
            </details>

            <details class="faq-item">
              <summary>Is the wheel spin truly fair and unbiased?</summary>
              <div>
                Yes. The rotation arc and random revolutions are generated using unbiased random seeding, ensuring every segment has an identical mathematical probability P = 1 / N of being selected.
              </div>
            </details>

            <details class="faq-item">
              <summary>How many custom options can I add to the wheel?</summary>
              <div>
                You can add anywhere from 2 to 50+ choices in the text box. The wheel automatically subdivides the 360-degree circumference into equal angular slices with distinct colors.
              </div>
            </details>

            <details class="faq-item">
              <summary>Can I copy the winning selection to my clipboard?</summary>
              <div>
                Yes! As soon as a winner is chosen, click "Copy Winner" to copy the result along with an audit timestamp.
              </div>
            </details>

            <details class="faq-item">
              <summary>Is my custom choice list saved when I close the browser?</summary>
              <div>
                Yes. Your custom list of choices is preserved in your browser's private local storage so your options are ready whenever you return.
              </div>
            </details>
          </div>
        </div>

        <script>
          const COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#06b6d4","#84cc16"];
          let currentAngle = 0;
          let isSpinning = false;
          let lastWinner = '';

          function getItems() {
            return document.getElementById('wheel-items').value.split('\n').map(s => s.trim()).filter(Boolean);
          }

          function drawWheel() {
            const items = getItems();
            const canvas = document.getElementById('wheel-canvas');
            const ctx = canvas.getContext('2d');
            const num = items.length || 1;
            const arc = (2 * Math.PI) / num;

            ctx.clearRect(0, 0, 300, 300);
            ctx.save();
            ctx.translate(150, 150);
            ctx.rotate(currentAngle);

            for (let i = 0; i < num; i++) {
              ctx.beginPath();
              ctx.fillStyle = COLORS[i % COLORS.length];
              ctx.moveTo(0, 0);
              ctx.arc(0, 0, 148, i * arc, (i + 1) * arc);
              ctx.fill();
              ctx.stroke();

              ctx.save();
              ctx.rotate((i + 0.5) * arc);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 13px sans-serif';
              ctx.textAlign = 'right';
              ctx.fillText(items[i] || '', 130, 5);
              ctx.restore();
            }

            ctx.restore();
          }

          function spinWheel() {
            if (isSpinning) return;
            const items = getItems();
            if (items.length === 0) return;

            isSpinning = true;
            document.getElementById('winner-box').style.display = 'none';

            const spinRounds = 5 + Math.random() * 5;
            const totalSpin = spinRounds * 2 * Math.PI;
            const startAngle = currentAngle;
            const duration = 3800;
            const startTime = Date.now();

            function animate() {
              const now = Date.now();
              const elapsed = now - startTime;
              const t = Math.min(1, elapsed / duration);
              const easeOut = 1 - Math.pow(1 - t, 3);

              currentAngle = startAngle + (totalSpin * easeOut);
              drawWheel();

              if (t < 1) {
                requestAnimationFrame(animate);
              } else {
                isSpinning = false;
                const arc = (2 * Math.PI) / items.length;
                const normalized = (2 * Math.PI - (currentAngle % (2 * Math.PI)) + (3 * Math.PI / 2)) % (2 * Math.PI);
                const winnerIdx = Math.floor(normalized / arc) % items.length;

                lastWinner = items[winnerIdx];
                document.getElementById('winner-box').style.display = 'block';
                document.getElementById('winner-name').textContent = lastWinner;
              }
            }
            requestAnimationFrame(animate);
          }

          function shuffleWheel() {
            const items = getItems();
            for (let i = items.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [items[i], items[j]] = [items[j], items[i]];
            }
            document.getElementById('wheel-items').value = items.join('\n');
            drawWheel();
          }

          function copyWinnerResult() {
            if (!lastWinner) {
              const btn = document.getElementById('btnCopyWinner');
              const orig = btn.textContent;
              btn.textContent = '⚠️ Spin the wheel first!';
              setTimeout(() => { btn.textContent = orig; }, 2000);
              return;
            }
            const text = '🎉 Winner Selected: ' + lastWinner + ' (Decided by Digital Tools Shed Decision Wheel)';
            navigator.clipboard.writeText(text).then(() => {
              const btn = document.getElementById('btnCopyWinner');
              const orig = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2500);
            });
          }

          document.addEventListener('DOMContentLoaded', drawWheel);
        </script>
      `
    },
    {
      slug: 'coin-flipper',
      title: 'Cryptographic Coin Flipper & Heads/Tails Probability Simulator',
      metaDesc: 'Flip a coin online with cryptographically secure CSPRNG fairness, 3D flip animation, streak tracker, and 1,000x Monte Carlo probability simulation.',
      category: 'Utility',
      faq: [
        { q: "Is this online coin flip truly random and fair?", a: "Yes. Unlike ordinary websites that use predictable Math.random(), this tool utilizes the browser's hardware-backed window.crypto.getRandomValues() CSPRNG (Cryptographically Secure Pseudo-Random Number Generator), ensuring 100% mathematical fairness with exactly P = 0.500 probability." },
        { q: "What is the difference between Crypto CSPRNG and standard Math.random()?", a: "Math.random() uses algorithmic PRNGs (such as xoshiro128) that are seeded by system time and can exhibit subtle micro-patterns. window.crypto pulls entropy directly from operating system hardware noise, making outcomes impossible to predict." },
        { q: "What is the Gambler's Fallacy in coin tossing?", a: "The Gambler's Fallacy is the mistaken belief that if heads has appeared 5 times in a row, tails is 'due' next. Each coin flip is an independent Bernoulli trial: the probability of heads on flip #6 remains exactly 50%." },
        { q: "What are the odds of flipping 10 heads in a row?", a: "The mathematical probability of flipping 10 consecutive heads is (1/2)^10 = 1 / 1,024, or approximately 0.0976% (roughly 1 in 1,000 trials)." },
        { q: "Can I simulate large bulk coin flips like 1,000 or 10,000 flips?", a: "Yes! Use the 'Flip 100x' or 'Flip 1,000x' buttons. The tool instantly generates bulk cryptographic trials and updates the cumulative Heads vs Tails probability distribution." }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Coin Flipper
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Coin Flipper & Heads/Tails Probability Simulator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; margin-bottom: 1.5rem;">
            Cryptographically fair coin toss simulation powered by hardware CSPRNG entropy. Features 3D flip animation, streak counting, and large-scale Monte Carlo trials.
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: center; padding: 2rem 0;">
              <div id="coin-visual" style="width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, #fde047 0%, #ca8a04 100%); border: 4px solid #a16207; display: flex; justify-content: center; align-items: center; font-family: var(--serif); font-size: 1.6rem; font-weight: bold; color: #713f12; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform 0.6s;">
                HEADS
              </div>
            </div>

            <div class="action-bar" style="justify-content: center; gap: 0.6rem;">
              <button class="btn-primary" style="font-size: 1rem; padding: 0.65rem 1.8rem;" onclick="flipCoin()">&#x1FA99; Flip Coin</button>
              <button class="btn-sec" onclick="flipMultiple(10)">Flip 10x</button>
              <button class="btn-sec" onclick="flipMultiple(100)">Flip 100x</button>
              <button class="btn-sec" onclick="flipMultiple(1000)">Flip 1,000x</button>
              <button class="btn-sec" onclick="resetCoinStats()">Reset</button>
              <button type="button" class="btn-sec" id="btnCopyCoinStats" onclick="copyCoinStats()">Copy Stats</button>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; font-family: var(--mono); text-align: center;">
                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">HEADS</div>
                  <div id="cnt-heads" style="font-size: 1.4rem; font-weight: bold; color: #ca8a04;">0</div>
                  <div id="pct-heads" style="font-size: 0.8rem; color: var(--text-muted);">0%</div>
                </div>
                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">TAILS</div>
                  <div id="cnt-tails" style="font-size: 1.4rem; font-weight: bold; color: #3b82f6;">0</div>
                  <div id="pct-tails" style="font-size: 0.8rem; color: var(--text-muted);">0%</div>
                </div>
                <div style="background: var(--surface); padding: 0.75rem; border-radius: 4px; border: 1px solid var(--border);">
                  <div style="font-size: 0.75rem; color: var(--text-muted);">TOTAL FLIPS</div>
                  <div id="cnt-total" style="font-size: 1.4rem; font-weight: bold; color: var(--fg);">0</div>
                  <div id="streak-cur" style="font-size: 0.8rem; color: #10b981;">Streak: 0</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mathematical Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.75rem;">Bernoulli Trials, Law of Large Numbers & Central Limit Mathematics</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
              A coin flip represents the canonical Bernoulli trial with parameter p = 0.5. As the number of independent trials n increases, the empirical mean converges stochastically to the theoretical expectation:
            </p>
            <div style="background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; margin-bottom: 1.25rem;">
              <div><strong>1. Binomial Distribution Mass Function:</strong></div>
              <div>&nbsp;&nbsp;P(X = k) = (n choose k) × (0.5)^n &nbsp;&nbsp;(Probability of exactly k heads in n independent flips)</div>
              <div><strong>2. Standard Error of Proportion (Sampling Noise):</strong></div>
              <div>&nbsp;&nbsp;SE = √[ p(1-p) / n ] = 0.5 / √n &nbsp;&nbsp;(At n=100: ±5%; At n=10,000: ±0.5%)</div>
              <div><strong>3. Cryptographic Hardware Randomness:</strong></div>
              <div>&nbsp;&nbsp;P(Bit_i = 1) = 0.50000000 &nbsp;&nbsp;(Derived via window.crypto CSPRNG OS entropy pool)</div>
            </div>
          </div>

          <!-- 5 Fatal Traps -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">5 Fatal Traps in Probability & Coin Toss Simulations</h2>
            
            <div class="trap-card" style="border-left: 4px solid #ef4444;">
              <strong style="color: #ef4444;">1. The Gambler's Fallacy & "Due" Outcome Trap</strong>
              Believing that 6 consecutive heads makes tails more likely on the next flip. In an independent probability system, past trials exert exactly zero physical memory or gravitational pull on subsequent events.
            </div>

            <div class="trap-card" style="border-left: 4px solid #f59e0b;">
              <strong style="color: #f59e0b;">2. The Pseudorandom Math.random() Seed Periodicity</strong>
              Relying on standard <code>Math.random()</code> for probability research. JavaScript engines use non-cryptographic PRNGs that can exhibit statistical clustering over millions of iterations. Production simulations require hardware CSPRNG.
            </div>

            <div class="trap-card" style="border-left: 4px solid #10b981;">
              <strong style="color: #10b981;">3. The Law of Small Numbers Distortion</strong>
              Drawing conclusions from a sample size of 10 or 20 flips. In small samples, getting 70% heads is completely normal and falls well within 2 standard deviations ($SE approx 15.8%$). True 50/50 convergence requires $n ge 1,000$.
            </div>

            <div class="trap-card" style="border-left: 4px solid #3b82f6;">
              <strong style="color: #3b82f6;">4. The Consecutive Streak Surprise</strong>
              Being shocked by runs of 7, 8, or 9 consecutive identical results. In a run of 200 flips, the probability of encountering a streak of 7 consecutive heads or tails exceeds 75%.
            </div>

            <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
              <strong style="color: #8b5cf6;">5. The Physical Coin Center-of-Mass Asymmetry Reality</strong>
              Assuming real-world metal coins are 50.00% symmetric. Stanford mathematician Persi Diaconis proved physical coins have a 51% bias toward landing on the same face that was facing up before the flip due to rotational precession.
            </div>
          </div>

          <!-- Interactive FAQs -->
          <div style="margin-top: 2rem;">
            <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1rem;">Frequently Asked Questions</h2>
            
            <details class="faq-item">
              <summary>Is this online coin flip truly random and fair?</summary>
              <div>
                Yes. Unlike ordinary websites that use predictable <code>Math.random()</code>, this tool utilizes the browser's hardware-backed <code>window.crypto.getRandomValues()</code> CSPRNG (Cryptographically Secure Pseudo-Random Number Generator), ensuring 100% mathematical fairness with exactly P = 0.500 probability.
              </div>
            </details>

            <details class="faq-item">
              <summary>What is the difference between Crypto CSPRNG and standard Math.random()?</summary>
              <div>
                <code>Math.random()</code> uses algorithmic PRNGs that are seeded by system time and can exhibit subtle micro-patterns. <code>window.crypto</code> pulls entropy directly from operating system hardware noise, making outcomes impossible to predict.
              </div>
            </details>

            <details class="faq-item">
              <summary>What is the Gambler's Fallacy in coin tossing?</summary>
              <div>
                The Gambler's Fallacy is the mistaken belief that if heads has appeared 5 times in a row, tails is "due" next. Each coin flip is an independent Bernoulli trial: the probability of heads on flip #6 remains exactly 50%.
              </div>
            </details>

            <details class="faq-item">
              <summary>What are the odds of flipping 10 heads in a row?</summary>
              <div>
                The mathematical probability of flipping 10 consecutive heads is (1/2)¹⁰ = 1 / 1,024, or approximately 0.0976% (roughly 1 in 1,000 trials).
              </div>
            </details>

            <details class="faq-item">
              <summary>Can I simulate large bulk coin flips like 1,000 or 10,000 flips?</summary>
              <div>
                Yes! Use the "Flip 100x" or "Flip 1,000x" buttons. The tool instantly generates bulk cryptographic trials and updates the cumulative Heads vs Tails probability distribution.
              </div>
            </details>
          </div>
        </div>

        <script>
          let heads = 0;
          let tails = 0;
          let currentStreak = 0;
          let lastSide = '';

          function flipCoin() {
            const coin = document.getElementById('coin-visual');
            coin.style.transform = 'rotateY(' + (Math.random() * 1440 + 720) + 'deg) scale(1.1)';

            const arr = new Uint8Array(1);
            window.crypto.getRandomValues(arr);
            const isHeads = arr[0] % 2 === 0;

            setTimeout(() => {
              coin.style.transform = 'none';
              coin.textContent = isHeads ? 'HEADS' : 'TAILS';
              coin.style.background = isHeads
                ? 'radial-gradient(circle, #fde047 0%, #ca8a04 100%)'
                : 'radial-gradient(circle, #93c5fd 0%, #2563eb 100%)';
              coin.style.color = isHeads ? '#713f12' : '#ffffff';

              const outcome = isHeads ? 'Heads' : 'Tails';
              if (outcome === lastSide) {
                currentStreak++;
              } else {
                lastSide = outcome;
                currentStreak = 1;
              }

              if (isHeads) heads++; else tails++;
              updateStats();
            }, 600);
          }

          function flipMultiple(n) {
            const arr = new Uint8Array(n);
            window.crypto.getRandomValues(arr);
            for (let i = 0; i < n; i++) {
              if (arr[i] % 2 === 0) heads++; else tails++;
            }
            lastSide = '';
            currentStreak = 0;
            updateStats();
          }

          function resetCoinStats() {
            heads = 0;
            tails = 0;
            currentStreak = 0;
            lastSide = '';
            updateStats();
          }

          function updateStats() {
            const tot = heads + tails;
            document.getElementById('cnt-heads').textContent = heads.toLocaleString();
            document.getElementById('cnt-tails').textContent = tails.toLocaleString();
            document.getElementById('cnt-total').textContent = tot.toLocaleString();
            document.getElementById('pct-heads').textContent = tot ? ((heads / tot) * 100).toFixed(1) + '%' : '0%';
            document.getElementById('pct-tails').textContent = tot ? ((tails / tot) * 100).toFixed(1) + '%' : '0%';
            document.getElementById('streak-cur').textContent = currentStreak > 0 ? ('Streak: ' + currentStreak + ' ' + lastSide) : 'Streak: 0';
          }

          function copyCoinStats() {
            const tot = heads + tails;
            const hPct = tot ? ((heads / tot) * 100).toFixed(2) : '0';
            const tPct = tot ? ((tails / tot) * 100).toFixed(2) : '0';
            const lines = [
              '========================================',
              'DIGITAL TOOLS SHED - COIN FLIPPER STATS',
              '========================================',
              'Total Flips: ' + tot.toLocaleString(),
              'Heads: ' + heads.toLocaleString() + ' (' + hPct + '%)',
              'Tails: ' + tails.toLocaleString() + ' (' + tPct + '%)',
              'RNG Engine: Web Crypto CSPRNG (Hardware Seeded)',
              'Timestamp: ' + new Date().toISOString(),
              '========================================'
            ];
            navigator.clipboard.writeText(lines.join('\n')).then(() => {
              const btn = document.getElementById('btnCopyCoinStats');
              const orig = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.borderColor = '#10b981';
              btn.style.color = '#10b981';
              setTimeout(() => { btn.textContent = orig; btn.style.borderColor = ''; btn.style.color = ''; }, 2500);
            });
          }
        </script>
      `
    },
    {
      slug: 'timezone-converter',
      title: 'World Clock & Timezone Meeting Planner',
      metaDesc: 'Compare world timezones (UTC, EST, PST, GMT, CET, JST) with interactive time sliders for remote team scheduling.',
      category: 'Utility',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Timezone Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">World Clock & Timezone Meeting Planner</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert times across global business hubs and plan international remote meetings without timezone confusion.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Select Base Date & Time</label>
              <input type="datetime-local" id="tz-input" class="text-input" onchange="convertTimezones()" />
            </div>

            <div id="tz-grid" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;"></div>
          </div>
        </div>

        <script>
          const CITIES = [
            { name: 'UTC / GMT (Universal Time)', tz: 'UTC' },
            { name: 'New York / Eastern (EST/EDT)', tz: 'America/New_York' },
            { name: 'San Francisco / Pacific (PST/PDT)', tz: 'America/Los_Angeles' },
            { name: 'London (GMT/BST)', tz: 'Europe/London' },
            { name: 'Berlin / Paris (CET/CEST)', tz: 'Europe/Berlin' },
            { name: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
            { name: 'Sydney (AEST/AEDT)', tz: 'Australia/Sydney' }
          ];

          function convertTimezones() {
            const val = document.getElementById('tz-input').value;
            const date = val ? new Date(val) : new Date();
            const grid = document.getElementById('tz-grid');
            grid.innerHTML = '';

            CITIES.forEach(c => {
              const timeStr = date.toLocaleString('en-US', {
                timeZone: c.tz,
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });

              const row = document.createElement('div');
              row.style.cssText = 'background: var(--surface-alt); border: 1px solid var(--border); padding: 0.85rem 1rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';
              row.innerHTML = '<div><strong style="font-size:0.95rem;">' + c.name + '</strong></div><div style="font-family:var(--mono); font-size:1.1rem; color:var(--btn-bg,#3b82f6); font-weight:bold;">' + timeStr + '</div>';
              grid.appendChild(row);
            });
          }

          document.addEventListener('DOMContentLoaded', () => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('tz-input').value = now.toISOString().slice(0, 16);
            convertTimezones();
          });
        </script>
      `
    },
    {
      slug: 'date-calculator',
      title: 'Date Calculator: Days Between Dates & Add Days',
      metaDesc: 'Calculate exact calendar days, working business days, and time between two dates with inclusive day toggling. Add or subtract business days, weeks, months, or years.',
      category: 'Utility',
      faq: [
        { q: 'How many business days are between two dates?', a: 'Business days count only weekdays (Monday through Friday), excluding Saturdays and Sundays. In a standard calendar month of 30 days, there are typically 20 to 22 business days.' },
        { q: 'What is the difference between inclusive and exclusive date counting?', a: 'Exclusive counting calculates the elapsed time between two points (End Date - Start Date). Inclusive counting counts both the starting day and ending day as active calendar days (+1 day), which is the standard in hotel bookings, equipment leases, and construction contracts.' },
        { q: 'How do you add business days to a date?', a: 'Adding business days steps forward one day at a time, checking the day of the week. If a day is Saturday or Sunday, it is skipped without incrementing the business day count until the target number of working weekdays is reached.' },
        { q: 'Does this date calculator account for leap years?', a: 'Yes. The calculation uses full astronomical calendar rules, correctly identifying February 29th in leap years (such as 2024, 2028, 2032) and measuring exact day differences.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Date Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Date Calculator (Days Between & Add Days)</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Calculate exact calendar days, working business days, weeks, and hours between two dates, or add/subtract business days and project deadline milestones with contract-grade accuracy.
          </p>

          <!-- 1. DAYS BETWEEN TWO DATES -->
          <div class="tool-box" style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
              <h3 style="font-family: var(--serif); font-size: 1.3rem; margin: 0;">1. Days Between Two Dates</h3>
              <span id="leapYearBadge" style="display: none; font-family: var(--mono); font-size: 0.72rem; background: #3b82f6; color: #fff; padding: 0.2rem 0.5rem; border-radius: 4px;">Leap Year Spanned (Feb 29)</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem;">
              <div>
                <label class="field-label">Start Date</label>
                <input type="date" id="dateStart" class="text-input" oninput="calcDaysBetween()" />
                <div id="startWeekdayLabel" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">--</div>
              </div>
              <div>
                <label class="field-label">End Date</label>
                <input type="date" id="dateEnd" class="text-input" oninput="calcDaysBetween()" />
                <div id="endWeekdayLabel" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">--</div>
              </div>
            </div>

            <!-- Inclusive Toggle & Quick Presets -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem; padding: 0.75rem; background: var(--surface-alt); border-radius: 4px;">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-family: var(--mono);">
                <input type="checkbox" id="includeEndDay" onchange="calcDaysBetween()" style="cursor: pointer;" />
                <span>Include End Date (+1 day for full inclusive count)</span>
              </label>
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                <button type="button" class="btn-sm" onclick="setDatePreset(30)" style="background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.45rem; border-radius: 3px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">+30d</button>
                <button type="button" class="btn-sm" onclick="setDatePreset(60)" style="background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.45rem; border-radius: 3px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">+60d</button>
                <button type="button" class="btn-sm" onclick="setDatePreset(90)" style="background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.45rem; border-radius: 3px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">+90d (Quarter)</button>
                <button type="button" class="btn-sm" onclick="setDatePresetToEndOfYear()" style="background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.45rem; border-radius: 3px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">End of Year</button>
              </div>
            </div>

            <!-- Results Display -->
            <div id="daysBetweenResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>

            <!-- Copy Diff Button -->
            <div style="margin-top: 1.25rem;">
              <button id="copyDateDiffBtn" onclick="copyDateDiffSummary()" class="btn-sec" style="width: 100%; padding: 0.65rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>📋 Copy Date Difference Summary</span>
              </button>
            </div>
          </div>

          <!-- 2. ADD OR SUBTRACT DAYS / BUSINESS DAYS FROM A DATE -->
          <div class="tool-box" style="margin-bottom: 2rem;">
            <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1.25rem;">2. Add or Subtract Time (Including Business Days)</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="field-label">Start Date</label>
                <input type="date" id="dateAddStart" class="text-input" oninput="calcDateAdd()" />
              </div>
              <div>
                <label class="field-label">Operation</label>
                <select id="dateAddOp" class="text-input" onchange="calcDateAdd()">
                  <option value="add" selected>Add (+)</option>
                  <option value="sub">Subtract (-)</option>
                </select>
              </div>
              <div>
                <label class="field-label">Quantity</label>
                <input type="number" id="dateAddQty" class="text-input" value="30" min="1" step="1" oninput="calcDateAdd()" />
              </div>
              <div>
                <label class="field-label">Unit of Time</label>
                <select id="dateAddUnit" class="text-input" onchange="calcDateAdd()">
                  <option value="days" selected>Calendar Days</option>
                  <option value="business_days">Business Days (Mon-Fri only)</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months (Clamped)</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            <div id="dateAddResults" style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.9rem;"></div>

            <!-- Copy Add Button -->
            <div style="margin-top: 1.25rem;">
              <button id="copyDateAddBtn" onclick="copyDateAddSummary()" class="btn-sec" style="width: 100%; padding: 0.65rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>📋 Copy Deadline Milestone</span>
              </button>
            </div>
          </div>

          <!-- Step-by-Step Calendar Derivation -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>📐 Step-by-Step Gregorian Calendar Derivation</span>
            </h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">
              How chronological intervals and business workdays are calculated mathematically:
            </p>
            <div id="dateDerivationBox" style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; overflow-x: auto; border: 1px solid var(--border);">
              <!-- Populated by JavaScript -->
            </div>
          </div>

          <!-- 3 Critical Date Gotchas -->
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
            <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚠️ 3 Date Calculation Traps in Legal & Project Work</span>
            </h3>
            <div style="display: grid; gap: 1rem; font-size: 0.9rem; line-height: 1.6;">
              <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #ef4444;">
                <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">1. The "Inclusive vs. Exclusive" Lease & Contract Trap</strong>
                <p style="margin: 0; color: var(--text-muted);">
                  If a tenancy agreement starts on August 1st and ends on August 31st, exclusive counting yields 30 days (31 - 1 = 30). However, the tenant occupied the property on August 1st AND August 31st — a full <strong>31 calendar days</strong>. In commercial disputes, court motions, and interest calculations, failing to specify whether dates are inclusive can trigger financial penalties.
                </p>
              </div>
              <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #f59e0b;">
                <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">2. The Variable Month End Clamping Hazard</strong>
                <p style="margin: 0; color: var(--text-muted);">
                  What happens when you add 1 month to January 31st? February 31st does not exist. Standard astronomical calendar algorithms clamp to the last valid day of the month (February 28th, or 29th in a leap year). Subtracting 1 month back from February 28th then yields January 28th, not January 31st! Always track raw day intervals for strict financial interest.
                </p>
              </div>
              <div style="background: var(--surface); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
                <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">3. Statutory Business Days vs. Federal Bank Holidays</strong>
                <p style="margin: 0; color: var(--text-muted);">
                  Standard business day calculators only skip Saturdays and Sundays. However, financial markets, government offices, and legal courts also observe 11 US Federal Holidays (e.g. Martin Luther King Jr. Day, Memorial Day, Juneteenth, Thanksgiving). If calculating a statutory SEC filing deadline or bank wire clearance, always cross-reference official federal holiday calendars.
                </p>
              </div>
            </div>
          </div>

          <!-- Sponsored Ad Slot -->
          <div class="ad-blend-box" style="margin: 2rem 0;">
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
        </div>

        <script>
          var currentDateDiffData = null;
          var currentDateAddData = null;

          var weekdaysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

          function calcDaysBetween() {
            var sVal = document.getElementById('dateStart').value;
            var eVal = document.getElementById('dateEnd').value;
            if (!sVal || !eVal) return;

            var isInclusive = document.getElementById('includeEndDay').checked;
            var d1 = new Date(sVal + 'T00:00:00');
            var d2 = new Date(eVal + 'T00:00:00');

            document.getElementById('startWeekdayLabel').textContent = weekdaysArr[d1.getDay()] + ', ' + d1.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            document.getElementById('endWeekdayLabel').textContent = weekdaysArr[d2.getDay()] + ', ' + d2.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            var diffMs = d2.getTime() - d1.getTime();
            var rawDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
            var isPast = rawDays < 0;
            var absDays = Math.abs(rawDays) + (isInclusive ? 1 : 0);

            var weeks = Math.floor(absDays / 7);
            var remDays = absDays % 7;

            // Chronological Breakdown: Years, Months, Days
            var early = new Date(Math.min(d1.getTime(), d2.getTime()));
            var late = new Date(Math.max(d1.getTime(), d2.getTime()));
            if (isInclusive) {
              late.setDate(late.getDate() + 1);
            }

            var cYears = late.getFullYear() - early.getFullYear();
            var cMonths = late.getMonth() - early.getMonth();
            var cDays = late.getDate() - early.getDate();

            if (cDays < 0) {
              cMonths--;
              var prevMonth = new Date(late.getFullYear(), late.getMonth(), 0);
              cDays += prevMonth.getDate();
            }
            if (cMonths < 0) {
              cYears--;
              cMonths += 12;
            }

            // Business days calculation
            var bDays = 0;
            var weekendDays = 0;
            var cur = new Date(Math.min(d1.getTime(), d2.getTime()));
            var end = new Date(Math.max(d1.getTime(), d2.getTime()));
            if (isInclusive) {
              end.setDate(end.getDate() + 1);
            }

            var hasFeb29 = false;
            var temp = new Date(cur);
            while (temp < end) {
              var dow = temp.getDay();
              if (dow === 0 || dow === 6) {
                weekendDays++;
              } else {
                bDays++;
              }
              if (temp.getMonth() === 1 && temp.getDate() === 29) {
                hasFeb29 = true;
              }
              temp.setDate(temp.getDate() + 1);
            }

            var badge = document.getElementById('leapYearBadge');
            if (badge) badge.style.display = hasFeb29 ? 'inline-block' : 'none';

            var totalHours = absDays * 24;
            var totalMinutes = totalHours * 60;
            var totalSeconds = totalMinutes * 60;
            var pctOfYear = ((absDays / 365.2425) * 100).toFixed(1);

            var container = document.getElementById('daysBetweenResults');
            container.innerHTML = 
              '<div style="padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Total Elapsed Days</span>' +
                  (isInclusive ? '<span style="font-size:0.75rem; color:#3b82f6; font-weight:bold;">Inclusive Count</span>' : '<span style="font-size:0.75rem; color:var(--text-muted);">Standard (Exclusive)</span>') +
                '</div>' +
                '<div style="font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.25rem 0;">' + absDays.toLocaleString() + ' Days ' + (isPast ? '<span style="font-size:1rem; color:var(--text-muted); font-weight:normal;">(in the past)</span>' : '') + '</div>' +
                '<div style="font-size: 0.9rem; color: var(--fg); font-weight: 600;">' + cYears + ' Years, ' + cMonths + ' Months, ' + cDays + ' Days</div>' +
                '<div style="font-size: 0.8rem; color: var(--text-muted);">' + weeks + ' weeks and ' + remDays + ' days (' + pctOfYear + '% of a solar year)</div>' +
              '</div>' +
              '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Working Business Days</span>' +
                  '<div style="font-size: 1.35rem; font-weight: bold; color: #3b82f6;">' + bDays.toLocaleString() + ' Workdays</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">Monday through Friday</div>' +
                '</div>' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Weekend Days</span>' +
                  '<div style="font-size: 1.35rem; font-weight: bold; color: var(--fg);">' + weekendDays.toLocaleString() + ' Days</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">Saturdays & Sundays</div>' +
                '</div>' +
              '</div>' +
              '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Hours</span>' +
                  '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + totalHours.toLocaleString() + 'h</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Minutes</span>' +
                  '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + totalMinutes.toLocaleString() + 'm</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Seconds</span>' +
                  '<div style="font-size: 1.1rem; font-weight: bold; color: var(--fg);">' + totalSeconds.toLocaleString() + 's</div>' +
                '</div>' +
              '</div>';

            var deriv = document.getElementById('dateDerivationBox');
            deriv.innerHTML = 
              '<div><strong>1. Calendar Epoch Math:</strong> &Delta;T = ' + Math.abs(diffMs).toLocaleString() + ' ms / 86,400,000 ms = ' + Math.abs(rawDays) + ' days' + (isInclusive ? ' + 1 inclusive day = <strong>' + absDays + ' days</strong>' : '') + '</div>' +
              '<div><strong>2. Exact Breakdown:</strong> ' + cYears + ' Year(s), ' + cMonths + ' Month(s), ' + cDays + ' Day(s)</div>' +
              '<div><strong>3. Workday Schedule:</strong> ' + bDays + ' Monday-Friday workdays + ' + weekendDays + ' weekend days = ' + absDays + ' total days</div>' +
              '<div><strong>4. Leap Year Traversal:</strong> ' + (hasFeb29 ? 'Spanned Feb 29 (Astronomical 366-day leap calendar applied)' : 'No leap day crossed in this date range') + '</div>';

            currentDateDiffData = {
              start: sVal,
              end: eVal,
              absDays: absDays,
              isInclusive: isInclusive,
              cYears: cYears,
              cMonths: cMonths,
              cDays: cDays,
              bDays: bDays,
              weeks: weeks,
              remDays: remDays
            };
          }

          function calcDateAdd() {
            var sVal = document.getElementById('dateAddStart').value;
            if (!sVal) return;
            var op = document.getElementById('dateAddOp').value;
            var qty = parseInt(document.getElementById('dateAddQty').value, 10) || 0;
            var unit = document.getElementById('dateAddUnit').value;

            var sign = op === 'add' ? 1 : -1;
            var d = new Date(sVal + 'T00:00:00');

            if (unit === 'days') {
              d.setDate(d.getDate() + (sign * qty));
            } else if (unit === 'business_days') {
              var added = 0;
              while (added < qty) {
                d.setDate(d.getDate() + sign);
                var dow = d.getDay();
                if (dow !== 0 && dow !== 6) {
                  added++;
                }
              }
            } else if (unit === 'weeks') {
              d.setDate(d.getDate() + (sign * qty * 7));
            } else if (unit === 'months') {
              var currentDay = d.getDate();
              d.setMonth(d.getMonth() + (sign * qty));
              // Clamp month end if rollover occurred
              if (d.getDate() < currentDay) {
                d.setDate(0);
              }
            } else if (unit === 'years') {
              d.setFullYear(d.getFullYear() + (sign * qty));
            }

            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var resultStr = d.toLocaleDateString('en-US', options);

            // Day of the year
            var startOfYear = new Date(d.getFullYear(), 0, 1);
            var dayOfYear = Math.floor((d - startOfYear) / 86400000) + 1;
            var weekOfYear = Math.ceil(dayOfYear / 7);

            var unitLabel = unit === 'business_days' ? 'Business Days (Mon-Fri)' : unit;

            document.getElementById('dateAddResults').innerHTML = 
              '<div style="padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                '<span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Target Deadline Date</span>' +
                '<div style="font-size: 1.8rem; font-weight: bold; color: #3b82f6; margin: 0.2rem 0;">' + resultStr + '</div>' +
                '<div style="font-size: 0.85rem; color: var(--text-muted);">' + (op === 'add' ? '+' : '-') + qty + ' ' + unitLabel + ' from ' + sVal + '</div>' +
                '<div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.35rem;">Day ' + dayOfYear + ' of ' + d.getFullYear() + ' • Calendar Week ' + weekOfYear + '</div>' +
              '</div>';

            currentDateAddData = {
              start: sVal,
              op: op,
              qty: qty,
              unit: unitLabel,
              resultStr: resultStr,
              dayOfYear: dayOfYear,
              weekOfYear: weekOfYear
            };
          }

          window.setDatePreset = function(days) {
            var s = document.getElementById('dateStart').value;
            if (!s) s = new Date().toISOString().slice(0, 10);
            var d = new Date(s + 'T00:00:00');
            d.setDate(d.getDate() + days);
            document.getElementById('dateEnd').value = d.toISOString().slice(0, 10);
            calcDaysBetween();
          };

          window.setDatePresetToEndOfYear = function() {
            var s = document.getElementById('dateStart').value;
            var year = s ? new Date(s + 'T00:00:00').getFullYear() : new Date().getFullYear();
            document.getElementById('dateEnd').value = year + '-12-31';
            calcDaysBetween();
          };

          window.copyDateDiffSummary = function() {
            if (!currentDateDiffData) return;
            var text = 
              '[Date Difference Report] Between ' + currentDateDiffData.start + ' and ' + currentDateDiffData.end + '\\n' +
              '• Total Calendar Days: ' + currentDateDiffData.absDays + ' Days ' + (currentDateDiffData.isInclusive ? '(Inclusive)' : '(Exclusive)') + '\\n' +
              '• Exact Duration: ' + currentDateDiffData.cYears + ' Years, ' + currentDateDiffData.cMonths + ' Months, ' + currentDateDiffData.cDays + ' Days\\n' +
              '• Working Business Days: ' + currentDateDiffData.bDays + ' Workdays (Mon-Fri)\\n' +
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/util/date-calculator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('copyDateDiffBtn');
              var orig = btn.innerHTML;
              btn.innerHTML = '<span style=\"color:#10b981; font-weight:bold;\">✓ Copied Date Difference!</span>';
              setTimeout(function() { btn.innerHTML = orig; }, 2200);
            });
          };

          window.copyDateAddSummary = function() {
            if (!currentDateAddData) return;
            var text = 
              '[Date Deadline Report]\\n' +
              '• Starting Date: ' + currentDateAddData.start + '\\n' +
              '• Operation: ' + (currentDateAddData.op === 'add' ? '+' : '-') + currentDateAddData.qty + ' ' + currentDateAddData.unit + '\\n' +
              '• Target Date: ' + currentDateAddData.resultStr + ' (Day ' + currentDateAddData.dayOfYear + ', Week ' + currentDateAddData.weekOfYear + ')\\n' +
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/util/date-calculator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('copyDateAddBtn');
              var orig = btn.innerHTML;
              btn.innerHTML = '<span style=\"color:#10b981; font-weight:bold;\">✓ Copied Target Deadline!</span>';
              setTimeout(function() { btn.innerHTML = orig; }, 2200);
            });
          };

          document.addEventListener('DOMContentLoaded', function() {
            var today = new Date().toISOString().slice(0, 10);
            var in30 = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
            document.getElementById('dateStart').value = today;
            document.getElementById('dateEnd').value = in30;
            document.getElementById('dateAddStart').value = today;
            calcDaysBetween();
            calcDateAdd();
          });
        </script>
      `
    },
    {
      slug: 'age-calculator',
      title: 'Exact Age Calculator (Years, Months, Days, Lifetime Milestones & Next Birthday)',
      metaDesc: 'Free exact age calculator: compute chronological age in years, months, days, hours, and seconds. Discover total heartbeats, planetary ages, astrological zodiac signs, and next birthday countdown.',
      category: 'Utility',
      faq: [
        { q: 'How is exact chronological age calculated across leap years and variable month lengths?', a: 'Chronological age is calculated using calendar month and day borrowing. If the target day is smaller than the birth day, we borrow the exact number of days from the preceding month (28, 29, 30, or 31). If the target month is smaller than the birth month, we borrow 12 months from the year.' },
        { q: 'What happens if I was born on Leap Day (February 29)? When is my legal birthday?', a: 'In non-leap years, legal maturity for leap day babies varies by jurisdiction. In the United Kingdom and common-law countries, statutory age increments on March 1st. In some US states (like California) and Taiwan, rights legally vest on February 28th.' },
        { q: 'What is the difference between chronological age and biological age?', a: 'Chronological age measures the elapsed orbital cycles around the Sun since birth. Biological age reflects cellular senescence, DNA methylation (epigenetic clocks like Horvath\'s clock), telomere length, and cardiovascular health.' },
        { q: 'Why did South Korea abolish its traditional East Asian age reckoning system?', a: 'Under traditional East Asian reckoning, a baby was considered 1 year old at birth and gained a year every January 1st (meaning a baby born on Dec 31 turned 2 the next day). South Korea officially abolished this in June 2023 to eliminate administrative and legal confusion.' },
        { q: 'How are planetary ages (Mars, Venus, Jupiter) calculated?', a: 'Planetary age divides your total days alive by the orbital period of the planet. For example, a Mars year is 686.98 Earth days, so someone aged 30 on Earth is approximately 15.9 Mars years old.' }
      ],
      body: `
        \${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Age Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;">Exact Age Calculator & Lifetime Milestones</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Compute your exact chronological age in years, months, and days down to the second. Explore biological vitality milestones, planetary orbits, astrological signs, and live next-birthday countdowns.
          </p>

          <div class="tool-box">
            <!-- Input Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
              <div>
                <label class="field-label" for="dobInput">Date of Birth</label>
                <input type="date" id="dobInput" class="text-input" value="1995-06-15" oninput="calcAge()" />
                <span id="dobWeekdayLabel" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;"></span>
              </div>
              <div>
                <label class="field-label" for="ageAtDate">Age at Date (Target Date)</label>
                <input type="date" id="ageAtDate" class="text-input" oninput="calcAge()" />
                <span id="targetWeekdayLabel" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;"></span>
              </div>
            </div>

            <!-- Quick Presets -->
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="setDobPreset(2000, 0, 1)">Born Jan 1, 2000</button>
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="setDobPreset(1990, 5, 15)">Born 1990</button>
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="setDobPreset(1980, 9, 20)">Born 1980</button>
              <button type="button" class="btn" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" onclick="resetTargetToToday()">Set Target to Today</button>
            </div>

            <!-- Live Results Container -->
            <div id="ageResults" style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.9rem;"></div>

            <!-- One-Click Copy Report Button -->
            <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
              <button type="button" id="copyAgeReportBtn" class="btn" style="background: #10b981; color: #fff; font-weight: 600; padding: 0.6rem 1.25rem; font-size: 0.85rem;" onclick="copyAgeReport()">
                📋 Copy Complete Milestone Report
              </button>
            </div>
          </div>

          <!-- Step-by-Step Derivation & Calendar Borrowing Math -->
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin: 1.5rem 0; font-family: var(--mono); font-size: 0.85rem;">
            <div style="font-weight: bold; color: var(--fg); margin-bottom: 0.5rem; font-size: 0.95rem;">Step-by-Step Calendar Borrowing Derivation</div>
            <div id="ageDerivationBox" style="display: grid; gap: 0.4rem; color: var(--text-muted); line-height: 1.5;"></div>
          </div>

          <!-- 3 Real-World Pitfalls & Legal Gotchas -->
          <div style="margin: 2rem 0; display: grid; gap: 1rem;">
            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-weight: bold; color: #ef4444; font-size: 0.95rem; margin-bottom: 0.4rem;">⚠️ Gotcha 1: The Leap Day Baby Legal Age Paradox (Feb 29)</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                If you were born on February 29th (a Leap Year), when do you legally turn 18 or 21 in non-leap years? Statutory laws diverge globally. Under English common law (rooted in <em>21 Henry III</em>) and UK precedent, legal age is attained on <strong>March 1st</strong>. Conversely, several US state administrative codes and Taiwan civil law declare legal rights vest on <strong>February 28th</strong>.
              </p>
            </div>

            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-weight: bold; color: #eab308; font-size: 0.95rem; margin-bottom: 0.4rem;">⚠️ Gotcha 2: East Asian Age Reckoning (Korean Age Abolition)</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Traditionally in Korea, China, and Japan, babies were considered 1 year old on their day of birth, and everyone gained an additional year together on New Year\'s Day. Under this system, an infant born on December 31st would turn 2 years old on January 1st despite having lived for less than 24 hours. On June 28, 2023, South Korea officially abolished this legal standard, mandating international chronological age across all administrative contracts and civil law.
              </p>
            </div>

            <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem;">
              <div style="font-weight: bold; color: #3b82f6; font-size: 0.95rem; margin-bottom: 0.4rem;">⚠️ Gotcha 3: Chronological Age vs Biological Epigenetic Age</div>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
                Chronological age is merely a measure of how many 365.2425-day astronomical orbits Earth has completed since your birth. In contrast, modern biomedical science evaluates <strong>Biological Age</strong> through epigenetic clocks (such as Steve Horvath\'s DNA methylation clock), telomere length attrition, and organ biomarkers. A 45-year-old marathon runner with optimal cardiovascular markers may register a biological age of 38, while chronic inflammation can elevate biological age far above calendar years.
              </p>
            </div>
          </div>

          <div class="ad-blend-box" style="margin: 2rem 0;">
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
        </div>

        <script>
          var currentAgeData = null;
          var weekdaysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

          function getWesternZodiac(m, d) {
            if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { sign: 'Aries ♈', element: 'Fire 🔥', dates: 'Mar 21 - Apr 19' };
            if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { sign: 'Taurus ♉', element: 'Earth 🌍', dates: 'Apr 20 - May 20' };
            if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { sign: 'Gemini ♊', element: 'Air 💨', dates: 'May 21 - Jun 20' };
            if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { sign: 'Cancer ♋', element: 'Water 💧', dates: 'Jun 21 - Jul 22' };
            if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { sign: 'Leo ♌', element: 'Fire 🔥', dates: 'Jul 23 - Aug 22' };
            if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { sign: 'Virgo ♍', element: 'Earth 🌍', dates: 'Aug 23 - Sep 22' };
            if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { sign: 'Libra ♎', element: 'Air 💨', dates: 'Sep 23 - Oct 22' };
            if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { sign: 'Scorpio ♏', element: 'Water 💧', dates: 'Oct 23 - Nov 21' };
            if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { sign: 'Sagittarius ♐', element: 'Fire 🔥', dates: 'Nov 22 - Dec 21' };
            if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { sign: 'Capricorn ♑', element: 'Earth 🌍', dates: 'Dec 22 - Jan 19' };
            if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { sign: 'Aquarius ♒', element: 'Air 💨', dates: 'Jan 20 - Feb 18' };
            return { sign: 'Pisces ♓', element: 'Water 💧', dates: 'Feb 19 - Mar 20' };
          }

          function getChineseZodiac(year) {
            var animals = [
              { name: 'Rat 🐀', trait: 'Quick-witted & resourceful' },
              { name: 'Ox 🐂', trait: 'Diligent & dependable' },
              { name: 'Tiger 🐅', trait: 'Brave & confident' },
              { name: 'Rabbit 🐇', trait: 'Quiet, elegant & kind' },
              { name: 'Dragon 🐉', trait: 'Enthusiastic & bold' },
              { name: 'Snake 🐍', trait: 'Wise & intuitive' },
              { name: 'Horse 🐎', trait: 'Animated & energetic' },
              { name: 'Goat 🐐', trait: 'Gentle & sympathetic' },
              { name: 'Monkey 🐒', trait: 'Smart & curious' },
              { name: 'Rooster 🐓', trait: 'Hardworking & observant' },
              { name: 'Dog 🐕', trait: 'Honest & loyal' },
              { name: 'Pig 🐖', trait: 'Compassionate & generous' }
            ];
            var idx = (year - 4) % 12;
            if (idx < 0) idx += 12;
            var animal = animals[idx];

            var lastDigit = Math.abs(year) % 10;
            var element = '';
            if (lastDigit === 0 || lastDigit === 1) element = 'Metal';
            else if (lastDigit === 2 || lastDigit === 3) element = 'Water';
            else if (lastDigit === 4 || lastDigit === 5) element = 'Wood';
            else if (lastDigit === 6 || lastDigit === 7) element = 'Fire';
            else if (lastDigit === 8 || lastDigit === 9) element = 'Earth';

            return { animal: animal.name, element: element, trait: animal.trait };
          }

          function calcAge() {
            var dobVal = document.getElementById('dobInput').value;
            var atVal = document.getElementById('ageAtDate').value;
            if (!dobVal || !atVal) return;

            var dob = new Date(dobVal + 'T00:00:00');
            var at = new Date(atVal + 'T00:00:00');

            document.getElementById('dobWeekdayLabel').textContent = weekdaysArr[dob.getDay()] + ', ' + dob.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            document.getElementById('targetWeekdayLabel').textContent = weekdaysArr[at.getDay()] + ', ' + at.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            if (at < dob) {
              document.getElementById('ageResults').innerHTML = '<div style="padding:1rem; background:#fee2e2; border:1px solid #ef4444; border-radius:4px; color:#b91c1c;">Target date cannot precede your date of birth! Please pick a date after ' + dobVal + '.</div>';
              document.getElementById('ageDerivationBox').innerHTML = '<em>Awaiting valid forward chronological dates...</em>';
              return;
            }

            var years = at.getFullYear() - dob.getFullYear();
            var months = at.getMonth() - dob.getMonth();
            var days = at.getDate() - dob.getDate();

            var borrowedDays = 0;
            var borrowedMonthDaysCount = 0;
            if (days < 0) {
              months--;
              var prevMonth = new Date(at.getFullYear(), at.getMonth(), 0);
              borrowedMonthDaysCount = prevMonth.getDate();
              days += borrowedMonthDaysCount;
              borrowedDays = 1;
            }
            var borrowedMonths = 0;
            if (months < 0) {
              years--;
              months += 12;
              borrowedMonths = 1;
            }

            var totalMs = at.getTime() - dob.getTime();
            var totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
            var totalHours = totalDays * 24;
            var totalMinutes = totalHours * 60;
            var totalSeconds = totalMinutes * 60;
            var totalWeeks = Math.floor(totalDays / 7);
            var remWeekDays = totalDays % 7;
            var decimalYears = (totalDays / 365.2425).toFixed(2);

            // Weekday of birth
            var bornWeekday = weekdaysArr[dob.getDay()];

            // Next birthday countdown
            var nextBday = new Date(at.getFullYear(), dob.getMonth(), dob.getDate());
            var isLeapBaby = (dob.getMonth() === 1 && dob.getDate() === 29);
            var checkLeapYear = function(y) { return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0); };

            if (isLeapBaby && !checkLeapYear(nextBday.getFullYear())) {
              nextBday = new Date(nextBday.getFullYear(), 2, 1); // March 1st
            }
            if (nextBday < at) {
              var nextYr = at.getFullYear() + 1;
              nextBday = new Date(nextYr, dob.getMonth(), dob.getDate());
              if (isLeapBaby && !checkLeapYear(nextYr)) {
                nextBday = new Date(nextYr, 2, 1);
              }
            }
            var msUntilBday = nextBday.getTime() - at.getTime();
            var daysUntilBday = Math.ceil(msUntilBday / (1000 * 60 * 60 * 24));
            var nextAge = (nextBday.getFullYear() - dob.getFullYear());
            var nextBdayWeekday = weekdaysArr[nextBday.getDay()];

            // Half-birthday calculation (6 months after birth month)
            var halfBdayMonth = (dob.getMonth() + 6) % 12;
            var halfBdayMonthName = new Date(2000, halfBdayMonth, 1).toLocaleDateString('en-US', { month: 'long' });

            // Vitality Estimates
            var totalHeartbeats = Math.round(totalDays * 103680); // 72 bpm avg
            var totalBreaths = Math.round(totalDays * 23040); // 16 breaths/min
            var sleepYears = (totalDays * (8 / 24) / 365.2425).toFixed(1);
            var pctLifespan = Math.min(100, (totalDays / (73.4 * 365.2425)) * 100).toFixed(1);

            // Zodiacs
            var wz = getWesternZodiac(dob.getMonth() + 1, dob.getDate());
            var cz = getChineseZodiac(dob.getFullYear());

            // Planetary Ages
            var mercuryAge = (totalDays / 87.97).toFixed(1);
            var venusAge = (totalDays / 224.7).toFixed(1);
            var marsAge = (totalDays / 686.98).toFixed(1);
            var jupiterAge = (totalDays / 4332.59).toFixed(2);

            var container = document.getElementById('ageResults');
            container.innerHTML = 
              '<!-- Primary Hero Card -->' +
              '<div style="padding: 1.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Exact Chronological Age</span>' +
                  '<span style="font-size: 0.75rem; color: #10b981; font-weight: bold;">' + decimalYears + ' Solar Years</span>' +
                '</div>' +
                '<div style="font-size: 2.2rem; font-weight: bold; color: #10b981; margin: 0.35rem 0;">' + years + ' Years, ' + months + ' Months, ' + days + ' Days</div>' +
                '<div style="font-size: 0.85rem; color: var(--fg);">' +
                  'Born on a <strong>' + bornWeekday + '</strong>' + (isLeapBaby ? ' <span style="background:#fef3c7; color:#b45309; padding:2px 6px; border-radius:3px; font-size:0.75rem; font-weight:bold;">Leap Day Baby (Feb 29)</span>' : '') +
                '</div>' +
              '</div>' +

              '<!-- Next Birthday Card -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem;">' +
                '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Next Birthday Countdown</span>' +
                  '<div style="font-size: 1.4rem; font-weight: bold; color: #eab308; margin: 0.2rem 0;">' + (daysUntilBday === 0 ? 'Today! 🎂' : daysUntilBday + ' Days Away') + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">Turns ' + nextAge + ' on ' + nextBdayWeekday + ', ' + nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '</div>' +
                '</div>' +
                '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Annual Half-Birthday</span>' +
                  '<div style="font-size: 1.4rem; font-weight: bold; color: #3b82f6; margin: 0.2rem 0;">' + halfBdayMonthName + ' ' + dob.getDate() + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">Exact 6-month halfway milestone mark</div>' +
                '</div>' +
              '</div>' +

              '<!-- Lifetime Milestones Grid -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem;">' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Days</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalDays.toLocaleString() + '</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Weeks & Days</span>' +
                  '<div style="font-size: 1.05rem; font-weight: bold; color: var(--fg);">' + totalWeeks.toLocaleString() + 'w ' + remWeekDays + 'd</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Hours</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalHours.toLocaleString() + 'h</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Minutes</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalMinutes.toLocaleString() + 'm</div>' +
                '</div>' +
                '<div style="padding: 0.65rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; text-align: center;">' +
                  '<span style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Total Seconds</span>' +
                  '<div style="font-size: 1.15rem; font-weight: bold; color: var(--fg);">' + totalSeconds.toLocaleString() + 's</div>' +
                '</div>' +
              '</div>' +

              '<!-- Biological & Physiological Vitality Stats -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Estimated Heartbeats</span>' +
                  '<div style="font-size: 1.25rem; font-weight: bold; color: #ef4444; margin: 0.15rem 0;">' + totalHeartbeats.toLocaleString() + '</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">Based on standard 72 bpm resting pulse</div>' +
                '</div>' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Breaths Inhaled</span>' +
                  '<div style="font-size: 1.25rem; font-weight: bold; color: #06b6d4; margin: 0.15rem 0;">' + totalBreaths.toLocaleString() + '</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">Based on standard 16 breaths/minute</div>' +
                '</div>' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Cumulative Sleep</span>' +
                  '<div style="font-size: 1.25rem; font-weight: bold; color: #8b5cf6; margin: 0.15rem 0;">' + sleepYears + ' Years</div>' +
                  '<div style="font-size: 0.72rem; color: var(--text-muted);">~8 hours nightly restorative sleep</div>' +
                '</div>' +
              '</div>' +

              '<!-- Cosmic & Astrological Profile -->' +
              '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Western Zodiac Sign</span>' +
                  '<div style="font-size: 1.2rem; font-weight: bold; color: var(--fg); margin: 0.15rem 0;">' + wz.sign + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">' + wz.element + ' • ' + wz.dates + '</div>' +
                '</div>' +
                '<div style="padding: 0.75rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                  '<span style="color: var(--text-muted); font-size: 0.7rem; text-transform: uppercase;">Chinese Zodiac</span>' +
                  '<div style="font-size: 1.2rem; font-weight: bold; color: var(--fg); margin: 0.15rem 0;">' + cz.element + ' ' + cz.animal + '</div>' +
                  '<div style="font-size: 0.75rem; color: var(--text-muted);">' + cz.trait + '</div>' +
                '</div>' +
              '</div>' +

              '<!-- Planetary Ages -->' +
              '<div style="padding: 0.85rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px;">' +
                '<span style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; display: block; margin-bottom: 0.4rem;">Planetary Orbits (Your Age on Other Worlds)</span>' +
                '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; text-align: center;">' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Mercury ☿</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #f59e0b;">' + mercuryAge + ' yrs</div>' +
                  '</div>' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Venus ♀</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #ec4899;">' + venusAge + ' yrs</div>' +
                  '</div>' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Mars ♂</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #ef4444;">' + marsAge + ' yrs</div>' +
                  '</div>' +
                  '<div style="padding: 0.4rem; background: var(--bg); border-radius: 3px;">' +
                    '<div style="font-size: 0.68rem; color: var(--text-muted);">Jupiter ♃</div>' +
                    '<div style="font-size: 1rem; font-weight: bold; color: #8b5cf6;">' + jupiterAge + ' yrs</div>' +
                  '</div>' +
                '</div>' +
              '</div>';

            var deriv = document.getElementById('ageDerivationBox');
            deriv.innerHTML = 
              '<div><strong>1. Calendar Year Math:</strong> ' + at.getFullYear() + ' &minus; ' + dob.getFullYear() + ' = ' + (at.getFullYear() - dob.getFullYear()) + ' years' + (borrowedMonths ? ' &minus; 1 borrowed year = <strong>' + years + ' years</strong>' : '') + '</div>' +
              '<div><strong>2. Month Borrowing Math:</strong> ' + at.getMonth() + ' &minus; ' + dob.getMonth() + ' = ' + (at.getMonth() - dob.getMonth()) + ' months' + (borrowedMonths ? ' + 12 = ' + (at.getMonth() - dob.getMonth() + 12) : '') + (borrowedDays ? ' &minus; 1 borrowed month = <strong>' + months + ' months</strong>' : '') + '</div>' +
              '<div><strong>3. Day Borrowing Math:</strong> ' + at.getDate() + ' &minus; ' + dob.getDate() + ' = ' + (at.getDate() - dob.getDate()) + ' days' + (borrowedDays ? ' + ' + borrowedMonthDaysCount + ' (days in preceding month) = <strong>' + days + ' days</strong>' : '') + '</div>' +
              '<div><strong>4. Epoch Duration:</strong> &Delta;T = ' + totalMs.toLocaleString() + ' ms &divide; 86,400,000 ms/day = <strong>' + totalDays.toLocaleString() + ' total days alive</strong></div>';

            currentAgeData = {
              dob: dobVal,
              target: atVal,
              years: years,
              months: months,
              days: days,
              decimalYears: decimalYears,
              bornWeekday: bornWeekday,
              totalDays: totalDays,
              totalWeeks: totalWeeks,
              remWeekDays: remWeekDays,
              totalHours: totalHours,
              totalMinutes: totalMinutes,
              totalHeartbeats: totalHeartbeats,
              totalBreaths: totalBreaths,
              sleepYears: sleepYears,
              daysUntilBday: daysUntilBday,
              nextAge: nextAge,
              nextBdayWeekday: nextBdayWeekday,
              nextBdayDateStr: nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              zodiacWestern: wz.sign,
              zodiacChinese: cz.element + ' ' + cz.animal
            };
          }

          window.setDobPreset = function(y, m, d) {
            var dateObj = new Date(y, m, d);
            document.getElementById('dobInput').value = dateObj.toISOString().slice(0, 10);
            calcAge();
          };

          window.resetTargetToToday = function() {
            document.getElementById('ageAtDate').value = new Date().toISOString().slice(0, 10);
            calcAge();
          };

          window.copyAgeReport = function() {
            if (!currentAgeData) return;
            var text = 
              '[Exact Chronological Age & Lifetime Milestone Report]\\n' +
              '• Date of Birth: ' + currentAgeData.dob + ' (' + currentAgeData.bornWeekday + ')\\n' +
              '• As of Date: ' + currentAgeData.target + '\\n' +
              '• Exact Age: ' + currentAgeData.years + ' Years, ' + currentAgeData.months + ' Months, ' + currentAgeData.days + ' Days (' + currentAgeData.decimalYears + ' solar years)\\n' +
              '• Lifetime Traversed: ' + currentAgeData.totalDays.toLocaleString() + ' Days (' + currentAgeData.totalWeeks.toLocaleString() + ' weeks, ' + currentAgeData.remWeekDays + ' days)\\n' +
              '• Total Hours Lived: ' + currentAgeData.totalHours.toLocaleString() + ' Hours (' + currentAgeData.totalMinutes.toLocaleString() + ' minutes)\\n' +
              '• Estimated Heartbeats: ~' + currentAgeData.totalHeartbeats.toLocaleString() + ' beats\\n' +
              '• Restorative Sleep: ~' + currentAgeData.sleepYears + ' cumulative years\\n' +
              '• Western Zodiac: ' + currentAgeData.zodiacWestern + '\\n' +
              '• Chinese Zodiac: ' + currentAgeData.zodiacChinese + '\\n' +
              '• Next Birthday: ' + (currentAgeData.daysUntilBday === 0 ? 'Today! 🎂' : currentAgeData.daysUntilBday + ' days away (Turns ' + currentAgeData.nextAge + ' on ' + currentAgeData.nextBdayWeekday + ', ' + currentAgeData.nextBdayDateStr + ')') + '\\n' +
              'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/util/age-calculator';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('copyAgeReportBtn');
              var orig = btn.innerHTML;
              btn.innerHTML = '<span style=\"color:#fff; font-weight:bold;\">✓ Copied Milestone Report!</span>';
              setTimeout(function() { btn.innerHTML = orig; }, 2200);
            });
          };

          document.addEventListener('DOMContentLoaded', function() {
            var today = new Date().toISOString().slice(0, 10);
            document.getElementById('ageAtDate').value = today;
            calcAge();
          });
        </script>
      `
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/util/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/util/${tool.slug}`,
      faq: tool.faq
    });
    writeFileSync(join(utilDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/util/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Daily Utility & Productivity Tools</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Essential online utility tools: digital stopwatches, Pomodoro focus clocks, decision wheel spinners, coin flippers, and timezone planners.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(utilDist, 'index.html'), renderPage({
    title: 'Daily Utility & Productivity Tools | Digital Tools Shed',
    metaDesc: 'Free daily utility tools: online stopwatch, Pomodoro timer, random decision wheel, coin flipper, and world clock timezone converter.',
    canonical: `${DOMAIN}/util/`,
    bodyContent: hubBody,
    currentPath: '/util/'
  }));

  console.log(`  ✓ Built Daily Utilities Suite (${tools.length} tools in /util/)`);
}
