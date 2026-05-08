import axios from 'axios';

const NEWS_BASE = 'https://newsdata.io/api/1';
const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;

// Fallback demo articles in case API fails or key is invalid
const FALLBACK_ARTICLES = [
  {
    article_id: 'demo1',
    title: 'NASA Discovers New Exoplanet in Habitable Zone',
    description: 'Astronomers have identified a new Earth-sized planet orbiting a distant star, raising hopes for extraterrestrial life.',
    pubDate: new Date().toISOString(),
    source_id: 'Space News',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    link: '#',
    creator: ['Dr. Sarah Jones']
  },
  {
    article_id: 'demo2',
    title: 'Breakthrough in Quantum Computing Efficiency',
    description: 'Researchers have successfully demonstrated a new qubit architecture that drastically reduces error rates in quantum calculations.',
    pubDate: new Date(Date.now() - 3600000).toISOString(),
    source_id: 'Tech Daily',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop',
    link: '#',
    creator: ['Quantum Labs']
  },
  {
    article_id: 'demo3',
    title: 'AI Model Predicts Weather Patterns with 99% Accuracy',
    description: 'A new artificial intelligence model developed by global meteorologists can now predict extreme weather events weeks in advance.',
    pubDate: new Date(Date.now() - 7200000).toISOString(),
    source_id: 'AI Weekly',
    image_url: 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?q=80&w=600&auto=format&fit=crop',
    link: '#',
    creator: ['Tech AI']
  }
];

/**
 * Fetch latest news by query/category
 * @param {string} query - Search keyword
 * @param {string} language - Language code
 * @param {string|null} page - Pagination token
 */
export async function fetchLatestNews({ query = 'technology', language = 'en', page = null } = {}) {
  console.log('News API Key:', API_KEY ? 'Set' : 'Missing');
  
  if (!API_KEY) {
    console.error('VITE_NEWSDATA_API_KEY is not set in .env');
    return {
      status: 'fallback',
      totalResults: FALLBACK_ARTICLES.length,
      results: FALLBACK_ARTICLES,
      nextPage: null,
      _isFallback: true
    };
  }

  const params = {
    apikey: API_KEY,
    q: query,
    language,
  };
  if (page) params.page = page;

  try {
    const response = await axios.get(`${NEWS_BASE}/latest`, { params });
    console.log('News Response:', response.data);

    // NewsData.io returns { status, totalResults, results: [], nextPage }
    const data = response.data;
    return {
      status: data.status,
      totalResults: data.totalResults || 0,
      results: data.results || [],
      nextPage: data.nextPage || null,
    };
  } catch (err) {
    console.error('News API Error:', err.response?.data || err);
    console.log('Using fallback demo data due to API error.');
    return {
      status: 'fallback',
      totalResults: FALLBACK_ARTICLES.length,
      results: FALLBACK_ARTICLES,
      nextPage: null,
      _isFallback: true
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
      console.error(`Failed to fetch news for category "${cat}":`, results[i].reason);
      out[cat] = FALLBACK_ARTICLES;
    }
  });
  return out;
}
