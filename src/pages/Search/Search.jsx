import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Play, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { searchContent, getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query);
    }
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await searchContent(searchQuery);
      const searchResults = data.results?.map(item => ({
        id: item.id,
        title: item.title || item.name,
        poster: getImageUrl(item.poster_path, 'w342'),
        rating: item.vote_average,
        year: (item.release_date || item.first_air_date)?.split('-')[0],
        overview: item.overview,
        type: item.media_type === 'tv' ? 'tv' : 'movie'
      })).filter(item => item.type === 'movie' || item.type === 'tv') || [];
      
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      performSearch(query);
    }
  };

  const handleWishlist = (item, e) => {
    e.stopPropagation();
    if (isInWatchlist(item.id, item.type)) {
      removeFromWatchlist(item.id, item.type);
    } else {
      addToWatchlist(item);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <div className="pt-20 px-4">
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies and TV shows..."
              className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <SearchIcon size={20} />
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-white text-center py-8">Searching...</div>
        ) : results.length > 0 ? (
          <>
            <h2 className="text-2xl text-white font-bold mb-6">
              Search Results for "{searchParams.get('q')}"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map(item => (
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
          </>
        ) : searchParams.get('q') ? (
          <div className="text-center py-12">
            <h2 className="text-2xl text-white font-bold mb-4">No Results Found</h2>
            <p className="text-gray-400">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl text-white font-bold mb-4">Search Movies & TV Shows</h2>
            <p className="text-gray-400">Enter a title to start searching</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;