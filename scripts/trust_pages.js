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

        <p>The site is supported by display advertising and sponsor partnerships. The ads you see on the page are what keep the lights on. I know ads can be annoying, but they let me offer all tools without charging anyone a subscription fee or gating features behind a paywall.</p>

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
      </header>
      <div class="article-body">
        <p><em>Last updated: February 2026</em></p>

        <p>Digital Tools Shed ("we," "our," or "the site") operates <a href="https://digitaltoolsshed.com">digitaltoolsshed.com</a>. This page explains our policies regarding the collection, use, and disclosure of personal data when you use our site.</p>

        <h2>The Short Version</h2>

        <p><strong>Everything, Everywhere.</strong> Our tools process your data entirely in your web browser using client-side JavaScript. We do not upload, store, or view your files, inputs, or generated content on any server.</p>

        <h2>Information We Do NOT Collect</h2>

        <ul>
          <li><strong>Files and input data:</strong> When you convert an image, extract audio, format JSON, decode JWT tokens, or use any calculator, that processing happens locally on your device. No file content or tool input is ever transmitted to our servers.</li>
          <li><strong>Account information:</strong> We do not have user accounts, logins, or registration forms. You cannot create an account on this site even if you wanted to.</li>
          <li><strong>Payment information:</strong> All tools are 100% free. We do not collect credit card numbers, billing addresses, or payment details.</li>
        </ul>

        <h2>Information We DO Collect</h2>

        <h3>1. Standard Web Analytics</h3>
        <p>Like almost every website, we use basic analytics to understand how people find and use the site. This may include:</p>
        <ul>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring website URL</li>
          <li>Pages visited and time spent on pages</li>
          <li>General geographic location (country/city level, not precise GPS)</li>
        </ul>
        <p>This data is aggregated and anonymized. We cannot use it to identify you personally.</p>

        <h3>2. Advertising Partners</h3>
        <p>We display third-party advertisements to support the free operation of this site. Our advertising partners may use cookies, web beacons, and similar technologies to serve ads based on your prior visits to this site or other websites on the internet.</p>
        <p>These third-party ad networks include, but are not limited to, Adsterra and other programmatic ad exchanges. These companies may collect information about your visits to this and other websites in order to provide relevant advertisements about goods and services of interest to you.</p>
        <p>You can opt out of personalized advertising by visiting the Network Advertising Initiative opt-out page at <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener">optout.networkadvertising.org</a> or the Digital Advertising Alliance at <a href="https://optout.aboutads.info" target="_blank" rel="noopener">optout.aboutads.info</a>.</p>

        <h3>3. Local Storage</h3>
        <p>Some tools (like our Time Tracker, Task Manager, and Timetable) save your data locally in your browser's <code>localStorage</code> so your work is saved between visits. This data stays entirely in your browser and is never sent to us. You can clear it at any time by clearing your browser data.</p>

        <h2>Third-Party Links</h2>

        <p>Our site contains links to other websites — for example, in our technical articles and sponsor notices. If you click on a third-party link, you will be directed to that site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

        <h2>Children's Privacy</h2>

        <p>Our site does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.</p>

        <h2>Changes to This Privacy Policy</h2>

        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top.</p>

        <h2>Contact Us</h2>

        <p>If you have any questions about this Privacy Policy, you can reach out via our <a href="/about.html">About page</a>.</p>
      </div>
    </div>
  `;

  // === TERMS OF SERVICE ===
  const termsBody = `
    <div class="article-container">
      <header class="article-header">
        <div class="article-journal-tag">Legal</div>
        <h1>Terms of Service</h1>
      </header>
      <div class="article-body">
        <p><em>Last updated: February 2026</em></p>

        <p>By accessing or using Digital Tools Shed (<a href="https://digitaltoolsshed.com">digitaltoolsshed.com</a>), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the site.</p>

        <h2>Use of Tools</h2>

        <p>All tools on Digital Tools Shed are provided free of charge for personal and commercial use. You may use them as often as you like, for whatever purpose you need, subject to the following conditions:</p>

        <ul>
          <li><strong>No abusive automation:</strong> You may not use automated scripts, bots, or scrapers to overwhelm or disrupt our hosting infrastructure.</li>
          <li><strong>No illegal use:</strong> You may not use our tools to process, generate, or distribute illegal content.</li>
          <li><strong>No reverse engineering of the site:</strong> You are welcome to inspect our client-side code (it's in your browser anyway), but you may not scrape the entire site and re-host it under a different domain without permission.</li>
        </ul>

        <h2>Disclaimer of Warranties</h2>

        <p>ALL TOOLS, CONTENT, AND SERVICES ON THIS SITE ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE SPECIFICALLY DISCLAIM ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>

        <p>While we test our tools thoroughly, we cannot guarantee that:</p>
        <ul>
          <li>The tools will meet your specific requirements</li>
          <li>The tools will be uninterrupted, timely, secure, or error-free</li>
          <li>The results obtained from using the tools will be accurate or reliable</li>
          <li>Any errors in the tools will be corrected</li>
        </ul>

        <p>Always verify important calculations (especially financial, tax, or legal calculations) with a qualified professional.</p>

        <h2>Limitation of Liability</h2>

        <p>IN NO EVENT SHALL DIGITAL TOOLS SHED, ITS CREATOR, OR ITS CONTRIBUTORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THIS SITE.</p>

        <h2>Advertisements and External Links</h2>

        <p>This site displays third-party advertisements and may contain links to external websites. We do not endorse, guarantee, or assume responsibility for any product, service, or content advertised on or linked from this site. Any interaction with advertisers or third-party sites is solely between you and the third party.</p>

        <h2>Changes to Terms</h2>

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
      metaDesc: 'Digital Tools Shed privacy policy. Everything, Everywhere. No accounts, fast zero-install web utilities.',
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
      <a href="/" class="btn-primary" style="display: inline-block; padding: 0.75rem 2rem; text-decoration: none;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg> Return to Tools Shed</a>
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
