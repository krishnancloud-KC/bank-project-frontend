// src/components/Transactions.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExchangeAlt, FaPlus, FaSearch } from 'react-icons/fa';

const TRANSACTION_URL = 'https://transaction-service-340118508666.asia-south1.run.app';

const Transactions = ({ token }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState('all');
  const [formData, setFormData]         = useState({
    type: 'credit',
    amount: '',
    description: '',
    account_number: ''
  });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${TRANSACTION_URL}/transactions`, { headers });
      setTransactions(res.data?.transactions || []);
    } catch (err) {
      console.error('Fetch error:', err);
      // Demo data
      setTransactions([
        { id: 'TXN001', type: 'credit', amount: 5000, description: 'Salary',       account_number: 'ACC123', created_at: new Date(), status: 'completed' },
        { id: 'TXN002', type: 'debit',  amount: 1200, description: 'Rent',         account_number: 'ACC456', created_at: new Date(), status: 'completed' },
        { id: 'TXN003', type: 'credit', amount: 2000, description: 'Freelance',    account_number: 'ACC123', created_at: new Date(), status: 'completed' },
        { id: 'TXN004', type: 'debit',  amount: 500,  description: 'Groceries',    account_number: 'ACC789', created_at: new Date(), status: 'pending'   },
        { id: 'TXN005', type: 'debit',  amount: 3000, description: 'Electronics',  account_number: 'ACC456', created_at: new Date(), status: 'completed' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormMsg({ type: '', text: '' });

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${TRANSACTION_URL}/transactions`, formData, { headers });
      setFormMsg({ type: 'success', text: '✅ Transaction created successfully!' });
      setFormData({ type: 'credit', amount: '', description: '', account_number: '' });
      fetchTransactions();
      setTimeout(() => setShowForm(false), 1500);
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || '❌ Transaction failed!' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter + Search
  const filtered = transactions.filter(txn => {
    const matchFilter = filter === 'all' || txn.type === filter;
    const matchSearch = txn.description?.toLowerCase().includes(search.toLowerCase()) ||
                        txn.id?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div> Loading Transactions...
    </div>
  );

  return (
    <div className="main-content">
      <div className="page-header">
        <h2><FaExchangeAlt /> Transactions</h2>
        <p>View and manage all your transactions</p>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
            <FaSearch color="#999" />
            <input
              type="text"
              placeholder="Search by ID or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: '1px solid #ddd', padding: '8px 12px', borderRadius: '6px', width: '100%', outline: 'none' }}
            />
          </div>

          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
          >
            <option value="all">All Types</option>
            <option value="credit">Credit Only</option>
            <option value="debit">Debit Only</option>
          </select>

          {/* Add Button */}
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '8px 20px' }}
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus /> &nbsp;New Transaction
          </button>
        </div>
      </div>

      {/* New Transaction Form */}
      {showForm && (
        <div className="card">
          <div className="card-title"><FaPlus /> New Transaction</div>

          {formMsg.text && (
            <div className={formMsg.type === 'success' ? 'success-msg' : 'error-msg'}>
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', outline: 'none' }}
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  placeholder="Enter account number"
                  value={formData.account_number}
                  onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button className="btn-primary" type="submit"
                disabled={submitting} style={{ width: 'auto', padding: '10px 24px' }}>
                {submitting ? 'Processing...' : 'Submit Transaction'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card">
        <div className="card-title">
          <FaExchangeAlt /> All Transactions
          <span className="badge badge-info" style={{ marginLeft: '8px' }}>{filtered.length}</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Account</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((txn, i) => (
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
                  <td>{txn.account_number || '—'}</td>
                  <td>
                    <span className={`badge ${txn.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                      {txn.status || 'completed'}
                    </span>
                  </td>
                  <td>{new Date(txn.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#999', padding: '24px' }}>
                  No transactions found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;