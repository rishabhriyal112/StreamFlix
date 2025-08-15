import Navbar from "../../components/Navbar/Navbar";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";
import SEO from "../../components/SEO/SEO";
import SocialBar from "../../components/SocialBar/SocialBar";



import MoneytagAd from "../../components/MoneytagAd/MoneytagAd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { secureFetch, getImageUrl, sanitizeForLog } from "../../utils/api";

const Home = () => {
  const navigate = useNavigate();
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPopunder, setShowPopunder] = useState(false);

  const fetchHeroMovies = async () => {
    try {
      const apiToken = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
      if (!apiToken || typeof apiToken !== 'string' || !/^[a-zA-Z0-9]+$/.test(apiToken)) {
        throw new Error('Invalid API token format');
      }
      
      const data = await secureFetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiToken}&page=1`);
      
      if (!data?.results) {
        throw new Error('Invalid API response structure');
      }
      
      const moviesWithDetails = await Promise.all(
        data.results.slice(0, 5).map(async (show) => {
          try {
            const detailData = await secureFetch(`https://api.themoviedb.org/3/tv/${show.id}?api_key=${apiToken}&append_to_response=external_ids`);
            
            return {
              id: show.id,
              title: show.name || 'Unknown Title',
              overview: show.overview || 'No description available',
              backdrop: getImageUrl(show.backdrop_path || show.poster_path, 'backdrop'),
              poster: getImageUrl(show.poster_path, 'poster'),
              rating: show.vote_average || 0,
              year: show.first_air_date?.split('-')[0] || 'N/A',
              imdb: detailData?.external_ids?.imdb_id || `tmdb_${show.id}`,
              type: 'tv'
            };
          } catch (error) {
            console.error(`Error fetching details for show ${sanitizeForLog(show.id)}:`, sanitizeForLog(error.message));
            return {
              id: show.id,
              title: show.name || 'Unknown Title',
              overview: show.overview || 'No description available',
              backdrop: getImageUrl(show.backdrop_path || show.poster_path, 'backdrop'),
              poster: getImageUrl(show.poster_path, 'poster'),
              rating: show.vote_average || 0,
              year: show.first_air_date?.split('-')[0] || 'N/A',
              imdb: `tmdb_${show.id}`,
              type: 'tv'
            };
          }
        })
      );
      
      setHeroMovies(moviesWithDetails);
    } catch (error) {
      console.error('Error fetching hero movies:', sanitizeForLog(error.message));
      setHeroMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroMovies();
  }, []);

  useEffect(() => {
    if (heroMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [heroMovies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  const currentMovie = heroMovies[currentSlide];

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <SEO 
        title="StreamFlix - Watch Movies & TV Shows Online"
        description="Stream unlimited movies and TV shows on StreamFlix. Discover trending content, create your watchlist, and enjoy HD streaming."
        url="https://streamflix.netlify.app"
      />
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen flex items-center overflow-hidden">
        {loading ? (
          <motion.div 
            className="h-screen flex items-center justify-center bg-black w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div 
              className="w-12 h-12 border-2 border-red-600 border-opacity-30 border-t-red-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <img 
                src={currentMovie?.backdrop} 
                alt={currentMovie?.title} 
                className="w-full h-full object-cover sm:object-cover object-center"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1920x1080?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </div>
            
            <div className="absolute bottom-16 left-4 right-4 md:bottom-20 md:left-8 md:right-auto z-20 max-w-2xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
                {currentMovie?.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-white font-medium">
                  <Star size={16} fill="currentColor" className="text-yellow-400" />
                  <span className="text-sm">{currentMovie?.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-white font-medium">
                  <Calendar size={16} />
                  <span className="text-sm">{currentMovie?.year}</span>
                </div>
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center">
                  HD
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                <button 
                  className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-bold cursor-pointer hover:bg-red-700 transition-colors min-w-[100px] sm:min-w-[120px] h-[36px] sm:h-[40px] flex items-center justify-center gap-1 sm:gap-2"
                  onClick={() => {
                    setTimeout(() => setSelectedMovie(currentMovie), 100);
                  }}
                >
                  <Play size={14} fill="currentColor" />
                  <span>Watch Now</span>
                </button>
                
                <button 
                  className="bg-white/20 text-white border border-white/30 px-4 py-2 sm:px-6 sm:py-3 rounded-lg text-xs sm:text-sm font-medium cursor-pointer hover:bg-white/30 transition-colors backdrop-blur-sm min-w-[90px] sm:min-w-[100px] h-[36px] sm:h-[40px] flex items-center justify-center gap-1 sm:gap-2"
                  onClick={() => {
                    setTimeout(() => navigate(`/tv/${currentMovie?.id}`), 100);
                  }}
                >
                  <Info size={14} />
                  <span>More Info</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Arrows */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 md:px-8 z-30">
          <button 
            className="w-10 h-10 md:w-12 md:h-12 bg-black/60 rounded-full text-white cursor-pointer flex items-center justify-center hover:bg-black/80 transition-colors"
            onClick={prevSlide}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            className="w-10 h-10 md:w-12 md:h-12 bg-black/60 rounded-full text-white cursor-pointer flex items-center justify-center hover:bg-black/80 transition-colors"
            onClick={nextSlide}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-30">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full cursor-pointer transition-all ${
                index === currentSlide 
                  ? 'bg-red-600' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <main className="flex-1" role="main">
        <section className="bg-gradient-to-t from-black via-black/95 to-black/80 pt-12 md:pt-16 lg:pt-20 pb-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="space-y-12 md:space-y-16">
              <section aria-labelledby="trending-movies">
                <TitleCards title="Trending Movies" category="movie" />
              </section>
              <section aria-labelledby="popular-tv">
                <TitleCards title="Popular TV Shows" category="tv" />
              </section>
              <div className="text-center mt-12">
                <button 
                  onClick={() => navigate('/trending')}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  aria-label="View all trending movies and TV shows"
                >
                  View All Trending Content
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>



      {/* Footer */}
      {/* Movie Player Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setSelectedMovie(null)}>
          <div className="w-[90%] max-w-4xl h-[60vh] md:h-[450px] rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe
              src={`https://vidsrc.cc/v2/embed/tv/${selectedMovie.imdb.startsWith('tt') ? selectedMovie.imdb : selectedMovie.id}/1/1`}
              title={selectedMovie.title}
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}




      <SocialBar />
      <Footer />
    </div>
  );
};

export default Home;
