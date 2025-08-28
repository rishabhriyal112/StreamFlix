import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';


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
        // Fetch anime data from TMDB API (anime shows)
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN}&with_genres=16&sort_by=popularity.desc`);
        const data = await response.json();
        
        const animeList = data.results?.map(item => ({
          id: item.id,
          title: item.name,
          poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
          backdrop: `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
          rating: item.vote_average,
          year: item.first_air_date?.split('-')[0],
          type: 'anime'
        })) || [];

        setAnimeData({
          popular: animeList.slice(0, 10),
          topRated: animeList.slice(5, 15),
          trending: animeList.slice(10, 20)
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

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="pt-20 px-4 md:px-8">
        <h1 className="text-4xl md:text-5xl text-white font-bold mb-12 text-center">
          Anime Collection
        </h1>
        
        {animeData.popular.length > 0 && (
          <div className="mt-8 px-4">
            <h2 className="text-2xl text-white font-bold mb-4">Popular Anime</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeData.popular.map(anime => (
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
                    <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <div className="w-4 h-4 border-l-2 border-white ml-1"></div>
                    </button>
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
          </div>
        )}
        
        {animeData.topRated.length > 0 && (
          <div className="mt-8 px-4">
            <h2 className="text-2xl text-white font-bold mb-4">Top Rated Anime</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeData.topRated.map(anime => (
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
                    <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <div className="w-4 h-4 border-l-2 border-white ml-1"></div>
                    </button>
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
          </div>
        )}
        
        {animeData.trending.length > 0 && (
          <div className="mt-8 px-4">
            <h2 className="text-2xl text-white font-bold mb-4">Trending Anime</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {animeData.trending.map(anime => (
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
                    <button className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                      <div className="w-4 h-4 border-l-2 border-white ml-1"></div>
                    </button>
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
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AnimePage;