import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Maximize, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { secureFetch, getMovieDetailsEndpoint, getTVDetailsEndpoint, sanitizeForLog } from '../../utils/api';
import Popunder from '../../components/Popunder/Popunder';
import SocialBar from '../../components/SocialBar/SocialBar';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Determine content type from URL path
  const currentPath = window.location.pathname;
  const contentType = currentPath.includes('/tv/') ? 'tv' : 'movie';

  useEffect(() => {
    const fetchContentDetails = async () => {
      try {
        let data;
        if (contentType === 'tv') {
          data = await secureFetch(getTVDetailsEndpoint(id));
        } else {
          data = await secureFetch(getMovieDetailsEndpoint(id));
        }
        
        if (!data) {
          throw new Error('No data received from API');
        }
        
        setMovie({
          id: data.id,
          title: data.title || data.name || 'Unknown Title',
          overview: data.overview || 'No description available',
          backdrop: data.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : null,
          rating: data.vote_average || 0,
          year: (data.release_date || data.first_air_date)?.split('-')[0] || 'N/A',
          runtime: data.runtime || (data.episode_run_time && data.episode_run_time[0]) || 'N/A',
          genres: data.genres || [],
          imdb: data.external_ids?.imdb_id || `tmdb_${data.id}`,
          type: contentType
        });
      } catch (error) {
        console.error('Error fetching content details:', sanitizeForLog(error.message));
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContentDetails();
    }
  }, [id, contentType]);

  const toggleFullscreen = () => {
    const iframe = document.querySelector('.player-iframe');
    if (!document.fullscreenElement) {
      iframe.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="h-screen flex flex-col items-center justify-center gap-5">
          <div className="w-12 h-12 border-2 border-red-600 border-opacity-30 border-t-red-600 rounded-full animate-spin"></div>
          <p className="text-lg text-white/80">Loading player...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-black min-h-screen text-white">
        <div className="h-screen flex flex-col items-center justify-center gap-5">
          <h2 className="text-2xl">Movie not found</h2>
          <motion.button 
            onClick={() => navigate('/')} 
            className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 px-6 py-3 rounded-lg cursor-pointer text-base font-semibold hover:-translate-y-0.5 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Home
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <motion.div 
        className="px-4 md:px-5 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 border-b border-white/10 bg-black/90 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button 
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-3 md:px-4 py-2 md:py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium hover:bg-white/20 hover:border-white/30"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} md:size={20} />
          <span>Back</span>
        </motion.button>
        
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-white/70 text-xs md:text-sm">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            <span>•</span>
            <span>⭐ {movie.rating?.toFixed(1)}</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="p-4 md:p-6 max-w-7xl mx-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative w-full aspect-video rounded-lg md:rounded-xl overflow-hidden shadow-2xl group">
          <iframe
            className="w-full h-full border-0"
            src={(() => {
              const movieId = movie.imdb.startsWith('tt') ? movie.imdb : movie.id;
              
              switch (movie.type) {
                case 'tv':
                  return `https://embed.su/embed/tv/${movieId}/1/1`;
                default:
                  return `https://embed.su/embed/movie/${movieId}`;
              }
            })()}
            title={movie.title}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
          
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button 
              className="w-10 h-10 bg-black/70 border border-white/20 rounded-lg text-white cursor-pointer flex items-center justify-center transition-all backdrop-blur-sm hover:bg-red-600/80 hover:border-red-600/80"
              onClick={toggleFullscreen}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Maximize size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="px-4 md:px-6 py-8 md:py-10 max-w-7xl mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
          <div className="lg:col-span-2">
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Overview</h3>
            <p className="text-sm md:text-base leading-relaxed text-white/80">{movie.overview}</p>
          </div>
          
          <div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-white">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="bg-red-600/20 text-red-400 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs font-medium border border-red-600/30">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <Popunder />
      <SocialBar />
    </div>
  );
};

export default Player;
