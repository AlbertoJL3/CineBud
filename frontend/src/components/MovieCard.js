import React, { useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist } from '../utils/api';
import '../styles/MovieCard.css';

function MovieCard({ movie, isInWatchlist, onWatchlistChange }) {
  const [expanded, setExpanded] = useState(false);
  const [localIsInWatchlist, setLocalIsInWatchlist] = useState(isInWatchlist);
  const maxLength = 100;

  useEffect(() => {
    setLocalIsInWatchlist(isInWatchlist);
  }, [isInWatchlist]);

  const toggleReadMore = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const toggleWatchlist = async (e) => {
    e.stopPropagation();
    try {
      if (localIsInWatchlist) {
        await removeFromWatchlist(movie._id);
      } else {
        await addToWatchlist(movie._id);
      }
      setLocalIsInWatchlist(!localIsInWatchlist);
      onWatchlistChange(movie._id, !localIsInWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  const truncatedPlot = movie.plot.length > maxLength 
    ? `${movie.plot.substring(0, maxLength)}...` 
    : movie.plot;

  return (
    <div className="movie-card">
      <div className="watchlist-button" onClick={toggleWatchlist}>
        {localIsInWatchlist ? (
          <span className="checkmark">✓</span>
        ) : (
          <span className="plus-sign">+</span>
        )}
      </div>
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
            {expanded ? movie.plot : truncatedPlot}
            {movie.plot.length > maxLength && (
              <button onClick={toggleReadMore} className="read-more-btn">
                {expanded ? 'Read Less' : 'Read More'}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;