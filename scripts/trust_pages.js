import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage } from './core.js';

function buildTrustPages() {
  // === ABOUT US ===
  const aboutBody = `
    <div class="article-container">
      <header class="article-header">
        <div class="article-journal-tag">About</div>
        <h1>About Digital Tools Shed</h1>
      </header>
      <div class="article-body">
        <p>Hi. My name is Mina Lee and I built Digital Tools Shed because I got tired of sketchy tool websites.</p>

        <p>You know the ones. You search for "convert PNG to JPG" and end up on a site that wants you to upload your files to some random server, create an account, and maybe install a browser extension that's definitely not tracking you. Half the time they don't even work.</p>

        <p>I wanted something different. A place where you can just get things done without worrying about where your data is going.</p>

        <h2>How the tools actually work</h2>

        <p>Every single tool on this site runs directly in your web browser. When you drop a file into one of our converters, that file stays on your computer. It never gets uploaded anywhere. The conversion happens using your browser's built-in capabilities like the HTML5 Canvas API, the File API, and JavaScript processing.</p>

        <p>This means a few things:</p>
        <ul>
          <li>Your files are private. We literally cannot see them because they never touch our servers.</li>
          <li>The tools work offline once the page has loaded.</li>
          <li>There are no file size limits imposed by server storage. The only limit is your own device's memory.</li>
          <li>Processing is usually faster because there is no upload/download step.</li>
        </ul>

        <p>We don't run a backend server for file processing. The site is static HTML, CSS, and JavaScript hosted on GitHub Pages. That's it.</p>

        <h2>Why it's free</h2>

        <p>The site is supported by display advertising and sponsor partnerships. The ads you see on the page are what keep the lights on. I know ads can be annoying, but they let me offer all 88+ tools without charging anyone a subscription fee or gating features behind a paywall.</p>

        <p>I try to keep the ads tasteful and clearly labeled. If something feels off, that's on me and I want to fix it.</p>

        <h2>What "The Site of Everything" means</h2>

        <p>It started as a joke. I kept adding tools for things I personally needed and the list got long. Developer tools, image converters, media extractors, unit calculators, Minecraft utilities, PDF tools, and now a tech journal with actual engineering articles. At some point someone said "this is becoming the site of everything" and the name stuck.</p>

        <p>The goal is simple: if you need a quick utility tool, you should be able to find it here, use it for free, and leave without giving up your email or worrying about your data.</p>

        <h2>Contact</h2>

        <p>If you have questions, found a bug, or want to suggest a new tool, you can reach me at:</p>
        <ul>
          <li>Email: (coming soon)</li>
        </ul>

        <p>Thanks for using Digital Tools Shed.</p>
        <p><strong>Mina Lee</strong><br/>Creator, Digital Tools Shed</p>
      </div>
    </div>
  `;

  // === PRIVACY POLICY ===
  const privacyBody = `
    <div class="article-container">
      <header class="article-header">
        <div class="article-journal-tag">Legal</div>
        <h1>Privacy Policy</h1>
        <div class="article-meta">
          <span>Last updated: August 16, 2026</span>
        </div>
      </header>
      <div class="article-body">
        <p>This privacy policy explains what data Digital Tools Shed collects, how we use it, and what your rights are. The short version: we collect almost nothing because of how the site is built.</p>

        <h2>Your files and data</h2>

        <p>All tools on Digital Tools Shed run entirely in your web browser. When you use any of our file converters, image tools, PDF processors, or other utilities, your files are processed locally on your device using JavaScript. <strong>Your files are never uploaded to any server.</strong></p>

        <p>We do not have the technical ability to access, read, store, or transmit your files. There is no server-side file processing infrastructure.</p>

        <h2>What we do store</h2>

        <p>The site stores a small number of preferences in your browser's local storage:</p>
        <ul>
          <li><strong>Theme preference</strong> (light or dark mode) stored in localStorage under the key "dts-theme"</li>
          <li><strong>Sponsor notice dismissal</strong> stored in sessionStorage so the notice bar does not reappear during your browsing session</li>
        </ul>
        <p>These values stay in your browser and are never sent to us or any third party.</p>

        <h2>Advertising</h2>

        <p>Digital Tools Shed displays advertisements through Adsterra, a third-party advertising network. Adsterra may use cookies, web beacons, and similar tracking technologies to serve ads based on your browsing activity.</p>

        <p>We do not control what data Adsterra collects. For details on their data practices, please review the <a href="https://adsterra.com/privacy-policy/" target="_blank" rel="noopener">Adsterra Privacy Policy</a>.</p>

        <p>The advertising formats used on this site include display banners, native recommendation widgets, and popunder ads. The first time you click anywhere on a page, a sponsor tab may open in a new browser tab. This is clearly disclosed in our on-site sponsor notice.</p>

        <h2>Analytics</h2>

        <p>We do not use Google Analytics, Facebook Pixel, or any first-party tracking scripts. We do not collect personal information, IP addresses, or browsing history.</p>

        <p>Basic traffic statistics may be available through our hosting provider (GitHub Pages) and advertising partner (Adsterra), but we do not actively monitor individual user behavior.</p>

        <h2>Cookies</h2>

        <p>Digital Tools Shed itself does not set any cookies. Third-party advertising scripts from Adsterra may set cookies in your browser. You can manage or block these cookies through your browser settings.</p>

        <h2>Children</h2>

        <p>This site is not directed at children under the age of 13. We do not knowingly collect personal information from children.</p>

        <h2>Changes to this policy</h2>

        <p>If this privacy policy changes, we will update the "last updated" date at the top of this page. We are not going to send you emails about it because we don't have your email.</p>

        <h2>Contact</h2>

        <p>If you have questions about this privacy policy, feel free to reach out via the contact details on our <a href="/about.html">About page</a>.</p>
      </div>
    </div>
  `;

  // === TERMS OF SERVICE ===
  const termsBody = `
    <div class="article-container">
      <header class="article-header">
        <div class="article-journal-tag">Legal</div>
        <h1>Terms of Service</h1>
        <div class="article-meta">
          <span>Last updated: August 16, 2026</span>
        </div>
      </header>
      <div class="article-body">
        <p>By using Digital Tools Shed (digitaltoolsshed.com), you agree to the following terms. They are written in plain language because legal jargon helps nobody.</p>

        <h2>What the site does</h2>

        <p>Digital Tools Shed provides free, browser-based utility tools for file conversion, image processing, developer workflows, unit calculations, and other tasks. All processing happens on your device. We do not store, access, or transmit your files.</p>

        <h2>Use at your own risk</h2>

        <p>The tools are provided "as is" without any warranties. While we do our best to make everything work correctly, we cannot guarantee that every tool will produce perfect results in every situation. Always keep backups of your original files before converting or processing them.</p>

        <p>We are not responsible for any data loss, file corruption, or other issues that arise from using the tools on this site.</p>

        <h2>Acceptable use</h2>

        <p>You can use the tools for personal or commercial purposes. There is no restriction on how you use the output files.</p>

        <p>You may not:</p>
        <ul>
          <li>Attempt to reverse-engineer, scrape, or redistribute the site's source code for commercial purposes without permission</li>
          <li>Use automated bots to generate excessive ad impressions</li>
          <li>Frame or embed the site in a way that removes attribution or advertising</li>
        </ul>

        <h2>Advertising</h2>

        <p>This site is supported by advertising. By using the site, you acknowledge that ads will be displayed and that your first click on any page may open a sponsor tab in your browser. We disclose this through an on-site notice.</p>

        <h2>Intellectual property</h2>

        <p>The tools, articles, design, and code on Digital Tools Shed are the property of Mina Lee and Digital Tools Shed. The articles in our tech journal are original works and may not be republished without attribution.</p>

        <p>Files you process through the tools remain your property. We claim no ownership over your input or output files.</p>

        <h2>Third-party services</h2>

        <p>The site uses Adsterra for advertising. Your interaction with ads is governed by Adsterra's own terms and privacy policy. We are not responsible for the content of third-party advertisements.</p>

        <h2>Changes</h2>

        <p>These terms may be updated from time to time. Continued use of the site after changes are posted means you accept the updated terms.</p>

        <h2>Contact</h2>

        <p>Questions about these terms can be directed through our <a href="/about.html">About page</a>.</p>
      </div>
    </div>
  `;

  const pages = [
    {
      slug: 'about',
      title: 'About Us',
      metaDesc: 'Learn about Digital Tools Shed, how our browser-based tools work, and why everything is free. Built by Mina Lee.',
      body: aboutBody
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      metaDesc: 'Digital Tools Shed privacy policy. Your files never leave your device. No tracking, no accounts, no data collection.',
      body: privacyBody
    },
    {
      slug: 'terms',
      title: 'Terms of Service',
      metaDesc: 'Terms of service for Digital Tools Shed. Free browser-based tools provided as-is with no warranties.',
      body: termsBody
    }
  ];

  for (const page of pages) {
    const html = renderPage({
      title: `${page.title} | Digital Tools Shed`,
      metaDesc: page.metaDesc,
      canonical: `${DOMAIN}/${page.slug}.html`,
      bodyContent: page.body,
      currentPath: `/${page.slug}.html`
    });
    writeFileSync(join(DIST, `${page.slug}.html`), html);
  }

  console.log('  ✓ Built Trust & Legal Pages (about.html, privacy.html, terms.html)');
}

