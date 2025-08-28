import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, Star, Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchTVDetails, fetchTVSeason, fetchTVShows, getImageUrl } from '../../utils/api';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const TVShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [showEpisodeDropdown, setShowEpisodeDropdown] = useState(false);
  const [seasonData, setSeasonData] = useState(null);
  const [sliderShows, setSliderShows] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [playerSource, setPlayerSource] = useState('vidsrc');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [showData, showsData] = await Promise.all([
          fetchTVDetails(id),
          fetchTVShows('popular')
        ]);
        
        // Set current show
        setShow({
          id: showData.id,
          title: showData.name,
          overview: showData.overview,
          poster: getImageUrl(showData.poster_path, 'w500'),
          backdrop: getImageUrl(showData.backdrop_path, 'w1280'),
          rating: showData.vote_average,
          year: showData.first_air_date?.split('-')[0],
          seasons: showData.number_of_seasons,
          episodes: showData.number_of_episodes,
          genres: showData.genres?.map(g => g.name).join(', '),
          cast: showData.credits?.cast?.slice(0, 5).map(c => c.name).join(', '),
          type: 'tv'
        });
        
        // Set slider shows
        const shows = showsData.results?.slice(0, 5).map(item => ({
          id: item.id,
          title: item.name,
          overview: item.overview,
          backdrop: getImageUrl(item.backdrop_path, 'w1280'),
          rating: item.vote_average,
          year: item.first_air_date?.split('-')[0],
          type: 'tv'
        })) || [];
        setSliderShows(shows);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (show && selectedSeason) {
      const loadSeasonData = async () => {
        try {
          const data = await fetchTVSeason(show.id, selectedSeason);
          setSeasonData(data);
        } catch (error) {
          console.error('Error loading season data:', error);
        }
      };
      loadSeasonData();
    }
  }, [show, selectedSeason]);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!isHovered && sliderShows.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % sliderShows.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [sliderShows.length, isHovered]);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % sliderShows.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + sliderShows.length) % sliderShows.length);
  };

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const handleSlideClick = (slideShow) => {
    navigate(`/tv/${slideShow.id}`);
  };

  const handleWishlist = () => {
    if (isInWatchlist(show.id, show.type)) {
      removeFromWatchlist(show.id, show.type);
    } else {
      addToWatchlist(show);
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

  if (!show) return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">TV show not found</div>
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
              {show.title} - S{selectedSeason}E{selectedEpisode}
            </div>
            <iframe
              src={playerSource === 'vidsrc' 
                ? `https://vidsrc.cc/v2/embed/tv/${show.id}/${selectedSeason}/${selectedEpisode}`
                : playerSource === 'videasy'
                ? `https://player.videasy.net/tv/${show.id}/${selectedSeason}/${selectedEpisode}`
                : `https://vidlink.pro/tv/${show.id}/${selectedSeason}/${selectedEpisode}`
              }
              title={`${show.title} S${selectedSeason}E${selectedEpisode}`}
              frameBorder="0"
              allowFullScreen
              allow="encrypted-media"
              className="w-full h-full"
            />
          </div>
        </div>
      )}
      
      {/* TV Show Info Card */}
      <div className="px-8 pt-20 pb-16">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          <div className="flex gap-8">
            <img
              src={show.poster}
              alt={show.title}
              className="w-64 h-96 object-cover rounded-xl shadow-2xl flex-shrink-0"
            />
            
            <div className="flex-1">
              <h1 className="text-5xl text-white font-bold mb-6">{show.title}</h1>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
                  <Star size={18} fill="currentColor" className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{show.rating?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                  <Calendar size={18} className="text-blue-400" />
                  <span className="text-blue-400 font-semibold">{show.year}</span>
                </div>
                <div className="bg-red-600 text-white px-4 py-1 rounded-full font-semibold">
                  {show.seasons} Season{show.seasons !== 1 ? 's' : ''} • {show.episodes} Episodes
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">{show.overview}</p>
              
              {show.genres && (
                <div className="mb-4">
                  <span className="text-gray-400 font-medium">Genres: </span>
                  <span className="text-white">{show.genres}</span>
                </div>
              )}
              
              {show.cast && (
                <div className="mb-8">
                  <span className="text-gray-400 font-medium">Cast: </span>
                  <span className="text-white">{show.cast}</span>
                </div>
              )}
            
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSeasonDropdown(!showSeasonDropdown);
                      setShowEpisodeDropdown(false);
                    }}
                    className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg"
                  >
                    Season {selectedSeason}
                    <ChevronDown size={18} />
                  </button>
                  {showSeasonDropdown && (
                    <div className="absolute top-full mt-2 bg-gray-800 rounded-xl shadow-2xl z-20 min-w-[140px] border border-gray-700">
                      {Array.from({ length: show.seasons }, (_, i) => i + 1).map(season => (
                        <button
                          key={season}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSeason(season);
                            setSelectedEpisode(1);
                            setShowSeasonDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors ${
                            season === selectedSeason ? 'bg-red-600' : ''
                          } first:rounded-t-xl last:rounded-b-xl`}
                        >
                          Season {season}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEpisodeDropdown(!showEpisodeDropdown);
                      setShowSeasonDropdown(false);
                    }}
                    className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg"
                  >
                    Episode {selectedEpisode}
                    <ChevronDown size={18} />
                  </button>
                  {showEpisodeDropdown && (
                    <div className="absolute top-full mt-2 bg-gray-800 rounded-xl shadow-2xl z-20 max-h-48 overflow-y-auto min-w-[140px] border border-gray-700">
                      {seasonData?.episodes?.map((ep) => (
                        <button
                          key={ep.episode_number}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEpisode(ep.episode_number);
                            setShowEpisodeDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-3 text-white hover:bg-gray-700 transition-colors ${
                            ep.episode_number === selectedEpisode ? 'bg-red-600' : ''
                          }`}
                        >
                          Episode {ep.episode_number}
                        </button>
                      )) || Array.from({ length: 10 }, (_, i) => i + 1).map(episode => (
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
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPlayer(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-3 shadow-lg transform hover:scale-105"
                >
                  <Play size={22} fill="currentColor" />
                  Watch S{selectedSeason}E{selectedEpisode}
                </button>
                
                <button
                  onClick={handleWishlist}
                  className={`px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-3 shadow-lg transform hover:scale-105 ${
                    isInWatchlist(show.id, show.type)
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                  }`}
                >
                  <Heart size={22} fill={isInWatchlist(show.id, show.type) ? 'currentColor' : 'none'} />
                  {isInWatchlist(show.id, show.type) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          setShowSeasonDropdown(false);
          setShowEpisodeDropdown(false);
        }}
        className={showSeasonDropdown || showEpisodeDropdown ? 'fixed inset-0 z-10' : 'hidden'}
      />
      <Footer />
    </div>
  );
};

export default TVShow;