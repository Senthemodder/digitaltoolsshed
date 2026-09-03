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
    </style>
  `;

  const tools = [
    {
      slug: 'stopwatch',
      title: 'Online Stopwatch with Lap Times',
      metaDesc: 'Millisecond-accurate online stopwatch with split lap tracking, pause/resume, and zero battery drain.',
      category: 'Utility',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Online Stopwatch
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Online Stopwatch with Lap Times</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Precise digital stopwatch featuring millisecond timing, split lap recording, and keyboard shortcuts.
          </p>

          <div class="tool-box">
            <div class="result-card" style="margin-top:0;">
              <div id="sw-display" class="result-val" style="font-size: 3.5rem; letter-spacing: 0.05em;">00:00.000</div>
            </div>

            <div class="action-bar" style="justify-content: center; margin: 1.5rem 0;">
              <button id="sw-start" class="btn-primary" onclick="toggleStopwatch()">&#x25B6; Start</button>
              <button id="sw-lap" class="btn-sec" onclick="lapStopwatch()" disabled>Lap</button>
              <button class="btn-sec" onclick="resetStopwatch()">Reset</button>
            </div>

            <div id="lap-box" style="display: none; margin-top: 1.5rem;">
              <label class="field-label">Recorded Laps</label>
              <div id="lap-list" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; padding: 0.75rem; max-height: 200px; overflow-y: auto; font-family: var(--mono); font-size: 0.9rem;"></div>
            </div>
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
              btn.textContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
              lapBtn.disabled = false;
            }
          }

          function lapStopwatch() {
            if (!swTimerInterval) return;
            swLaps.unshift(swElapsedTime);
            document.getElementById('lap-box').style.display = 'block';
            const list = document.getElementById('lap-list');
            list.innerHTML = swLaps.map((lap, i) =>
              '<div style="display:flex; justify-content:space-between; padding:0.3rem 0; border-bottom:1px solid var(--border);"><span>Lap ' + (swLaps.length - i) + '</span><strong>' + formatSW(lap) + '</strong></div>'
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
        </script>
      `
    },
    {
      slug: 'pomodoro-timer',
      title: 'Pomodoro Focus Timer & Productivity Clock',
      metaDesc: 'Stay focused with 25-minute Pomodoro study intervals, 5-minute short breaks, and audio alert notifications.',
      category: 'Utility',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Pomodoro Timer
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Pomodoro Focus Timer</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Boost deep work productivity using 25-minute focus intervals and 5-minute restorative breaks.
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <button class="btn-sec" id="mode-work" style="font-weight:bold; background:var(--surface-alt);" onclick="setPomodoroMode(25, 'work')">Focus (25m)</button>
              <button class="btn-sec" id="mode-short" onclick="setPomodoroMode(5, 'short')">Short Break (5m)</button>
              <button class="btn-sec" id="mode-long" onclick="setPomodoroMode(15, 'long')">Long Break (15m)</button>
            </div>

            <div class="result-card" style="margin-top:0;">
              <div id="pomo-display" class="result-val" style="font-size: 4rem;">25:00</div>
              <div id="pomo-status" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">Focus Time</div>
            </div>

            <div class="action-bar" style="justify-content: center; margin-top: 1.5rem;">
              <button id="pomo-toggle" class="btn-primary" onclick="togglePomodoro()">&#x25B6; Start Focus</button>
              <button class="btn-sec" onclick="resetPomodoro()">Reset</button>
            </div>
          </div>
        </div>

        <script>
          let pomoTotalSec = 25 * 60;
          let pomoRemaining = pomoTotalSec;
          let pomoInterval = null;
          let pomoMode = 'work';

          function formatPomo(s) {
            const m = Math.floor(s / 60).toString().padStart(2, '0');
            const sec = (s % 60).toString().padStart(2, '0');
            return m + ':' + sec;
          }

          function setPomodoroMode(mins, mode) {
            clearInterval(pomoInterval);
            pomoInterval = null;
            pomoMode = mode;
            pomoTotalSec = mins * 60;
            pomoRemaining = pomoTotalSec;
            document.getElementById('pomo-display').textContent = formatPomo(pomoRemaining);
            document.getElementById('pomo-toggle').textContent = '▶ Start ' + (mode === 'work' ? 'Focus' : 'Break');
            document.getElementById('pomo-status').textContent = mode === 'work' ? 'Focus Time' : 'Rest Break';

            document.getElementById('mode-work').style.fontWeight = mode === 'work' ? 'bold' : 'normal';
            document.getElementById('mode-short').style.fontWeight = mode === 'short' ? 'bold' : 'normal';
            document.getElementById('mode-long').style.fontWeight = mode === 'long' ? 'bold' : 'normal';
          }

          function togglePomodoro() {
            const btn = document.getElementById('pomo-toggle');
            if (pomoInterval) {
              clearInterval(pomoInterval);
              pomoInterval = null;
              btn.textContent = '▶ Resume';
            } else {
              btn.textContent = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause';
              pomoInterval = setInterval(() => {
                pomoRemaining--;
                document.getElementById('pomo-display').textContent = formatPomo(pomoRemaining);
                if (pomoRemaining <= 0) {
                  clearInterval(pomoInterval);
                  pomoInterval = null;
                  alert('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="12" cy="13" r="9"/><polyline points="12 9 12 13 16 13"/><path d="M5 3L2 6"/><path d="M19 3l3 3"/></svg> Time is up! Take a well-deserved break.');
                  setPomodoroMode(5, 'short');
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
          }
        </script>
      `
    },
    {
      slug: 'wheel-spinner',
      title: 'Random Decision Wheel & Prize Spinner',
      metaDesc: 'Spin the wheel for random decisions, raffle winner pickers, classroom selections, and game choices with custom options.',
      category: 'Utility',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Decision Wheel Spinner
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Random Decision Wheel Spinner</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Spin a custom wheel to make unbiased decisions, pick raffle winners, or select random team members.
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

            <div class="action-bar" style="justify-content: center;">
              <button class="btn-primary" style="font-size: 1.1rem; padding: 0.75rem 2rem;" onclick="spinWheel()">&#x1F3B0; Spin Wheel!</button>
            </div>

            <div id="winner-box" class="result-card" style="display: none; margin-top: 1.5rem;">
              <div class="field-label">Selected Winner</div>
              <div id="winner-name" class="result-val">---</div>
            </div>
          </div>
        </div>

        <script>
          const COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899","#06b6d4","#84cc16"];
          let currentAngle = 0;
          let isSpinning = false;

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

              // Text
              ctx.save();
              ctx.rotate((i + 0.5) * arc);
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 14px sans-serif';
              ctx.textAlign = 'right';
              ctx.fillText(items[i] || '', 130, 5);
              ctx.restore();
            }

            ctx.restore();
          }

          function spinWheel() {
            if (isSpinning) return;
            isSpinning = true;
            document.getElementById('winner-box').style.display = 'none';

            const items = getItems();
            const spinRounds = 5 + Math.random() * 5;
            const totalSpin = spinRounds * 2 * Math.PI;
            const startAngle = currentAngle;
            const duration = 4000;
            const startTime = Date.now();

            function animate() {
              const now = Date.now();
              const elapsed = now - startTime;
              const t = Math.min(1, elapsed / duration);
              // Ease-out cubic
              const easeOut = 1 - Math.pow(1 - t, 3);

              currentAngle = startAngle + (totalSpin * easeOut);
              drawWheel();

              if (t < 1) {
                requestAnimationFrame(animate);
              } else {
                isSpinning = false;
                // Calculate winner at top pointer (3*PI/2)
                const arc = (2 * Math.PI) / items.length;
                const normalized = (2 * Math.PI - (currentAngle % (2 * Math.PI)) + (3 * Math.PI / 2)) % (2 * Math.PI);
                const winnerIdx = Math.floor(normalized / arc) % items.length;

                document.getElementById('winner-box').style.display = 'block';
                document.getElementById('winner-name').textContent = items[winnerIdx];
              }
            }
            requestAnimationFrame(animate);
          }

          document.addEventListener('DOMContentLoaded', drawWheel);
        </script>
      `
    },
    {
      slug: 'coin-flipper',
      title: 'Coin Flipper & Probability Simulator',
      metaDesc: 'Flip a coin online with 3D animation, streak counting, probability statistics, and multiple flips simulator.',
      category: 'Utility',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Coin Flipper
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Coin Flipper & Heads/Tails Simulator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Cryptographically fair coin toss simulation with heads/tails history and probability ratios.
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: center; padding: 2rem 0;">
              <div id="coin-visual" style="width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, #fde047 0%, #ca8a04 100%); border: 4px solid #a16207; display: flex; justify-content: center; align-items: center; font-family: var(--serif); font-size: 1.6rem; font-weight: bold; color: #713f12; box-shadow: 0 8px 24px rgba(0,0,0,0.15); transition: transform 0.6s;">
                HEADS
              </div>
            </div>

            <div class="action-bar" style="justify-content: center;">
              <button class="btn-primary" style="font-size: 1rem; padding: 0.65rem 1.8rem;" onclick="flipCoin()">&#x1FA99; Flip Coin</button>
              <button class="btn-sec" onclick="flipMultiple(10)">Flip 10x</button>
              <button class="btn-sec" onclick="flipMultiple(100)">Flip 100x</button>
            </div>

            <div class="result-card" style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-around; font-family: var(--mono);">
                <div>Heads: <strong id="cnt-heads" style="color: #ca8a04;">0</strong> (<span id="pct-heads">0%</span>)</div>
                <div>Tails: <strong id="cnt-tails" style="color: #3b82f6;">0</strong> (<span id="pct-tails">0%</span>)</div>
                <div>Total: <strong id="cnt-total">0</strong></div>
              </div>
            </div>
          </div>
        </div>

        <script>
          let heads = 0;
          let tails = 0;

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
            updateStats();
          }

          function updateStats() {
            const tot = heads + tails;
            document.getElementById('cnt-heads').textContent = heads;
            document.getElementById('cnt-tails').textContent = tails;
            document.getElementById('cnt-total').textContent = tot;
            document.getElementById('pct-heads').textContent = tot ? ((heads / tot) * 100).toFixed(1) + '%' : '0%';
            document.getElementById('pct-tails').textContent = tot ? ((tails / tot) * 100).toFixed(1) + '%' : '0%';
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
      metaDesc: 'Calculate exact calendar days, business days, and weeks between two dates. Add or subtract days, weeks, months, or years from any date.',
      category: 'Utility',
      faq: [
        { q: 'How many business days are between two dates?', a: 'Business days count only weekdays (Monday through Friday), excluding Saturdays and Sundays. In a standard calendar month of 30 days, there are typically 20 to 22 business days.' },
        { q: 'How do you add days to a date?', a: 'To add days, convert the starting date to milliseconds (or epoch timestamp), add (Number of Days × 86,400,000 ms), and format the resulting timestamp back into a calendar date.' },
        { q: 'Does this date calculator take leap years into account?', a: 'Yes. All calculations use native standard astronomical calendar math which accounts for leap years (including February 29th).' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Date Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Date Calculator (Days Between & Add Days)</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Calculate exact calendar days and business days between dates, or project future deadlines.
          </p>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">1. Days Between Two Dates</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="field-label">Start Date</label>
                <input type="date" id="dateStart" class="text-input" oninput="calcDaysBetween()" />
              </div>
              <div>
                <label class="field-label">End Date</label>
                <input type="date" id="dateEnd" class="text-input" oninput="calcDaysBetween()" />
              </div>
            </div>

            <div id="daysBetweenResults" style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;"></div>
          </div>

          <div class="tool-box">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;">2. Add or Subtract Days from a Date</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="field-label">Start Date</label>
                <input type="date" id="dateAddStart" class="text-input" oninput="calcDateAdd()" />
              </div>
              <div>
                <label class="field-label">Operation</label>
                <select id="dateAddOp" class="text-input" onchange="calcDateAdd()">
                  <option value="add">Add (+)</option>
                  <option value="sub">Subtract (-)</option>
                </select>
              </div>
              <div>
                <label class="field-label">Quantity</label>
                <input type="number" id="dateAddQty" class="text-input" value="30" min="1" step="1" oninput="calcDateAdd()" />
              </div>
              <div>
                <label class="field-label">Unit</label>
                <select id="dateAddUnit" class="text-input" onchange="calcDateAdd()">
                  <option value="days" selected>Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            <div id="dateAddResults" style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;"></div>
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
          function calcDaysBetween() {
            var sVal = document.getElementById('dateStart').value;
            var eVal = document.getElementById('dateEnd').value;
            if (!sVal || !eVal) return;

            var d1 = new Date(sVal + 'T00:00:00');
            var d2 = new Date(eVal + 'T00:00:00');
            var diffMs = d2.getTime() - d1.getTime();
            var totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

            var absDays = Math.abs(totalDays);
            var weeks = Math.floor(absDays / 7);
            var remDays = absDays % 7;

            // Business days calculation
            var bDays = 0;
            var cur = new Date(Math.min(d1.getTime(), d2.getTime()));
            var end = new Date(Math.max(d1.getTime(), d2.getTime()));
            while (cur < end) {
              cur.setDate(cur.getDate() + 1);
              var dayOfWeek = cur.getDay();
              if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                bDays++;
              }
            }

            document.getElementById('daysBetweenResults').innerHTML = 
              '<div style="padding:0.75rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">TOTAL CALENDAR DAYS</span>' +
                '<div style="font-size:1.8rem; font-weight:bold; color:#10b981;">' + absDays + ' Days ' + (totalDays < 0 ? '(in the past)' : '') + '</div>' +
                '<div style="font-size:0.8rem; color:var(--text-muted);">' + weeks + ' weeks and ' + remDays + ' days</div>' +
              '</div>' +
              '<div style="padding:0.75rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">BUSINESS / WORKING DAYS (MON-FRI)</span>' +
                '<div style="font-size:1.3rem; font-weight:bold; color:var(--fg);">' + bDays + ' Working Days</div>' +
                '<div style="font-size:0.8rem; color:var(--text-muted);">Excludes Saturdays & Sundays</div>' +
              '</div>';
          }

          function calcDateAdd() {
            var sVal = document.getElementById('dateAddStart').value;
            if (!sVal) return;
            var op = document.getElementById('dateAddOp').value;
            var qty = parseInt(document.getElementById('dateAddQty').value, 10) || 0;
            var unit = document.getElementById('dateAddUnit').value;

            var sign = op === 'add' ? 1 : -1;
            var d = new Date(sVal + 'T00:00:00');

            if (unit === 'days') d.setDate(d.getDate() + (sign * qty));
            else if (unit === 'weeks') d.setDate(d.getDate() + (sign * qty * 7));
            else if (unit === 'months') d.setMonth(d.getMonth() + (sign * qty));
            else if (unit === 'years') d.setFullYear(d.getFullYear() + (sign * qty));

            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            var resultStr = d.toLocaleDateString('en-US', options);

            document.getElementById('dateAddResults').innerHTML = 
              '<div style="padding:0.75rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.7rem;">CALCULATED TARGET DATE</span>' +
                '<div style="font-size:1.6rem; font-weight:bold; color:#3b82f6;">' + resultStr + '</div>' +
                '<div style="font-size:0.8rem; color:var(--text-muted);">' + (op === 'add' ? '+' : '-') + qty + ' ' + unit + ' from ' + sVal + '</div>' +
              '</div>';
          }

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
      title: 'Exact Age Calculator (Years, Months, Days & Next Birthday)',
      metaDesc: 'Calculate your exact age down to years, months, days, total hours, and weekday of birth. Includes live countdown to your next birthday.',
      category: 'Utility',
      faq: [
        { q: 'How is exact chronological age calculated?', a: 'Chronological age is calculated by finding the difference between your date of birth and the target date, adjusting for variable month lengths (28 to 31 days) and leap years.' },
        { q: 'What day of the week was I born on?', a: 'Enter your date of birth into our calculator and look at the "Born On" card to instantly see the exact day of the week you were born (e.g., Friday).' },
        { q: 'How many days have I been alive?', a: 'Our calculator computes your total days alive by converting your lifespan into milliseconds and dividing by 86,400,000.' }
      ],
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/util/">Daily Utilities</a> &gt; Age Calculator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Exact Age Calculator & Birthday Countdown</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Discover your exact chronological age in years, months, days, hours, and minutes with next birthday milestones.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
              <div>
                <label class="field-label">Date of Birth</label>
                <input type="date" id="dobInput" class="text-input" value="1995-06-15" oninput="calcAge()" />
              </div>
              <div>
                <label class="field-label">Age at the Date of</label>
                <input type="date" id="ageAtDate" class="text-input" oninput="calcAge()" />
              </div>
            </div>

            <div id="ageResults" style="display: grid; gap: 0.85rem; font-family: var(--mono); font-size: 0.9rem;"></div>
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
          function calcAge() {
            var dobVal = document.getElementById('dobInput').value;
            var atVal = document.getElementById('ageAtDate').value;
            if (!dobVal || !atVal) return;

            var dob = new Date(dobVal + 'T00:00:00');
            var at = new Date(atVal + 'T00:00:00');

            if (at < dob) {
              document.getElementById('ageResults').innerHTML = '<div style=\"color:#ef4444;\">Date of birth must be earlier than the target date.</div>';
              return;
            }

            var years = at.getFullYear() - dob.getFullYear();
            var months = at.getMonth() - dob.getMonth();
            var days = at.getDate() - dob.getDate();

            if (days < 0) {
              months--;
              var prevMonth = new Date(at.getFullYear(), at.getMonth(), 0);
              days += prevMonth.getDate();
            }
            if (months < 0) {
              years--;
              months += 12;
            }

            var totalMs = at.getTime() - dob.getTime();
            var totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
            var totalHours = totalDays * 24;
            var totalWeeks = (totalDays / 7).toFixed(1);

            // Day of week of birth
            var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var bornDay = weekdays[dob.getDay()];

            // Next birthday countdown
            var nextBday = new Date(at.getFullYear(), dob.getMonth(), dob.getDate());
            if (nextBday < at) {
              nextBday.setFullYear(at.getFullYear() + 1);
            }
            var daysUntilBday = Math.ceil((nextBday.getTime() - at.getTime()) / (1000 * 60 * 60 * 24));

            document.getElementById('ageResults').innerHTML = 
              '<div style="padding:1rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                '<span style="color:var(--text-muted); font-size:0.75rem;">EXACT CHRONOLOGICAL AGE</span>' +
                '<div style="font-size:2rem; font-weight:bold; color:#10b981;">' + years + ' Years, ' + months + ' Months, ' + days + ' Days</div>' +
              '</div>' +
              '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem;">' +
                '<div style="padding:0.75rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                  '<span style="color:var(--text-muted); font-size:0.7rem;">TOTAL DAYS ALIVE</span>' +
                  '<div style="font-size:1.2rem; font-weight:bold; color:var(--fg);">' + totalDays.toLocaleString('en-US') + ' Days</div>' +
                  '<div style="font-size:0.75rem; color:var(--text-muted);">' + totalWeeks + ' weeks</div>' +
                '</div>' +
                '<div style="padding:0.75rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                  '<span style="color:var(--text-muted); font-size:0.7rem;">BORN ON A</span>' +
                  '<div style="font-size:1.2rem; font-weight:bold; color:#3b82f6;">' + bornDay + '</div>' +
                  '<div style="font-size:0.75rem; color:var(--text-muted);">Weekday of birth</div>' +
                '</div>' +
                '<div style="padding:0.75rem; background:var(--surface); border:1px solid var(--border); border-radius:4px;">' +
                  '<span style="color:var(--text-muted); font-size:0.7rem;">NEXT BIRTHDAY</span>' +
                  '<div style="font-size:1.2rem; font-weight:bold; color:#eab308;">' + (daysUntilBday === 0 ? 'Today! 🎂' : daysUntilBday + ' Days') + '</div>' +
                  '<div style="font-size:0.75rem; color:var(--text-muted);">Birthday countdown</div>' +
                '</div>' +
              '</div>';
          }

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
      currentPath: `/util/${tool.slug}`
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
