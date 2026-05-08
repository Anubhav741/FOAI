import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLatestNews } from '../services/newsDataService';
import toast from 'react-hot-toast';

const CATEGORIES = ['technology', 'artificial intelligence', 'space', 'science'];
const DEBOUNCE_MS = 500;

export function useNews() {
  const [category, setCategory] = useState(() => {
    return localStorage.getItem('iss-news-category') || 'technology';
  });
  const [articles, setArticles] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const debounceRef = useRef(null);

  const load = useCallback(async (query, cat, page = null, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const searchTerm = query.trim() || cat;
      const data = await fetchLatestNews({ query: searchTerm, page });
      const results = data.results || [];
      console.log('[News] Loaded', results.length, 'articles | status:', data.status);
      setArticles(prev => append ? [...prev, ...results] : results);
      setNextPage(data.nextPage || null);

      // If using fallback/demo data, show a subtle warning (not error)
      if (data.status === 'fallback' || data.status === 'demo') {
        setError('Showing demo articles — news API key may be missing or invalid.');
      }
    } catch (err) {
      console.error('[News] fetch error:', err?.message);
      setError('Failed to load news. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setNextPage(null);
      load(searchQuery, category);
    }, searchQuery ? DEBOUNCE_MS : 0);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, category, load]);

  // Persist category
  useEffect(() => {
    localStorage.setItem('iss-news-category', category);
  }, [category]);

  const changeCategory = useCallback((cat) => {
    setCategory(cat);
    setSearchQuery('');
    setNextPage(null);
  }, []);

  const loadMore = useCallback(() => {
    if (nextPage) load(searchQuery, category, nextPage, true);
  }, [nextPage, searchQuery, category, load]);

  const refresh = useCallback(() => {
    setNextPage(null);
    load(searchQuery, category);
  }, [searchQuery, category, load]);

  // Sort articles client-side
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.pubDate) - new Date(a.pubDate);
    }
    return 0;
  });

  return {
    articles: sortedArticles,
    category,
    categories: CATEGORIES,
    loading,
    loadingMore,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    changeCategory,
    loadMore,
    hasMore: !!nextPage,
    refresh,
  };
}
