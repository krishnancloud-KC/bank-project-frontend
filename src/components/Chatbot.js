import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
const CHAT_URL = 'https://chatbot-service-340118508666.asia-south1.run.app';
function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hello! I am your Banking Assistant.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(CHAT_URL + '/chat', { message: input }, { headers: { Authorization: 'Bearer ' + token } });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response || 'No response.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error.' }]);
    } finally { setLoading(false); }
  };
  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={"chat-message " + m.role}><div className="bubble">{m.text}</div></div>
        ))}
        {loading && <div className="chat-message bot"><div className="bubble">...</div></div>}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type message..." />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
export default Chatbot;