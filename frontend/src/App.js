import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Movies from './pages/Movies';
import './styles/MovieList.css';
import './styles/MovieCard.css';
import './styles/Movies.css';
import GradientBackground from './components/styles/gradient'; // Ensure the import path is correct
import Loading from './components/Loading'; // Ensure the import path is correct

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request or any asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the timeout duration as needed
  }, []);

  return (
    <Router>
      <GradientBackground>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="App">
            <Routes>
              <Route path="/" element={<Movies />} />
              <Route path="/movies" element={<Movies />} />
              <Route path='/movie-results' element={<Movies />} />
            </Routes>
          </div>
        )}
      </GradientBackground>
    </Router>
  );
}

export default App;
