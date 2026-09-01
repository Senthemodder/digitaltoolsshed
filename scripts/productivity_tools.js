import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir, ICONS } from './core.js';

function buildProductivitySuite() {
  const prodDist = join(DIST, 'productivity');
  ensureDir(prodDist);

  const printCss = `
    <style>
      
.sponsor-grid {
  margin: 2rem 0 0;
  padding: 1.5rem 0;
  border-top: 1px solid color-mix(in srgb, var(--border) 40%, transparent);
}
.sponsor-grid-title {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: color-mix(in srgb, var(--text-subtle) 70%, transparent);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.sponsor-grid-title::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border), transparent);
  opacity: 0.3;
}
.sponsor-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
@media (max-width: 768px) {
  .sponsor-cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .sponsor-cards { grid-template-columns: 1fr; }
}
.sponsor-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(145deg, var(--surface) 0%, var(--bg) 100%);
  border: 1px solid color-mix(in srgb, var(--border) 35%, transparent);
  border-radius: 5px;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.2s;
  cursor: pointer;
}
.sponsor-card:hover {
  border-color: var(--border);
  transform: translateY(-1px);
}
.sponsor-card-thumb {
  width: 100%;
  height: 80px;
  position: relative;
  overflow: hidden;
}
.sponsor-card-body {
  padding: 0.6rem 0.7rem;
}
.sponsor-card-body h4 {
  font-family: var(--serif);
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.4rem;
  color: var(--fg);
}
.sponsor-card-body .sponsor-source {
  font-family: var(--mono);
  font-size: 0.55rem;
  color: color-mix(in srgb, var(--text-muted) 60%, transparent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media print {
        .topbar, .sidebar, .ad-blend-box, .ad-sidebar-card, .ad-promo-card, .ad-hero-undercard,
        .ad-category-break, .ad-pre-footer, .docked-sticky-ad, .sponsor-notice, .mobile-welcome-overlay, .sponsor-grid,
        .ad-unit-300x250, .ad-unit-468x60, .ad-desktop-leaderboard, .ad-mobile-banner,
        .right-rail, footer, .no-print { display: none !important; }
        .content-area { margin: 0; padding: 0; width: 100%; max-width: 100%; }
        .main-body { max-width: 100%; margin: 0; padding: 0; }
        .article-container { border: none !important; padding: 0 !important; max-width: 100% !important; box-shadow: none !important; }
        body { background: white !important; color: black !important; }
        * { color: black !important; background: transparent !important; border-color: #ccc !important; }
        input, textarea, select { border: 1px solid transparent !important; }
        .print-only { display: block !important; }
      }
      .print-only { display: none; }
    </style>
  `;

  const commonStyles = {
    btn: `background: var(--btn-bg); color: var(--btn-fg); border: none; padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; letter-spacing: 0.03em;`,
    input: `width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border); background: var(--input-bg, #fff); color: var(--fg);`,
    label: `font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; display: block;`,
    card: `background: var(--surface); border: 1px solid var(--border); padding: 1rem;`,
    h2: `font-family: var(--serif); font-size: 1.3rem; margin: 2rem 0 1rem;`,
    table: `width: 100%; border-collapse: collapse;`,
    thtd: `padding: 0.5rem 0.75rem; border: 1px solid var(--border); font-size: 0.9rem; text-align: left;`,
    textarea: `width: 100%; height: 200px; padding: 0.85rem; font-family: var(--mono); font-size: 0.9rem; border: 1px solid var(--border); background: var(--input-bg, #fff); color: var(--fg); resize: vertical;`
  };

  // 1. Text De-duplicator
  const deduplicatorBody = `
    <div class="article-container" style="max-width: 900px;">
      <h1>Text De-duplicator</h1>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Remove duplicate lines from your text. Operates entirely in your browser.</p>
      
      <div style="display: flex; flex-direction: column; gap: 1rem; @media(min-width:768px){flex-direction:row;}">
        <div style="flex: 1;">
          <label style="${commonStyles.label}">Input Text</label>
          <textarea id="dd-input" style="${commonStyles.textarea} height: 300px;" placeholder="Paste text here..."></textarea>
        </div>
        <div style="flex: 1;">
          <label style="${commonStyles.label}">Output Text</label>
          <textarea id="dd-output" readonly style="${commonStyles.textarea} height: 300px; background: var(--surface);"></textarea>
        </div>
      </div>
      
      <div style="${commonStyles.card} margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
        <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="dd-case" checked> Case-insensitive</label>
        <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="dd-trim" checked> Trim whitespace</label>
        <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="dd-sort"> Sort output</label>
        <div style="flex: 1;"></div>
        <button id="dd-process" style="${commonStyles.btn}">Process</button>
        <button id="dd-copy" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Copy Result</button>
      </div>
      
      <div id="dd-stats" style="${commonStyles.card} margin-top: 1rem; font-family: var(--mono); font-size: 0.9rem; text-align: center;">
        Total lines: 0 | Unique lines: 0 | Duplicates removed: 0
      </div>

      <script>
        document.getElementById('dd-process').addEventListener('click', () => {
          const text = document.getElementById('dd-input').value;
          const caseIns = document.getElementById('dd-case').checked;
          const trimWs = document.getElementById('dd-trim').checked;
          const sortOut = document.getElementById('dd-sort').checked;
          
          const lines = text.split('\\n');
          const total = lines.length;
          const seen = new Set();
          const result = [];
          
          for (const line of lines) {
            let processed = line;
            if (trimWs) processed = processed.trim();
            let key = processed;
            if (caseIns) key = key.toLowerCase();
            
            if (!seen.has(key)) {
              seen.add(key);
              result.push(processed);
            }
          }
          
          if (sortOut) {
            result.sort((a, b) => {
              if (caseIns) return a.toLowerCase().localeCompare(b.toLowerCase());
              return a.localeCompare(b);
            });
          }
          
          document.getElementById('dd-output').value = result.join('\\n');
          document.getElementById('dd-stats').textContent = \`Total lines: \${total} | Unique lines: \${result.length} | Duplicates removed: \${total - result.length}\`;
        });
        
        document.getElementById('dd-copy').addEventListener('click', () => {
          const out = document.getElementById('dd-output');
          out.select();
          document.execCommand('copy');
        });
      </script>
    </div>
  `;

  // 2. Time Tracker (Toggl-style Timesheet)
  const timeTrackerBody = `
    ${printCss}
    <div class="article-container" style="max-width: 1100px;">
        <style>
            :root {
                --tt-header-bg: var(--surface);
                --tt-cell-border: var(--border);
                --tt-cell-hover: var(--surface-alt);
                --tt-active-col: rgba(100, 100, 100, 0.05);
            }
            .tt-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 10px;
            }
            .tt-nav {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .tt-nav-btn {
                background: none;
                border: 1px solid var(--border);
                color: var(--fg);
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
            }
            .tt-nav-btn:hover {
                background: var(--surface-alt);
            }
            .tt-date-range {
                font-weight: bold;
                font-family: var(--mono);
            }
            .tt-filters {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }
            .tt-filter-pill {
                padding: 4px 10px;
                border: 1px dashed var(--border);
                border-radius: 20px;
                font-size: 0.85em;
                color: var(--text-muted);
                cursor: pointer;
            }
            .tt-filter-pill:hover {
                background: var(--surface-alt);
            }
            .tt-view-toggle {
                display: flex;
                border: 1px solid var(--border);
                border-radius: 6px;
                overflow: hidden;
            }
            .tt-view-btn {
                background: var(--surface);
                border: none;
                padding: 6px 12px;
                cursor: pointer;
                color: var(--text-muted);
            }
            .tt-view-btn.active {
                background: var(--btn-bg);
                color: var(--btn-fg);
            }
            .tt-grid {
                width: 100%;
                border-collapse: collapse;
                table-layout: fixed;
            }
            .tt-grid th, .tt-grid td {
                border: 1px solid var(--tt-cell-border);
                padding: 8px;
                text-align: center;
            }
            .tt-grid th:first-child, .tt-grid td:first-child {
                text-align: left;
                width: 25%;
            }
            .tt-grid th {
                background: var(--tt-header-bg);
                font-weight: normal;
                font-size: 0.9em;
                color: var(--text-muted);
            }
            .tt-cell {
                cursor: pointer;
                min-height: 30px;
                position: relative;
            }
            .tt-cell:hover {
                background: var(--tt-cell-hover);
            }
            .tt-cell-input {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid var(--border);
                background: var(--bg);
                color: var(--fg);
                text-align: center;
                display: none;
            }
            .tt-cell.editing .tt-cell-input {
                display: block;
            }
            .tt-cell.editing .tt-cell-val {
                display: none;
            }
            .tt-project-label {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .tt-project-color {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
            }
            .tt-total-col {
                font-weight: bold;
                background: var(--surface);
            }
            .tt-add-task {
                margin-top: 10px;
                color: var(--text-muted);
                cursor: pointer;
                font-size: 0.9em;
                display: inline-block;
            }
            .tt-add-task:hover {
                text-decoration: underline;
            }
            
            .tt-live-timer {
                display: flex;
                gap: 10px;
                background: var(--surface);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--border);
                margin-bottom: 20px;
                align-items: center;
                flex-wrap: wrap;
            }
            .tt-timer-input {
                flex-grow: 1;
                border: none;
                background: transparent;
                color: var(--fg);
                font-size: 1em;
                outline: none;
            }
            .tt-timer-select {
                background: transparent;
                border: 1px solid var(--border);
                color: var(--fg);
                padding: 5px;
                border-radius: 4px;
            }
            .tt-timer-display {
                font-family: var(--mono);
                font-size: 1.2em;
                font-weight: bold;
                min-width: 80px;
                text-align: right;
            }
            .tt-timer-btn {
                background: var(--btn-bg);
                color: var(--btn-fg);
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .tt-timer-btn.stop {
                background: #e74c3c;
            }
            .tt-timer-btn.start {
                background: #2ecc71;
            }
            
            #tt-entries-view {
                display: none;
            }
            .tt-entry-row {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                border-bottom: 1px solid var(--border);
            }
            .tt-entry-desc { flex-grow: 1; }
            .tt-entry-project { color: var(--text-muted); width: 150px; }
            .tt-entry-dur { font-family: var(--mono); font-weight: bold; width: 80px; text-align: right; }
            .tt-entry-date { color: var(--text-subtle); width: 100px; text-align: right; }
            .tt-entry-delete { color: #e74c3c; cursor: pointer; margin-left: 15px; background: none; border: none;}
        </style>

        <h1 style="${commonStyles.h2}">Time Tracker</h1>
        
        <div class="tt-live-timer">
            <input type="text" id="tt-timer-desc" class="tt-timer-input" placeholder="What are you working on?">
            <select id="tt-timer-project" class="tt-timer-select">
                <option value="">No Project</option>
            </select>
            <div id="tt-timer-display" class="tt-timer-display">00:00:00</div>
            <button id="tt-timer-toggle" class="tt-timer-btn start">▶</button>
        </div>

        <div class="tt-header">
            <div class="tt-nav">
                <button class="tt-nav-btn" id="tt-prev-week">&lt;</button>
                <button class="tt-nav-btn" id="tt-next-week">&gt;</button>
                <span class="tt-date-range" id="tt-date-range">...</span>
                <button class="tt-nav-btn" id="tt-this-week">This week</button>
            </div>
            
            <div class="tt-filters">
                <span class="tt-filter-pill">Billable</span>
                <span class="tt-filter-pill">Tag</span>
                <span class="tt-filter-pill">Tracked time</span>
                <span class="tt-filter-pill">Archived tasks</span>
                <span class="tt-filter-pill">Date added</span>
            </div>

            <div class="tt-view-toggle">
                <button class="tt-view-btn active" id="tt-btn-timesheet">Timesheet</button>
                <button class="tt-view-btn" id="tt-btn-entries">Time entries</button>
            </div>
        </div>

        <div id="tt-timesheet-view">
            <div style="overflow-x: auto;">
                <table class="tt-grid" id="tt-grid">
                    <thead>
                        <tr id="tt-grid-header">
                            <th>Task/Project</th>
                            <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
                            <th class="tt-total-col">Total</th>
                        </tr>
                    </thead>
                    <tbody id="tt-grid-body">
                    </tbody>
                </table>
            </div>
            <div class="tt-add-task" id="tt-add-task">+ Add task</div>
        </div>

        <div id="tt-entries-view">
            <div id="tt-entries-list"></div>
        </div>

        <script>
            (() => {
                // State
                let currentDate = new Date();
                let projects = JSON.parse(localStorage.getItem('dts-time-projects') || '[]');
                let entries = JSON.parse(localStorage.getItem('dts-time-entries') || '[]');
                
                // Initialize default project if none exists
                if (projects.length === 0) {
                    projects.push({ id: 'proj-' + Date.now(), name: 'General', color: '#3498db' });
                    saveProjects();
                }

                // Timer state
                let timerInterval = null;
                let timerSeconds = 0;
                let isTimerRunning = false;
                
                function saveProjects() { localStorage.setItem('dts-time-projects', JSON.stringify(projects)); }
                function saveEntries() { localStorage.setItem('dts-time-entries', JSON.stringify(entries)); }
                
                function formatDuration(mins) {
                    if (!mins) return '-';
                    const h = Math.floor(mins / 60);
                    const m = mins % 60;
                    if (h > 0 && m > 0) return \`\${h}h \${m}m\`;
                    if (h > 0) return \`\${h}h\`;
                    return \`\${m}m\`;
                }

                function parseDuration(str) {
                    if (!str || str.trim() === '') return 0;
                    let mins = 0;
                    const hMatch = str.match(/(\\d+)\\s*h/i);
                    const mMatch = str.match(/(\\d+)\\s*m/i);
                    const numMatch = str.match(/^\\d+$/);
                    
                    if (hMatch) mins += parseInt(hMatch[1]) * 60;
                    if (mMatch) mins += parseInt(mMatch[1]);
                    
                    if (!hMatch && !mMatch && numMatch) {
                        // Just a number, assume hours if <=24, else mins
                        const num = parseInt(numMatch[0]);
                        mins = num <= 24 ? num * 60 : num;
                    }
                    return mins;
                }

                function getWeekRange(date) {
                    const d = new Date(date);
                    const day = d.getDay() || 7; // Sunday is 7
                    d.setDate(d.getDate() - day + 1); // Monday
                    const week = [];
                    for(let i=0; i<7; i++) {
                        const sd = new Date(d);
                        sd.setDate(d.getDate() + i);
                        week.push(sd);
                    }
                    return week;
                }

                function formatDateForStorage(date) {
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                    const dd = String(date.getDate()).padStart(2, '0');
                    return \`\${yyyy}-\${mm}-\${dd}\`;
                }

                function getMonthShortName(monthIndex) {
                    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
                }

                function updateNav() {
                    const week = getWeekRange(currentDate);
                    const start = week[0];
                    const end = week[6];
                    let text = '';
                    if (start.getMonth() === end.getMonth()) {
                        text = \`\${getMonthShortName(start.getMonth())} \${start.getDate()} - \${end.getDate()}\`;
                    } else {
                        text = \`\${getMonthShortName(start.getMonth())} \${start.getDate()} - \${getMonthShortName(end.getMonth())} \${end.getDate()}\`;
                    }
                    document.getElementById('tt-date-range').textContent = text;
                }

                function getEntriesForDateAndProject(dateStr, projectId) {
                    return entries.filter(e => e.date === dateStr && e.projectId === projectId);
                }

                function getDailyTotal(dateStr) {
                    return entries.filter(e => e.date === dateStr).reduce((sum, e) => sum + (e.durationMins || 0), 0);
                }
                
                function getProjectTotal(projectId, weekDates) {
                    let total = 0;
                    weekDates.forEach(d => {
                        const dateStr = formatDateForStorage(d);
                        total += getEntriesForDateAndProject(dateStr, projectId).reduce((sum, e) => sum + (e.durationMins || 0), 0);
                    });
                    return total;
                }

                function renderTimesheet() {
                    const weekDates = getWeekRange(currentDate);
                    const headerRow = document.getElementById('tt-grid-header');
                    
                    // Update header
                    let headerHtml = '<th>Task/Project</th>';
                    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    
                    weekDates.forEach((d, i) => {
                        const dateStr = formatDateForStorage(d);
                        const dailyTotal = getDailyTotal(dateStr);
                        const todayStr = formatDateForStorage(new Date());
                        const isToday = dateStr === todayStr;
                        
                        headerHtml += \`<th style="\${isToday ? 'background: var(--tt-active-col);' : ''}">
                            \${dayNames[i]} \${d.getDate()} <br>
                            <small>\${formatDuration(dailyTotal)}</small>
                        </th>\`;
                    });
                    headerHtml += '<th class="tt-total-col">Total</th>';
                    headerRow.innerHTML = headerHtml;

                    // Update body
                    const tbody = document.getElementById('tt-grid-body');
                    let bodyHtml = '';
                    
                    projects.forEach(p => {
                        bodyHtml += \`<tr>
                            <td>
                                <div class="tt-project-label">
                                    <span class="tt-project-color" style="background-color: \${p.color}"></span>
                                    \${p.name}
                                </div>
                            </td>\`;
                        
                        weekDates.forEach(d => {
                            const dateStr = formatDateForStorage(d);
                            const dayEntries = getEntriesForDateAndProject(dateStr, p.id);
                            const totalMins = dayEntries.reduce((sum, e) => sum + (e.durationMins || 0), 0);
                            const todayStr = formatDateForStorage(new Date());
                            const isToday = dateStr === todayStr;
                            
                            bodyHtml += \`<td class="tt-cell" data-date="\${dateStr}" data-project="\${p.id}" style="\${isToday ? 'background: var(--tt-active-col);' : ''}">
                                <span class="tt-cell-val">\${formatDuration(totalMins)}</span>
                                <input type="text" class="tt-cell-input" value="\${totalMins ? formatDuration(totalMins) : ''}">
                            </td>\`;
                        });
                        
                        bodyHtml += \`<td class="tt-total-col">\${formatDuration(getProjectTotal(p.id, weekDates))}</td></tr>\`;
                    });
                    tbody.innerHTML = bodyHtml;
                    
                    bindCellEvents();
                }

                function bindCellEvents() {
                    const cells = document.querySelectorAll('.tt-cell');
                    cells.forEach(cell => {
                        cell.addEventListener('click', function(e) {
                            if (this.classList.contains('editing')) return;
                            
                            // Close others
                            document.querySelectorAll('.tt-cell.editing').forEach(c => {
                                closeCell(c);
                            });
                            
                            this.classList.add('editing');
                            const input = this.querySelector('.tt-cell-input');
                            input.focus();
                            input.select();
                        });
                        
                        const input = cell.querySelector('.tt-cell-input');
                        input.addEventListener('blur', function() {
                            closeCell(cell);
                        });
                        input.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') closeCell(cell);
                            if (e.key === 'Escape') {
                                this.value = cell.querySelector('.tt-cell-val').textContent; // revert
                                cell.classList.remove('editing');
                            }
                        });
                    });
                }
                
                function closeCell(cell) {
                    if (!cell.classList.contains('editing')) return;
                    cell.classList.remove('editing');
                    
                    const input = cell.querySelector('.tt-cell-input');
                    const newMins = parseDuration(input.value);
                    const dateStr = cell.getAttribute('data-date');
                    const projectId = cell.getAttribute('data-project');
                    
                    // Remove old entries for this project+date and add new one if > 0
                    entries = entries.filter(e => !(e.date === dateStr && e.projectId === projectId));
                    
                    if (newMins > 0) {
                        entries.push({
                            id: 'entry-' + Date.now(),
                            projectId: projectId,
                            date: dateStr,
                            durationMins: newMins,
                            description: 'Tracked time'
                        });
                    }
                    saveEntries();
                    renderTimesheet();
                    renderEntries();
                }

                function renderEntries() {
                    const list = document.getElementById('tt-entries-list');
                    const weekDates = getWeekRange(currentDate);
                    const startDate = formatDateForStorage(weekDates[0]);
                    const endDate = formatDateForStorage(weekDates[6]);
                    
                    const weekEntries = entries.filter(e => e.date >= startDate && e.date <= endDate)
                        .sort((a, b) => b.date.localeCompare(a.date));
                        
                    if (weekEntries.length === 0) {
                        list.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--text-muted);">No time entries this week.</div>';
                        return;
                    }
                    
                    let html = '';
                    weekEntries.forEach(e => {
                        const proj = projects.find(p => p.id === e.projectId) || { name: 'Unknown', color: '#ccc' };
                        html += \`
                            <div class="tt-entry-row">
                                <div class="tt-entry-desc">\${e.description || '(no description)'}</div>
                                <div class="tt-entry-project">
                                    <span class="tt-project-color" style="background-color: \${proj.color}"></span>
                                    \${proj.name}
                                </div>
                                <div class="tt-entry-date">\${e.date}</div>
                                <div class="tt-entry-dur">\${formatDuration(e.durationMins)}</div>
                                <button class="tt-entry-delete" data-id="\${e.id}">×</button>
                            </div>
                        \`;
                    });
                    list.innerHTML = html;
                    
                    list.querySelectorAll('.tt-entry-delete').forEach(btn => {
                        btn.addEventListener('click', function() {
                            const id = this.getAttribute('data-id');
                            entries = entries.filter(e => e.id !== id);
                            saveEntries();
                            renderTimesheet();
                            renderEntries();
                        });
                    });
                }
                
                function updateTimerDisplay() {
                    const h = Math.floor(timerSeconds / 3600);
                    const m = Math.floor((timerSeconds % 3600) / 60);
                    const s = timerSeconds % 60;
                    document.getElementById('tt-timer-display').textContent = 
                        \`\${h.toString().padStart(2, '0')}:\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
                }

                function toggleTimer() {
                    const btn = document.getElementById('tt-timer-toggle');
                    if (isTimerRunning) {
                        // Stop
                        clearInterval(timerInterval);
                        isTimerRunning = false;
                        btn.textContent = '▶';
                        btn.classList.remove('stop');
                        btn.classList.add('start');
                        
                        // Save entry
                        if (timerSeconds > 60) {
                            const projId = document.getElementById('tt-timer-project').value || projects[0]?.id;
                            const desc = document.getElementById('tt-timer-desc').value || 'Timer entry';
                            const mins = Math.round(timerSeconds / 60);
                            
                            if (projId) {
                                entries.push({
                                    id: 'entry-' + Date.now(),
                                    projectId: projId,
                                    date: formatDateForStorage(new Date()),
                                    durationMins: mins,
                                    description: desc
                                });
                                saveEntries();
                                renderTimesheet();
                                renderEntries();
                            }
                        }
                        
                        timerSeconds = 0;
                        updateTimerDisplay();
                        document.getElementById('tt-timer-desc').value = '';
                    } else {
                        // Start
                        isTimerRunning = true;
                        btn.textContent = '■';
                        btn.classList.remove('start');
                        btn.classList.add('stop');
                        timerInterval = setInterval(() => {
                            timerSeconds++;
                            updateTimerDisplay();
                        }, 1000);
                    }
                }

                function init() {
                    // Populate project select
                    const projSelect = document.getElementById('tt-timer-project');
                    projSelect.innerHTML = '<option value="">No Project</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');

                    document.getElementById('tt-prev-week').addEventListener('click', () => {
                        currentDate.setDate(currentDate.getDate() - 7);
                        updateAll();
                    });
                    
                    document.getElementById('tt-next-week').addEventListener('click', () => {
                        currentDate.setDate(currentDate.getDate() + 7);
                        updateAll();
                    });
                    
                    document.getElementById('tt-this-week').addEventListener('click', () => {
                        currentDate = new Date();
                        updateAll();
                    });
                    
                    document.getElementById('tt-btn-timesheet').addEventListener('click', (e) => {
                        e.target.classList.add('active');
                        document.getElementById('tt-btn-entries').classList.remove('active');
                        document.getElementById('tt-timesheet-view').style.display = 'block';
                        document.getElementById('tt-entries-view').style.display = 'none';
                    });
                    
                    document.getElementById('tt-btn-entries').addEventListener('click', (e) => {
                        e.target.classList.add('active');
                        document.getElementById('tt-btn-timesheet').classList.remove('active');
                        document.getElementById('tt-timesheet-view').style.display = 'none';
                        document.getElementById('tt-entries-view').style.display = 'block';
                    });
                    
                    document.getElementById('tt-add-task').addEventListener('click', () => {
                        const name = prompt('Enter new project/task name:');
                        if (name) {
                            const colors = ['#e74c3c', '#8e44ad', '#2980b9', '#27ae60', '#f39c12', '#d35400', '#c0392b', '#16a085'];
                            projects.push({
                                id: 'proj-' + Date.now(),
                                name: name,
                                color: colors[projects.length % colors.length]
                            });
                            saveProjects();
                            // Update select
                            projSelect.innerHTML = '<option value="">No Project</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
                            renderTimesheet();
                        }
                    });

                    document.getElementById('tt-timer-toggle').addEventListener('click', toggleTimer);

                    updateAll();
                }

                function updateAll() {
                    updateNav();
                    renderTimesheet();
                    renderEntries();
                }

                // Initial render
                init();
            })();
        </script>
    </div>
`;

  // 3. Invoice Generator
  const invoiceGeneratorBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px; padding: 2rem; background: #fff; color: #000;">
      <div class="no-print" style="margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem;">
        <h1>Invoice Generator</h1>
        <div style="display: flex; gap: 1rem;">
          <button onclick="window.print()" style="${commonStyles.btn} background: #2563eb; color: #fff;">Print / Save PDF</button>
        </div>
      </div>
      
      <!-- Actual Invoice Document -->
      <div id="invoice-doc" style="font-family: Helvetica, Arial, sans-serif; line-height: 1.5; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem;">
          <div style="flex: 1;">
            <h2 style="margin: 0 0 1rem; font-size: 2.5rem; font-weight: bold; color: #111;">INVOICE</h2>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem; font-size: 0.9rem; max-width: 300px;">
              <strong>Invoice #:</strong> <input type="text" id="inv-num" value="INV-001" style="${commonStyles.input}">
              <strong>Date:</strong> <input type="date" id="inv-date" style="${commonStyles.input}">
              <strong>Due Date:</strong> <input type="date" id="inv-due" style="${commonStyles.input}">
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 3rem; gap: 2rem;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">FROM</h3>
            <input type="text" id="inv-from-name" placeholder="Your Name / Company" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
            <textarea id="inv-from-addr" placeholder="Your Address" style="${commonStyles.input} resize: none; height: 60px; margin-bottom: 0.25rem;"></textarea>
            <input type="email" id="inv-from-email" placeholder="Your Email" style="${commonStyles.input}">
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">TO</h3>
            <input type="text" id="inv-to-name" placeholder="Client Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
            <textarea id="inv-to-addr" placeholder="Client Address" style="${commonStyles.input} resize: none; height: 60px; margin-bottom: 0.25rem;"></textarea>
            <input type="email" id="inv-to-email" placeholder="Client Email" style="${commonStyles.input}">
          </div>
        </div>

        <table style="${commonStyles.table} margin-bottom: 2rem;" id="inv-table">
          <thead>
            <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
              <th style="${commonStyles.thtd} width: 50%;">Description</th>
              <th style="${commonStyles.thtd} width: 15%; text-align: center;">Qty</th>
              <th style="${commonStyles.thtd} width: 15%; text-align: right;">Rate</th>
              <th style="${commonStyles.thtd} width: 15%; text-align: right;">Amount</th>
              <th style="${commonStyles.thtd} width: 5%;" class="no-print"></th>
            </tr>
          </thead>
          <tbody id="inv-items">
            <!-- Items injected by JS -->
          </tbody>
        </table>
        
        <div class="no-print" style="margin-bottom: 2rem;">
          <button id="inv-add-row" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">+ Add Row</button>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-bottom: 3rem;">
          <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
              <span>Subtotal:</span>
              <span id="inv-subtotal">$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; align-items: center;">
              <span>Tax Rate (%):</span>
              <input type="number" id="inv-tax-rate" value="0" style="${commonStyles.input} width: 80px; text-align: right;">
            </div>
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
              <span>Tax Amount:</span>
              <span id="inv-tax-amt">$0.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 1rem 0; border-top: 2px solid #333; font-weight: bold; font-size: 1.2rem;">
              <span>Total:</span>
              <span id="inv-total">$0.00</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem;">Notes / Terms</h3>
          <textarea id="inv-notes" style="${commonStyles.input} height: 100px; resize: vertical;" placeholder="Payment terms, bank details, or thank you note..."></textarea>
        </div>
      </div>

      <script>
        document.getElementById('inv-date').valueAsDate = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        document.getElementById('inv-due').valueAsDate = nextMonth;

        const tbody = document.getElementById('inv-items');
        
        function updateTotals() {
          let subtotal = 0;
          document.querySelectorAll('.inv-row').forEach(row => {
            const qty = parseFloat(row.querySelector('.inv-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.inv-rate').value) || 0;
            const amt = qty * rate;
            row.querySelector('.inv-amt').textContent = '$' + amt.toFixed(2);
            subtotal += amt;
          });
          
          document.getElementById('inv-subtotal').textContent = '$' + subtotal.toFixed(2);
          const taxRate = parseFloat(document.getElementById('inv-tax-rate').value) || 0;
          const taxAmt = subtotal * (taxRate / 100);
          document.getElementById('inv-tax-amt').textContent = '$' + taxAmt.toFixed(2);
          document.getElementById('inv-total').textContent = '$' + (subtotal + taxAmt).toFixed(2);
        }

        function addRow(desc = '', qty = 1, rate = 0) {
          const tr = document.createElement('tr');
          tr.className = 'inv-row';
          tr.innerHTML = \`
            <td style="${commonStyles.thtd}"><input type="text" class="inv-desc ${commonStyles.input.replace('var(--input-bg, #fff)','transparent')}" style="width:100%; border:none; padding:0.2rem;" value="\${desc}" placeholder="Item description"></td>
            <td style="${commonStyles.thtd} text-align: center;"><input type="number" class="inv-qty ${commonStyles.input.replace('var(--input-bg, #fff)','transparent')}" style="width:100%; border:none; text-align:center; padding:0.2rem;" value="\${qty}" min="0" step="0.01" onchange="updateTotals()"></td>
            <td style="${commonStyles.thtd} text-align: right;"><input type="number" class="inv-rate ${commonStyles.input.replace('var(--input-bg, #fff)','transparent')}" style="width:100%; border:none; text-align:right; padding:0.2rem;" value="\${rate}" min="0" step="0.01" onchange="updateTotals()"></td>
            <td style="${commonStyles.thtd} text-align: right;" class="inv-amt">$0.00</td>
            <td style="${commonStyles.thtd} text-align: center;" class="no-print"><button onclick="this.closest('tr').remove(); updateTotals()" style="background:none; border:none; color:red; cursor:pointer;">&times;</button></td>
          \`;
          tbody.appendChild(tr);
          updateTotals();
        }

        document.getElementById('inv-add-row').addEventListener('click', () => addRow());
        document.getElementById('inv-tax-rate').addEventListener('input', updateTotals);

        // Add initial row
        addRow('Web Development Services', 1, 100);
      </script>
    </div>
  `;

  // 4. Invoice from Time
  const invoiceFromTimeBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px;">
      <div class="no-print">
        <h1>Invoice from Time Entries</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Turn your tracked time into a professional invoice.</p>
        
        <div style="${commonStyles.card} margin-bottom: 2rem;">
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;">
            <div style="flex: 1; min-width: 200px;">
              <label style="${commonStyles.label}">Project</label>
              <select id="ift-project" class="search-input" style="${commonStyles.input}"></select>
            </div>
            <div>
              <label style="${commonStyles.label}">From Date</label>
              <input type="date" id="ift-from" class="search-input" style="${commonStyles.input}">
            </div>
            <div>
              <label style="${commonStyles.label}">To Date</label>
              <input type="date" id="ift-to" class="search-input" style="${commonStyles.input}">
            </div>
            <div>
              <label style="${commonStyles.label}">Hourly Rate ($)</label>
              <input type="number" id="ift-rate" value="50" class="search-input" style="${commonStyles.input} width: 100px;">
            </div>
            <button id="ift-filter" style="${commonStyles.btn}">Find Entries</button>
          </div>
        </div>

        <div id="ift-results-container" style="display: none; margin-bottom: 2rem;">
          <h2 style="${commonStyles.h2} margin-top: 0;">Select Entries to Invoice</h2>
          <table style="${commonStyles.table} margin-bottom: 1rem;">
            <thead style="background: var(--surface);">
              <tr>
                <th style="${commonStyles.thtd} width: 40px;"><input type="checkbox" id="ift-check-all" checked></th>
                <th style="${commonStyles.thtd}">Date</th>
                <th style="${commonStyles.thtd}">Description</th>
                <th style="${commonStyles.thtd}">Duration</th>
              </tr>
            </thead>
            <tbody id="ift-entries"></tbody>
          </table>
          <button id="ift-generate" style="${commonStyles.btn} background: #2563eb; color: #fff;">Generate Invoice Preview</button>
        </div>
        
        <div id="ift-empty" style="display: none; padding: 2rem; text-align: center; background: var(--surface); border: 1px solid var(--border);">
          No time entries found. <a href="time-tracker.html" style="color: var(--link-color, #2563eb);">Go track some time!</a>
        </div>
      </div>

      <!-- Shared Invoice Template (hidden by default) -->
      <div id="ift-invoice-preview" style="display: none; padding: 2rem; background: #fff; color: #000; font-family: Helvetica, Arial, sans-serif; border: 1px solid #ccc; margin-top: 2rem;">
        <div class="no-print" style="margin-bottom: 2rem; text-align: right;">
          <button onclick="window.print()" style="${commonStyles.btn} background: #2563eb; color: #fff;">Print / Save PDF</button>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3rem;">
          <div style="flex: 1;">
            <h2 style="margin: 0 0 1rem; font-size: 2.5rem; font-weight: bold; color: #111;">INVOICE</h2>
            <div style="display: grid; grid-template-columns: 100px 1fr; gap: 0.5rem; font-size: 0.9rem; max-width: 300px;">
              <strong>Invoice #:</strong> <input type="text" value="INV-002" style="${commonStyles.input}">
              <strong>Date:</strong> <input type="date" id="ift-inv-date" style="${commonStyles.input}">
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 3rem; gap: 2rem;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">FROM</h3>
            <input type="text" placeholder="Your Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
          </div>
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem; color: #666; font-size: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">TO</h3>
            <input type="text" id="ift-client-name" placeholder="Client Name" style="${commonStyles.input} font-weight: bold; margin-bottom: 0.25rem;">
          </div>
        </div>

        <table style="${commonStyles.table} margin-bottom: 2rem;">
          <thead style="background: #f8f9fa;">
            <tr>
              <th style="${commonStyles.thtd}">Description</th>
              <th style="${commonStyles.thtd} text-align: center;">Hours</th>
              <th style="${commonStyles.thtd} text-align: right;">Rate</th>
              <th style="${commonStyles.thtd} text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody id="ift-inv-items"></tbody>
        </table>

        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 300px; display: flex; justify-content: space-between; padding: 1rem 0; border-top: 2px solid #333; font-weight: bold; font-size: 1.2rem;">
            <span>Total:</span>
            <span id="ift-inv-total">$0.00</span>
          </div>
        </div>
      </div>

      <script>
        const projects = JSON.parse(localStorage.getItem('dts-time-projects') || '[]');
        const entries = JSON.parse(localStorage.getItem('dts-time-entries') || '[]');
        
        const projSelect = document.getElementById('ift-project');
        projSelect.innerHTML = '<option value="">All Projects</option>' + projects.map(p => \`<option value="\${p.id}">\${p.name}</option>\`).join('');
        
        let filteredEntries = [];

        document.getElementById('ift-filter').addEventListener('click', () => {
          const pid = projSelect.value;
          const from = document.getElementById('ift-from').value;
          const to = document.getElementById('ift-to').value;
          
          filteredEntries = entries.filter(e => {
            if (pid && e.projectId !== pid) return false;
            if (from && e.date < from) return false;
            if (to && e.date > to) return false;
            return true;
          });
          
          if (filteredEntries.length === 0) {
            document.getElementById('ift-empty').style.display = 'block';
            document.getElementById('ift-results-container').style.display = 'none';
          } else {
            document.getElementById('ift-empty').style.display = 'none';
            document.getElementById('ift-results-container').style.display = 'block';
            
            document.getElementById('ift-entries').innerHTML = filteredEntries.map((e, i) => {
              const p = projects.find(pr => pr.id === e.projectId) || { name: 'Unknown' };
              const hrs = (e.durationMins / 60).toFixed(2);
              return \`
                <tr>
                  <td style="${commonStyles.thtd} text-align: center;"><input type="checkbox" class="ift-chk" data-idx="\${i}" checked></td>
                  <td style="${commonStyles.thtd}">\${e.date}</td>
                  <td style="${commonStyles.thtd}">[\${p.name}] \${e.description}</td>
                  <td style="${commonStyles.thtd}">\${hrs} hrs</td>
                </tr>
              \`;
            }).join('');
          }
        });

        document.getElementById('ift-check-all').addEventListener('change', (e) => {
          document.querySelectorAll('.ift-chk').forEach(c => c.checked = e.target.checked);
        });

        document.getElementById('ift-generate').addEventListener('click', () => {
          const rate = parseFloat(document.getElementById('ift-rate').value) || 0;
          const selectedIdx = Array.from(document.querySelectorAll('.ift-chk:checked')).map(c => parseInt(c.dataset.idx));
          
          if (selectedIdx.length === 0) {
            alert('Select at least one entry');
            return;
          }

          const selectedEntries = selectedIdx.map(i => filteredEntries[i]);
          
          let total = 0;
          document.getElementById('ift-inv-items').innerHTML = selectedEntries.map(e => {
            const hrs = e.durationMins / 60;
            const amt = hrs * rate;
            total += amt;
            const p = projects.find(pr => pr.id === e.projectId) || { name: '' };
            return \`
              <tr>
                <td style="${commonStyles.thtd}">\${e.date} - \${e.description}</td>
                <td style="${commonStyles.thtd} text-align: center;">\${hrs.toFixed(2)}</td>
                <td style="${commonStyles.thtd} text-align: right;">$\${rate.toFixed(2)}</td>
                <td style="${commonStyles.thtd} text-align: right;">$\${amt.toFixed(2)}</td>
              </tr>
            \`;
          }).join('');
          
          document.getElementById('ift-inv-total').textContent = '$' + total.toFixed(2);
          document.getElementById('ift-inv-date').valueAsDate = new Date();
          
          if (projSelect.value) {
            const p = projects.find(pr => pr.id === projSelect.value);
            if (p) document.getElementById('ift-client-name').value = p.name;
          }
          
          document.getElementById('ift-invoice-preview').style.display = 'block';
        });
      </script>
    </div>
  `;

  // 5. Tax Calculator
  const taxCalculatorBody = `
    <div class="article-container" style="max-width: 900px;">
      <h1>Income Tax Calculator</h1>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Estimate your annual taxes. (Disclaimer: For educational purposes only, not tax advice).</p>
      
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; @media(min-width:768px){grid-template-columns: 1fr 1fr;}">
        <div style="${commonStyles.card}">
          <h2 style="${commonStyles.h2} margin-top: 0;">Income & Profile</h2>
          
          <label style="${commonStyles.label}">System</label>
          <select id="tc-system" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;">
            <option value="us2024">US Federal (2024)</option>
            <option value="flat">Custom Flat Rate</option>
          </select>

          <label style="${commonStyles.label}">Gross Annual Income</label>
          <input type="number" id="tc-income" class="search-input" style="${commonStyles.input} margin-bottom: 1rem; font-size: 1.2rem;" value="75000" min="0">
          
          <div id="tc-us-fields">
            <label style="${commonStyles.label}">Filing Status</label>
            <select id="tc-status" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;">
              <option value="single">Single</option>
              <option value="mfj">Married Filing Jointly</option>
              <option value="hoh">Head of Household</option>
            </select>
            
            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 0.5rem;">
              <input type="checkbox" id="tc-std-deduct" checked> Use Standard Deduction
            </label>
            
            <div id="tc-custom-deduct-wrap" style="display: none; margin-bottom: 1rem;">
              <label style="${commonStyles.label}">Custom Deduction Amount</label>
              <input type="number" id="tc-deduction" class="search-input" style="${commonStyles.input}" value="0" min="0">
            </div>

            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom: 1rem;">
              <input type="checkbox" id="tc-se"> Self-Employed (Add SE Tax ~15.3%)
            </label>
          </div>

          <div id="tc-flat-fields" style="display: none;">
            <label style="${commonStyles.label}">Flat Tax Rate (%)</label>
            <input type="number" id="tc-flat-rate" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;" value="20" min="0" max="100">
          </div>

          <button id="tc-calc" style="${commonStyles.btn} width: 100%; font-size: 1rem; padding: 1rem;">Calculate Tax</button>
        </div>
        
        <div>
          <div style="${commonStyles.card}">
            <h2 style="${commonStyles.h2} margin-top: 0;">Results Summary</h2>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Gross Income:</span>
              <strong id="tc-res-gross">$0.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: #ef4444;">
              <span>Total Tax:</span>
              <strong id="tc-res-tax">$0.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); color: #22c55e;">
              <span>Net Income:</span>
              <strong id="tc-res-net" style="font-size: 1.2rem;">$0.00</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
              <span>Effective Tax Rate:</span>
              <span id="tc-res-rate">0.0%</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-muted);">
              <span>Taxable Income:</span>
              <span id="tc-res-taxable">$0.00</span>
            </div>
          </div>

          <div style="margin-top: 2rem;">
            <h3 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 1rem;">Tax Breakdown</h3>
            <div style="height: 30px; display: flex; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; background: var(--surface);">
              <div id="tc-bar-net" style="background: #22c55e; width: 80%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">Net</div>
              <div id="tc-bar-tax" style="background: #ef4444; width: 20%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.8rem;">Tax</div>
            </div>
            <table style="${commonStyles.table} font-size: 0.85rem;" id="tc-bracket-table">
              <!-- Injected by JS -->
            </table>
          </div>
        </div>
      </div>

      <script>
        // 2024 US Brackets (Simplified)
        const us2024 = {
          stdDeduction: { single: 14600, mfj: 29200, hoh: 21900 },
          brackets: {
            single: [
              { rate: 0.10, upTo: 11600 }, { rate: 0.12, upTo: 47150 }, { rate: 0.22, upTo: 100525 },
              { rate: 0.24, upTo: 191950 }, { rate: 0.32, upTo: 243725 }, { rate: 0.35, upTo: 609350 }, { rate: 0.37, upTo: Infinity }
            ],
            mfj: [
              { rate: 0.10, upTo: 23200 }, { rate: 0.12, upTo: 94300 }, { rate: 0.22, upTo: 201050 },
              { rate: 0.24, upTo: 383900 }, { rate: 0.32, upTo: 487450 }, { rate: 0.35, upTo: 731200 }, { rate: 0.37, upTo: Infinity }
            ],
            hoh: [
              { rate: 0.10, upTo: 16550 }, { rate: 0.12, upTo: 63100 }, { rate: 0.22, upTo: 100500 },
              { rate: 0.24, upTo: 191950 }, { rate: 0.32, upTo: 243700 }, { rate: 0.35, upTo: 609350 }, { rate: 0.37, upTo: Infinity }
            ]
          }
        };

        const sysSelect = document.getElementById('tc-system');
        sysSelect.addEventListener('change', () => {
          document.getElementById('tc-us-fields').style.display = sysSelect.value === 'us2024' ? 'block' : 'none';
          document.getElementById('tc-flat-fields').style.display = sysSelect.value === 'flat' ? 'block' : 'none';
        });

        document.getElementById('tc-std-deduct').addEventListener('change', (e) => {
          document.getElementById('tc-custom-deduct-wrap').style.display = e.target.checked ? 'none' : 'block';
        });

        function formatC(num) { return '$' + num.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }

        document.getElementById('tc-calc').addEventListener('click', () => {
          const gross = parseFloat(document.getElementById('tc-income').value) || 0;
          const system = document.getElementById('tc-system').value;
          
          let totalTax = 0;
          let taxable = gross;
          let breakdownHtml = '';

          if (system === 'us2024') {
            const status = document.getElementById('tc-status').value;
            const useStd = document.getElementById('tc-std-deduct').checked;
            const deduction = useStd ? us2024.stdDeduction[status] : (parseFloat(document.getElementById('tc-deduction').value) || 0);
            
            taxable = Math.max(0, gross - deduction);
            const brackets = us2024.brackets[status];
            
            let remaining = taxable;
            let prevLimit = 0;
            let incTax = 0;
            
            breakdownHtml = \`<tr><td style="${commonStyles.thtd}">Deduction</td><td style="${commonStyles.thtd} text-align:right;">-\${formatC(deduction)}</td></tr>\`;
            
            for (const b of brackets) {
              if (remaining <= 0) break;
              const chunk = Math.min(remaining, b.upTo - prevLimit);
              const taxForChunk = chunk * b.rate;
              incTax += taxForChunk;
              breakdownHtml += \`<tr><td style="${commonStyles.thtd}">\${(b.rate*100).toFixed(0)}% Bracket</td><td style="${commonStyles.thtd} text-align:right;">\${formatC(taxForChunk)}</td></tr>\`;
              remaining -= chunk;
              prevLimit = b.upTo;
            }
            
            totalTax += incTax;

            if (document.getElementById('tc-se').checked) {
              // simplified SE tax: 15.3% on 92.35% of net earnings
              const seTax = (gross * 0.9235) * 0.153;
              totalTax += seTax;
              breakdownHtml += \`<tr><td style="${commonStyles.thtd}">Self-Employment Tax</td><td style="${commonStyles.thtd} text-align:right;">\${formatC(seTax)}</td></tr>\`;
            }

          } else if (system === 'flat') {
            const rate = (parseFloat(document.getElementById('tc-flat-rate').value) || 0) / 100;
            totalTax = gross * rate;
            breakdownHtml = \`<tr><td style="${commonStyles.thtd}">Flat Rate (\${(rate*100).toFixed(1)}%)</td><td style="${commonStyles.thtd} text-align:right;">\${formatC(totalTax)}</td></tr>\`;
          }

          const net = gross - totalTax;
          const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

          document.getElementById('tc-res-gross').textContent = formatC(gross);
          document.getElementById('tc-res-taxable').textContent = formatC(taxable);
          document.getElementById('tc-res-tax').textContent = formatC(totalTax);
          document.getElementById('tc-res-net').textContent = formatC(net);
          document.getElementById('tc-res-rate').textContent = effectiveRate.toFixed(1) + '%';
          
          document.getElementById('tc-bracket-table').innerHTML = breakdownHtml;

          const taxPct = Math.min(100, Math.max(0, effectiveRate));
          document.getElementById('tc-bar-tax').style.width = taxPct + '%';
          document.getElementById('tc-bar-net').style.width = (100 - taxPct) + '%';
        });
        
        // Initial calc
        document.getElementById('tc-calc').click();
      </script>
    </div>
  `;

  // 6. Task Manager
  const taskManagerBody = `
    ${printCss}
    <div class="article-container" style="max-width: 900px;">
      <div class="no-print">
        <h1>Task Manager</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Organize your work. Data stored in your browser.</p>
        
        <div style="${commonStyles.card} margin-bottom: 2rem;">
          <form id="tm-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end;">
            <div style="grid-column: 1 / -1;">
              <label style="${commonStyles.label}">Task Title</label>
              <input type="text" id="tm-title" class="search-input" style="${commonStyles.input}" required>
            </div>
            <div>
              <label style="${commonStyles.label}">Priority</label>
              <select id="tm-priority" class="search-input" style="${commonStyles.input}">
                <option value="Low">Low</option>
                <option value="Medium" selected>Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label style="${commonStyles.label}">Due Date</label>
              <input type="date" id="tm-due" class="search-input" style="${commonStyles.input}">
            </div>
            <div style="grid-column: 1 / -1;">
              <button type="submit" style="${commonStyles.btn} width: 100%;">Add Task</button>
            </div>
          </form>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <select id="tm-filter" class="search-input" style="${commonStyles.input} width: auto;">
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <select id="tm-sort" class="search-input" style="${commonStyles.input} width: auto;">
              <option value="date">Sort by Date Added</option>
              <option value="due">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="window.print()" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Export PDF</button>
            <button id="tm-export-doc" style="${commonStyles.btn} background: #2563eb; color: white;">Export DOCX</button>
          </div>
        </div>
      </div>
      
      <div class="print-only">
        <h1>Task List</h1>
      </div>

      <div id="tm-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
        <!-- Tasks injected here -->
      </div>

      <script>
        let tasks = JSON.parse(localStorage.getItem('dts-tasks') || '[]');
        
        const priorityColors = { Low: '#3b82f6', Medium: '#10b981', High: '#f59e0b', Urgent: '#ef4444' };
        const priorityVal = { Low: 1, Medium: 2, High: 3, Urgent: 4 };

        function save() {
          localStorage.setItem('dts-tasks', JSON.stringify(tasks));
          render();
        }

        document.getElementById('tm-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('tm-title').value;
          const priority = document.getElementById('tm-priority').value;
          const due = document.getElementById('tm-due').value;
          
          tasks.push({
            id: Date.now().toString(),
            title, priority, due,
            completed: false,
            added: new Date().toISOString()
          });
          
          document.getElementById('tm-title').value = '';
          save();
        });

        function render() {
          const filter = document.getElementById('tm-filter').value;
          const sort = document.getElementById('tm-sort').value;
          
          let filtered = tasks.filter(t => {
            if (filter === 'active') return !t.completed;
            if (filter === 'completed') return t.completed;
            return true;
          });
          
          filtered.sort((a, b) => {
            if (sort === 'priority') return priorityVal[b.priority] - priorityVal[a.priority];
            if (sort === 'due') {
              if (!a.due) return 1;
              if (!b.due) return -1;
              return new Date(a.due) - new Date(b.due);
            }
            return new Date(b.added) - new Date(a.added); // Date added
          });

          document.getElementById('tm-list').innerHTML = filtered.map(t => \`
            <div style="\${commonStyles.card} display: flex; align-items: center; gap: 1rem; opacity: \${t.completed ? '0.6' : '1'};">
              <input type="checkbox" \${t.completed ? 'checked' : ''} onchange="toggleTask('\${t.id}')" style="width: 20px; height: 20px; cursor: pointer;" class="no-print">
              <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 1.1rem; text-decoration: \${t.completed ? 'line-through' : 'none'};">\${t.title}</div>
                <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1rem; margin-top: 0.25rem;">
                  <span style="color: \${priorityColors[t.priority]}; font-weight: bold;">\${t.priority}</span>
                  \${t.due ? \`<span>Due: \${t.due}</span>\` : ''}
                </div>
              </div>
              <button onclick="deleteTask('\${t.id}')" class="no-print" style="\${commonStyles.btn} background: #ef4444; color: white; padding: 0.3rem 0.6rem;">Del</button>
            </div>
          \`).join('');
          
          if(filtered.length === 0) {
            document.getElementById('tm-list').innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">No tasks found.</div>';
          }
        }

        window.toggleTask = (id) => {
          const t = tasks.find(x => x.id === id);
          if (t) t.completed = !t.completed;
          save();
        };

        window.deleteTask = (id) => {
          tasks = tasks.filter(x => x.id !== id);
          save();
        };

        document.getElementById('tm-filter').addEventListener('change', render);
        document.getElementById('tm-sort').addEventListener('change', render);

        document.getElementById('tm-export-doc').addEventListener('click', () => {
          const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Tasks</title></head><body>";
          const footer = "</body></html>";
          
          let html = "<h1>Task List</h1><ul>";
          tasks.forEach(t => {
            const status = t.completed ? "[X]" : "[ ]";
            const dueStr = t.due ? \` (Due: \${t.due})\` : "";
            html += \`<li>\${status} \${t.title} - \${t.priority}\${dueStr}</li>\`;
          });
          html += "</ul>";
          
          const sourceHTML = header + html + footer;
          const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
          const fileDownload = document.createElement("a");
          document.body.appendChild(fileDownload);
          fileDownload.href = source;
          fileDownload.download = 'tasks.doc';
          fileDownload.click();
          document.body.removeChild(fileDownload);
        });

        render();
      </script>
    </div>
  `;

  // 7. Weekly Timetable
  const timetableBody = `
    ${printCss}
    <div class="article-container" style="max-width: 1200px;">
      <div class="no-print">
        <h1>Weekly Timetable</h1>
        <p style="color: var(--text-muted); margin-bottom: 2rem;">Plan your week block by block. Click a cell to add an activity.</p>
        
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; align-items: center;">
          <button onclick="window.print()" style="${commonStyles.btn}">Print Schedule</button>
          <button id="wt-clear" style="${commonStyles.btn} background: #ef4444;">Clear All</button>
        </div>
      </div>

      <div style="display: flex; gap: 2rem; align-items: flex-start; @media(max-width:900px){flex-direction:column;}">
        <div style="flex: 1; overflow-x: auto; min-width: 0;">
          <table style="${commonStyles.table} table-layout: fixed; min-width: 700px;" id="wt-table">
            <thead>
              <tr style="background: var(--surface);">
                <th style="${commonStyles.thtd} width: 60px;">Time</th>
                <th style="${commonStyles.thtd} text-align: center;">Mon</th>
                <th style="${commonStyles.thtd} text-align: center;">Tue</th>
                <th style="${commonStyles.thtd} text-align: center;">Wed</th>
                <th style="${commonStyles.thtd} text-align: center;">Thu</th>
                <th style="${commonStyles.thtd} text-align: center;">Fri</th>
                <th style="${commonStyles.thtd} text-align: center;">Sat</th>
                <th style="${commonStyles.thtd} text-align: center;">Sun</th>
              </tr>
            </thead>
            <tbody id="wt-body">
              <!-- Grid injected -->
            </tbody>
          </table>
        </div>
        
        <div style="${commonStyles.card} width: 250px; flex-shrink: 0;" class="no-print">
          <h2 style="${commonStyles.h2} margin-top: 0;">Summary</h2>
          <div id="wt-summary" style="font-size: 0.9rem;"></div>
        </div>
      </div>

      <!-- Modal for entry -->
      <div id="wt-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;" class="no-print">
        <div style="${commonStyles.card} width: 300px; position: relative;">
          <h3 id="wt-modal-title" style="margin-top: 0;">Add Activity</h3>
          <p id="wt-modal-time" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;"></p>
          
          <input type="text" id="wt-input-name" class="search-input" style="${commonStyles.input} margin-bottom: 1rem;" placeholder="Activity Name">
          
          <label style="${commonStyles.label}">Color</label>
          <input type="color" id="wt-input-color" value="#3b82f6" style="width: 100%; height: 40px; margin-bottom: 1rem; border: 1px solid var(--border); padding: 0;">
          
          <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
            <button id="wt-modal-del" style="${commonStyles.btn} background: #ef4444; display: none;">Delete</button>
            <div style="flex: 1;"></div>
            <button id="wt-modal-cancel" style="${commonStyles.btn} background: var(--surface); color: var(--fg); border: 1px solid var(--border);">Cancel</button>
            <button id="wt-modal-save" style="${commonStyles.btn}">Save</button>
          </div>
        </div>
      </div>

      <script>
        const days = ['mon','tue','wed','thu','fri','sat','sun'];
        const startHour = 6;
        const endHour = 22;
        
        let schedule = JSON.parse(localStorage.getItem('dts-timetable') || '{}');
        
        const tbody = document.getElementById('wt-body');
        let html = '';
        for(let h = startHour; h <= endHour; h++) {
          html += '<tr>';
          html += \`<td style="${commonStyles.thtd} font-size: 0.8rem; color: var(--text-muted);">\${h}:00</td>\`;
          for(let d of days) {
            const cellId = \`\${d}-\${h}\`;
            html += \`<td id="\${cellId}" style="${commonStyles.thtd} text-align: center; cursor: pointer; transition: filter 0.2s; height: 40px; padding: 0;" onclick="openModal('\${d}', \${h})"></td>\`;
          }
          html += '</tr>';
        }
        tbody.innerHTML = html;

        let activeCell = null;

        function render() {
          // clear grid
          for(let h = startHour; h <= endHour; h++) {
            for(let d of days) {
              const td = document.getElementById(\`\${d}-\${h}\`);
              td.innerHTML = '';
              td.style.background = 'transparent';
              td.title = '';
            }
          }
          
          const totals = {};
          
          // fill grid
          Object.keys(schedule).forEach(key => {
            const entry = schedule[key];
            const td = document.getElementById(key);
            if(td) {
              td.innerHTML = \`<div style="font-size: 0.75rem; font-weight: bold; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">\${entry.name}</div>\`;
              td.style.background = entry.color;
              td.title = entry.name;
              
              totals[entry.name] = (totals[entry.name] || 0) + 1;
            }
          });

          // Summary
          const sumDiv = document.getElementById('wt-summary');
          if(Object.keys(totals).length === 0) {
            sumDiv.innerHTML = '<p style="color: var(--text-muted);">No activities planned.</p>';
          } else {
            let sHtml = '<ul style="list-style: none; padding: 0; margin: 0;">';
            Object.entries(totals).sort((a,b) => b[1] - a[1]).forEach(([name, hours]) => {
              sHtml += \`<li style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);"><span>\${name}</span><strong>\${hours} hr\${hours>1?'s':''}</strong></li>\`;
            });
            sHtml += '</ul>';
            sumDiv.innerHTML = sHtml;
          }
        }

        window.openModal = (d, h) => {
          activeCell = \`\${d}-\${h}\`;
          const existing = schedule[activeCell];
          
          document.getElementById('wt-modal-time').textContent = \`\${d.toUpperCase()} at \${h}:00\`;
          document.getElementById('wt-input-name').value = existing ? existing.name : '';
          document.getElementById('wt-input-color').value = existing ? existing.color : '#3b82f6';
          
          document.getElementById('wt-modal-del').style.display = existing ? 'block' : 'none';
          document.getElementById('wt-modal').style.display = 'flex';
          document.getElementById('wt-input-name').focus();
        };

        const closeModal = () => document.getElementById('wt-modal').style.display = 'none';

        document.getElementById('wt-modal-cancel').addEventListener('click', closeModal);
        
        document.getElementById('wt-modal-save').addEventListener('click', () => {
          const name = document.getElementById('wt-input-name').value.trim();
          if(!name) return;
          
          schedule[activeCell] = {
            name,
            color: document.getElementById('wt-input-color').value
          };
          
          localStorage.setItem('dts-timetable', JSON.stringify(schedule));
          render();
          closeModal();
        });

        document.getElementById('wt-modal-del').addEventListener('click', () => {
          delete schedule[activeCell];
          localStorage.setItem('dts-timetable', JSON.stringify(schedule));
          render();
          closeModal();
        });

        document.getElementById('wt-clear').addEventListener('click', () => {
          if(confirm('Clear entire schedule?')) {
            schedule = {};
            localStorage.removeItem('dts-timetable');
            render();
          }
        });

        render();
      </script>
    </div>
  `;

  const pages = [
    { slug: 'deduplicator', title: 'Text De-duplicator', metaDesc: 'Remove duplicate lines from text automatically online.', body: deduplicatorBody },
    { slug: 'time-tracker', title: 'Time Tracker', metaDesc: 'Free browser-based time tracking for projects and freelance work.', body: timeTrackerBody },
    { slug: 'invoice-generator', title: 'Invoice Generator', metaDesc: 'Create and print professional PDF invoices directly in your browser.', body: invoiceGeneratorBody },
    { slug: 'invoice-from-time', title: 'Invoice from Time', metaDesc: 'Generate invoices from your tracked time entries.', body: invoiceFromTimeBody },
    { slug: 'tax-calculator', title: 'Tax Calculator', metaDesc: 'Estimate your income tax and net take-home pay.', body: taxCalculatorBody },
    { slug: 'task-manager', title: 'Task Manager', metaDesc: 'Simple, private task management right in your browser.', body: taskManagerBody },
    { slug: 'timetable', title: 'Weekly Timetable', metaDesc: 'Plan your week with a colorful block-based schedule.', body: timetableBody }
  ];

  for (const page of pages) {
    const html = renderPage({
      title: `${page.title} | Digital Tools Shed`,
      metaDesc: page.metaDesc,
      canonical: `${DOMAIN}/productivity/${page.slug}`,
      bodyContent: page.body,
      currentPath: `/productivity/${page.slug}`
    });
    writeFileSync(join(prodDist, `${page.slug}.html`), html);
  }

  console.log("  \u2713 Built Productivity Suite (" + pages.length + " tools in /productivity/)");
}

// ─── TRUST & LEGAL PAGES ──────────────────────────────────────────────────

export { buildProductivitySuite };
