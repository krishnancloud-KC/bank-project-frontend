import React, { useEffect, useState } from 'react';
import axios from 'axios';
const TXN_URL = 'https://transaction-service-340118508666.asia-south1.run.app';
function Dashboard() {
  const [stats, setStats] = useState({ total: 0, credits: 0, debits: 0 });
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(TXN_URL + '/transactions', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => {
        const txns = res.data || [];
        const credits = txns.filter(t => t.type === 'credit').reduce((a, b) => a + b.amount, 0);
        const debits = txns.filter(t => t.type === 'debit').reduce((a, b) => a + b.amount, 0);
        setStats({ total: txns.length, credits, debits });
      }).catch(() => {});
  }, []);
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card"><h3>Total Transactions</h3><p>{stats.total}</p></div>
        <div className="stat-card"><h3>Total Credits</h3><p>Rs {stats.credits}</p></div>
        <div className="stat-card"><h3>Total Debits</h3><p>Rs {stats.debits}</p></div>
      </div>
    </div>
  );
}
export default Dashboard;