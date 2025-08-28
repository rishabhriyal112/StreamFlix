import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchTVShows, getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const TVShowsPage = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadShows = async () => {
      try {
        const data = await fetchTVShows('popular', page);
        const showList = data.results?.map(show => ({
          id: show.id,
          title: show.name,
          poster: getImageUrl(show.poster_path, 'w342'),
          rating: show.vote_average,
          year: show.first_air_date?.split('-')[0],
          overview: show.overview,
          type: 'tv'
        })) || [];
        
        if (page === 1) {
          setShows(showList);
        } else {
          setShows(prev => [...prev, ...showList]);
        }
      } catch (error) {
        console.error('Error loading TV shows:', error);
      } finally {
        setLoading(false);
      }
    };
    loadShows();
  }, [page]);

  const handleWishlist = (show, e) => {
    e.stopPropagation();
    if (isInWatchlist(show.id, show.type)) {
      removeFromWatchlist(show.id, show.type);
    } else {
      addToWatchlist(show);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-20 px-4">
        <h1 className="text-3xl text-white font-bold mb-8">Popular TV Shows</h1>
        
        {loading && page === 1 ? (
          <div className="text-white text-center py-8">Loading TV shows...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {shows.map(show => (
                <div
                  key={show.id}
                  className="relative cursor-pointer group hover:scale-105 transition-transform"
                  onClick={() => navigate(`/tv/${show.id}`)}
                >
                  <img
                    src={show.poster}
                    alt={show.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                        <Play size={16} fill="currentColor" />
                      </button>
                      <button
                        onClick={(e) => handleWishlist(show, e)}
                        className={`p-2 rounded-full ${
                          isInWatchlist(show.id, show.type)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        <Heart size={16} fill={isInWatchlist(show.id, show.type) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-white text-sm font-medium truncate">{show.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>★ {show.rating?.toFixed(1)}</span>
                      <span>{show.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={() => setPage(prev => prev + 1)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TVShowsPage;