import fs from 'fs';
import path from 'path';
import { RequestTicket, GrievanceTicket, VillageNotice, PlatformSettings } from '@/types';

interface DatabaseSchema {
  requests: RequestTicket[];
  grievances: GrievanceTicket[];
  notices: VillageNotice[];
  settings?: PlatformSettings;
  auditLogs: {
    id: string;
    timestamp: string;
    action: string;
    actor: string;
    targetId?: string;
    details: string;
  }[];
}

const IS_VERCEL = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const SEED_FILE = path.join(process.cwd(), 'data', 'db.json');
const DB_DIR = IS_VERCEL ? path.join('/tmp', 'pds-data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Optional Vercel KV / Upstash Redis Free Tier Cloud Persistence
const KV_REST_API_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_STORAGE_KEY = 'periyakottai_db_v1';

let memoryCache: DatabaseSchema | null = null;

const INITIAL_REQUESTS: RequestTicket[] = [];

const INITIAL_GRIEVANCES: GrievanceTicket[] = [];

const INITIAL_NOTICES: VillageNotice[] = [
  {
    id: 'notice-1',
    title: {
      ta: 'PM கிசான் 19-வது தவணை e-KYC முகாம் நால்ரோடு மையத்தில் நடைபெறுகிறது',
      en: 'PM-KISAN 19th Installment e-KYC Camp at Nalroad e-Seva Centre'
    },
    content: {
      ta: 'விவசாயிகள் தங்களின் ஆதார் எண் மற்றும் வங்கி கணக்கு இணைக்க நால்ரோடு இ-சேவை மையத்திற்கு வந்து கைரேகை மூலம் உடனடியாக e-KYC செய்து கொள்ளலாம். கடைசி தேதிக்கு முன் முடிக்கவும்.',
      en: 'Farmers can complete biometric e-KYC for PM-KISAN 19th installment at Nalroad e-Seva Centre. Ensure completion before the cutoff.'
    },
    date: '2026-09-07',
    expiryDate: '2026-09-30',
    category: 'camp',
    important: true,
    source: 'வேளாண்மைத் துறை (Oddanchatram Agriculture Dept)'
  },
  {
    id: 'notice-2',
    title: {
      ta: 'சொட்டு நீர் பாசனம் 100% அரசு மானிய பதிவு தொடக்கம்',
      en: 'Drip Irrigation 100% Subsidy Registration Open for Small Farmers'
    },
    content: {
      ta: 'சிறு மற்றும் குறு விவசாயிகளுக்கு (5 ஏக்கர் வரை) 100% மானியத்திலும், இதர விவசாயிகளுக்கு 75% மானியத்திலும் சொட்டு நீர் பாசன வசதி வழங்கப்படுகிறது. சிட்டா, அடங்கல், வரைபடம் கொண்டு வந்து பதிவு செய்யவும்.',
      en: '100% subsidy for micro-irrigation for small/marginal farmers (up to 5 acres) and 75% for other farmers. Register with Chitta, Adangal, and FMB sketch.'
    },
    date: '2026-09-05',
    expiryDate: '2026-10-15',
    category: 'subsidy',
    important: true,
    source: 'தோட்டக்கலைத் துறை (Horticulture Dept Oddanchatram)'
  },
  {
    id: 'notice-3',
    title: {
      ta: 'கலைஞர் கனவு இல்லம் திட்ட கள ஆய்வு அறிவிப்பு',
      en: 'Kalaignar Kanavu Illam Field Verification Camp'
    },
    content: {
      ta: 'பெரியாக்கோட்டை கிராம பஞ்சாயத்தில் குடிசை வீடுகளில் வசிக்கும் தகுதியான குடும்பங்களை தேர்வு செய்ய ஊராட்சி அலுவலர்கள் ஆய்வு மேற்கொள்கின்றனர்.',
      en: 'Field verification by panchayat officials for eligible rural households under Kalaignar Kanavu Illam pucca housing scheme.'
    },
    date: '2026-09-04',
    category: 'panchayat',
    important: false,
    source: 'பெரியாக்கோட்டை ஊராட்சி மன்றம்'
  }
];

const DEFAULT_SETTINGS: PlatformSettings = {
  centreStatus: 'open',
  statusNote: {
    ta: 'மையம் வழக்கம்போல் இயங்குகிறது. அசல் ஆவணங்களுடன் வரவும்.',
    en: 'Centre is operating normally. Please carry original documents.'
  },
  operatingHours: {
    ta: 'திங்கள் - சனி: காலை 9:30 முதல் மாலை 5:00 வரை | ஞாயிறு: விடுமுறை',
    en: 'Mon - Sat: 9:30 AM - 5:00 PM | Sun: Holiday'
  },
  primaryPhone: '9790382437',
  alternatePhone: '9790382437',
  email: 'nalroadmakkalesevaimaiyam@gmail.com',
  googleMapUrl: 'https://maps.app.goo.gl/kDxy1NXkBNCYcAZEA',
  marketWhatsAppUrl: 'https://chat.whatsapp.com/placeholder-oddanchatram-market',
  marketNotice: {
    ta: 'ஒட்டன்சத்திரம் காந்தி மார்க்கெட் தினசரி காய்கறி விலை நிலவரங்கள் வாட்ஸ்அப் குழுவில் தினமும் காலை 8:00 மணிக்கு பதிவேற்றப்படும்.',
    en: 'Daily Oddanchatram Gandhi Market vegetable price updates are posted in our WhatsApp community every morning at 8:00 AM.'
  },
  announcementBanner: {
    enabled: true,
    text: {
      ta: 'நால்ரோடு மக்கள் இ-சேவை மையம்: PM கிசான் 19-வது தவணை e-KYC கைரேகை பதிவு & மகளிர் உரிமைத் தொகை ஆவண சரிபார்ப்பு நடைபெறுகிறது.',
      en: 'Nalroad Makkal e-Seva Centre: PM-KISAN 19th installment e-KYC & Kalaignar Magalir Urimai verification active.'
    },
    type: 'info'
  },
  lastUpdated: new Date().toISOString()
};

let lastLoadedMtime = 0;

function ensureDatabase(): DatabaseSchema {
  try {
    // 1. If DB_FILE exists on disk, check if it was updated or if memory is fresh
    if (fs.existsSync(DB_FILE)) {
      const stats = fs.statSync(DB_FILE);
      if (memoryCache && stats.mtimeMs <= lastLoadedMtime) {
        return memoryCache;
      }

      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data: DatabaseSchema = JSON.parse(content);
      if (!data.settings) {
        data.settings = DEFAULT_SETTINGS;
      }
      memoryCache = data;
      lastLoadedMtime = stats.mtimeMs;
      return memoryCache;
    }

    // 2. If memoryCache is already loaded in memory (e.g. serverless without disk persistence)
    if (memoryCache) {
      return memoryCache;
    }

    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    // 3. Seed from SEED_FILE if available
    let initialData: DatabaseSchema;
    if (fs.existsSync(SEED_FILE)) {
      try {
        initialData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
        if (!initialData.settings) {
          initialData.settings = DEFAULT_SETTINGS;
        }
      } catch {
        initialData = {
          requests: INITIAL_REQUESTS,
          grievances: INITIAL_GRIEVANCES,
          notices: INITIAL_NOTICES,
          settings: DEFAULT_SETTINGS,
          auditLogs: []
        };
      }
    } else {
      initialData = {
        requests: INITIAL_REQUESTS,
        grievances: INITIAL_GRIEVANCES,
        notices: INITIAL_NOTICES,
        settings: DEFAULT_SETTINGS,
        auditLogs: [
          {
            id: 'log-1',
            timestamp: new Date().toISOString(),
            action: 'INITIALIZE',
            actor: 'System',
            details: 'Initial database created with verified templates'
          }
        ]
      };
    }

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      if (fs.existsSync(DB_FILE)) {
        lastLoadedMtime = fs.statSync(DB_FILE).mtimeMs;
      }
    } catch (err) {
      console.warn('Filesystem write warning (serverless readonly):', err);
    }
    memoryCache = initialData;
    return initialData;
  } catch (error) {
    console.error('Error in ensureDatabase:', error);
    if (memoryCache) return memoryCache;
    const fallback: DatabaseSchema = {
      requests: INITIAL_REQUESTS,
      grievances: INITIAL_GRIEVANCES,
      notices: INITIAL_NOTICES,
      settings: DEFAULT_SETTINGS,
      auditLogs: []
    };
    memoryCache = fallback;
    return fallback;
  }
}

