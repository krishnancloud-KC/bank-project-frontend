import React, { useEffect, useState } from 'react';
import axios from 'axios';
const TXN_URL = 'https://transaction-service-340118508666.asia-south1.run.app';
function Transactions() {
  const [txns, setTxns] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(TXN_URL + '/transactions', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => setTxns(res.data || [])).catch(() => {});
  }, []);
  return (
    <div className="transactions">
      <h2>Transactions</h2>
      <table>
        <thead><tr><th>ID</th><th>Amount</th><th>Type</th><th>Date</th></tr></thead>
        <tbody>{txns.map((t, i) => (
          <tr key={i}><td>{t.id}</td><td>Rs {t.amount}</td><td>{t.type}</td><td>{t.date}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
export default Transactions;