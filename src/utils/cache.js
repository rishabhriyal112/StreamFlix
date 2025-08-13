// Cache utility with error handling
export const clearCorruptedCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('movie') || key.includes('tv')) {
        try {
          const data = localStorage.getItem(key);
          JSON.parse(data); // Test if valid JSON
        } catch {
          console.log('Removing corrupted cache:', key);
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.log('Cache cleanup failed:', error);
  }
};

// Clear all app cache
export const clearAppCache = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('App cache cleared');
  } catch (error) {
    console.log('Cache clear failed:', error);
  }
};