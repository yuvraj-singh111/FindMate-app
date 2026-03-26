import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STEPS = ['Location & Budget', 'Lifestyle', 'Habits', 'About You'];

export default function ProfileSetup() {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    location: '', budget: { min: 5000, max: 20000 },
    sleepSchedule: 'flexible', cleanliness: 3, workSchedule: 'office',
    foodHabits: 'no_preference', guestsPreference: 'occasionally',
    smoking: false, pets: false, aboutMe: '',
  });

  const set = (key, val) => setProfile((p) => ({ ...p, [key]: val }));
  const setBudget = (key, val) => setProfile((p) => ({ ...p, budget: { ...p.budget, [key]: Number(val) } }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await axios.put('/api/users/profile', { profile });
      updateUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.container} className="fade-up">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>FM</div>
          <h1 style={styles.title}>Set up your profile</h1>
          <p style={styles.subtitle}>Help us find your perfect flatmate</p>
        </div>

        {/* Progress */}
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <div style={styles.steps}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ ...styles.stepItem, ...(i === step ? styles.stepActive : i < step ? styles.stepDone : {}) }}>
                <div style={{ ...styles.stepDot, ...(i <= step ? styles.stepDotActive : {}) }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={styles.stepName}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={styles.card} className="card">
          {step === 0 && (
            <div style={styles.fields}>
              <h2 style={styles.stepTitle}>Where are you looking?</h2>
              <div className="form-group">
                <label>City / Area</label>
                <input className="form-input" placeholder="e.g. Koramangala, Bangalore"
                  value={profile.location} onChange={(e) => set('location', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Monthly budget range (₹)</label>
                <div style={styles.budgetRow}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Min</label>
                    <input className="form-input" type="number" min="0" step="500"
                      value={profile.budget.min} onChange={(e) => setBudget('min', e.target.value)} />
                  </div>
                  <div style={styles.budgetDash}>—</div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Max</label>
                    <input className="form-input" type="number" min="0" step="500"
                      value={profile.budget.max} onChange={(e) => setBudget('max', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={styles.fields}>
              <h2 style={styles.stepTitle}>Your daily rhythm</h2>
              <div className="form-group">
                <label>Sleep schedule</label>
                <div style={styles.optionGrid}>
                  {[['early_bird', '🌅 Early bird', 'Up by 6am'], ['flexible', '🌤 Flexible', 'Goes with the flow'], ['night_owl', '🌙 Night owl', 'Up past midnight']].map(([val, label, sub]) => (
                    <div key={val} style={{ ...styles.option, ...(profile.sleepSchedule === val ? styles.optionActive : {}) }}
                      onClick={() => set('sleepSchedule', val)}>
                      <span style={styles.optionLabel}>{label}</span>
                      <span style={styles.optionSub}>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Work schedule</label>
                <select className="form-input" value={profile.workSchedule} onChange={(e) => set('workSchedule', e.target.value)}>
                  <option value="office">Office (9–6)</option>
                  <option value="work_from_home">Work from home</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="student">Student</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={styles.fields}>
              <h2 style={styles.stepTitle}>Your habits & preferences</h2>
              <div className="form-group">
                <label>Cleanliness level (1 = relaxed, 5 = spotless)</label>
                <div style={styles.sliderRow}>
                  <input type="range" min="1" max="5" value={profile.cleanliness}
                    onChange={(e) => set('cleanliness', Number(e.target.value))}
                    style={styles.slider} />
                  <span style={styles.sliderVal}>{profile.cleanliness}/5</span>
                </div>
                <div style={styles.sliderLabels}>
                  <span>Relaxed</span><span>Moderate</span><span>Spotless</span>
                </div>
              </div>
              <div className="form-group">
                <label>Food habits</label>
                <div style={styles.optionGrid}>
                  {[['veg', '🥦 Veg'], ['non-veg', '🍗 Non-veg'], ['vegan', '🌱 Vegan'], ['no_preference', '🍽 No pref']].map(([val, label]) => (
                    <div key={val} style={{ ...styles.optionSmall, ...(profile.foodHabits === val ? styles.optionActive : {}) }}
                      onClick={() => set('foodHabits', val)}>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Guests at home</label>
                <select className="form-input" value={profile.guestsPreference} onChange={(e) => set('guestsPreference', e.target.value)}>
                  <option value="often">Often — I love hosting</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="rarely">Rarely</option>
                  <option value="never">Never — quiet home only</option>
                </select>
              </div>
              <div style={styles.toggleRow}>
                {[['smoking', '🚬 Smoker'], ['pets', '🐾 Has pets']].map(([key, label]) => (
                  <div key={key} style={styles.toggleItem} onClick={() => set(key, !profile[key])}>
                    <div style={{ ...styles.toggle, ...(profile[key] ? styles.toggleOn : {}) }}>
                      <div style={{ ...styles.toggleThumb, ...(profile[key] ? styles.toggleThumbOn : {}) }} />
                    </div>
                    <span style={styles.toggleLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={styles.fields}>
              <h2 style={styles.stepTitle}>Tell us about yourself</h2>
              <p style={styles.hint}>This is what the AI uses to understand your personality and find truly compatible flatmates.</p>
              <div className="form-group">
                <label>About me</label>
                <textarea className="form-input" rows={6} maxLength={500}
                  placeholder="e.g. I'm a software engineer who loves cooking on weekends. I'm fairly tidy but not obsessive about it. I work from home 3 days a week and enjoy having friends over on Fridays. I'm looking for someone chill and respectful of shared spaces..."
                  value={profile.aboutMe} onChange={(e) => set('aboutMe', e.target.value)}
                  style={{ resize: 'vertical', lineHeight: '1.6' }} />
                <div style={styles.charCount}>{profile.aboutMe.length}/500</div>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={styles.actions}>
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>Continue →</button>
          ) : (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}
              style={{ minWidth: '160px' }}>
              {saving ? 'Saving...' : '🎉 Find my matches'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', paddingTop: '80px' },
  container: { width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '24px' },
  header: { textAlign: 'center' },
  logo: {
    width: '48px', height: '48px', background: '#ff6b6b', borderRadius: '12px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '18px', color: 'white', marginBottom: '16px',
  },
  title: { fontSize: '32px', fontWeight: '800', marginBottom: '8px' },
  subtitle: { color: '#606070', fontSize: '16px' },
  progress: { display: 'flex', flexDirection: 'column', gap: '16px' },
  progressBar: { height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#ff6b6b', borderRadius: '2px', transition: 'width 0.4s ease' },
  steps: { display: 'flex', justifyContent: 'space-between' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.4 },
  stepActive: { opacity: 1 },
  stepDone: { opacity: 0.7 },
  stepDot: {
    width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#606070',
  },
  stepDotActive: { background: '#ff6b6b', border: '1px solid #ff6b6b', color: 'white' },
  stepName: { fontSize: '13px', color: '#a0a0b0' },
  card: { padding: '32px' },
  fields: { display: 'flex', flexDirection: 'column', gap: '24px' },
  stepTitle: { fontSize: '22px', fontWeight: '700', marginBottom: '4px' },
  hint: { color: '#a0a0b0', fontSize: '14px', lineHeight: 1.6, marginTop: '-12px' },
  budgetRow: { display: 'flex', gap: '16px', alignItems: 'flex-end' },
  budgetDash: { color: '#606070', paddingBottom: '14px', fontSize: '20px' },
  optionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' },
  option: {
    padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px',
    background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s',
  },
  optionSmall: {
    padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer', textAlign: 'center', fontSize: '14px', fontWeight: '500',
    background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s', color: '#a0a0b0',
  },
  optionActive: { border: '1px solid #ff6b6b', background: 'rgba(255,107,107,0.08)', color: '#ff6b6b' },
  optionLabel: { fontSize: '14px', fontWeight: '600' },
  optionSub: { fontSize: '12px', color: '#606070' },
  sliderRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  slider: { flex: 1, accentColor: '#ff6b6b' },
  sliderVal: { fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '18px', color: '#ff6b6b', minWidth: '32px' },
  sliderLabels: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#606070', marginTop: '-8px' },
  toggleRow: { display: 'flex', gap: '24px' },
  toggleItem: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  toggle: { width: '40px', height: '22px', background: 'rgba(255,255,255,0.1)', borderRadius: '11px', position: 'relative', transition: 'background 0.2s' },
  toggleOn: { background: '#ff6b6b' },
  toggleThumb: { position: 'absolute', top: '3px', left: '3px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' },
  toggleThumbOn: { left: '21px' },
  toggleLabel: { fontSize: '14px', color: '#a0a0b0' },
  charCount: { textAlign: 'right', fontSize: '12px', color: '#606070' },
  actions: { display: 'flex', alignItems: 'center', gap: '12px' },
};
