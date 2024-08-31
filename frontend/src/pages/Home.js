import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchMovies, submitPrompt } from '../utils/api';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularMoviesLoading, setPopularMoviesLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState(null);
  const [promptResults, setPromptResults] = useState([]);
  const [page, setPage] = useState(1);
  const promptScrollContainerRef = useRef(null);
  const popularMoviesScrollContainerRef = useRef(null);

  useEffect(() => {
    loadMovies();
    loadPopularMovies(1);
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMovies();
      console.log("Fetched movies:", data);
      setMovies(data);
    } catch (err) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const loadPopularMovies = async (pageNum) => {
    if (popularMoviesLoading) return;
    setPopularMoviesLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/popular-movies?page=${pageNum}&per_page=20`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched popular movies:", data);
        setPopularMovies(prevMovies => [...prevMovies, ...data]);
        setPage(pageNum);
      } else {
        console.error('Failed to fetch popular movies:', response.statusText);
      }
    } catch (err) {
      console.error('Error fetching popular movies:', err);
    } finally {
      setPopularMoviesLoading(false);
    }
  };

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
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      if (direction === 'right' && container.scrollLeft + scrollAmount >= maxScroll) {
        // Load more movies when scrolling to the right and near the end
        loadPopularMovies(page + 1);
      }
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [page, loadPopularMovies]);

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
          <button className="scroll-button left" onClick={() => scroll('left', popularMoviesScrollContainerRef)} aria-label="Scroll left">
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="prompt-results-container" ref={popularMoviesScrollContainerRef}>
            {popularMovies.map((movie) => (
              <div className="movie-card-wrapper" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
            {popularMoviesLoading && <div className="loading">Loading more movies...</div>}
          </div>
          <button className="scroll-button right" onClick={() => scroll('right', popularMoviesScrollContainerRef)} aria-label="Scroll right">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;