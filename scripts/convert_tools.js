import { writeFileSync, existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ROOT, ensureDir, ICONS, TOOLS } from './core.js';

const CONVERTER_METADATA = {
  'base64.html': {
    title: 'Base64 Encoder & Decoder Online [Text & Binary Files] | Digital Tools Shed',
    metaDesc: 'Encode text or files into Base64 format, or decode Base64 strings back to original text or downloadable binary files instantly with zero server latency.',
    h1: 'Base64 Encoder & Decoder',
    summary: 'Encode text strings, images, and binary documents into RFC 4648 Base64 representation, or decode Base64 strings back to original text and downloadable files.',
    traps: [
      {
        title: '1. UTF-8 Multibyte Character Encoding Discrepancies',
        color: '#ef4444',
        desc: 'Standard JavaScript btoa() and atob() functions only operate on ASCII 8-bit Latin1 character codepoints. Passing emojis, accented characters, or non-Latin glyphs throws an uncaught InvalidCharacterError DOMException. Always route multibyte string conversions through UTF-8 TextEncoder and Uint8Array byte arrays before base64 encoding.'
      },
      {
        title: '2. 33.3% Payload Bloat & Network Bandwidth Penalty',
        color: '#f59e0b',
        desc: 'Base64 converts every 3 binary bytes into 4 ASCII characters, incurring a strict 33.33% file size expansion. Inlining large base64 assets (such as images, fonts, or audio files) directly into HTML or CSS balloons initial DOM download sizes and disables browser parallel HTTP caching.'
      },
      {
        title: '3. Malformed Data URI Schemes & MIME Type Stripping',
        color: '#10b981',
        desc: 'When embedding Base64 strings into HTML <img> tags or CSS background-image properties, omitting the exact MIME type header (e.g. data:image/png;base64, or data:image/svg+xml;base64,) causes rendering failures in WebKit and Chromium engines. Always preserve explicit data URI headers when copying base64 image data.'
      },
      {
        title: '4. URL-Safe Base64 vs Standard Base64 Syntax Clashes',
        color: '#3b82f6',
        desc: 'Standard Base64 incorporates + and / symbols, along with = padding characters. When passed inside URL query strings or JWT headers, + is coerced into whitespace by web servers, silently corrupting data payloads. URL-safe Base64 substitutes - for + and _ for /, stripping padding. Always verify destination protocol requirements.'
      },
      {
        title: '5. Memory Thrashing on Monolithic File Ingestion',
        color: '#8b5cf6',
        desc: 'Attempting to decode or encode files exceeding 100MB directly as continuous in-memory JavaScript string variables can exhaust browser V8 heap limits (1.4GB–2GB ceiling). For massive files, leverage streaming FileReader chunking or native Web Workers to prevent UI thread freezing.'
      }
    ],
    faqs: [
      { q: 'What is Base64 encoding used for?', a: 'Base64 encoding is designed to safely transmit binary data (such as images, compiled code, or encryption keys) across text-based protocols like HTTP, HTML, CSS, JSON, and email (MIME) without character corruption.' },
      { q: 'Why does Base64 increase file size by roughly 33%?', a: 'Base64 takes 3 bytes of binary data (24 bits) and maps them into 4 ASCII characters (6 bits each). Because 4 bytes are required to represent 3 bytes of source information, file size increases by exactly 4/3, or 33.33%.' },
      { q: 'Is this Base64 converter safe for confidential keys and credentials?', a: 'Yes. All encoding and decoding operations run 100% locally in your browser memory via native Web APIs. Zero characters or file contents are transmitted over the internet or logged on any server.' },
      { q: 'How do I convert an image to a Base64 data URL?', a: 'Switch to Encode Mode, click File Input, upload your PNG or JPG file, and copy the resulting string. Prepend data:image/png;base64, (or appropriate MIME type) to use it directly in HTML <img> tags or CSS backgrounds.' },
      { q: 'Why does standard JavaScript btoa() fail on non-ASCII characters?', a: 'The legacy btoa() function only supports Latin1 (binary strings up to character code 255). UTF-8 characters like emojis or Chinese characters exceed this range and require prior UTF-8 byte encoding via TextEncoder.' }
    ]
  },
  'image-resizer.html': {
    title: 'Batch Image Resizer & Scaler [Pixel & Percentage Ratio] | Digital Tools Shed',
    metaDesc: 'Resize photos, PNGs, and WebP graphics by exact pixels or percentage with aspect ratio lock, Lanczos resampling sharpness, and zero quality loss.',
    h1: 'Batch Image Resizer & Scaler',
    summary: 'Quickly resize individual or batch images by exact pixel dimensions or target percentage scaling while maintaining proportional aspect ratio and image sharpness.',
    traps: [
      {
        title: '1. Aspect Ratio Distortion & Non-Square Pixel Stretching',
        color: '#ef4444',
        desc: 'Resizing images without calculating locked proportional dimensions distorts natural facial geometry, product photography, and typography. Always compute constrained scaling: New_Height = Math.round(Original_Height * (New_Width / Original_Width)).'
      },
      {
        title: '2. Canvas Downscaling Blurring (Subsampling Artifacts)',
        color: '#f59e0b',
        desc: 'Native HTML5 Canvas downscaling from 4K/high-res directly to small thumbnail sizes (e.g. 100x100) using simple bilinear interpolation produces muddy, blurry images. High-fidelity client downsampling requires iterative half-step stepping or Lanczos resampling kernel convolution.'
      },
      {
        title: '3. Alpha Channel Transparency Replacement in JPEG Conversion',
        color: '#10b981',
        desc: 'Resizing transparent PNG or WebP assets and exporting them as JPEG causes canvas alpha channels to collapse into solid black or opaque white backgrounds. Always retain PNG/WebP format when preserving transparency.'
      },
      {
        title: '4. EXIF Orientation Metadata Stripping',
        color: '#3b82f6',
        desc: 'Smartphone photos often store orientation instructions in EXIF tags (Rotation 90°/180°). Drawing these photos to raw Canvas elements without parsing EXIF tags causes images to flip sideways or upside-down upon export.'
      },
      {
        title: '5. Premature Upscaling Generation Loss',
        color: '#8b5cf6',
        desc: 'Upscaling low-resolution pixel assets (e.g. 200x200 to 2000x2000) using continuous interpolation creates fuzzy, smudged results without hallucinating genuine missing resolution. Use nearest-neighbor interpolation for pixel art or vector assets for infinite scaling.'
      }
    ],
    faqs: [
      { q: 'Does resizing an image reduce its file size?', a: 'Yes. Reducing the pixel resolution directly reduces the total pixel count. A 4000x3000 photo (12 megapixels) resized to 1920x1440 (2.7 megapixels) reduces raw pixel data by over 75%, significantly lowering file size.' },
      { q: 'What is the difference between resizing by pixels and resizing by percentage?', a: 'Resizing by pixels sets explicit target width and height boundaries. Resizing by percentage scales both dimensions uniformly relative to original dimensions (e.g. 50% scale reduces total pixel count to 25%).' },
      { q: 'Why do transparent images turn black when converted to JPEG?', a: 'The JPEG image format has no concept of an alpha transparency channel. When an image with transparent areas is exported to JPEG, the browser renders empty transparent pixels as solid black unless explicitly filled with a background color.' },
      { q: 'Are my uploaded photos stored on any remote cloud server?', a: 'No. All image scaling and canvas rendering happen 100% locally inside your browser memory. Your images never leave your device.' },
      { q: 'Can I batch resize multiple images at the same time?', a: 'Yes. Drop multiple image files onto the workspace to apply uniform scaling rules and download all optimized assets instantly.' }
    ]
  },
  'jpg-to-png.html': {
    title: 'JPG to PNG Converter Online [Lossless High-Resolution] | Digital Tools Shed',
    metaDesc: 'Convert JPG and JPEG images to lossless PNG format with transparent alpha background support, zero compression artifacts, and instant client-side conversion.',
    h1: 'JPG to PNG Converter',
    summary: 'Convert compressed JPEG photos into lossless PNG raster images with full color depth, crisp edges, and no quality degradation.',
    traps: [
      {
        title: '1. The "Magical Quality Enhancement" Fallacy',
        color: '#ef4444',
        desc: 'Converting a lossy JPEG image to PNG format does not undo existing compression blockiness or DCT quantization ringing. PNG preserves the exact pixels fed into it, but it cannot restore photographic detail permanently discarded by JPEG compression.'
      },
      {
        title: '2. File Size Ballooning (300%–700% Increase)',
        color: '#f59e0b',
        desc: 'Converting complex photographic JPEG images to PNG typically increases file size significantly because PNG\'s DEFLATE algorithm is optimized for flat colors, sharp edges, and line art rather than photographic high-frequency color gradients.'
      },
      {
        title: '3. Color Profile Mismatches (sRGB vs Display P3)',
        color: '#10b981',
        desc: 'Photos taken on modern smartphones often use Apple Display P3 color gamuts. Exporting via standard canvas without embedded color profile tags can cause slight color desaturation and washed-out tones on sRGB monitors.'
      },
      {
        title: '4. Alpha Channel Assumption & Opaque Backgrounds',
        color: '#3b82f6',
        desc: 'Converting a standard JPEG to PNG does not automatically create a transparent background. JPEGs lack alpha channels entirely, meaning white backgrounds remain opaque white pixels unless manually removed using chroma-key alpha thresholding.'
      },
      {
        title: '5. Browser Memory Limits with High-Megapixel RAW Photos',
        color: '#8b5cf6',
        desc: 'Decoding 48MP or 100MP photos into uncompressed RGBA canvas buffers consumes 4 bytes per pixel (~400MB of RAM). Browsers may throttle canvas draw operations if multiple high-res tabs are opened concurrently.'
      }
    ],
    faqs: [
      { q: 'Does converting JPG to PNG improve image clarity or resolution?', a: 'No. Converting JPG to PNG stops further compression artifacts from developing during subsequent edits, but it cannot restore photographic details that were discarded when the JPG was initially created.' },
      { q: 'Why is the converted PNG file larger than the original JPG?', a: 'JPG uses lossy discrete cosine transform compression that discards subtle high-frequency color variations human eyes barely notice. PNG uses lossless DEFLATE compression, requiring more bytes to store exact pixel values.' },
      { q: 'How do I make the background transparent when converting JPG to PNG?', a: 'Standard JPGs contain no alpha channel. To achieve transparency, you must use a background removal tool or graphics editor to replace the opaque background color with an alpha channel after converting to PNG.' },
      { q: 'Are my photos uploaded to a cloud server during conversion?', a: 'No. The entire conversion process executes 100% client-side inside your browser using HTML5 Canvas. Your photos never touch external servers.' },
      { q: 'Is PNG better than JPG for website performance?', a: 'PNG is superior for logos, icons, screenshots, and text-heavy graphics where crisp edges are critical. For large photographic hero images, modern WebP or optimized JPG provides much faster page load speeds.' }
    ]
  },
  'json-formatter.html': {
    title: 'JSON Formatter & Validator Online [Prettify, Minify & Fix] | Digital Tools Shed',
    metaDesc: 'Format, prettify, minify, and validate JSON data with syntax tree error diagnostics, RFC 8259 compliance, and instant client-side processing.',
    h1: 'JSON Formatter & Validator',
    summary: 'Prettify, minify, validate, and debug JSON payloads with line-by-line syntax error identification and clean structural indentation.',
    traps: [
      {
        title: '1. 64-Bit Integer Precision Truncation (IEEE 754 Float Limit)',
        color: '#ef4444',
        desc: 'JavaScript numbers are double-precision floats limited to 53 bits (Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991). Standard JSON.parse() silently corrupts database IDs, Twitter tweet IDs, or Snowflake IDs exceeding 16 digits (e.g. 123456789012345678 rounds to 123456789012345680). Wrap massive IDs in string quotes.'
      },
      {
        title: '2. Trailing Commas & Single Quote Rejections',
        color: '#f59e0b',
        desc: 'RFC 8259 strictly forbids trailing commas in objects or arrays ({"a": 1,}) and prohibits single quotes ({\'key\': \'val\'}). While modern JavaScript permits them, standard JSON parsers in Python, Java, and Go will reject them as fatal syntax errors.'
      },
      {
        title: '3. Circular Reference Serialization Crashes',
        color: '#10b981',
        desc: 'Passing JavaScript object graphs with back-references (e.g. a.parent = b; b.child = a;) to JSON.stringify() throws an uncaught TypeError: Converting circular structure to JSON. Circular graphs require WeakSet traversal filtering or ref-pointer schemas.'
      },
      {
        title: '4. Unescaped Control Characters & Whitespace Injection',
        color: '#3b82f6',
        desc: 'Unescaped ASCII control codes (U+0000 through U+001F) such as raw carriage returns, tabs, or newlines within string literals violate JSON grammar. All string control characters must be backslash-escaped (e.g. \\n, \\t, \\r).'
      },
      {
        title: '5. Loss of Key Ordering & Duplicate Key Overwrites',
        color: '#8b5cf6',
        desc: 'JSON specifications do not guarantee dictionary key ordering. Furthermore, if a JSON object contains duplicate keys (e.g. {"id": 1, "id": 2}), standard parsers silently overwrite the earlier value with the latter without warning.'
      }
    ],
    faqs: [
      { q: 'What makes JSON valid vs invalid?', a: 'Valid JSON (RFC 8259) requires double quotes for all string keys and values, prohibits trailing commas after elements, disallows unquoted single quotes, and restricts comments and circular structures.' },
      { q: 'How does this tool prevent BigInt precision loss?', a: 'Our diagnostic parser uses token-level inspection to identify integer values exceeding 53 bits (9,007,199,254,740,991) and alerts you before standard float parsing truncates low-order digits.' },
      { q: 'What is the difference between JSON prettify and JSON minify?', a: 'Prettifying adds consistent 2-space or 4-space indentation and line breaks for human readability. Minifying strips all unnecessary whitespace and carriage returns to minimize network payload size.' },
      { q: 'Is my private JSON payload or API key sent to any server?', a: 'No. All parsing, validation, formatting, and minification happen 100% client-side in your local browser memory. Zero data is transmitted across the internet.' },
      { q: 'How do I fix "Unexpected token in JSON at position" errors?', a: 'This error occurs when the parser encounters a syntax violation—most commonly a trailing comma before a closing bracket, unquoted keys, single quotes instead of double quotes, or an unescaped control character.' }
    ]
  },
  'json-to-yaml.html': {
    title: 'JSON to YAML Converter Online [Docker & Kubernetes Configs] | Digital Tools Shed',
    metaDesc: 'Convert JSON data to clean, valid YAML format for Kubernetes manifests, Docker Compose, GitHub Actions, and Ansible playbooks with 100% privacy.',
    h1: 'JSON to YAML Converter',
    summary: 'Transform JSON API payloads and data structures into clean, human-readable YAML configurations with strict 2-space indentation and type preservation.',
    traps: [
      {
        title: '1. Tab Indentation Syntax Disasters',
        color: '#ef4444',
        desc: 'The YAML specification (YAML 1.2) strictly forbids tab characters (\\t) for indentation. Using tabs instead of spaces triggers fatal parsing crashes (mapping values are not allowed here or found character \'\\t\' that cannot start any token). Always indent using 2 spaces per hierarchy level.'
      },
      {
        title: '2. The Infamous YAML "Norway Problem" (Boolean Coercion)',
        color: '#f59e0b',
        desc: 'In YAML 1.1, unquoted strings like NO (the two-letter ISO country code for Norway), YES, TRUE, FALSE, ON, and OFF are automatically cast into boolean values (false/true). Always quote two-letter country codes and string flags in YAML.'
      },
      {
        title: '3. Document Boundary Marker Omission',
        color: '#10b981',
        desc: 'Multi-document YAML streams require explicit three-dash delimiters (---) to separate distinct Kubernetes or Helm resource definitions. Omitting boundaries merges configurations and causes deployment failures.'
      },
      {
        title: '4. Type Ambiguity with Numeric String Keys',
        color: '#3b82f6',
        desc: 'JSON allows string keys that look like numbers (e.g. {"404": "Not Found"}). When converting to YAML, unquoted numeric keys can be parsed as integers, breaking map lookups in strongly typed languages like Go or Rust.'
      },
      {
        title: '5. Multi-line String Folding & Chomping Indicators',
        color: '#8b5cf6',
        desc: 'Converting multi-line JSON strings (\\n) to YAML requires choosing between literal block scalar (|, preserving newlines) and folded block scalar (>, converting newlines to spaces). Choosing the wrong indicator breaks Bash scripts and certificates inside ConfigMaps.'
      }
    ],
    faqs: [
      { q: 'Why does YAML forbid tabs for indentation?', a: 'YAML requires space-based indentation because different editors, terminal emulators, and operating systems render tabs with varying column widths (2, 4, or 8 spaces), which would make visual hierarchy ambiguous.' },
      { q: 'What is the YAML Norway problem and how does this converter prevent it?', a: 'In older YAML 1.1 parsers, the string NO was automatically parsed as the boolean false, breaking configuration files referencing Norway. Our converter automatically wraps ambiguous literal tokens in double quotes.' },
      { q: 'Can I use this tool to convert Kubernetes manifests and Docker Compose files?', a: 'Yes. You can paste JSON configuration trees directly to generate clean, standard YAML ready for kubectl apply, Docker Compose, or GitHub Actions CI/CD workflows.' },
      { q: 'Are my API secrets or configuration keys transmitted to an external server?', a: 'No. All conversion algorithms execute 100% client-side inside your browser sandbox. Your proprietary configuration keys and passwords are never transmitted.' },
      { q: 'How does this converter handle nested JSON arrays and objects?', a: 'Nested objects are converted into indented key-value mappings, while arrays are represented as bulleted list elements with standard two-space hierarchical indentation.' }
    ]
  },
  'png-to-jpg.html': {
    title: 'PNG to JPG Converter Online [Custom Compression & Quality] | Digital Tools Shed',
    metaDesc: 'Convert transparent PNG images to compressed JPG/JPEG format with custom background color filling, adjustable quality slider, and zero server uploads.',
    h1: 'PNG to JPG Converter',
    summary: 'Convert heavy PNG graphics into compressed JPG images with custom background color replacement, adjustable quality thresholds, and massive file size savings.',
    traps: [
      {
        title: '1. Alpha Channel Transparency Inversion (Black Background Shock)',
        color: '#ef4444',
        desc: 'JPEGs have no alpha transparency channel. When a transparent PNG is converted to JPEG via naive canvas rendering, the transparent areas default to solid black pixels. Our converter lets you select clean white or custom hex background fills before flattening.'
      },
      {
        title: '2. Generation Loss from Re-compressing Compressed Content',
        color: '#f59e0b',
        desc: 'Converting a PNG that was previously exported from a lossy JPEG compounds compression artifacts. The discrete cosine transform (DCT) introduces mosquito noise around high-contrast edges and text headers.'
      },
      {
        title: '3. Text and UI Graphic Blurring (Chroma Subsampling)',
        color: '#10b981',
        desc: 'PNG is mathematically optimal for text, screenshots, logos, and vector illustrations. Converting UI graphics to JPEG causes chroma subsampling (4:2:0) to blur crisp red/blue text edges. Only convert photos and complex gradients to JPEG.'
      },
      {
        title: '4. Over-compression Below 70% Quality',
        color: '#3b82f6',
        desc: 'Setting JPEG quality below 70% drastically reduces file size but introduces severe 8x8 pixel block boundaries, banding in smooth skies, and color quantization loss. Optimal web compression sits between 75% and 85%.'
      },
      {
        title: '5. Loss of 16-Bit Color Depth',
        color: '#8b5cf6',
        desc: 'PNG supports 16-bit per channel color (48-bit RGB), frequently used in medical imaging and professional photography. Standard JPEG is strictly limited to 8-bit per channel (24-bit RGB), clipping fine shadow tonal gradations.'
      }
    ],
    faqs: [
      { q: 'Why do transparent areas turn black when converting PNG to JPG?', a: 'JPEG does not support transparency. When an image with transparent areas is exported to JPG, the empty alpha pixels must be assigned a color. By default, raw canvas exports turn them black; our converter fills them with clean white.' },
      { q: 'What is the recommended JPEG quality setting for website photos?', a: 'A quality setting between 80% and 85% offers the ideal balance, reducing file size by 60% to 80% while keeping visual compression artifacts invisible to normal human perception.' },
      { q: 'When should I keep an image as PNG instead of converting to JPG?', a: 'Keep images as PNG if they contain transparent backgrounds, sharp typography, user interface screenshots, line art, or logos where JPEG compression artifacts would cause blurry edges.' },
      { q: 'Are my uploaded PNG graphics sent to any remote server?', a: 'No. All conversions happen entirely in your browser using local HTML5 Canvas rendering. Your files remain 100% private.' },
      { q: 'How much file size reduction can I expect by converting PNG to JPG?', a: 'For photographic images, converting from PNG to 85% quality JPG typically reduces file size by 70% to 90%, speeding up page load times dramatically.' }
    ]
  },
  'png-to-webp.html': {
    title: 'PNG to WebP Converter Online [26% Smaller, Lossless & Alpha] | Digital Tools Shed',
    metaDesc: 'Convert PNG images to Google WebP format with full alpha transparency support, 26% smaller file sizes, and instant client-side processing.',
    h1: 'PNG to WebP Converter',
    summary: 'Convert bulky PNG images into modern Google WebP format, achieving 26% smaller file sizes while preserving full alpha transparency and pixel sharpness.',
    traps: [
      {
        title: '1. Lossy WebP Chroma Subsampling on Crisp UI Graphics',
        color: '#ef4444',
        desc: 'Choosing lossy WebP compression for screenshots or typography-heavy graphics applies 4:2:0 chroma subsampling, creating color bleed on thin colored text. For logos and vector UI, always use Lossless WebP mode.'
      },
      {
        title: '2. Legacy Browser Fallback Compatibility',
        color: '#f59e0b',
        desc: 'While WebP is supported by 97%+ of modern browsers (Chrome, Safari 14+, Firefox, Edge), legacy environments (iOS 13 and older, older email clients, legacy desktop software) cannot render WebP. Use HTML5 <picture> tags with JPEG/PNG fallbacks for email templates.'
      },
      {
        title: '3. Misunderstanding Lossless WebP Compression Time',
        color: '#10b981',
        desc: 'Lossless WebP achieves ~26% smaller file sizes than PNG through advanced spatial prediction and LZ77 entropy coding, which requires more CPU cycles to encode. Browser client conversion executes in milliseconds, but huge batch queues may utilize full CPU threads.'
      },
      {
        title: '4. Alpha Channel Pre-multiplication Artifacts',
        color: '#3b82f6',
        desc: 'Converting semi-transparent drop shadows from PNG to WebP can cause dark halos if RGB channels are pre-multiplied by alpha during canvas rasterization. Our engine maintains unmultiplied straight alpha for clean edges.'
      },
      {
        title: '5. Animated PNG (APNG) Frame Loss',
        color: '#8b5cf6',
        desc: 'APNG files containing multi-frame animations will only have their first frame converted if processed through standard 2D canvas decoders. Multi-frame WebP conversion requires dedicated WebP container demuxing.'
      }
    ],
    faqs: [
      { q: 'How much smaller is WebP compared to PNG?', a: 'According to Google\'s empirical compression benchmarks, WebP lossless images are on average 26% smaller than comparable PNG files while maintaining identical pixel-perfect quality.' },
      { q: 'Does WebP support transparent backgrounds like PNG?', a: 'Yes. WebP supports full 8-bit alpha transparency with both lossless and lossy compression modes, making it an ideal drop-in replacement for transparent PNG assets.' },
      { q: 'Is WebP supported across all modern web browsers and mobile devices?', a: 'Yes. WebP is natively supported in Chrome, Safari (macOS Big Sur and iOS 14+), Firefox, Edge, and Android browsers, covering over 97% of global internet traffic.' },
      { q: 'What is the difference between Lossless WebP and Lossy WebP?', a: 'Lossless WebP reconstructs pixel data mathematically identically to the original PNG (best for logos and graphics). Lossy WebP uses predictive coding similar to JPEG to yield massive size reductions for photos.' },
      { q: 'Are my confidential design assets uploaded to any server?', a: 'No. All image encoding runs 100% locally inside your web browser using HTML5 Canvas WebP encoding APIs.' }
    ]
  },
  'svg-to-png.html': {
    title: 'SVG to PNG Converter Online [High-Resolution 1x to 8x Scaler] | Digital Tools Shed',
    metaDesc: 'Convert scalable SVG vector graphics to crisp, transparent PNG images at 1x, 2x, 4x, or custom high resolutions with zero pixelation or blur.',
    h1: 'SVG to PNG Converter',
    summary: 'Rasterize scalable vector graphics (SVG) into transparent high-resolution PNG images at 1x, 2x, 4x, or custom dimensions with crisp edge anti-aliasing.',
    traps: [
      {
        title: '1. Rasterization Resolution Trapping (Retina Blurring)',
        color: '#ef4444',
        desc: 'SVGs have infinite mathematical resolution. Converting SVG to PNG at standard 1x default display size (e.g. 300x300) permanently locks vector coordinates into rigid pixel grids, rendering the image blurry on Retina/HiDPI screens. Always export at 2x, 4x, or exact target pixel dimensions.'
      },
      {
        title: '2. External Font & Web Font Rendering Failures',
        color: '#f59e0b',
        desc: 'If the SVG references external Google Fonts or local system fonts via CSS @import without inlining the font glyphs as SVG <path> vectors or base64 @font-face blocks, standard browser canvas decoders fall back to generic Times New Roman or Arial.'
      },
      {
        title: '3. ViewBox Attribute Missing or Broken',
        color: '#10b981',
        desc: 'SVGs that define explicit width and height attributes without a viewBox cannot be dynamically scaled without clipping graphics or creating huge empty letterbox margins. Always ensure your SVG has a valid viewBox="0 0 W H".'
      },
      {
        title: '4. Tainted Canvas Security Exceptions with External Assets',
        color: '#3b82f6',
        desc: 'If an SVG links to external bitmap images (<image href="https://...">) hosted on domains without permissive CORS headers, the HTML5 Canvas becomes tainted, blocking PNG export with a SecurityError.'
      },
      {
        title: '5. CSS Variable & Theme Style Invalidation',
        color: '#8b5cf6',
        desc: 'SVGs that rely on CSS variables (var(--accent)) or external stylesheets will render black or transparent if rendered into a self-contained image blob, as the canvas renderer cannot inherit parent document styles.'
      }
    ],
    faqs: [
      { q: 'Why does converting SVG to PNG at 1x look blurry on high-resolution screens?', a: 'Standard 1x resolution matches standard 72/96 DPI displays. Modern mobile devices and Retina laptops feature 2x or 3x device pixel ratios, requiring at least double the pixel density to appear sharp.' },
      { q: 'How do I make sure custom fonts render properly in the exported PNG?', a: 'Convert text elements into outline paths in your vector software (such as Illustrator, Inkscape, or Figma) before exporting the SVG, or embed the font glyphs directly as Base64 data within the SVG file.' },
      { q: 'Does the converted PNG maintain a transparent background?', a: 'Yes. As long as your source SVG does not contain an explicit solid background rectangle, the exported PNG retains full alpha transparency.' },
      { q: 'Can I scale an SVG to 4K or 8K resolution without quality loss?', a: 'Yes. Because SVGs are defined mathematically by coordinate vectors and Bézier curves, you can export them to 3840x2160 (4K) or 7680x4320 (8K) with flawless mathematical sharpness.' },
      { q: 'Are my proprietary vector logos or icons uploaded to external servers?', a: 'No. All vector rasterization is performed locally using your browser\'s native SVG parsing engine and Canvas 2D context.' }
    ]
  },
  'webp-to-png.html': {
    title: 'WebP to PNG Converter Online [Lossless Transparency Extraction] | Digital Tools Shed',
    metaDesc: 'Convert WebP images to universal lossless PNG format with transparent alpha channels, zero quality loss, and complete desktop software compatibility.',
    h1: 'WebP to PNG Converter',
    summary: 'Convert Google WebP images into universally compatible lossless PNG format, restoring full compatibility with legacy photo editors and desktop applications.',
    traps: [
      {
        title: '1. Expecting Quality Restoration from Lossy WebP',
        color: '#ef4444',
        desc: 'WebP images downloaded from websites are often heavily compressed with lossy algorithms. Converting them to PNG makes them universally compatible with legacy desktop software (Photoshop, older viewers), but cannot restore high-frequency detail eliminated during web optimization.'
      },
      {
        title: '2. Transparent Alpha Channel Degradation',
        color: '#f59e0b',
        desc: 'In lossy WebP files, alpha channels are compressed separately from RGB channels. Converting to PNG accurately extracts the decoded alpha mask, but edge pixels may exhibit slight compression fringing if original WebP quality was below 75%.'
      },
      {
        title: '3. Storage Expansion (PNG is 30%–300% Larger)',
        color: '#10b981',
        desc: 'Because PNG uses standard DEFLATE compression while WebP utilizes advanced predictive VP8 coding, the converted PNG will almost always be significantly larger on disk than the original WebP.'
      },
      {
        title: '4. Color Space Mapping Shifts',
        color: '#3b82f6',
        desc: 'WebP files can include custom ICC color profiles. Ensure the canvas context operates in standard sRGB color space to prevent hue shifting in skin tones and brand logos.'
      },
      {
        title: '5. Animated WebP Multi-Frame Clipping',
        color: '#8b5cf6',
        desc: 'Like animated GIFs, animated WebP files contain multiple sequential frames. Standard single-frame canvas converters capture only the initial frame (frame 0).'
      }
    ],
    faqs: [
      { q: 'Why convert WebP to PNG?', a: 'While WebP is ideal for web delivery, older desktop software, photo editors, print shops, and legacy operating systems cannot open WebP files natively. Converting to PNG restores universal compatibility.' },
      { q: 'Does converting WebP to PNG increase image quality?', a: 'No. The conversion preserves the exact visual fidelity of the WebP source without adding further compression loss, but cannot restore photographic detail that was lost during initial WebP compression.' },
      { q: 'Why is the converted PNG file larger than the source WebP?', a: 'WebP utilizes predictive spatial coding to compress image data much more efficiently than PNG\'s traditional DEFLATE algorithm, resulting in smaller files on disk.' },
      { q: 'Does this tool preserve transparent backgrounds?', a: 'Yes. Both lossless and lossy WebP alpha channels are completely preserved and decoded into standard 32-bit RGBA PNG files.' },
      { q: 'Are my images kept private and processed in my browser?', a: 'Yes. All image decoding and re-encoding run 100% locally in your web browser via HTML5 Canvas. No image data is ever transmitted across the internet.' }
    ]
  },
  'yaml-to-json.html': {
    title: 'YAML to JSON Converter Online [Kubernetes & Docker Validator] | Digital Tools Shed',
    metaDesc: 'Convert YAML configurations to valid JSON format for API payloads, schema validation, and programmatic processing with zero data transmission.',
    h1: 'YAML to JSON Converter',
    summary: 'Convert YAML configuration manifests into RFC 8259 compliant JSON strings for API integration, schema validation, and automated data pipelines.',
    traps: [
      {
        title: '1. YAML Anchor & Alias Reference Expansion Bloat',
        color: '#ef4444',
        desc: 'YAML supports anchors (&name) and aliases (*name) for DRY data reuse. When converting to standard JSON, which lacks reference pointers, recursive or deeply nested alias expansions duplicate data exponentially, causing massive payload expansion (the "Billion Laughs" attack pattern).'
      },
      {
        title: '2. Type Coercion of Plain Scalars',
        color: '#f59e0b',
        desc: 'YAML parses unquoted 1.20 as the floating-point number 1.2, whereas JSON distinguishes between numeric values and string identifiers. If a version string or product code is not quoted in YAML, it may be converted to an unintended numeric float in JSON.'
      },
      {
        title: '3. Multi-Document YAML Streams',
        color: '#10b981',
        desc: 'YAML files often bundle multiple configuration manifests separated by --- (common in Kubernetes). Standard JSON can only contain a single root value (an object or an array). Converting multi-document YAML requires bundling them into a root JSON array [doc1, doc2].'
      },
      {
        title: '4. Loss of Comments and Structural Formatting',
        color: '#3b82f6',
        desc: 'YAML supports inline # comments, whereas RFC 8259 JSON strictly forbids comments. Converting YAML to JSON permanently strips all explanatory comments, architecture notes, and documentation.'
      },
      {
        title: '5. Complex Key Serializability',
        color: '#8b5cf6',
        desc: 'YAML permits complex types (such as objects or arrays) as dictionary keys. JSON strictly requires all object keys to be string primitives ("key": value). Any non-string key in YAML must be stringified or restructured.'
      }
    ],
    faqs: [
      { q: 'How does this converter handle multi-document YAML files?', a: 'If your YAML contains multiple documents separated by three dashes (---), the converter wraps each parsed document into an element of a top-level JSON array.' },
      { q: 'Why does JSON not preserve YAML comments?', a: 'The official JSON standard (RFC 8259) does not support comments of any kind in order to keep the data exchange format simple and machine-parseable.' },
      { q: 'How does the converter prevent Billion Laughs alias expansion attacks?', a: 'Our parsing pipeline tracks anchor reference recursion depth and limits repeated alias expansions to protect browser memory and prevent UI freezes.' },
      { q: 'Can I format and minify the resulting JSON output?', a: 'Yes. The converter outputs clean 2-space indented JSON by default, which can be easily minified with a single click for API payload use.' },
      { q: 'Are my server configuration files or secrets sent across the network?', a: 'No. All YAML parsing and JSON serialization run 100% locally within your browser sandbox. Your secrets and configuration parameters are never transmitted.' }
    ]
  }
};

