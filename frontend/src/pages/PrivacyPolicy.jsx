import React from 'react';
import { Box, Typography, Divider, Paper, Container, Link } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
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

const PrivacyPolicy = () => {
  const lastUpdated = 'June 22, 2025';
  const appName = 'VisionBoard';
  const contactEmail = 'noreplydesk01@gmail.com';
  const websiteUrl = 'https://visionboard.app';

  return (
    <>
      <SEO
        title="Privacy Policy | VisionBoard"
        description="Read the privacy policy for VisionBoard. We are committed to protecting your personal data and ensuring transparency in how we handle your information."
        path="/privacy-policy"
      />
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{
          p: 1.5,
          borderRadius: 3,
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <GavelIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {lastUpdated}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Paragraph>
          Welcome to <strong>{appName}</strong> ("{websiteUrl}"). Your privacy is important to us. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you visit our website
          and use our services. Please read this policy carefully. By using {appName}, you agree to the
          terms described in this Privacy Policy.
        </Paragraph>

        <Divider sx={{ my: 3 }} />

        <Section title="1. Information We Collect">
          <Paragraph>
            We may collect the following types of information when you use {appName}:
          </Paragraph>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary', '& li': { mb: 1, lineHeight: 1.8 } }}>
            <li><strong>Account Information:</strong> When you register, we collect your name, email address, and password.</li>
            <li><strong>Profile Data:</strong> Information you add to your profile such as a username or avatar.</li>
            <li><strong>Usage Data:</strong> Goals, habits, tasks, notes, journal entries, and visions you create within the app.</li>
            <li><strong>Google Account Data (optional):</strong> If you connect your Google account, we access your Google Calendar events, Gmail unread count, and YouTube statistics via OAuth2. You can revoke this at any time.</li>
            <li><strong>Device & Log Data:</strong> IP address, browser type, operating system, referring URLs, and pages visited.</li>
            <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience (see Section 5).</li>
          </Box>
        </Section>

        <Section title="2. How We Use Your Information">
          <Paragraph>We use the information we collect to:</Paragraph>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary', '& li': { mb: 1, lineHeight: 1.8 } }}>
            <li>Provide, maintain, and improve our services</li>
            <li>Authenticate your account and keep it secure</li>
            <li>Personalize your dashboard experience</li>
            <li>Display relevant advertising through Google AdSense</li>
            <li>Send you service-related notifications (no spam)</li>
            <li>Monitor usage patterns and fix bugs</li>
            <li>Comply with legal obligations</li>
          </Box>
        </Section>

        <Section title="3. Google AdSense & Advertising">
          <Paragraph>
            We use <strong>Google AdSense</strong> to display advertisements on our platform. Google AdSense uses
            cookies and web beacons to serve ads based on your prior visits to our website and other sites on
            the internet. This allows Google and its partners to serve ads to our users based on their visit
            to {appName} and/or other sites on the internet.
          </Paragraph>
          <Paragraph>
            Google's use of advertising cookies enables it and its partners to serve ads to you based on your
            visit to our site and/or other sites on the internet. You may opt out of personalised advertising
            by visiting{' '}
            <Link href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </Link>
            {' '}or by visiting{' '}
            <Link href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </Link>.
          </Paragraph>
          <Paragraph>
            For more information on how Google uses data collected through AdSense, please visit:{' '}
            <Link href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
              How Google uses information from sites or apps that use our services
            </Link>.
          </Paragraph>
        </Section>

        <Section title="4. Third-Party Services">
          <Paragraph>
            We integrate with the following third-party services. Their use of your data is governed by their
            own privacy policies:
          </Paragraph>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary', '& li': { mb: 1, lineHeight: 1.8 } }}>
            <li>
              <strong>Google (OAuth, Calendar, Gmail, YouTube, AdSense):</strong>{' '}
              <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </Link>
            </li>
            <li>
              <strong>GitHub (optional profile connection):</strong>{' '}
              <Link href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer">
                GitHub Privacy Statement
              </Link>
            </li>
            <li>
              <strong>Instagram / Meta (optional profile connection):</strong>{' '}
              <Link href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
                Meta Privacy Policy
              </Link>
            </li>
            <li>
              <strong>LinkedIn (optional profile connection):</strong>{' '}
              <Link href="https://www.linkedin.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                LinkedIn Privacy Policy
              </Link>
            </li>
          </Box>
        </Section>

        <Section title="5. Cookies">
          <Paragraph>
            Cookies are small data files placed on your device. We use the following types of cookies:
          </Paragraph>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary', '& li': { mb: 1, lineHeight: 1.8 } }}>
            <li><strong>Essential Cookies:</strong> Required for authentication and core app functionality (e.g., keeping you logged in).</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform.</li>
            <li><strong>Advertising Cookies:</strong> Used by Google AdSense to serve personalised or contextual ads.</li>
          </Box>
          <Paragraph>
            You can control cookies through your browser settings. Disabling cookies may affect certain
            features of the app. For more information, visit{' '}
            <Link href="https://allaboutcookies.org" target="_blank" rel="noopener noreferrer">
              allaboutcookies.org
            </Link>.
          </Paragraph>
        </Section>

        <Section title="6. Data Retention">
          <Paragraph>
            We retain your personal data for as long as your account is active or as needed to provide you
            services. You may request deletion of your account and associated data at any time by contacting
            us at <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>.
          </Paragraph>
        </Section>

        <Section title="7. Data Security">
          <Paragraph>
            We implement appropriate technical and organisational security measures to protect your information
            against unauthorised access, alteration, disclosure, or destruction. These include encrypted
            passwords (bcrypt), JWT-based authentication, and HTTPS-only communication. However, no method
            of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </Paragraph>
        </Section>

        <Section title="8. Children's Privacy">
          <Paragraph>
            {appName} is not directed to children under the age of 13. We do not knowingly collect personally
            identifiable information from children under 13. If you are a parent or guardian and believe your
            child has provided us with personal information, please contact us immediately.
          </Paragraph>
        </Section>

        <Section title="9. Your Rights (GDPR / CCPA)">
          <Paragraph>
            Depending on your location, you may have the following rights regarding your personal data:
          </Paragraph>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary', '& li': { mb: 1, lineHeight: 1.8 } }}>
            <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate personal data.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data ("Right to be forgotten").</li>
            <li><strong>Portability:</strong> Request your data in a portable format.</li>
            <li><strong>Opt-out of ads:</strong> Opt out of personalised advertising at any time.</li>
          </Box>
          <Paragraph>
            To exercise any of these rights, contact us at{' '}
            <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>.
          </Paragraph>
        </Section>

        <Section title="10. Changes to This Policy">
          <Paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any significant changes
            by updating the "Last updated" date at the top of this page. Continued use of {appName} after
            changes are posted constitutes your acceptance of the updated policy.
          </Paragraph>
        </Section>

        <Section title="11. Contact Us">
          <Paragraph>
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
          </Paragraph>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Email:</strong>{' '}
              <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <strong>Website:</strong>{' '}
              <Link href={websiteUrl} target="_blank" rel="noopener noreferrer">{websiteUrl}</Link>
            </Typography>
          </Box>
        </Section>
      </Paper>
    </Container>
    </>
  );
};

export default PrivacyPolicy;
