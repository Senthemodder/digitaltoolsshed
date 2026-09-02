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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Word Counter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Word Counter & Character Counter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Real-time word, character, sentence, syllable, and reading time metrics for writers, students, and SEO copywriters.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input Text</label>
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

            <div class="action-bar">
              <button class="btn-primary" onclick="copyInput()">Copy Text</button>
              <button class="btn-sec" onclick="clearInput()">Clear</button>
            </div>
          </div>
        </div>

        <script>
          function calcWordStats() {
            const text = document.getElementById('wc-input').value;
            const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
            const chars = text.length;
            const charsNoSpace = text.replace(/\\s/g, '').length;
            const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\\s|$)/g) || [1]).length : 0;
            const paragraphs = text.trim() ? text.split(/\\n+/).filter(p => p.trim()).length : 0;

            const readMins = Math.ceil(words / 200);
            const speakMins = Math.ceil(words / 130);

            document.getElementById('s-words').textContent = words.toLocaleString();
            document.getElementById('s-chars').textContent = chars.toLocaleString();
            document.getElementById('s-chars-nospace').textContent = charsNoSpace.toLocaleString();
            document.getElementById('s-sentences').textContent = sentences.toLocaleString();
            document.getElementById('s-paragraphs').textContent = paragraphs.toLocaleString();
            document.getElementById('s-reading').textContent = readMins + (readMins === 1 ? ' min' : ' mins');
            document.getElementById('s-speaking').textContent = speakMins + (speakMins === 1 ? ' min' : ' mins');
          }

          function copyInput() {
            navigator.clipboard.writeText(document.getElementById('wc-input').value);
          }
          function clearInput() {
            document.getElementById('wc-input').value = '';
            calcWordStats();
          }
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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Lorem Ipsum Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Lorem Ipsum Dummy Text Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Generate standard Latin placeholder text for UI layouts, wireframes, and mockups.
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

            <div class="action-bar">
              <button class="btn-primary" onclick="genLorem()">&#x21BA; Generate</button>
              <button class="btn-sec" onclick="copyLorem()">Copy Text</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Generated Placeholder Text</label>
              <textarea id="lorem-output" class="code-input" style="height: 250px; font-family: sans-serif; font-size: 0.95rem; line-height: 1.6;" readonly></textarea>
            </div>
          </div>
        </div>

        <script>
          const LOREM_WORDS = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"];

          function getRandomWord() {
            return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
          }

          function makeSentence(numWords = 10) {
            const arr = [];
            for (let i = 0; i < numWords; i++) arr.push(getRandomWord());
            let s = arr.join(' ');
            return s.charAt(0).toUpperCase() + s.slice(1) + '.';
          }

          function makeParagraph(numSentences = 5) {
            const arr = [];
            for (let i = 0; i < numSentences; i++) {
              arr.push(makeSentence(Math.floor(Math.random() * 8) + 8));
            }
            return arr.join(' ');
          }

          function genLorem() {
            const count = parseInt(document.getElementById('lorem-count').value, 10) || 3;
            const type = document.getElementById('lorem-type').value;
            const start = document.getElementById('lorem-start').checked;

            let result = '';
            if (type === 'words') {
              const arr = [];
              if (start) arr.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
              while (arr.length < count) arr.push(getRandomWord());
              result = arr.slice(0, count).join(' ');
            } else if (type === 'sentences') {
              const arr = [];
              for (let i = 0; i < count; i++) arr.push(makeSentence(10));
              if (start && arr.length > 0) {
                arr[0] = 'Lorem ipsum dolor sit amet, ' + arr[0].charAt(0).toLowerCase() + arr[0].slice(1);
              }
              result = arr.join(' ');
            } else {
              const arr = [];
              for (let i = 0; i < count; i++) arr.push(makeParagraph(5));
              if (start && arr.length > 0) {
                arr[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + arr[0];
              }
              result = arr.join('\\n\\n');
            }

            document.getElementById('lorem-output').value = result;
          }

          function copyLorem() {
            navigator.clipboard.writeText(document.getElementById('lorem-output').value);
          }

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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Case Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Text Case Converter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert any text to sentence case, UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, or CONSTANT_CASE.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input Text</label>
              <textarea id="case-input" class="code-input" style="height: 180px; font-size: 1rem;" placeholder="Type or paste text to convert..."></textarea>
            </div>

            <div class="action-bar" style="gap: 0.5rem;">
              <button class="btn-primary" onclick="convertCase('upper')">UPPERCASE</button>
              <button class="btn-primary" onclick="convertCase('lower')">lowercase</button>
              <button class="btn-primary" onclick="convertCase('title')">Title Case</button>
              <button class="btn-primary" onclick="convertCase('sentence')">Sentence case</button>
              <button class="btn-primary" onclick="convertCase('camel')">camelCase</button>
              <button class="btn-primary" onclick="convertCase('snake')">snake_case</button>
              <button class="btn-primary" onclick="convertCase('kebab')">kebab-case</button>
              <button class="btn-primary" onclick="convertCase('constant')">CONSTANT_CASE</button>
              <button class="btn-primary" onclick="convertCase('alternating')">aLtErNaTiNg</button>
            </div>

            <div class="action-bar" style="margin-top: 1rem;">
              <button class="btn-sec" onclick="copyCaseText()">Copy Result</button>
              <button class="btn-sec" onclick="document.getElementById('case-input').value=''">Clear</button>
            </div>
          </div>
        </div>

        <script>
          function convertCase(type) {
            const input = document.getElementById('case-input');
            let str = input.value;
            if (!str) return;

            switch(type) {
              case 'upper':
                input.value = str.toUpperCase();
                break;
              case 'lower':
                input.value = str.toLowerCase();
                break;
              case 'title':
                input.value = str.toLowerCase().replace(/(^|\\s)\\w/g, m => m.toUpperCase());
                break;
              case 'sentence':
                input.value = str.toLowerCase().replace(/(^|[.!?]\\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
                break;
              case 'camel':
                input.value = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '');
                break;
              case 'snake':
                input.value = str.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
                break;
              case 'kebab':
                input.value = str.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
                break;
              case 'constant':
                input.value = str.trim().toUpperCase().replace(/[^a-zA-Z0-9]+/g, '_');
                break;
              case 'alternating':
                input.value = str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
                break;
            }
          }

          function copyCaseText() {
            navigator.clipboard.writeText(document.getElementById('case-input').value);
          }
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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; URL Slug Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">URL Slug Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert titles and headlines into clean, URL-safe, SEO-friendly slugs stripping special characters and normalizing accents.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input Title / Headline</label>
              <input type="text" id="slug-in" class="text-input" placeholder="e.g. 10 Best Modern Web Development Tools for 2026!" oninput="makeSlug()" />
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
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
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="slug-out" class="code-input" style="font-size: 1.1rem; font-weight: bold; color: var(--fg);" readonly />
                <button class="btn-primary" onclick="copySlug()">Copy</button>
              </div>
            </div>
          </div>
        </div>

        <script>
          const STOP_WORDS = new Set(["a","an","and","are","as","at","be","but","by","for","if","in","into","is","it","no","not","of","on","or","such","that","the","their","then","there","these","they","this","to","was","will","with"]);

          function makeSlug() {
            let val = document.getElementById('slug-in').value || '';
            const sep = document.getElementById('slug-sep').value;
            const rmStop = document.getElementById('slug-stop').checked;

            val = val.normalize('NFD').replace(/[\\u0300-\\u036f]/g, ''); // strip accents
            let words = val.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\\s+/).filter(Boolean);

            if (rmStop) {
              words = words.filter(w => !STOP_WORDS.has(w));
            }

            document.getElementById('slug-out').value = words.join(sep);
          }

          function copySlug() {
            navigator.clipboard.writeText(document.getElementById('slug-out').value);
          }

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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Fancy Text Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Fancy Unicode Text Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Transform normal letters into stylish Unicode glyphs for Discord, Twitter/X, Instagram, and Reddit usernames and bios.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Type Your Text</label>
              <input type="text" id="fancy-in" class="text-input" value="Digital Tools Shed" oninput="genFancy()" style="font-size: 1.1rem;" />
            </div>

            <div id="fancy-results" style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;"></div>
          </div>
        </div>

        <script>
          const FONTS = [
            { name: 'Fraktur / Gothic', map: { a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷',A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝔒',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'} },
            { name: 'Bold Sans', map: { a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',y:'𝘆',z:'𝘇',A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',Y:'𝗬',Z:'𝗭',0:'𝟬',1:'𝟭',2:'𝟮',3:'𝟯',4:'𝟰',5:'𝟱',6:'𝟲',7:'𝟳',8:'𝟴',9:'𝟵'} },
            { name: 'Double Struck / Blackboard', map: { a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫',A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ'} },
            { name: 'Circled', map: { a:'ⓐ',b:'ⓑ',c:'ⓒ',d:'ⓓ',e:'ⓔ',f:'ⓕ',g:'ⓖ',h:'ⓗ',i:'ⓘ',j:'ⓙ',k:'ⓚ',l:'ⓛ',m:'ⓜ',n:'ⓝ',o:'ⓞ',p:'ⓟ',q:'ⓠ',r:'ⓡ',s:'ⓢ',t:'ⓣ',u:'ⓤ',v:'ⓥ',w:'ⓦ',x:'ⓧ',y:'ⓨ',z:'ⓩ',A:'Ⓐ',B:'Ⓑ',C:'Ⓒ',D:'Ⓓ',E:'Ⓔ',F:'Ⓕ',G:'Ⓖ',H:'Ⓗ',I:'Ⓘ',J:'Ⓙ',K:'Ⓚ',L:'Ⓛ',M:'Ⓜ',N:'Ⓝ',O:'Ⓞ',P:'Ⓟ',Q:'Ⓠ',R:'Ⓡ',S:'Ⓢ',T:'Ⓣ',U:'Ⓤ',V:'Ⓥ',W:'Ⓦ',X:'Ⓧ',Y:'Ⓨ',Z:'Ⓩ',0:'⓪',1:'①',2:'②',3:'③',4:'④',5:'⑤',6:'⑥',7:'⑦',8:'⑧',9:'⑨'} },
            { name: 'Squared / Boxed', map: { a:'🄰',b:'🄱',c:'🄲',d:'🄳',e:'🄴',f:'🄵',g:'🄶',h:'🄷',i:'🄸',j:'🄹',k:'🄺',l:'🄻',m:'🄼',n:'🄽',o:'🄾',p:'🄿',q:'🅀',r:'🅁',s:'🅂',t:'🅃',u:'🅄',v:'🅅',w:'🅆',x:'🅇',y:'🅈',z:'🅉',A:'🄰',B:'🄱',C:'🄲',D:'🄳',E:'🄴',F:'🄵',G:'🄶',H:'🄷',I:'🄸',J:'🄹',K:'🄺',L:'🄻',M:'🄼',N:'🄽',O:'🄾',P:'🄿',Q:'🅀',R:'🅁',S:'🅂',T:'🅃',U:'🅄',V:'🅅',W:'🅆',X:'🅇',Y:'🅈',Z:'🅉'} }
          ];

          function genFancy() {
            const val = document.getElementById('fancy-in').value;
            const container = document.getElementById('fancy-results');
            container.innerHTML = '';

            FONTS.forEach(font => {
              const converted = val.split('').map(c => font.map[c] || c).join('');
              const row = document.createElement('div');
              row.style.cssText = 'background: var(--surface-alt); border: 1px solid var(--border); padding: 0.85rem 1rem; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; gap: 1rem;';
              row.innerHTML = '<div>' +
                '<div style="font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">' + font.name + '</div>' +
                '<div style="font-size: 1.15rem; margin-top: 0.2rem; color: var(--fg); word-break: break-all;">' + converted + '</div>' +
                '</div>' +
                '<button class="btn-primary" style="flex-shrink: 0;" onclick="navigator.clipboard.writeText(\'' + converted.replace(/'/g, "\\'") + '\')">Copy</button>';
              container.appendChild(row);
            });
          }

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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Morse Code Translator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Morse Code Translator & Audio Player</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Convert text to international Morse code dots and dashes, or translate Morse back to readable text with audio playback.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">English Text</label>
              <textarea id="morse-text" class="code-input" style="height: 100px;" placeholder="Type text..." oninput="textToMorse()"></textarea>
            </div>

            <div class="field-group">
              <label class="field-label">Morse Code (. and -)</label>
              <textarea id="morse-code" class="code-input" style="height: 100px; font-size: 1.1rem; letter-spacing: 0.1em;" placeholder="Type Morse code..." oninput="morseToText()"></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="playMorse()">&#x25B6; Play Audio Beeps</button>
              <button class="btn-sec" onclick="copyMorse()">Copy Morse</button>
            </div>
          </div>
        </div>

        <script>
          const MORSE_MAP = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
            '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
            '9': '----.', '0': '-----', ' ': '/'
          };

          const REVERSE_MORSE = {};
          Object.keys(MORSE_MAP).forEach(k => REVERSE_MORSE[MORSE_MAP[k]] = k);

          function textToMorse() {
            const val = document.getElementById('morse-text').value.toUpperCase();
            const res = val.split('').map(c => MORSE_MAP[c] || '').join(' ');
            document.getElementById('morse-code').value = res;
          }

          function morseToText() {
            const val = document.getElementById('morse-code').value.trim();
            const words = val.split(' / ');
            const decoded = words.map(w => w.split(' ').map(c => REVERSE_MORSE[c] || '').join('')).join(' ');
            document.getElementById('morse-text').value = decoded;
          }

          function copyMorse() {
            navigator.clipboard.writeText(document.getElementById('morse-code').value);
          }

          async function playMorse() {
            const code = document.getElementById('morse-code').value;
            if (!code) return;

            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const dotTime = 0.08;

            let curTime = ctx.currentTime + 0.1;

            for (const char of code) {
              if (char === '.' || char === '-') {
                const dur = char === '.' ? dotTime : dotTime * 3;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.frequency.value = 650;
                osc.type = 'sine';
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(curTime);
                osc.stop(curTime + dur);
                curTime += dur + dotTime;
              } else if (char === ' ') {
                curTime += dotTime * 2;
              } else if (char === '/') {
                curTime += dotTime * 6;
              }
            }
          }
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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Binary Text Converter
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Binary to Text & Text to Binary Converter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Encode plain text into 8-bit binary numbers or decode binary code strings back to readable English.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Plain Text</label>
              <textarea id="bin-text" class="code-input" style="height: 120px;" placeholder="Type text..." oninput="textToBin()"></textarea>
            </div>

            <div class="field-group">
              <label class="field-label">Binary Code (8-bit bytes)</label>
              <textarea id="bin-code" class="code-input" style="height: 120px;" placeholder="e.g. 01001000 01101001" oninput="binToText()"></textarea>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="copyBin()">Copy Binary</button>
            </div>
          </div>
        </div>

        <script>
          function textToBin() {
            const val = document.getElementById('bin-text').value;
            const res = Array.from(val).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
            document.getElementById('bin-code').value = res;
          }

          function binToText() {
            const val = document.getElementById('bin-code').value.trim();
            if (!val) { document.getElementById('bin-text').value = ''; return; }
            try {
              const bytes = val.split(/\\s+/);
              const chars = bytes.map(b => String.fromCharCode(parseInt(b, 2))).join('');
              document.getElementById('bin-text').value = chars;
            } catch(e) {}
          }

          function copyBin() {
            navigator.clipboard.writeText(document.getElementById('bin-code').value);
          }
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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Zalgo Text Generator
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Zalgo Glitch Text Generator</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Stack combining diacritical Unicode marks above, middle, and below characters to generate chaotic glitch text.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Plain Text</label>
              <input type="text" id="zalgo-in" class="text-input" value="He comes" oninput="genZalgo()" />
            </div>

            <div class="field-group">
              <label class="field-label">Corruption Intensity: <span id="zalgo-lvl">5</span></label>
              <input type="range" id="zalgo-range" min="1" max="15" value="5" style="width: 100%;" oninput="document.getElementById('zalgo-lvl').textContent=this.value; genZalgo();" />
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Cursed / Glitched Output</label>
              <div id="zalgo-out" class="result-box" style="font-size: 1.3rem; min-height: 80px; line-height: 2; overflow-x: auto;"></div>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="copyZalgo()">Copy Glitched Text</button>
            </div>
          </div>
        </div>

        <script>
          const ZALGO_UP = [0x030d,0x030e,0x0304,0x0305,0x033f,0x0311,0x0306,0x0310,0x0352,0x0357,0x0358,0x0342,0x0343,0x0344,0x034a,0x034b,0x034c,0x0350,0x0300,0x0301,0x0302,0x0303,0x0307,0x0308,0x0309,0x030a,0x030b,0x030c];
          const ZALGO_DOWN = [0x0316,0x0317,0x0318,0x0319,0x031c,0x031d,0x031e,0x031f,0x0320,0x0324,0x0325,0x0326,0x0329,0x032a,0x032b,0x032c,0x032d,0x032e,0x032f,0x0330,0x0331,0x0332,0x0333,0x0339,0x033a,0x033b,0x033c];

          function genZalgo() {
            const val = document.getElementById('zalgo-in').value;
            const lvl = parseInt(document.getElementById('zalgo-range').value, 10);

            let res = '';
            for (const c of val) {
              if (c === ' ') { res += ' '; continue; }
              res += c;
              for (let i = 0; i < lvl; i++) {
                res += String.fromCharCode(ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)]);
                res += String.fromCharCode(ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)]);
              }
            }
            document.getElementById('zalgo-out').textContent = res;
          }

          function copyZalgo() {
            navigator.clipboard.writeText(document.getElementById('zalgo-out').textContent);
          }

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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Whitespace Cleaner
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Whitespace Cleaner & Line Formatter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Clean messy text by removing duplicate spaces, stripping leading/trailing whitespace, and eliminating empty blank lines.
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Input Text</label>
              <textarea id="ws-input" class="code-input" style="height: 180px;" placeholder="Paste text here..."></textarea>
            </div>

            <div class="grid-options" style="margin-bottom: 1.5rem;">
              <label class="opt-label"><input type="checkbox" id="ws-trim" checked> Trim Leading & Trailing Spaces</label>
              <label class="opt-label"><input type="checkbox" id="ws-spaces" checked> Collapse Multiple Spaces</label>
              <label class="opt-label"><input type="checkbox" id="ws-blank" checked> Remove Blank / Empty Lines</label>
              <label class="opt-label"><input type="checkbox" id="ws-tabs"> Convert Tabs to 2 Spaces</label>
            </div>

            <div class="action-bar">
              <button class="btn-primary" onclick="cleanWhitespace()">Clean Whitespace</button>
              <button class="btn-sec" onclick="copyClean()">Copy Clean Text</button>
            </div>

            <div class="field-group" style="margin-top: 1.5rem;">
              <label class="field-label">Cleaned Output</label>
              <textarea id="ws-output" class="code-input" style="height: 180px;" readonly></textarea>
            </div>
          </div>
        </div>

        <script>
          function cleanWhitespace() {
            let str = document.getElementById('ws-input').value;
            if (document.getElementById('ws-tabs').checked) {
              str = str.replace(/\\t/g, '  ');
            }
            if (document.getElementById('ws-spaces').checked) {
              str = str.replace(/[ \\t]+/g, ' ');
            }
            let lines = str.split('\\n');
            if (document.getElementById('ws-trim').checked) {
              lines = lines.map(l => l.trim());
            }
            if (document.getElementById('ws-blank').checked) {
              lines = lines.filter(l => l.length > 0);
            }
            document.getElementById('ws-output').value = lines.join('\\n');
          }

          function copyClean() {
            navigator.clipboard.writeText(document.getElementById('ws-output').value);
          }
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
        <div class="article-container" style="max-width: 900px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Palindrome Checker
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Palindrome Checker</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Test whether phrases or numbers read identically in reverse (e.g. <em>"A man, a plan, a canal: Panama"</em>).
          </p>

          <div class="tool-box">
            <div class="field-group">
              <label class="field-label">Enter Word or Phrase</label>
              <input type="text" id="pal-input" class="text-input" value="A man, a plan, a canal: Panama" oninput="checkPal()" style="font-size: 1.1rem;" />
            </div>

            <div id="pal-result" class="result-box" style="margin-top: 1.5rem;"></div>
          </div>
        </div>

        <script>
          function checkPal() {
            const raw = document.getElementById('pal-input').value;
            const cleaned = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
            const reversed = cleaned.split('').reverse().join('');
            const isPal = cleaned.length > 0 && cleaned === reversed;

            const res = document.getElementById('pal-result');
            if (!cleaned) { res.textContent = 'Enter text to test.'; return; }

            res.innerHTML = '<div style="font-size: 1.2rem; font-weight: bold; color: ' + (isPal ? '#22c55e' : '#ef4444') + '; margin-bottom: 0.5rem;">' +
                (isPal ? '✓ Yes, it is a Palindrome!' : '✗ No, not a palindrome.') +
              '</div>' +
              '<div style="font-size: 0.85rem; color: var(--text-muted);">' +
                'Normalized forward: <code>' + cleaned + '</code><br>' +
                'Normalized backward: <code>' + reversed + '</code>' +
              '</div>';
          }
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
          .md-preview-pane { background: var(--bg); border: 1px solid var(--border); padding: 1.25rem; border-radius: 4px; min-height: 350px; line-height: 1.6; color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .md-preview-pane h1 { font-size: 1.8rem; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; margin-top: 1rem; }
          .md-preview-pane h2 { font-size: 1.4rem; border-bottom: 1px solid var(--border); padding-bottom: 0.2rem; margin-top: 1rem; }
          .md-preview-pane h3 { font-size: 1.15rem; margin-top: 0.8rem; }
          .md-preview-pane pre { background: var(--surface-alt); padding: 0.75rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.85rem; border: 1px solid var(--border); }
          .md-preview-pane code { background: var(--surface-alt); padding: 0.15rem 0.35rem; border-radius: 3px; font-family: var(--mono); font-size: 0.85rem; }
          .md-preview-pane blockquote { border-left: 4px solid var(--border); margin: 0; padding-left: 1rem; color: var(--text-muted); font-style: italic; }
          .md-preview-pane table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
          .md-preview-pane th, .md-preview-pane td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; text-align: left; }
          .md-preview-pane th { background: var(--surface-alt); font-weight: bold; }
        </style>

        <div class="article-container" style="max-width: 1000px;">
          <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
            <a href="/">Home</a> &gt; <a href="/text/">Text & Writing</a> &gt; Markdown Preview
          </nav>
          <h1 style="font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;">Markdown Live Preview & HTML Converter</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;">
            Write, edit, and preview GitHub Flavored Markdown (GFM) with real-time HTML rendering, word metrics, and instant HTML export.
          </p>

          <div class="tool-box">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">
                <span id="md-words">0</span> words | <span id="md-chars">0</span> characters | ~<span id="md-read">0</span> min read
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn-sec" onclick="loadSampleMd()" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">Load Sample</button>
                <button class="btn-sec" onclick="copyHtmlOutput()" style="font-size: 0.75rem; padding: 0.3rem 0.6rem;">Copy HTML</button>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;" id="md-editor-grid">
              <div>
                <label class="field-label">Markdown Input</label>
                <textarea id="md-input" class="code-input" style="height: 450px; font-family: var(--mono); font-size: 0.85rem; resize: vertical;" oninput="renderMarkdown()"></textarea>
              </div>
              <div>
                <label class="field-label">Live Rendered Preview</label>
                <div id="md-preview" class="md-preview-pane" style="height: 450px; overflow-y: auto;"></div>
              </div>
            </div>

            <div class="action-bar" style="margin-top: 1.25rem;">
              <button class="btn-primary" onclick="copyHtmlOutput()">Copy Generated HTML</button>
              <button class="btn-sec" onclick="downloadFile('document.html', getConvertedHtml())">Download HTML</button>
              <button class="btn-sec" onclick="downloadFile('document.md', document.getElementById('md-input').value)">Download Markdown</button>
            </div>
          </div>
        </div>

        <script>
          var B = String.fromCharCode(96);
          var sampleMarkdown = '# Markdown Cheatsheet\\n\\nWelcome to the **Digital Tools Shed** Markdown Previewer!\\n\\n## Formatting Styles\\n- **Bold text** with ' + B + '**double asterisks**' + B + '\\n- *Italic text* with ' + B + '*single asterisks*' + B + '\\n- ~~Strikethrough~~ with ' + B + '~~tildes~~' + B + '\\n\\n### Blockquote Example\\n> \\"Simplicity is prerequisite for reliability.\\" — Edsger W. Dijkstra\\n\\n### Code Block\\n' + B + B + B + 'javascript\\nfunction greet(name) {\\n  console.log(\"Hello, \" + name + \"!\");\\n}\\n' + B + B + B + '\\n\\n### Data Table\\n| Feature | Status | Performance |\\n| :--- | :--- | :--- |\\n| Real-time Parser | Active | 60 FPS |\\n| Zero Uploads | Enabled | 100% Private |\\n| Export to HTML | Ready | Instant |\\n';

          function parseMarkdownSimple(md) {
            var B = String.fromCharCode(96);
            var reCodeBlock = new RegExp(B + B + B + '([a-z]*)\\\\n([\\\\s\\\\S]*?)' + B + B + B, 'g');
            var reInlineCode = new RegExp(B + '([^' + B + ']+)' + B, 'g');
            var html = md
              .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
              .replace(reCodeBlock, '<pre><code>$2</code></pre>')
              .replace(reInlineCode, '<code>$1</code>')
              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
              .replace(/^\\> (.*$)/gim, '<blockquote>$1</blockquote>')
              .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
              .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
              .replace(/~~(.*?)~~/g, '<del>$1</del>')
              .replace(/\\|(.+)\\|\\n\\|[-| :]+\\|\\n((?:\\|.+\\|\\n?)+)/g, function(match, header, rows) {
                var ths = header.split('|').filter(Boolean).map(function(h) { return '<th>' + h.trim() + '</th>'; }).join('');
                var trs = rows.trim().split('\\n').map(function(r) {
                  var tds = r.split('|').filter(Boolean).map(function(d) { return '<td>' + d.trim() + '</td>'; }).join('');
                  return '<tr>' + tds + '</tr>';
                }).join('');
                return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
              })
              .replace(/^\\- (.*$)/gim, '<li>$1</li>')
              .replace(/\\n\\n+/g, '</p><p>');

            return '<p>' + html + '</p>';
          }

          function renderMarkdown() {
            var raw = document.getElementById('md-input').value;
            var html = parseMarkdownSimple(raw);
            document.getElementById('md-preview').innerHTML = html;

            var words = raw.trim() ? raw.trim().split(/\\s+/).length : 0;
            document.getElementById('md-words').textContent = words;
            document.getElementById('md-chars').textContent = raw.length;
            document.getElementById('md-read').textContent = Math.ceil(words / 200);
          }

          function loadSampleMd() {
            document.getElementById('md-input').value = sampleMarkdown;
            renderMarkdown();
          }

          function getConvertedHtml() {
            return document.getElementById('md-preview').innerHTML;
          }

          function copyHtmlOutput() {
            navigator.clipboard.writeText(getConvertedHtml());
            alert('Copied HTML output to clipboard!');
          }

          function downloadFile(filename, content) {
            var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
          }

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
