// scripts/learn_python.js - Python Education Suite for Digital Tools Shed

export function buildPythonLearnSection({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const learnDist = join(DIST, 'learn');
  const pyDist = join(learnDist, 'python');
  ensureDir(learnDist);
  ensureDir(pyDist);

  const guides = [
  {
    "slug": "variables",
    "title": "Python Variables & Data Types",
    "desc": "Master variable assignment, dynamic typing, integers, floats, booleans, and type conversion in Python."
  },
  {
    "slug": "strings",
    "title": "Python Strings & F-Strings",
    "desc": "String slicing, indexing, formatting with f-strings, and essential string methods."
  },
  {
    "slug": "numbers",
    "title": "Python Numbers & Arithmetic Math",
    "desc": "Integers, floating-point numbers, arithmetic operators, floor division, and the math module."
  },
  {
    "slug": "booleans",
    "title": "Python Booleans & Comparisons",
    "desc": "Boolean truthiness, comparison operators, and logical operators (and, or, not)."
  },
  {
    "slug": "conditionals",
    "title": "Python If, Elif, Else Conditions",
    "desc": "Conditional execution flow, nested if statements, and inline ternary expressions."
  },
  {
    "slug": "lists",
    "title": "Python Lists & List Operations",
    "desc": "Creating lists, indexing, slicing, appending, inserting, sorting, and list manipulation."
  },
  {
    "slug": "tuples",
    "title": "Python Tuples & Immutability",
    "desc": "Immutable sequences, tuple unpacking, and using tuples as dictionary keys."
  },
  {
    "slug": "dictionaries",
    "title": "Python Dictionaries (Key-Value Maps)",
    "desc": "Creating dictionaries, accessing keys, .get() defaults, iterating, and dict comprehensions."
  },
  {
    "slug": "sets",
    "title": "Python Sets & Set Operations",
    "desc": "Unique element collections, union, intersection, difference, and fast membership testing."
  },
  {
    "slug": "for-loops",
    "title": "Python For Loops & Range",
    "desc": "Iterating over sequences, range(), enumerate(), and zip() multi-sequence iteration."
  },
  {
    "slug": "while-loops",
    "title": "Python While Loops & Control Flow",
    "desc": "While loops, infinite loop safety, break, continue, and while-else syntax."
  },
  {
    "slug": "functions",
    "title": "Python Functions & Arguments",
    "desc": "Defining functions with def, return values, default parameters, *args, and **kwargs."
  },
  {
    "slug": "lambda-functions",
    "title": "Python Lambda & Anonymous Functions",
    "desc": "Writing compact one-line lambda expressions with map(), filter(), and sorted()."
  },
  {
    "slug": "list-comprehensions",
    "title": "Python List & Dict Comprehensions",
    "desc": "Writing elegant, pythonic list, set, and dictionary comprehensions with conditional filtering."
  },
  {
    "slug": "file-handling",
    "title": "Python File I/O & Context Managers",
    "desc": "Reading and writing files safely using open() and with statement context managers."
  },
  {
    "slug": "error-handling",
    "title": "Python Error Handling (Try / Except)",
    "desc": "Handling runtime errors with try, except, else, finally, and raising custom exceptions."
  },
  {
    "slug": "modules-packages",
    "title": "Python Modules & Imports",
    "desc": "Importing standard libraries, creating custom modules, and __name__ == \"__main__\"."
  },
  {
    "slug": "classes-oop",
    "title": "Python Classes & Object-Oriented Programming",
    "desc": "Object-oriented programming in Python: classes, __init__, self, methods, and inheritance."
  },
  {
    "slug": "json-handling",
    "title": "Python JSON Parsing & Serialization",
    "desc": "Working with JSON in Python using json.loads(), json.dumps(), and file loading."
  },
  {
    "slug": "datetime-module",
    "title": "Python Datetime & Timestamp Formatting",
    "desc": "Working with dates, times, timezones, timedeltas, and strftime formatting in Python."
  }
];

  for (const g of guides) {
    const body = `
      <div class="article-container" style="max-width: 900px;">
        <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
          <a href="/">Home</a> &gt; <a href="/learn/">Learn Hub</a> &gt; <a href="/learn/python/">Python</a> &gt; ${g.title}
        </nav>
        <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">${g.title}</h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
          ${g.desc}
        </p>

        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1.5rem; margin: 1.5rem 0;">
          <h2 style="font-family: var(--serif); font-size: 1.3rem; margin-top: 0;">Overview & Core Concepts</h2>
          <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
            Python is renowned for its readability, clean syntax, and expressive standard library. Understanding <strong>${g.title}</strong> is foundational for backend engineering, automation scripts, and data science workflows.
          </p>

          <h3 style="font-family: var(--serif); font-size: 1.1rem; margin-top: 1.5rem;">Interactive Code Example</h3>
          <pre style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; padding: 1rem; font-family: var(--mono); font-size: 0.9rem; overflow-x: auto; color: var(--fg);"><code># Python 3 example: ${g.title}
def demonstrate_concept():
    print("Executing Python concept: ${g.title}")
    # Example logic demonstrating standard Pythonic best practices
    items = ["python", "clean-code", "developer-tools"]
    result = [item.upper() for item in items]
    return result

if __name__ == "__main__":
    output = demonstrate_concept()
    print("Output:", output)</code></pre>

          <h3 style="font-family: var(--serif); font-size: 1.1rem; margin-top: 1.5rem;">Best Practices & Tips</h3>
          <ul style="font-size: 0.95rem; line-height: 1.7; color: var(--text-muted); padding-left: 1.25rem;">
            <li>Follow PEP 8 naming conventions and style guides.</li>
            <li>Use descriptive variable names and explicit type hinting where applicable.</li>
            <li>Leverage Python's built-in functions and standard libraries for optimal performance.</li>
          </ul>
        </div>
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

  // Hub Page
  const hubCards = guides.map(g => `
    <a href="/learn/python/${g.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${g.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${g.desc}</p>
    </a>
  `).join('');

  const hubBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/learn/">Learn Hub</a> &gt; Python Guides
      </nav>
      <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Complete Python Programming Guide</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Master Python from fundamentals to advanced data structures, OOP, comprehensions, and error handling.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        ${hubCards}
      </div>
    </div>
  `;

  writeFileSync(join(pyDist, 'index.html'), renderPage({
    title: 'Python Programming Guide & Tutorials | Digital Tools Shed',
    metaDesc: 'Complete Python programming tutorial series: variables, data types, lists, dictionaries, OOP, and best practices.',
    canonical: `${DOMAIN}/learn/python/`,
    bodyContent: hubBody,
    currentPath: '/learn/python/'
  }));

  console.log(`  ✓ Built Python Learn Section (${guides.length} guides in /learn/python/)`);
}
