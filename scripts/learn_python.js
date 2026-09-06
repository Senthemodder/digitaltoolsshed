// scripts/learn_python.js - Python Education Suite for Digital Tools Shed

export function buildPythonLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const learnDist = join(DIST, 'learn');
  const pyDist = join(learnDist, 'python');
  ensureDir(learnDist);
  ensureDir(pyDist);

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

  function renderPyTraps(traps) {
    const borderColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    return `
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem;">⚠️ 5 Fatal Traps & Python Pitfalls</h2>
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

  function renderPyFaqs(faqs) {
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

  // ─── EMBEDDABLE PYTHON PLAYGROUND COMPONENT ──────────────────────────────
  const pythonPlayground = (code, id) => `
    <div style="margin: 1.75rem 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--surface);">
      <div style="background: var(--surface-alt); padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border);">
        <span>🐍 PYTHON INTERACTIVE RUNTIME & SIMULATOR</span>
        <span style="font-size: 0.7rem; background: rgba(59,130,246,0.15); color: #3b82f6; padding: 0.15rem 0.4rem; border-radius: 3px; font-weight: bold;">Python 3.12 Ready</span>
      </div>
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; min-height: 200px; background: var(--bg);" id="py-pg-${id}">
        <textarea id="py-code-${id}" style="width: 100%; height: 100%; min-height: 200px; padding: 1rem; border: none; border-right: 1px solid var(--border); background: var(--bg); color: var(--fg); font-family: var(--mono); font-size: 0.88rem; line-height: 1.5; resize: vertical; outline: none; box-sizing: border-box;" spellcheck="false">${code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        <div style="display: flex; flex-direction: column; background: #0a0e17; color: #38bdf8; font-family: var(--mono); font-size: 0.85rem;">
          <div style="padding: 0.4rem 0.8rem; background: #111827; color: #94a3b8; font-size: 0.7rem; border-bottom: 1px solid #1e293b;">TERMINAL OUTPUT (stdout)</div>
          <pre id="py-out-${id}" style="flex: 1; padding: 1rem; margin: 0; overflow: auto; white-space: pre-wrap; word-break: break-all; color: #a5f3fc;"></pre>
        </div>
      </div>
      <div style="background: var(--surface-alt); padding: 0.6rem 1rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border);">
        <div style="display: flex; gap: 0.5rem;">
          <button onclick="runPyPlayground('${id}')" class="btn-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem; cursor: pointer;">&#x25B6; Run Code</button>
          <button onclick="resetPyPlayground('${id}')" class="btn-sec" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; cursor: pointer;">&#x21BA; Reset</button>
        </div>
        <span style="font-family: var(--mono); font-size: 0.72rem; color: var(--text-muted);">Client-side Python 3 execution</span>
      </div>
    </div>
  `;

  // ─── PLAYGROUND CLIENT SCRIPT & SIMULATOR ─────────────────────────────────
  const playgroundScript = `
    <script>
      function runPyPlayground(id) {
        var code = document.getElementById('py-code-' + id).value;
        var out = document.getElementById('py-out-' + id);
        out.textContent = '';
        out.style.color = '#a5f3fc';
        var stdout = [];
        var print = function() {
          var args = Array.prototype.slice.call(arguments);
          stdout.push(args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '));
        };
        var len = function(obj) { return obj ? (obj.length !== undefined ? obj.length : Object.keys(obj).length) : 0; };
        var range = function(start, stop, step) {
          if (stop === undefined) { stop = start; start = 0; }
          step = step || 1;
          var res = [];
          for (var i = start; i < stop; i += step) res.push(i);
          return res;
        };
        var str = String;
        var int = function(x) { return parseInt(x, 10); };
        var float = parseFloat;
        var bool = Boolean;

        try {
          // Transform lightweight Python constructs to JS for instant simulation
          var js = code
            .replace(/^#.*$/gm, '')
            .replace(/print\\((.*)\\)/g, 'print($1)')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false')
            .replace(/None/g, 'null')
            .replace(/def\\s+(\\w+)\\s*\\(([^)]*)\\):/g, 'function $1($2) {')
            .replace(/for\\s+(\\w+)\\s+in\\s+range\\(([^)]+)\\):/g, 'for (let $1 of range($2)) {')
            .replace(/for\\s+(\\w+)\\s+in\\s+([^\\s:]+):/g, 'for (let $1 of $2) {')
            .replace(/if\\s+__name__\\s*==\\s*['"]__main__['"]:/g, 'if (true) {')
            .replace(/if\\s+(.+):/g, 'if ($1) {')
            .replace(/elif\\s+(.+):/g, '} else if ($1) {')
            .replace(/else:/g, '} else {');

          var openCount = (js.match(/{/g) || []).length;
          var closeCount = (js.match(/}/g) || []).length;
          for (var k = closeCount; k < openCount; k++) js += '\\n}';

          var runner = new Function('print', 'len', 'range', 'str', 'int', 'float', 'bool', js);
          runner(print, len, range, str, int, float, bool);

          if (stdout.length === 0) {
            out.textContent = '[Process finished with exit code 0 (No output)]';
            out.style.color = '#94a3b8';
          } else {
            out.textContent = stdout.join('\\n');
          }
        } catch(e) {
          out.textContent = 'Traceback (most recent call last):\\n  Error: ' + e.message;
          out.style.color = '#f87171';
        }
      }

      function resetPyPlayground(id) {
        var ta = document.getElementById('py-code-' + id);
        ta.value = ta.getAttribute('data-original');
        var out = document.getElementById('py-out-' + id);
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
        document.querySelectorAll('textarea[id^="py-code-"]').forEach(function(ta) {
          ta.setAttribute('data-original', ta.value);
        });
      });
    </script>
  `;

  // ─── 20 PYTHON GUIDES METADATA ────────────────────────────────────────────
  const pythonGuides = [
    {
      slug: "variables",
      title: "Python Variables & Dynamic Typing",
      desc: "Master variable assignment, dynamic typing, integers, floats, booleans, and type conversion in Python.",
      snippet: `# Python Dynamic Typing & Multiple Assignment
user_id: int = 1042
username: str = "coder_neo"
is_active: bool = True
balance: float = 249.95

# Idiomatic Swapping Without Temp Variable
a, b = 10, 20
a, b = b, a  # a is now 20, b is now 10

# Dynamic Re-binding (Names are labels, not memory boxes)
x = 42
x = "Now I am a string"`,
      label: "📋 Copy Python Variables & Type Hinting Cheat Sheet",
      traps: [
        {
          title: "Mutable Default Arguments in Functions",
          desc: "Defining <code>def append_item(x, lst=[]):</code> causes <code>lst</code> to be instantiated once at module load time. Every function call reuses the same list across your entire program! Always use <code>lst=None</code> and instantiate inside."
        },
        {
          title: "Reference Assignment vs. Deep Copy (b = a)",
          desc: "Writing <code>b = a</code> does not duplicate a list; it merely creates a second pointer to the exact same list in memory. Modifying <code>b.append(1)</code> silently alters <code>a</code>. Use <code>b = a.copy()</code> or <code>copy.deepcopy(a)</code>."
        },
        {
          title: "UnboundLocalError from Variable Shadowing",
          desc: "Referencing a variable inside a function and assigning to it later in that same function causes Python to treat it as local everywhere in that scope, raising <code>UnboundLocalError: local variable referenced before assignment</code>. Use the <code>global</code> or <code>nonlocal</code> keyword."
        },
        {
          title: "Python is Pass-by-Object-Reference",
          desc: "Python is neither traditional pass-by-value nor pass-by-reference. When passing arguments to functions, Python passes the object reference pointer by value. Mutating mutable objects changes them globally, while reassigning parameter names does not."
        },
        {
          title: "Late Binding in Loops & Closures",
          desc: "Functions defined inside loops (e.g. <code>[lambda: i for i in range(3)]</code>) look up the loop variable <code>i</code> when called, not when created. All lambdas will evaluate to <code>2</code>. Fix with default arguments: <code>lambda i=i: i</code>."
        }
      ],
      faqs: [
        {
          q: "How does Python handle memory management for variables?",
          a: "Python uses reference counting augmented by a cyclic garbage collector. In Python, variables are named references (pointers) that bind to objects on the private heap. When an object's reference count drops to zero, its memory is deallocated."
        },
        {
          q: "What is the difference between dynamic typing and static typing?",
          a: "In dynamically typed Python, type checking occurs at runtime—variables can be rebound to different types without error. In statically typed languages (Java, C++), variable types are locked at compile-time."
        },
        {
          q: "Are Python type hints enforced at runtime?",
          a: "No. Standard Python type hints (PEP 484) are purely informational metadata for linters (Mypy, Ruff) and IDE autocompletion. Python does not raise runtime TypeErrors if you pass the wrong type unless validated with libraries like Pydantic."
        },
        {
          q: "What is the difference between is and == in Python?",
          a: "== checks for equality of values (invoking __eq__), while is checks object identity (whether both variables point to the exact same memory address in RAM via id())."
        },
        {
          q: "Why should you avoid using global variables in Python functions?",
          a: "Global variables introduce hidden side effects, make unit testing difficult, and cause race conditions in concurrent or multi-threaded applications. Pass dependencies explicitly as function arguments instead."
        }
      ]
    },
    {
      slug: "strings",
      title: "Python Strings & F-Strings",
      desc: "String slicing, indexing, formatting with f-strings, and essential string methods.",
      snippet: `name = "Ada Lovelace"
score = 98.756

# Modern F-String Formatting (Python 3.8+)
formatted = f"Player: {name.upper():<15} | Score: {score:.2f}% | Hex: {255:#04x}"

# Fast Slicing
reversed_str = name[::-1]
slug = "-".join(name.lower().split())`,
      label: "📋 Copy Python String Formatting & Slicing Snippet",
      traps: [
        {
          title: "String Immutability Assignment Trap",
          desc: "Attempting to change an individual character via <code>name[0] = 'B'</code> raises a fatal <code>TypeError: 'str' object does not support item assignment</code>. Python strings are strictly immutable; slice and concatenate to create a new string."
        },
        {
          title: "Repeated String Concatenation in Loops (O(N^2) Thrashing)",
          desc: "Writing <code>s += chunk</code> in a loop allocates a brand-new string and copies all preceding bytes every iteration. Always accumulate chunks into a list and call <code>''.join(chunks)</code> for O(N) linear performance."
        },
        {
          title: "Unescaped Backslashes in Regular Expressions and Windows Paths",
          desc: "A string like <code>path = 'C:\\temp\\new'</code> interprets <code>\\t</code> as a tab and <code>\\n</code> as a newline. Always use raw strings: <code>r'C:\\temp\\new'</code> or <code>pathlib.Path</code>."
        },
        {
          title: "String Interning Identity Trap (is vs ==)",
          desc: "Writing <code>a is b</code> may evaluate to True for short alphanumeric string literals due to CPython string interning, but will unexpectedly fail for dynamically computed or longer strings. Always use <code>a == b</code>."
        },
        {
          title: "Evaluating Expensive Functions Inside F-Strings",
          desc: "Placing heavy calculations or database lookups directly inside f-strings makes code hard to read and debug. Compute values beforehand into well-named local variables."
        }
      ],
      faqs: [
        {
          q: "What makes f-strings faster than % formatting and str.format()?",
          a: "F-strings are evaluated at runtime by specialized bytecode instructions (BUILD_STRING) rather than parsing a format specifier string repeatedly, making them significantly faster and more readable."
        },
        {
          q: "How does string slicing with step work in Python?",
          a: "The syntax string[start:stop:step] extracts characters from start up to stop (exclusive). A negative step like [::-1] walks backward, reversing the string in-place in memory."
        },
        {
          q: "What is the difference between str.strip(), str.lstrip(), and str.rstrip()?",
          a: "strip() removes whitespace (or specified characters) from both ends; lstrip() removes from the left (start) only; rstrip() removes from the right (end) only."
        },
        {
          q: "Are Python strings stored in ASCII or Unicode?",
          a: "All Python 3 strings are Unicode. Internally, CPython uses the flexible string representation (PEP 393), utilizing 1 byte (Latin-1), 2 bytes (UCS-2), or 4 bytes (UCS-4) per character depending on the largest code point."
        },
        {
          q: "How do you split a string by whitespace without leaving empty entries?",
          a: "Calling str.split() without arguments automatically splits on any whitespace sequence (spaces, tabs, newlines) and discards empty strings, unlike str.split(' ')."
        }
      ]
    },
    {
      slug: "numbers",
      title: "Python Numbers & Arithmetic Math",
      desc: "Integers, floating-point numbers, arithmetic operators, floor division, and the math module.",
      snippet: `from decimal import Decimal, ROUND_HALF_UP
import math

# Exact Currency Math with Decimal
price = Decimal("19.99")
tax = (price * Decimal("0.0825")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

# Integer Division & Modulo
quotient = 17 // 5  # Returns 3 (floor division)
remainder = 17 % 5  # Returns 2

# Math Module
hypot = math.hypot(3, 4)  # 5.0`,
      label: "📋 Copy Python Decimal Precision & Math Snippet",
      traps: [
        {
          title: "Floating-Point Binary Representation Imprecision",
          desc: "In Python, <code>0.1 + 0.2 == 0.3</code> evaluates to <code>False</code> because base-10 decimals cannot be represented exactly in IEEE 754 64-bit binary float (it evaluates to <code>0.30000000000000004</code>). Use <code>math.isclose()</code> or <code>Decimal</code>."
        },
        {
          title: "Division Operator Differences (/ vs //)",
          desc: "In Python 3, <code>/</code> always returns a <code>float</code> (even <code>4 / 2</code> yields <code>2.0</code>). Use the floor division operator <code>//</code> (e.g. <code>4 // 2</code> yields <code>2</code>) when an integer is required for indexing."
        },
        {
          title: "Floored Modulo with Negative Numbers (-7 % 4 == 1)",
          desc: "Python uses mathematical floored division rather than truncated division (used by C/Java). Therefore, <code>-7 % 4</code> evaluates to <code>1</code>, NOT <code>-3</code>. This is great for cyclic grids, but surprises engineers porting code from C/Java."
        },
        {
          title: "Banker's Rounding in Built-In round()",
          desc: "Python's <code>round(2.5)</code> evaluates to <code>2</code>, while <code>round(3.5)</code> evaluates to <code>4</code>. Python rounds half to the nearest even number (Gaussian rounding) to prevent statistical upward drift across large datasets."
        },
        {
          title: "Passing Floats to Decimal Constructors",
          desc: "Writing <code>Decimal(0.1)</code> defeats the purpose because the floating-point precision error is already baked into the literal before Decimal receives it. Always pass strings: <code>Decimal('0.1')</code>."
        }
      ],
      faqs: [
        {
          q: "What is the maximum integer size in Python 3?",
          a: "In Python 3, integers have arbitrary precision (unlimited length). They are only bounded by available system RAM, preventing integer overflow errors completely."
        },
        {
          q: "When should you use the decimal module instead of float?",
          a: "Use decimal whenever exact base-10 precision is mandatory, such as accounting, tax calculation, financial ledgers, and currency conversions."
        },
        {
          q: "How does math.isclose() work for comparing floating point values?",
          a: "math.isclose(a, b, rel_tol=1e-09, abs_tol=0.0) checks if two numbers are equal within a relative or absolute tolerance threshold, preventing floating-point precision comparison bugs."
        },
        {
          q: "What does the math.fsum() function do?",
          a: "math.fsum() tracks multiple intermediate partial sums to avoid loss of precision when summing an iterable of floating-point numbers, unlike the built-in sum() which accumulates errors."
        },
        {
          q: "How do bitwise operators like &, |, and ^ work on Python integers?",
          a: "Bitwise operators manipulate the underlying two's complement binary bits of integers directly. & is bitwise AND, | is OR, ^ is XOR, ~ is NOT, and << / >> shift bits."
        }
      ]
    },
    {
      slug: "booleans",
      title: "Python Booleans & Comparisons",
      desc: "Boolean truthiness, comparison operators, and logical operators (and, or, not).",
      snippet: `# Python Truthiness Evaluation
items = []

# Evaluates to False: None, False, 0, 0.0, '', [], (), {}, set()
if not items:
    print("List is empty (falsy)")

# Short-Circuiting Default Value Pattern
username = None
display_name = username or "Anonymous Guest"`,
      label: "📋 Copy Python Truthiness & Logical Operators Snippet",
      traps: [
        {
          title: "Identity Checking with is True Instead of Truthiness",
          desc: "Writing <code>if condition is True:</code> fails if <code>condition</code> is any truthy value other than the exact singleton <code>True</code> (e.g. <code>1</code> or a non-empty string). Idiomatic Python simply writes <code>if condition:</code>."
        },
        {
          title: "Chained Comparisons Execution Gotcha",
          desc: "Python allows mathematical chaining: <code>1 &lt; x &lt; 10</code>. However, writing <code>x == y in [1, 2]</code> chains as <code>(x == y) and (y in [1, 2])</code>, which is often not what beginners intended."
        },
        {
          title: "Short-Circuit Side-Effect Suppression",
          desc: "In <code>a() or b()</code>, if <code>a()</code> returns a truthy value, Python immediately short-circuits and never executes <code>b()</code>. Relying on side effects inside the right-hand operand will cause bugs."
        },
        {
          title: "bool('False') Evaluates to True",
          desc: "Passing any non-empty string into <code>bool()</code> returns <code>True</code>! Thus, <code>bool('False')</code> is <code>True</code>. Only <code>bool('')</code> evaluates to <code>False</code>."
        },
        {
          title: "Comparing Booleans to Numbers with is",
          desc: "Because <code>bool</code> is a subclass of <code>int</code> in Python, <code>True == 1</code> is True. However, <code>True is 1</code> is False because they are distinct objects in memory."
        }
      ],
      faqs: [
        {
          q: "What objects in Python are considered falsy?",
          a: "Falsy values include: None, False, numeric zero (0, 0.0, 0j), empty sequences ('', (), []), empty mappings ({}, set()), and objects whose __bool__() or __len__() returns False or 0."
        },
        {
          q: "How does the or operator work for fallback values?",
          a: "The expression a or b returns a if a is truthy; otherwise it evaluates and returns b. It returns the actual value of the operand, not a raw boolean."
        },
        {
          q: "What is short-circuit evaluation in Python?",
          a: "In logical and / or expressions, evaluation halts as soon as the outcome is certain. In a and b, if a is falsy, b is never evaluated. In a or b, if a is truthy, b is never evaluated."
        },
        {
          q: "Why is bool a subclass of int in Python?",
          a: "For historical backward compatibility with early Python versions where 1 and 0 were used as booleans. True has a value of 1 and False has a value of 0 in arithmetic contexts."
        },
        {
          q: "How can custom classes define their own truthiness?",
          a: "Implement the __bool__(self) method returning True or False. If __bool__ is not defined, Python falls back to __len__(self), where a length > 0 is truthy."
        }
      ]
    },
    {
      slug: "conditionals",
      title: "Python If, Elif, Else Conditions",
      desc: "Conditional execution flow, nested if statements, and inline ternary expressions.",
      snippet: `status_code = 404

# Multi-branch decision ladder
if 200 <= status_code < 300:
    category = "Success"
elif 400 <= status_code < 500:
    category = "Client Error"
elif 500 <= status_code < 600:
    category = "Server Error"
else:
    category = "Unknown"

# Inline Ternary Expression
mode = "production" if is_live else "development"`,
      label: "📋 Copy Python Conditionals & Ternary Operator Snippet",
      traps: [
        {
          title: "Assignment in Conditional Without Walrus Operator",
          desc: "Writing <code>if x = 5:</code> is a syntax error in Python. To assign and evaluate within a conditional, you must use the walrus operator introduced in Python 3.8: <code>if (x := get_value()) is not None:</code>."
        },
        {
          title: "Comparing with None Using == Instead of is",
          desc: "Always write <code>if val is None:</code> instead of <code>if val == None:</code>. A custom class can override <code>__eq__</code> to return True for anything, while <code>is</code> directly verifies singleton identity."
        },
        {
          title: "TabError from Inconsistent Whitespace Indentation",
          desc: "Mixing tabs and spaces within if/else blocks triggers a <code>TabError: inconsistent use of tabs and spaces in indentation</code>. Configure your editor to convert tabs to 4 spaces."
        },
        {
          title: "Overly Deep If-Else Nesting (Arrow Anti-Pattern)",
          desc: "Nesting if statements 4 or 5 levels deep degrades readability. Use guard clauses with early returns to flatten conditional code paths."
        },
        {
          title: "First-Match Short-Circuiting in Elif Ladders",
          desc: "An <code>elif</code> ladder stops checking conditions as soon as the first branch evaluates to True. Placing broad conditions before specific ones blocks the specific branches from ever executing."
        }
      ],
      faqs: [
        {
          q: "What is the syntax for a ternary conditional expression in Python?",
          a: "The syntax is: x if condition else y. It evaluates and returns x if condition is truthy, otherwise it evaluates and returns y."
        },
        {
          q: "What is the Walrus Operator (:=) and how is it used in if statements?",
          a: "The walrus operator := assigns values to variables as part of a larger expression. Example: if (n := len(data)) > 10: allows you to use n inside the block without calling len() twice."
        },
        {
          q: "Does Python have a switch/case statement?",
          a: "Yes! Python 3.10 introduced structural pattern matching using match and case statements, supporting value checks, sequence unpacking, and type guards."
        },
        {
          q: "How do guard clauses simplify conditional logic?",
          a: "Guard clauses check error conditions or edge cases at the top of a function and return or raise immediately, eliminating nested if/else blocks for the happy path."
        },
        {
          q: "Can multiple conditions be combined in a single if statement without parentheses?",
          a: "Yes, using and / or operators. However, parentheses are recommended when mixing and and or to enforce explicit precedence and improve readability."
        }
      ]
    },
    {
      slug: "lists",
      title: "Python Lists & List Operations",
      desc: "Creating lists, indexing, slicing, appending, inserting, sorting, and list manipulation.",
      snippet: `fruits = ["apple", "banana", "cherry", "date"]

# Slicing: [start:stop:step]
middle = fruits[1:3]     # ['banana', 'cherry']
reversed_list = fruits[::-1]

# In-place Modification
fruits.append("elderberry")
fruits.sort() # In-place sort (returns None)

# Fast Functional Sorting (New List)
sorted_by_len = sorted(fruits, key=len)`,
      label: "📋 Copy Python Lists & Manipulation Methods Snippet",
      traps: [
        {
          title: "Modifying a List While Iterating Over It",
          desc: "Deleting or inserting items in <code>for item in my_list:</code> alters the underlying index array, causing elements to be skipped silently. Iterate over a copy: <code>for item in my_list.copy():</code>."
        },
        {
          title: "Multiplying Nested Lists ([[0]*3]*3 Pointer Clone Trap)",
          desc: "Writing <code>grid = [[0] * 3] * 3</code> creates 3 references to the EXACT SAME inner list. Modifying <code>grid[0][0] = 1</code> changes all 3 rows simultaneously! Use a comprehension: <code>[[0] * 3 for _ in range(3)]</code>."
        },
        {
          title: "Assigning the Result of list.sort() (Returns None)",
          desc: "<code>my_list.sort()</code> sorts the list in-place and returns <code>None</code>. Writing <code>sorted_list = my_list.sort()</code> leaves <code>sorted_list</code> as <code>None</code>. Use <code>sorted(my_list)</code> to return a new sorted list."
        },
        {
          title: "Linear Search Time for Membership (O(N) vs O(1))",
          desc: "Checking <code>if item in large_list:</code> takes linear O(N) time because Python must inspect every element sequentially. If membership checks are frequent, convert the collection to a <code>set</code> for O(1) instant lookups."
        },
        {
          title: "Shallow vs. Deep Copy with Nested Objects",
          desc: "<code>list.copy()</code> creates a new outer list, but any inner lists or objects are copied by reference. Modifying an inner list mutates both copies. Use <code>copy.deepcopy()</code> for nested structures."
        }
      ],
      faqs: [
        {
          q: "How are lists implemented under the hood in CPython?",
          a: "CPython lists are variable-length arrays of pointers (not linked lists). Appending is amortized O(1), indexing is O(1), while inserting or deleting at arbitrary positions is O(N) due to shifting memory pointers."
        },
        {
          q: "What is the difference between append() and extend()?",
          a: "append(x) adds x as a single element to the end of the list. extend(iterable) unpacks the iterable and appends each element individually."
        },
        {
          q: "How do you remove duplicates from a list while preserving order?",
          a: "In Python 3.7+, dictionaries preserve insertion order, so list(dict.fromkeys(my_list)) removes duplicates in O(N) time while keeping the original order."
        },
        {
          q: "What is the difference between del, remove(), and pop()?",
          a: "del list[i] deletes an element by index; list.pop(i) removes and returns the element at index i (defaults to last); list.remove(val) searches and removes the first occurrence of value val."
        },
        {
          q: "Why does pop(0) have poor performance on large lists?",
          a: "Removing the first element requires shifting every remaining pointer in the array back by one position, an O(N) operation. Use collections.deque for fast O(1) pops from both ends."
        }
      ]
    },
    {
      slug: "tuples",
      title: "Python Tuples & Immutability",
      desc: "Immutable sequences, tuple unpacking, and using tuples as dictionary keys.",
      snippet: `# Tuple Initialization & Extended Star Unpacking
point = (10, 20, 30)
single_item = (42,) # Note the mandatory trailing comma

# Extended Unpacking
first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2, 3, 4], last=5

# NamedTuple for Structured Data
from typing import NamedTuple
class RGB(NamedTuple):
    r: int
    g: int
    b: int

color = RGB(255, 128, 0)`,
      label: "📋 Copy Python Tuples & Unpacking Patterns Snippet",
      traps: [
        {
          title: "Forgetting the Trailing Comma on Single-Item Tuples",
          desc: "Writing <code>t = (42)</code> creates an integer, NOT a tuple; the parentheses are treated as mathematical grouping. To create a 1-element tuple, a trailing comma is mandatory: <code>t = (42,)</code>."
        },
        {
          title: "Tuples with Mutable Elements Can Mutate",
          desc: "Immutability applies only to the tuple's direct reference pointers. If a tuple contains a list (<code>t = ([1, 2], 3)</code>), the inner list can still be mutated: <code>t[0].append(4)</code>."
        },
        {
          title: "Augmented Assignment on Tuple Elements Throws and Modifies",
          desc: "Writing <code>t[0] += [4]</code> on a tuple containing a list raises a <code>TypeError: 'tuple' object does not support item assignment</code>, but the list STILL gets modified in memory! Never store mutables inside tuples."
        },
        {
          title: "Unpacking ValueError on Length Mismatches",
          desc: "Attempting <code>a, b = (1, 2, 3)</code> raises <code>ValueError: too many values to unpack (expected 2)</code>. Use extended unpacking with a star: <code>a, *b = (1, 2, 3)</code>."
        },
        {
          title: "Using Tuples with Mutable Items as Dictionary Keys",
          desc: "A tuple is only hashable if all of its elements are hashable. A tuple containing a list cannot be used as a dict key or added to a set (<code>TypeError: unhashable type: 'list'</code>)."
        }
      ],
      faqs: [
        {
          q: "Why are tuples more memory-efficient than lists in Python?",
          a: "Tuples are immutable, so CPython allocates exact memory blocks without overallocation buffers. Small tuples are also cached by CPython, reducing memory fragmentation and allocation overhead."
        },
        {
          q: "When should you choose a tuple over a list?",
          a: "Use tuples for heterogeneous, fixed-size records (e.g. coordinates, database rows, key-value pairs) and whenever you need immutable data that can serve as dictionary keys."
        },
        {
          q: "What is the advantage of NamedTuple over standard tuples?",
          a: "NamedTuple provides field access via dot notation (e.g. point.x) and type hinting while retaining the lightweight memory footprint and tuple unpacking capabilities of regular tuples."
        },
        {
          q: "Can you modify a tuple in Python?",
          a: "No, tuples are strictly immutable once created. Any transformation requires creating a new tuple, e.g. new_tuple = old_tuple + (new_item,)."
        },
        {
          q: "What is sequence unpacking in function returns?",
          a: "When a function returns multiple values separated by commas (return x, y), it packs them into a tuple, allowing callers to unpack them directly: a, b = get_coords()."
        }
      ]
    },
    {
      slug: "dictionaries",
      title: "Python Dictionaries (Key-Value Maps)",
      desc: "Creating dictionaries, accessing keys, .get() defaults, iterating, and dict comprehensions.",
      snippet: `user = {"id": 42, "name": "Neo", "role": "admin"}

# Safe Retrieval with Default
avatar = user.get("avatar_url", "/default.png")

# Python 3.9+ Dictionary Merge Operators
base = {"timeout": 30, "debug": False}
override = {"debug": True}
active = base | override  # Merges dicts

# Dictionary Comprehension
squares = {x: x**2 for x in range(5)}`,
      label: "📋 Copy Python Dictionary Methods & Merge Operators Snippet",
      traps: [
        {
          title: "Direct Key Access Raising Fatal KeyError",
          desc: "Writing <code>val = user['missing_key']</code> raises a fatal <code>KeyError</code> if the key does not exist. Always use <code>user.get('missing_key', default)</code> or check <code>if 'key' in user:</code>."
        },
        {
          title: "Modifying Dictionary Keys During Iteration",
          desc: "Deleting or adding keys inside <code>for k in my_dict:</code> raises <code>RuntimeError: dictionary changed size during iteration</code>. Iterate over a list of keys: <code>for k in list(my_dict.keys()):</code>."
        },
        {
          title: "Using Mutable Types as Dictionary Keys",
          desc: "Dictionary keys must be hashable (implementing immutable <code>__hash__</code>). Using a list or dictionary as a key raises <code>TypeError: unhashable type: 'list'</code>. Use tuples instead."
        },
        {
          title: "Inefficient Dictionary Merging in Loops",
          desc: "Using <code>d = {**d, **new_items}</code> inside a loop creates a brand new dictionary every single iteration. Use <code>d.update(new_items)</code> for in-place mutation."
        },
        {
          title: "Assuming setdefault() is Lazy",
          desc: "In <code>d.setdefault('key', expensive_func())</code>, <code>expensive_func()</code> is evaluated on EVERY call, even if the key already exists! Use <code>defaultdict</code> from <code>collections</code> for lazy instantiation."
        }
      ],
      faqs: [
        {
          q: "How do Python dictionaries achieve O(1) average lookup time?",
          a: "Dictionaries use hash tables. CPython hashes the key using hash(), converts it to an array index, and resolves collisions using open addressing with quadratic perturbation."
        },
        {
          q: "Do dictionaries preserve insertion order in modern Python?",
          a: "Yes. Since Python 3.7, dictionaries are guaranteed to maintain insertion order as part of the language specification."
        },
        {
          q: "What is the difference between collections.defaultdict and dict.setdefault()?",
          a: "defaultdict takes a factory function (e.g. list, int) that is called lazily only when a missing key is accessed. setdefault() eagerly evaluates the default value every time."
        },
        {
          q: "How does the | dictionary merge operator work in Python 3.9+?",
          a: "The expression d1 | d2 creates a new merged dictionary where values in d2 overwrite matching keys from d1. The |= operator performs the merge in-place."
        },
        {
          q: "How can you iterate over both keys and values in a dictionary?",
          a: "Use for key, value in my_dict.items(): to unpack key-value pairs efficiently without performing secondary hash lookups."
        }
      ]
    },
    {
      slug: "sets",
      title: "Python Sets & Set Operations",
      desc: "Unique element collections, union, intersection, difference, and fast membership testing.",
      snippet: `admins = {"alice", "bob", "charlie"}
moderators = {"bob", "dave"}

# Set Algebra Operations
all_staff = admins | moderators      # Union
both_roles = admins & moderators     # Intersection
only_admins = admins - moderators    # Difference
exclusive = admins ^ moderators      # Symmetric Difference

# O(1) Constant Time Lookup
is_admin = "alice" in admins`,
      label: "📋 Copy Python Set Algebra & Operations Snippet",
      traps: [
        {
          title: "Creating an Empty Set with {} Creates a Dict",
          desc: "Writing <code>s = {}</code> creates an empty dictionary, NOT an empty set! To create an empty set, you must call the constructor: <code>s = set()</code>."
        },
        {
          title: "Unhashable Elements Cannot Be Stored in Sets",
          desc: "Sets require elements to have immutable hash values. Adding a list, dict, or another set raises <code>TypeError: unhashable type: 'list'</code>. Use <code>frozenset</code> to store nested sets."
        },
        {
          title: "Relying on Set Element Ordering",
          desc: "Sets are unordered collections. Never rely on the iteration order of a set, as it depends on hash seeds and memory layouts and can change across Python runs."
        },
        {
          title: "Modifying a Set During Iteration",
          desc: "Calling <code>s.add()</code> or <code>s.remove()</code> while iterating directly over <code>s</code> raises a <code>RuntimeError: Set changed size during iteration</code>."
        },
        {
          title: "Set Memory Overhead for Simple Numeric Sequences",
          desc: "Sets consume significantly more RAM than lists due to sparse hash table buckets. For storing millions of integers without lookups, use a <code>list</code> or <code>array.array</code>."
        }
      ],
      faqs: [
        {
          q: "What is the time complexity of checking membership (in) in a set?",
          a: "Set membership checking is O(1) constant time on average, compared to O(N) linear time in lists, making sets ideal for deduplication and filter checks."
        },
        {
          q: "What is a frozenset and when should you use it?",
          a: "A frozenset is an immutable version of a set. Because it cannot be modified after creation, it is hashable and can be used as a dictionary key or placed inside another set."
        },
        {
          q: "How do you find common elements between two large lists efficiently?",
          a: "Convert the smaller list to a set, then use set intersection or a comprehension: set(list_a) & set(list_b), executing in O(len(a) + len(b)) time."
        },
        {
          q: "What is the difference between remove() and discard() on a set?",
          a: "set.remove(x) raises a KeyError if x is not present in the set. set.discard(x) removes x if present and does nothing if it is missing, preventing unnecessary exceptions."
        },
        {
          q: "Can sets store custom objects?",
          a: "Yes, provided the custom class implements both __hash__() and __eq__() methods consistently."
        }
      ]
    },
    {
      slug: "for-loops",
      title: "Python For Loops & Range",
      desc: "Iterating over sequences, range(), enumerate(), and zip() multi-sequence iteration.",
      snippet: `items = ["core", "network", "storage"]

# Idiomatic Enumerate (Index + Item)
for index, item in enumerate(items, start=1):
    print(f"#{index}: {item}")

# Multi-Sequence Iteration with zip
names = ["Alice", "Bob"]
scores = [95, 88]
for name, score in zip(names, scores):
    print(f"{name} -> {score}")

# For-Else Clause (Runs if loop completes without break)
for item in items:
    if item == "missing":
        break
else:
    print("Item was not found in list")`,
      label: "📋 Copy Python For-Loops, Enumerate & Zip Snippet",
      traps: [
        {
          title: "The range(len(items)) Anti-Pattern",
          desc: "Writing <code>for i in range(len(items)): val = items[i]</code> is unpythonic and prone to index errors. Iterate directly over elements: <code>for val in items:</code>, or use <code>enumerate(items)</code> if indexes are needed."
        },
        {
          title: "The For-Else Misunderstanding",
          desc: "The <code>else</code> block attached to a for loop executes ONLY when the loop completes all iterations naturally. If the loop exits early via <code>break</code>, the <code>else</code> block is skipped."
        },
        {
          title: "Silent Data Truncation with zip()",
          desc: "<code>zip(a, b)</code> terminates as soon as the shortest iterable is exhausted, silently discarding extra items. In Python 3.10+, pass <code>strict=True</code> or use <code>itertools.zip_longest()</code>."
        },
        {
          title: "Modifying the Loop Variable Does Not Change Iteration",
          desc: "Assigning <code>i = 100</code> inside <code>for i in range(10):</code> does not jump ahead; on the next iteration, Python overwrites <code>i</code> with the next item from the iterator."
        },
        {
          title: "Loop Target Variable Leaks into Enclosing Scope",
          desc: "In Python, loop target variables (<code>for item in items:</code>) are not scoped to the loop; they remain accessible in the enclosing function or module with their last assigned value."
        }
      ],
      faqs: [
        {
          q: "How does the range() function work in Python 3?",
          a: "In Python 3, range() is an immutable sequence type (not a list). It computes values on demand in O(1) memory, regardless of how large the range span is."
        },
        {
          q: "What is the advantage of using enumerate() over manual index counters?",
          a: "enumerate() is written in C and yields (index, value) tuples natively, eliminating manual counter initialization, increment bugs, and off-by-one errors."
        },
        {
          q: "How does the zip(*matrix) trick transpose a 2D grid?",
          a: "zip(*matrix) unpacks the rows as separate arguments into zip(), grouping the 0th element of each row into a column, effectively transposing rows to columns."
        },
        {
          q: "Can you iterate backward over a sequence without reversing it?",
          a: "Yes, use the reversed(sequence) built-in, which returns a reverse iterator without allocating a new reversed list in memory."
        },
        {
          q: "What protocol makes an object iterable in a for loop?",
          a: "An object must implement either __iter__() returning an iterator, or __getitem__() accepting sequential zero-based integer indexes."
        }
      ]
    },
    {
      slug: "while-loops",
      title: "Python While Loops & Control Flow",
      desc: "While loops, infinite loop safety, break, continue, and while-else syntax.",
      snippet: `attempts = 0
max_retries = 3
success = False

while not success and attempts < max_retries:
    attempts += 1
    # Simulated retry logic
    if attempts == 2:
        success = True
        break

print(f"Outcome: {success} after {attempts} attempts")`,
      label: "📋 Copy Python While Loop with Retry Guard Snippet",
      traps: [
        {
          title: "Infinite Loops Caused by Forgotten Counter Increments",
          desc: "Failing to increment your loop counter variable (<code>i += 1</code>) or failing to update the loop condition freezes the process in an inescapable 100% CPU loop."
        },
        {
          title: "continue Bypassing the Counter Update",
          desc: "Calling <code>continue</code> before the increment step (<code>i += 1</code>) jumps directly to the next iteration without updating the counter, instantly creating an infinite loop."
        },
        {
          title: "Floating-Point While Loop Termination Checks",
          desc: "Writing <code>while x != 1.0: x += 0.1</code> will never terminate because cumulative binary floating-point imprecision means <code>x</code> will be <code>0.9999999999999999</code> then <code>1.0999999999999999</code>."
        },
        {
          title: "Busy-Waiting Without CPU Sleep",
          desc: "Writing <code>while not ready: pass</code> consumes 100% of a CPU core. Always introduce a brief pause: <code>time.sleep(0.01)</code> or use event synchronization primitives."
        },
        {
          title: "Loop Conditions with Complex Side-Effects",
          desc: "Placing state-mutating functions directly in the while condition makes code difficult to trace. Calculate state cleanly inside the loop body."
        }
      ],
      faqs: [
        {
          q: "When should you use a while loop instead of a for loop?",
          a: "Use while loops when the number of iterations is unknown in advance and depends on dynamic conditions (e.g. network polling, game loops, user input prompts, retry logic)."
        },
        {
          q: "How does the break statement work inside nested loops?",
          a: "break terminates only the innermost loop in which it resides. To break out of multiple nested loops, use a boolean flag, wrap in a function with return, or raise a custom exception."
        },
        {
          q: "Does the while-else statement execute if break is called?",
          a: "No. Just like for-else, the else block attached to a while loop executes only when the loop condition evaluates to False naturally without encountering a break."
        },
        {
          q: "How do you write a clean infinite loop in Python?",
          a: "Use while True: with an explicit break or return condition inside the body to terminate execution safely."
        },
        {
          q: "How do you handle keyboard interrupts (Ctrl+C) inside a while loop?",
          a: "Wrap the while loop in a try...except KeyboardInterrupt block to perform clean shutdowns, save state, and close open connections."
        }
      ]
    },
    {
      slug: "functions",
      title: "Python Functions & Arguments",
      desc: "Defining functions with def, return values, default parameters, *args, and **kwargs.",
      snippet: `def configure_node(
    hostname: str,
    *ip_aliases: str,
    port: int = 8080,
    **tags: str
) -> dict:
    """Standardized node deployment configuration."""
    return {
        "host": hostname,
        "aliases": list(ip_aliases),
        "port": port,
        "metadata": tags
    }

cfg = configure_node("srv-01", "10.0.0.1", port=443, region="us-east", tier="gold")`,
      label: "📋 Copy Python Functions, Type Hints & Kwargs Snippet",
      traps: [
        {
          title: "Mutable Default Argument Value Leak",
          desc: "Writing <code>def add(item, target=[]):</code> binds the list default at function definition time. Subsequent calls mutate and share the exact same list across users. Always default to <code>None</code>."
        },
        {
          title: "Shadowing Outer Scope Without global or nonlocal",
          desc: "Assigning to a variable inside a function makes it a local variable throughout that function. If you try to read it before assignment, Python throws <code>UnboundLocalError</code>."
        },
        {
          title: "Forgetting Keyword-Only Arguments (*)",
          desc: "When defining boolean flags or critical parameters, failing to enforce keyword-only arguments (<code>def f(x, *, verbose=False):</code>) allows callers to pass confusing unnamed booleans like <code>f(5, True)</code>."
        },
        {
          title: "Returning Multiple Values Unintentionally as a Tuple",
          desc: "Writing <code>return a, b</code> returns a single 2-element tuple. If the caller assigns to a single variable (<code>res = f()</code>), they receive the tuple rather than separate values."
        },
        {
          title: "Missing Return Statement Returning None",
          desc: "In Python, functions without an explicit <code>return</code> statement automatically return <code>None</code> upon reaching the end of the block."
        }
      ],
      faqs: [
        {
          q: "What do *args and **kwargs stand for in Python?",
          a: "*args captures extra positional arguments as a tuple. **kwargs captures extra keyword arguments as a dictionary."
        },
        {
          q: "What are keyword-only arguments and how do you define them?",
          a: "Arguments placed after a bare * in the parameter list must be supplied by name when called: def connect(host, *, port=80, timeout=30):."
        },
        {
          q: "What are positional-only arguments in Python 3.8+?",
          a: "Arguments placed before a / slash can only be passed positionally and cannot be passed by keyword: def pow(x, y, /):."
        },
        {
          q: "How does Python handle docstrings in functions?",
          a: "A string literal placed as the first statement inside a function becomes its __doc__ attribute, accessible by help() and automated documentation generators."
        },
        {
          q: "Can Python functions return functions (first-class citizens)?",
          a: "Yes. In Python, functions are first-class objects that can be assigned to variables, passed as arguments to other functions, and returned from functions (closures and decorators)."
        }
      ]
    },
    {
      slug: "lambda-functions",
      title: "Python Lambda & Anonymous Functions",
      desc: "Writing compact one-line lambda expressions with map(), filter(), and sorted().",
      snippet: `users = [
    {"name": "Alice", "score": 92},
    {"name": "Bob", "score": 85},
    {"name": "Charlie", "score": 96}
]

# Sort by score descending
sorted_users = sorted(users, key=lambda u: u["score"], reverse=True)

# Fast Map & Filter
scores = list(map(lambda u: u["score"], users))
high_achievers = list(filter(lambda u: u["score"] >= 90, users))`,
      label: "📋 Copy Python Lambda & Functional Sorting Snippet",
      traps: [
        {
          title: "Binding Lambdas to Variables Instead of def (PEP 8 Violation)",
          desc: "Writing <code>f = lambda x: x * 2</code> violates PEP 8. It obscures stack traces and sets <code>f.__name__</code> to <code>&lt;lambda&gt;</code>. Use <code>def f(x): return x * 2</code>."
        },
        {
          title: "Lambdas Cannot Contain Statements or Loops",
          desc: "Python lambdas are syntactically restricted to a single expression. They cannot contain assignments (<code>=</code>), loops (<code>for</code>/<code>while</code>), or <code>try/except</code> blocks."
        },
        {
          title: "Late Binding Closure Trap in Comprehensions",
          desc: "Creating lambdas in a loop (<code>[lambda: x for x in range(3)]</code>) results in all lambdas evaluating to the final loop value (2). Fix by passing default values: <code>lambda x=x: x</code>."
        },
        {
          title: "Writing Complex Unreadable Nested Lambdas",
          desc: "Nesting lambdas or using complex ternary expressions inside a lambda makes code unmaintainable. If logic requires more than 1 line, use a standard named function."
        },
        {
          title: "Overusing map() and filter() Over List Comprehensions",
          desc: "In modern Python, list comprehensions <code>[u['score'] for u in users]</code> are generally faster and more readable than <code>list(map(lambda u: u['score'], users))</code>."
        }
      ],
      faqs: [
        {
          q: "What is an anonymous lambda function in Python?",
          a: "A lambda is a small, inline function defined without a name using the lambda parameters: expression syntax that automatically returns the result of the expression."
        },
        {
          q: "Why are list comprehensions often preferred over map() and filter() with lambdas?",
          a: "List comprehensions avoid the function call overhead of lambdas in CPython and read like natural English, making them faster and more idiomatic."
        },
        {
          q: "Can a lambda function take multiple arguments?",
          a: "Yes. Separate parameters with commas: add = lambda x, y: x + y. Calling add(3, 5) returns 8."
        },
        {
          q: "What is the key argument in sorted() and how does lambda help?",
          a: "The key argument specifies a 1-argument function that extracts a comparison key from each element (e.g. key=lambda item: item['price'])."
        },
        {
          q: "Can a lambda function have type annotations?",
          a: "No, Python syntax does not support type annotations on lambda parameters or return types. Use def if type annotations are needed."
        }
      ]
    },
    {
      slug: "list-comprehensions",
      title: "Python List & Dict Comprehensions",
      desc: "Writing elegant, pythonic list, set, and dictionary comprehensions with conditional filtering.",
      snippet: `raw_names = [" alice ", "BOB", "   ", "charlie", "DAVID"]

# Filter & Transform Cleaned List
clean_names = [n.strip().title() for n in raw_names if n.strip()]

# Dictionary Comprehension (Name to Length)
name_map = {name: len(name) for name in clean_names}

# Set Comprehension (Unique Lengths)
unique_lengths = {len(name) for name in clean_names}`,
      label: "📋 Copy Python Comprehensions (List, Set, Dict) Snippet",
      traps: [
        {
          title: "Creating Massive Lists Instead of Generator Expressions",
          desc: "Writing <code>[x**2 for x in range(100_000_000)]</code> allocates gigabytes of RAM immediately. Use a generator expression with parentheses: <code>(x**2 for x in range(100_000_000))</code> for streaming O(1) memory."
        },
        {
          title: "Ternary Transform vs. Filter Placement Confusion",
          desc: "To filter items, place the condition at the end: <code>[x for x in data if x &gt; 0]</code>. To transform with an if/else ternary, place it at the front: <code>[x if x &gt; 0 else 0 for x in data]</code>."
        },
        {
          title: "Side-Effects Inside Comprehensions",
          desc: "Using comprehensions purely for side-effects (e.g. <code>[print(x) for x in items]</code> or calling mutation methods) allocates throwaway lists in RAM. Use a standard for loop."
        },
        {
          title: "Overly Complex Multi-For Loop Comprehensions",
          desc: "Nesting 3 or 4 loops and conditions inside a single comprehension turns it into unreadable spaghetti. If a comprehension exceeds 2 lines, refactor to standard loops."
        },
        {
          title: "Re-evaluating Expensive Filter Expressions",
          desc: "In <code>[f(x) for x in data if f(x)]</code>, <code>f(x)</code> is called TWICE per element. Use the walrus operator: <code>[res for x in data if (res := f(x))]</code> to evaluate once."
        }
      ],
      faqs: [
        {
          q: "Why are list comprehensions faster than standard for loops with .append()?",
          a: "List comprehensions run at C-level speed inside CPython using specialized LIST_APPEND bytecode, avoiding the repeated method lookup overhead of .append()."
        },
        {
          q: "What is the difference between a list comprehension and a generator expression?",
          a: "A list comprehension creates and populates the entire list in memory immediately. A generator expression produces items lazily one at a time on demand, consuming minimal memory."
        },
        {
          q: "How do you flatten a 2D matrix using a list comprehension?",
          a: "The syntax matches nested loops: [item for row in matrix for item in row]."
        },
        {
          q: "Can dictionary comprehensions invert keys and values?",
          a: "Yes, assuming values are unique and hashable: inverted = {v: k for k, v in original.items()}."
        },
        {
          q: "Do list comprehensions leak loop variables into the outer scope in Python 3?",
          a: "No. In Python 3, comprehensions have their own local scope, preventing loop variables from overwriting variables in the enclosing scope."
        }
      ]
    },
    {
      slug: "file-handling",
      title: "Python File I/O & Context Managers",
      desc: "Reading and writing files safely using open() and with statement context managers.",
      snippet: `from pathlib import Path

file_path = Path("reports/summary.txt")
file_path.parent.mkdir(parents=True, exist_ok=True)

# Safe Atomic Writing with UTF-8
with file_path.open("w", encoding="utf-8") as f:
    f.write("Status: Complete\\nRecords: 1500\\n")

# Streaming Line-by-Line Reading (Low RAM)
with file_path.open("r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())`,
      label: "📋 Copy Python Pathlib & Safe File I/O Template",
      traps: [
        {
          title: "Omitting Explicit UTF-8 Encoding (Platform Default Trap)",
          desc: "Writing <code>open('file.txt', 'w')</code> defaults to system encoding (e.g. Windows <code>cp1252</code>), corrupting emojis and Unicode text. Always specify <code>encoding='utf-8'</code>."
        },
        {
          title: "Opening Files Without with Context Managers",
          desc: "Opening files manually without <code>with open(...)</code> leaks open file descriptors if an exception occurs before <code>close()</code>, causing file locking issues on Windows."
        },
        {
          title: "Calling readlines() on Massive Multi-Gigabyte Files",
          desc: "Calling <code>f.readlines()</code> loads the entire file into RAM at once, crashing your process with an <code>OutOfMemoryError</code>. Iterate over the file object directly: <code>for line in f:</code>."
        },
        {
          title: "Manual String Concatenation for Filepaths",
          desc: "Constructing paths like <code>'folder/' + filename</code> causes cross-platform separator bugs between Windows (<code>\\</code>) and Linux (<code>/</code>). Always use <code>pathlib.Path</code>."
        },
        {
          title: "Non-Atomic Overwriting Corrupting Critical Files",
          desc: "Opening an existing file in <code>'w'</code> mode truncates it to 0 bytes immediately. If your script crashes mid-write, the original data is destroyed. Write to a temporary file then atomically replace."
        }
      ],
      faqs: [
        {
          q: "Why should you always use pathlib over the legacy os.path module?",
          a: "pathlib provides an object-oriented API where paths are rich objects with methods (.exists(), .read_text(), .mkdir()) and cross-platform / slash operators, making code cleaner and safer."
        },
        {
          q: "What does the with statement guarantee during file operations?",
          a: "The with statement invokes the context manager's __enter__ and __exit__ methods, guaranteeing that file buffers are flushed and file descriptors closed even if an unhandled exception occurs."
        },
        {
          q: "What is the difference between 'w', 'a', and 'x' file modes?",
          a: "'w' opens for writing, truncating existing content; 'a' opens for appending to the end; 'x' creates a new file exclusively, raising FileExistsError if the file already exists."
        },
        {
          q: "How do you read and write binary files in Python?",
          a: "Append 'b' to the mode string: 'rb' for reading bytes and 'wb' for writing raw bytes (such as images, compressed archives, or compiled bytecode)."
        },
        {
          q: "How do you safely create parent directories if they don't exist?",
          a: "Use path.parent.mkdir(parents=True, exist_ok=True) before opening the file for writing."
        }
      ]
    },
    {
      slug: "error-handling",
      title: "Python Error Handling (Try / Except)",
      desc: "Handling runtime errors with try, except, else, finally, and raising custom exceptions.",
      snippet: `import logging
logger = logging.getLogger(__name__)

def parse_config(raw_input: str) -> int:
    try:
        val = int(raw_input)
        if val <= 0:
            raise ValueError("Value must be strictly positive")
        return val
    except ValueError as err:
        logger.warning("Validation failure: %s", err)
        raise
    except Exception as err:
        logger.error("Unexpected error: %s", err, exc_info=True)
        raise RuntimeError("Configuration processing failed") from err
    finally:
        # Guaranteed cleanup hook
        pass`,
      label: "📋 Copy Python Robust Exception Handling Snippet",
      traps: [
        {
          title: "Naked Except Clauses (except:)",
          desc: "Writing <code>except:</code> catches <code>KeyboardInterrupt</code> and <code>SystemExit</code>, preventing users from stopping the script with Ctrl+C. Always catch specific exceptions or at least <code>except Exception:</code>."
        },
        {
          title: "Silently Swallowing Exceptions (except Exception: pass)",
          desc: "Silencing exceptions with <code>pass</code> hides fatal runtime failures, leaving zero diagnostic logs and causing corruption down the pipeline. Always log or re-raise."
        },
        {
          title: "Suppressing Root Causes with Unlinked Re-raises",
          desc: "Raising a new exception inside an except block without linking loses the original traceback. Use <code>raise CustomError() from err</code> to preserve exception chaining."
        },
        {
          title: "Returning Inside finally Blocks",
          desc: "Placing a <code>return</code> statement inside a <code>finally</code> block silently cancels and suppresses any exception raised inside the <code>try</code> block!"
        },
        {
          title: "Catching Exceptions That Should Crash Fast",
          desc: "Catching developer bugs like <code>TypeError</code> or <code>NameError</code> masks typos and syntax flaws that should fail fast during testing."
        }
      ],
      faqs: [
        {
          q: "What is the purpose of the else block in a try-except statement?",
          a: "The else block executes only if the try block completes successfully without raising any exceptions, keeping happy-path logic separate from protected try code."
        },
        {
          q: "How do custom exceptions improve code architecture?",
          a: "Creating domain-specific exceptions (e.g. class PaymentFailedError(Exception): pass) allows callers to handle specific business failures cleanly without parsing error strings."
        },
        {
          q: "What does raise ... from err (exception chaining) do?",
          a: "It sets the __cause__ attribute on the new exception, displaying both tracebacks in terminal logs so developers can see the root underlying error."
        },
        {
          q: "What is the difference between BaseException and Exception?",
          a: "BaseException is the root of all exceptions, including system-exiting signals like KeyboardInterrupt and SystemExit. Exception is the base for all non-fatal application exceptions."
        },
        {
          q: "What is the EAFP principle in Python?",
          a: "EAFP stands for 'Easier to Ask for Forgiveness than Permission.' Python encourages trying an operation and catching exceptions rather than running defensive pre-checks."
        }
      ]
    },
    {
      slug: "modules-packages",
      title: "Python Modules & Imports",
      desc: "Importing standard libraries, creating custom modules, and __name__ == \"__main__\".",
      snippet: `import os
import sys
from pathlib import Path

# Main Guard Pattern for Executable Modules
def run_cli() -> None:
    print("Executing standalone module entry point...")

if __name__ == "__main__":
    run_cli()`,
      label: "📋 Copy Python Module Structure & __name__ Guard Snippet",
      traps: [
        {
          title: "Circular Import Deadlocks",
          desc: "When module A imports module B at top-level while module B imports module A, Python throws <code>ImportError: cannot import name</code> because the module is only partially initialized. Refactor common dependencies into a third module."
        },
        {
          title: "Wildcard Imports (from module import *)",
          desc: "Wildcard imports pollute the local namespace, silently overwrite existing variables, and prevent linters from detecting undefined variables. Import specific names explicitly."
        },
        {
          title: "Shadowing Built-In Module Names",
          desc: "Naming a local file <code>random.py</code>, <code>math.py</code>, or <code>json.py</code> shadows Python's standard library. Any subsequent import will import your local file instead of the built-in module."
        },
        {
          title: "Missing if __name__ == '__main__': Guard",
          desc: "Code written at the root of a script runs immediately whenever that script is imported as a module by another file, causing unintended side effects."
        },
        {
          title: "Manipulating sys.path with Brittle Relative Paths",
          desc: "Hardcoding <code>sys.path.append('../')</code> creates fragile scripts that fail when launched from different working directories. Structure code as an installable package."
        }
      ],
      faqs: [
        {
          q: "What does if __name__ == '__main__': do in Python?",
          a: "When a script is run directly, Python sets __name__ to '__main__'. When imported by another file, __name__ is set to the module's name. This guard prevents code from running during imports."
        },
        {
          q: "What is the role of __init__.py in Python packages?",
          a: "__init__.py marks a directory as a regular Python package and allows you to define package-level exports via __all__ and execute package initialization logic."
        },
        {
          q: "What is the difference between absolute and relative imports?",
          a: "Absolute imports specify the full path from the project root (from myapp.core import config). Relative imports use leading dots (from .core import config) relative to the current module."
        },
        {
          q: "How does Python determine import search paths?",
          a: "Python searches sys.path in order: 1) the directory of the running script, 2) PYTHONPATH environment variable directories, and 3) standard library and site-packages."
        },
        {
          q: "What is __all__ and how does it control package exports?",
          a: "__all__ is a list of string names defining what is exported when a consumer executes from package import *."
        }
      ]
    },
    {
      slug: "classes-oop",
      title: "Python Classes & Object-Oriented Programming",
      desc: "Object-oriented programming in Python: classes, __init__, self, methods, and inheritance.",
      snippet: `from dataclasses import dataclass, field
from typing import List

# Modern Python Dataclass (Python 3.7+)
@dataclass
class Player:
    username: str
    level: int = 1
    inventory: List[str] = field(default_factory=list)

    def gain_xp(self, xp: int) -> None:
        self.level += xp // 100

    @property
    def is_veteran(self) -> bool:
        return self.level >= 50

steve = Player("Steve", level=10)`,
      label: "📋 Copy Python OOP Class & Dataclass Pattern Snippet",
      traps: [
        {
          title: "Class Attribute vs. Instance Attribute Mutation",
          desc: "Defining a mutable list directly inside the class body (<code>class Team: members = []</code>) shares that list across ALL instances! Always initialize mutable attributes inside <code>__init__</code> on <code>self</code>."
        },
        {
          title: "Forgetting self in Instance Method Signatures",
          desc: "Defining <code>def attack():</code> inside a class fails with <code>TypeError: attack() takes 0 positional arguments but 1 was given</code> because Python automatically passes the instance as the first argument."
        },
        {
          title: "Dataclass Mutable Default Value Error",
          desc: "Writing <code>items: list = []</code> inside a <code>@dataclass</code> raises a <code>ValueError: mutable default is not allowed</code>. Use <code>field(default_factory=list)</code> instead."
        },
        {
          title: "Assuming Double Underscore __var Makes Fields Private",
          desc: "Python does not have true private variables. Double underscores trigger name mangling (renaming to <code>_ClassName__var</code>), but it can still be accessed and modified externally."
        },
        {
          title: "Diamond Problem & Inconsistent super() Calls",
          desc: "Failing to use <code>super().__init__()</code> in multiple inheritance disrupts Python's Method Resolution Order (MRO), causing parent initialization methods to be skipped."
        }
      ],
      faqs: [
        {
          q: "What is the self parameter in Python classes?",
          a: "self is an explicit reference to the current instance of the class, allowing access to instance attributes and methods."
        },
        {
          q: "Why are @dataclasses preferred over traditional boilerplate classes?",
          a: "The @dataclass decorator automatically generates __init__, __repr__, __eq__, and typing support based on class field annotations, eliminating dozens of lines of repetitive code."
        },
        {
          q: "What does the @property decorator do?",
          a: "It turns a method into a getter attribute, allowing users to access calculated values with dot notation (e.g. obj.area) without calling parentheses."
        },
        {
          q: "What is the difference between classmethod and staticmethod?",
          a: "@classmethod receives the class (cls) as its first argument and is used for alternative constructors. @staticmethod receives neither self nor cls and acts like a regular function grouped inside a class."
        },
        {
          q: "What is Method Resolution Order (MRO) in Python?",
          a: "MRO is the order in which Python searches for attributes and methods across inheritance hierarchies, resolved using the C3 Linearization algorithm accessible via ClassName.mro()."
        }
      ]
    },
    {
      slug: "json-handling",
      title: "Python JSON Parsing & Serialization",
      desc: "Working with JSON in Python using json.loads(), json.dumps(), and file loading.",
      snippet: `import json
from pathlib import Path

payload = {
    "site": "Digital Tools Shed",
    "version": 2.5,
    "features": ["speed", "zero-dependency", "offline"],
    "active": True
}

# Pretty-Printed JSON String
json_text = json.dumps(payload, indent=2, sort_keys=True)

# Direct File Serialization
file_path = Path("config.json")
with file_path.open("w", encoding="utf-8") as f:
    json.dump(payload, f, indent=2)

# Reading Back
with file_path.open("r", encoding="utf-8") as f:
    loaded_data = json.load(f)`,
      label: "📋 Copy Python JSON Serialization & File Parsing Snippet",
      traps: [
        {
          title: "TypeError on Non-Serializable Python Types (set, datetime)",
          desc: "Attempting to serialize a <code>set</code>, <code>datetime</code>, or custom class with <code>json.dumps()</code> raises <code>TypeError: Object of type ... is not JSON serializable</code>. Supply a custom <code>default=</code> serializer function."
        },
        {
          title: "Confusing json.load() with json.loads()",
          desc: "<code>json.load(f)</code> parses from a file-like stream object; <code>json.loads(s)</code> parses from a string. Passing a string into <code>load()</code> raises <code>AttributeError: 'str' object has no attribute 'read'</code>."
        },
        {
          title: "Integer Dictionary Keys Converted to Strings",
          desc: "In Python, <code>{1: 'a'}</code> has an integer key. After round-tripping through JSON, the key becomes a string <code>{'1': 'a'}</code> because JSON object keys must be strings."
        },
        {
          title: "Single Quotes in JSON Strings Causing JSONDecodeError",
          desc: "Standard JSON requires double quotes for keys and strings. Passing single-quoted Python dictionary representations into <code>json.loads()</code> throws a fatal <code>JSONDecodeError</code>."
        },
        {
          title: "Loss of High-Precision Decimals",
          desc: "JSON represents all numbers as floating-point or integers. High-precision <code>Decimal</code> numbers will be converted to floats and lose precision unless stored as string representations."
        }
      ],
      faqs: [
        {
          q: "How do you serialize datetime objects to JSON in Python?",
          a: "Pass a custom serializer function: json.dumps(data, default=str) or default=lambda o: o.isoformat() if isinstance(o, datetime) else None."
        },
        {
          q: "What is the difference between json.dumps and json.dump?",
          a: "json.dumps() (dump string) returns a serialized JSON string. json.dump() writes the serialized JSON directly into an open writable file stream."
        },
        {
          q: "How do you pretty-print JSON with indentation?",
          a: "Supply the indent parameter: json.dumps(data, indent=2, sort_keys=True)."
        },
        {
          q: "How can you parse JSON with Decimal numbers instead of floats?",
          a: "Pass parse_float=Decimal to json.loads(text, parse_float=Decimal)."
        },
        {
          q: "Why is json.loads() vulnerable to billion laughs or deep nesting attacks?",
          a: "Extremely deeply nested JSON can trigger recursion limit errors. Always sanitize untrusted input or set limits in web APIs."
        }
      ]
    },
    {
      slug: "datetime-module",
      title: "Python Datetime & Timestamp Formatting",
      desc: "Working with dates, times, timezones, timedeltas, and strftime formatting in Python.",
      snippet: `from datetime import datetime, timezone, timedelta

# Modern Aware UTC Timestamp (Python 3.11+)
now_utc = datetime.now(timezone.utc)

# ISO 8601 String Formatting
iso_stamp = now_utc.isoformat()

# Date Arithmetic
two_weeks_hence = now_utc + timedelta(days=14)

# Parsing Strings with strptime
parsed = datetime.strptime("2026-09-06 12:00:00", "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)`,
      label: "📋 Copy Python Aware Datetime & ISO 8601 Snippet",
      traps: [
        {
          title: "Comparing Naive and Aware Datetime Objects",
          desc: "Attempting to compare or subtract a timezone-naive datetime with a timezone-aware datetime raises <code>TypeError: can't compare offset-naive and offset-aware datetimes</code>. Always use aware datetimes."
        },
        {
          title: "Using Deprecated datetime.utcnow()",
          desc: "In Python 3.12+, <code>datetime.utcnow()</code> is officially deprecated because it returns a naive datetime that easily causes timezone conversion bugs. Always use <code>datetime.now(timezone.utc)</code>."
        },
        {
          title: "Daylight Saving Time Arithmetic Drift",
          desc: "Adding <code>timedelta(days=1)</code> across a Daylight Saving Time boundary can offset the hour. For calendar-aware local times across transitions, use the modern <code>zoneinfo.ZoneInfo</code> module."
        },
        {
          title: "strptime vs. strftime Mnemonic Confusion",
          desc: "<code>strptime</code> stands for 'parse time' (converts string to datetime object). <code>strftime</code> stands for 'format time' (converts datetime object to formatted string)."
        },
        {
          title: "Calling .timestamp() on Naive Datetimes",
          desc: "Calling <code>.timestamp()</code> on a naive datetime assumes it represents local system time, which produces incorrect UTC epoch timestamps when run on servers in different timezones."
        }
      ],
      faqs: [
        {
          q: "How do you get the current time in UTC in modern Python?",
          a: "Use datetime.now(timezone.utc) from the datetime module (standard in Python 3.11+)."
        },
        {
          q: "What is the difference between a naive and an aware datetime?",
          a: "A naive datetime has tzinfo=None and does not know what timezone it belongs to. An aware datetime has an explicit tzinfo attached, enabling unambiguous conversions and global comparisons."
        },
        {
          q: "How do you work with specific named timezones (like 'America/New_York')?",
          a: "Use Python's built-in zoneinfo module: from zoneinfo import ZoneInfo; dt = datetime.now(ZoneInfo('America/New_York'))."
        },
        {
          q: "How does timedelta represent duration in Python?",
          a: "timedelta represents the difference between two dates or times, supporting arithmetic with days, seconds, microseconds, milliseconds, minutes, hours, and weeks."
        },
        {
          q: "How do you parse ISO 8601 strings into datetime objects?",
          a: "Use datetime.fromisoformat(iso_string), which handles standard UTC timestamps ('Z' or '+00:00') natively in Python 3.11+."
        }
      ]
    }
  ];

  // ─── RENDER INDIVIDUAL GUIDE PAGES ────────────────────────────────────────
  for (const g of pythonGuides) {
    const body = `
      <div class="article-container" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/learn/">Learn Hub</a> &gt; <a href="/learn/python/">Python</a> &gt; ${g.title}
        </nav>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">${g.title}</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${g.desc}
        </p>

        ${renderCopyCard(g.snippet, g.label, `btnCopy_${g.slug.replace(/[^a-zA-Z0-9]/g, '_')}`)}

        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0;">
          <h2 style="font-family: var(--serif); font-size: 1.3rem; margin-top: 0;">Interactive Sandbox & Core Concepts</h2>
          <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
            Python is celebrated for its clean syntax, high readability, and expressive standard library. Understanding <strong>${g.title}</strong> is essential for backend engineering, high-throughput automation, and data pipelines.
          </p>

          ${pythonPlayground(g.snippet, g.slug)}
        </div>

        ${renderPyTraps(g.traps)}
        ${renderPyFaqs(g.faqs)}
        ${generateFaqSchema(g.faqs, `${g.title} FAQs`, `${DOMAIN}/learn/python/${g.slug}`)}

        <div style="border-top: 1px solid var(--border); margin-top: 3rem; padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="/learn/python/" class="btn-sec" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">&larr; Python Hub</a>
          <a href="/learn/" class="btn-primary" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">All Learn Tracks &rarr;</a>
        </div>

        ${playgroundScript}
      </div>
    `;

    const html = renderPage({
      title: `${g.title} | Python Guide | Digital Tools Shed`,
      metaDesc: g.desc,
      canonical: `${DOMAIN}/learn/python/${g.slug}`,
      bodyContent: body,
      currentPath: `/learn/python/${g.slug}`
    });

    writeFileSync(join(pyDist, `${g.slug}.html`), html);
  }

  // ─── PYTHON HUB PAGE DATA & RENDERING ─────────────────────────────────────
  const hubCopySnippet = `# Python Professional Toolchain Setup (Python 3.12+)
# 1. Verify Python Version
python3 --version

# 2. Initialize Clean Virtual Environment
python3 -m venv .venv

# 3. Activate Virtual Environment
source .venv/bin/activate  # macOS / Linux
.venv\\Scripts\\activate     # Windows PowerShell

# 4. Install Core Production Tools
pip install --upgrade pip ruff mypy pytest`;

  const hubTraps = [
    {
      title: "Installing Global Packages via sudo pip",
      desc: "Running <code>sudo pip install</code> breaks system-level package managers on modern Linux/macOS distributions (PEP 668 externally managed environment). Always use isolated virtual environments (<code>venv</code>)."
    },
    {
      title: "Skipping Type Annotations in Production Code",
      desc: "Neglecting Python type annotations leads to runtime <code>AttributeError</code>s and makes large codebases difficult to refactor. Enforce static type checking with Mypy or Pyright."
    },
    {
      title: "The 'Python is Slow' Algorithmic Fallacy",
      desc: "Slow Python execution is almost always caused by inefficient nested loop algorithms (O(N^2)) or failing to leverage C-backed vectorized libraries (like NumPy, Polars, or built-in dictionary hash tables)."
    },
    {
      title: "Mutable Default Arguments in Functions",
      desc: "The single most common bug in Python: <code>def func(x, data=[])</code> shares a single mutable list across all calls. Always use <code>data=None</code>."
    },
    {
      title: "Neglecting Automated Code Quality Linters (Ruff)",
      desc: "Debating code style in pull requests wastes engineering time. Automate formatting, linting, and import sorting using modern high-speed linters like Ruff."
    }
  ];

  const hubFaqs = [
    {
      q: "What is the recommended roadmap for mastering Python in 2026?",
      a: "Begin with fundamental data structures and control flow (Guides 01-11), conquer functional idioms and comprehensions (Guides 12-14), master file I/O, error handling, and modules (Guides 15-17), and advance to OOP, JSON, and timezone-aware datetimes (Guides 18-20)."
    },
    {
      q: "Which version of Python should I use for modern development?",
      a: "Use Python 3.12 or newer. Modern Python releases feature substantial performance optimizations (Faster CPython project), clean type syntax, and improved error tracebacks."
    },
    {
      q: "Why is Python the leading language for Artificial Intelligence and Machine Learning?",
      a: "Python combines high readability with high-performance C/C++/CUDA underlying runtimes (PyTorch, TensorFlow, NumPy), allowing rapid experimentation with hardware-accelerated execution."
    },
    {
      q: "How long does it take to learn Python for backend web development?",
      a: "With focused practice, developers typically grasp core Python in 4-6 weeks and master web frameworks like FastAPI or Django along with PostgreSQL in 3-4 months."
    },
    {
      q: "What tools should every modern Python developer use?",
      a: "Virtual environments (venv/uv), package management (pip/uv), code formatting and linting (Ruff), static type checking (mypy), and automated testing (pytest)."
    }
  ];

  const hubCards = pythonGuides.map(g => `
    <a href="/learn/python/${g.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${g.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${g.desc}</p>
    </a>
  `).join('');

  const hubBody = `
    <div class="article-container" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/learn/">Learn Hub</a> &gt; Python Guides
      </nav>
      <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Complete Python Programming Guide</h1>
      <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem;">
        Master Python from fundamentals to advanced data structures, OOP, comprehensions, and error handling.
      </p>

      ${renderCopyCard(hubCopySnippet, '📋 Copy Python Professional Toolchain Setup Commands', 'btnCopyPyHubSetup')}

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
        ${hubCards}
      </div>

      ${renderPyTraps(hubTraps)}
      ${renderPyFaqs(hubFaqs)}
      ${generateFaqSchema(hubFaqs, 'Python Programming Guide & Curriculum FAQs', `${DOMAIN}/learn/python/`)}

      ${playgroundScript}
    </div>
  `;

  writeFileSync(join(pyDist, 'index.html'), renderPage({
    title: 'Python Programming Guide & Tutorials | Digital Tools Shed',
    metaDesc: 'Complete Python programming tutorial series: variables, data types, lists, dictionaries, OOP, and best practices.',
    canonical: `${DOMAIN}/learn/python/`,
    bodyContent: hubBody,
    currentPath: '/learn/python/'
  }));

  console.log(`  ✓ Built Python Learn Section (${pythonGuides.length} guides in /learn/python/)`);
}
