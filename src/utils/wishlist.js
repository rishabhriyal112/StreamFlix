// In-memory watchlist storage (resets on page refresh)
let watchlist = [];

// Watchlist utility functions
export const getWatchlist = () => {
  return watchlist;
};

export const addToWatchlist = (item) => {
  if (!item || !item.id) return watchlist;
  
  const exists = watchlist.find(w => w.id === item.id && w.type === item.type);
  if (!exists) {
    watchlist.push(item);
    window.dispatchEvent(new Event('wishlistUpdated'));
  }
  return watchlist;
};

export const removeFromWatchlist = (id, type) => {
  if (!id) return watchlist;
  
  watchlist = watchlist.filter(w => !(w.id === id && w.type === type));
  window.dispatchEvent(new Event('wishlistUpdated'));
  return watchlist;
};

export const isInWatchlist = (id, type) => {
  if (!id) return false;
  return watchlist.some(w => w.id === id && w.type === type);
};