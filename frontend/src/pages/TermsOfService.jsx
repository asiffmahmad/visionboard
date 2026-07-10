import React from 'react';
import { Box, Typography, Divider, Paper, Container, Link } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SEO from '../components/SEO';

const Section = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const Paragraph = ({ children }) => (
  <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.8 }}>
    {children}
  </Typography>
);

const TermsOfService = () => {
  const lastUpdated = 'July 10, 2026';
  const appName = 'VisionBoard';
  const contactEmail = 'noreplydesk01@gmail.com';

  return (
    <>
      <SEO
        title="Terms of Service | VisionBoard"
        description="Read the terms of service for VisionBoard. Understand your rights and responsibilities when using our application."
        path="/terms"
      />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'flex',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)'
          }}>
            <DescriptionIcon fontSize="medium" />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Terms of Service
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, fontWeight: 500 }}>
          Last Updated: {lastUpdated}
        </Typography>

        <Paper elevation={0} sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 4, 
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.02), rgba(255,255,255,0))'
        }}>
          
          <Section title="1. Agreement to Terms">
            <Paragraph>
              By accessing or using {appName}, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These Terms apply to all visitors, users, and others who access or use the Service.
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="2. Description of Service">
            <Paragraph>
              {appName} is a personal productivity application providing tools such as a daily habit tracker, goal tracking, digital vision boards, and task management. We reserve the right to withdraw or amend our service, and any service or material we provide, in our sole discretion without notice.
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="3. User Accounts">
            <Paragraph>
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
            </Paragraph>
            <Paragraph>
              You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="4. Acceptable Use">
            <Paragraph>
              You agree not to use the Service:
              <ul>
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>To impersonate or attempt to impersonate {appName}, a {appName} employee, another user, or any other person or entity.</li>
                <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm {appName} or users of the Service.</li>
              </ul>
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="5. Intellectual Property">
            <Paragraph>
              The Service and its original content, features, and functionality are and will remain the exclusive property of {appName} and its licensors. The Service is protected by copyright, trademark, and other laws.
            </Paragraph>
            <Paragraph>
              Your personal data and the content you input (goals, visions, habits) remains your property. By uploading content, you grant us a license to store and display it solely to provide the Service to you.
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="6. Termination">
            <Paragraph>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="7. Limitation of Liability">
            <Paragraph>
              In no event shall {appName}, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="8. Changes to Terms">
            <Paragraph>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </Paragraph>
          </Section>

          <Divider sx={{ my: 4, opacity: 0.5 }} />

          <Section title="9. Contact Us">
            <Paragraph>
              If you have any questions about these Terms, please contact us at:
              <br />
              <strong>Email:</strong> <Link href={`mailto:${contactEmail}`} color="primary" sx={{ fontWeight: 500, ml: 1 }}>{contactEmail}</Link>
            </Paragraph>
          </Section>

        </Paper>
      </Container>
    </>
  );
};

export default TermsOfService;
