import React from 'react';
import { useParams, Link as RouterLink, Navigate } from 'react-router-dom';
import { Container, Typography, Box, Breadcrumbs, Link, Button } from '@mui/material';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useSelector } from 'react-redux';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const { darkMode } = useSelector((state) => state.theme);

  if (!post) {
    return <Navigate to="/not-found" replace />;
  }

  // Schema generation
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "VisionBoard"
    }
  };

  return (
    <>
      <SEO
        title={`${post.title} | VisionBoard Blog`}
        description={post.description}
        path={`/blog/${post.slug}`}
      />
      {/* Inject Article JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: darkMode ? '#9ca3af' : '#4b5563' }}/>} aria-label="breadcrumb" sx={{ mb: 4 }}>
        <Link component={RouterLink} color="inherit" to="/" sx={{ color: darkMode ? '#9ca3af' : '#4b5563', textDecoration: 'none', '&:hover': { color: darkMode ? '#f3f4f6' : '#111827' } }}>
          Home
        </Link>
        <Link component={RouterLink} color="inherit" to="/blog" sx={{ color: darkMode ? '#9ca3af' : '#4b5563', textDecoration: 'none', '&:hover': { color: darkMode ? '#f3f4f6' : '#111827' } }}>
          Blog
        </Link>
        <Typography color="text.primary" sx={{ color: darkMode ? '#f3f4f6' : '#111827' }}>{post.title}</Typography>
      </Breadcrumbs>

      <Typography variant="caption" sx={{ color: darkMode ? '#a5b4fc' : '#6366f1', fontWeight: 600, mb: 2, display: 'block' }}>
        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </Typography>
      <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 900, mb: 4, color: darkMode ? '#f3f4f6' : '#111827', lineHeight: 1.2 }}>
        {post.title}
      </Typography>

      <Box 
        sx={{ 
          '& h2': { fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 700, mt: 6, mb: 3, color: darkMode ? '#f3f4f6' : '#111827' },
          '& p': { fontSize: '1.2rem', lineHeight: 1.8, color: darkMode ? '#d1d5db' : '#374151', mb: 4 },
          '& ul': { mb: 4, pl: 4 },
          '& li': { fontSize: '1.2rem', lineHeight: 1.8, color: darkMode ? '#d1d5db' : '#374151', mb: 1 }
        }}
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <Box sx={{ mt: 8, p: 4, background: darkMode ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.1)', border: darkMode ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(99,102,241,0.3)', borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, mb: 2, color: darkMode ? '#f3f4f6' : '#111827' }}>
          Ready to put this into practice?
        </Typography>
        <Typography sx={{ color: darkMode ? '#9ca3af' : '#4b5563', fontSize: '1.1rem', mb: 4 }}>
          Join VisionBoard to start tracking your habits and goals for free.
        </Typography>
        <Button component={RouterLink} to="/register" variant="contained" size="large" sx={{ background: '#6366f1', color: 'white', px: 6, py: 1.5, fontWeight: 700 }}>
          Get Started
        </Button>
      </Box>
    </>
  );
};

export default BlogPost;
