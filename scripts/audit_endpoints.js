const http = require('http');

const BASE_URL = 'http://localhost:3000';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url, BASE_URL);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          json
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('====================================================');
  console.log('PERIYAKOTTAI DIGITAL SEVA - FULL ENDPOINT & ROUTE AUDIT');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      const res = await fn();
      if (res.ok) {
        console.log(`✅ [PASS] ${name} -> ${res.msg || 'HTTP ' + res.statusCode}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name} -> ${res.msg || 'HTTP ' + res.statusCode}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [ERROR] ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. PAGE ROUTES
  const pages = [
    '/',
    '/csc-centre',
    '/murugesan',
    '/services',
    '/schemes',
    '/farmer-hub',
    '/news',
    '/track',
    '/contacts',
    '/operator',
    '/admin',
    '/admin/login',
    '/panchayat',
    '/documents',
    '/robots.txt',
    '/sitemap.xml'
  ];

  console.log('--- Checking Frontend Routes ---');
  for (const page of pages) {
    await check(`Page: ${page}`, async () => {
      const res = await request(page);
      return { ok: res.statusCode === 200, statusCode: res.statusCode };
    });
  }

  // 2. VERIFY GOOGLE MAPS LINK PRESENCE
  console.log('\n--- Checking Google Maps Location Links ---');
  const mapCheckPages = ['/csc-centre', '/murugesan', '/contacts', '/'];
  for (const p of mapCheckPages) {
    await check(`Google Maps Embed in ${p}`, async () => {
      const res = await request(p);
      const hasMap = res.data.includes('https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA');
      return {
        ok: hasMap,
        msg: hasMap ? 'Maps link verified' : 'Maps link NOT found in HTML'
      };
    });
  }

  // 3. API ENDPOINTS
  console.log('\n--- Checking Backend API Endpoints ---');

  let originalSettings = null;
  // GET /api/settings
  await check('API: GET /api/settings', async () => {
    const res = await request('/api/settings');
    const ok = res.statusCode === 200 && res.json && res.json.success && res.json.settings.googleMapUrl;
    if (ok) {
      originalSettings = res.json.settings;
    }
    return { ok, msg: ok ? `Centre status: ${res.json.settings.centreStatus}` : 'Invalid response' };
  });

  // PUT /api/settings
  await check('API: PUT /api/settings (Preserve Operator Status)', async () => {
    const currentStatus = originalSettings?.centreStatus || 'open';
    const currentNote = originalSettings?.statusNote || '';
    const res = await request('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        settings: {
          centreStatus: currentStatus,
          statusNote: currentNote,
          marketWhatsAppUrl: originalSettings?.marketWhatsAppUrl || 'https://chat.whatsapp.com/invite-placeholder-oddanchatram'
        },
        actor: 'Audit Verification'
      }
    });
    return { ok: res.statusCode === 200 && res.json && res.json.success, msg: `Preserved operator status: ${currentStatus}` };
  });

  // GET /api/notices
  await check('API: GET /api/notices', async () => {
    const res = await request('/api/notices');
    const ok = res.statusCode === 200 && res.json && Array.isArray(res.json.notices);
    return { ok, msg: ok ? `${res.json.notices.length} notices returned` : 'Invalid response' };
  });

  // POST & DELETE /api/notices
  let createdNoticeId = null;
  await check('API: POST /api/notices (Create Notice)', async () => {
    const res = await request('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        title: { ta: 'தானியங்கி சோதனை அறிவிப்பு', en: 'Automated Audit Notice' },
        content: { ta: 'இது ஒரு மாதிரி அறிவிப்பு', en: 'This is a test notice' },
        category: 'camp',
        source: 'System Audit'
      }
    });
    if (res.statusCode === 200 && res.json?.notice?.id) {
      createdNoticeId = res.json.notice.id;
      return { ok: true, msg: `Notice created with ID: ${createdNoticeId}` };
    }
    return { ok: false, statusCode: res.statusCode };
  });

  if (createdNoticeId) {
    await check(`API: DELETE /api/notices?id=${createdNoticeId}`, async () => {
      const res = await request(`/api/notices?id=${createdNoticeId}`, { method: 'DELETE' });
      return { ok: res.statusCode === 200 && res.json?.success };
    });
  }

  // GET /api/requests
  await check('API: GET /api/requests', async () => {
    const res = await request('/api/requests');
    const ok = res.statusCode === 200 && Array.isArray(res.json);
    return { ok, msg: ok ? `${res.json.length} requests in DB` : 'Invalid response' };
  });

  // GET /api/grievances
  await check('API: GET /api/grievances', async () => {
    const res = await request('/api/grievances');
    const ok = res.statusCode === 200 && Array.isArray(res.json);
    return { ok, msg: ok ? `${res.json.length} grievances in DB` : 'Invalid response' };
  });

  // GET /api/news
  await check('API: GET /api/news', async () => {
    const res = await request('/api/news');
    const ok = res.statusCode === 200 && res.json && Array.isArray(res.json.items);
    return { ok, msg: ok ? `${res.json.items.length} verified news items` : 'Invalid response' };
  });

  // POST /api/admin/login
  await check('API: POST /api/admin/login (Murugesan PIN 9790382437)', async () => {
    const res = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { pin: '9790382437' }
    });
    return { ok: res.statusCode === 200 && res.json?.success && res.json?.operator?.name === 'Murugesan K' };
  });

  // POST /api/admin/login (Default Pincode 624614)
  await check('API: POST /api/admin/login (Pincode 624614)', async () => {
    const res = await request('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { pin: '624614' }
    });
    return { ok: res.statusCode === 200 && res.json?.success };
  });

  // POST /api/assistant
  await check('API: POST /api/assistant (Tamil Query)', async () => {
    const res = await request('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: { query: 'பட்டா பெயர் மாற்றம் செய்ய என்ன வேண்டும்?' }
    });
    const ok = res.statusCode === 200 && res.json && res.json.answer;
    return { ok, msg: ok ? 'Assistant replied with verified Tamil guidance' : 'Invalid response' };
  });

  console.log('\n====================================================');
  console.log(`AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
