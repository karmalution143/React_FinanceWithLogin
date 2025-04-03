import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AddStock from './components/AddStock';
import Watchlist from './components/Watchlist';
import About from './components/About/About';
import EditStock from './components/EditStock';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { AuthContext } from './context/AuthContext';

document.body.style.background = 'url(https://tiffanylocicero.com/finance/Images/Finance-bkg.jpg) no-repeat center center fixed';
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      
      <BrowserRouter basename="/finance">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/about" element={<About darkMode={darkMode} />} />
            <Route path="/watchlist" element={<Watchlist isLoggedIn={isLoggedIn} darkMode={darkMode} />} />
            <Route path="/add-stock" element={<AddStock darkMode={darkMode} />} />
            <Route path="/edit-stock/:id" element={<EditStock darkMode={darkMode} />} />
            <Route path="/login" element={<Login darkMode={darkMode} />} />
            <Route path="/register" element={<Register darkMode={darkMode} />} />
            <Route path="/forgot-password" element={<ForgotPassword darkMode={darkMode} />} />
            <Route path="/reset-password" element={<ResetPassword darkMode={darkMode} />} />
          </Routes>
        </div>
        <Footer darkMode={darkMode} />
      </BrowserRouter>
    </div>
  );
}

export default App;
