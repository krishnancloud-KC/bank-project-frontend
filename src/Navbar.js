// src/components/Navbar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaUniversity, 
  FaTachometerAlt, 
  FaExchangeAlt, 
  FaShieldAlt, 
  FaRobot, 
  FaSignOutAlt 
} from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaUniversity />
        SecureBank
      </div>

      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaTachometerAlt /> <span>Dashboard</span>
        </NavLink>

        <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaExchangeAlt /> <span>Transactions</span>
        </NavLink>

        <NavLink to="/fraud-alerts" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaShieldAlt /> <span>Fraud Alerts</span>
        </NavLink>

        <NavLink to="/chatbot" className={({ isActive }) => isActive ? 'active' : ''}>
          <FaRobot /> <span>Chatbot</span>
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>{user?.username || 'Logout'}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;