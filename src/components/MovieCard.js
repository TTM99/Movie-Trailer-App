import React from "react";
import "./MovieCard.css";
const MovieCard = ({ movie, selectMovie }) => {
  const IMG_PATH = process.env.REACT_APP_IMG_PATH;

  return (
    <div className="movie-container" onClick={() => selectMovie(movie)}>
      <div>
        {movie.poster_path ? (
          <img
            className="movie-poster"
            src={`${IMG_PATH}${movie.poster_path}`}
            alt=""
          />
        ) : (
          <div className="poster-path">
            <p className="poster-text">No Preview Available</p>
          </div>
        )}
      </div>
      <div className="movie-title">{movie.title}</div>
    </div>
  );
};

export default MovieCard;
