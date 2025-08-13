import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [cache, setCache] = useState(new Map());

  const setData = (key, data) => {
    setCache(prev => new Map(prev.set(key, { data, timestamp: Date.now() })));
  };

  const getData = (key, maxAge = 6 * 60 * 60 * 1000) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data;
    }
    return null;
  };

  return (
    <DataContext.Provider value={{ setData, getData }}>
      {children}
    </DataContext.Provider>
  );
};