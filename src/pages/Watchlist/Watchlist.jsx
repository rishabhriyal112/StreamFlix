import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart, Trash2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { getWatchlist, removeFromWatchlist } from '../../utils/wishlist';

const Watchlist = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  const handleRemove = (id, type, e) => {
    e.stopPropagation();
    removeFromWatchlist(id, type);
    setWatchlist(getWatchlist());
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4">
        <h1 className="text-3xl text-white font-bold mb-8">My Watchlist</h1>
        
        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl text-white font-bold mb-4">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-6">Add movies and TV shows to keep track of what you want to watch</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchlist.map(item => (
              <div
                key={`${item.id}-${item.type}`}
                className="relative cursor-pointer group hover:scale-105 transition-transform"
                onClick={() => navigate(`/${item.type}/${item.id}`)}
              >
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full aspect-[2/3] object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="flex gap-2">
                    <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <Play size={16} fill="currentColor" />
                    </button>
                    <button
                      onClick={(e) => handleRemove(item.id, item.type, e)}
                      className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-white text-sm font-medium truncate">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>★ {item.rating?.toFixed(1)}</span>
                    <span>{item.year}</span>
                    <span className="capitalize">{item.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Watchlist;