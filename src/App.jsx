import React from "react";
import Home from "./pages/Home/Home";
import Movies from "./pages/MoviesPage/MoviesPage";
import TVShows from "./pages/TVShowsPage/TVShowsPage";
import TVShow from "./pages/TVShow/TVShow";
import Search from "./pages/Search/Search";
import Movie from "./pages/Movie/Movie";
import AnimePage from "./pages/AnimePage/AnimePage";
import Anime from "./pages/Anime/Anime";
import Player from "./pages/Player/Player";
import Watchlist from "./pages/Watchlist/Watchlist";
import Trending from "./pages/Trending/Trending";

import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/movies" element={<Movies />}></Route>
        <Route path="/tv-shows" element={<TVShows />}></Route>
        <Route path="/trending" element={<Trending />}></Route>
        <Route path="/watchlist" element={<Watchlist />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/movie/:id" element={<Movie />}></Route>
        <Route path="/tv/:id" element={<TVShow />}></Route>
        <Route path="/anime" element={<AnimePage />}></Route>
        <Route path="/anime/:id" element={<Anime />}></Route>
        <Route path="/player/:id" element={<Player />}></Route>
        <Route path="/player/tv/:id" element={<Player />}></Route>
      </Routes>
      
    </div>
  );
};

export default App;
