import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getWork, getWorkRatings, postWorkRating, getSimilarWorks } from '../api/works';
import WorkCard from '../components/WorkCard';
import useNavigationWithClearFilters from '../hooks/useNavigationWithClearFilters';
import useAuth from '../hooks/useAuth';

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
  const { workId } = useParams();

  const loggedUserId = user?.userId || null;

  const [work, setWork] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [score, setScore] = useState(4);
  const [hoverScore, setHoverScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setLoading(true);

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
      await postWorkRating(workId, {
        score: sendScore,
        workId,
        userId: loggedUserId,
        ratedAt: new Date().toISOString(),
      });

      const r = await getWorkRatings(workId);
      setRatings(r.ratings || []);
      alert('Rating submitted');
    } catch (e) {
      console.error('Failed to submit rating:', e);
      alert('Failed to submit rating');
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

  const addToShelf = () => {
    const shelf = JSON.parse(localStorage.getItem('shelves') || '[]');
    shelf.push({ workId: work.workId, title: work.title });
    localStorage.setItem('shelves', JSON.stringify(shelf));
    alert('Added to shelf');
  };

  // Rating buckets
  const totalRatings = ratings.length;
  const bucketCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter(
      (r) => Math.round(Number(r.score) || 0) === star
    ).length,
  }));

  if (loading) return <p>Loading work...</p>;
  if (!work) return <p>Work not found.</p>;

  // -------------------------------------------------------------------------
  // RETURN: Your exact layout, untouched, with only login logic integrated
  // -------------------------------------------------------------------------
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 16px' }}>
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'inline-block' }}>
              <h3 className="section-title">WHERE TO FIND</h3>
            </div>

            {work && work.findAt && work.findAt.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                {work.findAt.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      justifyContent: 'center',
                    }}
                  >
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ color: '#111' }}>
                        {f.label || f.url}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
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
          <div style={{ display: 'inline-block', marginBottom: 16 }}>
            <h3 className="section-title">RATINGS</h3>
          </div>

          {/* USER RATING */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 600 }}>
              Your rating
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginBottom: 16,
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
                      color: filled ? '#f5b301' : '#ccc',
                      opacity: isGuest ? 0.4 : 1,
                      transition: 'color 0.2s ease',
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
                          height: 8,
                          borderRadius: 4,
                          overflow: 'hidden',
                          minWidth: 100,
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: '#bfaea0',
                            transition: 'width 0.3s ease',
                          }}
                        />
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

          {/* ADD TO SHELF */}
          <div>
            <button
              disabled={isGuest}
              onClick={() => {
                if (isGuest) {
                  navigate('/login', {
                    state: { message: 'You must log in to save works to your shelf.' },
                  });
                  return;
                }
                addToShelf();
              }}
              style={{
                background: isGuest ? '#0b662380' : '#0b6623', // faded when guest
                color: '#fff',
                padding: '12px 20px',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 13,
                cursor: isGuest ? 'not-allowed' : 'pointer',
                width: '100%',
                opacity: isGuest ? 0.5 : 1,
                transition: 'background-color 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
              onMouseEnter={(e) => {
                if (!isGuest) e.currentTarget.style.backgroundColor = '#0d7225';
              }}
              onMouseLeave={(e) => {
                if (!isGuest) e.currentTarget.style.backgroundColor = '#0b6623';
              }}
            >
              {isGuest ? 'Login to Add to Shelf' : 'Add to Shelf'}
            </button>

          </div>
        </aside>
      </div>
    </div>
  );
}
