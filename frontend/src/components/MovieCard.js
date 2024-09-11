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

  const truncatedPlot = movie.plot && movie.plot.length > maxLength
    ? `${movie.plot.substring(0, maxLength)}...`
    : movie.plot;

  // Helper function to ensure we always have an array
  const ensureArray = (item) => Array.isArray(item) ? item : [item];

  // Helper function to safely get string value
  const safeString = (value) => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value && typeof value === 'object' && '$numberDouble' in value) return value.$numberDouble.toString();
    if (value && typeof value === 'object' && '$numberInt' in value) return value.$numberInt.toString();
    return '';
  };

  return (
    <div className="movie-card">
      <div className="watchlist-button" onClick={toggleWatchlist}>
        {localIsInWatchlist ? (
          <span className="checkmark">✓</span>
        ) : (
          <span className="plus-sign">+</span>
        )}
      </div>
      <img src={safeString(movie.poster)} alt={`${safeString(movie.title)} poster`} className="movie-poster" />
      <div className="movie-info">
        <h3>{safeString(movie.title)}</h3>
        <p>{safeString(movie.year)}</p>
      </div>
      <div className="movie-details">
        <h3>{safeString(movie.title)} ({safeString(movie.year)})</h3>
        <div className="movie-details-grid">
          <span className="movie-details-label">Director:</span>
          <span>{ensureArray(movie.director).map(safeString).join(', ')}</span>
          <span className="movie-details-label">Actors:</span>
          <span>{ensureArray(movie.actors).map(safeString).join(', ')}</span>
          <span className="movie-details-label">Genres:</span>
          <span>{ensureArray(movie.genres).map(safeString).join(', ')}</span>
          <span className="movie-details-label">IMDB Rating:</span>
          <span>{safeString(movie.imdb_rating)}</span>
          {movie.rotten_tomatoes && (
            <>
              <span className="movie-details-label">Rotten Tomatoes:</span>
              <span>{safeString(movie.rotten_tomatoes)}</span>
            </>
          )}
        </div>
        <div className="plot-container">
          <p>
            <span className="movie-details-label">Plot: </span>
            {expanded ? safeString(movie.plot) : safeString(truncatedPlot)}
            {movie.plot && movie.plot.length > maxLength && (
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