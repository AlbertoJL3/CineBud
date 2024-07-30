import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Movies from './pages/Movies';
import './styles/MovieList.css';
import './styles/MovieCard.css';
import './styles/Movies.css';
import GradientBackground from './components/gradient';

function App() {
  return (
    <Router>
      <GradientBackground>
        <div className="App">
          <Routes>
            <Route path="/" element={<Movies />} />
          </Routes>
        </div>
      </GradientBackground>
    </Router>
  );
}
export default App;