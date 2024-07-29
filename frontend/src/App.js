import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Movies from './pages/Movies';
import './styles/MovieList.css';
import './styles/MovieCard.css';
import './styles/Movies.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Movies />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;