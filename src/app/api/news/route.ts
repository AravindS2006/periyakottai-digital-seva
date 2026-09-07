import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_NEWS_DATA } from '@/data/newsData';
import { NewsCategory, NewsItem } from '@/types';

// In-memory cache for live RSS results
interface CacheEntry {
  timestamp: number;
  data: NewsItem[];
}

const cache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Map category to search queries for Tamil RSS
function getCategoryQuery(category: string): string {
  switch (category) {
    case 'agri':
      return 'தமிழ்நாடு வேளாண்மை மானியம் உழவர் சந்தை';
    case 'jobs':
      return 'நான் முதல்வன் TNPSC தமிழ்நாடு வேலைவாய்ப்பு திறன் மேம்பாடு';
    case 'district':
      return 'திண்டுக்கல் ஒட்டன்சத்திரம் ஆட்சியர் குறைதீர்ப்பு';
    case 'national':
      return 'மத்திய அரசு திட்டம் PM KISAN இந்தியா';
    case 'vision':
      return 'தமிழ்நாடு அரசு திட்டம் மகளிர் உரிமை கலைஞர் கனவு இல்லம்';
    default:
      return 'தமிழ்நாடு அரசு திட்டங்கள் வேளாண்மை நலத்திட்டம்';
  }
}

// Clean HTML tags and decode basic XML entities
function cleanText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Extract source and clean headline from Google News title format: "Headline - Source Name"
function parseTitleAndSource(rawTitle: string, defaultSource: string): { title: string; source: string } {
  const cleaned = cleanText(rawTitle);
  const lastHyphen = cleaned.lastIndexOf(' - ');
  if (lastHyphen > 10) {
    const title = cleaned.substring(0, lastHyphen).trim();
    const source = cleaned.substring(lastHyphen + 3).trim();
    return { title: title || cleaned, source: source || defaultSource };
  }
  return { title: cleaned, source: defaultSource };
}

