import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const features = [
    {
      emoji: '🎯',
      title: 'Goals Tracker',
      desc: 'Set meaningful goals, break them into milestones, and track every step of your progress with beautiful visualisations.',
      color: '#6366f1',
    },
    {
      emoji: '🔥',
      title: 'Habit Builder',
      desc: 'Build life-changing habits with daily streaks, heatmaps, and consistency scores that keep you motivated.',
      color: '#ec4899',
    },
    {
      emoji: '✅',
      title: 'Task Manager',
      desc: 'Organise your daily tasks with priorities, deadlines, and smart filters — so nothing falls through the cracks.',
      color: '#10b981',
    },
    {
      emoji: '🌟',
      title: 'Vision Board',
      desc: 'Create digital vision boards that keep your long-term aspirations front and centre, every single day.',
      color: '#f59e0b',
    },
    {
      emoji: '📓',
      title: 'Journal',
      desc: 'Reflect, plan and grow with a private daily journal that helps you track your thoughts and mental clarity.',
      color: '#8b5cf6',
    },
    {
      emoji: '📊',
      title: 'Smart Dashboard',
      desc: 'A powerful dashboard that connects Google, GitHub, Instagram and LinkedIn to show your real-world progress.',
      color: '#0ea5e9',
    },
  ];

  const integrations = [
    { name: 'Google', icon: '🔵', desc: 'Calendar, Gmail & YouTube', color: '#4285F4' },
    { name: 'GitHub', icon: '⚫', desc: 'Repos, followers & commits', color: '#24292e' },
    { name: 'Instagram', icon: '🟣', desc: 'Followers & engagement', color: '#E1306C' },
    { name: 'LinkedIn', icon: '🔷', desc: 'Profile views & connections', color: '#0077b5' },
  ];

  const stats = [
    { value: '10+', label: 'Features Built-In' },
    { value: '4', label: 'Live Integrations' },
    { value: '100%', label: 'Free to Use' },
    { value: '∞', label: 'Goals You Can Set' },
  ];

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 5%',
    height: 64,
    background: scrollY > 40
      ? 'rgba(11, 15, 25, 0.95)'
      : 'transparent',
    backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
    borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.08)' : 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={{ background: '#0b0f19', color: '#f3f4f6', fontFamily: '"Inter", "Outfit", sans-serif', overflowX: 'hidden' }}>

      {/* ─── GLOBAL STYLES ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { scroll-behavior: smooth; }
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up-delay-1 { transition-delay: 0.1s; }
        .fade-up-delay-2 { transition-delay: 0.2s; }
        .fade-up-delay-3 { transition-delay: 0.3s; }
        .fade-up-delay-4 { transition-delay: 0.4s; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 700;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          color: white; text-decoration: none; border: none; cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 8px 30px rgba(99,102,241,0.4);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.5); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;
          background: rgba(255,255,255,0.06); color: white; text-decoration: none;
          border: 1px solid rgba(255,255,255,0.15); cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); transform: translateY(-1px); }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 28px;
          transition: all 0.3s ease;
          position: relative; overflow: hidden;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .integration-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 24px;
          display: flex; align-items: center; gap: 16px;
          transition: all 0.3s ease;
        }
        .integration-card:hover {
          background: rgba(255,255,255,0.06);
          transform: translateX(6px);
          border-color: rgba(255,255,255,0.2);
        }
        .stat-box {
          text-align: center; padding: 32px 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .stat-box:hover { background: rgba(99,102,241,0.08); border-color: rgba(99,102,241,0.3); transform: translateY(-2px); }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hero-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .float-anim { animation: float 6s ease-in-out infinite; }
        @media (max-width: 768px) {
          .hero-btns { flex-direction: column; align-items: stretch !important; }
          .hero-btns a { text-align: center; justify-content: center; }
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .integrations-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none; }
        }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <span style={{
            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22,
            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>VisionBoard</span>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Features', 'Integrations', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#f3f4f6'}
              onMouseOut={e => e.target.style.color = '#9ca3af'}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn-ghost" style={{ padding: '10px 20px', fontSize: 14 }}>Log In</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '100px 5% 60px', textAlign: 'center', overflow: 'hidden' }}>

        {/* Background glows */}
        <div className="hero-glow" style={{ position: 'absolute', top: '20%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div className="hero-glow" style={{ position: 'absolute', top: '30%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', animationDelay: '2s' }} />

        <div style={{ maxWidth: 860, position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '6px 18px', marginBottom: 28, fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', display: 'inline-block', boxShadow: '0 0 8px #6366f1' }} />
            Your All-in-One Productivity Platform
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24 }}>
            Turn Your Dreams Into{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Daily Reality
            </span>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#9ca3af', lineHeight: 1.7, maxWidth: 640, margin: '0 auto 40px', fontWeight: 400 }}>
            VisionBoard combines goal tracking, habit building, task management, and smart integrations into one beautiful app — so you can focus on what truly matters.
          </p>

          {/* CTA Buttons */}
          <div className="hero-btns" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: 17, padding: '16px 40px' }}>
              🚀 Start For Free
            </Link>
            <Link to="/login" className="btn-ghost" style={{ fontSize: 17, padding: '16px 40px' }}>
              Sign In →
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['🧑', '👩', '🧔', '👱', '🧑‍💻'].map((e, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${i * 60},60%,50%)`, border: '2px solid #0b0f19', marginLeft: i > 0 ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{e}</div>
              ))}
            </div>
            <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>
              Join <span style={{ color: '#f3f4f6', fontWeight: 700 }}>500+</span> users building their best life
            </p>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section style={{ padding: '60px 5%', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-box">
              <div style={{ fontFamily: 'Outfit', fontSize: 42, fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" style={{ padding: '100px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Section header */}
          <div
            id="features-header"
            data-animate
            className={`fade-up ${isVisible('features-header') ? 'visible' : ''}`}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#a5b4fc', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>
              Everything You Need
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              All Your Productivity Tools,<br />
              <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One Beautiful Place</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 18, maxWidth: 540, margin: '0 auto' }}>
              Stop juggling 10 different apps. VisionBoard brings everything together so you can focus on growth.
            </p>
          </div>

          {/* Features grid */}
          <div
            id="features-grid"
            data-animate
            className={`features-grid fade-up ${isVisible('features-grid') ? 'visible' : ''}`}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          >
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 18 }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10, color: '#f3f4f6' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.65 }}>{f.desc}</p>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${f.color}, transparent)`, opacity: 0, transition: 'opacity 0.3s' }} className="card-border" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTEGRATIONS SECTION ─── */}
      <section id="integrations" style={{ padding: '100px 5%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left text */}
          <div
            id="integrations-text"
            data-animate
            className={`fade-up ${isVisible('integrations-text') ? 'visible' : ''}`}
          >
            <div style={{ display: 'inline-block', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#f472b6', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>
              Live Integrations
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 20, lineHeight: 1.2 }}>
              Your Digital Life,{' '}
              <span style={{ background: 'linear-gradient(135deg, #ec4899, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                All Connected
              </span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>
              Connect Google Workspace, GitHub, Instagram, and LinkedIn to see your real-world metrics directly on your personal dashboard. Live data, zero manual updates.
            </p>
            <Link to="/register" className="btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
              Connect Your Accounts →
            </Link>
          </div>

          {/* Right cards */}
          <div
            id="integrations-cards"
            data-animate
            className={`integrations-grid fade-up fade-up-delay-2 ${isVisible('integrations-cards') ? 'visible' : ''}`}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
          >
            {integrations.map((int, i) => (
              <div key={i} className="integration-card" style={{ flexDirection: 'column', alignItems: 'flex-start', borderLeft: `3px solid ${int.color}` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{int.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: int.color }}>{int.name}</div>
                <div style={{ color: '#6b7280', fontSize: 13 }}>{int.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div
            id="how-header"
            data-animate
            className={`fade-up ${isVisible('how-header') ? 'visible' : ''}`}
          >
            <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 60 }}>
              Get Started in{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>3 Simple Steps</span>
            </h2>
          </div>

          <div
            id="how-steps"
            data-animate
            className={`fade-up ${isVisible('how-steps') ? 'visible' : ''}`}
            style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}
          >
            {[
              { step: '01', title: 'Create your free account', desc: 'Sign up in seconds. No credit card required, ever. Your data stays private and secure.', color: '#6366f1' },
              { step: '02', title: 'Set your goals & habits', desc: 'Define what success looks like for you. Add your visions, goals, daily habits, and tasks.', color: '#ec4899' },
              { step: '03', title: 'Track, grow & celebrate', desc: 'Watch your progress on a beautiful dashboard. Stay consistent. Achieve what matters most.', color: '#10b981' },
            ].map((s) => (
              <div key={s.step} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px 28px', transition: 'all 0.3s ease' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div style={{ fontFamily: 'Outfit', fontSize: 36, fontWeight: 900, color: s.color, minWidth: 60, opacity: 0.7 }}>{s.step}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#f3f4f6' }}>{s.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section style={{ padding: '100px 5%' }}>
        <div
          id="cta"
          data-animate
          className={`fade-up ${isVisible('cta') ? 'visible' : ''}`}
          style={{ maxWidth: 740, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 32, padding: 'clamp(40px, 8vw, 80px)' }}
        >
          <div style={{ fontSize: 56, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16 }}>
            Ready to Build Your{' '}
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Best Life?
            </span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Join hundreds of people who use VisionBoard every day to stay focused, build habits, and achieve their biggest goals.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-primary" style={{ fontSize: 17, padding: '16px 44px' }}>
              ✨ Create Free Account
            </Link>
            <Link to="/login" className="btn-ghost" style={{ fontSize: 17, padding: '16px 32px' }}>
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VisionBoard</span>
            <span style={{ color: '#4b5563', fontSize: 14, marginLeft: 8 }}>© {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy', to: '/privacy-policy' },
              { label: 'Sign Up', to: '/register' },
              { label: 'Log In', to: '/login' },
            ].map((l) => (
              <Link key={l.label} to={l.to} style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = '#f3f4f6'}
                onMouseOut={e => e.target.style.color = '#6b7280'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
