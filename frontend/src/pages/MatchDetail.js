import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MatchDetail() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/matches/${matchId}`)
      .then((r) => setMatch(r.data.match))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [matchId]);

  if (loading) return <div style={styles.center}><div className="spinner" /></div>;
  if (!match) return <div style={styles.center}><p>Match not found</p></div>;

  const other = match.users.find((u) => u._id !== user?._id) || match.users[0];
  const score = match.compatibilityScore;
  const scoreColor = score >= 75 ? '#6bcb77' : score >= 50 ? '#ffd93d' : '#ff6b6b';

  const infoItems = [
    { icon: '📍', label: 'Location', value: other?.profile?.location },
    { icon: '💰', label: 'Budget', value: other?.profile?.budget ? `₹${other.profile.budget.min?.toLocaleString()} – ₹${other.profile.budget.max?.toLocaleString()}/mo` : null },
    { icon: '🌙', label: 'Sleep', value: other?.profile?.sleepSchedule?.replace('_', ' ') },
    { icon: '💼', label: 'Works', value: other?.profile?.workSchedule?.replace(/_/g, ' ') },
    { icon: '🍽', label: 'Food', value: other?.profile?.foodHabits?.replace('_', ' ') },
    { icon: '🏠', label: 'Guests', value: other?.profile?.guestsPreference },
    { icon: '🚬', label: 'Smoking', value: other?.profile?.smoking ? 'Yes' : 'No' },
    { icon: '🐾', label: 'Pets', value: other?.profile?.pets ? 'Has pets' : 'No pets' },
  ].filter((i) => i.value);

  return (
    <div style={styles.page}>
      <div style={styles.container} className="fade-up">

        {/* Back */}
        <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => navigate('/dashboard')}>
          ← Back to dashboard
        </button>

        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroAvatar}>{other?.name?.[0]?.toUpperCase()}</div>
          <div style={styles.heroInfo}>
            <h1 style={styles.heroName}>{other?.name}</h1>
            {other?.profile?.location && <div style={styles.heroLocation}>📍 {other.profile.location}</div>}
          </div>
          <div style={styles.heroScore}>
            <div style={{ ...styles.scoreBig, color: scoreColor }}>{score}%</div>
            <div style={styles.scoreLabel}>Compatible</div>
          </div>
        </div>

        <div style={styles.grid}>
          {/* AI Insights */}
          <div style={styles.insights}>
            <h2 style={styles.sectionTitle}>AI Analysis</h2>
            <p style={styles.summary}>{match.aiInsights?.summary}</p>

            {match.aiInsights?.similarities?.length > 0 && (
              <div style={styles.insightGroup}>
                <div style={styles.insightHeading}>
                  <span style={styles.greenDot} />
                  Similarities
                </div>
                {match.aiInsights.similarities.map((s, i) => (
                  <div key={i} style={styles.insightItem}>
                    <span style={styles.checkIcon}>✓</span>
                    {s}
                  </div>
                ))}
              </div>
            )}

            {match.aiInsights?.conflicts?.length > 0 && (
              <div style={styles.insightGroup}>
                <div style={styles.insightHeading}>
                  <span style={styles.redDot} />
                  Potential conflicts
                </div>
                {match.aiInsights.conflicts.map((c, i) => (
                  <div key={i} style={styles.insightItem}>
                    <span style={styles.warnIcon}>⚠</span>
                    {c}
                  </div>
                ))}
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}
              onClick={() => navigate(`/chat/${matchId}`)}>
              💬 Start chatting
            </button>
          </div>

          {/* Profile details */}
          <div style={styles.details}>
            <h2 style={styles.sectionTitle}>Profile</h2>

            {other?.profile?.aboutMe && (
              <div style={styles.aboutBox}>
                <div style={styles.aboutLabel}>About</div>
                <p style={styles.aboutText}>{other.profile.aboutMe}</p>
              </div>
            )}

            <div style={styles.infoGrid}>
              {infoItems.map((item) => (
                <div key={item.label} style={styles.infoItem}>
                  <span style={styles.infoIcon}>{item.icon}</span>
                  <div>
                    <div style={styles.infoLabel}>{item.label}</div>
                    <div style={styles.infoValue}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.cleanlinessRow}>
              <span style={styles.cleanLabel}>Cleanliness</span>
              <div style={styles.dots}>
                {[1, 2, 3, 4, 5].map((d) => (
                  <div key={d} style={{ ...styles.dot, ...(d <= (other?.profile?.cleanliness || 3) ? styles.dotFill : {}) }} />
                ))}
              </div>
              <span style={styles.cleanNum}>{other?.profile?.cleanliness || 3}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', paddingTop: '88px', paddingBottom: '48px' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '28px' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  hero: {
    background: '#16161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
    padding: '32px', display: 'flex', alignItems: 'center', gap: '24px',
  },
  heroAvatar: {
    width: '80px', height: '80px', borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '32px', color: 'white',
  },
  heroInfo: { flex: 1 },
  heroName: { fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
  heroLocation: { color: '#606070', fontSize: '15px' },
  heroScore: { textAlign: 'center', flexShrink: 0 },
  scoreBig: { fontFamily: 'Syne, sans-serif', fontSize: '48px', fontWeight: '800', lineHeight: 1 },
  scoreLabel: { color: '#606070', fontSize: '13px', marginTop: '4px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'flex-start' },
  insights: {
    background: '#16161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
    padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px',
  },
  details: {
    background: '#16161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
    padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px',
  },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontSize: '20px', fontWeight: '700' },
  summary: { color: '#a0a0b0', fontSize: '15px', lineHeight: 1.7 },
  insightGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
  insightHeading: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#606070', textTransform: 'uppercase', letterSpacing: '0.06em' },
  greenDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#6bcb77', display: 'inline-block' },
  redDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b6b', display: 'inline-block' },
  insightItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#a0a0b0', lineHeight: 1.5 },
  checkIcon: { color: '#6bcb77', fontWeight: '700', flexShrink: 0, marginTop: '1px' },
  warnIcon: { color: '#ffd93d', fontWeight: '700', flexShrink: 0, marginTop: '1px' },
  aboutBox: { background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px' },
  aboutLabel: { fontSize: '11px', fontWeight: '600', color: '#606070', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
  aboutText: { color: '#a0a0b0', fontSize: '14px', lineHeight: 1.7 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  infoItem: { display: 'flex', alignItems: 'flex-start', gap: '10px' },
  infoIcon: { fontSize: '16px', marginTop: '2px' },
  infoLabel: { fontSize: '11px', color: '#606070', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' },
  infoValue: { fontSize: '14px', color: '#f0f0f0', fontWeight: '500', textTransform: 'capitalize' },
  cleanlinessRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  cleanLabel: { fontSize: '13px', color: '#606070' },
  dots: { display: 'flex', gap: '4px' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' },
  dotFill: { background: '#ff6b6b' },
  cleanNum: { fontSize: '13px', color: '#ff6b6b', fontWeight: '600' },
};
