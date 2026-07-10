import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blogPosts';
import { useSelector } from 'react-redux';

const Blog = () => {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <>
      <SEO
        title="VisionBoard Blog | Productivity & Habit Tracking Tips"
        description="Read the latest articles on habit tracking, goal setting, and personal growth on the VisionBoard blog."
        path="/blog"
      />
      <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, mb: 4, textAlign: 'center' }}>
        The VisionBoard Blog
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '1.2rem', textAlign: 'center', color: darkMode ? '#9ca3af' : '#4b5563', mb: 8, maxWidth: 700, mx: 'auto' }}>
        Insights and strategies for mastering your habits, achieving your goals, and driving personal growth.
      </Typography>
      
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.slug}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', borderRadius: 4 }}>
              <CardActionArea component={Link} to={`/blog/${post.slug}`} sx={{ flexGrow: 1, p: 2 }}>
                <CardContent>
                  <Typography variant="caption" sx={{ color: darkMode ? '#a5b4fc' : '#6366f1', fontWeight: 600, mb: 1, display: 'block' }}>
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Typography>
                  <Typography variant="h2" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 700, mb: 2, color: darkMode ? '#f3f4f6' : '#111827' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#9ca3af' : '#4b5563', lineHeight: 1.6 }}>
                    {post.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Blog;
