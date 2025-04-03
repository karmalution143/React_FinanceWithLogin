import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';


const Login = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Access the login function from AuthContext
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/login.php`,
        { email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('Login Response:', response.data);

      if (response.data.success) {
        
        const decodedToken = jwtDecode(response.data.token);
        console.log("Decoded Token:", decodedToken);

        login(response.data.user, response.data.token);
        
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user_id', decodedToken.user_id);


        navigate('/watchlist');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error logging in. Please try again.');
      }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="login-register-buttons">
          <button type="submit" className="btn btn-secondary">Login</button>
          <button type="button" className="btn btn-secondary" onClick={handleRegister}>Register</button>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
