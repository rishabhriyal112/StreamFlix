import { useState, useEffect } from 'react';
import { Filter, SortAsc, Search } from 'lucide-react';

const MovieFilters = ({ movies, onFilteredMovies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterGenre, setFilterGenre] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const genres = ['all', 'action', 'comedy', 'drama', 'horror', 'romance', 'sci-fi', 'thriller'];
  const years = ['all', '2024', '2023', '2022', '2021', '2020'];

  const applyFilters = () => {
    let filtered = [...movies];

    if (searchTerm) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterGenre !== 'all') {
      filtered = filtered.filter(movie => 
        movie.overview?.toLowerCase().includes(filterGenre) ||
        movie.title.toLowerCase().includes(filterGenre)
      );
    }

    if (filterYear !== 'all') {
      filtered = filtered.filter(movie => movie.year === filterYear);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.rating - a.rating;
      }
    });

    onFilteredMovies(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, sortBy, filterGenre, filterYear, movies]);

  return (
    <div className="bg-gray-900 p-4 rounded-lg mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-red-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <SortAsc size={16} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-600 outline-none"
          >
            <option value="popularity">Popular</option>
            <option value="title">Title A-Z</option>
            <option value="year">Newest</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-600 outline-none"
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>
                {genre === 'all' ? 'All Genres' : genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-600 outline-none"
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year === 'all' ? 'All Years' : year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MovieFilters;