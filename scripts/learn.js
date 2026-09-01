export function buildLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
    // Note: Assuming DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir are available globally
    // We will assume they are globals.
    const learnDist = join(DIST, 'learn');
    const jsDist = join(learnDist, 'javascript');
    ensureDir(learnDist);
    ensureDir(jsDist);

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
        document.addEventListener('DOMContentLoaded', () => {
          document.querySelectorAll('textarea[id^="pg-code-"]').forEach(ta => ta.setAttribute('data-original', ta.value));
        });
      </script>
    `;

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

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create a <code>const</code> variable with your favorite color and log it.</p>
            <p><strong>Challenge 2:</strong> Create a <code>let</code> variable called <code>counter</code>, set it to 1, then update it to 2 and log it.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/strings">Strings & String Methods</a></li>
            <li><a href="/learn/javascript/numbers">Numbers & Math</a></li>
          </ul>
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

          <h2 style="font-family: var(--serif); margin-top: 2rem;">String Methods</h2>
          <p>Strings come with built-in functions (methods) to manipulate them, like changing case or extracting parts.</p>
          ${playground(`
const msg = "  Hello World!  ";
console.log(msg.trim()); // Removes spaces
console.log(msg.toUpperCase());
console.log(msg.slice(2, 7)); // "Hello"
console.log(msg.replace("World", "Friend"));
          `, 'str-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create a variable containing the string "javascript" and use a method to make it uppercase.</p>
            <p><strong>Challenge 2:</strong> Find the length of the string "Supercalifragilisticexpialidocious".</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/template-literals">Template Literals</a></li>
            <li><a href="/learn/javascript/variables">Variables</a></li>
          </ul>
        `
      },
      {
        slug: 'numbers',
        title: 'Numbers & Math',
        metaDesc: 'Learn how to work with numbers, perform arithmetic, and use the built-in Math object in JavaScript.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Numbers & Math</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Unlike some languages, JavaScript only has one Number type for both integers and decimals. Let's see how to do math with them.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Basic Arithmetic</h2>
          <p>You can use standard operators: <code>+</code> (add), <code>-</code> (subtract), <code>*</code> (multiply), <code>/</code> (divide), and <code>%</code> (modulo/remainder).</p>
          ${playground(`
let apples = 10;
let oranges = 5;
console.log("Total fruit:", apples + oranges);
console.log("Apples divided by 3 remainder:", apples % 3);
          `, 'num-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">The Math Object</h2>
          <p>The <code>Math</code> object provides advanced mathematical operations and constants.</p>
          ${playground(`
console.log(Math.PI);
console.log(Math.round(4.6)); // 5
console.log(Math.floor(4.9)); // 4
console.log(Math.max(10, 20, 5)); // 20
console.log(Math.random()); // Random between 0 and 1
          `, 'num-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Generate a random number between 1 and 10.</p>
            <p><strong>Challenge 2:</strong> Calculate the area of a circle with radius 5 (Area = PI * radius * radius).</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/booleans">Booleans</a></li>
          </ul>
        `
      },
      {
        slug: 'booleans',
        title: 'Booleans & Comparisons',
        metaDesc: 'Understand true/false values, equality checks, and logical operators in JavaScript.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Booleans & Comparisons</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Booleans are simple: they are either <code>true</code> or <code>false</code>. They are the foundation of logic in your code.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Comparison Operators</h2>
          <p>We generate booleans by comparing things. Always use <code>===</code> (strict equality) instead of <code>==</code> to avoid weird type conversions.</p>
          ${playground(`
const age = 18;
console.log(age === 18); // true
console.log(age > 20);   // false
console.log(age <= 18);  // true
console.log(age !== 10); // true (not equal)
          `, 'bool-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Logical Operators</h2>
          <p>You can combine conditions using AND (<code>&&</code>), OR (<code>||</code>), and NOT (<code>!</code>).</p>
          ${playground(`
const isWeekend = true;
const isSunny = false;

console.log("Beach day?", isWeekend && isSunny); // AND
console.log("Relaxing?", isWeekend || isSunny);  // OR
console.log("Is NOT sunny?", !isSunny);          // NOT
          `, 'bool-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write an expression that checks if a number <code>n</code> is between 10 and 20.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/conditionals">Conditionals</a></li>
          </ul>
        `
      },
      {
        slug: 'conditionals',
        title: 'If/Else & Conditionals',
        metaDesc: 'Control the flow of your JavaScript programs using if statements, else branches, and switch cases.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Conditionals</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Conditionals allow your code to make decisions. They run different blocks of code based on whether a boolean condition is true or false.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">If / Else Statements</h2>
          <p>The most common conditional is the <code>if</code> statement. You can chain multiple conditions with <code>else if</code>.</p>
          ${playground(`
const temperature = 15;

if (temperature > 25) {
  console.log("It's hot outside!");
} else if (temperature > 10) {
  console.log("It's pleasant.");
} else {
  console.log("It's cold.");
}
          `, 'cond-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Ternary Operator</h2>
          <p>A compact way to write simple if/else statements. Format: <code>condition ? ifTrue : ifFalse</code>.</p>
          ${playground(`
const age = 20;
const status = age >= 18 ? "Adult" : "Minor";
console.log(status);
          `, 'cond-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write an if statement that logs "Even" if a number is even, and "Odd" otherwise. (Hint: use <code>% 2</code>)</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/booleans">Booleans</a></li>
            <li><a href="/learn/javascript/for-loops">For Loops</a></li>
          </ul>
        `
      },
      {
        slug: 'for-loops',
        title: 'For Loops',
        metaDesc: 'Run a block of code multiple times. Learn standard for loops and for...of loops in JavaScript.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">For Loops</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Loops are used to repeat tasks without repeating code. The <code>for</code> loop is great when you know how many times you want to loop.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">The Standard For Loop</h2>
          <p>A for loop has three parts: initializer (runs once), condition (checked before each run), and incrementor (runs after each run).</p>
          ${playground(`
for (let i = 1; i <= 5; i++) {
  console.log("Iteration:", i);
}
          `, 'for-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Looping Arrays</h2>
          <p>Loops are incredibly useful for going through lists (arrays). You can use a modern <code>for...of</code> loop for a cleaner syntax.</p>
          ${playground(`
const colors = ["red", "green", "blue"];

for (const color of colors) {
  console.log(color);
}
          `, 'for-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write a loop that counts down from 10 to 1.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/while-loops">While Loops</a></li>
            <li><a href="/learn/javascript/arrays">Arrays</a></li>
          </ul>
        `
      },
      {
        slug: 'while-loops',
        title: 'While Loops',
        metaDesc: 'Repeat code as long as a condition remains true using JavaScript while loops.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">While Loops</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">A <code>while</code> loop keeps running a block of code as long as its condition is true. Be careful not to create infinite loops!</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Basic While Loop</h2>
          <p>You must ensure the condition eventually becomes false, usually by updating a variable inside the loop.</p>
          ${playground(`
let count = 3;

while (count > 0) {
  console.log(count);
  count--; // Decrement to avoid infinite loop
}
console.log("Liftoff!");
          `, 'while-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Do...While Loop</h2>
          <p>A <code>do...while</code> loop guarantees the code runs at least once, because the condition is checked <em>after</em> the loop runs.</p>
          ${playground(`
let x = 10;
do {
  console.log("This runs once even though x is not less than 5");
  x++;
} while (x < 5);
          `, 'while-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write a while loop that doubles a number starting from 1 until it's greater than 100.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/for-loops">For Loops</a></li>
          </ul>
        `
      },
      {
        slug: 'functions',
        title: 'Functions',
        metaDesc: 'Learn how to write reusable blocks of code in JavaScript using function declarations and arrow functions.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Functions</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Functions are reusable blocks of code. You define them once, and can "call" them many times with different inputs.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Function Declarations</h2>
          <p>A basic function takes inputs (parameters), does something, and returns an output.</p>
          ${playground(`
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Alice"));
console.log(greet("Bob"));
          `, 'fn-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Arrow Functions</h2>
          <p>Introduced in ES6, arrow functions provide a shorter syntax and are commonly used for passing functions as arguments.</p>
          ${playground(`
const multiply = (a, b) => {
  return a * b;
};

// Implicit return (even shorter!)
const square = x => x * x;

console.log(multiply(4, 5));
console.log(square(6));
          `, 'fn-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write a function <code>isEven</code> that takes a number and returns true if it's even, false otherwise.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/arrays">Arrays</a></li>
            <li><a href="/learn/javascript/map-filter-reduce">Map, Filter, Reduce</a></li>
          </ul>
        `
      },
      {
        slug: 'arrays',
        title: 'Arrays & Array Methods',
        metaDesc: 'Store lists of data in JavaScript using arrays. Learn how to add, remove, and access array items.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Arrays & Array Methods</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Arrays are ordered lists of data. They let you group multiple values into a single variable.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Creating and Accessing Arrays</h2>
          <p>Arrays are zero-indexed, meaning the first item is at position 0.</p>
          ${playground(`
const fruits = ["Apple", "Banana", "Cherry"];
console.log(fruits[0]); // Apple
console.log(fruits.length); // 3
          `, 'arr-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Modifying Arrays</h2>
          <p>You can add and remove items using built-in methods like <code>push()</code> (add to end) and <code>pop()</code> (remove from end).</p>
          ${playground(`
const tasks = ["Learn JS"];
tasks.push("Build app"); // Adds to end
console.log(tasks);

const lastTask = tasks.pop(); // Removes and returns last
console.log("Removed:", lastTask);
console.log(tasks);
          `, 'arr-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create an array of three numbers, add a fourth number using push, then log the array.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/objects">Objects</a></li>
            <li><a href="/learn/javascript/map-filter-reduce">Map, Filter, Reduce</a></li>
          </ul>
        `
      },
      {
        slug: 'objects',
        title: 'Objects',
        metaDesc: 'Organize related data using JavaScript objects. Learn about properties, keys, and values.',
        category: 'Basics',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Objects</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Objects are collections of key-value pairs. While arrays are good for ordered lists, objects are perfect for describing complex entities.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Creating Objects</h2>
          <p>You access an object's properties using dot notation (<code>.</code>) or bracket notation (<code>[]</code>).</p>
          ${playground(`
const user = {
  name: "Alice",
  age: 28,
  isAdmin: true
};

console.log(user.name);
console.log(user["age"]); // Useful if key is dynamic
          `, 'obj-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Updating Objects</h2>
          <p>You can easily add new properties or update existing ones, even if the object was declared with <code>const</code>.</p>
          ${playground(`
const car = { make: "Toyota", model: "Corolla" };
car.year = 2022; // Adding new property
car.model = "Camry"; // Updating
console.log(car);
          `, 'obj-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create an object representing a book with title, author, and pages properties.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/destructuring">Destructuring</a></li>
            <li><a href="/learn/javascript/json">JSON</a></li>
          </ul>
        `
      },
      {
        slug: 'dom',
        title: 'DOM Manipulation',
        metaDesc: 'Learn how to interact with HTML elements dynamically using JavaScript and the Document Object Model.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">DOM Manipulation</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">The Document Object Model (DOM) is JavaScript's representation of your HTML page. You can use JS to change content, styles, and structure on the fly.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Selecting Elements</h2>
          <p><code>document.querySelector</code> is the most versatile way to find elements, using CSS selectors.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
const title = document.querySelector('h1');
const buttons = document.querySelectorAll('.btn'); // Gets all
const specificId = document.getElementById('my-div');
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Modifying Elements</h2>
          <p>Once you select an element, you can change its text, HTML, styles, or classes.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
const box = document.querySelector('.box');
box.textContent = "New Text!";
box.style.backgroundColor = "blue";
box.classList.add('active');
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Use DevTools to select the h1 on this page and change its color to red.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/events">Event Listeners</a></li>
          </ul>
        `
      },
      {
        slug: 'events',
        title: 'Event Listeners',
        metaDesc: 'Make your web pages interactive by responding to user clicks, keyboard presses, and other events.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Event Listeners</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Events are things that happen in the browser—like clicks, scrolls, or keystrokes. Event listeners let JavaScript react to them.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Adding an Event Listener</h2>
          <p>You attach an event listener to a DOM element, specifying the event type and a function to run.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
const button = document.querySelector('#myButton');

button.addEventListener('click', function(event) {
  console.log("Button was clicked!");
  // 'event' contains data about the click
});
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Input Events</h2>
          <p>You can listen to input fields to get user text as they type.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
const input = document.querySelector('input');
input.addEventListener('input', (e) => {
  console.log("Current value:", e.target.value);
});
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Add a click listener to the window object that logs "Clicked!" anywhere on the page.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/dom">DOM Manipulation</a></li>
          </ul>
        `
      },
      {
        slug: 'fetch',
        title: 'Fetch API & HTTP Requests',
        metaDesc: 'Learn how to load data from APIs and servers using JavaScript Fetch API.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Fetch API & HTTP Requests</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">The Fetch API allows your browser to request data from servers and APIs without reloading the page.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Basic Fetch Request</h2>
          <p>Fetch uses Promises. You call <code>fetch()</code>, then use <code>.then()</code> to handle the response when it arrives.</p>
          ${playground(`
// Fetching a random fake post
fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json()) // Parse JSON
  .then(data => {
    console.log("Title:", data.title);
  });
          `, 'fetch-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Modify the code above to fetch user number 2 from <code>https://jsonplaceholder.typicode.com/users/2</code> and log their name.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/async-await">Promises & Async/Await</a></li>
            <li><a href="/learn/javascript/json">JSON</a></li>
          </ul>
        `
      },
      {
        slug: 'async-await',
        title: 'Promises & Async/Await',
        metaDesc: 'Write cleaner asynchronous JavaScript code using async and await keywords.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Promises & Async/Await</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Async/Await is a modern syntax built on top of Promises. It makes asynchronous code look and behave a bit more like synchronous code.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Using Async / Await</h2>
          <p>Put <code>async</code> in front of a function, and you can use <code>await</code> inside it to pause execution until a Promise resolves.</p>
          ${playground(`
async function getUser() {
  console.log("Fetching...");
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  const user = await response.json();
  console.log("Got user:", user.name);
}

getUser();
          `, 'async-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write an async function that fetches a joke from an API (e.g., try finding a public joke API online) or just fetch a post from jsonplaceholder.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/fetch">Fetch API</a></li>
            <li><a href="/learn/javascript/error-handling">Error Handling</a></li>
          </ul>
        `
      },
      {
        slug: 'localstorage',
        title: 'Local Storage',
        metaDesc: 'Save data in the browser so it persists after refreshing or closing the tab using localStorage.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Local Storage</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Local Storage lets you save key/value pairs in the user's browser. Data survives page refreshes and browser restarts.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Saving and Loading Data</h2>
          <p>Data must be stored as strings. Use <code>setItem</code> and <code>getItem</code>.</p>
          ${playground(`
// Save data
localStorage.setItem('theme', 'dark');

// Read data
const currentTheme = localStorage.getItem('theme');
console.log("Theme is:", currentTheme);

// Clear specific item
localStorage.removeItem('theme');
          `, 'ls-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Save a username to local storage, retrieve it, and log it.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/json">JSON</a></li>
          </ul>
        `
      },
      {
        slug: 'template-literals',
        title: 'Template Literals',
        metaDesc: 'Use template literals (backticks) to inject variables into strings easily in JavaScript.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Template Literals</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Template literals use backticks (\`) instead of quotes. They allow multi-line strings and easy string interpolation.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">String Interpolation</h2>
          <p>Instead of using <code>+</code> to combine strings and variables, use <code>\${variable}</code> inside backticks.</p>
          ${playground(`
const name = "Alice";
const age = 28;

// Old way: "Name: " + name + ", Age: " + age
const greeting = \`Name: \${name}, Age: \${age}\`;
console.log(greeting);

// Multi-line works too!
const html = \`
  <div>
    <h1>\${name}</h1>
  </div>
\`;
console.log(html);
          `, 'tpl-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create a template literal that calculates math inside the \${} block, like \${5 * 10}.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/strings">Strings</a></li>
          </ul>
        `
      },
      {
        slug: 'destructuring',
        title: 'Destructuring',
        metaDesc: 'Extract values from arrays or properties from objects into distinct variables concisely.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Destructuring</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Destructuring is a convenient syntax for extracting values from arrays or objects into distinct variables.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Object Destructuring</h2>
          <p>Extract properties by their names.</p>
          ${playground(`
const user = { id: 1, name: "Bob", role: "Admin" };

const { name, role } = user;
console.log(name, role);
          `, 'dest-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Array Destructuring</h2>
          <p>Extract values by their position.</p>
          ${playground(`
const rgb = [255, 128, 0];

const [red, green, blue] = rgb;
console.log("Green value:", green);
          `, 'dest-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create an object with 3 properties, then destructure two of them into variables.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/objects">Objects</a></li>
            <li><a href="/learn/javascript/spread-rest">Spread & Rest</a></li>
          </ul>
        `
      },
      {
        slug: 'spread-rest',
        title: 'Spread & Rest Operators',
        metaDesc: 'Use the ... syntax to spread arrays and objects, or to gather remaining arguments into an array.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Spread & Rest Operators</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">The <code>...</code> syntax does two different things depending on context: spreading elements apart, or resting/gathering them together.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Spread (Arrays & Objects)</h2>
          <p>Used to copy or merge arrays and objects.</p>
          ${playground(`
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4];
console.log("Spread array:", arr2);

const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 };
console.log("Spread object:", obj2);
          `, 'spr-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Rest (Function Parameters)</h2>
          <p>Used in function definitions to gather varying numbers of arguments into an array.</p>
          ${playground(`
function sumAll(...numbers) {
  let total = 0;
  for (let n of numbers) total += n;
  return total;
}

console.log(sumAll(1, 2, 3, 4));
          `, 'spr-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Combine two arrays using the spread operator.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/destructuring">Destructuring</a></li>
          </ul>
        `
      },
      {
        slug: 'map-filter-reduce',
        title: 'Map, Filter, Reduce',
        metaDesc: 'Transform arrays cleanly using functional array methods: map, filter, and reduce.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Map, Filter, Reduce</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">These three array methods are essential for working with data. They process arrays without mutating the original.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Map (Transform)</h2>
          <p>Creates a new array by applying a function to every element.</p>
          ${playground(`
const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);
console.log("Map:", doubled);
          `, 'mfr-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Filter (Select)</h2>
          <p>Creates a new array containing only elements that pass a test condition.</p>
          ${playground(`
const ages = [12, 18, 25, 8];
const adults = ages.filter(age => age >= 18);
console.log("Filter:", adults);
          `, 'mfr-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Reduce (Accumulate)</h2>
          <p>Reduces an array to a single value (like a sum or a single object).</p>
          ${playground(`
const prices = [10, 20, 30];
const total = prices.reduce((acc, current) => acc + current, 0);
console.log("Reduce:", total);
          `, 'mfr-3')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Use <code>filter</code> to keep only even numbers from an array: <code>[1, 2, 3, 4, 5]</code>.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/arrays">Arrays</a></li>
          </ul>
        `
      },
      {
        slug: 'error-handling',
        title: 'Error Handling (try/catch)',
        metaDesc: 'Prevent crashes and handle exceptions gracefully using try, catch, and finally blocks.',
        category: 'Intermediate',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Error Handling</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Sometimes code fails. Network requests fail, data is malformed. Try/catch prevents these errors from crashing your app.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Try / Catch</h2>
          <p>Wrap risky code in <code>try</code>. If it throws an error, the <code>catch</code> block runs.</p>
          ${playground(`
try {
  // Purposefully causing an error
  nonExistentFunction();
} catch (error) {
  console.log("Caught an error:", error.message);
}
console.log("App keeps running!");
          `, 'err-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Throwing Errors</h2>
          <p>You can create your own errors if invalid data is provided to a function.</p>
          ${playground(`
function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (e) {
  console.log("Handled:", e.message);
}
          `, 'err-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write a function that parses JSON string, wrap <code>JSON.parse</code> in try/catch to handle bad JSON gracefully.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/async-await">Async/Await</a></li>
          </ul>
        `
      },
      {
        slug: 'todo-app',
        title: 'Build a To-Do App',
        metaDesc: 'Combine DOM manipulation, events, and arrays to build a functional to-do list in JavaScript.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Build a To-Do App</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Let's apply what we've learned by building the classic JavaScript project: a To-Do App.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">The Logic</h2>
          <p>A to-do app needs an array to store tasks, an input field to get new tasks, a button to add them, and a function to render the array to the DOM.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
const tasks = [];
const input = document.querySelector('#taskInput');
const btn = document.querySelector('#addBtn');
const list = document.querySelector('#taskList');

btn.addEventListener('click', () => {
  const text = input.value;
  if (!text) return;
  
  tasks.push(text);
  input.value = '';
  render();
});

function render() {
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task;
    list.appendChild(li);
  });
}
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Add a "delete" button next to each rendered task.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/dom">DOM Manipulation</a></li>
            <li><a href="/learn/javascript/arrays">Arrays</a></li>
          </ul>
        `
      },
      {
        slug: 'calculator',
        title: 'Build a Calculator',
        metaDesc: 'Learn state management and math logic by creating a simple interactive calculator.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Build a Calculator</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Building a calculator teaches you how to maintain "state" (current numbers, selected operator) and respond to multiple buttons.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Handling State</h2>
          <p>You need variables to keep track of the first number, the operator, and the second number being built.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
let display = '0';
let pendingOp = null;
let firstOperand = null;

function handleNumber(numStr) {
  if (display === '0') display = numStr;
  else display += numStr;
  updateDisplay();
}

function handleOperator(op) {
  firstOperand = parseFloat(display);
  pendingOp = op;
  display = '0';
}
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Implement an <code>equals()</code> function that looks at <code>firstOperand</code>, <code>pendingOp</code>, and the current display, and calculates the result.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/numbers">Numbers & Math</a></li>
          </ul>
        `
      },
      {
        slug: 'form-validation',
        title: 'Form Validation',
        metaDesc: 'Ensure user input is correct before submitting data to a server using JavaScript form validation.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Form Validation</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Never trust user input! JavaScript allows you to validate emails, passwords, and other inputs instantly before sending them to a server.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Intercepting Submit</h2>
          <p>Listen for the <code>submit</code> event on the form, and use <code>e.preventDefault()</code> to stop the page from reloading.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
const form = document.querySelector('#myForm');
const emailInput = document.querySelector('#email');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Stop reload
  
  if (!emailInput.value.includes('@')) {
    alert("Please enter a valid email.");
    return;
  }
  
  console.log("Form is valid! Sending data...");
});
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Add validation to ensure a password input is at least 8 characters long.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/events">Events</a></li>
            <li><a href="/learn/javascript/regex">Regex</a></li>
          </ul>
        `
      },
      {
        slug: 'dates',
        title: 'Working with Dates',
        metaDesc: 'Create, manipulate, and format dates and times using the built-in Date object.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Working with Dates</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">The JavaScript <code>Date</code> object lets you work with dates and times.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Creating Dates</h2>
          <p>Get the current date/time, or parse a specific date string.</p>
          ${playground(`
const now = new Date();
console.log(now.toString());

const specific = new Date('2025-01-01');
console.log(specific.getFullYear()); // 2025
          `, 'date-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Formatting Dates</h2>
          <p>Use Intl.DateTimeFormat for localized formatting.</p>
          ${playground(`
const d = new Date();
const formatted = new Intl.DateTimeFormat('en-US', { 
  dateStyle: 'full' 
}).format(d);

console.log(formatted);
          `, 'date-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Find a way to print only the current hour and minute.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/timers">Timers</a></li>
          </ul>
        `
      },
      {
        slug: 'regex',
        title: 'Regular Expressions',
        metaDesc: 'Match complex string patterns using regular expressions (Regex) in JavaScript.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Regular Expressions</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Regular Expressions (regex) are powerful patterns used to match character combinations in strings. Great for searching and validation.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Regex Syntax</h2>
          <p>Regex patterns are enclosed in slashes <code>/pattern/</code>. The <code>test()</code> method returns true if a match is found.</p>
          ${playground(`
const emailPattern = /.+@.+\\..+/;
console.log(emailPattern.test("test@example.com")); // true
console.log(emailPattern.test("bad-email")); // false
          `, 'rx-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Replacing with Regex</h2>
          <p>You can use regex with string <code>replace()</code> to replace all occurrences (using the <code>g</code> global flag).</p>
          ${playground(`
const text = "apples are great, apples are tasty.";
// Replace all 'apples' with 'oranges'
const newText = text.replace(/apples/g, "oranges");
console.log(newText);
          `, 'rx-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Write a regex to check if a string contains only numbers.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/strings">Strings</a></li>
            <li><a href="/learn/javascript/form-validation">Form Validation</a></li>
          </ul>
        `
      },
      {
        slug: 'json',
        title: 'JSON Parse & Stringify',
        metaDesc: 'Convert JavaScript objects to and from JSON strings to communicate with APIs and local storage.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">JSON Parse & Stringify</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">JSON (JavaScript Object Notation) is the standard format for sending data across the web. It looks like JS objects, but it's just a text string.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Stringify (Object -> String)</h2>
          <p>Before saving to localStorage or sending to an API, convert JS objects to strings.</p>
          ${playground(`
const user = { name: "Alice", active: true };
const jsonString = JSON.stringify(user);

console.log(typeof jsonString); // "string"
console.log(jsonString);
          `, 'json-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Parse (String -> Object)</h2>
          <p>When you receive JSON text, convert it back into a usable JS object.</p>
          ${playground(`
const rawData = '{"score": 100, "level": 5}';
const obj = JSON.parse(rawData);

console.log(obj.score); // 100
          `, 'json-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create an array of strings, stringify it, then parse it back.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/objects">Objects</a></li>
            <li><a href="/learn/javascript/fetch">Fetch API</a></li>
          </ul>
        `
      },
      {
        slug: 'timers',
        title: 'Timers: setTimeout & setInterval',
        metaDesc: 'Delay execution or run code repeatedly on an interval using JavaScript timer functions.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Timers (setTimeout & setInterval)</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Sometimes you want code to run after a delay, or repeatedly over time. JavaScript provides built-in timer functions.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">setTimeout</h2>
          <p>Runs a function ONCE after a specified delay in milliseconds.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
setTimeout(() => {
  console.log("2 seconds have passed!");
}, 2000);
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">setInterval</h2>
          <p>Runs a function REPEATEDLY, waiting a specific time between each run. You can stop it using <code>clearInterval</code>.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(count);
  if (count === 5) {
    clearInterval(intervalId); // Stops the timer
  }
}, 1000);
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create a countdown that prints 3, 2, 1, then "Go!", one second apart.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/dates">Dates</a></li>
          </ul>
        `
      },
      {
        slug: 'classes',
        title: 'Classes & OOP',
        metaDesc: 'Organize your code using Object-Oriented Programming principles with JavaScript classes.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Classes & OOP</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Classes are blueprints for creating objects with shared properties and methods. They introduce Object-Oriented Programming to JS.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Creating a Class</h2>
          <p>The <code>constructor</code> method runs when a new instance is created via the <code>new</code> keyword.</p>
          ${playground(`
class Animal {
  constructor(name, sound) {
    this.name = name;
    this.sound = sound;
  }
  
  speak() {
    return \`\${this.name} says \${this.sound}\`;
  }
}

const dog = new Animal("Rex", "Woof");
console.log(dog.speak());
          `, 'class-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Inheritance</h2>
          <p>Classes can extend other classes to inherit their methods.</p>
          ${playground(`
class Cat extends Animal {
  constructor(name) {
    super(name, "Meow"); // Calls parent constructor
  }
}

const fluffy = new Cat("Fluffy");
console.log(fluffy.speak());
          `, 'class-2')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Create a <code>Car</code> class with make and model, and a <code>drive()</code> method.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/objects">Objects</a></li>
          </ul>
        `
      },
      {
        slug: 'modules',
        title: 'Modules (import/export)',
        metaDesc: 'Split your JavaScript code into multiple files using ES6 modules (import and export).',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Modules</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">As your app grows, you shouldn't keep all code in one file. Modules let you share code between files.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Exporting Code</h2>
          <p>You can export variables, functions, or classes from a file (e.g., <code>math.js</code>).</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
// math.js
export const pi = 3.14159;

export function add(a, b) {
  return a + b;
}

// Default export
export default function multiply(a, b) {
  return a * b;
}
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Importing Code</h2>
          <p>Bring the exported code into another file (e.g., <code>main.js</code>).</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
// main.js
import multiply, { pi, add } from './math.js';

console.log(add(2, 3));
console.log(multiply(4, 5));
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Note:</strong> Modules only work on the web if you use <code>&lt;script type="module"&gt;</code> in your HTML.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/classes">Classes</a></li>
          </ul>
        `
      },
      {
        slug: 'debugging',
        title: 'Debugging Tips',
        metaDesc: 'Learn strategies and tools for finding and fixing bugs in your JavaScript code.',
        category: 'Practical',
        content: `
          <h1 style="font-family: var(--serif); margin-bottom: 0.5rem;">Debugging Tips</h1>
          <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted);">Everyone writes bugs. Being a good developer means being good at finding and fixing them.</p>
          
          <h2 style="font-family: var(--serif); margin-top: 2rem;">Console Tricks</h2>
          <p><code>console.log()</code> is your best friend, but there are other methods!</p>
          ${playground(`
console.error("This is an error message!");
console.warn("This is a warning!");

const data = [{a: 1, b: 2}, {a: 3, b: 4}];
console.table(data); // Awesome for arrays of objects
          `, 'dbg-1')}

          <h2 style="font-family: var(--serif); margin-top: 2rem;">The Debugger Keyword</h2>
          <p>If you put <code>debugger;</code> in your code, the browser will pause execution at that line (if DevTools is open), allowing you to inspect variables step-by-step.</p>
          <pre style="background: var(--surface-alt); padding: 1rem; border-radius: 4px; overflow-x: auto; font-family: var(--mono); font-size: 0.9rem;">
function trickyLogic(x) {
  let y = x * 2;
  debugger; // Browser will pause here!
  return y + 1;
}
          </pre>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Practice</h2>
          <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1rem 0;">
            <p><strong>Challenge 1:</strong> Open your browser's Developer Tools (F12 or Right Click -> Inspect), go to the Console tab, and try out <code>console.table</code>.</p>
          </div>

          <h2 style="font-family: var(--serif); margin-top: 2rem;">Related Guides</h2>
          <ul>
            <li><a href="/learn/javascript/error-handling">Error Handling</a></li>
          </ul>
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

    const jsHubBody = `
      <div class="article-container" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
        <h1 style="font-family: var(--serif); text-align: center; margin-bottom: 0.5rem;">JavaScript Guide</h1>
        <p style="text-align: center; color: var(--text-muted); margin-bottom: 3rem;">From absolute basics to building practical apps.</p>
        
        <h2 style="font-family: var(--serif); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Basics</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
          ${basics.map(renderCard).join('')}
        </div>

        <h2 style="font-family: var(--serif); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Intermediate</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 3rem;">
          ${intermediate.map(renderCard).join('')}
        </div>

        <h2 style="font-family: var(--serif); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 1.5rem;">Practical</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${practical.map(renderCard).join('')}
        </div>
      </div>
    `;

    writeFileSync(join(jsDist, 'index.html'), renderPage({
      title: 'Learn JavaScript | Digital Tools Shed',
      metaDesc: 'A complete guide to learning JavaScript from basics to practical projects.',
      canonical: `${DOMAIN}/learn/javascript/`,
      bodyContent: jsHubBody,
      currentPath: '/learn/javascript/'
    }));

    const mainHubBody = `
      <div class="article-container" style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
        <h1 style="font-family: var(--serif); text-align: center; margin-bottom: 0.5rem;">Learning Hub</h1>
        <p style="text-align: center; color: var(--text-muted); margin-bottom: 3rem;">Master the tools of the web.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
          <a href="/learn/javascript/" style="display: block; padding: 2rem; border: 1px solid var(--border); border-radius: 8px; text-decoration: none; color: inherit; background: var(--surface); text-align: center; transition: transform 0.2s;">
            <div style="font-size: 3rem; margin-bottom: 1rem; color: #f7df1e;">&#9889;</div>
            <h2 style="margin: 0 0 0.5rem 0; font-family: var(--serif);">JavaScript</h2>
            <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">The programming language of the web. Start from zero and build interactive apps.</p>
            <div style="margin-top: 1.5rem; font-weight: 600; color: var(--btn-bg, #3b82f6);">Explore ${jsGuides.length} Guides &rarr;</div>
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
      </div>
    `;

    writeFileSync(join(learnDist, 'index.html'), renderPage({
      title: 'Learn | Digital Tools Shed',
      metaDesc: 'Explore our learning hub and master web development.',
      canonical: `${DOMAIN}/learn/`,
      bodyContent: mainHubBody,
      currentPath: '/learn/'
    }));

    for (const guide of jsGuides) {
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

    console.log(`  \u2713 Built Learn Section (${jsGuides.length} JavaScript guides in /learn/javascript/)`);
  }
