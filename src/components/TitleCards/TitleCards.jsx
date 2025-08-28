import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import { fetchMovies, fetchTVShows, getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const TitleCards = ({ title, category = 'movie' }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = category === 'tv' ? await fetchTVShows() : await fetchMovies();
        const content = data.results?.slice(0, 12).map(item => ({
          id: item.id,
          title: item.title || item.name,
          poster: getImageUrl(item.poster_path, 'w342'),
          rating: item.vote_average,
          year: (item.release_date || item.first_air_date)?.split('-')[0],
          type: category
        })) || [];
        setMovies(content);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [category]);

  const handleWishlist = (movie, e) => {
    e.stopPropagation();
    if (isInWatchlist(movie.id, movie.type)) {
      removeFromWatchlist(movie.id, movie.type);
    } else {
      addToWatchlist(movie);
    }
  };

  if (loading) return <div className="text-white text-center py-8">Loading...</div>;

  return (
    <div className="mt-8 px-4">
      <h2 className="text-2xl text-white font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map(movie => {
          const inWishlist = isInWatchlist(movie.id, movie.type);
          return (
          <div
            key={movie.id}
            className="relative cursor-pointer group hover:scale-105 transition-transform"
            onClick={() => navigate(`/${movie.type}/${movie.id}`)}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/342x513?text=No+Image';
              }}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                  <Play size={16} fill="currentColor" />
                </button>
                <button
                  onClick={(e) => handleWishlist(movie, e)}
                  className={`p-2 rounded-full ${
                    inWishlist
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
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
        );
        })}
      </div>
    </div>
  );
};

export default TitleCards;