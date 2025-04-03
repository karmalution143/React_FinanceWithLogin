import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EditStock() {

    const navigate = useNavigate();

    const [symbol, setSymbol] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { id } = useParams(); // Retrieve stock ID from URL params
    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const fetchStockDetails = async () => {
            try {
              const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/edit-stock.php?id=${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                }
              );
          
              const { symbol, note } = response.data;
              setSymbol(symbol || '');
              setNote(note || '');
            } catch (err) {
              console.error('Error fetching stock details:', err);
              setError('Failed to load stock details.');
            }
          };
          

        fetchStockDetails();
    }, [id]);

    const validateForm = () => {
        if (!symbol.trim()) {
            setError('Symbol is required.');
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
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/edit-stock.php`, {
                id,
                symbol,
                note,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(response.data);
            navigate('/watchlist');
        } catch (err) {
            console.error('Error editing stock:', err);
            setError('Failed to edit stock.');
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Edit Stock</h2>

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
                <button type="submit" className="btn btn-secondary mb-3" disabled={isLoading}>
                    {isLoading ? (
                        <span>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Saving...
                        </span>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </form>
        </div>
    );
}

export default EditStock;
