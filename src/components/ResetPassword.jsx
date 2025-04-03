import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      console.log("Validating token:", token);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/reset-password.php`, {
          params: { token }
        });
        console.log("Token validation response:", response.data);
        setTokenValid(true);
        setEmail(response.data.email);
      } catch (err) {
        console.error("Token validation error:", err.response?.data || err.message);
        setError(err.response?.data?.error || 'Invalid or expired token');
      }
    };

    if (token) {
      validateToken();
    } else {
      setError('Missing reset token in URL.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirm) {
      setError('Please fill in both fields.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/reset-password.php`, {
        token,
        password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage(response.data.message || 'Password updated successfully.');
      setTimeout(() => navigate('/login'), 3000); // redirect after success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Reset Your Password</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {tokenValid && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;