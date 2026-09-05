// scripts/text_tools.js - Text & Writing Tools Suite for Digital Tools Shed

export function buildTextToolsSuite({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const textDist = join(DIST, 'text');
  ensureDir(textDist);

  const commonStyle = `
    <style>
      .tool-box { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0; }
      .field-group { margin-bottom: 1.25rem; }
      .field-label { display: block; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; font-weight: 600; }
      .code-input, .text-input { width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 0.9rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; }
      .btn-primary { background: var(--btn-bg, #3b82f6); color: var(--btn-fg, #fff); border: none; padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: opacity 0.2s; }
      .btn-primary:hover { opacity: 0.9; }
      .btn-sec { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; }
      .btn-sec:hover { background: var(--surface-alt); }
      .action-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; align-items: center; }
      .result-box { background: var(--surface-alt); border: 1px solid var(--border); padding: 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.9rem; margin-top: 1rem; color: var(--fg); }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; margin-top: 1rem; }
      .stat-card { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.75rem; border-radius: 4px; text-align: center; }
      .stat-num { font-family: var(--mono); font-size: 1.4rem; font-weight: bold; color: var(--btn-bg, #3b82f6); }
      .stat-lbl { font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.2rem; }
      .grid-options { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 0.5rem; }
      .opt-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer; color: var(--fg); }
    </style>
  `;

  const tools = [
    {
      slug: 'word-counter',
      title: 'Word Counter & Character Counter',
      metaDesc: 'Accurate live word, character, sentence, paragraph, and reading time counter with density analysis and zero uploads.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Word Counter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Word Counter &amp; Character Diagnostic Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Real-time word, character, sentence, paragraph, syllable, and reading time metrics for writers, students, and SEO copywriters.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Input Text</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleText()">Load Sample Prose</button>
              </div>
              <textarea id="wc-input" class="code-input" style="height: 220px; font-family: sans-serif; font-size: 1rem; resize: vertical;" placeholder="Paste or type text here..." oninput="calcWordStats()"></textarea>
            </div>

            <div class="stat-grid">
              <div class="stat-card"><div class="stat-num" id="s-words">0</div><div class="stat-lbl">Words</div></div>
              <div class="stat-card"><div class="stat-num" id="s-chars">0</div><div class="stat-lbl">Characters</div></div>
              <div class="stat-card"><div class="stat-num" id="s-chars-nospace">0</div><div class="stat-lbl">No Spaces</div></div>
              <div class="stat-card"><div class="stat-num" id="s-sentences">0</div><div class="stat-lbl">Sentences</div></div>
              <div class="stat-card"><div class="stat-num" id="s-paragraphs">0</div><div class="stat-lbl">Paragraphs</div></div>
              <div class="stat-card"><div class="stat-num" id="s-reading">0 min</div><div class="stat-lbl">Reading Time</div></div>
              <div class="stat-card"><div class="stat-num" id="s-speaking">0 min</div><div class="stat-lbl">Speaking Time</div></div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyWordStats" onclick="copyWordStatsReport()" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Word Count Diagnostic Report</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearInput()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear Text</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Word Counting Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Word Counting, Typography &amp; Natural Language Processing</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Unicode Surrogate Pairs &amp; Multi-Byte Emoji Length Distortion</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In JavaScript, <code>string.length</code> measures 16-bit code units rather than grapheme clusters. A single compound emoji (e.g. 👨‍👩‍👧‍👦 or country flags) consumes 7 to 11 code units instead of 1. Systems enforcing character caps (e.g. SMS 160 chars or social media limits) prematurely truncate user copy unless grapheme clusters are counted via <code>Intl.Segmenter</code>.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Hyphenated Compound Words &amp; Tokenization Discrepancies</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Splitting words naively with <code>\s+</code> treats hyphenated terms (e.g. "state-of-the-art" or "co-founder") as a single word, whereas Microsoft Word counts it as 4 words and Google Docs counts it as 1. Academic essay submissions and legal briefs frequently trigger penalties due to divergent tokenizer rules.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Non-Breaking (&amp;nbsp;) &amp; Zero-Width Space Phantom Counts</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Text copied from web CMS editors or PDFs often contains non-breaking spaces (<code>\u00A0</code>), zero-width spaces (<code>\u200B</code>), or soft hyphens (<code>\u00AD</code>). Standard ASCII space matchers fail to detect them, artificially inflating word counts or creating phantom word breaks that ruin typography layouts.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Reading Speed Velocity Oversimplification (200 WPM Myth)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Assuming a flat 200 words-per-minute reading speed fails for dense technical, medical, or legal literature where cognitive processing drops comprehension speed to 75-100 WPM. Rehearsing presentations or calculating video voiceover scripts with generic reading formulas results in major pacing desynchronizations.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Sentence Boundary Ambiguity &amp; Abbreviation False Breaks</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Counting sentence-ending periods naively (<code>/[.!?]/</code>) triggers false sentence breaks on honorifics ("Dr.", "Mrs."), geographic abbreviations ("U.S.A.", "e.g."), and decimal figures ("3.14"). This skews readability formulas like Flesch-Kincaid Grade Level and Coleman-Liau indices.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window.calcWordStats = function() {
            var text = document.getElementById('wc-input') ? document.getElementById('wc-input').value : '';
            var words = text.trim() ? text.trim().split(/\s+/).length : 0;
            var chars = text.length;
            var charsNoSpace = text.replace(/\s/g, '').length;
            var sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || [1]).length : 0;
            var paragraphs = text.trim() ? text.split(/\n+/).filter(function(p) { return p.trim().length > 0; }).length : 0;

            var readMins = Math.ceil(words / 200);
            var speakMins = Math.ceil(words / 130);
            var avgWordLen = words > 0 ? (charsNoSpace / words).toFixed(1) : 0;

            document.getElementById('s-words').textContent = words.toLocaleString();
            document.getElementById('s-chars').textContent = chars.toLocaleString();
            document.getElementById('s-chars-nospace').textContent = charsNoSpace.toLocaleString();
            document.getElementById('s-sentences').textContent = sentences.toLocaleString();
            document.getElementById('s-paragraphs').textContent = paragraphs.toLocaleString();
            document.getElementById('s-reading').textContent = readMins + (readMins === 1 ? ' min' : ' mins');
            document.getElementById('s-speaking').textContent = speakMins + (speakMins === 1 ? ' min' : ' mins');

            window._wordStatsData = {
              words: words,
              chars: chars,
              charsNoSpace: charsNoSpace,
              sentences: sentences,
              paragraphs: paragraphs,
              readMins: readMins,
              speakMins: speakMins,
              avgWordLen: avgWordLen
            };
          };

          window.copyWordStatsReport = function() {
            if (!window._wordStatsData) calcWordStats();
            var d = window._wordStatsData;

            var text = '📝 Text & Word Count Diagnostic Report\n' +
              '• Total Words: ' + d.words.toLocaleString() + '\n' +
              '• Characters (with spaces): ' + d.chars.toLocaleString() + '\n' +
              '• Characters (without spaces): ' + d.charsNoSpace.toLocaleString() + '\n' +
              '• Sentences: ' + d.sentences + '\n' +
              '• Paragraphs: ' + d.paragraphs + '\n' +
              '• Average Word Length: ' + d.avgWordLen + ' chars\n' +
              '• Estimated Reading Time (200 WPM): ' + d.readMins + ' min\n' +
              '• Estimated Speaking Time (130 WPM): ' + d.speakMins + ' min\n\n' +
              'Calculated at digitaltoolsshed.com/text/word-counter';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyWordStats');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Word Stats Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.clearInput = function() {
            var inp = document.getElementById('wc-input');
            if (inp) inp.value = '';
            calcWordStats();
          };

          window.loadSampleText = function() {
            var sample = "Digital Tools Shed provides blindingly fast, pure client-side developer, mathematical, and health utilities. With zero external CDN bloat and sub-50 millisecond response latencies, every tool guarantees absolute privacy and uninterrupted offline execution. Whether optimizing CSS stylesheets, calculating complex network subnets, or analyzing text readability, the platform combines rigorous precision with instant utility.";
            document.getElementById('wc-input').value = sample;
            calcWordStats();
          };

          document.addEventListener('DOMContentLoaded', calcWordStats);
        </script>
      `
    },
    {
      slug: 'lorem-ipsum',
      title: 'Lorem Ipsum Dummy Text Generator',
      metaDesc: 'Generate customizable Lorem Ipsum placeholder dummy text by paragraphs, sentences, or word count with instant 1-click copy.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Lorem Ipsum Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Lorem Ipsum Dummy Text Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Generate customizable Latin placeholder text for UI wireframes, graphic designs, and web layouts by paragraphs, sentences, or word count.
          </p>

          <div class="tool-box">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
              <div class="field-group">
                <label class="field-label">Count</label>
                <input type="number" id="lorem-count" class="text-input" min="1" max="50" value="3" oninput="genLorem()" />
              </div>
              <div class="field-group">
                <label class="field-label">Unit Type</label>
                <select id="lorem-type" class="text-input" onchange="genLorem()">
                  <option value="paragraphs">Paragraphs</option>
                  <option value="sentences">Sentences</option>
                  <option value="words">Words</option>
                </select>
              </div>
              <div class="field-group" style="display: flex; align-items: flex-end; padding-bottom: 0.5rem;">
                <label class="opt-label"><input type="checkbox" id="lorem-start" checked onchange="genLorem()"> Start with 'Lorem ipsum'</label>
              </div>
            </div>

            <div class="action-bar" style="margin-top: 1rem;">
              <button type="button" class="btn-primary" onclick="genLorem()">&#x21BA; Generate Lorem Ipsum</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Generated Placeholder Text</label>
                <span id="loremStats" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">0 words</span>
              </div>
              <textarea id="lorem-output" class="code-input" style="height: 250px; font-family: sans-serif; font-size: 0.95rem; line-height: 1.6;" readonly></textarea>
            </div>

            <!-- Copy Button -->
            <button type="button" id="btnCopyLorem" onclick="copyLoremText()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy Lorem Ipsum to Clipboard</span>
            </button>
          </div>

          <!-- 5 Critical Lorem Ipsum Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Placeholder Text &amp; UI Mockups</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Accidental Production Deployment &amp; Search Engine Indexation</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Deploying websites containing placeholder Latin text to public production servers results in Google indexing "Lorem ipsum dolor sit amet" across title tags and meta descriptions. This permanently damages organic SEO brand authority and signals unpolished, amateur software to prospective customers.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. German &amp; Finnish Word-Length Layout Ruptures</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Latin placeholder words average 5.5 characters per token. In heavily compounded languages like German, Finnish, or Hungarian, standard words frequently exceed 25 to 35 characters. UI cards, nav bars, and buttons designed exclusively with Lorem Ipsum break, clip, or overflow violently once translated into localized European languages.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Accessibility &amp; Screen Reader Evaluation Masking</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Testing web accessibility (a11y) with screen readers (NVDA, VoiceOver) while using Latin placeholder text obscures reading order, phonetic pronounciation issues, and heading hierarchy errors. Screen readers attempt to pronounce Latin pseudo-words phonetically, making it impossible to audit auditory semantic clarity.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Translation Memory &amp; TMS Token Billing Pollution</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Importing design files (Figma, Sketch) containing dummy Lorem Ipsum into automated localization platforms (Crowdin, Lokalise, Smartling) pollutes enterprise Translation Memories with thousands of useless Latin segments, inflating per-word localization agency invoices unnecessarily.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Optical Texture &amp; Contrast Heuristic Misjudgments</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Latin prose exhibits an unusually uniform distribution of character heights and lacks modern punctuation marks (quotes, brackets, currency signs, numbers). This gives designers an artificially clean "typographic grayness" that shatters when authentic, messy user-generated content is loaded.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var LOREM_WORDS = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"];

          function getRandomWord() {
            return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
          }

          function makeSentence(numWords) {
            numWords = numWords || 10;
            var arr = [];
            for (var i = 0; i < numWords; i++) arr.push(getRandomWord());
            var s = arr.join(' ');
            return s.charAt(0).toUpperCase() + s.slice(1) + '.';
          }

          function makeParagraph(numSentences) {
            numSentences = numSentences || 5;
            var arr = [];
            for (var i = 0; i < numSentences; i++) arr.push(makeSentence(Math.floor(Math.random() * 8) + 8));
            return arr.join(' ');
          }

          window.genLorem = function() {
            var count = parseInt(document.getElementById('lorem-count').value, 10) || 3;
            var type = document.getElementById('lorem-type').value;
            var startLorem = document.getElementById('lorem-start').checked;

            var result = [];
            if (type === 'words') {
              for (var i = 0; i < count; i++) result.push(getRandomWord());
              if (startLorem && result.length >= 2) {
                result[0] = 'lorem';
                result[1] = 'ipsum';
              }
              document.getElementById('lorem-output').value = result.join(' ');
              document.getElementById('loremStats').textContent = count + ' words';
              return;
            }

            if (type === 'sentences') {
              for (var j = 0; j < count; j++) result.push(makeSentence(10));
            } else {
              for (var k = 0; k < count; k++) result.push(makeParagraph(5));
            }

            if (startLorem && result.length > 0) {
              result[0] = result[0].replace(/^[A-Z][a-z]+ [a-z]+/, 'Lorem ipsum');
              if (!result[0].startsWith('Lorem ipsum')) {
                result[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + result[0];
              }
            }

            var text = result.join('\n\n');
            document.getElementById('lorem-output').value = text;
            var wordCount = text.trim().split(/\s+/).length;
            document.getElementById('loremStats').textContent = wordCount + ' words';
          };

          window.copyLoremText = function() {
            var val = document.getElementById('lorem-output') ? document.getElementById('lorem-output').value : '';
            if (!val) { genLorem(); val = document.getElementById('lorem-output').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyLorem');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Lorem Ipsum Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', genLorem);
        </script>
      `
    },
    {
      slug: 'case-converter',
      title: 'Text Case Converter',
      metaDesc: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase instantly.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Case Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Text Case Converter &amp; String Formatter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert any text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Input Text</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleCase()">Load Sample Text</button>
              </div>
              <textarea id="case-input" class="code-input" style="height: 150px; font-size: 1rem;" placeholder="Type or paste text to convert..."></textarea>
            </div>

            <!-- Case Transformation Buttons Bar -->
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin: 1rem 0;">
              <button type="button" class="btn-primary" onclick="convertCase('upper')">UPPERCASE</button>
              <button type="button" class="btn-primary" onclick="convertCase('lower')">lowercase</button>
              <button type="button" class="btn-primary" onclick="convertCase('title')">Title Case</button>
              <button type="button" class="btn-primary" onclick="convertCase('sentence')">Sentence case</button>
              <button type="button" class="btn-primary" onclick="convertCase('camel')">camelCase</button>
              <button type="button" class="btn-primary" onclick="convertCase('pascal')">PascalCase</button>
              <button type="button" class="btn-primary" onclick="convertCase('snake')">snake_case</button>
              <button type="button" class="btn-primary" onclick="convertCase('kebab')">kebab-case</button>
              <button type="button" class="btn-primary" onclick="convertCase('constant')">CONSTANT_CASE</button>
              <button type="button" class="btn-primary" onclick="convertCase('alternating')">aLtErNaTiNg</button>
            </div>

            <div class="field-group" style="margin-top: 1.25rem;">
              <label class="field-label">Converted Result</label>
              <textarea id="case-output" class="code-input" style="height: 150px; font-size: 1rem;" readonly></textarea>
            </div>

            <!-- Copy Button -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyCase" onclick="copyCaseText()" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Converted Text</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearCaseInputs()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Text Case Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Text Case Conversion &amp; Localization</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. The Turkish Dotted vs. Dotless 'I' Authentication Failure</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In Turkish, lowercase <code>i</code> uppercases to dotted <code>İ</code> (U+0130), while uppercase <code>I</code> lowercases to dotless <code>ı</code> (U+0131). Using naive <code>toUpperCase()</code> or <code>toLowerCase()</code> breaks username lookups, system logins, and case-insensitive SQL matching for Turkish users.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. German Eszett (ß) Uppercase Expansion Irreversibility</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  The German lowercase letter <code>ß</code> (eszett) uppercases to <code>SS</code>. Converting back with <code>toLowerCase()</code> produces <code>ss</code> instead of <code>ß</code>, altering semantic word definitions (e.g. <em>Masse</em> meaning mass vs. <em>Maße</em> meaning dimensions). Case-folding German strings without locale sensitivity irreversibly mutates spellings.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Title Case Preposition &amp; Conjunction Capitalization Flaws</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Naive title casing capitalizes every word indiscriminately (e.g. "War And Peace In The 21st Century"). Major editorial style guides (Chicago Manual of Style, AP, MLA) mandate that short articles, prepositions, and coordinating conjunctions (<em>a, an, and, but, for, in, of, on, the, to</em>) remain lowercase unless positioned as the first or last word.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Consecutive Acronym Collisions in camelCase &amp; snake_case</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Transforming variable names with consecutive uppercase abbreviations (e.g. <code>getHTMLHTTPRequest</code>) with primitive regexes fragments acronyms into isolated letters (<code>get_h_t_m_l_h_t_t_p_request</code>). Production programmatic case converters must preserve cohesive acronym groups (<code>get_html_http_request</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Diacritical Stripping &amp; Accent Loss in ASCII Conversions</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Converting accented European characters (e.g. <em>café, mañana, Zürich</em>) using ASCII-only regular expressions strips umlauts, tildes, and acute accents completely. This corrupts international customer names, shipping labels, and multi-currency invoices.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window.convertCase = function(type) {
            var input = document.getElementById('case-input');
            var str = input ? input.value : '';
            if (!str) return;

            var out = '';

            switch(type) {
              case 'upper':
                out = str.toUpperCase();
                break;
              case 'lower':
                out = str.toLowerCase();
                break;
              case 'title':
                var minorWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|via|vs)$/i;
                var words = str.toLowerCase().split(/\s+/);
                out = words.map(function(w, idx) {
                  if (idx > 0 && idx < words.length - 1 && minorWords.test(w)) return w;
                  return w.charAt(0).toUpperCase() + w.slice(1);
                }).join(' ');
                break;
              case 'sentence':
                out = str.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, function(m, p1, p2) {
                  return p1 + p2.toUpperCase();
                });
                break;
              case 'camel':
                out = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(m, chr) {
                  return chr.toUpperCase();
                }).replace(/[^a-zA-Z0-9]/g, '');
                break;
              case 'pascal':
                var camel = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(m, chr) {
                  return chr.toUpperCase();
                }).replace(/[^a-zA-Z0-9]/g, '');
                out = camel.charAt(0).toUpperCase() + camel.slice(1);
                break;
              case 'snake':
                out = str.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
                break;
              case 'kebab':
                out = str.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                break;
              case 'constant':
                out = str.trim().toUpperCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
                break;
              case 'alternating':
                out = str.split('').map(function(c, i) {
                  return i % 2 === 0 ? c.toLowerCase() : c.toUpperCase();
                }).join('');
                break;
            }

            document.getElementById('case-output').value = out;
          };

          window.copyCaseText = function() {
            var val = document.getElementById('case-output') ? document.getElementById('case-output').value : '';
            if (!val) {
              convertCase('title');
              val = document.getElementById('case-output').value;
            }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyCase');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Converted Text Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.clearCaseInputs = function() {
            document.getElementById('case-input').value = '';
            document.getElementById('case-output').value = '';
          };

          window.loadSampleCase = function() {
            var sample = "the state-of-the-art web platform for modern engineers and designers in 2026!";
            document.getElementById('case-input').value = sample;
            convertCase('title');
          };

          document.addEventListener('DOMContentLoaded', function() {
            var inp = document.getElementById('case-input');
            if (inp && inp.value) convertCase('title');
          });
        </script>
      `
    },
    {
      slug: 'slug-generator',
      title: 'URL Slug Generator',
      metaDesc: 'Generate clean, SEO-friendly URL slugs from blog post titles, product names, and headline strings with custom separators.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; URL Slug Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">URL Slug Generator &amp; SEO Permalinker</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert headlines, product titles, and article names into clean, URL-safe, SEO-friendly permalink slugs with diacritic normalization and stop-word controls.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input Title / Headline</label>
              <input type="text" id="slug-in" class="text-input" value="10 Best Modern Web Development Tools for 2026 &amp; Beyond!" oninput="makeSlug()" />
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
              <div class="field-group">
                <label class="field-label">Separator</label>
                <select id="slug-sep" class="text-input" onchange="makeSlug()">
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=".">Dot (.)</option>
                </select>
              </div>
              <div class="field-group" style="display: flex; align-items: flex-end; padding-bottom: 0.5rem;">
                <label class="opt-label"><input type="checkbox" id="slug-stop" onchange="makeSlug()"> Remove Stop Words (a, the, in, for)</label>
              </div>
            </div>

            <div class="field-group" style="margin-top: 1rem;">
              <label class="field-label">Generated URL Slug</label>
              <input type="text" id="slug-out" class="code-input" style="font-size: 1.1rem; font-weight: bold; color: var(--fg); height: 48px;" readonly />
            </div>

            <!-- Copy Button -->
            <button type="button" id="btnCopySlug" onclick="copySlugResult()" class="btn-sec" style="margin-top: 1.25rem; width: 100%; padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
              <span>📋 Copy URL Slug</span>
            </button>
          </div>

          <!-- 5 Critical URL Slug Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in URL Slug Architecture &amp; SEO Routing</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Changing Established Slugs without 301 Permanent Redirects</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Modifying the URL slug of a published article breaks all external backlinks, bookmarks, and search index rankings, immediately throwing 404 Not Found errors. If a slug must be altered, configure an immediate server-side HTTP 301 redirect from the legacy slug to preserve link equity (PageRank).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Total Obliteration of CJK &amp; Non-Latin International Characters</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Blindly stripping characters with <code>/[^a-z0-9]+/g</code> erases 100% of Chinese, Japanese, Korean, Arabic, and Hebrew characters, leaving completely blank URL slugs for international titles. Multilingual platforms must either transliterate to Latin phonetics (e.g. Pinyin or Romaji) or allow valid UTF-8 percent-encoded path segments.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Stop-Word Removal Causing Semantic Inversion Disasters</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Aggressive stop-word filters that strip words like "no", "not", or "to" invert the fundamental meaning of article titles: e.g. "say-no-to-drugs" turns into <code>say-drugs</code>, or "to-be-or-not-to-be" turns into an empty slug. Always review stripped slugs for semantic distortion.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Consecutive Separators &amp; Punctuation Bloat</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Titles with symbols (e.g. "Rock &amp; Roll -- The 100% Definitive Guide") that replace every symbol with hyphens produce ugly multi-hyphen slugs (<code>rock---roll---the-100--definitive-guide</code>). High-ranking algorithms penalize excessive hyphenation as search manipulation spam.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Database Slug Uniqueness Collisions in CMS Records</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Two distinct blog posts published under identical titles (e.g. "Weekly Company Update") produce duplicate slugs, triggering database unique constraint crashes. Production CMS architectures must automatically verify database slug collisions and append incremental suffixes (e.g. <code>-2</code>).
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var STOP_WORDS = new Set(["a","an","and","are","as","at","be","but","by","for","if","in","into","is","it","no","not","of","on","or","such","that","the","their","then","there","these","they","this","to","was","will","with"]);

          window.makeSlug = function() {
            var val = (document.getElementById('slug-in') ? document.getElementById('slug-in').value : '') || '';
            var sep = document.getElementById('slug-sep') ? document.getElementById('slug-sep').value : '-';
            var rmStop = document.getElementById('slug-stop') ? document.getElementById('slug-stop').checked : false;

            // Diacritic normalization
            val = val.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            var words = val.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);

            if (rmStop) {
              words = words.filter(function(w) { return !STOP_WORDS.has(w); });
            }

            var slug = words.join(sep);
            document.getElementById('slug-out').value = slug;
          };

          window.copySlugResult = function() {
            var val = document.getElementById('slug-out') ? document.getElementById('slug-out').value : '';
            if (!val) { makeSlug(); val = document.getElementById('slug-out').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopySlug');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Slug Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          document.addEventListener('DOMContentLoaded', makeSlug);
        </script>
      `
    },
    {
      slug: 'fancy-text',
      title: 'Fancy Unicode Text Generator',
      metaDesc: 'Convert plain text into aesthetic Unicode fonts: gothic, fraktur, bold, cursive script, boxed, and circled fonts for social media.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Fancy Text Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Fancy Unicode Text Generator &amp; Typographic Styler</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Transform plain text into aesthetic Unicode fonts: gothic fraktur, bold sans, blackboard bold, cursive script, boxed, and circled fonts with instant clipboard copy.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Input Text</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleFancy()">Load Sample</button>
              </div>
              <input type="text" id="fancy-in" class="text-input" value="Digital Tools Shed" oninput="genFancy()" style="font-size: 1.1rem; height: 48px;" />
            </div>

            <!-- Master Action Buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; margin-bottom: 1.25rem;">
              <button type="button" id="btnCopyAllFancy" onclick="copyAllFancy()" class="btn-sec" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy All Font Styles Report</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearFancyInput()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear Text</span>
              </button>
            </div>

            <div id="fancy-results" style="display: flex; flex-direction: column; gap: 0.75rem;"></div>
          </div>

          <!-- 5 Critical Fancy Text Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Fancy Unicode Fonts &amp; Typographic Glyphs</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Accessibility &amp; Screen Reader Phonetic Catastrophes</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Screen readers (VoiceOver, NVDA, TalkBack) pronounce Mathematical Alphanumeric Symbols literally: e.g. <code>𝔈𝔵𝔞𝔪𝔭𝔩𝔢</code> is vocalized as <em>"Mathematical Fraktur Capital E, Mathematical Fraktur Small X, Mathematical Fraktur Small A..."</em> rather than the word "Example". Using styled fonts in bios and headlines completely locks out visually impaired users.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Search Engine Indexation &amp; Keyword Obliteration</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Search crawlers (Googlebot, Bingbot) and social platform hashtag indexes do not equate Unicode mathematical symbols with standard ASCII Latin letters. Brand names, social bios, and titles composed in fancy fonts become 100% unsearchable in search bars and search result pages.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Cross-Platform Font Fallback Tofu Box Disasters</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Older Android operating systems, enterprise Windows installations, and low-spec smart devices lack comprehensive font glyph coverage for Unicode Supplementary Multilingual Plane (Plane 1). Users on these devices see unsightly empty rectangles (tofu characters) instead of styled letters.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Social Media Username &amp; Anti-Spoofing Policy Bans</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Major platforms (Discord, Twitter/X, GitHub, Steam) actively restrict or sanitize Unicode mathematical and homoglyph characters in handles and usernames. Attempting to register accounts with decorative symbols triggers immediate validation rejections or automated anti-impersonation shadowbans.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Normalization Form Collapses (NFKD / NFKC Deconstruction)</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Modern databases, CMS caching layers, and sanitized REST APIs routinely apply Unicode Compatibility Decomposition (<code>NFKD</code>/<code>NFKC</code>) during database inserts. This silently strips all mathematical styling and collapses the text back to standard ASCII upon saving.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var FONTS = [
            { id: 'fraktur', name: 'Fraktur / Gothic', map: { a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷',A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝔒',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'} },
            { id: 'bold', name: 'Bold Sans', map: { a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭',0:'𝟬',1:'𝟭',2:'𝟮',3:'𝟯',4:'𝟰',5:'𝟱',6:'𝟲',7:'𝟳',8:'𝟴',9:'𝟵'} },
            { id: 'blackboard', name: 'Double Struck / Blackboard', map: { a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫',A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ'} },
            { id: 'script', name: 'Cursive / Script', map: { a:'𝒶',b:'𝒷',c:'𝒸',d:'𝒹',e:'𝑒',f:'𝒻',g:'𝑔',h:'𝒽',i:'𝒾',j:'𝒿',k:'𝓀',l:'𝓁',m:'𝓂',n:'𝓃',o:'𝑜',p:'𝓅',q:'𝓆',r:'𝓇',s:'𝓈',t:'𝓉',u:'𝓊',v:'𝓋',w:'𝓌',x:'𝓍',y:'𝓎',z:'𝓏',A:'𝒜',B:'𝐵',C:'𝒞',D:'𝒟',E:'𝐸',F:'𝐹',G:'𝒢',H:'𝐻',I:'𝐼',J:'𝒥',K:'𝒦',L:'𝒱',M:'𝑀',N:'𝒩',O:'𝒪',P:'𝒫',Q:'𝒬',R:'𝑅',S:'𝒮',T:'𝒯',U:'𝒰',V:'𝒱',W:'𝒲',X:'𝒳',Y:'𝒴',Z:'𝒵'} },
            { id: 'circled', name: 'Circled / Bubble', map: { a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',A:'Ⓐ',B:'Ⓑ',C:'Ⓒ',D:'Ⓓ',E:'Ⓔ',F:'Ⓕ',G:'Ⓖ',H:'Ⓗ',I:'Ⓘ',J:'Ⓙ',K:'Ⓚ',L:'Ⓛ',M:'Ⓜ',N:'Ⓝ',O:'Ⓞ',P:'⅌',Q:'Ⓠ',R:'Ⓡ',S:'Ⓢ',T:'Ⓣ',U:'Ⓤ',V:'Ⓥ',W:'𝓌',X:'𝓍',Y:'Ⓨ',Z:'Ⓩ',0:'⓪',1:'①',2:'②',3:'③',4:'④',5:'⑤',6:'⑥',7:'⑦',8:'⑧',9:'⑨'} },
            { id: 'boxed', name: 'Squared / Boxed', map: { a:'🄰',b:'🄱',c:'🄲',d:'🄳',e:'🄴',f:'🄵',g:'🄶',h:'🄷',i:'🄸',j:'🄹',k:'🄺',l:'🄻',m:'🄼',n:'🄽',o:'🄾',p:'🄿',q:'🅀',r:'🅁',s:'🅂',t:'🅃',u:'🅄',v:'🅅',w:'🅆',x:'🅇',y:'🅈',z:'🅉',A:'🄰',B:'🄱',C:'🄲',D:'🄳',E:'🄴',F:'🄵',G:'🄶',H:'🄷',I:'🄸',J:'🄹',K:'🄺',L:'🄻',M:'🄼',N:'🄽',O:'🄾',P:'🄿',Q:'🅀',R:'🅁',S:'🅂',T:'🅃',U:'🅄',V:'🅅',W:'🅆',X:'🅇',Y:'🅈',Z:'🅉'} },
            { id: 'monospace', name: 'Monospace / Typewriter', map: { a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣',A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉',0:'𝟶',1:'𝟷',2:'𝟸',3:'𝟹',4:'𝟺',5:'𝟻',6:'𝟼',7:'𝟽',8:'𝟾',9:'𝟿'} },
            { id: 'smallcaps', name: 'Small Caps', map: { a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ꜰ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',S:'s',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'} }
          ];

          window._fancyResultsMap = {};

          window.genFancy = function() {
            var input = document.getElementById('fancy-in');
            var val = input ? input.value : '';
            var container = document.getElementById('fancy-results');
            if (!container) return;
            container.innerHTML = '';
            window._fancyResultsMap = {};

            FONTS.forEach(function(font, idx) {
              var converted = val.split('').map(function(c) { return font.map[c] || c; }).join('');
              window._fancyResultsMap[font.name] = converted;

              var row = document.createElement('div');
              row.style.cssText = 'background: var(--surface-alt); border: 1px solid var(--border); padding: 0.85rem 1rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; gap: 1rem;';
              
              var textWrap = document.createElement('div');
              textWrap.style.cssText = 'flex: 1; min-width: 0;';
              
              var title = document.createElement('div');
              title.style.cssText = 'font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 0.25rem;';
              title.textContent = font.name;
              
              var textVal = document.createElement('div');
              textVal.style.cssText = 'font-size: 1.15rem; color: var(--fg); word-break: break-all;';
              textVal.textContent = converted || '(Empty)';
              
              textWrap.appendChild(title);
              textWrap.appendChild(textVal);

              var btn = document.createElement('button');
              btn.type = 'button';
              btn.className = 'btn-primary';
              btn.style.cssText = 'flex-shrink: 0; padding: 0.4rem 0.85rem; font-size: 0.82rem;';
              btn.textContent = 'Copy';
              btn.onclick = function() {
                navigator.clipboard.writeText(converted).then(function() {
                  btn.innerHTML = '<span style="color:#10b981;">✓ Copied!</span>';
                  setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
                });
              };

              row.appendChild(textWrap);
              row.appendChild(btn);
              container.appendChild(row);
            });
          };

          window.copyAllFancy = function() {
            var val = document.getElementById('fancy-in') ? document.getElementById('fancy-in').value : '';
            if (!val) { genFancy(); }
            
            var text = '✨ Fancy Unicode Typographic Styler Report\n' +
              '• Original Text: "' + val + '"\n\n';

            for (var name in window._fancyResultsMap) {
              text += '• ' + name + ':\n  ' + window._fancyResultsMap[name] + '\n\n';
            }
            text += 'Generated at digitaltoolsshed.com/text/fancy-text';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyAllFancy');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ All Font Styles Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.clearFancyInput = function() {
            var inp = document.getElementById('fancy-in');
            if (inp) inp.value = '';
            genFancy();
          };

          window.loadSampleFancy = function() {
            var inp = document.getElementById('fancy-in');
            if (inp) inp.value = 'Quantum Computing & Modern Web Standards 2026';
            genFancy();
          };

          document.addEventListener('DOMContentLoaded', genFancy);
        </script>
      `
    },
    {
      slug: 'morse-code',
      title: 'Morse Code Translator & Audio Player',
      metaDesc: 'Translate text to Morse code and Morse code to English with real-time browser Web Audio API audio beeps.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Morse Code Translator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Morse Code Translator, Audio Keyer &amp; Prosign Decoder</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Translate text to International Morse Code and decode CW signals back to plain English with real-time Web Audio API beeps, WPM speed tuning, and prosign support.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Plain Text (English)</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleMorse()">Load Emergency CQ Sample</button>
              </div>
              <textarea id="morse-text" class="code-input" style="height: 110px; font-size: 1rem;" placeholder="Type English text..." oninput="textToMorse()"></textarea>
            </div>

            <div class="field-group" style="margin-top: 1rem;">
              <label class="field-label">Morse Code (Dots &amp; Dashes)</label>
              <textarea id="morse-code" class="code-input" style="height: 110px; font-family: var(--mono); font-size: 1.05rem; letter-spacing: 1px;" placeholder="e.g. ... --- ..." oninput="morseToText()"></textarea>
            </div>

            <!-- Audio Tuning Controls -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 1.25rem 0; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
              <div class="field-group" style="margin: 0;">
                <label class="field-label" style="display: flex; justify-content: space-between;">
                  <span>Transmission Speed</span>
                  <span id="wpm-val" style="font-family: var(--mono); color: var(--fg); font-weight: bold;">18 WPM</span>
                </label>
                <input type="range" id="morse-wpm" min="5" max="35" value="18" style="width: 100%; cursor: pointer;" oninput="document.getElementById('wpm-val').textContent = this.value + ' WPM'" />
              </div>
              <div class="field-group" style="margin: 0;">
                <label class="field-label" style="display: flex; justify-content: space-between;">
                  <span>Audio Pitch / Tone</span>
                  <span id="hz-val" style="font-family: var(--mono); color: var(--fg); font-weight: bold;">700 Hz</span>
                </label>
                <input type="range" id="morse-hz" min="400" max="1000" step="50" value="700" style="width: 100%; cursor: pointer;" oninput="document.getElementById('hz-val').textContent = this.value + ' Hz'" />
              </div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
              <button type="button" id="btnPlayMorse" class="btn-primary" onclick="playMorseAudio()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span id="playIcon">▶</span> <span id="playLabel">Play Audio Beep Tone</span>
              </button>
              <button type="button" id="btnCopyMorse" class="btn-sec" onclick="copyMorseCode()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Morse Code</span>
              </button>
              <button type="button" id="btnCopyMorseText" class="btn-sec" onclick="copyMorseText()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Plain Text</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearMorseInputs()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Morse Code Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Morse Code, Telegraphy &amp; Audio Demodulation</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. ITU-R M.1677 Standard Timing Ratio Violations</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  International Morse adheres to strict ITU-R timing math: 1 dot = 1 unit, 1 dash = 3 units, intra-character space = 1 unit, inter-character space = 3 units, and inter-word space = 7 units. Naive software keyers that use arbitrary delay loops or fail the standard 1:3:7 formula create choppy, uncopyable CW on amateur radio bands.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. International (ITU) vs. American Railroad Morse Confusion</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Original American Morse (used on 19th-century landline telegraphs) differs radically from Continental/International ITU Morse. For example, in American Morse, the letter "C" is <code>.. .</code> (two dots, space, dot) and "O" is <code>. .</code>. Sending American Morse over maritime radio or modern aviation beacons causes catastrophic signal misinterpretation.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Prosign Fusion Errors &amp; Procedural Signal Splitting</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Procedural signals (prosigns) such as <code>SOS</code> (<code>...---...</code>), <code>AR</code> (end of message, <code>.-.-.</code>), and <code>SK</code> (end of contact, <code>...-.-</code>) are keyed as single continuous compound characters without the standard 3-unit inter-character gap. Splitting them into separate words (e.g. S O S) is technically invalid in emergency maritime distress protocols.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Modern Browser Web Audio API Autoplay Restrictions</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Chrome, Safari, and Firefox strictly enforce autoplay security policies that keep the browser <code>AudioContext</code> in a "suspended" state until a direct, user-initiated click or tap occurs. Any script attempting to synthesize Morse sidetones without first calling <code>audioCtx.resume()</code> fails silently with zero audio output.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Punctuation Collisions &amp; Slash Delimiter Ambiguities</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Informal text representations of Morse code frequently employ the forward slash (<code>/</code>) to demarcate word boundaries. However, the ITU character for a literal fraction slash is <code>-..-.</code>. Parsing raw Morse streams without explicit delimiter escaping scrambles radio callsigns and coordinate bearings.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var MORSE_MAP = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
            '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
            '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
            "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
            '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
            '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
          };

          var REVERSE_MORSE = {};
          for (var k in MORSE_MAP) {
            REVERSE_MORSE[MORSE_MAP[k]] = k;
          }

          var _audioCtx = null;
          var _isPlaying = false;
          var _stopAudioPlayback = false;

          function getAudioContext() {
            if (!_audioCtx) {
              var AudioContextClass = window.AudioContext || window.webkitAudioContext;
              if (AudioContextClass) _audioCtx = new AudioContextClass();
            }
            if (_audioCtx && _audioCtx.state === 'suspended') {
              _audioCtx.resume();
            }
            return _audioCtx;
          }

          window.textToMorse = function() {
            var val = document.getElementById('morse-text') ? document.getElementById('morse-text').value.toUpperCase() : '';
            var words = val.trim().split(/\s+/);
            var res = words.map(function(word) {
              return word.split('').map(function(c) { return MORSE_MAP[c] || ''; }).filter(Boolean).join(' ');
            }).join(' / ');

            document.getElementById('morse-code').value = res;
          };

          window.morseToText = function() {
            var val = document.getElementById('morse-code') ? document.getElementById('morse-code').value.trim() : '';
            if (!val) {
              document.getElementById('morse-text').value = '';
              return;
            }
            var words = val.split(/\s*\/\s*|\s{3,}/);
            var decoded = words.map(function(w) {
              return w.trim().split(/\s+/).map(function(code) {
                return REVERSE_MORSE[code] || '';
              }).join('');
            }).join(' ');

            document.getElementById('morse-text').value = decoded;
          };

          window.copyMorseCode = function() {
            var val = document.getElementById('morse-code') ? document.getElementById('morse-code').value : '';
            if (!val) { textToMorse(); val = document.getElementById('morse-code').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyMorse');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Morse Code Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.copyMorseText = function() {
            var val = document.getElementById('morse-text') ? document.getElementById('morse-text').value : '';
            if (!val) { morseToText(); val = document.getElementById('morse-text').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyMorseText');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Plain Text Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.playMorseAudio = function() {
            if (_isPlaying) {
              _stopAudioPlayback = true;
              return;
            }

            var code = document.getElementById('morse-code') ? document.getElementById('morse-code').value : '';
            if (!code) {
              textToMorse();
              code = document.getElementById('morse-code').value;
              if (!code) return;
            }

            var ctx = getAudioContext();
            if (!ctx) return;

            var wpm = parseInt(document.getElementById('morse-wpm').value, 10) || 18;
            var freq = parseInt(document.getElementById('morse-hz').value, 10) || 700;
            // Paris standard: 50 units per word. dotTime = 1.2 / WPM
            var dotTime = 1.2 / wpm;

            _isPlaying = true;
            _stopAudioPlayback = false;

            var btn = document.getElementById('btnPlayMorse');
            var icon = document.getElementById('playIcon');
            var lbl = document.getElementById('playLabel');
            if (icon) icon.textContent = '⏹';
            if (lbl) lbl.textContent = 'Stop Audio Playback';
            if (btn) btn.style.background = '#ef4444';

            var curTime = ctx.currentTime + 0.05;

            for (var i = 0; i < code.length; i++) {
              var char = code[i];
              if (char === '.' || char === '-') {
                var dur = char === '.' ? dotTime : dotTime * 3;
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();

                osc.frequency.value = freq;
                osc.type = 'sine';

                // Gentle envelope to prevent audio clicking
                gain.gain.setValueAtTime(0, curTime);
                gain.gain.linearRampToValueAtTime(0.3, curTime + 0.005);
                gain.gain.setValueAtTime(0.3, curTime + dur - 0.005);
                gain.gain.linearRampToValueAtTime(0, curTime + dur);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(curTime);
                osc.stop(curTime + dur);
                curTime += dur + dotTime;
              } else if (char === ' ') {
                curTime += dotTime * 2;
              } else if (char === '/') {
                curTime += dotTime * 5;
              }
            }

            var totalDurMs = Math.max(100, (curTime - ctx.currentTime) * 1000);
            setTimeout(function() {
              _isPlaying = false;
              if (icon) icon.textContent = '▶';
              if (lbl) lbl.textContent = 'Play Audio Beep Tone';
              if (btn) btn.style.background = '';
            }, totalDurMs);
          };

          window.clearMorseInputs = function() {
            document.getElementById('morse-text').value = '';
            document.getElementById('morse-code').value = '';
          };

          window.loadSampleMorse = function() {
            document.getElementById('morse-text').value = 'CQ CQ CQ DE K1JT MAYDAY SOS';
            textToMorse();
          };

          document.addEventListener('DOMContentLoaded', function() {
            var txt = document.getElementById('morse-text');
            if (txt && !txt.value) {
              txt.value = 'HELLO WORLD';
              textToMorse();
            }
          });
        </script>
      `
    },
    {
      slug: 'binary-text',
      title: 'Binary to Text & Text to Binary Converter',
      metaDesc: 'Convert ASCII and Unicode text to 8-bit binary strings and decode binary byte arrays back to plain text.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Binary Text Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Binary to Text &amp; Text to Binary Converter Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Encode English and Unicode text into 8-bit binary strings or decode binary byte streams back to UTF-8 text with formatting and bit parity metrics.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Plain Text (ASCII &amp; UTF-8)</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleBinary()">Load Sample</button>
              </div>
              <textarea id="bin-text" class="code-input" style="height: 120px; font-size: 1rem;" placeholder="Type text..." oninput="textToBin()"></textarea>
            </div>

            <!-- Delimiter and Format Selector -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0;">
              <div class="field-group" style="margin: 0;">
                <label class="field-label">Byte Delimiter</label>
                <select id="bin-delim" class="text-input" onchange="textToBin()">
                  <option value="space">Space (01001000 01101001)</option>
                  <option value="none">No Space (0100100001101001)</option>
                  <option value="comma">Comma (01001000, 01101001)</option>
                  <option value="prefix">0b Prefix (0b01001000 0b01101001)</option>
                </select>
              </div>
              <div class="field-group" style="margin: 0; display: flex; align-items: flex-end; padding-bottom: 0.5rem;">
                <label class="opt-label"><input type="checkbox" id="bin-utf8" checked onchange="textToBin()"> Full UTF-8 Multi-Byte Encoding</label>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Binary Code (8-bit Byte Stream)</label>
              <textarea id="bin-code" class="code-input" style="height: 140px; font-family: var(--mono); font-size: 0.95rem; line-height: 1.5;" placeholder="e.g. 01001000 01101001" oninput="binToText()"></textarea>
            </div>

            <!-- Live Bit Diagnostic Metrics -->
            <div class="stat-grid" style="margin-top: 1rem;">
              <div class="stat-card"><div class="stat-num" id="stat-bytes">0</div><div class="stat-lbl">Total Bytes</div></div>
              <div class="stat-card"><div class="stat-num" id="stat-bits">0</div><div class="stat-lbl">Total Bits</div></div>
              <div class="stat-card"><div class="stat-num" id="stat-ones">0</div><div class="stat-lbl">High Bits (1s)</div></div>
              <div class="stat-card"><div class="stat-num" id="stat-zeros">0</div><div class="stat-lbl">Low Bits (0s)</div></div>
              <div class="stat-card"><div class="stat-num" id="stat-density">0%</div><div class="stat-lbl">Bit Density</div></div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyBinary" class="btn-sec" onclick="copyBinaryCode()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Binary Code</span>
              </button>
              <button type="button" id="btnCopyBinText" class="btn-sec" onclick="copyBinaryText()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Plain Text</span>
              </button>
              <button type="button" id="btnCopyBinStats" class="btn-sec" onclick="copyBinaryStatsReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Diagnostic Stats</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearBinaryInputs()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Binary Text Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Binary Encoding, Byte Framing &amp; Character Sets</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Multi-Byte UTF-8 Truncation via Naive charCodeAt()</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Primitive JavaScript binary converters rely on <code>str.charCodeAt(i)</code>. This only returns 16-bit UTF-16 code units and breaks on international characters and emojis (e.g. 🚀 is U+1F680, which requires 4 UTF-8 bytes). Using <code>TextEncoder</code> is mandatory to prevent byte stream corruption.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Missing Leading Zeros &amp; Byte Framing Desynchronization</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Converting numbers to binary via <code>(num).toString(2)</code> omits leading zeros: e.g. ASCII space (32) becomes <code>100000</code> (6 bits) instead of <code>00100000</code> (8 bits). In continuous binary streams without delimiters, this 2-bit deficit desynchronizes all subsequent byte frames, scrambling the remainder of the message.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Endianness &amp; Bit Order Inversions in Stream Serialization</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Standard telecommunications and internet protocols transmit data in Big-Endian (Most Significant Bit first) network byte order. Feeding binary streams into hardware registers that expect Little-Endian (Least Significant Bit first) inverts the bit sequence, transforming character 'A' (<code>01000001</code>) into '‚' (<code>10000010</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Non-Printing Control Character &amp; Null-Byte Poisoning</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Binary representations can encode non-printing ASCII control bytes such as <code>00000000</code> (Null byte), <code>00000111</code> (Bell), or <code>00011011</code> (Escape). Injecting raw null bytes into C/C++ backend parsers terminates strings prematurely, enabling security bypasses and memory corruption.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Bit Flips &amp; Parity Check Absence in Raw Channels</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Transmitting uncompressed binary text across physical wires or RF without parity bits or Cyclic Redundancy Checks (CRC) leaves messages vulnerable to cosmic-ray and electromagnetic bit flips. A single flipped bit changes lowercase 'a' (<code>01100001</code>) into 'q' (<code>01110001</code>) or command code without detection.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window._binaryStats = { bytes: 0, bits: 0, ones: 0, zeros: 0, density: '0%' };

          window.textToBin = function() {
            var val = document.getElementById('bin-text') ? document.getElementById('bin-text').value : '';
            var delim = document.getElementById('bin-delim') ? document.getElementById('bin-delim').value : 'space';
            var useUtf8 = document.getElementById('bin-utf8') ? document.getElementById('bin-utf8').checked : true;

            var bytes = [];
            if (useUtf8 && typeof TextEncoder !== 'undefined') {
              var encoder = new TextEncoder();
              bytes = Array.from(encoder.encode(val));
            } else {
              for (var i = 0; i < val.length; i++) {
                bytes.push(val.charCodeAt(i) & 0xFF);
              }
            }

            var binaryStrs = bytes.map(function(b) {
              return b.toString(2).padStart(8, '0');
            });

            var totalOnes = 0;
            var totalZeros = 0;
            binaryStrs.forEach(function(bs) {
              for (var j = 0; j < bs.length; j++) {
                if (bs[j] === '1') totalOnes++;
                else totalZeros++;
              }
            });

            var totalBits = totalOnes + totalZeros;
            var density = totalBits > 0 ? ((totalOnes / totalBits) * 100).toFixed(1) + '%' : '0%';

            window._binaryStats = {
              bytes: bytes.length,
              bits: totalBits,
              ones: totalOnes,
              zeros: totalZeros,
              density: density
            };

            document.getElementById('stat-bytes').textContent = bytes.length.toLocaleString();
            document.getElementById('stat-bits').textContent = totalBits.toLocaleString();
            document.getElementById('stat-ones').textContent = totalOnes.toLocaleString();
            document.getElementById('stat-zeros').textContent = totalZeros.toLocaleString();
            document.getElementById('stat-density').textContent = density;

            var outputStr = '';
            if (delim === 'space') outputStr = binaryStrs.join(' ');
            else if (delim === 'none') outputStr = binaryStrs.join('');
            else if (delim === 'comma') outputStr = binaryStrs.join(', ');
            else if (delim === 'prefix') outputStr = binaryStrs.map(function(b) { return '0b' + b; }).join(' ');

            document.getElementById('bin-code').value = outputStr;
          };

          window.binToText = function() {
            var val = document.getElementById('bin-code') ? document.getElementById('bin-code').value.trim() : '';
            if (!val) {
              document.getElementById('bin-text').value = '';
              return;
            }

            // Strip 0b prefixes, commas, and extract continuous or spaced bits
            var clean = val.replace(/0b/gi, '').replace(/[^01]/g, ' ').trim();
            var rawBytes = [];

            if (clean.indexOf(' ') !== -1) {
              var tokens = clean.split(/\s+/);
              for (var i = 0; i < tokens.length; i++) {
                if (tokens[i].length > 0) {
                  rawBytes.push(parseInt(tokens[i], 2));
                }
              }
            } else {
              // Fixed 8-bit chunking
              for (var j = 0; j < clean.length; j += 8) {
                var chunk = clean.slice(j, j + 8);
                if (chunk.length === 8) {
                  rawBytes.push(parseInt(chunk, 2));
                }
              }
            }

            try {
              var uint8 = new Uint8Array(rawBytes);
              var decoder = new TextDecoder('utf-8');
              document.getElementById('bin-text').value = decoder.decode(uint8);
            } catch (e) {
              var chars = rawBytes.map(function(b) { return String.fromCharCode(b); }).join('');
              document.getElementById('bin-text').value = chars;
            }
          };

          window.copyBinaryCode = function() {
            var val = document.getElementById('bin-code') ? document.getElementById('bin-code').value : '';
            if (!val) { textToBin(); val = document.getElementById('bin-code').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyBinary');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Binary Code Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.copyBinaryText = function() {
            var val = document.getElementById('bin-text') ? document.getElementById('bin-text').value : '';
            if (!val) { binToText(); val = document.getElementById('bin-text').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyBinText');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Plain Text Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.copyBinaryStatsReport = function() {
            var s = window._binaryStats;
            var text = '📊 Binary Byte Stream Diagnostic Report\n' +
              '• Total Encoded Bytes: ' + s.bytes.toLocaleString() + ' bytes\n' +
              '• Total Bits: ' + s.bits.toLocaleString() + ' bits\n' +
              '• High Bits (1s / Hamming Weight): ' + s.ones.toLocaleString() + '\n' +
              '• Low Bits (0s): ' + s.zeros.toLocaleString() + '\n' +
              '• Bit Density: ' + s.density + '\n\n' +
              'Calculated at digitaltoolsshed.com/text/binary-text';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyBinStats');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Diagnostic Stats Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.clearBinaryInputs = function() {
            document.getElementById('bin-text').value = '';
            document.getElementById('bin-code').value = '';
            textToBin();
          };

          window.loadSampleBinary = function() {
            document.getElementById('bin-text').value = 'Digital Tools Shed 🚀 2026';
            textToBin();
          };

          document.addEventListener('DOMContentLoaded', function() {
            var txt = document.getElementById('bin-text');
            if (txt && !txt.value) {
              txt.value = 'Hello, World!';
              textToBin();
            }
          });
        </script>
      `
    },
    {
      slug: 'zalgo-text',
      title: 'Zalgo Glitch Text Generator',
      metaDesc: 'Generate glitchy, cursed, corrupted Zalgo text with customizable distortion and overflow intensity.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Zalgo Text Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Zalgo Glitch Text Generator &amp; Diacritical Styler</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Stack combining diacritical Unicode marks above, through, and below characters to generate chaotic cursed glitch text with full overflow control.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Plain Text</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleZalgo()">Load Sample</button>
              </div>
              <input type="text" id="zalgo-in" class="text-input" value="HE COMES" oninput="genZalgo()" style="font-size: 1.1rem; height: 48px;" />
            </div>

            <!-- Direction Checkboxes & Corruption Slider -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.25rem 0;">
              <div class="field-group" style="margin: 0;">
                <label class="field-label" style="display: flex; justify-content: space-between;">
                  <span>Corruption Intensity</span>
                  <span id="zalgo-lvl" style="font-family: var(--mono); font-weight: bold; color: var(--fg);">6</span>
                </label>
                <input type="range" id="zalgo-range" min="1" max="20" value="6" style="width: 100%; cursor: pointer;" oninput="document.getElementById('zalgo-lvl').textContent=this.value; genZalgo();" />
              </div>
              <div class="field-group" style="margin: 0; display: flex; flex-direction: column; justify-content: flex-end; gap: 0.35rem;">
                <label class="opt-label"><input type="checkbox" id="zalgo-up" checked onchange="genZalgo()"> Glitch Up (Above)</label>
                <label class="opt-label"><input type="checkbox" id="zalgo-mid" checked onchange="genZalgo()"> Glitch Middle (Through)</label>
                <label class="opt-label"><input type="checkbox" id="zalgo-down" checked onchange="genZalgo()"> Glitch Down (Below)</label>
              </div>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Cursed / Corrupted Zalgo Output</label>
                <span id="zalgoByteStats" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">0 bytes</span>
              </div>
              <div id="zalgo-out" class="result-box" style="font-size: 1.35rem; min-height: 120px; line-height: 2.2; overflow-x: auto; padding: 1.5rem 1rem; word-break: break-all; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;"></div>
            </div>

            <!-- Action Buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyZalgo" class="btn-primary" onclick="copyZalgoText()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>📋 Copy Glitched Zalgo Text</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearZalgoInput()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear Text</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Zalgo Text Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Zalgo Text, Combining Diacritics &amp; Rendering Engines</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Line-Height Explosion &amp; UI Component Overlap Destruction</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Combining diacritical marks in Unicode (U+0300 to U+036F) do not expand container bounding boxes. In web layouts lacking <code>overflow: hidden</code> or substantial padding, stacked accents render directly over upper navigational menus, adjacent buttons, and sidebars, rendering interfaces unusable.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Chat Spam Filtering &amp; Automated Message Dropping</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Communication platforms (Discord, Twitch, Slack, Telegram) deploy automated regex filters that measure combining mark density. Sending messages containing intense Zalgo text instantly triggers spam heuristics, leading to silent message dropping, bot timeouts, or temporary user suspensions.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Database Column Overflow &amp; UTF-8 Byte Bloat</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Every combining mark requires 2 to 3 bytes in UTF-8 encoding. A short 10-character word corrupted at level 15 stacks 450 combining marks, expanding a 10-byte string into over 900 bytes. Attempting to insert this into standard <code>VARCHAR(255)</code> database columns causes catastrophic SQL exceptions.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Terminal Emulator &amp; CLI Shaper Crashes</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Many command-line interfaces and terminal emulators (e.g. legacy Windows console, older PuTTY) lack advanced OpenType text shaping engines. Printing heavily accented Zalgo strings to stdout can cause terminal renderers to freeze or enter unbounded glyph caching loops.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Screen Reader Speech Synthesizer Auditory Lockups</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Accessibility software (JAWS, NVDA, Windows Narrator) attempts to vocalize every individual combining mark sequentially (e.g., <em>"Combining Inverted Breve, Combining Diaeresis, Combining Horn..."</em>). Users with screen readers experience painful auditory freezes that can last minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var ZALGO_UP = [0x030d,0x030e,0x0304,0x0305,0x033f,0x0311,0x0306,0x0310,0x0352,0x0357,0x0358,0x0342,0x0343,0x0344,0x034a,0x034b,0x034c,0x0350,0x0300,0x0301,0x0302,0x0303,0x0307,0x0308,0x0309,0x030a,0x030b,0x030c];
          var ZALGO_MID = [0x0315,0x031b,0x0340,0x0341,0x0358,0x0321,0x0322,0x0327,0x0328,0x0334,0x0335,0x0336,0x0337,0x0338];
          var ZALGO_DOWN = [0x0316,0x0317,0x0318,0x0319,0x031c,0x031d,0x031e,0x031f,0x0320,0x0324,0x0325,0x0326,0x0329,0x032a,0x032b,0x032c,0x032d,0x032e,0x032f,0x0330,0x0331,0x0332,0x0333,0x0339,0x033a,0x033b,0x033c];

          window.genZalgo = function() {
            var val = document.getElementById('zalgo-in') ? document.getElementById('zalgo-in').value : '';
            var lvl = parseInt(document.getElementById('zalgo-range').value, 10) || 6;
            var doUp = document.getElementById('zalgo-up') ? document.getElementById('zalgo-up').checked : true;
            var doMid = document.getElementById('zalgo-mid') ? document.getElementById('zalgo-mid').checked : true;
            var doDown = document.getElementById('zalgo-down') ? document.getElementById('zalgo-down').checked : true;

            var res = '';
            for (var i = 0; i < val.length; i++) {
              var c = val[i];
              if (c === ' ' || c === '\n') { res += c; continue; }
              res += c;

              if (doUp) {
                for (var u = 0; u < lvl; u++) {
                  res += String.fromCharCode(ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)]);
                }
              }
              if (doMid) {
                for (var m = 0; m < Math.floor(lvl / 2); m++) {
                  res += String.fromCharCode(ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)]);
                }
              }
              if (doDown) {
                for (var d = 0; d < lvl; d++) {
                  res += String.fromCharCode(ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)]);
                }
              }
            }

            var outElem = document.getElementById('zalgo-out');
            if (outElem) outElem.textContent = res;

            var byteLen = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(res).length : res.length * 2;
            var stats = document.getElementById('zalgoByteStats');
            if (stats) stats.textContent = res.length + ' chars (' + byteLen.toLocaleString() + ' UTF-8 bytes)';
          };

          window.copyZalgoText = function() {
            var val = document.getElementById('zalgo-out') ? document.getElementById('zalgo-out').textContent : '';
            if (!val) { genZalgo(); val = document.getElementById('zalgo-out').textContent; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyZalgo');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Glitched Zalgo Copied!</span>';
                setTimeout(function() {
                  btn.innerHTML = orig;
                }, 2200);
              }
            });
          };

          window.clearZalgoInput = function() {
            var inp = document.getElementById('zalgo-in');
            if (inp) inp.value = '';
            genZalgo();
          };

          window.loadSampleZalgo = function() {
            var inp = document.getElementById('zalgo-in');
            if (inp) inp.value = 'TO INVOKE THE HIVE-MIND REPRESENTING CHAOS';
            genZalgo();
          };

          document.addEventListener('DOMContentLoaded', genZalgo);
        </script>
      `
    },
    {
      slug: 'whitespace-cleaner',
      title: 'Whitespace Cleaner & Line Formatter',
      metaDesc: 'Strip trailing spaces, remove empty lines, collapse multiple whitespace, and clean formatting from copied text.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Whitespace Cleaner
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Whitespace Cleaner &amp; Line Formatter Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Clean messy text by stripping trailing spaces, removing empty lines, collapsing multiple whitespace, converting tabs, and normalizing line endings.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Input Text</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSampleWhitespace()">Load Messy Sample</button>
              </div>
              <textarea id="ws-input" class="code-input" style="height: 160px; font-family: var(--mono); font-size: 0.9rem;" placeholder="Paste text here..." oninput="cleanWhitespace()"></textarea>
            </div>

            <!-- Cleaning Options Checkboxes -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin: 1.25rem 0; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
              <label class="opt-label"><input type="checkbox" id="ws-trim" checked onchange="cleanWhitespace()"> Trim Line Leading &amp; Trailing</label>
              <label class="opt-label"><input type="checkbox" id="ws-spaces" checked onchange="cleanWhitespace()"> Collapse Multiple Spaces</label>
              <label class="opt-label"><input type="checkbox" id="ws-blank" checked onchange="cleanWhitespace()"> Remove All Blank Lines</label>
              <label class="opt-label"><input type="checkbox" id="ws-tabs" onchange="cleanWhitespace()"> Convert Tabs to 2 Spaces</label>
              <label class="opt-label"><input type="checkbox" id="ws-crlf" checked onchange="cleanWhitespace()"> Normalize CRLF to Unix LF (\n)</label>
              <label class="opt-label"><input type="checkbox" id="ws-zwsp" checked onchange="cleanWhitespace()"> Strip Zero-Width Spaces (\u200B)</label>
            </div>

            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Cleaned Output</label>
                <span id="wsSavings" style="font-family: var(--mono); font-size: 0.75rem; color: #10b981;">0 chars saved</span>
              </div>
              <textarea id="ws-output" class="code-input" style="height: 160px; font-family: var(--mono); font-size: 0.9rem;" readonly></textarea>
            </div>

            <!-- Real-time Diagnostic Grid -->
            <div class="stat-grid" style="margin-top: 1rem;">
              <div class="stat-card"><div class="stat-num" id="ws-orig-len">0</div><div class="stat-lbl">Original Chars</div></div>
              <div class="stat-card"><div class="stat-num" id="ws-clean-len">0</div><div class="stat-lbl">Cleaned Chars</div></div>
              <div class="stat-card"><div class="stat-num" id="ws-orig-lines">0</div><div class="stat-lbl">Original Lines</div></div>
              <div class="stat-card"><div class="stat-num" id="ws-clean-lines">0</div><div class="stat-lbl">Cleaned Lines</div></div>
              <div class="stat-card"><div class="stat-num" id="ws-reduction">0%</div><div class="stat-lbl">Size Reduction</div></div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyCleanWs" class="btn-primary" onclick="copyCleanWhitespace()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>📋 Copy Cleaned Text</span>
              </button>
              <button type="button" id="btnCopyWsReport" class="btn-sec" onclick="copyWsDiagnosticReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Diagnostic Report</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearWsInputs()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Whitespace Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Whitespace Normalization, Tokenization &amp; Compilers</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Invisible Zero-Width Space (ZWSP) Syntax Poisoning</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Text copied from web CMSs, Notion, or chat clients often contains invisible zero-width spaces (<code>\u200B</code>), byte-order marks (<code>\uFEFF</code>), or zero-width non-joiners. Standard ASCII whitespace matchers (<code>\s</code>) fail to purge them, leaving hidden characters that trigger bizarre compiler syntax errors (such as "Unexpected token ILLEGAL") in JavaScript and Python.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Markdown Hard-Line Break Destruction</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In standard CommonMark and GitHub Flavored Markdown (GFM), exactly two trailing spaces at the end of a line signify a manual line break (<code>&lt;br&gt;</code>). Indiscriminately trimming line-end spaces destroys poem stanzas, street addresses, and lyric line breaks, collapsing structured prose into an illegible run-on block.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Python &amp; YAML Indentation Hierarchy Obliteration</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Stripping leading spaces from code snippets obliterates scope hierarchy in indentation-sensitive languages (Python, YAML, Dockerfiles, Makefiles). Once stripped, restoring correct indentation depth requires manual line-by-line reconstruction.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Cross-Platform CRLF vs. LF Ghost Git Diffs</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Windows text editors terminate lines with Carriage Return + Line Feed (<code>\r\n</code>), whereas Unix/Linux/macOS utilize lone Line Feeds (<code>\n</code>). Cleaning whitespace without normalizing line endings can inadvertently convert entire source code files to CRLF, creating 10,000-line "ghost diffs" in Git PRs.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Semantic Paragraph Merging &amp; Dialogue Flattening</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  A blind "remove all blank lines" rule eliminates the deliberate paragraph separations that distinguish shifts in narrative scene, thought, or dialogue. Always confirm whether collapsing multi-line breaks to a single empty line is preferred over total blank line elimination.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window._wsStats = { origLen: 0, cleanLen: 0, origLines: 0, cleanLines: 0, reduction: '0%' };

          window.cleanWhitespace = function() {
            var raw = document.getElementById('ws-input') ? document.getElementById('ws-input').value : '';
            var doTrim = document.getElementById('ws-trim') ? document.getElementById('ws-trim').checked : true;
            var doSpaces = document.getElementById('ws-spaces') ? document.getElementById('ws-spaces').checked : true;
            var doBlank = document.getElementById('ws-blank') ? document.getElementById('ws-blank').checked : true;
            var doTabs = document.getElementById('ws-tabs') ? document.getElementById('ws-tabs').checked : false;
            var doCrlf = document.getElementById('ws-crlf') ? document.getElementById('ws-crlf').checked : true;
            var doZwsp = document.getElementById('ws-zwsp') ? document.getElementById('ws-zwsp').checked : true;

            var str = raw;

            // Zero-width space removal
            if (doZwsp) {
              str = str.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
            }

            // CRLF normalization
            if (doCrlf) {
              str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            }

            // Tabs to spaces
            if (doTabs) {
              str = str.replace(/\t/g, '  ');
            }

            // Collapse multiple horizontal spaces
            if (doSpaces) {
              str = str.replace(/[ \t]+/g, ' ');
            }

            var lines = str.split('\n');

            if (doTrim) {
              lines = lines.map(function(l) { return l.trim(); });
            }

            if (doBlank) {
              lines = lines.filter(function(l) { return l.length > 0; });
            }

            var cleaned = lines.join('\n');
            document.getElementById('ws-output').value = cleaned;

            var origLen = raw.length;
            var cleanLen = cleaned.length;
            var origLines = raw ? raw.split(/\r?\n/).length : 0;
            var cleanLines = cleaned ? lines.length : 0;
            var charsSaved = Math.max(0, origLen - cleanLen);
            var reduction = origLen > 0 ? (((origLen - cleanLen) / origLen) * 100).toFixed(1) + '%' : '0%';

            window._wsStats = {
              origLen: origLen,
              cleanLen: cleanLen,
              origLines: origLines,
              cleanLines: cleanLines,
              charsSaved: charsSaved,
              reduction: reduction
            };

            document.getElementById('ws-orig-len').textContent = origLen.toLocaleString();
            document.getElementById('ws-clean-len').textContent = cleanLen.toLocaleString();
            document.getElementById('ws-orig-lines').textContent = origLines.toLocaleString();
            document.getElementById('ws-clean-lines').textContent = cleanLines.toLocaleString();
            document.getElementById('ws-reduction').textContent = reduction;
            document.getElementById('wsSavings').textContent = charsSaved.toLocaleString() + ' chars saved (' + reduction + ')';
          };

          window.copyCleanWhitespace = function() {
            var val = document.getElementById('ws-output') ? document.getElementById('ws-output').value : '';
            if (!val) { cleanWhitespace(); val = document.getElementById('ws-output').value; }

            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyCleanWs');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Cleaned Text Copied!</span>';
                setTimeout(function() { btn.innerHTML = orig; }, 2200);
              }
            });
          };

          window.copyWsDiagnosticReport = function() {
            var s = window._wsStats;
            var text = '🧹 Whitespace Cleaning Diagnostic Summary\n' +
              '• Original Characters: ' + s.origLen.toLocaleString() + '\n' +
              '• Cleaned Characters: ' + s.cleanLen.toLocaleString() + '\n' +
              '• Characters Stripped: ' + s.charsSaved.toLocaleString() + ' (' + s.reduction + ' reduction)\n' +
              '• Original Lines: ' + s.origLines.toLocaleString() + '\n' +
              '• Final Cleaned Lines: ' + s.cleanLines.toLocaleString() + '\n\n' +
              'Cleaned with digitaltoolsshed.com/text/whitespace-cleaner';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyWsReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Diagnostic Stats Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.clearWsInputs = function() {
            document.getElementById('ws-input').value = '';
            document.getElementById('ws-output').value = '';
            cleanWhitespace();
          };

          window.loadSampleWhitespace = function() {
            var sample = "   Digital Tools Shed      \n\n\n\t\tHigh-performance   client-side   utilities.  \n\n\n   Zero-overhead execution  with \u200Bno external bloat!   \n\n";
            document.getElementById('ws-input').value = sample;
            cleanWhitespace();
          };

          document.addEventListener('DOMContentLoaded', function() {
            var inp = document.getElementById('ws-input');
            if (inp && !inp.value) {
              loadSampleWhitespace();
            }
          });
        </script>
      `
    },
    {
      slug: 'palindrome-checker',
      title: 'Palindrome Checker',
      metaDesc: 'Check whether a word, sentence, or phrase reads the same backward as forward with instant letter-by-letter visual verification.',
      category: 'Text',
      body: `
        ${commonStyle}
        <div class="article-container" style="max-width: 920px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Palindrome Checker
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Palindrome Checker &amp; Anagram Diagnostic Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Test whether words, phrases, or numbers read identically forward and backward with case-folding, accent decomposition, and visual letter-by-letter verification.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
                <label class="field-label" style="margin: 0;">Enter Word, Sentence, or Number</label>
                <button type="button" class="btn-sec" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;" onclick="loadSamplePalindrome()">Load Famous Panama Sample</button>
              </div>
              <input type="text" id="pal-input" class="text-input" value="A man, a plan, a canal: Panama" oninput="checkPal()" style="font-size: 1.15rem; height: 48px;" />
            </div>

            <!-- Normalization Options -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem; margin: 1rem 0; padding: 0.85rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border);">
              <label class="opt-label"><input type="checkbox" id="pal-case" checked onchange="checkPal()"> Ignore Letter Casing (A = a)</label>
              <label class="opt-label"><input type="checkbox" id="pal-punct" checked onchange="checkPal()"> Ignore Spaces &amp; Punctuation</label>
              <label class="opt-label"><input type="checkbox" id="pal-accent" checked onchange="checkPal()"> Normalize Accents (é = e)</label>
            </div>

            <div id="pal-result" class="result-box" style="margin-top: 1.25rem;"></div>

            <!-- Action Buttons -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyPalReport" class="btn-sec" onclick="copyPalReport()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Palindrome Diagnostic Report</span>
              </button>
              <button type="button" class="btn-sec" onclick="clearPalInput()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>🗑️ Clear</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Palindrome Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Palindrome Detection &amp; Unicode String Reversal</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. Unicode Surrogate Pair Splitting &amp; Emoji Inversion</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Reversing strings via <code>str.split('').reverse().join('')</code> splits 32-bit surrogate pairs and compound emojis into detached high and low surrogates. This produces inverted corrupt characters (e.g. <code>\uD83D\uDE00</code> inverted into <code>\uDE00\uD83D</code>), breaking UTF-16 strings completely. Always reverse grapheme clusters or normalize strings beforehand.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. Diacritic &amp; Accent Mismatches in European Languages</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Renowned international palindromes (e.g. French <em>"Ésope reste ici et se repose"</em> or Spanish <em>"Dábale arroz a la zorra el abad"</em>) fail simple character equality tests because acute accents (<code>é</code>, <code>á</code>) do not match plain vowels (<code>e</code>, <code>a</code>) without Unicode Canonical Decomposition (<code>normalize('NFD')</code>).
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Punctuation Collisions &amp; Smart Typographic Quotes</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Complex literary palindromes often feature curly quotes (<code>“ ” ‘ ’</code>), em-dashes (<code>—</code>), and ellipses. Testing phrases with basic ASCII sanitizers (<code>/[^a-zA-Z0-9]/</code>) fails when Unicode typographical punctuation marks are present, triggering false non-palindrome verdicts.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Word-Level vs. Character-Level Palindrome Confusion</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Word-unit palindromes (such as <em>"Fall leaves after leaves fall"</em> or <em>"Did I say you say I did"</em>) read identically word-by-word, whereas character palindromes read letter-by-letter. Conflating the two paradigms results in false negatives in poetry analysis software.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Semordnilap (Heteropalindrome) False Equivalencies</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Words that spell an entirely different, valid word in reverse (e.g. <em>desserts</em> / <em>stressed</em>, <em>live</em> / <em>evil</em>, <em>gateman</em> / <em>nametag</em>) are semordnilaps rather than true palindromes. Treating semordnilaps as palindromes introduces taxonomy errors in linguistic databases.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          window._palData = { isPal: false, forward: '', backward: '', raw: '', len: 0 };

          window.checkPal = function() {
            var raw = document.getElementById('pal-input') ? document.getElementById('pal-input').value : '';
            var ignCase = document.getElementById('pal-case') ? document.getElementById('pal-case').checked : true;
            var ignPunct = document.getElementById('pal-punct') ? document.getElementById('pal-punct').checked : true;
            var normAccent = document.getElementById('pal-accent') ? document.getElementById('pal-accent').checked : true;

            var processed = raw;

            if (normAccent) {
              processed = processed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            }

            if (ignCase) {
              processed = processed.toLowerCase();
            }

            if (ignPunct) {
              processed = processed.replace(/[^a-zA-Z0-9]/g, '');
            }

            var forward = processed;
            var backward = processed.split('').reverse().join('');
            var isPal = forward.length > 0 && forward === backward;

            window._palData = {
              isPal: isPal,
              forward: forward,
              backward: backward,
              raw: raw,
              len: forward.length
            };

            var res = document.getElementById('pal-result');
            if (!res) return;

            if (!forward) {
              res.innerHTML = '<div style="font-family: var(--mono); font-size: 0.9rem; color: var(--text-muted);">Enter a word, phrase, or number above to inspect.</div>';
              return;
            }

            var color = isPal ? '#10b981' : '#ef4444';
            var icon = isPal ? '✓' : '✗';
            var headline = isPal ? 'PALINDROME CONFIRMED!' : 'NOT A PALINDROME';
            var desc = isPal 
              ? 'Reads identically forward and backward across all normalized characters.'
              : 'Mismatch detected between forward and reversed character sequences.';

            res.innerHTML = '<div style="background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid ' + color + '; padding: 1.25rem; border-radius: 6px;">' +
              '<div style="font-size: 1.25rem; font-weight: bold; color: ' + color + '; margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.5rem;">' +
                '<span>' + icon + '</span> <span>' + headline + '</span>' +
              '</div>' +
              '<p style="font-size: 0.88rem; color: var(--text-muted); margin: 0 0 1rem 0;">' + desc + '</p>' +
              '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-family: var(--mono); font-size: 0.85rem;">' +
                '<div style="background: var(--surface); padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">' +
                  '<div style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; margin-bottom: 0.25rem;">Forward Normalized (' + forward.length + ' chars)</div>' +
                  '<div style="color: var(--fg); word-break: break-all;">' + forward + '</div>' +
                '</div>' +
                '<div style="background: var(--surface); padding: 0.75rem; border: 1px solid var(--border); border-radius: 4px;">' +
                  '<div style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; margin-bottom: 0.25rem;">Backward Normalized (' + backward.length + ' chars)</div>' +
                  '<div style="color: var(--fg); word-break: break-all;">' + backward + '</div>' +
                '</div>' +
              '</div>' +
            '</div>';
          };

          window.copyPalReport = function() {
            var d = window._palData;
            var verdict = d.isPal ? 'CONFIRMED PALINDROME (Identical forward and backward)' : 'NOT A PALINDROME (Mismatch detected)';
            var text = '🔍 Palindrome Diagnostic Verification Report\n' +
              '• Input Text: "' + d.raw + '"\n' +
              '• Verification Verdict: ' + verdict + '\n' +
              '• Normalized Length: ' + d.len + ' characters\n' +
              '• Forward Sequence: ' + d.forward + '\n' +
              '• Reversed Sequence: ' + d.backward + '\n\n' +
              'Verified at digitaltoolsshed.com/text/palindrome-checker';

            navigator.clipboard.writeText(text).then(function() {
              var btn = document.getElementById('btnCopyPalReport');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Diagnostic Report Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.clearPalInput = function() {
            var inp = document.getElementById('pal-input');
            if (inp) inp.value = '';
            checkPal();
          };

          window.loadSamplePalindrome = function() {
            var inp = document.getElementById('pal-input');
            if (inp) inp.value = 'Are we not pure? “No, sir!” Panama’s moody Noriega brags. “It is garbage!” Irony dooms a man—a prisoner up to new era.';
            checkPal();
          };

          document.addEventListener('DOMContentLoaded', checkPal);
        </script>
      `
    },
    {
      slug: 'markdown-preview',
      title: 'Markdown Live Preview & HTML Converter',
      metaDesc: 'Interactive side-by-side GitHub Flavored Markdown editor with real-time HTML preview, table formatting, and 1-click HTML export.',
      category: 'Text & Writing',
      faq: [
        { q: 'What is Markdown and why is it used?', a: 'Markdown is a lightweight markup language with plain-text formatting syntax. It is designed to be converted into HTML and is widely used for blogging, documentation, GitHub READMEs, and technical writing.' },
        { q: 'How do you create tables in GitHub Flavored Markdown?', a: 'Create tables using pipes (|) to separate columns and hyphens (-) on the second line to separate the header from data rows: | Header 1 | Header 2 | followed by | --- | --- |.' },
        { q: 'Is my markdown text processed locally or stored on a server?', a: 'Everything is processed 100% locally in your web browser. None of your text, notes, or documentation is ever transmitted over the network.' }
      ],
      body: `
        ${commonStyle}
        <style>
          .md-preview-pane { background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; min-height: 380px; line-height: 1.6; color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .md-preview-pane h1 { font-size: 1.8rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; margin-top: 1rem; color: var(--fg); font-family: var(--serif); }
          .md-preview-pane h2 { font-size: 1.4rem; border-bottom: 1px solid var(--border); padding-bottom: 0.2rem; margin-top: 1rem; color: var(--fg); font-family: var(--serif); }
          .md-preview-pane h3 { font-size: 1.15rem; margin-top: 0.8rem; color: var(--fg); font-family: var(--serif); }
          .md-preview-pane pre { background: var(--surface); padding: 0.85rem; border-radius: 6px; overflow-x: auto; font-family: var(--mono); font-size: 0.85rem; border: 1px solid var(--border); }
          .md-preview-pane code { background: var(--surface); padding: 0.15rem 0.35rem; border-radius: 3px; font-family: var(--mono); font-size: 0.85rem; }
          .md-preview-pane blockquote { border-left: 4px solid #3b82f6; margin: 1rem 0; padding-left: 1rem; color: var(--text-muted); font-style: italic; background: var(--surface); padding-top: 0.5rem; padding-bottom: 0.5rem; border-radius: 0 4px 4px 0; }
          .md-preview-pane table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
          .md-preview-pane th, .md-preview-pane td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; text-align: left; }
          .md-preview-pane th { background: var(--surface); font-weight: bold; }
        </style>

        <div class="article-container" style="max-width: 1000px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Markdown Preview
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Markdown Live Preview &amp; HTML Converter Studio</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Write, edit, and preview GitHub Flavored Markdown (GFM) with real-time HTML rendering, word metrics, clean copy, and instant HTML export.
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);">
                <span id="md-words" style="color: var(--fg); font-weight: bold;">0</span> words | <span id="md-chars" style="color: var(--fg); font-weight: bold;">0</span> characters | ~<span id="md-read" style="color: var(--fg); font-weight: bold;">0</span> min read
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button type="button" class="btn-sec" onclick="loadSampleMd()" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">Load GFM Sample</button>
                <button type="button" id="btnCopyMdHtmlTop" class="btn-sec" onclick="copyHtmlOutput()" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">Copy HTML</button>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;" id="md-editor-grid">
              <div>
                <label class="field-label">Markdown Input</label>
                <textarea id="md-input" class="code-input" style="height: 450px; font-family: var(--mono); font-size: 0.88rem; line-height: 1.5; resize: vertical;" oninput="renderMarkdown()"></textarea>
              </div>
              <div>
                <label class="field-label">Live Rendered HTML Preview</label>
                <div id="md-preview" class="md-preview-pane" style="height: 450px; overflow-y: auto;"></div>
              </div>
            </div>

            <!-- Action Buttons Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" id="btnCopyMdHtml" class="btn-primary" onclick="copyHtmlOutput()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span>📋 Copy Generated HTML</span>
              </button>
              <button type="button" id="btnCopyMdSource" class="btn-sec" onclick="copyMdSource()" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>📋 Copy Markdown</span>
              </button>
              <button type="button" class="btn-sec" onclick="downloadMdFile('document.html', getConvertedHtml())" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>💾 Download HTML</span>
              </button>
              <button type="button" class="btn-sec" onclick="downloadMdFile('document.md', document.getElementById('md-input').value)" style="padding: 0.65rem 1rem; font-family: var(--mono); font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--fg); font-weight: 600;">
                <span>💾 Download .md</span>
              </button>
            </div>
          </div>

          <!-- 5 Critical Markdown Traps -->
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 2rem 0;">
            <h3 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 1.25rem; color: var(--fg);">⚠️ 5 Fatal Traps in Markdown Parsers, GFM &amp; HTML Translation</h3>
            <div style="display: grid; gap: 1rem;">
              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #ef4444;">
                <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; font-size: 1rem; font-family: var(--serif);">💥 1. XSS (Cross-Site Scripting) via Raw Embedded HTML Injection</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  By default, CommonMark allows raw inline HTML tags. Rendering user-submitted Markdown directly into a live DOM element via <code>innerHTML</code> without pre-sanitization permits malicious script payloads (e.g. <code>&lt;img src=x onerror=alert(1)&gt;</code>) to execute arbitrary JavaScript in the victim's session.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #f59e0b;">
                <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; font-size: 1rem; font-family: var(--serif);">⚖️ 2. GFM Table Collapse Caused by Unescaped Pipe (|) Symbols</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In GitHub Flavored Markdown, tables rely on pipe characters (<code>|</code>) as column separators. Placing an unescaped pipe inside table text or code snippets (e.g. <code>cmd1 | cmd2</code>) causes parsers to prematurely split columns, completely scrambling row alignment and destroying HTML table rendering.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #10b981;">
                <h4 style="margin: 0 0 0.5rem 0; color: #10b981; font-size: 1rem; font-family: var(--serif);">🛡️ 3. Catastrophic ReDoS Backtracking in Naive Regex Parsers</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Lightweight client-side Markdown parsers frequently rely on nested regular expressions (e.g. <code>/\*\*(.*?)\*\*/g</code>). Feeding long unclosed sequences of asterisks or underscores into naive regex engines triggers exponential catastrophic backtracking (ReDoS), freezing the browser main thread and crashing user tabs.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #3b82f6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; font-size: 1rem; font-family: var(--serif);">🔍 4. Reference-Style Link Collision &amp; Footnote Overwriting</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  In extended documents utilizing reference links (e.g. <code>[Specification][1]</code>), case-insensitive duplicate label definitions silently overwrite earlier link destinations. The second reference definition redirects all preceding hyperlinks to the wrong URL without throwing errors.
                </p>
              </div>

              <div style="padding: 1.25rem; background: var(--surface-alt); border-radius: 8px; border: 1px solid var(--border); border-left: 4px solid #8b5cf6;">
                <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; font-size: 1rem; font-family: var(--serif);">🚀 5. Hard-Line Break Discrepancy Across GFM vs. CommonMark</h4>
                <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0; line-height: 1.6;">
                  Standard CommonMark requires two trailing spaces or a backslash at the end of a line to generate an HTML line break (<code>&lt;br&gt;</code>). In contrast, GitHub issues and comments treat single newlines as soft breaks. Documents authored across different environments render with severely distorted vertical rhythm.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script>
          var B = String.fromCharCode(96);
          var sampleMarkdown = '# Markdown Cheatsheet\n\nWelcome to the **Digital Tools Shed** Markdown Previewer Studio!\n\n## Formatting Styles\n- **Bold text** with ' + B + '**double asterisks**' + B + '\n- *Italic text* with ' + B + '*single asterisks*' + B + '\n- ~~Strikethrough~~ with ' + B + '~~tildes~~' + B + '\n\n### Blockquote Example\n> \"Simplicity is prerequisite for reliability.\" — Edsger W. Dijkstra\n\n### Code Block\n' + B + B + B + 'javascript\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n' + B + B + B + '\n\n### Data Table\n| Feature | Status | Performance |\n| :--- | :--- | :--- |\n| Real-time Parser | Active | 60 FPS |\n| Zero Uploads | Enabled | 100% Private |\n| Export to HTML | Ready | Instant |\n';

          function parseMarkdownSimple(md) {
            var B = String.fromCharCode(96);
            var reCodeBlock = new RegExp(B + B + B + '([a-z]*)\\n([\\s\\S]*?)' + B + B + B, 'g');
            var reInlineCode = new RegExp(B + '([^' + B + ']+)' + B, 'g');
            var html = md
              .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
              .replace(reCodeBlock, '<pre><code>$2</code></pre>')
              .replace(reInlineCode, '<code>$1</code>')
              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
              .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/~~(.*?)~~/g, '<del>$1</del>')
              .replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g, function(match, header, rows) {
                var ths = header.split('|').filter(Boolean).map(function(h) { return '<th>' + h.trim() + '</th>'; }).join('');
                var trs = rows.trim().split('\n').map(function(r) {
                  var tds = r.split('|').filter(Boolean).map(function(d) { return '<td>' + d.trim() + '</td>'; }).join('');
                  return '<tr>' + tds + '</tr>';
                }).join('');
                return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
              })
              .replace(/^\- (.*$)/gim, '<li>$1</li>')
              .replace(/\n\n+/g, '</p><p>');

            return '<p>' + html + '</p>';
          }

          window.renderMarkdown = function() {
            var input = document.getElementById('md-input');
            var raw = input ? input.value : '';
            var html = parseMarkdownSimple(raw);
            var preview = document.getElementById('md-preview');
            if (preview) preview.innerHTML = html;

            var words = raw.trim() ? raw.trim().split(/\s+/).length : 0;
            var chars = raw.length;
            var readTime = Math.ceil(words / 200);

            var wElem = document.getElementById('md-words');
            var cElem = document.getElementById('md-chars');
            var rElem = document.getElementById('md-read');
            if (wElem) wElem.textContent = words.toLocaleString();
            if (cElem) cElem.textContent = chars.toLocaleString();
            if (rElem) rElem.textContent = readTime;
          };

          window.loadSampleMd = function() {
            var input = document.getElementById('md-input');
            if (input) input.value = sampleMarkdown;
            renderMarkdown();
          };

          window.getConvertedHtml = function() {
            var preview = document.getElementById('md-preview');
            return preview ? preview.innerHTML : '';
          };

          window.copyHtmlOutput = function() {
            var html = getConvertedHtml();
            navigator.clipboard.writeText(html).then(function() {
              var btn1 = document.getElementById('btnCopyMdHtml');
              var btn2 = document.getElementById('btnCopyMdHtmlTop');
              if (btn1) {
                var orig1 = btn1.innerHTML;
                btn1.innerHTML = '<span style="color:#10b981;">✓ HTML Copied!</span>';
                setTimeout(function() { btn1.innerHTML = orig1; }, 2200);
              }
              if (btn2) {
                var orig2 = btn2.innerHTML;
                btn2.innerHTML = '<span style="color:#10b981;">✓ HTML Copied!</span>';
                setTimeout(function() { btn2.innerHTML = orig2; }, 2200);
              }
            });
          };

          window.copyMdSource = function() {
            var input = document.getElementById('md-input');
            var val = input ? input.value : '';
            navigator.clipboard.writeText(val).then(function() {
              var btn = document.getElementById('btnCopyMdSource');
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '<span style="color:#10b981;">✓ Markdown Copied!</span>';
                btn.style.borderColor = '#10b981';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.borderColor = 'var(--border)';
                }, 2200);
              }
            });
          };

          window.downloadMdFile = function(filename, content) {
            var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
          };

          document.addEventListener('DOMContentLoaded', loadSampleMd);
          loadSampleMd();
        </script>
      `
    }
  ];

  // Render individual pages
  for (const tool of tools) {
    const html = renderPage({
      title: `${tool.title} | Digital Tools Shed`,
      metaDesc: tool.metaDesc,
      canonical: `${DOMAIN}/text/${tool.slug}`,
      bodyContent: tool.body,
      currentPath: `/text/${tool.slug}`,
      faq: tool.faq
    });
    writeFileSync(join(textDist, `${tool.slug}.html`), html);
  }

  // Render Hub Page
  const hubCards = tools.map(t => `
    <a href="/text/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const hubBody = `
    ${commonStyle}
    <div class="article-container" style="max-width: 900px;">
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Text & Writing Tools Suite</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Fast, zero-server text utilities: live word counters, case converters, slug generators, Unicode font stylers, and Morse code translators.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(textDist, 'index.html'), renderPage({
    title: 'Text & Writing Tools Suite | Digital Tools Shed',
    metaDesc: 'Free online text and writing tools: word counter, case converter, Lorem Ipsum generator, URL slug generator, and fancy Unicode font generator.',
    canonical: `${DOMAIN}/text/`,
    bodyContent: hubBody,
    currentPath: '/text/'
  }));

  console.log(`  ✓ Built Text & Writing Suite (${tools.length} tools in /text/)`);
}
