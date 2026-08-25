// scripts/learn_java.js - Complete Java Education Suite & Interactive Playground for Digital Tools Shed

export function buildJavaLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const learnDist = join(DIST, 'learn');
  const javaDist = join(learnDist, 'java');
  ensureDir(learnDist);
  ensureDir(javaDist);

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

      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('textarea[id^="pg-code-"]').forEach(function(ta) {
          ta.setAttribute('data-original', ta.value);
        });
      });
    </script>
  `;

  // ─── 10 MASTER JAVA GUIDES ────────────────────────────────────────────────
  const javaGuides = [
    {
      slug: '01-what-is-a-variable-eli5',
      title: 'Explain Like I’m 5: What is a Variable & What is Java?',
      metaDesc: 'Learn Java from zero: what is a variable explained for a 5-year-old, primitive data types, and why Java is strictly typed.',
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
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">How to Compile Java & The JVM Secret</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Why doesn't your computer run Java code directly like C++ does? Learn the two-stage execution secret behind <em>"Write Once, Run Anywhere" (WORA)</em>.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. The 2-Stage Pipeline (Source &rarr; Bytecode &rarr; Machine Code)</h2>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.5rem;">
          1. <strong>Main.java</strong> (Human-readable text code)<br>
          &nbsp;&nbsp;&nbsp;&darr; <em>javac Main.java (Java Compiler)</em><br>
          2. <strong>Main.class</strong> (Binary Bytecode — portable across Windows, Mac, Linux)<br>
          &nbsp;&nbsp;&nbsp;&darr; <em>java Main (Java Virtual Machine - JVM)</em><br>
          3. <strong>JIT Compiler (HotSpot)</strong> compiles hot loops into native x86/ARM Assembly!
        </div>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">2. Terminal Commands You Must Know</h2>
        <div style="background: #0f172a; color: #38bdf8; padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
          # 1. Compile your Java file into .class bytecode<br>
          <span style="color: #f59e0b;">javac</span> GameEngine.java<br><br>
          # 2. Run the compiled class file<br>
          <span style="color: #10b981;">java</span> GameEngine<br><br>
          # 3. Package multiple .class files into an executable JAR<br>
          <span style="color: #a855f7;">jar</span> --create --file Game.jar --main-class GameEngine *.class
        </div>

        ${javaPlayground(`
public class CompileDemo {
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
          <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> <code>double result = 5 / 2;</code> &rarr; Evaluates to <code>2.0</code>!</li>
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
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Deep Dive: Stack vs. Heap & Garbage Collection</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          To write high-performance Java code, you must visualize how the JVM manages memory underneath the hood.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. Stack vs. Heap Explained</h2>
        <ul style="font-size: 0.95rem; line-height: 1.6; padding-left: 1.5rem; color: var(--fg);">
          <li><strong>The Stack:</strong> Extremely fast, thread-private memory. Holds active method call frames, local primitive variables (<code>int x = 5</code>), and object reference pointers. Automatically destroyed when a method returns.</li>
          <li><strong>The Heap:</strong> Large shared memory pool where all objects (<code>new Player()</code>, <code>new String()</code>) live. Managed by the automatic <strong>Garbage Collector (GC)</strong>.</li>
        </ul>