// ─── 404 ERROR PAGE ─────────────────────────────────────────────────────────
function build404Page() {
  const bodyContent = `
    <div class="hero" style="text-align: center; padding: 3rem 1.5rem;">
      <div style="font-family: var(--mono); font-size: 6rem; font-weight: 900; color: var(--fg); line-height: 1; margin-bottom: 0.5rem;">404</div>
      <h1 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Page Not Found</h1>
      <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem;">The page you're looking for doesn't exist or has been moved. But while you're here, check out our free tools below.</p>
      <a href="/" class="btn-primary" style="display: inline-block; padding: 0.75rem 2rem; text-decoration: none;">← Return to Tools Shed</a>
    </div>

    <div class="ad-blend-box" style="margin: 2rem 0;">
      <span class="ad-label">Featured Partner</span>
      <div class="ad-desktop-leaderboard">
        <script type="text/javascript">
          atOptions = {
            'key' : '567d4e495ec8a8e297b7c7f5170993cb',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/567d4e495ec8a8e297b7c7f5170993cb/invoke.js"></script>
      </div>
      <div class="ad-mobile-banner">
        <script type="text/javascript">
          atOptions = {
            'key' : '9ec3cbd7674ade5c0cfa745d18664214',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Sponsored Partner</div>
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
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Sponsored Recommendation</div>
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
    </div>

    <div style="margin: 2rem 0;">
      <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">You Might Also Like</div>
      <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
      <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
    </div>

    <div class="ad-blend-box" style="margin: 2rem 0; padding: 0.5rem;">
      <span class="ad-label">Sponsored Utility</span>
      <div class="ad-unit-468x60">
        <script type="text/javascript">
          atOptions = {
            'key' : '0b6898775795b270130cc9971eef21a8',
            'format' : 'iframe',
            'height' : 60,
            'width' : 468,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/0b6898775795b270130cc9971eef21a8/invoke.js"></script>
      </div>
      <div class="ad-mobile-banner">
        <script type="text/javascript">
          atOptions = {
            'key' : '9ec3cbd7674ade5c0cfa745d18664214',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://manyapostle.com/9ec3cbd7674ade5c0cfa745d18664214/invoke.js"></script>
      </div>
    </div>

    <div style="text-align: center; padding: 2rem 0;">
      <div style="font-family: var(--serif); font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem;">Popular Free Tools</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
        <a href="/media/downloader.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Media Downloader</a>
        <a href="/convert/json-obfuscator.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">JSON Obfuscator</a>
        <a href="/convert/esbuild-decompiler.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">JS Decompiler</a>
        <a href="/convert/image-resizer.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Image Resizer</a>
        <a href="/calc/kg-to-lbs.html" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">KG to LBS</a>
        <a href="/articles/" style="padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); text-decoration: none; color: var(--fg); font-family: var(--mono); font-size: 0.8rem;">Tech Articles</a>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">From Our Partners</div>
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
      <div class="ad-promo-card">
        <div class="promo-badge" style="background: var(--surface-alt); color: var(--text-muted); border: 1px solid var(--border); width: 100%; text-align: center;">Discover More</div>
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
    </div>

    <div style="margin: 2rem 0;">
      <div style="font-family: var(--mono); font-size: 0.65rem; color: var(--text-subtle); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Recommended For You</div>
      <div id="container-cd881b59407c303a0b391e7998dd6cb9"></div>
      <script async="async" data-cfasync="false" src="https://manyapostle.com/cd881b59407c303a0b391e7998dd6cb9/invoke.js"></script>
    </div>
  `;

  const html = renderPage({
    title: '404 — Page Not Found | Digital Tools Shed',
    metaDesc: 'The page you requested was not found. Browse our free online developer tools, converters, media downloaders, and tech articles.',
    canonical: `${DOMAIN}/404.html`,
    bodyContent,
    currentPath: '/404.html'
  });

  writeFileSync(join(DIST, '404.html'), html);
  console.log('  ✓ Built 404 Error Page (ad-heavy with popunder)');
}

export { buildTrustPages, build404Page };
