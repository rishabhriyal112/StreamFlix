import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '../../utils/wishlist';

const AnimePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [animeData, setAnimeData] = useState({
    popular: [],
    topRated: [],
    trending: []
  });

  useEffect(() => {
    const loadAnimeData = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN}&with_genres=16&sort_by=popularity.desc`);
        const data = await response.json();
        
        const animeList = data.results?.map(item => ({
          id: item.id,
          title: item.name,
          poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
          rating: item.vote_average,
          year: item.first_air_date?.split('-')[0],
          type: 'tv'
        })) || [];

        setAnimeData({
          popular: animeList.slice(0, 12),
          topRated: animeList.slice(6, 18),
          trending: animeList.slice(12, 24)
        });
      } catch (error) {
        console.error('Error loading anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimeData();
  }, []);

  const handleAnimeClick = (anime) => {
    navigate(`/anime/${anime.id}`);
  };

  const handleWishlist = (anime, e) => {
    e.stopPropagation();
    if (isInWatchlist(anime.id, anime.type)) {
      removeFromWatchlist(anime.id, anime.type);
    } else {
      addToWatchlist(anime);
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white">Loading anime...</div>
        </div>
      </div>
    );
  }

  const renderAnimeGrid = (animeList) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {animeList.map(anime => (
        <div
          key={anime.id}
          className="relative cursor-pointer group hover:scale-105 transition-transform"
          onClick={() => handleAnimeClick(anime)}
        >
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full aspect-[2/3] object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="flex gap-2">
              <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                <Play size={16} fill="currentColor" />
              </button>
              <button
                onClick={(e) => handleWishlist(anime, e)}
                className={`p-2 rounded-full ${
                  isInWatchlist(anime.id, anime.type)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                <Heart size={16} fill={isInWatchlist(anime.id, anime.type) ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-white text-sm font-medium truncate">{anime.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>★ {anime.rating?.toFixed(1)}</span>
              <span>{anime.year}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-20 px-4 md:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-4 text-center">
            Anime Collection
          </h1>
          <p className="text-gray-400 text-center max-w-2xl mx-auto">
            Discover amazing anime series from around the world
          </p>
        </div>
        
        {animeData.popular.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl text-white font-bold mb-6">Popular Anime</h2>
            {renderAnimeGrid(animeData.popular)}
          </div>
        )}
        
        {animeData.topRated.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl text-white font-bold mb-6">Top Rated Anime</h2>
            {renderAnimeGrid(animeData.topRated)}
          </div>
        )}
        
        {animeData.trending.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl text-white font-bold mb-6">Trending Anime</h2>
            {renderAnimeGrid(animeData.trending)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AnimePage;