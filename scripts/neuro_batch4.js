// scripts/neuro_batch4.js — Batch 4 of Human Neurobiology Suite (Tools 40-50)
// Pure zero-dependency client-side clinical diagnostics & behavioral workbenches

export const batch4Tools = [
  // 40. Narcissistic Abuse & Coercive Control Inventory
  {
    slug: 'narcissistic-abuse-inventory',
    title: 'Narcissistic Abuse & Coercive Control Inventory [Dr. Ramani & Evan Stark Audit]',
    metaDesc: "Comprehensive client-side audit for narcissistic abuse, coercive control, and insidious psychological manipulation. Evaluate love bombing, devaluation, gaslighting, and isolation.",
    category: 'Neurobiology & Mind',
    keywords: 'narcissistic abuse test online, coercive control checklist, am i being abused or crazy, gaslighting and manipulation quiz, walking on eggshells test',
    faqs: [
      { q: 'What is narcissistic abuse?', a: 'Narcissistic abuse is a pattern of emotional, verbal, psychological, and sometimes financial manipulation perpetrated by someone with high narcissistic traits or NPD. It is characterized by cycles of idealization (love bombing), devaluation, gaslighting, and intermittent discard.' },
      { q: 'What is coercive control?', a: 'Coercive control, conceptualized by sociologist Evan Stark, is a strategic pattern of behavior designed to strip a victim of independence, self-worth, and autonomy through micro-regulation, isolation, surveillance, and implicit threats.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Narcissistic Abuse Inventory</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Trauma Psychology</span>
            <span class="wb-badge badge-purple">Coercive Control Audit</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Narcissistic Abuse & Coercive Control Inventory</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Evaluate relational dynamics for insidious emotional erosion, reality denial, walking on eggshells, and interpersonal coercion. 100% confidential and runs locally in your browser.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Behavioral Indicators Checklist</h3>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1.25rem;">Check each statement that accurately describes your relationship experience:</p>
          <div id="na-questions"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcNarcAbuse()">Audit Relational Safety</button>
          </div>
        </div>

        <div class="wb-card" id="na-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Abuse & Coercion Markers</span>
              <div id="na-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#ef4444;">0 / 12</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Risk Tier</span>
              <span id="na-tier-badge" class="wb-badge badge-green" style="font-size:0.9rem; padding:0.3rem 0.8rem;">Low Concern</span>
            </div>
          </div>
          <div id="na-analysis" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1.25rem;"></div>
          <div id="na-protocol" style="padding:1.25rem; background:var(--bg); border-left:4px solid #ef4444; border-radius:4px; font-size:0.92rem; line-height:1.6;"></div>
        </div>
      </div>
      <script>
        var naItems = [
          "I feel like I am walking on eggshells, constantly monitoring their moods to prevent sudden explosions, silent treatment, or disgust.",
          "When I bring up hurt feelings, the conversation is flipped so that I end up apologizing for upsetting them or 'causing drama'.",
          "They deny things they clearly said or did, leaving me questioning my memory, perception, or sanity (gaslighting).",
          "Rules apply strictly to me that never apply to them (hypocrisy and double standards).",
          "They subtly or overtly erode my relationships with close friends, family members, or independent support systems.",
          "I have felt pressured to record conversations or write down dates just to prove to myself that events actually happened as I remember.",
          "They shower me with intense affection or lavish promises, followed without warning by cold withdrawal or contempt.",
          "They minimize my achievements or turn moments of my joy into occasions about their personal grievances or envy.",
          "I have developed physical symptoms around them: stomach tension, throat tightness, panic spikes, or chronic exhaustion.",
          "They demand immediate responses to texts/calls, monitor my schedule, or micro-manage my finances/appearance.",
          "Any boundary I set is treated as an act of personal aggression, betrayal, or lack of love.",
          "I feel like a hollow shell of the confident, joyful person I was before this relationship began."
        ];

        var naBox = document.getElementById('na-questions');
        if (naBox) {
          var h = '';
          for (var i = 0; i < naItems.length; i++) {
            h += '<label style="display:flex; align-items:flex-start; gap:0.6rem; margin-bottom:0.85rem; font-size:0.9rem; cursor:pointer; line-height:1.45;">' +
              '<input type="checkbox" class="na-check" style="margin-top:0.2rem;" />' +
              '<span><strong>' + (i+1) + '.</strong> ' + naItems[i] + '</span>' +
            '</label>';
          }
          naBox.innerHTML = h;
        }

        function calcNarcAbuse() {
          var checks = document.querySelectorAll('.na-check');
          var count = 0;
          checks.forEach(function(c) { if (c.checked) count++; });
          document.getElementById('na-score').innerText = count + ' / 12';

          var badge = document.getElementById('na-tier-badge');
          var analysis = '';
          var protocol = '';

          if (count <= 2) {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'Low Indicators';
            analysis = 'Your responses do not indicate systematic narcissistic abuse or coercive control. Occasional relationship conflict or communication frictions may occur, but core psychological safety and reality testing remain intact.';
            protocol = '<strong>Maintenance:</strong> Maintain firm interpersonal boundaries and open reciprocal communication. Continue to prioritize mutual respect.';
          } else if (count <= 5) {
            badge.className = 'wb-badge badge-amber';
            badge.innerText = 'Moderate Toxic Dynamics';
            analysis = 'Significant toxic relational patterns detected. You are experiencing defensive DARVO responses, chronic blame-shifting, and early reality erosion. You may already be modifying your authentic speech to avoid conflict.';
            protocol = '<strong>The Boundary Firewall:</strong> Stop explaining yourself endlessly (JADE: do not Justify, Argue, Defend, or Explain). Document critical agreements in writing. Reconnect with third-party friends outside this person\'s sphere of influence.';
          } else {
            badge.className = 'wb-badge badge-red';
            badge.innerText = 'Severe Narcissistic Abuse / Coercion';
            analysis = 'Critical warning: Your responses indicate severe, systematic emotional erosion, reality manipulation (gaslighting), and coercive control. You are trapped in a trauma bond where your nervous system is conditioned to seek reassurance from the exact person inflicting psychological damage.';
            protocol = '<strong>The Safety & Extraction Protocol:</strong><br/>1. <em>Acknowledge Reality:</em> They will not change through your love, empathy, or patience. The cycle is structural.<br/>2. <em>Implement Gray Rock:</em> Become emotionally uninteresting, neutral, and unreactive. Give flat, brief factual answers.<br/>3. <em>Consult Specialists:</em> Reach out to a trauma-informed therapist or domestic abuse helpline. Plan an exit strategy that secures your legal, financial, and physical sovereignty.';
          }

          document.getElementById('na-analysis').innerText = analysis;
          document.getElementById('na-protocol').innerHTML = protocol;
          document.getElementById('na-result').style.display = 'block';
          document.getElementById('na-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 41. Vagus Nerve Tone & Heart Rate Variability (HRV) Readiness Estimator
  {
    slug: 'vagus-nerve-tone-assessor',
    title: 'Vagus Nerve Tone & Parasympathetic Readiness Estimator [RSA / HRV Model]',
    metaDesc: "Estimate your vagal nerve tone and parasympathetic recovery capacity. Interactive vagus nerve health diagnostic with integrated 0.1Hz resonant breathing pacer.",
    category: 'Neurobiology & Mind',
    keywords: 'vagus nerve tone test, parasympathetic nervous system score, hrv readiness calculator online, polyvagal tone diagnostic, resonant breathing 0.1hz pacer',
    faqs: [
      { q: 'What is vagal tone?', a: 'Vagal tone refers to the functional activity of the 10th cranial nerve (the Vagus Nerve), the primary highway of the parasympathetic nervous system. High vagal tone allows your cardiovascular and nervous system to rapidly decelerate after stress, promoting cellular repair, digestion, and emotional equilibrium.' },
      { q: 'What is resonant frequency breathing?', a: 'Resonant frequency breathing (typically ~5.5 to 6 breaths per minute, or 0.1 Hz) creates maximum Heart Rate Variability (HRV) and synchronizes heart rate, blood pressure, and brain wave oscillations (Respiratory Sinus Arrhythmia).' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Vagus Nerve Tone Assessor</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Autonomic Neurobiology</span>
            <span class="wb-badge badge-green">Polyvagal Theory</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Vagus Nerve Tone & Parasympathetic Estimator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Assess your nervous system's capacity to engage the "vagal brake", transition out of sympathetic fight-or-flight, and engage cellular restoration.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Autonomic Somatic Symptoms</h3>
          <div id="vagus-questions"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcVagalTone()">Estimate Vagal Tone Score</button>
          </div>
        </div>

        <div class="wb-card" id="vagus-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Vagal Tone Readiness Score</span>
              <div id="vagus-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#3b82f6;">0%</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Autonomic State</span>
              <span id="vagus-badge" class="wb-badge badge-green">High Vagal Tone</span>
            </div>
          </div>
          <div id="vagus-verdict" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1.5rem;"></div>

          <div style="background:var(--bg); border:1px solid var(--border); border-radius:6px; padding:1.25rem;">
            <h4 style="font-family:var(--serif); font-size:1.1rem; margin-bottom:0.5rem;">0.1 Hz Resonant Frequency Vagal Pacer (5.5s Inhale / 5.5s Exhale)</h4>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1rem;">
              Breathe in sync with the circle to stimulate baroreceptor reflex sensitivity and immediately upregulate vagal efferent motor outflow.
            </p>
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem 0;">
              <div id="vagus-pacer-orb" style="width:70px; height:70px; border-radius:50%; background:radial-gradient(circle, #60a5fa, #2563eb); transition:transform 5.5s ease-in-out; display:flex; align-items:center; justify-content:center; color:#fff; font-family:var(--mono); font-size:0.8rem; font-weight:bold;">
                READY
              </div>
              <div id="vagus-pacer-text" style="font-family:var(--mono); font-size:0.95rem; color:var(--fg); margin-top:1rem; font-weight:600;">Click Start Pacer</div>
            </div>
            <div style="text-align:center; margin-top:0.75rem;">
              <button class="btn-primary" id="btn-vagus-pacer" onclick="toggleVagusPacer()">Start Resonant Pacer</button>
            </div>
          </div>
        </div>
      </div>
      <script>
        var vagusItems = [
          { q: "Heart Rate Deceleration: When startled or stressed, my heart rate returns to calm baseline within 3-5 minutes.", favorable: true },
          { q: "Digestive Regularity: I rarely suffer from nervous stomach, chronic acid reflux, bloating, or IBS flare-ups during busy periods.", favorable: true },
          { q: "Cold Water Tolerance: Splashing freezing water on my face produces an immediate sense of calm and mental clarity rather than panic.", favorable: true },
          { q: "Voice Melody & Prosody: When speaking under stress, my voice retains warm inflection rather than becoming monotone, raspy, or tight.", favorable: true },
          { q: "Sleep Latency: When I lie down at night, I fall asleep without restless leg tension, racing pulse, or sudden panic jolts.", favorable: true },
          { q: "Eye Contact Comfort: In social groups, I feel naturally comfortable making relaxed eye contact without feeling socially threatened.", favorable: true },
          { q: "Diaphragmatic Expansion: My resting breath naturally expands my belly and lower ribs rather than staying trapped high in my upper chest.", favorable: true }
        ];

        var vBox = document.getElementById('vagus-questions');
        if (vBox) {
          var vh = '';
          for (var i = 0; i < vagusItems.length; i++) {
            vh += '<label style="display:flex; align-items:flex-start; gap:0.6rem; margin-bottom:0.85rem; font-size:0.9rem; cursor:pointer; line-height:1.45;">' +
              '<input type="checkbox" class="vagus-chk" style="margin-top:0.2rem;" />' +
              '<span><strong>' + (i+1) + '.</strong> ' + vagusItems[i].q + '</span>' +
            '</label>';
          }
          vBox.innerHTML = vh;
        }

        function calcVagalTone() {
          var chks = document.querySelectorAll('.vagus-chk');
          var count = 0;
          chks.forEach(function(c) { if (c.checked) count++; });
          var pct = Math.round((count / vagusItems.length) * 100);

          document.getElementById('vagus-score').innerText = pct + '% (' + count + '/' + vagusItems.length + ')';
          var badge = document.getElementById('vagus-badge');
          var verdict = '';

          if (pct >= 70) {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'High Vagal Tone (Robust RSA)';
            verdict = 'Excellent parasympathetic flexibility. Your ventral vagal complex effectively gates sympathetic hyperarousal, ensuring rapid post-stress physiological recovery, optimal cardiac deceleration, and anti-inflammatory gut transit.';
          } else if (pct >= 40) {
            badge.className = 'wb-badge badge-amber';
            badge.innerText = 'Moderate Vagal Tone';
            verdict = 'Compromised vagal brake. Under mild pressure, your nervous system easily tips into prolonged sympathetic activation (accelerated resting pulse, tight diaphragm, elevated cortisol). Practice the resonant frequency pacer below daily.';
          } else {
            badge.className = 'wb-badge badge-red';
            badge.innerText = 'Low Vagal Tone (Autonomic Exhaustion)';
            verdict = 'Severe vagal insufficiency. Your system is oscillating between sympathetic overdrive (anxiety, gastrointestinal shutdown) and dorsal vagal collapse (lethargy, numbness, brain fog). Targeted somatic interventions (cold exposure, gargling, humming, 0.1Hz breathing) are urgently indicated.';
          }

          document.getElementById('vagus-verdict').innerText = verdict;
          document.getElementById('vagus-result').style.display = 'block';
          document.getElementById('vagus-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        var pacerTimer = null;
        var pacerInhaling = false;
        function toggleVagusPacer() {
          var btn = document.getElementById('btn-vagus-pacer');
          var orb = document.getElementById('vagus-pacer-orb');
          var txt = document.getElementById('vagus-pacer-text');
          if (pacerTimer) {
            clearInterval(pacerTimer);
            pacerTimer = null;
            btn.innerText = 'Start Resonant Pacer';
            txt.innerText = 'Pacer Paused';
            orb.style.transform = 'scale(1)';
            orb.innerText = 'READY';
            return;
          }
          btn.innerText = 'Stop Pacer';
          pacerInhaling = true;
          orb.style.transform = 'scale(2.2)';
          orb.innerText = 'IN';
          txt.innerText = 'Inhale smoothly through nose... (5.5s)';

          pacerTimer = setInterval(function() {
            pacerInhaling = !pacerInhaling;
            if (pacerInhaling) {
              orb.style.transform = 'scale(2.2)';
              orb.innerText = 'IN';
              txt.innerText = 'Inhale smoothly through nose... (5.5s)';
            } else {
              orb.style.transform = 'scale(1)';
              orb.innerText = 'OUT';
              txt.innerText = 'Exhale softly through mouth or nose... (5.5s)';
            }
          }, 5500);
        }
      </script>
    `
  },

  // 42. Maladaptive Daydreaming Diagnostic (MDS-16)
  {
    slug: 'maladaptive-daydreaming-scale',
    title: 'Maladaptive Daydreaming Diagnostic [Eli Somer MDS-16 Clinical Inventory]',
    metaDesc: "Official Maladaptive Daydreaming Scale (MDS-16). Calculate your fantasy immersion score and evaluate real-world functional impairment against clinical thresholds.",
    category: 'Neurobiology & Mind',
    keywords: 'maladaptive daydreaming test free, mds-16 test online, eli somer daydreaming questionnaire, compulsive fantasy screener, daydreaming addiction diagnosis',
    faqs: [
      { q: 'What is Maladaptive Daydreaming?', a: 'First described by clinical psychologist Dr. Eli Somer, Maladaptive Daydreaming (MD) is a condition where an individual engages in extensive, vivid, and structured daydreaming sessions that replace human interaction and significantly impair academic, occupational, or interpersonal functioning.' },
      { q: 'What are common physical symptoms of MD?', a: 'Sufferers often exhibit stereotypic repetitive movements while daydreaming (pacing, rocking, hand flapping), listen to specific music to catalyze trance states, and mouth dialogue or enact facial expressions of their fantasy characters.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Maladaptive Daydreaming Scale</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">MDS-16 Clinical Scale</span>
            <span class="wb-badge badge-blue">Dr. Eli Somer</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Maladaptive Daydreaming Diagnostic (MDS-16)</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Measure the depth of dissociative absorption, kinetic pacing, and fantasy dependency over the past month.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">MDS-16 Key Indicators (Rate 0% to 100%)</h3>
          <div id="mds-items"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcMDS()">Calculate MDS-16 Clinical Score</button>
          </div>
        </div>

        <div class="wb-card" id="mds-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">MDS-16 Composite Average</span>
              <div id="mds-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#8b5cf6;">0%</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Diagnostic Status</span>
              <span id="mds-badge" class="wb-badge badge-green">Normative Fantasy</span>
            </div>
          </div>
          <div id="mds-desc" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1.25rem;"></div>
          <div id="mds-protocol" style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.9rem; line-height:1.5;"></div>
        </div>
      </div>
      <script>
        var mdsQuestions = [
          "I feel a strong urge to pace, rock, spin, or perform repetitive movements while daydreaming.",
          "Music triggers an intense, instant rush of elaborate, cinematic daydream storylines.",
          "My daydreams are so vivid that I feel genuine, profound emotions (grief, love, adrenaline) for fictional characters.",
          "When interrupted while daydreaming, I feel intensely annoyed, irritable, or distressed.",
          "I actively choose daydreaming over hanging out with real friends, studying, or pursuing career goals.",
          "I have tried repeatedly to stop or reduce the hours I spend daydreaming, but found myself unable to resist.",
          "My daydreaming significantly interferes with my sleep schedule or basic daily routines."
        ];

        var mBox = document.getElementById('mds-items');
        if (mBox) {
          var mh = '';
          for (var i = 0; i < mdsQuestions.length; i++) {
            mh += '<div style="margin-bottom:1.25rem;">' +
              '<div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:600; margin-bottom:0.35rem;">' +
                '<span>' + (i+1) + '. ' + mdsQuestions[i] + '</span>' +
                '<span id="val_mds_' + i + '" style="font-family:var(--mono); color:#8b5cf6;">50%</span>' +
              '</div>' +
              '<input type="range" id="rng_mds_' + i + '" min="0" max="100" step="10" value="50" style="width:100%;" oninput="document.getElementById(\\'val_mds_' + i + '\\').innerText = this.value + \\'%\\';" />' +
            '</div>';
          }
          mBox.innerHTML = mh;
        }

        function calcMDS() {
          var total = 0;
          for (var i = 0; i < mdsQuestions.length; i++) {
            total += parseInt(document.getElementById('rng_mds_' + i).value, 10);
          }
          var avg = Math.round(total / mdsQuestions.length);
          document.getElementById('mds-score').innerText = avg + '%';

          var badge = document.getElementById('mds-badge');
          var d = '';
          var p = '';

          if (avg < 35) {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'Normative Daydreaming (<35%)';
            d = 'Your daydreaming represents normal, healthy human imagination. It serves creative exploration and mental decompression without hijacking executive function or sabotaging your real-world obligations.';
            p = '<strong>Status:</strong> No clinical concern. Your cognitive focus remains under voluntary control.';
          } else if (avg <= 55) {
            badge.className = 'wb-badge badge-amber';
            badge.innerText = 'Borderline / Immersive Daydreaming';
            d = 'Elevated immersive daydreaming. You possess high dissociative capacity and use fantasy scenarios as an escape valve for boredom, emotional distress, or executive fatigue.';
            p = '<strong>Grounding Protocol:</strong> Track your primary triggers (e.g. late-night headphones music, boring work blocks). Introduce tactile anchors (fidget tools, standing desk) to interrupt spontaneous kinesthetic pacing.';
          } else {
            badge.className = 'wb-badge badge-red';
            badge.innerText = 'Clinical Maladaptive Daydreaming (>55%)';
            d = 'Above clinical cutoff. Your daydreaming functions as a behavioral addiction, cannibalizing your waking hours and generating profound guilt or functional paralysis. You are substituting fantasy attachment for real-world intimacy and achievement.';
            p = '<strong>The Dopamine Reclaiming Protocol:</strong><br/>1. <em>Music Fasting:</em> Restrict the specific cinematic soundtracks that trigger your daydream loops.<br/>2. <em>Kinesthetic Anchoring:</em> Notice the physical urge to pace or rock; immediately freeze and name 5 objects in your physical room.<br/>3. <em>Address Underlying Unmet Needs:</em> Daydreams highlight what you lack in reality (heroism, unconditional love, validation). Channel that fantasy narrative into tangible writing or real-world creative projects.';
          }

          document.getElementById('mds-desc').innerText = d;
          document.getElementById('mds-protocol').innerHTML = p;
          document.getElementById('mds-result').style.display = 'block';
          document.getElementById('mds-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 43. Delayed Sleep Phase Syndrome (DSPS) & Circadian Realignment Protocol
  {
    slug: 'delayed-sleep-phase-chronobiology',
    title: 'Delayed Sleep Phase Syndrome (DSPS) & Circadian Realignment Protocol',
    metaDesc: "Calculate your exact circadian temperature minimum (T_min), photic light advance window, and micro-melatonin schedule to shift delayed sleep phase disorder.",
    category: 'Neurobiology & Mind',
    keywords: 'delayed sleep phase syndrome calculator, dsps protocol online, circadian phase advance schedule, temperature minimum calculation sleep, treat delayed sleep phase',
    faqs: [
      { q: 'What is Delayed Sleep Phase Syndrome (DSPS)?', a: 'DSPS is a circadian rhythm disorder where a person\'s internal master clock (suprachiasmatic nucleus) is shifted 2 or more hours later than normal social schedules, resulting in chronic insomnia before 2-4 AM and severe sleep inertia when forced to awaken early.' },
      { q: 'What is the Circadian Temperature Minimum (T_min)?', a: 'T_min is the point in a 24-hour cycle when your core body temperature reaches its absolute lowest point, typically occurring approximately 2 hours prior to your spontaneous waking time. Photic light exposure after T_min powerfully advances your clock earlier.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; DSPS Circadian Realignment</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Chronobiology</span>
            <span class="wb-badge badge-purple">Suprachiasmatic Realignment</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Delayed Sleep Phase Syndrome (DSPS) Realignment</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Input your natural unforced sleep and wake times to calculate your Core Body Temperature Minimum (T_min), photic advance window, and exact micro-melatonin timing.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-2">
            <div>
              <label class="field-label">Natural Unforced Sleep Onset Time</label>
              <input type="time" id="dsps-sleep" class="text-input" value="03:30" />
            </div>
            <div>
              <label class="field-label">Natural Unforced Wake Time</label>
              <input type="time" id="dsps-wake" class="text-input" value="11:30" />
            </div>
          </div>
          <div style="margin-top:1.25rem; text-align:center;">
            <button class="btn-primary" onclick="calcDSPS()">Compute Phase Advance Protocol</button>
          </div>
        </div>

        <div class="wb-card" id="dsps-result" style="display:none; background:var(--surface-alt);">
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
            <div style="background:var(--bg); padding:1rem; border-radius:4px; border:1px solid var(--border);">
              <span class="field-label" style="margin:0;">Est. Temp Minimum (T_min)</span>
              <div id="tmin-val" style="font-size:1.5rem; font-family:var(--mono); font-weight:700; color:#3b82f6;">09:30 AM</div>
              <span style="font-size:0.75rem; color:var(--text-muted);">Core temp nadir (~2h pre-wake)</span>
            </div>
            <div style="background:var(--bg); padding:1rem; border-radius:4px; border:1px solid var(--border);">
              <span class="field-label" style="margin:0;">Photic Light Window</span>
              <div id="light-val" style="font-size:1.5rem; font-family:var(--mono); font-weight:700; color:#f59e0b;">09:45 AM – 11:00 AM</div>
              <span style="font-size:0.75rem; color:var(--text-muted);">>10,000 lux to advance clock</span>
            </div>
            <div style="background:var(--bg); padding:1rem; border-radius:4px; border:1px solid var(--border);">
              <span class="field-label" style="margin:0;">0.3mg Micro-Melatonin</span>
              <div id="mela-val" style="font-size:1.5rem; font-family:var(--mono); font-weight:700; color:#a855f7;">09:00 PM</div>
              <span style="font-size:0.75rem; color:var(--text-muted);">Phase-shifting physiological dose</span>
            </div>
          </div>

          <div id="dsps-plan" style="font-size:0.92rem; line-height:1.6; color:var(--fg); background:var(--bg); padding:1.25rem; border-radius:4px; border-left:4px solid #3b82f6;"></div>
        </div>
      </div>
      <script>
        function parseTimeMins(tStr) {
          var parts = tStr.split(':');
          return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        }
        function fmtMins(mins) {
          var m = (mins % 1440 + 1440) % 1440;
          var h = Math.floor(m / 60);
          var min = m % 60;
          var ampm = h >= 12 ? 'PM' : 'AM';
          var dispH = h % 12 || 12;
          return (dispH < 10 ? '0' : '') + dispH + ':' + (min < 10 ? '0' : '') + min + ' ' + ampm;
        }

        function calcDSPS() {
          var sleepMins = parseTimeMins(document.getElementById('dsps-sleep').value);
          var wakeMins = parseTimeMins(document.getElementById('dsps-wake').value);

          var tMin = wakeMins - 120; // 2 hours prior to natural wake
          var lightStart = tMin + 15;
          var lightEnd = tMin + 90;
          var melaTime = sleepMins - 390; // 6.5 hours prior to natural sleep onset (DLMO target)

          document.getElementById('tmin-val').innerText = fmtMins(tMin);
          document.getElementById('light-val').innerText = fmtMins(lightStart) + ' – ' + fmtMins(lightEnd);
          document.getElementById('mela-val').innerText = fmtMins(melaTime);

          var plan = '<strong>The Lewy Circadian Phase-Shift Protocol:</strong><br/>' +
            '1. <strong>Do Not Move Alarm Abruptly:</strong> Moving your alarm from ' + fmtMins(wakeMins) + ' to 7:00 AM immediately will trigger severe cognitive dysfunction and won\'t reset your clock because light before ' + fmtMins(tMin) + ' actually DELAYS your rhythm further!<br/>' +
            '2. <strong>Morning Photic Anchor:</strong> Expose your eyes to outdoor sunlight or a 10,000 lux lamp between <strong>' + fmtMins(lightStart) + ' and ' + fmtMins(lightEnd) + '</strong>. This stimulates melanopsin retinal ganglion cells to advance the central clock by ~30-45 minutes per day.<br/>' +
            '3. <strong>Micro-Melatonin Phase Advancer:</strong> Take an ultra-low physiological dose (0.3mg, NOT 5mg or 10mg) at <strong>' + fmtMins(melaTime) + '</strong>. High doses flood receptors and spill over; micro-dosing acts purely as a chronobiotic phase-shift cue.';

          document.getElementById('dsps-plan').innerHTML = plan;
          document.getElementById('dsps-result').style.display = 'block';
          document.getElementById('dsps-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 44. DBT TIPP Emergency Distress Tolerance Navigator
  {
    slug: 'dbt-tipp-emergency-skills',
    title: 'DBT TIPP Emergency Distress Tolerance Navigator [Linehan Crisis Protocol]',
    metaDesc: "Interactive somatic navigator for Dialectical Behavior Therapy (DBT) TIPP skills. Abort acute panic, emotional hijack, and overwhelm in under 60 seconds.",
    category: 'Neurobiology & Mind',
    keywords: 'dbt tipp skills interactive, marsha linehan tipp protocol, abort panic attack fast, dialectical behavior therapy crisis skills, somatic distress tolerance',
    faqs: [
      { q: 'What is the TIPP protocol in DBT?', a: 'Created by Dr. Marsha Linehan for Dialectical Behavior Therapy, TIPP stands for Temperature, Intense exercise, Paced breathing, and Paired muscle relaxation. It is an emergency somatic triage protocol designed to pull the brain out of acute limbic hijack when cognitive reasoning has gone offline.' },
      { q: 'How does Temperature trigger the mammalian dive reflex?', a: 'Submerging your face in cold water (or holding an ice pack against eyes and cheekbones) triggers the mammalian dive response: your vagus nerve fires immediately, slowing heart rate by 10-25% and shunting blood to core organs.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; DBT TIPP Navigator</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-red">Crisis Triage</span>
            <span class="wb-badge badge-purple">DBT Somatic Reset</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">DBT TIPP Emergency Distress Tolerance Navigator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            When emotional distress hits 8/10 or higher, your prefrontal cortex is offline. Do not attempt to reason or analyze. Use physical chemistry to rapidly downregulate your nervous system.
          </p>
        </div>

        <div class="wb-card">
          <div class="tab-bar">
            <button class="tab-btn active" onclick="switchTipp('t')">1. Temperature (Dive Reflex)</button>
            <button class="tab-btn" onclick="switchTipp('i')">2. Intense Exercise</button>
            <button class="tab-btn" onclick="switchTipp('p')">3. Paced Breathing (4-7-8)</button>
            <button class="tab-btn" onclick="switchTipp('pm')">4. Paired Relaxation</button>
          </div>

          <div id="tipp-t" class="tipp-pane">
            <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:0.5rem;">T - Cold Temperature (The Mammalian Dive Reflex)</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5; margin-bottom:1rem;">
              Fill a bowl with freezing water or hold an ice pack wrapped in a paper towel against your cheekbones and eyes while holding your breath for 30 seconds.
            </p>
            <div style="text-align:center; padding:1.5rem; background:var(--surface-alt); border-radius:6px;">
              <div id="dive-timer-num" style="font-size:3rem; font-family:var(--mono); font-weight:700; color:#3b82f6; margin-bottom:0.75rem;">30s</div>
              <button class="btn-primary" id="btn-dive" onclick="startDiveTimer()">Start 30-Second Dive Timer</button>
            </div>
          </div>

          <div id="tipp-i" class="tipp-pane" style="display:none;">
            <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:0.5rem;">I - Intense Exercise (Burn the Cortisol Surge)</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5; margin-bottom:1rem;">
              When acute anger or panic spikes, your bloodstream is flooded with adrenaline. Engage in 60 seconds of maximum physical exertion to metabolize stress neurochemicals.
            </p>
            <div style="text-align:center; padding:1.5rem; background:var(--surface-alt); border-radius:6px;">
              <div id="burst-timer-num" style="font-size:3rem; font-family:var(--mono); font-weight:700; color:#ef4444; margin-bottom:0.75rem;">60s</div>
              <button class="btn-primary" id="btn-burst" onclick="startBurstTimer()">Start 60-Second Physical Burst</button>
            </div>
          </div>

          <div id="tipp-p" class="tipp-pane" style="display:none;">
            <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:0.5rem;">P - Paced Breathing (Inhale 4s, Hold 7s, Exhale 8s)</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5; margin-bottom:1rem;">
              Extending the exhale longer than the inhale stimulates baroreceptors and engages the parasympathetic vagal brake.
            </p>
            <div style="text-align:center; padding:1.5rem; background:var(--surface-alt); border-radius:6px;">
              <div id="breathe-stage" style="font-size:1.8rem; font-family:var(--mono); font-weight:700; color:#10b981; margin-bottom:0.5rem;">INHALE (4s)</div>
              <div id="breathe-num" style="font-size:2.5rem; font-family:var(--mono); font-weight:700; color:var(--fg); margin-bottom:0.75rem;">4</div>
              <button class="btn-primary" id="btn-breathe" onclick="toggle478()">Start 4-7-8 Breathing</button>
            </div>
          </div>

          <div id="tipp-pm" class="tipp-pane" style="display:none;">
            <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:0.5rem;">P - Paired Muscle Relaxation</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5; margin-bottom:1rem;">
              Clench each muscle group hard for 5 seconds while breathing in, then release completely while saying &quot;RELAX&quot; on the exhale.
            </p>
            <div style="padding:1rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.9rem; line-height:1.6;">
              1. <strong>Fists & Forearms:</strong> Clench fists tightly into balls &rarr; Release completely.<br/>
              2. <strong>Shoulders:</strong> Shrug shoulders tightly up to your ears &rarr; Drop shoulders down.<br/>
              3. <strong>Jaw & Face:</strong> Scrunch eyes and clench jaw &rarr; Unclench, let mouth hang slightly open.<br/>
              4. <strong>Stomach:</strong> Pull belly button hard toward your spine &rarr; Soften belly outward.<br/>
              5. <strong>Legs & Toes:</strong> Point toes upward and tense thighs &rarr; Go completely limp.
            </div>
          </div>
        </div>
      </div>
      <script>
        function switchTipp(tabId) {
          var btns = document.querySelectorAll('.tab-btn');
          btns.forEach(function(b) { b.classList.remove('active'); });
          event.target.classList.add('active');

          document.querySelectorAll('.tipp-pane').forEach(function(p) { p.style.display = 'none'; });
          document.getElementById('tipp-' + tabId).style.display = 'block';
        }

        var diveTimer = null;
        function startDiveTimer() {
          var sec = 30;
          var el = document.getElementById('dive-timer-num');
          var btn = document.getElementById('btn-dive');
          if (diveTimer) { clearInterval(diveTimer); }
          btn.disabled = true;
          el.innerText = sec + 's';
          diveTimer = setInterval(function() {
            sec--;
            el.innerText = sec + 's';
            if (sec <= 0) {
              clearInterval(diveTimer);
              el.innerText = 'DIVE COMPLETE';
              btn.disabled = false;
            }
          }, 1000);
        }

        var burstTimer = null;
        function startBurstTimer() {
          var sec = 60;
          var el = document.getElementById('burst-timer-num');
          var btn = document.getElementById('btn-burst');
          if (burstTimer) { clearInterval(burstTimer); }
          btn.disabled = true;
          el.innerText = sec + 's';
          burstTimer = setInterval(function() {
            sec--;
            el.innerText = sec + 's';
            if (sec <= 0) {
              clearInterval(burstTimer);
              el.innerText = 'BURST COMPLETE';
              btn.disabled = false;
            }
          }, 1000);
        }

        var bTimer = null;
        var bStep = 0; // 0=in 4, 1=hold 7, 2=out 8
        var bSec = 4;
        function toggle478() {
          var btn = document.getElementById('btn-breathe');
          var stg = document.getElementById('breathe-stage');
          var num = document.getElementById('breathe-num');
          if (bTimer) {
            clearInterval(bTimer);
            bTimer = null;
            btn.innerText = 'Start 4-7-8 Breathing';
            stg.innerText = 'READY';
            num.innerText = '';
            return;
          }
          btn.innerText = 'Stop Pacer';
          bStep = 0;
          bSec = 4;
          stg.innerText = 'INHALE THROUGH NOSE';
          stg.style.color = '#10b981';
          num.innerText = bSec;

          bTimer = setInterval(function() {
            bSec--;
            num.innerText = bSec;
            if (bSec <= 0) {
              if (bStep === 0) {
                bStep = 1;
                bSec = 7;
                stg.innerText = 'HOLD BREATH';
                stg.style.color = '#f59e0b';
              } else if (bStep === 1) {
                bStep = 2;
                bSec = 8;
                stg.innerText = 'EXHALE THROUGH MOUTH';
                stg.style.color = '#3b82f6';
              } else {
                bStep = 0;
                bSec = 4;
                stg.innerText = 'INHALE THROUGH NOSE';
                stg.style.color = '#10b981';
              }
              num.innerText = bSec;
            }
          }, 1000);
        }
      </script>
    `
  },

  // 45. Sensory Overload De-Escalator & Calming Room
  {
    slug: 'sensory-overload-de-escalator',
    title: 'Sensory Overload De-Escalator & Calming Room [Autism/ADHD/HSP Triage]',
    metaDesc: "Interactive sensory quiet room for acute autistic sensory overload, ADHD overstimulation, and HSP nervous system de-escalation with audio soundscapes.",
    category: 'Neurobiology & Mind',
    keywords: 'sensory overload calming room, neurodivergent sensory de-escalation, autistics sensory meltdown tool, low stimulation digital dark room, brown noise relaxer',
    faqs: [
      { q: 'What happens in the brain during sensory overload?', a: 'In autism, ADHD, and Sensory Processing Sensitivity (SPS), the brain\'s thalamic filter (sensory gating) becomes saturated. Too many auditory, visual, and tactile inputs compete for prefrontal processing, triggering a fight-or-flight sympathetic surge or autistic shutdown.' },
      { q: 'How does a low-stimulation digital darkroom help?', a: 'Eliminating high-frequency light contrasts, visual clutter, and abrupt audio inputs removes the cognitive burden from the sensory cortex, allowing the autonomic nervous system to downregulate without external demands.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Sensory Overload Room</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Sensory Gating</span>
            <span class="wb-badge badge-green">Zero Demand Environment</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Sensory Overload De-Escalation Room</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            A low-stimulation, high-safety sanctuary designed to calm sensory overwhelm, shutdown, or approaching meltdown.
          </p>
        </div>

        <div class="wb-card" id="sensory-box" style="background:#0f172a; color:#cbd5e1; border:1px solid #334155; padding:2rem; text-align:center; border-radius:8px; transition:background 0.3s ease;">
          <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1.5rem; flex-wrap:wrap;">
            <button class="btn-sec" style="color:#fff; border-color:#475569;" onclick="setSanctuaryTheme('#020617')">Void Black</button>
            <button class="btn-sec" style="color:#fff; border-color:#475569;" onclick="setSanctuaryTheme('#1e1b4b')">Deep Twilight</button>
            <button class="btn-sec" style="color:#fff; border-color:#475569;" onclick="setSanctuaryTheme('#1c1917')">Warm Earth</button>
          </div>

          <div style="display:flex; justify-content:center; align-items:center; min-height:180px;">
            <div id="sensory-pulse" style="width:80px; height:80px; border-radius:50%; background:rgba(99, 102, 241, 0.25); border:2px solid #818cf8; animation:sensoryBreathe 8s ease-in-out infinite;"></div>
          </div>

          <p id="sensory-prompt" style="font-size:1.05rem; font-family:var(--serif); color:#94a3b8; margin:1.5rem 0 1rem 0;">
            There are no demands on you right now. You do not have to explain anything or speak to anyone.
          </p>

          <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap; margin-top:1.5rem;">
            <button class="btn-primary" id="btn-audio-brown" onclick="toggleNoise('brown')">Toggle Gentle Brown Noise</button>
            <button class="btn-sec" style="color:#fff; border-color:#475569;" onclick="nextSensoryPrompt()">Next Comfort Reassurance &rarr;</button>
          </div>
        </div>
      </div>
      <style>
        @keyframes sensoryBreathe {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2.3); opacity: 0.9; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      </style>
      <script>
        function setSanctuaryTheme(color) {
          document.getElementById('sensory-box').style.background = color;
        }

        var sensoryPhrases = [
          "There are no demands on you right now. You do not have to explain anything or speak to anyone.",
          "Your nervous system is simply full. It is not broken. It just received too much data at once.",
          "Drop your tongue from the roof of your mouth. Let your lower jaw hang loose.",
          "You are allowed to close your eyes, put on headphones, or sit in the dark for as long as you need.",
          "Nothing bad will happen if you do not reply to texts or emails right this minute.",
          "You are safe here in this quiet pocket of space."
        ];
        var sIdx = 0;
        function nextSensoryPrompt() {
          sIdx = (sIdx + 1) % sensoryPhrases.length;
          document.getElementById('sensory-prompt').innerText = sensoryPhrases[sIdx];
        }

        var audioCtx = null;
        var noiseNode = null;
        var isPlayingNoise = false;

        function toggleNoise(type) {
          var btn = document.getElementById('btn-audio-brown');
          if (isPlayingNoise) {
            if (noiseNode) { noiseNode.stop(); noiseNode.disconnect(); }
            isPlayingNoise = false;
            btn.innerText = 'Toggle Gentle Brown Noise';
            return;
          }

          var AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!audioCtx) audioCtx = new AudioContext();
          if (audioCtx.state === 'suspended') audioCtx.resume();

          var bufferSize = 2 * audioCtx.sampleRate;
          var noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          var output = noiseBuffer.getChannelData(0);
          var lastOut = 0.0;
          for (var i = 0; i < bufferSize; i++) {
            var white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 2.5; // boost volume slightly
          }

          noiseNode = audioCtx.createBufferSource();
          noiseNode.buffer = noiseBuffer;
          noiseNode.loop = true;

          var gain = audioCtx.createGain();
          gain.gain.value = 0.15; // gentle calming level

          noiseNode.connect(gain);
          gain.connect(audioCtx.destination);
          noiseNode.start(0);

          isPlayingNoise = true;
          btn.innerText = 'Stop Brown Noise';
        }
      </script>
    `
  },

  // 46. Executive Function Deficit Profiler
  {
    slug: 'executive-function-deficit-map',
    title: 'Executive Function Deficit Profiler [Barkley BDEFS 5-Domain Architecture]',
    metaDesc: "Clinical executive functioning profiler based on Dr. Russell Barkley's BDEFS framework. Map deficits across Time Management, Self-Restraint, and Motivation.",
    category: 'Neurobiology & Mind',
    keywords: 'executive function test online, barkley bdefs questionnaire, adhd executive dysfunction profiler, time blindness test, prefrontal cortex function audit',
    faqs: [
      { q: 'What is executive functioning?', a: 'Executive functioning refers to the prefrontal cortex\'s suite of cognitive control capabilities, including working memory, emotional regulation, response inhibition, sustained attention, and organizational sequencing.' },
      { q: 'Who is Dr. Russell Barkley?', a: 'Dr. Russell Barkley is a leading world authority on ADHD and executive functioning, whose BDEFS (Barkley Deficits in Executive Functioning Scale) categorizes executive dysfunction into 5 ecologically valid real-world domains.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Executive Function Profiler</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Prefrontal Architecture</span>
            <span class="wb-badge badge-purple">Barkley BDEFS</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Executive Function Deficit Profiler</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Map your specific prefrontal bottlenecks across the 5 core domains of everyday executive capability.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Prefrontal Domain Self-Audit (1 = Rare, 5 = Chronic)</h3>
          <div id="bdefs-domains"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcBDEFS()">Generate Executive Profile</button>
          </div>
        </div>

        <div class="wb-card" id="bdefs-result" style="display:none; background:var(--surface-alt);">
          <h3 style="font-size:1.2rem; font-family:var(--serif); margin-bottom:1rem;">Executive Capability Diagnostic Map</h3>
          <div id="bdefs-bars" style="margin-bottom:1.5rem;"></div>
          <div id="bdefs-summary" style="padding:1.25rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; font-size:0.92rem; line-height:1.6;"></div>
        </div>
      </div>
      <script>
        var bdefsItems = [
          { d: "Time Management & Time Blindness", q: "I struggle to sense the passage of time accurately, chronically misestimate project durations, or find myself unexpectedly late." },
          { d: "Self-Organization & Problem Solving", q: "I become overwhelmed by complex multi-step tasks, unable to decide where to start or how to organize information hierarchically." },
          { d: "Self-Restraint & Inhibitory Control", q: "I act impulsively on momentary urges (impulsive spending, speaking without filtering, abandoning work for novel distractions)." },
          { d: "Self-Regulation of Emotion", q: "Small frustrations, sudden plan changes, or perceived criticism trigger disproportionately intense anger, tears, or paralysis." },
          { d: "Self-Motivation & Initiation", q: "Unless there is an immediate, catastrophic deadline or intense novelty, I struggle profoundly to initiate action, even on tasks I care about." }
        ];

        var bdBox = document.getElementById('bdefs-domains');
        if (bdBox) {
          var bdh = '';
          for (var i = 0; i < bdefsItems.length; i++) {
            bdh += '<div style="margin-bottom:1.25rem;">' +
              '<div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:600; margin-bottom:0.35rem;">' +
                '<span>' + bdefsItems[i].d + '</span>' +
                '<span id="val_bd_' + i + '" style="font-family:var(--mono); color:#3b82f6;">3/5</span>' +
              '</div>' +
              '<p style="color:var(--text-muted); font-size:0.85rem; margin:0 0 0.4rem 0;">' + bdefsItems[i].q + '</p>' +
              '<input type="range" id="rng_bd_' + i + '" min="1" max="5" value="3" style="width:100%;" oninput="document.getElementById(\\'val_bd_' + i + '\\').innerText = this.value + \\'/5\\';" />' +
            '</div>';
          }
          bdBox.innerHTML = bdh;
        }

        function calcBDEFS() {
          var barHtml = '';
          var highestDomain = '';
          var highestVal = 0;

          for (var i = 0; i < bdefsItems.length; i++) {
            var val = parseInt(document.getElementById('rng_bd_' + i).value, 10);
            var pct = (val / 5) * 100;
            if (val > highestVal) { highestVal = val; highestDomain = bdefsItems[i].d; }

            var color = pct >= 80 ? '#ef4444' : (pct >= 60 ? '#f59e0b' : '#10b981');
            barHtml += '<div style="margin-bottom:0.75rem;">' +
              '<div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">' +
                '<span>' + bdefsItems[i].d + '</span>' +
                '<span style="font-family:var(--mono); color:' + color + ';">' + val + ' / 5</span>' +
              '</div>' +
              '<div style="width:100%; height:8px; background:var(--border); border-radius:4px; overflow:hidden;">' +
                '<div style="width:' + pct + '%; height:100%; background:' + color + '; transition:width 0.3s ease;"></div>' +
              '</div>' +
            '</div>';
          }
          document.getElementById('bdefs-bars').innerHTML = barHtml;

          var sum = '<strong>Primary Prefrontal Bottleneck: ' + highestDomain + ' (' + highestVal + '/5)</strong><br/>' +
            'Barkley\'s clinical model proves that executive dysfunction is not a lack of knowledge or willpower, but a point-of-performance deficit in translating knowledge into action. You cannot willpower your way past this bottleneck—you must construct external scaffolding (timers, visual checklists, social body-doubling, or environmental gating).';

          document.getElementById('bdefs-summary').innerHTML = sum;
          document.getElementById('bdefs-result').style.display = 'block';
          document.getElementById('bdefs-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 47. Limerence vs Authentic Attachment Auditor
  {
    slug: 'limerence-vs-love-auditor',
    title: 'Limerence vs Authentic Attachment Auditor [Dorothy Tennov Framework]',
    metaDesc: "Diagnose obsessive limerence versus genuine, healthy emotional intimacy. Evaluate intrusive thoughts, crystallization of flaws, and dopamine craving loops.",
    category: 'Neurobiology & Mind',
    keywords: 'limerence test online free, am i in love or limerence, dorothy tennov limerence quiz, obsessive infatuation diagnostic, limerence recovery tool',
    faqs: [
      { q: 'What is Limerence?', a: 'Coined by psychologist Dr. Dorothy Tennov in 1979, limerence is an involuntary, obsessive state of cognitive infatuation characterized by intrusive thoughts about the "Limerent Object" (LO), an acute longing for emotional reciprocation, crystallization of their flaws, and ecstatic highs alternating with despair.' },
      { q: 'How does limerence differ from authentic love?', a: 'Authentic love thrives on reciprocal vulnerability, realistic acceptance of human imperfections, and peaceful nervous system safety. Limerence thrives on uncertainty, intermittent reinforcement, fantasy idealization, and addictive dopamine starvation.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Limerence vs Love Auditor</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-amber">Attachment Obsession</span>
            <span class="wb-badge badge-purple">Dorothy Tennov Model</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Limerence vs Authentic Love Auditor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Audit whether your romantic connection is anchored in authentic relational safety or an obsessive neurochemical dopamine loop.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Limerence Diagnostic Indicators</h3>
          <div id="lim-items"></div>
          <div style="margin-top:1.5rem; text-align:center;">
            <button class="btn-primary" onclick="calcLimerence()">Audit Obsession vs Authentic Attachment</button>
          </div>
        </div>

        <div class="wb-card" id="lim-result" style="display:none; background:var(--surface-alt);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
            <div>
              <span class="field-label" style="margin:0;">Limerence Index</span>
              <div id="lim-score" style="font-size:2.2rem; font-family:var(--mono); font-weight:700; color:#f59e0b;">0 / 8</div>
            </div>
            <div style="text-align:right;">
              <span class="field-label" style="margin:0;">Relational State</span>
              <span id="lim-badge" class="wb-badge badge-green">Healthy Attachment</span>
            </div>
          </div>
          <div id="lim-analysis" style="font-size:0.95rem; line-height:1.6; color:var(--fg); margin-bottom:1.25rem;"></div>
          <div id="lim-break" style="padding:1.25rem; background:var(--bg); border-left:4px solid #f59e0b; border-radius:4px; font-size:0.92rem; line-height:1.6;"></div>
        </div>
      </div>
      <script>
        var limQuestions = [
          "I experience involuntary, intrusive daydreaming about them that interrupts my daily work, reading, or sleep.",
          "I obsessively analyze their micro-behaviors (how fast they text back, phrasing, emojis, body language) searching for hidden signs of reciprocity.",
          "Crystallization: I actively overlook, excuse, or romanticize obvious red flags, values mismatches, or emotional unavailability.",
          "My mood for the entire day hinges entirely on whether they gave me attention or left me on read.",
          "I crave their validation and reciprocal adoration far more than actually getting to know their messy, everyday human reality.",
          "I experience physical somatic symptoms around them: trembling knees, dry mouth, nausea, or a pounding heart.",
          "A sense of uncertainty or unavailability actually intensifies my longing for them rather than turning me off.",
          "When they pull away or act distant, my craving spikes into intense, painful panic."
        ];

        var lBox = document.getElementById('lim-items');
        if (lBox) {
          var lh = '';
          for (var i = 0; i < limQuestions.length; i++) {
            lh += '<label style="display:flex; align-items:flex-start; gap:0.6rem; margin-bottom:0.85rem; font-size:0.9rem; cursor:pointer; line-height:1.45;">' +
              '<input type="checkbox" class="lim-chk" style="margin-top:0.2rem;" />' +
              '<span><strong>' + (i+1) + '.</strong> ' + limQuestions[i] + '</span>' +
            '</label>';
          }
          lBox.innerHTML = lh;
        }

        function calcLimerence() {
          var chks = document.querySelectorAll('.lim-chk');
          var count = 0;
          chks.forEach(function(c) { if (c.checked) count++; });
          document.getElementById('lim-score').innerText = count + ' / 8';

          var badge = document.getElementById('lim-badge');
          var a = '';
          var b = '';

          if (count <= 2) {
            badge.className = 'wb-badge badge-green';
            badge.innerText = 'Grounded Attachment';
            a = 'Low limerence markers. You view this person with realistic perception, maintaining emotional sovereignty and self-esteem independent of their momentary attention.';
            b = '<strong>Healthy Horizon:</strong> Continue cultivating intimacy through reciprocal vulnerability, shared values, and mutual respect rather than romantic fantasy.';
          } else if (count <= 5) {
            badge.className = 'wb-badge badge-amber';
            badge.innerText = 'Moderate Limerence / Infatuation';
            a = 'Significant limerent tendencies detected. You are projecting unmet psychological needs onto this person, and uncertainty is acting as a dopamine multiplier.';
            b = '<strong>Reality Testing Protocol:</strong> Make a written list of their genuine human flaws, incompatibilities, and instances where they failed to meet your needs. Stop feeding the daydream fantasy engine with hypothetical romantic scenarios.';
          } else {
            badge.className = 'wb-badge badge-red';
            badge.innerText = 'Acute Full-Blown Limerence';
            a = 'Severe limerence. Your brain has entered a high-potency addiction cycle mimicking substance abuse. The emotional highs and devastating lows are driven by intermittent reinforcement and fear of rejection, not genuine intimacy.';
            b = '<strong>The Limerence Disruption Blueprint:</strong><br/>1. <em>Go Strict Low-Contact / No-Contact:</em> Stop checking their social media, looking at old photos, or rereading text threads. Every check fires the addiction pathway.<br/>2. <em>Decouple Fantasy from Reality:</em> Recognize that you are in love with a curated mental avatar of who you wish they were, not the actual person standing in front of you.<br/>3. <em>Somatic Re-Centering:</em> When the craving hits, do 20 pushups or immerse your face in cold water to break the neurochemical obsession loop.';
          }

          document.getElementById('lim-analysis').innerText = a;
          document.getElementById('lim-break').innerHTML = b;
          document.getElementById('lim-result').style.display = 'block';
          document.getElementById('lim-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      </script>
    `
  },

  // 48. Toxic Positivity & Emotional Invalidation Deconstructor
  {
    slug: 'toxic-positivity-detox',
    title: 'Toxic Positivity & Emotional Invalidation Deconstructor [Tragic Optimism]',
    metaDesc: "Identify toxic positivity, spiritual bypassing, and emotional invalidation. Translate dismissive platitudes into genuine psychological attunement.",
    category: 'Neurobiology & Mind',
    keywords: 'toxic positivity quiz, emotional invalidation translator, spiritual bypassing test, tragic optimism vs toxic positivity, authentic grief validation',
    faqs: [
      { q: 'What is toxic positivity?', a: 'Toxic positivity is the excessive, rigid, and maladaptive over-generalization of an optimistic state. It denies, minimizes, and invalidates authentic human emotional pain, demanding happiness or gratitude in circumstances where sorrow, anger, or grief are normal, healthy responses.' },
      { q: 'What is Tragic Optimism?', a: 'Formulated by existential psychiatrist Viktor Frankl, Tragic Optimism is the ability to find genuine meaning and dignity in life while fully acknowledging the tragic triad of human existence: pain, guilt, and unavoidable death.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Toxic Positivity Detox</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-amber">Emotional Integrity</span>
            <span class="wb-badge badge-purple">Frankl Tragic Optimism</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Toxic Positivity & Invalidation Deconstructor</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Deconstruct dismissive platitudes and spiritual bypassing into grounded emotional validation and genuine compassion.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Interactive Platitude Translator</h3>
          <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:1rem;">Select an invalidating platitude you have received or told yourself:</p>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem;">
            <button class="btn-sec" onclick="loadPlatitude('reason')">&quot;Everything happens for a reason&quot;</button>
            <button class="btn-sec" onclick="loadPlatitude('worse')">&quot;Others have it so much worse&quot;</button>
            <button class="btn-sec" onclick="loadPlatitude('vibes')">&quot;Good vibes only / Look on bright side&quot;</button>
            <button class="btn-sec" onclick="loadPlatitude('strong')">&quot;God won't give you more than you can handle&quot;</button>
          </div>

          <div style="padding:1.25rem; background:var(--surface-alt); border-radius:6px; border:1px solid var(--border);">
            <div style="margin-bottom:1rem;">
              <span class="field-label">The Toxic / Dismissive Platitude</span>
              <div id="plat-toxic" style="font-size:1.15rem; font-family:var(--serif); font-weight:600; color:#ef4444;">Select a phrase above</div>
            </div>
            <div style="margin-bottom:1rem;">
              <span class="field-label">Why It Causes Psychological Damage</span>
              <p id="plat-damage" style="font-size:0.92rem; line-height:1.5; color:var(--text-muted); margin:0;">-</p>
            </div>
            <div>
              <span class="field-label" style="color:#10b981;">The Attuned Reality Translation (Authentic Empathy)</span>
              <div id="plat-cure" style="padding:1rem; background:var(--bg); border-left:4px solid #10b981; font-size:0.95rem; line-height:1.6; color:var(--fg); font-weight:500;">-</div>
            </div>
          </div>
        </div>
      </div>
      <script>
        var platData = {
          reason: {
            t: '"Everything happens for a reason."',
            d: 'Imposes a premature silver lining onto raw trauma. It shames the grieving person for feeling devastated, implying that their pain is a neat cosmic lesson rather than a painful human tragedy.',
            c: '"This is unfair, terrible, and senseless. It makes complete sense that you are heartbroken and angry. I am not going to offer platitudes; I am just going to sit here with you in the mess."'
          },
          worse: {
            t: '"Be grateful! Others have it so much worse than you."',
            d: 'Weaponizes gratitude to enforce emotional silence (comparative suffering). Suffering is not a finite resource; someone else drowning in 20 feet of water does not make drowning in 10 feet of water comfortable.',
            c: '"Your suffering does not need to be the worst in the world to be valid and worthy of compassion. You are hurting right now, and that alone matters."'
          },
          vibes: {
            t: '"Good vibes only! Just choose happiness and look on the bright side!"',
            d: 'Pathologizes normal negative human emotions (sorrow, righteous anger, anxiety). It teaches individuals to suppress genuine signals from their nervous system, leading to chronic autoimmune and somatic distress.',
            c: '"All emotions are valid data. You do not need to perform cheerfulness to be welcome here. Bring your heavy, exhausted, real self."'
          },
          strong: {
            t: '"You are so strong! You never get more than you can handle."',
            d: 'Romanticizes suffering and isolates the person in a lonely fortress of compulsory resilience. It denies them the right to collapse, ask for help, or feel fragile.',
            c: '"I am so sorry you have had to be this strong for this long. It is exhausting, and it is okay if you cannot carry this alone right now. Let me help you carry some of the weight."'
          }
        };

        function loadPlatitude(key) {
          var d = platData[key];
          document.getElementById('plat-toxic').innerText = d.t;
          document.getElementById('plat-damage').innerText = d.d;
          document.getElementById('plat-cure').innerText = d.c;
        }
        loadPlatitude('reason');
      </script>
    `
  },

  // 49. Spoon Theory Energy Budgeter
  {
    slug: 'spoon-theory-energy-budget',
    title: 'Spoon Theory Daily Energy Budgeter [Miserandino Chronic Illness Model]',
    metaDesc: "Interactive Spoon Theory daily energy calculator for chronic illness, neurodivergence, and executive fatigue. Track metabolic spoons and prevent spoon debt flares.",
    category: 'Neurobiology & Mind',
    keywords: 'spoon theory calculator online, how many spoons do i have today, christine miserandino spoon theory, chronic fatigue energy planner, autistic burnout spoon budget',
    faqs: [
      { q: 'What is Spoon Theory?', a: 'Created by Christine Miserandino in 2003, Spoon Theory is a widely embraced disability and neurodivergence metaphor. Each spoon represents a finite unit of physical, emotional, or cognitive energy available in a single day, illustrating how chronic illness forces deliberate rationing of basic tasks that healthy individuals take for granted.' },
      { q: 'What is Spoon Debt?', a: 'Spoon debt occurs when you borrow spoons from tomorrow to survive today\'s demands. Operating in chronic spoon debt triggers physical pain flare-ups, immune crashes, and prolonged autistic or depressive burnout.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Spoon Theory Budgeter</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-blue">Chronic Illness & Neurodivergence</span>
            <span class="wb-badge badge-green">Miserandino Framework</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Spoon Theory Daily Energy Budgeter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Calculate your starting daily spoon allotment, track task expenditure, and protect yourself against post-exertional malaise and spoon debt.
          </p>
        </div>

        <div class="wb-card">
          <div class="grid-2">
            <div>
              <label class="field-label">Morning Physical / Sleep Baseline</label>
              <select id="sp-sleep" class="text-input" onchange="calcSpoons()">
                <option value="16">Well Rested, Low Pain (16 Spoons)</option>
                <option value="12" selected>Average Sleep, Mild Body Ache (12 Spoons)</option>
                <option value="8">Poor Sleep / Flare-Up Morning (8 Spoons)</option>
                <option value="5">Exhausted / Post-Exertional Crash (5 Spoons)</option>
              </select>
            </div>
            <div>
              <label class="field-label">Live Spoon Balance</label>
              <div id="sp-balance" style="font-size:2rem; font-family:var(--mono); font-weight:700; color:#3b82f6;">12 / 12 Remaining</div>
            </div>
          </div>

          <h4 style="font-family:var(--serif); font-size:1.05rem; margin:1.5rem 0 0.75rem 0;">Check Activities Completed Today</h4>
          <div id="sp-taskList" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem;"></div>
        </div>

        <div class="wb-card" id="sp-status-card" style="background:var(--surface-alt);">
          <div id="sp-verdict" style="font-size:0.95rem; line-height:1.6; color:var(--fg);"></div>
        </div>
      </div>
      <script>
        var spoonActivities = [
          { name: "Getting out of bed & dressed", cost: 1 },
          { name: "Taking a shower & washing hair", cost: 2 },
          { name: "Making a meal from scratch", cost: 3 },
          { name: "Commuting in traffic / public transit", cost: 2 },
          { name: "4 hours of focused screen work", cost: 4 },
          { name: "Grocery shopping in fluorescent store", cost: 3 },
          { name: "Difficult emotional/social conversation", cost: 4 },
          { name: "Cleaning apartment / doing laundry", cost: 3 },
          { name: "Doctor visit / medical appointment", cost: 3 }
        ];

        var spBox = document.getElementById('sp-taskList');
        if (spBox) {
          var sph = '';
          for (var i = 0; i < spoonActivities.length; i++) {
            sph += '<label style="display:flex; align-items:center; gap:0.5rem; font-size:0.88rem; padding:0.5rem; background:var(--bg); border:1px solid var(--border); border-radius:4px; cursor:pointer;">' +
              '<input type="checkbox" class="sp-check" data-cost="' + spoonActivities[i].cost + '" onchange="calcSpoons()" />' +
              '<span>' + spoonActivities[i].name + ' <strong>(' + spoonActivities[i].cost + ' 🥄)</strong></span>' +
            '</label>';
          }
          spBox.innerHTML = sph;
        }

        function calcSpoons() {
          var base = parseInt(document.getElementById('sp-sleep').value, 10);
          var checks = document.querySelectorAll('.sp-check');
          var spent = 0;
          checks.forEach(function(c) {
            if (c.checked) spent += parseInt(c.getAttribute('data-cost'), 10);
          });
          var rem = base - spent;
          var balEl = document.getElementById('sp-balance');
          balEl.innerText = rem + ' / ' + base + ' Remaining';

          var vEl = document.getElementById('sp-verdict');
          if (rem > 3) {
            balEl.style.color = '#10b981';
            vEl.innerHTML = '<strong>Safe Energy Buffer:</strong> You have ' + rem + ' spoons remaining. You are pacing sustainably without pushing into post-exertional crash territory.';
          } else if (rem >= 0) {
            balEl.style.color = '#f59e0b';
            vEl.innerHTML = '<strong>Reserve Warning:</strong> Only ' + rem + ' spoons remaining. Cease non-essential tasks immediately. Prioritize quiet somatic rest, hydration, and early sleep.';
          } else {
            balEl.style.color = '#ef4444';
            vEl.innerHTML = '<strong style="color:#ef4444;">SPOON DEBT ALERT:</strong> You are ' + Math.abs(rem) + ' spoons in debt! You have borrowed physical energy from tomorrow. Expect post-exertional malaise (PEM), brain fog, or muscle fatigue. Cancel tomorrow\'s discretionary commitments now.';
          }
        }
        calcSpoons();
      </script>
    `
  },

  // 50. Inner Critic Voice Disarmer & Archetype Taxonomy
  {
    slug: 'inner-critic-taxonomy',
    title: 'Inner Critic Voice Disarmer & Archetype Taxonomy [Voice Dialogue Model]',
    metaDesc: "Identify which of the 5 Inner Critic Archetypes drives your self-doubt (The Perfectionist, Taskmaster, Underminer, Guilt-Tripper, Destroyer) with Socratic counters.",
    category: 'Neurobiology & Mind',
    keywords: 'inner critic test online, types of inner critic archetypes, how to silence inner critic, hal and sidra stone voice dialogue, cbt negative self-talk disarmer',
    faqs: [
      { q: 'What is the Inner Critic?', a: 'Formulated in psychology by Hal and Sidra Stone (Voice Dialogue) and Aaron Beck (Cognitive Therapy), the Inner Critic is an internalized sub-personality formed in childhood to protect you from abandonment or shame by preemptively attacking you before others can.' },
      { q: 'Why does fighting the Inner Critic fail?', a: 'Directly attacking your Inner Critic makes it louder, because its root motivation is survival fear. Disarming it requires acknowledging its protective intent while setting firm adult boundaries against its catastrophic lies.' }
    ],
    html: `
      <div class="article-container" style="max-width: 980px;">
        <nav class="nav-crumbs"><a href="/">Home</a> &gt; <a href="/neuro/">Neurobiology & Mind</a> &gt; Inner Critic Disarmer</nav>
        <div class="wb-header">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
            <span class="wb-badge badge-purple">Voice Dialogue</span>
            <span class="wb-badge badge-blue">Hal & Sidra Stone</span>
          </div>
          <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Inner Critic Voice Disarmer & Taxonomy</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;">
            Diagnose which specific Inner Critic archetype is running your self-talk and deploy precision cognitive boundary counters.
          </p>
        </div>

        <div class="wb-card">
          <h3 style="font-size:1.15rem; font-family:var(--serif); margin-bottom:1rem;">Select Your Dominant Negative Thought Loop</h3>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem;">
            <button class="btn-sec" onclick="loadCritic('perf')">1. &quot;You made a mistake; you're a fraud&quot; (Perfectionist)</button>
            <button class="btn-sec" onclick="loadCritic('task')">2. &quot;You are lazy; rest is dangerous&quot; (Taskmaster)</button>
            <button class="btn-sec" onclick="loadCritic('under')">3. &quot;Don't try; you'll just embarrass yourself&quot; (Underminer)</button>
            <button class="btn-sec" onclick="loadCritic('guilt')">4. &quot;You're selfish; you hurt everyone&quot; (Guilt-Tripper)</button>
            <button class="btn-sec" onclick="loadCritic('dest')">5. &quot;You are inherently flawed and unlovable&quot; (Destroyer)</button>
          </div>

          <div style="padding:1.5rem; background:var(--surface-alt); border-radius:6px; border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span id="critic-archetype" style="font-family:var(--serif); font-size:1.3rem; font-weight:700; color:#8b5cf6;">The Perfectionist</span>
              <span id="critic-badge" class="wb-badge badge-purple">Flaw Intolerant</span>
            </div>
            <div style="margin-bottom:1rem;">
              <span class="field-label">Childhood Protective Intent</span>
              <p id="critic-intent" style="font-size:0.92rem; line-height:1.5; color:var(--text-muted); margin:0;">-</p>
            </div>
            <div>
              <span class="field-label" style="color:#10b981;">Adult Self-Leadership Boundary Counter</span>
              <div id="critic-counter" style="padding:1rem; background:var(--bg); border-left:4px solid #10b981; font-size:0.95rem; line-height:1.6; color:var(--fg); font-weight:500;">-</div>
            </div>
          </div>
        </div>
      </div>
      <script>
        var criticData = {
          perf: {
            name: "The Perfectionist",
            badge: "Flaw Intolerant",
            intent: "Formed in an environment where mistakes were met with harsh criticism, mockery, or loss of affection. It believes that if you are 100% flawless, nobody can hurt or reject you.",
            counter: '"Thank you for trying to keep me safe from criticism. But I am an adult now. Mistakes are how human beings learn. Perfection is a mirage that paralyzes output. Done is better than perfect, and I accept my humanity."'
          },
          task: {
            name: "The Taskmaster",
            badge: "Compulsive Urgency",
            intent: "Believes your entire worth as a human is tied to your productivity and accomplishments. It fears that if you ever stop working or rest, you will become a lazy failure and get abandoned.",
            counter: '"Rest is not a reward I have to earn; it is a biological requirement for my nervous system. I am valuable because I exist, not because of how many checklist items I completed today. I am taking a break right now."'
          },
          under: {
            name: "The Underminer",
            badge: "Risk Aversion",
            intent: "Attempts to keep your ego safe by convincing you not to take risks, apply for promotions, or speak up. Its motto: 'If you never try, you can never fail publicly.'",
            counter: '"I hear that you are afraid of me being hurt or humiliated. But playing small is a guaranteed slow-motion failure. I am resilient enough to handle awkwardness or rejection. I am taking the leap anyway."'
          },
          guilt: {
            name: "The Guilt-Tripper",
            badge: "Hyper-Responsibility",
            intent: "Conditioned in families where you were parentified or made responsible for other people's emotional comfort. It attacks you whenever you set a healthy personal boundary.",
            counter: '"I am responsible FOR my own choices and boundaries; I am not responsible FOR other adults\' emotional reactions to my boundaries. Setting limits is not an act of selfishness; it is an act of integrity."'
          },
          dest: {
            name: "The Destroyer",
            badge: "Core Shame",
            intent: "The most wounded, extreme critic. Internalized from chronic emotional neglect or severe early shaming. It attacks your fundamental right to exist, trying to crush you so you become invisible and avoid further pain.",
            counter: '"Thought-stopping. I refuse to attack my own soul. That harsh voice belongs to the hurt people who shamed me in childhood; it does not belong to my true Self. I am safe, I am worthy, and I have a right to take up space in this world."'
          }
        };

        function loadCritic(key) {
          var c = criticData[key];
          document.getElementById('critic-archetype').innerText = c.name;
          document.getElementById('critic-badge').innerText = c.badge;
          document.getElementById('critic-intent').innerText = c.intent;
          document.getElementById('critic-counter').innerText = c.counter;
        }
        loadCritic('perf');
      </script>
    `
  }
];
