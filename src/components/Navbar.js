import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">BankApp</div>
      <div className="navbar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/transactions">Transactions</Link>
        <Link to="/fraud-alerts">Fraud Alerts</Link>
        <Link to="/chatbot">Chatbot</Link>
      </div>
      <div className="navbar-user">
        <span>{user.email || 'User'}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}
export default Navbar;