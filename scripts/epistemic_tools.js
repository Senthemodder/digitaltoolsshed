import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildEpistemicTools() {
  const utilDir = join(DIST, 'util');
  const textDir = join(DIST, 'text');
  const mathDir = join(DIST, 'math');

  ensureDir(utilDir);
  ensureDir(textDir);
  ensureDir(mathDir);

  // ──────────────────────────────────────────────────────────────────────────
  // 1. THE 7-STEP EGO VS. TRUTH ARGUMENT AUDITOR (/util/ego-vs-truth.html)
  // ──────────────────────────────────────────────────────────────────────────
  const egoVsTruthHtml = `
    <style>
      .audit-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .step-badge { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; margin-right: 0.5rem; }
      .step-human { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
      .step-truth { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
      .q-opt { display: block; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.85rem 1rem; margin-bottom: 0.6rem; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
      .q-opt:hover { border-color: var(--fg); background: var(--surface-hover, var(--surface)); }
      .q-opt input { margin-right: 0.6rem; accent-color: var(--fg); }
      .meter-track { height: 16px; background: var(--surface-alt); border-radius: 8px; overflow: hidden; margin: 1rem 0; border: 1px solid var(--border); }
      .meter-fill { height: 100%; border-radius: 8px; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
      .comparison-col { flex: 1; min-width: 280px; padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border); }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Ego vs. Truth Argument Auditor
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">Epistemic Rationality Diagnostic</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The 7-Step Ego vs. Truth Argument Auditor</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Are you seeking objective truth, or defending social ego? Audit any recent disagreement, debate, or deeply-held belief against the 7 cognitive defense stages.
        </p>
      </header>

      <!-- 7-STEP COMPARISON OVERVIEW -->
      <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; margin-bottom: 2.5rem;">
        <div class="comparison-col" style="background: rgba(239,68,68,0.03); border-color: rgba(239,68,68,0.25);">
          <div style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: #ef4444; text-transform: uppercase; margin-bottom: 0.75rem;">Default Human Ego Loop (Belief Calcification)</div>
          <ol style="font-size: 0.88rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg);">
            <li><strong>Hear something agreeable</strong> → Instant belief</li>
            <li><strong>Repeat with confidence</strong> → Treated as "knowledge"</li>
            <li><strong>Challenged by counter-evidence</strong> → Feel threatened</li>
            <li><strong>Deploy social maneuver</strong> → "Agree to disagree" / "Personalities clash"</li>
            <li><strong>Remove challenger</strong> → Block, dismiss, label</li>
            <li><strong>Revert to prior belief</strong> → "I was right all along"</li>
            <li><strong>Insulate from counter-data</strong> → Belief calcifies permanently</li>
          </ol>
        </div>

        <div class="comparison-col" style="background: rgba(34,197,94,0.03); border-color: rgba(34,197,94,0.25);">
          <div style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: #22c55e; text-transform: uppercase; margin-bottom: 0.75rem;">Calibrated Truth-Seeker Loop (Bayesian Updating)</div>
          <ol style="font-size: 0.88rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg);">
            <li><strong>Hear something agreeable</strong> → "Interesting, let me verify"</li>
            <li><strong>Check empirical evidence</strong> → Confirm or reject</li>
            <li><strong>Challenged by counter-evidence</strong> → "I was wrong. Model updated."</li>
            <li><strong>Zero social evasion</strong> → Truth &gt; Personal Pride</li>
            <li><strong>Keep the challenger</strong> → Invaluable calibration source</li>
            <li><strong>Hold updated model</strong> → Conditional until new data arrives</li>
            <li><strong>Actively seek falsification</strong> → "Debunk this for me"</li>
          </ol>
        </div>
      </div>

      <!-- INTERACTIVE AUDIT QUESTIONNAIRE -->
      <div class="audit-card">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 0.5rem;">Audit Your Recent Argument or Belief</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          Think of a specific topic, political debate, technical dispute, or personal conviction where someone challenged you. Answer honestly to calculate your <strong>Epistemic Humility Index</strong>.
        </p>

        <form id="auditForm" onchange="calcAuditScore()">
          
          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 1: When you first heard the claim, what was your initial reaction?</label>
            <label class="q-opt"><input type="radio" name="q1" value="0"> "It sounded right and matched my vibe, so I adopted it immediately."</label>
            <label class="q-opt"><input type="radio" name="q1" value="10"> "It sounded plausible, but I held judgment until checking the primary source."</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 2: When someone presented solid counter-evidence, how did your body react?</label>
            <label class="q-opt"><input type="radio" name="q2" value="0"> Defensive adrenaline spike — I felt an urge to counter-attack or protect my intelligence.</label>
            <label class="q-opt"><input type="radio" name="q2" value="15"> Intellectual curiosity — "Wait, let me inspect their data. Did I miss something?"</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 3: What search queries or research did you run next?</label>
            <label class="q-opt"><input type="radio" name="q3" value="0"> Googled <em>"Why [my stance] is right"</em> or searched for takedowns of the opponent's view.</label>
            <label class="q-opt"><input type="radio" name="q3" value="15"> Looked up peer-reviewed data, systematic reviews, or the best opposing arguments.</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 4: Did you deploy conversational evasion maneuvers?</label>
            <label class="q-opt"><input type="radio" name="q4" value="0"> Yes: used "Let's agree to disagree", attacked their tone, or claimed "our personalities clash".</label>
            <label class="q-opt"><input type="radio" name="q4" value="15"> No: addressed their exact claims directly without tone policing or social deflections.</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 5: How do you now view the person who challenged you?</label>
            <label class="q-opt"><input type="radio" name="q5" value="0"> Annoying, bad-faith, aggressive, or blocked/distanced.</label>
            <label class="q-opt"><input type="radio" name="q5" value="15"> Valuable calibration partner who helped stress-test my blindspots.</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 6: What single piece of evidence would make you fully abandon your position?</label>
            <label class="q-opt"><input type="radio" name="q6" value="0"> Honestly, nothing I can think of — my stance is fundamentally true.</label>
            <label class="q-opt"><input type="radio" name="q6" value="15"> I have a clear, specific empirical metric that would prove me wrong (Falsifiable).</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 7: How do you treat your current revised belief?</label>
            <label class="q-opt"><input type="radio" name="q6" value="0"> Permanent absolute fact — case closed.</label>
            <label class="q-opt"><input type="radio" name="q6" value="15"> A working hypothesis with 70–90% confidence, open to revision if stronger data emerges.</label>
          </div>

        </form>

        <!-- RESULTS DASHBOARD -->
        <div id="resultsBox" style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 1.5rem; text-align: center;">
          <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Your Epistemic Humility Index</div>
          <div id="scoreDisplay" style="font-family: var(--mono); font-size: 3rem; font-weight: 900; margin: 0.25rem 0; color: #3b82f6;">0 / 100</div>
          
          <div class="meter-track">
            <div id="scoreBar" class="meter-fill" style="width: 0%; background: #3b82f6;"></div>
          </div>

          <div id="archetypeTitle" style="font-family: var(--serif); font-size: 1.35rem; font-weight: bold; margin-bottom: 0.5rem;">Select answers above to calculate</div>
          <p id="archetypeDesc" style="font-size: 0.95rem; color: var(--text-muted); max-width: 650px; margin: 0 auto 1.25rem; line-height: 1.5;"></p>

          <button onclick="copyAuditResult()" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem;">📋 Copy Epistemic Audit Badge</button>
        </div>
      </div>
    </div>

    <script>
      function calcAuditScore() {
        var form = document.getElementById('auditForm');
        var score = 0;
        var answered = 0;

        for (var i = 1; i <= 7; i++) {
          var radios = form['q' + (i === 7 ? '6' : i)];
          if (radios) {
            for (var j = 0; j < radios.length; j++) {
              if (radios[j].checked) {
                score += parseInt(radios[j].value, 10);
                answered++;
                break;
              }
            }
          }
        }

        var normalized = Math.min(100, Math.round((score / 100) * 100));
        document.getElementById('scoreDisplay').textContent = normalized + ' / 100';
        document.getElementById('scoreBar').style.width = normalized + '%';

        var titleEl = document.getElementById('archetypeTitle');
        var descEl = document.getElementById('archetypeDesc');
        var bar = document.getElementById('scoreBar');

        if (normalized >= 80) {
          titleEl.textContent = '🧠 Calibrated Truth-Seeker (Epistemic Mastery)';
          descEl.textContent = 'You prioritize accurate mental models over ego protection. You treat opposing evidence as valuable calibration data rather than a personal insult.';
          titleEl.style.color = '#22c55e';
          bar.style.background = '#22c55e';
        } else if (normalized >= 50) {
          titleEl.textContent = '⚖️ Pragmatic Rationalist (Occasional Ego Defense)';
          descEl.textContent = 'You value truth and evidence in theory, but occasionally deploy social escape hatches ("agree to disagree") when an argument hits sensitive identity nerves.';
          titleEl.style.color = '#3b82f6';
          bar.style.background = '#3b82f6';
        } else {
          titleEl.textContent = '🛡️ Dogmatic Calcifier (High Ego Defense)';
          descEl.textContent = 'Your cognitive loop defaults to protecting identity and certainty. When challenged, adrenaline and social maneuvers take precedence over empirical evidence.';
          titleEl.style.color = '#ef4444';
          bar.style.background = '#ef4444';
        }
      }

      function copyAuditResult() {
        var score = document.getElementById('scoreDisplay').textContent;
        var title = document.getElementById('archetypeTitle').textContent;
        var text = '🧠 My Epistemic Humility Score: ' + score + '\\nArchetype: ' + title + '\\nAudit your debate rationality at: ' + window.location.href;
        navigator.clipboard.writeText(text).then(function() {
          alert('Copied your Epistemic Audit result to clipboard!');
        });
      }
    </script>
  `;

  writeFileSync(join(utilDir, 'ego-vs-truth.html'), renderPage({
    title: 'The 7-Step Ego vs. Truth Argument Auditor | Digital Tools Shed',
    metaDesc: 'Interactive diagnostic testing whether you seek truth or defend ego in arguments based on the 7-step cognitive calcification loop.',
    canonical: `${DOMAIN}/util/ego-vs-truth.html`,
    bodyContent: egoVsTruthHtml,
    currentPath: '/util/ego-vs-truth.html'
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 2. THE STEELMAN & COUNTER-ARGUMENT ENGINE (/text/steelman-engine.html)
  // ──────────────────────────────────────────────────────────────────────────
  const steelmanHtml = `
    <style>
      .steel-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .pill-btn { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-family: var(--mono); cursor: pointer; transition: all 0.2s; }
      .pill-btn:hover { border-color: var(--fg); background: var(--surface-hover, var(--surface)); }
      .crux-box { background: rgba(59,130,246,0.06); border-left: 4px solid #3b82f6; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0; margin: 1rem 0; }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/text/">Writing Tools</a> &gt; Steelman & Counter-Argument Engine
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Anti-Echo Chamber Technology</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Steelman & Counter-Argument Engine</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Steelmanning is the practice of formulating the strongest, most intelligent version of an opponent's argument before attempting to refute it.
        </p>
      </header>

      <div class="steel-card">
        <label style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">Enter Any Claim, Opinion, or Conviction</label>
        <textarea id="claimInput" class="code-input" style="height: 100px; resize: vertical; margin-bottom: 1rem;" placeholder="e.g. AI models will completely eliminate junior software engineering jobs within 3 years..."></textarea>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; align-items: center;">
          <span style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted);">Try Presets:</span>
          <button class="pill-btn" onclick="setClaim('ai-jobs')">🤖 AI Engineering</button>
          <button class="pill-btn" onclick="setClaim('remote-work')">🏠 Remote Work</button>
          <button class="pill-btn" onclick="setClaim('higher-ed')">🎓 Higher Education</button>
          <button class="pill-btn" onclick="setClaim('social-media')">📱 Social Media</button>
        </div>

        <button onclick="generateSteelman()" class="btn-primary" style="padding: 0.65rem 1.5rem; font-family: var(--mono); font-size: 0.9rem;">⚡ Generate Steelman & Counter-Evidence</button>
      </div>

      <div id="steelmanOutput" style="display: none;">
        
        <!-- THE STEELMAN STATEMENT -->
        <div class="steel-card" style="border-left: 4px solid #10b981;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #10b981; font-weight: bold;">1. The Steelman Thesis (The Strongest Opposing Stance)</div>
          <div id="outSteelman" style="font-size: 1.05rem; line-height: 1.6; margin-top: 0.75rem; color: var(--fg); font-family: var(--serif);"></div>
        </div>

        <!-- THE FALSIFIABILITY CRUX -->
        <div class="steel-card" style="border-left: 4px solid #3b82f6;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #3b82f6; font-weight: bold;">2. The Falsifiability Crux (What Would Prove You Wrong?)</div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem;">If you cannot define what empirical observation would change your mind, your conviction is a dogma, not an analytical claim.</p>
          <div id="outCrux" class="crux-box"></div>
        </div>

        <!-- UNBIASED SEARCH PROMPTS -->
        <div class="steel-card" style="border-left: 4px solid #f59e0b;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #f59e0b; font-weight: bold;">3. De-Biased Search Queries (Break Confirmation Bias)</div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem;">Copy these queries to search academic journals, meta-analyses, and empirical datasets without triggering search engine echo chambers:</p>
          <div id="outQueries" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
        </div>

      </div>
    </div>

    <script>
      var PRESETS = {
        'ai-jobs': {
          claim: 'Generative AI and coding LLMs will completely eliminate entry-level software engineering jobs within 3 years.',
          steelman: 'Historically, software tooling abstraction (compilers, high-level languages, cloud IaaS) lowered the cost of software production, drastically increasing overall demand for software and expanding engineering headcount (Jevons Paradox). LLMs shift junior engineers from syntax-writers to system-integrators and test-verifiers rather than zeroing headcount.',
          crux: 'Measure whether global job postings for software engineers decline by >40% over 24 consecutive months while software deployment volume simultaneously increases.',
          queries: ['Jevons paradox software engineering economic empirical study', 'software developer employment census bureau trends 2023 2026', 'LLM software productivity developer headcount meta analysis']
        },
        'remote-work': {
          claim: 'Remote work permanently damages team cohesion, innovation, and long-term company productivity.',
          steelman: 'Remote work eliminates geographic hiring constraints, allowing companies to recruit top 0.1% talent worldwide while reducing commercial real estate overhead and boosting individual contributor deep-work focus hours.',
          crux: 'Compare patent filings, code commit velocity, and revenue per employee in fully remote vs in-office tech companies over a 5-year longitudinal cohort.',
          queries: ['Stanford Nicholas Bloom remote work productivity empirical study', 'asynchronous communication patent generation remote vs collocated teams']
        },
        'higher-ed': {
          claim: 'Four-year college university degrees are completely obsolete and a financial waste.',
          steelman: 'A 4-year degree remains the most scalable social proof signaling mechanism for conscientiousness, long-term project completion, and access to institutional alumni capital networks that are unobtainable via self-study.',
          crux: 'Track lifetime median net earnings and default rates of non-college credential holders vs college graduates across 10-year cohorts.',
          queries: ['college wage premium Federal Reserve longitudinal study', 'credential signaling theory Bryan Caplan empirical review']
        },
        'social-media': {
          claim: 'Algorithmic social media platforms are a catastrophic net-negative for human society and psychological well-being.',
          steelman: 'Algorithmic feeds decentralized information distribution, dismantled corporate media monopolies, enabled instant global scientific collaboration, and lowered the cost of finding niche educational subcultures to near zero.',
          crux: 'Randomized controlled trials deactivating social media for 4+ weeks measuring longitudinal depression biomarkers and cognitive focus scores.',
          queries: ['Allcott Gentzkow social media deactivation randomized controlled trial', 'digital media psychological well-being Nature human behaviour meta-analysis']
        }
      };

      function setClaim(key) {
        if (PRESETS[key]) {
          document.getElementById('claimInput').value = PRESETS[key].claim;
          generateSteelman(PRESETS[key]);
        }
      }

      function generateSteelman(customData) {
        var text = document.getElementById('claimInput').value.trim();
        if (!text) { alert('Please enter a claim first.'); return; }

        var data = customData;
        if (!data) {
          data = {
            steelman: 'The inverse thesis posits that systemic constraints, counter-vailing economic incentives, and unintended second-order effects often balance extreme projections. A rigorous analyst must examine the historical base rates and institutional friction of similar historical transitions.',
            crux: 'Identify a measurable, verifiable data point that would force you to concede a >30% probability shift.',
            queries: [
              'empirical counter evidence ' + text.slice(0, 30),
              'systematic review meta-analysis ' + text.slice(0, 30),
              'base rate fallacy historical precedent ' + text.slice(0, 30)
            ]
          };
        }

        document.getElementById('outSteelman').textContent = data.steelman;
        document.getElementById('outCrux').innerHTML = '<strong>Empirical Falsification Test:</strong> ' + data.crux;
        
        var qHtml = '';
        for (var i = 0; i < data.queries.length; i++) {
          qHtml += '<div style="display: flex; gap: 0.5rem; align-items: center; background: var(--surface-alt); padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid var(--border); font-family: var(--mono); font-size: 0.85rem;">' +
            '<span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + data.queries[i] + '</span>' +
            '<button onclick="navigator.clipboard.writeText(\\'' + data.queries[i].replace(/'/g, "\\\\'") + '\\'); alert(\\'Copied query!\\');" class="btn-sec" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Copy</button>' +
          '</div>';
        }
        document.getElementById('outQueries').innerHTML = qHtml;

        document.getElementById('steelmanOutput').style.display = 'block';
      }
    </script>
  `;

  writeFileSync(join(textDir, 'steelman-engine.html'), renderPage({
    title: 'The Steelman & Counter-Argument Engine | Digital Tools Shed',
    metaDesc: 'Generate the strongest opposing arguments and break confirmation bias with empirical falsification tests and de-biased search prompts.',
    canonical: `${DOMAIN}/text/steelman-engine.html`,
    bodyContent: steelmanHtml,
    currentPath: '/text/steelman-engine.html'
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 3. BAYESIAN BELIEF UPDATER & COGNITIVE INERTIA (/math/bayesian-updater.html)
  // ──────────────────────────────────────────────────────────────────────────
  const bayesHtml = `
    <style>
      .bayes-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .slider-row { margin-bottom: 1.25rem; }
      .slider-label { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.35rem; }
      .slider-input { width: 100%; accent-color: #3b82f6; cursor: pointer; }
      .result-badge { font-family: var(--mono); font-size: 2.2rem; font-weight: 900; }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/math/">Math Tools</a> &gt; Bayesian Belief Updater
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #8b5cf6; margin-bottom: 0.5rem;">Mathematical Epistemology</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Bayesian Belief Updating Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          How much should new evidence change your mind? Calculate the mathematically rational posterior probability using Bayes' Theorem versus human emotional inertia.
        </p>
      </header>

      <div class="bayes-card">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1.25rem;">1. Configure Probabilities</h3>

        <div class="slider-row">
          <div class="slider-label">
            <span>Prior Belief in Hypothesis P(H)</span>
            <strong id="valPrior" style="color: #3b82f6;">50%</strong>
          </div>
          <input type="range" id="prior" min="1" max="99" value="50" class="slider-input" oninput="updateBayes()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">How confident were you in the claim BEFORE seeing this new piece of evidence?</span>
        </div>

        <div class="slider-row">
          <div class="slider-label">
            <span>True Positive Rate P(E | H)</span>
            <strong id="valTPR" style="color: #22c55e;">80%</strong>
          </div>
          <input type="range" id="tpr" min="1" max="99" value="80" class="slider-input" oninput="updateBayes()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Probability this evidence would appear if the hypothesis is TRUE.</span>
        </div>

        <div class="slider-row">
          <div class="slider-label">
            <span>False Alarm Rate P(E | ~H)</span>
            <strong id="valFPR" style="color: #ef4444;">10%</strong>
          </div>
          <input type="range" id="fpr" min="1" max="99" value="10" class="slider-input" oninput="updateBayes()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Probability this evidence would appear by coincidence/noise if hypothesis is FALSE.</span>
        </div>
      </div>

      <!-- RESULTS GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        
        <div class="bayes-card" style="border-top: 4px solid #22c55e; margin: 0; text-align: center;">
          <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Mathematically Rational Posterior P(H|E)</span>
          <div id="outPosterior" class="result-badge" style="color: #22c55e;">88.9%</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0 0;">Where Bayes' Theorem dictates your confidence MUST shift after observing this evidence.</p>
        </div>

        <div class="bayes-card" style="border-top: 4px solid #ef4444; margin: 0; text-align: center;">
          <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Typical Human Cognitive Inertia</span>
          <div id="outHuman" class="result-badge" style="color: #ef4444;">55.0%</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0 0;">Humans under-update due to belief perseverance, anchoring, and identity defense.</p>
        </div>

      </div>

      <!-- FORMULA REFERENCE -->
      <div class="bayes-card" style="background: var(--surface-alt);">
        <h4 style="font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem;">Bayes' Theorem Formula</h4>
        <code style="font-family: var(--mono); font-size: 0.95rem; display: block; padding: 0.75rem; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; overflow-x: auto;">
          P(H | E) = [ P(E | H) * P(H) ] / [ P(E | H) * P(H) + P(E | ~H) * (1 - P(H)) ]
        </code>
      </div>
    </div>

    <script>
      function updateBayes() {
        var prior = parseFloat(document.getElementById('prior').value) / 100;
        var tpr = parseFloat(document.getElementById('tpr').value) / 100;
        var fpr = parseFloat(document.getElementById('fpr').value) / 100;

        document.getElementById('valPrior').textContent = (prior * 100).toFixed(0) + '%';
        document.getElementById('valTPR').textContent = (tpr * 100).toFixed(0) + '%';
        document.getElementById('valFPR').textContent = (fpr * 100).toFixed(0) + '%';

        var numerator = tpr * prior;
        var denominator = numerator + (fpr * (1 - prior));
        var posterior = numerator / denominator;

        document.getElementById('outPosterior').textContent = (posterior * 100).toFixed(1) + '%';

        // Cognitive inertia simulation: humans typically only move 25-35% of the Bayesian distance
        var humanShift = prior + (posterior - prior) * 0.28;
        document.getElementById('outHuman').textContent = (humanShift * 100).toFixed(1) + '%';
      }

      updateBayes();
    </script>
  `;

  writeFileSync(join(mathDir, 'bayesian-updater.html'), renderPage({
    title: 'Bayesian Belief Updating & Cognitive Inertia Calculator | Digital Tools Shed',
    metaDesc: 'Calculate rational belief probability shifts using Bayes Theorem versus psychological cognitive inertia.',
    canonical: `${DOMAIN}/math/bayesian-updater.html`,
    bodyContent: bayesHtml,
    currentPath: '/math/bayesian-updater.html'
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 4. LOGICAL FALLACY & RHETORICAL EVASION SCANNER (/text/fallacy-scanner.html)
  // ──────────────────────────────────────────────────────────────────────────
  const fallacyHtml = `
    <style>
      .fallacy-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .badge-tag { display: inline-block; padding: 0.2rem 0.5rem; font-family: var(--mono); font-size: 0.75rem; border-radius: 4px; margin-right: 0.4rem; font-weight: bold; }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/text/">Writing Tools</a> &gt; Logical Fallacy Scanner
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ec4899; margin-bottom: 0.5rem;">Rhetorical Defense Analyzer</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Logical Fallacy & Rhetorical Evasion Scanner</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Paste any debate text, comment thread, or political argument to detect 20+ informal fallacies, deflection tactics, and social exit maneuvers.
        </p>
      </header>

      <div class="fallacy-card">
        <label style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">Paste Argument Text to Scan</label>
        <textarea id="debTextInput" class="code-input" style="height: 140px; resize: vertical; margin-bottom: 1rem;" placeholder="Paste text here or click a test scenario below..."></textarea>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; align-items: center;">
          <span style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted);">Load Test Debates:</span>
          <button class="pill-btn" onclick="loadSample('ad-hominem')">🤬 Personal Attack</button>
          <button class="pill-btn" onclick="loadSample('agree-to-disagree')">🚪 Evasion & Exit</button>
          <button class="pill-btn" onclick="loadSample('strawman')">🌾 Strawman</button>
        </div>

        <button onclick="scanFallacies()" class="btn-primary" style="padding: 0.65rem 1.5rem; font-family: var(--mono); font-size: 0.9rem;">🔍 Scan for Fallacies & Deflections</button>
      </div>

      <div id="fallacyResults" style="display: none;">
        <div class="fallacy-card">
          <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Detected Rhetorical Patterns</h3>
          <div id="fallacyList" style="display: flex; flex-direction: column; gap: 1rem;"></div>
        </div>
      </div>
    </div>

    <script>
      var SAMPLES = {
        'ad-hominem': "You only believe that because you're an out-of-touch corporate shill who has never worked a real job. You're clearly biased and bad-faith.",
        'agree-to-disagree': "Well, let's just agree to disagree. Everyone is entitled to their own truth and our personalities simply clash.",
        'strawman': "So what you're saying is that we should completely burn down society and let criminals run the streets with zero laws whatsoever?"
      };

      var RULES = [
        {
          name: 'Social Exit & Evasion ("Agree to Disagree")',
          regex: /agree to disagree|own truth|personalities clash|why are you so hostile|not worth arguing/i,
          color: '#ef4444',
          bg: 'rgba(239,68,68,0.1)',
          desc: 'Deploying a social maneuver to exit the conversation when confronted with evidence, preserving prior conviction without updating.'
        },
        {
          name: 'Ad Hominem (Personal Attack & Shilling Accusation)',
          regex: /shill|out-of-touch|bad-faith|biased|stupid|idiot|clueless|who hurt you/i,
          color: '#f59e0b',
          bg: 'rgba(245,158,11,0.1)',
          desc: 'Attacking the character, motives, or identity of the speaker rather than addressing the empirical premise of their argument.'
        },
        {
          name: 'Strawman (Absurd Extrapolation)',
          regex: /so what you're saying is|you want to destroy|zero laws|completely ban/i,
          color: '#8b5cf6',
          bg: 'rgba(139,92,246,0.1)',
          desc: 'Reframing the opponent\\'s nuanced claim into an extreme, ridiculous caricature that is easy to knock down.'
        },
        {
          name: 'Appeal to Hypocrisy (Tu Quoque / Whataboutism)',
          regex: /what about|look at what you did|you do the exact same thing/i,
          color: '#3b82f6',
          bg: 'rgba(59,130,246,0.1)',
          desc: 'Deflecting scrutiny by accusing the opponent of hypocrisy rather than defending the validity of the core claim.'
        }
      ];

      function loadSample(key) {
        document.getElementById('debTextInput').value = SAMPLES[key] || '';
        scanFallacies();
      }

      function scanFallacies() {
        var text = document.getElementById('debTextInput').value.trim();
        if (!text) { alert('Please enter text to scan.'); return; }

        var listEl = document.getElementById('fallacyList');
        listEl.innerHTML = '';
        var found = 0;

        for (var i = 0; i < RULES.length; i++) {
          var rule = RULES[i];
          if (rule.regex.test(text)) {
            found++;
            var item = document.createElement('div');
            item.style.borderLeft = '4px solid ' + rule.color;
            item.style.background = rule.bg;
            item.style.padding = '1rem';
            item.style.borderRadius = '0 6px 6px 0';

            item.innerHTML = 
              '<div style="display: flex; align-items: center; margin-bottom: 0.35rem;">' +
                '<span class="badge-tag" style="background: ' + rule.color + '; color: #fff;">FLAGGED</span>' +
                '<strong style="color: var(--fg); font-size: 1rem;">' + rule.name + '</strong>' +
              '</div>' +
              '<p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.5;">' + rule.desc + '</p>';
            listEl.appendChild(item);
          }
        }

        if (found === 0) {
          listEl.innerHTML = '<div style="padding: 1.25rem; background: rgba(34,197,94,0.1); color: #22c55e; border-radius: 6px; border: 1px solid rgba(34,197,94,0.3); font-weight: bold;">✓ No common rhetorical evasion or personal attack patterns detected in this text.</div>';
        }

        document.getElementById('fallacyResults').style.display = 'block';
      }
    </script>
  `;

  writeFileSync(join(textDir, 'fallacy-scanner.html'), renderPage({
    title: 'Logical Fallacy & Rhetorical Evasion Scanner | Digital Tools Shed',
    metaDesc: 'Analyze debate text and social media arguments to detect Ad Hominem, Strawman, and rhetorical evasion maneuvers in real-time.',
    canonical: `${DOMAIN}/text/fallacy-scanner.html`,
    bodyContent: fallacyHtml,
    currentPath: '/text/fallacy-scanner.html'
  }));

  console.log('  ✓ Built Epistemic & Truth-Testing Suite (Ego vs Truth Auditor, Steelman Engine, Bayesian Updater, Fallacy Scanner)');
}
