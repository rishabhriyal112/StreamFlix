// Sanitize text for logging
const sanitizeForLog = (text) => {
  if (typeof text !== 'string') return String(text);
  return text.replace(/[<>"'&]/g, '').substring(0, 100);
};

// Watchlist utility functions
export const getWatchlist = () => {
  try {
    const watchlist = localStorage.getItem('streamflix-watchlist');
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Failed to parse watchlist data:', sanitizeForLog(error.message));
    return [];
  }
};

export const addToWatchlist = (item) => {
  try {
    if (!item || !item.id) {
      throw new Error('Invalid item provided');
    }
    
    const watchlist = getWatchlist();
    const exists = watchlist.find(w => w.id === item.id && w.type === item.type);
    if (!exists) {
      watchlist.push(item);
      localStorage.setItem('streamflix-watchlist', JSON.stringify(watchlist));
      window.dispatchEvent(new Event('wishlistUpdated'));
    }
    return watchlist;
  } catch (error) {
    console.error('Failed to add to watchlist:', sanitizeForLog(error.message));
    return getWatchlist();
  }
};

export const removeFromWatchlist = (id, type) => {
  try {
    if (!id) {
      throw new Error('Invalid ID provided');
    }
    
    const watchlist = getWatchlist();
    const filtered = watchlist.filter(w => !(w.id === id && w.type === type));
    localStorage.setItem('streamflix-watchlist', JSON.stringify(filtered));
    window.dispatchEvent(new Event('wishlistUpdated'));
    return filtered;
  } catch (error) {
    console.error('Failed to remove from watchlist:', sanitizeForLog(error.message));
    return getWatchlist();
  }
};

export const isInWatchlist = (id, type) => {
  try {
    if (!id) return false;
    const watchlist = getWatchlist();
    return watchlist.some(w => w.id === id && w.type === type);
  } catch (error) {
    console.error('Failed to check watchlist:', sanitizeForLog(error.message));
    return false;
  }
};