import React, { useState, useEffect } from 'react';
import { fetchMovies, getWatchlist, addToWatchlist, removeFromWatchlist } from '../utils/api';
import Loading from '../components/Loading';
import MovieCard from '../components/MovieCard';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMoviesAndWatchlist();
  }, []);

  const loadMoviesAndWatchlist = async () => {
    setLoading(true);
    try {
      const [moviesData, watchlistData] = await Promise.all([
        fetchMovies(),
        getWatchlist()
      ]);
      setMovies(moviesData);
      setWatchlist(watchlistData);
    } catch (err) {
      setError('Failed to load movies and watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistChange = async (movieId, isAdding) => {
    try {
      if (isAdding) {
        await addToWatchlist(movieId);
        setWatchlist(prev => [...prev, movies.find(m => m._id === movieId)]);
      } else {
        await removeFromWatchlist(movieId);
        setWatchlist(prev => prev.filter(m => m._id !== movieId));
      }
    } catch (err) {
      setError('Failed to update watchlist');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="movies-page">
      <h2>All Movies</h2>
      <div className="movie-list">
        {movies.map(movie => (
          <MovieCard 
            key={movie._id} 
            movie={movie} 
            isInWatchlist={watchlist.some(w => w._id === movie._id)}
            onWatchlistChange={handleWatchlistChange}
          />
        ))}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Movies;