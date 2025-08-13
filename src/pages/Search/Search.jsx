import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [defaultMovies, setDefaultMovies] = useState([]);
  const [defaultLoading, setDefaultLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
  const BASE_URL = 'https://api.themoviedb.org/3';

  if (!API_KEY) {
    console.error('TMDB API key not found in environment variables');
  }

  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const [movieResponse, tvResponse] = await Promise.all([
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
      ]);
      
      const [movieData, tvData] = await Promise.all([
        movieResponse.json(),
        tvResponse.json()
      ]);
      
      const movieSuggestions = movieData.results.slice(0, 5).map(item => ({
        title: item.title,
        year: item.release_date?.split('-')[0] || 'N/A',
        type: 'Movie',
        poster: item.poster_path 
          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
          : 'https://via.placeholder.com/92x138?text=No+Image'
      }));
      
      const tvSuggestions = tvData.results.slice(0, 5).map(item => ({
        title: item.name,
        year: item.first_air_date?.split('-')[0] || 'N/A',
        type: 'TV Series',
        poster: item.poster_path 
          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
          : 'https://via.placeholder.com/92x138?text=No+Image'
      }));
      
      setSuggestions([...movieSuggestions, ...tvSuggestions].slice(0, 8));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setShowSuggestions(false);
    try {
      const [movieResponse, tvResponse] = await Promise.all([
        fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
        fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
      ]);
      
      const [movieData, tvData] = await Promise.all([
        movieResponse.json(),
        tvResponse.json()
      ]);
      
      const movieResults = await Promise.all(
        movieData.results.slice(0, 10).map(async (movie) => {
          try {
            const detailResponse = await fetch(
              `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=external_ids`
            );
            const detailData = await detailResponse.json();
            
            return {
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
              imdb: detailData.external_ids?.imdb_id || `tmdb_${movie.id}`,
              year: movie.release_date?.split('-')[0] || 'N/A',
              overview: movie.overview,
              type: 'Movie'
            };
          } catch (error) {
            return {
              id: movie.id,
              title: movie.title,
              poster: movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
              imdb: `tmdb_${movie.id}`,
              year: movie.release_date?.split('-')[0] || 'N/A',
              overview: movie.overview,
              type: 'Movie'
            };
          }
        })
      );
      
      const tvResults = await Promise.all(
        tvData.results.slice(0, 10).map(async (show) => {
          try {
            const detailResponse = await fetch(
              `${BASE_URL}/tv/${show.id}?api_key=${API_KEY}&append_to_response=external_ids`
            );
            const detailData = await detailResponse.json();
            
            return {
              id: show.id,
              title: show.name,
              poster: show.poster_path 
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
              imdb: detailData.external_ids?.imdb_id || `tmdb_${show.id}`,
              year: show.first_air_date?.split('-')[0] || 'N/A',
              overview: show.overview,
              type: 'TV Series'
            };
          } catch (error) {
            return {
              id: show.id,
              title: show.name,
              poster: show.poster_path 
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
              imdb: `tmdb_${show.id}`,
              year: show.first_air_date?.split('-')[0] || 'N/A',
              overview: show.overview,
              type: 'TV Series'
            };
          }
        })
      );
      
      setSearchResults([...movieResults, ...tvResults]);
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const suggestionTimeout = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    const searchTimeout = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery);
      }
    }, 800);

    return () => {
      clearTimeout(suggestionTimeout);
      clearTimeout(searchTimeout);
    };
  }, [searchQuery]);

  const fetchDefaultMovies = async () => {
    setDefaultLoading(true);
    try {
      const [popularResponse, trendingResponse] = await Promise.all([
        fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`),
        fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`)
      ]);
      
      const [popularData, trendingData] = await Promise.all([
        popularResponse.json(),
        trendingResponse.json()
      ]);
      
      const combinedResults = [...popularData.results.slice(0, 10), ...trendingData.results.slice(0, 10)];
      const uniqueResults = combinedResults.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );
      
      const moviesWithDetails = await Promise.all(
        uniqueResults.slice(0, 20).map(async (item) => {
          const isMovie = item.title !== undefined;
          try {
            const detailResponse = await fetch(
              `${BASE_URL}/${isMovie ? 'movie' : 'tv'}/${item.id}?api_key=${API_KEY}&append_to_response=external_ids`
            );
            const detailData = await detailResponse.json();
            
            return {
              id: item.id,
              title: isMovie ? item.title : item.name,
              poster: item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
              imdb: detailData.external_ids?.imdb_id || `tmdb_${item.id}`,
              year: isMovie 
                ? item.release_date?.split('-')[0] || 'N/A'
                : item.first_air_date?.split('-')[0] || 'N/A',
              overview: item.overview,
              type: isMovie ? 'Movie' : 'TV Series'
            };
          } catch (error) {
            return {
              id: item.id,
              title: isMovie ? item.title : item.name,
              poster: item.poster_path 
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image',
              imdb: `tmdb_${item.id}`,
              year: isMovie 
                ? item.release_date?.split('-')[0] || 'N/A'
                : item.first_air_date?.split('-')[0] || 'N/A',
              overview: item.overview,
              type: isMovie ? 'Movie' : 'TV Series'
            };
          }
        })
      );
      
      setDefaultMovies(moviesWithDetails);
    } catch (error) {
      console.error('Error fetching default movies:', error);
      setDefaultMovies([]);
    } finally {
      setDefaultLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    searchMovies(suggestion.title);
  };

  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-20 md:pt-24 pb-12 px-4 md:px-6 lg:px-[6%]">
        <motion.div 
          className="mb-8 md:mb-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <input
            type="text"
            placeholder="Search for movies and TV series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full max-w-2xl px-4 md:px-5 py-3 md:py-4 text-sm md:text-base bg-white/10 border border-white/30 rounded-lg text-white outline-none placeholder:text-white/70 focus:border-white focus:bg-white/15 transition-all"
          />
          {showSuggestions && suggestions.length > 0 && (
            <motion.div 
              className="absolute top-full left-0 right-0 max-w-2xl bg-gray-900/95 border border-white/20 rounded-lg max-h-80 overflow-y-auto z-50 backdrop-blur-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {suggestions.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  className="p-3 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors hover:bg-white/10 flex items-center gap-3"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <img 
                    src={suggestion.poster} 
                    alt={suggestion.title}
                    className="w-10 h-15 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-white text-base font-medium">{suggestion.title}</span>
                    <span className="text-white/60 text-sm">{suggestion.year} • {suggestion.type}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {searchQuery ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-8 text-2xl text-white font-semibold">Search Results for "{searchQuery}"</h2>
            {loading ? (
              <div className="text-center py-12 text-white/70 text-lg">Searching movies...</div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {searchResults.map((movie, idx) => (
                  <motion.div 
                    className="relative rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 group" 
                    key={idx} 
                    onClick={() => {
                      const id = movie.id || movie.imdb.replace('tmdb_', '');
                      if (movie.type === 'TV Series') {
                        navigate(`/tv/${id}`);
                      } else {
                        navigate(`/movie/${id}`);
                      }
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={movie.poster} alt={movie.title} className="w-full h-80 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white text-base font-semibold mb-1">{movie.title}</h3>
                      <p className="text-white/80 text-sm mb-2">{movie.year} • {movie.type}</p>
                      <motion.button 
                        className="bg-red-600 text-white border-0 px-4 py-2 rounded cursor-pointer font-semibold transition-colors hover:bg-red-700 flex items-center gap-2"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedMovie(movie);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play size={14} fill="currentColor" /> Play
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/70 text-lg">No movies found for "{searchQuery}"</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-8 text-2xl text-white font-semibold">Popular Movies & TV Shows</h2>
            {defaultLoading ? (
              <div className="text-center py-12 text-white/70 text-lg">Loading popular content...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {defaultMovies.map((movie, idx) => (
                  <motion.div 
                    className="relative rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 group" 
                    key={idx} 
                    onClick={() => {
                      const id = movie.id || movie.imdb.replace('tmdb_', '');
                      if (movie.type === 'TV Series') {
                        navigate(`/tv/${id}`);
                      } else {
                        navigate(`/movie/${id}`);
                      }
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={movie.poster} alt={movie.title} className="w-full h-80 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white text-base font-semibold mb-1">{movie.title}</h3>
                      <p className="text-white/80 text-sm mb-2">{movie.year} • {movie.type}</p>
                      <motion.button 
                        className="bg-red-600 text-white border-0 px-4 py-2 rounded cursor-pointer font-semibold transition-colors hover:bg-red-700 flex items-center gap-2"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedMovie(movie);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play size={14} fill="currentColor" /> Play
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setSelectedMovie(null)}>
          <div className="w-[90%] max-w-4xl h-[60vh] md:h-[450px] rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe
              src={(() => {
                const movieId = selectedMovie.imdb.startsWith('tt') ? selectedMovie.imdb : selectedMovie.id;
                return selectedMovie.type === 'TV Series' 
                  ? `https://vidsrc.cc/v2/embed/tv/${movieId}/1/1`
                  : `https://vidsrc.cc/v2/embed/movie/${movieId}`;
              })()}
              title={selectedMovie.title}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Search;