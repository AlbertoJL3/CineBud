import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getTopRatedMovies, getBestOf70s, getBestOf80s, getBestOf90s, getWatchlist, addToWatchlist, removeFromWatchlist, refreshToken } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Movies.css';
import '../styles/Home.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [bestOf70s, setBestOf70s] = useState([]);
  const [bestOf80s, setBestOf80s] = useState([]);
  const [bestOf90s, setBestOf90s] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const topRatedRef = useRef(null);
  const best70sRef = useRef(null);
  const best80sRef = useRef(null);
  const best90sRef = useRef(null);
  const loadingRef = useRef(false);
  const { user, logout } = useAuth();

  const loadBestOf70s = useCallback(async () => {
    try {
      const data = await getBestOf70s();
      setBestOf70s(data);
    } catch (err) {
      console.error('Failed to fetch best of 70s movies:', err);
      handleApiError(err, loadBestOf70s);
    }
  }, []);

  const loadBestOf80s = useCallback(async () => {
    try {
      const data = await getBestOf80s();
      setBestOf80s(data);
    } catch (err) {
      console.error('Failed to fetch best of 80s movies:', err);
      handleApiError(err, loadBestOf80s);
    }
  }, []);
  
  const loadBestOf90s = useCallback(async () => {
    try {
      const data = await getBestOf90s();
      setBestOf90s(data);
    } catch (err) {
      console.error('Failed to fetch best of 90s movies:', err);
      handleApiError(err, loadBestOf90s);
    }
  }, []);

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
      handleApiError(err, () => loadTopRatedMovies(pageNum));
      setHasMore(false);
    } finally {
      setMoviesLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore]);

  const handleApiError = async (err, retryFunction) => {
    if (err.response && err.response.status === 401) {
      try {
        await refreshToken();
        await retryFunction();
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        logout();
      }
    }
  };

  useEffect(() => {
    if (user) {
      const loadAllData = async () => {
        setLoading(true);
        await Promise.all([
          loadTopRatedMovies(1),
          loadBestOf70s(),
          loadBestOf80s(),
          loadBestOf90s(),
          loadWatchlist()
        ]);
        setLoading(false);
      };
      loadAllData();
    }
  }, [user, loadTopRatedMovies, loadBestOf70s, loadBestOf80s, loadBestOf90s]);

  const loadWatchlist = async () => {
    try {
      const watchlistData = await getWatchlist();
      setWatchlist(watchlistData);
    } catch (err) {
      console.error('Failed to load watchlist:', err);
      setError('Failed to load watchlist. Please try again later.');
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
      setError('Failed to update watchlist. Please try again later.');
    }
  };

  const scroll = (direction, containerRef) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleRightScroll = useCallback((containerRef) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });

      if (containerRef === topRatedRef &&
          container.scrollLeft + scrollAmount >= maxScroll * 0.8 && 
          !loadingRef.current && 
          hasMore) {
        loadTopRatedMovies(page + 1);
      }
    }
  }, [loadTopRatedMovies, page, hasMore]);

  if (loading) {
    return <Loading />;
  }

  const renderMovieSection = (title, movies, containerRef) => (
    <>
      <h2>{title}</h2>
      <div className="prompt-results-wrapper">
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => scroll('left', containerRef)} 
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="prompt-results-container" ref={containerRef}>
            {movies.map((movie) => (
              <div className="movie-card-wrapper" key={movie._id || movie.id}>
                <MovieCard 
                  movie={movie} 
                  isInWatchlist={watchlist.some(w => w._id === movie._id)}
                  onWatchlistChange={handleWatchlistChange}
                />
              </div>
            ))}
            {moviesLoading && containerRef === topRatedRef && (
              <div className="loading-animation">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          <button 
            className="scroll-button right" 
            onClick={() => handleRightScroll(containerRef)}
            disabled={containerRef === topRatedRef ? moviesLoading : false}
            aria-label="Scroll right"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="movies-page">
      {renderMovieSection("Top Rated Movies", movies, topRatedRef)}
      {renderMovieSection("Best of 90s", bestOf90s, best90sRef)}
      {renderMovieSection("Best of 80s", bestOf80s, best80sRef)}
      {renderMovieSection("Best of 70s", bestOf70s, best70sRef)}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Movies;