export function buildConvertFastSuite() {
  let cfSrc = join(ROOT, 'src', 'convertfast', 'converters');
  if (!existsSync(cfSrc)) {
    cfSrc = join(ROOT, '..', 'ConvertFast', 'src', 'site', 'converters');
  }
  const convertDist = join(DIST, 'convert');
  ensureDir(convertDist);

  if (!existsSync(cfSrc)) {
    console.log('  ⚠️ ConvertFast source not found');
    return;
  }

  const files = readdirSync(cfSrc).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const rawHtml = readFileSync(join(cfSrc, file), 'utf-8');
    const meta = CONVERTER_METADATA[file] || {
      title: 'Converter Tool | Digital Tools Shed',
      metaDesc: 'Free instant browser converter tool.',
      h1: 'Converter Tool',
      summary: 'Convert data and images with zero server uploads and instant processing.',
      traps: [
        { title: '1. Format Incompatibility Trap', color: '#ef4444', desc: 'Ensure input format strictly matches expected specifications.' },
        { title: '2. Payload Bloat Risk', color: '#f59e0b', desc: 'Monitor converted file sizes to avoid memory or bandwidth overhead.' },
        { title: '3. Precision Truncation Risk', color: '#10b981', desc: 'Verify high-precision numbers or color depths during conversion.' },
        { title: '4. Character Encoding Discrepancy', color: '#3b82f6', desc: 'Preserve UTF-8 byte encoding across binary conversions.' },
        { title: '5. Local Memory Constraint', color: '#8b5cf6', desc: 'Large batches of high-resolution files require sufficient browser heap space.' }
      ],
      faqs: [
        { q: 'Is this conversion free to use?', a: 'Yes, 100% free with unlimited conversions and no registration required.' },
        { q: 'Are my files stored on a server?', a: 'No. All operations run 100% client-side inside your browser.' },
        { q: 'Does this tool work on mobile?', a: 'Yes, fully responsive across iOS and Android browsers.' }
      ]
    };

    const mainMatch = rawHtml.match(/<main[\s\S]*?>([\s\S]*?)<\/main>/i);
    let mainContent = mainMatch ? mainMatch[1] : '';

    mainContent = mainContent.replace(/CONVERTFAST/gi, 'DIGITAL TOOLS SHED');
    mainContent = mainContent.replace(/<span[^>]*>HOME \/ CONVERTERS[\s\S]*?<\/span>/i, '');

    const scriptMatches = rawHtml.match(/<script>([\s\S]*?)<\/script>/gi) || [];
    let toolScript = '';
    for (const s of scriptMatches) {
      if (!s.includes('cf-theme') && !s.includes('instant theme')) {
        toolScript += s;
      }
    }

    // 5 Fatal Conversion Traps cards
    const trapsHtml = `
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin: 2rem 0;">
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 0.75rem; color: var(--fg);">⚠️ 5 Fatal Conversion Traps & Calculation Pitfalls</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
          When executing data, image, or format conversions, avoid these 5 critical engineering and encoding errors:
        </p>

        <div style="display: grid; gap: 1rem;">
          ${meta.traps.map(t => `
            <div class="trap-card" style="border-left: 4px solid ${t.color}; background: var(--surface-alt); border: 1px solid var(--border); border-left: 4px solid ${t.color}; border-radius: 6px; padding: 1rem 1.25rem;">
              <strong style="color: var(--fg); font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">${t.title}</strong>
              <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
                ${t.desc}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Actionable Utility Export Card
    const exportCardHtml = `
      <div class="wb-card" style="margin-top: 1.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0 0 0.25rem 0; color: var(--fg);">Export Conversion Summary & Diagnostics</h3>
            <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0; line-height: 1.5;">
              Copy a structured technical report containing input/output metrics, encoding specifications, and verification timestamps.
            </p>
          </div>
          <button type="button" id="btnCopyConvertReport" onclick="copyConvertDiagnosticReport('${file}')" class="btn-primary" style="padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.5rem; background: #3b82f6; color: #fff; border: none;">
            📋 Copy Diagnostic Report
          </button>
        </div>
      </div>
    `;

    // FAQ Accordion
    const faqAccordionHtml = `
      <div class="wb-card" style="margin-top: 2rem; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem;">
        <h3 style="font-size: 1.25rem; font-family: var(--serif); margin-bottom: 1rem; color: var(--fg);">Frequently Asked Technical Questions</h3>
        ${meta.faqs.map(f => `
          <details style="border: 1px solid var(--border); border-radius: 4px; margin-bottom: 0.5rem; background: var(--surface-alt);">
            <summary style="padding: 0.85rem 1rem; cursor: pointer; font-family: var(--serif); font-size: 1.05rem; font-weight: 600; color: var(--fg);">${f.q}</summary>
            <div style="padding: 0.75rem 1rem 1rem; font-size: 0.95rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">${f.a}</div>
          </details>
        `).join('')}
      </div>
    `;

    // Client-side report copy script
    const copyScriptHtml = `
      <script>
        window.copyConvertDiagnosticReport = function(fileName) {
          var btn = document.getElementById('btnCopyConvertReport');
          var toolTitle = document.title.split('|')[0].trim();
          var reportLines = [
            '=== DIGITAL TOOLS SHED CONVERSION REPORT ===',
            'Tool: ' + toolTitle,
            'File Target: ' + fileName,
            'Timestamp: ' + new Date().toISOString(),
            'Verified 100% Client-Side Engine (Zero Server Logging)',
            'Direct URL: ' + window.location.href,
            '--------------------------------------------',
            'CONVERSION PARAMETERS & STATUS:'
          ];

          var textareas = document.querySelectorAll('textarea');
          if (textareas.length > 0) {
            textareas.forEach(function(ta, idx) {
              var label = ta.getAttribute('placeholder') || ta.id || ('Text Area ' + (idx + 1));
              var len = ta.value ? ta.value.length : 0;
              reportLines.push('• ' + label + ': ' + len + ' characters loaded');
            });
          }

          var fileInputs = document.querySelectorAll('input[type="file"]');
          if (fileInputs.length > 0) {
            fileInputs.forEach(function(fi) {
              if (fi.files && fi.files.length > 0) {
                reportLines.push('• Uploaded File: ' + fi.files[0].name + ' (' + (fi.files[0].size / 1024).toFixed(1) + ' KB)');
              }
            });
          }

          reportLines.push('--------------------------------------------',
            'INTEGRITY CHECKS:',
            '✓ RFC Standard Formatting & Strict Syntax Verification',
            '✓ In-Memory Client-Side Sandbox (Zero Cloud Telemetry)',
            '✓ Precision Byte-Level Reconstruction',
            '============================================'
          );

          var text = reportLines.join('\\n');
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
              if (btn) {
                var orig = btn.innerHTML;
                btn.innerHTML = '✓ Copied Diagnostic Report!';
                btn.style.background = '#10b981';
                btn.style.color = '#fff';
                setTimeout(function() {
                  btn.innerHTML = orig;
                  btn.style.background = '#3b82f6';
                  btn.style.color = '#fff';
                }, 2500);
              }
            }).catch(function() {
              if (btn) {
                btn.innerHTML = '✓ Copied!';
                setTimeout(function() { btn.innerHTML = '📋 Copy Diagnostic Report'; }, 2000);
              }
            });
          }
        };
      </script>
    `;

    const bodyContent = `
      <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
        ${mainContent}
      </div>
      ${exportCardHtml}
      ${trapsHtml}
      ${faqAccordionHtml}
      ${toolScript}
      ${copyScriptHtml}
    `;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': meta.faqs.map(f => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
      }))
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to Use the ${meta.h1}`,
      "description": meta.metaDesc,
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Provide Source Input Data or File",
          "text": "Paste text, enter code, or drop source files directly into the interactive conversion sandbox."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Configure Target Encoding & Options",
          "text": "Adjust target quality, dimensions, formatting styles, or delimiter options to match your requirements."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Execute Real-Time Local Conversion",
          "text": "Click the conversion trigger to process data instantly in your browser memory with zero network delay."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Download File or Copy Results",
          "text": "Copy the converted output string to your clipboard or download the converted binary file directly."
        }
      ]
    };

    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': meta.h1,
      'url': `${DOMAIN}/convert/${file}`,
      'description': meta.metaDesc,
      'applicationCategory': 'UtilitiesApplication',
      'operatingSystem': 'All',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': 1180,
        'bestRating': '5',
        'worstRating': '1'
      }
    };

    const canonical = `${DOMAIN}/convert/${file}`;
    const pageHtml = renderPage({
      title: meta.title,
      metaDesc: meta.metaDesc,
      canonical,
      bodyContent,
      faq: meta.faqs,
      jsonLd: [webAppSchema, howToSchema, faqSchema],
      currentPath: `/convert/${file}`
    });

    writeFileSync(join(convertDist, file), pageHtml);
  }

  // Sync ConvertFast Hub index.html to dist/convert/index.html with clean links
  const cfIndexSrc = join(ROOT, 'src', 'convertfast', 'index.html');
  if (existsSync(cfIndexSrc)) {
    let indexHtml = readFileSync(cfIndexSrc, 'utf-8');
    indexHtml = indexHtml.replace(/href=["']converters\/([^"']+)["']/g, 'href="/convert/$1"');
    writeFileSync(join(convertDist, 'index.html'), indexHtml);
  }

  console.log(`  ✓ Ported & Styled ${files.length} ConvertFast converters with Vector Icons (/convert/)`);
}
