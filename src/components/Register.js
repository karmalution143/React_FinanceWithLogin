import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/register_user.php`,
        { name, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log(response); 
  
      if (response.data.success) {
        // Auto-login after successful registration
        const loginResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/login.php`,
          { email, password },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
  
        if (loginResponse.data.success) {
          const { token, user } = loginResponse.data;
          login(user, token); // updates AuthContext
          localStorage.setItem("authToken", token);
          localStorage.setItem("user_id", user.id);
          navigate('/watchlist');
        } else {
          setError('Registration succeeded but login failed.');
        }
  
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input 
            type="name" 
            className="form-control" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
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
        <button type="submit" className="btn btn-secondary">Register</button>
      </form>
    </div>
  );
}

export default Register;