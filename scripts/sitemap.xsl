<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap | Digital Tools Shed</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          :root {
            --bg: #000000;
            --fg: #ffffff;
            --surface: #0a0a0a;
            --border: #2b2b2b;
            --text-muted: #888888;
            --serif: "Times New Roman", Times, "Liberation Serif", Georgia, serif;
            --mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", Courier, monospace;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background: var(--bg);
            color: var(--fg);
            font-family: var(--serif);
            padding: 3rem 1.5rem;
            max-width: 1100px;
            margin: 0 auto;
            line-height: 1.5;
          }
          header {
            border-bottom: 2px solid #ffffff;
            padding-bottom: 1.5rem;
            margin-bottom: 2.5rem;
          }
          h1 {
            font-size: 2.8rem;
            font-weight: 900;
            letter-spacing: -0.03em;
            margin-bottom: 0.5rem;
          }
          p.desc {
            color: var(--text-muted);
            font-size: 1.15rem;
            font-style: italic;
            margin-bottom: 1rem;
          }
          .back-link {
            font-family: var(--mono);
            font-size: 0.85rem;
            color: #ffffff;
            text-decoration: none;
            display: inline-block;
            border: 1px solid var(--border);
            padding: 0.4rem 0.8rem;
            background: var(--surface);
          }
          .back-link:hover { border-color: #ffffff; }
          .stats {
            font-family: var(--mono);
            font-size: 0.85rem;
            color: var(--text-muted);
            margin: 1.5rem 0;
            padding: 0.75rem 1rem;
            background: var(--surface);
            border: 1px solid var(--border);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1.5rem;
            font-size: 0.95rem;
          }
          th {
            font-family: var(--mono);
            font-size: 0.8rem;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.85rem 1rem;
            border-bottom: 2px solid #ffffff;
            color: #ffffff;
          }
          td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border);
          }
          tr:hover td {
            background: var(--surface);
          }
          td a {
            color: #ffffff;
            text-decoration: none;
            word-break: break-all;
          }
          td a:hover {
            text-decoration: underline;
          }
          .priority-tag {
            font-family: var(--mono);
            font-size: 0.75rem;
            background: #ffffff;
            color: #000000;
            padding: 2px 6px;
            font-weight: bold;
          }
          .date-tag {
            font-family: var(--mono);
            font-size: 0.8rem;
            color: var(--text-muted);
          }
        </style>
      </head>
      <body>
        <header>
          <a href="/" class="back-link">← Return to Digital Tools Shed</a>
          <h1 style="margin-top: 1.5rem;">XML SITEMAP INDEX</h1>
          <p class="desc">Engineered for Googlebot, Bingbot, and public web crawler discoverability.</p>
        </header>

        <div class="stats">
          Total Discovered URLs: <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> indexable entry points.
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 60%;">URL Location</th>
              <th style="width: 15%;">Priority</th>
              <th style="width: 15%;">Frequency</th>
              <th style="width: 10%;">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <span class="priority-tag">
                    <xsl:value-of select="sitemap:priority"/>
                  </span>
                </td>
                <td style="font-family: var(--mono); font-size: 0.85rem; color: var(--text-muted);">
                  <xsl:value-of select="sitemap:changefreq"/>
                </td>
                <td class="date-tag">
                  <xsl:value-of select="sitemap:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
