import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getTopRatedMovies, getWatchlist, addToWatchlist, removeFromWatchlist, refreshToken } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Movies.css';
import '../styles/Home.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const moviesScrollContainerRef = useRef(null);
  const loadingRef = useRef(false);
  const { user, logout } = useAuth();

  const loadTopRatedMovies = useCallback(async (pageNum) => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setMoviesLoading(true);
    try {
      const data = await getTopRatedMovies(pageNum);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setMovies(prevMovies => {
          const newMovies = [...prevMovies, ...data];
          return newMovies.filter((movie, index, self) =>
            index === self.findIndex((t) => t.id === movie.id)
          );
        });
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Failed to fetch top-rated movies:', err);
      if (err.response && err.response.status === 401) {
        try {
          await refreshToken();
          await loadTopRatedMovies(pageNum);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout();
        }
      }
      setHasMore(false);
    } finally {
      setMoviesLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore, logout]);

  useEffect(() => {
    if (user) {
      loadTopRatedMovies(1);
      loadWatchlist();
    }
  }, [user, loadTopRatedMovies]);

  const loadWatchlist = async () => {
    try {
      const watchlistData = await getWatchlist();
      setWatchlist(watchlistData);
    } catch (err) {
      console.error('Failed to load watchlist:', err);
    }
  };

  const handleWatchlistChange = async (movieId, isAdding) => {
    try {
      if (isAdding) {
        await addToWatchlist(movieId);
        setWatchlist(prev => [...prev, { _id: movieId }]);
      } else {
        await removeFromWatchlist(movieId);
        setWatchlist(prev => prev.filter(m => m._id !== movieId));
      }
    } catch (err) {
      console.error('Failed to update watchlist:', err);
    }
  };

  const scroll = useCallback((direction) => {
    const container = moviesScrollContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleRightScroll = useCallback(() => {
    const container = moviesScrollContainerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });

      if (container.scrollLeft + scrollAmount >= maxScroll * 0.8 && 
          !loadingRef.current && 
          hasMore) {
        loadTopRatedMovies(page + 1);
      }
    }
  }, [loadTopRatedMovies, page, hasMore]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="movies-page">
      <h2>Top Rated Movies</h2>
      <div className="prompt-results-wrapper">
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => scroll('left')} 
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="prompt-results-container" ref={moviesScrollContainerRef}>
            {movies.map((movie) => (
              <div className="movie-card-wrapper" key={movie.id}>
                <MovieCard 
                  movie={movie} 
                  isInWatchlist={watchlist.some(w => w._id === movie._id)}
                  onWatchlistChange={handleWatchlistChange}
                />
              </div>
            ))}
            {moviesLoading && (
              <div className="loading-animation">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          {hasMore && (
            <button 
              className="scroll-button right" 
              onClick={handleRightScroll}
              disabled={moviesLoading}
              aria-label="Scroll right"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Movies;