import React from 'react';

function MovieItem({ movie }) {
  return (
    <div>
      <h2>{movie.title}</h2>
      <p>Release Date: {movie.release_date}</p>
      <p>IMDB Rating: {movie.imdb_rating}</p>
      {movie.poster && <img src={movie.poster} alt={movie.title} style={{width: '100px'}} />}
    </div>
  );
}

export default MovieItem;