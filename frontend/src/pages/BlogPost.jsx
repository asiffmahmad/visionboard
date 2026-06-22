import React from 'react';
import { useParams, Link as RouterLink, Navigate } from 'react-router-dom';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

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
    <div style={{ background: '#0b0f19', minHeight: '100vh', color: '#f3f4f6' }}>
      <SEO
        title={`${post.title} | VisionBoard Blog`}
        description={post.description}
        path={`/blog/${post.slug}`}
      />
      {/* Inject Article JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: '#9ca3af' }}/>} aria-label="breadcrumb" sx={{ mb: 4 }}>
          <Link component={RouterLink} color="inherit" to="/" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#f3f4f6' } }}>
            Home
          </Link>
          <Link component={RouterLink} color="inherit" to="/blog" sx={{ color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#f3f4f6' } }}>
            Blog
          </Link>
          <Typography color="text.primary" sx={{ color: '#f3f4f6' }}>{post.title}</Typography>
        </Breadcrumbs>

        <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 900, mb: 2, color: '#f3f4f6' }}>
          {post.title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 600, mb: 6, display: 'block', fontSize: '1rem' }}>
          Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>

        {/* Blog Content */}
        <Box 
          sx={{ 
            '& h2': { fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 700, mt: 6, mb: 3, color: '#a5b4fc' },
            '& h3': { fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 600, mt: 4, mb: 2, color: '#c7d2fe' },
            '& p': { fontSize: '1.15rem', lineHeight: 1.8, color: '#d1d5db', mb: 3 },
            '& ul': { fontSize: '1.15rem', lineHeight: 1.8, color: '#d1d5db', mb: 3, paddingLeft: '1.5rem' },
            '& li': { mb: 1 },
            '& a': { color: '#a5b4fc', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            '& strong': { color: '#f3f4f6' }
          }}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="h3" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 700, mb: 3, color: '#f3f4f6' }}>
            Ready to start your journey?
          </Typography>
          <Link component={RouterLink} to="/register" sx={{ display: 'inline-block', background: '#6366f1', color: 'white', px: 4, py: 1.5, borderRadius: 2, textDecoration: 'none', fontWeight: 600, '&:hover': { background: '#4f46e5' } }}>
            Sign Up for Free
          </Link>
        </Box>
      </Container>
    </div>
  );
};

export default BlogPost;
