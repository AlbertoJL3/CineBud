import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getWatchlist, removeFromWatchlist } from '../utils/api';
import '../styles/Watchlist.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const data = await getWatchlist();
      setWatchlist(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch watchlist');
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
      setWatchlist(watchlist.filter(movie => movie._id !== movieId));
    } catch (err) {
      setError('Failed to remove movie from watchlist');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="watchlist-container">
      <h2 styles="color: white;">My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty. Start adding movies!</p>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map(movie => (
            <div key={movie._id} className="watchlist-item">
              <MovieCard 
                movie={movie} 
                isInWatchlist={true}
                onWatchlistChange={() => handleRemoveFromWatchlist(movie._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;