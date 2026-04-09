// src/components/FraudAlerts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaSync } from 'react-icons/fa';

const FRAUD_URL = 'https://fraud-detection-service-340118508666.asia-south1.run.app';

const FraudAlerts = ({ token }) => {
  const [alerts, setAlerts]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${FRAUD_URL}/alerts`, { headers });
      setAlerts(res.data?.alerts || []);
    } catch (err) {
      console.error('Fraud fetch error:', err);
      // Demo data
      setAlerts([
        {
          id: 'FRD001',
          transaction_id: 'TXN009',
          risk_level: 'high',
          reason: 'Unusual large transaction detected from new location',
          amount: 95000,
          status: 'active',
          created_at: new Date(),
        },
        {
          id: 'FRD002',
          transaction_id: 'TXN007',
          risk_level: 'medium',
          reason: 'Multiple transactions in short time period',
          amount: 15000,
          status: 'active',
          created_at: new Date(),
        },
        {
          id: 'FRD003',
          transaction_id: 'TXN005',
          risk_level: 'low',
          reason: 'Transaction from unrecognized device',
          amount: 3000,
          status: 'resolved',
          created_at: new Date(),
        },
        {
          id: 'FRD004',
          transaction_id: 'TXN003',
          risk_level: 'high',
          reason: 'Suspicious pattern: rapid successive withdrawals',
          amount: 50000,
          status: 'resolved',
          created_at: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const handleResolve = async (alertId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`${FRAUD_URL}/alerts/${alertId}/resolve`, {}, { headers });
      setAlerts(prev =>
        prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a)
      );
    } catch (err) {
      // Update locally if API fails
      setAlerts(prev =>
        prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a)
      );
    }
  };

  const filtered = alerts.filter(a => filter === 'all' || a.status === filter);

  const counts = {
    total:    alerts.length,
    active:   alerts.filter(a => a.status === 'active').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    high:     alerts.filter(a => a.risk_level === 'high').length,
  };

  const getRiskIcon = (level) => {
    if (level === 'high')   return '🔴';
    if (level === 'medium') return '🟠';
    return '🟡';
  };

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div> Loading Fraud Alerts...
    </div>
  );

  return (
    <div className="main-content">
      <div className="page-header">
        <h2><FaShieldAlt /> Fraud Alerts</h2>
        <p>Monitor and manage suspicious activities</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><FaShieldAlt /></div>
          <div className="stat-info">
            <h3>{counts.total}</h3>
            <p>Total Alerts</p>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon"><FaExclamationTriangle /></div>
          <div className="stat-info">
            <h3>{counts.active}</h3>
            <p>Active Alerts</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-info">
            <h3>{counts.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon"><FaExclamationTriangle /></div>
          <div className="stat-info">
            <h3>{counts.high}</h3>
            <p>High Risk</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
          >
            <option value="all">All Alerts</option>
            <option value="active">Active Only</option>
            <option value="resolved">Resolved Only</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '6px',
              border: '1px solid #1a237e', color: '#1a237e',
              background: 'white', cursor: 'pointer', fontWeight: 600
            }}
          >
            <FaSync className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          <span style={{ marginLeft: 'auto', color: '#666', fontSize: '0.9rem' }}>
            Showing {filtered.length} of {alerts.length} alerts
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="card">
        <div className="card-title"><FaShieldAlt /> Alert Details</div>

        {filtered.length > 0 ? filtered.map((alert) => (
          <div key={alert.id} className={`alert-card ${alert.risk_level}`}>
            <div className="alert-icon">{getRiskIcon(alert.risk_level)}</div>
            <div className="alert-info" style={{ flex: 1 }}>
              <h4>{alert.reason}</h4>
              <p>
                🔖 Alert ID: <strong>{alert.id}</strong> &nbsp;|&nbsp;
                💳 TXN: <strong>{alert.transaction_id}</strong> &nbsp;|&nbsp;
                💰 Amount: <strong>₹{alert.amount?.toLocaleString()}</strong> &nbsp;|&nbsp;
                📅 {new Date(alert.created_at).toLocaleDateString()}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <span className={`badge ${alert.status === 'active' ? 'badge-danger' : 'badge-success'}`}>
                {alert.status?.toUpperCase()}
              </span>
              <span className={`badge ${
                alert.risk_level === 'high' ? 'badge-danger' :
                alert.risk_level === 'medium' ? 'badge-warning' : 'badge-info'
              }`}>
                {alert.risk_level?.toUpperCase()} RISK
              </span>
              {alert.status === 'active' && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  style={{
                    padding: '4px 12px', borderRadius: '6px',
                    border: 'none', background: '#2e7d32',
                    color: 'white', cursor: 'pointer', fontSize: '0.8rem'
                  }}
                >
                  ✓ Resolve
                </button>
              )}
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            ✅ No alerts found
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudAlerts;