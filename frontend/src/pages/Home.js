import React, { useState, useEffect, useRef, useCallback } from 'react';
import { submitPrompt, getPopularMovies, getWatchlist, addToWatchlist, removeFromWatchlist, refreshToken, savePromptResults, getPromptResults, deletePromptResult } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../styles/Home.css';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularMoviesLoading, setPopularMoviesLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState(null);
  const [currentPromptResult, setCurrentPromptResult] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const popularMoviesScrollContainerRef = useRef(null);
  const loadingRef = useRef(false);
  const { user, logout } = useAuth();

  const loadPopularMovies = useCallback(async (pageNum) => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setPopularMoviesLoading(true);
    try {
      const data = await getPopularMovies(pageNum);
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPopularMovies(prevMovies => {
          const newMovies = [...prevMovies, ...data];
          return newMovies.filter((movie, index, self) =>
            index === self.findIndex((t) => t._id === movie._id)
          );
        });
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Failed to fetch popular movies:', err);
      if (err.response && err.response.status === 401) {
        try {
          await refreshToken();
          await loadPopularMovies(pageNum);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout();
        }
      }
      setHasMore(false);
    } finally {
      setPopularMoviesLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore, logout]);

  const loadWatchlist = async () => {
    try {
      const watchlistData = await getWatchlist();
      setWatchlist(watchlistData);
    } catch (err) {
      console.error('Failed to load watchlist:', err);
    }
  };

  useEffect(() => {
    if (user) {
      loadPopularMovies(1);
      loadWatchlist();
      loadSavedPromptResults();
    }
  }, [user, loadPopularMovies, loadSavedPromptResults]);

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

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await submitPrompt(prompt);
      setCurrentPromptResult({ prompt, movies: results });
      setPrompt('');
    } catch (err) {
      setError('Failed to process prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePromptSubmit(e);
    }
  };

  const handleRightScroll = useCallback(() => {
    const container = popularMoviesScrollContainerRef.current;
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
        loadPopularMovies(page + 1);
      }
    }
  }, [loadPopularMovies, page, hasMore]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="movies-page">
      <h3>Not sure what to watch? Ask our AI.</h3>
      <form className="prompt-form" onSubmit={handlePromptSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's your movie mood?"
        />
        <button type="submit" aria-label="Submit" className="submit-button">
          <i className="fas fa-check"></i>
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {currentPromptResult && (
        <div className="current-prompt-result">
          <h2>Current Prompt Result</h2>
          <div className="prompt-header">
            <h3>{currentPromptResult.prompt}</h3>
            <button onClick={handleSavePrompt} className="save-prompt-btn" aria-label="Save prompt">
              <i className="fas fa-check"></i>
            </button>
          </div>
          <div className="scroll-container">
            <button className="scroll-button left" onClick={() => {
              const container = document.querySelector('.current-prompt-result .prompt-results-container');
              container.scrollBy({ left: -container.offsetWidth * 0.8, behavior: 'smooth' });
            }} aria-label="Scroll left">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="prompt-results-container">
              {currentPromptResult.movies.map((movie) => (
                <div className="movie-card-wrapper" key={movie._id}>
                  <MovieCard 
                    movie={movie} 
                    isInWatchlist={watchlist.some(w => w._id === movie._id)}
                    onWatchlistChange={handleWatchlistChange}
                  />
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => {
              const container = document.querySelector('.current-prompt-result .prompt-results-container');
              container.scrollBy({ left: container.offsetWidth * 0.8, behavior: 'smooth' });
            }} aria-label="Scroll right">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      <h1>Popular Movies</h1>
      <div className="prompt-results-wrapper">
        <div className="scroll-container">
          <button 
            className="scroll-button left" 
            onClick={() => {
              const container = popularMoviesScrollContainerRef.current;
              if (container) {
                const scrollAmount = container.offsetWidth * 0.8;
                container.scrollBy({
                  left: -scrollAmount,
                  behavior: 'smooth'
                });
              }
            }} 
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="prompt-results-container" ref={popularMoviesScrollContainerRef}>
            {popularMovies.map((movie) => (
              <div className="movie-card-wrapper" key={movie._id}>
                <MovieCard 
                  movie={movie} 
                  isInWatchlist={watchlist.some(w => w._id === movie._id)}
                  onWatchlistChange={handleWatchlistChange}
                />
              </div>
            ))}
            {popularMoviesLoading && (
              <div className="loading-animation">
                <div className="spinner"></div>
              </div>
            )}
          </div>
          {hasMore && (
            <button 
              className="scroll-button right" 
              onClick={handleRightScroll}
              disabled={popularMoviesLoading}
              aria-label="Scroll right"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;