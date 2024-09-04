import React, { useState, useEffect, useRef, useCallback } from 'react';
import { submitPrompt } from '../utils/api';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Home() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularMoviesLoading, setPopularMoviesLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState(null);
  const [promptResults, setPromptResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const promptScrollContainerRef = useRef(null);
  const popularMoviesScrollContainerRef = useRef(null);
  const loadingRef = useRef(false);

  const loadPopularMovies = useCallback(async (pageNum) => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setPopularMoviesLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/popular-movies?page=${pageNum}&per_page=15`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched popular movies:", data);
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPopularMovies(prevMovies => {
            const newMovies = [...prevMovies, ...data];
            return newMovies.filter((movie, index, self) =>
              index === self.findIndex((t) => t.id === movie.id)
            );
          });
          setPage(pageNum);
        }
      } else {
        console.error('Failed to fetch popular movies:', response.statusText);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching popular movies:', err);
      setHasMore(false);
    } finally {
      setPopularMoviesLoading(false);
      loadingRef.current = false;
    }
  }, [hasMore]);

  useEffect(() => {
    loadPopularMovies(1);
  }, [loadPopularMovies]);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await submitPrompt(prompt);
      console.log("Prompt results:", results);
      setPromptResults(results);
      setPrompt('');
      setTimeout(() => {
        const resultsWrapper = document.querySelector('.prompt-results-wrapper');
        if (resultsWrapper) {
          resultsWrapper.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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

  const scroll = useCallback((direction, containerRef) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

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

      {promptResults.length > 0 && (
        <div className="prompt-results-wrapper">
          <h2>Prompt Results</h2>
          <div className="scroll-container">
            <button className="scroll-button left" onClick={() => scroll('left', promptScrollContainerRef)} aria-label="Scroll left">
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="prompt-results-container" ref={promptScrollContainerRef}>
              {promptResults.map((movie) => (
                <div className="movie-card-wrapper" key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            <button className="scroll-button right" onClick={() => scroll('right', promptScrollContainerRef)} aria-label="Scroll right">
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
            onClick={() => scroll('left', popularMoviesScrollContainerRef)} 
            aria-label="Scroll left"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="prompt-results-container" ref={popularMoviesScrollContainerRef}>
            {popularMovies.map((movie) => (
              <div className="movie-card-wrapper" key={movie.id || movie.title}>
                <MovieCard movie={movie} />
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