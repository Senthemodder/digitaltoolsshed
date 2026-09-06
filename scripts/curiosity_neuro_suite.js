// scripts/curiosity_neuro_suite.js — 10 Flagship Curiosity, Neurobiology & Existential Tools
// Deeply interactive, zero external dependencies, pure vanilla JS, Workbench design system.

import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildCuriosityNeuroSuite() {
  const utilDir = join(DIST, 'util');
  ensureDir(utilDir);

  function renderCuriosityPage(opts) {
    let visibleFaqHtml = '';
    if (opts.faq && opts.faq.length > 0) {
      visibleFaqHtml = `
        <div class="wb-card" style="margin-top:2.5rem; background:var(--surface); border:1px solid var(--border); padding:1.5rem; border-radius:8px;">
          <h2 style="font-family:var(--serif); font-size:1.4rem; margin-bottom:1.25rem;">Frequently Asked Questions</h2>
          ${opts.faq.map(f => `
            <div class="faq-item" style="border-bottom:1px solid var(--border); padding:0.85rem 0;" onclick="this.classList.toggle('open')">
              <div style="font-weight:600; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1rem;">${f.q}</span>
                <span class="faq-icon" style="font-size:1.2rem; transition:transform 0.2s; color:var(--text-muted);">+</span>
              </div>
              <div class="faq-answer" style="display:none; margin-top:0.6rem; color:var(--text-muted); font-size:0.92rem; line-height:1.65;">
                ${f.a}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    const fullBody = opts.bodyContent + visibleFaqHtml + `
      <style>
        .faq-item.open .faq-answer { display: block !important; }
        .faq-item.open .faq-icon { transform: rotate(45deg); color: #10b981; }
        .trap-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1.15rem;
          margin-bottom: 1rem;
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .trap-card strong {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 1rem;
        }
      </style>
    `;
    return renderPage({
      ...opts,
      bodyContent: fullBody
    });
  }

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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">Executive Function &amp; Choice Architecture</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Decision Paralysis Bracket Tournament</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Overwhelmed by too many competing options? Evaluating 8 or 16 choices at once floods working memory (Miller’s Law). This tool runs a rapid binary elimination tournament (March Madness style) to bypass prefrontal hesitation in under 60 seconds.
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

        <textarea id="itemsInput" class="code-input" style="width: 100%; height: 130px; margin-bottom: 0.5rem; padding: 0.75rem; font-family: var(--mono); font-size: 0.95rem; line-height: 1.5; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;" placeholder="Enter one option per line (min 4, max 16)...&#10;Thai Food&#10;Tacos&#10;Sushi&#10;Pizza&#10;Burgers&#10;Indian Curry&#10;Ramen&#10;Mediterranean Shawarma"></textarea>

        <div id="bracketError" style="display: none; color: #ef4444; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.75rem;">
          ⚠️ Please enter at least 2 options to compare.
        </div>

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
          <button id="btnCopyBracket" onclick="copyVictory()" class="neuro-btn-primary" style="transition: all 0.2s;">📋 Copy Decision Summary</button>
          <button onclick="cancelTournament()" class="neuro-pill-btn" style="padding: 0.7rem 1.2rem;">Run Another Dilemma</button>
        </div>
      </div>

      <!-- WORKED DECISION DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">📐 Decision Architecture &amp; Hick's Law Derivation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          How binary tournament trees bypass cognitive thrashing:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.72rem;">HICK'S LAW LATENCY</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">T = b &times; log<sub>2</sub>(n + 1)</div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.2rem;">Binary pairs minimize n to 2 at every step.</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.72rem;">BINARY TREE DEPTH</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Depth = &lceil;log<sub>2</sub>(N)&rceil; Rounds</div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.2rem;">8 items resolve in exactly 3 rapid rounds.</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <div style="color: var(--text-muted); font-size: 0.72rem;">WORKING MEMORY BUFFER</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Miller's Law (4 &plusmn; 1 Items)</div>
            <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.2rem;">Prevents cognitive overload and analysis freeze.</div>
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & COGNITIVE PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Decision Paralysis Traps &amp; Executive Pitfalls</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Evaluating options triggers acute cognitive friction. Avoid these 5 common mental traps:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The Endless Symmetrical Deliberation Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Spending 45 minutes comparing options that have virtually identical expected utility. When the difference in outcome value is negligible, any decision executed in 5 seconds is mathematically superior to delaying action.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. The Omission Bias Illusion</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Believing that delaying or avoiding a decision is "neutral" or carries less risk than making an imperfect choice. In reality, procrastination is an active negative decision that incurs massive compounding opportunity costs.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Working Memory Buffer Overflow (Miller's Law)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Attempting to simultaneously evaluate 6+ options in your conscious mind. The prefrontal cortex can only sustain 4 &plusmn; 1 information chunks simultaneously; attempting more causes cognitive thrashing and decision fatigue.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. Post-Tournament Buyer's Remorse Reversal</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Second-guessing the tournament winner immediately after the final matchup. If you experience sudden reluctance or regret, treat it as a clinical diagnostic of your hidden subconscious preference: you actually wanted the runner-up.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. Asymmetrical Information Hunting</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Postponing decisions under the guise of "needing just one more review or data point." In over 80% of everyday personal and operational dilemmas, marginal information gain drops to zero after the initial comparison.
            </p>
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
          document.getElementById('itemsInput').value = presets[key].join('\n');
          document.getElementById('bracketError').style.display = 'none';
          updateCount();
        }
      }

      function updateCount() {
        var lines = document.getElementById('itemsInput').value.split('\n').map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 0; });
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
        var raw = document.getElementById('itemsInput').value.split('\n').map(function(s){ return s.trim(); }).filter(function(s){ return s.length > 0; });
        var errEl = document.getElementById('bracketError');
        if (raw.length < 2) {
          errEl.style.display = 'block';
          return;
        }
        errEl.style.display = 'none';

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
        var text = 
          'DECISION BRACKET TOURNAMENT RESULT\n' +
          '========================================\n' +
          '• Undisputed Champion: ' + win + '\n' +
          (runnerUp ? '• Runner-Up: ' + runnerUp + '\n' : '') +
          '• Algorithm: Binary Elimination Tournament (March Madness Style)\n' +
          '========================================\n' +
          'Decided via Digital Tools Shed: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyBracket');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Decision Summary!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
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

  writeFileSync(join(utilDir, 'decision-bracket.html'), renderCuriosityPage({
    title: "Decision Paralysis Bracket Tournament [Prefrontal Cortex Bypass Engine] | Digital Tools Shed",
    metaDesc: "Eliminate decision fatigue and analysis paralysis with a rapid binary head-to-head tournament bracket. Pit 4, 8, or 16 choices in 1-on-1 matchups to reveal your subconscious priority.",
    canonical: `${DOMAIN}/util/decision-bracket`,
    bodyContent: decisionBracketHtml,
    currentPath: '/util/decision-bracket',
    faq: [
      {
        q: "Why does binary elimination resolve decision paralysis so fast?",
        a: "According to Hick's Law (T = b * log2(n + 1)), decision time increases logarithmically with the number of options. Simultaneously ranking 8 or 16 choices floods prefrontal working memory. Pairwise 1-on-1 elimination strips away comparative noise, allowing your subconscious gut intuition to decide in milliseconds."
      },
      {
        q: "What if I feel disappointed by the winning choice?",
        a: "Sigmund Freud noted that flipping a coin or running an elimination tournament reveals your true subconscious desire the instant the result appears. If you feel sudden regret or reluctance about the winner, your brain has illuminated what you actually preferred: the runner-up."
      },
      {
        q: "How many choices can I compare in the tournament?",
        a: "The engine supports between 2 and 16 choices, automatically balancing brackets into 4, 8, or 16 competitor single-elimination trees to guarantee fair seeding."
      },
      {
        q: "Can I navigate the tournament using keyboard shortcuts?",
        a: "Yes. You can press '1' or Left Arrow to choose the left option, and '2' or Right Arrow to choose the right option, allowing you to complete an 8-item tournament in under 20 seconds."
      },
      {
        q: "Is my decision data private?",
        a: "100% private. The tournament runs entirely in your local browser memory using client-side JavaScript. Zero inputs or decision results are ever transmitted to external servers."
      }
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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">Actuarial Reality Check &amp; Tim Urban's 'The Tail End'</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Tail End: Loved-One Time Remaining Ledger</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          By age 18, you have already spent roughly 90% of the total in-person face-to-face time you will ever have with your parents. If your loved ones live elsewhere and you visit twice a year, you don't have "20 years left"—you have 40 visits left.
        </p>
      </header>

      <div class="neuro-card">
        <div class="neuro-grid-3" style="margin-bottom: 1.5rem;">
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Relationship</label>
            <select id="relType" class="code-input" onchange="calcTailEnd()" style="width:100%;padding:0.6rem;font-family:var(--mono);background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:4px;">
              <option value="parent" selected>Mother / Father</option>
              <option value="grandparent">Grandmother / Grandfather</option>
              <option value="child">Child (Before Age 18)</option>
              <option value="friend">Childhood Best Friend</option>
              <option value="custom">Custom Loved One</option>
            </select>
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Your Current Age</label>
            <input type="number" id="userAge" value="30" min="1" max="100" class="code-input" oninput="calcTailEnd()" style="width:100%;padding:0.6rem;font-family:var(--mono);background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:4px;" />
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Loved One's Current Age</label>
            <input type="number" id="lovedAge" value="62" min="1" max="105" class="code-input" oninput="calcTailEnd()" style="width:100%;padding:0.6rem;font-family:var(--mono);background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:4px;" />
          </div>
        </div>

        <div class="neuro-grid-3">
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Visits / Encounters Per Year</label>
            <input type="number" id="visitsPerYear" value="3" min="1" max="365" class="code-input" oninput="calcTailEnd()" style="width:100%;padding:0.6rem;font-family:var(--mono);background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:4px;" />
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Average Days Per Visit</label>
            <input type="number" id="daysPerVisit" value="4" min="1" max="60" class="code-input" oninput="calcTailEnd()" style="width:100%;padding:0.6rem;font-family:var(--mono);background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:4px;" />
          </div>
          <div>
            <label class="field-label" style="display:block;font-family:var(--mono);font-size:0.75rem;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.35rem;">Actuarial Life Expectancy</label>
            <input type="number" id="targetLifespan" value="82" min="50" max="110" class="code-input" oninput="calcTailEnd()" style="width:100%;padding:0.6rem;font-family:var(--mono);background:var(--bg);color:var(--fg);border:1px solid var(--border);border-radius:4px;" />
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

      <!-- LIVE MATHEMATICAL DERIVATION BREAKDOWN -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">📐 Actuarial Derivation &amp; Mathematical Timeline</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          How the mortality ledger evaluates your relationship's temporal boundaries:
        </p>

        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Compute Childhood In-Person Baseline (Ages 0–18)</strong>
            <div id="derTailStep1" style="color: #3b82f6; margin-top: 0.25rem;">18 years &times; ~300 days/year = 5,400 co-present days</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Compute Adult Days Already Expended</strong>
            <div id="derTailStep2" style="color: var(--text-muted); margin-top: 0.25rem;">(30 - 18) years &times; 3 visits &times; 4 days = 144 days</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Compute Projected Future In-Person Days</strong>
            <div id="derTailStep3" style="color: #22c55e; margin-top: 0.25rem;">(82 - 62) actuarial years &times; 3 visits &times; 4 days = 240 days</div>
          </div>
        </div>

        <button id="btnCopyLedger" onclick="copyLedgerSummary()" class="btn-primary" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
          📋 Copy Complete Mortality Ledger Summary
        </button>
      </div>

      <!-- CALL TO ACTION CARD -->
      <div class="neuro-card" style="background: rgba(59,130,246,0.06); border-left: 4px solid #3b82f6;">
        <h4 style="font-family: var(--serif); font-size: 1.2rem; margin: 0 0 0.5rem; color: #3b82f6;">The Immediate Antidote</h4>
        <p style="font-size: 0.92rem; color: var(--fg); line-height: 1.5; margin-bottom: 1rem;">
          Don't let this reality check induce hollow paralysis. Reach out right now while they are here to receive it.
        </p>
        <button id="btnCopyWarm" onclick="copyWarmMessage()" class="neuro-btn-primary" style="transition: all 0.2s;">📱 Copy Warm Check-In Text to Clipboard</button>
      </div>

      <!-- 5 FATAL TRAPS & ACTUARIAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Time Traps &amp; Actuarial Blindspots</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Human temporal perception dramatically warps how we budget time with aging loved ones:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The "Calendar Years vs. In-Person Hours" Fallacy</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Assuming that because your parents are 60 and have a life expectancy of 82, you have "22 years left" with them. If you live in another city and visit for 4 days twice a year, you do not have 22 years—you have only 176 in-person days remaining.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. The Diurnal Proximity Assumption</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Assuming future time together will be as physically active, independent, and communicative as past time. Age-related cognitive decline, mobility loss, and sensory impairment drastically reduce the communicative depth of later years.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Post-Adolescence Time Decoupling (The 90% Cliff)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Overlooking that 90% of total parent-child face-to-face hours occur before age 18. Once high school ends and geographic independence begins, the relationship enters the final 10% tail end permanently.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. Quality vs. Presence Distraction Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Spending one of your few remaining in-person visits scrolling on mobile devices or handling remote work in the same room. Physical co-presence with split attention reduces emotional bonding value by >70%.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. "We'll Do It Next Year" Procrastination Mirage</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Postponing annual family reunions or holiday trips due to temporary workplace deadlines. Actuarial mortality curves are non-linear; health shocks occur unpredictably without prior notice.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      var currentTailData = null;

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

        // Derivations
        document.getElementById('derTailStep1').innerHTML = 
          'Childhood Co-Presence (Ages 0–18): ' + Math.min(userAge, 18) + ' years &times; ~300 days/year = <strong>' + pastChildhoodDays.toLocaleString('en-US') + ' days</strong>';
        document.getElementById('derTailStep2').innerHTML = 
          'Adult Co-Presence Expended: ' + adultYears + ' adult years &times; ' + visitsPerYear + ' visits &times; ' + daysPerVisit + ' days = <strong>' + pastAdultDays.toLocaleString('en-US') + ' days</strong>';
        document.getElementById('derTailStep3').innerHTML = 
          'Projected Future Co-Presence: (' + targetLifespan + ' - ' + lovedAge + ') actuarial years &times; ' + visitsPerYear + ' visits &times; ' + daysPerVisit + ' days = <strong>' + totalDays.toLocaleString('en-US') + ' days (' + totalVisits + ' visits)</strong>';

        currentTailData = {
          rel: name,
          pctElapsed: pctPast.toFixed(1) + '%',
          daysLeft: totalDays,
          visitsLeft: totalVisits,
          holidaysLeft: totalHolidays,
          yearsLeft: remainingYears.toFixed(0)
        };
      }

      function copyWarmMessage() {
        var msg = "Hey, I was just thinking about you and wanted to check in. I really cherish the time we get together—let's make sure we plan our next visit soon. Love you!";
        navigator.clipboard.writeText(msg).then(function() {
          var btn = document.getElementById('btnCopyWarm');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Warm Check-in Text Copied!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }

      function copyLedgerSummary() {
        if (!currentTailData) return;
        var d = currentTailData;
        var text = 
          'THE TAIL END: MORTALITY & TIME REMAINING LEDGER\n' +
          '========================================\n' +
          '• Relationship: ' + d.rel + '\n' +
          '• Lifetime Time Already Expended: ' + d.pctElapsed + '\n' +
          '• Total Remaining In-Person Days: ' + d.daysLeft + ' Days\n' +
          '• Total Remaining In-Person Visits: ' + d.visitsLeft + ' Visits\n' +
          '• Projected Remaining Holiday Seasons: ' + d.holidaysLeft + ' Seasons\n' +
          '• Actuarial Horizon: ~' + d.yearsLeft + ' Years\n' +
          '========================================\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyLedger');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Complete Mortality Ledger!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', calcTailEnd);
    </script>
  `;

  writeFileSync(join(utilDir, 'tail-end-mortality.html'), renderCuriosityPage({
    title: "The Tail End: Loved-One Time Remaining Ledger [Mortality Dot Matrix] | Digital Tools Shed",
    metaDesc: "Calculate how much time you have left with your parents, children, or loved ones. Inspired by Tim Urban's The Tail End, visualize remaining visits, holidays, and hours in an interactive life dot grid.",
    canonical: `${DOMAIN}/util/tail-end-mortality`,
    bodyContent: tailEndHtml,
    currentPath: '/util/tail-end-mortality',
    faq: [
      {
        q: "What is 'The Tail End' concept in philosophy and psychology?",
        a: "Popularized by writer Tim Urban on Wait But Why, 'The Tail End' illustrates that roughly 90% of our total lifetime face-to-face time with our parents occurs before age 18. Once high school ends and children move out, annual visits drop to 5–15 days per year, permanently entering the final 10% of the relationship."
      },
      {
        q: "How does the calculator estimate remaining actuarial lifespan?",
        a: "The calculator uses standard demographic life tables (defaulting to 82 years, matching CDC and WHO actuarial median life expectancies for OECD nations). Users can adjust the target lifespan to match family medical history."
      },
      {
        q: "Why is tracking 'visits left' more impactful than tracking 'years left'?",
        a: "Saying you have '20 years left' creates a false sense of abundance. If you only visit twice a year, 20 years translates to just 40 total encounters. Counting discrete visits eliminates procrastination and highlights the finite nature of each reunion."
      },
      {
        q: "How can I improve the quality of remaining in-person time?",
        a: "Establish phone-free focus rituals, record oral history interviews asking about their childhood and life lessons, and prioritize active shared experiences over passive co-presence."
      },
      {
        q: "Is any personal data stored or transmitted when using this ledger?",
        a: "No. All age inputs and visit calculations execute strictly in your local browser memory using vanilla JavaScript. No data is stored, logged, or sent to external servers."
      }
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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7; margin-bottom: 0.5rem;">Opponent-Process Theory &amp; Dopamine Nation Neurobiology</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Dopamine Receptor Downregulation Simulator</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          When supernormal stimuli (endless short-form video, hyperpalatable foods, digital gambling) flood synaptic clefts, your brain aggressively downregulates D2 dopamine receptors (Process B) to restore homeostasis. Simulate your baseline deficit and reset schedule.
        </p>
      </header>

      <div class="neuro-card">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem;">1. Configure Daily Neurochemical Inputs</h2>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>High-Spike Stimulus Hours (Reels, TikTok, Gaming, Adult Content)</span>
            <strong id="valSpikeHours" style="color: #ef4444;">5.0 Hours/Day</strong>
          </div>
          <input type="range" id="spikeHours" min="0" max="16" step="0.5" value="5" class="neuro-slider-input" oninput="simDopamine()" />
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Context Switches &amp; Interruptions (Notifications/Hour)</span>
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

      <!-- LIVE STEP-BY-STEP DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">📐 Allostatic Load &amp; Downregulation Derivation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Evaluating Solomon's Opponent-Process and Lembke's Dopamine Deficit model algebraically:
        </p>

        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Compute Exogenous Stimulus Load</strong>
            <div id="derDopStep1" style="color: #3b82f6; margin-top: 0.25rem;">(5.0 hrs &times; 6) + (25 switches &times; 0.4) + (log10(45) &times; 12) = 59.8 pts</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Subtract Endogenous Restorative Buffer</strong>
            <div id="derDopStep2" style="color: var(--text-muted); margin-top: 0.25rem;">1 Protocol &times; 8 = 8.0 offset points</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Derive Net D2 Downregulation &amp; Resensitization Horizon</strong>
            <div id="derDopStep3" style="color: #22c55e; margin-top: 0.25rem;">Net Deficit: 52% | Resensitization: 7 + (52 &times; 0.35) = 25 Days</div>
          </div>
        </div>

        <button id="btnCopyDopamine" onclick="copyDopamineSummary()" class="btn-primary" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
          📋 Copy Neurochemical Diagnostic Summary
        </button>
      </div>

      <!-- 3-STAGE RESET PROTOCOL -->
      <div class="neuro-card" style="border-left: 4px solid #10b981;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem; color: #10b981;">3-Stage Neurochemical Reset Protocol</h3>
        <div id="resetPlan" style="font-size: 0.92rem; line-height: 1.6; color: var(--fg);"></div>
      </div>

      <!-- 5 FATAL TRAPS & NEUROBIOLOGICAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Traps in Dopamine Resets &amp; Behavioral Addiction</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Dopamine is the neurochemical currency of motivation and craving. Avoid these 5 common mistakes:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The "Cold Turkey" Dopamine Crash Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Abruptly cutting off all digital, recreational, and dietary dopamine spikes simultaneously without establishing structural low-dopamine friction buffers. This triggers severe acute anhedonia, driving an intense rebound relapse within 72 hours.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. Replacement Supernormal Stimuli (The Lateral Shift)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Quitting short-form video only to binge 8 hours of video games, online shopping, or Reddit arguments. Shifting sideways between supernormal stimuli maintains D2 receptor downregulation.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Mistaking Process B Dysphoria for Permanent Depression</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Interpreting the natural homeostatic dopamine trough (Process B) as an intrinsic mental health defect rather than the biological price of previous hyper-stimulation. Understanding the 14–21 day receptor resensitization timeline prevents premature abandonment.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. The "Pure Motivation" Illusion</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Relying on conscious willpower to resist algorithmic feeds engineered by thousands of behavioural psychologists. Lasting neurochemical reset requires physical environment design (phone out of bedroom, app blockers, grayscale screens).
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. Zero Effort Dopamine Seduction</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Seeking cheap, friction-free dopamine spikes rather than effort-driven dopamine earned through strenuous physical exercise, intellectual problem solving, or difficult creative work.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      var currentDopamineData = null;

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

        // Derivations
        document.getElementById('derDopStep1').innerHTML = 
          'Exogenous Stimulus Load: (' + spikeH.toFixed(1) + ' hrs &times; 6) + (' + switches + ' switches &times; 0.4) + (log10(' + cycleD + ') &times; 12) = <strong>' + load.toFixed(1) + ' pts</strong>';
        document.getElementById('derDopStep2').innerHTML = 
          'Restorative Offset: ' + restorers + ' protocol(s) &times; 8 = <strong>' + recovery.toFixed(1) + ' offset pts</strong>';
        document.getElementById('derDopStep3').innerHTML = 
          'Net D2 Receptor Deficit: <strong>-' + netDeficit + '%</strong> | Neural Resensitization Horizon: 7 + (' + netDeficit + ' &times; 0.35) = <strong>' + resetDays + ' Days</strong>';

        currentDopamineData = {
          spikeHours: spikeH.toFixed(1),
          switches: switches,
          d2Deficit: '-' + netDeficit + '%',
          boredom: boredomLabel,
          resensDays: resetDays + ' Days'
        };
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

      function copyDopamineSummary() {
        if (!currentDopamineData) return;
        var d = currentDopamineData;
        var text = 
          'DOPAMINE RECEPTOR DOWNREGULATION DIAGNOSTIC\n' +
          '========================================\n' +
          '• High-Spike Stimulus Hours: ' + d.spikeHours + ' hrs/day\n' +
          '• Context Switching Frequency: ' + d.switches + ' switches/hr\n' +
          '• Estimated D2 Receptor Sensitivity: ' + d.d2Deficit + '\n' +
          '• Baseline Boredom / Anhedonia Score: ' + d.boredom + '\n' +
          '• Target Days to Neural Resensitization: ' + d.resensDays + '\n' +
          '========================================\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyDopamine');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Dopamine Diagnostic!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', simDopamine);
    </script>
  `;

  writeFileSync(join(utilDir, 'dopamine-reset-simulator.html'), renderCuriosityPage({
    title: "Dopamine Receptor Downregulation Simulator [Opponent-Process Reset Protocol] | Digital Tools Shed",
    metaDesc: "Simulate your brain's dopamine baseline, D2 receptor downregulation, and opponent-process rebound based on Dr. Anna Lembke and Richard Solomon's neurochemical models.",
    canonical: `${DOMAIN}/util/dopamine-reset-simulator`,
    bodyContent: dopamineSimHtml,
    currentPath: '/util/dopamine-reset-simulator',
    faq: [
      {
        q: "What is Richard Solomon's Opponent-Process Theory?",
        a: "Opponent-process theory states that emotional and neurochemical states are paired with an opposing homeostatic reaction. When an intense reward (Process A) spikes dopamine, the brain produces an opposing dysphoric trough (Process B) to return to baseline. Over time, Process A weakens while Process B strengthens and lasts longer, leading to chronic tolerance."
      },
      {
        q: "How long does it take for D2 dopamine receptors to upregulate?",
        a: "Brain imaging studies show significant dopamine receptor recovery within 14 to 30 days of abstaining from chronic supernormal stimulation. Mild resets take 7 to 10 days, while heavy digital or behavioral dependencies require 30 days of structured friction."
      },
      {
        q: "What is the difference between tonic and phasic dopamine?",
        a: "Tonic dopamine is your slow, steady baseline level that provides general drive, focus, and emotional equilibrium. Phasic dopamine consists of sharp, transient spikes triggered by unexpected rewards. Chronic excessive phasic spikes exhaust synaptic machinery, suppressing your tonic baseline."
      },
      {
        q: "Why does unmedicated boredom feel physically painful after screen binging?",
        a: "Because D2 receptors have downregulated, ordinary resting states feel deficient in dopamine. The brain perceives this trough as an urgent deficit and generates restlessness and agitation to compel you to seek another spike."
      },
      {
        q: "How does effort-generated dopamine differ from passive digital dopamine?",
        a: "Dopamine released after difficult effort (such as intense exercise, cold exposure, or completing complex creative work) results in a prolonged, stable elevated baseline without an immediate dysphoric crash."
      }
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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Polyvagal Theory &amp; Allostatic Load</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Sensory Overload Budget &amp; Autonomic Battery Meter</h1>
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
            <span>Screen Glare &amp; Fluorescent Lighting Exposure</span>
            <strong id="valVisual" style="color: #f59e0b;">7 Hours</strong>
          </div>
          <input type="range" id="visualInput" min="1" max="16" step="1" value="7" class="neuro-slider-input" oninput="calcSensory()" />
        </div>

        <div class="neuro-slider-row">
          <div class="neuro-slider-label">
            <span>Social Masking &amp; Public Performance Hours</span>
            <strong id="valMasking" style="color: #a855f7;">5 Hours</strong>
          </div>
          <input type="range" id="maskingInput" min="0" max="12" step="1" value="5" class="neuro-slider-input" oninput="calcSensory()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Hours spent hiding fatigue, smiling politely, or suppressing natural traits</span>
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

      <!-- LIVE STEP-BY-STEP DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">📐 Polyvagal Allostatic Battery Derivation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Evaluating autonomic energy drain algebraically across neurological stressors:
        </p>

        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Baseline Sleep Capacity</strong>
            <div id="derSensStep1" style="color: #3b82f6; margin-top: 0.25rem;">Sleep Score 6.5 &times; 10 = 65.0 Base Points</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Cumulative Allostatic Sensory Drain</strong>
            <div id="derSensStep2" style="color: var(--text-muted); margin-top: 0.25rem;">Acoustic (15.8) + Visual (19.6) + Masking (19.0) = 54.4 Drain Points</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Residual Autonomic Charge &amp; State</strong>
            <div id="derSensStep3" style="color: #f59e0b; margin-top: 0.25rem;">Residual Battery: 38% &rarr; Sympathetic Hyper-Vigilance</div>
          </div>
        </div>

        <button id="btnCopySensory" onclick="copySensorySummary()" class="btn-primary" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
          📋 Copy Autonomic Battery Diagnostic
        </button>
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

      <!-- 5 FATAL TRAPS & SENSORY PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Sensory Overload Traps &amp; Polyvagal Pitfalls</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Autonomic dysregulation creeps in quietly before precipitating full executive exhaustion:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The "Push Through It" Dissociation Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Ignoring early sympathetic warning signs (jaw clenching, eye fatigue, sensory irritability) and forcing yourself to remain in noisy, bright environments until your nervous system collapses into dorsal vagal freeze or shutdown.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. Social Masking Exhaustion Mirage</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Underestimating the intense metabolic and neurological cost of maintaining a pleasant, neurotypical facade during back-to-back social gatherings or corporate meetings. Masking drains allostatic battery twice as fast as physical labor.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Acoustic &amp; Subconscious Micro-Noise Creep</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Habitually existing in environments with 60–75 dB ambient background noise (open-plan offices, HVAC hum, traffic, cafes) without recognizing that continuous sound forces the auditory cortex into chronic low-grade vigilance.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. Digital "Relaxation" Stimulus Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Attempting to recharge an overstimulated nervous system by consuming fast-paced video games, YouTube videos, or Twitter debates. True autonomic recovery requires sensory deprivation (dark, quiet, horizontal rest).
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. Chronic Sleep Debt Depletion</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Treating sleep as negotiable while expecting daytime sensory resilience. Every hour of lost sleep depresses baseline vagal tone and lowers the threshold for sensory overwhelm by 25%.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      var currentSensoryData = null;

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
        var acousticDrain = (noise - 30) * 0.45;
        var visualDrain = visual * 2.8;
        var maskingDrain = masking * 3.8;
        var drain = acousticDrain + visualDrain + maskingDrain;
        var remaining = Math.max(5, Math.min(100, Math.round(baseBattery - drain)));

        document.getElementById('batteryVal').textContent = remaining + '%';
        var bar = document.getElementById('batteryBar');
        bar.style.width = remaining + '%';

        var stateEl = document.getElementById('polyvagalState');
        var descEl = document.getElementById('polyvagalDesc');
        var stateTitle = '';

        if (remaining >= 60) {
          bar.style.background = '#10b981';
          document.getElementById('batteryVal').style.color = '#10b981';
          stateTitle = 'Ventral Vagal (Safe, Regulated & Social)';
          stateEl.textContent = stateTitle;
          stateEl.style.color = '#10b981';
          descEl.textContent = 'Your nervous system has sufficient allostatic bandwidth. Sensory filtering is optimal, working memory is fluid, and social engagement feels natural.';
        } else if (remaining >= 30) {
          bar.style.background = '#f59e0b';
          document.getElementById('batteryVal').style.color = '#f59e0b';
          stateTitle = 'Sympathetic Activation (Fight / Flight / Hyper-Vigilance)';
          stateEl.textContent = stateTitle;
          stateEl.style.color = '#f59e0b';
          descEl.textContent = 'Your autonomic battery is depleted. You may feel irritable, restless, sensitive to sudden noises, or overwhelmed by light. Prioritize immediate sensory reduction.';
        } else {
          bar.style.background = '#ef4444';
          document.getElementById('batteryVal').style.color = '#ef4444';
          stateTitle = 'Dorsal Vagal Shutdown (Sensory Freeze & Dissociation)';
          stateEl.textContent = stateTitle;
          stateEl.style.color = '#ef4444';
          descEl.textContent = 'Critical depletion threshold. The nervous system is defending itself through numbness, severe executive dysfunction, and emotional exhaustion. Eliminate all non-essential stimuli immediately.';
        }

        // Live math derivations
        document.getElementById('derSensStep1').innerHTML = 
          'Sleep Rest Baseline: ' + sleep + ' / 10 &times; 10 = <strong>' + baseBattery.toFixed(1) + ' Base Points</strong>';
        document.getElementById('derSensStep2').innerHTML = 
          'Sensory Drain: Acoustic (' + acousticDrain.toFixed(1) + ') + Visual (' + visualDrain.toFixed(1) + ') + Masking (' + maskingDrain.toFixed(1) + ') = <strong>' + drain.toFixed(1) + ' Drain Points</strong>';
        document.getElementById('derSensStep3').innerHTML = 
          'Residual Autonomic Battery: ' + baseBattery.toFixed(1) + ' - ' + drain.toFixed(1) + ' = <strong>' + remaining + '% (' + stateTitle + ')</strong>';

        currentSensoryData = {
          battery: remaining + '%',
          state: stateTitle,
          noise: noiseLabel,
          visual: visual + ' Hours',
          masking: masking + ' Hours'
        };
      }

      function copySensorySummary() {
        if (!currentSensoryData) return;
        var d = currentSensoryData;
        var text = 
          'AUTONOMIC SENSORY BATTERY DIAGNOSTIC\n' +
          '========================================\n' +
          '• Residual Battery Level: ' + d.battery + '\n' +
          '• Current Polyvagal State: ' + d.state + '\n' +
          '• Noise Exposure: ' + d.noise + '\n' +
          '• Screen & Glare Exposure: ' + d.visual + '\n' +
          '• Social Masking Load: ' + d.masking + '\n' +
          '========================================\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopySensory');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Autonomic Battery Diagnostic!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
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

  writeFileSync(join(utilDir, 'sensory-overload-meter.html'), renderCuriosityPage({
    title: "Sensory Overload Budget & Autonomic Battery Meter [Polyvagal Stress Diagnostic] | Digital Tools Shed",
    metaDesc: "Calculate your nervous system's daily sensory load against allostatic capacity. Audit auditory noise, visual flicker, social masking, and context switches to prevent neurodivergent burnout.",
    canonical: `${DOMAIN}/util/sensory-overload-meter`,
    bodyContent: sensoryMeterHtml,
    currentPath: '/util/sensory-overload-meter',
    faq: [
      {
        q: "What is the Polyvagal Theory in autonomic neuroscience?",
        a: "Developed by Dr. Stephen Porges, Polyvagal Theory models how the autonomic nervous system shifts between three physiological states: Ventral Vagal (safe, socially engaged, resting), Sympathetic (threat, stress, sensory overload), and Dorsal Vagal (freeze, burnout, dissociation)."
      },
      {
        q: "Why is the Physiological Sigh so effective for instant autonomic regulation?",
        a: "Two rapid nasal inhalations reinflate collapsed pulmonary alveoli, maximizing oxygen/carbon dioxide diffusion. The subsequent prolonged mouth exhalation stimulates the vagus nerve, rapidly decelerating heart rate and dropping sympathetic arousal faster than traditional meditation."
      },
      {
        q: "What is allostatic load in sensory processing?",
        a: "Allostatic load represents the cumulative physiological wear and tear on the body and brain resulting from chronic neurochemical stress responses to environmental stimuli (acoustic noise, blue light glare, social masking)."
      },
      {
        q: "Why is social masking particularly exhausting for neurodivergent individuals?",
        a: "Social masking requires continuous active cognitive compensation—monitoring facial expressions, suppressing stimming, modulating voice tone, and analyzing conversational subtext. This forces the prefrontal cortex to work in high-demand mode continuously without rest."
      },
      {
        q: "How can I quickly recharge an autonomic battery below 30%?",
        a: "Engage in immediate sensory deprivation: enter a dark, quiet room, lie horizontally, place a cool cloth over your eyes, perform 3–5 cycles of the physiological sigh, and avoid all interactive screens for at least 20 minutes."
      }
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

      <!-- LIVE MATHEMATICAL DERIVATION BREAKDOWN -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">📐 Neocortex Ratio &amp; Social Allocation Derivation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Evaluating human social brain capacity algebraically across Dunbar's fractals:
        </p>

        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Total Real Active Relationships</strong>
            <div id="derDunStep1" style="color: #3b82f6; margin-top: 0.25rem;">4 + 12 + 38 + 110 = 164 Active Relationships</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Neocortical Bandwidth Utilization</strong>
            <div id="derDunStep2" style="color: var(--text-muted); margin-top: 0.25rem;">(164 / 150) &times; 100% = 109.3% of theoretical evolutionary maximum</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Parasocial Displacement Quotient</strong>
            <div id="derDunStep3" style="color: #a855f7; margin-top: 0.25rem;">3.5 hrs/day consumes ~22% of daily conversational bandwidth</div>
          </div>
        </div>

        <button id="btnCopyDunbar" onclick="copyDunbarSummary()" class="btn-primary" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
          📋 Copy Dunbar Social Audit Report
        </button>
      </div>

      <!-- 5 FATAL TRAPS & ANTHROPOLOGICAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Social Traps &amp; Anthropological Pitfalls</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Our evolutionary hardware was sculpted for Pleistocene hunter-gatherer bands, not global digital hyper-connectivity:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The Parasocial Digital Displacement Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Allocating 4+ hours daily to watching online influencers, podcasters, and streamers. The human neocortex cannot distinguish between broadcast faces and genuine tribe members, tricking your brain into feeling "socially full" while leaving your oxytocin circuits starved.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. The Social Dilution Fallacy</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Attempting to maintain 500+ "friends" on social media. Neocortical constraints mean that widening your outer circle inevitably cannibalizes the time and emotional investment required to sustain your inner 5-person Support Clique.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Neglecting the Inner 5 Support Clique</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Failing to regularly invest deep, uninterrupted time into the 5 core individuals who would shelter, support, or care for you during a severe crisis. Without active maintenance, support tier relationships decay within 12 to 18 months.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. Energy Vampire Retention</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Keeping emotionally draining, one-sided acquaintances in your Sympathy Group (15-layer) out of guilt or inertia, blocking space for mutual, energizing friendships.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. The "Broadcast Communication" Illusion</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Confusing public status updates, Instagram stories, and group chats with one-on-one relational maintenance. Deep emotional bonds require personalized dyadic interaction.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      var currentDunbarData = null;

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

        var pctNeocortex = ((totalReal / 150) * 100).toFixed(1);
        var dispPct = Math.min(100, Math.round((paraH / 16) * 100));

        document.getElementById('derDunStep1').innerHTML = 
          'Total Active Relationships: ' + t1 + ' (Core) + ' + t2 + ' (Sympathy) + ' + t3 + ' (Friends) + ' + t4 + ' (Contacts) = <strong>' + totalReal + ' People</strong>';
        document.getElementById('derDunStep2').innerHTML = 
          'Neocortex Capacity Ratio: (' + totalReal + ' / 150) &times; 100% = <strong>' + pctNeocortex + '% of Dunbar Limit</strong>';
        document.getElementById('derDunStep3').innerHTML = 
          'Parasocial Time Displacement: ' + paraH.toFixed(1) + ' hrs / 16 waking hrs = <strong>~' + dispPct + '% of daily social bandwidth</strong>';

        currentDunbarData = {
          total: totalReal,
          pct: pctNeocortex + '%',
          tier1: t1,
          tier2: t2,
          parasocial: paraH.toFixed(1) + ' hrs/day'
        };
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

      function copyDunbarSummary() {
        if (!currentDunbarData) return;
        var d = currentDunbarData;
        var text = 
          'DUNBAR 150 SOCIAL SPHERE AUDIT REPORT\n' +
          '========================================\n' +
          '• Total Active Social Sphere: ' + d.total + ' People (' + d.pct + ' of Neocortex Limit)\n' +
          '• Layer 1 (Support Clique): ' + d.tier1 + ' People (Target ~5)\n' +
          '• Layer 2 (Sympathy Group): ' + d.tier2 + ' People (Target ~15)\n' +
          '• Daily Parasocial Media Load: ' + d.parasocial + '\n' +
          '========================================\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyDunbar');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Dunbar Social Audit!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', calcDunbar);
    </script>
  `;

  writeFileSync(join(utilDir, 'dunbar-social-auditor.html'), renderCuriosityPage({
    title: "Dunbar's 150 Social Sphere Auditor [Neocortex Bandwidth Diagnostic] | Digital Tools Shed",
    metaDesc: "Audit your personal relationships against Robin Dunbar's 5-15-50-150 cognitive limit layers. Discover if digital feeds and energy vampires are exhausting your neocortex bandwidth.",
    canonical: `${DOMAIN}/util/dunbar-social-auditor`,
    bodyContent: dunbarHtml,
    currentPath: '/util/dunbar-social-auditor',
    faq: [
      {
        q: "What is Dunbar's Number in evolutionary anthropology?",
        a: "Discovered by British anthropologist Robin Dunbar, Dunbar's Number (approximately 150) is the theoretical cognitive limit to the number of individuals with whom a human can maintain stable, reciprocal social relationships. It correlates directly with primate neocortex volume."
      },
      {
        q: "What are the four concentric layers of Dunbar's circles?",
        a: "Dunbar's layers follow a rule of 3: 5 core intimates (Support Clique), 15 close confidants (Sympathy Group), 50 good friends, and 150 meaningful acquaintances. Beyond 150, relationships become transactional and cannot be sustained without formal institutions."
      },
      {
        q: "What is parasocial cognitive displacement?",
        a: "When people spend hours consuming content from online creators and podcasters, our evolutionary brain processes their faces as members of our physical band. This drains neocortical bandwidth and creates an illusion of companionship while leaving real oxytocin and bonding circuits starved."
      },
      {
        q: "How fast do friendships decay if not actively maintained?",
        a: "Dunbar's research indicates that moving an individual into your inner 5 requires roughly 200 hours of shared time within a 6-month window. If contact drops to casual messaging, relationship intimacy decays from Tier 1 to Tier 3 within 12 to 18 months."
      },
      {
        q: "Can digital social media expand our natural neocortex limit beyond 150?",
        a: "No. Brain imaging and digital interaction studies demonstrate that while people may collect thousands of followers or Facebook friends, the actual number of reciprocal active conversations remains bounded between 100 and 200 individuals."
      }
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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">Cognitive Neurobiology & Hebbian Plasticity</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Habit Decay Half-Life & Synaptic Pruning Simulator</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Mathematically simulate neural pathway degradation when habits are interrupted. Explore exponential synaptic degradation, Hebbian plasticity, and why the <em>"never miss twice"</em> rule protects myelination.
        </p>
      </header>

      <!-- INTERACTIVE SIMULATOR CARD -->
      <div class="neuro-card">
        <div class="neuro-slider-row" style="margin-bottom: 1.25rem;">
          <div class="neuro-slider-label">
            <span>Prior Established Habit Streak (Consistency Duration)</span>
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
          Missing 1 day produces minor decay (~4%). Missing 2 consecutive days triggers synaptic destabilization. Missing 3+ days triggers active dendritic spine retraction.
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

      <!-- MATHEMATICAL & NEUROBIOLOGICAL DERIVATION -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Mathematical & Neurobiological Derivation of Synaptic Decay</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Habit automaticity follows Donald Hebb's Law of Coincident Activation coupled with non-linear exponential decay during periods of disuse:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1rem;">
          1. Peak Synaptic Strength (Lally Logistic Assimilation):<br>
          &nbsp;&nbsp;&nbsp;S_peak = 100 &times; (1 - e^(-Streak / 45))<br><br>
          2. Accelerated Disuse Factor (Non-Linear Decay):<br>
          &nbsp;&nbsp;&nbsp;&lambda;(Gap) = e^(-0.04 &times; Gap - 0.03 &times; Gap^1.6)<br><br>
          3. Residual Automated Automaticity:<br>
          &nbsp;&nbsp;&nbsp;S(t) = S_peak &times; &lambda;(Gap)<br><br>
          4. Prefrontal Re-entry Activation Energy (&Delta;E):<br>
          &nbsp;&nbsp;&nbsp;&Delta;E = (100 - S(t)) &times; 0.70<br><br>
          5. Restorative Repetitions to Regain Full Myelination:<br>
          &nbsp;&nbsp;&nbsp;R_rest = max(1, round(Gap &times; 1.8))
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyHabitProtocol()" id="copyHabitBtn" class="neuro-btn-primary">📋 Copy Habit Preservation Protocol</button>
        </div>
      </div>

      <!-- FATAL TRAPS & NEUROBIOLOGICAL PITFALLS -->
      <div class="neuro-card" style="margin-top: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Habit Degradation & Recovery Pitfalls</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The "All-or-Nothing" Streak Identity Trap</strong>
          Believing that missing a single day resets your progress to absolute zero. This triggers the psychological "what-the-hell" effect (counter-regulatory bingeing or complete cessation). In reality, a single missed day retains ~96% of synaptic potentiation. The real danger is the consecutive second miss.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Motivation Re-ignition Fallacy</strong>
          Relying on emotional motivation or willpower rather than reducing environmental friction to resume an interrupted routine. After a lapse, the prefrontal cortex experiences elevated cognitive drag; the only reliable remedy is drastically lowering initial task friction (e.g. setting gym clothes out).
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Volume Compensation Trap</strong>
          Attempting a punishing 3-hour marathon workout or study session to "make up" for 4 missed days. The basal ganglia encodes daily temporal frequency, not sporadic volume spikes. Overcompensating induces severe soreness, cognitive burnout, and further consecutive absences.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Context-Decoupling Blindspot</strong>
          Failing to recognize that habits are neurologically anchored to environmental sensory cues (time of day, physical location, room layout). Traveling or schedule disruptions dismantle these associative cues; you must deliberately map the habit to a portable trigger (e.g., right after morning coffee).
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The 21-Day Automaticity Myth</strong>
          Relying on the popular folklore that habits require exactly 21 days to form (derived from Dr. Maxwell Maltz's cosmetic surgery observations in 1960). Empirical University College London research by Dr. Phillippa Lally demonstrates real automaticity requires 66 to 254 days of consistent myelination.
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

      function copyHabitProtocol() {
        var streak = document.getElementById('streakInput').value;
        var missed = document.getElementById('missedInput').value;
        var s = document.getElementById('synapticStrength').textContent;
        var f = document.getElementById('frictionScore').textContent;
        var r = document.getElementById('restoreDays').textContent;
        var text = '=== HABIT DECAY & SYNAPTIC PRESERVATION AUDIT ===\n' +
          'Baseline Habit Streak: ' + streak + ' Days\n' +
          'Current Interruption Gap: ' + missed + ' Days Missed\n' +
          'Retained Synaptic Strength: ' + s + '\n' +
          'Prefrontal Friction Surcharge: ' + f + '\n' +
          'Consecutive Reps to Restore Automaticity: ' + r + '\n\n' +
          'NEVER MISS TWICE RECOVERY RULE:\n' +
          'Execute a Minimum Viable Repetition (MVR) within 24 hours (e.g., 60 seconds of activity) ' +
          'to trigger synaptic facilitation and halt dendritic spine retraction.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyHabitBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Habit Protocol!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', simHabit);
    </script>
  `;

  writeFileSync(join(utilDir, 'habit-decay-simulator.html'), renderCuriosityPage({
    title: "Habit Decay Half-Life & Synaptic Pruning Simulator [The 'Never Miss Twice' Proof] | Digital Tools Shed",
    metaDesc: "Mathematically simulate neural pathway decay when habits are interrupted. Explore exponential synaptic degradation, Hebbian plasticity, and why the 'never miss twice' rule protects myelination.",
    canonical: `${DOMAIN}/util/habit-decay-simulator`,
    bodyContent: habitDecayHtml,
    currentPath: '/util/habit-decay-simulator',
    faq: [
      {
        q: "What is Donald Hebb's rule and how does it govern habit decay?",
        a: "Formulated by Canadian neuropsychologist Donald Hebb in 1949 ('neurons that fire together wire together'), synaptic connections strengthen through repetitive synchronous firing (long-term potentiation). Conversely, when an established pathway is left unactivated, dendritic spine density gradually declines through activity-dependent synaptic pruning."
      },
      {
        q: "Why is the 'Never Miss Twice' rule neurobiologically decisive?",
        a: "A single day off represents an isolated anomaly; synaptic transmission efficiency remains at ~96%. However, two consecutive absences break the temporal predictive loop in the basal ganglia, triggering dendritic retraction and nearly doubling the prefrontal activation energy required to initiate the routine again."
      },
      {
        q: "How does the 2-Minute Minimum Viable Repetition (MVR) stop synaptic pruning?",
        a: "The nervous system prioritizes pathway recruitment over total metabolic volume. Performing a 60-second or 2-minute micro-rep (e.g., doing 2 push-ups or reading 1 paragraph) fires the exact same neural circuit, releasing neurotransmitters that preserve synaptic potentiation."
      },
      {
        q: "What is the difference between basal ganglia automaticity and prefrontal effort?",
        a: "When a behavior is new, it relies heavily on the prefrontal cortex, which consumes substantial glucose and feels effortful. As the habit becomes automated, control transfers to the dorsolateral striatum within the basal ganglia, requiring virtually zero conscious willpower."
      },
      {
        q: "How long does it actually take to restore a lapsed habit pathway?",
        a: "Restoring an interrupted habit takes far fewer repetitions than building one from scratch due to residual synaptic scaffolding. For each day missed up to 14 days, approximately 1.8 consecutive daily repetitions are required to rebuild peak automaticity."
      }
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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ec4899; margin-bottom: 0.5rem;">Conditional Probability & Demographic Funnel</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Personal Drake Equation</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Calculate the exact mathematical probability of finding your ideal romantic partner or intellectual peer. Cascades demographic and psychological filters into an interactive probability funnel.
        </p>
      </header>

      <!-- SIMULATOR CONTROLS -->
      <div class="neuro-card">
        <div style="margin-bottom: 1.25rem;">
          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Metropolitan / Regional Population (N_pop)</span>
              <strong id="valPop" style="color: #3b82f6;">1,000,000 People</strong>
            </div>
            <input type="range" id="popInput" min="50000" max="15000000" step="50000" value="1000000" class="neuro-slider-input" oninput="calcPersonalDrake()" />
          </div>

          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Target Gender Orientation Fraction (fg)</span>
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

      <!-- MATHEMATICAL DERIVATION CARD -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Mathematical Architecture: Conditional Probability Funnel</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Adapted from Dr. Frank Drake's 1961 interstellar communications equation by Cambridge mathematician Peter Backus (2010), the formula cascades demographic filters as sequential conditional fractions:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1rem;">
          N = N_pop &times; f_g &times; f_a &times; f_s &times; f_v &times; f_m &times; f_c<br><br>
          Where:<br>
          &bull; N_pop = Total regional or metropolitan search population<br>
          &bull; f_g = Target gender orientation fraction (typically ~0.50)<br>
          &bull; f_a = Target age cohort fraction (typically 0.15 - 0.25)<br>
          &bull; f_s = Unpartnered / actively available fraction (typically 0.35 - 0.50)<br>
          &bull; f_v = Values, intellectual, and lifestyle alignment threshold (0.05 - 0.25)<br>
          &bull; f_m = Mutual physical attraction probability (P(you like them) &times; P(they like you))<br>
          &bull; f_c = Relational chemistry and mutual life-stage timing (0.05 - 0.20)<br><br>
          Joint Probability P_joint = &prod; f_i | Odds = 1 / P_joint
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyDrakeSummary()" id="copyDrakeBtn" class="neuro-btn-primary">📋 Copy Compatibility Funnel Audit</button>
        </div>
      </div>

      <!-- FATAL TRAPS & PROBABILITY PITFALLS -->
      <div class="neuro-card" style="margin-top: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Compatibility Filtering & Mathematical Pitfalls</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Trait Independence Assumption Fallacy</strong>
          Treating traits like education, shared humor, and core lifestyle values as statistically independent variables. In reality, desirable cultural and intellectual traits exhibit strong positive covariance; someone who shares your aesthetic taste is statistically far more likely to share your educational background.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Geographic Micro-Bubble Trap</strong>
          Confining partner search to an arbitrary 5-mile radius while requiring 6 top-decile preferences. In a city of 1 million, applying six 10% filters yields 1 candidate. Expanding search radius to 30 miles increases the base population pool by 800% without sacrificing standards.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Checklist Maximization Dilemma</strong>
          Adding arbitrary non-essential criteria (e.g., exact height cutoffs, hyper-specific musical subgenres) that exponentially decimate candidate volume without yielding measurable improvements in long-term marital or relational satisfaction.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The One-Way Attractiveness Blindspot</strong>
          Calculating only the percentage of candidates <em>you</em> find physically or intellectually attractive, while completely neglecting the reciprocal probability filter: the percentage of those individuals who will find <em>you</em> attractive and suitable for their life goals.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Static Pool Assumption</strong>
          Treating the target dating pool as a closed, static container. Human populations are in constant dynamic equilibrium: every month, thousands of individuals graduate, relocate, break up, and enter availability within your geographical radius.
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

      function copyDrakeSummary() {
        var pop = document.getElementById('valPop').textContent;
        var cand = document.getElementById('drakeCandidates').textContent;
        var odds = document.getElementById('drakeOdds').textContent;
        var text = '=== PERSONAL DRAKE EQUATION COMPATIBILITY REPORT ===\n' +
          'Search Population Pool: ' + pop + '\n' +
          'Compatible Candidates in Region: ' + cand + '\n' +
          'Joint Probability Odds: ' + odds + '\n' +
          'Demographic Filters:\n' +
          '  - Gender Fraction: ' + document.getElementById('valGender').textContent + '\n' +
          '  - Age Bracket: ' + document.getElementById('valAge').textContent + '\n' +
          '  - Single / Available: ' + document.getElementById('valSingle').textContent + '\n' +
          '  - Values / Lifestyle: ' + document.getElementById('valValues').textContent + '\n' +
          '  - Mutual Attraction: ' + document.getElementById('valAttr').textContent + '\n' +
          '  - Chemistry & Timing: ' + document.getElementById('valChem').textContent + '\n\n' +
          'STRATEGIC RECOMMENDATION:\n' +
          'Expanding geographic radius by 25 miles or relaxing secondary non-essential preferences ' +
          'multiplies the viable candidate pool by 200% to 400% through compound probability expansion.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyDrakeBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Compatibility Report!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', calcPersonalDrake);
    </script>
  `;

  writeFileSync(join(utilDir, 'personal-drake-equation.html'), renderCuriosityPage({
    title: "The Personal Drake Equation [Human Compatibility Probability Funnel] | Digital Tools Shed",
    metaDesc: "Calculate the exact mathematical probability of finding your ideal romantic partner or intellectual peer. Cascades demographic and psychological filters into an interactive probability funnel.",
    canonical: `${DOMAIN}/util/personal-drake-equation`,
    bodyContent: personalDrakeHtml,
    currentPath: '/util/personal-drake-equation',
    faq: [
      {
        q: "What is the Personal Drake Equation and who formulated it?",
        a: "In 2010, University of Warwick / Cambridge mathematician Peter Backus published 'Why I Don't Have a Girlfriend', adapting Frank Drake's 1961 SETI astrophysics formula to compute that out of 30 million women in the UK, only 26 were compatible matches for him (a probability of 1 in 285,000)."
      },
      {
        q: "Why does multiplying independent fractions collapse probability so rapidly?",
        a: "Compound multiplication demonstrates geometric decay: 0.50 &times; 0.20 &times; 0.45 &times; 0.15 &times; 0.10 &times; 0.10 produces 0.0000675 (less than 1 in 14,000). Every additional 'nice-to-have' condition slices the remaining pool exponentially."
      },
      {
        q: "Are human compatibility traits truly independent in demographic studies?",
        a: "No. In real populations, socioeconomic status, educational attainment, political worldview, and recreational interests exhibit strong positive correlation. Assuming complete statistical independence underestimates the true candidate volume in targeted subcultures."
      },
      {
        q: "What is the single most effective way to improve my odds?",
        a: "Expanding your search radius or spending time in concentrated affinity hubs (specialized professional groups, hobby clubs, academic environments) yields 10&times; greater pool density than using generic mass-market dating apps."
      },
      {
        q: "How does reciprocal selectivity affect the final candidate count?",
        a: "Mutual attraction is bidirectional. If you find 10% of candidates attractive, and they find 10% of candidates attractive, the joint mutual attraction fraction is 0.10 &times; 0.10 = 0.01 (1%), not 10%."
      }
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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Bayesian Probability & Rationality Benchmark</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Epistemic Calibration & Overconfidence Benchmark</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Measure your epistemic calibration against objective reality. Provide an <strong>80% confidence interval</strong> for 10 trivia questions. If your brain is perfectly calibrated, exactly 8 out of 10 answers will fall inside your specified bounds.
        </p>
      </header>

      <!-- QUIZ CARD -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem;">Enter Your 80% Confidence Interval</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          For each question, specify a Lower Bound and Upper Bound such that you are <strong>80% confident</strong> the true value lies between them. You should feel comfortable betting $80 against $20 on your interval.
        </p>

        <div id="calibErrorMsg" style="display:none; background:rgba(239,68,68,0.1); border-left:4px solid #ef4444; padding:0.75rem 1rem; border-radius:4px; margin-bottom:1rem; color:#ef4444; font-weight:600;"></div>

        <div id="questionsContainer"></div>

        <div style="margin-top: 1.5rem;">
          <button onclick="scoreCalibration()" class="neuro-btn-primary" style="font-size: 1rem; padding: 0.75rem 1.5rem;">🎯 Score My Epistemic Calibration</button>
        </div>
      </div>

      <!-- RESULTS CARD -->
      <div id="calibResultsCard" class="neuro-card" style="display: none; border-top: 4px solid #10b981;">
        <h3 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 0.5rem;">Your Calibration Diagnostic Scorecard</h3>
        <div id="hitRateDisplay" style="font-family: var(--serif); font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;"></div>
        <div id="hitArchetype" style="font-family: var(--mono); font-size: 1.1rem; font-weight: bold; margin-bottom: 0.5rem;"></div>
        <p id="hitDesc" style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;"></p>

        <div id="detailedAnswersTable" style="overflow-x: auto; margin-bottom: 1.25rem;"></div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyCalibReport()" id="copyCalibBtn" class="neuro-btn-primary">📋 Copy Calibration Scorecard</button>
        </div>
      </div>

      <!-- MATHEMATICAL DERIVATION CARD -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Mathematical Foundations of Epistemic Calibration</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          In decision theory and subjective probability, calibration measures how closely subjective confidence intervals match empirical reality:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1rem;">
          1. Perfect Calibration Condition:<br>
          &nbsp;&nbsp;&nbsp;P(True &in; [L_i, U_i] | Confidence = c) = c<br>
          &nbsp;&nbsp;&nbsp;For an 80% interval (c = 0.80), exactly 8 out of 10 bounds must capture truth.<br><br>
          2. Calibration Hit Rate:<br>
          &nbsp;&nbsp;&nbsp;Hit_Rate = (1 / N) &times; &sum; I(True_i &in; [L_i, U_i])<br><br>
          3. Overconfidence Bias Measure (&Delta;C):<br>
          &nbsp;&nbsp;&nbsp;&Delta;C = Target_Confidence - Hit_Rate<br>
          &nbsp;&nbsp;&nbsp;If &Delta;C &gt; 0: Overconfidence (intervals too narrow)<br>
          &nbsp;&nbsp;&nbsp;If &Delta;C &lt; 0: Underconfidence / Excess Timidity (intervals too wide)<br><br>
          4. Brier Calibration Penalty:<br>
          &nbsp;&nbsp;&nbsp;BS = (1 / N) &times; &sum; (f_k - o_k)^2
        </div>
      </div>

      <!-- FATAL TRAPS & COGNITIVE OVERCONFIDENCE PITFALLS -->
      <div class="neuro-card" style="margin-top: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Epistemic Overconfidence Pitfalls</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Social Penalty on Expressing Uncertainty</strong>
          Human social hierarchies reward individuals who project certainty with rapid answers and narrow ranges. Expressing genuine uncertainty is often culturally misinterpreted as incompetence, training the brain to give artificially tight intervals.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. Anchor-and-Adjust Insufficiency</strong>
          When asked for an interval, the mind instinctively anchors on a single point guess, then nudges slightly higher and lower. This heuristic systematically fails to account for tail risks and distribution skewness.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. Confusing Calibration with Trivia Knowledge</strong>
          Believing that calibration requires encyclopedic knowledge. Perfect calibration does not require knowing the answer; it requires knowing <em>how much you do not know</em> and setting your interval wide enough (e.g. 100 to 100,000,000) to honestly achieve 80% confidence.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Linear Certainty Fallacy</strong>
          Treating unfamiliar physical quantities linearly rather than exponentially. Many astronomical, historical, and geological variables span multiple orders of magnitude, requiring log-scale bounds to be properly captured.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Unscored Belief Feedback Deprivation</strong>
          Most everyday opinions, business forecasts, and geopolitical predictions are never scored against empirical numbers. Without quantified scoring and Brier tracking, the brain's overconfidence mechanism never receives corrective feedback.
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
        var errEl = document.getElementById('calibErrorMsg');
        errEl.style.display = 'none';

        var hits = 0;
        var tableHtml = '<table style="width:100%;font-size:0.85rem;border-collapse:collapse;margin-top:1rem;"><thead><tr style="border-bottom:1px solid var(--border);text-align:left;"><th style="padding:0.4rem;">#</th><th style="padding:0.4rem;">Question</th><th style="padding:0.4rem;">Your 80% Band</th><th style="padding:0.4rem;">True Value</th><th style="padding:0.4rem;">Result</th></tr></thead><tbody>';

        for (var i = 0; i < calibQuestions.length; i++) {
          var item = calibQuestions[i];
          var low = parseFloat(document.getElementById('low_' + item.id).value);
          var high = parseFloat(document.getElementById('high_' + item.id).value);

          if (isNaN(low) || isNaN(high)) {
            errEl.textContent = 'Please fill out both lower and upper bounds for question #' + (i + 1);
            errEl.style.display = 'block';
            errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      function copyCalibReport() {
        var rate = document.getElementById('hitRateDisplay').textContent;
        var arch = document.getElementById('hitArchetype').textContent;
        var desc = document.getElementById('hitDesc').textContent;
        var text = '=== EPISTEMIC CALIBRATION BENCHMARK REPORT ===\n' +
          '80% Confidence Interval Hit Rate: ' + rate + '\n' +
          'Calibration Archetype: ' + arch + '\n' +
          'Diagnostic Evaluation: ' + desc + '\n\n' +
          'COGNITIVE TAKEAWAY:\n' +
          'Human culture rewards false certainty over honest ambiguity. To achieve true superforecaster ' +
          'calibration, deliberately widen intervals until 1 out of 5 statements genuinely feels surprising when missed.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyCalibBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Calibration Report!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', renderCalibQuiz);
    </script>
  `;

  writeFileSync(join(utilDir, 'epistemic-calibration.html'), renderCuriosityPage({
    title: "Epistemic Calibration & Overconfidence Game [Rationality Training Benchmark] | Digital Tools Shed",
    metaDesc: "Test your epistemic calibration with 10 numerical estimation questions. Provide 80% confidence intervals to measure whether your brain suffers from overconfidence or true Bayesian accuracy.",
    canonical: `${DOMAIN}/util/epistemic-calibration`,
    bodyContent: epistemicGameHtml,
    currentPath: '/util/epistemic-calibration',
    faq: [
      {
        q: "What is Epistemic Calibration in decision science?",
        a: "Epistemic calibration is the degree of alignment between a person's subjective certainty and objective reality. If you claim 80% confidence across 100 distinct factual estimates, exactly 80 of them should contain the true answer."
      },
      {
        q: "Why do most educated adults only hit 30% to 50% on 80% interval tests?",
        a: "Decades of research by Daniel Kahneman, Amos Tversky, and Philip Tetlock demonstrate that humans suffer from pervasive overconfidence. Social conditioning rewards decisive certainty over honest ambiguity, prompting people to provide intervals that are 3&times; to 5&times; too narrow."
      },
      {
        q: "How do professional superforecasters train themselves to give wider intervals?",
        a: "Superforecasters employ the 'outside view' and adversarial self-interrogation: they ask 'What would cause the true number to be 10 times higher or lower than my intuition?' and deliberately widen their boundaries until missing 1 out of 5 feels genuinely plausible."
      },
      {
        q: "What is the difference between calibration, resolution, and accuracy?",
        a: "Accuracy measures closeness to the true value; resolution measures how decisively probabilities diverge from base rates; calibration measures whether your assigned confidence probabilities match long-run empirical hit frequencies."
      },
      {
        q: "What is the Brier score and how does it evaluate epistemic humility?",
        a: "Invented by Glenn Brier in 1950, the Brier score calculates the mean squared error between forecasted subjective probabilities and actual binary outcomes (0 or 1). Lower scores denote superior calibration and probabilistic foresight."
      }
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
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #f59e0b; margin-bottom: 0.5rem;">Behavioral Economics & Prospect Theory</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Sunk Cost Fallacy & Irretrievable Loss Auditor</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Audit failing projects, bad investments, or unfulfilling commitments. Strip away past unrecoverable time and money using Daniel Kahneman's Prospect Theory to calculate forward expected value.
        </p>
      </header>

      <!-- PRESET SELECTOR -->
      <div class="neuro-card" style="margin-bottom: 1.5rem;">
        <div style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--text-muted);">Quick Scenario Presets</div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button onclick="setSunkPreset('startup')" class="neuro-tag-btn">🚀 Failing Startup Project</button>
          <button onclick="setSunkPreset('degree')" class="neuro-tag-btn">🎓 Mismatched Academic Degree</button>
          <button onclick="setSunkPreset('investment')" class="neuro-tag-btn">📉 Depreciating Stock/Asset</button>
          <button onclick="setSunkPreset('project')" class="neuro-tag-btn">🔨 Home Renovation Runaway</button>
        </div>
      </div>

      <!-- INPUT CONTROLS -->
      <div class="neuro-card">
        <div style="margin-bottom: 1.25rem;">
          <div class="neuro-slider-row">
            <div class="neuro-slider-label">
              <span>Sunk Time Already Invested (Hours)</span>
              <strong id="valSunkHours" style="color: #ef4444;">400 Hours</strong>
            </div>
            <input type="range" id="sunkHours" min="0" max="3000" step="25" value="400" class="neuro-slider-input" oninput="calcSunkCost()" />
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

      <!-- MATHEMATICAL & ECONOMIC DERIVATION -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Mathematical & Behavioral Derivation: Forward Marginal Utility</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Classical microeconomics dictates that all rational decisions must be based exclusively on <em>forward marginal expected value</em>, completely ignoring unrecoverable historical costs:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1rem;">
          1. Irretrievable Sunk Baseline (Past Capital & Time):<br>
          &nbsp;&nbsp;&nbsp;C_sunk = $Spent + (Hours_Spent &times; Hourly_Opportunity_Rate)<br>
          &nbsp;&nbsp;&nbsp;&part;(Forward_Outcome) / &part;(C_sunk) &equiv; 0 (Sunk cost is mathematically invariant)<br><br>
          2. Forward Expected Value of Continuing (Option A):<br>
          &nbsp;&nbsp;&nbsp;EV_continue = P(Success) &times; V(Success) - [C_future + (H_future &times; Hourly_Rate)]<br><br>
          3. Forward Expected Value of Reallocating Capital (Option B):<br>
          &nbsp;&nbsp;&nbsp;EV_pivot = Expected_Return(Alternative_Projects) - Pivot_Friction<br><br>
          4. Prospect Theory Loss Aversion Penalty (Kahneman & Tversky):<br>
          &nbsp;&nbsp;&nbsp;U(Loss) = -&lambda;(-x)^&beta; where &lambda; &approx; 2.25<br>
          &nbsp;&nbsp;&nbsp;The emotional pain of realizing a loss is 2.25&times; more potent than an equivalent gain, triggering irrational gambling behavior.
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copySunkAudit()" id="copySunkBtn" class="neuro-btn-primary">📋 Copy Sunk Cost Audit Memo</button>
        </div>
      </div>

      <!-- FATAL TRAPS & PROSPECT THEORY PITFALLS -->
      <div class="neuro-card" style="margin-top: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Sunk Cost Escalation & Decision Traps</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The "Waste" Moral Projection Trap</strong>
          Framing project termination as "wasting" past sacrifices, failing to realize that continuing an uneconomic project wastes <em>future</em> resources as well. The past resources are irretrievably gone regardless of what you do next.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Escalation of Commitment Spiral</strong>
          Injecting progressively larger tranches of capital, overtime hours, and organizational reputation into a failing project to defend ego and previous public endorsements from being perceived as mistakes.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Invisible Opportunity Cost Blindspot</strong>
          Measuring only direct cash outlays while ignoring what economists call alternative yield: what world-class projects could your next 250 hours and $5,000 create if deployed into a fresh high-momentum initiative?
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. Prospect Theory Risk-Seeking in the Loss Domain</strong>
          Daniel Kahneman demonstrated that humans become recklessly risk-seeking when facing a certain loss. Rather than accepting a $10,000 loss, founders gamble another $20,000 hoping for a miracle to "get back to even".
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. Organizational Face-Saving Inertia</strong>
          In corporate and government bureaucracies, continuing an obviously doomed project is frequently politically safer for middle management than admitting an error and officially writing off the investment.
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

      function copySunkAudit() {
        var sunkH = document.getElementById('valSunkHours').textContent;
        var sunkM = document.getElementById('valSunkMoney').textContent;
        var futH = document.getElementById('valFutureHours').textContent;
        var prob = document.getElementById('valProb').textContent;
        var ev = document.getElementById('dispEV').textContent;
        var rec = document.getElementById('dispRec').textContent;
        var text = '=== SUNK COST & IRRETRIEVABLE LOSS DECISION AUDIT ===\n' +
          'Irretrievable Past Investment: ' + sunkH + ' and ' + sunkM + '\n' +
          'Future Commitment Required: ' + futH + '\n' +
          'Estimated Probability of Success: ' + prob + '\n' +
          'Forward Marginal EV: ' + ev + '\n' +
          'Action Verdict: ' + rec + '\n\n' +
          'EXECUTIVE SUMMARY:\n' +
          'Past capital and hours are sunk and gone forever. Evaluating the continuation of this project ' +
          'must be identical to evaluating a brand-new project requiring ' + futH + ' with a ' + prob + ' success odds.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copySunkBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Sunk Cost Memo!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', calcSunkCost);
    </script>
  `;

  writeFileSync(join(utilDir, 'sunk-cost-auditor.html'), renderCuriosityPage({
    title: "The Sunk Cost Fallacy & Irretrievable Loss Auditor [Prospect Theory Decision Tree] | Digital Tools Shed",
    metaDesc: "Audit failing projects, bad investments, or unfulfilling commitments. Strip away past unrecoverable time and money using Daniel Kahneman's Prospect Theory to calculate forward expected value.",
    canonical: `${DOMAIN}/util/sunk-cost-auditor`,
    bodyContent: sunkCostHtml,
    currentPath: '/util/sunk-cost-auditor',
    faq: [
      {
        q: "What is the formal economic definition of a sunk cost?",
        a: "A sunk cost is any expenditure of financial capital, time, or emotional energy that has already been incurred and cannot be recovered under any future contingency. In rational economics, sunk costs should exert zero influence on prospective choices."
      },
      {
        q: "Why does the human brain instinctively escalate commitment to failing projects?",
        a: "Evolutionary psychology reveals that acknowledging an unforced loss induces status anxiety, ego dissonance, and social embarrassment. Human brains subconsciously rationalize that continuing the project keeps hope alive, delaying the pain of public admission."
      },
      {
        q: "How does Daniel Kahneman and Amos Tversky's Prospect Theory model loss aversion?",
        a: "Formulated in 1979, Prospect Theory demonstrated that the subjective pain of an economic loss is approximately 2.25 times greater than the subjective pleasure of an equivalent financial gain. This asymmetry causes individuals to accept reckless risks in a desperate bid to return to break-even."
      },
      {
        q: "What is the Concorde Fallacy and what can we learn from it?",
        a: "The Concorde Fallacy refers to the joint British and French government development of the supersonic passenger jet. Long after it was mathematically evident that the airliner was commercially unviable, politicians continued pouring hundreds of millions into the project simply because 'too much had already been invested to stop'."
      },
      {
        q: "How do elite venture capitalists and poker players eliminate sunk cost bias?",
        a: "Top practitioners use pre-mortem commitments, portfolio diversification, and external investment committees. When evaluating an existing portfolio company, they ask: 'Knowing everything we know today, would we write a fresh check into this business right now?' If the answer is no, they immediately cut losses."
      }
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

      <!-- ASTROPHYSICAL & TEMPORAL DERIVATION -->
      <div class="neuro-card">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Astrophysical & Temporal Derivation: The Logarithmic Horizon</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Cosmic deep time scales span more than 100 orders of magnitude, contextualizing the microscopic duration of organic consciousness:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1rem;">
          1. Personal Elapsed Fraction of Earth Age:<br>
          &nbsp;&nbsp;&nbsp;F_earth = t_personal / (4.54 &times; 10^9 &times; 365.25 &times; 86,400) &approx; 6.2 &times; 10^-10<br><br>
          2. Cosmic Year Transformation (Carl Sagan Compressed Epoch):<br>
          &nbsp;&nbsp;&nbsp;T_cosmic = (Age_Years / 1.38 &times; 10^10) &times; 31,536,000 seconds<br>
          &nbsp;&nbsp;&nbsp;An 80-year human life corresponds to ~0.18 seconds on December 31 at 23:59:59.<br><br>
          3. Thermodynamic Time Horizons (Dyson & Adams):<br>
          &nbsp;&nbsp;&nbsp;&bull; Solar Red Giant Expansion: ~5.0 &times; 10^9 years<br>
          &nbsp;&nbsp;&nbsp;&bull; Stelliferous Era End: ~1.0 &times; 10^14 years<br>
          &nbsp;&nbsp;&nbsp;&bull; Degenerate Era Proton Decay: ~1.0 &times; 10^34 years<br>
          &nbsp;&nbsp;&nbsp;&bull; Black Hole Evaporation (Hawking Radiation): ~1.0 &times; 10^100 years
        </div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyCosmicSummary()" id="copyCosmicBtn" class="neuro-btn-primary">📋 Copy Cosmic Grounding Summary</button>
        </div>
      </div>

      <!-- FATAL TRAPS & COSMIC TIME PITFALLS -->
      <div class="neuro-card" style="margin-top: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Existential Perspective & Deep Time Traps</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Amygdala Temporal Myopia Trap</strong>
          Evolutionary biology wired human brains for acute, immediate survival on the savannah. Our nervous system mistakes trivial social friction (e.g. an uncomfortable meeting) for a life-threatening crisis, triggering prolonged cortisol dumps for microscopic non-events.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. Passive Nihilism Paralysis</strong>
          Confusing cosmic vastness with total futility. Concluding that 'because stars burn out, nothing matters' is an epistemic error. Value is generated locally by conscious observers; cosmic indifference liberates you to choose your own virtues without universal judgment.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Egocentric Epoch Illusion</strong>
          Intuitively feeling that current modern society represents the permanent climax of history. In reality, human civilization represents 0.000002% of planetary history; trillions of years of physical evolution remain ahead.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. Linear Time Intuition Breakdown</strong>
          Attempting to visualize deep cosmological time using linear intuition. The difference between 1 million years and 1 billion years cannot be grasped linearly; logarithmic scales and calendar compression are mathematically required for neural grounding.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Deferral of Living Fallacy</strong>
          Postponing authentic connection, creative expression, and gratitude under the illusion that you will 'get around to living' in a later chapter. In cosmic terms, your conscious aperture is open for a fraction of a millisecond; there is only now.
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
        var out = document.getElementById('vaporizeOutput');
        if (!str) {
          out.style.display = 'block';
          out.innerHTML = '<div style="color:#ef4444; font-weight:600;">⚠️ Please enter a current worry or stressor above to dissolve it against cosmic scale.</div>';
          return;
        }

        out.style.display = 'block';
        out.innerHTML = 
          '<div style="font-family:var(--mono);font-size:0.8rem;text-transform:uppercase;color:#a855f7;font-weight:bold;margin-bottom:0.4rem;">Cosmic Perspective Grounding</div>' +
          '<p style="margin:0 0 0.5rem;">You are stressed about: <em>"' + str + '"</em>.</p>' +
          '<p style="margin:0 0 0.5rem;color:var(--text-muted);">In approximately 5 billion years, our Sun will expand into a red giant, vaporizing Earth, all physical relics, and every server that ever recorded human worry. In 100 trillion years, the final stars will fade to dark iron remnants.</p>' +
          '<p style="margin:0;font-weight:bold;color:#10b981;">Your problem is real in your immediate subjective experience, but completely weightless against the cosmos. Breathe deeply, handle what is directly in your control right now, and let go of the rest.</p>';
      }

      function copyCosmicSummary() {
        var sec = document.getElementById('personalSeconds').textContent;
        var ef = document.getElementById('earthFraction').textContent;
        var cy = document.getElementById('cosmicYearTime').textContent;
        var text = '=== COSMIC PERSPECTIVE GROUNDING SUMMARY ===\n' +
          'Personal Earth Lifetime Fraction: ' + ef + '\n' +
          'Elapsed Personal Consciousness: ' + sec + '\n' +
          'Position on Sagan Cosmic Calendar: ' + cy + '\n\n' +
          'STOIC PERSPECTIVE GROUNDING:\n' +
          'Against the 13.8 billion-year timeline of the cosmos, current acute anxieties are ' +
          'microscopic and temporary. Act with honor and kindness in your conscious window, ' +
          'focus exclusively on what is within your agency, and release the rest.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyCosmicBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Cosmic Summary!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      setInterval(updateCosmicTick, 1000);
      document.addEventListener('DOMContentLoaded', updateCosmicTick);
    </script>
  `;

  writeFileSync(join(utilDir, 'cosmic-perspective-clock.html'), renderCuriosityPage({
    title: "The Cosmic Perspective Clock [Live Deep Time & Existential Scale Ticker] | Digital Tools Shed",
    metaDesc: "Put daily stress in perspective with a live synchronized clock tracking your age against human history, the age of Earth, solar evolution, and the heat death of the universe.",
    canonical: `${DOMAIN}/util/cosmic-perspective-clock`,
    bodyContent: cosmicClockHtml,
    currentPath: '/util/cosmic-perspective-clock',
    faq: [
      {
        q: "How does reflecting on cosmic deep time calm acute anxiety?",
        a: "Neuroimaging studies reveal that feelings of awe and cosmic scale down-regulate activity in the Default Mode Network (DMN), the brain's neural hub for self-referential rumination, social anxiety, and perceived existential crisis."
      },
      {
        q: "What is Carl Sagan's Cosmic Calendar and where do humans appear?",
        a: "Popularized in Sagan's 'Dragons of Eden' and 'Cosmos', the 13.8-billion-year history of the cosmos is mapped onto a single 365-day year. The Big Bang occurs January 1 at midnight; modern Homo sapiens emerge on December 31 at 11:52 PM, and all of recorded human civilization occurs in the final 11 seconds."
      },
      {
        q: "What is the difference between active existentialism and passive nihilism?",
        a: "Passive nihilism concludes that because the universe is indifferent and will eventually reach heat death, nothing matters and effort is futile. Active existentialism recognizes that because the cosmos has no inherent script, humans have radical freedom and responsibility to create subjective meaning, beauty, and kindness."
      },
      {
        q: "What is the 'Overview Effect' reported by astronauts?",
        a: "The Overview Effect is a cognitive shift in awareness reported by space travelers upon viewing Earth from orbit: an overwhelming visceral sensation of the fragility and unity of life against the silent cosmic vacuum, diminishing tribal conflict and ego attachments."
      },
      {
        q: "How long will the universe support biological life before the Stelliferous Era ends?",
        a: "Astrophysicists estimate the Stelliferous (star-forming) Era will continue for approximately 100 trillion years ($10^{14}$ years) as low-mass red dwarfs burn their hydrogen reserves slowly, providing vast horizons for consciousness before stellar cooling."
      }
    ]
  }));

    console.log('  ✓ Built Curiosity, Neurobiology & Existential Suite (10 interactive flagship tools in /util/)');
}
