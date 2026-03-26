import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CompatibilityRing = ({ score }) => {
  const color = score >= 75 ? '#6bcb77' : score >= 50 ? '#ffd93d' : '#ff6b6b';
  return (
    <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${(score / 100) * 163} 163`}
          strokeLinecap="round" transform="rotate(-90 32 32)" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '13px', fontWeight: '700', fontFamily: 'Syne, sans-serif', color }}>
        {score}%
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/matches')
      .then((r) => setMatches(r.data.matches))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getOtherUser = (match) =>
    match.users.find((u) => u._id !== user?._id) || match.users[0];

  const topMatches = [...matches].sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 3);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Welcome banner */}
        <div style={styles.banner} className="fade-up">
          <div>
            <div style={styles.greeting}>Hey, {user?.name?.split(' ')[0]} 👋</div>
            <div style={styles.bannerSub}>
              {matches.length > 0
                ? `You have ${matches.length} match${matches.length > 1 ? 'es' : ''} waiting`
                : 'Start swiping to find your flatmate'}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/swipe')} style={styles.discoverBtn}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Discover people
          </button>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { label: 'Total matches', value: matches.length, color: '#ff6b6b' },
            { label: 'Top score', value: topMatches[0] ? `${topMatches[0].compatibilityScore}%` : '—', color: '#6bcb77' },
            { label: 'Profile', value: user?.isProfileComplete ? 'Complete' : 'Incomplete', color: user?.isProfileComplete ? '#6bcb77' : '#ffd93d' },
          ].map((s) => (
            <div key={s.label} className="card" style={styles.statCard}>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Matches list */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Your matches</h2>
            {matches.length > 0 && (
              <span className="badge badge-red">{matches.length} total</span>
            )}
          </div>

          {loading ? (
            <div style={styles.center}><div className="spinner" /></div>
          ) : matches.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>💫</div>
              <div style={styles.emptyTitle}>No matches yet</div>
              <p style={styles.emptyDesc}>Start discovering people — when someone likes you back, they'll appear here.</p>
              <button className="btn btn-primary" onClick={() => navigate('/swipe')}>Start swiping</button>
            </div>
          ) : (
            <div style={styles.matchList}>
              {matches.map((match) => {
                const other = getOtherUser(match);
                return (
                  <div key={match._id} className="card" style={styles.matchCard}>
                    <div style={styles.matchLeft}>
                      <div style={styles.matchAvatar}>{other?.name?.[0]?.toUpperCase()}</div>
                      <div>
                        <div style={styles.matchName}>{other?.name}</div>
                        <div style={styles.matchLocation}>📍 {other?.profile?.location || 'Location not set'}</div>
                        <div style={styles.matchTags}>
                          {other?.profile?.sleepSchedule && (
                            <span className="badge badge-blue">{other.profile.sleepSchedule.replace('_', ' ')}</span>
                          )}
                          {other?.profile?.workSchedule && (
                            <span className="badge badge-yellow">{other.profile.workSchedule.replace(/_/g, ' ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={styles.matchRight}>
                      <CompatibilityRing score={match.compatibilityScore} />
                      <div style={styles.matchActions}>
                        <button className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 14px' }}
                          onClick={() => navigate(`/matches/${match._id}`)}>
                          View details
                        </button>
                        <button className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 14px' }}
                          onClick={() => navigate(`/chat/${match._id}`)}>
                          💬 Chat
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile incomplete nudge */}
        {!user?.isProfileComplete && (
          <div style={styles.nudge}>
            <span>⚡ Complete your profile to start matching</span>
            <button className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}
              onClick={() => navigate('/profile-setup')}>
              Complete profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', paddingTop: '88px', paddingBottom: '48px' },
  container: { maxWidth: '860px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '28px' },
  banner: {
    background: 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(255,217,61,0.06))',
    border: '1px solid rgba(255,107,107,0.2)', borderRadius: '20px',
    padding: '32px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  greeting: { fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: '800', marginBottom: '8px' },
  bannerSub: { color: '#a0a0b0', fontSize: '16px' },
  discoverBtn: { padding: '14px 24px', fontSize: '15px', flexShrink: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  statCard: { textAlign: 'center', padding: '20px' },
  statValue: { fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '800', marginBottom: '6px' },
  statLabel: { color: '#606070', fontSize: '13px' },
  section: { display: 'flex', flexDirection: 'column', gap: '16px' },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: '12px' },
  sectionTitle: { fontSize: '20px', fontWeight: '700' },
  center: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
  empty: {
    textAlign: 'center', padding: '60px 24px',
    background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
  },
  emptyIcon: { fontSize: '48px' },
  emptyTitle: { fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '700' },
  emptyDesc: { color: '#606070', fontSize: '15px', maxWidth: '340px', lineHeight: 1.6 },
  matchList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  matchCard: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' },
  matchLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  matchAvatar: {
    width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '20px', color: 'white',
  },
  matchName: { fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', marginBottom: '4px' },
  matchLocation: { color: '#606070', fontSize: '13px', marginBottom: '8px' },
  matchTags: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  matchRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  matchActions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  nudge: {
    background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.2)',
    borderRadius: '12px', padding: '16px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    color: '#ffd93d', fontSize: '15px', fontWeight: '500',
  },
};
