// scripts/neuro_batch3.js — Batch 3 of Human Neurobiology Suite (Tools 28-39)
// Pure zero-dependency client-side clinical diagnostics & behavioral workbenches

export const batch3Tools = [
  // 28. PHQ-9 Clinical Depression & Anhedonia Severity Screener
  {
    slug: 'phq9-depression-screener',
    title: 'PHQ-9 Clinical Depression & Anhedonia Severity Screener [Official 9-Question Inventory]',
    metaDesc: 'Free client-side PHQ-9 Depression Screener. Calculate your depression severity score (Minimal, Mild, Moderate, Severe) using the gold-standard 9-item clinical instrument.',
    category: 'Neurobiology & Mind',
    keywords: 'phq9 depression test online, clinical depression screener, phq-9 scoring calculator, anhedonia test free, dsm-5 depression questionnaire',
    faqs: [
      { q: 'What is the PHQ-9?', a: 'The Patient Health Questionnaire-9 (PHQ-9) is the global gold standard 9-item self-report questionnaire used by psychiatrists, primary care physicians, and researchers to screen, diagnose, and measure the severity of clinical depression based on DSM criteria.' },
      { q: 'Is this assessment confidential and private?', a: 'Yes. 100% of the computation runs locally inside your browser session. Zero responses or calculated scores are ever transmitted to or stored on any server.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; PHQ-9 Depression Screener</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Clinical Standard</span>
            <span class="wb-badge badge-purple">PHQ-9 Inventory</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">PHQ-9 Clinical Depression & Anhedonia Screener</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Over the last 2 weeks, how often have you been bothered by any of the following problems? Answer honestly for objective clinical scoring.
          </p>
        </div>

        <div class="wb-card" id="phq9-card">
          <div id="phq9-questions"></div>
          <div style="margin-top: 1.5rem; text-align: center;">
            <button class="btn-primary" onclick="calcPHQ9()">Calculate PHQ-9 Clinical Severity Score</button>
          </div>
        </div>

        <div class="wb-card" id="phq9-result" style="display:none; background: var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Total PHQ-9 Score</span>
              <div id="phq9-score-num" style="font-size: 2.2rem; font-family: var(--mono); font-weight:700; color:#3b82f6;">0 / 27</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Clinical Tier</span>
              <span id="phq9-tier-badge" class="wb-badge badge-green" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Minimal</span>
            </div>
          </div>
          <div id="phq9-desc" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1.25rem;"></div>
          <div id="phq9-actions" style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var phqQuestions = [
          "Little interest or pleasure in doing things (anhedonia)",
          "Feeling down, depressed, or hopeless",
          "Trouble falling or staying asleep, or sleeping too much",
          "Feeling tired or having little energy (hypoarousal)",
          "Poor appetite or overeating",
          "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
          "Trouble concentrating on things, such as reading the newspaper or watching television",
          "Moving or speaking so slowly that other people could have noticed, or being so fidgety/restless that you have been moving around a lot more than usual",
          "Thoughts that you would be better off dead, or of hurting yourself in some way"
        ];
        var qContainer = document.getElementById('phq9-questions');
        if (qContainer) {
          var h = '';
          for (var i = 0; i < phqQuestions.length; i++) {
            h += '<div style="margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border);">' +
              '<div style="font-family:var(--serif); font-size:1.02rem; font-weight:600; margin-bottom:0.5rem;">' + (i+1) + '. ' + phqQuestions[i] + '</div>' +
              '<div class="grid-4">' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="phq_q' + i + '" value="0" checked> Not at all (0)</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="phq_q' + i + '" value="1"> Several days (1)</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="phq_q' + i + '" value="2"> More than half the days (2)</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="phq_q' + i + '" value="3"> Nearly every day (3)</label>' +
              '</div>' +
            '</div>';
          }
          qContainer.innerHTML = h;
        }

        function calcPHQ9() {
          var total = 0;
          for (var i = 0; i < phqQuestions.length; i++) {
            var radios = document.getElementsByName('phq_q' + i);
            for (var r = 0; r < radios.length; r++) {
              if (radios[r].checked) {
                total += parseInt(radios[r].value, 10);
                break;
              }
            }
          }
          document.getElementById('phq9-score-num').innerText = total + ' / 27';
          var tier = 'Minimal';
          var badgeClass = 'wb-badge badge-green';
          var desc = '';
          var actions = '';

          if (total <= 4) {
            tier = 'Minimal / None (0-4)';
            badgeClass = 'wb-badge badge-green';
            desc = 'Your score indicates minimal to no depressive symptoms. Mood fluctuations are within ordinary human baseline ranges.';
            actions = '<strong>Next Steps:</strong> Maintain circadian rhythm, regular aerobic movement, and supportive social connection.';
          } else if (total <= 9) {
            tier = 'Mild Depression (5-9)';
            badgeClass = 'wb-badge badge-blue';
            desc = 'Your score suggests mild depressive symptoms or low-grade dysthymia. Common symptoms include mild lethargy or decreased enthusiasm.';
            actions = '<strong>Next Steps:</strong> Re-audit sleep hygiene, morning sunlight exposure, and consider watchful waiting or low-intensity CBT reframing.';
          } else if (total <= 14) {
            tier = 'Moderate Depression (10-14)';
            badgeClass = 'wb-badge badge-amber';
            desc = 'Your score reflects moderate depressive severity. Daily functioning and cognitive focus are likely experiencing noticeable impairment.';
            actions = '<strong>Next Steps:</strong> Clinical consultation with a licensed psychotherapist or primary care physician is recommended for counseling or medical evaluation.';
          } else if (total <= 19) {
            tier = 'Moderately Severe Depression (15-19)';
            badgeClass = 'wb-badge badge-red';
            desc = 'Your score indicates moderately severe depressive pathology. Significant vegetative symptoms (sleep architecture disruption, anhedonia, self-blame) are active.';
            actions = '<strong>Next Steps:</strong> Active clinical intervention (evidence-based psychotherapy such as CBT/ACT combined with clinical medical review) is strongly indicated.';
          } else {
            tier = 'Severe Depression (20-27)';
            badgeClass = 'wb-badge badge-red';
            desc = 'Your score reflects severe depressive symptoms with profound disruption of prefrontal executive control, vitality, and emotional baseline.';
            actions = '<strong>Immediate Clinical Action:</strong> Urgent professional evaluation by a psychiatrist or mental health clinician is critical. If you experience crisis or self-harm thoughts, please reach out immediately to 988 (Suicide & Crisis Lifeline) or local emergency services.';
          }

          var bEl = document.getElementById('phq9-tier-badge');
          bEl.className = badgeClass;
          bEl.innerText = tier;
          document.getElementById('phq9-desc').innerText = desc;
          document.getElementById('phq9-actions').innerHTML = actions;
          document.getElementById('phq9-result').style.display = 'block';
          document.getElementById('phq9-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 29. GAD-7 Generalized Anxiety Disorder Severity Index
  {
    slug: 'gad7-anxiety-screener',
    title: 'GAD-7 Generalized Anxiety Disorder Severity Index [DSM-5 Clinical Score]',
    metaDesc: 'Free online GAD-7 Anxiety Screener. Calculate your clinical anxiety severity score (Minimal, Mild, Moderate, Severe) based on the official 7-question DSM-5 scale.',
    category: 'Neurobiology & Mind',
    keywords: 'gad7 anxiety screener online, clinical anxiety test, gad-7 scoring calculator, dsm-5 anxiety assessment, generalized anxiety disorder meter',
    faqs: [
      { q: 'What is the GAD-7?', a: 'The Generalized Anxiety Disorder 7-item (GAD-7) scale is a validated diagnostic self-report tool developed by Drs. Spitzer, Kroenke, and Williams to calculate the severity of generalized anxiety disorder in clinical practice.' },
      { q: 'What do GAD-7 score cutoffs signify?', a: 'Scores of 5, 10, and 15 represent validated cut-off points for mild, moderate, and severe anxiety. A score of 10 or greater indicates that further clinical evaluation is recommended.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; GAD-7 Anxiety Screener</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Clinical Standard</span>
            <span class="wb-badge badge-purple">GAD-7 Inventory</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">GAD-7 Generalized Anxiety Disorder Screener</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Over the last 2 weeks, how often have you been bothered by the following problems?
          </p>
        </div>

        <div class="wb-card" id="gad7-card">
          <div id="gad7-questions"></div>
          <div style="margin-top: 1.5rem; text-align: center;">
            <button class="btn-primary" onclick="calcGAD7()">Calculate GAD-7 Anxiety Severity Score</button>
          </div>
        </div>

        <div class="wb-card" id="gad7-result" style="display:none; background: var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Total GAD-7 Score</span>
              <div id="gad7-score-num" style="font-size: 2.2rem; font-family: var(--mono); font-weight:700; color:#3b82f6;">0 / 21</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Clinical Classification</span>
              <span id="gad7-tier-badge" class="wb-badge badge-green" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Minimal</span>
            </div>
          </div>
          <div id="gad7-desc" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1.25rem;"></div>
          <div id="gad7-somatic" style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var gadQuestions = [
          "Feeling nervous, anxious, or on edge",
          "Not being able to stop or control worrying",
          "Worrying too much about different things",
          "Trouble relaxing",
          "Being so restless that it is hard to sit still",
          "Becoming easily annoyed or irritable",
          "Feeling afraid, as if something awful might happen"
        ];
        var gContainer = document.getElementById('gad7-questions');
        if (gContainer) {
          var gh = '';
          for (var i = 0; i < gadQuestions.length; i++) {
            gh += '<div style="margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border);">' +
              '<div style="font-family:var(--serif); font-size:1.02rem; font-weight:600; margin-bottom:0.5rem;">' + (i+1) + '. ' + gadQuestions[i] + '</div>' +
              '<div class="grid-4">' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="gad_q' + i + '" value="0" checked> Not at all (0)</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="gad_q' + i + '" value="1"> Several days (1)</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="gad_q' + i + '" value="2"> More than half the days (2)</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="gad_q' + i + '" value="3"> Nearly every day (3)</label>' +
              '</div>' +
            '</div>';
          }
          gContainer.innerHTML = gh;
        }

        function calcGAD7() {
          var total = 0;
          for (var i = 0; i < gadQuestions.length; i++) {
            var radios = document.getElementsByName('gad_q' + i);
            for (var r = 0; r < radios.length; r++) {
              if (radios[r].checked) {
                total += parseInt(radios[r].value, 10);
                break;
              }
            }
          }
          document.getElementById('gad7-score-num').innerText = total + ' / 21';
          var tier = 'Minimal';
          var badgeClass = 'wb-badge badge-green';
          var desc = '';
          var somatic = '';

          if (total <= 4) {
            tier = 'Minimal Anxiety (0-4)';
            badgeClass = 'wb-badge badge-green';
            desc = 'Your anxiety level is within normal homeostatic limits. Occasional worry is proportional to environmental stressors.';
            somatic = '<strong>Somatic Protocol:</strong> Maintain regular physical exercise and standard sleep hygiene.';
          } else if (total <= 9) {
            tier = 'Mild Anxiety (5-9)';
            badgeClass = 'wb-badge badge-blue';
            desc = 'Mild autonomic arousal. You may notice episodic rumination, muscle tension in neck/shoulders, or low-grade background restlessness.';
            somatic = '<strong>Somatic Protocol:</strong> Implement cyclic physiological sighs (two quick inhales through nose, slow extended exhale through mouth) and limit caffeine past noon.';
          } else if (total <= 14) {
            tier = 'Moderate Anxiety (10-14)';
            badgeClass = 'wb-badge badge-amber';
            desc = 'Moderate clinical anxiety. Hyperarousal of the sympathetic nervous system is actively interfering with concentration and cognitive bandwidth.';
            somatic = '<strong>Somatic & Clinical Protocol:</strong> Professional psychotherapy (CBT, somatic experiencing) is recommended. Practice 10-minute daily NSDR or box breathing to downregulate the amygdala.';
          } else {
            tier = 'Severe Anxiety (15-21)';
            badgeClass = 'wb-badge badge-red';
            desc = 'Severe clinical anxiety. Chronic sympathetic dominance, frequent fight-or-flight triggers, and significant functional disruption.';
            somatic = '<strong>Clinical Recommendation:</strong> Formal clinical psychiatric and psychological evaluation is strongly indicated. Reach out to a healthcare professional for structured treatment.';
          }

          var bEl = document.getElementById('gad7-tier-badge');
          bEl.className = badgeClass;
          bEl.innerText = tier;
          document.getElementById('gad7-desc').innerText = desc;
          document.getElementById('gad7-somatic').innerHTML = somatic;
          document.getElementById('gad7-result').style.display = 'block';
          document.getElementById('gad7-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 30. Gaslighting & Psychological Abuse Reality Checker
  {
    slug: 'gaslighting-reality-checker',
    title: 'Gaslighting & Psychological Abuse Reality Checker [DARVO & Sanity Validation Log]',
    metaDesc: 'Audit psychological manipulation and gaslighting tactics. Check for DARVO loops, reality denial, and create an immutable local browser sanity anchor log.',
    category: 'Neurobiology & Mind',
    keywords: 'gaslighting test online, am i being gaslighted quiz, darvo manipulation audit, narcissist reality checker, psychological abuse validation log',
    faqs: [
      { q: 'What is gaslighting?', a: 'Gaslighting is a form of psychological manipulation where a perpetrator sows seeds of doubt in a targeted individual or group, making them question their own memory, perception, and sanity through persistent denial, misdirection, and contradiction.' },
      { q: 'What does DARVO stand for?', a: 'Coined by Dr. Jennifer Freyd, DARVO stands for Deny, Attack, and Reverse Victim and Offender. It is a common manipulation tactic where the true offender plays the victim when confronted with their harmful behavior.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Gaslighting Reality Checker</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Manipulation Audit</span>
            <span class="wb-badge badge-blue">Sanity Anchor</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Gaslighting & Reality Distortion Checker</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Deconstruct psychological manipulation tactics, audit DARVO loops, and maintain a private, client-side sanity validation log to protect your memory and perception.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">10-Point Gaslighting & Manipulation Inventory</h3>
          <div id="gaslight-checklist"></div>
          <div style="margin-top:1.25rem;">
            <button class="btn-primary" onclick="auditGaslighting()">Calculate Manipulation Index</button>
          </div>
        </div>

        <div class="wb-card" id="gaslight-verdict" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span class="field-label" style="margin:0;">Tactics Observed</span>
            <span id="gaslight-count" style="font-size:1.4rem; font-family:var(--mono); font-weight:700; color:#ef4444;">0 / 10</span>
          </div>
          <div id="gaslight-summary" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1rem;"></div>
          <div id="gaslight-darvo-box" style="padding:1rem; background:var(--bg); border-left:4px solid #ef4444; font-size:0.9rem; line-height:1.5;"></div>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:0.5rem;">Private Sanity Anchor Log (Local Browser Memory Only)</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">Document objective facts immediately after confusing interactions to anchor your memory against revisionism. Data is stored solely in your local browser localStorage.</p>
          <div style="margin-bottom:0.75rem;">
            <input type="text" id="log-topic" class="text-input" placeholder="Interaction topic / Incident label (e.g. Conversation regarding rent)" style="margin-bottom:0.5rem;" />
            <textarea id="log-facts" class="text-input" rows="3" placeholder="Objective facts: What was said verbatim, timestamps, concrete physical actions (avoid subjective interpretations)..."></textarea>
          </div>
          <button class="btn-primary" onclick="saveSanityLog()">Add Fact to Sanity Anchor</button>

          <div id="sanity-log-list" style="margin-top:1.5rem;"></div>
        </div>
      </div>
      <script>
        var gaslightItems = [
          "Direct Denial of Objective Events: They flatly claim 'that never happened' or 'you are imagining things' despite your clear memory.",
          "DARVO Reaction: When you raise a valid concern, they immediately deny it, attack your character, and end up claiming they are the true victim.",
          "Weaponized Faulty Memory: Frequently telling you 'you have a terrible memory' or 'you always remember things wrong' to erode your self-trust.",
          "Trivializing Feelings: Saying 'you are too sensitive', 'you are overreacting', or 'it was just a joke' to invalidate your emotional boundaries.",
          "Shifting the Goalposts: You meet an agreed standard or requirement, only to be told it wasn't good enough or that the agreement was different.",
          "Third-Party Triangulation: Claiming 'everyone else agrees with me' or 'even your friends think you are acting crazy' without evidence.",
          "Counterfeiting Empathy: Pretending to be concerned about your mental health ('I am worried you are losing your mind') to disguise sabotage.",
          "Denying Spoken Words: Insisting 'I never said that' when you remember the exact sentence and context clearly.",
          "Wearing You Down Through Attrition: Arguing in circles for hours until you concede just to end the exhaustion.",
          "Self-Doubt Epidemic: You find yourself constantly apologizing, second-guessing your own emails, or needing outside validation for basic facts."
        ];
        var cBox = document.getElementById('gaslight-checklist');
        if (cBox) {
          var ch = '';
          for (var i = 0; i < gaslightItems.length; i++) {
            ch += '<label style="display:flex; align-items:flex-start; gap:0.5rem; margin-bottom:0.75rem; font-size:0.9rem; cursor:pointer; line-height:1.4;">' +
              '<input type="checkbox" class="gl-check" style="margin-top:0.2rem;" />' +
              '<span><strong>' + (i+1) + '.</strong> ' + gaslightItems[i] + '</span>' +
            '</label>';
          }
          cBox.innerHTML = ch;
        }

        function auditGaslighting() {
          var checks = document.querySelectorAll('.gl-check');
          var count = 0;
          checks.forEach(function(c) { if (c.checked) count++; });
          document.getElementById('gaslight-count').innerText = count + ' / 10';

          var sum = '';
          var darvo = '';
          if (count === 0) {
            sum = 'No major gaslighting indicators identified in this interaction.';
            darvo = 'Healthy relationships allow open, non-defensive discussion of memories and feelings without cognitive invalidation.';
          } else if (count <= 3) {
            sum = 'Low to moderate invalidation. May reflect defensive arguing or poor communication, but requires vigilance.';
            darvo = '<strong>Boundary Strategy:</strong> State your perspective once clearly: &quot;I know what I experienced, and I will not debate my reality.&quot; Disengage from circular arguments.';
          } else if (count <= 6) {
            sum = 'Substantial psychological manipulation present. Clear patterns of reality erosion, memory undermining, and shifting accountability.';
            darvo = '<strong>DARVO Alert:</strong> The other party is actively deflecting accountability onto you. Stop trying to convince them they are wrong. Document objective facts in your Sanity Anchor below.';
          } else {
            sum = 'Severe, systemic psychological gaslighting. This dynamic is toxic and designed to systematically dismantle your cognitive autonomy and self-trust.';
            darvo = '<strong>Urgent Protocol:</strong> You are experiencing acute psychological erosion. Do not argue or attempt to JADE (Justify, Argue, Defend, Explain). Seek independent support from a licensed trauma-informed therapist or trusted third party.';
          }

          document.getElementById('gaslight-summary').innerText = sum;
          document.getElementById('gaslight-darvo-box').innerHTML = darvo;
          document.getElementById('gaslight-verdict').style.display = 'block';
        }

        function renderSanityLogs() {
          var logs = JSON.parse(localStorage.getItem('dts_sanity_logs') || '[]');
          var container = document.getElementById('sanity-log-list');
          if (!container) return;
          if (logs.length === 0) {
            container.innerHTML = '<div style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">No sanity anchor entries saved yet.</div>';
            return;
          }
          var lh = '';
          for (var i = 0; i < logs.length; i++) {
            lh += '<div style="padding:0.75rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; margin-bottom:0.5rem;">' +
              '<div style="display:flex; justify-content:space-between; font-family:var(--mono); font-size:0.75rem; color:var(--text-muted); margin-bottom:0.25rem;">' +
                '<strong>' + logs[i].topic.replace(/</g, '&lt;') + '</strong>' +
                '<span>' + logs[i].time + '</span>' +
              '</div>' +
              '<div style="font-size:0.88rem; color:var(--fg); line-height:1.4;">' + logs[i].facts.replace(/</g, '&lt;') + '</div>' +
            '</div>';
          }
          container.innerHTML = lh;
        }

        function saveSanityLog() {
          var top = document.getElementById('log-topic').value.trim();
          var facts = document.getElementById('log-facts').value.trim();
          if (!top || !facts) { alert('Please enter both an incident label and objective facts.'); return; }
          var logs = JSON.parse(localStorage.getItem('dts_sanity_logs') || '[]');
          logs.unshift({ topic: top, facts: facts, time: new Date().toLocaleString() });
          localStorage.setItem('dts_sanity_logs', JSON.stringify(logs.slice(0, 50)));
          document.getElementById('log-topic').value = '';
          document.getElementById('log-facts').value = '';
          renderSanityLogs();
        }
        renderSanityLogs();
      </script>
    `
  },

  // 31. Internal Family Systems (IFS) Parts Identifier & Unblending Navigator
  {
    slug: 'ifs-parts-unblender',
    title: 'Internal Family Systems (IFS) Parts Identifier & Unblending Navigator [Schwartz Model]',
    metaDesc: 'Map your internal psychological system using Richard Schwartz IFS therapy. Identify Managers, Firefighters, and Exiles, and practice the 6 Fs of unblending to access core Self-energy.',
    category: 'Neurobiology & Mind',
    keywords: 'ifs therapy online tool, internal family systems parts map, ifs unblending exercise, manager firefighter exile diagnostic, self energy ifs calculator',
    faqs: [
      { q: 'What is Internal Family Systems (IFS)?', a: 'Developed by Dr. Richard Schwartz, IFS is an evidence-based psychotherapeutic model asserting that the human psyche is naturally composed of multiple sub-personalities or "parts" (Managers, Firefighters, and Exiles), coordinated by a calm, compassionate core "Self".' },
      { q: 'What does "unblending" mean in IFS?', a: 'Unblending is the process of creating conscious psychological space between your core Self and an overwhelmed emotional part. When blended, you ARE the anger or anxiety; when unblended, you are the conscious witness observing the part with curiosity and compassion.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; IFS Parts Unblender</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">IFS Therapy</span>
            <span class="wb-badge badge-green">Self-Energy (8 Cs)</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Internal Family Systems (IFS) Parts Unblender</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Identify whether you are blended with a Manager, Firefighter, or Exile part, and execute the clinical 6 Fs unblending sequence to restore calm, clear Self-leadership.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Step 1: Diagnose the Blended Part</h3>
          <div class="grid-3">
            <div class="wb-card" style="margin:0; cursor:pointer;" onclick="selectIfsArchetype('manager')" id="card-manager">
              <span class="wb-badge badge-blue">Proactive Protector</span>
              <h4 style="font-family:var(--serif); font-size:1.05rem; margin:0.5rem 0 0.25rem;">The Manager Part</h4>
              <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Controls, plans, perfectionates, worries, critics, and strives to prevent vulnerable pain from surfacing.</p>
            </div>
            <div class="wb-card" style="margin:0; cursor:pointer;" onclick="selectIfsArchetype('firefighter')" id="card-firefighter">
              <span class="wb-badge badge-amber">Reactive Protector</span>
              <h4 style="font-family:var(--serif); font-size:1.05rem; margin:0.5rem 0 0.25rem;">The Firefighter Part</h4>
              <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Extinguishes acute emotional flares through bingeing, scrolling, substance use, dissociation, rage, or impulsivity.</p>
            </div>
            <div class="wb-card" style="margin:0; cursor:pointer;" onclick="selectIfsArchetype('exile')" id="card-exile">
              <span class="wb-badge badge-red">Vulnerable Core</span>
              <h4 style="font-family:var(--serif); font-size:1.05rem; margin:0.5rem 0 0.25rem;">The Exile Part</h4>
              <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Carries childhood burdens of shame, terror, abandonment, unworthiness, and deep loneliness.</p>
            </div>
          </div>
        </div>

        <div class="wb-card" id="ifs-unblend-workspace" style="display:none; background:var(--surface-alt);">
          <h3 style="font-size:1.2rem; font-family:var(--serif); margin-bottom:0.5rem;" id="ifs-part-title">The 6 Fs Unblending Protocol</h3>
          <div id="ifs-steps" style="display:flex; flex-direction:column; gap:1rem;"></div>
        </div>
      </div>
      <script>
        var ifsProtocols = {
          manager: {
            title: "Unblending from a Manager Part (Perfectionism / Control / Inner Critic)",
            steps: [
              { f: "1. Find", prompt: "Notice where this tension lives in your body (jaw clenching, tight chest, hyper-vigilant posture)." },
              { f: "2. Focus", prompt: "Turn your attention inward toward this controlling energy instead of obeying its anxious commands." },
              { f: "3. Flesh Out", prompt: "How old does this part feel? What does it look like? Is it a tired soldier, a stern teacher, or a frantic planner?" },
              { f: "4. Feel Toward", prompt: "How do you feel toward this part right now? (If you feel annoyed or resentful, another part is blended. Ask it to step back so you can feel curiosity)." },
              { f: "5. Befriend", prompt: "Ask the Manager: 'What are you protecting me from? What are you afraid would happen if you stopped working for 10 minutes?'" },
              { f: "6. Fear", prompt: "Acknowledge its hard work: 'Thank you for protecting me all these years. I am the adult now, and I can handle this.'" }
            ]
          },
          firefighter: {
            title: "Unblending from a Firefighter Part (Urge to Numb / Scroll / Rage / Binge)",
            steps: [
              { f: "1. Find", prompt: "Sense the intense kinetic urgency, physical craving, or buzzing restlessness in your body." },
              { f: "2. Focus", prompt: "Breathe deeply into the urge without acting on it for 60 seconds. Observe the wildfire from a safe distance." },
              { f: "3. Flesh Out", prompt: "Notice how extreme this part is. It believes that unless it numbs you immediately, you will be destroyed by emotional pain." },
              { f: "4. Feel Toward", prompt: "Can you appreciate that this part only acts out because it is terrified of you suffering?" },
              { f: "5. Befriend", prompt: "Ask the Firefighter: 'What emotional pain were you trying to put out just now? Who got hurt?'" },
              { f: "6. Fear", prompt: "Assure the Firefighter: 'You don't have to burn down the house to put out the match. I am here with the wounded part.'" }
            ]
          },
          exile: {
            title: "Witnessing an Exile Part (Tears / Abandonment / Loneliness / Worthlessness)",
            steps: [
              { f: "1. Find", prompt: "Locate the deep ache, hollow sensation in stomach, or trembling vulnerability." },
              { f: "2. Focus", prompt: "Do not rush to fix or cheer up this feeling. Sit with it gently as you would with a crying child." },
              { f: "3. Flesh Out", prompt: "Notice the age of this part (often 5 to 12 years old). What did it experience when it first felt this abandonment?" },
              { f: "4. Feel Toward", prompt: "Check for Compassion. Can your adult Self hold this young part with unconditional warmth?" },
              { f: "5. Befriend", prompt: "Let the Exile show you what it has been carrying in isolation. Validate its sadness: 'You had every right to feel that way.'" },
              { f: "6. Fear", prompt: "Tell the Exile: 'You are no longer stuck back there. I am with you now, and I will never leave you.'" }
            ]
          }
        };

        function selectIfsArchetype(type) {
          ['manager', 'firefighter', 'exile'].forEach(function(k) {
            var c = document.getElementById('card-' + k);
            if (c) c.style.borderColor = (k === type) ? '#3b82f6' : 'var(--border)';
          });

          var proto = ifsProtocols[type];
          document.getElementById('ifs-part-title').innerText = proto.title;
          var container = document.getElementById('ifs-steps');
          var sh = '';
          for (var i = 0; i < proto.steps.length; i++) {
            sh += '<div style="padding:0.85rem; background:var(--bg); border-left:3px solid #3b82f6; border-radius:3px;">' +
              '<div style="font-family:var(--mono); font-size:0.82rem; font-weight:700; color:#3b82f6; margin-bottom:0.25rem;">' + proto.steps[i].f + '</div>' +
              '<div style="font-size:0.92rem; color:var(--fg); line-height:1.5;">' + proto.steps[i].prompt + '</div>' +
            '</div>';
          }
          container.innerHTML = sh;
          document.getElementById('ifs-unblend-workspace').style.display = 'block';
          document.getElementById('ifs-unblend-workspace').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 32. Highly Sensitive Person (HSP) & Sensory Processing Scale
  {
    slug: 'hsp-sensory-sensitivity',
    title: 'Highly Sensitive Person (HSP) & Sensory Processing Scale [Elaine Aron SPS Test]',
    metaDesc: "Measure your Sensory Processing Sensitivity (SPS) across Elaine Aron's DOES framework (Depth of processing, Overstimulation, Emotional reactivity, Sensing the subtle).",
    category: 'Neurobiology & Mind',
    keywords: 'hsp test online free, highly sensitive person scale, sensory processing sensitivity quiz, elaine aron hsp test, sensory overload diagnostic',
    faqs: [
      { q: 'What is a Highly Sensitive Person (HSP)?', a: 'Identified by research psychologist Dr. Elaine Aron, Sensory Processing Sensitivity (SPS) is an innate genetic neurobiological trait found in 15-20% of the population, characterized by deeper cognitive processing of sensory input and heightened central nervous system reactivity.' },
      { q: 'What is the DOES framework?', a: 'Dr. Aron summarizes the 4 core pillars of high sensitivity as DOES: Depth of cognitive processing, Overstimulation susceptibility, Emotional empathy/reactivity, and Sensing subtle environmental stimuli.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; HSP Sensitivity Scale</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Sensory Neurobiology</span>
            <span class="wb-badge badge-purple">Dr. Elaine Aron SPS</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Highly Sensitive Person (HSP) Scale</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Evaluate your sensory processing sensitivity across acoustic, photic, emotional, and cognitive stimuli using the DOES framework.
          </p>
        </div>

        <div class="wb-card">
          <div id="hsp-questions"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcHSP()">Calculate Sensitivity Profile</button>
          </div>
        </div>

        <div class="wb-card" id="hsp-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Sensitivity Index</span>
              <div id="hsp-score-val" style="font-size:2rem; font-family:var(--mono); font-weight:700; color:#3b82f6;">0 / 12</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Neurobiological Profile</span>
              <span id="hsp-tier-badge" class="wb-badge badge-blue" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Medium Sensitivity</span>
            </div>
          </div>
          <div id="hsp-desc" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1rem;"></div>
          <div id="hsp-pillars" style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var hspItems = [
          "I am easily overwhelmed by strong sensory input (bright fluorescent lights, sirens, chaotic open offices, coarse fabrics).",
          "I seem to be aware of subtleties in my environment that others miss (subtle tone shifts, faint scents, slight furniture changes).",
          "Other people's moods affect me deeply; I involuntarily absorb emotional energy from a room.",
          "I have a deep, complex inner life with vivid imagination and extensive internal contemplation (Depth of Processing).",
          "I become uncomfortably flustered or drained when I have a lot to do in a short amount of time.",
          "When people are uncomfortable in a physical environment, I tend to know what needs to be done to make it more comfortable.",
          "I make a priority of arranging my life to avoid upsetting or overwhelming situations.",
          "I am deeply moved by the arts, evocative music, literature, or natural beauty.",
          "My nervous system sometimes feels so frazzled that I simply must get away into a darkened, quiet room for solitude.",
          "When I must compete or be observed while performing a task, I become nervous and perform far worse than when alone.",
          "Changes in my life (relocations, new jobs, schedule disruptions) shake me up significantly.",
          "I am noticeably sensitive to caffeine, medications, or hunger (I get acutely 'hangry' due to blood sugar shifts)."
        ];
        var hContainer = document.getElementById('hsp-questions');
        if (hContainer) {
          var hh = '';
          for (var i = 0; i < hspItems.length; i++) {
            hh += '<label style="display:flex; align-items:flex-start; gap:0.5rem; margin-bottom:0.75rem; font-size:0.9rem; cursor:pointer; line-height:1.4;">' +
              '<input type="checkbox" class="hsp-check" style="margin-top:0.2rem;" />' +
              '<span><strong>' + (i+1) + '.</strong> ' + hspItems[i] + '</span>' +
            '</label>';
          }
          hContainer.innerHTML = hh;
        }

        function calcHSP() {
          var checks = document.querySelectorAll('.hsp-check');
          var count = 0;
          checks.forEach(function(c) { if (c.checked) count++; });
          document.getElementById('hsp-score-val').innerText = count + ' / 12';

          var tier = 'Moderate Sensitivity';
          var badgeClass = 'wb-badge badge-blue';
          var desc = '';
          var rec = '';

          if (count <= 4) {
            tier = 'Low Sensitivity (Dandelion)';
            badgeClass = 'wb-badge badge-green';
            desc = 'You possess a high sensory threshold. You easily tolerate loud, chaotic, and high-pressure environments without autonomic depletion.';
            rec = '<strong>Environmental Optimization:</strong> You thrive in dynamic, fast-paced work settings and recover quickly from sensory overload.';
          } else if (count <= 8) {
            tier = 'Moderate Sensitivity (Tulip)';
            badgeClass = 'wb-badge badge-blue';
            desc = 'You have balanced sensory processing. While you notice environmental nuances, you retain adequate buffering against moderate noise and stress.';
            rec = '<strong>Environmental Optimization:</strong> Balance high-stimulus days with quiet evening wind-downs to prevent accumulated sensory fatigue.';
          } else {
            tier = 'Highly Sensitive Person (Orchid / HSP)';
            badgeClass = 'wb-badge badge-purple';
            desc = 'You meet the clinical threshold for high Sensory Processing Sensitivity (SPS). Your thalamocortical filtering is permeable, processing incoming stimuli at high fidelity.';
            rec = '<strong>Orchid Protocol:</strong> Treat sensitivity as a specialized biological antenna, not a disorder. Prioritize noise-canceling headphones, scheduled decompression periods, and protect your nervous system battery fiercely.';
          }

          var bEl = document.getElementById('hsp-tier-badge');
          bEl.className = badgeClass;
          bEl.innerText = tier;
          document.getElementById('hsp-desc').innerText = desc;
          document.getElementById('hsp-pillars').innerHTML = rec;
          document.getElementById('hsp-result').style.display = 'block';
          document.getElementById('hsp-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 33. Complex PTSD (C-PTSD) Emotional Flashback Grounding Navigator
  {
    slug: 'cptsd-flashback-grounder',
    title: 'Complex PTSD (C-PTSD) Emotional Flashback Grounding Navigator [Pete Walker 13 Steps]',
    metaDesc: "Interactive somatic triage for C-PTSD emotional flashbacks based on Pete Walker's 13-step recovery protocol. Ground your nervous system out of fight, flight, freeze, or fawn states.",
    category: 'Neurobiology & Mind',
    keywords: 'cptsd emotional flashback steps, pete walker 13 steps interactive, complex ptsd grounding tool, trauma trigger triage online, somatic nervous system reset',
    faqs: [
      { q: 'What is an emotional flashback in C-PTSD?', a: 'Unlike PTSD visual flashbacks, an emotional flashback in Complex PTSD is a sudden, prolonged regression into overwhelming feelings of fear, shame, alienation, or helplessness experienced in childhood, typically triggered by subtle cues of rejection or threat.' },
      { q: 'Who is Pete Walker?', a: 'Pete Walker, M.A., M.F.T., is an internationally recognized trauma therapist and author of "Complex PTSD: From Surviving to Thriving", whose 13-step flashback management protocol is standard practice in somatic trauma recovery.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; C-PTSD Flashback Grounder</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Somatic Trauma Triage</span>
            <span class="wb-badge badge-purple">Pete Walker Protocol</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">C-PTSD Emotional Flashback Grounding Navigator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Step-by-step interactive triage to disarm amygdala hijack and guide your somatic nervous system safely back into present-time reality.
          </p>
        </div>

        <div class="wb-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <span class="field-label" style="margin:0;">Flashback Step <span id="fb-step-num">1</span> of 13</span>
            <span id="fb-phase-badge" class="wb-badge badge-blue">Safety Anchor</span>
          </div>

          <div style="padding:1.25rem; background:var(--surface-alt); border:1px solid var(--border); border-radius:6px; min-height:120px; margin-bottom:1.5rem;">
            <h3 id="fb-step-title" style="font-size:1.2rem; font-family:var(--serif); margin-bottom:0.5rem; color:var(--fg);">1. Say to yourself: "I am having a flashback"</h3>
            <p id="fb-step-body" style="font-size:0.95rem; line-height:1.6; color:var(--text-muted); margin:0;">
              Flashbacks take us to a timeless part of the psyche that feels like the helpless child is being re-abused or abandoned right now. Name it consciously: this is a memory, not current reality.
            </p>
          </div>

          <div style="display:flex; justify-content:space-between; gap:1rem;">
            <button class="btn-sec" onclick="prevFbStep()">← Previous Step</button>
            <button class="btn-primary" onclick="nextFbStep()">Next Grounding Step →</button>
          </div>
        </div>
      </div>
      <script>
        var fbSteps = [
          { t: "1. Say to yourself: 'I am having a flashback'", b: "Flashbacks take us to a timeless part of the psyche that feels like the helpless child is being re-abused or abandoned right now. Name it consciously: this is a memory, not current reality.", p: "Safety Anchor" },
          { t: "2. Remind yourself: 'I feel afraid, but I am not in danger'", b: "You are safe in the present. You are an adult with resources, boundaries, and legal rights. The original childhood threat is long over.", p: "Safety Anchor" },
          { t: "3. Own your right to have boundaries", b: "Remind yourself that you do not have to tolerate anyone mistreating you. You are free to leave, say no, shut your door, or block contact.", p: "Boundaries" },
          { t: "4. Speak reassuringly to your Inner Child", b: "The child part needs to know that you love it unconditionally and will protect it. 'You are safe with me. I won't let anyone hurt you again.'", p: "Inner Child" },
          { t: "5. Deconstruct eternity thinking", b: "In childhood, abuse and neglect felt like they would never end. A flashback makes you feel like you will be miserable forever. Remind yourself: Flashbacks always pass.", p: "Cognitive Anchor" },
          { t: "6. Remind yourself that you are in an adult body", b: "Look at your hands. Stand up and feel your adult height and weight. You have capabilities, money, friends, and mobility that you lacked as a child.", p: "Somatic Anchor" },
          { t: "7. Ease back into your body", b: "Gently ask your body where it is holding fear. Drop your shoulders away from your ears. Unclench your jaw. Exhale slowly.", p: "Somatic Anchor" },
          { t: "8. Resist the Inner Critic's catastrophic loops", b: "Refuse to shame yourself for having a flashback. When your brain shouts 'You are worthless and broken,' respond: 'Thought-stopping. I refuse to attack myself.'", p: "Inner Critic" },
          { t: "9. Allow yourself to grieve", b: "Flashbacks are opportunities to release unexpressed childhood tears of sorrow, fear, and righteous anger at how you were treated.", p: "Emotional Catharsis" },
          { t: "10. Cultivate safe relationships and support", b: "Reach out to a safe friend, therapist, or support group. Sharing the shame of a flashback dissolves its isolation.", p: "Relational Safety" },
          { t: "11. Learn to identify the triggers that lead to flashbacks", b: "Trace what activated this state: a dismissive tone of voice, a facial expression, exhaustion, or a conflict? Knowing triggers prevents future blindspots.", p: "Pattern Audit" },
          { t: "12. Figure out what you are flashing back to", b: "Recognize that your current reaction is proportional to original developmental trauma, not to the minor present event that triggered it.", p: "Context Realignment" },
          { t: "13. Be patient with a slow recovery process", b: "It takes time to rewire neurobiological survival responses. Celebrate every time you navigate a flashback with self-compassion.", p: "Integration" }
        ];

        var curFbIdx = 0;
        function updateFbUI() {
          document.getElementById('fb-step-num').innerText = (curFbIdx + 1);
          document.getElementById('fb-phase-badge').innerText = fbSteps[curFbIdx].p;
          document.getElementById('fb-step-title').innerText = fbSteps[curFbIdx].t;
          document.getElementById('fb-step-body').innerText = fbSteps[curFbIdx].b;
        }
        function nextFbStep() {
          if (curFbIdx < fbSteps.length - 1) { curFbIdx++; updateFbUI(); }
        }
        function prevFbStep() {
          if (curFbIdx > 0) { curFbIdx--; updateFbUI(); }
        }
      </script>
    `
  },

  // 34. Adult Autism Spectrum Quotient (AQ-10) Screener
  {
    slug: 'aq10-autism-screener',
    title: 'Adult Autism Spectrum Quotient (AQ-10) Screener [Baron-Cohen Clinical Scale]',
    metaDesc: "Free adult Autism Spectrum Quotient (AQ-10) screener. Evaluate autistic traits across social communication and attention-to-detail with Simon Baron-Cohen's clinical instrument.",
    category: 'Neurobiology & Mind',
    keywords: 'aq-10 autism test online, adult autism screener free, baron cohen autism quotient, aq10 questionnaire scoring, autism spectrum diagnostic',
    faqs: [
      { q: 'What is the AQ-10?', a: 'The Autism Spectrum Quotient-10 (AQ-10) is a quick, validated screening questionnaire developed by Dr. Simon Baron-Cohen and colleagues at the Autism Research Centre (Cambridge), recommended by NICE (UK) to determine if an adult should be referred for comprehensive autism assessment.' },
      { q: 'What is the diagnostic threshold?', a: 'A score of 6 or higher out of 10 on the AQ-10 indicates significant autistic traits and suggests that a comprehensive diagnostic evaluation by a neurodivergence specialist may be warranted.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; AQ-10 Autism Screener</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Clinical Screener</span>
            <span class="wb-badge badge-purple">NICE Recommended</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Adult Autism Spectrum Quotient (AQ-10)</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Evaluate social interaction, attention switching, and detail focus using the official Cambridge Autism Research Centre instrument.
          </p>
        </div>

        <div class="wb-card">
          <div id="aq10-questions"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcAQ10()">Calculate AQ-10 Score</button>
          </div>
        </div>

        <div class="wb-card" id="aq10-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Total AQ-10 Score</span>
              <div id="aq10-score-val" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#3b82f6;">0 / 10</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Clinical Indication</span>
              <span id="aq10-badge" class="wb-badge badge-green" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Below Cut-Off</span>
            </div>
          </div>
          <div id="aq10-desc" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1rem;"></div>
          <div id="aq10-advice" style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var aqQuestions = [
          { q: "I often notice small sounds when others do not.", scoreOnAgree: true },
          { q: "I usually concentrate more on the whole picture, rather than the small details.", scoreOnAgree: false },
          { q: "I find it easy to do more than one thing at once.", scoreOnAgree: false },
          { q: "If there is an interruption, I can switch back to what I was doing very quickly.", scoreOnAgree: false },
          { q: "I find it easy to 'read between the lines' when someone is talking to me.", scoreOnAgree: false },
          { q: "I know how to tell if someone who is listening to me is getting bored.", scoreOnAgree: false },
          { q: "When I'm reading a story, I find it difficult to work out the characters' intentions.", scoreOnAgree: true },
          { q: "I like to collect information about categories of things (e.g. types of car, birds, trains, plants).", scoreOnAgree: true },
          { q: "I find it easy to work out what someone is thinking or feeling just by looking at their face.", scoreOnAgree: false },
          { q: "I find it difficult to make new friends.", scoreOnAgree: true }
        ];

        var aqBox = document.getElementById('aq10-questions');
        if (aqBox) {
          var ah = '';
          for (var i = 0; i < aqQuestions.length; i++) {
            ah += '<div style="margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border);">' +
              '<div style="font-family:var(--serif); font-size:1rem; font-weight:600; margin-bottom:0.5rem;">' + (i+1) + '. ' + aqQuestions[i].q + '</div>' +
              '<div class="grid-4">' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="aq_q' + i + '" value="DA" checked> Definitely Agree</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="aq_q' + i + '" value="SA"> Slightly Agree</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="aq_q' + i + '" value="SD"> Slightly Disagree</label>' +
                '<label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;"><input type="radio" name="aq_q' + i + '" value="DD"> Definitely Disagree</label>' +
              '</div>' +
            '</div>';
          }
          aqBox.innerHTML = ah;
        }

        function calcAQ10() {
          var score = 0;
          for (var i = 0; i < aqQuestions.length; i++) {
            var radios = document.getElementsByName('aq_q' + i);
            var val = '';
            for (var r = 0; r < radios.length; r++) {
              if (radios[r].checked) { val = radios[r].value; break; }
            }
            var isAgree = (val === 'DA' || val === 'SA');
            if (aqQuestions[i].scoreOnAgree && isAgree) score++;
            if (!aqQuestions[i].scoreOnAgree && !isAgree) score++;
          }

          document.getElementById('aq10-score-val').innerText = score + ' / 10';
          var badge = document.getElementById('aq10-badge');
          if (score >= 6) {
            badge.className = 'wb-badge badge-purple';
            badge.innerText = 'Above Cut-off (6+)';
            document.getElementById('aq10-desc').innerText = 'Your score of ' + score + ' is at or above the clinical threshold of 6. This indicates significant traits consistent with the autism spectrum.';
            document.getElementById('aq10-advice').innerHTML = '<strong>NICE Guidance:</strong> A score of 6 or above indicates that a referral for a comprehensive multidisciplinary autism diagnostic evaluation should be considered.';
          } else {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'Below Cut-off (<6)';
            document.getElementById('aq10-desc').innerText = 'Your score of ' + score + ' is below the clinical threshold of 6. Autistic traits are within non-spectrum population distributions.';
            document.getElementById('aq10-advice').innerHTML = '<strong>Context:</strong> If you still experience social communication or sensory friction, consider investigating ADHD, sensory processing sensitivity (HSP), or social anxiety.';
          }
          document.getElementById('aq10-result').style.display = 'block';
          document.getElementById('aq10-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 35. Social Anxiety Disorder & Fear vs Avoidance Index (Liebowitz Brief LSAS)
  {
    slug: 'social-anxiety-lsas',
    title: 'Social Anxiety Disorder & Fear vs Avoidance Index [Liebowitz Brief LSAS]',
    metaDesc: 'Assess social phobia using the Liebowitz Social Anxiety Scale framework. Measure subjective fear versus behavioral avoidance across common social and performance situations.',
    category: 'Neurobiology & Mind',
    keywords: 'social anxiety test online, liebowitz social anxiety scale brief, lsas scoring calculator, social phobia test free, fear vs avoidance index',
    faqs: [
      { q: 'What is the Liebowitz Social Anxiety Scale (LSAS)?', a: 'Devised by Dr. Michael Liebowitz in 1987, the LSAS is the premier clinical assessment tool for social anxiety, independently evaluating the degree of anxiety/fear and the frequency of avoidance across social and performance situations.' },
      { q: 'Why measure fear and avoidance separately?', a: 'Some people experience agonizing internal panic but force themselves to endure social situations (high fear, low avoidance), while others structure their lives to avoid triggers entirely (moderate fear, extreme avoidance). Disentangling them guides clinical exposure therapy.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Social Anxiety LSAS</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Clinical Benchmark</span>
            <span class="wb-badge badge-purple">Liebowitz LSAS</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Social Anxiety Fear vs Avoidance Index</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Rate your Fear/Anxiety (0-3) and Avoidance Frequency (0-3) across 8 representative social and performance scenarios.
          </p>
        </div>

        <div class="wb-card">
          <div id="lsas-scenarios"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcLSAS()">Calculate Liebowitz Social Anxiety Score</button>
          </div>
        </div>

        <div class="wb-card" id="lsas-result" style="display:none; background:var(--surface-alt);">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Total LSAS Score</span>
              <div id="lsas-total" style="font-size:2rem; font-family:var(--mono); font-weight:700; color:#3b82f6;">0 / 48</div>
            </div>
            <div>
              <span class="field-label" style="margin:0;">Fear Subscale</span>
              <div id="lsas-fear" style="font-size:1.4rem; font-family:var(--mono); font-weight:600; color:var(--fg);">0 / 24</div>
            </div>
            <div>
              <span class="field-label" style="margin:0;">Avoidance Subscale</span>
              <div id="lsas-avoid" style="font-size:1.4rem; font-family:var(--mono); font-weight:600; color:var(--fg);">0 / 24</div>
            </div>
          </div>
          <div id="lsas-analysis" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1rem;"></div>
          <div id="lsas-protocol" style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var scenarios = [
          "Telephoning in public or answering unexpected calls",
          "Speaking up or asking a question in a meeting or classroom",
          "Eating or drinking in public places while being observed",
          "Attending a party or social gathering where you don't know everyone",
          "Working or typing while an authority figure is watching you",
          "Entering a room when others are already seated and talking",
          "Looking someone in the eye who you don't know well",
          "Expressing disagreement or disapproval to an acquaintance"
        ];
        var sBox = document.getElementById('lsas-scenarios');
        if (sBox) {
          var sh = '';
          for (var i = 0; i < scenarios.length; i++) {
            sh += '<div style="margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid var(--border);">' +
              '<div style="font-family:var(--serif); font-size:1rem; font-weight:600; margin-bottom:0.5rem;">' + (i+1) + '. ' + scenarios[i] + '</div>' +
              '<div class="grid-2">' +
                '<div>' +
                  '<label class="field-label">Fear / Anxiety</label>' +
                  '<select id="lsas_fear_' + i + '" class="text-input" style="padding:0.4rem 0.6rem; font-size:0.85rem;">' +
                    '<option value="0">0 — None</option>' +
                    '<option value="1">1 — Mild</option>' +
                    '<option value="2">2 — Moderate</option>' +
                    '<option value="3">3 — Severe</option>' +
                  '</select>' +
                '</div>' +
                '<div>' +
                  '<label class="field-label">Avoidance Frequency</label>' +
                  '<select id="lsas_avoid_' + i + '" class="text-input" style="padding:0.4rem 0.6rem; font-size:0.85rem;">' +
                    '<option value="0">0 — Never (0%)</option>' +
                    '<option value="1">1 — Occasionally (1-33%)</option>' +
                    '<option value="2">2 — Often (33-67%)</option>' +
                    '<option value="3">3 — Usually (67-100%)</option>' +
                  '</select>' +
                '</div>' +
              '</div>' +
            '</div>';
          }
          sBox.innerHTML = sh;
        }

        function calcLSAS() {
          var totalFear = 0;
          var totalAvoid = 0;
          for (var i = 0; i < scenarios.length; i++) {
            totalFear += parseInt(document.getElementById('lsas_fear_' + i).value, 10);
            totalAvoid += parseInt(document.getElementById('lsas_avoid_' + i).value, 10);
          }
          var total = totalFear + totalAvoid;
          document.getElementById('lsas-total').innerText = total + ' / 48';
          document.getElementById('lsas-fear').innerText = totalFear + ' / 24';
          document.getElementById('lsas-avoid').innerText = totalAvoid + ' / 24';

          var analysis = '';
          var proto = '';
          if (total <= 12) {
            analysis = 'Low social anxiety. Your responses reflect healthy situational nervousness without life-constricting avoidance patterns.';
            proto = '<strong>Maintain:</strong> Continue engaging openly in public and relational settings.';
          } else if (total <= 24) {
            analysis = 'Moderate social anxiety. You experience noticeable internal friction in evaluative settings, but maintain partial behavioral engagement.';
            proto = '<strong>Graded Exposure Protocol:</strong> Target situations where avoidance is highest. Practice micro-exposures (e.g. asking a store clerk a brief question) without seeking escape.';
          } else if (total <= 36) {
            analysis = 'Marked social phobia. Fear of negative evaluation is causing substantial avoidance of career advancement and social connection.';
            proto = '<strong>CBT Social Protocol:</strong> Cognitive reframing of the "Spotlight Effect" (people notice you far less than you imagine) combined with structured behavioral experiments.';
          } else {
            analysis = 'Severe to very severe generalized social anxiety. Severe impairment in daily functioning and significant lifestyle constriction.';
            proto = '<strong>Clinical Direction:</strong> Structured evidence-based therapy (CBT for Social Anxiety, ACT, or pharmacological support) is strongly indicated to rebuild social safety.';
          }

          document.getElementById('lsas-analysis').innerText = analysis;
          document.getElementById('lsas-protocol').innerHTML = proto;
          document.getElementById('lsas-result').style.display = 'block';
          document.getElementById('lsas-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 36. Multidimensional Perfectionism & Fear of Failure Scale
  {
    slug: 'perfectionism-paralysis-meter',
    title: 'Multidimensional Perfectionism & Fear of Failure Scale [Frost & Hewitt MPS]',
    metaDesc: 'Deconstruct adaptive high standards vs toxic perfectionism paralysis using the Frost & Hewitt MPS model. Calculate your 80/20 Good Enough Threshold to end procrastination.',
    category: 'Neurobiology & Mind',
    keywords: 'perfectionism test online, fear of failure scale, frost multidimensional perfectionism, perfectionist paralysis calculator, good enough threshold tool',
    faqs: [
      { q: 'What is toxic perfectionism?', a: 'Toxic or neurotic perfectionism is not the healthy desire to do good work; it is an anxiety-driven survival strategy where a person conflates their intrinsic self-worth with flawless performance, creating severe task initiation paralysis.' },
      { q: 'What are the 3 perfectionism dimensions?', a: 'Clinical researchers Hewitt and Flett categorize perfectionism into Self-Oriented (unrealistic standards for yourself), Socially Prescribed (believing others demand perfection from you), and Other-Oriented (demanding perfection from partners and peers).' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Perfectionism Paralysis Scale</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-amber">Cognitive Trap</span>
            <span class="wb-badge badge-blue">Frost / Hewitt Model</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Perfectionism & Fear of Failure Audit</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Distinguish healthy mastery pursuit from paralyzing evaluative anxiety, and calculate your optimal "Good Enough" execution threshold.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Perfectionism Dimensions Audit</h3>
          <div id="perf-questions"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcPerf()">Calculate Perfectionism Profile</button>
          </div>
        </div>

        <div class="wb-card" id="perf-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Paralysis Vulnerability Index</span>
              <div id="perf-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#f59e0b;">0 / 30</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Perfectionism Archetype</span>
              <span id="perf-badge" class="wb-badge badge-amber" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Evaluative Concern</span>
            </div>
          </div>
          <div id="perf-verdict" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1rem;"></div>
          <div id="perf-8020-box" style="padding:1rem; background:var(--bg); border-left:4px solid #f59e0b; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var perfItems = [
          "If I fail partly, it is as bad as being a complete failure (All-or-Nothing Thinking).",
          "I feel that people will think less of me if I make a visible mistake.",
          "I procrastinate starting projects because I worry I won't execute them to my exact vision.",
          "Even when I achieve something great, I rarely feel satisfied; I immediately fixate on what could have been better.",
          "I spend an inordinate amount of time on micro-details that others don't notice, delaying delivery.",
          "I believe my value as a human being depends on how productive and competent I appear to others."
        ];
        var pBox = document.getElementById('perf-questions');
        if (pBox) {
          var ph = '';
          for (var i = 0; i < perfItems.length; i++) {
            ph += '<div style="margin-bottom:1rem;">' +
              '<label style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:600; margin-bottom:0.25rem;">' +
                '<span>' + (i+1) + '. ' + perfItems[i] + '</span>' +
                '<span id="val_perf_' + i + '" style="font-family:var(--mono); color:#f59e0b;">3/5</span>' +
              '</label>' +
              '<input type="range" id="rng_perf_' + i + '" min="1" max="5" value="3" style="width:100%;" oninput="document.getElementById(\\'val_perf_' + i + '\\').innerText = this.value + \\'/5\\';" />' +
            '</div>';
          }
          pBox.innerHTML = ph;
        }

        function calcPerf() {
          var total = 0;
          for (var i = 0; i < perfItems.length; i++) {
            total += parseInt(document.getElementById('rng_perf_' + i).value, 10);
          }
          document.getElementById('perf-score').innerText = total + ' / 30';

          var badge = document.getElementById('perf-badge');
          var verdict = '';
          var antidote = '';

          if (total <= 12) {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'Adaptive Striving';
            verdict = 'Healthy, flexible standards. You enjoy doing excellent work without tying your human worth to flawless execution.';
            antidote = '<strong>Keep Going:</strong> You maintain healthy psychological psychological safety and execute with minimal friction.';
          } else if (total <= 20) {
            badge.className = 'wb-badge badge-amber';
            badge.innerText = 'Moderate Evaluative Friction';
            verdict = 'Perfectionism is beginning to drag on your execution velocity. Procrastination and second-guessing are stealing creative momentum.';
            antidote = '<strong>The 80/20 Good Enough Rule:</strong> Practice shipping work at 80% polish. You will find that 80% to you is 100% to the client or audience, and saves 80% of your emotional energy.';
          } else {
            badge.className = 'wb-badge badge-red';
            badge.innerText = 'Severe Perfectionism Paralysis';
            verdict = 'Acute Maladaptive Perfectionism. You are trapped in an agonizing freeze loop: fear of imperfect results prevents initiation, creating guilt, which intensifies the need for perfection.';
            antidote = '<strong>Radical Imperfection Therapy:</strong> Intentionally make deliberate, harmless micro-errors (e.g. leave one typo in a casual Slack message, ship a draft without polishing). Train your nervous system that making mistakes is survivable.';
          }

          document.getElementById('perf-verdict').innerText = verdict;
          document.getElementById('perf-8020-box').innerHTML = antidote;
          document.getElementById('perf-result').style.display = 'block';
          document.getElementById('perf-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 37. OCD Intrusive Thought & Rumination Loop Interrupter
  {
    slug: 'ocd-rumination-loop-breaker',
    title: 'OCD Intrusive Thought & Rumination Loop Interrupter [ERP Exposure Protocol]',
    metaDesc: 'Interrupt acute OCD obsessive spikes and rumination loops using Exposure and Response Prevention (ERP). Practice sitting with uncertainty with the 90-Second Neurochemical Decay Timer.',
    category: 'Neurobiology & Mind',
    keywords: 'ocd rumination interrupter online, erp exposure response prevention timer, intrusive thoughts protocol, obsessive compulsive loop breaker, tolerate uncertainty ocd',
    faqs: [
      { q: 'What is Exposure and Response Prevention (ERP)?', a: 'ERP is the gold-standard behavioral therapy for OCD. It involves exposing yourself to the thoughts, images, and situations that provoke anxiety ("Exposure") and making a conscious choice not to engage in the compulsive or neutralizing ritual ("Response Prevention").' },
      { q: 'Why does rumination worsen OCD?', a: 'Rumination is a mental compulsion. When you analyze, argue with, or seek certainty about an intrusive thought, you teach your brain that the thought is genuinely dangerous, cementing the neural feedback loop.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; OCD Rumination Interrupter</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Obsessive Loop Interrupter</span>
            <span class="wb-badge badge-purple">ERP Exposure Protocol</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">OCD Intrusive Thought & Rumination Interrupter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Stop feeding mental neutralizing compulsions. Practice sitting with uncertainty and observe the 90-second biological decay of acute anxiety.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Step 1: Deconstruct the Obsessive Spike</h3>
          <div style="margin-bottom:1rem;">
            <label class="field-label">The Intrusive Thought / "What If" Terror</label>
            <input type="text" id="ocd-thought" class="text-input" placeholder="e.g. What if I said something offensive? What if I left the stove on? What if I am secretly a bad person?" />
          </div>
          <div style="margin-bottom:1rem;">
            <label class="field-label">The Compulsion You Feel Compelled to Do</label>
            <input type="text" id="ocd-compulsion" class="text-input" placeholder="e.g. Replay the memory for the 20th time, ask for reassurance, check locks, Google symptoms..." />
          </div>
        </div>

        <div class="wb-card" style="background:var(--surface-alt); text-align:center;">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:0.5rem;">Step 2: The 90-Second Uncertainty Tolerance Timer</h3>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem; max-width:600px; margin-left:auto; margin-right:auto;">
            Neurobiologist Dr. Jill Bolte Taylor established that an emotional surge takes approximately 90 seconds to chemically flush through your bloodstream. Commit to sitting with "Maybe, maybe not" without performing the compulsion for 90 seconds.
          </p>

          <div id="erp-timer-display" style="font-size:3rem; font-family:var(--mono); font-weight:700; color:#ef4444; margin-bottom:1rem;">01:30</div>
          <div>
            <button class="btn-primary" id="erp-start-btn" onclick="startERPTimer()">Start 90s Response Prevention</button>
          </div>
          <div id="erp-affirmation" style="font-family:var(--serif); font-size:1.1rem; color:var(--fg); margin-top:1.5rem; font-style:italic; display:none;">
            "I am willing to live with the uncertainty. Maybe that terrible thing is true, maybe it isn't. I am getting back to my life anyway."
          </div>
        </div>
      </div>
      <script>
        var erpTimer = null;
        var erpSecs = 90;

        function startERPTimer() {
          if (erpTimer) clearInterval(erpTimer);
          erpSecs = 90;
          document.getElementById('erp-start-btn').disabled = true;
          document.getElementById('erp-start-btn').innerText = 'Holding Space with Uncertainty...';
          document.getElementById('erp-affirmation').style.display = 'block';

          erpTimer = setInterval(function() {
            erpSecs--;
            var m = Math.floor(erpSecs / 60);
            var s = erpSecs % 60;
            document.getElementById('erp-timer-display').innerText = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;

            if (erpSecs <= 0) {
              clearInterval(erpTimer);
              document.getElementById('erp-timer-display').innerText = '00:00';
              document.getElementById('erp-timer-display').style.color = '#22c55e';
              document.getElementById('erp-start-btn').disabled = false;
              document.getElementById('erp-start-btn').innerText = 'Session Complete! You Survived the Spike';
              alert('Congratulations! You just withheld a compulsion for 90 seconds. You rewired your brain to tolerate uncertainty.');
            }
          }, 1000);
        }
      </script>
    `
  },

  // 38. Compassion Fatigue & Secondary Traumatic Stress Auditor
  {
    slug: 'compassion-fatigue-meter',
    title: 'Compassion Fatigue & Secondary Traumatic Stress Auditor [ProQOL 5 Scale]',
    metaDesc: 'Measure empathy exhaustion, secondary traumatic stress, and compassion satisfaction for nurses, caregivers, and therapists based on the clinical ProQOL 5 instrument.',
    category: 'Neurobiology & Mind',
    keywords: 'compassion fatigue test online, proqol 5 scoring calculator, secondary traumatic stress scale, caregiver burnout audit, empathy exhaustion test',
    faqs: [
      { q: 'What is compassion fatigue?', a: 'Compassion fatigue is the profound emotional and physical erosion that takes place when caregivers and empaths are unable to refuel and regenerate while continuously witnessing or supporting the trauma, suffering, and pain of others.' },
      { q: 'What is the difference between burnout and compassion fatigue?', a: 'Burnout stems from environmental stress (high caseloads, toxic bureaucracy, poor pay), while compassion fatigue specifically stems from relational empathy overload and vicarious traumatization.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Compassion Fatigue Auditor</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Empathy Burnout</span>
            <span class="wb-badge badge-purple">ProQOL 5 Metric</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Compassion Fatigue & Empathy Burnout Auditor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Evaluate secondary traumatic stress, emotional depletion, and compassion satisfaction if you care for family, patients, clients, or loved ones in crisis.
          </p>
        </div>

        <div class="wb-card">
          <div id="proqol-questions"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcProQOL()">Audit Compassion Fatigue</button>
          </div>
        </div>

        <div class="wb-card" id="proqol-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Secondary Trauma / Depletion Score</span>
              <div id="proqol-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#ef4444;">0 / 24</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Caregiver State</span>
              <span id="proqol-badge" class="wb-badge badge-amber" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Elevated Risk</span>
            </div>
          </div>
          <div id="proqol-verdict" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1rem;"></div>
          <div id="proqol-protocol" style="padding:1rem; background:var(--bg); border-left:4px solid #ef4444; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var proqolItems = [
          "I feel worn out because of my work as a helper / caregiver.",
          "I am preoccupied with the suffering of more than one person I care for.",
          "I feel trapped in my caregiving / helping role.",
          "I find it difficult to separate my personal life from the crises of those I support.",
          "I am exhausted from taking on other people's trauma and emotional pain as if it were my own.",
          "I find myself feeling numb, cynical, or indifferent when hearing about another crisis."
        ];
        var pqBox = document.getElementById('proqol-questions');
        if (pqBox) {
          var pqh = '';
          for (var i = 0; i < proqolItems.length; i++) {
            pqh += '<div style="margin-bottom:1rem;">' +
              '<label style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:600; margin-bottom:0.25rem;">' +
                '<span>' + (i+1) + '. ' + proqolItems[i] + '</span>' +
                '<span id="val_pq_' + i + '" style="font-family:var(--mono); color:#ef4444;">2/4</span>' +
              '</label>' +
              '<input type="range" id="rng_pq_' + i + '" min="1" max="4" value="2" style="width:100%;" oninput="document.getElementById(\\'val_pq_' + i + '\\').innerText = this.value + \\'/4\\';" />' +
            '</div>';
          }
          pqBox.innerHTML = pqh;
        }

        function calcProQOL() {
          var total = 0;
          for (var i = 0; i < proqolItems.length; i++) {
            total += parseInt(document.getElementById('rng_pq_' + i).value, 10);
          }
          document.getElementById('proqol-score').innerText = total + ' / 24';

          var badge = document.getElementById('proqol-badge');
          var v = '';
          var p = '';

          if (total <= 10) {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'Resilient Compassion';
            v = 'Low compassion fatigue. You maintain healthy emotional boundaries and retain genuine compassion satisfaction without vicarious trauma.';
            p = '<strong>Preservation:</strong> Keep your boundary fences firm. Do not increase your caregiving load unnecessarily.';
          } else if (total <= 16) {
            badge.className = 'wb-badge badge-amber';
            badge.innerText = 'Moderate Empathy Depletion';
            v = 'Early-stage compassion fatigue. You are beginning to feel emotionally porous, irritable, and burdened by others\\' unresolved pain.';
            p = '<strong>The Empathy Detachment Protocol:</strong> Transition from emotional contagion (feeling WITH someone) to cognitive compassion (wishing them well without absorbing their nervous system load). Institute strict off-duty hours.';
          } else {
            badge.className = 'wb-badge badge-red';
            badge.innerText = 'Acute Secondary Trauma';
            v = 'Severe compassion fatigue & emotional shutdown. Your nervous system has entered defensive dissociation or chronic irritability due to prolonged exposure to suffering.';
            p = '<strong>Emergency Respite:</strong> You cannot pour from a shattered cup. Take immediate leave or respite from your caregiving responsibilities. Seek specialized counseling for secondary traumatic stress.';
          }

          document.getElementById('proqol-verdict').innerText = v;
          document.getElementById('proqol-protocol').innerHTML = p;
          document.getElementById('proqol-result').style.display = 'block';
          document.getElementById('proqol-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 39. Emotional Permanence & Object Constancy Insecurity Diagnostic
  {
    slug: 'emotional-permanence-screener',
    title: 'Emotional Permanence & Object Constancy Insecurity Diagnostic [BPD/ADHD Attachment]',
    metaDesc: 'Diagnose emotional impermanence and object constancy insecurity. Understand why "out of sight feels like unloved" and anchor relationship reality with cognitive bridging.',
    category: 'Neurobiology & Mind',
    keywords: 'emotional permanence test online, object constancy bpd adhd quiz, out of sight out of mind relationships, fear of abandonment test, emotional impermanence audit',
    faqs: [
      { q: 'What is emotional permanence?', a: 'Emotional permanence (derived from developmental psychology\'s "object constancy") is the cognitive ability to believe and feel that someone still loves and cares about you even when they are not physically present, actively communicating, or validating you at that exact moment.' },
      { q: 'Why is emotional impermanence common in ADHD and BPD?', a: 'In ADHD, working memory deficits create literal "out of sight, out of mind" challenges with emotional state representations. In Borderline Personality or anxious attachment, fear of abandonment interprets silence as catastrophic withdrawal of affection.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Emotional Permanence</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-amber">Attachment Neurobiology</span>
            <span class="wb-badge badge-purple">Object Constancy</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Emotional Permanence & Object Constancy Diagnostic</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Audit whether physical absence or delayed communication triggers acute emotional detachment or abandonment panic, and construct a permanent cognitive bridge.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Emotional Impermanence Indicator Checklist</h3>
          <div id="ep-checklist"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcEP()">Calculate Emotional Permanence Score</button>
          </div>
        </div>

        <div class="wb-card" id="ep-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Impermanence Severity</span>
              <div id="ep-score-num" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#f59e0b;">0 / 6</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Attachment Blueprint</span>
              <span id="ep-badge" class="wb-badge badge-green" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Secure Permanence</span>
            </div>
          </div>
          <div id="ep-analysis" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1rem;"></div>
          <div id="ep-bridge" style="padding:1rem; background:var(--bg); border-left:4px solid #f59e0b; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var epItems = [
          "When my partner or friend is not physically with me or actively texting, I struggle to genuinely feel that they still care about me.",
          "If a loved one takes hours to reply to a text, my mind immediately jumps to 'they are tired of me' or 'they are pulling away'.",
          "A small conflict or cool tone of voice completely erases all the positive memories and loving history we shared.",
          "I constantly crave explicit verbal reassurance that everything is okay between us.",
          "When I am away from people for a few days, I sometimes forget how much I cared about them, or assume they have forgotten me.",
          "I feel an acute wave of panic, shame, or despair during neutral communication pauses."
        ];

        var epBox = document.getElementById('ep-checklist');
        if (epBox) {
          var eph = '';
          for (var i = 0; i < epItems.length; i++) {
            eph += '<label style="display:flex; align-items:flex-start; gap:0.5rem; margin-bottom:0.75rem; font-size:0.9rem; cursor:pointer; line-height:1.4;">' +
              '<input type="checkbox" class="ep-check" style="margin-top:0.2rem;" />' +
              '<span><strong>' + (i+1) + '.</strong> ' + epItems[i] + '</span>' +
            '</label>';
          }
          epBox.innerHTML = eph;
        }

        function calcEP() {
          var checks = document.querySelectorAll('.ep-check');
          var count = 0;
          checks.forEach(function(c) { if (c.checked) count++; });
          document.getElementById('ep-score-num').innerText = count + ' / 6';

          var badge = document.getElementById('ep-badge');
          var a = '';
          var b = '';

          if (count <= 1) {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'High Emotional Permanence';
            a = 'You possess solid object constancy. You maintain an internal, enduring mental representation of affection even during prolonged silence or distance.';
            b = '<strong>Stability:</strong> Your relational blueprint is securely anchored against momentary absence.';
          } else if (count <= 3) {
            badge.className = 'wb-badge badge-amber';
            badge.innerText = 'Situational Impermanence';
            a = 'Moderate vulnerability to emotional impermanence. When fatigued or stressed, quiet communication periods can trigger sudden flashes of insecurity.';
            b = '<strong>The Cognitive Bridge:</strong> Keep a physical or digital &quot;Warmth Folder&quot; (screenshots of sweet texts, photos, gifts) to look at when the absence makes you doubt their love.';
          } else {
            badge.className = 'wb-badge badge-red';
            badge.innerText = 'Acute Emotional Impermanence';
            a = 'Severe object constancy insecurity. Your nervous system interprets physical absence or silence as literal abandonment and loss of affection.';
            b = '<strong>The Reality Anchoring Mantra:</strong> Say to yourself: &quot;Absence of communication is not presence of rejection. Their feelings do not vanish just because they are busy living their day. Love exists in memory even when it is not being spoken right now.&quot;';
          }

          document.getElementById('ep-analysis').innerText = a;
          document.getElementById('ep-bridge').innerHTML = b;
          document.getElementById('ep-result').style.display = 'block';
          document.getElementById('ep-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  }
];
