import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';

const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Transactions = lazy(() => import('./components/Transactions'));
const FraudAlerts = lazy(() => import('./components/FraudAlerts'));
const Chatbot = lazy(() => import('./components/Chatbot'));

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
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </div>
    </Router>
  );
}

export default App;