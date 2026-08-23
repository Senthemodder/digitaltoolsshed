// scripts/submit_indexnow.js - Fast Multi-Search-Engine Indexing via IndexNow Protocol
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITEMAP_PATH = join(ROOT, 'dist', 'sitemap.xml');

const HOST = 'digitaltoolsshed.com';
const INDEXNOW_KEY = 'd03e981bc84f479a9e3a6c2f84b1509b';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

function postJson(hostname, path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const req = https.request({
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(postData);
    req.end();
  });
}

async function submitToIndexNow() {
  console.log('\n🚀 Submitting Digital Tools Shed to IndexNow Search Engine Network...');
  console.log(`   Target Host: ${HOST}`);
  console.log(`   Key Location: ${KEY_LOCATION}\n`);

  if (!existsSync(SITEMAP_PATH)) {
    console.error('❌ Error: dist/sitemap.xml not found! Please run npm run build first.');
    process.exit(1);
  }

  const xml = readFileSync(SITEMAP_PATH, 'utf8');
  const urls = [];
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  console.log(`📋 Discovered ${urls.length} URLs in sitemap.xml`);

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  };

  const endpoints = [
    { name: 'IndexNow Global (Bing, Yandex, Naver, Seznam)', host: 'api.indexnow.org', path: '/indexnow' },
    { name: 'Microsoft Bing Direct', host: 'www.bing.com', path: '/indexnow' },
    { name: 'Yandex Direct', host: 'yandex.com', path: '/indexnow' }
  ];

  for (const ep of endpoints) {
    try {
      console.log(`\n📡 Pinging ${ep.name} (https://${ep.host}${ep.path})...`);
      const res = await postJson(ep.host, ep.path, payload);

      if (res.status === 200 || res.status === 202) {
        console.log(`   ✅ Success! HTTP ${res.status} (${res.status === 200 ? 'OK' : 'Accepted for crawling'})`);
      } else {
        console.log(`   ⚠️ Response HTTP ${res.status}: ${res.body || 'No message'}`);
      }
    } catch (e) {
      console.error(`   ❌ Network error pinging ${ep.name}: ${e.message}`);
    }
  }

  console.log('\n════════════════════════════════════════════════════');
  console.log(`🎉 IndexNow Submission Complete! (${urls.length} URLs notified to search bots)`);
  console.log('════════════════════════════════════════════════════\n');
}

submitToIndexNow();
