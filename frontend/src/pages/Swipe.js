import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Swipe() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDir, setSwipeDir] = useState(null);
  const [matchPopup, setMatchPopup] = useState(null);
  const navigate = useNavigate();
  const cardRef = useRef();

  useEffect(() => {
    axios.get('/api/users/discover')
      .then((r) => { setUsers(r.data.users); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const current = users[currentIndex];

  const swipe = async (dir) => {
    if (!current) return;
    setSwipeDir(dir);
    await new Promise((r) => setTimeout(r, 350));

    try {
      if (dir === 'like') {
        const res = await axios.post(`/api/matches/like/${current._id}`);
        if (res.data.isMatch) {
          setMatchPopup(current);
        }
      } else {
        await axios.post(`/api/matches/dislike/${current._id}`);
      }
    } catch (err) {
      console.error(err);
    }

    setSwipeDir(null);
    setCurrentIndex((i) => i + 1);
  };

  const getCardStyle = () => {
    if (swipeDir === 'like') return { ...styles.card, transform: 'translateX(200%) rotate(20deg)', opacity: 0, transition: 'all 0.35s ease' };
    if (swipeDir === 'dislike') return { ...styles.card, transform: 'translateX(-200%) rotate(-20deg)', opacity: 0, transition: 'all 0.35s ease' };
    return styles.card;
  };

  if (loading) return <div style={styles.center}><div className="spinner" /></div>;

  return (
    <div style={styles.page}>
      {matchPopup && (
        <div style={styles.matchOverlay}>
          <div style={styles.matchModal} className="fade-up">
            <div style={styles.matchEmoji}>🎉</div>
            <h2 style={styles.matchTitle}>It's a Match!</h2>
            <div style={styles.matchAvatar}>{matchPopup.name?.[0]?.toUpperCase()}</div>
            <p style={styles.matchDesc}>You and {matchPopup.name} both liked each other!</p>
            <div style={styles.matchBtns}>
              <button className="btn btn-ghost" onClick={() => setMatchPopup(null)}>Keep swiping</button>
              <button className="btn btn-primary" onClick={() => { setMatchPopup(null); navigate('/dashboard'); }}>
                See matches
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Discover</h1>
          <span style={styles.count}>{users.length - currentIndex} remaining</span>
        </div>

        {currentIndex >= users.length ? (
          <div style={styles.done}>
            <div style={styles.doneIcon}>✨</div>
            <h2 style={styles.doneTitle}>You've seen everyone!</h2>
            <p style={styles.doneDesc}>Check back later for new profiles, or see who you matched with.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>View matches</button>
          </div>
        ) : (
          <>
            {/* Background card preview */}
            {users[currentIndex + 1] && (
              <div style={styles.cardBehind}>
                <div style={styles.cardInner}>
                  <div style={styles.avatarLg}>{users[currentIndex + 1].name?.[0]?.toUpperCase()}</div>
                </div>
              </div>
            )}

            {/* Main card */}
            <div ref={cardRef} style={getCardStyle()}>
              <div style={styles.cardInner}>
                <div style={styles.avatarLg}>{current.name?.[0]?.toUpperCase()}</div>
                <div style={styles.cardContent}>
                  <div style={styles.cardName}>{current.name}</div>
                  {current.profile?.location && (
                    <div style={styles.cardLocation}>📍 {current.profile.location}</div>
                  )}
                  <div style={styles.cardTags}>
                    {current.profile?.sleepSchedule && (
                      <span className="badge badge-blue">{current.profile.sleepSchedule.replace('_', ' ')}</span>
                    )}
                    {current.profile?.foodHabits && current.profile.foodHabits !== 'no_preference' && (
                      <span className="badge badge-green">{current.profile.foodHabits}</span>
                    )}
                    {current.profile?.workSchedule && (
                      <span className="badge badge-yellow">{current.profile.workSchedule.replace(/_/g, ' ')}</span>
                    )}
                    {current.profile?.smoking && <span className="badge badge-red">Smoker</span>}
                    {current.profile?.pets && <span className="badge badge-yellow">Has pets</span>}
                  </div>

                  {current.profile?.budget && (
                    <div style={styles.budget}>
                      💰 ₹{current.profile.budget.min?.toLocaleString()} – ₹{current.profile.budget.max?.toLocaleString()}/mo
                    </div>
                  )}

                  {current.profile?.aboutMe && (
                    <div style={styles.aboutBox}>
                      <div style={styles.aboutLabel}>About</div>
                      <p style={styles.aboutText}>{current.profile.aboutMe}</p>
                    </div>
                  )}

                  <div style={styles.cleanlinessRow}>
                    <span style={styles.cleanLabel}>Cleanliness</span>
                    <div style={styles.dots}>
                      {[1, 2, 3, 4, 5].map((d) => (
                        <div key={d} style={{ ...styles.dot, ...(d <= (current.profile?.cleanliness || 3) ? styles.dotFill : {}) }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={styles.actions}>
              <button style={styles.dislikeBtn} onClick={() => swipe('dislike')}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <button style={styles.likeBtn} onClick={() => swipe('like')}>
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            <p style={styles.hint}>← Skip &nbsp;&nbsp;&nbsp; Like →</p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', paddingTop: '88px', paddingBottom: '48px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
  container: { width: '100%', maxWidth: '420px', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: '28px', fontWeight: '800' },
  count: { color: '#606070', fontSize: '14px' },
  card: {
    width: '100%', background: '#16161f', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    position: 'relative', zIndex: 2,
  },
  cardBehind: {
    width: '92%', background: '#111118', border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '24px', overflow: 'hidden', position: 'absolute',
    top: '128px', zIndex: 1, transform: 'scale(0.96)',
  },
  cardInner: { padding: '0' },
  avatarLg: {
    width: '100%', height: '220px',
    background: 'linear-gradient(135deg, #1a0a0a, #2a1a2a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '72px', color: '#ff6b6b',
  },
  cardContent: { padding: '24px' },
  cardName: { fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '800', marginBottom: '6px' },
  cardLocation: { color: '#606070', fontSize: '14px', marginBottom: '12px' },
  cardTags: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  budget: { color: '#a0a0b0', fontSize: '14px', marginBottom: '16px' },
  aboutBox: { background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', marginBottom: '16px' },
  aboutLabel: { fontSize: '11px', fontWeight: '600', color: '#606070', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' },
  aboutText: { color: '#a0a0b0', fontSize: '14px', lineHeight: 1.6 },
  cleanlinessRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  cleanLabel: { fontSize: '13px', color: '#606070' },
  dots: { display: 'flex', gap: '4px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' },
  dotFill: { background: '#ff6b6b' },
  actions: { display: 'flex', gap: '32px', alignItems: 'center' },
  dislikeBtn: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.15)',
    color: '#ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  likeBtn: {
    width: '72px', height: '72px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
    border: 'none', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,107,0.4)',
    transition: 'all 0.2s',
  },
  hint: { color: '#606070', fontSize: '13px', textAlign: 'center' },
  done: {
    textAlign: 'center', padding: '60px 24px',
    background: '#16161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%',
  },
  doneIcon: { fontSize: '56px' },
  doneTitle: { fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '800' },
  doneDesc: { color: '#606070', fontSize: '15px', lineHeight: 1.6 },
  matchOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  matchModal: {
    background: '#16161f', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '24px',
    padding: '48px 40px', textAlign: 'center', maxWidth: '360px', width: '90%',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
  },
  matchEmoji: { fontSize: '56px' },
  matchTitle: { fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: '800', color: '#ff6b6b' },
  matchAvatar: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '32px', color: 'white',
  },
  matchDesc: { color: '#a0a0b0', fontSize: '16px' },
  matchBtns: { display: 'flex', gap: '12px', marginTop: '8px' },
};
