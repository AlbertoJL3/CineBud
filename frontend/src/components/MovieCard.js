import React from 'react';
import '../styles/MovieCard.css';

function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={movie.poster} alt={`${movie.title} poster`} className="movie-poster" />
      <h3>{movie.title} ({movie.year})</h3>
      <p>Director: {movie.director.join(', ')}</p>
      <p>Actors: {movie.actors.join(', ')}</p>
      <p>Genres: {movie.genres.join(', ')}</p>
      <p>IMDB Rating: {movie.imdb_rating}</p>
      {movie.rotten_tomatoes && <p>Rotten Tomatoes: {movie.rotten_tomatoes}</p>}
    </div>
  );
}

export default MovieCard;