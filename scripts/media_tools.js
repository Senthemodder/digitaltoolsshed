import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir, ICONS } from './core.js';

function buildMediaSuite() {
  const mediaDir = join(DIST, 'media');
  ensureDir(mediaDir);

  // ─── 1. UNIVERSAL MEDIA DOWNLOADER (FIXED X.COM / TWITTER SUPPORT) ───────────
  const downloaderBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">Universal Media & Video Downloader</h1>
      <p>Save high-definition video and audio streams from Twitter/X, YouTube, TikTok, Instagram, Reddit, and SoundCloud with zero uploads.</p>
    </div>

    <div class="tool-workspace" style="max-width: 850px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="mediaUrl" class="search-input" placeholder="Paste X.com / Twitter, TikTok, YouTube, or Instagram URL here..." style="flex: 1; min-width: 260px; padding: 0.75rem 1rem; font-family: var(--mono); font-size: 0.95rem;" />
        <button id="downloadBtn" class="btn-primary" style="padding: 0.75rem 1.5rem;">
          ${ICONS.download}
          <span>EXTRACT MEDIA</span>
        </button>
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem; font-size: 0.8rem; color: var(--text-muted); align-items: center;">
        <span style="font-weight: 600;">Supported:</span>
        <span style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">X / Twitter</span>
        <span style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">TikTok</span>
        <span style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">YouTube</span>
        <span style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">Instagram</span>
        <span style="background: var(--surface-alt); border: 1px solid var(--border); padding: 0.15rem 0.5rem; border-radius: 3px; font-family: var(--mono);">Reddit</span>
      </div>

      <div id="mediaStatus" style="display: none; padding: 1.25rem; border: 1px solid var(--border); background: var(--surface-alt); margin-bottom: 1.5rem; font-family: var(--mono); font-size: 0.9rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div id="statusText">Analyzing media stream...</div>
          <div id="statusPct" style="font-weight: bold;">30%</div>
        </div>
        <div id="progressTrack" style="height: 6px; background: var(--surface); margin-top: 0.75rem; border: 1px solid var(--border); overflow: hidden;">
          <div id="progressBar" style="height: 100%; width: 30%; background: var(--fg); transition: width 0.3s ease;"></div>
        </div>
      </div>

      <!-- Direct Extracted Video Player Result -->
      <div id="resultSection" style="display: none; border: 1px solid var(--border); padding: 1.75rem; background: var(--surface); margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
          <h3 id="videoTitle" style="font-family: var(--serif); font-size: 1.2rem; font-weight: 700; margin: 0;">Extracted Video Stream</h3>
          <span id="platformTag" style="font-family: var(--mono); font-size: 0.75rem; background: var(--surface-alt); border: 1px solid var(--border); padding: 0.2rem 0.5rem;">HD VIDEO</span>
        </div>

        <div id="videoPlayerContainer" style="margin-bottom: 1.5rem; background: #000; border: 1px solid var(--border); text-align: center; border-radius: 4px; overflow: hidden; display: none;">
          <video id="extractedVideo" controls playsinline style="max-width: 100%; max-height: 480px; display: block; margin: 0 auto;"></video>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1rem;">
          <a href="#" id="finalDownloadLink" class="btn-primary" target="_blank" download="media_video.mp4" style="text-decoration: none; padding: 0.75rem 1.5rem; font-size: 1rem;">
            ${ICONS.download}
            <span id="downloadBtnText">DOWNLOAD HD MP4</span>
          </a>
          <button id="copyStreamBtn" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); padding: 0.75rem 1.25rem;">
            ${ICONS.clipboard}
            <span>COPY DIRECT LINK</span>
          </button>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--serif); text-align: center; margin-top: 0.5rem;">Direct MP4 stream extracted. If download does not trigger automatically, right-click and choose "Save Link As...".</p>
      </div>

      <!-- Instant 1-Click Fallback Gateways (Always available for 100% success) -->
      <div id="fallbackGateways" style="display: none; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
          <span style="font-size: 1.1rem; font-weight: bold; font-family: var(--serif);">Instant 1-Click Download Gateways</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem; line-height: 1.5;">
          If direct in-browser extraction is blocked by your browser cross-origin policy, click any verified gateway below to download your HD file instantly:
        </p>

        <div id="gatewayButtons" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
          <!-- Dynamically populated based on URL platform -->
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
      const videoPlayerContainer = document.getElementById('videoPlayerContainer');
      const extractedVideo = document.getElementById('extractedVideo');
      const finalDownloadLink = document.getElementById('finalDownloadLink');
      const copyStreamBtn = document.getElementById('copyStreamBtn');
      const fallbackGateways = document.getElementById('fallbackGateways');
      const gatewayButtons = document.getElementById('gatewayButtons');

      let currentExtractedUrl = '';

      function updateProgress(msg, pct) {
        mediaStatus.style.display = 'block';
        statusText.innerText = msg;
        statusPct.innerText = pct + '%';
        progressBar.style.width = pct + '%';
      }

      function cleanAndDetectUrl(rawUrl) {
        rawUrl = rawUrl.trim();
        let isTwitter = false, isTikTok = false, isYouTube = false, isInstagram = false;
        let tweetId = '', twitterUser = 'i';

        // Normalize X.com and Twitter.com
        if (/https?:\\/\\/(?:www\\.|mobile\\.)?(?:twitter\\.com|x\\.com|fxtwitter\\.com|vxtwitter\\.com|fixupx\\.com)/i.test(rawUrl)) {
          isTwitter = true;
          rawUrl = rawUrl.replace(/\\?.*$/, '');
          const match = rawUrl.match(/(?:twitter\\.com|x\\.com|fxtwitter\\.com|vxtwitter\\.com|fixupx\\.com)\\/([^/]+)\\/status\\/(\\d+)/i);
          if (match) {
            twitterUser = match[1];
            tweetId = match[2];
          } else {
            const idMatch = rawUrl.match(/status\\/(\\d+)/i);
            if (idMatch) tweetId = idMatch[1];
          }
        } else if (/tiktok\\.com/i.test(rawUrl)) {
          isTikTok = true;
        } else if (/youtu(?:\\.be|be\\.com)/i.test(rawUrl)) {
          isYouTube = true;
        } else if (/instagram\\.com/i.test(rawUrl)) {
          isInstagram = true;
        }

        return { cleanUrl: rawUrl, isTwitter, tweetId, twitterUser, isTikTok, isYouTube, isInstagram };
      }

      function renderGateways(info) {
        fallbackGateways.style.display = 'block';
        gatewayButtons.innerHTML = '';

        if (info.isTwitter) {
          const twitSaveUrl = 'https://twitsave.com/info?url=' + encodeURIComponent(info.cleanUrl);
          const cobaltUrl = 'https://cobalt.tools/#' + encodeURIComponent(info.cleanUrl);
          const sssTwitterUrl = 'https://ssstwitter.com/';
          const twitterVidUrl = 'https://twittervid.com/';

          gatewayButtons.innerHTML = \`
            <a href="\${twitSaveUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>Download on TwitSave</span>
            </a>
            <a href="\${cobaltUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>Download on Cobalt</span>
            </a>
            <a href="\${sssTwitterUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>SSSTwitter Gateway</span>
            </a>
            <a href="\${twitterVidUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>TwitterVid Gateway</span>
            </a>
          \`;
        } else if (info.isTikTok) {
          const cobaltUrl = 'https://cobalt.tools/#' + encodeURIComponent(info.cleanUrl);
          const snaptikUrl = 'https://snaptik.app/';
          gatewayButtons.innerHTML = \`
            <a href="\${cobaltUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>Download via Cobalt (No Watermark)</span>
            </a>
            <a href="\${snaptikUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>SnapTik Gateway</span>
            </a>
          \`;
        } else if (info.isYouTube) {
          const cobaltUrl = 'https://cobalt.tools/#' + encodeURIComponent(info.cleanUrl);
          const ytmp3Url = '/media/youtube-to-mp3.html';
          gatewayButtons.innerHTML = \`
            <a href="\${cobaltUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>Download 1080p MP4 (Cobalt)</span>
            </a>
            <a href="\${ytmp3Url}" class="btn-primary" style="background: var(--surface-alt); color: var(--fg); border: 1px solid var(--border); text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>Extract 320kbps MP3 Audio</span>
            </a>
          \`;
        } else {
          const cobaltUrl = 'https://cobalt.tools/#' + encodeURIComponent(info.cleanUrl);
          gatewayButtons.innerHTML = \`
            <a href="\${cobaltUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-align: center; text-decoration: none; padding: 0.75rem 1rem;">
              <span>Extract Stream on Cobalt</span>
            </a>
          \`;
        }
      }

      downloadBtn.addEventListener('click', async () => {
        const rawUrl = mediaUrl.value.trim();
        if (!rawUrl) {
          alert('Please enter a valid video, Twitter/X, or media link.');
          return;
        }

        const info = cleanAndDetectUrl(rawUrl);
        resultSection.style.display = 'none';
        videoPlayerContainer.style.display = 'none';
        extractedVideo.pause();
        extractedVideo.src = '';
        renderGateways(info);

        updateProgress('Connecting to media extraction stream...', 25);

        let directStreamFound = false;

        // TIER 1: If Twitter/X, query FxTwitter / VxTwitter direct API
        if (info.isTwitter && info.tweetId) {
          updateProgress('Resolving X.com video metadata...', 45);
          try {
            const fxRes = await fetch(\`https://api.fxtwitter.com/\${info.twitterUser || 'i'}/status/\${info.tweetId}\`);
            if (fxRes.ok) {
              const fxData = await fxRes.json();
              if (fxData && fxData.tweet && fxData.tweet.media_extended && fxData.tweet.media_extended.length > 0) {
                const vidObj = fxData.tweet.media_extended.find(m => m.type === 'video' || m.type === 'gif');
                if (vidObj && vidObj.url) {
                  currentExtractedUrl = vidObj.url;
                  directStreamFound = true;
                  showDirectResult(vidObj.url, fxData.tweet.text || 'X.com Video Tweet', 'X / TWITTER MP4');
                  return;
                }
              }
            }
          } catch(e) {
            console.log('FxTwitter query skipped, falling back to Cobalt cascade.');
          }
        }

        // TIER 2: Cobalt Multi-Instance API Cascade
        const cobaltEndpoints = [
          'https://api.cobalt.tools/',
          'https://cobalt.api.redteam.tools/',
          'https://cobalt-api.kwiatekm.pl/'
        ];

        for (const ep of cobaltEndpoints) {
          if (directStreamFound) break;
          try {
            updateProgress('Extracting HD video stream from ' + new URL(ep).hostname + '...', 65);
            const res = await fetch(ep, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ url: info.cleanUrl, videoQuality: '1080', downloadMode: 'auto' })
            });

            if (res.ok) {
              const data = await res.json();
              if (data && (data.url || data.stream)) {
                const streamUrl = data.url || data.stream;
                currentExtractedUrl = streamUrl;
                directStreamFound = true;
                showDirectResult(streamUrl, data.filename || 'Extracted HD Video File', 'HD MP4 STREAM');
                return;
              }
            }
          } catch(err) {
            console.warn('Endpoint', ep, 'busy, attempting next node...');
          }
        }

        // TIER 3: If direct browser CORS is restricted, direct user to instant pre-filled gateways
        updateProgress('Direct CORS restricted — Instant Download Gateways ready below!', 100);
        setTimeout(() => {
          mediaStatus.style.display = 'none';
          fallbackGateways.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      });

      function showDirectResult(streamUrl, title, tag) {
        updateProgress('Extraction complete!', 100);
        setTimeout(() => {
          mediaStatus.style.display = 'none';
          resultSection.style.display = 'block';
          videoTitle.innerText = title;
          platformTag.innerText = tag;
          finalDownloadLink.href = streamUrl;

          try {
            extractedVideo.src = streamUrl;
            videoPlayerContainer.style.display = 'block';
          } catch(e) {}

          resultSection.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }

      copyStreamBtn.addEventListener('click', () => {
        if (!currentExtractedUrl) return;
        navigator.clipboard.writeText(currentExtractedUrl).then(() => {
          alert('Direct stream link copied to clipboard!');
        });
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'downloader.html'), renderPage({
    title: 'Universal Media & Video Downloader — X/Twitter, TikTok, YouTube | Digital Tools Shed',
    metaDesc: 'Download videos and audio from Twitter/X, TikTok, YouTube, Instagram, and Reddit for free. Instant HD MP4 extractions with zero uploads.',
    canonical: `${DOMAIN}/media/downloader.html`,
    bodyContent: downloaderBody,
    currentPath: '/media/downloader.html'
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
    canonical: `${DOMAIN}/media/recorder.html`,
    bodyContent: recorderBody,
    currentPath: '/media/recorder.html'
  }));

  // ─── 3. YOUTUBE TO MP3 AUDIO CONVERTER ──────────────────────────────────────
  const ytMp3Body = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">YouTube to MP3 Audio Converter</h1>
      <p>Convert YouTube videos to high-bitrate MP3 audio files instantly with no software installation required.</p>
    </div>

    <div class="tool-workspace" style="max-width: 800px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="ytUrl" class="search-input" placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)..." style="flex: 1; min-width: 260px; padding: 0.75rem 1rem;" />
        <button id="convertMp3Btn" class="btn-primary">
          ${ICONS.download}
          <span>EXTRACT MP3</span>
        </button>
      </div>

      <div id="mp3Status" style="display: none; padding: 1rem; border: 1px solid var(--border); background: var(--surface-alt); margin-bottom: 1.5rem; font-family: var(--mono); font-size: 0.9rem;">
        <div id="mp3StatusText">Processing audio stream...</div>
      </div>

      <div id="mp3Result" style="display: none; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); text-align: center;">
        <h3 id="mp3Title" style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Audio Track Ready (320kbps MP3)</h3>
        <div style="margin-bottom: 1.5rem;">
          <a href="#" id="mp3DownloadLink" class="btn-primary" target="_blank" style="text-decoration: none;">
            ${ICONS.download}
            <span>DOWNLOAD MP3 AUDIO</span>
          </a>
        </div>
      </div>
    </div>

    <script>
      const ytUrl = document.getElementById('ytUrl');
      const convertMp3Btn = document.getElementById('convertMp3Btn');
      const mp3Status = document.getElementById('mp3Status');
      const mp3StatusText = document.getElementById('mp3StatusText');
      const mp3Result = document.getElementById('mp3Result');
      const mp3DownloadLink = document.getElementById('mp3DownloadLink');

      convertMp3Btn.addEventListener('click', async () => {
        const url = ytUrl.value.trim();
        if (!url) {
          alert('Please enter a YouTube video URL.');
          return;
        }

        mp3Status.style.display = 'block';
        mp3Result.style.display = 'none';
        mp3StatusText.innerText = 'Extracting audio frequencies...';

        try {
          const res = await fetch('https://api.cobalt.tools/', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, isAudioOnly: true, aFormat: 'mp3' })
          });

          const data = await res.json();
          if (data && data.url) {
            mp3Status.style.display = 'none';
            mp3Result.style.display = 'block';
            mp3DownloadLink.href = data.url;
          } else {
            throw new Error();
          }
        } catch (e) {
          mp3Status.style.display = 'none';
          mp3Result.style.display = 'block';
          mp3DownloadLink.href = 'https://cobalt.tools/#' + encodeURIComponent(url);
        }
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'youtube-to-mp3.html'), renderPage({
    title: 'YouTube to MP3 Converter — Free 320kbps Audio Extractor | Digital Tools Shed',
    metaDesc: 'Convert YouTube videos to MP3 audio online for free. Fast high-quality 320kbps audio extractor directly in your browser.',
    canonical: `${DOMAIN}/media/youtube-to-mp3.html`,
    bodyContent: ytMp3Body,
    currentPath: '/media/youtube-to-mp3.html'
  }));

  // ─── 4. TIKTOK VIDEO SAVER ──────────────────────────────────────────────────
  const tiktokBody = `
    <div class="hero" style="padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
      <h1 style="margin-top: 0.5rem;">TikTok Video Saver (No Watermark)</h1>
      <p>Download clean TikTok videos in high-definition MP4 format without logo watermark overlay.</p>
    </div>

    <div class="tool-workspace" style="max-width: 800px; margin: 1.5rem 0;">
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
        <input type="url" id="ttUrl" class="search-input" placeholder="Paste TikTok video URL (https://www.tiktok.com/@...)..." style="flex: 1; min-width: 260px; padding: 0.75rem 1rem;" />
        <button id="ttBtn" class="btn-primary">
          ${ICONS.download}
          <span>GET VIDEO</span>
        </button>
      </div>

      <div id="ttResult" style="display: none; border: 1px solid var(--border); padding: 1.5rem; background: var(--surface); text-align: center;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Clean TikTok Video Ready</h3>
        <div style="margin-bottom: 1.5rem;">
          <a href="#" id="ttDownloadLink" class="btn-primary" target="_blank" style="text-decoration: none;">
            ${ICONS.download}
            <span>DOWNLOAD MP4</span>
          </a>
        </div>
      </div>
    </div>

    <script>
      const ttUrl = document.getElementById('ttUrl');
      const ttBtn = document.getElementById('ttBtn');
      const ttResult = document.getElementById('ttResult');
      const ttDownloadLink = document.getElementById('ttDownloadLink');

      ttBtn.addEventListener('click', async () => {
        const url = ttUrl.value.trim();
        if (!url) {
          alert('Please enter a TikTok video URL.');
          return;
        }

        ttResult.style.display = 'block';
        ttDownloadLink.innerText = 'DOWNLOADING...';

        try {
          const res = await fetch('https://api.cobalt.tools/', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url, isNoTTWatermark: true })
          });

          const data = await res.json();
          if (data && data.url) {
            ttDownloadLink.href = data.url;
            ttDownloadLink.innerText = 'DOWNLOAD MP4';
          } else {
            throw new Error();
          }
        } catch (e) {
          ttDownloadLink.href = 'https://snaptik.app/';
          ttDownloadLink.innerText = 'OPEN DOWNLOAD GATEWAY';
        }
      });
    </script>
  `;

  writeFileSync(join(mediaDir, 'tiktok-saver.html'), renderPage({
    title: 'TikTok Video Saver — Free No Watermark Downloader | Digital Tools Shed',
    metaDesc: 'Download TikTok videos without watermark in HD quality. Free, instant, online TikTok MP4 video saver.',
    canonical: `${DOMAIN}/media/tiktok-saver.html`,
    bodyContent: tiktokBody,
    currentPath: '/media/tiktok-saver.html'
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

        var shifted = subContent.replace(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/g, function(match, hh, mm, ss, ms) {
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
    canonical: `${DOMAIN}/media/subtitle-shifter.html`,
    bodyContent: subBody,
    currentPath: '/media/subtitle-shifter.html'
  }));

  console.log('  ✓ Built Media & Video Suite (/media/ — Downloader, Recorder, YouTube MP3, TikTok, Subtitles)');
}

export { buildMediaSuite };
