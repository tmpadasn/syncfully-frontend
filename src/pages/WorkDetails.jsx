import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWork, getWorkRatings, postWorkRating, getSimilarWorks } from '../api/works';
import { getUserRecommendations } from '../api/users';
import WorkCard from '../components/WorkCard';
import Toast from '../components/Toast';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import useAuth from '../hooks/useAuth';
import useShelves from '../hooks/useShelves';
import AddToShelfBtn from '../components/AddToShelfBtn';
import { WorkDetailsSkeleton } from '../components/Skeleton';
import logger from '../utils/logger';
import {
  extractWorkFromResponse,
  extractRatingsFromResponse,
  normalizeWork,
  normalizeWorks,
  normalizeGenres,
} from '../utils/normalize';

/* ===================== HELPER FUNCTIONS ===================== */

const processWorkData = (workResponse) => {
  if (!workResponse) return null;

  const work = extractWorkFromResponse(workResponse);
  if (!work) return null;

  const normalized = normalizeWork(work);
  if (!normalized) return null;

  return {
    ...normalized,
    genres: normalizeGenres(work.genres),
    genre: Array.isArray(normalized.genres) ? normalized.genres.join(', ') : '',
    findAt: work.foundAt || work.foundAt
      ? [
          {
            label: 'External Link',
            url: work.foundAt || normalized.foundAt,
          },
        ]
      : [],
  };
};

const processRatingsData = (ratingsResponse) => {
  return extractRatingsFromResponse(ratingsResponse);
};

const processSimilarWorksData = (similarWorksResponse) => {
  if (!similarWorksResponse || !Array.isArray(similarWorksResponse)) return [];
  return normalizeWorks(similarWorksResponse);
};

/* ===================== WORK DETAILS FUNCTION ===================== */

