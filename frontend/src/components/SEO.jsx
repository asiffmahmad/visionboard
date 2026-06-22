import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://my-vision-board-app.vercel.app';
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = 'VisionBoard';

const DEFAULT_META = {
  title: 'VisionBoard | Free Habit Tracker, Goal Tracker & Vision Board App',
  description:
    'Free habit tracker and vision board app to track daily habits, set goals, build streaks, and plan your life. Build better routines, stay motivated, and achieve personal growth — all in one place.',
  keywords:
    'habit tracker, daily habit tracker, free habit tracker, goal tracker, vision board app, productivity app, streak tracker, daily planner, personal growth app, routine tracker, self improvement app, goal setting app, motivation app, daily goals tracker, habit building app, success tracker, task tracker, life planner, productivity tracker, progress tracker',
};

/**
 * Reusable SEO component for dynamic per-page metadata.
 * Usage: <SEO title="..." description="..." path="/login" />
 */
const SEO = ({
  title = DEFAULT_META.title,
  description = DEFAULT_META.description,
  keywords = DEFAULT_META.keywords,
  path = '/',
  type = 'website',
  noIndex = false,
}) => {
  const canonicalUrl = `${BASE_URL}${path}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    description:
      'Free all-in-one productivity app with habit tracker, goal tracker, vision board, streak tracker, daily planner, and personal growth tools.',
    url: BASE_URL,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Daily Habit Tracker',
      'Goal Tracker',
      'Streak Tracker',
      'Vision Board',
      'Daily Planner',
      'Progress Tracker',
      'Journal',
      'Task Manager',
    ],
  };

  const websiteStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_META.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow, noarchive, nosnippet' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="VisionBoard — Habit Tracker, Goal Tracker & Vision Board App" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content="VisionBoard — Habit Tracker, Goal Tracker & Vision Board App" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
export { DEFAULT_META, BASE_URL };
