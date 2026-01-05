/**
 * SearchResults Page - Styles Object
 * Centralized styles for all SearchResults components
 * Organized by functional sections (page layout, banner, grid, cards, etc.)
 *
 * Usage: Import and pass to components via props
 *   import { searchResultsStyles } from '../styles/searchResults.styles'
 *   <Component style={searchResultsStyles.componentName} />
 */

/*
 * SearchResults Page - UI Styles
 * Extracted styles for the Search Results page component
 */

export const searchResultsStyles = {
  /* ===================== PAGE LAYOUT ===================== */
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  pageInner: {
    flex: 1,
  },
  pageMain: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    padding: '20px 16px',
  },

  /* ===================== BANNER SECTION ===================== */
  bannerContainer: {
    position: 'fixed',
    right: 20,
    top: 100,
    width: 320,
    background: '#9a4207',
    padding: '16px',
    zIndex: 1000,
    boxSizing: 'border-box',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  bannerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    color: 'white',
  },
  bannerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  bannerCloseBtn: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s ease',
  },

  /* ===================== PAGE TITLE SECTION ===================== */
  titleContainer: {
    marginBottom: 24,
  },
  titleBox: {
    padding: '12px 16px',
    backgroundColor: '#f8f5f0',
    borderLeft: '4px solid #d4b895',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 13,
    fontWeight: 600,
    color: '#666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  /* ===================== LOADING & EMPTY STATE ===================== */
  loadingContainer: {
    marginTop: 24,
  },
  emptyMessage: {
    textAlign: 'center',
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },

  /* ===================== RESULTS SECTIONS ===================== */
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  worksSection: {
    marginBottom: 40,
  },
  usersSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#392c2cff',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '2px solid #bfaea0',
    letterSpacing: 0.5,
  },
  itemsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  /* ===================== WORK ITEM ===================== */
  workItem: {
    width: '100%',
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    position: 'relative',
  },
  coverImage: {
    width: 120,
    height: 170,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  coverImageInner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  /* ===================== ACTION BUTTONS ===================== */
  heartButton: (isProcessing) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: 'none',
    background: '#9a4207c8',
    color: 'white',
    cursor: isProcessing ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease',
    zIndex: 10,
    opacity: isProcessing ? 0.6 : 1,
  }),
  checkButton: (isProcessing) => ({
    position: 'absolute',
    top: 8,
    right: 52,
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: 'none',
    background: '#4caf50',
    color: 'white',
    cursor: isProcessing ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease',
    zIndex: 10,
    opacity: isProcessing ? 0.6 : 1,
  }),

  /* ===================== WORK INFO ===================== */
  workInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  workTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    color: '#392c2c',
  },
  workMeta: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  },
  workCreator: {
    margin: 0,
    color: '#666',
    fontSize: 14,
  },
  workYear: {
    margin: 0,
    color: '#888',
    fontSize: 12,
  },
  workDescription: {
    margin: 0,
    color: '#555',
    fontSize: 13,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  ratingInfo: {
    fontSize: 13,
    color: '#666',
    fontWeight: 500,
  },

  /* ===================== USER ITEM ===================== */
  userItem: {
    display: 'flex',
    gap: 16,
    alignItems: 'center',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f2f2f2',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    flexShrink: 0,
  },
  userAvatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  userInfo: {
    flex: 1,
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  userName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-block',
    width: 'fit-content',
  },
  userDetails: {
    display: 'flex',
    gap: 16,
    alignItems: 'baseline',
  },
  userEmail: {
    margin: 0,
    color: '#666',
    fontSize: 14,
  },
  userRatings: {
    margin: 0,
    color: '#888',
    fontSize: 12,
  },
  userLabel: {
    margin: 0,
    color: '#888',
    fontSize: 13,
  },

  /* ===================== DIVIDERS ===================== */
  divider: {
    marginTop: 22,
    borderBottom: '2px solid #9a420776',
    paddingBottom: 6,
    marginBottom: 12,
  },
};
