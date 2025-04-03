import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/forgot-password.php`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage(response.data.message || 'If the email exists, a reset link was sent.');
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError(err.response?.data?.error || 'Failed to send reset request.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link.</p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-secondary">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
