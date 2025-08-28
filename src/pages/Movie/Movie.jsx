import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchMovieDetails, fetchMovies, getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const getPlayerUrl = (source, movieId) => {
  const id = encodeURIComponent(movieId);
  const urls = {
    vidsrc: `https://vidsrc.cc/v2/embed/movie/${id}`,
    videasy: `https://player.videasy.net/movie/${id}`,
    vidlink: `https://vidlink.pro/movie/${id}`
  };
  return urls[source] || urls.vidsrc;
};

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [sliderMovies, setSliderMovies] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [playerSource, setPlayerSource] = useState('vidsrc');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [movieData, moviesData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovies('popular')
        ]);
        
        // Set current movie
        setMovie({
          id: movieData.id,
          title: movieData.title,
          overview: movieData.overview,
          poster: getImageUrl(movieData.poster_path, 'w500'),
          backdrop: getImageUrl(movieData.backdrop_path, 'w1280'),
          rating: movieData.vote_average,
          year: movieData.release_date?.split('-')[0],
          runtime: movieData.runtime,
          genres: movieData.genres?.map(g => g.name).join(', '),
          cast: movieData.credits?.cast?.slice(0, 5).map(c => c.name).join(', '),
          type: 'movie'
        });
        
        // Set slider movies
        const movies = moviesData.results?.slice(0, 5).map(item => ({
          id: item.id,
          title: item.title,
          overview: item.overview,
          backdrop: getImageUrl(item.backdrop_path, 'w1280'),
          rating: item.vote_average,
          year: item.release_date?.split('-')[0],
          type: 'movie'
        })) || [];
        setSliderMovies(movies);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!isHovered && sliderMovies.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % sliderMovies.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderMovies.length, isHovered]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % sliderMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + sliderMovies.length) % sliderMovies.length);
  };

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const handleSlideClick = (slideMovie) => {
    navigate(`/movie/${slideMovie.id}`);
  };

  const handleWishlist = () => {
    if (!movie) return;
    if (isInWatchlist(movie.id, movie.type)) {
      removeFromWatchlist(movie.id, movie.type);
    } else {
      addToWatchlist(movie);
    }
  };

  if (loading) return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    </div>
  );

  if (!movie) return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Movie not found</div>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      


      {/* Player */}
      {showPlayer && (
        <div className="mt-20">
          <div className="w-[90%] mx-auto mb-4">
            <select 
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600"
              onChange={(e) => setPlayerSource(e.target.value)}
              value={playerSource}
            >
              <option value="vidsrc">VidSrc</option>
              <option value="videasy">Videasy</option>
              <option value="vidlink">VidLink</option>
            </select>
          </div>
          <div className="w-[90%] mx-auto h-[calc(100vh-80px)] border-4 border-white rounded-xl overflow-hidden relative">
            <div className="absolute top-4 left-4 text-white text-lg font-semibold z-10">
              {movie.title}
            </div>
            <iframe
              src={getPlayerUrl(playerSource, movie.id)}
              title={movie.title}
              frameBorder="0"
              allowFullScreen
              allow="encrypted-media"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
      
      {/* Movie Info Card */}
      <div className="px-8 pt-20 pb-16">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          <div className="flex gap-8">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-xl shadow-2xl flex-shrink-0"
            />
            
            <div className="flex-1">
              <h1 className="text-5xl text-white font-bold mb-6">{movie.title}</h1>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star size={18} fill="currentColor" className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{movie.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                  <Calendar size={18} className="text-blue-400" />
                  <span className="text-blue-400 font-semibold">{movie.year}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                    <Clock size={18} className="text-green-400" />
                    <span className="text-green-400 font-semibold">{movie.runtime}min</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">{movie.overview}</p>
              
              {movie.genres && (
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Genres: </span>
                  <span className="text-white">{movie.genres}</span>
                </div>
              )}
              
              {movie.cast && (
                <div className="mb-8">
                  <span className="text-gray-400 font-medium">Cast: </span>
                  <span className="text-white">{movie.cast}</span>
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPlayer(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-3 shadow-lg transform hover:scale-105"
                >
                  <Play size={22} fill="currentColor" />
                  Watch Now
                </button>
                
                <button
                  onClick={handleWishlist}
                  className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 shadow-lg transform hover:scale-105 ${
                    isInWatchlist(movie.id, movie.type)
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                  }`}
                >
                  <Heart size={22} fill={isInWatchlist(movie.id, movie.type) ? 'currentColor' : 'none'} />
                  {isInWatchlist(movie.id, movie.type) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Movie;