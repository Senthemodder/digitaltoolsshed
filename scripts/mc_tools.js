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
            <input type="text" id="nbtSearch" placeholder="🔍 Filter tag names..." class="search-input" style="padding: 0.4rem 0.75rem; font-size: 0.85rem; width: 220px;" oninput="filterNBT()" />
            <button onclick="expandAll(true)" style="background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); padding: 0.4rem 0.75rem; font-size: 0.75rem; border-radius: 3px; cursor: pointer;">Expand All</button>
            <button onclick="expandAll(false)" style="background: var(--surface-alt); border: 1px solid var(--border); color: var(--fg); padding: 0.4rem 0.75rem; font-size: 0.75rem; border-radius: 3px; cursor: pointer;">Collapse All</button>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="downloadNBT(true)" class="btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">💾 Download .DAT (Gzipped)</button>
            <button onclick="downloadNBT(false)" class="btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">Download Uncompressed</button>
            <button onclick="downloadJSON()" class="btn-secondary" style="padding: 0.4rem 0.85rem; font-size: 0.85rem;">Export JSON</button>
          </div>
        </div>

        <!-- TABS -->
        <div style="display: flex; gap: 0; margin-bottom: 0;">
          <button id="tabTreeBtn" class="tab-btn active" onclick="switchTab('tree')">🌳 Tree Inspector</button>
          <button id="tabSNBTBtn" class="tab-btn" onclick="switchTab('snbt')">📋 Stringified NBT (SNBT)</button>
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
    canonical: `${DOMAIN}/mc/nbt-editor.html`,
    bodyContent: nbtBody,
    currentPath: '/mc/nbt-editor.html'
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
    canonical: `${DOMAIN}/mc/uuid-gen.html`,
    bodyContent: uuidBody,
    currentPath: '/mc/uuid-gen.html'
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
    canonical: `${DOMAIN}/mc/manifest-gen.html`,
    bodyContent: manifestBody,
    currentPath: '/mc/manifest-gen.html'
  }));

  // ─── 4. MINECRAFT HUB PAGE ─────────────────────────────────────────────────
  const mcHubBody = `
    <div class="hero" style="padding-bottom: 2rem; margin-bottom: 2rem;">
      <h1 style="font-size: 2.2rem; margin-top: 0.5rem;">Minecraft Developer & Modding Tools</h1>
      <p>Free, zero-install browser tools for Minecraft Java and Bedrock Edition creators, server admins, and modders.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
      <a href="/mc/nbt-editor.html" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">📦</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">NBT Editor & Viewer</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Open, view, and edit Minecraft .dat, .nbt, playerdata, and level.dat files in your browser.</p>
      </a>

      <a href="/mc/uuid-gen.html" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">🔑</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">UUID Generator</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Generate RFC4122 v4 UUID pairs formatted for Minecraft Bedrock behavior and resource packs.</p>
      </a>

      <a href="/mc/manifest-gen.html" class="tool-card" style="text-decoration: none; color: inherit; display: block; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); border-radius: 6px;">
        <div style="font-size: 1.75rem; margin-bottom: 0.5rem;">📄</div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.4rem;">Manifest.json Generator</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Generate valid manifest.json files for Minecraft Bedrock add-ons with automatic UUIDs.</p>
      </a>
    </div>
  `;

  writeFileSync(join(mcDir, 'index.html'), renderPage({
    title: 'Minecraft Developer & Modding Tools Online | Digital Tools Shed',
    metaDesc: 'Free browser-based tools for Minecraft: in-browser NBT editor, Bedrock UUID generator, and manifest.json creator.',
    canonical: `${DOMAIN}/mc/`,
    bodyContent: mcHubBody,
    currentPath: '/mc/'
  }));

  console.log('  ✓ Built Minecraft Suite (NBT Editor, UUID Generator, Manifest Generator in /mc/)');
}
