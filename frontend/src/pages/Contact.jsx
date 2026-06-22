import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, Paper } from '@mui/material';
import SEO from '../components/SEO';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', msg: 'Please fill in all fields.' });
      return;
    }
    // Simulate API call
    setTimeout(() => {
      setStatus({ type: 'success', msg: 'Thank you for contacting us! We will reply shortly.' });
      setFormData({ name: '', email: '', message: '' });
    }, 500);
  };

  return (
    <div style={{ background: '#0b0f19', minHeight: '100vh', color: '#f3f4f6' }}>
      <SEO
        title="Contact Us | VisionBoard Support & Feedback"
        description="Get in touch with the VisionBoard team. We are here to help you with our habit tracker, goal tracker, and productivity tools."
        path="/contact"
      />
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h1" sx={{ fontFamily: 'Outfit, sans-serif', fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 900, mb: 4, textAlign: 'center' }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.2rem', textAlign: 'center', color: '#9ca3af', mb: 8 }}>
          Have a question or feedback about our productivity app? We'd love to hear from you.
        </Typography>
        
        <Paper sx={{ p: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
          {status.msg && <Alert severity={status.type} sx={{ mb: 4 }}>{status.msg}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputLabelProps={{ style: { color: '#9ca3af' } }}
              InputProps={{ style: { color: '#f3f4f6' } }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 3 }}
              InputLabelProps={{ style: { color: '#9ca3af' } }}
              InputProps={{ style: { color: '#f3f4f6' } }}
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={5}
              value={formData.message}
              onChange={handleChange}
              sx={{ mb: 4 }}
              InputLabelProps={{ style: { color: '#9ca3af' } }}
              InputProps={{ style: { color: '#f3f4f6' } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              endIcon={<SendIcon />}
              sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
            >
              Send Message
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Contact;
