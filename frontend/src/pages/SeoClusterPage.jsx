import React from 'react';
import { useParams, Link as RouterLink, Navigate } from 'react-router-dom';
import { Container, Typography, Box, Link, Button } from '@mui/material';
import SEO from '../components/SEO';
import { seoClusters } from '../data/seoClusters';

const SeoClusterPage = () => {
  const { slug } = useParams();
  const cluster = seoClusters.find(c => c.slug === slug);

  if (!cluster) {
    return <Navigate to="/not-found" replace />;
  }

  // Generate specialized schema for the use-case page
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": cluster.title,
    "description": cluster.description,
    "url": \`https://my-vision-board-app.vercel.app/use-case/\${cluster.slug}\`,
    "about": {
      "@type": "Thing",
      "name": cluster.keyword
    }
  };

  return (
    <div style={{ background: '#0b0f19', minHeight: '100vh', color: '#f3f4f6' }}>
      <SEO
        title={cluster.title}
        description={cluster.description}
        path={\`/use-case/\${cluster.slug}\`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', mb: 2, display: 'block' }}>
          Use Case Spotlight
        </Typography>
        <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, mb: 4, color: '#f3f4f6', lineHeight: 1.1 }}>
          {cluster.h1}
        </Typography>

        <Box 
          sx={{ 
            '& h2': { fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 700, mt: 6, mb: 3, color: '#a5b4fc' },
            '& p': { fontSize: '1.2rem', lineHeight: 1.8, color: '#d1d5db', mb: 4 },
            '& strong': { color: '#f3f4f6' }
          }}
          dangerouslySetInnerHTML={{ __html: cluster.content }} 
        />

        <Box sx={{ mt: 8, p: 6, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 4, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.5rem', fontWeight: 800, mb: 2, color: '#f3f4f6' }}>
            Ready to build better routines?
          </Typography>
          <Typography sx={{ color: '#9ca3af', fontSize: '1.1rem', mb: 4, maxWidth: 500, mx: 'auto' }}>
            Join hundreds of users who are already using VisionBoard to track their habits and achieve their goals.
          </Typography>
          <Button component={RouterLink} to="/register" variant="contained" size="large" sx={{ background: '#6366f1', color: 'white', px: 6, py: 2, fontSize: '1.1rem', fontWeight: 700, '&:hover': { background: '#4f46e5' } }}>
            Start Using VisionBoard Free
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default SeoClusterPage;
