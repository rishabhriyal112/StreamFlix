import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Star, Calendar, Tv, ChevronDown, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';



const TVShow = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState(1);

  const API_KEY = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
  const BASE_URL = 'https://api.themoviedb.org/3';

  if (!API_KEY) {
    console.error('TMDB API key not found in environment variables');
  }

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=external_ids,credits,videos`
        );
        const data = await response.json();
        
        const showData = {
          id: data.id,
          title: data.name,
          overview: data.overview,
          backdrop: data.backdrop_path 
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : `https://image.tmdb.org/t/p/original${data.poster_path}`,
          poster: data.poster_path 
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Image',
          rating: data.vote_average,
          year: data.first_air_date?.split('-')[0] || 'N/A',
          seasons: data.number_of_seasons,
          episodes: data.number_of_episodes,
          genres: data.genres,
          cast: data.credits?.cast?.slice(0, 6) || [],
          imdb: data.external_ids?.imdb_id || `tmdb_${data.id}`,
          type: 'tv'
        };
        setShow(showData);
        setInWatchlist(isInWatchlist(data.id, 'tv'));
        
        // Fetch first season details to get initial episode count
        try {
          const seasonResponse = await fetch(`${BASE_URL}/tv/${id}/season/1?api_key=${API_KEY}`);
          const seasonData = await seasonResponse.json();
          setSeasonEpisodes(seasonData.episodes?.length || 1);
        } catch (error) {
          console.error('Error fetching season 1 details:', error);
          setSeasonEpisodes(1);
        }
      } catch (error) {
        console.error('Error fetching TV show details:', error);
        setSeasonEpisodes(1);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShowDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="w-12 h-12 border-2 border-red-600 border-opacity-30 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <h2 className="text-white text-2xl">TV Show not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      
      <motion.div 
        className="relative h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <img src={show.backdrop} alt={show.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 flex items-end h-full p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-6xl w-full">
            <motion.div 
              className="flex-shrink-0 mx-auto md:mx-0"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src={show.poster} alt={show.title} className="w-48 md:w-80 rounded-lg shadow-2xl" />
            </motion.div>
            
            <motion.div 
              className="flex-1 pb-8 md:pb-20 text-center md:text-left"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-4">{show.title}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star size={16} md:size={20} fill="currentColor" className="text-yellow-400" />
                  <span className="text-white text-sm md:text-lg">{show.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} md:size={20} className="text-white" />
                  <span className="text-white text-sm md:text-lg">{show.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tv size={16} md:size={20} className="text-white" />
                  <span className="text-white text-sm md:text-lg">{show.seasons} Season{show.seasons > 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {show.genres?.map((genre) => (
                  <span key={genre.id} className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs md:text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="text-white/90 text-sm md:text-lg mb-8 leading-relaxed max-w-3xl">{show.overview}</p>
              
              {/* Season and Episode Selection */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                <div className="relative">
                  <button 
                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowSeasonDropdown(!showSeasonDropdown)}
                  >
                    <span>Season {selectedSeason}</span>
                    <ChevronDown size={16} />
                  </button>
                  {showSeasonDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-10 min-w-[120px]">
                      {Array.from({ length: show.seasons }, (_, i) => i + 1).map((season) => (
                        <button
                          key={season}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                          onClick={async () => {
                            setSelectedSeason(season);
                            setSelectedEpisode(1);
                            setShowSeasonDropdown(false);
                            // Fetch season details to get episode count
                            try {
                              const seasonResponse = await fetch(`${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}`);
                              const seasonData = await seasonResponse.json();
                              setSeasonEpisodes(seasonData.episodes?.length || 1);
                            } catch (error) {
                              console.error('Error fetching season details:', error);
                              setSeasonEpisodes(1);
                            }
                          }}
                        >
                          Season {season}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowEpisodeDropdown(!showEpisodeDropdown)}
                  >
                    <span>Episode {selectedEpisode}</span>
                    <ChevronDown size={16} />
                  </button>
                  {showEpisodeDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-10 min-w-[120px] max-h-48 overflow-y-auto">
                      {Array.from({ length: seasonEpisodes }, (_, i) => i + 1).map((episode) => (
                        <button
                          key={episode}
                          className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => {
                            setSelectedEpisode(episode);
                            setShowEpisodeDropdown(false);
                          }}
                        >
                          Episode {episode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <motion.button 
                  className="flex items-center justify-center gap-2 md:gap-3 bg-red-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-lg font-bold hover:bg-red-700 transition-colors w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedShow({ ...show, season: selectedSeason, episode: selectedEpisode })}
                >
                  <Play size={20} md:size={24} fill="currentColor" />
                  <span>Watch S{selectedSeason}E{selectedEpisode}</span>
                </motion.button>
                
                <motion.button 
                  className={`flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-lg font-medium transition-colors backdrop-blur-sm w-full sm:w-auto ${
                    inWatchlist 
                      ? 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30' 
                      : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (inWatchlist) {
                      removeFromWatchlist(show.id, 'tv');
                      setInWatchlist(false);
                    } else {
                      addToWatchlist(show);
                      setInWatchlist(true);
                    }
                  }}
                >
                  <Heart size={20} md:size={24} fill={inWatchlist ? 'currentColor' : 'none'} />
                  <span>{inWatchlist ? 'In My List' : 'My List'}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {show.cast?.length > 0 && (
        <motion.div 
          className="px-4 md:px-8 py-8 md:py-16 bg-black"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center md:text-left">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {show.cast.map((actor) => (
              <div key={actor.id} className="text-center">
                <img 
                  src={actor.profile_path 
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+Image'
                  }
                  alt={actor.name}
                  className="w-full rounded-lg mb-3"
                />
                <h4 className="text-white font-semibold text-xs md:text-sm">{actor.name}</h4>
                <p className="text-gray-400 text-xs">{actor.character}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}



      {selectedShow && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setSelectedShow(null)}>
          <div className="w-[90%] max-w-4xl h-[60vh] md:h-[450px] rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe
              src={`https://vidsrc.cc/v2/embed/tv/${selectedShow.imdb.startsWith('tt') ? selectedShow.imdb : selectedShow.id}/${selectedShow.season}/${selectedShow.episode}`}
              title={`${selectedShow.title} - S${selectedShow.season}E${selectedShow.episode}`}
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

export default TVShow;