import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';

const CastModal = ({ movie, isOpen, onClose }) => {
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      fetchCastCrew();
    }
  }, [isOpen, movie]);

  const fetchCastCrew = async () => {
    setLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`
      );
      const data = await response.json();
      
      setCast(data.cast?.slice(0, 12) || []);
      setCrew(data.crew?.filter(person => 
        ['Director', 'Producer', 'Writer'].includes(person.job)
      ).slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching cast:', error);
      setCast([]);
      setCrew([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
          <h3 className="text-white text-lg font-semibold">{movie?.title} - Cast & Crew</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Cast Section */}
              <div className="mb-8">
                <h4 className="text-white text-xl font-semibold mb-4">Cast</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-gray-800">
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={24} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <h5 className="text-white font-medium text-sm">{actor.name}</h5>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crew Section */}
              {crew.length > 0 && (
                <div>
                  <h4 className="text-white text-xl font-semibold mb-4">Crew</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {crew.map((person, index) => (
                      <div key={`${person.id}-${index}`} className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-800">
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User size={20} className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <h5 className="text-white font-medium text-sm">{person.name}</h5>
                        <p className="text-gray-400 text-xs">{person.job}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastModal;