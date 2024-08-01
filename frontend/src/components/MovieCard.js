import React, { useState } from 'react';
import '../styles/MovieCard.css';

function MovieCard({ movie }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  const toggleReadMore = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const truncatedPlot = movie.plot.length > maxLength 
    ? `${movie.plot.substring(0, maxLength)}...` 
    : movie.plot;

  return (
    <div className="movie-card">
      <img src={movie.poster} alt={`${movie.title} poster`} className="movie-poster" />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.year}</p>
      </div>
      <div className="movie-details">
        <h3>{movie.title} ({movie.year})</h3>
        <div className="movie-details-grid">
          <span className="movie-details-label">Director:</span>
          <span>{movie.director.join(', ')}</span>
          <span className="movie-details-label">Actors:</span>
          <span>{movie.actors.join(', ')}</span>
          <span className="movie-details-label">Genres:</span>
          <span>{movie.genres.join(', ')}</span>
          <span className="movie-details-label">IMDB Rating:</span>
          <span>{movie.imdb_rating}</span>
          {movie.rotten_tomatoes && (
            <>
              <span className="movie-details-label">Rotten Tomatoes:</span>
              <span>{movie.rotten_tomatoes}</span>
            </>
          )}
        </div>
        <div className="plot-container">
          <p>
            <span className="movie-details-label">Plot: </span>
            {isExpanded ? movie.plot : truncatedPlot}
            {movie.plot.length > maxLength && (
              <button onClick={toggleReadMore} className="read-more-btn">
                {isExpanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;