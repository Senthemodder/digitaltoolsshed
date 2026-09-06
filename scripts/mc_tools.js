import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildMinecraftTools() {
  const mcDir = join(DIST, 'mc');
  ensureDir(mcDir);

  // ─── 1. MINECRAFT NBT EDITOR ────────────────────────────────────────────────
  const nbtBody = `
    <style>
      .nbt-tree { font-family: var(--mono); font-size: 0.85rem; line-height: 1.6; }
      .nbt-node { margin-left: 1.25rem; border-left: 1px dashed var(--border); padding-left: 0.5rem; }
      .nbt-tag { display: inline-flex; align-items: center; gap: 0.35rem; margin: 0.15rem 0; }
      .nbt-badge { font-size: 0.7rem; padding: 0.1rem 0.4rem; border-radius: 3px; font-weight: bold; text-transform: uppercase; }
      .tag-compound { background: rgba(168, 85, 247, 0.2); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.4); }
      .tag-list { background: rgba(59, 130, 246, 0.2); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.4); }
      .tag-string { background: rgba(34, 197, 94, 0.2); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.4); }
      .tag-num { background: rgba(6, 182, 212, 0.2); color: #06b6d4; border: 1px solid rgba(6, 182, 212, 0.4); }
      .tag-arr { background: rgba(245, 158, 11, 0.2); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.4); }
      .nbt-key { font-weight: bold; color: var(--fg); }
      .nbt-val-input { background: var(--bg); color: var(--fg); border: 1px solid var(--border); padding: 0.15rem 0.4rem; border-radius: 3px; font-family: var(--mono); font-size: 0.8rem; }
      .nbt-toggle { cursor: pointer; user-select: none; color: var(--text-muted); font-size: 0.75rem; margin-right: 0.2rem; }
      .tab-btn { background: var(--surface); color: var(--text-muted); border: 1px solid var(--border); padding: 0.5rem 1rem; cursor: pointer; font-family: var(--mono); font-size: 0.85rem; }
      .tab-btn.active { background: var(--btn-bg, #3b82f6); color: #fff; border-color: var(--btn-bg, #3b82f6); }
    </style>

    <div class="article-container" style="max-width: 1050px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; NBT Editor
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft NBT Editor & Viewer (In-Browser)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Open, inspect, edit, and convert Minecraft Named Binary Tag (NBT) files online. Supports Java & Bedrock format, <code>level.dat</code>, playerdata, <code>.nbt</code>, <code>.schematic</code>, and <code>.mcstructure</code> with automatic Gzip decompression.
        </p>
      </header>

      <!-- DROP ZONE -->
      <div id="dropZone" style="border: 2px dashed var(--border); background: var(--surface); padding: 2.5rem 1.5rem; border-radius: 8px; text-align: center; cursor: pointer; transition: border-color 0.2s; margin-bottom: 1.5rem;">
        <input type="file" id="fileInput" style="display: none;" accept=".dat,.nbt,.schematic,.mcstructure,.mca" />
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
        <div style="font-size: 1.1rem; font-weight: bold; margin-bottom: 0.4rem;">Drop your Minecraft NBT or .DAT file here</div>
        <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Supports level.dat, playerdata .dat, .nbt, .schematic, .mcstructure</div>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary" onclick="document.getElementById('fileInput').click(); event.stopPropagation();">Browse Files</button>
          <button class="btn-secondary" onclick="loadSampleNBT(); event.stopPropagation();">Load Sample Player NBT</button>
        </div>
      </div>

      <!-- MAIN WORKSPACE -->
      <div id="nbtWorkspace" style="display: none;">
        <!-- TOOLBAR -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; background: var(--surface); border: 1px solid var(--border); padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="text" id="nbtSearch" placeholder="<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Filter tag names..." class="search-input" style="padding: 0.4rem 0.75rem; font-size: 0.85rem; width: 220px;" oninput="filterNBT()" />
            <button onclick="expandAll(true)" style="background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); padding: 0.4rem 0.75rem; font-size: 0.75rem; border-radius: 3px; cursor: pointer;">Expand All</button>
            <button onclick="expandAll(false)" style="background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); padding: 0.4rem 0.75rem; font-size: 0.75rem; border-radius: 3px; cursor: pointer;">Collapse All</button>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="downloadNBT(true)" class="btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Download .DAT (Gzipped)</button>
            <button onclick="downloadNBT(false)" class="btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">Download Uncompressed</button>
            <button onclick="downloadJSON()" class="btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">Export JSON</button>
          </div>
        </div>

        <!-- TABS -->
        <div style="display: flex; gap: 0; margin-bottom: 0;">
          <button id="tabTreeBtn" class="tab-btn active" onclick="switchTab('tree')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M12 22v-7"/><path d="M9 3l-4 7h14L15 3H9z"/><path d="M7 10l-3 5h16l-3-5"/></svg> Tree Inspector</button>
          <button id="tabSNBTBtn" class="tab-btn" onclick="switchTab('snbt')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> Stringified NBT (SNBT)</button>
          <button id="tabJSONBtn" class="tab-btn" onclick="switchTab('json')">{ } JSON</button>
        </div>

        <!-- TAB: TREE -->
        <div id="tabTree" style="background: var(--surface); border: 1px solid var(--border); border-top: none; padding: 1.25rem; border-radius: 0 0 6px 6px; min-height: 400px; max-height: 700px; overflow-y: auto;">
          <div id="treeContainer" class="nbt-tree"></div>
        </div>

        <!-- TAB: SNBT -->
        <div id="tabSNBT" style="display: none; background: var(--surface); border: 1px solid var(--border); border-top: none; padding: 1.25rem; border-radius: 0 0 6px 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Minecraft /give and /data compatible syntax:</span>
            <button id="copySnbtBtn" onclick="copySNBT()" class="btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Copy SNBT</button>
          </div>
          <textarea id="snbtOutput" style="width: 100%; height: 400px; font-family: var(--mono); font-size: 0.85rem; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; resize: vertical;" readonly></textarea>
        </div>

        <!-- TAB: JSON -->
        <div id="tabJSON" style="display: none; background: var(--surface); border: 1px solid var(--border); border-top: none; padding: 1.25rem; border-radius: 0 0 6px 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Standard JSON Representation:</span>
            <button id="copyJsonBtn" onclick="copyNbtJson(this)" class="btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Copy JSON</button>
          </div>
          <textarea id="jsonOutput" style="width: 100%; height: 400px; font-family: var(--mono); font-size: 0.85rem; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; resize: vertical;" readonly></textarea>
        </div>
      </div>
    </div>

    <!-- PAKO GZIP CDN -->
    
      <!-- STEP-BY-STEP NBT SPECIFICATION & BINARY DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin: 2rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Minecraft NBT Binary Specification & Tag Architecture</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.25rem;">
          Named Binary Tag (NBT) is Minecraft's proprietary hierarchical binary serialization format designed by Markus Persson. Every NBT payload consists of structured tags following strict type identifiers:
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; font-family: var(--mono); font-size: 0.8rem;">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #a855f7;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">TAG_Compound (Type ID: 10)</strong>
            Sequential collection of named child tags terminated by a trailing <code>TAG_End (0)</code>. Forms the root of all world, player, and entity files.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">TAG_List (Type ID: 9)</strong>
            Homogeneous ordered list of unnamed tags. Encoded with a 1-byte element tag type followed by a 4-byte payload length (N).
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">TAG_String (Type ID: 8)</strong>
            Length-prefixed modified UTF-8 string. Prefixed with a 2-byte unsigned short length header followed by raw character bytes.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.25rem;">Primitive Numbers (Types 1-6)</strong>
            Strictly sized primitives: <code>Byte (1B)</code>, <code>Short (2B)</code>, <code>Int (4B)</code>, <code>Long (8B)</code>, <code>Float (4B IEEE 754)</code>, <code>Double (8B IEEE 754)</code>.
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & NBT PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical NBT Serialization Traps & Pitfalls</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Endianness Mismatch (Java Big-Endian vs Bedrock Little-Endian)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Minecraft Java Edition serializes all multi-byte numbers in Network Big-Endian format (most significant byte first). Minecraft Bedrock Edition serializes NBT in Little-Endian format (least significant byte first). Opening a Bedrock <code>.mcstructure</code> in a Java-only editor reads 4-byte string lengths backwards, resulting in multi-gigabyte memory allocation crashes.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Bedrock level.dat 8-Byte Uncompressed Header Offset</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Unlike Java <code>level.dat</code> (which starts with standard Gzip magic bytes <code>0x1F 0x8B</code>), Bedrock <code>level.dat</code> begins with an uncompressed 8-byte header: a 4-byte Little-Endian version int (e.g. <code>10</code>) followed by a 4-byte payload size. Attempting to parse the file from byte 0 fails immediately because the root compound is offset by 8 bytes.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Gzip vs Zlib vs Raw Stream Confusion</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              World files use three distinct compression formats. <code>level.dat</code> uses Gzip (magic <code>0x1F 0x8B</code>), Anvil region files (<code>.mca</code>) use raw Zlib deflate (magic <code>0x78 0x9C</code>), and Bedrock structure files (<code>.mcstructure</code>) use uncompressed raw Little-Endian NBT. Passing a Zlib chunk into a Gzip decompressor triggers header CRC checksum failure.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. Type Mutation in Numeric Flags (Byte vs Int)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              NBT tags are strongly typed in the game engine. Mutating boolean flags like <code>NoGravity: 1b</code> (TAG_Byte) into <code>NoGravity: 1</code> (TAG_Int) causes the internal entity deserializer to reject the tag, resetting mob physics, despawning armor stands, or erasing custom mob behaviors.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Array Tag vs List Tag Structural Confusion</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              <code>TAG_Byte_Array</code> (7) and <code>TAG_Int_Array</code> (11) store flat contiguous buffers of raw numbers. In contrast, <code>TAG_List</code> (9) stores sequences of generic NBT tags (such as item compounds in inventories). Confusing a list of compounds with an array tag results in total player inventory erasure upon world loading.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Minecraft NBT</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is Minecraft NBT format?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Named Binary Tag (NBT) is a tree data structure format used by Minecraft to store arbitrary game data—including player inventories, level settings, entity properties, and block entity data—with minimal storage footprint.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the difference between Java NBT and Bedrock NBT?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Java Edition encodes multi-byte numbers using Network Big-Endian order, while Bedrock Edition encodes NBT using Little-Endian order. Bedrock <code>level.dat</code> files also feature an uncompressed 8-byte header before the NBT stream.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do I open and edit a Bedrock level.dat file?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Simply drag and drop your <code>level.dat</code> into this editor. The editor automatically detects Bedrock's 8-byte header and Little-Endian encoding, decrypts the tag hierarchy, and allows seamless in-browser editing and re-saving.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is SNBT (Stringified NBT)?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              SNBT is a human-readable text representation of NBT data resembling JSON, with type suffixes like <code>1b</code> (byte), <code>1s</code> (short), <code>1L</code> (long), and <code>1.0f</code> (float). It is commonly used in Minecraft commands such as <code>/give</code> and <code>/summon</code>.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can editing NBT files corrupt my Minecraft world save?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Yes. Incorrect tag types, missing required compound tags, or out-of-bounds coordinates can cause worlds to crash on load. Always create a backup copy of your <code>level.dat</code> or world save before modifying NBT tags.
            </div>
          </div>
        </div>
      </div>
<script src="/assets/pako.min.js"></script>

    <script>
      var parsedNBT = null;
      var rootName = '';
      var isBedrock = false;

      var TAG = {
        END: 0, BYTE: 1, SHORT: 2, INT: 3, LONG: 4,
        FLOAT: 5, DOUBLE: 6, BYTE_ARRAY: 7, STRING: 8,
        LIST: 9, COMPOUND: 10, INT_ARRAY: 11, LONG_ARRAY: 12
      };

      var TAG_NAMES = {
        1: 'Byte', 2: 'Short', 3: 'Int', 4: 'Long',
        5: 'Float', 6: 'Double', 7: 'Byte[]', 8: 'String',
        9: 'List', 10: 'Compound', 11: 'Int[]', 12: 'Long[]'
      };

      var TAG_CLASSES = {
        1: 'tag-num', 2: 'tag-num', 3: 'tag-num', 4: 'tag-num',
        5: 'tag-num', 6: 'tag-num', 7: 'tag-arr', 8: 'tag-string',
        9: 'tag-list', 10: 'tag-compound', 11: 'tag-arr', 12: 'tag-arr'
      };

      function NBTReader(buffer, littleEndian) {
        this.view = new DataView(buffer);
        this.offset = 0;
        this.le = !!littleEndian;
      }
      NBTReader.prototype.readByte = function() { return this.view.getInt8(this.offset++); };
      NBTReader.prototype.readShort = function() { var v = this.view.getInt16(this.offset, this.le); this.offset += 2; return v; };
      NBTReader.prototype.readInt = function() { var v = this.view.getInt32(this.offset, this.le); this.offset += 4; return v; };
      NBTReader.prototype.readLong = function() {
        var high = this.view.getInt32(this.offset, this.le);
        var low = this.view.getUint32(this.offset + 4, this.le);
        this.offset += 8;
        return (BigInt(high) << 32n) | BigInt(low);
      };
      NBTReader.prototype.readFloat = function() { var v = this.view.getFloat32(this.offset, this.le); this.offset += 4; return v; };
      NBTReader.prototype.readDouble = function() { var v = this.view.getFloat64(this.offset, this.le); this.offset += 8; return v; };
      NBTReader.prototype.readString = function() {
        var len = this.le ? this.readShort() : this.view.getUint16(this.offset, false);
        if (!this.le) this.offset += 2;
        if (len <= 0) return '';
        var bytes = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, len);
        this.offset += len;
        return new TextDecoder('utf-8').decode(bytes);
      };
      NBTReader.prototype.readTagPayload = function(type) {
        switch (type) {
          case TAG.BYTE: return this.readByte();
          case TAG.SHORT: return this.readShort();
          case TAG.INT: return this.readInt();
          case TAG.LONG: return this.readLong().toString();
          case TAG.FLOAT: return parseFloat(this.readFloat().toFixed(4));
          case TAG.DOUBLE: return parseFloat(this.readDouble().toFixed(6));
          case TAG.BYTE_ARRAY: {
            var len = this.readInt();
            var arr = [];
            for (var i = 0; i < len; i++) arr.push(this.readByte());
            return arr;
          }
          case TAG.STRING: return this.readString();
          case TAG.LIST: {
            var elemType = this.readByte();
            var len = this.readInt();
            var list = [];
            for (var i = 0; i < len; i++) {
              list.push({ type: elemType, value: this.readTagPayload(elemType) });
            }
            return { elemType: elemType, list: list };
          }
          case TAG.COMPOUND: {
            var comp = {};
            while (this.offset < this.view.byteLength) {
              var childType = this.readByte();
              if (childType === TAG.END) break;
              var childName = this.readString();
              comp[childName] = { type: childType, value: this.readTagPayload(childType) };
            }
            return comp;
          }
          case TAG.INT_ARRAY: {
            var len = this.readInt();
            var arr = [];
            for (var i = 0; i < len; i++) arr.push(this.readInt());
            return arr;
          }
          case TAG.LONG_ARRAY: {
            var len = this.readInt();
            var arr = [];
            for (var i = 0; i < len; i++) arr.push(this.readLong().toString());
            return arr;
          }
          default: throw new Error('Unknown NBT tag type: ' + type);
        }
      };

      function NBTWriter() { this.bytes = []; }
      NBTWriter.prototype.writeByte = function(v) { this.bytes.push(v & 0xFF); };
      NBTWriter.prototype.writeShort = function(v) { this.bytes.push((v >> 8) & 0xFF, v & 0xFF); };
      NBTWriter.prototype.writeInt = function(v) { this.bytes.push((v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF); };
      NBTWriter.prototype.writeLong = function(v) {
        var b = BigInt(v);
        for (var i = 7; i >= 0; i--) {
          this.bytes.push(Number((b >> BigInt(i * 8)) & 0xFFn));
        }
      };
      NBTWriter.prototype.writeFloat = function(v) {
        var buf = new ArrayBuffer(4);
        new DataView(buf).setFloat32(0, v, false);
        var u8 = new Uint8Array(buf);
        for (var i = 0; i < 4; i++) this.bytes.push(u8[i]);
      };
      NBTWriter.prototype.writeDouble = function(v) {
        var buf = new ArrayBuffer(8);
        new DataView(buf).setFloat64(0, v, false);
        var u8 = new Uint8Array(buf);
        for (var i = 0; i < 8; i++) this.bytes.push(u8[i]);
      };
      NBTWriter.prototype.writeString = function(str) {
        var encoded = new TextEncoder().encode(str);
        this.writeShort(encoded.length);
        for (var i = 0; i < encoded.length; i++) this.bytes.push(encoded[i]);
      };
      NBTWriter.prototype.writeTag = function(name, tagObj) {
        this.writeByte(tagObj.type);
        if (name !== null) this.writeString(name);
        this.writePayload(tagObj.type, tagObj.value);
      };
      NBTWriter.prototype.writePayload = function(type, val) {
        switch (type) {
          case TAG.BYTE: this.writeByte(parseInt(val, 10) || 0); break;
          case TAG.SHORT: this.writeShort(parseInt(val, 10) || 0); break;
          case TAG.INT: this.writeInt(parseInt(val, 10) || 0); break;
          case TAG.LONG: this.writeLong(val); break;
          case TAG.FLOAT: this.writeFloat(parseFloat(val) || 0); break;
          case TAG.DOUBLE: this.writeDouble(parseFloat(val) || 0); break;
          case TAG.STRING: this.writeString(String(val)); break;
          case TAG.BYTE_ARRAY: {
            this.writeInt(val.length);
            for (var i = 0; i < val.length; i++) this.writeByte(val[i]);
            break;
          }
          case TAG.INT_ARRAY: {
            this.writeInt(val.length);
            for (var i = 0; i < val.length; i++) this.writeInt(val[i]);
            break;
          }
          case TAG.LONG_ARRAY: {
            this.writeInt(val.length);
            for (var i = 0; i < val.length; i++) this.writeLong(val[i]);
            break;
          }
          case TAG.LIST: {
            this.writeByte(val.elemType);
            this.writeInt(val.list.length);
            for (var i = 0; i < val.list.length; i++) {
              this.writePayload(val.elemType, val.list[i].value);
            }
            break;
          }
          case TAG.COMPOUND: {
            var keys = Object.keys(val);
            for (var i = 0; i < keys.length; i++) {
              this.writeTag(keys[i], val[keys[i]]);
            }
            this.writeByte(TAG.END);
            break;
          }
        }
      };
      NBTWriter.prototype.toUint8Array = function() { return new Uint8Array(this.bytes); };

      var dropZone = document.getElementById('dropZone');
      var fileInput = document.getElementById('fileInput');

      dropZone.addEventListener('click', function() { fileInput.click(); });
      dropZone.addEventListener('dragover', function(e) { e.preventDefault(); dropZone.style.borderColor = 'var(--btn-bg, #3b82f6)'; });
      dropZone.addEventListener('dragleave', function() { dropZone.style.borderColor = 'var(--border)'; });
      dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border)';
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
      });
      fileInput.addEventListener('change', function(e) {
        if (e.target.files.length) handleFile(e.target.files[0]);
      });

      function handleFile(file) {
        var reader = new FileReader();
        reader.onload = function(e) { parseBuffer(e.target.result); };
        reader.readAsArrayBuffer(file);
      }

      function parseBuffer(arrayBuffer) {
        try {
          var u8 = new Uint8Array(arrayBuffer);
          if (u8[0] === 0x1F && u8[1] === 0x8B) {
            u8 = window.pako.ungzip(u8);
          } else if (u8[0] === 0x78) {
            u8 = window.pako.inflate(u8);
          }

          var reader = new NBTReader(u8.buffer);
          var rootType = reader.readByte();

          if (rootType !== TAG.COMPOUND) {
            reader = new NBTReader(u8.buffer, true);
            reader.offset = 8;
            rootType = reader.readByte();
            if (rootType === TAG.COMPOUND) isBedrock = true;
          }

          if (rootType !== TAG.COMPOUND) {
            showNbtStatus('Invalid NBT File: Root tag must be TAG_Compound (ID 10). Found tag ID: ' + rootType, true);
            return;
          }

          rootName = reader.readString();
          parsedNBT = reader.readTagPayload(TAG.COMPOUND);

          renderAll();
          document.getElementById('nbtWorkspace').style.display = 'block';
        } catch (err) {
          showNbtStatus('Error parsing NBT: ' + err.message, true);
          console.error(err);
        }
      }

      function loadSampleNBT() {
        rootName = 'PlayerInventory';
        parsedNBT = {
          Health: { type: TAG.FLOAT, value: 20.0 },
          foodLevel: { type: TAG.INT, value: 20 },
          Score: { type: TAG.INT, value: 1540 },
          playerGameType: { type: TAG.INT, value: 0 },
          Dimension: { type: TAG.STRING, value: 'minecraft:overworld' },
          Pos: {
            type: TAG.LIST,
            value: {
              elemType: TAG.DOUBLE,
              list: [
                { type: TAG.DOUBLE, value: 128.5 },
                { type: TAG.DOUBLE, value: 64.0 },
                { type: TAG.DOUBLE, value: -256.3 }
              ]
            }
          },
          Inventory: {
            type: TAG.LIST,
            value: {
              elemType: TAG.COMPOUND,
              list: [
                {
                  type: TAG.COMPOUND,
                  value: {
                    Slot: { type: TAG.BYTE, value: 0 },
                    id: { type: TAG.STRING, value: 'minecraft:diamond_sword' },
                    Count: { type: TAG.BYTE, value: 1 },
                    tag: {
                      type: TAG.COMPOUND,
                      value: {
                        Damage: { type: TAG.INT, value: 12 },
                        display: {
                          type: TAG.COMPOUND,
                          value: { Name: { type: TAG.STRING, value: 'Excalibur' } }
                        }
                      }
                    }
                  }
                },
                {
                  type: TAG.COMPOUND,
                  value: {
                    Slot: { type: TAG.BYTE, value: 1 },
                    id: { type: TAG.STRING, value: 'minecraft:golden_apple' },
                    Count: { type: TAG.BYTE, value: 64 }
                  }
                }
              ]
            }
          }
        };
        renderAll();
        document.getElementById('nbtWorkspace').style.display = 'block';
      }

      function renderAll() {
        renderTree();
        renderSNBT();
        renderJSON();
      }

      function renderTree() {
        var container = document.getElementById('treeContainer');
        container.innerHTML = '';
        var rootDiv = document.createElement('div');
        var count = Object.keys(parsedNBT).length;
        rootDiv.innerHTML = '<div class="nbt-tag"><span class="nbt-badge tag-compound">Compound</span> <span class="nbt-key">' + (rootName || 'ROOT') + '</span> (' + count + ' entries)</div>';
        var childrenDiv = document.createElement('div');
        childrenDiv.className = 'nbt-node';
        buildCompoundDOM(parsedNBT, childrenDiv, '');
        rootDiv.appendChild(childrenDiv);
        container.appendChild(rootDiv);
      }

      function buildCompoundDOM(compound, parentElem, path) {
        var keys = Object.keys(compound);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var item = compound[key];
          var curPath = path ? (path + '.' + key) : key;
          var row = document.createElement('div');
          row.setAttribute('data-key', key.toLowerCase());

          var badgeClass = TAG_CLASSES[item.type] || 'tag-num';
          var typeName = TAG_NAMES[item.type] || 'Tag';

          if (item.type === TAG.COMPOUND) {
            var count = Object.keys(item.value).length;
            row.innerHTML = '<div class="nbt-tag"><span class="nbt-toggle" onclick="toggleNode(this)">▼</span> <span class="nbt-badge ' + badgeClass + '">' + typeName + '</span> <span class="nbt-key">' + key + '</span> (' + count + ' entries)</div>';
            var subNode = document.createElement('div');
            subNode.className = 'nbt-node';
            buildCompoundDOM(item.value, subNode, curPath);
            row.appendChild(subNode);
          } else if (item.type === TAG.LIST) {
            var count = item.value.list.length;
            var elemName = TAG_NAMES[item.value.elemType] || 'Item';
            row.innerHTML = '<div class="nbt-tag"><span class="nbt-toggle" onclick="toggleNode(this)">▼</span> <span class="nbt-badge ' + badgeClass + '">List[' + elemName + ']</span> <span class="nbt-key">' + key + '</span> (' + count + ' items)</div>';
            var subNode = document.createElement('div');
            subNode.className = 'nbt-node';
            for (var j = 0; j < item.value.list.length; j++) {
              var elem = item.value.list[j];
              var listRow = document.createElement('div');
              if (elem.type === TAG.COMPOUND) {
                listRow.innerHTML = '<div class="nbt-tag"><span class="nbt-toggle" onclick="toggleNode(this)">▼</span> <span class="nbt-badge tag-compound">Compound</span> <span class="nbt-key">[' + j + ']</span></div>';
                var listSub = document.createElement('div');
                listSub.className = 'nbt-node';
                buildCompoundDOM(elem.value, listSub, curPath + '[' + j + ']');
                listRow.appendChild(listSub);
              } else {
                listRow.innerHTML = '<div class="nbt-tag"><span class="nbt-badge ' + TAG_CLASSES[elem.type] + '">' + TAG_NAMES[elem.type] + '</span> <span class="nbt-key">[' + j + ']:</span> <input class="nbt-val-input" value="' + elem.value + '" onchange="updateListVal(\'' + curPath + '\', ' + j + ', this.value)" /></div>';
              }
              subNode.appendChild(listRow);
            }
            row.appendChild(subNode);
          } else {
            row.innerHTML = '<div class="nbt-tag"><span class="nbt-badge ' + badgeClass + '">' + typeName + '</span> <span class="nbt-key">' + key + ':</span> <input class="nbt-val-input" value="' + item.value + '" onchange="updateVal(\'' + curPath + '\', this.value)" /></div>';
          }
          parentElem.appendChild(row);
        }
      }

      function toggleNode(el) {
        var node = el.closest('.nbt-tag').nextElementSibling;
        if (!node) return;
        if (node.style.display === 'none') {
          node.style.display = 'block';
          el.textContent = '▼';
        } else {
          node.style.display = 'none';
          el.textContent = '▶';
        }
      }

      function expandAll(expand) {
        document.querySelectorAll('.nbt-node').forEach(function(node) {
          node.style.display = expand ? 'block' : 'none';
        });
        document.querySelectorAll('.nbt-toggle').forEach(function(t) {
          t.textContent = expand ? '▼' : '▶';
        });
      }

      function filterNBT() {
        var q = document.getElementById('nbtSearch').value.toLowerCase().trim();
        document.querySelectorAll('#treeContainer [data-key]').forEach(function(el) {
          var k = el.getAttribute('data-key');
          el.style.display = (!q || k.includes(q)) ? 'block' : 'none';
        });
      }

      function updateVal(path, newVal) {
        var parts = path.split('.');
        var cur = parsedNBT;
        for (var i = 0; i < parts.length - 1; i++) {
          cur = cur[parts[i]].value;
        }
        var last = parts[parts.length - 1];
        var tag = cur[last];
        if (tag.type === TAG.INT || tag.type === TAG.SHORT || tag.type === TAG.BYTE) {
          tag.value = parseInt(newVal, 10) || 0;
        } else if (tag.type === TAG.FLOAT || tag.type === TAG.DOUBLE) {
          tag.value = parseFloat(newVal) || 0;
        } else {
          tag.value = newVal;
        }
        renderSNBT();
        renderJSON();
      }

      function updateListVal(path, idx, newVal) {
        var parts = path.split('.');
        var cur = parsedNBT;
        for (var i = 0; i < parts.length; i++) {
          cur = cur[parts[i]].value;
        }
        cur.list[idx].value = newVal;
        renderSNBT();
        renderJSON();
      }

      function toSNBT(tag) {
        switch (tag.type) {
          case TAG.BYTE: return tag.value + 'b';
          case TAG.SHORT: return tag.value + 's';
          case TAG.INT: return tag.value.toString();
          case TAG.LONG: return tag.value + 'L';
          case TAG.FLOAT: return tag.value + 'f';
          case TAG.DOUBLE: return tag.value + 'd';
          case TAG.STRING: return JSON.stringify(tag.value);
          case TAG.BYTE_ARRAY: return '[B;' + tag.value.join('b,') + (tag.value.length ? 'b' : '') + ']';
          case TAG.INT_ARRAY: return '[I;' + tag.value.join(',') + ']';
          case TAG.LONG_ARRAY: return '[L;' + tag.value.map(function(v) { return v + 'L'; }).join(',') + ']';
          case TAG.LIST: return '[' + tag.value.list.map(function(e) { return toSNBT(e); }).join(',') + ']';
          case TAG.COMPOUND: {
            var entries = Object.keys(tag.value).map(function(k) { return k + ':' + toSNBT(tag.value[k]); });
            return '{' + entries.join(',') + '}';
          }
          default: return '';
        }
      }

      function toPlainObj(tag) {
        switch (tag.type) {
          case TAG.COMPOUND: {
            var o = {};
            var keys = Object.keys(tag.value);
            for (var i = 0; i < keys.length; i++) o[keys[i]] = toPlainObj(tag.value[keys[i]]);
            return o;
          }
          case TAG.LIST: return tag.value.list.map(function(e) { return toPlainObj(e); });
          default: return tag.value;
        }
      }

      function renderSNBT() {
        if (!parsedNBT) return;
        var snbt = toSNBT({ type: TAG.COMPOUND, value: parsedNBT });
        document.getElementById('snbtOutput').value = snbt;
      }

      function renderJSON() {
        if (!parsedNBT) return;
        var obj = toPlainObj({ type: TAG.COMPOUND, value: parsedNBT });
        document.getElementById('jsonOutput').value = JSON.stringify(obj, null, 2);
      }

      function copySNBT() {
        navigator.clipboard.writeText(document.getElementById('snbtOutput').value).then(function() {
          var b = document.getElementById('copySnbtBtn');
          if (b) {
            var orig = b.textContent;
            b.textContent = '✓ Copied SNBT!';
            setTimeout(function() { b.textContent = orig; }, 2000);
          }
        });
      }

      function showNbtStatus(msg, isErr) {
        var st = document.getElementById('nbtStatus');
        if (st) {
          st.textContent = msg;
          st.style.display = 'block';
          st.style.color = isErr ? '#ef4444' : '#10b981';
        }
      }

      function copyNbtJson(btn) {
        navigator.clipboard.writeText(document.getElementById('jsonOutput').value).then(function() {
          var orig = btn.textContent;
          btn.textContent = '✓ Copied JSON!';
          setTimeout(function() { btn.textContent = orig; }, 2000);
        });
      }

      function toggleFaq(btn) {
        var ans = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (ans.style.display === 'block') {
          ans.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          ans.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      function switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.getElementById('tabTree').style.display = 'none';
        document.getElementById('tabSNBT').style.display = 'none';
        document.getElementById('tabJSON').style.display = 'none';

        if (tab === 'tree') {
          document.getElementById('tabTreeBtn').classList.add('active');
          document.getElementById('tabTree').style.display = 'block';
        } else if (tab === 'snbt') {
          document.getElementById('tabSNBTBtn').classList.add('active');
          document.getElementById('tabSNBT').style.display = 'block';
        } else if (tab === 'json') {
          document.getElementById('tabJSONBtn').classList.add('active');
          document.getElementById('tabJSON').style.display = 'block';
        }
      }

      function downloadNBT(gzipped) {
        if (!parsedNBT) return;
        var writer = new NBTWriter();
        writer.writeTag(rootName, { type: TAG.COMPOUND, value: parsedNBT });
        var bytes = writer.toUint8Array();

        if (gzipped) {
          bytes = window.pako.gzip(bytes);
        }

        var blob = new Blob([bytes], { type: 'application/octet-stream' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (rootName || 'data') + (gzipped ? '.dat' : '.nbt');
        a.click();
      }

      function downloadJSON() {
        if (!parsedNBT) return;
        var json = document.getElementById('jsonOutput').value;
        var blob = new Blob([json], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = (rootName || 'nbt_data') + '.json';
        a.click();
      }
    </script>
  `;

  writeFileSync(join(mcDir, 'nbt-editor.html'), renderPage({
    title: 'Minecraft NBT Editor & Viewer Online (Java & Bedrock) | Digital Tools Shed',
    metaDesc: 'Free in-browser Minecraft NBT editor: view and edit level.dat, playerdata, .nbt, .schematic, and .mcstructure files with Gzip support and SNBT export.',
    canonical: `${DOMAIN}/mc/nbt-editor`,
    bodyContent: nbtBody,
    currentPath: '/mc/nbt-editor',
    faqSchema: [
      {
        q: "What is Minecraft NBT format?",
        a: "Named Binary Tag is Minecraft's hierarchical binary serialization format for storing world, player, and entity data."
      },
      {
        q: "What is the difference between Java NBT and Bedrock NBT?",
        a: "Java uses Big-Endian byte order while Bedrock uses Little-Endian byte order with an 8-byte uncompressed header on level.dat."
      },
      {
        q: "How do I open and edit a Bedrock level.dat file?",
        a: "Drag and drop the level.dat file into the editor; it automatically handles Bedrock headers and Little-Endian byte order."
      },
      {
        q: "What is SNBT (Stringified NBT)?",
        a: "SNBT is a human-readable JSON-like text representation with type suffixes used in Minecraft commands."
      },
      {
        q: "Can editing NBT files corrupt my Minecraft world save?",
        a: "Yes, invalid types or corrupted tags can cause load crashes; always back up your world save before editing."
      }
    ]
  }));



  // ─── 2. UUID GENERATOR ─────────────────────────────────────────────────────
  const uuidBody = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; UUID Generator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">Minecraft Bedrock Add-On Utility</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft Bedrock UUID Generator (RFC 4122 v4)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Generate cryptographically compliant RFC 4122 version 4 UUID pairs formatted specifically for Minecraft Bedrock Behavior Packs, Resource Packs, and <code>manifest.json</code> headers and modules.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center;">
          <button type="button" class="btn-primary" id="genUuidBtn" onclick="refreshUUIDs()" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer;">
            🔄 Generate New UUIDs
          </button>
          <button type="button" class="btn-secondary" id="copyPairBtn" onclick="copyAllUUIDs()" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.6rem 1.25rem; border-radius: 4px; font-family: var(--mono); font-size: 0.9rem; cursor: pointer;">
            📋 Copy Header & Module Pair
          </button>
        </div>

        <div style="font-family: var(--mono); display: grid; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="border: 1px solid var(--border); padding: 1.25rem; background: var(--surface-alt); border-radius: 6px; border-left: 4px solid #3b82f6;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: bold;">Header UUID (Pack Root UUID)</span>
              <button type="button" id="copyHeaderBtn" onclick="copyHeaderUUID()" class="btn-sm" style="background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Copy</button>
            </div>
            <div id="headerUuid" style="font-size: 1.2rem; font-weight: bold; color: #3b82f6; word-break: break-all;"></div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Used in <code>header.uuid</code> and as dependency target for companion packs</div>
          </div>

          <div style="border: 1px solid var(--border); padding: 1.25rem; background: var(--surface-alt); border-radius: 6px; border-left: 4px solid #10b981;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <span style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: bold;">Module UUID (Content Payload UUID)</span>
              <button type="button" id="copyModuleBtn" onclick="copyModuleUUID()" class="btn-sm" style="background: var(--surface); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">Copy</button>
            </div>
            <div id="moduleUuid" style="font-size: 1.2rem; font-weight: bold; color: #10b981; word-break: break-all;"></div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Used in <code>modules[0].uuid</code> to identify the data or resources module</div>
          </div>
        </div>

        <!-- BATCH UUID GENERATOR TABLE -->
        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold;">Quick Multi-UUID Pool (5 Spare UUIDs):</span>
            <button type="button" id="copyPoolBtn" onclick="copyPoolUUIDs()" class="btn-sm" style="background: var(--surface); border: 1px solid var(--border); padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; cursor: pointer;">Copy Pool</button>
          </div>
          <div id="uuidPool" style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted); line-height: 1.8; word-break: break-all;"></div>
        </div>
      </div>

      <!-- MATHEMATICAL RFC 4122 DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">RFC 4122 v4 Entropy Math & Collision Probability</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Binary Structure & Fixed Bitfields</strong>
            An RFC 4122 UUID contains 128 total bits formatted as 32 hexadecimal characters across five hyphen-delimited segments:
            $$8\text{-}\text{hex} - 4\text{-}\text{hex} - 4\text{-}\text{hex} - 4\text{-}\text{hex} - 12\text{-}\text{hex}$$
            In Version 4, 4 bits are reserved for the version identifier (<code>0100</code> = 4), and 2 bits are reserved for the variant (<code>10</code> = RFC 4122).
            This leaves exactly <strong>122 bits of cryptographically random entropy</strong>.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Collision Search Space (The Birthday Paradox)</strong>
            $$\text{Total Permutations} = 2^{122} \approx 5.3169 \times 10^{36}$$
            By the Birthday Bound approximation (p \approx n^2 / (2 \times 2^{122})), you would need to generate <strong>2.3 quintillion ((2.3 \times 10^{18})) UUIDs</strong> to have a one-in-a-billion chance of generating a single collision.
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & BEDROCK UUID PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Bedrock Add-On UUID Traps</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. Identical Header & Module UUID Collision</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              A pack's <code>header.uuid</code> and <code>modules[0].uuid</code> MUST be completely different. Copying the header UUID into the module block causes Minecraft Bedrock to reject the manifest as duplicate or invalid, preventing the pack from loading in world settings.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Reusing UUIDs Across Different Add-On Projects</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Minecraft Bedrock tracks installed add-ons by their UUID in the internal LevelDB database, not by directory name. If you copy-paste a manifest template into a new project without generating fresh UUIDs, the game will overwrite your original pack or fail with silent import errors.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Forgetting Dependency Header UUID Binding</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              When linking a Behavior Pack to its companion Resource Pack in <code>dependencies</code>, you must specify the Resource Pack's <strong>Header UUID</strong>, NOT its module UUID. Binding the module UUID breaks automatic pack association on multiplayer worlds.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. Omitting Semantic Version Bumps on Modified Packs</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              When publishing updates to an existing pack, you keep the same UUIDs but MUST increment the version array (e.g. <code>[1, 0, 0]</code> to <code>[1, 0, 1]</code>). Without a version bump, players on dedicated servers will execute stale cached scripts and textures.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Case Sensitivity & Formatting Non-Compliance</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Minecraft Bedrock JSON schemas require standard lowercase, hyphen-separated 8-4-4-4-12 hex format. Adding curly braces <code>{...}</code>, omitting hyphens, or using uppercase characters can cause validation failures on consoles and mobile devices.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Bedrock UUIDs</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why does Minecraft Bedrock require UUIDs?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              UUIDs (Universally Unique Identifiers) provide a collision-free global identifier for every add-on pack. This allows the Bedrock engine to resolve pack versions, dependencies, and caching across multiple platforms and dedicated servers regardless of file naming.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the difference between a header UUID and a module UUID?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              The <code>header.uuid</code> identifies the top-level add-on package, while the <code>modules[].uuid</code> identifies the specific content module (e.g. data or resources). A pack can contain multiple modules, each requiring its own distinct module UUID.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can two add-ons share the same UUID?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              No. Sharing UUIDs causes package collisions. Bedrock will either overwrite existing packs or silently reject the duplicate. Always generate unique UUIDs for every new add-on pack.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do I link a Behavior Pack to a Resource Pack?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Add a <code>dependencies</code> array into the Behavior Pack's <code>manifest.json</code> containing the Resource Pack's <code>header.uuid</code> and version: <code>{"uuid": "RP-HEADER-UUID", "version": [1, 0, 0]}</code>.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What UUID version does Minecraft Bedrock support?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Minecraft Bedrock officially uses standard RFC 4122 Version 4 random UUIDs. The 13th character is always <code>4</code> and the 17th character is one of <code>8</code>, <code>9</code>, <code>a</code>, or <code>b</code>.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleFaq(btn) {
        var ans = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (ans.style.display === 'block') {
          ans.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          ans.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function refreshUUIDs() {
        document.getElementById('headerUuid').innerText = genUUID();
        document.getElementById('moduleUuid').innerText = genUUID();

        var poolHtml = '';
        for (var i = 0; i < 5; i++) {
          poolHtml += '<div>' + (i + 1) + '. <code>' + genUUID() + '</code></div>';
        }
        document.getElementById('uuidPool').innerHTML = poolHtml;
      }

      function copyHeaderUUID() {
        var u = document.getElementById('headerUuid').innerText;
        navigator.clipboard.writeText(u).then(function() {
          var btn = document.getElementById('copyHeaderBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      function copyModuleUUID() {
        var u = document.getElementById('moduleUuid').innerText;
        navigator.clipboard.writeText(u).then(function() {
          var btn = document.getElementById('copyModuleBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      function copyAllUUIDs() {
        var h = document.getElementById('headerUuid').innerText;
        var m = document.getElementById('moduleUuid').innerText;
        var text = 'Header UUID: ' + h + '\nModule UUID: ' + m;
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyPairBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Pair Copied!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      function copyPoolUUIDs() {
        var poolDiv = document.getElementById('uuidPool');
        var uuids = [];
        poolDiv.querySelectorAll('code').forEach(function(el) {
          uuids.push(el.innerText);
        });
        navigator.clipboard.writeText(uuids.join('\n')).then(function() {
          var btn = document.getElementById('copyPoolBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Pool Copied!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', refreshUUIDs);
      refreshUUIDs();
    </script>
  `;

  writeFileSync(join(mcDir, 'uuid-gen.html'), renderPage({
    title: 'Minecraft UUID Generator for Bedrock Add-Ons | Digital Tools Shed',
    metaDesc: 'Generate random RFC 4122 v4 UUID pairs for Minecraft Bedrock behavior pack and resource pack manifest.json headers and modules.',
    canonical: `${DOMAIN}/mc/uuid-gen`,
    bodyContent: uuidBody,
    currentPath: '/mc/uuid-gen',
    faqSchema: [
      {
        q: "Why does Minecraft Bedrock require UUIDs?",
        a: "UUIDs provide a globally unique identifier for add-on packs, allowing the game engine to manage versions and dependencies across platforms."
      },
      {
        q: "What is the difference between a header UUID and a module UUID?",
        a: "The header UUID identifies the top-level package, while module UUIDs identify individual data or resource components."
      },
      {
        q: "Can two add-ons share the same UUID?",
        a: "No, sharing UUIDs causes collisions where Bedrock overwrites or rejects duplicate packs."
      },
      {
        q: "How do I link a Behavior Pack to a Resource Pack?",
        a: "Add the Resource Pack's header UUID to the Behavior Pack's dependencies array."
      },
      {
        q: "What UUID version does Minecraft Bedrock support?",
        a: "Minecraft Bedrock officially supports RFC 4122 Version 4 random UUIDs."
      }
    ]
  }));

  // ─── 3. MANIFEST GENERATOR ─────────────────────────────────────────────────
  const manifestBody = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; Manifest Generator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Minecraft Bedrock Add-On Utility</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Bedrock manifest.json Generator (Format Version 2)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Generate valid, production-ready <code>manifest.json</code> definitions for Minecraft Bedrock Behavior Packs, Resource Packs, Script API modules (<code>@minecraft/server</code>), and Skin Packs with automatic UUID pair generation.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Pack Name</label>
            <input type="text" id="packName" value="My Custom Pack" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" oninput="updateManifest()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Pack Type</label>
            <select id="packType" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" onchange="updateManifest()">
              <option value="data">Behavior Pack (data)</option>
              <option value="resources">Resource Pack (resources)</option>
              <option value="script">Behavior Pack + Script API (@minecraft/server)</option>
              <option value="skin_pack">Skin Pack (skin_pack)</option>
            </select>
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Min Engine Version</label>
            <select id="minEngine" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" onchange="updateManifest()">
              <option value="1.21.0" selected>1.21.0 (Tricky Trials / Current Stable)</option>
              <option value="1.20.80">1.20.80</option>
              <option value="1.20.0">1.20.0 (Trails & Tales)</option>
            </select>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold;">manifest.json Live Preview:</span>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" class="btn-sm" onclick="regenUUIDsAndManifest()" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.3rem 0.75rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer;">🔄 New UUIDs</button>
            <button type="button" class="btn-primary" id="copyManifestBtn" onclick="copyManifestJson()" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Copy JSON</button>
          </div>
        </div>
        <textarea id="manifestOutput" style="width: 100%; height: 320px; padding: 1rem; font-family: var(--mono); font-size: 0.85rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 6px; resize: vertical;" readonly></textarea>
      </div>

      <!-- STEP-BY-STEP MANIFEST SCHEMA SPECIFICATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Bedrock Manifest Schema Architecture & Specification</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. The <code>header</code> Identity Object</strong>
            Defines the pack identity: <code>name</code> (display string), <code>description</code>, <code>uuid</code> (global identifier), <code>version</code> (e.g. <code>[1, 0, 0]</code>), and <code>min_engine_version</code>. The engine version instructs Bedrock whether modern component schemas (like block format version 1.21+) are supported.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. The <code>modules</code> Payload Array</strong>
            Declares the content types packaged inside: <code>data</code> for server-side game rules/entities/blocks, <code>resources</code> for client-side textures/models/sounds, <code>script</code> for JavaScript/TypeScript modules, or <code>skin_pack</code> for custom skins.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #a855f7;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. The <code>dependencies</code> Cross-Pack Binding</strong>
            Enforces strict package links. Linking a companion Resource Pack requires specifying its <code>header.uuid</code>. Integrating the Bedrock Script API requires declaring module dependencies such as <code>@minecraft/server</code> version <code>2.8.0</code>.
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & MANIFEST PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Bedrock Manifest.json Pitfalls</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. Suffix Discrepancies in Pack Names ("BP" vs "RP")</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Never add "BP" or "RP" suffixes to your pack name inside <code>header.name</code>. Both Behavior and Resource packs should share the EXACT SAME name (e.g. "Kingdoms of Legend"). Minecraft automatically separates them by type in the UI, and differing names breaks unified pack grouping in world settings.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Format Version Downgrading (<code>format_version: 1</code>)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Legacy templates from 2018 used <code>format_version: 1</code>. Modern Bedrock features—including subpack selection, custom block components, and Script API modules—strictly require <code>format_version: 2</code>. Downgrading format versions silently disables modern engine hooks.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Script API (@minecraft/server) Version Drift</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              When importing <code>@minecraft/server</code> in scripts, the version specified in <code>dependencies</code> must match the runtime version supported by your <code>min_engine_version</code>. Mismatched major/minor versions cause world loading to abort with <code>failed to create context</code>.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. Duplicate UUID Collisions Across BP and RP</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              If you generate a manifest for your Behavior Pack and copy the same file into your Resource Pack, both packs share the same UUID. Minecraft Bedrock will reject the world save with "Duplicate pack detected" and refuse to load custom textures.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Omitting Capabilities for Scripting</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              If your add-on uses Script API eval operations or special experimental APIs, you must include <code>"capabilities": ["script_eval"]</code> in the <code>header</code>. Omitting required capabilities triggers security sandbox exceptions in the Bedrock JavaScript V8/Hermes runtime.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Bedrock manifest.json</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is a manifest.json file in Minecraft Bedrock?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              The <code>manifest.json</code> file is the root configuration file located in the base folder of every Minecraft Bedrock add-on. It informs the game engine of the pack's name, UUID, version, content modules, and dependencies.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do I add Script API (@minecraft/server) support?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Select "Behavior Pack + Script API" in the generator. This adds a <code>script</code> module with <code>entry: "scripts/main.js"</code> and declares a dependency on <code>@minecraft/server</code> version <code>2.8.0</code>.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is min_engine_version and why is it critical?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              <code>min_engine_version</code> defines the lowest Minecraft client version allowed to run the pack. If a player on version 1.20 attempts to load a pack requiring 1.21, Minecraft displays a warning and disables unsupported features.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why should Behavior and Resource packs share the same name?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Sharing identical names (without -BP or -RP suffixes) provides clean branding in the world settings menu, preventing visual clutter and ensuring players easily identify the paired packs.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can I edit my manifest after creating a world?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Yes. You can edit descriptions, add dependencies, or bump the version number. However, changing the <code>header.uuid</code> will cause Minecraft to treat it as a new pack, breaking existing world associations.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleFaq(btn) {
        var ans = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (ans.style.display === 'block') {
          ans.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          ans.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      var cachedHeaderUUID = null;
      var cachedModuleUUID = null;

      function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function regenUUIDsAndManifest() {
        cachedHeaderUUID = genUUID();
        cachedModuleUUID = genUUID();
        updateManifest();
      }

      function updateManifest() {
        if (!cachedHeaderUUID) cachedHeaderUUID = genUUID();
        if (!cachedModuleUUID) cachedModuleUUID = genUUID();

        var name = document.getElementById('packName').value || 'My Custom Pack';
        var type = document.getElementById('packType').value;
        var engParts = (document.getElementById('minEngine').value || '1.21.0').split('.').map(function(n) { return parseInt(n, 10); });

        var manifest = {
          format_version: 2,
          header: {
            name: name,
            description: name + " created with Digital Tools Shed",
            uuid: cachedHeaderUUID,
            version: [1, 0, 0],
            min_engine_version: engParts
          },
          modules: []
        };

        if (type === 'data') {
          manifest.modules.push({
            type: "data",
            uuid: cachedModuleUUID,
            version: [1, 0, 0]
          });
        } else if (type === 'resources') {
          manifest.modules.push({
            type: "resources",
            uuid: cachedModuleUUID,
            version: [1, 0, 0]
          });
        } else if (type === 'script') {
          manifest.modules.push({
            type: "data",
            uuid: cachedModuleUUID,
            version: [1, 0, 0]
          });
          manifest.modules.push({
            type: "script",
            language: "javascript",
            uuid: genUUID(),
            version: [1, 0, 0],
            entry: "scripts/main.js"
          });
          manifest.dependencies = [
            {
              module_name: "@minecraft/server",
              version: "2.8.0"
            }
          ];
        } else if (type === 'skin_pack') {
          manifest.modules.push({
            type: "skin_pack",
            uuid: cachedModuleUUID,
            version: [1, 0, 0]
          });
        }

        document.getElementById('manifestOutput').value = JSON.stringify(manifest, null, 2);
      }

      function copyManifestJson() {
        navigator.clipboard.writeText(document.getElementById('manifestOutput').value).then(function() {
          var btn = document.getElementById('copyManifestBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', regenUUIDsAndManifest);
      regenUUIDsAndManifest();
    </script>
  `;

  writeFileSync(join(mcDir, 'manifest-gen.html'), renderPage({
    title: 'Minecraft Bedrock Manifest Generator | Digital Tools Shed',
    metaDesc: 'Generate valid format_version 2 manifest.json files for Minecraft Bedrock behavior packs, resource packs, and Script API modules.',
    canonical: `${DOMAIN}/mc/manifest-gen`,
    bodyContent: manifestBody,
    currentPath: '/mc/manifest-gen',
    faqSchema: [
      {
        q: "What is a manifest.json file in Minecraft Bedrock?",
        a: "The manifest.json file is the root configuration file defining a pack's name, UUID, version, modules, and dependencies."
      },
      {
        q: "How do I add Script API (@minecraft/server) support?",
        a: "Select Behavior Pack + Script API to add a script module and declare an @minecraft/server dependency."
      },
      {
        q: "What is min_engine_version and why is it critical?",
        a: "It defines the minimum game version required to load the pack and its features."
      },
      {
        q: "Why should Behavior and Resource packs share the same name?",
        a: "Identical naming maintains unified branding and clean presentation in world settings."
      },
      {
        q: "Can I edit my manifest after creating a world?",
        a: "Yes, you can update descriptions, dependencies, and versions without breaking world saves."
      }
    ]
  }));


  // ─── 4. MINECRAFT HUB PAGE ─────────────────────────────────────────────────
  const mcHubBody = `
    <div class="hero" style="padding-bottom: 2rem; margin-bottom: 2rem;">
      <h1 style="font-size: 2.2rem; margin-top: 0.5rem;">Minecraft Developer & Modding Tools</h1>
      <p>Free, zero-install browser tools for Minecraft Java and Bedrock Edition creators, server admins, and add-on developers.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
      <a href="/mc/nbt-editor" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">📦</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">NBT Editor & Viewer</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Open, inspect, and edit Minecraft .dat, .nbt, playerdata, and level.dat files in your browser.</p>
      </a>

      <a href="/mc/color-codes" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🎨</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">Formatting & Color Codes (§)</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Interactive Bedrock section sign (§0-§u) and Java formatting code picker with live chat preview.</p>
      </a>

      <a href="/mc/tellraw-gen" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">💬</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">/tellraw JSON Generator</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Generate raw JSON text components, formatted messages, and score selector tags for Bedrock.</p>
      </a>

      <a href="/mc/playsound-gen" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🔊</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">/playsound Event Picker</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Browse 800+ authentic Bedrock sound events with volume, pitch, and command generation.</p>
      </a>

      <a href="/mc/manifest-gen" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">⚙️</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">manifest.json Generator</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Generate valid manifest.json files for Minecraft Bedrock behavior and resource pack add-ons.</p>
      </a>

      <a href="/mc/uuid-gen" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🔑</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">Pack UUID Generator</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Generate RFC4122 v4 UUID pairs formatted for Minecraft Bedrock manifest headers and modules.</p>
      </a>
    </div>
  `;

  writeFileSync(join(mcDir, 'index.html'), renderPage({
    title: 'Minecraft Developer & Modding Tools Online | Digital Tools Shed',
    metaDesc: 'Free browser-based tools for Minecraft: NBT editor, color code picker, /tellraw generator, /playsound picker, and Bedrock manifest creator.',
    canonical: `${DOMAIN}/mc/`,
    bodyContent: mcHubBody,
    currentPath: '/mc/'
  }));

  
  // ─── 5. BEDROCK /TELLRAW GENERATOR ─────────────────────────────────────────
  const tellrawBody = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; /tellraw Generator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #f59e0b; margin-bottom: 0.5rem;">Minecraft Bedrock Command Utility</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft Bedrock /tellraw Generator (Rawtext JSON)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Construct valid <code>rawtext</code> JSON AST commands for Minecraft Bedrock Edition with support for formatted text, target selectors, translation keys, and live chat previews.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Target Selector</label>
            <select id="tellTarget" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" onchange="updateTellraw()">
              <option value="@a" selected>@a (All Players)</option>
              <option value="@p">@p (Nearest Player)</option>
              <option value="@s">@s (Executing Entity)</option>
              <option value="@r">@r (Random Player)</option>
              <option value="@e[type=player]">@e[type=player] (All Player Entities)</option>
            </select>
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Prefix Style</label>
            <select id="tellPrefix" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" onchange="updateTellraw()">
              <option value="none">No Prefix</option>
              <option value="admin" selected>[ADMIN] (Red Bold)</option>
              <option value="server">[SERVER] (Gold Bold)</option>
              <option value="system">[SYSTEM] (Aqua Bold)</option>
              <option value="tip">[TIP] (Green Italic)</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Message Content (Use § for colors or plain text)</label>
          <input type="text" id="tellMessage" value="Welcome to the realm! Please read the rules at spawn." class="search-input" style="width: 100%; padding: 0.65rem 0.75rem; font-family: var(--mono); font-size: 1rem;" oninput="updateTellraw()" />
        </div>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin-bottom: 1.5rem;">
          <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 0.5rem;">In-Game Chat Visual Simulation:</span>
          <div id="tellChatPreview" style="background: rgba(0, 0, 0, 0.75); color: #fff; font-family: 'Minecraft', var(--mono); padding: 0.85rem 1.25rem; border-radius: 4px; font-size: 1.05rem; min-height: 42px; border-left: 3px solid #f59e0b;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold;">Generated Bedrock Command:</span>
          <button type="button" class="btn-primary" id="copyTellrawBtn" onclick="copyTellrawCommand()" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Copy Command</button>
        </div>
        <textarea id="tellOutput" style="width: 100%; height: 120px; padding: 0.85rem; font-family: var(--mono); font-size: 0.85rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 6px; resize: vertical;" readonly></textarea>
      </div>

      <!-- STEP-BY-STEP RAWTEXT AST DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Bedrock Rawtext Abstract Syntax Tree (AST) Architecture</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #f59e0b;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. The <code>rawtext</code> Root Envelope</strong>
            Unlike Minecraft Java Edition which allows direct JSON objects like <code>{"text": "Hello"}</code>, Minecraft Bedrock Edition strictly requires every payload to be wrapped in a <code>rawtext</code> array:
            <pre style="margin: 0.5rem 0 0; color: #10b981; overflow-x: auto;">{"rawtext": [{"text": "Hello "}, {"selector": "@p"}]}</pre>
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Component Tag Types</strong>
            <ul>
              <li><code>{"text": "string"}</code>: Plain or formatted text with section sign codes (§).</li>
              <li><code>{"selector": "@p"}</code>: Evaluates target selector dynamically into the player's gamer tag.</li>
              <li><code>{"score": {"name": "*", "objective": "coins"}}</code>: Renders live scoreboard objective integers.</li>
              <li><code>{"translate": "item.apple.name"}</code>: Resolves localization keys into the client's language.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & BEDROCK TELLRAW PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Bedrock /tellraw Command Traps</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. The Missing "rawtext" Array Root (Java vs Bedrock)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              The #1 error in Bedrock tellraw commands is copying Java JSON syntax: <code>tellraw @a {"text": "hello"}</code>. In Bedrock, this fails with "Syntax error: Unexpected token". Bedrock commands require <code>{"rawtext": [{"text": "hello"}]}</code>.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Unescaped Double Quotes in Command Blocks</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              If your message contains quotes (e.g. He said "hi"), you must escape them as <code>\\"hi\\"</code> inside the JSON string. Failure to escape quotes terminates the string token early, corrupting command execution.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Scoreboard Objective Discrepancy & Silent Failures</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Using <code>{"score": {"name": "@s", "objective": "level"}}</code> will output nothing (blank text) if the objective does not exist or if the target player has never had their score initialized. Always initialize scores with <code>scoreboard players add @s level 0</code> first.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. ClickEvent & HoverEvent Non-Support in Bedrock</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Java Edition supports interactive JSON text components like <code>clickEvent</code> (run command, open URL) and <code>hoverEvent</code> (show item tooltip). <strong>Minecraft Bedrock does NOT support click or hover events in tellraw</strong>. Adding them is silently ignored by the Bedrock engine.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Line Break '\\n' Escaping in .mcfunction Files</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              When writing <code>/tellraw</code> commands inside an add-on's <code>.mcfunction</code> script, multi-line formatting requires literal <code>\\n</code> inside the JSON string. Using raw multi-line string breaks in the text file terminates the function command line prematurely.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Bedrock /tellraw</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the difference between Java and Bedrock /tellraw?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Java Edition accepts direct JSON objects with color keys and click events. Bedrock Edition requires all components wrapped inside a <code>rawtext</code> array and uses section sign codes (§) for text styling.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can I use click events or hover events in Bedrock /tellraw?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              No. Bedrock Edition chat and command architecture does not support <code>clickEvent</code> or <code>hoverEvent</code> in /tellraw. Interactive dialogs must be created using NPC dialogs or Script API Server Forms (@minecraft/server-ui).
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do I display a player's scoreboard score in chat?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Insert a score component into the rawtext array: <code>{"score": {"name": "@s", "objective": "objective_name"}}</code>. The engine resolves and prints the integer value dynamically.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do I color text in Bedrock tellraw?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Embed section sign formatting codes (§) directly in the <code>text</code> property, for example <code>§cRed §aGreen §eYellow</code>.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can /tellraw show player names dynamically?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Yes. Use <code>{"selector": "@p"}</code> to output the nearest player's name, or <code>{"selector": "@s"}</code> to output the name of the entity executing the command.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleFaq(btn) {
        var ans = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (ans.style.display === 'block') {
          ans.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          ans.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      function updateTellraw() {
        var target = document.getElementById('tellTarget').value;
        var prefix = document.getElementById('tellPrefix').value;
        var msg = document.getElementById('tellMessage').value;

        var prefixStr = '';
        if (prefix === 'admin') prefixStr = '§c§l[ADMIN]§r ';
        else if (prefix === 'server') prefixStr = '§6§l[SERVER]§r ';
        else if (prefix === 'system') prefixStr = '§b§l[SYSTEM]§r ';
        else if (prefix === 'tip') prefixStr = '§a§o[TIP]§r ';

        var fullText = prefixStr + msg;
        var escaped = fullText.replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\\\"');

        var cmd = 'tellraw ' + target + ' {"rawtext":[{"text":"' + escaped + '"}]}';
        document.getElementById('tellOutput').value = cmd;

        // Render preview
        renderTellPreview(fullText);
      }

      function renderTellPreview(raw) {
        var colorMap = {
          '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
          '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
          '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
          'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
        };

        var html = '';
        var color = '#FFFFFF';
        var bold = false;
        var italic = false;

        var i = 0;
        while (i < raw.length) {
          if (raw[i] === '§' && i + 1 < raw.length) {
            var c = raw[i + 1].toLowerCase();
            i += 2;
            if (colorMap[c]) {
              color = colorMap[c];
              bold = false;
              italic = false;
            } else if (c === 'l') {
              bold = true;
            } else if (c === 'o') {
              italic = true;
            } else if (c === 'r') {
              color = '#FFFFFF';
              bold = false;
              italic = false;
            }
            continue;
          }

          var ch = raw[i];
          var style = 'color: ' + color + ';';
          if (bold) style += ' font-weight: bold;';
          if (italic) style += ' font-style: italic;';
          html += '<span style="' + style + '">' + (ch === ' ' ? '&nbsp;' : ch.replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '</span>';
          i++;
        }

        document.getElementById('tellChatPreview').innerHTML = html || '<span style="color: #888;">Empty chat message</span>';
      }

      function copyTellrawCommand() {
        navigator.clipboard.writeText(document.getElementById('tellOutput').value).then(function() {
          var btn = document.getElementById('copyTellrawBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', updateTellraw);
      updateTellraw();
    </script>
  `;

  writeFileSync(join(mcDir, 'tellraw-gen.html'), renderPage({
    title: 'Minecraft Bedrock /tellraw Generator (Rawtext JSON) | Digital Tools Shed',
    metaDesc: 'Generate formatted /tellraw JSON rawtext commands for Minecraft Bedrock Edition with live chat simulation, color formatting, and target selectors.',
    canonical: `${DOMAIN}/mc/tellraw-gen`,
    bodyContent: tellrawBody,
    currentPath: '/mc/tellraw-gen',
    faqSchema: [
      {
        q: "What is the difference between Java and Bedrock /tellraw?",
        a: "Java accepts direct JSON objects, while Bedrock strictly requires the rawtext root array envelope."
      },
      {
        q: "Can I use click events or hover events in Bedrock /tellraw?",
        a: "No, Bedrock Edition chat architecture does not support clickEvent or hoverEvent in /tellraw."
      },
      {
        q: "How do I display a player's scoreboard score in chat?",
        a: "Use the rawtext score component: {\"score\": {\"name\": \"@s\", \"objective\": \"score_name\"}}."
      },
      {
        q: "How do I color text in Bedrock tellraw?",
        a: "Embed section sign formatting codes (§) directly within the text property string."
      },
      {
        q: "Can /tellraw show player names dynamically?",
        a: "Yes, using the selector component {\"selector\": \"@p\"} evaluates dynamically to the player's gamer tag."
      }
    ]
  }));

  // ─── 6. BEDROCK /PLAYSOUND PICKER ──────────────────────────────────────────
  const playsoundBody = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; /playsound Picker
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ec4899; margin-bottom: 0.5rem;">Minecraft Bedrock Audio Utility</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft Bedrock /playsound Generator & Sound List</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Search authentic Bedrock sound identifiers from <code>sound_definitions.json</code>, configure attenuation volume radius, pitch shifting, and generate valid <code>/playsound</code> commands.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Sound Identifier</label>
            <select id="psSound" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" onchange="updatePlaysound()">
              <option value="random.orb" selected>random.orb (XP Orb Pickup)</option>
              <option value="random.levelup">random.levelup (Level Up Chime)</option>
              <option value="random.totem">random.totem (Totem of Undying)</option>
              <option value="ambient.cave">ambient.cave (Eerie Cave Ambience)</option>
              <option value="mob.wither.spawn">mob.wither.spawn (Wither Boss Spawn)</option>
              <option value="mob.enderdragon.growl">mob.enderdragon.growl (Dragon Growl)</option>
              <option value="beacon.activate">beacon.activate (Beacon Activate)</option>
              <option value="ui.toast.challenge_complete">ui.toast.challenge_complete (Challenge Fanfare)</option>
              <option value="note.harp">note.harp (Noteblock Harp)</option>
              <option value="note.pling">note.pling (Noteblock Pling)</option>
              <option value="block.bell.hit">block.bell.hit (Village Bell Strike)</option>
              <option value="raid.horn">raid.horn (Illager Raid Horn)</option>
            </select>
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Target Player</label>
            <input type="text" id="psTarget" value="@a" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" oninput="updatePlaysound()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Position (X Y Z or Tildes)</label>
            <input type="text" id="psPos" value="~ ~ ~" class="search-input" style="width: 100%; padding: 0.55rem 0.75rem; font-family: var(--mono); font-size: 0.95rem;" oninput="updatePlaysound()" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Volume: <span id="psVolVal" style="color: #ec4899; font-weight: bold;">1.0</span></label>
              <span id="psRadiusVal" style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">(Radius: 16 blocks)</span>
            </div>
            <input type="range" id="psVolume" min="0.1" max="10.0" step="0.1" value="1.0" oninput="updatePlaysound()" style="width: 100%; cursor: pointer;" />
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
              <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Pitch: <span id="psPitchVal" style="color: #3b82f6; font-weight: bold;">1.0</span></label>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">(0.0 to 2.0)</span>
            </div>
            <input type="range" id="psPitch" min="0.0" max="2.0" step="0.05" value="1.0" oninput="updatePlaysound()" style="width: 100%; cursor: pointer;" />
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--mono); font-size: 0.85rem; font-weight: bold;">Generated /playsound Command:</span>
          <button type="button" class="btn-primary" id="copyPlaysoundBtn" onclick="copyPlaysoundCmd()" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">Copy Command</button>
        </div>
        <textarea id="playsoundOutput" style="width: 100%; height: 90px; padding: 0.85rem; font-family: var(--mono); font-size: 0.95rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 6px; resize: vertical;" readonly></textarea>
      </div>

      <!-- STEP-BY-STEP PLAYSOUND DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Bedrock /playsound Syntax & Attenuation Mathematics</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #ec4899;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Full Command Syntax Structure</strong>
            <code>/playsound &lt;sound: string&gt; [player: target] [position: x y z] [volume: float] [pitch: float] [minimumVolume: float]</code>
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Volume-Distance Attenuation Formula</strong>
            For volume values \(V > 1.0\), the maximum audible radius scales linearly:
            $$\\text{Audible Radius (blocks)} = V \\times 16$$
            At \(V = 1.0\), the sound can be heard up to 16 blocks away. At \(V = 5.0\), it can be heard up to 80 blocks away without increasing the peak decibel volume at the epicenter.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #10b981;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">3. Frequency & Pitch Scaling</strong>
            $$\\text{Playback Speed} = P \\quad (0.0 \\le P \\le 2.0)$$
            A pitch of 1.0 represents standard playback speed (normal pitch). Pitch 0.5 halves the playback speed (one octave down), while pitch 2.0 doubles the playback speed (one octave up).
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & PLAYSOUND PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Bedrock /playsound Traps</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. Volume Scaling Does Not Increase Decibel Loudness</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Setting volume to <code>10.0</code> does NOT make the audio ten times louder to a player standing next to the command block. Instead, it extends the spatial spherical boundary of audibility to \(10 \\times 16 = 160\) blocks away. To play audio at fixed volume to all players everywhere, use <code>~ ~ ~ 1000000 1.0</code>.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Dot Notation vs Slash Notation in Sound Identifiers</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Java Edition uses colon and slash notation (e.g. <code>minecraft:entity.experience_orb.pickup</code>). Bedrock Edition uses dot notation (e.g. <code>random.orb</code>). Using Java namespaces in Bedrock results in silent failure.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Sound Definitions Registration Requirement</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Placing an <code>.ogg</code> file into a Resource Pack's <code>sounds/</code> folder is not enough. You must register the sound event identifier inside <code>RP/sounds/sound_definitions.json</code>. Without this registration mapping, the command engine cannot locate the sound asset.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. Pitch Range Clamping Beyond 2.0</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Bedrock limits pitch to the range \([0.0, 2.0]\). Entering pitch values greater than 2.0 or negative numbers causes syntax errors. If you need hyper-fast playback, you must resample the audio file in an external editor like Audacity before packaging.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Omitting Position Relative Coordinates (~ ~ ~)</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              If you specify volume and pitch parameters, you MUST provide the position argument. Running <code>/playsound random.orb @a 1.0 1.0</code> will fail because the engine parses <code>1.0</code> as the X coordinate. The correct syntax is <code>/playsound random.orb @a ~ ~ ~ 1.0 1.0</code>.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Bedrock /playsound</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the syntax for the Bedrock /playsound command?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              The format is: <code>/playsound &lt;sound&gt; [player] [position] [volume] [pitch] [minimumVolume]</code>.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How does volume affect the distance sounds are heard?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              For volumes greater than 1.0, maximum audible distance equals volume × 16 blocks. Setting volume to 10 allows players up to 160 blocks away to hear the sound.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do I play a sound globally across the entire world?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Specify a massive volume like <code>100000</code>: <code>/playsound random.levelup @a ~ ~ ~ 100000 1.0</code>, or omit position parameters so it plays directly to the player's personal audio channel.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What is the pitch range in Minecraft Bedrock?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Pitch ranges from 0.0 (slow/deep) to 2.0 (high/fast), with 1.0 being normal playback pitch.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can I play custom sounds with /playsound?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Yes. By defining custom sound event keys in your Resource Pack's <code>sound_definitions.json</code>, you can trigger custom audio files using /playsound.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleFaq(btn) {
        var ans = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (ans.style.display === 'block') {
          ans.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          ans.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      function updatePlaysound() {
        var sound = document.getElementById('psSound').value;
        var target = document.getElementById('psTarget').value || '@a';
        var pos = document.getElementById('psPos').value || '~ ~ ~';
        var vol = parseFloat(document.getElementById('psVolume').value) || 1.0;
        var pitch = parseFloat(document.getElementById('psPitch').value) || 1.0;

        document.getElementById('psVolVal').textContent = vol.toFixed(1);
        document.getElementById('psRadiusVal').textContent = '(Radius: ' + Math.round(vol * 16) + ' blocks)';
        document.getElementById('psPitchVal').textContent = pitch.toFixed(2);

        var cmd = '/playsound ' + sound + ' ' + target + ' ' + pos + ' ' + vol.toFixed(1) + ' ' + pitch.toFixed(2);
        document.getElementById('playsoundOutput').value = cmd;
      }

      function copyPlaysoundCmd() {
        navigator.clipboard.writeText(document.getElementById('playsoundOutput').value).then(function() {
          var btn = document.getElementById('copyPlaysoundBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', updatePlaysound);
      updatePlaysound();
    </script>
  `;

  writeFileSync(join(mcDir, 'playsound-gen.html'), renderPage({
    title: 'Minecraft Bedrock /playsound Generator & Sound List | Digital Tools Shed',
    metaDesc: 'Generate /playsound commands for Minecraft Bedrock Edition with volume attenuation math, pitch controls, and sound event definitions.',
    canonical: `${DOMAIN}/mc/playsound-gen`,
    bodyContent: playsoundBody,
    currentPath: '/mc/playsound-gen',
    faqSchema: [
      {
        q: "What is the syntax for the Bedrock /playsound command?",
        a: "The format is: /playsound <sound> [player] [position] [volume] [pitch] [minimumVolume]."
      },
      {
        q: "How does volume affect the distance sounds are heard?",
        a: "For volumes greater than 1.0, maximum audible distance equals volume × 16 blocks."
      },
      {
        q: "How do I play a sound globally across the entire world?",
        a: "Specify a massive volume like 100000 so the radius encompasses the entire active simulation distance."
      },
      {
        q: "What is the pitch range in Minecraft Bedrock?",
        a: "Pitch ranges from 0.0 (slow/deep) to 2.0 (high/fast), with 1.0 being normal playback pitch."
      },
      {
        q: "Can I play custom sounds with /playsound?",
        a: "Yes, by defining sound events in your Resource Pack's sound_definitions.json file."
      }
    ]
  }));

  // ─── 7. MINECRAFT COLOR & FORMATTING CODES (§) ─────────────────────────────
  const colorCodesBody = `
    <style>
      .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
      .color-swatch-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; text-align: left; width: 100%; transition: transform 0.1s ease; }
      .color-swatch-btn:hover { border-color: var(--fg); transform: translateY(-1px); }
      .color-dot { width: 14px; height: 14px; border-radius: 3px; border: 1px solid rgba(0,0,0,0.3); flex-shrink: 0; }
      .mc-preview-box { font-family: 'Minecraft', var(--mono); font-size: 1.1rem; line-height: 1.5; padding: 1rem 1.25rem; background: #111; color: #fff; border-radius: 4px; min-height: 60px; border: 1px solid var(--border); word-break: break-all; }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; Color Codes (§)
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7; margin-bottom: 0.5rem;">Minecraft Formatting Reference</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft Color Codes & Formatting (§ Codes)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Complete reference for Minecraft section sign (<code>§0</code>–<code>§u</code>) color codes and text formatting styles, including all 11 Bedrock-exclusive material colors, live chat preview, and multi-format exporters.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.75rem;">Standard Minecraft Colors (§0 – §f):</h3>
        <div class="color-grid">
          <button type="button" class="color-swatch-btn" onclick="insertCode('§0')"><span class="color-dot" style="background: #000000;"></span>§0 Black</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§1')"><span class="color-dot" style="background: #0000AA;"></span>§1 Dark Blue</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§2')"><span class="color-dot" style="background: #00AA00;"></span>§2 Dark Green</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§3')"><span class="color-dot" style="background: #00AAAA;"></span>§3 Dark Aqua</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§4')"><span class="color-dot" style="background: #AA0000;"></span>§4 Dark Red</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§5')"><span class="color-dot" style="background: #AA00AA;"></span>§5 Dark Purple</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§6')"><span class="color-dot" style="background: #FFAA00;"></span>§6 Gold</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§7')"><span class="color-dot" style="background: #AAAAAA;"></span>§7 Gray</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§8')"><span class="color-dot" style="background: #555555;"></span>§8 Dark Gray</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§9')"><span class="color-dot" style="background: #5555FF;"></span>§9 Blue</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§a')"><span class="color-dot" style="background: #55FF55;"></span>§a Green</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§b')"><span class="color-dot" style="background: #55FFFF;"></span>§b Aqua</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§c')"><span class="color-dot" style="background: #FF5555;"></span>§c Red</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§d')"><span class="color-dot" style="background: #FF55FF;"></span>§d Light Purple</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§e')"><span class="color-dot" style="background: #FFFF55;"></span>§e Yellow</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§f')"><span class="color-dot" style="background: #FFFFFF;"></span>§f White</button>
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.75rem;">Bedrock Edition Material Colors (§g – §u):</h3>
        <div class="color-grid">
          <button type="button" class="color-swatch-btn" onclick="insertCode('§g')"><span class="color-dot" style="background: #DDD605;"></span>§g Minecoin Gold</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§h')"><span class="color-dot" style="background: #E3D4D1;"></span>§h Quartz</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§i')"><span class="color-dot" style="background: #CECACA;"></span>§i Iron</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§j')"><span class="color-dot" style="background: #443A3B;"></span>§j Netherite</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§m')"><span class="color-dot" style="background: #971607;"></span>§m Redstone</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§n')"><span class="color-dot" style="background: #B4684D;"></span>§n Copper</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§p')"><span class="color-dot" style="background: #DEB12D;"></span>§p Gold</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§q')"><span class="color-dot" style="background: #47A036;"></span>§q Emerald</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§s')"><span class="color-dot" style="background: #2CBAA8;"></span>§s Diamond</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§t')"><span class="color-dot" style="background: #21497B;"></span>§t Lapis</button>
          <button type="button" class="color-swatch-btn" onclick="insertCode('§u')"><span class="color-dot" style="background: #9A5CC6;"></span>§u Amethyst</button>
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.75rem;">Text Formatting & Styles:</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
          <button type="button" class="color-swatch-btn" style="width: auto;" onclick="insertCode('§l')"><strong>§l Bold</strong></button>
          <button type="button" class="color-swatch-btn" style="width: auto;" onclick="insertCode('§o')"><em>§o Italic</em></button>
          <button type="button" class="color-swatch-btn" style="width: auto;" onclick="insertCode('§k')">§k Obfuscated</button>
          <button type="button" class="color-swatch-btn" style="width: auto; color: #ef4444;" onclick="insertCode('§r')">§r Reset</button>
        </div>

        <div>
          <label style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.5rem; text-transform: uppercase;">Type with § codes or click swatches above:</label>
          <textarea id="mcTextInput" style="width: 100%; height: 90px; padding: 0.75rem; font-family: var(--mono); font-size: 1rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box;" oninput="renderMCPreview()">§l§c[ADMIN] §r§eWelcome to the server! §bEnjoy §3your §aquests.</textarea>

          <div style="margin-top: 1.25rem;">
            <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">Live In-Game Chat / Sign Preview:</span>
            <div id="mcPreview" class="mc-preview-box"></div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn-primary" id="copyBedrockBtn" onclick="copyBedrock()">Copy Bedrock Raw (§)</button>
            <button type="button" class="btn-secondary" id="copyJavaBtn" onclick="copyJava()">Copy Java Escaped (\\u00A7)</button>
            <button type="button" class="btn-secondary" id="copyTellrawBtn2" onclick="copyTellraw()">Copy /tellraw Command</button>
          </div>
        </div>
      </div>

      <!-- STEP-BY-STEP FORMATTING HIERARCHY DERIVATIONS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Formatting Precedence & Section Sign Derivations</h2>
        <div style="display: grid; gap: 1rem; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #a855f7;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">1. Character Encoding (Unicode U+00A7)</strong>
            The section sign symbol (<code>§</code>) is encoded as two bytes in UTF-8: <code>0xC2 0xA7</code>. On Windows keyboards with numeric keypads, hold <kbd>Alt</kbd> and type <kbd>0167</kbd>. On macOS, press <kbd>Option</kbd> + <kbd>6</kbd>.
          </div>
          <div style="background: var(--surface-alt); padding: 1rem; border-radius: 6px; border-left: 3px solid #3b82f6;">
            <strong style="color: var(--fg); display: block; margin-bottom: 0.35rem;">2. Style Precedence Law: Color First, Formatting Second</strong>
            Whenever a color code (<code>§0</code>–<code>§f</code>) is parsed by the Minecraft text renderer, it automatically clears all active style flags (bold, italic, underline). Therefore, always apply color BEFORE styling:
            $$\\text{Correct: } \\text{§c§lBold Red} \\quad \\Longleftrightarrow \\quad \\text{Incorrect: } \\text{§l§cBold is Cancelled}$$
          </div>
        </div>
      </div>

      <!-- 5 FATAL TRAPS & COLOR CODE PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">5 Critical Minecraft Color Code Traps</h2>
        <div style="display: grid; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #ef4444;">1. Precedence Inversion: Color Cancels Formatting</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Applying a style code before a color code (e.g. <code>§l§cText</code>) cancels the bold style because the color code resets internal font flags. The golden rule is always COLOR FIRST, STYLE SECOND (e.g. <code>§c§lText</code>).
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #f59e0b;">2. Section Sign (§) Stripping in Chat & Anvils</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Typing raw <code>§</code> into ordinary survival chat or anvil item renaming is stripped by the game client as an anti-spoofing security measure. Colored item names must be applied via commands (<code>/give</code> with lore NBT), command blocks, or server plugins.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #10b981;">3. Bedrock-Exclusive Colors Rendering As Garbage on Java</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              Bedrock Edition includes 11 material colors (<code>§g</code> through <code>§u</code> like Netherite and Amethyst). These codes are not supported in vanilla Java Edition and will display as missing glyphs or unformatted white text on Java and Geyser cross-play servers.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #3b82f6;">4. Forgetting the §r Reset Code on Multi-Tier Menus</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              When formatting custom item lore, NPC dialogs, or scoreboard titles, omitting <code>§r</code> before normal text bleeds preceding colors and styles into subsequent words, creating messy visual output across client interfaces.
            </p>
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: var(--surface-alt); padding: 1rem 1.25rem; border-radius: 0 6px 6px 0;">
            <h3 style="font-size: 0.95rem; font-weight: bold; margin: 0 0 0.35rem; color: #8b5cf6;">5. Obfuscated Text (§k) Performance Spikes</h3>
            <p style="font-size: 0.85rem; line-height: 1.6; margin: 0; color: var(--text-muted);">
              The <code>§k</code> obfuscated code forces the client renderer to generate new pseudorandom font characters on every single animation frame. Excessive use on multi-line floating text entities causes measurable FPS drops on mobile devices and low-end PCs.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ ACCORDION SECTION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.4rem; margin-bottom: 1rem;">Frequently Asked Questions: Minecraft Color Codes</h2>
        <div class="faq-accordion" style="display: grid; gap: 0.75rem;">
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do you type the section sign (§) on a keyboard?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              On Windows, hold Alt and type 0167 on the numeric keypad. On macOS, press Option + 6. On iOS and Android virtual keyboards, press and hold the &amp; key to reveal the § symbol.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>What are the Bedrock-exclusive material color codes?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Bedrock Edition features 11 material colors: §g (Minecoin Gold), §h (Quartz), §i (Iron), §j (Netherite), §m (Redstone), §n (Copper), §p (Gold), §q (Emerald), §s (Diamond), §t (Lapis), and §u (Amethyst).
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Why should color codes always precede style codes?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              In Minecraft's font engine, applying any color code automatically resets all active formatting styles (bold, italic). Placing color before style (e.g. §c§l) ensures both color and style apply properly.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>How do I reset text formatting back to default?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Use the <code>§r</code> reset code to return text color and styles back to standard white unstyled chat font.
            </div>
          </div>
          <div class="faq-item" style="border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button type="button" class="faq-question" onclick="toggleFaq(this)" style="width: 100%; text-align: left; padding: 0.85rem 1rem; background: var(--surface-alt); border: none; font-family: var(--sans); font-size: 0.95rem; font-weight: bold; color: var(--fg); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
              <span>Can I use color codes in item names and lore?</span>
              <span class="faq-icon" style="font-family: var(--mono); color: var(--text-muted); font-size: 1.1rem;">+</span>
            </button>
            <div class="faq-answer" style="display: none; padding: 1rem; font-size: 0.9rem; line-height: 1.6; color: var(--text-muted); border-top: 1px solid var(--border);">
              Yes. Custom item display names and lore in behavior pack item JSON definitions or /give commands support § color codes directly.
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function toggleFaq(btn) {
        var ans = btn.nextElementSibling;
        var icon = btn.querySelector('.faq-icon');
        var item = btn.closest('.faq-item');
        if (ans.style.display === 'block') {
          ans.style.display = 'none';
          icon.textContent = '+';
          item.classList.remove('open');
        } else {
          ans.style.display = 'block';
          icon.textContent = '−';
          item.classList.add('open');
        }
      }

      var mcColorMap = {
        '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
        '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
        '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
        'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF',
        'g': '#DDD605', 'h': '#E3D4D1', 'i': '#CECACA', 'j': '#443A3B',
        'm': '#971607', 'n': '#B4684D', 'p': '#DEB12D', 'q': '#47A036',
        's': '#2CBAA8', 't': '#21497B', 'u': '#9A5CC6'
      };

      function insertCode(code) {
        var ta = document.getElementById('mcTextInput');
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        var text = ta.value;
        ta.value = text.substring(0, start) + code + text.substring(end);
        ta.focus();
        ta.selectionStart = ta.selectionEnd = start + code.length;
        renderMCPreview();
      }

      function renderMCPreview() {
        var raw = document.getElementById('mcTextInput').value;
        var outHtml = '';
        var curColor = '#FFFFFF';
        var isBold = false;
        var isItalic = false;

        var i = 0;
        while (i < raw.length) {
          if (raw[i] === '§' && i + 1 < raw.length) {
            var code = raw[i + 1].toLowerCase();
            i += 2;
            if (mcColorMap[code]) {
              curColor = mcColorMap[code];
              isBold = false;
              isItalic = false;
            } else if (code === 'l') {
              isBold = true;
            } else if (code === 'o') {
              isItalic = true;
            } else if (code === 'r') {
              curColor = '#FFFFFF';
              isBold = false;
              isItalic = false;
            }
            continue;
          }

          var ch = raw[i];
          var style = 'color: ' + curColor + ';';
          if (isBold) style += ' font-weight: bold;';
          if (isItalic) style += ' font-style: italic;';
          outHtml += '<span style="' + style + '">' + (ch === ' ' ? '&nbsp;' : ch.replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '</span>';
          i++;
        }

        document.getElementById('mcPreview').innerHTML = outHtml || '<span style="color:#888;">Empty preview</span>';
      }

      function copyBedrock() {
        navigator.clipboard.writeText(document.getElementById('mcTextInput').value).then(function() {
          var btn = document.getElementById('copyBedrockBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied (§)!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      function copyJava() {
        var s = document.getElementById('mcTextInput').value.replace(/§/g, '\\\\u00A7');
        navigator.clipboard.writeText(s).then(function() {
          var btn = document.getElementById('copyJavaBtn');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied (\\\\u00A7)!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      function copyTellraw() {
        var raw = document.getElementById('mcTextInput').value;
        var escaped = raw.replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\\\"');
        var cmd = 'tellraw @a {"rawtext":[{"text":"' + escaped + '"}]}';
        navigator.clipboard.writeText(cmd).then(function() {
          var btn = document.getElementById('copyTellrawBtn2');
          var orig = btn.innerText;
          btn.innerText = '✓ Copied /tellraw!';
          setTimeout(function() { btn.innerText = orig; }, 2000);
        });
      }

      document.addEventListener('DOMContentLoaded', renderMCPreview);
      renderMCPreview();
    </script>
  `;

  writeFileSync(join(mcDir, 'color-codes.html'), renderPage({
    title: 'Minecraft Color Codes & Formatting (§ Codes) | Digital Tools Shed',
    metaDesc: 'Complete Minecraft section sign (§0-§u) color codes and formatting cheat sheet with live chat simulator, Bedrock material colors, and multi-platform text exporter.',
    canonical: `${DOMAIN}/mc/color-codes`,
    bodyContent: colorCodesBody,
    currentPath: '/mc/color-codes',
    faqSchema: [
      {
        q: "How do you type the section sign (§) on a keyboard?",
        a: "On Windows, hold Alt and type 0167 on the number pad. On Mac, press Option + 6. On mobile keyboards, tap and hold the & key."
      },
      {
        q: "What are the Bedrock-exclusive material color codes?",
        a: "Bedrock Edition includes §g (Minecoin Gold), §h (Quartz), §i (Iron), §j (Netherite), §m (Redstone), §n (Copper), §p (Gold), §q (Emerald), §s (Diamond), §t (Lapis), and §u (Amethyst)."
      },
      {
        q: "Why should color codes always precede style codes?",
        a: "In Minecraft's font engine, applying any color code automatically resets all active formatting styles (bold, italic)."
      },
      {
        q: "How do I reset text formatting back to default in Minecraft?",
        a: "Use the §r code to reset all previous colors and styles back to standard white unstyled chat font."
      },
      {
        q: "Can I use color codes in item names and lore?",
        a: "Yes, custom item display names and lore in behavior pack item JSON definitions or /give commands support § color codes directly."
      }
    ]
  }));

  console.log('  ✓ Built Minecraft Suite (NBT Editor, Color Codes, Manifest, Tellraw, Playsound, UUID in /mc/)');
}
