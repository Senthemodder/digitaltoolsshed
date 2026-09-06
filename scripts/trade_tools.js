import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildTradeTools() {
  const calcDir = join(DIST, 'calc');
  ensureDir(calcDir);

  function renderTradePage(opts) {
    let visibleFaqHtml = '';
    if (opts.faq && opts.faq.length > 0) {
      visibleFaqHtml = `
        <div class="wb-card" style="margin-top:2.5rem; background:var(--surface); border:1px solid var(--border); padding:1.5rem; border-radius:8px;">
          <h2 style="font-family:var(--serif); font-size:1.4rem; margin-bottom:1.25rem;">Frequently Asked Questions</h2>
          ${opts.faq.map(f => `
            <div class="faq-item" style="border-bottom:1px solid var(--border); padding:0.85rem 0;" onclick="this.classList.toggle('open')">
              <div style="font-weight:600; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1rem;">${f.q}</span>
                <span class="faq-icon" style="font-size:1.2rem; transition:transform 0.2s; color:var(--text-muted);">+</span>
              </div>
              <div class="faq-answer" style="display:none; margin-top:0.6rem; color:var(--text-muted); font-size:0.92rem; line-height:1.65;">
                ${f.a}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    const fullBody = opts.bodyContent + visibleFaqHtml + `
      <style>
        .faq-item.open .faq-answer { display: block !important; }
        .faq-item.open .faq-icon { transform: rotate(45deg); color: #10b981; }
        .trap-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1.15rem;
          margin-bottom: 1rem;
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .trap-card strong, .trap-card h3 {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 1rem;
        }
      </style>
    `;
    return renderPage({
      ...opts,
      bodyContent: fullBody
    });
  }


  // ─────────────────────────────────────────────────────────────────────────────
  // 1. STAIR STRINGER & IRC CODE CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const stairBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Stair Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Stair Stringer Calculator & IRC Code Checker</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate stair stringer layout, exact fractional riser heights, horizontal run, minimum 2x12 lumber lengths, and verify compliance with International Residential Code (IRC) 2024 standards. Includes Blondel's ergonomic comfort index and cut-list derivations.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"/><polyline points=\"16 7 22 7 22 13\"/></svg>\n        Stair Dimensions\n      </h2>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"totalRise\">Total Rise (Overall Height in Inches)</label>\n        <input type=\"number\" id=\"totalRise\" value=\"108\" min=\"10\" max=\"300\" step=\"0.125\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;font-weight:600;\">\n        <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">Vertical distance from finished lower floor to finished upper floor (e.g. 108\" = 9 ft)</span>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"targetRiser\">Target Riser (Inches)</label>\n          <input type=\"number\" id=\"targetRiser\" value=\"7.5\" min=\"5\" max=\"8.5\" step=\"0.125\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n          <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">IRC Code Max: 7.75\"</span>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"treadDepth\">Tread Run (Inches)</label>\n          <input type=\"number\" id=\"treadDepth\" value=\"10.5\" min=\"9\" max=\"15\" step=\"0.25\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n          <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">IRC Code Min: 10.0\"</span>\n        </div>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"treadThickness\">Tread Thickness</label>\n          <input type=\"number\" id=\"treadThickness\" value=\"1.0\" min=\"0.5\" max=\"2.5\" step=\"0.125\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n          <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">Cut off bottom stringer!</span>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"stringerWidth\">Stair Width (Feet)</label>\n          <input type=\"number\" id=\"stairWidth\" value=\"3.0\" min=\"2.5\" max=\"8.0\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n          <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">Code Min: 3.0 ft (36\")</span>\n        </div>\n      </div>\n    </div>\n\n    <!-- OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg>\n            Stringer Cut Specifications\n          </h2>\n          <button id=\"copyStairBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Cut List</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Exact Riser Height</span>\n            <span id=\"unitRiseExact\" style=\"font-family:var(--mono);font-size:1.8rem;font-weight:800;color:var(--fg);display:block;\">7 3/16\"</span>\n            <span id=\"riserCount\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">14 Steps / Risers</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Horizontal Run</span>\n            <span id=\"totalRunFt\" style=\"font-family:var(--mono);font-size:1.8rem;font-weight:800;color:#3b82f6;display:block;\">11' 4\"</span>\n            <span id=\"treadCount\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">13 Treads @ 10.5\"</span>\n          </div>\n        </div>\n\n        <!-- LUMBER & ANGLE SPEC -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span style=\"color:var(--text-muted);\">Stringer Diagonal Length:</span>\n            <strong id=\"stringerLength\" style=\"font-family:var(--mono);\">14' 2\" (170.5\")</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span style=\"color:var(--text-muted);\">Lumber Board to Buy:</span>\n            <strong id=\"lumberBoardSize\" style=\"font-family:var(--mono);color:#10b981;\">2x12 x 16 Ft</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span style=\"color:var(--text-muted);\">Stair Incline Pitch Angle:</span>\n            <strong id=\"stairInclineAngle\" style=\"font-family:var(--mono);\">34.8° (Ideal 30° - 37°)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span style=\"color:var(--text-muted);\">Blondel Ergonomic Comfort (2R + T):</span>\n            <strong id=\"blondelIndex\" style=\"font-family:var(--mono);\">24.9\" (Ideal 24\" - 25.5\")</strong>\n          </div>\n        </div>\n\n        <!-- IRC CODE STATUS BOX -->\n        <div id=\"ircComplianceBadge\" style=\"border-radius:8px;padding:0.85rem 1rem;font-size:0.85rem;line-height:1.4;\">\n          <!-- Populated by JS -->\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG STAIR ELEVATION SCHEMATIC -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Stair Stringer Profile & Framing Elevation</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Vector cut profile illustrating bottom riser height adjustment, stringer throat meat ($5''$ minimum depth), and layout steps.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"stairSchematicSvg\" viewBox=\"0 0 800 300\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & CARPENTRY DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Carpentry Trigonometry & The Bottom Riser Drop Formula</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Stair stringer layout requires solving right triangles and applying discrete integer quantization to total vertical rise. Every riser in a flight must be identical to within $\\frac{3}{8}''$ (IRC Section R311.7.5.1).\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Integer Step Quantization:</strong><br>\n      N_{\\text{risers}} = \\text{round}\\left( \\frac{\\text{Total Rise}}{\\text{Target Rise (7.5'')}} \\right)<br><br>\n      <strong>2. Exact Unit Rise:</strong><br>\n      R = \\frac{\\text{Total Rise}}{N_{\\text{risers}}} \\quad (\\le 7\\frac{3}{4}'' \\text{ IRC maximum})<br><br>\n      <strong>3. Stringer Diagonal Length (Pythagorean Theorem):</strong><br>\n      L_{\\text{stringer}} = \\sqrt{\\text{Total Rise}^2 + \\text{Total Run}^2}<br><br>\n      <strong>4. The Mandatory Bottom Riser Drop:</strong><br>\n      R_{\\text{bottom cut}} = R - \\text{Tread Thickness} + \\text{Lower Finish Floor Thickness}<br>\n      \\textit{(Failing to cut tread thickness off the bottom makes the 1st step too high and the top step too short!)}<br><br>\n      <strong>5. Blondel's Comfort Formula (1675):</strong><br>\n      2R + T \\in [24'', 25.5''] \\quad (600 - 640\\text{ mm})\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL STAIRBUILDING TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Stairbuilding & Inspection Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. The Bottom Riser Drop Disaster</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          The #1 mistake amateur carpenters make is cutting all stringer notches identical. When you install a 1\" tread on top, the first step becomes 1\" taller ($R + 1''$) and the top step onto the second floor becomes 1\" shorter ($R - 1''$). You must saw the thickness of one tread off the bottom of the stringer.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Over-Notching the Stringer Throat</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          When cutting notches into a 2x12 stringer with a circular saw, never let the saw kerf extend past the inside corner. Over-cutting weakens the remaining timber throat (the \"effective depth\"). Code generally requires at least 3.5\" to 5\" of uncut solid lumber along the stringer throat to prevent snapping.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. The 3/8-Inch Riser Variation Code Failure</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          IRC Section R311.7.5.1 strictly mandates that the difference between the greatest riser height and smallest riser height in any flight cannot exceed 3/8\" (9.5 mm). Human muscle memory expects uniform cadence; variations greater than 3/8\" cause people to trip and fall.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Violating the 6'8\" (80\") Headroom Mandate</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Building codes require minimum 80 inches (2,032 mm) of continuous vertical clearance measured from the sloped plane of stair nosings to the ceiling above. Failing to leave a large enough rough ceiling opening forces costly framing teardowns.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Insufficient Stringer Quantity Across Width</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Using only 2 stringers on a 36-inch wide staircase causes bouncy, sagging treads. For standard 1-inch thick dimensional lumber or composite decking treads, stringers must be spaced no more than 16 inches on center (requiring at least 3 stringers for a 3-foot wide stair).\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function toFraction(val) {\n        var whole = Math.floor(val);\n        var frac = val - whole;\n        var sixteenths = Math.round(frac * 16);\n        if (sixteenths === 16) { whole++; sixteenths = 0; }\n        if (sixteenths === 0) return whole + '\\\"';\n        \n        var num = sixteenths;\n        var den = 16;\n        while (num % 2 === 0 && den % 2 === 0) { num /= 2; den /= 2; }\n        return (whole > 0 ? whole + ' ' : '') + num + '/' + den + '\\\"';\n      }\n\n      function toFeetInches(totalInches) {\n        var feet = Math.floor(totalInches / 12);\n        var inches = Math.round((totalInches % 12) * 10) / 10;\n        return feet + \"' \" + inches + '\"';\n      }\n\n      function calcStairs() {\n        var totalRise = parseFloat(document.getElementById('totalRise').value) || 108;\n        var targetRise = parseFloat(document.getElementById('targetRiser').value) || 7.5;\n        var treadDepth = parseFloat(document.getElementById('treadDepth').value) || 10.5;\n        var treadThick = parseFloat(document.getElementById('treadThickness').value) || 1.0;\n        var stairWidth = parseFloat(document.getElementById('stairWidth').value) || 3.0;\n\n        var numRisers = Math.round(totalRise / targetRise);\n        if (numRisers < 1) numRisers = 1;\n\n        var unitRise = totalRise / numRisers;\n        var numTreads = numRisers - 1;\n        var totalRun = numTreads * treadDepth;\n\n        var stringerDiag = Math.sqrt(totalRise * totalRise + totalRun * totalRun);\n        var stringerFt = stringerDiag / 12;\n\n        // Standard lumber boards: 10, 12, 14, 16, 18, 20\n        var boards = [10, 12, 14, 16, 18, 20];\n        var boardSize = '2x12 x Custom Length';\n        for (var b = 0; b < boards.length; b++) {\n          if (boards[b] >= stringerFt + 0.5) { // 6 inches margin\n            boardSize = '2x12 x ' + boards[b] + ' Ft';\n            break;\n          }\n        }\n\n        // Angle\n        var angleRad = Math.atan2(totalRise, totalRun);\n        var angleDeg = angleRad * (180 / Math.PI);\n\n        // Blondel index\n        var blondel = (2 * unitRise) + treadDepth;\n\n        // Bottom riser cut\n        var bottomRiserCut = unitRise - treadThick;\n\n        // DOM update\n        document.getElementById('unitRiseExact').textContent = toFraction(unitRise) + ' (' + unitRise.toFixed(2) + '\\\")';\n        document.getElementById('riserCount').textContent = numRisers + ' Steps / Risers';\n        document.getElementById('totalRunFt').textContent = toFeetInches(totalRun);\n        document.getElementById('treadCount').textContent = numTreads + ' Treads @ ' + treadDepth + '\\\"';\n\n        document.getElementById('stringerLength').textContent = toFeetInches(stringerDiag) + ' (' + stringerDiag.toFixed(1) + '\\\")';\n        document.getElementById('lumberBoardSize').textContent = boardSize;\n        document.getElementById('stairInclineAngle').textContent = angleDeg.toFixed(1) + '°';\n        document.getElementById('blondelIndex').textContent = blondel.toFixed(1) + '\\\"';\n\n        // IRC Compliance Check\n        var badge = document.getElementById('ircComplianceBadge');\n        var passesRiser = unitRise <= 7.75;\n        var passesTread = treadDepth >= 10.0;\n        var passesAngle = angleDeg >= 30 && angleDeg <= 38;\n\n        if (passesRiser && passesTread && passesAngle) {\n          badge.style.background = 'rgba(16, 185, 129, 0.1)';\n          badge.style.border = '1px solid #10b981';\n          badge.style.color = '#10b981';\n          badge.innerHTML =\n            '<div style=\"font-weight:700;display:flex;align-items:center;gap:0.4rem;\">' +\n              '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"/></svg>' +\n              'IRC 2024 Building Code Compliant' +\n            '</div>' +\n            '<div style=\"font-size:0.8rem;margin-top:0.2rem;color:var(--fg);\">' +\n              'Riser (' + unitRise.toFixed(2) + '\\\") ≤ 7.75\\\" max, Tread (' + treadDepth + '\\\") ≥ 10.0\\\" min, Angle (' + angleDeg.toFixed(1) + '°) is ergonomically safe.' +\n            '</div>';\n        } else {\n          badge.style.background = 'rgba(239, 68, 68, 0.1)';\n          badge.style.border = '1px solid #ef4444';\n          badge.style.color = '#ef4444';\n          var issues = [];\n          if (!passesRiser) issues.push('Riser height exceeds 7.75\" code limit');\n          if (!passesTread) issues.push('Tread depth is less than 10.0\" code minimum');\n          if (!passesAngle) issues.push('Angle (' + angleDeg.toFixed(1) + '°) is outside recommended 30°-38° comfort range');\n          badge.innerHTML =\n            '<div style=\"font-weight:700;display:flex;align-items:center;gap:0.4rem;\">' +\n              '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"/></svg>' +\n              'IRC Code Warning' +\n            '</div>' +\n            '<div style=\"font-size:0.8rem;margin-top:0.2rem;color:var(--fg);\">' +\n              issues.join('; ') + '. Adjust target riser or tread depth.' +\n            '</div>';\n        }\n\n        renderSchematic(numRisers, unitRise, treadDepth);\n      }\n\n      function renderSchematic(steps, r, t) {\n        var svg = document.getElementById('stairSchematicSvg');\n        if (!svg) return;\n\n        var displaySteps = Math.min(steps, 6); // Draw up to 6 steps for clean schematic\n        var svgW = 800;\n        var svgH = 300;\n\n        var startX = 120;\n        var startY = 240;\n        var scale = 22; // px per inch\n\n        var stepW = Math.min(60, (svgW - 250) / displaySteps);\n        var stepH = stepW * (r / t);\n\n        var pathD = 'M ' + startX + ' ' + startY;\n        var curX = startX;\n        var curY = startY;\n\n        for (var s = 0; s < displaySteps; s++) {\n          curY -= stepH;\n          pathD += ' L ' + curX + ' ' + curY;\n          curX += stepW;\n          pathD += ' L ' + curX + ' ' + curY;\n        }\n\n        // Down to baseline to form stringer body\n        var stringerPath = pathD + ' L ' + curX + ' ' + startY + ' Z';\n\n        var svgHtml =\n          '<path d=\"' + stringerPath + '\" fill=\"var(--surface)\" stroke=\"#3b82f6\" stroke-width=\"3\"/>' +\n          '<line x1=\"60\" y1=\"' + startY + '\" x2=\"' + (curX + 60) + '\" y2=\"' + startY + '\" stroke=\"var(--border)\" stroke-width=\"2\"/>' +\n          '<text x=\"' + (startX - 50) + '\" y=\"' + (startY - 10) + '\" fill=\"var(--text-muted)\" font-size=\"11\">Lower Floor</text>' +\n          '<text x=\"' + (curX + 15) + '\" y=\"' + (curY + 5) + '\" fill=\"var(--text-muted)\" font-size=\"11\">Upper Floor</text>';\n\n        // Callouts on first step\n        svgHtml +=\n          '<line x1=\"' + (startX - 15) + '\" y1=\"' + startY + '\" x2=\"' + (startX - 15) + '\" y2=\"' + (startY - stepH) + '\" stroke=\"#ef4444\" stroke-width=\"2\"/>' +\n          '<text x=\"' + (startX - 22) + '\" y=\"' + (startY - stepH/2 + 4) + '\" fill=\"#ef4444\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"end\">Rise: ' + toFraction(r) + '</text>' +\n          '<line x1=\"' + startX + '\" y1=\"' + (startY - stepH - 12) + '\" x2=\"' + (startX + stepW) + '\" y2=\"' + (startY - stepH - 12) + '\" stroke=\"#10b981\" stroke-width=\"2\"/>' +\n          '<text x=\"' + (startX + stepW/2) + '\" y=\"' + (startY - stepH - 18) + '\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">Run: ' + t + '\\\"</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyCutList() {\n        var risers = document.getElementById('riserCount').textContent;\n        var unitR = document.getElementById('unitRiseExact').textContent;\n        var treads = document.getElementById('treadCount').textContent;\n        var totalRun = document.getElementById('totalRunFt').textContent;\n        var sLength = document.getElementById('stringerLength').textContent;\n        var board = document.getElementById('lumberBoardSize').textContent;\n        var angle = document.getElementById('stairInclineAngle').textContent;\n        var blondel = document.getElementById('blondelIndex').textContent;\n        var tThick = document.getElementById('treadThickness').value;\n\n        var text = '📐 Stair Stringer Cut List & Specifications\\n' +\n          '• Total Rise: ' + document.getElementById('totalRise').value + ' Inches\\n' +\n          '• Number of Risers: ' + risers + '\\n' +\n          '• Unit Riser Height: ' + unitR + '\\n' +\n          '• Number of Treads: ' + treads + '\\n' +\n          '• Total Horizontal Run: ' + totalRun + '\\n' +\n          '• Stringer Diagonal Length: ' + sLength + '\\n' +\n          '• Lumber Board to Buy: ' + board + '\\n' +\n          '• Stair Pitch Angle: ' + angle + '\\n' +\n          '• Blondel Comfort Index (2R + T): ' + blondel + '\\n' +\n          '• MANDATORY CUT: Saw ' + tThick + '\" off the bottom of stringers\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/stair-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyStairBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Cut List!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['totalRise', 'targetRiser', 'treadDepth', 'treadThickness', 'stairWidth'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcStairs);\n          el.addEventListener('change', calcStairs);\n        }\n      });\n\n      document.getElementById('copyStairBtn').addEventListener('click', copyCutList);\n\n      calcStairs();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'stair-calculator.html'), renderTradePage({
    title: "Stair Stringer Calculator & IRC Code Checker (Rise, Run & Cut List) | Digital Tools Shed",
    metaDesc: "Calculate stair stringer cuts, exact riser heights, tread runs, stringer board lengths, and verify IRC 2024 building code compliance with an interactive diagram.",
    canonical: `${DOMAIN}/calc/stair-calculator`,
    bodyContent: stairBody,
    currentPath: '/calc/stair-calculator',
    faq: [
  {
    "q": "What is the maximum stair riser height according to IRC building code?",
    "a": "Under Section R311.7.5.1 of the International Residential Code (IRC 2024), the maximum allowable riser height for residential stairs is 7 3/4 inches (197 mm). Any riser taller than 7.75 inches fails building inspection and creates severe trip hazards."
  },
  {
    "q": "What is the minimum stair tread depth required by building code?",
    "a": "The IRC mandates a minimum tread depth of 10 inches (254 mm) when treads have a nosing, or 11 inches (279 mm) if built without nosing. Tread depth is measured horizontally between the vertical planes of adjacent risers."
  },
  {
    "q": "Why must you cut the thickness of the tread off the bottom of the stringer?",
    "a": "If you do not trim the thickness of one tread (typically 1.0\" or 1.5\") off the bottom of the stringer where it rests on the lower floor, the very first step will be too high by that exact thickness once the tread is nailed down. Conversely, the top step onto the upper floor will be too short by that thickness."
  },
  {
    "q": "What is Blondel's Rule for comfortable stair proportions?",
    "a": "Architect François Blondel's historic rule of thumb states that twice the riser height plus the tread depth (2R + T) should equal between 24 and 25.5 inches (600 to 640 mm). Stairs matching this ratio feel natural and effortless to climb because they match standard human walking strides."
  },
  {
    "q": "What size lumber should be used to cut stair stringers?",
    "a": "Stair stringers should always be cut from nominal 2x12 lumber. Never use 2x10 boards for notched stringers, as cutting 7\" to 10\" notches leaves less than 3.5 inches of uncut \"throat\" meat, drastically increasing the risk of structural stringer snapping."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. CONCRETE SLAB & BAG CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const concreteBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Concrete Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Concrete Slab, Footing & Bag Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate cubic yards, cubic feet, and exact pre-mix bag counts (80 lb, 60 lb, 50 lb) for concrete slabs, patios, footings, and cylindrical sonotubes. Features automatic waste factor budgeting, gravel sub-base estimation, and ready-mix truck delivery cost comparisons.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18M9 21V9\"/></svg>\n        Structure Dimensions\n      </h2>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"structureType\">Project Structure Type</label>\n        <select id=\"structureType\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"slab\" selected>Rectangular Slab / Patio / Driveway</option>\n          <option value=\"column\">Round Column / Pier / Sonotube Footing</option>\n          <option value=\"curb\">Continuous Wall / Curb / Trench Footing</option>\n        </select>\n      </div>\n\n      <!-- RECTANGULAR SLAB INPUTS -->\n      <div id=\"slabInputs\">\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"slabLength\">Length (Feet)</label>\n            <input type=\"number\" id=\"slabLength\" value=\"20\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n          </div>\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"slabWidth\">Width (Feet)</label>\n            <input type=\"number\" id=\"slabWidth\" value=\"12\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n          </div>\n        </div>\n\n        <div style=\"margin-bottom:1.25rem;\">\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"slabThickness\">Slab Thickness (Inches)</label>\n          <select id=\"slabThickness\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"3.5\">3.5\" (Standard 2x4 Form Board — Sidewalks/Walkways)</option>\n            <option value=\"4\" selected>4.0\" (Standard Residential Patio / Shed Slab)</option>\n            <option value=\"5\">5.0\" (Light Vehicle Driveway / Heavy Shed)</option>\n            <option value=\"6\">6.0\" (Standard Vehicle Driveway / Garage Floor)</option>\n            <option value=\"8\">8.0\" (Heavy Truck / RV Parking Pad / Foundation)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- CYLINDER SONOTUBE INPUTS (HIDDEN INITIALLY) -->\n      <div id=\"columnInputs\" style=\"display:none;\">\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"colDiameter\">Diameter (Inches)</label>\n            <select id=\"colDiameter\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n              <option value=\"8\">8\" (Deck Post Pier)</option>\n              <option value=\"10\">10\" (Standard Deck Footing)</option>\n              <option value=\"12\" selected>12\" (Heavy Deck / Structural Pier)</option>\n              <option value=\"16\">16\" (Large Column / Commercial)</option>\n            </select>\n          </div>\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"colDepth\">Depth (Inches)</label>\n            <input type=\"number\" id=\"colDepth\" value=\"36\" min=\"6\" step=\"6\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n          </div>\n        </div>\n\n        <div style=\"margin-bottom:1.25rem;\">\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"colCount\">Number of Columns / Holes</label>\n          <input type=\"number\" id=\"colCount\" value=\"6\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n      </div>\n\n      <!-- WASTE & CONTROLS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wasteFactor\">Waste Allowance (%)</label>\n          <select id=\"wasteFactor\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"5\">5% (Precise Wooden Forms)</option>\n            <option value=\"10\" selected>10% (Recommended Standard)</option>\n            <option value=\"15\">15% (Rough Grade / Deep Dig)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"bagPrice80\">Price / 80lb Bag ($)</label>\n          <input type=\"number\" id=\"bagPrice80\" value=\"6.50\" min=\"0\" step=\"0.25\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/></svg>\n            Material Estimate\n          </h2>\n          <button id=\"copyConcreteBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Order Sheet</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Cubic Yards (yd³)</span>\n            <span id=\"concreteCuYds\" style=\"font-family:var(--mono);font-size:1.9rem;font-weight:800;color:var(--fg);display:block;\">0.00</span>\n            <span id=\"concreteCuFt\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">0.0 cu ft | 0.0 m³</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Standard 80 lb Bags</span>\n            <span id=\"bags80Count\" style=\"font-family:var(--mono);font-size:1.9rem;font-weight:800;color:#3b82f6;display:block;\">0</span>\n            <span id=\"estCostBags\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">Est. Cost: $0</span>\n          </div>\n        </div>\n\n        <!-- BAG COMPARISON ROW -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Alternative Pre-Mix Bag Sizes</div>\n          <div style=\"display:grid;grid-template-columns:repeat(3, 1fr);gap:0.5rem;text-align:center;\">\n            <div style=\"border-right:1px solid var(--border);padding:0 0.25rem;\">\n              <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;\">60 lb Bags</span>\n              <strong id=\"bags60Count\" style=\"font-family:var(--mono);font-size:1.1rem;color:var(--fg);\">0</strong>\n              <span style=\"font-size:0.68rem;color:var(--text-muted);display:block;\">(0.45 cu ft)</span>\n            </div>\n            <div style=\"border-right:1px solid var(--border);padding:0 0.25rem;\">\n              <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;\">50 lb Bags</span>\n              <strong id=\"bags50Count\" style=\"font-family:var(--mono);font-size:1.1rem;color:var(--fg);\">0</strong>\n              <span style=\"font-size:0.68rem;color:var(--text-muted);display:block;\">(0.375 cu ft)</span>\n            </div>\n            <div style=\"padding:0 0.25rem;\">\n              <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;\">40 lb Bags</span>\n              <strong id=\"bags40Count\" style=\"font-family:var(--mono);font-size:1.1rem;color:var(--fg);\">0</strong>\n              <span style=\"font-size:0.68rem;color:var(--text-muted);display:block;\">(0.30 cu ft)</span>\n            </div>\n          </div>\n        </div>\n\n        <!-- LOGISTICS ADVISORY -->\n        <div id=\"truckAdvisoryBox\" style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:0.85rem 1rem;font-size:0.85rem;line-height:1.5;\">\n          <!-- Populated by JS -->\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE PERSPECTIVE SVG DIAGRAM -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Slab & Subgrade Cross-Section Schematic</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Isometric elevation showing concrete pour thickness, reinforced welded wire / rebar depth, and recommended 4-inch compacted crushed stone base.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"concreteCrossSectionSvg\" viewBox=\"0 0 800 200\" style=\"width:100%;height:auto;min-width:550px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & ENGINEERING DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Concrete Engineering Formulas & Unit Derivations</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Concrete volume calculations rely on 3D geometric integrations converted from linear inches and feet into standard American volumetric units ($1 \\text{ cubic yard} = 27 \\text{ cubic feet} = 46,656 \\text{ cubic inches}$).\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Rectangular Slab Volume:</strong><br>\n      V_{\\text{slab}} = \\frac{L_{\\text{ft}} \\times W_{\\text{ft}} \\times (T_{\\text{in}} / 12)}{27} \\times (1 + \\frac{\\text{Waste}_{\\%}}{100}) \\quad [\\text{yd}^3]<br><br>\n      <strong>2. Cylindrical Pier / Sonotube Volume:</strong><br>\n      V_{\\text{cyl}} = \\left( \\frac{\\pi \\times (D_{\\text{in}} / 24)^2 \\times (H_{\\text{in}} / 12)}{27} \\right) \\times N_{\\text{columns}} \\times (1 + \\frac{\\text{Waste}_{\\%}}{100}) \\quad [\\text{yd}^3]<br><br>\n      <strong>3. Pre-Mix Bag Equivalency:</strong><br>\n      \\text{Bags}_{80\\text{lb}} = \\frac{V_{\\text{cu ft}}}{0.60 \\text{ ft}^3/\\text{bag}}, \\quad \\text{Bags}_{60\\text{lb}} = \\frac{V_{\\text{cu ft}}}{0.45 \\text{ ft}^3/\\text{bag}}<br><br>\n      <strong>4. Water-Cement Ratio & Compressive Strength:</strong><br>\n      \\text{w/c Ratio} = \\frac{\\text{Weight of Water}}{\\text{Weight of Cementitious Material}} \\approx 0.40 - 0.45 \\quad (\\text{Target: } 4,000 \\text{ PSI})\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL CONCRETE TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Concrete & Foundation Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Adding Excessive Water to the Mix</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Adding extra water to make concrete \"flow easily\" into forms destroys compressive strength. Every extra gallon of water per bag reduces ultimate compressive strength by up to 1,000 PSI, causes massive surface dusting, and guarantees severe shrinkage cracks.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Uncompacted Subgrade & Frost Heave Settling</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Pouring concrete directly onto uncompacted native dirt or clay causes uneven settling within 12 months. All outdoor slabs require a minimum 4-inch base of crushed gravel (such as 3/4\" crushed stone or road base), compacted mechanically with a plate compactor.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Missing or Delayed Control Joints</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Concrete naturally shrinks as moisture evaporates during curing. To prevent wild random cracks, control joints must be grooved to a depth of 1/4 the slab thickness within 12-18 hours of pouring. Spacing must never exceed 2.5x to 3x thickness in feet (e.g. 10 ft max for a 4\" slab).\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Premature Drying & Curing Neglect</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Concrete does not \"dry\" to gain strength; it chemically hydrates. If surface moisture evaporates in direct sun or high wind during the first 7 days, the hydration reaction halts permanently, costing up to 50% of structural strength. Keep slabs damp or apply a curing compound.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Cold Joint Delamination Between Batches</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Mixing 80+ bags by hand takes hours. If batch #1 begins initial set before batch #10 is poured adjacent to it, the two pours will not chemically fuse, creating a weak structural seam called a \"cold joint\" that will leak water and crack under freeze-thaw cycles.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcConcrete() {\n        var type = document.getElementById('structureType').value;\n        var waste = (parseFloat(document.getElementById('wasteFactor').value) || 0) / 100;\n        var bagPrice = parseFloat(document.getElementById('bagPrice80').value) || 0;\n\n        var cuFtNet = 0;\n\n        if (type === 'slab' || type === 'curb') {\n          var len = parseFloat(document.getElementById('slabLength').value) || 0;\n          var wid = parseFloat(document.getElementById('slabWidth').value) || 0;\n          var thickIn = parseFloat(document.getElementById('slabThickness').value) || 4;\n          cuFtNet = len * wid * (thickIn / 12);\n        } else {\n          var diamIn = parseFloat(document.getElementById('colDiameter').value) || 12;\n          var depthIn = parseFloat(document.getElementById('colDepth').value) || 36;\n          var count = parseInt(document.getElementById('colCount').value) || 1;\n          var radiusFt = (diamIn / 2) / 12;\n          var depthFt = depthIn / 12;\n          var singleVol = Math.PI * radiusFt * radiusFt * depthFt;\n          cuFtNet = singleVol * count;\n        }\n\n        var cuFtGross = cuFtNet * (1 + waste);\n        var cuYardsGross = cuFtGross / 27;\n        var cuMetersGross = cuFtGross * 0.0283168;\n\n        // Bag counts\n        var bags80 = Math.ceil(cuFtGross / 0.60);\n        var bags60 = Math.ceil(cuFtGross / 0.45);\n        var bags50 = Math.ceil(cuFtGross / 0.375);\n        var bags40 = Math.ceil(cuFtGross / 0.30);\n\n        var totalBagCost = bags80 * bagPrice;\n\n        // Update DOM\n        document.getElementById('concreteCuYds').textContent = cuYardsGross.toFixed(2);\n        document.getElementById('concreteCuFt').textContent = cuFtGross.toFixed(1) + ' cu ft | ' + cuMetersGross.toFixed(2) + ' m³';\n        document.getElementById('bags80Count').textContent = bags80.toLocaleString();\n        document.getElementById('estCostBags').textContent = 'Est. Bag Cost: $' + Math.round(totalBagCost).toLocaleString();\n\n        document.getElementById('bags60Count').textContent = bags60.toLocaleString();\n        document.getElementById('bags50Count').textContent = bags50.toLocaleString();\n        document.getElementById('bags40Count').textContent = bags40.toLocaleString();\n\n        // Advisory box\n        var advBox = document.getElementById('truckAdvisoryBox');\n        if (cuYardsGross >= 1.5) {\n          advBox.innerHTML =\n            '<div style=\"color:#3b82f6;font-weight:700;margin-bottom:0.25rem;display:flex;align-items:center;gap:0.4rem;\">' +\n              '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M1 3h15v13H1zM16 8h4l3 3v5h-7V8z\"/><circle cx=\"5.5\" cy=\"18.5\" r=\"2.5\"/><circle cx=\"18.5\" cy=\"18.5\" r=\"2.5\"/></svg>' +\n              'Ready-Mix Concrete Truck Recommended' +\n            '</div>' +\n            '<p style=\"margin:0;color:var(--fg);\">' +\n              'At <strong>' + cuYardsGross.toFixed(2) + ' cubic yards</strong> (' + bags80 + ' eighty-pound bags), manual hand-mixing will take hours and risks cold joints. Ordering a ready-mix delivery truck ($140 - $190/yd³) is typically faster, higher quality, and less physically exhausting.' +\n            '</p>';\n        } else {\n          advBox.innerHTML =\n            '<div style=\"color:#10b981;font-weight:700;margin-bottom:0.25rem;display:flex;align-items:center;gap:0.4rem;\">' +\n              '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"20 6 9 17 4 12\"/></svg>' +\n              'DIY Pre-Mix Bags Feasible' +\n            '</div>' +\n            '<p style=\"margin:0;color:var(--fg);\">' +\n              'At <strong>' + cuYardsGross.toFixed(2) + ' cubic yards</strong> (' + bags80 + ' bags), this project can be mixed on-site in a wheelbarrow or rented electric mixer. Fits in a standard pickup truck bed (payload ~' + (bags80 * 80).toLocaleString() + ' lbs).' +\n            '</p>';\n        }\n\n        renderCrossSection(type);\n      }\n\n      function renderCrossSection(type) {\n        var svg = document.getElementById('concreteCrossSectionSvg');\n        if (!svg) return;\n\n        var thick = document.getElementById('slabThickness').value;\n        var svgHtml = '';\n\n        // Subgrade\n        svgHtml += '<rect x=\"60\" y=\"130\" width=\"680\" height=\"50\" fill=\"#a8a29e\" opacity=\"0.4\" rx=\"2\"/>';\n        svgHtml += '<text x=\"70\" y=\"160\" fill=\"var(--fg)\" font-size=\"11\" font-weight=\"bold\">Compacted Crushed Stone Sub-Base (4\" Depth)</text>';\n\n        // Concrete Slab\n        svgHtml += '<rect x=\"60\" y=\"50\" width=\"680\" height=\"80\" fill=\"#64748b\" opacity=\"0.8\" rx=\"4\"/>';\n        svgHtml += '<text x=\"70\" y=\"85\" fill=\"#ffffff\" font-size=\"14\" font-weight=\"bold\">Poured Concrete Slab (' + thick + '\" Thickness)</text>';\n\n        // Rebar grid lines\n        svgHtml += '<line x1=\"80\" y1=\"95\" x2=\"720\" y2=\"95\" stroke=\"#ef4444\" stroke-width=\"3\" stroke-dasharray=\"8,6\"/>';\n        svgHtml += '<text x=\"70\" y=\"115\" fill=\"#fecaca\" font-size=\"10\">#4 Rebar / Welded Wire Mesh (Supported on 2\" Chairs)</text>';\n\n        // Dimension arrows\n        svgHtml += '<line x1=\"755\" y1=\"50\" x2=\"755\" y2=\"130\" stroke=\"var(--fg)\" stroke-width=\"2\"/>';\n        svgHtml += '<line x1=\"750\" y1=\"50\" x2=\"760\" y2=\"50\" stroke=\"var(--fg)\" stroke-width=\"2\"/>';\n        svgHtml += '<line x1=\"750\" y1=\"130\" x2=\"760\" y2=\"130\" stroke=\"var(--fg)\" stroke-width=\"2\"/>';\n        svgHtml += '<text x=\"770\" y=\"95\" fill=\"var(--fg)\" font-size=\"12\" font-weight=\"bold\">' + thick + '\"</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyOrderSheet() {\n        var yds = document.getElementById('concreteCuYds').textContent;\n        var cuft = document.getElementById('concreteCuFt').textContent;\n        var b80 = document.getElementById('bags80Count').textContent;\n        var b60 = document.getElementById('bags60Count').textContent;\n        var b50 = document.getElementById('bags50Count').textContent;\n        var cost = document.getElementById('estCostBags').textContent;\n        var type = document.getElementById('structureType').options[document.getElementById('structureType').selectedIndex].text;\n\n        var text = '📋 Concrete Materials Order Sheet\\n' +\n          '• Project Type: ' + type + '\\n' +\n          '• Total Volume: ' + yds + ' Cubic Yards (' + cuft + ')\\n' +\n          '• 80 lb Bags Needed: ' + b80 + ' bags\\n' +\n          '• 60 lb Bags Needed: ' + b60 + ' bags\\n' +\n          '• 50 lb Bags Needed: ' + b50 + ' bags\\n' +\n          '• ' + cost + '\\n' +\n          '• Sub-base: Recommended 4\" compacted #57 gravel\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/concrete-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyConcreteBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Order Sheet!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      document.getElementById('structureType').addEventListener('change', function() {\n        var isSlab = this.value === 'slab' || this.value === 'curb';\n        document.getElementById('slabInputs').style.display = isSlab ? 'block' : 'none';\n        document.getElementById('columnInputs').style.display = isSlab ? 'none' : 'block';\n        calcConcrete();\n      });\n\n      var inputs = ['slabLength', 'slabWidth', 'slabThickness', 'colDiameter', 'colDepth', 'colCount', 'wasteFactor', 'bagPrice80'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcConcrete);\n          el.addEventListener('change', calcConcrete);\n        }\n      });\n\n      document.getElementById('copyConcreteBtn').addEventListener('click', copyOrderSheet);\n\n      calcConcrete();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'concrete-calculator.html'), renderTradePage({
    title: "Concrete Calculator: Slabs, Footings, Sonotubes & Bags (80lb / 60lb) | Digital Tools Shed",
    metaDesc: "Calculate exact concrete cubic yards, cubic meters, and pre-mix bags (80lb, 60lb, 50lb) for slabs, footings, and round columns with waste buffers and ready-mix truck cost comparisons.",
    canonical: `${DOMAIN}/calc/concrete-calculator`,
    bodyContent: concreteBody,
    currentPath: '/calc/concrete-calculator',
    faq: [
  {
    "q": "How many 80 lb bags of concrete do I need for one cubic yard?",
    "a": "It takes exactly 45 bags of 80 lb pre-mix concrete to equal one cubic yard (27 cubic feet). For 60 lb bags, you need 60 bags; for 50 lb bags, 72 bags; and for 40 lb bags, 90 bags. Always purchase 10% extra to account for subgrade unevenness and spillage."
  },
  {
    "q": "When should I order a ready-mix truck instead of buying pre-mix bags?",
    "a": "As a rule of thumb, projects requiring more than 1.0 to 1.5 cubic yards (45 to 65 eighty-pound bags) should be ordered via a ready-mix concrete truck. Hand-mixing more than 50 bags is physically brutal, takes hours, and risks cold joints where early batches set before later batches are poured."
  },
  {
    "q": "How thick should a concrete slab be for a patio, driveway, or shed?",
    "a": "Standard pedestrian sidewalks and light garden patios should be 3.5 to 4 inches thick. Shed floors and residential driveways supporting passenger cars should be 4 to 5 inches thick. Driveways supporting heavy pickup trucks, RVs, or commercial equipment require 6 to 8 inches with rebar reinforcement."
  },
  {
    "q": "How do you calculate concrete yardage for a rectangular slab?",
    "a": "Multiply Length (ft) × Width (ft) × Thickness (ft) and divide by 27. For example, a 10 ft by 20 ft slab that is 4 inches thick: 10 × 20 × (4 / 12) = 66.67 cu ft. Divide by 27 = 2.47 cubic yards. Adding 10% waste equals 2.72 cubic yards."
  },
  {
    "q": "Why is a compacted gravel base necessary under a concrete slab?",
    "a": "A 4-inch compacted gravel base (such as 3/4\" crushed aggregate) provides uniform structural support, facilitates critical water drainage under the slab, and prevents frost heave cracking during freezing winter temperatures."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. DRYWALL & SCREW ESTIMATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const drywallBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Drywall Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Drywall Sheets, Mud, Screws & Tape Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate complete drywall material requirements for any room or basement remodel. Computes 4x8 and 4x12 sheetrock counts, 4.5-gallon all-purpose joint compound buckets, 1-1/4\" drywall screws, and tape rolls with door/window subtractions and hanging waste factors.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><line x1=\"9\" y1=\"3\" x2=\"9\" y2=\"21\"/></svg>\n        Room Dimensions\n      </h2>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roomLength\">Length (Feet)</label>\n          <input type=\"number\" id=\"roomLength\" value=\"16\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roomWidth\">Width (Feet)</label>\n          <input type=\"number\" id=\"roomWidth\" value=\"12\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"ceilingHeight\">Ceiling Height</label>\n          <select id=\"ceilingHeight\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"8\" selected>8 Ft (Standard)</option>\n            <option value=\"9\">9 Ft (Modern Residential)</option>\n            <option value=\"10\">10 Ft (High Ceiling)</option>\n            <option value=\"12\">12 Ft (Vaulted / Commercial)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"sheetSize\">Sheet Size</label>\n          <select id=\"sheetSize\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"32\" selected>4x8 Ft (32 sq ft — Standard)</option>\n            <option value=\"48\">4x12 Ft (48 sq ft — Fewer Seams)</option>\n          </select>\n        </div>\n      </div>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;cursor:pointer;font-weight:600;\">\n          <input type=\"checkbox\" id=\"includeCeiling\" checked style=\"accent-color:var(--fg);\">\n          <span>Include Ceiling Drywall in Estimate</span>\n        </label>\n      </div>\n\n      <!-- OPENINGS DEDUCTIONS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"doorCount\">Doors (Subtract 21 sq ft)</label>\n          <input type=\"number\" id=\"doorCount\" value=\"2\" min=\"0\" max=\"10\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"windowCount\">Windows (Subtract 15 sq ft)</label>\n          <input type=\"number\" id=\"windowCount\" value=\"2\" min=\"0\" max=\"15\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n      </div>\n\n      <div>\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wastePct\">Waste Allowance (%)</label>\n        <select id=\"wastePct\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"10\" selected>10% (Recommended Standard)</option>\n          <option value=\"15\">15% (Complex Room / Many Cutouts)</option>\n          <option value=\"5\">5% (Simple Rectangular Box)</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg>\n            Drywall Material Takeoff\n          </h2>\n          <button id=\"copyDrywallBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Drywall Sheets</span>\n            <span id=\"drywallSheetCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">22</span>\n            <span id=\"sheetSizeLabel\" style=\"font-size:0.8rem;color:#3b82f6;font-weight:600;\">4x8 Ft Panels</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Net Surface Area</span>\n            <span id=\"netSquareFootage\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">640</span>\n            <span id=\"grossSquareFootage\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">704 sq ft with waste</span>\n          </div>\n        </div>\n\n        <!-- ACCESSORIES BREAKDOWN TABLE -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Finishing Fasteners & Supplies</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Joint Compound (Mud):</span>\n            <strong id=\"mudBuckets\" style=\"font-family:var(--mono);color:#10b981;\">2 Buckets (4.5 Gal)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>1-1/4\" Drywall Screws:</span>\n            <strong id=\"screwsCount\" style=\"font-family:var(--mono);color:var(--fg);\">3 lbs (~750 screws)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Joint Tape (Paper/Fiber):</span>\n            <strong id=\"tapeRolls\" style=\"font-family:var(--mono);color:var(--fg);\">1 Roll (250 ft)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Wall vs Ceiling Split:</span>\n            <span id=\"wallCeilingRatio\" style=\"font-family:var(--mono);color:var(--text-muted);\">448 sq ft wall / 192 sq ft ceiling</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG ROOM UNFOLDED PLAN -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Unfolded Room Drywall Surface Layout</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Architectural unfolded elevation displaying all four perimeter walls and center ceiling with deducted door and window openings.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"drywallRoomSvg\" viewBox=\"0 0 800 280\" style=\"width:100%;height:auto;min-width:550px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & QUANTITY DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Drywall Estimation Formulas & Industry Rule-of-Thumbs</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Professional drywall contractors compute gross envelope area and subtract standard opening constants ($21 \\text{ sq ft}$ for standard $3'0'' \\times 6'8''$ doors; $15 \\text{ sq ft}$ for standard $3'0'' \\times 5'0''$ windows) before applying waste multipliers.\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Total Gross Surface Area:</strong><br>\n      A_{\\text{walls}} = 2 \\times (L + W) \\times H, \\quad A_{\\text{ceiling}} = L \\times W<br><br>\n      <strong>2. Net Drywall Square Footage:</strong><br>\n      A_{\\text{net}} = (A_{\\text{walls}} + A_{\\text{ceiling}}) - (21 \\times N_{\\text{doors}} + 15 \\times N_{\\text{windows}})<br><br>\n      <strong>3. Panel Requirements:</strong><br>\n      N_{\\text{sheets}} = \\left\\lceil \\frac{A_{\\text{net}} \\times (1 + \\frac{\\text{Waste}_{\\%}}{100})}{\\text{Sheet Area (32 or 48)}} \\right\\rceil<br><br>\n      <strong>4. Joint Compound (Mud) Requirements:</strong><br>\n      \\text{Mud Volume} \\approx A_{\\text{net}} \\times 0.007 \\text{ gal/sq ft} \\quad (\\sim 1 \\text{ standard 4.5-gal bucket per } 650 \\text{ sq ft for 3 coats})<br><br>\n      <strong>5. Fasteners:</strong><br>\n      \\text{Screws} = N_{\\text{sheets}} \\times 32 \\text{ screws/sheet} \\quad (16'' \\text{ O.C. stud framing})\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL DRYWALL TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Drywall Hanging & Finishing Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Aligning Seams Directly Over Door & Window Corners</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Placing a drywall joint directly in line with a door jamb or window header causes guaranteed diagonal stress cracks when the house naturally settles or the door slams. Always notch drywall panels in an \"L-shape\" around corners so seams are offset at least 8 inches from rough openings.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Over-Driving Drywall Screws Through the Paper</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Drywall screws must countersink just slightly below the surface without puncturing the paper facing. The gypsum core has zero holding strength by itself; the tensile strength comes entirely from the paper face. Puncturing the paper renders the screw completely useless.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Hanging Walls Before Ceilings</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Always hang ceiling drywall panels first. When you subsequently hang the wall panels tight against the ceiling, the top edges of the wall sheets mechanically support the perimeter edges of the ceiling panels, preventing ceiling perimeter sag and eliminating corner cracking.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Hanging Drywall Vertically Instead of Horizontally</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Residential walls should always be hung horizontally. Running panels perpendicular to wall studs bridges framing inconsistencies, increases structural shear strength, and eliminates up to 25% of linear tape seams while placing joints at a comfortable working height (48 inches).\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Premature Second-Coating Joint Compound</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Applying a second or third coat of joint compound before the base coat has thoroughly dried and shrunk results in alligator cracking and joint tape blisters. Standard drying takes 24 hours per coat; use setting-type \"hot mud\" (Durabond 45/90) if same-day multi-coating is required.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcDrywall() {\n        var len = parseFloat(document.getElementById('roomLength').value) || 0;\n        var wid = parseFloat(document.getElementById('roomWidth').value) || 0;\n        var h = parseFloat(document.getElementById('ceilingHeight').value) || 8;\n        var incCeil = document.getElementById('includeCeiling').checked;\n        var sheetSqFt = parseFloat(document.getElementById('sheetSize').value) || 32;\n        var doors = parseInt(document.getElementById('doorCount').value) || 0;\n        var windows = parseInt(document.getElementById('windowCount').value) || 0;\n        var waste = (parseFloat(document.getElementById('wastePct').value) || 10) / 100;\n\n        var wallSqFt = 2 * (len + wid) * h;\n        var ceilSqFt = incCeil ? (len * wid) : 0;\n        var totalGross = wallSqFt + ceilSqFt;\n\n        var deductions = (doors * 21) + (windows * 15);\n        var netSqFt = Math.max(0, totalGross - deductions);\n        var grossWithWaste = netSqFt * (1 + waste);\n\n        var numSheets = Math.ceil(grossWithWaste / sheetSqFt);\n\n        // Materials\n        var mudGal = netSqFt * 0.007;\n        var mudBuckets = Math.max(1, Math.ceil(mudGal / 4.5));\n        var totalScrews = numSheets * 32;\n        var screwsLbs = Math.max(1, Math.ceil(totalScrews / 280)); // ~280 1-1/4\" screws per lb\n        var tapeFt = netSqFt * 0.4;\n        var tapeRolls = Math.max(1, Math.ceil(tapeFt / 250));\n\n        // Update DOM\n        document.getElementById('drywallSheetCount').textContent = numSheets;\n        document.getElementById('sheetSizeLabel').textContent = sheetSqFt === 48 ? '4x12 Ft Panels' : '4x8 Ft Panels';\n        document.getElementById('netSquareFootage').textContent = Math.round(netSqFt).toLocaleString();\n        document.getElementById('grossSquareFootage').textContent = Math.round(grossWithWaste).toLocaleString() + ' sq ft with waste';\n\n        document.getElementById('mudBuckets').textContent = mudBuckets + ' Bucket' + (mudBuckets > 1 ? 's' : '') + ' (4.5 Gal)';\n        document.getElementById('screwsCount').textContent = screwsLbs + ' lbs (~' + totalScrews.toLocaleString() + ' screws)';\n        document.getElementById('tapeRolls').textContent = tapeRolls + ' Roll' + (tapeRolls > 1 ? 's' : '') + ' (250 ft)';\n        document.getElementById('wallCeilingRatio').textContent = Math.round(wallSqFt) + ' sq ft wall' + (incCeil ? ' / ' + Math.round(ceilSqFt) + ' sq ft ceiling' : ' (No ceiling)');\n\n        renderRoomSvg(len, wid, h, incCeil);\n      }\n\n      function renderRoomSvg(len, wid, h, incCeil) {\n        var svg = document.getElementById('drywallRoomSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var startX = 60;\n        var startY = 30;\n\n        // Visual representation of 4 walls\n        var wallW = 150;\n        var wallH = 100;\n        var gap = 15;\n\n        var labels = ['North Wall (' + len + \"')\", 'East Wall (' + wid + \"')\", 'South Wall (' + len + \"')\", 'West Wall (' + wid + \"')\"];\n\n        for (var i = 0; i < 4; i++) {\n          var x = startX + i * (wallW + gap);\n          svgHtml += '<rect x=\"' + x + '\" y=\"' + startY + '\" width=\"' + wallW + '\" height=\"' + wallH + '\" fill=\"var(--surface)\" stroke=\"var(--border)\" stroke-width=\"2\" rx=\"4\"/>';\n          svgHtml += '<text x=\"' + (x + wallW/2) + '\" y=\"' + (startY + 25) + '\" fill=\"var(--fg)\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">' + labels[i] + '</text>';\n          svgHtml += '<text x=\"' + (x + wallW/2) + '\" y=\"' + (startY + 50) + '\" fill=\"var(--text-muted)\" font-size=\"10\" text-anchor=\"middle\">' + h + \"' Height</text>\";\n\n          // Seam line\n          svgHtml += '<line x1=\"' + x + '\" y1=\"' + (startY + wallH/2) + '\" x2=\"' + (x + wallW) + '\" y2=\"' + (startY + wallH/2) + '\" stroke=\"#3b82f6\" stroke-dasharray=\"4,3\" stroke-width=\"1.5\"/>';\n        }\n\n        // Ceiling box if included\n        if (incCeil) {\n          var ceilY = startY + wallH + 20;\n          svgHtml += '<rect x=\"' + startX + '\" y=\"' + ceilY + '\" width=\"' + (4 * wallW + 3 * gap) + '\" height=\"90\" fill=\"var(--bg)\" stroke=\"#10b981\" stroke-width=\"2\" rx=\"4\"/>';\n          svgHtml += '<text x=\"' + (startX + 20) + '\" y=\"' + (ceilY + 30) + '\" fill=\"#10b981\" font-size=\"13\" font-weight=\"bold\">Ceiling Surface (' + len + \"' x \" + wid + \"')</text>\";\n          svgHtml += '<text x=\"' + (startX + 20) + '\" y=\"' + (ceilY + 55) + '\" fill=\"var(--text-muted)\" font-size=\"11\">Hang ceiling panels first before walls to support perimeter edges.</text>';\n        }\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyTakeoff() {\n        var sheets = document.getElementById('drywallSheetCount').textContent;\n        var sheetType = document.getElementById('sheetSizeLabel').textContent;\n        var net = document.getElementById('netSquareFootage').textContent;\n        var gross = document.getElementById('grossSquareFootage').textContent;\n        var mud = document.getElementById('mudBuckets').textContent;\n        var screws = document.getElementById('screwsCount').textContent;\n        var tape = document.getElementById('tapeRolls').textContent;\n\n        var text = '📋 Drywall Material Takeoff & Order Sheet\\n' +\n          '• Drywall Sheets: ' + sheets + ' (' + sheetType + ')\\n' +\n          '• Net Surface Area: ' + net + ' sq ft (' + gross + ')\\n' +\n          '• Joint Compound: ' + mud + '\\n' +\n          '• Drywall Screws: ' + screws + '\\n' +\n          '• Joint Tape: ' + tape + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/drywall-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyDrywallBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['roomLength', 'roomWidth', 'ceilingHeight', 'includeCeiling', 'sheetSize', 'doorCount', 'windowCount', 'wastePct'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcDrywall);\n          el.addEventListener('change', calcDrywall);\n        }\n      });\n\n      document.getElementById('copyDrywallBtn').addEventListener('click', copyTakeoff);\n\n      calcDrywall();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'drywall-calculator.html'), renderTradePage({
    title: "Drywall Calculator: Sheets (4x8 & 4x12), Mud, Screws & Tape Estimator | Digital Tools Shed",
    metaDesc: "Calculate exact drywall sheets (4x8 and 4x12), joint compound buckets, screws, and tape rolls for any room with automatic window and door deductions.",
    canonical: `${DOMAIN}/calc/drywall-calculator`,
    bodyContent: drywallBody,
    currentPath: '/calc/drywall-calculator',
    faq: [
  {
    "q": "How many 4x8 drywall sheets do I need for a 12x12 room?",
    "a": "A standard 12x12 foot room with 8-foot ceilings requires approximately 18 sheets of 4x8 drywall (12 sheets for the perimeter walls and 5 to 6 sheets for the ceiling, accounting for door and window subtractions and standard 10% cutting waste)."
  },
  {
    "q": "Should I hang drywall horizontally or vertically on residential walls?",
    "a": "Hang drywall horizontally (perpendicular to wall studs). Horizontal installation increases wall shear strength, bridges minor stud bowing, reduces the total linear footage of tape joints by roughly 25%, and places seams at a convenient 48-inch working height."
  },
  {
    "q": "Why must ceiling drywall always be hung before wall drywall?",
    "a": "Ceiling panels must be installed first so the top edges of the wall panels press tight underneath them, physically supporting the perimeter of the ceiling sheets. This eliminates ceiling perimeter sag and prevents corner seam cracking."
  },
  {
    "q": "How much joint compound (mud) do I need per drywall sheet?",
    "a": "As a reliable rule of thumb, plan for approximately 0.053 gallons of joint compound per 4x8 sheet across three coats (taping coat, filler coat, and finish skim coat). A 4.5-gallon bucket typically covers about 75 to 85 sheets of drywall or roughly 600 to 700 square feet."
  },
  {
    "q": "What is the advantage of using 4x12 drywall sheets instead of 4x8 sheets?",
    "a": "4x12 foot panels cover 48 square feet per sheet compared to 32 square feet for a 4x8 panel. On long walls, 12-foot sheets eliminate vertical butt joints entirely, creating smoother walls that are much faster to tape and finish with fewer visible seams."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. MULCH & TOPSOIL YARDAGE CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const mulchBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Mulch Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Mulch, Topsoil & Compost Yardage Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate cubic yards and exact bag counts (2.0 and 3.0 cu ft) for flower beds, garden soil, and circular tree rings. Features automatic depth optimization (2\" to 4\"), settling allowance, and bulk landscape yard truckload vs bagged price comparisons.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 2a10 10 0 0 0-7.07 17.07A10 10 0 0 0 12 22a10 10 0 0 0 7.07-2.93A10 10 0 0 0 12 2z\"/></svg>\n        Garden Bed Dimensions\n      </h2>\n\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"bedShape\">Bed Geometry</label>\n        <select id=\"bedShape\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"rect\" selected>Rectangular Garden Bed (Length x Width)</option>\n          <option value=\"circle\">Circular Tree Ring (Radius)</option>\n          <option value=\"sqft\">Direct Total Square Footage</option>\n        </select>\n      </div>\n\n      <!-- RECTANGULAR BED INPUTS -->\n      <div id=\"rectBedInputs\">\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"bedLength\">Length (Feet)</label>\n            <input type=\"number\" id=\"bedLength\" value=\"30\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n          </div>\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"bedWidth\">Width (Feet)</label>\n            <input type=\"number\" id=\"bedWidth\" value=\"6\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n          </div>\n        </div>\n      </div>\n\n      <!-- CIRCLE TREE RING INPUTS -->\n      <div id=\"circleBedInputs\" style=\"display:none;\">\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"ringRadius\">Radius (Feet)</label>\n            <input type=\"number\" id=\"ringRadius\" value=\"4\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n          </div>\n          <div>\n            <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"treeCount\">Number of Trees</label>\n            <input type=\"number\" id=\"treeCount\" value=\"3\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n          </div>\n        </div>\n      </div>\n\n      <!-- DIRECT SQFT INPUT -->\n      <div id=\"directSqFtInputs\" style=\"display:none;margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"customSqFt\">Total Bed Area (Sq Ft)</label>\n        <input type=\"number\" id=\"customSqFt\" value=\"180\" min=\"1\" step=\"10\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"mulchDepth\">Mulch Layer Depth</label>\n          <select id=\"mulchDepth\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"2\">2\" (Annual Top-Dress / Refresh)</option>\n            <option value=\"3\" selected>3\" (Recommended Standard)</option>\n            <option value=\"4\">4\" (New Bed Weed Barrier)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"bagCost\">Price / 2 cu ft Bag ($)</label>\n          <input type=\"number\" id=\"bagCost\" value=\"3.98\" min=\"0\" step=\"0.25\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin-top:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/></svg>\n            Mulch Order Estimate\n          </h2>\n          <button id=\"copyMulchBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Order List</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Cubic Yards Needed</span>\n            <span id=\"mulchCuYds\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">1.67</span>\n            <span id=\"mulchCuFt\" style=\"font-size:0.8rem;color:#3b82f6;font-weight:600;\">45.0 cu ft | 1.27 m³</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Standard 2 Cu Ft Bags</span>\n            <span id=\"mulch2CuFtBags\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">23</span>\n            <span id=\"mulchEstCost\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">Est. Cost: $91</span>\n          </div>\n        </div>\n\n        <!-- ALTERNATIVE BAGS & ADVISORY -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>3.0 Cu Ft Bag Equivalent:</span>\n            <strong id=\"mulch3CuFtBags\" style=\"font-family:var(--mono);color:var(--fg);\">15 Bags</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Delivery Recommendation:</span>\n            <strong id=\"bulkVsBagAdvisory\" style=\"font-family:var(--mono);color:#10b981;\">Store Bags Feasible</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG SOIL STRATA CROSS-SECTION -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Landscape Bed Cross-Section & Root Zone</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Optimal mulch thickness prevents soil weed germination while permitting rain infiltration and oxygen transfer to root crowns.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"mulchCrossSectionSvg\" viewBox=\"0 0 800 180\" style=\"width:100%;height:auto;min-width:550px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & VOLUME DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Mulch Volume Formulas & Standard Bulk Ratios</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Bulk landscaping materials are universally measured in cubic yards ($1 \\text{ yd}^3 = 27 \\text{ ft}^3$). One cubic yard spread at a depth of 3 inches covers exactly 108 square feet ($27 \\div 0.25 = 108$).\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Volume in Cubic Feet:</strong><br>\n      V_{\\text{cu ft}} = \\text{Area (sq ft)} \\times \\frac{\\text{Depth (inches)}}{12}<br><br>\n      <strong>2. Volume in Cubic Yards:</strong><br>\n      V_{\\text{cu yds}} = \\frac{V_{\\text{cu ft}}}{27} = \\frac{\\text{Area} \\times \\text{Depth}}{324}<br><br>\n      <strong>3. Bag Conversion Constants:</strong><br>\n      \\text{Bags}_{2.0\\text{ cu ft}} = \\left\\lceil \\frac{V_{\\text{cu ft}}}{2.0} \\right\\rceil = \\lceil V_{\\text{cu yds}} \\times 13.5 \\rceil<br>\n      \\text{Bags}_{3.0\\text{ cu ft}} = \\left\\lceil \\frac{V_{\\text{cu ft}}}{3.0} \\right\\rceil = \\lceil V_{\\text{cu yds}} \\times 9.0 \\rceil\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL MULCHING TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Mulching & Landscaping Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. The Destructive \"Mulch Volcano\"</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Piling mulch directly against tree trunks in a steep cone is the #1 cause of suburban tree mortality. Trunk bark requires air exchange; trapped moisture rots the phloem layer, suffocates root flares, and encourages rodents to chew through bark cambium. Keep mulch 3 to 6 inches away from trunks.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Over-Mulching Suffocation (> 4 Inches)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Applying more than 3 to 4 inches of mulch prevents oxygen and rainfall from reaching plant roots. In wet climates, thick mulch stays waterlogged, suffocating shallow feeder roots; in dry climates, thick mulch absorbs light rain like a sponge, preventing any moisture from penetrating into the soil below.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Sour / Anaerobic Mulch Acidity Shock</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          When bulk mulch is piled high without airflow, anaerobic decomposition produces acetic acid, alcohol, and methane gas. This \"sour\" mulch smells like vinegar or rotten silage and has a toxic pH as low as 3.0. Applying sour mulch directly kills perennials and bleaches shrubs within 24 hours.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Fresh Uncomposted Wood Chips Nitrogen Draw</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Fresh tree-trimming wood chips have an extreme carbon-to-nitrogen ratio (500:1). Soil bacteria consume all available nitrogen from the topsoil to break down the raw wood, causing neighboring annuals and vegetables to turn yellow and starve from severe nitrogen deficiency.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Weed Barrier Fabric Layering Failure</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Installing plastic or woven landscape fabric under organic mulch creates a maintenance nightmare within 2 years. The organic mulch decomposes into fertile compost on top of the fabric. Windblown weed seeds germinate above the barrier and anchor their roots directly through the weave.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcMulch() {\n        var shape = document.getElementById('bedShape').value;\n        var depthIn = parseFloat(document.getElementById('mulchDepth').value) || 3;\n        var bagCost = parseFloat(document.getElementById('bagCost').value) || 3.98;\n\n        var areaSqFt = 0;\n        if (shape === 'rect') {\n          var len = parseFloat(document.getElementById('bedLength').value) || 0;\n          var wid = parseFloat(document.getElementById('bedWidth').value) || 0;\n          areaSqFt = len * wid;\n        } else if (shape === 'circle') {\n          var r = parseFloat(document.getElementById('ringRadius').value) || 0;\n          var count = parseInt(document.getElementById('treeCount').value) || 1;\n          areaSqFt = Math.PI * r * r * count;\n        } else {\n          areaSqFt = parseFloat(document.getElementById('customSqFt').value) || 0;\n        }\n\n        var cuFt = areaSqFt * (depthIn / 12);\n        var cuYds = cuFt / 27;\n        var cuMeters = cuFt * 0.0283168;\n\n        var bags2 = Math.ceil(cuFt / 2.0);\n        var bags3 = Math.ceil(cuFt / 3.0);\n        var totalCost = bags2 * bagCost;\n\n        // Update DOM\n        document.getElementById('mulchCuYds').textContent = cuYds.toFixed(2);\n        document.getElementById('mulchCuFt').textContent = cuFt.toFixed(1) + ' cu ft | ' + cuMeters.toFixed(2) + ' m³';\n        document.getElementById('mulch2CuFtBags').textContent = bags2.toLocaleString();\n        document.getElementById('mulch3CuFtBags').textContent = bags3.toLocaleString() + ' Bags (3.0 cu ft)';\n        document.getElementById('mulchEstCost').textContent = 'Est. Bag Cost: $' + Math.round(totalCost).toLocaleString();\n\n        var adv = document.getElementById('bulkVsBagAdvisory');\n        if (cuYds >= 3.0) {\n          adv.textContent = 'Bulk Delivery Recommended (3+ yd³)';\n          adv.style.color = '#3b82f6';\n        } else {\n          adv.textContent = 'Store Bags Feasible (< 3 yd³)';\n          adv.style.color = '#10b981';\n        }\n\n        renderStrata(depthIn);\n      }\n\n      function renderStrata(d) {\n        var svg = document.getElementById('mulchCrossSectionSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var startX = 60;\n        var startY = 30;\n        var w = 680;\n\n        var mulchH = d * 18; // scaled px\n        var soilH = 80;\n\n        // Mulch Layer\n        svgHtml += '<rect x=\"' + startX + '\" y=\"' + startY + '\" width=\"' + w + '\" height=\"' + mulchH + '\" fill=\"#78350f\" opacity=\"0.85\" rx=\"3\"/>';\n        svgHtml += '<text x=\"' + (startX + 20) + '\" y=\"' + (startY + mulchH/2 + 5) + '\" fill=\"#ffffff\" font-size=\"12\" font-weight=\"bold\">Organic Mulch Layer (' + d + '\" Depth)</text>';\n\n        // Native Soil\n        svgHtml += '<rect x=\"' + startX + '\" y=\"' + (startY + mulchH) + '\" width=\"' + w + '\" height=\"' + soilH + '\" fill=\"#451a03\" opacity=\"0.4\" rx=\"2\"/>';\n        svgHtml += '<text x=\"' + (startX + 20) + '\" y=\"' + (startY + mulchH + 35) + '\" fill=\"var(--fg)\" font-size=\"12\" font-weight=\"bold\">Native Topsoil & Active Root Zone</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyOrder() {\n        var yds = document.getElementById('mulchCuYds').textContent;\n        var cuft = document.getElementById('mulchCuFt').textContent;\n        var b2 = document.getElementById('mulch2CuFtBags').textContent;\n        var b3 = document.getElementById('mulch3CuFtBags').textContent;\n        var cost = document.getElementById('mulchEstCost').textContent;\n\n        var text = '📋 Landscaping Mulch Order Takeoff\\n' +\n          '• Total Volume: ' + yds + ' Cubic Yards (' + cuft + ')\\n' +\n          '• 2.0 Cu Ft Bags: ' + b2 + ' bags\\n' +\n          '• 3.0 Cu Ft Bags: ' + b3 + '\\n' +\n          '• ' + cost + '\\n' +\n          '• Keep mulch 3-6 inches away from tree root flares\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/mulch-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyMulchBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Order Sheet!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      document.getElementById('bedShape').addEventListener('change', function() {\n        var s = this.value;\n        document.getElementById('rectBedInputs').style.display = s === 'rect' ? 'block' : 'none';\n        document.getElementById('circleBedInputs').style.display = s === 'circle' ? 'block' : 'none';\n        document.getElementById('directSqFtInputs').style.display = s === 'sqft' ? 'block' : 'none';\n        calcMulch();\n      });\n\n      var inputs = ['bedLength', 'bedWidth', 'ringRadius', 'treeCount', 'customSqFt', 'mulchDepth', 'bagCost'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcMulch);\n          el.addEventListener('change', calcMulch);\n        }\n      });\n\n      document.getElementById('copyMulchBtn').addEventListener('click', copyOrder);\n\n      calcMulch();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'mulch-calculator.html'), renderTradePage({
    title: "Mulch & Topsoil Calculator: Cubic Yards, Bags (2 & 3 Cu Ft) & Bed Depth | Digital Tools Shed",
    metaDesc: "Calculate exact mulch, topsoil, and compost cubic yards and bag counts (2 cu ft and 3 cu ft) for landscape beds and tree rings with bulk delivery cost comparisons.",
    canonical: `${DOMAIN}/calc/mulch-calculator`,
    bodyContent: mulchBody,
    currentPath: '/calc/mulch-calculator',
    faq: [
  {
    "q": "How many bags of mulch equal one cubic yard?",
    "a": "It takes exactly 13.5 bags of 2.0 cubic foot mulch to equal one cubic yard (27 cubic feet). For larger 3.0 cubic foot bags, you need 9 bags per cubic yard."
  },
  {
    "q": "How deep should mulch be in landscape and flower beds?",
    "a": "The ideal depth is 3 inches for standard landscape flower beds. A 3-inch layer is thick enough to block sunlight from reaching weed seeds and retain soil moisture, while still allowing water and air to reach plant roots. Never exceed 4 inches."
  },
  {
    "q": "How much square footage does one cubic yard of mulch cover?",
    "a": "At a 3-inch depth, one cubic yard of mulch covers exactly 108 square feet. At a 2-inch depth (annual top-dress), one cubic yard covers 162 square feet. At a 4-inch depth, it covers 81 square feet."
  },
  {
    "q": "When should I order bulk mulch delivery instead of bags?",
    "a": "If your project requires more than 3 cubic yards (40+ bags), ordering bulk delivery from a local landscape supply yard is significantly cheaper ($35 to $50 per cubic yard vs $60+ in bags) and eliminates hauling dozens of dirty plastic bags in your personal vehicle."
  },
  {
    "q": "What is a mulch volcano and why is it dangerous for trees?",
    "a": "A mulch volcano occurs when mulch is piled high against a tree trunk in a steep cone. Piling mulch against bark traps constant moisture, encouraging fungal rot, girdling roots, and insect infestation that suffocates and kills the tree. Mulch should always be kept 3 to 6 inches away from the root flare."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. WALL FRAMING STUD CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const studBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Framing Stud Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Wall Stud & Framing Lumber Takeoff Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate complete framing lumber lists for interior partition and load-bearing exterior walls. Accurately accounts for 16\" vs 24\" on-center spacing, bottom sole plates, double top plates, California 3-stud corners, T-junction drywall backers, and door/window king, jack, and cripple assemblies.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"12\" y1=\"2\" x2=\"12\" y2=\"22\"/><line x1=\"2\" y1=\"12\" x2=\"22\" y2=\"12\"/><path d=\"M4 4h16v16H4z\"/></svg>\n        Wall Framing Specifications\n      </h2>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wallLength\">Total Wall Length (Feet)</label>\n          <input type=\"number\" id=\"wallLength\" value=\"40\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wallHeight\">Wall Height</label>\n          <select id=\"wallHeight\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"8\" selected>8 Ft (Standard 92-5/8\" Pre-Cut Studs)</option>\n            <option value=\"9\">9 Ft (104-5/8\" Pre-Cut Studs)</option>\n            <option value=\"10\">10 Ft (116-5/8\" Pre-Cut Studs)</option>\n          </select>\n        </div>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"studSpacing\">Stud Spacing (O.C.)</label>\n          <select id=\"studSpacing\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"16\" selected>16\" On-Center (Standard Load-Bearing)</option>\n            <option value=\"24\">24\" On-Center (Advanced / Non-Bearing)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wallType\">Wall Structure Type</label>\n          <select id=\"wallType\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"exterior\" selected>Exterior / Bearing (Double Top Plate)</option>\n            <option value=\"interior\">Interior Partition (Single Top Plate)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- CORNERS & INTERSECTIONS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"cornerCount\">Corners (3-Stud Cal.)</label>\n          <input type=\"number\" id=\"cornerCount\" value=\"2\" min=\"0\" max=\"20\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"tJunctionCount\">T-Junction Intersections</label>\n          <input type=\"number\" id=\"tJunctionCount\" value=\"1\" min=\"0\" max=\"20\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n      </div>\n\n      <!-- ROUGH OPENINGS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"doorOpenings\">Door Openings (+4 studs ea)</label>\n          <input type=\"number\" id=\"doorOpenings\" value=\"1\" min=\"0\" max=\"10\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"windowOpenings\">Window Openings (+5 studs ea)</label>\n          <input type=\"number\" id=\"windowOpenings\" value=\"2\" min=\"0\" max=\"15\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n      </div>\n\n      <div>\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wasteAllowance\">Waste & Lumber Allowance (%)</label>\n        <select id=\"wasteAllowance\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"15\" selected>15% (Recommended for Bows & Trimming)</option>\n          <option value=\"10\">10% (High Grade Select Lumber)</option>\n          <option value=\"20\">20% (Economy Utility Grade)</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- SUMMARY & LUMBER LIST COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg>\n            Lumber Takeoff List\n          </h2>\n          <button id=\"copyFramingBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Vertical Studs</span>\n            <span id=\"totalStudsCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">52</span>\n            <span id=\"studHeightLabel\" style=\"font-size:0.8rem;color:#3b82f6;font-weight:600;\">92-5/8\" Pre-Cuts (incl. waste)</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Plate Lumber (16' Boards)</span>\n            <span id=\"plateBoardsCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">9</span>\n            <span id=\"plateLinearFt\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">120 Linear Feet Total</span>\n          </div>\n        </div>\n\n        <!-- BREAKDOWN LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Lumber Component Itemization</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Common Wall Studs (Field):</span>\n            <strong id=\"commonStudsVal\" style=\"font-family:var(--mono);\">31</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Corner & Intersection Backers:</span>\n            <strong id=\"cornersVal\" style=\"font-family:var(--mono);\">6 (Corners) + 2 (T-Junction)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Door & Window Assemblies (Kings/Jacks):</span>\n            <strong id=\"openingsStudsVal\" style=\"font-family:var(--mono);\">14 studs</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Plate Structure:</span>\n            <span id=\"plateStructureDesc\" style=\"font-family:var(--mono);color:var(--fg);font-weight:600;\">3 Plates (Double Top + Sole Plate)</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG FRAMING ELEVATION DIAGRAM -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Wall Framing Elevation Schematic</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Architectural framing layout displaying bottom sole plate, double top plates, 16\" on-center field studs, king studs, jack trimmers, and solid header assembly.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"framingWallSvg\" viewBox=\"0 0 800 240\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & STRUCTURAL DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Carpentry Formulas & On-Center Spacing Derivations</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Wall stud counts do not equal simple length division because framing requires an initial starting stud, plus framing assemblies for sheetrock backing at corners and load transfer around openings (IRC Chapter 6 Wall Construction).\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Common Field Studs:</strong><br>\n      N_{\\text{field}} = \\left\\lfloor \\frac{L_{\\text{ft}} \\times 12}{\\text{Spacing (16'' or 24'')} } \\right\\rfloor + 1<br><br>\n      <strong>2. Corner & Intersection Backers:</strong><br>\n      N_{\\text{corners}} = 3 \\times N_{\\text{exterior corners}} \\quad (\\text{California 3-stud corner}), \\quad N_{\\text{T-junctions}} = 2 \\times N_{\\text{intersections}}<br><br>\n      <strong>3. Opening King & Jack Assemblies:</strong><br>\n      N_{\\text{doors}} = 4 \\times N_{\\text{door openings}} \\quad (2 \\text{ Kings} + 2 \\text{ Jacks})<br>\n      N_{\\text{windows}} = 5 \\times N_{\\text{window openings}} \\quad (2 \\text{ Kings} + 2 \\text{ Jacks} + \\text{Cripple studs})<br><br>\n      <strong>4. Plate Linear Footage:</strong><br>\n      \\text{LF}_{\\text{plates}} = L_{\\text{ft}} \\times (\\text{Plates Count: } 3 \\text{ for double top, } 2 \\text{ for single top})<br><br>\n      <strong>5. Gross Stud Takeoff with Waste:</strong><br>\n      \\text{Total Studs} = \\left\\lceil (N_{\\text{field}} + N_{\\text{corners}} + N_{\\text{openings}}) \\times (1 + \\frac{\\text{Waste}_{\\%}}{100}) \\right\\rceil\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL FRAMING TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Wall Framing & IRC Code Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Failing the 24\" Top Plate Stagger Rule</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          IRC Section R602.3.2 mandates that end joints in double top plates must be offset at least 24 inches (or 48 inches under high seismic/wind codes) from end joints in the plate below. Aligning top plate joints over lower plate joints creates a structural hinge that fails inspection.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Missing Jack Stud Bearing Under Headers</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Toenailing a header directly to king studs without jack (trimmer) studs underneath is illegal for load-bearing walls. The entire roof or floor load above the header must bear directly on continuous vertical timber jack studs that extend down to the bottom plate.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Omitting Horizontal Fireblocking</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          For walls over 10 feet tall, IRC Section R602.8 requires solid 2x4 horizontal blocking installed between studs at the midpoint. Omitting fireblocking creates open vertical chimneys inside walls that accelerate fire spread from floor to attic.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Random Stud Crown Orientation</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Dimensional lumber studs always have a natural slight bend or arch along their narrow edge, known as the \"crown.\" If you frame adjacent studs with one crown facing inside and the next facing outside, your finished drywall will look severely wavy and buckled under glancing light. Always point all crowns the same direction.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Using Drywall Screws for Structural Framing</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Never substitute drywall screws or interior gold screws for framing nails. Drywall screws are made of hardened, brittle steel with virtually zero shear strength. When a house shifts under wind or seismic loads, screw heads snap off instantly. Code requires 16d common nails (3.5\" × 0.162\") or approved structural fasteners.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcFraming() {\n        var len = parseFloat(document.getElementById('wallLength').value) || 0;\n        var h = parseFloat(document.getElementById('wallHeight').value) || 8;\n        var spacing = parseInt(document.getElementById('studSpacing').value) || 16;\n        var wallType = document.getElementById('wallType').value;\n        var corners = parseInt(document.getElementById('cornerCount').value) || 0;\n        var tJunctions = parseInt(document.getElementById('tJunctionCount').value) || 0;\n        var doors = parseInt(document.getElementById('doorOpenings').value) || 0;\n        var windows = parseInt(document.getElementById('windowOpenings').value) || 0;\n        var waste = (parseFloat(document.getElementById('wasteAllowance').value) || 15) / 100;\n\n        // Common field studs: (length_inches / spacing) + 1\n        var fieldStuds = Math.floor((len * 12) / spacing) + 1;\n\n        // Extra studs for corners (3-stud corner requires 2 extra studs beyond standard corner stud)\n        var cornerStuds = corners * 3;\n        var tJunctionStuds = tJunctions * 2;\n        var openingStuds = (doors * 4) + (windows * 5);\n\n        var baseStuds = fieldStuds + cornerStuds + tJunctionStuds + openingStuds;\n        var totalStuds = Math.ceil(baseStuds * (1 + waste));\n\n        // Plates: Exterior has 3 plates (1 sole + 2 top), interior partition has 2 plates (1 sole + 1 top)\n        var numPlates = wallType === 'exterior' ? 3 : 2;\n        var plateLF = len * numPlates;\n        // Standard 16-ft lumber boards\n        var plateBoards = Math.ceil((plateLF * (1 + 0.10)) / 16);\n\n        // Pre-cut stud label\n        var studLabel = h === 8 ? '92-5/8\" Pre-Cuts (incl. waste)' : (h === 9 ? '104-5/8\" Pre-Cuts' : '116-5/8\" Pre-Cuts');\n\n        // Update DOM\n        document.getElementById('totalStudsCount').textContent = totalStuds;\n        document.getElementById('studHeightLabel').textContent = studLabel;\n        document.getElementById('plateBoardsCount').textContent = plateBoards;\n        document.getElementById('plateLinearFt').textContent = plateLF + ' Linear Feet (' + numPlates + ' Plates)';\n\n        document.getElementById('commonStudsVal').textContent = fieldStuds;\n        document.getElementById('cornersVal').textContent = cornerStuds + ' (Corners) + ' + tJunctionStuds + ' (T-Junctions)';\n        document.getElementById('openingsStudsVal').textContent = openingStuds + ' studs (' + doors + ' doors, ' + windows + ' windows)';\n        document.getElementById('plateStructureDesc').textContent = numPlates + ' Plates (' + (wallType === 'exterior' ? 'Double Top + Bottom Sole' : 'Single Top + Bottom Sole') + ')';\n\n        renderFramingSvg(len, spacing, doors, windows);\n      }\n\n      function renderFramingSvg(len, spacing, doors, windows) {\n        var svg = document.getElementById('framingWallSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var startX = 50;\n        var startY = 30;\n        var wallW = 700;\n        var wallH = 160;\n\n        // Double Top Plate\n        svgHtml += '<rect x=\"' + startX + '\" y=\"' + startY + '\" width=\"' + wallW + '\" height=\"8\" fill=\"#eab308\" stroke=\"var(--border)\"/>';\n        svgHtml += '<rect x=\"' + startX + '\" y=\"' + (startY + 8) + '\" width=\"' + wallW + '\" height=\"8\" fill=\"#eab308\" stroke=\"var(--border)\"/>';\n\n        // Bottom Sole Plate\n        svgHtml += '<rect x=\"' + startX + '\" y=\"' + (startY + wallH - 8) + '\" width=\"' + wallW + '\" height=\"8\" fill=\"#eab308\" stroke=\"var(--border)\"/>';\n\n        // Vertical Studs\n        var numVisualStuds = Math.min(25, Math.floor(wallW / (spacing === 16 ? 30 : 45)));\n        var stepX = wallW / numVisualStuds;\n\n        for (var s = 0; s <= numVisualStuds; s++) {\n          var x = startX + s * stepX;\n          svgHtml += '<rect x=\"' + (x - 2) + '\" y=\"' + (startY + 16) + '\" width=\"5\" height=\"' + (wallH - 24) + '\" fill=\"#94a3b8\" stroke=\"none\"/>';\n        }\n\n        // Window opening in center if present\n        if (windows > 0) {\n          var winX = startX + wallW * 0.45;\n          var winW = 100;\n          var winY = startY + 45;\n          var winH = 70;\n          svgHtml += '<rect x=\"' + winX + '\" y=\"' + winY + '\" width=\"' + winW + '\" height=\"' + winH + '\" fill=\"var(--bg)\" stroke=\"#3b82f6\" stroke-width=\"2\"/>';\n          // Header above window\n          svgHtml += '<rect x=\"' + (winX - 5) + '\" y=\"' + (winY - 14) + '\" width=\"' + (winW + 10) + '\" height=\"14\" fill=\"#ef4444\"/>';\n          svgHtml += '<text x=\"' + (winX + winW/2) + '\" y=\"' + (winY + winH/2 + 4) + '\" fill=\"#3b82f6\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Window Opening</text>';\n        }\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyFramingTakeoff() {\n        var studs = document.getElementById('totalStudsCount').textContent;\n        var studType = document.getElementById('studHeightLabel').textContent;\n        var plates = document.getElementById('plateBoardsCount').textContent;\n        var plateLF = document.getElementById('plateLinearFt').textContent;\n        var common = document.getElementById('commonStudsVal').textContent;\n        var corners = document.getElementById('cornersVal').textContent;\n        var openings = document.getElementById('openingsStudsVal').textContent;\n\n        var text = '📋 Wall Framing Lumber Takeoff & Cut List\\n' +\n          '• Total Wall Studs: ' + studs + ' (' + studType + ')\\n' +\n          '• 16-Ft Plate Boards: ' + plates + ' (' + plateLF + ')\\n' +\n          '• Common Field Studs: ' + common + '\\n' +\n          '• Corners & Drywall Backers: ' + corners + '\\n' +\n          '• Door & Window Studs: ' + openings + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/framing-stud-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyFramingBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['wallLength', 'wallHeight', 'studSpacing', 'wallType', 'cornerCount', 'tJunctionCount', 'doorOpenings', 'windowOpenings', 'wasteAllowance'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcFraming);\n          el.addEventListener('change', calcFraming);\n        }\n      });\n\n      document.getElementById('copyFramingBtn').addEventListener('click', copyFramingTakeoff);\n\n      calcFraming();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'framing-stud-calculator.html'), renderTradePage({
    title: "Wall Stud Framing Calculator (16\" & 24\" O.C. Lumber Takeoff) | Digital Tools Shed",
    metaDesc: "Calculate 2x4 and 2x6 wall studs, top plates, bottom sole plates, corners, and window/door framing lumber with live IRC code specifications and waste buffers.",
    canonical: `${DOMAIN}/calc/framing-stud-calculator`,
    bodyContent: studBody,
    currentPath: '/calc/framing-stud-calculator',
    faq: [
  {
    "q": "How many studs do I need per linear foot of wall?",
    "a": "As an industry rule of thumb for standard 16-inch on-center framing, calculate 1 stud per linear foot of wall. While common field studs are placed every 16 inches, the extra lumber needed for corners, door/window assemblies, top plate ties, and trimmings balances out to approximately one stud per foot."
  },
  {
    "q": "What is the difference between 16\" and 24\" on-center framing?",
    "a": "16-inch on-center spacing is standard for load-bearing exterior walls, multi-story buildings, and heavy tile substrates, providing rigid structural capacity. 24-inch on-center spacing is permitted by code for interior non-bearing partition walls, using roughly 30% less lumber."
  },
  {
    "q": "Why do load-bearing walls require a double top plate?",
    "a": "A double top plate ties adjacent wall panels together at corners and intersections, preventing the frame from pulling apart under wind or seismic tension. It also transfers heavy downward point loads from ceiling joists and roof trusses evenly down into the vertical wall studs."
  },
  {
    "q": "What is a California 3-stud corner and why is it preferred?",
    "a": "A California corner uses two full studs face-nailed into an L-shape with a third stud creating an interior drywall pocket. Compared to traditional solid 4-stud corners, the California corner saves lumber, leaves corner cavities open for fiberglass insulation, and provides solid drywall nailing surfaces on both sides."
  },
  {
    "q": "Why are standard 8-foot wall studs pre-cut to 92-5/8 inches?",
    "a": "Pre-cut studs are manufactured at 92-5/8 inches so that when combined with one 1.5-inch bottom sole plate and two 1.5-inch top plates (4.5 inches total plate thickness), the overall rough framed wall height equals exactly 97-1/8 inches. This allows standard 96-inch (8-foot) drywall sheets to install with a 1/2-inch expansion gap off the floor."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. GRAVEL & CRUSHED STONE CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const gravelBody = "\n<div class=\"tool-container\" style=\"max-width:1080px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-size:2.15rem;font-weight:800;margin-bottom:0.6rem;letter-spacing:-0.02em;\">Gravel & Crushed Stone Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:760px;margin:0 auto;line-height:1.6;\">\n      Calculate exact gravel tonnage, cubic volume, and material loss from mechanical compaction. Configured for driveway base stone, French drain drainage aggregate, and walkway crushed stone.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5\"/></svg>\n        Project Dimensions & Aggregate Type\n      </h2>\n\n      <!-- SHAPE SELECTOR -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\">Project Shape</label>\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;\">\n          <button type=\"button\" id=\"shapeRectBtn\" class=\"shape-btn active\" style=\"padding:0.6rem;border:1px solid #3b82f6;background:#3b82f6;color:#ffffff;border-radius:8px;font-weight:600;cursor:pointer;\">Rectangular (Driveway / Pad)</button>\n          <button type=\"button\" id=\"shapeCircBtn\" class=\"shape-btn\" style=\"padding:0.6rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:8px;font-weight:600;cursor:pointer;\">Circular (Firepit / Ring)</button>\n        </div>\n      </div>\n\n      <!-- RECTANGULAR INPUTS -->\n      <div id=\"rectInputs\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"gravelLength\">Length (Feet)</label>\n          <input type=\"number\" id=\"gravelLength\" value=\"50\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"gravelWidth\">Width (Feet)</label>\n          <input type=\"number\" id=\"gravelWidth\" value=\"12\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n      </div>\n\n      <!-- CIRCULAR INPUT -->\n      <div id=\"circInputs\" style=\"display:none;margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"gravelDiameter\">Diameter (Feet)</label>\n        <input type=\"number\" id=\"gravelDiameter\" value=\"16\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n      </div>\n\n      <!-- DEPTH -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"gravelDepth\">Finished Compacted Depth (Inches)</label>\n        <div style=\"display:grid;grid-template-columns:2fr 1fr;gap:0.75rem;\">\n          <input type=\"number\" id=\"gravelDepth\" value=\"4\" min=\"0.5\" max=\"36\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n          <select id=\"quickDepth\" style=\"padding:0.65rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.85rem;\">\n            <option value=\"2\">2\" (Walkway)</option>\n            <option value=\"4\" selected>4\" (Sub-base)</option>\n            <option value=\"6\">6\" (Driveway)</option>\n            <option value=\"8\">8\" (Heavy Road)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- AGGREGATE TYPE & DENSITY -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"gravelType\">Aggregate Material & Density</label>\n        <select id=\"gravelType\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"1.40\" selected>#57 Crushed Stone (Drainage / Driveway Top) — 1.40 tons/yd³</option>\n          <option value=\"1.55\">Crusher Run / Dense Grade / 21A (With Stone Dust) — 1.55 tons/yd³</option>\n          <option value=\"1.35\">Pea Gravel (Rounded 3/8\" River Rock) — 1.35 tons/yd³</option>\n          <option value=\"1.45\">Decomposed Granite (Walkways & Paths) — 1.45 tons/yd³</option>\n          <option value=\"1.30\">Riprap / Surge Stone (#1 Ballast 3\"-5\") — 1.30 tons/yd³</option>\n        </select>\n      </div>\n\n      <!-- COMPACTION & LOSS FACTOR -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"compactionFactor\">Compaction Shrinkage</label>\n          <select id=\"compactionFactor\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"0.05\">Clean Stone / Uncompacted (5%)</option>\n            <option value=\"0.15\" selected>Standard Plate Compaction (15%)</option>\n            <option value=\"0.20\">Heavy Roller / Base Course (20%)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wasteAllowance\">Subgrade Waste / Margin</label>\n          <select id=\"wasteAllowance\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"0.05\">Firm Dry Grade (5% Waste)</option>\n            <option value=\"0.10\" selected>Standard Subgrade (10% Waste)</option>\n            <option value=\"0.15\">Soft Soil / Uneven Mud (15% Waste)</option>\n          </select>\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"1\" y=\"3\" width=\"15\" height=\"13\"/><polygon points=\"16 8 20 8 23 11 23 16 16 16 16 8\"/><circle cx=\"5.5\" cy=\"18.5\" r=\"2.5\"/><circle cx=\"18.5\" cy=\"18.5\" r=\"2.5\"/></svg>\n            Tonnage & Quarry Takeoff\n          </h2>\n          <button id=\"copyGravelBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Weight (US Tons)</span>\n            <span id=\"gravelTotalTons\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">13.4 Tons</span>\n            <span id=\"gravelTotalLbs\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">26,800 lbs</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Volume to Order (yd³)</span>\n            <span id=\"gravelCuYds\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">9.3 yd³</span>\n            <span id=\"gravelCuFt\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">251 cu ft (7.1 m³)</span>\n          </div>\n        </div>\n\n        <!-- LOGISTICS & TRUCKLOAD BREAKDOWN -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Delivery Logistics & Truck Sizing</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Standard Tandem Dump Truck (~12 Tons):</span>\n            <strong id=\"tandemTrucksCount\" style=\"font-family:var(--mono);color:var(--fg);\">2 Loads</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Tri-Axle Commercial Dump Truck (~18 Tons):</span>\n            <strong id=\"triAxleTrucksCount\" style=\"font-family:var(--mono);color:var(--fg);\">1 Load</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>50-lb Retail Bags (DIY Alternative):</span>\n            <strong id=\"bags50lbCount\" style=\"font-family:var(--mono);color:var(--fg);\">536 Bags</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Woven Geotextile Fabric (Underlayment):</span>\n            <strong id=\"geotextileSqFt\" style=\"font-family:var(--mono);color:#10b981;\">660 sq ft (incl. 10% lap)</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG CROSS-SECTION SCHEMATIC -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"4\" y1=\"21\" x2=\"4\" y2=\"14\"/><line x1=\"4\" y1=\"10\" x2=\"4\" y2=\"3\"/><line x1=\"12\" y1=\"21\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"3\"/><line x1=\"20\" y1=\"21\" x2=\"20\" y2=\"16\"/><line x1=\"20\" y1=\"12\" x2=\"20\" y2=\"3\"/><line x1=\"1\" y1=\"14\" x2=\"7\" y2=\"14\"/><line x1=\"9\" y1=\"8\" x2=\"15\" y2=\"8\"/><line x1=\"17\" y1=\"16\" x2=\"23\" y2=\"16\"/></svg>\n      Subgrade, Geotextile & Compacted Aggregate Strata\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Cross-sectional representation showing the mechanical compaction allowance, stabilized subgrade, and recommended geotextile barrier preventing sub-base mud migration.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"gravelStrataSvg\" viewBox=\"0 0 800 240\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & CIVIL ENGINEERING DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Gravel Tonnage & Compaction Formulas</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Quarries sell aggregate by weight (US short tons = 2,000 lbs), while construction blueprints specify loose cubic volume and compacted in-place depth. Converting geometric volume to quarry purchase tonnage requires accounting for in-situ bulk density $\\rho$, mechanical vibratory compaction shrinkage $C_f$, and subgrade interlock waste $W_f$:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Geometric Loose Volume (Cubic Yards):</strong><br>\n      V_{\\text{loose}} = \\frac{\\text{Surface Area (sq ft)} \\times \\left( \\frac{\\text{Depth (inches)}}{12} \\right)}{27}<br><br>\n      <strong>2. Factored Order Volume with Compaction & Subgrade Allowance:</strong><br>\n      V_{\\text{order}} = V_{\\text{loose}} \\times (1 + C_f) \\times (1 + W_f)<br>\n      \\text{Where } C_f = 0.15 \\text{ for plate-compacted crusher run, and } W_f = 0.10 \\text{ on native subgrade.}<br><br>\n      <strong>3. Total Tonnage Conversion:</strong><br>\n      \\text{Tons} = V_{\\text{order}} \\times \\rho_{\\text{aggregate}} \\quad \\text{where } \\rho \\in [1.30, 1.55] \\text{ tons/yd}^3<br><br>\n      <strong>4. Dump Truck Load Sizing:</strong><br>\n      N_{\\text{Tandem}} = \\left\\lceil \\frac{\\text{Tons}}{12} \\right\\rceil, \\quad N_{\\text{Tri-Axle}} = \\left\\lceil \\frac{\\text{Tons}}{18} \\right\\rceil\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL GRAVEL TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Gravel Driveway & Drainage Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Dumping Gravel Directly onto Mud Without Geotextile</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Aggregate has high compressive strength but zero tensile strength. Vehicle axle loads push coarse gravel downward while soil pumps upward into the voids. Within two wet seasons, 50% of your gravel will disappear into subsoil mud. Always install a heavy-duty <strong>woven geotextile fabric</strong> beneath driveway base stone.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Using Rounded Pea Gravel on Vehicular Driveways</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Pea gravel consists of smooth, water-worn stones with zero angular edges. Under vehicle tires, pea gravel acts like ball bearings—it shifts laterally, forms ruts, and prevents tires from achieving traction. Driveways require angular, crushed aggregate (#57 or Crusher Run) whose sharp fractured faces mechanically interlock.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Ignoring Mechanical Compaction Shrinkage</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Crusher Run / DGA contains fine stone dust that fills voids between larger 3/4\" stones. When compacted with a heavy reversible plate compactor or vibratory roller, the in-place volume decreases by 15% to 20%. Ordering exact loose volume results in an installed depth 1 to 2 inches too thin.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Failing to Crown the Center of the Roadway</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          A flat gravel driveway is doomed to develop potholes. Standing water softens the aggregate matrix, allowing traffic tires to scour out stone dust. Grade the center with a 1/2\" per foot crown slope (a 12-ft driveway should be 3 inches higher at the center crown than at the edges) to shed runoff into side swales.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Woven vs Non-Woven Fabric Misapplication</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Woven geotextile offers high tensile separation and load distribution, making it perfect for driveways and road bases, but has a low water flow rate. Non-woven needle-punched geotextile (felt-like) has high permeability and is mandatory for French drains and dry wells. Installing woven fabric in a French drain will cause it to clog and flood.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var currentShape = 'rect';\n\n      function calcGravel() {\n        var area = 0;\n        if (currentShape === 'rect') {\n          var len = parseFloat(document.getElementById('gravelLength').value) || 0;\n          var wid = parseFloat(document.getElementById('gravelWidth').value) || 0;\n          area = len * wid;\n        } else {\n          var diam = parseFloat(document.getElementById('gravelDiameter').value) || 0;\n          var r = diam / 2;\n          area = Math.PI * r * r;\n        }\n\n        var depthInches = parseFloat(document.getElementById('gravelDepth').value) || 0;\n        var densityTonsPerYd = parseFloat(document.getElementById('gravelType').value) || 1.4;\n        var compactionRate = parseFloat(document.getElementById('compactionFactor').value) || 0.15;\n        var wasteRate = parseFloat(document.getElementById('wasteAllowance').value) || 0.10;\n\n        // Base geometric cubic volume\n        var baseCuFt = area * (depthInches / 12);\n        var baseCuYds = baseCuFt / 27;\n\n        // Factored volume\n        var factoredCuYds = baseCuYds * (1 + compactionRate) * (1 + wasteRate);\n        var factoredCuFt = factoredCuYds * 27;\n        var cuMeters = factoredCuFt * 0.0283168;\n\n        // Total weight\n        var totalTons = factoredCuYds * densityTonsPerYd;\n        var totalLbs = totalTons * 2000;\n\n        // Logistics\n        var tandemLoads = Math.max(1, Math.ceil(totalTons / 12));\n        var triAxleLoads = Math.max(1, Math.ceil(totalTons / 18));\n        var bags50 = Math.ceil(totalLbs / 50);\n        var geotextileNeeded = Math.ceil(area * 1.10);\n\n        // Update DOM\n        document.getElementById('gravelTotalTons').textContent = totalTons.toFixed(1) + ' Tons';\n        document.getElementById('gravelTotalLbs').textContent = Math.round(totalLbs).toLocaleString() + ' lbs';\n        document.getElementById('gravelCuYds').textContent = factoredCuYds.toFixed(1) + ' yd³';\n        document.getElementById('gravelCuFt').textContent = Math.round(factoredCuFt) + ' cu ft (' + cuMeters.toFixed(1) + ' m³)';\n\n        document.getElementById('tandemTrucksCount').textContent = tandemLoads + ' Load' + (tandemLoads > 1 ? 's' : '');\n        document.getElementById('triAxleTrucksCount').textContent = triAxleLoads + ' Load' + (triAxleLoads > 1 ? 's' : '');\n        document.getElementById('bags50lbCount').textContent = bags50.toLocaleString() + ' Bags';\n        document.getElementById('geotextileSqFt').textContent = geotextileNeeded.toLocaleString() + ' sq ft (incl. 10% lap)';\n\n        renderStrataSvg(depthInches, compactionRate);\n      }\n\n      function renderStrataSvg(depth, compaction) {\n        var svg = document.getElementById('gravelStrataSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n\n        // Native Subgrade Base\n        svgHtml += '<rect x=\"60\" y=\"140\" width=\"680\" height=\"70\" fill=\"#78716c\" opacity=\"0.45\" rx=\"3\"/>';\n        svgHtml += '<text x=\"75\" y=\"178\" fill=\"var(--fg)\" font-size=\"12\" font-weight=\"bold\">Native Subsoil Subgrade (Compacted & Proof-Rolled)</text>';\n\n        // Geotextile Membrane Line\n        svgHtml += '<line x1=\"60\" y1=\"138\" x2=\"740\" y2=\"138\" stroke=\"#10b981\" stroke-width=\"4\" stroke-dasharray=\"10,4\"/>';\n        svgHtml += '<text x=\"75\" y=\"132\" fill=\"#10b981\" font-size=\"11\" font-weight=\"bold\">Woven Geotextile Separation Fabric (Prevents Mud Pumping)</text>';\n\n        // Gravel Course Layer\n        svgHtml += '<rect x=\"60\" y=\"45\" width=\"680\" height=\"90\" fill=\"#94a3b8\" opacity=\"0.8\" rx=\"4\"/>';\n        svgHtml += '<text x=\"75\" y=\"80\" fill=\"#ffffff\" font-size=\"14\" font-weight=\"bold\">Compacted Crushed Stone / DGA Course (' + depth + '\" Finished Depth)</text>';\n\n        // Gravel texture dots\n        for (var i = 0; i < 40; i++) {\n          var cx = 80 + (i * 16.5);\n          var cy = 95 + ((i % 3) * 8);\n          svgHtml += '<circle cx=\"' + cx + '\" cy=\"' + cy + '\" r=\"2.5\" fill=\"#e2e8f0\" opacity=\"0.6\"/>';\n        }\n\n        // Compaction arrow indicator\n        svgHtml += '<line x1=\"755\" y1=\"45\" x2=\"755\" y2=\"135\" stroke=\"#3b82f6\" stroke-width=\"2\"/>';\n        svgHtml += '<line x1=\"750\" y1=\"45\" x2=\"760\" y2=\"45\" stroke=\"#3b82f6\" stroke-width=\"2\"/>';\n        svgHtml += '<line x1=\"750\" y1=\"135\" x2=\"760\" y2=\"135\" stroke=\"#3b82f6\" stroke-width=\"2\"/>';\n        svgHtml += '<text x=\"768\" y=\"94\" fill=\"#3b82f6\" font-size=\"12\" font-weight=\"bold\">' + depth + '\"</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyGravelTakeoff() {\n        var tons = document.getElementById('gravelTotalTons').textContent;\n        var lbs = document.getElementById('gravelTotalLbs').textContent;\n        var yds = document.getElementById('gravelCuYds').textContent;\n        var cuft = document.getElementById('gravelCuFt').textContent;\n        var tandem = document.getElementById('tandemTrucksCount').textContent;\n        var tri = document.getElementById('triAxleTrucksCount').textContent;\n        var bags = document.getElementById('bags50lbCount').textContent;\n        var fabric = document.getElementById('geotextileSqFt').textContent;\n        var typeText = document.getElementById('gravelType').options[document.getElementById('gravelType').selectedIndex].text;\n\n        var text = '📋 Quarry Gravel & Crushed Stone Order Sheet\\n' +\n          '• Aggregate Type: ' + typeText + '\\n' +\n          '• Total Tonnage: ' + tons + ' (' + lbs + ')\\n' +\n          '• Factored Volume: ' + yds + ' (' + cuft + ')\\n' +\n          '• Tandem Dump Trucks (~12T): ' + tandem + '\\n' +\n          '• Tri-Axle Dump Trucks (~18T): ' + tri + '\\n' +\n          '• 50 lb Bagged Equivalent: ' + bags + '\\n' +\n          '• Woven Geotextile Fabric: ' + fabric + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/gravel-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyGravelBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      // Shape toggles\n      document.getElementById('shapeRectBtn').addEventListener('click', function() {\n        currentShape = 'rect';\n        document.getElementById('shapeRectBtn').style.background = '#3b82f6';\n        document.getElementById('shapeRectBtn').style.color = '#ffffff';\n        document.getElementById('shapeRectBtn').style.borderColor = '#3b82f6';\n        document.getElementById('shapeCircBtn').style.background = 'var(--bg)';\n        document.getElementById('shapeCircBtn').style.color = 'var(--fg)';\n        document.getElementById('shapeCircBtn').style.borderColor = 'var(--border)';\n        document.getElementById('rectInputs').style.display = 'grid';\n        document.getElementById('circInputs').style.display = 'none';\n        calcGravel();\n      });\n\n      document.getElementById('shapeCircBtn').addEventListener('click', function() {\n        currentShape = 'circ';\n        document.getElementById('shapeCircBtn').style.background = '#3b82f6';\n        document.getElementById('shapeCircBtn').style.color = '#ffffff';\n        document.getElementById('shapeCircBtn').style.borderColor = '#3b82f6';\n        document.getElementById('shapeRectBtn').style.background = 'var(--bg)';\n        document.getElementById('shapeRectBtn').style.color = 'var(--fg)';\n        document.getElementById('shapeRectBtn').style.borderColor = 'var(--border)';\n        document.getElementById('rectInputs').style.display = 'none';\n        document.getElementById('circInputs').style.display = 'block';\n        calcGravel();\n      });\n\n      document.getElementById('quickDepth').addEventListener('change', function() {\n        document.getElementById('gravelDepth').value = this.value;\n        calcGravel();\n      });\n\n      var inputs = ['gravelLength', 'gravelWidth', 'gravelDiameter', 'gravelDepth', 'gravelType', 'compactionFactor', 'wasteAllowance'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcGravel);\n          el.addEventListener('change', calcGravel);\n        }\n      });\n\n      document.getElementById('copyGravelBtn').addEventListener('click', copyGravelTakeoff);\n\n      calcGravel();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'gravel-calculator.html'), renderTradePage({
    title: "Gravel Calculator — Crushed Stone, Tonnage & Base Depth | Digital Tools Shed",
    metaDesc: "Free contractor-grade gravel and crushed stone calculator. Computes exact cubic yards, tons, compaction shrinkage, and truckloads for driveways, French drains, and patio sub-bases.",
    canonical: `${DOMAIN}/calc/gravel-calculator`,
    bodyContent: gravelBody,
    currentPath: '/calc/gravel-calculator',
    faq: [
  {
    "q": "How many tons of gravel are in one cubic yard?",
    "a": "On average, one cubic yard of gravel weighs between 1.35 and 1.55 US short tons (2,700 to 3,100 lbs). Dense graded aggregate with stone dust (crusher run) weighs ~1.55 tons per yard, while clean washed #57 stone weighs ~1.40 tons per yard."
  },
  {
    "q": "What is the best depth of gravel for a residential driveway?",
    "a": "A residential driveway should have a total aggregate depth of 6 to 8 inches: a 4 to 6-inch base layer of compacted dense-graded aggregate (Crusher Run or 21A) over geotextile fabric, topped with a 2-inch wearing surface of angular #57 crushed stone."
  },
  {
    "q": "How much does crushed stone shrink when compacted?",
    "a": "Dense graded aggregate (crusher run or road base) compacts by approximately 15% to 20% when rolled or tamped with a vibratory plate compactor. Clean, open-graded gravel without fines compacts by only 3% to 5%."
  },
  {
    "q": "Why is woven geotextile fabric recommended under gravel driveways?",
    "a": "Woven geotextile fabric acts as a high-tensile separation membrane that prevents heavy vehicle tires from driving the stone into soft subsoil mud while stopping clay and silt from migrating upward into the stone voids."
  },
  {
    "q": "How much gravel can a standard dump truck haul?",
    "a": "A standard tandem-axle dump truck can legally haul approximately 10 to 12 tons (about 7 to 9 cubic yards). A larger tri-axle commercial dump truck can carry 16 to 18 tons (about 11 to 13 cubic yards)."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. PAINT GALLONS ESTIMATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const paintBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Paint Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Interior & Exterior Paint Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate exact paint gallons and quarts for interior rooms, ceilings, and baseboard trim. Automatically handles 1 vs 2 coat coverage, surface porosity (smooth drywall vs unprimed plaster/stucco), and opening deductions with a complete materials order list.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 11V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7\"/><path d=\"M5 11h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V11z\"/></svg>\n        Room Dimensions & Coats\n      </h2>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"paintRoomLen\">Length (Feet)</label>\n          <input type=\"number\" id=\"paintRoomLen\" value=\"16\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"paintRoomWid\">Width (Feet)</label>\n          <input type=\"number\" id=\"paintRoomWid\" value=\"12\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"paintWallHeight\">Ceiling Height</label>\n          <select id=\"paintWallHeight\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"8\" selected>8 Ft (Standard)</option>\n            <option value=\"9\">9 Ft (Modern)</option>\n            <option value=\"10\">10 Ft (High Ceiling)</option>\n            <option value=\"12\">12 Ft (Vaulted)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"paintNumCoats\">Number of Wall Coats</label>\n          <select id=\"paintNumCoats\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"2\" selected>2 Coats (Recommended)</option>\n            <option value=\"1\">1 Coat (Same Color Refresh)</option>\n            <option value=\"3\">3 Coats (Drastic Color Change)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- CEILING & TRIM TOGGLES -->\n      <div style=\"margin-bottom:1.25rem;display:flex;flex-direction:column;gap:0.5rem;\">\n        <label style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;cursor:pointer;\">\n          <input type=\"checkbox\" id=\"includeCeilingPaint\" checked style=\"accent-color:var(--fg);\">\n          <span>Include Ceiling Paint (Separate Flat White)</span>\n        </label>\n        <label style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;cursor:pointer;\">\n          <input type=\"checkbox\" id=\"includeTrimPaint\" checked style=\"accent-color:var(--fg);\">\n          <span>Include Baseboard & Door Trim (Semi-Gloss)</span>\n        </label>\n      </div>\n\n      <!-- OPENINGS DEDUCTIONS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"paintDoorCount\">Doors (Subtract 21 sq ft)</label>\n          <input type=\"number\" id=\"paintDoorCount\" value=\"2\" min=\"0\" max=\"10\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"paintWinCount\">Windows (Subtract 15 sq ft)</label>\n          <input type=\"number\" id=\"paintWinCount\" value=\"2\" min=\"0\" max=\"15\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n        </div>\n      </div>\n\n      <div>\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"surfacePorosity\">Surface Texture / Porosity</label>\n        <select id=\"surfacePorosity\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"375\" selected>Smooth Primed Drywall (375 sq ft / gal)</option>\n          <option value=\"300\">Textured / Porous Drywall (300 sq ft / gal)</option>\n          <option value=\"250\">Rough Masonry / Stucco (250 sq ft / gal)</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- SUMMARY & MATERIALS COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/></svg>\n            Paint Order Takeoff\n          </h2>\n          <button id=\"copyPaintBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Order Sheet</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Wall Paint Needed</span>\n            <span id=\"wallPaintGallons\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">2 Gallons</span>\n            <span id=\"wallPaintSqFt\" style=\"font-size:0.8rem;color:#3b82f6;font-weight:600;\">376 sq ft net wall area</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Ceiling Paint</span>\n            <span id=\"ceilingPaintGallons\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">1 Gallon</span>\n            <span id=\"ceilingSqFtLabel\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">192 sq ft ceiling area</span>\n          </div>\n        </div>\n\n        <!-- BREAKDOWN LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Materials Specification List</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Wall Paint (Eggshell / Satin):</span>\n            <strong id=\"wallPaintSpec\" style=\"font-family:var(--mono);color:#3b82f6;\">2 Gallons (2 Coats)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Ceiling Paint (Flat White):</span>\n            <strong id=\"ceilingPaintSpec\" style=\"font-family:var(--mono);color:var(--fg);\">1 Gallon (1-2 Coats)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Trim & Baseboard (Semi-Gloss):</span>\n            <strong id=\"trimPaintSpec\" style=\"font-family:var(--mono);color:#10b981;\">1 Quart (56 linear ft)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Painter's Tape (1.88\" Rolls):</span>\n            <strong id=\"paintersTapeRolls\" style=\"font-family:var(--mono);color:var(--fg);\">2 Rolls (60 yd)</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG COLOR & PALETTE SCHEMATIC -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Room Elevation & Finish Sheen Guide</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Visual finish zoning: Flat on ceilings (hides imperfections), Satin/Eggshell on walls (washable balance), and Semi-Gloss on trim (moisture & scuff resistant).\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"paintElevationSvg\" viewBox=\"0 0 800 240\" style=\"width:100%;height:auto;min-width:550px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & COVERAGE DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Paint Coverage Formulas & Spreading Rate Constants</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Paint coverage is governed by dry film thickness (DFT) and wet film thickness (WFT) spreading rates. One gallon of standard latex paint contains $231 \\text{ cubic inches}$ of liquid. At an industry standard spreading rate of $350 - 400 \\text{ sq ft/gallon}$, each coat dries to a thickness of approximately $1.5 - 2.0 \\text{ mils}$ ($0.0015''$).\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Net Wall Surface Area:</strong><br>\n      A_{\\text{walls}} = \\Big[ 2 \\times (L + W) \\times H \\Big] - \\Big[ (21 \\times N_{\\text{doors}}) + (15 \\times N_{\\text{windows}}) \\Big]<br><br>\n      <strong>2. Wall Paint Gallons Needed:</strong><br>\n      G_{\\text{walls}} = \\left\\lceil \\frac{A_{\\text{walls}} \\times N_{\\text{coats}}}{\\text{Spreading Rate (e.g. 375 sq ft/gal)}} \\right\\rceil<br><br>\n      <strong>3. Ceiling Paint Gallons:</strong><br>\n      G_{\\text{ceiling}} = \\left\\lceil \\frac{L \\times W}{375} \\right\\rceil<br><br>\n      <strong>4. Trim & Casing Linear Footage:</strong><br>\n      \\text{LF}_{\\text{trim}} = 2 \\times (L + W) + (17 \\times N_{\\text{doors}}) + (16 \\times N_{\\text{windows}})<br>\n      \\text{Trim Coverage} \\approx 1 \\text{ quart per } 120 \\text{ linear feet}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL PAINTING TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Painting & Surface Prep Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. The \"Paint + Primer in One\" False Promise</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          \"Paint and Primer\" products are simply higher-solid paints, NOT true primers. Applying them directly over raw drywall mud or bare plaster causes \"flashing\" (dull spots where porous gypsum sucks moisture out of the paint). Raw drywall always requires a dedicated PVA drywall sealer.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Premature Second Coat Application</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          While latex paint feels dry to the touch in 1 hour, chemical coalescing takes at least 4 hours. Rolling a second coat too early re-wets the partially cured undercoat, pulling it off the wall on the roller cover and creating rough, permanent orange-peel lumps.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Wrong Roller Nap Thickness for Surface Texture</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Using a 1/2\" or 3/4\" thick roller nap on smooth drywall leaves heavy stipple texture that ruins smooth finishes. Conversely, using a 3/8\" short nap on textured walls or masonry skips valleys and leaves microscopic pinholes that expose bare primer.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Flat Sheen in Bathrooms and Kitchens</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Flat paint has zero resin sheen barrier, making it porous and vulnerable to water absorption. When applied in high-humidity bathrooms, steam penetrates the paint film, nourishing mildew and causing surfactant leaching (brown oily streaks). Bathrooms require Satin or Semi-Gloss.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Leaving Painter's Tape on Too Long</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Standard blue painter's tape cures and hardens over time. If left on baseboards or trim for more than 48 hours—or if removed after paint has completely dried into a rubbery plastic film—pulling the tape tears the cured wall paint right off the sheetrock. Remove tape while the final coat is still damp.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcPaint() {\n        var len = parseFloat(document.getElementById('paintRoomLen').value) || 0;\n        var wid = parseFloat(document.getElementById('paintRoomWid').value) || 0;\n        var h = parseFloat(document.getElementById('paintWallHeight').value) || 8;\n        var coats = parseInt(document.getElementById('paintNumCoats').value) || 2;\n        var incCeil = document.getElementById('includeCeilingPaint').checked;\n        var incTrim = document.getElementById('includeTrimPaint').checked;\n        var doors = parseInt(document.getElementById('paintDoorCount').value) || 0;\n        var wins = parseInt(document.getElementById('paintWinCount').value) || 0;\n        var spreadRate = parseFloat(document.getElementById('surfacePorosity').value) || 375;\n\n        var grossWallSqFt = 2 * (len + wid) * h;\n        var deductions = (doors * 21) + (wins * 15);\n        var netWallSqFt = Math.max(0, grossWallSqFt - deductions);\n\n        var totalWallAreaCovered = netWallSqFt * coats;\n        var wallGallons = Math.max(1, Math.ceil(totalWallAreaCovered / spreadRate));\n\n        var ceilSqFt = incCeil ? (len * wid) : 0;\n        var ceilGallons = incCeil ? Math.max(1, Math.ceil(ceilSqFt / spreadRate)) : 0;\n\n        var perimeter = 2 * (len + wid);\n        var trimLinearFt = perimeter + (doors * 17) + (wins * 16);\n        var trimQuarts = incTrim ? Math.max(1, Math.ceil(trimLinearFt / 120)) : 0;\n\n        var tapeRolls = Math.max(1, Math.ceil(perimeter / 180));\n\n        // Update DOM\n        document.getElementById('wallPaintGallons').textContent = wallGallons + ' Gallon' + (wallGallons > 1 ? 's' : '');\n        document.getElementById('wallPaintSqFt').textContent = Math.round(netWallSqFt) + ' sq ft (' + coats + ' coats = ' + Math.round(totalWallAreaCovered) + ' sq ft)';\n\n        document.getElementById('ceilingPaintGallons').textContent = incCeil ? (ceilGallons + ' Gallon' + (ceilGallons > 1 ? 's' : '')) : 'None';\n        document.getElementById('ceilingSqFtLabel').textContent = incCeil ? (Math.round(ceilSqFt) + ' sq ft ceiling area') : 'Ceiling excluded';\n\n        document.getElementById('wallPaintSpec').textContent = wallGallons + ' Gallon' + (wallGallons > 1 ? 's' : '') + ' (' + coats + ' Coats)';\n        document.getElementById('ceilingPaintSpec').textContent = incCeil ? (ceilGallons + ' Gallon' + (ceilGallons > 1 ? 's' : '')) : 'Excluded';\n        document.getElementById('trimPaintSpec').textContent = incTrim ? (trimQuarts + ' Quart' + (trimQuarts > 1 ? 's' : '') + ' (~' + Math.round(trimLinearFt) + ' linear ft)') : 'Excluded';\n        document.getElementById('paintersTapeRolls').textContent = tapeRolls + ' Roll' + (tapeRolls > 1 ? 's' : '') + ' (60 yd)';\n\n        renderElevation(incCeil, incTrim);\n      }\n\n      function renderElevation(incCeil, incTrim) {\n        var svg = document.getElementById('paintElevationSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var startX = 60;\n        var startY = 30;\n        var wallW = 680;\n        var wallH = 160;\n\n        // Ceiling strip\n        if (incCeil) {\n          svgHtml += '<rect x=\"' + startX + '\" y=\"' + (startY - 15) + '\" width=\"' + wallW + '\" height=\"15\" fill=\"#f8fafc\" stroke=\"var(--border)\" stroke-width=\"1.5\"/>';\n          svgHtml += '<text x=\"' + (startX + wallW/2) + '\" y=\"' + (startY - 4) + '\" fill=\"#64748b\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"middle\">Flat Ceiling Paint (Zero Glare Sheen)</text>';\n        }\n\n        // Wall Body\n        svgHtml += '<rect x=\"' + startX + '\" y=\"' + startY + '\" width=\"' + wallW + '\" height=\"' + wallH + '\" fill=\"#e0e7ff\" stroke=\"var(--border)\" stroke-width=\"2\"/>';\n        svgHtml += '<text x=\"' + (startX + wallW/2) + '\" y=\"' + (startY + wallH/2) + '\" fill=\"#4338ca\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">Wall Field (Eggshell / Satin Washable Latex)</text>';\n\n        // Door\n        var doorX = startX + 100;\n        var doorW = 70;\n        var doorH = 120;\n        var doorY = startY + wallH - doorH;\n        svgHtml += '<rect x=\"' + doorX + '\" y=\"' + doorY + '\" width=\"' + doorW + '\" height=\"' + doorH + '\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"2\"/>';\n        svgHtml += '<text x=\"' + (doorX + doorW/2) + '\" y=\"' + (doorY + doorH/2) + '\" fill=\"#64748b\" font-size=\"10\" text-anchor=\"middle\">Door</text>';\n\n        // Window\n        var winX = startX + 420;\n        var winW = 90;\n        var winH = 70;\n        var winY = startY + 35;\n        svgHtml += '<rect x=\"' + winX + '\" y=\"' + winY + '\" width=\"' + winW + '\" height=\"' + winH + '\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"2\"/>';\n        svgHtml += '<text x=\"' + (winX + winW/2) + '\" y=\"' + (winY + winH/2) + '\" fill=\"#64748b\" font-size=\"10\" text-anchor=\"middle\">Window</text>';\n\n        // Baseboard Trim\n        if (incTrim) {\n          svgHtml += '<rect x=\"' + startX + '\" y=\"' + (startY + wallH - 8) + '\" width=\"' + wallW + '\" height=\"8\" fill=\"#10b981\"/>';\n          svgHtml += '<text x=\"' + (startX + wallW - 100) + '\" y=\"' + (startY + wallH + 18) + '\" fill=\"#10b981\" font-size=\"10\" font-weight=\"bold\" text-anchor=\"end\">Semi-Gloss Baseboard</text>';\n        }\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyOrder() {\n        var walls = document.getElementById('wallPaintGallons').textContent;\n        var ceil = document.getElementById('ceilingPaintGallons').textContent;\n        var trim = document.getElementById('trimPaintSpec').textContent;\n        var tape = document.getElementById('paintersTapeRolls').textContent;\n        var net = document.getElementById('wallPaintSqFt').textContent;\n\n        var text = '🎨 Paint Material Takeoff & Order Sheet\\n' +\n          '• Wall Paint (Satin/Eggshell): ' + walls + ' (' + net + ')\\n' +\n          '• Ceiling Paint (Flat White): ' + ceil + '\\n' +\n          '• Trim & Baseboard (Semi-Gloss): ' + trim + '\\n' +\n          '• Painter\\'s Tape: ' + tape + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/paint-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyPaintBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Order Sheet!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['paintRoomLen', 'paintRoomWid', 'paintWallHeight', 'paintNumCoats', 'includeCeilingPaint', 'includeTrimPaint', 'paintDoorCount', 'paintWinCount', 'surfacePorosity'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcPaint);\n          el.addEventListener('change', calcPaint);\n        }\n      });\n\n      document.getElementById('copyPaintBtn').addEventListener('click', copyOrder);\n\n      calcPaint();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'paint-calculator.html'), renderTradePage({
    title: "Paint Calculator: Gallons for Walls, Ceiling, Trim & Primer (1 or 2 Coats) | Digital Tools Shed",
    metaDesc: "Calculate exact paint gallons for any room or house exterior. Accurately accounts for wall square footage, ceiling coats, trim/baseboards, door/window deductions, and primer porosity.",
    canonical: `${DOMAIN}/calc/paint-calculator`,
    bodyContent: paintBody,
    currentPath: '/calc/paint-calculator',
    faq: [
  {
    "q": "How many gallons of paint do I need for a 12x12 room?",
    "a": "A standard 12x12 foot room with 8-foot ceilings has approximately 384 square feet of wall area. Deducting one door and one window leaves about 348 square feet of paintable surface. One gallon of quality paint covers ~350 to 400 sq ft for a single coat; applying two recommended coats requires exactly 2 gallons of wall paint."
  },
  {
    "q": "Why should ceiling paint be flat while wall paint is satin or eggshell?",
    "a": "Ceilings should always use flat paint because flat sheen has zero light reflectivity, hiding drywall seams, tape ripples, and ceiling joist imperfections. Walls experience scuffs and fingerprints, requiring an eggshell or satin sheen that can be wiped clean with a damp sponge without damaging the finish."
  },
  {
    "q": "Do I really need two coats of paint if using primer?",
    "a": "Yes. While the primer seals the porous drywall and creates uniform adhesion, a single coat of finish paint rarely provides true color depth or uniform dry film thickness (DFT). Two coats guarantee complete opacity, true pigment resonance, and long-term durability."
  },
  {
    "q": "How much paint does one door or window subtract from the estimate?",
    "a": "Standard interior doors ($3\\text{ ft} \\times 6.8\\text{ ft}$) deduct approximately 21 square feet each. Standard residential windows ($3\\text{ ft} \\times 5\\text{ ft}$) deduct approximately 15 square feet each. Always subtract openings to avoid buying unneeded extra gallons."
  },
  {
    "q": "When should painter's tape be removed after painting a room?",
    "a": "Painter's tape should be removed while the final coat is still slightly damp (roughly 30 to 60 minutes after rolling). If you wait until the paint completely cures into a hard rubbery plastic layer, peeling the tape will tear the fresh paint film right off the wall."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. TILE & GROUT ESTIMATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const tileBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Tile Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Floor & Wall Tile, Grout & Mortar Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate exact tile counts, retail box quantities, 25 lb grout bags, and thin-set mortar for bathroom floors, kitchen backsplashes, and walk-in showers. Automatically factors in cutting waste by installation pattern: straight grid, offset subway, diagonal, or herringbone.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\"/></svg>\n        Tiling Area & Dimensions\n      </h2>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"tileRoomLen\">Length (Feet)</label>\n          <input type=\"number\" id=\"tileRoomLen\" value=\"12\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"tileRoomWid\">Width (Feet)</label>\n          <input type=\"number\" id=\"tileRoomWid\" value=\"10\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"tileSizePreset\">Tile Size (Inches)</label>\n          <select id=\"tileSizePreset\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"12x24\" selected>12\" x 24\" (2.0 sq ft — Modern Floor)</option>\n            <option value=\"12x12\">12\" x 12\" (1.0 sq ft — Standard)</option>\n            <option value=\"6x24\">6\" x 24\" (1.0 sq ft — Wood Look Plank)</option>\n            <option value=\"3x6\">3\" x 6\" (0.125 sq ft — Subway Tile)</option>\n            <option value=\"24x24\">24\" x 24\" (4.0 sq ft — Large Format)</option>\n            <option value=\"4x4\">4\" x 4\" (0.111 sq ft — Classic Square)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"tilePattern\">Installation Pattern</label>\n          <select id=\"tilePattern\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"10\" selected>Straight Grid (10% Waste)</option>\n            <option value=\"12\">Running Bond / Offset (12% Waste)</option>\n            <option value=\"15\">Diagonal 45° Angle (15% Waste)</option>\n            <option value=\"20\">Herringbone / Chevron (20% Waste)</option>\n          </select>\n        </div>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"boxSqFt\">Box Size (Sq Ft / Box)</label>\n          <input type=\"number\" id=\"boxSqFt\" value=\"16\" min=\"1\" max=\"50\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:0.95rem;\">\n          <span style=\"font-size:0.72rem;color:var(--text-muted);display:block;margin-top:0.25rem;\">Typically 12 to 20 sq ft per box</span>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"groutJoint\">Grout Joint Width</label>\n          <select id=\"groutJoint\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"0.0625\">1/16\" (Rectified Porcelain)</option>\n            <option value=\"0.125\" selected>1/8\" (Standard Floor & Wall)</option>\n            <option value=\"0.1875\">3/16\" (Handmade / Irregular)</option>\n            <option value=\"0.25\">1/4\" (Quarry / Rustic)</option>\n          </select>\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg>\n            Tile Material Requirements\n          </h2>\n          <button id=\"copyTileBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Order List</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Boxes to Buy</span>\n            <span id=\"tileBoxesCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">9 Boxes</span>\n            <span id=\"totalTilesSingle\" style=\"font-size:0.8rem;color:#3b82f6;font-weight:600;\">66 individual tiles</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Gross Square Footage</span>\n            <span id=\"grossSqFtValue\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">132</span>\n            <span id=\"netSqFtLabel\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">120 net + 10% waste</span>\n          </div>\n        </div>\n\n        <!-- GROUT & MORTAR LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Sundries & Installation Supplies</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Grout (Sanded / Non-Sanded):</span>\n            <strong id=\"groutBagsVal\" style=\"font-family:var(--mono);color:#10b981;\">2 Bags (25 lb each)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Thin-Set Mortar:</span>\n            <strong id=\"mortarBagsVal\" style=\"font-family:var(--mono);color:var(--fg);\">3 Bags (50 lb each)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Recommended Trowel:</span>\n            <span id=\"trowelSpec\" style=\"font-family:var(--mono);color:var(--fg);font-weight:600;\">1/2\" x 1/2\" Square Notch</span>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Anti-Fracture Membrane:</span>\n            <span id=\"membraneSqFt\" style=\"font-family:var(--mono);color:var(--text-muted);\">120 sq ft roll (Ditra / RedGard)</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG PATTERN VISUALIZER -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Tile Geometry & Pattern Visualizer</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Vector bond simulation illustrating selected laying pattern (Straight Grid vs Offset vs Herringbone) and proportional joint width.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"tilePatternSvg\" viewBox=\"0 0 800 200\" style=\"width:100%;height:auto;min-width:550px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & GROUT DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Tile Geometry Formulas & Standard ANSI Grout Math</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Accurately forecasting tile consumption requires converting tile inches to square footage, applying pattern-specific cutting waste coefficients, and computing grout volume along linear seam perimeters.\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Tile Single Surface Area:</strong><br>\n      A_{\\text{tile}} = \\frac{W_{\\text{in}} \\times L_{\\text{in}}}{144} \\quad [\\text{sq ft}]<br><br>\n      <strong>2. Gross Surface Area with Waste:</strong><br>\n      A_{\\text{gross}} = (L_{\\text{room}} \\times W_{\\text{room}}) \\times (1 + \\frac{\\text{Waste}_{\\%}}{100})<br><br>\n      <strong>3. Box Quantity Calculation:</strong><br>\n      N_{\\text{boxes}} = \\left\\lceil \\frac{A_{\\text{gross}}}{\\text{Sq Ft Per Box}} \\right\\rceil, \\quad N_{\\text{tiles}} = \\left\\lceil \\frac{A_{\\text{gross}}}{A_{\\text{tile}}} \\right\\rceil<br><br>\n      <strong>4. Grout Bag Requirements (ANSI Standard):</strong><br>\n      \\text{Grout Weight (lbs)} = \\frac{(L_{\\text{in}} + W_{\\text{in}}) \\times T_{\\text{in}} \\times J_{\\text{in}} \\times 1.75}{L_{\\text{in}} \\times W_{\\text{in}}} \\times A_{\\text{net}}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL TILING TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Tiling & Substrate Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Subfloor Deflection Failure (L/360 Rule)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Ceramic and porcelain tile have zero tensile elasticity. If your plywood subfloor flexes more than the span divided by 360 under foot traffic ($L/720$ for natural stone), foot movement will crack grout lines within months and pop tiles off the mortar bed. Add a second layer of plywood or uncoupling membrane.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Swirling Trowel Ridges Instead of Parallel Lines</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Combing mortar in swirling circular motions traps pockets of air beneath the tile. When heavy objects drop on these hollow spots, the tile instantly shatters. ANSI standard mandates combing thin-set in straight, parallel ridges in one direction, then collapsing ridges by sliding the tile perpendicular.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. 50% Offset Lippage on Large-Format Tiles</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Tiles over 15 inches long (such as 12x24\" porcelain) always have a slight manufacturing crown (curvature) in the center. Installing them in a 50% brick offset places the highest point of one tile directly next to the lowest point of the adjacent tile, causing severe \"lippage\" (tripping edges). Never exceed a 33% offset.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Cement Board Is NOT Waterproof in Showers</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          HardieBacker and Durock cement boards do not rot when wet, but they are completely porous: water passes directly through them into wall framing. A true shower installation requires applying a continuous liquid waterproofing membrane (RedGard, Hydro Ban) or sheet membrane (Schluter Kerdi) over the board.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Grouting Perimeter Expansion Joints</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Hard grout should NEVER be installed at the perimeter where tile meets baseboards, bathtubs, or vertical walls. Natural thermal expansion requires a 1/4\" soft expansion gap filled with flexible color-matched silicone caulk. Grouting these changes of plane guarantees cracked, crumbling grout.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var PRESET_MAP = {\n        '12x24': { w: 12, l: 24, sqft: 2.0, trowel: '1/2\\\" x 1/2\\\" Square Notch' },\n        '12x12': { w: 12, l: 12, sqft: 1.0, trowel: '1/4\\\" x 3/8\\\" Square Notch' },\n        '6x24':  { w: 6,  l: 24, sqft: 1.0, trowel: '1/2\\\" x 1/2\\\" Square Notch' },\n        '3x6':   { w: 3,  l: 6,  sqft: 0.125, trowel: '1/4\\\" x 1/4\\\" Square Notch' },\n        '24x24': { w: 24, l: 24, sqft: 4.0, trowel: '1/2\\\" x 1/2\\\" Square Notch' },\n        '4x4':   { w: 4,  l: 4,  sqft: 0.111, trowel: '3/16\\\" V-Notch' }\n      };\n\n      function calcTiles() {\n        var len = parseFloat(document.getElementById('tileRoomLen').value) || 0;\n        var wid = parseFloat(document.getElementById('tileRoomWid').value) || 0;\n        var preset = document.getElementById('tileSizePreset').value;\n        var wastePct = parseFloat(document.getElementById('tilePattern').value) || 10;\n        var boxSqFt = parseFloat(document.getElementById('boxSqFt').value) || 16;\n        var joint = parseFloat(document.getElementById('groutJoint').value) || 0.125;\n\n        var netSqFt = len * wid;\n        var grossSqFt = netSqFt * (1 + (wastePct / 100));\n\n        var tileData = PRESET_MAP[preset];\n        var totalTiles = Math.ceil(grossSqFt / tileData.sqft);\n        var totalBoxes = Math.ceil(grossSqFt / boxSqFt);\n\n        // Grout calculation: ANSI formula\n        // Lbs = (L + W) * T * J * 1.75 / (L * W) * SqFt\n        var tileThick = 0.375; // standard 3/8\" tile thickness\n        var groutLbs = ((tileData.l + tileData.w) * tileThick * joint * 1.75 / (tileData.l * tileData.w)) * netSqFt;\n        var groutBags = Math.max(1, Math.ceil(groutLbs / 25));\n\n        // Thin-set mortar: approx 45-50 sq ft per 50 lb bag for large format, 70-80 for subway\n        var mortarCoveragePerBag = preset === '3x6' || preset === '4x4' ? 75 : 45;\n        var mortarBags = Math.max(1, Math.ceil(grossSqFt / mortarCoveragePerBag));\n\n        // Update DOM\n        document.getElementById('tileBoxesCount').textContent = totalBoxes + ' Box' + (totalBoxes > 1 ? 'es' : '');\n        document.getElementById('totalTilesSingle').textContent = totalTiles.toLocaleString() + ' individual tiles';\n        document.getElementById('grossSqFtValue').textContent = Math.round(grossSqFt);\n        document.getElementById('netSqFtLabel').textContent = Math.round(netSqFt) + ' net + ' + wastePct + '% waste';\n\n        document.getElementById('groutBagsVal').textContent = groutBags + ' Bag' + (groutBags > 1 ? 's' : '') + ' (25 lb each)';\n        document.getElementById('mortarBagsVal').textContent = mortarBags + ' Bag' + (mortarBags > 1 ? 's' : '') + ' (50 lb each)';\n        document.getElementById('trowelSpec').textContent = tileData.trowel;\n        document.getElementById('membraneSqFt').textContent = Math.round(netSqFt) + ' sq ft (Ditra / RedGard)';\n\n        renderTileGrid(preset, wastePct);\n      }\n\n      function renderTileGrid(preset, wastePct) {\n        var svg = document.getElementById('tilePatternSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var startX = 60;\n        var startY = 20;\n\n        var isHerringbone = wastePct === 20;\n        var isOffset = wastePct === 12;\n\n        var tileW = preset === '3x6' ? 50 : (preset === '12x24' ? 90 : 60);\n        var tileH = preset === '3x6' ? 25 : (preset === '12x24' ? 45 : 60);\n\n        for (var row = 0; row < 4; row++) {\n          var y = startY + row * (tileH + 4);\n          var xOffset = (isOffset && row % 2 === 1) ? (tileW / 2) : 0;\n\n          for (var col = 0; col < 9; col++) {\n            var x = startX + col * (tileW + 4) - xOffset;\n            if (x >= startX - 20 && x <= 720) {\n              svgHtml += '<rect x=\"' + x + '\" y=\"' + y + '\" width=\"' + tileW + '\" height=\"' + tileH + '\" fill=\"var(--surface)\" stroke=\"#3b82f6\" stroke-width=\"2\" rx=\"2\"/>';\n            }\n          }\n        }\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyTileOrder() {\n        var boxes = document.getElementById('tileBoxesCount').textContent;\n        var tiles = document.getElementById('totalTilesSingle').textContent;\n        var gross = document.getElementById('grossSqFtValue').textContent;\n        var grout = document.getElementById('groutBagsVal').textContent;\n        var mortar = document.getElementById('mortarBagsVal').textContent;\n        var trowel = document.getElementById('trowelSpec').textContent;\n\n        var text = '📋 Tile & Installation Materials Order Sheet\\n' +\n          '• Total Tiles: ' + tiles + ' (' + boxes + ')\\n' +\n          '• Gross Surface Area: ' + gross + ' sq ft\\n' +\n          '• Grout: ' + grout + '\\n' +\n          '• Thin-Set Mortar: ' + mortar + '\\n' +\n          '• Recommended Trowel: ' + trowel + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/tile-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyTileBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Order List!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['tileRoomLen', 'tileRoomWid', 'tileSizePreset', 'tilePattern', 'boxSqFt', 'groutJoint'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcTiles);\n          el.addEventListener('change', calcTiles);\n        }\n      });\n\n      document.getElementById('copyTileBtn').addEventListener('click', copyTileOrder);\n\n      calcTiles();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'tile-calculator.html'), renderTradePage({
    title: "Tile Calculator: Floor & Wall Square Footage, Boxes, Grout & Mortar | Digital Tools Shed",
    metaDesc: "Calculate exact floor and wall tile counts, packaging boxes, grout bags, and thin-set mortar for straight grid, offset subway, diagonal, and herringbone patterns.",
    canonical: `${DOMAIN}/calc/tile-calculator`,
    bodyContent: tileBody,
    currentPath: '/calc/tile-calculator',
    faq: [
  {
    "q": "How much extra tile waste percentage should I buy for a project?",
    "a": "For a straight grid pattern in a rectangular room, buy 10% extra. For running bond (brick offset) or subway tile, buy 12% extra. For diagonal 45-degree layouts, buy 15% extra. For herringbone or chevron patterns, buy 20% extra to compensate for continuous angled edge trimming."
  },
  {
    "q": "How many boxes of tile do I need to buy?",
    "a": "Calculate your room's square footage (Length × Width), multiply by your pattern waste factor (e.g. 1.10 for 10%), and divide by the square footage packaged in each box. Always round up to the next full box. Tile manufacturers do not sell partial boxes, and having leftover tiles guarantees dye-lot matching for future repairs."
  },
  {
    "q": "What is tile lippage and how do I prevent it on large-format tiles?",
    "a": "Lippage occurs when the edge of one tile sits higher than an adjacent tile, creating an uneven surface and trip hazard. It is common on tiles longer than 15 inches (like 12x24\" tiles). To prevent lippage, never offset tiles by more than 33% (1/3 bond) and use a mechanical tile leveling clip system."
  },
  {
    "q": "How many bags of grout do I need per square foot of tile?",
    "a": "For standard 12x12 or 12x24 inch tiles with an 1/8\" joint, one 25 lb bag of sanded grout covers approximately 80 to 100 square feet. For smaller tiles like 3x6\" subway tiles, more linear joint lines are created, requiring one 25 lb bag per 40 to 50 square feet."
  },
  {
    "q": "Is cement backer board (HardieBacker / Durock) waterproof on its own?",
    "a": "No. Cement backer board is water-durable (meaning it will not mold, rot, or deteriorate when wet), but it is completely porous. Water penetrates cement board and rots wooden wall studs behind it. In wet shower areas, you must apply an ANSI A118.10 liquid or sheet waterproofing membrane over the board."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. REBAR & CONCRETE SLAB REINFORCEMENT CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const rebarBody = "\n<div class=\"tool-container\" style=\"max-width:1080px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-size:2.15rem;font-weight:800;margin-bottom:0.6rem;letter-spacing:-0.02em;\">Rebar Grid & Reinforcement Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:760px;margin:0 auto;line-height:1.6;\">\n      Calculate exact rebar stick counts, total tonnage, ACI 318 code lap splices, support chairs, and tie wire for concrete slabs, driveways, footings, and structural mats.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18M3 15h18M9 3v18M15 3v18\"/></svg>\n        Slab Dimensions & Rebar Schedule\n      </h2>\n\n      <!-- SLAB SIZE -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"slabLength\">Slab Length (Feet)</label>\n          <input type=\"number\" id=\"slabLength\" value=\"30\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"slabWidth\">Slab Width (Feet)</label>\n          <input type=\"number\" id=\"slabWidth\" value=\"20\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n      </div>\n\n      <!-- REBAR SIZE & GRID SPACING -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"rebarSize\">ASTM Bar Size</label>\n          <select id=\"rebarSize\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"3\">#3 (3/8\" — 0.376 lb/ft)</option>\n            <option value=\"4\" selected>#4 (1/2\" — 0.668 lb/ft — Standard)</option>\n            <option value=\"5\">#5 (5/8\" — 1.043 lb/ft — Heavy)</option>\n            <option value=\"6\">#6 (3/4\" — 1.502 lb/ft — Structural)</option>\n            <option value=\"7\">#7 (7/8\" — 2.044 lb/ft)</option>\n            <option value=\"8\">#8 (1\" — 2.670 lb/ft)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"gridSpacing\">Grid On-Center Spacing</label>\n          <select id=\"gridSpacing\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"12\">12\" On-Center (Tight Structural)</option>\n            <option value=\"18\" selected>18\" On-Center (Standard Driveway/Slab)</option>\n            <option value=\"24\">24\" On-Center (Residential Light)</option>\n            <option value=\"8\">8\" On-Center (Heavy Equipment)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- STOCK LENGTH & EDGE COVER -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"stockLength\">Purchased Bar Length</label>\n          <select id=\"stockLength\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"20\" selected>20-Foot Sticks (Standard Lumberyard)</option>\n            <option value=\"10\">10-Foot Sticks (Home Center / DIY)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"edgeCover\">Edge Setback / Cover</label>\n          <select id=\"edgeCover\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"1.5\">1.5\" (Formed Edge - Indoor)</option>\n            <option value=\"2\" selected>2.0\" (Formed Edge - Exposed Weather)</option>\n            <option value=\"3\">3.0\" (Poured Against Earth - Footing)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- LAP SPLICE MULTIPLIER -->\n      <div>\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"lapSpliceCode\">ACI 318 Lap Splice Rule</label>\n        <select id=\"lapSpliceCode\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"40\" selected>Standard Tension Lap (40 Bar Diameters — e.g. 20\" for #4)</option>\n          <option value=\"30\">Compression Lap (30 Bar Diameters — e.g. 15\" for #4)</option>\n          <option value=\"48\">Seismic / High Shear Lap (48 Bar Diameters — e.g. 24\" for #4)</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg>\n            Rebar Takeoff & Accessories\n          </h2>\n          <button id=\"copyRebarBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Stock Sticks to Buy</span>\n            <span id=\"rebarSticksCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">47 Sticks</span>\n            <span id=\"rebarTotalLF\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">884 linear feet</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Steel Weight</span>\n            <span id=\"rebarTotalLbs\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">591 lbs</span>\n            <span id=\"rebarTotalTons\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">0.30 US Tons</span>\n          </div>\n        </div>\n\n        <!-- ACCESSORIES LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Support Chairs & Hardware</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Rebar Dobies / Chairs (2.5' Grid):</span>\n            <strong id=\"rebarChairsCount\" style=\"font-family:var(--mono);color:#10b981;\">96 Chairs (2\" height)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>16-Gauge Annealed Tie Wire (3.5 lb coils):</span>\n            <strong id=\"tieWireRolls\" style=\"font-family:var(--mono);color:var(--fg);\">2 Coils (~600 ties)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Min. Lap Splice Overlap:</span>\n            <strong id=\"lapSpliceInchesVal\" style=\"font-family:var(--mono);color:var(--fg);\">20 Inches (40×d)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Grid Layout Lines:</span>\n            <strong id=\"gridLinesCount\" style=\"font-family:var(--mono);color:var(--fg);\">21 Long. × 14 Trans.</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG REBAR GRID SCHEMATIC -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\"/></svg>\n      Plan View Rebar Layout & Lap Splice Plan\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Orthogonal grid layout displaying 2\" edge setback, longitudinal and transverse reinforcement runs, staggered lap splice joints, and support chair locations.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"rebarGridSvg\" viewBox=\"0 0 800 360\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & STRUCTURAL DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Rebar Spacing, Splice & Steel Weight Derivations</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Reinforced concrete design follows American Concrete Institute (ACI 318) structural guidelines. Concrete possesses tremendous compressive strength (~3,000 to 5,000 PSI) but weak tensile strength (~10% of compressive). Steel rebar provides the internal tensile grid that prevents cracking and differential settling.\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Grid Line Run Counts:</strong><br>\n      N_{\\text{longitudinal}} = \\left\\lfloor \\frac{(W \\times 12) - (2 \\times C)}{\\text{Spacing (inches)}} \\right\\rfloor + 1, \\quad\n      N_{\\text{transverse}} = \\left\\lfloor \\frac{(L \\times 12) - (2 \\times C)}{\\text{Spacing (inches)}} \\right\\rfloor + 1<br>\n      \\text{Where } C \\text{ is edge cover (typically 2 inches).}<br><br>\n      <strong>2. ACI 318 Tension Lap Splice Length:</strong><br>\n      L_{\\text{splice}} = 40 \\times d_b \\quad \\left( \\text{For #4 bar with } d_b = 0.5'', \\ L_{\\text{splice}} = 20'' \\right)<br><br>\n      <strong>3. Net Rebar Linear Footage with Lap Splice Factor:</strong><br>\n      \\text{Splices per Run} = \\max\\left(0, \\left\\lceil \\frac{L_{\\text{run}}}{\\text{Stock Length}} \\right\\rceil - 1\\right)<br>\n      \\text{Total LF} = \\Big[ (N_{\\text{long}} \\times L_{\\text{net}}) + (N_{\\text{trans}} \\times W_{\\text{net}}) + (N_{\\text{splices}} \\times L_{\\text{splice}}) \\Big] \\times 1.10 \\text{ (waste)}<br><br>\n      <strong>4. Total Steel Weight:</strong><br>\n      \\text{Weight (lbs)} = \\text{Total LF} \\times w_{\\text{bar}} \\quad \\left( \\#3=0.376, \\ \\#4=0.668, \\ \\#5=1.043 \\text{ lb/ft} \\right)\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL REBAR TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Concrete Rebar Pitfalls & Code Traps</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Laying Rebar Directly on the Ground or Vapor Barrier</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Rebar that sits on dirt or plastic gravel provides zero tensile reinforcement and rapidly corrodes from soil moisture. Concrete requires a minimum of 1.5 to 2 inches of concrete encasement beneath the steel. Always place rebar on dedicated plastic or concrete chairs (dobies) spaced every 2.5 to 3 feet before pouring.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Insufficient Lap Splice Overlap</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Overlapping bars by only 6 or 12 inches is an immediate code failure. ACI 318 requires at least 30 to 40 bar diameters ($40d_b$) for tension lap splices (e.g. 20 inches for #4 bar, 25 inches for #5 bar). Without adequate splice length, concrete bond stresses slip, causing structural joint cracking.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Displacing Chairs During the Concrete Chute Pour</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          When heavy concrete is discharged from a ready-mix chute, workers frequently step on the rebar grid or let the chute knock plastic chairs over, forcing the steel down to the mud. Assign a dedicated laborer with a rebar hook to verify and pull rebar up onto chairs continuously during the pour.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Missing 90° Corner Reinforcement Ties</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Simply butting straight bars together at the 90-degree corners of a foundation footing creates a weak hinge prone to diagonal shear cracks. Corners must be reinforced using factory-bent or field-bent 90-degree corner bars that overlap straight runs by the full 40-diameter development length.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Tack-Welding Standard Grade 60 Rebar</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Standard ASTM A615 Grade 60 rebar has a high carbon equivalent that makes it brittle when exposed to electric arc welding. Welding causes microscopic heat-affected zone cracking that can snap under load. Only tie with annealed 16-gauge wire, or specify ASTM A706 weldable low-alloy rebar.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var barWeights = {\n        '3': 0.376,\n        '4': 0.668,\n        '5': 1.043,\n        '6': 1.502,\n        '7': 2.044,\n        '8': 2.670\n      };\n\n      var barDiameters = {\n        '3': 0.375,\n        '4': 0.500,\n        '5': 0.625,\n        '6': 0.750,\n        '7': 0.875,\n        '8': 1.000\n      };\n\n      function calcRebar() {\n        var len = parseFloat(document.getElementById('slabLength').value) || 0;\n        var wid = parseFloat(document.getElementById('slabWidth').value) || 0;\n        var barSize = document.getElementById('rebarSize').value;\n        var spacingInches = parseFloat(document.getElementById('gridSpacing').value) || 18;\n        var stockStickFt = parseFloat(document.getElementById('stockLength').value) || 20;\n        var coverInches = parseFloat(document.getElementById('edgeCover').value) || 2;\n        var lapMultiplier = parseFloat(document.getElementById('lapSpliceCode').value) || 40;\n\n        var db = barDiameters[barSize] || 0.5;\n        var lbPerFt = barWeights[barSize] || 0.668;\n\n        var lapSpliceInches = db * lapMultiplier;\n        var lapSpliceFt = lapSpliceInches / 12;\n\n        var netLenFt = Math.max(0, len - (2 * (coverInches / 12)));\n        var netWidFt = Math.max(0, wid - (2 * (coverInches / 12)));\n\n        // Number of lines\n        var numLongLines = Math.floor((netWidFt * 12) / spacingInches) + 1;\n        var numTransLines = Math.floor((netLenFt * 12) / spacingInches) + 1;\n\n        // Splices per line\n        var splicesPerLong = Math.max(0, Math.ceil(netLenFt / stockStickFt) - 1);\n        var splicesPerTrans = Math.max(0, Math.ceil(netWidFt / stockStickFt) - 1);\n\n        var totalLongLF = numLongLines * (netLenFt + (splicesPerLong * lapSpliceFt));\n        var totalTransLF = numTransLines * (netWidFt + (splicesPerTrans * lapSpliceFt));\n\n        var grossLF = (totalLongLF + totalTransLF) * 1.10; // 10% cutting waste\n        var sticksToBuy = Math.ceil(grossLF / stockStickFt);\n\n        var totalWeightLbs = grossLF * lbPerFt;\n        var totalTons = totalWeightLbs / 2000;\n\n        // Accessories\n        var chairs = Math.ceil((len / 2.5) * (wid / 2.5));\n        var totalIntersections = numLongLines * numTransLines;\n        var tieWireRolls = Math.max(1, Math.ceil(totalIntersections / 300));\n\n        // Update DOM\n        document.getElementById('rebarSticksCount').textContent = sticksToBuy + ' Sticks (' + stockStickFt + \"')\";\n        document.getElementById('rebarTotalLF').textContent = Math.round(grossLF).toLocaleString() + ' linear feet (incl. 10% waste)';\n        document.getElementById('rebarTotalLbs').textContent = Math.round(totalWeightLbs).toLocaleString() + ' lbs';\n        document.getElementById('rebarTotalTons').textContent = totalTons.toFixed(2) + ' US Tons';\n\n        document.getElementById('rebarChairsCount').textContent = chairs + ' Chairs (2\" height)';\n        document.getElementById('tieWireRolls').textContent = tieWireRolls + ' Coils (~' + (tieWireRolls * 300) + ' ties)';\n        document.getElementById('lapSpliceInchesVal').textContent = Math.round(lapSpliceInches) + ' Inches (' + lapMultiplier + '×d)';\n        document.getElementById('gridLinesCount').textContent = numLongLines + ' Long. × ' + numTransLines + ' Trans.';\n\n        renderRebarSvg(numLongLines, numTransLines, splicesPerLong > 0);\n      }\n\n      function renderRebarSvg(numLong, numTrans, hasSplices) {\n        var svg = document.getElementById('rebarGridSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n\n        // Concrete Slab Boundary\n        svgHtml += '<rect x=\"60\" y=\"40\" width=\"680\" height=\"260\" fill=\"#cbd5e1\" opacity=\"0.3\" stroke=\"var(--fg)\" stroke-width=\"2\" rx=\"4\"/>';\n        svgHtml += '<text x=\"75\" y=\"65\" fill=\"var(--fg)\" font-size=\"12\" font-weight=\"bold\">Concrete Slab Boundary (2\" Edge Cover Clearance)</text>';\n\n        // Setback Boundary dash\n        svgHtml += '<rect x=\"80\" y=\"60\" width=\"640\" height=\"220\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.5\" stroke-dasharray=\"6,4\"/>';\n\n        // Rebar grid lines\n        var xStart = 80, xEnd = 720;\n        var yStart = 60, yEnd = 280;\n\n        var dispTrans = Math.min(18, numTrans);\n        var dispLong = Math.min(10, numLong);\n\n        var xStep = (xEnd - xStart) / (dispTrans - 1 || 1);\n        var yStep = (yEnd - yStart) / (dispLong - 1 || 1);\n\n        // Transverse lines (vertical)\n        for (var i = 0; i < dispTrans; i++) {\n          var x = xStart + (i * xStep);\n          svgHtml += '<line x1=\"' + x + '\" y1=\"' + yStart + '\" x2=\"' + x + '\" y2=\"' + yEnd + '\" stroke=\"#ef4444\" stroke-width=\"2\"/>';\n        }\n\n        // Longitudinal lines (horizontal)\n        for (var j = 0; j < dispLong; j++) {\n          var y = yStart + (j * yStep);\n          svgHtml += '<line x1=\"' + xStart + '\" y1=\"' + y + '\" x2=\"' + xEnd + '\" y2=\"' + y + '\" stroke=\"#ef4444\" stroke-width=\"2\"/>';\n\n          // Show lap splice marker if needed\n          if (hasSplices && j % 2 === 1) {\n            var spliceX = xStart + (xEnd - xStart) * 0.45;\n            svgHtml += '<rect x=\"' + (spliceX - 15) + '\" y=\"' + (y - 4) + '\" width=\"30\" height=\"8\" fill=\"#f59e0b\" rx=\"2\"/>';\n          }\n        }\n\n        // Support chairs (dots at every 2nd intersection)\n        for (var ci = 0; ci < dispTrans; ci += 2) {\n          for (var cj = 0; cj < dispLong; cj += 2) {\n            var cx = xStart + (ci * xStep);\n            var cy = yStart + (cj * yStep);\n            svgHtml += '<circle cx=\"' + cx + '\" cy=\"' + cy + '\" r=\"4\" fill=\"#3b82f6\"/>';\n          }\n        }\n\n        // Legend\n        svgHtml += '<circle cx=\"80\" cy=\"325\" r=\"4\" fill=\"#3b82f6\"/>';\n        svgHtml += '<text x=\"92\" y=\"329\" fill=\"var(--fg)\" font-size=\"11\">Rebar Chair / Dobie (2\" Height)</text>';\n\n        svgHtml += '<line x1=\"260\" y1=\"325\" x2=\"285\" y2=\"325\" stroke=\"#ef4444\" stroke-width=\"3\"/>';\n        svgHtml += '<text x=\"295\" y=\"329\" fill=\"var(--fg)\" font-size=\"11\">Grade 60 Steel Rebar</text>';\n\n        if (hasSplices) {\n          svgHtml += '<rect x=\"440\" y=\"320\" width=\"18\" height=\"8\" fill=\"#f59e0b\" rx=\"2\"/>';\n          svgHtml += '<text x=\"466\" y=\"329\" fill=\"var(--fg)\" font-size=\"11\">ACI 318 Lap Splice Joint</text>';\n        }\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyRebarTakeoff() {\n        var sticks = document.getElementById('rebarSticksCount').textContent;\n        var lf = document.getElementById('rebarTotalLF').textContent;\n        var lbs = document.getElementById('rebarTotalLbs').textContent;\n        var tons = document.getElementById('rebarTotalTons').textContent;\n        var chairs = document.getElementById('rebarChairsCount').textContent;\n        var wire = document.getElementById('tieWireRolls').textContent;\n        var splice = document.getElementById('lapSpliceInchesVal').textContent;\n        var sizeText = document.getElementById('rebarSize').options[document.getElementById('rebarSize').selectedIndex].text;\n        var spaceText = document.getElementById('gridSpacing').options[document.getElementById('gridSpacing').selectedIndex].text;\n\n        var text = '📋 Rebar Reinforcement Order Sheet\\n' +\n          '• Rebar Specification: ' + sizeText + '\\n' +\n          '• Grid Spacing: ' + spaceText + '\\n' +\n          '• Total Sticks to Buy: ' + sticks + '\\n' +\n          '• Total Linear Feet: ' + lf + '\\n' +\n          '• Total Steel Weight: ' + lbs + ' (' + tons + ')\\n' +\n          '• Support Chairs / Dobies: ' + chairs + '\\n' +\n          '• Tie Wire: ' + wire + '\\n' +\n          '• Min. ACI Lap Overlap: ' + splice + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/rebar-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyRebarBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['slabLength', 'slabWidth', 'rebarSize', 'gridSpacing', 'stockLength', 'edgeCover', 'lapSpliceCode'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcRebar);\n          el.addEventListener('change', calcRebar);\n        }\n      });\n\n      document.getElementById('copyRebarBtn').addEventListener('click', copyRebarTakeoff);\n\n      calcRebar();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'rebar-calculator.html'), renderTradePage({
    title: "Rebar Calculator — Grid Spacing, Lap Splices & Tonnage | Digital Tools Shed",
    metaDesc: "Free contractor rebar calculator. Computes exact bar counts, grid spacing, ACI 318 lap splices, 20-ft stock sticks, weight tonnage, tie wire, and rebar chairs for concrete slabs and footings.",
    canonical: `${DOMAIN}/calc/rebar-calculator`,
    bodyContent: rebarBody,
    currentPath: '/calc/rebar-calculator',
    faq: [
  {
    "q": "How far apart should rebar be placed in a concrete slab?",
    "a": "For standard residential 4-inch concrete driveways and patios, rebar is typically spaced 18 inches on-center in a grid. For structural footings or heavy vehicle garages, rebar is placed 12 inches on-center. Maximum spacing should never exceed 18 inches or 3 times the slab thickness."
  },
  {
    "q": "What is the required lap splice length for rebar?",
    "a": "According to ACI 318, standard Class B tension lap splices require an overlap of 40 bar diameters ($40d_b$). For #4 rebar (1/2\" diameter), this requires an overlap of 20 inches ($40 \\times 0.5 = 20$). For #5 rebar (5/8\"), the overlap is 25 inches."
  },
  {
    "q": "What size rebar is used for a residential concrete driveway?",
    "a": "Standard residential concrete driveways (4 to 5 inches thick) utilize #4 rebar (1/2 inch nominal diameter) spaced at 18 inches on-center, supported on 2-inch plastic or concrete chairs to elevate the steel into the bottom third of the slab."
  },
  {
    "q": "Why must rebar be supported on chairs instead of pulled up with a hook?",
    "a": "Pulling rebar up while walking in wet concrete is notoriously inconsistent. Rebar inevitably sinks back down to the dirt or plastic vapor barrier under worker footprints, leaving zero concrete cover beneath the steel and causing rapid corrosion and structural cracking."
  },
  {
    "q": "How much does one 20-foot stick of #4 rebar weigh?",
    "a": "One linear foot of #4 rebar weighs exactly 0.668 pounds. A standard 20-foot stick weighs approximately 13.36 pounds. A 100-stick bundle weighs 1,336 pounds."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. ROOFING SHINGLE & ROOF SQUARES CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const roofingBody = "\n<div class=\"article-container\" style=\"max-width:1040px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;border-bottom:1px solid var(--border);padding-bottom:1.5rem;\">\n    <div style=\"display:flex;align-items:center;gap:0.5rem;font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;\">\n      <a href=\"/\" style=\"color:inherit;text-decoration:none;\">Home</a> &gt; <a href=\"/calc/\" style=\"color:inherit;text-decoration:none;\">Trade & Construction</a> &gt; <span>Roofing Calculator</span>\n    </div>\n    <h1 style=\"font-family:var(--serif);font-size:2.3rem;margin-bottom:0.75rem;line-height:1.2;\">Roofing Shingle, Squares & Pitch Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;line-height:1.6;margin:0;\">\n      Calculate exact architectural shingle bundles, roof squares (100 sq ft units), synthetic underlayment rolls, and roofing nails for any residential roof. Integrates pitch slope multipliers (3/12 to 12/12), eave overhang allowances, and hip/valley cutting waste.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:2rem;margin-bottom:2.5rem;\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/></svg>\n        Building Footprint & Pitch\n      </h2>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roofHouseLen\">Base Length (Feet)</label>\n          <input type=\"number\" id=\"roofHouseLen\" value=\"50\" min=\"10\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roofHouseWid\">Base Width (Feet)</label>\n          <input type=\"number\" id=\"roofHouseWid\" value=\"30\" min=\"10\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1rem;font-weight:600;\">\n        </div>\n      </div>\n\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roofPitch\">Roof Pitch / Slope</label>\n          <select id=\"roofPitch\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"1.031\">3/12 (Low Slope — 14.0°)</option>\n            <option value=\"1.054\">4/12 (Moderate — 18.4°)</option>\n            <option value=\"1.083\">5/12 (Standard Ranch — 22.6°)</option>\n            <option value=\"1.118\" selected>6/12 (Standard Gable — 26.6°)</option>\n            <option value=\"1.158\">7/12 (Traditional — 30.3°)</option>\n            <option value=\"1.202\">8/12 (Steep Slope — 33.7°)</option>\n            <option value=\"1.250\">9/12 (Steep — 36.9°)</option>\n            <option value=\"1.302\">10/12 (Very Steep — 39.8°)</option>\n            <option value=\"1.414\">12/12 (Full 45° Pitch)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"eaveOverhang\">Eave Overhang (Feet)</label>\n          <select id=\"eaveOverhang\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"1.0\" selected>1.0 Ft (12\" Overhang Standard)</option>\n            <option value=\"1.5\">1.5 Ft (18\" Overhang)</option>\n            <option value=\"2.0\">2.0 Ft (24\" Wide Eaves)</option>\n            <option value=\"0\">0 Ft (Flush Gable / No Overhang)</option>\n          </select>\n        </div>\n      </div>\n\n      <div>\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roofComplexity\">Roof Shape & Cutting Waste</label>\n        <select id=\"roofComplexity\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"10\" selected>Simple Gable Roof (10% Waste)</option>\n          <option value=\"15\">Hip Roof with Valleys (15% Waste)</option>\n          <option value=\"20\">Complex Multi-Dormer / Turrets (20% Waste)</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin-top:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg>\n            Roofing Material Takeoff\n          </h2>\n          <button id=\"copyRoofBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Shingle Bundles (3/Sq)</span>\n            <span id=\"shingleBundlesCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">63 Bundles</span>\n            <span id=\"roofSquaresCount\" style=\"font-size:0.8rem;color:#3b82f6;font-weight:600;\">20.8 Roof Squares</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">True Roof Surface Area</span>\n            <span id=\"trueRoofAreaSqFt\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">2,082</span>\n            <span id=\"groundFootprintLabel\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">1,664 sq ft ground area</span>\n          </div>\n        </div>\n\n        <!-- ACCESSORIES LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Underlayment & Fasteners</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Synthetic Underlayment (10-Sq Rolls):</span>\n            <strong id=\"underlaymentRollsVal\" style=\"font-family:var(--mono);color:#10b981;\">3 Rolls</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Ice & Water Shield (36\" Eaves):</span>\n            <strong id=\"iceWaterShieldVal\" style=\"font-family:var(--mono);color:var(--fg);\">2 Rolls (132 linear ft)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Starter Strip Shingles:</span>\n            <strong id=\"starterStripsVal\" style=\"font-family:var(--mono);color:var(--fg);\">2 Bundles (~210 ft)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>1-1/4\" Coil Roofing Nails:</span>\n            <strong id=\"roofingNailsLbs\" style=\"font-family:var(--mono);color:var(--fg);\">55 lbs (~7,500 nails)</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG ROOF PITCH & PROFILE SCHEMATIC -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;\">Roof Pitch Geometry & Layer Cross-Section</h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Cross-sectional elevation illustrating roof pitch slope triangle, drip edge, ice & water barrier, synthetic felt, and architectural shingle exposure.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"roofSlopeSchematicSvg\" viewBox=\"0 0 800 240\" style=\"width:100%;height:auto;min-width:550px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & ROOFING DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Pitch Multiplier Trigonometry & The 100 Sq Ft \"Square\"</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      In the construction industry, roofing materials are quoted in <strong>Roof Squares</strong>, where $1 \\text{ square} = 100 \\text{ sq ft}$. Because roofs slope upward, the true three-dimensional surface area is always significantly larger than the building's ground footprint.\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Pitch Slope Multiplier ($M$):</strong><br>\n      M = \\frac{\\sqrt{\\text{Rise}^2 + 12^2}}{12} = \\sqrt{1 + \\left(\\frac{\\text{Rise}}{12}\\right)^2}<br>\n      \\textit{Example: For a 6/12 pitch, } M = \\frac{\\sqrt{36 + 144}}{12} = \\frac{\\sqrt{180}}{12} \\approx 1.1180<br><br>\n      <strong>2. Ground Footprint with Overhangs:</strong><br>\n      L_{\\text{gross}} = L_{\\text{house}} + (2 \\times \\text{Overhang}), \\quad W_{\\text{gross}} = W_{\\text{house}} + (2 \\times \\text{Overhang})<br><br>\n      <strong>3. True Surface Area ($A$):</strong><br>\n      A_{\\text{true}} = (L_{\\text{gross}} \\times W_{\\text{gross}}) \\times M \\times (1 + \\frac{\\text{Waste}_{\\%}}{100})<br><br>\n      <strong>4. Roofing Squares & Bundles:</strong><br>\n      \\text{Squares} = \\frac{A_{\\text{true}}}{100}, \\quad \\text{Bundles} = \\lceil \\text{Squares} \\times 3 \\rceil\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL ROOFING TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Roofing & Building Code Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Failing the 24\" Ice & Water Shield Code Rule</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          IRC Section R905.1.2 mandates self-adhering ice barrier membrane in snow climates. The code strictly dictates that the membrane must extend from the eave edge to at least 24 inches inside the interior exterior wall line. On wide 24\" soffits, a single 36\" membrane roll leaves an unprotected gap, causing severe ice dam roof leaks.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. High-Wind Nailing Under-Fastening</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Standard nailing specifies 4 nails per shingle. However, for high-wind zones (over 110 MPH) or steep pitches ($> 9/12$), building code and manufacturer warranties require a 6-nail pattern with nails placed directly through the double-layer common bond line. Missing the nail line allows winds to blow entire shingle tabs away.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Re-Roofing Over Two Existing Layers</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          IRC Section R908.3.1.1 strictly forbids installing a third layer of asphalt shingles without tearing off existing materials. Three layers of shingles exceed structural dead-load rafter limits (weighing over 700 lbs per square) and prevent new nails from penetrating securely into wood roof decking.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Starving Attic Ventilation (The 1:300 Rule)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Installing a new roof without matching continuous ridge vents to soffit intake vents bakes shingles from below. Attic temperatures exceeding 150°F cause asphalt oils to volatilize and blister prematurely, voiding manufacturer 30-year warranties within 7 years. Maintain 1 sq ft of Net Free Area (NFA) per 300 sq ft of attic floor.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Closed Valley Shingle Weaving in Heavy Snow</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Weaving dimensional architectural shingles through valleys creates a thick, bumpy seam that traps melting ice and debris. In northern freeze-thaw zones, open valleys with W-profile 24-gauge prefinished metal flashing shed snow and ice far more effectively and prevent ice dam puncture.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcRoof() {\n        var len = parseFloat(document.getElementById('roofHouseLen').value) || 0;\n        var wid = parseFloat(document.getElementById('roofHouseWid').value) || 0;\n        var pitchMult = parseFloat(document.getElementById('roofPitch').value) || 1.118;\n        var overhang = parseFloat(document.getElementById('eaveOverhang').value) || 1.0;\n        var wastePct = parseFloat(document.getElementById('roofComplexity').value) || 10;\n\n        var grossLen = len + (2 * overhang);\n        var grossWid = wid + (2 * overhang);\n        var groundSqFt = grossLen * grossWid;\n\n        var trueSlopeSqFt = groundSqFt * pitchMult;\n        var grossWithWaste = trueSlopeSqFt * (1 + (wastePct / 100));\n\n        var squares = grossWithWaste / 100;\n        var bundles = Math.ceil(squares * 3);\n\n        var underlaymentRolls = Math.max(1, Math.ceil(squares / 10)); // 10-square synthetic rolls\n        var perimeterFt = 2 * (grossLen + grossWid);\n        var iceShieldRolls = Math.max(1, Math.ceil(perimeterFt / 65)); // 65 ft rolls\n        var starterBundles = Math.max(1, Math.ceil(perimeterFt / 105)); // ~105 ft per starter bundle\n        var nailsLbs = Math.max(10, Math.ceil(squares * 2.5)); // ~2.5 lbs nails per square\n\n        // Update DOM\n        document.getElementById('shingleBundlesCount').textContent = bundles + ' Bundles';\n        document.getElementById('roofSquaresCount').textContent = squares.toFixed(1) + ' Roof Squares (' + (squares * 100).toFixed(0) + ' sq ft)';\n        document.getElementById('trueRoofAreaSqFt').textContent = Math.round(grossWithWaste).toLocaleString();\n        document.getElementById('groundFootprintLabel').textContent = Math.round(groundSqFt).toLocaleString() + ' sq ft ground footprint';\n\n        document.getElementById('underlaymentRollsVal').textContent = underlaymentRolls + ' Roll' + (underlaymentRolls > 1 ? 's' : '') + ' (10-Sq Synthetic)';\n        document.getElementById('iceWaterShieldVal').textContent = iceShieldRolls + ' Roll' + (iceShieldRolls > 1 ? 's' : '') + ' (36\\\" x 65\\')';\n        document.getElementById('starterStripsVal').textContent = starterBundles + ' Bundle' + (starterBundles > 1 ? 's' : '') + ' (~' + Math.round(perimeterFt) + ' linear ft)';\n        document.getElementById('roofingNailsLbs').textContent = nailsLbs + ' lbs (~' + Math.round(squares * 320).toLocaleString() + ' nails)';\n\n        renderRoofSchematic(pitchMult);\n      }\n\n      function renderRoofSchematic(pitchMult) {\n        var svg = document.getElementById('roofSlopeSchematicSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n        var startX = 80;\n        var startY = 190;\n        var peakX = 400;\n        var peakY = 50;\n        var rightX = 720;\n\n        // Roof Slope Triangle\n        svgHtml += '<polygon points=\"' + startX + ',' + startY + ' ' + peakX + ',' + peakY + ' ' + rightX + ',' + startY + '\" fill=\"var(--surface)\" stroke=\"#3b82f6\" stroke-width=\"3\"/>';\n\n        // Shingle Layer lines\n        svgHtml += '<line x1=\"' + (startX + 40) + '\" y1=\"' + (startY - 15) + '\" x2=\"' + (rightX - 40) + '\" y2=\"' + (startY - 15) + '\" stroke=\"var(--border)\" stroke-dasharray=\"6,4\"/>';\n\n        // Overhang markers\n        svgHtml += '<text x=\"' + startX + '\" y=\"' + (startY + 25) + '\" fill=\"var(--text-muted)\" font-size=\"11\">Eave Overhang</text>';\n        svgHtml += '<text x=\"' + peakX + '\" y=\"' + (peakY - 12) + '\" fill=\"#3b82f6\" font-size=\"13\" font-weight=\"bold\" text-anchor=\"middle\">Ridge Line</text>';\n        svgHtml += '<text x=\"' + rightX + '\" y=\"' + (startY + 25) + '\" fill=\"var(--text-muted)\" font-size=\"11\" text-anchor=\"end\">Eave Overhang</text>';\n\n        // Slope ratio callout\n        svgHtml += '<text x=\"' + (startX + 120) + '\" y=\"' + (startY - 70) + '\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\">Pitch Factor: ' + pitchMult.toFixed(3) + 'x</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyRoofTakeoff() {\n        var bundles = document.getElementById('shingleBundlesCount').textContent;\n        var squares = document.getElementById('roofSquaresCount').textContent;\n        var area = document.getElementById('trueRoofAreaSqFt').textContent;\n        var underlay = document.getElementById('underlaymentRollsVal').textContent;\n        var ice = document.getElementById('iceWaterShieldVal').textContent;\n        var starter = document.getElementById('starterStripsVal').textContent;\n        var nails = document.getElementById('roofingNailsLbs').textContent;\n\n        var text = '📋 Roofing Materials Takeoff & Order Sheet\\n' +\n          '• Architectural Shingles: ' + bundles + ' (' + squares + ')\\n' +\n          '• Total Surface Area: ' + area + ' sq ft\\n' +\n          '• Synthetic Underlayment: ' + underlay + '\\n' +\n          '• Ice & Water Shield: ' + ice + '\\n' +\n          '• Starter Strip Shingles: ' + starter + '\\n' +\n          '• Roofing Nails: ' + nails + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/roofing-shingle-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyRoofBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['roofHouseLen', 'roofHouseWid', 'roofPitch', 'eaveOverhang', 'roofComplexity'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcRoof);\n          el.addEventListener('change', calcRoof);\n        }\n      });\n\n      document.getElementById('copyRoofBtn').addEventListener('click', copyRoofTakeoff);\n\n      calcRoof();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'roofing-shingle-calculator.html'), renderTradePage({
    title: "Roofing Shingle Calculator: Roof Squares, Bundles, Pitch & Waste | Digital Tools Shed",
    metaDesc: "Calculate exact roof squares, shingle bundles (3 per square), synthetic underlayment, starter strips, and nails with roof pitch slope multipliers and IRC code standards.",
    canonical: `${DOMAIN}/calc/roofing-shingle-calculator`,
    bodyContent: roofingBody,
    currentPath: '/calc/roofing-shingle-calculator',
    faq: [
  {
    "q": "How many bundles of shingles are in one square of roofing?",
    "a": "There are exactly 3 bundles of standard architectural (dimensional) or 3-tab shingles in one roof square. One roof square equals 100 square feet of roof surface area."
  },
  {
    "q": "What is roof pitch and how does it change material calculations?",
    "a": "Roof pitch is the vertical rise for every 12 inches of horizontal run (e.g. 6/12 pitch rises 6 inches per foot). Because of the triangle slope, a 6/12 roof has 11.8% more surface area than the flat ground footprint below it; a steep 12/12 pitch has 41.4% more surface area."
  },
  {
    "q": "How many nails do I need per shingle for building code compliance?",
    "a": "Standard installation requires 4 nails per shingle. In designated high-wind hurricane zones (over 110 MPH) or on steep roofs greater than 9/12 pitch, the International Residential Code (IRC) mandates 6 nails per shingle placed precisely through the double-layer nailing line."
  },
  {
    "q": "How much extra shingle waste percentage should I order?",
    "a": "Order 10% extra for a simple gable roof with two flat rectangular planes. Order 15% extra for hip roofs with valleys and ridges, and 20% extra for complex architectural roofs with multiple dormers and turrets."
  },
  {
    "q": "Can I install new asphalt shingles over an old layer of shingles?",
    "a": "Building code allows installing a maximum of two layers of asphalt shingles on a roof. However, tearing off old shingles down to bare plywood is strongly recommended to inspect for rotten wood decking, install fresh Ice & Water Shield, and prevent heavy excess weight that can sag roof rafters."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. WALLPAPER CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const wallpaperBody = "\n<div class=\"tool-container\" style=\"max-width:1080px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-size:2.15rem;font-weight:800;margin-bottom:0.6rem;letter-spacing:-0.02em;\">Wallpaper Roll & Strip Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:760px;margin:0 auto;line-height:1.6;\">\n      Calculate exact wallpaper roll requirements based on vertical strip yield, pattern repeat drops, single vs double rolls, and trimming margins. Designed to prevent seam mismatches and shortage crises.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z\"/><line x1=\"12\" y1=\"3\" x2=\"12\" y2=\"21\"/></svg>\n        Room Dimensions & Pattern Specifications\n      </h2>\n\n      <!-- ACCENT WALL VS FULL ROOM TOGGLE -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\">Application Area</label>\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;\">\n          <button type=\"button\" id=\"wallFullRoomBtn\" style=\"padding:0.6rem;border:1px solid #3b82f6;background:#3b82f6;color:#ffffff;border-radius:8px;font-weight:600;cursor:pointer;\">Full Room (4 Walls)</button>\n          <button type=\"button\" id=\"wallAccentBtn\" style=\"padding:0.6rem;border:1px solid var(--border);background:var(--bg);color:var(--fg);border-radius:8px;font-weight:600;cursor:pointer;\">Single Feature / Accent Wall</button>\n        </div>\n      </div>\n\n      <!-- ROOM DIMENSIONS -->\n      <div id=\"fullRoomDims\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roomLength\">Room Length (Feet)</label>\n          <input type=\"number\" id=\"roomLength\" value=\"14\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"roomWidth\">Room Width (Feet)</label>\n          <input type=\"number\" id=\"roomWidth\" value=\"12\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n      </div>\n\n      <!-- SINGLE ACCENT WALL DIM -->\n      <div id=\"accentWallDims\" style=\"display:none;margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"accentWidth\">Accent Wall Width (Feet)</label>\n        <input type=\"number\" id=\"accentWidth\" value=\"16\" min=\"1\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n      </div>\n\n      <!-- WALL HEIGHT -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"wallHeight\">Finished Ceiling / Wall Height (Feet)</label>\n        <input type=\"number\" id=\"wallHeight\" value=\"9\" min=\"6\" max=\"25\" step=\"0.25\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n      </div>\n\n      <!-- ROLL FORMAT -->\n      <div style=\"margin-bottom:1.25rem;\">\n        <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"rollStandard\">Wallpaper Roll Type & Packaging</label>\n        <select id=\"rollStandard\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n          <option value=\"usDouble\" selected>US Double Roll (27\" Wide × 27 ft Long — ~60.75 sq ft)</option>\n          <option value=\"euroMetric\">Euro Metric Roll (20.5\" / 53cm Wide × 33 ft / 10m Long — ~56.4 sq ft)</option>\n          <option value=\"usSingle\">US Single Roll (20.5\" Wide × 16.5 ft Long — ~28.2 sq ft)</option>\n          <option value=\"grasscloth36\">Commercial / Grasscloth (36\" Wide × 24 ft Long — ~72 sq ft)</option>\n        </select>\n      </div>\n\n      <!-- PATTERN MATCH & REPEAT -->\n      <div style=\"display:grid;grid-template-columns:1.3fr 1fr;gap:1rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"patternType\">Pattern Match Style</label>\n          <select id=\"patternType\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"random\">Random / Solid (No Match)</option>\n            <option value=\"straight\" selected>Straight Match (Horizontal)</option>\n            <option value=\"drop\">Half-Drop Match (Diagonal)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"patternRepeat\">Pattern Repeat (Inches)</label>\n          <input type=\"number\" id=\"patternRepeat\" value=\"21\" min=\"0\" max=\"48\" step=\"0.5\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z\"/><line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"/><path d=\"M16 10a4 4 0 0 1-8 0\"/></svg>\n            Wallpaper Order Takeoff\n          </h2>\n          <button id=\"copyWallpaperBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Rolls to Order (with Spare)</span>\n            <span id=\"rollsToOrderCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">13 Rolls</span>\n            <span id=\"rollsNetCount\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">12 Net + 1 Spare Attic Roll</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Vertical Wall Drops</span>\n            <span id=\"verticalStripsCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">24 Strips</span>\n            <span id=\"stripsPerRollVal\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">2 Strips per Roll</span>\n          </div>\n        </div>\n\n        <!-- SPECIFICATION BREAKDOWN -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Installation & Adhesive Takeoff</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Gross Surface Area:</span>\n            <strong id=\"grossSurfaceArea\" style=\"font-family:var(--mono);color:var(--fg);\">468 sq ft</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Cut Length per Strip (incl. match):</span>\n            <strong id=\"cutLengthPerStrip\" style=\"font-family:var(--mono);color:#f59e0b;\">10 ft 9 in</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Wallpaper Primer / Sizing:</span>\n            <strong id=\"wallpaperPrimerGal\" style=\"font-family:var(--mono);color:var(--fg);\">2 Gallons (~400 sq ft/gal)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Heavy-Duty Clear Adhesive:</span>\n            <strong id=\"wallpaperPasteGal\" style=\"font-family:var(--mono);color:#10b981;\">2 Gallons (~250 sq ft/gal)</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG WALLPAPER DROP SCHEMATIC -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/></svg>\n      Wall Elevation & Vertical Strip Match Layout\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Elevation schematic illustrating adjacent vertical drops, pattern match repeat alignments, top ceiling trim allowance, and bottom baseboard cut line.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"wallpaperElevationSvg\" viewBox=\"0 0 800 280\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & WALLPAPER DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Wallpaper Strip Yield & Pattern Repeat Formulas</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Amateur calculators divide total room wall area by roll square footage. This produces catastrophic shortages. Wallpaper is hung in discrete continuous vertical strips (drops). Every strip cut must accommodate the wall height, a 4-inch top/bottom trimming margin, and the pattern repeat cycle:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Factored Cut Length per Vertical Strip:</strong><br>\n      L_{\\text{raw}} = (H_{\\text{wall}} \\times 12) + 4'' \\text{ (trimming margin)}<br>\n      \\text{For Pattern Repeat } R > 0: \\quad L_{\\text{cut}} = \\left\\lceil \\frac{L_{\\text{raw}}}{R} \\right\\rceil \\times R<br>\n      \\text{For Half-Drop Match, every alternating strip shifts by } \\frac{R}{2}.<br><br>\n      <strong>2. Usable Strips per Roll:</strong><br>\n      \\text{Strips per Roll} = \\left\\lfloor \\frac{\\text{Roll Length (inches)}}{L_{\\text{cut}}} \\right\\rfloor<br>\n      \\text{Example: A 27-ft (324'') roll on a 9-ft wall with 21'' repeat yields only 2 full strips (258'') with 66'' scrap waste!}<br><br>\n      <strong>3. Total Strips Required:</strong><br>\n      N_{\\text{strips}} = \\left\\lceil \\frac{\\text{Perimeter (inches)}}{\\text{Roll Width (inches)}} \\right\\rceil<br><br>\n      <strong>4. Final Purchase Quantity:</strong><br>\n      \\text{Rolls to Buy} = \\left\\lceil \\frac{N_{\\text{strips}}}{\\text{Strips per Roll}} \\right\\rceil + 1 \\text{ (Attic Spare Roll)}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL WALLPAPER TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Wallpaper Hanging Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Deducting Windows and Doors from Strip Counts</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Never subtract standard windows or doors from your wallpaper roll calculation! Wallpaper patterns run in uninterrupted vertical drops across the entire room. Strips above and below window openings must match the pattern cadence of adjacent full-height strips; piecing together scrap cutoffs ruins horizontal alignment.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Overlooking Run and Dye Lot Numbers</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Wallpaper printing machines use ink vats that experience subtle viscosity, temperature, and pigment variations between manufacturing batches. Rolls from different run/lot numbers will have noticeable background sheen or shading variations. Always verify that every single roll shares the exact same Run/Lot number.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Skipping Acrylic Wallpaper Primer (Sizing)</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Hanging wallpaper over standard latex paint or bare drywall is a recipe for disaster. The adhesive penetrates the drywall paper, bonding permanently. When you try to redecorate years later, stripping the wallpaper tears off the drywall paper down to gypsum. A dedicated acrylic wallpaper primer (like Roman R-35 or Shieldz) seals the wall and allows easy future removal.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Stretching Wet Strips During Installation</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          When non-woven or paper wallpaper is saturated with paste, it becomes soft and pliable. Pulling or stretching the edges with a smoother to force a misaligned seam together will look fine for one hour. But as the paste dries, the paper fibers shrink back to their original tension, leaving an unsightly 1/16\" gap along the entire seam.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Starting in a Corner Without a Plumb Line</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Residential corners are almost never truly vertical or square. If you align your first strip flush against the drywall corner, by the time you reach the fourth strip, the pattern will be noticeably sloping downhill. Always snap a plumb chalk line or laser level line 1/2 inch narrower than the roll width from the starting corner.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      var isAccentWall = false;\n\n      var rollSpecs = {\n        'usDouble': { widthInches: 27, lengthFt: 27, name: 'US Double Roll (27\" × 27')' },\n        'euroMetric': { widthInches: 20.5, lengthFt: 33, name: 'Euro Metric (20.5\" × 33')' },\n        'usSingle': { widthInches: 20.5, lengthFt: 16.5, name: 'US Single (20.5\" × 16.5')' },\n        'grasscloth36': { widthInches: 36, lengthFt: 24, name: 'Grasscloth (36\" × 24')' }\n      };\n\n      function calcWallpaper() {\n        var perimeterFt = 0;\n        if (isAccentWall) {\n          perimeterFt = parseFloat(document.getElementById('accentWidth').value) || 0;\n        } else {\n          var len = parseFloat(document.getElementById('roomLength').value) || 0;\n          var wid = parseFloat(document.getElementById('roomWidth').value) || 0;\n          perimeterFt = 2 * (len + wid);\n        }\n\n        var wallHFt = parseFloat(document.getElementById('wallHeight').value) || 9;\n        var rollType = document.getElementById('rollStandard').value;\n        var patType = document.getElementById('patternType').value;\n        var patRepeatInches = parseFloat(document.getElementById('patternRepeat').value) || 0;\n\n        var spec = rollSpecs[rollType] || rollSpecs['usDouble'];\n        var rollWidthInches = spec.widthInches;\n        var rollLengthInches = spec.lengthFt * 12;\n\n        // Raw strip height in inches with 4\" trim margin\n        var rawHeightInches = (wallHFt * 12) + 4;\n\n        // Pattern repeat factor\n        var factoredCutInches = rawHeightInches;\n        if (patType !== 'random' && patRepeatInches > 0) {\n          var repeatSteps = Math.ceil(rawHeightInches / patRepeatInches);\n          factoredCutInches = repeatSteps * patRepeatInches;\n          if (patType === 'drop') {\n            factoredCutInches += (patRepeatInches / 2);\n          }\n        }\n\n        var cutFt = Math.floor(factoredCutInches / 12);\n        var cutIn = Math.round(factoredCutInches % 12);\n\n        // Strips per roll\n        var stripsPerRoll = Math.max(1, Math.floor(rollLengthInches / factoredCutInches));\n\n        // Total strips required\n        var totalPerimeterInches = perimeterFt * 12;\n        var totalStrips = Math.max(1, Math.ceil(totalPerimeterInches / rollWidthInches));\n\n        // Rolls needed\n        var netRolls = Math.ceil(totalStrips / stripsPerRoll);\n        var rollsToOrder = netRolls + 1; // 1 spare roll\n\n        var grossSqFt = perimeterFt * wallHFt;\n        var primerGal = Math.max(1, Math.ceil(grossSqFt / 400));\n        var pasteGal = Math.max(1, Math.ceil(grossSqFt / 250));\n\n        // Update DOM\n        document.getElementById('rollsToOrderCount').textContent = rollsToOrder + ' Rolls';\n        document.getElementById('rollsNetCount').textContent = netRolls + ' Net + 1 Spare Attic Roll';\n        document.getElementById('verticalStripsCount').textContent = totalStrips + ' Strips';\n        document.getElementById('stripsPerRollVal').textContent = stripsPerRoll + ' Strips per Roll (' + spec.name + ')';\n\n        document.getElementById('grossSurfaceArea').textContent = Math.round(grossSqFt) + ' sq ft';\n        document.getElementById('cutLengthPerStrip').textContent = cutFt + ' ft ' + cutIn + ' in';\n        document.getElementById('wallpaperPrimerGal').textContent = primerGal + ' Gallon' + (primerGal > 1 ? 's' : '') + ' (~400 sq ft/gal)';\n        document.getElementById('wallpaperPasteGal').textContent = pasteGal + ' Gallon' + (pasteGal > 1 ? 's' : '') + ' (~250 sq ft/gal)';\n\n        renderElevationSvg(totalStrips, rollWidthInches, patRepeatInches);\n      }\n\n      function renderElevationSvg(totalStrips, rollWidth, repeat) {\n        var svg = document.getElementById('wallpaperElevationSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n\n        // Room Wall Boundary\n        svgHtml += '<rect x=\"60\" y=\"30\" width=\"680\" height=\"200\" fill=\"#f8fafc\" stroke=\"var(--border)\" stroke-width=\"2\" rx=\"4\"/>';\n\n        // Ceiling and Baseboard bands\n        svgHtml += '<rect x=\"60\" y=\"30\" width=\"680\" height=\"15\" fill=\"#e2e8f0\"/>';\n        svgHtml += '<text x=\"75\" y=\"42\" fill=\"var(--fg)\" font-size=\"10\" font-weight=\"bold\">Ceiling Line (2\" Top Trimming Allowance)</text>';\n\n        svgHtml += '<rect x=\"60\" y=\"215\" width=\"680\" height=\"15\" fill=\"#cbd5e1\"/>';\n        svgHtml += '<text x=\"75\" y=\"227\" fill=\"var(--fg)\" font-size=\"10\" font-weight=\"bold\">Baseboard Line (2\" Bottom Trimming Allowance)</text>';\n\n        // Display up to 8 strips\n        var dispStrips = Math.min(8, totalStrips);\n        var stripW = 680 / dispStrips;\n\n        for (var i = 0; i < dispStrips; i++) {\n          var sx = 60 + (i * stripW);\n          var fillCol = (i % 2 === 0) ? '#e0f2fe' : '#f0f9ff';\n          svgHtml += '<rect x=\"' + sx + '\" y=\"45\" width=\"' + stripW + '\" height=\"170\" fill=\"' + fillCol + '\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/>';\n          svgHtml += '<text x=\"' + (sx + (stripW / 2)) + '\" y=\"70\" text-anchor=\"middle\" fill=\"#0284c7\" font-size=\"11\" font-weight=\"bold\">Drop #' + (i + 1) + '</text>';\n\n          // Horizontal pattern repeat lines\n          for (var r = 0; r < 3; r++) {\n            var ry = 95 + (r * 40);\n            svgHtml += '<line x1=\"' + (sx + 5) + '\" y1=\"' + ry + '\" x2=\"' + (sx + stripW - 5) + '\" y2=\"' + ry + '\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"4,4\"/>';\n            svgHtml += '<circle cx=\"' + (sx + (stripW / 2)) + '\" cy=\"' + ry + '\" r=\"3\" fill=\"#0284c7\" opacity=\"0.6\"/>';\n          }\n        }\n\n        // Plumb line indicator on strip 1\n        svgHtml += '<line x1=\"100\" y1=\"45\" x2=\"100\" y2=\"215\" stroke=\"#ef4444\" stroke-width=\"2\" stroke-dasharray=\"6,4\"/>';\n        svgHtml += '<text x=\"105\" y=\"160\" fill=\"#ef4444\" font-size=\"9\" font-weight=\"bold\">True Plumb Line</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyWallpaperTakeoff() {\n        var rolls = document.getElementById('rollsToOrderCount').textContent;\n        var net = document.getElementById('rollsNetCount').textContent;\n        var strips = document.getElementById('verticalStripsCount').textContent;\n        var stripsRoll = document.getElementById('stripsPerRollVal').textContent;\n        var cut = document.getElementById('cutLengthPerStrip').textContent;\n        var primer = document.getElementById('wallpaperPrimerGal').textContent;\n        var paste = document.getElementById('wallpaperPasteGal').textContent;\n        var rollText = document.getElementById('rollStandard').options[document.getElementById('rollStandard').selectedIndex].text;\n        var patText = document.getElementById('patternType').options[document.getElementById('patternType').selectedIndex].text;\n\n        var text = '📋 Wallpaper Material Order Sheet\\n' +\n          '• Packaging: ' + rollText + '\\n' +\n          '• Pattern Match: ' + patText + '\\n' +\n          '• Total Rolls to Order: ' + rolls + ' (' + net + ')\\n' +\n          '• Total Vertical Drops: ' + strips + '\\n' +\n          '• Strips per Roll: ' + stripsRoll + '\\n' +\n          '• Cut Length per Strip: ' + cut + '\\n' +\n          '• Acrylic Sizing Primer: ' + primer + '\\n' +\n          '• Clear Adhesive Paste: ' + paste + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/wallpaper-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyWallpaperBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      // Application area toggle\n      document.getElementById('wallFullRoomBtn').addEventListener('click', function() {\n        isAccentWall = false;\n        document.getElementById('wallFullRoomBtn').style.background = '#3b82f6';\n        document.getElementById('wallFullRoomBtn').style.color = '#ffffff';\n        document.getElementById('wallFullRoomBtn').style.borderColor = '#3b82f6';\n        document.getElementById('wallAccentBtn').style.background = 'var(--bg)';\n        document.getElementById('wallAccentBtn').style.color = 'var(--fg)';\n        document.getElementById('wallAccentBtn').style.borderColor = 'var(--border)';\n        document.getElementById('fullRoomDims').style.display = 'grid';\n        document.getElementById('accentWallDims').style.display = 'none';\n        calcWallpaper();\n      });\n\n      document.getElementById('wallAccentBtn').addEventListener('click', function() {\n        isAccentWall = true;\n        document.getElementById('wallAccentBtn').style.background = '#3b82f6';\n        document.getElementById('wallAccentBtn').style.color = '#ffffff';\n        document.getElementById('wallAccentBtn').style.borderColor = '#3b82f6';\n        document.getElementById('wallFullRoomBtn').style.background = 'var(--bg)';\n        document.getElementById('wallFullRoomBtn').style.color = 'var(--fg)';\n        document.getElementById('wallFullRoomBtn').style.borderColor = 'var(--border)';\n        document.getElementById('fullRoomDims').style.display = 'none';\n        document.getElementById('accentWallDims').style.display = 'block';\n        calcWallpaper();\n      });\n\n      var inputs = ['roomLength', 'roomWidth', 'accentWidth', 'wallHeight', 'rollStandard', 'patternType', 'patternRepeat'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcWallpaper);\n          el.addEventListener('change', calcWallpaper);\n        }\n      });\n\n      document.getElementById('copyWallpaperBtn').addEventListener('click', copyWallpaperTakeoff);\n\n      calcWallpaper();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'wallpaper-calculator.html'), renderTradePage({
    title: "Wallpaper Calculator — Pattern Repeat, Rolls & Strip Yield | Digital Tools Shed",
    metaDesc: "Free professional wallpaper calculator. Calculates exact double rolls, vertical strips, pattern repeats (straight & drop match), trimming waste, and primer adhesive for interior rooms.",
    canonical: `${DOMAIN}/calc/wallpaper-calculator`,
    bodyContent: wallpaperBody,
    currentPath: '/calc/wallpaper-calculator',
    faq: [
  {
    "q": "What is the difference between a single roll and a double roll of wallpaper?",
    "a": "Wallpaper pricing is often quoted per \"single roll,\" but almost all wallpaper is manufactured and packaged as continuous \"double rolls.\" A US double roll is 27 inches wide by 27 feet long (~60 sq ft). Buying single rolls usually results in receiving half the paper you anticipated."
  },
  {
    "q": "How does pattern repeat affect how much wallpaper I need?",
    "a": "Pattern repeat forces you to cut each strip longer than the wall height to align adjacent motifs. On an 8-foot wall with a 24-inch pattern repeat, each strip must be cut to 10 feet to match the pattern, wasting 2 feet per strip and reducing a roll's yield from 3 strips down to 2 strips (a 33% loss)."
  },
  {
    "q": "Why should I not deduct doors and windows from my wallpaper calculation?",
    "a": "Wallpaper is installed in continuous vertical drops. Cutting around windows and doors creates small cutoff scraps that cannot be used elsewhere in the room because the pattern would not match. Deducting window area leads directly to severe wallpaper shortages."
  },
  {
    "q": "What is a drop match or half-drop match in wallpaper?",
    "a": "In a straight match, the design repeats at the exact same horizontal height across every strip. In a half-drop match, the pattern repeats diagonally, shifting down half the repeat length on every alternating strip. This requires extra trimming allowance on every other strip."
  },
  {
    "q": "Why do I need to check the wallpaper run or dye lot number?",
    "a": "Wallpaper inks are mixed in batches. Rolls from different run or dye lot numbers often have subtle color, contrast, or sheen variations that become jarringly obvious once pasted side-by-side under natural window sunlight. Always ensure all rolls have identical lot numbers."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. FENCE MATERIALS CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const fenceBody = "\n<div class=\"tool-container\" style=\"max-width:1080px;margin:0 auto;padding:1.5rem 1rem;\">\n  <div style=\"margin-bottom:2rem;text-align:center;\">\n    <h1 style=\"font-size:2.15rem;font-weight:800;margin-bottom:0.6rem;letter-spacing:-0.02em;\">Fence Materials & Post Calculator</h1>\n    <p style=\"color:var(--text-muted);font-size:1.05rem;max-width:760px;margin:0 auto;line-height:1.6;\">\n      Calculate exact lumber takeoff, post hole concrete bags, 2x4 rails, dog-ear pickets, and structural hardware. Configured for residential privacy, shadowbox, and post-and-rail installations.\n    </p>\n  </div>\n\n  <div style=\"display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;\" class=\"calc-grid\">\n    <!-- INPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n      <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;\">\n        <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"/><line x1=\"8\" y1=\"4\" x2=\"8\" y2=\"20\"/><line x1=\"16\" y1=\"4\" x2=\"16\" y2=\"20\"/></svg>\n        Fence Dimensions & Specifications\n      </h2>\n\n      <!-- TOTAL RUN & HEIGHT -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"fenceLength\">Total Fence Length (Feet)</label>\n          <input type=\"number\" id=\"fenceLength\" value=\"150\" min=\"1\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"fenceHeight\">Finished Fence Height</label>\n          <select id=\"fenceHeight\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"6\" selected>6-Foot (Standard Privacy)</option>\n            <option value=\"8\">8-Foot (Commercial / Security)</option>\n            <option value=\"4\">4-Foot (Garden / Picket)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- POST SPACING & STYLE -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"postSpacing\">Post On-Center Spacing</label>\n          <select id=\"postSpacing\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"8\" selected>8-Foot On-Center (Standard 2x4 Rails)</option>\n            <option value=\"6\">6-Foot On-Center (High-Wind / Heavy)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"fenceStyle\">Fence Style / Infill</label>\n          <select id=\"fenceStyle\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"privacy\" selected>Wood Privacy (Side-by-Side Dog-Ear)</option>\n            <option value=\"shadowbox\">Shadowbox / Board-on-Board (1.5\" Overlap)</option>\n            <option value=\"splitrail\">Post and Rail (No Pickets / Agricultural)</option>\n            <option value=\"picket\">Classic Picket (3.5\" with 2\" Gaps)</option>\n          </select>\n        </div>\n      </div>\n\n      <!-- CORNERS & GATES -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"cornerPostCount\">Corner / Direction Changes</label>\n          <input type=\"number\" id=\"cornerPostCount\" value=\"4\" min=\"0\" max=\"20\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"gateCount\">Gates (4-ft Walk Gate)</label>\n          <input type=\"number\" id=\"gateCount\" value=\"1\" min=\"0\" max=\"10\" step=\"1\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;\">\n        </div>\n      </div>\n\n      <!-- POST EMBEDMENT & RAILS -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;\">\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"railsPerBay\">Horizontal 2x4 Rails per Bay</label>\n          <select id=\"railsPerBay\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"3\" selected>3 Rails (Recommended for 6ft)</option>\n            <option value=\"2\">2 Rails (Light 4ft fences only)</option>\n            <option value=\"4\">4 Rails (Heavy 8ft privacy)</option>\n          </select>\n        </div>\n        <div>\n          <label style=\"display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;\" for=\"concreteBagsPerHole\">Concrete per Post Hole</label>\n          <select id=\"concreteBagsPerHole\" style=\"width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;\">\n            <option value=\"1.5\">1.5 Bags 50-lb Fast-Setting (~24\" Hole)</option>\n            <option value=\"2.0\" selected>2.0 Bags 50-lb Fast-Setting (~30\"-36\" Frost)</option>\n            <option value=\"2.5\">2.5 Bags 50-lb Fast-Setting (~42\" Deep)</option>\n          </select>\n        </div>\n      </div>\n    </div>\n\n    <!-- SUMMARY & OUTPUT COLUMN -->\n    <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;\">\n      <div>\n        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;\">\n          <h2 style=\"font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;\">\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg>\n            Lumber & Hardware Takeoff\n          </h2>\n          <button id=\"copyFenceBtn\" style=\"padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);\">\n            <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>\n            <span>Copy Takeoff</span>\n          </button>\n        </div>\n\n        <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;\">\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Total Posts to Buy</span>\n            <span id=\"totalPostsCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;\">21 Posts</span>\n            <span id=\"postTypesDetail\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">19 Line (4x4) + 2 Gate (6x6)</span>\n          </div>\n\n          <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;\">\n            <span style=\"font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;\">Dog-Ear Pickets (1x6)</span>\n            <span id=\"totalPicketsCount\" style=\"font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;\">348 Pickets</span>\n            <span id=\"picketsDetail\" style=\"font-size:0.8rem;color:var(--text-muted);font-weight:600;\">incl. 10% cutting waste</span>\n          </div>\n        </div>\n\n        <!-- LUMBER & CONCRETE LEDGER -->\n        <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;\">\n          <div style=\"font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;\">Framing Lumber & Concrete Specification</div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Horizontal 2x4 Rails (8-ft or 10-ft):</span>\n            <strong id=\"railsTakeoffVal\" style=\"font-family:var(--mono);color:#10b981;\">60 Boards (3 per bay)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Fast-Setting Concrete (50-lb Bags):</span>\n            <strong id=\"concreteBagsTotalVal\" style=\"font-family:var(--mono);color:#f59e0b;\">42 Bags (2,100 lbs)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;\">\n            <span>Post Length to Order:</span>\n            <strong id=\"postLengthVal\" style=\"font-family:var(--mono);color:var(--fg);\">8-Foot Posts (30\" in ground)</strong>\n          </div>\n          <div style=\"display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;\">\n            <span>Picket Fasteners (Ring-Shank Nails):</span>\n            <strong id=\"nailsBoxVal\" style=\"font-family:var(--mono);color:var(--fg);\">~2,100 Nails (2 × 5 lb boxes)</strong>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <!-- INTERACTIVE SVG FENCE ELEVATION SCHEMATIC -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);\">\n    <h2 style=\"font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\"/></svg>\n      Fence Bay Elevation & Footing Embedment Detail\n    </h2>\n    <p style=\"color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;\">\n      Structural elevation showing 8-ft bay spacing, 3 horizontal 2x4 rails, dog-ear picket alignment, concrete bell footing, and mandatory 4\" bottom gravel drainage pad.\n    </p>\n\n    <div style=\"overflow-x:auto;\">\n      <svg id=\"fenceElevationSvg\" viewBox=\"0 0 800 320\" style=\"width:100%;height:auto;min-width:600px;font-family:var(--mono);\"></svg>\n    </div>\n  </div>\n\n  <!-- MATHEMATICAL & STRUCTURAL DERIVATIONS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);\">Fence Spacing, Rail Loading & Picket Derivations</h2>\n    <p style=\"color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;\">\n      Fence structural integrity is governed by wind shear loads and wet lumber gravity deflection. A 6-foot solid privacy fence acts as a massive sail under wind gusts. Posts must be buried to a minimum depth of one-third their total length to establish an in-ground cantilever pivot resistant to overturning:\n    </p>\n\n    <div style=\"background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;\">\n      <strong>1. Bay Count & Post Sizing:</strong><br>\n      N_{\\text{bays}} = \\left\\lceil \\frac{\\text{Length (feet)}}{\\text{Spacing (feet)}} \\right\\rceil<br>\n      N_{\\text{posts}} = N_{\\text{bays}} + 1 + N_{\\text{corners}} + N_{\\text{gates}}<br>\n      \\text{Post Embedment: } D_{\\text{hole}} = \\max\\left( \\frac{H_{\\text{fence}}}{3}, \\ \\text{Local Frost Line (30'' - 36'')} \\right)<br><br>\n      <strong>2. Horizontal 2x4 Rails:</strong><br>\n      N_{\\text{rails}} = N_{\\text{bays}} \\times \\text{Rails per Bay (3 for 6-ft, 4 for 8-ft)}<br><br>\n      <strong>3. Picket Takeoff (Standard 5.5'' Dog-Ear):</strong><br>\n      \\text{Pickets per Linear Foot} = \\frac{12''}{5.5'' + 0.125'' \\text{ (shrinkage gap)}} \\approx 2.13 \\text{ pickets/ft}<br>\n      N_{\\text{pickets}} = \\left\\lceil \\Big( \\text{Length} - (4 \\times N_{\\text{gates}}) \\Big) \\times 2.13 \\times 1.10 \\text{ (waste)} \\right\\rceil<br>\n      \\text{For Shadowbox, multiply pickets by } 1.35 \\text{ to account for back-and-front overlap.}<br><br>\n      <strong>4. Concrete Takeoff:</strong><br>\n      \\text{Total Bags} = N_{\\text{posts}} \\times \\text{Bags per Hole (typically 2 bags of 50-lb fast-setting)}\n    </div>\n  </div>\n\n  <!-- 5 CRITICAL FENCE TRAPS -->\n  <div style=\"background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;\">\n    <h2 style=\"font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);\">5 Critical Fence Construction & Post Rot Pitfalls</h2>\n\n    <div style=\"display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;\">\n      <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;\">1. Encasing the Bottom of the Post in a Concrete \"Cup\"</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Pouring concrete around and beneath a wood post creates an impermeable concrete cup. Rainwater running down the post enters the grain and cannot drain out the bottom, keeping the wood permanently soaked. Within 4 to 6 years, the post rots completely off at ground level. Always dump 4 inches of crushed gravel into the hole first so water drains into the earth.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;\">2. Digging Above the Regional Frost Line</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          In freezing climates, digging post holes only 24 inches deep leaves the concrete collar above the frost depth. As freezing soil expands, it grips the concrete plug and heaves the post 1 to 3 inches out of the ground every winter. Posts must penetrate 6 inches below the local municipal frost depth (often 36\" to 42\").\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;\">3. Using Only 2 Rails on a 6-Foot Privacy Fence</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Attempting to save money by using only a top and bottom rail on a 6-foot fence is a major structural mistake. Pickets span 5 feet between unsupported fasteners. As green treated pickets dry under the summer sun, they cup, twist, and pull free from the nails. Three horizontal 2x4 rails are strictly required to keep pickets flat.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;\">4. Fastening Treated Lumber with Electro-Galvanized Nails</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          Modern pressure-treated wood is infused with copper azole (CA-B/C) or ACQ preservatives. Copper is galvanic poison to thin electro-galvanized coatings. Within 3 to 5 years, electro-galvanized screws corrode into black powder and snap off. Always use <strong>hot-dipped galvanized (HDG)</strong> or <strong>304/316 stainless steel</strong> fasteners.\n        </p>\n      </div>\n\n      <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n        <h3 style=\"font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;\">5. Hanging Walk Gates on Standard 4x4 Posts</h3>\n        <p style=\"font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;\">\n          A 4-foot wide cedar gate weighs over 80 pounds. Cantilevered swinging leverage causes standard 4x4 posts to flex and bow over time, causing the gate latch to misalign and drag along the dirt. Always upgrade gate hinge posts to heavy-duty <strong>6x6 pressure-treated timbers</strong> buried 36\" deep with 3 bags of concrete.\n        </p>\n      </div>\n\n    </div>\n  </div>\n\n  <!-- SCRIPT ENGINE -->\n  <script>\n    (function() {\n      function calcFence() {\n        var len = parseFloat(document.getElementById('fenceLength').value) || 0;\n        var h = parseFloat(document.getElementById('fenceHeight').value) || 6;\n        var spacing = parseFloat(document.getElementById('postSpacing').value) || 8;\n        var style = document.getElementById('fenceStyle').value;\n        var corners = parseInt(document.getElementById('cornerPostCount').value) || 0;\n        var gates = parseInt(document.getElementById('gateCount').value) || 0;\n        var railsPerBay = parseInt(document.getElementById('railsPerBay').value) || 3;\n        var bagsPerHole = parseFloat(document.getElementById('concreteBagsPerHole').value) || 2.0;\n\n        var numBays = Math.max(1, Math.ceil(len / spacing));\n        var linePosts = Math.max(1, numBays - 1 - corners);\n        var gatePosts = gates * 2;\n        var totalPosts = numBays + 1 + corners + gatePosts;\n\n        var totalRails = numBays * railsPerBay;\n\n        // Pickets calculation\n        var pickets = 0;\n        if (style === 'privacy') {\n          var netFenceFt = Math.max(0, len - (gates * 4));\n          pickets = Math.ceil(netFenceFt * 2.13 * 1.10); // 5.5\" pickets + 10% waste\n        } else if (style === 'shadowbox') {\n          var netFenceFt = Math.max(0, len - (gates * 4));\n          pickets = Math.ceil(netFenceFt * 2.85 * 1.10); // 1.5\" overlap front/back\n        } else if (style === 'picket') {\n          var netFenceFt = Math.max(0, len - (gates * 4));\n          pickets = Math.ceil(netFenceFt * 2.18 * 1.10); // 3.5\" pickets + 2\" gaps\n        } else {\n          pickets = 0; // Split rail\n        }\n\n        var totalConcreteBags = Math.ceil(totalPosts * bagsPerHole);\n        var concreteLbs = totalConcreteBags * 50;\n\n        var postLenFt = (h === 4) ? 7 : ((h === 6) ? 8 : 11);\n        var inGroundInches = (postLenFt - h) * 12;\n\n        var totalNails = pickets * (railsPerBay * 2);\n        var nailBoxes5lb = Math.max(1, Math.ceil(totalNails / 1000));\n\n        // Update DOM\n        document.getElementById('totalPostsCount').textContent = totalPosts + ' Posts';\n        document.getElementById('postTypesDetail').textContent = (totalPosts - gatePosts) + ' Line/Corner (4x4) + ' + gatePosts + ' Gate (6x6)';\n        document.getElementById('totalPicketsCount').textContent = (pickets > 0 ? pickets + ' Pickets' : 'None (Post & Rail)');\n        document.getElementById('picketsDetail').textContent = (pickets > 0 ? 'incl. 10% cutting waste' : 'Agricultural Split Rail');\n\n        document.getElementById('railsTakeoffVal').textContent = totalRails + ' Boards (' + railsPerBay + ' per bay)';\n        document.getElementById('concreteBagsTotalVal').textContent = totalConcreteBags + ' Bags (' + concreteLbs.toLocaleString() + ' lbs)';\n        document.getElementById('postLengthVal').textContent = postLenFt + \"-Foot Posts (~\" + inGroundInches + '\" in ground)';\n        document.getElementById('nailsBoxVal').textContent = (pickets > 0 ? '~' + totalNails.toLocaleString() + ' Nails (' + nailBoxes5lb + ' × 5 lb boxes)' : 'Hardware Brackets');\n\n        renderFenceSvg(railsPerBay, h, style);\n      }\n\n      function renderFenceSvg(rails, height, style) {\n        var svg = document.getElementById('fenceElevationSvg');\n        if (!svg) return;\n\n        var svgHtml = '';\n\n        // Ground line\n        svgHtml += '<line x1=\"40\" y1=\"210\" x2=\"760\" y2=\"210\" stroke=\"#78716c\" stroke-width=\"4\"/>';\n        svgHtml += '<text x=\"50\" y=\"235\" fill=\"#78716c\" font-size=\"11\" font-weight=\"bold\">Ground Surface Line</text>';\n\n        // Concrete footings & Gravel pads (2 posts)\n        var postPositions = [180, 560];\n        postPositions.forEach(function(px) {\n          // Gravel pad\n          svgHtml += '<rect x=\"' + (px - 22) + '\" y=\"290\" width=\"44\" height=\"20\" fill=\"#a8a29e\" rx=\"2\"/>';\n          // Concrete bell\n          svgHtml += '<polygon points=\"' + (px - 22) + ',210 ' + (px + 22) + ',210 ' + (px + 30) + ',290 ' + (px - 30) + ',290\" fill=\"#cbd5e1\" opacity=\"0.8\"/>';\n          // Post below ground\n          svgHtml += '<rect x=\"' + (px - 10) + '\" y=\"210\" width=\"20\" height=\"80\" fill=\"#b45309\"/>';\n        });\n\n        svgHtml += '<text x=\"120\" y=\"275\" fill=\"var(--fg)\" font-size=\"10\">Concrete Bell Footing</text>';\n        svgHtml += '<text x=\"120\" y=\"305\" fill=\"#10b981\" font-size=\"10\" font-weight=\"bold\">4\" Gravel Drain Pad</text>';\n\n        // Posts above ground\n        postPositions.forEach(function(px) {\n          svgHtml += '<rect x=\"' + (px - 10) + '\" y=\"50\" width=\"20\" height=\"160\" fill=\"#d97706\" rx=\"1\"/>';\n        });\n\n        // Horizontal 2x4 rails\n        var railYs = (rails === 2) ? [85, 175] : ((rails === 3) ? [75, 130, 185] : [65, 105, 145, 185]);\n        railYs.forEach(function(ry) {\n          svgHtml += '<rect x=\"190\" y=\"' + ry + '\" width=\"360\" height=\"12\" fill=\"#b45309\" stroke=\"#78350f\" stroke-width=\"1\"/>';\n        });\n\n        // Pickets (if privacy/shadowbox)\n        if (style !== 'splitrail') {\n          for (var p = 0; p < 15; p++) {\n            var picketX = 205 + (p * 22);\n            // Dog-ear shape\n            svgHtml += '<polygon points=\"' + picketX + ',58 ' + (picketX + 4) + ',52 ' + (picketX + 14) + ',52 ' + (picketX + 18) + ',58 ' + (picketX + 18) + ',205 ' + picketX + ',205\" fill=\"#fde68a\" stroke=\"#d97706\" stroke-width=\"1\"/>';\n          }\n        }\n\n        // Dimension Arrow\n        svgHtml += '<line x1=\"180\" y1=\"35\" x2=\"560\" y2=\"35\" stroke=\"#3b82f6\" stroke-width=\"2\"/>';\n        svgHtml += '<line x1=\"180\" y1=\"30\" x2=\"180\" y2=\"40\" stroke=\"#3b82f6\" stroke-width=\"2\"/>';\n        svgHtml += '<line x1=\"560\" y1=\"30\" x2=\"560\" y2=\"40\" stroke=\"#3b82f6\" stroke-width=\"2\"/>';\n        svgHtml += '<text x=\"350\" y=\"28\" fill=\"#3b82f6\" font-size=\"12\" font-weight=\"bold\">8'-0\" On-Center Post Bay</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyFenceTakeoff() {\n        var posts = document.getElementById('totalPostsCount').textContent;\n        var detail = document.getElementById('postTypesDetail').textContent;\n        var pickets = document.getElementById('totalPicketsCount').textContent;\n        var rails = document.getElementById('railsTakeoffVal').textContent;\n        var concrete = document.getElementById('concreteBagsTotalVal').textContent;\n        var postLen = document.getElementById('postLengthVal').textContent;\n        var nails = document.getElementById('nailsBoxVal').textContent;\n        var styleText = document.getElementById('fenceStyle').options[document.getElementById('fenceStyle').selectedIndex].text;\n        var heightText = document.getElementById('fenceHeight').options[document.getElementById('fenceHeight').selectedIndex].text;\n\n        var text = '📋 Fence Materials Order Sheet\\n' +\n          '• Style: ' + styleText + ' (' + heightText + ')\\n' +\n          '• Total Posts: ' + posts + ' (' + detail + ')\\n' +\n          '• Post Board Length: ' + postLen + '\\n' +\n          '• Horizontal 2x4 Rails: ' + rails + '\\n' +\n          '• Pickets Takeoff: ' + pickets + '\\n' +\n          '• Fast-Setting Concrete: ' + concrete + '\\n' +\n          '• Fasteners / Nails: ' + nails + '\\n\\n' +\n          'Calculated at digitaltoolsshed.com/calc/fence-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          var btn = document.getElementById('copyFenceBtn');\n          var orig = btn.innerHTML;\n          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';\n          setTimeout(function() { btn.innerHTML = orig; }, 2000);\n        });\n      }\n\n      var inputs = ['fenceLength', 'fenceHeight', 'postSpacing', 'fenceStyle', 'cornerPostCount', 'gateCount', 'railsPerBay', 'concreteBagsPerHole'];\n      inputs.forEach(function(id) {\n        var el = document.getElementById(id);\n        if (el) {\n          el.addEventListener('input', calcFence);\n          el.addEventListener('change', calcFence);\n        }\n      });\n\n      document.getElementById('copyFenceBtn').addEventListener('click', copyFenceTakeoff);\n\n      calcFence();\n    })();\n  </script>\n</div>\n";

  writeFileSync(join(calcDir, 'fence-calculator.html'), renderTradePage({
    title: "Fence Calculator — Posts, Rails, Pickets & Concrete Bags | Digital Tools Shed",
    metaDesc: "Free contractor fence calculator. Computes exact 4x4 and 6x6 posts, horizontal 2x4 rails, dog-ear pickets, fast-setting concrete bags, gate hardware, and frost-depth embedment.",
    canonical: `${DOMAIN}/calc/fence-calculator`,
    bodyContent: fenceBody,
    currentPath: '/calc/fence-calculator',
    faq: [
  {
    "q": "How far apart should fence posts be spaced?",
    "a": "Standard fence posts are spaced 8 feet on-center (meaning 8 feet from the center of one post to the center of the next). In areas with high wind loads or when using heavy wet pressure-treated pickets, 6-foot spacing is recommended to prevent rails from sagging."
  },
  {
    "q": "How deep should fence post holes be dug?",
    "a": "As a structural rule of thumb, fence post holes must be dug to a depth equal to at least one-third (1/3) of the post's above-ground height. For a 6-foot fence, posts should be buried 24 to 30 inches deep. In northern zones with freezing winters, post holes must extend below the municipal frost line (often 36 to 42 inches)."
  },
  {
    "q": "How many bags of concrete do I need for each fence post?",
    "a": "A standard 4x4 fence post buried 24 to 30 inches in a 9-inch diameter hole requires approximately 1.5 to 2 bags of 50-lb fast-setting concrete. A 6x6 gate post in a 12-inch hole requires 3 to 4 bags."
  },
  {
    "q": "Why should I put gravel at the bottom of a fence post hole?",
    "a": "Pouring concrete completely under the bottom of a wood post creates an impermeable cup that traps rainwater against the end-grain. Dumping 4 to 6 inches of crushed #57 gravel at the bottom allows water to drain naturally away from the wood, doubling post lifespan."
  },
  {
    "q": "How many pickets do I need per foot for a privacy fence?",
    "a": "Standard 1x6 wood pickets measure 5.5 inches in actual width. With a standard 1/8-inch allowance for shrinkage as the wood dries, you need approximately 2.13 pickets per linear foot. For a shadowbox (board-on-board) fence with a 1.5-inch overlap on alternating sides, you need approximately 2.85 pickets per linear foot."
  }
]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 15. FLOORING CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const flooringBody = `
<div class="tool-container" style="max-width:1080px;margin:0 auto;padding:1.5rem 1rem;">
  <div style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-size:2.15rem;font-weight:800;margin-bottom:0.6rem;letter-spacing:-0.02em;">Flooring Calculator — Square Footage, Boxes &amp; Underlayment</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:760px;margin:0 auto;line-height:1.6;">
      Calculate exact flooring takeoff, cartons to purchase, cut waste allowances (10% straight to 20% herringbone), vapor barrier underlayment rolls, transition T-moldings, and perimeter quarter-round shoe molding.
    </p>
  </div>

  <div style="display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;" class="calc-grid">
    <!-- INPUT COLUMN -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
      <h2 style="font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        Room Dimensions &amp; Flooring Material
      </h2>

      <!-- ROOM LENGTH & WIDTH -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="roomLength">Room Length (Feet)</label>
          <input type="number" id="roomLength" value="20" min="1" max="200" step="0.5" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="roomWidth">Room Width (Feet)</label>
          <input type="number" id="roomWidth" value="15" min="1" max="200" step="0.5" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
      </div>

      <!-- ADDITIONAL AREA (CLOSETS / HALLS) -->
      <div style="margin-bottom:1.25rem;">
        <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="extraSqFt">Additional Closets / Alcoves (Sq Ft)</label>
        <input type="number" id="extraSqFt" value="25" min="0" max="1000" step="1" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
      </div>

      <!-- FLOORING TYPE & BOX COVERAGE -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="flooringType">Flooring Material</label>
          <select id="flooringType" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
            <option value="lvp" selected>Luxury Vinyl Plank (LVP / SPC)</option>
            <option value="engineered">Engineered Hardwood</option>
            <option value="solid_hardwood">Solid Hardwood (Oak / Maple)</option>
            <option value="laminate">Laminate Flooring</option>
            <option value="tile">Porcelain / Ceramic Tile</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="sqftPerBox">Sq Ft Per Carton / Box</label>
          <input type="number" id="sqftPerBox" value="23.8" min="5" max="50" step="0.1" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
      </div>

      <!-- LAYOUT PATTERN & WASTE -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="layPattern">Installation Pattern</label>
          <select id="layPattern" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
            <option value="0.10" selected>Straight Lay (Standard 10% Waste)</option>
            <option value="0.15">Diagonal / 45° Angle (15% Waste)</option>
            <option value="0.20">Herringbone / Chevron (20% Waste)</option>
            <option value="0.08">Simple Rectangular Room (8% Waste)</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="doorwayCount">Doorway Openings (Transitions)</label>
          <input type="number" id="doorwayCount" value="2" min="0" max="20" step="1" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
      </div>

      <!-- PRICE PER SQ FT -->
      <div>
        <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="pricePerSqFt">Material Cost per Sq Ft ($ USD)</label>
        <input type="number" id="pricePerSqFt" value="3.79" min="0" max="100" step="0.05" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
      </div>
    </div>

    <!-- SUMMARY & OUTPUT COLUMN -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h2 style="font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Flooring Order Takeoff
          </h2>
          <button id="copyFlooringBtn" style="padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy Order Takeoff</span>
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;">Total Boxes to Order</span>
            <span id="totalBoxesCount" style="font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;">16 Boxes</span>
            <span id="boxesSubtext" style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">380.8 Total Sq Ft</span>
          </div>

          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;">Estimated Material Cost</span>
            <span id="totalFlooringCost" style="font-family:var(--mono);font-size:2rem;font-weight:800;color:#10b981;display:block;">$1,443.23</span>
            <span id="costPerSqFtLabel" style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">@ $3.79 / sq ft</span>
          </div>
        </div>

        <!-- ACCESSORIES & HARDWARE LEDGER -->
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
          <div style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Accessories &amp; Underlayment Takeoff</div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>True Net Room Area:</span>
            <strong id="netSqFtVal" style="font-family:var(--mono);">325.0 sq ft</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Waste Allowance Added:</span>
            <strong id="wasteSqFtVal" style="font-family:var(--mono);color:#f59e0b;">+32.5 sq ft (10%)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Underlayment Vapor Barrier:</span>
            <strong id="underlaymentRollsVal" style="font-family:var(--mono);color:#3b82f6;">4 Rolls (100 sq ft ea)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Baseboard / Quarter Round:</span>
            <strong id="baseboardFtVal" style="font-family:var(--mono);">77 Lin Ft (incl 10% waste)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;">
            <span>Doorway Transition T-Moldings:</span>
            <strong id="transitionVal" style="font-family:var(--mono);">2 Strips (72" ea)</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- INTERACTIVE SVG FLOOR PLAN SCHEMATIC -->
  <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
    <h2 style="font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
      Plank Stagger Layout &amp; Perimeter Expansion Gap
    </h2>
    <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;">
      Stagger visualizer demonstrating minimum 8-inch end-joint stagger, expansion space (1/4" to 3/8" perimeter gap), and doorway threshold transitions.
    </p>

    <div style="overflow-x:auto;">
      <svg id="flooringLayoutSvg" viewBox="0 0 800 260" style="width:100%;height:auto;min-width:600px;font-family:var(--mono);"></svg>
    </div>
  </div>

  <!-- MATHEMATICAL & ESTIMATING DERIVATIONS -->
  <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;">
    <h2 style="font-size:1.35rem;margin-top:0;margin-bottom:1rem;font-family:var(--serif);">Mathematical Takeoff &amp; Box Rounding Derivations</h2>
    <p style="color:var(--text-muted);font-size:0.95rem;line-height:1.6;margin-bottom:1rem;">
      Flooring material estimation requires discrete ceiling integer math. Manufacturers do not sell partial cartons; rounding down guarantees running short on the final rows when end-cuts cannot be recycled:
    </p>

    <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1.25rem;font-family:var(--mono);font-size:0.85rem;line-height:1.7;overflow-x:auto;">
      <strong>1. Net Room Square Footage:</strong><br>
      A_{\\text{net}} = (L_{\\text{room}} \\times W_{\\text{room}}) + A_{\\text{extra (closets)}}<br><br>
      <strong>2. Gross Area with Cut Waste Factor:</strong><br>
      A_{\\text{gross}} = A_{\\text{net}} \\times (1 + \\text{Waste Factor})<br>
      \\text{Where: Straight Lay = 10\\%, Diagonal = 15\\%, Herringbone = 20\\%}<br><br>
      <strong>3. Cartons / Boxes to Order (Ceiling Quantization):</strong><br>
      N_{\\text{boxes}} = \\left\\lceil \\frac{A_{\\text{gross}}}{\\text{Sq Ft per Box}} \\right\\rceil<br>
      A_{\\text{purchased}} = N_{\\text{boxes}} \\times \\text{Sq Ft per Box}<br><br>
      <strong>4. Perimeter Shoe Molding / Quarter Round:</strong><br>
      P_{\\text{room}} = 2 \\times (L_{\\text{room}} + W_{\\text{room}})<br>
      \\text{Linear Feet to Buy} = \\left\\lceil P_{\\text{room}} \\times 1.10 \\text{ (cutting waste)} \\right\\rceil<br><br>
      <strong>5. Vapor Barrier Underlayment:</strong><br>
      N_{\\text{rolls}} = \\left\\lceil \\frac{A_{\\text{net}}}{100 \\text{ sq ft per roll}} \\right\\rceil
    </div>
  </div>

  <!-- 5 CRITICAL FLOORING TRAPS -->
  <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;">
    <h2 style="font-size:1.35rem;margin-top:0;margin-bottom:1.25rem;font-family:var(--serif);">5 Critical Flooring Installation &amp; Failure Pitfalls</h2>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1.25rem;">
      <div class="trap-card" style="border-left: 4px solid #ef4444;">
        <h3 style="font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#ef4444;font-weight:700;">1. Skipping Material Acclimation</h3>
        <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;">
          Installing solid hardwood, laminate, or vinyl plank immediately after delivery from a cold truck causes severe buckling or joint separation. Hardwood requires 3 to 7 days inside the climate-controlled living space (65°F–75°F, 35%–55% relative humidity) to equilibrate moisture content before installation.
        </p>
      </div>

      <div class="trap-card" style="border-left: 4px solid #f59e0b;">
        <h3 style="font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#f59e0b;font-weight:700;">2. Neglecting Subfloor Flatness Tolerance</h3>
        <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;">
          All floating vinyl and laminate systems mandate that subfloors be flat to within <strong>3/16 inch across a 10-foot radius</strong> (or 1/8" over 6 feet). Installing over dips causes vertical deflection, hollow footfall sounds, and broken click-lock tongue-and-groove joints within months. Grind down high spots and use self-leveling underlayment.
        </p>
      </div>

      <div class="trap-card" style="border-left: 4px solid #10b981;">
        <h3 style="font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#10b981;font-weight:700;">3. Pinched Expansion Gaps &amp; Heavy Cabinets</h3>
        <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;">
          Floating floors expand and contract as humidity shifts across seasons. A 1/4" to 3/8" perimeter gap must be maintained along all walls and door jambs. Nailing baseboards directly into the flooring or placing 1,000-lb kitchen island cabinets on top of floating planks locks them in place, forcing the floor to tent and peak in the center.
        </p>
      </div>

      <div class="trap-card" style="border-left: 4px solid #3b82f6;">
        <h3 style="font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#3b82f6;font-weight:700;">4. The "H-Joint" &amp; "Stair-Step" Pattern Error</h3>
        <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;">
          Novice installers cut identical starter pieces, creating an artificial repeating "staircase" or "H-joint" pattern where seams on alternating rows line up exactly. This looks visually amateurish and compromises structural interlocking. End joints between adjacent rows must be staggered by at least 8 to 12 inches in a random, organic stagger.
        </p>
      </div>

      <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
        <h3 style="font-size:1rem;margin-top:0;margin-bottom:0.5rem;color:#8b5cf6;font-weight:700;">5. Concrete Slab Moisture Vapor Emissions (MVER)</h3>
        <p style="font-size:0.875rem;color:var(--text-muted);line-height:1.5;margin:0;">
          Installing vinyl or wood over a concrete slab without a 6-mil polyethylene vapor barrier allows invisible hydrostatic moisture vapor to migrate upward into the planks. This traps moisture beneath the vinyl, breeding black mold, destroying adhesive bonds, and causing cupping. Always conduct a calcium chloride moisture test.
        </p>
      </div>
    </div>
  </div>

  <!-- SCRIPT ENGINE -->
  <script>
    (function() {
      function calcFlooring() {
        var l = parseFloat(document.getElementById('roomLength').value) || 0;
        var w = parseFloat(document.getElementById('roomWidth').value) || 0;
        var extra = parseFloat(document.getElementById('extraSqFt').value) || 0;
        var boxSqFt = parseFloat(document.getElementById('sqftPerBox').value) || 20;
        var wastePct = parseFloat(document.getElementById('layPattern').value) || 0.10;
        var doors = parseInt(document.getElementById('doorwayCount').value) || 0;
        var price = parseFloat(document.getElementById('pricePerSqFt').value) || 0;

        var netSqFt = (l * w) + extra;
        var wasteSqFt = netSqFt * wastePct;
        var grossSqFt = netSqFt + wasteSqFt;

        var boxes = Math.max(1, Math.ceil(grossSqFt / boxSqFt));
        var totalPurchasedSqFt = boxes * boxSqFt;
        var totalCost = totalPurchasedSqFt * price;

        var underlaymentRolls = Math.max(1, Math.ceil(netSqFt / 100));
        var perimeterFt = (2 * (l + w));
        var baseboardFt = Math.ceil(perimeterFt * 1.10);

        // Update DOM
        document.getElementById('totalBoxesCount').textContent = boxes + ' Boxes';
        document.getElementById('boxesSubtext').textContent = totalPurchasedSqFt.toFixed(1) + ' Total Sq Ft';
        document.getElementById('totalFlooringCost').textContent = '
}

 + totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('costPerSqFtLabel').textContent = '@ 
}

 + price.toFixed(2) + ' / sq ft';

        document.getElementById('netSqFtVal').textContent = netSqFt.toFixed(1) + ' sq ft';
        document.getElementById('wasteSqFtVal').textContent = '+' + wasteSqFt.toFixed(1) + ' sq ft (' + Math.round(wastePct * 100) + '%)';
        document.getElementById('underlaymentRollsVal').textContent = underlaymentRolls + ' Rolls (100 sq ft ea)';
        document.getElementById('baseboardFtVal').textContent = baseboardFt + ' Lin Ft (incl 10% waste)';
        document.getElementById('transitionVal').textContent = doors + ' Strips (72" ea)';

        renderFlooringSvg();
      }

      function renderFlooringSvg() {
        var svg = document.getElementById('flooringLayoutSvg');
        if (!svg) return;

        var svgHtml = '';
        var svgW = 800;
        var svgH = 260;

        // Room boundary box
        var startX = 60;
        var startY = 30;
        var roomW = 680;
        var roomH = 190;

        // Wall perimeter
        svgHtml += '<rect x="' + (startX - 6) + '" y="' + (startY - 6) + '" width="' + (roomW + 12) + '" height="' + (roomH + 12) + '" fill="none" stroke="#475569" stroke-width="6" rx="2"/>';
        // Expansion gap indicator
        svgHtml += '<rect x="' + startX + '" y="' + startY + '" width="' + roomW + '" height="' + roomH + '" fill="var(--bg)" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>';

        // Staggered planks (4 rows)
        var rowH = 42;
        var rowStarts = [0, 80, 160, 40]; // Stagger offsets
        var plankLen = 190;

        for (var r = 0; r < 4; r++) {
          var y = startY + 6 + (r * rowH);
          var offset = rowStarts[r];
          var x = startX + 6;

          // First partial plank if offset
          if (offset > 0) {
            svgHtml += '<rect x="' + x + '" y="' + y + '" width="' + (offset - 3) + '" height="' + (rowH - 6) + '" fill="#d97706" stroke="#78350f" stroke-width="1.5" rx="2"/>';
            x += offset;
          }

          while (x + plankLen < startX + roomW - 6) {
            svgHtml += '<rect x="' + x + '" y="' + y + '" width="' + (plankLen - 3) + '" height="' + (rowH - 6) + '" fill="#f59e0b" stroke="#78350f" stroke-width="1.5" rx="2"/>';
            x += plankLen;
          }

          // Final end piece
          var remaining = (startX + roomW - 6) - x;
          if (remaining > 5) {
            svgHtml += '<rect x="' + x + '" y="' + y + '" width="' + (remaining - 2) + '" height="' + (rowH - 6) + '" fill="#d97706" stroke="#78350f" stroke-width="1.5" rx="2"/>';
          }
        }

        // Callout Annotations
        svgHtml += '<text x="' + (startX + 15) + '" y="' + (startY + roomH + 22) + '" fill="#ef4444" font-size="11" font-weight="bold">1/4" Perimeter Expansion Gap</text>';
        svgHtml += '<text x="' + (startX + roomW / 2) + '" y="' + (startY + 26) + '" fill="#3b82f6" font-size="11" font-weight="bold" text-anchor="middle">Minimum 8" Stagger Between Row End-Joints</text>';

        svg.innerHTML = svgHtml;
      }

      function copyFlooringTakeoff() {
        var boxes = document.getElementById('totalBoxesCount').textContent;
        var totalSqFt = document.getElementById('boxesSubtext').textContent;
        var cost = document.getElementById('totalFlooringCost').textContent;
        var netArea = document.getElementById('netSqFtVal').textContent;
        var waste = document.getElementById('wasteSqFtVal').textContent;
        var underlay = document.getElementById('underlaymentRollsVal').textContent;
        var baseboard = document.getElementById('baseboardFtVal').textContent;
        var transitions = document.getElementById('transitionVal').textContent;
        var material = document.getElementById('flooringType').options[document.getElementById('flooringType').selectedIndex].text;

        var text = '📦 Flooring Order Takeoff & Bill of Materials\n' +
          '• Material: ' + material + '\n' +
          '• Net Room Area: ' + netArea + '\n' +
          '• Waste Factor: ' + waste + '\n' +
          '• Cartons / Boxes to Order: ' + boxes + ' (' + totalSqFt + ')\n' +
          '• Total Estimated Cost: ' + cost + '\n\n' +
          'Accessories Takeoff:\n' +
          '• Underlayment Vapor Barrier: ' + underlay + '\n' +
          '• Quarter-Round / Shoe Molding: ' + baseboard + '\n' +
          '• Doorway T-Moldings: ' + transitions + '\n\n' +
          'Calculated at digitaltoolsshed.com/calc/flooring-calculator';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyFlooringBtn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Copied Order Takeoff!</span>';
          setTimeout(function() { btn.innerHTML = orig; }, 2000);
        });
      }

      var inputs = ['roomLength', 'roomWidth', 'extraSqFt', 'flooringType', 'sqftPerBox', 'layPattern', 'doorwayCount', 'pricePerSqFt'];
      inputs.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', calcFlooring);
          el.addEventListener('change', calcFlooring);
        }
      });

      document.getElementById('copyFlooringBtn').addEventListener('click', copyFlooringTakeoff);

      calcFlooring();
    })();
  </script>
</div>
`;

  writeFileSync(join(calcDir, 'flooring-calculator.html'), renderTradePage({
    title: "Flooring Calculator — Square Footage, Boxes & Underlayment | Digital Tools Shed",
    metaDesc: "Free flooring calculator. Estimates square footage, boxes of vinyl plank (LVP), laminate, hardwood, or tile, cut waste factor, underlayment rolls, and baseboard trim.",
    canonical: `${DOMAIN}/calc/flooring-calculator`,
    bodyContent: flooringBody,
    currentPath: '/calc/flooring-calculator',
    faq: [
      {
        "q": "How much extra flooring should I order for waste?",
        "a": "For a standard straight plank installation in square or rectangular rooms, add 10% for cutting waste and box defects. For diagonal installations (45°), add 15%. For herringbone or chevron patterns, add 20% due to extensive angle trimming along walls."
      },
      {
        "q": "How do I calculate how many boxes of flooring I need?",
        "a": "Multiply room length by width to find net square footage, add closets or hallways, multiply by your waste factor (e.g. 1.10 for 10%), and divide by the square footage per box listed on the manufacturer packaging. Always round up to the nearest whole integer box."
      },
      {
        "q": "Why is an expansion gap required for floating floors?",
        "a": "Floating floors (luxury vinyl plank, laminate, and engineered click-lock) expand and contract with seasonal indoor temperature and humidity changes. A 1/4-inch to 3/8-inch gap must be maintained around all perimeter walls, pipes, and fixed vertical cabinetry to prevent the floor from tenting and buckling."
      },
      {
        "q": "What subfloor flatness tolerance is required for LVP?",
        "a": "Most luxury vinyl plank manufacturers mandate subfloor flatness within 3/16 inch across a 10-foot radius (or 1/8 inch over 6 feet). Failure to level low spots or grind high spots causes hollow footstep sounds and eventually fractures the brittle click-lock tongues."
      },
      {
        "q": "Do I need an underlayment moisture barrier over concrete?",
        "a": "Yes. Concrete emits moisture vapor via hydrostatic capillary action. When installing floating floors over concrete slabs (even in basements or upper floors), you must install a 6-mil polyethylene vapor barrier beneath the flooring to prevent mold and adhesive decomposition."
      }
    ]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 16. DECK MATERIALS & FRAMING CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const deckBody = `
<div class="tool-container" style="max-width:1080px;margin:0 auto;padding:1.5rem 1rem;">
  <div style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-size:2.15rem;font-weight:800;margin-bottom:0.6rem;letter-spacing:-0.02em;">Deck Calculator — Framing, Decking Boards &amp; Hardware</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:760px;margin:0 auto;line-height:1.6;">
      Calculate complete deck lumber takeoff, 5/4x6 decking boards, 2x8 / 2x10 joists (12" vs 16" OC), dropped beams, sonotube concrete pier footings, and structural ledger fasteners per IRC DCA6 standards.
    </p>
  </div>

  <div style="display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;" class="calc-grid">
    <!-- INPUT COLUMN -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
      <h2 style="font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        Deck Dimensions &amp; Structural Specs
      </h2>

      <!-- LENGTH & PROJECTION -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="deckLength">Length Along House (Feet)</label>
          <input type="number" id="deckLength" value="20" min="4" max="80" step="1" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="deckWidth">Projection / Width (Feet)</label>
          <input type="number" id="deckWidth" value="12" min="4" max="40" step="1" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
      </div>

      <!-- DECKING MATERIAL & JOIST SPACING -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="deckingMaterial">Deck Surface Material</label>
          <select id="deckingMaterial" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
            <option value="treated" selected>5/4x6 Pressure Treated Pine (16" OC)</option>
            <option value="composite">Capped Composite (Trex / TimberTech — 12" OC)</option>
            <option value="cedar">2x6 Western Red Cedar / Redwood (16" OC)</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="joistSpacing">Joist Spacing On-Center</label>
          <select id="joistSpacing" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
            <option value="16" selected>16 Inches On-Center (Standard Wood)</option>
            <option value="12">12 Inches On-Center (Composite / Stiff)</option>
          </select>
        </div>
      </div>

      <!-- HEIGHT ABOVE GRADE & BEAM CONFIG -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="deckHeight">Height Above Grade (Feet)</label>
          <input type="number" id="deckHeight" value="4" min="1" max="15" step="0.5" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="joistLumber">Joist Lumber Size</label>
          <select id="joistLumber" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
            <option value="2x8" selected>2x8 Treated Joists (Spans up to 12')</option>
            <option value="2x10">2x10 Treated Joists (Spans up to 15')</option>
          </select>
        </div>
      </div>
    </div>

    <!-- SUMMARY & OUTPUT COLUMN -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h2 style="font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Deck Lumber &amp; Hardware Takeoff
          </h2>
          <button id="copyDeckBtn" style="padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy Takeoff</span>
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;">Surface Deck Boards</span>
            <span id="deckBoardsCount" style="font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;">29 Boards</span>
            <span id="deckBoardsDetail" style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">5/4x6 x 20-Ft (incl. 10% waste)</span>
          </div>

          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;">Framing Joists (PT)</span>
            <span id="joistCount" style="font-family:var(--mono);font-size:2rem;font-weight:800;color:var(--fg);display:block;">16 Joists</span>
            <span id="joistDetail" style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">2x8 x 12-Ft @ 16" OC</span>
          </div>
        </div>

        <!-- FRAMING & HARDWARE LEDGER -->
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
          <div style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Structural Framing &amp; Fastener Schedule</div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Ledger Board (Bolted to House):</span>
            <strong id="ledgerTakeoffVal" style="font-family:var(--mono);color:#10b981;">1 Board (2x8 x 20-Ft)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Support Beam (Double PT 2x10):</span>
            <strong id="beamTakeoffVal" style="font-family:var(--mono);color:#f59e0b;">2 Boards (2x10 x 20-Ft)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Concrete Pier Footings (Sonotube):</span>
            <strong id="piersCountVal" style="font-family:var(--mono);">3 Piers (12" Sonotube + 6x6 Posts)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;">
            <span>Deck Fasteners / Screws:</span>
            <strong id="fastenersVal" style="font-family:var(--mono);">~950 Screws (2 × 5-lb boxes)</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- INTERACTIVE SVG DECK FRAMING PLAN -->
  <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;margin-bottom:2.5rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
    <h2 style="font-size:1.25rem;margin-top:0;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.5rem;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
      Deck Framing Plan &amp; Structural Bearings
    </h2>
    <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;">
      Framing schematic illustrating bolted house ledger, joist bays, dropped beam cantilever, and 6x6 concrete pier posts.
    </p>

    <div style="overflow-x:auto;">
      <svg id="deckFramingSvg" viewBox="0 0 800 280" style="width:100%;height:auto;min-width:600px;font-family:var(--mono);"></svg>
    </div>
  </div>

  <!-- SCRIPT ENGINE -->
  <script>
    (function() {
      function calcDeck() {
        var len = parseFloat(document.getElementById('deckLength').value) || 20;
        var width = parseFloat(document.getElementById('deckWidth').value) || 12;
        var spacing = parseInt(document.getElementById('joistSpacing').value) || 16;
        var mat = document.getElementById('deckingMaterial').value;
        var joistLumber = document.getElementById('joistLumber').value;

        // Joist count: (Length_inches / spacing) + 1 + rim joist
        var lenInches = len * 12;
        var joists = Math.ceil(lenInches / spacing) + 1;

        // Deck boards: Width_inches / 5.5 (standard 5/4x6 board) + 10% waste
        var widthInches = width * 12;
        var rawBoards = Math.ceil(widthInches / 5.5);
        var deckBoards = Math.ceil(rawBoards * 1.10);

        // Beam & Piers (standard post spacing: max 8ft on center)
        var piers = Math.max(2, Math.ceil(len / 8) + 1);

        // Screws: 2 screws per board per joist
        var totalScrews = Math.ceil(rawBoards * joists * 2);
        var screwBoxes = Math.max(1, Math.ceil(totalScrews / 500));

        // Update DOM
        document.getElementById('deckBoardsCount').textContent = deckBoards + ' Boards';
        document.getElementById('deckBoardsDetail').textContent = '5/4x6 x ' + len + '-Ft (incl. 10% waste)';

        document.getElementById('joistCount').textContent = joists + ' Joists';
        document.getElementById('joistDetail').textContent = joistLumber + ' x ' + width + '-Ft @ ' + spacing + '" OC';

        document.getElementById('ledgerTakeoffVal').textContent = '1 Board (' + joistLumber + ' x ' + len + '-Ft)';
        document.getElementById('beamTakeoffVal').textContent = '2 Boards (2x10 x ' + len + '-Ft)';
        document.getElementById('piersCountVal').textContent = piers + ' Piers (12" Sonotube + 6x6 Posts)';
        document.getElementById('fastenersVal').textContent = '~' + totalScrews.toLocaleString() + ' Screws (' + screwBoxes + ' × 5-lb boxes)';

        renderDeckSvg(joists, piers, spacing);
      }

      function renderDeckSvg(numJoists, numPiers, sp) {
        var svg = document.getElementById('deckFramingSvg');
        if (!svg) return;

        var svgHtml = '';
        var startX = 60;
        var startY = 40;
        var frameW = 680;
        var frameH = 180;

        // House Ledger Board (Top)
        svgHtml += '<rect x="' + startX + '" y="' + startY + '" width="' + frameW + '" height="12" fill="#10b981" stroke="#065f46" stroke-width="1.5"/>';
        svgHtml += '<text x="' + (startX + frameW/2) + '" y="' + (startY - 10) + '" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">House Ledger Board (1/2" Bolted to Band Joist)</text>';

        // Rim Joists (Left, Right, Front)
        svgHtml += '<rect x="' + startX + '" y="' + startY + '" width="10" height="' + frameH + '" fill="#3b82f6"/>';
        svgHtml += '<rect x="' + (startX + frameW - 10) + '" y="' + startY + '" width="10" height="' + frameH + '" fill="#3b82f6"/>';
        svgHtml += '<rect x="' + startX + '" y="' + (startY + frameH - 12) + '" width="' + frameW + '" height="12" fill="#3b82f6" stroke="#1e40af" stroke-width="1.5"/>';

        // Intermediate Joists
        var displayJoists = Math.min(numJoists, 18);
        for (var j = 1; j < displayJoists - 1; j++) {
          var jx = startX + (j * (frameW / (displayJoists - 1)));
          svgHtml += '<line x1="' + jx + '" y1="' + (startY + 12) + '" x2="' + jx + '" y2="' + (startY + frameH - 12) + '" stroke="#60a5fa" stroke-width="2"/>';
        }

        // Dropped Beam Line (cantilevered 2ft back from edge)
        var beamY = startY + frameH - 45;
        svgHtml += '<line x1="' + (startX - 15) + '" y1="' + beamY + '" x2="' + (startX + frameW + 15) + '" y2="' + beamY + '" stroke="#f59e0b" stroke-width="6"/>';
        svgHtml += '<text x="' + (startX + frameW + 25) + '" y="' + (beamY + 4) + '" fill="#f59e0b" font-size="11" font-weight="bold">Double 2x10 Drop Beam</text>';

        // Pier Footings under beam
        for (var p = 0; p < numPiers; p++) {
          var px = startX + (p * (frameW / (numPiers - 1)));
          svgHtml += '<circle cx="' + px + '" cy="' + beamY + '" r="10" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>';
        }

        svg.innerHTML = svgHtml;
      }

      function copyDeckTakeoff() {
        var boards = document.getElementById('deckBoardsCount').textContent;
        var bDetail = document.getElementById('deckBoardsDetail').textContent;
        var joists = document.getElementById('joistCount').textContent;
        var jDetail = document.getElementById('joistDetail').textContent;
        var ledger = document.getElementById('ledgerTakeoffVal').textContent;
        var beam = document.getElementById('beamTakeoffVal').textContent;
        var piers = document.getElementById('piersCountVal').textContent;
        var fasteners = document.getElementById('fastenersVal').textContent;

        var text = '🔨 Deck Framing & Lumber Takeoff\n' +
          '• Surface Decking: ' + boards + ' (' + bDetail + ')\n' +
          '• Framing Joists: ' + joists + ' (' + jDetail + ')\n' +
          '• Ledger Board: ' + ledger + '\n' +
          '• Support Beam: ' + beam + '\n' +
          '• Footing Piers: ' + piers + '\n' +
          '• Screws / Fasteners: ' + fasteners + '\n\n' +
          'Calculated at digitaltoolsshed.com/calc/deck-calculator';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyDeckBtn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Copied Takeoff!</span>';
          setTimeout(function() { btn.innerHTML = orig; }, 2000);
        });
      }

      var inputs = ['deckLength', 'deckWidth', 'deckingMaterial', 'joistSpacing', 'deckHeight', 'joistLumber'];
      inputs.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', calcDeck);
          el.addEventListener('change', calcDeck);
        }
      });

      document.getElementById('copyDeckBtn').addEventListener('click', copyDeckTakeoff);

      calcDeck();
    })();
  </script>
</div>
`;

  writeFileSync(join(calcDir, 'deck-calculator.html'), renderTradePage({
    title: "Deck Calculator — Framing, Decking Boards & Hardware Takeoff | Digital Tools Shed",
    metaDesc: "Free deck materials calculator. Calculates 5/4x6 treated or composite decking boards, 2x8/2x10 joists (12-inch vs 16-inch OC), beams, sonotube concrete piers, and ledger bolts.",
    canonical: `${DOMAIN}/calc/deck-calculator`,
    bodyContent: deckBody,
    currentPath: '/calc/deck-calculator',
    faq: [
      {
        "q": "What joist spacing is required for composite decking?",
        "a": "Composite decking boards (such as Trex or TimberTech) require 12-inch on-center joist spacing for diagonal layouts and commercial applications, or a maximum of 16-inch on-center spacing for standard perpendicular residential layouts. Using 16-inch spacing on diagonal composite boards will cause uncomfortable bouncy foot sag."
      },
      {
        "q": "How many decking boards do I need for a 12x20 deck?",
        "a": "A standard 5/4x6 nominal deck board measures 5.5 inches wide. For a 12-foot projection (144 inches), you need approximately 26 rows of boards. Adding 10% for end-trimming and defects yields 29 boards of 20-foot length."
      },
      {
        "q": "How deep should deck footings be poured?",
        "a": "Deck footings must extend at least 6 inches below the local frost line (typically 36 to 48 inches deep in northern climate zones) to prevent winter frost heaving. Footings should terminate in a flared bell base on undisturbed virgin soil."
      },
      {
        "q": "Can I attach a deck ledger board to a house cantilever or brick veneer?",
        "a": "No. International Residential Code (IRC DCA6) strictly forbids attaching a structural deck ledger to brick veneer, stone facade, or overhanging cantilevered floor joists. Brick veneer lacks shear bearing strength. In these situations, the deck must be designed as a self-supporting, freestanding structure with its own support beam and footings near the house."
      },
      {
        "q": "What size bolts should be used to fasten a deck ledger board?",
        "a": "IRC code specifies minimum 1/2-inch hot-dipped galvanized (HDG) thru-bolts with washers, or code-approved structural ledger lag screws (such as Simpson Strong-Tie SDWS or FastenMaster LedgerLOK), staggered in alternating high/low pairs spaced 10 to 16 inches apart."
      }
    ]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 17. PAVER & PATIO BASE CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const paverBody = `
<div class="tool-container" style="max-width:1080px;margin:0 auto;padding:1.5rem 1rem;">
  <div style="margin-bottom:2rem;text-align:center;">
    <h1 style="font-size:2.15rem;font-weight:800;margin-bottom:0.6rem;letter-spacing:-0.02em;">Paver Calculator — Patio Base Gravel, Sand &amp; Polymeric Joint Bags</h1>
    <p style="color:var(--text-muted);font-size:1.05rem;max-width:760px;margin:0 auto;line-height:1.6;">
      Calculate brick and patio stone takeoff, compacted crushed stone road base (tons / cubic yards), screeded bedding sand, polymeric joint locking sand, and perimeter spiked edge restraints.
    </p>
  </div>

  <div style="display:grid;grid-template-columns:1fr;gap:2rem;margin-bottom:2.5rem;" class="calc-grid">
    <!-- INPUT COLUMN -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
      <h2 style="font-size:1.25rem;margin-top:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>
        Patio Dimensions &amp; Base Specs
      </h2>

      <!-- LENGTH & WIDTH -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="paverLength">Patio Length (Feet)</label>
          <input type="number" id="paverLength" value="20" min="2" max="200" step="0.5" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="paverWidth">Patio Width (Feet)</label>
          <input type="number" id="paverWidth" value="15" min="2" max="200" step="0.5" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--mono);font-size:1.05rem;">
        </div>
      </div>

      <!-- PAVER SIZE & TYPE -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem;">
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="paverSize">Paver Dimensions</label>
          <select id="paverSize" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
            <option value="4x8" selected>Standard Brick Paver (4" x 8" — 4.5/sq ft)</option>
            <option value="6x6">Square Paver (6" x 6" — 4.0/sq ft)</option>
            <option value="6x9">Cobblestone (6" x 9" — 2.67/sq ft)</option>
            <option value="12x12">Large Slab (12" x 12" — 1.0/sq ft)</option>
          </select>
        </div>
        <div>
          <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="paverBaseDepth">Crushed Stone Base Depth</label>
          <select id="paverBaseDepth" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
            <option value="4" selected>4 Inches (Pedestrian Patio / Walkway)</option>
            <option value="6">6 Inches (Heavy Traffic / Poor Soil)</option>
            <option value="8">8–10 Inches (Driveway / Vehicle Rated)</option>
          </select>
        </div>
      </div>

      <!-- PATTERN WASTE -->
      <div>
        <label style="display:block;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem;" for="paverWastePct">Cutting Waste Allowance</label>
        <select id="paverWastePct" style="width:100%;padding:0.65rem 0.85rem;border:1px solid var(--border);border-radius:8px;background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:0.95rem;">
          <option value="0.10" selected>Standard Running Bond / Basketweave (10% Waste)</option>
          <option value="0.15">45° Diagonal Herringbone (15% Waste)</option>
          <option value="0.08">Simple Rectangular Grid (8% Waste)</option>
        </select>
      </div>
    </div>

    <!-- SUMMARY & OUTPUT COLUMN -->
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.75rem;box-shadow:0 4px 16px rgba(0,0,0,0.03);display:flex;flex-direction:column;justify-content:space-between;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h2 style="font-size:1.25rem;margin:0;display:flex;align-items:center;gap:0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Paver &amp; Base Materials Takeoff
          </h2>
          <button id="copyPaverBtn" style="padding:0.4rem 0.75rem;font-size:0.8rem;background:var(--bg);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:0.35rem;font-family:var(--sans);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy Estimate</span>
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;">Pavers to Order</span>
            <span id="paverCountVal" style="font-family:var(--mono);font-size:2rem;font-weight:800;color:#3b82f6;display:block;">1,485 Pavers</span>
            <span id="paverSqFtVal" style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">330 Total Sq Ft (incl 10% waste)</span>
          </div>

          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;">
            <span style="font-size:0.75rem;color:var(--text-muted);display:block;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin-bottom:0.25rem;">Gravel Base (#57 Stone)</span>
            <span id="gravelTonsVal" style="font-family:var(--mono);font-size:2rem;font-weight:800;color:#10b981;display:block;">5.7 Tons</span>
            <span id="gravelYardsVal" style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">4.1 Cu Yds @ 4" Depth</span>
          </div>
        </div>

        <!-- AGGREGATE & SAND LEDGER -->
        <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
          <div style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Sub-Base, Bedding &amp; Sand Schedule</div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Bedding Sand (1" screed layer):</span>
            <strong id="beddingSandVal" style="font-family:var(--mono);color:#f59e0b;">1.3 Cu Yds (1.8 Tons)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Polymeric Joint Sand (50-lb bags):</span>
            <strong id="polySandBagsVal" style="font-family:var(--mono);color:var(--fg);">5 Bags (250 lbs)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--border);font-size:0.875rem;">
            <span>Plastic Paver Edge Restraint:</span>
            <strong id="edgeRestraintVal" style="font-family:var(--mono);">70 Lin Ft (12 strips)</strong>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0.35rem 0;font-size:0.875rem;">
            <span>10" Steel Edge Spikes:</span>
            <strong id="spikesCountVal" style="font-family:var(--mono);">~47 Spikes (every 18")</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SCRIPT ENGINE -->
  <script>
    (function() {
      function calcPaver() {
        var l = parseFloat(document.getElementById('paverLength').value) || 20;
        var w = parseFloat(document.getElementById('paverWidth').value) || 15;
        var pSize = document.getElementById('paverSize').value;
        var baseDepth = parseFloat(document.getElementById('paverBaseDepth').value) || 4;
        var wastePct = parseFloat(document.getElementById('paverWastePct').value) || 0.10;

        var netSqFt = l * w;
        var grossSqFt = netSqFt * (1 + wastePct);

        var paversPerSqFt = 4.5;
        if (pSize === '6x6') paversPerSqFt = 4.0;
        else if (pSize === '6x9') paversPerSqFt = 2.67;
        else if (pSize === '12x12') paversPerSqFt = 1.0;

        var totalPavers = Math.ceil(grossSqFt * paversPerSqFt);

        // Crushed stone base: add 6" on all sides for edge stability
        var baseAreaSqFt = (l + 1.0) * (w + 1.0);
        var baseCuYd = (baseAreaSqFt * (baseDepth / 12)) / 27;
        // Compaction factor + 15%
        baseCuYd = baseCuYd * 1.15;
        var baseTons = baseCuYd * 1.4; // ~1.4 tons per cu yd crushed stone

        // Bedding sand: 1 inch depth over net area
        var sandCuYd = (netSqFt * (1.0 / 12)) / 27;
        var sandTons = sandCuYd * 1.35;

        // Polymeric sand: approx 1 bag (50 lb) per 60–75 sq ft for standard 4x8 pavers
        var polyBags = Math.max(1, Math.ceil(netSqFt / 65));

        // Edge restraint: perimeter
        var perimeterFt = 2 * (l + w);
        var edgeStrips = Math.ceil(perimeterFt / 6); // 6ft per strip
        var spikes = Math.ceil(perimeterFt / 1.5); // spike every 1.5 ft

        // DOM update
        document.getElementById('paverCountVal').textContent = totalPavers.toLocaleString() + ' Pavers';
        document.getElementById('paverSqFtVal').textContent = Math.round(grossSqFt) + ' Total Sq Ft (incl ' + Math.round(wastePct*100) + '% waste)';
        document.getElementById('gravelTonsVal').textContent = baseTons.toFixed(1) + ' Tons';
        document.getElementById('gravelYardsVal').textContent = baseCuYd.toFixed(1) + ' Cu Yds @ ' + baseDepth + '" Depth';
        document.getElementById('beddingSandVal').textContent = sandCuYd.toFixed(1) + ' Cu Yds (' + sandTons.toFixed(1) + ' Tons)';
        document.getElementById('polySandBagsVal').textContent = polyBags + ' Bags (' + (polyBags * 50) + ' lbs)';
        document.getElementById('edgeRestraintVal').textContent = perimeterFt + ' Lin Ft (' + edgeStrips + ' strips)';
        document.getElementById('spikesCountVal').textContent = '~' + spikes + ' Spikes (every 18")';
      }

      function copyPaverEstimate() {
        var pavers = document.getElementById('paverCountVal').textContent;
        var pSqFt = document.getElementById('paverSqFtVal').textContent;
        var gravel = document.getElementById('gravelTonsVal').textContent;
        var gYards = document.getElementById('gravelYardsVal').textContent;
        var sand = document.getElementById('beddingSandVal').textContent;
        var poly = document.getElementById('polySandBagsVal').textContent;
        var edge = document.getElementById('edgeRestraintVal').textContent;
        var spikes = document.getElementById('spikesCountVal').textContent;

        var text = '🧱 Paver Patio Estimate & Takeoff\n' +
          '• Total Pavers to Buy: ' + pavers + ' (' + pSqFt + ')\n' +
          '• Crushed Stone Base (#57 / Road Base): ' + gravel + ' (' + gYards + ')\n' +
          '• Bedding Sand (1" screed layer): ' + sand + '\n' +
          '• Polymeric Joint Sand: ' + poly + '\n' +
          '• Plastic Edge Restraint: ' + edge + '\n' +
          '• 10" Steel Anchor Spikes: ' + spikes + '\n\n' +
          'Calculated at digitaltoolsshed.com/calc/paver-calculator';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyPaverBtn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span>✓ Copied Estimate!</span>';
          setTimeout(function() { btn.innerHTML = orig; }, 2000);
        });
      }

      var inputs = ['paverLength', 'paverWidth', 'paverSize', 'paverBaseDepth', 'paverWastePct'];
      inputs.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', calcPaver);
          el.addEventListener('change', calcPaver);
        }
      });

      document.getElementById('copyPaverBtn').addEventListener('click', copyPaverEstimate);

      calcPaver();
    })();
  </script>
</div>
`;

  writeFileSync(join(calcDir, 'paver-calculator.html'), renderTradePage({
    title: "Paver Calculator — Patio Base Gravel, Sand & Polymeric Joint Bags | Digital Tools Shed",
    metaDesc: "Free patio paver calculator. Computes exact concrete/brick pavers, compacted crushed stone road base (tons & cubic yards), bedding sand, and polymeric joint sand.",
    canonical: `${DOMAIN}/calc/paver-calculator`,
    bodyContent: paverBody,
    currentPath: '/calc/paver-calculator',
    faq: [
      {
        "q": "How deep should the base be for a paver patio?",
        "a": "For standard pedestrian walkways and residential patios, a minimum 4-inch layer of compacted crushed gravel (dense grade #57 or road base) topped with a 1-inch uncompacted layer of coarse concrete sand (C-33 sand) is required. For driveways supporting vehicle loads, the gravel base must be 8 to 10 inches deep."
      },
      {
        "q": "Can I use stone dust instead of coarse sand for the bedding layer?",
        "a": "No. Using stone dust or masonry sand for the bedding layer is one of the most common causes of paver failure. Stone dust traps water and turns into a soft paste when saturated, causing pavers to sink and develop uneven ruts. Coarse washed concrete sand (ASTM C-33) allows free drainage and maintains angular friction interlock."
      },
      {
        "q": "What is polymeric sand and why is it necessary?",
        "a": "Polymeric sand is a blend of fine quartz sand and polymeric binding agents that activate when misted with water. Once cured, it hardens into an elastic, flexible mortar that locks paver joints together, prevents weed growth between bricks, and stops ants from excavating sand."
      },
      {
        "q": "How do I calculate how much crushed stone base to order?",
        "a": "Multiply the patio length plus 1 foot by the width plus 1 foot (to account for the 6-inch base shoulder extension on all sides). Multiply by depth in feet (e.g. 4 inches = 0.333 ft) and divide by 27 to get cubic yards. Multiply by 1.15 to account for 15% compaction loss."
      },
      {
        "q": "Why do paver patios need a rigid edge restraint?",
        "a": "Without a heavy-duty plastic or aluminum edge restraint pinned into the gravel base with 10-inch steel spikes, walking and freeze-thaw cycles cause the outer perimeter pavers to creep outward, destroying joint interlock and causing the entire patio to spread."
      }
    ]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 16. TOPSOIL & RAISED GARDEN BED SOIL CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const topsoilBody = "\n    <div class=\"article-container\" style=\"max-width: 1020px;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\">Home</a> &gt; <a href=\"/calc/\">Trade &amp; Construction</a> &gt; Topsoil Calculator\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <div style=\"display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;\">\n          <span class=\"badge badge-purple\">Landscaping &amp; Earthwork</span>\n          <span class=\"badge badge-green\">Compaction Factor Engine</span>\n          <span class=\"badge badge-blue\">Zero Server Uploads</span>\n        </div>\n        <h1 style=\"font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          Topsoil &amp; Raised Garden Bed Soil Calculator\n        </h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Estimate exact topsoil volume in cubic yards, cubic feet, metric cubic meters, and tonnage. Factors compaction settling rates and compares bulk truckload pricing against commercial pre-packaged bags.\n        </p>\n      </header>\n\n      <!-- MAIN INPUT BOX -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Area Shape:</label>\n            <select id=\"soil-shape\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"setSoilShape(this.value)\">\n              <option value=\"rect\" selected>Rectangular Bed / Lawn (L × W)</option>\n              <option value=\"circle\">Circular Area / Tree Ring (Diameter)</option>\n              <option value=\"direct\">Direct Total Square Footage (sq ft)</option>\n            </select>\n          </div>\n\n          <div id=\"grp-soil-len\">\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Length (Feet):</label>\n            <input type=\"number\" id=\"soil-len\" value=\"25\" min=\"1\" step=\"0.5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcTopsoil()\" />\n          </div>\n\n          <div id=\"grp-soil-wid\">\n            <label id=\"lbl-soil-wid\" style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Width (Feet):</label>\n            <input type=\"number\" id=\"soil-wid\" value=\"12\" min=\"1\" step=\"0.5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcTopsoil()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Desired Soil Depth (Inches):</label>\n            <input type=\"number\" id=\"soil-depth\" value=\"4\" min=\"0.25\" max=\"36\" step=\"0.5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcTopsoil()\" />\n          </div>\n        </div>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Soil Material &amp; Density:</label>\n            <select id=\"soil-type\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcTopsoil()\">\n              <option value=\"2200\" selected>Screened Topsoil (2,200 lbs / yd³)</option>\n              <option value=\"1400\">Compost / Manure Blend (1,400 lbs / yd³)</option>\n              <option value=\"1100\">Raised Bed Mix (Peat/Vermiculite) (1,100 lbs / yd³)</option>\n              <option value=\"2400\">Sandy Loam / Heavy Topsoil (2,400 lbs / yd³)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Compaction &amp; Settling Buffer:</label>\n            <select id=\"soil-compaction\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcTopsoil()\">\n              <option value=\"0\">0% (Exact Volume — No Settling)</option>\n              <option value=\"10\">10% (Light Tamping / Garden Bed)</option>\n              <option value=\"15\" selected>15% (Standard Lawn Grading Settling)</option>\n              <option value=\"20\">20% (Heavy Rolling / Wheelbarrowed)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Bulk Price ($/yd³ Delivered):</label>\n            <input type=\"number\" id=\"soil-bulk-price\" value=\"45\" min=\"0\" step=\"5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.05rem;\" oninput=\"calcTopsoil()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Bag Price ($/1.5 cu ft Bag):</label>\n            <input type=\"number\" id=\"soil-bag-price\" value=\"5.50\" min=\"0\" step=\"0.5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.05rem;\" oninput=\"calcTopsoil()\" />\n          </div>\n        </div>\n\n        <!-- MAIN RESULT KPI CARDS -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Topsoil to Order (Cubic Yards)</div>\n            <div id=\"soil-res-yards\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;\">4.26 yd³</div>\n            <div id=\"soil-res-cuft\" style=\"font-size: 0.85rem; color: var(--text-muted);\">115.0 cu ft | 3.26 m³</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #6366f1;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Commercial Bags Needed</div>\n            <div id=\"soil-res-bags15\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #6366f1; margin-bottom: 0.2rem;\">77 Bags</div>\n            <div id=\"soil-res-bags-alt\" style=\"font-size: 0.85rem; color: var(--text-muted);\">115 Bags @ 1.0 cu ft</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Estimated Total Weight</div>\n            <div id=\"soil-res-weight-tons\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;\">4.69 Tons</div>\n            <div id=\"soil-res-weight-lbs\" style=\"font-size: 0.85rem; color: var(--text-muted);\">9,372 lbs (Wet load)</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Bulk vs. Bagged Cost</div>\n            <div id=\"soil-res-cost-bulk\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;\">$192 Bulk</div>\n            <div id=\"soil-res-cost-bags\" style=\"font-size: 0.85rem; color: var(--text-muted);\">$424 in Bags (Save $232 with Bulk)</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- INTERACTIVE 3D PERSPECTIVE CROSS-SECTION SVG -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          🌱 Soil Layer &amp; Subgrade Compaction Cross-Section\n        </h2>\n        <p style=\"font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;\">\n          Cross-section showing finished soil grade, post-watering compaction settlement zone, and natural native subsoil contact layer.\n        </p>\n\n        <div style=\"overflow-x: auto;\">\n          <svg id=\"soil-cross-svg\" viewBox=\"0 0 800 220\" style=\"width: 100%; height: auto; min-width: 600px; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- STEP-BY-STEP DERIVATION BOX -->\n      <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h3 style=\"font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;\">\n          📐 Step-by-Step Earthwork &amp; Volumetric Derivations\n        </h3>\n        <div id=\"soil-derivation-box\" style=\"font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);\">\n          Calculating earthwork metrics...\n        </div>\n      </div>\n\n      <!-- ONE-CLICK COPY BUTTON -->\n      <div style=\"margin-bottom: 2.5rem;\">\n        <button type=\"button\" id=\"soil-copy-btn\" onclick=\"copyTopsoilReport(this)\" class=\"btn btn-copy\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;\">\n          <span>📋</span> Copy Topsoil Material Takeoff &amp; Order Sheet\n        </button>\n      </div>\n\n      <!-- 5 FATAL TRAPS -->\n      <div style=\"margin: 2.5rem 0;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);\">\n          ⚠️ 5 Fatal Traps &amp; Costly Mistakes in Soil Ordering\n        </h2>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 1rem;\">\n          <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n            <strong style=\"color: #ef4444;\">1. The Compaction Settling Deficit (15% Shrinkage)</strong>\n            Freshly screened and delivered topsoil is heavily aerated. After spreading, walking on it, and two deep watering cycles, the loose soil naturally settles and compacts by 12% to 18%. Ordering only the raw geometric volume guarantees your raised beds or re-graded lawn will finish 1.5 inches below desired grade.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n            <strong style=\"color: #f59e0b;\">2. Bagged Soil Price Gouging on Large Projects</strong>\n            One cubic yard contains 27 cubic feet. A common 1.5 cu ft bag at Home Depot costs roughly $5.50. Buying 18 bags to make 1 single yard costs $99. For a 4-yard lawn project, bagged soil costs roughly $400 in materials plus heavy manual labor, whereas a bulk truck delivery costs $180 total.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n            <strong style=\"color: #10b981;\">3. Ordering Cheap \"Fill Dirt\" Instead of Screened Topsoil</strong>\n            Unscreened \"fill dirt\" is subsoil excavated from commercial foundation digs, filled with heavy clay clumps, gravel, and weed rootstocks. Topsoil is the organically active upper 6 inches of earth shredded through a 1/2-inch rotating screen. Attempting to plant grass or vegetables in fill dirt suffocates root systems.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n            <strong style=\"color: #3b82f6;\">4. Over-Tilling and Destroying Soil Aggregate Structure</strong>\n            Using a motorized rotary tiller on damp topsoil pulverizes natural soil micropores and macro-aggregates into fine dust. Upon rainfall, this powdered silt consolidates into a concrete-like impermeable crust that repels water and prevents seedling emergence.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n            <strong style=\"color: #8b5cf6;\">5. The \"Bathtub Effect\" Over Compacted Clay Subgrade</strong>\n            Excavating a planting bed into dense native clay and filling it with ultra-porous raised bed mix creates a drainage bathtub. During rainy seasons, water drains rapidly through the topsoil, pools on top of the impermeable clay floor, and rots plant root systems from lack of oxygen. Always rototill 2 inches of compost into the native subsoil boundary.\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <script>\n      function setSoilShape(shape) {\n        var grpLen = document.getElementById('grp-soil-len');\n        var grpWid = document.getElementById('grp-soil-wid');\n        var lblWid = document.getElementById('lbl-soil-wid');\n\n        if (shape === 'rect') {\n          grpLen.style.display = 'block';\n          grpWid.style.display = 'block';\n          lblWid.textContent = 'Width (Feet):';\n        } else if (shape === 'circle') {\n          grpLen.style.display = 'none';\n          grpWid.style.display = 'block';\n          lblWid.textContent = 'Diameter (Feet):';\n        } else if (shape === 'direct') {\n          grpLen.style.display = 'none';\n          grpWid.style.display = 'block';\n          lblWid.textContent = 'Total Area (Square Feet):';\n        }\n\n        calcTopsoil();\n      }\n\n      function calcTopsoil() {\n        var shape = document.getElementById('soil-shape').value;\n        var len = parseFloat(document.getElementById('soil-len').value) || 0;\n        var wid = parseFloat(document.getElementById('soil-wid').value) || 0;\n        var depthInches = parseFloat(document.getElementById('soil-depth').value) || 4;\n\n        var density = parseFloat(document.getElementById('soil-type').value) || 2200;\n        var compactionPct = parseFloat(document.getElementById('soil-compaction').value) || 15;\n        var bulkPrice = parseFloat(document.getElementById('soil-bulk-price').value) || 45;\n        var bagPrice = parseFloat(document.getElementById('soil-bag-price').value) || 5.50;\n\n        var areaSqFt = 0;\n        if (shape === 'rect') {\n          areaSqFt = len * wid;\n        } else if (shape === 'circle') {\n          var radius = wid / 2;\n          areaSqFt = Math.PI * radius * radius;\n        } else if (shape === 'direct') {\n          areaSqFt = wid;\n        }\n\n        var depthFeet = depthInches / 12;\n        var rawCuFt = areaSqFt * depthFeet;\n        var compMultiplier = 1 + (compactionPct / 100);\n\n        var finalCuFt = rawCuFt * compMultiplier;\n        var finalCuYds = finalCuFt / 27;\n        var finalCuMeters = finalCuYds * 0.764555;\n\n        // Weight\n        var totalWeightLbs = finalCuYds * density;\n        var totalWeightTons = totalWeightLbs / 2000;\n\n        // Bags\n        var bags15 = Math.ceil(finalCuFt / 1.5);\n        var bags10 = Math.ceil(finalCuFt / 1.0);\n        var bags075 = Math.ceil(finalCuFt / 0.75);\n\n        // Costs\n        var totalBulkCost = Math.round(finalCuYds * bulkPrice);\n        var totalBagCost = Math.round(bags15 * bagPrice);\n\n        // Update KPIs\n        document.getElementById('soil-res-yards').textContent = finalCuYds.toFixed(2) + ' yd³';\n        document.getElementById('soil-res-cuft').textContent = finalCuFt.toFixed(1) + ' cu ft | ' + finalCuMeters.toFixed(2) + ' m³';\n\n        document.getElementById('soil-res-bags15').textContent = bags15 + ' Bags';\n        document.getElementById('soil-res-bags-alt').textContent = bags10 + ' bags @ 1.0 cu ft | ' + bags075 + ' bags @ 0.75 cu ft';\n\n        document.getElementById('soil-res-weight-tons').textContent = totalWeightTons.toFixed(2) + ' Tons';\n        document.getElementById('soil-res-weight-lbs').textContent = Math.round(totalWeightLbs).toLocaleString() + ' lbs (' + Math.round(density) + ' lbs/yd³)';\n\n        document.getElementById('soil-res-cost-bulk').textContent = '$' + totalBulkCost.toLocaleString() + ' Bulk';\n        var savings = Math.max(0, totalBagCost - totalBulkCost);\n        document.getElementById('soil-res-cost-bags').textContent = '$' + totalBagCost.toLocaleString() + ' in Bags' + (savings > 0 ? ' (Save $' + savings.toLocaleString() + ' with bulk)' : '');\n\n        // Derivation Box\n        var dBox = document.getElementById('soil-derivation-box');\n        dBox.innerHTML = '<strong>1. Surface Area (A):</strong> ' + (shape === 'rect' ? len + ' ft × ' + wid + ' ft = <strong>' + areaSqFt.toFixed(1) + ' sq ft</strong>' : '<strong>' + areaSqFt.toFixed(1) + ' sq ft</strong>') + '.<br>' +\n          '<strong>2. Uncompacted Volume:</strong> ' + areaSqFt.toFixed(1) + ' sq ft × (' + depthInches + '\" / 12) = ' + rawCuFt.toFixed(1) + ' cu ft = <strong>' + (rawCuFt / 27).toFixed(2) + ' yd³</strong>.<br>' +\n          '<strong>3. Compaction &amp; Settling Buffer (' + compactionPct + '%):</strong> ' + (rawCuFt / 27).toFixed(2) + ' yd³ × ' + compMultiplier.toFixed(2) + ' = <strong>' + finalCuYds.toFixed(2) + ' yd³ to order</strong>.<br>' +\n          '<strong>4. Bagged Conversion:</strong> ' + finalCuFt.toFixed(1) + ' cu ft / 1.5 cu ft per bag = <strong>' + bags15 + ' Bags</strong>.<br>' +\n          '<strong>5. Structural Tonnage:</strong> ' + finalCuYds.toFixed(2) + ' yd³ × ' + density + ' lbs/yd³ = ' + Math.round(totalWeightLbs).toLocaleString() + ' lbs = <strong>' + totalWeightTons.toFixed(2) + ' US Tons</strong>.';\n\n        // Render Cross-section\n        renderSoilCrossSvg(depthInches, compactionPct);\n      }\n\n      function renderSoilCrossSvg(depthIn, compPct) {\n        var svg = document.getElementById('soil-cross-svg');\n        if (!svg) return;\n\n        var w = 800, h = 220;\n        var bedX = 80, bedY = 40, bedW = 640, bedH = 140;\n\n        var soilH = Math.min(90, Math.max(25, depthIn * 7));\n        var compH = soilH * (compPct / 100);\n        var subsoilH = bedH - soilH;\n\n        var svgHtml = '';\n\n        // Native Subsoil (Brown)\n        svgHtml += '<rect x=\"' + bedX + '\" y=\"' + (bedY + soilH) + '\" width=\"' + bedW + '\" height=\"' + subsoilH + '\" fill=\"#78350f\" opacity=\"0.8\" rx=\"0 0 6 6\"><title>Compacted Native Subsoil</title></rect>';\n        svgHtml += '<text x=\"' + (bedX + 20) + '\" y=\"' + (bedY + soilH + 30) + '\" fill=\"#fef3c7\" font-size=\"12\" font-weight=\"bold\">Native Subsoil Drainage Base</text>';\n\n        // Settled Topsoil (Rich Dark Earth)\n        svgHtml += '<rect x=\"' + bedX + '\" y=\"' + (bedY + compH) + '\" width=\"' + bedW + '\" height=\"' + (soilH - compH) + '\" fill=\"#292524\" rx=\"0\"><title>Compacted Topsoil</title></rect>';\n        svgHtml += '<text x=\"' + (bedX + 20) + '\" y=\"' + (bedY + compH + 26) + '\" fill=\"#a3e635\" font-size=\"12\" font-weight=\"bold\">Finished Topsoil Layer (' + depthIn + '\" Depth)</text>';\n\n        // Compaction Settlement Zone (Striped / Lighter)\n        if (compH > 4) {\n          svgHtml += '<rect x=\"' + bedX + '\" y=\"' + bedY + '\" width=\"' + bedW + '\" height=\"' + compH + '\" fill=\"#a8a29e\" opacity=\"0.5\" stroke=\"#78716c\" stroke-dasharray=\"4,3\"><title>Settlement Loss Zone</title></rect>';\n          svgHtml += '<text x=\"' + (bedX + bedW - 20) + '\" y=\"' + (bedY + compH/2 + 4) + '\" fill=\"#ffffff\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"end\">Compaction Buffer: ' + compPct + '% Settling</text>';\n        }\n\n        // Depth Callout on Left\n        svgHtml += '<line x1=\"' + (bedX - 15) + '\" y1=\"' + bedY + '\" x2=\"' + (bedX - 15) + '\" y2=\"' + (bedY + soilH) + '\" stroke=\"#10b981\" stroke-width=\"2.5\" />';\n        svgHtml += '<text x=\"' + (bedX - 22) + '\" y=\"' + (bedY + soilH/2 + 4) + '\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"end\">' + depthIn + '\"</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyTopsoilReport(btn) {\n        var yds = document.getElementById('soil-res-yards').textContent;\n        var cuft = document.getElementById('soil-res-cuft').textContent;\n        var bags = document.getElementById('soil-res-bags15').textContent;\n        var tons = document.getElementById('soil-res-weight-tons').textContent;\n        var bulkCost = document.getElementById('soil-res-cost-bulk').textContent;\n        var depth = document.getElementById('soil-depth').value;\n\n        var text = '🌱 TOPSOIL & EARTHWORK MATERIAL ESTIMATE\\n' +\n          '====================================================\\n' +\n          '• Desired Depth: ' + depth + ' Inches\\n' +\n          '• Total Topsoil to Order: ' + yds + ' (' + cuft + ')\\n' +\n          '• Commercial Bags (1.5 cu ft): ' + bags + '\\n' +\n          '• Total Material Weight: ' + tons + '\\n' +\n          '• Estimated Bulk Delivery Cost: ' + bulkCost + '\\n' +\n          '----------------------------------------------------\\n' +\n          'Note: Includes compaction & settling volume buffer.\\n' +\n          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/topsoil-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          if (btn) {\n            var orig = btn.innerHTML;\n            btn.innerHTML = '<span>✓</span> Material Estimate Copied!';\n            btn.style.borderColor = '#10b981';\n            btn.style.color = '#10b981';\n            setTimeout(function() {\n              btn.innerHTML = orig;\n              btn.style.borderColor = 'var(--border)';\n              btn.style.color = 'var(--fg)';\n            }, 2000);\n          }\n        });\n      }\n\n      if (document.readyState === 'loading') {\n        document.addEventListener('DOMContentLoaded', calcTopsoil);\n      } else {\n        calcTopsoil();\n      }\n    </script>\n  ";

  writeFileSync(join(calcDir, 'topsoil-calculator.html'), renderTradePage({
    title: "Topsoil & Garden Bed Soil Calculator (Cubic Yards, Tons & Bag Counts) | Digital Tools Shed",
    metaDesc: "Calculate topsoil, compost, and raised garden bed soil volume in cubic yards, cubic feet, tons, and bags (0.75 cu ft / 1.5 cu ft). Features compaction settling factor and bulk delivery pricing.",
    canonical: `${DOMAIN}/calc/topsoil-calculator`,
    bodyContent: topsoilBody,
    currentPath: '/calc/topsoil-calculator',
    faq: [
  {
    "q": "How many cubic feet are in a cubic yard of topsoil?",
    "a": "There are exactly 27 cubic feet in one cubic yard of topsoil (3 ft × 3 ft × 3 ft = 27 cu ft). If buying standard 1.5 cubic foot bags from a home improvement store, it takes exactly 18 bags to equal one cubic yard."
  },
  {
    "q": "How much does one cubic yard of topsoil weigh?",
    "a": "One cubic yard of dry, screened topsoil weighs approximately 2,000 to 2,200 pounds (roughly 1.0 to 1.1 US tons). Wet or damp topsoil can weigh up to 2,600 to 2,800 pounds per cubic yard, while lightweight compost or raised-bed blends weigh roughly 1,000 to 1,400 pounds per yard."
  },
  {
    "q": "What is the recommended topsoil depth for lawns and garden beds?",
    "a": "For topdressing existing turf: 1/4 to 1/2 inch. For establishing a new sod or seeded lawn: 4 to 6 inches over loosened subsoil. For raised vegetable garden beds: 8 to 12 inches of a 50/50 mix of rich topsoil and organic compost."
  },
  {
    "q": "Why do you need to budget for soil compaction and settling?",
    "a": "Freshly screened, aerated topsoil shrinks in volume by 10% to 20% after being spread, raked, watered, and compacted. If you order only the raw mathematical volume without a 15% compaction buffer, your new lawn or raised garden beds will settle 1 to 2 inches below finished grade."
  },
  {
    "q": "Is it cheaper to buy bagged soil or order a bulk truck delivery?",
    "a": "For projects requiring more than 2 cubic yards (36 standard bags), bulk delivery is significantly cheaper. A bulk yard of screened topsoil costs $35 to $50 delivered from a local landscape yard, whereas 18 bagged units at $6/bag costs $108 per yard—more than double the bulk price."
  }
]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 17. OHM'S LAW & CIRCUIT VOLTAGE DROP CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const ohmsLawBody = "\n    <div class=\"article-container\" style=\"max-width: 1040px;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\">Home</a> &gt; <a href=\"/calc/\">Trade &amp; Engineering</a> &gt; Ohm’s Law Calculator\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <div style=\"display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;\">\n          <span class=\"badge badge-purple\">Electrical Engineering</span>\n          <span class=\"badge badge-green\">Ohm’s Law 12-Formula Wheel</span>\n          <span class=\"badge badge-blue\">NEC 3% Voltage Drop</span>\n        </div>\n        <h1 style=\"font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          Ohm’s Law &amp; Circuit Power Calculator\n        </h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Solve for any two unknown electrical variables (Voltage, Current, Resistance, or Power) from any two known values. Includes conductor wire gauge voltage drop simulator, NEC 3% compliance validator, and vector circuit schematic.\n        </p>\n      </header>\n\n      <!-- MAIN INPUT BOX -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 0; margin-bottom: 1.25rem; color: var(--fg);\">\n          ⚡ 1. Ohm's Law Wheel Solver (Enter Any 2 Known Values)\n        </h2>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Voltage (V):</label>\n            <div style=\"display: flex; gap: 0.5rem;\">\n              <input type=\"number\" id=\"ohm-v\" value=\"120\" step=\"1\" style=\"width: 65%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"onOhmInput('V')\" />\n              <select id=\"ohm-v-unit\" style=\"width: 35%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;\" onchange=\"recalcOhm()\">\n                <option value=\"1\" selected>V (Volts)</option>\n                <option value=\"0.001\">mV (Millivolts)</option>\n                <option value=\"1000\">kV (Kilovolts)</option>\n              </select>\n            </div>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Current (I):</label>\n            <div style=\"display: flex; gap: 0.5rem;\">\n              <input type=\"number\" id=\"ohm-i\" value=\"10\" step=\"0.5\" style=\"width: 65%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"onOhmInput('I')\" />\n              <select id=\"ohm-i-unit\" style=\"width: 35%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;\" onchange=\"recalcOhm()\">\n                <option value=\"1\" selected>A (Amperes)</option>\n                <option value=\"0.001\">mA (Milliamps)</option>\n                <option value=\"0.000001\">µA (Microamps)</option>\n              </select>\n            </div>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Resistance (R):</label>\n            <div style=\"display: flex; gap: 0.5rem;\">\n              <input type=\"number\" id=\"ohm-r\" value=\"\" placeholder=\"Calculated\" step=\"0.1\" style=\"width: 65%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"onOhmInput('R')\" />\n              <select id=\"ohm-r-unit\" style=\"width: 35%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;\" onchange=\"recalcOhm()\">\n                <option value=\"1\" selected>Ω (Ohms)</option>\n                <option value=\"1000\">kΩ (Kilo-ohms)</option>\n                <option value=\"1000000\">MΩ (Mega-ohms)</option>\n                <option value=\"0.001\">mΩ (Milliohms)</option>\n              </select>\n            </div>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Power (P):</label>\n            <div style=\"display: flex; gap: 0.5rem;\">\n              <input type=\"number\" id=\"ohm-p\" value=\"\" placeholder=\"Calculated\" step=\"10\" style=\"width: 65%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"onOhmInput('P')\" />\n              <select id=\"ohm-p-unit\" style=\"width: 35%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;\" onchange=\"recalcOhm()\">\n                <option value=\"1\" selected>W (Watts)</option>\n                <option value=\"1000\">kW (Kilowatts)</option>\n                <option value=\"0.001\">mW (Milliwatts)</option>\n                <option value=\"745.699872\">HP (Horsepower)</option>\n              </select>\n            </div>\n          </div>\n        </div>\n\n        <!-- QUICK VOLTAGE PRESETS ROW -->\n        <div style=\"display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; border-top: 1px solid var(--border); padding-top: 1rem;\">\n          <span style=\"font-size: 0.8rem; font-weight: bold; color: var(--text-muted); align-self: center; margin-right: 0.25rem;\">Standard Circuits:</span>\n          <button type=\"button\" onclick=\"setOhmPreset(5, 2)\" style=\"padding: 0.35rem 0.75rem; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); border-radius: 6px; font-size: 0.8rem; cursor: pointer;\">5V USB (2A)</button>\n          <button type=\"button\" onclick=\"setOhmPreset(12, 10)\" style=\"padding: 0.35rem 0.75rem; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); border-radius: 6px; font-size: 0.8rem; cursor: pointer;\">12V Automotive (10A)</button>\n          <button type=\"button\" onclick=\"setOhmPreset(24, 5)\" style=\"padding: 0.35rem 0.75rem; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); border-radius: 6px; font-size: 0.8rem; cursor: pointer;\">24V Industrial/Solar (5A)</button>\n          <button type=\"button\" onclick=\"setOhmPreset(120, 15)\" style=\"padding: 0.35rem 0.75rem; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); border-radius: 6px; font-size: 0.8rem; cursor: pointer;\">120V US Outlet (15A)</button>\n          <button type=\"button\" onclick=\"setOhmPreset(230, 16)\" style=\"padding: 0.35rem 0.75rem; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); border-radius: 6px; font-size: 0.8rem; cursor: pointer;\">230V EU Outlet (16A)</button>\n          <button type=\"button\" onclick=\"setOhmPreset(240, 30)\" style=\"padding: 0.35rem 0.75rem; border: 1px solid var(--border); background: var(--surface-alt); color: var(--fg); border-radius: 6px; font-size: 0.8rem; cursor: pointer;\">240V Dryer/EV (30A)</button>\n        </div>\n\n        <h2 style=\"font-family: var(--serif); font-size: 1.25rem; margin-top: 1rem; margin-bottom: 1.25rem; color: var(--fg); border-top: 1px solid var(--border); padding-top: 1.25rem;\">\n          📏 2. Conductor Wire Gauge &amp; Voltage Drop Simulator\n        </h2>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Wire Size (AWG):</label>\n            <select id=\"drop-awg\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"recalcOhm()\">\n              <option value=\"14\">14 AWG (15A Max Breaker)</option>\n              <option value=\"12\" selected>12 AWG (20A Max Breaker)</option>\n              <option value=\"10\">10 AWG (30A Max Breaker)</option>\n              <option value=\"8\">8 AWG (40A Max Breaker)</option>\n              <option value=\"6\">6 AWG (55A Max Breaker)</option>\n              <option value=\"4\">4 AWG (70A Max Breaker)</option>\n              <option value=\"2\">2 AWG (95A Max Breaker)</option>\n              <option value=\"0\">1/0 AWG (125A Max)</option>\n              <option value=\"00\">2/0 AWG (145A Max)</option>\n              <option value=\"0000\">4/0 AWG (195A Max)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Conductor Metal:</label>\n            <select id=\"drop-metal\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"recalcOhm()\">\n              <option value=\"copper\" selected>Copper (Cu — Standard)</option>\n              <option value=\"aluminum\">Aluminum (Al — Service Entry)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">One-Way Run Distance (Feet):</label>\n            <input type=\"number\" id=\"drop-length\" value=\"75\" min=\"1\" step=\"5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"recalcOhm()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Circuit System:</label>\n            <select id=\"drop-phase\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"recalcOhm()\">\n              <option value=\"single\" selected>1-Phase / DC (2-Wire)</option>\n              <option value=\"three\">3-Phase Balanced (3-Wire)</option>\n            </select>\n          </div>\n        </div>\n\n        <!-- MAIN KPI RESULT CARDS -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Total Circuit Power (P)</div>\n            <div id=\"ohm-res-power\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;\">1,200 W</div>\n            <div id=\"ohm-res-power-hp\" style=\"font-size: 0.85rem; color: var(--text-muted);\">1.20 kW | 1.61 Horsepower</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Total Load Resistance (R)</div>\n            <div id=\"ohm-res-r\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;\">12.00 Ω</div>\n            <div id=\"ohm-res-r-sub\" style=\"font-size: 0.85rem; color: var(--text-muted);\">Current: 10.00 A @ 120.0 V</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Line Voltage Drop</div>\n            <div id=\"ohm-res-drop-v\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;\">2.90 V</div>\n            <div id=\"ohm-res-drop-pct\" style=\"font-size: 0.85rem; color: var(--text-muted);\">2.42% Loss (Terminal: 117.1 V)</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #6366f1;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">NEC 3% Compliance</div>\n            <div id=\"ohm-res-nec-badge\" style=\"font-family: var(--mono); font-size: 1.8rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;\">PASS (2.4%)</div>\n            <div id=\"ohm-res-wire-loss\" style=\"font-size: 0.85rem; color: var(--text-muted);\">Cable Heat: 29.0 W (99 BTU/hr)</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- INTERACTIVE CIRCUIT SCHEMATIC SVG -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          🔌 Interactive Circuit Schematic &amp; Potential Profile\n        </h2>\n        <p style=\"font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;\">\n          Shows supply voltage source, line conductor parasitic loop resistance ($R_{\\text{wire}}$), load appliance ($R_{\\text{load}}$), and terminal load voltage after line loss.\n        </p>\n\n        <div style=\"overflow-x: auto;\">\n          <svg id=\"ohm-circuit-svg\" viewBox=\"0 0 800 240\" style=\"width: 100%; height: auto; min-width: 600px; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->\n      <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h3 style=\"font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;\">\n          📐 Step-by-Step Ohm’s Law &amp; Voltage Drop Derivations\n        </h3>\n        <div id=\"ohm-derivation-box\" style=\"font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);\">\n          Solving electrical circuit state...\n        </div>\n      </div>\n\n      <!-- ONE-CLICK COPY BUTTON -->\n      <div style=\"margin-bottom: 2.5rem;\">\n        <button type=\"button\" id=\"ohm-copy-btn\" onclick=\"copyOhmReport(this)\" class=\"btn btn-copy\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;\">\n          <span>📋</span> Copy Circuit Calculation &amp; Voltage Drop Audit\n        </button>\n      </div>\n\n      <!-- 5 FATAL TRAPS -->\n      <div style=\"margin: 2.5rem 0;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);\">\n          ⚠️ 5 Fatal Traps &amp; Engineering Pitfalls in Electrical Circuits\n        </h2>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 1rem;\">\n          <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n            <strong style=\"color: #ef4444;\">1. The Non-Ohmic Inrush Current Surge</strong>\n            Pure Ohm’s Law assumes constant electrical resistance. Real components like tungsten incandescent filaments, electric motors, and LED driver capacitive power supplies draw massive inrush current spikes. A cold motor or compressor draws 5 to 7 times its rated continuous running current (Locked Rotor Amps - LRA) for several hundred milliseconds, tripping sensitive breakers or dropping line voltage enough to brownout digital electronics.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n            <strong style=\"color: #f59e0b;\">2. Violating the NEC 3% Branch / 5% Feeder Voltage Drop Limit</strong>\n            Running high-current loads (like a 120V 12A space heater or RV air conditioner) over long, undersized extension cords causes voltage drops exceeding 8% to 10%. Motors starved of voltage draw higher amperage to maintain shaft mechanical power, overheating internal copper windings, degrading insulation, and creating severe fire hazards.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n            <strong style=\"color: #10b981;\">3. Aluminum vs. Copper Thermal Expansion &amp; Oxidation Fires</strong>\n            Aluminum wiring has roughly 1.6 times higher electrical resistivity than copper and a significantly higher coefficient of thermal expansion. Connecting aluminum conductors to standard copper-only screw terminals causes galvanic corrosion and cyclical loosening, developing high-resistance micro-gaps that arc and cause structural residential fires. Always use rated CO/ALR or dual-rated mechanical lugs with antioxidant compound.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n            <strong style=\"color: #3b82f6;\">4. Temperature Coefficient of Resistance (Attic &amp; Conduit De-rating)</strong>\n            Copper resistance increases by approximately 0.393% per °C rise (temperature coefficient alpha = 0.00393 / °C). On a sweltering summer day where an attic or roof conduit reaches 140°F (60°C), the conductor resistance increases by 16% over its 20°C lab rating. Failing to apply ambient temperature correction factors per NEC Table 310.15 causes unexpected voltage collapse and breaker trips.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n            <strong style=\"color: #8b5cf6;\">5. Neutral Conductor Triplen Harmonic Overheating</strong>\n            In 3-phase commercial systems feeding non-linear electronic switching loads (computers, servers, variable frequency drives), third harmonic currents (180 Hz triplen harmonics) do NOT cancel out in the neutral conductor—they add constructively in phase. The neutral conductor can carry up to 173% of the phase current, melting undersized shared neutral lines.\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <script>\n      // AWG Copper & Aluminum Resistance in Ohms per 1000 ft at 20°C (NEC Chapter 9 Table 8)\n      var WIRE_DATA = {\n        '14': { cu: 3.07, al: 5.06 },\n        '12': { cu: 1.93, al: 3.18 },\n        '10': { cu: 1.21, al: 2.00 },\n        '8':  { cu: 0.764, al: 1.26 },\n        '6':  { cu: 0.491, al: 0.808 },\n        '4':  { cu: 0.308, al: 0.508 },\n        '2':  { cu: 0.194, al: 0.319 },\n        '0':  { cu: 0.122, al: 0.201 },\n        '00': { cu: 0.0967, al: 0.159 },\n        '0000': { cu: 0.0608, al: 0.100 }\n      };\n\n      var lastOhmEdited = ['V', 'I'];\n\n      function onOhmInput(key) {\n        if (lastOhmEdited[0] !== key) {\n          lastOhmEdited = [key, lastOhmEdited[0]];\n        }\n        recalcOhm();\n      }\n\n      function setOhmPreset(v, i) {\n        document.getElementById('ohm-v').value = v;\n        document.getElementById('ohm-v-unit').value = '1';\n        document.getElementById('ohm-i').value = i;\n        document.getElementById('ohm-i-unit').value = '1';\n        lastOhmEdited = ['V', 'I'];\n        recalcOhm();\n      }\n\n      function recalcOhm() {\n        var vIn = parseFloat(document.getElementById('ohm-v').value);\n        var iIn = parseFloat(document.getElementById('ohm-i').value);\n        var rIn = parseFloat(document.getElementById('ohm-r').value);\n        var pIn = parseFloat(document.getElementById('ohm-p').value);\n\n        var vUnit = parseFloat(document.getElementById('ohm-v-unit').value) || 1;\n        var iUnit = parseFloat(document.getElementById('ohm-i-unit').value) || 1;\n        var rUnit = parseFloat(document.getElementById('ohm-r-unit').value) || 1;\n        var pUnit = parseFloat(document.getElementById('ohm-p-unit').value) || 1;\n\n        // Convert active values to base SI units\n        var V = !isNaN(vIn) ? vIn * vUnit : null;\n        var I = !isNaN(iIn) ? iIn * iUnit : null;\n        var R = !isNaN(rIn) ? rIn * rUnit : null;\n        var P = !isNaN(pIn) ? pIn * pUnit : null;\n\n        var pair = lastOhmEdited;\n\n        // Solve based on the two inputs\n        if (pair.indexOf('V') !== -1 && pair.indexOf('I') !== -1 && V !== null && I !== null && I !== 0) {\n          R = V / I;\n          P = V * I;\n        } else if (pair.indexOf('V') !== -1 && pair.indexOf('R') !== -1 && V !== null && R !== null && R !== 0) {\n          I = V / R;\n          P = (V * V) / R;\n        } else if (pair.indexOf('V') !== -1 && pair.indexOf('P') !== -1 && V !== null && P !== null && V !== 0) {\n          I = P / V;\n          R = (V * V) / P;\n        } else if (pair.indexOf('I') !== -1 && pair.indexOf('R') !== -1 && I !== null && R !== null) {\n          V = I * R;\n          P = I * I * R;\n        } else if (pair.indexOf('I') !== -1 && pair.indexOf('P') !== -1 && I !== null && P !== null && I !== 0) {\n          V = P / I;\n          R = P / (I * I);\n        } else if (pair.indexOf('R') !== -1 && pair.indexOf('P') !== -1 && R !== null && P !== null && R !== 0) {\n          V = Math.sqrt(P * R);\n          I = Math.sqrt(P / R);\n        } else {\n          // Default fallback\n          V = 120;\n          I = 10;\n          R = 12;\n          P = 1200;\n        }\n\n        // Update the non-edited input fields with calculated values\n        if (pair.indexOf('V') === -1) {\n          document.getElementById('ohm-v').value = (V / vUnit).toFixed(2);\n        }\n        if (pair.indexOf('I') === -1) {\n          document.getElementById('ohm-i').value = (I / iUnit).toFixed(2);\n        }\n        if (pair.indexOf('R') === -1) {\n          document.getElementById('ohm-r').value = (R / rUnit).toFixed(2);\n        }\n        if (pair.indexOf('P') === -1) {\n          document.getElementById('ohm-p').value = (P / pUnit).toFixed(1);\n        }\n\n        // Voltage Drop calculation\n        var awg = document.getElementById('drop-awg').value;\n        var metal = document.getElementById('drop-metal').value;\n        var lengthFt = parseFloat(document.getElementById('drop-length').value) || 75;\n        var phase = document.getElementById('drop-phase').value;\n\n        var rPer1k = WIRE_DATA[awg] ? (metal === 'copper' ? WIRE_DATA[awg].cu : WIRE_DATA[awg].al) : 1.93;\n        var wireResistance = (rPer1k / 1000) * lengthFt * (phase === 'three' ? Math.sqrt(3) : 2);\n        var vDrop = I * wireResistance;\n        var dropPct = V > 0 ? (vDrop / V) * 100 : 0;\n        var terminalV = Math.max(0, V - vDrop);\n        var wireLossWatts = (I * I) * wireResistance;\n        var wireBtu = wireLossWatts * 3.412142;\n\n        // Update KPI Cards\n        document.getElementById('ohm-res-power').textContent = Math.round(P).toLocaleString() + ' W';\n        document.getElementById('ohm-res-power-hp').textContent = (P / 1000).toFixed(2) + ' kW | ' + (P / 745.7).toFixed(2) + ' HP';\n\n        document.getElementById('ohm-res-r').textContent = R.toFixed(2) + ' Ω';\n        document.getElementById('ohm-res-r-sub').textContent = 'Current: ' + I.toFixed(2) + ' A @ ' + V.toFixed(1) + ' V';\n\n        document.getElementById('ohm-res-drop-v').textContent = vDrop.toFixed(2) + ' V';\n        document.getElementById('ohm-res-drop-pct').textContent = dropPct.toFixed(2) + '% Loss (Terminal: ' + terminalV.toFixed(1) + ' V)';\n\n        var necBadge = document.getElementById('ohm-res-nec-badge');\n        if (dropPct <= 3.0) {\n          necBadge.textContent = 'PASS (' + dropPct.toFixed(1) + '%)';\n          necBadge.style.color = '#10b981';\n        } else if (dropPct <= 5.0) {\n          necBadge.textContent = 'CAUTION (' + dropPct.toFixed(1) + '%)';\n          necBadge.style.color = '#f59e0b';\n        } else {\n          necBadge.textContent = 'FAIL (' + dropPct.toFixed(1) + '%)';\n          necBadge.style.color = '#ef4444';\n        }\n\n        document.getElementById('ohm-res-wire-loss').textContent = 'Cable Heat: ' + wireLossWatts.toFixed(1) + ' W (' + Math.round(wireBtu) + ' BTU/hr)';\n\n        // Derivation Box\n        var dBox = document.getElementById('ohm-derivation-box');\n        dBox.innerHTML = '<strong>1. Ohm’s Law Fundamental Equations:</strong> V = I × R = ' + I.toFixed(2) + ' A × ' + R.toFixed(2) + ' Ω = <strong>' + V.toFixed(2) + ' V</strong>.<br>' +\n          '<strong>2. Electrical Power Dissipation:</strong> P = V × I = ' + V.toFixed(2) + ' V × ' + I.toFixed(2) + ' A = <strong>' + P.toFixed(1) + ' W</strong> (' + (P/1000).toFixed(3) + ' kW).<br>' +\n          '<strong>3. Conductor Loop Resistance:</strong> R_wire = (' + rPer1k + ' Ω/1000ft / 1000) × ' + lengthFt + ' ft × ' + (phase === 'three' ? '√3' : '2') + ' = <strong>' + wireResistance.toFixed(3) + ' Ω</strong>.<br>' +\n          '<strong>4. Conductor Voltage Drop:</strong> V_drop = I × R_wire = ' + I.toFixed(2) + ' A × ' + wireResistance.toFixed(3) + ' Ω = <strong>' + vDrop.toFixed(2) + ' V (' + dropPct.toFixed(2) + '%)</strong>.<br>' +\n          '<strong>5. Terminal Operating Voltage:</strong> V_load = V_source - V_drop = ' + V.toFixed(1) + ' V - ' + vDrop.toFixed(2) + ' V = <strong>' + terminalV.toFixed(1) + ' V</strong> ' +\n          (dropPct <= 3.0 ? '<span style=\"color:#10b981;font-weight:bold;\">[NEC 3% Compliant]</span>' : '<span style=\"color:#ef4444;font-weight:bold;\">[Exceeds NEC 3% Limit — Upsize Wire!]</span>') + '.';\n\n        // Draw Circuit SVG\n        renderOhmCircuitSvg(V, I, R, terminalV, vDrop, wireResistance);\n      }\n\n      function renderOhmCircuitSvg(Vs, I, Rload, Vload, Vdrop, Rwire) {\n        var svg = document.getElementById('ohm-circuit-svg');\n        if (!svg) return;\n\n        var w = 800, h = 240;\n        var topY = 60, botY = 180;\n        var srcX = 120, loadX = 680;\n\n        var svgHtml = '';\n\n        // Conductors Loop\n        svgHtml += '<line x1=\"' + srcX + '\" y1=\"' + topY + '\" x2=\"' + loadX + '\" y2=\"' + topY + '\" stroke=\"#3b82f6\" stroke-width=\"3\" />';\n        svgHtml += '<line x1=\"' + srcX + '\" y1=\"' + botY + '\" x2=\"' + loadX + '\" y2=\"' + botY + '\" stroke=\"#64748b\" stroke-width=\"3\" />';\n\n        // Source Box\n        svgHtml += '<rect x=\"' + (srcX - 40) + '\" y=\"' + (topY - 10) + '\" width=\"80\" height=\"140\" fill=\"var(--surface-alt)\" stroke=\"#10b981\" stroke-width=\"2.5\" rx=\"8\" />';\n        svgHtml += '<text x=\"' + srcX + '\" y=\"' + (topY + 45) + '\" fill=\"#10b981\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">SOURCE</text>';\n        svgHtml += '<text x=\"' + srcX + '\" y=\"' + (topY + 75) + '\" fill=\"var(--fg)\" font-size=\"18\" font-weight=\"bold\" text-anchor=\"middle\">' + Vs.toFixed(0) + 'V</text>';\n        svgHtml += '<text x=\"' + srcX + '\" y=\"' + (topY + 105) + '\" fill=\"var(--text-muted)\" font-size=\"11\" text-anchor=\"middle\">Generator/Panel</text>';\n\n        // Parasitic Wire Resistor Glyphs\n        var midX = (srcX + loadX) / 2;\n        svgHtml += '<rect x=\"' + (midX - 55) + '\" y=\"' + (topY - 16) + '\" width=\"110\" height=\"32\" fill=\"var(--surface)\" stroke=\"#f59e0b\" stroke-width=\"1.5\" rx=\"4\" />';\n        svgHtml += '<text x=\"' + midX + '\" y=\"' + (topY + 5) + '\" fill=\"#f59e0b\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">R_line: ' + Rwire.toFixed(2) + 'Ω (-' + Vdrop.toFixed(1) + 'V)</text>';\n\n        // Load Box\n        svgHtml += '<rect x=\"' + (loadX - 45) + '\" y=\"' + (topY - 10) + '\" width=\"90\" height=\"140\" fill=\"var(--surface-alt)\" stroke=\"#6366f1\" stroke-width=\"2.5\" rx=\"8\" />';\n        svgHtml += '<text x=\"' + loadX + '\" y=\"' + (topY + 45) + '\" fill=\"#6366f1\" font-size=\"14\" font-weight=\"bold\" text-anchor=\"middle\">LOAD</text>';\n        svgHtml += '<text x=\"' + loadX + '\" y=\"' + (topY + 75) + '\" fill=\"var(--fg)\" font-size=\"18\" font-weight=\"bold\" text-anchor=\"middle\">' + Vload.toFixed(1) + 'V</text>';\n        svgHtml += '<text x=\"' + loadX + '\" y=\"' + (topY + 105) + '\" fill=\"var(--text-muted)\" font-size=\"11\" text-anchor=\"middle\">' + Rload.toFixed(1) + 'Ω (' + I.toFixed(1) + 'A)</text>';\n\n        // Current Flow Arrow in Top Wire\n        svgHtml += '<polygon points=\"' + (midX + 75) + ',' + (topY - 6) + ' ' + (midX + 90) + ',' + topY + ' ' + (midX + 75) + ',' + (topY + 6) + '\" fill=\"#3b82f6\" />';\n        svgHtml += '<text x=\"' + (midX + 95) + '\" y=\"' + (topY - 8) + '\" fill=\"#3b82f6\" font-size=\"11\" font-weight=\"bold\">I = ' + I.toFixed(1) + 'A →</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyOhmReport(btn) {\n        var v = document.getElementById('ohm-v').value;\n        var i = document.getElementById('ohm-i').value;\n        var r = document.getElementById('ohm-res-r').textContent;\n        var p = document.getElementById('ohm-res-power').textContent;\n        var drop = document.getElementById('ohm-res-drop-v').textContent;\n        var dropPct = document.getElementById('ohm-res-drop-pct').textContent;\n        var nec = document.getElementById('ohm-res-nec-badge').textContent;\n        var heat = document.getElementById('ohm-res-wire-loss').textContent;\n\n        var text = '⚡ OHM’S LAW & CIRCUIT VOLTAGE DROP AUDIT\\n' +\n          '====================================================\\n' +\n          '• Supply Voltage: ' + v + ' V\\n' +\n          '• Circuit Current: ' + i + ' A\\n' +\n          '• Total Load Resistance: ' + r + '\\n' +\n          '• Total Dissipated Power: ' + p + '\\n' +\n          '• Line Voltage Drop: ' + drop + ' (' + dropPct + ')\\n' +\n          '• NEC 3% Compliance Status: ' + nec + '\\n' +\n          '• ' + heat + '\\n' +\n          '----------------------------------------------------\\n' +\n          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/ohms-law-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          if (btn) {\n            var orig = btn.innerHTML;\n            btn.innerHTML = '<span>✓</span> Circuit Audit Copied!';\n            btn.style.borderColor = '#10b981';\n            btn.style.color = '#10b981';\n            setTimeout(function() {\n              btn.innerHTML = orig;\n              btn.style.borderColor = 'var(--border)';\n              btn.style.color = 'var(--fg)';\n            }, 2000);\n          }\n        });\n      }\n\n      if (document.readyState === 'loading') {\n        document.addEventListener('DOMContentLoaded', recalcOhm);\n      } else {\n        recalcOhm();\n      }\n    </script>\n  ";

  writeFileSync(join(calcDir, 'ohms-law-calculator.html'), renderTradePage({
    title: "Ohm’s Law & Electrical Circuit Calculator (V, I, R, P & Wire Voltage Drop) | Digital Tools Shed",
    metaDesc: "Calculate Voltage (V), Current (I), Resistance (R), and Power (P) using the complete Ohm’s Law wheel. Features conductor wire gauge voltage drop simulator, NEC 3% code compliance, and interactive circuit schematic.",
    canonical: `${DOMAIN}/calc/ohms-law-calculator`,
    bodyContent: ohmsLawBody,
    currentPath: '/calc/ohms-law-calculator',
    faq: [
  {
    "q": "What are the four fundamental formulas of Ohm’s Law?",
    "a": "The four interrelated formulas connecting Voltage (V in Volts), Current (I in Amperes), Resistance (R in Ohms), and Power (P in Watts) are: V = I × R (Voltage), I = V / R (Current), R = V / I (Resistance), and P = V × I = I²R = V² / R (Power)."
  },
  {
    "q": "How do you calculate voltage drop over a long wire run?",
    "a": "Single-phase AC and DC voltage drop is calculated via V_drop = 2 × L × R_conductor × I, where L is one-way distance in feet or meters, R_conductor is the resistance per unit length of the specific wire gauge (AWG), and I is circuit load current in Amps. The multiplier 2 accounts for the return conductor."
  },
  {
    "q": "What is the National Electrical Code (NEC) limit on voltage drop?",
    "a": "The NEC (Informational Note 210.19(A) and 215.2(A)(1)) recommends that voltage drop should not exceed 3% on any branch circuit, and the total combined voltage drop on both feeder and branch circuit conductors should not exceed 5% from service panel to load."
  },
  {
    "q": "Why does tungsten filament light bulb resistance increase when turned on?",
    "a": "Tungsten is a non-ohmic conductor with a positive temperature coefficient of resistance (PTC). When cold at room temperature (20°C), the filament resistance is roughly 1/15th of its operating resistance. When energized to 2,500°C, thermal lattice vibrations increase electron scattering, causing operating resistance to rise fifteen-fold and producing a brief inrush current spike."
  },
  {
    "q": "What happens to voltage drop if you double the distance of a wire run?",
    "a": "Because conductor resistance is directly proportional to wire length (R = ρL/A), doubling the run distance exactly doubles total circuit resistance and therefore doubles the total voltage drop, quadrupling thermal power dissipation in the supply lines if unaddressed."
  }
]
  }));

  // ─────────────────────────────────────────────────────────────────────────────
  // 18. ROOM BTU & AC HEAT PUMP SIZING CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const btuBody = "\n    <div class=\"article-container\" style=\"max-width: 1040px;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\">Home</a> &gt; <a href=\"/calc/\">Trade &amp; HVAC</a> &gt; BTU Calculator\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <div style=\"display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;\">\n          <span class=\"badge badge-purple\">HVAC &amp; Thermodynamics</span>\n          <span class=\"badge badge-green\">Manual J Simplified</span>\n          <span class=\"badge badge-blue\">Mini-Split &amp; Heat Pump Engine</span>\n        </div>\n        <h1 style=\"font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          Room BTU &amp; AC Heat Pump Sizing Calculator\n        </h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Determine exact cooling and heating BTU loads, refrigeration tonnage, and electrical running costs. Accurately factors cubic room volume, regional climate zone, window solar radiation, and insulation quality.\n        </p>\n      </header>\n\n      <!-- MAIN INPUT BOX -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Room Length (Feet):</label>\n            <input type=\"number\" id=\"btu-len\" value=\"22\" min=\"5\" step=\"1\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcBTU()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Room Width (Feet):</label>\n            <input type=\"number\" id=\"btu-wid\" value=\"18\" min=\"5\" step=\"1\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcBTU()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Ceiling Height:</label>\n            <select id=\"btu-ceil\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcBTU()\">\n              <option value=\"8\" selected>8 Feet (Standard 2.4m)</option>\n              <option value=\"9\">9 Feet (Modern Home)</option>\n              <option value=\"10\">10 Feet (High Ceiling)</option>\n              <option value=\"12\">12 Feet (Cathedral / Vaulted)</option>\n              <option value=\"14\">14 Feet (Two-Story Loft)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">US Climate Zone:</label>\n            <select id=\"btu-climate\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcBTU()\">\n              <option value=\"1.25\">Zone 1: Hot &amp; Humid (FL, Deep South TX)</option>\n              <option value=\"1.15\" selected>Zone 2: Warm Southern (GA, NC, SC, AZ)</option>\n              <option value=\"1.00\">Zone 3/4: Moderate Central (VA, MO, CA)</option>\n              <option value=\"0.90\">Zone 5/6: Cool Northern (NY, OH, IL, WA)</option>\n              <option value=\"0.80\">Zone 7: Subarctic (MN, ND, ME, AK)</option>\n            </select>\n          </div>\n        </div>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Insulation Quality:</label>\n            <select id=\"btu-insulation\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcBTU()\">\n              <option value=\"1.25\">Poor (Single-pane, Uninsulated Attic)</option>\n              <option value=\"1.00\" selected>Average (Double-pane, R-30 Attic)</option>\n              <option value=\"0.85\">High-Efficiency (Low-E Windows, R-49+)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Sunlight &amp; Window Exposure:</label>\n            <select id=\"btu-sun\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcBTU()\">\n              <option value=\"1.15\">Heavy Sun (South / West facing windows)</option>\n              <option value=\"1.00\" selected>Average / Moderate Sun Exposure</option>\n              <option value=\"0.90\">Heavily Shaded / North facing windows</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Room Type / Kitchen Load:</label>\n            <select id=\"btu-kitchen\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcBTU()\">\n              <option value=\"0\" selected>Living Room / Bedroom / Office</option>\n              <option value=\"4000\">Kitchen (+4,000 BTU for Stove/Oven)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Regular Occupants:</label>\n            <input type=\"number\" id=\"btu-people\" value=\"2\" min=\"1\" max=\"20\" step=\"1\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcBTU()\" />\n          </div>\n        </div>\n\n        <!-- MAIN KPI RESULT CARDS -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Recommended Cooling Capacity</div>\n            <div id=\"btu-res-cooling\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;\">12,000 BTU</div>\n            <div id=\"btu-res-tonnage\" style=\"font-size: 0.85rem; color: var(--text-muted);\">1.00 Ton AC / Heat Pump</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Commercial Mini-Split Sizing</div>\n            <div id=\"btu-res-minisplit\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;\">12k BTU Unit</div>\n            <div id=\"btu-res-minisplit-sub\" style=\"font-size: 0.85rem; color: var(--text-muted);\">Single-Zone Ductless Inverter</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Winter Heating Requirement</div>\n            <div id=\"btu-res-heating\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;\">14,400 BTU</div>\n            <div id=\"btu-res-heating-sub\" style=\"font-size: 0.85rem; color: var(--text-muted);\">4.22 kW Electric Heating Equivalent</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #6366f1;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Est. Power Consumption (18 SEER2)</div>\n            <div id=\"btu-res-power\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #6366f1; margin-bottom: 0.2rem;\">667 W</div>\n            <div id=\"btu-res-power-sub\" style=\"font-size: 0.85rem; color: var(--text-muted);\">~$0.11 / hour @ $0.16/kWh</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- INTERACTIVE THERMAL GAIN SVG -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          🌡️ Interactive Room Thermal Heat Gain Schematic\n        </h2>\n        <p style=\"font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;\">\n          Shows solar radiation through windows, ceiling attic conduction, occupant metabolic heat (+400 BTU/person), and mini-split indoor air distribution.\n        </p>\n\n        <div style=\"overflow-x: auto;\">\n          <svg id=\"btu-room-svg\" viewBox=\"0 0 800 240\" style=\"width: 100%; height: auto; min-width: 600px; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->\n      <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h3 style=\"font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;\">\n          📐 Step-by-Step Manual J Heat Load Derivations\n        </h3>\n        <div id=\"btu-derivation-box\" style=\"font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);\">\n          Calculating HVAC heat load parameters...\n        </div>\n      </div>\n\n      <!-- ONE-CLICK COPY BUTTON -->\n      <div style=\"margin-bottom: 2.5rem;\">\n        <button type=\"button\" id=\"btu-copy-btn\" onclick=\"copyBtuReport(this)\" class=\"btn btn-copy\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;\">\n          <span>📋</span> Copy HVAC Sizing &amp; BTU Load Report\n        </button>\n      </div>\n\n      <!-- 5 FATAL TRAPS -->\n      <div style=\"margin: 2.5rem 0;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);\">\n          ⚠️ 5 Fatal Traps &amp; Sizing Mistakes in Air Conditioning\n        </h2>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 1rem;\">\n          <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n            <strong style=\"color: #ef4444;\">1. The \"Bigger is Better\" Short-Cycling Humidity Disaster</strong>\n            Purchasing a 24,000 BTU unit for a 12,000 BTU room cools the air in 5 minutes and shuts off before the compressor has time to condense moisture from the air. Air conditioning requires at least 15 to 20 minutes of continuous runtime to lower relative humidity. Short-cycling creates cold, clammy 70°F air with 75% relative humidity, fostering toxic black mold colonization and prematurely burning out compressor start capacitors.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n            <strong style=\"color: #f59e0b;\">2. Overlooking Cathedral &amp; 10-Foot Ceiling Air Volume</strong>\n            Standard HVAC rules of thumb (20 BTU per square foot) assume 8-foot ceilings. A 20x20 ft living room with 12-foot cathedral ceilings has 50% more air mass and substantially larger surface wall/roof area exposed to summer heat. Underestimating cubic volume results in an undersized system that runs 100% of the day without reaching thermostat setpoint.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n            <strong style=\"color: #10b981;\">3. Unshaded Western Window Afternoon Solar Surge</strong>\n            West-facing patio doors and picture windows receive intense, low-angle infrared radiation between 3 PM and 7 PM—the hottest hours of the day. A single unshaded 6x8 ft glass sliding door can introduce an extra 1,800 to 2,500 BTU/hr of direct heat gain, completely overpowering an otherwise correctly sized air conditioner.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n            <strong style=\"color: #3b82f6;\">4. Low-Ambient Winter Heat Pump Capacity Collapse</strong>\n            Conventional air-source heat pumps suffer an efficiency and capacity drop below freezing. At 15°F (-9°C), a standard heat pump loses up to 45% of its rated heating output just when heating demand is highest. Homeowners in northern zones must either purchase cold-climate inverter systems (rated down to -15°F) or integrate supplemental electric auxiliary resistance heat strips.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n            <strong style=\"color: #8b5cf6;\">5. Attic Ductwork Heat Transfer &amp; Air Leakage Losses</strong>\n            In central AC installations where flexible supply ducts run through an unconditioned 140°F (60°C) summer attic, radiant heat through poorly insulated ducts (R-4.2) and microscopic seam leaks can rob 20% to 30% of total cooling capacity before chilled air ever enters the room. Ductless mini-splits eliminate this loss entirely by delivering refrigerant directly to the conditioned zone.\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <script>\n      function calcBTU() {\n        var len = parseFloat(document.getElementById('btu-len').value) || 20;\n        var wid = parseFloat(document.getElementById('btu-wid').value) || 15;\n        var ceilH = parseFloat(document.getElementById('btu-ceil').value) || 8;\n        var climateFactor = parseFloat(document.getElementById('btu-climate').value) || 1.15;\n        var insulFactor = parseFloat(document.getElementById('btu-insulation').value) || 1.0;\n        var sunFactor = parseFloat(document.getElementById('btu-sun').value) || 1.0;\n        var kitchenLoad = parseFloat(document.getElementById('btu-kitchen').value) || 0;\n        var occupants = parseFloat(document.getElementById('btu-people').value) || 2;\n\n        var areaSqFt = len * wid;\n        var volumeCuFt = areaSqFt * ceilH;\n\n        // Base BTU calculation:\n        // Standard 8ft ceiling base: 20 BTU / sq ft\n        // Volume adjustment: ceilH / 8\n        var baseBTU = areaSqFt * 20 * (ceilH / 8);\n\n        // Apply environmental multipliers\n        var adjustedBTU = baseBTU * climateFactor * insulFactor * sunFactor;\n\n        // Occupant load: +400 BTU for each person over 2\n        var occupantLoad = Math.max(0, (occupants - 2) * 400);\n\n        var totalCoolingBTU = adjustedBTU + kitchenLoad + occupantLoad;\n\n        // AC Tonnage: 12,000 BTU = 1 Ton\n        var tonnage = totalCoolingBTU / 12000;\n\n        // Commercial standard mini-split sizes: 9k, 12k, 18k, 24k, 30k, 36k\n        var standardSizes = [9000, 12000, 18000, 24000, 30000, 36000, 48000];\n        var recommendedUnit = standardSizes[standardSizes.length - 1];\n        for (var i = 0; i < standardSizes.length; i++) {\n          if (standardSizes[i] >= totalCoolingBTU * 0.95) {\n            recommendedUnit = standardSizes[i];\n            break;\n          }\n        }\n\n        // Heating Requirement (typically 1.2x to 1.3x cooling in moderate/cold zones)\n        var totalHeatingBTU = totalCoolingBTU * 1.2;\n        var heatingKw = totalHeatingBTU / 3412.142;\n\n        // Estimated Power draw (Watts = BTU / SEER2, using modern SEER2 = 18.0)\n        var wattsDraw = Math.round(recommendedUnit / 18.0);\n        var costPerHour = (wattsDraw / 1000) * 0.16; // average US rate $0.16/kWh\n\n        // Update KPIs\n        document.getElementById('btu-res-cooling').textContent = Math.round(totalCoolingBTU).toLocaleString() + ' BTU';\n        document.getElementById('btu-res-tonnage').textContent = tonnage.toFixed(2) + ' Ton AC / Heat Pump';\n\n        document.getElementById('btu-res-minisplit').textContent = (recommendedUnit / 1000) + 'k BTU Unit';\n        document.getElementById('btu-res-minisplit-sub').textContent = 'Optimal Commercial Size for ' + Math.round(areaSqFt) + ' sq ft';\n\n        document.getElementById('btu-res-heating').textContent = Math.round(totalHeatingBTU).toLocaleString() + ' BTU';\n        document.getElementById('btu-res-heating-sub').textContent = heatingKw.toFixed(2) + ' kW Heating Load Equivalent';\n\n        document.getElementById('btu-res-power').textContent = wattsDraw + ' W';\n        document.getElementById('btu-res-power-sub').textContent = '~$' + costPerHour.toFixed(2) + ' / hour @ $0.16/kWh';\n\n        // Derivation Box\n        var dBox = document.getElementById('btu-derivation-box');\n        dBox.innerHTML = '<strong>1. Room Dimensions &amp; Air Volume:</strong> ' + len + ' ft × ' + wid + ' ft = ' + areaSqFt.toFixed(0) + ' sq ft × ' + ceilH + ' ft ceiling = <strong>' + Math.round(volumeCuFt).toLocaleString() + ' cu ft</strong>.<br>' +\n          '<strong>2. Volumetric Baseline Load:</strong> ' + areaSqFt.toFixed(0) + ' sq ft × 20 BTU × (' + ceilH + '/8) = <strong>' + Math.round(baseBTU).toLocaleString() + ' BTU/hr</strong>.<br>' +\n          '<strong>3. Climate &amp; Envelope Multipliers:</strong> Climate (' + climateFactor.toFixed(2) + ') × Insulation (' + insulFactor.toFixed(2) + ') × Sun (' + sunFactor.toFixed(2) + ') = ' + (climateFactor * insulFactor * sunFactor).toFixed(3) + 'x = <strong>' + Math.round(adjustedBTU).toLocaleString() + ' BTU/hr</strong>.<br>' +\n          '<strong>4. Internal Thermal Loads:</strong> Kitchen Appliances (+' + kitchenLoad.toLocaleString() + ' BTU) + Occupants (' + occupants + ' people = +' + occupantLoad.toLocaleString() + ' BTU) = <strong>+' + (kitchenLoad + occupantLoad).toLocaleString() + ' BTU/hr</strong>.<br>' +\n          '<strong>5. Final Total HVAC Capacity:</strong> ' + Math.round(totalCoolingBTU).toLocaleString() + ' BTU/hr ÷ 12,000 BTU/Ton = <strong>' + tonnage.toFixed(2) + ' Tons</strong> (Recommend <strong>' + (recommendedUnit/1000) + 'k BTU Mini-Split</strong>).';\n\n        // Render Room SVG\n        renderBtuRoomSvg(len, wid, ceilH, recommendedUnit, totalCoolingBTU);\n      }\n\n      function renderBtuRoomSvg(len, wid, ceilH, unitBtu, totalBtu) {\n        var svg = document.getElementById('btu-room-svg');\n        if (!svg) return;\n\n        var w = 800, h = 240;\n        var rX = 140, rY = 40, rW = 520, rH = 160;\n\n        var svgHtml = '';\n\n        // Room Floor & Walls\n        svgHtml += '<rect x=\"' + rX + '\" y=\"' + rY + '\" width=\"' + rW + '\" height=\"' + rH + '\" fill=\"var(--surface-alt)\" stroke=\"var(--border)\" stroke-width=\"2.5\" rx=\"6\" />';\n\n        // Sun Window on Left\n        svgHtml += '<rect x=\"' + rX + '\" y=\"' + (rY + 30) + '\" width=\"10\" height=\"90\" fill=\"#f59e0b\" /><title>South/West Sun Window</title>';\n        svgHtml += '<text x=\"' + (rX - 15) + '\" y=\"' + (rY + 75) + '\" fill=\"#f59e0b\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"end\">Sun Infiltration ☀️</text>';\n\n        // Heat gain arrows through window\n        svgHtml += '<line x1=\"' + (rX - 10) + '\" y1=\"' + (rY + 50) + '\" x2=\"' + (rX + 45) + '\" y2=\"' + (rY + 65) + '\" stroke=\"#f59e0b\" stroke-width=\"2\" stroke-dasharray=\"4,2\" />';\n        svgHtml += '<line x1=\"' + (rX - 10) + '\" y1=\"' + (rY + 90) + '\" x2=\"' + (rX + 45) + '\" y2=\"' + (rY + 105) + '\" stroke=\"#f59e0b\" stroke-width=\"2\" stroke-dasharray=\"4,2\" />';\n\n        // Mini-split indoor air handler on right wall\n        var acX = rX + rW - 80, acY = rY + 25;\n        svgHtml += '<rect x=\"' + acX + '\" y=\"' + acY + '\" width=\"70\" height=\"30\" fill=\"#3b82f6\" stroke=\"#ffffff\" stroke-width=\"1.5\" rx=\"4\" />';\n        svgHtml += '<text x=\"' + (acX + 35) + '\" y=\"' + (acY + 20) + '\" fill=\"#ffffff\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">' + (unitBtu / 1000) + 'k AC</text>';\n\n        // Cold airflow plume\n        svgHtml += '<path d=\"M ' + acX + ' ' + (acY + 30) + ' Q ' + (rX + rW/2) + ' ' + (rY + 80) + ' ' + (rX + 120) + ' ' + (rY + rH - 30) + '\" fill=\"none\" stroke=\"#10b981\" stroke-width=\"3\" stroke-dasharray=\"6,4\" />';\n        svgHtml += '<text x=\"' + (rX + rW/2 + 20) + '\" y=\"' + (rY + 110) + '\" fill=\"#10b981\" font-size=\"12\" font-weight=\"bold\">Cooling Airflow (' + Math.round(totalBtu).toLocaleString() + ' BTU)</text>';\n\n        // Room Dimensions Callout\n        svgHtml += '<text x=\"' + (rX + rW/2) + '\" y=\"' + (rY + rH - 12) + '\" fill=\"var(--text-muted)\" font-size=\"11\" text-anchor=\"middle\">' + len + ' ft Length × ' + wid + ' ft Width (' + ceilH + ' ft Ceiling)</text>';\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copyBtuReport(btn) {\n        var cooling = document.getElementById('btu-res-cooling').textContent;\n        var tonnage = document.getElementById('btu-res-tonnage').textContent;\n        var unit = document.getElementById('btu-res-minisplit').textContent;\n        var heating = document.getElementById('btu-res-heating').textContent;\n        var power = document.getElementById('btu-res-power').textContent;\n        var len = document.getElementById('btu-len').value;\n        var wid = document.getElementById('btu-wid').value;\n        var ceil = document.getElementById('btu-ceil').value;\n\n        var text = '❄️ ROOM BTU & HVAC SIZING AUDIT\\n' +\n          '====================================================\\n' +\n          '• Room Dimensions: ' + len + ' ft × ' + wid + ' ft (' + ceil + ' ft Ceiling)\\n' +\n          '• Required Cooling Capacity: ' + cooling + '\\n' +\n          '• AC Refrigeration Tonnage: ' + tonnage + '\\n' +\n          '• Recommended Mini-Split Size: ' + unit + '\\n' +\n          '• Winter Heating Load: ' + heating + '\\n' +\n          '• Continuous Running Power: ' + power + '\\n' +\n          '----------------------------------------------------\\n' +\n          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/btu-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          if (btn) {\n            var orig = btn.innerHTML;\n            btn.innerHTML = '<span>✓</span> HVAC Sizing Copied!';\n            btn.style.borderColor = '#10b981';\n            btn.style.color = '#10b981';\n            setTimeout(function() {\n              btn.innerHTML = orig;\n              btn.style.borderColor = 'var(--border)';\n              btn.style.color = 'var(--fg)';\n            }, 2000);\n          }\n        });\n      }\n\n      if (document.readyState === 'loading') {\n        document.addEventListener('DOMContentLoaded', calcBTU);\n      } else {\n        calcBTU();\n      }\n    </script>\n  ";

  writeFileSync(join(calcDir, 'btu-calculator.html'), renderTradePage({
    title: "BTU Calculator — Room AC Tonnage, Mini-Split & Heat Pump Sizing (Manual J Simplified) | Digital Tools Shed",
    metaDesc: "Calculate exact room cooling and heating BTUs, air conditioner tonnage, and mini-split heat pump size. Factors ceiling height volume, climate zone, window sun exposure, and insulation quality with thermal heat gain SVG.",
    canonical: `${DOMAIN}/calc/btu-calculator`,
    bodyContent: btuBody,
    currentPath: '/calc/btu-calculator',
    faq: [
  {
    "q": "How many BTUs do I need per square foot of room space?",
    "a": "The general rule of thumb is 20 BTU per square foot for standard 8-foot ceilings in moderate climates. However, this simplistic estimate fails to account for cathedral ceilings (which increase air volume by 30% to 60%), direct southern/western sun exposure (+15%), uninsulated attics (+20%), or kitchen appliances (+4,000 BTU)."
  },
  {
    "q": "Why is an oversized air conditioner worse than an undersized one?",
    "a": "An oversized AC cools the room air rapidly and short-cycles off in 5 to 8 minutes before running long enough to condense moisture from the air. This leaves the room cold but excessively humid (clammy air above 65% RH), which breeds toxic black mold, dust mites, and causes premature compressor motor failure."
  },
  {
    "q": "How many BTUs are in 1 Ton of air conditioning capacity?",
    "a": "Exactly 12,000 BTUs per hour equals 1 Ton of refrigeration capacity. The term originated from the cooling rate required to melt 1 short ton (2,000 lbs) of ice over a 24-hour period. A 2.5-Ton heat pump provides 30,000 BTU/hr of cooling."
  },
  {
    "q": "How do you calculate the electrical operating cost of an air conditioner from BTUs?",
    "a": "Divide total BTUs by the unit’s SEER2 efficiency rating to get continuous operating wattage: Watts = BTU / SEER2. For example, an 18,000 BTU mini-split with an 18 SEER2 rating draws roughly 1,000 Watts (1 kW). At $0.16 per kWh, running it costs approximately $0.16 per hour of compressor operation."
  },
  {
    "q": "Do heat pumps lose heating capacity in freezing winter weather?",
    "a": "Yes. Conventional air-source heat pumps lose 30% to 50% of their rated heating capacity when outdoor temperatures drop below 20°F (-7°C) because less ambient thermal energy is available to extract. For cold northern climates (Zones 5–7), select cold-climate hyper-heating inverter heat pumps rated for 100% capacity down to -5°F (-20°C)."
  }
]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 19. SOLAR PANEL & BATTERY STORAGE SIZING CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const solarBody = "\n    <div class=\"article-container\" style=\"max-width: 1040px;\">\n      <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\">\n        <a href=\"/\">Home</a> &gt; <a href=\"/calc/\">Trade &amp; Engineering</a> &gt; Solar Calculator\n      </nav>\n\n      <header style=\"margin-bottom: 2rem;\">\n        <div style=\"display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;\">\n          <span class=\"badge badge-purple\">Renewable Energy Engineering</span>\n          <span class=\"badge badge-green\">30% Federal Tax Credit</span>\n          <span class=\"badge badge-blue\">LiFePO4 Battery Sizing</span>\n        </div>\n        <h1 style=\"font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          Solar Panel &amp; Battery Storage System Sizing Calculator\n        </h1>\n        <p style=\"color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;\">\n          Size residential solar PV arrays and battery backup systems. Accurately factors monthly consumption, regional peak sun hours (PSh), system loss derating, 30% clean energy tax credits, and off-grid emergency autonomy days.\n        </p>\n      </header>\n\n      <!-- MAIN INPUT BOX -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;\">\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Monthly Electric Bill ($):</label>\n            <input type=\"number\" id=\"sol-bill\" value=\"185\" min=\"20\" step=\"5\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"syncBillToKwh()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Electricity Rate ($ / kWh):</label>\n            <input type=\"number\" id=\"sol-rate\" value=\"0.18\" min=\"0.05\" max=\"0.60\" step=\"0.01\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcSolar()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Monthly Consumption (kWh):</label>\n            <input type=\"number\" id=\"sol-kwh\" value=\"1028\" min=\"100\" step=\"25\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcSolar()\" />\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Regional Peak Sun Hours (PSh):</label>\n            <select id=\"sol-psh\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcSolar()\">\n              <option value=\"5.8\">5.8 PSh — Southwest Desert (AZ, NV, SoCal)</option>\n              <option value=\"5.0\">5.0 PSh — Sunbelt Southern (TX, FL, NM, UT)</option>\n              <option value=\"4.4\" selected>4.4 PSh — Moderate Central (NC, VA, MO, CO)</option>\n              <option value=\"3.8\">3.8 PSh — Midwest &amp; Mid-Atlantic (OH, PA, NY)</option>\n              <option value=\"3.2\">3.2 PSh — Pacific Northwest &amp; Northern (WA, OR, ME)</option>\n            </select>\n          </div>\n        </div>\n\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem;\">\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Solar Panel Wattage:</label>\n            <select id=\"sol-panel-w\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcSolar()\">\n              <option value=\"350\">350W Standard Poly/Mono</option>\n              <option value=\"400\" selected>400W High-Efficiency Monocrystalline</option>\n              <option value=\"450\">450W Commercial Grade</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Battery Backup Autonomy:</label>\n            <select id=\"sol-autonomy\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcSolar()\">\n              <option value=\"0\">0 Days (Grid-Tied — No Battery)</option>\n              <option value=\"0.5\">0.5 Days (Evening Self-Consumption / 12h)</option>\n              <option value=\"1.0\" selected>1.0 Full Day (Essential Circuit Backup)</option>\n              <option value=\"2.0\">2.0 Days (Severe Storm Autonomy)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Battery Chemistry &amp; Voltage:</label>\n            <select id=\"sol-batt-type\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;\" onchange=\"calcSolar()\">\n              <option value=\"lifepo4_48\" selected>LiFePO4 Lithium (90% DoD, 48V Bank)</option>\n              <option value=\"lifepo4_24\">LiFePO4 Lithium (90% DoD, 24V Bank)</option>\n              <option value=\"agm_48\">Lead-Acid / AGM (50% DoD, 48V Bank)</option>\n              <option value=\"agm_12\">Lead-Acid / AGM (50% DoD, 12V Bank)</option>\n            </select>\n          </div>\n\n          <div>\n            <label style=\"display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;\">Turnkey Installed Cost ($/W):</label>\n            <input type=\"number\" id=\"sol-cost-w\" value=\"2.85\" min=\"1.50\" max=\"4.50\" step=\"0.05\" style=\"width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;\" oninput=\"calcSolar()\" />\n          </div>\n        </div>\n\n        <!-- MAIN KPI RESULT CARDS -->\n        <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;\">\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Recommended PV Array Size</div>\n            <div id=\"sol-res-kw\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;\">9.2 kW DC</div>\n            <div id=\"sol-res-panels\" style=\"font-size: 0.85rem; color: var(--text-muted);\">23 Panels @ 400W (~400 sq ft)</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Battery Storage Capacity</div>\n            <div id=\"sol-res-batt-kwh\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;\">19.0 kWh</div>\n            <div id=\"sol-res-batt-ah\" style=\"font-size: 0.85rem; color: var(--text-muted);\">396 Ah @ 48V (90% Usable DoD)</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">30% Clean Energy Tax Credit</div>\n            <div id=\"sol-res-tax-credit\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;\">$7,866</div>\n            <div id=\"sol-res-net-cost\" style=\"font-size: 0.85rem; color: var(--text-muted);\">Net Cost: $18,354 (Gross: $26,220)</div>\n          </div>\n\n          <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #6366f1;\">\n            <div style=\"font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;\">Estimated Payback Horizon</div>\n            <div id=\"sol-res-payback\" style=\"font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #6366f1; margin-bottom: 0.2rem;\">8.3 Years</div>\n            <div id=\"sol-res-annual-savings\" style=\"font-size: 0.85rem; color: var(--text-muted);\">Saves $2,220 / year in electric bills</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- INTERACTIVE GENERATION & LOAD PROFILE SVG -->\n      <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);\">\n          ☀️ 24-Hour Solar Production vs. Household Demand Profile\n        </h2>\n        <p style=\"font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;\">\n          Compares midday solar generation curve (gold) against typical residential dual-peak energy consumption (blue). Shows battery charging during solar surplus and evening battery discharge.\n        </p>\n\n        <div style=\"overflow-x: auto;\">\n          <svg id=\"sol-curve-svg\" viewBox=\"0 0 800 240\" style=\"width: 100%; height: auto; min-width: 600px; font-family: var(--mono);\"></svg>\n        </div>\n      </div>\n\n      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->\n      <div style=\"background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;\">\n        <h3 style=\"font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;\">\n          📐 Step-by-Step Photovoltaic &amp; Storage Derivations\n        </h3>\n        <div id=\"sol-derivation-box\" style=\"font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);\">\n          Calculating renewable energy metrics...\n        </div>\n      </div>\n\n      <!-- ONE-CLICK COPY BUTTON -->\n      <div style=\"margin-bottom: 2.5rem;\">\n        <button type=\"button\" id=\"sol-copy-btn\" onclick=\"copySolarReport(this)\" class=\"btn btn-copy\" style=\"display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;\">\n          <span>📋</span> Copy Solar PV &amp; Storage System Takeoff\n        </button>\n      </div>\n\n      <!-- 5 FATAL TRAPS -->\n      <div style=\"margin: 2.5rem 0;\">\n        <h2 style=\"font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);\">\n          ⚠️ 5 Fatal Traps &amp; Costly Mistakes in Residential Solar\n        </h2>\n        <div style=\"display: grid; grid-template-columns: 1fr; gap: 1rem;\">\n          <div class=\"trap-card\" style=\"border-left: 4px solid #ef4444;\">\n            <strong style=\"color: #ef4444;\">1. Sizing PV Arrays on Summer Generation Averages (Winter Deficit)</strong>\n            Solar installers frequently size systems using annual average peak sun hours. However, in winter months (November to January), solar irradiance drops by 45% to 65% due to lower solar zenith angles and shorter daylight hours. Sizing an off-grid or hybrid system without accounting for winter insolation leaves batteries drained and requires extensive reliance on backup generators.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #f59e0b;\">\n            <strong style=\"color: #f59e0b;\">2. Inverter DC-to-AC Ratio Oversizing &amp; Midday Clipping</strong>\n            A DC-to-AC ratio of 1.15 to 1.25 is standard to maximize early morning and late afternoon production. However, pairing a 12 kW DC array with a 7.6 kW AC inverter causes massive \"clipping\" during the peak 4 hours of midday production. Up to 15% of annual harvestable clean energy is permanently discarded as unabsorbed heat.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #10b981;\">\n            <strong style=\"color: #10b981;\">3. Depth-of-Discharge (DoD) Usable Capacity Confusion</strong>\n            Homeowners often purchase battery banks based on \"nameplate kWh\" without checking usable capacity. Lead-acid and AGM batteries cannot exceed 50% Depth of Discharge without irreversible lead plate sulfation and cycle life collapse. A 20 kWh lead-acid bank delivers only 10 kWh of usable power. Modern Lithium Iron Phosphate (LiFePO4) batteries support 90% DoD, delivering 18 kWh of usable power from a 20 kWh pack.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #3b82f6;\">\n            <strong style=\"color: #3b82f6;\">4. Net Metering 3.0 (NEM 3.0) Export Compensation Collapse</strong>\n            In states that have transitioned from 1:1 retail net metering to NEM 3.0 avoided-cost tariffs, exporting excess daytime power to the grid earns as little as $0.06/kWh, while pulling grid power during peak evening hours costs $0.35 to $0.55/kWh. Without an on-site battery to capture daytime solar for evening self-consumption, the financial payback period balloons from 7 years to over 15 years.\n          </div>\n          <div class=\"trap-card\" style=\"border-left: 4px solid #8b5cf6;\">\n            <strong style=\"color: #8b5cf6;\">5. Panel Temperature Coefficient Power Losses</strong>\n            Solar panels are rated at Standard Test Conditions (STC) of 25°C (77°F). In peak summer heat, dark rooftop solar panels easily reach 65°C (149°F). With a typical silicon temperature coefficient of -0.38% per °C, the panels lose roughly 15.2% of their rated wattage specifically during the hottest summer days when air conditioning demand is at its peak.\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <script>\n      function syncBillToKwh() {\n        var bill = parseFloat(document.getElementById('sol-bill').value) || 185;\n        var rate = parseFloat(document.getElementById('sol-rate').value) || 0.18;\n        if (rate > 0) {\n          var kwh = Math.round(bill / rate);\n          document.getElementById('sol-kwh').value = kwh;\n        }\n        calcSolar();\n      }\n\n      function calcSolar() {\n        var kwhMonth = parseFloat(document.getElementById('sol-kwh').value) || 1000;\n        var rate = parseFloat(document.getElementById('sol-rate').value) || 0.18;\n        var psh = parseFloat(document.getElementById('sol-psh').value) || 4.4;\n        var panelW = parseFloat(document.getElementById('sol-panel-w').value) || 400;\n        var autonomyDays = parseFloat(document.getElementById('sol-autonomy').value) || 1.0;\n        var battType = document.getElementById('sol-batt-type').value;\n        var costPerW = parseFloat(document.getElementById('sol-cost-w').value) || 2.85;\n\n        // Daily energy requirement\n        var kwhDaily = kwhMonth / 30.416; // average days per month\n\n        // System efficiency derating factor (default 86% = 14% losses from dust, wiring, inversion)\n        var derateFactor = 0.86;\n\n        // Array size in kW DC: daily kWh / (PSh * derateFactor)\n        var arrayKw = kwhDaily / (psh * derateFactor);\n        var arrayWatts = arrayKw * 1000;\n\n        // Number of panels\n        var numPanels = Math.ceil(arrayWatts / panelW);\n        var actualArrayKw = (numPanels * panelW) / 1000;\n\n        // Battery capacity sizing\n        var dod = 0.90;\n        var bankVoltage = 48;\n        if (battType === 'lifepo4_48') { dod = 0.90; bankVoltage = 48; }\n        else if (battType === 'lifepo4_24') { dod = 0.90; bankVoltage = 24; }\n        else if (battType === 'agm_48') { dod = 0.50; bankVoltage = 48; }\n        else if (battType === 'agm_12') { dod = 0.50; bankVoltage = 12; }\n\n        var battKwh = 0;\n        var battAh = 0;\n        if (autonomyDays > 0) {\n          // Assume critical load is 50% of total daily consumption for multi-day autonomy\n          var criticalDailyKwh = kwhDaily * (autonomyDays > 0.5 ? 0.50 : 0.40);\n          var requiredUsableKwh = criticalDailyKwh * autonomyDays;\n          battKwh = requiredUsableKwh / dod;\n          battAh = (battKwh * 1000) / bankVoltage;\n        }\n\n        // Financials\n        var grossCost = actualArrayKw * 1000 * costPerW;\n        var taxCredit = grossCost * 0.30;\n        var netCost = grossCost - taxCredit;\n\n        var annualBillSavings = kwhMonth * 12 * rate;\n        var paybackYears = annualBillSavings > 0 ? (netCost / annualBillSavings) : 0;\n\n        // Update KPIs\n        document.getElementById('sol-res-kw').textContent = actualArrayKw.toFixed(1) + ' kW DC';\n        document.getElementById('sol-res-panels').textContent = numPanels + ' Panels @ ' + panelW + 'W (~' + (numPanels * 18) + ' sq ft)';\n\n        if (autonomyDays > 0) {\n          document.getElementById('sol-res-batt-kwh').textContent = battKwh.toFixed(1) + ' kWh';\n          document.getElementById('sol-res-batt-ah').textContent = Math.round(battAh) + ' Ah @ ' + bankVoltage + 'V (' + Math.round(dod*100) + '% DoD)';\n        } else {\n          document.getElementById('sol-res-batt-kwh').textContent = 'Grid-Tied';\n          document.getElementById('sol-res-batt-ah').textContent = 'No Battery Backup Configured';\n        }\n\n        document.getElementById('sol-res-tax-credit').textContent = '$' + Math.round(taxCredit).toLocaleString();\n        document.getElementById('sol-res-net-cost').textContent = 'Net Cost: $' + Math.round(netCost).toLocaleString() + ' (Gross: $' + Math.round(grossCost).toLocaleString() + ')';\n\n        document.getElementById('sol-res-payback').textContent = paybackYears.toFixed(1) + ' Years';\n        document.getElementById('sol-res-annual-savings').textContent = 'Saves $' + Math.round(annualBillSavings).toLocaleString() + ' / year in electric bills';\n\n        // Derivation Box\n        var dBox = document.getElementById('sol-derivation-box');\n        dBox.innerHTML = '<strong>1. Daily Electric Demand:</strong> ' + kwhMonth + ' kWh / 30.4 days = <strong>' + kwhDaily.toFixed(1) + ' kWh/day</strong>.<br>' +\n          '<strong>2. Photovoltaic Array Sizing:</strong> ' + kwhDaily.toFixed(1) + ' kWh ÷ (' + psh + ' PSh × 0.86 efficiency) = <strong>' + arrayKw.toFixed(2) + ' kW DC</strong>.<br>' +\n          '<strong>3. Module Hardware Count:</strong> ' + Math.round(arrayWatts).toLocaleString() + ' W ÷ ' + panelW + 'W per module = <strong>' + numPanels + ' Panels (' + actualArrayKw.toFixed(2) + ' kW actual)</strong>.<br>' +\n          (autonomyDays > 0 ? '<strong>4. Battery Storage Capacity:</strong> (' + (kwhDaily * 0.5).toFixed(1) + ' kWh critical load × ' + autonomyDays + ' days) ÷ ' + Math.round(dod*100) + '% DoD = <strong>' + battKwh.toFixed(1) + ' kWh (' + Math.round(battAh) + ' Ah @ ' + bankVoltage + 'V)</strong>.<br>' : '<strong>4. Storage Configuration:</strong> Grid-tied net-metered system without dedicated battery storage.<br>') +\n          '<strong>5. Federal Incentive Economics:</strong> Gross Cost ($' + Math.round(grossCost).toLocaleString() + ') - 30% Tax Credit ($' + Math.round(taxCredit).toLocaleString() + ') = <strong>$' + Math.round(netCost).toLocaleString() + ' Net</strong> (Payback in ' + paybackYears.toFixed(1) + ' years).';\n\n        // Render Generation Curve SVG\n        renderSolarCurveSvg(actualArrayKw);\n      }\n\n      function renderSolarCurveSvg(arrayKw) {\n        var svg = document.getElementById('sol-curve-svg');\n        if (!svg) return;\n\n        var w = 800, h = 240;\n        var padL = 60, padR = 40, padT = 30, padB = 40;\n        var plotW = w - padL - padR;\n        var plotH = h - padT - padB;\n\n        var svgHtml = '';\n\n        // Axes\n        svgHtml += '<line x1=\"' + padL + '\" y1=\"' + (padT + plotH) + '\" x2=\"' + (padL + plotW) + '\" y2=\"' + (padT + plotH) + '\" stroke=\"var(--border)\" stroke-width=\"2\" />';\n        svgHtml += '<line x1=\"' + padL + '\" y1=\"' + padT + '\" x2=\"' + padL + '\" y2=\"' + (padT + plotH) + '\" stroke=\"var(--border)\" stroke-width=\"2\" />';\n\n        // Household demand curve (dual peak: 7 AM and 7 PM)\n        var demandPts = [];\n        var solarPts = [];\n        for (var hr = 0; hr <= 24; hr += 0.5) {\n          var px = padL + (hr / 24) * plotW;\n\n          // Household base load 1.2kW + morning peak 2.5kW + evening peak 3.8kW\n          var d1 = Math.exp(-Math.pow(hr - 7.5, 2) / 4);\n          var d2 = Math.exp(-Math.pow(hr - 19.5, 2) / 6);\n          var demandVal = 1.0 + (1.8 * d1) + (2.8 * d2); // kW\n          var pyDemand = (padT + plotH) - (demandVal / (arrayKw * 0.9 + 2)) * plotH;\n          demandPts.push(px.toFixed(1) + ',' + pyDemand.toFixed(1));\n\n          // Solar curve (bell curve centered at 12:30 PM, sun between 6 AM and 6 PM)\n          var solarVal = 0;\n          if (hr >= 6 && hr <= 18) {\n            solarVal = (arrayKw * 0.85) * Math.sin(((hr - 6) / 12) * Math.PI);\n          }\n          var pySolar = (padT + plotH) - (solarVal / (arrayKw * 0.9 + 2)) * plotH;\n          solarPts.push(px.toFixed(1) + ',' + pySolar.toFixed(1));\n        }\n\n        // Solar Area (Gold)\n        var solarArea = 'M ' + (padL + (6/24)*plotW) + ' ' + (padT + plotH) + ' ' +\n          'L ' + solarPts.slice(12, 37).join(' L ') + ' ' +\n          'L ' + (padL + (18/24)*plotW) + ' ' + (padT + plotH) + ' Z';\n        svgHtml += '<path d=\"' + solarArea + '\" fill=\"rgba(245, 158, 11, 0.25)\" stroke=\"#f59e0b\" stroke-width=\"2.5\" />';\n\n        // Household Demand Line (Blue)\n        svgHtml += '<path d=\"M ' + demandPts.join(' L ') + '\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"2.5\" stroke-dasharray=\"4,3\" />';\n\n        // Labels\n        svgHtml += '<text x=\"' + (padL + (12/24)*plotW) + '\" y=\"' + (padT + 15) + '\" fill=\"#f59e0b\" font-size=\"12\" font-weight=\"bold\" text-anchor=\"middle\">☀️ Peak Solar Generation (' + arrayKw.toFixed(1) + ' kW)</text>';\n        svgHtml += '<text x=\"' + (padL + (19.5/24)*plotW) + '\" y=\"' + (padT + 50) + '\" fill=\"#3b82f6\" font-size=\"11\" font-weight=\"bold\" text-anchor=\"middle\">Evening Household Peak 🌙</text>';\n\n        // X Axis Ticks (Midnight, 6 AM, Noon, 6 PM, Midnight)\n        var hours = [0, 6, 12, 18, 24];\n        var hLabels = ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'];\n        hours.forEach(function(hVal, idx) {\n          var hx = padL + (hVal / 24) * plotW;\n          svgHtml += '<line x1=\"' + hx + '\" y1=\"' + (padT + plotH) + '\" x2=\"' + hx + '\" y2=\"' + (padT + plotH + 6) + '\" stroke=\"var(--border)\" stroke-width=\"1.5\" />';\n          svgHtml += '<text x=\"' + hx + '\" y=\"' + (padT + plotH + 20) + '\" fill=\"var(--text-muted)\" font-size=\"11\" text-anchor=\"middle\">' + hLabels[idx] + '</text>';\n        });\n\n        svg.innerHTML = svgHtml;\n      }\n\n      function copySolarReport(btn) {\n        var kw = document.getElementById('sol-res-kw').textContent;\n        var panels = document.getElementById('sol-res-panels').textContent;\n        var batt = document.getElementById('sol-res-batt-kwh').textContent;\n        var tax = document.getElementById('sol-res-tax-credit').textContent;\n        var net = document.getElementById('sol-res-net-cost').textContent;\n        var payback = document.getElementById('sol-res-payback').textContent;\n\n        var text = '☀️ RESIDENTIAL SOLAR & BATTERY STORAGE TAKEOFF\\n' +\n          '====================================================\\n' +\n          '• Solar PV Array Size: ' + kw + ' (' + panels + ')\\n' +\n          '• Battery Storage Bank: ' + batt + '\\n' +\n          '• 30% Federal Clean Energy Tax Credit: ' + tax + '\\n' +\n          '• Total ' + net + '\\n' +\n          '• Estimated Payback Horizon: ' + payback + '\\n' +\n          '----------------------------------------------------\\n' +\n          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/solar-calculator';\n\n        navigator.clipboard.writeText(text).then(function() {\n          if (btn) {\n            var orig = btn.innerHTML;\n            btn.innerHTML = '<span>✓</span> Solar Takeoff Copied!';\n            btn.style.borderColor = '#10b981';\n            btn.style.color = '#10b981';\n            setTimeout(function() {\n              btn.innerHTML = orig;\n              btn.style.borderColor = 'var(--border)';\n              btn.style.color = 'var(--fg)';\n            }, 2000);\n          }\n        });\n      }\n\n      if (document.readyState === 'loading') {\n        document.addEventListener('DOMContentLoaded', calcSolar);\n      } else {\n        calcSolar();\n      }\n    </script>\n  ";

  writeFileSync(join(calcDir, 'solar-calculator.html'), renderTradePage({
    title: "Solar Panel & Battery Storage Sizing Calculator (kW Array, Battery Ah & 30% Tax Credit) | Digital Tools Shed",
    metaDesc: "Calculate solar panel system size (kW), number of 400W panels, daily kWh generation, battery storage capacity (kWh / Ah), 30% Federal Clean Energy Tax Credit savings, and payback horizon.",
    canonical: `${DOMAIN}/calc/solar-calculator`,
    bodyContent: solarBody,
    currentPath: '/calc/solar-calculator',
    faq: [
  {
    "q": "How many solar panels are needed for an average home?",
    "a": "An average American home consumes approximately 900 kWh per month (30 kWh/day). In a moderate solar region with 4.5 peak sun hours per day, this requires an 8.5 kW to 9.5 kW solar array, which equates to roughly 21 to 24 standard 400-Watt monocrystalline panels covering approximately 400 to 450 square feet of roof space."
  },
  {
    "q": "What is a \"Peak Sun Hour\" (PSh) in solar engineering?",
    "a": "A Peak Sun Hour is not simply an hour of daylight; it is defined as an hour where solar irradiance averages 1,000 Watts per square meter (1 kW/m²). For example, a location receiving 5.0 Peak Sun Hours receives 5.0 kilowatt-hours of solar energy per square meter across the entire day."
  },
  {
    "q": "How does the 30% Federal Clean Energy Tax Credit (Section 25D) work?",
    "a": "Under the federal Inflation Reduction Act, homeowners who purchase and install residential solar PV systems and battery storage (minimum 3 kWh capacity) are eligible for a nonrefundable 30% federal tax credit applied directly against their federal income tax liability. On a $25,000 turnkey installation, the tax credit saves $7,500, reducing net cost to $17,500."
  },
  {
    "q": "What is Depth of Discharge (DoD) and why does battery chemistry matter?",
    "a": "Depth of Discharge is the percentage of a battery’s capacity that can be safely discharged without damaging cell longevity. Traditional Lead-Acid (AGM/Gel) batteries have a safe DoD of only 50%; discharging beyond 50% causes rapid plate sulfation and cell failure. By contrast, Lithium Iron Phosphate (LiFePO4) batteries safely support 85% to 95% DoD over 4,000+ deep cycles."
  },
  {
    "q": "How does Net Metering 3.0 (NEM 3.0) impact solar return on investment?",
    "a": "Under older 1:1 retail net metering (NEM 1.0 and 2.0), the utility credited excess daytime solar at the full retail electricity rate (~$0.30/kWh). Under NEM 3.0 (adopted in California and spreading nationwide), export compensation was slashed by ~75% to wholesale avoided-cost rates (~$0.06 to $0.08/kWh). This makes pairing solar with battery storage essential to store daytime energy for evening self-consumption."
  }
]
  }));

  
  // ─────────────────────────────────────────────────────────────────────────────
  // 20. DEW POINT & PSYCHROMETRIC RELATIVE HUMIDITY CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const dewPointBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Dew Point Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Psychrometric Science</span>
          <span class="badge badge-green">Magnus-Tetens Formula</span>
          <span class="badge badge-blue">ASHRAE 55 Comfort Envelope</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Dew Point &amp; Psychrometric Humidity Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Compute exact dew point temperature, wet-bulb temperature, vapor pressure, absolute humidity, and human comfort indices from dry-bulb air temperature and relative humidity. Includes industrial coating condensation threshold and mold incubation diagnostics.
        </p>
      </header>

      <!-- MAIN INPUT BOX -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Dry-Bulb Air Temperature:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="dp-temp" value="75" step="0.5" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcDewPoint()" />
              <select id="dp-temp-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcDewPoint()">
                <option value="F" selected>°F</option>
                <option value="C">°C</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Relative Humidity (% RH):</label>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="range" id="dp-rh-slider" min="5" max="100" value="60" step="1" style="flex: 1; cursor: pointer;" oninput="syncRhSlider(this.value)" />
              <input type="number" id="dp-rh" value="60" min="1" max="100" step="1" style="width: 70px; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem; text-align: center;" oninput="syncRhInput(this.value)" />
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Surface Temperature (Optional):</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="dp-surf-temp" value="62" step="0.5" placeholder="e.g. wall/substrate" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcDewPoint()" />
              <span id="dp-surf-unit-lbl" style="width: 40%; display: flex; align-items: center; justify-content: center; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">°F</span>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Barometric Pressure:</label>
            <select id="dp-pressure" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcDewPoint()">
              <option value="1013.25" selected>Standard Sea Level (1013.25 hPa / 29.92 inHg)</option>
              <option value="977.0">Denver / 1,000m Elevation (977 hPa)</option>
              <option value="898.0">High Altitude / 2,000m Elevation (898 hPa)</option>
              <option value="1025.0">High Pressure Winter Anticyclone (1025 hPa)</option>
            </select>
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Dew Point Temperature</div>
            <div id="dp-res-dp" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">60.3°F</div>
            <div id="dp-res-dp-alt" style="font-size: 0.85rem; color: var(--text-muted);">15.7°C (Magnus-Tetens)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Wet-Bulb Temperature</div>
            <div id="dp-res-wb" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">65.4°F</div>
            <div id="dp-res-wb-alt" style="font-size: 0.85rem; color: var(--text-muted);">18.6°C (Stull Thermodynamic Eq)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Human Comfort Level</div>
            <div id="dp-res-comfort" style="font-family: var(--mono); font-size: 1.4rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;">Moderately Humid</div>
            <div id="dp-res-comfort-sub" style="font-size: 0.85rem; color: var(--text-muted);">Comfortable for most people</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #6366f1;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Condensation &amp; Mold Status</div>
            <div id="dp-res-cond-status" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: #6366f1; margin-bottom: 0.2rem;">Safe (+1.7°F Margin)</div>
            <div id="dp-res-cond-sub" style="font-size: 0.85rem; color: var(--text-muted);">No surface condensation</div>
          </div>
        </div>

        <!-- MOISTURE METRICS STRIP -->
        <div style="margin-top: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-family: var(--mono); font-size: 0.85rem;">
          <div>Vapor Pressure (Pv): <strong id="dp-res-pv" style="color: var(--fg);">1.79 kPa</strong></div>
          <div>Sat. Vapor Pressure (Pws): <strong id="dp-res-pws" style="color: var(--fg);">2.98 kPa</strong></div>
          <div>Absolute Humidity: <strong id="dp-res-ah" style="color: #3b82f6;">13.3 g/m³</strong></div>
          <div>Humidity Ratio: <strong id="dp-res-hr" style="color: var(--fg);">0.0112 kg/kg</strong></div>
        </div>
      </div>

      <!-- INTERACTIVE PSYCHROMETRIC CHART SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);">
          📊 Interactive Psychrometric State &amp; Condensation Envelope
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Plots Dry-Bulb Temperature against Moisture Density. Displays the 100% Relative Humidity Saturation Curve (blue boundary), ASHRAE 55 Human Thermal Comfort Zone (green zone), and the current atmospheric state dot with projection to the Dew Point.
        </p>

        <div style="overflow-x: auto;">
          <svg id="dp-psychro-svg" viewBox="0 0 800 280" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step Psychrometric Derivations
        </h3>
        <div id="dp-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating psychrometric thermodynamic properties...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="dp-copy-btn" onclick="copyDewPointReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Psychrometric &amp; Dew Point Diagnostic
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Engineering Pitfalls in Dew Point &amp; Psychrometrics
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The Industrial Coating &amp; Epoxy Blistering Trap (The 5°F Rule)</strong>
            Applying epoxy floor coatings, marine enamels, or structural paints when the steel or concrete substrate temperature is within 5°F (2.8°C) of the ambient dew point guarantees coating failure. Microscopic, invisible moisture droplets condense onto the substrate ahead of the roller, causing pinhole blistering, flash rusting, and inter-coat delamination. ISO 8502-4 mandates a minimum 3°C (5°F) buffer above dew point.
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Mold Germination at 70% Surface RH (The "No Liquid Water Needed" Fallacy)</strong>
            Homeowners assume toxic mold (Stachybotrys, Aspergillus) requires visible pooling liquid condensation to grow. In reality, mold spores germinate and flourish whenever the localized relative humidity at a wall or ceiling surface reaches 70% to 80% for 48 consecutive hours, even if ambient room RH is a comfortable 50%. Cold structural corners drop surface temperature, locally spiking surface RH into the mold bloom zone.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. The Psychrometer Evaporative Stagnation Error</strong>
            Using a sling psychrometer or wet-bulb wick sensor without adequate air velocity results in severe temperature over-reading. If airflow across the wetted wick is less than 3 to 5 meters per second (10 ft/s), an insulating micro-layer of saturated vapor stagnates around the bulb, halting evaporative cooling. Always maintain high airflow or use calibrated digital hygrometers.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. The Winter Heating Indoor Relative Humidity Collapse</strong>
            Taking outdoor air at 25°F (-4°C) with 80% RH and heating it to 72°F (22°C) inside a building causes indoor relative humidity to violently collapse to under 18% RH. Because warm air has exponentially higher saturation capacity, heating cold outdoor air without humidification parches human mucous membranes, generates static electricity, and warps hardwood floors.
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Vented Crawlspace Summer Condensation Inversion</strong>
            Traditional building codes prescribed ventilating crawlspaces with outdoor summer air. However, when 90°F outdoor air with a 75°F dew point enters a cool, unconditioned 65°F earth-contact crawlspace, the air is cooled below its dew point. Gallons of liquid water condense onto wooden floor joists and fiberglass batt insulation, rotting subfloors from underneath. Modern building science requires sealed, conditioned crawlspaces.
          </div>
        </div>
      </div>
    </div>

    <script>
      function syncRhSlider(val) {
        document.getElementById('dp-rh').value = val;
        calcDewPoint();
      }

      function syncRhInput(val) {
        var n = parseFloat(val);
        if (!isNaN(n)) {
          document.getElementById('dp-rh-slider').value = Math.min(100, Math.max(5, n));
        }
        calcDewPoint();
      }

      function calcDewPoint() {
        var tRaw = parseFloat(document.getElementById('dp-temp').value) || 75;
        var tUnit = document.getElementById('dp-temp-unit').value;
        var rh = parseFloat(document.getElementById('dp-rh').value) || 60;
        var surfRaw = parseFloat(document.getElementById('dp-surf-temp').value);
        var pressureHpa = parseFloat(document.getElementById('dp-pressure').value) || 1013.25;

        document.getElementById('dp-surf-unit-lbl').textContent = '°' + tUnit;

        // Convert dry bulb to Celsius
        var tc = tUnit === 'F' ? (tRaw - 32) * (5/9) : tRaw;
        var tf = tUnit === 'F' ? tRaw : (tRaw * 9/5) + 32;

        // Magnus-Tetens Coefficients
        var a = 17.27;
        var b = 237.7; // °C

        var alpha = (a * tc) / (b + tc) + Math.log(rh / 100);
        var tDewC = (b * alpha) / (a - alpha);
        var tDewF = (tDewC * 9/5) + 32;

        // Wet-Bulb Temperature (Stull Equation for Celsius)
        // Tw = T * atan(0.151977 * (rh + 8.313659)^0.5) + atan(T + rh) - atan(rh - 1.676331) + 0.00391838 * rh^1.5 * atan(0.023101 * rh) - 4.686035
        var twC = tc * Math.atan(0.151977 * Math.pow(rh + 8.313659, 0.5)) +
                  Math.atan(tc + rh) -
                  Math.atan(rh - 1.676331) +
                  0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) - 4.686035;
        var twF = (twC * 9/5) + 32;

        // Vapor Pressures (Tetens formula in kPa)
        var pws = 0.61078 * Math.exp((17.27 * tc) / (tc + 237.3)); // saturation
        var pv = pws * (rh / 100); // actual

        // Absolute Humidity (g/m3): AH = 216.7 * (Pv * 10) / (T + 273.15)
        var ah = (2167 * pv) / (tc + 273.15);

        // Humidity Ratio (kg water / kg dry air): W = 0.62198 * Pv / (P - Pv)
        var pKpa = pressureHpa / 10;
        var hr = (0.62198 * pv) / Math.max(0.1, pKpa - pv);

        // Human Comfort Assessment (based on Dew Point °F)
        var comfortText = 'Comfortable';
        var comfortSub = 'Optimal indoor thermal condition';
        var comfortColor = '#10b981';
        if (tDewF < 50) {
          comfortText = 'Dry / Crisp Air';
          comfortSub = 'Low humidity, refreshing; may dry skin';
          comfortColor = '#3b82f6';
        } else if (tDewF >= 50 && tDewF < 55) {
          comfortText = 'Pleasant & Ideal';
          comfortSub = 'Most comfortable thermal range';
          comfortColor = '#10b981';
        } else if (tDewF >= 55 && tDewF < 60) {
          comfortText = 'Comfortable';
          comfortSub = 'Pleasant for most active people';
          comfortColor = '#10b981';
        } else if (tDewF >= 60 && tDewF < 65) {
          comfortText = 'Noticeably Humid';
          comfortSub = 'Sticky feeling begins outdoors';
          comfortColor = '#f59e0b';
        } else if (tDewF >= 65 && tDewF < 70) {
          comfortText = 'Muggy & Uncomfortable';
          comfortSub = 'Oppressive moisture; sweat evaporation slows';
          comfortColor = '#f59e0b';
        } else if (tDewF >= 70 && tDewF < 75) {
          comfortText = 'Very Oppressive';
          comfortSub = 'Severe tropical discomfort; heat hazard';
          comfortColor = '#ef4444';
        } else {
          comfortText = 'Dangerously Humid';
          comfortSub = 'Extreme health risk for exertional heat stroke';
          comfortColor = '#ef4444';
        }

        // Condensation on Surface Check
        var condStatus = 'Surface Temperature Unset';
        var condSub = 'Enter substrate temp to check condensation';
        var condColor = '#6366f1';
        if (!isNaN(surfRaw)) {
          var surfC = tUnit === 'F' ? (surfRaw - 32) * (5/9) : surfRaw;
          var surfF = tUnit === 'F' ? surfRaw : (surfRaw * 9/5) + 32;
          var margin = surfF - tDewF;

          if (margin <= 0) {
            condStatus = '⚠️ ACTIVE CONDENSATION!';
            condSub = 'Surface is ' + Math.abs(margin).toFixed(1) + '°F BELOW dew point (Wet)';
            condColor = '#ef4444';
          } else if (margin < 5.0) {
            condStatus = '⚠️ High Risk (<5°F Buffer)';
            condSub = 'Fails ISO 8502-4 5°F coating buffer';
            condColor = '#f59e0b';
          } else {
            condStatus = '✓ Safe (+' + margin.toFixed(1) + '°F Margin)';
            condSub = 'Substrate is dry & above dew point';
            condColor = '#10b981';
          }
        }

        // Update KPIs
        if (tUnit === 'F') {
          document.getElementById('dp-res-dp').textContent = tDewF.toFixed(1) + '°F';
          document.getElementById('dp-res-dp-alt').textContent = tDewC.toFixed(1) + '°C (Magnus-Tetens)';
          document.getElementById('dp-res-wb').textContent = twF.toFixed(1) + '°F';
          document.getElementById('dp-res-wb-alt').textContent = twC.toFixed(1) + '°C (Stull Thermodynamic)';
        } else {
          document.getElementById('dp-res-dp').textContent = tDewC.toFixed(1) + '°C';
          document.getElementById('dp-res-dp-alt').textContent = tDewF.toFixed(1) + '°F (Magnus-Tetens)';
          document.getElementById('dp-res-wb').textContent = twC.toFixed(1) + '°C';
          document.getElementById('dp-res-wb-alt').textContent = twF.toFixed(1) + '°F (Stull Thermodynamic)';
        }

        var comEl = document.getElementById('dp-res-comfort');
        comEl.textContent = comfortText;
        comEl.style.color = comfortColor;
        document.getElementById('dp-res-comfort-sub').textContent = comfortSub;

        var condEl = document.getElementById('dp-res-cond-status');
        condEl.textContent = condStatus;
        condEl.style.color = condColor;
        document.getElementById('dp-res-cond-sub').textContent = condSub;

        document.getElementById('dp-res-pv').textContent = pv.toFixed(2) + ' kPa (' + (pv * 10).toFixed(1) + ' mbar)';
        document.getElementById('dp-res-pws').textContent = pws.toFixed(2) + ' kPa';
        document.getElementById('dp-res-ah').textContent = ah.toFixed(1) + ' g/m³';
        document.getElementById('dp-res-hr').textContent = hr.toFixed(4) + ' kg/kg';

        // Derivation Box
        var dBox = document.getElementById('dp-derivation-box');
        dBox.innerHTML = '<strong>1. Magnus-Tetens α Parameter:</strong> α = (17.27 × ' + tc.toFixed(1) + '°C) ÷ (237.7 + ' + tc.toFixed(1) + ') + ln(' + rh + ' / 100) = <strong>' + alpha.toFixed(4) + '</strong>.<br>' +
          '<strong>2. Dew Point Solution:</strong> T_dew = (237.7 × ' + alpha.toFixed(4) + ') ÷ (17.27 - ' + alpha.toFixed(4) + ') = <strong>' + tDewC.toFixed(2) + '°C (' + tDewF.toFixed(1) + '°F)</strong>.<br>' +
          '<strong>3. Saturation & Actual Vapor Pressure:</strong> P_ws = 0.61078 × exp((17.27 × ' + tc.toFixed(1) + ') ÷ (' + tc.toFixed(1) + ' + 237.3)) = ' + pws.toFixed(2) + ' kPa | P_v = ' + pws.toFixed(2) + ' × ' + (rh/100).toFixed(2) + ' = <strong>' + pv.toFixed(2) + ' kPa</strong>.<br>' +
          '<strong>4. Absolute Moisture Concentration:</strong> AH = (2,167 × ' + pv.toFixed(2) + ' kPa) ÷ (' + tc.toFixed(1) + ' + 273.15) = <strong>' + ah.toFixed(2) + ' grams of water vapor per m³ of air</strong>.<br>' +
          '<strong>5. Thermodynamic Wet-Bulb:</strong> Stull psychrometric formulation gives evaporative limit <strong>' + twC.toFixed(1) + '°C (' + twF.toFixed(1) + '°F)</strong>.';

        // Render Psychrometric Chart SVG
        renderPsychroSvg(tc, ah, tDewC, rh);
      }

      function renderPsychroSvg(tc, ah, tDewC, rh) {
        var svg = document.getElementById('dp-psychro-svg');
        if (!svg) return;

        var w = 800, h = 280;
        var padL = 60, padR = 40, padT = 30, padB = 40;
        var plotW = w - padL - padR;
        var plotH = h - padT - padB;

        // Range: Temperature 0°C to 45°C, Absolute Humidity 0 to 35 g/m3
        var minT = 0, maxT = 45;
        var minAh = 0, maxAh = 35;

        function getX(t) { return padL + ((t - minT) / (maxT - minT)) * plotW; }
        function getY(a) { return (padT + plotH) - ((a - minAh) / (maxAh - minAh)) * plotH; }

        var svgHtml = '';

        // Axes
        svgHtml += '<line x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (padL + plotW) + '" y2="' + (padT + plotH) + '" stroke="var(--border)" stroke-width="2" />';
        svgHtml += '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + plotH) + '" stroke="var(--border)" stroke-width="2" />';

        // 100% Saturation Curve (Dew Point boundary)
        var satPts = [];
        for (var t = minT; t <= maxT; t += 1) {
          var pws_t = 0.61078 * Math.exp((17.27 * t) / (t + 237.3));
          var ah_sat = (2167 * pws_t) / (t + 273.15);
          satPts.push(getX(t).toFixed(1) + ',' + getY(Math.min(maxAh, ah_sat)).toFixed(1));
        }

        // Saturation area (Condensation Zone)
        var satArea = 'M ' + getX(minT) + ' ' + (padT + plotH) + ' L ' + satPts.join(' L ') + ' L ' + getX(maxT) + ' ' + (padT + plotH) + ' Z';
        svgHtml += '<path d="' + satArea + '" fill="rgba(59, 130, 246, 0.08)" stroke="#3b82f6" stroke-width="2.5" />';

        // ASHRAE 55 Comfort Envelope (Roughly 20°C to 26°C and 4 g/m3 to 12 g/m3)
        var cx1 = getX(20), cx2 = getX(26);
        var cy1 = getY(12), cy2 = getY(4);
        svgHtml += '<rect x="' + cx1 + '" y="' + cy1 + '" width="' + (cx2 - cx1) + '" height="' + (cy2 - cy1) + '" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3" rx="4" />';
        svgHtml += '<text x="' + ((cx1+cx2)/2) + '" y="' + ((cy1+cy2)/2 + 4) + '" fill="#10b981" font-size="10" font-weight="bold" text-anchor="middle">ASHRAE Comfort Zone</text>';

        // Current Operating Point
        var curX = getX(Math.max(minT, Math.min(maxT, tc)));
        var curY = getY(Math.max(minAh, Math.min(maxAh, ah)));

        // Dew Point projection line horizontally to the saturation curve
        var dewX = getX(Math.max(minT, Math.min(maxT, tDewC)));
        svgHtml += '<line x1="' + curX + '" y1="' + curY + '" x2="' + dewX + '" y2="' + curY + '" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4" />';
        svgHtml += '<circle cx="' + dewX + '" cy="' + curY + '" r="5" fill="#3b82f6" />';
        svgHtml += '<text x="' + (dewX - 8) + '" y="' + (curY - 8) + '" fill="#3b82f6" font-size="11" font-weight="bold" text-anchor="end">Dew Point (' + tDewC.toFixed(1) + '°C)</text>';

        // Current air point
        svgHtml += '<circle cx="' + curX + '" cy="' + curY + '" r="6" fill="#ef4444" stroke="#ffffff" stroke-width="2" />';
        svgHtml += '<text x="' + (curX + 10) + '" y="' + (curY + 4) + '" fill="#ef4444" font-size="11" font-weight="bold">Current Air (' + tc.toFixed(1) + '°C, ' + rh + '% RH)</text>';

        // Grid lines & labels
        for (var gt = 0; gt <= 40; gt += 10) {
          var gx = getX(gt);
          svgHtml += '<line x1="' + gx + '" y1="' + (padT + plotH) + '" x2="' + gx + '" y2="' + (padT + plotH + 5) + '" stroke="var(--border)" stroke-width="1.5" />';
          svgHtml += '<text x="' + gx + '" y="' + (padT + plotH + 18) + '" fill="var(--text-muted)" font-size="11" text-anchor="middle">' + gt + '°C</text>';
        }

        // Y-axis labels (AH)
        for (var ga = 0; ga <= 30; ga += 10) {
          var gy = getY(ga);
          svgHtml += '<line x1="' + (padL - 5) + '" y1="' + gy + '" x2="' + padL + '" y2="' + gy + '" stroke="var(--border)" stroke-width="1.5" />';
          svgHtml += '<text x="' + (padL - 8) + '" y="' + (gy + 4) + '" fill="var(--text-muted)" font-size="11" text-anchor="end">' + ga + 'g</text>';
        }

        // Axis Titles
        svgHtml += '<text x="' + (padL + plotW/2) + '" y="' + (h - 6) + '" fill="var(--fg)" font-size="11" font-weight="bold" text-anchor="middle">Dry-Bulb Air Temperature (°C)</text>';
        svgHtml += '<text x="' + (padL + 10) + '" y="' + (padT + 15) + '" fill="#3b82f6" font-size="11" font-weight="bold">100% Saturation Curve (Condensation Limit)</text>';

        svg.innerHTML = svgHtml;
      }

      function copyDewPointReport(btn) {
        var dp = document.getElementById('dp-res-dp').textContent;
        var wb = document.getElementById('dp-res-wb').textContent;
        var com = document.getElementById('dp-res-comfort').textContent;
        var cond = document.getElementById('dp-res-cond-status').textContent;
        var pv = document.getElementById('dp-res-pv').textContent;
        var ah = document.getElementById('dp-res-ah').textContent;

        var text = '🌡️ PSYCHROMETRIC & DEW POINT DIAGNOSTIC REPORT\n' +
          '====================================================\n' +
          '• Dew Point Temperature: ' + dp + '\n' +
          '• Thermodynamic Wet-Bulb: ' + wb + '\n' +
          '• Human Comfort Assessment: ' + com + '\n' +
          '• Surface Condensation Status: ' + cond + '\n' +
          '• Vapor Pressure (Pv): ' + pv + '\n' +
          '• Absolute Humidity: ' + ah + '\n' +
          '----------------------------------------------------\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/dew-point-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Psychrometric Diagnostic Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcDewPoint);
      } else {
        calcDewPoint();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'dew-point-calculator.html'), renderTradePage({
    title: "Dew Point Calculator — Psychrometric Humidity, Wet-Bulb & Condensation | Digital Tools Shed",
    metaDesc: "Calculate accurate dew point temperature, wet-bulb temperature, vapor pressure, absolute humidity, and mold risk with the Magnus-Tetens psychrometric formula.",
    canonical: `${DOMAIN}/calc/dew-point-calculator`,
    bodyContent: dewPointBody,
    currentPath: '/calc/dew-point-calculator',
    faq: [
      {
        "q": "What is the difference between Relative Humidity and Dew Point?",
        "a": "Relative humidity (% RH) is relative to temperature—warm air can hold far more water vapor than cold air, so 60% RH at 90°F contains vastly more moisture than 60% RH at 40°F. Dew point is an absolute measure of atmospheric moisture: it represents the exact temperature to which air must be cooled for water vapor to condense into liquid dew."
      },
      {
        "q": "What dew point temperature feels uncomfortable or humid to humans?",
        "a": "Dew points under 55°F (13°C) feel crisp, dry, and comfortable. Between 55°F and 60°F, air feels pleasant. Between 60°F and 65°F, it starts feeling sticky. Above 65°F (18°C), air feels muggy and oppressive because sweat cannot evaporate easily. Dew points above 70°F (21°C) feel stifling and represent tropical heat stress."
      },
      {
        "q": "How does the Magnus-Tetens formula calculate dew point?",
        "a": "The Magnus-Tetens approximation computes dew point using saturation vapor pressure curves: α(T, RH) = (a·T)/(b + T) + ln(RH/100), then T_dew = (b·α)/(a - α), where a = 17.27 and b = 237.7°C. It is accurate to within 0.4°C across standard atmospheric temperatures between -40°C and 50°C."
      },
      {
        "q": "What is the 5-degree rule for industrial painting and epoxy application?",
        "a": "Per international standard ISO 8502-4 and SSPC guidelines, coating applicators must verify that the surface substrate temperature is at least 5°F (3°C) higher than the ambient dew point before applying paint, epoxy, or polyurea. If surface temperature touches the dew point, microscopic condensation creates adhesion failure and blistering."
      },
      {
        "q": "Can mold grow if room relative humidity is 50%?",
        "a": "Yes. While central room air may measure 50% RH, exterior walls, cold corners, and uninsulated window headers have colder surface temperatures. Because cold air holds less moisture, the localized relative humidity right against that cold surface can exceed 70% to 80%, triggering active mold spore germination without visible standing water."
      }
    ]
  }));



  // ─────────────────────────────────────────────────────────────────────────────
  // 21. CONCRETE FOOTING, SONOTUBE & PIER CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const footingBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Concrete Footing Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Structural Engineering</span>
          <span class="badge badge-green">IRC DCA6 Compliant</span>
          <span class="badge badge-blue">Bell Base &amp; Rebar Takeoff</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Concrete Footing, Sonotube &amp; Pier Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate concrete volume (cubic yards and feet), exact pre-mix bag counts (80lb, 60lb, 50lb), bell/flared footing pads, #4/#5 rebar linear feet, and crushed stone drainage gravel for deck piers, post holes, and foundation columns.
        </p>
      </header>

      <!-- MAIN INPUT BOX -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Sonotube Pier Diameter:</label>
            <select id="ftg-dia" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcFooting()">
              <option value="8">8" (Light Post / Deck Pier — 0.35 cu ft/ft)</option>
              <option value="10">10" (Standard Residential Deck Pier — 0.55 cu ft/ft)</option>
              <option value="12" selected>12" (Heavy Deck / Structural Column — 0.79 cu ft/ft)</option>
              <option value="14">14" (Commercial / High Snow Load — 1.07 cu ft/ft)</option>
              <option value="16">16" (Heavy Pergola / Heavy Timber Post — 1.40 cu ft/ft)</option>
              <option value="18">18" (Commercial Grade Pier — 1.77 cu ft/ft)</option>
              <option value="24">24" (Foundation Grade Caisson — 3.14 cu ft/ft)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Pier Depth / Hole Depth (Inches):</label>
            <input type="number" id="ftg-depth" value="42" min="12" max="144" step="6" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcFooting()" />
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">Must extend below local regional frost line</span>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Number of Piers / Holes:</label>
            <input type="number" id="ftg-count" value="6" min="1" max="200" step="1" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcFooting()" />
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Flared Bell Footing Base:</label>
            <select id="ftg-bell" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcFooting()">
              <option value="none">Straight Pier (No Bell Footing)</option>
              <option value="bell_20" selected>BigFoot / Flared Bell Base (20" Base × 10" H)</option>
              <option value="bell_24">BigFoot / Flared Bell Base (24" Base × 12" H)</option>
              <option value="bell_30">BigFoot Heavy Duty (30" Base × 14" H)</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Waste &amp; Over-Excavation Factor:</label>
            <select id="ftg-waste" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcFooting()">
              <option value="5">5% (Exact Sonotube Cardboard Sleeves)</option>
              <option value="10" selected>10% (Standard Waste Allowance)</option>
              <option value="15">15% (Rough Dug Dirt Holes — No Sleeve)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Rebar Reinforcement per Pier:</label>
            <select id="ftg-rebar" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcFooting()">
              <option value="2">2 Vertical Bars (#4 - 1/2")</option>
              <option value="3">3 Vertical Bars with Rings (#4 - 1/2")</option>
              <option value="4" selected>4 Vertical Bars Rebar Cage (#4 - 1/2")</option>
              <option value="0">None (Plain Unreinforced Concrete)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Price per 80lb Bag ($):</label>
            <input type="number" id="ftg-bag-price" value="6.75" min="2" max="25" step="0.25" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcFooting()" />
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Ready-Mix Delivery Price ($/yd³):</label>
            <input type="number" id="ftg-truck-price" value="165" min="100" max="300" step="5" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcFooting()" />
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Total Concrete Volume</div>
            <div id="ftg-res-yds" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">1.16 yd³</div>
            <div id="ftg-res-cuft" style="font-size: 0.85rem; color: var(--text-muted);">31.4 cu ft (0.89 m³)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Standard 80 lb Bags</div>
            <div id="ftg-res-bags80" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">53 Bags</div>
            <div id="ftg-res-bags-cost" style="font-size: 0.85rem; color: var(--text-muted);">Total: $358 (4,240 lbs payload)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Alternative Bag Counts</div>
            <div id="ftg-res-alt-bags" style="font-family: var(--mono); font-size: 1.3rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;">70 (60lb) | 84 (50lb)</div>
            <div id="ftg-res-alt-sub" style="font-size: 0.85rem; color: var(--text-muted);">70 × 60-lb or 84 × 50-lb bags</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #6366f1;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">#4 Rebar Reinforcement</div>
            <div id="ftg-res-rebar" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #6366f1; margin-bottom: 0.2rem;">72 Lin Ft</div>
            <div id="ftg-res-rebar-sub" style="font-size: 0.85rem; color: var(--text-muted);">24 bars @ 36" (48.1 lbs steel)</div>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE CUTAWAY SCHEMATIC SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);">
          🏗️ Architectural Pier &amp; Frost Depth Cross-Section
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Shows structural details: grade line, local frost depth heave boundary, sonotube cylindrical tube, rebar reinforcement cage on 3" bottom chairs, flared bell footing pad, and compacted crushed stone drainage base.
        </p>

        <div style="overflow-x: auto;">
          <svg id="ftg-cross-svg" viewBox="0 0 800 320" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step Structural Footing Derivations
        </h3>
        <div id="ftg-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating volumetric footing parameters...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="ftg-copy-btn" onclick="copyFootingReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Concrete Pier &amp; Footing Material Takeoff
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Structural Foundation Failures in Pier Footings
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. Pouring Above the Regional Frost Line (Frost Heave Destruction)</strong>
            Every municipal building code specifies an exact frost penetration depth (e.g. 36" in the Midwest, 48" to 60" in the Northeast). Digging a 30-inch hole in a 42-inch frost zone guarantees that frozen subsoil ice lenses will grip the bottom of the pier, exerting thousands of pounds of upward frost heave pressure that twists decks, pops doors, and cracks structural ledgers.
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Sonotube Soil Friction Adfreezing (Rough Hole Heaving)</strong>
            Pouring wet concrete directly into an unlined, augered dirt hole creates rough, jagged concrete edges. When surrounding soil freezes in winter, it \"adfreezes\" (bonds solidly) to these rough protrusions and jacks the entire concrete pier out of the earth as the soil expands. Using smooth waxed cardboard Sonotubes or polyethylene sleeves allows freezing soil to slip upward harmlessly around the tube.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Violating the 3-Inch Earth Concrete Clearance Code (Rebar Rot)</strong>
            ACI 318 and IRC Section R404 mandate a minimum 3.0 inches (76 mm) of concrete cover between embedded steel rebar and any concrete poured against bare earth. Pushing rebar down into the dirt at the bottom of the hole exposes bare steel to groundwater. Moisture wicks into the rebar, causing iron oxide oxidation; rusting steel expands up to 600% in volume, exploding the concrete pier from the inside out.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Over-Watering the Mix to Facilitate Pouring Down Tubes</strong>
            Because dumping stiff concrete down a narrow 8-inch or 10-inch tube is tedious, DIYers frequently flood the mix with extra water to make it soup. Adding just 1 extra gallon of water per bag reduces concrete compressive strength from 4,000 PSI down to less than 2,200 PSI, causes aggregate segregation, and leaves porous chalky concrete that disintegrates under winter freeze-thaw cycles.
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Neglecting the Flared Bell Base on Weak Bearing Soils</strong>
            A straight 10-inch cylindrical pier has a bearing area of only 0.54 square feet. On common residential clay/silt soils with 1,500 PSF allowable soil bearing pressure, that pier can support only 810 lbs before settling. Adding a 20-inch flared bell footing pad increases soil bearing surface area to 2.18 sq ft, increasing load capacity to 3,270 lbs per footing and preventing deck settling.
          </div>
        </div>
      </div>
    </div>

    <script>
      function calcFooting() {
        var diaIn = parseFloat(document.getElementById('ftg-dia').value) || 12;
        var depthIn = parseFloat(document.getElementById('ftg-depth').value) || 42;
        var count = parseInt(document.getElementById('ftg-count').value) || 6;
        var bellType = document.getElementById('ftg-bell').value;
        var wastePct = parseFloat(document.getElementById('ftg-waste').value) || 10;
        var rebarBars = parseInt(document.getElementById('ftg-rebar').value) || 4;
        var bagPrice = parseFloat(document.getElementById('ftg-bag-price').value) || 6.75;
        var truckPrice = parseFloat(document.getElementById('ftg-truck-price').value) || 165;

        var wasteMult = 1 + (wastePct / 100);

        // Cylinder volume: V = pi * r^2 * h
        var rFt = (diaIn / 2) / 12;
        var hFt = depthIn / 12;
        var cylVolCuFt = Math.PI * Math.pow(rFt, 2) * hFt;

        // Bell base volume
        var bellVolCuFt = 0;
        var bellBaseDiaIn = diaIn;
        var bellHIn = 0;
        if (bellType === 'bell_20') {
          bellBaseDiaIn = 20; bellHIn = 10;
        } else if (bellType === 'bell_24') {
          bellBaseDiaIn = 24; bellHIn = 12;
        } else if (bellType === 'bell_30') {
          bellBaseDiaIn = 30; bellHIn = 14;
        }

        if (bellHIn > 0) {
          // Truncated cone: V = (pi * h / 3) * (R1^2 + R1*R2 + R2^2)
          var R1 = (bellBaseDiaIn / 2) / 12;
          var R2 = (diaIn / 2) / 12;
          var bellHFt = bellHIn / 12;
          bellVolCuFt = (Math.PI * bellHFt / 3) * (Math.pow(R1, 2) + (R1 * R2) + Math.pow(R2, 2));
        }

        // Single Pier Volume
        var singleCuFtNet = cylVolCuFt + bellVolCuFt;
        var totalCuFtGross = singleCuFtNet * count * wasteMult;
        var totalCuYds = totalCuFtGross / 27;
        var totalCuMeters = totalCuFtGross * 0.0283168;

        // Bag counts
        // 80 lb bag = 0.60 cu ft
        // 60 lb bag = 0.45 cu ft
        // 50 lb bag = 0.375 cu ft
        var bags80 = Math.ceil(totalCuFtGross / 0.60);
        var bags60 = Math.ceil(totalCuFtGross / 0.45);
        var bags50 = Math.ceil(totalCuFtGross / 0.375);

        var totalBagCost = bags80 * bagPrice;
        var truckCost = Math.max(1, totalCuYds) * truckPrice;

        // Rebar calculations (#4 rebar is 0.668 lbs per linear foot)
        var barLenIn = Math.max(12, depthIn - 6 + bellHIn);
        var totalRebarFt = (barLenIn / 12) * rebarBars * count;
        var totalRebarLbs = totalRebarFt * 0.668;

        // Update KPIs
        document.getElementById('ftg-res-yds').textContent = totalCuYds.toFixed(2) + ' yd³';
        document.getElementById('ftg-res-cuft').textContent = totalCuFtGross.toFixed(1) + ' cu ft (' + totalCuMeters.toFixed(2) + ' m³)';

        document.getElementById('ftg-res-bags80').textContent = bags80 + ' Bags';
        document.getElementById('ftg-res-bags-cost').textContent = 'Total:  (15 calculators in /calc/)');
}

 + Math.round(totalBagCost).toLocaleString() + ' (' + (bags80 * 80).toLocaleString() + ' lbs payload)';

        document.getElementById('ftg-res-alt-bags').textContent = bags60 + ' (60lb) | ' + bags50 + ' (50lb)';
        document.getElementById('ftg-res-alt-sub').textContent = bags60 + ' × 60-lb or ' + bags50 + ' × 50-lb bags';

        if (rebarBars > 0) {
          document.getElementById('ftg-res-rebar').textContent = Math.round(totalRebarFt) + ' Lin Ft';
          document.getElementById('ftg-res-rebar-sub').textContent = (rebarBars * count) + ' bars @ ' + barLenIn + '" (' + totalRebarLbs.toFixed(1) + ' lbs steel)';
        } else {
          document.getElementById('ftg-res-rebar').textContent = 'None';
          document.getElementById('ftg-res-rebar-sub').textContent = 'Unreinforced mass concrete';
        }

        // Derivation Box
        var dBox = document.getElementById('ftg-derivation-box');
        dBox.innerHTML = '<strong>1. Pier Shaft Cylinder Volume:</strong> π × (' + rFt.toFixed(2) + ' ft)² × ' + hFt.toFixed(2) + ' ft = <strong>' + cylVolCuFt.toFixed(2) + ' cu ft</strong> per shaft.<br>' +
          (bellHIn > 0 ? '<strong>2. Flared Bell Footing Volume:</strong> Truncated cone (' + bellBaseDiaIn + '" base × ' + bellHIn + '" H) = <strong>' + bellVolCuFt.toFixed(2) + ' cu ft</strong>.<br>' : '<strong>2. Footing Base:</strong> Straight cylindrical shaft without flared bell base.<br>') +
          '<strong>3. Single Pier Volume:</strong> ' + cylVolCuFt.toFixed(2) + (bellHIn > 0 ? ' + ' + bellVolCuFt.toFixed(2) : '') + ' = <strong>' + singleCuFtNet.toFixed(2) + ' cu ft</strong>.<br>' +
          '<strong>4. Aggregate Project Takeoff:</strong> ' + singleCuFtNet.toFixed(2) + ' cu ft × ' + count + ' piers × ' + wasteMult.toFixed(2) + ' waste factor = <strong>' + totalCuFtGross.toFixed(1) + ' cu ft (' + totalCuYds.toFixed(2) + ' cubic yards)</strong>.<br>' +
          '<strong>5. Bagged Pre-Mix Economics:</strong> ' + totalCuFtGross.toFixed(1) + ' cu ft ÷ 0.60 cu ft/bag = <strong>' + bags80 + ' eighty-pound bags</strong> ( (15 calculators in /calc/)');
}

 + Math.round(totalBagCost) + ' vs ~ (15 calculators in /calc/)');
}

 + Math.round(truckCost) + ' ready-mix truck delivery).';

        // Render Cutaway SVG
        renderFootingCutawaySvg(diaIn, depthIn, bellBaseDiaIn, bellHIn, rebarBars);
      }

      function renderFootingCutawaySvg(diaIn, depthIn, bellDiaIn, bellHIn, rebarBars) {
        var svg = document.getElementById('ftg-cross-svg');
        if (!svg) return;

        var w = 800, h = 320;
        var groundY = 70;
        var frostY = 160; // visual frost line

        var pierCenterX = 400;
        var pierW = Math.max(30, diaIn * 4.5);
        var pierH = 170; // visual shaft height

        var bellW = (bellDiaIn / diaIn) * pierW;
        var bellVisualH = bellHIn > 0 ? 40 : 0;

        var svgHtml = '';

        // Ground / Soil background
        svgHtml += '<rect x="60" y="' + groundY + '" width="680" height="220" fill="#78716c" opacity="0.15" />';
        // Ground line
        svgHtml += '<line x1="60" y1="' + groundY + '" x2="740" y2="' + groundY + '" stroke="#a8a29e" stroke-width="3" />';
        svgHtml += '<text x="70" y="' + (groundY - 10) + '" fill="var(--fg)" font-size="12" font-weight="bold">Finished Grade Level (0.0")</text>';

        // Regional Frost Depth Line
        svgHtml += '<line x1="60" y1="' + frostY + '" x2="740" y2="' + frostY + '" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,4" />';
        svgHtml += '<text x="70" y="' + (frostY - 6) + '" fill="#3b82f6" font-size="11" font-weight="bold">Regional Frost Depth Line (' + depthIn + '" Depth Required)</text>';

        // Compacted Gravel Sub-base (4" pad)
        var botY = groundY + pierH + bellVisualH;
        svgHtml += '<rect x="' + (pierCenterX - bellW/2 - 20) + '" y="' + botY + '" width="' + (bellW + 40) + '" height="25" fill="#a8a29e" opacity="0.6" rx="2" />';
        svgHtml += '<text x="' + pierCenterX + '" y="' + (botY + 17) + '" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">Compacted #57 Crushed Stone Base (4" Depth)</text>';

        // Flared Bell Base (if active)
        if (bellVisualH > 0) {
          var bellPath = 'M ' + (pierCenterX - pierW/2) + ' ' + (groundY + pierH) +
                         ' L ' + (pierCenterX + pierW/2) + ' ' + (groundY + pierH) +
                         ' L ' + (pierCenterX + bellW/2) + ' ' + botY +
                         ' L ' + (pierCenterX - bellW/2) + ' ' + botY + ' Z';
          svgHtml += '<path d="' + bellPath + '" fill="#64748b" stroke="#334155" stroke-width="2" />';
        }

        // Sonotube Concrete Pier Shaft
        svgHtml += '<rect x="' + (pierCenterX - pierW/2) + '" y="' + (groundY - 15) + '" width="' + pierW + '" height="' + (pierH + 15) + '" fill="#94a3b8" stroke="#334155" stroke-width="2" rx="2" />';
        svgHtml += '<text x="' + pierCenterX + '" y="' + (groundY + pierH/2) + '" fill="#1e293b" font-size="13" font-weight="bold" text-anchor="middle">' + diaIn + '" Sonotube</text>';

        // Rebar Cage
        if (rebarBars > 0) {
          var rebarInset = pierW * 0.25;
          svgHtml += '<line x1="' + (pierCenterX - pierW/2 + rebarInset) + '" y1="' + (groundY - 5) + '" x2="' + (pierCenterX - pierW/2 + rebarInset) + '" y2="' + (botY - 10) + '" stroke="#ef4444" stroke-width="3" />';
          svgHtml += '<line x1="' + (pierCenterX + pierW/2 - rebarInset) + '" y1="' + (groundY - 5) + '" x2="' + (pierCenterX + pierW/2 - rebarInset) + '" y2="' + (botY - 10) + '" stroke="#ef4444" stroke-width="3" />';
          // Horizontal ties
          for (var ty = groundY + 30; ty < botY - 15; ty += 40) {
            svgHtml += '<line x1="' + (pierCenterX - pierW/2 + rebarInset) + '" y1="' + ty + '" x2="' + (pierCenterX + pierW/2 - rebarInset) + '" y2="' + ty + '" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,2" />';
          }
          svgHtml += '<text x="' + (pierCenterX + pierW/2 + 15) + '" y="' + (groundY + 40) + '" fill="#ef4444" font-size="11" font-weight="bold">#4 Rebar Cage (3" Earth Clearance)</text>';
        }

        // Hardware anchor at top
        svgHtml += '<rect x="' + (pierCenterX - 8) + '" y="' + (groundY - 30) + '" width="16" height="20" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />';
        svgHtml += '<text x="' + (pierCenterX + 16) + '" y="' + (groundY - 18) + '" fill="#f59e0b" font-size="10" font-weight="bold">Galvanized Post Base Anchor</text>';

        svg.innerHTML = svgHtml;
      }

      function copyFootingReport(btn) {
        var yds = document.getElementById('ftg-res-yds').textContent;
        var cuft = document.getElementById('ftg-res-cuft').textContent;
        var b80 = document.getElementById('ftg-res-bags80').textContent;
        var bCost = document.getElementById('ftg-res-bags-cost').textContent;
        var alt = document.getElementById('ftg-res-alt-bags').textContent;
        var rebar = document.getElementById('ftg-res-rebar').textContent;

        var text = '🏗️ CONCRETE FOOTING & SONOTUBE MATERIAL TAKEOFF\n' +
          '====================================================\n' +
          '• Total Concrete Volume: ' + yds + ' (' + cuft + ')\n' +
          '• Standard 80 lb Bags: ' + b80 + ' (' + bCost + ')\n' +
          '• Alternative Bag Sizes: ' + alt + '\n' +
          '• #4 Rebar Reinforcement: ' + rebar + '\n' +
          '• Sub-Base: 4-inch compacted #57 crushed stone\n' +
          '----------------------------------------------------\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/concrete-footing-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Footing Takeoff Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcFooting);
      } else {
        calcFooting();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'concrete-footing-calculator.html'), renderTradePage({
    title: "Concrete Footing & Sonotube Calculator (Volume, 80lb Bags & Rebar) | Digital Tools Shed",
    metaDesc: "Calculate concrete cubic yards, 80lb/60lb/50lb bag counts, BigFoot flared bell bases, and rebar reinforcement for deck piers, sonotubes, and post holes.",
    canonical: `${DOMAIN}/calc/concrete-footing-calculator`,
    bodyContent: footingBody,
    currentPath: '/calc/concrete-footing-calculator',
    faq: [
      {
        "q": "How deep must a deck concrete footing be dug?",
        "a": "Building codes (IRC Section R403.1.4) require concrete footings to extend at least 12 inches below the local regional frost line depth to prevent frost heaving. Depending on geographic latitude, this ranges from 12 inches in Florida to 42-48 inches in the Midwest, and up to 60 inches in the northern United States and Canada."
      },
      {
        "q": "How many 80-pound bags of concrete are needed for a 12-inch Sonotube 4 feet deep?",
        "a": "A 12-inch diameter cylinder 4 feet (48 inches) deep has a net volume of 3.14 cubic feet. At 0.60 cubic feet per 80-pound bag, plus a standard 10% waste and hole over-excavation factor, this requires exactly 6 eighty-pound bags of concrete mix per hole."
      },
      {
        "q": "What is the benefit of a flared bell footing base (such as BigFoot)?",
        "a": "A flared bell base widens the footprint at the bottom of the excavation, spreading vertical column loads across a much larger soil surface area (e.g. 20 inches diameter instead of 10 inches). This increases soil bearing capacity from ~800 lbs to over 3,200 lbs and provides a mechanical anchor that resists upward frost heave uplift."
      },
      {
        "q": "Why is smooth Sonotube cardboard preferred over pouring concrete directly into dirt?",
        "a": "Pouring concrete directly into an unlined augered dirt hole leaves rough concrete edges. During winter, expanding frozen soil adfreezes (bonds) to the rough concrete protrusions and jacks the entire pier out of the ground. Smooth cardboard Sonotubes allow freezing soil to expand and slide upward harmlessly without gripping the pier."
      },
      {
        "q": "When is ordering a ready-mix concrete truck cheaper than buying pre-mix bags?",
        "a": "As a rule of thumb, projects requiring more than 1.5 to 2.0 cubic yards (approximately 70 to 90 eighty-pound bags) are cheaper and significantly faster with a ready-mix truck ($140 to $180/yd³). Hand-mixing 70+ bags takes several hours, risks physical exhaustion, and frequently causes weak cold joints between batches."
      }
    ]
  }));



  // ─────────────────────────────────────────────────────────────────────────────
  // 22. THERMAL CONDUCTIVITY & HEAT LOSS CALCULATOR (FOURIER'S LAW)
  // ─────────────────────────────────────────────────────────────────────────────
  const thermalBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Thermal Conductivity Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Building Science &amp; Thermodynamics</span>
          <span class="badge badge-green">Fourier's Law of Conduction</span>
          <span class="badge badge-blue">R-Value &amp; U-Factor Engine</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Thermal Conductivity &amp; Building Heat Loss Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Compute conductive heat transfer rates (Watts and BTU/hr), composite assembly thermal resistance ($R_{\\text{total}}$), overall heat transfer coefficients ($U$-factor), 24-hour kilowatt-hour losses, and heating fuel costs using Fourier's Law across single materials and multi-layer building envelopes.
        </p>
      </header>

      <!-- MAIN INPUT BOX -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Wall / Envelope Assembly:</label>
            <select id="tc-assembly" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="onTcAssemblyChange()">
              <option value="wall_2x6" selected>Standard 2x6 Insulated Wall (R-20 Effective)</option>
              <option value="wall_2x4">Standard 2x4 Insulated Wall (R-14 Effective)</option>
              <option value="wall_continuous">Continuous Exterior Foam Wall (R-25 High-Perf)</option>
              <option value="brick_cavity">Cavity Brick Veneer Wall (R-19)</option>
              <option value="concrete_8">8" Solid Concrete Foundation Wall (R-1.2 Uninsulated)</option>
              <option value="window_double">Double-Pane Low-E Window (U-0.28 / R-3.6)</option>
              <option value="window_single">Single-Pane Glass Window (U-1.04 / R-0.96)</option>
              <option value="custom">Custom Single Material (Manual k &amp; Thickness)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Surface Area (Square Feet):</label>
            <input type="number" id="tc-area" value="500" min="1" step="25" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcThermal()" />
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Indoor Room Temperature (°F):</label>
            <input type="number" id="tc-tin" value="70" step="1" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcThermal()" />
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Outdoor Winter Temperature (°F):</label>
            <input type="number" id="tc-tout" value="20" step="1" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcThermal()" />
          </div>
        </div>

        <div id="grp-tc-custom" style="display: none; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Thermal Conductivity k [W/(m·K)]:</label>
            <input type="number" id="tc-custom-k" value="0.038" min="0.001" step="0.005" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcThermal()" />
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Material Thickness (Inches):</label>
            <input type="number" id="tc-custom-thick" value="5.5" min="0.1" step="0.25" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcThermal()" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Heating Energy Cost ($ / kWh):</label>
            <input type="number" id="tc-cost-kwh" value="0.18" min="0.05" max="0.60" step="0.01" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcThermal()" />
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Temperature Differential (ΔT):</label>
            <div id="tc-delta-t-display" style="padding: 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem; font-weight: bold; color: #ef4444;">
              50.0°F (27.8°C)
            </div>
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #ef4444;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Heat Loss Rate (Q̇)</div>
            <div id="tc-res-btu" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin-bottom: 0.2rem;">1,250 BTU/hr</div>
            <div id="tc-res-watts" style="font-size: 0.85rem; color: var(--text-muted);">366 Watts continuous loss</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Thermal Resistance (R-Value)</div>
            <div id="tc-res-rval" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">R-20.0</div>
            <div id="tc-res-rsi" style="font-size: 0.85rem; color: var(--text-muted);">RSI 3.52 m²·K/W</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Overall Heat Transfer (U-Factor)</div>
            <div id="tc-res-ufactor" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">U-0.050</div>
            <div id="tc-res-u-metric" style="font-size: 0.85rem; color: var(--text-muted);">0.284 W/(m²·K)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Daily Heating Cost</div>
            <div id="tc-res-cost" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;">$1.58 / day</div>
            <div id="tc-res-kwh-day" style="font-size: 0.85rem; color: var(--text-muted);">8.79 kWh/day (0.30 Therms)</div>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE TEMPERATURE GRADIENT SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);">
          🌡️ Multi-Layer Building Wall Temperature Gradient Profile
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Cross-section showing heat conduction through wall materials (Drywall → Cavity Insulation → OSB Sheathing → Siding). The temperature curve illustrates thermal drop across each layer and identifies the interstitial condensation boundary.
        </p>

        <div style="overflow-x: auto;">
          <svg id="tc-gradient-svg" viewBox="0 0 800 240" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step Thermal Conduction Derivations
        </h3>
        <div id="tc-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating thermal flux metrics...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="tc-copy-btn" onclick="copyThermalReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Thermal Performance &amp; Heat Loss Report
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Costly Errors in Building Thermal Insulation
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. Framing Thermal Bridging ("The R-19 Batt Myth")</strong>
            Homeowners often assume a 2x6 wall insulated with R-19 fiberglass batts provides an R-19 wall. In reality, solid wood studs (R-1.25 per inch) comprise 23% to 27% of total wall area. Heat bypasses the fiberglass and conducts directly through the solid lumber framing studs. This \"thermal bridging\" degrades the effective overall wall performance from R-19 down to only <strong>R-13.8</strong> (a 27% efficiency penalty).
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Inverted Vapor Barrier Placement (Rotting Wall Cavities)</strong>
            In cold northern climates (ASHRAE Zones 5–8), the interior air is warm and moist; vapor barriers must be placed on the <strong>warm interior side</strong> of the insulation. Installing polyethylene sheeting on the exterior cold side traps escaping moisture within the stud cavity, saturating wooden OSB sheathing and breeding toxic mold. In hot humid climates (Zone 1–2), the reverse applies.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Compressing Fiberglass Batts into Narrow Cavities</strong>
            Fiberglass insulation derives its thermal resistance from billions of trapped, stagnant microscopic air pockets, NOT the glass fibers themselves. Forcing an R-30 batt (9.5\" thick) into a 2x6 stud cavity (5.5\" deep) crushes the air pockets, reducing the total R-value to only R-18. Never compress fibrous insulation to fit a undersized framing cavity.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Convective Air Leakage vs. Conductive Heat Loss Blindness</strong>
            Conductive insulation (fiberglass or cellulose) does not stop air movement. A 1-square-inch unsealed gap around an electrical outlet or top plate can allow warm air leakage that carries <strong>100 times more thermal energy and moisture</strong> through a wall assembly than conductive diffusion through solid materials. Always air-seal before insulating.
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Overlooking Air Film Boundary Resistances ($R_{si}$ and $R_{se}$)</strong>
            On thin, low-resistance assemblies like single-pane glass windows or uninsulated sheet metal doors, the stagnant thin air film adhering to the indoor surface ($R_{si} \approx 0.68$) and outdoor wind film ($R_{se} \approx 0.17$) contribute over 70% of the assembly's total thermal resistance. High winds stripping the exterior air film cause dramatic spikes in heating loss.
          </div>
        </div>
      </div>
    </div>

    <script>
      var ASSEMBLIES = {
        'wall_2x6': { rVal: 20.0, layers: [{name: 'Interior Air Film', r: 0.68}, {name: '1/2" Drywall', r: 0.45}, {name: 'R-20 2x6 Cavity Batt', r: 17.5}, {name: '1/2" OSB Sheathing', r: 0.62}, {name: 'Vinyl Siding', r: 0.61}, {name: 'Exterior Air Film', r: 0.17}] },
        'wall_2x4': { rVal: 14.0, layers: [{name: 'Interior Air Film', r: 0.68}, {name: '1/2" Drywall', r: 0.45}, {name: 'R-13 2x4 Cavity Batt', r: 11.5}, {name: '1/2" OSB Sheathing', r: 0.62}, {name: 'Vinyl Siding', r: 0.61}, {name: 'Exterior Air Film', r: 0.17}] },
        'wall_continuous': { rVal: 25.0, layers: [{name: 'Interior Air Film', r: 0.68}, {name: '1/2" Drywall', r: 0.45}, {name: 'R-15 Cavity Batt', r: 13.0}, {name: '1/2" OSB', r: 0.62}, {name: '2" Polyiso Continuous Foam', r: 10.0}, {name: 'Siding', r: 0.61}, {name: 'Exterior Film', r: 0.17}] },
        'brick_cavity': { rVal: 19.0, layers: [{name: 'Interior Air Film', r: 0.68}, {name: '1/2" Drywall', r: 0.45}, {name: '2x4 Batt', r: 12.0}, {name: '1/2" Sheathing', r: 0.62}, {name: '1" Air Cavity', r: 1.0}, {name: '4" Brick Veneer', r: 0.80}, {name: 'Exterior Film', r: 0.17}] },
        'concrete_8': { rVal: 1.25, layers: [{name: 'Interior Air Film', r: 0.68}, {name: '8" Solid Concrete', r: 0.40}, {name: 'Exterior Air Film', r: 0.17}] },
        'window_double': { rVal: 3.57, layers: [{name: 'Interior Film', r: 0.68}, {name: 'Double Low-E Argon Glass', r: 2.72}, {name: 'Exterior Film', r: 0.17}] },
        'window_single': { rVal: 0.96, layers: [{name: 'Interior Film', r: 0.68}, {name: 'Single 1/8" Glass', r: 0.11}, {name: 'Exterior Film', r: 0.17}] }
      };

      function onTcAssemblyChange() {
        var val = document.getElementById('tc-assembly').value;
        var customGrp = document.getElementById('grp-tc-custom');
        if (val === 'custom') {
          customGrp.style.display = 'grid';
        } else {
          customGrp.style.display = 'none';
        }
        calcThermal();
      }

      function calcThermal() {
        var assemKey = document.getElementById('tc-assembly').value;
        var areaSqFt = parseFloat(document.getElementById('tc-area').value) || 500;
        var tIn = parseFloat(document.getElementById('tc-tin').value) || 70;
        var tOut = parseFloat(document.getElementById('tc-tout').value) || 20;
        var costKwh = parseFloat(document.getElementById('tc-cost-kwh').value) || 0.18;

        var deltaT_F = Math.max(0, tIn - tOut);
        var deltaT_C = deltaT_F * (5/9);
        document.getElementById('tc-delta-t-display').textContent = deltaT_F.toFixed(1) + '°F (' + deltaT_C.toFixed(1) + '°C)';

        var rVal = 20.0;
        var activeLayers = [];

        if (assemKey === 'custom') {
          var k = parseFloat(document.getElementById('tc-custom-k').value) || 0.038;
          var thickIn = parseFloat(document.getElementById('tc-custom-thick').value) || 5.5;
          var thickM = (thickIn * 2.54) / 100;
          var rsi = thickM / k; // m2*K / W
          rVal = rsi * 5.67826; // imperial
          activeLayers = [
            { name: 'Interior Film', r: 0.68 },
            { name: 'Custom Material (' + thickIn + '")', r: rVal },
            { name: 'Exterior Film', r: 0.17 }
          ];
          rVal += 0.85; // include films
        } else {
          var assem = ASSEMBLIES[assemKey] || ASSEMBLIES['wall_2x6'];
          rVal = assem.rVal;
          activeLayers = assem.layers;
        }

        // U-Factor: U = 1 / R
        var uFactor = rVal > 0 ? (1 / rVal) : 1;
        var uMetric = uFactor * 5.67826; // W/(m2*K)
        var rsi = rVal / 5.67826;

        // Conductive Heat Loss Rate: Q_dot = U * A * deltaT [BTU/hr]
        var qBtuHr = uFactor * areaSqFt * deltaT_F;
        var qWatts = qBtuHr * 0.293071;

        // Daily energy loss
        var kwhDaily = (qWatts * 24) / 1000;
        var thermsDaily = (qBtuHr * 24) / 100000;
        var costDaily = kwhDaily * costKwh;

        // Update KPIs
        document.getElementById('tc-res-btu').textContent = Math.round(qBtuHr).toLocaleString() + ' BTU/hr';
        document.getElementById('tc-res-watts').textContent = Math.round(qWatts).toLocaleString() + ' Watts (' + (qWatts/1000).toFixed(2) + ' kW continuous)';

        document.getElementById('tc-res-rval').textContent = 'R-' + rVal.toFixed(1);
        document.getElementById('tc-res-rsi').textContent = 'RSI ' + rsi.toFixed(2) + ' m²·K/W';

        document.getElementById('tc-res-ufactor').textContent = 'U-' + uFactor.toFixed(3);
        document.getElementById('tc-res-u-metric').textContent = uMetric.toFixed(3) + ' W/(m²·K)';

        document.getElementById('tc-res-cost').textContent = ' (15 calculators in /calc/)');
}

 + costDaily.toFixed(2) + ' / day';
        document.getElementById('tc-res-kwh-day').textContent = kwhDaily.toFixed(2) + ' kWh/day (' + thermsDaily.toFixed(2) + ' Therms)';

        // Derivation Box
        var dBox = document.getElementById('tc-derivation-box');
        dBox.innerHTML = '<strong>1. Overall Heat Transfer Coefficient:</strong> U = 1 ÷ R-' + rVal.toFixed(1) + ' = <strong>U-' + uFactor.toFixed(4) + ' BTU/(hr·ft²·°F)</strong> [' + uMetric.toFixed(3) + ' W/(m²·K)].<br>' +
          '<strong>2. Fourier Conductive Heat Rate:</strong> Q̇ = U × Area × ΔT = ' + uFactor.toFixed(4) + ' × ' + areaSqFt + ' ft² × ' + deltaT_F.toFixed(1) + '°F = <strong>' + Math.round(qBtuHr).toLocaleString() + ' BTU/hr</strong>.<br>' +
          '<strong>3. Electrical Equivalent Wattage:</strong> ' + Math.round(qBtuHr).toLocaleString() + ' BTU/hr × 0.293071 = <strong>' + Math.round(qWatts).toLocaleString() + ' Watts</strong> continuous thermal transmission.<br>' +
          '<strong>4. 24-Hour Energy Consumption:</strong> (' + Math.round(qWatts).toLocaleString() + ' W × 24 hrs) ÷ 1,000 = <strong>' + kwhDaily.toFixed(2) + ' kWh/day</strong> (' + thermsDaily.toFixed(2) + ' therms).<br>' +
          '<strong>5. Economic Heating Cost:</strong> ' + kwhDaily.toFixed(2) + ' kWh/day ×  (15 calculators in /calc/)');
}

 + costKwh.toFixed(2) + '/kWh = <strong> (15 calculators in /calc/)');
}

 + costDaily.toFixed(2) + ' per day</strong> ( (15 calculators in /calc/)');
}

 + (costDaily * 30).toFixed(2) + ' / month).';

        // Render Gradient SVG
        renderThermalGradientSvg(tIn, tOut, rVal, activeLayers);
      }

      function renderThermalGradientSvg(tIn, tOut, rTotal, layers) {
        var svg = document.getElementById('tc-gradient-svg');
        if (!svg) return;

        var w = 800, h = 240;
        var padL = 70, padR = 70, padT = 30, padB = 40;
        var plotW = w - padL - padR;
        var plotH = h - padT - padB;

        var svgHtml = '';

        // Draw Layer Boxes
        var currentX = padL;
        var currentT = tIn;
        var deltaT = tIn - tOut;

        var tempPts = [];
        tempPts.push(currentX + ',' + ((padT + plotH) - ((currentT - tOut)/deltaT) * plotH));

        var numLayers = layers.length;
        var colWidth = plotW / numLayers;

        var colors = ['#94a3b8', '#64748b', '#cbd5e1', '#e2e8f0', '#cbd5e1', '#94a3b8'];

        layers.forEach(function(l, i) {
          var layerX = padL + (i * colWidth);
          var layerFraction = l.r / rTotal;
          var tDrop = deltaT * layerFraction;
          var nextT = currentT - tDrop;

          // Box
          var col = colors[i % colors.length];
          svgHtml += '<rect x="' + layerX + '" y="' + padT + '" width="' + colWidth + '" height="' + plotH + '" fill="' + col + '" opacity="0.35" stroke="var(--border)" stroke-width="1" />';

          // Text label
          svgHtml += '<text x="' + (layerX + colWidth/2) + '" y="' + (padT + plotH + 20) + '" fill="var(--text-muted)" font-size="9" text-anchor="middle">' + l.name.slice(0, 14) + '</text>';

          // Temperature line point
          currentT = nextT;
          var py = (padT + plotH) - ((currentT - tOut)/deltaT) * plotH;
          tempPts.push((layerX + colWidth) + ',' + py);
        });

        // Temperature drop curve (Red to Blue gradient line)
        svgHtml += '<path d="M ' + tempPts.join(' L ') + '" fill="none" stroke="#ef4444" stroke-width="3.5" />';

        // End circles
        var firstPt = tempPts[0].split(',');
        var lastPt = tempPts[tempPts.length - 1].split(',');
        svgHtml += '<circle cx="' + firstPt[0] + '" cy="' + firstPt[1] + '" r="5" fill="#ef4444" />';
        svgHtml += '<text x="' + (parseFloat(firstPt[0]) - 8) + '" y="' + (parseFloat(firstPt[1]) + 4) + '" fill="#ef4444" font-size="12" font-weight="bold" text-anchor="end">' + tIn.toFixed(0) + '°F Inside</text>';

        svgHtml += '<circle cx="' + lastPt[0] + '" cy="' + lastPt[1] + '" r="5" fill="#3b82f6" />';
        svgHtml += '<text x="' + (parseFloat(lastPt[0]) + 8) + '" y="' + (parseFloat(lastPt[1]) + 4) + '" fill="#3b82f6" font-size="12" font-weight="bold">' + tOut.toFixed(0) + '°F Outside</text>';

        svg.innerHTML = svgHtml;
      }

      function copyThermalReport(btn) {
        var btu = document.getElementById('tc-res-btu').textContent;
        var watts = document.getElementById('tc-res-watts').textContent;
        var rVal = document.getElementById('tc-res-rval').textContent;
        var uFactor = document.getElementById('tc-res-ufactor').textContent;
        var cost = document.getElementById('tc-res-cost').textContent;
        var kwh = document.getElementById('tc-res-kwh-day').textContent;

        var text = '🌡️ BUILDING THERMAL CONDUCTIVITY & HEAT LOSS REPORT\n' +
          '====================================================\n' +
          '• Heat Loss Rate: ' + btu + ' (' + watts + ')\n' +
          '• Assembly Resistance: ' + rVal + '\n' +
          '• Heat Transfer Coefficient: ' + uFactor + '\n' +
          '• Daily Heating Energy: ' + kwh + '\n' +
          '• Estimated Daily Cost: ' + cost + '\n' +
          '----------------------------------------------------\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/thermal-conductivity-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Thermal Report Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcThermal);
      } else {
        calcThermal();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'thermal-conductivity-calculator.html'), renderTradePage({
    title: "Thermal Conductivity & Heat Loss Calculator (Fourier's Law, R-Value & U-Factor) | Digital Tools Shed",
    metaDesc: "Calculate thermal conductivity (k), conductive heat loss (Watts & BTU/hr), composite wall R-values, U-factor, and daily heating energy costs using Fourier's Law.",
    canonical: `${DOMAIN}/calc/thermal-conductivity-calculator`,
    bodyContent: thermalBody,
    currentPath: '/calc/thermal-conductivity-calculator',
    faq: [
      {
        "q": "What is Fourier's Law of Thermal Conduction?",
        "a": "Fourier's Law states that the rate of conductive heat transfer (Q̇) through a material is directly proportional to the material's thermal conductivity (k), surface area (A), and temperature gradient (ΔT), and inversely proportional to thickness (d): Q̇ = (k · A · ΔT) / d."
      },
      {
        "q": "What is the relationship between R-value and U-factor?",
        "a": "U-factor and R-value are exact mathematical reciprocals: U = 1 / R and R = 1 / U. R-value measures thermal resistance (how much a material resists heat flow), whereas U-factor measures thermal transmittance (the rate at which heat flows through an assembly). Higher R-values and lower U-factors both denote superior insulation performance."
      },
      {
        "q": "Why does thermal bridging reduce effective wall R-value by 25%?",
        "a": "In standard stick-built construction, solid lumber 2x4 or 2x6 framing studs account for roughly 25% of total opaque wall surface area. Because solid softwood has an R-value of only ~R-1.25 per inch (R-6.8 for a 2x6), heat conducts rapidly through the wood studs around the cavity insulation. This thermal bridge reduces an R-20 nominal cavity down to approximately R-14 to R-15 effective performance."
      },
      {
        "q": "How does continuous exterior insulation eliminate thermal bridging?",
        "a": "Applying continuous rigid foam insulation (such as polyisocyanurate, XPS, or rockwool comfortboard) directly over the exterior sheathing creates an unbroken thermal blanket. It insulates the exterior faces of the wood studs, preventing cold thermal bridging and keeping the inner wall cavity warm enough to prevent condensation."
      },
      {
        "q": "What is the difference between sensible heat conduction and convective air leakage?",
        "a": "Conductive heat transfer occurs through molecular vibration within solid materials governed by Fourier's Law. Convective air leakage occurs when warm air physically blows through holes, cracks, and unsealed junctions. Building science research shows that air leakage can transport up to 100 times more thermal energy and moisture than conductive diffusion alone."
      }
    ]
  }));


  
  // ─────────────────────────────────────────────────────────────────────────────
  // 23. TORQUE, HORSEPOWER & RPM ENGINE DYNO CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const torqueBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Torque Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Automotive &amp; Dyno Engineering</span>
          <span class="badge badge-green">5,252 RPM Crossover Invariance</span>
          <span class="badge badge-blue">WHP Drivetrain Loss</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Torque, Horsepower &amp; RPM Engine Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate exact relationship between torque, mechanical horsepower, and engine rotational speed. Includes dual-mode solvers (HP from Torque, Torque from HP, RPM limit), wheel horsepower (WHP) driveline parasitic drag, transmission gear multiplication, and interactive dynamometer powerband curves.
        </p>
      </header>

      <!-- MAIN INTERACTIVE CONTROLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Calculation Mode:</label>
            <select id="trq-calc-mode" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="updateTorqueMode()">
              <option value="solve-hp" selected>Solve for Horsepower (from Torque &amp; RPM)</option>
              <option value="solve-torque">Solve for Torque (from HP &amp; RPM)</option>
              <option value="solve-rpm">Solve for RPM (from HP &amp; Torque)</option>
            </select>
          </div>

          <div id="trq-input-torque-wrap">
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Engine Torque:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="trq-torque-val" value="350" step="5" min="1" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcTorque()" />
              <select id="trq-torque-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcTorque()">
                <option value="lb-ft" selected>lb-ft</option>
                <option value="nm">N·m</option>
              </select>
            </div>
          </div>

          <div id="trq-input-hp-wrap" style="display: none;">
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Mechanical Power:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="trq-hp-val" value="400" step="5" min="1" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcTorque()" />
              <select id="trq-hp-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcTorque()">
                <option value="hp" selected>HP (mech)</option>
                <option value="kw">kW</option>
              </select>
            </div>
          </div>

          <div id="trq-input-rpm-wrap">
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Engine Speed (RPM):</label>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="range" id="trq-rpm-slider" min="500" max="8500" value="5500" step="50" style="flex: 1; cursor: pointer;" oninput="syncRpmSlider(this.value)" />
              <input type="number" id="trq-rpm-val" value="5500" min="100" max="25000" step="50" style="width: 80px; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem; text-align: center;" oninput="syncRpmInput(this.value)" />
            </div>
          </div>
        </div>

        <!-- DRIVETRAIN LOSS & GEARING ACCORDION -->
        <div style="border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Drivetrain Loss (WHP):</label>
            <select id="trq-drive-loss" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcTorque()">
              <option value="0">0% (Flywheel / Crank BHP)</option>
              <option value="12">12% (FWD Manual)</option>
              <option value="15" selected>15% (RWD Manual Standard)</option>
              <option value="18">18% (RWD Automatic)</option>
              <option value="22">22% (AWD / 4x4 Drivetrain)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Transmission Gear Ratio:</label>
            <input type="number" id="trq-gear-ratio" value="1.00" step="0.05" min="0.5" max="6.0" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcTorque()" />
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">e.g. 1st: 3.82, 4th: 1.00</span>
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Final Drive (Axle) Ratio:</label>
            <input type="number" id="trq-final-drive" value="3.73" step="0.05" min="1.5" max="6.0" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcTorque()" />
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">Differential gearing</span>
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Motor / Engine Profile:</label>
            <select id="trq-engine-type" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcTorque()">
              <option value="ice-turbo" selected>Gasoline Turbo (Broad Mid-Range)</option>
              <option value="ice-na">Naturally Aspirated (High RPM Peak)</option>
              <option value="ev">Electric Vehicle (Instant Peak Torque)</option>
              <option value="diesel">Turbo Diesel (Extreme Low-End)</option>
            </select>
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #ef4444;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Brake Horsepower (Crank)</div>
            <div id="trq-res-hp" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin-bottom: 0.2rem;">366.5 HP</div>
            <div id="trq-res-kw" style="font-size: 0.85rem; color: var(--text-muted);">273.3 kW (Mechanical)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Engine Flywheel Torque</div>
            <div id="trq-res-torque" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">350.0 lb-ft</div>
            <div id="trq-res-nm" style="font-size: 0.85rem; color: var(--text-muted);">474.5 N·m (Newton-meters)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Chassis Dyno WHP</div>
            <div id="trq-res-whp" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">311.5 WHP</div>
            <div id="trq-res-whp-sub" style="font-size: 0.85rem; color: var(--text-muted);">With 15% Drivetrain Loss</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #8b5cf6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Wheel Axle Torque</div>
            <div id="trq-res-wheel-trq" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #8b5cf6; margin-bottom: 0.2rem;">1,110 lb-ft</div>
            <div id="trq-res-wheel-nm" style="font-size: 0.85rem; color: var(--text-muted);">1,505 N·m (1.00 × 3.73 Gear)</div>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE DYNO POWERBAND SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <h2 style="font-family: var(--serif); font-size: 1.35rem; margin: 0; color: var(--fg);">
            📈 Live Chassis &amp; Engine Dyno Curve Simulation
          </h2>
          <div style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
            <span style="color: #3b82f6; font-weight: bold;">■ Torque (lb-ft)</span> &nbsp;|&nbsp; 
            <span style="color: #ef4444; font-weight: bold;">■ Horsepower (HP)</span> &nbsp;|&nbsp; 
            <span style="color: #10b981; font-weight: bold;">● 5,252 RPM Crossover</span>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Dynamic powerband plotting. Notice the mathematical physical law: whenever torque (lb-ft) and horsepower (HP) are plotted on identical scales, they <strong>must intersect precisely at 5,252 RPM</strong>.
        </p>

        <div style="overflow-x: auto;">
          <svg id="trq-dyno-svg" viewBox="0 0 800 280" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step Mathematical &amp; Physical Derivations
        </h3>
        <div id="trq-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating engine power kinematics...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="trq-copy-btn" onclick="copyTorqueReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Engine Dyno &amp; Torque Diagnostic
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Engineering Pitfalls in Dyno &amp; Engine Math
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The 5,252 RPM Crossover Invariance Trap</strong>
            Any chassis dyno chart where Torque (in lb-ft) and Horsepower (in HP) cross at any rotational speed other than 5,252 RPM is either falsified or plotted on disparate, deceptive Y-axis scales. Because 1 mechanical horsepower is defined as 33,000 foot-pounds of work per minute and a circle contains 2π radians, the constant 33,000 / (2π) equals 5,252.113. Mathematically, HP and lb-ft are identical numbers at exactly 5,252 RPM.
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. WHP vs Crank BHP Parasitic Drivetrain Loss</strong>
            Chassis roller dynamometers (Dynojet, Mustang) measure Wheel Horsepower (WHP), which reflects real-world power delivered to the pavement after transmission gears, differential ring-and-pinion friction, U-joints, and tire slip. Comparing a vehicle's 340 WHP dyno sheet to the manufacturer's 400 BHP crank rating causes unwarranted panic; a 15% to 18% driveline loss is entirely normal mechanical friction.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. EV Flat Torque Roll-off &amp; Field Weakening</strong>
            Marketing brochures frequently claim electric vehicles deliver "100% maximum torque from 0 to 18,000 RPM." In reality, an EV motor produces constant maximum torque only up to its "base speed" (corner frequency, typically 3,000 to 5,000 RPM). Beyond this speed, the motor controller must enter field weakening to avoid exceeding the battery pack voltage, forcing torque to decline inversely with RPM (1/ω) while keeping horsepower flat.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Transmission Gear Multiplication vs Engine Output Fallacy</strong>
            In 1st gear, a transmission multiplies engine torque by 3.5x to 4.5x, and the differential multiplies it by another 3.5x to 4.1x. A 300 lb-ft engine thus generates over 3,500 to 4,500 lb-ft of torque at the drive axles! Enthusiasts frequently confuse wheel torque with engine torque. Crucially, gearing multiplies torque while reducing rotational speed, perfectly conserving total mechanical horsepower (minus ~15% heat friction).
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Dyno Heat Soak &amp; Atmospheric Correction Factor Abuse</strong>
            Running multiple dyno pulls back-to-back without high-velocity cooling fans induces intercooler heat soak. As Intake Air Temperatures (IAT) exceed 120°F (49°C), the vehicle's engine control unit (ECU) pulls 5 to 10 degrees of ignition timing, causing a 10% to 15% collapse in horsepower. Additionally, switching from SAE J1349 standard atmospheric correction to non-standard STP or uncorrected modes artificially inflates horsepower numbers by up to 5%.
          </div>
        </div>
      </div>
    </div>

    <script>
      function updateTorqueMode() {
        var mode = document.getElementById('trq-calc-mode').value;
        var trqWrap = document.getElementById('trq-input-torque-wrap');
        var hpWrap = document.getElementById('trq-input-hp-wrap');
        var rpmWrap = document.getElementById('trq-input-rpm-wrap');

        if (mode === 'solve-hp') {
          trqWrap.style.display = 'block';
          hpWrap.style.display = 'none';
          rpmWrap.style.display = 'block';
        } else if (mode === 'solve-torque') {
          trqWrap.style.display = 'none';
          hpWrap.style.display = 'block';
          rpmWrap.style.display = 'block';
        } else if (mode === 'solve-rpm') {
          trqWrap.style.display = 'block';
          hpWrap.style.display = 'block';
          rpmWrap.style.display = 'none';
        }
        calcTorque();
      }

      function syncRpmSlider(val) {
        document.getElementById('trq-rpm-val').value = val;
        calcTorque();
      }

      function syncRpmInput(val) {
        var n = parseFloat(val);
        if (!isNaN(n)) {
          document.getElementById('trq-rpm-slider').value = Math.min(8500, Math.max(500, n));
        }
        calcTorque();
      }

      function calcTorque() {
        var mode = document.getElementById('trq-calc-mode').value;
        var trqVal = parseFloat(document.getElementById('trq-torque-val').value) || 350;
        var trqUnit = document.getElementById('trq-torque-unit').value;
        var hpVal = parseFloat(document.getElementById('trq-hp-val').value) || 400;
        var hpUnit = document.getElementById('trq-hp-unit').value;
        var rpm = parseFloat(document.getElementById('trq-rpm-val').value) || 5500;
        var lossPct = parseFloat(document.getElementById('trq-drive-loss').value) || 0;
        var gearRatio = parseFloat(document.getElementById('trq-gear-ratio').value) || 1.0;
        var finalDrive = parseFloat(document.getElementById('trq-final-drive').value) || 3.73;

        // Convert base torque to lb-ft
        var torqueLbFt = trqUnit === 'nm' ? trqVal / 1.355818 : trqVal;
        // Convert base HP to mechanical HP
        var mechHp = hpUnit === 'kw' ? hpVal / 0.7456999 : hpVal;

        if (mode === 'solve-hp') {
          mechHp = (torqueLbFt * rpm) / 5252.113;
        } else if (mode === 'solve-torque') {
          torqueLbFt = rpm > 0 ? (mechHp * 5252.113) / rpm : 0;
        } else if (mode === 'solve-rpm') {
          rpm = torqueLbFt > 0 ? (mechHp * 5252.113) / torqueLbFt : 0;
        }

        var kw = mechHp * 0.7456999;
        var torqueNm = torqueLbFt * 1.355818;

        var whp = mechHp * (1 - (lossPct / 100));
        var totalGearRatio = gearRatio * finalDrive;
        var wheelTorqueLbFt = torqueLbFt * totalGearRatio * (1 - (lossPct / 100));
        var wheelTorqueNm = wheelTorqueLbFt * 1.355818;

        // Update KPIs
        document.getElementById('trq-res-hp').textContent = mechHp.toFixed(1) + ' HP';
        document.getElementById('trq-res-kw').textContent = kw.toFixed(1) + ' kW (Mechanical)';

        document.getElementById('trq-res-torque').textContent = torqueLbFt.toFixed(1) + ' lb-ft';
        document.getElementById('trq-res-nm').textContent = torqueNm.toFixed(1) + ' N·m (Newton-meters)';

        document.getElementById('trq-res-whp').textContent = whp.toFixed(1) + ' WHP';
        document.getElementById('trq-res-whp-sub').textContent = 'With ' + lossPct + '% Drivetrain Loss';

        document.getElementById('trq-res-wheel-trq').textContent = Math.round(wheelTorqueLbFt).toLocaleString() + ' lb-ft';
        document.getElementById('trq-res-wheel-nm').textContent = Math.round(wheelTorqueNm).toLocaleString() + ' N·m (' + totalGearRatio.toFixed(2) + 'x Ratio)';

        // Derivation box
        var dBox = document.getElementById('trq-derivation-box');
        dBox.innerHTML = '<strong>1. Core Power-Torque Equivalence:</strong> HP = (Torque [lb-ft] × RPM) / 5,252.113<br>' +
          '• Calculated: (' + torqueLbFt.toFixed(1) + ' lb-ft × ' + Math.round(rpm).toLocaleString() + ' RPM) / 5,252.113 = <strong>' + mechHp.toFixed(1) + ' Crank HP</strong> (' + kw.toFixed(1) + ' kW).<br>' +
          '<strong>2. Wheel Dyno Loss:</strong> Parasitic frictional and inertial driveline drag is ' + lossPct + '%.<br>' +
          '• WHP = ' + mechHp.toFixed(1) + ' × (1 - ' + (lossPct/100).toFixed(2) + ') = <strong>' + whp.toFixed(1) + ' Wheel HP</strong>.<br>' +
          '<strong>3. Gear Torque Multiplication:</strong> Transmission gear (' + gearRatio.toFixed(2) + ') × Final drive (' + finalDrive.toFixed(2) + ') = <strong>' + totalGearRatio.toFixed(2) + ' total ratio</strong>.<br>' +
          '• Axle Torque = ' + torqueLbFt.toFixed(1) + ' × ' + totalGearRatio.toFixed(2) + ' × (1 - ' + (lossPct/100).toFixed(2) + ') = <strong>' + Math.round(wheelTorqueLbFt).toLocaleString() + ' lb-ft</strong> at drive tires.<br>' +
          '<strong>4. Physical Constant Derivation:</strong> 1 HP = 33,000 ft-lb/min. Divided by 2π radians per revolution: 33,000 / (2 × 3.14159265) = <strong>5,252.113</strong>. Below 5,252 RPM, Torque is always numerically higher than HP; above 5,252 RPM, HP is always higher.';

        renderDynoSvg(torqueLbFt, mechHp, rpm);
      }

      function renderDynoSvg(peakTrq, peakHp, curRpm) {
        var svg = document.getElementById('trq-dyno-svg');
        if (!svg) return;

        var w = 800, h = 280;
        var padL = 60, padR = 60, padT = 30, padB = 40;
        var plotW = w - padL - padR;
        var plotH = h - padT - padB;

        var maxRpm = 8000;
        var maxY = Math.max(500, Math.max(peakTrq, peakHp) * 1.25);

        var svgHtml = '';

        // Axes
        svgHtml += '<line x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (padL + plotW) + '" y2="' + (padT + plotH) + '" stroke="var(--border)" stroke-width="2" />';
        svgHtml += '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + plotH) + '" stroke="var(--border)" stroke-width="2" />';
        svgHtml += '<line x1="' + (padL + plotW) + '" y1="' + padT + '" x2="' + (padL + plotW) + '" y2="' + (padT + plotH) + '" stroke="var(--border)" stroke-width="2" />';

        // 5252 RPM vertical dashed reference line
        var x5252 = padL + (5252.113 / maxRpm) * plotW;
        svgHtml += '<line x1="' + x5252 + '" y1="' + padT + '" x2="' + x5252 + '" y2="' + (padT + plotH) + '" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,4" />';
        svgHtml += '<text x="' + x5252 + '" y="' + (padT - 8) + '" fill="#10b981" font-size="10.5" font-weight="bold" text-anchor="middle">5,252 RPM (Torque = HP)</text>';

        // Generate synthetic realistic dyno curves
        var trqPts = [];
        var hpPts = [];
        var steps = 40;
        for (var i = 0; i <= steps; i++) {
          var r = (i / steps) * maxRpm;
          if (r < 800) continue;

          // Torque curve profile (broad engine plateau peaking near 4200 RPM)
          var trqFactor = Math.sin((r / maxRpm) * Math.PI * 1.15);
          if (trqFactor < 0.2) trqFactor = 0.2;
          var tCurve = peakTrq * (0.65 + 0.35 * trqFactor);
          var hCurve = (tCurve * r) / 5252.113;

          var xPx = padL + (r / maxRpm) * plotW;
          var yTrqPx = padT + plotH - (tCurve / maxY) * plotH;
          var yHpPx = padT + plotH - (hCurve / maxY) * plotH;

          trqPts.push(xPx.toFixed(1) + ',' + yTrqPx.toFixed(1));
          hpPts.push(xPx.toFixed(1) + ',' + yHpPx.toFixed(1));
        }

        // Torque path (Blue)
        svgHtml += '<path d="M ' + trqPts.join(' L ') + '" fill="none" stroke="#3b82f6" stroke-width="3" />';
        // HP path (Red)
        svgHtml += '<path d="M ' + hpPts.join(' L ') + '" fill="none" stroke="#ef4444" stroke-width="3" />';

        // 5252 Crossover Dot
        var crossYVal = (peakTrq * (0.65 + 0.35 * Math.sin((5252.113 / maxRpm) * Math.PI * 1.15)));
        var yCrossPx = padT + plotH - (crossYVal / maxY) * plotH;
        svgHtml += '<circle cx="' + x5252 + '" cy="' + yCrossPx + '" r="5" fill="#10b981" />';

        // Current Operating RPM Cursor
        if (curRpm >= 500 && curRpm <= maxRpm) {
          var curX = padL + (curRpm / maxRpm) * plotW;
          svgHtml += '<line x1="' + curX + '" y1="' + padT + '" x2="' + curX + '" y2="' + (padT + plotH) + '" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" />';
          svgHtml += '<circle cx="' + curX + '" cy="' + (padT + plotH - (peakHp / maxY) * plotH) + '" r="5" fill="#f59e0b" />';
          svgHtml += '<text x="' + curX + '" y="' + (padT + plotH + 20) + '" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">' + Math.round(curRpm) + ' RPM</text>';
        }

        // Labels and axes ticks
        svgHtml += '<text x="' + (padL - 10) + '" y="' + (padT + 12) + '" fill="#3b82f6" font-size="11" font-weight="bold" text-anchor="end">Torque (lb-ft)</text>';
        svgHtml += '<text x="' + (padL + plotW + 10) + '" y="' + (padT + 12) + '" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="start">Power (HP)</text>';
        svgHtml += '<text x="' + (padL + plotW/2) + '" y="' + (h - 6) + '" fill="var(--fg)" font-size="11" font-weight="bold" text-anchor="middle">Engine Rotational Speed (RPM)</text>';

        svg.innerHTML = svgHtml;
      }

      function copyTorqueReport(btn) {
        var hp = document.getElementById('trq-res-hp').textContent;
        var kw = document.getElementById('trq-res-kw').textContent;
        var trq = document.getElementById('trq-res-torque').textContent;
        var nm = document.getElementById('trq-res-nm').textContent;
        var whp = document.getElementById('trq-res-whp').textContent;
        var wtrq = document.getElementById('trq-res-wheel-trq').textContent;
        var rpm = document.getElementById('trq-rpm-val').value;

        var text = '🏎️ ENGINE TORQUE, HORSEPOWER & DYNO REPORT\\n' +
          '====================================================\\n' +
          '• Rotational Speed: ' + rpm + ' RPM\\n' +
          '• Crank Power: ' + hp + ' (' + kw + ')\\n' +
          '• Flywheel Torque: ' + trq + ' (' + nm + ')\\n' +
          '• Chassis Dyno (WHP): ' + whp + '\\n' +
          '• Axle Wheel Torque: ' + wtrq + '\\n' +
          '• 5,252 RPM Crossover Verified: Invariant (HP = Torque)\\n' +
          '----------------------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/torque-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Dyno Diagnostic Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateTorqueMode);
      } else {
        updateTorqueMode();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'torque-calculator.html'), renderTradePage({
    title: "Torque, Horsepower & RPM Engine Calculator (5252 Crossover & Dyno WHP) | Digital Tools Shed",
    metaDesc: "Calculate engine horsepower, torque (lb-ft & N·m), and RPM with wheel horsepower (WHP) drivetrain loss, gear ratio multiplication, and interactive dyno curves.",
    canonical: `${DOMAIN}/calc/torque-calculator`,
    bodyContent: torqueBody,
    currentPath: '/calc/torque-calculator',
    faq: [
      {
        "q": "Why do torque and horsepower always cross at 5,252 RPM?",
        "a": "Horsepower is a derived mathematical rate of work defined as 33,000 foot-pounds per minute. Because rotational work equals torque multiplied by distance per revolution (2π radians), the constant 33,000 / 2π equals 5,252.113. Whenever torque in lb-ft and power in mechanical HP are plotted on identical scales, they must cross at 5,252 RPM."
      },
      {
        "q": "What is the difference between Wheel Horsepower (WHP) and Crank BHP?",
        "a": "Brake Horsepower (BHP) is gross mechanical power measured directly at the engine crankshaft without accessories. Wheel Horsepower (WHP) is measured by chassis dynamometer rollers at the vehicle's tires, reflecting a 12% to 22% parasitic loss from transmission gears, driveshafts, differential friction, and tire scrub."
      },
      {
        "q": "How does transmission gearing multiply wheel torque?",
        "a": "Gears act as mechanical levers. The total gear multiplication equals the transmission ratio multiplied by the final drive axle ratio. For example, a 300 lb-ft engine in 1st gear (3.82:1) with a 3.73:1 differential generates 300 × 3.82 × 3.73 × 0.85 (drivetrain efficiency) = 3,631 lb-ft of torque at the drive axles."
      },
      {
        "q": "Do electric vehicle motors produce maximum torque at high RPM?",
        "a": "No. Electric motors produce flat maximum torque from 0 RPM only up to their base speed (typically 3,000 to 5,000 RPM). Above base speed, the motor inverter must apply field weakening to prevent back-EMF from exceeding battery voltage, causing torque to taper inversely with rotational speed (1/ω) while holding horsepower flat."
      },
      {
        "q": "What is the formula to convert between lb-ft and N·m?",
        "a": "To convert torque from foot-pounds (lb-ft) to Newton-meters (N·m), multiply by 1.355818. To convert Newton-meters to foot-pounds, divide by 1.355818 (or multiply by 0.737562)."
      }
    ]
  }));



  // ─────────────────────────────────────────────────────────────────────────────
  // 24. HYDRAULIC CYLINDER FORCE, SPEED & FLOW CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const hydraulicBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Hydraulic Cylinder Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Hydraulic Fluid Power</span>
          <span class="badge badge-green">ISO 4413 Standards</span>
          <span class="badge badge-blue">Euler Column Buckling</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Hydraulic Cylinder Force, Speed &amp; Flow Rate Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate push and pull tonnage, rod annulus area, extend and retract velocities, full cycle duration, oil displacement volume, required pump horsepower, and Euler column rod buckling safety thresholds.
        </p>
      </header>

      <!-- MAIN INPUT BOX -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Operating Pressure:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="hyd-psi" value="3000" step="100" min="100" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcHydraulics()" />
              <select id="hyd-press-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcHydraulics()">
                <option value="psi" selected>PSI</option>
                <option value="bar">Bar</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Pump Flow Rate:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="hyd-gpm" value="12" step="0.5" min="0.5" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcHydraulics()" />
              <select id="hyd-flow-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcHydraulics()">
                <option value="gpm" selected>GPM</option>
                <option value="lpm">L/min</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Cylinder Bore Diameter:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="hyd-bore" value="4.0" step="0.25" min="1" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcHydraulics()" />
              <select id="hyd-dim-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcHydraulics()">
                <option value="in" selected>Inches</option>
                <option value="mm">mm</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Piston Rod Diameter:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="hyd-rod" value="2.0" step="0.25" min="0.5" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcHydraulics()" />
              <span id="hyd-rod-unit-lbl" style="width: 40%; display: flex; align-items: center; justify-content: center; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">Inches</span>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Stroke Length:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="hyd-stroke" value="24" step="1" min="1" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcHydraulics()" />
              <span id="hyd-stroke-unit-lbl" style="width: 40%; display: flex; align-items: center; justify-content: center; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">Inches</span>
            </div>
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Push Force (Extension)</div>
            <div id="hyd-res-push" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">18.8 Tons</div>
            <div id="hyd-res-push-sub" style="font-size: 0.85rem; color: var(--text-muted);">37,699 lbs (167.7 kN)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Pull Force (Retraction)</div>
            <div id="hyd-res-pull" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">14.1 Tons</div>
            <div id="hyd-res-pull-sub" style="font-size: 0.85rem; color: var(--text-muted);">28,274 lbs (-25% Deficit)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Cycle Times</div>
            <div id="hyd-res-times" style="font-family: var(--mono); font-size: 1.7rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;">6.5s Ext / 4.9s Ret</div>
            <div id="hyd-res-total-cycle" style="font-size: 0.85rem; color: var(--text-muted);">11.4s Full Round-Trip Cycle</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #8b5cf6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Pump Power &amp; Buckling</div>
            <div id="hyd-res-power" style="font-family: var(--mono); font-size: 2.0rem; font-weight: bold; color: #8b5cf6; margin-bottom: 0.2rem;">24.7 HP</div>
            <div id="hyd-res-buckling" style="font-size: 0.85rem; color: #10b981; font-weight: bold;">Buckling Safety: 4.8x Safe</div>
          </div>
        </div>

        <!-- FLUID KINEMATICS METRICS STRIP -->
        <div style="margin-top: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-family: var(--mono); font-size: 0.85rem;">
          <div>Bore Area: <strong id="hyd-res-bore-area" style="color: var(--fg);">12.57 sq in</strong></div>
          <div>Rod Annulus Area: <strong id="hyd-res-annulus-area" style="color: var(--fg);">9.42 sq in</strong></div>
          <div>Extend Speed: <strong id="hyd-res-ext-speed" style="color: #10b981;">3.67 in/s</strong></div>
          <div>Retract Speed: <strong id="hyd-res-ret-speed" style="color: #3b82f6;">4.90 in/s</strong></div>
          <div>Extend Volume: <strong id="hyd-res-ext-vol" style="color: var(--fg);">1.31 Gal</strong></div>
          <div>Retract Volume: <strong id="hyd-res-ret-vol" style="color: var(--fg);">0.98 Gal</strong></div>
        </div>
      </div>

      <!-- INTERACTIVE HYDRAULIC CYLINDER CUTAWAY SCHEMATIC SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);">
          🔬 Interactive Hydraulic Cylinder Cutaway Schematic
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Illustrates internal cylinder physics: full-bore pressure chamber (green), chrome rod body, annular retraction chamber (blue), and live port flows.
        </p>

        <div style="overflow-x: auto;">
          <svg id="hyd-cutaway-svg" viewBox="0 0 800 240" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step Fluid Power &amp; Column Buckling Derivations
        </h3>
        <div id="hyd-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating hydraulic cylinder engineering values...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="hyd-copy-btn" onclick="copyHydraulicReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Hydraulic Engineering Specification
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Engineering Pitfalls in Hydraulic Cylinders
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. Euler Column Buckling Under Compressive Push Loads</strong>
            Cylinders subjected to heavy compressive push loads fail by elastic column buckling long before steel reaches its yield strength. When a 2-inch rod extends 36 inches under 20 tons of force, lateral deflection causes catastrophic instant buckling. Designers must calculate Euler critical buckling load P_cr = (π² · E · I) / (K · L)² and maintain a minimum safety factor of 3.0 to 4.0.
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Overlooking Retraction Tonnage Deficit in Pull Applications</strong>
            Sizing a cylinder solely based on bore diameter results in severe failure when pulling (e.g. log splitter wedge return, knuckle boom cranes, hydraulic pullers). Because the steel rod subtracts 20% to 50% of the active piston surface area, retraction pulling force is always substantially weaker than extension force. Always design for pull loads using net annulus area.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Pressure Intensification in Differential Cylinders</strong>
            If fluid flow from the rod port is obstructed while hydraulic pressure is applied to the cap end, the piston acts as an intensifier. The pressure in the rod chamber multiplies by the ratio of bore area to annulus area (A_bore / A_annulus). A 3,000 PSI supply on a cylinder with a 2:1 area ratio instantly spikes rod chamber pressure to 6,000 PSI, blowing out rod seals and splitting heavy steel barrels.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. High-Velocity Seal Extrusion &amp; Thermal Degradation</strong>
            Forcing excessive pump flow (GPM) through narrow ports produces fluid velocities exceeding 25 ft/s (7.6 m/s). This induces extreme localized shear friction, elevating oil temperature past 180°F (82°C). High temperatures harden and bake nitrile and polyurethane rod seals, leading to extrusion failure, metal-on-metal rod scoring, and fluid contamination.
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Pump Cavitation from Restricted Suction Lines</strong>
            Attempting to increase cylinder speed by replacing a 6 GPM pump with an 18 GPM pump without upsizing the pump suction line induces pump cavitation. When fluid velocity in the intake hose exceeds 4 ft/s, atmospheric inlet pressure drops below oil vapor pressure, creating vapor bubbles that violently implode against pump gears, destroying the hydraulic pump within hours.
          </div>
        </div>
      </div>
    </div>

    <script>
      function calcHydraulics() {
        var pRaw = parseFloat(document.getElementById('hyd-psi').value) || 3000;
        var pUnit = document.getElementById('hyd-press-unit').value;
        var qRaw = parseFloat(document.getElementById('hyd-gpm').value) || 12;
        var qUnit = document.getElementById('hyd-flow-unit').value;
        var boreRaw = parseFloat(document.getElementById('hyd-bore').value) || 4.0;
        var rodRaw = parseFloat(document.getElementById('hyd-rod').value) || 2.0;
        var strokeRaw = parseFloat(document.getElementById('hyd-stroke').value) || 24;
        var dimUnit = document.getElementById('hyd-dim-unit').value;

        document.getElementById('hyd-rod-unit-lbl').textContent = dimUnit === 'mm' ? 'mm' : 'Inches';
        document.getElementById('hyd-stroke-unit-lbl').textContent = dimUnit === 'mm' ? 'mm' : 'Inches';

        // Convert to PSI, GPM, and Inches
        var psi = pUnit === 'bar' ? pRaw * 14.5038 : pRaw;
        var gpm = qUnit === 'lpm' ? qRaw / 3.78541 : qRaw;
        var boreIn = dimUnit === 'mm' ? boreRaw / 25.4 : boreRaw;
        var rodIn = dimUnit === 'mm' ? rodRaw / 25.4 : rodRaw;
        var strokeIn = dimUnit === 'mm' ? strokeRaw / 25.4 : strokeRaw;

        // Ensure rod diameter is strictly less than bore diameter
        if (rodIn >= boreIn) {
          rodIn = boreIn * 0.5;
        }

        var boreArea = Math.PI * Math.pow(boreIn / 2, 2);
        var rodArea = Math.PI * Math.pow(rodIn / 2, 2);
        var annulusArea = Math.max(0.01, boreArea - rodArea);

        // Forces
        var pushLbs = psi * boreArea;
        var pullLbs = psi * annulusArea;
        var pushTons = pushLbs / 2000;
        var pullTons = pullLbs / 2000;
        var pushKn = pushLbs * 0.00444822;
        var pullKn = pullLbs * 0.00444822;
        var pullDeficitPct = ((pushLbs - pullLbs) / pushLbs) * 100;

        // Velocities (in/s)
        var extSpeedInS = (gpm * 231) / (boreArea * 60);
        var retSpeedInS = (gpm * 231) / (annulusArea * 60);

        // Times (seconds)
        var extTimeSec = strokeIn / extSpeedInS;
        var retTimeSec = strokeIn / retSpeedInS;
        var cycleTimeSec = extTimeSec + retTimeSec;

        // Volumes (gallons)
        var extGal = (boreArea * strokeIn) / 231;
        var retGal = (annulusArea * strokeIn) / 231;

        // Mechanical Pump Power required (assuming 85% mechanical/volumetric efficiency)
        var pumpHp = (psi * gpm) / (1714 * 0.85);

        // Euler Column Buckling Check
        // Carbon steel E = 30,000,000 PSI; Moment of inertia I = (pi * d^4) / 64
        var steelE = 30000000;
        var inertia = (Math.PI * Math.pow(rodIn, 4)) / 64;
        var effLen = strokeIn * 1.5;
        var pCritical = (Math.PI * Math.PI * steelE * inertia) / Math.pow(effLen, 2);
        var safetyFactor = pCritical / pushLbs;

        // Update KPIs
        document.getElementById('hyd-res-push').textContent = pushTons.toFixed(1) + ' Tons';
        document.getElementById('hyd-res-push-sub').textContent = Math.round(pushLbs).toLocaleString() + ' lbs (' + pushKn.toFixed(1) + ' kN)';

        document.getElementById('hyd-res-pull').textContent = pullTons.toFixed(1) + ' Tons';
        document.getElementById('hyd-res-pull-sub').textContent = Math.round(pullLbs).toLocaleString() + ' lbs (-' + Math.round(pullDeficitPct) + '% Deficit)';

        document.getElementById('hyd-res-times').textContent = extTimeSec.toFixed(1) + 's Ext / ' + retTimeSec.toFixed(1) + 's Ret';
        document.getElementById('hyd-res-total-cycle').textContent = cycleTimeSec.toFixed(1) + 's Full Round-Trip Cycle';

        document.getElementById('hyd-res-power').textContent = pumpHp.toFixed(1) + ' HP';
        var buckEl = document.getElementById('hyd-res-buckling');
        if (safetyFactor >= 3.0) {
          buckEl.textContent = 'Buckling Safety: ' + safetyFactor.toFixed(1) + 'x (Safe)';
          buckEl.style.color = '#10b981';
        } else if (safetyFactor >= 1.5) {
          buckEl.textContent = 'Buckling Warning: ' + safetyFactor.toFixed(1) + 'x (Marginal)';
          buckEl.style.color = '#f59e0b';
        } else {
          buckEl.textContent = 'CRITICAL BUCKLING HAZARD (' + safetyFactor.toFixed(1) + 'x)';
          buckEl.style.color = '#ef4444';
        }

        // Metrics strip
        document.getElementById('hyd-res-bore-area').textContent = boreArea.toFixed(2) + ' sq in';
        document.getElementById('hyd-res-annulus-area').textContent = annulusArea.toFixed(2) + ' sq in';
        document.getElementById('hyd-res-ext-speed').textContent = extSpeedInS.toFixed(2) + ' in/s (' + (extSpeedInS * 5).toFixed(1) + ' ft/min)';
        document.getElementById('hyd-res-ret-speed').textContent = retSpeedInS.toFixed(2) + ' in/s (' + (retSpeedInS * 5).toFixed(1) + ' ft/min)';
        document.getElementById('hyd-res-ext-vol').textContent = extGal.toFixed(2) + ' Gal (' + (extGal * 3.785).toFixed(1) + ' L)';
        document.getElementById('hyd-res-ret-vol').textContent = retGal.toFixed(2) + ' Gal (' + (retGal * 3.785).toFixed(1) + ' L)';

        // Derivation box
        var dBox = document.getElementById('hyd-derivation-box');
        dBox.innerHTML = '<strong>1. Effective Hydraulic Working Areas:</strong><br>' +
          '• Full Bore Area = π × (' + boreIn.toFixed(2) + ' / 2)² = <strong>' + boreArea.toFixed(2) + ' in²</strong>.<br>' +
          '• Piston Rod Area = π × (' + rodIn.toFixed(2) + ' / 2)² = <strong>' + rodArea.toFixed(2) + ' in²</strong>.<br>' +
          '• Net Annulus (Retraction) Area = ' + boreArea.toFixed(2) + ' - ' + rodArea.toFixed(2) + ' = <strong>' + annulusArea.toFixed(2) + ' in²</strong>.<br>' +
          '<strong>2. Tonnage Output:</strong><br>' +
          '• Extension Force = ' + Math.round(psi) + ' PSI × ' + boreArea.toFixed(2) + ' in² = <strong>' + Math.round(pushLbs).toLocaleString() + ' lbs (' + pushTons.toFixed(1) + ' US Tons)</strong>.<br>' +
          '• Retraction Force = ' + Math.round(psi) + ' PSI × ' + annulusArea.toFixed(2) + ' in² = <strong>' + Math.round(pullLbs).toLocaleString() + ' lbs (' + pullTons.toFixed(1) + ' US Tons)</strong>.<br>' +
          '<strong>3. Flow Velocity &amp; Timing:</strong><br>' +
          '• Extend Speed = (' + gpm.toFixed(1) + ' GPM × 231) / (' + boreArea.toFixed(2) + ' × 60) = <strong>' + extSpeedInS.toFixed(2) + ' in/s</strong> &rarr; <strong>' + extTimeSec.toFixed(1) + 's</strong> stroke.<br>' +
          '• Retract Speed = (' + gpm.toFixed(1) + ' GPM × 231) / (' + annulusArea.toFixed(2) + ' × 60) = <strong>' + retSpeedInS.toFixed(2) + ' in/s</strong> &rarr; <strong>' + retTimeSec.toFixed(1) + 's</strong> stroke.<br>' +
          '<strong>4. Euler Column Buckling Critical Capacity:</strong><br>' +
          '• P_cr = (π² × 30,000,000 × ' + inertia.toFixed(3) + ') / (' + effLen.toFixed(1) + ')² = <strong>' + Math.round(pCritical).toLocaleString() + ' lbs</strong> &rarr; Safety Factor = <strong>' + safetyFactor.toFixed(1) + 'x</strong>.';

        renderHydraulicSvg(boreIn, rodIn, strokeIn);
      }

      function renderHydraulicSvg(bore, rod, stroke) {
        var svg = document.getElementById('hyd-cutaway-svg');
        if (!svg) return;

        var w = 800, h = 240;
        var svgHtml = '';

        // Cylinder Barrel Dimensions
        var bX = 100, bY = 50, bW = 380, bH = 140;
        var rodH = Math.max(30, bH * (rod / bore));
        var rodY = bY + (bH - rodH) / 2;
        var pistonW = 45;
        var pistonX = bX + 160;

        // 1. Fluid in Cap End (Extension Chamber - Green)
        svgHtml += '<rect x="' + bX + '" y="' + bY + '" width="' + (pistonX - bX) + '" height="' + bH + '" fill="rgba(16, 185, 129, 0.25)" />';

        // 2. Fluid in Rod End (Annulus Chamber - Blue)
        svgHtml += '<rect x="' + (pistonX + pistonW) + '" y="' + bY + '" width="' + (bX + bW - (pistonX + pistonW)) + '" height="' + ((bH - rodH)/2) + '" fill="rgba(59, 130, 246, 0.25)" />';
        svgHtml += '<rect x="' + (pistonX + pistonW) + '" y="' + (rodY + rodH) + '" width="' + (bX + bW - (pistonX + pistonW)) + '" height="' + ((bH - rodH)/2) + '" fill="rgba(59, 130, 246, 0.25)" />';

        // 3. Steel Barrel Outer Wall
        svgHtml += '<rect x="' + bX + '" y="' + bY + '" width="' + bW + '" height="' + bH + '" fill="none" stroke="var(--border)" stroke-width="4" rx="4" />';
        // End Caps
        svgHtml += '<rect x="' + (bX - 25) + '" y="' + (bY - 10) + '" width="25" height="' + (bH + 20) + '" fill="var(--surface-alt)" stroke="var(--border)" stroke-width="2" />';
        svgHtml += '<rect x="' + (bX + bW) + '" y="' + (bY - 10) + '" width="25" height="' + (bH + 20) + '" fill="var(--surface-alt)" stroke="var(--border)" stroke-width="2" />';

        // 4. Piston Head
        svgHtml += '<rect x="' + pistonX + '" y="' + bY + '" width="' + pistonW + '" height="' + bH + '" fill="var(--border)" stroke="#10b981" stroke-width="2" />';

        // 5. Piston Rod (Chrome)
        svgHtml += '<rect x="' + (pistonX + pistonW) + '" y="' + rodY + '" width="260" height="' + rodH + '" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" rx="2" />';
        // Rod Clevis Eye
        svgHtml += '<circle cx="' + (pistonX + pistonW + 260) + '" cy="' + (bY + bH/2) + '" r="22" fill="var(--surface-alt)" stroke="var(--border)" stroke-width="3" />';
        svgHtml += '<circle cx="' + (pistonX + pistonW + 260) + '" cy="' + (bY + bH/2) + '" r="9" fill="var(--bg)" stroke="var(--border)" stroke-width="2" />';

        // 6. Hydraulic Ports
        // Cap Port (Green)
        svgHtml += '<rect x="' + (bX + 30) + '" y="' + (bY - 20) + '" width="22" height="20" fill="#10b981" />';
        svgHtml += '<text x="' + (bX + 41) + '" y="' + (bY - 26) + '" fill="#10b981" font-size="10.5" font-weight="bold" text-anchor="middle">Cap Port</text>';
        // Rod Port (Blue)
        svgHtml += '<rect x="' + (bX + bW - 50) + '" y="' + (bY - 20) + '" width="22" height="20" fill="#3b82f6" />';
        svgHtml += '<text x="' + (bX + bW - 39) + '" y="' + (bY - 26) + '" fill="#3b82f6" font-size="10.5" font-weight="bold" text-anchor="middle">Rod Port</text>';

        // 7. Dynamic Callout Labels
        svgHtml += '<text x="' + (bX + 80) + '" y="' + (bY + bH/2 + 5) + '" fill="#10b981" font-size="12" font-weight="bold">Bore Area (' + bore.toFixed(1) + '\\")</text>';
        svgHtml += '<text x="' + (pistonX + pistonW + 100) + '" y="' + (rodY + rodH/2 + 4) + '" fill="#0f172a" font-size="11" font-weight="bold">Rod (' + rod.toFixed(1) + '\\")</text>';
        svgHtml += '<text x="' + (bX + bW/2) + '" y="' + (bY + bH + 28) + '" fill="var(--fg)" font-size="11" font-weight="bold" text-anchor="middle">Stroke Length: ' + stroke.toFixed(1) + ' Inches</text>';

        svg.innerHTML = svgHtml;
      }

      function copyHydraulicReport(btn) {
        var push = document.getElementById('hyd-res-push').textContent;
        var pushSub = document.getElementById('hyd-res-push-sub').textContent;
        var pull = document.getElementById('hyd-res-pull').textContent;
        var pullSub = document.getElementById('hyd-res-pull-sub').textContent;
        var times = document.getElementById('hyd-res-times').textContent;
        var power = document.getElementById('hyd-res-power').textContent;
        var buck = document.getElementById('hyd-res-buckling').textContent;

        var text = '⚙️ HYDRAULIC CYLINDER ENGINEERING SPECIFICATION\\n' +
          '====================================================\\n' +
          '• Extension Push Force: ' + push + ' (' + pushSub + ')\\n' +
          '• Retraction Pull Force: ' + pull + ' (' + pullSub + ')\\n' +
          '• Cycle Speeds: ' + times + '\\n' +
          '• Hydraulic Power Required: ' + power + '\\n' +
          '• Column Stability: ' + buck + '\\n' +
          '----------------------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/hydraulic-cylinder-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Hydraulic Spec Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcHydraulics);
      } else {
        calcHydraulics();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'hydraulic-cylinder-calculator.html'), renderTradePage({
    title: "Hydraulic Cylinder Force, Speed & Flow Rate Calculator (Push/Pull Tonnage & GPM) | Digital Tools Shed",
    metaDesc: "Calculate hydraulic cylinder push and pull force in tons and kN, rod displacement speeds, cycle duration, fluid GPM flow requirements, and Euler column buckling limits.",
    canonical: `${DOMAIN}/calc/hydraulic-cylinder-calculator`,
    bodyContent: hydraulicBody,
    currentPath: '/calc/hydraulic-cylinder-calculator',
    faq: [
      {
        "q": "Why does a hydraulic cylinder pull with less force than it pushes?",
        "a": "During retraction, hydraulic fluid acts exclusively against the ring-shaped annulus area surrounding the rod. Because the solid steel rod subtracts from the overall circular bore area, less surface area is exposed to fluid pressure (F = P × A), reducing pulling tonnage by 20% to 50%."
      },
      {
        "q": "Why does a cylinder retract faster than it extends at the same pump GPM?",
        "a": "Because the rod occupies internal cylinder barrel volume, the rod-end annulus chamber holds substantially less fluid volume than the full bore chamber. At an identical pump delivery rate (e.g. 10 GPM), fewer gallons are needed to retract the cylinder, causing the rod to retract in less time."
      },
      {
        "q": "What is Euler column buckling in hydraulic cylinders?",
        "a": "Euler buckling is a structural instability failure mode where a slender piston rod suddenly deflects laterally under compressive axial push load. It depends on rod diameter (moment of inertia), stroke length, and cylinder mounting geometry, rather than hydraulic fluid pressure."
      },
      {
        "q": "How do you calculate hydraulic pump horsepower?",
        "a": "Hydraulic horsepower is calculated using the formula: HP = (PSI × GPM) / (1714 × η), where η is overall pump mechanical and volumetric efficiency (typically 0.85). For example, 3,000 PSI at 12 GPM requires approximately 24.7 engine horsepower."
      },
      {
        "q": "What causes pressure intensification in a hydraulic cylinder?",
        "a": "If the rod-end port is blocked while hydraulic pressure is supplied to the cap end, the piston transmits force across the unequal areas. The pressure on the rod side multiplies by the ratio of bore area to annulus area (A_bore / A_annulus), potentially exceeding 6,000 PSI on a 3,000 PSI system."
      }
    ]
  }));



  // ─────────────────────────────────────────────────────────────────────────────
  // 25. PIPE FLOW RATE, VELOCITY & FRICTION HEAD LOSS CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const pipeFlowBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Pipe Flow Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Fluid Dynamics Engineering</span>
          <span class="badge badge-green">Darcy-Weisbach &amp; Swamee-Jain</span>
          <span class="badge badge-blue">Erosion-Corrosion Velocity Guard</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Pipe Flow Rate, Velocity &amp; Friction Head Loss Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Determine exact fluid velocity (ft/s &amp; m/s), Reynolds number flow regime, Darcy friction factor (f), dynamic head loss (feet of head &amp; PSI), and pumping power across Schedule 40/80 steel, copper, PVC, and PEX piping.
        </p>
      </header>

      <!-- MAIN INPUT BOX -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Fluid Flow Rate:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="pf-flow-val" value="25" step="1" min="0.1" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcPipeFlow()" />
              <select id="pf-flow-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcPipeFlow()">
                <option value="gpm" selected>GPM</option>
                <option value="lpm">L/min</option>
                <option value="cfs">ft³/s</option>
                <option value="m3h">m³/h</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Pipe Material &amp; Roughness:</label>
            <select id="pf-material" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="updatePipeMaterialPreset()">
              <option value="pvc" selected>PVC / PEX (Smooth plastic, ε = 0.0015 mm)</option>
              <option value="copper">Copper Type L / K (ε = 0.0015 mm)</option>
              <option value="steel">Commercial Steel Sched 40 (ε = 0.045 mm)</option>
              <option value="steel80">Commercial Steel Sched 80 (ε = 0.045 mm)</option>
              <option value="castiron">Cast Iron / Ductile Iron (ε = 0.26 mm)</option>
              <option value="galvanized">Galvanized Steel (ε = 0.15 mm)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Nominal Pipe Size (NPS):</label>
            <select id="pf-pipe-size" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="syncPipeDiameter()">
              <option value="0.622">1/2" Pipe</option>
              <option value="0.824">3/4" Pipe</option>
              <option value="1.049">1" Pipe</option>
              <option value="1.380">1-1/4" Pipe</option>
              <option value="1.610" selected>1-1/2" Pipe (ID: 1.610")</option>
              <option value="2.067">2" Pipe (ID: 2.067")</option>
              <option value="2.469">2-1/2" Pipe (ID: 2.469")</option>
              <option value="3.068">3" Pipe (ID: 3.068")</option>
              <option value="4.026">4" Pipe (ID: 4.026")</option>
              <option value="6.065">6" Pipe (ID: 6.065")</option>
              <option value="custom">Custom Internal Diameter</option>
            </select>
          </div>

          <div id="pf-custom-id-wrap">
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Exact Internal Diameter (ID):</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="pf-id-in" value="1.610" step="0.01" min="0.1" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcPipeFlow()" />
              <span style="width: 40%; display: flex; align-items: center; justify-content: center; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">Inches</span>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Total Pipe Run Length:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="pf-len-val" value="100" step="10" min="1" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcPipeFlow()" />
              <select id="pf-len-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcPipeFlow()">
                <option value="ft" selected>Feet</option>
                <option value="m">Meters</option>
              </select>
            </div>
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Fluid Flow Velocity</div>
            <div id="pf-res-vel" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">3.94 ft/s</div>
            <div id="pf-res-vel-metric" style="font-size: 0.85rem; color: var(--text-muted);">1.20 m/s (Ideal 4–7 ft/s Range)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #ef4444;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Total Pressure Drop (ΔP)</div>
            <div id="pf-res-psi-drop" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #ef4444; margin-bottom: 0.2rem;">2.21 PSI</div>
            <div id="pf-res-kpa" style="font-size: 0.85rem; color: var(--text-muted);">15.2 kPa (0.152 bar)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Darcy Friction Head Loss</div>
            <div id="pf-res-head-loss" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;">5.10 ft Head</div>
            <div id="pf-res-head-loss-sub" style="font-size: 0.85rem; color: var(--text-muted);">5.1 ft loss per 100 ft of pipe</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Flow Regime &amp; Power</div>
            <div id="pf-res-regime" style="font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">Turbulent (Re 43,450)</div>
            <div id="pf-res-pump-power" style="font-size: 0.85rem; color: var(--text-muted);">Friction Power: 0.032 HP (24 W)</div>
          </div>
        </div>

        <!-- FLUID PROPERTY METRICS STRIP -->
        <div style="margin-top: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-family: var(--mono); font-size: 0.85rem;">
          <div>Flow Area: <strong id="pf-res-area" style="color: var(--fg);">2.036 in²</strong></div>
          <div>Swamee-Jain (f): <strong id="pf-res-f" style="color: var(--fg);">0.0218</strong></div>
          <div>Relative Roughness: <strong id="pf-res-rough" style="color: var(--fg);">0.000037</strong></div>
          <div>Hazen-Williams (C=150): <strong id="pf-res-hw" style="color: #3b82f6;">4.78 ft / 100 ft</strong></div>
        </div>
      </div>

      <!-- INTERACTIVE FLOW PROFILE & ENERGY GRADE LINE SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);">
          🌊 Fluid Velocity Profile &amp; Hydraulic Gradient Line (HGL)
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Cross-sectional boundary layer velocity profile (parabolic laminar vs turbulent flattened profile) and downstream hydraulic energy grade line slope.
        </p>

        <div style="overflow-x: auto;">
          <svg id="pf-profile-svg" viewBox="0 0 800 240" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step Fluid Dynamics Derivations
        </h3>
        <div id="pf-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating pipe hydraulics and friction factors...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="pf-copy-btn" onclick="copyPipeFlowReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Pipe Flow &amp; Head Loss Report
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Engineering Pitfalls in Pipe Flow &amp; Hydraulics
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. Erosion-Corrosion from Excessive Flow Velocity (>8 ft/s)</strong>
            Sizing domestic water piping with fluid velocities exceeding 8 ft/s (2.4 m/s) in cold water or 5 ft/s (1.5 m/s) in hot water causes rapid pipe wall destruction. High shear turbulence scours the protective copper oxide passivation layer off inner pipe walls, causing pinhole leaks and pipe blowouts within 24 to 36 months. Always size plumbing for 4 to 7 ft/s.
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Water Hammer Kinetic Shock Waves (The Joukowsky Spike)</strong>
            Suddenly halting water moving at high velocity by closing a solenoid or quarter-turn ball valve converts kinetic energy into an acoustic pressure shock wave (ΔP = ρ · c · Δv). Water moving at 8 ft/s in steel pipe generates an instantaneous 400+ PSI pressure pulse upon valve closure, rupturing PEX crimp fittings, breaking water heaters, and vibrating pipes off hangars.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Nominal Pipe Size (NPS) vs Actual Internal Diameter</strong>
            Assuming a 2-inch pipe has a 2.000-inch inside diameter introduces severe calculation errors. Schedule 40 2" pipe has an ID of 2.067", while Schedule 80 2" pipe has an ID of 1.939". Because flow area scales with diameter squared (D²) and head loss scales inversely with diameter to the fifth power (1/D⁵), using nominal sizing instead of true ID results in a 30%+ error in pump head calculations.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Minor Fitting Losses Dominating Short Piping Runs</strong>
            In boiler rooms, pump skids, and mechanical rooms with short piping runs, friction head loss from elbows, tees, check valves, and strainers accounts for over 60% to 75% of total dynamic head. Calculating only straight-pipe friction while neglecting equivalent length fitting losses leads to undersized pumps that fail to achieve design flow.
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Temperature-Induced Kinematic Viscosity Spikes</strong>
            Water viscosity is heavily temperature-dependent. Kinematic viscosity doubles from 70°F (1.0 cSt) down to 34°F (1.75 cSt). In chilled water cooling loops or outdoor winter geothermal systems, cold water experiences significantly higher Darcy friction factors and head loss. Calculating pumping head using room-temperature fluid properties starves chillers of design flow in winter.
          </div>
        </div>
      </div>
    </div>

    <script>
      function updatePipeMaterialPreset() {
        var mat = document.getElementById('pf-material').value;
        var szSelect = document.getElementById('pf-pipe-size');
        syncPipeDiameter();
      }

      function syncPipeDiameter() {
        var szVal = document.getElementById('pf-pipe-size').value;
        var mat = document.getElementById('pf-material').value;

        if (szVal !== 'custom') {
          var id = parseFloat(szVal);
          // If schedule 80 selected, adjust slightly smaller
          if (mat === 'steel80') {
            id = id * 0.93;
          } else if (mat === 'copper') {
            id = id * 0.98;
          }
          document.getElementById('pf-id-in').value = id.toFixed(3);
        }
        calcPipeFlow();
      }

      function calcPipeFlow() {
        var qRaw = parseFloat(document.getElementById('pf-flow-val').value) || 25;
        var qUnit = document.getElementById('pf-flow-unit').value;
        var mat = document.getElementById('pf-material').value;
        var idIn = parseFloat(document.getElementById('pf-id-in').value) || 1.610;
        var lenRaw = parseFloat(document.getElementById('pf-len-val').value) || 100;
        var lenUnit = document.getElementById('pf-len-unit').value;

        // Convert Flow to GPM and cfs (ft^3/s)
        var gpm = qRaw;
        if (qUnit === 'lpm') gpm = qRaw / 3.78541;
        else if (qUnit === 'cfs') gpm = qRaw * 448.831;
        else if (qUnit === 'm3h') gpm = qRaw * 4.40287;

        var qCfs = gpm / 448.831;

        // Convert Length to Feet
        var lenFt = lenUnit === 'm' ? lenRaw * 3.28084 : lenRaw;

        // Pipe Geometry
        var dFt = idIn / 12;
        var areaSqFt = (Math.PI * Math.pow(dFt, 2)) / 4;
        var areaSqIn = areaSqFt * 144;

        // Flow Velocity (ft/s)
        var velFtS = areaSqFt > 0 ? qCfs / areaSqFt : 0;
        var velMS = velFtS * 0.3048;

        // Water Properties at 60°F
        var nu = 1.217e-5; // ft^2/s kinematic viscosity
        var g = 32.174; // ft/s^2 gravity

        // Reynolds Number
        var re = (velFtS * dFt) / nu;

        // Roughness epsilon in mm -> ft
        var epsMm = 0.0015; // PVC/PEX
        if (mat === 'copper') epsMm = 0.0015;
        else if (mat === 'steel' || mat === 'steel80') epsMm = 0.045;
        else if (mat === 'castiron') epsMm = 0.26;
        else if (mat === 'galvanized') epsMm = 0.15;

        var epsFt = (epsMm / 1000) * 3.28084;
        var relRough = epsFt / dFt;

        // Friction Factor (f)
        var f = 0.02;
        if (re < 2300) {
          f = re > 0 ? 64 / re : 0.02;
        } else {
          // Swamee-Jain equation
          var term1 = relRough / 3.7;
          var term2 = 5.74 / Math.pow(re, 0.9);
          f = 0.25 / Math.pow(Math.log10(term1 + term2), 2);
        }

        // Darcy-Weisbach Friction Head Loss (ft of head)
        var headLossFt = f * (lenFt / dFt) * (Math.pow(velFtS, 2) / (2 * g));
        var psiDrop = headLossFt * 0.4335; // 1 ft water = 0.4335 PSI
        var kpaDrop = psiDrop * 6.89476;

        var headLossPer100 = (headLossFt / lenFt) * 100;

        // Hazen-Williams comparison (C = 150 for PVC, 130 for copper/steel)
        var hwC = (mat === 'pvc') ? 150 : 130;
        var hwLossPer100 = (10.67 * 100 * Math.pow(gpm, 1.852)) / (Math.pow(hwC, 1.852) * Math.pow(idIn, 4.87));

        // Hydraulic pumping power (HP)
        var hydPowerHp = (gpm * headLossFt) / 3960;
        var hydPowerW = hydPowerHp * 745.7;

        // Update KPIs
        document.getElementById('pf-res-vel').textContent = velFtS.toFixed(2) + ' ft/s';
        var velDesc = 'Ideal (4–7 ft/s)';
        if (velFtS < 2.0) velDesc = 'Low Velocity (<2 ft/s settling)';
        else if (velFtS > 8.0) velDesc = 'HIGH VELOCITY (>8 ft/s Erosion Risk)';
        document.getElementById('pf-res-vel-metric').textContent = velMS.toFixed(2) + ' m/s (' + velDesc + ')';

        document.getElementById('pf-res-psi-drop').textContent = psiDrop.toFixed(2) + ' PSI';
        document.getElementById('pf-res-kpa').textContent = kpaDrop.toFixed(1) + ' kPa (' + (kpaDrop/100).toFixed(3) + ' bar)';

        document.getElementById('pf-res-head-loss').textContent = headLossFt.toFixed(2) + ' ft Head';
        document.getElementById('pf-res-head-loss-sub').textContent = headLossPer100.toFixed(2) + ' ft loss per 100 ft pipe';

        var regimeStr = re < 2300 ? 'Laminar' : (re <= 4000 ? 'Transitional' : 'Turbulent');
        document.getElementById('pf-res-regime').textContent = regimeStr + ' (Re ' + Math.round(re).toLocaleString() + ')';
        document.getElementById('pf-res-pump-power').textContent = 'Friction Power: ' + hydPowerHp.toFixed(3) + ' HP (' + Math.round(hydPowerW) + ' W)';

        // Strip
        document.getElementById('pf-res-area').textContent = areaSqIn.toFixed(3) + ' in²';
        document.getElementById('pf-res-f').textContent = f.toFixed(4);
        document.getElementById('pf-res-rough').textContent = relRough.toFixed(6);
        document.getElementById('pf-res-hw').textContent = hwLossPer100.toFixed(2) + ' ft / 100 ft';

        // Derivation
        var dBox = document.getElementById('pf-derivation-box');
        dBox.innerHTML = '<strong>1. Flow Continuity &amp; Velocity:</strong><br>' +
          '• Internal Diameter = ' + idIn.toFixed(3) + ' in (' + dFt.toFixed(4) + ' ft) &rarr; Cross-sectional Area = ' + areaSqIn.toFixed(3) + ' in².<br>' +
          '• Velocity v = Q / A = (' + gpm.toFixed(1) + ' GPM / 448.831) / ' + areaSqFt.toFixed(5) + ' ft² = <strong>' + velFtS.toFixed(2) + ' ft/s</strong> (' + velMS.toFixed(2) + ' m/s).<br>' +
          '<strong>2. Reynolds Number &amp; Flow Regime:</strong><br>' +
          '• Re = (v · D) / ν = (' + velFtS.toFixed(2) + ' × ' + dFt.toFixed(4) + ') / 1.217×10⁻⁵ = <strong>' + Math.round(re).toLocaleString() + '</strong> &rarr; <strong>' + regimeStr + ' Flow</strong>.<br>' +
          '<strong>3. Swamee-Jain Friction Factor (f):</strong><br>' +
          '• Pipe Relative Roughness ε/D = ' + relRough.toFixed(6) + ' &rarr; f = <strong>' + f.toFixed(4) + '</strong>.<br>' +
          '<strong>4. Darcy-Weisbach Dynamic Friction Head Loss:</strong><br>' +
          '• h_f = f · (L / D) · (v² / 2g) = ' + f.toFixed(4) + ' × (' + lenFt.toFixed(1) + ' / ' + dFt.toFixed(4) + ') × (' + Math.pow(velFtS, 2).toFixed(2) + ' / 64.35) = <strong>' + headLossFt.toFixed(2) + ' Feet of Head</strong>.<br>' +
          '• Pressure Drop ΔP = ' + headLossFt.toFixed(2) + ' ft × 0.4335 PSI/ft = <strong>' + psiDrop.toFixed(2) + ' PSI</strong> (' + kpaDrop.toFixed(1) + ' kPa).';

        renderPipeProfileSvg(velFtS, re, headLossFt);
      }

      function renderPipeProfileSvg(vel, re, headLoss) {
        var svg = document.getElementById('pf-profile-svg');
        if (!svg) return;

        var w = 800, h = 240;
        var svgHtml = '';

        // Pipe Cross-section Walls
        var pX = 60, pY = 40, pW = 680, pH = 110;
        // Top and bottom pipe boundaries
        svgHtml += '<rect x="' + pX + '" y="' + (pY - 10) + '" width="' + pW + '" height="10" fill="#64748b" />';
        svgHtml += '<rect x="' + pX + '" y="' + (pY + pH) + '" width="' + pW + '" height="10" fill="#64748b" />';
        svgHtml += '<rect x="' + pX + '" y="' + pY + '" width="' + pW + '" height="' + pH + '" fill="rgba(59, 130, 246, 0.08)" />';

        // Plot Velocity Boundary Layer Profile on the left
        var profileStartX = pX + 40;
        var pts = [];
        var nPts = 20;
        for (var i = 0; i <= nPts; i++) {
          var frac = i / nPts; // 0 (top wall) to 1 (bottom wall)
          var yPos = pY + frac * pH;
          // Turbulent profile has 1/7th power law flat profile; laminar is parabola
          var distFromWall = Math.min(frac, 1 - frac) * 2; // 0 at walls, 1 at center
          var vFrac = re > 4000 ? Math.pow(distFromWall, 1/7) : (1 - Math.pow(2 * frac - 1, 2));
          var xPos = profileStartX + vFrac * 90;
          pts.push(xPos.toFixed(1) + ',' + yPos.toFixed(1));
        }

        // Velocity Arrows
        svgHtml += '<path d="M ' + profileStartX + ' ' + pY + ' L ' + pts.join(' L ') + ' L ' + profileStartX + ' ' + (pY + pH) + ' Z" fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" stroke-width="2.5" />';
        svgHtml += '<text x="' + (profileStartX + 45) + '" y="' + (pY + pH/2 + 4) + '" fill="#3b82f6" font-size="11" font-weight="bold" text-anchor="middle">v = ' + vel.toFixed(1) + ' ft/s</text>';

        // Hydraulic Gradient Line (HGL) slope across pipe
        var hglY1 = pY - 20;
        var hglDrop = Math.min(25, Math.max(8, headLoss * 2));
        var hglY2 = hglY1 + hglDrop;
        svgHtml += '<line x1="' + (pX + 150) + '" y1="' + hglY1 + '" x2="' + (pX + pW - 20) + '" y2="' + hglY2 + '" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="6,3" />';
        svgHtml += '<text x="' + (pX + 160) + '" y="' + (hglY1 - 6) + '" fill="#ef4444" font-size="11" font-weight="bold">Hydraulic Grade Line (HGL)</text>';
        svgHtml += '<text x="' + (pX + pW - 20) + '" y="' + (hglY2 + 18) + '" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="end">Δh = ' + headLoss.toFixed(1) + ' ft</text>';

        // Labels
        svgHtml += '<text x="' + (pX + pW/2) + '" y="' + (pY + pH + 35) + '" fill="var(--fg)" font-size="11" font-weight="bold" text-anchor="middle">Pipe Length &amp; Fluid Direction &rarr;</text>';

        svg.innerHTML = svgHtml;
      }

      function copyPipeFlowReport(btn) {
        var vel = document.getElementById('pf-res-vel').textContent;
        var velM = document.getElementById('pf-res-vel-metric').textContent;
        var psi = document.getElementById('pf-res-psi-drop').textContent;
        var head = document.getElementById('pf-res-head-loss').textContent;
        var reg = document.getElementById('pf-res-regime').textContent;
        var pwr = document.getElementById('pf-res-pump-power').textContent;

        var text = '🌊 PIPE HYDRAULIC & FRICTION HEAD LOSS REPORT\\n' +
          '====================================================\\n' +
          '• Fluid Velocity: ' + vel + ' (' + velM + ')\\n' +
          '• Total Pressure Drop: ' + psi + '\\n' +
          '• Darcy Friction Head Loss: ' + head + '\\n' +
          '• Flow Regime: ' + reg + '\\n' +
          '• Pumping Power: ' + pwr + '\\n' +
          '----------------------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/pipe-flow-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Hydraulics Report Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updatePipeMaterialPreset);
      } else {
        updatePipeMaterialPreset();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'pipe-flow-calculator.html'), renderTradePage({
    title: "Pipe Flow Rate, Velocity & Friction Head Loss Calculator (Darcy-Weisbach & GPM) | Digital Tools Shed",
    metaDesc: "Calculate pipe fluid velocity (ft/s & m/s), Darcy-Weisbach friction head loss, pressure drop (PSI & kPa), and Reynolds number across PVC, copper, and steel pipes.",
    canonical: `${DOMAIN}/calc/pipe-flow-calculator`,
    bodyContent: pipeFlowBody,
    currentPath: '/calc/pipe-flow-calculator',
    faq: [
      {
        "q": "What is the recommended fluid velocity in domestic and commercial water pipes?",
        "a": "Plumbing engineering codes typically mandate fluid velocities between 4 and 7 ft/s (1.2 to 2.1 m/s). Velocities below 2 ft/s allow particulate settlement and biofilm accumulation, while velocities exceeding 8 ft/s cause severe erosion-corrosion, water hammer pressure surges, and pipe wall thinning."
      },
      {
        "q": "What is the difference between the Darcy-Weisbach and Hazen-Williams formulas?",
        "a": "Darcy-Weisbach is a universal, dimensionally exact physical formula valid for all fluid types, temperatures, and pipe roughness using the friction factor f. Hazen-Williams is an empirical formula calibrated exclusively for water at room temperature (~60°F), failing to account for fluid viscosity or temperature variations."
      },
      {
        "q": "Why does Schedule 80 pipe have higher friction loss than Schedule 40 pipe?",
        "a": "Schedule 80 pipe features thicker structural walls for higher pressure ratings, which reduces its actual internal diameter (ID). Because fluid velocity varies inversely with diameter squared (1/D²) and head loss varies inversely with diameter to the fifth power (1/D⁵), the smaller ID of Schedule 80 increases friction loss substantially."
      },
      {
        "q": "How does water temperature affect pipe friction loss?",
        "a": "Kinematic viscosity of water nearly doubles from 70°F (1.0 cSt) down to 34°F (1.75 cSt). In chilled water cooling loops or winter geothermal loops, colder water produces lower Reynolds numbers and higher Darcy friction factors, increasing pumping head loss."
      },
      {
        "q": "What causes water hammer in pipes?",
        "a": "Water hammer occurs when moving fluid is abruptly stopped by a closing valve. According to the Joukowsky equation (ΔP = ρ · c · Δv), the sudden destruction of kinetic energy generates acoustic pressure shock waves exceeding 300 to 500 PSI, requiring water hammer arrestors."
      }
    ]
  }));


  
  // ─────────────────────────────────────────────────────────────────────────────
  // 26. CONCRETE COMPRESSIVE STRENGTH & 28-DAY CYLINDER BREAK CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const concreteStrengthBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Concrete Strength Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Structural Concrete Testing</span>
          <span class="badge badge-green">ASTM C39 &amp; ACI 209R</span>
          <span class="badge badge-blue">7-Day to 28-Day Curing Curve</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Concrete Compressive Strength &amp; Cylinder Break Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Determine exact concrete compressive strength (PSI &amp; MPa) from compression machine break loads. Predict 28-day design strength from 3-day or 7-day breaks using ACI 209R logarithmic curing curves, water-cement ratio (w/c) Abrams' Law, and core sample L/D corrections (ASTM C42).
        </p>
      </header>

      <!-- MAIN INPUT BOX -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Cylinder Specimen Size:</label>
            <select id="cs-cyl-size" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="updateCylinderSize()">
              <option value="6x12" selected>Standard 6" × 12" Cylinder (Area: 28.27 in²)</option>
              <option value="4x8">Standard 4" × 8" Cylinder (Area: 12.57 in²)</option>
              <option value="3x6">Small 3" × 6" Cylinder (Area: 7.07 in²)</option>
              <option value="150x300">Metric 150mm × 300mm (Area: 17,671 mm²)</option>
              <option value="100x200">Metric 100mm × 200mm (Area: 7,854 mm²)</option>
              <option value="custom">Custom Diameter &amp; Core Length</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Maximum Break Load:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="cs-break-load" value="115000" step="1000" min="1000" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcConcreteStrength()" />
              <select id="cs-load-unit" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcConcreteStrength()">
                <option value="lbf" selected>lbf (lbs)</option>
                <option value="kn">kN</option>
                <option value="kip">kips</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Specimen Age at Break (Days):</label>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="range" id="cs-age-slider" min="1" max="56" value="7" step="1" style="flex: 1; cursor: pointer;" oninput="syncAgeSlider(this.value)" />
              <input type="number" id="cs-age-val" value="7" min="1" max="365" step="1" style="width: 65px; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem; text-align: center;" oninput="syncAgeInput(this.value)" />
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Specified 28-Day f'c Design Target:</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="cs-design-fc" value="4000" step="250" min="1500" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem;" oninput="calcConcreteStrength()" />
              <span style="width: 40%; display: flex; align-items: center; justify-content: center; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">PSI</span>
            </div>
          </div>
        </div>

        <!-- MIX TYPE & ASTM C42 CORE OPTIONS -->
        <div style="border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Cement / Mix Type:</label>
            <select id="cs-cement-type" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcConcreteStrength()">
              <option value="type1" selected>Type I Normal Portland (Standard Curing)</option>
              <option value="type3">Type III High Early Strength (Fast Cure)</option>
              <option value="flyash">Type I + 20% Fly Ash / Slag (Slow Early Cure)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Curing Environment:</label>
            <select id="cs-curing-env" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcConcreteStrength()">
              <option value="standard" selected>Standard Moist Room / 73°F Water Bath (ASTM C511)</option>
              <option value="field">Field Cured (Ambient Jobsite Conditions)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Core L/D Ratio (ASTM C42):</label>
            <input type="number" id="cs-ld-ratio" value="2.00" step="0.05" min="1.0" max="2.2" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 0.95rem;" oninput="calcConcreteStrength()" />
            <span style="font-size: 0.72rem; color: var(--text-muted); display: block; margin-top: 0.2rem;">2.0 = Standard cylinder (no correction)</span>
          </div>

          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.35rem;">Fracture Pattern (ASTM C39):</label>
            <select id="cs-fracture-type" style="width: 100%; padding: 0.55rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;">
              <option value="cone" selected>Type 1: Well-Formed Cone (<1" cracking)</option>
              <option value="cone-split">Type 2: Cone and Vertical Split</option>
              <option value="columnar">Type 3: Columnar Vertical Cracking</option>
              <option value="shear">Type 4: Diagonal Shear Plane</option>
            </select>
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Current Tested Strength</div>
            <div id="cs-res-cur-psi" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">4,068 PSI</div>
            <div id="cs-res-cur-mpa" style="font-size: 0.85rem; color: var(--text-muted);">28.05 MPa (Day 7 Break)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Projected 28-Day Strength</div>
            <div id="cs-res-proj-28" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">5,811 PSI</div>
            <div id="cs-res-proj-mpa" style="font-size: 0.85rem; color: var(--text-muted);">40.07 MPa (ACI 209R Model)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Target Compliance Ratio</div>
            <div id="cs-res-target-pct" style="font-family: var(--mono); font-size: 2.0rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;">145.3%</div>
            <div id="cs-res-compliance-sub" style="font-size: 0.85rem; color: #10b981; font-weight: bold;">PASSED (Exceeds 4,000 Target)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #8b5cf6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Estimated w/c Ratio</div>
            <div id="cs-res-wc-ratio" style="font-family: var(--mono); font-size: 2.0rem; font-weight: bold; color: #8b5cf6; margin-bottom: 0.2rem;">0.43 w/c</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">Abrams' Law Prediction</div>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE 28-DAY CURING CURVE SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <h2 style="font-family: var(--serif); font-size: 1.35rem; margin: 0; color: var(--fg);">
            📈 ACI 209R Logarithmic Concrete Curing Gain Curve
          </h2>
          <div style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
            <span style="color: #3b82f6; font-weight: bold;">■ Curing Curve</span> &nbsp;|&nbsp; 
            <span style="color: #ef4444; font-weight: bold;">-- Design Target</span> &nbsp;|&nbsp; 
            <span style="color: #10b981; font-weight: bold;">● Current Test Point</span>
          </div>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Models hydration strength gain from day 1 to day 56. Displays the design target line (red dashed), current tested break point (green dot), and projected 28-day compliance envelope.
        </p>

        <div style="overflow-x: auto;">
          <svg id="cs-curing-svg" viewBox="0 0 800 260" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step ASTM C39 &amp; Curing Derivations
        </h3>
        <div id="cs-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating concrete compressive strength mechanics...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="cs-copy-btn" onclick="copyConcreteStrengthReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Concrete Cylinder Break Report
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Testing Errors in Concrete Compressive Strength
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The "7-Day 70% Rule" Fallacy in Supplementary Cementitious Mixes</strong>
            Tradition says concrete reaches 65% to 70% of its 28-day strength at 7 days. However, modern sustainable mixes containing 20% to 40% fly ash or ground granulated blast furnace slag (GGBFS) hydrate much more slowly. A slag mix might achieve only 45% to 55% at 7 days, causing panic and unwarranted structure rejection, but later surges to 125% of design strength at 56 days.
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Unbonded Neoprene Cap Durometer Breakdown (ASTM C1231)</strong>
            Laboratories using unbonded elastomeric neoprene pads must strictly track pad reuse counts (typically 50 to 100 breaks maximum). Overused neoprene caps develop permanent grooving and lose elasticity, creating point stress concentrations that prematurely crush cylinder edges, artificially dropping measured break strength by 10% to 15%.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Loading Rate Acceleration Distortion (ASTM C39 Speed Limit)</strong>
            ASTM C39 strictly mandates a compressive hydraulic loading rate of 28 to 42 PSI per second (0.20 to 0.30 MPa/s). Rushing tests on high-capacity hydraulic break machines by applying load at 100+ PSI/second exploits the strain-rate sensitivity of brittle concrete, artificially inflating apparent strength by 15% to 20% and masking genuinely substandard concrete.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Moisture Loss in Field-Cured Cylinders vs Lab Moist Room</strong>
            Leaving test cylinders sitting on the jobsite in direct sun or windy trailers without moisture protection causes water evaporation before initial hydration finishes. Concrete ceases strength development once internal relative humidity drops below 80%. Field-baked cylinders can test 20% to 30% lower than identical concrete cured in an ASTM C511 100% humidity fog room.
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Neglecting ASTM C42 Length-to-Diameter (L/D) Core Corrections</strong>
            Drilled structural cores rarely have an exact 2.0 L/D aspect ratio (e.g. 4" diameter core from an 5.5" slab has L/D = 1.38). Shorter cores experience restraint from testing machine platens, which artificially elevates break strength. ASTM C42 mandates applying explicit multiplication correction factors (e.g. 0.94 for L/D 1.50, 0.87 for L/D 1.00) before certifying structural adequacy.
          </div>
        </div>
      </div>
    </div>

    <script>
      function updateCylinderSize() {
        calcConcreteStrength();
      }

      function syncAgeSlider(val) {
        document.getElementById('cs-age-val').value = val;
        calcConcreteStrength();
      }

      function syncAgeInput(val) {
        var n = parseInt(val, 10);
        if (!isNaN(n)) {
          document.getElementById('cs-age-slider').value = Math.min(56, Math.max(1, n));
        }
        calcConcreteStrength();
      }

      function calcConcreteStrength() {
        var sz = document.getElementById('cs-cyl-size').value;
        var loadRaw = parseFloat(document.getElementById('cs-break-load').value) || 115000;
        var loadUnit = document.getElementById('cs-load-unit').value;
        var age = parseInt(document.getElementById('cs-age-val').value, 10) || 7;
        var targetDesign = parseFloat(document.getElementById('cs-design-fc').value) || 4000;
        var mixType = document.getElementById('cs-cement-type').value;
        var ldRatio = parseFloat(document.getElementById('cs-ld-ratio').value) || 2.0;

        // Convert load to lbf (pounds-force)
        var loadLbf = loadRaw;
        if (loadUnit === 'kn') loadLbf = loadRaw * 224.809;
        else if (loadUnit === 'kip') loadLbf = loadRaw * 1000;

        // Determine cross-sectional area (sq in)
        var areaSqIn = 28.274; // default 6x12 (pi * 3^2)
        if (sz === '4x8') areaSqIn = 12.566;
        else if (sz === '3x6') areaSqIn = 7.069;
        else if (sz === '150x300') areaSqIn = 27.39; // 17671 mm2 -> in2
        else if (sz === '100x200') areaSqIn = 12.17; // 7854 mm2 -> in2

        // Raw Compressive Strength
        var rawPsi = loadLbf / areaSqIn;

        // ASTM C42 L/D Core Correction Factor
        var ldFactor = 1.0;
        if (ldRatio < 1.94) {
          // Linear interpolation between standard ASTM C42 factors:
          // 1.75 -> 0.98; 1.50 -> 0.96; 1.25 -> 0.93; 1.00 -> 0.87
          if (ldRatio >= 1.75) ldFactor = 0.98 + (ldRatio - 1.75) * (0.02 / 0.25);
          else if (ldRatio >= 1.50) ldFactor = 0.96 + (ldRatio - 1.50) * (0.02 / 0.25);
          else if (ldRatio >= 1.25) ldFactor = 0.93 + (ldRatio - 1.25) * (0.03 / 0.25);
          else ldFactor = 0.87 + (ldRatio - 1.00) * (0.06 / 0.25);
        }
        var curPsi = rawPsi * ldFactor;
        var curMpa = curPsi * 0.00689476;

        // ACI 209R Curing Hydration Model: f'(t) = f'(28) * [t / (a + b*t)]
        // Type I: a = 4.0, b = 0.85
        // Type III: a = 2.3, b = 0.92
        // Fly ash / Slag: a = 6.0, b = 0.78
        var aParam = 4.0, bParam = 0.85;
        if (mixType === 'type3') { aParam = 2.3; bParam = 0.92; }
        else if (mixType === 'flyash') { aParam = 6.0; bParam = 0.78; }

        var curFrac28 = age / (aParam + bParam * age);
        var norm28Frac = 28 / (aParam + bParam * 28);
        var relRatio = curFrac28 / norm28Frac; // fraction of 28-day strength at current age

        var proj28Psi = curPsi / relRatio;
        var proj28Mpa = proj28Psi * 0.00689476;

        // Compliance Ratio
        var targetPct = (proj28Psi / targetDesign) * 100;

        // Estimated w/c ratio via Abrams' Law approximation: f'c = 14000 / 7^(1.5*wc)
        // wc approx = (ln(14000 / proj28Psi) / ln(7)) / 1.5
        var wcEstimate = 0.45;
        if (proj28Psi > 1000 && proj28Psi < 12000) {
          wcEstimate = (Math.log(14000 / proj28Psi) / Math.log(7)) / 1.5;
          wcEstimate = Math.max(0.30, Math.min(0.75, wcEstimate));
        }

        // Update KPIs
        document.getElementById('cs-res-cur-psi').textContent = Math.round(curPsi).toLocaleString() + ' PSI';
        document.getElementById('cs-res-cur-mpa').textContent = curMpa.toFixed(2) + ' MPa (Day ' + age + ' Break)';

        document.getElementById('cs-res-proj-28').textContent = Math.round(proj28Psi).toLocaleString() + ' PSI';
        document.getElementById('cs-res-proj-mpa').textContent = proj28Mpa.toFixed(2) + ' MPa (ACI 209R Model)';

        document.getElementById('cs-res-target-pct').textContent = targetPct.toFixed(1) + '%';
        var compSub = document.getElementById('cs-res-compliance-sub');
        if (targetPct >= 100) {
          compSub.textContent = 'PASSED (Exceeds ' + Math.round(targetDesign).toLocaleString() + ' Target)';
          compSub.style.color = '#10b981';
        } else if (targetPct >= 85) {
          compSub.textContent = 'MARGINAL (' + (100 - targetPct).toFixed(1) + '% Below Target)';
          compSub.style.color = '#f59e0b';
        } else {
          compSub.textContent = 'DEFICIENT SPECIMEN (Structural Review)';
          compSub.style.color = '#ef4444';
        }

        document.getElementById('cs-res-wc-ratio').textContent = wcEstimate.toFixed(2) + ' w/c';

        // Derivations Box
        var dBox = document.getElementById('cs-derivation-box');
        dBox.innerHTML = '<strong>1. Raw Tested Stress (ASTM C39):</strong><br>' +
          '• σ_raw = Maximum Load / Area = ' + Math.round(loadLbf).toLocaleString() + ' lbf / ' + areaSqIn.toFixed(3) + ' in² = <strong>' + Math.round(rawPsi).toLocaleString() + ' PSI</strong>.<br>' +
          (ldFactor < 1.0 ? '<strong>2. ASTM C42 Core L/D Correction:</strong><br>• L/D ratio is ' + ldRatio.toFixed(2) + ' &rarr; Correction factor = ' + ldFactor.toFixed(3) + ' &rarr; Corrected σ = <strong>' + Math.round(curPsi).toLocaleString() + ' PSI</strong>.<br>' : '') +
          '<strong>3. ACI 209R Hydration Age Factor:</strong><br>' +
          '• At Day ' + age + ', mix develops <strong>' + (relRatio * 100).toFixed(1) + '%</strong> of standard 28-day strength.<br>' +
          '<strong>4. Projected 28-Day Strength:</strong><br>' +
          '• f\\\'c(28) = ' + Math.round(curPsi).toLocaleString() + ' PSI / ' + relRatio.toFixed(3) + ' = <strong>' + Math.round(proj28Psi).toLocaleString() + ' PSI</strong> (' + proj28Mpa.toFixed(2) + ' MPa).<br>' +
          '<strong>5. Design Target Ratio:</strong><br>' +
          '• ' + Math.round(proj28Psi).toLocaleString() + ' PSI / ' + targetDesign + ' PSI specified = <strong>' + targetPct.toFixed(1) + '%</strong> compliance.';

        renderCuringCurveSvg(curPsi, proj28Psi, age, targetDesign, aParam, bParam);
      }

      function renderCuringCurveSvg(curPsi, proj28, curAge, targetDesign, a, b) {
        var svg = document.getElementById('cs-curing-svg');
        if (!svg) return;

        var w = 800, h = 260;
        var padL = 65, padR = 40, padT = 30, padB = 40;
        var plotW = w - padL - padR;
        var plotH = h - padT - padB;

        var maxDays = 56;
        var maxY = Math.max(targetDesign * 1.3, proj28 * 1.2);

        var svgHtml = '';

        // Axes
        svgHtml += '<line x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (padL + plotW) + '" y2="' + (padT + plotH) + '" stroke="var(--border)" stroke-width="2" />';
        svgHtml += '<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + plotH) + '" stroke="var(--border)" stroke-width="2" />';

        // Design Target Line (Red Dashed)
        var targetYPx = padT + plotH - (targetDesign / maxY) * plotH;
        svgHtml += '<line x1="' + padL + '" y1="' + targetYPx + '" x2="' + (padL + plotW) + '" y2="' + targetYPx + '" stroke="#ef4444" stroke-width="2" stroke-dasharray="6,4" />';
        svgHtml += '<text x="' + (padL + plotW - 10) + '" y="' + (targetYPx - 8) + '" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="end">Target f\'c = ' + Math.round(targetDesign).toLocaleString() + ' PSI</text>';

        // Curing Curve Path
        var pts = [];
        var norm28 = 28 / (a + b * 28);
        for (var d = 1; d <= maxDays; d++) {
          var frac = (d / (a + b * d)) / norm28;
          var str = proj28 * frac;
          var x = padL + (d / maxDays) * plotW;
          var y = padT + plotH - (str / maxY) * plotH;
          pts.push(x.toFixed(1) + ',' + y.toFixed(1));
        }
        svgHtml += '<path d="M ' + pts.join(' L ') + '" fill="none" stroke="#3b82f6" stroke-width="3" />';

        // Current Tested Dot
        if (curAge <= maxDays) {
          var curX = padL + (curAge / maxDays) * plotW;
          var curY = padT + plotH - (curPsi / maxY) * plotH;
          svgHtml += '<circle cx="' + curX + '" cy="' + curY + '" r="6" fill="#10b981" />';
          svgHtml += '<line x1="' + curX + '" y1="' + curY + '" x2="' + curX + '" y2="' + (padT + plotH) + '" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3" />';
          svgHtml += '<text x="' + curX + '" y="' + (curY - 12) + '" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">Day ' + curAge + ' Break (' + Math.round(curPsi) + ' PSI)</text>';
        }

        // Ticks
        var dayTicks = [7, 14, 28, 56];
        dayTicks.forEach(function(dt) {
          var tx = padL + (dt / maxDays) * plotW;
          svgHtml += '<text x="' + tx + '" y="' + (padT + plotH + 18) + '" fill="var(--text-muted)" font-size="10.5" text-anchor="middle">Day ' + dt + '</text>';
        });
        svgHtml += '<text x="' + (padL - 10) + '" y="' + (padT + 12) + '" fill="var(--fg)" font-size="11" font-weight="bold" text-anchor="end">Strength (PSI)</text>';

        svg.innerHTML = svgHtml;
      }

      function copyConcreteStrengthReport(btn) {
        var cur = document.getElementById('cs-res-cur-psi').textContent;
        var curMpa = document.getElementById('cs-res-cur-mpa').textContent;
        var p28 = document.getElementById('cs-res-proj-28').textContent;
        var p28Mpa = document.getElementById('cs-res-proj-mpa').textContent;
        var target = document.getElementById('cs-res-target-pct').textContent;
        var comp = document.getElementById('cs-res-compliance-sub').textContent;
        var age = document.getElementById('cs-age-val').value;
        var load = document.getElementById('cs-break-load').value;

        var text = '🏗️ CONCRETE COMPRESSIVE STRENGTH CYLINDER REPORT\\n' +
          '====================================================\\n' +
          '• Specimen Age at Break: Day ' + age + '\\n' +
          '• Ultimate Break Load: ' + parseFloat(load).toLocaleString() + ' lbs\\n' +
          '• Tested Strength: ' + cur + ' (' + curMpa + ')\\n' +
          '• Projected 28-Day Strength: ' + p28 + ' (' + p28Mpa + ')\\n' +
          '• Target Design Status: ' + target + ' — ' + comp + '\\n' +
          '----------------------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/concrete-compressive-strength-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Break Report Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcConcreteStrength);
      } else {
        calcConcreteStrength();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'concrete-compressive-strength-calculator.html'), renderTradePage({
    title: "Concrete Compressive Strength & 28-Day Cylinder Break Calculator (ASTM C39) | Digital Tools Shed",
    metaDesc: "Calculate concrete compressive strength in PSI and MPa, project 28-day strength from 7-day cylinder breaks using ACI 209R, and verify ASTM C39 compliance.",
    canonical: `${DOMAIN}/calc/concrete-compressive-strength-calculator`,
    bodyContent: concreteStrengthBody,
    currentPath: '/calc/concrete-compressive-strength-calculator',
    faq: [
      {
        "q": "What percentage of 28-day strength should concrete reach at 7 days?",
        "a": "Standard Type I Portland cement concrete typically achieves approximately 65% to 70% of its specified 28-day design compressive strength at 7 days. High-early-strength Type III cement can reach 80% to 90% at 7 days, while blended mixes with high fly ash or slag content may only reach 50% to 55% at 7 days."
      },
      {
        "q": "How do you calculate concrete compressive strength from a cylinder break test?",
        "a": "Compressive strength is calculated by dividing the maximum failure load by the cross-sectional area of the cylinder: f'c = P / A. For a standard 6-inch by 12-inch cylinder (area = 28.27 in²), a failure load of 113,000 lbs produces exactly 4,000 PSI (27.6 MPa)."
      },
      {
        "q": "What is the difference between testing 4x8 and 6x12 concrete cylinders?",
        "a": "Both 4x8 and 6x12 cylinders are approved under ASTM C39 for concrete with maximum aggregate size up to 1 inch. 4x8 cylinders are lighter and easier to transport, but exhibit slightly higher testing variability (+2% to +3% strength) due to edge boundary effects."
      },
      {
        "q": "How does core length-to-diameter (L/D) ratio affect measured concrete strength?",
        "a": "According to ASTM C42, drilled cores with an L/D ratio less than 1.94 experience platen restraint friction that artificially inflates measured strength. Cores must be corrected using ASTM multiplication factors (e.g. 0.98 for L/D 1.75, 0.96 for L/D 1.50, and 0.87 for L/D 1.00)."
      },
      {
        "q": "What is Abrams' Law relating water-cement ratio to concrete strength?",
        "a": "Abrams' Law states that concrete compressive strength is inversely proportional to the water-cementitious materials ratio (w/c): lower water content yields higher strength and lower permeability, provided the concrete is fully consolidated without voids."
      }
    ]
  }));



  // ─────────────────────────────────────────────────────────────────────────────
  // 27. ELECTRICAL CONDUIT FILL & JAM RATIO CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const conduitFillBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Conduit Fill Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">National Electrical Code (NEC)</span>
          <span class="badge badge-green">Chapter 9 Table 1 &amp; 4</span>
          <span class="badge badge-blue">3-Conductor Jam Ratio</span>
        </div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem; color: var(--fg);">
          Electrical Conduit Fill &amp; Jam Ratio Calculator
        </h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Calculate allowable wire capacity and conduit percentage fill across EMT, PVC Schedule 40/80, RMC, and FMC under NEC 2023/2026 standards (53% for 1 wire, 31% for 2 wires, 40% for 3+ wires). Includes mixed wire gauge summing and the critical 3-conductor Jam Ratio (1.05 to 1.30 danger zone).
        </p>
      </header>

      <!-- MAIN INPUT BOX -->
      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.75rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Conduit Raceway Type:</label>
            <select id="cf-conduit-type" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcConduitFill()">
              <option value="emt" selected>EMT (Electrical Metallic Tubing)</option>
              <option value="pvc40">PVC Schedule 40 (Rigid Nonmetallic)</option>
              <option value="pvc80">PVC Schedule 80 (Heavy Wall Nonmetallic)</option>
              <option value="rmc">RMC (Rigid Metal Conduit)</option>
              <option value="fmc">FMC (Flexible Metal Conduit)</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Trade Size of Conduit:</label>
            <select id="cf-conduit-size" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcConduitFill()">
              <option value="0.5">1/2" Trade Size</option>
              <option value="0.75" selected>3/4" Trade Size</option>
              <option value="1.0">1" Trade Size</option>
              <option value="1.25">1-1/4" Trade Size</option>
              <option value="1.5">1-1/2" Trade Size</option>
              <option value="2.0">2" Trade Size</option>
              <option value="2.5">2-1/2" Trade Size</option>
              <option value="3.0">3" Trade Size</option>
              <option value="4.0">4" Trade Size</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Conductor Insulation Type:</label>
            <select id="cf-wire-type" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcConduitFill()">
              <option value="thhn" selected>THHN / THWN / THWN-2 (Standard Compact)</option>
              <option value="xhhw">XHHW / XHHW-2 (Cross-linked Polyethylene)</option>
              <option value="use">USE-2 / RHW-2 (Thick Insulation)</option>
              <option value="bare">Bare Copper Grounding Conductor</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Primary Wire Gauge (AWG/kcmil):</label>
            <select id="cf-wire-gauge" style="width: 100%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.95rem;" onchange="calcConduitFill()">
              <option value="14">#14 AWG (15A Circuit)</option>
              <option value="12" selected>#12 AWG (20A Circuit)</option>
              <option value="10">#10 AWG (30A Circuit)</option>
              <option value="8">#8 AWG (40A-50A Circuit)</option>
              <option value="6">#6 AWG (60A Circuit)</option>
              <option value="4">#4 AWG (70A-85A Feeder)</option>
              <option value="3">#3 AWG (100A Feeder)</option>
              <option value="2">#2 AWG (115A Feeder)</option>
              <option value="1">#1 AWG (130A Feeder)</option>
              <option value="1/0">1/0 AWG (150A Service)</option>
              <option value="2/0">2/0 AWG (175A Service)</option>
              <option value="3/0">3/0 AWG (200A Service)</option>
              <option value="4/0">4/0 AWG (225A Service)</option>
              <option value="250">250 kcmil</option>
              <option value="350">350 kcmil</option>
              <option value="500">500 kcmil</option>
            </select>
          </div>
        </div>

        <!-- WIRE COUNTS & SECONDARY GROUND WIRE -->
        <div style="border-top: 1px solid var(--border); padding-top: 1.25rem; margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Number of Primary Conductors:</label>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <input type="range" id="cf-wire-count-slider" min="1" max="24" value="4" step="1" style="flex: 1; cursor: pointer;" oninput="syncWireSlider(this.value)" />
              <input type="number" id="cf-wire-count" value="4" min="1" max="50" step="1" style="width: 65px; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.1rem; text-align: center;" oninput="syncWireInput(this.value)" />
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">Equipment Grounding Wire:</label>
            <div style="display: flex; gap: 0.5rem;">
              <select id="cf-ground-gauge" style="width: 60%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcConduitFill()">
                <option value="none">None / Conduit is Ground</option>
                <option value="12" selected>1× #12 AWG Ground</option>
                <option value="10">1× #10 AWG Ground</option>
                <option value="8">1× #8 AWG Ground</option>
                <option value="6">1× #6 AWG Ground</option>
              </select>
              <select id="cf-ground-type" style="width: 40%; padding: 0.6rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; font-family: var(--sans); font-size: 0.85rem;" onchange="calcConduitFill()">
                <option value="insulated" selected>THHN</option>
                <option value="bare">Bare Cu</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.85rem; font-weight: bold; margin-bottom: 0.4rem;">NEC Max Fill Allowed:</label>
            <div id="cf-max-fill-allowed" style="padding: 0.6rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; font-family: var(--mono); font-size: 1.05rem; font-weight: bold; color: var(--fg);">
              40% (3+ Conductors)
            </div>
          </div>
        </div>

        <!-- MAIN KPI RESULT CARDS -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #10b981;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Current Conduit Fill</div>
            <div id="cf-res-fill-pct" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #10b981; margin-bottom: 0.2rem;">12.3%</div>
            <div id="cf-res-fill-status" style="font-size: 0.85rem; color: #10b981; font-weight: bold;">NEC COMPLIANT (Passes 40% Max)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #3b82f6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Total Wire Area vs Allowed</div>
            <div id="cf-res-wire-area" style="font-family: var(--mono); font-size: 2.0rem; font-weight: bold; color: #3b82f6; margin-bottom: 0.2rem;">0.0665 in²</div>
            <div id="cf-res-area-allowed" style="font-size: 0.85rem; color: var(--text-muted);">Max Allowed: 0.213 in² (40%)</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #f59e0b;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Max Additional Wires</div>
            <div id="cf-res-extra-wires" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin-bottom: 0.2rem;">+11 Wires</div>
            <div id="cf-res-max-total" style="font-size: 0.85rem; color: var(--text-muted);">Capacity: 16 total #12 THHN</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; text-align: center; border-top: 4px solid #8b5cf6;">
            <div style="font-family: var(--mono); font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.3rem;">Jam Ratio (3-Wire Pull)</div>
            <div id="cf-res-jam-ratio" style="font-family: var(--mono); font-size: 2.0rem; font-weight: bold; color: #8b5cf6; margin-bottom: 0.2rem;">6.32</div>
            <div id="cf-res-jam-status" style="font-size: 0.85rem; color: #10b981; font-weight: bold;">Safe Clearance (&gt; 1.30)</div>
          </div>
        </div>

        <!-- RACEWAY DETAILS STRIP -->
        <div style="margin-top: 1.25rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-family: var(--mono); font-size: 0.85rem;">
          <div>Conduit ID: <strong id="cf-res-conduit-id" style="color: var(--fg);">0.824 in</strong></div>
          <div>Total Conduit Area: <strong id="cf-res-conduit-total-area" style="color: var(--fg);">0.533 in²</strong></div>
          <div>Single Wire OD: <strong id="cf-res-wire-od" style="color: var(--fg);">0.130 in</strong></div>
          <div>Single Wire Area: <strong id="cf-res-single-area" style="color: #3b82f6;">0.0133 in²</strong></div>
        </div>
      </div>

      <!-- INTERACTIVE CONDUIT CROSS-SECTION SVG -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h2 style="font-family: var(--serif); font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--fg);">
          🔌 Visual Conduit Cross-Section &amp; Fill Capacity
        </h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Vector schematic illustrating conduit boundary, conductor bundle cross-sectional distribution, and 40% NEC safety margin threshold.
        </p>

        <div style="overflow-x: auto;">
          <svg id="cf-conduit-svg" viewBox="0 0 800 240" style="width: 100%; height: auto; min-width: 600px; font-family: var(--mono);"></svg>
        </div>
      </div>

      <!-- STEP-BY-STEP MATHEMATICAL DERIVATION -->
      <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--mono); font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted); margin: 0 0 0.75rem 0;">
          📐 Step-by-Step NEC Chapter 9 Calculations
        </h3>
        <div id="cf-derivation-box" style="font-family: var(--mono); font-size: 0.85rem; line-height: 1.7; color: var(--fg);">
          Calculating raceway fill and cross-sectional areas...
        </div>
      </div>

      <!-- ONE-CLICK COPY BUTTON -->
      <div style="margin-bottom: 2.5rem;">
        <button type="button" id="cf-copy-btn" onclick="copyConduitReport(this)" class="btn btn-copy" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; font-weight: 600; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; color: var(--fg); transition: all 0.15s ease;">
          <span>📋</span> Copy Conduit Fill &amp; Jam Ratio Takeoff
        </button>
      </div>

      <!-- 5 FATAL TRAPS -->
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.45rem; margin-bottom: 0.75rem; color: var(--fg);">
          ⚠️ 5 Fatal Traps &amp; Code Violations in Conduit Fill &amp; Wire Pulling
        </h2>
        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444;">
            <strong style="color: #ef4444;">1. The 3-Conductor "Jam Ratio" Wedge Trap (1.05 to 1.30 Danger Zone)</strong>
            When pulling exactly 3 conductors into a conduit, if the ratio of conduit inside diameter to conductor outside diameter (D / d) falls between 1.05 and 1.30, the conductors will inevitably wedge themselves side-by-side across the apex of a bend. The wedge locks solidly inside the raceway, causing pulling tension to spike exponentially until the winch rope snaps or the conductor insulation tears open.
          </div>
          <div class="trap-card" style="border-left: 4px solid #f59e0b;">
            <strong style="color: #f59e0b;">2. Schedule 80 PVC Internal Diameter Reduction Trap</strong>
            Contractors installing exposed PVC risers subject to physical damage must use Schedule 80 PVC per NEC 352.10(F). However, Schedule 80 has much thicker walls, reducing internal diameter by 10% to 15% compared to Schedule 40 or EMT. A 2-inch EMT holds up to 26 #10 THHN wires; 2-inch Schedule 80 holds only 19. Sizing Schedule 80 using standard EMT tables results in instant inspection red-tags.
          </div>
          <div class="trap-card" style="border-left: 4px solid #10b981;">
            <strong style="color: #10b981;">3. Ignoring Ground Wire in Total Cross-Sectional Area</strong>
            A widespread myth among residential apprentices claims that the Equipment Grounding Conductor (EGC) does not count toward conduit fill because it carries no continuous operating current. Under NEC Chapter 9, Note 1, ALL conductors (including bare or insulated grounding wires) MUST be included in the total cross-sectional area calculation without exception.
          </div>
          <div class="trap-card" style="border-left: 4px solid #3b82f6;">
            <strong style="color: #3b82f6;">4. Overlooking NEC 310.15(C)(1) Ampacity Derating with 4+ Current-Carrying Wires</strong>
            While a conduit may physically accommodate up to 40% fill, bundling more than 3 current-carrying conductors in the same raceway triggers mandatory ampacity derating: 4–6 wires must be derated to 80%, 7–9 wires to 70%, and 10–20 wires down to 50%! Filling a 3/4" pipe with twelve #12 THHN wires derates their allowable ampacity from 30A down to only 15A.
          </div>
          <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
            <strong style="color: #8b5cf6;">5. Exceeding 360 Degrees of Total Bends Between Pull Points</strong>
            NEC 358.26 (and matching sections for PVC and RMC) strictly mandates that the total sum of bends between pull points (pull boxes, conduit bodies, or panels) cannot exceed 360 degrees (four 90° bends). Exceeding 360° crushes cables against the conduit sidewall during pulling, causing dielectric insulation breakdown and catastrophic ground faults when energized.
          </div>
        </div>
      </div>
    </div>

    <script>
      // NEC Chapter 9 Table 4 Internal Diameters (Inches)
      var CONDUIT_DATA = {
        emt: { "0.5": 0.622, "0.75": 0.824, "1.0": 1.049, "1.25": 1.380, "1.5": 1.610, "2.0": 2.067, "2.5": 2.731, "3.0": 3.356, "4.0": 4.310 },
        pvc40: { "0.5": 0.602, "0.75": 0.804, "1.0": 1.029, "1.25": 1.360, "1.5": 1.590, "2.0": 2.047, "2.5": 2.445, "3.0": 3.042, "4.0": 3.998 },
        pvc80: { "0.5": 0.526, "0.75": 0.722, "1.0": 0.936, "1.25": 1.255, "1.5": 1.476, "2.0": 1.913, "2.5": 2.290, "3.0": 2.864, "4.0": 3.786 },
        rmc: { "0.5": 0.632, "0.75": 0.836, "1.0": 1.063, "1.25": 1.394, "1.5": 1.624, "2.0": 2.083, "2.5": 2.489, "3.0": 3.090, "4.0": 4.050 },
        fmc: { "0.5": 0.625, "0.75": 0.812, "1.0": 1.000, "1.25": 1.250, "1.5": 1.500, "2.0": 2.000, "2.5": 2.500, "3.0": 3.000, "4.0": 4.000 }
      };

      // NEC Chapter 9 Table 5 Conductor Areas (sq inches) & OD (inches)
      var WIRE_DATA = {
        thhn: {
          "14": { area: 0.0097, od: 0.111 }, "12": { area: 0.0133, od: 0.130 }, "10": { area: 0.0211, od: 0.164 },
          "8": { area: 0.0366, od: 0.216 }, "6": { area: 0.0507, od: 0.254 }, "4": { area: 0.0824, od: 0.324 },
          "3": { area: 0.0973, od: 0.352 }, "2": { area: 0.1158, od: 0.384 }, "1": { area: 0.1562, od: 0.446 },
          "1/0": { area: 0.1855, od: 0.486 }, "2/0": { area: 0.2223, od: 0.532 }, "3/0": { area: 0.2679, od: 0.584 },
          "4/0": { area: 0.3237, od: 0.642 }, "250": { area: 0.3970, od: 0.711 }, "350": { area: 0.5242, od: 0.817 },
          "500": { area: 0.7073, od: 0.949 }
        },
        xhhw: {
          "14": { area: 0.0139, od: 0.133 }, "12": { area: 0.0181, od: 0.152 }, "10": { area: 0.0243, od: 0.176 },
          "8": { area: 0.0437, od: 0.236 }, "6": { area: 0.0590, od: 0.274 }, "4": { area: 0.0814, od: 0.322 },
          "3": { area: 0.0962, od: 0.350 }, "2": { area: 0.1146, od: 0.382 }, "1": { area: 0.1534, od: 0.442 },
          "1/0": { area: 0.1825, od: 0.482 }, "2/0": { area: 0.2190, od: 0.528 }, "3/0": { area: 0.2642, od: 0.580 },
          "4/0": { area: 0.3197, od: 0.638 }, "250": { area: 0.3904, od: 0.705 }, "350": { area: 0.5166, od: 0.811 },
          "500": { area: 0.6984, od: 0.943 }
        },
        use: {
          "14": { area: 0.0206, od: 0.162 }, "12": { area: 0.0260, od: 0.182 }, "10": { area: 0.0333, od: 0.206 },
          "8": { area: 0.0556, od: 0.266 }, "6": { area: 0.0735, od: 0.306 }, "4": { area: 0.0984, od: 0.354 },
          "3": { area: 0.1146, od: 0.382 }, "2": { area: 0.1346, od: 0.414 }, "1": { area: 0.1840, od: 0.484 },
          "1/0": { area: 0.2156, od: 0.524 }, "2/0": { area: 0.2552, od: 0.570 }, "3/0": { area: 0.3039, od: 0.622 },
          "4/0": { area: 0.3632, od: 0.680 }, "250": { area: 0.4477, od: 0.755 }, "350": { area: 0.5782, od: 0.858 },
          "500": { area: 0.7713, od: 0.991 }
        },
        bare: {
          "14": { area: 0.0032, od: 0.064 }, "12": { area: 0.0051, od: 0.081 }, "10": { area: 0.0082, od: 0.102 },
          "8": { area: 0.0130, od: 0.129 }, "6": { area: 0.0270, od: 0.185 }, "4": { area: 0.0420, od: 0.232 },
          "3": { area: 0.0530, od: 0.260 }, "2": { area: 0.0670, od: 0.292 }, "1": { area: 0.0850, od: 0.328 },
          "1/0": { area: 0.1090, od: 0.372 }, "2/0": { area: 0.1370, od: 0.418 }, "3/0": { area: 0.1730, od: 0.470 },
          "4/0": { area: 0.2190, od: 0.528 }, "250": { area: 0.2600, od: 0.575 }, "350": { area: 0.3640, od: 0.681 },
          "500": { area: 0.5180, od: 0.813 }
        }
      };

      function syncWireSlider(val) {
        document.getElementById('cf-wire-count').value = val;
        calcConduitFill();
      }

      function syncWireInput(val) {
        var n = parseInt(val, 10);
        if (!isNaN(n)) {
          document.getElementById('cf-wire-count-slider').value = Math.min(24, Math.max(1, n));
        }
        calcConduitFill();
      }

      function calcConduitFill() {
        var cType = document.getElementById('cf-conduit-type').value;
        var cSize = document.getElementById('cf-conduit-size').value;
        var wType = document.getElementById('cf-wire-type').value;
        var wGauge = document.getElementById('cf-wire-gauge').value;
        var wCount = parseInt(document.getElementById('cf-wire-count').value, 10) || 1;
        var gGauge = document.getElementById('cf-ground-gauge').value;
        var gType = document.getElementById('cf-ground-type').value;

        // Lookup Conduit ID
        var cId = (CONDUIT_DATA[cType] && CONDUIT_DATA[cType][cSize]) || 0.824;
        var conduitTotalArea = (Math.PI * Math.pow(cId, 2)) / 4;

        // Lookup Primary Wire Area and OD
        var wObj = (WIRE_DATA[wType] && WIRE_DATA[wType][wGauge]) || { area: 0.0133, od: 0.130 };
        var primaryTotalArea = wObj.area * wCount;

        // Ground wire calculation
        var groundArea = 0;
        var totalConductorCount = wCount;
        if (gGauge !== 'none') {
          totalConductorCount += 1;
          var gObj = (WIRE_DATA[gType === 'bare' ? 'bare' : 'thhn'] && WIRE_DATA[gType === 'bare' ? 'bare' : 'thhn'][gGauge]) || { area: 0.0133, od: 0.130 };
          groundArea = gObj.area;
        }

        var totalWireArea = primaryTotalArea + groundArea;

        // NEC Table 1 Allowable Fill %
        var maxFillPct = 40;
        if (totalConductorCount === 1) maxFillPct = 53;
        else if (totalConductorCount === 2) maxFillPct = 31;
        else maxFillPct = 40;

        document.getElementById('cf-max-fill-allowed').textContent = maxFillPct + '% (' + totalConductorCount + ' Conductor' + (totalConductorCount !== 1 ? 's' : '') + ')';

        var allowedArea = conduitTotalArea * (maxFillPct / 100);
        var currentFillPct = (totalWireArea / conduitTotalArea) * 100;

        // Max Additional Wires of primary type
        var remainArea = allowedArea - totalWireArea;
        var extraWires = Math.floor(remainArea / wObj.area);
        var maxTotalWires = Math.floor(allowedArea / wObj.area);

        // Jam Ratio: D / d
        var jamRatio = cId / wObj.od;

        // Update KPIs
        document.getElementById('cf-res-fill-pct').textContent = currentFillPct.toFixed(1) + '%';
        var statusEl = document.getElementById('cf-res-fill-status');
        if (currentFillPct <= maxFillPct) {
          statusEl.textContent = 'NEC COMPLIANT (Passes ' + maxFillPct + '% Max)';
          statusEl.style.color = '#10b981';
        } else {
          statusEl.textContent = 'VIOLATION (' + (currentFillPct - maxFillPct).toFixed(1) + '% Over Limit)';
          statusEl.style.color = '#ef4444';
        }

        document.getElementById('cf-res-wire-area').textContent = totalWireArea.toFixed(4) + ' in²';
        document.getElementById('cf-res-area-allowed').textContent = 'Max Allowed: ' + allowedArea.toFixed(4) + ' in² (' + maxFillPct + '%)';

        document.getElementById('cf-res-extra-wires').textContent = (extraWires >= 0 ? '+' + extraWires : extraWires) + ' Wires';
        document.getElementById('cf-res-max-total').textContent = 'Total Capacity: ' + Math.max(0, maxTotalWires) + ' wires of #' + wGauge;

        document.getElementById('cf-res-jam-ratio').textContent = jamRatio.toFixed(2);
        var jamStatusEl = document.getElementById('cf-res-jam-status');
        if (totalConductorCount === 3 && jamRatio >= 1.05 && jamRatio <= 1.30) {
          jamStatusEl.textContent = 'DANGER: CRITICAL JAM ZONE (1.05–1.30)';
          jamStatusEl.style.color = '#ef4444';
        } else if (jamRatio < 1.05) {
          jamStatusEl.textContent = 'Too Tight (<1.05)';
          jamStatusEl.style.color = '#f59e0b';
        } else {
          jamStatusEl.textContent = 'Safe Clearance (> 1.30)';
          jamStatusEl.style.color = '#10b981';
        }

        // Details Strip
        document.getElementById('cf-res-conduit-id').textContent = cId.toFixed(3) + ' in';
        document.getElementById('cf-res-conduit-total-area').textContent = conduitTotalArea.toFixed(3) + ' in²';
        document.getElementById('cf-res-wire-od').textContent = wObj.od.toFixed(3) + ' in';
        document.getElementById('cf-res-single-area').textContent = wObj.area.toFixed(4) + ' in²';

        // Derivations Box
        var dBox = document.getElementById('cf-derivation-box');
        dBox.innerHTML = '<strong>1. Total Raceway Cross-Sectional Area (NEC Chapter 9 Table 4):</strong><br>' +
          '• ' + cSize + '\\" ' + cType.toUpperCase() + ' Inside Diameter = ' + cId.toFixed(3) + ' in &rarr; Total Area = π × (' + (cId/2).toFixed(3) + ')² = <strong>' + conduitTotalArea.toFixed(4) + ' in²</strong>.<br>' +
          '<strong>2. Conductor Areas (NEC Table 5):</strong><br>' +
          '• ' + wCount + '× #' + wGauge + ' ' + wType.toUpperCase() + ' @ ' + wObj.area.toFixed(4) + ' in² = ' + primaryTotalArea.toFixed(4) + ' in²' + (groundArea > 0 ? ' + 1× ground (' + groundArea.toFixed(4) + ' in²)' : '') + ' = <strong>' + totalWireArea.toFixed(4) + ' in² total</strong>.<br>' +
          '<strong>3. NEC Table 1 Allowable Limit:</strong><br>' +
          '• For ' + totalConductorCount + ' conductors, max allowable fill is <strong>' + maxFillPct + '%</strong> (' + allowedArea.toFixed(4) + ' in²).<br>' +
          '• Current fill percentage = (' + totalWireArea.toFixed(4) + ' in² / ' + conduitTotalArea.toFixed(4) + ' in²) × 100 = <strong>' + currentFillPct.toFixed(1) + '%</strong>.<br>' +
          '<strong>4. 3-Conductor Jam Ratio Check:</strong><br>' +
          '• J = Conduit ID / Conductor OD = ' + cId.toFixed(3) + ' in / ' + wObj.od.toFixed(3) + ' in = <strong>' + jamRatio.toFixed(2) + '</strong>.<br>' +
          '• NEC Informative Annex B identifies ratios between 1.05 and 1.30 as the fatal jam zone where cables wedge in bends.';

        renderConduitSvg(cId, wObj.od, wCount, totalConductorCount, currentFillPct, maxFillPct);
      }

      function renderConduitSvg(cId, wOd, wCount, totalCount, fillPct, maxPct) {
        var svg = document.getElementById('cf-conduit-svg');
        if (!svg) return;

        var w = 800, h = 240;
        var svgHtml = '';

        // Draw Conduit Circle on Left
        var cX = 140, cY = 120, cR = 85;
        svgHtml += '<circle cx="' + cX + '" cy="' + cY + '" r="' + (cR + 8) + '" fill="#64748b" />';
        svgHtml += '<circle cx="' + cX + '" cy="' + cY + '" r="' + cR + '" fill="var(--surface-alt)" stroke="var(--border)" stroke-width="2" />';

        // Pack circles inside
        var wireR = Math.min(22, Math.max(6, (wOd / cId) * cR));
        var drawCount = Math.min(18, totalCount);

        for (var i = 0; i < drawCount; i++) {
          var angle = (i / drawCount) * 2 * Math.PI;
          var dist = drawCount === 1 ? 0 : Math.min(cR - wireR - 4, wireR * 1.6 + (i % 2) * 12);
          var wx = cX + Math.cos(angle) * dist;
          var wy = cY + Math.sin(angle) * dist;
          var color = i === (drawCount - 1) && totalCount > wCount ? '#10b981' : '#3b82f6';
          svgHtml += '<circle cx="' + wx.toFixed(1) + '" cy="' + wy.toFixed(1) + '" r="' + wireR.toFixed(1) + '" fill="' + color + '" stroke="#1e293b" stroke-width="1.5" />';
          svgHtml += '<circle cx="' + wx.toFixed(1) + '" cy="' + wy.toFixed(1) + '" r="' + (wireR * 0.45).toFixed(1) + '" fill="#f59e0b" />';
        }

        // Labels on Left
        svgHtml += '<text x="' + cX + '" y="' + (cY + cR + 25) + '" fill="var(--fg)" font-size="11" font-weight="bold" text-anchor="middle">Conduit Bore (' + cId.toFixed(3) + '\\")</text>';

        // Fill Capacity Progress Bar on Right
        var barX = 300, barY = 90, barW = 440, barH = 35;
        svgHtml += '<text x="' + barX + '" y="' + (barY - 15) + '" fill="var(--fg)" font-size="13" font-weight="bold">Conduit Cross-Sectional Fill Capacity</text>';

        // Background Track
        svgHtml += '<rect x="' + barX + '" y="' + barY + '" width="' + barW + '" height="' + barH + '" fill="var(--bg)" stroke="var(--border)" stroke-width="1.5" rx="6" />';

        // Fill Fill Bar
        var curBarW = Math.min(barW, (fillPct / 100) * barW);
        var barColor = fillPct <= maxPct ? '#10b981' : '#ef4444';
        svgHtml += '<rect x="' + barX + '" y="' + barY + '" width="' + curBarW + '" height="' + barH + '" fill="' + barColor + '" rx="5" />';

        // 40% NEC Max Line
        var maxLineX = barX + (maxPct / 100) * barW;
        svgHtml += '<line x1="' + maxLineX + '" y1="' + (barY - 8) + '" x2="' + maxLineX + '" y2="' + (barY + barH + 8) + '" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,2" />';
        svgHtml += '<text x="' + maxLineX + '" y="' + (barY + barH + 24) + '" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">NEC Limit: ' + maxPct + '%</text>';

        // Current Fill Text inside or above bar
        svgHtml += '<text x="' + (barX + 15) + '" y="' + (barY + 22) + '" fill="#ffffff" font-size="12" font-weight="bold">' + fillPct.toFixed(1) + '% Filled</text>';
        svgHtml += '<text x="' + (barX + barW) + '" y="' + (barY - 15) + '" fill="var(--text-muted)" font-size="11" text-anchor="end">100% Total Area</text>';

        svg.innerHTML = svgHtml;
      }

      function copyConduitReport(btn) {
        var pct = document.getElementById('cf-res-fill-pct').textContent;
        var status = document.getElementById('cf-res-fill-status').textContent;
        var area = document.getElementById('cf-res-wire-area').textContent;
        var allowed = document.getElementById('cf-res-area-allowed').textContent;
        var jam = document.getElementById('cf-res-jam-ratio').textContent;
        var jamStat = document.getElementById('cf-res-jam-status').textContent;
        var cType = document.getElementById('cf-conduit-type').value.toUpperCase();
        var cSize = document.getElementById('cf-conduit-size').value;

        var text = '⚡ NEC CONDUIT FILL & JAM RATIO TAKEOFF\\n' +
          '====================================================\\n' +
          '• Raceway: ' + cSize + '" ' + cType + '\\n' +
          '• Fill Percentage: ' + pct + ' — ' + status + '\\n' +
          '• Wire Area: ' + area + ' (' + allowed + ')\\n' +
          '• 3-Conductor Jam Ratio: ' + jam + ' (' + jamStat + ')\\n' +
          '• Standard Compliance: NEC Chapter 9 Table 1 & 4\\n' +
          '----------------------------------------------------\\n' +
          'Calculated via Digital Tools Shed: https://digitaltoolsshed.com/calc/conduit-fill-calculator';

        navigator.clipboard.writeText(text).then(function() {
          if (btn) {
            var orig = btn.innerHTML;
            btn.innerHTML = '<span>✓</span> Conduit Spec Copied!';
            btn.style.borderColor = '#10b981';
            btn.style.color = '#10b981';
            setTimeout(function() {
              btn.innerHTML = orig;
              btn.style.borderColor = 'var(--border)';
              btn.style.color = 'var(--fg)';
            }, 2000);
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcConduitFill);
      } else {
        calcConduitFill();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'conduit-fill-calculator.html'), renderTradePage({
    title: "Electrical Conduit Fill & Jam Ratio Calculator (NEC 2023/2026 Tables) | Digital Tools Shed",
    metaDesc: "Calculate electrical conduit fill percentage across EMT, PVC 40/80, and RMC under NEC Chapter 9 Tables 1, 4, and 5. Includes 3-conductor Jam Ratio warning.",
    canonical: `${DOMAIN}/calc/conduit-fill-calculator`,
    bodyContent: conduitFillBody,
    currentPath: '/calc/conduit-fill-calculator',
    faq: [
      {
        "q": "What is the maximum conduit fill percentage according to the NEC?",
        "a": "Under National Electrical Code (NEC) Chapter 9, Table 1: 1 conductor allows up to 53% conduit fill; 2 conductors allow up to 31% fill (to prevent twisting and binding); and 3 or more conductors allow up to 40% fill."
      },
      {
        "q": "What is the 3-conductor Jam Ratio and why is it dangerous?",
        "a": "The Jam Ratio is the ratio of conduit inside diameter to cable outside diameter (J = D / d). When pulling exactly 3 conductors into a conduit, if the ratio falls between 1.05 and 1.30, the cables will wedge side-by-side across bends, jamming solidly and tearing wire insulation."
      },
      {
        "q": "Does a bare copper ground wire count toward conduit fill?",
        "a": "Yes. According to NEC Chapter 9, Note 1, all conductors (including insulated and bare equipment grounding conductors) must be counted in the total cross-sectional area calculation when determining raceway fill."
      },
      {
        "q": "Why does Schedule 80 PVC hold fewer wires than EMT conduit?",
        "a": "Schedule 80 PVC has substantially thicker walls than EMT or Schedule 40 PVC to provide physical impact protection. Because the outside diameter remains standard, the thicker wall reduces the internal diameter (ID), decreasing available fill area by up to 25%."
      },
      {
        "q": "When does bundling wires in conduit trigger ampacity derating?",
        "a": "Under NEC 310.15(C)(1), when more than 3 current-carrying conductors are installed in the same raceway, individual conductor ampacity must be derated: 4 to 6 wires are derated to 80%, 7 to 9 wires to 70%, and 10 to 20 wires down to 50% of their table ampacity."
      }
    ]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 28. HVAC AIR DUCT SIZING & EQUAL FRICTION CFM CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const ductSizeBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; HVAC Duct Sizing Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">HVAC &amp; Mechanical Engineering</span>
          <span class="badge badge-green">ASHRAE Fundamentals &amp; SMACNA</span>
          <span class="badge badge-blue">Huebscher Equivalent Diameter</span>
        </div>
        <h1 style="font-size: 2.2rem; margin-bottom: 0.75rem; line-height: 1.2;">HVAC Air Duct Sizing &amp; CFM Velocity Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; max-width: 820px;">
          Size supply, return, and branch ducts using the industry-standard <strong>Equal Friction Method</strong> or <strong>Target Velocity Method</strong>. Accurately convert between round and rectangular duct sizes with the Huebscher equivalent diameter equation, monitor air velocity acoustic whistling limits, and detect aspect ratio pressure collapse.
        </p>
      </header>

      <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Calculation Mode</label>
            <select id="duct-calc-mode" class="input-field" style="width: 100%;" onchange="calcDuctSize()">
              <option value="equal_friction" selected>Equal Friction Method (Specify CFM &amp; Friction Rate)</option>
              <option value="target_velocity">Target Velocity Method (Specify CFM &amp; Velocity FPM)</option>
              <option value="known_size">Analyze Existing Duct (Specify Dimensions &amp; CFM)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Airflow Volume (CFM)</label>
            <input type="number" id="duct-cfm" class="input-field" value="800" min="10" max="50000" step="10" style="width: 100%;" oninput="calcDuctSize()">
            <small style="color: var(--text-muted);">Cubic Feet per Minute (e.g. 400 CFM per ton of cooling)</small>
          </div>
        </div>

        <div id="friction-controls-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
          <div id="col-friction-rate">
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Friction Loss Rate (in. w.g. / 100 ft)</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="duct-friction" class="input-field" value="0.10" min="0.01" max="1.0" step="0.01" style="width: 100%;" oninput="calcDuctSize()">
              <select id="duct-friction-preset" class="input-field" style="width: 180px;" onchange="applyFrictionPreset()">
                <option value="custom">Preset...</option>
                <option value="0.08">0.08 (Quiet Residential)</option>
                <option value="0.10" selected>0.10 (Standard ASHRAE)</option>
                <option value="0.15">0.15 (Commercial Supply)</option>
                <option value="0.05">0.05 (Low Resistance Return)</option>
              </select>
            </div>
            <small style="color: var(--text-muted);">Static pressure loss per 100 feet of equivalent straight duct</small>
          </div>
          <div id="col-target-velocity" style="display: none;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Target Air Velocity (FPM)</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="number" id="duct-target-fpm" class="input-field" value="800" min="200" max="4000" step="25" style="width: 100%;" oninput="calcDuctSize()">
              <select id="duct-velocity-preset" class="input-field" style="width: 180px;" onchange="applyVelocityPreset()">
                <option value="custom">Preset...</option>
                <option value="600">600 FPM (Branch Run)</option>
                <option value="800" selected>800 FPM (Res Trunk)</option>
                <option value="1200">1200 FPM (Comm Main)</option>
              </select>
            </div>
            <small style="color: var(--text-muted);">Feet per minute air velocity</small>
          </div>
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Rectangular Duct Constraint</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <select id="duct-constraint-type" class="input-field" style="width: 140px;" onchange="calcDuctSize()">
                <option value="height" selected>Fixed Height</option>
                <option value="width">Fixed Width</option>
              </select>
              <input type="number" id="duct-constraint-val" class="input-field" value="8" min="4" max="60" step="1" style="width: 100%;" oninput="calcDuctSize()">
              <span style="font-weight: bold;">in</span>
            </div>
            <small style="color: var(--text-muted);">Joist space limitation (e.g. 8" or 10" depth limit)</small>
          </div>
        </div>

        <!-- Diagnostic Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Equivalent Round Diameter</div>
            <div id="res-round-diam" style="font-size: 1.6rem; font-weight: 700; color: #3b82f6; margin: 0.2rem 0;">--</div>
            <div id="res-round-std" style="font-size: 0.8rem; color: var(--text-muted);">Nearest standard: --</div>
          </div>

          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Rectangular Dimensions</div>
            <div id="res-rect-size" style="font-size: 1.6rem; font-weight: 700; color: #10b981; margin: 0.2rem 0;">--</div>
            <div id="res-aspect-ratio" style="font-size: 0.8rem; color: var(--text-muted);">Aspect ratio: --</div>
          </div>

          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Airflow Velocity</div>
            <div id="res-velocity-fpm" style="font-size: 1.6rem; font-weight: 700; color: #f59e0b; margin: 0.2rem 0;">--</div>
            <div id="res-velocity-rating" style="font-size: 0.8rem; font-weight: 600;">--</div>
          </div>

          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Friction Rate</div>
            <div id="res-friction-rate" style="font-size: 1.6rem; font-weight: 700; color: #8b5cf6; margin: 0.2rem 0;">--</div>
            <div id="res-total-area" style="font-size: 0.8rem; color: var(--text-muted);">Area: -- sq ft</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
          <button id="copy-duct-summary-btn" class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem;" onclick="copyDuctSummary()">
            <span>📋</span> Copy Full HVAC Duct Sizing Report
          </button>
        </div>
      </div>

      <!-- Live Interactive SVG Visualization -->
      <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="margin-top: 0; margin-bottom: 0.5rem;">Duct Cross-Section &amp; Airflow Velocity Dynamics</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
          Visual comparison of calculated rectangular duct profile against equivalent hydraulic round diameter, with real-time acoustic velocity boundary warnings.
        </p>
        <div style="width: 100%; overflow-x: auto; background: var(--surface-bg, #0f172a); border-radius: 8px; padding: 1rem 0;">
          <svg id="duct-vis-svg" viewBox="0 0 700 320" style="width: 100%; max-width: 700px; display: block; margin: 0 auto; font-family: var(--font-sans, sans-serif);">
            <!-- Rendered dynamically in JS -->
          </svg>
        </div>
      </div>

      <!-- Live Mathematical Derivation -->
      <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem;">Live Mathematical Derivation &amp; Engineering Formulas</h3>
        <div id="duct-derivation-content" style="line-height: 1.7; font-size: 0.95rem; color: var(--text);">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- 5 Fatal Engineering Traps -->
      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">5 Fatal HVAC Duct Sizing Traps &amp; Static Pressure Pitfalls</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          Air duct systems that ignore aerodynamic principles cause high electric bills, blower motor burnout, whistling grilles, and frozen A/C coils.
        </p>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: rgba(239, 68, 68, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚠️</span> 1. The 4:1 Aspect Ratio Pressure Collapse &amp; Sheet Metal Rumble
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              Designing rectangular ducts with an aspect ratio (width to height) greater than <strong>4:1</strong> drastically multiplies wetted surface friction. A wide, shallow duct (e.g. 24" x 4") has an area of 96 sq in and a perimeter of 56 inches, whereas a square 10" x 10" duct has 100 sq in of area with only 40 inches of perimeter. The excessive flat span in high-aspect-ratio ducts creates "oil-canning"—a loud, repeating booming or popping sound every time the blower turns on and off due to pressure pulses. Keep aspect ratios below 2:1 whenever possible, and never exceed 4:1.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; display: flex; align-items: center; gap: 0.5rem;">
              <span>🔊</span> 2. Velocity Acoustic Whistling &amp; Grille Jet Noise (&gt;900 FPM Residential)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              Duct air velocity exceeding <strong>900 FPM in residential supply trunks</strong> and <strong>600 FPM in branch runs</strong> generates noticeable airborne turbulence noise. When high-velocity air impinges on stamped metal face dampers and supply grilles, it produces an annoying high-frequency whistle or persistent roaring drone (NC-35 to NC-45). If a 3-ton system (1,200 CFM) is forced into an undersized 8-inch round duct, velocity spikes to 3,437 FPM—sounding like an active jet engine in the living space.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981; background: rgba(16, 185, 129, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
              <span>🌀</span> 3. Flexible Duct Compression Drag (15% Compression = 400% Friction Spike)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              Standard duct calculators and friction charts assume smooth galvanized sheet metal. Flexible ducting features a helical wire core that creates internal spiral ribbing. According to ACCA Manual D and Texas A&amp;M laboratory research, if a flexible duct is not stretched tight with at least 4% tension, internal friction multiplies exponentially. Just <strong>15% longitudinal compression increases static pressure friction loss by over 400%</strong>. Never calculate flexible duct using smooth metal friction rates without adding a 1.5x to 2.0x size multiplier.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: rgba(59, 130, 246, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; display: flex; align-items: center; gap: 0.5rem;">
              <span>❄️</span> 4. Uninsulated Attic Duct Thermal Parasitic Loss (30% Capacity Steal)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              Installing supply ductwork in an unconditioned attic space (which reaches 140°F in summer) without R-8 minimum insulation creates massive sensible heat gain. Supply air chilled to 55°F at the evaporator coil can warm up to 66°F before reaching the furthest bedroom register. This conductive thermal gain destroys system efficiency, runs the compressor non-stop, causes condensation dripping on sheetrock ceilings ("sweating ducts"), and fosters black mold growth inside fibrous duct liners.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: rgba(139, 92, 246, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; display: flex; align-items: center; gap: 0.5rem;">
              <span>🛑</span> 5. Return Grille Face Velocity Static Starvation (&gt;300 FPM Freezes Coils)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              A system can have a perfectly sized supply trunk, but if the central return air grille is undersized, the entire HVAC unit suffocates. Filter grilles must be sized for a maximum face velocity of <strong>300 to 400 FPM</strong> (e.g., minimum 2.0 to 2.5 sq ft of filter grille per ton of cooling). When homeowners install high-MERV (MERV 11 to 13) 1-inch filters into undersized return grilles, total external static pressure (TESP) shoots above 0.8 in. w.g., drastically dropping CFM across the indoor cooling coil and causing the refrigerant coil to freeze into a solid block of ice.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <section class="faq-section" style="margin-top: 2rem;">
        <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">Frequently Asked Questions: HVAC Duct Sizing</h2>
        <div class="faq-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">How many CFM of airflow are required per ton of air conditioning?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              Standard residential air conditioning systems require approximately <strong>400 CFM per ton</strong> (12,000 BTU/hr) of nominal cooling capacity under standard humidity conditions. In hot, humid climates (like the US Southeast), systems are frequently configured for 350 CFM per ton to enhance latent dehumidification. In arid desert climates, airflow may be elevated to 425–450 CFM per ton to maximize sensible cooling capacity.
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">What is the standard friction rate used in residential duct sizing?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              The standard rule-of-thumb friction rate is <strong>0.10 inches of water column (in. w.g.) per 100 feet</strong> of equivalent length for supply ducts, and <strong>0.08 in. w.g. / 100 ft</strong> for return ducts. However, ACCA Manual D requires calculating the actual Available Static Pressure (ASP) divided by Total Equivalent Length (TEL) to derive the precise design friction rate, which often falls between 0.06 and 0.08 in. w.g. / 100 ft in systems with restrictive high-efficiency filters and secondary coils.
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">How is equivalent round diameter converted to rectangular duct dimensions?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              The conversion uses the <strong>Huebscher equation</strong>: <code>D_e = 1.30 * (a * b)^0.625 / (a + b)^0.25</code>, where <em>a</em> and <em>b</em> are the rectangular width and height, and <em>D_e</em> is the circular diameter that yields identical friction loss at equal airflow. Because rectangular ducts possess greater surface area per unit volume, a rectangular duct must have a larger cross-sectional area than a round duct to carry identical CFM at the same static pressure drop.
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">Why is round ductwork superior to rectangular ductwork?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              A circle provides the maximum cross-sectional area with the minimum perimeter, minimizing surface boundary layer friction. Spiral round metal pipe contains internal pressure more effectively without flexing, creates no high-resistance 90-degree internal corner vortices, and uses 20% to 30% less sheet metal by weight compared to rectangular ducting for identical airflow capacity. Rectangular ducts are primarily used when ceiling joist height or vertical wall studs physically restrict vertical clearance.
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">What maximum air velocity should be allowed in residential ductwork?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              Under ASHRAE and SMACNA acoustic design standards: residential main supply trunks should not exceed <strong>700 to 900 FPM</strong>; branch supply runs should stay below <strong>500 to 600 FPM</strong>; and central return ducts should stay below <strong>600 to 700 FPM</strong>. Velocities exceeding 1,000 FPM create turbulent rushing noise and register whistling that transmits into bedrooms and living spaces.
            </div>
          </details>
        </div>
      </section>
    </div>

    <script>
      function applyFrictionPreset() {
        var p = document.getElementById('duct-friction-preset').value;
        if (p !== 'custom') {
          document.getElementById('duct-friction').value = p;
          calcDuctSize();
        }
      }

      function applyVelocityPreset() {
        var p = document.getElementById('duct-velocity-preset').value;
        if (p !== 'custom') {
          document.getElementById('duct-target-fpm').value = p;
          calcDuctSize();
        }
      }

      function calcDuctSize() {
        var mode = document.getElementById('duct-calc-mode').value;
        var cfm = parseFloat(document.getElementById('duct-cfm').value) || 400;
        var friction = parseFloat(document.getElementById('duct-friction').value) || 0.10;
        var targetFpm = parseFloat(document.getElementById('duct-target-fpm').value) || 800;
        var constraintType = document.getElementById('duct-constraint-type').value;
        var constraintVal = parseFloat(document.getElementById('duct-constraint-val').value) || 8;

        var colFriction = document.getElementById('col-friction-rate');
        var colVelocity = document.getElementById('col-target-velocity');

        if (mode === 'target_velocity') {
          colFriction.style.display = 'none';
          colVelocity.style.display = 'block';
        } else {
          colFriction.style.display = 'block';
          colVelocity.style.display = 'none';
        }

        var roundDiam = 0;
        var velocityFpm = 0;
        var calcFrictionRate = friction;

        if (mode === 'equal_friction') {
          var dPow = (0.109136 * Math.pow(cfm, 1.9)) / Math.max(0.005, friction);
          roundDiam = Math.pow(dPow, 1 / 5.02);
          var areaSqFt = Math.PI * Math.pow(roundDiam / 24, 2);
          velocityFpm = cfm / areaSqFt;
          calcFrictionRate = friction;
        } else if (mode === 'target_velocity') {
          velocityFpm = targetFpm;
          var areaSqFt = cfm / velocityFpm;
          var areaSqIn = areaSqFt * 144;
          roundDiam = Math.sqrt((4 * areaSqIn) / Math.PI);
          calcFrictionRate = (0.109136 * Math.pow(cfm, 1.9)) / Math.pow(roundDiam, 5.02);
        } else {
          roundDiam = constraintVal;
          var areaSqFt = Math.PI * Math.pow(roundDiam / 24, 2);
          velocityFpm = cfm / areaSqFt;
          calcFrictionRate = (0.109136 * Math.pow(cfm, 1.9)) / Math.pow(roundDiam, 5.02);
        }

        var bFixed = constraintVal;
        var aCalc = bFixed;

        function getHuebscherDe(w, h) {
          return 1.30 * (Math.pow(w * h, 0.625) / Math.pow(w + h, 0.25));
        }

        var low = 2, high = 120;
        for (var iter = 0; iter < 30; iter++) {
          var mid = (low + high) / 2;
          var testDe = getHuebscherDe(mid, bFixed);
          if (testDe < roundDiam) {
            low = mid;
          } else {
            high = mid;
          }
        }
        aCalc = (low + high) / 2;

        var stdRound = Math.round(roundDiam);
        var stdRectA = Math.round(aCalc);
        var stdRectB = Math.round(bFixed);

        var aspect = Math.max(stdRectA, stdRectB) / Math.min(stdRectA, stdRectB);
        var rectAreaSqFt = (stdRectA * stdRectB) / 144;
        var rectVelocityFpm = cfm / rectAreaSqFt;

        document.getElementById('res-round-diam').textContent = roundDiam.toFixed(1) + '"';
        document.getElementById('res-round-std').textContent = 'Nearest standard: ' + stdRound + '" Round';

        if (constraintType === 'height') {
          document.getElementById('res-rect-size').textContent = stdRectA + '"W × ' + stdRectB + '"H';
        } else {
          document.getElementById('res-rect-size').textContent = stdRectB + '"W × ' + stdRectA + '"H';
        }
        
        var aspectEl = document.getElementById('res-aspect-ratio');
        aspectEl.textContent = 'Aspect Ratio: ' + aspect.toFixed(2) + ':1 ' + (aspect > 4 ? '❌ DANGER (>4:1)' : (aspect > 2.5 ? '⚠️ Warning' : '✓ Optimal'));
        aspectEl.style.color = aspect > 4 ? '#ef4444' : (aspect > 2.5 ? '#f59e0b' : '#10b981');

        var velEl = document.getElementById('res-velocity-fpm');
        velEl.textContent = Math.round(velocityFpm) + ' FPM';
        var velRating = document.getElementById('res-velocity-rating');
        if (velocityFpm < 700) {
          velRating.textContent = '✓ Quiet (Residential Standard)';
          velRating.style.color = '#10b981';
        } else if (velocityFpm <= 900) {
          velRating.textContent = '✓ Moderate (Trunk Maximum)';
          velRating.style.color = '#3b82f6';
        } else if (velocityFpm <= 1200) {
          velRating.textContent = '⚠️ Loud / Commercial Only';
          velRating.style.color = '#f59e0b';
        } else {
          velRating.textContent = '❌ Whistle Hazard (>1200 FPM)';
          velRating.style.color = '#ef4444';
        }

        document.getElementById('res-friction-rate').textContent = calcFrictionRate.toFixed(3) + ' in/100\'';
        document.getElementById('res-total-area').textContent = 'Round Area: ' + (Math.PI * Math.pow(roundDiam / 24, 2)).toFixed(2) + ' sq ft';

        renderDuctSvg(roundDiam, stdRectA, stdRectB, aspect, velocityFpm);
        renderDuctDerivation(cfm, friction, roundDiam, stdRound, stdRectA, stdRectB, aspect, velocityFpm, calcFrictionRate);
      }

      function renderDuctSvg(roundD, rectW, rectH, aspect, vel) {
        var svg = document.getElementById('duct-vis-svg');
        if (!svg) return;
        var maxDim = Math.max(roundD, rectW, rectH, 12);
        var scale = 140 / maxDim;

        var rWidth = rectW * scale;
        var rHeight = rectH * scale;
        var rRadius = (roundD * scale) / 2;

        var cx = 220;
        var cy = 160;
        var rectX = cx - rWidth / 2;
        var rectY = cy - rHeight / 2;

        var velColor = vel < 700 ? '#10b981' : (vel <= 900 ? '#3b82f6' : (vel <= 1200 ? '#f59e0b' : '#ef4444'));

        var svgHtml = '';
        svgHtml += '<line x1="40" y1="160" x2="400" y2="160" stroke="#334155" stroke-width="1" stroke-dasharray="4,4" />';
        svgHtml += '<line x1="220" y1="30" x2="220" y2="290" stroke="#334155" stroke-width="1" stroke-dasharray="4,4" />';
        svgHtml += '<rect x="' + rectX + '" y="' + rectY + '" width="' + rWidth + '" height="' + rHeight + '" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="2.5" rx="4" />';
        svgHtml += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rRadius + '" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="6,4" />';
        svgHtml += '<text x="' + cx + '" y="' + (rectY - 12) + '" text-anchor="middle" fill="#10b981" font-size="12" font-weight="bold">Width: ' + rectW + '\\" (Rectangular)</text>';
        svgHtml += '<text x="' + (rectX + rWidth + 12) + '" y="' + (cy + 4) + '" fill="#10b981" font-size="12" font-weight="bold">Height: ' + rectH + '\\"</text>';
        svgHtml += '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" fill="#60a5fa" font-size="11" font-weight="bold">∅ ' + roundD.toFixed(1) + '\\" Round (De)</text>';

        svgHtml += '<g transform="translate(440, 40)">';
        svgHtml += '<rect x="0" y="0" width="230" height="240" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />';
        svgHtml += '<text x="115" y="28" text-anchor="middle" fill="#f8fafc" font-size="13" font-weight="bold">Acoustic Velocity Rating</text>';
        svgHtml += '<rect x="25" y="50" width="180" height="16" rx="8" fill="#0f172a" />';
        svgHtml += '<rect x="25" y="50" width="70" height="16" rx="8" fill="#10b981" opacity="0.6" />';
        svgHtml += '<rect x="95" y="50" width="30" height="16" fill="#3b82f6" opacity="0.6" />';
        svgHtml += '<rect x="125" y="50" width="35" height="16" fill="#f59e0b" opacity="0.6" />';
        svgHtml += '<rect x="160" y="50" width="45" height="16" rx="8" fill="#ef4444" opacity="0.6" />';

        var needleX = Math.min(200, Math.max(25, 25 + (vel / 1600) * 180));
        svgHtml += '<line x1="' + needleX + '" y1="44" x2="' + needleX + '" y2="72" stroke="#ffffff" stroke-width="3" />';
        svgHtml += '<text x="25" y="82" fill="#94a3b8" font-size="9">0 FPM</text>';
        svgHtml += '<text x="95" y="82" fill="#94a3b8" font-size="9">700</text>';
        svgHtml += '<text x="160" y="82" fill="#94a3b8" font-size="9">1200+</text>';

        svgHtml += '<text x="115" y="115" text-anchor="middle" fill="' + velColor + '" font-size="18" font-weight="bold">' + Math.round(vel) + ' FPM</text>';
        svgHtml += '<rect x="20" y="135" width="190" height="85" rx="6" fill="#0f172a" stroke="#334155" stroke-width="0.5" />';
        svgHtml += '<text x="30" y="155" fill="#94a3b8" font-size="10.5">• Aspect Ratio: <tspan fill="' + (aspect > 4 ? '#ef4444' : '#10b981') + '" font-weight="bold">' + aspect.toFixed(1) + ':1</tspan></text>';
        svgHtml += '<text x="30" y="175" fill="#94a3b8" font-size="10.5">• Noise Criteria: <tspan fill="' + velColor + '" font-weight="bold">' + (vel < 700 ? 'NC-25 (Whisper)' : (vel < 900 ? 'NC-30 (Quiet)' : 'NC-40 (Whistle)')) + '</tspan></text>';
        svgHtml += '<text x="30" y="195" fill="#94a3b8" font-size="10.5">• Equal Friction: <tspan fill="#8b5cf6" font-weight="bold">ASHRAE / SMACNA</tspan></text>';
        svgHtml += '<text x="30" y="212" fill="#94a3b8" font-size="9.5">• Status: <tspan fill="' + (vel < 900 && aspect <= 4 ? '#10b981' : '#f59e0b') + '">' + (vel < 900 && aspect <= 4 ? 'Optimal Design' : 'Check Restrictions') + '</tspan></text>';
        svgHtml += '</g>';

        svg.innerHTML = svgHtml;
      }

      function renderDuctDerivation(cfm, friction, roundD, stdR, rectA, rectB, aspect, vel, actualFriction) {
        var el = document.getElementById('duct-derivation-content');
        if (!el) return;
        var roundArea = (Math.PI * Math.pow(roundD / 24, 2)).toFixed(3);
        var rectArea = ((rectA * rectB) / 144).toFixed(3);

        var html = '';
        html += '<p><strong>Step 1: Determine Required Round Duct Diameter via Equal Friction Equation</strong></p>';
        html += '<p style="font-family: var(--mono); background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 6px;">';
        html += '$$\\\\Delta h_f = 0.109136 \\\\times \\\\frac{Q^{1.9}}{D^{5.02}}\\\\quad\\\\implies\\\\quad D = \\\\left( \\\\frac{0.109136 \\\\times ' + cfm + '^{1.9}}{' + friction.toFixed(2) + '} \\\\right)^{\\\\frac{1}{5.02}} = \\\\mathbf{' + roundD.toFixed(2) + '\\\\text{ inches}}$$<br>';
        html += 'Standard Commercial Spiral Pipe Selection = <strong>' + stdR + '\\" Round</strong> (Cross-sectional Area = ' + roundArea + ' sq ft)';
        html += '</p>';

        html += '<p style="margin-top: 1rem;"><strong>Step 2: Convert to Equivalent Rectangular Duct via Huebscher Equation</strong></p>';
        html += '<p style="font-family: var(--mono); background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 6px;">';
        html += '$$D_e = 1.30 \\\\times \\\\frac{(a \\\\cdot b)^{0.625}}{(a + b)^{0.25}}\\\\quad\\\\text{with } b = ' + rectB + '\\" \\\\implies a = \\\\mathbf{' + rectA + '\\"}$$<br>';
        html += 'Rectangular Profile = <strong>' + rectA + '\\" Wide &times; ' + rectB + '\\" Deep</strong> (Area = ' + rectArea + ' sq ft)';
        html += '</p>';

        html += '<p style="margin-top: 1rem;"><strong>Step 3: Verify Aerodynamic Air Velocity &amp; Aspect Ratio</strong></p>';
        html += '<p style="font-family: var(--mono); background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 6px;">';
        html += '$$v = \\\\frac{Q}{A} = \\\\frac{' + cfm + '\\\\text{ CFM}}{' + roundArea + '\\\\text{ ft}^2} = \\\\mathbf{' + Math.round(vel) + '\\\\text{ FPM}}$$<br>';
        html += '$$\\\\text{Aspect Ratio } AR = \\\\frac{\\\\max(a, b)}{\\\\min(a, b)} = \\\\frac{' + Math.max(rectA, rectB) + '}{' + Math.min(rectA, rectB) + '} = \\\\mathbf{' + aspect.toFixed(2) + ' : 1}$$';
        html += '</p>';

        el.innerHTML = html;
      }

      function copyDuctSummary() {
        var cfm = document.getElementById('duct-cfm').value;
        var roundD = document.getElementById('res-round-diam').textContent;
        var roundStd = document.getElementById('res-round-std').textContent;
        var rectSize = document.getElementById('res-rect-size').textContent;
        var aspect = document.getElementById('res-aspect-ratio').textContent;
        var vel = document.getElementById('res-velocity-fpm').textContent;
        var velRating = document.getElementById('res-velocity-rating').textContent;
        var friction = document.getElementById('res-friction-rate').textContent;

        var text = '=== HVAC AIR DUCT SIZING & FRICTION REPORT ===\\n' +
          'Airflow Volume: ' + cfm + ' CFM\\n' +
          'Design Friction Rate: ' + friction + '\\n' +
          '--------------------------------------------\\n' +
          'Calculated Round Diameter: ' + roundD + ' (' + roundStd + ')\\n' +
          'Rectangular Duct Size: ' + rectSize + '\\n' +
          aspect + '\\n' +
          'Air Velocity: ' + vel + ' (' + velRating + ')\\n' +
          'Aerodynamic Standard: ASHRAE Fundamentals / SMACNA\\n' +
          'Generated via Digital Tools Shed (https://digitaltoolsshed.com/calc/duct-size-calculator)';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copy-duct-summary-btn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span>✓</span> Copied HVAC Duct Sizing!';
          setTimeout(function() { btn.innerHTML = orig; }, 2500);
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcDuctSize);
      } else {
        calcDuctSize();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'duct-size-calculator.html'), renderTradePage({
    title: "HVAC Duct Sizing & CFM Air Velocity Calculator (ASHRAE / SMACNA) | Digital Tools Shed",
    metaDesc: "Size HVAC supply and return air ducts by CFM and friction rate using the Equal Friction and Huebscher equivalent diameter methods. Monitor velocity noise limits.",
    canonical: `${DOMAIN}/calc/duct-size-calculator`,
    bodyContent: ductSizeBody,
    currentPath: '/calc/duct-size-calculator',
    faq: [
      {
        "q": "How many CFM of airflow are required per ton of air conditioning?",
        "a": "Standard residential air conditioning systems require approximately 400 CFM per ton (12,000 BTU/hr) of nominal cooling capacity under standard humidity conditions. In humid climates, 350 CFM/ton improves dehumidification, while in dry desert climates, 450 CFM/ton maximizes efficiency."
      },
      {
        "q": "What is the standard friction rate used in residential duct sizing?",
        "a": "The standard rule-of-thumb friction rate is 0.10 inches of water column (in. w.g.) per 100 feet of equivalent straight duct length for supply trunks, and 0.08 in. w.g. / 100 ft for return trunks."
      },
      {
        "q": "How is equivalent round diameter converted to rectangular duct dimensions?",
        "a": "The conversion uses the Huebscher equation: D_e = 1.30 * (a * b)^0.625 / (a + b)^0.25, where a and b are rectangular width and height, and D_e is the circular diameter yielding equal friction loss at identical airflow."
      },
      {
        "q": "Why is round ductwork superior to rectangular ductwork?",
        "a": "A circular duct provides the maximum cross-sectional area with the minimum perimeter, minimizing surface boundary friction. Round spiral ducting requires 20% to 30% less sheet metal by weight and eliminates noisy 90-degree corner eddy turbulence."
      },
      {
        "q": "What maximum air velocity should be allowed in residential ductwork?",
        "a": "Under ASHRAE standards, residential main supply trunks should stay below 700 to 900 FPM, branch runs below 500 to 600 FPM, and central return ducts below 600 to 700 FPM to prevent acoustic whistling and rumble."
      }
    ]
  }));


  // ─────────────────────────────────────────────────────────────────────────────
  // 29. BEAM DEFLECTION, BENDING STRESS & MOMENT OF INERTIA CALCULATOR
  // ─────────────────────────────────────────────────────────────────────────────
  const beamDeflectionBody = `
    <div class="article-container" style="max-width: 1040px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/calc/">Trade &amp; Engineering</a> &gt; Beam Deflection Calculator
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-purple">Structural Engineering &amp; Carpentry</span>
          <span class="badge badge-green">AISC &amp; NDS Timber Standards</span>
          <span class="badge badge-blue">Euler-Bernoulli Elastic Beam Theory</span>
        </div>
        <h1 style="font-size: 2.2rem; margin-bottom: 0.75rem; line-height: 1.2;">Beam Deflection, Bending Stress &amp; Section Modulus Calculator</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; max-width: 820px;">
          Calculate maximum elastic deflection ($\delta_{\max}$), bending moment ($M_{\max}$), and flexural fiber stress ($\sigma_{\max}$) across simply supported and cantilever beams. Accurately verify code deflection thresholds ($L/360$, $L/240$, $L/180$) using authentic nominal lumber dimensions, engineered LVL, and structural steel sections.
        </p>
      </header>

      <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
        <!-- Configuration Row 1 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Beam Support &amp; Loading Condition</label>
            <select id="beam-load-condition" class="input-field" style="width: 100%;" onchange="calcBeamDeflection()">
              <option value="ss_point" selected>Simply Supported — Center Point Load (P)</option>
              <option value="ss_uniform">Simply Supported — Uniform Distributed Load (w)</option>
              <option value="cant_point">Cantilever — End Point Load (P)</option>
              <option value="cant_uniform">Cantilever — Uniform Distributed Load (w)</option>
            </select>
          </div>
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Clear Span Length (L)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="number" id="beam-span-ft" class="input-field" value="14" min="1" max="100" step="0.5" style="width: 100%;" oninput="calcBeamDeflection()">
              <span style="font-weight: bold; min-width: 25px;">ft</span>
              <input type="number" id="beam-span-in" class="input-field" value="0" min="0" max="11.875" step="0.5" style="width: 80px;" oninput="calcBeamDeflection()">
              <span style="font-weight: bold; min-width: 25px;">in</span>
            </div>
            <small style="color: var(--text-muted);">Total unsupported span distance between bearings</small>
          </div>
        </div>

        <!-- Configuration Row 2 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
          <div>
            <label id="lbl-beam-load-val" style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Applied Load (P)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="number" id="beam-load-input" class="input-field" value="1200" min="1" max="500000" step="25" style="width: 100%;" oninput="calcBeamDeflection()">
              <span id="beam-load-unit" style="font-weight: bold; min-width: 50px;">lbs</span>
            </div>
            <small id="lbl-beam-load-hint" style="color: var(--text-muted);">Concentrated point load applied at beam midspan</small>
          </div>
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Material &amp; Elastic Modulus (E)</label>
            <select id="beam-material-preset" class="input-field" style="width: 100%;" onchange="applyMaterialPreset()">
              <option value="1600000,900" selected>Douglas Fir-Larch #2 (E=1.6M PSI, Fb=900 PSI)</option>
              <option value="1400000,850">Southern Yellow Pine #2 (E=1.4M PSI, Fb=850 PSI)</option>
              <option value="1300000,850">Hem-Fir #2 (E=1.3M PSI, Fb=850 PSI)</option>
              <option value="2000000,2600">Engineered LVL 2.0E (E=2.0M PSI, Fb=2600 PSI)</option>
              <option value="1800000,2400">Glulam 24F-V4 (E=1.8M PSI, Fb=2400 PSI)</option>
              <option value="29000000,36000">Structural Steel A36 (E=29M PSI, Fy=36,000 PSI)</option>
              <option value="10000000,35000">6061-T6 Aluminum (E=10M PSI, Fy=35,000 PSI)</option>
              <option value="custom">Custom Modulus &amp; Allowable Stress...</option>
            </select>
          </div>
        </div>

        <!-- Custom Material Inputs (Conditional) -->
        <div id="custom-material-row" style="display: none; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Custom Modulus of Elasticity E (PSI)</label>
            <input type="number" id="beam-custom-e" class="input-field" value="1600000" min="100000" max="50000000" step="50000" style="width: 100%;" oninput="calcBeamDeflection()">
          </div>
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Allowable Bending Stress Fb (PSI)</label>
            <input type="number" id="beam-custom-fb" class="input-field" value="1000" min="100" max="100000" step="50" style="width: 100%;" oninput="calcBeamDeflection()">
          </div>
        </div>

        <!-- Section Geometry Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
          <div>
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Cross-Section Preset</label>
            <select id="beam-section-preset" class="input-field" style="width: 100%;" onchange="applySectionPreset()">
              <option value="1.5,5.5">Single 2x6 (Actual: 1.5" × 5.5")</option>
              <option value="1.5,7.25">Single 2x8 (Actual: 1.5" × 7.25")</option>
              <option value="1.5,9.25">Single 2x10 (Actual: 1.5" × 9.25")</option>
              <option value="1.5,11.25">Single 2x12 (Actual: 1.5" × 11.25")</option>
              <option value="3.0,7.25">Double 2x8 (Actual: 3.0" × 7.25")</option>
              <option value="3.0,9.25" selected>Double 2x10 (Actual: 3.0" × 9.25")</option>
              <option value="4.5,9.25">Triple 2x10 (Actual: 4.5" × 9.25")</option>
              <option value="3.0,11.25">Double 2x12 (Actual: 3.0" × 11.25")</option>
              <option value="4.5,11.25">Triple 2x12 (Actual: 4.5" × 11.25")</option>
              <option value="1.75,9.5">Single 1-3/4" × 9-1/2" LVL</option>
              <option value="3.5,9.5">Double 1-3/4" × 9-1/2" LVL (3.5" × 9.5")</option>
              <option value="3.5,11.875">Double 1-3/4" × 11-7/8" LVL (3.5" × 11.875")</option>
              <option value="custom_rect">Custom Rectangular (Width × Depth)...</option>
              <option value="custom_inertia">Direct Moment of Inertia (I &amp; S)...</option>
            </select>
          </div>
          <div id="col-rect-dims">
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Actual Cross-Section Dimensions (b × d)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="number" id="beam-dim-b" class="input-field" value="3.0" min="0.5" max="48" step="0.25" style="width: 100%;" oninput="calcBeamDeflection()">
              <span style="font-weight: bold;">"W ×</span>
              <input type="number" id="beam-dim-d" class="input-field" value="9.25" min="1" max="60" step="0.25" style="width: 100%;" oninput="calcBeamDeflection()">
              <span style="font-weight: bold;">"D</span>
            </div>
            <small style="color: var(--text-muted);">Actual dressed timber width (b) and vertical depth (d)</small>
          </div>
          <div id="col-custom-inertia" style="display: none;">
            <label style="display: block; font-weight: 600; margin-bottom: 0.4rem;">Direct Moment of Inertia (I) &amp; Section Modulus (S)</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="number" id="beam-custom-i" class="input-field" value="197.8" min="0.1" max="100000" step="1" style="width: 100%;" oninput="calcBeamDeflection()">
              <span style="font-weight: bold;">in⁴</span>
              <input type="number" id="beam-custom-s" class="input-field" value="42.7" min="0.1" max="10000" step="0.5" style="width: 100%;" oninput="calcBeamDeflection()">
              <span style="font-weight: bold;">in³</span>
            </div>
          </div>
        </div>

        <!-- Metric Diagnostic Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Max Deflection (δ_max)</div>
            <div id="res-beam-deflection" style="font-size: 1.6rem; font-weight: 700; color: #3b82f6; margin: 0.2rem 0;">--</div>
            <div id="res-beam-fraction" style="font-size: 0.85rem; color: var(--text-muted);">-- in fractional inches</div>
          </div>

          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Deflection Span Ratio</div>
            <div id="res-beam-span-ratio" style="font-size: 1.6rem; font-weight: 700; color: #10b981; margin: 0.2rem 0;">--</div>
            <div id="res-beam-l360-status" style="font-size: 0.8rem; font-weight: 600;">--</div>
          </div>

          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Max Bending Moment (M)</div>
            <div id="res-beam-moment" style="font-size: 1.6rem; font-weight: 700; color: #f59e0b; margin: 0.2rem 0;">--</div>
            <div id="res-beam-moment-inlbs" style="font-size: 0.8rem; color: var(--text-muted);">-- in-lbs</div>
          </div>

          <div class="metric-card" style="padding: 1rem; text-align: center; border-radius: 8px; background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.2);">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Max Bending Stress (σ)</div>
            <div id="res-beam-stress" style="font-size: 1.6rem; font-weight: 700; color: #8b5cf6; margin: 0.2rem 0;">--</div>
            <div id="res-beam-stress-ratio" style="font-size: 0.8rem; font-weight: 600;">--</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
          <button id="copy-beam-summary-btn" class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem;" onclick="copyBeamSummary()">
            <span>📋</span> Copy Beam Structural Analysis Report
          </button>
        </div>
      </div>

      <!-- Live Interactive SVG Visualization -->
      <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="margin-top: 0; margin-bottom: 0.5rem;">Elastic Deflection Curve &amp; Loading Profile</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">
          Real-time Euler-Bernoulli elastic curve showing undeformed neutral axis, boundary supports, load vectors, and magnified vertical sag plotted against the L/360 code threshold limit.
        </p>
        <div style="width: 100%; overflow-x: auto; background: var(--surface-bg, #0f172a); border-radius: 8px; padding: 1rem 0;">
          <svg id="beam-vis-svg" viewBox="0 0 720 300" style="width: 100%; max-width: 720px; display: block; margin: 0 auto; font-family: var(--font-sans, sans-serif);">
            <!-- Rendered dynamically in JS -->
          </svg>
        </div>
      </div>

      <!-- Live Mathematical Derivation -->
      <div class="glass-panel" style="padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="margin-top: 0; margin-bottom: 1rem;">Live Engineering Derivation &amp; Section Mechanics</h3>
        <div id="beam-derivation-content" style="line-height: 1.7; font-size: 0.95rem; color: var(--text);">
          <!-- Populated by JS -->
        </div>
      </div>

      <!-- 5 Fatal Engineering Traps -->
      <div style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">5 Fatal Beam Deflection Traps &amp; Structural Pitfalls</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
          Structural framing failures rarely stem from pure tensile rupture&mdash;they fail due to dimensional misunderstandings, long-term creep, unbraced torsional twisting, and horizontal shear.
        </p>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="trap-card" style="border-left: 4px solid #ef4444; background: rgba(239, 68, 68, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #ef4444; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚠️</span> 1. Nominal vs. Actual Lumber Dimension Trap (63% Inertia Overestimate)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              Beginner builders often use nominal dimensions (2&quot; &times; 10&quot;) instead of actual dressed lumber dimensions (1.5&quot; &times; 9.25&quot;). Because the area moment of inertia depends on the cube of the depth ($I = b d^3 / 12$), a nominal 2&times;10 would have $I = (2 \times 10^3)/12 = 166.7\text{ in}^4$, whereas an actual dressed 2&times;10 has $I = (1.5 \times 9.25^3)/12 = 98.9\text{ in}^4$. Sizing beams with nominal dimensions leads to an <strong>overestimation of beam stiffness by 68%</strong>, resulting in severe ceiling sagging and cracked finishes.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #f59e0b; display: flex; align-items: center; gap: 0.5rem;">
              <span>⏳</span> 2. L/360 Live Load vs Total Load Long-Term Creep (2x Permanent Sag)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              Building codes dictate that live load deflection shall not exceed $L/360$ (or $L/240$ for total load). However, wood is a viscoelastic material subject to <strong>creep deformation</strong> under sustained permanent dead loads (furniture, framing weight, tile, drywall). Under continuous loading, unseasoned lumber will experience long-term creep equal to <strong>1.5&times; to 2.0&times;</strong> the initial instantaneous elastic deflection. If long-term dead load deflection is ignored, doors and windows beneath the beam will bind and jam shut within 2 to 5 years.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #10b981; background: rgba(16, 185, 129, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #10b981; display: flex; align-items: center; gap: 0.5rem;">
              <span>🔄</span> 3. Lateral-Torsional Buckling of Deep Unbraced Beams
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              Deep, slender beams (such as a single 2&times;12 or multi-ply LVL with depth-to-width ratio $d/b \ge 4$) are vulnerable to <strong>lateral-torsional buckling (LTB)</strong>. Under extreme flexural compression along the top flange, the beam will buckle sideways and twist torsionally long before reaching its allowable extreme fiber bending stress ($F_b$). Solid wood blocking, diagonal bridging, or direct structural subfloor sheathing fastened every 12 inches is mandatory to restrain compression edge rotation.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #3b82f6; background: rgba(59, 130, 246, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #3b82f6; display: flex; align-items: center; gap: 0.5rem;">
              <span>✂️</span> 4. Horizontal Shear Stress Failure Near Bearings (Fv Violation)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              On short, heavily loaded spans, beams almost never fail from bending stress ($\sigma = M/S$) or midspan deflection. Instead, they fail in <strong>longitudinal horizontal shear</strong> ($\tau = 1.5 V / A$ for rectangular sections) directly adjacent to the end bearing supports. Wood possesses weak shear strength parallel to the grain ($F_v \approx 135\text{ to }180\text{ PSI}$). Heavy point loads placed within a distance $d$ of the support can split the beam horizontally down its neutral axis like firewood.
            </p>
          </div>

          <div class="trap-card" style="border-left: 4px solid #8b5cf6; background: rgba(139, 92, 246, 0.05); padding: 1.25rem; border-radius: 0 8px 8px 0;">
            <h4 style="margin: 0 0 0.5rem 0; color: #8b5cf6; display: flex; align-items: center; gap: 0.5rem;">
              <span>📳</span> 5. Dynamic Floor Resonance &amp; &quot;Bouncy Floor&quot; Low Natural Frequency (&lt;8 Hz)
            </h4>
            <p style="margin: 0; font-size: 0.92rem; line-height: 1.6;">
              A floor joist system may strictly satisfy static deflection limits ($L/360$), yet feel unbearably springy, bouncy, and cheap to walk on. When the natural fundamental vibration frequency of a floor falls below <strong>8 Hz</strong>, normal human walking cadence (1.8 to 2.2 steps per second) excites sub-harmonics that trigger resonant oscillation, causing chinaware to rattle and occupants to feel motion sickness. To prevent bouncy floors, design for $L/480$ or $L/600$ and glue-and-screw 3/4-inch tongue-and-groove subflooring.
            </p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <section class="faq-section" style="margin-top: 2rem;">
        <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">Frequently Asked Questions: Beam Deflection &amp; Sizing</h2>
        <div class="faq-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">What is the difference between L/360, L/240, and L/180 deflection limits?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              These are International Building Code (IBC) maximum allowable deflection fractions based on span length ($L$ in inches):<br>
              &bull; <strong>L/360</strong>: Standard limit for floor joists carrying brittle plaster or tile ceilings under live load (e.g. 15 ft span allows max 0.50" deflection).<br>
              &bull; <strong>L/240</strong>: Standard limit for total combined load (dead + live) with drywall ceilings, or roof rafters supporting plaster.<br>
              &bull; <strong>L/180</strong>: Standard limit for roof rafters without ceiling finish, agricultural structures, or cantilever decks.
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">How do you calculate the moment of inertia for a rectangular wood beam?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              For any solid rectangular section bent about its strong horizontal axis, the Area Moment of Inertia is calculated as: <code>I = (b * d³) / 12</code>, where <em>b</em> is the actual dressed width and <em>d</em> is the actual dressed vertical depth. For a built-up multi-ply beam (e.g. double 2x10), <em>b</em> is the combined thickness (1.5" + 1.5" = 3.0"), yielding <code>I = (3.0 * 9.25³) / 12 = 197.86 in⁴</code>.
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">Why does beam depth matter much more than beam width?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              Stiffness and bending resistance increase linearly with width ($b$), but increase with the <strong>cube of depth ($d^3$)</strong>. Doubling the width of a beam (e.g. sistering two 2x8s) doubles its stiffness ($2\times$). However, doubling the depth of a beam (e.g. upgrading from a 4-inch deep beam to an 8-inch deep beam) increases stiffness by $2^3 = \mathbf{8\times}$ while using the exact same volume of lumber!
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">What is the modulus of elasticity (E) of wood and steel?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              Modulus of Elasticity ($E$) measures a material's intrinsic resistance to elastic bending deformation:<br>
              &bull; <strong>Dimension Lumber (Douglas Fir / Yellow Pine)</strong>: $E \approx 1,400,000 \text{ to } 1,600,000 \text{ PSI}$<br>
              &bull; <strong>Engineered LVL (Laminated Veneer Lumber)</strong>: $E \approx 2,000,000 \text{ PSI}$<br>
              &bull; <strong>Structural Steel (A36, Grade 50)</strong>: $E \approx 29,000,000 \text{ PSI}$ (over 18&times; stiffer than timber)<br>
              &bull; <strong>Structural Aluminum (6061-T6)</strong>: $E \approx 10,000,000 \text{ PSI}$
            </div>
          </details>

          <details class="faq-item glass-panel" style="padding: 1rem;">
            <summary style="font-weight: 600; cursor: pointer;">How does cantilever deflection compare to simply supported beam deflection?</summary>
            <div style="margin-top: 0.75rem; font-size: 0.92rem; line-height: 1.6; color: var(--text-muted);">
              Cantilevers deflect drastically more because they are supported at only one end. Under an identical point load $P$ and span $L$, a cantilever end deflection is $\delta = \frac{PL^3}{3EI}$, which is <strong>16 times greater</strong> than the midspan deflection of a simply supported beam ($\delta = \frac{PL^3}{48EI}$). Under uniform load, a cantilever tip deflector is <strong>9.6 times greater</strong> than simply supported center deflection.
            </div>
          </details>
        </div>
      </section>
    </div>

    <script>
      function applyMaterialPreset() {
        var val = document.getElementById('beam-material-preset').value;
        var customRow = document.getElementById('custom-material-row');
        if (val === 'custom') {
          customRow.style.display = 'grid';
        } else {
          customRow.style.display = 'none';
        }
        calcBeamDeflection();
      }

      function applySectionPreset() {
        var val = document.getElementById('beam-section-preset').value;
        var colRect = document.getElementById('col-rect-dims');
        var colInertia = document.getElementById('col-custom-inertia');

        if (val === 'custom_inertia') {
          colRect.style.display = 'none';
          colInertia.style.display = 'block';
        } else if (val === 'custom_rect') {
          colRect.style.display = 'block';
          colInertia.style.display = 'none';
        } else {
          colRect.style.display = 'block';
          colInertia.style.display = 'none';
          var parts = val.split(',');
          document.getElementById('beam-dim-b').value = parts[0];
          document.getElementById('beam-dim-d').value = parts[1];
        }
        calcBeamDeflection();
      }

      function toFraction(val) {
        var whole = Math.floor(val);
        var rem = val - whole;
        var sixteenths = Math.round(rem * 16);
        if (sixteenths === 16) {
          whole++;
          sixteenths = 0;
        }
        if (sixteenths === 0) {
          return whole === 0 ? '0\\"' : whole + '\\"';
        }
        var num = sixteenths;
        var den = 16;
        while (num % 2 === 0 && den % 2 === 0) {
          num /= 2;
          den /= 2;
        }
        return (whole > 0 ? whole + ' ' : '') + num + '/' + den + '\\"';
      }

      function calcBeamDeflection() {
        var condition = document.getElementById('beam-load-condition').value;
        var spanFt = parseFloat(document.getElementById('beam-span-ft').value) || 0;
        var spanIn = parseFloat(document.getElementById('beam-span-in').value) || 0;
        var L = (spanFt * 12) + spanIn;
        if (L <= 0) L = 12;

        var rawLoad = parseFloat(document.getElementById('beam-load-input').value) || 0;
        var matPreset = document.getElementById('beam-material-preset').value;

        var lblLoad = document.getElementById('lbl-beam-load-val');
        var unitLoad = document.getElementById('beam-load-unit');
        var hintLoad = document.getElementById('lbl-beam-load-hint');

        if (condition === 'ss_point') {
          lblLoad.textContent = 'Concentrated Center Load (P)';
          unitLoad.textContent = 'lbs';
          hintLoad.textContent = 'Point load applied at midspan of the simply supported beam';
        } else if (condition === 'ss_uniform') {
          lblLoad.textContent = 'Uniform Distributed Load (w)';
          unitLoad.textContent = 'lbs/ft';
          hintLoad.textContent = 'Distributed load along the entire span (e.g. 50 lbs/ft dead + live)';
        } else if (condition === 'cant_point') {
          lblLoad.textContent = 'Tip Point Load (P)';
          unitLoad.textContent = 'lbs';
          hintLoad.textContent = 'Point load applied at the cantilever free end';
        } else {
          lblLoad.textContent = 'Uniform Distributed Load (w)';
          unitLoad.textContent = 'lbs/ft';
          hintLoad.textContent = 'Distributed load along the entire cantilever beam length';
        }

        var E = 1600000;
        var Fb = 900;
        if (matPreset === 'custom') {
          E = parseFloat(document.getElementById('beam-custom-e').value) || 1600000;
          Fb = parseFloat(document.getElementById('beam-custom-fb').value) || 1000;
        } else {
          var mp = matPreset.split(',');
          E = parseFloat(mp[0]);
          Fb = parseFloat(mp[1]);
        }

        var secPreset = document.getElementById('beam-section-preset').value;
        var I = 0;
        var S = 0;
        var depth = 9.25;
        var width = 3.0;

        if (secPreset === 'custom_inertia') {
          I = parseFloat(document.getElementById('beam-custom-i').value) || 100;
          S = parseFloat(document.getElementById('beam-custom-s').value) || 20;
          depth = (I / S) * 2;
        } else {
          width = parseFloat(document.getElementById('beam-dim-b').value) || 1.5;
          depth = parseFloat(document.getElementById('beam-dim-d').value) || 9.25;
          I = (width * Math.pow(depth, 3)) / 12;
          S = (width * Math.pow(depth, 2)) / 6;
        }

        var delta = 0;
        var M_inlbs = 0;

        if (condition === 'ss_point') {
          var P = rawLoad;
          delta = (P * Math.pow(L, 3)) / (48 * E * I);
          M_inlbs = (P * L) / 4;
        } else if (condition === 'ss_uniform') {
          var w_in = rawLoad / 12;
          delta = (5 * w_in * Math.pow(L, 4)) / (384 * E * I);
          M_inlbs = (w_in * Math.pow(L, 2)) / 8;
        } else if (condition === 'cant_point') {
          var P = rawLoad;
          delta = (P * Math.pow(L, 3)) / (3 * E * I);
          M_inlbs = P * L;
        } else {
          var w_in = rawLoad / 12;
          delta = (w_in * Math.pow(L, 4)) / (8 * E * I);
          M_inlbs = (w_in * Math.pow(L, 2)) / 2;
        }

        var M_ftlbs = M_inlbs / 12;
        var stressPsi = M_inlbs / S;
        var spanRatio = delta > 0 ? Math.round(L / delta) : 9999;
        var stressRatio = (stressPsi / Fb) * 100;

        document.getElementById('res-beam-deflection').textContent = delta.toFixed(3) + '\\"';
        document.getElementById('res-beam-fraction').textContent = '≈ ' + toFraction(delta) + ' sag';

        var ratioEl = document.getElementById('res-beam-span-ratio');
        ratioEl.textContent = 'L / ' + spanRatio;
        var l360Status = document.getElementById('res-beam-l360-status');
        if (spanRatio >= 360) {
          l360Status.textContent = '✓ PASS (Exceeds L/360 & L/240)';
          l360Status.style.color = '#10b981';
        } else if (spanRatio >= 240) {
          l360Status.textContent = '⚠️ PASS L/240 (Fails L/360 Plaster)';
          l360Status.style.color = '#f59e0b';
        } else {
          l360Status.textContent = '❌ FAILS L/240 & L/360 Code';
          l360Status.style.color = '#ef4444';
        }

        document.getElementById('res-beam-moment').textContent = Math.round(M_ftlbs).toLocaleString() + ' ft-lbs';
        document.getElementById('res-beam-moment-inlbs').textContent = Math.round(M_inlbs).toLocaleString() + ' in-lbs';

        var stressEl = document.getElementById('res-beam-stress');
        stressEl.textContent = Math.round(stressPsi).toLocaleString() + ' PSI';
        var stressRatioEl = document.getElementById('res-beam-stress-ratio');
        stressRatioEl.textContent = stressRatio.toFixed(1) + '% of Fb (' + Fb + ' PSI) ' + (stressRatio <= 100 ? '✓ Safe' : '❌ OVERSTRESSED');
        stressRatioEl.style.color = stressRatio <= 100 ? '#10b981' : '#ef4444';

        renderBeamSvg(condition, L, delta, spanRatio, rawLoad, M_ftlbs, stressRatio);
        renderBeamDerivation(condition, spanFt, spanIn, L, rawLoad, E, I, S, delta, spanRatio, M_inlbs, M_ftlbs, stressPsi, Fb, stressRatio);
      }

      function renderBeamSvg(condition, L, delta, spanRatio, loadVal, M_ftlbs, stressRatio) {
        var svg = document.getElementById('beam-vis-svg');
        if (!svg) return;
        var isCant = condition.indexOf('cant') === 0;

        var startX = isCant ? 120 : 80;
        var endX = 640;
        var beamY = 120;
        var beamLen = endX - startX;

        var l360_px = Math.min(60, (beamLen / 360) * 15);
        var defl_px = Math.min(85, Math.max(4, (delta / (L / 360)) * l360_px));

        var curvePath = '';
        if (!isCant) {
          var midX = (startX + endX) / 2;
          curvePath = 'M ' + startX + ' ' + beamY + ' Q ' + midX + ' ' + (beamY + defl_px * 2) + ' ' + endX + ' ' + beamY;
        } else {
          curvePath = 'M ' + startX + ' ' + beamY + ' C ' + (startX + beamLen * 0.4) + ' ' + beamY + ' ' + (startX + beamLen * 0.8) + ' ' + (beamY + defl_px * 0.6) + ' ' + endX + ' ' + (beamY + defl_px);
        }

        var statusColor = spanRatio >= 360 ? '#10b981' : (spanRatio >= 240 ? '#f59e0b' : '#ef4444');

        var svgHtml = '';
        svgHtml += '<line x1="' + startX + '" y1="' + (beamY + l360_px) + '" x2="' + endX + '" y2="' + (beamY + l360_px) + '" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.7" />';
        svgHtml += '<text x="' + (endX + 8) + '" y="' + (beamY + l360_px + 4) + '" fill="#f59e0b" font-size="10">L/360 Limit (' + (L / 360).toFixed(2) + '\\")</text>';
        svgHtml += '<line x1="' + startX + '" y1="' + beamY + '" x2="' + endX + '" y2="' + beamY + '" stroke="#475569" stroke-width="2" stroke-dasharray="3,3" />';
        svgHtml += '<path d="' + curvePath + '" fill="none" stroke="' + statusColor + '" stroke-width="4" stroke-linecap="round" />';
        svgHtml += '<path d="' + curvePath + '" fill="none" stroke="' + statusColor + '" stroke-width="10" opacity="0.25" />';

        if (!isCant) {
          svgHtml += '<polygon points="' + startX + ',' + beamY + ' ' + (startX - 12) + ',' + (beamY + 22) + ' ' + (startX + 12) + ',' + (beamY + 22) + '" fill="#64748b" stroke="#334155" stroke-width="1.5" />';
          svgHtml += '<line x1="' + (startX - 16) + '" y1="' + (beamY + 24) + '" x2="' + (startX + 16) + '" y2="' + (beamY + 24) + '" stroke="#64748b" stroke-width="2" />';
          svgHtml += '<polygon points="' + endX + ',' + beamY + ' ' + (endX - 12) + ',' + (beamY + 16) + ' ' + (endX + 12) + ',' + (beamY + 16) + '" fill="#64748b" stroke="#334155" stroke-width="1.5" />';
          svgHtml += '<circle cx="' + (endX - 6) + '" cy="' + (beamY + 20) + '" r="3" fill="#94a3b8" />';
          svgHtml += '<circle cx="' + (endX + 6) + '" cy="' + (beamY + 20) + '" r="3" fill="#94a3b8" />';
          svgHtml += '<line x1="' + (endX - 16) + '" y1="' + (beamY + 24) + '" x2="' + (endX + 16) + '" y2="' + (beamY + 24) + '" stroke="#64748b" stroke-width="2" />';
        } else {
          svgHtml += '<rect x="' + (startX - 24) + '" y="' + (beamY - 40) + '" width="24" height="90" fill="#334155" stroke="#475569" stroke-width="1.5" />';
          svgHtml += '<line x1="' + (startX - 24) + '" y1="' + (beamY - 30) + '" x2="' + (startX - 12) + '" y2="' + (beamY - 42) + '" stroke="#64748b" stroke-width="1.5" />';
          svgHtml += '<line x1="' + (startX - 24) + '" y1="' + (beamY - 10) + '" x2="' + (startX - 6) + '" y2="' + (beamY - 28) + '" stroke="#64748b" stroke-width="1.5" />';
          svgHtml += '<line x1="' + (startX - 24) + '" y1="' + (beamY + 10) + '" x2="' + startX + '" y2="' + (beamY - 14) + '" stroke="#64748b" stroke-width="1.5" />';
          svgHtml += '<line x1="' + (startX - 24) + '" y1="' + (beamY + 30) + '" x2="' + startX + '" y2="' + (beamY + 6) + '" stroke="#64748b" stroke-width="1.5" />';
        }

        if (condition === 'ss_point') {
          var midX = (startX + endX) / 2;
          svgHtml += '<line x1="' + midX + '" y1="50" x2="' + midX + '" y2="' + (beamY - 4) + '" stroke="#ef4444" stroke-width="3" />';
          svgHtml += '<polygon points="' + midX + ',' + (beamY - 2) + ' ' + (midX - 6) + ',' + (beamY - 14) + ' ' + (midX + 6) + ',' + (beamY - 14) + '" fill="#ef4444" />';
          svgHtml += '<text x="' + midX + '" y="42" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">P = ' + loadVal.toLocaleString() + ' lbs</text>';
        } else if (condition === 'cant_point') {
          svgHtml += '<line x1="' + endX + '" y1="50" x2="' + endX + '" y2="' + (beamY - 4) + '" stroke="#ef4444" stroke-width="3" />';
          svgHtml += '<polygon points="' + endX + ',' + (beamY - 2) + ' ' + (endX - 6) + ',' + (beamY - 14) + ' ' + (endX + 6) + ',' + (beamY - 14) + '" fill="#ef4444" />';
          svgHtml += '<text x="' + endX + '" y="42" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">P = ' + loadVal.toLocaleString() + ' lbs</text>';
        } else {
          for (var i = 0; i <= 8; i++) {
            var lx = startX + (beamLen / 8) * i;
            svgHtml += '<line x1="' + lx + '" y1="70" x2="' + lx + '" y2="' + (beamY - 4) + '" stroke="#ef4444" stroke-width="1.5" />';
            svgHtml += '<polygon points="' + lx + ',' + (beamY - 2) + ' ' + (lx - 3) + ',' + (beamY - 8) + ' ' + (lx + 3) + ',' + (beamY - 8) + '" fill="#ef4444" />';
          }
          svgHtml += '<line x1="' + startX + '" y1="70" x2="' + endX + '" y2="70" stroke="#ef4444" stroke-width="2" />';
          svgHtml += '<text x="' + ((startX + endX) / 2) + '" y="60" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="bold">w = ' + loadVal + ' lbs/ft (Uniform)</text>';
        }

        svgHtml += '<line x1="' + startX + '" y1="' + (beamY + 65) + '" x2="' + endX + '" y2="' + (beamY + 65) + '" stroke="#94a3b8" stroke-width="1.5" />';
        svgHtml += '<line x1="' + startX + '" y1="' + (beamY + 58) + '" x2="' + startX + '" y2="' + (beamY + 72) + '" stroke="#94a3b8" stroke-width="1.5" />';
        svgHtml += '<line x1="' + endX + '" y1="' + (beamY + 58) + '" x2="' + endX + '" y2="' + (beamY + 72) + '" stroke="#94a3b8" stroke-width="1.5" />';
        svgHtml += '<text x="' + ((startX + endX) / 2) + '" y="' + (beamY + 82) + '" text-anchor="middle" fill="#94a3b8" font-size="12">Span L = ' + L.toFixed(1) + '\\" (' + (L / 12).toFixed(2) + ' ft)</text>';

        var badgeX = isCant ? (endX - 110) : ((startX + endX) / 2 - 55);
        svgHtml += '<g transform="translate(' + badgeX + ', ' + (beamY + defl_px + 14) + ')">';
        svgHtml += '<rect x="0" y="0" width="110" height="24" rx="4" fill="#0f172a" stroke="' + statusColor + '" stroke-width="1" />';
        svgHtml += '<text x="55" y="16" text-anchor="middle" fill="' + statusColor + '" font-size="11" font-weight="bold">δ = ' + delta.toFixed(3) + '\\"</text>';
        svgHtml += '</g>';

        svg.innerHTML = svgHtml;
      }

      function renderBeamDerivation(cond, ft, inch, L, load, E, I, S, delta, spanRatio, M_inlbs, M_ftlbs, stress, Fb, stressRatio) {
        var el = document.getElementById('beam-derivation-content');
        if (!el) return;

        var formDefl = '';
        var formM = '';

        if (cond === 'ss_point') {
          formDefl = '\\\\delta_{\\\\max} = \\\\frac{P L^3}{48 E I}';
          formM = 'M_{\\\\max} = \\\\frac{P L}{4}';
        } else if (cond === 'ss_uniform') {
          formDefl = '\\\\delta_{\\\\max} = \\\\frac{5 w L^4}{384 E I}';
          formM = 'M_{\\\\max} = \\\\frac{w L^2}{8}';
        } else if (cond === 'cant_point') {
          formDefl = '\\\\delta_{\\\\max} = \\\\frac{P L^3}{3 E I}';
          formM = 'M_{\\\\max} = P L';
        } else {
          formDefl = '\\\\delta_{\\\\max} = \\\\frac{w L^4}{8 E I}';
          formM = 'M_{\\\\max} = \\\\frac{w L^2}{2}';
        }

        var html = '';
        html += '<p><strong>Step 1: Compute Cross-Section Moment of Inertia (I) and Section Modulus (S)</strong></p>';
        html += '<p style="font-family: var(--mono); background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 6px;">';
        html += '$$I = \\\\frac{b \\\\cdot d^3}{12} = \\\\mathbf{' + I.toFixed(2) + '\\\\text{ in}^4} \\\\quad S = \\\\frac{b \\\\cdot d^2}{6} = \\\\mathbf{' + S.toFixed(2) + '\\\\text{ in}^3}$$<br>';
        html += 'Modulus of Elasticity $E = \\\\mathbf{' + (E / 1000000).toFixed(2) + '\\\\times 10^6\\\\text{ PSI}}$ | Total Span $L = \\\\mathbf{' + L.toFixed(1) + '\\\\text{ inches}}$';
        html += '</p>';

        html += '<p style="margin-top: 1rem;"><strong>Step 2: Calculate Maximum Elastic Deflection &amp; Code Span Ratio</strong></p>';
        html += '<p style="font-family: var(--mono); background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 6px;">';
        html += '$$' + formDefl + ' = \\\\mathbf{' + delta.toFixed(3) + '\\\\text{ inches}}$$<br>';
        html += '$$\\\\text{Span-to-Deflection Ratio} = \\\\frac{L}{\\\\delta} = \\\\frac{' + L.toFixed(1) + '}{' + delta.toFixed(3) + '} = \\\\mathbf{L / ' + spanRatio + '}$$<br>';
        html += 'Allowable $L/360$ Threshold = $' + (L / 360).toFixed(3) + '\\\\text{ in}$ &rarr; <strong>' + (spanRatio >= 360 ? 'PASS (Stiff)' : (spanRatio >= 240 ? 'Marginal (Drywall Only)' : 'FAIL')) + '</strong>';
        html += '</p>';

        html += '<p style="margin-top: 1rem;"><strong>Step 3: Calculate Maximum Bending Moment &amp; Extreme Fiber Flexural Stress</strong></p>';
        html += '<p style="font-family: var(--mono); background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 6px;">';
        html += '$$' + formM + ' = \\\\mathbf{' + Math.round(M_inlbs).toLocaleString() + '\\\\text{ in-lbs}} \\\\quad (' + Math.round(M_ftlbs).toLocaleString() + '\\\\text{ ft-lbs})$$<br>';
        html += '$$\\\\sigma_{\\\\max} = \\\\frac{M_{\\\\max}}{S} = \\\\frac{' + Math.round(M_inlbs) + '}{' + S.toFixed(2) + '} = \\\\mathbf{' + Math.round(stress).toLocaleString() + '\\\\text{ PSI}}$$<br>';
        html += 'Allowable Bending Stress $F_b = ' + Fb + '\\\\text{ PSI}$ &rarr; Stress Utilization = $\\\\mathbf{' + stressRatio.toFixed(1) + '\\\\%}$ (' + (stressRatio <= 100 ? 'Adequate Bending Strength' : 'Overstressed Section') + ')';
        html += '</p>';

        el.innerHTML = html;
      }

      function copyBeamSummary() {
        var cond = document.getElementById('beam-load-condition').selectedOptions[0].text;
        var spanFt = document.getElementById('beam-span-ft').value;
        var spanIn = document.getElementById('beam-span-in').value;
        var loadVal = document.getElementById('beam-load-input').value;
        var loadUnit = document.getElementById('beam-load-unit').textContent;
        var delta = document.getElementById('res-beam-deflection').textContent;
        var frac = document.getElementById('res-beam-fraction').textContent;
        var ratio = document.getElementById('res-beam-span-ratio').textContent;
        var status = document.getElementById('res-beam-l360-status').textContent;
        var moment = document.getElementById('res-beam-moment').textContent;
        var stress = document.getElementById('res-beam-stress').textContent;
        var stressRatio = document.getElementById('res-beam-stress-ratio').textContent;

        var text = '=== BEAM DEFLECTION & STRUCTURAL ANALYSIS REPORT ===\\n' +
          'Condition: ' + cond + '\\n' +
          'Clear Span: ' + spanFt + ' ft ' + spanIn + ' in\\n' +
          'Applied Load: ' + loadVal + ' ' + loadUnit + '\\n' +
          '--------------------------------------------------\\n' +
          'Max Elastic Deflection (δ): ' + delta + ' (' + frac + ')\\n' +
          'Deflection Ratio: ' + ratio + ' [' + status + ']\\n' +
          'Max Bending Moment (M): ' + moment + '\\n' +
          'Extreme Fiber Stress (σ): ' + stress + '\\n' +
          'Stress Check: ' + stressRatio + '\\n' +
          'Engineering Standard: AISC / NDS Timber Specifications\\n' +
          'Generated via Digital Tools Shed (https://digitaltoolsshed.com/calc/beam-deflection-calculator)';

        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copy-beam-summary-btn');
          var orig = btn.innerHTML;
          btn.innerHTML = '<span>✓</span> Copied Beam Structural Report!';
          setTimeout(function() { btn.innerHTML = orig; }, 2500);
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', calcBeamDeflection);
      } else {
        calcBeamDeflection();
      }
    </script>
  `;

  writeFileSync(join(calcDir, 'beam-deflection-calculator.html'), renderTradePage({
    title: "Beam Deflection, Bending Stress & Moment of Inertia Calculator | Digital Tools Shed",
    metaDesc: "Calculate beam deflection, bending stress, and moment of inertia for simply supported and cantilever wood, LVL, and steel beams. Check L/360 and L/240 limits.",
    canonical: `${DOMAIN}/calc/beam-deflection-calculator`,
    bodyContent: beamDeflectionBody,
    currentPath: '/calc/beam-deflection-calculator',
    faq: [
      {
        "q": "What is the difference between L/360, L/240, and L/180 deflection limits?",
        "a": "Under building codes: L/360 is the live load deflection limit for floors with brittle plaster or tile ceilings; L/240 is the total load limit for drywall ceilings; and L/180 is the total load limit for roof rafters without ceilings."
      },
      {
        "q": "How do you calculate the moment of inertia for a rectangular wood beam?",
        "a": "For any rectangular beam bent about its strong axis: I = (b * d³) / 12, where b is actual dressed width and d is actual dressed depth (e.g. 1.5\" x 9.25\" for a nominal 2x10)."
      },
      {
        "q": "Why does beam depth matter much more than beam width?",
        "a": "Stiffness increases linearly with width, but increases with the cube of depth (d³). Doubling beam depth increases bending resistance eightfold (8x) using the same volume of material as doubling beam width."
      },
      {
        "q": "What is the modulus of elasticity (E) of wood versus steel?",
        "a": "Standard framing lumber has an elastic modulus of 1.4 to 1.6 million PSI, while structural steel has an E of 29 million PSI—making steel over 18 times stiffer than timber of identical dimensions."
      },
      {
        "q": "How does cantilever deflection compare to simply supported beam deflection?",
        "a": "A cantilever beam subjected to a concentrated end point load deflects 16 times more than an identical simply supported beam with a center point load over the same span length."
      }
    ]
  }));


  console.log('  ✓ Built Trade & Construction Suite (15 calculators in /calc/)');
}

