# Movie API Backend

## Setup
1. `npm install`
2. Add your TMDB API key to `.env` file
3. `npm start`

## Deploy to Render
1. Connect GitHub repo
2. Set environment variable: `TMDB_API_KEY=your_key`
3. Deploy

## API Endpoints
- `GET /api/movies?type=popular&page=1`
- `GET /api/tv?type=popular&page=1` 
- `GET /api/search?q=batman&page=1`
- `GET /api/details/movie/123`
- `GET /api/details/tv/456`