import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const CHATBOT_URL = 'https://chatbot-service-340118508666.asia-south1.run.app';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hello! I am your Banking Assistant. How can I help you today?',
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      role: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${CHATBOT_URL}/chat`,
        { message: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMsg = {
        role: 'bot',
        text: res.data.response || res.data.message || 'No response received.',
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Sorry, I could not connect to the server. Please try again.',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'What is my balance?',
    'Show recent transactions',
    'Any fraud alerts?',
    'How to transfer money?',
  ];

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="bot-avatar">🤖</div>
        <div>
          <h2>Banking Assistant</h2>
          <span className="status-dot">● Online</span>
        </div>
      </div>

      <div className="quick-questions">
        {quickQuestions.map((q, i) => (
          <button key={i} className="quick-btn" onClick={() => setInput(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="bubble">{msg.text}</div>
            <span className="msg-time">{msg.time}</span>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
