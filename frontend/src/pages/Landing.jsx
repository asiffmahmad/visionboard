import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
};

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const observerRef = useRef(null);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width < 1024;

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
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => {
      observerRef.current.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  const features = [
    { emoji: '🎯', title: 'Goal Tracker', desc: 'Set meaningful long-term and daily goals, break them into milestones, and track every step of your progress with beautiful visualisations. The best goal setting app for personal growth.', color: '#6366f1' },
    { emoji: '🔥', title: 'Daily Habit Tracker', desc: 'Build life-changing habits with daily streaks, heatmaps, and consistency scores. Our free habit tracker keeps you motivated to maintain your routine every single day.', color: '#ec4899' },
    { emoji: '📋', title: 'Task & Daily Planner', desc: 'Organise your daily tasks with priorities, deadlines, and smart filters. Your all-in-one task tracker and daily planner so nothing ever falls through the cracks.', color: '#10b981' },
    { emoji: '🌟', title: 'Vision Board App', desc: 'Create stunning digital vision boards that keep your biggest aspirations front and centre. The #1 vision board app to fuel your motivation and personal growth.', color: '#f59e0b' },
    { emoji: '📓', title: 'Journal & Reflection', desc: 'Reflect, plan and grow with a private daily journal. Track your thoughts, mental clarity, and self-improvement journey in one secure place.', color: '#8b5cf6' },
    { emoji: '📊', title: 'Progress Dashboard', desc: 'A powerful productivity tracker dashboard connecting Google, GitHub, Instagram and LinkedIn to show your real-world progress live.', color: '#0ea5e9' },
  ];

  const integrations = [
    { name: 'Google', icon: '🔵', desc: 'Calendar, Gmail & YouTube live data', color: '#4285F4' },
    { name: 'GitHub', icon: '⚫', desc: 'Repos, followers & latest commits', color: '#6e7681' },
    { name: 'Instagram', icon: '🩷', desc: 'Followers, engagement & reach', color: '#E1306C' },
    { name: 'LinkedIn', icon: '🔷', desc: 'Profile views & connections', color: '#0077b5' },
  ];

  const stats = [
    { value: '10+', label: 'Built-In Features' },
    { value: '4', label: 'Live Integrations' },
    { value: '100%', label: 'Free to Use' },
    { value: '∞', label: 'Goals You Can Set' },
  ];

  const steps = [
    { step: '01', title: 'Create your free account', desc: 'Sign up in seconds. No credit card needed. Your data stays private and secure.', color: '#6366f1' },
    { step: '02', title: 'Set your goals & habits', desc: 'Define success on your own terms. Add visions, goals, daily habits and tasks.', color: '#ec4899' },
    { step: '03', title: 'Track, grow & celebrate', desc: 'Watch your progress on a beautiful dashboard. Stay consistent. Achieve more.', color: '#10b981' },
  ];

  const faqs = [
    { q: 'What is a habit tracker?', a: 'A habit tracker is a tool that helps you build and maintain daily routines by visually recording your consistency over time.' },
    { q: 'How does streak tracking work?', a: 'Streak tracking records consecutive days you perform a habit. It uses psychology to motivate you not to "break the chain".' },
    { q: 'Can I track goals?', a: 'Yes! VisionBoard includes a robust goal tracker that lets you break large life goals into actionable daily tasks.' },
    { q: 'Is the app free?', a: 'Yes, VisionBoard is 100% free. We believe everyone should have access to high-quality personal growth tools.' },
    { q: 'How do vision boards help?', a: 'Vision boards provide a visual representation of your ideal future, keeping your motivation high and your daily habits aligned with your life goals.' },
    { q: 'Can I use the app on mobile?', a: 'Absolutely. VisionBoard is a fully responsive web application that works perfectly on any mobile device or tablet.' },
  ];


  return (
    <div style={{ background: '#0b0f19', color: '#f3f4f6', fontFamily: '"Inter", "Outfit", sans-serif', overflowX: 'hidden', minHeight: '100vh' }}>
      <SEO
        title="VisionBoard | Free Habit Tracker, Goal Tracker & Vision Board App"
        description="Free all-in-one productivity app to track daily habits, set goals, build streaks, and create vision boards. Start your personal growth journey today — 100% free."
        path="/"
      />


      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 6%', height: 64,
        background: scrollY > 40 || menuOpen ? 'rgba(11,15,25,0.97)' : 'transparent',
        backdropFilter: scrollY > 40 || menuOpen ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 20, background: 'linear-gradient(90deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>VisionBoard</span>
        </div>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <Link to="/features" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f3f4f6'} onMouseOut={e => e.target.style.color = '#9ca3af'}>Features</Link>
            <Link to="/how-it-works" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f3f4f6'} onMouseOut={e => e.target.style.color = '#9ca3af'}>How It Works</Link>
            <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#f3f4f6'} onMouseOut={e => e.target.style.color = '#9ca3af'}>About Us</Link>
          </div>
        )}

        {/* Desktop CTA buttons */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" className="btn-outline" style={{ padding: '9px 20px', fontSize: 14 }}>Log In</Link>
            <Link to="/register" className="btn-cta" style={{ padding: '9px 20px', fontSize: 14 }}>Get Started Free</Link>
          </div>
        )}

        {/* Hamburger */}
        {isMobile && (
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobile && menuOpen && (
        <div className="mobile-menu">
          <Link to="/features" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link to="/how-it-works" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About Us</Link>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '8px 0' }} />
          <Link to="/login" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Log In</Link>
          <Link to="/register" className="btn-cta" style={{ marginTop: 8, justifyContent: 'center', textAlign: 'center' }} onClick={() => setMenuOpen(false)}>
            🚀 Get Started Free
          </Link>
        </div>
      )}

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: isMobile ? '100px 24px 60px' : '120px 6% 80px',
        textAlign: 'center', overflow: 'hidden',
      }}>
        {/* Background glows */}
        <div className="glow-orb" style={{ position: 'absolute', top: '18%', left: isMobile ? '-10%' : '10%', width: isMobile ? 300 : 500, height: isMobile ? 300 : 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div className="glow-orb" style={{ position: 'absolute', bottom: '15%', right: isMobile ? '-10%' : '10%', width: isMobile ? 250 : 420, height: isMobile ? 250 : 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', animationDelay: '2s' }} />

        <div style={{ maxWidth: 860, position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 100, padding: '7px 20px', marginBottom: 28, fontSize: 13, fontWeight: 600, color: '#a5b4fc' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block', boxShadow: '0 0 8px #6366f1' }} />
            Your All-in-One Productivity Platform
          </div>

          {/* H1 — Primary keyword target */}
          <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: isMobile ? 38 : isTablet ? 56 : 76, fontWeight: 900, lineHeight: 1.08, letterSpacing: isMobile ? '-1px' : '-2.5px', marginBottom: 24 }}>
            The Free Habit Tracker &amp; Goal Tracker{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1 0%,#ec4899 50%,#f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
              Built For Your Best Life
            </span>
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: isMobile ? 16 : 19, color: '#9ca3af', lineHeight: 1.75, maxWidth: 600, margin: '0 auto 40px', fontWeight: 400, padding: isMobile ? '0 4px' : 0 }}>
            VisionBoard is your all-in-one productivity app — combining a daily habit tracker, goal tracker, vision board, streak tracker, and daily planner so you can build better habits and achieve personal growth.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link to="/register" className="btn-cta" style={{ fontSize: isMobile ? 15 : 17, padding: isMobile ? '14px 28px' : '16px 44px' }}>
              🚀 Start For Free
            </Link>
            <Link to="/login" className="btn-outline" style={{ fontSize: isMobile ? 15 : 17, padding: isMobile ? '14px 28px' : '16px 36px' }}>
              Sign In →
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['🧑', '👩', '🧔', '👱', '🧑‍💻'].map((e, i) => (
                <div key={i} style={{ width: 34, height: 34, borderRadius: '50%', background: `hsl(${i * 55},60%,48%)`, border: '2px solid #0b0f19', marginLeft: i > 0 ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{e}</div>
              ))}
            </div>
            <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 500 }}>
              Join <span style={{ color: '#f3f4f6', fontWeight: 700 }}>500+</span> users building their best life
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: isMobile ? '48px 24px' : '64px 6%', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 16, maxWidth: 900, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{ fontFamily: 'Outfit', fontSize: isMobile ? 36 : 44, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ color: '#9ca3af', fontSize: isMobile ? 13 : 14, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: isMobile ? '72px 24px' : '100px 6%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div id="feat-h" data-animate className={`landing-fade ${isVisible('feat-h') ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 64 }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#a5b4fc', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>Everything You Need</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: isMobile ? 30 : 48, fontWeight: 800, letterSpacing: isMobile ? '-0.5px' : '-1.5px', marginBottom: 14, lineHeight: 1.15 }}>
              Habit Tracker, Goal Tracker &amp; Vision Board —{' '}
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>One Beautiful Place</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: isMobile ? 15 : 17, maxWidth: 520, margin: '0 auto' }}>
              Stop juggling 10 different apps. VisionBoard is the free productivity app that brings your habit tracker, goal tracker, streak tracker, and daily planner all together.
            </p>
          </div>

          <div id="feat-g" data-animate className={`landing-fade ${isVisible('feat-g') ? 'show' : ''}`}
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ width: 50, height: 50, borderRadius: 13, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>{f.emoji}</div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#f3f4f6' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section id="integrations" style={{ padding: isMobile ? '72px 24px' : '100px 6%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 1fr', gap: isMobile ? 48 : 72, alignItems: 'center' }}>
          {/* Text */}
          <div id="int-t" data-animate className={`landing-fade ${isVisible('int-t') ? 'show' : ''}`}>
            <div style={{ display: 'inline-block', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: 100, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#f472b6', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>Live Integrations</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: isMobile ? 28 : 42, fontWeight: 800, letterSpacing: '-1px', marginBottom: 18, lineHeight: 1.2 }}>
              Your Digital Life,{' '}
              <span style={{ background: 'linear-gradient(135deg,#ec4899,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>All Connected</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: isMobile ? 15 : 16, lineHeight: 1.75, marginBottom: 28 }}>
              Connect Google Workspace, GitHub, Instagram, and LinkedIn to see your real-world metrics live on your dashboard. Zero manual updates.
            </p>
            <Link to="/register" className="btn-cta" style={{ fontSize: 15, padding: '13px 28px' }}>Connect Your Accounts →</Link>
          </div>

          {/* Cards */}
          <div id="int-c" data-animate className={`landing-fade ${isVisible('int-c') ? 'show' : ''}`}
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
            {integrations.map((int, i) => (
              <div key={i} className="int-card" style={{ borderLeft: `3px solid ${int.color}` }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{int.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: int.color, marginBottom: 4 }}>{int.name}</div>
                  <div style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>{int.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: isMobile ? '72px 24px' : '100px 6%' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div id="how-h" data-animate className={`landing-fade ${isVisible('how-h') ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: isMobile ? 28 : 44, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15 }}>
              Get Started in{' '}
              <span style={{ background: 'linear-gradient(135deg,#6366f1,#10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>3 Simple Steps</span>
            </h2>
          </div>
          <div id="how-s" data-animate className={`landing-fade ${isVisible('how-s') ? 'show' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((s) => (
              <div key={s.step} className="step-card">
                <div style={{ fontFamily: 'Outfit', fontSize: isMobile ? 30 : 38, fontWeight: 900, color: s.color, opacity: 0.7, minWidth: isMobile ? 48 : 58, lineHeight: 1 }}>{s.step}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: isMobile ? 16 : 18, marginBottom: 8, color: '#f3f4f6' }}>{s.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: isMobile ? 14 : 15, lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQS ── */}
      <section id="faq" style={{ padding: isMobile ? '72px 24px' : '100px 6%', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div id="faq-h" data-animate className={`landing-fade ${isVisible('faq-h') ? 'show' : ''}`} style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 56 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: isMobile ? 28 : 42, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15 }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div id="faq-list" data-animate className={`landing-fade ${isVisible('faq-list') ? 'show' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#f3f4f6' }}>{faq.q}</h3>
                <p style={{ color: '#9ca3af', fontSize: 15, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: isMobile ? '60px 24px' : '100px 6%' }}>
        <div id="cta" data-animate className={`landing-fade ${isVisible('cta') ? 'show' : ''}`}
          style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: isMobile ? 24 : 32, padding: isMobile ? '48px 28px' : '72px 64px' }}>
          <div style={{ fontSize: isMobile ? 48 : 60, marginBottom: 20 }}>🚀</div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: isMobile ? 26 : 44, fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, lineHeight: 1.15 }}>
            Start Your Free Habit Tracker &amp;{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Goal Tracker Today</span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: isMobile ? 15 : 17, lineHeight: 1.75, marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>
            Hundreds of people use VisionBoard every day to build daily habits, track personal goals, maintain streaks, and achieve self-improvement — completely free.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn-cta" style={{ fontSize: isMobile ? 15 : 17, padding: isMobile ? '14px 28px' : '16px 44px' }}>✨ Create Free Account</Link>
            <Link to="/login" className="btn-outline" style={{ fontSize: isMobile ? 15 : 16, padding: isMobile ? '14px 24px' : '16px 32px' }}>I have an account</Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: isMobile ? '32px 24px' : '40px 6%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 0, alignItems: isMobile ? 'center' : 'center', justifyContent: 'space-between', textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 17, background: 'linear-gradient(90deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VisionBoard</span>
            <span style={{ color: '#374151', fontSize: 13, marginLeft: 4 }}>© {new Date().getFullYear()}</span>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 20 : 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[{ label: 'Features', to: '/features' }, { label: 'How It Works', to: '/how-it-works' }, { label: 'About', to: '/about' }, { label: 'Privacy Policy', to: '/privacy-policy' }].map((l) => (
              <Link key={l.label} to={l.to}
                style={{ color: '#6b7280', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}
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
