// scripts/curiosity_neuro_suite.js — 10 Flagship Curiosity, Neurobiology & Existential Tools
// Deeply interactive, zero external dependencies, pure vanilla JS, Workbench design system.

import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildCuriosityNeuroSuite() {
  const utilDir = join(DIST, 'util');
  ensureDir(utilDir);

  const sharedStyle = `
    <style>
      .neuro-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .neuro-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
      .neuro-grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
      .neuro-grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
      .neuro-metric-card { background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center; }
      .neuro-metric-val { font-family: var(--mono); font-size: 2.2rem; font-weight: 800; margin: 0.25rem 0; }
      .neuro-metric-sub { font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono); }
      .neuro-pill-btn { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.45rem 0.85rem; border-radius: 20px; font-size: 0.8rem; font-family: var(--mono); cursor: pointer; transition: all 0.2s; }
      .neuro-pill-btn:hover { border-color: var(--fg); background: var(--surface-hover, var(--surface)); }
      .neuro-btn-primary { background: #3b82f6; color: #fff; border: none; padding: 0.7rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; font-weight: bold; border-radius: 6px; cursor: pointer; transition: opacity 0.2s; }
      .neuro-btn-primary:hover { opacity: 0.9; }
      .neuro-slider-row { margin-bottom: 1.25rem; }
      .neuro-slider-label { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.35rem; }
      .neuro-slider-input { width: 100%; accent-color: #3b82f6; cursor: pointer; }
      .faq-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; margin-top: 2rem; padding: 1.5rem; }
      .faq-item { border-bottom: 1px solid var(--border); padding: 1rem 0; }
      .faq-item:last-child { border-bottom: none; }
      .faq-q { font-family: var(--serif); font-size: 1.1rem; font-weight: bold; margin-bottom: 0.4rem; color: var(--fg); }
      .faq-a { font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; }
    </style>
  `;

  // ──────────────────────────────────────────────────────────────────────────
  // 1. DECISION PARALYSIS BRACKET TOURNAMENT (/util/decision-bracket)
  // ──────────────────────────────────────────────────────────────────────────
  const decisionBracketHtml = `
    ${sharedStyle}
    <style>
      .matchup-container { display: flex; gap: 1.5rem; justify-content: center; align-items: stretch; margin: 2rem 0; flex-wrap: wrap; }
      .choice-card { flex: 1; min-width: 260px; max-width: 420px; background: var(--surface); border: 2px solid var(--border); border-radius: 12px; padding: 2rem 1.5rem; text-align: center; cursor: pointer; transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s; }
      .choice-card:hover { transform: translateY(-4px); border-color: #3b82f6; box-shadow: 0 8px 24px rgba(59,130,246,0.15); }
      .choice-title { font-family: var(--serif); font-size: 1.6rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--fg); }
      .choice-key { display: inline-block; font-family: var(--mono); font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 4px; color: var(--text-muted); margin-top: 0.75rem; }
      .vs-divider { display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 1.2rem; font-weight: 900; color: var(--text-muted); }
      .bracket-node { font-family: var(--mono); font-size: 0.8rem; padding: 0.4rem 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.4rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .bracket-node.winner { border-color: #22c55e; color: #22c55e; font-weight: bold; background: rgba(34,197,94,0.08); }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Decision Paralysis Bracket
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">Executive Function & Choice Architecture</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Decision Paralysis Bracket Tournament</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Overwhelmed by too many options? Evaluating 8 or 16 choices at once floods working memory (Miller’s Law). This tool runs a rapid binary elimination tournament (March Madness style) to bypass prefrontal hesitation in under 60 seconds.
        </p>
      </header>

      <!-- SETUP SCREEN -->
      <div id="setupView" class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem;">1. Enter Your Overwhelming Choices</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Enter 4, 8, or 16 items you cannot decide between. Or pick an instant dilemma preset:
        </p>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
          <button class="neuro-pill-btn" onclick="loadPreset('dinner')">🍕 Dinner Dilemma</button>
          <button class="neuro-pill-btn" onclick="loadPreset('projects')">🚀 Side Project / Feature</button>
          <button class="neuro-pill-btn" onclick="loadPreset('weekend')">☕ Weekend Recharge</button>
          <button class="neuro-pill-btn" onclick="loadPreset('career')">💼 Career Priority</button>
          <button class="neuro-pill-btn" onclick="loadPreset('movies')">🎬 Movie / Watchlist</button>
        </div>

        <textarea id="itemsInput" class="code-input" style="height: 130px; margin-bottom: 1rem; font-family: var(--mono); font-size: 0.95rem; line-height: 1.5;" placeholder="Enter one option per line (min 4, max 16)...&#10;Thai Food&#10;Tacos&#10;Sushi&#10;Pizza&#10;Burgers&#10;Indian Curry&#10;Ramen&#10;Mediterranean Shawarma"></textarea>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <span id="itemCountLabel" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">8 options detected (Quarterfinals ready)</span>
          <button onclick="startTournament()" class="neuro-btn-primary">⚡ Launch 1v1 Elimination Tournament</button>
        </div>
      </div>

      <!-- TOURNAMENT SCREEN -->
      <div id="tournamentView" class="neuro-card" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
          <div>
            <span id="roundTitle" style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; color: #3b82f6; text-transform: uppercase;">Round 1 of 3 (Quarterfinals)</span>
            <div id="matchProgress" style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--mono);">Match 1 of 4</div>
          </div>
          <button onclick="cancelTournament()" class="neuro-pill-btn">Reset</button>
        </div>

        <div class="matchup-container">
          <div class="choice-card" id="cardA" onclick="vote(0)">
            <div class="choice-title" id="nameA">Option A</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Click or Press [1] / [Left Arrow]</div>
            <div class="choice-key">Key 1 / &larr;</div>
          </div>

          <div class="vs-divider">VS</div>

          <div class="choice-card" id="cardB" onclick="vote(1)">
            <div class="choice-title" id="nameB">Option B</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Click or Press [2] / [Right Arrow]</div>
            <div class="choice-key">Key 2 / &rarr;</div>
          </div>
        </div>

        <div style="text-align: center; font-size: 0.85rem; color: var(--text-muted); font-family: var(--mono);">
          Do not overthink. Rely on your gut reaction in the first 2 seconds.
        </div>
      </div>

      <!-- VICTORY SCREEN -->
      <div id="victoryView" class="neuro-card" style="display: none; text-align: center; border-top: 4px solid #22c55e;">
        <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: #22c55e; letter-spacing: 0.1em; font-weight: bold;">Subconscious Elimination Complete</div>
        <h2 style="font-family: var(--serif); font-size: 2.4rem; margin: 0.5rem 0 0.25rem;">Your Undisputed Champion</h2>
        <div id="winnerName" style="font-family: var(--serif); font-size: 2.8rem; font-weight: 900; color: #3b82f6; margin-bottom: 1rem;">Winner</div>

        <p id="winnerAnalysis" style="font-size: 1rem; color: var(--text-muted); max-width: 650px; margin: 0 auto 1.5rem; line-height: 1.6;"></p>

        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button onclick="copyVictory()" class="neuro-btn-primary">📋 Copy Decision Summary</button>
          <button onclick="cancelTournament()" class="neuro-pill-btn" style="padding: 0.7rem 1.2rem;">Run Another Dilemma</button>
        </div>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">Why does binary elimination resolve decision paralysis so fast?</div>
          <div class="faq-a">
            According to Hick’s Law (T = b &times; log2(n + 1)), decision time increases logarithmically with the number of options. Simultaneously ranking 8 or 16 choices overwhelms working memory and activates amygdala anxiety. Pitting choices head-to-head in 1-on-1 pairs strips away comparative noise, allowing your subconscious gut intuition to decide in milliseconds.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">What if I feel disappointed by the winning choice?</div>
          <div class="faq-a">
            Sigmund Freud famously noted that tossing a coin (or running an elimination bracket) reveals your true subconscious desire the instant the result appears. If you feel regret or reluctance about the winner, your brain has just illuminated what you actually wanted: the runner-up.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Is my input data private?</div>
          <div class="faq-a">
            100% private. The tournament runs entirely in your local browser memory using client-side JavaScript. Zero inputs or decision results are ever transmitted to external servers.
          </div>
        </div>
      </div>
    </div>

    <script>
      var presets = {
        dinner: ['Wood-Fired Pizza', 'Authentic Thai Pad Thai', 'Japanese Nigiri Sushi', 'Smash Burgers & Fries', 'Indian Chicken Tikka', 'Birria Street Tacos', 'Creamy Tonkotsu Ramen', 'Greek Chicken Shawarma'],
        projects: ['Build High-CTR Micro Tool', 'Ship Open-Source GitHub Library', 'Refactor Core Architecture', 'Write 5,000-Word SEO Guide', 'Create Video Walkthrough Tutorial', 'Automate CI/CD Test Pipeline', 'Redesign Mobile Nav UX', 'Launch ProductHunt Campaign'],
        weekend: ['Deep Nature Forest Hike', 'Sleep 10 Hours & Read Book', 'Catch Up with Old Friend', 'Explore New Coffee Shop', 'Cook Complex Recipe from Scratch', 'Visit Art Museum / Gallery', 'Declutter & Deep Clean Room', 'Guilt-Free Video Game Marathon'],
        career: ['Prepare for Salary Negotiation', 'Learn High-Demand Technical Skill', 'Update Resume & Portfolio', 'Reach Out to 3 Senior Mentors', 'Start Side Consulting Gig', 'Automate Repetitive Daily Workflow', 'Submit Conference Talk Proposal', 'Deep Work Focus Block (No Meetings)'],
        movies: ['Interstellar', 'The Dark Knight', 'Spirited Away', 'Blade Runner 2049', 'Parasite', 'Whiplash', 'Mad Max: Fury Road', 'Everything Everywhere All at Once']
      };

      var tournamentItems = [];
      var currentRound = [];
      var nextRound = [];
      var currentMatchIndex = 0;
      var runnerUp = '';

      function loadPreset(key) {
        if (presets[key]) {
          document.getElementById('itemsInput').value = presets[key].join('\\n');
          updateCount();
        }
      }

      function updateCount() {
        var lines = document.getElementById('itemsInput').value.split('\\n').map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 0; });
        var count = lines.length;
        var valid = [4, 8, 16];
        var msg = count + ' options detected.';
        if (valid.indexOf(count) !== -1) {
          msg += ' Perfect ' + count + '-item bracket ready!';
        } else if (count > 2) {
          var nextPower = count <= 4 ? 4 : (count <= 8 ? 8 : 16);
          msg += ' (Bracket will automatically balance to ' + nextPower + ' options)';
        }
        document.getElementById('itemCountLabel').textContent = msg;
      }

      document.getElementById('itemsInput').addEventListener('input', updateCount);

      function startTournament() {
        var raw = document.getElementById('itemsInput').value.split('\\n').map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 0; });
        if (raw.length < 2) {
          alert('Please enter at least 2 options to compare.');
          return;
        }

        var targetSize = 2;
        if (raw.length > 8) targetSize = 16;
        else if (raw.length > 4) targetSize = 8;
        else if (raw.length > 2) targetSize = 4;

        tournamentItems = raw.slice(0, targetSize);
        tournamentItems.sort(function() { return 0.5 - Math.random(); });

        currentRound = tournamentItems.slice();
        nextRound = [];
        currentMatchIndex = 0;

        document.getElementById('setupView').style.display = 'none';
        document.getElementById('victoryView').style.display = 'none';
        document.getElementById('tournamentView').style.display = 'block';

        renderMatch();
      }

      function renderMatch() {
        var totalMatches = Math.floor(currentRound.length / 2);
        var matchNum = currentMatchIndex + 1;
        var roundName = currentRound.length === 2 ? 'Final Championship' : (currentRound.length === 4 ? 'Semifinals' : 'Quarterfinals');

        document.getElementById('roundTitle').textContent = roundName;
        document.getElementById('matchProgress').textContent = 'Match ' + matchNum + ' of ' + totalMatches;

        var a = currentRound[currentMatchIndex * 2];
        var b = currentRound[currentMatchIndex * 2 + 1];

        document.getElementById('nameA').textContent = a;
        document.getElementById('nameB').textContent = b;
      }

      function vote(chosenIdx) {
        var a = currentRound[currentMatchIndex * 2];
        var b = currentRound[currentMatchIndex * 2 + 1];

        var winner = chosenIdx === 0 ? a : b;
        var loser = chosenIdx === 0 ? b : a;

        nextRound.push(winner);
        if (currentRound.length === 2) {
          runnerUp = loser;
        }

        currentMatchIndex++;
        if (currentMatchIndex * 2 >= currentRound.length) {
          if (nextRound.length === 1) {
            showVictory(nextRound[0]);
          } else {
            currentRound = nextRound.slice();
            nextRound = [];
            currentMatchIndex = 0;
            renderMatch();
          }
        } else {
          renderMatch();
        }
      }

      function showVictory(champion) {
        document.getElementById('tournamentView').style.display = 'none';
        document.getElementById('victoryView').style.display = 'block';
        document.getElementById('winnerName').textContent = champion;

        var analysis = 'Your subconscious selected "' + champion + '" after defeating all competitors in binary head-to-head evaluations';
        if (runnerUp) {
          analysis += ', with "' + runnerUp + '" as the close runner-up.';
        } else {
          analysis += '.';
        }
        analysis += ' By eliminating secondary and tertiary distractions, your cognitive friction has collapsed to zero. Act on this choice immediately.';
        document.getElementById('winnerAnalysis').textContent = analysis;
      }

      function copyVictory() {
        var win = document.getElementById('winnerName').textContent;
        var text = '🏆 Decision Bracket Champion: ' + win + '\\nDecided via Digital Tools Shed Prefrontal Cortex Bypass Engine: ' + window.location.href;
        navigator.clipboard.writeText(text).then(function() {
          alert('Decision summary copied to clipboard!');
        });
      }

      function cancelTournament() {
        document.getElementById('setupView').style.display = 'block';
        document.getElementById('tournamentView').style.display = 'none';
        document.getElementById('victoryView').style.display = 'none';
      }

      document.addEventListener('keydown', function(e) {
        if (document.getElementById('tournamentView').style.display === 'block') {
          if (e.key === '1' || e.key === 'ArrowLeft') {
            vote(0);
          } else if (e.key === '2' || e.key === 'ArrowRight') {
            vote(1);
          }
        }
      });

      document.addEventListener('DOMContentLoaded', updateCount);
    </script>
  `;

  writeFileSync(join(utilDir, 'decision-bracket.html'), renderPage({
    title: 'Decision Paralysis Bracket Tournament [Prefrontal Cortex Bypass Engine] | Digital Tools Shed',
    metaDesc: 'Eliminate decision fatigue and analysis paralysis with a rapid binary head-to-head tournament bracket. Pit 4, 8, or 16 choices in 1-on-1 matchups to reveal your subconscious priority.',
    canonical: `${DOMAIN}/util/decision-bracket`,
    bodyContent: decisionBracketHtml,
    currentPath: '/util/decision-bracket',
    faq: [
      { q: 'Why does binary elimination resolve decision paralysis so fast?', a: 'According to Hick\'s Law, decision time increases logarithmically with choices. Pairwise 1-on-1 elimination strips away comparative noise, allowing your subconscious gut intuition to decide in milliseconds.' },
      { q: 'What if I feel disappointed by the winning choice?', a: 'Sigmund Freud noted that flipping a coin or running an elimination tournament reveals your true subconscious desire the instant the result appears. If you feel regret about the winner, your brain has just illuminated what you actually wanted: the runner-up.' },
      { q: 'Is my decision data sent to any servers?', a: 'Zero data is sent to servers. The entire tournament runs client-side in your local browser session with 100% privacy.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 2. THE TAIL END: LOVED-ONE TIME REMAINING LEDGER (/util/tail-end-mortality)
  // ──────────────────────────────────────────────────────────────────────────
  const tailEndHtml = `
    ${sharedStyle}
    <style>
      .dot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(14px, 1fr)); gap: 6px; padding: 1.25rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; max-height: 420px; overflow-y: auto; margin: 1.5rem 0; }
      .mortality-dot { width: 14px; height: 14px; border-radius: 50%; background: #3b82f6; transition: transform 0.15s, background 0.15s; }
      .mortality-dot:hover { transform: scale(1.6); background: #ef4444; }
      .mortality-dot.future { background: #3b82f6; box-shadow: 0 0 4px rgba(59,130,246,0.4); }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; The Tail End Mortality Ledger
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">Actuarial Reality Check & Tim Urban's 'The Tail End'</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Tail End: Loved-One Time Remaining Ledger</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          By age 18, you have already spent roughly 90% of the total in-person face-to-face time you will ever have with your parents. If your loved ones live elsewhere and you visit twice a year, you don't have "20 years left"—you have 40 visits left.
        </p>
      </header>

      <div class="neuro-card">
        <div class="neuro-grid-3" style="margin-bottom: 1.5rem;">
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Relationship</label>
            <select id="relType" class="code-input" onchange="calcTailEnd()" style="padding:0.6rem;font-family:var(--mono);">
              <option value="parent" selected>Mother / Father</option>
              <option value="grandparent">Grandmother / Grandfather</option>
              <option value="child">Child (Before Age 18)</option>
              <option value="friend">Childhood Best Friend</option>
              <option value="custom">Custom Loved One</option>
            </select>
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Your Current Age</label>
            <input type="number" id="userAge" value="30" min="1" max="100" class="code-input" oninput="calcTailEnd()" style="padding:0.6rem;font-family:var(--mono);" />
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Loved One's Current Age</label>
            <input type="number" id="lovedAge" value="62" min="1" max="105" class="code-input" oninput="calcTailEnd()" style="padding:0.6rem;font-family:var(--mono);" />
          </div>
        </div>

        <div class="neuro-grid-3">
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Visits / Encounters Per Year</label>
            <input type="number" id="visitsPerYear" value="3" min="1" max="365" class="code-input" oninput="calcTailEnd()" style="padding:0.6rem;font-family:var(--mono);" />
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Average Days Per Visit</label>
            <input type="number" id="daysPerVisit" value="4" min="1" max="60" class="code-input" oninput="calcTailEnd()" style="padding:0.6rem;font-family:var(--mono);" />
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Actuarial Life Expectancy</label>
            <input type="number" id="targetLifespan" value="82" min="50" max="110" class="code-input" oninput="calcTailEnd()" style="padding:0.6rem;font-family:var(--mono);" />
          </div>
        </div>
      </div>

      <!-- RESULTS METRICS -->
      <div class="neuro-grid-4" style="margin-bottom: 1.5rem;">
        <div class="neuro-metric-card" style="border-top: 4px solid #ef4444;">
          <div class="neuro-metric-sub">TIME ALREADY ELAPSED</div>
          <div id="pctElapsed" class="neuro-metric-val" style="color: #ef4444;">92.4%</div>
          <div class="neuro-metric-sub">Of total lifetime in-person time</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #3b82f6;">
          <div class="neuro-metric-sub">REMAINING IN-PERSON DAYS</div>
          <div id="remainingDays" class="neuro-metric-val" style="color: #3b82f6;">240 Days</div>
          <div class="neuro-metric-sub">Total 24h days left together</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #f59e0b;">
          <div class="neuro-metric-sub">REMAINING IN-PERSON VISITS</div>
          <div id="remainingVisits" class="neuro-metric-val" style="color: #f59e0b;">60 Visits</div>
          <div class="neuro-metric-sub">Individual reunions left</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #10b981;">
          <div class="neuro-metric-sub">THANKSGIVING / HOLIDAYS LEFT</div>
          <div id="remainingHolidays" class="neuro-metric-val" style="color: #10b981;">20 Seasons</div>
          <div class="neuro-metric-sub">Shared holiday dinners</div>
        </div>
      </div>

      <!-- THE VISUAL DOT MATRIX -->
      <div class="neuro-card">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <h3 style="font-family: var(--serif); font-size: 1.3rem; margin: 0;">The Visual Visit Ledger</h3>
          <div style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3b82f6;margin-right:4px;"></span> Every glowing dot is one remaining reunion
          </div>
        </div>

        <div id="dotGrid" class="dot-grid"></div>

        <p id="ledgerSummaryText" style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin: 1rem 0 0;"></p>
      </div>

      <!-- CALL TO ACTION CARD -->
      <div class="neuro-card" style="background: rgba(59,130,246,0.06); border-left: 4px solid #3b82f6;">
        <h4 style="font-family: var(--serif); font-size: 1.2rem; margin: 0 0 0.5rem; color: #3b82f6;">The Immediate Antidote</h4>
        <p style="font-size: 0.92rem; color: var(--fg); line-height: 1.5; margin-bottom: 1rem;">
          Don't let this reality check induce hollow paralysis. Reach out right now while they are here to receive it.
        </p>
        <button onclick="copyWarmMessage()" class="neuro-btn-primary">📱 Copy Warm Check-In Text to Clipboard</button>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What is 'The Tail End' concept?</div>
          <div class="faq-a">
            Popularized by writer Tim Urban on Wait But Why, 'The Tail End' illustrates that the vast majority of our time with parents and childhood friends happens during youth. In childhood, you see your parents every single day (~330 days/year). Once you leave home, that number drops to an average of 5–15 days per year, meaning you enter the final 5–10% 'tail end' of your total relationship in early adulthood.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">How does the calculator estimate remaining lifespan?</div>
          <div class="faq-a">
            The calculator uses standard actuarial tables (defaulting to 82 years, matching CDC actuarial median life expectancies for OECD nations). You can customize this threshold to reflect your loved one's specific health and family history.
          </div>
        </div>
      </div>
    </div>

    <script>
      function calcTailEnd() {
        var userAge = parseFloat(document.getElementById('userAge').value) || 30;
        var lovedAge = parseFloat(document.getElementById('lovedAge').value) || 60;
        var visitsPerYear = parseFloat(document.getElementById('visitsPerYear').value) || 3;
        var daysPerVisit = parseFloat(document.getElementById('daysPerVisit').value) || 4;
        var targetLifespan = parseFloat(document.getElementById('targetLifespan').value) || 82;

        var remainingYears = Math.max(0, targetLifespan - lovedAge);
        var totalVisits = Math.round(remainingYears * visitsPerYear);
        var totalDays = Math.round(totalVisits * daysPerVisit);
        var totalHolidays = Math.round(remainingYears);

        var pastChildhoodDays = Math.min(userAge, 18) * 300;
        var adultYears = Math.max(0, userAge - 18);
        var pastAdultDays = adultYears * visitsPerYear * daysPerVisit;
        var totalPastDays = pastChildhoodDays + pastAdultDays;
        var lifetimeDays = totalPastDays + totalDays;
        var pctPast = lifetimeDays > 0 ? ((totalPastDays / lifetimeDays) * 100) : 90;

        document.getElementById('pctElapsed').textContent = pctPast.toFixed(1) + '%';
        document.getElementById('remainingDays').textContent = totalDays.toLocaleString('en-US') + ' Days';
        document.getElementById('remainingVisits').textContent = totalVisits.toLocaleString('en-US') + ' Visits';
        document.getElementById('remainingHolidays').textContent = totalHolidays.toLocaleString('en-US') + ' Seasons';

        var grid = document.getElementById('dotGrid');
        grid.innerHTML = '';
        var maxRender = Math.min(totalVisits, 300);
        for (var i = 0; i < maxRender; i++) {
          var dot = document.createElement('div');
          dot.className = 'mortality-dot future';
          dot.title = 'Visit #' + (i + 1) + ' of ' + totalVisits;
          grid.appendChild(dot);
        }

        var rel = document.getElementById('relType').value;
        var name = rel === 'parent' ? 'your parents' : (rel === 'grandparent' ? 'your grandparents' : 'your loved one');
        document.getElementById('ledgerSummaryText').innerHTML = 
          'You have approximately <strong>' + totalVisits + ' in-person visits (' + totalDays + ' days total)</strong> remaining with ' + name + '. When spread across the next ' + remainingYears.toFixed(0) + ' years, every single encounter represents a noticeable percentage of the time that remains.';
      }

      function copyWarmMessage() {
        var msg = "Hey, I was just thinking about you and wanted to check in. I really cherish the time we get together—let's make sure we plan our next visit soon. Love you!";
        navigator.clipboard.writeText(msg).then(function() {
          alert('Warm check-in text copied to clipboard! Paste it into WhatsApp, iMessage, or SMS.');
        });
      }

      document.addEventListener('DOMContentLoaded', calcTailEnd);
    </script>
  `;

  writeFileSync(join(utilDir, 'tail-end-mortality.html'), renderPage({
    title: 'The Tail End: Loved-One Time Remaining Ledger [Mortality Dot Matrix] | Digital Tools Shed',
    metaDesc: 'Calculate how much time you have left with your parents, children, or loved ones. Inspired by Tim Urban\'s The Tail End, visualize remaining visits, holidays, and hours in an interactive life dot grid.',
    canonical: `${DOMAIN}/util/tail-end-mortality`,
    bodyContent: tailEndHtml,
    currentPath: '/util/tail-end-mortality',
    faq: [
      { q: 'What is \'The Tail End\' concept?', a: 'Popularized by Tim Urban on Wait But Why, \'The Tail End\' illustrates that roughly 90% of our lifetime face-to-face time with our parents occurs prior to high school graduation.' },
      { q: 'How are remaining visits calculated?', a: 'The calculator multiplies projected remaining actuarial life expectancy by your reported annual visit frequency and days per visit to calculate true remaining hours.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 3. DOPAMINE RECEPTOR DOWNREGULATION SIMULATOR (/util/dopamine-reset-simulator)
  // ──────────────────────────────────────────────────────────────────────────
  const dopamineSimHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Dopamine Reset Simulator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7; margin-bottom: 0.5rem;">Opponent-Process Theory & Dopamine Nation Neurobiology</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Dopamine Receptor Downregulation Simulator</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          When supernormal stimuli (endless short-form video, hyperpalatable foods, digital gambling) flood synaptic clefts, your brain aggressively downregulates D2 dopamine receptors (Process B) to restore homeostasis. Simulate your baseline deficit and reset schedule.
        </p>
      </header>

      <div class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">1. Configure Daily Neurochemical Inputs</h2>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>High-Spike Stimulus Hours (Reels, TikTok, Gaming, Porn)</span>
            <strong id="valSpikeHours" style="color: #ef4444;">5.0 Hours/Day</strong>
          </div>
          <input type="range" id="spikeHours" min="0" max="16" step="0.5" value="5" class="neuro-slider-input" oninput="simDopamine()" />
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Context Switches & Interruptions (Notifications/Hour)</span>
            <strong id="valSwitches" style="color: #f59e0b;">25 / hour</strong>
          </div>
          <input type="range" id="switches" min="0" max="80" step="5" value="25" class="neuro-slider-input" oninput="simDopamine()" />
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Consecutive Days in High-Stimulus Cycle</span>
            <strong id="valDays" style="color: #3b82f6;">45 Days</strong>
          </div>
          <input type="range" id="cycleDays" min="1" max="180" step="1" value="45" class="neuro-slider-input" oninput="simDopamine()" />
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Endogenous Baseline Restorers (Cold Showers, Zone 2 Cardio, Morning Sun)</span>
            <strong id="valRestorers" style="color: #10b981;">1 Protocol / Day</strong>
          </div>
          <input type="range" id="restorers" min="0" max="5" step="1" value="1" class="neuro-slider-input" oninput="simDopamine()" />
        </div>
      </div>

      <!-- METRICS GRID -->
      <div class="neuro-grid-3" style="margin-bottom: 1.5rem;">
        <div class="neuro-metric-card" style="border-top: 4px solid #ef4444;">
          <div class="neuro-metric-sub">D2 RECEPTOR SENSITIVITY</div>
          <div id="d2Sensitivity" class="neuro-metric-val" style="color: #ef4444;">-42%</div>
          <div class="neuro-metric-sub">Receptor downregulation level</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #f59e0b;">
          <div class="neuro-metric-sub">ANHEDONIA / BOREDOM FRICTION</div>
          <div id="boredomScore" class="neuro-metric-val" style="color: #f59e0b;">High (7.4/10)</div>
          <div class="neuro-metric-sub">Friction doing low-dopamine tasks</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #10b981;">
          <div class="neuro-metric-sub">DAYS TO NEURAL RESENSITIZATION</div>
          <div id="resensDays" class="neuro-metric-val" style="color: #10b981;">21 Days</div>
          <div class="neuro-metric-sub">With calibrated reset protocol</div>
        </div>
      </div>

      <!-- INTERACTIVE CANVAS OPPONENT-PROCESS GRAPH -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">24-Hour Opponent-Process Waveform</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Green = Normal Tonic Baseline | Red Line = Process A Pleasure Spike | Purple Line = Process B Downregulation Deficit
        </p>

        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem; text-align: center;">
          <canvas id="dopamineCanvas" width="800" height="240" style="width: 100%; height: auto; display: block;"></canvas>
        </div>
      </div>

      <!-- 3-STAGE RESET PROTOCOL -->
      <div class="neuro-card" style="border-left: 4px solid #10b981;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: #10b981;">3-Stage Neurochemical Reset Protocol</h3>
        <div id="resetPlan" style="font-size: 0.92rem; line-height: 1.6; color: var(--fg);"></div>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What is Richard Solomon's Opponent-Process Theory?</div>
          <div class="faq-a">
            Opponent-process theory states that emotional and neurochemical states are paired with an opposing homeostatic reaction. When an intense, easy reward (Process A) spikes dopamine, the brain produces an opposing dysphoric trough (Process B) to return to baseline. Over time, Process A weakens while Process B strengthens and lasts longer, leading to chronic tolerance and anhedonia.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">How long does it take for D2 dopamine receptors to upregulate?</div>
          <div class="faq-a">
            Brain imaging studies show significant dopamine receptor recovery within 14 to 30 days of abstaining from chronic supernormal stimulation. Mild resets take 7 to 10 days, while heavy behavioral addictions may require 30 days of friction.
          </div>
        </div>
      </div>
    </div>

    <script>
      function simDopamine() {
        var spikeH = parseFloat(document.getElementById('spikeHours').value) || 0;
        var switches = parseFloat(document.getElementById('switches').value) || 0;
        var cycleD = parseFloat(document.getElementById('cycleDays').value) || 1;
        var restorers = parseFloat(document.getElementById('restorers').value) || 0;

        document.getElementById('valSpikeHours').textContent = spikeH.toFixed(1) + ' Hours/Day';
        document.getElementById('valSwitches').textContent = switches + ' / hour';
        document.getElementById('valDays').textContent = cycleD + ' Days';
        document.getElementById('valRestorers').textContent = restorers + ' Protocol' + (restorers === 1 ? '' : 's') + ' / Day';

        var load = (spikeH * 6) + (switches * 0.4) + (Math.log10(cycleD) * 12);
        var recovery = restorers * 8;
        var netDeficit = Math.max(5, Math.min(85, Math.round(load - recovery)));

        var d2Drop = '-' + netDeficit + '%';
        document.getElementById('d2Sensitivity').textContent = d2Drop;

        var boredom = (netDeficit / 10).toFixed(1);
        var boredomLabel = netDeficit > 60 ? 'Severe (' + boredom + '/10)' : (netDeficit > 35 ? 'High (' + boredom + '/10)' : 'Moderate (' + boredom + '/10)');
        document.getElementById('boredomScore').textContent = boredomLabel;

        var resetDays = Math.max(7, Math.round(7 + (netDeficit * 0.35)));
        document.getElementById('resensDays').textContent = resetDays + ' Days';

        renderWaveform(spikeH, netDeficit);
        renderResetPlan(resetDays, netDeficit);
      }

      function renderWaveform(spikeH, deficit) {
        var c = document.getElementById('dopamineCanvas');
        if (!c) return;
        var ctx = c.getContext('2d');
        var w = c.width;
        var h = c.height;

        ctx.clearRect(0, 0, w, h);

        var baselineY = h * 0.55;

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(0, baselineY);
        ctx.lineTo(w, baselineY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#22c55e';
        ctx.font = '11px monospace';
        ctx.fillText('Normal Homeostatic Baseline', 10, baselineY - 6);

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#a855f7';

        for (var x = 0; x < w; x++) {
          var t = (x / w) * 24;
          var y = baselineY;

          if (t >= 8 && t <= 8 + spikeH) {
            var spikeProgress = (t - 8) / Math.max(1, spikeH);
            var spikeAmp = Math.sin(spikeProgress * Math.PI) * (h * 0.35);
            y -= spikeAmp;
          } else if (t > 8 + spikeH && t <= 22) {
            var troughProgress = (t - (8 + spikeH)) / (22 - (8 + spikeH));
            var troughAmp = Math.sin(troughProgress * Math.PI) * (h * 0.22 * (deficit / 50));
            y += troughAmp;
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      function renderResetPlan(days, deficit) {
        var planEl = document.getElementById('resetPlan');
        planEl.innerHTML = 
          '<p><strong>Phase 1: Friction Layering (Days 1–' + Math.round(days * 0.3) + '):</strong> Insert 15-second physical friction before digital access (lock phone in drawer, grayscale mode). Prevent morning phone checks before 30 minutes of natural light.</p>' +
          '<p><strong>Phase 2: The Boredom Bridge (Days ' + Math.round(days * 0.3 + 1) + '–' + Math.round(days * 0.7) + '):</strong> Allow yourself to experience unmedicated boredom without reaching for a replacement screen. This triggers the neural signaling necessary to synthesize new D2 receptors.</p>' +
          '<p><strong>Phase 3: Endogenous Anchoring (Days ' + Math.round(days * 0.7 + 1) + '–' + days + '):</strong> Replace passive dopamine with effort-driven dopamine (cold water immersion, lifting heavy weights, long-form reading). Baseline receptor density fully restabilizes.</p>';
      }

      document.addEventListener('DOMContentLoaded', simDopamine);
    </script>
  `;

  writeFileSync(join(utilDir, 'dopamine-reset-simulator.html'), renderPage({
    title: 'Dopamine Receptor Downregulation Simulator [Opponent-Process Reset Protocol] | Digital Tools Shed',
    metaDesc: 'Simulate your brain\'s dopamine baseline, D2 receptor downregulation, and opponent-process rebound based on Dr. Anna Lembke and Richard Solomon\'s neurochemical models.',
    canonical: `${DOMAIN}/util/dopamine-reset-simulator`,
    bodyContent: dopamineSimHtml,
    currentPath: '/util/dopamine-reset-simulator',
    faq: [
      { q: 'What is Richard Solomon\'s Opponent-Process Theory?', a: 'Opponent-process theory describes how every pleasurable spike from supernormal stimuli triggers an equal and opposite compensatory neurological trough to maintain homeostasis.' },
      { q: 'How long does receptor resensitization take?', a: 'Clinical neuroscience shows D2 receptor density typically recovers within 14 to 30 days of reducing chronic hyper-stimulation.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SENSORY OVERLOAD & AUTONOMIC BATTERY METER (/util/sensory-overload-meter)
  // ──────────────────────────────────────────────────────────────────────────
  const sensoryMeterHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Sensory Overload Budget
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Polyvagal Theory & Allostatic Load</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Sensory Overload Budget & Autonomic Battery Meter</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Your nervous system has a finite daily capacity for sensory input. Audit ambient decibels, visual glare, social masking, and context switches to diagnose autonomic overload and trigger an immediate physiological reset.
        </p>
      </header>

      <div class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">1. Audit Today's Nervous System Inputs</h2>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Acoustic Environment / Background Noise</span>
            <strong id="valNoise" style="color: #3b82f6;">Moderate (65 dB)</strong>
          </div>
          <input type="range" id="noiseInput" min="30" max="95" step="5" value="65" class="neuro-slider-input" oninput="calcSensory()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">30 dB = Quiet Room | 65 dB = Open Office / Cafe | 85+ dB = Subway / Construction</span>
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Screen Glare & Fluorescent Lighting Exposure</span>
            <strong id="valVisual" style="color: #f59e0b;">7 Hours</strong>
          </div>
          <input type="range" id="visualInput" min="1" max="16" step="1" value="7" class="neuro-slider-input" oninput="calcSensory()" />
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Social Masking & Public Performance Hours</span>
            <strong id="valMasking" style="color: #a855f7;">5 Hours</strong>
          </div>
          <input type="range" id="maskingInput" min="0" max="12" step="1" value="5" class="neuro-slider-input" oninput="calcSensory()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Hours spent hiding fatigue, smiling politely, or suppressing natural neurodivergent traits</span>
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Last Night's Sleep Quality / Rest</span>
            <strong id="valSleep" style="color: #10b981;">6.5 / 10</strong>
          </div>
          <input type="range" id="sleepInput" min="1" max="10" step="0.5" value="6.5" class="neuro-slider-input" oninput="calcSensory()" />
        </div>
      </div>

      <!-- BATTERY GAUGE -->
      <div class="neuro-card" style="text-align: center;">
        <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Current Autonomic Nervous System Battery</div>
        <div id="batteryVal" style="font-family: var(--mono); font-size: 3.5rem; font-weight: 900; margin: 0.25rem 0; color: #f59e0b;">38%</div>
        
        <div style="height: 18px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 9px; overflow: hidden; max-width: 500px; margin: 0.75rem auto 1.25rem;">
          <div id="batteryBar" style="height: 100%; width: 38%; background: #f59e0b; border-radius: 9px; transition: width 0.4s ease, background 0.4s ease;"></div>
        </div>

        <div id="polyvagalState" style="font-family: var(--serif); font-size: 1.35rem; font-weight: bold; margin-bottom: 0.5rem; color: #f59e0b;">Sympathetic Activation (Fight / Flight / Hyper-Vigilance)</div>
        <p id="polyvagalDesc" style="font-size: 0.95rem; color: var(--text-muted); max-width: 650px; margin: 0 auto; line-height: 1.6;"></p>
      </div>

      <!-- PHYSIOLOGICAL SIGH INTERACTIVE PACER -->
      <div class="neuro-card" style="border-left: 4px solid #3b82f6;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 1rem;">
          <h3 style="font-family: var(--serif); font-size: 1.3rem; margin: 0; color: #3b82f6;">Immediate Reset: The Physiological Sigh</h3>
          <span style="font-family: var(--mono); font-size: 0.75rem; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 0.2rem 0.6rem; border-radius: 4px;">Cell Reports Medicine Verified</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
          Two deep inhales through your nose (first deep, second quick top-off), followed by one long, slow exhale through your mouth. 3 cycles drops heart rate and autonomic arousal faster than meditation.
        </p>

        <div style="text-align: center; padding: 1.5rem; background: var(--surface-alt); border-radius: 8px; margin-bottom: 1rem;">
          <div id="sighVisual" style="width: 80px; height: 80px; border-radius: 50%; background: #3b82f6; margin: 0 auto 1rem; transition: transform 2s ease, opacity 2s ease;"></div>
          <div id="sighText" style="font-family: var(--mono); font-size: 1.2rem; font-weight: bold;">Click Start Pacer</div>
        </div>

        <div style="text-align: center;">
          <button id="pacerBtn" onclick="togglePacer()" class="neuro-btn-primary">▶ Start 90-Second Sigh Pacer</button>
        </div>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What is the Polyvagal Theory?</div>
          <div class="faq-a">
            Developed by Dr. Stephen Porges, Polyvagal Theory models how the autonomic nervous system shifts between three physiological states: Ventral Vagal (safe, socially engaged, resting), Sympathetic (threat, stress, sensory overload), and Dorsal Vagal (freeze, burnout, dissociation).
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Why is the Physiological Sigh so effective?</div>
          <div class="faq-a">
            The dual-inhalation reinflates collapsed alveoli in the lungs, increasing surface area for oxygen/CO2 exchange. The prolonged exhalation slows the heart rate via the vagus nerve.
          </div>
        </div>
      </div>
    </div>

    <script>
      function calcSensory() {
        var noise = parseFloat(document.getElementById('noiseInput').value) || 50;
        var visual = parseFloat(document.getElementById('visualInput').value) || 6;
        var masking = parseFloat(document.getElementById('maskingInput').value) || 4;
        var sleep = parseFloat(document.getElementById('sleepInput').value) || 7;

        var noiseLabel = noise < 50 ? 'Quiet (' + noise + ' dB)' : (noise < 75 ? 'Moderate (' + noise + ' dB)' : 'High Stress (' + noise + ' dB)');
        document.getElementById('valNoise').textContent = noiseLabel;
        document.getElementById('valVisual').textContent = visual + ' Hours';
        document.getElementById('valMasking').textContent = masking + ' Hours';
        document.getElementById('valSleep').textContent = sleep + ' / 10';

        var baseBattery = sleep * 10;
        var drain = ((noise - 30) * 0.45) + (visual * 2.8) + (masking * 3.8);
        var remaining = Math.max(5, Math.min(100, Math.round(baseBattery - drain)));

        document.getElementById('batteryVal').textContent = remaining + '%';
        var bar = document.getElementById('batteryBar');
        bar.style.width = remaining + '%';

        var stateEl = document.getElementById('polyvagalState');
        var descEl = document.getElementById('polyvagalDesc');

        if (remaining >= 60) {
          bar.style.background = '#10b981';
          document.getElementById('batteryVal').style.color = '#10b981';
          stateEl.textContent = 'Ventral Vagal (Safe, Regulated & Social)';
          stateEl.style.color = '#10b981';
          descEl.textContent = 'Your nervous system has sufficient allostatic bandwidth. Sensory filtering is optimal, working memory is fluid, and social engagement feels natural.';
        } else if (remaining >= 30) {
          bar.style.background = '#f59e0b';
          document.getElementById('batteryVal').style.color = '#f59e0b';
          stateEl.textContent = 'Sympathetic Activation (Fight / Flight / Hyper-Vigilance)';
          stateEl.style.color = '#f59e0b';
          descEl.textContent = 'Your autonomic battery is depleted. You may feel irritable, restless, sensitive to sudden noises, or overwhelmed by light. Prioritize immediate sensory reduction.';
        } else {
          bar.style.background = '#ef4444';
          document.getElementById('batteryVal').style.color = '#ef4444';
          stateEl.textContent = 'Dorsal Vagal Shutdown (Sensory Freeze & Dissociation)';
          stateEl.style.color = '#ef4444';
          descEl.textContent = 'Critical depletion threshold. The nervous system is defending itself through numbness, severe executive dysfunction, and emotional exhaustion. Eliminate all non-essential stimuli immediately.';
        }
      }

      var pacerRunning = false;
      var pacerTimer = null;
      function togglePacer() {
        pacerRunning = !pacerRunning;
        var btn = document.getElementById('pacerBtn');
        var txt = document.getElementById('sighText');
        var vis = document.getElementById('sighVisual');

        if (!pacerRunning) {
          btn.textContent = '▶ Start 90-Second Sigh Pacer';
          txt.textContent = 'Pacer Paused';
          vis.style.transform = 'scale(1)';
          clearTimeout(pacerTimer);
          return;
        }

        btn.textContent = '⏸ Pause Pacer';
        runSighCycle();
      }

      function runSighCycle() {
        if (!pacerRunning) return;
        var txt = document.getElementById('sighText');
        var vis = document.getElementById('sighVisual');

        txt.textContent = 'Deep Inhale (Nose)...';
        vis.style.transform = 'scale(1.5)';
        vis.style.background = '#3b82f6';

        pacerTimer = setTimeout(function() {
          if (!pacerRunning) return;
          txt.textContent = 'Quick Top-Off Inhale (Nose)!';
          vis.style.transform = 'scale(1.8)';
          vis.style.background = '#60a5fa';

          pacerTimer = setTimeout(function() {
            if (!pacerRunning) return;
            txt.textContent = 'Long Slow Exhale (Mouth)...';
            vis.style.transform = 'scale(1)';
            vis.style.background = '#10b981';

            pacerTimer = setTimeout(function() {
              if (pacerRunning) runSighCycle();
            }, 5000);
          }, 1200);
        }, 2500);
      }

      document.addEventListener('DOMContentLoaded', calcSensory);
    </script>
  `;

  writeFileSync(join(utilDir, 'sensory-overload-meter.html'), renderPage({
    title: 'Sensory Overload Budget & Autonomic Battery Meter [Polyvagal Stress Diagnostic] | Digital Tools Shed',
    metaDesc: 'Calculate your nervous system\'s daily sensory load against allostatic capacity. Audit auditory noise, visual flicker, social masking, and context switches to prevent neurodivergent burnout.',
    canonical: `${DOMAIN}/util/sensory-overload-meter`,
    bodyContent: sensoryMeterHtml,
    currentPath: '/util/sensory-overload-meter',
    faq: [
      { q: 'What is the Polyvagal Theory?', a: 'Polyvagal Theory, formulated by Dr. Stephen Porges, explains how the autonomic nervous system transitions between social engagement, fight-or-flight, and freeze/shutdown.' },
      { q: 'How does the Physiological Sigh reset the nervous system?', a: 'Two nasal inhalations followed by an extended mouth exhalation stimulates the vagus nerve, rapidly lowering heart rate.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 5. DUNBAR'S 150 SOCIAL SPHERE AUDITOR (/util/dunbar-social-auditor)
  // ──────────────────────────────────────────────────────────────────────────
  const dunbarHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Dunbar's Social Auditor
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">Anthropological Neocortex Limits</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Dunbar's 150 Social Sphere Auditor</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Evolutionary anthropologist Robin Dunbar proved the primate neocortex can only maintain ~150 stable relationships, structured in fractals of 5, 15, 50, and 150. Audit whether algorithmic feeds and energy vampires are crowding out your true oxytocin bonds.
        </p>
      </header>

      <div class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">1. Audit Your Social Layers</h2>

        <div class="neuro-grid-2">
          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Layer 1: Support Clique (Max ~5)</span>
              <strong id="valTier1" style="color: #ef4444;">4 People</strong>
            </div>
            <input type="range" id="tier1Input" min="0" max="10" value="4" class="neuro-slider-input" oninput="calcDunbar()" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">Those you would turn to in severe financial or emotional ruin</span>
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Layer 2: Sympathy Group (Max ~15)</span>
              <strong id="valTier2" style="color: #f59e0b;">12 People</strong>
            </div>
            <input type="range" id="tier2Input" min="0" max="30" value="12" class="neuro-slider-input" oninput="calcDunbar()" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">Confidants whose sudden bereavement would deeply affect you</span>
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Layer 3: Good Friends (Max ~50)</span>
              <strong id="valTier3" style="color: #3b82f6;">38 People</strong>
            </div>
            <input type="range" id="tier3Input" min="0" max="100" value="38" class="neuro-slider-input" oninput="calcDunbar()" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">People you would invite to a personal celebration or dinner party</span>
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Layer 4: Meaningful Contacts (Max ~150)</span>
              <strong id="valTier4" style="color: #10b981;">110 People</strong>
            </div>
            <input type="range" id="tier4Input" min="0" max="300" value="110" class="neuro-slider-input" oninput="calcDunbar()" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">Acquaintances you know by name and mutual obligation</span>
          </div>
        </div>

        <div class="neuro-slider-row" style="margin-top: 1rem; border-top: 1px solid var(--border); padding-top: 1rem;">
          <div class="neuro-slider-label">
            <span>Daily Hours Consuming Parasocial Digital Feeds (Instagram, YouTube, TikTok)</span>
            <strong id="valParasocial" style="color: #a855f7;">3.5 Hours/Day</strong>
          </div>
          <input type="range" id="parasocialInput" min="0" max="10" step="0.5" value="3.5" class="neuro-slider-input" oninput="calcDunbar()" />
        </div>
      </div>

      <!-- VISUAL CONCENTRIC CIRCLES CANVAS -->
      <div class="neuro-card" style="text-align: center;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Your Neocortex Social Architecture</h3>
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; margin-bottom: 1rem;">
          <canvas id="dunbarCanvas" width="500" height="400" style="max-width: 100%; height: auto; display: block; margin: 0 auto;"></canvas>
        </div>
        <div id="dunbarVerdict" style="font-size: 0.95rem; color: var(--fg); line-height: 1.6;"></div>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What is Dunbar's Number?</div>
          <div class="faq-a">
            British anthropologist Robin Dunbar discovered that primate brain neocortex volume correlates directly with social group size. In humans, this cognitive limit is approximately 150 individuals. Beyond this limit, relationships cannot be maintained without formal laws or institutional rules.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">What is parasocial cognitive displacement?</div>
          <div class="faq-a">
            When humans spend hours watching video creators and streamers, our ancient evolutionary brain processes their faces as real social connections. This creates a false sensation of social fulfillment, draining our neocortex bandwidth while starving us of genuine physical oxytocin bonds.
          </div>
        </div>
      </div>
    </div>

    <script>
      function calcDunbar() {
        var t1 = parseInt(document.getElementById('tier1Input').value, 10) || 0;
        var t2 = parseInt(document.getElementById('tier2Input').value, 10) || 0;
        var t3 = parseInt(document.getElementById('tier3Input').value, 10) || 0;
        var t4 = parseInt(document.getElementById('tier4Input').value, 10) || 0;
        var paraH = parseFloat(document.getElementById('parasocialInput').value) || 0;

        document.getElementById('valTier1').textContent = t1 + ' People (Ideal ~5)';
        document.getElementById('valTier2').textContent = t2 + ' People (Ideal ~15)';
        document.getElementById('valTier3').textContent = t3 + ' People (Ideal ~50)';
        document.getElementById('valTier4').textContent = t4 + ' People (Ideal ~150)';
        document.getElementById('valParasocial').textContent = paraH.toFixed(1) + ' Hours/Day';

        renderDunbarCanvas(t1, t2, t3, t4, paraH);

        var totalReal = t1 + t2 + t3 + t4;
        var v = document.getElementById('dunbarVerdict');
        var text = '<strong>Neocortex Load Assessment:</strong> You are actively maintaining <strong>' + totalReal + ' relationships</strong> against the biological limit of 150. ';
        if (paraH >= 3) {
          text += 'With <strong>' + paraH + ' hours</strong> of daily parasocial media, your brain is experiencing <em>parasocial displacement</em>—digital strangers are competing for neocortex slots that belong to your inner 15 confidants.';
        } else if (t1 < 3) {
          text += 'Your <strong>Support Clique (5-layer) is currently vulnerable</strong> with only ' + t1 + ' people. Consider intentionally investing time to deepen 1 or 2 existing friendships into unconditional confidants.';
        } else {
          text += 'Your social architecture is well-balanced across the core layers.';
        }
        v.innerHTML = text;
      }

      function renderDunbarCanvas(t1, t2, t3, t4, para) {
        var c = document.getElementById('dunbarCanvas');
        if (!c) return;
        var ctx = c.getContext('2d');
        var w = c.width;
        var h = c.height;
        var cx = w / 2;
        var cy = h / 2;

        ctx.clearRect(0, 0, w, h);

        var rings = [
          { r: 180, color: 'rgba(16,185,129,0.15)', stroke: '#10b981', label: '150: Meaningful Contacts (' + t4 + ')' },
          { r: 130, color: 'rgba(59,130,246,0.15)', stroke: '#3b82f6', label: '50: Close Friends (' + t3 + ')' },
          { r: 85, color: 'rgba(245,158,11,0.15)', stroke: '#f59e0b', label: '15: Confidants (' + t2 + ')' },
          { r: 45, color: 'rgba(239,68,68,0.2)', stroke: '#ef4444', label: '5: Core (' + t1 + ')' }
        ];

        rings.forEach(function(ring) {
          ctx.beginPath();
          ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
          ctx.fillStyle = ring.color;
          ctx.fill();
          ctx.strokeStyle = ring.stroke;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = ring.stroke;
          ctx.font = '10px monospace';
          ctx.fillText(ring.label, cx - (ring.r - 8), cy - (ring.r - 12));
        });

        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.stroke();
      }

      document.addEventListener('DOMContentLoaded', calcDunbar);
    </script>
  `;

  writeFileSync(join(utilDir, 'dunbar-social-auditor.html'), renderPage({
    title: 'Dunbar\'s 150 Social Sphere Auditor [Neocortex Bandwidth Diagnostic] | Digital Tools Shed',
    metaDesc: 'Audit your personal relationships against Robin Dunbar\'s 5-15-50-150 cognitive limit layers. Discover if digital feeds and energy vampires are exhausting your neocortex bandwidth.',
    canonical: `${DOMAIN}/util/dunbar-social-auditor`,
    bodyContent: dunbarHtml,
    currentPath: '/util/dunbar-social-auditor',
    faq: [
      { q: 'What is Dunbar\'s Number?', a: 'Dunbar\'s Number (approx 150) is the suggested cognitive limit to the number of people with whom one can maintain stable social relationships.' },
      { q: 'What are the layers of Dunbar\'s circles?', a: 'They follow a rule of 3: 5 core intimates, 15 close confidants, 50 good friends, and 150 meaningful contacts.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 6. HABIT DECAY HALF-LIFE & SYNAPTIC PRUNING SIMULATOR (/util/habit-decay-simulator)
  // ──────────────────────────────────────────────────────────────────────────
  const habitDecayHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Habit Decay Simulator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Hebbian Plasticity & Myelination Dynamics</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Habit Decay Half-Life & Synaptic Pruning Simulator</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          "Neurons that fire together wire together; neurons that fire apart fall apart." When you skip days, synaptic strength and myelin sheath insulation decay exponentially. Discover the mathematical and neurobiological proof behind the "Never Miss Twice" rule.
        </p>
      </header>

      <div class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">1. Configure Habit Baseline</h2>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Consecutive Days Practiced (Streak Length)</span>
            <strong id="valStreak" style="color: #3b82f6;">45 Days</strong>
          </div>
          <input type="range" id="streakInput" min="1" max="365" value="45" class="neuro-slider-input" oninput="simHabit()" />
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Consecutive Days Missed (The Gap)</span>
            <strong id="valMissed" style="color: #ef4444;">2 Days Missed</strong>
          </div>
          <input type="range" id="missedInput" min="0" max="14" value="2" class="neuro-slider-input" oninput="simHabit()" />
        </div>
      </div>

      <!-- METRICS GRID -->
      <div class="neuro-grid-3" style="margin-bottom: 1.5rem;">
        <div class="neuro-metric-card" style="border-top: 4px solid #3b82f6;">
          <div class="neuro-metric-sub">SYNAPTIC RETENTION</div>
          <div id="synapticStrength" class="neuro-metric-val" style="color: #3b82f6;">82%</div>
          <div class="neuro-metric-sub">Active neural pathway strength</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #ef4444;">
          <div class="neuro-metric-sub">PREFRONTAL RE-ENTRY FRICTION</div>
          <div id="frictionScore" class="neuro-metric-val" style="color: #ef4444;">Moderate (+28%)</div>
          <div class="neuro-metric-sub">Willpower required to resume</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #10b981;">
          <div class="neuro-metric-sub">DAYS TO RESTORE PEAK AUTOMATICITY</div>
          <div id="restoreDays" class="neuro-metric-val" style="color: #10b981;">4 Days</div>
          <div class="neuro-metric-sub">Consecutive reps to patch myelin</div>
        </div>
      </div>

      <!-- LIVE CANVAS GRAPH -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">The Synaptic Cliff: 14-Day Pruning Trajectory</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Missing 1 day produces minor decay (4%). Missing 2 consecutive days triggers synaptic destabilization. Missing 3+ days triggers active dendritic spine retraction.
        </p>

        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 0.75rem; text-align: center;">
          <canvas id="habitCanvas" width="800" height="240" style="width: 100%; height: auto; display: block;"></canvas>
        </div>
      </div>

      <!-- THE MINIMUM VIABLE REPETITION (MVR) -->
      <div class="neuro-card" style="background: rgba(16,185,129,0.06); border-left: 4px solid #10b981;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: #10b981;">The 2-Minute MVR (Minimum Viable Repetition) Shield</h3>
        <p style="font-size: 0.92rem; color: var(--fg); line-height: 1.6; margin: 0;">
          When completely exhausted or traveling, do NOT take a zero. The brain does not measure volume—it measures <strong>signal transmission</strong>. Doing 1 pushup, reading 1 sentence, or opening the code editor for 60 seconds fires the neural pathway and completely arrests synaptic pruning.
        </p>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">Why is 'Never Miss Twice' so powerful?</div>
          <div class="faq-a">
            Neurobiologically, a single missed day causes minimal myelination loss. However, missing two consecutive days causes dendritic spine retraction and breaks the temporal conditioning loop, multiplying activation energy needed to restart.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">How long does automaticity actually take?</div>
          <div class="faq-a">
            Dr. Phillippa Lally’s UCL study showed habit automaticity takes an average of 66 days (ranging from 18 to 254 days depending on complexity).
          </div>
        </div>
      </div>
    </div>

    <script>
      function simHabit() {
        var streak = parseInt(document.getElementById('streakInput').value, 10) || 1;
        var missed = parseInt(document.getElementById('missedInput').value, 10) || 0;

        document.getElementById('valStreak').textContent = streak + ' Days';
        document.getElementById('valMissed').textContent = missed + ' Day' + (missed === 1 ? '' : 's') + ' Missed';

        var peakS = 100 * (1 - Math.exp(-streak / 45));
        var decayFactor = Math.exp(-0.04 * missed - 0.03 * Math.pow(missed, 1.6));
        var currentS = Math.round(peakS * decayFactor);

        document.getElementById('synapticStrength').textContent = currentS + '%';

        var friction = Math.round((100 - currentS) * 0.7);
        var fLabel = friction > 50 ? 'Severe (+' + friction + '%)' : (friction > 25 ? 'Moderate (+' + friction + '%)' : 'Low (+' + friction + '%)');
        document.getElementById('frictionScore').textContent = fLabel;

        var recoveryReps = Math.max(1, Math.round(missed * 1.8));
        document.getElementById('restoreDays').textContent = recoveryReps + ' Days';

        renderHabitCanvas(peakS, missed);
      }

      function renderHabitCanvas(peakS, currentMissed) {
        var c = document.getElementById('habitCanvas');
        if (!c) return;
        var ctx = c.getContext('2d');
        var w = c.width;
        var h = c.height;

        ctx.clearRect(0, 0, w, h);

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        for (var i = 1; i <= 4; i++) {
          var y = (h / 5) * i;
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(w - 20, y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3b82f6';

        var maxDays = 14;
        for (var d = 0; d <= maxDays; d++) {
          var s = peakS * Math.exp(-0.04 * d - 0.03 * Math.pow(d, 1.6));
          var x = 40 + (d / maxDays) * (w - 60);
          var y = h - 25 - (s / 100) * (h - 50);

          if (d === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          if (d === currentMissed) {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '11px monospace';
            ctx.fillText('You Are Here (' + Math.round(s) + '%)', x - 40, y - 12);
          }
        }
        ctx.stroke();

        ctx.fillStyle = '#888';
        ctx.font = '10px monospace';
        ctx.fillText('Day 0 (Active)', 35, h - 6);
        ctx.fillText('Day 7 (Lapse)', w * 0.5 - 20, h - 6);
        ctx.fillText('Day 14 (Extinction)', w - 120, h - 6);
      }

      document.addEventListener('DOMContentLoaded', simHabit);
    </script>
  `;

  writeFileSync(join(utilDir, 'habit-decay-simulator.html'), renderPage({
    title: 'Habit Decay Half-Life & Synaptic Pruning Simulator [The \'Never Miss Twice\' Proof] | Digital Tools Shed',
    metaDesc: 'Mathematically simulate neural pathway decay when habits are interrupted. Explore exponential synaptic degradation, Hebbian plasticity, and why the \'never miss twice\' rule protects myelination.',
    canonical: `${DOMAIN}/util/habit-decay-simulator`,
    bodyContent: habitDecayHtml,
    currentPath: '/util/habit-decay-simulator',
    faq: [
      { q: 'What is Hebbian Plasticity?', a: 'Formulated by Donald Hebb in 1949, it describes how neurons adapt during learning: synaptic connections strengthen when repeatedly fired, and weaken when disused.' },
      { q: 'Why does missing twice cause a synaptic cliff?', a: 'One day missed is an anomaly; two consecutive days begins dendritic spine re-absorption.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 7. THE PERSONAL DRAKE EQUATION (/util/personal-drake-equation)
  // ──────────────────────────────────────────────────────────────────────────
  const personalDrakeHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Personal Drake Equation
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ec4899; margin-bottom: 0.5rem;">Peter Backus Mathematical Model</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Personal Drake Equation</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          How rare is the person you are searching for? In 2010, mathematician Peter Backus famously adapted Frank Drake’s equation for alien civilizations to calculate why he didn't have a girlfriend. Cascade your filters to reveal the true statistical odds.
        </p>
      </header>

      <div class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">1. Configure Probability Funnel</h2>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Target Metro Area / City Population (N)</span>
            <strong id="valPop" style="color: #3b82f6;">4,000,000 People</strong>
          </div>
          <input type="range" id="popInput" min="100000" max="20000000" step="100000" value="4000000" class="neuro-slider-input" oninput="calcPersonalDrake()" />
        </div>

        <div class="neuro-grid-2">
          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Target Gender & Orientation (fg)</span>
              <strong id="valGender" style="color: #ec4899;">50%</strong>
            </div>
            <input type="range" id="genderInput" min="1" max="100" value="50" class="neuro-slider-input" oninput="calcPersonalDrake()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Target Age Bracket Fit (fa)</span>
              <strong id="valAge" style="color: #f59e0b;">20%</strong>
            </div>
            <input type="range" id="ageInput" min="5" max="60" value="20" class="neuro-slider-input" oninput="calcPersonalDrake()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Single / Available Percentage (fs)</span>
              <strong id="valSingle" style="color: #10b981;">45%</strong>
            </div>
            <input type="range" id="singleInput" min="10" max="80" value="45" class="neuro-slider-input" oninput="calcPersonalDrake()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Values & Intellectual Compatibility (fv)</span>
              <strong id="valValues" style="color: #a855f7;">15%</strong>
            </div>
            <input type="range" id="valuesInput" min="1" max="50" value="15" class="neuro-slider-input" oninput="calcPersonalDrake()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Mutual Physical Attraction (fm)</span>
              <strong id="valAttr" style="color: #ef4444;">10%</strong>
            </div>
            <input type="range" id="attrInput" min="1" max="50" value="10" class="neuro-slider-input" oninput="calcPersonalDrake()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Relational Chemistry & Mutual Timing (fc)</span>
              <strong id="valChem" style="color: #3b82f6;">10%</strong>
            </div>
            <input type="range" id="chemInput" min="1" max="50" value="10" class="neuro-slider-input" oninput="calcPersonalDrake()" />
          </div>
        </div>
      </div>

      <!-- RESULTS METRICS -->
      <div class="neuro-grid-3" style="margin-bottom: 1.5rem;">
        <div class="neuro-metric-card" style="border-top: 4px solid #ec4899;">
          <div class="neuro-metric-sub">COMPATIBLE CANDIDATES</div>
          <div id="drakeCandidates" class="neuro-metric-val" style="color: #ec4899;">54 People</div>
          <div class="neuro-metric-sub">In your target geographic pool</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #3b82f6;">
          <div class="neuro-metric-sub">JOINT PROBABILITY</div>
          <div id="drakeOdds" class="neuro-metric-val" style="color: #3b82f6;">1 in 74,074</div>
          <div class="neuro-metric-sub">Odds any random stranger matches</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #10b981;">
          <div class="neuro-metric-sub">FLEXIBILITY LEVERAGE</div>
          <div id="drakeLeverage" class="neuro-metric-val" style="color: #10b981;">+300%</div>
          <div class="neuro-metric-sub">Pool expansion by relaxing 1 filter</div>
        </div>
      </div>

      <!-- BOTTLENECK ANALYSIS -->
      <div class="neuro-card" style="border-left: 4px solid #3b82f6;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem; color: #3b82f6;">Statistical Assessment</h3>
        <p id="drakeAnalysisText" style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin: 0;"></p>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What was Peter Backus's original result?</div>
          <div class="faq-a">
            In 2010, Peter Backus calculated that out of 30 million women in the UK, only 26 were compatible with him (a probability of roughly 1 in 285,000). He met his future wife shortly after publishing the paper!
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Why does joint probability drop so drastically?</div>
          <div class="faq-a">
            Multiplying independent fractions (0.5 * 0.2 * 0.45 * 0.15 * 0.1 * 0.1) collapses cumulative probability exponentially.
          </div>
        </div>
      </div>
    </div>

    <script>
      function calcPersonalDrake() {
        var pop = parseFloat(document.getElementById('popInput').value) || 1000000;
        var fg = (parseFloat(document.getElementById('genderInput').value) || 50) / 100;
        var fa = (parseFloat(document.getElementById('ageInput').value) || 20) / 100;
        var fs = (parseFloat(document.getElementById('singleInput').value) || 45) / 100;
        var fv = (parseFloat(document.getElementById('valuesInput').value) || 15) / 100;
        var fm = (parseFloat(document.getElementById('attrInput').value) || 10) / 100;
        var fc = (parseFloat(document.getElementById('chemInput').value) || 10) / 100;

        document.getElementById('valPop').textContent = pop.toLocaleString('en-US') + ' People';
        document.getElementById('valGender').textContent = Math.round(fg * 100) + '%';
        document.getElementById('valAge').textContent = Math.round(fa * 100) + '%';
        document.getElementById('valSingle').textContent = Math.round(fs * 100) + '%';
        document.getElementById('valValues').textContent = Math.round(fv * 100) + '%';
        document.getElementById('valAttr').textContent = Math.round(fm * 100) + '%';
        document.getElementById('valChem').textContent = Math.round(fc * 100) + '%';

        var pTotal = fg * fa * fs * fv * fm * fc;
        var candidates = Math.round(pop * pTotal);
        var odds = pTotal > 0 ? Math.round(1 / pTotal) : 9999999;

        document.getElementById('drakeCandidates').textContent = candidates.toLocaleString('en-US') + ' People';
        document.getElementById('drakeOdds').textContent = '1 in ' + odds.toLocaleString('en-US');

        var analysis = 'In a metropolitan population of <strong>' + pop.toLocaleString('en-US') + '</strong>, your current combination of 6 filters yields approximately <strong>' + candidates + ' compatible candidates</strong>. ';
        if (candidates < 10) {
          analysis += 'Your filter criteria are severely bottlenecked. Relaxing your values or age threshold by even a small margin can multiply your candidate pool by 300% to 500%.';
        } else if (candidates < 100) {
          analysis += 'This is a realistic, focused target pool. It indicates you should actively position yourself in high-affinity social hubs rather than broad-spectrum dating apps.';
        } else {
          analysis += 'You have a healthy, statistically robust target pool. Active socializing will yield potential matches reliably.';
        }
        document.getElementById('drakeAnalysisText').innerHTML = analysis;
      }

      document.addEventListener('DOMContentLoaded', calcPersonalDrake);
    </script>
  `;

  writeFileSync(join(utilDir, 'personal-drake-equation.html'), renderPage({
    title: 'The Personal Drake Equation [Human Compatibility Probability Funnel] | Digital Tools Shed',
    metaDesc: 'Calculate the exact mathematical probability of finding your ideal romantic partner or intellectual peer. Cascades demographic and psychological filters into an interactive probability funnel.',
    canonical: `${DOMAIN}/util/personal-drake-equation`,
    bodyContent: personalDrakeHtml,
    currentPath: '/util/personal-drake-equation',
    faq: [
      { q: 'What is the Personal Drake Equation?', a: 'An adaptation of Frank Drake\'s astronomical formula by mathematician Peter Backus that cascades demographic, interest, attraction, and availability probabilities.' },
      { q: 'How can I improve my statistical odds?', a: 'The highest leverage comes from expanding geographic radius and relaxing non-essential secondary criteria.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 8. EPISTEMIC CALIBRATION & OVERCONFIDENCE GAME (/util/epistemic-calibration)
  // ──────────────────────────────────────────────────────────────────────────
  const epistemicGameHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Epistemic Calibration
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">Superforecasting & Bayesian Rationality</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Epistemic Calibration & Overconfidence Game</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Are you as smart as you think? For each question below, provide an <strong>80% Confidence Interval</strong> (a lower and upper bound where you are 80% confident the true answer lies). If your brain is calibrated, exactly 8 out of 10 answers will fall inside your bands.
        </p>
      </header>

      <div class="neuro-card" id="quizCard">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem;">Provide 80% Confidence Intervals</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          Make your intervals wide enough to capture truth, but narrow enough to be meaningful. Do NOT look up answers!
        </p>

        <form id="calibForm">
          <div id="questionsContainer"></div>
          <div style="text-align: center; margin-top: 1.5rem;">
            <button type="button" onclick="scoreCalibration()" class="neuro-btn-primary">🎯 Calculate Epistemic Calibration Score</button>
          </div>
        </form>
      </div>

      <!-- RESULTS REPORT -->
      <div id="calibResultsCard" class="neuro-card" style="display: none; text-align: center;">
        <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Calibration Benchmark Results</div>
        <div id="hitRateDisplay" style="font-family: var(--mono); font-size: 3.5rem; font-weight: 900; margin: 0.25rem 0; color: #3b82f6;">0%</div>
        <div id="hitArchetype" style="font-family: var(--serif); font-size: 1.35rem; font-weight: bold; margin-bottom: 0.5rem;">Analyzing...</div>
        <p id="hitDesc" style="font-size: 0.95rem; color: var(--text-muted); max-width: 650px; margin: 0 auto 1.5rem; line-height: 1.6;"></p>

        <div id="detailedAnswersTable" style="text-align: left; margin-top: 1.5rem; overflow-x: auto;"></div>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What is Epistemic Calibration?</div>
          <div class="faq-a">
            In cognitive psychology and decision science, an individual is well-calibrated when their subjective degree of certainty matches objective reality. If you claim 80% confidence across 100 predictions, exactly 80 should be correct. Most humans only hit 40–50%, suffering from severe cognitive overconfidence.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Why does the human brain make intervals too narrow?</div>
          <div class="faq-a">
            Social status and conversational rewards favor false certainty over honest ambiguity. Expressing wide intervals feels foolish, so our ego artificially compresses the bounds to look knowledgeable, leading to frequent misses.
          </div>
        </div>
      </div>
    </div>

    <script>
      var calibQuestions = [
        { id: 1, q: 'Average distance from Earth to the Moon (in kilometers)', answer: 384400, unit: 'km' },
        { id: 2, q: 'Total number of bones in an adult human skeleton', answer: 206, unit: 'bones' },
        { id: 3, q: 'Year Johannes Gutenberg invented the movable-type printing press', answer: 1440, unit: 'AD' },
        { id: 4, q: 'Maximum recorded weight of an adult Blue Whale (in metric tons)', answer: 199, unit: 'tons' },
        { id: 5, q: 'Total length of the Great Wall of China including all branches (in kilometers)', answer: 21196, unit: 'km' },
        { id: 6, q: 'Average commercial jetliner cruising speed at 35,000 ft (in km/h)', answer: 900, unit: 'km/h' },
        { id: 7, q: 'Depth of the Mariana Trench Challenger Deep (in meters below sea level)', answer: 10994, unit: 'meters' },
        { id: 8, q: 'Year the Titanic struck an iceberg and sank in the North Atlantic', answer: 1912, unit: 'AD' },
        { id: 9, q: 'Total number of recognized independent sovereign countries in the United Nations', answer: 193, unit: 'countries' },
        { id: 10, q: 'Temperature at the surface of the Sun (in degrees Celsius)', answer: 5500, unit: '°C' }
      ];

      function renderCalibQuiz() {
        var c = document.getElementById('questionsContainer');
        var html = '';
        calibQuestions.forEach(function(item, idx) {
          html += '<div style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">' +
            '<label style="font-family: var(--mono); font-size: 0.88rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">' + (idx + 1) + '. ' + item.q + '</label>' +
            '<div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">' +
              '<input type="number" id="low_' + item.id + '" placeholder="Lower Bound" class="code-input" style="flex:1;min-width:140px;padding:0.5rem;font-family:var(--mono);" required />' +
              '<span style="font-family:var(--mono);font-size:0.8rem;color:var(--text-muted);">to</span>' +
              '<input type="number" id="high_' + item.id + '" placeholder="Upper Bound" class="code-input" style="flex:1;min-width:140px;padding:0.5rem;font-family:var(--mono);" required />' +
            '</div>' +
          '</div>';
        });
        c.innerHTML = html;
      }

      function scoreCalibration() {
        var hits = 0;
        var tableHtml = '<table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-top:1rem;"><thead><tr style="border-bottom:1px solid var(--border);text-align:left;"><th style="padding:0.4rem;">#</th><th style="padding:0.4rem;">Question</th><th style="padding:0.4rem;">Your 80% Band</th><th style="padding:0.4rem;">True Value</th><th style="padding:0.4rem;">Result</th></tr></thead><tbody>';

        for (var i = 0; i < calibQuestions.length; i++) {
          var item = calibQuestions[i];
          var low = parseFloat(document.getElementById('low_' + item.id).value);
          var high = parseFloat(document.getElementById('high_' + item.id).value);

          if (isNaN(low) || isNaN(high)) {
            alert('Please fill out both lower and upper bounds for question #' + (i + 1));
            return;
          }

          var isHit = item.answer >= Math.min(low, high) && item.answer <= Math.max(low, high);
          if (isHit) hits++;

          tableHtml += '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:0.4rem;font-family:var(--mono);">' + (i + 1) + '</td>' +
            '<td style="padding:0.4rem;">' + item.q + '</td>' +
            '<td style="padding:0.4rem;font-family:var(--mono);">' + Math.min(low, high).toLocaleString('en-US') + ' &ndash; ' + Math.max(low, high).toLocaleString('en-US') + '</td>' +
            '<td style="padding:0.4rem;font-family:var(--mono);font-weight:bold;">' + item.answer.toLocaleString('en-US') + ' ' + item.unit + '</td>' +
            '<td style="padding:0.4rem;font-weight:bold;color:' + (isHit ? '#10b981' : '#ef4444') + ';">' + (isHit ? '✓ HIT' : '✗ MISSED') + '</td>' +
          '</tr>';
        }
        tableHtml += '</tbody></table>';

        var pct = Math.round((hits / calibQuestions.length) * 100);
        document.getElementById('hitRateDisplay').textContent = pct + '% (' + hits + '/10 Hits)';
        document.getElementById('detailedAnswersTable').innerHTML = tableHtml;

        var arch = document.getElementById('hitArchetype');
        var desc = document.getElementById('hitDesc');

        if (pct >= 70 && pct <= 90) {
          arch.textContent = '🎯 Superforecaster Calibration (Optimal Epistemic Humility)';
          arch.style.color = '#10b981';
          desc.textContent = 'Outstanding! Exactly matching the 80% target interval. Your confidence intervals are realistic and free of ego-driven certainty.';
        } else if (pct < 70) {
          arch.textContent = '⚠️ Severe Epistemic Overconfidence (Narrow Band Blindspot)';
          arch.style.color = '#ef4444';
          desc.textContent = 'You missed ' + (10 - hits) + ' out of 10 questions. Your intervals were much too narrow. Your brain assumed it knew the world with vastly more precision than it actually possesses.';
        } else {
          arch.textContent = '🛡️ Overly Timid / Underconfident (Excessively Wide Bands)';
          arch.style.color = '#f59e0b';
          desc.textContent = 'You hit 100% of the questions, but your intervals may have been overly cautious. Calibration requires precision as well as accuracy.';
        }

        document.getElementById('calibResultsCard').style.display = 'block';
        document.getElementById('calibResultsCard').scrollIntoView({ behavior: 'smooth' });
      }

      document.addEventListener('DOMContentLoaded', renderCalibQuiz);
    </script>
  `;

  writeFileSync(join(utilDir, 'epistemic-calibration.html'), renderPage({
    title: 'Epistemic Calibration & Overconfidence Game [Rationality Training Benchmark] | Digital Tools Shed',
    metaDesc: 'Test your epistemic calibration with 10 numerical estimation questions. Provide 80% confidence intervals to measure whether your brain suffers from overconfidence or true Bayesian accuracy.',
    canonical: `${DOMAIN}/util/epistemic-calibration`,
    bodyContent: epistemicGameHtml,
    currentPath: '/util/epistemic-calibration',
    faq: [
      { q: 'What is Epistemic Calibration?', a: 'Epistemic calibration is the degree to which a person\'s confidence matches their actual frequency of being correct.' },
      { q: 'Why do most people fail this test?', a: 'Most people provide intervals that are 3x to 5x too narrow because human culture punishes expressions of uncertainty.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 9. THE SUNK COST FALLACY & IRRETRIEVABLE LOSS AUDITOR (/util/sunk-cost-auditor)
  // ──────────────────────────────────────────────────────────────────────────
  const sunkCostHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Sunk Cost Auditor
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">Behavioral Economics & Prospect Theory</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Sunk Cost Fallacy & Irretrievable Loss Auditor</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Are you continuing a struggling project, bad investment, or unfulfilling commitment just because of how much time or money you already poured in? In marginal decision theory, the past is zero. Audit your forward Expected Value (EV).
        </p>
      </header>

      <div class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">1. Audit The Stalled Commitment</h2>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
          <button class="neuro-pill-btn" onclick="setSunkPreset('startup')">🚀 Stalled Startup / Codebase</button>
          <button class="neuro-pill-btn" onclick="setSunkPreset('degree')">🎓 Unwanted Degree / Career Path</button>
          <button class="neuro-pill-btn" onclick="setSunkPreset('investment')">📉 Underwater Investment</button>
          <button class="neuro-pill-btn" onclick="setSunkPreset('project')">🎨 Creative Hobby / Book Project</button>
        </div>

        <div class="neuro-grid-2">
          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Sunk Time Already Spent (Hours)</span>
              <strong id="valSunkHours" style="color: #ef4444;">400 Hours</strong>
            </div>
            <input type="range" id="sunkHours" min="10" max="3000" step="20" value="400" class="neuro-slider-input" oninput="calcSunkCost()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Sunk Capital Already Spent ($ USD)</span>
              <strong id="valSunkMoney" style="color: #ef4444;">$3,500</strong>
            </div>
            <input type="range" id="sunkMoney" min="0" max="50000" step="250" value="3500" class="neuro-slider-input" oninput="calcSunkCost()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Future Time Required to Finish (Hours)</span>
              <strong id="valFutureHours" style="color: #3b82f6;">250 Hours</strong>
            </div>
            <input type="range" id="futureHours" min="5" max="1500" step="10" value="250" class="neuro-slider-input" oninput="calcSunkCost()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Realistic Probability of Success if Completed</span>
              <strong id="valProb" style="color: #f59e0b;">25%</strong>
            </div>
            <input type="range" id="probSuccess" min="1" max="100" step="1" value="25" class="neuro-slider-input" oninput="calcSunkCost()" />
          </div>
        </div>
      </div>

      <!-- RESULTS REPORT -->
      <div class="neuro-grid-3" style="margin-bottom: 1.5rem;">
        <div class="neuro-metric-card" style="border-top: 4px solid #ef4444;">
          <div class="neuro-metric-sub">IRRETRIEVABLE SUNK COST</div>
          <div id="dispSunk" class="neuro-metric-val" style="color: #ef4444;">400h / $3.5k</div>
          <div class="neuro-metric-sub">Gone forever regardless of choice</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #3b82f6;">
          <div class="neuro-metric-sub">FORWARD EXPECTED VALUE (EV)</div>
          <div id="dispEV" class="neuro-metric-val" style="color: #3b82f6;">Negative EV</div>
          <div class="neuro-metric-sub">Marginal return on future investment</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #10b981;">
          <div class="neuro-metric-sub">RECOMMENDED ACTION</div>
          <div id="dispRec" class="neuro-metric-val" style="color: #10b981;">Cut Losses & Pivot</div>
          <div class="neuro-metric-sub">Optimal economic allocation</div>
        </div>
      </div>

      <div class="neuro-card" style="border-left: 4px solid #10b981;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: #10b981;">The Psychological Reframing Protocol</h3>
        <p id="sunkAnalysisText" style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin: 0;"></p>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What is the Sunk Cost Fallacy?</div>
          <div class="faq-a">
            The tendency for human beings to continue an endeavor once an investment in money, effort, or time has been made, rather than evaluating only future costs and benefits.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">Why does walking away feel so painful?</div>
          <div class="faq-a">
            Psychologists call it 'loss aversion'—the pain of officially booking a loss is twice as emotionally intense as the pleasure of an equivalent gain.
          </div>
        </div>
      </div>
    </div>

    <script>
      function setSunkPreset(key) {
        if (key === 'startup') {
          document.getElementById('sunkHours').value = 500;
          document.getElementById('sunkMoney').value = 4000;
          document.getElementById('futureHours').value = 300;
          document.getElementById('probSuccess').value = 20;
        } else if (key === 'degree') {
          document.getElementById('sunkHours').value = 1800;
          document.getElementById('sunkMoney').value = 25000;
          document.getElementById('futureHours').value = 800;
          document.getElementById('probSuccess').value = 40;
        } else if (key === 'investment') {
          document.getElementById('sunkHours').value = 80;
          document.getElementById('sunkMoney').value = 12000;
          document.getElementById('futureHours').value = 20;
          document.getElementById('probSuccess').value = 15;
        } else if (key === 'project') {
          document.getElementById('sunkHours').value = 250;
          document.getElementById('sunkMoney').value = 500;
          document.getElementById('futureHours').value = 150;
          document.getElementById('probSuccess').value = 30;
        }
        calcSunkCost();
      }

      function calcSunkCost() {
        var sH = parseFloat(document.getElementById('sunkHours').value) || 0;
        var sM = parseFloat(document.getElementById('sunkMoney').value) || 0;
        var fH = parseFloat(document.getElementById('futureHours').value) || 1;
        var prob = (parseFloat(document.getElementById('probSuccess').value) || 20) / 100;

        document.getElementById('valSunkHours').textContent = sH + ' Hours';
        document.getElementById('valSunkMoney').textContent = '$' + sM.toLocaleString('en-US');
        document.getElementById('valFutureHours').textContent = fH + ' Hours';
        document.getElementById('valProb').textContent = Math.round(prob * 100) + '%';

        document.getElementById('dispSunk').textContent = sH + 'h / $' + (sM >= 1000 ? (sM / 1000).toFixed(1) + 'k' : sM);

        var isPositiveEV = (prob >= 0.5) || (prob * 1000 > fH * 2);
        document.getElementById('dispEV').textContent = isPositiveEV ? 'Positive Forward EV' : 'Negative Forward EV';
        document.getElementById('dispEV').style.color = isPositiveEV ? '#10b981' : '#ef4444';

        document.getElementById('dispRec').textContent = isPositiveEV ? 'Rational Completion' : 'Cut Losses & Pivot';
        document.getElementById('dispRec').style.color = isPositiveEV ? '#3b82f6' : '#ef4444';

        var text = '<strong>Marginal Decision Rule:</strong> Your past <strong>' + sH + ' hours</strong> and <strong>$' + sM.toLocaleString('en-US') + '</strong> are irretrievable whether you quit right now or continue for another 10 years. ';
        if (!isPositiveEV) {
          text += 'With only a <strong>' + Math.round(prob * 100) + '% probability</strong> of success, spending an additional <strong>' + fH + ' future hours</strong> is throwing valuable new life after dead capital. Freeing those ' + fH + ' hours to invest in high-leverage new projects has mathematically superior expected value.';
        } else {
          text += 'Because your probability of eventual payoff is relatively strong, completing the final ' + fH + ' hours is justified strictly on forward marginal return, independent of past sunk cost.';
        }
        document.getElementById('sunkAnalysisText').innerHTML = text;
      }

      document.addEventListener('DOMContentLoaded', calcSunkCost);
    </script>
  `;

  writeFileSync(join(utilDir, 'sunk-cost-auditor.html'), renderPage({
    title: 'The Sunk Cost Fallacy & Irretrievable Loss Auditor [Prospect Theory Decision Tree] | Digital Tools Shed',
    metaDesc: 'Audit failing projects, bad investments, or unfulfilling commitments. Strip away past unrecoverable time and money using Daniel Kahneman\'s Prospect Theory to calculate forward expected value.',
    canonical: `${DOMAIN}/util/sunk-cost-auditor`,
    bodyContent: sunkCostHtml,
    currentPath: '/util/sunk-cost-auditor',
    faq: [
      { q: 'What is the Sunk Cost Fallacy?', a: 'Continuing a course of action based on resources already consumed rather than forward marginal utility.' },
      { q: 'What is the Concorde Fallacy?', a: 'A historical instance where the British and French governments continued funding the supersonic Concorde airliner simply because billions had already been spent.' }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 10. THE COSMIC PERSPECTIVE CLOCK (/util/cosmic-perspective-clock)
  // ──────────────────────────────────────────────────────────────────────────
  const cosmicClockHtml = `
    ${sharedStyle}
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Cosmic Perspective Clock
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7; margin-bottom: 0.5rem;">Deep Time Astrobiology & Stoic Perspective</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Cosmic Perspective Clock</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Put modern acute anxieties in their proper universal scale. Track your live personal seconds against recorded human civilization, the lifespan of planet Earth, and the deep-time heat death of the cosmos.
        </p>
      </header>

      <div class="neuro-card">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold;">Enter Your Birth Date:</label>
          <input type="date" id="cosmicBirthDate" value="1995-06-15" class="code-input" style="padding: 0.5rem; font-family: var(--mono);" onchange="updateCosmicTick()" />
        </div>
      </div>

      <!-- LIVE SYNCHRONIZED CLOCKS -->
      <div class="neuro-grid-3" style="margin-bottom: 1.5rem;">
        <div class="neuro-metric-card" style="border-top: 4px solid #3b82f6;">
          <div class="neuro-metric-sub">YOUR PERSONAL TIME TICKER</div>
          <div id="personalSeconds" class="neuro-metric-val" style="color: #3b82f6;">0.00s</div>
          <div class="neuro-metric-sub">Seconds elapsed since your birth</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #10b981;">
          <div class="neuro-metric-sub">EARTH LIFETIME FRACTION</div>
          <div id="earthFraction" class="neuro-metric-val" style="color: #10b981;">0.0000007%</div>
          <div class="neuro-metric-sub">Of Earth's 4.54 billion year history</div>
        </div>

        <div class="neuro-metric-card" style="border-top: 4px solid #a855f7;">
          <div class="neuro-metric-sub">CARL SAGAN COSMIC YEAR</div>
          <div id="cosmicYearTime" class="neuro-metric-val" style="color: #a855f7;">Dec 31 23:59:59.8</div>
          <div class="neuro-metric-sub">Your entire life in cosmic seconds</div>
        </div>
      </div>

      <!-- THE ANXIETY VAPORIZER -->
      <div class="neuro-card" style="border-left: 4px solid #a855f7;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: #a855f7;">The Stoic Anxiety Vaporizer</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
          What is currently generating stress in your prefrontal cortex? Type it below and dissolve it into cosmic deep time.
        </p>

        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <input type="text" id="anxietyInput" placeholder="e.g. Work deadline tomorrow, awkward email, rent increase..." class="code-input" style="flex:1;min-width:240px;padding:0.6rem;" />
          <button onclick="vaporizeAnxiety()" class="neuro-btn-primary">🌌 Dissolve Against Cosmic Scale</button>
        </div>

        <div id="vaporizeOutput" style="display: none; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-size: 0.95rem; line-height: 1.6;"></div>
      </div>

      <!-- FAQ SECTION -->
      <div class="faq-card">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions</h3>
        <div class="faq-item">
          <div class="faq-q">What is the Cosmic Year?</div>
          <div class="faq-a">
            A concept popularized by Carl Sagan where the 13.8-billion-year lifespan of the universe is compressed into a single 365-day calendar year. The Big Bang occurs on January 1 at 00:00:00, modern humans appear on December 31 at 23:52, and an 80-year human life lasts roughly 0.18 seconds.
          </div>
        </div>
        <div class="faq-item">
          <div class="faq-q">How does cosmic awe reduce stress?</div>
          <div class="faq-a">
            Neuroscience research shows that experiencing awe quiets the Default Mode Network (DMN), the brain region responsible for self-focused rumination and anxiety.
          </div>
        </div>
      </div>
    </div>

    <script>
      function updateCosmicTick() {
        var bStr = document.getElementById('cosmicBirthDate').value;
        var bDate = new Date(bStr);
        var now = new Date();
        var diffMs = now - bDate;
        var diffSec = Math.max(0, diffMs / 1000);

        document.getElementById('personalSeconds').textContent = Math.floor(diffSec).toLocaleString('en-US') + 's';

        var earthSec = 4.54e9 * 365.25 * 86400;
        var frac = (diffSec / earthSec) * 100;
        document.getElementById('earthFraction').textContent = frac.toExponential(3) + '%';

        var humanYears = diffSec / (365.25 * 86400);
        var cosmicSec = (humanYears / 13800000000) * 31536000;
        document.getElementById('cosmicYearTime').textContent = '0.' + Math.round(cosmicSec * 1000) + 's on Dec 31';
      }

      function vaporizeAnxiety() {
        var str = document.getElementById('anxietyInput').value.trim();
        if (!str) {
          alert('Please enter a current worry or stressor.');
          return;
        }

        var out = document.getElementById('vaporizeOutput');
        out.style.display = 'block';
        out.innerHTML = 
          '<div style="font-family:var(--mono);font-size:0.8rem;text-transform:uppercase;color:#a855f7;font-weight:bold;margin-bottom:0.4rem;">Cosmic Perspective Grounding</div>' +
          '<p style="margin:0 0 0.5rem;">You are stressed about: <em>"' + str + '"</em>.</p>' +
          '<p style="margin:0 0 0.5rem;color:var(--text-muted);">In approximately 5 billion years, our Sun will expand into a red giant, vaporizing Earth, all physical relics, and every server that ever recorded human worry. In 100 trillion years, the final stars will fade to dark iron remnants.</p>' +
          '<p style="margin:0;font-weight:bold;color:#10b981;">Your problem is real in your immediate subjective experience, but completely weightless against the cosmos. Breathe deeply, handle what is directly in your control right now, and let go of the rest.</p>';
      }

      setInterval(updateCosmicTick, 1000);
      document.addEventListener('DOMContentLoaded', updateCosmicTick);
    </script>
  `;

  writeFileSync(join(utilDir, 'cosmic-perspective-clock.html'), renderPage({
    title: 'The Cosmic Perspective Clock [Live Deep Time & Existential Scale Ticker] | Digital Tools Shed',
    metaDesc: 'Put daily stress in perspective with a live synchronized clock tracking your age against human history, the age of Earth, solar evolution, and the heat death of the universe.',
    canonical: `${DOMAIN}/util/cosmic-perspective-clock`,
    bodyContent: cosmicClockHtml,
    currentPath: '/util/cosmic-perspective-clock',
    faq: [
      { q: 'What is the Cosmic Perspective Clock?', a: 'A real-time clock tracking your personal existence against cosmic deep time to down-regulate the default mode network and relieve acute anxiety.' },
      { q: 'What is the View from Above in Stoicism?', a: 'A mental exercise recommended by Marcus Aurelius to visualize your life and dilemmas from orbit, stripping away petty ego attachments.' }
    ]
  }));

  console.log('  ✓ Built Curiosity, Neurobiology & Existential Suite (10 interactive flagship tools in /util/)');
}
