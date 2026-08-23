import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

function buildDeveloperTools() {
  const convertDist = join(DIST, 'convert');
  ensureDir(convertDist);

  // 1. JSON Obfuscator & Compressor
  const jsonObfuscatorBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">JSON Obfuscator & Compressor</h1>
      <p>Minify, compress, hex-escape strings, and mangle JSON keys with reversible mapping dictionaries. 100% in-browser security.</p>
    </div>

    <div class="tool-workspace" style="max-width: 950px; margin: 1.5rem 0;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.5rem; display: block;">Input JSON Payload</label>
          <textarea id="jsonInput" style="width: 100%; height: 260px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" placeholder='{\n  "userId": 10842,\n  "username": "developer_99",\n  "permissions": ["admin", "editor"],\n  "settings": {\n    "theme": "dark",\n    "debug": true\n  }\n}'></textarea>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label style="font-family: var(--serif); font-weight: bold;">Output JSON / Obfuscated</label>
            <span id="statSavings" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Size: 0 B</span>
          </div>
          <textarea id="jsonOutput" style="width: 100%; height: 260px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" readonly placeholder="Processed output will appear here..."></textarea>
        </div>
      </div>

      <!-- Obfuscation Controls -->
      <div style="border: 1px solid var(--border); background: var(--surface-alt); padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.75rem;">Obfuscation & Compression Options:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optMangleKeys" checked />
            <span>Mangle Object Keys (_0x1, _0x2)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optUnicodeEscape" checked />
            <span>Unicode Hex Escape Strings (\\u00xx)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optMinify" checked />
            <span>Ultra Minify (Strip Whitespace)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optWrapBase64" />
            <span>Wrap in Base64 Data Payload</span>
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <button id="btnObfuscate" class="btn-primary">OBFUSCATE & COMPRESS</button>
        <button id="btnMinifyOnly" class="btn-secondary">MINIFY ONLY</button>
        <button id="btnDeobfuscate" class="btn-secondary">RESTORE / DEOBFUSCATE</button>
        <button id="btnCopyJson" class="btn-secondary">COPY OUTPUT</button>
        <button id="btnDownloadJson" class="btn-secondary">DOWNLOAD .JSON</button>
      </div>

      <div id="dictMapContainer" style="display: none; margin-top: 1.5rem; border: 1px solid var(--border); padding: 1rem; background: var(--surface);">
        <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Key Reversal Map Dictionary:</span>
        <textarea id="dictMapOutput" style="width: 100%; height: 80px; margin-top: 0.5rem; padding: 0.5rem; font-family: var(--mono); font-size: 0.8rem;" readonly></textarea>
      </div>
    </div>

    <script>
      let keyMapDictionary = {};

      function unicodeEscape(str) {
        return str.split('').map(char => {
          const code = char.charCodeAt(0);
          return '\\\\u' + ('0000' + code.toString(16)).slice(-4);
        }).join('');
      }

      function unicodeUnescape(str) {
        return str.replace(/\\\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
      }

      function mangleObjectKeys(obj, map = {}, counter = { val: 1 }) {
        if (Array.isArray(obj)) {
          return obj.map(item => mangleObjectKeys(item, map, counter));
        } else if (obj !== null && typeof obj === 'object') {
          const newObj = {};
          for (const key of Object.keys(obj)) {
            if (!map[key]) {
              map[key] = '_0x' + (counter.val++).toString(16);
            }
            const mangledKey = map[key];
            newObj[mangledKey] = mangleObjectKeys(obj[key], map, counter);
          }
          return newObj;
        }
        return obj;
      }

      function restoreObjectKeys(obj, map) {
        const reverseMap = {};
        for (const [k, v] of Object.entries(map)) reverseMap[v] = k;

        function walk(target) {
          if (Array.isArray(target)) {
            return target.map(walk);
          } else if (target !== null && typeof target === 'object') {
            const newObj = {};
            for (const key of Object.keys(target)) {
              const originalKey = reverseMap[key] || key;
              newObj[originalKey] = walk(target[key]);
            }
            return newObj;
          }
          return target;
        }
        return walk(obj);
      }

      function updateStats(origText, resultText) {
        const origBytes = new Blob([origText]).size;
        const resBytes = new Blob([resultText]).size;
        const diff = origBytes > 0 ? (((resBytes - origBytes) / origBytes) * 100).toFixed(1) : 0;
        const sign = diff > 0 ? '+' : '';
        document.getElementById('statSavings').innerText = 'Size: ' + resBytes + ' B (' + sign + diff + '%) | Original: ' + origBytes + ' B';
      }

      document.getElementById('btnObfuscate').addEventListener('click', () => {
        const raw = document.getElementById('jsonInput').value.trim();
        if (!raw) { alert('Please enter valid JSON.'); return; }

        try {
          const parsed = JSON.parse(raw);
          const mangleKeys = document.getElementById('optMangleKeys').checked;
          const doUnicode = document.getElementById('optUnicodeEscape').checked;
          const doBase64 = document.getElementById('optWrapBase64').checked;

          let targetObj = parsed;
          keyMapDictionary = {};

          if (mangleKeys) {
            targetObj = mangleObjectKeys(parsed, keyMapDictionary);
            document.getElementById('dictMapContainer').style.display = 'block';
            document.getElementById('dictMapOutput').value = JSON.stringify(keyMapDictionary);
          } else {
            document.getElementById('dictMapContainer').style.display = 'none';
          }

          let jsonString = JSON.stringify(targetObj);

          if (doUnicode) {
            jsonString = jsonString.replace(/"([^"\\\\]*)"/g, (match, inner) => {
              return '"' + unicodeEscape(inner) + '"';
            });
          }

          if (doBase64) {
            jsonString = JSON.stringify({
              "__obfuscated__": btoa(jsonString),
              "__encoding__": "base64",
              "__engine__": "digitaltoolsshed.com"
            });
          }

          document.getElementById('jsonOutput').value = jsonString;
          updateStats(raw, jsonString);

        } catch (err) {
          alert('Invalid JSON Syntax: ' + err.message);
        }
      });

      document.getElementById('btnMinifyOnly').addEventListener('click', () => {
        const raw = document.getElementById('jsonInput').value.trim();
        try {
          const minified = JSON.stringify(JSON.parse(raw));
          document.getElementById('jsonOutput').value = minified;
          document.getElementById('dictMapContainer').style.display = 'none';
          updateStats(raw, minified);
        } catch (e) {
          alert('Invalid JSON Syntax');
        }
      });

      document.getElementById('btnDeobfuscate').addEventListener('click', () => {
        let raw = document.getElementById('jsonInput').value.trim() || document.getElementById('jsonOutput').value.trim();
        try {
          if (raw.includes('\\\\u')) {
            raw = unicodeUnescape(raw);
          }
          let parsed = JSON.parse(raw);

          if (parsed.__obfuscated__ && parsed.__encoding__ === 'base64') {
            raw = atob(parsed.__obfuscated__);
            if (raw.includes('\\\\u')) raw = unicodeUnescape(raw);
            parsed = JSON.parse(raw);
          }

          const dictText = document.getElementById('dictMapOutput').value;
          if (dictText) {
            try {
              const dict = JSON.parse(dictText);
              parsed = restoreObjectKeys(parsed, dict);
            } catch (e) {}
          }

          const formatted = JSON.stringify(parsed, null, 2);
          document.getElementById('jsonOutput').value = formatted;
          updateStats(raw, formatted);
        } catch (e) {
          alert('Deobfuscation error: ' + e.message);
        }
      });

      document.getElementById('btnCopyJson').addEventListener('click', () => {
        const out = document.getElementById('jsonOutput').value;
        if (!out) return;
        navigator.clipboard.writeText(out);
        alert('Copied output JSON to clipboard!');
      });

      document.getElementById('btnDownloadJson').addEventListener('click', () => {
        const out = document.getElementById('jsonOutput').value;
        if (!out) return;
        const blob = new Blob([out], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'obfuscated_payload.json';
        a.click();
      });
    </script>
  `;

  writeFileSync(join(convertDist, 'json-obfuscator.html'), renderPage({
    title: 'JSON Obfuscator & Compressor — Protect & Minify Payloads | Digital Tools Shed',
    metaDesc: 'Free online JSON obfuscator and compressor. Mangle JSON keys, encode unicode hex string escapes, minify payloads, and reduce file size.',
    canonical: `${DOMAIN}/convert/json-obfuscator.html`,
    bodyContent: jsonObfuscatorBody,
    currentPath: '/convert/json-obfuscator.html'
  }));

  // 2. ESBuild & JavaScript Decompiler & Beautifier
  const esbuildDecompilerBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">ESBuild & JavaScript Decompiler</h1>
      <p>Reverse-engineer, unminify, unpack bundler IIFEs, expand comma expressions, and restore readable ES6+ JavaScript code.</p>
    </div>

    <div class="tool-workspace" style="max-width: 950px; margin: 1.5rem 0;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.5rem; display: block;">Minified JS / ESBuild Bundle</label>
          <textarea id="jsInput" style="width: 100%; height: 320px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" placeholder='(()=>{"use strict";var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})};var a=1,b=2,c=function(x){return x>0?(console.log("\\x44\\x6f\\x6e\\x65"),x*2):0};window.app={compute:c};})();'></textarea>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <label style="font-family: var(--serif); font-weight: bold;">Decompiled & Formatted JS</label>
            <span id="jsStats" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Lines: 0</span>
          </div>
          <textarea id="jsOutput" style="width: 100%; height: 320px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem;" readonly placeholder="Decompiled and syntax-restored code will appear here..."></textarea>
        </div>
      </div>

      <!-- Decompiler Configuration Options -->
      <div style="border: 1px solid var(--border); background: var(--surface-alt); padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-family: var(--serif); font-weight: bold; margin-bottom: 0.75rem;">Decompilation & Unpacking Pipeline:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optDecodeHexStrings" checked />
            <span>Decode Hex & Unicode Escapes (\\x44 -> "D")</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optUnpackBundlers" checked />
            <span>Unpack Bundler Wrappers (__esm, __export, __toESM)</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optExpandCommas" checked />
            <span>Expand Multi-Variable & Comma Declarations</span>
          </label>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-family: var(--serif); cursor: pointer;">
            <input type="checkbox" id="optExpandShortCircuits" checked />
            <span>Expand Short-Circuit Conditionals (a && b())</span>
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <button id="btnDecompile" class="btn-primary">DECOMPILE & UNMINIFY</button>
        <button id="btnCopyJs" class="btn-secondary">COPY CODE</button>
        <button id="btnDownloadJs" class="btn-secondary">EXPORT .JS FILE</button>
      </div>
    </div>

    <!-- JS-BEAUTIFY CDN FOR ROBUST AST FORMATTING -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.9/beautify.min.js"></script>
    <script>
      function decodeHexAndUnicode(code) {
        return code.replace(/\\\\x([0-9a-fA-F]{2})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        }).replace(/\\\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          return String.fromCharCode(parseInt(hex, 16));
        });
      }

      function unpackBundlerHelpers(code) {
        return code
          .replace(/var __defProp\\s*=\\s*Object\\.defineProperty;/g, '/* ESBuild Property Definition Helper */\\nconst defineProperty = Object.defineProperty;')
          .replace(/var __export\\s*=\\s*\\(target,\\s*all\\)\\s*=>\\s*\\{[^}]*\\};/g, '/* ESBuild Module Export Dispatcher */\\nfunction exportModule(target, all) { for (const name in all) Object.defineProperty(target, name, { get: all[name], enumerable: true }); }')
          .replace(/var __toESM\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{[^}]*\\};/g, '/* ESBuild CommonJS to ESM Interop */\\nfunction toESM(mod, isNodeMode, target) { return isNodeMode || !mod || !mod.__esModule ? Object.assign(Object.defineProperty({}, "__esModule", { value: true }), mod) : mod; }')
          .replace(/var __commonJS\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{[^}]*\\};/g, '/* ESBuild CommonJS Wrapper */\\nfunction commonJS(cb, mod) { return function() { return mod || cb((mod = { exports: {} }).exports, mod), mod.exports; }; }');
      }

      function expandCommaStatements(code) {
        return code.replace(/;var\\s+([a-zA-Z0-9_$]+=[^,;]+),([a-zA-Z0-9_$]+=[^,;]+);/g, ';\\nvar $1;\\nvar $2;');
      }

      function decompileJs(code) {
        let transformed = code;

        if (document.getElementById('optDecodeHexStrings').checked) {
          transformed = decodeHexAndUnicode(transformed);
        }

        if (document.getElementById('optUnpackBundlers').checked) {
          transformed = unpackBundlerHelpers(transformed);
        }

        if (document.getElementById('optExpandCommas').checked) {
          transformed = expandCommaStatements(transformed);
        }

        if (typeof js_beautify === 'function') {
          transformed = js_beautify(transformed, {
            indent_size: 2,
            space_in_empty_paren: false,
            preserve_newlines: true,
            max_preserve_newlines: 2,
            break_chained_methods: false,
            keep_array_indentation: false,
            unescape_strings: true,
            wrap_line_length: 100,
            e4x: true,
            comma_first: false,
            brace_style: "collapse,preserve-inline"
          });
        }

        return transformed;
      }

      document.getElementById('btnDecompile').addEventListener('click', () => {
        const raw = document.getElementById('jsInput').value.trim();
        if (!raw) {
          alert('Please enter or paste minified JavaScript code.');
          return;
        }

        const decompiled = decompileJs(raw);
        document.getElementById('jsOutput').value = decompiled;

        const lines = decompiled.split('\\n').length;
        const bytes = new Blob([decompiled]).size;
        document.getElementById('jsStats').innerText = lines + ' Lines | ' + (bytes / 1024).toFixed(2) + ' KB';
      });

      document.getElementById('btnCopyJs').addEventListener('click', () => {
        const out = document.getElementById('jsOutput').value;
        if (!out) return;
        navigator.clipboard.writeText(out);
        alert('Decompiled JS code copied to clipboard!');
      });

      document.getElementById('btnDownloadJs').addEventListener('click', () => {
        const out = document.getElementById('jsOutput').value;
        if (!out) return;
        const blob = new Blob([out], { type: 'application/javascript' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'decompiled_bundle.js';
        a.click();
      });
    </script>
  `;

  writeFileSync(join(convertDist, 'esbuild-decompiler.html'), renderPage({
    title: 'ESBuild & JavaScript Decompiler — Free Reverse Engineering & Unminifier | Digital Tools Shed',
    metaDesc: 'Decompile, unminify, format, and reverse engineer minified ESBuild and Webpack JavaScript bundles in your browser.',
    canonical: `${DOMAIN}/convert/esbuild-decompiler.html`,
    bodyContent: esbuildDecompilerBody,
    currentPath: '/convert/esbuild-decompiler.html'
  }));

  console.log('  ✓ Built Developer Suite (json-obfuscator.html, esbuild-decompiler.html)');
}

// ─── MEDIA SUITE ───────────────────────────────────────────────────────────

export { buildDeveloperTools };
