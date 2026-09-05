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
