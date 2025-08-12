// API configuration and utilities
const API_KEY = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  throw new Error('TMDB API key not found in environment variables');
}

// Secure fetch with error handling
export const secureFetch = async (url, options = {}) => {
  try {
    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', sanitizeForLog(error.message));
    throw error;
  }
};

// API endpoints
export const getMovieEndpoint = (page = 1) => `${BASE_URL}/movie/popular?page=${page}`;
export const getTVEndpoint = (page = 1) => `${BASE_URL}/tv/popular?page=${page}`;
export const getMovieDetailsEndpoint = (id) => `${BASE_URL}/movie/${id}?append_to_response=external_ids,credits`;
export const getTVDetailsEndpoint = (id) => `${BASE_URL}/tv/${id}?append_to_response=external_ids,credits`;
export const getSearchMovieEndpoint = (query) => `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
export const getSearchTVEndpoint = (query) => `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}`;
export const getTrendingEndpoint = () => `${BASE_URL}/trending/all/week`;

// Image URL helper
export const getImageUrl = (path, type = 'poster') => {
  if (!path) {
    return type === 'poster'
      ? 'https://via.placeholder.com/500x750?text=No+Poster'
      : 'https://via.placeholder.com/780x440?text=No+Backdrop';
  }
  return `https://image.tmdb.org/t/p/${type === 'poster' ? 'w500' : 'w780'}${path}`;
};

// Sanitize text for logging
export const sanitizeForLog = (text) => {
  if (typeof text !== 'string') return String(text);
  return text.replace(/[<>"'&]/g, '').substring(0, 100);
};