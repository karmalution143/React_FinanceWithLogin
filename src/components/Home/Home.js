import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';

const App = ({ darkMode }) => {
  const [topStock, setTopStock] = useState(null);
  const [date, setDate] = useState('');
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  
    // Quotes data array
    const quotes = [
      { title: "The Power of Financial Independence", text: "Financial independence is not a dream, it's a decision." },
      { title: "True Wealth", text: "True wealth is not measured in money, but in freedom." },
      { title: "Invest in Yourself", text: "The best investment you can make is in yourself." },
      { title: "Mindset is Key", text: "The only thing standing between you and your financial freedom is your mindset." },
      { title: <>Mastering Time, <br/> Unlocking Wealth</>, text: "Financial freedom isn’t about chasing money—it’s about mastering your time." },
    ];

  useEffect(() => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long' };
    setDate(today.toLocaleDateString('en-US', options));

    setTopStock({
      name: 'Tesla Inc.',
      symbol: 'TSLA',
      price: 400.00,
      change: '+5.2%',
    });

    const handleScroll = (e) => {
      const scrollY = window.scrollY || window.pageYOffset || e.touches?.[0]?.clientY || 0;
      setScrollPosition(scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchmove', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, 
  
  []);

  return (
    <div className="home-screen">
      <div className="home-wrapper">
        <section className="login-register-section">
          <h2>Welcome! Please Login or Register</h2>
          <div className="login-register-buttons">
            {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
            <Link to="/login" className="nav-link">
              <button className="btn btn-secondary">Login</button>
            </Link>
            <Link to="/register" className="nav-link">
              <button className="btn btn-secondary">Register</button>
            </Link>
            </>
            )}
          </div>
        </section>

        <section className="stock-of-the-month-section">
          <h2>Top Stock of the Month</h2>
          {topStock ? (
            <div className="stock-info">
              <p><strong>{topStock.name} ({topStock.symbol})</strong></p>
              <p>Price: ${topStock.price.toFixed(2)}</p>
              <p>Change: {topStock.change}</p>
              <p>Date: {date}</p>
            </div>
              ) : (
              <p>Loading...</p>
              )}
        </section>
      </div> 
      {/* Financial Freedom Quotes Section */}
      <div className="financial-freedom-quotes">
        {quotes.map((quote, index) => {
          const baseOffset = index * 220;
          const effectiveScroll = scrollPosition - baseOffset;

          const right = effectiveScroll > 75
            ? `${10 + (effectiveScroll) / 20}%`
            : '0%';

          const left = effectiveScroll > 75
          ? `${10 + effectiveScroll / 20}%`
          : '0%';

          const opacity = effectiveScroll > 0
            ? Math.max(1 - (effectiveScroll) / 500, 0)
            : 1;

          return (
            <div className='content-wrapper' key={index}>
              <section
                className="home-quote-title"
                style={{ right, opacity }}
              >
                <h3>{quote.title}</h3>
              </section>
              <section className="home-quote"
                style={{ left, opacity }}>
                <p>"{quote.text}"</p>
                
              </section>
            </div>
          );
        })}
      </div> 

      <div className="five-steps-section">
        <h2>5 Steps to Achieve Financial Freedom</h2>
        <ol className="steps-list">
        <li>
            <strong>Step 1: Start Now</strong>
            <p>It doesn't matter if you are 60 years old or 10 years old. Start Now.</p>
          </li>
          <li>
            <strong>Step 2: Create a Budget</strong>
            <p>Track your income and expenses. A budget helps you understand where your money goes and allows you to save more effectively.</p>
          </li>
          <li>
            <strong>Step 3: Build an Emergency Fund</strong>
            <p>Start saving for unexpected expenses. Put away $10 a month. Start Now.</p>
          </li>
          <li>
            <strong>Step 3: Prioritize Paying Off High-Interest Debt</strong>
            <p>You have no idea how your money will start to grow once your are credit card free. It is the biggest burden.</p>
          </li>
          <li>
            <strong>Step 4: Open an investment account</strong>
            <p>Just open it. Make sure it does not have fees associated with it. Add $20 per month. Start Now.</p>
          </li>
        </ol>
      </div>

      <div className="wealth-simple-section">
        <h3>Recommended: Open a WealthSimple TFSA Account</h3>
        <p>
          If you're in Canada, I recommend opening a WealthSimple TFSA account to start investing and building your wealth tax-free. 
          It's a great platform that simplifies investing, and with their no-fee accounts, it's a solid choice to begin your journey to financial freedom.
        </p>
        <p>
          Use my referral link below to sign up, and we both benefit!
        </p>
        <a href="https://www.wealthsimple.com/invite/WQFPTW" target="_blank" rel="noopener noreferrer" className="referral-link">
          Sign up with my referral link
        </a>
      </div>

    </div>
  );
};

export default App;
