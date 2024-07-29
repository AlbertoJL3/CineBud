import React from 'react';
import MovieCard from './MovieCard';
import '../styles/MovieList.css';

function MovieList({ movies, onUpdateMovie, onDeleteMovie }) {
  return (
    <div className="movie-list-container">
      <div className="movie-list">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onUpdate={onUpdateMovie}
            onDelete={onDeleteMovie}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieList;