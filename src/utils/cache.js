// Advanced caching without backend
const CACHE_DURATION = {
  POPULAR: 6 * 60 * 60 * 1000, // 6 hours
  TRENDING: 2 * 60 * 60 * 1000, // 2 hours  
  DETAILS: 24 * 60 * 60 * 1000, // 24 hours
  SEARCH: 30 * 60 * 1000 // 30 minutes
};

export const getCachedData = (key, duration) => {
  const cached = localStorage.getItem(key);
  const timestamp = localStorage.getItem(`${key}_time`);
  
  if (cached && timestamp) {
    const age = Date.now() - parseInt(timestamp);
    if (age < duration) {
      return JSON.parse(cached);
    }
  }
  return null;
};

export const setCachedData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  localStorage.setItem(`${key}_time`, Date.now().toString());
};