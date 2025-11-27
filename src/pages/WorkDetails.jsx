import React, { useEffect, useState } from 'react';
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

// Helper functions for data processing
const processWorkData = (workResponse) => {
  if (!workResponse) return null;

  let workData = workResponse.data || workResponse;

  let work;
  if (workData.works && workData.works[0]) {
    work = workData.works[0];
  } else if (workData.work) {
    work = workData.work;
  } else {
    work = workData;
  }

  if (!work) return null;

  return {
    ...work,
    workId: work.id || work.workId,
    genres: work.genres || [],
    genre: Array.isArray(work.genres) ? work.genres.join(', ') : work.genre,
    coverUrl: work.coverUrl || '/album_covers/default.jpg',
    findAt: work.foundAt
      ? [
          {
            label: 'External Link',
            url: work.foundAt,
          },
        ]
      : [],
  };
};

const processRatingsData = (ratingsResponse) => {
  if (!ratingsResponse) return [];
  const ratingsData = ratingsResponse.data || ratingsResponse;
  return ratingsData?.ratings || ratingsData || [];
};

const processSimilarWorksData = (similarWorksResponse) => {
  if (!similarWorksResponse || !Array.isArray(similarWorksResponse)) return [];

  return similarWorksResponse
    .map((work) => ({
      workId: work.id || work.workId,
      title: work.title,
      coverUrl: work.coverUrl || '/album_covers/default.jpg',
      type: work.type,
      creator: work.creator,
    }))
    .filter((work) => work.workId && work.title);
};

