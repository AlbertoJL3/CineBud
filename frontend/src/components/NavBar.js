import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/NavBar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo bebas-neue-regular">
          CineBud
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links bebas-neue-regular">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/movies" className="nav-links bebas-neue-regular">
              All Movies
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/watchlist" className="nav-links bebas-neue-regular">
              Watchlist
            </Link>
          </li>
          <li className="nav-item">
            {user ? (
              <Link to="/" onClick={handleLogout} className="nav-links bebas-neue-regular">
                Logout
              </Link>
            ) : (
              <Link to="/login" className="nav-links bebas-neue-regular">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;