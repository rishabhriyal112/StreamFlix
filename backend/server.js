import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.TMDB_API_KEY || 'your_api_key_here';

app.use(cors());
app.use(express.json());

app.get('/api/movies', async (req, res) => {
  try {
    const { type = 'popular', page = 1 } = req.query;
    const response = await fetch(`https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/api/tv', async (req, res) => {
  try {
    const { type = 'popular', page = 1 } = req.query;
    const response = await fetch(`https://api.themoviedb.org/3/tv/${type}?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch TV shows' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) return res.status(400).json({ error: 'Query required' });
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(q)}&page=${page}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search' });
  }
});

app.get('/api/details/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=credits,videos,images`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});