import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const icons = {
  dashboard: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  swipe: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  profile: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: icons.dashboard },
    { path: '/swipe', label: 'Discover', icon: icons.swipe },
    { path: '/profile-setup', label: 'Profile', icon: icons.profile },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate('/dashboard')}>
        <span style={styles.logo}>FM</span>
        <span style={styles.brandName}>FindMate</span>
      </div>

      <div style={styles.navItems}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
            >
              {item.icon}
              <span style={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div style={styles.userArea}>
        <div style={styles.avatar}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: '64px',
    background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
  },
  logo: {
    width: '32px', height: '32px', background: '#ff6b6b', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontWeight: '800', fontSize: '14px', color: 'white',
  },
  brandName: {
    fontFamily: 'Syne, sans-serif', fontWeight: '700', fontSize: '18px', color: '#f0f0f0',
  },
  navItems: {
    display: 'flex', alignItems: 'center', gap: '4px',
  },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '8px 16px', borderRadius: '10px',
    color: '#a0a0b0', fontSize: '14px', fontWeight: '500',
    transition: 'all 0.2s', textDecoration: 'none',
  },
  navItemActive: {
    background: 'rgba(255,107,107,0.12)', color: '#ff6b6b',
  },
  navLabel: { fontSize: '14px' },
  userArea: {
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  avatar: {
    width: '36px', height: '36px',
    background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px', color: 'white',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', color: '#a0a0b0', fontSize: '13px', padding: '6px 12px',
    cursor: 'pointer', transition: 'all 0.2s',
  },
};
