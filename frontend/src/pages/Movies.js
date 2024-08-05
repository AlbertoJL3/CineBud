import React, { useState, useEffect } from 'react';
import { fetchMovies, updateMovie, deleteMovie, submitPrompt } from '../utils/api';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Movies() {
  console.log('Movies Rendered...')
  const [movies, setMovies] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promptResults, setPromptResults] = useState([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await fetchMovies();
      setMovies(data);
    } catch (err) {
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if(!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await submitPrompt(prompt);
      setPromptResults(results);
      setPrompt('');
      // After processing the prompt, reload the movies
      await loadMovies();
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="movies-page">
      <h1>BoxOffice</h1>
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
      {promptResults.length > 0 && (
        <div>
          <h2>Results</h2>
          <ul>
            {promptResults.map((movie, index) => (
              <li key={index}>{movie.title} ({movie.year})</li>
            ))}
          </ul>
        </div>
      )}
      <div className="movie-list">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Movies;