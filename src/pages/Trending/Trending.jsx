import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { secureFetch, getImageUrl, sanitizeForLog } from '../../utils/api';

const Trending = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const apiToken = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
        if (!apiToken || typeof apiToken !== 'string' || !/^[a-zA-Z0-9]+$/.test(apiToken)) {
          throw new Error('Invalid API token format');
        }
        
        const [moviesData, tvData] = await Promise.all([
          secureFetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiToken}`),
          secureFetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiToken}`)
        ]);

        if (!moviesData?.results || !tvData?.results) {
          throw new Error('Invalid API response structure');
        }

        setTrendingMovies(moviesData.results.slice(0, 12));
        setTrendingTV(tvData.results.slice(0, 12));
      } catch (error) {
        console.error('Error fetching trending:', sanitizeForLog(error.message));
        setTrendingMovies([]);
        setTrendingTV([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleItemClick = (item, type) => {
    if (type === 'tv') {
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
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 flex flex-col md:flex-row items-center justify-center gap-3">
              <TrendingUp className="text-red-600" size={36} md:size={48} />
              <span>Trending This Week</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg">Most popular movies and TV shows</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div 
                className="w-8 h-8 border-2 border-red-600 border-opacity-30 border-t-red-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <div className="space-y-12 md:space-y-16">
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center justify-center md:justify-start gap-3">
                  🎬 Trending Movies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {trendingMovies.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleItemClick(movie, 'movie')}
                    >
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        #{index + 1}
                      </div>
                      <img
                        src={getImageUrl(movie.poster_path, 'poster')}
                        alt={movie.title}
                        className="w-full h-80 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-4">
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{movie.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <Star size={12} fill="currentColor" className="text-yellow-400" />
                          <span>{movie.vote_average?.toFixed(1)}</span>
                          <Calendar size={12} />
                          <span>{movie.release_date?.split('-')[0]}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 flex items-center justify-center md:justify-start gap-3">
                  📺 Trending TV Shows
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {trendingTV.map((show, index) => (
                    <motion.div
                      key={show.id}
                      className="relative group cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleItemClick(show, 'tv')}
                    >
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        #{index + 1}
                      </div>
                      <img
                        src={getImageUrl(show.poster_path, 'poster')}
                        alt={show.name}
                        className="w-full h-80 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-4">
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{show.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <Star size={12} fill="currentColor" className="text-yellow-400" />
                          <span>{show.vote_average?.toFixed(1)}</span>
                          <Calendar size={12} />
                          <span>{show.first_air_date?.split('-')[0]}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Trending;