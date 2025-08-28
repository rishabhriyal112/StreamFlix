import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8';

app.use(cors());
app.use(express.json());

app.get('/api/movies', async (req, res) => {
  try {
    const { type = 'popular', page = 1 } = req.query;
    const response = await fetch(`https://api.themoviedb.org/3/movie/${type}?page=${page}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

app.get('/api/tv', async (req, res) => {
  try {
    const { type = 'popular', page = 1 } = req.query;
    const response = await fetch(`https://api.themoviedb.org/3/tv/${type}?page=${page}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
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
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(q)}&page=${page}`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search' });
  }
});

app.get('/api/details/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?append_to_response=credits,videos,images`, {
      headers: { 'Authorization': `Bearer ${API_TOKEN}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});