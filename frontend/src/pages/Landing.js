import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <div style={s.logoBox}>FM</div>
          <span style={s.logoName}>FlatMate</span>
        </div>
        <div style={s.navLinks}>
          <a href="#features" style={s.navLink}>Features</a>
          <a href="#how" style={s.navLink}>How it works</a>
          <a href="#stories" style={s.navLink}>Stories</a>
        </div>
        <div style={s.navActions}>
          <button style={s.navLogin} onClick={() => navigate('/login')}>Sign in</button>
          <button style={s.navCta} onClick={() => navigate('/signup')}>Get started free</button>
        </div>
      </nav>

      <section style={s.hero}>
        <div style={s.heroBg1} />
        <div style={s.heroBg2} />
        <div style={s.heroLeft}>
          <div style={s.eyebrow}>
            <div style={s.eyebrowDot} />
            AI-powered flatmate matching
          </div>
          <h1 style={s.heroTitle}>
            Find your<br />
            <span style={{ color: '#ff6b6b' }}>perfect</span><br />
            flatmate.
          </h1>
          <p style={s.heroSub}>
            Stop rolling the dice on roommates. Our AI reads between the lines — matching you on personality, habits, and lifestyle, not just price.
          </p>
          <div style={s.heroActions}>
            <button style={s.btnPrimary} onClick={() => navigate('/signup')}>Start matching — it's free</button>
            <button style={s.btnSecondary} onClick={() => navigate('/login')}>Sign in</button>
          </div>
          <div style={s.socialProof}>
            <div style={s.avatars}>
              {['linear-gradient(135deg,#ff6b6b,#ffd93d)','linear-gradient(135deg,#6bcb77,#4d96ff)','linear-gradient(135deg,#4d96ff,#a855f7)','linear-gradient(135deg,#ffd93d,#ff6b6b)'].map((bg, i) => (
                <div key={i} style={{ ...s.av, background: bg, marginLeft: i === 0 ? 0 : -10 }}>{['A','R','P','S'][i]}</div>
              ))}
            </div>
            <div style={s.proofText}>
              <strong style={{ color: '#f0f0f0' }}>2,400+ people</strong> found their flatmate<br />this month in India
            </div>
          </div>
        </div>

        <div style={s.heroRight}>
          <div style={{ ...s.floatCard, top: 20, right: -10 }}>
            <div style={s.floatLabel}>New match!</div>
            <div style={{ ...s.floatVal, color: '#6bcb77' }}>🎉 It's a match</div>
          </div>
          <div style={{ ...s.floatCard, bottom: 100, left: -20 }}>
            <div style={s.floatLabel}>Top score today</div>
            <div style={{ ...s.floatVal, color: '#ff6b6b' }}>96% match</div>
          </div>
          <div style={s.phone}>
            <div style={s.phoneNotch}><div style={s.notchDot} /></div>
            <div style={s.swipeCard}>
              <div style={s.cardPhoto}>👩‍💼</div>
              <div style={s.cardName}>Priya Sharma</div>
              <div style={s.cardLoc}>📍 Koramangala, Bangalore</div>
              <div style={s.cardTags}>
                <span style={{ ...s.tag, ...s.tagBlue }}>Night owl</span>
                <span style={{ ...s.tag, ...s.tagGreen }}>Vegetarian</span>
                <span style={{ ...s.tag, ...s.tagYellow }}>WFH</span>
              </div>
              <div style={s.compatRow}>
                <div style={s.compatLabel}>AI Compatibility</div>
                <div style={s.compatScore}>92%</div>
              </div>
              <div style={s.swipeBtns}>
                <button style={s.swipeNo}>✕</button>
                <button style={s.swipeYes}>♥</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" style={s.section}>
        <div style={s.sectionLabel}>How it works</div>
        <h2 style={s.sectionTitle}>3 steps to your ideal flatmate</h2>
        <div style={s.stepsGrid}>
          {[
            { num: '01', icon: '📝', title: 'Build your profile', desc: 'Fill in your budget, location, sleep schedule, and write a short "About Me". The AI uses this to understand your personality.' },
            { num: '02', icon: '💫', title: 'Swipe & discover', desc: "Browse compatible profiles with AI-generated match scores. Like the ones that feel right, skip the ones that don't." },
            { num: '03', icon: '💬', title: 'Match & chat', desc: "When both of you like each other it's a match! Chat opens instantly with full AI insights showing why you're compatible." },
          ].map((step, i) => (
            <div key={i} style={s.stepCard}>
              <div style={s.stepNum}>{step.num}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" style={{ ...s.section, background: 'linear-gradient(180deg,#0a0a0f 0%,#0d0d18 100%)' }}>
        <div style={s.sectionLabel}>Why FlatMate</div>
        <h2 style={s.sectionTitle}>More than just a listing</h2>
        <p style={s.sectionSub}>We go beyond budget and location to find someone you'll actually enjoy living with.</p>
        <div style={s.featGrid}>
          {[
            { icon: '🧠', color: 'rgba(255,107,107,0.12)', title: 'AI personality match', desc: 'Our AI reads your "About Me" and understands your vibe — then finds people who truly click with you.' },
            { icon: '💬', color: 'rgba(107,203,119,0.12)', title: 'Chat only on match', desc: 'No spam. Chat is unlocked only when both of you like each other — keeping it safe and intentional.' },
            { icon: '⚡', color: 'rgba(77,150,255,0.12)', title: 'Instant insights', desc: "See exactly why you're compatible — shared habits, potential friction points, and a full AI summary." },
            { icon: '🔒', color: 'rgba(255,217,61,0.12)', title: 'Safe & verified', desc: 'Profiles are reviewed and chat is only available after mutual matching — your safety comes first.' },
            { icon: '📍', color: 'rgba(168,85,247,0.12)', title: 'Hyper-local', desc: 'Search by neighbourhood, not just city. Find flatmates in Koramangala, not just "Bangalore".' },
            { icon: '💰', color: 'rgba(29,158,117,0.12)', title: 'Budget matching', desc: 'Filter by exact budget range so you only see people you can actually afford to live with.' },
          ].map((f, i) => (
            <div key={i} style={s.featCard}>
              <div style={{ ...s.featIcon, background: f.color }}>{f.icon}</div>
              <div style={s.featTitle}>{f.title}</div>
              <div style={s.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="stories" style={s.section}>
        <div style={s.sectionLabel}>Real stories</div>
        <h2 style={s.sectionTitle}>They found their person</h2>
        <div style={s.testGrid}>
          {[
            { q: '"Matched with Rahul in 3 days. The AI was spot on — we\'re both night owls who hate dishes in the sink."', name: 'Anjali M.', city: 'Bangalore', bg: 'linear-gradient(135deg,#ff6b6b,#ffd93d)', init: 'A' },
            { q: '"Tried 3 other apps, all random matches. FlatMate\'s 89% compatibility score was real — we just got it."', name: 'Rohan K.', city: 'Pune', bg: 'linear-gradient(135deg,#4d96ff,#6bcb77)', init: 'R' },
            { q: '"The conflict warnings saved me. It flagged that my match smoked — I would\'ve missed that otherwise."', name: 'Preethi S.', city: 'Chennai', bg: 'linear-gradient(135deg,#a855f7,#ff6b6b)', init: 'P' },
          ].map((t, i) => (
            <div key={i} style={s.testCard}>
              <div style={s.stars}>★★★★★</div>
              <p style={s.testQuote}>{t.q}</p>
              <div style={s.testPerson}>
                <div style={{ ...s.testAv, background: t.bg }}>{t.init}</div>
                <div>
                  <div style={s.testName}>{t.name}</div>
                  <div style={s.testCity}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={s.stats}>
        {[
          { num: '2,400+', label: 'Flatmates found' },
          { num: '94%', label: 'Match accuracy' },
          { num: '12', label: 'Cities in India' },
          { num: '4.9★', label: 'Average rating' },
        ].map((st, i) => (
          <div key={i} style={s.statItem}>
            <div style={s.statNum}>{st.num}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </section>

      <section style={s.cta}>
        <div style={s.ctaBg} />
        <h2 style={s.ctaTitle}>Ready to find<br />your flatmate?</h2>
        <p style={s.ctaSub}>Free to use. No credit card. Takes 3 minutes.</p>
        <button style={s.ctaBtn} onClick={() => navigate('/signup')}>Create your profile →</button>
      </section>

      <footer style={s.footer}>
        <div style={s.navLogo}>
          <div style={s.logoBox}>FM</div>
          <span style={s.logoName}>FlatMate</span>
        </div>
        <div style={{ color: '#505060', fontSize: '13px' }}>© 2025 FlatMate. Built with AI for India's renters.</div>
      </footer>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        a:hover { color: #f0f0f0 !important; }
      `}</style>
    </div>
  );
}

const s = {
  page: { background: '#08080f', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,8,15,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  logoBox: { width: '36px', height: '36px', background: '#ff6b6b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '14px', color: 'white' },
  logoName: { fontFamily: "'Syne',sans-serif", fontWeight: '700', fontSize: '18px' },
  navLinks: { display: 'flex', gap: '32px' },
  navLink: { color: '#a0a0b0', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' },
  navActions: { display: 'flex', gap: '10px', alignItems: 'center' },
  navLogin: { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#a0a0b0', padding: '9px 20px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  navCta: { background: '#ff6b6b', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  hero: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', padding: '80px 60px', minHeight: '90vh', position: 'relative', overflow: 'hidden' },
  heroBg1: { position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(255,107,107,0.08) 0%,transparent 70%)', pointerEvents: 'none' },
  heroBg2: { position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle,rgba(107,203,119,0.06) 0%,transparent 70%)', pointerEvents: 'none' },
  heroLeft: { animation: 'fadeUp 0.7s ease forwards' },
  eyebrow: { display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)', borderRadius: '999px', padding: '6px 14px', fontSize: '12px', fontWeight: '500', color: '#ff6b6b', marginBottom: '24px' },
  eyebrowDot: { width: '6px', height: '6px', background: '#ff6b6b', borderRadius: '50%', animation: 'pulse 1.5s infinite' },
  heroTitle: { fontFamily: "'Syne',sans-serif", fontSize: '62px', fontWeight: '800', lineHeight: '1.05', marginBottom: '20px' },
  heroSub: { color: '#a0a0b0', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px', maxWidth: '460px' },
  heroActions: { display: 'flex', gap: '14px', marginBottom: '48px', flexWrap: 'wrap' },
  btnPrimary: { background: '#ff6b6b', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  btnSecondary: { background: 'transparent', color: '#f0f0f0', border: '1px solid rgba(255,255,255,0.15)', padding: '16px 32px', borderRadius: '12px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  socialProof: { display: 'flex', alignItems: 'center', gap: '16px' },
  avatars: { display: 'flex' },
  av: { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #08080f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'white', flexShrink: 0 },
  proofText: { fontSize: '13px', color: '#a0a0b0', lineHeight: '1.5' },
  heroRight: { position: 'relative', display: 'flex', justifyContent: 'center', animation: 'fadeUp 0.9s ease 0.2s both' },
  floatCard: { position: 'absolute', background: '#13131c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px 16px', zIndex: 10 },
  floatLabel: { fontSize: '11px', color: '#606070', marginBottom: '4px' },
  floatVal: { fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '700' },
  phone: { width: '280px', height: '560px', background: '#13131c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '36px', padding: '16px', position: 'relative', animation: 'float 4s ease-in-out infinite', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' },
  phoneNotch: { width: '100px', height: '24px', background: '#08080f', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  notchDot: { width: '8px', height: '8px', background: '#2a2a3a', borderRadius: '50%' },
  swipeCard: { background: 'linear-gradient(135deg,#1a1a2e,#2a1a2e)', borderRadius: '20px', padding: '20px' },
  cardPhoto: { width: '100%', height: '160px', borderRadius: '14px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '52px', background: 'linear-gradient(135deg,#1a0a0a,#2a1020)' },
  cardName: { fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '700', marginBottom: '4px' },
  cardLoc: { fontSize: '12px', color: '#a0a0b0', marginBottom: '12px' },
  cardTags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' },
  tag: { padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '500' },
  tagBlue: { background: 'rgba(77,150,255,0.15)', color: '#4d96ff', border: '1px solid rgba(77,150,255,0.25)' },
  tagGreen: { background: 'rgba(107,203,119,0.15)', color: '#6bcb77', border: '1px solid rgba(107,203,119,0.25)' },
  tagYellow: { background: 'rgba(255,217,61,0.15)', color: '#ffd93d', border: '1px solid rgba(255,217,61,0.25)' },
  compatRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 14px' },
  compatLabel: { fontSize: '12px', color: '#a0a0b0' },
  compatScore: { fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '800', color: '#6bcb77' },
  swipeBtns: { display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px' },
  swipeNo: { width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', fontSize: '20px', cursor: 'pointer' },
  swipeYes: { width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(107,203,119,0.15)', border: '1px solid rgba(107,203,119,0.3)', fontSize: '20px', cursor: 'pointer' },
  section: { padding: '80px 60px' },
  sectionLabel: { textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#ff6b6b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' },
  sectionTitle: { textAlign: 'center', fontFamily: "'Syne',sans-serif", fontSize: '42px', fontWeight: '800', marginBottom: '16px' },
  sectionSub: { textAlign: 'center', color: '#a0a0b0', fontSize: '17px', maxWidth: '500px', margin: '0 auto 60px' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px', marginTop: '60px' },
  stepCard: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '32px', position: 'relative' },
  stepNum: { fontFamily: "'Syne',sans-serif", fontSize: '48px', fontWeight: '800', color: 'rgba(255,107,107,0.15)', marginBottom: '16px', lineHeight: 1 },
  stepIcon: { fontSize: '32px', marginBottom: '16px' },
  stepTitle: { fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '10px' },
  stepDesc: { color: '#a0a0b0', fontSize: '14px', lineHeight: '1.7' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' },
  featCard: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' },
  featIcon: { width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '18px' },
  featTitle: { fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '700', marginBottom: '10px' },
  featDesc: { color: '#a0a0b0', fontSize: '14px', lineHeight: '1.7' },
  testGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginTop: '60px' },
  testCard: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' },
  stars: { color: '#ffd93d', fontSize: '14px', marginBottom: '14px' },
  testQuote: { color: '#a0a0b0', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' },
  testPerson: { display: 'flex', alignItems: 'center', gap: '10px' },
  testAv: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: 'white', flexShrink: 0 },
  testName: { fontSize: '14px', fontWeight: '600' },
  testCity: { fontSize: '12px', color: '#505060' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  statItem: { padding: '48px 40px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.07)' },
  statNum: { fontFamily: "'Syne',sans-serif", fontSize: '40px', fontWeight: '800', color: '#ff6b6b', marginBottom: '8px' },
  statLabel: { color: '#606070', fontSize: '14px' },
  cta: { padding: '100px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  ctaBg: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse,rgba(255,107,107,0.1) 0%,transparent 70%)', pointerEvents: 'none' },
  ctaTitle: { fontFamily: "'Syne',sans-serif", fontSize: '52px', fontWeight: '800', marginBottom: '16px', position: 'relative' },
  ctaSub: { color: '#a0a0b0', fontSize: '18px', marginBottom: '40px', position: 'relative' },
  ctaBtn: { background: '#ff6b6b', color: 'white', border: 'none', padding: '18px 48px', borderRadius: '14px', fontSize: '18px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", position: 'relative' },
  footer: { padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
};