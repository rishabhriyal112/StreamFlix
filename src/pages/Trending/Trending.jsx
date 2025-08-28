import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchMovies, fetchTVShows, getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const Trending = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const [moviesData, tvData] = await Promise.all([
          fetchMovies('popular'),
          fetchTVShows('popular')
        ]);

        const movies = moviesData.results?.slice(0, 10).map(item => ({
          id: item.id,
          title: item.title,
          poster: getImageUrl(item.poster_path, 'w342'),
          rating: item.vote_average,
          year: item.release_date?.split('-')[0],
          overview: item.overview,
          type: 'movie'
        })) || [];

        const shows = tvData.results?.slice(0, 10).map(item => ({
          id: item.id,
          title: item.name,
          poster: getImageUrl(item.poster_path, 'w342'),
          rating: item.vote_average,
          year: item.first_air_date?.split('-')[0],
          overview: item.overview,
          type: 'tv'
        })) || [];

        setContent([...movies, ...shows].sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error('Error loading trending content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTrending();
  }, []);

  const handleWishlist = (item, e) => {
    e.stopPropagation();
    if (isInWatchlist(item.id, item.type)) {
      removeFromWatchlist(item.id, item.type);
    } else {
      addToWatchlist(item);
    }
  };

  const filteredContent = activeTab === 'all' 
    ? content 
    : content.filter(item => item.type === activeTab);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4">
        <h1 className="text-3xl text-white font-bold mb-8">Trending Now</h1>
        
        <div className="flex gap-4 mb-8">
          {['all', 'movie', 'tv'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-white text-center py-8">Loading trending content...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredContent.map(item => (
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
                      onClick={(e) => handleWishlist(item, e)}
                      className={`p-2 rounded-full ${
                        isInWatchlist(item.id, item.type)
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      <Heart size={16} fill={isInWatchlist(item.id, item.type) ? 'currentColor' : 'none'} />
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

export default Trending;