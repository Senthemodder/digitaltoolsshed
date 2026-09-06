// scripts/learn.js - Complete JavaScript Education Suite & Learning Hub for Digital Tools Shed

export function buildLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const learnDist = join(DIST, 'learn');
  const jsDist = join(learnDist, 'javascript');
  ensureDir(learnDist);
  ensureDir(jsDist);

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

  function renderJsTraps(traps) {
    const borderColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    return `
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem;">⚠️ 5 Fatal Traps & JavaScript Pitfalls</h2>
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

  function renderJsFaqs(faqs) {
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

  const playground = (code, id) => `
    <div style="margin: 1.5rem 0; border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
      <div style="background: var(--surface-alt); padding: 0.4rem 0.8rem; font-family: var(--mono); font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid var(--border);">
        Try It Yourself
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; min-height: 160px; background: var(--bg);" id="pg-${id}">
        <textarea id="pg-code-${id}" style="width: 100%; height: 100%; padding: 1rem; border: none; border-right: 1px solid var(--border); background: var(--bg); color: var(--fg); font-family: var(--mono); font-size: 0.9rem; resize: none; outline: none; margin: 0; box-sizing: border-box;" spellcheck="false">${code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
        <pre id="pg-out-${id}" style="width: 100%; height: 100%; padding: 1rem; border: none; background: var(--surface); color: var(--fg); font-family: var(--mono); font-size: 0.9rem; overflow: auto; margin: 0; box-sizing: border-box;"></pre>
      </div>
      <div style="background: var(--surface-alt); padding: 0.5rem; display: flex; gap: 0.5rem; border-top: 1px solid var(--border);">
        <button onclick="runPlayground('${id}')" style="background: var(--btn-bg, #3b82f6); color: var(--btn-fg, #fff); border: none; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: 600;">&#x25B6; Run</button>
        <button onclick="resetPlayground('${id}')" style="background: transparent; color: var(--text-muted); border: 1px solid var(--border); padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">&#x21BA; Reset</button>
      </div>
    </div>
  `;

  const playgroundScript = `
    <script>
      function runPlayground(id) {
        const code = document.getElementById('pg-code-' + id).value;
        const out = document.getElementById('pg-out-' + id);
        out.textContent = '';
        const logs = [];
        const fakeConsole = { log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')) };
        try {
          const fn = new Function('console', code);
          const result = fn(fakeConsole);
          out.textContent = logs.join('\\n');
          if (result !== undefined && logs.length === 0) out.textContent = String(result);
        } catch(e) {
          out.textContent = 'Error: ' + e.message;
          out.style.color = '#ef4444';
        }
      }
      function resetPlayground(id) {
        const ta = document.getElementById('pg-code-' + id);
        ta.value = ta.getAttribute('data-original');
        const out = document.getElementById('pg-out-' + id);
        out.textContent = '';
        out.style.color = 'inherit';
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
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('textarea[id^="pg-code-"]').forEach(ta => ta.setAttribute('data-original', ta.value));
      });
    </script>
  `;

  // ─── 30 JS GUIDES METADATA ────────────────────────────────────────────────
  const JS_METADATA = {
    'variables': {
      copySnippet: `// Modern JavaScript Variable Declarations
const MAX_RETRIES = 3;         // Block-scoped, immutable identifier binding
let attempts = 0;              // Block-scoped, mutable variable

// Destructuring assignment
const { id, username } = { id: 101, username: "neo" };
const [first, ...rest] = [10, 20, 30, 40];

// Primitive Data Types: string, number, bigint, boolean, undefined, symbol, null
const idSymbol = Symbol("userId");
const bigIntNum = 9007199254740991n;`,
      copyLabel: '📋 Copy JavaScript Variables & Data Types Cheat Sheet',
      traps: [
        {
          title: 'Temporal Dead Zone (TDZ) with let and const',
          desc: 'Accessing a <code>let</code> or <code>const</code> variable before its declaration throws a fatal <code>ReferenceError: Cannot access variable before initialization</code>. Unlike <code>var</code>, variables are hoisted into the TDZ without an initial value.'
        },
        {
          title: 'var Function Scoping & Bleed Trap',
          desc: 'Variables declared with <code>var</code> are function-scoped or globally-scoped, completely ignoring <code>if</code> blocks and <code>for</code> loops. This leaks variables outside loops and causes unintended mutations.'
        },
        {
          title: 'typeof null === "object" Historical Bug',
          desc: 'Due to a legacy type tag quirk from JavaScript\'s first version in 1995, <code>typeof null</code> returns <code>"object"</code>. Always check <code>val === null</code> explicitly.'
        },
        {
          title: 'const Object Mutation Misconception',
          desc: '<code>const</code> freezes the variable binding, NOT the underlying object. Writing <code>const user = {}; user.name = "Neo";</code> is completely legal. To make an object immutable, use <code>Object.freeze(user)</code>.'
        },
        {
          title: 'Silent Global Creation in Non-Strict Mode',
          desc: 'Assigning to an undeclared variable (<code>score = 100</code>) in sloppy mode automatically creates a property on the global <code>window</code> object. Always write <code>"use strict";</code> or use ES modules.'
        }
      ],
      faqs: [
        {
          q: 'What is the practical difference between let and const in modern JavaScript?',
          a: 'Use const by default for all variables that will not be reassigned. Use let only when a variable needs to be rebound to a new value (such as loop counters or state accumulators).'
        },
        {
          q: 'What are the 7 primitive data types in JavaScript?',
          a: 'The 7 primitives are string, number, bigint, boolean, undefined, symbol, and null. All other data structures (functions, arrays, objects) are reference objects.'
        },
        {
          q: 'How does variable hoisting work in JavaScript?',
          a: 'During the compilation phase, variable and function declarations are moved to the top of their containing scope. var declarations are initialized to undefined, while let and const enter the Temporal Dead Zone.'
        },
        {
          q: 'Why does Symbol exist in JavaScript?',
          a: 'Symbol creates unique, collision-proof identifiers often used as hidden object property keys that will not conflict with normal string keys.'
        },
        {
          q: 'What is the difference between null and undefined?',
          a: 'undefined indicates a variable has been declared but has not yet been assigned any value. null is an intentional assignment representing the explicit absence of any object value.'
        }
      ]
    },
    'strings': {
      copySnippet: `const name = "Ada Lovelace";
const score = 98.756;

// Template Literals with Expressions
const message = \`Player \${name.toUpperCase()} scored \${score.toFixed(1)}%\`;

// Modern String Methods
const slug = name.toLowerCase().trim().replaceAll(" ", "-");
const hasMatch = message.includes("PLAYER");
const padded = "42".padStart(5, "0"); // "00042"`,
      copyLabel: '📋 Copy JavaScript String Formatting & Methods Snippet',
      traps: [
        {
          title: 'String Immutability Assumption',
          desc: 'Strings in JavaScript are immutable primitives. Methods like <code>str.toUpperCase()</code> and <code>str.replace()</code> return a brand-new string without modifying the original. You must reassign the result.'
        },
        {
          title: 'str.replace() vs str.replaceAll() Single Match Trap',
          desc: 'Calling <code>"a-b-c".replace("-", ":")</code> replaces only the FIRST hyphen, producing <code>"a:b-c"</code>. Use <code>str.replaceAll("-", ":")</code> or a global regular expression <code>/-/g</code>.'
        },
        {
          title: 'Unicode Surrogate Pairs and Emoji Length',
          desc: 'JavaScript strings are UTF-16 code units. An emoji like <code>"👍".length</code> evaluates to <code>2</code>, and complex emojis can have a length of 7+. Use <code>[..."👍"].length</code> to count perceived characters accurately.'
        },
        {
          title: 'Template Literal Multi-Line Indentation Bleed',
          desc: 'Multi-line template literals preserve all leading indentation tabs and spaces as literal characters, which can break formatted text and terminal messages.'
        },
        {
          title: 'Lexicographic String Sorting Mismatch',
          desc: 'Comparing strings with <code>&gt;</code> or <code>&lt;</code> uses ASCII/UTF-16 code point values, meaning <code>"Z" &lt; "a"</code> evaluates to true. Use <code>strA.localeCompare(strB)</code> for natural language sorting.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between single quotes, double quotes, and backticks?',
          a: 'Single and double quotes are interchangeable for string literals. Backticks define template literals that support multi-line text, expression interpolation with ${expr}, and tagged template functions.'
        },
        {
          q: 'How do you check if a string contains a substring in modern JavaScript?',
          a: 'Use str.includes(substring), which returns true or false, replacing the legacy str.indexOf(substring) !== -1 idiom.'
        },
        {
          q: 'What does str.padStart() do?',
          a: 'padStart(targetLength, padString) pads the current string from the start with a given string until the resulting string reaches the target length (e.g. formatting numbers as 001).'
        },
        {
          q: 'How does str.trim() handle whitespace?',
          a: 'trim() removes spaces, tabs, and all newline characters from both ends of a string. trimStart() and trimEnd() trim individual ends.'
        },
        {
          q: 'Why should you avoid using eval() to parse stringified expressions?',
          a: 'eval() executes strings as arbitrary JavaScript with full access to the lexical scope, opening catastrophic Cross-Site Scripting (XSS) and code injection vulnerabilities.'
        }
      ]
    },
    'numbers': {
      copySnippet: `// Safe Integer Limits & Arbitrary Precision
const maxSafe = Number.MAX_SAFE_INTEGER; // 9,007,199,254,740,991
const largeId = 9007199254740995n;      // BigInt for 64-bit database IDs

// Currency / Decimal Precision Workaround
const toCents = (dollars) => Math.round(dollars * 100);
const total = (toCents(0.1) + toCents(0.2)) / 100; // 0.30 exact

// Safe Parsing
const parsed = Number.parseInt("42px", 10); // 42
const isValid = Number.isFinite(parsed) && !Number.isNaN(parsed);`,
      copyLabel: '📋 Copy JavaScript Numbers & Precision Workarounds Snippet',
      traps: [
        {
          title: '0.1 + 0.2 !== 0.3 IEEE 754 Floating Point Trap',
          desc: 'JavaScript numbers are 64-bit double-precision floats. Base-10 decimals like 0.1 have repeating binary fractions, resulting in <code>0.30000000000000004</code>. For financial calculations, store integer cents.'
        },
        {
          title: 'NaN !== NaN Self-Equality Trap',
          desc: '<code>NaN</code> is the only value in JavaScript that is not equal to itself: <code>NaN === NaN</code> evaluates to <code>false</code>. Always check with <code>Number.isNaN(val)</code>.'
        },
        {
          title: 'BigInt and Number Mixing TypeError',
          desc: 'You cannot perform arithmetic between BigInt and Number: <code>10n + 5</code> throws <code>TypeError: Cannot mix BigInt and other types</code>. Explicitly cast types before operations.'
        },
        {
          title: 'parseInt() Without Radix 10',
          desc: 'Omitting the radix (<code>parseInt("08")</code>) in older engines parsed strings with leading zeros as octal numbers. Always supply the radix: <code>parseInt("42", 10)</code>.'
        },
        {
          title: 'Integer Overflow Past Number.MAX_SAFE_INTEGER',
          desc: 'Integers greater than 9,007,199,254,740,991 (2^53 - 1) lose precision, causing database IDs (like Twitter Snowflake IDs) to corrupt. Always parse large numeric IDs as strings or BigInt.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between isNaN() and Number.isNaN()?',
          a: 'The global isNaN(x) coerces x to a number first, making isNaN("hello") true. Number.isNaN(x) does not coerce, returning true only if x is literally NaN.'
        },
        {
          q: 'What is BigInt and when should it be used?',
          a: 'BigInt is an arbitrary-precision integer type used for cryptography, 64-bit timestamps, and massive integer calculations beyond Number.MAX_SAFE_INTEGER.'
        },
        {
          q: 'How does Math.floor() differ from Math.trunc()?',
          a: 'Math.floor() rounds downward toward negative infinity (Math.floor(-1.5) is -2). Math.trunc() truncates fractional digits toward zero (Math.trunc(-1.5) is -1).'
        },
        {
          q: 'How do you format numbers as currency in JavaScript?',
          a: 'Use the modern Intl.NumberFormat API: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(19.99).'
        },
        {
          q: 'What does the unary + operator do to strings?',
          a: 'The unary + operator coerces strings to numbers: +"42" becomes 42, and +"invalid" becomes NaN. It is a compact alternative to Number().'
        }
      ]
    },
    'booleans': {
      copySnippet: `// Truthiness & Falsy Values
// Falsy: false, 0, -0, 0n, "", null, undefined, NaN

// Nullish Coalescing Operator (??) vs Logical OR (||)
const count = 0;
const safeCount = count ?? 10;   // 0 (preserves 0 and "")
const wrongCount = count || 10;  // 10 (treats 0 as falsy!)

// Explicit Boolean Conversion
const isReady = Boolean(userToken);
const hasItems = !!items.length;`,
      copyLabel: '📋 Copy JavaScript Booleans & Coalescing Cheat Sheet',
      traps: [
        {
          title: 'Logical OR (||) Overwriting Legitimate Falsy Values',
          desc: 'Using <code>val || fallback</code> treats <code>0</code>, <code>false</code>, and <code>""</code> as missing values and replaces them with the fallback. Use the nullish coalescing operator <code>val ?? fallback</code> instead.'
        },
        {
          title: 'Empty Arrays and Objects Evaluating to Truthy',
          desc: 'In JavaScript, <code>Boolean([])</code> and <code>Boolean({})</code> are both <code>true</code>! Checking <code>if (items)</code> does not test whether an array has elements; check <code>items.length &gt; 0</code>.'
        },
        {
          title: 'Loose Equality (==) Type Coercion Hazards',
          desc: 'The loose equality operator performs bizarre type coercions: <code>"" == 0</code> is true, <code>0 == "0"</code> is true, but <code>"" == "0"</code> is false! Always enforce strict equality <code>===</code>.'
        },
        {
          title: 'new Boolean(false) Object Wrapper Trap',
          desc: 'Invoking <code>new Boolean(false)</code> creates an object wrapper. Because all objects are truthy, <code>if (new Boolean(false))</code> executes the branch! Use <code>Boolean(val)</code> without <code>new</code>.'
        },
        {
          title: 'Short-Circuiting in React/JSX Rendering 0',
          desc: 'Writing <code>count && &lt;Badge /&gt;</code> in JSX renders <code>0</code> directly onto the webpage when count is 0. Use <code>count &gt; 0 && &lt;Badge /&gt;</code> or a ternary.'
        }
      ],
      faqs: [
        {
          q: 'What is the double exclamation mark (!!) idiom?',
          a: '!! is a shorthand that casts any value to its boolean primitive equivalent (equivalent to Boolean(val)). The first ! negates and coerces, and the second ! restores correct polarity.'
        },
        {
          q: 'What values are strictly falsy in JavaScript?',
          a: 'There are exactly 8 falsy values: false, 0, -0, 0n (BigInt zero), "" (empty string), null, undefined, and NaN.'
        },
        {
          q: 'How does the nullish coalescing operator (??) work?',
          a: 'a ?? b evaluates and returns a unless a is strictly null or undefined, in which case it returns b, safely preserving 0 and false.'
        },
        {
          q: 'What is short-circuit evaluation?',
          a: 'In logical operations, if the outcome is guaranteed by the first operand, subsequent operands are not evaluated (e.g. false && expensiveFunc() skips the function).'
        },
        {
          q: 'Why should strict equality (===) be used everywhere?',
          a: 'Strict equality verifies both value and type without performing implicit type coercion, preventing unpredictable runtime bugs and logic failures.'
        }
      ]
    },
    'conditionals': {
      copySnippet: `const status = "success";

// Switch Statement with Block Scoping
switch (status) {
  case "loading": {
    const spinner = true;
    break;
  }
  case "success": {
    const data = fetchCached();
    break;
  }
  default:
    throw new Error(\`Unhandled status: \${status}\`);
}

// Optional Chaining with Nullish Coalescing
const street = user?.address?.street ?? "Unknown Street";`,
      copyLabel: '📋 Copy JavaScript Conditionals & Switch Template',
      traps: [
        {
          title: 'Switch Statement Fallthrough Bug',
          desc: 'Omitting a <code>break</code> statement causes execution to fall through into subsequent case statements regardless of whether their condition matched.'
        },
        {
          title: 'Lexical Scope Clashes Inside Switch Cases',
          desc: 'Variables declared with <code>let</code> or <code>const</code> inside a switch statement share a single block scope unless wrapped in curly braces <code>case "x": { const a = 1; break; }</code>.'
        },
        {
          title: 'Optional Chaining on Non-Function Properties',
          desc: 'Calling <code>obj?.method()</code> prevents errors if <code>obj</code> is null/undefined, but if <code>method</code> exists and is NOT a function, it still throws a <code>TypeError: obj.method is not a function</code>.'
        },
        {
          title: 'Unintended Assignment in If Statement',
          desc: 'Typing <code>if (status = "admin")</code> assigns the string instead of comparing it, mutating the variable and always evaluating to truthy.'
        },
        {
          title: 'Deep Nested Ternary Readability Nightmare',
          desc: 'Chaining multiple ternaries (<code>a ? b : c ? d : e ? f : g</code>) obscures business logic. Flatten code using early returns or object strategy dictionaries.'
        }
      ],
      faqs: [
        {
          q: 'What does the optional chaining operator (?.) do in JavaScript?',
          a: '?. permits reading properties or calling methods deep within an object chain without having to validate that each reference in the chain is non-null.'
        },
        {
          q: 'When should you use an object lookup map instead of switch/case?',
          a: 'Object lookup maps (e.g. const actions = { add: fn1, delete: fn2 }; actions[cmd]?.()) are cleaner, support dynamic additions, and execute in O(1) time.'
        },
        {
          q: 'How does JavaScript handle switch comparisons?',
          a: 'Switch statements use strict equality (===) comparison without type coercion.'
        },
        {
          q: 'What is the guard clause pattern?',
          a: 'A guard clause is a conditional check at the start of a function that handles error states and returns early, avoiding deeply nested if/else blocks.'
        },
        {
          q: 'Can you use destructuring inside an if statement condition?',
          a: 'No, but you can destructure before the condition or use the logical assignment operators (&&=, ||=, ??=).'
        }
      ]
    },
    'for-loops': {
      copySnippet: `const items = ["alpha", "beta", "gamma"];

// for...of (Values in Iterables: Arrays, Sets, Maps)
for (const [index, val] of items.entries()) {
  console.log(\`\${index}: \${val}\`);
}

// for...in (Keys in Objects ONLY)
const config = { host: "localhost", port: 8080 };
for (const key in config) {
  if (Object.hasOwn(config, key)) {
    console.log(\`\${key} = \${config[key]}\`);
  }
}`,
      copyLabel: '📋 Copy JavaScript For-Loops & Iteration Cheat Sheet',
      traps: [
        {
          title: 'Using for...in on Arrays',
          desc: '<code>for...in</code> iterates over all enumerable property keys, including prototype methods and string indices in arbitrary order. Always use <code>for...of</code> or array methods for arrays.'
        },
        {
          title: 'Asynchronous Code Inside Array.prototype.forEach',
          desc: '<code>forEach</code> does NOT await promises! Passing an <code>async</code> callback runs promises concurrently and exits immediately before completion. Use <code>for (const x of items) await ...</code>.'
        },
        {
          title: 'Closure Variable Leaks with var in Loops',
          desc: 'Declaring <code>for (var i = 0; ...)</code> shares a single variable across all loop iterations, so asynchronous callbacks (like setTimeout) all log the final value. Use <code>let</code> to create per-iteration bindings.'
        },
        {
          title: 'Modifying Array Length During Iteration',
          desc: 'Calling <code>splice()</code> or <code>push()</code> inside an index-based for loop alters the array length and shifts elements, causing items to be skipped.'
        },
        {
          title: 'Infinite Loop from Stagnant Counter Increment',
          desc: 'Typing <code>i--</code> instead of <code>i++</code> locks the main browser thread in an infinite loop, crashing the tab.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between for...of and for...in in JavaScript?',
          a: 'for...of iterates over values of iterable objects (Array, Map, Set, string). for...in iterates over enumerable keys/properties of an object.'
        },
        {
          q: 'How do you get both index and value in a for...of loop?',
          a: 'Call the .entries() method on the array: for (const [index, value] of array.entries()) { ... }.'
        },
        {
          q: 'Can you break out of an Array.prototype.forEach loop?',
          a: 'No. forEach executes for every element and cannot be terminated early with break or return. Use for...of or Array.prototype.some() instead.'
        },
        {
          q: 'What makes an object iterable in JavaScript?',
          a: 'An object must implement the Iterable protocol by providing a method at [Symbol.iterator] that returns an iterator object with a .next() method.'
        },
        {
          q: 'How can you iterate over an object using for...of?',
          a: 'Use Object.entries(obj), Object.keys(obj), or Object.values(obj) to convert the object into an iterable array.'
        }
      ]
    },
    'while-loops': {
      copySnippet: `// Safe While Loop with Timeout Guard
let attempts = 0;
const MAX_ATTEMPTS = 5;
let isConnected = false;

while (!isConnected && attempts < MAX_ATTEMPTS) {
  attempts++;
  // Simulated connection retry logic
  if (attempts === 3) {
    isConnected = true;
    break;
  }
}
console.log(\`Connected: \${isConnected} on attempt \${attempts}\`);`,
      copyLabel: '📋 Copy JavaScript While Loop with Timeout Guard Snippet',
      traps: [
        {
          title: 'Infinite Loop Freezing Main Thread',
          desc: 'Because JavaScript is single-threaded, an infinite while loop completely locks the event loop, freezing DOM rendering, clicks, and animations until the browser crashes the tab.'
        },
        {
          title: 'do...while Executing At Least Once',
          desc: 'A <code>do...while</code> loop executes its body block before evaluating the condition, which can cause unexpected mutations even when the condition is initially false.'
        },
        {
          title: 'continue Skipping the Counter Increment',
          desc: 'Placing a <code>continue</code> statement before <code>counter++</code> immediately skips to the next iteration without incrementing, creating an inescapable loop.'
        },
        {
          title: 'Blocking Event Loop During Asynchronous Polling',
          desc: 'Running a busy while loop waiting for external state blocks asynchronous I/O callbacks from ever running. Always introduce a delay with <code>await new Promise(r =&gt; setTimeout(r, ms))</code>.'
        },
        {
          title: 'Floating Point Increment Termination Failure',
          desc: 'Writing <code>while (x !== 1.0) x += 0.1</code> will never terminate due to binary floating-point rounding errors.'
        }
      ],
      faqs: [
        {
          q: 'When should you choose a while loop over a for loop in JavaScript?',
          a: 'Use while loops when the number of iterations cannot be known in advance and depends on dynamic conditions (such as polling network sockets or reading data buffers).'
        },
        {
          q: 'How do you prevent while loops from locking the browser tab?',
          a: 'Add a maximum iteration counter guard or yield execution back to the browser event loop using requestAnimationFrame() or setTimeout().'
        },
        {
          q: 'What is the difference between break and continue?',
          a: 'break exits the loop immediately. continue skips the remainder of the current iteration and advances to the next cycle.'
        },
        {
          q: 'Can you use labeled statements with while loops in JavaScript?',
          a: 'Yes. You can label an outer loop (outerLoop: while (...)) and call break outerLoop; from an inner nested loop to break multiple levels.'
        },
        {
          q: 'Does while (true) cause memory leaks in Node.js?',
          a: 'A synchronous while (true) loop pegs the CPU at 100% and prevents the Garbage Collector and event loop from running, causing process degradation.'
        }
      ]
    },
    'functions': {
      copySnippet: `// Standard Function vs Arrow Function
// Regular Function: has own 'this', 'arguments', hoisted
function calculateTotal(taxRate, ...items) {
  return items.reduce((sum, item) => sum + item * (1 + taxRate), 0);
}

// Arrow Function: inherits lexical 'this', cannot be constructor
const multiply = (a, b = 1) => a * b;`,
      copyLabel: '📋 Copy JavaScript Function Styles & Rest Parameters Snippet',
      traps: [
        {
          title: 'Lexical this in Arrow Functions Used as Methods',
          desc: 'Arrow functions do NOT bind their own <code>this</code>; they inherit <code>this</code> from the enclosing lexical scope. Defining an object method with an arrow function leaves <code>this</code> bound to <code>window</code> or <code>undefined</code>.'
        },
        {
          title: 'Invoking Arrow Functions with new Keyword',
          desc: 'Arrow functions lack a <code>[[Construct]]</code> internal method and prototype property. Calling <code>new MyArrow()</code> throws an immediate <code>TypeError: ... is not a constructor</code>.'
        },
        {
          title: 'Function Declaration vs Expression Hoisting Mismatch',
          desc: 'Function declarations (<code>function f() {}</code>) are fully hoisted with their body. Function expressions (<code>const f = () =&gt; {}</code>) are hoisted as uninitialized variables in the TDZ.'
        },
        {
          title: 'Arguments Object Lacks Array Prototype Methods',
          desc: 'The legacy <code>arguments</code> object is array-like but is not an Array; calling <code>arguments.map()</code> throws a TypeError. Always use rest parameters: <code>(...args) =&gt; {}</code>.'
        },
        {
          title: 'Default Parameters Evaluated at Call-Time',
          desc: 'Default parameters evaluate dynamically on each invocation. <code>function get(id = randomId())</code> calls the function every time the argument is omitted.'
        }
      ],
      faqs: [
        {
          q: 'What is the primary difference between arrow functions and regular functions?',
          a: 'Arrow functions have lexical this (they do not bind their own this, arguments, super, or new.target) and cannot be used as constructors.'
        },
        {
          q: 'What is a closure in JavaScript?',
          a: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment, allowing inner functions to access outer variables even after the outer function has closed.'
        },
        {
          q: 'What do rest parameters (...args) do?',
          a: 'Rest parameters capture indefinite remaining arguments into a genuine JavaScript Array, enabling full array method access (map, filter, reduce).'
        },
        {
          q: 'What is the difference between call(), apply(), and bind()?',
          a: 'call(thisArg, ...args) invokes immediately with comma-separated arguments. apply(thisArg, [args]) invokes immediately with an array of arguments. bind(thisArg) returns a new function with bound this.'
        },
        {
          q: 'Can a function return multiple values in JavaScript?',
          a: 'Not directly, but functions can return an array or object containing multiple values, which callers unpack using destructuring.'
        }
      ]
    },
    'arrays': {
      copySnippet: `const numbers = [10, 5, 25, 40, 1];

// Immutable Modern Array Methods (ES2023+)
const sorted = numbers.toSorted((a, b) => a - b);
const reversed = numbers.toReversed();
const replaced = numbers.with(0, 99);

// Deduplication
const unique = [...new Set(numbers)];`,
      copyLabel: '📋 Copy Modern JavaScript Array Methods Snippet',
      traps: [
        {
          title: 'Array.prototype.sort() Converts to Strings by Default',
          desc: 'Calling <code>[10, 5, 25, 1].sort()</code> produces <code>[1, 10, 25, 5]</code> because JavaScript converts numbers to strings and sorts lexicographically. Always pass a comparator: <code>(a, b) =&gt; a - b</code>.'
        },
        {
          title: 'Mutating Methods (push, splice, reverse) Altering State',
          desc: 'Legacy methods like <code>sort()</code>, <code>reverse()</code>, and <code>splice()</code> mutate the original array in-place, causing bugs in state-driven UI libraries. Use ES2023 immutable methods: <code>toSorted()</code>, <code>toReversed()</code>, <code>toSpliced()</code>.'
        },
        {
          title: 'Sparse Arrays Created by new Array(length)',
          desc: 'Writing <code>new Array(5)</code> creates empty slots, NOT undefined values. Iterative methods like <code>map()</code>, <code>forEach()</code>, and <code>filter()</code> completely skip empty slots! Use <code>Array.from({ length: 5 })</code>.'
        },
        {
          title: 'delete arr[index] Leaves Empty Holes',
          desc: 'Calling <code>delete arr[1]</code> deletes the value but leaves an empty slot without updating <code>arr.length</code>. Use <code>splice()</code> or <code>toSpliced()</code>.'
        },
        {
          title: 'Shallow Array Cloning with Nested Objects',
          desc: '<code>[...arr]</code> and <code>arr.slice()</code> copy object references. Modifying an object inside the cloned array mutates the object in the original array. Use <code>structuredClone()</code> for deep copying.'
        }
      ],
      faqs: [
        {
          q: 'What are the ES2023 non-mutating array methods?',
          a: 'ES2023 introduced toSorted(), toReversed(), toSpliced(), and with(), which perform sorting, reversing, splicing, and item replacement while returning a new array without mutating the original.'
        },
        {
          q: 'How do you check if a variable is an array in JavaScript?',
          a: 'Use Array.isArray(val). Never use typeof, which returns "object".'
        },
        {
          q: 'What is the fastest way to empty an array in JavaScript?',
          a: 'Setting array.length = 0 empties the array in-place and clears all elements for all references to that array.'
        },
        {
          q: 'What does the Array.prototype.flat() method do?',
          a: 'flat(depth) creates a new array with all sub-array elements concatenated recursively up to the specified depth (defaults to 1).'
        },
        {
          q: 'How does Array.from() create arrays from iterables or array-like objects?',
          a: 'Array.from(iterable, mapFn) converts array-like objects (such as NodeList or arguments) and iterables into genuine arrays, with an optional mapping transform.'
        }
      ]
    },
    'objects': {
      copySnippet: `const user = {
  id: 42,
  name: "Neo",
  skills: ["JavaScript", "TypeScript"]
};

// Modern Object Inspection & Cloning
const keys = Object.keys(user);
const entries = Object.entries(user);
const updated = { ...user, role: "admin" };
const deepCloned = structuredClone(user); // Native deep clone`,
      copyLabel: '📋 Copy JavaScript Object Inspection & Cloning Snippet',
      traps: [
        {
          title: 'JSON.parse(JSON.stringify(obj)) Data Loss',
          desc: 'The old JSON hack for deep cloning drops functions, Symbols, and undefined properties, and converts Dates to strings and Maps/Sets to empty objects. Use the native <code>structuredClone()</code> API.'
        },
        {
          title: 'Object.freeze() Is Strictly Shallow',
          desc: '<code>Object.freeze(obj)</code> only freezes top-level properties; nested objects and arrays remain completely mutable. Implement a deep freeze utility for recursive immutability.'
        },
        {
          title: 'Prototype Property Bleed in for...in Loops',
          desc: '<code>for...in</code> iterates over inherited prototype properties. Always filter with <code>Object.hasOwn(obj, key)</code> to verify the property belongs to the instance itself.'
        },
        {
          title: 'Prototype Pollution Vulnerability',
          desc: 'Merging unvalidated user input into nested objects without filtering <code>__proto__</code> or <code>constructor</code> can overwrite Object.prototype, exposing severe security vulnerabilities.'
        },
        {
          title: 'Object Keys Are Always Coerced to Strings or Symbols',
          desc: 'Using an object as a key (<code>obj[{}] = 1</code>) converts the key to <code>"[object Object]"</code>. If you need arbitrary object references as keys, use a <code>Map</code>.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between an Object and a Map in JavaScript?',
          a: 'Objects only support string and symbol keys and inherit prototype properties. Maps support keys of any data type (including objects and functions), guarantee insertion order, and offer optimal performance for frequent additions/removals.'
        },
        {
          q: 'Why should you use Object.hasOwn() instead of obj.hasOwnProperty()?',
          a: 'Object.hasOwn(obj, key) is safer because it works even on objects created with Object.create(null) and cannot be shadowed or overwritten by a malicious hasOwnProperty property.'
        },
        {
          q: 'What does structuredClone() support that JSON cloning does not?',
          a: 'structuredClone() supports circular references, Dates, RegExp, Maps, Sets, ArrayBuffers, and Blobs natively.'
        },
        {
          q: 'How does the spread operator handle duplicate keys in object merging?',
          a: 'In { ...objA, ...objB }, if both objects share a key, the rightmost value (objB) overwrites the earlier value.'
        },
        {
          q: 'How do you prevent new properties from being added to an object without freezing existing ones?',
          a: 'Use Object.preventExtensions(obj) to prevent additions while allowing existing properties to be modified or deleted.'
        }
      ]
    },
    'dom': {
      copySnippet: `// High-Performance DOM Querying & Mutation
const container = document.querySelector("#app");

// Document Fragment for Batch Insertion (Zero Reflows)
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const el = document.createElement("div");
  el.className = "card";
  el.textContent = \`Card #\${i}\`;
  fragment.appendChild(el);
}
container.appendChild(fragment);`,
      copyLabel: '📋 Copy DOM Manipulation & DocumentFragment Snippet',
      traps: [
        {
          title: 'Layout Thrashing from Interleaved Reads and Writes',
          desc: 'Reading layout properties (like <code>offsetHeight</code>, <code>clientWidth</code>) immediately after modifying styles forces the browser engine to perform synchronous layout reflows on every loop cycle.'
        },
        {
          title: 'Cross-Site Scripting (XSS) via innerHTML',
          desc: 'Injecting unescaped user input into <code>innerHTML</code> allows attackers to execute arbitrary malicious scripts. Always use <code>textContent</code> for raw text.'
        },
        {
          title: 'Querying Elements Before DOM is Ready',
          desc: 'Running <code>document.querySelector()</code> before the HTML parser finishes returns <code>null</code>. Place scripts before <code>&lt;/body&gt;</code> or listen for <code>DOMContentLoaded</code>.'
        },
        {
          title: 'Memory Leaks from Detached DOM Nodes',
          desc: 'Removing an element from the DOM with <code>el.remove()</code> does not free its memory if JavaScript variables or event listeners still hold references to it.'
        },
        {
          title: 'NodeList vs. Array Confusion',
          desc: '<code>querySelectorAll()</code> returns a static NodeList, not an Array. While it supports <code>forEach</code>, it lacks <code>map</code> and <code>filter</code> in older browsers unless converted with <code>Array.from()</code>.'
        }
      ],
      faqs: [
        {
          q: 'Why is DocumentFragment faster for batch DOM updates?',
          a: 'A DocumentFragment exists in memory off the active DOM tree. Appending child elements to it triggers zero browser reflows; inserting the fragment into the live DOM performs a single repaint.'
        },
        {
          q: 'What is the difference between innerHTML, innerText, and textContent?',
          a: 'innerHTML parses and renders HTML tags; innerText considers CSS styling and triggers reflows; textContent retrieves or sets raw text without parsing HTML or triggering expensive reflows.'
        },
        {
          q: 'How does element.closest() work in DOM traversal?',
          a: 'closest(selector) traverses the element and its parents upward toward the document root, returning the first ancestor that matches the CSS selector.'
        },
        {
          q: 'What is the difference between querySelector and getElementById?',
          a: 'getElementById is specialized and slightly faster for ID lookups. querySelector is a universal selector supporting complex CSS rules, classes, attributes, and pseudo-selectors.'
        },
        {
          q: 'How do you safely toggle CSS classes on elements?',
          a: 'Use the classList API: el.classList.add(), el.classList.remove(), and el.classList.toggle("active", booleanCondition).'
        }
      ]
    },
    'events': {
      copySnippet: `// Event Delegation Pattern (Single Listener for Container)
const list = document.querySelector("#todo-list");

list.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn-delete");
  if (!btn) return;
  const itemId = btn.dataset.id;
  deleteItem(itemId);
});`,
      copyLabel: '📋 Copy JavaScript Event Delegation Pattern Snippet',
      traps: [
        {
          title: 'Attaching Individual Listeners to Hundreds of Elements',
          desc: 'Attaching individual event listeners to every row in a table of 1,000 items creates 1,000 handler functions in memory. Use Event Delegation on the parent container.'
        },
        {
          title: 'Failing to Remove Event Listeners (Memory Leaks)',
          desc: 'Passing an anonymous arrow function to <code>addEventListener</code> means you can never call <code>removeEventListener</code> because the function reference is lost.'
        },
        {
          title: 'Confusing event.target with event.currentTarget',
          desc: '<code>event.target</code> is the exact child element clicked. <code>event.currentTarget</code> is the parent element to which the event listener is currently attached.'
        },
        {
          title: 'Calling stopPropagation() Blindly',
          desc: '<code>event.stopPropagation()</code> breaks analytics tracking, modal backdrop dismissals, and parent delegators that rely on event bubbling up the DOM tree.'
        },
        {
          title: 'Janky Scrolling from Non-Passive Listeners',
          desc: 'Touch and wheel listeners block browser compositor thread scrolling while waiting for JavaScript to complete. Always pass <code>{ passive: true }</code> on scroll listeners.'
        }
      ],
      faqs: [
        {
          q: 'What are the three phases of DOM event propagation?',
          a: '1) Capturing phase (event travels down from window to target), 2) Target phase (event reaches target element), and 3) Bubbling phase (event bubbles back up the tree).'
        },
        {
          q: 'How does Event Delegation work and why is it important?',
          a: 'Event delegation binds a single listener to a parent container and inspects event.target using element.closest() to identify clicked children, saving memory and handling dynamically added elements automatically.'
        },
        {
          q: 'What does event.preventDefault() do?',
          a: 'It prevents the browser\'s default native action for the event (e.g. stopping form submission from reloading the page or link navigation).'
        },
        {
          q: 'How do you create and dispatch a custom event in JavaScript?',
          a: 'Create with const evt = new CustomEvent("userLogin", { detail: { userId: 42 }, bubbles: true }); and dispatch with element.dispatchEvent(evt);.'
        },
        {
          q: 'What is the once option in addEventListener?',
          a: 'Passing { once: true } automatically removes the event listener after it is invoked the first time, preventing duplicate executions.'
        }
      ]
    },
    'fetch': {
      copySnippet: `// Robust Fetch with Timeout & AbortController
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(\`HTTP Error \${res.status}: \${res.statusText}\`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}`,
      copyLabel: '📋 Copy Robust Fetch with AbortController Snippet',
      traps: [
        {
          title: 'Fetch Does Not Reject on HTTP 404 or 500',
          desc: '<code>fetch()</code> only rejects on actual network connection failures. HTTP errors (like 404 Not Found or 500 Internal Server Error) resolve normally! Always verify <code>if (!response.ok)</code>.'
        },
        {
          title: 'Missing AbortController Causing Zombie Requests',
          desc: 'Without an <code>AbortController</code>, a stalled or slow HTTP request hangs indefinitely in the browser background, wasting bandwidth and memory.'
        },
        {
          title: 'Reading the Response Body Twice',
          desc: 'A Fetch response body is a readable stream that can only be consumed once. Calling <code>res.json()</code> then <code>res.text()</code> throws <code>TypeError: body stream already read</code>.'
        },
        {
          title: 'Forgetting Content-Type on POST Payloads',
          desc: 'Sending a JSON string via <code>body: JSON.stringify(data)</code> without setting <code>"Content-Type": "application/json"</code> causes backend servers to fail parsing the payload.'
        },
        {
          title: 'CORS Failures Misinterpreted as Network Down',
          desc: 'When CORS preflight fails or headers are missing, browsers report generic <code>TypeError: Failed to fetch</code> to prevent leaking security details.'
        }
      ],
      faqs: [
        {
          q: 'How does AbortController cancel an active fetch request?',
          a: 'AbortController provides an abort() method and a signal property. Passing signal to fetch() allows calling controller.abort() to cancel network transfer immediately.'
        },
        {
          q: 'What does response.ok indicate in the Fetch API?',
          a: 'response.ok is a boolean property that is true if the HTTP response status code is within the 200–299 success range.'
        },
        {
          q: 'How do you send authentication headers with fetch?',
          a: 'Pass them in the headers object: headers: { "Authorization": `Bearer ${token}` }.'
        },
        {
          q: 'What is the difference between fetch() and XMLHttpRequest?',
          a: 'fetch() is modern, Promise-based, supports streaming responses, and integrates with service workers, whereas XMLHttpRequest relies on event callbacks.'
        },
        {
          q: 'How do you handle binary file downloads with fetch?',
          a: 'Call await response.blob() or await response.arrayBuffer() instead of response.json().'
        }
      ]
    },
    'async-await': {
      copySnippet: `// Parallel Async Execution with Promise.allSettled
async function loadDashboard() {
  const [userData, statsData] = await Promise.all([
    fetchUser(),
    fetchStats()
  ]);
  return { userData, statsData };
}`,
      copyLabel: '📋 Copy Async/Await & Parallel Promises Template',
      traps: [
        {
          title: 'Sequential Await Waterfall Trap',
          desc: 'Writing <code>const a = await getA(); const b = await getB();</code> runs independent requests sequentially. Use <code>Promise.all([getA(), getB()])</code> to execute in parallel.'
        },
        {
          title: 'Unhandled Promise Rejection',
          desc: 'Calling an async function without <code>await</code> or a <code>.catch()</code> handler allows rejected promises to fail silently, logging unhandled rejection warnings.'
        },
        {
          title: 'Promise.all Fast-Failure Trap',
          desc: 'If ANY single promise in <code>Promise.all()</code> rejects, the entire batch rejects immediately, discarding successful results. Use <code>Promise.allSettled()</code> to inspect all outcomes.'
        },
        {
          title: 'Redundant Promise Construction Anti-Pattern',
          desc: 'Wrapping an existing promise in <code>new Promise(resolve =&gt; { p.then(resolve); })</code> adds unnecessary wrapper overhead and breaks error chaining.'
        },
        {
          title: 'Forgetting await in Return Statements with try/catch',
          desc: 'Writing <code>try { return asyncFunc(); } catch (e) {}</code> returns the pending promise immediately, bypassing the catch block if it rejects! Use <code>return await asyncFunc();</code>.'
        }
      ],
      faqs: [
        {
          q: 'What does async/await actually do under the hood?',
          a: 'async/await is syntactic sugar built on top of native Promises and Generators. An async function always returns a Promise, and await pauses execution of the function until the Promise settles.'
        },
        {
          q: 'What is the difference between Promise.all and Promise.allSettled?',
          a: 'Promise.all rejects immediately if any promise fails. Promise.allSettled waits for all promises to finish and returns an array of status objects ({ status: "fulfilled", value } or { status: "rejected", reason }).'
        },
        {
          q: 'What is Promise.race() used for?',
          a: 'Promise.race() returns a promise that settles as soon as the FIRST promise in an iterable settles (either fulfilled or rejected), useful for request timeouts.'
        },
        {
          q: 'What happens if you return a non-promise value from an async function?',
          a: 'The returned value is automatically wrapped in Promise.resolve(value).'
        },
        {
          q: 'How does the JavaScript event loop handle Promise microtasks?',
          a: 'Promise callbacks execute in the microtask queue, which runs immediately after the current synchronous script completes, before any macrotasks (setTimeout, UI rendering).'
        }
      ]
    },
    'localstorage': {
      copySnippet: `// Safe localStorage Wrapper with Quota Guard
const Storage = {
  get(key, fallback = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("Storage quota exceeded", e);
      return false;
    }
  }
};`,
      copyLabel: '📋 Copy Safe LocalStorage Wrapper & Quota Guard Snippet',
      traps: [
        {
          title: 'Storing Sensitive Tokens in localStorage (XSS Vulnerability)',
          desc: 'Any third-party script or XSS vulnerability on your origin can read <code>localStorage</code>. Never store authentication tokens or credentials in localStorage; use HTTP-only, secure cookies.'
        },
        {
          title: 'QuotaExceededError Crash (~5MB Limit)',
          desc: 'Attempting to store more than ~5MB throws an uncaught <code>QuotaExceededError</code> that crashes scripts. Always wrap <code>localStorage.setItem()</code> in a <code>try...catch</code>.'
        },
        {
          title: 'Synchronous Main Thread Blocking I/O',
          desc: 'localStorage reads and writes synchronously from disk on the main browser thread. Storing massive multi-megabyte strings causes noticeable frame drops and UI stutter.'
        },
        {
          title: 'Missing Keys Returning null vs undefined',
          desc: '<code>localStorage.getItem("missing")</code> returns <code>null</code>, not <code>undefined</code>. Default parameters (<code>const val = localStorage.getItem(...) || default</code>) should account for null.'
        },
        {
          title: 'Private Browsing and Cookie-Blocked Exceptions',
          desc: 'In Safari private browsing or when third-party cookies are blocked, merely accessing <code>window.localStorage</code> can throw a SecurityError.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between localStorage and sessionStorage?',
          a: 'localStorage persists across browser sessions and tabs until explicitly cleared. sessionStorage is isolated to a single tab and cleared when the tab is closed.'
        },
        {
          q: 'What data types can be stored in localStorage?',
          a: 'localStorage only stores strings. Non-string types (objects, arrays, booleans) must be serialized using JSON.stringify() and parsed with JSON.parse().'
        },
        {
          q: 'How can tabs synchronize state using the storage event?',
          a: 'Listening to window.addEventListener("storage", e => { ... }) fires on sibling tabs of the same origin whenever localStorage is modified.'
        },
        {
          q: 'What is the recommended alternative for storing large client-side data?',
          a: 'Use IndexedDB, an asynchronous, transactional, high-capacity client-side database supported by all modern browsers.'
        },
        {
          q: 'How do you completely clear all data for an origin?',
          a: 'Call localStorage.clear().'
        }
      ]
    },
    'template-literals': {
      copySnippet: `// Tagged Template Literals (Sanitization & HTML)
function sanitizeHtml(strings, ...values) {
  return strings.reduce((acc, str, i) => {
    const val = values[i - 1];
    const safe = String(val ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return acc + safe + str;
  });
}

const userComment = "<script>console.log('blocked')</script>";
const safeOutput = sanitizeHtml\`<div>\${userComment}</div>\`;`,
      copyLabel: '📋 Copy Tagged Template Sanitizer Pattern Snippet',
      traps: [
        {
          title: 'XSS Injection from Unescaped HTML Interpolation',
          desc: 'Interpolating untrusted user input directly into HTML strings via template literals opens severe Cross-Site Scripting (XSS) holes. Use a tagged sanitizer function.'
        },
        {
          title: 'Unintended Whitespace in Multi-Line Templates',
          desc: 'Indentation tabs and line breaks are captured literally. Pre-formatting code or SQL queries with template literals can include dozens of unwanted leading spaces.'
        },
        {
          title: 'Objects Coerced to [object Object]',
          desc: 'Interpolating an object (<code>`User: ${user}`</code>) calls <code>user.toString()</code>, outputting <code>User: [object Object]</code>. Use <code>JSON.stringify(user)</code>.'
        },
        {
          title: 'Tagged Template Parameter Count Mismatch',
          desc: 'In tagged templates, the strings array always has exactly one more element than the values array: <code>strings.length === values.length + 1</code>.'
        },
        {
          title: 'String.raw vs Standard String Escapes',
          desc: 'Standard template literals parse escape sequences (<code>\\n</code> becomes a newline). Use <code>String.raw\`C:\\path\\new\`</code> to keep escape characters intact.'
        }
      ],
      faqs: [
        {
          q: 'What is a tagged template literal in JavaScript?',
          a: 'A tagged template is a function call where template literals are parsed and passed as arguments (strings array and interpolated values), enabling custom parsing like GraphQL queries or CSS-in-JS.'
        },
        {
          q: 'What does String.raw do?',
          a: 'String.raw is a built-in tag function that returns raw string contents without interpreting backslash escape sequences (e.g. \\n remains literal \\n).'
        },
        {
          q: 'Can expressions inside ${} call functions and perform math?',
          a: 'Yes, any valid JavaScript expression (arithmetic, function calls, ternaries) can be evaluated inside ${}.'
        },
        {
          q: 'How do tagged template literals prevent SQL injection in libraries?',
          a: 'Database libraries inspect the raw strings and values separately, automatically converting interpolated values into parameterized SQL placeholders ($1, $2).'
        },
        {
          q: 'Can you nest template literals inside other template literals?',
          a: 'Yes, template literals can be nested inside ${} expressions, useful for conditional formatting.'
        }
      ]
    },
    'destructuring': {
      copySnippet: `// Nested Object & Array Destructuring with Defaults
const response = {
  data: { user: { id: 101, full_name: "Neo" } },
  status: 200
};

const {
  data: { user: { full_name: name = "Guest" } } = {},
  status: statusCode
} = response;`,
      copyLabel: '📋 Copy JavaScript Nested Destructuring Pattern Snippet',
      traps: [
        {
          title: 'Destructuring from null or undefined TypeError',
          desc: 'Attempting to destructure properties from <code>null</code> or <code>undefined</code> throws an immediate fatal <code>TypeError: Cannot destructure property ... of null</code>.'
        },
        {
          title: 'Default Values Only Trigger on undefined, NOT null',
          desc: 'In <code>const { name = "Default" } = { name: null };</code>, <code>name</code> remains <code>null</code>! Default values only apply when the value is strictly <code>undefined</code>.'
        },
        {
          title: 'Renaming Syntax vs Type Annotation Confusion',
          desc: 'In <code>const { id: userId } = obj;</code>, <code>userId</code> is the new variable name, NOT a TypeScript type annotation.'
        },
        {
          title: 'Destructuring Destroys Immutability for Nested References',
          desc: 'Destructuring extracts shallow pointers. Modifying a property on a destructured nested object mutates the source object.'
        },
        {
          title: 'Array Destructuring Out-of-Bounds Indexing',
          desc: 'Destructuring past the end of an array (<code>const [a, b, c] = [1];</code>) silently sets missing variables to <code>undefined</code> without throwing an error.'
        }
      ],
      faqs: [
        {
          q: 'How do you swap two variables without a temporary variable in JavaScript?',
          a: 'Use array destructuring assignment: [a, b] = [b, a];.'
        },
        {
          q: 'How do you rename a variable during object destructuring?',
          a: 'Use the colon syntax: const { originalKey: newVariableName } = object;.'
        },
        {
          q: 'What is rest property destructuring in objects?',
          a: 'const { id, ...details } = user; assigns id to its own variable and collects all remaining properties into a new object called details.'
        },
        {
          q: 'Can you destructure function parameters directly?',
          a: 'Yes: function render({ title, width = 100 }) { ... } unpacks object properties directly in the function signature.'
        },
        {
          q: 'How do you ignore items during array destructuring?',
          a: 'Leave empty commas: const [first, , third] = [1, 2, 3]; skips the second item.'
        }
      ]
    },
    'spread-rest': {
      copySnippet: `// Rest Parameters in Function Signatures
function logMessage(level, ...details) {
  console.log(\`[\${level}]\`, details.join(" "));
}

// Spread in Object & Array Merging
const base = { active: true, theme: "dark" };
const userConfig = { theme: "light" };
const merged = { ...base, ...userConfig }; // theme becomes 'light'`,
      copyLabel: '📋 Copy Spread & Rest Operator Patterns Snippet',
      traps: [
        {
          title: 'Spread Operator Creates Strictly Shallow Copies',
          desc: 'Spreading an array or object (<code>const copy = [...items]</code>) only duplicates top-level primitives. Nested objects share the exact same memory references.'
        },
        {
          title: 'Call Stack Exceeded on Massive Array Spread',
          desc: 'Passing <code>Math.max(...giantArray)</code> with 100,000+ items overflows JavaScript\'s maximum function call stack limit, throwing <code>RangeError: Maximum call stack size exceeded</code>. Use <code>reduce()</code>.'
        },
        {
          title: 'Rest Parameter Must Be the Final Parameter',
          desc: 'Writing <code>function f(...rest, last)</code> is a syntax error. Rest parameters must always be positioned at the very end of parameter lists.'
        },
        {
          title: 'Object Spread Precedence Overwriting Defaults',
          desc: 'Writing <code>{ ...userOverrides, ...defaultSettings }</code> allows default settings to overwrite user customizations! Always put defaults first.'
        },
        {
          title: 'Spreading Non-Iterables into Arrays',
          desc: 'Writing <code>[...123]</code> or <code>[...null]</code> throws <code>TypeError: ... is not iterable</code>.'
        }
      ],
      faqs: [
        {
          q: 'What is the visual and functional difference between spread and rest?',
          a: 'Both use ... syntax. Spread expands an iterable into individual elements or object properties. Rest condenses multiple individual elements into a single array or object.'
        },
        {
          q: 'Why does spreading an object into an array fail?',
          a: 'Standard objects do not implement the Iterable protocol ([Symbol.iterator]), so spreading an object into [...] throws a TypeError.'
        },
        {
          q: 'How does object spread handle non-enumerable properties?',
          a: 'Object spread ({ ...obj }) only copies own enumerable properties, ignoring non-enumerable properties and prototype methods.'
        },
        {
          q: 'Can you use the spread operator to convert a NodeList to an Array?',
          a: 'Yes: const elements = [...document.querySelectorAll(".item")]; converts a NodeList into a standard Array.'
        },
        {
          q: 'How does spread perform compared to Object.assign()?',
          a: 'Both perform shallow property copying. Spread syntax is slightly more concise and does not trigger setters on the target object.'
        }
      ]
    },
    'map-filter-reduce': {
      copySnippet: `const transactions = [
  { type: "credit", amount: 150 },
  { type: "debit", amount: 40 },
  { type: "credit", amount: 200 }
];

// Calculate Net Balance with Reduce
const netBalance = transactions.reduce((acc, t) => {
  return t.type === "credit" ? acc + t.amount : acc - t.amount;
}, 0);`,
      copyLabel: '📋 Copy Functional Array Pipelines Snippet',
      traps: [
        {
          title: 'Reduce of Empty Array Without Initial Value TypeError',
          desc: 'Calling <code>[].reduce((acc, x) =&gt; acc + x)</code> without an initial value throws an immediate <code>TypeError: Reduce of empty array with no initial value</code>. Always provide the initial accumulator argument.'
        },
        {
          title: 'Chaining Multiple Iterations on Massive Arrays',
          desc: 'Chaining <code>arr.map().filter().map()</code> creates multiple intermediate arrays in memory. On large datasets (100k+ items), combine into a single <code>reduce()</code> or for-loop.'
        },
        {
          title: 'Mutating the Accumulator In-Place in Reduce',
          desc: 'Mutating objects or arrays in <code>reduce()</code> without returning them breaks pipeline expectations and causes side-effects across iterations.'
        },
        {
          title: 'Using map() Without Consuming the Return Value',
          desc: 'Using <code>arr.map(x =&gt; doSomething(x))</code> purely for side-effects allocates a throwaway array. Use <code>for...of</code> or <code>forEach</code>.'
        },
        {
          title: 'Falsy Element Removal Confusion in filter()',
          desc: 'Writing <code>arr.filter(Boolean)</code> removes all falsy items (0, false, null, undefined, ""), which may unintentionally strip valid numeric zeros.'
        }
      ],
      faqs: [
        {
          q: 'What is the role of the initial value in Array.prototype.reduce()?',
          a: 'The initial value initializes the accumulator on the first step. If omitted, reduce() uses element 0 as the accumulator and starts iteration at index 1 (failing on empty arrays).'
        },
        {
          q: 'How does Array.prototype.flatMap() work?',
          a: 'flatMap() combines map() and flat(1) into a single pass, mapping each element and flattening the result by 1 level, useful for 1-to-many transformations.'
        },
        {
          q: 'Are map(), filter(), and reduce() pure functions?',
          a: 'They do not mutate the original array, but they are only pure if the callback function does not mutate external variables or the array elements.'
        },
        {
          q: 'How can you group array items using Object.groupBy() in modern JavaScript?',
          a: 'Object.groupBy(items, item => item.category) (ES2024) groups array elements into an object keyed by callback return values.'
        },
        {
          q: 'What is the performance difference between forEach and map?',
          a: 'map() allocates and returns a new array with transformed elements. forEach() returns undefined and is intended exclusively for side effects.'
        }
      ]
    },
    'error-handling': {
      copySnippet: `// Custom Error Class with Inheritance & Cause
class NetworkError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "NetworkError";
  }
}

try {
  throw new NetworkError("Failed to fetch user", { cause: "Timeout" });
} catch (err) {
  if (err instanceof NetworkError) {
    console.error(\`[\${err.name}]\`, err.message, "Root cause:", err.cause);
  }
}`,
      copyLabel: '📋 Copy Custom Error Class & Error Chaining Snippet',
      traps: [
        {
          title: 'Throwing Non-Error Literals (throw "error")',
          desc: 'Throwing raw strings or numbers (<code>throw "Something went wrong"</code>) lacks a stack trace, making debugging production failures virtually impossible. Always throw <code>new Error()</code>.'
        },
        {
          title: 'Swallowing Errors in Empty Catch Blocks',
          desc: 'Writing <code>catch (e) {}</code> silently consumes failures, hiding fatal syntax flaws and network disconnections without any log trace.'
        },
        {
          title: 'Return Inside finally Overriding Try/Catch',
          desc: 'Placing a <code>return</code> statement inside a <code>finally</code> block overrides any return value or uncaught exception from <code>try</code> and <code>catch</code>!'
        },
        {
          title: 'Async Errors Escaping try/catch Without await',
          desc: 'Omitting <code>await</code> in <code>try { asyncFunc(); } catch (e) {}</code> allows the promise to reject asynchronously outside the try/catch boundary.'
        },
        {
          title: 'Masking Original Cause Without { cause: err }',
          desc: 'Catching an error and re-throwing a generic message loses the root traceback unless wrapped with modern Error Chaining: <code>new Error("message", { cause: err })</code>.'
        }
      ],
      faqs: [
        {
          q: 'What does the { cause: err } option do in Error constructors?',
          a: 'Introduced in ES2022, Error Chaining allows passing an underlying root error to { cause }, preserving the entire contextual traceback across architectural boundaries.'
        },
        {
          q: 'What is the purpose of the finally block?',
          a: 'The finally block executes unconditionally whether an exception was thrown, caught, or omitted, ensuring cleanup hooks (closing files, releasing locks) always run.'
        },
        {
          q: 'How do you catch unhandled promise rejections globally?',
          a: 'In browsers: window.addEventListener("unhandledrejection", e => { ... }). In Node.js: process.on("unhandledRejection", (reason, promise) => { ... }).'
        },
        {
          q: 'What is the difference between ReferenceError, TypeError, and SyntaxError?',
          a: 'ReferenceError occurs when reading an undeclared variable. TypeError occurs when an operation is performed on an incompatible type (e.g. null.f()). SyntaxError occurs when code violates JS grammar rules.'
        },
        {
          q: 'Can you omit the error variable in a catch block?',
          a: 'Yes, Optional Catch Binding (ES2019) allows writing try { ... } catch { ... } without specifying an unused (error) parameter.'
        }
      ]
    },
    'todo-app': {
      copySnippet: `// State-Driven Todo Store Pattern
class TodoStore {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos") || "[]");
  }
  add(text) {
    this.todos.push({ id: Date.now(), text, done: false });
    this.save();
  }
  toggle(id) {
    const t = this.todos.find(x => x.id === id);
    if (t) { t.done = !t.done; this.save(); }
  }
  save() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }
}`,
      copyLabel: '📋 Copy State-Driven Todo Store Architecture Snippet',
      traps: [
        {
          title: 'Storing State in the DOM',
          desc: 'Reading state directly from HTML classes and text leads to desynchronization. Maintain an in-memory JavaScript state array and render the DOM as a pure projection of that data.'
        },
        {
          title: 'Direct innerHTML Injection of Todo Text (XSS)',
          desc: 'Rendering <code>item.innerHTML = todo.text</code> allows malicious users to inject script tags. Always use <code>textContent</code> or sanitized DOM creation.'
        },
        {
          title: 'Duplicate IDs from Date.now() in Automated Tests',
          desc: 'Generating IDs with <code>Date.now()</code> creates duplicate keys when multiple items are added within the same millisecond. Use <code>crypto.randomUUID()</code>.'
        },
        {
          title: 'Full DOM Re-Renders on Single Item Mutations',
          desc: 'Wiping and regenerating the entire list on every checkbox click destroys user input focus and degrades performance. Update the specific item element.'
        },
        {
          title: 'Untrimmed Empty String Submissions',
          desc: 'Failing to validate <code>input.value.trim()</code> allows users to add blank todos that clutter storage.'
        }
      ],
      faqs: [
        {
          q: 'Why is the Single Source of Truth architecture recommended for UI apps?',
          a: 'Keeping data in a single JavaScript store and rendering the DOM from that state ensures mutations, persistence, and UI display never fall out of sync.'
        },
        {
          q: 'How should unique IDs be generated in client-side applications?',
          a: 'Use crypto.randomUUID() (built into all modern browsers) to generate cryptographically random, collision-proof UUIDv4 strings.'
        },
        {
          q: 'How do you handle keyboard accessibility (Enter key) in todo forms?',
          a: 'Wrap inputs in a <form> and listen to the submit event, which natively triggers on both submit button clicks and Enter key presses.'
        },
        {
          q: 'How can you persist todo data across browser reloads?',
          a: 'Serialize the state array to localStorage using JSON.stringify() on save, and deserialize with JSON.parse() during application initialization.'
        },
        {
          q: 'What is Event Delegation and how does it optimize a todo list?',
          a: 'Attaching a single click listener to the parent <ul> container and inspecting event.target.closest("button") handles clicks for all current and future list items with minimal memory usage.'
        }
      ]
    },
    'calculator': {
      copySnippet: `// Pure State-Machine Calculator Architecture
class CalculatorEngine {
  constructor() {
    this.current = "0";
    this.previous = null;
    this.operation = null;
  }
  appendNumber(num) {
    if (this.current === "0" && num !== ".") this.current = "";
    if (num === "." && this.current.includes(".")) return;
    this.current += num;
  }
  chooseOperation(op) {
    if (this.current === "") return;
    if (this.previous !== null) this.compute();
    this.operation = op;
    this.previous = this.current;
    this.current = "";
  }
}`,
      copyLabel: '📋 Copy Calculator State Machine Engine Snippet',
      traps: [
        {
          title: 'Using eval() to Compute Calculations',
          desc: 'Evaluating mathematical expressions with <code>eval(expressionString)</code> allows arbitrary malicious JavaScript execution and code injection. Build an explicit parser or state machine.'
        },
        {
          title: 'IEEE 754 Floating-Point Arithmetic Drift',
          desc: 'Performing <code>0.1 + 0.2</code> returns <code>0.30000000000000004</code>. Round results to a reasonable precision (e.g. <code>parseFloat(result.toFixed(10))</code>).'
        },
        {
          title: 'Division by Zero Returning Infinity',
          desc: 'In JavaScript, <code>5 / 0</code> evaluates to <code>Infinity</code> rather than an error. Check for division by zero and display an explicit error state.'
        },
        {
          title: 'Multiple Decimal Points in a Single Operand',
          desc: 'Failing to guard against repeated decimal button presses allows invalid inputs like <code>3.1.4.5</code>.'
        },
        {
          title: 'Operator Chaining State Bugs',
          desc: 'Pressing <code>5 + * 3</code> without properly updating the active operation leads to unexpected NaN results.'
        }
      ],
      faqs: [
        {
          q: 'Why is eval() forbidden in calculator implementations?',
          a: 'eval() is dangerous because it executes arbitrary JavaScript code, allowing attackers to access cookies, DOM nodes, and session data if user input is unvalidated.'
        },
        {
          q: 'How do you handle decimal precision cleanly in a calculator?',
          a: 'Perform calculations in integer units (scaling by 10^N) or use Math.round((num + Number.EPSILON) * 10000) / 10000 to eliminate floating-point drift.'
        },
        {
          q: 'What is the Shunting-Yard algorithm?',
          a: 'It is a classic algorithm by Edsger Dijkstra for parsing infix mathematical expressions containing parentheses and operator precedence into Reverse Polish Notation (RPN).'
        },
        {
          q: 'How do keyboard shortcuts integrate with a calculator UI?',
          a: 'Listen to document.addEventListener("keydown", e => { ... }) and map event.key (such as "0"-"9", "+", "-", "*", "/", "Enter", "Escape") to matching calculator methods.'
        },
        {
          q: 'What is unary minus vs binary subtraction?',
          a: 'Binary subtraction subtracts one operand from another (5 - 2 = 3). Unary minus negates a single operand (-5).'
        }
      ]
    },
    'form-validation': {
      copySnippet: `// HTML5 Constraint Validation API Integration
const form = document.querySelector("#signup-form");
const emailInput = document.querySelector("#email");

emailInput.addEventListener("input", () => {
  if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity("Please enter a valid business email address.");
  } else {
    emailInput.setCustomValidity("");
  }
  emailInput.reportValidity();
});`,
      copyLabel: '📋 Copy HTML5 Constraint Validation API Snippet',
      traps: [
        {
          title: 'Relying Solely on Client-Side Validation',
          desc: 'Client validation is purely for user experience. Any attacker can bypass it with curl, Postman, or by disabling JavaScript. Server-side validation is strictly mandatory.'
        },
        {
          title: 'Overly Restrictive Email Regular Expressions',
          desc: 'Writing strict email regexes frequently rejects valid email addresses containing plus tags, international domains, or newer TLDs. Rely on HTML5 <code>type="email"</code>.'
        },
        {
          title: 'Blocking Paste in Password Fields',
          desc: 'Disabling paste in password fields prevents users from using secure password managers, forcing them to choose short, insecure passwords.'
        },
        {
          title: 'Premature Validation Error Display',
          desc: 'Showing red error borders before the user has finished typing frustrates users. Validate on <code>blur</code> or on the first <code>submit</code> attempt.'
        },
        {
          title: 'Forgetting setCustomValidity("") Reset',
          desc: 'Once <code>setCustomValidity("error")</code> is set on an input, the input remains permanently invalid until explicitly reset with an empty string <code>""</code>.'
        }
      ],
      faqs: [
        {
          q: 'What is the HTML5 Constraint Validation API?',
          a: 'It is a native browser API that checks input validity states (validity.valueMissing, validity.typeMismatch, validity.patternMismatch) without external validation libraries.'
        },
        {
          q: 'How do you prevent a form from submitting if invalid?',
          a: 'In the form submit listener, check if (!form.checkValidity()) { event.preventDefault(); form.reportValidity(); }.'
        },
        {
          q: 'What is the difference between checkValidity() and reportValidity()?',
          a: 'checkValidity() returns a boolean indicating validity. reportValidity() returns a boolean and also displays native browser error tooltip bubbles.'
        },
        {
          q: 'How does the :user-invalid CSS pseudo-class improve UX?',
          a: ':user-invalid only matches when an input is invalid AFTER the user has interacted with it, preventing red error states on empty initial forms.'
        },
        {
          q: 'Why should password confirmation fields not be validated on every keystroke?',
          a: 'The confirmation field will appear invalid while the user is halfway through typing matching characters; validate only after focus leaves the field (on blur).'
        }
      ]
    },
    'dates': {
      copySnippet: `// Modern Intl.DateTimeFormat & Timestamp Calculations
const now = new Date();

// High-Precision Localized Formatting
const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/New_York"
});
console.log(formatter.format(now));

// Date Arithmetic via Timestamps
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);`,
      copyLabel: '📋 Copy Intl.DateTimeFormat & Safe Date Math Snippet',
      traps: [
        {
          title: '0-Indexed Months Trap',
          desc: 'In JavaScript <code>Date</code>, months are 0-indexed (January is <code>0</code>, December is <code>11</code>). Writing <code>new Date(2026, 1, 1)</code> creates February 1st, NOT January 1st!'
        },
        {
          title: 'String Date Parsing Ambiguity',
          desc: 'Parsing strings like <code>new Date("05/06/2026")</code> produces May 6 in the US and June 5 in Europe. Always use ISO 8601 strings: <code>"YYYY-MM-DDTHH:mm:ssZ"</code>.'
        },
        {
          title: 'In-Place Mutation with Date Setters',
          desc: 'Calling <code>date.setDate(date.getDate() + 7)</code> mutates the original Date instance in-place. Clone before modifying: <code>new Date(date.getTime())</code>.'
        },
        {
          title: 'Comparing Dates with Loose or Strict Equality',
          desc: '<code>dateA === dateB</code> compares object memory references, returning <code>false</code> even if both dates represent the exact same millisecond. Compare with <code>dateA.getTime() === dateB.getTime()</code>.'
        },
        {
          title: 'Daylight Saving Time (DST) Arithmetic Offsets',
          desc: 'Adding 86,400,000 milliseconds (24 hours) across a DST transition can shift clock times by 1 hour. Use calendar setters or modern Temporal APIs.'
        }
      ],
      faqs: [
        {
          q: 'What is the modern alternative to the legacy JavaScript Date object?',
          a: 'The upcoming TC39 Temporal API provides immutable, timezone-aware, ISO-compliant date and time objects designed to replace Date.'
        },
        {
          q: 'How do you format dates without third-party libraries in modern browsers?',
          a: 'Use the native Intl.DateTimeFormat API, which formats dates and times according to locale standards and specific time zones with zero bundle overhead.'
        },
        {
          q: 'What is the Unix epoch in JavaScript?',
          a: 'The Unix epoch is midnight on January 1, 1970, UTC. Date.now() returns milliseconds elapsed since this epoch.'
        },
        {
          q: 'How do you calculate the difference in days between two dates?',
          a: 'Subtract their timestamps and divide by milliseconds per day: Math.floor((dateB - dateA) / (1000 * 60 * 60 * 24)).'
        },
        {
          q: 'What does date.toISOString() return?',
          a: 'It returns a standardized ISO 8601 string representation in UTC ending with "Z" (e.g. 2026-09-06T11:00:00.000Z).'
        }
      ]
    },
    'regex': {
      copySnippet: `// Named Capture Groups & Testing
const logPattern = /\\[(?<level>INFO|WARN|ERROR)\\]\\s+(?<msg>.*)/u;
const match = logPattern.exec("[ERROR] Connection refused to database");

if (match) {
  const { level, msg } = match.groups;
  console.log(\`Level: \${level} | Message: \${msg}\`);
}`,
      copyLabel: '📋 Copy JavaScript Regex Named Capture Groups Snippet',
      traps: [
        {
          title: 'Global Flag (/g) Stateful lastIndex Bug',
          desc: 'When using the <code>/g</code> flag, RegExp objects store internal state on <code>lastIndex</code>. Calling <code>regex.test(str)</code> repeatedly alternates between returning <code>true</code> and <code>false</code>! Reset <code>regex.lastIndex = 0</code>.'
        },
        {
          title: 'Catastrophic Backtracking (ReDoS Vulnerability)',
          desc: 'Nested quantifiers like <code>(a+)+$</code> cause exponential backtracking on non-matching inputs, freezing the CPU for minutes (Regular Expression Denial of Service).'
        },
        {
          title: 'Unescaped User Input in Dynamic new RegExp()',
          desc: 'Passing unsanitized strings to <code>new RegExp(input)</code> crashes if the user types regex special characters like <code>[</code> or <code>?</code>. Escape special characters first.'
        },
        {
          title: 'Greedy vs. Lazy Quantifier Confusion',
          desc: 'By default, quantifiers like <code>.*</code> are greedy and match as much text as possible. Append <code>?</code> (e.g. <code>.*?</code>) for lazy minimal matching.'
        },
        {
          title: 'Omitting the Unicode (/u) Flag',
          desc: 'Without the <code>u</code> flag, regular expressions treat emojis as surrogate pairs of separate characters, breaking matching on non-ASCII symbols.'
        }
      ],
      faqs: [
        {
          q: 'What do named capture groups (?<name>...) provide in JavaScript regex?',
          a: 'Named capture groups allow extracted substrings to be accessed via match.groups.name instead of fragile numeric array indexes.'
        },
        {
          q: 'What is the difference between RegExp.prototype.test() and RegExp.prototype.exec()?',
          a: 'test() returns a boolean indicating whether a match exists. exec() returns a detailed result array with captured groups, indexes, and full match strings.'
        },
        {
          q: 'What does the /s (dotAll) flag do in regular expressions?',
          a: 'The s flag allows the dot . metacharacter to match newline characters (\\n, \\r), which it skips by default.'
        },
        {
          q: 'What are positive and negative lookaheads?',
          a: 'Positive lookahead (?=pattern) asserts that what follows matches pattern without including it in the match. Negative lookahead (?!pattern) asserts that what follows does NOT match.'
        },
        {
          q: 'How do you safely escape user input before creating a RegExp?',
          a: 'Replace all special characters: string.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&").'
        }
      ]
    },
    'json': {
      copySnippet: `// Safe JSON Parsing with Custom Reviver
function safeJsonParse(text, fallback = {}) {
  try {
    return JSON.parse(text, (key, value) => {
      // Automatically deserialize ISO date strings
      if (typeof value === "string" && /^\\d{4}-\\d{2}-\\d{2}T/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return fallback;
  }
}`,
      copyLabel: '📋 Copy Safe JSON Parser & Date Reviver Snippet',
      traps: [
        {
          title: 'JSON.parse() Throws Fatal SyntaxError on Bad Input',
          desc: 'Passing invalid JSON, an empty string, or an HTML error page to <code>JSON.parse()</code> immediately crashes the executing script with a SyntaxError. Always wrap in a <code>try...catch</code>.'
        },
        {
          title: 'Silent Stripping of undefined, Functions, and Symbols',
          desc: '<code>JSON.stringify()</code> silently omits object properties with values of <code>undefined</code>, functions, or Symbols, causing silent data loss.'
        },
        {
          title: 'Circular Reference TypeError',
          desc: 'Attempting to serialize an object that references itself throws <code>TypeError: Converting circular structure to JSON</code>.'
        },
        {
          title: 'NaN and Infinity Serialized as null',
          desc: 'JSON does not support <code>NaN</code>, <code>Infinity</code>, or <code>-Infinity</code>; serializing them converts them silently to <code>null</code>.'
        },
        {
          title: 'Integer Key Coercion to Strings',
          desc: 'In JSON, all dictionary keys must be strings. Parsing JSON converts numeric keys to string properties.'
        }
      ],
      faqs: [
        {
          q: 'What is the replacer parameter in JSON.stringify()?',
          a: 'The replacer can be a filtering array of allowed keys or a mapping function (key, value) => filteredValue to transform data before serialization.'
        },
        {
          q: 'What is the reviver parameter in JSON.parse()?',
          a: 'A reviver function (key, value) => transformedValue inspects and transforms every key-value pair during parsing, commonly used to restore Date objects.'
        },
        {
          q: 'How do you pretty-print JSON with indentation?',
          a: 'Pass the indentation space count as the third argument: JSON.stringify(data, null, 2).'
        },
        {
          q: 'What does the toJSON() method on objects do?',
          a: 'If an object defines a toJSON() method, JSON.stringify() invokes it to obtain the serialized value instead of inspecting the object properties directly.'
        },
        {
          q: 'Why does JSON require double quotes for keys and strings?',
          a: 'The JSON RFC standard strictly mandates double quotes. Single quotes or unquoted keys are invalid JSON.'
        }
      ]
    },
    'timers': {
      copySnippet: `// Debounce Function (Collapses Rapid Calls into One)
function debounce(fn, delayMs = 300) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

// Throttle Function (Limits Execution to Rate Interval)
function throttle(fn, limitMs = 300) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limitMs);
    }
  };
}`,
      copyLabel: '📋 Copy Debounce and Throttle Implementation Snippet',
      traps: [
        {
          title: 'Forgetting to Clear Timers on Unmount',
          desc: 'Failing to call <code>clearTimeout</code> or <code>clearInterval</code> leaves callbacks referencing unmounted DOM elements, leaking memory and throwing errors.'
        },
        {
          title: 'Background Tab Timer Clamping',
          desc: 'Browsers throttle <code>setTimeout</code> and <code>setInterval</code> to 1,000ms or slower in inactive background tabs to save battery. Never rely on timers for precise audio or game timing.'
        },
        {
          title: 'Timer Drift from Event Loop Queuing',
          desc: 'Timers specify the MINIMUM delay before the callback is queued, not exact execution time. Heavy synchronous tasks delay timer execution.'
        },
        {
          title: 'Passing Strings to setTimeout (Implicit eval)',
          desc: 'Writing <code>setTimeout("doSomething()", 100)</code> invokes <code>eval()</code> behind the scenes, creating a security risk and degrading optimization.'
        },
        {
          title: 'setTimeout(fn, 0) Is Still Asynchronous',
          desc: 'Even with a delay of 0, the callback is queued into the macrotask queue and executes only AFTER all current synchronous code and microtasks complete.'
        }
      ],
      faqs: [
        {
          q: 'What is the practical difference between debounce and throttle?',
          a: 'Debounce waits for a pause in activity before executing (e.g. search autocomplete). Throttle guarantees execution at a steady maximum rate (e.g. window resize or scroll handlers).'
        },
        {
          q: 'What is requestAnimationFrame() and why is it superior for animations?',
          a: 'requestAnimationFrame() syncs with the browser display refresh rate (typically 60Hz/120Hz), pauses in background tabs, and prevents screen tearing and unnecessary CPU load.'
        },
        {
          q: 'What does queueMicrotask() do?',
          a: 'queueMicrotask() schedules a callback to run immediately after the current synchronous function finishes, before UI rendering or macrotask timers execute.'
        },
        {
          q: 'Why can timer intervals stack up with setInterval?',
          a: 'If the callback takes longer to execute than the interval delay, multiple executions can queue consecutively without gaps. Use recursive setTimeout instead.'
        },
        {
          q: 'What does clearTimeout(undefined) do?',
          a: 'Calling clearTimeout(null) or clearTimeout(undefined) fails silently without throwing an error.'
        }
      ]
    },
    'classes': {
      copySnippet: `// Modern Class with Private Fields & Static Factory
class UserAccount {
  #passwordHash; // True private field enforced by engine

  constructor(username, passwordHash) {
    this.username = username;
    this.#passwordHash = passwordHash;
  }

  static createDefault(username) {
    return new UserAccount(username, "default_hash");
  }

  verify(hash) {
    return this.#passwordHash === hash;
  }
}`,
      copyLabel: '📋 Copy Modern JavaScript Class with Private Fields Snippet',
      traps: [
        {
          title: 'Losing this Context When Passing Methods as Callbacks',
          desc: 'Passing <code>button.addEventListener("click", user.verify)</code> detaches the method from the instance, leaving <code>this</code> undefined. Bind the method or use an arrow function.'
        },
        {
          title: 'Accessing this Before super() in Subclasses',
          desc: 'In a subclass constructor, referencing <code>this</code> before calling <code>super()</code> throws an immediate <code>ReferenceError: Must call super constructor before accessing this</code>.'
        },
        {
          title: 'JavaScript Classes Are NOT Hoisted',
          desc: 'Unlike function declarations, classes are in the Temporal Dead Zone until execution reaches them. Instantiating a class before its declaration throws a <code>ReferenceError</code>.'
        },
        {
          title: 'Private Field Syntax (#field) Outside Class Error',
          desc: 'Attempting to access <code>user.#passwordHash</code> outside the class declaration is a syntax error caught at parse-time.'
        },
        {
          title: 'Classes Are Syntactic Sugar Over Prototypes',
          desc: 'Underneath the hood, JavaScript classes still use prototype chains. Methods are attached to <code>Class.prototype</code>, not copied onto each instance.'
        }
      ],
      faqs: [
        {
          q: 'How do private fields (#) work in modern JavaScript classes?',
          a: 'Prefixing a field name with # enforces hard encapsulation at the engine level. Private fields cannot be accessed, modified, or detected from outside the class body.'
        },
        {
          q: 'What is the super keyword used for in classes?',
          a: 'super() calls the parent class constructor, and super.method() invokes parent prototype methods in subclass overrides.'
        },
        {
          q: 'What are static methods and fields on classes?',
          a: 'Static members belong to the class constructor function itself rather than individual instances, accessed via ClassName.method().'
        },
        {
          q: 'What are getters and setters in classes?',
          a: 'get prop() and set prop(val) define methods that are accessed with property syntax, enabling validation and computed attributes.'
        },
        {
          q: 'How does inheritance work with class extends?',
          a: 'class Sub extends Super sets up the prototype chain so Sub.prototype inherits from Super.prototype, and Sub inherits static properties from Super.'
        }
      ]
    },
    'modules': {
      copySnippet: `// ES Modules (ESM) Standard Syntax
// math.js:
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator {}

// app.js:
import Calculator, { PI, add } from "./math.js";`,
      copyLabel: '📋 Copy ES Modules Export and Import Cheat Sheet',
      traps: [
        {
          title: 'Missing File Extension in Browser ESM',
          desc: 'In standard browser ES modules, writing <code>import { add } from "./math"</code> fails with a 404 error. Browsers require the full file extension: <code>"./math.js"</code>.'
        },
        {
          title: 'CommonJS vs. ES Module Interop Confusion',
          desc: 'Mixing <code>require()</code> and <code>import</code> statements in the same file causes syntax errors. Configure <code>"type": "module"</code> in package.json to standardize on ESM.'
        },
        {
          title: 'Default Export Renaming Confusion',
          desc: 'Default exports can be imported under any arbitrary name, which can lead to inconsistent naming across team files. Prefer named exports for refactoring clarity.'
        },
        {
          title: 'Dynamic import() Returns a Promise',
          desc: '<code>import(modulePath)</code> is asynchronous and returns a Promise. Forgetting to <code>await import(...)</code> leaves you with a pending promise instead of module exports.'
        },
        {
          title: 'Top-Level Await Blocking Module Tree Execution',
          desc: 'Using top-level <code>await</code> in an imported module pauses the execution of all parent importing modules until the promise resolves.'
        }
      ],
      faqs: [
        {
          q: 'What is the difference between named exports and default exports?',
          a: 'Named exports allow multiple exports per file imported using matching names in braces { a, b }. Default export allows a single primary export imported without braces.'
        },
        {
          q: 'What is dynamic import() and when should you use it?',
          a: 'dynamic import("./module.js") loads modules on-demand at runtime, enabling code-splitting and conditional loading of heavy dependencies.'
        },
        {
          q: 'How do you tell Node.js to use ES Modules?',
          a: 'Set "type": "module" in your project package.json file or use the .mjs file extension.'
        },
        {
          q: 'Are ES modules executed in strict mode by default?',
          a: 'Yes. All ES modules are automatically evaluated in strict mode ("use strict") without needing the directive.'
        },
        {
          q: 'What does import.meta provide in ES modules?',
          a: 'import.meta contains contextual metadata about the current module, such as import.meta.url (the file URL of the running module).'
        }
      ]
    },
    'debugging': {
      copySnippet: `// Advanced Console Diagnostic Suite
console.table([
  { id: 1, service: "Auth", latencyMs: 14 },
  { id: 2, service: "Database", latencyMs: 2.1 }
]);

console.time("Heavy Computation");
// run algorithm
console.timeEnd("Heavy Computation");

console.assert(user.age >= 18, "Underage user detected!", user);`,
      copyLabel: '📋 Copy Advanced Console Diagnostics Snippet',
      traps: [
        {
          title: 'Leaving console.log in Production Code',
          desc: 'Excessive console logging degrades performance, leaks sensitive API keys or user data to anyone opening DevTools, and clutters browser logs.'
        },
        {
          title: 'Logging Mutable Objects Directly',
          desc: '<code>console.log(obj)</code> stores an object reference that updates dynamically when expanded in DevTools. To view the exact snapshot at log time, use <code>console.log(structuredClone(obj))</code>.'
        },
        {
          title: 'Overlooking the debugger; Statement',
          desc: 'Inserting <code>debugger;</code> in your code acts as a programmatic breakpoint, automatically pausing execution in DevTools with full call stack inspection.'
        },
        {
          title: 'Ignoring the Sources Call Stack Tab',
          desc: 'Debugging by guessing rather than stepping through execution frames in DevTools Sources tab wastes engineering time.'
        },
        {
          title: 'Not Using Conditional Breakpoints in Loops',
          desc: 'Pausing manually inside a loop that runs 10,000 times is excruciating. Right-click the line number in DevTools and set a conditional breakpoint (e.g. <code>i === 999</code>).'
        }
      ],
      faqs: [
        {
          q: 'What does console.table() do?',
          a: 'console.table() renders arrays of objects or tabular data as a clean, sortable interactive table in the browser developer console.'
        },
        {
          q: 'How do console.time() and console.timeEnd() measure performance?',
          a: 'console.time("label") starts a high-resolution millisecond timer; console.timeEnd("label") stops it and prints the elapsed execution time.'
        },
        {
          q: 'What is a conditional breakpoint in Chrome/Firefox DevTools?',
          a: 'A breakpoint that pauses execution only when a specified JavaScript expression evaluates to true (e.g. id === 42).'
        },
        {
          q: 'What does console.trace() print?',
          a: 'console.trace() prints an interactive stack trace showing the exact path of function invocations that reached that line of code.'
        },
        {
          q: 'How do you inspect performance bottlenecks in the browser?',
          a: 'Record a timeline in the DevTools Performance tab to identify long tasks, frame rate dips, memory leaks, and layout thrashing.'
        }
      ]
    }
  };

  // ─── 30 JAVASCRIPT GUIDES ─────────────────────────────────────────────────
  const jsGuides = [
    {
      slug: 'variables',
      title: 'JavaScript Variables & Data Types',
      metaDesc: 'Learn how to declare and use variables in JavaScript with let, const, and var. Covers strings, numbers, booleans, null, undefined, and more.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Variables & Data Types</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Variables are the building blocks of any programming language. They allow you to store data, update it, and reference it by name throughout your code.</p>
        
        <h2 style="font-family: var(--serif); margin-top: 2rem;">Declaring Variables</h2>
        <p>In modern JavaScript, you should almost always use <code>let</code> and <code>const</code>. <code>const</code> is for values that won't be reassigned, while <code>let</code> is for values that will change.</p>
        ${playground(`
const greeting = "Hello, World!";
let score = 0;
score = score + 10;
console.log(greeting);
console.log("Score:", score);
        `, 'var-1')}

        <h2 style="font-family: var(--serif); margin-top: 2rem;">Data Types</h2>
        <p>JavaScript has several basic data types: Strings (text), Numbers (integers and decimals), Booleans (true/false), Null (intentional absence of value), and Undefined (variable declared but not assigned).</p>
        ${playground(`
const name = "Alice"; // String
const age = 28;       // Number
const isCool = true;  // Boolean
let futurePlans;      // Undefined
const empty = null;   // Null

console.log(typeof name);
console.log(typeof age);
console.log(typeof isCool);
        `, 'var-2')}
      `
    },
    {
      slug: 'strings',
      title: 'Strings & String Methods',
      metaDesc: 'Master text manipulation in JavaScript. Learn about string concatenation, lengths, and built-in methods like toUpperCase and slice.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Strings & String Methods</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Strings represent text in JavaScript. You can enclose them in single quotes, double quotes, or backticks.</p>
        
        <h2 style="font-family: var(--serif); margin-top: 2rem;">Creating and Combining Strings</h2>
        <p>You can combine (concatenate) strings using the <code>+</code> operator. The length property tells you how many characters are in the string.</p>
        ${playground(`
const first = "Java";
const second = "Script";
const combined = first + second;
console.log(combined);
console.log("Length:", combined.length);
        `, 'str-1')}
      `
    },
    {
      slug: 'numbers',
      title: 'Numbers & Math Operations',
      metaDesc: 'Learn how to work with numbers in JavaScript. Covers basic arithmetic, operator precedence, and the built-in Math object.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Numbers & Math</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">JavaScript uses a single number type for both integers (like 42) and floating-point decimals (like 3.14).</p>
        ${playground(`
const a = 10;
const b = 3;
console.log("Addition:", a + b);
console.log("Division:", a / b);
console.log("Remainder:", a % b);
        `, 'num-1')}
      `
    },
    {
      slug: 'booleans',
      title: 'Booleans & Comparison Operators',
      metaDesc: 'Understand true and false values in JavaScript. Learn how comparison operators like ===, !==, and > work.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Booleans & Comparisons</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Booleans have only two possible values: <code>true</code> and <code>false</code>. They are essential for making decisions in your code.</p>
        ${playground(`
const age = 20;
console.log("Is adult?", age >= 18);
console.log("Is exactly 20?", age === 20);
        `, 'bool-1')}
      `
    },
    {
      slug: 'conditionals',
      title: 'Conditionals (if, else, switch)',
      metaDesc: 'Control the flow of your program with if/else statements and switch blocks. Learn how to execute code only when certain conditions are met.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Conditionals</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Conditionals allow your code to take different paths depending on whether an expression evaluates to true or false.</p>
        ${playground(`
const score = 85;
if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else {
  console.log("Keep practicing!");
}
        `, 'cond-1')}
      `
    },
    {
      slug: 'for-loops',
      title: 'For Loops & Iteration',
      metaDesc: 'Repeat tasks efficiently using for loops in JavaScript. Learn standard for loops, for...of, and for...in.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">For Loops</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Loops allow you to run the same block of code multiple times with varying values.</p>
        ${playground(`
for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}
        `, 'loop-1')}
      `
    },
    {
      slug: 'while-loops',
      title: 'While Loops & Do-While Loops',
      metaDesc: 'Learn when and how to use while and do-while loops in JavaScript for condition-based repetition.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">While Loops</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">A <code>while</code> loop runs as long as a specified condition evaluates to <code>true</code>.</p>
        ${playground(`
let count = 3;
while (count > 0) {
  console.log("T-minus", count);
  count--;
}
console.log("Blast off!");
        `, 'while-1')}
      `
    },
    {
      slug: 'functions',
      title: 'Functions & Arrow Functions',
      metaDesc: 'Write reusable code blocks using standard function declarations and modern ES6 arrow functions in JavaScript.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Functions</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Functions bundle reusable chunks of code that can accept inputs (parameters) and produce outputs (return values).</p>
        ${playground(`
function greet(name) {
  return "Hello, " + name + "!";
}
const add = (a, b) => a + b;

console.log(greet("Alice"));
console.log("Sum:", add(5, 7));
        `, 'fn-1')}
      `
    },
    {
      slug: 'arrays',
      title: 'Arrays & Array Methods',
      metaDesc: 'Store and manipulate ordered lists of data in JavaScript. Covers push, pop, slice, splice, and common operations.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Arrays</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Arrays are ordered collections of values. You can store strings, numbers, objects, or even other arrays inside them.</p>
        ${playground(`
const fruits = ["Apple", "Banana", "Cherry"];
fruits.push("Date");
console.log("Fruits:", fruits);
console.log("First:", fruits[0]);
console.log("Total:", fruits.length);
        `, 'arr-1')}
      `
    },
    {
      slug: 'objects',
      title: 'Objects & Key-Value Pairs',
      metaDesc: 'Group related data and functions together using JavaScript objects. Learn dot notation, bracket notation, and methods.',
      category: 'Basics',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Objects</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Objects store collections of key-value pairs, making them the primary way to represent complex real-world entities in JavaScript.</p>
        ${playground(`
const user = {
  name: "Sarah",
  role: "Engineer",
  level: 4
};
console.log("User:", user.name);
console.log("Role:", user.role);
        `, 'obj-1')}
      `
    },
    {
      slug: 'dom',
      title: 'DOM Manipulation Basics',
      metaDesc: 'Interact with HTML pages using JavaScript. Learn querySelector, textContent, style changes, and element creation.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">DOM Manipulation</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">The Document Object Model (DOM) is a tree-like representation of your HTML that JavaScript can read and modify dynamically.</p>
        ${playground(`
const simulatedDOM = {
  heading: "Welcome!",
  update(text) { this.heading = text; }
};
simulatedDOM.update("Welcome to Digital Tools Shed!");
console.log("DOM Heading:", simulatedDOM.heading);
        `, 'dom-1')}
      `
    },
    {
      slug: 'events',
      title: 'Event Listeners & User Interaction',
      metaDesc: 'Make websites interactive with event listeners. Learn click, input, submit, and keyboard event handling.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Event Listeners</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Events are signals that something happened in the browser, such as a button click or a key press.</p>
        ${playground(`
const mockEvent = { type: "click", target: "btn-submit" };
console.log("Captured event:", mockEvent.type, "on", mockEvent.target);
        `, 'evt-1')}
      `
    },
    {
      slug: 'fetch',
      title: 'Fetching Data with Fetch API',
      metaDesc: 'Learn how to make HTTP requests and load JSON data from external APIs using the modern Fetch API.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Fetch API</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">The Fetch API provides an interface for fetching resources asynchronously across the network.</p>
        ${playground(`
console.log("Fetch syntax preview:");
console.log("fetch('https://api.example.com/data').then(res => res.json())");
        `, 'fetch-1')}
      `
    },
    {
      slug: 'async-await',
      title: 'Async/Await & Promises',
      metaDesc: 'Handle asynchronous operations cleanly using async and await in modern JavaScript without callback hell.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Async/Await</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Async/await lets you write asynchronous code that reads sequentially like synchronous code.</p>
        ${playground(`
const fakePromise = () => Promise.resolve("Data Loaded!");
fakePromise().then(res => console.log("Result:", res));
        `, 'async-1')}
      `
    },
    {
      slug: 'localstorage',
      title: 'Browser LocalStorage & SessionStorage',
      metaDesc: 'Persist data in the user browser across page reloads using localStorage.setItem, getItem, and JSON serialization.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">LocalStorage</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">LocalStorage allows you to store key-value pairs in the user browser with no expiration date.</p>
        ${playground(`
const storageMock = {};
storageMock["theme"] = "dark";
console.log("Saved theme:", storageMock["theme"]);
        `, 'ls-1')}
      `
    },
    {
      slug: 'template-literals',
      title: 'Template Literals & String Interpolation',
      metaDesc: 'Learn how to embed variables and multi-line strings effortlessly using backticks and ${expression} syntax in ES6.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Template Literals</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Template literals use backticks (\`) to allow embedded expressions and multi-line strings.</p>
        ${playground(`
const user = "Alex";
const items = 5;
console.log(\`User \${user} has \${items} items in their cart.\`);
        `, 'tl-1')}
      `
    },
    {
      slug: 'destructuring',
      title: 'Array & Object Destructuring',
      metaDesc: 'Unpack values from arrays and properties from objects into distinct variables with clean ES6 destructuring syntax.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Destructuring</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Destructuring allows you to extract data from arrays and objects into separate variables in a single step.</p>
        ${playground(`
