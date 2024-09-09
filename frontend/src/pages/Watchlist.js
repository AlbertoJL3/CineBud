import React, { useState, useEffect, useRef, useCallback } from 'react';
import MovieCard from '../components/MovieCard';
import { getWatchlist, removeFromWatchlist } from '../utils/api';
import '../styles/Watchlist.css';
import Loading from '../components/Loading';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const watchlistScrollContainerRef = useRef(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const data = await getWatchlist();
      setWatchlist(data);
    } catch (err) {
      setError('Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
      setWatchlist(watchlist.filter(movie => movie._id !== movieId));
    } catch (err) {
      setError('Failed to remove movie from watchlist');
    }
  };

  const scroll = useCallback((direction) => {
    const container = watchlistScrollContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="watchlist-container">
      <h2 className="watchlist-header">Your Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty. Start adding movies!</p>
      ) : (
        <div className="prompt-results-wrapper">
          <div className="scroll-container">
            <button 
              className="scroll-button left" 
              onClick={() => scroll('left')} 
              aria-label="Scroll left"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="prompt-results-container" ref={watchlistScrollContainerRef}>
              {watchlist.map(movie => (
                <div key={movie._id} className="movie-card-wrapper">
                  <MovieCard 
                    movie={movie} 
                    isInWatchlist={true}
                    onWatchlistChange={() => handleRemoveFromWatchlist(movie._id)}
                  />
                </div>
              ))}
            </div>
            <button 
              className="scroll-button right" 
              onClick={() => scroll('right')} 
              aria-label="Scroll right"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;