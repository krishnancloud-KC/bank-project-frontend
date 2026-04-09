import React, { useEffect, useState } from 'react';
import axios from 'axios';
const FRAUD_URL = 'https://fraud-detection-service-340118508666.asia-south1.run.app';
function FraudAlerts() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(FRAUD_URL + '/alerts', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => setAlerts(res.data || [])).catch(() => {});
  }, []);
  return (
    <div className="fraud-alerts">
      <h2>Fraud Alerts</h2>
      {alerts.length === 0 ? <p>No fraud alerts found.</p> :
        <ul>{alerts.map((a, i) => (
          <li key={i} className="alert-item"><strong>{a.type}</strong> - {a.description} - {a.date}</li>
        ))}</ul>}
    </div>
  );
}
export default FraudAlerts;