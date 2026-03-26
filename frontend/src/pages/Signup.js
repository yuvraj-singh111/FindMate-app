import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.bigText}>Your next<br /><span style={styles.accent}>chapter</span><br />starts here.</div>
          <p style={styles.subtitle}>Answer a few questions about your lifestyle and let our AI find people truly compatible with you.</p>
          <div style={styles.steps}>
            {['Create account', 'Build your profile', 'Meet your matches'].map((s, i) => (
              <div key={i} style={styles.step}>
                <div style={styles.stepNum}>{i + 1}</div>
                <span style={styles.stepLabel}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div className="fade-up" style={styles.formCard}>
          <div style={styles.formHeader}>
            <div style={styles.logo}>FM</div>
            <h1 style={styles.title}>Create account</h1>
            <p style={styles.desc}>Start finding your flatmate today</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label>Full name</label>
              <input className="form-input" name="name" placeholder="Arjun Sharma"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-input" type="password" name="password" placeholder="Min 6 characters"
                value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: {
    flex: 1, background: 'linear-gradient(135deg, #0a0f1a 0%, #0a1a0f 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px',
  },
  leftContent: {},
  bigText: {
    fontFamily: 'Syne, sans-serif', fontSize: '60px', fontWeight: '800',
    lineHeight: 1.1, color: '#f0f0f0', marginBottom: '24px',
  },
  accent: { color: '#6bcb77' },
  subtitle: { color: '#a0a0b0', fontSize: '17px', lineHeight: 1.7, maxWidth: '360px', marginBottom: '40px' },
  steps: { display: 'flex', flexDirection: 'column', gap: '16px' },
  step: { display: 'flex', alignItems: 'center', gap: '14px' },
  stepNum: {
    width: '28px', height: '28px', background: 'rgba(107,203,119,0.15)',
    border: '1px solid rgba(107,203,119,0.4)', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', color: '#6bcb77', flexShrink: 0,
  },
  stepLabel: { color: '#a0a0b0', fontSize: '15px' },
  right: {
    width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px', background: '#0a0a0f',
  },
  formCard: { width: '100%', maxWidth: '380px' },
  formHeader: { textAlign: 'center', marginBottom: '32px' },
  logo: {
    width: '48px', height: '48px', background: '#6bcb77', borderRadius: '12px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '18px', color: 'white',
    marginBottom: '16px',
  },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
  desc: { color: '#606070', fontSize: '15px' },
  errorBox: {
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)',
    borderRadius: '10px', padding: '12px 16px', color: '#ff6b6b', fontSize: '14px', marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  switchText: { textAlign: 'center', color: '#606070', fontSize: '14px', marginTop: '24px' },
  link: { color: '#6bcb77', fontWeight: '500' },
};
