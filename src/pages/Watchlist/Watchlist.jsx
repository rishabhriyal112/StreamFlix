import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { getWatchlist, removeFromWatchlist } from '../../utils/wishlist';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setWatchlist(getWatchlist());
    } catch (error) {
      console.error('Error loading watchlist:', error.message);
      setWatchlist([]);
    }
  }, []);

  const handleRemove = (id, type) => {
    try {
      const updated = removeFromWatchlist(id, type);
      setWatchlist(updated);
    } catch (error) {
      console.error('Error removing from watchlist:', error.message);
    }
  };

  const handlePlay = (item) => {
    if (item.type === 'tv') {
      navigate(`/tv/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8 text-center md:text-left">My Watchlist</h1>
          
          {watchlist.length === 0 ? (
            <div className="text-center py-16 md:py-20">
              <h2 className="text-xl md:text-2xl text-gray-400 mb-4">Your watchlist is empty</h2>
              <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">Add movies and TV shows to watch them later</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
              >
                Browse Content
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {watchlist.map((item) => (
                <motion.div
                  key={`${item.id}-${item.type}`}
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-3 md:p-4">
                    <h3 className="text-white font-semibold text-xs md:text-sm mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlay(item)}
                        className="flex-1 bg-red-600 text-white py-1.5 md:py-2 px-2 md:px-3 rounded text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Play size={10} md:size={12} fill="currentColor" />
                        Play
                      </button>
                      <button
                        onClick={() => handleRemove(item.id, item.type)}
                        className="bg-gray-600 text-white p-1.5 md:p-2 rounded hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 size={10} md:size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Watchlist;