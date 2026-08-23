import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

function buildArticlesSuite() {
  const articlesDist = join(DIST, 'articles');
  ensureDir(articlesDist);

  const ARTICLES = [
    {
      slug: 'how-to-decompile-esbuild-bundles',
      title: 'Reverse Engineering Minified ESBuild & Webpack Bundles: A Practical Guide',
      category: 'Developer & Reverse Engineering',
      date: '2026-08-16',
      readTime: '6 min read',
      desc: 'Understand how modern JS bundlers compile modules into IIFEs, how to unwind helper functions, expand comma-operators, and recover clean readable source code.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Developer & Reverse Engineering</div>
            <h1>Reverse Engineering Minified ESBuild & Webpack Bundles: A Practical Guide</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>Modern JavaScript bundlers like <strong>ESBuild</strong>, <strong>Webpack</strong>, and <strong>Rollup</strong> transform modular, multi-file codebases into highly optimized single-file bundles. In production deployments, code is minified: whitespace is stripped, identifiers are renamed to single characters, statements are collapsed using comma operators, and module imports are converted into internal helper functions.</p>

            <p>When source maps are missing, understanding or auditing this code requires systematic unminification. In this guide, we break down how ESBuild bundle structures work and how to restore readable code from obfuscated artifacts.</p>

            <h2>1. Anatomy of an ESBuild Bundle</h2>
            <p>ESBuild handles ES Modules (ESM) and CommonJS (CJS) by synthesizing lightweight wrapper functions. The most common patterns you will encounter in minified bundles are:</p>

            <ul>
              <li><code>__esm(fn)</code>: Lazy-evaluates an ES module once and caches the namespace.</li>
              <li><code>__toESM(mod)</code>: Wraps CommonJS exports to expose standard default and named properties.</li>
              <li><code>__export(target, all)</code>: Defines getters on module exports to simulate live ESM bindings.</li>
            </ul>

            <div class="code-block-wrapper">
              <pre><code>// Typical minified ESBuild module wrapper:
var s=Object.defineProperty;
var i=Object.getOwnPropertyDescriptor;
var p=(t,e)=>{for(var r in e)s(t,r,{get:e[r],enumerable:!0})};
var m=(t,e,r,a)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Object.getOwnPropertyNames(e))!Object.prototype.hasOwnProperty.call(t,n)&&n!==r&&s(t,n,{get:()=>e[n],enumerable:!(a=i(e,n))||a.enumerable});return t};
var d=t=>m(s({},"__esModule",{value:!0}),t);</code></pre>
            </div>

            <h2>2. The Comma Operator Compression Pattern</h2>
            <p>Minifiers frequently replace sequential statements with chained expressions using the comma operator <code>(a(), b(), c())</code> or ternaries <code>(cond ? (x=1, y=2) : z=3)</code>. This saves bytes by eliminating semicolons and statement blocks, but destroys human readability.</p>

            <p>To decompile these structures:</p>
            <ol>
              <li>Expand chained comma expressions into distinct statement lines.</li>
              <li>Convert ternary assignments back into explicit <code>if / else</code> control flow blocks.</li>
              <li>Reformat nested ternary chains into readable <code>switch</code> or <code>if / else if</code> branches.</li>
            </ol>

            <div class="article-callout">
              "Unminifying is not just adding newlines; it is reconstructing the Abstract Syntax Tree (AST) so that identifiers and control flow match standard developer intent."
            </div>

            <h2>3. Variable Recovery and Identifier Mapping</h2>
            <p>While variable renaming (mangling) is irreversible without source maps or symbols, identifiers can be contextualized based on their usage patterns:</p>
            <ul>
              <li>DOM elements: <code>document.getElementById</code> or <code>querySelector</code> targets indicate UI references.</li>
              <li>Web APIs: Calls to <code>fetch()</code>, <code>crypto.subtle</code>, or <code>localStorage</code> reveal network and storage handlers.</li>
              <li>Data models: Object property names (which are preserved unless advanced property mangling is used) provide structural hints.</li>
            </ul>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Try the In-Browser Decompiler</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Paste your minified ESBuild or Webpack JavaScript payload into our client-side decompiler to instantly unpack IIFEs, expand comma-statements, and format readable code.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/convert/esbuild-decompiler.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open ESBuild Decompiler →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'json-obfuscation-and-compression-techniques',
      title: 'JSON Payload Obfuscation & Minification: Strategies for Client-Side Protection',
      category: 'Security & Web Architecture',
      date: '2026-08-16',
      readTime: '5 min read',
      desc: 'Explore reversible property dictionary mappings, Unicode hexadecimal escaping, and whitespace elimination strategies for protecting and compressing JSON data.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Security & Web Architecture</div>
            <h1>JSON Payload Obfuscation & Minification: Strategies for Client-Side Protection</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>JSON (JavaScript Object Notation) is the standard data interchange format for modern APIs, configurations, and state persistence. However, raw JSON files are plain text, human-readable, and often contain descriptive keys that expose internal schema architectures or increase network payload size.</p>

            <p>In this article, we analyze techniques for compressing, protecting, and obfuscating JSON data before client transmission or offline storage.</p>

            <h2>1. Property Name Dictionary Substitution</h2>
            <p>In large datasets, repeating key names (e.g. <code>"transaction_identifier"</code>, <code>"user_authentication_token"</code>) consume significant memory and reveal internal naming conventions.</p>

            <p>By mapping repeated keys to short deterministic token identifiers (e.g. <code>"k0"</code>, <code>"k1"</code>, <code>"k2"</code>), you achieve dual benefits:</p>
            <ul>
              <li><strong>Payload Reduction</strong>: Reduces file sizes by 30% to 60% before gzip/brotli compression.</li>
              <li><strong>Schema Obfuscation</strong>: Prevents casual inspection of field definitions and business logic.</li>
            </ul>

            <div class="code-block-wrapper">
              <pre><code>// Original JSON:
[
  {"productId": 101, "productName": "Screwdriver", "inStock": true},
  {"productId": 102, "productName": "Hammer", "inStock": false}
]

// Obfuscated Payload with Key Map:
{
  "__map": {"k0": "productId", "k1": "productName", "k2": "inStock"},
  "data": [
    {"k0": 101, "k1": "Screwdriver", "k2": true},
    {"k0": 102, "k1": "Hammer", "k2": false}
  ]
}</code></pre>
            </div>

            <h2>2. Unicode Hexadecimal Escaping</h2>
            <p>For sensitive strings, keys, or metadata, strings can be encoded using standard JSON-compliant Unicode escapes (<code>\\uXXXX</code>). Standard JSON parsers evaluate these transparently, but scrapers and static inspection tools cannot read them without decoding.</p>

            <div class="code-block-wrapper">
              <pre><code>// Plaintext: "apiKey": "live_sec_99182"
// Unicode Hex Encoded: "\\u0061\\u0070\\u0069\\u004b\\u0065\\u0079": "\\u006c\\u0069\\u0076\\u0065\\u005f..."</code></pre>
            </div>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Interactive JSON Obfuscator & Compressor</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Use our browser-based utility to minify, dictionary-encode, and hex-escape JSON payloads with 100% reversible decompression.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/convert/json-obfuscator.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open JSON Obfuscator →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'minecraft-bedrock-custom-blocks-guide',
      title: 'Minecraft Bedrock Custom 3D Blocks & Molang Component Architecture Guide',
      category: 'Minecraft & Game Engine',
      date: '2026-08-16',
      readTime: '7 min read',
      desc: 'Step-by-step technical tutorial on building custom 3D blocks in Bedrock 1.21.0+ with geometry, material instances, Molang query states, and permutations.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Minecraft & Game Engine</div>
            <h1>Minecraft Bedrock Custom 3D Blocks & Molang Component Architecture Guide</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>7 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>With Minecraft Bedrock 1.21.0+, custom block authoring transitioned into a declarative component system. The legacy block pipeline has been replaced by modular components in the Behavior Pack paired with texture definitions in the Resource Pack.</p>

            <h2>1. Behavior Pack Component Declaration</h2>
            <p>Every custom block JSON requires a namespace identifier and core components defining friction, geometry, material instances, and collision bounds.</p>

            <div class="code-block-wrapper">
              <pre><code>{
  "format_version": "1.21.0",
  "minecraft:block": {
    "description": {
      "identifier": "custom:industrial_workbench",
      "menu_category": {
        "category": "items",
        "group": "itemGroup.name.workbench"
      }
    },
    "components": {
      "minecraft:geometry": "geometry.industrial_workbench",
      "minecraft:material_instances": {
        "*": {
          "texture": "industrial_workbench",
          "render_method": "opaque"
        }
      },
      "minecraft:collision_box": true,
      "minecraft:selection_box": true,
      "minecraft:destructible_by_mining": {
        "seconds_to_destroy": 1.5
      }
    }
  }
}</code></pre>
            </div>

            <h2>2. Resource Pack Mappings</h2>
            <p>For the engine to display the block model and texture, register the identifier inside <code>blocks.json</code> and declare the texture path inside <code>textures/terrain_texture.json</code>:</p>

            <div class="code-block-wrapper">
              <pre><code>// terrain_texture.json
{
  "resource_pack_name": "digital_tools_shed_rp",
  "texture_name": "atlas.terrain",
  "texture_data": {
    "industrial_workbench": {
      "textures": "textures/blocks/industrial_workbench"
    }
  }
}</code></pre>
            </div>

            <h2>3. Molang State Permutations</h2>
            <p>Dynamic block properties (such as activation states, rotation directions, or visual variants) are managed using <code>permutations</code> and <code>minecraft:custom_components</code>:</p>

            <div class="code-block-wrapper">
              <pre><code>"permutations": [
  {
    "condition": "q.block_state('custom:powered') == 1",
    "components": {
      "minecraft:light_emission": 14,
      "minecraft:material_instances": {
        "*": {
          "texture": "industrial_workbench_active",
          "render_method": "blend"
        }
      }
    }
  }
]</code></pre>
            </div>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Generate Bedrock Manifests & UUIDs</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Use our generator to create valid manifest.json files with matching UUID v4 pairs and module headers for your Behavior and Resource packs.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/mc/manifest-gen.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Manifest Generator →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'minecraft-bedrock-manifest-uuid-guide',
      title: 'Mastering Minecraft Bedrock Manifest.json Architecture & UUID Dependency Routing',
      category: 'Minecraft & Game Engine',
      date: '2026-08-16',
      readTime: '6 min read',
      desc: 'Understand manifest.json structure, header and module UUID v4 pairing, min_engine_version requirements, and dependency resolution between BP and RP.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Minecraft & Game Engine</div>
            <h1>Mastering Minecraft Bedrock Manifest.json Architecture & UUID Dependency Routing</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>The <code>manifest.json</code> file is the root identity certificate for every Minecraft Bedrock add-on pack. A single invalid UUID, mismatched module type, or conflicting version definition causes Bedrock to reject the pack or silently ignore assets.</p>

            <h2>1. The Core Schema Breakdown</h2>
            <p>A valid manifest requires two distinct top-level sections: <code>header</code> and <code>modules</code>.</p>
            <ul>
              <li><strong>Header</strong>: Defines pack name, description, pack UUID, version tuple <code>[1, 0, 0]</code>, and <code>min_engine_version</code>.</li>
              <li><strong>Modules</strong>: Defines what content the pack injects. Behavior Packs use <code>"type": "data"</code>, Resource Packs use <code>"type": "resources"</code>, and Script API packs use <code>"type": "script"</code>.</li>
            </ul>

            <h2>2. UUID v4 Collision and Pairing Rules</h2>
            <p>Bedrock requires that:</p>
            <ol>
              <li>The header UUID and module UUID inside the same manifest <strong>must never be identical</strong>.</li>
              <li>No two distinct packs in the game may share the same header UUID.</li>
              <li>When a Behavior Pack depends on a Resource Pack, the BP's <code>dependencies</code> array references the RP's <strong>header UUID</strong>.</li>
            </ol>

            <div class="code-block-wrapper">
              <pre><code>// Example Behavior Pack Dependency:
"dependencies": [
  {
    "uuid": "a7b3c291-89e4-4a22-96b1-094857201938", // RP Header UUID
    "version": [1, 0, 0]
  }
]</code></pre>
            </div>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Instant Minecraft UUID Generator</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Generate cryptographically secure RFC-4122 v4 UUIDs for Minecraft Bedrock packs with 1-click clipboard copying.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/mc/uuid-gen.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">UUID Generator →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'zero-upload-client-side-image-processing',
      title: 'Zero-Upload Image Processing: How In-Browser HTML5 Canvas Compression Works',
      category: 'Web Architecture & Performance',
      date: '2026-08-16',
      readTime: '5 min read',
      desc: 'How modern web applications convert, resize, and compress high-resolution images locally inside browser memory using HTML5 Canvas, WebP, and Web Workers.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Web Architecture & Performance</div>
            <h1>Zero-Upload Image Processing: How In-Browser HTML5 Canvas Compression Works</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>Traditional image conversion utilities require users to upload files to a remote server. This introduces latency, consumes costly server bandwidth, and poses privacy risks for proprietary or personal documents.</p>

            <p>At <strong>Digital Tools Shed</strong>, our entire suite of image and file tools executes <strong>100% client-side</strong> using HTML5 Canvas and native browser memory buffers.</p>

            <h2>1. The HTML5 Canvas Rasterization Pipeline</h2>
            <p>When an image file is selected by the user:</p>
            <ol>
              <li>The file is read into memory as a <code>Blob</code> or <code>ArrayBuffer</code> via <code>FileReader</code> or <code>createObjectURL()</code>.</li>
              <li>An <code>Image</code> element loads the binary data without network transmission.</li>
              <li>An in-memory <code>&lt;canvas&gt;</code> element draws the image bitmap with custom dimensions and bicubic interpolation.</li>
              <li>The canvas calls <code>toBlob('image/webp', quality)</code> to invoke native SIMD hardware-accelerated encoders in the browser.</li>
            </ol>

            <div class="code-block-wrapper">
              <pre><code>// Client-Side Zero-Upload Canvas Pipeline
function convertClientSide(imgElement, format, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = imgElement.naturalWidth;
  canvas.height = imgElement.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);

  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/' + format, quality);
  });
}</code></pre>
            </div>

            <h2>2. Why WebP is the Modern Standard</h2>
            <p>Google WebP provides <strong>25%–35% smaller file sizes</strong> compared to JPEG at equivalent visual quality scores (SSIM), while supporting alpha transparency and lossless encoding.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Convert Images Client-Side</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Convert PNG, JPG, and WebP images instantly in your browser with zero file uploads and complete privacy.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/convert/png-to-webp.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Convert PNG to WebP →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'universal-media-stream-extraction-guide',
      title: 'Media Stream Extraction: How Modern Video & Audio Savers Work Without Backend Servers',
      category: 'Media & Streaming',
      date: '2026-08-16',
      readTime: '6 min read',
      desc: 'A breakdown of progressive video extraction, DASH/HLS audio stream demuxing, and decentralized CORS relay endpoints for zero-storage media tools.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Media & Streaming</div>
            <h1>Media Stream Extraction: How Modern Video & Audio Savers Work Without Backend Servers</h1>
            <div class="article-meta">
              <span>By <strong>Engineering Team</strong></span>
              <span>•</span>
              <span>Updated August 16, 2026</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>Streaming platforms like YouTube, TikTok, and Twitter deliver video content using adaptive bitrate streaming protocols (HLS and MPEG-DASH) or signed CDN URLs. Downloading these media streams without massive cloud storage infrastructure requires direct-stream extraction pipelines.</p>

            <h2>1. Progressive MP4 vs Adaptive Streaming</h2>
            <p>While low-resolution streams (up to 720p) are often bundled with interleaved audio in a single MP4 container, 1080p and 4K streams deliver separate video and audio chunks. Modern browser utilities query public metadata endpoints to resolve direct progressive stream URLs.</p>

            <h2>2. Decentralized API Federation</h2>
            <p>Rather than hosting private transcoding server fleets, modern open tools federate across reliable open-source backend protocols (such as Cobalt and Invidious instances) to parse platform signatures and return direct download streams.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Try Universal Media Downloader</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Download clean video and audio streams from YouTube, TikTok, Twitter/X, and Instagram.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/media/downloader.html" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open Media Downloader →</a>
              </div>
            </div>
          </div>
        </div>
      `
    }
  ];

  // Ad injection templates for articles
  const ARTICLE_MID_AD = `
    <div class="ad-article-mid">
      <span class="ad-label">Continue Reading — Sponsored</span>
      <div class="ad-unit-300x250">
        <script type="text/javascript">
          atOptions = {
            'key' : '335d807d460eaf2491fcca0f635474ce',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/335d807d460eaf2491fcca0f635474ce/invoke.js"></script>
      </div>
    </div>
  `;
  const ARTICLE_END_NATIVE = `
    <div style="margin: 2rem 0;">
      <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Recommended Reading</div>
      <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
      <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
    </div>
  `;

  // 1. Render Individual Article Pages
  for (const art of ARTICLES) {
    // Inject mid-article ad after 2nd <h2> and end-of-article native widget
    let articleBody = art.body;
    const h2Matches = [...articleBody.matchAll(/<h2>/g)];
    if (h2Matches.length >= 2) {
      const insertPos = h2Matches[1].index;
      articleBody = articleBody.slice(0, insertPos) + ARTICLE_MID_AD + articleBody.slice(insertPos);
    }
    // Add native widget before closing article-container
    articleBody = articleBody.replace(/<\/div>\s*<\/div>\s*$/, ARTICLE_END_NATIVE + '</div>\n        </div>');

    const html = renderPage({
      title: `${art.title} — Digital Tools Shed Journal`,
      metaDesc: art.desc,
      canonical: `${DOMAIN}/articles/${art.slug}.html`,
      bodyContent: articleBody,
      currentPath: `/articles/${art.slug}.html`,
      schema: {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": art.title,
        "description": art.desc,
        "datePublished": art.date,
        "author": {
          "@type": "Organization",
          "name": "Digital Tools Shed"
        }
      }
    });

    writeFileSync(join(articlesDist, `${art.slug}.html`), html);
  }

  // 2. Render Articles Hub /articles/index.html
  const hubCards = ARTICLES.map(art => `
    <a href="/articles/${art.slug}.html" class="article-journal-card">
      <div>
        <div class="article-journal-tag">${art.category}</div>
        <h3>${art.title}</h3>
        <p>${art.desc}</p>
      </div>
      <div class="article-meta" style="margin-top: 1rem;">
        <span>${art.date}</span>
        <span>•</span>
        <span>${art.readTime}</span>
      </div>
    </a>
  `).join('\n');

  const hubBody = `
    <div class="hero">
      <h1>The Engineer's Journal & Tech Guides</h1>
      <p>In-depth technical architecture breakdowns, reverse engineering workflows, zero-server client algorithms, and Minecraft Bedrock technical specifications.</p>
    </div>

    <div class="article-card-grid">
      ${hubCards}
    </div>
  `;

  writeFileSync(join(articlesDist, 'index.html'), renderPage({
    title: 'Tech Journal, Guides & Developer Blueprints — Digital Tools Shed',
    metaDesc: 'Explore engineering tutorials on JavaScript decompilation, JSON obfuscation, Bedrock custom blocks, in-browser image processing, and media pipelines.',
    canonical: `${DOMAIN}/articles/`,
    bodyContent: hubBody,
    currentPath: '/articles/'
  }));

  console.log(`  ✓ Built & Published ${ARTICLES.length} In-Depth Technical Articles & Journal Hub (/articles/)`);
}

// ─── SITEMAP & ROBOTS.TXT ──────────────────────────────────────────────────

export { buildArticlesSuite };
