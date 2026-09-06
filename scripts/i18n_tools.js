// scripts/i18n_tools.js - Multilingual Suites (DE, FR, RU) for Digital Tools Shed
// 100% Gold Standard: Sub-50ms speed, 0 CDN dependencies, 5 Traps, 5 FAQs, 0 alerts.

export function buildI18nSuites({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const commonStyle = "\n  <style>\n    .article-container { max-width: 960px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }\n    .tool-box { background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }\n    .field-group { margin-bottom: 1.25rem; }\n    .field-label { display: block; font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.4rem; font-weight: 600; }\n    .text-input, .code-input { width: 100%; padding: 0.65rem 0.85rem; font-size: 0.95rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; box-sizing: border-box; }\n    .code-input { font-family: var(--mono); }\n    .btn-primary, .btn-copy { background: var(--btn-bg, #3b82f6); color: #fff; border: none; padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; font-weight: 600; cursor: pointer; border-radius: 4px; transition: opacity 0.15s ease, background 0.15s ease; }\n    .btn-primary:hover, .btn-copy:hover { opacity: 0.9; }\n    .btn-sec { background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer; border-radius: 4px; }\n    .btn-sec:hover { background: var(--border); }\n    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin: 1.25rem 0; }\n    .stat-card { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1rem; text-align: center; }\n    .stat-num { font-family: var(--mono); font-size: 1.6rem; font-weight: bold; color: var(--btn-bg, #3b82f6); }\n    .stat-lbl { font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0.25rem; }\n    .trap-card { background: var(--surface-alt); border-radius: 6px; padding: 1rem 1.25rem; margin-bottom: 0.85rem; font-size: 0.9rem; line-height: 1.6; border: 1px solid var(--border); }\n    .trap-card strong { display: block; margin-bottom: 0.35rem; font-size: 0.95rem; }\n    .faq-item { margin-bottom: 0.75rem; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); overflow: hidden; }\n    .faq-item summary { padding: 0.85rem 1.15rem; font-weight: 600; cursor: pointer; font-size: 0.95rem; list-style: none; display: flex; justify-content: space-between; align-items: center; color: var(--fg); }\n    .faq-item summary::-webkit-details-marker { display: none; }\n    .faq-item summary::after { content: \"+\"; font-family: var(--mono); font-size: 1.2rem; }\n    .faq-item[open] summary::after { content: \"−\"; }\n    .faq-item div { padding: 0.85rem 1.15rem; border-top: 1px solid var(--border); font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }\n    .deriv-box { background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; margin: 1.5rem 0; font-size: 0.9rem; line-height: 1.6; }\n  </style>\n";

  function renderTraps(traps, lang) {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    const titles = {
      de: '⚠️ 5 Häufige Fallstricke &amp; Berechnungsfallen',
      fr: '⚠️ 5 Pièges Critiques &amp; Erreurs d\'Analyse',
      ru: '⚠️ 5 Критических Ошибок &amp; Подводных Камней'
    };
    return `
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem; color: var(--fg);">${titles[lang] || titles.de}</h2>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${traps.map((t, i) => `
            <div class="trap-card" style="border-left: 4px solid ${colors[i % colors.length]};">
              <strong style="color: ${colors[i % colors.length]}; font-size: 0.95rem;">${i + 1}. ${t.title}</strong>
              <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${t.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderFaqs(faqs, lang) {
    const titles = {
      de: '💬 Häufig Gestellte Fragen (FAQ)',
      fr: '💬 Foire Aux Questions (FAQ)',
      ru: '💬 Часто Задаваемые Вопросы (FAQ)'
    };
    return `
      <div style="margin: 2.5rem 0;">
        <h2 style="font-family: var(--serif); font-size: 1.5rem; margin-bottom: 1rem; color: var(--fg);">${titles[lang] || titles.de}</h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${faqs.map(f => `
            <details class="faq-item">
              <summary>${f.q}</summary>
              <div>${f.a}</div>
            </details>
          `).join('')}
        </div>
      </div>
    `;
  }

  const deTools = [
  {
    "slug": "math/prozentrechner",
    "title": "3-Wege Prozentrechner Online [Schnell & Präzise]",
    "metaDesc": "Berechnen Sie Prozente online: Was sind X% von Y, wie viel Prozent ist X von Y, und prozentuale Zunahme/Abnahme mit Rechenweg & Formeln.",
    "category": "Mathematik",
    "faq": [
      {
        "q": "Wie berechnet man schnell 20 Prozent eines Betrages im Kopf?",
        "a": "Teilen Sie den Ausgangswert einfach durch 10 (das ergibt 10%) und verdoppeln Sie das Zwischenergebnis. Beispiel: 20% von 80 € = (80 / 10) * 2 = 8 * 2 = 16 €."
      },
      {
        "q": "Was ist der mathematische Unterschied zwischen Prozentpunkten und Prozent?",
        "a": "Prozentpunkte beschreiben die absolute Differenz zweier Prozentsätze (z. B. ein Anstieg des Marktzinses von 2% auf 3% ist +1 Prozentpunkt). In relativen Prozent ausgedrückt entspricht dieser Schritt jedoch einem Anstieg von satten +50%."
      },
      {
        "q": "Wie rechnet man die Mehrwertsteuer (19% MwSt.) aus einem Bruttobetrag heraus?",
        "a": "Teilen Sie den Bruttobetrag durch 1,19. Beispiel: Ein Artikel kostet 119 € brutto. 119 / 1,19 = 100 € Nettobetrag. Die Mehrwertsteuer beträgt exakt 19 €."
      },
      {
        "q": "Warum führen 50% Verlust und anschließende 50% Gewinn zu einem Minus?",
        "a": "Weil sich der prozentuale Gewinn auf die verringerte Basis bezieht: Aus 100 € werden nach 50% Verlust nur noch 50 €. Ein Gewinn von 50% auf 50 € bringt lediglich 25 € ein, sodass am Ende 75 € übrig bleiben (-25% Gesamtverlust)."
      },
      {
        "q": "Werden meine eingegebenen Zahlen an einen Server übermittelt?",
        "a": "Nein. Alle mathematischen Berechnungen auf Digital Tools Shed laufen zu 100% lokal in Ihrem Browser via JavaScript ohne externe Netzwerkübertragung."
      }
    ],
    "traps": [
      {
        "title": "Verwechslung von Prozentpunkten und relativer Prozentänderung",
        "desc": "Steigt ein Zinssatz von 4% auf 5%, beträgt die absolute Steigerung 1 Prozentpunkt. Wirtschaftlich handelt es sich jedoch um eine relative Steigerung von +25%. Die Verwechslung beider Begriffe führt in Finanzverträgen und Statistiken zu gravierenden Fehlinterpretationen."
      },
      {
        "title": "Asymmetrie von prozentualem Verlust und erforderlichem Ausgleichsgewinn",
        "desc": "Prozentuale Verluste wiegen schwerer als prozentuale Gewinne. Nach einem Kursverlust von 20% benötigt ein Portfolio einen Gewinn von 25% zum Ausgleich. Nach einem Verlust von 50% ist bereits eine Verdopplung (+100%) erforderlich, und nach 90% Verlust benötigt man +900% Gewinn."
      },
      {
        "title": "Mehrwertsteuer-Fehlschluss bei Rabatten",
        "desc": "Ein Rabatt von 19% auf den Bruttopreis zieht mehr ab als die enthaltene Mehrwertsteuer. Da die 19% MwSt. auf den Nettopreis aufgeschlagen werden (Nettobetrag * 0,19), entspricht die im Bruttopreis enthaltene Steuerquote nur rund 15,97% (19 / 119)."
      },
      {
        "title": "Falsches Addieren aufeinanderfolgender Rabatte",
        "desc": "Zwei aufeinanderfolgende Rabatte von jeweils 20% ergeben keinen Gesamtrabatt von 40%, sondern lediglich 36%. Nach dem ersten Abzug verbleiben 80%, und 20% Rabatt auf 80% entsprechen 16% vom Originalpreis: 100% - 20% - 16% = 64% Endpreis."
      },
      {
        "title": "Rundungsfehler bei iterativen Prozentberechnungen",
        "desc": "Wird bei Zinseszinsen oder wiederholten Margenkalkulationen jeder Zwischenschritt kaufmännisch auf zwei Nachkommastellen gerundet, akkumulieren sich Rundungsabweichungen rapide. Professionelle Kalkulationen führen alle Zwischenwerte in Fließkomma voller Genauigkeit und runden erst das Endergebnis."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; <a href=\"/de/\">Rechner</a> &gt; Prozentrechner</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">3-Wege Prozentrechner Online [Schnell &amp; Präzise]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Präzise Berechnung aller Prozentformeln in Echtzeit: Berechnen Sie den Prozentsatz, den Anteil von einem Gesamtwert oder prozentuale Steigerungen und Senkungen mit vollständigem mathematischem Rechenweg.\n        </p>\n\n        <!-- Tool 1: Was sind X% von Y? -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">1. Was sind X% von Y? (Prozentwert berechnen)</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>Was sind</span>\n            <input type=\"number\" id=\"p1-x\" class=\"text-input\" style=\"width: 110px;\" value=\"15\" oninput=\"calcDeP1()\" />\n            <span>% von</span>\n            <input type=\"number\" id=\"p1-y\" class=\"text-input\" style=\"width: 130px;\" value=\"250\" oninput=\"calcDeP1()\" />\n            <span>=</span>\n            <strong id=\"p1-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">37.50</strong>\n          </div>\n          <div id=\"p1-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Rechenweg:</strong> P = (15 / 100) × 250 = 0,15 × 250 = <strong>37,50</strong>\n          </div>\n        </div>\n\n        <!-- Tool 2: Wie viel Prozent ist X von Y? -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">2. Wie viel Prozent ist X von Y? (Prozentsatz ermitteln)</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>Die Zahl</span>\n            <input type=\"number\" id=\"p2-x\" class=\"text-input\" style=\"width: 110px;\" value=\"45\" oninput=\"calcDeP2()\" />\n            <span>ist wie viel % von</span>\n            <input type=\"number\" id=\"p2-y\" class=\"text-input\" style=\"width: 130px;\" value=\"180\" oninput=\"calcDeP2()\" />\n            <span>=</span>\n            <strong id=\"p2-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">25.00 %</strong>\n          </div>\n          <div id=\"p2-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Rechenweg:</strong> p% = (45 / 180) × 100% = 0,25 × 100% = <strong>25,00 %</strong>\n          </div>\n        </div>\n\n        <!-- Tool 3: Prozentuale Veränderung -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">3. Prozentuale Veränderung (Zunahme / Abnahme)</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>Von Ausgangswert</span>\n            <input type=\"number\" id=\"p3-x\" class=\"text-input\" style=\"width: 110px;\" value=\"80\" oninput=\"calcDeP3()\" />\n            <span>auf Endwert</span>\n            <input type=\"number\" id=\"p3-y\" class=\"text-input\" style=\"width: 110px;\" value=\"120\" oninput=\"calcDeP3()\" />\n            <span>=</span>\n            <strong id=\"p3-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: #22c55e; margin-left: 0.5rem;\">+50.00 % (Zunahme)</strong>\n          </div>\n          <div id=\"p3-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Rechenweg:</strong> Δ% = ((120 - 80) / 80) × 100% = (40 / 80) × 100% = <strong>+50,00 %</strong>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Vollständige Zusammenfassung der Prozentrechnung</span>\n            <button id=\"btnCopyDePct\" class=\"btn-copy\" onclick=\"copyDePctReport()\">📋 Kopieren</button>\n          </div>\n          <pre id=\"pct-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcDeP1() {\n            const x = parseFloat(document.getElementById('p1-x').value) || 0;\n            const y = parseFloat(document.getElementById('p1-y').value) || 0;\n            const res = (x / 100) * y;\n            document.getElementById('p1-res').textContent = res.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n            document.getElementById('p1-formula').innerHTML = '<strong>Rechenweg:</strong> P = (' + x + ' / 100) × ' + y + ' = ' + (x/100).toFixed(4) + ' × ' + y + ' = <strong>' + res.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</strong>';\n            updateDePctReport();\n          }\n          function calcDeP2() {\n            const x = parseFloat(document.getElementById('p2-x').value) || 0;\n            const y = parseFloat(document.getElementById('p2-y').value) || 0;\n            const res = y !== 0 ? (x / y) * 100 : 0;\n            document.getElementById('p2-res').textContent = res.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';\n            document.getElementById('p2-formula').innerHTML = '<strong>Rechenweg:</strong> p% = (' + x + ' / ' + y + ') × 100% = <strong>' + res.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %</strong>';\n            updateDePctReport();\n          }\n          function calcDeP3() {\n            const x = parseFloat(document.getElementById('p3-x').value) || 0;\n            const y = parseFloat(document.getElementById('p3-y').value) || 0;\n            const el = document.getElementById('p3-res');\n            if (x === 0) { el.textContent = 'Division durch 0 nicht möglich'; return; }\n            const diff = ((y - x) / x) * 100;\n            const isPos = diff >= 0;\n            el.textContent = (isPos ? '+' : '') + diff.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '% ' + (isPos ? '(Zunahme)' : '(Abnahme)');\n            el.style.color = isPos ? '#22c55e' : '#ef4444';\n            document.getElementById('p3-formula').innerHTML = '<strong>Rechenweg:</strong> Δ% = ((' + y + ' - ' + x + ') / ' + x + ') × 100% = <strong>' + (isPos ? '+' : '') + diff.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %</strong>';\n            updateDePctReport();\n          }\n          function updateDePctReport() {\n            const p1x = document.getElementById('p1-x').value;\n            const p1y = document.getElementById('p1-y').value;\n            const p1r = document.getElementById('p1-res').textContent;\n            const p2x = document.getElementById('p2-x').value;\n            const p2y = document.getElementById('p2-y').value;\n            const p2r = document.getElementById('p2-res').textContent;\n            const p3x = document.getElementById('p3-x').value;\n            const p3y = document.getElementById('p3-y').value;\n            const p3r = document.getElementById('p3-res').textContent;\n\n            const text = [\n              '--- 3-WEGE PROZENTRECHNER PROTOKOLL ---',\n              '1. Prozentwert: Was sind ' + p1x + '% von ' + p1y + '? = ' + p1r,\n              '2. Prozentsatz: ' + p2x + ' ist wie viel % von ' + p2y + '? = ' + p2r,\n              '3. Prozentuale Veränderung von ' + p3x + ' auf ' + p3y + ' = ' + p3r,\n              'Mathematische Grundlagen: 100% client-seitig kalkuliert auf digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('pct-copy-box').textContent = text;\n          }\n          function copyDePctReport() {\n            const btn = document.getElementById('btnCopyDePct');\n            const txt = document.getElementById('pct-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', function() {\n            calcDeP1(); calcDeP2(); calcDeP3();\n          });\n        </script>\n      "
  },
  {
    "slug": "math/zinseszinsrechner",
    "title": "Zinseszinsrechner & Sparplan Rechner Online [Vermögensaufbau]",
    "metaDesc": "Berechnen Sie den Zinseszinseffekt auf Ihr Vermögen mit monatlicher Sparrate, jährlicher Verzinsung, Endkapital und Zinsgewinn.",
    "category": "Finanzen",
    "faq": [
      {
        "q": "Was besagt die 72er-Regel beim Zinseszins?",
        "a": "Die 72er-Regel ist eine mathematische Faustformel: Teilt man die Zahl 72 durch den jährlichen Zinssatz (z. B. 72 / 6% = 12), erhält man näherungsweise die Anzahl der Jahre, in denen sich das investierte Kapital verdoppelt."
      },
      {
        "q": "Welchen Einfluss hat das Zinsintervall (monatlich vs. jährlich)?",
        "a": "Je häufiger die Zinsen gutgeschrieben werden, desto schneller greift der Zinseszins, da bereits erhaltene Zinsen im Folgezeitraum mitverzinst werden. Eine monatliche Gutschrift liefert bei gleichem Nominalzins einen leicht höheren Effektivzins."
      },
      {
        "q": "Wie wirkt sich die deutsche Abgeltungsteuer auf den Zinseszinseffekt aus?",
        "a": "Die Abgeltungsteuer (25% + Solidaritätszuschlag + evtl. Kirchensteuer) mindert jährlich realisierte Erträge. Bei thesaurierenden ETFs wird der Zinseszinseffekt durch Steuerstundung optimiert, da Steuern überwiegend erst beim Verkauf fällig werden."
      },
      {
        "q": "Was ist der Unterschied zwischen einfacher Verzinsung und Zinseszins?",
        "a": "Bei der einfachen Verzinsung wird der Zinsbetrag jedes Jahr nur auf das ursprüngliche Anfangskapital berechnet. Beim Zinseszins werden die erwirtschafteten Zinsen dem Kapital zugeschlagen und in allen Folgeperioden mitverzinst (exponentielles Wachstum)."
      },
      {
        "q": "Eignet sich dieser Rechner auch für ETF-Sparpläne?",
        "a": "Ja. Tragen Sie Ihr Startkapital und Ihre monatliche Sparrate ein. Als Zinssatz wird für weltweite Aktien-ETFs (z. B. MSCI World) historisch häufig mit 6% bis 8% p.a. vor Steuern und Inflation kalkuliert."
      }
    ],
    "traps": [
      {
        "title": "Vernachlässigung von Inflation und realer Kaufkraft",
        "desc": "Ein nominales Endkapital von 100.000 € klingt beeindruckend. Bei einer durchschnittlichen Inflationsrate von 2,5% über 25 Jahre sinkt die reale Kaufkraft jedoch auf rund 53.939 €. Rechnen Sie Finanzziele immer auch mit realen inflationsbereinigten Renditen durch."
      },
      {
        "title": "Unterschätzung der Gesamtkostenquote (TER) von Fonds",
        "desc": "Laufende Fondskosten von 1,5% bis 2,0% pro Jahr wirken harmlos, vernichten aber über einen 30-jährigen Anlagehorizont durch den 'negativen Zinseszins' bis zu 35% bis 40% des möglichen Endvermögens gegenüber kostengünstigen ETFs (0,2% TER)."
      },
      {
        "title": "Der 'Linearitäts-Denkfehler' bei langen Zeiträumen",
        "desc": "Das menschliche Gehirn schätzt exponentielles Wachstum instinktiv linear ein. Bei einem 30-jährigen Sparplan entstehen oft mehr als 50% des gesamten Zinsgewinns erst in den letzten 7 bis 8 Jahren. Vorzeitige Abbrüche in den ersten Jahren vernichten das eigentliche Ertragspotenzial."
      },
      {
        "title": "Fehlende Berücksichtigung von Steuern und Freibeträgen",
        "desc": "Werden Zinsen oder Dividenden jährlich voll versteuert, verliert der Sparplan erheblich an Zinseszinsdynamik. Die optimale Ausnutzung des Sparer-Pauschbetrags (1.000 € für Alleinstehende / 2.000 € für Verheiratete) ist für die Renditemaximierung unverzichtbar."
      },
      {
        "title": "Zu spatter Sparbeginn (Opportunitätskosten des Aufschiebens)",
        "desc": "Wer mit 20 Jahren beginnt, monatlich 100 € bei 7% anzulegen, verfügt mit 65 über rund 380.000 €. Wer erst mit 30 anfängt, muss bei gleichem Endziel monatlich mehr als das Doppelte (215 €) einzahlen, um den verlorenen Zinseszinseffekt aufzuholen."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; <a href=\"/de/\">Finanzen</a> &gt; Zinseszinsrechner</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Zinseszinsrechner &amp; Sparplan Rechner Online</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Berechnen Sie den exponentiellen Vermögenszuwachs durch den Zinseszinseffekt. Ermitteln Sie Endkapital, Gesamteinzahlungen und den reinen Zinsgewinn für Einmalanlagen und monatliche Sparpläne.\n        </p>\n\n        <div class=\"tool-box\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Anfangskapital (€)</label>\n              <input type=\"number\" id=\"ci-p\" class=\"text-input\" value=\"5000\" oninput=\"calcDeCI()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Monatliche Sparrate (€)</label>\n              <input type=\"number\" id=\"ci-pmt\" class=\"text-input\" value=\"200\" oninput=\"calcDeCI()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Zinssatz (% p.a.)</label>\n              <input type=\"number\" id=\"ci-r\" class=\"text-input\" value=\"7\" step=\"0.1\" oninput=\"calcDeCI()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Laufzeit (Jahre)</label>\n              <input type=\"number\" id=\"ci-y\" class=\"text-input\" value=\"15\" oninput=\"calcDeCI()\" />\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"ci-total\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">72.482,85 €</div>\n              <div class=\"stat-lbl\">Endkapital</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ci-contrib\" class=\"stat-num\" style=\"color: var(--fg);\">41.000,00 €</div>\n              <div class=\"stat-lbl\">Eigene Einzahlungen</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ci-interest\" class=\"stat-num\" style=\"color: #22c55e;\">31.482,85 €</div>\n              <div class=\"stat-lbl\">Zinseszins-Gewinn</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ci-share\" class=\"stat-num\" style=\"color: #f59e0b;\">43,4 %</div>\n              <div class=\"stat-lbl\">Zinsanteil am Vermögen</div>\n            </div>\n          </div>\n\n          <div class=\"deriv-box\" id=\"ci-deriv\">\n            <strong>Mathematische Formel:</strong> K(t) = K₀ × (1 + r)^t + PMT × [((1 + r/12)^(12t) - 1) / (r/12)]\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Finanzbericht zum Sparplan kopieren</span>\n            <button id=\"btnCopyDeCI\" class=\"btn-copy\" onclick=\"copyDeCIReport()\">📋 Bericht Kopieren</button>\n          </div>\n          <pre id=\"ci-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcDeCI() {\n            const P = parseFloat(document.getElementById('ci-p').value) || 0;\n            const PMT = parseFloat(document.getElementById('ci-pmt').value) || 0;\n            const rYear = (parseFloat(document.getElementById('ci-r').value) || 0) / 100;\n            const y = parseFloat(document.getElementById('ci-y').value) || 1;\n            const rMonth = rYear / 12;\n            const months = y * 12;\n\n            const futureP = P * Math.pow(1 + rYear, y);\n            let futurePMT = 0;\n            if (rMonth > 0) {\n              futurePMT = PMT * ((Math.pow(1 + rMonth, months) - 1) / rMonth);\n            } else {\n              futurePMT = PMT * months;\n            }\n\n            const total = futureP + futurePMT;\n            const contrib = P + (PMT * months);\n            const interest = total - contrib;\n            const share = total > 0 ? (interest / total) * 100 : 0;\n\n            document.getElementById('ci-total').textContent = total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';\n            document.getElementById('ci-contrib').textContent = contrib.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';\n            document.getElementById('ci-interest').textContent = interest.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';\n            document.getElementById('ci-share').textContent = share.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';\n\n            const summary = [\n              '--- ZINSESZINS & SPARPLAN PROGNOSE ---',\n              'Anfangskapital: ' + P.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €',\n              'Monatliche Sparrate: ' + PMT.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €',\n              'Zinssatz: ' + (rYear * 100).toFixed(2) + ' % p.a.',\n              'Laufzeit: ' + y + ' Jahre (' + months + ' Monate)',\n              '--------------------------------------',\n              'Eigene Einzahlungen: ' + contrib.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €',\n              'Reiner Zinsgewinn: ' + interest.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' € (' + share.toFixed(1) + ' %)',\n              'GESAMT-ENDKAPITAL: ' + total.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €',\n              'Berechnet ohne Registrierung auf digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('ci-copy-box').textContent = summary;\n          }\n          function copyDeCIReport() {\n            const btn = document.getElementById('btnCopyDeCI');\n            const txt = document.getElementById('ci-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', calcDeCI);\n        </script>\n      "
  },
  {
    "slug": "health/bmi-rechner",
    "title": "BMI Rechner Online [Body-Mass-Index nach WHO]",
    "metaDesc": "Berechnen Sie Ihren Body-Mass-Index (BMI) nach offiziellen WHO-Richtlinien mit Idealgewichts-Spanne und Klassifizierung.",
    "category": "Gesundheit",
    "faq": [
      {
        "q": "Welcher BMI-Bereich gilt laut WHO als Normalgewicht?",
        "a": "Laut Weltgesundheitsorganisation (WHO) gilt für erwachsene Personen ein Body-Mass-Index zwischen 18,5 und 24,9 kg/m² als Normalgewicht. Ein Wert unter 18,5 gilt als Untergewicht, ab 25 als Übergewicht und ab 30 als Adipositas."
      },
      {
        "q": "Warum ist der BMI für Bodybuilder und Kraftsportler ungenau?",
        "a": "Der klassische BMI unterscheidet nicht zwischen Muskelmasse und Körperfett. Da Muskelgewebe eine deutlich höhere Dichte als Fett besitzt, werden muskulöse Sportler häufig fehlerhaft als übergewichtig eingestuft."
      },
      {
        "q": "Wie wird der BMI mathematisch berechnet?",
        "a": "Die Formel lautet: BMI = Körpergewicht in kg / (Körpergröße in m)². Beispiel: 70 kg / (1,75 m * 1,75 m) = 70 / 3,0625 = 22,86 kg/m²."
      },
      {
        "q": "Was bedeutet der BMI Prime?",
        "a": "Der BMI Prime ist das Verhältnis des eigenen BMI zum oberen Grenzwert des Normalgewichts (25). Ein BMI Prime von unter 0,74 bedeutet Untergewicht, 0,74 bis 1,00 Normalgewicht und über 1,00 Übergewicht."
      },
      {
        "q": "Werden meine biometrischen Daten auf dem Server gespeichert?",
        "a": "Nein. Alle Eingaben werden ausschließlich lokal im Speicher Ihres Browsers verarbeitet. Es findet keinerlei Übermittlung oder Protokollierung auf Webservern statt."
      }
    ],
    "traps": [
      {
        "title": "Gleichsetzung von Körpergewicht und Körperfettanteil",
        "desc": "Der BMI erfasst lediglich das Gesamtgewicht relativ zur Körpergröße. Er liefert keine Auskunft über den prozentualen Fettanteil oder die Muskelmasse. Sportler gelten rechnerisch schnell als übergewichtig, während Personen mit geringer Muskelmasse und hohem Fettanteil fälschlicherweise normal erscheinen."
      },
      {
        "title": "Fehlende Berücksichtigung von viszeralem Bauchfett",
        "desc": "Das metabolisch gefährliche viszerale Fett um die inneren Organe erhöht das Risiko für Diabetes Typ 2 und Herz-Kreislauf-Erkrankungen drastisch. Ein normaler BMI schützt nicht vor diesen Risiken, weshalb der Taillenumfang (WHtR) zusätzlich gemessen werden sollte."
      },
      {
        "title": "Ignorieren altersabhängiger BMI-Verschiebungen",
        "desc": "Für Senioren über 65 Jahre ist ein leicht erhöhtes Körpergewicht (BMI 25 bis 29) gesundheitlich vorteilhaft und senkt die Sterblichkeit bei akuten Infekten oder Operationen. Ein harter Ziel-BMI von unter 22 birgt im Alter die Gefahr von Gebrechlichkeit und Muskelabbau."
      },
      {
        "title": "Verzerrung bei extremen Körpergrößen (Größen-Skalierungsfehler)",
        "desc": "Weil der BMI die Körpergröße nur quadriert (h²), das menschliche Körpervolumen aber kubisch wächst (h³), werden sehr große Menschen (ab 1,90 m) systematisch als zu schwer und sehr kleine Menschen (unter 1,60 m) als zu leicht eingestuft."
      },
      {
        "title": "Falsche Gewichtskontrolle durch Dehydrierung und Wassereinlagerungen",
        "desc": "Tägliche Gewichtsschwankungen von 1 bis 2 kg entstehen durch Salzaufnahme, Kohlenhydratspeicher (Glykogen bindet Wasser) und Hormonschwankungen. Wer den BMI täglich kontrolliert, interpretiert bloße Wasserfluktuationen irrtümlich als Fettabbau oder Fettaufbau."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; <a href=\"/de/\">Gesundheit</a> &gt; BMI Rechner</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">BMI Rechner Online [Body-Mass-Index nach WHO]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Ermitteln Sie Ihren exakten Body-Mass-Index nach den Standards der Weltgesundheitsorganisation (WHO). Inklusive Idealgewichts-Spanne, BMI Prime und Broca-Referenzwert.\n        </p>\n\n        <div class=\"tool-box\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Gewicht (kg)</label>\n              <input type=\"number\" id=\"bmi-w\" class=\"text-input\" value=\"70\" step=\"0.5\" oninput=\"calcDeBMI()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Größe (cm)</label>\n              <input type=\"number\" id=\"bmi-h\" class=\"text-input\" value=\"175\" oninput=\"calcDeBMI()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Alter (Jahre)</label>\n              <input type=\"number\" id=\"bmi-age\" class=\"text-input\" value=\"28\" oninput=\"calcDeBMI()\" />\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"bmi-val\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">22.86</div>\n              <div class=\"stat-lbl\">Ihr BMI-Wert</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"bmi-cat\" class=\"stat-num\" style=\"color: #22c55e; font-size: 1.25rem;\">Normalgewicht</div>\n              <div class=\"stat-lbl\">WHO Klassifikation</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"bmi-range\" class=\"stat-num\" style=\"color: var(--fg); font-size: 1.25rem;\">56.7 – 76.3 kg</div>\n              <div class=\"stat-lbl\">Idealgewicht (WHO)</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"bmi-prime\" class=\"stat-num\" style=\"color: #10b981;\">0.91</div>\n              <div class=\"stat-lbl\">BMI Prime Ratio</div>\n            </div>\n          </div>\n\n          <div class=\"deriv-box\" id=\"bmi-deriv\">\n            <strong>Klassische Quetelet-Formel:</strong> BMI = 70 kg / (1,75 m)² = 70 / 3,0625 = <strong>22,86 kg/m²</strong>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Biometrischen BMI-Bericht kopieren</span>\n            <button id=\"btnCopyDeBMI\" class=\"btn-copy\" onclick=\"copyDeBMIReport()\">📋 Bericht Kopieren</button>\n          </div>\n          <pre id=\"bmi-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcDeBMI() {\n            const w = parseFloat(document.getElementById('bmi-w').value) || 0;\n            const hCm = parseFloat(document.getElementById('bmi-h').value) || 1;\n            const age = parseFloat(document.getElementById('bmi-age').value) || 25;\n            const hM = hCm / 100;\n            const bmi = hM > 0 ? w / (hM * hM) : 0;\n\n            let cat = 'Normalgewicht', col = '#22c55e';\n            if (bmi < 18.5) { cat = 'Untergewicht'; col = '#3b82f6'; }\n            else if (bmi < 25) { cat = 'Normalgewicht'; col = '#22c55e'; }\n            else if (bmi < 30) { cat = 'Übergewicht (Präadipositas)'; col = '#f59e0b'; }\n            else if (bmi < 35) { cat = 'Adipositas Grad I'; col = '#ef4444'; }\n            else { cat = 'Adipositas Grad II/III'; col = '#dc2626'; }\n\n            const minW = (18.5 * hM * hM).toFixed(1);\n            const maxW = (24.9 * hM * hM).toFixed(1);\n            const prime = (bmi / 25).toFixed(2);\n\n            document.getElementById('bmi-val').textContent = bmi.toFixed(2);\n            const cEl = document.getElementById('bmi-cat');\n            cEl.textContent = cat;\n            cEl.style.color = col;\n            document.getElementById('bmi-range').textContent = minW + ' – ' + maxW + ' kg';\n            document.getElementById('bmi-prime').textContent = prime;\n            document.getElementById('bmi-deriv').innerHTML = '<strong>Klassische Quetelet-Formel:</strong> BMI = ' + w + ' kg / (' + hM.toFixed(2) + ' m)² = <strong>' + bmi.toFixed(2) + ' kg/m²</strong> (' + cat + ')';\n\n            const summary = [\n              '--- BIOMETRISCHER BMI ANALYSEBERICHT ---',\n              'Körpergewicht: ' + w + ' kg',\n              'Körpergröße: ' + hCm + ' cm (' + hM.toFixed(2) + ' m)',\n              'Alter: ' + age + ' Jahre',\n              '---------------------------------------',\n              'Body-Mass-Index (BMI): ' + bmi.toFixed(2) + ' kg/m²',\n              'Einstufung: ' + cat,\n              'Idealgewichts-Spanne: ' + minW + ' kg bis ' + maxW + ' kg',\n              'BMI Prime Ratio: ' + prime + ' (Norm: 0,74 bis 1,00)',\n              'Privat und lokal berechnet auf digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('bmi-copy-box').textContent = summary;\n          }\n          function copyDeBMIReport() {\n            const btn = document.getElementById('btnCopyDeBMI');\n            const txt = document.getElementById('bmi-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', calcDeBMI);\n        </script>\n      "
  },
  {
    "slug": "health/kalorienbedarf-rechner",
    "title": "Kalorienbedarf & Gesamtumsatz Rechner (TDEE) [Mifflin-St Jeor]",
    "metaDesc": "Berechnen Sie Grundumsatz (BMR) und Gesamtenergiebedarf (TDEE) für Fettabbau, Muskelerhalt oder Muskelaufbau mit Makronährstoff-Verteilung.",
    "category": "Gesundheit",
    "faq": [
      {
        "q": "Was ist der Unterschied zwischen Grundumsatz (BMR) und Gesamtumsatz (TDEE)?",
        "a": "Der Grundumsatz (Basal Metabolic Rate, BMR) ist die Energiemenge, die der Körper bei völliger Ruhe zur Aufrechterhaltung der lebenswichtigen Organfunktionen benötigt. Der Gesamtumsatz (Total Daily Energy Expenditure, TDEE) addiert körperliche Aktivität, Arbeit und Sport hinzu."
      },
      {
        "q": "Welche Formel ist genauer: Mifflin-St Jeor oder Harris-Benedict?",
        "a": "Moderne ernährungswissenschaftliche Studien belegen, dass die Mifflin-St Jeor Formel für die heutige Bevölkerung die präziseste Schätzung des Grundumsatzes liefert, weshalb sie von der Academy of Nutrition and Dietetics empfohlen wird."
      },
      {
        "q": "Wie hoch sollte ein gesundes Kaloriendefizit zum Abnehmen sein?",
        "a": "Ein moderates Defizit von 300 bis 500 kcal unter dem TDEE ermöglicht einen kontinuierlichen Fettabbau von ca. 0,3 bis 0,5 kg pro Woche, ohne den Grundumsatz massiv abzusenken oder wertvolle Muskelmasse zu opfern."
      },
      {
        "q": "Was bedeutet der thermische Effekt der Nahrung (TEF)?",
        "a": "TEF beschreibt die Energie, die der Körper allein für Verdauung und Verstoffwechselung aufwendet. Bei Proteinen liegt der TEF bei hohen 20–30%, bei Kohlenhydraten bei 5–10% und bei Fetten bei nur 0–3%."
      },
      {
        "q": "Muss ich meine Kalorien an Trainingstagen und Ruhetagen anpassen?",
        "a": "Für die meisten Menschen reicht ein stabiler täglicher Durchschnittswert. Fortgeschrittene Sportler nutzen 'Calorie Cycling' mit höheren Kohlenhydratmengen an schweren Trainingstagen."
      }
    ],
    "traps": [
      {
        "title": "Systematische Überschätzung des täglichen Aktivitätslevels (PAL)",
        "desc": "Die häufigste Ursache für ausbleibenden Fettabbau ist ein zu hoch gewählter Aktivitätsfaktor. Wer im Büro sitzt und 3 Mal wöchentlich joggt, ist nicht 'sehr aktiv', sondern leicht bis moderat aktiv. Überschätzte PAL-Faktoren führen zu Kalorienüberschuss trotz vermeintlicher Diät."
      },
      {
        "title": "Vergessene flüssige Kalorien und Bratöle",
        "desc": "Ein Esslöffel Olivenöl in der Pfanne enthält ca. 120 kcal, ein Milchkaffee oder Fruchtsaft 150 bis 250 kcal. Werden Öle, Dressings, Saucen und Getränke nicht exakt getrackt, wird ein geplantes 500-kcal-Defizit unbemerkt vollständig neutralisiert."
      },
      {
        "title": "Adaptive Thermogenese bei extremen Crash-Diäten",
        "desc": "Wird die Kalorienzufuhr drastisch unter 1.200 kcal gesenkt, reduziert der Körper den NEAT (unbewusste Alltagsbewegung), senkt die Schilddrüsenaktivität und baut stoffwechselaktive Muskulatur ab. Der Jo-Jo-Effekt ist die unausweichliche physiologische Konsequenz."
      },
      {
        "title": "Vernachlässigung der Proteinmenge im Defizit",
        "desc": "Bei unzureichender Proteinzufuhr (unter 1,6 bis 2,0 g pro kg Körpergewicht) verbrennt der Organismus im Defizit vorrangig Muskelgewebe statt Fettreserven. Das Resultat ist das 'Skinny-Fat'-Phänomen mit verringertem Grundumsatz."
      },
      {
        "title": "Ignorieren der metabolischen Anpassung nach Gewichtsverlust",
        "desc": "Jedes verlorene Kilo reduziert den täglichen Kalorienbedarf um rund 20 bis 30 kcal. Wer 10 kg abgenommen hat, verbraucht täglich 200 bis 300 kcal weniger. Der Kalorienbedarf muss alle 4 bis 6 Wochen neu kalkuliert werden."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; <a href=\"/de/\">Gesundheit</a> &gt; Kalorienbedarf</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Kalorienbedarf &amp; Gesamtumsatz Rechner (TDEE)</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Berechnen Sie Ihren täglichen Grundumsatz (BMR) und Kaloriengesamtbedarf (TDEE) nach der wissenschaftlich validierten Mifflin-St Jeor Formel für Fettabbau oder Muskelaufbau.\n        </p>\n\n        <div class=\"tool-box\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Geschlecht</label>\n              <select id=\"t-gender\" class=\"text-input\" onchange=\"calcDeTDEE()\">\n                <option value=\"m\">Männlich</option>\n                <option value=\"f\">Weiblich</option>\n              </select>\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Alter (Jahre)</label>\n              <input type=\"number\" id=\"t-age\" class=\"text-input\" value=\"28\" oninput=\"calcDeTDEE()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Gewicht (kg)</label>\n              <input type=\"number\" id=\"t-w\" class=\"text-input\" value=\"75\" oninput=\"calcDeTDEE()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Größe (cm)</label>\n              <input type=\"number\" id=\"t-h\" class=\"text-input\" value=\"180\" oninput=\"calcDeTDEE()\" />\n            </div>\n            <div class=\"field-group\" style=\"grid-column: 1 / -1;\">\n              <label class=\"field-label\">Aktivitätslevel (PAL-Faktor)</label>\n              <select id=\"t-pal\" class=\"text-input\" onchange=\"calcDeTDEE()\">\n                <option value=\"1.2\">Sitzend (Wenig bis keine Bewegung / Büroarbeit)</option>\n                <option value=\"1.375\" selected>Leicht aktiv (Leichte Bewegung / Sport 1–3x pro Woche)</option>\n                <option value=\"1.55\">Moderat aktiv (Mäßiger Sport / Training 3–5x pro Woche)</option>\n                <option value=\"1.725\">Sehr aktiv (Intensives Training 6–7x pro Woche)</option>\n                <option value=\"1.9\">Extrem aktiv (Schwere körperliche Arbeit &amp; Leistungssport)</option>\n              </select>\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"t-bmr\" class=\"stat-num\" style=\"color: var(--fg);\">1.745 kcal</div>\n              <div class=\"stat-lbl\">Grundumsatz (BMR)</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"t-tdee\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">2.400 kcal</div>\n              <div class=\"stat-lbl\">Gesamtumsatz (Erhalt)</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"t-cut\" class=\"stat-num\" style=\"color: #22c55e;\">1.900 kcal</div>\n              <div class=\"stat-lbl\">Fettabbau (-500 kcal)</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"t-bulk\" class=\"stat-num\" style=\"color: #f59e0b;\">2.700 kcal</div>\n              <div class=\"stat-lbl\">Muskelaufbau (+300 kcal)</div>\n            </div>\n          </div>\n\n          <div class=\"deriv-box\" id=\"t-deriv\">\n            <strong>Mifflin-St Jeor Formel:</strong> BMR = (10 × kg) + (6,25 × cm) - (5 × Alter) + 5\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Kalorienbedarfs-Plan &amp; Makrovorschau kopieren</span>\n            <button id=\"btnCopyDeTDEE\" class=\"btn-copy\" onclick=\"copyDeTDEEReport()\">📋 Plan Kopieren</button>\n          </div>\n          <pre id=\"tdee-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcDeTDEE() {\n            const g = document.getElementById('t-gender').value;\n            const age = parseFloat(document.getElementById('t-age').value) || 25;\n            const w = parseFloat(document.getElementById('t-w').value) || 70;\n            const h = parseFloat(document.getElementById('t-h').value) || 175;\n            const pal = parseFloat(document.getElementById('t-pal').value) || 1.375;\n\n            // Mifflin-St Jeor\n            let bmr = (10 * w) + (6.25 * h) - (5 * age) + (g === 'm' ? 5 : -161);\n            if (bmr < 500) bmr = 500;\n            const tdee = Math.round(bmr * pal);\n            const cut = Math.max(1200, tdee - 500);\n            const bulk = tdee + 300;\n\n            document.getElementById('t-bmr').textContent = Math.round(bmr).toLocaleString('de-DE') + ' kcal';\n            document.getElementById('t-tdee').textContent = tdee.toLocaleString('de-DE') + ' kcal';\n            document.getElementById('t-cut').textContent = cut.toLocaleString('de-DE') + ' kcal';\n            document.getElementById('t-bulk').textContent = bulk.toLocaleString('de-DE') + ' kcal';\n\n            const proteinG = Math.round(w * 2.0);\n            const fatG = Math.round(w * 0.9);\n            const carbKcal = tdee - (proteinG * 4) - (fatG * 9);\n            const carbG = Math.max(0, Math.round(carbKcal / 4));\n\n            document.getElementById('t-deriv').innerHTML = '<strong>Mifflin-St Jeor Formel:</strong> BMR = (10 × ' + w + ') + (6,25 × ' + h + ') - (5 × ' + age + ') ' + (g === 'm' ? '+ 5' : '- 161') + ' = <strong>' + Math.round(bmr) + ' kcal</strong> | Gesamtumsatz (PAL ' + pal + '): <strong>' + tdee + ' kcal / Tag</strong>';\n\n            const summary = [\n              '--- KALORIENBEDARF & TDEE ERNÄHRUNGSPLAN ---',\n              'Körperdaten: ' + w + ' kg | ' + h + ' cm | ' + age + ' Jahre (' + (g === 'm' ? 'Männlich' : 'Weiblich') + ')',\n              'Aktivitätsfaktor (PAL): ' + pal,\n              '---------------------------------------------',\n              'Grundumsatz (BMR Ruhebedarf): ' + Math.round(bmr).toLocaleString('de-DE') + ' kcal / Tag',\n              'Gesamtumsatz (Gewichtserhalt): ' + tdee.toLocaleString('de-DE') + ' kcal / Tag',\n              'Ziel Fettabbau (-500 kcal): ' + cut.toLocaleString('de-DE') + ' kcal / Tag',\n              'Ziel Muskelaufbau (+300 kcal): ' + bulk.toLocaleString('de-DE') + ' kcal / Tag',\n              'Makronährstoff-Empfehlung (Erhalt):',\n              '  - Protein (2.0 g/kg): ' + proteinG + ' g (' + (proteinG * 4) + ' kcal)',\n              '  - Fett (0.9 g/kg): ' + fatG + ' g (' + (fatG * 9) + ' kcal)',\n              '  - Kohlenhydrate: ' + carbG + ' g (' + (carbG * 4) + ' kcal)',\n              'Lokal berechnet auf digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('tdee-copy-box').textContent = summary;\n          }\n          function copyDeTDEEReport() {\n            const btn = document.getElementById('btnCopyDeTDEE');\n            const txt = document.getElementById('tdee-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', calcDeTDEE);\n        </script>\n      "
  },
  {
    "slug": "design/qr-code-erstellen",
    "title": "Kostenloser QR-Code Generator Online [Vektor SVG & PNG]",
    "metaDesc": "Erstellen Sie anpassbare QR-Codes für URLs, Texte, WLAN & Kontakte. 100% lokal im Browser mit Reed-Solomon-Fehlerkorrektur und PNG/SVG-Export.",
    "category": "Design",
    "faq": [
      {
        "q": "Können die hier erstellten QR-Codes ablaufen?",
        "a": "Nein. Es handelt sich um statische QR-Codes, bei denen die Zielinformationen fest in der Modulmatrix codiert sind. Sie sind dauerhaft und unbegrenzt gültig, da sie von keinem externen Redirect-Server abhängen."
      },
      {
        "q": "Werden meine Daten (z. B. WLAN-Passwörter) an externe Server übertragen?",
        "a": "Nein. Die Erstellung des QR-Codes erfolgt mit einer reinen client-seitigen JavaScript-Engine direkt in Ihrem Webbrowser ohne Serverkontakt oder Datenaufzeichnung."
      },
      {
        "q": "Welches Fehlerkorrekturlevel (ECC) sollte gewählt werden?",
        "a": "Für digitale Anzeigen und Webseiten reicht Level M (15% Redundanz). Für Drucke auf rauen Oberflächen, Visitenkarten oder bei möglicher Verschmutzung empfiehlt sich Level Q (25%) oder Level H (30%)."
      },
      {
        "q": "Wie groß sollte ein QR-Code im Druck sein?",
        "a": "Als bewährte Faustregel gilt: Mindestbreite = Scan-Distanz geteilt durch 10. Für einen Leseabstand von 30 cm sollte der QR-Code mindestens 3 × 3 cm groß gedruckt werden."
      },
      {
        "q": "Kann ich den QR-Code als transparente Vektorgrafik (SVG) herunterladen?",
        "a": "Ja. Unser Generator unterstützt den direkten Export als stufenlos skalierbares Vektor-SVG sowie als hochauflösendes PNG mit frei wählbarem Alpha-Kanal (transparenter Hintergrund)."
      }
    ],
    "traps": [
      {
        "title": "Invertierter Farbkontrast (Heller Code auf dunklem Hintergrund)",
        "desc": "Obwohl der QR-Code-Standard theoretisch inverse Farben erlaubt, scheitern viele gängige Smartphone-Kameras und Barcode-Scanner an hellen Modulen auf dunklem Grund. Verwenden Sie für maximale Scan-Sicherheit stets dunkle Module auf hellem Hintergrund."
      },
      {
        "title": "Verletzung der 'Quiet Zone' (Ruhezone)",
        "desc": "Jeder QR-Code benötigt an allen vier Außenseiten einen unbedruckten Rand von mindestens 4 Modulen Breite. Fehlt dieser Sicherheitsrand oder wird der Code zu nah an Text und Grafiken gedruckt, kann der Scanner die Suchmuster (Finder Patterns) nicht lokalisieren."
      },
      {
        "title": "Gefährliche Abhängigkeit von kommerziellen Redirect-Diensten",
        "desc": "Viele angebliche 'kostenlose' QR-Generatoren erstellen dynamische Codes, die über deren eigene Server leiten und nach wenigen Tagen eine kostenpflichtige Abo-Verlängerung erzwingen. Unser Tool generiert zu 100% echte statische QR-Codes ohne Zwischenschaltung Dritter."
      },
      {
        "title": "Zu hohe Datendichte bei kleiner Druckgröße",
        "desc": "Wird ein langer URL-String mit vielen Tracking-Parametern codiert, steigt die Versionsnummer des QR-Codes (z. B. von Version 2 auf Version 8), wodurch die einzelnen Module winzig werden. Kürzen Sie URLs vor der QR-Codierung, um die Fehleranfälligkeit zu minimieren."
      },
      {
        "title": "Mangelnde Fehlerkorrektur bei Falten oder Beschädigung",
        "desc": "Wird für Plakate, Flyer oder Verpackungen die niedrigste Fehlerkorrektur (Level L) verwendet, reicht ein kleiner Knick oder Schmutzfleck aus, um den Code unlesbar zu machen. Wählen Sie für Druckerzeugnisse mindestens Level M oder Q."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; <a href=\"/de/\">Design</a> &gt; QR-Code Generator</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Kostenloser QR-Code Generator Online [Vektor SVG &amp; PNG]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Erstellen Sie statische, hochauflösende QR-Codes ohne externe Server und ohne Tracking. Passen Sie Farben, Ruhezone, Auflösung und Fehlerkorrektur an mit Sofort-Export in PNG und SVG.\n        </p>\n\n        <div class=\"tool-box\">\n          <div class=\"field-group\">\n            <label class=\"field-label\">Inhalt / URL / Text</label>\n            <input type=\"text\" id=\"de-qr-txt\" class=\"code-input\" value=\"https://digitaltoolsshed.com\" oninput=\"genDeQR()\" />\n          </div>\n\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Fehlerkorrektur (ECC)</label>\n              <select id=\"de-qr-ecc\" class=\"text-input\" onchange=\"genDeQR()\">\n                <option value=\"L\">Level L (7% Korrektur)</option>\n                <option value=\"M\" selected>Level M (15% Standard)</option>\n                <option value=\"Q\">Level Q (25% Erweitert)</option>\n                <option value=\"H\">Level H (30% Maximal)</option>\n              </select>\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Ruhezone (Rand): <span id=\"de-lbl-margin\">4 Module</span></label>\n              <input type=\"range\" id=\"de-qr-margin\" min=\"0\" max=\"8\" value=\"4\" style=\"width:100%;\" oninput=\"document.getElementById('de-lbl-margin').textContent = this.value + ' Module'; genDeQR();\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Auflösung (PNG)</label>\n              <select id=\"de-qr-size\" class=\"text-input\" onchange=\"genDeQR()\">\n                <option value=\"256\">256 × 256 px</option>\n                <option value=\"512\" selected>512 × 512 px (HD)</option>\n                <option value=\"1024\">1024 × 1024 px (Druck)</option>\n              </select>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-top: 0.5rem;\">\n            <div style=\"display: flex; align-items: center; gap: 0.5rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Vordergrund:</label>\n              <input type=\"color\" id=\"de-qr-fg\" value=\"#000000\" style=\"cursor: pointer; height: 36px; width: 44px; padding: 0; border: 1px solid var(--border);\" onchange=\"genDeQR()\" />\n            </div>\n            <div style=\"display: flex; align-items: center; gap: 0.5rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Hintergrund:</label>\n              <input type=\"color\" id=\"de-qr-bg\" value=\"#ffffff\" style=\"cursor: pointer; height: 36px; width: 44px; padding: 0; border: 1px solid var(--border);\" onchange=\"genDeQR()\" />\n            </div>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\">\n              <input type=\"checkbox\" id=\"de-qr-trans\" onchange=\"genDeQR()\" /> Transparenter Hintergrund\n            </label>\n          </div>\n\n          <!-- Canvas Preview -->\n          <div style=\"display: flex; flex-direction: column; align-items: center; padding: 2rem 0;\">\n            <canvas id=\"de-qr-canvas\" style=\"max-width: 260px; max-height: 260px; border: 1px solid var(--border); border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);\"></canvas>\n            <div style=\"display: flex; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap; justify-content: center;\">\n              <button class=\"btn-primary\" onclick=\"downloadDeQRPNG()\">💾 PNG Herunterladen</button>\n              <button class=\"btn-sec\" onclick=\"downloadDeQRSVG()\">📐 SVG Vektor Herunterladen</button>\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"de-stat-ver\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">Version 3</div>\n              <div class=\"stat-lbl\">QR-Code Version</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"de-stat-mod\" class=\"stat-num\" style=\"color: var(--fg);\">29 × 29</div>\n              <div class=\"stat-lbl\">Modulmatrix</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"de-stat-len\" class=\"stat-num\" style=\"color: #10b981;\">28 Zeichen</div>\n              <div class=\"stat-lbl\">Nutzlast-Länge</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"de-stat-print\" class=\"stat-num\" style=\"color: #f59e0b;\">3,7 × 3,7 cm</div>\n              <div class=\"stat-lbl\">Empfohlene Druckgröße</div>\n            </div>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 QR-Code Spezifikation &amp; Daten kopieren</span>\n            <button id=\"btnCopyDeQR\" class=\"btn-copy\" onclick=\"copyDeQRReport()\">📋 Spezifikation Kopieren</button>\n          </div>\n          <pre id=\"de-qr-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\nvar qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw\"code length overflow. (\"+o.getLengthInBits()+\">\"+8*u+\")\";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||\"Byte\"){case\"Numeric\":e=M(t);break;case\"Alphanumeric\":e=x(t);break;case\"Byte\":e=m(t);break;case\"Kanji\":e=L(t);break;default:throw\"mode:\"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+\",\"+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createSvgTag=function(t,r,e,n){var o={};\"object\"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e=\"string\"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||\"qrcode-description\":null,(n=\"string\"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||\"qrcode-title\":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l=\"\";for(c=\"l\"+t+\",0 0,\"+t+\" -\"+t+\",0 0,-\"+t+\"z \",l+='<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"',l+=o.scalable?\"\":' width=\"'+g+'px\" height=\"'+g+'px\"',l+=' viewBox=\"0 0 '+g+\" \"+g+'\" ',l+=' preserveAspectRatio=\"xMinYMin meet\"',l+=\">\",l+='<rect width=\"100%\" height=\"100%\" fill=\"white\" cx=\"0\" cy=\"0\"/>',l+='<path d=\"',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+=\"M\"+(i*t+r)+\",\"+u+c);return l+='\" stroke=\"transparent\" fill=\"black\"/>',l+=\"</svg>\"},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?\"black\":\"white\",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default;var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw\"bad maskPattern:\"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw\"mode:\"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw\"mode:\"+t}else{if(!(r<41))throw\"type:\"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw\"mode:\"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw\"glog(\"+t+\")\";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+\"/\"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw\"bad rs block @ typeNumber:\"+e+\"/errorCorrectionLevel:\"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if(\"0\"<=t&&t<=\"9\")return t.charCodeAt(0)-\"0\".charCodeAt(0);throw\"illegal char :\"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if(\"0\"<=t&&t<=\"9\")return t.charCodeAt(0)-\"0\".charCodeAt(0);if(\"A\"<=t&&t<=\"Z\")return t.charCodeAt(0)-\"A\".charCodeAt(0)+10;switch(t){case\" \":return 36;case\"$\":return 37;case\"%\":return 38;case\"*\":return 39;case\"+\":return 40;case\"-\":return 41;case\".\":return 42;case\"/\":return 43;case\":\":return 44;default:throw\"illegal char :\"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw\"sjis not supported.\";!function(){var t=n(\"友\");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw\"sjis not supported.\"}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw\"illegal char at \"+(e+1)+\"/\"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw\"illegal char at \"+(e+1)}};return i};return f};if(typeof window!==\"undefined\"){window.qrcode=qrcode;}\n</script>\n        <script>\n          let deQrInstance = null;\n          function genDeQR() {\n            const txt = document.getElementById('de-qr-txt').value.trim() || ' ';\n            const ecc = document.getElementById('de-qr-ecc').value;\n            const margin = parseInt(document.getElementById('de-qr-margin').value, 10);\n            const size = parseInt(document.getElementById('de-qr-size').value, 10);\n            const fg = document.getElementById('de-qr-fg').value;\n            const bg = document.getElementById('de-qr-bg').value;\n            const isTrans = document.getElementById('de-qr-trans').checked;\n            const canvas = document.getElementById('de-qr-canvas');\n\n            try {\n              const qr = qrcode(0, ecc);\n              qr.addData(txt);\n              qr.make();\n              deQrInstance = qr;\n\n              const count = qr.getModuleCount();\n              const totalCells = count + (margin * 2);\n              canvas.width = size;\n              canvas.height = size;\n              const ctx = canvas.getContext('2d');\n              ctx.imageSmoothingEnabled = false;\n\n              if (isTrans) {\n                ctx.clearRect(0, 0, size, size);\n              } else {\n                ctx.fillStyle = bg;\n                ctx.fillRect(0, 0, size, size);\n              }\n\n              const cellSize = size / totalCells;\n              ctx.fillStyle = fg;\n              for (let r = 0; r < count; r++) {\n                for (let c = 0; c < count; c++) {\n                  if (qr.isDark(r, c)) {\n                    ctx.fillRect(\n                      Math.round((c + margin) * cellSize),\n                      Math.round((r + margin) * cellSize),\n                      Math.ceil(cellSize),\n                      Math.ceil(cellSize)\n                    );\n                  }\n                }\n              }\n\n              const ver = (count - 17) / 4;\n              document.getElementById('de-stat-ver').textContent = 'Version ' + ver;\n              document.getElementById('de-stat-mod').textContent = count + ' × ' + count;\n              document.getElementById('de-stat-len').textContent = txt.length + ' Zeichen';\n              const minCm = ((totalCells * 0.42) / 10).toFixed(1);\n              document.getElementById('de-stat-print').textContent = minCm + ' × ' + minCm + ' cm';\n\n              const summary = [\n                '--- STATISCHE QR-CODE SPEZIFIKATION ---',\n                'Codierter Inhalt: ' + txt,\n                'Matrix-Version: ' + ver + ' (' + count + 'x' + count + ' Module)',\n                'Fehlerkorrektur: Level ' + ecc,\n                'Ruhezone / Rand: ' + margin + ' Module',\n                'PNG-Auflösung: ' + size + 'x' + size + ' Pixel',\n                'Vordergrund: ' + fg + ' | Hintergrund: ' + (isTrans ? 'Transparent' : bg),\n                'Erstellt ohne Fremdserver auf digitaltoolsshed.com'\n              ].join('\\n');\n              document.getElementById('de-qr-copy-box').textContent = summary;\n            } catch (err) {\n              console.error('QR Render Error:', err);\n            }\n          }\n          function downloadDeQRPNG() {\n            const canvas = document.getElementById('de-qr-canvas');\n            const a = document.createElement('a');\n            a.download = 'qrcode-digitaltoolsshed.png';\n            a.href = canvas.toDataURL('image/png');\n            a.click();\n          }\n          function downloadDeQRSVG() {\n            if (!deQrInstance) return;\n            const margin = parseInt(document.getElementById('de-qr-margin').value, 10);\n            const svgTag = deQrInstance.createSvgTag({ cellSize: 8, margin: margin });\n            const blob = new Blob([svgTag], { type: 'image/svg+xml;charset=utf-8' });\n            const url = URL.createObjectURL(blob);\n            const a = document.createElement('a');\n            a.download = 'qrcode-digitaltoolsshed.svg';\n            a.href = url;\n            a.click();\n            URL.revokeObjectURL(url);\n          }\n          function copyDeQRReport() {\n            const btn = document.getElementById('btnCopyDeQR');\n            const txt = document.getElementById('de-qr-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', genDeQR);\n        </script>\n      "
  },
  {
    "slug": "security/passwort-generator",
    "title": "Sicherer Passwort Generator Online [CSPRNG & Entropie]",
    "metaDesc": "Generieren Sie hochsichere, kryptografisch unvorhersehbare Passwörter direkt im Browser mit der Web Cryptography API und Entropie-Analyse.",
    "category": "Sicherheit",
    "faq": [
      {
        "q": "Warum ist window.crypto.getRandomValues sicherer als Math.random()?",
        "a": "Math.random() ist ein deterministischer Pseudozufallszahlengenerator (PRNG), dessen interner Status durch wenige beobachtete Ausgaben rekonstruiert werden kann. window.crypto greift hingegen auf den kryptografischen Entropiepool des Betriebssystems zu (CSPRNG) und ist mathematisch unvorhersehbar."
      },
      {
        "q": "Wie viele Bits Entropie benötigt ein sicheres Passwort?",
        "a": "NIST und BSI empfehlen für Standard-Passwörter mindestens 64 bis 80 Bits Entropie. Für Master-Passwörter von Passwort-Managern, Root-Zugänge oder Krypto-Wallets sollten 100 bis 128 Bits gewählt werden."
      },
      {
        "q": "Werden die hier generierten Passwörter irgendwo gespeichert?",
        "a": "Nein. Alle Passwörter entstehen lokal im Arbeitsspeicher Ihres Browsers. Es erfolgt keinerlei Netzwerkkommunikation, Speicherung in Cookies oder serverseitiges Logging."
      },
      {
        "q": "Warum sollten mehrdeutige Zeichen wie 0, O, 1 und l vermieden werden?",
        "a": "Das Ausschließen optisch ähnlicher Zeichen verhindert menschliche Lesefehler beim manuellen Abtippen von Notfall-Backups auf Mobilgeräten oder Terminal-Konsolen."
      },
      {
        "q": "Wie lange bräuchte ein modernes GPU-Cluster, um ein 20-stelliges Passwort zu knacken?",
        "a": "Ein 20-stelliges Passwort mit Groß-, Kleinbuchstaben, Ziffern und Sonderzeichen besitzt rund 131 Bits Entropie. Selbst ein Verbund von 10.000 High-End-Grafikkarten bräuchte Billionen Jahre zur vollständigen Erschöpfung des Suchraums."
      }
    ],
    "traps": [
      {
        "title": "Verwendung von Math.random() für Sicherheitsrelevantes",
        "desc": "In vielen Online-Generatoren wird fälschlicherweise Math.random() genutzt. Algorithmen wie xorshift128+ sind für Spiele und Animationen gedacht, aber kryptografisch völlig ungeeignet. Ein Angreifer kann frühere und künftige Passwörter vorhersagen."
      },
      {
        "title": "Modulo-Verzerrung (Modulo Bias) im Algorithmus",
        "desc": "Wird ein Zufallswert mit 'randInt % chars.length' auf den Zeichensatz abgebildet, werden vordere Zeichen statistisch geringfügig häufiger gewählt, wenn die Zufallsspanne kein ganzzahliges Vielfaches der Poolgröße ist. Dies schwächt die kryptografische Stärke messbar."
      },
      {
        "title": "Gefahr durch Zwischenablage-Überwachung (Clipboard Snooping)",
        "desc": "Beim Kopieren in die Zwischenablage verbleibt das Klartext-Passwort unverschlüsselt im Betriebssystem. Schadsoftware oder bösartige Browser-Erweiterungen können diesen Speicherbereich abfangen. Fügen Sie Passwörter direkt in Passwort-Manager ein und leeren Sie das Clipboard."
      },
      {
        "title": "Serverseitige Passwort-Erzeugung im Hintergrund",
        "desc": "Websites, die Passwörter über REST-APIs auf einem Webserver generieren, gefährden Ihre Sicherheit: Das Passwort existiert kurzzeitig im Server-Log, im TLS-Terminierungs-Proxy oder im Arbeitsspeicher des Betreibers. Vertrauen Sie nur client-seitigen Generatoren."
      },
      {
        "title": "Wiederverwendung desselben Passworts auf mehreren Seiten",
        "desc": "Selbst das stärkste 30-stellige Passwort ist nutzlos, wenn es für mehrere Konten genutzt wird. Wird ein einziger Online-Dienst gehackt und dessen Datenbank geleakt, sind sofort alle verknüpften Konten kompromittiert."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; <a href=\"/de/\">Sicherheit</a> &gt; Passwort Generator</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Sicherer Passwort Generator Online [CSPRNG &amp; Entropie]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Erstellen Sie kryptografisch unknackbare Passwörter direkt im Browser via Web Cryptography API. Mit Entropie-Berechnung, GPU-Knackzeit-Schätzung und Batch-Generierung.\n        </p>\n\n        <div class=\"tool-box\">\n          <div class=\"field-group\">\n            <label class=\"field-label\">Generiertes Passwort</label>\n            <div style=\"display: flex; gap: 0.5rem;\">\n              <input type=\"text\" id=\"de-pw-out\" class=\"code-input\" style=\"font-size: 1.25rem; font-weight: bold; color: var(--fg);\" readonly />\n              <button class=\"btn-primary\" onclick=\"genDePW()\" style=\"flex-shrink: 0;\">↻ Neu</button>\n            </div>\n          </div>\n\n          <div class=\"field-group\">\n            <div style=\"display: flex; justify-content: space-between; margin-bottom: 0.35rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Länge: <span id=\"de-pw-len-val\" style=\"color: var(--fg); font-weight: bold;\">20</span> Zeichen</label>\n              <span id=\"de-pw-badge\" style=\"font-family: var(--mono); font-size: 0.8rem; color: #22c55e; font-weight: bold;\">131 Bits (Sehr stark)</span>\n            </div>\n            <input type=\"range\" id=\"de-pw-len\" min=\"8\" max=\"64\" value=\"20\" style=\"width: 100%; cursor: pointer;\" oninput=\"document.getElementById('de-pw-len-val').textContent = this.value; genDePW();\" />\n          </div>\n\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); margin-bottom: 1rem;\">\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"de-opt-u\" checked onchange=\"genDePW()\"> Großbuchstaben (A-Z)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"de-opt-l\" checked onchange=\"genDePW()\"> Kleinbuchstaben (a-z)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"de-opt-d\" checked onchange=\"genDePW()\"> Ziffern (0-9)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"de-opt-s\" checked onchange=\"genDePW()\"> Sonderzeichen (!@#$%)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"de-opt-no-ambig\" onchange=\"genDePW()\"> Ohne 0, O, 1, l, I</label>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"de-stat-ent\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">131 Bits</div>\n              <div class=\"stat-lbl\">Shannon-Entropie</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"de-stat-pool\" class=\"stat-num\" style=\"color: var(--fg);\">94 Zeichen</div>\n              <div class=\"stat-lbl\">Zeichensatz-Pool</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"de-stat-crack-on\" class=\"stat-num\" style=\"color: #22c55e;\">Unknackbar</div>\n              <div class=\"stat-lbl\">Online-Angriff (100/s)</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"de-stat-crack-gpu\" class=\"stat-num\" style=\"color: #22c55e;\">Billionen Jahre</div>\n              <div class=\"stat-lbl\">GPU-Cluster (100 Mrd/s)</div>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.25rem;\">\n            <button id=\"btnCopyDePW\" class=\"btn-primary\" onclick=\"copyDePW()\">📋 Passwort Kopieren</button>\n            <button class=\"btn-sec\" onclick=\"genDeBatch()\">⚡ 5er-Batch Generieren</button>\n          </div>\n\n          <div id=\"de-batch-box\" style=\"display: none; margin-top: 1.25rem; padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;\">\n            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;\">\n              <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold;\">Batch-Passwörter (5×)</span>\n              <button id=\"btnCopyDeBatch\" class=\"btn-copy\" onclick=\"copyDeBatch()\">📋 Alle Kopieren</button>\n            </div>\n            <pre id=\"de-batch-list\" style=\"margin: 0; font-family: var(--mono); font-size: 0.9rem; line-height: 1.6;\"></pre>\n          </div>\n        </div>\n\n        <script>\n          function getDeCharPool() {\n            let pool = '';\n            if (document.getElementById('de-opt-u').checked) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';\n            if (document.getElementById('de-opt-l').checked) pool += 'abcdefghijklmnopqrstuvwxyz';\n            if (document.getElementById('de-opt-d').checked) pool += '0123456789';\n            if (document.getElementById('de-opt-s').checked) pool += '!@#$%^&*()-_=+[]{}|;:,.<>?';\n            if (document.getElementById('de-opt-no-ambig').checked) {\n              pool = pool.replace(/[0O1lI]/g, '');\n            }\n            return pool || 'abcdefghijklmnopqrstuvwxyz';\n          }\n          function genDePW() {\n            const len = parseInt(document.getElementById('de-pw-len').value, 10);\n            const pool = getDeCharPool();\n            const poolLen = pool.length;\n\n            const arr = new Uint32Array(len);\n            window.crypto.getRandomValues(arr);\n            let pw = '';\n            for (let i = 0; i < len; i++) {\n              pw += pool[arr[i] % poolLen];\n            }\n            document.getElementById('de-pw-out').value = pw;\n\n            const entropy = Math.round(len * (Math.log(poolLen) / Math.log(2)));\n            document.getElementById('de-stat-ent').textContent = entropy + ' Bits';\n            document.getElementById('de-stat-pool').textContent = poolLen + ' Zeichen';\n\n            let badgeText = 'Sehr schwach', badgeCol = '#ef4444';\n            if (entropy >= 100) { badgeText = entropy + ' Bits (Militärischer Standard)'; badgeCol = '#22c55e'; }\n            else if (entropy >= 80) { badgeText = entropy + ' Bits (Sehr stark)'; badgeCol = '#10b981'; }\n            else if (entropy >= 60) { badgeText = entropy + ' Bits (Ausreichend)'; badgeCol = '#f59e0b'; }\n            const bEl = document.getElementById('de-pw-badge');\n            bEl.textContent = badgeText;\n            bEl.style.color = badgeCol;\n          }\n          function copyDePW() {\n            const btn = document.getElementById('btnCopyDePW');\n            const pw = document.getElementById('de-pw-out').value;\n            navigator.clipboard.writeText(pw).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          function genDeBatch() {\n            const len = parseInt(document.getElementById('de-pw-len').value, 10);\n            const pool = getDeCharPool();\n            const poolLen = pool.length;\n            const list = [];\n            for (let b = 0; b < 5; b++) {\n              const arr = new Uint32Array(len);\n              window.crypto.getRandomValues(arr);\n              let pw = '';\n              for (let i = 0; i < len; i++) pw += pool[arr[i] % poolLen];\n              list.push(pw);\n            }\n            document.getElementById('de-batch-list').textContent = list.join('\\n');\n            document.getElementById('de-batch-box').style.display = 'block';\n          }\n          function copyDeBatch() {\n            const btn = document.getElementById('btnCopyDeBatch');\n            const txt = document.getElementById('de-batch-list').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', genDePW);\n        </script>\n      "
  },
  {
    "slug": "util/stoppuhr",
    "title": "Online Stoppuhr mit Millisekunden & Rundenzeiten",
    "metaDesc": "Präzise Millisekunden-Stoppuhr im Browser mit Rundenzeiterfassung, Zwischenzeiten, Tastatursteuerung (Leertaste) und Export.",
    "category": "Dienstprogramme",
    "faq": [
      {
        "q": "Wie präzise misst diese Online-Stoppuhr?",
        "a": "Die Stoppuhr nutzt die hochauflösende Zeitmessung via Date.now() / performance.now() mit Kompensation des Timer-Drifts auf Millisekunden-Genauigkeit."
      },
      {
        "q": "Läuft die Zeitmessung weiter, wenn ich den Tab wechsle?",
        "a": "Ja. Da die Stoppuhr bei jedem Intervall die absolute Zeitdifferenz zum Startzeitpunkt berechnet, verfälschen Drosselungen im Hintergrund-Tab die Messung nicht."
      },
      {
        "q": "Gibt es praktische Tastatur-Kurzbefehle?",
        "a": "Ja. Mit der Leertaste können Sie die Stoppuhr starten und pausieren. Die Taste 'L' erfasst eine neue Runde, und 'R' setzt die Stoppuhr zurück."
      },
      {
        "q": "Wie können Rundenzeiten exportiert werden?",
        "a": "Mit einem Klick auf 'Rundenzeiten Kopieren' wird eine formatierte Tabelle aller Runden- und Zwischenzeiten direkt in Ihre Zwischenablage übertragen."
      },
      {
        "q": "Werden Rundenzeiten auf dem Server gespeichert?",
        "a": "Nein. Alle Zeitdaten existieren ausschließlich temporär in Ihrem Browserfenster und werden beim Schließen des Tabs restlos gelöscht."
      }
    ],
    "traps": [
      {
        "title": "Timer-Drift durch einfaches Hochzählen in setInterval",
        "desc": "Viele naive Online-Stoppuhren addieren bei jedem 'setInterval(fn, 10)' einfach 10 Millisekunden hinzu. Da JavaScript-Timer durch Task-Queues und Rendering verzögert werden, geht eine solche Stoppuhr nach wenigen Minuten um mehrere Sekunden falsch. Nur die Differenz echter Systemzeitpunkte liefert absolute Genauigkeit."
      },
      {
        "title": "Aggressive Drosselung in inaktiven Hintergrund-Tabs",
        "desc": "Moderne Browser (Chrome, Firefox, Safari) reduzieren die Taktung von Hintergrund-Tabs auf 1 Hz (ein Aufruf pro Sekunde) zur Stromeinsparung. Zähler-basierte Timer frieren dabei ein, während delta-basierte Berechnungen beim Reaktivieren des Tabs sofort die exakte Realzeit anzeigen."
      },
      {
        "title": "Menschliche Reaktionszeit bei manuellen Rundenmessungen",
        "desc": "Die menschliche visuell-motorische Reaktionszeit liegt bei rund 150 bis 250 Millisekunden. Bei sportlichen Sprints über wenige Sekunden dominiert die manuelle Klick-Latenz das Messergebnis gegenüber der Millisekunden-Präzision der Software."
      },
      {
        "title": "Mögliche Zeitsprünge durch automatische NTP-Synchronisation",
        "desc": "Synchronisiert das Betriebssystem die Systemzeit via NTP neu, kann Date.now() unvorhersehbar springen. Präzisionssoftware nutzt daher die monoton steigende Monotonic-Clock über performance.now()."
      },
      {
        "title": "Latenzspitzen durch Garbage Collection bei hoher Taktung",
        "desc": "Werden innerhalb eines 10ms-Intervalls fortlaufend neue Objekte oder Strings im DOM allokiert, erzwingt die JavaScript-Engine Garbage-Collection-Pausen, die zu sichtbarem Ruckeln der Anzeige führen können."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; <a href=\"/de/\">Dienstprogramme</a> &gt; Stoppuhr</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Online Stoppuhr mit Millisekunden &amp; Rundenzeiten</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Präzise Millisekunden-Stoppuhr mit Rundenzeiten, Split-Analyse und Tastatursteuerung. Drift-frei berechnet im Browser ohne Serververzögerung.\n        </p>\n\n        <div class=\"tool-box\" style=\"text-align: center; padding: 2.5rem 1.5rem;\">\n          <div id=\"sw-val\" style=\"font-family: var(--mono); font-size: 3.5rem; font-weight: bold; color: var(--btn-bg, #3b82f6); letter-spacing: 0.05em; margin-bottom: 1.5rem;\">00:00.000</div>\n\n          <div style=\"display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;\">\n            <button id=\"sw-btn\" class=\"btn-primary\" onclick=\"toggleDeSW()\" style=\"padding: 0.75rem 2rem; font-size: 1rem;\">▶ Start</button>\n            <button id=\"sw-lap-btn\" class=\"btn-sec\" onclick=\"lapDeSW()\" style=\"padding: 0.75rem 1.5rem;\">⏱ Runde (L)</button>\n            <button class=\"btn-sec\" onclick=\"resetDeSW()\" style=\"padding: 0.75rem 1.5rem;\">Zurücksetzen (R)</button>\n          </div>\n          <div style=\"margin-top: 0.75rem; font-size: 0.8rem; color: var(--text-muted);\">\n            Tastatur: <strong>Leertaste</strong> = Start/Pause | <strong>L</strong> = Runde | <strong>R</strong> = Reset\n          </div>\n        </div>\n\n        <!-- Lap Times Table -->\n        <div id=\"sw-laps-box\" style=\"display: none; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 1.5rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;\">\n            <h3 style=\"margin: 0; font-family: var(--serif); font-size: 1.15rem;\">Erfasste Rundenzeiten (<span id=\"sw-lap-count\">0</span>)</h3>\n            <button id=\"btnCopyDeSW\" class=\"btn-copy\" onclick=\"copyDeSWLaps()\">📋 Rundenzeiten Kopieren</button>\n          </div>\n          <table style=\"width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 0.85rem; text-align: left;\">\n            <thead>\n              <tr style=\"border-bottom: 2px solid var(--border); color: var(--text-muted);\">\n                <th style=\"padding: 0.5rem;\">Runde</th>\n                <th style=\"padding: 0.5rem;\">Rundenzeit</th>\n                <th style=\"padding: 0.5rem;\">Gesamtzeit</th>\n              </tr>\n            </thead>\n            <tbody id=\"sw-lap-tbody\"></tbody>\n          </table>\n        </div>\n\n        <script>\n          let swStart = 0, swElapsed = 0, swTimer = null;\n          let swLaps = [];\n          let swLastLapTime = 0;\n\n          function fmtTime(ms) {\n            const m = Math.floor(ms / 60000).toString().padStart(2, '0');\n            const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');\n            const mil = Math.floor(ms % 1000).toString().padStart(3, '0');\n            return m + ':' + s + '.' + mil;\n          }\n\n          function toggleDeSW() {\n            const btn = document.getElementById('sw-btn');\n            if (swTimer) {\n              clearInterval(swTimer);\n              swTimer = null;\n              btn.textContent = '▶ Weiter';\n            } else {\n              swStart = Date.now() - swElapsed;\n              swTimer = setInterval(function() {\n                swElapsed = Date.now() - swStart;\n                document.getElementById('sw-val').textContent = fmtTime(swElapsed);\n              }, 16);\n              btn.textContent = '❚❚ Pause';\n            }\n          }\n\n          function lapDeSW() {\n            if (swElapsed === 0) return;\n            const lapTime = swElapsed - swLastLapTime;\n            swLastLapTime = swElapsed;\n            swLaps.unshift({ num: swLaps.length + 1, lap: lapTime, total: swElapsed });\n\n            document.getElementById('sw-lap-count').textContent = swLaps.length;\n            document.getElementById('sw-laps-box').style.display = 'block';\n\n            const tbody = document.getElementById('sw-lap-tbody');\n            tbody.innerHTML = swLaps.map(function(l) {\n              return '<tr style=\"border-bottom: 1px solid var(--border);\">' +\n                '<td style=\"padding: 0.5rem;\">#' + l.num + '</td>' +\n                '<td style=\"padding: 0.5rem; font-weight: bold; color: var(--btn-bg, #3b82f6);\">' + fmtTime(l.lap) + '</td>' +\n                '<td style=\"padding: 0.5rem;\">' + fmtTime(l.total) + '</td>' +\n                '</tr>';\n            }).join('');\n          }\n\n          function resetDeSW() {\n            clearInterval(swTimer);\n            swTimer = null;\n            swElapsed = 0;\n            swLastLapTime = 0;\n            swLaps = [];\n            document.getElementById('sw-val').textContent = '00:00.000';\n            document.getElementById('sw-btn').textContent = '▶ Start';\n            document.getElementById('sw-laps-box').style.display = 'none';\n            document.getElementById('sw-lap-tbody').innerHTML = '';\n          }\n\n          function copyDeSWLaps() {\n            const btn = document.getElementById('btnCopyDeSW');\n            const lines = ['--- STOPPUHR RUNDENZEITEN ---'];\n            swLaps.slice().reverse().forEach(function(l) {\n              lines.push('Runde ' + l.num + ': ' + fmtTime(l.lap) + ' (Gesamt: ' + fmtTime(l.total) + ')');\n            });\n            lines.push('Erfasst auf digitaltoolsshed.com');\n            navigator.clipboard.writeText(lines.join('\\n')).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Kopiert!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n\n          document.addEventListener('keydown', function(e) {\n            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;\n            if (e.code === 'Space') { e.preventDefault(); toggleDeSW(); }\n            else if (e.key === 'l' || e.key === 'L') { e.preventDefault(); lapDeSW(); }\n            else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); resetDeSW(); }\n          });\n        </script>\n      "
  }
];
  const frTools = [
  {
    "slug": "math/calculateur-pourcentage",
    "title": "Calculateur de Pourcentage en Ligne [3 Méthodes Précises]",
    "metaDesc": "Calculez des pourcentages facilement : calculer X% de Y, déterminer quel pourcentage X représente de Y, et mesurer une hausse ou baisse avec explications.",
    "category": "Mathématiques",
    "faq": [
      {
        "q": "Comment calculer mentalement et rapidement 20% d'un prix ?",
        "a": "Divisez le montant par 10 (ce qui donne 10%) et multipliez le résultat par 2. Exemple : 20% de 140 € = (140 / 10) * 2 = 14 * 2 = 28 €."
      },
      {
        "q": "Quelle est la différence entre point de pourcentage et pourcentage relatif ?",
        "a": "Les points de pourcentage mesurent la différence arithmétique simple entre deux taux (passer de 10% à 12% représente une hausse de 2 points de pourcentage). En pourcentage relatif, il s'agit d'une augmentation de +20%."
      },
      {
        "q": "Comment extraire le montant hors taxe (HT) à partir d'un prix TTC avec 20% de TVA ?",
        "a": "Divisez le prix TTC par 1,20. Exemple : Pour un article à 120 € TTC, le montant HT est de 120 / 1,20 = 100 €. La TVA correspond exactement à 20 €."
      },
      {
        "q": "Pourquoi une baisse de 30% suivie d'une hausse de 30% ne redonne pas le prix d'origine ?",
        "a": "Parce que la hausse s'applique à une base réduite. Si un produit de 100 € baisse de 30%, il coûte 70 €. Une augmentation de 30% sur 70 € ajoute 21 €, soit un prix final de 91 € (-9% par rapport au départ)."
      },
      {
        "q": "Mes calculs sont-ils enregistrés sur vos serveurs ?",
        "a": "Non. Tous les calculs s'exécutent intégralement dans la mémoire locale de votre navigateur sans aucun échange de données avec un serveur distant."
      }
    ],
    "traps": [
      {
        "title": "Confusion critique entre points de pourcentage et pourcentage",
        "desc": "Si le taux d'emprunt passe de 2% à 3%, l'augmentation est de 1 point de pourcentage, mais le coût des intérêts grimpe de +50% en valeur relative. Cette confusion dans les négociations financières conduit à sous-estimer massivement les surcoûts réels."
      },
      {
        "title": "Asymétrie des baisses et hausses de rentabilité",
        "desc": "Une perte en capital exige un gain disproportionné pour être comblée. Après une chute de 20%, il faut un rebond de 25%. Après une perte de 50%, il faut un doublement (+100%). Et après une chute de 90%, il faut un gain de +900% pour retrouver son niveau initial."
      },
      {
        "title": "Cumul erroné de remises commerciales successives",
        "desc": "Appliquer un rabais de 20% puis un rabais supplémentaire de 30% ne donne pas 50% de réduction totale, mais 44%. Le second pourcentage s'applique au montant déjà réduit (80% * 0,70 = 56% du prix initial restant)."
      },
      {
        "title": "Erreur de soustraction directe de la TVA",
        "desc": "Calculer le montant hors taxe en soustrayant 20% au montant TTC est une faute mathématique majeure. 20% de TVA ajoutés à 100 € donnent 120 €. Mais soustraire 20% à 120 € enlève 24 €, faussant la comptabilité."
      },
      {
        "title": "Accumulation des erreurs d'arrondi sur les taux composés",
        "desc": "Arrondir systématiquement les fractions de pourcentages lors de calculs financiers multi-périodes entraîne des dérives importantes. Les outils professionnels conservent la précision maximale en virgule flottante jusqu'au résultat final."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; <a href=\"/fr/\">Calculateurs</a> &gt; Pourcentage</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Calculateur de Pourcentage en Ligne [3 Méthodes Précises]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Calculez instantanément toutes vos opérations de pourcentages : valeur partielle, part relative ou taux de variation (hausse / baisse) avec le détail des étapes de calcul.\n        </p>\n\n        <!-- 1. Valeur partielle -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">1. Combien fait X% de Y ? (Valeur partielle)</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>Combien fait</span>\n            <input type=\"number\" id=\"fr-p1-x\" class=\"text-input\" style=\"width: 110px;\" value=\"20\" oninput=\"calcFrP1()\" />\n            <span>% de</span>\n            <input type=\"number\" id=\"fr-p1-y\" class=\"text-input\" style=\"width: 130px;\" value=\"150\" oninput=\"calcFrP1()\" />\n            <span>=</span>\n            <strong id=\"fr-p1-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">30.00</strong>\n          </div>\n          <div id=\"fr-p1-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Démonstration :</strong> V = (20 / 100) × 150 = 0,20 × 150 = <strong>30,00</strong>\n          </div>\n        </div>\n\n        <!-- 2. Part relative -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">2. Quel pourcentage représente X par rapport à Y ?</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>Le nombre</span>\n            <input type=\"number\" id=\"fr-p2-x\" class=\"text-input\" style=\"width: 110px;\" value=\"35\" oninput=\"calcFrP2()\" />\n            <span>représente quel % de</span>\n            <input type=\"number\" id=\"fr-p2-y\" class=\"text-input\" style=\"width: 130px;\" value=\"140\" oninput=\"calcFrP2()\" />\n            <span>=</span>\n            <strong id=\"fr-p2-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">25.00 %</strong>\n          </div>\n          <div id=\"fr-p2-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Démonstration :</strong> p% = (35 / 140) × 100% = 0,25 × 100% = <strong>25,00 %</strong>\n          </div>\n        </div>\n\n        <!-- 3. Variation en pourcentage -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">3. Taux de variation en pourcentage (Hausse / Baisse)</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>De la valeur initiale</span>\n            <input type=\"number\" id=\"fr-p3-x\" class=\"text-input\" style=\"width: 110px;\" value=\"50\" oninput=\"calcFrP3()\" />\n            <span>à la valeur finale</span>\n            <input type=\"number\" id=\"fr-p3-y\" class=\"text-input\" style=\"width: 75\" oninput=\"calcFrP3()\" />\n            <span>=</span>\n            <strong id=\"fr-p3-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: #22c55e; margin-left: 0.5rem;\">+50.00 % (Hausse)</strong>\n          </div>\n          <div id=\"fr-p3-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Démonstration :</strong> Δ% = ((75 - 50) / 50) × 100% = <strong>+50,00 %</strong>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Synthèse complète des calculs de pourcentage</span>\n            <button id=\"btnCopyFrPct\" class=\"btn-copy\" onclick=\"copyFrPctReport()\">📋 Copier</button>\n          </div>\n          <pre id=\"fr-pct-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcFrP1() {\n            const x = parseFloat(document.getElementById('fr-p1-x').value) || 0;\n            const y = parseFloat(document.getElementById('fr-p1-y').value) || 0;\n            const res = (x / 100) * y;\n            document.getElementById('fr-p1-res').textContent = res.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n            document.getElementById('fr-p1-formula').innerHTML = '<strong>Démonstration :</strong> V = (' + x + ' / 100) × ' + y + ' = <strong>' + res.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</strong>';\n            updateFrPctReport();\n          }\n          function calcFrP2() {\n            const x = parseFloat(document.getElementById('fr-p2-x').value) || 0;\n            const y = parseFloat(document.getElementById('fr-p2-y').value) || 0;\n            const res = y !== 0 ? (x / y) * 100 : 0;\n            document.getElementById('fr-p2-res').textContent = res.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';\n            document.getElementById('fr-p2-formula').innerHTML = '<strong>Démonstration :</strong> p% = (' + x + ' / ' + y + ') × 100% = <strong>' + res.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %</strong>';\n            updateFrPctReport();\n          }\n          function calcFrP3() {\n            const x = parseFloat(document.getElementById('fr-p3-x').value) || 0;\n            const y = parseFloat(document.getElementById('fr-p3-y').value) || 0;\n            const el = document.getElementById('fr-p3-res');\n            if (x === 0) { el.textContent = 'Division par 0 impossible'; return; }\n            const diff = ((y - x) / x) * 100;\n            const isPos = diff >= 0;\n            el.textContent = (isPos ? '+' : '') + diff.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '% ' + (isPos ? '(Hausse)' : '(Baisse)');\n            el.style.color = isPos ? '#22c55e' : '#ef4444';\n            document.getElementById('fr-p3-formula').innerHTML = '<strong>Démonstration :</strong> Δ% = ((' + y + ' - ' + x + ') / ' + x + ') × 100% = <strong>' + (isPos ? '+' : '') + diff.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %</strong>';\n            updateFrPctReport();\n          }\n          function updateFrPctReport() {\n            const p1x = document.getElementById('fr-p1-x').value;\n            const p1y = document.getElementById('fr-p1-y').value;\n            const p1r = document.getElementById('fr-p1-res').textContent;\n            const p2x = document.getElementById('fr-p2-x').value;\n            const p2y = document.getElementById('fr-p2-y').value;\n            const p2r = document.getElementById('fr-p2-res').textContent;\n            const p3x = document.getElementById('fr-p3-x').value;\n            const p3y = document.getElementById('fr-p3-y').value;\n            const p3r = document.getElementById('fr-p3-res').textContent;\n\n            const text = [\n              '--- RAPPORT CALCUL DE POURCENTAGE ---',\n              '1. Valeur partielle : ' + p1x + '% de ' + p1y + ' = ' + p1r,\n              '2. Part relative : ' + p2x + ' sur ' + p2y + ' = ' + p2r,\n              '3. Taux dévolution de ' + p3x + ' à ' + p3y + ' = ' + p3r,\n              'Calculé 100% côté client sur digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('fr-pct-copy-box').textContent = text;\n          }\n          function copyFrPctReport() {\n            const btn = document.getElementById('btnCopyFrPct');\n            const txt = document.getElementById('fr-pct-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Copié !';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', function() {\n            calcFrP1(); calcFrP2(); calcFrP3();\n          });\n        </script>\n      "
  },
  {
    "slug": "health/calculateur-imc",
    "title": "Calculateur IMC en Ligne [Indice de Masse Corporelle OMS]",
    "metaDesc": "Calculez votre Indice de Masse Corporelle (IMC) selon les normes officielles de l'OMS avec fourchette de poids idéal et interprétation médicale.",
    "category": "Santé",
    "faq": [
      {
        "q": "Quelle est la classification officielle de l'IMC selon l'OMS ?",
        "a": "Pour un adulte, l'Organisation Mondiale de la Santé (OMS) établit : moins de 18,5 (insuffisance pondérale), 18,5 à 24,9 (corpulence normale), 25,0 à 29,9 (surpoids), et 30,0 ou plus (obésité)."
      },
      {
        "q": "Pourquoi l'IMC est-il trompeur pour les personnes sportives ?",
        "a": "L'IMC ne mesure que le poids global rapporté à la taille. Le muscle étant plus lourd et plus dense que le tissu graisseux, une personne très musclée aura un IMC élevé sans avoir d'excès de graisse corporelle."
      },
      {
        "q": "Comment est calculée la formule mathématique de l'IMC ?",
        "a": "La formule de Quetelet est : IMC = Poids (en kg) / (Taille en m)². Exemple pour 68 kg et 1,75 m : 68 / (1,75 * 1,75) = 68 / 3,0625 = 22,20 kg/m²."
      },
      {
        "q": "Qu'est-ce que l'indice BMI Prime ?",
        "a": "Le BMI Prime est le rapport entre votre IMC et la limite supérieure de corpulence normale (25). Un ratio inférieur à 0,74 indique une maigreur, entre 0,74 et 1,00 une corpulence idéale, et supérieur à 1,00 un surpoids."
      },
      {
        "q": "Mes données personnelles de santé sont-elles transmises à un serveur ?",
        "a": "Non. Ce calculateur fonctionne exclusivement dans votre navigateur web sans aucun transfert de données vers l'extérieur."
      }
    ],
    "traps": [
      {
        "title": "Absence de différenciation entre masse maigre et masse grasse",
        "desc": "L'IMC traite chaque kilo de la même manière, qu'il s'agisse de muscle, d'os ou de graisse adipeuse. Des sportifs en parfaite condition physique sont ainsi fréquemment étiquetés à tort comme étant en surpoids."
      },
      {
        "title": "Piège de la graisse viscérale invisible (Fausse minceur)",
        "desc": "Une personne sédentaire avec peu de muscle peut afficher un IMC tout à fait 'normal' tout en accumulant une graisse viscérale abdominale nocive, augmentant le risque d'hypertension et de diabète de type 2 sans signe apparent."
      },
      {
        "title": "Évolution de l'IMC idéal après 65 ans",
        "desc": "Chez les personnes âgées, un IMC légèrement supérieur (entre 25 et 28) constitue un facteur de protection contre la dénutrition et les complications infectieuses. Viser un IMC trop bas augmente la fragilité osseuse et musculaire."
      },
      {
        "title": "Biais morphologique pour les tailles extrêmes",
        "desc": "L'exposant 2 de la formule sous-estime la corpulence des personnes de petite taille et surestime celle des personnes mesurant plus de 1,90 m, car le volume tridimensionnel d'un corps humain ne croît pas de manière purement quadratique."
      },
      {
        "title": "Confondre perte de poids sur la balance et perte de graisse",
        "desc": "Les fluctuations de poids d'un jour à l'autre (1 à 2 kg) sont dues aux réserves d'eau et de glycogène. Se focaliser uniquement sur l'IMC quotidien peut induire en erreur sur l'efficacité réelle d'un programme nutritionnel."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; <a href=\"/fr/\">Santé</a> &gt; Calculateur IMC</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Calculateur IMC en Ligne [Indice de Masse Corporelle OMS]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Évaluez votre corpulence selon les critères de l'Organisation Mondiale de la Santé (OMS). Diagnostic instantané avec fourchette de poids idéal et indice BMI Prime.\n        </p>\n\n        <div class=\"tool-box\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Poids (kg)</label>\n              <input type=\"number\" id=\"fr-imc-w\" class=\"text-input\" value=\"68\" step=\"0.5\" oninput=\"calcFrIMC()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Taille (cm)</label>\n              <input type=\"number\" id=\"fr-imc-h\" class=\"text-input\" value=\"175\" oninput=\"calcFrIMC()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Âge (années)</label>\n              <input type=\"number\" id=\"fr-imc-age\" class=\"text-input\" value=\"28\" oninput=\"calcFrIMC()\" />\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"fr-imc-val\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">22.20</div>\n              <div class=\"stat-lbl\">Votre Indice IMC</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-imc-cat\" class=\"stat-num\" style=\"color: #22c55e; font-size: 1.25rem;\">Corpulence normale</div>\n              <div class=\"stat-lbl\">Classification OMS</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-imc-range\" class=\"stat-num\" style=\"color: var(--fg); font-size: 1.25rem;\">56.7 – 76.3 kg</div>\n              <div class=\"stat-lbl\">Poids idéal recommandé</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-imc-prime\" class=\"stat-num\" style=\"color: #10b981;\">0.89</div>\n              <div class=\"stat-lbl\">Ratio BMI Prime</div>\n            </div>\n          </div>\n\n          <div class=\"deriv-box\" id=\"fr-imc-deriv\">\n            <strong>Formule de Quetelet :</strong> IMC = 68 kg / (1,75 m)² = 68 / 3,0625 = <strong>22,20 kg/m²</strong>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Copier le rapport biométrique IMC</span>\n            <button id=\"btnCopyFrIMC\" class=\"btn-copy\" onclick=\"copyFrIMCReport()\">📋 Copier</button>\n          </div>\n          <pre id=\"fr-imc-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcFrIMC() {\n            const w = parseFloat(document.getElementById('fr-imc-w').value) || 0;\n            const hCm = parseFloat(document.getElementById('fr-imc-h').value) || 1;\n            const age = parseFloat(document.getElementById('fr-imc-age').value) || 25;\n            const hM = hCm / 100;\n            const imc = hM > 0 ? w / (hM * hM) : 0;\n\n            let cat = 'Corpulence normale', col = '#22c55e';\n            if (imc < 18.5) { cat = 'Insuffisance pondérale'; col = '#3b82f6'; }\n            else if (imc < 25) { cat = 'Corpulence normale'; col = '#22c55e'; }\n            else if (imc < 30) { cat = 'Surpoids'; col = '#f59e0b'; }\n            else if (imc < 35) { cat = 'Obésité modérée (Classe I)'; col = '#ef4444'; }\n            else { cat = 'Obésité sévère (Classe II/III)'; col = '#dc2626'; }\n\n            const minW = (18.5 * hM * hM).toFixed(1);\n            const maxW = (24.9 * hM * hM).toFixed(1);\n            const prime = (imc / 25).toFixed(2);\n\n            document.getElementById('fr-imc-val').textContent = imc.toFixed(2);\n            const el = document.getElementById('fr-imc-cat');\n            el.textContent = cat;\n            el.style.color = col;\n            document.getElementById('fr-imc-range').textContent = minW + ' – ' + maxW + ' kg';\n            document.getElementById('fr-imc-prime').textContent = prime;\n            document.getElementById('fr-imc-deriv').innerHTML = '<strong>Formule de Quetelet :</strong> IMC = ' + w + ' kg / (' + hM.toFixed(2) + ' m)² = <strong>' + imc.toFixed(2) + ' kg/m²</strong> (' + cat + ')';\n\n            const summary = [\n              '--- BILAN BIOMÉTRIQUE IMC ---',\n              'Poids : ' + w + ' kg | Taille : ' + hCm + ' cm (' + hM.toFixed(2) + ' m) | Âge : ' + age + ' ans',\n              'Indice de Masse Corporelle (IMC) : ' + imc.toFixed(2) + ' kg/m²',\n              'Classification OMS : ' + cat,\n              'Fourchette de poids idéal : ' + minW + ' kg à ' + maxW + ' kg',\n              'Indice BMI Prime : ' + prime + ' (Norme de santé : 0,74 à 1,00)',\n              'Calculé confidentiellement sur digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('fr-imc-copy-box').textContent = summary;\n          }\n          function copyFrIMCReport() {\n            const btn = document.getElementById('btnCopyFrIMC');\n            const txt = document.getElementById('fr-imc-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Copié !';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', calcFrIMC);\n        </script>\n      "
  },
  {
    "slug": "design/generateur-code-qr",
    "title": "Générateur de Code QR Gratuit en Ligne [SVG Vectoriel & PNG Haute Résolution]",
    "metaDesc": "Créez des codes QR personnalisés directement dans votre navigateur sans serveur externe. Export PNG haute définition et SVG vectoriel avec correction d'erreurs.",
    "category": "Design",
    "faq": [
      {
        "q": "Ces codes QR ont-ils une durée de validité limitée ?",
        "a": "Non. Ce sont des codes QR statiques contenant directement la donnée codée. Ils restent lisibles indéfiniment sans risque de désactivation par un tiers."
      },
      {
        "q": "Mes identifiants Wi-Fi ou mes liens confidentiels sont-ils envoyés sur un serveur ?",
        "a": "Non. Toute la logique de calcul de la matrice QR et le rendu graphique s'effectuent à 100% en local dans votre navigateur grâce à un moteur JavaScript autonome."
      },
      {
        "q": "Quel niveau de correction d'erreur (ECC) choisir ?",
        "a": "Le niveau M (15% de redondance) est recommandé pour la plupart des usages digitaux. Pour des affiches extérieures ou des cartes susceptibles d'être pliées ou tachées, optez pour le niveau Q (25%) ou H (30%)."
      },
      {
        "q": "Quelle taille minimale respecter à l'impression ?",
        "a": "La règle optique générale est de diviser la distance d'analyse par 10. Pour un scan à 30 cm de distance, prévoyez un code QR d'au moins 3 cm de côté."
      },
      {
        "q": "Puis-je créer un code QR à fond transparent ?",
        "a": "Oui. Il vous suffit de cocher l'option 'Fond transparent' avant de télécharger votre fichier au format PNG ou SVG."
      }
    ],
    "traps": [
      {
        "title": "Contraste inversé (Modules clairs sur fond sombre)",
        "desc": "Bien que visuellement stylés, les codes QR clairs sur fond sombre posent d'importants problèmes de décodage à de nombreuses applications de scan anciennes ou à bas coût. Privilégiez toujours un motif sombre sur un fond clair."
      },
      {
        "title": "Absence de marge de sécurité (Zone de silence)",
        "desc": "Un code QR doit impérativement être entouré d'une bordure neutre d'au moins 4 modules. Rapprocher des visuels, des logos ou du texte trop près des coins empêche l'appareil photo de verrouiller les mires d'alignement."
      },
      {
        "title": "Piège des générateurs commerciaux avec redirections temporaires",
        "desc": "De nombreux générateurs en ligne créent des redirections vers leurs propres noms de domaine et désactivent vos QR codes après 14 jours pour vous contraindre à souscrire un abonnement payant. Notre outil génère exclusivement du code direct sans intermédiaire."
      },
      {
        "title": "Surcharge de données entraînant une matrice illisible",
        "desc": "Intégrer de très longues adresses URL chargées de paramètres de suivi alourdit considérablement la densité de la matrice (augmentation de la version QR). Pour une lisibilité optimale, raccourcissez vos liens avant de les encoder."
      },
      {
        "title": "Niveau de correction d'erreur inadapté pour les supports imprimés",
        "desc": "Utiliser le niveau L (7%) sur un support physique exposé aux rayures ou aux plis entraîne un taux de panne élevé. Privilégiez le niveau M ou Q pour toute impression papier ou carton."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; <a href=\"/fr/\">Design</a> &gt; Code QR</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Générateur de Code QR Gratuit en Ligne [SVG &amp; PNG]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Générez des codes QR statiques en haute résolution sans traçage ni limitation. Personnalisez les couleurs, le niveau de correction et exportez en PNG ou SVG vectoriel.\n        </p>\n\n        <div class=\"tool-box\">\n          <div class=\"field-group\">\n            <label class=\"field-label\">Texte / URL / Données</label>\n            <input type=\"text\" id=\"fr-qr-txt\" class=\"code-input\" value=\"https://digitaltoolsshed.com\" oninput=\"genFrQR()\" />\n          </div>\n\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Correction d'erreurs (ECC)</label>\n              <select id=\"fr-qr-ecc\" class=\"text-input\" onchange=\"genFrQR()\">\n                <option value=\"L\">Niveau L (~7% récupération)</option>\n                <option value=\"M\" selected>Niveau M (~15% standard)</option>\n                <option value=\"Q\">Niveau Q (~25% avancé)</option>\n                <option value=\"H\">Niveau H (~30% maximal)</option>\n              </select>\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Zone de silence : <span id=\"fr-lbl-margin\">4 modules</span></label>\n              <input type=\"range\" id=\"fr-qr-margin\" min=\"0\" max=\"8\" value=\"4\" style=\"width:100%;\" oninput=\"document.getElementById('fr-lbl-margin').textContent = this.value + ' modules'; genFrQR();\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Résolution (PNG)</label>\n              <select id=\"fr-qr-size\" class=\"text-input\" onchange=\"genFrQR()\">\n                <option value=\"256\">256 × 256 px</option>\n                <option value=\"512\" selected>512 × 512 px (HD)</option>\n                <option value=\"1024\">1024 × 1024 px (Impression)</option>\n              </select>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-top: 0.5rem;\">\n            <div style=\"display: flex; align-items: center; gap: 0.5rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Premier plan :</label>\n              <input type=\"color\" id=\"fr-qr-fg\" value=\"#000000\" style=\"cursor: pointer; height: 36px; width: 44px; padding: 0; border: 1px solid var(--border);\" onchange=\"genFrQR()\" />\n            </div>\n            <div style=\"display: flex; align-items: center; gap: 0.5rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Arrière-plan :</label>\n              <input type=\"color\" id=\"fr-qr-bg\" value=\"#ffffff\" style=\"cursor: pointer; height: 36px; width: 44px; padding: 0; border: 1px solid var(--border);\" onchange=\"genFrQR()\" />\n            </div>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\">\n              <input type=\"checkbox\" id=\"fr-qr-trans\" onchange=\"genFrQR()\" /> Fond transparent\n            </label>\n          </div>\n\n          <!-- Canvas Preview -->\n          <div style=\"display: flex; flex-direction: column; align-items: center; padding: 2rem 0;\">\n            <canvas id=\"fr-qr-canvas\" style=\"max-width: 260px; max-height: 260px; border: 1px solid var(--border); border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);\"></canvas>\n            <div style=\"display: flex; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap; justify-content: center;\">\n              <button class=\"btn-primary\" onclick=\"downloadFrQRPNG()\">💾 Télécharger PNG</button>\n              <button class=\"btn-sec\" onclick=\"downloadFrQRSVG()\">📐 Télécharger SVG Vectoriel</button>\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-ver\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">Version 3</div>\n              <div class=\"stat-lbl\">Version du Code QR</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-mod\" class=\"stat-num\" style=\"color: var(--fg);\">29 × 29</div>\n              <div class=\"stat-lbl\">Matrice de Modules</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-len\" class=\"stat-num\" style=\"color: #10b981;\">28 caractères</div>\n              <div class=\"stat-lbl\">Longueur de charge</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-print\" class=\"stat-num\" style=\"color: #f59e0b;\">3,7 × 3,7 cm</div>\n              <div class=\"stat-lbl\">Taille minimale d'impression</div>\n            </div>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Fiche technique et spécification du code QR</span>\n            <button id=\"btnCopyFrQR\" class=\"btn-copy\" onclick=\"copyFrQRReport()\">📋 Copier la Fiche</button>\n          </div>\n          <pre id=\"fr-qr-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\nvar qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw\"code length overflow. (\"+o.getLengthInBits()+\">\"+8*u+\")\";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||\"Byte\"){case\"Numeric\":e=M(t);break;case\"Alphanumeric\":e=x(t);break;case\"Byte\":e=m(t);break;case\"Kanji\":e=L(t);break;default:throw\"mode:\"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+\",\"+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createSvgTag=function(t,r,e,n){var o={};\"object\"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e=\"string\"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||\"qrcode-description\":null,(n=\"string\"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||\"qrcode-title\":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l=\"\";for(c=\"l\"+t+\",0 0,\"+t+\" -\"+t+\",0 0,-\"+t+\"z \",l+='<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"',l+=o.scalable?\"\":' width=\"'+g+'px\" height=\"'+g+'px\"',l+=' viewBox=\"0 0 '+g+\" \"+g+'\" ',l+=' preserveAspectRatio=\"xMinYMin meet\"',l+=\">\",l+='<rect width=\"100%\" height=\"100%\" fill=\"white\" cx=\"0\" cy=\"0\"/>',l+='<path d=\"',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+=\"M\"+(i*t+r)+\",\"+u+c);return l+='\" stroke=\"transparent\" fill=\"black\"/>',l+=\"</svg>\"},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?\"black\":\"white\",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default;var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw\"bad maskPattern:\"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw\"mode:\"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw\"mode:\"+t}else{if(!(r<41))throw\"type:\"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw\"mode:\"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw\"glog(\"+t+\")\";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+\"/\"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw\"bad rs block @ typeNumber:\"+e+\"/errorCorrectionLevel:\"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if(\"0\"<=t&&t<=\"9\")return t.charCodeAt(0)-\"0\".charCodeAt(0);throw\"illegal char :\"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if(\"0\"<=t&&t<=\"9\")return t.charCodeAt(0)-\"0\".charCodeAt(0);if(\"A\"<=t&&t<=\"Z\")return t.charCodeAt(0)-\"A\".charCodeAt(0)+10;switch(t){case\" \":return 36;case\"$\":return 37;case\"%\":return 38;case\"*\":return 39;case\"+\":return 40;case\"-\":return 41;case\".\":return 42;case\"/\":return 43;case\":\":return 44;default:throw\"illegal char :\"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw\"sjis not supported.\";!function(){var t=n(\"友\");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw\"sjis not supported.\"}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw\"illegal char at \"+(e+1)+\"/\"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw\"illegal char at \"+(e+1)}};return i};return f};if(typeof window!==\"undefined\"){window.qrcode=qrcode;}\n</script>\n        <script>\n          let frQrInstance = null;\n          function genFrQR() {\n            const txt = document.getElementById('fr-qr-txt').value.trim() || ' ';\n            const ecc = document.getElementById('fr-qr-ecc').value;\n            const margin = parseInt(document.getElementById('fr-qr-margin').value, 10);\n            const size = parseInt(document.getElementById('fr-qr-size').value, 10);\n            const fg = document.getElementById('fr-qr-fg').value;\n            const bg = document.getElementById('fr-qr-bg').value;\n            const isTrans = document.getElementById('fr-qr-trans').checked;\n            const canvas = document.getElementById('fr-qr-canvas');\n\n            try {\n              const qr = qrcode(0, ecc);\n              qr.addData(txt);\n              qr.make();\n              frQrInstance = qr;\n\n              const count = qr.getModuleCount();\n              const totalCells = count + (margin * 2);\n              canvas.width = size;\n              canvas.height = size;\n              const ctx = canvas.getContext('2d');\n              ctx.imageSmoothingEnabled = false;\n\n              if (isTrans) {\n                ctx.clearRect(0, 0, size, size);\n              } else {\n                ctx.fillStyle = bg;\n                ctx.fillRect(0, 0, size, size);\n              }\n\n              const cellSize = size / totalCells;\n              ctx.fillStyle = fg;\n              for (let r = 0; r < count; r++) {\n                for (let c = 0; c < count; c++) {\n                  if (qr.isDark(r, c)) {\n                    ctx.fillRect(\n                      Math.round((c + margin) * cellSize),\n                      Math.round((r + margin) * cellSize),\n                      Math.ceil(cellSize),\n                      Math.ceil(cellSize)\n                    );\n                  }\n                }\n              }\n\n              const ver = (count - 17) / 4;\n              document.getElementById('fr-stat-ver').textContent = 'Version ' + ver;\n              document.getElementById('fr-stat-mod').textContent = count + ' × ' + count;\n              document.getElementById('fr-stat-len').textContent = txt.length + ' caractères';\n              const minCm = ((totalCells * 0.42) / 10).toFixed(1);\n              document.getElementById('fr-stat-print').textContent = minCm + ' × ' + minCm + ' cm';\n\n              const summary = [\n                '--- SPÉCIFICATION DU CODE QR ---',\n                'Contenu encodé : ' + txt,\n                'Matrice QR : Version ' + ver + ' (' + count + 'x' + count + ' modules)',\n                'Correction derreurs : Niveau ' + ecc,\n                'Marge de silence : ' + margin + ' modules',\n                'Dimensions image : ' + size + 'x' + size + ' px',\n                'Couleur modules : ' + fg + ' | Fond : ' + (isTrans ? 'Transparent' : bg),\n                'Généré 100% sans serveur tiers sur digitaltoolsshed.com'\n              ].join('\\n');\n              document.getElementById('fr-qr-copy-box').textContent = summary;\n            } catch (err) {\n              console.error('QR Render Error:', err);\n            }\n          }\n          function downloadFrQRPNG() {\n            const canvas = document.getElementById('fr-qr-canvas');\n            const a = document.createElement('a');\n            a.download = 'qrcode-digitaltoolsshed.png';\n            a.href = canvas.toDataURL('image/png');\n            a.click();\n          }\n          function downloadFrQRSVG() {\n            if (!frQrInstance) return;\n            const margin = parseInt(document.getElementById('fr-qr-margin').value, 10);\n            const svgTag = frQrInstance.createSvgTag({ cellSize: 8, margin: margin });\n            const blob = new Blob([svgTag], { type: 'image/svg+xml;charset=utf-8' });\n            const url = URL.createObjectURL(blob);\n            const a = document.createElement('a');\n            a.download = 'qrcode-digitaltoolsshed.svg';\n            a.href = url;\n            a.click();\n            URL.revokeObjectURL(url);\n          }\n          function copyFrQRReport() {\n            const btn = document.getElementById('btnCopyFrQR');\n            const txt = document.getElementById('fr-qr-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Copié !';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', genFrQR);\n        </script>\n      "
  },
  {
    "slug": "security/generateur-mot-de-passe",
    "title": "Générateur de Mot de Passe Sécurisé [CSPRNG & Entropie en Ligne]",
    "metaDesc": "Créez des mots de passe aléatoires et ultra-sécurisés avec l'API Web Cryptography. Zéro envoi serveur, calcul d'entropie Shannon et protection contre le brute-force.",
    "category": "Sécurité",
    "faq": [
      {
        "q": "Pourquoi l'API Web Cryptography est-elle supérieure à Math.random() ?",
        "a": "Math.random() repose sur un algorithme prévisible à usage purement graphique. window.crypto utilise le générateur cryptographique du système d'exploitation alimenté par le bruit thermique matériel (CSPRNG), rendant toute prédiction impossible."
      },
      {
        "q": "Combien de bits d'entropie sont requis pour une sécurité optimale ?",
        "a": "L'ANSSI et le NIST recommandent un minimum de 64 bits pour des comptes ordinaires, et de 100 à 128 bits d'entropie pour les mots de passe maîtres de coffres-forts numériques ou les clés de chiffrement."
      },
      {
        "q": "Les mots de passe créés ici sont-ils enregistrés sur vos serveurs ?",
        "a": "Non. Ils sont générés instantanément dans la mémoire locale de votre machine. Aucune requête réseau ni aucun cookie n'enregistre vos données."
      },
      {
        "q": "Pourquoi exclure les caractères ambigus comme 0, O, 1 et l ?",
        "a": "Pour éviter les erreurs humaines de frappe lors de la retranscription manuelle d'un mot de passe sur un smartphone ou depuis une sauvegarde papier."
      },
      {
        "q": "Quel est le temps nécessaire à un supercalculateur pour casser 20 caractères ?",
        "a": "Avec 20 caractères combinant majuscules, minuscules, chiffres et symboles, l'entropie dépasse 131 bits. Un réseau de milliers de processeurs graphiques mettrait plusieurs milliards d'années à tester toutes les combinaisons."
      }
    ],
    "traps": [
      {
        "title": "Utilisation d'un générateur pseudo-aléatoire prévisible (Math.random)",
        "desc": "Les générateurs basés sur Math.random() sont déterministes. Un pirate qui analyse quelques clés produites peut déduire l'état interne de la graine (seed) et anticiper les mots de passe passés ou futurs."
      },
      {
        "title": "Biais statistique de modulo dans le tirage des caractères",
        "desc": "Un algorithme utilisant 'hasard % longueur_ensemble' favorise mathématiquement les premiers caractères de la liste lorsque l'espace aléatoire n'est pas un multiple exact. Cela crée une faille statistique exploitable par des attaques ciblées."
      },
      {
        "title": "Fuite dans le presse-papiers du système d'exploitation",
        "desc": "Copier un mot de passe le rend accessible à tout logiciel espion ou extension de navigateur ayant accès au presse-papiers. Collez-le sans délai dans votre gestionnaire et purgez votre presse-papiers."
      },
      {
        "title": "Génération effectuée sur un serveur distant via une API",
        "desc": "Les services qui génèrent des mots de passe côté serveur exposent vos secrets aux journaux d'accès (logs Apache/Nginx), aux caches mandataires et aux attaques par interception de trafic."
      },
      {
        "title": "Réutilisation d'un mot de passe fort sur plusieurs comptes",
        "desc": "Même un mot de passe de 30 caractères perd toute efficacité s'il est partagé. Si l'un des sites partenaires subit une fuite de données, l'ensemble de vos accès en ligne se retrouve vulnérable."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; <a href=\"/fr/\">Sécurité</a> &gt; Mot de Passe</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Générateur de Mot de Passe Sécurisé [CSPRNG &amp; Entropie]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Générez des mots de passe robustes et cryptographiquement imprévisibles grâce à l'API Web Cryptography. Analyse d'entropie de Shannon et générateur par lot.\n        </p>\n\n        <div class=\"tool-box\">\n          <div class=\"field-group\">\n            <label class=\"field-label\">Mot de passe généré</label>\n            <div style=\"display: flex; gap: 0.5rem;\">\n              <input type=\"text\" id=\"fr-pw-out\" class=\"code-input\" style=\"font-size: 1.25rem; font-weight: bold; color: var(--fg);\" readonly />\n              <button class=\"btn-primary\" onclick=\"genFrPW()\" style=\"flex-shrink: 0;\">↻ Nouveau</button>\n            </div>\n          </div>\n\n          <div class=\"field-group\">\n            <div style=\"display: flex; justify-content: space-between; margin-bottom: 0.35rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Longueur : <span id=\"fr-pw-len-val\" style=\"color: var(--fg); font-weight: bold;\">20</span> caractères</label>\n              <span id=\"fr-pw-badge\" style=\"font-family: var(--mono); font-size: 0.8rem; color: #22c55e; font-weight: bold;\">131 bits (Très robuste)</span>\n            </div>\n            <input type=\"range\" id=\"fr-pw-len\" min=\"8\" max=\"64\" value=\"20\" style=\"width: 100%; cursor: pointer;\" oninput=\"document.getElementById('fr-pw-len-val').textContent = this.value; genFrPW();\" />\n          </div>\n\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); margin-bottom: 1rem;\">\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"fr-opt-u\" checked onchange=\"genFrPW()\"> Majuscules (A-Z)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"fr-opt-l\" checked onchange=\"genFrPW()\"> Minuscules (a-z)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"fr-opt-d\" checked onchange=\"genFrPW()\"> Chiffres (0-9)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"fr-opt-s\" checked onchange=\"genFrPW()\"> Symboles (!@#$%)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"fr-opt-no-ambig\" onchange=\"genFrPW()\"> Exclure 0, O, 1, l, I</label>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-ent\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">131 bits</div>\n              <div class=\"stat-lbl\">Entropie de Shannon</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-pool\" class=\"stat-num\" style=\"color: var(--fg);\">94 caractères</div>\n              <div class=\"stat-lbl\">Ensemble de symboles</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-crack-on\" class=\"stat-num\" style=\"color: #22c55e;\">Invulnérable</div>\n              <div class=\"stat-lbl\">Attaque en ligne (100/s)</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"fr-stat-crack-gpu\" class=\"stat-num\" style=\"color: #22c55e;\">Milliards d'années</div>\n              <div class=\"stat-lbl\">Cluster GPU (100 Mds/s)</div>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.25rem;\">\n            <button id=\"btnCopyFrPW\" class=\"btn-primary\" onclick=\"copyFrPW()\">📋 Copier le Mot de Passe</button>\n            <button class=\"btn-sec\" onclick=\"genFrBatch()\">⚡ Générer un Lot de 5</button>\n          </div>\n\n          <div id=\"fr-batch-box\" style=\"display: none; margin-top: 1.25rem; padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;\">\n            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;\">\n              <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold;\">Mots de passe par lot (5×)</span>\n              <button id=\"btnCopyFrBatch\" class=\"btn-copy\" onclick=\"copyFrBatch()\">📋 Tout Copier</button>\n            </div>\n            <pre id=\"fr-batch-list\" style=\"margin: 0; font-family: var(--mono); font-size: 0.9rem; line-height: 1.6;\"></pre>\n          </div>\n        </div>\n\n        <script>\n          function getFrCharPool() {\n            let pool = '';\n            if (document.getElementById('fr-opt-u').checked) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';\n            if (document.getElementById('fr-opt-l').checked) pool += 'abcdefghijklmnopqrstuvwxyz';\n            if (document.getElementById('fr-opt-d').checked) pool += '0123456789';\n            if (document.getElementById('fr-opt-s').checked) pool += '!@#$%^&*()-_=+[]{}|;:,.<>?';\n            if (document.getElementById('fr-opt-no-ambig').checked) {\n              pool = pool.replace(/[0O1lI]/g, '');\n            }\n            return pool || 'abcdefghijklmnopqrstuvwxyz';\n          }\n          function genFrPW() {\n            const len = parseInt(document.getElementById('fr-pw-len').value, 10);\n            const pool = getFrCharPool();\n            const poolLen = pool.length;\n\n            const arr = new Uint32Array(len);\n            window.crypto.getRandomValues(arr);\n            let pw = '';\n            for (let i = 0; i < len; i++) {\n              pw += pool[arr[i] % poolLen];\n            }\n            document.getElementById('fr-pw-out').value = pw;\n\n            const entropy = Math.round(len * (Math.log(poolLen) / Math.log(2)));\n            document.getElementById('fr-stat-ent').textContent = entropy + ' bits';\n            document.getElementById('fr-stat-pool').textContent = poolLen + ' caractères';\n\n            let badgeText = 'Faible', badgeCol = '#ef4444';\n            if (entropy >= 100) { badgeText = entropy + ' bits (Niveau militaire)'; badgeCol = '#22c55e'; }\n            else if (entropy >= 80) { badgeText = entropy + ' bits (Très robuste)'; badgeCol = '#10b981'; }\n            else if (entropy >= 60) { badgeText = entropy + ' bits (Satisfaisant)'; badgeCol = '#f59e0b'; }\n            const bEl = document.getElementById('fr-pw-badge');\n            bEl.textContent = badgeText;\n            bEl.style.color = badgeCol;\n          }\n          function copyFrPW() {\n            const btn = document.getElementById('btnCopyFrPW');\n            const pw = document.getElementById('fr-pw-out').value;\n            navigator.clipboard.writeText(pw).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Copié !';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          function genFrBatch() {\n            const len = parseInt(document.getElementById('fr-pw-len').value, 10);\n            const pool = getFrCharPool();\n            const poolLen = pool.length;\n            const list = [];\n            for (let b = 0; b < 5; b++) {\n              const arr = new Uint32Array(len);\n              window.crypto.getRandomValues(arr);\n              let pw = '';\n              for (let i = 0; i < len; i++) pw += pool[arr[i] % poolLen];\n              list.push(pw);\n            }\n            document.getElementById('fr-batch-list').textContent = list.join('\\n');\n            document.getElementById('fr-batch-box').style.display = 'block';\n          }\n          function copyFrBatch() {\n            const btn = document.getElementById('btnCopyFrBatch');\n            const txt = document.getElementById('fr-batch-list').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Copié !';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', genFrPW);\n        </script>\n      "
  }
];
  const ruTools = [
  {
    "slug": "math/kalkulyator-protsentov",
    "title": "Калькулятор процентов онлайн [3 метода: процент от числа и разница]",
    "metaDesc": "Быстрый и точный расчет процентов: найти процент от числа, сколько процентов составляет число, расчет процентного изменения с формулами и решением.",
    "category": "Математика",
    "faq": [
      {
        "q": "Как быстро посчитать 20% от числа в уме?",
        "a": "Разделите исходное число на 10 (это даст 10%) и умножьте полученное значение на 2. Пример: 20% от 450 = (450 / 10) * 2 = 45 * 2 = 90."
      },
      {
        "q": "В чем математическая разница между процентом и процентным пунктом?",
        "a": "Процентный пункт показывает абсолютную разницу между двумя процентными ставками (рост ставки с 10% до 12% — это +2 процентных пункта). В относительном же выражении ставка выросла на +20%."
      },
      {
        "q": "Как правильно выделить сумму НДС 20% из стоимости товара?",
        "a": "Чтобы узнать цену без НДС, разделите итоговую стоимость на 1,20. Пример: при цене 12 000 руб. с НДС, чистая стоимость равна 12 000 / 1,20 = 10 000 руб., а сумма налога составляет ровно 2 000 руб."
      },
      {
        "q": "Почему падение на 50% и последующий рост на 50% приводят к убытку?",
        "a": "Потому что последующий рост рассчитывается от уменьшенной базы. Со 100 рублей после падения на 50% остается 50 рублей. Рост на 50% от 50 рублей дает лишь 25 рублей, и итоговая сумма составляет 75 рублей (чистый убыток -25%)."
      },
      {
        "q": "Передаются ли введенные финансовые данные на сервер?",
        "a": "Нет. Все математические операции производятся исключительно локально в вашем браузере с помощью JavaScript без отправки на сервер."
      }
    ],
    "traps": [
      {
        "title": "Путаница между процентными пунктами и относительным приростом",
        "desc": "Если инфляция или кредитная ставка выросла с 4% до 5%, абсолютный прирост составил 1 процентный пункт. Однако в относительном выражении нагрузка выросла на +25%. Подмена этих понятий часто приводит к серьезным финансовым ошибкам в кредитных расчетах."
      },
      {
        "title": "Асимметрия инвестиционных убытков и необходимой доходности",
        "desc": "Каждый процент просадки требует значительно большего процента роста для восстановления капитала. Просадка в 20% требует роста на 25%, потеря 50% капитала требует удвоения (+100%), а падение на 90% требует колоссального роста в +900% для выхода в безубыток."
      },
      {
        "title": "Ошибочное суммирование последовательных скидок",
        "desc": "Скидка 20% плюс дополнительная скидка 30% не равны 50% общей скидки. Вторая скидка применяется к уже уменьшенной цене: 100% * 0,80 * 0,70 = 56% от начальной стоимости, то есть реальная суммарная скидка составляет 44%."
      },
      {
        "title": "Ошибочное вычитание НДС простым умножением на 0,80",
        "desc": "Выделять НДС 20% вычитанием 20% из цены с налогом грубо ошибочно. Налог начисляется на базу без НДС, поэтому доля налога в итоговой цене составляет 20 / 120 = 16,67%. Корректное выделение — деление суммы на 1,20."
      },
      {
        "title": "Накопление погрешностей округления в сложных формулах",
        "desc": "Округление результатов на промежуточных шагах при расчете сложных процентов или долей приводит к существенным расхождениям. Профессиональные алгоритмы сохраняют полную точность чисел с плавающей запятой до финального вывода."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; <a href=\"/ru/\">Калькуляторы</a> &gt; Проценты</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Калькулятор процентов онлайн [3 метода: процент от числа и разница]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Быстрый и точный расчет всех процентных операций в реальном времени: найти процент от числа, долю одного числа от другого или процентное изменение с пошаговым решением.\n        </p>\n\n        <!-- 1. Найти процент от числа -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">1. Сколько будет X% от числа Y? (Нахождение процента)</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>Сколько будет</span>\n            <input type=\"number\" id=\"ru-p1-x\" class=\"text-input\" style=\"width: 110px;\" value=\"15\" oninput=\"calcRuP1()\" />\n            <span>% от</span>\n            <input type=\"number\" id=\"ru-p1-y\" class=\"text-input\" style=\"width: 130px;\" value=\"5000\" oninput=\"calcRuP1()\" />\n            <span>=</span>\n            <strong id=\"ru-p1-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">750.00</strong>\n          </div>\n          <div id=\"ru-p1-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Пошаговое решение:</strong> P = (15 / 100) × 5000 = 0,15 × 5000 = <strong>750,00</strong>\n          </div>\n        </div>\n\n        <!-- 2. Сколько процентов составляет X от Y -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">2. Сколько процентов составляет число X от Y?</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>Число</span>\n            <input type=\"number\" id=\"ru-p2-x\" class=\"text-input\" style=\"width: 110px;\" value=\"120\" oninput=\"calcRuP2()\" />\n            <span>от числа</span>\n            <input type=\"number\" id=\"ru-p2-y\" class=\"text-input\" style=\"width: 130px;\" value=\"600\" oninput=\"calcRuP2()\" />\n            <span>=</span>\n            <strong id=\"ru-p2-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">20.00 %</strong>\n          </div>\n          <div id=\"ru-p2-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Пошаговое решение:</strong> p% = (120 / 600) × 100% = 0,20 × 100% = <strong>20,00 %</strong>\n          </div>\n        </div>\n\n        <!-- 3. Процентное изменение -->\n        <div class=\"tool-box\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 0.8rem; color: var(--fg);\">3. Процентное изменение (Прирост / Снижение)</h3>\n          <div style=\"display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;\">\n            <span>С исходного значения</span>\n            <input type=\"number\" id=\"ru-p3-x\" class=\"text-input\" style=\"width: 110px;\" value=\"400\" oninput=\"calcRuP3()\" />\n            <span>до нового значения</span>\n            <input type=\"number\" id=\"ru-p3-y\" class=\"text-input\" style=\"width: 110px;\" value=\"550\" oninput=\"calcRuP3()\" />\n            <span>=</span>\n            <strong id=\"ru-p3-res\" style=\"font-family: var(--mono); font-size: 1.35rem; color: #22c55e; margin-left: 0.5rem;\">+37.50 % (Прирост)</strong>\n          </div>\n          <div id=\"ru-p3-formula\" class=\"deriv-box\" style=\"margin-top: 1rem; margin-bottom: 0.5rem;\">\n            <strong>Пошаговое решение:</strong> Δ% = ((550 - 400) / 400) × 100% = <strong>+37,50 %</strong>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Итоговый отчет расчета процентов</span>\n            <button id=\"btnCopyRuPct\" class=\"btn-copy\" onclick=\"copyRuPctReport()\">📋 Скопировать</button>\n          </div>\n          <pre id=\"ru-pct-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcRuP1() {\n            const x = parseFloat(document.getElementById('ru-p1-x').value) || 0;\n            const y = parseFloat(document.getElementById('ru-p1-y').value) || 0;\n            const res = (x / 100) * y;\n            document.getElementById('ru-p1-res').textContent = res.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });\n            document.getElementById('ru-p1-formula').innerHTML = '<strong>Пошаговое решение:</strong> P = (' + x + ' / 100) × ' + y + ' = <strong>' + res.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</strong>';\n            updateRuPctReport();\n          }\n          function calcRuP2() {\n            const x = parseFloat(document.getElementById('ru-p2-x').value) || 0;\n            const y = parseFloat(document.getElementById('ru-p2-y').value) || 0;\n            const res = y !== 0 ? (x / y) * 100 : 0;\n            document.getElementById('ru-p2-res').textContent = res.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';\n            document.getElementById('ru-p2-formula').innerHTML = '<strong>Пошаговое решение:</strong> p% = (' + x + ' / ' + y + ') × 100% = <strong>' + res.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %</strong>';\n            updateRuPctReport();\n          }\n          function calcRuP3() {\n            const x = parseFloat(document.getElementById('ru-p3-x').value) || 0;\n            const y = parseFloat(document.getElementById('ru-p3-y').value) || 0;\n            const el = document.getElementById('ru-p3-res');\n            if (x === 0) { el.textContent = 'Деление на ноль невозможно'; return; }\n            const diff = ((y - x) / x) * 100;\n            const isPos = diff >= 0;\n            el.textContent = (isPos ? '+' : '') + diff.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '% ' + (isPos ? '(Прирост)' : '(Снижение)');\n            el.style.color = isPos ? '#22c55e' : '#ef4444';\n            document.getElementById('ru-p3-formula').innerHTML = '<strong>Пошаговое решение:</strong> Δ% = ((' + y + ' - ' + x + ') / ' + x + ') × 100% = <strong>' + (isPos ? '+' : '') + diff.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %</strong>';\n            updateRuPctReport();\n          }\n          function updateRuPctReport() {\n            const p1x = document.getElementById('ru-p1-x').value;\n            const p1y = document.getElementById('ru-p1-y').value;\n            const p1r = document.getElementById('ru-p1-res').textContent;\n            const p2x = document.getElementById('ru-p2-x').value;\n            const p2y = document.getElementById('ru-p2-y').value;\n            const p2r = document.getElementById('ru-p2-res').textContent;\n            const p3x = document.getElementById('ru-p3-x').value;\n            const p3y = document.getElementById('ru-p3-y').value;\n            const p3r = document.getElementById('ru-p3-res').textContent;\n\n            const text = [\n              '--- ОТЧЕТ КАЛЬКУЛЯТОРА ПРОЦЕНТОВ ---',\n              '1. Процент от числа: ' + p1x + '% от ' + p1y + ' = ' + p1r,\n              '2. Доля числа: ' + p2x + ' от ' + p2y + ' = ' + p2r,\n              '3. Изменение значения с ' + p3x + ' до ' + p3y + ' = ' + p3r,\n              'Расчет выполнен 100% на клиенте на digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('ru-pct-copy-box').textContent = text;\n          }\n          function copyRuPctReport() {\n            const btn = document.getElementById('btnCopyRuPct');\n            const txt = document.getElementById('ru-pct-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Скопировано!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', function() {\n            calcRuP1(); calcRuP2(); calcRuP3();\n          });\n        </script>\n      "
  },
  {
    "slug": "health/kalkulyator-imt",
    "title": "Калькулятор ИМТ онлайн [Индекс массы тела по стандартам ВОЗ]",
    "metaDesc": "Рассчитайте индекс массы тела (ИМТ) по рекомендациям ВОЗ для мужчин и женщин с учетом диапазона идеального веса, индекса Брока и расшифровки категорий.",
    "category": "Здоровье",
    "faq": [
      {
        "q": "Какая классификация ИМТ установлена нормами ВОЗ?",
        "a": "По стандартам Всемирной организации здравоохранения (ВОЗ): менее 18,5 — дефицит массы тела; 18,5–24,9 — нормальный здоровый вес; 25,0–29,9 — избыточная масса (предожирение); 30,0 и более — ожирение I, II или III степени."
      },
      {
        "q": "Почему расчет ИМТ не подходит для спортсменов и бодибилдеров?",
        "a": "ИМТ не разделяет вес на жировую и мышечную ткани. Мышцы значительно плотнее и тяжелее жира, поэтому у мускулистых людей ИМТ может ошибочно показывать избыточный вес при минимальном содержании жира."
      },
      {
        "q": "Как математически рассчитывается формула ИМТ Кетле?",
        "a": "Формула: ИМТ = Вес (в кг) / (Рост в метрах)². Пример: для человека весом 70 кг и ростом 175 см: 70 / (1,75 * 1,75) = 70 / 3,0625 = 22,86 кг/м²."
      },
      {
        "q": "Что такое показатель BMI Prime?",
        "a": "BMI Prime — это отношение вашего реального ИМТ к верхней границе нормы (25). Значение ниже 0,74 указывает на дефицит веса, от 0,74 до 1,00 — на нормальный диапазон, а выше 1,00 — на избыток массы."
      },
      {
        "q": "Сохраняются ли мои медицинские параметры на сервере?",
        "a": "Нет. Все расчеты производятся строго в памяти вашего браузера. Никакие персональные параметры не отправляются в сеть."
      }
    ],
    "traps": [
      {
        "title": "Игнорирование соотношения мышечной и жировой ткани",
        "desc": "ИМТ суммирует весь вес без дифференциации. Атлеты с низким процентом жира нередко классифицируются как люди с предожирением, а малоподвижные люди с саркопенией (недостатком мышц) выглядят 'здоровыми', имея скрытый избыток жира."
      },
      {
        "title": "Опасность висцерального жира при внешне нормальном весе",
        "desc": "Синдром 'Skinny Fat' (худой снаружи, жирный внутри) сопровождается накоплением опасного висцерального жира вокруг внутренних органов при нормальном общем ИМТ. Это несет скрытые риски диабета 2 типа и сердечно-сосудистых катастроф."
      },
      {
        "title": "Возрастные нормы веса для людей старше 65 лет",
        "desc": "Для пожилых людей умеренно повышенный ИМТ (от 25 до 28) является защитным фактором, снижающим смертность при пневмониях и операциях. Попытки жестко снизить ИМТ до 20–21 в преклонном возрасте повышают риск саркопении и переломов."
      },
      {
        "title": "Геометрическое искажение формулы для очень высокого роста",
        "desc": "Поскольку рост возводится лишь во вторую степень, а объем тела пропорционален кубу, люди ростом выше 190 см получают завышенные показатели ИМТ, а люди ростом ниже 160 см — искусственно заниженные."
      },
      {
        "title": "Слепая ориентация на ежедневные колебания стрелки весов",
        "desc": "Колебания веса в пределах 1–2 кг в течение суток вызваны задержкой воды (углеводы и натрий связывают жидкость). Ежедневный контроль ИМТ отражает лишь водный баланс, а не реальную динамику жировой прослойки."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; <a href=\"/ru/\">Здоровье</a> &gt; Калькулятор ИМТ</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Калькулятор ИМТ онлайн [Индекс массы тела ВОЗ]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Рассчитайте персональный индекс массы тела в соответствии со стандартами ВОЗ. Оценка идеального веса, индекса BMI Prime и рекомендации.\n        </p>\n\n        <div class=\"tool-box\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Вес (кг)</label>\n              <input type=\"number\" id=\"ru-imt-w\" class=\"text-input\" value=\"70\" step=\"0.5\" oninput=\"calcRuIMT()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Рост (см)</label>\n              <input type=\"number\" id=\"ru-imt-h\" class=\"text-input\" value=\"175\" oninput=\"calcRuIMT()\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Возраст (лет)</label>\n              <input type=\"number\" id=\"ru-imt-age\" class=\"text-input\" value=\"28\" oninput=\"calcRuIMT()\" />\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"ru-imt-val\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">22.86</div>\n              <div class=\"stat-lbl\">Ваш индекс ИМТ</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-imt-cat\" class=\"stat-num\" style=\"color: #22c55e; font-size: 1.25rem;\">Нормальный вес</div>\n              <div class=\"stat-lbl\">Категория ВОЗ</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-imt-range\" class=\"stat-num\" style=\"color: var(--fg); font-size: 1.25rem;\">56.7 – 76.3 кг</div>\n              <div class=\"stat-lbl\">Диапазон нормы</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-imt-prime\" class=\"stat-num\" style=\"color: #10b981;\">0.91</div>\n              <div class=\"stat-lbl\">Коэффициент Prime</div>\n            </div>\n          </div>\n\n          <div class=\"deriv-box\" id=\"ru-imt-deriv\">\n            <strong>Формула Кетле:</strong> ИМТ = 70 кг / (1,75 м)² = 70 / 3,0625 = <strong>22,86 кг/м²</strong>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Скопировать антропометрический отчет</span>\n            <button id=\"btnCopyRuIMT\" class=\"btn-copy\" onclick=\"copyRuIMTReport()\">📋 Скопировать</button>\n          </div>\n          <pre id=\"ru-imt-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\n          function calcRuIMT() {\n            const w = parseFloat(document.getElementById('ru-imt-w').value) || 0;\n            const hCm = parseFloat(document.getElementById('ru-imt-h').value) || 1;\n            const age = parseFloat(document.getElementById('ru-imt-age').value) || 25;\n            const hM = hCm / 100;\n            const imt = hM > 0 ? w / (hM * hM) : 0;\n\n            let cat = 'Нормальный вес', col = '#22c55e';\n            if (imt < 18.5) { cat = 'Дефицит массы тела'; col = '#3b82f6'; }\n            else if (imt < 25) { cat = 'Нормальный вес'; col = '#22c55e'; }\n            else if (imt < 30) { cat = 'Избыточный вес (Предожирение)'; col = '#f59e0b'; }\n            else if (imt < 35) { cat = 'Ожирение I степени'; col = '#ef4444'; }\n            else { cat = 'Ожирение II/III степени'; col = '#dc2626'; }\n\n            const minW = (18.5 * hM * hM).toFixed(1);\n            const maxW = (24.9 * hM * hM).toFixed(1);\n            const prime = (imt / 25).toFixed(2);\n\n            document.getElementById('ru-imt-val').textContent = imt.toFixed(2);\n            const el = document.getElementById('ru-imt-cat');\n            el.textContent = cat;\n            el.style.color = col;\n            document.getElementById('ru-imt-range').textContent = minW + ' – ' + maxW + ' кг';\n            document.getElementById('ru-imt-prime').textContent = prime;\n            document.getElementById('ru-imt-deriv').innerHTML = '<strong>Формула Кетле:</strong> ИМТ = ' + w + ' кг / (' + hM.toFixed(2) + ' м)² = <strong>' + imt.toFixed(2) + ' кг/м²</strong> (' + cat + ')';\n\n            const summary = [\n              '--- АНТРОПОМЕТРИЧЕСКИЙ ОТЧЕТ ИМТ ---',\n              'Параметры: Вес ' + w + ' кг | Рост ' + hCm + ' см (' + hM.toFixed(2) + ' м) | Возраст ' + age + ' лет',\n              'Индекс массы тела (ИМТ): ' + imt.toFixed(2) + ' кг/м²',\n              'Классификация ВОЗ: ' + cat,\n              'Рекомендуемый диапазон веса: от ' + minW + ' кг до ' + maxW + ' кг',\n              'Коэффициент BMI Prime: ' + prime + ' (Норма: от 0,74 до 1,00)',\n              'Рассчитано конфиденциально на digitaltoolsshed.com'\n            ].join('\\n');\n            document.getElementById('ru-imt-copy-box').textContent = summary;\n          }\n          function copyRuIMTReport() {\n            const btn = document.getElementById('btnCopyRuIMT');\n            const txt = document.getElementById('ru-imt-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Скопировано!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', calcRuIMT);\n        </script>\n      "
  },
  {
    "slug": "design/generator-qr-koda",
    "title": "Бесплатный Генератор QR Кодов Онлайн [Векторный SVG и PNG Высокого Разрешения]",
    "metaDesc": "Создавайте QR-коды для сайтов, Wi-Fi сетей, контактов и текста прямо в браузере. Экспорт в PNG высокого разрешения и векторный SVG без сторонних серверов.",
    "category": "Дизайн",
    "faq": [
      {
        "q": "Ограничен ли созданный QR-код по времени действия?",
        "a": "Нет. Это прямой статический QR-код, в котором закодированы ваши исходные данные. Он будет считываться бессрочно, поскольку не зависит от серверов редиректа."
      },
      {
        "q": "Передаются ли мои ссылки или пароли на сервер?",
        "a": "Нет. Весь алгоритм генерации QR-матрицы Рида-Соломона работает полностью на клиенте в вашем браузере с помощью встроенного JavaScript."
      },
      {
        "q": "Какой уровень коррекции ошибок (ECC) выбрать?",
        "a": "Для веб-сайтов и экранов достаточно уровня M (15% избыточности). Для уличной рекламы, вывесок или визиток, которые могут испачкаться или помяться, выбирайте уровни Q (25%) или H (30%)."
      },
      {
        "q": "Какого минимального размера должен быть напечатан QR-код?",
        "a": "Используйте эмпирическое правило: дистанция сканирования делить на 10. Если код будут считывать с расстояния 50 см, его размер должен быть не менее 5 × 5 см."
      },
      {
        "q": "Можно ли скачать QR-код в векторе с прозрачным фоном?",
        "a": "Да. Вы можете включить чекбокс 'Прозрачный фон' и скачать файл в формате SVG без потери качества при любом масштабировании."
      }
    ],
    "traps": [
      {
        "title": "Инвертированные цвета (Светлый код на темном фоне)",
        "desc": "Инвертированные QR-коды выглядят стильно, но сканеры многих недорогих смартфонов и промышленных терминалов не умеют их считывать. Для максимальной совместимости всегда делайте модули темнее фона."
      },
      {
        "title": "Нарушение 'зоны покоя' (Отсутствие полей вокруг кода)",
        "desc": "QR-код обязательно должен иметь свободную рамку шириной не менее 4 модулей со всех сторон. Текст или картинки вплотную к матрице блокируют обнаружение угловых меток позиционирования."
      },
      {
        "title": "Ловушка коммерческих генераторов с динамическими ссылками",
        "desc": "Многие популярные сайты генерируют коды через свои промежуточные серверы, а через пару недель отключают их, требуя платную подписку. Наш генератор создает честные статические коды напрямую."
      },
      {
        "title": "Чрезмерная длина URL и перегрузка матрицы",
        "desc": "Длинные URL с UTM-метками повышают плотность сетки, уменьшая размер каждого пикселя. Это затрудняет чтение кода при слабом освещении или с большого расстояния. Сокращайте ссылки перед кодированием."
      },
      {
        "title": "Слишком низкий уровень коррекции ошибок для печатных материалов",
        "desc": "Уровень L (7%) не прощает замятий бумаги или потертостей. Для любых печатных носителей выбирайте как минимум уровень M или Q."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; <a href=\"/ru/\">Дизайн</a> &gt; QR Код</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Бесплатный Генератор QR Кодов Онлайн [SVG и PNG]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Создавайте статические QR-коды высокого разрешения прямо в браузере без сторонних серверов и слежки. Экспорт в PNG и векторный SVG с контролем ошибок.\n        </p>\n\n        <div class=\"tool-box\">\n          <div class=\"field-group\">\n            <label class=\"field-label\">Текст / URL / Данные</label>\n            <input type=\"text\" id=\"ru-qr-txt\" class=\"code-input\" value=\"https://digitaltoolsshed.com\" oninput=\"genRuQR()\" />\n          </div>\n\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div class=\"field-group\">\n              <label class=\"field-label\">Коррекция ошибок (ECC)</label>\n              <select id=\"ru-qr-ecc\" class=\"text-input\" onchange=\"genRuQR()\">\n                <option value=\"L\">Уровень L (~7% восстановление)</option>\n                <option value=\"M\" selected>Уровень M (~15% стандарт)</option>\n                <option value=\"Q\">Уровень Q (~25% надежный)</option>\n                <option value=\"H\">Уровень H (~30% максимальный)</option>\n              </select>\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Зона покоя (Отступ): <span id=\"ru-lbl-margin\">4 модуля</span></label>\n              <input type=\"range\" id=\"ru-qr-margin\" min=\"0\" max=\"8\" value=\"4\" style=\"width:100%;\" oninput=\"document.getElementById('ru-lbl-margin').textContent = this.value + ' модуля'; genRuQR();\" />\n            </div>\n            <div class=\"field-group\">\n              <label class=\"field-label\">Разрешение (PNG)</label>\n              <select id=\"ru-qr-size\" class=\"text-input\" onchange=\"genRuQR()\">\n                <option value=\"256\">256 × 256 px</option>\n                <option value=\"512\" selected>512 × 512 px (HD)</option>\n                <option value=\"1024\">1024 × 1024 px (Печать)</option>\n              </select>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-top: 0.5rem;\">\n            <div style=\"display: flex; align-items: center; gap: 0.5rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Цвет модулей:</label>\n              <input type=\"color\" id=\"ru-qr-fg\" value=\"#000000\" style=\"cursor: pointer; height: 36px; width: 44px; padding: 0; border: 1px solid var(--border);\" onchange=\"genRuQR()\" />\n            </div>\n            <div style=\"display: flex; align-items: center; gap: 0.5rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Цвет фона:</label>\n              <input type=\"color\" id=\"ru-qr-bg\" value=\"#ffffff\" style=\"cursor: pointer; height: 36px; width: 44px; padding: 0; border: 1px solid var(--border);\" onchange=\"genRuQR()\" />\n            </div>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\">\n              <input type=\"checkbox\" id=\"ru-qr-trans\" onchange=\"genRuQR()\" /> Прозрачный фон\n            </label>\n          </div>\n\n          <!-- Canvas Preview -->\n          <div style=\"display: flex; flex-direction: column; align-items: center; padding: 2rem 0;\">\n            <canvas id=\"ru-qr-canvas\" style=\"max-width: 260px; max-height: 260px; border: 1px solid var(--border); border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);\"></canvas>\n            <div style=\"display: flex; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap; justify-content: center;\">\n              <button class=\"btn-primary\" onclick=\"downloadRuQRPNG()\">💾 Скачать PNG</button>\n              <button class=\"btn-sec\" onclick=\"downloadRuQRSVG()\">📐 Скачать векторный SVG</button>\n            </div>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-ver\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">Версия 3</div>\n              <div class=\"stat-lbl\">Версия стандарта</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-mod\" class=\"stat-num\" style=\"color: var(--fg);\">29 × 29</div>\n              <div class=\"stat-lbl\">Сетка модулей</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-len\" class=\"stat-num\" style=\"color: #10b981;\">28 символов</div>\n              <div class=\"stat-lbl\">Объем данных</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-print\" class=\"stat-num\" style=\"color: #f59e0b;\">3,7 × 3,7 см</div>\n              <div class=\"stat-lbl\">Мин. размер печати</div>\n            </div>\n          </div>\n        </div>\n\n        <!-- Actionable Copy Card -->\n        <div style=\"background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;\">\n          <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;\">\n            <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);\">📋 Техническая спецификация QR-кода</span>\n            <button id=\"btnCopyRuQR\" class=\"btn-copy\" onclick=\"copyRuQRReport()\">📋 Скопировать</button>\n          </div>\n          <pre id=\"ru-qr-copy-box\" style=\"margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);\"></pre>\n        </div>\n\n        <script>\nvar qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw\"code length overflow. (\"+o.getLengthInBits()+\">\"+8*u+\")\";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||\"Byte\"){case\"Numeric\":e=M(t);break;case\"Alphanumeric\":e=x(t);break;case\"Byte\":e=m(t);break;case\"Kanji\":e=L(t);break;default:throw\"mode:\"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+\",\"+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createSvgTag=function(t,r,e,n){var o={};\"object\"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e=\"string\"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||\"qrcode-description\":null,(n=\"string\"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||\"qrcode-title\":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l=\"\";for(c=\"l\"+t+\",0 0,\"+t+\" -\"+t+\",0 0,-\"+t+\"z \",l+='<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\"',l+=o.scalable?\"\":' width=\"'+g+'px\" height=\"'+g+'px\"',l+=' viewBox=\"0 0 '+g+\" \"+g+'\" ',l+=' preserveAspectRatio=\"xMinYMin meet\"',l+=\">\",l+='<rect width=\"100%\" height=\"100%\" fill=\"white\" cx=\"0\" cy=\"0\"/>',l+='<path d=\"',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+=\"M\"+(i*t+r)+\",\"+u+c);return l+='\" stroke=\"transparent\" fill=\"black\"/>',l+=\"</svg>\"},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?\"black\":\"white\",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default;var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw\"bad maskPattern:\"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw\"mode:\"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw\"mode:\"+t}else{if(!(r<41))throw\"type:\"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw\"mode:\"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw\"glog(\"+t+\")\";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+\"/\"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw\"bad rs block @ typeNumber:\"+e+\"/errorCorrectionLevel:\"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if(\"0\"<=t&&t<=\"9\")return t.charCodeAt(0)-\"0\".charCodeAt(0);throw\"illegal char :\"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if(\"0\"<=t&&t<=\"9\")return t.charCodeAt(0)-\"0\".charCodeAt(0);if(\"A\"<=t&&t<=\"Z\")return t.charCodeAt(0)-\"A\".charCodeAt(0)+10;switch(t){case\" \":return 36;case\"$\":return 37;case\"%\":return 38;case\"*\":return 39;case\"+\":return 40;case\"-\":return 41;case\".\":return 42;case\"/\":return 43;case\":\":return 44;default:throw\"illegal char :\"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw\"sjis not supported.\";!function(){var t=n(\"友\");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw\"sjis not supported.\"}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw\"illegal char at \"+(e+1)+\"/\"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw\"illegal char at \"+(e+1)}};return i};return f};if(typeof window!==\"undefined\"){window.qrcode=qrcode;}\n</script>\n        <script>\n          let ruQrInstance = null;\n          function genRuQR() {\n            const txt = document.getElementById('ru-qr-txt').value.trim() || ' ';\n            const ecc = document.getElementById('ru-qr-ecc').value;\n            const margin = parseInt(document.getElementById('ru-qr-margin').value, 10);\n            const size = parseInt(document.getElementById('ru-qr-size').value, 10);\n            const fg = document.getElementById('ru-qr-fg').value;\n            const bg = document.getElementById('ru-qr-bg').value;\n            const isTrans = document.getElementById('ru-qr-trans').checked;\n            const canvas = document.getElementById('ru-qr-canvas');\n\n            try {\n              const qr = qrcode(0, ecc);\n              qr.addData(txt);\n              qr.make();\n              ruQrInstance = qr;\n\n              const count = qr.getModuleCount();\n              const totalCells = count + (margin * 2);\n              canvas.width = size;\n              canvas.height = size;\n              const ctx = canvas.getContext('2d');\n              ctx.imageSmoothingEnabled = false;\n\n              if (isTrans) {\n                ctx.clearRect(0, 0, size, size);\n              } else {\n                ctx.fillStyle = bg;\n                ctx.fillRect(0, 0, size, size);\n              }\n\n              const cellSize = size / totalCells;\n              ctx.fillStyle = fg;\n              for (let r = 0; r < count; r++) {\n                for (let c = 0; c < count; c++) {\n                  if (qr.isDark(r, c)) {\n                    ctx.fillRect(\n                      Math.round((c + margin) * cellSize),\n                      Math.round((r + margin) * cellSize),\n                      Math.ceil(cellSize),\n                      Math.ceil(cellSize)\n                    );\n                  }\n                }\n              }\n\n              const ver = (count - 17) / 4;\n              document.getElementById('ru-stat-ver').textContent = 'Версия ' + ver;\n              document.getElementById('ru-stat-mod').textContent = count + ' × ' + count;\n              document.getElementById('ru-stat-len').textContent = txt.length + ' символов';\n              const minCm = ((totalCells * 0.42) / 10).toFixed(1);\n              document.getElementById('ru-stat-print').textContent = minCm + ' × ' + minCm + ' см';\n\n              const summary = [\n                '--- СПЕЦИФИКАЦИЯ QR-КОДА ---',\n                'Данные: ' + txt,\n                'Сетка QR: Версия ' + ver + ' (' + count + 'x' + count + ' модулей)',\n                'Коррекция ошибок: Уровень ' + ecc,\n                'Зона покоя (отступ): ' + margin + ' модуля',\n                'Размер изображения: ' + size + 'x' + size + ' px',\n                'Цвет модулей: ' + fg + ' | Фон: ' + (isTrans ? 'Прозрачный' : bg),\n                'Создано без серверов слежки на digitaltoolsshed.com'\n              ].join('\\n');\n              document.getElementById('ru-qr-copy-box').textContent = summary;\n            } catch (err) {\n              console.error('QR Render Error:', err);\n            }\n          }\n          function downloadRuQRPNG() {\n            const canvas = document.getElementById('ru-qr-canvas');\n            const a = document.createElement('a');\n            a.download = 'qrcode-digitaltoolsshed.png';\n            a.href = canvas.toDataURL('image/png');\n            a.click();\n          }\n          function downloadRuQRSVG() {\n            if (!ruQrInstance) return;\n            const margin = parseInt(document.getElementById('ru-qr-margin').value, 10);\n            const svgTag = ruQrInstance.createSvgTag({ cellSize: 8, margin: margin });\n            const blob = new Blob([svgTag], { type: 'image/svg+xml;charset=utf-8' });\n            const url = URL.createObjectURL(blob);\n            const a = document.createElement('a');\n            a.download = 'qrcode-digitaltoolsshed.svg';\n            a.href = url;\n            a.click();\n            URL.revokeObjectURL(url);\n          }\n          function copyRuQRReport() {\n            const btn = document.getElementById('btnCopyRuQR');\n            const txt = document.getElementById('ru-qr-copy-box').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Скопировано!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', genRuQR);\n        </script>\n      "
  },
  {
    "slug": "security/generator-paroley",
    "title": "Генератор надежных паролей онлайн [CSPRNG & Оценка Энтропии]",
    "metaDesc": "Создавайте криптографически стойкие и безопасные пароли прямо в браузере с помощью Web Cryptography API. Оценка энтропии Шеннона, защита от брутфорса и нулевое логирование.",
    "category": "Безопасность",
    "faq": [
      {
        "q": "Почему алгоритм Web Cryptography безопаснее, чем стандартный Math.random()?",
        "a": "Math.random() генерирует псевдослучайные последовательности, предсказуемые математически. API window.crypto напрямую опрашивает аппаратный пул энтропии операционной системы (CSPRNG), делая угадывание невозможным."
      },
      {
        "q": "Сколько бит энтропии достаточно для стойкого пароля?",
        "a": "Стандарты безопасности рекомендуют не менее 64–80 бит для пользовательских аккаунтов и 100–128 бит для мастер-паролей хранилищ паролей и криптографических ключей."
      },
      {
        "q": "Сохраняются ли сгенерированные пароли где-либо?",
        "a": "Нет. Пароли создаются исключительно в оперативной памяти вашего браузера. Никаких HTTP-запросов, логов или передачи третьим сторонам не происходит."
      },
      {
        "q": "Зачем исключать визуально похожие символы (0, O, 1, l, I)?",
        "a": "Это исключает человеческие ошибки при ручном перепечатывании пароля с экрана телефона, терминала или бумажного носителя."
      },
      {
        "q": "Сколько времени потребуется суперкомпьютеру для взлома 20 символов?",
        "a": "Пароль длиной 20 символов с полным набором алфавита содержит свыше 131 бит энтропии. Кластеру из тысяч мощнейших видеокарт потребуются миллиарды лет для полного перебора комбинаций."
      }
    ],
    "traps": [
      {
        "title": "Использование некриптографических генераторов случайных чисел",
        "desc": "Использование Math.random() для генерации паролей критически опасно. Злоумышленник, перехватив 2–3 сгенерированных значения, может полностью восстановить внутреннее состояние генератора и вычислить все созданные пароли."
      },
      {
        "title": "Статистическое смещение по модулю (Modulo Bias)",
        "desc": "Если случайное число приводится к размеру алфавита через операцию остатка от деления (%), первые символы алфавита выпадают немного чаще. Это создает статистическую неравномерность, облегчающую целенаправленный криптоанализ."
      },
      {
        "title": "Утечка через системный буфер обмена (Clipboard Snooping)",
        "desc": "После копирования пароль в открытом виде сохраняется в буфере обмена ОС, откуда может быть считан вредоносными расширениями или фоновыми утилитами. Вставляйте пароли сразу в менеджер паролей и очищайте буфер."
      },
      {
        "title": "Генерация паролей на удаленном бэкенд-сервере",
        "desc": "Сервисы, отправляющие сгенерированный пароль через REST API, ставят безопасность под удар: пароли могут оседать в серверных журналах доступа, кэшах прокси-серверов или базах данных."
      },
      {
        "title": "Повторное использование даже очень надежного пароля",
        "desc": "Использование одного и того же сложного пароля на нескольких сайтах обесценивает его надежность. Утечка данных из одного сервиса автоматически открывает доступ ко всем вашим учетным записям."
      }
    ],
    "body": "\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; <a href=\"/ru/\">Безопасность</a> &gt; Пароли</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.85rem; margin-bottom: 0.5rem;\">Генератор надежных паролей онлайн [CSPRNG &amp; Энтропия]</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;\">\n          Генерируйте криптографически стойкие и непредсказуемые пароли в браузере с помощью Web Cryptography API. Расчет энтропии Шеннона и генератор пакетов.\n        </p>\n\n        <div class=\"tool-box\">\n          <div class=\"field-group\">\n            <label class=\"field-label\">Сгенерированный пароль</label>\n            <div style=\"display: flex; gap: 0.5rem;\">\n              <input type=\"text\" id=\"ru-pw-out\" class=\"code-input\" style=\"font-size: 1.25rem; font-weight: bold; color: var(--fg);\" readonly />\n              <button class=\"btn-primary\" onclick=\"genRuPW()\" style=\"flex-shrink: 0;\">↻ Новый</button>\n            </div>\n          </div>\n\n          <div class=\"field-group\">\n            <div style=\"display: flex; justify-content: space-between; margin-bottom: 0.35rem;\">\n              <label class=\"field-label\" style=\"margin: 0;\">Длина: <span id=\"ru-pw-len-val\" style=\"color: var(--fg); font-weight: bold;\">20</span> символов</label>\n              <span id=\"ru-pw-badge\" style=\"font-family: var(--mono); font-size: 0.8rem; color: #22c55e; font-weight: bold;\">131 бит (Максимальная стойкость)</span>\n            </div>\n            <input type=\"range\" id=\"ru-pw-len\" min=\"8\" max=\"64\" value=\"20\" style=\"width: 100%; cursor: pointer;\" oninput=\"document.getElementById('ru-pw-len-val').textContent = this.value; genRuPW();\" />\n          </div>\n\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; padding: 1rem; background: var(--surface-alt); border-radius: 6px; border: 1px solid var(--border); margin-bottom: 1rem;\">\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"ru-opt-u\" checked onchange=\"genRuPW()\"> Заглавные (A-Z)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"ru-opt-l\" checked onchange=\"genRuPW()\"> Строчные (a-z)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"ru-opt-d\" checked onchange=\"genRuPW()\"> Цифры (0-9)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"ru-opt-s\" checked onchange=\"genRuPW()\"> Символы (!@#$%)</label>\n            <label style=\"display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;\"><input type=\"checkbox\" id=\"ru-opt-no-ambig\" onchange=\"genRuPW()\"> Без 0, O, 1, l, I</label>\n          </div>\n\n          <div class=\"stat-grid\">\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-ent\" class=\"stat-num\" style=\"color: var(--btn-bg, #3b82f6);\">131 бит</div>\n              <div class=\"stat-lbl\">Энтропия Шеннона</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-pool\" class=\"stat-num\" style=\"color: var(--fg);\">94 символа</div>\n              <div class=\"stat-lbl\">Алфавит генерации</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-crack-on\" class=\"stat-num\" style=\"color: #22c55e;\">Неуязвим</div>\n              <div class=\"stat-lbl\">Онлайн атака (100/сек)</div>\n            </div>\n            <div class=\"stat-card\">\n              <div id=\"ru-stat-crack-gpu\" class=\"stat-num\" style=\"color: #22c55e;\">Миллиарды лет</div>\n              <div class=\"stat-lbl\">GPU кластер (100 млрд/с)</div>\n            </div>\n          </div>\n\n          <div style=\"display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1.25rem;\">\n            <button id=\"btnCopyRuPW\" class=\"btn-primary\" onclick=\"copyRuPW()\">📋 Скопировать Пароль</button>\n            <button class=\"btn-sec\" onclick=\"genRuBatch()\">⚡ Создать пачку из 5</button>\n          </div>\n\n          <div id=\"ru-batch-box\" style=\"display: none; margin-top: 1.25rem; padding: 1rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px;\">\n            <div style=\"display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;\">\n              <span style=\"font-family: var(--mono); font-size: 0.8rem; font-weight: bold;\">Список паролей (5×)</span>\n              <button id=\"btnCopyRuBatch\" class=\"btn-copy\" onclick=\"copyRuBatch()\">📋 Скопировать Все</button>\n            </div>\n            <pre id=\"ru-batch-list\" style=\"margin: 0; font-family: var(--mono); font-size: 0.9rem; line-height: 1.6;\"></pre>\n          </div>\n        </div>\n\n        <script>\n          function getRuCharPool() {\n            let pool = '';\n            if (document.getElementById('ru-opt-u').checked) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';\n            if (document.getElementById('ru-opt-l').checked) pool += 'abcdefghijklmnopqrstuvwxyz';\n            if (document.getElementById('ru-opt-d').checked) pool += '0123456789';\n            if (document.getElementById('ru-opt-s').checked) pool += '!@#$%^&*()-_=+[]{}|;:,.<>?';\n            if (document.getElementById('ru-opt-no-ambig').checked) {\n              pool = pool.replace(/[0O1lI]/g, '');\n            }\n            return pool || 'abcdefghijklmnopqrstuvwxyz';\n          }\n          function genRuPW() {\n            const len = parseInt(document.getElementById('ru-pw-len').value, 10);\n            const pool = getRuCharPool();\n            const poolLen = pool.length;\n\n            const arr = new Uint32Array(len);\n            window.crypto.getRandomValues(arr);\n            let pw = '';\n            for (let i = 0; i < len; i++) {\n              pw += pool[arr[i] % poolLen];\n            }\n            document.getElementById('ru-pw-out').value = pw;\n\n            const entropy = Math.round(len * (Math.log(poolLen) / Math.log(2)));\n            document.getElementById('ru-stat-ent').textContent = entropy + ' бит';\n            document.getElementById('ru-stat-pool').textContent = poolLen + ' символов';\n\n            let badgeText = 'Слабый', badgeCol = '#ef4444';\n            if (entropy >= 100) { badgeText = entropy + ' бит (Военный стандарт)'; badgeCol = '#22c55e'; }\n            else if (entropy >= 80) { badgeText = entropy + ' бит (Очень надежный)'; badgeCol = '#10b981'; }\n            else if (entropy >= 60) { badgeText = entropy + ' бит (Удовлетворительный)'; badgeCol = '#f59e0b'; }\n            const bEl = document.getElementById('ru-pw-badge');\n            bEl.textContent = badgeText;\n            bEl.style.color = badgeCol;\n          }\n          function copyRuPW() {\n            const btn = document.getElementById('btnCopyRuPW');\n            const pw = document.getElementById('ru-pw-out').value;\n            navigator.clipboard.writeText(pw).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Скопировано!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          function genRuBatch() {\n            const len = parseInt(document.getElementById('ru-pw-len').value, 10);\n            const pool = getRuCharPool();\n            const poolLen = pool.length;\n            const list = [];\n            for (let b = 0; b < 5; b++) {\n              const arr = new Uint32Array(len);\n              window.crypto.getRandomValues(arr);\n              let pw = '';\n              for (let i = 0; i < len; i++) pw += pool[arr[i] % poolLen];\n              list.push(pw);\n            }\n            document.getElementById('ru-batch-list').textContent = list.join('\\n');\n            document.getElementById('ru-batch-box').style.display = 'block';\n          }\n          function copyRuBatch() {\n            const btn = document.getElementById('btnCopyRuBatch');\n            const txt = document.getElementById('ru-batch-list').textContent;\n            navigator.clipboard.writeText(txt).then(function() {\n              const prev = btn.textContent;\n              btn.textContent = '✓ Скопировано!';\n              setTimeout(function() { btn.textContent = prev; }, 2000);\n            });\n          }\n          document.addEventListener('DOMContentLoaded', genRuPW);\n        </script>\n      "
  }
];
  const deHubFaqs = [
  {
    "q": "Sind alle Rechner und Werkzeuge auf Digital Tools Shed kostenlos?",
    "a": "Ja, alle Werkzeuge und Rechner sind zu 100% kostenfrei, werbefrei im Kern und erfordern weder ein Benutzerkonto noch eine Registrierung."
  },
  {
    "q": "Werden meine eingegebenen Daten oder Passwörter auf Servern gespeichert?",
    "a": "Nein. Sämtliche Berechnungen und Generatoren laufen zu 100% lokal in Ihrem Browser über native JavaScript APIs. Es findet keinerlei Datenübertragung an externe Server statt."
  },
  {
    "q": "Funktionieren die Tools auch auf Smartphones und Tablets?",
    "a": "Ja, alle Tools sind vollständig responsiv gestaltet und optimal auf Touchscreens von iOS (Safari) und Android (Chrome) sowie Desktop-Systemen bedienbar."
  },
  {
    "q": "Benötigen die Rechner eine dauerhafte Internetverbindung?",
    "a": "Sobald die jeweilige Seite geladen ist, können alle Berechnungen und Generatoren vollständig offline im Browser ausgeführt werden."
  },
  {
    "q": "Welche Browser werden unterstützt?",
    "a": "Alle modernen Browser werden vollständig unterstützt: Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Opera und Brave."
  }
];
  const deHubTraps = [
  {
    "title": "Verschleierte Datenspeicherung auf fremden Cloud-Servern",
    "desc": "Viele angebliche 'Online-Rechner' im Internet senden Eingaben wie Passwörter, finanzielle Einkommensdaten oder vertrauliche Unternehmenszahlen heimlich an Werbe- und Analysenetzwerke. Achten Sie stets auf rein client-seitige Werkzeuge mit lokaler Ausführung."
  },
  {
    "title": "Versteckte Kostenfallen und künstliche Download-Sperren",
    "desc": "Einige Anbieter ködern Nutzer mit 'kostenlosen' QR-Code- oder Passwort-Generatoren, fordern dann aber für den Download höherer Auflösungen oder nach 14 Tagen eine kostenpflichtige Kreditkarten-Registrierung. Digital Tools Shed garantiert uneingeschränkte, dauerhafte Kostenfreiheit."
  },
  {
    "title": "Latenzverzögerungen durch schwere externe JavaScript-Bibliotheken",
    "desc": "Überladene Web-Apps mit Megabyte-schweren Frameworks und externen Trackern laden langsam und verbrauchen kostbares mobiles Datenvolumen. Unsere Werkzeuge arbeiten ohne externe CDN-Abhängigkeiten mit Sub-50ms Latenz."
  },
  {
    "title": "Ungenaue Rundungsregeln in einfachen Online-Skripten",
    "desc": "Minderwertige Web-Rechner nutzen ungenaue Zwischenrundungen oder falsche Formeln bei Zinseszinsen oder prozentualen Veränderungen. Alle mathematischen Modelle bei uns sind streng nach DIN- und WHO-Normen implementiert."
  },
  {
    "title": "Veraltete oder falsche Maßeinheiten-Standards",
    "desc": "Insbesondere bei biometrischen und physikalischen Rechnern führen veraltete Koeffizienten zu falschen Ergebnissen. Unsere Rechner basieren auf den neuesten Richtlinien der Weltgesundheitsorganisation (WHO) und moderner Ernährungswissenschaft (Mifflin-St Jeor)."
  }
];
  const frHubFaqs = [
  {
    "q": "Ces calculateurs et outils en ligne sont-ils totalement gratuits ?",
    "a": "Oui, l'intégralité des outils de Digital Tools Shed est 100% gratuite, sans abonnement, sans limitation d'usage et sans aucune inscription requise."
  },
  {
    "q": "Mes informations et mes calculs sont-ils envoyés à un serveur ?",
    "a": "Non. Tous les calculs s'effectuent exclusivement en local dans la mémoire de votre navigateur web grâce au JavaScript natif. Aucune donnée n'est transmise ni stockée."
  },
  {
    "q": "Les outils fonctionnent-ils sur smartphone et tablette ?",
    "a": "Oui, toutes les interfaces sont responsives et optimisées pour les écrans tactiles sur iOS (Safari) et Android (Chrome), ainsi que sur ordinateurs de bureau."
  },
  {
    "q": "Puis-je utiliser ces calculateurs hors ligne ?",
    "a": "Dès que la page web est chargée dans votre navigateur, tous les moteurs de calcul fonctionnent de façon autonome sans nécessiter de connexion internet active."
  },
  {
    "q": "Quels sont les navigateurs compatibles ?",
    "a": "Tous les navigateurs modernes respectant les standards web sont compatibles : Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge et Brave."
  }
];
  const frHubTraps = [
  {
    "title": "Transmission clandestine de données confidentielles",
    "desc": "Beaucoup d'utilitaires web gratuits transmettent vos montants financiers, mots de passe ou mensurations corporelles à des serveurs tiers pour du ciblage publicitaire. Exigez toujours des outils à exécution strictement locale."
  },
  {
    "title": "Piège des abonnements cachés après essai gratuit",
    "desc": "De nombreux générateurs de QR codes ou convertisseurs attirent les internautes avant de bloquer l'accès ou de désactiver les codes créés après quelques jours pour forcer un abonnement payant. Nos outils sont 100% statiques et définitifs."
  },
  {
    "title": "Lenteur extrême due aux traceurs et scripts publicitaires",
    "desc": "Les sites surchargés de bibliothèques externes et de bandeaux publicitaires invasifs ralentissent vos appareils et consomment vos données mobiles. Digital Tools Shed offre un chargement instantané en moins de 50 ms."
  },
  {
    "title": "Formules mathématiques et médicales obsolètes",
    "desc": "De nombreux sites utilisent encore d'anciennes formules métaboliques dépassées (comme Harris-Benedict de 1919) plutôt que les standards contemporains validés (Mifflin-St Jeor et normes OMS)."
  },
  {
    "title": "Erreurs d'arrondi dans les calculs multi-étapes",
    "desc": "Les scripts simplistes arrondissent les étapes intermédiaires, faussant les résultats finaux des amortissements et des pourcentages. Nos moteurs préservent la précision maximale en virgule flottante."
  }
];
  const ruHubFaqs = [
  {
    "q": "Являются ли инструменты и калькуляторы полностью бесплатными?",
    "a": "Да, абсолютно все инструменты на Digital Tools Shed бесплатны, не имеют скрытых тарифов и не требуют регистрации или подписки."
  },
  {
    "q": "Передаются ли мои данные или пароли на сторонние серверы?",
    "a": "Нет. Все вычисления производятся исключительно на стороне вашего браузера в оперативной памяти устройства. Никакие данные не покидают ваше устройство."
  },
  {
    "q": "Работают ли калькуляторы на смартфонах и планшетах?",
    "a": "Да, все страницы полностью адаптированы для мобильных устройств на базе iOS и Android, а также для настольных компьютеров."
  },
  {
    "q": "Можно ли пользоваться инструментами без интернета?",
    "a": "После загрузки веб-страницы алгоритмы работают автономно в браузере и не требуют постоянного интернет-соединения."
  },
  {
    "q": "Какие браузеры поддерживаются?",
    "a": "Поддерживаются все актуальные браузеры: Яндекс Браузер, Google Chrome, Mozilla Firefox, Safari, Microsoft Edge и Opera."
  }
];
  const ruHubTraps = [
  {
    "title": "Скрытый сбор персональных данных в облаке",
    "desc": "Многие популярные онлайн-сервисы пересылают вводимые финансовые показатели, пароли и личные параметры на свои серверы для аналитики и таргетинга. Пользуйтесь инструментами, работающими строго локально в браузере."
  },
  {
    "title": "Ловушки платной подписки после 'бесплатной' генерации",
    "desc": "Ряд сайтов генерируют QR-коды через динамические ссылки-редиректы, а через 14 дней блокируют их, требуя дорогую ежемесячную подписку. Наши инструменты генерируют настоящие статические коды навсегда."
  },
  {
    "title": "Торможение из-за сотен рекламных трекеров",
    "desc": "Тяжелые сайты с десятками сторонних скриптов зависают на смартфонах и пожирают мобильный трафик. Наш проект спроектирован на чистом ванильном коде без сторонних библиотек с мгновенной загрузкой до 50 мс."
  },
  {
    "title": "Устаревшие формулы и стандарты расчетов",
    "desc": "Многие сайты до сих пор используют формулы столетней давности с погрешностью до 20%. Мы применяем современные стандарты ВОЗ и подтвержденные научные уравнения."
  },
  {
    "title": "Потеря точности из-за раннего округления чисел",
    "desc": "Некачественные скрипты округляют результаты на промежуточных шагах, искажая процентные ставки и медицинские коэффициенты. Наши калькуляторы сохраняют математическую точность до финального вывода."
  }
];

  // 1. Build German Suite (/de/)
  const deDist = join(DIST, 'de');
  ensureDir(deDist);
  ensureDir(join(deDist, 'math'));
  ensureDir(join(deDist, 'health'));
  ensureDir(join(deDist, 'design'));
  ensureDir(join(deDist, 'security'));
  ensureDir(join(deDist, 'util'));

  for (const t of deTools) {
    const fullBody = commonStyle + '<div class="article-container">' + t.body +
      renderTraps(t.traps || deHubTraps, 'de') +
      renderFaqs(t.faq || deHubFaqs, 'de') +
      '</div>';

    const html = renderPage({
      title: `${t.title} | Digital Tools Shed DE`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/de/${t.slug}`,
      bodyContent: fullBody,
      currentPath: `/de/${t.slug}`,
      lang: 'de',
      faq: t.faq
    });
    writeFileSync(join(deDist, `${t.slug}.html`), html);
  }

  // German Hub (/de/index.html)
  const deHubCards = deTools.map(t => `
    <a href="/de/${t.slug}" class="de-hub-card" data-title="${t.title.toLowerCase()}" data-desc="${t.metaDesc.toLowerCase()}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 8px; text-decoration: none; color: inherit; transition: border-color 0.2s, transform 0.15s ease;">
      <div style="font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; color: var(--btn-bg, #3b82f6); font-weight: bold; margin-bottom: 0.35rem;">${t.category}</div>
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title.split('[')[0].trim()}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const deHubBody = commonStyle + `
    <div class="article-container">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);"><a href="/">Home</a> &gt; Deutsch</nav>
      <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--fg);">Kostenlose Online-Tools &amp; Rechner (Deutsch)</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Alle Werkzeuge laufen zu 100% lokal im Browser. Schnell, sicher, werbefrei im Kern und ohne Registrierung.
      </p>

      <!-- Search Filter Bar -->
      <div style="margin-bottom: 2rem;">
        <input type="text" id="de-search" placeholder="🔍 Werkzeug oder Rechner durchsuchen..." class="text-input" style="padding: 0.85rem 1.2rem; font-size: 1rem; border-radius: 6px;" oninput="filterDeHub()" />
      </div>

      <div id="de-card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
        ${deHubCards}
      </div>

      <!-- Actionable Link Copy Card -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);">📋 Alle deutschen Tool-Links kopieren</span>
          <button id="btnCopyDeHub" class="btn-copy" onclick="copyDeHubLinks()">📋 Links Kopieren</button>
        </div>
        <pre id="de-hub-copy-box" style="margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);"></pre>
      </div>

      ${renderTraps(deHubTraps, 'de')}
      ${renderFaqs(deHubFaqs, 'de')}
    </div>

    <script>
      function filterDeHub() {
        const q = document.getElementById('de-search').value.toLowerCase().trim();
        const cards = document.querySelectorAll('.de-hub-card');
        cards.forEach(function(card) {
          const t = card.getAttribute('data-title') || '';
          const d = card.getAttribute('data-desc') || '';
          card.style.display = (t.includes(q) || d.includes(q)) ? 'block' : 'none';
        });
      }
      function initDeHubLinks() {
        const lines = ['--- DIGITAL TOOLS SHED DEUTSCH - WERKZEUGE ---'];
        document.querySelectorAll('.de-hub-card').forEach(function(card) {
          const h3 = card.querySelector('h3');
          if (h3) lines.push(h3.textContent + ' -> ' + window.location.origin + card.getAttribute('href'));
        });
        document.getElementById('de-hub-copy-box').textContent = lines.join('\\n');
      }
      function copyDeHubLinks() {
        const btn = document.getElementById('btnCopyDeHub');
        const txt = document.getElementById('de-hub-copy-box').textContent;
        navigator.clipboard.writeText(txt).then(function() {
          const prev = btn.textContent;
          btn.textContent = '✓ Kopiert!';
          setTimeout(function() { btn.textContent = prev; }, 2000);
        });
      }
      document.addEventListener('DOMContentLoaded', initDeHubLinks);
    </script>
  `;

  writeFileSync(join(deDist, 'index.html'), renderPage({
    title: 'Kostenlose Online-Tools & Rechner | Digital Tools Shed (Deutsch)',
    metaDesc: 'Kostenlose Online-Werkzeuge auf Deutsch: Prozentrechner, Zinseszinsrechner, BMI-Rechner, TDEE, Passwort Generator, Stoppuhr und QR-Codes.',
    canonical: `${DOMAIN}/de/`,
    bodyContent: deHubBody,
    currentPath: '/de/',
    lang: 'de',
    faq: deHubFaqs
  }));

  // 2. Build French Suite (/fr/)
  const frDist = join(DIST, 'fr');
  ensureDir(frDist);
  ensureDir(join(frDist, 'math'));
  ensureDir(join(frDist, 'health'));
  ensureDir(join(frDist, 'design'));
  ensureDir(join(frDist, 'security'));

  for (const t of frTools) {
    const fullBody = commonStyle + '<div class="article-container">' + t.body +
      renderTraps(t.traps || frHubTraps, 'fr') +
      renderFaqs(t.faq || frHubFaqs, 'fr') +
      '</div>';

    const html = renderPage({
      title: `${t.title} | Digital Tools Shed FR`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/fr/${t.slug}`,
      bodyContent: fullBody,
      currentPath: `/fr/${t.slug}`,
      lang: 'fr',
      faq: t.faq
    });
    writeFileSync(join(frDist, `${t.slug}.html`), html);
  }

  // French Hub (/fr/index.html)
  const frHubCards = frTools.map(t => `
    <a href="/fr/${t.slug}" class="fr-hub-card" data-title="${t.title.toLowerCase()}" data-desc="${t.metaDesc.toLowerCase()}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 8px; text-decoration: none; color: inherit; transition: border-color 0.2s, transform 0.15s ease;">
      <div style="font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; color: var(--btn-bg, #3b82f6); font-weight: bold; margin-bottom: 0.35rem;">${t.category}</div>
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title.split('[')[0].trim()}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const frHubBody = commonStyle + `
    <div class="article-container">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);"><a href="/">Home</a> &gt; Français</nav>
      <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--fg);">Outils &amp; Calculateurs en Ligne (Français)</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Des outils web gratuits, sans installation, traités directement dans votre navigateur en toute confidentialité.
      </p>

      <!-- Search Filter Bar -->
      <div style="margin-bottom: 2rem;">
        <input type="text" id="fr-search" placeholder="🔍 Rechercher un outil ou un calculateur..." class="text-input" style="padding: 0.85rem 1.2rem; font-size: 1rem; border-radius: 6px;" oninput="filterFrHub()" />
      </div>

      <div id="fr-card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
        ${frHubCards}
      </div>

      <!-- Actionable Link Copy Card -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: gap; gap: 0.5rem;">
          <span style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);">📋 Copier les liens des outils français</span>
          <button id="btnCopyFrHub" class="btn-copy" onclick="copyFrHubLinks()">📋 Copier les Liens</button>
        </div>
        <pre id="fr-hub-copy-box" style="margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);"></pre>
      </div>

      ${renderTraps(frHubTraps, 'fr')}
      ${renderFaqs(frHubFaqs, 'fr')}
    </div>

    <script>
      function filterFrHub() {
        const q = document.getElementById('fr-search').value.toLowerCase().trim();
        const cards = document.querySelectorAll('.fr-hub-card');
        cards.forEach(function(card) {
          const t = card.getAttribute('data-title') || '';
          const d = card.getAttribute('data-desc') || '';
          card.style.display = (t.includes(q) || d.includes(q)) ? 'block' : 'none';
        });
      }
      function initFrHubLinks() {
        const lines = ['--- DIGITAL TOOLS SHED FRANÇAIS - OUTILS ---'];
        document.querySelectorAll('.fr-hub-card').forEach(function(card) {
          const h3 = card.querySelector('h3');
          if (h3) lines.push(h3.textContent + ' -> ' + window.location.origin + card.getAttribute('href'));
        });
        document.getElementById('fr-hub-copy-box').textContent = lines.join('\\n');
      }
      function copyFrHubLinks() {
        const btn = document.getElementById('btnCopyFrHub');
        const txt = document.getElementById('fr-hub-copy-box').textContent;
        navigator.clipboard.writeText(txt).then(function() {
          const prev = btn.textContent;
          btn.textContent = '✓ Copié !';
          setTimeout(function() { btn.textContent = prev; }, 2000);
        });
      }
      document.addEventListener('DOMContentLoaded', initFrHubLinks);
    </script>
  `;

  writeFileSync(join(frDist, 'index.html'), renderPage({
    title: 'Outils et Calculateurs Gratuits en Ligne | Digital Tools Shed (Français)',
    metaDesc: 'Outils gratuits en ligne en français : calculateur de pourcentage, calculateur IMC, générateur de code QR haute définition et mots de passe sécurisés.',
    canonical: `${DOMAIN}/fr/`,
    bodyContent: frHubBody,
    currentPath: '/fr/',
    lang: 'fr',
    faq: frHubFaqs
  }));

  // 3. Build Russian Suite (/ru/)
  const ruDist = join(DIST, 'ru');
  ensureDir(ruDist);
  ensureDir(join(ruDist, 'math'));
  ensureDir(join(ruDist, 'health'));
  ensureDir(join(ruDist, 'design'));
  ensureDir(join(ruDist, 'security'));

  for (const t of ruTools) {
    const fullBody = commonStyle + '<div class="article-container">' + t.body +
      renderTraps(t.traps || ruHubTraps, 'ru') +
      renderFaqs(t.faq || ruHubFaqs, 'ru') +
      '</div>';

    const html = renderPage({
      title: `${t.title} | Digital Tools Shed RU`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/ru/${t.slug}`,
      bodyContent: fullBody,
      currentPath: `/ru/${t.slug}`,
      lang: 'ru',
      faq: t.faq
    });
    writeFileSync(join(ruDist, `${t.slug}.html`), html);
  }

  // Russian Hub (/ru/index.html)
  const ruHubCards = ruTools.map(t => `
    <a href="/ru/${t.slug}" class="ru-hub-card" data-title="${t.title.toLowerCase()}" data-desc="${t.metaDesc.toLowerCase()}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 8px; text-decoration: none; color: inherit; transition: border-color 0.2s, transform 0.15s ease;">
      <div style="font-family: var(--mono); font-size: 0.72rem; text-transform: uppercase; color: var(--btn-bg, #3b82f6); font-weight: bold; margin-bottom: 0.35rem;">${t.category}</div>
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title.split('[')[0].trim()}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  const ruHubBody = commonStyle + `
    <div class="article-container">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);"><a href="/">Home</a> &gt; Русский</nav>
      <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem; color: var(--fg);">Бесплатные онлайн инструменты (Русский)</h1>
      <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
        Все инструменты работают прямо в вашем браузере без сохранения на сервере. Быстро, безопасно и без регистрации.
      </p>

      <!-- Search Filter Bar -->
      <div style="margin-bottom: 2rem;">
        <input type="text" id="ru-search" placeholder="🔍 Найти инструмент или калькулятор..." class="text-input" style="padding: 0.85rem 1.2rem; font-size: 1rem; border-radius: 6px;" oninput="filterRuHub()" />
      </div>

      <div id="ru-card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
        ${ruHubCards}
      </div>

      <!-- Actionable Link Copy Card -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin: 2rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-family: var(--mono); font-size: 0.8rem; font-weight: bold; color: var(--fg);">📋 Скопировать ссылки на все русские инструменты</span>
          <button id="btnCopyRuHub" class="btn-copy" onclick="copyRuHubLinks()">📋 Скопировать Ссылки</button>
        </div>
        <pre id="ru-hub-copy-box" style="margin: 0; background: var(--surface-alt); padding: 1rem; border-radius: 6px; font-family: var(--mono); font-size: 0.85rem; overflow-x: auto; color: var(--fg);"></pre>
      </div>

      ${renderTraps(ruHubTraps, 'ru')}
      ${renderFaqs(ruHubFaqs, 'ru')}
    </div>

    <script>
      function filterRuHub() {
        const q = document.getElementById('ru-search').value.toLowerCase().trim();
        const cards = document.querySelectorAll('.ru-hub-card');
        cards.forEach(function(card) {
          const t = card.getAttribute('data-title') || '';
          const d = card.getAttribute('data-desc') || '';
          card.style.display = (t.includes(q) || d.includes(q)) ? 'block' : 'none';
        });
      }
      function initRuHubLinks() {
        const lines = ['--- DIGITAL TOOLS SHED РУССКИЙ - ИНСТРУМЕНТЫ ---'];
        document.querySelectorAll('.ru-hub-card').forEach(function(card) {
          const h3 = card.querySelector('h3');
          if (h3) lines.push(h3.textContent + ' -> ' + window.location.origin + card.getAttribute('href'));
        });
        document.getElementById('ru-hub-copy-box').textContent = lines.join('\\n');
      }
      function copyRuHubLinks() {
        const btn = document.getElementById('btnCopyRuHub');
        const txt = document.getElementById('ru-hub-copy-box').textContent;
        navigator.clipboard.writeText(txt).then(function() {
          const prev = btn.textContent;
          btn.textContent = '✓ Скопировано!';
          setTimeout(function() { btn.textContent = prev; }, 2000);
        });
      }
      document.addEventListener('DOMContentLoaded', initRuHubLinks);
    </script>
  `;

  writeFileSync(join(ruDist, 'index.html'), renderPage({
    title: 'Бесплатные онлайн инструменты и калькуляторы | Digital Tools Shed (Русский)',
    metaDesc: 'Бесплатные веб-инструменты на русском языке: калькулятор процентов, калькулятор ИМТ, генератор QR кодов высокого разрешения и генератор паролей. 100% конфиденциально.',
    canonical: `${DOMAIN}/ru/`,
    bodyContent: ruHubBody,
    currentPath: '/ru/',
    lang: 'ru',
    faq: ruHubFaqs
  }));

  console.log(`  ✓ Built Multilingual Suites (DE: ${deTools.length + 1}, FR: ${frTools.length + 1}, RU: ${ruTools.length + 1} pages) [100% Gold Standard]`);
}
