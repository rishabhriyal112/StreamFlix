import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Calendar, ChevronDown } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const Anime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);
  const [playerSource, setPlayerSource] = useState('vidlink');

  useEffect(() => {
    const loadAnime = async () => {
      try {
        // Mock anime data - replace with actual API call
        const mockAnime = {
          id: parseInt(id),
          title: 'One Piece',
          overview: 'Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.',
          poster: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
          backdrop: 'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',
          rating: 9.0,
          year: '1999',
          episodes: 1000,
          genres: 'Action, Adventure, Comedy',
          studio: 'Toei Animation',
          type: 'anime'
        };
        
        setAnime(mockAnime);
      } catch (error) {
        console.error('Error loading anime:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnime();
  }, [id]);

  const handleWishlist = () => {
    if (!anime) return;
    if (isInWatchlist(anime.id, anime.type)) {
      removeFromWatchlist(anime.id, anime.type);
    } else {
      addToWatchlist(anime);
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

  if (!anime) return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Anime not found</div>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Player */}
      {showPlayer && (
        <div className="mt-20 px-4">
          <div className="w-full max-w-6xl mx-auto mb-4">
            <select 
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 w-full sm:w-auto"
              onChange={(e) => setPlayerSource(e.target.value)}
              value={playerSource}
            >
              <option value="vidlink">VidLink</option>
              <option value="videasy">Videasy</option>
            </select>
          </div>
          <div className="w-full max-w-6xl mx-auto h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[calc(100vh-120px)] border-2 md:border-4 border-white rounded-xl overflow-hidden relative">
            <div className="absolute top-2 md:top-4 left-2 md:left-4 text-white text-sm md:text-lg font-semibold z-10">
              {anime.title} - Episode {selectedEpisode}
            </div>
            <iframe
              src={playerSource === 'vidlink' 
                ? `https://vidlink.pro/anime/${anime.id}/${selectedEpisode}/sub`
                : `https://player.videasy.net/anime/${anime.id}/${selectedEpisode}`
              }
              title={`${anime.title} Episode ${selectedEpisode}`}
              frameBorder="0"
              allowFullScreen
              allow="encrypted-media"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
      
      {/* Anime Info Card */}
      <div className="px-4 md:px-8 pt-20 pb-16">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full md:w-64 h-auto md:h-96 max-w-sm mx-auto md:mx-0 object-cover rounded-xl shadow-2xl flex-shrink-0"
            />
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-4 md:mb-6">{anime.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-4 md:mb-6">
                <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star size={16} md:size={18} fill="currentColor" className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm md:text-base">{anime.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                  <Calendar size={16} md:size={18} className="text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm md:text-base">{anime.year}</span>
                </div>
                <div className="bg-red-600 text-white px-3 md:px-4 py-1 rounded-full font-semibold text-sm md:text-base">
                  {anime.episodes} Episodes
                </div>
              </div>
              
              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-lg leading-relaxed">{anime.overview}</p>
              
              {anime.genres && (
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Genres: </span>
                  <span className="text-white">{anime.genres}</span>
                </div>
              )}
              
              {anime.studio && (
                <div className="mb-8">
                  <span className="text-gray-400 font-medium">Studio: </span>
                  <span className="text-white">{anime.studio}</span>
                </div>
              )}
            
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEpisodeDropdown(!showEpisodeDropdown);
                    }}
                    className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg"
                  >
                    Episode {selectedEpisode}
                    <ChevronDown size={18} />
                  </button>
                  {showEpisodeDropdown && (
                    <div className="absolute top-full mt-2 bg-gray-800 rounded-xl shadow-2xl z-20 max-h-48 overflow-y-auto min-w-[140px] border border-gray-700">
                      {Array.from({ length: Math.min(anime.episodes, 50) }, (_, i) => i + 1).map(episode => (
                        <button
                          key={episode}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEpisode(episode);
                            setShowEpisodeDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors ${
                            episode === selectedEpisode ? 'bg-red-600' : ''
                          }`}
                        >
                          Episode {episode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  onClick={() => setShowPlayer(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-lg transform hover:scale-105 text-sm md:text-base"
                >
                  <Play size={18} md:size={22} fill="currentColor" />
                  <span className="hidden sm:inline">Watch Episode {selectedEpisode}</span>
                  <span className="sm:hidden">Watch Ep {selectedEpisode}</span>
                </button>
                
                <button
                  onClick={handleWishlist}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 md:gap-3 shadow-lg transform hover:scale-105 text-sm md:text-base ${
                    isInWatchlist(anime.id, anime.type)
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                  }`}
                >
                  <Heart size={18} md:size={22} fill={isInWatchlist(anime.id, anime.type) ? 'currentColor' : 'none'} />
                  <span className="hidden sm:inline">{isInWatchlist(anime.id, anime.type) ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
                  <span className="sm:hidden">{isInWatchlist(anime.id, anime.type) ? 'Remove' : 'Add'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => setShowEpisodeDropdown(false)}
        className={showEpisodeDropdown ? 'fixed inset-0 z-10' : 'hidden'}
      />
      <Footer />
    </div>
  );
};

export default Anime;