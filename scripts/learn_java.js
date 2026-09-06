// scripts/learn_java.js - Complete Java Education Suite & Interactive Playground for Digital Tools Shed

export function buildJavaLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const learnDist = join(DIST, 'learn');
  const javaDist = join(learnDist, 'java');
  ensureDir(learnDist);
  ensureDir(javaDist);

  // ─── HELPER RENDERING FUNCTIONS ──────────────────────────────────────────
  function renderCopyCard(snippet, label, btnId) {
    const safeSnippet = snippet.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);">${label}</span>
          <button id="${btnId}" class="btn-copy" onclick="copySnippet('${btnId}', \`${safeSnippet}\`)" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; cursor: pointer; border-radius: 4px; background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg);">📋 Copy</button>
        </div>
        <pre style="margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);"><code>${snippet.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
      </div>
    `;
  }

  function renderJavaTraps(traps) {
    const borderColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    return `
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem;">⚠️ 5 Fatal Traps & Engineering Pitfalls</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${traps.map((t, idx) => `
            <div class="trap-card" style="border-left: 4px solid ${borderColors[idx % borderColors.length]}; background: var(--surface); padding: 1.25rem; border-radius: 0 6px 6px 0; border-top: 1px solid var(--border); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border);">
              <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: ${borderColors[idx % borderColors.length]}; font-weight: bold; margin-bottom: 0.25rem;">Trap #${idx + 1}: ${t.title}</div>
              <div style="font-size: 0.92rem; line-height: 1.6; color: var(--fg);">${t.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderJavaFaqs(faqs) {
    return `
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem;">💬 Frequently Asked Questions</h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${faqs.map(f => `
            <details class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden;">
              <summary style="padding: 1rem; font-weight: 600; cursor: pointer; color: var(--fg); font-size: 0.95rem;">${f.q}</summary>
              <div style="padding: 0 1rem 1rem; color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${f.a}</div>
            </details>
          `).join('')}
        </div>
      </div>
    `;
  }

  function generateFaqSchema(faqs, title, url) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": title,
      "url": url,
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    };
    return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
  }

  // ─── EMBEDDABLE JAVA PLAYGROUND COMPONENT ────────────────────────────────
  const javaPlayground = (code, id) => `
    <div style="margin: 1.75rem 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--surface);">
      <div style="background: var(--surface-alt); padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border);">
        <span>☕ JAVA INTERACTIVE RUNTIME & SIMULATOR</span>
        <span style="font-size: 0.7rem; background: rgba(59,130,246,0.15); color: #3b82f6; padding: 0.15rem 0.4rem; border-radius: 3px; font-weight: bold;">JDK 21 Ready</span>
      </div>
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; min-height: 220px; background: var(--bg); position: relative;" id="pg-${id}">
        <div style="position: relative; height: 100%;">
          <textarea id="pg-code-${id}" style="width: 100%; height: 100%; min-height: 220px; padding: 1rem; border: none; border-right: 1px solid var(--border); background: var(--bg); color: var(--fg); font-family: var(--mono); font-size: 0.88rem; line-height: 1.5; resize: vertical; outline: none; box-sizing: border-box;" spellcheck="false" oninput="handleJavaAutocomplete('${id}', this, event)">${code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
          <div id="ac-popup-${id}" style="display: none; position: absolute; background: var(--surface); border: 1px solid var(--border-strong, #3b82f6); border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); z-index: 100; font-family: var(--mono); font-size: 0.8rem; max-height: 150px; overflow-y: auto;"></div>
        </div>
        <div style="display: flex; flex-direction: column; background: #0a0e17; color: #38bdf8; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.4rem 0.8rem; background: #111827; color: #94a3b8; font-size: 0.7rem; border-bottom: 1px solid #1e293b;">TERMINAL OUTPUT (stdout)</div>
          <pre id="pg-out-${id}" style="flex: 1; padding: 1rem; margin: 0; overflow: auto; white-space: pre-wrap; word-break: break-all; color: #a5f3fc;"></pre>
        </div>
      </div>
      <div style="background: var(--surface-alt); padding: 0.6rem 1rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border);">
        <div style="display: flex; gap: 0.5rem;">
          <button onclick="runJavaPlayground('${id}')" class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem; cursor: pointer;">&#x25B6; Compile & Run</button>
          <button onclick="resetJavaPlayground('${id}')" class="btn-sec" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; cursor: pointer;">&#x21BA; Reset</button>
        </div>
        <span style="font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">Type <code>Sys</code>, <code>Math</code>, <code>for</code> for autocomplete</span>
      </div>
    </div>
  `;

  // ─── PLAYGROUND CLIENT SCRIPT & SIMULATOR ─────────────────────────────────
  const playgroundScript = `
    <script>
      var AUTOCOMPLETE_SUGGESTIONS = [
        { trigger: 'sys', insert: 'System.out.println("");', label: 'System.out.println()' },
        { trigger: 'sout', insert: 'System.out.println("");', label: 'sout -> System.out.println()' },
        { trigger: 'math.', insert: 'Math.sqrt()', label: 'Math.sqrt(double a)' },
        { trigger: 'math.p', insert: 'Math.pow(2, 3)', label: 'Math.pow(a, b)' },
        { trigger: 'for', insert: 'for (int i = 0; i < 5; i++) {\\n  System.out.println(i);\\n}', label: 'for loop (int i = 0; ...)' },
        { trigger: 'psvm', insert: 'public static void main(String[] args) {\\n  \\n}', label: 'public static void main(String[] args)' },
        { trigger: 'str', insert: 'String text = "Hello";', label: 'String declaration' },
        { trigger: 'sb', insert: 'StringBuilder sb = new StringBuilder();', label: 'StringBuilder sb = ...' }
      ];

      function handleJavaAutocomplete(id, textarea, event) {
        var val = textarea.value;
        var pos = textarea.selectionStart;
        var lineStart = val.lastIndexOf('\\n', pos - 1) + 1;
        var currentWord = val.slice(lineStart, pos).trim().toLowerCase();

        var popup = document.getElementById('ac-popup-' + id);
        if (!popup) return;

        if (currentWord.length < 2) {
          popup.style.display = 'none';
          return;
        }

        var matches = AUTOCOMPLETE_SUGGESTIONS.filter(function(s) {
          return s.trigger.startsWith(currentWord) || s.label.toLowerCase().includes(currentWord);
        });

        if (matches.length === 0) {
          popup.style.display = 'none';
          return;
        }

        popup.innerHTML = '';
        matches.forEach(function(m) {
          var item = document.createElement('div');
          item.style.padding = '0.35rem 0.65rem';
          item.style.cursor = 'pointer';
          item.style.borderBottom = '1px solid var(--border)';
          item.textContent = m.label;
          item.onmouseover = function() { item.style.background = 'var(--surface-hover, #222)'; };
          item.onmouseout = function() { item.style.background = 'transparent'; };
          item.onmousedown = function(e) {
            e.preventDefault();
            var before = val.slice(0, lineStart);
            var after = val.slice(pos);
            textarea.value = before + m.insert + after;
            popup.style.display = 'none';
            textarea.focus();
          };
          popup.appendChild(item);
        });

        popup.style.display = 'block';
        popup.style.top = '40px';
        popup.style.left = '20px';
      }

      function runJavaPlayground(id) {
        var code = document.getElementById('pg-code-' + id).value;
        var out = document.getElementById('pg-out-' + id);
        out.textContent = '';
        out.style.color = '#a5f3fc';

        var stdout = [];
        var System = {
          out: {
            println: function(arg) { stdout.push(arg === undefined ? '' : String(arg)); },
            print: function(arg) {
              if (stdout.length === 0) stdout.push(String(arg));
              else stdout[stdout.length - 1] += String(arg);
            },
            printf: function(fmt) {
              var args = Array.prototype.slice.call(arguments, 1);
              var str = fmt.replace(/%[dsf]/g, function() { return args.shift(); });
              stdout.push(str);
            }
          }
        };

        var StringBuilder = function(initial) {
          this.str = initial || '';
          this.append = function(s) { this.str += String(s); return this; };
          this.toString = function() { return this.str; };
          this.length = function() { return this.str.length; };
        };

        try {
          // Transpile lightweight Java constructs into browser JS for instant simulation
          var jsCode = code
            .replace(/public\\s+class\\s+\\w+\\s*\\{/g, '{')
            .replace(/public\\s+static\\s+void\\s+main\\s*\\([^)]*\\)\\s*\\{/g, '{')
            .replace(/System\\.out\\.println/g, 'System.out.println')
            .replace(/System\\.out\\.print/g, 'System.out.print')
            .replace(/System\\.out\\.printf/g, 'System.out.printf')
            .replace(/\\b(int|double|float|long|short|byte|boolean|char|String)\\s+/g, 'var ')
            .replace(/\\bfinal\\s+/g, 'const ')
            .replace(/\\bnew\\s+StringBuilder/g, 'new StringBuilder');

          var runner = new Function('System', 'StringBuilder', 'Math', jsCode);
          runner(System, StringBuilder, Math);

          if (stdout.length === 0) {
            out.textContent = '[Process finished with exit code 0 (No output)]';
            out.style.color = '#94a3b8';
          } else {
            out.textContent = stdout.join('\\n');
          }
        } catch(e) {
          out.textContent = 'Exception in thread "main" java.lang.RuntimeException: ' + e.message;
          out.style.color = '#f87171';
        }
      }

      function resetJavaPlayground(id) {
        var ta = document.getElementById('pg-code-' + id);
        ta.value = ta.getAttribute('data-original');
        var out = document.getElementById('pg-out-' + id);
        out.textContent = '';
      }

      function copySnippet(btnId, text) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function() {
            var btn = document.getElementById(btnId);
            if (btn) {
              var orig = btn.innerHTML;
              btn.innerHTML = '✓ Copied!';
              btn.style.color = '#10b981';
              setTimeout(function() { btn.innerHTML = orig; btn.style.color = ''; }, 2000);
            }
          });
        }
      }

      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('textarea[id^="pg-code-"]').forEach(function(ta) {
          ta.setAttribute('data-original', ta.value);
        });
      });
    </script>
  `;

  // ─── 10 MASTER JAVA GUIDES DATA ───────────────────────────────────────────
  const javaGuides = [
    {
      slug: '01-what-is-a-variable-eli5',
      title: 'Explain Like I’m 5: What is a Variable & What is Java?',
      metaDesc: 'Learn Java from zero: what is a variable explained for a 5-year-old, primitive data types, and why Java is strictly typed.',
      copySnippet: `// Java Primitive Types Cheat Sheet
byte    b = 127;                  // 8-bit signed integer (-128 to 127)
short   s = 32767;                // 16-bit signed integer (-32,768 to 32,767)
int     i = 2147483647;           // 32-bit signed integer (-2^31 to 2^31 - 1)
long    l = 9223372036854775807L; // 64-bit signed integer (-2^63 to 2^63 - 1)
float   f = 3.1415927f;           // 32-bit IEEE 754 floating point
double  d = 3.141592653589793;   // 64-bit IEEE 754 floating point (default)
boolean flag = true;              // 1-bit logical truth value (true/false)
char    c = 'A';                  // 16-bit Unicode UTF-16 character

// Reference Type
String  name = "Steve";           // Immutable string object reference`,
      copyLabel: '📋 Copy Java Primitive Types & Memory Spec Cheat Sheet',
      traps: [
        {
          title: 'Primitive vs. Boxed Object Reference Identity Trap',
          desc: 'Comparing boxed integers like <code>Integer a = 1000; Integer b = 1000;</code> using <code>a == b</code> returns <code>false</code>. In Java, <code>==</code> on objects compares heap memory addresses, not values. Only values between -128 and 127 are cached by the JVM integer pool. Always use <code>a.equals(b)</code> for object comparisons.'
        },
        {
          title: 'Silent Integer Overflow & Underflow',
          desc: 'Adding 1 to <code>Integer.MAX_VALUE</code> (2,147,483,647) silently wraps around to negative <code>Integer.MIN_VALUE</code> (-2,147,483,648) without throwing an error. In financial or scientific applications, use <code>Math.addExact(a, b)</code> to throw an <code>ArithmeticException</code> on overflow.'
        },
        {
          title: 'Integer Division Truncation (5 / 2 == 2)',
          desc: 'In Java, dividing two integers always yields an integer. <code>double result = 5 / 2;</code> stores <code>2.0</code>, completely discarding the fractional <code>0.5</code> without rounding. At least one operand must be cast to a floating-point type: <code>(double) 5 / 2</code>.'
        },
        {
          title: 'Uninitialized Local Variables Compilation Error',
          desc: 'Unlike class instance fields (which receive default zero/null values upon object instantiation), local variables declared inside methods are never given default values. Attempting to read an uninitialized local variable causes a compile-time failure.'
        },
        {
          title: 'Confusing Java with JavaScript (Car vs. Carpet)',
          desc: 'Java is statically typed, compiled to JVM bytecode, and designed for heavy multi-threaded enterprise services and games. JavaScript is dynamically typed, executed in web browser runtimes, and follows prototype-based inheritance. Their syntax is superficially similar, but their architectures are entirely unrelated.'
        }
      ],
      faqs: [
        {
          q: 'What is the fundamental difference between primitive and reference variables in Java?',
          a: 'Primitive variables (int, double, boolean, etc.) store the raw binary value directly inside fast stack memory. Reference variables (such as String, arrays, and custom classes) store an 8-byte memory address pointer on the stack that points to the actual object allocated on the heap.'
        },
        {
          q: 'Why does Java require explicit type declarations for every variable?',
          a: 'Java is a strongly, statically typed language. Declaring types allows the javac compiler to verify memory allocation sizes, catch type mismatch bugs at compile-time before production execution, and allow the JVM JIT compiler to optimize CPU machine code instructions.'
        },
        {
          q: 'What happens if a numeric variable exceeds its maximum allowable bit capacity?',
          a: 'Standard Java arithmetic operators (+, -, *) wrap around according to two\'s complement binary rules without throwing runtime exceptions. To guard against silent overflow corruption, use Math.addExact() or the java.math.BigInteger arbitrary-precision class.'
        },
        {
          q: 'Why are variable names written in camelCase in standard Java conventions?',
          a: 'Oracle and the Java community enforce lowerCamelCase for variable and method names (e.g. playerHealth, maximumSpeed) and UpperCamelCase for class names (e.g. BlockRenderer) to make code globally readable, standardized, and self-documenting across international teams.'
        },
        {
          q: 'Is String considered a primitive data type in Java?',
          a: 'No. String is a full java.lang.String object reference that manages an immutable internal byte array. It is provided special syntax support in the compiler (such as string literals and the + concatenation operator), but it resides on the heap.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Explain Like I'm 5: What is a Variable & What is Java?</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Let's throw away the confusing academic jargon. Imagine your computer's RAM is a giant wall of plastic lunchboxes, each with a sticky note label.
        </p>

        <!-- JAVASCRIPT CLARIFICATION NOTICE -->
        <div style="background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3); border-radius: 6px; padding: 1rem; margin-bottom: 2rem;">
          <strong style="color: #eab308; font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase;">⚠️ Did you mean JavaScript?</strong>
          <p style="font-size: 0.9rem; color: var(--fg); margin: 0.35rem 0 0;">
            Remember the classic programming maxim: <em>"Java is to JavaScript as Car is to Carpet."</em> They are completely unrelated languages. If you want to make websites interactive, visit our <a href="/learn/javascript/" style="color: #3b82f6; font-weight: bold;">JavaScript Learning Guide</a>. If you want high-performance enterprise backends, Android apps, or Minecraft mods, you are in the right place!
          </p>
        </div>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. The Lunchbox Metaphor (What is a Variable?)</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          When you tell a computer: <code>int diamonds = 64;</code>, you are telling the computer:
        </p>
        <ul style="font-size: 0.95rem; line-height: 1.6; padding-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>Type (<code>int</code>):</strong> "Grab a lunchbox that can ONLY hold whole numbers (integers)."</li>
          <li><strong>Name (<code>diamonds</code>):</strong> "Stick a label on the front that says 'diamonds'."</li>
          <li><strong>Value (<code>64</code>):</strong> "Put the number 64 inside the lunchbox and close the lid."</li>
        </ul>

        ${javaPlayground(`
public class Main {
  public static void main(String[] args) {
    int playerLevel = 42;
    double healthPercentage = 98.5;
    boolean hasElytra = true;
    String playerName = "Steve";

    System.out.println("Player: " + playerName);
    System.out.println("Level: " + playerLevel);
    System.out.println("Health: " + healthPercentage + "%");
    System.out.println("Has Elytra: " + hasElytra);
  }
}
        `, 'var1')}

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">2. The 8 Primitive Types (The Toolbelt)</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          In Java, everything is either a <strong>primitive</strong> (raw numbers/booleans stored directly in fast memory) or an <strong>Object</strong> (a reference pointer to complex memory).
        </p>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem; font-family: var(--mono); margin: 1rem 0;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border); text-align: left;">
              <th style="padding: 0.5rem;">Type</th>
              <th style="padding: 0.5rem;">Size</th>
              <th style="padding: 0.5rem;">What It Holds</th>
              <th style="padding: 0.5rem;">Example</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem;"><code>int</code></td><td>32-bit</td><td>Whole numbers (-2B to +2B)</td><td><code>int score = 500;</code></td></tr>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem;"><code>long</code></td><td>64-bit</td><td>Massive integers (e.g. world seeds)</td><td><code>long seed = 8943209823L;</code></td></tr>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem;"><code>double</code></td><td>64-bit</td><td>Decimal numbers (default for math)</td><td><code>double pi = 3.14159;</code></td></tr>
            <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem;"><code>boolean</code></td><td>1-bit</td><td><code>true</code> or <code>false</code></td><td><code>boolean isAlive = true;</code></td></tr>
            <tr><td style="padding: 0.5rem;"><code>char</code></td><td>16-bit</td><td>Single Unicode character</td><td><code>char grade = 'A';</code></td></tr>
          </tbody>
        </table>
      `
    },
    {
      slug: '02-how-to-compile-and-the-jvm',
      title: 'How to Compile Java & The JVM Bytecode Secret',
      metaDesc: 'Understand the Java compilation model: javac compiler, .class bytecode, the JVM interpreter vs JIT compiler, and JAR files.',
      copySnippet: `# Compile Java source into bytecode (.class)
javac -d bin src/Main.java

# Execute compiled class with JVM
java -cp bin Main

# Package compiled classes into executable JAR
jar --create --file app.jar --main-class Main -C bin .

# Run packaged executable JAR
java -jar app.jar

# Disassemble bytecode to inspect low-level JVM instructions
javap -c -v bin/Main.class`,
      copyLabel: '📋 Copy Java Compiler & JVM CLI Command Cheat Sheet',
      traps: [
        {
          title: 'NoClassDefFoundError vs. ClassNotFoundException Confusion',
          desc: '<code>ClassNotFoundException</code> is an explicit checked exception thrown when reflective lookup fails (e.g. <code>Class.forName()</code>). <code>NoClassDefFoundError</code> is a fatal JVM LinkageError meaning the class was present during compilation but missing from the runtime classpath or failed during static field initialization.'
        },
        {
          title: 'Bytecode Version Incompatibility (UnsupportedClassVersionError)',
          desc: 'Compiling on a newer JDK (e.g. Java 21 emits class format version 65.0) and attempting to run on an older JRE (e.g. Java 17, version 61.0) crashes immediately with <code>UnsupportedClassVersionError</code>. When compiling for backward compatibility, always supply the <code>javac --release 17</code> flag.'
        },
        {
          title: 'Classpath Delimiter OS Mismatch (Semicolon vs. Colon)',
          desc: 'On Windows, classpath entries in <code>-cp</code> are separated by semicolons (<code>bin;lib/core.jar</code>). On Linux and macOS, they are separated by colons (<code>bin:lib/core.jar</code>). Hardcoding classpath strings in shell scripts without OS detection causes silent startup failures.'
        },
        {
          title: 'Executing Java with .class File Extension',
          desc: 'Beginners frequently type <code>java Main.class</code> in the terminal, causing the JVM to search for a class named <code>Main/class</code> and failing with <code>Could not find or load main class</code>. The java command requires the fully-qualified class identifier without any extension: <code>java Main</code>.'
        },
        {
          title: 'Naive Micro-Benchmarking Without JIT Warmup',
          desc: 'Measuring Java loop execution with <code>System.nanoTime()</code> over 10 iterations produces misleading results. The HotSpot JVM starts in bytecode interpreted mode, profiles execution, and triggers tiered Just-In-Time (C1/C2 JIT) native machine compilation only after thousands of invocations.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between JDK, JRE, and the JVM?',
          a: 'The JVM (Java Virtual Machine) executes bytecode on the host OS. The JRE (Java Runtime Environment) bundles the JVM with core standard class libraries. The JDK (Java Development Kit) includes the JRE plus developer tools like javac, jar, jdb, and javap.'
        },
        {
          q: 'How does the HotSpot Just-In-Time (JIT) compiler improve execution speed?',
          a: 'HotSpot monitors code execution in real-time. Methods identified as "hot spots" (frequently called loops) are dynamically compiled directly into native x86_64 or ARM64 assembly instructions with aggressive optimizations like inlining, loop unrolling, and escape analysis.'
        },
        {
          q: 'What is Java bytecode and why does it enable cross-platform portability?',
          a: 'Bytecode is an intermediate, architecture-neutral instruction set (.class files). Instead of compiling directly to Intel or Apple Silicon machine code, javac compiles to bytecode, and the platform-specific JVM translates that bytecode to local CPU instructions.'
        },
        {
          q: 'What causes the "Could not find or load main class" error when running Java?',
          a: 'This occurs if the class file is not in the directory specified by -cp (classpath), if the package declaration does not match the folder structure, or if the user appended the .class extension to the command.'
        },
        {
          q: 'What is the purpose of the javap disassembly tool?',
          a: 'javap disassembles compiled .class files into human-readable bytecode instructions (such as iload, invokevirtual, bipush), allowing developers to inspect compiler optimizations and verify method signatures.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">How to Compile Java & The JVM Secret</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Why doesn't your computer run Java code directly like C++ does? Learn the two-stage execution secret behind <em>"Write Once, Run Anywhere" (WORA)</em>.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. The 2-Stage Pipeline (Source &rarr; Bytecode &rarr; Machine Code)</h2>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.5rem;">
          1. <strong>Main.java</strong> (Human-readable text code)<br>
          &nbsp;&nbsp;&nbsp;&darr; <em>javac Main.java</em> (Java Compiler)<br>
          2. <strong>Main.class</strong> (Platform-independent bytecode instructions)<br>
          &nbsp;&nbsp;&nbsp;&darr; <em>java Main</em> (Java Virtual Machine + JIT)<br>
          3. <strong>CPU Machine Code</strong> (Fast binary assembly running on Intel, AMD, or Apple Silicon)
        </div>

        ${javaPlayground(`
public class BuildTest {
  public static void main(String[] args) {
    String os = "Minecraft Server / Linux 64-bit";
    System.out.println("Compiled once on developer PC!");
    System.out.println("Now executing flawlessly on: " + os);
  }
}
        `, 'comp1')}
      `
    },
    {
      slug: '03-math-and-numbers-in-java',
      title: 'Math in Java & The Dangerous Integer Division Trap',
      metaDesc: 'Master arithmetic in Java: Math library functions, integer division traps, floating-point currency hazards, and overflow mechanics.',
      copySnippet: `import java.math.BigDecimal;
import java.math.RoundingMode;

// Financial / Exact Currency Calculation
BigDecimal price = new BigDecimal("19.99");
BigDecimal taxRate = new BigDecimal("0.0825");
BigDecimal total = price.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);

// Safe Modulo for Negative Numbers
int safeMod = Math.floorMod(-7, 4); // Returns 1 (unlike -7 % 4 which returns -3)

// Overflow-Safe Arithmetic (Throws ArithmeticException on overflow)
long safeSum = Math.addExact(2000000000L, 500000000L);`,
      copyLabel: '📋 Copy Java Precision Math & Safe Arithmetic Template',
      traps: [
        {
          title: 'The new BigDecimal(double) Inexact Constructor Trap',
          desc: 'Instantiating <code>new BigDecimal(0.1)</code> does NOT create an exact 0.1; it creates <code>0.1000000000000000055511151231257827021181583404541015625</code> because 0.1 cannot be represented precisely in binary float. Always use <code>new BigDecimal("0.1")</code> or <code>BigDecimal.valueOf(0.1)</code>.'
        },
        {
          title: 'Negative Modulo Operator Trap (-7 % 4 == -3)',
          desc: 'In Java, the <code>%</code> operator is a remainder operator based on truncated division, meaning <code>-7 % 4</code> evaluates to <code>-3</code> rather than <code>1</code>. When calculating array wrap-around or cyclic clock positions, always use <code>Math.floorMod(-7, 4)</code>.'
        },
        {
          title: 'The Math.abs(Integer.MIN_VALUE) Trap',
          desc: 'Due to two\'s complement binary representation, the negative range is 1 greater than the positive range. <code>Math.abs(-2147483648)</code> returns <code>-2147483648</code>, completely failing to make the number positive! Always handle <code>Integer.MIN_VALUE</code> before calling absolute value.'
        },
        {
          title: 'Silent Floating-Point NaN and Infinity Propagation',
          desc: 'In double arithmetic, dividing <code>0.0 / 0.0</code> yields <code>Double.NaN</code>, and <code>1.0 / 0.0</code> yields <code>Double.POSITIVE_INFINITY</code> without raising an exception. Any further math with NaN produces NaN, silently poisoning entire physics simulation states.'
        },
        {
          title: 'Compound Assignment Operator Implicit Narrowing',
          desc: 'Writing <code>short s = 5; s += 10.5;</code> compiles without warnings because compound assignment inserts an invisible cast: <code>s = (short)(s + 10.5)</code>. This silently truncates floating-point numbers and discards high-order bits without developer awareness.'
        }
      ],
      faqs: [
        {
          q: 'Why should floating-point double and float never be used for financial transactions in Java?',
          a: 'IEEE 754 binary floating-point numbers cannot represent simple base-10 decimal fractions like 0.10 or 0.05 exactly. Cumulative rounding errors cause bank accounts to drift by pennies. Always use java.math.BigDecimal or store monetary values as whole cents in a long.'
        },
        {
          q: 'How does Math.floorMod() differ from the standard % remainder operator?',
          a: 'The % operator rounds division toward zero (truncated division), producing negative results for negative dividends (-7 % 4 = -3). Math.floorMod() rounds division toward negative infinity (floored division), guaranteeing results match the divisor sign (Math.floorMod(-7, 4) = 1).'
        },
        {
          q: 'Why does Math.abs(Integer.MIN_VALUE) fail to return a positive integer?',
          a: '32-bit signed integers range from -2,147,483,648 to +2,147,483,647. Because +2,147,483,648 does not exist in 32-bit two\'s complement, attempting to negate Integer.MIN_VALUE overflows back to itself.'
        },
        {
          q: 'What is the difference between float and double precision in memory?',
          a: 'A float occupies 32 bits (1 sign, 8 exponent, 23 mantissa) providing ~7 decimal digits of precision. A double occupies 64 bits (1 sign, 11 exponent, 52 mantissa) providing ~15 to 17 decimal digits of precision.'
        },
        {
          q: 'How do Math.addExact() and Math.multiplyExact() prevent silent arithmetic overflows?',
          a: 'Unlike the standard + and * operators which silently wrap around upon exceeding bit limits, Math.addExact() checks CPU overflow flags and immediately throws an ArithmeticException, preventing data corruption.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Math in Java & The Integer Division Trap</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Java arithmetic is fast and strictly typed, but it contains 3 deadly traps that catch every beginner and crash production systems.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">Trap #1: The Integer Truncation Trap (<code>5 / 2 == 2</code>)</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          In Java, dividing two integers always yields an integer. It completely throws away the decimal remainder without rounding!
        </p>
        <ul style="font-size: 0.95rem; line-height: 1.6; padding-left: 1.5rem;">
          <li>❌ <code>double result = 5 / 2;</code> &rarr; Evaluates to <code>2.0</code>!</li>
          <li>✅ <code>double result = 5.0 / 2;</code> &rarr; Correctly evaluates to <code>2.5</code>.</li>
        </ul>

        ${javaPlayground(`
public class MathTraps {
  public static void main(String[] args) {
    // Trap 1: Integer division
    int a = 5;
    int b = 2;
    double wrong = a / b;
    double correct = (double) a / b;

    System.out.println("Wrong (a / b): " + wrong);
    System.out.println("Correct ((double) a / b): " + correct);

    // Math class utilities
    double radius = 10.0;
    double area = Math.PI * Math.pow(radius, 2);
    System.out.println("Circle Area: " + Math.round(area * 100.0) / 100.0);
    System.out.println("Hypotenuse (3, 4): " + Math.hypot(3, 4));
  }
}
        `, 'math1')}

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">Trap #2: Floating-Point Currency (Why 0.1 + 0.2 != 0.3)</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          Binary floating-point numbers cannot precisely represent base-10 decimals like $0.10. <strong>NEVER store financial transactions in <code>double</code> or <code>float</code></strong>. Always use <code>java.math.BigDecimal</code> or store integer cents (e.g. <code>long cents = 199;</code>).
        </p>
      `
    },
    {
      slug: '04-classes-and-oop-mastery',
      title: 'Object-Oriented Programming (OOP): Blueprints & Objects',
      metaDesc: 'Master Java OOP: Classes, objects, constructors, encapsulation, inheritance, polymorphism, and interfaces with practical examples.',
      copySnippet: `import java.util.Objects;

// Modern Immutable Java Record (JDK 16+)
public record Player(String username, int level, double health) {
    public Player {
        Objects.requireNonNull(username, "Username cannot be null");
        if (level < 1) throw new IllegalArgumentException("Level must be >= 1");
    }
}

// Classical Encapsulated OOP Blueprint
public class Weapon {
    private final String id;
    private int durability;

    public Weapon(String id, int durability) {
        this.id = Objects.requireNonNull(id, "Weapon ID cannot be null");
        this.durability = durability;
    }

    public void use() {
        if (durability > 0) durability--;
    }

    public int getDurability() { return durability; }
    public String getId() { return id; }
}`,
      copyLabel: '📋 Copy Java OOP Encapsulated Class & Record Pattern',
      traps: [
        {
          title: 'Overriding equals() Without Overriding hashCode()',
          desc: 'If two objects are considered equal via <code>equals()</code>, they MUST return the exact same <code>hashCode()</code> integer. Overriding <code>equals()</code> alone causes objects to vanish inside <code>HashSet</code> or become completely unretrievable from <code>HashMap</code> keys.'
        },
        {
          title: 'Leaking Mutable Internal State Through Getters',
          desc: 'Returning a direct reference to a mutable field (e.g., <code>public List&lt;Item&gt; getInventory() { return this.items; }</code>) allows external callers to modify the private state without validation. Always return defensive copies or unmodifiable wrappers like <code>Collections.unmodifiableList(items)</code>.'
        },
        {
          title: 'Calling Overridable Methods Inside Constructors',
          desc: 'Invoking a non-private, non-final method inside a superclass constructor can trigger a subclass method override before the subclass fields have been initialized. This leads to subtle, hard-to-trace <code>NullPointerException</code>s during instantiation.'
        },
        {
          title: 'The Fragile Base Class & Deep Inheritance Hell',
          desc: 'Creating inheritance chains deeper than 2 levels tightly couples child classes to parent implementation details. A change in a base class method breaks behavior across dozens of subclasses. Prefer object composition and interfaces over class inheritance.'
        },
        {
          title: 'Anemic Domain Models (Getters and Setters Everywhere)',
          desc: 'Creating classes with only private fields and automatic getters/setters for every field turns classes into dumb data containers, violating encapsulation. Business rules, state validations, and mutations should be encapsulated directly within domain methods.'
        }
      ],
      faqs: [
        {
          q: 'What is the contract between equals() and hashCode() in Java?',
          a: 'If two objects evaluate to true via equals(), their hashCode() values must be identical. If hashCode() differs, they are guaranteed not equal. However, two unequal objects may share the same hash code (a hash collision).'
        },
        {
          q: 'Why is composition generally favored over inheritance in modern Java?',
          a: 'Composition provides loose coupling, allows changing behavior dynamically at runtime by swapping component implementations, and avoids exposing subclass internals to fragile base class changes.'
        },
        {
          q: 'What are Java Records and when should they be used instead of regular classes?',
          a: 'Records (introduced in Java 16) are concise immutable data carriers. The compiler automatically generates constructor, getters, equals(), hashCode(), and toString() methods, eliminating boilerplate code.'
        },
        {
          q: 'What is the difference between an Interface and an Abstract Class in Java?',
          a: 'An abstract class can maintain mutable instance state, constructors, and default implementations (single inheritance). An interface defines a contract or capability (multiple inheritance) and can only declare public static final constants and default/static methods.'
        },
        {
          q: 'Why is invoking polymorphic methods from within a constructor dangerous?',
          a: 'When a superclass constructor runs, the subclass instance fields have not yet been initialized. If the constructor calls a method overridden by the subclass, that method executes against null/uninitialized subclass state.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">OOP Mastery: Blueprints, Objects & Inheritance</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Java is unapologetically object-oriented. Learn how classes act as architectural blueprints to instantiate living objects in memory.
        </p>

        ${javaPlayground(`
// Blueprint
class Sword {
  private String material;
  private int damage;

  // Constructor
  public Sword(String material, int damage) {
    this.material = material;
    this.damage = damage;
  }

  public void attack(String enemy) {
    System.out.println("Attacked " + enemy + " with " + material + " Sword for " + damage + " DMG!");
  }
}

public class Main {
  public static void main(String[] args) {
    Sword diamondBlade = new Sword("Diamond", 7);
    Sword netheriteBlade = new Sword("Netherite", 8);

    diamondBlade.attack("Zombie");
    netheriteBlade.attack("Ender Dragon");
  }
}
        `, 'oop1')}
      `
    },
    {
      slug: '05-stack-vs-heap-memory-jvm',
      title: 'Deep Dive: Stack vs. Heap & Garbage Collection',
      metaDesc: 'How JVM memory works: Stack frames, Heap allocation, pass-by-value semantics, and how Garbage Collection prevents memory leaks.',
      copySnippet: `# Recommended Production JVM Memory & GC Configuration (4GB Heap, G1GC)
java -Xms4g -Xmx4g \\
     -XX:+UseG1GC \\
     -XX:MaxGCPauseMillis=200 \\
     -XX:+ParallelRefProcEnabled \\
     -XX:+HeapDumpOnOutOfMemoryError \\
     -XX:HeapDumpPath=/var/log/jvm/heapdump.hprof \\
     -jar application.jar`,
      copyLabel: '📋 Copy Production JVM GC & Memory Flags Cheat Sheet',
      traps: [
        {
          title: 'Static Collection Memory Leaks in the Heap',
          desc: 'Adding objects to a <code>public static List</code> or <code>static Map</code> creates GC roots that persist for the lifetime of the JVM process. Because the GC only collects unreferenced objects, static collections continually grow, eventually triggering fatal <code>OutOfMemoryError: Java heap space</code>.'
        },
        {
          title: 'Thread Call Stack Exhaustion (StackOverflowError)',
          desc: 'Every executing thread has an isolated call stack (default 1MB). Deep recursion without a base case or circular object references quickly fills the stack frames, immediately throwing a <code>StackOverflowError</code> that crashes the executing thread.'
        },
        {
          title: 'Metaspace Memory Leaks from Dynamic Classloading',
          desc: 'Classes, method metadata, and constant pools reside off-heap in native memory called Metaspace. Creating dynamic proxies, bytecode generation, or uncollected custom ClassLoaders without releasing class references triggers fatal <code>OutOfMemoryError: Metaspace</code>.'
        },
        {
          title: 'Blindly Adjusting -Xmx Without Analyzing Heap Dumps',
          desc: 'Increasing maximum heap size (<code>-Xmx8g</code>) to fix an out-of-memory error without analyzing heap dumps (<code>.hprof</code>) via VisualVM or Eclipse MAT merely delays the crash while prolonging Garbage Collection pause times.'
        },
        {
          title: 'The Zombie Object Finalizer Hazard',
          desc: 'Overriding <code>finalize()</code> delays object reclamation by at least two GC cycles, can resurrect dead objects into active heap references, and causes severe throughput degradation. The finalizer mechanism is deprecated; use <code>AutoCloseable</code> with try-with-resources.'
        }
      ],
      faqs: [
        {
          q: 'What is stored on the Java Stack versus the Java Heap?',
          a: 'The Stack stores executing method frames, local primitive variables, and object reference pointers. It is fast and automatically cleaned as methods return. The Heap stores all instantiated objects and arrays; it is managed by the Garbage Collector.'
        },
        {
          q: 'Is Java pass-by-value or pass-by-reference?',
          a: 'Java is strictly pass-by-value 100% of the time. When passing an object to a method, Java copies the value of the reference pointer, not the object itself. Reassigning the parameter variable inside the method does not affect the caller\'s reference.'
        },
        {
          q: 'How does the Garbage Collector know when an object can be deleted?',
          a: 'The GC performs root reachability analysis starting from GC Roots (active thread stacks, static variables, JNI references). Any object on the heap that cannot be reached through a reference chain from a GC root is marked for garbage collection.'
        },
        {
          q: 'What is the difference between Young Generation and Old Generation memory?',
          a: 'The JVM heap is divided into Young Gen (Eden, Survivor spaces) where new objects are created, and Old Gen where long-lived objects survive. Most objects die young (Weak Generational Hypothesis), so Minor GCs run quickly on Young Gen without scanning Old Gen.'
        },
        {
          q: 'How does try-with-resources prevent resource and memory leaks?',
          a: 'Classes implementing java.lang.AutoCloseable used in a try(...) statement automatically have their close() method invoked when exiting the block, guaranteeing file descriptors, database connections, and native sockets are freed even during exceptions.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Deep Dive: Stack vs. Heap & Garbage Collection</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          To write high-performance Java code, you must visualize how the JVM manages memory underneath the hood.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. Stack vs. Heap Architecture</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-top: 0; color: #3b82f6;">The Stack (Fast & Local)</h3>
            <ul style="font-size: 0.88rem; line-height: 1.6; padding-left: 1.25rem;">
              <li>Stores primitive variables (<code>int</code>, <code>boolean</code>).</li>
              <li>Stores memory pointers to objects on the heap.</li>
              <li>Each thread gets its own private stack.</li>
              <li>Memory is freed instantly as functions return.</li>
            </ul>
          </div>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-top: 0; color: #ef4444;">The Heap (Shared & Massive)</h3>
            <ul style="font-size: 0.88rem; line-height: 1.6; padding-left: 1.25rem;">
              <li>Stores all objects, Strings, arrays, and classes.</li>
              <li>Shared across all threads.</li>
              <li>Managed automatically by the Garbage Collector (GC).</li>
              <li>Objects survive until all references are gone.</li>
            </ul>
          </div>
        </div>

        ${javaPlayground(`
public class MemoryVisualizer {
  public static void main(String[] args) {
    // Stored on Stack:
    int localPrimitive = 100;

    // Pointer on Stack, Object in Heap:
    String heapObject = new String("I live in the JVM Heap!");

    System.out.println("Primitive: " + localPrimitive);
    System.out.println("Reference: " + heapObject);
  }
}
        `, 'mem1')}
      `
    },
    {
      slug: '06-optimization-and-performance',
      title: 'High-Performance Java: JIT, Memory & StringBuilder',
      metaDesc: 'Optimize Java for enterprise speed and game servers: StringBuilder vs string concat, primitive arrays vs boxed collections, and JIT compiler secrets.',
      copySnippet: `// High-Throughput String Construction (Zero Allocations in Loop)
StringBuilder sb = new StringBuilder(2048); // Pre-size capacity
for (int i = 0; i < 500; i++) {
    sb.append("Record:").append(i).append('\\n');
}
String result = sb.toString();

// Fast Primitive Iteration (Zero Boxing GC Pressure)
int[] numbers = new int[100000];
long sum = 0;
for (int num : numbers) {
    sum += num; // Pure CPU register addition, zero heap objects
}`,
      copyLabel: '📋 Copy Java High-Throughput Performance Pattern',
      traps: [
        {
          title: 'String Concatenation in Loops (O(N^2) Heap Garbage)',
          desc: 'Writing <code>String s = ""; for (...) s += item;</code> inside a loop generates a new <code>StringBuilder</code> and copies character arrays on every single iteration. For 10,000 iterations, this allocates gigabytes of throwaway objects and brings the Garbage Collector to a crawl.'
        },
        {
          title: 'Autoboxing in High-Frequency Calculation Loops',
          desc: 'Declaring <code>Long total = 0L; for (long val : array) total += val;</code> causes the JVM to unbox <code>total</code>, add <code>val</code>, and allocate a brand new <code>java.lang.Long</code> wrapper object every loop cycle. Always use primitive types (<code>long</code>) in hot loops.'
        },
        {
          title: 'False Sharing Across Multi-Core CPU Cache Lines',
          desc: 'When multiple threads read and write to independent variables that reside within the same 64-byte L1/L2 CPU cache line, the hardware repeatedly invalidates the cache line across CPU cores (cache line bouncing). Use <code>@jdk.internal.vm.annotation.Contended</code> or memory padding to isolate variables.'
        },
        {
          title: 'Unsized Collections Causing Repeated Array Reallocations',
          desc: 'Initializing <code>new ArrayList<>()</code> defaults to a capacity of 10. Adding 100,000 items forces the internal array to double and copy 14 times. When the dataset size is known or estimable, always supply initial capacity: <code>new ArrayList<>(100000)</code>.'
        },
        {
          title: 'Heavy Reflection in Latency-Critical Code Paths',
          desc: 'Invoking <code>Method.invoke()</code> or <code>Field.get()</code> repeatedly in request hot paths bypasses JIT inlining optimizations and incurs significant security check overhead. Cache <code>MethodHandle</code> instances or generate bytecode dynamically.'
        }
      ],
      faqs: [
        {
          q: 'Why does StringBuilder offer exponentially faster performance than + in loops?',
          a: 'String is immutable; concatenating with + creates a brand new String and copies all characters every time. StringBuilder uses a mutable, expandable internal char/byte buffer, appending characters in-place with amortized O(1) time complexity.'
        },
        {
          q: 'What is object autoboxing and why is it dangerous in high-frequency loops?',
          a: 'Autoboxing is the compiler\'s automatic conversion between primitive types (int) and their wrapper object classes (Integer). In high-frequency loops, boxing creates millions of short-lived heap objects, triggering frequent GC pauses and CPU cache misses.'
        },
        {
          q: 'How does the HotSpot JIT compiler perform Dead Code Elimination (DCE)?',
          a: 'If the JIT compiler analyzes that a computed variable or method call has no observable side-effects and is never read subsequently, it strips the code entirely from compiled native assembly.'
        },
        {
          q: 'What is false sharing and how does CPU cache line padding prevent it?',
          a: 'CPUs manage memory in 64-byte cache lines. If two threads modify separate variables that share the same cache line, each write forces cache invalidation on the other core. Padding places dummy bytes between variables to ensure they occupy separate cache lines.'
        },
        {
          q: 'Why is Java Microbenchmark Harness (JMH) required for accurate latency measurements?',
          a: 'Standard benchmarks fail due to JIT warmup delays, dead code elimination, and on-stack replacement. JMH controls compiler optimizations, state blackholes, and thread allocation to produce statistically rigorous benchmarks.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">High-Performance Java: JIT, Memory & StringBuilder</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Java can be as fast as C++ when written correctly. Learn the optimization techniques used by Minecraft server developers and high-frequency trading platforms.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. The StringBuilder Secret</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          In Java, <code>String</code> is <strong>immutable</strong> (it can never be changed). Every time you do <code>text = text + "!"</code>, Java throws away the old string and creates an entirely new one in the Heap. In loops, this creates thousands of throwaway objects and kills performance!
        </p>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          Always use <code>StringBuilder</code> when combining text in loops:
        </p>

        ${javaPlayground(`
public class SpeedTest {
  public static void main(String[] args) {
    // FAST: StringBuilder appends in-place
    StringBuilder sb = new StringBuilder();
    for (int i = 1; i <= 5; i++) {
      sb.append("Tick ").append(i).append(" | ");
    }
    System.out.println("Result: " + sb.toString());
  }
}
        `, 'perf1')}
      `
    },
    {
      slug: '07-what-not-to-do-anti-patterns',
      title: 'Java Anti-Patterns: What NOT To Do (Production Traps)',
      metaDesc: 'Avoid common Java beginner mistakes and anti-patterns: null pointer traps, swallowed exceptions, raw thread spawning, and mutable singletons.',
      copySnippet: `import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

// ANTI-PATTERN: catch (Exception e) {}
// PRODUCTION STANDARD: Explicit logging and context wrapping
try {
    processData();
} catch (IOException e) {
    // Preserve root cause exception and context
    throw new RuntimeException("Storage pipeline failed to process records", e);
}

// ANTI-PATTERN: return null;
// PRODUCTION STANDARD: Return empty collections or Optional
public List<String> getTags() {
    return tags.isEmpty() ? Collections.emptyList() : List.copyOf(tags);
}`,
      copyLabel: '📋 Copy Java Defensive Code Review Standards Snippet',
      traps: [
        {
          title: 'Swallowing Exceptions with Empty Catch Blocks',
          desc: 'Writing <code>catch (Exception e) {}</code> silently consumes fatal runtime failures without logging or rethrowing. The application continues running in an invalid corrupted state, making root-cause diagnostics in production logs completely impossible.'
        },
        {
          title: 'Returning Null Instead of Empty Collections or Optional',
          desc: 'Returning <code>null</code> from a method that retrieves lists, arrays, or domain entities forces every caller to write defensive null checks. Forgetting a check results in ubiquitous <code>NullPointerException</code> crashes. Return <code>Collections.emptyList()</code> or <code>Optional&lt;T&gt;</code>.'
        },
        {
          title: 'Using Legacy java.util.Date and Calendar',
          desc: 'Legacy date classes are mutable, confusing (months are 0-indexed, so 0 is January), and fundamentally thread-unsafe. Always migrate to modern <code>java.time</code> (<code>Instant</code>, <code>LocalDate</code>, <code>ZonedDateTime</code>) introduced in Java 8.'
        },
        {
          title: 'Broken Double-Checked Locking Without volatile',
          desc: 'Implementing lazy-loaded singletons with double-checked locking without marking the instance field <code>volatile</code> allows other CPU threads to read partially constructed objects due to compiler instruction reordering.'
        },
        {
          title: 'Calling System.exit() Inside Reusable Libraries',
          desc: 'Invoking <code>System.exit(0)</code> inside a library or service abruptly halts the host JVM process without allowing web servers or sibling background workers to perform clean shutdowns, close database pools, or flush file buffers.'
        }
      ],
      faqs: [
        {
          q: 'Why is catching java.lang.Throwable or generic Exception considered an anti-pattern?',
          a: 'Catching Throwable intercepts fatal JVM errors like OutOfMemoryError and StackOverflowError that an application cannot recover from. Catching generic Exception obscures specific failure modes and prevents proper error handling.'
        },
        {
          q: 'Why should methods return empty collections rather than null?',
          a: 'Returning empty collections (e.g. Collections.emptyList()) allows callers to iterate with for-each loops or call stream() directly without risking NullPointerExceptions or cluttering code with null guards.'
        },
        {
          q: 'What makes java.time superior to legacy Date and Calendar classes?',
          a: 'java.time classes are strictly immutable, thread-safe, follow ISO-8601 calendar standards, use sensible 1-based indexing for months, and separate machine timestamps (Instant) from human calendar dates (LocalDate).'
        },
        {
          q: 'What is the volatile keyword and why is it required in double-checked locking?',
          a: 'The volatile keyword establishes a happens-before memory relationship, guaranteeing all threads observe writes immediately and preventing compiler instruction reordering from publishing references to partially initialized objects.'
        },
        {
          q: 'Why is System.exit() dangerous inside shared services and web containers?',
          a: 'System.exit() kills the entire operating system process hosting the JVM. In microservices, servlet containers, or plugin architectures, this terminates all concurrent tenant threads and drops active user connections.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Java Anti-Patterns: What NOT To Do</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Great software engineers are defined as much by what they <em>avoid</em> as what they write. Here are the 4 deadly Java anti-patterns.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. The "Pokemon" Exception Handler (Gotta Catch 'Em All)</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          Never, ever write an empty <code>catch (Exception e) {}</code> block. This is called "swallowing an error." If your code crashes, you will have ZERO log output, leaving you debugging in the dark for hours.
        </p>
        <div style="background: rgba(239,68,68,0.1); border-left: 4px solid #ef4444; padding: 1rem; margin: 1rem 0; font-family: var(--mono); font-size: 0.85rem;">
          // ❌ NEVER DO THIS:<br>
          try { connectDatabase(); } catch (Exception e) { /* silently ignored */ }<br><br>
          // ✅ ALWAYS LOG OR THROW:<br>
          try { connectDatabase(); } catch (SQLException e) { logger.error("DB failed", e); }
        </div>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">2. Returning <code>null</code> Instead of Empty Collections</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          If a method returns a list of items and there are none, <strong>never return <code>null</code></strong>. Return an empty list (<code>Collections.emptyList()</code>). This saves whoever calls your code from checking for <code>null</code> and prevents the dreaded <code>NullPointerException</code>.
        </p>
      `
    },
    {
      slug: '08-want-to-mod-minecraft',
      title: 'So You Want to Mod Minecraft: Fabric, Forge & Java 21',
      metaDesc: 'A practical bridge from Java programming to Minecraft modding: Fabric ModInitializer, registries, Mixins, client vs server side, and Gradle setup.',
      copySnippet: `// Fabric Mod Initializer & Item Registration Template
package com.example.mod;

import net.fabricmc.api.ModInitializer;
import net.minecraft.item.Item;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;

public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Item TITANIUM_INGOT = new Item(new Item.Settings());

    @Override
    public void onInitialize() {
        Registry.register(Registries.ITEM, new Identifier(MOD_ID, "titanium_ingot"), TITANIUM_INGOT);
        System.out.println("[ExampleMod] Registered Titanium Ingot successfully!");
    }
}`,
      copyLabel: '📋 Copy Minecraft Fabric Mod Registration Template',
      traps: [
        {
          title: 'Client-Side Classes Called on Dedicated Servers',
          desc: 'Referencing client-only classes (like <code>MinecraftClient.getInstance()</code> or HUD renderers) in common mod code works fine in the single-player test client, but instantly crashes dedicated multiplayer servers with <code>NoClassDefFoundError</code>.'
        },
        {
          title: 'Modifying Minecraft World State Asynchronously',
          desc: 'Attempting to spawn entities, modify block states, or read chunk data from background worker threads causes severe world corruption and concurrent modification crashes. Always dispatch world mutations to the main server thread via <code>server.execute(() -&gt; { ... })</code>.'
        },
        {
          title: 'Static Entity or World Reference Retention Leaks',
          desc: 'Storing references to <code>World</code>, <code>ServerPlayerEntity</code>, or <code>BlockEntity</code> inside static variables prevents unloaded dimensions from being garbage collected, causing persistent world-scale memory leaks.'
        },
        {
          title: 'Registering Content Outside Lifecycle Hooks',
          desc: 'Instantiating and registering items, blocks, or entities before or after the mod loader\'s designated initialization phase (e.g. <code>onInitialize()</code> in Fabric or registry events in Forge) results in missing registry entries and game crashes.'
        },
        {
          title: 'Destructive Mixin Overwrites (@Overwrite)',
          desc: 'Using <code>@Overwrite</code> in Mixins completely replaces Minecraft base methods, causing catastrophic compatibility conflicts with every other mod modifying that method. Always use targeted <code>@Inject</code> or <code>@Redirect</code> with <code>cancellable = true</code>.'
        }
      ],
      faqs: [
        {
          q: 'What is the architectural difference between Fabric and Forge/NeoForge?',
          a: 'Fabric is a lightweight, modular modding toolchain with fast update cycles and a minimal core. Forge (and NeoForge) provides a heavier, comprehensive API with extensive built-in hooks for fluid registries, dimensions, and energy capabilities.'
        },
        {
          q: 'What are SpongePowered Mixins and how do they modify Minecraft?',
          a: 'Mixins allow modders to inject bytecode hooks into compiled Minecraft .class files at runtime without directly modifying Mojang\'s proprietary source code, ensuring maximum compatibility across multiple independent mods.'
        },
        {
          q: 'Why does client-only code crash a dedicated Minecraft server?',
          a: 'Dedicated server JARs are stripped of all rendering, sound, and GUI classes to save memory. Calling client methods on the server throws NoClassDefFoundError because those classes do not exist on the server classpath.'
        },
        {
          q: 'How do you safely schedule background calculations back onto the Minecraft main thread?',
          a: 'Perform heavy file I/O or HTTP requests on a background executor, then submit state changes to the main server thread using server.execute(Runnable task) or world.getServer().submit(task).'
        },
        {
          q: 'How do you prevent memory leaks when creating custom BlockEntities in Minecraft?',
          a: 'Never hold hard static references to BlockEntities, avoid circular references with parent chunk objects, and override markRemoved() to clean up listener subscriptions when the block is broken.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">So You Want to Mod Minecraft?</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Minecraft: Java Edition is the most popular moddable Java game in history. Here is how real modders use modern Java (JDK 21) to build custom items, blocks, and dimensions.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. The Modding Toolchain (Fabric vs. Forge)</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          In modern Minecraft (1.20+ / 1.21+), you typically choose between two mod loaders:
        </p>
        <ul style="font-size: 0.95rem; line-height: 1.6; padding-left: 1.5rem; margin-bottom: 1rem;">
          <li><strong>Fabric:</strong> Lightweight, modular, updates within hours of new Minecraft snapshots, uses Mixins.</li>
          <li><strong>Forge / NeoForge:</strong> Feature-rich, heavy enterprise-style modding ecosystem with thousands of pre-made hooks.</li>
        </ul>

        ${javaPlayground(`
// Simulated Fabric Item Registration in Java
class Item {
  String id;
  Item(String id) { this.id = id; }
}

public class MinecraftMod {
  public static void main(String[] args) {
    Item rubySword = new Item("my_mod:ruby_sword");
    Item titaniumIngot = new Item("my_mod:titanium_ingot");

    System.out.println("Registering items with Fabric ModInitializer...");
    System.out.println("Registered: " + rubySword.id);
    System.out.println("Registered: " + titaniumIngot.id);
    System.out.println("Server ready with custom items!");
  }
}
        `, 'mc1')}
      `
    },
    {
      slug: '09-concurrency-and-threads',
      title: 'Multithreading & Concurrency: Virtual Threads in Java 21',
      metaDesc: 'Master Java concurrency: Platform threads vs Virtual Threads (Project Loom), synchronized locks, race conditions, and ExecutorService.',
      copySnippet: `import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

// Modern Virtual Threads (Project Loom, Java 21+)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 1000; i++) {
        final int taskId = i;
        executor.submit(() -> {
            Thread.sleep(50);
            return "Task " + taskId + " completed";
        });
    }
} // Automatically awaits completion of all virtual threads

// Thread-Safe Atomic Counter (Zero Locks)
AtomicInteger counter = new AtomicInteger(0);
int nextVal = counter.incrementAndGet();`,
      copyLabel: '📋 Copy Java 21 Virtual Threads & Concurrency Template',
      traps: [
        {
          title: 'The Non-Atomic Increment Race Condition (count++)',
          desc: '<code>count++</code> is not a single atomic CPU operation; it consists of three discrete steps: read, increment, write. When multiple threads execute <code>count++</code> concurrently, interleaving causes lost updates. Use <code>AtomicInteger</code> or locks.'
        },
        {
          title: 'Pinning Virtual Threads with Synchronized Blocks',
          desc: 'In Java 21 Virtual Threads (Project Loom), executing a <code>synchronized</code> block or native method while blocking pins the virtual thread to its underlying OS carrier thread, defeating high-concurrency scalability. Replace <code>synchronized</code> with <code>ReentrantLock</code>.'
        },
        {
          title: 'Deadlocks Caused by Inconsistent Lock Ordering',
          desc: 'If Thread A acquires Lock 1 then Lock 2, while Thread B acquires Lock 2 then Lock 1, both threads will block indefinitely waiting for the other. Always enforce a strict, consistent global acquisition ordering across all locks in your architecture.'
        },
        {
          title: 'Unbounded Queue Thread Pool Memory Exhaustion',
          desc: 'Using <code>Executors.newFixedThreadPool(10)</code> pairs the worker threads with an unbounded <code>LinkedBlockingQueue</code>. Under heavy incoming request loads, millions of unhandled tasks queue up in heap memory, triggering an <code>OutOfMemoryError</code>.'
        },
        {
          title: 'Confusing volatile with Atomic Operations',
          desc: 'The <code>volatile</code> keyword guarantees immediate visibility of writes across CPU core caches, but provides ZERO mutual exclusion or atomicity guarantees for compound check-then-act logic.'
        }
      ],
      faqs: [
        {
          q: 'What are Java 21 Virtual Threads and how do they differ from OS platform threads?',
          a: 'OS platform threads are heavy (~1MB stack, managed by the kernel), limiting a server to a few thousand threads. Virtual threads are lightweight user-mode threads (~few hundred bytes, managed by the JVM) allowing millions of concurrent tasks.'
        },
        {
          q: 'Why does the synchronized keyword cause virtual thread pinning in Project Loom?',
          a: 'In current HotSpot JVM implementations, synchronized blocks bind the virtual thread to the native OS carrier thread. When blocking inside synchronized, the carrier thread cannot be unmounted to serve other virtual threads.'
        },
        {
          q: 'How does AtomicInteger achieve thread safety without locking?',
          a: 'AtomicInteger uses hardware-level Compare-And-Swap (CAS) CPU assembly instructions (e.g. LOCK CMPXCHG on x86), updating values in a non-blocking loop without thread context-switching overhead.'
        },
        {
          q: 'What is the difference between volatile and synchronized in Java?',
          a: 'volatile guarantees memory visibility across CPU caches for read/write of a single variable without locking. synchronized provides both memory visibility and exclusive mutual exclusion across code blocks.'
        },
        {
          q: 'How can you detect and diagnose Java thread deadlocks in production?',
          a: 'Use JDK command-line diagnostic tools such as jcmd &lt;pid&gt; Thread.dump_to_file or jstack &lt;pid&gt; to generate thread dumps, which automatically detect cyclic locking dependencies and report the offending line numbers.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Multithreading & Virtual Threads (Java 21)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Java 21 revolutionized backend concurrency with <strong>Virtual Threads (Project Loom)</strong>, allowing you to spawn millions of threads simultaneously.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. Platform Threads vs. Virtual Threads</h2>
        <ul style="font-size: 0.95rem; line-height: 1.6; padding-left: 1.5rem;">
          <li><strong>Old Way (Platform Threads):</strong> 1 Java thread = 1 Operating System thread. Heavy (1MB memory per thread). Crashing at ~5,000 threads.</li>
          <li><strong>Java 21 Way (Virtual Threads):</strong> Managed by the JVM. Featherweight (a few bytes each). You can run 1,000,000 virtual threads without slowing down your computer!</li>
        </ul>

        ${javaPlayground(`
public class ConcurrencyDemo {
  public static void main(String[] args) {
    System.out.println("Java Concurrency Simulation");
    int sharedCounter = 0;

    // Simulate multi-task execution
    for (int threadId = 1; threadId <= 4; threadId++) {
      sharedCounter += 10;
      System.out.println("Thread #" + threadId + " processed batch. Counter: " + sharedCounter);
    }
    System.out.println("All tasks synchronized successfully!");
  }
}
        `, 'thread1')}
      `
    },
    {
      slug: '10-modern-streams-and-lambdas',
      title: 'Modern Java: Functional Streams, Lambdas & Optional',
      metaDesc: 'Write elegant, modern Java: Stream API pipelines, lambda expressions, method references, Collectors, and eliminating NullPointerExceptions with Optional.',
      copySnippet: `import java.util.*;
import java.util.stream.Collectors;

List<String> names = List.of("Steve", "Alex", "Steve", "Zombie", "Enderman");

// Deduplicate, filter, transform, and collect into unmodifiable list
List<String> filtered = names.stream()
    .distinct()
    .filter(name -> name.length() > 4)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toUnmodifiableList());

// Grouping and frequency counting
Map<Integer, Long> countByLength = names.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));`,
      copyLabel: '📋 Copy Java Streams & Functional Pipelines Snippet',
      traps: [
        {
          title: 'Re-Using an Already Consumed Stream',
          desc: 'A Java Stream can only be operated upon once. Calling a terminal operation (e.g. <code>.collect()</code> or <code>.count()</code>) closes the stream; invoking another operation on the same stream instance throws <code>IllegalStateException: stream has already been operated upon or closed</code>.'
        },
        {
          title: 'Side-Effects Inside Intermediate Stream Operations',
          desc: 'Mutating external state inside <code>.map()</code> or <code>.filter()</code> violates functional purity. When executed on a <code>parallelStream()</code>, concurrent modifications result in non-deterministic race conditions and lost data.'
        },
        {
          title: 'Blindly Using parallelStream() on Small Collections',
          desc: 'Parallel streams introduce thread splitting, scheduling on the common ForkJoinPool, and result merging overhead. For collections under 10,000 items, parallel streams are frequently 5x to 10x slower than standard sequential streams.'
        },
        {
          title: 'Calling Optional.get() Without isPresent() Verification',
          desc: 'Calling <code>opt.get()</code> directly when a value is empty throws <code>NoSuchElementException</code>, reproducing the exact problem that <code>Optional</code> was invented to prevent. Use <code>opt.orElse(defaultValue)</code> or <code>opt.orElseThrow()</code>.'
        },
        {
          title: 'Unbounded Infinite Streams Without limit()',
          desc: 'Creating an infinite stream using <code>Stream.iterate(0, i -&gt; i + 1)</code> without chaining <code>.limit(n)</code> before a terminal collection operation causes an infinite loop that rapidly exhausts all JVM heap memory.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between intermediate and terminal operations in Java Streams?',
          a: 'Intermediate operations (filter, map, sorted) return a new Stream and are lazily evaluated—they execute nothing until a terminal operation (collect, forEach, reduce) is invoked to produce a final result or side-effect.'
        },
        {
          q: 'Why should you avoid mutating external variables inside Stream operations?',
          a: 'Stream operations are designed around functional purity. Mutating external collections or variables introduces side-effects that break pipeline predictability and cause catastrophic data races in parallel streams.'
        },
        {
          q: 'When should you choose parallelStream() over a sequential stream?',
          a: 'Use parallelStream() only when: 1) datasets contain hundreds of thousands of items, 2) per-item computation is CPU-intensive, and 3) the data structure splits cleanly without synchronization (like ArrayList or primitive arrays).'
        },
        {
          q: 'How should Optional be properly used to eliminate NullPointerExceptions?',
          a: 'Use Optional as a return type for methods that may legitimately find no result. Consume it using declarative methods such as .map(), .filter(), .ifPresent(), or .orElseGet(() -&gt; fallback) rather than imperative get() calls.'
        },
        {
          q: 'What is the performance difference between a traditional for-loop and a Stream?',
          a: 'A traditional for-loop over primitive arrays has near-zero overhead and direct CPU vectorization. A Stream introduces small pipeline object allocations and function dispatch overhead, trading a few nanoseconds of performance for readability and expressiveness.'
        }
      ],
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Modern Java: Streams, Lambdas & Optional</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Functional programming arrived in Java with Streams and Lambdas. Write clean, declarative data pipelines without messy nested for-loops.
        </p>

        ${javaPlayground(`
public class StreamDemo {
  public static void main(String[] args) {
    String[] players = {"Steve", "Alex", "Notch", "Jeb", "Zombie"};

    System.out.println("Processing players with modern pipeline:");
    for (String player : players) {
      if (player.length() > 4) {
        System.out.println("-> VIP Player: " + player.toUpperCase());
      }
    }
  }
}
        `, 'stream1')}
      `
    }
  ];

  // ─── STANDALONE INTERACTIVE PLAYGROUND PAGE DATA ──────────────────────────
  const playgroundCopySnippet = `// Complete Java Quickstart & Diagnostic Template
public class DiagnosticTest {
    public static void main(String[] args) {
        System.out.println("Java Interactive Sandbox Online");
        int sum = 0;
        for (int i = 1; i <= 10; i++) sum += i;
        System.out.println("Sum of 1..10 = " + sum);
        System.out.println("Square Root of 256 = " + Math.sqrt(256));
    }
}`;

  const playgroundTraps = [
    {
      title: 'In-Browser Simulator Sandbox Limitations',
      desc: 'The client-side playground executes within a secure sandboxed browser environment. It does not provide access to raw operating system sockets, local disk I/O, or native JNI bindings.'
    },
    {
      title: 'Simulated Transpilation vs Native HotSpot Bytecode Execution',
      desc: 'The in-browser engine transpiles lightweight Java constructs directly into high-speed browser routines for sub-50ms instant feedback. For deep reflection, custom classloaders, or complete bytecode inspection, use a local JDK installation.'
    },
    {
      title: 'Browser Thread Execution Guards & Infinite Loops',
      desc: 'Executing unbounded <code>while(true)</code> loops or infinite recursion will trigger browser execution timeouts. Always ensure loop termination conditions and recursive base cases.'
    },
    {
      title: 'Java 8 vs Modern Java 21 LTS Syntax Differences',
      desc: 'Modern syntax features like Records, pattern matching for switch, and virtual threads require a local JDK 21+ environment for full native compiler support.'
    },
    {
      title: 'Headless Execution Environment (No GUI Windowing)',
      desc: 'Graphical desktop libraries like JavaFX, Swing, or AWT cannot render windows inside standard terminal stdout output. Use text-based diagnostics, ASCII tables, and console assertions.'
    }
  ];

  const playgroundFaqs = [
    {
      q: 'How does this in-browser Java playground compile and execute code?',
      a: 'The playground parses Java source code in real-time, binds mock System.out and standard library utilities, and executes code directly in your browser with sub-50ms latency and zero server-side round-trips.'
    },
    {
      q: 'Can I test object-oriented classes and inheritance inside this playground?',
      a: 'Yes! You can define custom classes, instantiate objects, call methods, and run OOP patterns directly using the preset buttons or by writing custom classes.'
    },
    {
      q: 'What are the limits of the in-browser simulator compared to a full JDK?',
      a: 'The browser playground is built for rapid algorithmic practice, syntax experimentation, and learning. It does not compile native bytecode JARs or execute complex multi-module Maven projects.'
    },
    {
      q: 'How do I load pre-built presets for math, OOP, and Minecraft modding?',
      a: 'Click any of the preset buttons above the editor (Hello World, Math & Trigonometry, OOP Class, StringBuilder Speed, or Minecraft Item Registry) to instantly load working sample code.'
    },
    {
      q: 'Where should I install a real JDK to build full desktop apps or Minecraft mods?',
      a: 'Download an open-source distribution of JDK 21 LTS from Adoptium (Eclipse Temurin) or Amazon Corretto, and install an IDE such as IntelliJ IDEA Community Edition or VS Code.'
    }
  ];

  const standalonePlaygroundHtml = `
    <div class="article-container" style="max-width: 1050px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/learn/">Learn</a> &gt; <a href="/learn/java/">Java</a> &gt; Interactive Playground
      </nav>

      <header style="margin-bottom: 1.5rem;">
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem;">☕ Interactive Java Online Playground</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Write, compile, and simulate Java code in your browser with real-time autocompletion, syntax helpers, and instant terminal stdout output.
        </p>
      </header>

      ${renderCopyCard(playgroundCopySnippet, '📋 Copy In-Browser Java Quickstart Code Template', 'btnCopyPlaygroundStarter')}

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; align-items: center;">
        <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">Load Presets:</span>
        <button onclick="loadJavaPreset('hello')" class="btn-sec" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M18 8.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5V10M15 8c0-.8-.7-1.5-1.5-1.5S12 7.2 12 8v2m0-2c0-.8-.7-1.5-1.5-1.5S9 7.2 9 8v5l-2.3-2.3a1.5 1.5 0 0 0-2.1 2.1L9 17.3c1.7 2.1 3.8 2.7 6 2.7 3.3 0 5-2.7 5-6V8.5z"/></svg> Hello World</button>
        <button onclick="loadJavaPreset('math')" class="btn-sec" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M3 21l9-9L21 3"/><path d="M3 21h18"/><path d="M3 21V3"/></svg> Math & Trigonometry</button>
        <button onclick="loadJavaPreset('oop')" class="btn-sec" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M5 17h14l1-5H4l1 5z"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/><path d="M6 12l2-5h8l2 5"/></svg> OOP Class</button>
        <button onclick="loadJavaPreset('stringbuilder')" class="btn-sec" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> StringBuilder Speed</button>
        <button onclick="loadJavaPreset('mc')" class="btn-sec" style="padding: 0.25rem 0.6rem; font-size: 0.8rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M14.5 3.5L20 9l-7 7-5.5-5.5 7-7z"/><path d="M5.5 17.5L2 22l4.5-1.5z"/><path d="M5.5 17.5l5-5"/></svg> Minecraft Item Registry</button>
      </div>

      ${javaPlayground(`
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Java World from Digital Tools Shed!");
    int a = 15;
    int b = 27;
    System.out.println("Sum of " + a + " + " + b + " = " + (a + b));
  }
}
      `, 'main_pg')}

      ${renderJavaTraps(playgroundTraps)}
      ${renderJavaFaqs(playgroundFaqs)}
      ${generateFaqSchema(playgroundFaqs, 'Interactive Java Online Playground FAQs', `${DOMAIN}/learn/java/playground`)}

      ${playgroundScript}

      <script>
        var JAVA_PRESETS = {
          'hello': 'public class Main {\\n  public static void main(String[] args) {\\n    System.out.println("Hello, World!");\\n  }\\n}',
          'math': 'public class MathDemo {\\n  public static void main(String[] args) {\\n    double radius = 5.0;\\n    double area = Math.PI * Math.pow(radius, 2);\\n    System.out.println("Circle Area: " + area);\\n    System.out.println("Square Root of 144: " + Math.sqrt(144));\\n  }\\n}',
          'oop': 'class Player {\\n  String username;\\n  int level;\\n  Player(String u, int l) { this.username = u; this.level = l; }\\n  void display() { System.out.println(username + " (Lvl " + level + ")"); }\\n}\\npublic class Main {\\n  public static void main(String[] args) {\\n    Player p = new Player("Alex", 50);\\n    p.display();\\n  }\\n}',
          'stringbuilder': 'public class SpeedTest {\\n  public static void main(String[] args) {\\n    StringBuilder sb = new StringBuilder();\\n    for(int i = 1; i <= 10; i++) {\\n      sb.append("[").append(i).append("] ");\\n    }\\n    System.out.println("Built: " + sb.toString());\\n  }\\n}',
          'mc': 'class MinecraftBlock {\\n  String id;\\n  float hardness;\\n  MinecraftBlock(String id, float h) { this.id = id; this.hardness = h; }\\n  void register() { System.out.println("Registered Block: minecraft:" + id + " [Hardness: " + hardness + "]"); }\\n}\\npublic class ModMain {\\n  public static void main(String[] args) {\\n    new MinecraftBlock("deepslate_diamond_ore", 4.5f).register();\\n  }\\n}'
        };

        function loadJavaPreset(key) {
          if (JAVA_PRESETS[key]) {
            document.getElementById('pg-code-main_pg').value = JAVA_PRESETS[key];
            runJavaPlayground('main_pg');
          }
        }
      </script>
    </div>
  `;

  writeFileSync(join(javaDist, 'playground.html'), renderPage({
    title: 'Interactive Java Online Playground & Autocomplete | Digital Tools Shed',
    metaDesc: 'Free in-browser Java simulator & playground with instant compilation, live terminal output, and autocomplete.',
    canonical: `${DOMAIN}/learn/java/playground`,
    bodyContent: standalonePlaygroundHtml,
    currentPath: '/learn/java/playground'
  }));

  // ─── JAVA HUB PAGE (/learn/java/index.html) DATA ──────────────────────────
  const hubCopySnippet = `# Verify Java Development Kit (JDK 21 LTS Recommended)
javac -version
java -version

# Generate Maven Starter Project
mvn archetype:generate -DgroupId=com.example -DartifactId=app -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

# Build & Package Application
cd app && mvn clean package

# Run Compiled Application JAR
java -cp target/app-1.0-SNAPSHOT.jar com.example.App`;

  const hubTraps = [
    {
      title: 'The Tutorial Purgatory Trap',
      desc: 'Passively watching dozens of YouTube tutorials creates an illusion of competence. In software engineering, proficiency only develops when you build independent projects, encounter compiler errors, and debug stack traces without hand-holding.'
    },
    {
      title: 'Learning Spring Boot Before Mastering Core Java & OOP',
      desc: 'Jumping directly into enterprise frameworks like Spring Boot or Micronaut without understanding Java collections, threading, memory references, and exception hierarchies makes diagnosing dependency injection bugs and runtime errors impossible.'
    },
    {
      title: 'Conflating Java with JavaScript',
      desc: 'Assuming Java and JavaScript share runtime mechanics or syntax paradigms creates fundamental confusion. Java is strongly typed, class-based, and runs on the JVM; JavaScript is dynamically typed, prototype-based, and runs in browsers and Node.js.'
    },
    {
      title: 'Studying Obsolete Java 7 and Java 8 Tutorials',
      desc: 'Learning deprecated idioms like raw threads, Vector/Hashtable, or legacy Date/Calendar prepares you for decade-old legacy codebases. Modern Java (Java 17/21 LTS) emphasizes Records, Pattern Matching, Virtual Threads, and Sealed Classes.'
    },
    {
      title: 'Neglecting Build Automation Tools (Maven & Gradle)',
      desc: 'Relying exclusively on IDE GUI buttons without learning Maven pom.xml or Gradle build.gradle scripts leaves you incapable of setting up automated CI/CD pipelines, multi-module architectures, or containerized Docker deployments.'
    }
  ];

  const hubFaqs = [
    {
      q: 'What is the recommended roadmap to master Java from beginner to enterprise engineer?',
      a: 'Start with Guide 01 (variables and primitives), progress through OOP and JVM memory architecture (Guides 04-05), master performance and defensive idioms (Guides 07-08), and conquer multithreading and Streams (Guides 09-10). Build real CLI tools, REST APIs, and Minecraft mods along the way.'
    },
    {
      q: 'Which version of Java should I install for modern development in 2026?',
      a: 'Install Java 21 LTS (Long-Term Support). It provides virtual threads (Project Loom), modern pattern matching, record patterns, and high-performance Garbage Collectors like G1 and ZGC.'
    },
    {
      q: 'Can learning Java help me develop Minecraft mods and Android apps?',
      a: 'Absolutely! Minecraft: Java Edition is built entirely on the JVM, and modding frameworks like Fabric and NeoForge use modern Java. Android native development uses Java and Kotlin interchangeably on the Android Runtime (ART).'
    },
    {
      q: 'How long does it take to learn Java well enough to get an entry-level job?',
      a: 'With consistent deliberate practice (10-15 hours per week), dedicated learners typically grasp core Java in 8-12 weeks and master enterprise frameworks (Spring Boot, SQL, REST APIs, Docker) in 6 months.'
    },
    {
      q: 'Why does Java continue to dominate enterprise and cloud computing?',
      a: 'Java offers unbeatable backward compatibility, massive multi-decade ecosystem support, high-performance HotSpot JIT compilation, state-of-the-art garbage collection, and strong typing that keeps million-line codebases maintainable.'
    }
  ];

  const javaCards = javaGuides.map((g, idx) => `
    <a href="/learn/java/${g.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; text-decoration: none; color: inherit; transition: transform 0.2s, border-color 0.2s;">
      <span style="font-family: var(--mono); font-size: 0.72rem; color: #3b82f6; text-transform: uppercase; font-weight: bold;">Guide 0${idx + 1}</span>
      <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0.35rem 0 0.5rem; color: var(--fg);">${g.title}</h3>
      <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${g.metaDesc}</p>
    </a>
  `).join('');

  const javaHubBody = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/learn/">Learn</a> &gt; Java Master Guide
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">Zero to Minecraft & Enterprise Mastery</div>
        <h1 style="font-family: var(--serif); font-size: 2.4rem; margin-bottom: 0.6rem;">☕ The Complete Java Master Guide</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          From "explain it to a 5-year-old" variables to high-performance JVM optimization, memory mechanics, what NOT to do, and real-world Minecraft modding.
        </p>
      </header>

      ${renderCopyCard(hubCopySnippet, '📋 Copy Java CLI Toolchain & Maven Project Setup Cheat Sheet', 'btnCopyHubSetup')}

      <!-- JAVASCRIPT VS JAVA NOTICE -->
      <div style="background: rgba(234,179,8,0.08); border: 1px solid rgba(234,179,8,0.25); border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <strong style="color: #eab308; font-family: var(--mono); font-size: 0.85rem; text-transform: uppercase;">⚠️ Confused between Java & JavaScript?</strong>
          <p style="font-size: 0.9rem; color: var(--fg); margin: 0.25rem 0 0;"><em>"Java is to JavaScript as Car is to Carpet."</em> If you want browser frontend scripts, check our JavaScript section.</p>
        </div>
        <a href="/learn/javascript/" class="btn-sec" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; text-decoration: none;">Go to JavaScript &rarr;</a>
      </div>

      <!-- PLAYGROUND CTA -->
      <div style="background: linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%); border: 2px solid #3b82f6; border-radius: 8px; padding: 1.5rem; margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-family: var(--serif); font-size: 1.35rem; margin: 0 0 0.25rem;">Interactive Java Playground</h2>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Compile and test Java code directly in your browser with real-time autocompletion.</p>
        </div>
        <a href="/learn/java/playground" class="btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.9rem; text-decoration: none; font-weight: bold;">Launch Playground &#x25B6;</a>
      </div>

      <!-- GUIDES GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
        ${javaCards}
      </div>

      ${renderJavaTraps(hubTraps)}
      ${renderJavaFaqs(hubFaqs)}
      ${generateFaqSchema(hubFaqs, 'Complete Java Master Guide Curriculum FAQs', `${DOMAIN}/learn/java/`)}

      ${playgroundScript}
    </div>
  `;

  writeFileSync(join(javaDist, 'index.html'), renderPage({
    title: 'Learn Java: Zero to Master Guide & Interactive Playground | Digital Tools Shed',
    metaDesc: 'Master Java from scratch: variables for beginners, JVM compilation, math traps, memory optimization, what NOT to do, and Minecraft modding.',
    canonical: `${DOMAIN}/learn/java/`,
    bodyContent: javaHubBody,
    currentPath: '/learn/java/'
  }));

  // ─── RENDER INDIVIDUAL GUIDE PAGES ────────────────────────────────────────
  for (const guide of javaGuides) {
    const guideBody = `
      <div class="article-container" style="max-width: 850px; margin: 0 auto; padding: 2rem 1rem;">
        <nav style="margin-bottom: 2rem; font-family: var(--mono); font-size: 0.82rem; color: var(--text-muted);">
          <a href="/" style="color: inherit; text-decoration: none;">Home</a> &gt; 
          <a href="/learn/" style="color: inherit; text-decoration: none;">Learn</a> &gt; 
          <a href="/learn/java/" style="color: inherit; text-decoration: none;">Java</a> &gt; 
          <span style="color: var(--fg);">${guide.title}</span>
        </nav>
        
        <article>
          ${guide.content}
        </article>

        ${renderCopyCard(guide.copySnippet, guide.copyLabel, `btnCopy_${guide.slug.replace(/[^a-zA-Z0-9]/g, '_')}`)}
        ${renderJavaTraps(guide.traps)}
        ${renderJavaFaqs(guide.faqs)}
        ${generateFaqSchema(guide.faqs, `${guide.title} FAQs`, `${DOMAIN}/learn/java/${guide.slug}`)}

        <!-- RELATED NAV -->
        <div style="border-top: 1px solid var(--border); margin-top: 3rem; padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="/learn/java/" class="btn-sec" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">&larr; Java Hub</a>
          <a href="/learn/java/playground" class="btn-primary" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">Open Playground &#x25B6;</a>
        </div>
        
        ${playgroundScript}
      </div>
    `;

    writeFileSync(join(javaDist, `${guide.slug}.html`), renderPage({
      title: `${guide.title} | Learn Java | Digital Tools Shed`,
      metaDesc: guide.metaDesc,
      canonical: `${DOMAIN}/learn/java/${guide.slug}`,
      bodyContent: guideBody,
      currentPath: `/learn/java/${guide.slug}`
    }));
  }

  console.log(`  ✓ Built Java Master Education Suite (${javaGuides.length} guides + Interactive Playground in /learn/java/)`);
}
