import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Player = () => {
  const { type, id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  const season = searchParams.get('season') || '1';
  const episode = searchParams.get('episode') || '1';
  const movieTitle = searchParams.get('title') || '';

  useEffect(() => {
    setTitle(movieTitle || `${type === 'tv' ? 'TV Show' : 'Movie'} Player`);
  }, [movieTitle, type]);

  const getPlayerUrl = () => {
    if (type === 'tv') {
      return `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`;
    } else {
      return `https://vidsrc.cc/v2/embed/movie/${id}`;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="flex items-center justify-between p-4 bg-black/90">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-red-600 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-white text-lg font-semibold truncate">{title}</h1>
        <div></div>
      </div>

      <div className="relative w-full h-[calc(100vh-80px)]">
        <iframe
          src={getPlayerUrl()}
          title={title}
          frameBorder="0"
          allowFullScreen
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};

export default Player;