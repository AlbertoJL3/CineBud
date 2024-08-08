// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CineBud
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/movies" className="nav-links">
              All Movies
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/watchlist" className="nav-links">
              Watchlist
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;