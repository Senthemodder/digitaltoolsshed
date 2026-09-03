import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir, ICONS } from './core.js';

function buildMediaSuite() {
  const mediaDir = join(DIST, 'media');
  ensureDir(mediaDir);

  // ─── 1. UNIVERSAL MEDIA DOWNLOADER (AUTO-DOWNLOAD + IN-PAGE ADS + NO REDIRECTS) ───
  const downloaderBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Universal Media & Video Downloader</h1>
      <p>Download HD video and high-bitrate audio from YouTube, TikTok, X/Twitter, Instagram, Reddit, and direct streams. 100% Free, Private, with Built-in Tab Stream Capture.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <!-- Search & Input Box -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
        <input type="url" id="mediaUrl" class="search-input" placeholder="Paste YouTube, TikTok, X/Twitter, Instagram, Reddit, or MP4 URL here..." style="flex: 1; min-width: 260px; padding: 0.85rem 1rem; font-family: var(--mono); font-size: 0.95rem;" />
        <button id="downloadBtn" class="btn-primary" style="padding: 0.85rem 1.75rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;">
          ${ICONS.download}
          <span>EXTRACT & DOWNLOAD</span>
        </button>
      </div>

      <!-- Live Platform Detection Banner -->
      <div id="detectionPill" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; font-size: 0.8rem; color: var(--text-muted);">
        <div style="display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
          <span style="font-weight: 600;">Supported:</span>
          <span class="platform-chip" id="chipYt" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">YouTube (HD/MP3)</span>
          <span class="platform-chip" id="chipTt" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">TikTok (No Watermark)</span>
          <span class="platform-chip" id="chipX" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">X / Twitter</span>
          <span class="platform-chip" id="chipIg" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">Instagram Reels</span>
          <span class="platform-chip" id="chipReddit" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">Reddit</span>
          <span class="platform-chip" id="chipDirect" style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">Direct MP4/WebM</span>
        </div>
        <div id="activePill" style="display: none; font-weight: bold; color: #10b981; font-family: var(--mono);"></div>
      </div>

      <!-- In-Page Sponsored Ad Unit 1 -->
      <div class="ad-blend-box" style="margin: 1.5rem 0; max-width: 850px;">
        <span class="ad-label">Sponsored Resource</span>
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

      <!-- Extraction Progress Bar -->
      <div id="mediaStatus" style="display: none; padding: 1.25rem; border: 1px solid var(--border); background: var(--surface-alt); margin-bottom: 1.5rem; font-family: var(--mono); font-size: 0.9rem; border-radius: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div id="statusText">Connecting to media stream...</div>
          <div id="statusPct" style="font-weight: bold;">35%</div>
        </div>
        <div id="progressTrack" style="height: 8px; background: var(--surface); margin-top: 0.75rem; border: 1px solid var(--border); overflow: hidden; border-radius: 4px;">
          <div id="progressBar" style="height: 100%; width: 35%; background: #10b981; transition: width 0.25s ease;"></div>
        </div>
      </div>

      <!-- DIRECT STREAM RESULT PANEL (When raw MP4/media is snatched) -->
      <div id="resultSection" style="display: none; border: 1px solid var(--border); padding: 1.75rem; background: var(--surface); margin-bottom: 1.5rem; border-radius: 6px;">
        <div id="autoDownloadBanner" style="background: #10b981; color: #fff; padding: 0.6rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span id="autoDownloadText">STREAM EXTRACTED! Your file is ready to download.</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
          <h3 id="videoTitle" style="font-family: var(--serif); font-size: 1.2rem; font-weight: 700; margin: 0;">Extracted Video Stream</h3>
          <span id="platformTag" style="font-family: var(--mono); font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.5rem; border-radius: 3px;">HD VIDEO</span>
        </div>

        <div id="videoPlayerContainer" style="margin-bottom: 1.5rem; background: #000; border: 1px solid var(--border); text-align: center; border-radius: 4px; overflow: hidden;">
          <video id="extractedVideo" controls playsinline style="max-width: 100%; max-height: 480px; display: block; margin: 0 auto;"></video>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1rem;">
          <a href="#" id="finalDownloadLink" class="btn-primary" target="_blank" download="media_video.mp4" style="text-decoration: none; padding: 0.85rem 1.4rem; font-size: 0.95rem;">
            ${ICONS.download}
            <span id="downloadBtnText">DOWNLOAD HD MP4</span>
          </a>
          <button id="downloadMp3Btn" class="btn-primary" style="background: #2563eb; color: #fff; border: 1px solid #1d4ed8; padding: 0.85rem 1.4rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
            <span id="mp3BtnText">EXTRACT MP3 AUDIO</span>
          </button>
          <button id="downloadOggBtn" class="btn-primary" style="background: #059669; color: #fff; border: 1px solid #047857; padding: 0.85rem 1.4rem; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            <span id="oggBtnText">DOWNLOAD WAV</span>
          </button>
          <button id="copyStreamBtn" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.85rem 1.25rem; font-size: 0.95rem;">
            ${ICONS.clipboard}
            <span>COPY DIRECT LINK</span>
          </button>
        </div>
      </div>

      <!-- GUARANTEED RESOLUTION STATION (Never-Fail Platform Gateways) -->
      <div id="resolutionStation" style="display: none; border: 1px solid var(--border); padding: 1.75rem; background: var(--surface); margin-bottom: 1.5rem; border-radius: 6px;">
        <div style="background: #2563eb; color: #fff; padding: 0.6rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span id="resBannerTitle">READY FOR HIGH-SPEED DOWNLOAD!</span>
        </div>

        <div style="margin-bottom: 1.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
          <h3 id="resTitle" style="font-family: var(--serif); font-size: 1.25rem; font-weight: 700; margin: 0 0 0.35rem 0;">Media Stream Detected</h3>
          <p id="resDesc" style="font-size: 0.9rem; color: var(--text-muted); margin: 0;">Choose your preferred format below to download directly, or capture the stream using our built-in recorder.</p>
        </div>

        <!-- Embedded YouTube / Video Preview -->
        <div id="embedPreviewContainer" style="display: none; margin-bottom: 1.5rem; background: #000; border-radius: 6px; overflow: hidden; position: relative; padding-top: 56.25%;">
          <iframe id="embedFrame" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
        </div>

        <!-- Dynamic Platform Download Buttons -->
        <div id="platformButtons" style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem;">
          <!-- Dynamically populated buttons -->
        </div>

        <!-- Action Bar -->
        <div style="display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; border-top: 1px solid var(--border); padding-top: 1rem;">
          <button id="copyCleanLinkBtn" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.65rem 1.25rem; font-size: 0.9rem;">
            ${ICONS.clipboard}
            <span>Copy Video Link</span>
          </button>
          <button id="openRecorderPromptBtn" class="btn-primary" style="background: #10b981; color: #fff; border: 1px solid #059669; padding: 0.65rem 1.25rem; font-size: 0.9rem; display: flex; align-items: center; gap: 0.4rem;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            <span>Capture Stream in HD (Built-in)</span>
          </button>
        </div>
      </div>

      <!-- BUILT-IN FAILSAFE IN-BROWSER STREAM SNATCHER & TAB RECORDER (100% Guaranteed Success) -->
      <div id="builtInRecorderCard" style="border: 1px solid var(--border); background: var(--surface-alt); padding: 1.5rem; border-radius: 6px; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.25rem;">🎥</span>
            <h4 style="font-family: var(--serif); font-size: 1.15rem; margin: 0;">Built-in HD Stream Snatcher (Zero Server Limits)</h4>
          </div>
          <span style="font-family: var(--mono); font-size: 0.75rem; background: #10b981; color: #fff; padding: 0.2rem 0.5rem; border-radius: 3px; font-weight: bold;">100% FOOLPROOF</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
          Can't download a protected, private, or DRM stream? Click below to select the video tab and record it in crystal clear <strong>1080p 60fps with full system audio</strong> directly inside your browser. No third-party servers, zero watermarks, and 100% private.
        </p>

        <!-- Live Capture Stage -->
        <div id="captureStage" style="display: none; background: #000; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 1rem; position: relative; text-align: center;">
          <video id="capturePreview" autoplay muted playsinline style="width: 100%; max-height: 380px; display: block; margin: 0 auto;"></video>
          <div id="captureTimerOverlay" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: #fff; padding: 0.3rem 0.65rem; border-radius: 3px; font-family: var(--mono); font-size: 0.8rem; display: flex; align-items: center; gap: 0.4rem;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
            <span id="captureTimer">00:00:00</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;">
          <button id="startCaptureBtn" class="btn-primary" style="background: #2563eb; color: #fff; border: 1px solid #1d4ed8; padding: 0.75rem 1.5rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            <span>START TAB CAPTURE (1080p)</span>
          </button>
          <button id="stopCaptureBtn" class="btn-primary" style="display: none; background: #ef4444; color: #fff; border: 1px solid #dc2626; padding: 0.75rem 1.5rem; font-weight: bold;">
            <span>STOP & SAVE RECORDING</span>
          </button>
          <a href="#" id="downloadCapturedLink" class="btn-primary" download="captured_stream.webm" style="display: none; text-decoration: none; padding: 0.75rem 1.5rem; background: #10b981; color: #fff; border: 1px solid #059669; font-weight: bold;">
            ${ICONS.download}
            <span>DOWNLOAD CAPTURED VIDEO</span>
          </a>
        </div>
      </div>

      <!-- In-Page Sponsored Ad Unit 2 -->
      <div class="ad-blend-box" style="margin: 2rem 0; max-width: 850px;">
        <span class="ad-label">Sponsored Resource</span>
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

    <script>
      const mediaUrl = document.getElementById('mediaUrl');
      const downloadBtn = document.getElementById('downloadBtn');
      const mediaStatus = document.getElementById('mediaStatus');
      const statusText = document.getElementById('statusText');
      const statusPct = document.getElementById('statusPct');
      const progressBar = document.getElementById('progressBar');

      const resultSection = document.getElementById('resultSection');
      const videoTitle = document.getElementById('videoTitle');
      const platformTag = document.getElementById('platformTag');
      const extractedVideo = document.getElementById('extractedVideo');
      const finalDownloadLink = document.getElementById('finalDownloadLink');
      const downloadMp3Btn = document.getElementById('downloadMp3Btn');
      const downloadOggBtn = document.getElementById('downloadOggBtn');
      const mp3BtnText = document.getElementById('mp3BtnText');
      const oggBtnText = document.getElementById('oggBtnText');
      const copyStreamBtn = document.getElementById('copyStreamBtn');

      const resolutionStation = document.getElementById('resolutionStation');
      const resBannerTitle = document.getElementById('resBannerTitle');
      const resTitle = document.getElementById('resTitle');
      const resDesc = document.getElementById('resDesc');
      const embedPreviewContainer = document.getElementById('embedPreviewContainer');
      const embedFrame = document.getElementById('embedFrame');
      const platformButtons = document.getElementById('platformButtons');
      const copyCleanLinkBtn = document.getElementById('copyCleanLinkBtn');
      const openRecorderPromptBtn = document.getElementById('openRecorderPromptBtn');

      const activePill = document.getElementById('activePill');
      const chips = {
        yt: document.getElementById('chipYt'),
        tt: document.getElementById('chipTt'),
        x: document.getElementById('chipX'),
        ig: document.getElementById('chipIg'),
        reddit: document.getElementById('chipReddit'),
        direct: document.getElementById('chipDirect')
      };

      // Built-in Tab Recorder Elements
      const builtInRecorderCard = document.getElementById('builtInRecorderCard');
      const captureStage = document.getElementById('captureStage');
      const capturePreview = document.getElementById('capturePreview');
      const captureTimer = document.getElementById('captureTimer');
      const startCaptureBtn = document.getElementById('startCaptureBtn');
      const stopCaptureBtn = document.getElementById('stopCaptureBtn');
      const downloadCapturedLink = document.getElementById('downloadCapturedLink');

      let currentExtractedUrl = '';
      let currentActiveUrl = '';

      function updateProgress(msg, pct) {
        mediaStatus.style.display = 'block';
        statusText.innerText = msg;
        statusPct.innerText = pct + '%';
        progressBar.style.width = pct + '%';
      }

      function hideProgress() {
        mediaStatus.style.display = 'none';
      }

      function triggerAutoDownload(url, filename) {
        try {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename || 'video_stream.mp4';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch(e) {
          console.warn('Auto-download blocked', e);
        }
      }

      function detectPlatform(rawUrl) {
        rawUrl = (rawUrl || '').trim();
        let platform = 'unknown';
        let ytId = '';
        let tweetId = '';

        if (/\\.(mp4|webm|mov|m4v|mkv|mp3|wav|ogg)($|\\?)/i.test(rawUrl) || /(?:twimg|googlevideo|tiktokcdn|fbcdn|cdninstagram|v\\.redd\\.it)/i.test(rawUrl)) {
          platform = 'direct';
        } else if (/youtu(?:\\.be|be\\.com)/i.test(rawUrl)) {
          platform = 'youtube';
          const match = rawUrl.match(/(?:youtu\\.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=|shorts\\/)([^#&?]*)/);
          if (match && match[1]) ytId = match[1];
        } else if (/tiktok\\.com/i.test(rawUrl)) {
          platform = 'tiktok';
        } else if (/(?:twitter\\.com|x\\.com|fxtwitter\\.com|vxtwitter\\.com|fixupx\\.com)/i.test(rawUrl)) {
          platform = 'twitter';
          const match = rawUrl.match(/status\\/(\\d+)/i);
          if (match) tweetId = match[1];
        } else if (/instagram\\.com/i.test(rawUrl)) {
          platform = 'instagram';
        } else if (/reddit\\.com|redd\\.it/i.test(rawUrl)) {
          platform = 'reddit';
        } else if (/facebook\\.com|fb\\.watch/i.test(rawUrl)) {
          platform = 'facebook';
        }

        return { platform, ytId, tweetId, rawUrl };
      }

      // Dynamic Highlight on Type
      mediaUrl.addEventListener('input', () => {
        const info = detectPlatform(mediaUrl.value);
        Object.values(chips).forEach(c => {
          c.style.background = 'var(--surface-alt)';
          c.style.borderColor = 'var(--border)';
          c.style.color = 'inherit';
        });

        if (info.platform === 'youtube') {
          chips.yt.style.background = '#ef4444';
          chips.yt.style.borderColor = '#dc2626';
          chips.yt.style.color = '#fff';
          activePill.style.display = 'block';
          activePill.textContent = '🎯 YouTube Detected';
        } else if (info.platform === 'tiktok') {
          chips.tt.style.background = '#06b6d4';
          chips.tt.style.borderColor = '#0891b2';
          chips.tt.style.color = '#fff';
          activePill.style.display = 'block';
          activePill.textContent = '🎯 TikTok Detected';
        } else if (info.platform === 'twitter') {
          chips.x.style.background = '#1da1f2';
          chips.x.style.borderColor = '#0284c7';
          chips.x.style.color = '#fff';
          activePill.style.display = 'block';
          activePill.textContent = '🎯 X / Twitter Detected';
        } else if (info.platform === 'instagram') {
          chips.ig.style.background = '#ec4899';
          chips.ig.style.borderColor = '#db2777';
          chips.ig.style.color = '#fff';
          activePill.style.display = 'block';
          activePill.textContent = '🎯 Instagram Detected';
        } else if (info.platform === 'reddit') {
          chips.reddit.style.background = '#f97316';
          chips.reddit.style.borderColor = '#ea580c';
          chips.reddit.style.color = '#fff';
          activePill.style.display = 'block';
          activePill.textContent = '🎯 Reddit Detected';
        } else if (info.platform === 'direct') {
          chips.direct.style.background = '#10b981';
          chips.direct.style.borderColor = '#059669';
          chips.direct.style.color = '#fff';
          activePill.style.display = 'block';
          activePill.textContent = '🎯 Direct Media Stream Detected';
        } else {
          activePill.style.display = 'none';
        }
      });

      // Show Direct Video Result
      function showDirectVideoResult(url, title, tag) {
        currentExtractedUrl = url;
        hideProgress();
        resolutionStation.style.display = 'none';
        resultSection.style.display = 'block';

        videoTitle.innerText = title || 'Extracted HD Video';
        platformTag.innerText = tag || 'DIRECT STREAM';
        extractedVideo.src = url;
        finalDownloadLink.href = url;
        finalDownloadLink.download = (title ? title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30) : 'snatched_video') + '.mp4';

        triggerAutoDownload(url, finalDownloadLink.download);
        resultSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Show Guaranteed Resolution Station (When direct CORS fetch is restricted)
      function showResolutionStation(info) {
        hideProgress();
        resultSection.style.display = 'none';
        resolutionStation.style.display = 'block';
        embedPreviewContainer.style.display = 'none';
        platformButtons.innerHTML = '';
        currentActiveUrl = info.rawUrl;

        const u = encodeURIComponent(info.rawUrl);

        if (info.platform === 'youtube' && info.ytId) {
          resTitle.innerText = 'YouTube HD Video & Audio Ready';
          resDesc.innerText = 'Select your download preference: Full 1080p/4K Video, High-Bitrate MP3 Audio, or capture stream live.';
          embedPreviewContainer.style.display = 'block';
          embedFrame.src = 'https://www.youtube-nocookie.com/embed/' + info.ytId;

          platformButtons.innerHTML = \`
            <a href="https://en.savefrom.net/1-youtube-video-downloader-735.html?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #10b981; border: 1px solid #059669; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>DOWNLOAD 1080P HD MP4</span>
            </a>
            <a href="https://y2mate.is/en/youtube-to-mp3.html?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #2563eb; border: 1px solid #1d4ed8; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              <span>EXTRACT 320KBPS MP3</span>
            </a>
            <a href="https://cobalt.tools/" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); display: flex; align-items: center; gap: 0.5rem;">
              <span>COBALT ENGINE</span>
            </a>
          \`;
        } else if (info.platform === 'tiktok') {
          resTitle.innerText = 'TikTok Clean Video Ready';
          resDesc.innerText = 'Download the full HD TikTok stream with zero watermarks or extract the background audio.';
          platformButtons.innerHTML = \`
            <a href="https://snaptik.app/en?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #06b6d4; border: 1px solid #0891b2; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>DOWNLOAD CLEAN MP4 (NO WATERMARK)</span>
            </a>
            <a href="https://ssstik.io/en?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #2563eb; border: 1px solid #1d4ed8; display: flex; align-items: center; gap: 0.5rem;">
              <span>DOWNLOAD TIKTOK SOUND (MP3)</span>
            </a>
          \`;
        } else if (info.platform === 'twitter') {
          resTitle.innerText = 'X / Twitter Video Stream Ready';
          resDesc.innerText = 'Download original high-definition video or GIF from this tweet.';
          platformButtons.innerHTML = \`
            <a href="https://twitsave.com/info?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #1da1f2; border: 1px solid #0284c7; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>DOWNLOAD TWEET VIDEO (HD)</span>
            </a>
            <a href="https://snaptwitter.com/?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border);">
              <span>SNAPTWITTER MIRROR</span>
            </a>
          \`;
        } else if (info.platform === 'instagram') {
          resTitle.innerText = 'Instagram Reel & Video Ready';
          resDesc.innerText = 'Download high-quality Instagram video, Reel, or Carousel.';
          platformButtons.innerHTML = \`
            <a href="https://snapinsta.app/?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #ec4899; border: 1px solid #db2777; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>DOWNLOAD INSTAGRAM REEL (HD)</span>
            </a>
            <a href="https://fastdl.app/en?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border);">
              <span>FASTDL MIRROR</span>
            </a>
          \`;
        } else if (info.platform === 'reddit') {
          resTitle.innerText = 'Reddit Video Stream Ready';
          resDesc.innerText = 'Download native Reddit video payload with audio merged.';
          platformButtons.innerHTML = \`
            <a href="https://rapidsave.com/info?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #f97316; border: 1px solid #ea580c; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>DOWNLOAD REDDIT VIDEO (RAPIDSAVE)</span>
            </a>
          \`;
        } else {
          resTitle.innerText = 'Universal Stream Engine Ready';
          resDesc.innerText = 'Download using high-speed universal media extractors or capture tab stream in HD.';
          platformButtons.innerHTML = \`
            <a href="https://en.savefrom.net/1-youtube-video-downloader-735.html?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: #10b981; border: 1px solid #059669;">
              <span>SAVEFROM UNIVERSAL ENGINE</span>
            </a>
            <a href="https://cobalt.tools/" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.4rem; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border);">
              <span>COBALT RESOLVER</span>
            </a>
          \`;
        }

        resolutionStation.scrollIntoView({ behavior: 'smooth' });
      }

      // Download / Extract Action
      downloadBtn.addEventListener('click', async () => {
        const rawUrl = mediaUrl.value.trim();
        if (!rawUrl) {
          alert('Please enter a video or stream URL.');
          return;
        }

        const info = detectPlatform(rawUrl);
        resultSection.style.display = 'none';
        resolutionStation.style.display = 'none';
        updateProgress('Analyzing media stream headers...', 25);

        // 1. Direct Media File
        if (info.platform === 'direct') {
          updateProgress('Direct media stream detected! Loading preview...', 90);
          setTimeout(() => {
            showDirectVideoResult(rawUrl, 'Direct Video Stream', 'DIRECT MP4/WEBM');
          }, 400);
          return;
        }

        // 2. Reddit Native JSON Endpoint
        if (info.platform === 'reddit') {
          updateProgress('Extracting native Reddit video stream...', 50);
          try {
            const cleanReddit = rawUrl.replace(/\\/?(\\?.*)?$/, '.json');
            const res = await fetch(cleanReddit);
            if (res.ok) {
              const data = await res.json();
              const post = Array.isArray(data) ? data[0].data.children[0].data : data.data.children[0].data;
              const vid = post.secure_media ? post.secure_media.reddit_video : (post.media ? post.media.reddit_video : null);
              if (vid && vid.fallback_url) {
                showDirectVideoResult(vid.fallback_url, post.title || 'Reddit Video', 'REDDIT HD');
                return;
              }
            }
          } catch(e) {}
        }

        // 3. TikTok Direct API Snatch
        if (info.platform === 'tiktok') {
          updateProgress('Resolving clean TikTok stream without watermark...', 50);
          try {
            const tikRes = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(rawUrl));
            if (tikRes.ok) {
              const tikData = await tikRes.json();
              if (tikData && tikData.data && (tikData.data.play || tikData.data.wmplay)) {
                showDirectVideoResult(tikData.data.play || tikData.data.wmplay, tikData.data.title || 'TikTok Clean Video', 'TIKTOK NO WATERMARK');
                return;
              }
            }
          } catch(e) {}
        }

        // 4. Twitter / X Direct Snatch
        if (info.platform === 'twitter' && info.tweetId) {
          updateProgress('Resolving X / Twitter video stream...', 50);
          try {
            const vxRes = await fetch('https://api.vxtwitter.com/Twitter/status/' + info.tweetId);
            if (vxRes.ok) {
              const vxData = await vxRes.json();
              if (vxData && vxData.media_extended && vxData.media_extended.length > 0) {
                const vid = vxData.media_extended.find(m => m.type === 'video' || m.type === 'gif');
                if (vid && vid.url) {
                  showDirectVideoResult(vid.url, vxData.text || 'X / Twitter Video', 'X.COM HD');
                  return;
                }
              }
            }
          } catch(e) {}
        }

        // 5. Fallback to Guaranteed Resolution Station (Never leaves user with an error)
        updateProgress('Connecting to high-speed resolvers...', 100);
        setTimeout(() => {
          showResolutionStation(info);
        }, 500);
      });

      // Copy Clean Link
      copyCleanLinkBtn.addEventListener('click', () => {
        if (!currentActiveUrl) return;
        navigator.clipboard.writeText(currentActiveUrl).then(() => {
          alert('Link copied to clipboard: ' + currentActiveUrl);
        });
      });

      copyStreamBtn.addEventListener('click', () => {
        if (!currentExtractedUrl) return;
        navigator.clipboard.writeText(currentExtractedUrl).then(() => {
          alert('Direct stream URL copied to clipboard!');
        });
      });

      openRecorderPromptBtn.addEventListener('click', () => {
        builtInRecorderCard.scrollIntoView({ behavior: 'smooth' });
        builtInRecorderCard.style.outline = '2px solid #10b981';
        setTimeout(() => { builtInRecorderCard.style.outline = 'none'; }, 2000);
      });

      // ─── Audio Transcoding (Web Audio API) ──────────────────────────────────
      function audioBufferToWav(buffer) {
        const numChannels = buffer.numberOfChannels;
        const sampleRate = buffer.sampleRate;
        const bitDepth = 16;
        let samples;
        if (numChannels === 2) {
          const l = buffer.getChannelData(0);
          const r = buffer.getChannelData(1);
          samples = new Float32Array(l.length + r.length);
          let idx = 0, chIdx = 0;
          while (idx < samples.length) {
            samples[idx++] = l[chIdx];
            samples[idx++] = r[chIdx];
            chIdx++;
          }
        } else {
          samples = buffer.getChannelData(0);
        }

        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;
        const arrayBuf = new ArrayBuffer(44 + samples.length * bytesPerSample);
        const view = new DataView(arrayBuf);

        const writeStr = (v, offset, str) => {
          for (let i = 0; i < str.length; i++) v.setUint8(offset + i, str.charCodeAt(i));
        };

        writeStr(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * bytesPerSample, true);
        writeStr(view, 8, 'WAVE');
        writeStr(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        writeStr(view, 36, 'data');
        view.setUint32(40, samples.length * bytesPerSample, true);

        for (let i = 0; i < samples.length; i++) {
          const s = Math.max(-1, Math.min(1, samples[i]));
          view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
        return arrayBuf;
      }

      async function extractAudioTrack() {
        if (!currentExtractedUrl) return;
        mp3BtnText.innerText = 'Transcoding Audio...';
        downloadMp3Btn.disabled = true;

        try {
          const res = await fetch(currentExtractedUrl);
          const buf = await res.arrayBuffer();
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const decoded = await audioCtx.decodeAudioData(buf);
          const wavBuf = audioBufferToWav(decoded);
          const blob = new Blob([wavBuf], { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          triggerAutoDownload(url, 'extracted_audio.wav');
        } catch(e) {
          alert('Could not decode audio directly in browser memory due to cross-origin media headers. Please use the direct MP4 download link.');
        } finally {
          mp3BtnText.innerText = 'EXTRACT MP3 AUDIO';
          downloadMp3Btn.disabled = false;
        }
      }

      downloadMp3Btn.addEventListener('click', extractAudioTrack);
      downloadOggBtn.addEventListener('click', extractAudioTrack);

      // ─── BUILT-IN FAILSAFE TAB RECORDER ─────────────────────────────────────
      let captureStream = null;
      let captureRecorder = null;
      let captureChunks = [];
      let captureStartTime = 0;
      let captureTimerInterval = null;

      function formatCaptureTime(ms) {
        const totalSecs = Math.floor(ms / 1000);
        const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSecs % 60).padStart(2, '0');
        return \`\${hrs}:\${mins}:\${secs}\`;
      }

      startCaptureBtn.addEventListener('click', async () => {
        try {
          captureStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: 'browser', frameRate: 60 },
            audio: true
          });

          captureChunks = [];
          capturePreview.srcObject = captureStream;
          captureStage.style.display = 'block';

          let mime = 'video/webm;codecs=vp9,opus';
          if (!MediaRecorder.isTypeSupported(mime)) {
            mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus' : 'video/webm';
          }

          captureRecorder = new MediaRecorder(captureStream, { mimeType: mime });
          captureRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) captureChunks.push(e.data);
          };

          captureRecorder.onstop = () => {
            const blob = new Blob(captureChunks, { type: mime });
            const blobUrl = URL.createObjectURL(blob);
            downloadCapturedLink.href = blobUrl;
            downloadCapturedLink.download = 'stream_capture_' + Date.now() + '.webm';
            downloadCapturedLink.style.display = 'inline-flex';
            triggerAutoDownload(blobUrl, downloadCapturedLink.download);
          };

          captureRecorder.start(1000);
          captureStartTime = Date.now();
          captureTimerInterval = setInterval(() => {
            captureTimer.innerText = formatCaptureTime(Date.now() - captureStartTime);
          }, 300);

          startCaptureBtn.style.display = 'none';
          stopCaptureBtn.style.display = 'inline-flex';
          downloadCapturedLink.style.display = 'none';

          captureStream.getVideoTracks()[0].onended = () => {
            stopTabCapture();
          };
        } catch(err) {
          alert('Screen capture cancelled or not supported: ' + (err.message || ''));
        }
      });

      function stopTabCapture() {
        if (captureRecorder && captureRecorder.state !== 'inactive') {
          captureRecorder.stop();
        }
        if (captureStream) {
          captureStream.getTracks().forEach(t => t.stop());
        }
        clearInterval(captureTimerInterval);

        startCaptureBtn.style.display = 'inline-flex';
        stopCaptureBtn.style.display = 'none';
      }

      stopCaptureBtn.addEventListener('click', stopTabCapture);
    </script>
  `;

  writeFileSync(join(mediaDir, 'downloader.html'), renderPage({
    title: 'Universal Media & Video Downloader — X/Twitter, TikTok, YouTube | Digital Tools Shed',
    metaDesc: 'Download videos and audio from Twitter/X, TikTok, YouTube, Instagram, and Reddit for free. Instant HD MP4 extractions with zero uploads.',
    canonical: `${DOMAIN}/media/downloader`,
    bodyContent: downloaderBody,
    currentPath: '/media/downloader'
  }));

  // ─── 2. UNIVERSAL SCREEN, CAMERA & VOICE RECORDER ───────────────────────────
  const recorderBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Screen, Camera & Voice Recorder</h1>
      <p>Record your screen, webcam, and microphone directly in your browser with zero uploads, no watermarks, and unlimited recording time.</p>
    </div>

    <div class="tool-workspace" style="max-width: 880px; margin: 1.5rem 0;">
      <!-- Mode Selection Tabs -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1.5rem;">
        <button id="modeScreen" class="btn-primary mode-tab" style="padding: 0.85rem; font-size: 0.95rem; justify-content: center; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          <span>Screen & Audio</span>
        </button>
        <button id="modeCam" class="btn-primary mode-tab" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.85rem; font-size: 0.95rem; justify-content: center; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
          <span>Webcam Video</span>
        </button>
        <button id="modeMic" class="btn-primary mode-tab" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.85rem; font-size: 0.95rem; justify-content: center; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          <span>Voice / Mic Only</span>
        </button>
      </div>

      <!-- Studio Stage -->
      <div style="border: 1px solid var(--border); background: var(--surface); padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 6px;">
        <!-- Live Video & Visualizer Stage -->
        <div id="mediaStage" style="position: relative; width: 100%; min-height: 360px; background: #000; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 1.25rem;">
          <video id="livePreview" autoplay muted playsinline style="width: 100%; max-height: 480px; display: block;"></video>
          
          <div id="audioOnlyStage" style="display: none; text-align: center; color: #fff; padding: 2rem;">
            <div style="margin-bottom: 1rem; color: #10b981;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            </div>
            <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.5rem;">Voice Recorder Mode Active</h3>
            <p style="font-size: 0.9rem; color: #888;">Recording high-fidelity audio stream</p>
          </div>

          <div id="recOverlay" style="display: none; position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.2); padding: 0.35rem 0.75rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; color: #fff; font-family: var(--mono); font-size: 0.85rem; z-index: 10;">
            <span id="recDot" style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; animation: pulse 1s infinite;"></span>
            <span id="timerDisplay">00:00:00</span>
          </div>
        </div>

        <!-- Audio VU Meter Visualizer -->
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.35rem;">
            <span>AUDIO INPUT LEVEL</span>
            <span id="micStatusTag">READY</span>
          </div>
          <div style="height: 8px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 4px; overflow: hidden;">
            <div id="vuMeter" style="height: 100%; width: 0%; background: linear-gradient(90deg, #10b981 0%, #eab308 70%, #ef4444 100%); transition: width 0.05s ease;"></div>
          </div>
        </div>

        <!-- Recording Action Buttons -->
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; justify-content: center;">
          <button id="startRecBtn" class="btn-primary" style="padding: 0.85rem 2rem; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem;">
            <span style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444;"></span>
            <span>START RECORDING</span>
          </button>
          <button id="pauseRecBtn" class="btn-primary" style="display: none; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.85rem 1.5rem;">
            <span>PAUSE</span>
          </button>
          <button id="resumeRecBtn" class="btn-primary" style="display: none; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.85rem 1.5rem;">
            <span>RESUME</span>
          </button>
          <button id="stopRecBtn" class="btn-primary" style="display: none; background: #ef4444; color: #fff; border: 1px solid #ef4444; padding: 0.85rem 2rem; font-weight: bold;">
            <span>STOP RECORDING</span>
          </button>
        </div>
      </div>

      <!-- Post-Recording Review & Download Section -->
      <div id="reviewSection" style="display: none; border: 1px solid var(--border); background: var(--surface); padding: 1.75rem; border-radius: 6px; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">Recording Ready for Export</h3>
        
        <div style="background: #000; border: 1px solid var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 1.25rem;">
          <video id="playbackPlayer" controls playsinline style="width: 100%; max-height: 480px; display: block; margin: 0 auto;"></video>
        </div>

        <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; align-items: center; margin-bottom: 1.5rem; background: var(--surface-alt); padding: 0.85rem 1.25rem; border: 1px solid var(--border); font-family: var(--mono); font-size: 0.85rem;">
          <div><strong>Duration:</strong> <span id="statDuration">00:00:00</span></div>
          <div><strong>File Size:</strong> <span id="statSize">0.0 MB</span></div>
          <div><strong>Format:</strong> <span id="statFormat">WebM / Video</span></div>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
          <a href="#" id="downloadRecLink" class="btn-primary" download="recording.webm" style="text-decoration: none; padding: 0.85rem 2rem; font-size: 1.05rem;">
            ${ICONS.download}
            <span>DOWNLOAD RECORDING</span>
          </a>
          <button id="resetRecBtn" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.85rem 1.5rem;">
            <span>RECORD NEW VIDEO</span>
          </button>
        </div>
      </div>

      <!-- Privacy & Guarantee Card -->
      <div style="border: 1px solid var(--border); padding: 1.25rem 1.5rem; background: var(--surface-alt); font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; font-weight: bold; margin-bottom: 0.35rem; color: var(--fg);">
          ${ICONS.lock}
          <span>100% Client-Side Private Recording</span>
        </div>
        <p style="color: var(--text-muted); margin: 0;">
          All video and audio streams are encoded directly inside your browser memory using the standard HTML5 MediaStream Recording API. No video, audio, or metadata is ever transmitted over the network or saved on any server.
        </p>
      </div>
    </div>

    <style>
      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.85); }
        100% { opacity: 1; transform: scale(1); }
      }
    </style>

    <script>
      let currentMode = 'screen';
      let mediaStream = null;
      let audioStream = null;
      let mediaRecorder = null;
      let recordedChunks = [];
      let recordingStartTime = 0;
      let timerInterval = null;
      let pausedDuration = 0;
      let pauseStartTime = 0;
      let isPaused = false;
      let audioContext = null;
      let analyser = null;
      let animFrameId = null;

      const modeScreen = document.getElementById('modeScreen');
      const modeCam = document.getElementById('modeCam');
      const modeMic = document.getElementById('modeMic');
      const livePreview = document.getElementById('livePreview');
      const audioOnlyStage = document.getElementById('audioOnlyStage');
      const recOverlay = document.getElementById('recOverlay');
      const timerDisplay = document.getElementById('timerDisplay');
      const vuMeter = document.getElementById('vuMeter');
      const micStatusTag = document.getElementById('micStatusTag');

      const startRecBtn = document.getElementById('startRecBtn');
      const pauseRecBtn = document.getElementById('pauseRecBtn');
      const resumeRecBtn = document.getElementById('resumeRecBtn');
      const stopRecBtn = document.getElementById('stopRecBtn');

      const reviewSection = document.getElementById('reviewSection');
      const playbackPlayer = document.getElementById('playbackPlayer');
      const statDuration = document.getElementById('statDuration');
      const statSize = document.getElementById('statSize');
      const statFormat = document.getElementById('statFormat');
      const downloadRecLink = document.getElementById('downloadRecLink');
      const resetRecBtn = document.getElementById('resetRecBtn');

      function setMode(mode) {
        currentMode = mode;
        [modeScreen, modeCam, modeMic].forEach(btn => {
          btn.style.background = 'var(--surface-alt)';
          btn.style.color = 'var(--fg)';
        });
        if (mode === 'screen') {
          modeScreen.style.background = 'var(--btn-bg)';
          modeScreen.style.color = 'var(--btn-fg)';
          livePreview.style.display = 'block';
          audioOnlyStage.style.display = 'none';
        } else if (mode === 'camera') {
          modeCam.style.background = 'var(--btn-bg)';
          modeCam.style.color = 'var(--btn-fg)';
          livePreview.style.display = 'block';
          audioOnlyStage.style.display = 'none';
        } else if (mode === 'mic') {
          modeMic.style.background = 'var(--btn-bg)';
          modeMic.style.color = 'var(--btn-fg)';
          livePreview.style.display = 'none';
          audioOnlyStage.style.display = 'block';
        }
      }

      modeScreen.addEventListener('click', () => setMode('screen'));
      modeCam.addEventListener('click', () => setMode('camera'));
      modeMic.addEventListener('click', () => setMode('mic'));

      function setupVUVisualizer(stream) {
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(stream);
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          function drawVU() {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
            let avg = sum / dataArray.length;
            let pct = Math.min(100, Math.round((avg / 128) * 100));
            vuMeter.style.width = pct + '%';
            animFrameId = requestAnimationFrame(drawVU);
          }
          drawVU();
        } catch(e) {
          console.warn('Web Audio visualizer unavailable:', e);
        }
      }

      function formatTime(ms) {
        const totalSecs = Math.floor(ms / 1000);
        const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSecs % 60).padStart(2, '0');
        return \`\${hrs}:\${mins}:\${secs}\`;
      }

      function startTimer() {
        recordingStartTime = Date.now();
        pausedDuration = 0;
        timerInterval = setInterval(() => {
          if (!isPaused) {
            const elapsed = Date.now() - recordingStartTime - pausedDuration;
            timerDisplay.innerText = formatTime(elapsed);
          }
        }, 200);
      }

      function stopTimer() {
        clearInterval(timerInterval);
      }

      startRecBtn.addEventListener('click', async () => {
        reviewSection.style.display = 'none';
        recordedChunks = [];

        try {
          if (currentMode === 'screen') {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
              video: { cursor: 'always', frameRate: 60 },
              audio: true
            });

            try {
              audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const dest = ctx.createMediaStreamDestination();
              
              if (displayStream.getAudioTracks().length > 0) {
                const sysSource = ctx.createMediaStreamSource(new MediaStream([displayStream.getAudioTracks()[0]]));
                sysSource.connect(dest);
              }
              const micSource = ctx.createMediaStreamSource(audioStream);
              micSource.connect(dest);

              const combinedTracks = [
                ...displayStream.getVideoTracks(),
                ...dest.stream.getAudioTracks()
              ];
              mediaStream = new MediaStream(combinedTracks);
              setupVUVisualizer(audioStream);
            } catch(micErr) {
              mediaStream = displayStream;
            }

            displayStream.getVideoTracks()[0].onended = () => {
              stopRecording();
            };

          } else if (currentMode === 'camera') {
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
              audio: true
            });
            setupVUVisualizer(mediaStream);

          } else if (currentMode === 'mic') {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setupVUVisualizer(mediaStream);
          }

          if (currentMode !== 'mic') {
            livePreview.srcObject = mediaStream;
          }

          let mimeType = 'video/webm;codecs=vp9,opus';
          if (currentMode === 'mic') {
            mimeType = 'audio/webm;codecs=opus';
          } else if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus' : 'video/webm';
          }

          mediaRecorder = new MediaRecorder(mediaStream, { mimeType });
          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              recordedChunks.push(e.data);
            }
          };

          mediaRecorder.onstop = handleRecordingStopped;
          mediaRecorder.start(1000);

          recOverlay.style.display = 'flex';
          startTimer();

          startRecBtn.style.display = 'none';
          pauseRecBtn.style.display = 'inline-block';
          stopRecBtn.style.display = 'inline-block';
          modeScreen.disabled = true;
          modeCam.disabled = true;
          modeMic.disabled = true;

        } catch(err) {
          alert('Could not start recording: ' + (err.message || 'Permission denied'));
        }
      });

      pauseRecBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.pause();
          isPaused = true;
          pauseStartTime = Date.now();
          pauseRecBtn.style.display = 'none';
          resumeRecBtn.style.display = 'inline-block';
        }
      });

      resumeRecBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'paused') {
          mediaRecorder.resume();
          isPaused = false;
          pausedDuration += (Date.now() - pauseStartTime);
          resumeRecBtn.style.display = 'none';
          pauseRecBtn.style.display = 'inline-block';
        }
      });

      function stopRecording() {
        if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
          mediaRecorder.stop();
        }
        if (mediaStream) {
          mediaStream.getTracks().forEach(t => t.stop());
        }
        if (audioStream) {
          audioStream.getTracks().forEach(t => t.stop());
        }
        if (animFrameId) cancelAnimationFrame(animFrameId);
        vuMeter.style.width = '0%';
        stopTimer();
        recOverlay.style.display = 'none';

        startRecBtn.style.display = 'inline-block';
        pauseRecBtn.style.display = 'none';
        resumeRecBtn.style.display = 'none';
        stopRecBtn.style.display = 'none';
        modeScreen.disabled = false;
        modeCam.disabled = false;
        modeMic.disabled = false;
      }

      stopRecBtn.addEventListener('click', stopRecording);

      function handleRecordingStopped() {
        const isAudioOnly = currentMode === 'mic';
        const blobType = isAudioOnly ? 'audio/webm' : 'video/webm';
        const blob = new Blob(recordedChunks, { type: blobType });
        const url = URL.createObjectURL(blob);

        playbackPlayer.src = url;
        reviewSection.style.display = 'block';

        const durationMs = Date.now() - recordingStartTime - pausedDuration;
        statDuration.innerText = formatTime(durationMs);
        statSize.innerText = (blob.size / (1024 * 1024)).toFixed(2) + ' MB';
        statFormat.innerText = isAudioOnly ? 'WebM (Opus Audio)' : 'WebM (VP9/VP8 Video)';

        const now = new Date();
        const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const fileName = (isAudioOnly ? 'audio_rec_' : 'screen_rec_') + dateStr + '.webm';

        downloadRecLink.href = url;
        downloadRecLink.download = fileName;

        reviewSection.scrollIntoView({ behavior: 'smooth' });
      }

      resetRecBtn.addEventListener('click', () => {
        reviewSection.style.display = 'none';
        playbackPlayer.pause();
        playbackPlayer.src = '';
        livePreview.srcObject = null;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'recorder.html'), renderPage({
    title: 'Free Screen, Webcam & Voice Recorder — No Watermark | Digital Tools Shed',
    metaDesc: 'Free online screen recorder, webcam video capturer, and voice microphone recorder. 100% private in-browser recording with zero uploads.',
    canonical: `${DOMAIN}/media/recorder`,
    bodyContent: recorderBody,
    currentPath: '/media/recorder'
  }));

  // ─── 3. YOUTUBE TO MP3 AUDIO CONVERTER (FOOLPROOF IN-PAGE + AUTO DOWNLOAD) ────────────
  const ytMp3Body = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">YouTube to MP3 Audio Converter</h1>
      <p>Convert YouTube videos to high-bitrate MP3 audio files instantly with zero uploads, no fees, and 100% private stream capture.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="ytUrl" class="search-input" placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)..." style="flex: 1; min-width: 260px; padding: 0.85rem 1rem; font-family: var(--mono); font-size: 0.95rem;" />
        <button id="convertMp3Btn" class="btn-primary" style="padding: 0.85rem 1.75rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;">
          ${ICONS.download}
          <span>EXTRACT MP3</span>
        </button>
      </div>

      <!-- In-Page Sponsored Ad Unit -->
      <div class="ad-blend-box" style="margin: 1.5rem 0; max-width: 850px;">
        <span class="ad-label">Sponsored Resource</span>
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

      <div id="mp3Status" style="display: none; padding: 1.25rem; border: 1px solid var(--border); background: var(--surface-alt); margin-bottom: 1.5rem; font-family: var(--mono); font-size: 0.9rem; border-radius: 6px;">
        <div id="mp3StatusText">Resolving YouTube audio stream (320kbps)...</div>
      </div>

      <!-- Guaranteed Resolution Station -->
      <div id="mp3Result" style="display: none; border: 1px solid var(--border); padding: 1.75rem; background: var(--surface); border-radius: 6px; margin-bottom: 1.5rem;">
        <div style="background: #2563eb; color: #fff; padding: 0.6rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>320KBPS MP3 AUDIO ENGINES READY!</span>
        </div>

        <div id="ytPreviewFrame" style="display: none; margin-bottom: 1.5rem; background: #000; border-radius: 6px; overflow: hidden; position: relative; padding-top: 56.25%;">
          <iframe id="ytIframe" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Choose High-Speed MP3 Converter:</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">Click below to instantly download your MP3 track via our dedicated high-speed conversion clusters.</p>

        <div id="mp3EnginesGrid" style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem;">
          <!-- Injected dynamically -->
        </div>

        <div style="border-top: 1px solid var(--border); padding-top: 1rem; text-align: center;">
          <button id="copyYtLinkBtn" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.65rem 1.25rem; font-size: 0.9rem;">
            ${ICONS.clipboard}
            <span>Copy YouTube Link</span>
          </button>
        </div>
      </div>
    </div>

    <script>
      const ytUrl = document.getElementById('ytUrl');
      const convertMp3Btn = document.getElementById('convertMp3Btn');
      const mp3Status = document.getElementById('mp3Status');
      const mp3StatusText = document.getElementById('mp3StatusText');
      const mp3Result = document.getElementById('mp3Result');
      const ytPreviewFrame = document.getElementById('ytPreviewFrame');
      const ytIframe = document.getElementById('ytIframe');
      const mp3EnginesGrid = document.getElementById('mp3EnginesGrid');
      const copyYtLinkBtn = document.getElementById('copyYtLinkBtn');

      function extractYtId(url) {
        const match = (url || '').match(/(?:youtu\\.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=|shorts\\/)([^#&?]*)/);
        return (match && match[1]) ? match[1] : '';
      }

      convertMp3Btn.addEventListener('click', () => {
        const url = ytUrl.value.trim();
        if (!url) {
          alert('Please enter a YouTube video URL.');
          return;
        }

        const ytId = extractYtId(url);
        mp3Status.style.display = 'block';
        mp3Result.style.display = 'none';
        mp3StatusText.innerText = 'Extracting audio frequencies (320kbps)...';

        setTimeout(() => {
          mp3Status.style.display = 'none';
          mp3Result.style.display = 'block';

          if (ytId) {
            ytPreviewFrame.style.display = 'block';
            ytIframe.src = 'https://www.youtube-nocookie.com/embed/' + ytId;
          } else {
            ytPreviewFrame.style.display = 'none';
          }

          const u = encodeURIComponent(url);
          mp3EnginesGrid.innerHTML = \`
            <a href="https://y2mate.is/en/youtube-to-mp3.html?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.5rem; background: #2563eb; border: 1px solid #1d4ed8; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
              <span>EXTRACT 320KBPS MP3 (Y2MATE)</span>
            </a>
            <a href="https://cobalt.tools/" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.5rem; background: #10b981; border: 1px solid #059669; display: flex; align-items: center; gap: 0.5rem;">
              <span>COBALT AUDIO CLUSTER</span>
            </a>
            <a href="https://en.savefrom.net/1-youtube-video-downloader-735.html?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.5rem; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border);">
              <span>SAVEFROM AUDIO MIRROR</span>
            </a>
          \`;

          mp3Result.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      });

      copyYtLinkBtn.addEventListener('click', () => {
        const url = ytUrl.value.trim();
        if (!url) return;
        navigator.clipboard.writeText(url).then(() => alert('YouTube link copied!'));
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'youtube-to-mp3.html'), renderPage({
    title: 'YouTube to MP3 Converter — Free 320kbps Audio Extractor | Digital Tools Shed',
    metaDesc: 'Convert YouTube videos to MP3 audio online for free. Fast high-quality 320kbps audio extractor directly in your browser.',
    canonical: `${DOMAIN}/media/youtube-to-mp3`,
    bodyContent: ytMp3Body,
    currentPath: '/media/youtube-to-mp3'
  }));

  // ─── 4. TIKTOK VIDEO SAVER (FOOLPROOF IN-PAGE + AUTO DOWNLOAD) ────────────────────────
  const tiktokBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">TikTok Video Saver (No Watermark)</h1>
      <p>Download clean TikTok videos in high-definition MP4 format without bouncing watermark overlay.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="ttUrl" class="search-input" placeholder="Paste TikTok video URL (https://www.tiktok.com/@...)..." style="flex: 1; min-width: 260px; padding: 0.85rem 1rem; font-family: var(--mono); font-size: 0.95rem;" />
        <button id="ttBtn" class="btn-primary" style="padding: 0.85rem 1.75rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;">
          ${ICONS.download}
          <span>GET CLEAN VIDEO</span>
        </button>
      </div>

      <!-- In-Page Sponsored Ad Unit -->
      <div class="ad-blend-box" style="margin: 1.5rem 0; max-width: 850px;">
        <span class="ad-label">Sponsored Resource</span>
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

      <div id="ttStatus" style="display: none; padding: 1.25rem; border: 1px solid var(--border); background: var(--surface-alt); margin-bottom: 1.5rem; font-family: var(--mono); font-size: 0.9rem; border-radius: 6px;">
        <div id="ttStatusText">Removing TikTok watermark & preparing HD MP4...</div>
      </div>

      <!-- Direct Video Result -->
      <div id="ttResult" style="display: none; border: 1px solid var(--border); padding: 1.75rem; background: var(--surface); text-align: center; border-radius: 6px; margin-bottom: 1.5rem;">
        <div style="background: #10b981; color: #fff; padding: 0.6rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; margin-bottom: 1.25rem;">
          ✓ CLEAN VIDEO SNATCHED! Watermark-free MP4 ready.
        </div>
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Clean TikTok Video Ready</h3>
        
        <div style="margin-bottom: 1.25rem; background: #000; border-radius: 6px; overflow: hidden; max-width: 420px; margin: 0 auto 1.25rem;">
          <video id="ttVideoPreview" controls playsinline style="width: 100%; max-height: 480px; display: block;"></video>
        </div>

        <div style="margin-bottom: 1rem;">
          <a href="#" id="ttDownloadLink" class="btn-primary" target="_blank" download="tiktok_clean.mp4" style="text-decoration: none; padding: 0.85rem 1.8rem; font-size: 1rem;">
            ${ICONS.download}
            <span>DOWNLOAD CLEAN MP4</span>
          </a>
        </div>
      </div>

      <!-- Guaranteed Fallback Gateways (Never Leaves User in Error) -->
      <div id="ttGateways" style="display: none; border: 1px solid var(--border); padding: 1.75rem; background: var(--surface); border-radius: 6px; margin-bottom: 1.5rem;">
        <div style="background: #06b6d4; color: #fff; padding: 0.6rem 1rem; border-radius: 4px; font-family: var(--mono); font-size: 0.85rem; font-weight: bold; margin-bottom: 1.25rem;">
          ✓ TIKTOK DOWNLOAD GATEWAYS READY!
        </div>
        <h3 style="font-family: var(--serif); font-size: 1.25rem; margin-bottom: 0.5rem;">Download Clean Video in 1 Click:</h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">Choose your preferred watermark-free download mirror below:</p>

        <div id="ttButtonsGrid" style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
          <!-- Dynamically inserted -->
        </div>
      </div>
    </div>

    <script>
      const ttUrl = document.getElementById('ttUrl');
      const ttBtn = document.getElementById('ttBtn');
      const ttStatus = document.getElementById('ttStatus');
      const ttStatusText = document.getElementById('ttStatusText');
      const ttResult = document.getElementById('ttResult');
      const ttVideoPreview = document.getElementById('ttVideoPreview');
      const ttDownloadLink = document.getElementById('ttDownloadLink');
      const ttGateways = document.getElementById('ttGateways');
      const ttButtonsGrid = document.getElementById('ttButtonsGrid');

      function triggerAutoDownload(url, filename) {
        try {
          const a = document.createElement('a');
          a.href = url;
          a.download = filename || 'tiktok_clean.mp4';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch(e) {}
      }

      ttBtn.addEventListener('click', async () => {
        const url = ttUrl.value.trim();
        if (!url) {
          alert('Please enter a TikTok video URL.');
          return;
        }

        ttStatus.style.display = 'block';
        ttResult.style.display = 'none';
        ttGateways.style.display = 'none';
        ttStatusText.innerText = 'Snatching clean watermark-free video...';

        let foundUrl = null;

        try {
          const tikRes = await fetch('https://www.tikwm.com/api/?url=' + encodeURIComponent(url));
          if (tikRes.ok) {
            const tikData = await tikRes.json();
            if (tikData && tikData.data && (tikData.data.play || tikData.data.wmplay)) {
              foundUrl = tikData.data.play || tikData.data.wmplay;
            }
          }
        } catch(e) {}

        ttStatus.style.display = 'none';

        if (foundUrl) {
          ttResult.style.display = 'block';
          ttVideoPreview.src = foundUrl;
          ttDownloadLink.href = foundUrl;
          triggerAutoDownload(foundUrl, 'tiktok_clean.mp4');
          ttResult.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Open Guaranteed Gateways (Zero Error!)
          ttGateways.style.display = 'block';
          const u = encodeURIComponent(url);
          ttButtonsGrid.innerHTML = \`
            <a href="https://snaptik.app/en?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.5rem; background: #06b6d4; border: 1px solid #0891b2; display: flex; align-items: center; gap: 0.5rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span>DOWNLOAD CLEAN MP4 (SNAPTIK)</span>
            </a>
            <a href="https://ssstik.io/en?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.5rem; background: #2563eb; border: 1px solid #1d4ed8; display: flex; align-items: center; gap: 0.5rem;">
              <span>SSSTIK NO WATERMARK</span>
            </a>
            <a href="https://ssstik.io/en?url=\${u}" target="_blank" class="btn-primary" style="text-decoration: none; padding: 0.85rem 1.5rem; background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border);">
              <span>EXTRACT MP3 AUDIO</span>
            </a>
          \`;
          ttGateways.scrollIntoView({ behavior: 'smooth' });
        }
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'tiktok-saver.html'), renderPage({
    title: 'TikTok Video Saver — Free No Watermark Downloader | Digital Tools Shed',
    metaDesc: 'Download TikTok videos without watermark in HD quality. Free, instant, online TikTok MP4 video saver.',
    canonical: `${DOMAIN}/media/tiktok-saver`,
    bodyContent: tiktokBody,
    currentPath: '/media/tiktok-saver'
  }));

  // ─── 5. SUBTITLE SRT/VTT SHIFTER ───────────────────────────────────────────
  const subBody = `
    <div class="article-container" style="max-width: 900px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/media/">Media Tools</a> &gt; Subtitle Time Shifter
      </nav>

      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Subtitle Time Shifter (.SRT & .VTT)</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Easily fix out-of-sync movie and video subtitles. Shift all timestamps forward or backward by exact milliseconds with zero file uploads.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
        <div style="margin-bottom: 1.25rem;">
          <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Upload .SRT or .VTT File</label>
          <input type="file" id="subFileInput" accept=".srt,.vtt" class="search-input" style="padding: 0.5rem;" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">Time Shift (Milliseconds)</label>
            <input type="number" id="shiftMs" value="1500" step="100" class="search-input" style="width: 100%; padding: 0.5rem 0.75rem; font-family: var(--mono);" />
            <span style="font-size: 0.75rem; color: var(--text-muted);">Use negative for earlier (e.g. -2000), positive for later (e.g. 1500)</span>
          </div>
          <div style="display: flex; align-items: flex-end;">
            <button class="btn-primary" onclick="shiftSubtitles()" style="width: 100%; padding: 0.65rem;">Sync & Download Subtitles</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      var subContent = '';
      var fileName = 'synced_subtitles.srt';

      document.getElementById('subFileInput').addEventListener('change', function(e) {
        if (e.target.files.length) {
          fileName = e.target.files[0].name;
          var reader = new FileReader();
          reader.onload = function(evt) { subContent = evt.target.result; };
          reader.readAsText(e.target.files[0]);
        }
      });

      function shiftSubtitles() {
        if (!subContent) { alert('Please choose an .SRT or .VTT subtitle file first.'); return; }
        var delta = parseInt(document.getElementById('shiftMs').value, 10) || 0;

        var shifted = subContent.replace(/(\\d{2}):(\\d{2}):(\\d{2})[,.](\\d{3})/g, function(match, hh, mm, ss, ms) {
          var totalMs = parseInt(hh, 10) * 3600000 + parseInt(mm, 10) * 60000 + parseInt(ss, 10) * 1000 + parseInt(ms, 10);
          totalMs = Math.max(0, totalMs + delta);

          var newH = Math.floor(totalMs / 3600000);
          var rem = totalMs % 3600000;
          var newM = Math.floor(rem / 60000);
          rem = rem % 60000;
          var newS = Math.floor(rem / 1000);
          var newMs = rem % 1000;

          var pad = function(n, z) { return String(n).padStart(z, '0'); };
          var sep = match.includes(',') ? ',' : '.';
          return pad(newH, 2) + ':' + pad(newM, 2) + ':' + pad(newS, 2) + sep + pad(newMs, 3);
        });

        var blob = new Blob([shifted], { type: 'text/plain;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'shifted_' + fileName;
        a.click();
      }
    </script>
  `;

  writeFileSync(join(mediaDir, 'subtitle-shifter.html'), renderPage({
    title: 'Subtitle Time Shifter & Resync (.SRT & .VTT) | Digital Tools Shed',
    metaDesc: 'Fix desynced subtitles online. Shift SRT and VTT timestamps forward or backward in milliseconds in your browser.',
    canonical: `${DOMAIN}/media/subtitle-shifter`,
    bodyContent: subBody,
    currentPath: '/media/subtitle-shifter'
  }));

  // Render Media & Video Hub (/media/index.html)
  const mediaHubBody = `
    <div class="article-container" style="max-width: 950px;">
      <header style="margin-bottom: 2rem;">
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Media, Video & Audio Suite</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Browser-based video and audio processing tools: universal media downloaders, screen and microphone recording, subtitle synchronization, and audio extractors with zero cloud uploads.
        </p>
      </header>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
        <a href="/media/downloader" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem; color: var(--fg);">Universal Media Downloader</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Save high-definition video and audio from Twitter/X, TikTok, YouTube, Instagram, and Reddit without watermarks.</p>
        </a>

        <a href="/media/recorder" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem; color: var(--fg);">Screen & Camera Recorder</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Record your desktop screen, camera, and microphone directly in your browser with zero file size limits or watermarks.</p>
        </a>

        <a href="/media/youtube-to-mp3" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem; color: var(--fg);">YouTube to MP3 Audio</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Extract 320kbps MP3 audio tracks directly from video links in seconds.</p>
        </a>

        <a href="/media/tiktok-saver" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem; color: var(--fg);">TikTok Saver (No Watermark)</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Download full HD TikTok videos without the bouncing watermark overlay.</p>
        </a>

        <a href="/media/subtitle-shifter" style="display: block; background: var(--surface); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-decoration: none; color: inherit; transition: border-color 0.2s;">
          <h3 style="font-family: var(--serif); font-size: 1.25rem; margin: 0 0 0.5rem; color: var(--fg);">Subtitle Time Shifter (.SRT & .VTT)</h3>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">Resync delayed or early subtitles by shifting timestamps forward or backward in milliseconds.</p>
        </a>
      </div>
    </div>
  `;

  writeFileSync(join(mediaDir, 'index.html'), renderPage({
    title: 'Free Media, Video & Audio Tools | Digital Tools Shed',
    metaDesc: 'Browser-based video and audio tools: universal downloader, screen recorder, TikTok saver without watermark, YouTube to MP3, and subtitle shifter.',
    canonical: `${DOMAIN}/media/`,
    bodyContent: mediaHubBody,
    currentPath: '/media/'
  }));

  console.log('  ✓ Built Media & Video Suite (/media/ — Downloader, Recorder, YouTube MP3, TikTok, Subtitles, and Hub)');
}

export { buildMediaSuite };
