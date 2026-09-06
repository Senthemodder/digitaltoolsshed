// scripts/i18n_tools.js - Multilingual Suites (DE, FR, RU) for Digital Tools Shed

export function buildI18nSuites({ DIST, DOMAIN, renderPage, writeFileSync, join, ensureDir }) {
  const deTools = [
  {
    "slug": "math/prozentrechner",
    "title": "3-Wege Prozentrechner Online",
    "metaDesc": "Berechnen Sie Prozente online: Was sind X% von Y, wie viel Prozent ist X von Y, und prozentuale Zunahme/Abnahme.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; Prozentrechner</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">3-Wege Prozentrechner</h1>\n        <p style=\"color: var(--text-muted); font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem;\">Schnelle und genaue Prozentrechnung für alle Berechnungen.</p>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;\">1. Was sind X% von Y?</h3>\n          <div style=\"display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;\">\n            <span>Was sind</span><input type=\"number\" id=\"p1-x\" style=\"width: 100px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"15\" oninput=\"calcP1()\" />\n            <span>% von</span><input type=\"number\" id=\"p1-y\" style=\"width: 120px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"250\" oninput=\"calcP1()\" />\n            <span>=</span><strong id=\"p1-res\" style=\"font-family: var(--mono); font-size: 1.2rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">37.5</strong>\n          </div>\n        </div>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;\">2. Prozentuale Veränderung</h3>\n          <div style=\"display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;\">\n            <span>Von</span><input type=\"number\" id=\"p3-x\" style=\"width: 100px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"80\" oninput=\"calcP3()\" />\n            <span>auf</span><input type=\"number\" id=\"p3-y\" style=\"width: 100px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"120\" oninput=\"calcP3()\" />\n            <span>=</span><strong id=\"p3-res\" style=\"font-family: var(--mono); font-size: 1.2rem; color: #22c55e; margin-left: 0.5rem;\">+50% (Zunahme)</strong>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcP1(){ const x=parseFloat(document.getElementById('p1-x').value)||0, y=parseFloat(document.getElementById('p1-y').value)||0; document.getElementById('p1-res').textContent=((x/100)*y).toFixed(2); }\n        function calcP3(){ const x=parseFloat(document.getElementById('p3-x').value)||0, y=parseFloat(document.getElementById('p3-y').value)||0; if(!x)return; const diff=((y-x)/x)*100; const el=document.getElementById('p3-res'); el.textContent=(diff>=0?'+':'')+diff.toFixed(2)+'% '+(diff>=0?'(Zunahme)':'(Abnahme)'); el.style.color=diff>=0?'#22c55e':'#ef4444'; }\n      </script>\n    "
  },
  {
    "slug": "math/zinseszinsrechner",
    "title": "Zinseszinsrechner & Sparplan Rechner",
    "metaDesc": "Berechnen Sie den Zinseszinseffekt auf Ihr Vermögen mit monatlicher oder jährlicher Verzinsung.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; Zinseszinsrechner</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Zinseszinsrechner</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Anfangskapital (€)</label><input type=\"number\" id=\"ci-p\" value=\"5000\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcCI()\" /></div>\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Zinssatz (% p.a.)</label><input type=\"number\" id=\"ci-r\" value=\"7\" step=\"0.1\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcCI()\" /></div>\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Laufzeit (Jahre)</label><input type=\"number\" id=\"ci-y\" value=\"10\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcCI()\" /></div>\n          </div>\n          <div style=\"background:var(--surface-alt); border:1px solid var(--border); padding:1.25rem; border-radius:4px; text-align:center; margin-top:1.5rem;\">\n            <div style=\"font-size:0.8rem; color:var(--text-muted);\">Endkapital</div>\n            <div id=\"ci-res\" style=\"font-family:var(--mono); font-size:2.2rem; font-weight:bold; color:var(--btn-bg,#3b82f6);\">9.835,76 €</div>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcCI(){ const P=parseFloat(document.getElementById('ci-p').value)||0, r=(parseFloat(document.getElementById('ci-r').value)||0)/100, y=parseFloat(document.getElementById('ci-y').value)||1; const res=P*Math.pow(1+r, y); document.getElementById('ci-res').textContent=res.toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2})+' €'; }\n        document.addEventListener('DOMContentLoaded', calcCI);\n      </script>\n    "
  },
  {
    "slug": "health/bmi-rechner",
    "title": "BMI Rechner Online (Body-Mass-Index)",
    "metaDesc": "Berechnen Sie Ihren Body-Mass-Index (BMI) nach den Richtlinien der Weltgesundheitsorganisation (WHO).",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; BMI Rechner</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">BMI Rechner (Body-Mass-Index)</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;\">\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Gewicht (kg)</label><input type=\"number\" id=\"bmi-w\" value=\"70\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcBMI()\" /></div>\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Größe (cm)</label><input type=\"number\" id=\"bmi-h\" value=\"175\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcBMI()\" /></div>\n          </div>\n          <div style=\"background:var(--surface-alt); border:1px solid var(--border); padding:1.25rem; border-radius:4px; text-align:center; margin-top:1.5rem;\">\n            <div style=\"font-size:0.8rem; color:var(--text-muted);\">Ihr BMI-Wert</div>\n            <div id=\"bmi-val\" style=\"font-family:var(--mono); font-size:2.2rem; font-weight:bold; color:var(--btn-bg,#3b82f6);\">22.9</div>\n            <div id=\"bmi-cat\" style=\"font-size:1.1rem; font-weight:bold; color:#22c55e; margin-top:0.3rem;\">Normalgewicht</div>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcBMI(){ const w=parseFloat(document.getElementById('bmi-w').value)||0, h=(parseFloat(document.getElementById('bmi-h').value)||1)/100; const bmi=w/(h*h); document.getElementById('bmi-val').textContent=bmi.toFixed(1); let cat='Normalgewicht', col='#22c55e'; if(bmi<18.5){cat='Untergewicht';col='#3b82f6';} else if(bmi>=25&&bmi<30){cat='Übergewicht';col='#f59e0b';} else if(bmi>=30){cat='Adipositas';col='#ef4444';} const cEl=document.getElementById('bmi-cat'); cEl.textContent=cat; cEl.style.color=col; }\n        document.addEventListener('DOMContentLoaded', calcBMI);\n      </script>\n    "
  },
  {
    "slug": "health/kalorienbedarf-rechner",
    "title": "Kalorienbedarf & Gesamtumsatz Rechner (TDEE)",
    "metaDesc": "Berechnen Sie Ihren täglichen Kalorienbedarf, Grundumsatz (BMR) und Gesamtumsatz zum Abnehmen oder Zunehmen.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; Kalorienbedarf Rechner</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Kalorienbedarf Rechner (TDEE)</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;\">\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Alter</label><input type=\"number\" id=\"t-age\" value=\"28\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcT()\" /></div>\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Gewicht (kg)</label><input type=\"number\" id=\"t-w\" value=\"75\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcT()\" /></div>\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Größe (cm)</label><input type=\"number\" id=\"t-h\" value=\"180\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcT()\" /></div>\n          </div>\n          <div style=\"background:var(--surface-alt); border:1px solid var(--border); padding:1.25rem; border-radius:4px; text-align:center; margin-top:1.5rem;\">\n            <div style=\"font-size:0.8rem; color:var(--text-muted);\">Täglicher Erhaltungsbedarf</div>\n            <div id=\"t-res\" style=\"font-family:var(--mono); font-size:2.2rem; font-weight:bold; color:var(--btn-bg,#3b82f6);\">2.450 kcal / Tag</div>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcT(){ const age=parseFloat(document.getElementById('t-age').value)||25, w=parseFloat(document.getElementById('t-w').value)||70, h=parseFloat(document.getElementById('t-h').value)||175; const bmr=(10*w)+(6.25*h)-(5*age)+5; const tdee=Math.round(bmr*1.4); document.getElementById('t-res').textContent=tdee.toLocaleString('de-DE')+' kcal / Tag'; }\n        document.addEventListener('DOMContentLoaded', calcT);\n      </script>\n    "
  },
  {
    "slug": "design/qr-code-erstellen",
    "title": "Kostenloser QR-Code Generator Online",
    "metaDesc": "Erstellen Sie benutzerdefinierte QR-Codes für URLs, Texte und WLAN direkt im Browser mit PNG-Export.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; QR-Code Generator</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Kostenloser QR-Code Generator</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <input type=\"text\" id=\"qr-txt\" value=\"https://digitaltoolsshed.com\" style=\"width:100%; padding:0.75rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"genQR()\" />\n          <div style=\"display:flex; justify-content:center; padding:2rem 0;\"><canvas id=\"qr-can\"></canvas></div>\n        </div>\n      </div>\n      <script src=\"https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js\"></script>\n      <script>\n        let qr=null;\n        function genQR(){ if(!qr) qr=new QRious({element:document.getElementById('qr-can'), size:220}); qr.value=document.getElementById('qr-txt').value||'https://digitaltoolsshed.com'; }\n        document.addEventListener('DOMContentLoaded', genQR);\n      </script>\n    "
  },
  {
    "slug": "security/passwort-generator",
    "title": "Sicherer Passwort Generator Online",
    "metaDesc": "Generieren Sie hochsichere Passwörter direkt im Browser mit der Web Cryptography API.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; Passwort Generator</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Sicherer Passwort Generator</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: flex; gap: 0.5rem; margin-bottom: 1.5rem;\">\n            <input type=\"text\" id=\"pw-output\" style=\"width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 1.2rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" readonly />\n            <button onclick=\"var btn=this; navigator.clipboard.writeText(document.getElementById('pw-output').value).then(function(){ var o=btn.textContent; btn.textContent='✓ Kopiert!'; setTimeout(function(){ btn.textContent=o; }, 2000); });\" style=\"background: var(--btn-bg, #3b82f6); color:#fff; border:none; padding:0.75rem 1.5rem; border-radius:4px; font-weight:bold; cursor:pointer;\">Kopieren</button>\n          </div>\n          <button onclick=\"genPw()\" style=\"background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"23 4 23 10 17 10\"/><polyline points=\"1 20 1 14 7 14\"/><path d=\"M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15\"/></svg> Generieren</button>\n        </div>\n      </div>\n      <script>\n        function genPw(){ const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'; const arr=new Uint32Array(16); window.crypto.getRandomValues(arr); let res=''; for(let i=0;i<16;i++) res+=chars[arr[i]%chars.length]; document.getElementById('pw-output').value=res; }\n        document.addEventListener('DOMContentLoaded', genPw);\n      </script>\n    "
  },
  {
    "slug": "util/stoppuhr",
    "title": "Online Stoppuhr mit Rundenzeiten",
    "metaDesc": "Präzise Millisekunden-Stoppuhr im Browser mit Rundenzeiterfassung.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/de/\">Startseite</a> &gt; Stoppuhr</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Online Stoppuhr</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 2rem; border-radius: 6px; text-align: center; margin: 1.5rem 0;\">\n          <div id=\"sw-val\" style=\"font-family: var(--mono); font-size: 3.5rem; font-weight: bold; color: var(--btn-bg, #3b82f6);\">00:00.000</div>\n          <div style=\"display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.5rem;\">\n            <button id=\"sw-btn\" onclick=\"toggleSW()\" style=\"background: var(--btn-bg, #3b82f6); color:#fff; border:none; padding:0.6rem 1.5rem; border-radius:4px; font-weight:bold; cursor:pointer;\">▶ Start</button>\n            <button onclick=\"resetSW()\" style=\"background: transparent; color:var(--fg); border:1px solid var(--border); padding:0.6rem 1.2rem; border-radius:4px; cursor:pointer;\">Zurücksetzen</button>\n          </div>\n        </div>\n      </div>\n      <script>\n        let swStart=0, swElapsed=0, swTimer=null;\n        function fmt(ms){ const m=Math.floor(ms/60000).toString().padStart(2,'0'); const s=Math.floor((ms%60000)/1000).toString().padStart(2,'0'); const mil=(ms%1000).toString().padStart(3,'0'); return m+':'+s+'.'+mil; }\n        function toggleSW(){ const btn=document.getElementById('sw-btn'); if(swTimer){ clearInterval(swTimer); swTimer=null; btn.textContent='▶ Weiter'; } else { swStart=Date.now()-swElapsed; swTimer=setInterval(()=>{ swElapsed=Date.now()-swStart; document.getElementById('sw-val').textContent=fmt(swElapsed); },10); btn.textContent='<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"/></svg> Pause'; } }\n        function resetSW(){ clearInterval(swTimer); swTimer=null; swElapsed=0; document.getElementById('sw-val').textContent='00:00.000'; document.getElementById('sw-btn').textContent='▶ Start'; }\n      </script>\n    "
  }
];
  const frTools = [
  {
    "slug": "math/calculateur-pourcentage",
    "title": "Calculateur de Pourcentage en Ligne",
    "metaDesc": "Calculez des pourcentages facilement : calculer X% de Y, déterminer le pourcentage, et mesurer une hausse ou baisse.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; Calculateur de Pourcentage</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Calculateur de Pourcentage</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;\">1. Combien fait X% de Y ?</h3>\n          <div style=\"display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;\">\n            <span>Combien fait</span><input type=\"number\" id=\"p1-x\" style=\"width: 100px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"20\" oninput=\"calcP1()\" />\n            <span>% de</span><input type=\"number\" id=\"p1-y\" style=\"width: 120px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"150\" oninput=\"calcP1()\" />\n            <span>=</span><strong id=\"p1-res\" style=\"font-family: var(--mono); font-size: 1.2rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">30</strong>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcP1(){ const x=parseFloat(document.getElementById('p1-x').value)||0, y=parseFloat(document.getElementById('p1-y').value)||0; document.getElementById('p1-res').textContent=((x/100)*y).toFixed(2); }\n      </script>\n    "
  },
  {
    "slug": "health/calculateur-imc",
    "title": "Calculateur IMC (Indice de Masse Corporelle)",
    "metaDesc": "Calculez votre Indice de Masse Corporelle (IMC) selon les normes officielles de l'OMS.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; Calculateur IMC</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Calculateur IMC</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;\">\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Poids (kg)</label><input type=\"number\" id=\"imc-w\" value=\"68\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcIMC()\" /></div>\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Taille (cm)</label><input type=\"number\" id=\"imc-h\" value=\"175\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcIMC()\" /></div>\n          </div>\n          <div style=\"background:var(--surface-alt); border:1px solid var(--border); padding:1.25rem; border-radius:4px; text-align:center; margin-top:1.5rem;\">\n            <div style=\"font-size:0.8rem; color:var(--text-muted);\">Votre IMC</div>\n            <div id=\"imc-val\" style=\"font-family:var(--mono); font-size:2.2rem; font-weight:bold; color:var(--btn-bg,#3b82f6);\">22.2</div>\n            <div id=\"imc-cat\" style=\"font-size:1.1rem; font-weight:bold; color:#22c55e; margin-top:0.3rem;\">Poids normal</div>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcIMC(){ const w=parseFloat(document.getElementById('imc-w').value)||0, h=(parseFloat(document.getElementById('imc-h').value)||1)/100; const imc=w/(h*h); document.getElementById('imc-val').textContent=imc.toFixed(1); let cat='Poids normal', col='#22c55e'; if(imc<18.5){cat='Insuffisance pondérale';col='#3b82f6';} else if(imc>=25&&imc<30){cat='Surpoids';col='#f59e0b';} else if(imc>=30){cat='Obésité';col='#ef4444';} const el=document.getElementById('imc-cat'); el.textContent=cat; el.style.color=col; }\n        document.addEventListener('DOMContentLoaded', calcIMC);\n      </script>\n    "
  },
  {
    "slug": "design/generateur-code-qr",
    "title": "Générateur de Code QR Gratuit en Ligne",
    "metaDesc": "Créez des codes QR personnalisés directement dans votre navigateur et téléchargez-les en PNG.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; Code QR</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Générateur de Code QR Gratuit</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <input type=\"text\" id=\"qr-fr\" value=\"https://digitaltoolsshed.com\" style=\"width:100%; padding:0.75rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"genQRFR()\" />\n          <div style=\"display:flex; justify-content:center; padding:2rem 0;\"><canvas id=\"qr-can-fr\"></canvas></div>\n        </div>\n      </div>\n      <script src=\"https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js\"></script>\n      <script>\n        let qrF=null; function genQRFR(){ if(!qrF) qrF=new QRious({element:document.getElementById('qr-can-fr'), size:220}); qrF.value=document.getElementById('qr-fr').value||'https://digitaltoolsshed.com'; }\n        document.addEventListener('DOMContentLoaded', genQRFR);\n      </script>\n    "
  },
  {
    "slug": "security/generateur-mot-de-passe",
    "title": "Générateur de Mot de Passe Sécurisé",
    "metaDesc": "Créez des mots de passe aléatoires et ultra-sécurisés avec l'API Web Cryptography.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/fr/\">Accueil</a> &gt; Mot de Passe</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Générateur de Mot de Passe</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: flex; gap: 0.5rem; margin-bottom: 1.5rem;\">\n            <input type=\"text\" id=\"pw-output\" style=\"width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 1.2rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" readonly />\n            <button onclick=\"var btn=this; navigator.clipboard.writeText(document.getElementById('pw-output').value).then(function(){ var o=btn.textContent; btn.textContent='✓ Copié !'; setTimeout(function(){ btn.textContent=o; }, 2000); });\" style=\"background: var(--btn-bg, #3b82f6); color:#fff; border:none; padding:0.75rem 1.5rem; border-radius:4px; font-weight:bold; cursor:pointer;\">Copier</button>\n          </div>\n          <button onclick=\"genPw()\" style=\"background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"23 4 23 10 17 10\"/><polyline points=\"1 20 1 14 7 14\"/><path d=\"M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15\"/></svg> Générer</button>\n        </div>\n      </div>\n      <script>\n        function genPw(){ const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'; const arr=new Uint32Array(16); window.crypto.getRandomValues(arr); let res=''; for(let i=0;i<16;i++) res+=chars[arr[i]%chars.length]; document.getElementById('pw-output').value=res; }\n        document.addEventListener('DOMContentLoaded', genPw);\n      </script>\n    "
  }
];
  const ruTools = [
  {
    "slug": "math/kalkulyator-protsentov",
    "title": "Калькулятор процентов онлайн",
    "metaDesc": "Быстрый расчет процентов: найти процент от числа, расчет изменения в процентах.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; Калькулятор процентов</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Калькулятор процентов онлайн</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <h3 style=\"font-family: var(--serif); font-size: 1.15rem; margin-bottom: 1rem;\">1. Сколько будет X% от числа Y?</h3>\n          <div style=\"display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;\">\n            <span>Сколько будет</span><input type=\"number\" id=\"p1-x\" style=\"width: 100px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"15\" oninput=\"calcP1()\" />\n            <span>% от</span><input type=\"number\" id=\"p1-y\" style=\"width: 120px; padding: 0.5rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" value=\"5000\" oninput=\"calcP1()\" />\n            <span>=</span><strong id=\"p1-res\" style=\"font-family: var(--mono); font-size: 1.2rem; color: var(--btn-bg, #3b82f6); margin-left: 0.5rem;\">750</strong>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcP1(){ const x=parseFloat(document.getElementById('p1-x').value)||0, y=parseFloat(document.getElementById('p1-y').value)||0; document.getElementById('p1-res').textContent=((x/100)*y).toFixed(2); }\n      </script>\n    "
  },
  {
    "slug": "health/kalkulyator-imt",
    "title": "Калькулятор ИМТ (Индекс массы тела онлайн)",
    "metaDesc": "Рассчитайте индекс массы тела (ИМТ) по рекомендациям ВОЗ для мужчин и женщин.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; Калькулятор ИМТ</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Калькулятор ИМТ</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;\">\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Вес (кг)</label><input type=\"number\" id=\"imt-w\" value=\"70\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcIMT()\" /></div>\n            <div><label style=\"font-size:0.8rem; display:block; margin-bottom:0.3rem;\">Рост (см)</label><input type=\"number\" id=\"imt-h\" value=\"175\" style=\"width:100%; padding:0.5rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"calcIMT()\" /></div>\n          </div>\n          <div style=\"background:var(--surface-alt); border:1px solid var(--border); padding:1.25rem; border-radius:4px; text-align:center; margin-top:1.5rem;\">\n            <div style=\"font-size:0.8rem; color:var(--text-muted);\">Ваш ИМТ</div>\n            <div id=\"imt-val\" style=\"font-family:var(--mono); font-size:2.2rem; font-weight:bold; color:var(--btn-bg,#3b82f6);\">22.9</div>\n            <div id=\"imt-cat\" style=\"font-size:1.1rem; font-weight:bold; color:#22c55e; margin-top:0.3rem;\">Нормальный вес</div>\n          </div>\n        </div>\n      </div>\n      <script>\n        function calcIMT(){ const w=parseFloat(document.getElementById('imt-w').value)||0, h=(parseFloat(document.getElementById('imt-h').value)||1)/100; const imt=w/(h*h); document.getElementById('imt-val').textContent=imt.toFixed(1); let cat='Нормальный вес', col='#22c55e'; if(imt<18.5){cat='Дефицит веса';col='#3b82f6';} else if(imt>=25&&imt<30){cat='Избыточный вес';col='#f59e0b';} else if(imt>=30){cat='Ожирение';col='#ef4444';} const el=document.getElementById('imt-cat'); el.textContent=cat; el.style.color=col; }\n        document.addEventListener('DOMContentLoaded', calcIMT);\n      </script>\n    "
  },
  {
    "slug": "design/generator-qr-koda",
    "title": "Бесплатный Генератор QR Кодов Онлайн",
    "metaDesc": "Создавайте QR-коды для сайтов и ссылок прямо в браузере с экспортом в высоком разрешении PNG.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; QR Код</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Генератор QR Кодов Онлайн</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <input type=\"text\" id=\"qr-ru\" value=\"https://digitaltoolsshed.com\" style=\"width:100%; padding:0.75rem; background:var(--bg); color:var(--fg); border:1px solid var(--border); border-radius:4px;\" oninput=\"genQRRU()\" />\n          <div style=\"display:flex; justify-content:center; padding:2rem 0;\"><canvas id=\"qr-can-ru\"></canvas></div>\n        </div>\n      </div>\n      <script src=\"https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js\"></script>\n      <script>\n        let qrR=null; function genQRRU(){ if(!qrR) qrR=new QRious({element:document.getElementById('qr-can-ru'), size:220}); qrR.value=document.getElementById('qr-ru').value||'https://digitaltoolsshed.com'; }\n        document.addEventListener('DOMContentLoaded', genQRRU);\n      </script>\n    "
  },
  {
    "slug": "security/generator-paroley",
    "title": "Генератор надежных паролей онлайн",
    "metaDesc": "Создавайте криптографически стойкие и безопасные пароли прямо в браузере.",
    "body": "\n      <div class=\"article-container\" style=\"max-width: 900px;\">\n        <nav style=\"font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);\"><a href=\"/ru/\">Главная</a> &gt; Генератор паролей</nav>\n        <h1 style=\"font-family: var(--serif); font-size: 1.8rem; margin-bottom: 0.5rem;\">Генератор надежных паролей онлайн</h1>\n        <div style=\"background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; margin: 1.5rem 0;\">\n          <div style=\"display: flex; gap: 0.5rem; margin-bottom: 1.5rem;\">\n            <input type=\"text\" id=\"pw-output\" style=\"width: 100%; padding: 0.75rem; font-family: var(--mono); font-size: 1.2rem; background: var(--bg); color: var(--fg); border: 1px solid var(--border); border-radius: 4px;\" readonly />\n            <button onclick=\"var btn=this; navigator.clipboard.writeText(document.getElementById('pw-output').value).then(function(){ var o=btn.textContent; btn.textContent='✓ Скопировано!'; setTimeout(function(){ btn.textContent=o; }, 2000); });\" style=\"background: var(--btn-bg, #3b82f6); color:#fff; border:none; padding:0.75rem 1.5rem; border-radius:4px; font-weight:bold; cursor:pointer;\">Копировать</button>\n          </div>\n          <button onclick=\"genPw()\" style=\"background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.6rem 1.2rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer; border-radius: 4px;\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"display:inline-block;vertical-align:middle;margin-right:3px\"><polyline points=\"23 4 23 10 17 10\"/><polyline points=\"1 20 1 14 7 14\"/><path d=\"M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15\"/></svg> Сгенерировать</button>\n        </div>\n      </div>\n      <script>\n        function genPw(){ const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'; const arr=new Uint32Array(16); window.crypto.getRandomValues(arr); let res=''; for(let i=0;i<16;i++) res+=chars[arr[i]%chars.length]; document.getElementById('pw-output').value=res; }\n        document.addEventListener('DOMContentLoaded', genPw);\n      </script>\n    "
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
    const html = renderPage({
      title: `${t.title} | Digital Tools Shed DE`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/de/${t.slug}`,
      bodyContent: t.body,
      currentPath: `/de/${t.slug}`,
      lang: 'de'
    });
    writeFileSync(join(deDist, `${t.slug}.html`), html);
  }

  const deHubCards = deTools.map(t => `
    <a href="/de/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  writeFileSync(join(deDist, 'index.html'), renderPage({
    title: 'Kostenlose Online-Tools & Rechner | Digital Tools Shed (Deutsch)',
    metaDesc: 'Kostenlose Online-Werkzeuge auf Deutsch: Prozentrechner, Zinseszinsrechner, BMI-Rechner, Passwort Generator, Stoppuhr und QR-Codes.',
    canonical: `${DOMAIN}/de/`,
    bodyContent: `
      <div class="article-container" style="max-width: 900px;">
        <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Kostenlose Online-Tools & Rechner (Deutsch)</h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
          Alle Werkzeuge laufen zu 100% lokal im Browser. Schnell, sicher und ohne Registrierung.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${deHubCards}
        </div>
      </div>
    `,
    currentPath: '/de/',
    lang: 'de'
  }));

  // 2. Build French Suite (/fr/)
  const frDist = join(DIST, 'fr');
  ensureDir(frDist);
  ensureDir(join(frDist, 'math'));
  ensureDir(join(frDist, 'health'));
  ensureDir(join(frDist, 'design'));
  ensureDir(join(frDist, 'security'));

  for (const t of frTools) {
    const html = renderPage({
      title: `${t.title} | Digital Tools Shed FR`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/fr/${t.slug}`,
      bodyContent: t.body,
      currentPath: `/fr/${t.slug}`,
      lang: 'fr'
    });
    writeFileSync(join(frDist, `${t.slug}.html`), html);
  }

  const frHubCards = frTools.map(t => `
    <a href="/fr/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  writeFileSync(join(frDist, 'index.html'), renderPage({
    title: 'Outils et Calculateurs Gratuits en Ligne | Digital Tools Shed (Français)',
    metaDesc: 'Outils gratuits en ligne en français : calculateur de pourcentage, calculateur IMC, générateur de code QR et mots de passe.',
    canonical: `${DOMAIN}/fr/`,
    bodyContent: `
      <div class="article-container" style="max-width: 900px;">
        <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Outils & Calculateurs en Ligne (Français)</h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
          Des outils web gratuits, sans installation et traités directement dans votre navigateur.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${frHubCards}
        </div>
      </div>
    `,
    currentPath: '/fr/',
    lang: 'fr'
  }));

  // 3. Build Russian Suite (/ru/)
  const ruDist = join(DIST, 'ru');
  ensureDir(ruDist);
  ensureDir(join(ruDist, 'math'));
  ensureDir(join(ruDist, 'health'));
  ensureDir(join(ruDist, 'design'));
  ensureDir(join(ruDist, 'security'));

  for (const t of ruTools) {
    const html = renderPage({
      title: `${t.title} | Digital Tools Shed RU`,
      metaDesc: t.metaDesc,
      canonical: `${DOMAIN}/ru/${t.slug}`,
      bodyContent: t.body,
      currentPath: `/ru/${t.slug}`,
      lang: 'ru'
    });
    writeFileSync(join(ruDist, `${t.slug}.html`), html);
  }

  const ruHubCards = ruTools.map(t => `
    <a href="/ru/${t.slug}" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-decoration: none; color: inherit;">
      <h3 style="font-family: var(--serif); font-size: 1.15rem; margin: 0 0 0.4rem; color: var(--fg);">${t.title}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin: 0;">${t.metaDesc}</p>
    </a>
  `).join('');

  writeFileSync(join(ruDist, 'index.html'), renderPage({
    title: 'Бесплатные онлайн инструменты и калькуляторы | Digital Tools Shed (Русский)',
    metaDesc: 'Бесплатные веб-инструменты на русском языке: калькулятор процентов, калькулятор ИМТ, генератор QR кодов и паролей.',
    canonical: `${DOMAIN}/ru/`,
    bodyContent: `
      <div class="article-container" style="max-width: 900px;">
        <h1 style="font-family: var(--serif); font-size: 2rem; margin-bottom: 0.5rem;">Бесплатные онлайн инструменты (Русский)</h1>
        <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;">
          Все инструменты работают прямо в вашем браузере без сохранения на сервере.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${ruHubCards}
        </div>
      </div>
    `,
    currentPath: '/ru/',
    lang: 'ru'
  }));

  console.log(`  ✓ Built Multilingual Suites (DE: ${deTools.length + 1}, FR: ${frTools.length + 1}, RU: ${ruTools.length + 1} pages)`);
}