const [first, second] = [10, 20];
const { x, y } = { x: 100, y: 200 };
console.log("Unpacked:", first, second, x, y);
        `, 'dest-1')}
      `
    },
    {
      slug: 'spread-rest',
      title: 'Spread Operator & Rest Parameters',
      metaDesc: 'Master the three dots (...) in JavaScript. Learn array copying, object merging, and variable function arguments.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Spread & Rest Operators</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">The three dots (...) act as either a spread operator or rest parameters depending on the context.</p>
        ${playground(`
const base = [1, 2];
const combined = [...base, 3, 4];
console.log("Combined:", combined);
        `, 'sr-1')}
      `
    },
    {
      slug: 'map-filter-reduce',
      title: 'Array Methods: Map, Filter, and Reduce',
      metaDesc: 'Write elegant, functional JavaScript using map, filter, and reduce to transform, select, and aggregate lists of data.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Map, Filter & Reduce</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Transform, filter, and compute aggregate metrics over arrays without manual for-loop iteration.</p>
        ${playground(`
const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
console.log("Doubled:", doubled);
console.log("Evens:", evens);
        `, 'mfr-1')}
      `
    },
    {
      slug: 'error-handling',
      title: 'Error Handling with Try/Catch/Finally',
      metaDesc: 'Build resilient web apps that fail gracefully using try, catch, finally, and custom throw Error statements.',
      category: 'Intermediate',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Error Handling</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Errors happen in every application. Try/catch blocks allow you to intercept errors gracefully without crashing the whole application.</p>
        ${playground(`
try {
  throw new Error("Simulated failure");
} catch (err) {
  console.log("Caught:", err.message);
}
        `, 'err-1')}
      `
    },
    {
      slug: 'todo-app',
      title: 'Practical Project: Building a Todo List App',
      metaDesc: 'Step-by-step tutorial building a complete vanilla JavaScript todo list app with DOM updates and persistent storage.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Building a Todo List App</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Put your JavaScript skills together to build a functional, persistent todo application.</p>
        ${playground(`
const todos = ["Learn JS", "Build tools"];
todos.push("Deploy online");
console.log("Active Todos:", todos.join(", "));
        `, 'todo-1')}
      `
    },
    {
      slug: 'calculator',
      title: 'Practical Project: Building a Calculator',
      metaDesc: 'Learn how to build a working calculator with JavaScript logic, button event handling, and display updates.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Building a Calculator</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Learn how to build a state-driven calculation engine with clean number formatting and operator management.</p>
        ${playground(`
const calc = (a, op, b) => op === "+" ? a + b : a * b;
console.log("5 + 7 =", calc(5, "+", 7));
console.log("3 * 4 =", calc(3, "*", 4));
        `, 'calc-1')}
      `
    },
    {
      slug: 'form-validation',
      title: 'Form Validation with Pure JavaScript',
      metaDesc: 'Validate email inputs, required fields, and passwords client-side with instant visual feedback and accessible error messages.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Form Validation</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Ensure data integrity before submitting forms by inspecting inputs with native JavaScript constraints.</p>
        ${playground(`
const email = "user@example.com";
const isValid = email.includes("@") && email.includes(".");
console.log("Is email valid?", isValid);
        `, 'fv-1')}
      `
    },
    {
      slug: 'dates',
      title: 'Working with Dates and Time',
      metaDesc: 'Master the Date object, timestamps, calculations, and internationalization formatting with Intl.DateTimeFormat.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Working with Dates</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Dates and times are common in web applications. Learn how to format and manipulate dates reliably.</p>
        ${playground(`
const now = new Date();
console.log("Current Year:", now.getFullYear());
console.log("ISO String:", now.toISOString());
        `, 'date-1')}
      `
    },
    {
      slug: 'regex',
      title: 'Regular Expressions (RegEx) Essentials',
      metaDesc: 'Learn pattern matching in JavaScript: test, match, replace, character classes, flags, and common patterns.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Regular Expressions</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Regular expressions are patterns used to match character combinations in strings.</p>
        ${playground(`
const pattern = /hello/i;
console.log("Matches 'HELLO'?", pattern.test("HELLO"));
        `, 'rx-1')}
      `
    },
    {
      slug: 'json',
      title: 'Working with JSON (Parse and Stringify)',
      metaDesc: 'Master JSON.parse and JSON.stringify for data transfer, deep cloning, and configuring web applications.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Working with JSON</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">JavaScript Object Notation (JSON) is the universal format for exchanging structured data across the web.</p>
        ${playground(`
const data = { id: 1, name: "Tools Shed" };
const jsonString = JSON.stringify(data);
console.log("JSON String:", jsonString);
        `, 'json-1')}
      `
    },
    {
      slug: 'timers',
      title: 'Timers: setTimeout, setInterval, and Debounce',
      metaDesc: 'Control execution timing with setTimeout and setInterval. Learn how to build debounce and throttle functions.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Timers & Timing</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Timers allow you to execute code after a specified delay or repeatedly on an interval.</p>
        ${playground(`
console.log("Timer scheduled: setTimeout runs asynchronously.");
        `, 'time-1')}
      `
    },
    {
      slug: 'classes',
      title: 'Object-Oriented JavaScript: ES6 Classes',
      metaDesc: 'Learn object-oriented programming with JavaScript classes, constructors, methods, inheritance, and static properties.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">ES6 Classes</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Classes provide a cleaner syntax for creating objects and dealing with inheritance in JavaScript.</p>
        ${playground(`
class Player {
  constructor(name) { this.name = name; }
  sayHello() { return "Hello from " + this.name; }
}
const p = new Player("Neo");
console.log(p.sayHello());
        `, 'cls-1')}
      `
    },
    {
      slug: 'modules',
      title: 'JavaScript Modules (import and export)',
      metaDesc: 'Organize code into reusable files using standard ES6 module imports, default exports, and named exports.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">JavaScript Modules</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Modules allow you to break large codebases into independent, reusable files.</p>
        ${playground(`
console.log("ES Modules preview: export const API = '...'; import { API } from './config.js';");
        `, 'mod-1')}
      `
    },
    {
      slug: 'debugging',
      title: 'Debugging JavaScript Like a Pro',
      metaDesc: 'Master browser developer tools, breakpoints, console.table, stack traces, and the debugger statement.',
      category: 'Practical',
      content: `
        <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Debugging JavaScript</h1>
        <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Every developer writes bugs. Great developers know how to diagnose and resolve them systematically.</p>
        ${playground(`
console.log("Debug message sample");
console.table([{ id: 1, tool: "Converter" }, { id: 2, tool: "Calculator" }]);
        `, 'debug-1')}
      `
    }
  ];

  const basics = jsGuides.filter(g => g.category === 'Basics');
  const intermediate = jsGuides.filter(g => g.category === 'Intermediate');
  const practical = jsGuides.filter(g => g.category === 'Practical');

  const renderCard = (g) => `
    <a href="/learn/javascript/${g.slug}" style="display: block; padding: 1.5rem; border: 1px solid var(--border); border-radius: 8px; text-decoration: none; color: inherit; background: var(--surface); transition: transform 0.2s, border-color 0.2s;">
      <h3 style="margin: 0 0 0.5rem 0; font-family: var(--serif); color: var(--btn-bg, #3b82f6);">${g.title}</h3>
      <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${g.metaDesc}</p>
    </a>
  `;

  // ─── JS HUB PAGE DATA ─────────────────────────────────────────────────────
  const jsHubCopySnippet = `// Modern JavaScript (ES2024+) Essential Syntax & Toolchain Cheat Sheet
// 1. Native Deep Clone
const deepCopy = structuredClone(state);

// 2. Immutable Array Operations
const sorted = list.toSorted((a, b) => a - b);
const replaced = list.with(0, 99);

// 3. Object HasOwn Guard
const hasKey = Object.hasOwn(dict, "key");

// 4. Nullish Coalescing & Optional Chaining
const theme = user?.preferences?.theme ?? "system";`;

  const jsHubTraps = [
    {
      title: "The 'JavaScript is Simple' Type Coercion Trap",
      desc: "Assuming JavaScript variables behave like typed languages leads to subtle runtime bugs. Operations like <code>[] + {}</code> returning <code>'[object Object]'</code> and <code>{} + []</code> returning <code>0</code> catch unprepared developers."
    },
    {
      title: "Modifying Built-in Prototypes",
      desc: "Extending built-in prototypes (e.g. <code>Array.prototype.customSort = ...</code>) creates catastrophic naming collisions with third-party libraries and future ECMAScript language specifications."
    },
    {
      title: "Memory Leaks from Uncleared Closures & Event Listeners",
      desc: "Holding references to DOM nodes inside long-lived closures or forgetting to remove event listeners on unmounted elements keeps entire page sections retained in browser heap memory."
    },
    {
      title: "Conflating Node.js Runtime APIs with Browser Web APIs",
      desc: "Attempting to use <code>window</code> or <code>document</code> in server-side Node.js, or <code>fs</code> and <code>Buffer</code> directly in browser code without a bundler, causes fatal runtime reference errors."
    },
    {
      title: "Neglecting Strict Mode in Global Scripts",
      desc: "Running non-module scripts without <code>'use strict';</code> allows accidental global variable leakage, silent assignment failures to read-only properties, and unsafe keyword usage."
    }
  ];

  const jsHubFaqs = [
    {
      q: "What is the best order to study this 30-part JavaScript curriculum?",
      a: "Progress through the 3 phases sequentially: master Basics (variables, primitives, control flow, functions, arrays, objects), tackle Intermediate (DOM manipulation, event listeners, fetch, async/await, storage), and finish with Practical projects (todo app, calculator, form validation, debugging)."
    },
    {
      q: "How long does it take to learn JavaScript thoroughly?",
      a: "With 1-2 hours of daily hands-on practice, most learners master core JavaScript fundamentals in 4-6 weeks and become comfortable building interactive web applications within 3 months."
    },
    {
      q: "Should I learn TypeScript instead of JavaScript?",
      a: "Learn JavaScript fundamentals first! TypeScript is a typed superset of JavaScript that compiles down to plain JavaScript. Understanding runtime JS semantics is essential for writing effective TypeScript."
    },
    {
      q: "Is vanilla JavaScript still relevant in an era of React and Vue?",
      a: "More than ever! High-performance web development (including Digital Tools Shed's sub-50ms tools) relies on pure vanilla JavaScript. Frameworks come and go, but the browser DOM and ECMAScript standards remain forever."
    },
    {
      q: "Where should I practice writing JavaScript code?",
      a: "Every guide in this curriculum includes an interactive in-browser playground where you can modify code and see stdout results instantly without installing anything."
    }
  ];

  const jsHubBody = `
    <div class="article-container" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
      <h1 style="font-family: var(--serif); text-align: center; margin-bottom: 0.5rem;">JavaScript Master Guide</h1>
      <p style="text-align: center; color: var(--text-muted); margin-bottom: 2rem;">From absolute basics to building production-ready apps with zero external dependencies.</p>
      
      ${renderCopyCard(jsHubCopySnippet, '📋 Copy Modern JavaScript ES2024+ Syntax Cheat Sheet', 'btnCopyJsHub')}

      <h2 style="font-family: var(--serif); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Basics (10 Guides)</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
        ${basics.map(renderCard).join('')}
      </div>

      <h2 style="font-family: var(--serif); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Intermediate (10 Guides)</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
        ${intermediate.map(renderCard).join('')}
      </div>

      <h2 style="font-family: var(--serif); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Practical Projects & Advanced (10 Guides)</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${practical.map(renderCard).join('')}
      </div>

      ${renderJsTraps(jsHubTraps)}
      ${renderJsFaqs(jsHubFaqs)}
      ${generateFaqSchema(jsHubFaqs, 'JavaScript Master Guide FAQs', `${DOMAIN}/learn/javascript/`)}

      ${playgroundScript}
    </div>
  `;

  writeFileSync(join(jsDist, 'index.html'), renderPage({
    title: 'Learn JavaScript: 30 Master Guides from Zero to Pro | Digital Tools Shed',
    metaDesc: 'A complete 30-guide curriculum for learning JavaScript from basics to practical projects with interactive in-browser playgrounds.',
    canonical: `${DOMAIN}/learn/javascript/`,
    bodyContent: jsHubBody,
    currentPath: '/learn/javascript/'
  }));

  // ─── MASTER LEARNING HUB (/learn/index.html) DATA ─────────────────────────
  const mainHubCopySnippet = `# Full-Stack Developer Environment Quickstart
# 1. Initialize Node.js ES Modules Project
npm init -y
npm pkg set type="module"

# 2. Install Professional Tooling
npm install -D typescript vitest prettier eslint

# 3. Verify Local Development Setup
node -v
npm -v`;

  const mainHubTraps = [
    {
      title: "The Tutorial Purgatory Loop Trap",
      desc: "Consuming endless video courses without building independent tools produces an illusion of skill. Proficiency comes exclusively from writing code, reading documentation, and debugging errors."
    },
    {
      title: "Framework-First Learning Mistake",
      desc: "Jumping into React, Next.js, or Spring Boot before understanding JavaScript/Java memory, event loops, and asynchronous I/O makes troubleshooting real-world issues nearly impossible."
    },
    {
      title: "Neglecting Core Web Vitals and Performance",
      desc: "Shipping massive multi-megabyte bundle sizes without code-splitting degrades user experience on mobile devices and damages Google search rankings."
    },
    {
      title: "Ignoring Automated Testing Until Production",
      desc: "Building applications without unit tests or automated linting creates brittle architectures that break unpredictably during team updates."
    },
    {
      title: "Confusing Client vs Server Execution Contexts",
      desc: "Attempting to access browser APIs on backend servers or exposing private database credentials in client-side bundles represents a fundamental architectural vulnerability."
    }
  ];

  const mainHubFaqs = [
    {
      q: "Which programming track should I start with at Digital Tools Shed?",
      a: "If your goal is interactive web design and frontend apps, start with JavaScript. If you want backend automation, data science, and AI pipelines, choose Python. If you want high-throughput enterprise systems or Minecraft modding, choose Java."
    },
    {
      q: "Are the tutorials and interactive playgrounds free?",
      a: "Yes! All tutorials, guides, and interactive sandbox environments on Digital Tools Shed are 100% free with zero registration, zero tracking, and zero CDN dependencies."
    },
    {
      q: "Do I need to install any software to start learning?",
      a: "No! All code examples can be run, edited, and simulated directly inside your browser with sub-50ms response times."
    },
    {
      q: "How are these educational tracks kept up to date?",
      a: "All code snippets, syntax guides, and fatal trap sections are maintained to the latest standards (ECMAScript 2024+, Python 3.12+, JDK 21 LTS)."
    },
    {
      q: "How can I test what I've learned?",
      a: "Each track includes hands-on challenges, practical project guides (like todo apps, calculators, item registries), and interactive sandbox playgrounds."
    }
  ];

  const mainHubBody = `
    <div class="article-container" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
      <h1 style="font-family: var(--serif); text-align: center; margin-bottom: 0.5rem;">Learning Hub</h1>
      <p style="text-align: center; color: var(--text-muted); margin-bottom: 2rem;">Master the programming languages of the web, cloud, and enterprise.</p>
      
      ${renderCopyCard(mainHubCopySnippet, '📋 Copy Full-Stack Developer Environment Quickstart', 'btnCopyMainHub')}

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <a href="/learn/javascript/" style="display: block; padding: 2rem; border: 1px solid var(--border); border-radius: 8px; text-decoration: none; color: inherit; background: var(--surface); text-align: center; transition: transform 0.2s;">
          <div style="font-size: 3rem; margin-bottom: 1rem; color: #f7df1e;">&#9889;</div>
          <h2 style="margin: 0 0 0.5rem 0; font-family: var(--serif);">JavaScript</h2>
          <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">The programming language of the web. Start from zero and build interactive apps.</p>
          <div style="margin-top: 1.5rem; font-weight: 600; color: var(--btn-bg, #3b82f6);">Explore 30 Guides &rarr;</div>
        </a>

        <a href="/learn/python/" style="display: block; padding: 2rem; border: 1px solid var(--border); border-radius: 8px; text-decoration: none; color: inherit; background: var(--surface); text-align: center; transition: transform 0.2s;">
          <div style="font-size: 3rem; margin-bottom: 1rem; color: #3b82f6;">🐍</div>
          <h2 style="margin: 0 0 0.5rem 0; font-family: var(--serif);">Python</h2>
          <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">Clean, readable programming for automation, data processing, algorithms, and scripting.</p>
          <div style="margin-top: 1.5rem; font-weight: 600; color: var(--btn-bg, #3b82f6);">Explore 20 Guides &rarr;</div>
        </a>

        <a href="/learn/java/" style="display: block; padding: 2rem; border: 1px solid var(--border); border-radius: 8px; text-decoration: none; color: inherit; background: var(--surface); text-align: center; transition: transform 0.2s;">
          <div style="font-size: 3rem; margin-bottom: 1rem; color: #ef4444;">☕</div>
          <h2 style="margin: 0 0 0.5rem 0; font-family: var(--serif);">Java</h2>
          <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">From variables to JVM memory, optimization, what NOT to do, and Minecraft modding.</p>
          <div style="margin-top: 1.5rem; font-weight: 600; color: var(--btn-bg, #3b82f6);">Explore 10 Guides + Playground &rarr;</div>
        </a>
      </div>

      ${renderJsTraps(mainHubTraps)}
      ${renderJsFaqs(mainHubFaqs)}
      ${generateFaqSchema(mainHubFaqs, 'Digital Tools Shed Learning Hub FAQs', `${DOMAIN}/learn/`)}

      ${playgroundScript}
    </div>
  `;

  writeFileSync(join(learnDist, 'index.html'), renderPage({
    title: 'Learn Web Development, Python & Java | Digital Tools Shed',
    metaDesc: 'Explore our comprehensive learning hub and master modern web development, Python scripting, and Java engineering.',
    canonical: `${DOMAIN}/learn/`,
    bodyContent: mainHubBody,
    currentPath: '/learn/'
  }));

  // ─── RENDER INDIVIDUAL JAVASCRIPT GUIDE PAGES ─────────────────────────────
  for (const guide of jsGuides) {
    const meta = JS_METADATA[guide.slug] || {
      copySnippet: `// ${guide.title}\nconsole.log("Exploring ${guide.title}");`,
      copyLabel: `📋 Copy ${guide.title} Snippet`,
      traps: [
        { title: "Unchecked Execution", desc: "Always check types and validate input before calling methods." },
        { title: "Scope Leaks", desc: "Always use let and const rather than legacy var declarations." },
        { title: "Implicit Coercion", desc: "Enforce strict equality (===) to prevent unexpected type coercion." },
        { title: "Uncaught Errors", desc: "Wrap risky runtime operations in try...catch blocks." },
        { title: "State Desync", desc: "Keep data models isolated from presentation rendering logic." }
      ],
      faqs: [
        { q: `What is the core benefit of ${guide.title}?`, a: `It provides fundamental building blocks for writing robust, performant JavaScript.` },
        { q: `How does this topic apply to modern web development?`, a: `It allows developers to manipulate data and interface elements cleanly and efficiently.` },
        { q: `What is the most common mistake beginners make with ${guide.title}?`, a: `Assuming JavaScript behaves like other languages without checking type coercion and scoping.` },
        { q: `How can I practice ${guide.title}?`, a: `Use the interactive playground included on this page to test custom inputs.` },
        { q: `Where can I find advanced patterns for ${guide.title}?`, a: `Explore the related practical guides in the navigation menu below.` }
      ]
    };

    const guideBody = `
      <div class="article-container" style="max-width: 800px; margin: 0 auto; padding: 2rem 1rem;">
        <nav style="margin-bottom: 2rem; font-size: 0.9rem; color: var(--text-muted);">
          <a href="/" style="color: inherit; text-decoration: none;">Home</a> &gt; 
          <a href="/learn/" style="color: inherit; text-decoration: none;">Learn</a> &gt; 
          <a href="/learn/javascript/" style="color: inherit; text-decoration: none;">JavaScript</a> &gt; 
          <span style="color: var(--fg);">${guide.title}</span>
        </nav>
        
        <article>
          ${guide.content}
        </article>

        ${renderCopyCard(meta.copySnippet, meta.copyLabel, `btnCopy_${guide.slug.replace(/[^a-zA-Z0-9]/g, '_')}`)}
        ${renderJsTraps(meta.traps)}
        ${renderJsFaqs(meta.faqs)}
        ${generateFaqSchema(meta.faqs, `${guide.title} FAQs`, `${DOMAIN}/learn/javascript/${guide.slug}`)}

        <div style="border-top: 1px solid var(--border); margin-top: 3rem; padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <a href="/learn/javascript/" class="btn-sec" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">&larr; JavaScript Hub</a>
          <a href="/learn/" class="btn-primary" style="text-decoration: none; padding: 0.4rem 0.8rem; font-size: 0.85rem;">All Learn Tracks &rarr;</a>
        </div>
        
        ${playgroundScript}
      </div>
    `;
    
    writeFileSync(join(jsDist, `${guide.slug}.html`), renderPage({
      title: `${guide.title} | Digital Tools Shed`,
      metaDesc: guide.metaDesc,
      canonical: `${DOMAIN}/learn/javascript/${guide.slug}`,
      bodyContent: guideBody,
      currentPath: `/learn/javascript/${guide.slug}`
    }));
  }

  console.log(`  ✓ Built Learn Section (${jsGuides.length} JavaScript guides in /learn/javascript/)`);
}
