import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import FraudAlerts from './components/FraudAlerts';
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken('');
    setUser({});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        {token && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={
            !token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />
          } />
          <Route path="/dashboard" element={
            token ? <Dashboard token={token} user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/transactions" element={
            token ? <Transactions token={token} /> : <Navigate to="/login" />
          } />
          <Route path="/fraud" element={
            token ? <FraudAlerts token={token} /> : <Navigate to="/login" />
          } />
          <Route path="/chat" element={
            token ? <Chatbot token={token} /> : <Navigate to="/login" />
          } />
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;