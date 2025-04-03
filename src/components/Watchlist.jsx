import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import he from 'he';

const Watchlist = ({ darkMode }) => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isLoggedIn, user } = useContext(AuthContext);

  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setIsLoading(true);
      setError('');
      setStocks([]);

      try {
        const token = localStorage.getItem("authToken");
        const headers = isLoggedIn ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/get-watchlist.php`,
          {
            params: { page: currentPage },
            headers,
          }
        );

        if (response.data && Array.isArray(response.data.stocks)) {
          setStocks(response.data.stocks);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.error("Invalid API Response: No stocks array found.");
          setStocks([]);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err.response?.data || err.message);
        setError("Failed to load watchlist.");
        setStocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Set current date
    const today = new Date();
    setCurrentDate(today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));

    fetchWatchlist();

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, isLoggedIn]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock?')) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/delete-stock.php?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 200) {
        setStocks(stocks.filter((stock) => stock.id !== id));
        alert('Stock deleted successfully!');
      } else {
        alert('Failed to delete the stock. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting stock:', err);
      alert('An error occurred while trying to delete the stock.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (id) => {
    const stockToEdit = stocks.find((stock) => stock.id === id);
    navigate(`/edit-stock/${id}`, { state: { stock: stockToEdit } });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="watchlist-background-text-title" style={{
        left: `${80 + scrollPosition / 5}%`,
        opacity: `${Math.max(1 - scrollPosition / 500, 0)}`,
      }}>
        <p>Financial Freedom</p>
      </div>
      <div className="watchlist-background-text" style={{
        left: `${80 + scrollPosition / 4}%`,
        opacity: `${Math.max(1 - scrollPosition / 500, 0)}`,
      }}>
        <p>We all have a right</p>
      </div>

      <h2>{isLoggedIn ? 'My Watchlist' : 'Public Watchlist'}</h2>
      <p className="text-muted">
        {isLoggedIn ? `Welcome, ${user?.name || 'User'}` : 'You are viewing a public watchlist'}
      </p>

      <div className="d-flex justify-content-between align-items-center mb-2 mt-5">
        <Link to="/add-stock" className="btn btn-secondary">Add Stock</Link>
        <p className="text-muted-bold mb-0">{currentDate}</p>
      </div>

      <table className={`table ${darkMode ? 'table-dark' : 'custom-table'}`}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company Name</th>
            <th>Price</th>
            <th>Note</th>
            {isLoggedIn && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.symbol}</td>
              <td>{he.decode(stock.companyName || '')}</td>
              <td>{stock.price !== 'N/A' ? `$${Number(stock.price).toFixed(2)}` : 'N/A'}</td>
              <td>{he.decode(stock.note)}</td>
              {isLoggedIn && (
                <td>
                  <button className="btn btn-outline-edit btn-sm me-2" onClick={() => handleEdit(stock.id)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(stock.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls mt-4">
        <Link className="btn btn-secondary" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>Previous</Link>
        <span className="mx-2">Page {currentPage} of {totalPages}</span>
        <Link className="btn btn-secondary" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</Link>
      </div>

      <div className="mt-4">
        <small className="text-muted-bold d-block">
          * Note: API requests are limited to 5 calls per minute as the website is currently in beta testing.
          Stock prices shown reflect the closing prices of the previous trading day.
        </small>
      </div>
    </div>
  );
};

export default Watchlist;