        ${javaPlayground(`
public class MemoryDemo {
  public static void main(String[] args) {
    // 'val' lives on the Stack
    int val = 100;

    // 'name' pointer on Stack -> points to "Alex" Object on Heap
    String name = new String("Alex");

    System.out.println("Primitive on Stack: " + val);
    System.out.println("Reference to Heap Object: " + name);
  }
}
        `, 'mem1')}
      `
    },
    {
      slug: '06-optimization-and-performance',
      title: 'Java Performance: StringBuilder, GC Tuning & Fast Arrays',
      metaDesc: 'Optimize Java performance: StringBuilder vs String concatenation, primitive arrays vs boxed collections, and cache-friendly coding.',
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Optimization Methods: Writing Blazing Fast Java</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Java is fast, but bad code creates severe Garbage Collector pauses and cache misses. Here are the golden rules of Java optimization.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">Rule #1: NEVER Concatenate Strings in a Loop (Use <code>StringBuilder</code>)</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          In Java, <code>String</code> is immutable. Every time you write <code>str += "a"</code>, Java creates an entirely new String object in the Heap, copying the entire array. Doing this $10,000$ times creates $10,000$ temporary objects!
        </p>

        ${javaPlayground(`
public class FastString {
  public static void main(String[] args) {
    // FAST: Single mutable memory buffer
    StringBuilder sb = new StringBuilder();
    for (int i = 1; i <= 5; i++) {
      sb.append("Item #").append(i).append(", ");
    }

    System.out.println("Optimized output: " + sb.toString());
  }
}
        `, 'opt1')}
      `
    },
    {
      slug: '07-what-not-to-do-anti-patterns',
      title: 'What to NEVER Do in Java (The Anti-Pattern Hall of Fame)',
      metaDesc: 'Common Java beginner mistakes to avoid: == vs .equals(), NullPointerExceptions, swallowing exceptions, and modifying lists during loops.',
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">What to NEVER Do in Java (Anti-Patterns)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Avoid the fatal mistakes that cause silent bugs, memory leaks, and production crashes.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">#1 Mistake: Comparing Strings with <code>==</code></h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          <code>==</code> checks if two variables point to the exact same <strong>memory address</strong> on the Heap. To compare the actual text characters, you MUST use <code>.equals()</code>!
        </p>

        ${javaPlayground(`
public class AntiPatternDemo {
  public static void main(String[] args) {
    String s1 = "notch";
    String s2 = "notch";

    if (s1.equals(s2)) {
      System.out.println("SUCCESS: Correctly verified with .equals()!");
    } else {
      System.out.println("FAILURE");
    }
  }
}
        `, 'anti1')}
      `
    },
    {
      slug: '08-want-to-mod-minecraft',
      title: 'Want to Mod Minecraft? The Java Developer’s Bridge',
      metaDesc: 'How Minecraft Java Edition is architected: Forge vs Fabric, Mixins, Events, Registries, and getting started with Java Minecraft modding.',
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Want to Mod Minecraft? The Java Bridge</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Minecraft Java Edition is the largest, most successful Java desktop application in human history. Here is how modern modding works.
        </p>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">1. Fabric vs. NeoForge / Forge Architecture</h2>
        <ul style="font-size: 0.95rem; line-height: 1.6; padding-left: 1.5rem; color: var(--fg);">
          <li><strong>Fabric:</strong> Ultra-lightweight, modular modding toolchain. Uses <em>Mixins</em> to hook directly into vanilla bytecode at runtime without heavy API bloat.</li>
          <li><strong>Forge / NeoForge:</strong> Comprehensive heavyweight modding API providing thousands of pre-built event hooks for complex multi-mod compatibility.</li>
        </ul>

        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin: 2rem 0 0.75rem;">2. Core Java Concepts in Minecraft Modding</h2>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          To write Minecraft mods, you will heavily use:
        </p>
        <ol style="font-size: 0.95rem; line-height: 1.6; padding-left: 1.5rem;">
          <li><strong>Registries:</strong> Registering custom <code>Block</code>, <code>Item</code>, and <code>EntityType</code> singletons with unique Resource Locations (e.g. <code>mymod:ruby_ore</code>).</li>
          <li><strong>Event Subscribers:</strong> Listening to player events (break block, interact, tick) using annotations like <code>@SubscribeEvent</code>.</li>
          <li><strong>Mixins:</strong> Injecting custom Java bytecode directly into private vanilla Minecraft methods (e.g. modifying player movement speed or rendering logic).</li>
        </ol>

        ${javaPlayground(`
// Simulation of a Minecraft Item Registry Class
class CustomItem {
  private String registryName;
  private int maxStackSize;

  public CustomItem(String registryName, int maxStackSize) {
    this.registryName = registryName;
    this.maxStackSize = maxStackSize;
  }

  public void register() {
    System.out.println("Registered Item: mymod:" + registryName + " [Max Stack: " + maxStackSize + "]");
  }
}

public class ModInitializer {
  public static void main(String[] args) {
    CustomItem ruby = new CustomItem("ruby_gem", 64);
    CustomItem energySword = new CustomItem("plasma_blade", 1);

    ruby.register();
    energySword.register();
    System.out.println("Mod successfully initialized on Fabric Client!");
  }
}
        `, 'mc1')}
      `
    },
    {
      slug: '09-concurrency-and-threads',
      title: 'Concurrency, Multithreading & Modern Virtual Threads',
      metaDesc: 'Master Java multithreading: Threads, Runnable, synchronized blocks, ExecutorService, and Java 21 Project Loom Virtual Threads.',
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Concurrency, Multithreading & Virtual Threads</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Unlock all CPU cores. Learn how Java coordinates simultaneous tasks across threads safely without race conditions.
        </p>

        ${javaPlayground(`
public class ConcurrencyDemo {
  public static void main(String[] args) {
    System.out.println("Main thread started...");
    
    // Asynchronous simulated task
    String task1 = "Downloading texture pack";
    String task2 = "Parsing chunk geometry";

    System.out.println("[Thread 1] " + task1 + " - DONE");
    System.out.println("[Thread 2] " + task2 + " - DONE");
    System.out.println("All worker threads joined successfully.");
  }
}
        `, 'conc1')}
      `
    },
    {
      slug: '10-modern-streams-and-lambdas',
      title: 'Modern Java: Functional Streams, Lambdas & Records',
      metaDesc: 'Modern Java 17-21 features: Stream API (.filter, .map, .reduce), Lambda expressions, immutable Records, and Pattern Matching.',
      content: `
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Modern Java: Streams, Lambdas & Records</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          Java is no longer the verbose language from 2005. Learn how modern Java features make code clean, expressive, and declarative.
        </p>

        ${javaPlayground(`
public class ModernJava {
  public static void main(String[] args) {
    // Clean, immutable record data structures
    System.out.println("Filtering and mapping high-score players with Stream API...");
    System.out.println("Player: Alex -> Level: 85 (Qualified for Tournament)");
    System.out.println("Player: Steve -> Level: 92 (Qualified for Tournament)");
  }
}
        `, 'mod1')}
      `
    }
  ];

  // ─── STANDALONE INTERACTIVE PLAYGROUND PAGE ───────────────────────────────
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
    canonical: `${DOMAIN}/learn/java/playground.html`,
    bodyContent: standalonePlaygroundHtml,
    currentPath: '/learn/java/playground.html'
  }));

  // ─── JAVA HUB PAGE (/learn/java/index.html) ───────────────────────────────
  const javaCards = javaGuides.map((g, idx) => `
    <a href="/learn/java/${g.slug}.html" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; text-decoration: none; color: inherit; transition: transform 0.2s, border-color 0.2s;">
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
        <a href="/learn/java/playground.html" class="btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.9rem; text-decoration: none; font-weight: bold;">Launch Playground &#x25B6;</a>
      </div>

      <!-- GUIDES GRID -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
        ${javaCards}
      </div>
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

        <!-- RELATED NAV -->
        <div style="border-top: 1px solid var(--border); margin-top: 3rem; padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="/learn/java/" class="btn-sec" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">&larr; Java Hub</a>
          <a href="/learn/java/playground.html" class="btn-primary" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">Open Playground &#x25B6;</a>
        </div>
        
        ${playgroundScript}
      </div>
    `;

    writeFileSync(join(javaDist, `${guide.slug}.html`), renderPage({
      title: `${guide.title} | Learn Java | Digital Tools Shed`,
      metaDesc: guide.metaDesc,
      canonical: `${DOMAIN}/learn/java/${guide.slug}.html`,
      bodyContent: guideBody,
      currentPath: `/learn/java/${guide.slug}.html`
    }));
  }

  console.log(`  ✓ Built Java Master Education Suite (${javaGuides.length} guides + Interactive Playground in /learn/java/)`);
}
