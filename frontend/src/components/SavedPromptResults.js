import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { getMoviesByIds } from '../utils/api';

const SavedPromptResults = ({ savedPromptResults, onDeletePromptResult, watchlist, onWatchlistChange }) => {
  const [movieData, setMovieData] = useState({});

  useEffect(() => {
    const fetchMovieData = async () => {
      const allMovieIds = savedPromptResults.flatMap(result => result.movie_ids);
      const uniqueMovieIds = [...new Set(allMovieIds)];
      
      try {
        const movies = await getMoviesByIds(uniqueMovieIds);
        const newMovieData = movies.reduce((acc, movie) => {
          acc[movie._id] = movie;
          return acc;
        }, {});
        setMovieData(newMovieData);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    };

    if (savedPromptResults.length > 0) {
      fetchMovieData();
    }
  }, [savedPromptResults]);

  return (
    <div className="saved-prompt-results">
      <h2>Your Previous Searches</h2>
      {savedPromptResults.map((result) => (
        <div key={result._id} className="saved-prompt-result">
          <div className="prompt-header">
            <h3>{result.prompt}</h3>
            <button 
              className="delete-prompt-btn"
              onClick={() => onDeletePromptResult(result._id)}
              aria-label="Delete prompt"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
          <div className="scroll-container">
            <button className="scroll-button left" onClick={(e) => {
              const container = e.target.closest('.saved-prompt-result').querySelector('.prompt-results-container');
              container.scrollBy({ left: -container.offsetWidth * 0.8, behavior: 'smooth' });
            }} aria-label="Scroll left">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="prompt-results-container">
              {result.movie_ids.map((movieId) => (
                movieData[movieId] ? (
                  <div className="movie-card-wrapper" key={movieId}>
                    <MovieCard 
                      movie={movieData[movieId]}
                      isInWatchlist={watchlist.some(w => w._id === movieId)}
                      onWatchlistChange={onWatchlistChange}
                    />
                  </div>
                ) : (
                  <div key={movieId} className="movie-card-wrapper loading">
                    <div className="loading-placeholder">Loading...</div>
                  </div>
                )
              ))}
            </div>
            <button className="scroll-button right" onClick={(e) => {
              const container = e.target.closest('.saved-prompt-result').querySelector('.prompt-results-container');
              container.scrollBy({ left: container.offsetWidth * 0.8, behavior: 'smooth' });
            }} aria-label="Scroll right">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedPromptResults;