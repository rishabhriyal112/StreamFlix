import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchMovies, getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const MoviesPage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('popular');

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies(category, page);
        const movieList = data.results?.map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: getImageUrl(movie.poster_path, 'w342'),
          rating: movie.vote_average,
          year: movie.release_date?.split('-')[0],
          overview: movie.overview,
          type: 'movie'
        })) || [];
        
        if (page === 1) {
          setMovies(movieList);
        } else {
          setMovies(prev => [...prev, ...movieList]);
        }
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [page, category]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    setMovies([]);
    setLoading(true);
  };

  const handleWishlist = (movie, e) => {
    e.stopPropagation();
    if (isInWatchlist(movie.id, movie.type)) {
      removeFromWatchlist(movie.id, movie.type);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-20 px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-6 text-center">Movies</h1>
          <div className="flex justify-center gap-2 md:gap-4 mb-6">
            {['popular', 'top_rated', 'upcoming'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat === 'top_rated' ? 'Top Rated' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {loading && page === 1 ? (
          <div className="text-white text-center py-8">Loading movies...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {movies.map(movie => (
                <div
                  key={movie.id}
                  className="relative cursor-pointer group hover:scale-105 transition-transform"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="flex gap-2">
                      <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                        <Play size={16} fill="currentColor" />
                      </button>
                      <button
                        onClick={(e) => handleWishlist(movie, e)}
                        className={`p-2 rounded-full ${
                          isInWatchlist(movie.id, movie.type)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        <Heart size={16} fill={isInWatchlist(movie.id, movie.type) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>★ {movie.rating?.toFixed(1)}</span>
                      <span>{movie.year}</span>
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

export default MoviesPage;