import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket;

export default function Chat() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [match, setMatch] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();
  const typingTimeout = useRef();

  const other = match?.users?.find((u) => u._id !== user?._id) || match?.users?.[0];

  useEffect(() => {
    // Connect socket
    socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    socket.emit('user_online', user?._id);
    socket.emit('join_room', matchId);

    socket.on('receive_message', (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
    });

    socket.on('user_typing', () => setIsTyping(true));
    socket.on('user_stop_typing', () => setIsTyping(false));

    // Fetch history + match
    Promise.all([
      axios.get(`/api/chat/${matchId}`),
      axios.get(`/api/matches/${matchId}`),
    ])
      .then(([chatRes, matchRes]) => {
        setMessages(chatRes.data.messages);
        setMatch(matchRes.data.match);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => { socket.disconnect(); };
  }, [matchId, user?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const content = input.trim();
    setInput('');

    // Optimistic add
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      content,
      sender: { _id: user._id, name: user.name },
      createdAt: new Date().toISOString(),
      temp: true,
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await axios.post(`/api/chat/${matchId}`, { content });
      setMessages((prev) => prev.map((m) => (m._id === tempMsg._id ? res.data.message : m)));
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    socket.emit('typing', { roomId: matchId, userId: user._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stop_typing', { roomId: matchId, userId: user._id });
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwn = (msg) => msg.sender?._id === user?._id || msg.sender === user?._id;

  if (loading) return <div style={styles.center}><div className="spinner" /></div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(`/matches/${matchId}`)}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div style={styles.headerAvatar}>{other?.name?.[0]?.toUpperCase()}</div>
        <div style={styles.headerInfo}>
          <div style={styles.headerName}>{other?.name}</div>
          <div style={styles.headerSub}>Matched flatmate • {match?.compatibilityScore}% compatible</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 14px' }}
          onClick={() => navigate(`/matches/${matchId}`)}>
          View profile
        </button>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.emptyChat}>
            <div style={styles.emptyChatIcon}>👋</div>
            <p style={styles.emptyChatText}>You matched! Say hi to {other?.name}</p>
          </div>
        )}

        {messages.map((msg) => {
          const own = isOwn(msg);
          return (
            <div key={msg._id} style={{ ...styles.msgRow, ...(own ? styles.msgRowOwn : {}) }}>
              {!own && (
                <div style={styles.msgAvatar}>{other?.name?.[0]?.toUpperCase()}</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: own ? 'flex-end' : 'flex-start', maxWidth: '65%' }}>
                <div style={{ ...styles.bubble, ...(own ? styles.bubbleOwn : styles.bubbleOther), ...(msg.temp ? { opacity: 0.6 } : {}) }}>
                  {msg.content}
                </div>
                <div style={styles.msgTime}>{formatTime(msg.createdAt)}</div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={styles.msgRow}>
            <div style={styles.msgAvatar}>{other?.name?.[0]?.toUpperCase()}</div>
            <div style={{ ...styles.bubble, ...styles.bubbleOther }}>
              <div style={styles.typingDots}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <div style={styles.inputRow}>
          <textarea
            style={styles.textInput}
            placeholder={`Message ${other?.name}...`}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button style={{ ...styles.sendBtn, ...(input.trim() ? styles.sendBtnActive : {}) }}
            onClick={handleSend} disabled={!input.trim()}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p style={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
      </div>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .typing-dot { width:7px; height:7px; background:#606070; border-radius:50%; animation: bounce 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay:0.15s; }
        .typing-dot:nth-child(3) { animation-delay:0.3s; }
      `}</style>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '64px', background: '#0a0a0f' },
  center: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px 24px', background: 'rgba(10,10,15,0.9)',
    borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
    flexShrink: 0,
  },
  backBtn: {
    background: 'none', border: 'none', color: '#a0a0b0', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: '4px',
  },
  headerAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '16px', color: 'white', flexShrink: 0,
  },
  headerInfo: { flex: 1 },
  headerName: { fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700' },
  headerSub: { color: '#606070', fontSize: '12px' },
  messages: {
    flex: 1, overflow: 'auto', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '12px',
  },
  emptyChat: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '12px', paddingTop: '80px',
  },
  emptyChatIcon: { fontSize: '48px' },
  emptyChatText: { color: '#606070', fontSize: '16px' },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '8px' },
  msgRowOwn: { flexDirection: 'row-reverse' },
  msgAvatar: {
    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #4d96ff, #6bcb77)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '12px', color: 'white',
  },
  bubble: {
    padding: '12px 16px', borderRadius: '18px', fontSize: '15px', lineHeight: 1.5,
    maxWidth: '100%', wordBreak: 'break-word',
  },
  bubbleOwn: { background: '#ff6b6b', color: 'white', borderBottomRightRadius: '4px' },
  bubbleOther: { background: '#1a1a24', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.06)', borderBottomLeftRadius: '4px' },
  msgTime: { fontSize: '11px', color: '#606070', marginTop: '4px', paddingLeft: '4px', paddingRight: '4px' },
  typingDots: { display: 'flex', gap: '4px', alignItems: 'center', padding: '2px 0' },
  inputArea: {
    flexShrink: 0, padding: '16px 24px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)',
  },
  inputRow: { display: 'flex', gap: '12px', alignItems: 'flex-end' },
  textInput: {
    flex: 1, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '14px', color: '#f0f0f0', padding: '12px 16px', fontSize: '15px',
    resize: 'none', lineHeight: 1.5, fontFamily: 'DM Sans, sans-serif',
    maxHeight: '120px', overflow: 'auto',
  },
  sendBtn: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#606070', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
  },
  sendBtnActive: { background: '#ff6b6b', border: '1px solid #ff6b6b', color: 'white' },
  inputHint: { fontSize: '12px', color: '#606070', marginTop: '8px', paddingLeft: '4px' },
};