export default function WorkDetails() {
  useNavigationWithClearFilters();
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { shelves } = useShelves(user?.userId);
  const { workId } = useParams();

  const loggedUserId = user?.userId || null;

  const [work, setWork] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [ratingSubmittedMessage, setRatingSubmittedMessage] = useState(false);
  const [showRecommendationToast, setShowRecommendationToast] = useState(false);
  const [recommendationVersion, setRecommendationVersion] = useState(null);

  useEffect(() => {
    setLoading(true);
    setScore(0); // Reset score when navigating to a new work

    Promise.all([
      getWork(workId),
      getWorkRatings(workId),
      getSimilarWorks(workId),
    ])
      .then(([workResponse, ratingsResponse, similarWorksResponse]) => {
        const processedWork = processWorkData(workResponse);
        setWork(processedWork);

        const processedRatings = processRatingsData(ratingsResponse);
        setRatings(processedRatings);

        const comments = processedRatings
          .filter((rating) => rating.comment)
          .map((rating, index) => ({
            id: `r-${index}`,
            userId: rating.userId,
            body: rating.comment,
            at: rating.ratedAt || rating.createdAt,
          }));
        setComments(comments);

        const processedSimilarWorks = processSimilarWorksData(similarWorksResponse);
        setSimilar(processedSimilarWorks);

        setRecommended(processedSimilarWorks.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, [workId]);

  // Fetch initial recommendation version for logged-in users
  useEffect(() => {
    if (!isGuest && loggedUserId) {
      getUserRecommendations(loggedUserId).then((data) => {
        if (data && data.version) {
          setRecommendationVersion(data.version);
        }
      }).catch(() => {
        // Silently fail if recommendations not available
      });
    }
  }, [isGuest, loggedUserId]);

  // Set the score to user's existing rating when ratings load
  useEffect(() => {
    if (!isGuest && ratings.length > 0 && loggedUserId) {
      const userRating = ratings.find((r) => r.userId === loggedUserId);
      if (userRating) {
        setScore(Math.round(Number(userRating.score) || 0));
      }
    }
  }, [ratings, loggedUserId, isGuest]);

  // ---------- RATING ----------
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
          logger.debug('Could not check recommendations:', error);
        }
      }
    } catch (e) {
      const errorMsg = e.response?.data?.message || e.message || 'Failed to submit rating';
      setMessage(errorMsg);
      setMessageType('error');
    }
  };

  // ---------- COMMENT ----------
  const submitComment = () => {
    if (isGuest) {
      navigate('/login', {
        state: { message: 'You must log in to comment on works.' },
      });
      return;
    }

    if (!newComment.trim()) return;

    const c = {
      id: `c-${Date.now()}`,
      userId: loggedUserId,
      body: newComment.trim(),
      at: new Date().toISOString(),
    };

    setComments((prev) => [c, ...prev]);
    setNewComment('');
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

  const messageBox = (type) => ({
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
  });

  // -------------------------------------------------------------------------
  // RETURN: Your exact layout, untouched, with only login logic integrated
  // -------------------------------------------------------------------------
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
      {message && (
        <div style={{ ...messageBox(messageType), marginBottom: 20 }}>
          {message}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr 260px',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* LEFT column */}
        <aside
          style={{
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
                {work.findAt.map((f, i) => (
                  <a
                    key={i}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
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
                      boxSizing: 'border-box'
                    }}
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
          <h1 style={{ marginTop: 0 }}>{work.title}</h1>
          <p style={{ color: '#666' }}>
            {work.creator} • {work.year}
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {work.type && (
              <span
                style={{
                  padding: '6px 10px',
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 700,
                  background: '#0b6623',
                  color: '#fff',
                }}
              >
                {String(work.type).toUpperCase()}
              </span>
            )}

            {work.genre && (
              <span
                style={{
                  padding: '6px 10px',
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 700,
                  background: '#0b6623',
                  color: '#fff',
                }}
              >
                {String(work.genre).toUpperCase()}
              </span>
            )}
          </div>

          {/* COMMENTS */}
          <section style={{ marginTop: 20 }}>
            <h3>COMMENTS</h3>
            <div style={{ marginBottom: 8 }}>
              <textarea
                value={newComment}
                disabled={isGuest}
                placeholder={isGuest ? 'Log in to comment' : ''}
                onChange={(e) => setNewComment(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  height: 64,
                  fontSize: 15,
                  padding: 8,
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  opacity: isGuest ? 0.6 : 1,
                }}
              />
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <button
                  disabled={isGuest}
                  onClick={submitComment}
                >
                  Add comment
                </button>
              </div>
            </div>

            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              <div>
                {comments.map((c) => (
                  <div key={c.id} style={{ padding: '10px 0' }}>
                    <div style={{ fontSize: 13, color: '#666' }}>
                      User {c.userId} • {new Date(c.at).toLocaleString()}
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 15,
                        lineHeight: 1.4,
                      }}
                    >
                      {c.body}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* YOU MAY ALSO LIKE */}
          <section style={{ marginTop: 24 }}>
            <div style={{ display: 'inline-block', width: '100%' }}>
              <h3 className="section-title">YOU MAY ALSO LIKE</h3>
            </div>

            {recommended.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  overflowX: 'auto',
                  paddingBottom: 8,
                  marginTop: 12,
                }}
              >
                {recommended.map((rw) => (
                  <div key={rw.workId} style={{ minWidth: 140 }}>
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
              <div
                style={{
                  marginTop: 12,
                  padding: 16,
                  background: '#f5f5f5',
                  borderRadius: 8,
                }}
              >
                <p>No similar works found for this item.</p>
              </div>
            )}
          </section>
        </main>

        {/* RIGHT column */}
        <aside
          style={{
            borderLeft: '1px solid #eee',
            paddingLeft: 16,
            minWidth: 240,
            maxWidth: 280,
          }}
        >
          {/* Add to Shelf Button */}
          {!isGuest && shelves.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <AddToShelfBtn 
                workId={parseInt(workId)} 
                userId={user?.userId}
                shelves={shelves}
                onSuccess={() => {
                  // Optional: Refresh or show confirmation
                }}
              />
            </div>
          )}

          <div style={{ display: 'inline-block', marginBottom: 16 }}>
            <h3 className="section-title">RATINGS</h3>
          </div>

          {/* USER RATING */}
          <div style={{ marginBottom: 20 }}>
            {/* Success message after rating */}
            {ratingSubmittedMessage && (
              <div
                style={{
                  background: '#e8f5e9',
                  border: '1px solid #81c784',
                  color: '#2e7d32',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 12,
                  textAlign: 'center',
                }}
              >
                ✓ Rating saved!
              </div>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                Your rating
              </h4>
              {userRatingScore && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#e8f5e9',
                    padding: '4px 8px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#2e7d32',
                  }}
                >
                  <span>✓ Rated</span>
                </div>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginBottom: 16,
                opacity: userRatingScore ? 1 : 0.5,
              }}
            >
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
                    style={{
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
                    }}
                  >
                    {filled ? '★' : '☆'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DISTRIBUTION */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 600 }}>
              Rating Distribution
            </h4>
            {totalRatings === 0 ? (
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                No ratings yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {bucketCounts.map((b) => {
                  const pct = totalRatings
                    ? Math.round((b.count / totalRatings) * 100)
                    : 0;
                  return (
                    <div
                      key={b.star}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          textAlign: 'right',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {b.star}★
                      </div>
                      <div
                        style={{
                          flex: 1,
                          background: '#eee',
                          height: 20,
                          borderRadius: 4,
                          overflow: 'hidden',
                          minWidth: 100,
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: 'linear-gradient(135deg, #9a4207, #b95716)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                      <div
                        style={{
                          width: 32,
                          textAlign: 'left',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#333',
                        }}
                      >
                        {b.count}
                      </div>
                    </div>
                  );
                })}
                <div
                  style={{
                    fontSize: 11,
                    color: '#666',
                    marginTop: 4,
                    textAlign: 'center',
                  }}
                >
                  {totalRatings} total rating
                  {totalRatings !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>

          {/* Add to shelf actions moved to top-right AddToShelfBtn - old/localStorage button removed */}
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
