import React, { useState, useEffect } from 'react';
import { fetchMovies, updateMovie, deleteMovie, submitPrompt } from '../utils/api';
import Loading from '../components/Loading';
import MovieList from '../components/MovieList';
import MovieCard from '../components/MovieCard';

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

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="movies-page">
            <h1>Movies</h1>

            <form className="prompt-form" onSubmit={handlePromptSubmit}>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your movie recommendation prompt"
                />
               <button type="submit" aria-label="Submit">-></button>
            </form>

            {promptResults.length > 0 && (
                <div>
                    <h2>Prompt Results</h2>
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