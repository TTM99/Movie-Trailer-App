import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "./components/MovieCard";
import { Button } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import theme from "./theme";
import YouTube from "react-youtube";
import SearchIcon from "@mui/icons-material/Search";
import "./App.css";

const App = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const API_KEY = process.env.REACT_APP_API_KEY;

  const DISCOVER_API =
    API_URL +
    "discover/movie?api_key=" +
    API_KEY +
    "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate";

  const SEARCH_API =
    API_URL +
    "search/movie?api_key=" +
    API_KEY +
    "&language=en-US&page=1&include_adult=false";

  const [movieData, setMovieData] = useState([]);
  const [searchedMovie, setSearchedMovie] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [playTrailer, setPlayTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      //destructing the data
      const { data } = await axios.get(`${DISCOVER_API}`);
      setMovieData(data.results);
      console.log(data.results);
      // setSelectedMovie(movieData[0]);
      setSelectedMovie(data.results[0]);
      fetchMovieVideo(data.results[0].id);
      setLoading(false);
      console.log(selectedMovie);
      console.log("data");
    } catch {
      setLoading(true);
      console.log("Error");
    }
  };

  const searchMovie = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${SEARCH_API}`, {
        params: {
          query: searchedMovie,
        },
      });
      setMovieData(data.results);
      setSelectedMovie(data.results[0]);
      setLoading(false);
    } catch {
      setLoading(true);
      console.log("Movie Not Found");
    }
  };

  const onSearch = () => {
    searchedMovie === "" ? alert("Movie Name cannot be empty") : searchMovie();
  };

  const fetchMovieVideo = async (id) => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
    );
    setSelectedMovie(data);
    console.log(data);
  };

  const MovieTrailer = () => {
    if (selectedMovie.videos) {
      const movieTrailer = selectedMovie.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      const trailer = movieTrailer
        ? movieTrailer
        : selectedMovie.videos.results[0];
      return (
        <YouTube
          videoId={trailer.key}
          className="youtube-trailer"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
              controls: 0,
            },
          }}
        />
      );
    } else {
      return <div>No Video Available</div>;
    }
  };

  const handleChange = (e) => {
    setSearchedMovie(e.target.value);
  };

  const selectMovie = (movie) => {
    fetchMovieVideo(movie.id);
    setPlayTrailer(false);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <div className="header">
          <Button onClick={getData}>
            <div className="app-name">Movie Trailer App</div>
          </Button>
          <div className="searchBar">
            <div className="searchBarContainer">
              <input
                className="searchContainer"
                type="text"
                value={searchedMovie}
                placeholder="Search for Movies..."
                onChange={handleChange}
              />
            </div>
            <div className="btn-container">
              <button className="search-btn" onClick={onSearch}>
                <p>SEARCH</p>
                <div className="icon-search">
                  <SearchIcon style={{ height: "20px", width: "20px" }} />
                </div>
              </button>
            </div>
          </div>
        </div>
        {loading === true ? (
          <div
            style={{
              color: "white",
              margin: "auto",
              width: "250px",
              fontSize: "30px",
              marginTop: "40px",
            }}
          >
            Loading...
          </div>
        ) : movieData.length === 0 ? (
          <div
            style={{
              color: "white",
              margin: "auto",
              width: "250px",
              fontSize: "30px",
              marginTop: "40px",
            }}
          >
            No Movies Found
          </div>
        ) : (
          <div>
            <div className="preview-movie">
              <div
                className="backdrop-poster"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path})`,
                }}
              >
                {selectedMovie.videos && playTrailer ? MovieTrailer() : null}
                {playTrailer ? (
                  <button
                    className="trailer-btn close-btn"
                    onClick={() => setPlayTrailer(false)}
                  >
                    Close
                  </button>
                ) : null}
                <div className="poster-content">
                  <button
                    className="trailer-btn"
                    onClick={() => setPlayTrailer(true)}
                  >
                    Play Trailer
                  </button>
                  <p className="text movie-overview-title">
                    {selectedMovie.title}
                  </p>
                  <p className="text movie-overview">
                    {selectedMovie.overview}
                  </p>
                </div>
              </div>
            </div>
            <div className="container">
              {movieData.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  selectMovie={selectMovie}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;
