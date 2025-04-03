import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';
import { FaMoon, FaSun } from 'react-icons/fa';

const Navbar = ({ darkMode, toggleDarkMode }) => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        logout();
        navigate('../');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Aligned Prosperity Network
                </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <li className="nav-item"> 
            <button className="btn btn-link" onClick={toggleDarkMode}>
            {darkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
            </button>
          </li>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/watchlist">
                {isLoggedIn ? 'My Watchlist' : 'Public Watchlist'}
              </Link>
            </li>
            {isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link className="nav-link" onClick={handleLogout} style={{ textDecoration: 'none' }}>
                Logout
              </Link>
            </li>
          </>
            ) : (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
