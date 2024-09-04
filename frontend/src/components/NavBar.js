import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'; // Import the useAuth hook
import '../styles/NavBar.css';

function Navbar() {
  const { user, logout } = useAuth(); // Use the useAuth hook to get user and logout function
  const navigate = useNavigate(); // Use navigate for redirection after logout

  // Handle logout
  const handleLogout = async () => {
    await logout(); // Call the logout function from AuthContext
    navigate('/'); // Redirect to home page after logout
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
              // If user is logged in, show Logout button
              <button onClick={handleLogout} className="nav-links bebas-neue-regular">
                Logout
              </button>
            ) : (
              // If user is not logged in, show Login link
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