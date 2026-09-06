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

  function renderEpistemicPage(opts) {
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
          Are you seeking objective empirical truth, or defending social ego? Audit any recent disagreement, debate, or deeply-held conviction against the 7 cognitive defense stages to measure your Epistemic Humility Index.
        </p>
      </header>

      <!-- 7-STEP COMPARISON OVERVIEW -->
      <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; margin-bottom: 2.5rem;">
        <div class="comparison-col" style="background: rgba(239,68,68,0.03); border-color: rgba(239,68,68,0.25);">
          <div style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: #ef4444; text-transform: uppercase; margin-bottom: 0.75rem;">Default Human Ego Loop (Belief Calcification)</div>
          <ol style="font-size: 0.88rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg);">
            <li><strong>Hear something agreeable</strong> → Instant belief adoption without scrutiny</li>
            <li><strong>Repeat with confidence</strong> → Social signaling treated as verified "knowledge"</li>
            <li><strong>Challenged by counter-evidence</strong> → Amygdala threat response and defensive posture</li>
            <li><strong>Deploy social maneuver</strong> → "Agree to disagree", tone policing, or "clashing personalities"</li>
            <li><strong>Remove challenger</strong> → Block, unfollow, dismiss as bad-faith or corporate shill</li>
            <li><strong>Revert to prior belief</strong> → Self-justification loop: "I was right all along"</li>
            <li><strong>Insulate from counter-data</strong> → Filter bubble tightens; belief calcifies permanently</li>
          </ol>
        </div>

        <div class="comparison-col" style="background: rgba(34,197,94,0.03); border-color: rgba(34,197,94,0.25);">
          <div style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: #22c55e; text-transform: uppercase; margin-bottom: 0.75rem;">Calibrated Truth-Seeker Loop (Bayesian Updating)</div>
          <ol style="font-size: 0.88rem; line-height: 1.6; padding-left: 1.2rem; color: var(--fg);">
            <li><strong>Hear something agreeable</strong> → "Plausible hypothesis; let me verify the source data"</li>
            <li><strong>Check empirical base rates</strong> → Confirm statistical distribution before repeating</li>
            <li><strong>Challenged by counter-evidence</strong> → Curiosity: "Fascinating data point, what did I miss?"</li>
            <li><strong>Zero social evasion</strong> → Truth &gt; Personal Pride; address premises directly</li>
            <li><strong>Keep the challenger close</strong> → Treat skilled critics as invaluable calibration partners</li>
            <li><strong>Hold updated model</strong> → Revise conditional probability based on likelihood ratio</li>
            <li><strong>Actively seek falsification</strong> → "What empirical test would decisively prove me wrong?"</li>
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
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 1: When you first encountered the claim, what was your initial reaction?</label>
            <label class="q-opt"><input type="radio" name="q1" value="0"> "It aligned with my intuition and cultural tribe, so I accepted and shared it immediately."</label>
            <label class="q-opt"><input type="radio" name="q1" value="15"> "It sounded plausible, but I suspended judgment until inspecting the primary empirical data."</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 2: When someone presented solid counter-evidence, how did your body react?</label>
            <label class="q-opt"><input type="radio" name="q2" value="0"> Defensive adrenaline spike — felt an impulse to attack their motive or protect my reputation.</label>
            <label class="q-opt"><input type="radio" name="q2" value="15"> Intellectual curiosity — "Wait, let me inspect their methodology. Did I overlook a blindspot?"</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 3: What search queries or research did you run next?</label>
            <label class="q-opt"><input type="radio" name="q3" value="0"> Googled <em>"Why [my view] is correct"</em> or searched for takedowns of the opposing stance.</label>
            <label class="q-opt"><input type="radio" name="q3" value="15"> Looked up peer-reviewed systematic reviews, meta-analyses, or the strongest opposing steelman.</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 4: Did you deploy conversational evasion maneuvers?</label>
            <label class="q-opt"><input type="radio" name="q4" value="0"> Yes: used "Let's agree to disagree", attacked their delivery tone, or claimed "personalities clash".</label>
            <label class="q-opt"><input type="radio" name="q4" value="15"> No: addressed their exact statistical and logical claims directly without social deflections.</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 5: How do you view the person who challenged you?</label>
            <label class="q-opt"><input type="radio" name="q5" value="0"> Annoying, bad-faith, aggressive, or blocked/distanced as an ideological enemy.</label>
            <label class="q-opt"><input type="radio" name="q5" value="15"> Invaluable calibration partner who performed free red-teaming on my mental model.</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 6: What empirical evidence would make you abandon your position?</label>
            <label class="q-opt"><input type="radio" name="q6" value="0"> Honestly, nothing I can imagine — my stance is a fundamental moral or self-evident truth.</label>
            <label class="q-opt"><input type="radio" name="q6" value="15"> I have a clear, pre-defined empirical metric or dataset that would prove me mistaken (Falsifiable).</label>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold; display: block; margin-bottom: 0.5rem;">Step 7: How do you treat your current revised belief?</label>
            <label class="q-opt"><input type="radio" name="q7" value="0"> Absolute permanent truth — case closed forever.</label>
            <label class="q-opt"><input type="radio" name="q7" value="10"> A working probability estimate (e.g. 75% confidence) subject to further Bayesian updates.</label>
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

          <button id="btnCopyAudit" onclick="copyAuditResult()" class="btn-primary" style="padding: 0.65rem 1.35rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
            📋 Copy Epistemic Audit Badge
          </button>
        </div>
      </div>

      <!-- DERIVATION BREAKDOWN -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">Diagnostic Scoring Derivation &amp; Weight Matrix</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          The Epistemic Humility Index allocates 100 total points across the 7 critical cognitive junctures of human debate:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">
            <div style="color: var(--text-muted); font-size: 0.72rem;">STEP 1 &bull; RECEPTION</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Initial Skepticism: 15 Pts</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">
            <div style="color: var(--text-muted); font-size: 0.72rem;">STEP 2 &bull; EMOTION</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Adrenaline Mastery: 15 Pts</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">
            <div style="color: var(--text-muted); font-size: 0.72rem;">STEP 3 &bull; INQUIRY</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Unbiased Retrieval: 15 Pts</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">
            <div style="color: var(--text-muted); font-size: 0.72rem;">STEP 4 &bull; ENGAGEMENT</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Non-Evasion: 15 Pts</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">
            <div style="color: var(--text-muted); font-size: 0.72rem;">STEP 5 &bull; SOCIAL COUPLING</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Challenger Value: 15 Pts</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">
            <div style="color: var(--text-muted); font-size: 0.72rem;">STEP 6 &bull; FALSIFIABILITY</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Popperian Test: 15 Pts</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px;">
            <div style="color: var(--text-muted); font-size: 0.72rem;">STEP 7 &bull; CALIBRATION</div>
            <div style="font-weight: bold; margin-top: 0.2rem;">Probabilistic Model: 10 Pts</div>
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & COGNITIVE PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Epistemic Traps &amp; Cognitive Calcification Pitfalls</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Human cognition did not evolve for abstract truth-seeking; it evolved for tribal coalition building and social dominance. Beware these 5 failure modes:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The "Agree to Disagree" Evasion Mirage</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Using polite social diplomacy as an intellectual escape hatch. When an interlocutor presents empirical counter-evidence, declaring "let's just agree to disagree" often masquerades as civility while functioning as cognitive insulation against revising a falsified belief.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. Identity-Belief Fusion (The Ideological Armor)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Conflating personal self-worth and social belonging with proposition veracity. When an idea is treated as part of who you are ("I am an X-ist"), factual refutation feels like an existential physical threat, triggering amygdala hijack rather than Bayesian updating.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Asymmetric Skepticism &amp; Motivated Scrutiny</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Demanding impossible peer-reviewed gold-standard randomized trials from arguments you dislike, while accepting flimsy tweets, anecdotes, or headlines at face value if they flatter your existing worldview.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. The "Debate Bro" Winning-Over-Truth Illusion</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Confusing rhetorical dominance, fast speech, and conversational swagger with epistemic correctness. Scoring points in front of an audience or demoralizing an opponent does not increase the truth value of the underlying claims.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. Echo Chamber Epistemic Bubble Insulation</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Systematically curating social feeds, blocking dissidents, and dismissing critics as "bad faith" or "shills." Over time, this filters out all reality-correcting signals, producing permanent cognitive calcification.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      function calcAuditScore() {
        var form = document.getElementById('auditForm');
        var score = 0;
        var answered = 0;

        for (var i = 1; i <= 7; i++) {
          var radios = form['q' + i];
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
          titleEl.textContent = '🌟 Calibrated Truth-Seeker (Epistemic Mastery)';
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
        var text = 
          'EPISTEMIC HUMILITY AUDIT BADGE\n' +
          '========================================\n' +
          '• Epistemic Humility Index: ' + score + '\n' +
          '• Diagnostic Archetype: ' + title + '\n' +
          '• Framework: 7-Step Ego vs. Truth Loop\n' +
          '========================================\n' +
          'Audit your debate rationality at: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyAudit');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Epistemic Audit Badge!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }
    </script>
  `;

  writeFileSync(join(utilDir, 'ego-vs-truth.html'), renderEpistemicPage({
    title: 'The 7-Step Ego vs. Truth Argument Auditor | Digital Tools Shed',
    metaDesc: 'Interactive epistemic diagnostic testing whether you seek objective truth or defend social ego in arguments based on the 7-step cognitive calcification loop.',
    canonical: `${DOMAIN}/util/ego-vs-truth`,
    bodyContent: egoVsTruthHtml,
    currentPath: '/util/ego-vs-truth',
    faq: [
      {
        q: "What is epistemic humility and why is it essential for clear thinking?",
        a: "Epistemic humility is the intellectual recognition that one's knowledge is inherently incomplete, conditioned by cognitive biases, and subject to error. It is essential because without it, individuals confuse confidence with accuracy, insulate themselves against disconfirming evidence, and fall into dogmatic belief calcification."
      },
      {
        q: "How does the 7-step ego defense loop calcify false beliefs?",
        a: "The loop begins when a pleasing claim is accepted without scrutiny and repeated socially. When challenged by valid counter-evidence, the brain interprets the challenge as a threat to status rather than an opportunity to learn. Conversational exit maneuvers ('agree to disagree') are deployed, critics are blocked or demonized, and the original belief is reaffirmed with hardened certainty."
      },
      {
        q: "Why does the human brain trigger an adrenaline surge during intellectual disagreements?",
        a: "Evolutionary psychology indicates that human survival historically depended upon tribal coalition membership. Expulsion from the tribe was fatal. Consequently, human neurobiology treats threats to core beliefs that bind us to our social group with the same acute amygdala activation as physical predators."
      },
      {
        q: "What is the key difference between an epistemic bubble and an echo chamber?",
        a: "In an epistemic bubble, opposing voices and evidence are accidentally omitted due to search algorithms or homogenous networks; introducing reliable data can burst the bubble. In an echo chamber, opposing voices are actively discredited, demonized, and pre-emptively labelled as malicious or corrupt, causing counter-evidence to paradoxically reinforce the dogma."
      },
      {
        q: "How can I cultivate genuine Bayesian truth-seeking during heated debates?",
        a: "Ask yourself: 'What specific empirical observation or data point would cause me to abandon this conviction?' If the answer is 'nothing', you are defending an article of faith rather than an empirical claim. Actively seek out the strongest criticisms of your stance and treat skilled dissenters as invaluable red-team partners."
      }
    ]
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
        <a href="/">Home</a> &gt; <a href="/text/">Writing Tools</a> &gt; Steelman &amp; Counter-Argument Engine
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Anti-Echo Chamber Technology</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">The Steelman &amp; Counter-Argument Engine</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Steelmanning is the intellectual discipline of formulating the strongest, most compelling version of an opponent's argument before attempting to evaluate it. Break confirmation bias with empirical falsification tests and de-biased research queries.
        </p>
      </header>

      <div class="steel-card">
        <label style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">Enter Any Claim, Opinion, or Stance</label>
        <textarea id="claimInput" class="code-input" style="width: 100%; height: 100px; resize: vertical; margin-bottom: 0.5rem; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" placeholder="e.g. Generative AI will eliminate junior software engineering headcount within 3 years..."></textarea>

        <div id="claimError" style="display: none; color: #ef4444; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.75rem;">
          ⚠️ Please enter a claim or select one of the curated presets below.
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; align-items: center;">
          <span style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted);">Try Presets:</span>
          <button class="pill-btn" onclick="setClaim('ai-jobs')">🤖 AI Engineering Headcount</button>
          <button class="pill-btn" onclick="setClaim('remote-work')">🏠 Remote Work Productivity</button>
          <button class="pill-btn" onclick="setClaim('higher-ed')">🎓 Higher Education ROI</button>
          <button class="pill-btn" onclick="setClaim('social-media')">📱 Algorithmic Social Media</button>
          <button class="pill-btn" onclick="setClaim('nuclear-energy')">⚛️ Nuclear Energy Grid</button>
        </div>

        <button onclick="generateSteelman()" class="btn-primary" style="padding: 0.65rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer;">
          ⚡ Generate Steelman &amp; Counter-Evidence
        </button>
      </div>

      <div id="steelmanOutput" style="display: none;">
        
        <!-- THE STEELMAN STATEMENT -->
        <div class="steel-card" style="border-left: 4px solid #10b981;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #10b981; font-weight: bold;">1. The Steelman Thesis (The Strongest Opposing Stance)</div>
          <div id="outSteelman" style="font-size: 1.05rem; line-height: 1.6; margin-top: 0.75rem; color: var(--fg); font-family: var(--serif);"></div>
        </div>

        <!-- THE FALSIFIABILITY CRUX -->
        <div class="steel-card" style="border-left: 4px solid #3b82f6;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #3b82f6; font-weight: bold;">2. The Falsifiability Crux (What Empirical Metric Proves It False?)</div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem;">If an analyst cannot define what empirical observation would change their mind, their conviction is a dogma, not an analytical claim.</p>
          <div id="outCrux" class="crux-box"></div>
        </div>

        <!-- UNBIASED SEARCH PROMPTS -->
        <div class="steel-card" style="border-left: 4px solid #f59e0b;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: #f59e0b; font-weight: bold;">3. De-Biased Search Queries (Break Confirmation Bias)</div>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0.35rem 0 0.75rem;">Copy these queries to search academic repositories and empirical datasets without triggering search engine personalization bubbles:</p>
          <div id="outQueries" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
        </div>

        <!-- COMPLETE DOSSIER COPY BUTTON -->
        <button id="btnCopyDossier" onclick="copyCompleteDossier()" class="btn-primary" style="width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 0.9rem; margin-bottom: 2rem; cursor: pointer; transition: all 0.2s;">
          📋 Copy Complete Steelman Dossier
        </button>

      </div>

      <!-- 5 FATAL TRAPS & COGNITIVE PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Traps &amp; Intellectual Blindspots in Debate</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Steelmanning requires genuine intellectual rigor. Avoid these 5 common distortions:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The Weak-Man &amp; Hollow Steelman Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Feigning generosity by defending a minor, slightly improved version of an opposing stance while still sidestepping the true apex counter-arguments formulated by domain experts.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. Ideological Turing Test Failure</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Believing you understand an opponent's worldview when you cannot explain their stance well enough that an adherent would mistake your summary for their own. If opponents say "that is not what we believe", your steelman has failed.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Motivated Search Query Formulation</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Crafting search queries that embed your predetermined conclusion (e.g. searching "why remote work damages company culture" instead of "longitudinal remote work productivity meta-analysis").
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. The Sunk-Cost Conviction Anchor</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Refusing to internalize a valid steelman because conceding error would invalidate years of public statements, career alignment, or social status.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. Asymmetric Falsifiability Standards</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Demanding rigid mathematical proof from the opposition while keeping your own thesis ambiguous, moving, and unfalsifiable.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      var PRESETS = {
        'ai-jobs': {
          claim: 'Generative AI and coding LLMs will completely eliminate entry-level software engineering jobs within 3 years.',
          steelman: 'Historically, software tooling abstraction (compilers, high-level languages, cloud IaaS) lowered the cost of software production, drastically increasing overall demand for software and expanding engineering headcount (Jevons Paradox). LLMs shift junior engineers from syntax-writers to system-integrators and test-verifiers rather than zeroing headcount.',
          crux: 'Measure whether global job postings for software engineers decline by >40% over 24 consecutive months while software deployment volume simultaneously increases.',
          queries: ['Jevons paradox software engineering economic empirical study', 'software developer employment census bureau trends longitudinal', 'LLM software productivity developer headcount meta analysis']
        },
        'remote-work': {
          claim: 'Remote work permanently damages team cohesion, innovation, and long-term company productivity.',
          steelman: 'Remote work eliminates geographic hiring constraints, allowing companies to recruit top 0.1% talent worldwide while reducing commercial real estate overhead and boosting individual contributor deep-work focus hours.',
          crux: 'Compare patent filings, code commit velocity, and revenue per employee in fully remote vs in-office tech companies over a 5-year longitudinal cohort.',
          queries: ['Stanford Nicholas Bloom remote work productivity empirical study', 'asynchronous communication patent generation remote vs collocated teams', 'hybrid work employee retention randomized trial']
        },
        'higher-ed': {
          claim: 'Four-year college university degrees are completely obsolete and a financial waste.',
          steelman: 'A 4-year degree remains the most scalable social proof signaling mechanism for conscientiousness, long-term project completion, and access to institutional alumni capital networks that are unobtainable via self-study.',
          crux: 'Track lifetime median net earnings and default rates of non-college credential holders vs college graduates across 10-year cohorts controlling for baseline IQ.',
          queries: ['college wage premium Federal Reserve longitudinal study', 'credential signaling theory Bryan Caplan empirical review', 'higher education return on investment longitudinal census']
        },
        'social-media': {
          claim: 'Algorithmic social media platforms are a catastrophic net-negative for human society and psychological well-being.',
          steelman: 'Algorithmic feeds decentralized information distribution, dismantled corporate media gatekeeping, enabled instant global scientific collaboration, and lowered the cost of finding niche educational subcultures to near zero.',
          crux: 'Randomized controlled trials deactivating social media for 4+ weeks measuring longitudinal depression biomarkers and cognitive focus scores across demographic cohorts.',
          queries: ['Allcott Gentzkow social media deactivation randomized controlled trial', 'digital media psychological well-being Nature human behaviour meta-analysis', 'algorithmic recommender systems serendipity vs polarization empirical']
        },
        'nuclear-energy': {
          claim: 'Nuclear energy is too expensive, slow to build, and inherently dangerous compared to 100% renewable wind and solar.',
          steelman: 'Nuclear provides high-energy-density, zero-carbon baseload power with the lowest land footprint per megawatt-hour and lowest lifecycle deaths per TWh of any energy source, eliminating the grid instability and immense battery mineral extraction required for 100% intermittent renewables.',
          crux: 'Compare levelized system cost of electricity (LCOE + storage/transmission) for 80%+ renewable grids vs nuclear-supplemented grids over 40-year lifecycle accounting.',
          queries: ['IPCC nuclear energy lifecycle greenhouse gas emissions analysis', 'Our World in Data death rates per unit of electricity produced by energy source', 'system levelized cost of electricity grid firming intermittent renewables']
        }
      };

      var currentDossier = null;

      function setClaim(key) {
        if (PRESETS[key]) {
          document.getElementById('claimInput').value = PRESETS[key].claim;
          document.getElementById('claimError').style.display = 'none';
          generateSteelman(PRESETS[key]);
        }
      }

      function generateSteelman(customData) {
        var text = document.getElementById('claimInput').value.trim();
        var errEl = document.getElementById('claimError');
        if (!text) {
          errEl.style.display = 'block';
          return;
        }
        errEl.style.display = 'none';

        var data = customData;
        if (!data) {
          data = {
            claim: text,
            steelman: 'The inverse thesis posits that systemic constraints, counter-vailing economic incentives, and unintended second-order effects frequently balance extreme projections. A rigorous analyst must examine historical base rates and institutional friction in comparable historical transitions.',
            crux: 'Identify a measurable, verifiable data metric that would force you to concede a >30% probability shift.',
            queries: [
              'empirical counter evidence ' + text.slice(0, 35),
              'systematic review meta-analysis ' + text.slice(0, 35),
              'base rate fallacy historical precedent ' + text.slice(0, 35)
            ]
          };
        }

        currentDossier = data;
        document.getElementById('outSteelman').textContent = data.steelman;
        document.getElementById('outCrux').innerHTML = '<strong>Empirical Falsification Test:</strong> ' + data.crux;
        
        var qHtml = '';
        for (var i = 0; i < data.queries.length; i++) {
          var qText = data.queries[i].replace(/"/g, '&quot;');
          qHtml += '<div style="display: flex; gap: 0.5rem; align-items: center; background: var(--surface-alt); padding: 0.5rem 0.75rem; border-radius: 4px; border: 1px solid var(--border); font-family: var(--mono); font-size: 0.85rem;">' +
            '<span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + qText + '</span>' +
            '<button id="btnQuery' + i + '" onclick="copyQueryText(' + i + ', \'' + data.queries[i].replace(/'/g, "\\'") + '\')" class="btn-sec" style="padding: 0.2rem 0.6rem; font-size: 0.75rem; cursor: pointer;">Copy</button>' +
          '</div>';
        }
        document.getElementById('outQueries').innerHTML = qHtml;
        document.getElementById('steelmanOutput').style.display = 'block';
      }

      function copyQueryText(idx, query) {
        navigator.clipboard.writeText(query).then(function() {
          var btn = document.getElementById('btnQuery' + idx);
          if (btn) {
            var orig = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.textContent = orig;
              btn.style.color = '';
            }, 1800);
          }
        });
      }

      function copyCompleteDossier() {
        if (!currentDossier) return;
        var d = currentDossier;
        var text = 
          'STEELMAN & COUNTER-ARGUMENT DOSSIER\n' +
          '========================================\n' +
          '• ORIGINAL CLAIM: ' + d.claim + '\n\n' +
          '• 1. THE STEELMAN THESIS:\n' + d.steelman + '\n\n' +
          '• 2. EMPIRICAL FALSIFIABILITY CRUX:\n' + d.crux + '\n\n' +
          '• 3. DE-BIASED SEARCH QUERIES:\n' +
          d.queries.map(function(q) { return '  - ' + q; }).join('\n') + '\n' +
          '========================================\n' +
          'Generated via Digital Tools Shed: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyDossier');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Complete Steelman Dossier!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }
    </script>
  `;

  writeFileSync(join(textDir, 'steelman-engine.html'), renderEpistemicPage({
    title: 'The Steelman & Counter-Argument Engine | Digital Tools Shed',
    metaDesc: 'Generate the strongest opposing arguments and break confirmation bias with empirical falsification tests and de-biased search prompts.',
    canonical: `${DOMAIN}/text/steelman-engine`,
    bodyContent: steelmanHtml,
    currentPath: '/text/steelman-engine',
    faq: [
      {
        q: "What is steelmanning and how does it differ from strawmanning?",
        a: "Steelmanning is the practice of constructing the strongest, most intelligent version of an opponent's stance before critiquing it. In contrast, strawmanning involves exaggerating, misrepresenting, or oversimplifying an argument into a weak caricature that is effortless to knock down."
      },
      {
        q: "What is the Ideological Turing Test in intellectual discourse?",
        a: "Proposed by economist Bryan Caplan, the Ideological Turing Test states that an analyst does not truly understand an opposing position unless they can articulate it so accurately and persuasively that an actual adherent would believe the analyst agrees with them."
      },
      {
        q: "What is a falsifiability crux and why does it matter in rational debate?",
        a: "A falsifiability crux is a specific empirical observation or statistical threshold that, if discovered, would prove a hypothesis wrong. Without a falsifiability crux, an assertion is merely a dogma or unfalsifiable belief rather than an empirical hypothesis."
      },
      {
        q: "How do de-biased search queries bypass algorithmic echo chambers?",
        a: "Modern search engines employ personalization algorithms that reward confirmation bias. Formulating queries that include neutral academic keywords ('meta-analysis', 'longitudinal cohort', 'empirical base rates') and explicitly search for counter-evidence forces the algorithm to retrieve peer-reviewed literature rather than tribal commentary."
      },
      {
        q: "How can steelmanning improve real-world business decisions and negotiations?",
        a: "Steelmanning uncovers hidden blindspots, operational risks, and competitor advantages that wishful thinking obscures. In negotiations, showing your counterpart that you understand their incentives better than they do establishes immediate credibility and reveals collaborative solution spaces."
      }
    ]
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
      .pill-btn { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-family: var(--mono); cursor: pointer; transition: all 0.2s; }
      .pill-btn:hover { border-color: var(--fg); background: var(--surface-hover, var(--surface)); }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/math/">Math Tools</a> &gt; Bayesian Belief Updater
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #8b5cf6; margin-bottom: 0.5rem;">Mathematical Epistemology</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Bayesian Belief Updating Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          How much should new evidence shift your mind? Calculate the mathematically rational posterior probability using Bayes' Theorem and contrast it directly with human psychological cognitive inertia.
        </p>
      </header>

      <div class="bayes-card">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 1rem;">1. Configure Prior &amp; Evidence Probabilities</h3>

        <!-- PRESETS -->
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.5rem; align-items: center;">
          <span style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted);">Quick Presets:</span>
          <button class="pill-btn" onclick="setBayesPreset(1, 95, 5)">🏥 Rare Disease Test</button>
          <button class="pill-btn" onclick="setBayesPreset(5, 85, 15)">🔍 Forensic Eyewitness</button>
          <button class="pill-btn" onclick="setBayesPreset(25, 90, 5)">🔬 Scientific Replication</button>
          <button class="pill-btn" onclick="setBayesPreset(10, 80, 20)">🚀 Tech Venture Bet</button>
          <button class="pill-btn" onclick="setBayesPreset(50, 80, 10)">⚖️ Unbiased Coin Toss</button>
        </div>

        <div class="slider-row">
          <div class="slider-label">
            <span>Prior Belief in Hypothesis P(H)</span>
            <strong id="valPrior" style="color: #3b82f6;">50%</strong>
          </div>
          <input type="range" id="prior" min="1" max="99" value="50" class="slider-input" oninput="updateBayes()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Base rate probability before observing this new piece of evidence.</span>
        </div>

        <div class="slider-row">
          <div class="slider-label">
            <span>True Positive Rate / Sensitivity P(E | H)</span>
            <strong id="valTPR" style="color: #22c55e;">80%</strong>
          </div>
          <input type="range" id="tpr" min="1" max="99" value="80" class="slider-input" oninput="updateBayes()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Probability this evidence would appear if the hypothesis is TRUE.</span>
        </div>

        <div class="slider-row">
          <div class="slider-label">
            <span>False Alarm Rate / False Positive P(E | ~H)</span>
            <strong id="valFPR" style="color: #ef4444;">10%</strong>
          </div>
          <input type="range" id="fpr" min="1" max="99" value="10" class="slider-input" oninput="updateBayes()" />
          <span style="font-size: 0.75rem; color: var(--text-muted);">Probability this evidence would appear by chance/coincidence if hypothesis is FALSE.</span>
        </div>
      </div>

      <!-- RESULTS HERO GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        
        <div class="bayes-card" style="border-top: 4px solid #22c55e; margin: 0; text-align: center;">
          <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Rational Posterior P(H|E)</span>
          <div id="outPosterior" class="result-badge" style="color: #22c55e;">88.9%</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0 0;">Where Bayes' Theorem dictates your belief MUST mathematically settle.</p>
        </div>

        <div class="bayes-card" style="border-top: 4px solid #ef4444; margin: 0; text-align: center;">
          <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Human Cognitive Inertia</span>
          <div id="outHuman" class="result-badge" style="color: #ef4444;">55.0%</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0 0;">Typical human update (under-updating due to belief perseverance &amp; anchoring).</p>
        </div>

        <div class="bayes-card" style="border-top: 4px solid #3b82f6; margin: 0; text-align: center;">
          <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Likelihood Ratio (Bayes Factor)</span>
          <div id="outLR" class="result-badge" style="color: #3b82f6;">8.0x</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0 0;">Diagnostic strength of the evidence (P(E|H) / P(E|~H)).</p>
        </div>

      </div>

      <!-- WORKED DERIVATION & LIVE MATH BREAKDOWN -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-left: 3px solid #3b82f6; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.5rem;">📐 Live Step-by-Step Mathematical Derivation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Evaluating Bayes' Theorem algebraically with your live parameters:
        </p>

        <div style="display: grid; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 1: Compute True-Positive Joint Probability</strong>
            <div id="derStep1" style="color: #3b82f6; margin-top: 0.25rem;">P(E | H) &times; P(H) = 0.80 &times; 0.50 = 0.400</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 2: Compute Total Probability of Evidence P(E)</strong>
            <div id="derStep2" style="color: var(--text-muted); margin-top: 0.25rem;">P(E) = [P(E|H) &times; P(H)] + [P(E|~H) &times; (1 - P(H))] = 0.400 + 0.050 = 0.450</div>
          </div>
          <div style="padding: 0.75rem; background: var(--surface-alt); border-radius: 4px; border: 1px solid var(--border);">
            <strong style="color: var(--fg);">Step 3: Normalize Posterior P(H | E)</strong>
            <div id="derStep3" style="color: #22c55e; margin-top: 0.25rem;">P(H | E) = 0.400 / 0.450 = 88.89%</div>
          </div>
        </div>

        <button id="btnCopyBayes" onclick="copyBayesSummary()" class="btn-primary" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
          📋 Copy Bayesian Diagnostic Summary
        </button>
      </div>

      <!-- 5 FATAL TRAPS & COGNITIVE PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Traps in Probabilistic &amp; Bayesian Reasoning</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Probability is the logic of science, yet intuition routinely fails these 5 structural hurdles:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The Base Rate Neglect Trap</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Ignoring the prior probability of an event. If a rare medical condition affects 1 in 1,000 people (0.1%), a screening test with 99% accuracy and a 5% false positive rate yields only an ~1.9% posterior probability that a positive patient actually has the disease.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. Cromwell's Rule Violation (The 0% &amp; 100% Certainty Trap)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Setting priors to absolute 0 or 1. Under Bayes' Theorem, if P(H) = 0 or P(H) = 1, no amount of empirical evidence, no matter how extraordinary, can ever change your belief. Rational epistemology requires keeping priors strictly between 0 and 1.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. The Likelihood Ratio / Prosecutor's Fallacy</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Confusing the probability of the evidence given innocence P(E|Innocent) with the probability of innocence given the evidence P(Innocent|E). A 1-in-a-million forensic match does not mean the suspect has only a 1-in-a-million chance of innocence if the suspect pool is millions of people.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. Cognitive Inertia &amp; Psychological Under-Updating</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Empirical psychology shows that humans only update their beliefs by 25% to 35% of the distance prescribed by Bayes' Theorem. People anchor heavily to their initial worldview and drag their feet when confronted with decisive evidence.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. Confirmation Asymmetry in Evidence Evaluation</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Assigning high diagnostic power P(E|H) when data supports your preferred outcome, while inflating false alarm estimates P(E|~H) or dismissing signals as "statistical noise" when data challenges your position.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      var currentBayesData = null;

      function setBayesPreset(prior, tpr, fpr) {
        document.getElementById('prior').value = prior;
        document.getElementById('tpr').value = tpr;
        document.getElementById('fpr').value = fpr;
        updateBayes();
      }

      function updateBayes() {
        var prior = parseFloat(document.getElementById('prior').value) / 100;
        var tpr = parseFloat(document.getElementById('tpr').value) / 100;
        var fpr = parseFloat(document.getElementById('fpr').value) / 100;

        document.getElementById('valPrior').textContent = (prior * 100).toFixed(0) + '%';
        document.getElementById('valTPR').textContent = (tpr * 100).toFixed(0) + '%';
        document.getElementById('valFPR').textContent = (fpr * 100).toFixed(0) + '%';

        var numerator = tpr * prior;
        var denominator = numerator + (fpr * (1 - prior));
        var posterior = denominator > 0 ? (numerator / denominator) : 0;

        document.getElementById('outPosterior').textContent = (posterior * 100).toFixed(1) + '%';

        // Likelihood ratio
        var lr = fpr > 0 ? (tpr / fpr) : 999;
        document.getElementById('outLR').textContent = lr >= 100 ? Math.round(lr) + 'x' : lr.toFixed(1) + 'x';

        // Cognitive inertia simulation: humans typically only move 28% of the Bayesian distance
        var humanShift = prior + (posterior - prior) * 0.28;
        document.getElementById('outHuman').textContent = (humanShift * 100).toFixed(1) + '%';

        // Update live mathematical derivation
        var pEFalse = fpr * (1 - prior);
        document.getElementById('derStep1').innerHTML = 
          'P(E | H) &times; P(H) = ' + tpr.toFixed(2) + ' &times; ' + prior.toFixed(2) + ' = <strong>' + numerator.toFixed(4) + '</strong>';
        document.getElementById('derStep2').innerHTML = 
          'P(E) = ' + numerator.toFixed(4) + ' + [' + fpr.toFixed(2) + ' &times; ' + (1 - prior).toFixed(2) + '] = ' + numerator.toFixed(4) + ' + ' + pEFalse.toFixed(4) + ' = <strong>' + denominator.toFixed(4) + '</strong>';
        document.getElementById('derStep3').innerHTML = 
          'P(H | E) = ' + numerator.toFixed(4) + ' / ' + denominator.toFixed(4) + ' = <strong>' + (posterior * 100).toFixed(2) + '%</strong>';

        currentBayesData = {
          prior: (prior * 100).toFixed(0) + '%',
          tpr: (tpr * 100).toFixed(0) + '%',
          fpr: (fpr * 100).toFixed(0) + '%',
          posterior: (posterior * 100).toFixed(1) + '%',
          human: (humanShift * 100).toFixed(1) + '%',
          lr: lr.toFixed(1) + 'x'
        };
      }

      function copyBayesSummary() {
        if (!currentBayesData) return;
        var d = currentBayesData;
        var text = 
          'BAYESIAN BELIEF UPDATING DIAGNOSTIC\n' +
          '========================================\n' +
          '• Prior Probability P(H): ' + d.prior + '\n' +
          '• True Positive Rate P(E|H): ' + d.tpr + '\n' +
          '• False Alarm Rate P(E|~H): ' + d.fpr + '\n' +
          '• Likelihood Ratio (Bayes Factor): ' + d.lr + '\n' +
          '----------------------------------------\n' +
          '• Mathematically Rational Posterior P(H|E): ' + d.posterior + '\n' +
          '• Typical Human Under-Updating Estimate: ' + d.human + '\n' +
          '========================================\n' +
          'Calculated via Digital Tools Shed: ' + window.location.href;

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('btnCopyBayes');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Bayesian Diagnostic!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }

      updateBayes();
    </script>
  `;

  writeFileSync(join(mathDir, 'bayesian-updater.html'), renderEpistemicPage({
    title: 'Bayesian Belief Updating & Cognitive Inertia Calculator | Digital Tools Shed',
    metaDesc: 'Calculate rational belief probability shifts using Bayes Theorem versus psychological cognitive inertia in real-time.',
    canonical: `${DOMAIN}/math/bayesian-updater`,
    bodyContent: bayesHtml,
    currentPath: '/math/bayesian-updater',
    faq: [
      {
        q: "What is Bayes' Theorem in intuitive, non-academic terms?",
        a: "Bayes' Theorem is a mathematical rule for updating your confidence in an idea when new evidence arrives. It states that your new belief (posterior) depends on three things: how likely the idea was initially (prior), how likely the evidence is if the idea is true (true positive rate), and how likely the evidence would appear anyway by coincidence (false alarm rate)."
      },
      {
        q: "Why do humans consistently fall victim to base rate neglect?",
        a: "Humans evaluate situations using representativeness heuristics rather than statistical distributions. If a description sounds like a librarian, people assume the person is a librarian, ignoring that farmers outnumber librarians 50 to 1. In medical screening, people focus on the 95% test accuracy while ignoring that the disease only occurs in 0.1% of the population."
      },
      {
        q: "What is Cromwell's Rule in probability theory?",
        a: "Named after Oliver Cromwell's admonition to 'think it possible you may be mistaken', Cromwell's Rule states that prior probabilities should never be set to 0 or 1 (absolute certainty). If a prior is 0 or 1, the Bayesian mathematical product forces the posterior to remain 0 or 1 forever, rendering you immune to all future evidence."
      },
      {
        q: "What is the Likelihood Ratio (Bayes Factor) and how is it interpreted?",
        a: "The Likelihood Ratio (LR) is the ratio of true positives to false alarms: P(E|H) / P(E|~H). An LR of 1.0 means the evidence provides zero information. An LR of 10 means the evidence is 10 times more likely under the hypothesis than under the alternative, representing strong support."
      },
      {
        q: "What causes psychological cognitive inertia during belief updating?",
        a: "Cognitive inertia stems from belief perseverance, identity protection, and confirmation bias. Psychological experiments demonstrate that humans update their beliefs by only 25% to 35% of what Bayes' Theorem mandates, treating counter-evidence with intense scrutiny while accepting confirming evidence uncritically."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 4. LOGICAL FALLACY & RHETORICAL EVASION SCANNER (/text/fallacy-scanner.html)
  // ──────────────────────────────────────────────────────────────────────────
  const fallacyHtml = `
    <style>
      .fallacy-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
      .badge-tag { display: inline-block; padding: 0.2rem 0.5rem; font-family: var(--mono); font-size: 0.75rem; border-radius: 4px; margin-right: 0.4rem; font-weight: bold; }
      .pill-btn { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-family: var(--mono); cursor: pointer; transition: all 0.2s; }
      .pill-btn:hover { border-color: var(--fg); background: var(--surface-hover, var(--surface)); }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/text/">Writing Tools</a> &gt; Logical Fallacy Scanner
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ec4899; margin-bottom: 0.5rem;">Rhetorical Defense Analyzer</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.6rem;">Logical Fallacy &amp; Rhetorical Evasion Scanner</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          Paste any debate transcript, social media comment thread, or persuasive essay to detect informal fallacies, personal attacks, deflections, and bad-faith conversational exits in real-time.
        </p>
      </header>

      <div class="fallacy-card">
        <label style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.5rem;">Paste Argument Text to Scan</label>
        <textarea id="debTextInput" class="code-input" style="width: 100%; height: 130px; resize: vertical; margin-bottom: 0.5rem; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" placeholder="Paste debate text, comments, or op-ed excerpts here..."></textarea>

        <div id="scanError" style="display: none; color: #ef4444; font-family: var(--mono); font-size: 0.85rem; margin-bottom: 0.75rem;">
          ⚠️ Please paste some text to scan or select one of the test debate scenarios below.
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem; align-items: center;">
          <span style="font-size: 0.75rem; font-family: var(--mono); color: var(--text-muted);">Load Test Debates:</span>
          <button class="pill-btn" onclick="loadSample('ad-hominem')">🎯 Ad Hominem Attack</button>
          <button class="pill-btn" onclick="loadSample('agree-to-disagree')">🚪 Evasion &amp; Exit</button>
          <button class="pill-btn" onclick="loadSample('strawman')">🌾 Strawman Caricature</button>
          <button class="pill-btn" onclick="loadSample('tu-quoque')">🔄 Whataboutism / Hypocrisy</button>
          <button class="pill-btn" onclick="loadSample('false-dilemma')">⚖️ False Dichotomy</button>
        </div>

        <button onclick="scanFallacies()" class="btn-primary" style="padding: 0.65rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer;">
          🔍 Scan for Fallacies &amp; Deflections
        </button>
      </div>

      <div id="fallacyResults" style="display: none;">
        <div class="fallacy-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <h3 style="font-family: var(--serif); font-size: 1.3rem; margin: 0;">Detected Rhetorical Patterns</h3>
            <span id="detectedCountBadge" style="font-family: var(--mono); font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 4px; background: var(--surface-alt); border: 1px solid var(--border);"></span>
          </div>
          
          <div id="fallacyList" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem;"></div>

          <button id="btnCopyFallacies" onclick="copyFallacyReport()" class="btn-primary" style="width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; transition: all 0.2s;">
            📋 Copy Fallacy Audit Report
          </button>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & COGNITIVE PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Traps &amp; Rhetorical Fallacy Pitfalls</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          Evaluating arguments requires distinguishing genuine logical errors from stylistic or emotional delivery:
        </p>

        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: var(--fg);">1. The "Fallacy Fallacy" (Argumentum ad Logicam)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Assuming that because an opponent's argument contains a formal or informal fallacy, their underlying conclusion must be factually false. A poorly argued or sloppy claim can still happen to be true in the physical world.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: var(--fg);">2. Tone Policing &amp; Affective Deflection</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Dismissing the factual validity of an argument solely because it was delivered with sharp emotion, frustration, or bluntness. While civility is productive, emotional cadence has zero bearing on empirical veracity.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: var(--fg);">3. Bulverism (Assuming Error and Diagnosing Motive)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Bypassing the task of proving an opponent wrong, and immediately psychoanalyzing why they are wrong (e.g. "You only believe that because you're a corporate shill"). An analyst must first prove an assertion false before explaining why someone made the mistake.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: var(--fg);">4. Moving the Goalposts (Special Pleading)</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Continuously changing the acceptance criteria whenever an interlocutor successfully satisfies your previous standard of evidence, ensuring your position remains permanently unfalsifiable.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: var(--fg);">5. False Dichotomy &amp; Binary Flattening</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Artificially collapsing nuanced, multifaceted problems into two mutually exclusive extremes ("Either you fully endorse our policy or you support chaos"), ignoring intermediate and alternative solutions.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      var SAMPLES = {
        'ad-hominem': "You only believe that because you're an out-of-touch corporate shill who has never worked a real job. You're clearly biased and bad-faith.",
        'agree-to-disagree': "Well, let's just agree to disagree. Everyone is entitled to their own truth and our personalities simply clash.",
        'strawman': "So what you're saying is that we should completely burn down society and let criminals run the streets with zero laws whatsoever?",
        'tu-quoque': "What about your own side's massive corruption scandal last year? Look at what you did before lecturing anyone else about ethics!",
        'false-dilemma': "Either you support this emergency spending bill 100%, or you want the entire economic system to collapse into complete depression."
      };

      var RULES = [
        {
          id: 'agree-to-disagree',
          name: 'Social Exit & Evasion ("Agree to Disagree")',
          regex: /agree to disagree|own truth|personalities clash|why are you so hostile|not worth arguing/i,
          color: '#ef4444',
          bg: 'rgba(239,68,68,0.08)',
          desc: 'Deploying a social maneuver to exit conversation when confronted with evidence, preserving prior convictions without updating.',
          counter: 'Gently return to the empirical crux: "I understand emotions are high, but does the evidence support premise X or not?"'
        },
        {
          id: 'ad-hominem',
          name: 'Ad Hominem (Personal Attack & Shilling Accusation)',
          regex: /shill|out-of-touch|bad-faith|biased|stupid|idiot|clueless|who hurt you|paid by|bought and paid/i,
          color: '#f59e0b',
          bg: 'rgba(245,158,11,0.08)',
          desc: 'Attacking the character, motives, or identity of the speaker rather than addressing the empirical premise of their argument.',
          counter: 'Ignore the characterization and re-anchor to the claim: "Even if I had biased motives, the data either replicates or it doesn\'t."'
        },
        {
          id: 'strawman',
          name: 'Strawman (Absurd Extrapolation & Caricature)',
          regex: /so what you're saying is|you want to destroy|zero laws|completely ban|burn down|abolish everything/i,
          color: '#8b5cf6',
          bg: 'rgba(139,92,246,0.08)',
          desc: 'Reframing the opponent\'s nuanced claim into an extreme, ridiculous caricature that is effortless to knock down.',
          counter: 'Clarify with precision: "No, that is an extreme extrapolation. My exact claim is X, specifically bounded by condition Y."'
        },
        {
          id: 'whataboutism',
          name: 'Appeal to Hypocrisy (Tu Quoque / Whataboutism)',
          regex: /what about|look at what you|you do the exact same|hypocrite|your side did/i,
          color: '#3b82f6',
          bg: 'rgba(59,130,246,0.08)',
          desc: 'Deflecting scrutiny by accusing the opponent of hypocrisy rather than evaluating the validity of the core premise.',
          counter: 'Concede past errors if relevant, then hold focus: "We can examine that case next, but does that excuse or disprove the issue at hand today?"'
        },
        {
          id: 'false-dilemma',
          name: 'False Dilemma / False Dichotomy (Either-Or)',
          regex: /either you|if you're not with|must choose between|only two choices|with us or against us/i,
          color: '#10b981',
          bg: 'rgba(16,185,129,0.08)',
          desc: 'Presenting two alternate states as the only possibilities, when in fact numerous viable intermediate or orthogonal solutions exist.',
          counter: 'Introduce the excluded middle: "That is a false binary. Option C balances both constraints without requiring extreme sacrifice."'
        },
        {
          id: 'bulverism',
          name: 'Bulverism (Assuming Error & Psychoanalyzing Motives)',
          regex: /you only say that because|you only care because|your privilege|vested interest|projecting/i,
          color: '#ec4899',
          bg: 'rgba(236,72,153,0.08)',
          desc: 'Assuming without demonstration that the opponent is mistaken, and immediately diagnosing their psychological or social motive for being mistaken.',
          counter: 'Demand proof of error first: "Before diagnosing why I made an error, you must first prove that the math or data is actually erroneous."'
        },
        {
          id: 'slippery-slope',
          name: 'Slippery Slope (Inevitable Catastrophe)',
          regex: /next thing you know|slippery slope|lead to total|open the floodgates|destroy civilization/i,
          color: '#f97316',
          bg: 'rgba(249,115,22,0.08)',
          desc: 'Asserting that a relatively small initial step will inevitably lead to an extreme chain of negative events without proving causal necessity.',
          counter: 'Demand causal links: "What specific regulatory or legal mechanism makes step B an unavoidable consequence of step A?"'
        },
        {
          id: 'appeal-authority',
          name: 'Appeal to Anonymous Authority',
          regex: /everyone knows|experts all agree|science has settled|it is common knowledge|studies show that/i,
          color: '#06b6d4',
          bg: 'rgba(6,182,212,0.08)',
          desc: 'Citing vague consensus, unspecified experts, or common knowledge without linking to primary empirical studies or meta-analyses.',
          counter: 'Request primary sources: "Which specific peer-reviewed papers or meta-analyses are you referencing?"'
        }
      ];

      var lastScanReport = null;

      function loadSample(key) {
        document.getElementById('debTextInput').value = SAMPLES[key] || '';
        document.getElementById('scanError').style.display = 'none';
        scanFallacies();
      }

      function scanFallacies() {
        var text = document.getElementById('debTextInput').value.trim();
        var errEl = document.getElementById('scanError');
        if (!text) {
          errEl.style.display = 'block';
          return;
        }
        errEl.style.display = 'none';

        var listEl = document.getElementById('fallacyList');
        listEl.innerHTML = '';
        var flagged = [];

        for (var i = 0; i < RULES.length; i++) {
          var rule = RULES[i];
          if (rule.regex.test(text)) {
            flagged.push(rule);
            var item = document.createElement('div');
            item.style.borderLeft = '4px solid ' + rule.color;
            item.style.background = rule.bg;
            item.style.padding = '1rem';
            item.style.borderRadius = '0 6px 6px 0';

            item.innerHTML = 
              '<div style="display: flex; align-items: center; margin-bottom: 0.35rem; gap: 0.5rem; flex-wrap: wrap;">' +
                '<span class="badge-tag" style="background: ' + rule.color + '; color: #fff;">FLAGGED</span>' +
                '<strong style="color: var(--fg); font-size: 1rem;">' + rule.name + '</strong>' +
              '</div>' +
              '<p style="font-size: 0.88rem; color: var(--text-muted); margin: 0 0 0.5rem; line-height: 1.5;">' + rule.desc + '</p>' +
              '<div style="font-size: 0.82rem; font-family: var(--mono); color: var(--fg); background: var(--surface); padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid var(--border);">' +
                '💡 <strong>Strategic Counter-Move:</strong> ' + rule.counter +
              '</div>';
            listEl.appendChild(item);
          }
        }

        var countBadge = document.getElementById('detectedCountBadge');
        if (flagged.length === 0) {
          countBadge.textContent = '0 Patterns Flagged';
          countBadge.style.color = '#22c55e';
          listEl.innerHTML = '<div style="padding: 1.25rem; background: rgba(34,197,94,0.1); color: #22c55e; border-radius: 6px; border: 1px solid rgba(34,197,94,0.3); font-weight: bold;">✓ No common rhetorical evasion, ad hominem, or informal fallacy patterns detected in this excerpt.</div>';
        } else {
          countBadge.textContent = flagged.length + ' Pattern' + (flagged.length > 1 ? 's' : '') + ' Flagged';
          countBadge.style.color = '#ef4444';
        }

        lastScanReport = {
          text: text,
          flagged: flagged
        };

        document.getElementById('fallacyResults').style.display = 'block';
      }

      function copyFallacyReport() {
        if (!lastScanReport) return;
        var r = lastScanReport;
        var lines = [
          'RHETORICAL FALLACY AUDIT REPORT',
          '========================================',
          '• EXCERPT SCANNED: "' + (r.text.length > 100 ? r.text.slice(0, 97) + '...' : r.text) + '"',
          '• PATTERNS FLAGGED: ' + r.flagged.length,
          '----------------------------------------'
        ];

        if (r.flagged.length === 0) {
          lines.push('✓ Clean: No common rhetorical evasion or personal attack patterns detected.');
        } else {
          for (var i = 0; i < r.flagged.length; i++) {
            var f = r.flagged[i];
            lines.push((i + 1) + '. ' + f.name);
            lines.push('   Description: ' + f.desc);
            lines.push('   Counter-Move: ' + f.counter);
            lines.push('');
          }
        }

        lines.push('========================================');
        lines.push('Audited via Digital Tools Shed: ' + window.location.href);

        navigator.clipboard.writeText(lines.join('\n')).then(function() {
          var btn = document.getElementById('btnCopyFallacies');
          var orig = btn.innerHTML;
          btn.innerHTML = '✓ Copied Fallacy Audit Report!';
          btn.style.background = '#10b981';
          btn.style.color = '#fff';
          setTimeout(function() {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }
    </script>
  `;

  writeFileSync(join(textDir, 'fallacy-scanner.html'), renderEpistemicPage({
    title: 'Logical Fallacy & Rhetorical Evasion Scanner | Digital Tools Shed',
    metaDesc: 'Analyze debate text and social media arguments to detect Ad Hominem, Strawman, Whataboutism, and rhetorical evasion maneuvers in real-time.',
    canonical: `${DOMAIN}/text/fallacy-scanner`,
    bodyContent: fallacyHtml,
    currentPath: '/text/fallacy-scanner',
    faq: [
      {
        q: "What is the fundamental difference between formal and informal logical fallacies?",
        a: "A formal fallacy is an invalid deductive structural flaw (e.g. affirming the consequent) that renders an argument logically broken regardless of content. An informal fallacy is a defect in the reasoning, relevance, evidence, or linguistic context of the premises (e.g. ad hominem, strawman, false dilemma)."
      },
      {
        q: "What is the 'Fallacy Fallacy' and why is it dangerous?",
        a: "The Fallacy Fallacy (Argumentum ad Logicam) occurs when someone presumes that because an argument contains a fallacy, its conclusion must be untrue. For example: 'You used an ad hominem, therefore the Earth is flat.' Bad logic does not disprove a true physical reality."
      },
      {
        q: "How should one respond to an ad hominem attack productively?",
        a: "Acknowledge the attack without becoming defensive, de-escalate the emotional tone, and immediately redirect attention back to the empirical proposition: 'Whether I am biased or not, the published data either supports this outcome or it does not. Let us look at the primary evidence.'"
      },
      {
        q: "What is Bulverism and why does it poison online discourse?",
        a: "Bulverism (coined by C.S. Lewis) is assuming that your opponent is wrong without demonstrating why, and immediately diagnosing the social, psychological, or tribal cause of their supposed mistake. It derails debate into personal psychoanalysis rather than substantive inquiry."
      },
      {
        q: "Can a fallacious argument still reach an accurate conclusion?",
        a: "Yes. An argument may rely on an appeal to authority or an ad hominem, but the conclusion itself may happen to be empirically true. Rigorous truth-seeking separates the validity of the rhetorical structure from the physical truth value of the underlying claim."
      }
    ]
  }));

  console.log('  ✓ Built Epistemic & Truth-Testing Suite (Ego vs Truth Auditor, Steelman Engine, Bayesian Updater, Fallacy Scanner)');
}
