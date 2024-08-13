import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Movies from './pages/Movies';
import Home from './pages/Home';
import Navbar from './components/NavBar';
import './styles/MovieList.css';
import './styles/MovieCard.css';
import './styles/Movies.css';
import GradientBackground from './components/styles/gradient';

function App() {
  return (
    <Router>
      <GradientBackground>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/watchlist" element={<Movies />} />
          </Routes>
        </div>
      </GradientBackground>
    </Router>
  );
}

export default App;