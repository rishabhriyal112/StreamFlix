import { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';

const TrailerModal = ({ movie, isOpen, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      fetchTrailer();
    }
  }, [isOpen, movie]);

  const fetchTrailer = async () => {
    setLoading(true);
    try {
      const API_KEY = import.meta.env.VITE_TMDB_EXTERNAL_SERVICE_AUTH_TOKEN;
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      const data = await response.json();
      
      const trailer = data.results?.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      setTrailerKey(trailer?.key || null);
    } catch (error) {
      console.error('Error fetching trailer:', error);
      setTrailerKey(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={onClose}>
      <div className="w-[90%] max-w-4xl bg-gray-900 rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold">{movie?.title} - Trailer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="aspect-video bg-black">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title={`${movie?.title} Trailer`}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; encrypted-media"
              className="w-full h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Play size={48} className="mb-4" />
              <p>No trailer available for this movie</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;