import React from 'react'
import { Outlet, Navigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Inter","Outfit",sans-serif', background: '#0b0f19', overflowX: 'hidden' }}>


      {/* ── LEFT PANEL: Brand showcase ── */}
      <div className="auth-left-panel" style={{
        width: '45%', flexShrink: 0, position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(145deg, #0f0f23 0%, #0b0f19 50%, #0f1628 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
      }}>
        {/* Glow orbs */}
        <div className="auth-glow" style={{ position: 'absolute', top: '15%', left: '10%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div className="auth-glow" style={{ position: 'absolute', bottom: '20%', right: '5%', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', animationDelay: '2.5s' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 56 }}>
            <span style={{ fontSize: 28 }}>✅</span>
            <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 22, background: 'linear-gradient(90deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VisionBoard</span>
          </Link>

          {/* Headline */}
          <h2 style={{ fontFamily: 'Outfit,sans-serif', fontSize: 38, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1.5px', color: '#f3f4f6', marginBottom: 16 }}>
            Build your{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              best life
            </span>{' '}
            one habit at a time.
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.75, marginBottom: 48 }}>
            Track goals, build habits, manage tasks and connect all your digital tools in one beautiful dashboard.
          </p>

          {/* Feature pills */}
          {[
            { emoji: '🎯', text: 'Goal & Vision Tracking' },
            { emoji: '🔥', text: 'Habit Streaks & Heatmaps' },
            { emoji: '✅', text: 'Smart Task Management' },
            { emoji: '📊', text: 'Live App Integrations' },
          ].map((f) => (
            <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{f.emoji}</span>
              <span style={{ color: '#d1d5db', fontSize: 15, fontWeight: 500 }}>{f.text}</span>
              <span style={{ marginLeft: 'auto', color: '#6366f1', fontSize: 18 }}>✓</span>
            </div>
          ))}

          {/* Trust badges */}
          <div style={{ marginTop: 40, display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: '#6366f1' }}>500+</div>
              <div style={{ color: '#6b7280', fontSize: 12, fontWeight: 500 }}>Users</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: '#ec4899' }}>100%</div>
              <div style={{ color: '#6b7280', fontSize: 12, fontWeight: 500 }}>Free</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: '#10b981' }}>4</div>
              <div style={{ color: '#6b7280', fontSize: 12, fontWeight: 500 }}>Integrations</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className="auth-right-panel" style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', overflowY: 'auto',
      }}>
        {/* Mobile logo (only shown when left panel is hidden) */}
        <div style={{ position: 'absolute', top: 20, left: 24, display: 'none' }} className="mobile-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>VisionBoard</span>
          </Link>
        </div>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
