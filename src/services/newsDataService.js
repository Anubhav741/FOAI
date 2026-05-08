import axios from 'axios';

const NEWS_BASE = 'https://newsdata.io/api/1';
const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY;

/**
 * Fetch latest news by query/category
 * @param {string} query - Search keyword
 * @param {string} language - Language code
 * @param {string|null} page - Pagination token
 */
export async function fetchLatestNews({ query = 'technology', language = 'en', page = null } = {}) {
  if (!API_KEY) {
    console.error('VITE_NEWSDATA_API_KEY is not set in .env');
    throw new Error('News API key is missing. Please check your .env file.');
  }

  const params = {
    apikey: API_KEY,
    q: query,
    language,
  };
  if (page) params.page = page;

  try {
    const response = await axios.get(`${NEWS_BASE}/latest`, { params });
    console.log('News API response status:', response.status);

    // NewsData.io returns { status, totalResults, results: [], nextPage }
    const data = response.data;
    return {
      status: data.status,
      totalResults: data.totalResults || 0,
      results: data.results || [],
      nextPage: data.nextPage || null,
    };
  } catch (err) {
    console.error('News API error:', err?.response?.data || err.message);
    throw err;
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
      out[cat] = [];
    }
  });
  return out;
}
