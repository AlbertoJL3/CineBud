// src/pages/Home.js
import React, { useState } from 'react';
import { submitPrompt } from '../utils/api';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';

function Home() {
  const [prompt, setPrompt] = useState('');
  const [promptResults, setPromptResults] = useState([]);
  const [promptLoading, setPromptLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if(!prompt.trim()) return;
    setPromptLoading(true);
    setError(null);
    try {
      const results = await submitPrompt(prompt);
      setPromptResults(results);
      setPrompt('');
    } catch (err) {
      setError('Failed to process prompt');
    } finally {
      setPromptLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePromptSubmit(e);
    }
  };

  return (
    <div className="home-page">
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
      {promptLoading ? (
        <Loading />
      ) : promptResults.length > 0 ? (
        <div className="prompt-results-wrapper">
          <h2>Prompt Results</h2>
          <div className="prompt-results-container">
            {promptResults.map((movie) => (
              <div className="movie-card-wrapper" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Home;