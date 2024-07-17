import React, { useState, useEffect } from 'react';
import MovieList from '../components/MovieList';
import { fetchMovies } from '../services/api';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect running');
    const getMovies = async () => {
      try {
        console.log('Fetching movies...');
        const fetchedMovies = await fetchMovies();
        console.log('Fetched movies:', fetchedMovies);
        setMovies(fetchedMovies);
        setLoading(false);
      } catch (err) {
        console.error('Error in getMovies:', err);
        setError('Failed to fetch movies. Please try again later.');
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Movie Recommendations</h1>
      <MovieList movies={movies} />
    </div>
  );
}

export default HomePage;