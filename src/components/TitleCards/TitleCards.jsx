import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import PropTypes from 'prop-types';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';
import { useData } from '../../context/DataContext';
import { getMobileOptimizedUrl, getMobileHeaders } from '../../utils/mobileDetection';


// Constants
const API_KEY = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
  console.error('TMDB API key not found in environment variables');
}
const MAX_MOVIES = 12;

// Utility function to generate responsive image URLs
const getImageUrl = (path, type = 'poster') => {
  if (!path) {
    return type === 'poster'
      ? 'https://via.placeholder.com/154x231?text=No+Poster'
      : 'https://via.placeholder.com/780x440?text=No+Backdrop';
  }
  return `https://image.tmdb.org/t/p/${type === 'poster' ? 'w154' : 'w780'}${path}`;
};

const getImageSrcSet = (filename) => {
  if (!filename || !filename.startsWith('/')) return '';
  return `https://image.tmdb.org/t/p/w154${filename} 154w, https://image.tmdb.org/t/p/w342${filename} 342w, https://image.tmdb.org/t/p/w500${filename} 500w`;
};

// Utility function to sanitize and truncate text
const sanitizeText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const TitleCards = ({ title, category = 'movie' }) => {
  const cardsRef = useRef();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchlistItems, setWatchlistItems] = useState(new Set());
  const { getData, setData } = useData();


  const getApiEndpoint = () => {
    switch (category) {
      case 'movie':
        return `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
      case 'tv':
        return `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`;
      default:
        return `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
    }
  };

  const fetchMovies = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    const baseCacheKey = `${category}_${title || 'popular'}`;

    // Skip localStorage caching to prevent storage full issues

    try {
      const url = getApiEndpoint();
      
      // Add delay between requests to avoid rate limiting
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      }
      
      const optimizedUrl = getMobileOptimizedUrl(url);
      const response = await fetch(optimizedUrl, {
        method: 'GET',
        headers: getMobileHeaders(),
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        if (response.status === 503 && retryCount < 3) {
          console.log(`Retrying... attempt ${retryCount + 1}`);
          return fetchMovies(retryCount + 1);
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const formattedMovies = data.results.slice(0, MAX_MOVIES).map((item) => ({
        id: item.id,
        title: sanitizeText(item.title || item.name),
        poster: getImageUrl(item.poster_path, 'poster'),
        backdrop: getImageUrl(item.backdrop_path || item.poster_path, 'backdrop'),
        overview: sanitizeText(item.overview, 150),
        rating: item.vote_average,
        year: (item.release_date || item.first_air_date)?.split('-')[0] || 'N/A',
        imdb: `tmdb_${item.id}`,
        type: category,
      }));

      // No localStorage caching to prevent storage issues

      setMovies(formattedMovies);
      setData(baseCacheKey, formattedMovies);
    } catch (error) {
      console.error('Error fetching content:', error);
      if (error.message.includes('503')) {
        setError('TMDB service temporarily unavailable. Please refresh the page.');
      } else if (error.name === 'TypeError') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load content. Please clear browser cache and try again.');
      }
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce API calls
    const timer = setTimeout(() => {
      fetchMovies();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [title, category]);

  useEffect(() => {
    // Update watchlist state when movies change
    const watchlistSet = new Set();
    movies.forEach(movie => {
      if (isInWatchlist(movie.id, movie.type)) {
        watchlistSet.add(`${movie.id}-${movie.type}`);
      }
    });
    setWatchlistItems(watchlistSet);
  }, [movies]);

  const handleWishlistToggle = (movie, e) => {
    e.stopPropagation();
    const key = `${movie.id}-${movie.type}`;
    const newWatchlistItems = new Set(watchlistItems);
    
    if (watchlistItems.has(key)) {
      removeFromWatchlist(movie.id, movie.type);
      newWatchlistItems.delete(key);
    } else {
      addToWatchlist(movie);
      newWatchlistItems.add(key);
    }
    
    setWatchlistItems(newWatchlistItems);
  };



  return (
    <div className="mt-16 mb-12 px-4 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-2xl sm:text-3xl text-white font-bold relative">
        {title || 'Trending Now'}
        <div className="absolute -bottom-2 left-0 h-1 w-16 bg-red-600 rounded-full" />
      </h2>

      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3"
        ref={cardsRef}
      >
        {loading ? (
          <div className="col-span-full text-gray-400 text-center py-12 text-base">
            Loading movies...
          </div>
        ) : error ? (
          <div className="col-span-full text-red-400 text-center py-12 text-base">
            {error}
          </div>
        ) : (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="relative w-full aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-300"
              onClick={() => {
                if (movie.type === 'tv') {
                  navigate(`/tv/${movie.id}`);
                } else {
                  navigate(`/movie/${movie.id}`);
                }
              }}
            >
              <img
                className="w-full h-full object-cover"
                src={movie.poster}
                srcSet={getImageSrcSet(movie.poster.includes('tmdb.org') ? movie.poster.split('/').pop() : '')}
                sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 15vw"
                alt={`${movie.title} poster`}
                loading="lazy"
                width="154"
                height="231"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-semibold text-xs mb-2 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-xs">★ {movie.rating?.toFixed(1)}</span>
                  <span className="text-gray-300 text-xs">{movie.year}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Removed custom event dispatch for security
                    }}
                  >
                    <Play size={10} fill="currentColor" />
                    Play
                  </button>
                  <button
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                      watchlistItems.has(`${movie.id}-${movie.type}`)
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                    onClick={(e) => handleWishlistToggle(movie, e)}
                  >
                    <Heart 
                      size={10} 
                      fill={watchlistItems.has(`${movie.id}-${movie.type}`) ? 'currentColor' : 'none'} 
                    />
                    {watchlistItems.has(`${movie.id}-${movie.type}`) ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


    </div>
  );
};

TitleCards.propTypes = {
  title: PropTypes.string,
  category: PropTypes.oneOf(['movie', 'tv']),
};

export default TitleCards;