export default function WorkDetails() {

  // Work details page behavior:
  // Fetches work metadata, rating summaries, and similar/recommended works.
  // Data is normalized via helper functions to keep presentation logic simple
  // and to avoid duplicating extraction/parsing across the component.

  // FETCH HOOKS AND STATES
  useNavigationWithClearFilters();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { shelves } = useShelves(user?.userId);
  const { workId } = useParams();
  const isMountedRef = useRef(true);

  const loggedUserId = user?.userId || null;

  const [work, setWork] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'

  const [ratingSubmittedMessage, setRatingSubmittedMessage] = useState(false);
  const [showRecommendationToast, setShowRecommendationToast] = useState(false);
  const [recommendationVersion, setRecommendationVersion] = useState(null);

  /* ===================== UI STYLES ===================== */
  const styles = {
    /* ===================== PAGE LAYOUT ===================== */
    pageContainer: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '20px 16px',
    },
    gridLayout: {
      display: 'grid',
      gridTemplateColumns: '220px 1fr 260px',
      gap: 24,
      alignItems: 'start',
    },
    leftColumn: {
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    rightColumn: {
      borderLeft: '1px solid #eee',
      paddingLeft: 16,
      minWidth: 240,
      maxWidth: 280,
    },

    /* ===================== MESSAGE BOXES ===================== */
    messageBox: (type) => ({
      padding: '12px 16px',
      marginBottom: 16,
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 500,
      ...(type === 'success' ? {
        border: '1px solid #c3e6cb',
        background: '#d4edda',
        color: '#155724'
      } : {
        border: '1px solid #f5c6cb',
        background: '#f8d7da',
        color: '#721c24'
      })
    }),
    successMessage: {
      background: '#e8f5e9',
      border: '1px solid #81c784',
      color: '#2e7d32',
      padding: '8px 12px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 12,
      textAlign: 'center',
    },

    /* ===================== WORK INFO ===================== */
    workTitle: {
      marginTop: 0,
    },
    workMeta: {
      color: '#666',
    },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 16,
      marginBottom: 24,
    },
    typeTag: {
      padding: '8px 16px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 700,
      background: '#9a4207',
      color: '#fff',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    genreTag: {
      padding: '8px 16px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      background: '#b95716',
      color: '#fff',
      letterSpacing: '0.3px',
    },

    /* ===================== DESCRIPTION SECTION ===================== */
    descriptionSection: {
      marginTop: 28,
      background: 'linear-gradient(to bottom, rgba(154, 66, 7, 0.03), rgba(154, 66, 7, 0.01))',
      borderLeft: '4px solid #9a4207',
      borderRadius: 8,
      padding: '20px 24px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
    },
    descriptionTitle: {
      marginTop: 0,
      marginBottom: 16,
      color: '#9a4207',
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
    },
    descriptionText: {
      fontSize: 15,
      lineHeight: 1.7,
      color: '#333',
      margin: 0,
      whiteSpace: 'pre-wrap',
      textAlign: 'justify',
    },
    descriptionPlaceholder: {
      fontSize: 15,
      lineHeight: 1.7,
      color: '#666',
      margin: 0,
      fontStyle: 'italic',
    },

    /* ===================== RECOMMENDATIONS SECTION ===================== */
    recommendationsSection: {
      marginTop: 24,
    },
    recommendationsDisplay: {
      display: 'flex',
      gap: 12,
      overflowX: 'auto',
      paddingBottom: 8,
      marginTop: 12,
    },
    recommendationCard: {
      minWidth: 140,
    },
    emptyRecommendations: {
      marginTop: 12,
      padding: 16,
      background: '#f5f5f5',
      borderRadius: 8,
    },

    /* ===================== EXTERNAL LINKS ===================== */
    linksContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 16,
    },
    externalLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '14px 20px',
      background: 'linear-gradient(135deg, #9a4207, #b95716)',
      color: 'white',
      textDecoration: 'none',
      borderRadius: 10,
      fontWeight: '700',
      fontSize: 14,
      boxShadow: '0 4px 12px rgba(154, 66, 7, 0.3)',
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      boxSizing: 'border-box',
    },

    /* ===================== RATING SECTION ===================== */
    ratingContainer: {
      marginBottom: 20,
    },
    ratingHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    ratingTitle: {
      margin: 0,
      fontSize: 14,
      fontWeight: 600,
    },
    ratingBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      background: '#e8f5e9',
      padding: '4px 8px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 600,
      color: '#2e7d32',
    },
    starContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 16,
    },
    star: (isGuest, filled) => ({
      background: 'transparent',
      border: 'none',
      padding: '4px',
      margin: 0,
      cursor: isGuest ? 'not-allowed' : 'pointer',
      fontSize: 24,
      lineHeight: 1,
      color: filled ? '#9a4207' : '#888',
      opacity: isGuest ? 0.4 : 1,
      transition: 'color 0.2s ease',
      fontWeight: filled ? 'normal' : 'bold',
      textShadow: filled ? 'none' : '0 0 1px #666',
    }),

    /* ===================== DISTRIBUTION SECTION ===================== */
    distributionContainer: {
      marginBottom: 20,
    },
    distributionTitle: {
      margin: '0 0 12px 0',
      fontSize: 14,
      fontWeight: 600,
    },
    distributionEmpty: {
      fontSize: 13,
      color: '#666',
      margin: 0,
    },
    distributionRows: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    },
    distributionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    distributionLabel: {
      width: 28,
      textAlign: 'right',
      fontSize: 12,
      fontWeight: 500,
    },
    distributionBar: {
      flex: 1,
      background: '#eee',
      height: 20,
      borderRadius: 4,
      overflow: 'hidden',
      minWidth: 100,
      position: 'relative',
    },
    distributionFill: {
      width: (pct) => `${pct}%`,
      height: '100%',
      background: 'linear-gradient(135deg, #9a4207, #b95716)',
      transition: 'width 0.3s ease',
    },
    distributionCount: {
      width: 32,
      textAlign: 'left',
      fontSize: 13,
      fontWeight: 600,
      color: '#333',
    },
    distributionTotal: {
      fontSize: 11,
      color: '#666',
      marginTop: 4,
      textAlign: 'center',
    },
  };

  const loadWorkData = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      // Reset all state immediately to prevent flash of old content
      setWork(null);
      setRatings([]);
      setRecommended([]);
      setScore(0);
      setLoading(true);

      const [workResponse, ratingsResponse, similarWorksResponse] = await Promise.all([
        getWork(workId),
        getWorkRatings(workId),
        getSimilarWorks(workId),
      ]);

      if (!isMountedRef.current) return;

      const processedWork = processWorkData(workResponse);
      setWork(processedWork);

      const processedRatings = processRatingsData(ratingsResponse);
      setRatings(processedRatings);

      const processedSimilarWorks = processSimilarWorksData(similarWorksResponse);

      setRecommended(processedSimilarWorks.slice(0, 5));
    } catch (error) {
      logger.error('Error loading work details:', error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [workId]);

  // Load work details, ratings, and similar works on mount
  useEffect(() => {
    isMountedRef.current = true;
    loadWorkData();

    return () => {
      isMountedRef.current = false;
    };
  }, [loadWorkData]);

  // Fetch initial recommendation version for logged-in users.
  // This lets the UI show which recommendation model/version the backend uses.
  useEffect(() => {
    if (!isGuest && loggedUserId && isMountedRef.current) {
      getUserRecommendations(loggedUserId)
        .then((data) => {
          if (isMountedRef.current && data && data.version) {
            setRecommendationVersion(data.version);
          }
        })
        .catch(() => {
          // Silently fail if recommendations not available
        });
    }
  }, [isGuest, loggedUserId]);

  // Set the score to user's existing rating when ratings load
  useEffect(() => {
    if (!isGuest && ratings.length > 0 && loggedUserId) {
      const userRating = ratings.find((r) => r.userId === loggedUserId);
      if (userRating && isMountedRef.current) {
        setScore(Math.round(Number(userRating.score) || 0));
      }
    }
  }, [ratings, loggedUserId, isGuest]);

  const submitRating = async (overrideScore) => {
    if (isGuest) {
      navigate('/login', {
        state: { message: 'You must log in to rate this work.' },
      });
      return;
    }

    const sendScore = typeof overrideScore === 'number' ? overrideScore : score;

    try {
      setMessage(null);
      await postWorkRating(workId, {
        score: sendScore,
        workId,
        userId: loggedUserId,
        ratedAt: new Date().toISOString(),
      });

      const r = await getWorkRatings(workId);
      const processedRatings = processRatingsData(r);
      setRatings(processedRatings);

      // Show success message briefly
      setRatingSubmittedMessage(true);
      setTimeout(() => setRatingSubmittedMessage(false), 2000);

      // Check if recommendations changed
      if (loggedUserId) {
        try {
          const recommendationsData = await getUserRecommendations(loggedUserId);
          if (recommendationsData && recommendationsData.version) {
            if (recommendationVersion && recommendationsData.version !== recommendationVersion) {
              // Recommendations have changed!
              setShowRecommendationToast(true);
            }
            setRecommendationVersion(recommendationsData.version);
          }
        } catch (error) {
          // Silently fail if recommendations check fails
        }
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || 'Failed to submit rating';
      setMessage(errorMsg);
      setMessageType('error');
    }
  };

  // Rating buckets
  const totalRatings = ratings.length;
  const bucketCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter(
      (r) => Math.round(Number(r.score) || 0) === star
    ).length,
  }));

  // Check if current user has already rated this work
  const userRating = !isGuest && ratings.find((r) => r.userId === loggedUserId);
  const userRatingScore = userRating ? Math.round(Number(userRating.score) || 0) : null;

  if (loading) return <WorkDetailsSkeleton />;
  if (!work) return <p>Work not found.</p>;

  

  // RETURN WORK DETAILS PAGE LAYOUT
  return (
    <div style={styles.pageContainer}>
      {message && (
        <div style={{ ...styles.messageBox(messageType), marginBottom: 20 }}>
          {message}
        </div>
      )}
      <div style={styles.gridLayout}>
        {/* LEFT column */}
        <aside style={styles.leftColumn}>
          <div style={{ marginLeft: -10 }}>
            <WorkCard
              work={work}
              coverStyle={{ width: 180, height: 260 }}
              flat
              hideInfo
            />
          </div>

          <div
            style={{
              marginTop: 12,
              width: 180,
            }}
          >
            {work && work.findAt && work.findAt.length > 0 ? (
              <div style={styles.linksContainer}>
                {work.findAt.map((f, i) => (
                  <a
                    key={i}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.externalLink}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(154, 66, 7, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(154, 66, 7, 0.3)';
                    }}
                  >
                    <span>🔗</span>
                    <span>Find it Here{f.label && f.label !== 'External Link' ? `: ${f.label}` : ''}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p>Available from online stores and libraries.</p>
            )}
          </div>
        </aside>

        {/* MIDDLE column */}
        <main>
          <h1 style={styles.workTitle}>{work.title}</h1>
          <p style={styles.workMeta}>
            {work.creator} • {work.year}
          </p>

          {/* Type and Genres */}
          <div style={styles.tagContainer}>
            {work.type && (
              <span style={styles.typeTag}>
                {String(work.type)}
              </span>
            )}

            {work.genres && Array.isArray(work.genres) && work.genres.map((genre, idx) => (
              <span key={idx} style={styles.genreTag}>
                {genre}
              </span>
            ))}
          </div>

          {/* DESCRIPTION */}
          <section style={styles.descriptionSection}>
            <h3 style={styles.descriptionTitle}>
              Description
            </h3>
            {work.description ? (
              <p style={styles.descriptionText}>
                {work.description}
              </p>
            ) : (
              <p style={styles.descriptionPlaceholder}>
                No description available for this work yet.
              </p>
            )}
          </section>

          {/* YOU MAY ALSO LIKE */}
          <section style={styles.recommendationsSection}>
            <div style={{ display: 'inline-block', width: '100%' }}>
              <h3 className="section-title">YOU MAY ALSO LIKE</h3>
            </div>

            {recommended.length > 0 ? (
              <div style={styles.recommendationsDisplay}>
                {recommended.map((rw) => (
                  <div key={rw.workId} style={styles.recommendationCard}>
                    <Link
                      to={`/works/${rw.workId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <WorkCard
                        work={rw}
                        flat
                        hideInfo
                        coverStyle={{ width: 140, height: 200 }}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyRecommendations}>
                <p>No similar works found for this item.</p>
              </div>
            )}
          </section>
        </main>

        {/* RIGHT column */}
        <aside style={styles.rightColumn}>
          {/* Add to Shelf Button */}
          {!isGuest && shelves.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <AddToShelfBtn
                workId={parseInt(workId)}
                userId={user?.userId}
                shelves={shelves}
                onSuccess={() => {
                }}
              />
            </div>
          )}

          <div style={{ display: 'inline-block', marginBottom: 16 }}>
            <h3 className="section-title">RATINGS</h3>
          </div>

          {/* USER RATING */}
          <div style={styles.ratingContainer}>
            {/* Success message after rating */}
            {ratingSubmittedMessage && (
              <div style={styles.successMessage}>
                ✓ Rating saved!
              </div>
            )}

            <div style={styles.ratingHeader}>
              <h4 style={styles.ratingTitle}>
                Your rating
              </h4>
              {userRatingScore && (
                <div style={styles.ratingBadge}>
                  <span>✓ Rated</span>
                </div>
              )}
            </div>
            <div style={{ ...styles.starContainer, opacity: userRatingScore ? 1 : 0.5 }}>
              {[1, 2, 3, 4, 5].map((i) => {
                const filled = i <= (hoverScore || Math.round(score));
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isGuest}
                    onClick={() => {
                      setScore(i);
                      submitRating(i);
                    }}
                    onMouseEnter={() => setHoverScore(i)}
                    onMouseLeave={() => setHoverScore(0)}
                    aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
                    style={styles.star(isGuest, filled)}
                  >
                    {filled ? '★' : '☆'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DISTRIBUTION */}
          <div style={styles.distributionContainer}>
            <h4 style={styles.distributionTitle}>
              Rating Distribution
            </h4>
            {totalRatings === 0 ? (
              <p style={styles.distributionEmpty}>
                No ratings yet.
              </p>
            ) : (
              <div style={styles.distributionRows}>
                {bucketCounts.map((b) => {
                  const pct = totalRatings
                    ? Math.round((b.count / totalRatings) * 100)
                    : 0;
                  return (
                    <div
                      key={b.star}
                      style={styles.distributionRow}
                    >
                      <div style={styles.distributionLabel}>
                        {b.star}★
                      </div>
                      <div style={styles.distributionBar}>
                        <div
                          style={{...styles.distributionFill, width: `${pct}%`}}
                        />
                      </div>
                      <div style={styles.distributionCount}>
                        {b.count}
                      </div>
                    </div>
                  );
                })}
                <div style={styles.distributionTotal}>
                  {totalRatings} total rating
                  {totalRatings !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>

          {/* Add to shelf actions are in top-right AddToShelfBtn */}
        </aside>
      </div>

      {/* Toast notification for new recommendations */}
      {showRecommendationToast && (
        <Toast
          message="You have new recommendations!"
          onClose={() => setShowRecommendationToast(false)}
          link="/recommendations"
        />
      )}
    </div>
  );
}
