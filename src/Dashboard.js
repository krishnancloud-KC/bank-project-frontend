// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWallet, FaExchangeAlt, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const TRANSACTION_URL = 'https://transaction-service-340118508666.asia-south1.run.app';
const FRAUD_URL = 'https://fraud-detection-service-340118508666.asia-south1.run.app';

const Dashboard = ({ user, token }) => {
  const [stats, setStats]               = useState(null);
  const [recentTxns, setRecentTxns]     = useState([]);
  const [fraudCount, setFraudCount]     = useState(0);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [txnRes, fraudRes] = await Promise.all([
        axios.get(`${TRANSACTION_URL}/transactions`, { headers }),
        axios.get(`${FRAUD_URL}/alerts`, { headers })
      ]);

      const txns = txnRes.data?.transactions || [];
      const fraudAlerts = fraudRes.data?.alerts || [];

      const totalBalance = txns.reduce((acc, t) => {
        return t.type === 'credit' ? acc + t.amount : acc - t.amount;
      }, 10000);

      setStats({
        balance: totalBalance.toFixed(2),
        totalTxns: txns.length,
        credits: txns.filter(t => t.type === 'credit').length,
        debits: txns.filter(t => t.type === 'debit').length,
      });

      setRecentTxns(txns.slice(0, 5));
      setFraudCount(fraudAlerts.filter(a => a.status === 'active').length);

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      // Demo data if API fails
      setStats({ balance: '10,000.00', totalTxns: 12, credits: 7, debits: 5 });
      setRecentTxns([
        { id: 'TXN001', type: 'credit', amount: 5000, description: 'Salary', created_at: new Date() },
        { id: 'TXN002', type: 'debit',  amount: 1200, description: 'Rent',   created_at: new Date() },
        { id: 'TXN003', type: 'credit', amount: 2000, description: 'Bonus',  created_at: new Date() },
      ]);
      setFraudCount(2);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div> Loading Dashboard...
    </div>
  );

  return (
    <div className="main-content">
      <div className="page-header">
        <h2>👋 Welcome, {user?.username || 'User'}!</h2>
        <p>Here's your account overview</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><FaWallet /></div>
          <div className="stat-info">
            <h3>₹{stats?.balance}</h3>
            <p>Total Balance</p>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon"><FaExchangeAlt /></div>
          <div className="stat-info">
            <h3>{stats?.totalTxns}</h3>
            <p>Total Transactions</p>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-info">
            <h3>{stats?.credits} / {stats?.debits}</h3>
            <p>Credits / Debits</p>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon"><FaShieldAlt /></div>
          <div className="stat-info">
            <h3>{fraudCount}</h3>
            <p>Active Fraud Alerts</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-title">
          <FaExchangeAlt /> Recent Transactions
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTxns.length > 0 ? recentTxns.map((txn, i) => (
                <tr key={txn.id || i}>
                  <td><code>{txn.id}</code></td>
                  <td>
                    <span className={`badge ${txn.type === 'credit' ? 'badge-success' : 'badge-danger'}`}>
                      {txn.type?.toUpperCase()}
                    </span>
                  </td>
                  <td className={txn.type === 'credit' ? 'amount-credit' : 'amount-debit'}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                  </td>
                  <td>{txn.description || '—'}</td>
                  <td>{new Date(txn.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{textAlign:'center', color:'#999'}}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;