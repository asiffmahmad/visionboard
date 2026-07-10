import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AdSidebar from '../components/AdSidebar';

const PublicLayoutWithSidebar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ background: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Reusable Navbar from Landing Page (simplified for layout) */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 20px' : '0 6%', height: 64,
        background: scrollY > 40 || menuOpen ? 'rgba(11,15,25,0.97)' : 'rgba(11,15,25,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo192.png" alt="Logo" style={{ width: 36, height: 36 }} />
            <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 900, fontSize: 20, background: 'linear-gradient(90deg,#6366f1,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>My Vision Board</span>
          </Link>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <Link to="/features" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Features</Link>
            <Link to="/how-it-works" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>How It Works</Link>
            <Link to="/blog" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Blog</Link>
          </div>
        )}

        {!isMobile && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" className="btn-outline" style={{ padding: '7px 18px', fontSize: 13 }}>Log In</Link>
            <Link to="/register" className="btn-cta" style={{ padding: '7px 18px', fontSize: 13 }}>Get Started Free</Link>
          </div>
        )}

        {isMobile && (
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 24 }}>
            ☰
          </button>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobile && menuOpen && (
        <div className="mobile-menu" style={{ position: 'fixed', top: 64, left: 0, right: 0, background: '#111827', zIndex: 99, padding: 20, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/features" style={{ display: 'block', color: 'white', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMenuOpen(false)}>Features</Link>
          <Link to="/blog" style={{ display: 'block', color: 'white', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/login" style={{ display: 'block', color: 'white', textDecoration: 'none', padding: '10px 0' }} onClick={() => setMenuOpen(false)}>Log In</Link>
        </div>
      )}

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, pt: { xs: 12, md: 16 }, pb: 8, px: { xs: 2, md: 6 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: { xs: 6, md: 8 },
          alignItems: 'flex-start'
        }}>
          {/* Left Column: Outlet (Dynamic Content) */}
          <Box sx={{ flexGrow: 1, minWidth: 0, width: '100%' }}>
            <Outlet />
          </Box>

          {/* Right Column: Ad Sidebar */}
          <AdSidebar />
        </Box>
      </Container>
    </Box>
  );
};

export default PublicLayoutWithSidebar;
