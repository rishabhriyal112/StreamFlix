const API_KEY = '8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (type = 'popular', page = 1) => {
  const response = await fetch(`${BASE_URL}/movie/${type}?api_key=${API_KEY}&page=${page}`);
  return await response.json();
};

export const fetchTVShows = async (type = 'popular', page = 1) => {
  const response = await fetch(`${BASE_URL}/tv/${type}?api_key=${API_KEY}&page=${page}`);
  return await response.json();
};

export const fetchMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos,images`);
  return await response.json();
};

export const fetchTVDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=credits,videos,images`);
  return await response.json();
};

export const fetchTVSeason = async (id, seasonNumber) => {
  const response = await fetch(`${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`);
  return await response.json();
};

export const searchContent = async (query, page = 1) => {
  const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
  return await response.json();
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};