function saveDatabase(data: DatabaseSchema): boolean {
  // Always update in-memory cache first for instant synchronous reads
  memoryCache = data;

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    if (fs.existsSync(DB_FILE)) {
      lastLoadedMtime = fs.statSync(DB_FILE).mtimeMs;
    }
  } catch (error) {
    console.warn('Filesystem write warning for DB_FILE, preserved in memory:', error);
  }

  // If DB_FILE is different from SEED_FILE (e.g. in /tmp), also attempt to persist to SEED_FILE
  if (DB_FILE !== SEED_FILE) {
    try {
      fs.writeFileSync(SEED_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Expected in read-only serverless lambdas
    }
  }

  // Push to Vercel KV / Upstash Redis if configured (zero external dependencies)
  if (KV_REST_API_URL && KV_REST_API_TOKEN) {
    try {
      fetch(`${KV_REST_API_URL}/set/${KV_STORAGE_KEY}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${KV_REST_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch((err) => {
        console.warn('Vercel KV background sync notice:', err);
      });
    } catch (err) {
      console.warn('Vercel KV fetch trigger notice:', err);
    }
  }

  return true;
}

export const db = {
  // Sync from Cloud KV on initial load or cold start if configured
  syncFromCloud: async (): Promise<boolean> => {
    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return false;
    if (memoryCache && memoryCache.settings) return true;
    try {
      const res = await fetch(`${KV_REST_API_URL}/get/${KV_STORAGE_KEY}`, {
        headers: { Authorization: `Bearer ${KV_REST_API_TOKEN}` },
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.result) {
          const raw = json.result;
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (parsed && parsed.settings) {
            memoryCache = parsed;
            try {
              if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
              fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
              if (fs.existsSync(DB_FILE)) lastLoadedMtime = fs.statSync(DB_FILE).mtimeMs;
            } catch {}
            return true;
          }
        }
      }
    } catch (err) {
      console.warn('Vercel KV initial load notice:', err);
    }
    return false;
  },

  // Requests
  getRequests: (): RequestTicket[] => {
    const data = ensureDatabase();
    return data.requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getRequestById: (id: string): RequestTicket | undefined => {
    const data = ensureDatabase();
    return data.requests.find((r) => r.id.toLowerCase() === id.trim().toLowerCase());
  },

  getRequestsByPhone: (phone: string): RequestTicket[] => {
    const data = ensureDatabase();
    const cleanPhone = phone.replace(/\D/g, '');
    return data.requests.filter((r) => r.phoneNumber.replace(/\D/g, '').includes(cleanPhone));
  },

  createRequest: (ticket: Omit<RequestTicket, 'id' | 'createdAt' | 'updatedAt' | 'notes'>): RequestTicket => {
    const data = ensureDatabase();
    const nextNum = data.requests.reduce((max, r) => {
      const match = r.id.match(/\d+$/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0) + 1;
    const newId = `PDS-REQ-624614-${String(nextNum).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newTicket: RequestTicket = {
      ...ticket,
      id: newId,
      createdAt: now,
      updatedAt: now,
      notes: [
        {
          date: now,
          author: 'System',
          message: 'விண்ணப்பம் பதிவு செய்யப்பட்டது. நால்ரோடு இ-சேவை மையம் பரிசீலிக்கும்.'
        }
      ]
    };

    data.requests.push(newTicket);
    data.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: now,
      action: 'CREATE_REQUEST',
      actor: ticket.citizenName,
      targetId: newId,
      details: `New service request created for ${ticket.serviceName}`
    });

    saveDatabase(data);
    return newTicket;
  },

  updateRequestStatus: (id: string, status: RequestTicket['status'], note: string, author = 'Murugesan K'): RequestTicket | null => {
    const data = ensureDatabase();
    const ticket = data.requests.find((r) => r.id.toLowerCase() === id.toLowerCase());
    if (!ticket) return null;

    const now = new Date().toISOString();
    ticket.status = status;
    ticket.updatedAt = now;
    ticket.notes.push({
      date: now,
      author,
      message: note
    });

    data.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: now,
      action: 'UPDATE_REQUEST_STATUS',
      actor: author,
      targetId: id,
      details: `Status updated to ${status}: ${note}`
    });

    saveDatabase(data);
    return ticket;
  },

  // Grievances
  getGrievances: (): GrievanceTicket[] => {
    const data = ensureDatabase();
    return data.grievances.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getGrievanceById: (id: string): GrievanceTicket | undefined => {
    const data = ensureDatabase();
    return data.grievances.find((g) => g.id.toLowerCase() === id.trim().toLowerCase());
  },

  createGrievance: (grievance: Omit<GrievanceTicket, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): GrievanceTicket => {
    const data = ensureDatabase();
    const nextNum = data.grievances.reduce((max, g) => {
      const match = g.id.match(/\d+$/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0) + 1;
    const newId = `PDS-GRV-624614-${String(nextNum).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newGrievance: GrievanceTicket = {
      ...grievance,
      id: newId,
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          date: now,
          status: 'Received',
          note: 'குறை இணையதளத்தில் பதிவு செய்யப்பட்டது.'
        }
      ]
    };

    data.grievances.push(newGrievance);
    data.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: now,
      action: 'CREATE_GRIEVANCE',
      actor: grievance.citizenName,
      targetId: newId,
      details: `Grievance registered in category ${grievance.category}`
    });

    saveDatabase(data);
    return newGrievance;
  },

  updateGrievanceStatus: (id: string, status: GrievanceTicket['status'], note: string, author = 'Admin'): GrievanceTicket | null => {
    const data = ensureDatabase();
    const grievance = data.grievances.find((g) => g.id.toLowerCase() === id.toLowerCase());
    if (!grievance) return null;

    const now = new Date().toISOString();
    grievance.status = status;
    grievance.updatedAt = now;
    grievance.timeline.push({
      date: now,
      status,
      note
    });

    data.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: now,
      action: 'UPDATE_GRIEVANCE_STATUS',
      actor: author,
      targetId: id,
      details: `Grievance status changed to ${status}: ${note}`
    });

    saveDatabase(data);
    return grievance;
  },

  // Notices
  getNotices: (): VillageNotice[] => {
    const data = ensureDatabase();
    return data.notices;
  },

  addNotice: (notice: Omit<VillageNotice, 'id'>): VillageNotice => {
    const data = ensureDatabase();
    const newNotice: VillageNotice = {
      ...notice,
      id: `notice-${Date.now()}`
    };
    data.notices.unshift(newNotice);
    saveDatabase(data);
    return newNotice;
  },

  updateNotice: (id: string, updated: Partial<VillageNotice>): VillageNotice | null => {
    const data = ensureDatabase();
    const index = data.notices.findIndex((n) => n.id === id);
    if (index === -1) return null;
    data.notices[index] = { ...data.notices[index], ...updated };
    saveDatabase(data);
    return data.notices[index];
  },

  deleteNotice: (id: string): boolean => {
    const data = ensureDatabase();
    const initialLen = data.notices.length;
    data.notices = data.notices.filter((n) => n.id !== id);
    if (data.notices.length < initialLen) {
      saveDatabase(data);
      return true;
    }
    return false;
  },

  // Settings
  getSettings: (): PlatformSettings => {
    const data = ensureDatabase();
    return data.settings || DEFAULT_SETTINGS;
  },

  updateSettings: (newSettings: Partial<PlatformSettings>, actor = 'Murugesan K'): PlatformSettings => {
    const data = ensureDatabase();
    const current = data.settings || DEFAULT_SETTINGS;
    data.settings = {
      ...current,
      ...newSettings,
      announcementBanner: {
        ...current.announcementBanner,
        ...(newSettings.announcementBanner || {})
      },
      lastUpdated: new Date().toISOString()
    };

    data.auditLogs.push({
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'UPDATE_SETTINGS',
      actor,
      details: `Operator updated centre configuration and announcements`
    });

    saveDatabase(data);
    return data.settings;
  }
};
