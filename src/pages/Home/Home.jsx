import Navbar from "../../components/Navbar/Navbar";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchTVShows, getImageUrl } from "../../utils/api";

const Home = () => {
  const navigate = useNavigate();
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [loading, setLoading] = useState(true);

  const fetchHeroMovies = async () => {
    try {
      const data = await fetchTVShows();
      const heroContent = data.results?.slice(0, 5).map(show => ({
        id: show.id,
        title: show.name,
        overview: show.overview,
        backdrop: getImageUrl(show.backdrop_path, 'w1280'),
        poster: getImageUrl(show.poster_path, 'w500'),
        rating: show.vote_average,
        year: show.first_air_date?.split('-')[0],
        type: 'tv'
      })) || [];
      setHeroMovies(heroContent);
    } catch (error) {
      console.error('Error fetching hero movies:', error);
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
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen flex items-center overflow-hidden">
        {loading ? (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black w-full"
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
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src={currentMovie?.backdrop} 
                alt={currentMovie?.title} 
                className="w-full h-full object-cover sm:object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1920x1080?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 sm:bg-gradient-to-r sm:from-black/70 sm:via-black/30 sm:to-transparent" />
            </div>
            
            <div className="absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-16 left-3 right-3 sm:left-6 sm:right-auto md:left-8 lg:left-12 z-20 sm:max-w-md md:max-w-lg lg:max-w-2xl">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4 md:mb-6 leading-tight text-center sm:text-left">
                {currentMovie?.title}
              </h1>
              
              <div className="hidden sm:block mb-3 md:mb-4">
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3">
                  {currentMovie?.overview}
                </p>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 md:gap-6 mb-3 sm:mb-5 md:mb-6 flex-wrap">
                <div className="flex items-center gap-1 text-white font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Star size={12} sm:size={16} md:size={18} fill="currentColor" className="text-yellow-400" />
                  <span className="text-xs sm:text-base md:text-lg font-semibold">{currentMovie?.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-white font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Calendar size={12} sm:size={16} md:size={18} />
                  <span className="text-xs sm:text-base md:text-lg">{currentMovie?.year}</span>
                </div>
                <div className="bg-red-600 text-white px-2 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm md:text-base font-bold">
                  HD
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button 
                  className="bg-red-600 text-white px-3 py-2 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-md sm:rounded-xl text-xs sm:text-base md:text-lg font-bold cursor-pointer hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center gap-1 sm:gap-3 shadow-lg w-full sm:w-auto"
                  onClick={() => {
                    if (currentMovie?.id) {
                      navigate(`/tv/${currentMovie.id}`);
                    }
                  }}
                >
                  <Play size={12} className="sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" />
                  <span>Watch Now</span>
                </button>
                
                <button 
                  className="bg-white/20 text-white border border-white/30 px-3 py-2 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-md sm:rounded-xl text-xs sm:text-base md:text-lg font-medium cursor-pointer hover:bg-white/30 transition-all transform hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-1 sm:gap-3 shadow-lg w-full sm:w-auto"
                  onClick={() => {
                    if (currentMovie?.id) {
                      navigate(`/tv/${currentMovie.id}`);
                    }
                  }}
                >
                  <Info size={12} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  <span>More Info</span>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Arrows */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-3 sm:px-4 md:px-8 z-30">
          <button 
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-black/70 rounded-full text-white cursor-pointer flex items-center justify-center hover:bg-black/90 transition-all transform hover:scale-110 shadow-lg backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft size={18} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
          
          <button 
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-black/70 rounded-full text-white cursor-pointer flex items-center justify-center hover:bg-black/90 transition-all transform hover:scale-110 shadow-lg backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight size={18} className="sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </button>
        </div>
        
        {/* Slide Indicators */}
        <div className="hidden sm:flex absolute bottom-1 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 gap-2 sm:gap-3 md:gap-4 z-30 bg-black/30 px-3 py-2 rounded-full backdrop-blur-sm">
          {heroMovies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full cursor-pointer transition-all transform hover:scale-125 ${
                index === currentSlide 
                  ? 'bg-red-600 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80'
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
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