// Parse ISO date from RSS pubDate
function formatPublishDate(pubDateStr: string): string {
  try {
    const d = new Date(pubDateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {
    // fallback
  }
  return new Date().toISOString().split('T')[0];
}

// Categorize live RSS headline based on Tamil keywords
function categorizeRssItem(text: string, requestedCategory?: string): 'vision' | 'agri' | 'jobs' | 'district' | 'national' {
  if (requestedCategory && ['vision', 'agri', 'jobs', 'district', 'national'].includes(requestedCategory)) {
    return requestedCategory as any;
  }
  const lower = text.toLowerCase();
  if (lower.includes('வேளாண்') || lower.includes('விவசாயி') || lower.includes('பயிர்') || lower.includes('உரம்') || lower.includes('சந்தை')) {
    return 'agri';
  }
  if (lower.includes('வேலைவாய்ப்பு') || lower.includes('tnpsc') || lower.includes('முதல்வன்') || lower.includes('பள்ளி') || lower.includes('கல்லூரி')) {
    return 'jobs';
  }
  if (lower.includes('திண்டுக்கல்') || lower.includes('ஒட்டன்சத்திரம்') || lower.includes('பழனி') || lower.includes('ஆட்சியர்')) {
    return 'district';
  }
  if (lower.includes('மத்திய அரசு') || lower.includes('பிரதமர்') || lower.includes('pm kisan') || lower.includes('இந்தியா')) {
    return 'national';
  }
  return 'vision';
}

function getCategoryLabel(cat: string) {
  switch (cat) {
    case 'agri':
      return { ta: 'வேளாண்மை & உழவர் (Agri)', en: 'Agriculture & Farmers' };
    case 'jobs':
      return { ta: 'வேலைவாய்ப்பு & கல்வி (Jobs/Edu)', en: 'Jobs & Education' };
    case 'district':
      return { ta: 'திண்டுக்கல் மாவட்டம் (District)', en: 'Dindigul District' };
    case 'national':
      return { ta: 'மத்திய அரசுத் திட்டம் (National)', en: 'National Scheme' };
    default:
      return { ta: 'அரசு திட்டங்கள் (TN Vision)', en: 'TN Govt Vision' };
  }
}

// Fetch and parse live RSS items
async function fetchLiveRss(category: string): Promise<NewsItem[]> {
  const cacheKey = category || 'all';
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL_MS) {
    return cache[cacheKey].data;
  }

  try {
    const query = getCategoryQuery(category);
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ta&gl=IN&ceid=IN:ta`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PeriyakottaiDigitalSeva/1.0 (Civic Portal; Tamil Nadu)'
      },
      next: { revalidate: 600 }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return cache[cacheKey]?.data || [];
    }

    const xml = await res.text();
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 12);

    const parsedItems: NewsItem[] = itemMatches.map((m, idx) => {
      const block = m[1];
      const rawTitle = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
      const rawLink = (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
      const rawPubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
      const rawSource = (block.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || 'செய்தி ஆதாரம்';

      const { title, source } = parseTitleAndSource(rawTitle, rawSource);
      const publishDate = formatPublishDate(rawPubDate);
      const inferredCat = categorizeRssItem(title, category === 'all' ? undefined : category);

      return {
        id: `rss-${Date.now()}-${idx}`,
        title: {
          ta: title,
          en: title
        },
        summary: {
          ta: `${source} வெளியிட்ட சமீபத்திய நேரடி செய்தி அறிக்கை. விரிவான தகவல்களை அறிய இணைப்பை கிளிக் செய்யவும்.`,
          en: `Latest live news bulletin reported by ${source}. Tap the link to view the complete news coverage.`
        },
        content: {
          ta: `${title}\n\nஇந்த செய்தி ${source} மூலம் ${publishDate} அன்று வெளியிடப்பட்டுள்ளது. அதிகாரப்பூர்வ தகவல்களுக்கு மூல செய்தி பக்கத்தை பார்வையிடவும். பெரியாக்கோட்டை மக்கள் அரசு திட்ட விவரங்கள் மற்றும் விண்ணப்ப உதவிகளுக்கு நால்ரோடு மக்கள் இ-சேவை மையத்தை (9790382437) அணுகலாம்.`,
          en: `${title}\n\nReported by ${source} on ${publishDate}. Visit the source link for the full bulletin. For government scheme applications and assistance in Periyakottai, contact Nalroad Makkal e-Seva Centre (+91 97903 82437).`
        },
        category: inferredCat,
        categoryLabel: getCategoryLabel(inferredCat),
        source: source,
        sourceUrl: cleanText(rawLink),
        publishDate: publishDate,
        important: false,
        featured: false,
        tags: ['நேரடி செய்தி', 'Live News', source],
        isLiveRss: true
      };
    }).filter(item => item.title.ta.length > 5);

    // Update cache
    cache[cacheKey] = {
      timestamp: now,
      data: parsedItems
    };

    return parsedItems;
  } catch (err) {
    console.error('RSS fetch fallback:', err);
    return cache[cacheKey]?.data || [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') as NewsCategory) || 'all';
    const query = searchParams.get('q')?.toLowerCase().trim() || '';
    const featuredOnly = searchParams.get('featured') === 'true';

    // 1. Filter Verified Core News
    let verified = [...VERIFIED_NEWS_DATA];
    if (category && category !== 'all') {
      verified = verified.filter(n => n.category === category);
    }
    if (featuredOnly) {
      verified = verified.filter(n => n.featured);
    }

    // 2. Fetch Live RSS Items
    const liveItems = await fetchLiveRss(category);

    // Filter live items if category specified
    let filteredLive = liveItems;
    if (category && category !== 'all') {
      filteredLive = filteredLive.filter(n => n.category === category);
    }
    if (featuredOnly) {
      // Keep only top 2 live items for featured section
      filteredLive = filteredLive.slice(0, 2);
    }

    // 3. Combine: Verified Vision News first, followed by Live RSS updates
    let combined: NewsItem[] = [...verified, ...filteredLive];

    // 4. Apply search filter if present
    if (query) {
      combined = combined.filter(n => {
        const titleTa = n.title.ta.toLowerCase();
        const titleEn = n.title.en.toLowerCase();
        const sumTa = n.summary.ta.toLowerCase();
        const tags = n.tags.join(' ').toLowerCase();
        const src = n.source.toLowerCase();
        return (
          titleTa.includes(query) ||
          titleEn.includes(query) ||
          sumTa.includes(query) ||
          tags.includes(query) ||
          src.includes(query)
        );
      });
    }

    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    };

    return NextResponse.json(
      {
        success: true,
        category,
        count: combined.length,
        verifiedCount: verified.length,
        liveCount: filteredLive.length,
        lastUpdated: new Date().toISOString(),
        items: combined
      },
      { headers }
    );
  } catch (error: any) {
    console.error('Error in /api/news:', error);
    // Graceful fallback to verified news
    return NextResponse.json(
      {
        success: true,
        category: 'all',
        count: VERIFIED_NEWS_DATA.length,
        verifiedCount: VERIFIED_NEWS_DATA.length,
        liveCount: 0,
        lastUpdated: new Date().toISOString(),
        items: VERIFIED_NEWS_DATA
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  }
}
