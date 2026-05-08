import axios from 'axios';

const NEWS_BASE = 'https://newsdata.io/api/1';
const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;

// Fallback demo articles if API fails
const FALLBACK_ARTICLES = [
  {
    article_id: 'demo-1',
    title: 'AI Revolution: How Artificial Intelligence is Transforming Industries',
    description: 'From healthcare to finance, AI is reshaping how businesses operate and deliver value to customers worldwide.',
    link: '#',
    pubDate: new Date().toISOString(),
    source_name: 'Tech News',
    category: ['technology'],
    image_url: null,
  },
  {
    article_id: 'demo-2',
    title: 'SpaceX Launches New Batch of Starlink Satellites',
    description: 'SpaceX successfully launched another batch of Starlink satellites, expanding global internet coverage to remote areas.',
    link: '#',
    pubDate: new Date().toISOString(),
    source_name: 'Space Daily',
    category: ['space'],
    image_url: null,
  },
  {
    article_id: 'demo-3',
    title: 'International Space Station Celebrates 25 Years in Orbit',
    description: 'The ISS marks a quarter century of continuous human presence in space, advancing science and international cooperation.',
    link: '#',
    pubDate: new Date().toISOString(),
    source_name: 'NASA News',
    category: ['science'],
    image_url: null,
  },
  {
    article_id: 'demo-4',
    title: 'Breakthrough in Quantum Computing Achieves New Milestone',
    description: 'Researchers demonstrate quantum supremacy in a practical application, bringing quantum computing closer to everyday use.',
    link: '#',
    pubDate: new Date().toISOString(),
    source_name: 'Science Weekly',
    category: ['technology'],
    image_url: null,
  },
  {
    article_id: 'demo-5',
    title: 'NASA Reveals Plans for Artemis Moon Base',
    description: 'NASA announces detailed plans for a permanent lunar base as part of the Artemis program, targeting 2030 for initial construction.',
    link: '#',
    pubDate: new Date().toISOString(),
    source_name: 'Space Report',
    category: ['space'],
    image_url: null,
  },
  {
    article_id: 'demo-6',
    title: 'New Study Shows AI Can Predict Weather More Accurately Than Traditional Models',
    description: 'Machine learning models trained on satellite data outperform conventional weather forecasting methods by significant margins.',
    link: '#',
    pubDate: new Date().toISOString(),
    source_name: 'AI Research',
    category: ['artificial intelligence'],
    image_url: null,
  },
];

/**
 * Fetch latest news by query/category
 */
export async function fetchLatestNews({ query = 'technology', language = 'en', page = null } = {}) {
  // Log the API key status (masked for security)
  const keyStatus = API_KEY ? `${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}` : 'MISSING';
  console.log('[News] API key:', keyStatus);

  if (!API_KEY) {
    console.error('[News] VITE_NEWSDATA_API_KEY is not set — using fallback articles');
    return {
      status: 'demo',
      totalResults: FALLBACK_ARTICLES.length,
      results: FALLBACK_ARTICLES,
      nextPage: null,
    };
  }

  const params = {
    apikey: API_KEY,
    q: query,
    language,
  };
  if (page) params.page = page;

  try {
    const response = await axios.get(`${NEWS_BASE}/latest`, { params, timeout: 10000 });
    console.log('[News] Response status:', response.status, '| Results:', response.data?.results?.length || 0);

    const data = response.data;

    // Check for API error in response body
    if (data.status === 'error') {
      console.error('[News] API returned error:', data.results?.message || data.message);
      throw new Error(data.results?.message || 'News API error');
    }

    return {
      status: data.status,
      totalResults: data.totalResults || 0,
      results: data.results || [],
      nextPage: data.nextPage || null,
    };
  } catch (err) {
    console.error('[News] API error:', err?.response?.data || err.message);

    // If API key is invalid or any error, return fallback data
    console.log('[News] Using fallback articles');
    return {
      status: 'fallback',
      totalResults: FALLBACK_ARTICLES.length,
      results: FALLBACK_ARTICLES,
      nextPage: null,
    };
  }
}

/**
 * Fetch news for multiple categories in parallel
 */
export async function fetchNewsByCategories(categories = ['technology', 'artificial intelligence', 'space', 'science']) {
  const results = await Promise.allSettled(
    categories.map(cat => fetchLatestNews({ query: cat }))
  );
  const out = {};
  categories.forEach((cat, i) => {
    if (results[i].status === 'fulfilled') {
      out[cat] = results[i].value.results || [];
    } else {
      console.error(`[News] Failed category "${cat}":`, results[i].reason);
      out[cat] = [];
    }
  });
  return out;
}
