/**
 * LoginPrompt.jsx
 *
 * LoginPrompt component - Guest login encouragement banner
 * Displays call-to-action with sign in/signup buttons and feature highlights
 * Shown on Home page for unauthenticated users
 *
 * Features:
 * - Gradient orange background with decorative circles
 * - Prominent headline and subtext explaining benefits
 * - Two CTA buttons: Sign In and Create Account with hover effects
 * - Three feature icons showing key app benefits
 *
 * Extracted from Home.jsx for better component organization
 */

import { Link } from 'react-router-dom';
import FeatureIcon from './FeatureIcon';

/**
 * LoginPrompt functional component
 * @returns {React.ReactNode} Login encouragement banner with styling and CTAs
 */
export const LoginPrompt = () => (
  <div style={{
    marginTop: 40,
    marginBottom: 60,
    background: 'linear-gradient(135deg, #9a4207 0%, #c85609 100%)',
    borderRadius: 16,
    padding: '48px 32px',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(154, 66, 7, 0.3)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Decorative background circles for visual interest */}
    <div style={{
      position: 'absolute',
      top: -50,
      right: -50,
      width: 200,
      height: 200,
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      pointerEvents: 'none'
    }} />
    <div style={{
      position: 'absolute',
      bottom: -30,
      left: -30,
      width: 150,
      height: 150,
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '50%',
      pointerEvents: 'none'
    }} />

    {/* Main content - headline, description, buttons */}
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Headline */}
      <h2 style={{
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 16,
        color: '#fff',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        Unlock Your Personalized Experience
      </h2>
      {/* Subheadline - value proposition */}
      <p style={{
        fontSize: 18,
        marginBottom: 32,
        color: '#fff',
        opacity: 0.95,
        maxWidth: 600,
        margin: '0 auto 32px',
        lineHeight: 1.6
      }}>
        Join Syncfully to get personalized recommendations, track what you've watched and listened to, and discover works tailored just for you.
      </p>
      {/* CTA Buttons - Sign In and Create Account */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Sign In Button */}
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            background: '#fff',
            color: '#9a4207',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 8,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          Sign In
        </Link>
        {/* Create Account Button - links to signup mode */}
        <Link
          to="/login?mode=signup"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            background: 'transparent',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 8,
            textDecoration: 'none',
            border: '2px solid #fff',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Create Account
        </Link>
      </div>

      {/* Feature Highlights - Three key benefits */}
      <div style={{ display: 'flex', gap: 64, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
        {/* Feature 1: Personalized Recommendations */}
        <FeatureIcon label="Personalized Recommendations">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
          </svg>
        </FeatureIcon>

        {/* Feature 2: Track Your Collection */}
        <FeatureIcon label="Track Your Collection">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </FeatureIcon>

        {/* Feature 3: See Friends' Favorites */}
        <FeatureIcon label="See Friends' Favorites">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </FeatureIcon>
      </div>
    </div>
  </div>
);
