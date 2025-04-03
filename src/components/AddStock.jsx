import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AddStock() {
    const [symbol, setSymbol] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const validateForm = () => {
        if (!symbol.trim()) {
            setError("Symbol is required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);
      
        if (!validateForm()) {
          setIsLoading(false);
          return;
        }
      
        const token = localStorage.getItem('authToken');
      
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/add-stock.php`,
            { symbol, note },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            }
          );
      
          console.log(response.data);
          navigate('/watchlist');
        } catch (error) {
          console.error(error);
          setError('Failed to add stock. Please try again later.');
          setIsLoading(false);
        }
      };
      

    return (
        <div className="container mt-4">
            <h2>Add a Stock to Watchlist</h2>

            <Link to="/watchlist" className="btn btn-secondary mb-3">
                Back to Watchlist
            </Link>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="symbol" className="form-label">
                        Symbol
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="note" className="form-label">
                        Note (optional)
                    </label>
                    <textarea
                        className="form-control"
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-secondary" disabled={isLoading}>
                    {isLoading ? (
                        <span>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Adding Stock...
                        </span>
                    ) : (
                        'Add Stock'
                    )}
                </button>
            </form>
        </div>
    );
}

export default AddStock;
