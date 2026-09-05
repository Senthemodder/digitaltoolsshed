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
                <a href="/convert/esbuild-decompiler" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open ESBuild Decompiler →</a>
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
                <a href="/convert/json-obfuscator" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open JSON Obfuscator →</a>
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
                <a href="/mc/manifest-gen" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Manifest Generator →</a>
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
                <a href="/mc/uuid-gen" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">UUID Generator →</a>
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
                <a href="/convert/png-to-webp" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Convert PNG to WebP →</a>
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
                <a href="/media/downloader" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Open Media Downloader →</a>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      slug: 'how-to-cure-sleep-inertia-and-cortisol-awakening-response',
      title: 'How to Cure Sleep Inertia & Calibrate the Cortisol Awakening Response (CAR)',
      category: 'Neurobiology & Chronobiology',
      date: '2026-09-05',
      readTime: '7 min read',
      desc: 'The molecular neuroscience of morning grogginess: how adenosine clearance, core body temperature curves, and delayed caffeine intake eliminate the afternoon energy crash.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Neurobiology & Chronobiology</div>
            <h1>How to Cure Sleep Inertia & Calibrate the Cortisol Awakening Response (CAR)</h1>
            <div class="article-meta">
              <span>By <strong>Cognitive Neuroscience Lab</strong></span>
              <span>•</span>
              <span>Published September 5, 2026</span>
              <span>•</span>
              <span>7 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>If you wake up feeling like a walking corpse despite getting eight hours of sleep, you are not suffering from laziness—you are experiencing <strong>sleep inertia</strong>. This biological transition state is governed by lingering adenosine in the prefrontal cortex, incomplete thalamocortical network reactivation, and an uncalibrated <strong>Cortisol Awakening Response (CAR)</strong>.</p>

            <h2>1. The Molecular Mechanism of Sleep Inertia</h2>
            <p>During wakefulness, your neurons metabolize adenosine triphosphate (ATP) into adenosine, which binds to A1 and A2A receptors in the basal forebrain, creating homeostatic sleep pressure. During slow-wave sleep, cerebrospinal fluid flushes this accumulation via the glymphatic system. However, if wakefulness occurs abruptly—especially during a deep slow-wave trough—adenosine remains bound to receptors for 30 to 90 minutes.</p>

            <h2>2. The Cortisol Awakening Response (CAR)</h2>
            <p>Within 30 to 45 minutes of natural waking, healthy biology triggers an approximate 50% spike in free cortisol. Far from being a toxic stress hormone, this morning cortisol wave acts as a metabolic ignition switch: it elevates core body temperature, accelerates hepatic gluconeogenesis, and upregulates prefrontal alertness networks.</p>

            <p>To optimize this surge, your suprachiasmatic nucleus (SCN) requires immediate photic signaling. Exposing your eyes to 10,000+ lux of outdoor morning sunlight within 30 minutes of waking triggers melanopsin retinal ganglion cells, synchronizing your central circadian master clock.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Interactive Sleep Inertia & CAR Calculator</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Calculate your personalized adenosine clearance curve, optimal sunlight window, and delayed caffeine intake schedule.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/neuro/sleep-inertia-dissipator" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Launch Sleep Inertia Calculator →</a>
              </div>
            </div>

            <h2>3. Why You Must Delay Caffeine by 90 to 120 Minutes</h2>
            <p>Caffeine is a competitive adenosine receptor antagonist. When you drink coffee immediately upon waking, caffeine binds to A1/A2A receptors, preventing adenosine from binding. Crucially, caffeine does not eliminate adenosine; it merely holds it in suspension. When caffeine is metabolized approximately 5 to 7 hours later (around 2:00 PM), the backlog of un-cleared adenosine floods the receptors simultaneously, causing catastrophic afternoon brain fog.</p>

            <p>By waiting 90 to 120 minutes post-wake, your natural Cortisol Awakening Response clears residual adenosine completely. When you subsequently consume caffeine, there is no adenosine backlog, guaranteeing smooth, sustained mental clarity until bedtime.</p>
          </div>
        </div>
      `
    },
    {
      slug: 'the-neuroscience-of-adhd-task-paralysis-and-micro-stepping',
      title: 'The Neuroscience of ADHD Task Paralysis: Bypassing Prefrontal Gating with Micro-Stepping',
      category: 'Cognitive Architecture & ADHD',
      date: '2026-09-05',
      readTime: '8 min read',
      desc: 'Why executive dysfunction causes agonizing task freeze, how ambiguous cognitive scope triggers amygdala threat responses, and how 120-second dopamine micro-stepping bypasses prefrontal inertia.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Cognitive Architecture & ADHD</div>
            <h1>The Neuroscience of ADHD Task Paralysis: Bypassing Prefrontal Gating with Micro-Stepping</h1>
            <div class="article-meta">
              <span>By <strong>Cognitive Neuroscience Lab</strong></span>
              <span>•</span>
              <span>Published September 5, 2026</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>You have a critical project due tomorrow. You are sitting at your desk with your laptop open. You want desperately to work. Yet your hands feel physically glued to your sides, your chest tightens, and you find yourself reorganizing your browser bookmarks for the fifth time. This is not poor discipline—it is <strong>ADHD task paralysis</strong>.</p>

            <h2>1. Prefrontal Striatal Gating & Dopamine Deficiency</h2>
            <p>Task initiation is governed by the frontostriatal network, specifically the striatum and dorsolateral prefrontal cortex (DLPFC). In neurotypical brains, the anticipation of task completion releases a modest surge of tonic dopamine, sufficient to open the basal ganglia gating mechanism and initiate action.</p>

            <p>In ADHD neurobiology, baseline extracellular dopamine and D2 receptor availability are significantly lower. Without sufficient dopamine tone, the neural threshold required to cross from intent into kinetic action feels insurmountable. The brain perceives the ambiguous, overwhelming project not as an opportunity, but as an existential energetic threat.</p>

            <h2>2. The Wall of Awful & The Freeze Response</h2>
            <p>When a task is large or ill-defined ("write the research paper", "clean the garage", "file tax returns"), the prefrontal cortex cannot calculate a linear computation path. The amygdala activates an evolutionary freeze response: heart rate elevates, working memory narrows, and dopamine-deprived neural circuits seek immediate relief through micro-distractions.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Interactive ADHD Task Paralysis Defuser</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Deconstruct daunting projects into 120-second micro-actions with integrated dopamine audio timers.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/neuro/adhd-paralysis-defuser" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Launch ADHD Paralysis Defuser →</a>
              </div>
            </div>

            <h2>3. The 120-Second Micro-Stepping Protocol</h2>
            <p>The secret to overcoming task paralysis is reducing the initiation threshold below the amygdala's radar. Instead of "writing the paper", the micro-action is "open the laptop document and type a single imperfect sentence in 120 seconds."</p>

            <p>Once kinetic initiation occurs, the brain releases a pulse of phasic dopamine upon micro-completion. Momentum takes over, the prefrontal gate unfreezes, and you transition effortlessly into the flow state channel.</p>
          </div>
        </div>
      `
    },
    {
      slug: 'the-neuroscience-of-limerence-why-brains-obsess-over-uncertain-love',
      title: 'The Neuroscience of Limerence: Why the Brain Obsesses Over Uncertain Love',
      category: 'Clinical Neurobiology & Psychology',
      date: '2026-09-05',
      readTime: '8 min read',
      desc: 'Explore the dopamine-driven neurochemistry of obsessive infatuation, intermittent reinforcement schedules, and how to decouple fantasy projection from authentic emotional intimacy.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Clinical Neurobiology & Psychology</div>
            <h1>The Neuroscience of Limerence: Why the Brain Obsesses Over Uncertain Love</h1>
            <div class="article-meta">
              <span>By <strong>Neuroscience Research Desk</strong></span>
              <span>•</span>
              <span>Published September 5, 2026</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>Few psychological states are as intoxicating, disorienting, and agonizing as <strong>limerence</strong>. Coined in 1979 by psychologist Dr. Dorothy Tennov, limerence describes an involuntary, acute state of cognitive infatuation characterized by intrusive daydreams, an insatiable hunger for emotional reciprocation, and profound emotional instability.</p>

            <p>While society romanticizes this intense obsession as "true love," modern neuroimaging and behavioral neuroscience reveal a very different reality: limerence is not love at all. It is a potent, neurochemically driven behavioral addiction triggered by uncertainty and intermittent reinforcement.</p>

            <h2>1. The Dopamine Engine: Why Ambiguity Multiplies Craving</h2>
            <p>In authentic love, relationships provide nervous system safety, predictable attunement, and steady oxytocin release. In limerence, the brain's mesolimbic dopamine pathway is hijacked by <strong>intermittent reinforcement</strong>—the exact psychological mechanism underlying gambling addiction.</p>

            <p>B.F. Skinner discovered that animals press a lever most compulsively not when a reward is guaranteed, but when the reward is unpredictable. When a romantic interest alternates between warmth and cold withdrawal, delayed text replies, and mixed signals, your striatum experiences massive dopamine spikes in anticipation of possible reward. The uncertainty itself is what fuels the obsession.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Interactive Limerence vs Authentic Love Auditor</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Audit whether your romantic connection is anchored in authentic safety or an obsessive neurochemical dopamine loop.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/neuro/limerence-vs-love-auditor" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Launch Limerence Auditor →</a>
              </div>
            </div>

            <h2>2. Crystallization & The Erasure of Flaws</h2>
            <p>A hallmark of the limerent brain is <em>crystallization</em>: cognitive distortions where the limerent person actively overlooks, rationalizes, or romanticizes red flags and profound incompatibilities. The brain constructs a curated mental avatar of the "Limerent Object" (LO), attributing godlike perfection and uniqueness to someone they barely know in mundane reality.</p>

            <h2>3. Breaking the Limerent Cycle: The 3 Pillars of Recovery</h2>
            <p>Because limerence operates as an addiction pathway, gentle willpower is ineffective. Recovery requires strict neurochemical fasting:</p>

            <ul>
              <li><strong>Radical Low-Contact or No-Contact:</strong> Stop checking their social media profiles, analyzing old text timestamps, or rereading past conversations. Every check delivers a micro-pulse of dopamine that resets the addiction clock.</li>
              <li><strong>Deconstruct the Avatar:</strong> Write down an objective, unvarnished list of their flaws, inconsistencies, and emotional unavailability to puncture the fantasy projection.</li>
              <li><strong>Address the Unmet Core Wound:</strong> Limerence is almost always a projection of our own unmet childhood attachment needs. The LO is not a savior; they are a mirror reflecting what we feel we lack in ourselves.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      slug: 'dbt-tipp-skills-how-to-abort-an-emotional-crisis-in-60-seconds',
      title: 'DBT TIPP Skills: How to Abort an Emotional Crisis in Under 60 Seconds',
      category: 'Somatic Neurobiology & Crisis Triage',
      date: '2026-09-05',
      readTime: '7 min read',
      desc: 'Master the dialectical behavior therapy TIPP protocol. Learn how the mammalian dive reflex, cold exposure, and paced breathing downregulate acute amygdala hijacks.',
      body: `
        <div class="article-container">
          <header class="article-header">
            <div class="article-journal-tag">Somatic Neurobiology & Crisis Triage</div>
            <h1>DBT TIPP Skills: How to Abort an Emotional Crisis in Under 60 Seconds</h1>
            <div class="article-meta">
              <span>By <strong>Clinical Triage Desk</strong></span>
              <span>•</span>
              <span>Published September 5, 2026</span>
              <span>•</span>
              <span>7 min read</span>
            </div>
          </header>

          <div class="article-body">
            <p>When emotional distress reaches an 8, 9, or 10 out of 10, conventional cognitive therapy stops working. The prefrontal cortex—the logical seat of language, foresight, and rational reasoning—effectively shuts down. Blood flow is diverted to the amygdala and brainstem in an acute evolutionary survival response.</p>

            <p>Trying to "talk yourself down" or "think positive" during an emotional hijack is biologically impossible. You cannot think your way out of a physiological storm. You must use somatic biochemistry to pull the nervous system back into regulation. This is the foundation of <strong>DBT TIPP</strong>.</p>

            <h2>1. The Mammalian Dive Reflex (Temperature)</h2>
            <p>Developed by Dr. Marsha Linehan, the <strong>T</strong> in TIPP stands for <strong>Temperature</strong>. When you submerge your face in cold water (or apply an ice pack across your eyes and cheekbones) while holding your breath for 30 seconds, you trigger the evolutionary mammalian dive reflex.</p>

            <p>Sensory receptors in the trigeminal facial nerve send immediate emergency signals to the brainstem. The vagus nerve fires, immediately decelerating heart rate by 10% to 25%, shunting oxygenated blood to vital organs, and forcefully arresting hyperventilation.</p>

            <div class="article-cta-box">
              <h3 style="margin: 0; font-family: var(--serif);">Interactive DBT TIPP Emergency Navigator</h3>
              <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted);">Step-by-step interactive crisis triage with dive timers, burst counters, and 4-7-8 parasympathetic breathing pacers.</p>
              <div style="margin-top: 0.5rem;">
                <a href="/neuro/dbt-tipp-emergency-skills" class="btn btn-primary" style="display: inline-block; padding: 0.6rem 1.25rem;">Launch DBT TIPP Navigator →</a>
              </div>
            </div>

            <h2>2. Metabolizing the Adrenaline Surge (Intense Exercise)</h2>
            <p>When panic or rage strikes, your bloodstream is flooded with adrenaline and cortisol designed to fuel life-or-death running or fighting. Sitting still while this chemical flood surges through your veins induces unbearable somatic agitation.</p>

            <p>Engaging in 60 seconds of maximum intensity exertion (jumping jacks, sprinting in place, wall sits) burns through circulating stress hormones and forces the body to transition from fight-or-flight into metabolic recovery.</p>

            <h2>3. Paced Breathing & Paired Muscle Relaxation</h2>
            <p>The final components of TIPP systematically engage the parasympathetic vagal brake. By extending the exhale to be significantly longer than the inhale (such as the 4-7-8 breathing pattern), baroreceptors in the carotid sinus signal to the heart that the danger has passed.</p>
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
      canonical: `${DOMAIN}/articles/${art.slug}`,
      bodyContent: articleBody,
      currentPath: `/articles/${art.slug}`,
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
    <a href="/articles/${art.slug}" class="article-journal-card">
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
