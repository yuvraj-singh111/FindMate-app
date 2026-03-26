import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.isProfileComplete ? '/dashboard' : '/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.bigText}>Find your<br /><span style={styles.accent}>perfect</span><br />flatmate.</div>
          <p style={styles.subtitle}>AI-powered compatibility matching for people who want more than just a roommate.</p>
          <div style={styles.stats}>
            <div style={styles.stat}><span style={styles.statNum}>94%</span><span style={styles.statLabel}>match accuracy</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><span style={styles.statNum}>2k+</span><span style={styles.statLabel}>happy flatmates</span></div>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.formCard} className="fade-up">
          <div style={styles.formHeader}>
            <div style={styles.logo}>FM</div>
            <h1 style={styles.title}>Welcome back</h1>
            <p style={styles.desc}>Sign in to your account</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a0a 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px',
    position: 'relative', overflow: 'hidden',
  },
  leftContent: { position: 'relative', zIndex: 1 },
  bigText: {
    fontFamily: 'Syne, sans-serif', fontSize: '64px', fontWeight: '800',
    lineHeight: 1.1, color: '#f0f0f0', marginBottom: '24px',
  },
  accent: { color: '#ff6b6b' },
  subtitle: { color: '#a0a0b0', fontSize: '18px', lineHeight: 1.6, maxWidth: '380px', marginBottom: '40px' },
  stats: { display: 'flex', alignItems: 'center', gap: '24px' },
  stat: { display: 'flex', flexDirection: 'column', gap: '4px' },
  statNum: { fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: '800', color: '#ff6b6b' },
  statLabel: { fontSize: '13px', color: '#606070' },
  statDivider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' },

  right: {
    width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px', background: '#0a0a0f',
  },
  formCard: { width: '100%', maxWidth: '380px' },
  formHeader: { textAlign: 'center', marginBottom: '32px' },
  logo: {
    width: '48px', height: '48px', background: '#ff6b6b', borderRadius: '12px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '18px', color: 'white',
    marginBottom: '16px',
  },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#f0f0f0' },
  desc: { color: '#606070', fontSize: '15px' },
  errorBox: {
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
    borderRadius: '10px', padding: '12px 16px', color: '#ff6b6b', fontSize: '14px',
    marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  switchText: { textAlign: 'center', color: '#606070', fontSize: '14px', marginTop: '24px' },
  link: { color: '#ff6b6b', fontWeight: '500' },
};
