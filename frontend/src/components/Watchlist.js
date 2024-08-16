import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import '../styles/Watchlist.css';

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch the watchlist from your backend or local storage
    // For now, we'll use dummy data
    const dummyWatchlist = [
      { id: 1, title: "Inception", poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
      { id: 2, title: "The Shawshank Redemption", poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg" },
      { id: 3, title: "The Dark Knight", poster_path: "/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg" },
    ];
    setWatchlist(dummyWatchlist);
  }, []);

  const removeFromWatchlist = (movieId) => {
    setWatchlist(watchlist.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="watchlist-container">
      <h2>My Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty. Start adding movies!</p>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map(movie => (
            <div key={movie.id} className="watchlist-item">
              <MovieCard movie={movie} />
              <button onClick={() => removeFromWatchlist(movie.id)} className="remove-button">
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;