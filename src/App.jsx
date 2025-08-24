import React, { Suspense } from "react";

// Lazy load components
const Home = React.lazy(() => import("./pages/Home/Home"));
const Movies = React.lazy(() => import("./pages/MoviesPage/MoviesPage"));
const TVShows = React.lazy(() => import("./pages/TVShowsPage/TVShowsPage"));
const TVShow = React.lazy(() => import("./pages/TVShow/TVShow"));
const Search = React.lazy(() => import("./pages/Search/Search"));
const Movie = React.lazy(() => import("./pages/Movie/Movie"));
const Player = React.lazy(() => import("./pages/Player/Player"));
const Watchlist = React.lazy(() => import("./pages/Watchlist/Watchlist"));
const Trending = React.lazy(() => import("./pages/Trending/Trending"));

import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/movies" element={<Movies />}></Route>
          <Route path="/tv-shows" element={<TVShows />}></Route>
          <Route path="/trending" element={<Trending />}></Route>
          <Route path="/watchlist" element={<Watchlist />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/movie/:id" element={<Movie />}></Route>
          <Route path="/tv/:id" element={<TVShow />}></Route>
          <Route path="/player/:id" element={<Player />}></Route>
          <Route path="/player/tv/:id" element={<Player />}></Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
