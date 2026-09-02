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
            <button onclick="copySNBT()" class="btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Copy SNBT</button>
          </div>
          <textarea id="snbtOutput" style="width: 100%; height: 400px; font-family: var(--mono); font-size: 0.85rem; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; resize: vertical;" readonly></textarea>
        </div>

        <!-- TAB: JSON -->
        <div id="tabJSON" style="display: none; background: var(--surface); border: 1px solid var(--border); border-top: none; padding: 1.25rem; border-radius: 0 0 6px 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-size: 0.85rem; color: var(--text-muted);">Standard JSON Representation:</span>
            <button onclick="navigator.clipboard.writeText(document.getElementById('jsonOutput').value); alert('Copied JSON!');" class="btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.8rem;">Copy JSON</button>
          </div>
          <textarea id="jsonOutput" style="width: 100%; height: 400px; font-family: var(--mono); font-size: 0.85rem; padding: 0.75rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; resize: vertical;" readonly></textarea>
        </div>
      </div>
    </div>

    <!-- PAKO GZIP CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js"></script>

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
            alert('Invalid NBT File: Root tag must be TAG_Compound');
            return;
          }

          rootName = reader.readString();
          parsedNBT = reader.readTagPayload(TAG.COMPOUND);

          renderAll();
          document.getElementById('nbtWorkspace').style.display = 'block';
        } catch (err) {
          alert('Error parsing NBT: ' + err.message);
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
        navigator.clipboard.writeText(document.getElementById('snbtOutput').value);
        alert('SNBT copied to clipboard!');
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
    currentPath: '/mc/nbt-editor'
  }));

  // ─── 2. UUID GENERATOR ─────────────────────────────────────────────────────
  const uuidBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Minecraft Bedrock UUID Generator</h1>
      <p>Generate RFC4122 v4 UUID pairs specifically formatted for Minecraft Bedrock behavior packs, resource packs, and manifest.json headers.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <button class="btn-primary" id="genUuidBtn">Generate New UUIDs</button>
        <button class="btn-secondary" id="copyAllUuid">Copy Header & Module Pair</button>
      </div>

      <div style="font-family: var(--mono); display: grid; gap: 1rem;">
        <div style="border: 1px solid var(--border); padding: 1rem; background: var(--surface-alt);">
          <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Header UUID (Pack UUID)</div>
          <div id="headerUuid" style="font-size: 1.1rem; font-weight: bold; margin-top: 0.25rem;"></div>
        </div>
        <div style="border: 1px solid var(--border); padding: 1rem; background: var(--surface-alt);">
          <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Module UUID</div>
          <div id="moduleUuid" style="font-size: 1.1rem; font-weight: bold; margin-top: 0.25rem;"></div>
        </div>
      </div>
    </div>

    <script>
      function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function refresh() {
        document.getElementById('headerUuid').innerText = genUUID();
        document.getElementById('moduleUuid').innerText = genUUID();
      }
      document.getElementById('genUuidBtn').addEventListener('click', refresh);
      document.getElementById('copyAllUuid').addEventListener('click', function() {
        var text = 'Header UUID: ' + document.getElementById('headerUuid').innerText + '\\nModule UUID: ' + document.getElementById('moduleUuid').innerText;
        navigator.clipboard.writeText(text);
        alert('Copied UUID pair to clipboard!');
      });
      refresh();
    </script>
  `;

  writeFileSync(join(mcDir, 'uuid-gen.html'), renderPage({
    title: 'Minecraft UUID Generator for Bedrock Add-Ons | Digital Tools Shed',
    metaDesc: 'Generate random UUID v4 strings for Minecraft Bedrock behavior pack and resource pack manifest.json files.',
    canonical: `${DOMAIN}/mc/uuid-gen`,
    bodyContent: uuidBody,
    currentPath: '/mc/uuid-gen'
  }));

  // ─── 3. MANIFEST GENERATOR ─────────────────────────────────────────────────
  const manifestBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Bedrock Manifest.json Generator</h1>
      <p>Quickly generate valid, clean manifest.json files for Minecraft Bedrock Resource Packs and Behavior Packs with automatic UUIDs.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <label style="font-family: var(--serif); font-size: 1rem; color: var(--fg); display: block; margin-bottom: 0.35rem;">Pack Name</label>
          <input type="text" id="packName" value="My Custom Pack" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;" />
        </div>
        <div>
          <label style="font-family: var(--serif); font-size: 1rem; color: var(--fg); display: block; margin-bottom: 0.35rem;">Pack Type</label>
          <select id="packType" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;">
            <option value="data">Behavior Pack (data)</option>
            <option value="resources">Resource Pack (resources)</option>
          </select>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-family: var(--serif); font-size: 1rem; font-weight: bold;">manifest.json output:</span>
        <button class="btn-primary" id="copyManifest">Copy JSON</button>
      </div>
      <textarea id="manifestOutput" style="width: 100%; height: 260px; padding: 1rem; font-family: var(--mono); font-size: 0.85rem;" readonly></textarea>
    </div>

    <script>
      function genUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

      function updateManifest() {
        var name = document.getElementById('packName').value || 'My Pack';
        var type = document.getElementById('packType').value;
        var manifest = {
          format_version: 2,
          header: {
            name: name,
            description: name + " by Digital Tools Shed",
            uuid: genUUID(),
            version: [1, 0, 0],
            min_engine_version: [1, 20, 0]
          },
          modules: [
            {
              type: type,
              uuid: genUUID(),
              version: [1, 0, 0]
            }
          ]
        };
        document.getElementById('manifestOutput').value = JSON.stringify(manifest, null, 2);
      }

      document.getElementById('packName').addEventListener('input', updateManifest);
      document.getElementById('packType').addEventListener('change', updateManifest);
      document.getElementById('copyManifest').addEventListener('click', function() {
        navigator.clipboard.writeText(document.getElementById('manifestOutput').value);
        alert('Copied manifest.json to clipboard!');
      });
      updateManifest();
    </script>
  `;

  writeFileSync(join(mcDir, 'manifest-gen.html'), renderPage({
    title: 'Minecraft Bedrock Manifest Generator | Digital Tools Shed',
    metaDesc: 'Generate valid manifest.json files for Minecraft Bedrock behavior and resource packs.',
    canonical: `${DOMAIN}/mc/manifest-gen`,
    bodyContent: manifestBody,
    currentPath: '/mc/manifest-gen'
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
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; Bedrock Tellraw Generator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft Bedrock /tellraw Generator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Generate Bedrock-compatible <code>rawtext</code> JSON commands with color codes (§), selector targets (@p, @a), and scoreboards.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Target Selector</label>
            <select id="tellTarget" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;" onchange="updateTellraw()">
              <option value="@a">@a (All Players)</option>
              <option value="@p" selected>@p (Nearest Player)</option>
              <option value="@s">@s (Self / Executing Entity)</option>
              <option value="@e">@e (All Entities)</option>
            </select>
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Text Color</label>
            <select id="tellColor" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;" onchange="updateTellraw()">
              <option value="§f">White (§f)</option>
              <option value="§a">Green (§a)</option>
              <option value="§b">Aqua (§b)</option>
              <option value="§c">Red (§c)</option>
              <option value="§d">Light Purple (§d)</option>
              <option value="§e" selected>Yellow (§e)</option>
              <option value="§6">Gold (§6)</option>
              <option value="§g">Minecoin Gold (§g)</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Message Content</label>
          <input type="text" id="tellMsg" value="Welcome to the Server!" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono); font-size: 1rem;" oninput="updateTellraw()" />
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--serif); font-size: 1rem; font-weight: bold;">Generated Command:</span>
          <button class="btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('tellOutput').value); alert('Copied tellraw command!');">Copy Command</button>
        </div>
        <textarea id="tellOutput" style="width: 100%; height: 120px; padding: 0.75rem; font-family: var(--mono); font-size: 0.85rem;" readonly></textarea>
      </div>
    </div>

    <script>
      function updateTellraw() {
        var target = document.getElementById('tellTarget').value;
        var color = document.getElementById('tellColor').value;
        var msg = document.getElementById('tellMsg').value;

        var payload = {
          rawtext: [
            { text: color + msg }
          ]
        };

        var cmd = 'tellraw ' + target + ' ' + JSON.stringify(payload);
        document.getElementById('tellOutput').value = cmd;
      }
      updateTellraw();
    </script>
  `;

  writeFileSync(join(mcDir, 'tellraw-gen.html'), renderPage({
    title: 'Minecraft Bedrock /tellraw Generator (Rawtext JSON) | Digital Tools Shed',
    metaDesc: 'Generate Bedrock rawtext JSON tellraw commands with color formatting and selectors.',
    canonical: `${DOMAIN}/mc/tellraw-gen`,
    bodyContent: tellrawBody,
    currentPath: '/mc/tellraw-gen'
  }));

  // ─── 6. BEDROCK /PLAYSOUND PICKER ──────────────────────────────────────────
  const playsoundBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; Bedrock Playsound Generator
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft Bedrock /playsound Command Generator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Search official vanilla sound event definitions with interactive pitch, volume, and player selectors.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="margin-bottom: 1.25rem;">
          <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Sound Event ID</label>
          <select id="soundId" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem;" onchange="updatePlaysound()">
            <option value="random.levelup">random.levelup (Experience Level Up Chime)</option>
            <option value="random.orb">random.orb (XP Orb Pickup)</option>
            <option value="random.explode">random.explode (Explosion)</option>
            <option value="random.totem">random.totem (Totem of Undying Activation)</option>
            <option value="mob.warden.heartbeat">mob.warden.heartbeat (Warden Heartbeat)</option>
            <option value="mob.enderdragon.growl">mob.enderdragon.growl (Ender Dragon Growl)</option>
            <option value="block.bell.hit">block.bell.hit (Village Bell Ding)</option>
            <option value="ui.toast.challenge_complete">ui.toast.challenge_complete (Challenge Fanfare)</option>
          </select>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Volume (0.0 to 1.0+)</label>
            <input type="number" id="soundVol" value="1.0" step="0.1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="updatePlaysound()" />
          </div>
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Pitch (0.0 to 2.0)</label>
            <input type="number" id="soundPitch" value="1.0" step="0.1" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" oninput="updatePlaysound()" />
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-family: var(--serif); font-size: 1rem; font-weight: bold;">/playsound Command:</span>
          <button class="btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('playsoundOutput').value); alert('Copied /playsound command!');">Copy Command</button>
        </div>
        <textarea id="playsoundOutput" style="width: 100%; height: 80px; padding: 0.75rem; font-family: var(--mono); font-size: 0.9rem;" readonly></textarea>
      </div>
    </div>

    <script>
      function updatePlaysound() {
        var sound = document.getElementById('soundId').value;
        var vol = document.getElementById('soundVol').value || '1.0';
        var pitch = document.getElementById('soundPitch').value || '1.0';

        var cmd = 'playsound ' + sound + ' @a ~ ~ ~ ' + vol + ' ' + pitch;
        document.getElementById('playsoundOutput').value = cmd;
      }
      updatePlaysound();
    </script>
  `;

  writeFileSync(join(mcDir, 'playsound-gen.html'), renderPage({
    title: 'Minecraft Bedrock /playsound Generator & Sound List | Digital Tools Shed',
    metaDesc: 'Generate Bedrock /playsound commands with sound event IDs, pitch, volume, and coordinates.',
    canonical: `${DOMAIN}/mc/playsound-gen`,
    bodyContent: playsoundBody,
    currentPath: '/mc/playsound-gen'
  }));

  // ─── 7. MINECRAFT COLOR & FORMATTING CODES (§) ─────────────────────────────
  const colorCodesBody = `
    <style>
      .color-swatch-btn { border: 1px solid var(--border); padding: 0.4rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; font-weight: bold; background: var(--surface); transition: transform 0.1s, border-color 0.2s; }
      .color-swatch-btn:hover { transform: translateY(-1px); border-color: var(--fg); }
      .color-dot { width: 14px; height: 14px; border-radius: 3px; display: inline-block; border: 1px solid rgba(0,0,0,0.2); }
      .mc-preview-box { background: rgba(0, 0, 0, 0.82); border: 2px solid #555; padding: 1.25rem; border-radius: 4px; font-family: monospace, 'Courier New', sans-serif; font-size: 1.15rem; min-height: 70px; display: flex; align-items: center; word-break: break-word; line-height: 1.4; text-shadow: 2px 2px 0px rgba(0,0,0,0.7); }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/mc/">Minecraft Tools</a> &gt; Color Codes & Formatting
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Minecraft Bedrock & Java Color Codes (§)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Interactive Minecraft section sign (§) formatting cheat sheet, live chat box simulator, and multi-format text exporter.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.75rem;">Standard Palette (Click to insert code):</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
          <button class="color-swatch-btn" onclick="insertCode('§0')"><span class="color-dot" style="background: #000000;"></span>§0 Black</button>
          <button class="color-swatch-btn" onclick="insertCode('§1')"><span class="color-dot" style="background: #0000AA;"></span>§1 Dark Blue</button>
          <button class="color-swatch-btn" onclick="insertCode('§2')"><span class="color-dot" style="background: #00AA00;"></span>§2 Dark Green</button>
          <button class="color-swatch-btn" onclick="insertCode('§3')"><span class="color-dot" style="background: #00AAAA;"></span>§3 Dark Aqua</button>
          <button class="color-swatch-btn" onclick="insertCode('§4')"><span class="color-dot" style="background: #AA0000;"></span>§4 Dark Red</button>
          <button class="color-swatch-btn" onclick="insertCode('§5')"><span class="color-dot" style="background: #AA00AA;"></span>§5 Dark Purple</button>
          <button class="color-swatch-btn" onclick="insertCode('§6')"><span class="color-dot" style="background: #FFAA00;"></span>§6 Gold</button>
          <button class="color-swatch-btn" onclick="insertCode('§7')"><span class="color-dot" style="background: #AAAAAA;"></span>§7 Gray</button>
          <button class="color-swatch-btn" onclick="insertCode('§8')"><span class="color-dot" style="background: #555555;"></span>§8 Dark Gray</button>
          <button class="color-swatch-btn" onclick="insertCode('§9')"><span class="color-dot" style="background: #5555FF;"></span>§9 Blue</button>
          <button class="color-swatch-btn" onclick="insertCode('§a')"><span class="color-dot" style="background: #55FF55;"></span>§a Green</button>
          <button class="color-swatch-btn" onclick="insertCode('§b')"><span class="color-dot" style="background: #55FFFF;"></span>§b Aqua</button>
          <button class="color-swatch-btn" onclick="insertCode('§c')"><span class="color-dot" style="background: #FF5555;"></span>§c Red</button>
          <button class="color-swatch-btn" onclick="insertCode('§d')"><span class="color-dot" style="background: #FF55FF;"></span>§d Light Purple</button>
          <button class="color-swatch-btn" onclick="insertCode('§e')"><span class="color-dot" style="background: #FFFF55;"></span>§e Yellow</button>
          <button class="color-swatch-btn" onclick="insertCode('§f')"><span class="color-dot" style="background: #FFFFFF;"></span>§f White</button>
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.75rem;">Bedrock Material Colors:</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.25rem;">
          <button class="color-swatch-btn" onclick="insertCode('§g')"><span class="color-dot" style="background: #DDD605;"></span>§g Minecoin Gold</button>
          <button class="color-swatch-btn" onclick="insertCode('§h')"><span class="color-dot" style="background: #E3D4D1;"></span>§h Quartz</button>
          <button class="color-swatch-btn" onclick="insertCode('§i')"><span class="color-dot" style="background: #CECACA;"></span>§i Iron</button>
          <button class="color-swatch-btn" onclick="insertCode('§j')"><span class="color-dot" style="background: #443A3B;"></span>§j Netherite</button>
          <button class="color-swatch-btn" onclick="insertCode('§m')"><span class="color-dot" style="background: #971607;"></span>§m Redstone</button>
          <button class="color-swatch-btn" onclick="insertCode('§n')"><span class="color-dot" style="background: #B4684D;"></span>§n Copper</button>
          <button class="color-swatch-btn" onclick="insertCode('§p')"><span class="color-dot" style="background: #DEB12D;"></span>§p Gold</button>
          <button class="color-swatch-btn" onclick="insertCode('§q')"><span class="color-dot" style="background: #47A036;"></span>§q Emerald</button>
          <button class="color-swatch-btn" onclick="insertCode('§s')"><span class="color-dot" style="background: #2CBAA8;"></span>§s Diamond</button>
          <button class="color-swatch-btn" onclick="insertCode('§t')"><span class="color-dot" style="background: #21497B;"></span>§t Lapis</button>
          <button class="color-swatch-btn" onclick="insertCode('§u')"><span class="color-dot" style="background: #9A5CC6;"></span>§u Amethyst</button>
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.75rem;">Text Formatting:</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
          <button class="color-swatch-btn" onclick="insertCode('§l')"><strong>§l Bold</strong></button>
          <button class="color-swatch-btn" onclick="insertCode('§o')"><em>§o Italic</em></button>
          <button class="color-swatch-btn" onclick="insertCode('§k')">§k Obfuscated</button>
          <button class="color-swatch-btn" onclick="insertCode('§r')" style="color: #ef4444;">§r Reset</button>
        </div>
      </div>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <label style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.5rem; text-transform: uppercase;">Type with § codes or click swatches above:</label>
        <textarea id="mcTextInput" style="width: 100%; height: 90px; padding: 0.75rem; font-family: var(--mono); font-size: 1rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box;" oninput="renderMCPreview()">§l§c[ADMIN] §r§eWelcome to the server! §bEnjoy §3your §aquester.</textarea>

        <div style="margin-top: 1.5rem;">
          <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">Live In-Game Chat / Sign Preview:</span>
          <div id="mcPreview" class="mc-preview-box"></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-top: 1.5rem;">
          <button class="btn-primary" onclick="copyBedrock()">Copy Bedrock Raw (§)</button>
          <button class="btn-sec" onclick="copyJava()">Copy Java Escaped (\\u00A7)</button>
          <button class="btn-sec" onclick="copyTellraw()">Copy /tellraw Command</button>
        </div>
      </div>
    </div>

    <script>
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
          outHtml += '<span style=\"' + style + '\">' + (ch === ' ' ? '&nbsp;' : ch.replace(/</g, '&lt;').replace(/>/g, '&gt;')) + '</span>';
          i++;
        }

        document.getElementById('mcPreview').innerHTML = outHtml || '<span style=\"color:#888;\">Empty preview</span>';
      }

      function copyBedrock() {
        navigator.clipboard.writeText(document.getElementById('mcTextInput').value);
        alert('Copied Bedrock formatted string (§)!');
      }

      function copyJava() {
        var s = document.getElementById('mcTextInput').value.replace(/§/g, '\\\\u00A7');
        navigator.clipboard.writeText(s);
        alert('Copied Java escaped string (\\\\u00A7)!');
      }

      function copyTellraw() {
        var raw = document.getElementById('mcTextInput').value;
        var escaped = raw.replace(/\"/g, '\\\\\"');
        var cmd = 'tellraw @a {\"rawtext\":[{\"text\":\"' + escaped + '\"}]}';
        navigator.clipboard.writeText(cmd);
        alert('Copied /tellraw command!');
      }

      document.addEventListener('DOMContentLoaded', renderMCPreview);
      renderMCPreview();
    </script>
  `;

  writeFileSync(join(mcDir, 'color-codes.html'), renderPage({
    title: 'Minecraft Color Codes & Formatting (§ Codes) | Digital Tools Shed',
    metaDesc: 'Complete Minecraft section sign (§0-§u) color codes and formatting cheat sheet with live chat simulator and multi-platform text exporter.',
    canonical: `${DOMAIN}/mc/color-codes`,
    bodyContent: colorCodesBody,
    currentPath: '/mc/color-codes',
    faq: [
      { q: 'How do you type the section sign (§) on a keyboard?', a: 'On Windows, hold Alt and type 0167 on the number pad. On Mac, press Option + 6. On iOS and Android keyboards, tap and hold the & key.' },
      { q: 'What are the Bedrock-exclusive material color codes?', a: 'Bedrock Edition includes §g (Minecoin Gold), §h (Quartz), §i (Iron), §j (Netherite), §m (Redstone), §n (Copper), §p (Gold), §q (Emerald), §s (Diamond), §t (Lapis), and §u (Amethyst).' },
      { q: 'How do I reset text formatting back to default in Minecraft?', a: 'Use the §r code to reset all previous colors and styles (bold, italic, obfuscated) back to the standard white chat color.' }
    ]
  }));

  console.log('  ✓ Built Minecraft Suite (NBT Editor, Color Codes, Manifest, Tellraw, Playsound, UUID in /mc/)');
}
